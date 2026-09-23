// Visual-diversity benchmark: two systematic 60-item samples through the real planner + governor.
// Commons is mocked (sandbox egress), so curated filenames are the registry's own and search rows
// echo the answer-blind query — relevance is judged by human review of stem → concept → visual.
const fs = require('fs');
const { open } = require('./harness');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1000 });
  const runs = [];
  for (const offset of [0, 3]) {
    const r = await s.page.evaluate(async (offset) => {
      const res = await INTELLECTUALITY_V14.audit({ n: 60, offset });
      for (const row of res.rows) { const q = EHSAN_QBANK.questions.find(x => x.id === row.qid); row.stem = q.stem.slice(0, 110); }
      return res;
    }, offset);
    runs.push({ offset, ...r });
  }
  const rows = runs.flatMap(r => r.rows);
  const modal = {}; for (const r of rows) modal[r.modality || 'none'] = (modal[r.modality || 'none'] || 0) + 1;
  const origin = {}; for (const r of rows) origin[r.origin || 'none'] = (origin[r.origin || 'none'] || 0) + 1;
  // longest run of the same primary visual and same concept
  let maxRun = 0, run = 0; for (let i = 0; i < rows.length; i++) { run = i && rows[i].primary && rows[i].primary === rows[i - 1].primary ? run + 1 : 1; maxRun = Math.max(maxRun, run); }
  const out = { metrics: runs.map(r => ({ offset: r.offset, ...r.metrics })), modality: modal, origin, maxSamePrimaryRun: maxRun, rows };
  fs.writeFileSync(process.argv[2] || 'out/visual_bench.json', JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ metrics: out.metrics, modality: modal, origin, maxSamePrimaryRun: maxRun }, null, 1));
  console.log('ERRORS', JSON.stringify(s.log.errors));
  await s.close();
})();
