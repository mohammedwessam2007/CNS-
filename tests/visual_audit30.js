// Constitution §26 visual quality audit: 30 CONSECUTIVE practice MCQs in the order the course
// serves them (day → lesson → question slot), run through the real planner + anti-repeat governor.
// Commons is mocked (sandbox egress): curated files keep their real names, search rows echo the
// answer-blind query. Relevance is judged by human review of rows (stem → concept → visual).
// Usage: node tests/visual_audit30.js [out.json]
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1000 });
  const ids = await s.page.evaluate(() => {
    const keep = JSON.stringify(S.qbank.used), out = [];
    try {
      for (const d of C.days) for (const l of d.lessons || []) (l.segments || []).forEach((seg) => {
        if (out.length >= 30 || seg.type !== 'question') return;
        const q = qbankForLesson(l, d, seg.questionIndex || 0);
        if (q && q.split === 'practice' && !out.includes(q.id)) { out.push(q.id); S.qbank.used[q.id] = true; }
      });
    } finally { S.qbank.used = JSON.parse(keep); }
    return out;
  });
  const res = await s.page.evaluate(async (ids) => {
    const r = await INTELLECTUALITY_V14.audit({ ids });
    for (const row of r.rows) { const q = EHSAN_QBANK.questions.find(x => x.id === row.qid); row.stem = q.stem.slice(0, 120); row.key = q.options.filter(o => q.answerKeys.includes(o.key)).map(o => o.text).join(' | ').slice(0, 60); }
    return r;
  }, ids);
  const rows = res.rows, withV = rows.filter(r => r.primary);
  const by = (f) => rows.reduce((m, r) => ((m[f(r)] = (m[f(r)] || 0) + 1), m), {});
  const report = {
    n: rows.length,
    subjects: by(r => r.subject),
    uniquePrimary: new Set(withV.map(r => r.primary)).size,
    exactRepeat: withV.filter(r => r.repeatDistance != null).length,
    adjacentRepeat: withV.filter(r => r.repeatDistance === 1).length,
    sourceBankImage: rows.filter(r => r.sourceFigure).length,
    curatedAtlasImage: rows.filter(r => r.origin === 'file').length,
    categorySearchImage: rows.filter(r => r.origin === 'cat').length,
    genericFallback: rows.filter(r => r.origin === 'kw').length,
    noTrustworthyVisual: rows.length - withV.length,
    brokenImage: 'not measurable offline (Commons mocked); live check: INTELLECTUALITY_V14.audit({n:60}) on the site',
    irrelevant: 'human review of rows below',
    metrics: res.metrics,
  };
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'out', 'visual_audit30.json'), JSON.stringify({ report, rows }, null, 1));
  console.log(JSON.stringify(report, null, 1));
  for (const r of rows) console.log([r.i, r.subject.slice(0, 4), r.concept || '-', r.origin || '-', r.modality || '-', (r.primary || '(none)').slice(0, 60), r.repeatDistance ?? '', '|', r.stem.slice(0, 80), '→', r.key].join(' '));
  console.log('ERRORS', JSON.stringify(s.log.errors));
  await s.close();
})();
