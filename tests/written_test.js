// v25 the written exams, on the real app with a fake OpenRouter.
// W1 every question gets the structure its verb needs · W2 a GIT written question finds its department-style reference
// W3 the grader marks against the reference and the structure, 3 examiners · W4 a photo of a handwritten answer is read and marked
// W5 a marked essay schedules its 3-minute outline; a good outline pushes it further out
// W6 the GIT written mock: AI off while writing (nothing sent), 6 real questions, every answer marked, total stored
// W7 the CNS written mock: the professor writes the paper BEFORE the AI goes off · W8 the plan holds both mocks and the outline drills
// W9 the hub's Written tab has the mock, the outlines and a 3-minute outline per question · W10 no page errors
const fs = require('fs'), os = require('os'), path = require('path');
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-12-31T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const body = JSON.parse(r.request().postData() || '{}'); sent.push(body);
    const sys = body.messages[0].content;
    let txt = 'OK';
    if (/written-exam examiner/.test(sys)) txt = JSON.stringify({ score: 6, missing: ['the oesophageal site'], good: ['numbered list'], structure: 'followed the list format', read: Array.isArray(body.messages[1].content) ? 'Sites: 1. lower end of oesophagus' : '' });
    else if (/OUTLINE/.test(sys)) txt = JSON.stringify({ have: ['sites'], missing: [], ok: true });
    else if (/NEU-205/.test(sys)) txt = JSON.stringify({ qs: ['Explain the stretch reflex', 'Compare UMN and LMN lesions in a table', 'Describe the visual pathway', 'Enumerate the functions of the cerebellum', 'Explain pain control', 'Describe the brain stem lesions'] });
    if (!body.stream) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: txt } }], usage: { cost: 0.001 } }) });
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' });
  });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 })); });
  await tick(p, 600);
  const sysOf = (b) => b.messages[0].content, userText = (b) => { const c = b.messages[b.messages.length - 1].content; return Array.isArray(c) ? c[0].text : c; };

  // W1
  const v = await p.evaluate(() => ['Compare between PCT and DCT', 'Explain mechanism of salivary secretion', 'Mention sites of portosystemic anastomosis', 'Mention the relations of the body of the pancreas', 'Case: a 35-year-old farmer with an enlarged spleen', 'Explain development of the stomach'].map((q) => IX_TUTOR.verbTemplate(q).split(' ')[0]));
  check('W1', 'Every question gets the structure its verb needs', v.join() === 'COMPARE,EXPLAIN,ENUMERATE,RELATIONS,CASE,DEVELOPMENT', v);
  // W2
  const r2 = await p.evaluate(() => ({ psa: IX_REF_FOR('Mention sites of portosystemic anastomosis {6 marks}'), sal: IX_REF_FOR('Explain mechanism of salivary secretion {8 marks}') }));
  check('W2', 'A GIT written question finds its department-style reference (anatomy and physiology)', /Portosystemic/i.test(r2.psa) && /Jalal/.test(r2.psa) && /saliva/i.test(r2.sal), { psa: r2.psa.slice(0, 70), sal: r2.sal.slice(0, 70) });
  // W3
  const Q = 'Mention sites of portosystemic anastomosis {6 marks}';
  await p.evaluate((q) => IX_TUTOR.openEssay(q), Q); await tick(p, 300);
  const verb = await p.evaluate(() => document.getElementById('ixTverb').innerText);
  await p.fill('#ixTea', '1. Lower end of oesophagus 2. Anal canal 3. Umbilicus 4. Bare area of liver 5. Retroperitoneal');
  let n = sent.length;
  await p.click('#ixTego'); await p.waitForFunction(() => /\/ 10/.test((document.getElementById('ixTest') || {}).innerText || ''), null, { timeout: 20000 }).catch(() => {}); await tick(p, 300);
  const g3 = sent.slice(n).filter((b) => /written-exam examiner/.test(sysOf(b)));
  const out3 = await p.evaluate(() => document.getElementById('ixTest').innerText);
  check('W3', 'The grader: 3 examiners, against the reference and the verb structure; the result says so', g3.length === 3 && g3.every((b) => /REFERENCE ANSWER/.test(userText(b)) && /STRUCTURE THIS VERB NEEDS/.test(userText(b))) && /6 \/ 10/.test(out3) && /department-style answer/.test(out3) && /Structure/.test(out3) && /ENUMERATE/.test(verb), { n: g3.length, out3: out3.slice(0, 90) });
  // W5 (outline scheduled by the marked essay)
  const o5a = await p.evaluate((q) => IX_WRITTEN.state().outlines[q], Q);
  // W4 photo
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ixw-')), png = path.join(tmp, 'page.png');
  fs.writeFileSync(png, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
  await p.fill('#ixTea', '');
  await p.setInputFiles('#ixTeimg', png);
  n = sent.length;
  await p.click('#ixTego'); await p.waitForFunction(() => /Read from your photo/.test((document.getElementById('ixTest') || {}).innerText || ''), null, { timeout: 20000 }).catch(() => {}); await tick(p, 300);
  const g4 = sent.slice(n).filter((b) => /written-exam examiner/.test(sysOf(b)));
  const out4 = await p.evaluate(() => document.getElementById('ixTest').innerText);
  check('W4', 'A photo of a handwritten answer goes to the examiners (vision) and the page they read is shown', g4.length === 3 && g4.every((b) => Array.isArray(b.messages[1].content) && b.messages[1].content[1].type === 'image_url') && /Read from your photo/.test(out4), { n: g4.length });
  await p.evaluate(() => { document.querySelector('.ixTsheet [data-x]').click(); IX_TUTOR.close(); });
  // W5 outline drill
  await p.evaluate((q) => { const o = IX_WRITTEN.state().outlines[q]; o.due = Date.now() - 1000; }, Q);
  await p.evaluate(() => IX_WRITTEN.openDue()); await tick(p, 300);
  await p.fill('#ixWo', '1. oesophagus 2. anal canal 3. umbilicus 4. bare area 5. retroperitoneum');
  n = sent.length;
  await p.click('#ixWcheck'); await tick(p, 900);
  const oCall = sent.slice(n).find((b) => /OUTLINE/.test(sysOf(b)));
  const o5b = await p.evaluate((q) => IX_WRITTEN.state().outlines[q], Q);
  check('W5', 'A marked essay schedules its 3-minute outline; a good outline (checked against the reference) pushes it further out', !!o5a && !!oCall && /REFERENCE/.test(userText(oCall)) && o5b.step === 1 && o5b.due > Date.now() + 2 * 864e5, { o5a: !!o5a, step: o5b && o5b.step });
  await p.evaluate(() => IX_WRITTEN.close());
  // W6 GIT written mock
  await p.evaluate(() => IX_WRITTEN.openMock('git')); await tick(p, 300);
  await p.click('#ixWgo'); await tick(p, 300);
  const during = await p.evaluate(() => ({ mock: document.documentElement.classList.contains('ixHmock'), q: document.querySelector('.ixW h3').innerText }));
  n = sent.length;
  await p.evaluate(() => IX_TUTOR.ask('help', null)); await tick(p, 300);
  const sentDuring = sent.length - n;
  for (let i = 0; i < 6; i++) { await p.fill('#ixWma', 'Answer ' + (i + 1) + ': headings and points written from memory.'); await p.click(i < 5 ? '#ixWnextq' : '#ixWsubmit'); await tick(p, 150); }
  await p.waitForFunction(() => !!document.querySelector('.ixW .ixHbig'), null, { timeout: 30000 }).catch(() => {}); await tick(p, 300);
  const w6 = await p.evaluate(() => ({ big: (document.querySelector('.ixW .ixHbig') || {}).innerText, hist: IX_WRITTEN.history().length, mockCls: document.documentElement.classList.contains('ixHmock') }));
  const graded = sent.slice(n).filter((b) => /written-exam examiner/.test(sysOf(b))).length;
  check('W6', 'GIT written mock: AI off while writing (nothing sent), 6 real questions, each marked by 3 examiners, total stored', during.mock && sentDuring === 0 && graded === 18 && /36 \/ 60/.test(w6.big) && w6.hist === 1 && !w6.mockCls, { during, sentDuring, graded, w6 });
  await p.evaluate(() => IX_WRITTEN.close());
  // W7 CNS mock
  await p.evaluate(() => IX_WRITTEN.openMock('cns')); await tick(p, 300);
  n = sent.length;
  await p.click('#ixWgo'); await tick(p, 900);
  const w7 = await p.evaluate(() => ({ mock: document.documentElement.classList.contains('ixHmock'), q: (document.querySelector('.ixW h3') || {}).innerText }));
  const writer = sent.slice(n).find((b) => /NEU-205/.test(sysOf(b)));
  check('W7', 'CNS written mock: the professor writes the paper first, then the AI goes off', !!writer && w7.mock && /reflex|UMN|visual|cerebellum|pain|brain stem/i.test(w7.q), w7);
  for (let i = 0; i < 6; i++) { await p.click(i < 5 ? '#ixWnextq' : '#ixWsubmit'); await tick(p, 80); }
  await tick(p, 600); await p.evaluate(() => IX_WRITTEN.close());
  // W8 plan
  const w8 = await p.evaluate(() => { const D = IX_PLAN.build().days, f = (d) => D.find((x) => x.date === d); return { j3: f('2027-01-03').steps.map((x) => x.kind), j10: f('2027-01-10').steps.map((x) => x.kind), outl: D.filter((d) => d.steps.some((x) => x.kind === 'outline')).length }; });
  check('W8', 'The plan holds the GIT (3 Jan) and CNS (10 Jan) written mocks and outline drills on the written days', w8.j3.includes('wmock') && w8.j10.includes('wmock') && w8.outl >= 7, w8);
  // W9 hub
  await p.evaluate(() => IX_GIT.open('written')); await tick(p, 300);
  const w9 = await p.evaluate(() => ({ mock: !!document.querySelector('[data-wm]'), due: !!document.querySelector('[data-wo]'), per: document.querySelectorAll('[data-w="outline"]').length }));
  check('W9', "The hub's Written tab: written mock, outlines due, and a 3-minute outline on every question", w9.mock && w9.due && w9.per >= 100, w9);
  check('W10', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '10/10 WRITTEN checks passed');
  process.exit(fails ? 1 : 0);
})();
