// Coverage oracle, requirement graph and completion ledger (§3–7, §184–192, §214, §277). No browser needed.
// Usage: node tests/coverage_oracle_test.js [--log receipts/…/full_regression.log]
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const ROOT = path.resolve(__dirname, '..');
const oracle = require('../tools/renaissance/oracle.js');
const halflife = require('../tools/renaissance/halflife.js');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 1500))); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const argLog = process.argv.includes('--log') ? process.argv[process.argv.indexOf('--log') + 1] : null;

const out = oracle.run({ log: argLog });
const L = out.ledger;
const { nodes } = require('../tools/renaissance/requirements.js');
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

// CO1 every mission section is mapped; nothing silently omitted
const counts = out.sections.reduce((a, s) => ((a[s.ref.split('.')[0]] = (a[s.ref.split('.')[0]] || 0) + 1), a), {});
const unmapped = out.sections.filter((s) => !s.nodes.length).map((s) => s.ref);
const unsourced = out.graph.filter((n) => !n.sources.length).map((n) => n.id);
check('CO1', 'Zero silent omissions (§5): all 711 numbered sections of the three missions (226 + 184 + 301) are parsed and each maps to at least one requirement; every requirement names its source sections', out.sections.length === 711 && counts.M1 === 226 && counts.M2 === 184 && counts.M3 === 301 && unmapped.length === 0 && unsourced.length === 0 && L.structuralErrors.length === 0, { counts, unmapped, unsourced, errors: L.structuralErrors.slice(0, 5) });

// CO2 schema of every requirement (§4)
const FIELDS = ['id', 'name', 'cat', 'kind', 'why', 'deps', 'status', 'docs', 'code', 'tests', 'bench', 'effect', 'blocker', 'evidence', 'sup', 'reason', 'due'];
const bad = [];
for (const n of nodes) {
  for (const f of FIELDS) if (!(f in n)) bad.push(n.id + ' lacks ' + f);
  if (n.kind !== 'rollup' && !oracle.STATUSES.includes(n.status)) bad.push(n.id + ' status ' + n.status);
  if ((n.status === 'MERGED' || n.status === 'SUPERSEDED') && !(n.sup && byId[n.sup] && n.reason)) bad.push(n.id + ' merged/superseded without a target and reason');
  if (n.status === 'REJECTED-WITH-REASON' && !n.reason) bad.push(n.id + ' rejected without reason');
  if (n.status === 'BLOCKED-EXTERNAL' && !(n.blocker && n.evidence)) bad.push(n.id + ' blocked without blocker and preparatory work');
  if (n.kind === 'empirical' && !(n.due && n.docs.length)) bad.push(n.id + ' empirical without due date and protocol');
  if (n.kind === 'frontier' && !n.docs.length) bad.push(n.id + ' frontier without a plan');
}
check('CO2', 'Requirement graph schema (§4): every requirement has id, name, source, rationale, category, dependencies, status, artifact, code, test and benchmark locations, user effect, blocker, evidence and supersession; statuses come from the allowed list; merges, rejections, blocks and empirical items carry what they must', bad.length === 0 && nodes.length >= 150, { n: nodes.length, bad: bad.slice(0, 10) });

// CO3 evidence exists for every claim; no claim is contradicted
check('CO3', 'No claim beyond its evidence: every file, symbol and test that a requirement relies on exists and every named test passed in the regression log the oracle read', L.failed.length === 0, L.failed.slice(0, 8));

// CO4 the registry is ingested (§3, §177)
const summary = JSON.parse(read('docs/RENAISSANCE/omega/registry/gen1_summary.json'));
check('CO4', 'Registry ingested (§3, §177): all 1,160 first-generation candidates are read; every kept candidate attaches to an existing requirement through its pass theme; merged and rejected counts match the registry summary', L.registry.total === summary.total && L.registry.kept === summary.kept && L.registry.merged === summary.merged && L.registry.rejected === summary.rejected && L.registry.unattached === 0 && L.registry.attachedToRequirements === summary.kept, L.registry);

// CO5 the oracle itself refuses fabricated claims (adversarial)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oracle-'));
const fakeLog = path.join(tmp, 'log');
fs.writeFileSync(fakeLog, '=== renaissance_test (x)\nPASS R1 x\nFAIL R2 y\n');
const probe = (node) => {
  const src = require.resolve('../tools/renaissance/requirements.js');
  const orig = require(src).nodes;
  orig.push(Object.assign({ id: node.id, cat: 'probe', kind: 'build', name: 'probe', why: '', deps: [], status: 'DISCOVERED', docs: [], code: [], tests: [], bench: [], effect: '', blocker: null, evidence: '', sup: null, reason: null, due: null }, node));
  const map = require('../tools/renaissance/requirement_map.js');
  map['M3.0'].push(node.id);
  try { return oracle.run({ log: fakeLog }).graph.find((n) => n.id === node.id); } finally { orig.pop(); map['M3.0'].pop(); }
};
const fabricated = [
  probe({ id: 'p-empirical', status: 'EMPIRICALLY-VALIDATED', code: ['source/public/renaissance-v1.js#function gate('], tests: ['rn:R1'] }),
  probe({ id: 'p-deployed', status: 'LIVE-VERIFIED', code: ['source/public/renaissance-v1.js#function gate('], tests: ['rn:R1'] }),
  probe({ id: 'p-notest', status: 'UNIT-TESTED', code: ['source/public/renaissance-v1.js#function gate('], tests: ['rn:R999'] }),
  probe({ id: 'p-failed', status: 'UNIT-TESTED', code: ['source/public/renaissance-v1.js#function gate('], tests: ['rn:R2'] }),
  probe({ id: 'p-nocode', status: 'IMPLEMENTED', code: ['source/public/renaissance-v1.js#function doesNotExist('] }),
  probe({ id: 'p-placeholder', status: 'UNIT-TESTED', code: [], tests: ['rn:R1'] }),
  probe({ id: 'p-blocked', status: 'BLOCKED-EXTERNAL', blocker: 'something', evidence: '' }),
];
const honest = probe({ id: 'p-honest', status: 'UNIT-TESTED', code: ['source/public/renaissance-v1.js#function gate('], tests: ['rn:R1'] });
check('CO5', 'The oracle cannot be fooled (§151, §218, §264): a claimed empirical validation, a live verification without a receipt, a test that does not exist, a failed test, a missing symbol, a tested component with no code (a placeholder) and a blocker without preparatory work are each reported as contradicted; an honest claim passes', fabricated.every((n) => n.fails.length > 0 && !n.closed) && honest.closed && !honest.fails.length, { fabricated: fabricated.map((n) => [n.id, n.fails[0]]), honest: honest.fails });

// CO6 provider neutrality and no self-granted authority: the organ makes no network call and names no model supplier
const files = fs.readdirSync(path.join(ROOT, 'source/public')).filter((f) => /^renaissance-.*\.js$/.test(f));
const net = files.filter((f) => /\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|\beval\(|new Function\(|anthropic|openai|gemini/i.test(read('source/public/' + f)));
check('CO6', 'Provider neutrality and no self-granted authority (§246, §248–249): no Renaissance file makes a network request, evaluates code or names a model supplier; every adaptive change is chosen among authored arms and can be switched off', net.length === 0 && /renaissance_experiments/.test(read('source/public/renaissance-v1.js')), { net, files: files.length });

// CO7 no neuromyths and no brain-hack claims in any teaching text (§47–48)
const myths = /neuroplasticity (ends|stops)|IQ[- ]boost|brain[- ]training|nootropic|supplement stack|10% of (the|your) brain|(left|right)[- ]brain(ed)? (people|thinkers?)|learning styles? (theory )?(is|are) (proven|real)|brain hack/i;
const hits = files.filter((f) => !/sealed/.test(f)).filter((f) => myths.test(read('source/public/' + f)));
check('CO7', 'No brain-hack nonsense or neuromyths (§47–48): no teaching text claims plasticity ends, IQ boosters, brain training, nootropics, supplement stacks, “10% of the brain” or left/right-brain people', hits.length === 0, hits);

// CO8 the ledger on disk is the oracle's own output, not a hand edit (§191–192, §277)
const disk = fs.existsSync(path.join(ROOT, 'docs/RENAISSANCE/completion/COMPLETION_LEDGER.json')) ? JSON.parse(read('docs/RENAISSANCE/completion/COMPLETION_LEDGER.json')) : null;
const fresh = disk ? oracle.run({ log: disk.log }).ledger : null;
const strip = (x) => JSON.stringify(Object.assign({}, x, { generated: null }));
const mdDisk = fs.existsSync(path.join(ROOT, 'docs/RENAISSANCE/completion/COMPLETION_LEDGER.md')) ? read('docs/RENAISSANCE/completion/COMPLETION_LEDGER.md') : '';
check('CO8', 'Completion ledger (§191–192): the committed ledger equals a fresh oracle run on the regression log it names; its counts add up; 100% is declared only when nothing controllable is open or contradicted', !!disk && strip(disk) === strip(fresh) && mdDisk.includes('Controllable completion: ' + disk.percentControllable + '%') && disk.controllableIncludingDispositions === disk.completedIncludingDispositions + disk.open.length + disk.failed.filter((f) => ['controllable', 'merged', 'superseded', 'rejected'].includes((out.graph.find((n) => n.id === f.id) || {}).class)).length && (/^100% CONTROLLABLE/.test(disk.declaration) === (disk.open.length === 0 && disk.failed.length === 0)), disk ? { disk: disk.percentControllable, fresh: fresh.percentControllable, open: disk.open.length, failed: disk.failed.length } : 'no ledger on disk');

// CO9 the 50 required artifacts (§214) are each located
const ARTIFACTS = ['REQUIREMENT_GRAPH', 'COVERAGE_ORACLE', 'COMPLETION_LEDGER', 'CULTURAL_POSSESSION_SPEC', 'MASTERPIECE_COMPILER_SPEC', 'BROTHERS_KARAMAZOV_PROTOTYPE', 'READER_TURING_BENCHMARK', 'QUOTE_ENGINE', 'PRIMARY_EXPERIENCE_ENGINE', 'LITERATURE_ORGAN', 'MATHEMATICS_ORGAN', 'SCIENCE_ORGAN', 'HISTORY_ORGAN', 'PHILOSOPHY_ORGAN', 'ART_ORGAN', 'MUSIC_ORGAN', 'FILM_ORGAN', 'ARCHITECTURE_ORGAN', 'CULTIVATION_ORGAN', 'SALON_TEST', 'MUSEUM_TEST', 'CONCERT_TEST', 'COGNITIVE_BOOTLOADER', 'MULTIPLEX_ENGINE', 'FUNCTIONAL_INTELLIGENCE_VECTOR', 'GENIUS_DELTA_BENCHMARK', 'ALIEN_PROBLEM_SUITE', 'TRANSFORMATION_METRICS', 'CAPABILITY_GENOME', 'CAPABILITY_PERIODIC_TABLE', 'REPRESENTATION_EVOLUTION', 'PERSONAL_PEDAGOGY_GENOME', 'COGNITIVE_XRAY', 'WORLD_MODEL', 'IDEA_IMMUNE_SYSTEM', 'UNKNOWN_UNKNOWN_ENGINE', 'CREATION_ENGINE', 'INVENTION_ENGINE', 'REALITY_BRIDGE', 'MEMORY_ASSIMILATION', 'UBERBOND_COUPLING_SPEC', 'EXOCORTEX_SPEC', 'FUTURE_INTERFACE_SPEC', 'NEURAL_SAFETY_CONSTITUTION', 'RIGHTS_ARCHITECTURE', 'MEDIA_REGISTRY', 'BENCHMARK_LAB', 'HOSTILE_TEST_MATRIX', 'LONGITUDINAL_PROTOCOL', 'FINAL_EVOLVED_META_MISSION'];
const idx = fs.existsSync(path.join(ROOT, 'docs/RENAISSANCE/v3/00_README.md')) ? read('docs/RENAISSANCE/v3/00_README.md') : '';
const missing = [];
ARTIFACTS.forEach((a, i) => {
  const row = idx.split('\n').find((l) => new RegExp('^\\| ' + (i + 1) + ' \\| ' + a + ' \\|').test(l));
  if (!row) return missing.push(a + ': no row');
  const locs = [...row.matchAll(/`([^`#]+?)(#[^`]*)?`/g)].map((m) => m[1]).filter((x) => /\//.test(x));
  if (!locs.length) missing.push(a + ': no location');
  for (const l of locs) if (!fs.existsSync(path.join(ROOT, l))) missing.push(a + ': ' + l + ' missing');
});
check('CO9', 'The 50 required artifacts (§214): the index lists every one in order with at least one location, and every location exists', ARTIFACTS.length === 50 && missing.length === 0, missing.slice(0, 10));

// CO10 knowledge half-life: every claim has a year and a re-verification class; the committed schedule is current
const hl = halflife.run('2026-09-26');
const hlDisk = fs.existsSync(path.join(ROOT, 'docs/RENAISSANCE/completion/REVERIFY.json')) ? JSON.parse(read('docs/RENAISSANCE/completion/REVERIFY.json')) : null;
check('CO10', 'Knowledge half-life and re-verification (§100, §133): every provenance claim has a year and a class (stable, slow, medium, fast) with its re-verification date; the committed schedule matches the claims in the seasons', hl.noYear.length === 0 && hl.total >= 100 && !!hlDisk && hlDisk.total === hl.total && JSON.stringify(hlDisk.counts) === JSON.stringify(hl.counts), { total: hl.total, counts: hl.counts, disk: hlDisk && hlDisk.counts, noYear: hl.noYear });

const failed = results.filter((r) => !r.ok);
console.log(failed.length ? failed.length + ' FAILED' : 'ALL ' + results.length + ' PASSED');
const o = process.argv.find((a, i) => i > 1 && /\.json$/.test(a));
if (o) fs.writeFileSync(o, JSON.stringify({ when: new Date().toISOString(), results }, null, 1));
process.exit(failed.length ? 1 : 0);
