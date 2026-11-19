// v24 exam plan: the whole course to GIT MCQ 30 Dec, GIT written 5 Jan, CNS written 12 Jan, on the real app.
// P1 the calendar: three exams, Fridays off, mocks on four Saturdays oldest→newest paper, a light day before each exam,
//    every study day has steps, every GIT unit fits at 60 min · P2 a 30-minute budget cuts steps, never adds minutes
// P3 today's list: Start runs the step (reviews), ticking it moves ▶ Today to the next step
// P4 a mock step opens the paper as an AI-off mock · P5 a marked essay saves as a one-page sheet the light day opens
// P6 forgetting forecast per exam · P7 a Friday is a day off · P8 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-21T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const body = JSON.parse(r.request().postData() || '{}'); sent.push(body);
    if (!body.stream) { const g = /written-exam examiner/.test(body.messages[0].content); return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: g ? '{"score":7,"missing":["x"],"good":["y"]}' : 'OK' } }] }) }); }
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' });
  });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); localStorage.removeItem('ix_day_v1'); });
  await tick(p, 600);
  const P1 = await p.evaluate(() => {
    const P = IX_PLAN.build(), D = P.days, get = (d) => D.find((x) => x.date === d);
    const mocks = D.filter((d) => d.steps.some((x) => x.kind === 'mock')).map((d) => [d.date, new Date(d.date).getDay(), d.steps.find((x) => x.kind === 'mock').src]);
    const fridays = D.filter((d) => new Date(d.date + 'T12:00').getDay() === 5);
    return { exams: D.filter((d) => d.exam).map((d) => d.date), mocks, offOk: fridays.every((d) => d.off || d.exam), empty: D.filter((d) => !d.off && !d.exam && d.steps.length < 2).map((d) => d.date), fit: P.unitsFit, all: P.unitsAll,
      light: ['2026-12-29', '2027-01-04', '2027-01-11'].map((d) => (get(d) || {}).title || ''), first: (get('2026-11-18') || {}).title };
  });
  check('P1', 'The calendar: 3 exams, Fridays off, full papers only after the lectures (19, 26, 28 Dec, oldest→newest), light days, every GIT unit fits',
    P1.exams.join() === '2026-12-30,2027-01-05,2027-01-12' && P1.mocks.length === 3 && P1.mocks.every((m) => m[0] >= '2026-12-19') && /195/.test(P1.mocks[0][2]) && /198/.test(P1.mocks[2][2]) && P1.offOk && !P1.empty.length && P1.fit === P1.all && P1.light.every((t) => /Light/.test(t)), P1);
  const P2 = await p.evaluate(() => { localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 30, stop: '23:59', off: 5 })); const D = IX_PLAN.build().days.filter((d) => d.phase === 'GIT MCQ' && d.steps.some((x) => x.unit)); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); return { max: Math.max(...D.map((d) => d.steps.reduce((t, x) => t + x.min, 0))), written: D.some((d) => d.steps.some((x) => x.kind === 'written')) }; });
  check('P2', 'A 30-minute budget cuts steps (no written, no teaching on unit days), never adds minutes', P2.max <= 30 && !P2.written, P2);
  // P10 the timetable: every unit comes after its first lecture, and after its last unless it says so
  const P10 = await p.evaluate(() => {
    const P = IX_PLAN.build(), bad = [];
    P.days.forEach((d) => d.steps.filter((x) => x.kind === 'learn').forEach((x) => { const sp = IX_PLAN.span()[x.unit]; if (!sp) return; if (d.date <= sp.first) bad.push(d.date + ' before ' + x.unit); else if (d.date <= sp.last && !/still running/.test(d.title)) bad.push(d.date + ' early ' + x.unit); }));
    const lec = P.days.find((d) => d.date === '2026-11-22');
    return { bad, checks: P.days.filter((d) => /Weekly check/.test(d.title || '')).map((d) => d.date), lec: lec && lec.lectures.length, notes: lec && lec.steps.some((x) => x.kind === 'notes') };
  });
  check('P10', 'The IPKA timetable: units follow their lectures; weekly AI-off checks on Saturdays; lecture days carry a 2-minute notes step', !P10.bad.length && P10.checks.join() === '2026-11-28,2026-12-05,2026-12-12' && P10.lec === 3 && P10.notes, P10);
  // P3
  await p.evaluate(() => IX_PLAN.open()); await tick(p, 400);
  const page = await p.evaluate(() => ({ h: document.querySelector('.ixPlan h3').innerText, steps: [...document.querySelectorAll('.ixPlan .ixPstep b')].map((b) => b.innerText) }));
  let n = sent.length;
  await p.click('.ixPlan .ixPstep >> nth=0 >> [data-go]'); await tick(p, 900);
  const lbl0 = await p.evaluate(() => document.querySelector('.ixT.on') ? 'Reviews started' : '');
  await p.evaluate(() => IX_PLAN.open()); await tick(p, 300);
  await p.check('.ixPlan .ixPstep >> nth=0 >> input'); await tick(p, 400);
  await p.evaluate(() => IX_PLAN.close()); await p.evaluate(() => render()); await tick(p, 900);
  const lbl1 = await p.evaluate(() => (document.querySelector('#player .ixZgo') || {}).innerText || '');
  check('P3', "Today's list: Start runs reviews; ticking the step moves the home's ▶ Next step to the next one", /Today/.test(page.h) && /Oesophagus and stomach/.test(page.h) && page.steps.length === 4 && /Reviews/.test(lbl0) && /Oesophagus and stomach/.test(lbl1), { h: page.h, lbl0, lbl1 });
  // P4 mock step (the first Saturday)
  const mockOk = await p.evaluate(() => { const d = IX_PLAN.build().days.find((x) => x.steps.some((y) => y.kind === 'mock')); IX_PLAN.runStep(d.steps.find((y) => y.kind === 'mock')); return document.documentElement.classList.contains('ixHmock') && !!document.querySelector('.ixHoff'); });
  n = sent.length; await p.evaluate(() => IX_TUTOR.ask('answer?', null)); await tick(p, 300);
  check('P4', 'A mock step opens the paper as an AI-off mock (nothing sent)', mockOk && sent.length === n, { mockOk });
  await p.evaluate(() => { IX_GIT.close(); });
  // P5 sheets
  await p.evaluate(() => IX_TUTOR.openEssay('Describe the boundaries of the inguinal canal')); await tick(p, 300);
  await p.fill('#ixTea', 'Anterior wall: external oblique aponeurosis… posterior wall: fascia transversalis and conjoint tendon…');
  await p.click('#ixTego'); await tick(p, 1500);
  await p.click('#ixTsheetSave'); await tick(p, 200);
  await p.evaluate(() => { document.querySelector('.ixTsheet [data-x]').click(); IX_TUTOR.close(); IX_PLAN.openSheets(); }); await tick(p, 300);
  const sh = await p.evaluate(() => document.querySelector('.ixPlan .ixHbody').innerText);
  check('P5', 'A marked essay saves as a one-page sheet, with its mark, and the sheets page shows it', /inguinal canal/i.test(sh) && /marked 7\/10/.test(sh), { sh: sh.slice(0, 120) });
  // P6 forecast
  const fc = await p.evaluate(() => IX_PLAN.forecast());
  check('P6', 'Forgetting forecast per exam', fc.length === 3 && fc.every((f) => Number.isFinite(f.cards) && Number.isFinite(f.misses)), fc);
  // P7 a Friday
  const fri = await p.evaluate(() => IX_PLAN.build().days.find((d) => d.date === '2026-11-27'));
  check('P7', 'A Friday is a day off with no steps', fri && fri.off && !fri.steps.length, { fri: fri && fri.off });
  check('P8', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  {
    const s2 = await open({ v16: true, time: '2026-11-18T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
    const r = await s2.page.evaluate(() => { localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); IX_PLAN.open(); const P = IX_PLAN.build(); return { first: P.days[0].date, next: IX_PLAN.nextStep(), txt: document.querySelector('.ixPlan .ixHbody').innerText.slice(0, 220) }; });
    check('P9', 'Before Saturday 21 Nov the plan waits: it starts on the 21st and ▶ Today asks for nothing', r.first === '2026-11-21' && r.next === null && /starts on Saturday 21 November/.test(r.txt), r);
    await s2.close();
  }
  console.log(fails ? fails + ' FAILED' : '10/10 PLAN checks passed');
  process.exit(fails ? 1 : 0);
})();
