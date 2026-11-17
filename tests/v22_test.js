// v22 "work less, live more" checks, on the real app with a fake OpenRouter.
// W1 the daily budget ends the day (nothing sent), ▶ Today says done, +10 min reopens it
// W2 the weekly day off and W3 the stop time are kept · W4 certainty-based marking and error types are recorded
// W5 every Why?/explanation carries how these examiners ask (negative %, clinical %)
// W6 blind check: new questions, second-model check, AI off while it runs, scored with certainty, misses become cards
// W7 "what the past papers never asked" finds lecture-only points and makes cards · W8 triage cuts scope, not life
// W9 no page errors
// Usage: node tests/v22_test.js   (app on :8787, or APP_URL)
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };

(async () => {
  const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  let reply = ['Fine.'];
  const ITEMS = { items: [1, 2, 3, 4, 5, 6].map((i) => ({ stem: 'Blind question ' + i + ': which tract carries fine touch?', options: { a: 'dorsal column', b: 'spinothalamic', c: 'corticospinal', d: 'spinocerebellar' }, key: 'a', why: 'Dorsal column-medial lemniscus.' })) };
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const body = JSON.parse(r.request().postData() || '{}'); sent.push(body);
    if (!body.stream) {
      const sysc = body.messages[0].content;
      const txt = /item reviewer/.test(sysc) ? 'OK' : /write Kasr Al Ainy exam MCQs/.test(sysc) ? JSON.stringify(ITEMS) : 'ok';
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: txt } }], usage: { cost: 0.001 } }) });
    }
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: reply.map((w) => 'data: ' + JSON.stringify({ choices: [{ delta: { content: w } }] }) + '\n\n').join('') + 'data: [DONE]\n\n' });
  });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); ['ix_tutor_cards_v1', 'ix_tutor_calib_v1', 'ix_tutor_errtypes_v1', 'ix_tutor_blind_v1', 'ix_day_v1'].forEach((k) => localStorage.removeItem(k)); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 15, stop: '23:59', off: -1 })); });
  await tick(p, 500);

  // W1 budget
  await p.evaluate(() => localStorage.setItem('ix_day_v1', JSON.stringify({ d: (() => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); })(), used: 15, extra: 0, last: 0 })));
  await p.evaluate(() => render()); await tick(p, 1000);
  let n = sent.length;
  await p.evaluate(() => IX_TUTOR.ask('teach me more', 'loop')); await tick(p, 400);
  const done = await p.evaluate(() => [...document.querySelectorAll('.ixTm.tutor')].pop().innerText);
  const todayLbl = await p.evaluate(() => (document.querySelector('#player .ixAiBar button.main') || {}).innerText || '');
  await p.evaluate(() => IX_TUTOR.extend(10));
  await p.evaluate(() => IX_TUTOR.ask('one more thing', null)); await tick(p, 900);
  check('W1', 'The daily budget ends the day; ▶ Today says done; +10 min reopens it', /Done for today/.test(done) && /Done for today/.test(todayLbl) && sent.length === n + 1, { done: done.slice(0, 50), todayLbl });

  // W2 day off · W3 stop time
  n = sent.length;
  await p.evaluate(() => localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: new Date().getDay() })));
  await p.evaluate(() => IX_TUTOR.ask('study', 'loop')); await tick(p, 300);
  const off = await p.evaluate(() => [...document.querySelectorAll('.ixTm.tutor')].pop().innerText);
  await p.evaluate(() => { localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '00:00', off: -1 })); localStorage.removeItem('ix_day_v1'); });
  await p.evaluate(() => IX_TUTOR.ask('study', 'loop')); await tick(p, 300);
  const late = await p.evaluate(() => [...document.querySelectorAll('.ixTm.tutor')].pop().innerText);
  check('W2', 'The weekly day off is kept: nothing is sent', /day off/.test(off) && sent.length === n, { off: off.slice(0, 50) });
  check('W3', 'The stop time is kept: nothing is sent after it', /past your stop time/.test(late) && sent.length === n, { late: late.slice(0, 50) });
  await p.evaluate(() => localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 })));

  // W4 CBM + error type
  reply = ['[[wrong]] [[type:misread]] ', 'You missed the word EXCEPT.'];
  await p.evaluate(() => { IX_TUTOR.setConf('sure'); return IX_TUTOR.ask('b', null); }); await tick(p, 900);
  const w4 = await p.evaluate(() => ({ badge: [...document.querySelectorAll('.ixTm.tutor')].pop().innerHTML, cal: IX_TUTOR.calibration(), types: IX_TUTOR.errTypes() }));
  check('W4', 'Certainty-based marking (sure and wrong = −6) and the error type are recorded; the tag is shown as a badge', w4.cal.cbm === -6 && w4.types.misread === 1 && /misread the stem/.test(w4.badge) && !/\[\[type/.test(w4.badge), { cbm: w4.cal.cbm, types: w4.types });

  // W5 examiner style
  const rel = await p.evaluate(() => IX_TUTOR.relevanceText('carotid sheath internal jugular vein vagus nerve contents'));
  check('W5', 'Explanations carry how these examiners ask (negative % and clinical %)', /EXAMINER STYLE/.test(rel) && /% negative/.test(rel) && /% clinical/.test(rel), { rel: (rel.match(/EXAMINER STYLE[^\n]{0,120}/) || [''])[0] });

  // W6 blind check
  reply = ['Fine.'];
  await p.evaluate(() => { IX_TUTOR.open(); }); await tick(p, 200);
  n = sent.length;
  await p.click('.ixTmodes button[data-mode="blind"]'); await p.waitForSelector('input[name=ixBo]', { timeout: 15000 });
  const during = await p.evaluate(() => ({ blind: document.documentElement.classList.contains('ixBlind'), on: IX_TUTOR.blindOn() }));
  const nb = sent.length;
  await p.evaluate(() => IX_TUTOR.ask('just tell me', null)); await tick(p, 300);
  const refused = sent.length === nb;
  for (let i = 0; i < 6; i++) {
    const right = i < 4;
    await p.check('input[name=ixBo][value="' + (right ? 'a' : 'b') + '"]');
    await p.click('[data-c="' + (right ? 'sure' : 'guess') + '"]'); await tick(p, 150);
    await p.click('#ixBn'); await tick(p, 150);
  }
  const res = await p.evaluate(() => ({ txt: document.getElementById('ixBq').innerText, after: IX_TUTOR.blindOn(), br: IX_TUTOR.blindRange(), cards: JSON.parse(localStorage.getItem('ix_tutor_cards_v1') || '[]').filter((c) => /Blind check/.test(c.idea)).length }));
  const gen = sent.slice(n).filter((b) => /write Kasr Al Ainy exam MCQs/.test(b.messages[0].content)).length, chk = sent.slice(n).filter((b) => /item reviewer/.test(b.messages[0].content)).length;
  check('W6', 'Blind check: new questions, each checked; AI off while it runs; scored with certainty; misses become cards',
    gen === 1 && chk === 6 && during.blind && during.on && refused && /4 \/ 6/.test(res.txt) && /certainty score 12/.test(res.txt) && !res.after && res.br.n === 6 && res.cards === 2, { gen, chk, during, refused, txt: res.txt.slice(0, 60), cards: res.cards });
  await p.evaluate(() => document.querySelector('.ixTsheet [data-x]') && document.querySelector('.ixTsheet [data-x]').click());

  // W7 lecture-only diff
  await p.click('.ixThd button[data-t="notes"]'); await tick(p, 300);
  await p.fill('#ixTnotes', '- The carotid sheath contains the internal carotid artery, the internal jugular vein and the vagus nerve.\n- Glymphatic clearance through astrocytic aquaporin-4 channels rises sharply during slow-wave sleep.');
  await p.click('#ixTdiff'); await tick(p, 300);
  const diff = await p.evaluate(() => document.getElementById('ixTdiffOut').innerText);
  await p.click('#ixTdiffCards'); await tick(p, 200);
  const lc = await p.evaluate(() => JSON.parse(localStorage.getItem('ix_tutor_cards_v1') || '[]').filter((c) => /LECTURE-ONLY/.test(c.idea)).map((c) => c.idea));
  check('W7', '"What the past papers never asked" lists only the lecture-only point, and makes it a card', /1 of 2/.test(diff) && /Glymphatic/.test(diff) && !/carotid sheath/.test(diff) && lc.length === 1 && /Glymphatic/.test(lc[0]), { diff: diff.slice(0, 90), lc: lc.length });
  await p.evaluate(() => document.querySelector('.ixTsheet [data-x]').click());

  // W8 triage works even when the day is done, and is built from chapter weights
  await p.evaluate(() => localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 15, stop: '23:59', off: -1 })));
  n = sent.length;
  await p.click('.ixTmodes button[data-mode="triage"]'); await tick(p, 900);
  const tri = sent[n] ? sent[n].messages[0].content : '';
  check('W8', 'Triage cuts scope from chapter weights (never asks for more minutes), even when the day is done', /CHAPTER WEIGHT/.test(tri) && /Never suggest more daily minutes/.test(tri) && /= \d+\.\d%/.test(tri), { has: /CHAPTER WEIGHT/.test(tri) });
  check('W9', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '9/9 V22 checks passed');
  process.exit(fails ? 1 : 0);
})();
