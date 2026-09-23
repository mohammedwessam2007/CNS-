// LEARN coverage: does each chapter's lecture notes teach what its questions ask?
// A question counts as taught when ≥ 75% of the distinctive words of its correct answer appear in
// the chapter's notes (same lexical rule as the pre-v15 baseline audit: 288/915 practice, 107/398
// held-out). Held-out items are reported as COUNTS ONLY (never printed), so the notes cannot be
// tuned item by item to the sealed mock.
// Usage: node tests/learn_coverage.js [--list] [out.json]
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const LIST = process.argv.includes('--list');
(async () => {
  const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 900 });
  const r = await s.page.evaluate((LIST) => {
    const STOP = new Set('the of and a an to in is are by for with from on at as or its it this that which be into than their his her all following one true false not except correct statement statements regarding concerning about choose select best answer mark only both each other these those may can will does do has have been being was were more most less least also only'.split(' '));
    const SP = [[/fibre/g, 'fiber'], [/\bgrey/g, 'gray'], [/centre/g, 'center'], [/haem/g, 'hem'], [/oesoph/g, 'esoph'], [/oedema/g, 'edema'], [/ambiguous/g, 'ambiguus'], [/leminisc/g, 'lemnisc'], [/mamill/g, 'mammill'], [/lentiform/g, 'lenticular'], [/\b1st\b/g, 'first'], [/\b2nd\b/g, 'second'], [/\b3rd\b/g, 'third'], [/\b4th\b/g, 'fourth'], [/\b5th\b/g, 'fifth'], [/\b6th\b/g, 'sixth'], [/\b7th\b/g, 'seventh'], [/\b8th\b/g, 'eighth'], [/\b9th\b/g, 'ninth'], [/\b10th\b/g, 'tenth'], [/\b11th\b/g, 'eleventh'], [/\b12th\b/g, 'twelfth'], [/\bequine\b/g, 'equina'], [/\bterminal\b/g, 'terminale']];
    const norm = t => SP.reduce((z, [a, b]) => z.replace(a, b), String(t || '').toLowerCase()).replace(/[^a-z0-9+]+/g, ' ').trim();
    const toks = t => norm(t).split(' ').filter(w => w.length > 2 && !STOP.has(w)).map(w => (w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ae|es|s|um|us|on|a|i|e)$/, '') : w).slice(0, 7));
    const V15 = window.INTELLECTUALITY_V15, chapters = V15.chapters();
    const have = new Set(chapters.map(c => c.subject + ' · ' + c.chapter));
    const out = { practice: { n: 0, taught: 0 }, heldout: { n: 0, taught: 0 }, chapters: {}, missing: [], noNotes: [] };
    const cache = {};
    for (const q of EHSAN_QBANK.questions) {
      if (!q.autoScore) continue;
      const k = q.subject + ' · ' + q.chapter;
      const key = q.options.filter(o => q.answerKeys.includes(o.key)).map(o => o.text).join(' ');
      const kt = [...new Set(toks(key))];
      if (!kt.length) continue;
      const c = out.chapters[k] || (out.chapters[k] = { notes: have.has(k), practice: [0, 0], heldout: [0, 0] });
      const set = cache[k] || (cache[k] = new Set(toks(V15.noteText(k))));
      const taught = kt.filter(w => set.has(w)).length / kt.length >= 0.75;
      const b = q.split === 'practice' ? 'practice' : 'heldout';
      out[b].n++; c[b][0]++;
      if (taught) { out[b].taught++; c[b][1]++; }
      else if (LIST && b === 'practice' && have.has(k)) out.missing.push(k + ' | ' + q.number + ' | ' + q.stem.slice(0, 90) + ' → ' + key.slice(0, 90));
    }
    out.noNotes = Object.keys(out.chapters).filter(k => !have.has(k));
    out.sections = chapters.reduce((z, c) => z + c.sections, 0);
    out.nChapters = chapters.length;
    return out;
  }, LIST);
  fs.writeFileSync(process.argv.find(a => a.endsWith('.json')) || path.join(__dirname, 'out', 'learn_coverage.json'), JSON.stringify(r, null, 1));
  console.log('chapters with notes', r.nChapters, '· sections', r.sections, '· chapters without notes', r.noNotes.length);
  console.log('practice taught', r.practice.taught + '/' + r.practice.n, '(' + (100 * r.practice.taught / r.practice.n).toFixed(1) + '%)');
  console.log('held-out taught', r.heldout.taught + '/' + r.heldout.n, '(' + (100 * r.heldout.taught / r.heldout.n).toFixed(1) + '%)  [counts only]');
  for (const [k, c] of Object.entries(r.chapters)) if (c.notes) console.log('  ' + k.padEnd(62) + ' practice ' + c.practice[1] + '/' + c.practice[0] + '  held-out ' + c.heldout[1] + '/' + c.heldout[0]);
  if (LIST) for (const m of r.missing) console.log('MISS ' + m);
  console.log('ERRORS', JSON.stringify(s.log.errors));
  await s.close();
})();
