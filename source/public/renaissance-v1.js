/* RENAISSANCE v1 · the second organ of INTELLECTUALITY.
 *
 * Opens only after the day's medicine is finished (the CNS engine says STOP). One question, one CONTINUE button;
 * behind it: committed predictions with confidence, every wrong option pre-diagnosed and repaired, alternative
 * representations, an interactive model, two cases compared, near and far transfer, a bounded FORGE, and retrieval
 * hooks that come back in later sessions without hints. Missing a day costs nothing.
 *
 * Isolation from medicine: own files, own storage key ("renaissance_v1"), own DOM root (#rnRoot). It never writes
 * the CNS state; it only reads nextAction() to know the day is done.
 * Kill switches: ENABLED below · localStorage.renaissance_off = "1" · ?renaissance=off
 * Design and evidence: docs/RENAISSANCE/.
 */
(function () {
  "use strict";
  const ENABLED = true;
  const VERSION = "1.0";
  const KEY = "renaissance_v1";
  const EXAM_DAY = "2026-11-15";
  const DOSE = { full: 25, short: 10, deep: 45 };
  const WEEK_CAP = 245; // minutes in 7 days before the dose shrinks
  const WEEK_STOP = 300; // minutes in 7 days before Renaissance rests
  const CONF = { sure: 0.9, think: 0.7, guess: 0.45 };
  const BUGS = {
    surface: "Surface pattern",
    inversion: "Cause and effect flipped",
    agent: "Wrong actor",
    willpower: "Willpower model",
    omission: "Mechanism left out",
    baserate: "Base rate ignored",
    inverse: "Condition turned around",
    nodelay: "Delay ignored",
    gain: "Over-correction",
    proxy: "Measure taken for the goal",
    confirm: "Confirmation only",
    authority: "Authority instead of evidence",
    consistency: "Preferences assumed stable",
    cheapexit: "Exit too cheap",
    selection: "Filter not seen",
    rigid: "No escape hatch",
    moral: "Moral instead of mechanism",
    independence: "Independence assumed",
    scale: "Wrong scale",
    confound: "Confound left in",
    pretension: "Sounds clever, says less",
    linear: "Linear thinking about growth",
    posthoc: "After it, so because of it",
    irrelevant: "An answer that would change nothing",
    notconstraint: "Improving a step that isn't the constraint",
  };
  // cognitive x-ray (§76): the mechanism most likely missing behind each diagnosed error
  const XRAY_OF = {
    surface: "false analogy", inversion: "causal direction", agent: "causal direction", willpower: "a missing model of your later self", omission: "a missing mechanism",
    baserate: "a missing prior", inverse: "a condition turned round (formalism)", nodelay: "a missing spatial or time model", gain: "overgeneralisation", proxy: "a bad representation of the goal",
    confirm: "undergeneralisation of the test", authority: "a prior taken from prestige", consistency: "overgeneralisation", cheapexit: "a missing model of your later self", selection: "a bad representation (the filter is invisible)",
    rigid: "overgeneralisation", moral: "a missing mechanism", independence: "a missing prior", scale: "wrong scale", confound: "a missing variable", pretension: "vocabulary instead of structure",
    linear: "wrong scale", posthoc: "causal direction", irrelevant: "a missing decision model", notconstraint: "a missing model of the flow",
  };
  // capability atoms (docs/RENAISSANCE/omega/01_GENOME.md): what a step trains, in plain words
  const ATOMS = {
    causal: "causal reasoning", mech: "mechanistic decomposition", prob: "probabilistic thinking", counter: "counterfactual simulation",
    model: "model selection", scale: "scaling and growth", abstr: "abstraction", compress: "compression", analogy: "analogy that keeps mechanism",
    falsify: "falsification", calib: "calibration", predict: "prediction", synth: "synthesis", represent: "representation switching",
    strategy: "strategic reasoning", narrative: "narrative reasoning", taste: "aesthetic discrimination", question: "question selection",
    recomb: "creative recombination", experiment: "experimental design", constraint: "constraint reasoning", systems: "systems thinking",
    info: "information reasoning", judgment: "judgment", selfmodel: "modelling your future self", measure: "measurement design",
    orient: "orienting in an unknown domain", minimal: "finding the minimum sufficient model",
  };

  const safe = (f, d) => {
    try {
      return f();
    } catch (e) {
      return d;
    }
  };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // **bold** · [[term]] opens the three-layer vocabulary card · paragraphs on blank lines
  const md = (s) =>
    String(s || "")
      .split(/\n\s*\n/)
      .map((p) => "<p>" + E(p).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*\w])\*([^*\n]+?)\*(?![*\w])/g, "$1<i>$2</i>").replace(/\[\[(.+?)(?:\|(.+?))?\]\]/g, (m, k, label) => '<button type="button" class="rnTerm" data-rn="term" data-k="' + E(k) + '">' + E(label || k) + "</button>") + "</p>")
      .join("");
  const off = () => !ENABLED || safe(() => localStorage.getItem("renaissance_off") === "1", false) || /[?&]renaissance=off\b/.test(location.search);
  const pad = (n) => String(n).padStart(2, "0");
  // a stable shuffle per item: the right answer must never sit in a predictable place
  const perm = (id, n) => {
    let h = 2166136261;
    for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) {
      h = Math.imul(h ^ (h >>> 13), 1103515245) + 12345 >>> 0;
      const j = h % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const dayKey = (t) => t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  const addDays = (key, n) => {
    const [y, m, d] = key.split("-").map(Number);
    return dayKey(new Date(y, m - 1, d + n));
  };
  const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);
  const pretty = (key) => new Date(key + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  /* ───────────── storage (never the CNS state) ───────────── */
  const fresh = () => ({ v: 1, sessions: {}, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: "", probe: { start: null, done: {} }, exp: {}, picks: [], reads: {}, deeper: {}, forecasts: {} });
  let ST = null;
  // failure recovery: a record that cannot be read is kept aside (never deleted) and a clean one starts; the shape of
  // every field is checked so one bad value cannot break the organ
  const SHAPE = { sessions: "o", days: "o", answers: "a", hooks: "o", bugs: "o", xray: "o", reps: "o", clicks: "a", forge: "o", reality: "o", beliefs: "a", gov: "o", probe: "o", exp: "o", picks: "a", reads: "o", deeper: "o", forecasts: "o" };
  function load() {
    if (ST) return ST;
    const raw = safe(() => localStorage.getItem(KEY), null);
    ST = safe(() => JSON.parse(raw || "null"), undefined);
    let broken = ST === undefined || (ST !== null && (typeof ST !== "object" || Array.isArray(ST) || ST.v !== 1));
    if (!broken && ST) for (const [k, t] of Object.entries(SHAPE)) if (k in ST && (t === "a" ? !Array.isArray(ST[k]) : !ST[k] || typeof ST[k] !== "object" || Array.isArray(ST[k]))) broken = true;
    if (broken && raw) {
      const at = Date.now();
      safe(() => localStorage.setItem(KEY + "_corrupt_" + at, raw));
      ST = fresh();
      ST.recovered = at;
    } else if (!ST) ST = fresh();
    for (const [k, v] of Object.entries(fresh())) if (!(k in ST)) ST[k] = v;
    if (!ST.probe.done) ST.probe.done = {};
    return ST;
  }
  function save() {
    safe(() => localStorage.setItem(KEY, JSON.stringify(load())));
  }

  /* ───────────── content ───────────── */
  const seasons = () => window.RENAISSANCE_SEASONS || [];
  const season = () => seasons()[0] || null;
  const allSessions = () => seasons().flatMap((z) => z.sessions || []);
  const seasonOf = (sid) => seasons().find((z) => (z.sessions || []).some((s) => s.id === sid)) || null;
  const sessionById = (id) => allSessions().find((s) => s.id === id) || null;
  const lookup = (kind, id) => {
    const own = P && P.sid ? seasonOf(P.sid)?.[kind]?.[id] : null;
    return own || seasons().map((z) => z[kind] && z[kind][id]).find(Boolean) || null;
  };
  const allHooks = () => {
    const out = {};
    for (const s of allSessions()) for (const h of s.hooks || []) out[h.id] = Object.assign({ sid: s.id }, h);
    return out;
  };

  /* ───────────── the gate: medicine first, life sovereign ───────────── */
  function cnsDone() {
    return safe(() => typeof nextAction === "function" && nextAction().kind === "STOP", false);
  }
  function weekMinutes(st, today) {
    let m = 0;
    for (let i = 0; i < 7; i++) m += st.days[addDays(today, -i)] || 0;
    return m;
  }
  function gate(at) {
    const t = at || new Date(),
      today = dayKey(t),
      st = load();
    if (off()) return { open: false, why: "off" };
    if (!season()) return { open: false, why: "nocontent" };
    if (!cnsDone()) return { open: false, why: "cns" };
    const toExam = daysBetween(today, EXAM_DAY);
    if (toExam >= 0 && toExam <= 2) return { open: false, why: "exam", msg: "Exam weekend. Medicine and sleep win; Renaissance waits until after the exam." };
    const h = t.getHours();
    if (h >= 1 && h < 5) return { open: false, why: "sleep", msg: "It is past 1 am. Sleep is worth more tonight than anything Renaissance can teach." };
    const week = weekMinutes(st, today);
    if (week >= WEEK_STOP) return { open: false, why: "week", msg: "Renaissance took " + Math.round(week) + " minutes this week. It rests today so the rest of your life keeps its time." };
    const doneToday = Object.values(st.sessions).some((s) => s.endDay === today);
    if (doneToday) return { open: false, why: "spent", msg: "Today's session is done. Nothing more is owed; the rest of the day is yours." };
    const reasons = [];
    let dose = DOSE.full;
    const spentToday = st.days[today] || 0;
    if (toExam >= 0 && toExam <= 7) {
      dose = DOSE.short;
      reasons.push("exam week");
    }
    if ((h === 23 && t.getMinutes() >= 30) || h === 0) {
      dose = DOSE.short;
      reasons.push("it is late");
    }
    if (week >= WEEK_CAP) {
      dose = DOSE.short;
      reasons.push("a heavy week (" + Math.round(week) + " min)");
    }
    if (spentToday >= dose + 10) return { open: false, why: "spent", msg: "You have given Renaissance " + Math.round(spentToday) + " minutes today. That is the dose; the rest of the day is yours." };
    const p = plan(st, dose, today, t);
    if (p && p.wait) return { open: false, why: "deepwait", msg: p.wait };
    if (!p) return { open: false, why: "seasondone", msg: "Every season written so far is complete. The next one is being built; nothing is due." };
    if (p.deep && !p.short) dose = DOSE.deep;
    return { open: true, dose, reasons, plan: p };
  }

  /* ───────────── the planner ───────────── */
  function dueHooks(st, today) {
    const H = allHooks();
    return Object.entries(st.hooks)
      .filter(([id, h]) => H[id] && !h.retired && h.due <= today)
      .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : (a[1].n || 0) - (b[1].n || 0) || (a[1].gap || 0) - (b[1].gap || 0)))
      .map(([id]) => H[id]);
  }
  // the order a session's steps are played in: authored, unless a step-order trial (L2) swaps the model and the two
  // compared cases, or a step-length trial (L3) drops optional depth steps
  function seq(s, st) {
    let steps = s.steps.slice();
    const i = steps.findIndex((x, k) => x.type === "model" && steps[k + 1] && steps[k + 1].type === "contrast");
    if (i >= 0 && armOf(st, "L2", s.id) === 1) steps = steps.slice(0, i).concat([steps[i + 1], steps[i]], steps.slice(i + 2));
    if (steps.some((x) => x.opt) && armOf(st, "L3", s.id) === 1) steps = steps.filter((x) => !x.opt);
    return steps;
  }
  function plan(st, dose, today, t) {
    const pick = choose(st, today, dose, t);
    const s = pick ? pick.s : null;
    const due = dueHooks(st, today);
    const probes = dueProbes(st, today, dose);
    if (!s && !due.length && !probes.length) return pick && pick.wait ? { wait: pick.wait } : null;
    const deep = !!(s && s.deep);
    const short = dose <= DOSE.short;
    const steps = [];
    const rec = s ? st.sessions[s.id] || {} : {};
    if (st.lastWarm !== today) {
      const lastForge = Object.entries(st.forge).sort((a, b) => (a[1].t < b[1].t ? 1 : -1))[0];
      if (lastForge && !st.reality[lastForge[0]]) steps.push({ id: "reality", type: "reality", stage: "warm", fid: lastForge[0], min: 0.5 });
      // interleave: the oldest due first, then a different session's idea, never two from one session
      const pickd = [];
      for (const h of due) if (pickd.length < (short ? 1 : 2) && !pickd.some((x) => x.sid === h.sid)) pickd.push(h);
      pickd.forEach((h) => steps.push({ id: "hook:" + h.id, type: "q", kind: "hook", stage: "warm", hook: h.id, min: 1.5, stem: h.q.stem, options: h.q.options, after: h.q.after }));
      probes.forEach((pr) => steps.push(pr));
    }
    let partial = false;
    if (s) {
      const order = seq(s, st);
      const from = rec.at ? Math.max(0, order.findIndex((x) => x.id === rec.at)) : 0;
      let budget = short ? DOSE.short - steps.reduce((a, x) => a + (x.min || 1), 0) - 1 : Infinity;
      for (const x of order.slice(from)) {
        if (short && x.opt) continue;
        if (short && budget < (x.min || 1) && steps.some((y) => y.stage !== "warm" && y.stage !== "probe")) {
          partial = true;
          break;
        }
        steps.push(x);
        budget -= x.min || 1;
      }
    }
    steps.push({ id: "close", type: "close", stage: "close", min: 1, partial });
    const start = 0;
    const minutes = Math.max(5, Math.round(steps.slice(start).reduce((a, x) => a + (x.min || 1), 0)));
    return { sid: s ? s.id : null, steps, minutes, short, start, partial, deep, why: pick ? pick.why : "", mode: pick ? pick.mode : "review", ranked: pick ? pick.ranked || [] : [], arm: pick ? pick.arm : null };
  }

  /* ───────────── the session compiler ─────────────
   * The first two seasons are the cognitive bootloader and run in authored order. After them, the next session is
   * compiled from the learner's record: capability gaps (atoms never trained or weak on delayed, unaided items),
   * the errors that keep recurring, works not yet possessed, rotation away from the last domains (anti-specialisation),
   * a budget for the unfamiliar (every fourth compiled pick goes to the least-visited domain), and how many later
   * sessions depend on it. Long "deep" sessions (masterpieces, boss worlds) are compiled only on the weekend, never in
   * exam week or on a heavy week. One compiled day in five keeps the authored order as a control (experiment L10). */
  const W = { gap: 3, errors: 1.5, culture: 2, rotate: 2, unknown: 1.5, leverage: 1, curious: 0.5 };
  const BUG_ATOMS = { baserate: ["prob"], inverse: ["prob", "info"], selection: ["info", "falsify"], confirm: ["falsify", "question"], nodelay: ["systems"], gain: ["systems"], proxy: ["measure"], willpower: ["selfmodel", "strategy"], inversion: ["causal"], posthoc: ["causal", "experiment"], confound: ["experiment", "causal"], linear: ["scale"], irrelevant: ["question"], notconstraint: ["constraint", "minimal"], surface: ["analogy", "abstr"], omission: ["mech", "minimal"], scale: ["scale"], authority: ["judgment", "falsify"], pretension: ["taste", "compress"], independence: ["prob"], consistency: ["selfmodel"], moral: ["causal", "mech"], agent: ["causal"], cheapexit: ["strategy"], rigid: ["strategy"] };
  function atomStats(st) {
    const out = {};
    for (const a of st.answers || []) {
      if (!/transfer|far|alien|hook|challenge|probe/.test(a.kind)) continue;
      for (const k of a.atoms || []) {
        const o = (out[k] = out[k] || { n: 0, ok: 0 });
        o.n++;
        if (a.ok && a.conf !== "guess") o.ok++;
      }
    }
    return out;
  }
  const domainOf = (s) => s.domain || (seasonOf(s.id) || {}).domain || "primitives";
  function choose(st, today, dose, t) {
    const all = allSessions(),
      done = (id) => !!(st.sessions[id] && st.sessions[id].done);
    const started = all.find((x) => st.sessions[x.id] && st.sessions[x.id].start && !done(x.id));
    if (started) return { s: started, why: "It continues the session you started; nothing else is chosen until it ends.", mode: "resume" };
    for (const z of seasons())
      if (z.boot) {
        const nx = (z.sessions || []).find((x) => !done(x.id));
        if (nx) return { s: nx, why: "The first seasons are the bootloader (the thinking tools every later session reuses), so they run in their written order.", mode: "bootloader" };
      }
    const dow = (t || new Date()).getDay(),
      week = weekMinutes(st, today);
    const deepOK = dose > DOSE.short && (dow === 5 || dow === 6) && week + 45 <= WEEK_CAP;
    const avail = all.filter((x) => !done(x.id) && (x.requires || []).every(done));
    const cands = avail.filter((x) => !x.deep || deepOK);
    if (!cands.length) return avail.length ? { s: null, mode: "wait", wait: "The next session is a long one (a masterpiece or a boss world). It waits for the weekend, when there is time for it." } : null;
    const control = armOf(st, "L10", today) === 0;
    const ranked = rank(st, cands, today);
    if (control) {
      const s = cands[0];
      return { s, mode: "control", arm: 0, ranked, why: "Today keeps the written order on purpose (one compiled day in five), so the compiler's choices keep being checked against it." };
    }
    const top = ranked[0];
    return { s: top.s, mode: "compiled", arm: 1, ranked, why: "Compiled for you: " + top.reasons.join("; ") + "." };
  }
  function rank(st, cands, today) {
    const A = atomStats(st),
      all = allSessions(),
      done = (id) => !!(st.sessions[id] && st.sessions[id].done);
    const hist = all.filter((x) => done(x.id)).sort((a, b) => (st.sessions[a.id].end || 0) - (st.sessions[b.id].end || 0));
    const lastDomains = hist.slice(-2).map(domainOf);
    const visits = {};
    hist.forEach((x) => (visits[domainOf(x)] = (visits[domainOf(x)] || 0) + 1));
    const compiledSoFar = (st.picks || []).filter((p) => p.mode === "compiled").length;
    const unknownTurn = compiledSoFar % 4 === 3;
    const recentBugs = {};
    (st.answers || []).slice(-60).forEach((a) => a.bug && (recentBugs[a.bug] = (recentBugs[a.bug] || 0) + 1));
    const errAtoms = {};
    Object.entries(recentBugs).forEach(([b, n]) => (BUG_ATOMS[b] || []).forEach((k) => (errAtoms[k] = (errAtoms[k] || 0) + n)));
    const poss = possession(st);
    const minVisits = Math.min(...cands.map((x) => visits[domainOf(x)] || 0));
    const out = cands.map((s, i) => {
      const atoms = s.atoms || [];
      const weak = atoms.filter((k) => !A[k] || A[k].n < 3 || A[k].ok / A[k].n < 0.6);
      const gap = atoms.length ? weak.length / atoms.length : 0;
      const errors = atoms.reduce((a, k) => a + (errAtoms[k] || 0), 0);
      const works = s.works || [];
      const unposs = works.filter((w) => !(poss[w] && poss[w].level >= 9)).length;
      const culture = works.length ? unposs / works.length : 0;
      const rotate = lastDomains.includes(domainOf(s)) ? 0 : 1;
      const unknown = unknownTurn && (visits[domainOf(s)] || 0) === minVisits ? 1 : 0;
      const leverage = all.filter((x) => (x.requires || []).includes(s.id) && !done(x.id)).length;
      const curious = Object.entries(st.deeper || {}).filter(([sid]) => domainOf(sessionById(sid) || {}) === domainOf(s)).reduce((a, [, n]) => a + n, 0);
      const parts = { gap: gap, errors: Math.min(1, errors / 6), culture, rotate, unknown, leverage: Math.min(1, leverage / 2), curious: Math.min(1, curious / 5) };
      const score = Object.entries(parts).reduce((a, [k, v]) => a + W[k] * v, 0) - i * 0.001;
      const reasons = [];
      if (weak.length) reasons.push("it trains " + weak.slice(0, 2).map((k) => ATOMS[k] || k).join(" and ") + ", which your record has not shown yet on later, unaided questions");
      if (errors) reasons.push("it works on a mistake you have been making");
      if (unposs) reasons.push("it adds a work you do not yet possess");
      if (rotate && lastDomains.length) reasons.push("it moves away from " + lastDomains[lastDomains.length - 1]);
      if (unknown) reasons.push("it is the unfamiliar pick of the week, from the field you have visited least");
      if (leverage) reasons.push("later sessions build on it");
      if (!reasons.length) reasons.push("it is next in the written order");
      return { s, score: +score.toFixed(3), parts, reasons };
    });
    return out.sort((a, b) => b.score - a.score);
  }

  /* ───────────── the player ───────────── */
  let P = null; // {sid, s, steps, i, dose, reasons, t0, qs:{}, rep:{}, sheet, skipped}
  const cur = () => (P ? P.steps[P.i] : null);
  const qstate = (id) => (P.qs[id] = P.qs[id] || { pick: null, done: false, shown: Date.now() });

  function open(at) {
    const g = gate(at);
    if (!g.open) return g;
    const st = load(),
      p = g.plan;
    P = { sid: p.sid, s: sessionById(p.sid), steps: p.steps, i: p.start, dose: g.dose, reasons: g.reasons, minutes: p.minutes, short: p.short, partial: p.partial, t0: Date.now(), acc: 0, qs: {}, rep: {}, shownRep: {}, gov: {}, sheet: null, used: {}, why: p.why, mode: p.mode, ranked: p.ranked, seen: {} };
    const today = dayKey(at || new Date());
    if (p.sid) {
      const fresh0 = !st.sessions[p.sid];
      const rec = (st.sessions[p.sid] = st.sessions[p.sid] || { start: Date.now() });
      rec.short = p.short;
      if (fresh0) {
        rec.mode = p.mode;
        if (p.arm != null) rec.l10 = p.arm;
        st.picks.push({ t: Date.now(), day: today, sid: p.sid, mode: p.mode, arm: p.arm, top: (p.ranked || []).slice(0, 3).map((r) => r.s.id + ":" + r.score) });
        if (st.picks.length > 300) st.picks.splice(0, st.picks.length - 300);
      }
    }
    if (!probesOff() && !st.probe.start) st.probe.start = today;
    st.lastWarm = today;
    save();
    mount();
    draw();
    return g;
  }
  function tickMinutes(final) {
    if (!P) return;
    const now = Date.now(),
      st = load(),
      today = dayKey(new Date());
    const add = Math.min(now - P.t0, 5 * 60e3) / 60e3; // an idle screen never counts more than 5 minutes per tick
    P.t0 = now;
    if (document.hidden && !final) return;
    st.days[today] = Math.round(((st.days[today] || 0) + add) * 100) / 100;
    save();
  }
  function mount() {
    let r = document.getElementById("rnRoot");
    if (!r) {
      r = document.createElement("div");
      r.id = "rnRoot";
      r.className = "rnRoot";
      r.setAttribute("role", "dialog");
      r.setAttribute("aria-label", "Renaissance");
      document.body.appendChild(r);
      r.addEventListener("click", onClick);
      r.addEventListener("input", onInput);
    }
    r.hidden = false;
    document.body.classList.add("rnOpen");
    if (!mount.timer) mount.timer = setInterval(() => P && tickMinutes(false), 15000);
  }
  function close() {
    tickMinutes(true);
    P = null;
    const r = document.getElementById("rnRoot");
    if (r) {
      r.hidden = true;
      r.innerHTML = "";
    }
    document.body.classList.remove("rnOpen");
    safe(() => inject(true));
  }

  const vocab = (k) => (P && P.s && P.s.vocab && P.s.vocab[k]) || safe(() => allSessions().map((s) => s.vocab && s.vocab[k]).find(Boolean), null);
  const prov = (id) => (P && P.s ? (P.s.provenance || []).find((x) => x.id === id) : null);
  const visual = (v) => {
    if (!v) return "";
    const f = typeof v === "function" ? v : lookup("visuals", v);
    return f ? '<div class="rnVis">' + safe(() => f(), "") + "</div>" : "";
  };

  function header() {
    const n = P.steps.length,
      i = P.i,
      left = Math.max(1, Math.round(P.steps.slice(i).reduce((a, x) => a + (x.min || 1), 0)));
    const s = P.s;
    return (
      '<div class="rnTop"><div class="rnBrand">RENAISSANCE</div><div class="rnMeta">' +
      (s ? E(s.title) + " · " : "") +
      "about " + left + " min left" + (P.short ? " · short dose" : "") +
      '</div><div class="rnBar"><i style="width:' + Math.round((100 * i) / Math.max(1, n - 1)) + '%"></i></div></div>'
    );
  }
  function dock() {
    const x = cur();
    const canGo = !x || !needsCommit(x) || (x.type === "forge" ? P.qs[x.id]?.done && (!x.critique || P.qs[x.id + ":c"]?.done) : x.type === "contrast" ? P.qs[x.id]?.done : P.qs[x.id]?.done);
    const warm = x && (x.stage === "warm" || x.stage === "probe"),
      closing = x && x.type === "close";
    const aux = [
      ["why", "WHY THIS?"],
      ["smd", "SHOW ME DIFFERENTLY"],
      ["already", "I ALREADY GET THIS"],
      ["xray", "THIS DIDN'T CLICK"],
      ["deeper", "GO DEEPER"],
      ["done", "DONE"],
    ]
      .filter(([k]) => !closing || k === "why")
      .map(([k, t]) => '<button type="button" class="rnAux" data-rn="' + k + '"' + (warm && /smd|xray|already/.test(k) ? " disabled" : "") + ">" + t + "</button>")
      .join("");
    return '<div class="rnDock"><button type="button" class="rnGo" data-rn="go"' + (canGo ? "" : " disabled") + ">" + (x && x.type === "close" ? "FINISH" : "CONTINUE") + '</button><div class="rnAuxRow">' + aux + "</div></div>";
  }
  const needsCommit = (x) => x.type === "q" || x.type === "contrast" || x.type === "forge" || x.type === "reality";

  function draw() {
    const r = document.getElementById("rnRoot");
    if (!r || !P) return;
    const x = cur();
    if (x.type === "scene" && x.reps && x.reps.length && !P.shownRep[x.id]) {
      safe(() => chooseRep(x));
      P.shownRep[x.id] = 1;
      logRep(x, "first");
    }
    let body = "";
    if (x.type === "scene") body = sceneView(x);
    else if (x.type === "q") body = qView(x, x.id, x);
    else if (x.type === "model") body = modelView(x);
    else if (x.type === "passage") body = passageView(x);
    else if (x.type === "contrast") body = contrastView(x);
    else if (x.type === "forge") body = forgeView(x);
    else if (x.type === "reality") body = realityView(x);
    else if (x.type === "close") body = closeView();
    r.innerHTML = header() + '<div class="rnBody" data-step="' + E(x.id) + '" data-type="' + E(x.type) + '" data-stage="' + E(x.stage || "") + '">' + body + "</div>" + sheetView() + dock();
    r.scrollTop = 0;
    const b = r.querySelector(".rnBody");
    if (b) b.scrollTop = 0;
    if (x.type === "model") drawModel(x);
  }

  function repOf(x) {
    const reps = x.reps || [];
    return reps.length ? reps[(P.rep[x.id] || 0) % reps.length] : null;
  }
  function sceneView(x) {
    const rep = repOf(x);
    return (
      (x.title ? "<h2>" + E(x.title) + "</h2>" : "") +
      md(x.body) +
      (rep ? '<div class="rnRep" data-kind="' + E(rep.kind) + '"><div class="rnRepTag">' + E(rep.label || rep.kind) + "</div>" + visual(rep.svg) + md(rep.body) + "</div>" : visual(x.svg)) +
      listenView(x) +
      terms(x) +
      srcBtn(x)
    );
  }
  /* primary text: the passage is shown whole, with speaker, place in the work, translator and rights; SHOW SOURCE
   * opens the quotation's full record (the quote engine). Reading time is noted so "read" means read. */
  const quoteOf = (id) => lookup("quotes", id);
  const capOf = (q) => [q.speaker, q.work + (q.where ? ", " + q.where : ""), q.translator ? "tr. " + q.translator + (q.trYear ? " (" + q.trYear + ")" : "") : "", q.rights].filter(Boolean).join(" · ");
  const words = (t) => String(t || "").split(/\s+/).filter(Boolean).length;
  function passageView(x) {
    P.seen[x.id] = P.seen[x.id] || Date.now();
    const qs = (x.quotes || []).map((id) => [id, quoteOf(id)]).filter(([, q]) => q);
    return (
      '<div class="rnKind">' + E(x.label || "PRIMARY TEXT") + "</div>" +
      (x.title ? "<h2>" + E(x.title) + "</h2>" : "") +
      md(x.body) +
      qs.map(([id, q]) => '<figure class="rnPassage" data-q="' + E(id) + '"><blockquote' + (q.verse ? ' class="verse"' : "") + ">" + (q.verse ? q.text.split("\n").map((l) => '<span class="rnLine">' + E(l) + "</span>").join("") : md(q.text)) + "</blockquote><figcaption>" + E(capOf(q)) + '</figcaption><button type="button" class="rnSrcBtn" data-rn="source" data-q="' + E(id) + '">SHOW SOURCE</button></figure>').join("") +
      (x.after ? md(x.after) : "") +
      listenView(x) +
      terms(x)
    );
  }
  const srcBtn = (x) => ((x.src && x.src.length) || (x.quotes && x.quotes.length) ? '<button type="button" class="rnSrcBtn" data-rn="source">SHOW SOURCE</button>' : "");
  function sourceSheet(qid) {
    const x = cur();
    let h = "";
    const q = qid ? quoteOf(qid) : null;
    if (q) {
      const row = (k, v) => (v ? '<div class="rnQrow"><span>' + E(k) + "</span>" + md(v) + "</div>" : "");
      h += "<h3>The quotation, on record</h3>" + '<div class="rnQuoteRec">' + row("Exact words", "“" + q.text.replace(/\n/g, " / ") + "”") + row("Speaker", q.speaker) + row("Work and place", q.work + (q.where ? ", " + q.where : "")) + row("Author", q.author) + row("Translation", q.translator ? q.translator + (q.trYear ? " (" + q.trYear + ")" : "") + (q.edition ? " · " + q.edition : "") : "original language") + row("Context", q.context) + row("What it means", q.meaning) + row("Why it matters", q.matters) + row("Misattribution risk", q.misattribution) + row("Rights", q.rights) + row("How the wording was checked", q.verified) + "</div>";
    }
    const srcs = (x.src || []).map(prov).filter(Boolean);
    if (srcs.length) h += "<h3>Where this step's facts come from</h3>" + srcs.map((pv) => '<div class="rnSrc"><b>' + E(pv.grade) + "</b> " + md(pv.source + " (" + pv.year + ") — " + pv.claim + (pv.note ? " · " + pv.note : "") + (pv.contested ? " · **Contested:** " + pv.contested : "") + " · rights: " + pv.license) + "</div>").join("");
    const qids = (x.quotes || []).filter((id) => id !== qid);
    if (!q && qids.length) h += "<h3>Quotations in this step</h3>" + qids.map((id) => { const r = quoteOf(id); return r ? '<div class="rnSrc">' + md("“" + r.text.slice(0, 90) + (r.text.length > 90 ? "…" : "") + "” — " + capOf(r)) + '<button type="button" class="rnSrcBtn" data-rn="source" data-q="' + E(id) + '">THE FULL RECORD</button></div>' : ""; }).join("");
    return h || "<h3>Sources</h3><p>This step makes no factual claim that needs a source.</p>";
  }
  /* listening: short passages are synthesised in the browser (no recordings, no rights question); every one has a
   * written description so nothing depends on sound alone */
  const AUDIO = {
    ctx: null,
    last: null,
    plays: 0,
    freq: (m) => 440 * Math.pow(2, (m - 69) / 12),
    schedule(seq) {
      const b = 60 / ((seq && seq.bpm) || 72),
        out = [];
      for (const ev of (seq && seq.notes) || []) for (const m of [].concat(ev.n)) out.push({ t: +(ev.t * b).toFixed(3), d: +(ev.d * b).toFixed(3), f: +AUDIO.freq(m).toFixed(2), midi: m });
      return out;
    },
    play(seq) {
      const sch = AUDIO.schedule(seq);
      AUDIO.last = sch;
      AUDIO.plays++;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      return safe(() => {
        const ctx = AUDIO.ctx || (AUDIO.ctx = new AC());
        if (ctx.state === "suspended") ctx.resume();
        const t0 = ctx.currentTime + 0.06,
          master = ctx.createGain();
        master.gain.value = 0.16;
        master.connect(ctx.destination);
        for (const n of sch) {
          const o = ctx.createOscillator(),
            g = ctx.createGain(),
            a = t0 + n.t,
            e = a + Math.max(0.12, n.d);
          o.type = "triangle";
          o.frequency.value = n.f;
          g.gain.setValueAtTime(0.0001, a);
          g.gain.exponentialRampToValueAtTime(0.8, a + 0.02);
          g.gain.exponentialRampToValueAtTime(0.25, a + Math.min(0.3, n.d * 0.5));
          g.gain.exponentialRampToValueAtTime(0.0001, e);
          o.connect(g);
          g.connect(master);
          o.start(a);
          o.stop(e + 0.05);
        }
        return true;
      }, false);
    },
  };
  const listenView = (x) =>
    (x.listen || []).length
      ? '<div class="rnListenBox">' + x.listen.map((l, i) => '<div class="rnListen"><button type="button" class="rnPlay" data-rn="play" data-l="' + i + '">▶ ' + E(l.label) + "</button>" + (l.text ? '<div class="rnListenTxt">' + md(l.text) + "</div>" : "") + "</div>").join("") + "</div>"
      : "";
  const terms = (x) =>
    x.terms && x.terms.length
      ? '<div class="rnTerms">' + x.terms.map((k) => (vocab(k) ? '<button type="button" class="rnTerm" data-rn="term" data-k="' + E(k) + '">' + E(vocab(k).name || k) + "</button>" : "")).join("") + "</div>"
      : "";

  function qView(q, id, step) {
    const s = qstate(id),
      hookBanner = step && step.kind === "hook" ? '<div class="rnBanner">From an earlier session · no hints this time</div>' : "";
    const tag = { predict: "PREDICT FIRST", check: "CHECK", transfer: "USE IT", far: "SOMEWHERE NEW", alien: "NO LABELS: WHICH IDEA IS THIS?", hook: "REMEMBER", challenge: "PROVE IT", probe: "MEASURED · NO LABELS" }[q.kind || "check"] || "";
    const probeBanner = step && step.kind === "probe" ? '<div class="rnBanner">' + (step.form === "alien" ? "This week's unknown problem: a field no session has taught. Orient, then answer." : step.form === "rt" ? "A reader's question about a work you possess. Written before you studied it; answered without help." : "Measuring where you are, to compare later. No hints, and no right/wrong until the comparison is done.") + "</div>" : "";
    if (step && step.kind === "predict" && q.alt && !s.done && !s.hint && P.sid && armOf(load(), "L5", P.sid + ":" + id) === 1) {
      s.hint = true;
      s.hintArm = 1;
    }
    let h = hookBanner + probeBanner + (tag ? '<div class="rnKind">' + tag + "</div>" : "") + (q.title ? "<h2>" + E(q.title) + "</h2>" : "") + (q.dialogue ? '<div class="rnDialog">' + q.dialogue.map((d) => '<div class="rnSay"><b>' + E(d.who) + "</b><span>" + E(d.say) + "</span></div>").join("") + "</div>" : "") + md(q.stem);
    if (step && step.listen) h += listenView(step);
    if (step && step.kind !== "hook") h += visual(q.svg);
    if (q.panels) h += '<div class="rnPair">' + q.panels.map((pn) => '<div class="rnSide"><h3>' + E(pn.title) + "</h3>" + visual(pn.svg) + md(pn.body || "") + "</div>").join("") + "</div>";
    if (s.hint && q.alt) h += '<div class="rnRep" data-kind="alt"><div class="rnRepTag">Another way to see the question</div>' + md(q.alt) + "</div>";
    h += '<div class="rnOpts">' + perm(id, q.options.length)
      .map((k, pos) => {
        const o = q.options[k],
          L = "ABCDEFG"[pos];
        let cls = "rnOpt";
        if (s.pick === k) cls += " picked";
        if (s.done) cls += o.ok ? " good" : s.pick === k ? " bad" : " dim";
        return '<button type="button" class="' + cls + '" data-rn="pick" data-q="' + E(id) + '" data-k="' + k + '"' + (s.done ? " disabled" : "") + "><b>" + L + "</b><span>" + E(o.t) + "</span></button>";
      })
      .join("") + "</div>";
    if (s.pick != null && !s.done)
      h += '<div class="rnConf"><span>How sure are you?</span>' + [["sure", "SURE"], ["think", "THINK SO"], ["guess", "GUESSING"]].map(([c, t]) => '<button type="button" class="rnC" data-rn="commit" data-q="' + E(id) + '" data-c="' + c + '">' + t + "</button>").join("") + "</div>";
    if (s.done && step && step.kind === "probe" && !step.feedback) {
      h += '<div class="rnFb">' + md("**Recorded.** No feedback on this one: it may come back to measure change, and knowing the answer now would spoil the comparison.") + "</div>";
      return h;
    }
    if (s.done) {
      const o = q.options[s.pick],
        right = q.options.find((x) => x.ok);
      h += '<div class="rnFb ' + (o.ok ? "ok" : "no") + '">' + (o.ok ? "<b>✓ Right.</b>" : "<b>✗ Not this one.</b>" + (o.bug && BUGS[o.bug] ? ' <span class="rnBug">' + E(BUGS[o.bug]) + "</span>" : "")) + md(o.ok ? o.why || "" : o.why || "") + (!o.ok && right ? md("**The answer:** " + right.t + (right.why ? ". " + right.why : "")) : "") + md(q.after || "") + "</div>";
      if (!o.ok && q.repair) h += '<div class="rnRep" data-kind="repair"><div class="rnRepTag">Seen another way</div>' + visual(q.repair.svg) + md(q.repair.body) + "</div>";
      if (step && step.stage !== "warm" && step.kind !== "probe") h += srcBtn(step);
    }
    return h;
  }

  function modelView(x) {
    const m = lookup("models", x.model);
    if (!m) return "<p>Model missing.</p>";
    const v = (P.qs["m:" + x.id] = P.qs["m:" + x.id] || Object.fromEntries([...(m.controls || []).map((c) => [c.id, c.value]), ...(m.toggles || []).map((c) => [c.id, c.value])]));
    return (
      (x.title ? "<h2>" + E(x.title) + "</h2>" : "") +
      md(x.body) +
      '<div class="rnModel" data-model="' + E(x.model) + '"><div class="rnModelSvg"></div><div class="rnCtl">' +
      (m.controls || []).map((c) => '<label><span>' + E(c.label) + ' <b data-out="' + E(c.id) + '"></b></span><input type="range" data-rn="ctl" data-c="' + E(c.id) + '" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" value="' + v[c.id] + '"></label>').join("") +
      (m.toggles || []).map((c) => '<button type="button" class="rnTog' + (v[c.id] ? " on" : "") + '" data-rn="tog" data-c="' + E(c.id) + '">' + E(c.label) + "</button>").join("") +
      (m.sound ? '<button type="button" class="rnPlay" data-rn="playModel">▶ PLAY THIS VERSION</button>' : "") +
      '</div><div class="rnRead"></div></div>' +
      (x.ask ? '<div class="rnAsk">' + md(x.ask) + "</div>" : "") +
      listenView(x) +
      terms(x) +
      srcBtn(x)
    );
  }
  function drawModel(x) {
    const m = lookup("models", x.model),
      root = document.querySelector("#rnRoot .rnModel");
    if (!m || !root) return;
    const v = P.qs["m:" + x.id];
    root.querySelector(".rnModelSvg").innerHTML = safe(() => m.draw(v), "");
    root.querySelector(".rnRead").innerHTML = md(safe(() => m.read(v), ""));
    for (const c of m.controls || []) {
      const o = root.querySelector('[data-out="' + c.id + '"]');
      if (o) o.textContent = c.fmt ? c.fmt(v[c.id]) : v[c.id] + (c.unit || "");
    }
    P.used["m:" + x.id] = (P.used["m:" + x.id] || 0) + 1;
  }

  function contrastView(x) {
    const side = (c) => '<div class="rnSide"><h3>' + E(c.title) + "</h3>" + visual(c.svg) + md(c.body) + "</div>";
    return (x.title ? "<h2>" + E(x.title) + "</h2>" : "") + md(x.body) + '<div class="rnPair">' + side(x.left) + side(x.right) + "</div>" + qView(Object.assign({ kind: "check" }, x.q), x.id, null);
  }

  function forgeView(x) {
    const s = (P.qs[x.id] = P.qs[x.id] || { pick: {}, done: false });
    let h = '<div class="rnKind">FORGE</div><h2>' + E(x.title) + "</h2>" + md(x.body);
    for (const sl of x.slots) {
      h += '<div class="rnSlot"><div class="rnSlotL">' + E(sl.label) + '</div><div class="rnOpts">' + perm(x.id + ":" + sl.key, sl.options.length)
        .map((k) => {
          const o = sl.options[k];
          let cls = "rnOpt";
          if (s.pick[sl.key] === k) cls += " picked";
          if (s.done) cls += s.pick[sl.key] === k ? (o.grade === "good" ? " good" : o.grade === "weak" ? " weak" : " bad") : " dim";
          return '<button type="button" class="' + cls + '" data-rn="slot" data-s="' + E(sl.key) + '" data-k="' + k + '"' + (s.done ? " disabled" : "") + "><span>" + E(o.t) + "</span></button>";
        })
        .join("") + "</div>";
      if (s.done) {
        const o = sl.options[s.pick[sl.key]];
        h += '<div class="rnFb ' + (o.grade === "good" ? "ok" : o.grade === "weak" ? "meh" : "no") + '">' + md(o.note || "") + "</div>";
      }
      h += "</div>";
    }
    const all = x.slots.every((sl) => s.pick[sl.key] != null);
    if (!s.done) h += '<button type="button" class="rnBtn" data-rn="forge"' + (all ? "" : " disabled") + ">BUILD IT</button>";
    else {
      h += '<div class="rnArtifact"><div class="rnRepTag">Your design</div>' + md(artifact(x, s)) + "</div>";
      if (x.critique) h += '<div class="rnCrit">' + qView(Object.assign({ kind: "check" }, x.critique), x.id + ":c", null) + "</div>";
    }
    return h;
  }
  const artifact = (x, s) => x.template.replace(/\{(\w+)\}/g, (m, k) => {
    const sl = x.slots.find((z) => z.key === k);
    return sl ? (sl.options[s.pick[k]].say || sl.options[s.pick[k]].t) : m;
  });

  function realityView(x) {
    const st = load(),
      f = st.forge[x.fid];
    const s = qstate(x.id);
    return (
      '<div class="rnKind">DID IT MEET REALITY?</div><h2>Last time you built something</h2>' + md((f && f.text ? "“" + f.text + "”" : "The device you built in “" + ((sessionById(x.fid) || {}).title || "your last session") + "”.") + "\n\nDid you use it?") +
      '<div class="rnOpts">' + [["used", "Used it"], ["notyet", "Not yet"], ["useless", "Tried it: not useful"]].map(([k, t]) => '<button type="button" class="rnOpt' + (s.pick === k ? " picked" : "") + '" data-rn="reality" data-k="' + k + '"><span>' + t + "</span></button>").join("") + "</div>" +
      (s.done ? '<div class="rnFb ok">' + md(s.pick === "used" ? "Counted: an idea that changed something outside this app." : s.pick === "notyet" ? "No debt. It stays on your record; it will not be asked again." : "Useful data: a design that failed in real life teaches the next one.") + "</div>" : "")
    );
  }

  /* ───────────── receipts ───────────── */
  function sessionAnswers(sid) {
    const st = load(),
      since = st.sessions[sid]?.start || 0;
    return st.answers.filter((a) => a.sid === sid && a.t >= since);
  }
  function receipt() {
    const st = load(),
      s = P.s;
    if (!s) return { lines: ["Review only today."] };
    const A = sessionAnswers(s.id);
    const by = (k) => A.filter((a) => a.kind === k);
    const pr = by("predict"),
      tr = A.filter((a) => a.kind === "transfer" || a.kind === "far" || a.kind === "alien" || a.kind === "challenge"),
      far = A.filter((a) => a.kind === "far" || a.kind === "alien");
    const bugs = {};
    A.filter((a) => !a.ok && a.bug).forEach((a) => (bugs[a.bug] = (bugs[a.bug] || 0) + 1));
    const sure = A.filter((a) => a.conf === "sure"),
      sureOk = sure.filter((a) => a.ok).length;
    const click = pr.some((a) => !a.ok) && tr.some((a) => a.ok && a.conf !== "guess");
    const hooks = (s.hooks || []).map((h) => st.hooks[h.id]).filter(Boolean);
    const lines = [
      "**What changed:** " + s.capability,
      "**Evidence:** predictions before the explanation " + pr.filter((a) => a.ok).length + "/" + pr.length + " · after it, used in new cases " + tr.filter((a) => a.ok).length + "/" + tr.length + (far.length ? " (somewhere new: " + far.filter((a) => a.ok).length + "/" + far.length + ")" : "") + " · when you said SURE you were right " + sureOk + "/" + sure.length + ".",
      click ? "**A click:** you got a prediction wrong before the explanation and then used the idea correctly on a case you had not seen. That reorganisation is what this is for." : pr.length && pr.every((a) => a.ok) ? "**No surprise today:** your predictions were already right, so this was confirmation more than revelation. The later hooks will show whether it lasts." : "",
      Object.keys(bugs).length ? "**Still weak:** " + Object.entries(bugs).map(([b, n]) => BUGS[b] + (n > 1 ? " ×" + n : "") + (XRAY_OF[b] ? " (likely cause: " + XRAY_OF[b] + ")" : "")).join(" · ") + ". These return first." : "**Still weak:** nothing showed today; the delayed hooks are the real test.",
      hooks.length ? "**Comes back (no hints):** " + hooks.map((h) => pretty(h.due)).join(" · ") + "." : "",
      (() => {
        const rev = (st.beliefs || []).filter((b) => b.sid === s.id && !b.ok && b.t >= (st.sessions[s.id]?.start || 0));
        return rev.length ? "**What changed in your model:** " + rev.slice(0, 2).map((b) => "“" + b.held + "” → “" + b.revisedTo + "”").join(" · ") + "." : "";
      })(),
      (() => {
        const po = possession(st);
        const ws = (s.works || []).filter((w) => po[w]);
        return ws.length ? "**Possession:** " + ws.map((w) => ((window.RENAISSANCE_CIV || {}).nodes || {})[w]?.name + " — " + po[w].label + (po[w].next ? " (next: " + po[w].next + ")" : "")).join(" · ") + "." : "";
      })(),
      s.connection ? "**New connection:** " + s.connection : "",
      st.forge[s.id] && st.forge[s.id].text ? "**Use it this week:** " + st.forge[s.id].text : "",
    ].filter(Boolean);
    return { lines, click };
  }
  function closeView() {
    if (cur().partial) {
      const left = P.s ? P.s.steps.length - Math.max(0, P.s.steps.findIndex((x) => x.id === (load().sessions[P.sid] || {}).at)) : 0;
      return '<div class="rnKind">RECEIPT · SHORT DOSE</div><h2>Enough for today.</h2>' + md("Today's dose was shortened (" + (P.reasons.join(", ") || "short day") + "). The session is not over: it continues from the next step on a normal day, with nothing to catch up.") + '<p class="rnMuted">About ' + left + " steps remain in this session.</p>";
    }
    const r = receipt();
    return '<div class="rnKind">RECEIPT</div><h2>Done. That was the whole dose.</h2>' + r.lines.map((l) => md(l)).join("") + '<p class="rnMuted">Nothing else is due today. Missing tomorrow costs nothing: the plan simply moves.</p>';
  }
  function finish() {
    const st = load(),
      s = P.s,
      today = dayKey(new Date());
    if (s && cur().partial) {
      const rec = st.sessions[s.id] || (st.sessions[s.id] = {});
      const order = seq(s, st);
      const k = order.findIndex((x) => x.id === P.steps[P.steps.length - 2]?.id);
      if (k >= 0 && order[k + 1]) rec.at = order[k + 1].id;
      rec.endDay = today;
      rec.shortDays = (rec.shortDays || 0) + 1;
    } else if (s) {
      const rec = st.sessions[s.id] || (st.sessions[s.id] = {});
      const r = receipt();
      rec.done = true;
      rec.end = Date.now();
      rec.endDay = today;
      rec.receipt = r.lines;
      if (r.click) st.clicks.push({ t: Date.now(), sid: s.id });
      for (const h of s.hooks || []) if (!st.hooks[h.id]) st.hooks[h.id] = { due: addDays(today, h.gap || 1), gap: h.gap || 1, n: 0, ok: 0 };
      // experiments judged on this session's use of the idea in new cases
      const v = sessionTransfer(sessionAnswers(s.id));
      if (s.steps.some((x, k) => x.type === "model" && s.steps[k + 1] && s.steps[k + 1].type === "contrast")) expLog(st, "L2", s.id, armOf(st, "L2", s.id), v);
      if (s.steps.some((x) => x.opt)) expLog(st, "L3", s.id, armOf(st, "L3", s.id), v);
      if (rec.l10 != null) expLog(st, "L10", s.id, rec.l10, v);
    }
    save();
    close();
  }

  /* ───────────── sheets: why, vocabulary, x-ray, deeper ───────────── */
  function sheetView() {
    if (!P.sheet) return "";
    const inner = typeof P.sheet === "function" ? P.sheet() : P.sheet;
    return '<div class="rnSheet" role="dialog"><div class="rnSheetIn">' + inner + '<button type="button" class="rnBtn ghost" data-rn="unsheet">BACK TO THE LESSON</button></div></div>';
  }
  function whySheet() {
    const st = load(),
      s = P.s,
      x = cur();
    const srcs = (x.src || []).map(prov).filter(Boolean);
    const A = st.answers,
      rate = (f) => {
        const xs = A.filter(f);
        return xs.length ? xs.filter((a) => a.ok).length + "/" + xs.length : "—";
      };
    const brier = A.length ? (A.reduce((a, x) => a + Math.pow((CONF[x.conf] || 0.5) - (x.ok ? 1 : 0), 2), 0) / A.length).toFixed(2) : "—";
    const week = weekMinutes(st, dayKey(new Date()));
    return (
      "<h3>Why this, today</h3>" +
      (s ? md(s.why) + md("**Capability:** " + s.capability) : md("Review only: earlier ideas coming back without hints.")) +
      md("**Chosen by:** " + (P.why || "due hooks from earlier sessions: ideas coming back without hints.") + " Due hooks from earlier sessions open it. **Dose:** " + P.dose + " minutes" + (P.reasons.length ? " (shortened: " + P.reasons.join(", ") + ")" : "") + ".") +
      (P.ranked && P.ranked.length > 1 && P.mode === "compiled" ? md("**Also considered:** " + P.ranked.slice(1, 3).map((r) => "“" + r.s.title + "” (" + r.score + ")").join(" · ") + " against “" + P.ranked[0].s.title + "” (" + P.ranked[0].score + ").") : "") +
      (st.recovered ? md("**Note:** your earlier Renaissance record could not be read on " + pretty(dayKey(new Date(st.recovered))) + "; it was kept aside unchanged and a clean one started.") : "") +
      (srcs.length ? "<h3>Where this step's facts come from</h3>" + srcs.map((p) => '<div class="rnSrc"><b>' + E(p.grade) + "</b> " + md(p.source + " (" + p.year + ") — " + p.claim + (p.note ? " · " + p.note : "")) + "</div>").join("") : "") +
      "<h3>Your record so far</h3>" +
      md("Predictions before explanations: " + rate((a) => a.kind === "predict") + " · Used in new cases: " + rate((a) => /transfer|far|alien|challenge/.test(a.kind)) + " · Came back days later, no hints: " + rate((a) => a.kind === "hook") + " · Calibration (Brier, 0 is perfect, 0.25 is coin-flipping): " + brier + " over " + A.length + " answers · Renaissance this week: " + Math.round(week) + " min.") +
      (x.atoms || (s && s.atoms) ? md("**This step trains:** " + (x.atoms || s.atoms).map((k) => ATOMS[k] || k).join(" · ") + ".") : "") +
      (() => {
        const rev = (st.beliefs || []).filter((b) => !b.ok && b.conf !== "guess").slice(-3).reverse();
        return rev.length ? "<h3>Beliefs you revised</h3>" + rev.map((b) => '<div class="rnSrc">' + md("You committed (" + b.conf + "): “" + b.held + "” → revised to “" + b.revisedTo + "” · " + pretty(dayKey(new Date(b.t)))) + "</div>").join("") : "";
      })() +
      (() => {
        const d = P.gov[x.id],
          g = govState(st),
          v = govVerdict(st);
        let h = "";
        if (d) {
          const lab = (k) => {
            const l = ((x.reps || []).find((r) => r.kind === k) || {}).label;
            return "the " + k + (l && l.toLowerCase() !== k ? " “" + l + "”" : "");
          };
          h += d.explore
            ? md("**Picture order:** the usual first picture was kept this time on purpose (one time in five), so the choice below keeps being checked.")
            : md("**Picture chosen for you:** " + lab(d.chosen) + " first. For you, this kind of picture preceded a right answer " + Math.round(d.rates[1] * 100) + "% of " + d.n[1] + " times, the usual first one " + Math.round(d.rates[0] * 100) + "% of " + d.n[0] + ".");
        }
        if (g.off) h += md("**The picture chooser is switched off:** " + g.offReason + ". Pictures come in the authored order.");
        else if (v.chooser.n) h += md("**Checking the chooser:** after its choices, right " + v.chooser.ok + "/" + v.chooser.n + "; with the usual order kept, right " + v.control.ok + "/" + v.control.n + ". It switches itself off if it stops doing better.");
        if (P.sid && !expOff()) {
          const trials = [];
          const ses = P.s;
          if (ses && ses.steps.some((y, k) => y.type === "model" && ses.steps[k + 1] && ses.steps[k + 1].type === "contrast")) trials.push(["L2", armOf(st, "L2", ses.id)]);
          if (ses && ses.steps.some((y) => y.opt)) trials.push(["L3", armOf(st, "L3", ses.id)]);
          const rec = st.sessions[P.sid] || {};
          if (rec.l10 != null) trials.push(["L10", rec.l10]);
          for (const [id, arm] of trials) {
            const e = expState(st, id),
              [a0, a1] = expRates(e);
            h += md("**Trial (" + EXP[id].what + "):** this session is on “" + EXP[id].arms[arm] + "”. " + (e.verdict ? "Decided: " + e.verdict + "." : "Sessions so far " + a0.n + " vs " + a1.n + "; nothing is decided before " + Math.ceil(EXP[id].minN * (e.caution || 1)) + " on each side."));
          }
        }
        return h ? "<h3>How this app is adjusting to you</h3>" + h : "";
      })() +
      md("No combined score is shown on purpose: one number invites optimising the number (that is session 5).")
    );
  }
  function termSheet(k) {
    const v = vocab(k);
    if (!v) return "<h3>" + E(k) + "</h3><p>Not in this session's vocabulary.</p>";
    return '<h3>' + E(v.name || k) + '</h3><div class="rnVocab"><div><span>HUMAN</span>' + md(v.h) + '</div><div dir="auto"><span>STICKY</span>' + md(v.s) + "</div><div><span>TECHNICAL</span>" + md(v.t) + "</div></div>";
  }
  function xraySheet() {
    return (
      "<h3>What is in the way?</h3>" +
      md("Pick the closest. The lesson is repaired for that cause, not repeated louder.") +
      '<div class="rnOpts">' +
      [["word", "A word I don't really know"], ["picture", "The picture or the model"], ["step", "A jump in the reasoning"], ["care", "I don't see why it matters"]].map(([k, t]) => '<button type="button" class="rnOpt" data-rn="xcause" data-k="' + k + '"><span>' + t + "</span></button>").join("") +
      "</div>"
    );
  }
  function xrayFix(cause) {
    const x = cur(),
      s = P.s,
      st = load();
    st.xray[cause] = (st.xray[cause] || 0) + 1;
    save();
    if (cause === "word") {
      const ks = (x.terms && x.terms.length ? x.terms : Object.keys((s && s.vocab) || {})).slice(0, 4);
      return "<h3>The words, three ways</h3>" + ks.map((k) => termSheet(k).replace(/^<h3>/, "<h4>").replace(/<\/h3>/, "</h4>")).join("");
    }
    if (cause === "picture") {
      if (x.reps && x.reps.length > 1) {
        P.rep[x.id] = ((P.rep[x.id] || 0) + 1) % x.reps.length;
        logRep(x, "xray");
        return "<h3>Switched the representation</h3>" + md("The lesson now shows it as **" + (repOf(x).label || repOf(x).kind) + "**. Close this sheet to see it.");
      }
      return "<h3>Without the picture</h3>" + md(x.bridge || (s && s.bridge) || "The idea in one line: " + (s ? s.capability : ""));
    }
    if (cause === "step") return "<h3>The missing step</h3>" + md(x.bridge || (s && s.bridge) || "");
    return "<h3>Why this matters to you</h3>" + md(x.stakes || (s && s.stakes) || "");
  }
  function deeperSheet() {
    const x = cur(),
      d = (x.deeper && x.deeper.length ? x.deeper : (P.s && P.s.deeper) || []);
    if (!d.length) return "<h3>Deeper</h3><p>Nothing deeper is written for this step yet.</p>";
    return "<h3>Go deeper (optional)</h3>" + d.map((c) => '<div class="rnDeep"><h4>' + E(c.title) + "</h4>" + md(c.body) + "</div>").join("");
  }
  /* ───────────── safe experiments: self-adjustment beyond picture order ─────────────
   * Each trial has the authored arm (0, the control) and one alternative (1). Units (a session, a prediction, a hook,
   * a day) get a stable arm from a hash, so the same unit never flips. Nothing is decided before a minimum sample on
   * both arms. The alternative is adopted only when clearly better, dropped when it is not better, and stopped at once
   * if in-session accuracy on it falls under a floor (no harm). After adoption one unit in five still runs the authored
   * arm; if the adopted arm later does worse, the adoption is rolled back and that trial needs a larger sample next
   * time (level 14: the judge learns caution from its own reversals). Kill switch: localStorage renaissance_experiments = "off". */
  const EXP = {
    L2: { level: 2, what: "step order: the two compared cases before the interactive model instead of after", unit: "session", arms: ["model first", "cases first"], minN: 6 },
    L3: { level: 3, what: "step length: optional depth steps kept or skipped", unit: "session", arms: ["kept", "skipped"], minN: 6 },
    L5: { level: 5, what: "difficulty: another way to see a prediction offered before you answer", unit: "item", arms: ["on request", "offered"], minN: 12 },
    L6: { level: 6, what: "retrieval interval: a remembered idea comes back ×2.5 or ×2 later", unit: "hook", arms: ["×2.5", "×2"], minN: 10 },
    L10: { level: 10, what: "season order: the written order or the compiler's choice", unit: "day", arms: ["written order", "compiler"], minN: 6 },
  };
  const EXPCFG = { margin: 0.15, floor: 0.4, controlEvery: 5, window: 400 };
  const expOff = () => safe(() => localStorage.getItem("renaissance_experiments") === "off", false);
  function expState(st, id) {
    st.exp = st.exp || {};
    return (st.exp[id] = st.exp[id] || { log: [], verdict: null, caution: 1, history: [] });
  }
  function armOf(st, id, unit) {
    if (expOff() || !EXP[id]) return id === "L10" ? 1 : 0;
    const e = expState(st, id),
      h = hashNum(id + ":" + unit);
    if (id === "L10") {
      // the compiler is the design; the control arm is the written order one day in five
      if (e.verdict === "dropped" || e.verdict === "harm") return 0;
      return h % EXPCFG.controlEvery === 0 ? 0 : 1;
    }
    if (e.verdict === "dropped" || e.verdict === "harm") return 0;
    if (e.verdict === "adopted") return h % EXPCFG.controlEvery === 0 ? 0 : 1;
    return h % 2;
  }
  function expLog(st, id, unit, arm, value) {
    if (expOff() || !EXP[id] || value == null || isNaN(value)) return;
    const e = expState(st, id);
    if (e.log.some((r) => r.unit === unit)) return;
    e.log.push({ t: Date.now(), unit, arm, v: +(+value).toFixed(3) });
    if (e.log.length > EXPCFG.window) e.log.splice(0, e.log.length - EXPCFG.window);
    judgeExp(st, id);
  }
  function expRates(e, since) {
    const r = (k) => {
      const xs = e.log.filter((x) => x.arm === k && x.t >= (since || 0));
      return { n: xs.length, rate: xs.length ? xs.reduce((a, x) => a + x.v, 0) / xs.length : null };
    };
    return [r(0), r(1)];
  }
  function judgeExp(st, id) {
    const e = expState(st, id),
      c = EXP[id],
      minN = Math.ceil(c.minN * (e.caution || 1));
    if (e.verdict === "dropped" || e.verdict === "harm") return;
    if (e.verdict === "adopted") {
      const [a0, a1] = expRates(e, e.decidedAt);
      if (a0.n >= Math.ceil(minN / 2) && a1.n >= minN && a1.rate < a0.rate) {
        e.history.push({ t: Date.now(), from: "adopted", to: "rolled back", a0, a1 });
        e.verdict = null;
        e.caution = +((e.caution || 1) * 1.5).toFixed(2);
        e.log = [];
        e.decidedAt = null;
      }
      return;
    }
    const [a0, a1] = expRates(e);
    const armN = id === "L10" ? a0.n >= 2 : a0.n >= minN;
    if (a1.n >= Math.ceil(minN / 2) && a1.rate < EXPCFG.floor && (a0.n === 0 || a0.rate >= EXPCFG.floor)) {
      e.verdict = "harm";
      e.decidedAt = Date.now();
      e.history.push({ t: e.decidedAt, to: "stopped (no-harm floor)", a0, a1 });
      return;
    }
    if (armN && a1.n >= minN) {
      if (a1.rate >= a0.rate + EXPCFG.margin) e.verdict = "adopted";
      else if (a1.rate <= a0.rate) e.verdict = "dropped";
      if (e.verdict) {
        e.decidedAt = Date.now();
        e.history.push({ t: e.decidedAt, to: e.verdict, a0, a1 });
      }
    }
  }
  function expReport(st) {
    return Object.entries(EXP).map(([id, c]) => {
      const e = expState(st, id),
        [a0, a1] = expRates(e);
      return { id, level: c.level, what: c.what, arms: c.arms, verdict: e.verdict || "running", caution: e.caution || 1, n: [a0.n, a1.n], rate: [a0.rate, a1.rate].map((x) => (x == null ? null : +x.toFixed(2))), history: e.history || [] };
    });
  }
  const sessionTransfer = (A) => {
    const xs = A.filter((a) => /transfer|far|alien/.test(a.kind));
    return xs.length ? xs.filter((a) => a.ok).length / xs.length : null;
  };

  /* ───────────── sealed measurement: baseline, weekly unknown problems, a month later ─────────────
   * Items live sealed in renaissance-sealed.js (obfuscated, hashed and pre-registered in docs/RENAISSANCE/sealed/)
   * and are opened only on the day they are due. Form A is the baseline (days 0–3) and returns at day 90; form B is
   * the 30-day parallel form; one unknown problem arrives each week for twelve weeks; the reader test for a masterpiece
   * arrives 30 days after its last session. Forms give no right/wrong feedback (they come back); a weekly unknown
   * problem is used once, so it explains itself after you commit. Missed windows are skipped, never owed.
   * Opt-out (the learner decides what is measured): localStorage renaissance_probes = "off". */
  const probesOff = () => safe(() => localStorage.getItem("renaissance_probes") === "off", false);
  const SEALED = () => window.RENAISSANCE_SEALED || { items: [] };
  function unseal(blob, id) {
    return safe(() => {
      const salt = SEALED().salt || "";
      const bin = atob(blob);
      let h = hashNum(salt + ":" + id);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        h = (Math.imul(h ^ (h >>> 15), 2246822507) + 3266489909 + i) >>> 0;
        bytes[i] = bin.charCodeAt(i) ^ (h & 255);
      }
      return JSON.parse(new TextDecoder().decode(bytes));
    }, null);
  }
  function probeDue(st, today) {
    const P0 = st.probe || {},
      start = P0.start;
    if (!start) return [];
    const since = daysBetween(start, today),
      out = [];
    for (const it of SEALED().items || []) {
      let base = null;
      if (it.after) {
        const r = st.sessions[it.after];
        if (!r || !r.done || !r.endDay) continue;
        base = daysBetween(start, r.endDay);
      }
      for (const at0 of it.at || []) {
        const at = (base || 0) + at0,
          key = it.id + "@" + at0;
        if (P0.done[key]) continue;
        if (since >= at && since - at <= 14) out.push({ key, it, at });
        break;
      }
    }
    return out.sort((a, b) => a.at - b.at || (a.it.order || 0) - (b.it.order || 0));
  }
  function dueProbes(st, today, dose) {
    if (probesOff() || dose <= DOSE.short) return [];
    const list = probeDue(st, today).slice(0, 2);
    return list
      .map(({ key, it }) => {
        const q = unseal(it.blob, it.id);
        if (!q) return null;
        return { id: "probe:" + key, type: "q", kind: "probe", stage: "probe", probe: key, form: it.form, min: 1.5, stem: q.stem, options: q.options, after: q.after, feedback: it.form === "alien", title: q.title || "", atoms: q.atoms || [] };
      })
      .filter(Boolean);
  }
  function recordProbe(st, step, a) {
    st.probe = st.probe || { start: null, done: {} };
    st.probe.done[step.probe] = { t: a.t, ok: a.ok, conf: a.conf, ms: a.ms, form: step.form, day: st.probe.start ? daysBetween(st.probe.start, dayKey(new Date(a.t))) : null };
  }
  function probeReport(st) {
    const by = {};
    for (const [key, r] of Object.entries((st.probe || {}).done || {})) {
      const f = r.form + (/@90$/.test(key) ? "@90" : "");
      const o = (by[f] = by[f] || { n: 0, ok: 0 });
      o.n++;
      if (r.ok && r.conf !== "guess") o.ok++;
    }
    return by;
  }

  /* ───────────── the learner model: what the record can honestly say ───────────── */
  // functional-capability vector (§38): no IQ, no composite; each dimension shows its evidence and its n
  const FIV = [
    ["orientation", "Orienting in a domain you were never taught", (a) => a.kind === "alien" || (a.kind === "probe" && a.form !== "rt")],
    ["questions", "Choosing the question that changes the decision", (a) => (a.atoms || []).includes("question")],
    ["compression", "Compressing to the load-bearing structure", (a) => (a.atoms || []).some((k) => k === "compress" || k === "minimal")],
    ["causal", "Causal reasoning", (a) => (a.atoms || []).includes("causal")],
    ["transfer", "Using an idea somewhere new", (a) => a.kind === "transfer" || a.kind === "far"],
    ["synthesis", "Synthesis across fields", (a) => (a.atoms || []).includes("synth")],
    ["prediction", "Prediction before being told", (a) => a.kind === "predict"],
    ["structure", "Memory of structure, days later and unaided", (a) => a.kind === "hook"],
    ["taste", "Aesthetic discrimination", (a) => (a.atoms || []).includes("taste")],
    ["judgment", "Judgment", (a) => (a.atoms || []).includes("judgment")],
    ["possession", "Possession of a work (reader questions)", (a) => a.kind === "probe" && a.form === "rt"],
  ];
  function vector(st) {
    const A = st.answers || [];
    const out = FIV.map(([id, name, f]) => {
      const xs = A.filter(f),
        ok = xs.filter((a) => a.ok && a.conf !== "guess").length;
      return { id, name, n: xs.length, ok, rate: xs.length >= 5 ? Math.round((100 * ok) / xs.length) : null };
    });
    const brierXs = A.filter((a) => a.conf);
    out.push({ id: "calibration", name: "Calibration (Brier; 0 perfect, 0.25 coin-flip)", n: brierXs.length, rate: brierXs.length >= 5 ? +(brierXs.reduce((a, x) => a + Math.pow((CONF[x.conf] || 0.5) - (x.ok ? 1 : 0), 2), 0) / brierXs.length).toFixed(2) : null });
    const forges = Object.values(st.forge || {}),
      good = forges.filter((f) => (f.grades || []).length && f.grades.every((g) => g === "good")).length;
    out.push({ id: "creation", name: "Creation (forges whose every part held up)", n: forges.length, ok: good, rate: forges.length >= 3 ? Math.round((100 * good) / forges.length) : null });
    const used = Object.values(st.reality || {}).filter((r) => r.v === "used").length;
    out.push({ id: "reality", name: "Ideas used outside the app (your own report)", n: Object.keys(st.reality || {}).length, ok: used, rate: null });
    out.push({ id: "explanation", name: "Explaining to another person", n: 0, rate: null, note: "No instrument inside the app yet; counted only from salon reality taps." });
    return out;
  }
  // transformation velocity (§45–46): change in delayed, unaided accuracy per week; acceleration once there is enough
  function velocity(st) {
    const A = (st.answers || []).filter((a) => /far|alien|hook|probe/.test(a.kind));
    if (!A.length) return { weeks: [], tv: null, accel: null, note: "No delayed or unaided answers yet." };
    const t0 = Math.min(...A.map((a) => a.t)),
      wk = {};
    for (const a of A) {
      const w = Math.floor((a.t - t0) / (7 * 864e5));
      const o = (wk[w] = wk[w] || { w, n: 0, ok: 0 });
      o.n++;
      if (a.ok && a.conf !== "guess") o.ok++;
    }
    const weeks = Object.values(wk).filter((o) => o.n >= 5).map((o) => ({ w: o.w, n: o.n, rate: o.ok / o.n }));
    const slope = (xs) => {
      if (xs.length < 3) return null;
      const mx = xs.reduce((a, x) => a + x.w, 0) / xs.length,
        my = xs.reduce((a, x) => a + x.rate, 0) / xs.length;
      const num = xs.reduce((a, x) => a + (x.w - mx) * (x.rate - my), 0),
        den = xs.reduce((a, x) => a + (x.w - mx) * (x.w - mx), 0);
      return den ? num / den : null;
    };
    const tv = slope(weeks);
    const half = Math.floor(weeks.length / 2);
    const accel = weeks.length >= 6 ? (slope(weeks.slice(half)) - slope(weeks.slice(0, half))) / Math.max(1, weeks[half].w - weeks[0].w) : null;
    return { weeks: weeks.map((x) => ({ w: x.w, n: x.n, rate: Math.round(x.rate * 100) })), tv: tv == null ? null : Math.round(tv * 1000) / 10, accel: accel == null ? null : Math.round(accel * 1000) / 10, note: tv == null ? "Needs at least three weeks with five or more delayed, unaided answers each." : weeks.length < 6 ? "Acceleration needs at least six such weeks." : "" };
  }
  // multiplex (§36–37): distinct capability atoms with evidence (a later or unaided success), per hour of Renaissance
  function multiplex(st, days) {
    const since = Date.now() - (days || 30) * 864e5;
    const atoms = new Set();
    for (const a of st.answers || []) if (a.t >= since && a.ok && a.conf !== "guess" && /transfer|far|alien|hook|probe/.test(a.kind)) (a.atoms || []).forEach((k) => atoms.add(k));
    const today = dayKey(new Date());
    let min = 0;
    for (let i = 0; i < (days || 30); i++) min += st.days[addDays(today, -i)] || 0;
    return { atoms: [...atoms], perHour: min >= 30 ? Math.round((atoms.size / (min / 60)) * 10) / 10 : null, minutes: Math.round(min), rule: "Only atoms with a later or unaided success count; tags alone never do." };
  }
  // cultural possession (§162): a ladder per work, each rung earned by evidence, never by exposure alone
  const LADDER = ["heard of", "recognises", "knows the basic context", "knows the structure", "knows primary material", "knows the arguments", "knows the criticism", "can discuss", "can quote in context", "can compare", "can apply", "culturally possesses"];
  const RUNG = { context: 3, structure: 4, primary: 5, argument: 6, criticism: 7, discuss: 8, quote: 9, compare: 10, apply: 11 };
  function possession(st) {
    const out = {};
    const bump = (w, lvl, ev) => {
      const o = (out[w] = out[w] || { level: 0, evidence: {} });
      o.evidence[lvl] = ev;
    };
    for (const ses of allSessions()) {
      const rec = st.sessions[ses.id];
      for (const w of ses.works || []) {
        bump(w, 1, "door");
        if (rec && rec.start) bump(w, 2, ses.id);
      }
      for (const step of ses.steps) {
        if (!step.poss) continue;
        for (const [w, kind] of Object.entries(step.poss)) {
          const lvl = RUNG[kind];
          if (!lvl) continue;
          if (step.type === "passage") {
            const r = (st.reads || {})[ses.id + ":" + step.id];
            if (r && r.ok) bump(w, lvl, "read " + step.id);
            continue;
          }
          const hit = (st.answers || []).find((a) => a.sid === ses.id && (a.item === step.id || a.item === step.id + ":c") && a.ok);
          if (hit) bump(w, lvl, step.id);
        }
      }
      for (const h of ses.hooks || []) {
        if (!h.poss) continue;
        const hk = (st.answers || []).find((a) => a.item === "hook:" + h.id && a.ok && a.conf !== "guess");
        for (const [w, kind] of Object.entries(h.poss)) if (hk && RUNG[kind]) bump(w, RUNG[kind], "later, unaided: " + h.id);
      }
    }
    const rt = probeReport(st);
    for (const [w, o] of Object.entries(out)) {
      // a rung counts only if every rung below it is also earned; the top rung needs the sealed reader questions
      let lvl = 0;
      for (let k = 1; k <= 11; k++) {
        if (o.evidence[k]) lvl = k;
        else break;
      }
      const r = rt["rt-" + w];
      if (lvl >= 11 && r && r.n >= 8 && r.ok / r.n >= 0.75) lvl = 12;
      o.level = lvl;
      o.label = lvl ? LADDER[lvl - 1] : "not yet";
      o.next = lvl < 12 ? LADDER[lvl] : null;
    }
    return out;
  }
  // the twin (§163): per idea, the furthest state the record supports, plus what went backwards
  function twin(st) {
    const out = {};
    for (const ses of allSessions()) {
      const rec = st.sessions[ses.id];
      if (!rec) continue;
      const A = (st.answers || []).filter((a) => a.sid === ses.id);
      const H = (ses.hooks || []).map((h) => st.hooks[h.id]).filter(Boolean);
      const hookA = (st.answers || []).filter((a) => a.kind === "hook" && (ses.hooks || []).some((h) => "hook:" + h.id === a.item));
      const states = ["seen"];
      if (A.some((a) => a.kind === "check" && a.ok) || A.some((a) => a.kind === "predict" && a.ok)) states.push("recognises");
      if (A.some((a) => a.kind === "transfer" && a.ok)) states.push("understands");
      if (A.some((a) => (a.kind === "far" || a.kind === "alien") && a.ok)) states.push("transfers");
      if (hookA.some((a) => a.ok && a.conf !== "guess")) states.push("recalls later");
      if (st.forge[ses.id] && (st.forge[ses.id].grades || []).includes("good")) states.push("creates with");
      if (st.reality[ses.id] && st.reality[ses.id].v === "used") states.push("uses in life");
      if (H.length && H.every((h) => h.retired)) states.push("assimilated");
      const flags = [];
      const recentBugs = A.filter((a) => a.bug).length;
      if (recentBugs >= 2) flags.push("misunderstands (" + recentBugs + " diagnosed errors)");
      const hs = hookA.sort((a, b) => a.t - b.t);
      if (hs.some((a, i) => !a.ok && hs.slice(0, i).some((b) => b.ok))) flags.push("forgot once after knowing");
      out[ses.id] = { title: ses.title, state: states[states.length - 1], states, flags };
    }
    return out;
  }
  // personal intellectual physics (§75): falsifiable statements about this learner, with n, never identity labels
  function laws(st) {
    const out = [];
    const ks = kindStats(st);
    const kinds = Object.entries(ks).filter(([, v]) => v.shown >= 8);
    if (kinds.length >= 2) {
      kinds.sort((a, b) => b[1].ok / b[1].shown - a[1].ok / a[1].shown);
      const [a, b] = [kinds[0], kinds[kinds.length - 1]];
      out.push({ rule: "After a " + a[0] + " a right answer followed more often than after a " + b[0], a: a[1].ok + "/" + a[1].shown, b: b[1].ok + "/" + b[1].shown, test: "Holds only if the gap survives the control days of the picture chooser.", status: a[1].ok / a[1].shown - b[1].ok / b[1].shown >= 0.15 ? "candidate" : "no difference yet" });
    }
    const hk = (st.answers || []).filter((a) => a.kind === "hook");
    const byGap = {};
    for (const a of hk) {
      const id = a.item.slice(5),
        h = st.hooks[id];
      if (!h) continue;
      const g = (a.gap || 1) <= 2 ? "1–2 days" : a.gap <= 10 ? "3–10 days" : "over 10 days";
      const o = (byGap[g] = byGap[g] || { n: 0, ok: 0 });
      o.n++;
      if (a.ok) o.ok++;
    }
    const gaps = Object.entries(byGap).filter(([, o]) => o.n >= 6);
    if (gaps.length >= 2) out.push({ rule: "Recall by gap: " + gaps.map(([g, o]) => g + " " + o.ok + "/" + o.n).join(" · "), test: "A forgetting curve predicts lower recall at longer gaps; if it stays flat, the gaps can grow faster.", status: "measured" });
    return out;
  }

  /* ───────────── pedagogy governor ─────────────
   * Level 1 improves teaching: when one kind of representation has preceded right answers clearly more often for this
   * learner, it is shown first. Level 2 judges level 1: one eligible scene in five keeps the authored order as a control
   * arm, and once the chooser has made enough choices it must beat that arm or it switches itself off. */
  const GOV = { minN: 6, margin: 0.15, exploreEvery: 5, judgeAfter: 20, minControl: 5 };
  const hashNum = (str) => {
    let h = 2166136261;
    for (const ch of String(str)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    return h;
  };
  function kindStats(st) {
    const k = {};
    for (const pr of Object.values(st.reps || {}))
      for (const [kind, r] of Object.entries(pr)) {
        const o = (k[kind] = k[kind] || { shown: 0, ok: 0 });
        o.shown += r.shown || 0;
        o.ok += r.then_ok || 0;
      }
    return k;
  }
  function govState(st) {
    st.gov = st.gov || { log: [], off: false };
    st.gov.log = st.gov.log || [];
    return st.gov;
  }
  function govVerdict(st) {
    const done = govState(st).log.filter((d) => d.ok === true || d.ok === false);
    const arm = (control) => {
      const a = done.filter((d) => !!d.explore === control);
      return { n: a.length, ok: a.filter((d) => d.ok).length };
    };
    return { chooser: arm(false), control: arm(true) };
  }
  function judgeGovernor(st) {
    const g = govState(st);
    if (g.off) return;
    const v = govVerdict(st);
    if (v.chooser.n >= GOV.judgeAfter && v.control.n >= GOV.minControl && v.chooser.ok / v.chooser.n <= v.control.ok / v.control.n) {
      g.off = true;
      g.offAt = Date.now();
      g.offReason = "over " + v.chooser.n + " choices it did no better (" + v.chooser.ok + "/" + v.chooser.n + ") than keeping the usual order (" + v.control.ok + "/" + v.control.n + ")";
    }
  }
  function chooseRep(x) {
    if (!x.reps || x.reps.length < 2 || P.rep[x.id] != null) return;
    const st = load(),
      g = govState(st);
    judgeGovernor(st);
    if (g.off) return save();
    const ks = kindStats(st),
      rate = (k) => (ks[k] && ks[k].shown >= GOV.minN ? ks[k].ok / ks[k].shown : null),
      base = rate(x.reps[0].kind);
    if (base == null) return;
    let best = 0;
    x.reps.forEach((r, i) => {
      const v = rate(r.kind);
      if (i > 0 && v != null && v >= base + GOV.margin && v > (best ? rate(x.reps[best].kind) : -1)) best = i;
    });
    if (!best) return;
    const explore = hashNum((P.sid || "") + ":" + x.id + ":" + dayKey(new Date())) % GOV.exploreEvery === 0;
    P.rep[x.id] = explore ? 0 : best;
    const d = { t: Date.now(), step: (P.sid || "") + ":" + x.id, usual: x.reps[0].kind, chosen: x.reps[best].kind, explore, rates: [+base.toFixed(2), +rate(x.reps[best].kind).toFixed(2)], n: [ks[x.reps[0].kind].shown, ks[x.reps[best].kind].shown], ok: null };
    g.log.push(d);
    if (g.log.length > 300) g.log.splice(0, g.log.length - 300);
    P.gov[x.id] = d;
    P.govPending = d;
    save();
  }
  function logRep(x, how) {
    const st = load(),
      pr = (P.s && P.s.primitive) || "warm",
      rep = repOf(x);
    if (!rep) return;
    const r = ((st.reps[pr] = st.reps[pr] || {})[rep.kind] = st.reps[pr][rep.kind] || { shown: 0, then_ok: 0 });
    r.shown++;
    P.lastRep = { pr, kind: rep.kind, how };
    save();
  }

  /* ───────────── actions ───────────── */
  function record(id, q, k, conf, kind) {
    const st = load(),
      s = qstate(id),
      o = q.options[k];
    const stepNow = cur();
    const atoms = (stepNow && stepNow.atoms) || (P.s && P.s.atoms) || [];
    const a = { t: Date.now(), sid: P.sid || "warm", item: id, kind: kind || q.kind || "check", ok: !!o.ok, conf, ms: Date.now() - s.shown, bug: o.ok ? null : o.bug || null, hinted: !!s.hint, atoms };
    if (stepNow && stepNow.kind === "probe") {
      a.sid = "probe";
      a.form = stepNow.form;
      a.atoms = stepNow.atoms || [];
      recordProbe(st, stepNow, a);
    }
    if (stepNow && stepNow.kind === "hook") a.gap = (st.hooks[stepNow.hook] || {}).gap || 1;
    st.answers.push(a);
    // L5: a prediction that was (or wasn't) offered another view is judged by the next use-it answer in the session
    if (a.kind === "predict" && P.sid && stepNow && stepNow.alt) P.l5 = { unit: P.sid + ":" + id, arm: s.hintArm ? 1 : armOf(st, "L5", P.sid + ":" + id) };
    else if (P.l5 && /transfer|far/.test(a.kind)) {
      expLog(st, "L5", P.l5.unit, P.l5.arm, a.ok ? 1 : 0);
      P.l5 = null;
    }
    // a committed answer given before any teaching (a prediction, or an unlabelled item) is a belief on record
    if (a.kind === "predict" || a.kind === "alien") {
      st.beliefs = st.beliefs || [];
      st.beliefs.push({ t: a.t, sid: a.sid, item: id, held: o.t, conf, ok: a.ok, revisedTo: a.ok ? null : (q.options.find((x) => x.ok) || {}).t || null });
      if (st.beliefs.length > 200) st.beliefs.splice(0, st.beliefs.length - 200);
    }
    if (a.bug) st.bugs[a.bug] = (st.bugs[a.bug] || 0) + 1;
    if (P.govPending) {
      P.govPending.ok = a.ok;
      P.govPending = null;
    }
    if (P.lastRep && a.ok) {
      const r = st.reps[P.lastRep.pr]?.[P.lastRep.kind];
      if (r) r.then_ok++;
      P.lastRep = null;
    }
    const step = cur();
    if (step && step.kind === "hook") {
      const h = st.hooks[step.hook] || (st.hooks[step.hook] = { gap: 1, n: 0, ok: 0 });
      h.n++;
      const today = dayKey(new Date());
      // L6: the stretch factor is a trial; the outcome of the previous stretch is this answer
      if (h.arm != null && h.n > 1) expLog(st, "L6", step.hook + "#" + (h.n - 1), h.arm, a.ok && conf !== "guess" ? 1 : 0);
      if (a.ok && conf !== "guess") {
        h.ok++;
        h.arm = armOf(st, "L6", step.hook + "#" + h.n);
        h.gap = Math.round(Math.max(1, h.gap) * (h.arm === 1 ? 2 : 2.5));
      } else {
        h.gap = 1;
        h.arm = null;
      }
      h.due = addDays(today, h.gap);
      // assimilated: after three sure successes a gap past half a year retires the hook (garbage collection of drills)
      if (h.ok >= 3 && h.gap > 180) {
        h.retired = "assimilated";
        h.retiredAt = today;
      }
    }
    save();
    return a;
  }
  function findQ(id) {
    const x = cur();
    if (!x) return null;
    if (id === x.id) return x.type === "contrast" ? Object.assign({ kind: "check" }, x.q) : x;
    if (id === x.id + ":c") return Object.assign({ kind: "check" }, x.critique);
    if (P.challenge && id === "challenge") return P.challenge;
    return null;
  }
  function remember() {
    const x = cur();
    if (!P.sid || !x || x.stage === "warm" || x.type === "close") return;
    const st = load();
    st.sessions[P.sid].at = x.id;
    save();
  }
  function go() {
    const x = cur();
    if (x.type === "close") return finish();
    if (x.type === "passage" && P.sid) {
      const st = load(),
        ms = Date.now() - (P.seen[x.id] || Date.now()),
        n = (x.quotes || []).reduce((a, id) => a + words((quoteOf(id) || {}).text), 0);
      // 300 words a minute is a fast reader; less time than that means the passage was not read
      st.reads[P.sid + ":" + x.id] = { t: Date.now(), ms, words: n, ok: ms >= (n / 300) * 60000 };
      save();
    }
    P.sheet = null;
    P.i = Math.min(P.i + 1, P.steps.length - 1);
    remember();
    tickMinutes(false);
    draw();
  }
  function onClick(ev) {
    const b = ev.target.closest("[data-rn]");
    if (!b || b.disabled || !P) return;
    const a = b.dataset.rn,
      x = cur();
    if (a === "go") return go();
    if (a === "pick") {
      const s = qstate(b.dataset.q);
      if (s.done) return;
      s.pick = +b.dataset.k;
      return redraw();
    }
    if (a === "commit") {
      const id = b.dataset.q,
        q = findQ(id),
        s = qstate(id);
      if (!q || s.pick == null || s.done) return;
      s.done = true;
      s.conf = b.dataset.c;
      const res = record(id, q, s.pick, s.conf, id === "challenge" ? "challenge" : id.endsWith(":c") ? "check" : null);
      if (id === "challenge") return challengeResult(res);
      return redraw();
    }
    if (a === "slot") {
      const s = P.qs[x.id];
      if (s.done) return;
      s.pick[b.dataset.s] = +b.dataset.k;
      return redraw();
    }
    if (a === "forge") {
      const s = P.qs[x.id];
      s.done = true;
      const st = load();
      st.forge[P.sid || x.id] = { t: Date.now(), text: artifact(x, s).replace(/\*\*/g, ""), grades: x.slots.map((sl) => sl.options[s.pick[sl.key]].grade) };
      save();
      return redraw();
    }
    if (a === "reality") {
      const s = qstate(x.id);
      if (s.done) return;
      s.pick = b.dataset.k;
      s.done = true;
      const st = load();
      st.reality[x.fid] = { t: Date.now(), v: s.pick };
      save();
      return redraw();
    }
    if (a === "ctl" || a === "tog") {
      if (a === "tog") {
        const v = P.qs["m:" + x.id];
        v[b.dataset.c] = !v[b.dataset.c];
        b.classList.toggle("on", !!v[b.dataset.c]);
        drawModel(x);
      }
      return;
    }
    if (a === "why") return sheet(whySheet());
    if (a === "source") return sheet(sourceSheet(b.dataset.q || null));
    if (a === "play") {
      const l = (x.listen || [])[+b.dataset.l];
      if (l) {
        AUDIO.play(l.seq);
        P.used["play:" + x.id + ":" + b.dataset.l] = (P.used["play:" + x.id + ":" + b.dataset.l] || 0) + 1;
      }
      return;
    }
    if (a === "playModel") {
      const m = lookup("models", x.model);
      if (m && m.sound) AUDIO.play(m.sound(P.qs["m:" + x.id]));
      return;
    }
    if (a === "term") return sheet(termSheet(b.dataset.k));
    if (a === "deeper") {
      if (P.sid) {
        const st = load();
        st.deeper[P.sid] = (st.deeper[P.sid] || 0) + 1;
        save();
      }
      return sheet(deeperSheet());
    }
    if (a === "xray") return sheet(xraySheet());
    if (a === "xcause") return sheet(xrayFix(b.dataset.k));
    if (a === "unsheet") {
      P.sheet = null;
      return redraw();
    }
    if (a === "smd") return smd();
    if (a === "already") return already();
    if (a === "done") return stopNow();
  }
  function onInput(ev) {
    const b = ev.target.closest('[data-rn="ctl"]');
    if (!b || !P) return;
    const x = cur(),
      v = P.qs["m:" + x.id];
    v[b.dataset.c] = +b.value;
    drawModel(x);
  }
  function redraw() {
    const r = document.getElementById("rnRoot"),
      y = r ? r.scrollTop : 0;
    draw();
    if (r) r.scrollTop = y;
  }
  function sheet(html) {
    P.sheet = html;
    redraw();
    const s = document.querySelector("#rnRoot .rnSheet");
    if (s) s.scrollTop = 0;
  }
  function smd() {
    const x = cur();
    if (x.type === "q" || x.type === "contrast") {
      const q = x.type === "q" ? x : x.q,
        s = qstate(x.id);
      if (q.alt && !s.done) {
        s.hint = true;
        return redraw();
      }
    }
    if (x.reps && x.reps.length > 1) {
      P.rep[x.id] = ((P.rep[x.id] || 0) + 1) % x.reps.length;
      logRep(x, "smd");
      return redraw();
    }
    sheet("<h3>Another way</h3>" + md(x.bridge || (P.s && P.s.bridge) || "This step has one form. THIS DIDN'T CLICK finds what is in the way."));
  }
  function already() {
    const s = P.s;
    if (!s || !s.challenge) return sheet("<h3>Nothing to skip</h3><p>This part is short already.</p>");
    if (P.challengeDone) return sheet("<h3>Already tried</h3>" + md("The challenge was used once this session. CONTINUE moves on."));
    P.challenge = Object.assign({ kind: "challenge" }, s.challenge);
    P.qs.challenge = { pick: null, done: false, shown: Date.now() };
    sheet(() => '<div class="rnKind">PROVE IT</div>' + md("One question from further ahead. Right and not guessing: you skip to the part where the idea is used.") + '<div class="rnChal">' + qView(P.challenge, "challenge", null) + "</div>");
  }
  function challengeResult(res) {
    P.challengeDone = true;
    const skip = res.ok && res.conf !== "guess";
    if (skip) {
      const j = P.steps.findIndex((s, k) => k > P.i && /transfer|far|forge/.test(s.stage || ""));
      if (j > P.i) {
        P.steps.slice(P.i, j).forEach((s) => (P.used["skip:" + s.id] = 1));
        P.i = j;
      }
      P.sheet = null;
      remember();
      return draw();
    }
    const msg = res.ok ? "Right, but a guess: the lesson continues from here so the idea is yours, not luck's." : "Not yet. That is exactly what the next steps build. Nothing lost.";
    P.sheet = () => '<div class="rnKind">PROVE IT</div>' + qView(P.challenge, "challenge", null) + md(msg);
    redraw();
  }
  function stopNow() {
    const st = load();
    if (P.sid && st.sessions[P.sid]) st.sessions[P.sid].stopped = Date.now();
    save();
    P.sheet = '<h3>Stopped. Nothing is owed.</h3>' + md("Minutes so far are counted. Next time starts where you left off, with no catch-up and no penalty.") + '<button type="button" class="rnBtn" data-rn="leave">BACK TO INTELLECTUALITY</button>';
    redraw();
  }
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest('[data-rn="leave"]');
    if (b) close();
    const e = ev.target.closest("[data-rn-open]");
    if (e) {
      ev.preventDefault();
      open();
    }
    const w = ev.target.closest("[data-rn-why]");
    if (w) {
      ev.preventDefault();
      const g = gate();
      const box = document.querySelector(".rnEntry .rnEntryWhy");
      if (box) box.innerHTML = g.open && g.plan.sid ? md(sessionById(g.plan.sid).why) : md(g.msg || "");
    }
  });
  document.addEventListener("visibilitychange", () => P && tickMinutes(false));

  /* ───────────── the door on the medicine STOP screen ───────────── */
  function entryHTML() {
    const g = gate();
    if (g.why === "off" || g.why === "cns" || g.why === "nocontent") return "";
    if (!g.open)
      return '<div class="rnEntry closed" data-rn-state="' + E(g.why) + '"><div class="rnEntryTop">RENAISSANCE</div>' + md(g.msg || "") + "</div>";
    const s = g.plan.sid ? sessionById(g.plan.sid) : null;
    return (
      '<div class="rnEntry" data-rn-state="open"><div class="rnEntryTop">RENAISSANCE · TODAY · ' + g.plan.minutes + " MIN</div>" +
      '<div class="rnEntryQ">' + E(s ? s.hook : "Ideas from earlier sessions come back, without hints.") + "</div>" +
      '<button type="button" class="rnEntryGo" data-rn-open="1">CONTINUE</button> <button type="button" class="rnEntryLink" data-rn-why="1">WHY THIS?</button><div class="rnEntryWhy"></div></div>'
    );
  }
  function inject(force) {
    const p = document.getElementById("player");
    if (!p) return;
    const has = p.querySelector(".rnEntry");
    if (!cnsDone() || off()) {
      if (has) has.remove();
      return;
    }
    if (has && !force) return;
    if (has) has.remove();
    const h = entryHTML();
    if (!h) return;
    const lead = p.querySelector(".stage > h2 + p") || p.querySelector(".stage > p");
    if (lead) lead.insertAdjacentHTML("afterend", h);
    else p.insertAdjacentHTML("beforeend", h);
  }
  let tries = 0;
  function boot() {
    if (window.RENAISSANCE_BOOTED) return;
    tries++;
    if (typeof render !== "function" || typeof nextAction !== "function" || (!window.INTELLECTUALITY_MAP_BOOTED && tries < 60)) return void setTimeout(boot, 80);
    window.RENAISSANCE_BOOTED = true;
    const baseRender = render;
    render = function () {
      const out = baseRender.apply(this, arguments);
      safe(() => inject(false));
      return out;
    };
    let q = false;
    new MutationObserver(() => {
      if (q) return;
      q = true;
      requestAnimationFrame(() => {
        q = false;
        safe(() => inject(false));
      });
    }).observe(document.getElementById("player") || document.body, { childList: true });
    safe(() => inject(false));
  }

  /* the session object (§161): every session, whatever its season, compiles to this schema; a missing part is visible */
  function sessionObject(s) {
    if (!s) return null;
    const qs = s.steps.filter((x) => x.type === "q" || x.type === "contrast");
    const opts = qs.flatMap((x) => (x.type === "contrast" ? x.q.options : x.options) || []);
    return {
      id: s.id,
      title: s.title,
      domain: domainOf(s),
      targetCapabilities: s.atoms || [],
      sourceObjects: (s.provenance || []).map((p) => ({ id: p.id, source: p.source, grade: p.grade, rights: p.license })),
      irreducibleExperiences: s.steps.filter((x) => x.type === "passage" || x.type === "model" || (x.listen || []).length).map((x) => x.id),
      compressedContext: s.steps.filter((x) => x.type === "scene").map((x) => x.id),
      vocabularyBridges: Object.keys(s.vocab || {}),
      representations: s.steps.flatMap((x) => (x.reps || []).map((r) => x.id + ":" + r.kind)),
      tasks: qs.map((x) => x.id + ":" + (x.kind || x.type)),
      misconceptionBranches: opts.filter((o) => !o.ok && o.bug).length,
      transfer: s.steps.filter((x) => /transfer|far|alien/.test(x.kind || "")).map((x) => x.id),
      forge: s.steps.filter((x) => x.type === "forge").map((x) => x.id),
      memoryHooks: (s.hooks || []).map((h) => h.id + "@" + (h.gap || 1) + "d"),
      worldModelDelta: s.steps.filter((x) => x.kind === "predict" || x.kind === "alien").map((x) => x.id),
      culturalPossessionDelta: [...new Set(s.steps.flatMap((x) => Object.entries(x.poss || {}).map(([w, k]) => w + ":" + k)))],
      expectedMinutes: Math.round(s.steps.reduce((a, x) => a + (x.min || 1), 0)),
      stopCondition: s.deep ? "a deep session: weekends only, " + DOSE.deep + " minutes, and never in exam week or a heavy week" : "the day's dose (" + DOSE.full + " min, " + DOSE.short + " when short); DONE at any step",
      provenance: (s.provenance || []).length,
      rights: [...new Set((s.provenance || []).map((p) => p.license))],
      works: s.works || [],
      requires: s.requires || [],
    };
  }
  /* device independence (§112): the current step as plain speech, for voice, earbuds or a screen reader */
  function speakable() {
    if (!P) return null;
    const x = cur(),
      strip = (t) => String(t || "").replace(/\*\*|\*|\[\[|\]\]/g, "").replace(/\|[^\]]*?(?=\s|$)/g, "");
    const parts = [];
    if (x.title) parts.push(x.title + ".");
    if (x.type === "passage") (x.quotes || []).forEach((id) => { const q = quoteOf(id); if (q) parts.push(q.text.replace(/\n/g, " ") + " — " + capOf(q) + "."); });
    if (x.body) parts.push(strip(x.body));
    const q = x.type === "contrast" ? x.q : x.type === "q" ? x : null;
    if (x.type === "contrast") parts.push("First case, " + x.left.title + ": " + strip(x.left.body) + " Second case, " + x.right.title + ": " + strip(x.right.body));
    if (q) {
      if (q.dialogue) q.dialogue.forEach((d) => parts.push(d.who + " says: " + d.say));
      parts.push(strip(q.stem));
      perm(x.id, q.options.length).forEach((k, pos) => parts.push("Option " + "ABCDEFG"[pos] + ": " + q.options[k].t + "."));
    }
    if (x.type === "model") parts.push(strip(x.ask || ""));
    if (x.listen) x.listen.forEach((l) => parts.push(l.label + ": " + strip(l.text || "")));
    return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  }
  /* the learner owns the record: export it anywhere, import it on another device (sessions, answers and hooks merge) */
  function importState(obj) {
    if (!obj || obj.schema !== "renaissance.state/1" || !obj.state || obj.state.v !== 1) return { ok: false, why: "not a Renaissance export" };
    const st = load(),
      src = obj.state;
    for (const [k, t] of Object.entries(SHAPE)) if (k in src && (t === "a" ? !Array.isArray(src[k]) : typeof src[k] !== "object")) return { ok: false, why: "field " + k + " has the wrong shape" };
    const seen = new Set(st.answers.map((a) => a.t + ":" + a.item));
    let added = 0;
    for (const a of src.answers || []) if (!seen.has(a.t + ":" + a.item)) (st.answers.push(a), added++);
    st.answers.sort((a, b) => a.t - b.t);
    for (const [id, r] of Object.entries(src.sessions || {})) if (!st.sessions[id] || (r.done && !st.sessions[id].done)) st.sessions[id] = r;
    for (const [id, h] of Object.entries(src.hooks || {})) if (!st.hooks[id] || (h.n || 0) > (st.hooks[id].n || 0)) st.hooks[id] = h;
    for (const [d, m] of Object.entries(src.days || {})) st.days[d] = Math.max(st.days[d] || 0, m);
    for (const k of ["forge", "reality", "reads", "deeper", "forecasts"]) Object.assign(st[k], src[k] || {});
    if (src.probe) {
      st.probe.start = st.probe.start && src.probe.start ? (st.probe.start < src.probe.start ? st.probe.start : src.probe.start) : st.probe.start || src.probe.start;
      Object.assign(st.probe.done, src.probe.done || {});
    }
    save();
    return { ok: true, answersAdded: added };
  }

  window.RENAISSANCE = {
    version: VERSION,
    gate,
    open,
    close,
    state: () => JSON.parse(JSON.stringify(load())),
    reset: () => {
      ST = fresh();
      save();
    },
    governor: () => ({ state: JSON.parse(JSON.stringify(govState(load()))), verdict: govVerdict(load()), config: Object.assign({}, GOV) }),
    reload: () => {
      ST = null;
      return load();
    },
    current: () => (P ? { sid: P.sid, i: P.i, n: P.steps.length, id: cur().id, type: cur().type, stage: cur().stage || "", kind: cur().kind || "", short: P.short, sheet: !!P.sheet } : null),
    act: {
      go: () => P && go(),
      click: (sel) => {
        const el = document.querySelector("#rnRoot " + sel);
        if (el) el.click();
        return !!el;
      },
    },
    BUGS,
    ATOMS,
    XRAY_OF,
    LADDER,
    compile: (at) => {
      const t = at || new Date(),
        st = load(),
        today = dayKey(t);
      const c = choose(st, today, DOSE.full, t);
      return c ? { sid: c.s ? c.s.id : null, mode: c.mode, why: c.why || c.wait, ranked: (c.ranked || []).map((r) => ({ sid: r.s.id, score: r.score, parts: r.parts, reasons: r.reasons })) } : null;
    },
    sessionObject: (id) => sessionObject(sessionById(id)),
    experiments: () => expReport(load()),
    vector: () => vector(load()),
    velocity: () => velocity(load()),
    multiplex: (d) => multiplex(load(), d),
    possession: () => possession(load()),
    twin: () => twin(load()),
    laws: () => laws(load()),
    probes: () => ({ start: load().probe.start, done: Object.keys(load().probe.done).length, due: probeDue(load(), dayKey(new Date())).map((x) => x.key), report: probeReport(load()), off: probesOff() }),
    unseal: (id) => {
      const it = (SEALED().items || []).find((x) => x.id === id);
      return it ? unseal(it.blob, it.id) : null;
    },
    audio: { schedule: (seq) => AUDIO.schedule(seq), last: () => AUDIO.last, plays: () => AUDIO.plays },
    speakable: () => speakable(),
    export: () => JSON.parse(JSON.stringify({ schema: "renaissance.state/1", exported: new Date().toISOString(), app: VERSION, state: load() })),
    import: (obj) => importState(obj),
  };
  if (!off()) boot();
})();
