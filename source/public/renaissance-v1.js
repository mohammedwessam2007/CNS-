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
  const DOSE = { full: 25, short: 10 };
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
  const fresh = () => ({ v: 1, sessions: {}, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: "" });
  let ST = null;
  function load() {
    if (ST) return ST;
    ST = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null);
    if (!ST || ST.v !== 1) ST = fresh();
    for (const [k, v] of Object.entries(fresh())) if (!(k in ST)) ST[k] = v;
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
    const p = plan(st, dose, today);
    if (!p) return { open: false, why: "seasondone", msg: "Every season written so far is complete. The next one is being built; nothing is due." };
    return { open: true, dose, reasons, plan: p };
  }

  /* ───────────── the planner ───────────── */
  function dueHooks(st, today) {
    const H = allHooks();
    return Object.entries(st.hooks)
      .filter(([id, h]) => H[id] && h.due <= today)
      .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : (a[1].n || 0) - (b[1].n || 0) || (a[1].gap || 0) - (b[1].gap || 0)))
      .map(([id]) => H[id]);
  }
  function plan(st, dose, today) {
    const s = allSessions().find((x) => !(st.sessions[x.id] && st.sessions[x.id].done));
    const due = dueHooks(st, today);
    if (!s && !due.length) return null;
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
    }
    let partial = false;
    if (s) {
      const from = rec.at ? Math.max(0, s.steps.findIndex((x) => x.id === rec.at)) : 0;
      let budget = short ? DOSE.short - steps.reduce((a, x) => a + (x.min || 1), 0) - 1 : Infinity;
      for (const x of s.steps.slice(from)) {
        if (short && x.opt) continue;
        if (short && budget < (x.min || 1) && steps.some((y) => y.stage !== "warm")) {
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
    return { sid: s ? s.id : null, steps, minutes, short, start, partial };
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
    P = { sid: p.sid, s: sessionById(p.sid), steps: p.steps, i: p.start, dose: g.dose, reasons: g.reasons, minutes: p.minutes, short: p.short, partial: p.partial, t0: Date.now(), acc: 0, qs: {}, rep: {}, shownRep: {}, gov: {}, sheet: null, used: {} };
    if (p.sid) {
      const rec = (st.sessions[p.sid] = st.sessions[p.sid] || { start: Date.now() });
      rec.short = p.short;
    }
    st.lastWarm = dayKey(at || new Date());
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
    const warm = x && x.stage === "warm",
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
      terms(x)
    );
  }
  const terms = (x) =>
    x.terms && x.terms.length
      ? '<div class="rnTerms">' + x.terms.map((k) => (vocab(k) ? '<button type="button" class="rnTerm" data-rn="term" data-k="' + E(k) + '">' + E(vocab(k).name || k) + "</button>" : "")).join("") + "</div>"
      : "";

  function qView(q, id, step) {
    const s = qstate(id),
      hookBanner = step && step.kind === "hook" ? '<div class="rnBanner">From an earlier session · no hints this time</div>' : "";
    const tag = { predict: "PREDICT FIRST", check: "CHECK", transfer: "USE IT", far: "SOMEWHERE NEW", alien: "NO LABELS: WHICH IDEA IS THIS?", hook: "REMEMBER", challenge: "PROVE IT" }[q.kind || "check"] || "";
    let h = hookBanner + (tag ? '<div class="rnKind">' + tag + "</div>" : "") + (q.title ? "<h2>" + E(q.title) + "</h2>" : "") + md(q.stem);
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
    if (s.done) {
      const o = q.options[s.pick],
        right = q.options.find((x) => x.ok);
      h += '<div class="rnFb ' + (o.ok ? "ok" : "no") + '">' + (o.ok ? "<b>✓ Right.</b>" : "<b>✗ Not this one.</b>" + (o.bug && BUGS[o.bug] ? ' <span class="rnBug">' + E(BUGS[o.bug]) + "</span>" : "")) + md(o.ok ? o.why || "" : o.why || "") + (!o.ok && right ? md("**The answer:** " + right.t + (right.why ? ". " + right.why : "")) : "") + md(q.after || "") + "</div>";
      if (!o.ok && q.repair) h += '<div class="rnRep" data-kind="repair"><div class="rnRepTag">Seen another way</div>' + visual(q.repair.svg) + md(q.repair.body) + "</div>";
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
      '</div><div class="rnRead"></div></div>' +
      (x.ask ? '<div class="rnAsk">' + md(x.ask) + "</div>" : "") +
      terms(x)
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
      Object.keys(bugs).length ? "**Still weak:** " + Object.entries(bugs).map(([b, n]) => BUGS[b] + (n > 1 ? " ×" + n : "")).join(" · ") + ". These return first." : "**Still weak:** nothing showed today; the delayed hooks are the real test.",
      hooks.length ? "**Comes back (no hints):** " + hooks.map((h) => pretty(h.due)).join(" · ") + "." : "",
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
      const k = s.steps.findIndex((x) => x.id === P.steps[P.steps.length - 2]?.id);
      if (k >= 0 && s.steps[k + 1]) rec.at = s.steps[k + 1].id;
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
      md("**Chosen by:** the first unfinished session of Season 1, in an order that alternates between kinds of idea; due hooks from earlier sessions open it. **Dose:** " + P.dose + " minutes" + (P.reasons.length ? " (shortened: " + P.reasons.join(", ") + ")" : "") + ".") +
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
          const lab = (k) => ((x.reps || []).find((r) => r.kind === k) || {}).label || k;
          h += d.explore
            ? md("**Picture order:** the usual first picture was kept this time on purpose (one time in five), so the choice below keeps being checked.")
            : md("**Picture chosen for you:** " + lab(d.chosen) + " first. For you, this kind of picture preceded a right answer " + Math.round(d.rates[1] * 100) + "% of " + d.n[1] + " times, the usual first one " + Math.round(d.rates[0] * 100) + "% of " + d.n[0] + ".");
        }
        if (g.off) h += md("**The picture chooser is switched off:** " + g.offReason + ". Pictures come in the authored order.");
        else if (v.chooser.n) h += md("**Checking the chooser:** after its choices, right " + v.chooser.ok + "/" + v.chooser.n + "; with the usual order kept, right " + v.control.ok + "/" + v.control.n + ". It switches itself off if it stops doing better.");
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
    st.answers.push(a);
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
      if (a.ok && conf !== "guess") {
        h.ok++;
        h.gap = Math.round(Math.max(1, h.gap) * 2.5);
      } else h.gap = 1;
      h.due = addDays(today, h.gap);
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
    if (a === "term") return sheet(termSheet(b.dataset.k));
    if (a === "deeper") return sheet(deeperSheet());
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
  };
  if (!off()) boot();
})();
