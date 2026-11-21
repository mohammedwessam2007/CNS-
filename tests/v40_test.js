// v40 · every answer gets its own drawing and every option explained (OpenRouter), every topic gets the professor's drawing.
// X1 no key: an invitation, no request · X2 with a key the call starts while the question is still open; after the answer every
// option is explained and a drawing for this question is shown · X3 the SVG is sanitised · X4 cached: the same question costs once
// X5 sealed questions and mocks never reach the AI · X6 the lesson's big picture gets a topic drawing, cached · X7 key only to openrouter.ai, no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" onload="alert(1)"><rect width="640" height="420" fill="#fbf8f1"/><script>alert(2)</script><image href="https://evil.example/x.png"/><foreignObject><div>x</div></foreignObject><path d="M20 200 C 200 80, 400 320, 620 200" stroke="#44403c" fill="none"/><text x="20" y="30" font-size="16">Title</text><text x="300" y="190" fill="#c2255c" onclick="alert(3)">Deep ring</text><a href="javascript:alert(4)"><text x="10" y="400">bad</text></a></svg>';
(async () => {
  const s = await open({ v16: true, time: '2026-11-23T09:00:00+02:00', state: null, settle: 2000, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [], hosts = new Set(), calls = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('request', (r) => { if ((r.headers().authorization || '').includes('sk-or-v1-TEST')) hosts.add(new URL(r.url()).host); });
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const b = JSON.parse(r.request().postData() || '{}'), u = (b.messages || []).map((m) => m.content).join('\n'); calls.push(((b.messages || [])[1] || {}).content || '');
    let content;
    if (/TOPIC:/.test(u)) content = '{"caption":"The inguinal canal from the front","steps":["Draw the inguinal ligament","Add the deep ring","Add the superficial ring","Join them"]}\n' + SVG;
    else { const keys = [...u.matchAll(/^([a-e])\) /gm)].map((m) => m[1]); const o = {}; keys.forEach((k) => (o[k] = 'Option ' + k + ' explained: what it really is.')); content = JSON.stringify({ answer: keys[0], why: 'Because of the mechanism.', options: o, trap: 'They swap the two rings.', memory: 'MALT', dispute: '', caption: 'Drawn for this question' }) + '\n' + SVG; }
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content } }], usage: { cost: 0.01 } }) });
  });

  const openRun = async () => { await p.evaluate(() => IX_GIT.open()); await tick(p, 300); await p.evaluate(() => document.querySelector('[data-run]').click()); await tick(p, 300); };
  const answerWrong = async () => { const qid = await p.evaluate(() => document.querySelector('.ixHq').dataset.qid); const w = await p.evaluate((id) => { const q = IX_GIT206.mcq.find((x) => x.id === id); return q.options.find((o) => !q.answerKeys.includes(o.key)).key; }, qid); await p.click('.ixHopt[data-k="' + w + '"]'); return qid; };

  await openRun(); await answerWrong(); await tick(p, 300);
  const x1 = await p.evaluate(() => ({ invite: !!document.querySelector('#ixAxHost [data-axsetup]') }));
  check('X1', 'Without a key: an invitation to connect it, no request', x1.invite && calls.length === 0, { x1, calls: calls.length });
  await p.evaluate(() => IX_GIT.close());

  await p.evaluate(() => localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY'));
  await openRun();
  for (let k = 0; k < 50 && !calls.length; k++) await p.waitForTimeout(100);   // real time: IndexedDB and the request run outside the test clock
  const before = calls.length;                      // prefetched while the question is open (this one and the next)
  const qid = await answerWrong();
  await p.waitForSelector('#ixAxHost .ixAxOpts', { timeout: 10000 }).catch(() => {});
  const x2 = await p.evaluate((id) => { const q = IX_GIT206.mcq.find((x) => x.id === id); const li = [...document.querySelectorAll('#ixAxHost .ixAxOpts li')]; return { n: li.length, opts: q.options.length, explained: li.every((l) => /explained/.test(l.textContent)), mine: !!document.querySelector('#ixAxHost li.mine'), ok: document.querySelectorAll('#ixAxHost li.ok').length, svg: !!document.querySelector('#ixAxHost .ixAxDraw svg text'), trap: /swap/.test(document.querySelector('#ixAxHost').textContent) }; }, qid);
  check('X2', 'The call starts while the question is open; after answering, every option is explained and a drawing for it appears', before >= 1 && x2.n === x2.opts && x2.explained && x2.mine && x2.ok === 1 && x2.svg && x2.trap, { before, x2 });
  const x3 = await p.evaluate(() => { const svg = document.querySelector('#ixAxHost svg'); const h = svg.outerHTML; return { script: /<script/i.test(h), on: /\son\w+=/i.test(h), image: /<image/i.test(h), fo: /foreignObject/i.test(h), js: /javascript:/i.test(h), texts: svg.querySelectorAll('text').length }; });
  check('X3', 'The drawing is sanitised: no scripts, handlers, images, foreign objects or javascript links', !x3.script && !x3.on && !x3.image && !x3.fo && !x3.js && x3.texts >= 2, x3);
  const n1 = calls.length;
  await p.evaluate(() => IX_GIT.close());
  const x4 = await p.evaluate(async (id) => { const q = IX_GIT206.mcq.find((x) => x.id === id); const r = await IX_AIX.explain(q); return !!(r && r.svg); }, qid);
  check('X4', 'The same question again costs nothing (cached)', x4 && calls.length === n1, { x4, calls: calls.length, n1 });

  const x5 = await p.evaluate(async () => { const q = IX_GIT.sealedQs('Sealed mock 2')[0]; const r = await IX_AIX.explain(q); IX_AIX.prefetch(q); return { sealedNull: r === null }; });
  const c5 = calls.length;
  await p.evaluate(() => IX_GIT.mockPaper('Sealed mock 2')); await tick(p, 400);
  await p.evaluate(() => document.querySelector('.ixHq .ixHopt').click()); await tick(p, 300);
  check('X5', 'Sealed questions are never sent, and a mock makes no AI call', x5.sealedNull && calls.length === c5 && !calls.some((c) => /Sealed/.test(c)), { x5, calls: calls.length, c5 });
  await p.evaluate(() => IX_GIT.close());

  await p.evaluate(() => IX_LESSON.open('inguinal-region-groin', 1)); await tick(p, 300);
  await p.waitForSelector('.ixAxTopic svg', { timeout: 10000 }).catch(() => {});
  const t1 = await p.evaluate(() => ({ svg: !!document.querySelector('.ixAxTopic .ixAxDraw svg'), steps: document.querySelectorAll('.ixAxTopic .ixAxSteps li').length, topicCalls: 0 }));
  const tc = calls.filter((c) => /TOPIC:/.test(c)).length;
  await p.evaluate(() => { IX_LESSON.close(); IX_LESSON.open('inguinal-region-groin', 1); }); await tick(p, 500);
  const t2 = await p.evaluate(() => !!document.querySelector('.ixAxTopic svg'));
  check('X6', "The lesson's big picture gets the professor's drawing of the topic, made once", t1.svg && t1.steps === 4 && tc === 1 && t2 && calls.filter((c) => /TOPIC:/.test(c)).length === 1, { t1, tc, t2 });
  const wide = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  check('X7', 'The key only goes to openrouter.ai; no sideways scroll; no page errors', [...hosts].every((h) => h === 'openrouter.ai') && !wide && !errs.length, { hosts: [...hosts], wide, errs: errs.slice(0, 3) });
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
