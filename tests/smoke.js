const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1500 });
  const { page, log } = s;
  const snap = async (label) => console.log('== ' + label, JSON.stringify(await page.evaluate(() => ({
    chip: document.querySelector('#v14Calendar')?.textContent, eyebrow: document.querySelector('#eyebrow')?.textContent,
    rail: document.querySelector('.railLabel')?.textContent, banner: document.querySelector('.v14Carryover')?.innerText,
    next: nextAction().kind + ':' + (nextAction().seg?.type || ''), day: S.day, v14: S.v14?.schema,
    heads: [...document.querySelectorAll('#player .v14PrimerFlag,#player .v14Intent,#player .smallcaps')].map(x => x.textContent).slice(0, 4),
    btns: [...document.querySelectorAll('#player button')].map(b => b.textContent.trim()).slice(0, 8),
  }))));
  await snap('fresh');
  for (let i = 0; i < 12; i++) {
    const k = await page.evaluate(() => nextAction().seg?.type || '');
    if (k === 'question') break;
    await page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]')?.click());
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1200);
  await snap('primer');
  const primer = await page.evaluate(() => ({ html: document.querySelector('.v14Primer')?.innerText.slice(0, 1600), vis: document.querySelectorAll('.v14Primer .v14Visual').length, missing: document.querySelector('.v14Primer .v14VisualMissing')?.innerText }));
  console.log(primer.html); console.log('visual cards', primer.vis, primer.missing || '');
  console.log('commons calls', log.commons.length, JSON.stringify(log.commons.map(x => x.gsrsearch || (x.titles || '').slice(0, 60)).slice(0, 20)));
  console.log('ERRORS', JSON.stringify(log.errors), JSON.stringify(log.console.slice(0, 8)));
  await s.close();
})();
