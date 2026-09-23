const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1200 });
  const { page } = s;
  for (let i = 0; i < 12; i++) {
    const k = await page.evaluate(() => nextAction().seg?.type || '');
    if (k === 'question') break;
    await page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]')?.click());
    await page.waitForTimeout(200);
  }
  const r = await page.evaluate(() => {
    const a = nextAction(), q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0), g = INTELLECTUALITY_V14.guard(q.id), pc = INTELLECTUALITY_V14.primerContent(q.id);
    return { id: q.id, stem: q.stem, opts: q.options.map(o => o.key + ') ' + o.text), key: q.answerKeys, A: [...g.A], D: [...g.D], model: pc.model, cloze: pc.cloze, frame: pc.frame && { la: pc.frame.la, lb: pc.frame.lb, d: pc.frame.d }, intent: pc.intent, cmd: pc.cmd, concepts: INTELLECTUALITY_V14.conceptsForQ(q.id), feed: S.v14.feed, pins: S.v14.pins };
  });
  console.log(JSON.stringify(r, null, 1));
  await s.close();
})();
