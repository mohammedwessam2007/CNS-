// v37 the AI key check: A1 a good key → key ✓, limit, balance, both models answer → "All good" · A2 no credit → the 402
// line says to add credits · A3 a refused key says to make a new one · A4 a wrong model name says to reset it · A5 the menu
// runs it in one tap · A6 the key is only sent to openrouter.ai · A7 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-21T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [], hosts = new Set();
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('request', (r) => { if ((r.headers().authorization || '').includes('sk-or-v1-TEST')) hosts.add(new URL(r.url()).host); });
  let mode = 'good';
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const u = r.request().url(), b = JSON.parse(r.request().postData() || '{}');
    if (mode === 'refused') return r.fulfill({ status: 401, body: '{}' });
    if (/\/key$/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { label: 'phone', limit: 5, usage: 1.2, limit_remaining: 3.8 } }) });
    if (/\/credits$/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { total_credits: mode === 'broke' ? 1 : 10, total_usage: mode === 'broke' ? 1 : 2.5 } }) });
    if (mode === 'broke') return r.fulfill({ status: 402, body: '{"error":"insufficient credits"}' });
    if (mode === 'badmodel' && b.model === 'openai/x') return r.fulfill({ status: 400, body: '{"error":{"message":"openai/x is not a valid model ID"}}' });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: 'OK' } }], usage: { cost: 0.00001 } }) });
  });
  await p.evaluate(() => localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'));
  const a1 = await p.evaluate(() => IX_TUTOR.checkKey());
  check('A1', 'Good key: accepted, limit and balance shown, both models answer, all good', a1.ok && /Key accepted/.test(a1.lines.join()) && /left \$3\.80/.test(a1.lines.join()) && /balance \$7\.50/.test(a1.lines.join()) && /Fast model answers/.test(a1.lines.join()) && /Professor model answers/.test(a1.lines.join()) && /All good/.test(a1.lines.join()), a1.lines);
  mode = 'broke'; const a2 = await p.evaluate(() => IX_TUTOR.checkKey());
  check('A2', 'No credit: the balance and the 402 lines say to add credits', !a2.ok && /add credits/.test(a2.lines.join()), a2.lines);
  mode = 'refused'; const a3 = await p.evaluate(() => IX_TUTOR.checkKey());
  check('A3', 'A refused key says to make a new one', !a3.ok && /refused this key/.test(a3.lines.join()), a3.lines);
  mode = 'badmodel'; await p.evaluate(() => localStorage.setItem('ix_tutor_model_pro_v1', 'openai/x')); const a4 = await p.evaluate(() => IX_TUTOR.checkKey());
  check('A4', 'A wrong professor model name says to reset it to the default', !a4.ok && /reset it to openai\/gpt-6\.2-sol-pro/.test(a4.lines.join()), a4.lines);
  mode = 'good'; await p.evaluate(() => localStorage.removeItem('ix_tutor_model_pro_v1'));
  await p.evaluate(() => { const b = document.querySelector('[data-xm="keycheck"]'); if (b) b.click(); else IX_TUTOR.checkAI(); }); await tick(p, 1500);
  const a5 = await p.evaluate(() => ({ txt: (document.querySelector('.ixTstatus, #ixTst, [id^="ixTst"]') || document.body).innerText, menu: !!document.querySelector('[data-xm="keycheck"]') }));
  check('A5', 'The menu item runs the full check in one tap', a5.menu && /All good/.test(a5.txt), { menu: a5.menu, ok: /All good/.test(a5.txt) });
  check('A6', 'The key is only ever sent to openrouter.ai', [...hosts].every((h) => h === 'openrouter.ai') && hosts.size === 1, [...hosts]);
  check('A7', 'No page errors', !errs.length, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
