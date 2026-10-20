// Build for the Vercel host: copy the exact app (source/public) and add the host adapter.
// The only change to app files is one <script src="/host-sync.js"> tag injected into index.html;
// login.html is replaced by the sync-code page (Hatchable email login does not exist here).
// v15.1: real pictures are downloaded into dist/pics at build time (pics.mjs) so the app shows them
// from its own domain; one <script defer src="/pics/manifest.js"> tag tells the app where they are.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { bundlePictures, readNoteSources } from "./pics.mjs";

const here = (p) => new URL(p, import.meta.url);
// IX_HOST=pages (v18.14.2): the same app for GitHub Pages, free, while the Vercel project is paused. Pages serves
// a project site under /<repo>/, so the app's root paths are made relative, and there is no server: no cloud save
// (the device copy and the progress file stay), no sync-code page.
const PAGES = process.env.IX_HOST === "pages";
const SRC = here("../../source/public/"),
  OUT = here(PAGES ? "./dist-pages/" : "./dist/");

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(SRC, OUT, { recursive: true });
if (!PAGES) await cp(here("./static/"), OUT, { recursive: true, force: true });

const indexUrl = new URL("index.html", OUT);
let html = await readFile(indexUrl, "utf8");
const tag = '<script src="/host-sync.js"></script>',
  anchor = '<meta charset="utf-8">';
if (!PAGES && !html.includes(tag)) {
  if (html.split(anchor).length !== 2) throw new Error("build: expected exactly one charset meta in index.html");
  html = html.replace(anchor, anchor + tag);
}
let pics = null;
if (process.env.PICS !== "0") {
  try {
    pics = await bundlePictures({
      outDir: OUT,
      noteSources: await readNoteSources(SRC),
      registrySources: await Promise.all(["visual-registry-v14.js", "real-visuals-v9.js"].map((n) => readFile(new URL(n, SRC), "utf8"))),
      bases: { wp: process.env.PICS_WP, wrest: process.env.PICS_WREST, commons: process.env.PICS_COMMONS },
      cacheDir: here("./node_modules/.cache/intellectuality-pics/"),
      maxMinutes: +(process.env.PICS_MINUTES || 7),
      graceMs: +(process.env.PICS_GRACE_S || 60) * 1000,
    });
  } catch (e) {
    console.log("[pics] skipped:", e.message);
  }
}
const picTag = '<script defer src="/pics/manifest.js"></script>',
  picAnchor = '<script defer src="/learn-v15.js"></script>';
if (pics && pics.stats.images > 0 && !html.includes(picTag)) {
  if (html.split(picAnchor).length !== 2) throw new Error("build: expected exactly one learn-v15.js tag in index.html");
  html = html.replace(picAnchor, picTag + picAnchor);
}
// Axis Forge is a silent successor observer. Keep source/index untouched so v18.4
// remains the canonical Renaissance baseline; Vercel loads the observer after Renaissance.
const axisTag = '<script defer src="/axis-forge-v1.js"></script>',
  axisAnchor = '<script defer src="/renaissance-v1.js"></script>';
if (!html.includes(axisTag)) {
  if (html.split(axisAnchor).length !== 2) throw new Error("build: expected exactly one renaissance-v1.js tag in index.html");
  html = html.replace(axisAnchor, axisAnchor + axisTag);
}
// fail fast: every same-origin script and stylesheet index.html names must be in dist (v16 adds six)
{
  const { access } = await import("node:fs/promises");
  const refs = [...html.matchAll(/<(?:script[^>]*\ssrc|link[^>]*\shref)="\/([^"?#]+)"/g)].map((m) => m[1]).filter((p) => /\.(js|css)$/.test(p) && !p.startsWith("pics/"));
  for (const p of refs) await access(new URL(p, OUT)).catch(() => { throw new Error("build: index.html names /" + p + " but it is not in dist"); });
  console.log("[build] " + refs.length + " app scripts/styles present");
}
if (PAGES) html = await relativise(html);
await writeFile(indexUrl, html);

// Pages: every path the app names from the site root becomes relative to the page. Each rewrite must find its target.
async function relativise(page) {
  const edits = [
    ["sw.js", [[/\^\\\/pics\\\//, "(?:^|\\/)pics\\/"], ['c.add("/")', 'c.add("./")'], ['caches.match("/")', 'caches.match("./")']]],
    ["learn-v15.js", [['register("/sw.js")', 'register("sw.js")']]],
    ["renaissance-books.js", [[/"\/books\//g, '"books/']]],
    ["dept-figs-v16.js", [[/"\/dept\//g, '"dept/']]],
    ["intellectuality-v14.js", [[/"\/assets\//g, '"assets/']]],
  ];
  if (pics && pics.stats.images > 0) edits.push(["pics/manifest.js", [[/"\/pics\//g, '"pics/']]]);
  for (const [file, reps] of edits) {
    const u = new URL(file, OUT);
    let t = await readFile(u, "utf8");
    for (const [a, b] of reps) {
      const n = t.replace(a, b);
      if (n === t) throw new Error("build(pages): " + file + " has no " + a);
      t = n;
    }
    await writeFile(u, t);
  }
  const n0 = page.length;
  page = page.replace(/(\s(?:src|href))="\/(?!\/)/g, '$1="');
  const login = "location.href='/login?next=/'";
  if (!page.includes(login)) throw new Error("build(pages): index.html cloud button changed");
  page = page.replace(login, "alert('Cloud backup is off on this copy of the app. To keep a backup, open 📤 SHARE MY PROGRESS and tap 💾 Save full progress file.')");
  console.log("[build] pages: root paths made relative (" + (n0 - page.length) + " chars)");
  return page;
}

const info = {
  app: "INTELLECTUALITY CNS",
  commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
  branch: process.env.VERCEL_GIT_COMMIT_REF || null,
  builtAt: new Date().toISOString(),
  indexSha256: createHash("sha256").update(html).digest("hex"),
  pictures: pics ? pics.stats : null,
};
await writeFile(new URL("build-info.json", OUT), JSON.stringify(info, null, 1));
console.log("[build] dist ready", info);
// requests the picture watchdog left behind must not keep the build open
process.exit(0);