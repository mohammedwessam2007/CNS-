// v23 GIT 206 hub, on the real app with a fake OpenRouter.
// G1 the bank is sound (ids unique, every key is one of its options, written topics ranked)
// G2 the hub opens from the menu and the edge tab; solved papers stay out of practice until taken as a mock
// G3 practice: a sure-but-wrong answer is recorded (state, certainty, memory card); the professor gets the key and the choice
// G4 the hint before answering never carries the key
// G5 a past paper as a mock: AI off (nothing sent), result stored, paper joins practice, readiness appears
// G6 written: ranked topics; Model answer sends the real years; Write it opens the essay grader with the question
// G7 the unsolved paper: no official key, the professor is asked for HIS answer
// G8 the daily budget blocks a new round · G9 no page errors
// Usage: node tests/git206_test.js   (app on :8787, or APP_URL)
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };

(async () => {
  const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const body = JSON.parse(r.request().postData() || '{}'); sent.push(body);
    if (!body.stream) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: 'OK' } }] }) });
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'Because the mechanism…' } }] }) + '\n\ndata: [DONE]\n\n' });
  });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 })); ['ix_tutor_cards_v1', 'ix_tutor_calib_v1', 'ix_day_v1'].forEach((k) => localStorage.removeItem(k)); });
  await tick(p, 800);
  const sysOf = (b) => b.messages[0].content;

  // G1
  const g1 = await p.evaluate(() => {
    const B = window.IX_GIT206, ids = new Set(B.mcq.map((q) => q.id));
    const badKey = B.mcq.filter((q) => q.answerKeys.length && !q.answerKeys.every((k) => q.options.some((o) => o.key === k))).length;
    return { n: B.mcq.length, uniq: ids.size === B.mcq.length, badKey, keyed: B.mcq.filter((q) => q.answerKeys.length).length, written: B.written.length, top: B.written[0] && B.written[0].topic, sorted: B.written.every((w, i, a) => !i || a[i - 1].score >= w.score) };
  });
  check('G1', 'The GIT bank is sound: unique ids, every key is one of its options, written topics ranked', g1.n >= 400 && g1.uniq && g1.badKey === 0 && g1.written >= 40 && g1.sorted, g1);

  // G2
  const doors = await p.evaluate(() => ({ tab: !!document.getElementById('ixHtab'), menu: !!document.getElementById('gitBtn') }));
  await p.evaluate(() => (document.querySelector('#ixNav [data-xm=git]') || document.getElementById('ixHtab')).click());   // v44: in the course the bottom bar is the door await tick(p, 400);
  const g2 = await p.evaluate(() => ({ on: document.querySelector('.ixH').classList.contains('on'), chips: document.querySelectorAll('.ixHch').length, paperInPool: IX_GIT.practicePool().some((q) => IX_GIT.papers().includes(q.source)) }));
  check('G2', 'The hub opens from the menu and the edge tab; solved papers stay out of practice until taken as a mock', doors.tab && doors.menu && g2.on && g2.chips >= 10 && !g2.paperInPool, { doors, g2 });

  // G3 + G4
  await p.click('[data-run="mix"]'); await tick(p, 300);
  let n = sent.length;
  await p.click('#ixHbody .ixAiBar button'); await tick(p, 900);
  // v40: the professor's explanation is prefetched in the background (shown only after answering), so find the hint request itself
  const hintReq = sent.slice(n).find((r) => /NEVER say or hint/.test(sysOf(r))); const hintSys = hintReq ? sysOf(hintReq) : '';
  const shownEarly = await p.evaluate(() => !!document.querySelector('#ixAxHost, .ixAxOpts'));
  check('G4', 'The hint before answering carries the question, never the key', /QUESTION \(DIG-206/.test(hintSys) && !/\nKEY:/.test(hintSys) && /NEVER say or hint/.test(hintSys) && !shownEarly, { has: /QUESTION/.test(hintSys), shownEarly });
  const q1 = await p.evaluate(() => { const st = IX_GIT.state(); const q = IX_GIT206.mcq.find((x) => x.id === document.querySelector('.ixHq').dataset.qid); return { id: q.id, wrong: q.options.find((o) => !q.answerKeys.includes(o.key)).key }; });
  await p.click('[data-c="sure"]'); await p.click('.ixHopt[data-k="' + q1.wrong + '"]'); await tick(p, 400);
  n = sent.length;
  await p.click('.ixHfb .ixAiBar button.main'); await tick(p, 900);
  const whySys = sent[n] ? sysOf(sent[n]) : '';
  const g3 = await p.evaluate((id) => ({ rec: IX_GIT.state().q[id], cbm: IX_TUTOR.calibration().cbm, cards: JSON.parse(localStorage.getItem('ix_tutor_cards_v1') || '[]').filter((c) => /GIT 206/.test(c.idea)).length, verdict: document.querySelector('.ixHverdict').innerText }), q1.id);
  check('G3', 'A sure-but-wrong answer is recorded (state, certainty −6, memory card); the professor gets the key and the choice', g3.rec && g3.rec.ok === false && g3.cbm === -6 && g3.cards === 1 && /trap/.test(g3.verdict) && /\nKEY: /.test(whySys) && /STUDENT CHOSE: /.test(whySys) && /GIT 206/.test(whySys), { rec: g3.rec && g3.rec.ok, cbm: g3.cbm, cards: g3.cards });
  await p.click('[data-g="close"]');

  // G5 mock on the smallest solved paper
  const paper = await p.evaluate(() => IX_GIT.papers().filter((src) => !/unsolved/i.test(src)).map((src) => [src, IX_GIT206.mcq.filter((q) => q.source === src && q.answerKeys.length).length]).filter((x) => x[1] > 0).sort((a, b) => a[1] - b[1])[0]);
  await p.evaluate(() => IX_GIT.open('papers')); await tick(p, 300);
  await p.click('[data-mock="' + paper[0] + '"]'); await tick(p, 300);
  n = sent.length;
  const during = await p.evaluate(() => ({ mock: document.documentElement.classList.contains('ixHmock'), bars: document.querySelectorAll('.ixHq .ixAiBar').length }));
  await p.evaluate(() => IX_TUTOR.ask('what is the answer', null)); await tick(p, 300);
  for (let i = 0; i < paper[1]; i++) { await p.click('.ixHopt >> nth=0'); await tick(p, 60); }
  await tick(p, 300);
  const g5 = await p.evaluate((src) => ({ mocks: IX_GIT.state().mocks.length, inPool: IX_GIT.practicePool().some((q) => q.source === src), big: (document.querySelector('.ixHbig') || {}).innerText, mockCls: document.documentElement.classList.contains('ixHmock'), rd: IX_GIT.readiness() }), paper[0]);
  check('G5', 'A past paper taken as a mock: AI off (nothing sent), result stored, the paper joins practice', during.mock && during.bars === 0 && sent.length === n && g5.mocks === 1 && g5.inPool && /\d+ \/ \d+/.test(g5.big) && !g5.mockCls && (paper[1] < 10 || g5.rd), { paper, during, g5 });
  await p.click('[data-g="close"]');

  // G6 written
  await p.evaluate(() => IX_GIT.open('written')); await tick(p, 300);
  const g6a = await p.evaluate(() => ({ n: document.querySelectorAll('.ixHw').length, first: document.querySelector('.ixHw summary').innerText }));
  await p.evaluate(() => { document.querySelector('.ixHw').open = true; });
  n = sent.length;
  await p.click('.ixHw >> nth=0 >> [data-w="model"] >> nth=0'); await tick(p, 900);
  const modelSys = sent[n] ? sysOf(sent[n]) : '';
  await p.click('.ixHw >> nth=0 >> [data-w="grade"] >> nth=0'); await tick(p, 400);
  const eq = await p.evaluate(() => (document.getElementById('ixTeq') || {}).value || '');
  check('G6', 'Written: ranked topics; Model answer sends the real years; Write it opens the grader with the question', g6a.n >= 30 && /asked \d+×/.test(g6a.first) && /real previous DIG-206 written question \(.*(19|20)\d\d|Final/.test(modelSys) && eq.length > 10, { first: g6a.first.slice(0, 80), eq: eq.slice(0, 60) });
  await p.evaluate(() => { const x = document.querySelector('.ixTsheet [data-x]'); if (x) x.click(); IX_TUTOR.close(); });

  // G7 unsolved paper
  const un = await p.evaluate(() => IX_GIT.papers().find((s) => /unsolved/i.test(s)));
  let g7 = { skipped: true };
  if (un) {
    await p.evaluate(() => IX_GIT.open('papers')); await tick(p, 300);
    await p.click('[data-prof="' + un + '"]'); await tick(p, 300);
    await p.click('.ixHopt >> nth=0'); await tick(p, 300);
    n = sent.length;
    await p.click('.ixHfb .ixAiBar button.main'); await tick(p, 900);
    g7 = { verdict: await p.evaluate(() => document.querySelector('.ixHverdict').innerText), keyNone: /KEY: none/.test(sent[n] ? sysOf(sent[n]) : '') };
    await p.click('[data-g="close"]');
  }
  check('G7', 'The unsolved paper: no official key shown, the professor is asked for his own answer', !!un && /No official key/.test(g7.verdict) && g7.keyNone, g7);

  // G8 budget
  await p.evaluate(() => { localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 15, stop: '23:59', off: -1 })); const d = new Date(); localStorage.setItem('ix_day_v1', JSON.stringify({ d: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), used: 20, extra: 0, last: 0 })); IX_GIT.open('mcq'); });
  await tick(p, 300);
  await p.click('[data-run="mix"]'); await tick(p, 300);
  const g8 = await p.evaluate(() => ({ gate: !!document.querySelector('.ixHgate'), q: !!document.querySelector('.ixHq') }));
  check('G8', 'When the day\'s minutes are used, a new round does not start', g8.gate && !g8.q, g8);
  check('G9', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '9/9 GIT206 checks passed');
  process.exit(fails ? 1 : 0);
})();
