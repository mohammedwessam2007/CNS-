// Re-verify a harvest folder from scratch with the same gates the page runs. Exit 1 if anything is wrong.
//   node tools/harvester/verify_harvest.mjs [folder]      (default: source/public/harvest)
import { createRequire } from "node:module";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
const require = createRequire(import.meta.url), H = require("../../source/public/renaissance-harvest.js");
export async function verify(dir) {
  const problems = [], idx = JSON.parse(await readFile(join(dir, "index.json"), "utf8")), memory = JSON.parse(await readFile(join(dir, "memory.json"), "utf8"));
  const packs = new Set((await readdir(join(dir, "packs"))).filter((f) => f.endsWith(".json")));
  const used = new Set();
  for (const e of idx.experiences || []) {
    const texts = {};
    for (const s of e.sources) {
      const f = H.packName(s.id); used.add(f);
      if (!packs.has(f)) { problems.push(e.id + ": missing pack for " + s.id); continue; }
      texts[s.id] = JSON.parse(await readFile(join(dir, "packs", f), "utf8")).text;
    }
    const g = await H.gates(e, texts, null);
    if (!g.ok) problems.push(e.id + ": blocking gates failed: " + g.gates.filter((x) => x.block && !x.ok).map((x) => x.id).join(", "));
    if (e.sandbox !== g.ok) problems.push(e.id + ": the index says sandbox=" + e.sandbox + " but the gates say " + g.ok);
    if (e.status !== "CANDIDATE") problems.push(e.id + ": a harvested experience must be written as CANDIDATE, not " + e.status);
  }
  for (const f of packs) if (!used.has(f)) problems.push("orphan pack " + f);
  for (const [id, s] of Object.entries(memory.sources)) if (s.text || (s.decision && s.decision.state === "REJECTED" && s.capabilityDonors)) problems.push("memory holds text for rejected/any source " + id);
  return { ok: !problems.length, problems, experiences: (idx.experiences || []).length, packs: packs.size };
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const r = await verify(resolve(process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), "../../source/public/harvest")));
  console.log(JSON.stringify(r)); process.exit(r.ok ? 0 : 1);
}
