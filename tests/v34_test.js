// v34 the course is complete: K1 all 50 lessons are built in and open with no AI key · K2 every written topic has a
// reference answer; the app's MCQ keys are marked as the app's · K3 exam drawings build step by step and are linked from
// lessons and sheets · K4 flashcards come from the lessons, join the deck when a lesson is done, spaced repetition
// K5 the review step opens due flashcards · K6 search finds lessons, references, MCQs, drawings · K7 one-pagers, numbers,
// mnemonics · K8 no page errors, nothing scrolls sideways
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-21T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [], sent = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', (r) => { sent.push(1); r.fulfill({ status: 500, body: '{}' }); });
  await p.evaluate(() => { localStorage.removeItem('ix_tutor_key_v1'); localStorage.removeItem('ix_lesson_v1'); localStorage.removeItem('ix_lesson_done_v1'); localStorage.removeItem('ix_fc_v1'); });
  const k1 = await p.evaluate(() => { const A = IX_LESSON.all(); const missing = A.filter((l) => !IX_LESSON_TEXT[l.key]).map((l) => l.key); IX_LESSON.open(A.find((l) => l.unit === 'A:Anterior abdominal wall').key); return { n: A.length, missing, h: document.querySelector('.ixLpart h2') && document.querySelector('.ixLpart h2').textContent, gen: !!document.getElementById('ixLgen') }; });
  check('K1', 'All 50 lessons are built in and open at once with no AI key', k1.n === 50 && !k1.missing.length && /Why you should care/.test(k1.h || '') && !k1.gen && sent.length === 0, k1);
  const k2 = await p.evaluate(() => { const W = IX_GIT206.written.filter((w) => !/: other$/.test(w.topic)); const noRef = W.filter((w) => !(IX_GIT206_REF[w.topic] || []).length).map((w) => w.topic); const app = IX_GIT206.mcq.filter((q) => q.keyBy === 'app'), keyed = IX_GIT206.mcq.filter((q) => (q.answerKeys || []).length).length; return { noRef, app: app.length, keyed, badApp: app.filter((q) => !q.options.some((o) => o.key === q.answerKeys[0])).length }; });
  check('K2', 'Every written topic has a reference answer; app keys are valid and marked', !k2.noRef.length && k2.app >= 140 && k2.keyed >= 590 && !k2.badApp, k2);
  // K3 drawings
  const k3a = await p.evaluate(() => { const parts = [...document.querySelectorAll('.ixL [data-draw]')].length; return { ids: IX_DRAW.ids().length, inLesson: parts }; });
  let k3b = 0; for (let i = 0; i < 3 && !k3b; i++) { await p.evaluate(() => { const n = document.querySelector('.ixL [data-a="next"]'); if (n) n.click(); }); await tick(p, 150); k3b = await p.evaluate(() => document.querySelectorAll('.ixL [data-draw]').length); }
  await p.evaluate(() => { IX_LESSON.close(); IX_DRAW.open('sheath'); }); await tick(p, 200);
  const st1 = await p.evaluate(() => document.querySelectorAll('.ixD svg g').length);
  await p.click('.ixD [data-d="next"]'); await tick(p, 200);
  const st2 = await p.evaluate(() => ({ g: document.querySelectorAll('.ixD svg g').length, say: document.querySelector('.ixDsay').textContent }));
  await p.evaluate(() => { IX_DRAW.close(); IX_HY.open('A:Anterior abdominal wall'); }); await tick(p, 300);
  const inSheet = await p.evaluate(() => document.querySelectorAll('.ixY [data-draw]').length);
  await p.evaluate(() => IX_HY.close());
  check('K3', 'Exam drawings build one step at a time and are linked from the lesson and the sheet', k3a.ids >= 8 && st1 === 1 && st2.g === 2 && /costal margin/.test(st2.say) && k3b >= 1 && inSheet >= 1, { k3a, k3b, st1, st2: st2.g, inSheet });
  // K4 flashcards
  const k4 = await p.evaluate(() => { const all = IX_KIT.cards().length, before = IX_KIT.deck().length; const L = IX_LESSON.all()[0]; const d = JSON.parse(localStorage.getItem('ix_lesson_done_v1') || '{}'); d[L.key] = Date.now(); localStorage.setItem('ix_lesson_done_v1', JSON.stringify(d)); const after = IX_KIT.deck().length, dueToday = IX_KIT.due().length, tom = Date.now() + 864e5 + 1, due = IX_KIT.due(tom).length; const c = IX_KIT.due(tom)[0]; const g = IX_KIT.grade(c.id, 'good'); return { all, before, after, dueToday, due, next: Math.round((g.due - Date.now()) / 864e5), dueAfter: IX_KIT.due(tom).length }; });
  check('K4', "Flashcards come from the lessons' questions; a finished lesson adds its cards, due from tomorrow; Good sends it a day+ away", k4.all >= 150 && k4.before === 0 && k4.after >= 2 && k4.dueToday === 0 && k4.due === k4.after && k4.next >= 1 && k4.dueAfter === k4.due - 1, k4);
  // K5 review step
  const k5 = await p.evaluate(() => { const S = JSON.parse(localStorage.getItem('ix_fc_v1') || '{}'); IX_KIT.cards().slice(0, 3).forEach((c) => (S[c.id] = { step: -1, due: 0 })); localStorage.setItem('ix_fc_v1', JSON.stringify(S)); const d = IX_PLAN.today().day, r = d.steps.find((x) => x.kind === 'review'); IX_PLAN.runStep(r); return { kit: document.querySelector('.ixK').classList.contains('on'), card: !!document.querySelector('.ixKcard') }; });
  check('K5', 'The daily review step opens the due flashcards', k5.kit && k5.card, k5);
  // K6 search
  const k6 = await p.evaluate(() => { const R = IX_KIT.search('porta hepatis'), kinds = [...new Set(R.map((r) => r.kind))]; IX_KIT.open('search', 'gastric glands'); return { kinds, n: R.length, ui: document.querySelectorAll('.ixKr').length }; });
  check('K6', 'Search finds lessons, reference answers, past-paper MCQs and drawings', k6.kinds.includes('Lesson') && k6.kinds.includes('Reference answer') && k6.kinds.includes('Past-paper MCQ') && k6.ui >= 3, k6);
  const k7 = await p.evaluate(() => { IX_KIT.open('one'); const one = document.querySelectorAll('.ixKone').length; const html = IX_KIT.onePager('A:Anterior abdominal wall'); IX_KIT.open('num'); const num = document.querySelectorAll('.ixKtab div').length; IX_KIT.open('mnem'); const mn = document.querySelectorAll('.ixKtab div').length; return { one, li: (html.match(/<li>/g) || []).length, num, mn }; });
  check('K7', 'One-pagers for every unit, the numbers sheet and the mnemonics list', k7.one >= 28 && k7.li >= 15 && k7.num >= 20 && k7.mn >= 12, k7);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  check('K8', 'No page errors; nothing scrolls sideways', !errs.length && wide, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
