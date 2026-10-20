// v18.14.2: the GitHub Pages copy (free host while the Vercel project is paused for the month).
// Needs: IX_HOST=pages node deploy/vercel/build.mjs, then a server for deploy/vercel/dist-pages under /cns-/ on :8795
// (Pages serves the project site under /<repo>/). P1 the app opens with no failed request and no page error
// · P2 the offline worker installs for /cns-/ and the page opens again with the network off · P3 a progress file
// saved elsewhere loads, and this device's progress is kept aside · P4 the cloud button explains, it does not
// leave for a page that does not exist.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), os = require('os'), path = require('path');
const BASE = process.env.PAGES_URL || 'http://localhost:8795/cns-/';
const KEY = 'intellectuality_v41_launch_state';
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(4) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 400)); if (!ok) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } });
  const page = await ctx.newPage();
  const bad = [], errs = [];
  page.on('response', (r) => { if (r.url().startsWith('http://localhost:8795') && r.status() >= 400 && !/\/api\//.test(r.url())) bad.push(r.status() + ' ' + r.url()); });
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE);
  await page.waitForTimeout(6000);
  const t = await page.title();
  check('P1', 'The app opens with no failed request and no page error', /v18\.14\.2/.test(t) && !bad.length && !errs.length, { t, bad: bad.slice(0, 5), errs: errs.slice(0, 3) });

  const scope = await page.evaluate(() => navigator.serviceWorker.ready.then((r) => r.scope));
  await page.reload(); await page.waitForTimeout(3000); // the worker now controls the page and keeps a copy
  await ctx.setOffline(true);
  await page.reload(); await page.waitForTimeout(5000);
  const off = await page.evaluate(() => ({ title: document.title, s: typeof S === 'object' && !!S }));
  await ctx.setOffline(false);
  check('P2', 'The offline worker installs for /cns-/ and the app opens with the network off', /\/cns-\/$/.test(scope) && /v18\.14\.2/.test(off.title) && off.s, { scope, off });

  const before = await page.evaluate((k) => localStorage.getItem(k), KEY);
  const st = JSON.parse(before || '{}'); st.importMark = 'from-vercel-copy';
  const f = path.join(os.tmpdir(), 'ix-progress-test.json');
  fs.writeFileSync(f, JSON.stringify({ kind: 'intellectuality-progress', made: '2026-10-19T20:00:00Z', state: st }));
  page.once('dialog', (d) => d.accept());
  await page.evaluate(() => INTELLECTUALITY_SHARE.open());
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-ixs="load"]')]);
  await Promise.all([page.waitForNavigation(), chooser.setFiles(f)]);
  await page.waitForTimeout(4000);
  const after = await page.evaluate((k) => ({ mark: JSON.parse(localStorage.getItem(k) || '{}').importMark, live: typeof S === 'object' && S.importMark, kept: !!localStorage.getItem(k + '_backup_before_import') }), KEY);
  check('P3', 'A progress file saved elsewhere loads, and this device\'s progress is kept aside', after.mark === 'from-vercel-copy' && after.live === 'from-vercel-copy' && after.kept, after);

  let alerted = '';
  page.once('dialog', (d) => { alerted = d.message(); d.accept(); });
  const url0 = page.url();
  await page.evaluate(() => { const c = document.getElementById('cloudBtn'); if (c) c.click(); });
  await page.waitForTimeout(800);
  check('P4', 'The cloud button explains, it does not leave for a page that does not exist', /Cloud backup is off/.test(alerted) && page.url() === url0, { alerted: alerted.slice(0, 80), url: page.url() });
  await b.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASS');
  process.exit(fails ? 1 : 0);
})();
