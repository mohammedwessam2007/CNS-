// v27 high-yield sheets, on the real app with a fake OpenRouter.
// Y1 layer 1 (no AI): the past-paper facts of a unit, grouped and ranked, with sources
// Y2 the sheet: the professor model, the teaching-method sections, grounded in the facts, references and examiner profile
// Y3 the sheet is kept on the device (a second open sends nothing) and renders tables and hidden answers
// Y4 the plan's learn step opens the unit's sheet; ▶ Learn it starts the loop · Y5 the YouTube links
// Y6 a CNS chapter's sheet uses only the practice half of the CNS bank · Y7 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const SHEET = '## 🎯 The point\nThe wall holds the gut in.\n## 📋 Must-know tables\n| Ring | Site |\n|---|---|\n| Deep | above mid-inguinal point |\n| Superficial | above pubic tubercle |\n## 🧠 Mnemonics\n- **MALT**: the layers\n## ⚡ Rapid recall\n1. Which fascia forms the deep ring? ||Transversalis fascia||';
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => { const b = JSON.parse(r.request().postData() || '{}'); sent.push(b); if (!b.stream) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: SHEET } }], usage: { cost: 0.02 } }) }); return r.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: ' + JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) + '\n\ndata: [DONE]\n\n' }); });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 })); localStorage.removeItem('ix_hy_v1'); });
  const id = 'A:Anterior abdominal wall';
  const f = await p.evaluate((id) => IX_HY.facts(id), id);
  check('Y1', 'Layer 1: the unit\'s past-paper facts, grouped by the answer and ranked, with sources', f.length >= 20 && f[0].n >= f[f.length - 1].n && f.some((x) => x.sources.length), { n: f.length, top: f[0] && f[0].key });
  await p.evaluate((id) => IX_HY.open(id), id); await tick(p, 300);
  let n = sent.length;
  await p.click('#ixYgen'); await tick(p, 1200);
  const req = sent[n], sys = req ? req.messages[0].content : '', usr = req ? req.messages[1].content : '';
  check('Y2', 'The sheet: professor model, teaching-method sections, grounded in facts, references, examiner profile', req && req.model === 'openai/gpt-6.2-sol-pro' && /Ninja Nerd/.test(sys) && /Osmosis/.test(sys) && /Sketchy/.test(sys) && /## ✏️ Whiteboard/.test(sys) && /PAST-PAPER FACTS/.test(usr) && /REFERENCE ANSWERS/.test(usr) && /EXAMINERS/.test(usr), { model: req && req.model });
  const y3a = await p.evaluate(() => ({ table: !!document.querySelector('.ixYsheet table td'), spoil: !!document.querySelector('.ixYspoil') }));
  await p.click('.ixYspoil'); const revealed = await p.evaluate(() => document.querySelector('.ixYspoil').classList.contains('on'));
  await p.evaluate(() => IX_HY.close()); n = sent.length;
  await p.evaluate((id) => IX_HY.open(id), id); await tick(p, 400);
  const y3b = await p.evaluate(() => !!document.querySelector('.ixYsheet h3'));
  check('Y3', 'The sheet is kept on the device (no second request), with tables and tap-to-reveal answers', y3a.table && y3a.spoil && revealed && y3b && sent.length === n, { y3a, revealed, again: sent.length - n });
  // Y5 links
  const links = await p.evaluate(() => [...document.querySelectorAll('.ixYlink')].map((a) => a.href));
  check('Y5', 'Watch at 2x: YouTube search links for the unit on three channels', links.length === 3 && links.every((h) => /youtube\.com\/results\?search_query=/.test(h)) && /Ninja/.test(decodeURIComponent(links[0])), { links: links.length });
  // Y4 plan learn step
  await p.evaluate(() => IX_HY.close());
  const y4 = await p.evaluate(() => { const d = IX_PLAN.build().days.find((x) => x.steps.some((y) => y.kind === 'learn' && y.unit === 'A:Anterior abdominal wall')); IX_PLAN.runStep(d.steps.find((y) => y.kind === 'learn')); return { on: document.querySelector('.ixY').classList.contains('on'), t: document.getElementById('ixYt').innerText }; });
  n = sent.length;
  await p.click('[data-learn]'); await tick(p, 900);
  const loop = sent.slice(n).find((b) => b.stream);
  check('Y4', "The plan's learn step opens the unit's sheet; ▶ Learn it starts the professor's loop", y4.on && /Anterior abdominal wall/.test(y4.t) && loop && /Step n\/6/.test(loop.messages[0].content), y4);
  // Y6 CNS practice only
  const y6 = await p.evaluate(() => { const u = IX_HY.unit('CNS:Brain stem'), held = EHSAN_QBANK.questions.filter((q) => q.split === 'heldout' && q.chapter === 'Brain stem').map((q) => q.stem); return { n: u.qs.length, leak: u.qs.filter((q) => held.includes(q.stem)).length }; });
  check('Y6', "A CNS chapter's sheet uses only the practice half of the CNS bank (no held-out item)", y6.n > 10 && y6.leak === 0, y6);
  check('Y7', 'No page errors', errs.length === 0 && s.log.errors.length === 0, { errs: errs.concat(s.log.errors).slice(0, 3) });
  await s.close();
  console.log(fails ? fails + ' FAILED' : '7/7 HIGH-YIELD checks passed');
  process.exit(fails ? 1 : 0);
})();
