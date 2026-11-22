// v49 · pasting the key is one step and the app says when the browser will forget it.
// P1 "Paste my key" on the course page asks once, saves, tests and shows the result · P2 the menu has "Paste my AI key"
// P3 inside another app's browser (in-app webview) a warning says to open it in Safari · P4 the Professor opens on a chat box
// once the key is there · P5 no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2000, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { limit: 5, limit_remaining: 4, usage: 1, total_credits: 10, total_usage: 2 }, choices: [{ message: { content: 'OK' } }] }) }));
  p.on('dialog', (d) => d.type() === 'prompt' ? d.accept('sk-or-v1-abcdefghijklmnop1234') : d.accept());
  await p.click('[data-caikey]'); await tick(p, 2500); await p.waitForTimeout(800);
  const p1 = await p.evaluate(() => ({ key: localStorage.getItem('ix_tutor_key_v1'), txt: (document.querySelector('[data-cai]') || {}).textContent || '' }));
  check('P1', 'Paste my key: one prompt, saved, tested, the AI shows as on', p1.key === 'sk-or-v1-abcdefghijklmnop1234' && /AI is on/.test(p1.txt), { key: !!p1.key, txt: p1.txt.slice(0, 120) });
  const p2 = await p.evaluate(() => !!document.querySelector('[data-xm=keypaste]'));
  check('P2', 'The menu has "Paste my AI key"', p2, { p2 });
  const p3 = await p.evaluate(() => { Object.defineProperty(navigator, 'userAgent', { get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Telegram' }); document.dispatchEvent(new CustomEvent('ix:key')); return (document.querySelector('[data-cai]') || {}).textContent || ''; });
  check('P3', "Inside another app's browser the page warns that it forgets the key", /another app/.test(p3) && /Safari/.test(p3), { p3: p3.slice(0, 100) });
  await p.click('#ixNav [data-xm=tutor]'); await tick(p, 600);
  const p4 = await p.evaluate(() => ({ chat: !!document.querySelector('#ixTq'), setup: !!document.querySelector('#ixTkey') }));
  check('P4', 'With the key saved, the Professor opens on a chat box you can type into', p4.chat && !p4.setup, p4);
  check('P5', 'No page errors', !errs.length, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
