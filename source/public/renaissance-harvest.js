/* RENAISSANCE · WORLD HARVESTER · core, v0.1 (the first vertical slice; 2026-10-02)
 *
 * The harvester FINDS sources so the learner does not have to. It runs OUTSIDE the app (tools/harvester/harvest.mjs,
 * a Node job), because the app's Content-Security-Policy is connect-src 'self' and its promise is that nothing the learner
 * does leaves the browser. The job writes same-origin "harvest packs"; this file loads them, re-verifies them in the
 * browser, hands them to Reader OS for digestion, and exposes the candidate experience in a sandbox Campus track.
 *
 * One file, two hosts: the Node harvester and tests load it with require()/vm; the page loads it as a script.
 *
 * Laws kept here (each has a test in tests/harvester_test.js):
 *  - lawful only: a source whose licence is not on the allow-list is never ingested, only remembered with the reason;
 *  - provenance is never lost: url, revision, retrieval time, licence, attribution, content SHA-256, why it was chosen;
 *  - every claim shown is a verbatim substring of the stored source text (Reader's extractive law);
 *  - rejected sources stay recoverable, so the harvester does not rediscover the same garbage;
 *  - AI may generate candidates, AI may not certify them: nothing in this file promotes; promote() needs a human approval;
 *  - a primary literary or artistic source ends at a bridge, never at "replaced" (Reader's primary-text law).
 */
(function (root) {
  "use strict";
  const VERSION = "0.1";
  const PROMOTE_TOKEN = "HUMAN_APPROVES_PILOT";
  const STOP = new Set("the a an and or but of to in on for with as by at from that this these those is are was were be been it its their there which who whom whose into than then also not can may more most such other between among over under about after before during".split(" "));

  /* ───────── small utilities ───────── */
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const normalize = (t) => String(t || "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim(); // the same as Reader OS
  const wc = (t) => (String(t || "").trim().match(/\S+/g) || []).length;
  const words = (t) => (String(t || "").toLowerCase().match(/[a-z][a-z'-]{2,}/g) || []).filter((w) => !STOP.has(w));
  async function sha256(text) {
    const h = await root.crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text)));
    return [...new Uint8Array(h)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  const jaccard = (a, b) => {
    let i = 0;
    for (const x of a) if (b.has(x)) i++;
    const u = a.size + b.size - i;
    return u ? i / u : 0;
  };
  // phrase containment: how much of text A (as 6-word phrases) already appears in B. Paraphrased near-duplicates are caught by the topical Jaccard instead.
  const shingles = (text, k = 6) => {
    const w = (String(text || "").toLowerCase().match(/[a-z0-9'-]+/g) || []), out = new Set();
    for (let i = 0; i + k <= w.length; i++) out.add(w.slice(i, i + k).join(" "));
    return out;
  };
  const containment = (a, b) => {
    let i = 0;
    for (const x of a) if (b.has(x)) i++;
    return a.size ? i / a.size : 0;
  };
  const topTerms = (text, n = 60) => {
    const m = new Map();
    for (const w of words(text)) m.set(w, (m.get(w) || 0) + 1);
    return new Set([...m.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, n).map((x) => x[0]));
  };

  /* ───────── licences: only these may be ingested ───────── */
  function normLicense(text, url) {
    const t = (String(text || "") + " " + String(url || "")).toLowerCase();
    let id = null;
    if (/public domain|pd-|cc0|cc-zero|publicdomain\/zero/.test(t)) id = /cc0|zero/.test(t) ? "CC0" : "Public domain";
    else if (/attribution-sharealike 4\.0|by-sa\/4\.0|cc by-sa 4\.0/.test(t)) id = "CC BY-SA 4.0";
    else if (/attribution-sharealike 3\.0|by-sa\/3\.0|cc by-sa 3\.0/.test(t)) id = "CC BY-SA 3.0";
    else if (/attribution 4\.0|\/by\/4\.0|cc by 4\.0/.test(t)) id = "CC BY 4.0";
    return id
      ? { id, ok: true, attribution: id !== "Public domain" && id !== "CC0", shareAlike: /SA/.test(id) }
      : { id: "unknown", ok: false, attribution: false, shareAlike: false };
  }

  /* ───────── the World Harvester Memory (§48): sources, promoted or rejected, all recoverable ───────── */
  const newMemory = () => ({ version: 1, sources: {}, cycles: [] });
  function remember(mem, rec) {
    const prev = mem.sources[rec.id] || {};
    mem.sources[rec.id] = Object.assign({}, prev, rec, { lastChecked: rec.lastChecked || prev.lastChecked || null, history: (prev.history || []).concat([{ t: rec.lastChecked || null, decision: rec.decision && rec.decision.state, why: rec.decision && rec.decision.why }]).slice(-20) });
    return mem.sources[rec.id];
  }
  const isRejected = (mem, id) => !!(mem.sources[id] && mem.sources[id].decision && mem.sources[id].decision.state === "REJECTED");

  /* ───────── source tournament (§5): every source competes for the learner's minutes ───────── */
  const WEIGHTS = { fit: 0.3, evidence: 0.2, compression: 0.15, novelty: 0.1, kindGap: 0.15, time: 0.1 };
  const REDUNDANCY_PENALTY = 0.35, REDUNDANCY_CUTOFF = 0.5; // a source that mostly repeats a chosen one is not worth the learner's minutes

  // target = { id, vocabulary: [{term, w}], must: [terms], wantPrimary }
  function fitScore(text, target) {
    const lower = String(text || "").toLowerCase();
    const has = (t) => new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(lower);
    if ((target.must || []).length && !target.must.some(has)) return 0;
    let got = 0, all = 0;
    for (const v of target.vocabulary || []) {
      all += v.w;
      if (has(v.term)) got += v.w;
    }
    return all ? got / all : 0;
  }
  // meta = what the adapter could measure: { headings, extlinks, badge, ageDays }; unknowns count as unknown, not as good
  function evidenceScore(meta) {
    const m = meta || {};
    const known = ["headings", "extlinks", "badge"].filter((k) => m[k] !== undefined && m[k] !== null).length;
    const e = 0.4 * clamp((m.extlinks || 0) / 40) + 0.3 * clamp((m.headings || 0) / 10) + 0.3 * (m.badge === "featured" ? 1 : m.badge === "good" ? 0.8 : 0);
    return { score: e, known };
  }

  function score(cand, target, ctx) {
    ctx = ctx || {};
    const text = cand.text || "",
      n = wc(text),
      comp = cand.compiled,
      donorWords = comp ? comp.keys.reduce((a, k) => a + wc(k.text), 0) : 0,
      ev = evidenceScore(cand.meta),
      capMin = comp && comp.estimates ? comp.estimates.capsuleMinutes : Math.max(6, n / 250);
    const s = {
      fit: fitScore(text, target),
      evidence: ev.score,
      compression: n ? clamp(1 - donorWords / n, 0, 0.95) : 0,
      novelty: ctx.known && ctx.known.has(cand.hash) ? 0 : 1,
      time: clamp(1 - capMin / 45),
    };
    const uncertainty = clamp(1 - (0.5 * ev.score + 0.3 * clamp(n / 2000) + 0.2 * (cand.license && cand.license.ok ? 1 : 0)) + (ev.known < 2 ? 0.15 : 0));
    return { scores: s, uncertainty, words: n, capsuleMinutes: capMin };
  }

  function select(cands, target, ctx, opts) {
    ctx = ctx || {};
    // smallest sufficient set (Constitution section 6): at most three sources. A primary source is judged on the concept, not on modern vocabulary.
    opts = Object.assign({ max: 3, minEV: 0.3, minFit: 0.25, minFitPrimary: 0.15, minWords: 250 }, opts || {});
    const rejected = [], pool = [];
    for (const c of cands) {
      const why = [];
      if (ctx.memory && isRejected(ctx.memory, c.id)) why.push("rejected in an earlier cycle (" + ctx.memory.sources[c.id].decision.why + ")");
      if (!c.license || !c.license.ok) why.push("licence not on the allow-list (" + ((c.license && c.license.id) || "unknown") + "): remembered, never ingested");
      if (!why.length && wc(c.text) < opts.minWords) why.push("too short to carry a model (" + wc(c.text) + " words)");
      if (!why.length && !c.compiled) why.push("Reader OS could not compile it (" + (c.compileError || "unreadable") + ")");
      const sc = why.length ? null : score(c, target, ctx);
      const floor = c.kind === "primary" ? opts.minFitPrimary : opts.minFit;
      if (sc && sc.scores.fit < floor) why.push("off target: fit " + sc.scores.fit.toFixed(2) + " < " + floor);
      if (why.length) rejected.push({ id: c.id, title: c.title, reason: why.join("; ") });
      else pool.push(Object.assign({ cand: c }, sc));
    }
    const chosen = [], kinds = new Set();
    const termSets = new Map(pool.map((p) => [p.cand.id, topTerms(p.cand.text)])), shingleSets = new Map(pool.map((p) => [p.cand.id, shingles(p.cand.text)]));
    const redundancy = (a, b) => Math.max(containment(shingleSets.get(a.cand.id), shingleSets.get(b.cand.id)), Math.min(1, 2 * jaccard(termSets.get(a.cand.id), termSets.get(b.cand.id))));
    for (let round = 0; round < opts.max && pool.length; round++) {
      let best = null;
      for (const p of pool) {
        const kind = p.cand.kind || "reference",
          kindGap = !kinds.has(kind) ? (kind === "primary" ? (target.wantPrimary ? 1 : 0.4) : 1) : 0.2,
          red = chosen.length ? Math.max(...chosen.map((q) => redundancy(p, q))) : 0,
          ev = Object.entries(WEIGHTS).reduce((a, [k, w]) => a + w * (k === "kindGap" ? kindGap : p.scores[k]), 0) - REDUNDANCY_PENALTY * red;
        if (!best || ev > best.ev) best = { p, ev, kindGap, red };
      }
      if (!best || best.ev < opts.minEV) break;
      if (best.red >= REDUNDANCY_CUTOFF) { // this and anything like it would only repeat what is chosen: turn it away with its reason
        rejected.push({ id: best.p.cand.id, title: best.p.cand.title, reason: "redundant: " + Math.round(best.red * 100) + "% of it repeats an already chosen source, so it would spend the learner's minutes twice" });
        pool.splice(pool.findIndex((x) => x === best.p), 1);
        round--;
        continue;
      }
      const ch = Object.assign({}, best.p, { ev: best.ev, kindGap: best.kindGap, redundancy: best.red, rank: chosen.length + 1 });
      ch.why = "rank " + ch.rank + ": value " + ch.ev.toFixed(2) + " (fit " + ch.scores.fit.toFixed(2) + ", evidence " + ch.scores.evidence.toFixed(2) + ", compressibility " + ch.scores.compression.toFixed(2) + ", novelty " + ch.scores.novelty + ", kind gap " + ch.kindGap + ", redundancy -" + (REDUNDANCY_PENALTY * ch.redundancy).toFixed(2) + "); uncertainty " + ch.uncertainty.toFixed(2);
      chosen.push(ch);
      kinds.add(ch.cand.kind || "reference");
      pool.splice(pool.findIndex((x) => x === best.p), 1);
    }
    // Reserved slot (Constitution sections 21 and 32: do not let the curriculum drift toward whatever is easiest to generate).
    // Primary sources carry no link or heading counts, so a measured-evidence score always favours encyclopedia pages;
    // when the target asks for a primary experience and a qualifying one is in the pool, it takes the last slot.
    if (target.wantPrimary && !chosen.some((c) => (c.cand.kind || "reference") === "primary")) {
      const prim = pool.filter((p) => (p.cand.kind || "reference") === "primary").sort((a, b) => b.scores.fit - a.scores.fit)[0];
      const red = prim && chosen.length ? Math.max(...chosen.map((q) => redundancy(prim, q))) : 0;
      if (prim && red < REDUNDANCY_CUTOFF) {
        const dropped = chosen.length >= opts.max ? chosen.pop() : null;
        if (dropped) pool.push({ cand: dropped.cand, scores: dropped.scores, uncertainty: dropped.uncertainty, words: dropped.words, capsuleMinutes: dropped.capsuleMinutes });
        const rank = chosen.length + 1;
        const f2 = (x) => x.toFixed(2),
          why = "rank " + rank + ": reserved slot for a primary experience the target asks for (fit " + f2(prim.scores.fit) + ", evidence " + f2(prim.scores.evidence) + ", compressibility " + f2(prim.scores.compression) + ", novelty " + prim.scores.novelty + ", kind gap 1, redundancy -" + f2(REDUNDANCY_PENALTY * red) + "); uncertainty " + f2(prim.uncertainty) + (dropped ? "; it displaced " + dropped.cand.title + " (rank " + dropped.rank + ")" : "");
        chosen.push(Object.assign({}, prim, { ev: null, kindGap: 1, redundancy: red, rank, reserved: true, why }));
        pool.splice(pool.indexOf(prim), 1);
      }
    }
    for (const p of pool) {
      // an honest reason for every source left over: repeats a chosen one, or simply did not make the (at most) three
      const red = chosen.length ? Math.max(...chosen.map((q) => redundancy(p, q))) : 0;
      rejected.push({ id: p.cand.id, title: p.cand.title, reason: red >= REDUNDANCY_CUTOFF ? "redundant: " + Math.round(red * 100) + "% of it repeats an already chosen source, so it would spend the learner's minutes twice" : "not chosen: it would add little beyond the " + chosen.length + " chosen sources, or the " + opts.max + "-source limit was reached (fit " + p.scores.fit.toFixed(2) + ", would add " + (p.cand.kind || "reference") + ", overlap " + Math.round(red * 100) + "%)" });
    }
    return { selected: chosen, rejected };
  }

  /* ───────── candidate experience compiler (extractive: it composes, it does not invent) ───────── */
  const KIND_ORDER = { argument: 0, counter: 1, evidence: 2, synthesis: 3, transfer: 4 };
  async function compileExperience(target, selected, now) {
    const sources = selected.map((s) => s.cand);
    const hashes = await Promise.all(sources.map((c) => sha256(c.text)));
    const id = "hx-" + (await sha256(target.id + "|" + hashes.slice().sort().join("|"))).slice(0, 12);
    const claims = [], contrast = [], retrieval = [], retrievalPool = [];
    for (const c of sources) {
      const comp = c.compiled,
        want = (t) => fitScore(t, { vocabulary: target.vocabulary, must: [] }) > 0;
      const keyed = comp.keys.filter((k) => want(k.text)).slice(0, 3);
      for (const k of (keyed.length ? keyed : comp.keys.slice(0, 2)).slice(0, 2)) claims.push({ src: c.id, anchor: k.anchor, text: k.text });
      for (const x of (comp.counter || []).slice(0, 1)) contrast.push({ src: c.id, anchor: x.anchor, text: x.text });
      for (const x of (comp.verify || []).slice(0, 1)) contrast.push({ src: c.id, anchor: x.anchor, text: x.text, kind: "evidence" });
      retrievalPool.push(comp.questions.filter((q) => q.kind && q.kind !== "cloze").sort((a, b) => (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9)).map((q) => ({ src: c.id, kind: q.kind, stem: q.stem, answer: q.answer, anchor: q.anchor })));
    }
    // at most eight retrieval prompts, taken round-robin across sources in order of kind, so no one source dominates
    for (let i = 0; retrieval.length < 8 && retrievalPool.some((l) => l[i]); i++) for (const l of retrievalPool) if (l[i] && retrieval.length < 8) retrieval.push(l[i]);
    // honest minutes from the steps themselves: reading the claims, the retrieval prompts, then the transfer and reality tasks
    const readWords = [...claims, ...contrast].reduce((a, c) => a + wc(c.text), 0),
      minutes = Math.ceil(readWords / 180 + retrieval.length * 1.2 + 4 + 2);
    return {
      id, status: "CANDIDATE", version: VERSION, target: { id: target.id, capability: target.capability, domain: target.domain },
      title: target.title || target.capability,
      sources: sources.map((c, i) => ({ id: c.id, title: c.title, kind: c.kind || "reference", url: c.url, revision: c.revision, retrievedAt: c.retrievedAt, license: c.license.id, attribution: c.attribution || null, contentSha256: hashes[i], words: wc(c.text), readerVerdict: c.compiled.verdict ? c.compiled.verdict.label : null, whyChosen: selected[i].why })),
      steps: [
        { id: "model", type: "claims", title: "The model, in the sources' own words", claims },
        { id: "contrast", type: "contrast", title: "Where the sources limit, qualify or test the claim", items: contrast },
        { id: "retrieve", type: "retrieval", title: "Reconstruct it without looking", items: retrieval },
        { id: "transfer", type: "transfer", title: "Far transfer", prompt: target.transfer, needsHumanReview: true },
        { id: "reality", type: "reality", title: "Reality task", prompt: target.reality, needsHumanReview: true },
      ],
      minutes, createdAt: now || null,
      lifecycle: [{ t: now || null, to: "CANDIDATE", by: "world-harvester", note: "generated; not certified" }],
      approvals: [],
    };
  }

  /* ───────── quality gates: automated PRE-checks. They can block a candidate; they can never approve one. ───────── */
  // texts = { sourceId: text } as stored; memory = optional World Harvester memory
  async function gates(exp, texts, memory) {
    const G = [], add = (id, block, ok, why) => G.push({ id, block, ok: !!ok, why });
    const srcs = exp.sources || [];
    add("G1 licence", true, srcs.length && srcs.every((s) => normLicense(s.license).ok), "every source's licence is on the allow-list (" + srcs.map((s) => s.license).join(", ") + ")");
    add("G2 provenance", true, srcs.every((s) => s.url && s.revision && s.retrievedAt && s.contentSha256 && s.license && s.whyChosen), "url, revision, retrieval time, content hash, licence and why-chosen recorded for every source");
    add("G3 attribution", true, srcs.every((s) => !normLicense(s.license).attribution || s.attribution), "attribution carried wherever the licence requires it");
    let bad = [];
    for (const st of exp.steps || []) for (const c of st.claims || st.items || []) if (c.src && c.text && !(texts[c.src] || "").includes(c.text)) bad.push(c.src + ":" + c.text.slice(0, 40));
    add("G4 verbatim", true, !bad.length && Object.keys(texts || {}).length > 0, bad.length ? "claims not found in their source: " + bad.slice(0, 3).join(" | ") : "every claim and contrast item is a verbatim substring of its source");
    let mism = [];
    for (const s of srcs) if (texts[s.id] === undefined || (await sha256(texts[s.id])) !== s.contentSha256) mism.push(s.id);
    add("G5 integrity", true, !mism.length, mism.length ? "stored text does not match its recorded hash: " + mism.join(", ") : "stored text matches the recorded SHA-256 for every source");
    const model = (exp.steps.find((x) => x.id === "model") || {}).claims || [];
    add("G6 synthesis", false, new Set(model.map((c) => c.src)).size >= 2, "the model draws on at least two independent sources (otherwise it is a single-source summary and is labelled so)");
    add("G7 contrast", true, ((exp.steps.find((x) => x.id === "contrast") || {}).items || []).length >= 1, "at least one limitation, qualification or test is preserved, so the claim is not presented as unchallenged");
    const rk = (exp.steps.find((x) => x.id === "retrieve") || {}).items || [];
    add("G8 retrieval", true, rk.length >= 3 && new Set(rk.map((x) => x.kind)).size >= 2, "at least three retrieval prompts of at least two deep kinds (" + rk.length + ")");
    const prim = srcs.filter((s) => s.kind === "primary");
    add("G9 primary law", true, prim.every((s) => /BRIDGE/.test(s.readerVerdict || "")), "a primary literary or artistic source is a bridge to the work, never 'replaced'");
    add("G10 not rejected", true, !(memory && srcs.some((s) => isRejected(memory, s.id))), "no source was rejected in an earlier cycle");
    add("G11 no self-certification", true, exp.status === "CANDIDATE" && !(exp.approvals || []).length && exp.lifecycle.every((e) => e.by === "world-harvester" || e.by === "human"), "the candidate is generated, not certified: status CANDIDATE, no approvals");
    add("G13 fits a day", false, exp.minutes <= 35, "the experience takes " + exp.minutes + " minutes (advisory ceiling 35)");
    add("G12 human review of transfer", false, true, "the transfer prompt and reality task were drafted by the machine and are marked for the learner's review");
    return { ok: G.filter((g) => g.block).every((g) => g.ok), gates: G };
  }

  // The only way out of CANDIDATE. A human approval is required; the machine never calls this on its own behalf.
  function promote(exp, approval, gateResult) {
    if (!approval || approval.by !== "human" || approval.token !== PROMOTE_TOKEN) throw new Error("promotion needs a human approval: AI may generate candidates but may not certify them");
    if (!gateResult || !gateResult.ok) throw new Error("promotion refused: the blocking quality gates have not all passed");
    if (exp.status !== "CANDIDATE") throw new Error("only a CANDIDATE can be promoted to PILOT");
    const out = Object.assign({}, exp, { status: "PILOT", approvals: exp.approvals.concat([{ by: "human", t: approval.t || null, note: approval.note || "" }]) });
    out.lifecycle = exp.lifecycle.concat([{ t: approval.t || null, to: "PILOT", by: "human", note: approval.note || "" }]);
    return out;
  }

  /* ───────── the pack format the Node job writes and the page reads ───────── */
  const packOf = (c, extra) => Object.assign({
    id: c.id, title: c.title, kind: c.kind || "reference", url: c.url, revision: c.revision, retrievedAt: c.retrievedAt,
    license: c.license.id, attribution: c.attribution || null, language: c.language || "en", text: c.text,
  }, extra || {});

  // pack file name: only letters, digits, dot and dash, so it is the same on every file system and in every URL (one function for writer and page)
  const packName = (id) => String(id).replace(/[^A-Za-z0-9.-]+/g, "_") + ".json";

  const api = { packName, VERSION, PROMOTE_TOKEN, WEIGHTS, normalize, wc, sha256, normLicense, newMemory, remember, isRejected, fitScore, evidenceScore, score, select, compileExperience, gates, promote, packOf };

  /* ───────── browser host: load packs from the same origin, re-verify, digest into Reader OS, show in Campus ───────── */
  if (typeof window !== "undefined" && root === window) {
    const J = async (u) => {
      const r = await fetch(u, { cache: "no-store" });
      if (!r.ok) throw new Error(u + " → HTTP " + r.status);
      return r.json();
    };
    let INDEX = null;
    const packCache = new Map();
    const pack = async (id) => (packCache.has(id) ? packCache.get(id) : (packCache.set(id, J("/harvest/packs/" + packName(id))), packCache.get(id)));
    api.load = async () => (INDEX = await J("/harvest/index.json"));
    api.index = () => INDEX;
    api.experiences = () => (INDEX && INDEX.experiences) || [];
    // the browser does not trust the index: it re-fetches the packs and re-runs the blocking gates on the stored text
    api.verify = async (expId) => {
      const exp = api.experiences().find((e) => e.id === expId);
      if (!exp) throw new Error("unknown candidate " + expId);
      const texts = {};
      for (const s of exp.sources) texts[s.id] = (await pack(s.id)).text;
      return gates(exp, texts, null);
    };
    api.digest = async (expId) => {
      const R = root.RENAISSANCE_READER;
      if (!R || !R.digest) throw new Error("Reader OS digestion is not available");
      const exp = api.experiences().find((e) => e.id === expId),
        v = await api.verify(expId);
      if (!v.ok) throw new Error("quality gates failed; nothing was digested: " + v.gates.filter((g) => g.block && !g.ok).map((g) => g.id).join(", "));
      const out = [];
      for (const s of exp.sources) {
        const p = await pack(s.id);
        out.push(await R.digest(p.text, p.title, p.kind === "primary" ? "primary" : "auto", { via: "world-harvester", experience: exp.id, title: p.title, url: p.url, revision: p.revision, license: p.license, attribution: p.attribution, retrievedAt: p.retrievedAt, contentSha256: s.contentSha256, whyChosen: s.whyChosen }));
      }
      return out;
    };
    api.promote = (expId, approval) => api.verify(expId).then((v) => promote(api.experiences().find((e) => e.id === expId), approval, v));
    // the learner's own approval, recorded on this device only. Only a click in the Campus track calls this; no job, timer or model does.
    const LSK = "renaissance_harvest_v1";
    const store = () => { try { return JSON.parse(localStorage.getItem(LSK) || "{}"); } catch (_) { return {}; } };
    api.status = (expId) => (store().approved && store().approved[expId] ? "PILOT" : "CANDIDATE");
    api.approve = async (expId, note) => {
      const t = new Date().toISOString(), out = await api.promote(expId, { by: "human", token: PROMOTE_TOKEN, t, note: note || "approved in the Campus track" }), st = store();
      st.approved = Object.assign({}, st.approved, { [expId]: { t, note: note || "" } });
      try { localStorage.setItem(LSK, JSON.stringify(st)); } catch (_) {}
      return out;
    };
    root.RENAISSANCE_HARVEST = api;
  }
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
