const { open, tick } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1500 });
  const { page, log } = s;
  const snap = async (label) => {
    const r = await page.evaluate(() => ({
      chip: document.querySelector('#v14Calendar')?.textContent || null,
      eyebrow: document.querySelector('#eyebrow')?.textContent,
      crumb: document.querySelector('.courseCrumb')?.textContent,
      rail: document.querySelector('.railLabel')?.textContent,
      stageHead: [...document.querySelectorAll('#player .stage .smallcaps, #player .stage h2, #player .v14PrimerFlag')].map(x => x.textContent.trim()).slice(0, 5),
      buttons: [...document.querySelectorAll('#player button')].map(b => b.textContent.trim()).slice(0, 12),
      day: S.day, segs: Object.keys(S.segments).length,
      next: nextAction().kind,
    }));
    console.log('== ' + label, JSON.stringify(r));
  };
  await snap('fresh Sep22');
  // advance through segments until a question appears
  for (let i = 0; i < 12; i++) {
    const k = await page.evaluate(() => nextAction().kind + ':' + (nextAction().seg?.type || ''));
    if (/question/.test(k)) break;
    const clicked = await page.evaluate(() => {
      const b = document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]');
      if (b) { b.click(); return b.textContent; } return null;
    });
    await page.waitForTimeout(250);
    if (!clicked) break;
  }
  await snap('at question');
  const q1 = await page.evaluate(() => { const a = nextAction(); const q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return q && { id: q.id, stem: q.stem, ans: q.answerText, keys: q.answerKeys }; });
  console.log('Q1', JSON.stringify(q1));
  await page.waitForTimeout(800);
  console.log('commons queries pre-answer:', JSON.stringify(log.commons.map(x => x.gsrsearch || x.titles)));
  // reveal primer
  await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click());
  await page.waitForTimeout(500);
  await snap('after primer reveal');
  // answer correctly
  await page.evaluate((key) => document.querySelector(`[data-act="qbank-choice"][data-choice="${key}"]`)?.click(), q1.keys[0]);
  await page.waitForTimeout(600);
  await snap('after CORRECT answer');
  const q2 = await page.evaluate(() => { const a = nextAction(); if (a.kind !== 'SEGMENT' || a.seg.type !== 'question') return null; const q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return q && { id: q.id, stem: q.stem, keys: q.answerKeys, answered: !!S.answers[qbankKey(a.d, a.l, q)]?.answered }; });
  console.log('Q shown after correct', JSON.stringify(q2));
  console.log('ERRORS', JSON.stringify(log.errors), 'CONSOLE', JSON.stringify(log.console.slice(0, 10)));
  await s.close();
})();
