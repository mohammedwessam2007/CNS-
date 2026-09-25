// v17.1 course map: every day with its date and status, read any lesson, skip / undo / jump.
// Usage: node tests/course_map_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const { open, tick } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 700))); };
const T = '2026-09-25T09:00:00+03:00';

(async () => {
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500 });
    const p = s.page;
    // M1: the map opens from the top bar and shows every day to the exam with its real date
    const btn = await p.$('#courseTopbar [data-ixmp-open]');
    if (btn) await btn.click();
    await tick(p, 300);
    const m1 = await p.evaluate(() => {
      const ed = (C.examAnchors || []).find((x) => x.id === 'MCQ').date, days = C.days.filter((d) => d.date <= ed);
      const cards = [...document.querySelectorAll('.ixMpDay')], WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dateOk = cards.every((c, i) => { const d = days[i], x = new Date(d.date + 'T12:00:00Z'); return c.querySelector('.ixMpDate small').textContent === WD[x.getUTCDay()] && +c.querySelector('.ixMpDate b').textContent === x.getUTCDate(); });
      return { cards: cards.length, days: days.length, cells: document.querySelectorAll('.ixMpCell:not(.pad)').length, dateOk, here: document.querySelector('.ixMpDay.now')?.id, exam: document.querySelector('.ixMpCell.exam')?.dataset.ixmpGo, head: document.querySelector('.ixMpH1')?.textContent, left: document.querySelector('.ixMpH2')?.textContent };
    });
    check('M1', 'The map opens from the top bar: every day up to the MCQ exam as a card and a tile with its real weekday and date; "you are here" on today\'s work day; the exam day marked', !!btn && m1.cards === m1.days && m1.cells === m1.days && m1.dateOk && m1.here === 'ixmp-d5' && m1.exam === String(m1.days) && /Fri 25 Sep · Day 5/.test(m1.head) && /51 days to the MCQ exam/.test(m1.left), m1);
    const moved = await p.evaluate(() => [1, 2, 3, 4].map((n) => window.INTELLECTUALITY_MAP.status(n)));
    check('M2', 'Days whose lessons were moved by the start-from-today spread show as moved (↪), not as missing', moved.every((k) => k === 'moved'), moved);
    // M3: open a future day, read a lesson (notes + live diagram), nothing changes
    const before = await p.evaluate(() => JSON.stringify(S.segments));
    await p.click('[data-ixmp-go="12"]');
    await tick(p, 200);
    await p.click('#ixmp-d12 [data-ixmp="read"]');
    await tick(p, 500);
    const m3 = await p.evaluate(() => ({ secs: document.querySelectorAll('.ixMpRead .ixMpSec').length, want: window.INTELLECTUALITY_V15.sectionsForLesson('T029').length, pts: document.querySelectorAll('.ixMpRead .v15Pts li').length, atlas: document.querySelectorAll('.ixMpRead .ixA').length, learnBtn: !!document.querySelector('.ixMpRead [data-ixmp="learn"]') }));
    const same = before === (await p.evaluate(() => JSON.stringify(S.segments)));
    check('M3', 'Read any lesson from any day now: its note sections, points and live diagrams, read-only (nothing marked done by reading)', m3.secs === m3.want && m3.secs > 0 && m3.pts > 3 && m3.atlas >= 1 && m3.learnBtn && same, { ...m3, same });
    // M4: mark learned from the reader: learning steps done, the lesson's own past-paper block kept
    await p.click('.ixMpRead [data-ixmp="learn"]');
    await tick(p, 300);
    const m4 = await p.evaluate(() => { const d = C.days[11], l = d.lessons.find((x) => x.id === 'T029'); return l.segments.map((sg, i) => [sg.type, !!S.segments[segmentKey(d, l, i)]]); });
    check('M4', '"Mark learned" (after reading ahead) completes the learning steps but keeps the lesson\'s own past-paper block for its day', m4.every(([t, done]) => (t === 'question' ? !done : done)), m4);
    // M5: skip a lesson today → the app moves on; its past papers still reach the rounds
    await p.click('[data-ixmp="goNow"]');
    await p.click('#ixmp-d5 [data-ixmp="askL"]');
    const ask = await p.evaluate(() => document.querySelector('#ixmp-d5 .ixMpAsk')?.textContent || '');
    await p.click('#ixmp-d5 [data-ixmp="skipL"]');
    await tick(p, 300);
    const m5 = await p.evaluate(() => {
      const d = C.days[4], l = d.lessons.find((x) => x.id === 'T001');
      const q = window.EHSAN_QBANK.questions.filter((x) => x.split === 'practice' && window.INTELLECTUALITY_V16.owner(x.id) === 'T001');
      return { cur: window.INTELLECTUALITY_V16.act.current(), allDone: l.segments.every((_, i) => S.segments[segmentKey(d, l, i)]), block: S.v16.blocks['1:T001'], n: q.length, st: window.INTELLECTUALITY_MAP.status(5) };
    });
    check('M5', 'Skip a lesson (after a one-line confirm that says its past papers still come): the app moves straight on to the next lesson, and the skipped lesson\'s past papers go to the daily rounds instead of being lost', /still come/.test(ask) && m5.allDone && m5.cur.key && !/T001/.test(m5.cur.key) && m5.block && m5.block.done === 1 && m5.n > 0, { ask: ask.slice(0, 120), ...m5 });
    // M6: undo brings it back
    await p.click('#ixmp-d5 [data-ixmp="undoL"]');
    await tick(p, 300);
    const m6 = await p.evaluate(() => ({ cur: window.INTELLECTUALITY_V16.act.current(), rec: window.INTELLECTUALITY_MAP.state().les['5:T001'] || null, block: S.v16.blocks['1:T001'] || null }));
    check('M6', '↩ Undo restores the lesson exactly as it was (the app is back on it)', /T001/.test(m6.cur.key || '') && !m6.rec && !m6.block, m6);
    // M7: skip a future mock; skip a future day; jump ahead
    const m7 = await p.evaluate(() => {
      const M = window.INTELLECTUALITY_MAP, V = window.INTELLECTUALITY_V16;
      const n0 = V.mockSizeFor(7), a = M.skipMock(7), n1 = V.mockSizeFor(7);
      const b = M.skipDay(8), st8 = M.status(8);
      const c = M.jumpTo(9);
      return { n0, n1, a, b, st8, c, day: S.day, done: S.doneDays.slice(), cur: V.act.current(), rounds: Object.keys(S.v16.rounds || {}) };
    });
    check('M7', 'Skip a mock (its questions move to later mocks), skip a whole future day, and jump ahead: the days in between are marked passed and the app starts the chosen day', m7.a && m7.n0 > 0 && m7.n1 === 0 && m7.b && m7.st8 === 'skipped' && m7.c && m7.day === 9 && [5, 6, 7, 8].every((d) => m7.done.includes(d)) && /V16_|SEGMENT/.test(m7.cur.kind) && !m7.rounds.some((k) => +k > 9), m7);
    // M8: a skipped round for the work day is an empty round (the day can finish)
    const m8 = await p.evaluate(() => { const M = window.INTELLECTUALITY_MAP; M.skipDay(9); render(); const r = S.v16.rounds[9] || null; const unseen = r ? r.ids.filter((id) => !S.v16.q[id]).length : 0; return { i: r && r.i, n: r && r.ids.length, unseen, kind: window.INTELLECTUALITY_V16.act.current().kind, next: window.INTELLECTUALITY_V16.roundPreview(10).ids.length }; });
    check('M8', 'Skipping the round of the day you are on closes it, so the day can be certified; its unseen past papers wait for the next round', m8.i === m8.n && m8.kind === 'STOP' && m8.next > 0, m8);
    // M9: nothing can be changed during a sealed mock
    const m9 = await p.evaluate(() => {
      const ids = window.EHSAN_QBANK.questions.filter((q) => q.split === 'heldout' && q.autoScore && (q.options || []).length >= 2 && !q.requiresVisual).slice(0, 3).map((q) => q.id);
      S.v16.mock = { day: S.day, ids, ans: {}, i: 0, used: 0, t0: Date.now(), lim: 3, done: false, at: new Date().toISOString() };
      const M = window.INTELLECTUALITY_MAP;
      const r = { skip: M.skipLesson(12, 'T030'), jump: M.jumpTo(12), day: S.day };
      S.v16.mock = null;
      return r;
    });
    check('M9', 'While a sealed mock runs, skipping and jumping are refused', !m9.skip && !m9.jump && m9.day === 9, m9);
    const size = await p.evaluate(() => JSON.stringify(S.map).length);
    check('M10', 'The map\'s saved record stays small, and there are no page errors', size < 3000 && s.log.errors.length === 0, { size, errors: s.log.errors.slice(0, 3) });
    await s.close();
  }
  // M11: phone width: the map fits the screen
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500, viewport: { width: 390, height: 844 } });
    await s.page.evaluate(() => window.INTELLECTUALITY_MAP.show());
    await tick(s.page, 300);
    const r = await s.page.evaluate(() => { const sc = document.querySelector('.ixMpScroll'); return { sw: sc.scrollWidth, cw: sc.clientWidth, cards: document.querySelectorAll('.ixMpDay').length }; });
    check('M11', 'On a phone (390 px) the map fits without sideways scrolling', r.sw <= r.cw + 1 && r.cards > 50 && s.log.errors.length === 0, r);
    await s.close();
  }
  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'course_map_test.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
