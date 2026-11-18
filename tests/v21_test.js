// v21 "upgrade in every way" checks, on the real app with a fake OpenRouter.
// V1 the readiness is shown as a past-paper number, with the real exam's gap once a real mark exists
// V2 the weekly budget stops the tutor (nothing is sent) · V3 each answer's cost is counted for the week
// V4 a wrong answer becomes a memory card; when due, ▶ Today reviews it re-worded; a right answer pushes it out
// V5 every generated MCQ is checked by a second model, without the answer
// V6 the post-mortem sorts remembered questions against the bank and stores the real mark
// V7 lecture import: a text file and a photo of notes land in the topic's notes
// V8 the weekly report gets real stats · V9 no page errors
// Usage: node tests/v21_test.js   (app on :8787, or APP_URL)
const fs = require('fs'), os = require('os'), path = require('path');
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const LEARN_NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]';

(async () => {
  const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  let reply = ['Fine.'];
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const body = JSON.parse(r.request().postData() || '{}'); sent.push(body);
    if (!body.stream) {
      const sysc = body.messages[0].content;
      if (/written-exam examiner/.test(sysc)) { const sc = [5, 7, 6][(globalThis.__g = (globalThis.__g || 0) + 1) % 3]; return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: JSON.stringify({ score: sc, missing: ['blood supply of the optic radiation'], good: ['clear headings'] }) } }], usage: { cost: 0.002 } }) }); }
      const txt = /item reviewer/.test(sysc) ? 'OK' : '# Brachial plexus\n- roots C5–T1';
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: txt } }], usage: { cost: 0.0004 } }) });
    }
    const sse = reply.map((w) => 'data: ' + JSON.stringify({ choices: [{ delta: { content: w } }] }) + '\n\n').join('') + 'data: ' + JSON.stringify({ choices: [{ delta: {} }], usage: { cost: 0.0123 } }) + '\n\ndata: [DONE]\n\n';
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: sse });
  });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 })); ['ix_tutor_cards_v1', 'ix_tutor_spend_v1', 'ix_tutor_cap_v1', 'ix_tutor_chat_v1'].forEach((k) => localStorage.removeItem(k)); });
  const sysOf = (b) => b.messages[0].content;

  // V3 cost counted
  await p.evaluate(() => IX_TUTOR.ask('hello', null)); await tick(p, 1200);
  const sp = await p.evaluate(() => IX_TUTOR.spend());
  check('V3', 'Each answer\'s cost is counted for this week', Math.abs(sp.usd - 0.0123) < 1e-6 && sp.calls === 1 && sent[0].usage && sent[0].usage.include === true, sp);

  // V2 budget
  await p.evaluate(() => localStorage.setItem('ix_tutor_cap_v1', '0.01'));
  let n = sent.length;
  await p.evaluate(() => IX_TUTOR.ask('more please', null)); await tick(p, 500);
  const capMsg = await p.evaluate(() => [...document.querySelectorAll('.ixTm.tutor')].pop().innerText);
  check('V2', 'The weekly budget stops the tutor and nothing is sent', sent.length === n && /budget/.test(capMsg), { capMsg: capMsg.slice(0, 80) });
  await p.evaluate(() => localStorage.setItem('ix_tutor_cap_v1', '5'));

  // V4 memory card
  reply = ['Which tract carries fine touch?'];
  await p.evaluate(() => IX_TUTOR.ask('quiz me on the dorsal columns', 'quiz')); await tick(p, 1500);
  reply = ['[[wrong]] ', 'No: fine touch is the dorsal column, not spinothalamic.'];
  await p.evaluate(() => IX_TUTOR.ask('spinothalamic', null)); await tick(p, 1200);
  const c1 = await p.evaluate(() => JSON.parse(localStorage.getItem('ix_tutor_cards_v1') || '[]').map((c) => Object.assign(c, { future: c.due > Date.now() })));
  await p.evaluate(() => { const c = JSON.parse(localStorage.getItem('ix_tutor_cards_v1')); c[0].due = Date.now() - 1000; localStorage.setItem('ix_tutor_cards_v1', JSON.stringify(c)); render(); });
  await tick(p, 1200);
  const todayLbl = await p.evaluate(() => { const b = document.querySelector('#player .ixAiBar button.main'); return b ? b.innerText : ''; });
  n = sent.length; reply = ['Here is a new angle: a patient loses vibration sense…'];
  await p.click('#player .ixAiBar button.main'); await tick(p, 1500);
  const revSys = sent[n] ? sysOf(sent[n]) : '';
  reply = ['[[correct]] ', 'Yes.'];
  await p.evaluate(() => IX_TUTOR.ask('dorsal column', null)); await tick(p, 1200);
  const c2 = await p.evaluate(() => JSON.parse(localStorage.getItem('ix_tutor_cards_v1') || '[]').map((c) => Object.assign(c, { later: c.due > Date.now() + 864e5 * 0.9 })));
  check('V4', 'A wrong answer becomes a card; when due, ▶ Today reviews it re-worded; right pushes it out',
    c1.length === 1 && c1[0].future && /fine touch/.test(c1[0].idea) && /review/i.test(todayLbl) && /CARD/.test(revSys) && /NEW wording/.test(revSys) && c2[0].step === 1 && c2[0].later,
    { cards: c1.length, idea: c1[0] && c1[0].idea, due1: c1[0] && c1[0].future, card: /CARD/.test(revSys), nw: /NEW wording/.test(revSys), dueOk: c2[0] && c2[0].later });

  // V5 second-model check on a generated MCQ
  n = sent.length;
  reply = ['A 40-year-old… Which is damaged?\n', 'a) dorsal column\n', 'b) spinothalamic\n', 'c) corticospinal\n', 'd) DSCT'];
  await p.evaluate(() => IX_TUTOR.ask('new exam question', 'quiz')); await tick(p, 1800);
  const chk = sent.slice(n).find((b) => !b.stream);
  const last5 = await p.evaluate(() => [...document.querySelectorAll('.ixTm.tutor')].pop().innerText);
  check('V5', 'A generated MCQ is checked by a second model, and the check never sees a request to reveal the answer', !!chk && /Do NOT reveal/.test(sysOf(chk)) && /Checked by a second model/.test(last5), { checked: !!chk, tail: last5.slice(-70) });

  // V6 post-mortem
  await p.evaluate(() => { IX_TUTOR.open(); });
  await p.click('.ixTmodes button[data-mode="postmortem"]'); await tick(p, 300);
  await p.fill('#ixTpm', 'which is not a content of the carotid sheath\nwhat does the medial lemniscus carry\nnew drug acting on astrocyte glutamate uptake in sleep');
  await p.fill('#ixTpmPct', '50');
  n = sent.length; reply = ['A: 2, C: 1'];
  await p.click('#ixTpmGo'); await tick(p, 1500);
  const pmSys = sent[n] ? sysOf(sent[n]) : '';
  const outs = await p.evaluate(() => (S.v12 && S.v12.outcomes) || []);
  check('V6', 'The post-mortem sorts each remembered question against the bank, and stores the real mark', /EXAM QUESTIONS/.test(pmSys) && /\[bank: \d+ similar/.test(pmSys) && outs.some((o) => o.actualPct === 50), { lines: (pmSys.match(/\[bank: \d+/g) || []).length, outs: outs.length });

  // V1 honest readiness, on a real MCQ screen with 24 mock answers (18 right)
  await p.evaluate(() => IX_TUTOR.close());
  for (let i = 0; i < 60; i++) { const c = await p.evaluate(() => INTELLECTUALITY_V16.act.current()); if (c.kind === 'V16_BLOCK') break; await p.evaluate((sel) => document.querySelector(sel)?.click(), LEARN_NEXT); await p.waitForTimeout(120); }
  await p.evaluate(() => { const ids = EHSAN_QBANK.questions.filter((q) => q.split === 'heldout').slice(0, 24).map((q) => q.id); S.v16.mocks = [{ r: ids.map((id, i) => [id, i < 18]) }]; S.v12.outcomes = [{ actualPct: 50, predictedPct: 78 }]; render(); });
  await tick(p, 800);
  const pred = await p.evaluate(() => (document.querySelector('.v16Pred') || {}).innerText || '');
  check('V1', 'Readiness says "past-paper mocks", never "Predicted", and shows how far the real exam was', /Past-paper mocks/.test(pred) && !/Predicted/.test(pred) && /28 points lower/.test(pred), { pred });

  // V7 import: text file and photo
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ixv21-')), txtF = path.join(tmp, 'lecture.txt'), pngF = path.join(tmp, 'notes.png');
  fs.writeFileSync(txtF, 'DOCTOR STRESSED: Brown-Sequard → ipsilateral dorsal column loss');
  fs.writeFileSync(pngF, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
  await p.evaluate(() => IX_TUTOR.open()); await p.click('.ixThd button[data-t="notes"]'); await tick(p, 300);
  await p.setInputFiles('#ixTfile', txtF); await tick(p, 600);
  n = sent.length;
  await p.setInputFiles('#ixTfile', pngF); await tick(p, 1200);
  const ta = await p.evaluate(() => document.getElementById('ixTnotes').value);
  const imgReq = sent.slice(n).find((b) => Array.isArray(b.messages[1].content));
  check('V7', 'A text file and a photo of notes both land in the topic\'s notes (the photo via the vision model)', /Brown-Sequard/.test(ta) && /Brachial plexus/.test(ta) && !!imgReq && imgReq.model === 'openai/gpt-6.2-sol-pro', { len: ta.length, img: !!imgReq });
  await p.evaluate(() => document.querySelector('.ixTsheet [data-x]').click());

  // V8 weekly report
  n = sent.length; reply = ['Honest week.'];
  await p.click('.ixTmodes button[data-mode="week"]'); await tick(p, 1200);
  const wk = sent[n] ? sysOf(sent[n]) : '';
  check('V8', 'The weekly report is built from real stats', /STATS \(last 7 days/.test(wk) && /memory deck: \d+ ideas/.test(wk) && /AI spend this week: \$/.test(wk), { has: /STATS/.test(wk) });
  // V10 essay grader: three examiners, median and spread, missing points become memory cards
  await p.click('.ixTmodes button[data-mode="essay"]'); await tick(p, 300);
  await p.fill('#ixTeq', 'Describe the optic pathway and its lesions');
  await p.fill('#ixTea', 'Retina → optic nerve → chiasma → optic tract → LGB → optic radiation → visual cortex. Lesions: …');
  n = sent.length;
  await p.click('#ixTego'); await tick(p, 1500);
  const gr = await p.evaluate(() => document.getElementById('ixTest').innerText);
  const graders = sent.slice(n).filter((b) => /written-exam examiner/.test(sysOf(b))).length;
  const cards10 = await p.evaluate(() => JSON.parse(localStorage.getItem('ix_tutor_cards_v1') || '[]').filter((c) => /optic radiation/.test(c.idea)).length);
  check('V10', 'The essay grader asks 3 examiners and shows the median and the spread; missing points become cards', graders === 3 && /6 \/ 10/.test(gr) && /5–7/.test(gr) && cards10 === 1, { graders, gr: gr.slice(0, 80), cards10 });
  check('V9', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '10/10 V21 checks passed');
  process.exit(fails ? 1 : 0);
})();
