// v38 · the learning engine: every lesson runs on retrieval, prediction, calibration, elaboration and spacing.
// E1 every lesson gets a worked case + a brain dump · E2 warm-up from earlier lessons and a guess-first pretest
// E3 Think questions ask you to commit and rate confidence before the answer; a wrong answer becomes a card
// E4 worked case reveals its reasoning one step at a time · E5 brain dump: missed points become cloze cards due tomorrow
// E6 self-explanation is saved · E7 "Go deeper" asks the professor once and caches it · E8 no sideways scroll, no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-23T09:00:00+02:00', state: null, settle: 2000, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  let calls = 0;
  await p.context().route('https://openrouter.ai/**', async (r) => { calls++; await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: '**Mechanism:** the deep ring is a gap in fascia transversalis.' } }] }) }); });

  const e1 = await p.evaluate(() => { const L = IX_LESSON.list ? IX_LESSON.list() : []; const keys = L.length ? L.map((l) => l.key) : Object.keys(window.IX_LESSON_TEXT || {}); return { n: keys.length, missing: keys.filter((k) => !IX_LESSON_CASES[k]) }; });
  await p.evaluate(() => { localStorage.setItem('ix_lesson_done_v1', JSON.stringify({ 'skin-fascia-and-muscles-of-the-anterolateral-abdominal-wall': Date.now() - 2 * 864e5 })); IX_LESSON.open('inguinal-region-groin'); });
  await tick(p, 600);
  const heads = async () => p.evaluate(() => document.querySelector('.ixLpart h2').textContent);
  const parts = await p.evaluate(() => document.querySelectorAll('.ixLprog i').length);
  const e2 = await p.evaluate(() => ({ warm: document.querySelectorAll('.ixEw').length, pre: document.querySelectorAll('[data-pre]').length }));
  if (e2.pre) { await p.fill('[data-pre]', 'because of the processus vaginalis'); await p.click('[data-e=presave]'); }
  const pre = await p.evaluate(() => (JSON.parse(localStorage.getItem('ix_engine_v1') || '{}').pre || {})['inguinal-region-groin']);
  check('E1', 'Every lesson ends with a worked case and a brain dump', !e1.missing.length && e1.n >= 50, e1);
  check('E2', 'Part 1 opens with a warm-up from earlier lessons and a guess-first pretest (locked guesses are saved)', e2.warm >= 1 && e2.pre >= 1 && pre && pre[0] === 'because of the processus vaginalis', { e2, pre });

  // walk to the first part with a Think question
  let think = null;
  for (let k = 0; k < 12 && !think; k++) { think = await p.evaluate(() => { const b = document.querySelector('.ixEthink'); return b ? { spoilHidden: [...document.querySelectorAll('.ixLpart .ixYspoil')].some((x) => x.hidden) } : null; }); if (!think) { await p.click('.ixL [data-a=next]'); await tick(p, 80); } }
  let e3 = { think };
  if (think) {
    await p.fill('.ixEthink input', 'a wrong answer'); await p.click('.ixEthink [data-c=sure]');
    e3.revealed = await p.evaluate(() => !document.querySelector('.ixEthink').previousElementSibling.querySelector('.ixYspoil[hidden]'));
    await p.click('.ixEthink [data-j="0"]');
    e3.judge = await p.evaluate(() => document.querySelector('.ixEthink .ixEjudge').textContent);
    e3.calib = await p.evaluate(() => (JSON.parse(localStorage.getItem('ix_engine_v1') || '{}').calib || []).length);
  }
  check('E3', 'A Think answer is hidden until you commit and rate confidence; sure-but-wrong is logged and flagged', think && think.spoilHidden && e3.revealed && /Sure but wrong/.test(e3.judge) && e3.calib === 1, e3);

  for (let k = 0; k < 14; k++) { if (/Worked case/.test(await heads())) break; await p.click('.ixL [data-a=next]'); await tick(p, 60); }
  const e4a = await p.evaluate(() => [...document.querySelectorAll('.ixEstep')].map((x) => x.hidden));
  await p.click('.ixEstep [data-e=cshow]');
  const e4b = await p.evaluate(() => ({ steps: [...document.querySelectorAll('.ixEstep')].map((x) => x.hidden), ans: !document.querySelector('.ixEstep .ixEans').hidden }));
  check('E4', 'The worked case shows one step at a time; the reasoning appears only after you try', e4a.length >= 2 && !e4a[0] && e4a[1] && e4b.ans && !e4b.steps[1], { e4a, e4b });

  await p.click('.ixL [data-a=next]'); await tick(p, 100);
  const dumpHead = await heads();
  await p.click('[data-e=dumpcheck]'); const nag = await p.evaluate(() => document.querySelector('.ixEdk').hidden);
  await p.fill('[data-e=dumptext]', 'oblique canal, deep ring, walls'); await p.click('[data-e=dumpcheck]'); await p.check('[data-pt="0"]'); await p.click('[data-e=dumpscore]'); await tick(p, 100);
  const e5 = await p.evaluate(() => { const C = JSON.parse(localStorage.getItem('ix_fc_custom_v1') || '{}'); const dump = Object.values(C).filter((c) => /#dump/.test(c.id)); const all = IX_KIT.cards(); const now = Date.now(); return { dump: dump.length, cloze: dump.every((c) => /_____|…/.test(c.q)), inKit: dump.every((d) => all.some((c) => c.id === d.id)), dueNow: IX_KIT.due(now).filter((c) => /#dump/.test(c.id)).length, dueTomorrow: IX_KIT.due(now + 864e5 + 3600e3).filter((c) => /#dump/.test(c.id)).length, res: document.querySelector('.ixEres').innerText }; });
  check('E5', 'Brain dump from a blank page: it needs an attempt; missed points become cloze cards due tomorrow, not today', /Brain dump/.test(dumpHead) && nag && e5.dump >= 1 && e5.cloze && e5.inKit && e5.dueNow === 0 && e5.dueTomorrow >= e5.dump && /Recall 1 \//.test(e5.res), { dumpHead, nag, e5 });

  await p.click('.ixL [data-a=back]'); await tick(p, 60); await p.click('.ixL [data-a=back]'); await tick(p, 60);
  await p.fill('[data-e=explain]', 'the canal is oblique so pressure closes it'); await p.dispatchEvent('[data-e=explain]', 'change');
  const e6 = await p.evaluate(() => Object.values(JSON.parse(localStorage.getItem('ix_engine_v1') || '{}').explain || {}));
  check('E6', 'The one-line self-explanation is saved for the part', e6.includes('the canal is oblique so pressure closes it'), e6);

  await p.evaluate(() => localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY'));
  await p.click('[data-e=deep]'); await p.waitForSelector('.ixEdeepT', { timeout: 8000 }).catch(() => {});
  const d1 = await p.evaluate(() => (document.querySelector('.ixEdeepT') || {}).textContent || '');
  await p.click('.ixL [data-a=next]'); await tick(p, 60); await p.click('.ixL [data-a=back]'); await tick(p, 60);
  const d2 = await p.evaluate(() => !!document.querySelector('.ixEdeepT') && !document.querySelector('[data-e=deep]'));
  check('E7', 'Go deeper asks the professor once and keeps the answer', /fascia transversalis/.test(d1) && d2 && calls === 1, { d1: d1.slice(0, 80), d2, calls });

  const wide = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  check('E8', 'No sideways scroll and no page errors', !wide && !errs.length, { wide, errs: errs.slice(0, 3), parts });
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
