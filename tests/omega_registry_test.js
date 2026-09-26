// OMEGA research artefacts are data, so they are tested like code: the first-generation registry must hold ≥ 1,000
// distinct candidates after deduplication, every candidate carries the identity fields of §119, every cross-reference
// and merge resolves, and the counts quoted in the docs match the registry.
// Usage: node tests/omega_registry_test.js      (no server needed)
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '..', 'docs', 'RENAISSANCE', 'omega');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 700))); };

const lines = fs.readFileSync(path.join(R, 'registry', 'gen1_all.tsv'), 'utf8').trim().split('\n');
const cols = lines[0].split('\t');
const rows = lines.slice(1).map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v])));
const summary = JSON.parse(fs.readFileSync(path.join(R, 'registry', 'gen1_summary.json'), 'utf8'));
const byId = new Map(rows.map((r) => [r.id, r]));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const need = ['id', 'name', 'problem', 'mechanism', 'donor', 'why_missed', 'benefit', 'friction', 'machine_cost', 'risks', 'test', 'related', 'novelty', 'verdict'];
check('O1', 'The registry has the thirteen identity fields of §119 (plus id, pass and verdict) as columns', need.every((c) => cols.includes(c)), { cols });

const verdict = (r) => r.verdict.replace('[computed] ', '');
const kept = rows.filter((r) => verdict(r) === 'S');
const merged = rows.filter((r) => verdict(r).startsWith('M:'));
const rejected = rows.filter((r) => verdict(r).startsWith('R:'));
const distinct = kept.length + rejected.filter((r) => verdict(r) !== 'R:DUP').length;
check('O2', 'At least 1,000 distinct candidates remain after renamed duplicates are merged or rejected (§118, §120)', rows.length >= 1000 && distinct >= 1000, { total: rows.length, distinct });

const ids = new Set(), names = new Set(), dupIds = [], dupNames = [];
for (const r of rows) { if (ids.has(r.id)) dupIds.push(r.id); ids.add(r.id); const n = norm(r.name); if (names.has(n)) dupNames.push(r.name); names.add(n); }
check('O3', 'Ids and names are unique (no candidate counted twice under the same name)', !dupIds.length && !dupNames.length, { dupIds, dupNames });

const empty = [];
for (const r of rows) if (!verdict(r).startsWith('R:')) for (const c of ['problem', 'mechanism', 'donor', 'why_missed', 'benefit', 'risks', 'test']) if (!r[c] || r[c].trim() === '—') empty.push(r.id + ':' + c);
check('O4', 'Every kept or merged candidate has every identity field filled (a shared per-pass field is marked [pass])', empty.length === 0, empty.slice(0, 10));

const badRef = [];
for (const r of rows) {
  for (const id of (r.related_ids || '').split(' ').filter(Boolean)) if (!byId.has(id) || id === r.id) badRef.push(r.id + '→' + id);
  const v = verdict(r);
  if (v.startsWith('M:') && !rows.some((x) => x !== r && norm(x.name) === norm(v.slice(2)))) badRef.push(r.id + ' merge→' + v);
}
check('O5', 'Every related link and every merge points at a real, different candidate', badRef.length === 0, badRef.slice(0, 10));

const codes = new Set(['DUP', 'EVID', 'COST', 'TAX', 'SLOP', 'GUILT', 'ADDICT', 'TRUTH', 'COPY', 'SCOPE', 'UNTEST']);
const badV = rows.filter((r) => { const v = verdict(r); return !(v === 'S' || v.startsWith('M:') || (v.startsWith('R:') && codes.has(v.slice(2)))); }).map((r) => r.id + ':' + r.verdict);
const badN = rows.filter((r) => !['KNOWN', 'COMBO', 'UNCLEAR'].includes(r.novelty)).map((r) => r.id);
const badFC = rows.filter((r) => !/^[LMH]$/.test(r.friction) || !/^[LMH]$/.test(r.machine_cost)).map((r) => r.id);
check('O6', 'Verdicts, rejection codes, novelty labels and friction/cost grades use only the declared vocabularies', !badV.length && !badN.length && !badFC.length, { badV: badV.slice(0, 5), badN: badN.slice(0, 5), badFC: badFC.slice(0, 5) });

const unclearShare = kept.filter((r) => r.novelty === 'UNCLEAR').length / kept.length;
check('O7', 'Novelty is claimed sparingly: most kept candidates name an ancestor (KNOWN or COMBO); UNCLEAR stays under 15%', unclearShare < 0.15, { unclearShare });

const s2 = summary;
check('O8', 'The summary file matches the registry', s2.total === rows.length && s2.kept === kept.length && s2.merged === merged.length && s2.rejected === rejected.length && s2.distinct_after_dedupe === distinct, { summary: s2, counted: { total: rows.length, kept: kept.length, merged: merged.length, rejected: rejected.length, distinct } });

// the docs quote these numbers; they must not drift from the data
const doc = fs.existsSync(path.join(R, '02_REGISTRY.md')) ? fs.readFileSync(path.join(R, '02_REGISTRY.md'), 'utf8') : '';
const fmt = (n) => n.toLocaleString('en-US');
const quoted = [rows.length, distinct, kept.length, merged.length, rejected.length].every((n) => doc.includes(fmt(n)));
check('O9', 'omega/02_REGISTRY.md quotes the registry\'s own counts (total, distinct, kept, merged, rejected)', quoted, { want: [rows.length, distinct, kept.length, merged.length, rejected.length] });

// later generations: counted from their own numbered headings
const gens = fs.existsSync(path.join(R, '02_REGISTRY.md')) ? doc : '';
const countSection = (title) => { const m = new RegExp('## ' + title + '[^\\n]*\\n([\\s\\S]*?)(?=\\n## |$)').exec(gens); return m ? new Set((m[1].match(/(?:^|\s)(\d+)\.\s\*\*/g) || []).map((x) => x.trim())).size : 0; };
const g2 = countSection('Generation 2'), g3 = countSection('Generation 3'), g4 = countSection('Generation 4'), g5 = countSection('Generation 5');
check('O10', 'Later generations meet §121–§124: ≥ 100 second-generation, ≥ 50 primitives, ≥ 20 generators, ≥ 12 ontologies', g2 >= 100 && g3 >= 50 && g4 >= 20 && g5 >= 12, { g2, g3, g4, g5 });

const top = new Set(fs.readFileSync(path.join(R, 'registry', 'strongest200.tsv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t')[1]));
const g2text = (/## Generation 2[^\n]*\n([\s\S]*?)(?=\n## )/.exec(doc) || [])[1] || '';
const parents = g2text.match(/\b[LO]\d{3,4}\b/g) || [];
const outside = [...new Set(parents.filter((id) => !top.has(id)))];
const unknown = [...new Set((doc.match(/\b[LO]\d{3,4}\b/g) || []).filter((id) => !byId.has(id)))];
check('O11', 'Every second-generation parent comes from the strongest-200 selection (§121), and every id the doc cites exists', top.size === 200 && parents.length >= 200 && !outside.length && !unknown.length, { top: top.size, parents: parents.length, outside, unknown });

const fail = results.filter((r) => !r.ok).length;
console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
process.exit(fail ? 1 : 0);
