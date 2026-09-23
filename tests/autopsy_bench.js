// Wrong-answer autopsy benchmark: deliberate misses on the most tempting distractor.
const fs = require('fs');
const { open } = require('./harness');
const PICKS = [
  // [category, stem regex, chosen-option regex (the tempting look-alike)]
  ['ANATOMY', /spinal cord ends at/i, /L3/],
  ['ANATOMY', /meninges.*select the correct statement/i, /denticulate/i],
  ['ANATOMY', /superior oblique/i, /oculomotor|abducens/i],
  ['ANATOMY', /taste sensations to anterior 2\/3/i, /glossopharyngeal|vagus|hypoglossal/i],
  ['PHYSIOLOGY', /excitatory postsynaptic potential/i, /summat/i],
  ['PHYSIOLOGY', /stretch reflex/i, null],
  ['PHYSIOLOGY', /color vision|colour vision/i, null],
  ['PHYSIOLOGY', /hypermetrop/i, null],
  ['HISTOLOGY', /myelin sheath around myelinated axons in CNS/i, /schwann/i],
  ['HISTOLOGY', /ganglia|ganglion/i, null],
  ['HISTOLOGY', /peripheral nerve|nerve fib/i, null],
  ['HISTOLOGY', /retina|photoreceptor/i, null],
  ['HISTOLOGY', /cerebellar cortex/i, null],
  ['LESION', /hemisection|brown.?s[eé]quard/i, null],
  ['LESION', /UMN lesion|upper motor neuron lesion/i, null],
  ['LESION', /LMNL of the hypoglossal|tongue.*deviat/i, null],
  ['TRACT', /lateral spinothalamic/i, null],
  ['TRACT', /decussation of internal arcuate|pyramidal decussation|corticospinal/i, null],
  ['TRACT', /dorsal column|gracile|cuneate|medial lemniscus/i, null],
  ['LESION', /opposite side|same side|contralateral|ipsilateral/i, null],
  ['TRACT', /spinothalamic|spinocerebellar|rubrospinal|tectospinal|vestibulospinal/i, null],
  ['POLARITY', /except|not true|incorrect/i, null],
];
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1000 });
  const rows = await s.page.evaluate((picks) => {
    const out = [], used = new Set();
    for (const [cat, sre, cre] of picks) {
      const re = new RegExp(sre[0], sre[1]);
      const ok = x => x.split === 'practice' && x.autoScore && re.test(x.stem) && !used.has(x.id), NEG = /\b(except|not|false|incorrect|wrong)\b/i;
      const q = EHSAN_QBANK.questions.find(x => ok(x) && !NEG.test(x.stem)) || EHSAN_QBANK.questions.find(ok);
      if (!q) { out.push({ cat, missing: sre[0] }); continue; }
      used.add(q.id);
      const wrongs = q.options.filter(o => !q.answerKeys.includes(o.key));
      const pick = (cre && wrongs.find(o => new RegExp(cre[0], cre[1]).test(o.text))) || wrongs.map(o => ({ o, a: INTELLECTUALITY_V14.autopsy(q.id, o.key) })).sort((a, b) => (b.a.contrast ? 2 : 0) + (b.a.cls !== 'retrieval' ? 1 : 0) - ((a.a.contrast ? 2 : 0) + (a.a.cls !== 'retrieval' ? 1 : 0)))[0].o;
      const a = INTELLECTUALITY_V14.autopsy(q.id, pick.key);
      out.push({ cat, id: q.id, stem: q.stem, key: q.options.filter(o => q.answerKeys.includes(o.key)).map(o => o.text).join(' | '), chosen: pick.text, cls: a.cls, cmd: a.cmd.ar + ' (' + a.cmd.en + ')', contrast: a.contrast ? a.contrast.c.id + ' [' + a.contrast.key.label + ' vs ' + a.contrast.other.label + ']' : (a.frame ? 'frame:' + a.frame.id : ''), discriminator: a.d, felt: a.felt });
    }
    return out;
  }, PICKS.map(([c, s, x]) => [c, [s.source, s.flags], x ? [x.source, x.flags] : null]));
  // distinct distractor visual (engine-level with mocked Commons): run full UI repair for each
  for (const r of rows.filter(r => r.id)) {
    const res = await s.page.evaluate(async ({ id, chosen }) => {
      const q = EHSAN_QBANK.questions.find(x => x.id === id), sel = q.options.find(o => o.text === chosen).key;
      const box = document.createElement('div'); box.innerHTML = INTELLECTUALITY_V14.autopsy ? '' : '';
      const div = document.createElement('div'); div.style.cssText = 'position:fixed;top:0;left:0;width:600px'; document.body.appendChild(div);
      div.innerHTML = '<div class="v14Compare"><div class="v14AutopsyVisual" data-v14-side="correct" data-v14-qid="' + id + '" data-v14-sel="' + sel + '"></div><div class="v14AutopsyVisual" data-v14-side="wrong" data-v14-qid="' + id + '" data-v14-sel="' + sel + '"></div></div>';
      wire(); await new Promise(r => setTimeout(r, 1500));
      const c = div.querySelector('[data-v14-side="correct"]').innerText.replace(/\s+/g, ' ').slice(0, 140), w = div.querySelector('[data-v14-side="wrong"]').innerText.replace(/\s+/g, ' ').slice(0, 160);
      div.remove(); return { correctSide: c, wrongSide: w };
    }, r);
    Object.assign(r, res);
  }
  fs.writeFileSync(process.argv[2] || 'autopsy_bench.json', JSON.stringify(rows, null, 1));
  for (const r of rows) console.log(JSON.stringify(r, null, 1));
  console.log('ERRORS', JSON.stringify(s.log.errors));
  await s.close();
})();
