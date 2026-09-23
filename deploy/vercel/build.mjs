// Build for the Vercel host: copy the exact app (source/public) and add the host adapter.
// The only change to app files is one <script src="/host-sync.js"> tag injected into index.html;
// login.html is replaced by the sync-code page (Hatchable email login does not exist here).
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

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
await writeFile(indexUrl, html);

const info = {
  app: "INTELLECTUALITY CNS",
  commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
  branch: process.env.VERCEL_GIT_COMMIT_REF || null,
  builtAt: new Date().toISOString(),
  indexSha256: createHash("sha256").update(html).digest("hex"),
};
await writeFile(new URL("build-info.json", OUT), JSON.stringify(info, null, 1));
console.log("[build] dist ready", info);
