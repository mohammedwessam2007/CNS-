// v32 drawings: D1 every DIG-206 unit has OpenStax drawings, every file is there · D2 most CNS written chapters have
// drawings · D3 a sheet shows the OpenStax drawings first, Gray's plates after as "classic" · D4 the lesson prompt gives the
// professor the unit's drawings to place; [[fig:ID]] shows the drawing in that part; other parts get the one that fits
// D5 a tap opens it full screen; 👁 Explain sends the picture to the professor · D6 MCQ feedback shows the drawing that
// fits the question · D7 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const LESSON = '## 1. Why you should care\nAn ulcer.\n## 2. The big picture\nFour layers of the wall.\n✏️ Draw it yourself:\n1. Four bands\n## 3. The cells of the gastric gland\nParietal and chief cells.\n[[fig:os23_16]]\nFind the parietal cells.\n## 4. Gastric secretion phases\nThe cephalic, gastric and intestinal phases of gastric secretion.\n## Say it back\n1. Four layers';
(async () => {
  const s = await open({ v16: true, time: '2026-11-21T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => { const b = JSON.parse(r.request().postData() || '{}'); sent.push(b); if (!b.stream) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: LESSON } }], usage: { cost: 0.04 } }) }); return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' }); });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.removeItem('ix_lesson_v1'); });
  const d1 = await p.evaluate(async () => { const U = IX_PLAN.units(), none = U.filter((u) => !IX_FIG.forUnit(u.id).length).map((u) => u.id); const all = IX_FIG.all(); const bad = []; for (const f of all) { const r = await fetch(f.src); if (!r.ok) bad.push(f.src); } return { none, n: all.length, bad: bad.length, titled: all.filter((f) => f.title).length }; });
  check('D1', 'Every DIG-206 unit has OpenStax drawings; every file loads; every drawing has its title', d1.none.length === 0 && d1.n >= 100 && d1.bad === 0 && d1.titled === d1.n, d1);
  const d2 = await p.evaluate(() => { const C = IX_PLAN.cns(); const w = C.filter((c) => IX_FIG.forCns(c.name).length); return { with: w.length, all: C.length, missing: C.filter((c) => !IX_FIG.forCns(c.name).length).map((c) => c.name).slice(0, 10) }; });
  check('D2', 'Most CNS written chapters have drawings too', d2.with >= d2.all * 0.8, d2);
  await p.evaluate(() => IX_HY.open('H:Oesophagus and stomach')); await tick(p, 500);
  const d3 = await p.evaluate(() => { const hs = [...document.querySelectorAll('.ixY h3')].map((h) => h.textContent); return { hs, first: hs.findIndex((h) => /Drawings/.test(h)), classic: hs.findIndex((h) => /Classic plates/.test(h)), n: document.querySelectorAll('.ixY .ixFg img').length }; });
  check('D3', "A sheet shows the OpenStax drawings first, Gray's after as classic plates", d3.first >= 0 && d3.n >= 2 && (d3.classic < 0 || d3.classic > d3.first), d3);
  await p.evaluate(() => IX_HY.close());
  const key = await p.evaluate(() => IX_LESSON.lessonsOf('H:Oesophagus and stomach')[0].key);
  await p.evaluate((k) => { delete IX_LESSON_TEXT[k]; IX_LESSON.open(k); }, key); await tick(p, 300);
  let n = sent.length; await p.click('#ixLgen'); await tick(p, 1200);
  const usr = sent[n] ? sent[n].messages[1].content : '';
  const seen = [];
  for (let i = 0; i < 6; i++) { seen.push(await p.evaluate(() => ({ h: document.querySelector('.ixLpart h2').textContent, figs: [...document.querySelectorAll('.ixLmd .ixFg')].map((f) => f.dataset.fig) }))); const nx = await p.$('.ixL [data-a="next"]'); if (!nx) break; await nx.click(); await tick(p, 150); }
  const marked = seen.find((x) => /cells of the gastric gland/.test(x.h)), auto = seen.find((x) => /secretion phases/.test(x.h)), big = seen.find((x) => /big picture/i.test(x.h));
  const ids = [].concat(...seen.map((x) => x.figs));
  check('D4', "The professor gets the unit's drawings; [[fig]] places one; other parts get the one that fits; none twice", /DRAWINGS THE APP WILL SHOW/.test(usr) && /os23_16/.test(usr) && marked.figs[0] === 'os23_16' && auto.figs.length === 1 && big.figs.length === 1 && new Set(ids).size === ids.length, { seen });
  await p.click('.ixL [data-a="back"]'); await tick(p, 150);
  for (let i = 0; i < 5; i++) { if (await p.$('.ixLmd .ixFg [data-zoom]')) break; await p.click('.ixL [data-a="back"]'); await tick(p, 150); }
  await p.click('.ixLmd .ixFg [data-zoom]'); await tick(p, 300);
  const z = await p.evaluate(() => ({ on: document.querySelector('.ixFz').classList.contains('on'), src: document.querySelector('.ixFz img').getAttribute('src') }));
  await p.click('.ixFzX'); n = sent.length;
  await p.click('.ixLmd .ixFg [data-fask="picture"]'); await tick(p, 1200);
  const ask = sent.slice(n).find((b) => b.stream), hasImg = ask && JSON.stringify(ask.messages).includes('data:image');
  check('D5', 'A tap opens the drawing full screen; 👁 Explain sends the picture and its caption to the professor', z.on && /fig\/ostx\//.test(z.src) && ask && hasImg && /OpenStax/.test(JSON.stringify(ask.messages)), { z, hasImg: !!hasImg });
  await p.evaluate(() => { IX_TUTOR.close(); IX_LESSON.close(); });
  const d6 = await p.evaluate(() => { const q = (window.IX_GIT206 || {}).mcq.find((x) => /parietal/i.test(x.stem)); return q ? { q: q.stem.slice(0, 60), html: (window.IX_GIT && IX_GIT._unitFig ? IX_GIT._unitFig(q) : '') } : null; });
  check('D6', 'MCQ feedback shows the drawing that fits the question', d6 && /ixFg/.test(d6.html) && /ostx/.test(d6.html), d6 && { q: d6.q, has: /ixFg/.test(d6.html) });
  check('D7', 'No page errors', errs.length === 0, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
