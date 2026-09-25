/* INTELLECTUALITY v17.1 · Course map. Owner, 25 Sep 2026: "A feature to see the upcoming days and the previous
 * days like a map, and I can skip something if I want. Full access to the dates and everything I can see."
 *
 * - The whole road: every day with its real date, what it holds (lessons, rounds, mocks, the sprint, the exam),
 *   its status (done, today, behind, moved, skipped, ahead), and the lessons' past-paper counts.
 * - Read any lesson now (past, today or future): its notes, live diagrams and pictures, read-only.
 * - Skip a lesson, a round, a mock, the rest of today or a whole day; jump ahead to any day. Undo a skip that
 *   has not been passed yet.
 * - Skipping never loses a past paper: a skipped lesson counts as taught, so its past papers join the daily
 *   rounds (the engine still finishes every one before the sprint). "Mark learned" (after reading ahead)
 *   keeps the lesson's own question block for its day. A skipped mock hands its held-out items to later mocks.
 * - Nothing is changed while a sealed mock is running.
 */
(function () {
  "use strict";
  const VERSION = "17.1";
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const md = (s) => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  function safe(f, fb) {
    try {
      return f();
    } catch (e) {
      console.warn("[map]", e);
      return fb;
    }
  }
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  const persist = () => safe(() => typeof save === "function" && save());
  const V16 = () => window.INTELLECTUALITY_V16 || null;
  const V15 = () => window.INTELLECTUALITY_V15 || null;
  const ymd = () => safe(() => window.INTELLECTUALITY_V14.cairoYMD(), null) || new Date().toISOString().slice(0, 10);
  const DAYS = () => (typeof C !== "undefined" && C.days) || [];
  const examDate = () => ((typeof C !== "undefined" && C.examAnchors) || []).find((x) => x.id === "MCQ")?.date || "2026-11-15";
  const examDay = () => DAYS().find((d) => d.date === examDate())?.day || 56;
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dt = (s) => {
    const d = new Date(s + "T12:00:00Z");
    return { wd: WD[d.getUTCDay()], dd: d.getUTCDate(), mo: MO[d.getUTCMonth()], dow: d.getUTCDay() };
  };
  const fmt = (s) => {
    const x = dt(s);
    return x.wd + " " + x.dd + " " + x.mo;
  };
  const daysBetween = (a, b) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 864e5);
  const SUBJ = { ANATOMY: ["#ff8fb7", "Anat"], PHYSIOLOGY: ["#66e9ff", "Phys"], HISTOLOGY: ["#b99cff", "Hist"] };
  const STEP = { visual: "Visual map", teach: "Learn the notes", video: "Teaching video", reconstruct: "Recall from memory", question: "Past-paper block" };

  /* ───────────── state: what the map changed (small; repaired on read) ───────────── */
  function M() {
    if (typeof S === "undefined" || !S) return null;
    let m = S.map;
    if (!isObj(m) || m.v !== 1) m = S.map = { v: 1 };
    m.les = isObj(m.les) ? m.les : {};
    m.days = isObj(m.days) ? m.days : {};
    m.log = Array.isArray(m.log) ? m.log.slice(-30) : [];
    return m;
  }
  const lk = (d, l) => d.day + ":" + l.id;
  const bkey = (d, l) => (l._from || d.day) + ":" + l.id; // the v16 block key
  const segDone = (d, l, i) => !!safe(() => S.segments[segmentKey(d, l, i)], false);
  const inMock = () => safe(() => !!(S.v16 && S.v16.mock && !S.v16.mock.done), false);
  const workDay = () => safe(() => S.day, 1);
  const planDay = () => {
    const t = ymd();
    let best = 1;
    for (const d of DAYS()) {
      if (d.date <= t) best = d.day;
      else break;
    }
    return best;
  };
  const isDone = (d) => (safe(() => S.doneDays, []) || []).includes(d.day);
  const mockDay = (d) => d.mode === "CONTINUITY" && (d.continuityType === "WEEKLY_MOCK" || d.continuityType === "MCQ_SPRINT") && d.day < examDay();
  const mockRec = (d) => (safe(() => S.v16.mocks, []) || []).find((x) => x.day === d.day) || null;

  function lessonState(d, l) {
    const segs = l.segments || [];
    let done = 0;
    segs.forEach((_, i) => segDone(d, l, i) && done++);
    const rec = M().les[lk(d, l)] || null;
    return { n: segs.length, done, rec, all: done >= segs.length && segs.length > 0, teach: segs.some((s, i) => s.type === "teach" && segDone(d, l, i)) };
  }
  // past papers owned by each lesson (practice split), and how many were answered / right
  let OWN = null;
  function owned() {
    if (OWN) return OWN;
    OWN = new Map();
    const v16 = V16();
    if (!v16) return OWN;
    for (const q of (window.EHSAN_QBANK && window.EHSAN_QBANK.questions) || []) {
      if (q.split !== "practice" || !q.autoScore) continue;
      const lid = safe(() => v16.owner(q.id), null);
      if (!lid) continue;
      if (!OWN.has(lid)) OWN.set(lid, []);
      OWN.get(lid).push(q.id);
    }
    return OWN;
  }
  function mcqStats(lid) {
    const ids = owned().get(lid) || [],
      q = safe(() => S.v16.q, {}) || {};
    let a = 0,
      k = 0;
    for (const id of ids)
      if (q[id]) {
        a++;
        if (q[id].r !== "w") k++;
      }
    return { n: ids.length, a, k };
  }
  // lessons moved to another day by the start-from-today spread: origin day → where they went
  let MVC = null;
  function movedMap() {
    if (MVC && MVC.at > Date.now() - 500) return MVC.m;
    const out = new Map();
    for (const d of DAYS())
      for (const l of d.lessons || [])
        if (l._from && l._from !== d.day) {
          if (!out.has(l._from)) out.set(l._from, []);
          out.get(l._from).push({ l, to: d });
        }
    MVC = { at: Date.now(), m: out };
    return out;
  }
  function dayStatus(d) {
    const wd = workDay(),
      today = ymd(),
      ls = d.lessons || [],
      st = ls.map((l) => lessonState(d, l)),
      skipped = ls.length > 0 && st.every((s) => s.rec && s.rec.t === "skip"),
      pct = safe(() => dayProgress(d), 0);
    if (d.day === examDay()) return { k: "exam", pct, st };
    if (isDone(d)) return { k: skipped ? "skipped" : "done", pct: 100, st };
    if (d.day === wd) return { k: "now", pct, st };
    if (d.day < wd) return { k: !ls.length && movedMap().has(d.day) ? "moved" : "passed", pct, st };
    if (d.date < today) return { k: "behind", pct, st };
    return { k: skipped ? "skipped" : "future", pct, st };
  }
  const KIND = { exam: "🎯", done: "✓", skipped: "⏭", now: "●", passed: "✓", moved: "↪", behind: "!", future: "" };

  /* ───────────── actions (all undoable until the day is passed) ───────────── */
  function closeAnswered() {
    safe(() => {
      const c = V16().act.current();
      if (c && c.answered) V16().act.next("u");
    });
  }
  function log(what) {
    const m = M();
    m.log.push({ at: new Date().toISOString(), what });
    m.log = m.log.slice(-30);
  }
  function skipLesson(d, l, t) {
    if (inMock()) return false;
    closeAnswered();
    const m = M(),
      set = [];
    (l.segments || []).forEach((sg, i) => {
      if (t === "learn" && sg.type === "question") return; // reading ahead keeps the lesson's own question block
      if (!segDone(d, l, i)) {
        S.segments[segmentKey(d, l, i)] = true;
        set.push(i);
      }
    });
    const rec = m.les[lk(d, l)] || { t, i: [] };
    rec.t = rec.t === "skip" || t === "skip" ? t : "learn";
    rec.i = [...new Set((rec.i || []).concat(set))];
    if (t === "skip") {
      // the lesson's unasked past papers go to the daily rounds instead of an end-of-lesson block
      S.v16 = isObj(S.v16) ? S.v16 : {};
      S.v16.blocks = isObj(S.v16.blocks) ? S.v16.blocks : {};
      const b = S.v16.blocks[bkey(d, l)];
      if (!b || Array.isArray(b.ids)) {
        S.v16.blocks[bkey(d, l)] = { n: b && b.ids ? b.ids.length : 0, done: 1, skip: 1 };
        rec.b = 1;
      }
    }
    m.les[lk(d, l)] = rec;
    log((t === "skip" ? "skip " : "learned ") + l.id + " on day " + d.day);
    return true;
  }
  function undoLesson(d, l) {
    if (inMock() || isDone(d)) return false;
    const m = M(),
      rec = m.les[lk(d, l)];
    if (!rec) return false;
    for (const i of rec.i || []) delete S.segments[segmentKey(d, l, i)];
    if (rec.b && S.v16 && S.v16.blocks && S.v16.blocks[bkey(d, l)]?.skip) delete S.v16.blocks[bkey(d, l)];
    delete m.les[lk(d, l)];
    log("undo " + l.id + " on day " + d.day);
    return true;
  }
  function skipRound(d) {
    if (inMock()) return false;
    const m = M(),
      r = safe(() => S.v16.rounds[d.day], null);
    closeAnswered();
    if (r && Array.isArray(r.ids)) r.i = r.ids.length;
    (m.days[d.day] = m.days[d.day] || {}).round = 1;
    log("skip round day " + d.day);
    return true;
  }
  function skipMock(d) {
    if (inMock() || !mockDay(d) || mockRec(d)) return false;
    S.v16 = isObj(S.v16) ? S.v16 : {};
    S.v16.mocks = Array.isArray(S.v16.mocks) ? S.v16.mocks : [];
    S.v16.mocks.push({ day: d.day, at: new Date().toISOString(), n: 0, k: 0, secs: 0, lim: 0, r: [], skipped: true });
    (M().days[d.day] = M().days[d.day] || {}).mock = 1;
    log("skip mock day " + d.day);
    return true;
  }
  function undoDay(d) {
    if (inMock() || isDone(d)) return false;
    const m = M(),
      x = m.days[d.day] || {};
    for (const l of d.lessons || []) if (m.les[lk(d, l)]?.t === "skip") undoLesson(d, l);
    if (x.mock && S.v16 && Array.isArray(S.v16.mocks)) S.v16.mocks = S.v16.mocks.filter((r) => !(r.day === d.day && r.skipped));
    if (x.round && d.day !== workDay()) delete x.round;
    if (x.round && d.day === workDay()) {
      const r = safe(() => S.v16.rounds[d.day], null);
      if (r && r.skipped) delete S.v16.rounds[d.day];
      delete x.round;
    }
    delete x.mock;
    if (!Object.keys(x).length) delete m.days[d.day];
    log("undo day " + d.day);
    return true;
  }
  function skipDay(d) {
    if (inMock()) return false;
    for (const l of d.lessons || []) skipLesson(d, l, "skip");
    skipRound(d);
    if (mockDay(d)) skipMock(d);
    return true;
  }
  function jumpTo(target) {
    if (inMock()) return false;
    const from = workDay();
    if (!(target > from) || target > DAYS().length) return false;
    for (let n = from; n < target; n++) {
      const d = DAYS()[n - 1];
      if (!d || isDone(d)) continue;
      skipDay(d);
      if (!S.doneDays.includes(d.day)) S.doneDays.push(d.day);
    }
    S.doneDays.sort((a, b) => a - b);
    S.day = target;
    S.blockStart = Date.now();
    log("jump from day " + from + " to day " + target);
    return true;
  }
  // a skipped round for today: an empty round is made just in time (future rounds are never stored early)
  function roundGuard() {
    const m = M(),
      wd = workDay();
    if (!m || !m.days[wd] || !m.days[wd].round) return;
    S.v16 = isObj(S.v16) ? S.v16 : {};
    S.v16.rounds = isObj(S.v16.rounds) ? S.v16.rounds : {};
    const r = S.v16.rounds[wd];
    if (!r || !Array.isArray(r.ids)) S.v16.rounds[wd] = { ids: [], kinds: {}, i: 0, t: safe(() => V16().today(), wd), made: new Date().toISOString(), skipped: true };
    else if (r.i < r.ids.length && !safe(() => V16().act.current().answered, false)) r.i = r.ids.length;
  }
  function after() {
    persist();
    safe(() => render());
    draw();
  }

  /* ───────────── the map ───────────── */
  let open = false,
    openDay = null,
    confirmFor = null,
    showLate = false;
  function stats() {
    const ed = examDay(),
      seen = new Map(); // a lesson can run over two days: count it once
    for (const d of DAYS().filter((x) => x.day <= ed))
      for (const l of d.lessons || []) {
        const s = lessonState(d, l),
          o = seen.get(l.id) || { learned: false, skipped: false };
        if (s.teach && !(s.rec && s.rec.t === "skip")) o.learned = true;
        if (s.rec && s.rec.t === "skip") o.skipped = true;
        seen.set(l.id, o);
      }
    const all = [...seen.values()],
      v = safe(() => V16().stats(), null);
    return { les: all.length, learned: all.filter((o) => o.learned).length, skipped: all.filter((o) => o.skipped && !o.learned).length, mcq: v ? v.done : 0, mcqAll: v ? v.total : 0, mocks: (safe(() => S.v16.mocks, []) || []).filter((m) => !m.skipped).length, left: daysBetween(ymd(), examDate()) };
  }
  function ring(frac, size, stroke, col) {
    const r = (size - stroke) / 2,
      c = 2 * Math.PI * r;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#223a55" stroke-width="' + stroke + '"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + (c * Math.max(0, Math.min(1, frac))).toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg>';
  }
  function dayLabel(d) {
    if (d.day === examDay()) return "🎯 MCQ EXAM";
    if (d.mode === "TEACHING") return (d.lessons || []).length ? (d.lessons || []).length + " lesson" + ((d.lessons || []).length > 1 ? "s" : "") : "lessons moved";
    if (d.continuityType === "WEEKLY_MOCK") return "👾 weekly mock";
    if (d.continuityType === "MCQ_SPRINT") return "🏁 sprint mock";
    if (d.continuityType === "RETRIEVAL") return "🔁 retrieval";
    if (d.continuityType === "MICRO") return "⚡ short day";
    if (d.continuityType === "RETENTION_BRIDGE") return "maintenance";
    return String(d.mode || "").toLowerCase();
  }
  function grid() {
    const ed = examDay(),
      list = DAYS().filter((d) => d.day <= ed),
      first = list[0] ? dt(list[0].date).dow : 1,
      lead = (first + 6) % 7; // Monday first
    let cells = "";
    for (let i = 0; i < lead; i++) cells += '<i class="ixMpCell pad"></i>';
    for (const d of list) {
      const s = dayStatus(d),
        x = dt(d.date),
        ico = d.day === ed ? "🎯" : mockDay(d) ? "👾" : d.mode === "TEACHING" ? "" : "·";
      cells +=
        '<button type="button" class="ixMpCell ' + s.k + (d.mode === "TEACHING" ? " teach" : " cont") + (d.date === ymd() ? " today" : "") + '" data-ixmp-go="' + d.day + '" title="Day ' + d.day + " · " + E(fmt(d.date)) + '"><b>' + x.dd + "</b><small>" + (KIND[s.k] || ico) + "</small></button>";
    }
    return '<div class="ixMpWeek"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="ixMpGrid">' + cells + "</div>" +
      '<div class="ixMpLeg"><span><i class="done"></i>done</span><span><i class="now"></i>you are here</span><span><i class="today"></i>today\'s date</span><span><i class="behind"></i>behind</span><span><i class="skipped"></i>skipped</span><span>↪ lessons moved</span><span><i class="future"></i>ahead</span><span>👾 mock</span><span>🎯 exam</span></div>';
  }
  function lessonRow(d, l, ds, past) {
    const s = lessonState(d, l),
      [col, tag] = SUBJ[l.subject] || ["#9fb4cc", l.subject],
      ms = mcqStats(l.id),
      dots = (l.segments || []).map((sg, i) => '<i class="' + (segDone(d, l, i) ? (s.rec && (s.rec.i || []).includes(i) ? "sk" : "ok") : "") + '" title="' + E(STEP[sg.type] || sg.type) + '"></i>').join(""),
      badge = s.rec ? (s.rec.t === "skip" ? '<span class="ixMpB skip">⏭ skipped</span>' : '<span class="ixMpB learn">📖 learned ahead</span>') : s.all ? '<span class="ixMpB ok">✓ done</span>' : "",
      moved = l._from && l._from !== d.day ? '<span class="ixMpB mv">↪ from ' + E(fmt(DAYS()[l._from - 1]?.date || "")) + "</span>" : "",
      can = !past && !isDone(d) && !inMock(),
      ask = confirmFor === "L:" + lk(d, l);
    return (
      '<div class="ixMpLes"><div class="ixMpLesTop"><span class="ixMpTag" style="--c:' + col + '">' + E(tag) + '</span><b class="ixMpTopic">' + E(l.topic) + "</b>" + badge + moved + "</div>" +
      '<div class="ixMpLesMid"><span class="ixMpDots">' + dots + '</span><span class="ixMpMcq">' + (ms.n ? ms.a + "/" + ms.n + " past papers" + (ms.a ? " · " + Math.round((ms.k / ms.a) * 100) + "% right" : "") : "no past papers") + "</span></div>" +
      (ask
        ? '<div class="ixMpAsk">Skip <b>' + E(l.topic) + "</b>? Its " + ms.n + " past papers still come, in your daily rounds. <button type=\"button\" class=\"ixMpBtn warn\" data-ixmp=\"skipL\" data-d=\"" + d.day + '" data-l="' + E(l.id) + '">⏭ Skip it</button><button type="button" class="ixMpBtn ghost" data-ixmp="cancel">Keep</button></div>'
        : '<div class="ixMpAct"><button type="button" class="ixMpBtn" data-ixmp="read" data-d="' + d.day + '" data-l="' + E(l.id) + '">📖 Read' + (d.day > workDay() ? " now" : "") + "</button>" +
          (can && s.rec ? '<button type="button" class="ixMpBtn ghost" data-ixmp="undoL" data-d="' + d.day + '" data-l="' + E(l.id) + '">↩ Undo</button>' : "") +
          (can && !s.all && !s.rec ? '<button type="button" class="ixMpBtn ghost" data-ixmp="askL" data-d="' + d.day + '" data-l="' + E(l.id) + '">⏭ Skip</button>' : "") +
          "</div>") +
      "</div>"
    );
  }
  function dayCard(d, mv) {
    const s = dayStatus(d),
      x = dt(d.date),
      wd = workDay(),
      isOpen = openDay === d.day,
      past = s.k === "done" || s.k === "passed" || s.k === "moved" || (s.k === "skipped" && isDone(d)),
      m = M().days[d.day] || {},
      mk = mockRec(d),
      ls = d.lessons || [],
      mvd = mv.get(d.day) || [],
      ask = confirmFor === "D:" + d.day || confirmFor === "J:" + d.day,
      mins = d.day === wd ? safe(() => remainingMinutes(d), null) : null;
    let body = "";
    if (isOpen) {
      body += ls.map((l) => lessonRow(d, l, s, past)).join("");
      if (!ls.length && mvd.length) body += '<div class="ixMpNote">↪ This day\'s lessons were moved (start-from-today spread): ' + mvd.map((x) => "<b>" + E(x.l.topic) + "</b> → " + E(fmt(x.to.date))).join(" · ") + "</div>";
      if (d.mode === "CONTINUITY") body += '<div class="ixMpNote">' + E(d.title || "") + "</div>";
      if (mockDay(d)) {
        const n = safe(() => V16().mockSizeFor(d.day), 0);
        body += '<div class="ixMpLes"><div class="ixMpLesTop"><span class="ixMpTag" style="--c:#b39cff">Mock</span><b class="ixMpTopic">👾 Sealed mock' + (mk ? (mk.skipped ? " · skipped" : " · " + mk.k + "/" + mk.n) : n ? " · about " + n + " held-out MCQs" : "") + "</b></div>" +
          (!mk && !isDone(d) && !inMock() ? '<div class="ixMpAct"><button type="button" class="ixMpBtn ghost" data-ixmp="skipM" data-d="' + d.day + '">⏭ Skip this mock</button><span class="ixMpHint">its questions move to later mocks</span></div>' : "") + "</div>";
      }
      if (d.day >= wd && !isDone(d) && d.day !== examDay())
        body += '<div class="ixMpLes"><div class="ixMpLesTop"><span class="ixMpTag" style="--c:#d9ff43">Round</span><b class="ixMpTopic">✅ Daily MCQ round' + (m.round ? " · skipped" : "") + "</b></div>" +
          (!inMock() ? '<div class="ixMpAct">' + (m.round ? '<button type="button" class="ixMpBtn ghost" data-ixmp="undoD" data-d="' + d.day + '">↩ Undo</button>' : '<button type="button" class="ixMpBtn ghost" data-ixmp="skipR" data-d="' + d.day + '">⏭ Skip the round</button><span class="ixMpHint">due reviews wait for the next round</span>') + "</div>" : "") + "</div>";
      if (!past && !inMock() && d.day !== examDay()) {
        const skipBtn = d.day === wd ? "⏭ Skip the rest of today" : "⏭ Skip this whole day";
        body +=
          '<div class="ixMpDayAct">' +
          (ask
            ? confirmFor === "J:" + d.day
              ? '<div class="ixMpAsk">Start <b>' + E(fmt(d.date)) + "</b> now? Everything left before it (" + (d.day - wd) + " day" + (d.day - wd > 1 ? "s" : "") + ") is skipped; their past papers still come in your rounds. <button type=\"button\" class=\"ixMpBtn warn\" data-ixmp=\"jump\" data-d=\"" + d.day + '">⏩ Jump</button><button type="button" class="ixMpBtn ghost" data-ixmp="cancel">Cancel</button></div>'
              : '<div class="ixMpAsk">' + skipBtn.replace("⏭ ", "") + '? <button type="button" class="ixMpBtn warn" data-ixmp="skipD" data-d="' + d.day + '">⏭ Skip</button><button type="button" class="ixMpBtn ghost" data-ixmp="cancel">Keep</button></div>'
            : '<button type="button" class="ixMpBtn ghost" data-ixmp="askD" data-d="' + d.day + '">' + skipBtn + "</button>" +
              (d.day > wd ? '<button type="button" class="ixMpBtn" data-ixmp="askJ" data-d="' + d.day + '">⏩ Start this day now</button>' : "") +
              (ls.some((l) => M().les[lk(d, l)]?.t === "skip") || m.mock || m.round ? '<button type="button" class="ixMpBtn ghost" data-ixmp="undoD" data-d="' + d.day + '">↩ Undo all skips</button>' : "")) +
          "</div>";
      }
    }
    const tags = ls
      .slice(0, 6)
      .map((l) => '<i style="background:' + (SUBJ[l.subject] || ["#9fb4cc"])[0] + '" title="' + E(l.topic) + '"></i>')
      .join("");
    return (
      '<section class="ixMpDay ' + s.k + (isOpen ? " open" : "") + (d.date === ymd() ? " today" : "") + '" id="ixmp-d' + d.day + '">' +
      '<button type="button" class="ixMpDayHead" data-ixmp="toggle" data-d="' + d.day + '" aria-expanded="' + isOpen + '">' +
      '<span class="ixMpDate"><small>' + x.wd + "</small><b>" + x.dd + "</b><small>" + x.mo + "</small></span>" +
      '<span class="ixMpMid"><span class="ixMpTitle">' + (d.day === wd ? '<span class="ixMpHere">YOU ARE HERE</span>' : "") + (d.date === ymd() && d.day !== wd ? '<span class="ixMpHere t">TODAY</span>' : "") + "Day " + d.day + " · " + E(dayLabel(d)) + "</span>" +
      '<span class="ixMpSub">' + E(ls.length ? ls.map((l) => l.topic).join(" · ") : mvd.length ? "moved: " + mvd.map((x) => x.l.topic).join(" · ") : d.title || "") + "</span>" +
      '<span class="ixMpBar"><i style="width:' + Math.round(s.pct) + '%"></i></span><span class="ixMpTags">' + tags + "</span></span>" +
      '<span class="ixMpRight">' + ring(s.pct / 100, 34, 4, s.k === "done" ? "#5ef0a0" : s.k === "skipped" ? "#8fa6c0" : s.k === "behind" ? "#ffb86b" : "#d9ff43") + '<small>' + (mins != null ? "~" + mins + " min" : s.k === "moved" ? "moved" : s.k === "done" ? "done" : s.k === "skipped" ? "skipped" : s.k === "behind" ? "behind" : (d.estimatedMinutes || "") + (d.estimatedMinutes ? " min" : "")) + "</small></span></button>" +
      (isOpen ? '<div class="ixMpBody">' + body + "</div>" : "") +
      "</section>"
    );
  }
  function list() {
    const ed = examDay(),
      mv = movedMap();
    let html = "",
      week = null;
    for (const d of DAYS()) {
      if (d.day > ed && !showLate) break;
      if (d.week !== week) {
        week = d.week;
        const wk = DAYS().filter((x) => x.week === week);
        html += '<div class="ixMpWk">Week ' + week + " · " + E(fmt(wk[0].date)) + " – " + E(fmt(wk[wk.length - 1].date)) + (d.day > ed ? " · after the MCQ exam" : "") + "</div>";
      }
      html += dayCard(d, mv);
    }
    if (!showLate) html += '<button type="button" class="ixMpBtn ghost wide" data-ixmp="late">Show the days after the MCQ exam (' + (DAYS().length - ed) + " more: maintenance, written and practical waves)</button>";
    return html;
  }
  function draw() {
    const o = document.querySelector(".ixMap");
    if (!o) return;
    const st = stats(),
      wd = workDay(),
      pd = planDay(),
      diff = wd - pd,
      scroll = o.querySelector(".ixMpScroll")?.scrollTop;
    o.innerHTML =
      '<div class="ixMpHead"><div class="ixMpHeadL"><div class="ixMpKick">🗺️ COURSE MAP</div><div class="ixMpH1">' + E(fmt(ymd())) + " · Day " + wd + " of " + examDay() + '</div><div class="ixMpH2">' + (st.left > 0 ? st.left + " days to the MCQ exam (" + E(fmt(examDate())) + ")" : st.left === 0 ? "MCQ exam today" : "MCQ exam passed") + " · " + (diff === 0 ? "on plan" : diff > 0 ? diff + " day" + (diff > 1 ? "s" : "") + " ahead" : -diff + " day" + (-diff > 1 ? "s" : "") + " behind") + (inMock() ? " · 🔒 a sealed mock is running: skipping waits until it ends" : "") + "</div></div>" +
      '<button type="button" class="ixMpX" data-ixmp="close" aria-label="Close the map">✕</button></div>' +
      '<div class="ixMpScroll"><div class="ixMpStats">' +
      '<div class="ixMpStat">' + ring(st.learned / Math.max(1, st.les), 46, 5, "#d9ff43") + "<div><b>" + st.learned + "/" + st.les + "</b><small>lessons learned</small></div></div>" +
      '<div class="ixMpStat">' + ring(st.mcq / Math.max(1, st.mcqAll), 46, 5, "#66e9ff") + "<div><b>" + st.mcq + "/" + st.mcqAll + "</b><small>past papers done</small></div></div>" +
      '<div class="ixMpStat"><span class="ixMpBig">👾</span><div><b>' + st.mocks + "</b><small>mocks finished</small></div></div>" +
      '<div class="ixMpStat"><span class="ixMpBig">⏭</span><div><b>' + st.skipped + "</b><small>lessons skipped</small></div></div></div>" +
      '<h3 class="ixMpH3">The road to the exam</h3>' + grid() +
      '<div class="ixMpRow"><button type="button" class="ixMpBtn" data-ixmp="goNow">● Go to where I am (day ' + wd + ")</button></div>" +
      '<h3 class="ixMpH3">Every day</h3>' + list() +
      '<div class="ixMpFoot">Skipping never deletes a past paper: skipped lessons count as taught, so their past papers come in the daily rounds, and the engine still finishes every one before the sprint. A skipped mock hands its questions to later mocks. "↩ Undo" works until that day is passed.</div></div>';
    if (scroll != null) {
      const sc = o.querySelector(".ixMpScroll");
      if (sc) sc.scrollTop = scroll;
    }
  }
  function show(focus) {
    if (!document.body) return;
    closeReader();
    let o = document.querySelector(".ixMap");
    if (!o) {
      o = document.createElement("div");
      o.className = "ixMap";
      o.setAttribute("role", "dialog");
      o.setAttribute("aria-label", "Course map");
      document.body.appendChild(o);
    }
    open = true;
    document.documentElement.classList.add("ixMpNoScroll");
    openDay = focus || workDay();
    draw();
    goTo(openDay, false);
  }
  function hide() {
    open = false;
    confirmFor = null;
    document.querySelectorAll(".ixMap").forEach((x) => x.remove());
    document.documentElement.classList.remove("ixMpNoScroll");
  }
  function goTo(n, smooth) {
    const el = document.getElementById("ixmp-d" + n),
      sc = document.querySelector(".ixMpScroll");
    if (el && sc) sc.scrollTop = Math.max(0, el.offsetTop - 120);
    void smooth;
  }

  /* ───────────── the reader: any lesson, any day, read-only ───────────── */
  function reader(d, l) {
    closeReader();
    const secs = safe(() => V15().sectionsForLesson(l.id), []) || [],
      s = lessonState(d, l),
      ms = mcqStats(l.id),
      [col, tag] = SUBJ[l.subject] || ["#9fb4cc", l.subject],
      canLearn = !s.teach && !isDone(d) && !inMock();
    const o = document.createElement("div");
    o.className = "ixMpRead";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", "Lesson notes");
    o.innerHTML =
      '<div class="ixMpHead"><div class="ixMpHeadL"><div class="ixMpKick"><span class="ixMpTag" style="--c:' + col + '">' + E(tag) + "</span> 📖 " + E(fmt(d.date)) + " · Day " + d.day + '</div><div class="ixMpH1">' + E(l.topic) + '</div><div class="ixMpH2">' + secs.length + " sections · " + (ms.n ? ms.a + "/" + ms.n + " past papers done" : "no past papers") + (s.teach ? " · already learned" : "") + "</div></div>" +
      '<button type="button" class="ixMpX" data-ixmp="closeRead" aria-label="Back to the map">✕</button></div>' +
      '<div class="ixMpScroll ixMpReadBody">' +
      (secs.length
        ? secs
            .map((x) => {
              const full = safe(() => V15().section(x.id), null) || { h: x.h, p: [] };
              return (
                '<div class="v15Sec ixMpSec" data-ixmp-sec="' + E(x.id) + '"><div class="v15Head"><h3>' + md(full.h) + "</h3></div>" +
                '<div class="ixMpAtlas"></div>' +
                (full.pic && full.pic[0] ? '<div class="v15Pics"><figure class="v15Pic" data-v15-term="' + E(full.pic[0]) + '" data-v15-focus="' + E(full.h) + '" data-v15-subj="' + E(l.subject) + '"><div class="v14Skeleton"><span></span></div></figure></div>' : "") +
                '<ul class="v15Pts">' + (full.p || []).map((p) => "<li>" + md(p) + "</li>").join("") + "</ul>" +
                (full.why ? '<div class="v15Why"><b>Why it works</b><p>' + md(full.why) + "</p></div>" : "") +
                (full.trap ? '<div class="v15Trap"><b>Kasr trap</b><p>' + md(full.trap) + "</p></div>" : "") +
                "</div>"
              );
            })
            .join("")
        : '<div class="ixMpNote">This lesson has no written note sections; its steps are the visual map and the teaching video.</div>') +
      '<div class="ixMpRow">' + (canLearn ? '<button type="button" class="ixMpBtn" data-ixmp="learn" data-d="' + d.day + '" data-l="' + E(l.id) + '">✓ Mark learned</button><span class="ixMpHint">its past-paper block still comes on ' + E(fmt(d.date)) + "</span>" : "") + '<button type="button" class="ixMpBtn ghost" data-ixmp="closeRead">← Back to the map</button></div></div>';
    document.body.appendChild(o);
    // live diagrams and pictures, as in the lesson
    safe(() => {
      const A = window.IX_ATLAS;
      if (A)
        o.querySelectorAll("[data-ixmp-sec]").forEach((sec) => {
          const m = A.forSection(sec.dataset.ixmpSec);
          if (m) A.mount(sec.querySelector(".ixMpAtlas"), m.id, m.sim);
        });
    });
    safe(() => V15().hydrate(o));
  }
  function closeReader() {
    document.querySelectorAll(".ixMpRead").forEach((x) => x.remove());
  }

  /* ───────────── wiring ───────────── */
  const dayN = (b) => DAYS()[Number(b.dataset.d) - 1] || null;
  const lessonOf = (d, id) => (d && (d.lessons || []).find((l) => l.id === id)) || null;
  document.addEventListener("click", (ev) => {
    const t = ev.target && ev.target.closest ? ev.target : null;
    if (!t) return;
    if (t.closest("[data-ixmp-open]")) return void show();
    const go = t.closest("[data-ixmp-go]");
    if (go) {
      openDay = Number(go.dataset.ixmpGo);
      confirmFor = null;
      draw();
      goTo(openDay, true);
      return;
    }
    const b = t.closest("[data-ixmp]");
    if (!b) return;
    const a = b.dataset.ixmp,
      d = dayN(b),
      l = lessonOf(d, b.dataset.l);
    if (a === "close") return hide();
    if (a === "closeRead") return closeReader();
    if (a === "late") {
      showLate = true;
      return draw();
    }
    if (a === "goNow") {
      openDay = workDay();
      draw();
      return goTo(openDay, true);
    }
    if (a === "toggle") {
      openDay = openDay === d.day ? null : d.day;
      confirmFor = null;
      return draw();
    }
    if (a === "cancel") {
      confirmFor = null;
      return draw();
    }
    if (a === "askL") return (confirmFor = "L:" + lk(d, l)), draw();
    if (a === "askD") return (confirmFor = "D:" + d.day), draw();
    if (a === "askJ") return (confirmFor = "J:" + d.day), draw();
    if (a === "read" && d && l) return reader(d, l);
    confirmFor = null;
    let ok = false;
    if (a === "skipL" && d && l) ok = skipLesson(d, l, "skip");
    else if (a === "undoL" && d && l) ok = undoLesson(d, l);
    else if (a === "skipR" && d) ok = skipRound(d);
    else if (a === "skipM" && d) ok = skipMock(d);
    else if (a === "skipD" && d) ok = skipDay(d);
    else if (a === "undoD" && d) ok = undoDay(d);
    else if (a === "jump" && d) {
      ok = jumpTo(d.day);
      openDay = workDay();
    } else if (a === "learn" && d && l) {
      ok = skipLesson(d, l, "learn");
      if (ok) safe(() => window.IX_GAME?.award?.("learnAhead", 12));
      closeReader();
    }
    if (ok) after();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Escape") return;
    if (document.querySelector(".ixMpRead")) closeReader();
    else if (open) hide();
  });
  function button() {
    const top = document.getElementById("courseTopbar");
    if (top && !top.querySelector("[data-ixmp-open]")) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ixMpOpen";
      b.dataset.ixmpOpen = "1";
      b.setAttribute("aria-label", "Open the course map");
      b.innerHTML = "🗺️ <span>Map</span>";
      const tog = top.querySelector("#railToggle");
      if (tog) tog.after(b);
      else top.prepend(b);
    }
    const rail = document.getElementById("railToday");
    if (rail && !rail.querySelector("[data-ixmp-open]")) rail.insertAdjacentHTML("afterbegin", '<button type="button" class="ixMpRail" data-ixmp-open="1">🗺️ Course map · every day, every date</button>');
  }
  function boot() {
    if (window.INTELLECTUALITY_MAP_BOOTED) return;
    if (typeof nextAction !== "function" || typeof S === "undefined" || typeof C === "undefined" || !window.INTELLECTUALITY_V16_INSTALLED) return void setTimeout(boot, 60);
    window.INTELLECTUALITY_MAP_BOOTED = true;
    // outermost layer: a skipped round for today becomes an empty round just in time
    const base = nextAction;
    nextAction = function () {
      safe(roundGuard);
      return base.apply(this, arguments);
    };
    const baseRender = render;
    render = function () {
      const out = baseRender.apply(this, arguments);
      safe(button);
      return out;
    };
    safe(button);
    // other layers redraw the top bar and the outline after a render: put the map button back when they do
    let q = false;
    new MutationObserver(() => {
      if (q) return;
      q = true;
      requestAnimationFrame(() => {
        q = false;
        if (!document.querySelector("#courseTopbar [data-ixmp-open]") || !document.querySelector("#railToday [data-ixmp-open]")) safe(button);
      });
    }).observe(document.body, { childList: true, subtree: true });
    safe(() => render());
  }
  window.INTELLECTUALITY_MAP = {
    version: VERSION,
    show,
    hide,
    reader: (day, lid) => {
      const d = DAYS()[day - 1];
      const l = lessonOf(d, lid);
      if (d && l) reader(d, l);
    },
    status: (day) => {
      const d = DAYS()[day - 1];
      return d ? dayStatus(d).k : null;
    },
    skipLesson: (day, lid) => {
      const d = DAYS()[day - 1],
        l = lessonOf(d, lid);
      const ok = d && l ? skipLesson(d, l, "skip") : false;
      if (ok) after();
      return ok;
    },
    learnLesson: (day, lid) => {
      const d = DAYS()[day - 1],
        l = lessonOf(d, lid);
      const ok = d && l ? skipLesson(d, l, "learn") : false;
      if (ok) after();
      return ok;
    },
    undoLesson: (day, lid) => {
      const d = DAYS()[day - 1],
        l = lessonOf(d, lid);
      const ok = d && l ? undoLesson(d, l) : false;
      if (ok) after();
      return ok;
    },
    skipDay: (day) => {
      const d = DAYS()[day - 1];
      const ok = d ? skipDay(d) : false;
      if (ok) after();
      return ok;
    },
    skipMock: (day) => {
      const d = DAYS()[day - 1];
      const ok = d ? skipMock(d) : false;
      if (ok) after();
      return ok;
    },
    undoDay: (day) => {
      const d = DAYS()[day - 1];
      const ok = d ? undoDay(d) : false;
      if (ok) after();
      return ok;
    },
    jumpTo: (day) => {
      const ok = jumpTo(day);
      if (ok) after();
      return ok;
    },
    state: () => (M() ? JSON.parse(JSON.stringify(S.map)) : null),
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
