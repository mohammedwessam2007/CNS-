// RENAISSANCE · WORLD HARVESTER · Node job (v0.1 vertical slice)
//
//   node tools/harvester/harvest.mjs --live [--target natural-selection] [--delay 1200] [--out source/public/harvest]
//
// What it does, in the order of the Constitution's slice (section 53):
//   1 selects one lawful source ecosystem (Wikimedia: Wikipedia + Wikisource, via the public MediaWiki API)
//   2 discovers candidate materials for a target CAPABILITY      3 records metadata and provenance
//   4 classifies the source type                                  5 extracts capability donors (Reader OS compile)
//   6 ranks them in a source tournament                           7 hands the winners to Reader OS (as packs the app digests)
//   8 compiles one candidate experience                           9 runs the quality gates
//  10 exposes it for the sandbox Campus track (index.json)       11 leaves evidence gathering to Reader's retrieval in the app
//
// It refuses to run without --live, so test fixtures can never be written into the shipped harvest folder by accident.
// Etiquette: an identifying User-Agent, maxlag, one request at a time with a pause, back-off on 429/maxlag, no scraping around the API.
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const H = require("../../source/public/renaissance-harvest.js");
const loadReader = require("./reader_host.cjs");
const here = dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "RenaissanceHarvester/0.1 (private learning project; https://github.com/mohammedwessam2007/CNS-; one reader, low volume)";

/* ───────── Wikimedia adapter ───────── */
export function createWikimedia({ fetchImpl = globalThis.fetch, delayMs = 1200, now = () => new Date().toISOString(), log = () => {} } = {}) {
  const licenseOf = new Map();
  let last = 0;
  async function api(host, params) {
    const wait = last + delayMs - Date.now();
    if (wait > 0) await sleep(wait);
    const q = new URLSearchParams(Object.assign({ format: "json", formatversion: "2", maxlag: "5" }, params));
    const url = "https://" + host + "/w/api.php?" + q;
    for (let attempt = 0; attempt < 3; attempt++) {
      last = Date.now();
      const res = await fetchImpl(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA, Accept: "application/json" } });
      if (res.status === 429 || res.status === 503) {
        const ra = Math.min(30, Number(res.headers && res.headers.get && res.headers.get("retry-after")) || 5 * (attempt + 1));
        log("backing off " + ra + "s (" + res.status + ")");
        await sleep(ra * 1000 * (delayMs ? 1 : 0));
        continue;
      }
      if (!res.ok) throw new Error(host + " answered HTTP " + res.status);
      const j = await res.json();
      if (j.error && j.error.code === "maxlag") { await sleep(5000 * (delayMs ? 1 : 0)); continue; }
      if (j.error) throw new Error(host + " API error: " + j.error.code);
      return j;
    }
    throw new Error(host + " stayed rate-limited; stopping this cycle instead of pressing on");
  }
  async function license(host) {
    if (!licenseOf.has(host)) {
      const j = await api(host, { action: "query", meta: "siteinfo", siprop: "rightsinfo" });
      const r = (j.query && j.query.rightsinfo) || {};
      licenseOf.set(host, H.normLicense(r.text, r.url));
    }
    return licenseOf.get(host);
  }
  return {
    async discover(host, kind, query, limit = 8) {
      const j = await api(host, { action: "query", list: "search", srsearch: query, srlimit: String(limit), srnamespace: "0", srprop: "" });
      return ((j.query && j.query.search) || []).map((h) => ({ id: "wm:" + host + ":" + h.pageid, host, kind, title: h.title, pageid: h.pageid, discoveredBy: query }));
    },
    async fetchCandidate(c) {
      const j = await api(c.host, {
        action: "query", titles: c.title, redirects: "1", prop: "extracts|info|extlinks|categories|revisions", explaintext: "1", exsectionformat: "wiki",
        inprop: "url", ellimit: "max", cllimit: "max", clcategories: "Category:Featured articles|Category:Good articles", rvprop: "ids|timestamp", rvslots: "main",
      });
      const p = j.query && j.query.pages && j.query.pages[0];
      if (!p || p.missing || !p.extract) return null;
      const rev = p.revisions && p.revisions[0], lic = await license(c.host), t = now();
      const badge = (p.categories || []).some((x) => /Featured articles/.test(x.title)) ? "featured" : (p.categories || []).some((x) => /Good articles/.test(x.title)) ? "good" : null;
      const text = H.normalize(stripTail(p.extract).replace(/^=+\s*(.+?)\s*=+\s*$/gm, "\n$1\n")); // headings become their own short paragraph, so they never glue onto a claim
      const url = "https://" + c.host + "/w/index.php?title=" + encodeURIComponent(p.title.replace(/ /g, "_")) + "&oldid=" + (rev && rev.revid);
      return {
        id: c.id, title: p.title, kind: c.kind, host: c.host, url, revision: rev && rev.revid, retrievedAt: t, language: c.host.split(".")[0], license: lic,
        attribution: lic.attribution ? "“" + p.title + "”, " + (c.host.includes("wikisource") ? "Wikisource" : "Wikipedia") + " contributors, revision " + (rev && rev.revid) + ", " + lic.id : null,
        text, discoveredBy: c.discoveredBy,
        meta: { headings: (p.extract.match(/^==[^=].*==\s*$/gm) || []).length, extlinks: (p.extlinks || []).length, badge, ageDays: rev && rev.timestamp ? Math.round((Date.parse(t) - Date.parse(rev.timestamp)) / 864e5) : null, rights: lic.id },
      };
    },
  };
}
// the tail sections of an encyclopedia article are navigation, not model-bearing text
function stripTail(t) {
  const cut = t.search(/^==\s*(See also|References|Notes|Citations|Bibliography|Further reading|External links|Sources)\s*==\s*$/im);
  return cut > 0 ? t.slice(0, cut) : t;
}

/* ───────── one harvest cycle for one target ───────── */
export async function cycle({ target, adapter, reader, memory, now = () => new Date().toISOString(), log = () => {}, maxPerQuery = 6 }) {
  const t0 = now(), found = new Map(), errors = [];
  for (const step of target.plan) {
    for (const q of step.queries) {
      try {
        for (const c of await adapter.discover(step.host, step.kind, q, maxPerQuery)) if (!found.has(c.id)) found.set(c.id, c);
      } catch (e) { errors.push(step.host + " / " + q + ": " + e.message); log("discovery failed: " + e.message); break; }
    }
  }
  const cands = [], skipped = [];
  for (const c of found.values()) {
    if (H.isRejected(memory, c.id)) { skipped.push(c.id); continue; } // rejected sources are not re-fetched
    try {
      const full = await adapter.fetchCandidate(c);
      if (!full) { H.remember(memory, { id: c.id, title: c.title, decision: { state: "REJECTED", why: "no extractable text" }, lastChecked: t0 }); continue; }
      full.hash = await H.sha256(full.text);
      if (full.license.ok && H.wc(full.text) >= 250) {
        try { full.compiled = reader.compile(full.text, full.title, full.kind === "primary" ? "primary" : "auto"); } catch (e) { full.compileError = e.message; }
      }
      cands.push(full);
    } catch (e) { errors.push(c.id + ": " + e.message); log("fetch failed: " + e.message); }
  }
  const known = new Set(Object.values(memory.sources).filter((s) => s.contentSha256 && s.decision && s.decision.state === "CANDIDATE_SOURCE").map((s) => s.contentSha256));
  const { selected, rejected } = H.select(cands, target, { memory, known });
  for (const r of rejected) {
    const c = cands.find((x) => x.id === r.id);
    H.remember(memory, { id: r.id, title: r.title, url: c && c.url, language: c && c.language, license: c && c.license.id, sourceType: c && c.kind, domain: target.domain, whyDiscovered: c && "search: " + c.discoveredBy, decision: { state: "REJECTED", why: r.reason }, refresh: { class: "slow-moving", due: null }, lastChecked: t0 });
  }
  let experience = null, gate = null;
  if (selected.length) {
    experience = await H.compileExperience(target, selected, t0);
    const texts = Object.fromEntries(selected.map((s) => [s.cand.id, s.cand.text]));
    gate = await H.gates(experience, texts, memory);
    for (const s of selected) H.remember(memory, { id: s.cand.id, title: s.cand.title, url: s.cand.url, revision: s.cand.revision, language: s.cand.language, license: s.cand.license.id, sourceType: s.cand.kind, domain: target.domain, contentSha256: s.cand.hash, qualityEvidence: s.cand.meta, capabilityDonors: s.cand.compiled.keys.slice(0, 5).map((k) => k.text.slice(0, 120)), whyDiscovered: "search: " + s.cand.discoveredBy, decision: { state: "CANDIDATE_SOURCE", why: s.why }, candidateExperiences: [experience.id], refresh: { class: "slow-moving", due: null }, lastChecked: t0 });
  }
  const summary = { target: target.id, at: t0, discovered: found.size, skippedRejected: skipped.length, fetched: cands.length, selected: selected.length, rejected: rejected.length, errors, experience: experience && experience.id, gatesOk: gate && gate.ok };
  memory.cycles = (memory.cycles || []).concat([summary]).slice(-50);
  return { selected, rejected, experience, gate, summary };
}

/* ───────── write the shipped folder: packs, memory, index ───────── */
export async function write(out, { memory, results }) {
  await mkdir(join(out, "packs"), { recursive: true });
  const exps = [];
  for (const r of results) {
    if (!r.experience) continue;
    for (const s of r.selected) await writeFile(join(out, "packs", H.packName(s.cand.id)), JSON.stringify(H.packOf(s.cand, { hash: s.cand.hash }), null, 1));
    exps.push(Object.assign({}, r.experience, { gates: r.gate.gates, sandbox: r.gate.ok, held: r.gate.ok ? null : r.gate.gates.filter((g) => g.block && !g.ok).map((g) => g.id + ": " + g.why), notChosen: r.rejected }));
  }
  const index = { version: 1, harvester: H.VERSION, generatedAt: new Date().toISOString(), note: "Written by tools/harvester/harvest.mjs. Candidates only: nothing here is certified; promotion needs a human approval in the app.", experiences: exps, cycles: memory.cycles };
  await writeFile(join(out, "index.json"), JSON.stringify(index, null, 1));
  await writeFile(join(out, "memory.json"), JSON.stringify(memory, null, 1));
  return index;
}

/* ───────── CLI ───────── */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
  if (!process.argv.includes("--live")) { console.error("Refusing to run without --live: this job uses the real network, and fixtures must never reach the shipped harvest folder."); process.exit(2); }
  const out = join(here, "../..", arg("out", "source/public/harvest")), want = arg("target", null);
  const all = JSON.parse(await readFile(join(here, "targets.json"), "utf8")).targets, targets = want ? all.filter((t) => t.id === want) : all;
  if (!targets.length) { console.error("no such target: " + want); process.exit(2); }
  let memory = H.newMemory();
  try { memory = JSON.parse(await readFile(join(out, "memory.json"), "utf8")); } catch (_) {}
  const adapter = createWikimedia({ delayMs: Number(arg("delay", 1200)), log: (m) => console.log("  ·", m) }), reader = loadReader(), results = [];
  for (const target of targets) {
    console.log("target:", target.id);
    const r = await cycle({ target, adapter, reader, memory, log: (m) => console.log("  ·", m) });
    console.log(" ", JSON.stringify(r.summary));
    results.push(r);
  }
  const idx = await write(out, { memory, results });
  console.log("wrote", idx.experiences.length, "candidate experience(s) to", out);
}
