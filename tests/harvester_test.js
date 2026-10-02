// World Harvester v0.1 gate (no browser, no network). Run: node tests/harvester_test.js
// Uses the stand-in MediaWiki API in tests/harvester_fixtures.js. A live run is a separate act (tools/harvester/harvest.mjs --live).
const fs = require("fs"), path = require("path"), cp = require("child_process");
const H = require("../source/public/renaissance-harvest.js");
const loadReader = require("../tools/harvester/reader_host.cjs");
const F = require("./harvester_fixtures.js");
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, ok: !!ok }); console.log((ok ? "PASS " : "FAIL ") + id + " " + what + (ok ? "" : " " + JSON.stringify(detail).slice(0, 700))); };

(async () => {
  const { createWikimedia, cycle, write } = await import("../tools/harvester/harvest.mjs");
  const reader = loadReader();
  const targets = JSON.parse(fs.readFileSync(path.join(__dirname, "../tools/harvester/targets.json"), "utf8")).targets;
  const T = JSON.parse(JSON.stringify(targets[0]));
  T.plan = T.plan.concat([{ host: "example.org", kind: "reference", queries: ["natural selection"] }]); // an unlicensed ecosystem the harvester must refuse
  const NOW = () => "2026-10-02T03:00:00.000Z";
  const run = async (opts = {}) => {
    const fetchImpl = F.makeFetch(opts.net), memory = opts.memory || H.newMemory();
    const adapter = createWikimedia({ fetchImpl, delayMs: opts.delayMs ?? 0, now: NOW });
    const r = await cycle({ target: opts.target || T, adapter, reader, memory, now: NOW });
    return { r, memory, fetchImpl };
  };

  // H1 licences
  const L = H.normLicense;
  check("H1", "Licences: CC BY-SA 4.0/3.0, CC BY, CC0 and public domain are accepted (attribution flagged where required); anything else, including 'all rights reserved', is not",
    L("Creative Commons Attribution-ShareAlike 4.0 License").id === "CC BY-SA 4.0" && L("Creative Commons Attribution-ShareAlike 4.0 License").attribution && L("", "https://creativecommons.org/licenses/by-sa/3.0/").id === "CC BY-SA 3.0" && L("CC0 1.0").id === "CC0" && !L("CC0 1.0").attribution && L("Public domain").ok && !L("All rights reserved").ok && !L("").ok && !L("Creative Commons Attribution-NonCommercial 4.0").ok, null);

  // H2 etiquette
  {
    const { fetchImpl, r } = await run({ delayMs: 25 });
    const c = fetchImpl.calls;
    const gaps = c.slice(1).map((x, i) => x.t - c[i].t);
    check("H2", "Etiquette: only the public API path, an identifying User-Agent, maxlag set, one request at a time with a pause between them",
      c.length > 10 && c.every((x) => x.path === "/w/api.php" && /RenaissanceHarvester\/0\.1/.test(x.ua || "") && x.q.maxlag === "5" && x.q.format === "json") && gaps.every((g) => g >= 20), { n: c.length, minGap: Math.min(...gaps), bad: c.filter((x) => x.path !== "/w/api.php").length });
    check("H2b", "A host that stays rate-limited stops the cycle with a clear message instead of being pressed: errors recorded, no crash, nothing half-written",
      await (async () => { const o = await run({ net: { rateLimit: (h) => h === "en.wikipedia.org" }, delayMs: 0 }); return o.r.summary.errors.some((e) => /rate-limited/.test(e)) && o.r.summary.selected <= 1; })(), null);
  }

  // H3 discovery, provenance, classification
  const { r, memory } = await run();
  const S = r.selected.map((s) => s.cand), byTitle = (t) => S.find((c) => c.title === t);
  check("H3", "Every chosen source carries full provenance: permalink with the revision, retrieval time, licence, attribution, language, content SHA-256, and why it was chosen",
    S.length >= 2 && S.every((c) => /oldid=\d+$/.test(c.url) && c.revision && c.retrievedAt === NOW() && c.license.ok && c.attribution && c.language && /^[0-9a-f]{64}$/.test(c.hash)) && r.selected.every((s) => /^rank \d/.test(s.why)), S.map((c) => c.title));
  check("H3b", "Source type is classified: encyclopedia pages are 'reference', Wikisource works are 'primary'; the primary source is compiled under Reader's primary-text law",
    S.every((c) => c.kind === (c.host.includes("wikisource") ? "primary" : "reference")) && r.experience.sources.filter((s) => s.kind === "primary").every((s) => /BRIDGE/.test(s.readerVerdict)), r.experience.sources.map((s) => [s.title, s.kind, s.readerVerdict]));

  // H4 the tournament
  const why = Object.fromEntries(r.rejected.map((x) => [x.title, x.reason]));
  check("H4", "Source tournament: the off-topic page, the stub, the near-duplicate and the unlicensed text are all turned away, each with its reason",
    /off target/.test(why.Homeopathy || "") && /too short/.test(why.Selection || "") && !!why["Natural selection (course text)"] && /licence/.test(why["Natural selection (course text)"]) && (!byTitle("Fitness (biology)") || false), why);
  check("H4b", "The tournament prefers the featured, well-evidenced pages and does not spend minutes on a page that repeats an already chosen one (redundancy penalty)",
    !!byTitle("Natural selection") && !byTitle("Fitness (biology)") && /^redundant: \d+% of it repeats/.test(why["Fitness (biology)"] || ""), { chosen: S.map((c) => c.title), why: why["Fitness (biology)"] });
  const comp = r.selected.find((s) => s.cand.title === "Natural selection");
  check("H4c", "Every ranking explains itself in numbers (fit, evidence, compressibility, novelty, kind gap, redundancy, uncertainty), so 'why this lesson, why not something else' is answerable",
    r.selected.every((s) => /fit [\d.]+, evidence [\d.]+, compressibility [\d.]+, novelty \d, kind gap [\d.]+, redundancy -[\d.]+\); uncertainty [\d.]+/.test(s.why)) && comp.scores.evidence > 0.5, comp.why);

  const prim = r.selected.find((x) => x.cand.kind === "primary");
  check("H4d", "A target that asks for a primary experience gets one: the reserved slot goes to the Darwin chapter (which a measured-evidence score alone would never pick), it displaces the lowest-ranked reference, and Reader's law labels it BRIDGE, not replaced",
    !!prim && prim.reserved === true && /reserved slot/.test(prim.why) && /displaced/.test(prim.why) && /BRIDGE/.test(r.experience.sources.find((x) => x.kind === "primary").readerVerdict), prim && prim.why);

  // H5 the candidate experience
  const E = r.experience, step = (id) => E.steps.find((s) => s.id === id);
  check("H5", "One candidate experience is compiled: status CANDIDATE, a model from at least two sources, a contrast step, retrieval prompts of at least two deep kinds, a transfer prompt and a reality task",
    E.status === "CANDIDATE" && /^hx-[0-9a-f]{12}$/.test(E.id) && new Set(step("model").claims.map((c) => c.src)).size >= 2 && step("contrast").items.length >= 1 && step("retrieve").items.length >= 3 && new Set(step("retrieve").items.map((q) => q.kind)).size >= 2 && step("transfer").prompt && step("reality").prompt && E.minutes >= 5 && E.minutes <= 40, { id: E.id, minutes: E.minutes, kinds: step("retrieve").items.map((q) => q.kind) });
  check("H5b", "Every claim and contrast item is a verbatim substring of its stored source text (nothing invented, nothing paraphrased into a false quote)",
    [...step("model").claims, ...step("contrast").items].every((c) => S.find((s) => s.id === c.src).text.includes(c.text)), null);
  check("H5c", "The machine-drafted transfer prompt and reality task are marked for the learner's review", step("transfer").needsHumanReview === true && step("reality").needsHumanReview === true, null);
  check("H5d", "The experience id is deterministic (same target, same sources → same id), so a repeated cycle does not multiply candidates", (await run()).r.experience.id === E.id, null);

  // H6 gates
  const texts = Object.fromEntries(S.map((c) => [c.id, c.text])), G = async (e, t, m) => H.gates(e, t || texts, m || null);
  const ok0 = await G(E);
  check("H6", "All blocking quality gates pass for the honest candidate", ok0.ok && ok0.gates.filter((g) => g.block).every((g) => g.ok), ok0.gates.filter((g) => !g.ok));
  const clone = () => JSON.parse(JSON.stringify(E)), failed = async (e, t, m) => (await G(e, t, m)).gates.filter((g) => g.block && !g.ok).map((g) => g.id);
  let e1 = clone(); e1.steps[0].claims[0].text = e1.steps[0].claims[0].text + " Moreover, this was proven in every case.";
  check("H6a", "Gate G4 (verbatim): a claim that is not in its source is caught", (await failed(e1)).includes("G4 verbatim"), await failed(e1));
  const t2 = Object.assign({}, texts); t2[S[0].id] = t2[S[0].id] + " Appended sentence that was never fetched.";
  check("H6b", "Gate G5 (integrity): source text that no longer matches its recorded SHA-256 is caught", (await failed(E, t2)).includes("G5 integrity"), await failed(E, t2));
  let e3 = clone(); delete e3.sources[0].revision;
  check("H6c", "Gate G2 (provenance): a source without a revision is caught", (await failed(e3)).includes("G2 provenance"), await failed(e3));
  let e4 = clone(); e4.sources[0].license = "All rights reserved";
  check("H6d", "Gate G1 (licence): an unlicensed source is caught", (await failed(e4)).includes("G1 licence"), await failed(e4));
  let e5 = clone(); e5.sources[0].attribution = null;
  check("H6e", "Gate G3 (attribution): a CC BY-SA source without attribution is caught", (await failed(e5)).includes("G3 attribution"), await failed(e5));
  let e6 = clone(); e6.steps.find((s) => s.id === "contrast").items = [];
  check("H6f", "Gate G7 (contrast): a candidate that preserves no limitation or test is caught (no unchallenged claims)", (await failed(e6)).includes("G7 contrast"), await failed(e6));
  let e7 = clone(); e7.status = "PILOT";
  check("H6g", "Gate G11 (no self-certification): a candidate that arrives already promoted, without approval, is caught", (await failed(e7)).includes("G11 no self-certification"), await failed(e7));
  let e8 = clone(); const pi = e8.sources.findIndex((s) => s.kind === "primary"); if (pi >= 0) e8.sources[pi].readerVerdict = "REPLACEMENT CANDIDATE";
  check("H6h", "Gate G9 (primary law): a primary literary source declared 'replaced' is caught", pi < 0 || (await failed(e8)).includes("G9 primary law"), { pi, f: await failed(e8) });
  const m2 = H.newMemory(); H.remember(m2, { id: S[0].id, decision: { state: "REJECTED", why: "test" } });
  check("H6i", "Gate G10: a source that was rejected in an earlier cycle blocks the candidate", (await failed(E, null, m2)).includes("G10 not rejected"), await failed(E, null, m2));

  // H7 AI may not certify
  const throws = (f) => { try { f(); return false; } catch (e) { return e.message; } };
  check("H7", "Promotion needs a human approval: none, a model's, or a wrong token all throw; a failed gate throws even with approval",
    /human approval/.test(throws(() => H.promote(E, null, ok0))) && /human approval/.test(throws(() => H.promote(E, { by: "model", token: H.PROMOTE_TOKEN }, ok0))) && /human approval/.test(throws(() => H.promote(E, { by: "human", token: "yes" }, ok0))) && /gates/.test(throws(() => H.promote(E, { by: "human", token: H.PROMOTE_TOKEN }, { ok: false, gates: [] }))), null);
  const P1 = H.promote(E, { by: "human", token: H.PROMOTE_TOKEN, t: NOW(), note: "read it" }, ok0);
  check("H7b", "With a human approval and passing gates a candidate becomes a PILOT, the approval is in its lifecycle, and the original object is unchanged",
    P1.status === "PILOT" && P1.approvals.length === 1 && P1.lifecycle.slice(-1)[0].by === "human" && E.status === "CANDIDATE" && E.approvals.length === 0, null);
  const harvesterSrc = fs.readFileSync(path.join(__dirname, "../tools/harvester/harvest.mjs"), "utf8"), coreSrc = fs.readFileSync(path.join(__dirname, "../source/public/renaissance-harvest.js"), "utf8");
  const callers = (coreSrc.match(/\b(promote|api\.approve|api\.promote)\(/g) || []).length;
  check("H7c", "No job, timer or model path promotes: the Node harvester never mentions promote/approve, and in the page only the Campus 'I APPROVE' click reaches approve()",
    !/promote|approve/.test(harvesterSrc) && /data-rc="hx-approve"/.test(fs.readFileSync(path.join(__dirname, "../source/public/campus-v1.js"), "utf8")) && (fs.readFileSync(path.join(__dirname, "../source/public/campus-v1.js"), "utf8").match(/H\.approve\(/g) || []).length === 1 && callers >= 3, { callers });

  // H8 memory: rejected stays recoverable, never refetched
  const rej = Object.values(memory.sources).filter((s) => s.decision.state === "REJECTED");
  check("H8", "Rejected sources stay in memory with title, URL where known, licence, why discovered and why rejected, and no source text", rej.length >= 4 && rej.every((s) => s.decision.why && s.title && s.lastChecked) && !JSON.stringify(rej).includes("offspring resemble their parents") && rej.every((s) => !("text" in s) && !s.capabilityDonors), rej.map((s) => s.title));
  const second = await run({ memory });
  const refetched = second.fetchImpl.calls.filter((c) => c.q.titles && ["Homeopathy", "Selection", "Fitness (biology)", "Natural selection (course text)"].includes(c.q.titles)).length;
  check("H8b", "A second cycle does not re-fetch what was rejected (no rediscovering the same garbage); the chosen sources are recorded with their content hashes and the cycle is logged",
    refetched === 0 && second.r.summary.skippedRejected >= 4 && Object.values(memory.sources).filter((s) => s.decision.state === "CANDIDATE_SOURCE").every((s) => /^[0-9a-f]{64}$/.test(s.contentSha256)) && memory.cycles.length === 2, { refetched, skipped: second.r.summary.skippedRejected });

  // H9 what is written for the app
  const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "harvest-"));
  const idx = await write(tmp, { memory, results: [r] });
  const files = fs.readdirSync(path.join(tmp, "packs")), pack0 = JSON.parse(fs.readFileSync(path.join(tmp, "packs", files[0]), "utf8"));
  check("H9", "The shipped folder holds packs only for chosen sources, an index of candidates with gates and 'not chosen' reasons, and the memory (metadata only)",
    files.length === r.selected.length && idx.experiences.length === 1 && idx.experiences[0].sandbox === true && idx.experiences[0].notChosen.length >= 4 && idx.experiences[0].gates.length >= 10 && /^[0-9a-f]{64}$/.test(await H.sha256(pack0.text).then((x) => x)) && !JSON.stringify(JSON.parse(fs.readFileSync(path.join(tmp, "memory.json"), "utf8"))).includes("differential reproduction"), { files: files.length });
  check("H9a", "Pack file names are safe on every file system and in a URL (no percent signs or colons) and the writer and the page use the same naming function",
    files.every((f) => /^[A-Za-z0-9._-]+\.json$/.test(f)) && files.includes(H.packName(r.selected[0].cand.id)) && /packName\(id\)/.test(coreSrc), files);
  check("H9b", "A pack's text hashes to the recorded content hash, and is already in Reader OS's normal form, so the page's digest check holds",
    (await H.sha256(pack0.text)) === (await H.sha256(H.normalize(pack0.text))) && (await H.sha256(pack0.text)) === idx.experiences[0].sources.find((s) => s.id === pack0.id).contentSha256, null);
  check("H9c", "Reader OS can compile every pack (the same compile the app runs on digest)", files.every((f) => { const p = JSON.parse(fs.readFileSync(path.join(tmp, "packs", f), "utf8")); return reader.compile(p.text, p.title, p.kind === "primary" ? "primary" : "auto").questions.length >= 8; }), null);
  fs.mkdirSync(path.join(__dirname, "out"), { recursive: true });
  fs.writeFileSync(path.join(__dirname, "out", "harvest_fixture_index.json"), JSON.stringify(idx));

  const { verify } = await import("../tools/harvester/verify_harvest.mjs");
  const v1 = await verify(tmp);
  const badDir = fs.mkdtempSync(path.join(require("os").tmpdir(), "harvest-bad-")); fs.cpSync(tmp, badDir, { recursive: true });
  const bp = path.join(badDir, "packs", fs.readdirSync(path.join(badDir, "packs"))[0]), bj = JSON.parse(fs.readFileSync(bp, "utf8")); bj.text += " Smuggled sentence."; fs.writeFileSync(bp, JSON.stringify(bj));
  const v2 = await verify(badDir);
  const shipped0 = await verify(path.join(__dirname, "../source/public/harvest"));
  check("H9d", "The folder verifier (run before anything is committed) accepts an honest harvest, rejects a tampered pack, and accepts the empty shipped folder", v1.ok && v1.experiences === 1 && !v2.ok && v2.problems.some((x) => /G5 integrity/.test(x)) && shipped0.ok && shipped0.experiences === 0, { v1, v2: v2.problems, shipped0 });

  // H10 safety rails
  const cli = cp.spawnSync(process.execPath, [path.join(__dirname, "../tools/harvester/harvest.mjs")], { encoding: "utf8" });
  check("H10", "The job refuses to run without --live, so fixtures can never be written into the shipped folder", cli.status === 2 && /Refusing to run without --live/.test(cli.stderr), cli.stderr);
  const shipped = JSON.parse(fs.readFileSync(path.join(__dirname, "../source/public/harvest/index.json"), "utf8")), mem = JSON.parse(fs.readFileSync(path.join(__dirname, "../source/public/harvest/memory.json"), "utf8"));
  check("H10b", "The shipped harvest folder is honest: no candidates and no memory until a live run has written them", shipped.experiences.length === 0 && Object.keys(mem.sources).length === 0 && fs.readdirSync(path.join(__dirname, "../source/public/harvest/packs")).filter((f) => f.endsWith(".json")).length === 0, shipped);
  check("H10c", "No Renaissance source touches the network from the page: the harvester core's only fetches are same-origin /harvest/ paths (CSP connect-src 'self' is unchanged)",
    (coreSrc.match(/fetch\(/g) || []).length === 1 && /"\/harvest\/index\.json"|"\/harvest\/packs\//.test(coreSrc) && !/https?:\/\/(?!creativecommons)/.test(coreSrc.replace(/\/\*[\s\S]*?\*\//g, "")) && /connect-src 'self'/.test(fs.readFileSync(path.join(__dirname, "../deploy/vercel/vercel.json"), "utf8")), null);

  const fail = results.filter((x) => !x.ok).length;
  console.log(fail ? fail + " FAILED" : "World Harvester gate: ALL " + results.length + " PASSED");
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
