// v20.3 the professor on every screen. A fake OpenRouter answers; the real course flow is driven from the first
// teaching step to an MCQ block. A1 a step screen has the professor bar, and ▶ Learn this streams the answer
// INSIDE the page · A2 a picture gets Explain/Quiz, and the picture itself travels (vision) · A3 an unanswered MCQ
// gets a Hint that carries the question but never the key · A4 an answered MCQ gets Why/Every option/Twin/Case
// with the key and the student's choice · A5 the ع switch makes the professor explain in Egyptian Arabic · A6 a
// sealed mock shows no bar and sends nothing · A7 an unseen held-out item is never sendable · A8 no page errors.
// Usage: node tests/ai_everywhere_test.js   (app on :8787, or APP_URL)
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const LEARN_NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]';

(async () => {
  const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const body = JSON.parse(r.request().postData() || '{}'); sent.push(body);
    const words = ['**Mechanism** ', 'first: ', 'the dorsal root carries sensation in.'];
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: words.map((w) => 'data: ' + JSON.stringify({ choices: [{ delta: { content: w } }] }) + '\n\n').join('') + 'data: [DONE]\n\n' });
  });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 })); localStorage.setItem('ix_tutor_lang_v1', 'en'); });
  await tick(p, 2500);
  const sysOf = (b) => b.messages[0].content;
  const userOf = (b) => b.messages[b.messages.length - 1].content;

  // A1 step screen
  const a1bar = await p.evaluate(() => { const b = document.querySelector('#player .ixAiBar'); return b ? b.innerText.replace(/\s+/g, ' ') : ''; });
  let n = sent.length;
  await p.click('#player .ixAiBar button.main'); await tick(p, 1500);
  const a1 = await p.evaluate(() => { const o = document.querySelector('#player .ixAiOut'); return o ? o.innerText : ''; });
  check('A1', 'A step screen has the professor bar; ▶ Learn this answers inside the page', /Learn this/.test(a1bar) && /Quiz me/.test(a1bar) && sent.length === n + 1 && /full learning loop/.test(sysOf(sent[n])) && /Mechanism/.test(a1), { a1bar: a1bar.slice(0, 90), inline: a1.slice(0, 50) });

  // A2 a picture
  await tick(p, 2500);
  const fig = await p.$('#player .ixAiFig .ixAiBar button');
  n = sent.length;
  if (fig) { await fig.click(); await tick(p, 2000); }
  const b2 = sent[n], u2 = b2 ? userOf(b2) : null;
  const imgPart = Array.isArray(u2) ? u2.find((x) => x.type === 'image_url') : null;
  check('A2', 'A picture gets Explain/Quiz, and the picture itself is sent to the professor model', !!fig && !!imgPart && /^(https:|data:image\/jpeg)/.test(imgPart.image_url.url) && /demonstrator/.test(sysOf(b2)) && b2.model === 'openai/gpt-6.1-terra', { fig: !!fig, img: imgPart && imgPart.image_url.url.slice(0, 60), model: b2 && b2.model });

  // walk the real course to the first MCQ block
  let c;
  for (let i = 0; i < 60; i++) {
    c = await p.evaluate(() => INTELLECTUALITY_V16.act.current());
    if (c.kind === 'V16_BLOCK') break;
    await p.evaluate((sel) => document.querySelector(sel)?.click(), LEARN_NEXT);
    await p.waitForTimeout(120);
  }
  await tick(p, 800);
  // A3 unanswered: Hint, no key
  const qid = c.id;
  const hint = await p.$('#player .v16Q .ixAiBar button');
  n = sent.length;
  if (hint) { await hint.click(); await tick(p, 1500); }
  const sys3 = sent[n] ? sysOf(sent[n]) : '';
  check('A3', 'An unanswered MCQ gets a Hint that carries the question but never the key', c.kind === 'V16_BLOCK' && !!hint && /QUESTION/.test(sys3) && !/\nKEY:/.test(sys3) && /NEVER say or hint which option/.test(sys3), { kind: c.kind, hint: !!hint });

  // A4 answer it wrong, then Why was I wrong?
  await p.evaluate(() => {
    const id = INTELLECTUALITY_V16.act.current().id, q = EHSAN_QBANK.questions.find((x) => x.id === id);
    const acc = new Set(INTELLECTUALITY_V16.accepted(id));
    const wrong = q.options.find((o) => !(q.answerKeys || []).includes(o.key) && !acc.has(o.key)) || q.options[0];
    INTELLECTUALITY_V16.act.pick(wrong.key); render();
  });
  await tick(p, 1200);
  const a4bar = await p.evaluate(() => { const b = [...document.querySelectorAll('#player .v16Q .ixAiBar')].pop(); return b ? b.innerText.replace(/\s+/g, ' ') : ''; });
  n = sent.length;
  await p.click('#player .v16Q .ixAiBar button.main'); await tick(p, 1500);
  const sys4 = sent[n] ? sysOf(sent[n]) : '';
  check('A4', 'An answered MCQ gets Why / Every option / Twin / Case, sent with the key and the student\'s choice', /Why was I wrong/.test(a4bar) && /Every option/.test(a4bar) && /Twin/.test(a4bar) && /case/i.test(a4bar) && /\nKEY:/.test(sys4) && /STUDENT CHOSE: \w \(wrong\)/.test(sys4), { a4bar: a4bar.slice(0, 100), qid });

  // A5 Arabic switch
  await p.click('#player .v16Q .ixAiBar [data-ai-lang]'); await tick(p, 200);
  n = sent.length;
  await p.click('#player .v16Q .ixAiBar button:nth-of-type(2)'); await tick(p, 1500);
  const sys5 = sent[n] ? sysOf(sent[n]) : '';
  const lbl = await p.evaluate(() => document.querySelector('#player [data-ai-lang]').textContent);
  check('A5', 'The ع switch makes the professor explain in Egyptian Arabic, exam terms in English', lbl === 'ع' && /Egyptian Arabic/.test(sys5), { lbl });
  await p.evaluate(() => localStorage.setItem('ix_tutor_lang_v1', 'en'));

  // A6 sealed mock: no bars, nothing sent
  n = sent.length;
  await p.evaluate(() => { S.v16 = S.v16 || {}; S.v16.mock = { day: 1, ids: [], i: 0 }; IX_AI_EVERYWHERE.scan(); });
  await tick(p, 400);
  const bars6 = await p.evaluate(() => document.querySelectorAll('#player .ixAiBar').length);
  await p.evaluate(() => IX_TUTOR.ask('answers please', 'hint', '', { inline: document.getElementById('player') })); await tick(p, 400);
  await p.evaluate(() => { S.v16.mock = null; });
  check('A6', 'During a sealed mock no professor bar shows and nothing is sent', bars6 === 0 && sent.length === n, { bars6, sent: sent.length - n });

  // A7 held-out firewall
  const a7 = await p.evaluate(() => {
    const seen = new Set(Object.keys((S.v16 && S.v16.q) || {}));
    const h = EHSAN_QBANK.questions.find((x) => x.split === 'heldout' && !seen.has(x.id) && !((S.qbank && S.qbank.mockSeen) || {})[x.id]);
    const pr = EHSAN_QBANK.questions.find((x) => x.split === 'practice');
    return { held: IX_AI_EVERYWHERE.sendable(h), practice: IX_AI_EVERYWHERE.sendable(pr) };
  });
  check('A7', 'An unseen held-out item is never sendable; a practice item is', a7.held === false && a7.practice === true, a7);
  check('A8', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '8/8 AI-EVERYWHERE checks passed');
  process.exit(fails ? 1 : 0);
})();
