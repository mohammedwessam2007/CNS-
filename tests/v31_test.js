// v31 the course: L1 every DIG-206 lecture of the timetable is a lesson, every unit has at least one · L2 the plan teaches
// a unit's lessons on its day, inside the minutes, and no lecture needs attending · L3 the lesson prompt is understanding-
// first (why, mechanism, a reasoning question per part) and grounded in the unit's past papers and references
// L4 one part at a time: Next / Back, 🤔 answers hidden, Explain it another way asks the professor about that part
// L5 ✓ I understand it marks it done and points to the next lesson · L6 the session's lesson step opens the lesson
// L7 📚 The course lists all lessons, from the home · L8 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const LESSON = '## 1. Why you should care\nA man with a **hernia**.\n> 🤔 Think: why does it bulge on coughing? ||Raised pressure pushes through the weak spot||\n## 2. The big picture\nThree flat muscles.\n✏️ Draw this:\n1. Draw the rectus\n## 3. Rectus sheath\nIt is formed by the aponeuroses because…\n> 🤔 Think: why is there an arcuate line? ||Below it all aponeuroses pass in front||\n## Where people get confused\n- Arcuate line vs linea semilunaris\n## Say it back\n1. Three flat muscles';
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => { const b = JSON.parse(r.request().postData() || '{}'); sent.push(b); if (!b.stream) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: LESSON } }], usage: { cost: 0.04 } }) }); return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' }); });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); localStorage.removeItem('ix_lesson_v1'); localStorage.removeItem('ix_lesson_done_v1'); localStorage.removeItem('ix_session_v1'); render(); });
  await tick(p, 500);
  const l1 = await p.evaluate(() => { const lec = IX_PLAN.lectures.filter((l) => l[1] !== 'College'), all = IX_LESSON.all(), titles = all.map((x) => x.title); return { lec: lec.length, missing: lec.filter((l) => !titles.includes(l[2])).map((l) => l[2]), units: IX_LESSON.course().filter((c) => !c.lessons.length).length, n: all.length }; });
  check('L1', 'Every DIG-206 lecture on the timetable is a lesson; every unit has one', l1.missing.length === 0 && l1.units === 0 && l1.n >= l1.lec, l1);
  const l2 = await p.evaluate(() => { const P = IX_PLAN.build(), days = P.days.filter((d) => d.phase === 'GIT MCQ' && !d.off && !d.exam), taught = new Set(); let over = 0; days.forEach((d) => { d.steps.forEach((x) => x.kind === 'lesson' && taught.add(x.key)); if (!d.steps.some((x) => x.kind === 'mock') && d.steps.reduce((t, x) => t + x.min, 0) > P.mins + 5) over++; }); const all = IX_LESSON.all().map((l) => l.key); const fitUnits = new Set([].concat(...days.map((d) => d.steps.filter((x) => x.kind === 'lesson').map((x) => x.unit)))); return { taught: taught.size, all: all.length, missing: IX_LESSON.all().filter((l) => !taught.has(l.key) && fitUnits.has(l.unit)).map((l) => l.title), over, first: (P.days.find((d) => d.date === '2026-11-22') || { steps: [] }).steps.map((x) => x.kind), attend: days.some((d) => d.steps.some((x) => /Attend/.test(x.label))) }; });
  check('L2', "The plan teaches every lesson of each unit on that unit's day, inside the minutes; no lecture to attend", l2.missing.length === 0 && l2.taught >= l2.all - 6 && l2.over === 0 && l2.first.includes('lesson') && !l2.attend, l2);
  const key = await p.evaluate(() => IX_LESSON.lessonsOf('A:Anterior abdominal wall')[0].key);
  await p.evaluate((k) => { delete IX_LESSON_TEXT[k]; IX_LESSON.open(k); }, key); await tick(p, 300);
  let n = sent.length; await p.click('#ixLgen'); await tick(p, 1200);
  const req = sent[n], sys = req ? req.messages[0].content : '', usr = req ? req.messages[1].content : '';
  check('L3', 'Understanding first (replaces the lecture, mechanism, a reasoning question per part), grounded in past papers + references', req && req.model === 'google/gemini-3.8-flash' && /REPLACES the lecture/.test(sys) && /UNDERSTAND/.test(sys) && /MECHANISM/.test(sys) && /🤔 Think/.test(sys) && /LECTURE TO TEACH/.test(usr) && /PAST-PAPER FACTS/.test(usr) && /EXAMINERS|examiner/i.test(usr), { model: req && req.model, len: usr.length });
  const l4a = await p.evaluate(() => ({ part: document.querySelector('.ixLpart small').textContent, h: document.querySelector('.ixLpart h2').textContent, spoil: !!document.querySelector('.ixLmd .ixYspoil'), dots: document.querySelectorAll('.ixLprog i').length }));
  await p.click('.ixL [data-a="next"]'); await tick(p, 200);
  const l4b = await p.evaluate(() => document.querySelector('.ixLpart h2').textContent);
  n = sent.length; await p.click('.ixL [data-a="simple"]'); await tick(p, 900);
  const ask = sent.slice(n).find((b) => b.stream), askTxt = ask ? JSON.stringify(ask.messages) : '';
  check('L4', 'One part at a time; answers hidden; Explain it another way asks the professor about that part', /Part 1 of (5|6|7)/.test(l4a.part) && /Why you should care/.test(l4a.h) && l4a.spoil && l4a.dots >= 5 /* v38 adds a worked case and a brain dump */ && /big picture/i.test(l4b) && /did not get this part/.test(askTxt) && /The big picture/.test(askTxt), { l4a, l4b });
  await p.evaluate(() => IX_TUTOR.close());
  for (let i = 0; i < 6; i++) { const nx = await p.$('.ixL [data-a="next"]'); if (!nx) break; await nx.click(); await tick(p, 100); }
  await p.click('.ixL [data-a="finish"]'); await tick(p, 300);
  const l5 = await p.evaluate((k) => ({ done: IX_LESSON.isDone(k), ok: (document.querySelector('.ixLok') || {}).textContent, next: (document.querySelector('.ixLnav .ixLmain') || {}).textContent }), key);
  check('L5', '✓ I understand it marks it done and points to the next lesson of the unit', l5.done && /Lesson done/.test(l5.ok) && /▶/.test(l5.next), l5);
  await p.evaluate(() => IX_LESSON.close());
  // L6 the session
  await p.evaluate(() => { const d = IX_PLAN.today().day, s = d.steps.find((x) => x.kind === 'lesson'); IX_PLAN.runStep(s); }); await tick(p, 400);
  const l6 = await p.evaluate(() => ({ on: document.querySelector('.ixL').classList.contains('on'), t: document.getElementById('ixLtitle').textContent }));
  check('L6', "A plan's lesson step opens that lesson", l6.on && l6.t.length > 5, l6);
  await p.evaluate(() => IX_LESSON.close()); await tick(p, 200);
  await p.evaluate(() => { const t = document.querySelector('details.ixCtool'); if (t) t.open = true; });   // v42: tools are in the Toolbox
  await p.click('.ixZbtns [data-course]'); await tick(p, 300);
  const l7 = await p.evaluate(() => ({ rows: document.querySelectorAll('.ixLrow').length, done: document.querySelectorAll('.ixLrow.done').length, all: !!document.getElementById('ixLall'), sub: document.getElementById('ixLsub').textContent }));
  check('L7', '📚 The course (from the home) lists every lesson with its state; all are built in, so nothing is left to write', l7.rows >= 40 && l7.done === 1 && !l7.all && /1 of \d+ done/.test(l7.sub), l7);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  check('L8', 'No page errors; nothing scrolls sideways', errs.length === 0 && wide, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
