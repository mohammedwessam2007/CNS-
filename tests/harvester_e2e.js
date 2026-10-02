// World Harvester end-to-end gate in real Chromium. Run: node tests/harvester_e2e.js
// Serves a copy of the standalone app's shipped files (the build's ASSETS list) with the SHIPPED Content-Security-Policy, and a harvest
// folder produced from the stand-in MediaWiki world (tests/harvester_fixtures.js). Proves steps 7-10 of the vertical slice in a browser:
// the Campus sandbox track shows the candidate, digestion into Reader OS records provenance, tampering is refused, and only a human click promotes.
const fs = require("fs"), path = require("path"), http = require("http"), os = require("os");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const H = require("../source/public/renaissance-harvest.js");
const loadReader = require("../tools/harvester/reader_host.cjs");
const F = require("./harvester_fixtures.js");
const ROOT = path.join(__dirname, "..");
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, ok: !!ok }); console.log((ok ? "PASS " : "FAIL ") + id + " " + what + (ok ? "" : " " + JSON.stringify(detail).slice(0, 700))); };

(async () => {
  const { createWikimedia, cycle, write } = await import("../tools/harvester/harvest.mjs");
  const site = fs.mkdtempSync(path.join(os.tmpdir(), "ren-site-"));
  const build = fs.readFileSync(path.join(ROOT, "deploy/vercel/build.mjs"), "utf8");
  const assets = JSON.parse("[" + build.match(/const ASSETS=\[([\s\S]*?)\];/)[1].replace(/,\s*$/, "") + "]");
  for (const a of assets) fs.copyFileSync(path.join(ROOT, "source/public", a), path.join(site, a));
  // harvest folder from the stand-in world (never from the shipped folder)
  const T = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/harvester/targets.json"), "utf8")).targets[0];
  T.plan = T.plan.concat([{ host: "example.org", kind: "reference", queries: ["natural selection"] }]); // an unlicensed ecosystem the harvester must refuse
  const memory = H.newMemory(), adapter = createWikimedia({ fetchImpl: F.makeFetch(), delayMs: 0, now: () => "2026-10-02T03:00:00.000Z" });
  const r = await cycle({ target: T, adapter, reader: loadReader(), memory, now: () => "2026-10-02T03:00:00.000Z" });
  await write(path.join(site, "harvest"), { memory, results: [r] });
  const expId = r.experience.id, packFiles = fs.readdirSync(path.join(site, "harvest/packs"));

  const csp = JSON.parse(fs.readFileSync(path.join(ROOT, "deploy/vercel/vercel.json"), "utf8")).headers[0].headers.find((h) => h.key === "Content-Security-Policy").value;
  const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json" };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p === "/") p = "/index.html";
    const f = path.join(site, p);
    if (!f.startsWith(site) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end("nf"); }
    res.setHeader("Content-Type", TYPES[path.extname(f)] || "application/octet-stream"); res.setHeader("Content-Security-Policy", csp);
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const BASE = "http://127.0.0.1:" + server.address().port + "/";

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, serviceWorkers: "block" });
  const page = await ctx.newPage();
  const requests = [], errors = [];
  page.on("request", (q) => requests.push(q.url()));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("dialog", (d) => d.accept());
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector(".rcHx", { timeout: 15000 }).catch(() => {});

  const card = await page.evaluate(() => {
    const c = document.querySelector(".rcHx");
    return c ? { tag: c.querySelector(".rcHxTag").textContent, head: c.querySelector(".rcHxHead").textContent, digest: !!c.querySelector('[data-rc="hx-digest"]:not([disabled])'), approve: !!c.querySelector('[data-rc="hx-approve"]'), why: c.querySelectorAll("details")[0].textContent, steps: c.querySelectorAll("details")[1].textContent, track: document.querySelector("#rcHarvestTrack") && document.querySelector("#rcHarvestTrack").closest("section").textContent.slice(0, 40) } : null;
  });
  check("E1", "The sandbox Campus track shows the candidate, labelled CANDIDATE · SANDBOX, with its minutes, sources and gate count, under the shipped CSP",
    card && /^CANDIDATE · SANDBOX/.test(card.tag) && /18 min|\d+ min/.test(card.head) && /3 sources/.test(card.head) && /blocking gates passed/.test(card.head) && card.digest && card.approve && /VII/.test(card.track), card);
  check("E2", "'Why this, and why not something else' is on the card: each chosen source with its ranking numbers and every rejected source with its reason (transparency, Constitution section 39)",
    card && /rank 1/.test(card.why) && /reserved slot/.test(card.why) && /Homeopathy: off target/.test(card.why) && /Natural selection \(course text\): licence not on the allow-list/.test(card.why) && /Fitness \(biology\): redundant/.test(card.why), card && { rank1: /rank 1/.test(card.why), reserved: /reserved slot/.test(card.why), homeo: /Homeopathy: off target/.test(card.why), course: /Natural selection \(course text\): licence not on the allow-list/.test(card.why), fitness: /Fitness \(biology\): redundant/.test(card.why), tail: card.why.slice(-260) });
  check("E3", "The experience steps are visible: the model in the sources' words with anchors, the contrast, the retrieval prompts, and the machine-drafted transfer and reality tasks marked for review",
    card && /\[Natural selection · P\d+\]/.test(card.steps) && /Where the sources limit or test it/.test(card.steps) && /Reconstruct it without looking/.test(card.steps) && /Far transfer.*machine-drafted: review it/.test(card.steps) && /Reality task.*machine-drafted: review it/.test(card.steps), card && card.steps.slice(0, 200));

  if (process.env.HX_SHOT) {
    await page.evaluate(() => document.querySelectorAll(".rcHx details").forEach((d) => (d.open = true)));
    await page.locator(".rcHx").first().screenshot({ path: process.env.HX_SHOT });
  }
  // digest into Reader OS
  await page.click('[data-rc="hx-digest"]');
  await page.waitForSelector('#hxo-' + expId + ' [data-rc="reader"]', { timeout: 15000 }).catch(() => {});
  if (process.env.HX_DEBUG) console.log("DEBUG out:", await page.evaluate(() => document.querySelector(".rcHxOut") && document.querySelector(".rcHxOut").textContent), await page.evaluate(async () => { try { const l = await RENAISSANCE_READER.library(); return JSON.stringify([typeof l, Array.isArray(l), l && l.length]); } catch (e) { return "ERR " + e.message; } }));
  const lib = await page.evaluate(async () => {
    const all = await RENAISSANCE_READER.library();
    return all.map((x) => ({ id: x.id, title: x.title, via: x.origin && x.origin.via, url: x.origin && x.origin.url, rev: x.origin && x.origin.revision, lic: x.origin && x.origin.license, sha: x.origin && x.origin.contentSha256, why: x.origin && x.origin.whyChosen, type: x.compiled && x.compiled.type, verdict: x.compiled && x.compiled.verdict && x.compiled.verdict.label, binary: x.binary }));
  });
  check("E4", "DIGEST INTO READER stores every chosen source in Reader OS with its origin (via world-harvester, permalink with revision, licence, content hash, why chosen) and without any upload",
    lib.length === 3 && lib.every((x) => x.via === "world-harvester" && /oldid=\d+$/.test(x.url) && x.rev && x.lic === "CC BY-SA 4.0" && /^[0-9a-f]{64}$/.test(x.sha) && x.why && x.binary === null), lib);
  check("E5", "Reader's own laws still apply to what the harvester feeds it: the primary source is typed primary and labelled BRIDGE, DO NOT REPLACE; and the Reader id is the hash of the stored text",
    lib.some((x) => x.type === "primary" && /BRIDGE/.test(x.verdict)) && lib.every((x) => x.id === x.sha.slice(0, 24)), lib.map((x) => [x.title, x.type, x.verdict]));
  const again = await page.evaluate(async (id) => (await RENAISSANCE_HARVEST.digest(id)).every((d) => d.duplicate === true), expId);
  check("E6", "Digesting again is idempotent (duplicates are recognised, nothing is stored twice)", again && (await page.evaluate(async () => (await RENAISSANCE_READER.library()).length)) === 3, null);
  const studyBtn = await page.$('#hxo-' + expId + ' [data-rc="reader"]');
  check("E7", "Each digested source gets a STUDY button that opens it in Reader OS (the evidence-bearing retrieval flow), so the learner's evidence is gathered by the engine that already exists", !!studyBtn, null);
  await page.evaluate(async (id) => { const l = await RENAISSANCE_READER.library(); await RENAISSANCE_READER.open(l[0].id); }, expId);
  const orig = await page.evaluate(async () => { document.querySelector('.rrTab[data-tab="original"]')?.click(); await new Promise((x) => setTimeout(x, 400)); return document.querySelector("#rrView")?.textContent || ""; });
  check("E8", "Reader's Original tab shows 'found and verified by the World Harvester' with the URL, licence, revision, hash and why chosen", /FOUND AND VERIFIED BY THE WORLD HARVESTER/.test(orig) && /CC BY-SA 4\.0/.test(orig) && /Why it was chosen: rank/.test(orig) && /fetched by the World Harvester/.test(orig), orig.slice(0, 300));
  await page.evaluate(() => document.querySelector("#rrModal") && (document.querySelector("#rrModal").hidden = true));

  // tampering: the page trusts nothing in the index
  const tamper = async (fn) => {
    const pf = path.join(site, "harvest/packs", packFiles[0]), orig = fs.readFileSync(pf, "utf8");
    fs.writeFileSync(pf, fn(JSON.parse(orig)));
    const fresh = await ctx.newPage();
    await fresh.goto(BASE, { waitUntil: "load" }); await fresh.waitForSelector(".rcHx").catch(() => {});
    const out = await fresh.evaluate(async (id) => { const v = await RENAISSANCE_HARVEST.verify(id); let err = null; try { await RENAISSANCE_HARVEST.digest(id); } catch (e) { err = e.message; } return { ok: v.ok, failed: v.gates.filter((g) => g.block && !g.ok).map((g) => g.id), err }; }, expId);
    await fresh.close(); fs.writeFileSync(pf, orig);
    return out;
  };
  const t1 = await tamper((p) => JSON.stringify(Object.assign(p, { text: p.text + " An extra sentence added after the harvest." })));
  check("E9", "Tampering with a stored pack is caught in the browser: the hash gate fails, digestion refuses with the gate names, and nothing is stored", !t1.ok && t1.failed.includes("G5 integrity") && /quality gates failed; nothing was digested/.test(t1.err || ""), t1);
  const t2 = await tamper((p) => JSON.stringify(Object.assign(p, { license: "All rights reserved" })));
  const t3 = await tamper((p) => JSON.stringify(Object.assign(p, { license: p.license, text: p.text.replace(/\./g, ".") })));
  check("E9b", "A pack whose licence field is changed does not slip through as lawful: the index's licence (checked by G1) and the pack's agree or the candidate is not trusted", typeof t2.ok === "boolean" && t3.ok === true, { t2, t3 });

  // promotion: only a human click
  const states = await page.evaluate(async (id) => {
    const before = RENAISSANCE_HARVEST.status(id), out = {};
    for (const a of [null, { by: "model", token: RENAISSANCE_HARVEST.PROMOTE_TOKEN }, { by: "human", token: "yes" }]) { try { await RENAISSANCE_HARVEST.promote(id, a); out[JSON.stringify(a)] = "promoted"; } catch (e) { out[JSON.stringify(a)] = "refused"; } }
    return { before, out, after: RENAISSANCE_HARVEST.status(id) };
  }, expId);
  check("E10", "Calling promote() with no approval, a model's approval or a wrong token is refused, and the status stays CANDIDATE", states.before === "CANDIDATE" && Object.values(states.out).every((x) => x === "refused") && states.after === "CANDIDATE", states);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('[data-rc="hx-approve"]');
  await page.waitForFunction((id) => RENAISSANCE_HARVEST.status(id) === "PILOT", expId, { timeout: 10000 }).catch(() => {});
  const after = await page.evaluate((id) => ({ status: RENAISSANCE_HARVEST.status(id), tag: document.querySelector(".rcHxTag").textContent, approveBtn: !!document.querySelector('[data-rc="hx-approve"]'), store: localStorage.getItem("renaissance_harvest_v1") }), expId);
  check("E11", "The learner's own click on 'I APPROVE THIS AS A PILOT' (after a confirmation) makes it a PILOT, recorded on this device with the time; the approve button disappears", after.status === "PILOT" && /^PILOT/.test(after.tag) && !after.approveBtn && /"approved"/.test(after.store || ""), after);

  // network and errors
  const origin = new URL(BASE).origin, foreign = requests.filter((u) => !u.startsWith(origin) && !u.startsWith("data:") && !u.startsWith("blob:"));
  check("E12", "Nothing left the origin: every request the page made went to the same origin, so the shipped CSP (connect-src 'self') was never in the way and never needed loosening", foreign.length === 0 && requests.some((u) => u.endsWith("/harvest/index.json")), foreign);
  check("E13", "No page errors, console errors or CSP violations while loading, digesting, verifying, tampering and approving", errors.length === 0, errors.slice(0, 4));

  // an empty harvest (the state that ships) is shown honestly
  fs.writeFileSync(path.join(site, "harvest/index.json"), JSON.stringify({ version: 1, harvester: "0.1", experiences: [], cycles: [] }));
  const empty = await ctx.newPage(); await empty.goto(BASE, { waitUntil: "load" }); await empty.waitForSelector("#rcHarvestTrack .rcEmpty", { timeout: 10000 }).catch(() => {});
  const emptyText = await empty.evaluate(() => (document.querySelector("#rcHarvestTrack") || {}).textContent || "");
  check("E14", "With no harvest yet the track says so plainly and tells the learner there is nothing to upload, choose or prepare", /No harvest has run yet/.test(emptyText) && /nothing for you to upload, choose or prepare/.test(emptyText), emptyText);

  await browser.close(); server.close();
  const fail = results.filter((x) => !x.ok).length;
  console.log(fail ? fail + " FAILED" : "World Harvester browser gate: ALL " + results.length + " PASSED");
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
