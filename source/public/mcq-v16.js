/* INTELLECTUALITY v16 · MCQ exam system.
 * Owner, 23 Sep 2026: "Don't stop until it's minimum 9.5/10. MCQ only; we don't care about written and
 * practical now." Target: the NEU-205 MCQ exam (C.examAnchors "MCQ", Sun 15 Nov 2026).
 *
 * - Every past-paper MCQ is done before the exam. Each lesson ends with a block of the practice MCQs
 *   its notes teach (highest exam-pattern score first, at most BLOCK_CAP); the rest join a backlog that
 *   the daily round clears before the sprint. The sealed mocks use up the held-out pool by the last
 *   sprint day.
 * - An MCQ is asked only after the lesson whose notes teach it has been learned.
 * - Mistakes come back: a wrong answer returns the next day as a CHANGED past-paper item on the same
 *   fact (retest law), and the exact item returns a few days later (Kasr repeats questions). Leitner
 *   spacing continues until it is answered with confidence; the sprint re-runs every past mistake.
 * - Every answer is explained on the spot: why the key is right and why each other option is wrong
 *   (tutor-written, mcq-explain-*-v16.js). A doubtful bank key shows the standard answer; both count.
 * - Mocks are sealed (held-out only; no pictures, hints or explanations before submission) and timed.
 *   The predicted score uses unseen first attempts only, with an 80% interval.
 * - MCQ focus: no written boss, written or practical wave, visual boss or draw-from-memory step.
 *   Set window.INTELLECTUALITY_V16_FOCUS = "ALL" (or S.v16.focus = "ALL") for the full v15 flow.
 */
(function () {
  "use strict";
  const VERSION = "16.0";
  const INT = [1, 2, 4, 8, 16, 32]; // Leitner intervals, days
  const BLOCK_CAP = 8; // new past-paper MCQs at the end of a lesson
  const MIN_Q = 1.2; // minutes per practice MCQ including its explanation
  const MOCK_MIN_Q = 1; // exam pace in the mock (assumption: about a minute per MCQ)
  const DAY_TARGET = 120; // soft study minutes per day (objective profile: 1.5–2 h)

  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const md = (s) => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  function safe(f, fb) {
    try {
      return f();
    } catch (e) {
      console.warn("[v16]", e);
      return fb;
    }
  }
  const QBK = () => window.EHSAN_QBANK || { questions: [] };
  const PE = () => window.NEU205_PATTERN || {};
  const V15 = () => window.INTELLECTUALITY_V15 || null;
  let QMAP = null;
  function qget(id) {
    if (!QMAP) {
      QMAP = new Map();
      for (const q of QBK().questions || []) QMAP.set(q.id, q);
    }
    return QMAP.get(id) || null;
  }

  /* ───────────────────────── state ───────────────────────── */
  function V() {
    if (!isObj(S.v16)) S.v16 = {};
    const v = S.v16;
    if (v.schema !== 1) {
      for (const k of Object.keys(v)) delete v[k];
      Object.assign(v, { schema: 1, version: VERSION, focus: "MCQ", q: {}, blocks: {}, rounds: {}, mocks: [], mock: null, cur: null, skip: {}, migrated: false });
    }
    for (const k of ["q", "blocks", "rounds", "skip"]) if (!isObj(v[k])) v[k] = {};
    if (!Array.isArray(v.mocks)) v.mocks = [];
    v.version = VERSION;
    return v;
  }
  const persist = () => safe(() => save());
  function focusOn() {
    const f = window.INTELLECTUALITY_V16_FOCUS || (isObj(S.v16) ? S.v16.focus : "MCQ");
    return f !== "ALL";
  }

  /* ───────────────────────── calendar ───────────────────────── */
  function ymd() {
    return safe(() => window.INTELLECTUALITY_V14.cairoYMD(), null) || new Date().toISOString().slice(0, 10);
  }
  // the spacing clock is the real calendar day (a day of work done ahead is not a day of forgetting)
  function today() {
    const t = ymd();
    let best = 1;
    for (const d of C.days || []) {
      if (d.date <= t) best = d.day;
      else break;
    }
    return best;
  }
  const dayOfDate = (date) => (C.days || []).find((x) => x.date === date)?.day || null;
  const EXAM_DAY = () => dayOfDate((C.examAnchors || []).find((x) => x.id === "MCQ")?.date) || 56;
  const SPRINT_FIRST = () => dayOfDate((C.phases || []).find((x) => x.id === "MCQ_SPRINT")?.start) || 48;
  const mockDay = (d) => !!d && d.mode === "CONTINUITY" && (d.continuityType === "WEEKLY_MOCK" || d.continuityType === "MCQ_SPRINT") && d.day < EXAM_DAY();

  /* ───────────────────────── pools and ownership ───────────────────────── */
  const usable = (q) => !!q && !!q.autoScore && Array.isArray(q.options) && q.options.length >= 2 && (q.answerKeys || []).length >= 1 && (!q.requiresVisual || !!q.visualData);
  let PP = null,
    HP = null;
  const practice = () => PP || (PP = (QBK().questions || []).filter((q) => q.split === "practice" && usable(q)));
  const heldout = () => HP || (HP = (QBK().questions || []).filter((q) => q.split === "heldout" && usable(q)));
  const score = (q) => PE().qScore?.[q.id] || 0;
  const h01 = (s) => (typeof hash01 === "function" ? hash01(s) : 0.5);

  // Which lesson teaches an item: the lesson of the note section that teaches it (v15), else its first lesson.
  const OWN = new Map();
  function owner(q) {
    if (!OWN.has(q.id)) {
      const pos = taught().pos;
      let lid = safe(() => V15()?.teachingLesson(q.id), null);
      if (!lid || !pos.has(lid)) lid = (q.lessonIds || []).find((x) => pos.has(x)) || null;
      OWN.set(q.id, lid);
    }
    return OWN.get(q.id);
  }
  let TM = null;
  function taught() {
    const cal = S.v14?.calendar || {},
      k = Object.values(S.segments || {}).filter(Boolean).length + ":" + S.day + ":" + (cal.spreads || []).length + ":" + (cal.policy || "");
    if (TM && TM.k === k) return TM;
    const set = new Set(),
      pos = new Map(),
      at = new Map();
    let p = 0;
    for (const d of C.days || [])
      for (const l of d.lessons || []) {
        if (!pos.has(l.id)) {
          pos.set(l.id, p++);
          at.set(l.id, { d, l });
        }
        (l.segments || []).forEach((sg, i) => {
          if (sg.type === "teach" && S.segments[segmentKey(d, l, i)]) set.add(l.id);
        });
      }
    TM = { k, set, pos, at };
    return TM;
  }
  function isTaught(q) {
    const lid = owner(q);
    return lid ? taught().set.has(lid) : (q.unlockDay || 1) <= S.day;
  }
  function lessonTopic(q) {
    const lid = owner(q),
      x = lid ? taught().at.get(lid) : null;
    return x?.l?.topic || q.courseTopic || q.chapter;
  }
  function consumedSet() {
    const s = new Set(Object.keys(V().q));
    for (const id of Object.keys(S.qbank?.mockSeen || {})) s.add(id);
    for (const m of S.mockHistory || []) for (const id of m.questionIds || []) s.add(id);
    return s;
  }

  /* ───────────────────────── explanations ───────────────────────── */
  const XC = new Map();
  function explain(q) {
    if (XC.has(q.id)) return XC.get(q.id);
    const X = window.INTELLECTUALITY_MCQ_X || {},
      m = /^(.*\D)(\d+)$/.exec(q.id),
      arr = m && X[m[1]] ? X[m[1]][m[2]] : null;
    let out = null;
    if (Array.isArray(arr) && arr.length) {
      out = { key: "", opt: {}, flag: null, also: [] };
      arr.forEach((s, i) => {
        // "!x:" the bank key is doubtful and x is the standard answer; "~x:" x is also defensible
        const mm = /^([!~]?)([a-f]):\s*([\s\S]*)$/.exec(String(s));
        if (mm) {
          if (mm[1] === "!") out.flag = { k: mm[2], why: mm[3] };
          else if (mm[1] === "~") out.also.push({ k: mm[2], why: mm[3] });
          else out.opt[mm[2]] = mm[3];
        } else if (i === 0 || !out.key) out.key = String(s);
        else out.key += " " + s;
      });
    }
    XC.set(q.id, out);
    return out;
  }
  function accepted(q) {
    const s = new Set(q.answerKeys || []),
      x = explain(q);
    if (x?.flag && q.options.some((o) => o.key === x.flag.k)) s.add(x.flag.k);
    for (const a of x?.also || []) if (q.options.some((o) => o.key === a.k)) s.add(a.k);
    return s;
  }
  const optText = (q, k) => q.options.find((o) => o.key === k)?.text || k;

  /* ───────────────────────── spaced repetition ───────────────────────── */
  // res: "c" correct and sure, "u" correct but unsure, "w" wrong
  function update(prev, res, t, ctx) {
    const s = prev ? { ...prev } : { n: 0, k: 0, b: 0, f: t, lp: 0 };
    s.n++;
    s.l = t;
    s.r = res;
    if (res === "w") {
      s.b = 0;
      s.lp = (s.lp || 0) + 1;
      s.x = 1; // tomorrow: a changed item on the same fact
      s.d = t + 1;
    } else {
      s.k++;
      s.x = 0;
      if (!prev) s.b = ctx === "m" ? 2 : res === "c" ? 3 : 1;
      else s.b = Math.min(5, (s.b || 0) + (res === "c" ? 2 : 1));
      s.d = t + INT[s.b];
    }
    return s;
  }

  /* ───────────────────────── lesson blocks ───────────────────────── */
  const lkey = (d, l) => (l._from || d.day) + ":" + l.id;
  function blockFor(d, l) {
    const v = V(),
      k = lkey(d, l);
    let b = v.blocks[k];
    if (b && Array.isArray(b.ids)) return b;
    if (b && b.done) return { ids: [], i: 0, done: 1 };
    const pool = practice()
      .filter((q) => owner(q) === l.id && !v.q[q.id])
      .sort((a, b) => score(b) - score(a) || h01(k + a.id) - h01(k + b.id));
    const ids = [],
      avoid = new Set(),
      cap = blockCap(d);
    for (const q of pool) {
      if (ids.length >= cap) break;
      if (avoid.has(q.id)) continue; // the same question from another year waits for a later day
      ids.push(q.id);
      for (const n of PE().nearAvoid?.[q.id] || []) avoid.add(n);
    }
    b = v.blocks[k] = { ids, i: 0 };
    persist();
    return b;
  }
  // A heavy teaching day (e.g. a catch-up day with five lessons) gets smaller end-of-lesson blocks; the
  // rest of each lesson's past papers go to the next rounds, so no day runs far past ~2.5 h.
  function learnMinutes(d) {
    let m = 0;
    for (const l of d.lessons || []) {
      m += (safe(() => V15()?.lessonMinutes(l.id), 0) || 10) + 6;
      for (const sg of l.segments || []) if (sg.type === "video") m += sg.minutes || 0;
    }
    return m;
  }
  function blockCap(d) {
    const n = Math.max(1, (d.lessons || []).length),
      room = DAY_TARGET + 20 - learnMinutes(d) - 12 * MIN_Q;
    return Math.max(3, Math.min(BLOCK_CAP, Math.floor(room / (n * MIN_Q))));
  }
  function openBlockIds() {
    const s = new Set();
    for (const b of Object.values(V().blocks)) if (b && Array.isArray(b.ids) && b.i < b.ids.length) for (const id of b.ids.slice(b.i)) s.add(id);
    return s;
  }
  function finishBlock(d, l) {
    (l.segments || []).forEach((sg, i) => {
      if (sg.type === "question") S.segments[segmentKey(d, l, i)] = true;
    });
    const b = V().blocks[lkey(d, l)];
    if (b && Array.isArray(b.ids)) V().blocks[lkey(d, l)] = { n: b.ids.length, done: 1 }; // keep saved progress small
    persist();
  }

  /* ───────────────────────── daily round ───────────────────────── */
  function backlog(exclude) {
    const v = V(),
      pos = taught().pos;
    return practice()
      .filter((q) => !v.q[q.id] && !exclude.has(q.id) && isTaught(q))
      .sort((a, b) => (pos.get(owner(a)) ?? 999) - (pos.get(owner(b)) ?? 999) || score(b) - score(a));
  }
  function futureBacklog() {
    const v = V(),
      per = new Map();
    for (const q of practice()) if (!v.q[q.id] && !isTaught(q)) per.set(owner(q), (per.get(owner(q)) || 0) + 1);
    let n = 0;
    for (const c of per.values()) n += Math.max(0, c - BLOCK_CAP);
    return n;
  }
  function lessonsMinutes(d) {
    let m = learnMinutes(d);
    const cap = blockCap(d);
    for (const l of d.lessons || []) {
      const b = V().blocks[lkey(d, l)];
      m += (b ? (Array.isArray(b.ids) ? b.ids.length : b.n || 0) : Math.min(cap, practice().filter((q) => owner(q) === l.id).length)) * MIN_Q;
    }
    return m;
  }
  function roundCap(d) {
    if (d.day >= EXAM_DAY()) return d.day === EXAM_DAY() ? 15 : 20;
    let mins = DAY_TARGET;
    if (d.mode === "TEACHING") mins -= lessonsMinutes(d);
    if (mockDay(d)) mins -= mockSizeFor(d) * MOCK_MIN_Q;
    return Math.max(12, Math.min(60, Math.floor(mins / MIN_Q)));
  }
  function newQuota(d, room, bl) {
    if (room <= 0 || !bl) return 0;
    const sprint = SPRINT_FIRST();
    if (d.day >= sprint - 1) return Math.min(room, bl);
    const daysLeft = Math.max(1, sprint - d.day);
    let q = Math.ceil((bl + futureBacklog()) / daysLeft);
    if (d.mode === "CONTINUITY") q = Math.ceil(q * 1.6);
    return Math.min(room, bl, Math.max(q, Math.min(bl, 5)));
  }
  function pri(s) {
    return (s.lp || 0) * 3 + (s.r === "u" ? 1.5 : 0) + (s.r === "w" ? 2 : 0) - (s.b || 0) * 0.2;
  }
  const SEC = new Map();
  function secOf(q) {
    if (!SEC.has(q.id)) SEC.set(q.id, safe(() => V15()?.bestSection(q.id)?.id, null) || null);
    return SEC.get(q.id);
  }
  // a changed past-paper item on the same fact (never a held-out item the learner has not met)
  function sibling(id, used, t) {
    const v = V(),
      cons = consumedSet(),
      ok = (x) => x && x.id !== id && usable(x) && !used.has(x.id) && (x.split === "practice" ? isTaught(x) : cons.has(x.id)),
      rel = (PE().retest?.[id] || []).map(qget).filter(ok);
    const fresh = rel.filter((x) => !v.q[x.id]);
    if (fresh.length) return fresh[0].id;
    const old = rel.filter((x) => v.q[x.id] && v.q[x.id].l < t && !v.q[x.id].x);
    if (old.length) return old[0].id;
    // otherwise another past paper taught by the same note section: unseen first, then one answered before today
    const q = qget(id),
      sec = q && secOf(q);
    if (sec) {
      const same = practice().filter((x) => x.subject === q.subject && x.chapter === q.chapter && ok(x) && secOf(x) === sec),
        pick = same.find((x) => !v.q[x.id]) || same.find((x) => v.q[x.id] && v.q[x.id].l < t && !v.q[x.id].x);
      if (pick) return pick.id;
    }
    return null;
  }
  function roundFor(d) {
    const v = V();
    let r = v.rounds[d.day];
    if (r && Array.isArray(r.ids)) return r;
    const t = today(),
      ids = [],
      kinds = {},
      used = openBlockIds();
    const take = (id, kind) => {
      if (used.has(id) || !qget(id)) return false;
      used.add(id);
      ids.push(id);
      kinds[id] = kind;
      return true;
    };
    const cap = roundCap(d),
      all = Object.entries(v.q);
    if (d.day >= EXAM_DAY()) {
      // exam day: a short warm-up on the items that were missed most; after it, light MCQ retention
      const pool = all.filter(([, s]) => (d.day === EXAM_DAY() ? s.lp > 0 : s.d <= t)).sort((a, b) => pri(b[1]) - pri(a[1]));
      for (const [id] of pool) if (ids.length < cap) take(id, d.day === EXAM_DAY() ? "final" : "review");
    } else {
      // 1) yesterday's misses: a changed item on the same fact (at most half the round)
      const miss = all.filter(([, s]) => s.x && s.d <= t).sort((a, b) => (b[1].lp || 0) - (a[1].lp || 0) || a[1].d - b[1].d);
      const handled = new Set();
      for (const [id] of miss) {
        if (ids.length >= Math.ceil(cap / 2)) break;
        handled.add(id);
        const sib = sibling(id, used, t);
        if (sib) take(sib, "chg:" + id);
        else take(id, "again");
      }
      // 2) new past papers from lessons already learned: the pace that finishes them before the sprint
      //    is reserved first, so reviews can never starve the backlog
      const bl = backlog(used),
        quota = newQuota(d, Math.max(0, cap - ids.length), bl.length);
      for (const q of bl.slice(0, quota)) take(q.id, "new");
      // 3) sprint: every past mistake once more, spread over the sprint days
      if (d.day >= SPRINT_FIRST()) {
        // a past mistake that has since been answered with confidence twice, recently, is left alone
        const fin = all.filter(([id, s]) => s.lp > 0 && !s.fp && !used.has(id) && !(s.r === "c" && (s.b || 0) >= 4 && t - (s.l || 0) <= 10)).sort((a, b) => pri(b[1]) - pri(a[1])),
          left = Math.max(1, EXAM_DAY() - d.day),
          n = Math.min(Math.ceil(fin.length / left), Math.max(0, cap + 15 - ids.length));
        for (const [id] of fin.slice(0, n)) take(id, "final");
      }
      // 4) due reviews fill the rest (missed items first); what does not fit waits for tomorrow
      const due = all.filter(([id, s]) => s.d <= t && !used.has(id) && !handled.has(id)).sort((a, b) => pri(b[1]) - pri(a[1]));
      for (const [id, s] of due) {
        if (ids.length >= cap) break;
        if (s.x) {
          const sib = sibling(id, used, t);
          if (sib) take(sib, "chg:" + id);
          else take(id, "again");
        } else take(id, s.lp ? "again" : "review");
      }
    }
    r = v.rounds[d.day] = { ids, kinds, i: 0, t, made: new Date().toISOString() };
    const keys = Object.keys(v.rounds).map(Number).sort((a, b) => a - b);
    for (const k of keys.slice(0, Math.max(0, keys.length - 3))) delete v.rounds[k];
    persist();
    return r;
  }

  /* ───────────────────────── mocks ───────────────────────── */
  function mockPool() {
    const cons = consumedSet();
    return heldout().filter((q) => !cons.has(q.id) && isTaught(q));
  }
  function mockSizeFor(d) {
    if (!mockDay(d)) return 0;
    const m = V().mock;
    if (m && m.day === d.day) return m.ids.length;
    if ((V().mocks || []).some((x) => x.day === d.day)) return 0;
    const cons = consumedSet(),
      pool = mockPool().length,
      all = heldout().filter((q) => !cons.has(q.id)).length;
    if (!pool) return 0;
    const left = Math.max(1, (C.days || []).filter((x) => x.day >= d.day && mockDay(x)).length);
    let n = left === 1 ? 60 : Math.max(10, Math.min(40, Math.ceil(all / left)));
    return Math.min(pool, n);
  }
  function buildMockV16(d) {
    const n = mockSizeFor(d);
    if (!n) return null;
    const pool = mockPool(),
      bySub = {};
    for (const q of pool) (bySub[q.subject] = bySub[q.subject] || []).push(q);
    for (const k of Object.keys(bySub)) bySub[k].sort((a, b) => h01(d.day + ":" + a.id) - h01(d.day + ":" + b.id));
    // stratified by subject in proportion to what is left
    const ids = [],
      subs = Object.keys(bySub);
    const quota = {};
    let given = 0;
    for (const s of subs) given += quota[s] = Math.floor((n * bySub[s].length) / pool.length);
    subs.sort((a, b) => bySub[b].length - bySub[a].length);
    for (let i = 0; given < n; i = (i + 1) % subs.length) {
      if (quota[subs[i]] < bySub[subs[i]].length) {
        quota[subs[i]]++;
        given++;
      } else if (subs.every((s) => quota[s] >= bySub[s].length)) break;
    }
    for (const s of subs) ids.push(...bySub[s].slice(0, quota[s]).map((q) => q.id));
    ids.sort((a, b) => h01("mix" + d.day + a) - h01("mix" + d.day + b));
    const m = (V().mock = { day: d.day, ids, ans: {}, i: 0, used: 0, t0: Date.now(), lim: Math.round(ids.length * MOCK_MIN_Q), done: false, at: new Date().toISOString() });
    persist();
    return m;
  }
  function mockUsedMs(m) {
    return (m.used || 0) + (m.t0 && !document.hidden ? Date.now() - m.t0 : 0);
  }
  function finishMock() {
    const v = V(),
      m = v.mock;
    if (!m) return;
    const r = m.ids.map((id) => [id, !!m.ans[id]?.ok]),
      k = r.filter((x) => x[1]).length,
      at = new Date().toISOString();
    v.mocks.push({ day: m.day, at, n: r.length, k, secs: Math.round(mockUsedMs(m) / 1000), lim: m.lim, r });
    v.mocks = v.mocks.slice(-24);
    S.mockHistory = Array.isArray(S.mockHistory) ? S.mockHistory : [];
    S.mockHistory.push({ at, day: m.day, pct: Math.round((k / Math.max(1, r.length)) * 100), questionIds: m.ids.slice(), v16: true });
    v.mock = null;
    persist();
  }
  function prediction() {
    const leak = new Set(PE().leakedHeldout || []);
    let n = 0,
      k = 0;
    for (const m of V().mocks || [])
      for (const [id, ok] of m.r || []) {
        if (leak.has(id)) continue; // near/exact twins of practice items: not a fair unseen test
        n++;
        if (ok) k++;
      }
    if (n < 20) return { n, k, p: null };
    const z = 1.2816,
      ph = k / n,
      den = 1 + (z * z) / n,
      c = (ph + (z * z) / (2 * n)) / den,
      h = (z * Math.sqrt((ph * (1 - ph)) / n + (z * z) / (4 * n * n))) / den;
    return { n, k, p: ph, lo: Math.max(0, c - h), hi: Math.min(1, c + h) };
  }

  /* ───────────────────────── answering ───────────────────────── */
  const shown = new Map();
  function answer(q, choice, ctx) {
    const v = V(),
      ok = accepted(q).has(choice),
      at = new Date().toISOString(),
      t = today();
    S.qbank = isObj(S.qbank) ? S.qbank : {};
    for (const k of ["used", "results", "wrongConfident", "mockSeen"]) if (!isObj(S.qbank[k])) S.qbank[k] = {};
    S.qbank.used[q.id] = (S.qbank.used[q.id] || 0) + 1;
    S.qbank.results[q.id] = { ok, confidence: "unsure", selected: choice, at, v16: ctx, ...(ctx === "m" ? { mock: true } : {}) };
    if (ctx === "m") S.qbank.mockSeen[q.id] = true;
    const topic = lessonTopic(q),
      lat = shown.has(q.id) ? Date.now() - shown.get(q.id) : null;
    safe(() => touchMemory(topic, ok));
    safe(() => capabilitiesFor(q, ok, "unsure"));
    safe(() => window.INTELLECTUALITY_V12?.recordEvidence?.(topic, ok, { qid: q.id, confidence: "unsure", latencyMs: Number.isFinite(lat) ? lat : undefined, mock: ctx === "m", heldout: q.split === "heldout", transfer: ctx === "m", mode: ctx === "m" ? "mock" : "practice" }));
    if (!ok) safe(() => window.INTELLECTUALITY_V12?.logError?.(q, S.qbank.results[q.id], lat));
    safe(() => window.INTELLECTUALITY_V13_RUNTIME?.ingestPending?.());
    S.xp = (S.xp || 0) + (ok ? 12 : 4);
    S.combo = ok ? (S.combo || 0) + 1 : 0;
    const prev = v.q[q.id] ? { ...v.q[q.id] } : null;
    v.q[q.id] = update(prev, ok ? "u" : "w", t, ctx);
    return { ok, prev, t };
  }
  function next(conf) {
    const v = V(),
      c = v.cur;
    if (!c) return;
    const q = qget(c.id);
    if (q && c.ok && conf === "c") v.q[q.id] = update(c.prev, "c", c.t, c.ctx);
    if (q && c.ok) S.qbank.results[q.id].confidence = conf === "c" ? "confident" : "unsure";
    if (q && !c.ok && conf === "s") {
      S.qbank.results[q.id].confidence = "confident";
      S.qbank.wrongConfident = S.qbank.wrongConfident || {};
      S.qbank.wrongConfident[q.id] = (S.qbank.wrongConfident[q.id] || 0) + 1;
    }
    if (c.ctx === "r") {
      const r = v.rounds[c.day],
        kind = r?.kinds?.[c.id] || "";
      if (kind.startsWith("chg:")) {
        // the changed item was asked: the exact past-paper item comes back in three days
        const p = v.q[kind.slice(4)];
        if (p) {
          p.x = 0;
          p.d = Math.max(p.d || 0, c.t + 3);
        }
      }
      if (kind === "final" && v.q[c.id]) v.q[c.id].fp = 1;
      if (r) r.i++;
    } else if (c.ctx === "b") {
      const b = v.blocks[c.block];
      if (b) b.i++;
    }
    v.cur = null;
    persist();
  }

  /* ───────────────────────── routing ───────────────────────── */
  function route(a, depth) {
    if (!a || depth > 8) return a;
    const v = V(),
      d = day();
    if (v.mock && !v.mock.done) return { kind: "V16_MOCK", d };
    if (v.mock && v.mock.done) return { kind: "V16_MOCK_RESULT", d };
    const again = () => route(baseNext(), depth + 1);
    switch (a.kind) {
      case "SEGMENT":
        if (a.seg?.type === "question") {
          const b = blockFor(a.d, a.l);
          if (b.i >= b.ids.length) {
            finishBlock(a.d, a.l);
            return again();
          }
          return { kind: "V16_BLOCK", d: a.d, l: a.l, b, key: a.key, seg: a.seg, si: a.si };
        }
        if (a.seg?.type === "reconstruct") {
          S.segments[a.key] = true;
          v.skip[a.key] = 1;
          persist();
          return again();
        }
        return a;
      case "DAY_VISUAL_BOSS":
      case "DAY_WRITTEN_BOSS": {
        const bs = dayBossState(d);
        bs.visual = true;
        bs.written = true;
        bs.v16skip = true;
        persist();
        return again();
      }
      case "REVIEW":
      case "CONTINUITY":
      case "WRITTEN_WAVE":
      case "PRACTICAL_WAVE":
      case "START_MOCK":
      case "STOP":
        return dayEnd(a, d);
      default:
        return a; // legacy repair/retest/mock, commute, fatigue reset
    }
  }
  function dayEnd(a, d) {
    const v = V();
    if (mockDay(d) && !v.mocks.some((x) => x.day === d.day) && mockSizeFor(d) > 0) return { kind: "V16_MOCK_START", d, n: mockSizeFor(d) };
    const r = roundFor(d);
    if (r.i < r.ids.length) return { kind: "V16_ROUND", d, r };
    if (d.mode === "CONTINUITY") {
      const k = "day" + d.day + ":continuity";
      if (!S.segments[k]) {
        S.segments[k] = true;
        persist();
      }
    }
    return { kind: "STOP" };
  }
  let baseNext = null;

  /* ───────────────────────── views ───────────────────────── */
  function stats() {
    const v = V(),
      all = Object.values(v.q),
      total = practice().length + heldout().length,
      done = all.length,
      mastered = all.filter((s) => (s.b || 0) >= 3 && s.r !== "w").length,
      t = today(),
      dueTomorrow = all.filter((s) => s.d <= t + 1 && s.d > t).length;
    return { total, done, mastered, dueTomorrow, pred: prediction() };
  }
  function strip() {
    const s = stats(),
      p = s.pred;
    return (
      '<div class="v16Strip"><span><b>' + s.done + "</b> / " + s.total.toLocaleString("en") + " past-paper MCQs done</span><span><b>" + s.mastered + "</b> solid</span>" +
      (p.p != null ? '<span class="v16Pred">Predicted <b>' + Math.round(p.p * 100) + "%</b> (" + Math.round(p.lo * 100) + "–" + Math.round(p.hi * 100) + "%)</span>" : "") +
      "</div>"
    );
  }
  function sourceBits(q) {
    const tier = PE().questionMeta?.[q.id]?.tier;
    return (
      '<div class="v16Src"><span>' + E(q.subject) + "</span><span>" + E(q.chapter) + "</span>" +
      (q.sourceTag ? '<span class="v16Tag">' + E(q.sourceTag) + "</span>" : "") +
      (tier ? '<span class="v16Tier t' + E(tier) + '">TIER ' + E(tier) + "</span>" : "") +
      "</div>"
    );
  }
  const KIND = {
    new: ["جديد", "NEW PAST-PAPER MCQ"],
    review: ["مراجعة", "SPACED REVIEW"],
    again: ["تاني", "BACK AGAIN · THE EXACT PAST-PAPER ITEM"],
    chg: ["نفس الفكرة", "CHANGED QUESTION · SAME FACT YOU MISSED"],
    final: ["آخر لفة", "FINAL PASS · A PAST MISTAKE"],
  };
  function kindChip(kind) {
    const k = String(kind || "new").split(":")[0],
      [ar, en] = KIND[k] || KIND.new;
    return '<span class="chip v16Kind k' + E(k) + '"><span lang="ar" dir="rtl">' + E(ar) + "</span> " + E(en) + "</span>";
  }
  function pictureFor(q, text) {
    const t = safe(() => V15()?.termsFor(text, { stem: q.stem }) || [], []);
    return t[0] || null;
  }
  function figHTML(term, label, cls, q) {
    return (
      '<div class="v16Fig ' + cls + '"><div class="v16FigLab">' + E(label) + '</div><figure class="v15Pic" data-v15-term="' + E(term) + '" data-v15-focus="' + E(term) + '" data-v15-subj="' + E(q.subject) + '"><div class="v14Skeleton"><span></span></div></figure></div>'
    );
  }
  function bestBullet(sec, text) {
    const want = new Set(String(text).toLowerCase().match(/[a-z0-9]{4,}/g) || []);
    let best = null;
    for (const p of sec.p || []) {
      const w = String(p).toLowerCase().match(/[a-z0-9]{4,}/g) || [];
      const sc = w.filter((x) => want.has(x)).length;
      if (sc && (!best || sc > best.sc)) best = { p, sc };
    }
    return best?.p || null;
  }
  function explainHTML(q, sel) {
    const x = explain(q),
      keys = new Set(q.answerKeys || []),
      acc = accepted(q),
      rows = q.options
        .map((o) => {
          const isKey = keys.has(o.key),
            isStd = !isKey && acc.has(o.key),
            mine = o.key === sel,
            cls = isKey ? "key" : isStd ? "std" : mine ? "mine" : "",
            mark = isKey || isStd ? "✓" : mine ? "✗" : "·",
            why = isKey ? x?.key || "" : isStd ? (x?.flag?.k === o.key ? x.flag.why : (x?.also || []).find((a) => a.k === o.key)?.why || "") : x?.opt?.[o.key] || "";
          return (
            '<div class="v16Row ' + cls + '"><div class="v16RowTop"><span class="v16Mark">' + mark + '</span><span class="v16L">' + E(o.key.toUpperCase()) + '.</span><span class="v16T">' + E(o.text) +
            (mine ? ' <span class="v16You">your answer</span>' : "") + (isStd ? ' <span class="v16You">' + (x?.flag?.k === o.key ? "standard answer" : "also accepted") + "</span>" : "") + "</span></div>" +
            (why ? '<div class="v16Why">' + md(why) + "</div>" : "") + "</div>"
          );
        })
        .join("");
    const flag = x?.flag
      ? '<div class="v16Flag"><b>⚠ Doubtful bank key.</b> The bank keys ' + E((q.answerKeys || []).join(", ").toUpperCase()) + "; standard teaching gives " + E(x.flag.k.toUpperCase()) + ". Both count as correct here. Learn the standard fact.</div>"
      : "";
    const sid = secOf(q),
      sec = sid ? safe(() => V15().section(sid), null) : null;
    let note = "";
    if (sec) {
      const card = safe(() => V15().noteCard(sid), "") || "";
      if (!x) {
        const b = bestBullet(sec, q.stem + " " + [...keys].map((k) => optText(q, k)).join(" "));
        note = (b ? '<div class="v16Auto"><b>From your notes:</b> ' + md(b) + "</div>" : "") + card.replace("<details ", "<details open ");
      } else note = card;
    }
    const keyText = [...keys].map((k) => optText(q, k)).join(" "),
      tk = pictureFor(q, keyText),
      tm = tk && sel && !acc.has(sel) ? pictureFor(q, optText(q, sel)) : null,
      // the chosen option's picture only next to the right answer's picture, for contrast
      pics = tk ? figHTML(tk, "✓ " + tk, "good", q) + (tm && tm !== tk ? figHTML(tm, "✗ what you chose: " + tm, "bad", q) : "") : "";
    return '<div class="v16Explain">' + rows + flag + (pics ? '<div class="v16Pics">' + pics + "</div>" : "") + note + (x ? "" : '<div class="v16Tiny">No tutor note is written for this item yet; the explanation comes from your notes.</div>') + "</div>";
  }
  function questionHTML(q, ctx, meta) {
    const v = V(),
      c = v.cur && v.cur.id === q.id && v.cur.ctx === ctx ? v.cur : null;
    if (!c && !shown.has(q.id)) shown.set(q.id, Date.now());
    const vis = q.visualData && typeof sourceVisual === "function" ? safe(() => sourceVisual(q), "") : "";
    let h = sourceBits(q) + vis + '<h3 class="v16Stem">' + E(q.stem) + "</h3>";
    if (!c) {
      h += '<div class="v16Opts">' + q.options.map((o) => '<button class="v16Opt" data-v16="pick" data-qid="' + E(q.id) + '" data-choice="' + E(o.key) + '"><span class="v16L">' + E(o.key.toUpperCase()) + "</span><span>" + E(o.text) + "</span></button>").join("") + "</div>";
    } else {
      h += '<div class="v16Verdict ' + (c.ok ? "good" : "bad") + '">' + (c.ok ? '✓ <span lang="ar" dir="rtl">صح</span> Correct' : '✗ <span lang="ar" dir="rtl">غلط</span> Not this one') + "</div>";
      h += explainHTML(q, c.sel);
      h +=
        '<div class="v16Next">' +
        (c.ok
          ? '<button class="primary bigAction" data-v16="next" data-conf="c"><span lang="ar" dir="rtl">عارفها</span> KNEW IT → NEXT</button><button class="v16Soft" data-v16="next" data-conf="u"><span lang="ar" dir="rtl">مش متأكد</span> Lucky / not sure → next</button>'
          : '<button class="primary bigAction" data-v16="next" data-conf="w"><span lang="ar" dir="rtl">فهمت الغلطة</span> GOT IT → NEXT</button><button class="v16Soft" data-v16="next" data-conf="s"><span lang="ar" dir="rtl">كنت متأكد!</span> I was sure of my answer → next</button>') +
        "</div>" +
        (c.ok ? "" : '<div class="v16Tiny">It comes back tomorrow as a changed question on the same fact, then as this exact past-paper question a few days later.</div>');
    }
    return h;
  }
  function blockView(a) {
    const b = a.b,
      q = qget(b.ids[b.i]);
    if (!q) {
      b.i++;
      persist();
      return "";
    }
    return (
      '<div class="stage v16Stage v16Q" data-v16-ctx="b"><div class="chips"><span class="chip">' + E(a.l.subject) + '</span><span class="chip good">PAST PAPERS · ' + E(a.l.topic) + '</span><span class="chip">' + (b.i + 1) + " / " + b.ids.length + "</span></div>" +
      strip() + questionHTML(q, "b", { block: lkey(a.d, a.l) }) + "</div>"
    );
  }
  function roundView(a) {
    const r = a.r,
      q = qget(r.ids[r.i]);
    if (!q) {
      r.i++;
      persist();
      return "";
    }
    const head = a.d.day === EXAM_DAY() ? "EXAM-DAY WARM-UP" : a.d.day >= SPRINT_FIRST() ? "MCQ SPRINT ROUND" : "TODAY'S MCQ ROUND";
    return (
      '<div class="stage v16Stage v16Q" data-v16-ctx="r"><div class="chips"><span class="chip good">' + head + '</span><span class="chip">' + (r.i + 1) + " / " + r.ids.length + "</span>" + kindChip(r.kinds?.[q.id]) + "</div>" +
      strip() + questionHTML(q, "r") + "</div>"
    );
  }
  function mockStartView(a) {
    const n = a.n,
      sprint = a.d.continuityType === "MCQ_SPRINT";
    return (
      '<div class="stage v16Stage"><div class="chips"><span class="chip bad">' + (sprint ? "MCQ SPRINT · EXAM TWIN" : "WEEKLY SEALED MOCK") + '</span><span class="chip">' + n + " MCQs · " + Math.round(n * MOCK_MIN_Q) + " min</span></div>" +
      "<h2>" + n + " past-paper MCQs you have never seen</h2>" + strip() +
      '<div class="v16Rules"><p>Exam conditions: no pictures, no hints, no explanations until you submit. About one minute per question.</p><p>Every question comes with a full explanation after you finish, and every miss goes into tomorrow\'s round.</p></div>' +
      '<button class="primary bigAction" data-v16="mock-start"><span lang="ar" dir="rtl">يلا الامتحان</span> START THE MOCK →</button></div>'
    );
  }
  function clock(ms) {
    const s = Math.max(0, Math.round(ms / 1000)),
      m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  }
  function mockView() {
    const m = V().mock;
    if (!m.t0) m.t0 = Date.now();
    const q = qget(m.ids[m.i]);
    if (!q) {
      m.done = true;
      persist();
      return mockResultView();
    }
    if (!shown.has(q.id)) shown.set(q.id, Date.now());
    const left = m.lim * 60000 - mockUsedMs(m);
    return (
      '<div class="stage v16Stage v16Mock"><div class="chips"><span class="chip bad">SEALED MOCK</span><span class="chip">' + (m.i + 1) + " / " + m.ids.length + '</span><span class="chip v16Clock' + (left < 0 ? " over" : "") + '" data-v16-clock>⏱ ' + (left < 0 ? "+" + clock(-left) + " over" : clock(left) + " left") + "</span></div>" +
      '<div class="v16Src"><span>' + E(q.subject) + "</span><span>" + E(q.chapter) + "</span></div>" +
      (q.visualData && typeof sourceVisual === "function" ? safe(() => sourceVisual(q), "") : "") +
      '<h3 class="v16Stem">' + E(q.stem) + "</h3>" +
      '<div class="v16Opts">' + q.options.map((o) => '<button class="v16Opt" data-v16="mock-pick" data-qid="' + E(q.id) + '" data-choice="' + E(o.key) + '"><span class="v16L">' + E(o.key.toUpperCase()) + "</span><span>" + E(o.text) + "</span></button>").join("") + "</div></div>"
    );
  }
  function mockResultView() {
    const m = V().mock,
      r = m.ids.map((id) => ({ q: qget(id), a: m.ans[id] || {} })).filter((x) => x.q),
      k = r.filter((x) => x.a.ok).length,
      pct = Math.round((k / Math.max(1, r.length)) * 100),
      bySub = {};
    for (const x of r) {
      const s = (bySub[x.q.subject] = bySub[x.q.subject] || { n: 0, k: 0 });
      s.n++;
      if (x.a.ok) s.k++;
    }
    const secs = Math.round(mockUsedMs(m) / 1000);
    const list = r
      .map(
        (x, i) =>
          '<details class="v16Rev ' + (x.a.ok ? "ok" : "bad") + '"' + (!x.a.ok && i < 40 ? " open" : "") + "><summary><span>" + (x.a.ok ? "✓" : "✗") + "</span> " + (i + 1) + ". " + E(x.q.stem.length > 110 ? x.q.stem.slice(0, 108) + "…" : x.q.stem) + "</summary>" +
          sourceBits(x.q) + '<h3 class="v16Stem">' + E(x.q.stem) + "</h3>" + explainHTML(x.q, x.a.sel || "") + "</details>",
      )
      .join("");
    return (
      '<div class="stage v16Stage v16Result"><div class="doneMark">' + pct + "%</div><h2>Mock result · " + k + " / " + r.length + "</h2>" +
      '<div class="grid">' + Object.entries(bySub).map(([s, v]) => '<div class="card"><b>' + E(s) + "</b>" + Math.round((v.k / Math.max(1, v.n)) * 100) + "%</div>").join("") +
      '<div class="card"><b>Time</b>' + clock(secs * 1000) + " / " + m.lim + " min</div></div>" +
      strip() +
      '<p class="v16Tiny">Every miss comes back tomorrow as a changed question on the same fact, then as this exact question.</p>' +
      '<h3 class="v16H">Every question, explained</h3>' + list +
      '<button class="primary bigAction" data-v16="mock-done"><span lang="ar" dir="rtl">تمام</span> SAVE → CONTINUE</button></div>'
    );
  }
  function view(a) {
    if (a.kind === "V16_BLOCK") return blockView(a);
    if (a.kind === "V16_ROUND") return roundView(a);
    if (a.kind === "V16_MOCK_START") return mockStartView(a);
    if (a.kind === "V16_MOCK") return mockView();
    if (a.kind === "V16_MOCK_RESULT") return mockResultView();
    return "";
  }

  /* ───────────────────────── events ───────────────────────── */
  // the learner's actions (also the test hooks): answer the item on screen, go on, run a mock
  function pick(choice) {
    const v = V(),
      a = safe(() => nextAction(), null);
    if (!a || (a.kind !== "V16_BLOCK" && a.kind !== "V16_ROUND") || v.cur) return false;
    const q = qget(a.kind === "V16_BLOCK" ? a.b.ids[a.b.i] : a.r.ids[a.r.i]);
    if (!q || !q.options.some((o) => o.key === choice)) return false;
    const ctx = a.kind === "V16_BLOCK" ? "b" : "r",
      res = answer(q, choice, ctx);
    v.cur = { id: q.id, sel: choice, ok: res.ok, prev: res.prev, t: res.t, ctx, block: ctx === "b" ? lkey(a.d, a.l) : null, day: a.d.day };
    persist();
    return res.ok;
  }
  function mockStart() {
    return !!buildMockV16(day());
  }
  function mockPick(choice) {
    const m = V().mock;
    if (!m || m.done) return false;
    const q = qget(m.ids[m.i]);
    if (!q || !q.options.some((o) => o.key === choice)) return false;
    const res = answer(q, choice, "m");
    m.ans[q.id] = { sel: choice, ok: res.ok };
    m.i++;
    if (m.i >= m.ids.length) {
      m.used = mockUsedMs(m);
      m.t0 = 0;
      m.done = true;
    }
    persist();
    return res.ok;
  }
  function onClick(ev) {
    const b = ev.target.closest?.("[data-v16]");
    if (!b || !document.querySelector("#player")?.contains(b)) return;
    ev.preventDefault();
    const act = b.dataset.v16;
    if (act === "pick") {
      if (b.dataset.qid && V().cur) return;
      pick(b.dataset.choice);
      render();
      return;
    }
    if (act === "next") next(b.dataset.conf);
    else if (act === "mock-start") mockStart();
    else if (act === "mock-pick") {
      if (V().mock?.ids?.[V().mock.i] !== b.dataset.qid) return;
      mockPick(b.dataset.choice);
    } else if (act === "mock-done") finishMock();
    else return;
    render();
    top();
  }
  function top() {
    const p = document.querySelector("#player");
    if (p && p.getBoundingClientRect().top < 0) p.scrollIntoView({ block: "start" });
  }
  function tickClock() {
    const el = document.querySelector("#player [data-v16-clock]"),
      m = V().mock;
    if (!el || !m || m.done) return;
    const left = m.lim * 60000 - mockUsedMs(m);
    el.textContent = "⏱ " + (left < 0 ? "+" + clock(-left) + " over" : clock(left) + " left");
    el.classList.toggle("over", left < 0);
  }

  /* ───────────────────────── install ───────────────────────── */
  function migrate() {
    const v = V();
    if (v.migrated) return;
    v.migrated = true;
    // open v14 repairs become v16 mistakes: tomorrow's round asks a changed item on the same fact
    const t = today();
    for (const e of Object.values(S.errors || {})) {
      if (!e || e.resolved) continue;
      const q = e.sourceQuestionId ? qget(e.sourceQuestionId) : null;
      if (q && usable(q)) {
        const s = v.q[q.id] || { n: 1, k: 0, b: 0, f: e.day || t, lp: 0 };
        v.q[q.id] = { ...s, b: 0, lp: (s.lp || 0) + 1, x: 1, d: t, r: "w", l: s.l || t };
      }
      e.resolved = true;
      e.readyRetest = false;
      e.v16 = "migrated";
    }
    persist();
  }
  function hudRound() {
    const d = day(),
      r = V().rounds[d.day];
    if (!r || !r.ids.length) return;
    // the day's bar includes today's MCQ round (the round never blocks the calendar)
    const base = safe(() => dayProgress(d), 0),
      pct = Math.round(base * 0.8 + (r.i / r.ids.length) * 20);
    const t = document.querySelector("#sideDay"),
      bar = document.querySelector("#sideDayBar"),
      db = document.querySelector("#dayBar"),
      dt = document.querySelector("#dayText");
    if (t) t.textContent = pct + "%";
    if (bar) bar.style.width = pct + "%";
    if (db) db.style.width = pct + "%";
    if (dt) dt.textContent = dt.textContent.replace(/^\d+% today/, pct + "% today");
  }
  function hudCount() {
    const dt = document.querySelector("#dayText"),
      s = stats();
    if (dt) dt.textContent = dt.textContent.replace(/\d+\/\d+ sourced MCQs sampled/, s.done + "/" + s.total.toLocaleString("en") + " past-paper MCQs done");
  }
  function install() {
    V();
    baseNext = nextAction;
    nextAction = function () {
      const a = baseNext.apply(this, arguments);
      if (!focusOn()) return a;
      return safe(() => route(a, 0), a) || a;
    };
    const baseDue = dueReviews;
    dueReviews = function () {
      return focusOn() ? [] : baseDue.apply(this, arguments);
    };
    // a weekend/continuity day the calendar has already passed never blocks the days after it
    const baseDP = dayProgress;
    dayProgress = function (d) {
      if (focusOn() && d && d.mode === "CONTINUITY" && d.day < today()) return 100;
      return baseDP.apply(this, arguments);
    };
    const baseRemain = remainingMinutes;
    remainingMinutes = function (d) {
      if (!focusOn() || !d) return baseRemain.apply(this, arguments);
      return safe(() => minutesLeft(d), null) ?? baseRemain.apply(this, arguments);
    };
    const baseStop = stopView;
    stopView = function (d) {
      const h = baseStop.apply(this, arguments);
      return focusOn() ? safe(() => h.replace('<div class="grid">', summaryHTML(d) + '<div class="grid">'), h) : h;
    };
    const baseHUD = renderHUD;
    renderHUD = function () {
      const out = baseHUD.apply(this, arguments);
      if (focusOn()) {
        safe(hudRound);
        safe(hudCount);
      }
      return out;
    };
    const baseRender = render;
    render = function () {
      for (let i = 0; i < 4; i++) {
        const a = focusOn() ? safe(() => nextAction(), null) : null;
        if (!a || !/^V16_/.test(a.kind)) return baseRender.apply(this, arguments);
        const html = safe(() => view(a), "");
        if (!html) continue; // the item moved on (e.g. removed from the bank): route again
        safe(() => renderHUD());
        const p = document.querySelector("#player");
        if (p) {
          p.innerHTML = html;
          safe(() => V15()?.hydrate(document));
        }
        safe(() => window.INTELLECTUALITY_COURSE_UI?.());
        return undefined;
      }
      return baseRender.apply(this, arguments);
    };
    if (focusOn()) migrate();
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", () => {
      const m = V().mock;
      if (!m || m.done) return;
      if (document.hidden) {
        m.used = mockUsedMs(m);
        m.t0 = 0;
      } else m.t0 = Date.now();
      persist();
    });
    setInterval(tickClock, 1000);
    window.INTELLECTUALITY_V16 = {
      version: VERSION,
      focus: (f) => {
        if (f) {
          V().focus = f === "ALL" ? "ALL" : "MCQ";
          persist();
          render();
        }
        return focusOn() ? "MCQ" : "ALL";
      },
      explain: (id) => (qget(id) ? explain(qget(id)) : null),
      accepted: (id) => (qget(id) ? [...accepted(qget(id))] : []),
      owner: (id) => (qget(id) ? owner(qget(id)) : null),
      state: (id) => V().q[id] || null,
      stats,
      prediction,
      mockSizeFor: (n) => mockSizeFor((C.days || [])[(n || S.day) - 1]),
      roundPreview: (n) => {
        const d = (C.days || [])[(n || S.day) - 1];
        return d ? roundFor(d) : null;
      },
      counts: () => ({ practice: practice().length, heldout: heldout().length, explained: practice().filter((q) => explain(q)).length, heldExplained: heldout().filter((q) => explain(q)).length }),
      today,
      EXAM_DAY,
      SPRINT_FIRST,
      // the same actions the buttons run (used by the certification suite)
      act: {
        pick,
        next: (conf) => next(conf),
        mockStart,
        mockPick,
        mockDone: () => finishMock(),
        current: () => {
          const a = nextAction(),
            m = V().mock;
          if (a.kind === "V16_BLOCK") return { kind: a.kind, id: a.b.ids[a.b.i], answered: !!V().cur };
          if (a.kind === "V16_ROUND") return { kind: a.kind, id: a.r.ids[a.r.i], rk: a.r.kinds?.[a.r.ids[a.r.i]], answered: !!V().cur };
          if (a.kind === "V16_MOCK") return { kind: a.kind, id: m?.ids?.[m.i] };
          return { kind: a.kind, key: a.key, type: a.seg?.type };
        },
      },
    };
  }
  function minutesLeft(d) {
    let m = 0;
    const pace = safe(() => window.INTELLECTUALITY_PACE?.(), 1) || 1;
    if (d.mode === "TEACHING")
      for (const l of d.lessons || []) {
        let qDone = true;
        (l.segments || []).forEach((sg, i) => {
          if (S.segments[segmentKey(d, l, i)]) return;
          if (sg.type === "question") qDone = false;
          else if (sg.type !== "reconstruct") m += (sg.type === "teach" ? safe(() => V15()?.lessonMinutes(l.id), 0) || sg.minutes : sg.minutes) || 3;
        });
        if (!qDone) {
          const b = V().blocks[lkey(d, l)];
          m += (b && Array.isArray(b.ids) ? b.ids.length - b.i : Math.min(blockCap(d), practice().filter((q) => owner(q) === l.id && !V().q[q.id]).length)) * MIN_Q;
        }
      }
    const mk = V().mock;
    if (mk && !mk.done) m += Math.max(0, mk.lim - mockUsedMs(mk) / 60000);
    else if (mockDay(d) && !V().mocks.some((x) => x.day === d.day)) m += mockSizeFor(d) * MOCK_MIN_Q;
    const r = V().rounds[d.day];
    if (r) m += (r.ids.length - r.i) * MIN_Q;
    else if (!(d.mode === "CONTINUITY" && S.segments["day" + d.day + ":continuity"])) {
      const t = today(),
        due = Object.values(V().q).filter((s) => s.d <= t).length;
      m += Math.min(roundCap(d), due + Math.min(10, backlog(new Set()).length)) * MIN_Q;
    }
    return Math.round(m * pace);
  }
  function summaryHTML(d) {
    const v = V(),
      t = today(),
      res = Object.values(v.q).filter((x) => x && x.l === t),
      ok = res.filter((x) => x.r !== "w").length,
      mk = v.mocks.find((x) => x.day === d.day),
      s = stats();
    return (
      '<div class="v16Sum"><b>Today: ' + res.length + " past-paper MCQs</b>" + (res.length ? " · " + Math.round((ok / res.length) * 100) + "% right" : "") +
      (res.length - ok ? " · " + (res.length - ok) + " mistakes come back tomorrow as changed questions" : "") +
      (mk ? " · mock " + mk.k + "/" + mk.n : "") + "</div>" + strip() +
      '<div class="v16Tiny">MCQ focus: written and practical steps are off until after the MCQ exam (' + E((C.examAnchors || []).find((x) => x.id === "MCQ")?.date || "") + ").</div>"
    );
  }
  function boot() {
    if (window.INTELLECTUALITY_V16_INSTALLED) return;
    if (typeof nextAction !== "function" || typeof render !== "function" || typeof S === "undefined" || typeof C === "undefined") return void setTimeout(boot, 50);
    // be the outermost layer: wait for v15 (it wraps render and remainingMinutes)
    if (!window.INTELLECTUALITY_V15_INSTALLED && (boot.n = (boot.n || 0) + 1) < 100) return void setTimeout(boot, 50);
    window.INTELLECTUALITY_V16_INSTALLED = true;
    try {
      install();
      render();
    } catch (e) {
      console.error("[v16 init fail-safe]", e);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
