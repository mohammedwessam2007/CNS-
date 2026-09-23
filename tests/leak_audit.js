// Exhaustive pre-answer leak audit over every practice MCQ:
//  (1) primer text (UNDERSTAND/movie/frame/exam) must not contain the exact key phrase unmasked,
//      nor ≥ half of the key's distinctive words unmasked;
//  (2) every Commons query issued while planning the pre-answer visual must be answer-blind
//      (no key-distinctive token that is absent from stem/chapter/concept vocabulary).
const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1200 });
  const { page, log } = s;
  const ids = await page.evaluate(() => EHSAN_QBANK.questions.filter(q => q.split === 'practice' && q.autoScore).map(q => q.id));
  const out = { n: ids.length, textLeaks: [], queryLeaks: [], noModel: 0, frames: 0, gaps: 0, errors: 0 };
  for (let i = 0; i < ids.length; i += 60) {
    const chunk = ids.slice(i, i + 60);
    const res = await page.evaluate(async (chunk) => {
      const V = window.INTELLECTUALITY_V14, out = [];
      const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      for (const id of chunk) {
        try {
          const q = EHSAN_QBANK.questions.find(x => x.id === id), g = V.guard(id), pc = V.primerContent(id);
          const texts = [pc.model, ...(pc.steps || []).filter(x => x.filled).map(x => x.text), pc.frame ? pc.frame.d + ' ' + pc.frame.la + ' ' + pc.frame.lb : ''].filter(Boolean);
          const keyN = norm(q.options.find(o => q.answerKeys.includes(o.key))?.text || q.answerText);
          const bad = texts.filter(t => (keyN.split(' ').length >= 2 && norm(t).includes(keyN)) || V.leaks(t, id));
          out.push({ id, bad: bad.map(x => x.slice(0, 160)), A: [...g.A], model: !!pc.model, frame: !!pc.frame, gaps: pc.gaps || 0 });
        } catch (e) { out.push({ id, err: String(e) }); }
      }
      return out;
    }, chunk);
    for (const r of res) {
      if (r.err) { out.errors++; continue; }
      if (r.bad.length) out.textLeaks.push(r);
      if (!r.model) out.noModel++;
      if (r.frame) out.frames++;
      if (r.gaps) out.gaps++;
    }
  }
  // (2) query audit: plan pre-answer visuals for a systematic sample of 150 items and inspect queries
  const sample = ids.filter((_, i) => i % 6 === 0);
  const qa = await page.evaluate(async (sample) => {
    const out = [];
    for (const id of sample) { await INTELLECTUALITY_V14.plan(id, 'pre'); out.push(id); }
    return out.length;
  }, sample);
  const guards = await page.evaluate((sample) => Object.fromEntries(sample.map(id => {
    const q = EHSAN_QBANK.questions.find(x => x.id === id), g = INTELLECTUALITY_V14.guard(id);
    return [id, { A: [...g.A], stem: q.stem, chapter: q.chapter }];
  })), sample);
  const allA = new Set(Object.values(guards).flatMap(x => x.A));
  const qTokens = log.commons.map(x => x.gsrsearch).filter(Boolean);
  // A query leaks if it contains a key-distinctive token for a sampled item that is not part of the
  // registry's own concept vocabulary (registry queries are static strings, not built from answers).
  const registryText = await page.evaluate(() => JSON.stringify(INTELLECTUALITY_V14_REGISTRY.concepts.map(c => [c.label, c.kw, c.cats])).toLowerCase());
  for (const q of new Set(qTokens)) {
    const toks = q.toLowerCase().replace(/incategory:/g, ' ').replace(/[^a-z0-9]+/g, ' ').split(' ').filter(w => w.length > 2);
    const offending = toks.filter(w => allA.has(w) && !registryText.includes(w));
    if (offending.length) out.queryLeaks.push({ q, offending });
  }
  out.queriesIssued = new Set(qTokens).size;
  out.plannedSample = qa;
  console.log(JSON.stringify({ ...out, textLeaks: out.textLeaks.length, textLeakExamples: out.textLeaks.slice(0, 8), queryLeaks: out.queryLeaks.slice(0, 10) }, null, 1));
  console.log('ERRORS', JSON.stringify(log.errors.slice(0, 5)));
  await s.close();
})();
