// v15.2 catch-up spread: start from today; missed lessons spread over the next teaching days where
// they are relevant. Usage: node tests/spread_test.js [out.json]   (server: node tests/serve.js source/public 8787)
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const results = [];
function check(id, name, ok, detail = '') {
  const d = typeof detail === 'string' ? detail : JSON.stringify(detail);
  results.push({ id, name, ok: !!ok, detail: d });
  console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(5) + name + (d ? '  · ' + d.slice(0, 260) : ''));
}
const NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]';
const layout = () => C.days.slice(0, 14).map((d) => ({ day: d.day, mode: d.mode, est: d.estimatedMinutes, ls: d.lessons.map((l) => l.id + '@' + (l._from || d.day)) }));
const snap = (page) => page.evaluate((src) => { const layout = eval(src); return { day: S.day, chip: document.querySelector('#v14Calendar')?.textContent || '', banner: document.querySelector('.v14Carryover')?.innerText || '', moved: document.querySelector('.v14Moved')?.innerText || '', layout: layout(), segs: Object.keys(S.segments).filter((k) => S.segments[k]).sort(), spreads: (S.v14.calendar.spreads || []).length, policy: S.v14.calendar.policy || 'spread', done: S.doneDays.slice() }; }, layout.toString());
const order = (lay) => lay.flatMap((d) => d.ls.map((k) => k.split('@')[0]));
const before = (seq, a, b) => seq.indexOf(a) >= 0 && seq.indexOf(b) >= 0 && seq.indexOf(a) < seq.indexOf(b);

(async () => {
  const t0 = Date.now();
  // pristine layout (Mon 21 = course day 1: nothing to spread)
  let pristine;
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 900 });
    pristine = (await snap(s.page)).layout;
    await s.close();
  }
  const keysIn = (lay, from, to) => lay.filter((d) => d.day >= from && d.day <= to).flatMap((d) => d.ls).sort();

  // ── S1: fresh learner opening the app on Wed 23 Sep ──
  let fresh;
  {
    const s = await open({ time: '2026-09-23T10:00:00+03:00', state: null, settle: 1200 });
    const r = await snap(s.page);
    fresh = r;
    const seq = order(r.layout.filter((d) => d.day >= 3 && d.day <= 5));
    const wed = r.layout[2].ls.map((k) => k.split('@')[0]);
    check('S1', 'Fresh on Wed 23 Sep: starts from today (Day 3), real date kept, chip names the moved lessons', r.day === 3 && /^TODAY · WED 23 SEP · \+\d+ FROM MON 21 \+ TUE 22$/.test(r.chip) && /CAUGHT UP BY SPREADING · REAL DATE KEPT/.test(r.banner) && /Today is Wed 23 Sep \(Day 3\)/.test(r.banner), { chip: r.chip, day: r.day });
    check('S1b', 'Nothing lost or duplicated: every lesson of Mon 21–Fri 25 appears exactly once in Wed 23–Fri 25; Mon 21 and Tue 22 are empty', JSON.stringify(keysIn(pristine, 1, 5)) === JSON.stringify(keysIn(r.layout, 3, 5)) && !r.layout[0].ls.length && !r.layout[1].ls.length, { wed: r.layout[2].ls, thu: r.layout[3].ls, fri: r.layout[4].ls });
    check('S1c', 'Placed where relevant: synapse physiology before sensory receptors, brainstem before cerebellum and 4th ventricle, PNS nerves before neuroglia and nerve endings', before(seq, 'T003', 'T009') && before(seq, 'T006', 'T009') && before(seq, 'T007', 'T010') && before(seq, 'T008', 'T010') && before(seq, 'T005', 'T011') && before(seq, 'T004', 'T011'), seq.join(' '));
    const chains = { ANAT: ['T001', 'T002', 'T007', 'T008', 'T010', 'T012', 'T013', 'T015'], PHYS: ['T003', 'T006', 'T009', 'T014', 'T016', 'T017'], HIST: ['T004', 'T005', 'T011'] };
    const chainOk = Object.values(chains).every((c) => c.every((x, i) => i === 0 || before(seq, c[i - 1], x)));
    check('S1d', "The department's order within each subject is kept (anatomy: spinal cord → brainstem → cerebellum → …)", chainOk, chains);
    const est = r.layout.slice(2, 5).map((d) => d.est);
    check('S1e', 'Load is balanced over the catch-up days (each ≤ 207 planned min incl. the daily boss); the weekend review and mock are untouched', est.every((m) => m <= 207) && r.layout[5].mode === 'CONTINUITY' && r.layout[6].mode === 'CONTINUITY' && !r.layout[5].ls.length, { est, sat: r.layout[5], sun: r.layout[6] });
    check('S1f', 'Today starts with a moved lesson that says where it came from and why it sits here', /^📅 From (Mon 21|Tue 22) Sep · /.test(r.moved) && wed[0] !== 'T009', r.moved);
    const rail = await s.page.evaluate(() => [...document.querySelectorAll('#railToday .railLessonHead')].map((h) => h.innerText.replace(/\n/g, ' ')));
    check('S1g', 'The course rail tags each moved lesson with its original date', rail.length === wed.length && rail.filter((x) => /FROM (MON 21|TUE 22) SEP/.test(x)).length === r.layout[2].ls.filter((k) => !k.endsWith('@3')).length, rail);
    check('S1h', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    // S3: reload → same plan, no second spread
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(1100);
    const r2 = await snap(s.page);
    check('S3', 'Reload re-applies the same plan (no second spread, same order)', r2.spreads === 1 && JSON.stringify(r2.layout) === JSON.stringify(r.layout) && r2.day === 3, { spreads: r2.spreads });
    // S7: the first moved lesson's teach step is the LEARN lecture for that lesson
    for (let i = 0; i < 6; i++) { const k = await s.page.evaluate(() => nextAction().seg?.type); if (k === 'teach') break; await s.page.evaluate((sel) => document.querySelector(sel)?.click(), NEXT); await s.page.waitForTimeout(200); }
    const learn = await s.page.evaluate(() => ({ lesson: nextAction().l?.id, from: nextAction().l?._from, key: nextAction().key, learn: !!document.querySelector('.v15Learn'), h: document.querySelector('.v15Sec h3')?.textContent || '', segs: Object.keys(S.segments).filter((k) => S.segments[k]) }));
    check('S7', 'A moved lesson teaches normally (LEARN lecture) and its progress is saved under its original day', learn.learn && !!learn.from && learn.key.startsWith('d' + learn.from + ':' + learn.lesson + ':') && learn.segs.some((k) => k.startsWith('d' + learn.from + ':' + learn.lesson + ':')), learn);
    // S8: a mock after a spread only uses lessons scheduled on or before today
    const mock = await s.page.evaluate(() => { const cov = new Set(); for (const d of C.days) if (d.day <= S.day) for (const l of d.lessons) cov.add(l.id); const p = mockQuestionPool(); return { n: p.length, outside: p.filter((q) => (q.lessonIds || []).length && !q.lessonIds.some((id) => cov.has(id))).length }; });
    check('S8', 'A mock after the spread only asks about lessons already scheduled on or before today', mock.n > 0 && mock.outside === 0, mock);
    await s.close();
  }

  // ── S2: a Day-1 lesson half done on Mon 21, reopened on Wed 23 ──
  let partial;
  {
    const s = await open({ time: '2026-09-21T18:00:00+03:00', state: null, settle: 900 });
    for (let i = 0; i < 3; i++) { await s.page.evaluate((sel) => document.querySelector(sel)?.click(), NEXT); await s.page.waitForTimeout(160); }
    partial = await s.page.evaluate(() => JSON.parse(JSON.stringify(S)));
    await s.close();
  }
  {
    const s = await open({ time: '2026-09-23T09:00:00+03:00', state: JSON.parse(JSON.stringify(partial)), settle: 1200 });
    const r = await snap(s.page);
    const was = Object.keys(partial.segments).filter((k) => partial.segments[k]).sort();
    const next = await s.page.evaluate(() => { const a = nextAction(); return { kind: a.kind, l: a.l?.id, key: a.key }; });
    check('S2', 'Work already done is kept: same completed steps, and the started lesson continues first today', JSON.stringify(r.segs) === JSON.stringify(was) && was.length > 0 && r.layout[2].ls[0] === was[0].split(':')[1] + '@1' && next.l === was[0].split(':')[1], { was, now: r.segs, first: r.layout[2].ls[0], next, moved: r.moved });
    // S4: undo → original order and carryover labels; the choice survives a reload; spread again on request
    await s.page.evaluate(() => document.querySelector('[data-v14-spread="inorder"]').click()); await s.page.waitForTimeout(400);
    const u = await snap(s.page);
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(1000);
    const u2 = await snap(s.page);
    check('S4', '"Keep the original order instead" restores every lesson to its own day and the carryover label; progress kept; choice survives reload', u.day === 1 && u.policy === 'inorder' && JSON.stringify(u.layout) === JSON.stringify(pristine) && /2 DAYS CARRYOVER/.test(u.chip) && JSON.stringify(u.segs) === JSON.stringify(r.segs) && u2.day === 1 && u2.policy === 'inorder' && u2.spreads === 0, { chip: u.chip, day: u.day, reload: { day: u2.day, chip: u2.chip } });
    const hasOffer = await s.page.evaluate(() => !!document.querySelector('[data-v14-spread="spread"]'));
    await s.page.evaluate(() => document.querySelector('[data-v14-spread="spread"]')?.click()); await s.page.waitForTimeout(400);
    const again = await snap(s.page);
    check('S4b', 'The carryover banner offers the spread; choosing it spreads again from today', hasOffer && again.day === 3 && again.policy === 'spread' && again.spreads === 1 && JSON.stringify(again.segs) === JSON.stringify(r.segs), { hasOffer, day: again.day, chip: again.chip });
    // S5: when every lesson that came from Mon 21 is complete, Mon 21 counts as done
    const settled = await s.page.evaluate(() => { for (const d of C.days) for (const l of d.lessons) if (l._from === 1) l.segments.forEach((_, i) => (S.segments[segmentKey(d, l, i)] = true)); render(); return S.doneDays.slice(); });
    check('S5', 'A spread-out day counts as done once all of its lessons are done (Mon 21 yes, Tue 22 not yet)', settled.includes(1) && !settled.includes(2), settled);
    check('S5b', 'No page errors across undo/redo', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── S6: an answered question on screen at midnight is never yanked; the spread waits for "next" ──
  {
    const s = await open({ time: '2026-09-21T23:58:00+03:00', state: JSON.parse(JSON.stringify(partial)), settle: 1000 });
    const { page } = s;
    for (let i = 0; i < 12; i++) { const k = await page.evaluate(() => nextAction().seg?.type); if (k === 'question') break; await page.evaluate((sel) => document.querySelector(sel)?.click(), NEXT); await page.waitForTimeout(160); }
    const q = await page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return { id: qq.id, key: qq.answerKeys[0], lesson: a.l.id }; });
    await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(200);
    await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]').click(), q.key); await page.waitForTimeout(400);
    await page.clock.runFor(4 * 60 * 1000); await page.waitForTimeout(400);
    const mid = await page.evaluate(() => ({ day: S.day, finish: !!document.querySelector('[data-act="finish-qbank"]'), chip: document.querySelector('#v14Calendar')?.textContent }));
    await page.evaluate(() => document.querySelector('[data-act="finish-qbank"]')?.click()); await page.waitForTimeout(500);
    // the lesson's next question step may follow; the spread waits until no question is on screen
    const between = await page.evaluate(() => ({ day: S.day, q: nextAction().seg?.type }));
    for (let i = 0; i < 3; i++) {
      const k = await page.evaluate(() => (nextAction().kind === 'SEGMENT' && nextAction().seg?.type === 'question' ? 1 : 0));
      if (!k) break;
      await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(200);
      await page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); document.querySelector('[data-act="qbank-choice"][data-choice="' + qq.answerKeys[0] + '"]')?.click(); }); await page.waitForTimeout(400);
      await page.evaluate(() => document.querySelector('[data-act="finish-qbank"]')?.click()); await page.waitForTimeout(400);
    }
    const after = await page.evaluate((id) => ({ day: S.day, rec: !!S.qbank.results[id], chip: document.querySelector('#v14Calendar')?.textContent }), q.id);
    check('S6', 'Midnight with a question on screen: the answer screen stays; the spread happens at the next non-question step', mid.day === 1 && mid.finish && (between.q !== 'question' || between.day === 1) && after.day === 2 && after.rec && /^TODAY · TUE 22 SEP · \+\d+ FROM MON 21$/.test(after.chip), { mid, between, after });
    check('S6b', 'No page errors across midnight', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── S9: five days missed, opened on Sat 26 Sep (a review day) ──
  {
    const s = await open({ time: '2026-09-26T09:00:00+03:00', state: JSON.parse(JSON.stringify(partial)), settle: 1200 });
    const r = await snap(s.page);
    const all = (lay) => lay.flatMap((d) => d.ls).sort();
    check('S9', 'Five days behind on a Saturday: today teaches the missed lessons instead of reviewing nothing; nothing lost across the course', r.day === 6 && r.layout[5].mode === 'TEACHING' && r.layout[5].ls.length > 0 && /Today was a review day/.test(r.banner) && JSON.stringify(all(r.layout)) === JSON.stringify(all(pristine)) && r.layout[6].mode === 'CONTINUITY', { day: r.day, sat: r.layout[5], chip: r.chip });
    check('S9b', 'No page errors after a multi-day gap', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── S11: a Mon 21 lesson answered on Thu 24 keeps its question pinned (no swap after answering) ──
  {
    const s = await open({ time: '2026-09-24T10:00:00+03:00', state: null, settle: 1200 });
    const { page } = s;
    // finish everything before Neurons and synapses (from Mon 21) on today's list
    const setup = await page.evaluate(() => {
      const d = C.days[S.day - 1];
      for (const l of d.lessons) { if (l.id === 'T004') break; l.segments.forEach((_, i) => (S.segments[segmentKey(d, l, i)] = true)); }
      save(); render();
      const a = nextAction(); return { day: S.day, l: a.l?.id, from: a.l?._from };
    });
    for (let i = 0; i < 12; i++) { const k = await page.evaluate(() => nextAction().seg?.type); if (k === 'question') break; await page.evaluate((sel) => document.querySelector(sel)?.click(), NEXT); await page.waitForTimeout(160); }
    const q = await page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return { id: qq.id, key: qq.answerKeys[0], l: a.l.id, from: a.l._from }; });
    await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(200);
    await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]').click(), q.key); await page.waitForTimeout(400);
    await page.evaluate(() => render()); await page.waitForTimeout(300);
    const after = await page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return { id: qq.id, pins: Object.keys(S.v14.pins) }; });
    check('S11', 'A lesson moved from Mon 21 and answered on a later day keeps its question pinned (the answer screen never swaps items)', setup.l === 'T004' && setup.from === 1 && q.l === 'T004' && after.id === q.id && after.pins.some((k) => k.startsWith('1:T004:')), { setup, q, after });
    check('S11b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── S10: phone layout with the spread banner ──
  {
    const s = await open({ time: '2026-09-23T10:00:00+03:00', state: null, settle: 1200, viewport: { width: 390, height: 844 }, touch: true });
    const r = await s.page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, btn: document.querySelector('[data-v14-spread]')?.getBoundingClientRect().height || 0, small: [...document.querySelectorAll('#player button')].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim().slice(0, 30)) }));
    check('S10', '390 px: no horizontal overflow with the spread banner; its button and all player buttons ≥ 44 px', r.sw <= r.iw + 1 && r.btn >= 44 && r.small.length === 0, r);
    await s.close();
  }

  const pass = results.filter((r) => r.ok).length;
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'out', 'spread_test.json'), JSON.stringify({ pass, total: results.length, results, freshLayout: fresh && fresh.layout.slice(0, 8) }, null, 1));
  console.log('\n' + pass + '/' + results.length + ' spread checks passed (' + Math.round((Date.now() - t0) / 1000) + 's)');
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
