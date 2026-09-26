#!/usr/bin/env node
// RENAISSANCE coverage oracle (§3–7, §184–185, §191–192, §277).
//
// It reads the three mission texts, the requirement graph (requirements.js + requirement_map.js), the source, the docs,
// the test files, the latest regression log and the mechanism registry, and decides for every requirement whether its
// claimed status is supported by evidence. Two kinds of finding:
//   FAIL  a claim contradicted by evidence (a named test missing, not run or failing; a file or symbol absent; a
//         status the evidence cannot support). Any FAIL exits 1.
//   OPEN  controllable work not yet closed. Reported in the ledger; exits 1 only with --strict.
// Empirical and frontier requirements are never counted as closed: they are queued (§6, §169, §193).
//
// Usage: node tools/renaissance/oracle.js [--log receipts/v18_1/full_regression.log] [--write] [--strict] [--quiet]
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const rel = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(rel(p));
const read = (p) => fs.readFileSync(rel(p), 'utf8');

const STATUSES = ['DISCOVERED', 'SPECIFIED', 'DESIGNED', 'PROTOTYPED', 'IMPLEMENTED', 'UNIT-TESTED', 'INTEGRATION-TESTED', 'ADVERSARIALLY-TESTED', 'BENCHMARKED', 'DEPLOYED', 'LIVE-VERIFIED', 'EMPIRICALLY-VALIDATED', 'SUPERSEDED', 'MERGED', 'ARCHIVED', 'BLOCKED-EXTERNAL', 'REJECTED-WITH-REASON'];
const LADDER = STATUSES.slice(0, 12);
const rank = (s) => LADDER.indexOf(s);
const KINDS = ['build', 'guard', 'doc', 'process', 'principle', 'rollup', 'empirical', 'frontier'];
const FIELDS = ['id', 'name', 'cat', 'kind', 'why', 'deps', 'status', 'docs', 'code', 'tests', 'bench', 'effect', 'blocker', 'evidence', 'sup', 'reason', 'due'];
const MISSIONS = [['M1', 'docs/RENAISSANCE/missions/01_RENAISSANCE_SINGULARITY.txt'], ['M2', 'docs/RENAISSANCE/missions/02_OMEGA.txt'], ['M3', 'docs/RENAISSANCE/missions/03_ABSOLUTE_COMPLETION.txt']];
const SUITES = { rn: 'tests/renaissance_test.js', v3: 'tests/renaissance_v3_test.js', om: 'tests/omega_registry_test.js', co: 'tests/coverage_oracle_test.js', host: 'tests/hostile_test.js' };
const SUITE_OF_HEADER = { renaissance_test: 'rn', renaissance_v3_test: 'v3', omega_registry_test: 'om', coverage_oracle_test: 'co', hostile_test: 'host' };

function sections() {
  const out = [];
  for (const [tag, file] of MISSIONS) {
    const t = read(file).split('\n');
    t.forEach((l, i) => {
      const m = /^\s*(\d{1,3})\.\s+(.+?)\s*$/.exec(l);
      if (!m) return;
      const prev = t.slice(Math.max(0, i - 3), i).filter((x) => x.trim());
      if (prev.length && /^[#=]{10,}/.test(prev[prev.length - 1].trim())) out.push({ ref: tag + '.' + m[1], title: m[2], file, line: i + 1 });
    });
  }
  return out;
}

// the latest regression log: "=== suite (where)" headers, then "PASS ID …" / "FAIL ID …" lines; a test passes only if
// it passed in every run that reports it (source and Vercel build)
function latestLog() {
  const dirs = fs.readdirSync(rel('receipts')).filter((d) => /^v\d+(_\d+)*$/.test(d) && fs.existsSync(rel('receipts/' + d + '/full_regression.log')));
  dirs.sort((a, b) => { const x = a.slice(1).split('_').map(Number), y = b.slice(1).split('_').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); return 0; });
  return dirs.length ? 'receipts/' + dirs[dirs.length - 1] + '/full_regression.log' : null;
}
function results(logPath) {
  const res = {};
  if (!logPath || !fs.existsSync(path.resolve(ROOT, logPath))) return { res, runs: {} };
  let suite = null;
  const runs = {};
  for (const l of fs.readFileSync(path.resolve(ROOT, logPath), 'utf8').split('\n')) {
    const h = /^=== (\S+)/.exec(l);
    if (h) {
      suite = SUITE_OF_HEADER[h[1]] || null;
      if (suite) runs[suite] = (runs[suite] || 0) + 1;
      continue;
    }
    const m = /^(PASS|FAIL) ([A-Z]+\d+)\b/.exec(l);
    if (m && suite) {
      const k = suite + ':' + m[2];
      res[k] = res[k] === 'FAIL' ? 'FAIL' : m[1];
    }
  }
  return { res, runs };
}
const testIds = {};
function testDeclared(ref) {
  const [s, id] = ref.split(':');
  if (!SUITES[s]) return false;
  if (!testIds[s]) testIds[s] = exists(SUITES[s]) ? new Set([...read(SUITES[s]).matchAll(/check\(\s*['"]([A-Z]+\d+)['"]/g)].map((m) => m[1])) : new Set();
  return testIds[s].has(id);
}
const fileCache = {};
function refOk(ref) {
  const i = ref.indexOf('#');
  const p = i < 0 ? ref : ref.slice(0, i), needle = i < 0 ? null : ref.slice(i + 1);
  if (!exists(p)) return 'missing file ' + p;
  if (needle) {
    fileCache[p] = fileCache[p] || read(p);
    if (!fileCache[p].includes(needle)) return 'missing “' + needle + '” in ' + p;
  }
  return null;
}

function registry(nodeIds, themes) {
  const f = 'docs/RENAISSANCE/omega/registry/gen1_all.tsv';
  const rows = read(f).trim().split('\n');
  const head = rows.shift().split('\t');
  const col = (r, k) => r[head.indexOf(k)];
  const strong = new Set(read('docs/RENAISSANCE/omega/registry/strongest200.tsv').trim().split('\n').slice(1).map((l) => l.split('\t')[1]));
  const out = { total: 0, kept: 0, merged: 0, rejected: 0, rejectedBy: {}, attached: {}, unattached: [], strongest: {}, themes: {} };
  for (const line of rows) {
    const r = line.split('\t');
    out.total++;
    const v = col(r, 'verdict'), pass = +col(r, 'pass');
    if (/^R:/.test(v)) { out.rejected++; out.rejectedBy[v.slice(2)] = (out.rejectedBy[v.slice(2)] || 0) + 1; continue; }
    if (/M:/.test(v)) { out.merged++; continue; }
    out.kept++;
    const node = themes[pass];
    out.themes[pass] = node || null;
    if (!node || !nodeIds.has(node)) { out.unattached.push(col(r, 'id')); continue; }
    out.attached[node] = (out.attached[node] || 0) + 1;
    if (strong.has(col(r, 'id'))) (out.strongest[node] = out.strongest[node] || []).push(col(r, 'id'));
  }
  return out;
}

function inventory() {
  const g = {};
  const w = { window: {} };
  const ctx = require('vm').createContext(w);
  for (const f of ['s1', 's2', 's3a', 's3b', 's3c', 'civ', 'genome', 'media']) {
    const p = 'source/public/renaissance-' + f + '.js';
    if (exists(p)) require('vm').runInContext(read(p), ctx);
  }
  const S = w.window.RENAISSANCE_SEASONS || [];
  g.seasons = S.length;
  g.sessions = S.reduce((a, z) => a + (z.sessions || []).length, 0);
  g.steps = S.reduce((a, z) => a + (z.sessions || []).reduce((b, s) => b + s.steps.length, 0), 0);
  g.quotes = S.reduce((a, z) => a + Object.keys(z.quotes || {}).length, 0);
  g.models = S.reduce((a, z) => a + Object.keys(z.models || {}).length, 0);
  g.visuals = S.reduce((a, z) => a + Object.keys(z.visuals || {}).length, 0);
  g.civNodes = Object.keys((w.window.RENAISSANCE_CIV || {}).nodes || {}).length;
  g.atoms = Object.keys((w.window.RENAISSANCE_GENOME || {}).atoms || {}).length;
  g.source = fs.readdirSync(rel('source/public')).filter((f) => /^renaissance-/.test(f)).length;
  const walk = (d) => fs.readdirSync(rel(d)).flatMap((f) => (fs.statSync(rel(d + '/' + f)).isDirectory() ? walk(d + '/' + f) : [d + '/' + f]));
  g.docs = walk('docs/RENAISSANCE').filter((f) => /\.(md|json|tsv|txt)$/.test(f)).length;
  g.tests = Object.fromEntries(Object.entries(SUITES).map(([k, f]) => [k, exists(f) ? [...read(f).matchAll(/check\(\s*['"]([A-Z]+\d+)['"]/g)].length : 0]));
  return g;
}

function run(opts = {}) {
  const { nodes, themes } = require('./requirements.js');
  delete require.cache[require.resolve('./requirement_map.js')];
  const map = require('./requirement_map.js');
  const logPath = opts.log || latestLog();
  const { res, runs } = results(logPath);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const errors = []; // structural: the graph itself is wrong
  // sections ↔ map
  const secs = sections();
  const secRefs = new Set(secs.map((s) => s.ref));
  for (const s of secs) if (!map[s.ref] || !map[s.ref].length) errors.push('section ' + s.ref + ' (' + s.title + ') is mapped to no requirement');
  for (const k of Object.keys(map)) if (!secRefs.has(k)) errors.push('map names ' + k + ', which is not a section of the missions');
  const sources = {};
  for (const [k, ids] of Object.entries(map)) for (const id of ids) {
    if (!byId[id]) errors.push(k + ' maps to unknown requirement ' + id);
    else (sources[id] = sources[id] || []).push(k);
  }
  for (const n of nodes) {
    if (!sources[n.id]) {
      if (n.cat === 'empirical') sources[n.id] = ['M3.193', 'M3.284'];
      else errors.push('requirement ' + n.id + ' has no source section');
    }
    for (const f of FIELDS) if (!(f in n)) errors.push(n.id + ' lacks field ' + f);
    if (!STATUSES.includes(n.status) && n.kind !== 'rollup') errors.push(n.id + ' has an invalid status ' + n.status);
    if (!KINDS.includes(n.kind)) errors.push(n.id + ' has an invalid kind ' + n.kind);
    for (const d of n.deps) if (!byId[d]) errors.push(n.id + ' depends on unknown ' + d);
  }
  const ids = nodes.map((n) => n.id);
  ids.forEach((x, i) => { if (ids.indexOf(x) !== i) errors.push('duplicate requirement id ' + x); });

  // evaluate every node
  const ev = {};
  const evaluate = (n, seen = new Set()) => {
    if (ev[n.id]) return ev[n.id];
    if (seen.has(n.id)) return { closed: false, cls: 'controllable', fails: ['dependency cycle'], open: [] };
    seen.add(n.id);
    const fails = [], open = [];
    let cls = 'controllable', closed = false, status = n.status;
    const refs = (arr, what) => arr.map(refOk).filter(Boolean).map((x) => what + ': ' + x);
    const testsOk = () => {
      if (!n.tests.length) return ['no test named'];
      const p = [];
      for (const t of n.tests) {
        if (!testDeclared(t)) { p.push('test ' + t + ' is not declared in ' + (SUITES[t.split(':')[0]] || 'a known suite')); continue; }
        if (!res[t]) p.push('test ' + t + ' was not run in ' + (logPath || 'any regression log'));
        else if (res[t] !== 'PASS') p.push('test ' + t + ' FAILED in ' + logPath);
      }
      return p;
    };
    if (n.kind === 'rollup') {
      // §277: a dependency blocked by a documented external constraint, with its preparatory work done, is excluded
      const sub = n.deps.map((d) => [d, evaluate(byId[d], seen)]);
      const excluded = sub.filter(([, e]) => e.cls === 'external' && !e.fails.length).map(([d]) => d);
      const notClosed = sub.filter(([d, e]) => !e.closed && !excluded.includes(d)).map(([d]) => d);
      closed = notClosed.length === 0;
      status = closed ? 'IMPLEMENTED' : 'DESIGNED';
      if (!closed) open.push('waits on ' + notClosed.join(', '));
      if (excluded.length) n.rollupExcluded = excluded;
    } else if (n.status === 'REJECTED-WITH-REASON') {
      cls = 'rejected';
      if (!n.reason) fails.push('rejected without a documented reason');
      closed = !fails.length;
    } else if (n.status === 'SUPERSEDED' || n.status === 'MERGED') {
      cls = n.status === 'MERGED' ? 'merged' : 'superseded';
      if (!n.sup || !byId[n.sup]) fails.push('names no existing requirement it was ' + n.status.toLowerCase() + ' into');
      else if (!evaluate(byId[n.sup], seen).closed) open.push('its successor ' + n.sup + ' is not closed');
      if (!n.reason) fails.push(n.status.toLowerCase() + ' without saying why');
      closed = !fails.length && !open.length;
    } else if (n.status === 'BLOCKED-EXTERNAL') {
      cls = 'external';
      if (!n.blocker) fails.push('blocked without naming the blocker');
      if (!n.evidence) fails.push('blocked without the preparatory work (§277)');
      closed = false;
    } else if (n.kind === 'empirical') {
      cls = 'empirical';
      if (!n.due) fails.push('empirical requirement without a due date');
      fails.push(...refs(n.docs, 'protocol'));
      if (rank(n.status) >= rank('EMPIRICALLY-VALIDATED')) fails.push('claims empirical validation without a data receipt');
    } else if (n.kind === 'frontier') {
      cls = 'frontier';
      if (!n.docs.length) fails.push('frontier requirement without a written plan');
      fails.push(...refs(n.docs, 'plan'));
    } else {
      if (rank(n.status) < 0) fails.push('status ' + n.status + ' is not on the ladder');
      if (rank(n.status) >= rank('EMPIRICALLY-VALIDATED')) fails.push('claims empirical validation without a data receipt');
      if (rank(n.status) >= rank('DEPLOYED') && !/receipts\//.test(n.evidence || '')) fails.push('claims ' + n.status + ' without a deployment receipt');
      if (rank(n.status) >= rank('IMPLEMENTED')) fails.push(...refs(n.code, 'code'), ...refs(n.docs, 'doc'));
      if (rank(n.status) >= rank('UNIT-TESTED')) fails.push(...testsOk());
      if (n.kind === 'build' || n.kind === 'guard') {
        if (rank(n.status) >= rank('UNIT-TESTED') && !n.code.length) fails.push('tested build with no code location');
        closed = rank(n.status) >= rank('UNIT-TESTED') && !fails.length;
        if (!closed && !fails.length) open.push('status ' + n.status + ': needs code and a passing test');
      } else if (n.kind === 'doc') {
        closed = rank(n.status) >= rank('IMPLEMENTED') && n.docs.length > 0 && !fails.length;
        if (!closed && !fails.length) open.push(n.docs.filter((d) => refOk(d)).length ? 'document not written: ' + n.docs.filter((d) => refOk(d)).join(', ') : 'status ' + n.status);
      } else if (n.kind === 'process') {
        closed = rank(n.status) >= rank('IMPLEMENTED') && (n.docs.length || n.tests.length || n.evidence) && !fails.length;
        if (!closed && !fails.length) open.push('status ' + n.status);
      } else if (n.kind === 'principle') {
        closed = rank(n.status) >= rank('IMPLEMENTED') && (n.docs.length || n.tests.length) > 0 && !fails.length;
        if (!closed && !fails.length) open.push('no enforcing guard or document yet (status ' + n.status + ')');
      }
    }
    const out = { closed: !!closed && !fails.length, cls, fails, open, status };
    ev[n.id] = out;
    return out;
  };
  nodes.forEach((n) => evaluate(n));
  const reg = registry(new Set(ids), themes);
  for (const [p, node] of Object.entries(reg.themes)) if (!node) errors.push('registry pass ' + p + ' has no owning requirement');
  if (reg.unattached.length) errors.push(reg.unattached.length + ' kept registry candidates attach to no requirement');

  const lastVerified = logPath && fs.existsSync(path.resolve(ROOT, logPath)) ? fs.statSync(path.resolve(ROOT, logPath)).mtime.toISOString().slice(0, 10) : null;
  const graph = nodes.map((n) => Object.assign({}, n, { status: ev[n.id].status, sources: sources[n.id] || [], closed: ev[n.id].closed, class: ev[n.id].cls, fails: ev[n.id].fails, open: ev[n.id].open, lastVerified: ev[n.id].closed ? lastVerified : null, registryCandidates: reg.attached[n.id] || 0, strongest: reg.strongest[n.id] || [] }));
  const L = ledger(graph, secs, reg, logPath, runs, errors);
  return { graph, sections: secs.map((s) => Object.assign({}, s, { nodes: map[s.ref] || [] })), registry: reg, inventory: inventory(), ledger: L, errors, log: logPath };
}

function ledger(graph, secs, reg, logPath, runs, errors) {
  const by = (f) => graph.filter(f);
  const ctl = by((n) => n.class === 'controllable');
  const L = {
    generated: new Date().toISOString(),
    log: logPath,
    suitesInLog: runs,
    sections: secs.length,
    requirements: graph.length,
    controllable: ctl.length,
    completed: ctl.filter((n) => n.closed).length,
    open: ctl.filter((n) => !n.closed && !n.fails.length).map((n) => ({ id: n.id, name: n.name, status: n.status, why: n.open.join('; ') })),
    failed: graph.filter((n) => n.fails.length).map((n) => ({ id: n.id, name: n.name, fails: n.fails })),
    blockedExternal: by((n) => n.class === 'external').map((n) => ({ id: n.id, name: n.name, blocker: n.blocker, prep: n.evidence })),
    empiricalFuture: by((n) => n.class === 'empirical').map((n) => ({ id: n.id, name: n.name, due: n.due, protocol: n.evidence })),
    frontier: by((n) => n.class === 'frontier').map((n) => ({ id: n.id, name: n.name, status: n.status, plan: n.docs })),
    superseded: by((n) => n.class === 'superseded').map((n) => ({ id: n.id, into: n.sup, reason: n.reason })),
    merged: by((n) => n.class === 'merged').map((n) => ({ id: n.id, into: n.sup, reason: n.reason })),
    rejected: by((n) => n.class === 'rejected').map((n) => ({ id: n.id, reason: n.reason })),
    registry: { total: reg.total, kept: reg.kept, merged: reg.merged, rejected: reg.rejected, rejectedBy: reg.rejectedBy, attachedToRequirements: Object.values(reg.attached).reduce((a, b) => a + b, 0), unattached: reg.unattached.length },
    structuralErrors: errors,
  };
  // closed controllable counts include merged and rejected requirements whose disposition is complete
  const disposed = graph.filter((n) => (n.class === 'merged' || n.class === 'superseded' || n.class === 'rejected') && n.closed).length;
  L.controllableIncludingDispositions = L.controllable + graph.filter((n) => ['merged', 'superseded', 'rejected'].includes(n.class)).length;
  L.completedIncludingDispositions = L.completed + disposed;
  L.percentControllable = +((100 * L.completedIncludingDispositions) / L.controllableIncludingDispositions).toFixed(1);
  L.declaration = L.failed.length === 0 && L.open.length === 0 && L.structuralErrors.length === 0 ? '100% CONTROLLABLE RENAISSANCE COMPLETION criteria met by the oracle (the other §7 analyses must also be run)' : 'not declared: ' + L.open.length + ' open, ' + L.failed.length + ' contradicted, ' + L.structuralErrors.length + ' structural errors';
  return L;
}

function mdLedger(out) {
  const L = out.ledger;
  const row = (a) => '| ' + a.join(' | ') + ' |';
  let s = '# Renaissance completion ledger\n\nGenerated by `tools/renaissance/oracle.js` from the requirement graph, the source, the docs and the regression log `' + L.log + '`. Do not edit by hand: the coverage test regenerates it and fails if it differs.\n\n';
  s += row(['', 'count']) + '\n' + row(['---', '---']) + '\n';
  for (const [k, v] of [['Mission sections mapped', L.sections], ['Canonical requirements', L.requirements], ['Controllable (incl. merged, superseded, rejected)', L.controllableIncludingDispositions], ['Completed', L.completedIncludingDispositions], ['Open controllable', L.open.length], ['Contradicted by evidence (FAILED)', L.failed.length], ['Blocked external', L.blockedExternal.length], ['Empirical future', L.empiricalFuture.length], ['Perpetual frontier (open by design)', L.frontier.length], ['Merged', L.merged.length], ['Superseded', L.superseded.length], ['Rejected with reason', L.rejected.length]]) s += row([k, v]) + '\n';
  s += '\n**Controllable completion: ' + L.percentControllable + '%.** ' + L.declaration + '.\n';
  const list = (title, arr, f) => (arr.length ? '\n## ' + title + '\n\n' + arr.map(f).join('\n') + '\n' : '');
  s += list('Open controllable requirements', L.open, (x) => '- `' + x.id + '` ' + x.name + ' — ' + x.status + (x.why ? ' (' + x.why + ')' : ''));
  s += list('Contradicted by evidence', L.failed, (x) => '- `' + x.id + '` ' + x.name + ': ' + x.fails.join('; '));
  s += list('Blocked external', L.blockedExternal, (x) => '- `' + x.id + '` ' + x.name + ' — blocker: ' + x.blocker + '. Preparatory work: ' + x.prep);
  s += list('Empirical future queue', L.empiricalFuture, (x) => '- `' + x.id + '` ' + x.name + ' — due ' + x.due + '. ' + x.protocol);
  s += list('Perpetual frontier (never counted as closed)', L.frontier, (x) => '- `' + x.id + '` ' + x.name + ' — plan: ' + x.plan.join(', '));
  s += list('Merged and superseded', L.merged.concat(L.superseded), (x) => '- `' + x.id + '` → `' + x.into + '`: ' + x.reason);
  s += list('Rejected with reason', L.rejected, (x) => '- `' + x.id + '`: ' + x.reason);
  s += '\n## Registry ingested (§3, §177)\n\n' + L.registry.total + ' first-generation candidates: ' + L.registry.kept + ' kept, each attached to the requirement that owns its theme (' + L.registry.attachedToRequirements + ' attached, ' + L.registry.unattached + ' unattached); ' + L.registry.merged + ' merged; ' + L.registry.rejected + ' rejected with codes ' + Object.entries(L.registry.rejectedBy).map(([k, v]) => k + ' ' + v).join(', ') + '. A kept candidate is a design in its requirement\'s pool, not a claim that it is built.\n';
  s += list('Structural errors', L.structuralErrors, (x) => '- ' + x);
  return s;
}

if (require.main === module) {
  const a = process.argv.slice(2);
  const opt = { log: a.includes('--log') ? a[a.indexOf('--log') + 1] : null };
  const out = run(opt);
  const L = out.ledger;
  if (a.includes('--write')) {
    const dir = rel('docs/RENAISSANCE/completion');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'REQUIREMENT_GRAPH.json'), JSON.stringify({ generated: L.generated, log: out.log, inventory: out.inventory, statuses: STATUSES, nodes: out.graph, sections: out.sections, registry: out.registry }, null, 1) + '\n');
    fs.writeFileSync(path.join(dir, 'COMPLETION_LEDGER.json'), JSON.stringify(L, null, 1) + '\n');
    fs.writeFileSync(path.join(dir, 'COMPLETION_LEDGER.md'), mdLedger(out));
  }
  if (!a.includes('--quiet')) {
    console.log('sections ' + L.sections + ' · requirements ' + L.requirements + ' · controllable ' + L.controllableIncludingDispositions + ' · completed ' + L.completedIncludingDispositions + ' (' + L.percentControllable + '%) · open ' + L.open.length + ' · FAILED ' + L.failed.length + ' · external ' + L.blockedExternal.length + ' · empirical ' + L.empiricalFuture.length + ' · frontier ' + L.frontier.length + ' · structural errors ' + L.structuralErrors.length);
    for (const e of L.structuralErrors) console.log('ERROR ' + e);
    for (const f of L.failed) console.log('FAILED ' + f.id + ': ' + f.fails.join('; '));
    for (const o of L.open) console.log('OPEN ' + o.id + ' (' + o.status + ') ' + o.why);
  }
  // --check: the ledger on disk must be exactly what the oracle computes from the log it names (never hand-edited)
  if (a.includes('--check')) {
    const f = rel('docs/RENAISSANCE/completion/COMPLETION_LEDGER.json');
    const disk = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
    const strip = (x) => JSON.stringify(Object.assign({}, x, { generated: null }));
    const same = !!disk && strip(disk) === strip(run({ log: disk.log }).ledger) && fs.readFileSync(rel('docs/RENAISSANCE/completion/COMPLETION_LEDGER.md'), 'utf8') === mdLedger(run({ log: disk.log }));
    console.log((same ? 'PASS' : 'FAIL') + ' LEDGER the committed completion ledger equals a fresh oracle run on ' + (disk ? disk.log : '(no ledger)'));
    process.exit(same ? 0 : 1);
  }
  process.exit(L.structuralErrors.length || L.failed.length || (a.includes('--strict') && L.open.length) ? 1 : 0);
}
module.exports = { run, sections, results, ledger, mdLedger, STATUSES, SUITES, latestLog };
