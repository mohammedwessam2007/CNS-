// STRICT LEARN coverage (v15.3): a question counts as taught only when ONE note section contains
// ≥ 75% of the distinctive words of the correct answer AND ≥ 40% of the distinctive words of the stem (clinical-vignette filler ignored)
// (the fact is taught together with what the question asks about, not just mentioned somewhere).
// Held-out items are reported as COUNTS ONLY (never printed) so notes are never tuned item by item to
// the sealed mock. Usage: node tests/learn_coverage_strict.js [--list] [--chapter "ANATOMY · Spinal cord"] [out.json]
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const LIST = process.argv.includes('--list');
const CH = process.argv.includes('--chapter') ? process.argv[process.argv.indexOf('--chapter') + 1] : '';
(async () => {
  const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 900 });
  const r = await s.page.evaluate(([LIST, CH]) => {
    const STOP = new Set('the of and a an to in is are by for with from on at as or its it this that which be into than their his her all following one true false not except correct statement statements regarding concerning about choose select best answer mark only both each other these those may can will does do has have been being was were more most less least also very what where when how why who whom whose there here they them then because due called known found present seen which following except true false regarding lies located situated consists contains type types part parts following'.split(' '));
    const SP = [[/fibre/g, 'fiber'], [/\bgrey/g, 'gray'], [/centre/g, 'center'], [/haem/g, 'hem'], [/oesoph/g, 'esoph'], [/oedema/g, 'edema'], [/ambiguous/g, 'ambiguus'], [/leminisc/g, 'lemnisc'], [/mamill/g, 'mammill'], [/lentiform/g, 'lenticular'], [/\b1st\b/g, 'first'], [/\b2nd\b/g, 'second'], [/\b3rd\b/g, 'third'], [/\b4th\b/g, 'fourth'], [/\b5th\b/g, 'fifth'], [/\b6th\b/g, 'sixth'], [/\b7th\b/g, 'seventh'], [/\b8th\b/g, 'eighth']];
    const norm = (t) => SP.reduce((z, [a, b]) => z.replace(a, b), String(t || '').toLowerCase().replace(/\*\*/g, '')).replace(/[^a-z0-9+]+/g, ' ').trim();
    const toks = (t) => [...new Set(norm(t).split(' ').filter((w) => (w.length > 2 || /^[a-z]\d|^\d/.test(w)) && !STOP.has(w)).map((w) => (w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ae|es|s|um|us|on|a|i|e)$/, '') : w).slice(0, 7)))];
    // clinical-vignette filler carries no fact ("a 55-year-old farmer was admitted to the ER ...")
    const VIG = new Set(toks('patient patients man woman men women boy girl child infant male female year years old day days month aged came come presented presenting presents complains complained complaining admitted admission emergency room department hospital clinic outpatient examination examined revealed reveals showed shows found finding diagnosed diagnosis likely most probably affected affection injury injured damage damaged lesion developed develops noticed history following statement statements mark select choose best one correct incorrect true false except regarding concerning which what where who when why how name named site structure structures muscle muscles nerve nerves artery arteries vein veins condition procedure responsible involved result results due cause caused causes case physician doctor surgeon operation after before during while'));
    const chapters = window.INTELLECTUALITY_LEARN_NOTES.chapters;
    const secSets = {};
    for (const c of chapters) {
      const k = c.subject + ' · ' + c.chapter;
      const secs = (secSets[k] = secSets[k] || []);
      secs.push(new Set(toks(c.big)));
      for (const x of c.s) secs.push(new Set(toks([x.h, ...(x.p || []), x.why || '', x.trap || '', ...(x.q || [])].join(' '))));
    }
    const out = { practice: { n: 0, taught: 0 }, heldout: { n: 0, taught: 0 }, chapters: {}, missing: [] };
    for (const q of EHSAN_QBANK.questions) {
      if (!q.autoScore) continue;
      const k = q.subject + ' · ' + q.chapter;
      if (CH && k !== CH) continue;
      const key = q.options.filter((o) => q.answerKeys.includes(o.key)).map((o) => o.text).join(' ');
      const kt = toks(key), st = toks(q.stem).filter((w) => !kt.includes(w) && !VIG.has(w) && !/^\d/.test(w));
      if (!kt.length) continue;
      const c = out.chapters[k] || (out.chapters[k] = { notes: !!secSets[k], practice: [0, 0], heldout: [0, 0] });
      const taught = (secSets[k] || []).some((set) => kt.filter((w) => set.has(w)).length / kt.length >= 0.75 && (!st.length || st.filter((w) => set.has(w)).length / st.length >= 0.4));
      const b = q.split === 'practice' ? 'practice' : 'heldout';
      out[b].n++;
      c[b][0]++;
      if (taught) { out[b].taught++; c[b][1]++; }
      else if (LIST && b === 'practice') out.missing.push(k + ' | #' + q.number + ' [' + q.sourceTag + '] ' + q.stem.replace(/\s+/g, ' ').slice(0, 170) + ' → ' + key.replace(/\s+/g, ' ').slice(0, 120) + (q.options.length ? '   {opts: ' + q.options.map((o) => o.key + ') ' + o.text.slice(0, 40)).join(' | ') + '}' : ''));
    }
    return out;
  }, [LIST, CH]);
  fs.writeFileSync(process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'learn_coverage_strict.json'), JSON.stringify(r, null, 1));
  console.log('STRICT practice taught', r.practice.taught + '/' + r.practice.n, '(' + ((100 * r.practice.taught) / r.practice.n).toFixed(1) + '%)');
  console.log('STRICT held-out taught', r.heldout.taught + '/' + r.heldout.n, '(' + ((100 * r.heldout.taught) / Math.max(1, r.heldout.n)).toFixed(1) + '%)  [counts only]');
  for (const [k, c] of Object.entries(r.chapters)) console.log('  ' + k.padEnd(64) + ' practice ' + c.practice[1] + '/' + c.practice[0] + '  held-out ' + c.heldout[1] + '/' + c.heldout[0] + (c.notes ? '' : '  (NO NOTES)'));
  if (LIST) for (const m of r.missing) console.log('MISS ' + m);
  await s.close();
})().catch((e) => { console.error(e); process.exit(2); });
