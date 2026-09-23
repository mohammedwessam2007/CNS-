const { open } = require('./harness');
const OUT = process.argv[2];
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1500, viewport: { width: 820, height: 1180 } });
  const { page } = s;
  await page.screenshot({ path: OUT + '/base_01_visual.png' });
  for (let i = 0; i < 12; i++) {
    const k = await page.evaluate(() => nextAction().seg?.type || '');
    if (k === 'question') break;
    await page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]')?.click());
    await page.waitForTimeout(250);
    if (i === 1) await page.screenshot({ path: OUT + '/base_02_teach.png', fullPage: true });
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: OUT + '/base_03_primer.png', fullPage: true });
  await s.close();
})();
