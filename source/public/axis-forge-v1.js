/* AXIS FORGE v0.1 · cognitive organogenesis observer.
 *
 * Successor research organ to Renaissance v18.4. It does NOT alter curriculum,
 * generate content, call a network, or award itself authority. It watches the
 * learner's already-recorded Renaissance evidence, looks for capability
 * combinations that generalise across domains, and keeps them as hypotheses
 * until transfer evidence earns promotion.
 *
 * Storage isolation: axis_forge_v1. Kill switches:
 *   localStorage.axis_forge_off = "1"
 *   ?axisforge=off
 *
 * Evidence law:
 * - tags are not capability;
 * - one domain is not transfer;
 * - AI-assisted success does not count as unaided human evidence;
 * - an existing atom/compound may not be renamed "new";
 * - promotion requires cross-domain + real-world evidence AND explicit human approval.
 */
(function () {
  "use strict";

  const VERSION = "0.1";
  const KEY = "axis_forge_v1";
  const OFF_KEY = "axis_forge_off";
  const HUMAN_APPROVAL = "HUMAN_APPROVED";
  const STAGES = ["OBSERVED", "CANDIDATE", "PROBE", "REPLICATED", "TRANSFERRED", "PROMOTED", "REVOKED"];

  const safe = (f, d) => { try { return f(); } catch (_) { return d; } };
  const clamp01 = (x) => Math.max(0, Math.min(1, Number(x) || 0));
  const now = () => Date.now();
  const off = () =>
    safe(() => localStorage.getItem(OFF_KEY) === "1", false) ||
    safe(() => /[?&]axisforge=off\b/.test(location.search), false);

  const fresh = () => ({
    v: 1,
    version: VERSION,
    events: [],
    seen: {},
    candidates: {},
    decisions: [],
    lastScan: null,
    corruptRecoveredAt: null
  });

  let ST = null;

  function load() {
    if (ST) return ST;
    const raw = safe(() => localStorage.getItem(KEY), null);
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : null; } catch (_) { parsed = undefined; }
    const bad = parsed === undefined || (parsed !== null && (
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      parsed.v !== 1 ||
      !Array.isArray(parsed.events) ||
      !parsed.seen || typeof parsed.seen !== "object" || Array.isArray(parsed.seen) ||
      !parsed.candidates || typeof parsed.candidates !== "object" || Array.isArray(parsed.candidates) ||
      !Array.isArray(parsed.decisions)
    ));
    if (bad && raw) {
      const t = now();
      safe(() => localStorage.setItem(KEY + "_corrupt_" + t, raw));
      ST = fresh();
      ST.corruptRecoveredAt = t;
    } else {
      ST = parsed || fresh();
      const base = fresh();
      Object.keys(base).forEach((k) => { if (!(k in ST)) ST[k] = base[k]; });
    }
    return ST;
  }

  function save() {
    safe(() => localStorage.setItem(KEY, JSON.stringify(load())));
  }

  function genome() {
    return window.RENAISSANCE_GENOME || { atoms: {}, compounds: [] };
  }

  function validAtoms(xs) {
    const known = genome().atoms || {};
    const out = [];
    for (const x of Array.isArray(xs) ? xs : []) {
      const k = String(x || "").trim();
      if (k && known[k] && !out.includes(k)) out.push(k);
    }
    return out.sort();
  }

  function sig(atoms) {
    return validAtoms(atoms).join("+");
  }

  function sameSet(a, b) {
    const A = validAtoms(a), B = validAtoms(b);
    return A.length === B.length && A.every((x, i) => x === B[i]);
  }

  function novelty(atoms) {
    const A = validAtoms(atoms);
    if (A.length < 2) return { ok: false, code: "ATOM", why: "One known atom is not a new cognitive organ." };
    const hit = (genome().compounds || []).find((c) => sameSet(A, c.atoms || []));
    if (hit) return { ok: false, code: "KNOWN_COMPOUND", knownId: hit.id, why: "This exact combination already exists as " + (hit.name || hit.id) + "." };
    return { ok: true, code: "COMPOUND_CANDIDATE", why: "Not identical to a registered atom or compound; novelty remains unproven until transfer." };
  }

  function sessionDomain(sid) {
    const seasons = window.RENAISSANCE_SEASONS || [];
    for (const z of seasons) {
      for (const s of (z.sessions || [])) {
        if (s.id === sid) return s.domain || z.domain || "unknown";
      }
    }
    return sid === "probe" ? "sealed-probe" : "unknown";
  }

  function eventId(e) {
    return String(e.id || [e.t || 0, e.source || "manual", e.domain || "unknown", (e.atoms || []).join("."), e.taskId || e.item || ""].join(":"));
  }

  function normaliseEvent(raw) {
    const atoms = validAtoms(raw.atoms);
    return {
      id: eventId(raw),
      t: Number(raw.t) || now(),
      source: raw.source || "manual",
      taskId: raw.taskId || raw.item || "",
      domain: raw.domain || "unknown",
      atoms,
      success: !!raw.success,
      unaided: !!raw.unaided,
      aiHelp: !!raw.aiHelp,
      realWorld: !!raw.realWorld,
      heldOut: !!raw.heldOut,
      note: raw.note ? String(raw.note).slice(0, 500) : ""
    };
  }

  function candidateFor(atoms) {
    const id = sig(atoms);
    if (!id) return null;
    const st = load();
    if (!st.candidates[id]) {
      st.candidates[id] = {
        id,
        atoms: validAtoms(atoms),
        name: "latent compound · " + validAtoms(atoms).join(" × "),
        definition: "",
        stage: "OBSERVED",
        revoked: false,
        createdAt: now(),
        updatedAt: now(),
        evidence: {
          n: 0, successes: 0, unaidedSuccesses: 0, aiAssistedSuccesses: 0,
          realWorldSuccesses: 0, heldOutSuccesses: 0, domains: {}, tasks: {}
        },
        novelty: novelty(atoms),
        history: []
      };
    }
    return st.candidates[id];
  }

  function evidenceFor(c) {
    const e = c.evidence || {};
    const n = e.n || 0, ok = e.successes || 0;
    const domains = Object.keys(e.domains || {}).filter((d) => {
      const x = e.domains[d] || {};
      return (x.unaidedSuccesses || 0) > 0;
    });
    return {
      n,
      successes: ok,
      successRate: n ? ok / n : null,
      unaidedSuccesses: e.unaidedSuccesses || 0,
      aiAssistedSuccesses: e.aiAssistedSuccesses || 0,
      realWorldSuccesses: e.realWorldSuccesses || 0,
      heldOutSuccesses: e.heldOutSuccesses || 0,
      domains,
      domainCount: domains.length,
      tasks: Object.keys(e.tasks || {}).length
    };
  }

  function stageFor(c) {
    if (c.revoked) return "REVOKED";
    if (c.stage === "PROMOTED") return "PROMOTED";
    if (!c.novelty || !c.novelty.ok) return "OBSERVED";
    const x = evidenceFor(c);
    if (x.n >= 15 && x.domainCount >= 3 && x.unaidedSuccesses >= 8 &&
        x.realWorldSuccesses >= 2 && x.heldOutSuccesses >= 2 &&
        x.successRate != null && x.successRate >= 0.70) return "TRANSFERRED";
    if (x.n >= 10 && x.domainCount >= 2 && x.unaidedSuccesses >= 6 &&
        x.successRate != null && x.successRate >= 0.65) return "REPLICATED";
    if (x.n >= 6 && x.domainCount >= 2 && x.unaidedSuccesses >= 3) return "PROBE";
    if (x.n >= 3) return "CANDIDATE";
    return "OBSERVED";
  }

  function updateStage(c) {
    const prev = c.stage;
    const next = stageFor(c);
    if (next !== prev) {
      c.stage = next;
      c.history = c.history || [];
      c.history.push({ t: now(), from: prev, to: next, evidence: evidenceFor(c) });
    }
    c.updatedAt = now();
  }

  function attachEvidence(c, ev) {
    const e = c.evidence;
    e.n++;
    if (ev.success) e.successes++;
    if (ev.success && ev.unaided && !ev.aiHelp) e.unaidedSuccesses++;
    if (ev.success && ev.aiHelp) e.aiAssistedSuccesses++;
    if (ev.success && ev.realWorld && ev.unaided && !ev.aiHelp) e.realWorldSuccesses++;
    if (ev.success && ev.heldOut && ev.unaided && !ev.aiHelp) e.heldOutSuccesses++;
    const d = e.domains[ev.domain] = e.domains[ev.domain] || { n: 0, successes: 0, unaidedSuccesses: 0 };
    d.n++;
    if (ev.success) d.successes++;
    if (ev.success && ev.unaided && !ev.aiHelp) d.unaidedSuccesses++;
    if (ev.taskId) e.tasks[ev.taskId] = true;
    updateStage(c);
  }

  function combinations(atoms) {
    const A = validAtoms(atoms);
    const out = [];
    for (let i = 0; i < A.length; i++) {
      for (let j = i + 1; j < A.length; j++) out.push([A[i], A[j]]);
    }
    if (A.length >= 3) {
      for (let i = 0; i < A.length - 2; i++) {
        for (let j = i + 1; j < A.length - 1; j++) {
          for (let k = j + 1; k < A.length; k++) out.push([A[i], A[j], A[k]]);
        }
      }
    }
    return out;
  }

  function observe(raw) {
    if (off()) return { ok: false, why: "off" };
    const ev = normaliseEvent(raw || {});
    if (!ev.atoms.length) return { ok: false, why: "no registered atoms" };
    const st = load();
    if (st.seen[ev.id]) return { ok: true, duplicate: true, id: ev.id };
    st.seen[ev.id] = true;
    st.events.push(ev);
    if (st.events.length > 5000) st.events.splice(0, st.events.length - 5000);

    // A single atom may be observed for lineage but cannot become a new organ.
    const single = candidateFor(ev.atoms);
    if (single) attachEvidence(single, ev);

    // Actual organ hypotheses are pair/triple combinations, not renamed tags.
    for (const atoms of combinations(ev.atoms)) {
      const c = candidateFor(atoms);
      if (c) attachEvidence(c, ev);
    }
    save();
    return { ok: true, id: ev.id };
  }

  function scan() {
    if (off()) return { ok: false, why: "off", added: 0 };
    if (!window.RENAISSANCE || typeof window.RENAISSANCE.state !== "function") return { ok: false, why: "renaissance unavailable", added: 0 };
    const rs = safe(() => window.RENAISSANCE.state(), null);
    if (!rs) return { ok: false, why: "renaissance state unavailable", added: 0 };
    let added = 0;
    for (const a of (rs.answers || [])) {
      if (!Array.isArray(a.atoms) || !a.atoms.length) continue;
      const ev = {
        id: "renaissance:" + a.t + ":" + a.sid + ":" + a.item,
        t: a.t,
        source: "renaissance",
        taskId: a.item,
        domain: sessionDomain(a.sid),
        atoms: a.atoms,
        success: !!a.ok,
        unaided: !a.hinted && /transfer|far|alien|hook|challenge|probe/.test(a.kind || ""),
        aiHelp: false,
        realWorld: false,
        heldOut: /alien|probe/.test(a.kind || "")
      };
      const before = !!load().seen[ev.id];
      observe(ev);
      if (!before && load().seen[ev.id]) added++;
    }
    load().lastScan = now();
    save();
    return { ok: true, added, totalEvents: load().events.length };
  }

  function probe(id) {
    const c = load().candidates[id];
    if (!c) return null;
    const x = evidenceFor(c);
    const commonDomains = ["medicine", "science", "history", "literature", "mathematics", "business", "social", "physical", "creation"];
    const missing = commonDomains.filter((d) => !x.domains.includes(d));
    return {
      id,
      hypothesis: c.definition || c.name,
      atoms: c.atoms.slice(),
      currentStage: c.stage,
      novelty: c.novelty,
      evidence: x,
      nextTest: {
        domain: missing[0] || "new-unseen-domain",
        rules: [
          "Use a task not used to train this combination.",
          "Commit before feedback.",
          "No AI, hints, notes, or answer-key access during the attempt.",
          "Record success/failure and confidence.",
          "Prefer a real consequence or held-out task over another in-app quiz."
        ],
        promotionFloor: "At least 15 observations, 3 domains, 8 unaided successes, 2 held-out successes, 2 real-world successes, and >=70% overall success."
      }
    };
  }

  function annotate(id, name, definition) {
    const c = load().candidates[id];
    if (!c) return { ok: false, why: "unknown candidate" };
    if (name) c.name = String(name).slice(0, 120);
    if (definition) c.definition = String(definition).slice(0, 1000);
    c.updatedAt = now();
    save();
    return { ok: true, candidate: JSON.parse(JSON.stringify(c)) };
  }

  function promote(id, approval) {
    const st = load(), c = st.candidates[id];
    if (!c) return { ok: false, why: "unknown candidate" };
    updateStage(c);
    if (approval !== HUMAN_APPROVAL) return { ok: false, why: "explicit human approval required" };
    if (c.stage !== "TRANSFERRED") return { ok: false, why: "transfer evidence not sufficient", stage: c.stage, evidence: evidenceFor(c) };
    const prev = c.stage;
    c.stage = "PROMOTED";
    c.promotedAt = now();
    c.history.push({ t: now(), from: prev, to: "PROMOTED", evidence: evidenceFor(c), humanApproved: true });
    st.decisions.push({ t: now(), id, action: "PROMOTE", humanApproved: true });
    save();
    return { ok: true, candidate: JSON.parse(JSON.stringify(c)) };
  }

  function revoke(id, reason) {
    const st = load(), c = st.candidates[id];
    if (!c) return { ok: false, why: "unknown candidate" };
    const prev = c.stage;
    c.revoked = true;
    c.stage = "REVOKED";
    c.revokedAt = now();
    c.revocationReason = String(reason || "evidence no longer supports the hypothesis").slice(0, 500);
    c.history.push({ t: now(), from: prev, to: "REVOKED", reason: c.revocationReason });
    st.decisions.push({ t: now(), id, action: "REVOKE", reason: c.revocationReason });
    save();
    return { ok: true };
  }

  /* Future-AI obsolescence filter.
   * This is a curriculum allocation heuristic, NOT a forecast of AGI dates.
   * 0..1 fields describe the task/capability, not current model performance.
   */
  function aiFilter(spec) {
    const x = spec || {};
    const machinePressure =
      0.25 * clamp01(x.digital) +
      0.20 * clamp01(x.specified) +
      0.20 * clamp01(x.verifiable) +
      0.15 * clamp01(x.repeatable) +
      0.20 * clamp01(x.dataRich);
    const humanValue =
      0.20 * clamp01(x.embodiment) +
      0.20 * clamp01(x.judgment) +
      0.15 * clamp01(x.culture) +
      0.15 * clamp01(x.sovereignty) +
      0.15 * clamp01(x.mindTransform) +
      0.15 * clamp01(x.creation);
    const complement = clamp01(x.aiComplementarity);

    let allocation;
    if (clamp01(x.embodiment) >= 0.65) allocation = "EMBODY";
    else if (clamp01(x.culture) >= 0.65 && clamp01(x.mindTransform) >= 0.45) allocation = "EXPERIENCE";
    else if (machinePressure >= 0.65 && (humanValue >= 0.55 || complement >= 0.65)) allocation = "COEVOLVE";
    else if (clamp01(x.judgment) >= 0.65 || clamp01(x.sovereignty) >= 0.65 || clamp01(x.mindTransform) >= 0.65) allocation = "INTERNALIZE";
    else if (machinePressure >= 0.65 && humanValue < 0.45) allocation = "OUTSOURCE";
    else allocation = "COEVOLVE";

    return {
      allocation,
      machinePressure: +machinePressure.toFixed(3),
      humanValue: +humanValue.toFixed(3),
      aiComplementarity: +complement.toFixed(3),
      note: "Heuristic allocation under stronger-future-AI assumptions; not an AGI timeline or replacement probability."
    };
  }

  function candidates() {
    const xs = Object.values(load().candidates).map((c) => {
      updateStage(c);
      return Object.assign({}, JSON.parse(JSON.stringify(c)), { evidenceSummary: evidenceFor(c) });
    });
    save();
    const rank = { PROMOTED: 7, TRANSFERRED: 6, REPLICATED: 5, PROBE: 4, CANDIDATE: 3, OBSERVED: 2, REVOKED: 1 };
    return xs.sort((a, b) => (rank[b.stage] - rank[a.stage]) || (b.evidenceSummary.unaidedSuccesses - a.evidenceSummary.unaidedSuccesses) || a.id.localeCompare(b.id));
  }

  function exportState() {
    return JSON.parse(JSON.stringify({ schema: "axis-forge.state/1", exported: new Date().toISOString(), app: VERSION, state: load() }));
  }

  function importState(obj) {
    if (!obj || obj.schema !== "axis-forge.state/1" || !obj.state || obj.state.v !== 1) return { ok: false, why: "not an Axis Forge export" };
    const dst = load(), src = obj.state;
    let added = 0;
    for (const ev of (src.events || [])) {
      if (!dst.seen[eventId(ev)]) {
        observe(ev);
        added++;
      }
    }
    for (const [id, c] of Object.entries(src.candidates || {})) {
      if (!dst.candidates[id]) dst.candidates[id] = c;
      else if ((c.updatedAt || 0) > (dst.candidates[id].updatedAt || 0) && dst.candidates[id].stage !== "PROMOTED") {
        // Never overwrite a local promoted decision during import.
        dst.candidates[id] = c;
      }
    }
    save();
    return { ok: true, eventsAdded: added };
  }

  window.AXIS_FORGE = {
    version: VERSION,
    stages: STAGES.slice(),
    approvalToken: HUMAN_APPROVAL,
    state: () => JSON.parse(JSON.stringify(load())),
    reset: () => { ST = fresh(); save(); return true; },
    scan,
    observe,
    candidates,
    candidate: (id) => {
      const c = load().candidates[id];
      return c ? Object.assign({}, JSON.parse(JSON.stringify(c)), { evidenceSummary: evidenceFor(c) }) : null;
    },
    probe,
    annotate,
    promote,
    revoke,
    aiFilter,
    novelty,
    export: exportState,
    import: importState
  };

  // Passive only: read existing evidence. No network, no curriculum mutation.
  if (!off()) scan();

  // If another tab records Renaissance answers, rescan. No writes to Renaissance.
  safe(() => window.addEventListener("storage", (e) => {
    if (e.key === "renaissance_v1") scan();
  }));
})();