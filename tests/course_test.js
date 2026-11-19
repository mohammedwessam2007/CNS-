// v28 the course runs itself: pacing, the full map, drawings.
// C1 missed steps from earlier days come first today, oldest first, within the minutes; the rest moves to tomorrow
// C2 a step that was started is not carried again · C3 the full map: every day to 14 Jan (practical revision) with its status; a day opens
//    and can be read ahead · C4 the Map button and the side-rail days open the map / the day
// C5 drawings: Gray's plates in a unit's high-yield sheet and after a GIT MCQ · C6 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-23T09:00:00+02:00', state: null, settle: 3000, viewport: { width: 1180, height: 900 } });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.evaluate(() => { localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); render(); });
  await tick(p, 800);
  const c1 = await p.evaluate(() => { const { day } = IX_PLAN.today(); return { date: day.date, labels: day.steps.map((x) => x.label.slice(0, 60)), total: day.steps.reduce((t, x) => t + x.min, 0), behind: day.behind, moved: (day.moved || []).length }; });
  const firstCarry = c1.labels.findIndex((l) => /^↩ from Sat 21 Nov/.test(l)), ownIdx = c1.labels.findIndex((l) => /Small and large intestine/.test(l) && !/^↩/.test(l));
  check('C1', 'Missed steps (21-22 Nov) come first on 23 Nov, oldest first, within 60 min; what does not fit moves to tomorrow', c1.date === '2026-11-23' && c1.behind >= 4 && firstCarry > 0 && (ownIdx === -1 || ownIdx > firstCarry) && c1.total <= 60 && c1.moved > 0, c1);
  // C2 start the carried steps of 21 Nov: they stop being carried
  const c2 = await p.evaluate(() => { const st = IX_PLAN.state(), P = IX_PLAN.build(); P.days.find((d) => d.date === '2026-11-21').steps.forEach((x) => { st.done[x.id] = 'started'; }); const { day } = IX_PLAN.today(); return { carried21: day.steps.filter((x) => /from Sat 21 Nov/.test(x.label)).length, carried22: day.steps.filter((x) => /from Sun 22 Nov/.test(x.label)).length }; });
  check('C2', 'Steps that were started are not carried again; the next missed day moves up', c2.carried21 === 0 && c2.carried22 >= 1, c2);
  // C3 map
  await p.evaluate(() => IX_PLAN.openMap()); await tick(p, 300);
  const c3 = await p.evaluate(() => ({ days: document.querySelectorAll('.ixPday').length, today: document.querySelectorAll('.ixPday.today').length, behind: document.querySelectorAll('.ixPday.behind, .ixPday.part').length, exams: document.querySelectorAll('.ixPday.exam').length, off: document.querySelectorAll('.ixPday.off').length }));
  await p.click('.ixPday[data-day="2026-12-02"]'); await tick(p, 300);
  const c3b = await p.evaluate(() => ({ h: document.querySelector('.ixPlan h3').innerText, steps: document.querySelectorAll('.ixPlan .ixPstep').length, ahead: /Reading ahead/.test(document.querySelector('.ixPlan .ixHbody').innerText) }));
  check('C3', 'The full map: every day 21 Nov - 14 Jan with its status (today, carried, off, 3 exams); a future day opens to read ahead', c3.days === 55 && c3.today === 1 && c3.behind >= 1 && c3.exams === 3 && c3.off >= 7 && /2 Dec/.test(c3b.h) && c3b.steps >= 4 && c3b.ahead, { c3, c3b });
  await p.evaluate(() => IX_PLAN.close());
  // C4 doors
  await p.click('.ixXMenu [data-xm="map"]'); await tick(p, 300);
  const c4a = await p.evaluate(() => document.querySelectorAll('.ixPlan.on .ixPday').length);
  await p.evaluate(() => IX_PLAN.close());
  await p.click('.ixXRd[data-xday="2026-11-24"]'); await tick(p, 300);
  const c4b = await p.evaluate(() => (document.querySelector('.ixPlan.on h3') || {}).innerText || '');
  check('C4', 'The Map button opens the map; a day in the side rail opens that day', c4a === 55 && /24 Nov/.test(c4b), { c4a, c4b });
  await p.evaluate(() => IX_PLAN.close());
  // C5 drawings
  await p.evaluate(() => IX_HY.open('A:Kidney, ureter and suprarenal glands')); await tick(p, 400);
  const c5a = await p.evaluate(() => [...document.querySelectorAll('.ixY .ixYfig img')].map((i) => i.getAttribute('src')));
  const c5cap = await p.evaluate(() => (document.querySelector('.ixY .ixYfig figcaption') || {}).innerText || '');
  await p.evaluate(() => IX_HY.close());
  await p.evaluate(() => { const q = IX_GIT206.mcq.find((x) => x.chapter === 'Stomach' && x.answerKeys.length); IX_GIT.startCustom('t', (x) => x.id === q.id, 1); }); await tick(p, 300);
  await p.click('.ixHopt >> nth=0'); await tick(p, 400);
  const c5b = await p.evaluate(() => (document.querySelector('.ixHfb .ixYfig img') || {}).src || '');
  check('C5', "Drawings: Gray's plates (Wikimedia, public domain) in the unit's sheet with captions, and after a GIT MCQ", c5a.length >= 4 && c5a.every((u) => /^https:\/\/upload\.wikimedia\.org\//.test(u)) && /kidney/i.test(c5cap) && /upload\.wikimedia\.org.*Gray10(46|47|50|52)\.png/.test(c5b), { n: c5a.length, c5cap: c5cap.slice(0, 60), c5b: c5b.slice(-14) });
  check('C6', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '6/6 COURSE checks passed');
  process.exit(fails ? 1 : 0);
})();
