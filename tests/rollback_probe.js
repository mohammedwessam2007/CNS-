// Rollback safety: state written by v14.2 (S.v14 schema 2, after real study actions) must load cleanly
// in the exact v53 files, and survive a return to v14.2. Run with the v53 tree served on :8788.
const { open } = require('./harness');
(async () => {
  const out = {};
  // 1) v14.2: fresh learner → primer reveal → answer → state
  process.env.APP_URL = 'http://127.0.0.1:8787/';
  let s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1200 });
  await s.page.evaluate(async () => { for (const q of EHSAN_QBANK.questions.filter(x => x.split === 'practice').slice(0, 5)) await INTELLECTUALITY_V14.plan(q.id, 'pre'); });
  const st = await s.page.evaluate(() => { S.v14.primed['EHSAN-ANAT-SPINAL-CORD-MCQ-24'] = Date.now(); save(); return JSON.parse(localStorage.getItem('intellectuality_v41_launch_state')); });
  out.v142 = { schema: st.v14 && st.v14.schema, qa: Object.keys(st.v14.qa || {}).length, errors: s.log.errors };
  await s.close();
  // 2) v53 with that state
  delete require.cache[require.resolve('./harness')];
  process.env.APP_URL = 'http://127.0.0.1:8788/';
  const H = require('./harness');
  s = await H.open({ time: '2026-09-22T10:00:00+03:00', state: st, settle: 1500 });
  out.v53 = await s.page.evaluate(() => ({ title: document.title, day: S.day, v14keys: Object.keys(S.v14 || {}).sort(), hasVA: !!(S.v14 && S.v14.visualAssignments), segs: Object.keys(S.segments || S.segs || {}).length, body: document.body.innerText.length }));
  await s.page.evaluate(() => { try { render(); } catch (e) { window.__renderErr = String(e); } });
  await s.page.waitForTimeout(600);
  out.v53.renderErr = await s.page.evaluate(() => window.__renderErr || null);
  out.v53.errors = s.log.errors;
  const back = await s.page.evaluate(() => JSON.parse(localStorage.getItem('intellectuality_v41_launch_state')));
  await s.close();
  // 3) back to v14.2 with the state v53 left behind
  delete require.cache[require.resolve('./harness')];
  process.env.APP_URL = 'http://127.0.0.1:8787/';
  const H2 = require('./harness');
  s = await H2.open({ time: '2026-09-22T10:00:00+03:00', state: back, settle: 1500 });
  out.back = await s.page.evaluate(() => ({ title: document.title, schema: S.v14.schema, primed: Object.keys(S.v14.primed || {}).length, v53FieldsDropped: !('visualAssignments' in S.v14) && !('visualUsed' in S.v14) && !('visualRecent' in S.v14) }));
  out.back.errors = s.log.errors;
  await s.close();
  out.pass = out.v142.errors.length === 0 && out.v53.errors.length === 0 && !out.v53.renderErr && out.back.errors.length === 0 && out.back.schema === 2 && out.back.primed >= 1 && out.back.v53FieldsDropped;
  console.log(JSON.stringify(out, null, 1));
  require('fs').writeFileSync(process.argv[2] || 'out/rollback_probe.json', JSON.stringify(out, null, 1));
})();
