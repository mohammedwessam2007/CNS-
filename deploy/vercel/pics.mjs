// Build-time picture bundler (v15.1): every exact picture term used by the LEARN notes gets a real,
// freely licensed image downloaded INTO the deployment (dist/pics/*), so the app shows it instantly,
// offline, with no link to press. Selection = the same rules as the in-app engine:
//   Wikipedia article for the exact term → its own images ranked by caption/file-name match
//   (lead image bonus, junk/pathology penalties, subject hint) → only files that exist on Wikimedia
//   Commons (free licence), shown with licence + author → else Commons files titled with the term.
// Fail-soft: any term that cannot be fetched is listed as missing and the app falls back to its
// live lookup; the build never fails because of pictures.
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import vm from "node:vm";

const UA = "IntellectualityCNS/15.1 (educational build; https://intellectuality-cns.vercel.app)";
const STOP = new Set("the of and a an to in is are by for with from on at as or its it this that which be into than".split(" "));
const GENERIC = new Set(["human", "anatomy", "system", "physiology", "histology", "neuroanatomy"]);
const JUNK = /(logo|icon|flag|coat of arms|signature|portrait|stamp|wiktionary|wikibooks|commons-logo|question book|edit-clear|ambox|symbol|padlock|disambig|nuvola|crystal clear|gnome|stub|map of|locator|audio|speaker)/i;
const PATHO = /(tumou?r|carcinoma|cancer|lesion|patholog|disease|syndrome|injur|hemorrhage|haemorrhage|infarct|abscess|fracture|surgery|surgical|autopsy|x-ray of patient)/i;
const OKMIME = /^image\/(jpeg|png|svg\+xml|webp|gif|tiff)$/;
const norm = (s) => String(s || "").toLowerCase().replace(/fibre/g, "fiber").replace(/[^a-z0-9]+/g, " ").trim();
const stem = (w) => (w.length > 4 ? w.replace(/ies$/, "y").replace(/(ae|es|s|um|us|on|a|i|e)$/, "") : w).slice(0, 7);
const toks = (t) => norm(t).split(" ").filter((w) => w.length > 2 && !STOP.has(w)).map(stem);

// Same key the app derives from an upload.wikimedia.org URL: file name, underscores, first letter upper.
export const fileKey = (t) => {
  let k = String(t || "").replace(/^File:/i, "");
  try { k = decodeURIComponent(k); } catch (_) {}
  k = k.replace(/ /g, "_");
  return k.charAt(0).toUpperCase() + k.slice(1);
};
// Explicit Commons file names in the v9 and v14 visual registries (primer/topic pictures).
export function collectRegistryFiles(sources) {
  const out = new Set();
  for (const s of sources) for (const m of s.matchAll(/["']((?:File:)?[^"'\n]{3,160}?\.(?:jpe?g|png|svg|gif|tiff?|webp))["']/gi)) if (!/^https?:|^\/|\+/.test(m[1])) out.add("File:" + m[1].replace(/^File:/i, "").replace(/_/g, " "));
  return [...out];
}

export function collectTerms(noteSources) {
  // Evaluate the notes files in a sandbox with a fake window; collect term → {focus words, subject}.
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const src of noteSources) vm.runInContext(src, ctx);
  const chapters = ctx.window.INTELLECTUALITY_LEARN_NOTES?.chapters || [];
  const terms = new Map();
  const add = (t, focus, subject) => {
    if (!t) return;
    const e = terms.get(t) || { term: t, focus: new Set(), subject };
    for (const w of toks(focus)) e.focus.add(w);
    terms.set(t, e);
  };
  for (const ch of chapters) {
    for (const t of ch.pic || []) add(t, ch.chapter, ch.subject);
    for (const s of ch.s || []) for (const t of s.pic || []) add(t, s.h, ch.subject);
  }
  return [...terms.values()];
}

function scoreFile(file, caption, lead, want, subject, clinical) {
  if (JUNK.test(file)) return -99;
  const ft = new Set(toks(file.replace(/^File:/, "").replace(/\.\w+$/, "") + " " + caption));
  let s = lead ? 2 : 0,
    hit = 0;
  for (const w of want) if (ft.has(w)) hit++;
  s += hit * 1.5 + (want.length && hit === want.length ? 3 : 0);
  const t = (file + " " + caption).toLowerCase();
  if (!clinical && PATHO.test(t)) s -= 3;
  if (/gray\d|gray's|labell?ed|diagram|schema|illustration|\.svg$/.test(t)) s += 0.7;
  if (subject === "HISTOLOGY" && /micrograph|histolog|h&e|\bhe\b|stain|magnif|section/.test(t)) s += 1.5;
  if (/\.(gif|webm|ogv|ogg|mid)$/i.test(file)) s -= 2;
  return s;
}

export async function bundlePictures({ outDir, noteSources, registrySources = [], cacheDir = null, fetchImpl = fetch, bases = {}, maxMinutes = 7, graceMs = 60e3, maxMB = 160, concurrency = 6, log = console.log }) {
  const WP = (bases.wp || "https://en.wikipedia.org/w/api.php") + "?format=json&formatversion=2&";
  const WREST = (bases.wrest || "https://en.wikipedia.org/api/rest_v1/page/media-list/");
  const CAPI = (bases.commons || "https://commons.wikimedia.org/w/api.php") + "?format=json&";
  const t0 = Date.now(),
    deadline = t0 + maxMinutes * 60e3;
  const terms = collectTerms(noteSources);
  const picsDir = new URL("pics/", outDir);
  await mkdir(picsDir, { recursive: true });
  // Decision cache (kept by Vercel between builds): a term whose notes context is unchanged reuses
  // its chosen file for 14 days, so repeat builds ask Wikimedia almost nothing.
  const DEC_TTL = 14 * 864e5;
  let decisions = {};
  if (cacheDir)
    try {
      decisions = JSON.parse(await readFile(new URL("decisions.json", cacheDir), "utf8")) || {};
    } catch (_) {}
  const fkey = (e) => e.subject + "|" + [...e.focus].sort().join(" ");
  const decide = (k, fk, x) => (decisions[k] = { at: Date.now(), fk, ...(x || {}) });
  const freshDecision = (k, fk) => {
    const d = decisions[k];
    return d && d.meta && d.fk === fk && Date.now() - d.at < DEC_TTL ? d : null;
  };
  let fromCache = 0;
  let netFails = 0,
    netOk = 0,
    tripped = false;
  async function get(url, as = "json") {
    if (tripped) throw new Error("breaker");
    if (Date.now() > deadline + Math.min(45e3, graceMs)) throw new Error("deadline");
    for (let attempt = 0; attempt < 2; attempt++) {
      const ac = new AbortController(),
        t = setTimeout(() => ac.abort(), 12000);
      try {
        const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA }, signal: ac.signal });
        if (r.status === 429 || r.status >= 500) {
          const ra = Math.min(8, +r.headers.get("retry-after") || 0);
          if (ra) await new Promise((res) => setTimeout(res, ra * 1000));
          throw new Error("http_" + r.status);
        }
        if (!r.ok) {
          // a proxy that refuses everything answers 403 to all: trip once nothing has succeeded
          if (netOk === 0 && ++netFails >= 12) tripped = true;
          return null;
        }
        netOk++;
        return as === "json" ? await r.json() : { type: r.headers.get("content-type") || "", buf: Buffer.from(await r.arrayBuffer()) };
      } catch (e) {
        netFails++;
        // a network that refuses everything (e.g. a sandbox) should not keep the build waiting
        if (netOk === 0 && netFails >= 12) tripped = true;
        if (tripped) throw e;
        await new Promise((res) => setTimeout(res, 1500 * (attempt + 1)));
      } finally {
        clearTimeout(t);
      }
    }
    throw new Error("unreachable: " + url.slice(0, 80));
  }
  async function article(title) {
    const j = await get(WP + "action=query&redirects=1&prop=pageimages&piprop=name&titles=" + encodeURIComponent(title));
    const p = (j?.query?.pages || [])[0] || {};
    return p.missing || p.invalid || !p.title ? null : { title: p.title, lead: p.pageimage ? "File:" + p.pageimage.replace(/_/g, " ") : "" };
  }
  async function searchArticle(term) {
    const j = await get(WP + "action=query&list=search&srnamespace=0&srlimit=5&srsearch=" + encodeURIComponent(term));
    const want = toks(term).filter((w) => !GENERIC.has(w));
    for (const x of j?.query?.search || []) {
      const tt = toks(x.title).filter((w) => !GENERIC.has(w));
      if (tt.length && tt.every((w) => want.includes(w))) return article(x.title);
    }
    return null;
  }
  async function commonsInfo(files) {
    const j = await get(CAPI + "action=query&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiextmetadatafilter=LicenseShortName|Artist|ImageDescription&iiurlwidth=960&titles=" + encodeURIComponent(files.join("|")));
    const byTitle = {};
    const strip = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    for (const p of Object.values(j?.query?.pages || {})) {
      const ii = p.imageinfo?.[0];
      if (!ii || "missing" in p || !ii.thumburl) continue;
      const em = ii.extmetadata || {};
      byTitle[p.title] = { title: p.title, thumb: ii.thumburl, page: ii.descriptionurl, mime: ii.mime, w: ii.width, h: ii.height, license: strip(em.LicenseShortName?.value), artist: strip(em.Artist?.value).slice(0, 80), desc: strip(em.ImageDescription?.value).slice(0, 240) };
    }
    // normalized titles come back in j.query.normalized
    for (const n of j?.query?.normalized || []) if (byTitle[n.to]) byTitle[n.from] = byTitle[n.to];
    return byTitle;
  }
  async function pick(e) {
    const want = [...new Set([...toks(e.term), ...e.focus])].filter((w) => !GENERIC.has(w)),
      clinical = /lesion|palsy|syndrome|injur|hydroceph|glaucoma|cataract|aphasia|hemiballism|parkinson|huntington|neuropathy|tabes|syringomyelia|torticollis|spina bifida|meningocele|cleft|hyperalgesia|hydrocephalus/i.test(e.term);
    let art = await article(e.term);
    if (!art) art = await searchArticle(e.term);
    const cands = [];
    if (art) {
      const ml = await get(WREST + encodeURIComponent(art.title.replace(/ /g, "_")));
      for (const it of (ml?.items || []).filter((x) => x.type === "image" && x.title).slice(0, 40)) {
        const f = it.title.replace(/_/g, " "), cap = String(it.caption?.text || "").slice(0, 300);
        cands.push({ file: f, cap, s: scoreFile(f, cap, !!it.leadImage, want, e.subject, clinical), via: "Wikipedia · " + art.title });
      }
      if (!cands.length) {
        // media-list unavailable: the article's own file list (no captions)
        const j = await get(WP + "action=query&prop=images&imlimit=60&titles=" + encodeURIComponent(art.title));
        for (const im of j?.query?.pages?.[0]?.images || []) cands.push({ file: im.title, cap: "", s: scoreFile(im.title, "", im.title === art.lead, want, e.subject, clinical), via: "Wikipedia · " + art.title });
      }
      if (art.lead && !cands.some((c) => c.file === art.lead)) cands.push({ file: art.lead, cap: "", s: scoreFile(art.lead, "", true, want, e.subject, clinical), via: "Wikipedia · " + art.title });
    }
    cands.sort((a, b) => b.s - a.s);
    let top = cands.filter((c) => c.s >= 1).slice(0, 6);
    let info = top.length ? await commonsInfo(top.map((c) => c.file)) : {};
    let chosen = top.find((c) => info[c.file] && OKMIME.test(info[c.file].mime) && Math.min(info[c.file].w, info[c.file].h) >= 180);
    if (!chosen) {
      // Commons files titled with the exact term
      const j = await get(CAPI + "action=query&list=search&srnamespace=6&srlimit=10&srsearch=" + encodeURIComponent('intitle:"' + e.term.replace(/\s*\([^)]*\)/g, "").replace(/"/g, "") + '"'));
      const files = (j?.query?.search || []).map((x) => x.title).filter((f) => !JUNK.test(f) && !(PATHO.test(f) && !clinical));
      if (files.length) {
        info = await commonsInfo(files.slice(0, 8));
        const ranked = files.map((f) => ({ file: f, cap: "", s: scoreFile(f, "", false, want, e.subject, clinical), via: "Wikimedia Commons · exact title" })).sort((a, b) => b.s - a.s);
        chosen = ranked.find((c) => info[c.file] && OKMIME.test(info[c.file].mime) && Math.min(info[c.file].w, info[c.file].h) >= 180);
      }
    }
    if (!chosen) return null; // "nothing found" is not cached: it is re-asked next build
    const meta = info[chosen.file];
    return finish(decide(e.term, fkey(e), { meta, cap: String(chosen.cap || meta.desc || "").slice(0, 200), via: chosen.via, score: +chosen.s.toFixed(1) }));
  }
  async function finish(d) {
    const f = await download(d.meta);
    if (!f) return null;
    return { src: f.src, title: d.meta.title, license: d.meta.license, artist: d.meta.artist, caption: d.cap, via: d.via, score: d.score };
  }
  // One download per Commons file, shared by every term/registry entry that uses it.
  const files = {},
    dl = new Map();
  let bytes = 0;
  function download(meta) {
    const k = fileKey(meta.title);
    if (!dl.has(k))
      dl.set(k, (async () => {
        if (bytes > maxMB * 1048576) return null;
        // build cache (kept by Vercel between builds): same thumbnail URL → same bytes, no re-download
        const ck = cacheDir && createHash("sha1").update(meta.thumb).digest("hex");
        let img = null;
        if (ck) try { const c = JSON.parse(await readFile(new URL(ck + ".json", cacheDir), "utf8")); img = { type: c.type, buf: await readFile(new URL(ck + ".bin", cacheDir)) }; } catch (_) {}
        if (!img) {
          img = await get(meta.thumb, "bin");
          if (ck && img) try { await mkdir(cacheDir, { recursive: true }); await writeFile(new URL(ck + ".bin", cacheDir), img.buf); await writeFile(new URL(ck + ".json", cacheDir), JSON.stringify({ type: img.type })); } catch (_) {}
        }
        if (!img || !/^image\//.test(img.type) || img.buf.length < 2000) return null;
        const ext = /png/.test(img.type) ? "png" : /webp/.test(img.type) ? "webp" : /gif/.test(img.type) ? "gif" : /svg/.test(img.type) ? "svg" : "jpg";
        const name = createHash("sha1").update(k).digest("hex").slice(0, 14) + "." + ext;
        await writeFile(new URL(name, picsDir), img.buf);
        bytes += img.buf.length;
        files[k] = { src: "/pics/" + name, title: meta.title, license: meta.license, artist: meta.artist, w: meta.w, h: meta.h };
        return files[k];
      })().catch(() => null));
    return dl.get(k);
  }
  const out = {},
    missing = [];
  let i = 0;
  async function worker() {
    while (i < terms.length) {
      const e = terms[i++];
      if (tripped || Date.now() > deadline) {
        missing.push(e.term);
        continue;
      }
      try {
        const d = freshDecision(e.term, fkey(e));
        if (d) fromCache++;
        const r = d ? await finish(d) : await pick(e);
        if (i % 50 === 0) log("[pics] progress " + i + "/" + terms.length + " · " + Object.keys(out).length + " bundled · " + Math.round((Date.now() - t0) / 1000) + " s");
        if (r) {
          out[e.term] = r;
          log("[pics] " + e.term + " → " + r.title + " · " + (r.license || "?") + " · " + r.via + " · s=" + r.score);
        } else {
          missing.push(e.term);
          log("[pics] " + e.term + " → (no free picture found)");
        }
      } catch (err) {
        missing.push(e.term);
      }
    }
  }
  // Watchdog: whatever is still in flight at the hard stop is left out; the build never waits longer.
  let stopped = false;
  const hardStop = (ms) =>
    new Promise((res) => {
      const t = setTimeout(() => ((stopped = true), res()), Math.max(0, ms));
      t.unref?.();
    });
  const stopAt = t0 + maxMinutes * 60e3 + graceMs;
  await Promise.race([Promise.all(Array.from({ length: concurrency }, worker)), hardStop(stopAt - Date.now())]);
  // Registry files (the fixed topic pictures of v9/v14): same Commons check, 40 titles per request.
  const reg = collectRegistryFiles(registrySources);
  let regOk = 0;
  await Promise.race([bundleRegistry(), hardStop(stopAt - Date.now())]);
  async function bundleRegistry() {
  const regCached = reg.map((t) => freshDecision("file:" + t, "registry")).filter(Boolean);
  for (let j = 0; j < regCached.length; j += concurrency) regOk += (await Promise.all(regCached.slice(j, j + concurrency).map((d) => download(d.meta)))).filter(Boolean).length;
  const regTodo = reg.filter((t) => !freshDecision("file:" + t, "registry"));
  for (let k = 0; k < regTodo.length && !tripped && Date.now() < deadline; k += 40) {
    try {
      const batch = regTodo.slice(k, k + 40),
        info = await commonsInfo(batch);
      for (const t of batch) if (info[t] && OKMIME.test(info[t].mime)) decide("file:" + t, "registry", { meta: info[t] });
      const metas = [...new Set(Object.values(info))].filter((m) => OKMIME.test(m.mime));
      for (let j = 0; j < metas.length; j += concurrency) regOk += (await Promise.all(metas.slice(j, j + concurrency).map(download))).filter(Boolean).length;
    } catch (_) {}
  }
  }
  if (cacheDir)
    try {
      await mkdir(cacheDir, { recursive: true });
      await writeFile(new URL("decisions.json", cacheDir), JSON.stringify(decisions));
    } catch (_) {}
  missing.splice(0, missing.length, ...terms.filter((e) => !out[e.term]).map((e) => e.term));
  const manifest = { version: "15.1", builtAt: new Date().toISOString(), terms: out, files, missing, stats: { terms: terms.length, bundled: Object.keys(out).length, fromCache, missing: missing.length, registryFiles: reg.length, registryBundled: regOk, images: Object.keys(files).length, megabytes: +(bytes / 1048576).toFixed(1), seconds: Math.round((Date.now() - t0) / 1000), networkTripped: tripped, watchdogStopped: stopped } };
  await writeFile(new URL("manifest.json", picsDir), JSON.stringify(manifest));
  await writeFile(new URL("manifest.js", picsDir), "window.INTELLECTUALITY_PICS=" + JSON.stringify({ terms: out, files, stats: manifest.stats }) + ";\n");
  log("[pics] bundled " + manifest.stats.bundled + "/" + terms.length + " terms + " + regOk + "/" + reg.length + " registry files = " + manifest.stats.images + " images, " + manifest.stats.megabytes + " MB, " + manifest.stats.seconds + " s" + (tripped ? " (network unreachable: app falls back to live lookup)" : ""));
  if (missing.length) log("[pics] missing " + missing.length + ": " + missing.slice(0, 40).join(" | ") + (missing.length > 40 ? " | …" : ""));
  return manifest;
}

export async function readNoteSources(srcDir) {
  const names = ["learn-notes-anat-v15.js", "learn-notes-phys-v15.js", "learn-notes-hist-v15.js"];
  return Promise.all(names.map((n) => readFile(new URL(n, srcDir), "utf8")));
}
