const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } });
  await ctx.route('**/*', (r) => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + __dirname + '/neck-doss.html'); await p.waitForTimeout(8000);
  const r = await p.evaluate(() => {
    const bad = [], ok = []; const F = window.DOSS_FIGS;
    for (const id of Object.keys(F)) {
      F[id].spots.forEach((s) => { const res = __neck.link(Object.assign({ label: s[2] }, s[3]), null); (res ? ok : bad).push(id + ' · ' + s[2]); });
      const img = new Image(); img.src = F[id].src; if (!img.complete && !img.naturalWidth) {}
    }
    __neck.unlink();
    const chips = [...document.querySelectorAll('.doss-chip')].map((c) => c.dataset.doss);
    return { ok: ok.length, bad, figs: Object.keys(F).length, chipsOnPage1: chips };
  });
  for (const k of [1, 2]) { await p.click('#cta'); await p.waitForTimeout(2500); }
  const chips3 = await p.evaluate(() => [...document.querySelectorAll('.doss-chip')].map((c) => c.dataset.doss));
  await p.click('.doss-chip[data-doss="sd-113a"]'); await p.waitForTimeout(1500);
  await p.click('.sk-spot[data-i="0"]'); await p.waitForTimeout(5000);
  await p.screenshot({ path: 'more.png' });
  console.log(JSON.stringify({ r, chips3, errs }));
  await b.close();
})();
