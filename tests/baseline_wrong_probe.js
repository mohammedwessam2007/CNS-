const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1200 });
  const { page, log } = s;
  for (let i = 0; i < 12; i++) {
    const k = await page.evaluate(() => nextAction().seg?.type || '');
    if (k === 'question') break;
    await page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]')?.click());
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click());
  await page.waitForTimeout(300);
  const q = await page.evaluate(() => { const a = nextAction(); const q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return { id: q.id, keys: q.answerKeys, opts: q.options.map(o => o.key) }; });
  const wrong = q.opts.find(k => !q.keys.includes(k));
  await page.evaluate(() => document.querySelector('[data-conf="confident"]')?.click());
  await page.waitForTimeout(200);
  log.commons.length = 0;
  await page.evaluate((w) => document.querySelector(`[data-act="qbank-choice"][data-choice="${w}"]`)?.click(), wrong);
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    next: nextAction().kind,
    heads: [...document.querySelectorAll('#player .chip, #player h2, #player .v14AutopsyHead b')].map(x => x.textContent.trim()).slice(0, 8),
    autopsy: !!document.querySelector('.v14Autopsy'),
    choiceAttr: document.querySelector('.v14Autopsy')?.getAttribute('data-v14-choice'),
    wrongSide: document.querySelector('.v14CompareSide.wrong')?.innerText.slice(0, 300),
    diff: document.querySelector('.v14Difference')?.innerText.slice(0, 300),
    recall: document.querySelector('.v14Recall')?.innerText.slice(0, 200),
    buttons: [...document.querySelectorAll('#player button')].map(b => b.textContent.trim()),
    err: Object.values(S.errors).map(e => ({ sel: e.selected, sq: e.sourceQuestionId, conf: e.confidence, dim: e.dimension })),
    genome: S.v12?.errorGenome && Object.keys(S.v12.errorGenome),
  }));
  console.log(JSON.stringify(r, null, 1));
  console.log('commons during autopsy:', JSON.stringify(log.commons.map(x => x.gsrsearch || x.titles)));
  // repair -> retest
  await page.evaluate(() => document.querySelector('[data-act="repair"]')?.click());
  await page.waitForTimeout(600);
  const rt = await page.evaluate(() => ({ next: nextAction().kind, h: [...document.querySelectorAll('#player .chip,#player h3')].map(x => x.textContent.trim()).slice(0, 6), opts: [...document.querySelectorAll('[data-act="retest-qbank"]')].map(b => b.dataset.qid).slice(0, 1) }));
  console.log('RETEST', JSON.stringify(rt));
  console.log('ERRORS', JSON.stringify(log.errors), JSON.stringify(log.console.slice(0, 5)));
  await s.close();
})();
