/* INTELLECTUALITY v17 · CNS atlas: hand-drawn, interactive diagrams of the exact things the exam asks.
 * Owner, 24 Sep 2026: "The drawings have to be crazy too, not general but world class and specific to the
 * things, because CNS is all about imagination."
 *
 * - Every diagram is drawn here as SVG from standard anatomy and labelled in the notes' own words
 *   (learn-notes-*-v15.js). No generated anatomy, no downloads, works offline.
 * - A diagram has parts you can tap (Explore), states that show one idea at a time (lesions, pathways,
 *   phases), and a "Spot it" drill (tap the structure named, 5 in a row, instant ✓/✗).
 * - Where it appears: at the top of the lesson section it belongs to (before the department's drawings
 *   and the photos), and after an MCQ is answered, set to the state that question tests. Never before an
 *   answer and never inside a sealed mock.
 * - The scenes themselves live in cns-atlas-scenes-v17.js; this file is the engine.
 */
(function () {
  "use strict";
  const VERSION = "17.0";
  const SC = Object.create(null);
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const md = (s) => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "<i>$1</i>");
  function safe(f, fb) {
    try {
      return f();
    } catch (e) {
      console.warn("[atlas]", e);
      return fb;
    }
  }
  const reduced = () => safe(() => matchMedia("(prefers-reduced-motion: reduce)").matches, false) || !!safe(() => S.game?.opt?.calm, false);

  /* ───────────── geometry helpers (used by the scenes) ───────────── */
  const r1 = (n) => Math.round(n * 10) / 10;
  // Catmull-Rom through points → smooth cubic path
  function smooth(pts, closed) {
    const n = pts.length;
    if (n < 3) return "M" + pts.map((p) => r1(p[0]) + " " + r1(p[1])).join(" L");
    const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1),
        p1 = P(i),
        p2 = P(i + 1),
        p3 = P(i + 2);
      d += " C" + r1(p1[0] + (p2[0] - p0[0]) / 6) + " " + r1(p1[1] + (p2[1] - p0[1]) / 6) + " " + r1(p2[0] - (p3[0] - p1[0]) / 6) + " " + r1(p2[1] - (p3[1] - p1[1]) / 6) + " " + r1(p2[0]) + " " + r1(p2[1]);
    }
    return d + (closed ? "Z" : "");
  }
  // Chaikin corner cutting: a polygon with soft corners
  function chaikin(pts, it) {
    let p = pts;
    for (let k = 0; k < (it || 2); k++) {
      const q = [];
      for (let i = 0; i < p.length; i++) {
        const a = p[i],
          b = p[(i + 1) % p.length];
        q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
      }
      p = q;
    }
    return p;
  }
  const poly = (pts) => "M" + pts.map((p) => r1(p[0]) + " " + r1(p[1])).join(" L") + "Z";
  // an ellipse-based polar frame: θ in degrees (0 = right, 90 = down), r as a fraction of the radii
  function frame(cx, cy, rx, ry) {
    const at = (th, r) => [cx + r * rx * Math.cos((th * Math.PI) / 180), cy + r * ry * Math.sin((th * Math.PI) / 180)];
    const band = (t1, t2, ra, rb, soft) => {
      const out = [],
        inn = [],
        steps = Math.max(3, Math.ceil(Math.abs(t2 - t1) / 1.5));
      for (let i = 0; i <= steps; i++) {
        const t = t1 + ((t2 - t1) * i) / steps;
        out.push(at(t, rb));
        inn.push(at(t, ra));
      }
      const pts = out.concat(inn.reverse());
      return soft === 0 ? poly(pts) : poly(chaikin(pts, soft || 2));
    };
    const blob = (list) => smooth(list.map(([t, r]) => at(t, r)), true);
    return { at, band, blob, cx, cy, rx, ry };
  }

  /* ───────────── registry ───────────── */
  // def: { title, kicker?, vb, svg() → inner markup, parts: {id: [name, text]}, sims: [{id, label, on, lost, show,
  //        cls, info, res()}], drill: [ids], intro, secs: {sectionId: simId|""}, rules: [[RegExp, simId]], live(card, sim) }
  function scene(id, def) {
    def.id = id;
    def.sims = def.sims || [];
    def.parts = def.parts || {};
    SC[id] = def;
  }
  const baseOf = (pid) => String(pid).split(".")[0];
  const sideOf = (pid) => ({ R: "right", L: "left" }[String(pid).split(".")[1]] || "");
  const hits = (list, pid) => !!list && (list.includes(pid) || list.includes(baseOf(pid)));

  /* ───────────── rendering ───────────── */
  let N = 0;
  function cardHTML(id, simId, opt) {
    const d = SC[id];
    if (!d) return "";
    opt = opt || {};
    const k = "ixa" + ++N,
      sim = d.sims.find((s) => s.id === simId) || null;
    const chips =
      '<button type="button" class="ixAChip' + (sim ? "" : " on") + '" data-ixa-go="">👆 Explore</button>' +
      d.sims.map((s) => '<button type="button" class="ixAChip' + (sim && sim.id === s.id ? " on" : "") + '" data-ixa-go="' + E(s.id) + '">' + E(s.label) + "</button>").join("") +
      (d.drill && d.drill.length ? '<button type="button" class="ixAChip ixADrillBtn" data-ixa-drill="1">🎯 Spot it</button>' : "");
    return (
      '<div class="ixA' + (opt.zoom ? " ixAZoomed" : "") + (opt.compact ? " ixACompact" : "") + '" data-ixa="' + E(id) + '" data-ixa-sim="' + E(sim ? sim.id : "") + '" data-ixa-k="' + k + '">' +
      '<div class="ixAHd"><span class="ixAK">' + E(d.kicker || "LIVE DIAGRAM") + '</span><b class="ixAT">' + md(d.title) + "</b>" +
      (opt.zoom ? '<button type="button" class="ixAZ" data-ixa-close="1" aria-label="Close">✕</button>' : '<button type="button" class="ixAZ" data-ixa-zoom="1" aria-label="Full screen">⤢</button>') +
      "</div>" +
      '<div class="ixABar" role="toolbar">' + chips + "</div>" +
      '<div class="ixAStage"><svg class="ixASvg" viewBox="' + E(d.vb) + '" role="img" aria-label="' + E(String(d.title).replace(/\*\*/g, "")) + '">' + d.svg() + "</svg></div>" +
      '<div class="ixAInfo" aria-live="polite"></div></div>'
    );
  }
  function defOf(card) {
    return SC[card.dataset.ixa];
  }
  function apply(card, simId) {
    const d = defOf(card);
    if (!d) return;
    const sim = d.sims.find((s) => s.id === simId) || null;
    card.dataset.ixaSim = sim ? sim.id : "";
    delete card.dataset.ixaPick;
    stopDrill(card);
    const svg = card.querySelector("svg.ixASvg"),
      any = !!sim && !sim.keep && ((sim.on || []).length || (sim.lost || []).length);
    svg.setAttribute("class", "ixASvg" + (sim && sim.cls ? " " + sim.cls : "") + (reduced() ? " ixStill" : ""));
    card.querySelectorAll("[data-p]").forEach((el) => {
      const p = el.dataset.p,
        on = !!sim && hits(sim.on, p),
        lost = !!sim && hits(sim.lost, p);
      el.classList.toggle("ixOn", on);
      el.classList.toggle("ixLost", lost);
      el.classList.toggle("ixMute", any && !on && !lost);
      el.classList.remove("ixPick", "ixGood", "ixBad");
    });
    card.querySelectorAll("[data-x]").forEach((el) => el.classList.toggle("ixShow", !!sim && (sim.show || []).includes(el.dataset.x)));
    card.querySelectorAll(".ixAChip[data-ixa-go]").forEach((b) => b.classList.toggle("on", (b.dataset.ixaGo || "") === (sim ? sim.id : "")));
    const info = card.querySelector(".ixAInfo");
    if (info) info.innerHTML = sim ? '<p class="ixAMain">' + md(sim.info || "") + "</p>" + (sim.res ? safe(() => sim.res(), "") : "") : '<p class="ixAHint">' + md(d.intro || "Tap any structure to name it and see why it matters.") + "</p>";
    if (d.live) safe(() => d.live(card, sim));
  }
  function explore(card, pid) {
    const d = defOf(card),
      base = baseOf(pid),
      part = d.parts[base];
    if (!part) return;
    card.querySelectorAll("[data-p]").forEach((el) => {
      const same = baseOf(el.dataset.p) === base;
      el.classList.toggle("ixPick", same && (el.dataset.p === pid || !sideOf(pid)));
      el.classList.toggle("ixMute", !same);
      el.classList.remove("ixOn", "ixLost");
    });
    card.dataset.ixaPick = base;
    const side = sideOf(pid);
    card.querySelector(".ixAInfo").innerHTML = '<p class="ixAMain"><b class="ixAName">' + md(part[0]) + "</b>" + (side ? ' <span class="ixASide">' + side + " side</span>" : "") + "</p>" + (part[1] ? '<p class="ixASub">' + md(part[1]) + "</p>" : "");
    game("explore", 0);
  }

  /* ───────────── Spot it (tap the named structure) ───────────── */
  const DR = new WeakMap();
  function startDrill(card) {
    const d = defOf(card);
    if (!d || !d.drill || !d.drill.length) return;
    apply(card, "");
    const pool = d.drill.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const q = pool.slice(0, Math.min(5, pool.length));
    DR.set(card, { q, i: 0, ok: 0, lock: false });
    card.classList.add("ixADrilling");
    card.querySelectorAll(".ixAChip").forEach((b) => b.classList.toggle("on", !!b.dataset.ixaDrill));
    card.querySelectorAll("[data-p]").forEach((el) => el.classList.remove("ixMute", "ixOn", "ixLost", "ixPick"));
    promptDrill(card);
  }
  function stopDrill(card) {
    DR.delete(card);
    card.classList.remove("ixADrilling");
  }
  function promptDrill(card) {
    const st = DR.get(card),
      d = defOf(card);
    if (!st) return;
    const dots = st.q.map((_, i) => '<i class="' + (i < st.i ? (st.res && st.res[i] ? "ok" : "no") : i === st.i ? "now" : "") + '"></i>').join("");
    card.querySelector(".ixAInfo").innerHTML = '<p class="ixADrillQ"><span>🎯 Tap</span> <b>' + md(d.parts[st.q[st.i]][0]) + '</b></p><p class="ixADots">' + dots + "</p>";
  }
  function drillTap(card, pid) {
    const st = DR.get(card),
      d = defOf(card);
    if (!st || st.lock) return;
    const want = st.q[st.i],
      ok = baseOf(pid) === want;
    st.res = st.res || [];
    st.res[st.i] = ok;
    if (ok) st.ok++;
    st.lock = true;
    card.querySelectorAll("[data-p]").forEach((el) => {
      const b = baseOf(el.dataset.p);
      el.classList.toggle("ixGood", b === want);
      el.classList.toggle("ixBad", !ok && el.dataset.p === pid);
    });
    game("spot", ok ? 3 : 1);
    const info = card.querySelector(".ixAInfo");
    info.insertAdjacentHTML("beforeend", '<p class="ixADrillR ' + (ok ? "ok" : "no") + '">' + (ok ? "✓ Yes, " : "✗ That was " + md(d.parts[baseOf(pid)]?.[0] || "another structure") + ". It's the glowing one: ") + md(d.parts[want][0]) + "</p>");
    setTimeout(
      () => {
        if (DR.get(card) !== st) return;
        st.lock = false;
        st.i++;
        card.querySelectorAll("[data-p]").forEach((el) => el.classList.remove("ixGood", "ixBad"));
        if (st.i < st.q.length) return promptDrill(card);
        const n = st.q.length,
          bonus = st.ok === n ? 10 : 0;
        if (bonus) game("spotAll", bonus);
        stopDrill(card);
        card.querySelectorAll(".ixAChip").forEach((b) => b.classList.toggle("on", b.dataset.ixaGo === ""));
        card.querySelector(".ixAInfo").innerHTML =
          '<p class="ixADrillEnd"><b>' + st.ok + " / " + n + "</b> " + (st.ok === n ? "🔥 clean sweep" + (bonus ? " · +" + bonus + " XP bonus" : "") : st.ok >= n - 1 ? "nearly perfect" : "run it again, it sticks on the second pass") + '</p><button type="button" class="ixAChip ixADrillBtn" data-ixa-drill="1">🎯 Again</button>';
      },
      ok ? 650 : 1500,
    );
  }
  const game = (kind, xp) => safe(() => window.IX_GAME?.award?.(kind, xp));

  /* ───────────── full screen ───────────── */
  function zoom(card) {
    const o = document.createElement("div");
    o.className = "ixAZoom";
    o.innerHTML = cardHTML(card.dataset.ixa, card.dataset.ixaSim, { zoom: true });
    document.body.appendChild(o);
    document.documentElement.classList.add("ixANoScroll");
    const c = o.querySelector(".ixA");
    apply(c, card.dataset.ixaSim);
  }
  function closeZoom() {
    document.querySelectorAll(".ixAZoom").forEach((z) => z.remove());
    document.documentElement.classList.remove("ixANoScroll");
  }

  document.addEventListener("click", (ev) => {
    const t = ev.target;
    if (!t || !t.closest) return;
    const card = t.closest(".ixA");
    if (!card) {
      if (t.classList && t.classList.contains("ixAZoom")) closeZoom();
      return;
    }
    const go = t.closest("[data-ixa-go]");
    if (go) return void apply(card, go.dataset.ixaGo);
    if (t.closest("[data-ixa-drill]")) return void startDrill(card);
    if (t.closest("[data-ixa-zoom]")) return void zoom(card);
    if (t.closest("[data-ixa-close]")) return void closeZoom();
    const act = t.closest("[data-ixa-act]");
    if (act) return void safe(() => defOf(card).act?.(card, act.dataset.ixaAct, act));
    const part = t.closest("[data-p]");
    if (!part) return;
    if (DR.has(card)) return void drillTap(card, part.dataset.p);
    if (card.dataset.ixaSim && defOf(card).tapInSim) return void defOf(card).tapInSim(card, part.dataset.p);
    explore(card, part.dataset.p);
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeZoom();
  });

  /* ───────────── shared defs (patterns used by every diagram) ───────────── */
  function defs() {
    if (document.getElementById("ixADefs")) return;
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.id = "ixADefs";
    s.setAttribute("width", "0");
    s.setAttribute("height", "0");
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    const hatch = (id, a, b) => '<pattern id="' + id + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="' + a + '"/><rect width="3.2" height="7" fill="' + b + '"/></pattern>';
    s.innerHTML =
      "<defs>" +
      hatch("ixHatch", "#ff5d7a55", "#ff5d7acc") +
      hatch("ixPatM", "#ff5d8f33", "#ff5d8fee") +
      hatch("ixPatD", "#4cc9f033", "#4cc9f0ee") +
      hatch("ixPatP", "#ff9f4333", "#ff9f43ee") +
      hatch("ixPatMD", "#4cc9f0ee", "#ff5d8fee") +
      hatch("ixPatMP", "#ff9f43ee", "#ff5d8fee") +
      hatch("ixPatAll", "#ffd166ee", "#ff5d8fee") +
      hatch("ixPatDim", "#0000", "#ffffff22") +
      '<radialGradient id="ixGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="ixTissue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f1ec"/><stop offset="1" stop-color="#e4ded6"/></linearGradient>' +
      '<linearGradient id="ixGrey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7aebe"/><stop offset="1" stop-color="#b394aa"/></linearGradient>' +
      '<marker id="ixArr" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#e9f1fb"/></marker>' +
      '<marker id="ixArrG" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#5ef0a0"/></marker>' +
      '<marker id="ixBarR" viewBox="0 0 10 10" refX="5" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M4 0 H7 V10 H4z" fill="#ff5d7a"/></marker>' +
      "</defs>";
    (document.body || document.documentElement).appendChild(s);
  }

  /* ───────────── where each diagram goes ───────────── */
  let SEC = null,
    SECN = 0;
  function secMap() {
    if (SEC && SECN === Object.keys(SC).length) return SEC;
    SECN = Object.keys(SC).length;
    SEC = new Map();
    for (const d of Object.values(SC)) for (const [sid, sim] of Object.entries(d.secs || {})) if (!SEC.has(sid)) SEC.set(sid, [d.id, sim || ""]);
    return SEC;
  }
  const QB = () => window.EHSAN_QBANK || { questions: [] };
  let QM = null;
  const qget = (id) => {
    if (!QM) {
      QM = new Map();
      for (const q of QB().questions || []) QM.set(q.id, q);
    }
    return QM.get(id) || null;
  };
  // the diagram and state for an answered question: a rule on its stem + key text wins, else its note section
  function forQuestion(qid) {
    const q = qget(qid);
    if (!q) return null;
    const keys = new Set(q.answerKeys || []),
      keyText = (q.options || []).filter((o) => o && keys.has(o.key)).map((o) => o.text).join(" "),
      text = (q.stem || "") + " " + keyText;
    const sec = safe(() => window.INTELLECTUALITY_V15?.bestSection(qid)?.id, null),
      home = sec ? secMap().get(sec) : null;
    // rules of the section's own diagram first, then any diagram
    const order = home ? [SC[home[0]], ...Object.values(SC).filter((d) => d.id !== home[0])] : Object.values(SC);
    for (const d of order) for (const [re, sim] of d.rules || []) if (re.test(text)) return { id: d.id, sim, sec };
    return home ? { id: home[0], sim: home[1], sec } : null;
  }
  function forSection(sid) {
    const m = secMap().get(sid);
    return m ? { id: m[0], sim: m[1] } : null;
  }

  function mountAt(el, where, id, sim, opt) {
    const box = document.createElement("div");
    box.className = "ixAWrap";
    box.innerHTML = cardHTML(id, sim, opt);
    where(box);
    const card = box.querySelector(".ixA");
    apply(card, sim);
    return card;
  }
  function decorate() {
    const player = document.getElementById("player");
    if (!player) return;
    player.querySelectorAll(".v15Sec[data-v15-sec]:not([data-ixa-done])").forEach((el) => {
      el.dataset.ixaDone = "1";
      const m = forSection(el.dataset.v15Sec);
      if (!m) return;
      // order in a section: this diagram, then the department's drawings, then the photos
      const at = el.querySelector(":scope > .ixDeptWrap") || el.querySelector(":scope > .v15Pics") || el.querySelector(":scope > .v15Pts");
      mountAt(el, (box) => (at ? at.before(box) : el.append(box)), m.id, m.sim);
    });
    player.querySelectorAll(".v16Explain[data-qid]:not([data-ixa-done])").forEach((el) => {
      const dt = el.closest("details");
      if (dt && !dt.open) return; // mock review: drawn when the item is opened
      el.dataset.ixaDone = "1";
      const m = forQuestion(el.dataset.qid);
      if (!m) return;
      const at = el.querySelector(":scope > .ixDeptWrap") || el.querySelector(":scope > .v16Pics") || el.querySelector(":scope > details.v15Note") || el.querySelector(":scope > .v16Tiny");
      mountAt(el, (box) => (at ? at.before(box) : el.append(box)), m.id, m.sim, { compact: true });
    });
  }
  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      safe(decorate);
    });
  }
  function boot() {
    if (window.INTELLECTUALITY_ATLAS_BOOTED) return;
    if (!document.body) return void setTimeout(boot, 30);
    window.INTELLECTUALITY_ATLAS_BOOTED = true;
    defs();
    const player = document.getElementById("player");
    if (player) new MutationObserver(schedule).observe(player, { childList: true, subtree: true });
    document.addEventListener("toggle", (e) => e.target && e.target.matches && e.target.matches("details") && schedule(), true);
    schedule();
  }

  /* ───────────── drawing kit shared by the scene files ───────────── */
  const C = { dc: "#4cc9f0", pain: "#ff9f43", crude: "#ffd166", mot: "#ff5d8f", cb: "#7bed9f", ex: "#b39cff" };
  const rest = { dc: "#d3e9f3", pain: "#f5ddc6", crude: "#f3eac4", mot: "#f2d3de", cb: "#d6efdc", ex: "#e2daf3" };
  const T = (x, y, s, cls, anchor) => '<text class="lab' + (cls ? " " + cls : "") + '" x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : ' text-anchor="middle"') + ">" + E(s) + "</text>";
  const pf = (id, d, c, r, extra) => '<path class="pf" data-p="' + id + '" d="' + d + '" style="--c:' + c + ";--r:" + (r || "#e7ecf3") + '"' + (extra || "") + "/>";
  const ps = (id, d, c, r, w, extra) => '<path class="ps" data-p="' + id + '" d="' + d + '" style="--c:' + c + ";--r:" + (r || "#7d93ad") + ";--w:" + (w || 3) + '"' + (extra || "") + "/>";
  const fl = (x, d, c, w, t) => '<path class="flb" data-x="' + x + '" d="' + d + '" style="--c:' + c + ";--w:" + (w || 3.4) + '"/>' + '<path class="fl" data-x="' + x + '" pathLength="100" d="' + d + '" style="--c:' + c + ";--w:" + (w || 3.4) + ";--t:" + (t || "2.4s") + '"/><path class="fl fl2" data-x="' + x + '" pathLength="100" d="' + d + '" style="--c:' + c + ";--w:" + (w || 3.4) + ";--t:" + (t || "2.4s") + '"/>';
  const box = (title, items) => '<div class="ixABox"><h5>' + E(title) + "</h5><ul>" + items.map((x) => "<li>" + md(x) + "</li>").join("") + "</ul></div>";
  const leg = (items) => '<div class="ixALeg">' + items.map(([c, t]) => '<span><i style="background:' + c + '"></i>' + E(t) + "</span>").join("") + "</div>";
  const mirror = (inner, cx) => '<g transform="matrix(-1 0 0 1 ' + 2 * cx + ' 0)">' + inner + "</g>";

  /* ───────── body map: which parts of the body lose what (front view: patient's right on the left) ───────── */
  const PAT = { M: "url(#ixPatM)", D: "url(#ixPatD)", P: "url(#ixPatP)", MD: "url(#ixPatMD)", MP: "url(#ixPatMP)", ALL: "url(#ixPatAll)" };
  function body(map, level) {
    const piece = {
      head: "M60 7 A13 13 0 0 0 60 33 Z",
      neck: "M60 33 L53 34 L53 42 L60 42 Z",
      up: "M60 42 L42 44 L34 51 L37 78 L60 78 Z",
      arm: "M34 51 L25 59 L18 95 L12 121 L19 123 L27 98 L37 73 Z",
      low: "M37 78 L60 78 L60 112 L40 112 L38 96 Z",
      leg: "M40 112 L60 112 L58 122 L55 176 L45 178 L42 140 Z",
    };
    const side = (s, flip) => {
      const g = Object.entries(piece)
        .map(([k, d]) => {
          const f = map[s]?.[k];
          return '<path d="' + d + '" fill="' + (f ? PAT[f] : "#1d3149") + '" stroke="#4e6c8e" stroke-width=".8"/>';
        })
        .join("");
      return flip ? '<g transform="matrix(-1 0 0 1 120 0)">' + g + "</g>" : g;
    };
    return (
      '<svg viewBox="0 0 120 192" role="img" aria-label="Body map">' + side("R", false) + side("L", true) +
      (level ? '<line x1="4" x2="116" y1="' + level + '" y2="' + level + '" stroke="#ff5d7a" stroke-width="1" stroke-dasharray="3 2"/>' : "") +
      '<text x="14" y="189" font-size="9" font-weight="900" fill="#9fb4cc">R</text><text x="100" y="189" font-size="9" font-weight="900" fill="#9fb4cc">L</text></svg>'
    );
  }
  const bodyBox = (map, level, lg) => '<div class="ixABox">' + body(map, level) + leg(lg) + "</div>";

  window.IX_ATLAS = {
    version: VERSION,
    scene,
    frame,
    smooth,
    chaikin,
    poly,
    E,
    md,
    scenes: () => Object.keys(SC),
    def: (id) => SC[id] || null,
    html: cardHTML,
    apply,
    mount: (el, id, sim, opt) => mountAt(el, (box) => el.append(box), id, sim, opt),
    forQuestion,
    forSection,
    sections: () => [...secMap().keys()],
    decorate,
    kit: { C, rest, T, pf, ps, fl, box, leg, mirror, body, bodyBox, PAT },
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
