// v30.1 the daily session: S1 the home's big button opens one step at a time (step n of m, what to do, minutes)
// S2 ▶ Open it runs the step and a bar stays at the bottom over the sheet (step, timer, ✓ Done) · S3 ✓ Done ticks the
// plan and brings the next step · S4 Later today moves a step to the end · S5 the session survives a reload ·
// S6 the last step ends the day ("Done for today") · S7 the bar fits a phone · S8 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-21T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', (r) => r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' }));
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); localStorage.removeItem('ix_session_v1'); render(); });
  await tick(p, 600);
  await p.click('.ixZgo'); await tick(p, 400);
  const s1 = await p.evaluate(() => ({ on: document.querySelector('.ixS').classList.contains('on'), step: document.querySelector('.ixStop span').textContent, title: document.querySelector('.ixStitle').textContent, how: document.querySelectorAll('.ixShow li').length, dots: document.querySelectorAll('.ixSdots i').length }));
  check('S1', "The home's big button opens today's session: one step, what to do, its minutes", s1.on && /Step \d of \d/.test(s1.step) && s1.title.length > 5 && s1.how >= 2 && s1.dots >= 3, s1);
  const first = s1.title;
  await p.click('.ixS [data-s="open"]'); await tick(p, 800);
  const s2 = await p.evaluate(() => { const b = document.querySelector('.ixSbar'); return { screen: document.querySelector('.ixS').classList.contains('on'), bar: b.classList.contains('on'), txt: b.innerText, overlay: !!document.querySelector('.ixY.on, .ixT.on, .ixH.on, .ixPlan.on, .ixL.on'), z: +getComputedStyle(b).zIndex }; });
  check('S2', 'Open it runs the step; a bar stays on top of it: step, timer, ✓ Done', !s2.screen && s2.bar && s2.overlay && /Step \d\/\d/i.test(s2.txt) && /\d:\d\d/.test(s2.txt) && /Done/.test(s2.txt) && s2.z > 100, s2);
  await p.click('.ixSbar [data-s="done"]'); await tick(p, 500);
  const s3 = await p.evaluate((first) => { const P = IX_PLAN.today().day; const st = IX_PLAN.state().done; return { on: document.querySelector('.ixS').classList.contains('on'), title: (document.querySelector('.ixStitle') || {}).textContent, ticked: P.steps.filter((x) => st[x.id] === true).map((x) => x.label), first, dot: document.querySelectorAll('.ixSdots i.d').length, overlays: !!document.querySelector('.ixY.on, .ixT.on, .ixH.on, .ixL.on') }; }, first);
  check('S3', '✓ Done ticks the step in the plan, closes what was open and brings the next step', s3.on && s3.title !== first && s3.ticked.includes(first) && s3.dot >= 1 && !s3.overlays, s3);
  const before = s3.title;
  await p.click('.ixS [data-s="skip"]'); await tick(p, 300);
  const s4 = await p.evaluate(() => ({ title: document.querySelector('.ixStitle').textContent, last: IX_SESSION.order().slice(-1)[0].label }));
  check('S4', 'Later today moves the step to the end of the list', s4.title !== before && s4.last === before, s4);
  await p.click('.ixS [data-s="open"]'); await tick(p, 500);
  await p.reload(); await tick(p, 3500);
  const s5 = await p.evaluate(() => ({ bar: document.querySelector('.ixSbar').classList.contains('on'), txt: document.querySelector('.ixSbar').innerText }));
  check('S5', 'Closing the app keeps the session: the bar is back after a reload', s5.bar && /Step/i.test(s5.txt), s5);
  // finish everything
  for (let i = 0; i < 8; i++) { const more = await p.evaluate(() => !!IX_SESSION.current()); if (!more) break; await p.evaluate(() => { IX_SESSION.screen(); document.querySelector('.ixS [data-s="done"]').click(); }); await tick(p, 300); }
  const s6 = await p.evaluate(() => ({ txt: document.querySelector('.ixS').innerText, home: (document.querySelector('.ixZbarT') || {}).innerText }));
  check('S6', 'The last ✓ ends the day: "Done for today", the next study day, stop here', /Done for today/.test(s6.txt) && /Next study day/i.test(s6.txt), s6);
  await p.click('.ixS [data-s="close"]'); await tick(p, 400);
  const s6b = await p.evaluate(() => (document.querySelector('.ixZbarT') || {}).innerText || '');
  check('S6b', 'Back home the day shows as done', /Done for today/.test(s6b), { s6b });
  const s7 = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  check('S7', 'Nothing scrolls sideways on a phone', s7, {});
  check('S8', 'No page errors', errs.length === 0, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
