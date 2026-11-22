// v26 the exam plan is the home screen from 18 Nov to 12 Jan; the old CNS course stays one tap away.
// H1 on Sat 21 Nov the home shows the plan (title, countdowns, today's steps), no "Day 1/148" or catch-up banner
// H2 the 🗺️ Map buttons open the exam plan · H3 "Open the CNS course" shows the old course, "Back" returns
// H4 before the season (September) the old course is untouched · H5 the professor's prompt has its sections and
//    knows where he is in the plan · H6 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 3000, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [];
  await p.context().route('https://openrouter.ai/**', async (r) => { sent.push(JSON.parse(r.request().postData() || '{}')); return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' }); });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 60, stop: '23:59', off: 5 })); render(); });
  await tick(p, 1200);
  const h1 = await p.evaluate(() => ({ title: document.getElementById('title').innerText, eyebrow: document.getElementById('eyebrow').innerText, box: !!document.querySelector('#player .ixXHomeBox .ixPstep'), steps: document.querySelectorAll('#player .ixPstep').length, oldBanner: [...document.querySelectorAll('.v14Carryover')].some((e) => e.offsetParent !== null), rail: (document.querySelector('.ixMpRail') || {}).innerText }));
  check('H1', 'On Sat 21 Nov the home is the plan: today\'s unit, countdowns, steps; no old course banner', /Oesophagus and stomach/.test(h1.title) && /DAYS TO GIT MCQ/i.test(h1.eyebrow) && h1.box && h1.steps === 4 && !h1.oldBanner && !/148/.test(h1.eyebrow), h1);
  await p.click('.ixXMenu [data-xm="map"]'); await tick(p, 400);
  const h2 = await p.evaluate(() => ({ plan: !!document.querySelector('.ixPlan.on'), oldMap: !!document.querySelector('.ixMp.on, .ixMpOv.on') }));
  check('H2', 'The map buttons open the exam plan', h2.plan, h2);
  await p.evaluate(() => IX_PLAN.close());
  await p.evaluate(() => { const t = document.querySelector('details.ixCtool'); if (t) t.open = true; });   // v42: the tools live in one Toolbox
  await p.click('[data-xhome="lib"]'); await tick(p, 800);
  const h3 = await p.evaluate(() => ({ lib: document.querySelector('.ixY').classList.contains('on') && /lesson library/.test(document.getElementById('ixYt').textContent), home: document.documentElement.classList.contains('ixXHome'), box: !!document.querySelector('#player .ixXHomeBox'), oldCourse: !!document.querySelector('[data-xhome="cns"]') }));
  await p.evaluate(() => IX_HY.close());
  check('H3', 'The CNS MCQ course is gone from the home: 📖 opens the date-free lesson library and the plan stays home', h3.lib && h3.home && h3.box && !h3.oldCourse, h3);
  // H5 prompt
  await p.evaluate(() => IX_TUTOR.ask('hello', null)); await tick(p, 900);
  const sys = sent.length ? sent[sent.length - 1].messages[0].content : '';
  check('H5', "The professor's prompt has its sections and knows where he is in the plan", /# WHO YOU ARE/.test(sys) && /# HOW KASR AL AINY EXAMS WORK/.test(sys) && /WHERE HE IS IN THE PLAN: 2026-11-22 · GIT MCQ/.test(sys), { len: sys.length });
  await p.evaluate(() => IX_TUTOR.ask('teach me', 'loop')); await tick(p, 900);
  const last = sent[sent.length - 1], sys7 = last.messages[0].content;
  check('H7', 'Every call carries the examiner profile and the whole syllabus with his state; pro tasks go to the new professor model', /EXAMINER PROFILE/.test(sys7) && /HOW THESE EXAMINERS THINK/.test(sys7) && /THE SYLLABUS \(DIG-206 units/.test(sys7) && /Oesophagus and stomach: lectured/.test(sys7) && last.model === 'google/gemini-3.8-flash' && /Step n\/6/.test(sys7), { model: last.model, len: sys7.length });
  check('H6', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 3));
  await s.close();
  const s2 = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const h4 = await s2.page.evaluate(() => ({ home: document.documentElement.classList.contains('ixXHome'), eyebrow: document.getElementById('eyebrow').innerText }));
  check('H4', 'Before the season (September) the old course is untouched', !h4.home && /DAY \d+\/148/.test(h4.eyebrow), h4);
  await s2.close();
  console.log(fails ? fails + ' FAILED' : '7/7 HOME checks passed');
  process.exit(fails ? 1 : 0);
})();
