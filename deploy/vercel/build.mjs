// Build for the Vercel host: copy the exact app (source/public) and add the host adapter.
// The only change to app files is one <script src="/host-sync.js"> tag injected into index.html;
// login.html is replaced by the sync-code page (Hatchable email login does not exist here).
// v15.1: real pictures are downloaded into dist/pics at build time (pics.mjs) so the app shows them
// from its own domain; one <script defer src="/pics/manifest.js"> tag tells the app where they are.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { bundlePictures, readNoteSources } from "./pics.mjs";

const here = (p) => new URL(p, import.meta.url);
const SRC = here("../../source/public/"),
  OUT = here("./dist/");

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(SRC, OUT, { recursive: true });
await cp(here("./static/"), OUT, { recursive: true, force: true });

const indexUrl = new URL("index.html", OUT);
let html = await readFile(indexUrl, "utf8");
const tag = '<script src="/host-sync.js"></script>',
  anchor = '<meta charset="utf-8">';
if (!html.includes(tag)) {
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
      maxMinutes: +(process.env.PICS_MINUTES || 9),
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
await writeFile(indexUrl, html);

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
