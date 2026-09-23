const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1200 });
  const { page, log } = s;
  // teach segment content check
  await page.evaluate(() => document.querySelector('#player [data-act="visual-hide"]')?.click()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('#player [data-act="finish-segment"]')?.click()); await page.waitForTimeout(800);
  const teach = await page.evaluate(() => ({
    moves: [...document.querySelectorAll('.kasrMove')].map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 200)),
    companions: document.querySelectorAll('.ctxCompanion').length,
    queries: [...document.querySelectorAll('.ctxCompanion')].map(x => x.dataset.ctxQuery),
    fast: !!document.querySelector('[data-act="elite-fastlane"]'),
  }));
  console.log('TEACH', JSON.stringify(teach, null, 1));
  // start a mock via Force mock button
  log.commons.length = 0;
  await page.evaluate(() => { buildMock(false); save(); render(); });
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => ({
    next: nextAction().kind,
    items: S.mock.items.map(q => q.id),
    primer: !!document.querySelector('.v14Primer'),
    companions: [...document.querySelectorAll('.mockQ .ctxCompanion, .stage .ctxCompanion')].map(c => ({ kind: c.dataset.ctxKind, q: c.dataset.ctxQuery, v14: !!c.querySelector('.v14VisualGenome'), cmd: c.querySelector('.v14Command')?.innerText })),
    stem: document.querySelector('.mockQ h3')?.textContent,
    ans: S.mock.items[0].answerText,
  }));
  console.log('MOCK', JSON.stringify(m, null, 1));
  console.log('commons during mock pre-answer:', JSON.stringify(log.commons.map(x => x.gsrsearch || x.titles)));
  await s.close();
})();
