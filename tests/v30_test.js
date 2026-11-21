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
  await p.click('.ixZgo'); await tick(p, 900);
  const s1 = await p.evaluate(() => { const b = document.querySelector('.ixSbar'); return { screen: document.querySelector('.ixS').classList.contains('on'), overlay: !!document.querySelector('.ixY.on, .ixT.on, .ixH.on, .ixPlan.on, .ixL.on, .ixK.on'), bar: b.classList.contains('on'), txt: b.innerText, pct: !!b.querySelector('.ixSbP i'), z: +getComputedStyle(b).zIndex, open: IX_SESSION.state().open && IX_SESSION.state().open.id, cur: IX_SESSION.current().id }; });
  check('S1', "One tap on the home opens today's first item directly, with the course bar: progress, step, timer, Done · next", !s1.screen && s1.overlay && s1.bar && s1.pct && /step 1\/\d/i.test(s1.txt) && /\d:\d\d/.test(s1.txt) && /Done/.test(s1.txt) && s1.z > 100 && s1.open === s1.cur, s1);
  await p.click('.ixSbar [data-s="outline"]'); await tick(p, 300);
  const s2 = await p.evaluate(() => ({ items: document.querySelectorAll('.ixSout .ixSoutI').length, cur: document.querySelectorAll('.ixSout .ixSoutI.c').length, all: IX_SESSION.order().length }));
  check('S2', "☰ shows today's outline like a course: every item, the current one marked", s2.items === s2.all && s2.items >= 3 && s2.cur === 1, s2);
  await p.click('.ixSout [data-o]'); await tick(p, 200);
  const first = await p.evaluate(() => IX_SESSION.current().label);
  await p.click('.ixSbar [data-s="done"]'); await tick(p, 900);
  const s3 = await p.evaluate((first) => { const st = IX_PLAN.state().done, d = IX_PLAN.today().day; return { ticked: d.steps.filter((x) => st[x.id] === true).map((x) => x.label), first, screen: document.querySelector('.ixS').classList.contains('on'), bar: document.querySelector('.ixSbar').innerText, open: IX_SESSION.state().open && IX_SESSION.state().open.id, cur: IX_SESSION.current().id, overlay: !!document.querySelector('.ixY.on, .ixT.on, .ixH.on, .ixPlan.on, .ixL.on, .ixK.on') }; }, first);
  check('S3', '✓ Done ticks the item and opens the next one straight away (no screen in between)', s3.ticked.includes(first) && !s3.screen && /step 2\//i.test(s3.bar) && s3.open === s3.cur && s3.overlay, s3);
  await p.click('.ixSbar [data-s="outline"]'); await tick(p, 200);
  const target = await p.evaluate(() => { const L = [...document.querySelectorAll('.ixSout .ixSoutI:not(.d):not(.c)')]; const t = L[L.length - 1]; return t ? t.dataset.id : null; });
  if (target) await p.click('.ixSout [data-id="' + target + '"]'); await tick(p, 600);
  const s4 = await p.evaluate((t) => ({ open: IX_SESSION.state().open && IX_SESSION.state().open.id, t }), target);
  check('S4', 'Tapping an item in the outline jumps to it', !!target && s4.open === target, s4);
  await p.reload(); await tick(p, 3500);
  const s5 = await p.evaluate(() => ({ bar: document.querySelector('.ixSbar').classList.contains('on'), txt: document.querySelector('.ixSbar').innerText }));
  check('S5', 'Closing the app keeps the session: the bar is back after a reload', s5.bar && /Step/i.test(s5.txt), s5);
  // finish everything
  for (let i = 0; i < 8; i++) { const more = await p.evaluate(() => !!IX_SESSION.current()); if (!more) break; await p.evaluate(() => IX_SESSION.complete(IX_SESSION.current())); await tick(p, 300); }
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
