// Renaissance v3 (ABSOLUTE COMPLETION): season 3 and the organs, the masterpiece compiler, the quote engine, the
// session compiler, safe trials beyond picture order, sealed measurement with a leak firewall, extended counterfeit
// learners, the learner model, device independence, failure recovery, accessibility and performance.
// Usage: node tests/renaissance_v3_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const harness = require('./harness');
const seal = require('../tools/renaissance/seal');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 1200))); };
const open = (o = {}) => harness.open(Object.assign({ v16: true, settle: 1200 }, o));
const STOP = (p) => p.evaluate(() => { nextAction = () => ({ kind: 'STOP' }); render(); });
const cur = (p) => p.evaluate(() => RENAISSANCE.current());
const go = (p) => p.evaluate(() => document.querySelector('#rnRoot [data-rn="go"]').click());
async function answerRight(p, conf) {
  return p.evaluate((conf) => {
    const c = RENAISSANCE.current(), all = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions);
    const ses = all.find((x) => x.id === c.sid);
    let opts = null;
    const step = ses && ses.steps.find((x) => x.id === c.id);
    if (step) opts = step.type === 'contrast' ? step.q.options : step.options;
    if (!opts && c.id.startsWith('hook:')) { const hid = c.id.slice(5); for (const x of all) for (const h of x.hooks) if (h.id === hid) opts = h.q.options; }
    if (!opts && c.id.startsWith('probe:')) { const k = c.id.slice(6).split('@')[0]; opts = RENAISSANCE.unseal(k).options; }
    const k = opts.findIndex((o) => o.ok);
    document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
    document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
    document.querySelector('#rnRoot [data-rn="commit"][data-c="' + (conf || 'think') + '"]').click();
    return k;
  }, conf);
}
async function forge(p) {
  await p.evaluate(() => {
    const keys = [...new Set([...document.querySelectorAll('#rnRoot [data-rn="slot"]')].map((b) => b.dataset.s))];
    for (const k of keys) document.querySelector('#rnRoot [data-rn="slot"][data-s="' + k + '"]:not([disabled])')?.click();
    document.querySelector('#rnRoot [data-rn="forge"]')?.click();
    document.querySelector('#rnRoot .rnCrit [data-rn="pick"]')?.click();
    document.querySelector('#rnRoot .rnCrit [data-rn="commit"][data-c="sure"]')?.click();
  });
}
async function runToEnd(p, onStep) {
  for (let i = 0; i < 60; i++) {
    const c = await cur(p);
    if (!c) return true;
    if (onStep) await onStep(c);
    if (c.type === 'q' || c.type === 'contrast') await answerRight(p);
    if (c.type === 'forge') await forge(p);
    if (c.type === 'reality') await p.evaluate(() => document.querySelector('#rnRoot [data-rn="reality"]').click());
    const ok = await p.evaluate(() => !document.querySelector('#rnRoot [data-rn="go"]').disabled);
    if (!ok) return false;
    await go(p);
  }
  return false;
}
// a record in which the given sessions are finished long ago (their hooks are not due)
const doneState = (ids, extra) => Object.assign({ v: 1, sessions: Object.fromEntries(ids.map((id, i) => [id, { start: 1, done: true, end: 1000 + i, endDay: '2026-08-0' + ((i % 9) + 1) }])), days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, exp: {}, picks: [], reads: {}, deeper: {}, forecasts: {} }, extra || {});
const S1 = ['commit', 'select', 'base', 'loop', 'proxy', 'falsify'];
const S2 = ['bottleneck', 'question', 'snow', 'double', 'taste', 'boss'];
const OFF = { renaissance_probes: 'off', renaissance_experiments: 'off' };

(async () => {
  // ── 1. static: season 3 structure, organs, works, quotes, provenance, coverage ──
  {
    const s = await open({ time: '2026-09-26T19:00:00+03:00', state: null, localStorage: OFF });
    const p = s.page;
    const st = await p.evaluate(() => {
      const Z = window.RENAISSANCE_SEASONS, z3 = Z.find((z) => z.id === 's3'), CIV = window.RENAISSANCE_CIV, bad = [];
      const all = Z.flatMap((z) => z.sessions);
      const ids = new Set(all.map((x) => x.id));
      const quotes = Object.assign({}, ...Z.map((z) => z.quotes || {}));
      for (const ses of z3.sessions) {
        if (!ses.domain) bad.push(ses.id + ' no domain');
        for (const w of ses.works || []) if (!CIV.nodes[w]) bad.push(ses.id + ' work not in the graph: ' + w);
        for (const r of ses.requires || []) if (!ids.has(r)) bad.push(ses.id + ' requires unknown ' + r);
        for (const stp of ses.steps.concat(ses.hooks.map((h) => ({ id: h.id, poss: h.poss })))) {
          for (const [w, k] of Object.entries(stp.poss || {})) { if (!CIV.nodes[w]) bad.push(ses.id + ':' + stp.id + ' poss work ' + w); if (!['context', 'structure', 'primary', 'argument', 'criticism', 'discuss', 'quote', 'compare', 'apply'].includes(k)) bad.push(ses.id + ':' + stp.id + ' poss rung ' + k); }
          for (const q of stp.quotes || []) if (!quotes[q]) bad.push(ses.id + ':' + stp.id + ' unregistered quote ' + q);
          if (stp.type === 'passage' && !(stp.quotes || []).length) bad.push(ses.id + ':' + stp.id + ' passage without a quotation');
        }
      }
      for (const [id, q] of Object.entries(quotes)) for (const f of ['text', 'speaker', 'work', 'rights', 'context', 'meaning', 'matters', 'misattribution', 'verified']) if (!q[f]) bad.push('quote ' + id + ' lacks ' + f);
      for (const [id, q] of Object.entries(quotes)) if (!/public domain|short quotation/.test(q.rights)) bad.push('quote ' + id + ' rights class ' + q.rights);
      const edgesOk = CIV.edges.every((e) => CIV.nodes[e.a] && CIV.nodes[e.b]);
      const domains = [...new Set(z3.sessions.map((x) => x.domain))];
      const deep = z3.sessions.filter((x) => x.deep).map((x) => x.id);
      return { bad, n: z3.sessions.length, domains, edgesOk, nodes: Object.keys(CIV.nodes).length, edges: CIV.edges.length, deep, quotes: Object.keys(quotes).length };
    });
    check('V1', 'Season 3 has 16 sessions covering literature, poetry, philosophy, evidence, mathematics, science, art, music, history, conversation, cultivation, language, film and architecture; every work, rung, requirement and quotation it names exists; every quotation record is complete and rights-classed', st.n === 16 && st.bad.length === 0 && ['literature', 'poetry', 'philosophy', 'evidence', 'mathematics', 'science', 'art', 'music', 'history', 'conversation', 'cultivation', 'language', 'film', 'architecture'].every((d) => st.domains.includes(d)), st);
    check('V2', 'The civilisation graph links works, people, ideas and places with no dangling edge; only the trial (a boss world) is a deep session', st.edgesOk && st.nodes >= 60 && st.edges >= 50 && st.deep.join() === 'km3', { nodes: st.nodes, edges: st.edges, deep: st.deep });
    const cov = await p.evaluate(() => {
      const all = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions.map((x) => Object.assign({ season: z.id }, x)));
      // teaching text only: citations (provenance) and the session's region label do not count as content
      const text = (x) => JSON.stringify(Object.assign({}, x, { provenance: [], region: '' })).toLowerCase();
      // §26 global coverage: each region must be the setting of real content somewhere
      const REG = { 'Middle East': /baghdad|isfahan|iraq|iran|abbasid/, 'North Africa': /cairo|egypt|luxor|nubian/, 'Sub-Saharan Africa': /timbuktu|mali/, 'South Asia': /india/, 'East Asia': /japan|ozu|tokyo/, 'Central Asia': /samarkand|bukhara|central asia/, 'Southeast Asia': /angkor|khmer|hanoi|philippines/, Europe: /vienna|london|russia|seville|toledo/, Americas: /us physicians|wells fargo|colombia|american/, Oceania: /micronesia|puluwat|pacific/ };
      const regions = Object.fromEntries(Object.entries(REG).map(([k, re]) => [k, all.filter((x) => re.test(text(x))).map((x) => x.id)]));
      // §35 bootloader primitives: each must be trained by at least one session
      const PRIM = { causality: /caus/, feedback: /feedback|loop/, selection: /selection|filter|survivor/, incentives: /incentive|reward|target/, uncertainty: /uncertain/, probability: /probab|base rate/, information: /information|decisive question/, networks: /graph|bridges|network/, constraints: /constraint|slowest/, optimization: /least material|minimum|optimi/, equilibrium: /equilibrium|balance/, emergence: /grows from|emerg|whole wall/, recursion: /recursion|recursive/, scale: /scale|doubling|exponential/, representation: /representation|picture/, counterfactuals: /counterfactual|suppose|had not/, 'model selection': /explanations|rival stor|model selection/, mechanism: /mechanism/, measurement: /measure/, evidence: /evidence/, 'signal and noise': /noise|signal|false alarm/ };
      const prims = Object.fromEntries(Object.entries(PRIM).map(([k, re]) => [k, all.filter((x) => re.test(text(x))).length]));
      return { regions, prims };
    });
    const missingRegions = Object.entries(cov.regions).filter(([, v]) => !v.length).map(([k]) => k);
    check('V3', 'Global reach: every one of the ten world regions appears in the content at least as a case (depth is uneven; the coverage oracle tracks which regions have a session of their own), and every one of the 21 bootloader primitives is trained somewhere', missingRegions.length === 0 && Object.values(cov.prims).every((n) => n > 0), { missingRegions, regions: Object.fromEntries(Object.entries(cov.regions).map(([k, v]) => [k, v.length])), prims: cov.prims });
    await s.close();
  }

  // ── 2. walk every season-3 session end to end; passages, the quote record, listening, dialogue ──
  {
    const s = await open({ time: '2026-09-26T19:00:00+03:00', state: null, localStorage: Object.assign({ renaissance_v1: doneState([...S1, ...S2]) }, OFF), viewport: { width: 390, height: 844 } });
    const p = s.page;
    const seen = { passages: 0, sourceRecords: 0, plays: 0, dialogues: 0, sessions: [], errors: [] };
    const order = await p.evaluate(() => window.RENAISSANCE_SEASONS.find((z) => z.id === 's3').sessions.map((x) => x.id));
    let day = 26;
    for (let n = 0; n < order.length; n++) {
      await STOP(p);
      const g = await p.evaluate(() => { const g = RENAISSANCE.gate(new Date()); return { open: g.open, why: g.why, sid: g.plan && g.plan.sid }; });
      if (!g.open) { seen.errors.push('day ' + day + ' closed: ' + g.why); break; }
      await p.evaluate(() => RENAISSANCE.open());
      const ok = await runToEnd(p, async (c) => {
        if (c.type === 'passage') {
          seen.passages++;
          const rec = await p.evaluate(() => { document.querySelector('#rnRoot .rnPassage [data-rn="source"]').click(); const t = document.querySelector('#rnRoot .rnSheet')?.textContent || ''; document.querySelector('#rnRoot [data-rn="unsheet"]').click(); return t; });
          if (/Exact words/.test(rec) && /Rights/.test(rec) && /How the wording was checked/.test(rec) && /Misattribution risk/.test(rec)) seen.sourceRecords++;
        }
        const pl = await p.evaluate(() => { const b = document.querySelector('#rnRoot [data-rn="play"], #rnRoot [data-rn="playModel"]'); if (!b) return 0; const before = RENAISSANCE.audio.plays(); b.click(); return RENAISSANCE.audio.plays() - before; });
        seen.plays += pl;
        if (await p.evaluate(() => !!document.querySelector('#rnRoot .rnDialog .rnSay'))) seen.dialogues++;
      });
      const done = await p.evaluate((sid) => !!(RENAISSANCE.state().sessions[sid] || {}).done, g.sid);
      seen.sessions.push(g.sid + (ok && done ? '' : ' (stuck)'));
      // next day, evening
      day++;
      const d = new Date('2026-09-' + String(day).padStart(2, '0') + 'T19:00:00+03:00');
      if (day > 30) break;
      await p.clock.setFixedTime(d);
    }
    const errs = s.log.errors.slice(0, 3);
    check('V4', 'Every season-3 session in the first five compiled days runs end to end on a phone (predictions, primary text, model, contrast, transfer, forge, receipt) with no page error', seen.sessions.length >= 5 && seen.sessions.every((x) => !/stuck/.test(x)) && !seen.errors.length && !errs.length, { seen: seen.sessions, errors: seen.errors, pageErrors: errs });
    check('V5', 'Primary text: passages render whole with speaker, place and rights; SHOW SOURCE opens the quotation record (exact words, rights, misattribution risk, how it was checked); synthesised listening plays; dialogue renders', seen.passages >= 2 && seen.sourceRecords === seen.passages && (seen.plays >= 1 || !/cadence/.test(seen.sessions.join())) , seen);
    await s.close();
  }

  // ── 3. every season-3 session, opened directly: it completes, its receipt names possession, and its audio has the right notes ──
  {
    const bad = [], receipts = {};
    const s = await open({ time: '2026-09-28T19:00:00+03:00', state: null, localStorage: OFF });
    const p = s.page;
    // every season-3 session, read from the season itself so a new session is played through too
    const order = await p.evaluate(() => window.RENAISSANCE_SEASONS.find((z) => z.id === 's3').sessions.map((x) => x.id));
    for (const sid of order) {
      const when = sid === 'km3' ? '2026-10-03T19:00:00+03:00' : '2026-09-28T19:00:00+03:00';
      await p.clock.setFixedTime(new Date(when));
      const others = order.filter((x) => x !== sid);
      await p.evaluate(([st]) => { localStorage.setItem('renaissance_v1', JSON.stringify(st)); RENAISSANCE.reload(); }, [doneState([...S1, ...S2, ...(sid === 'km3' ? others : others.filter((x) => x !== 'km3'))])]);
      await STOP(p);
      const g = await p.evaluate(() => { const g = RENAISSANCE.gate(new Date()); return { open: g.open, sid: g.plan && g.plan.sid, why: g.why }; });
      if (!g.open || g.sid !== sid) {
        // km3 needs km1 and km2; with every other session done the compiler must pick exactly the one left (or km3 on a Saturday)
        if (!(sid !== 'km3' && g.sid === 'km3')) { bad.push(sid + ': compiler picked ' + g.sid + ' (' + g.why + ')'); continue; }
      }
      await p.evaluate(() => RENAISSANCE.open());
      const ok = await runToEnd(p);
      const rec = await p.evaluate((sid) => (RENAISSANCE.state().sessions[sid] || {}).receipt || [], g.sid);
      receipts[g.sid] = rec.find((l) => /Possession/.test(l)) || '';
      if (!ok || !rec.length) bad.push(g.sid + ' did not finish');
    }
    const aud = await p.evaluate(() => {
      const z = window.RENAISSANCE_SEASONS.find((y) => y.id === 's3');
      const c6 = z.sessions.find((x) => x.id === 'cadence').steps.find((x) => x.id === 'c6');
      const sch = RENAISSANCE.audio.schedule(c6.listen[0].seq);
      const hz = (m) => +(440 * Math.pow(2, (m - 69) / 12)).toFixed(2);
      return { n: sch.length, neutral: sch.some((x) => Math.abs(x.f - hz(63.5)) < 0.02), major: sch.some((x) => Math.abs(x.f - hz(64)) < 0.02), minor: sch.some((x) => Math.abs(x.f - hz(63)) < 0.02) };
    });
    check('V6', 'Each season-3 session completes when it is the one left, and works that the session teaches appear in its receipt with a rung of the possession ladder', bad.length === 0 && /Possession/.test(receipts.km1 || '') && /Brothers Karamazov/.test(receipts.km1 || ''), { bad, km1: receipts.km1, ozy: receipts.ozy });
    check('V7', 'Listening is synthesised from exact pitches: the maqam example plays E, E-flat and the neutral third between them (a quarter-tone above E-flat)', aud.n === 15 && aud.neutral && aud.major && aud.minor, aud);
    check('V8', 'No page errors while completing every season-3 session', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 4. the session compiler ──
  {
    const s = await open({ time: '2026-09-28T19:00:00+03:00', state: null, localStorage: { renaissance_probes: 'off', renaissance_v1: doneState([...S1, ...S2]) } });
    const p = s.page;
    await STOP(p);
    const mon = await p.evaluate(() => RENAISSANCE.compile(new Date()));
    // walk 25 weekday evenings: record mode, and whether km3 (deep) was ever chosen on a weekday
    const walk = await p.evaluate(() => {
      const out = [];
      for (let d = 0; d < 40; d++) {
        const t = new Date(Date.UTC(2026, 9, 1 + d, 16, 0));
        const c = RENAISSANCE.compile(t);
        out.push({ day: t.toISOString().slice(0, 10), dow: t.getDay(), mode: c && c.mode, sid: c && c.sid });
      }
      return out;
    });
    const controlDays = walk.filter((w) => w.mode === 'control').length, compiled = walk.filter((w) => w.mode === 'compiled').length;
    check('C1', 'After the bootloader (seasons 1–2) the compiler scores the remaining sessions from capability gaps, errors, unpossessed works, rotation and dependants, and says why', mon && mon.mode !== 'bootloader' && mon.ranked.length >= 10 && mon.ranked.every((r) => typeof r.score === 'number' && r.reasons.length) && /Compiled for you|written order on purpose/.test(mon.why), { mode: mon && mon.mode, why: mon && mon.why, top: mon && mon.ranked.slice(0, 3) });
    check('C2', 'Trial L10: one compiled day in about five keeps the written order as a control; the rest follow the compiler', controlDays >= 3 && controlDays <= 16 && compiled >= 20, { controlDays, compiled });
    // deep session: km3 only on Friday/Saturday
    const deep = await p.evaluate(() => {
      const st = RENAISSANCE.state();
      st.sessions.km1 = { start: 1, done: true, end: 1, endDay: '2026-09-01' };
      st.sessions.km2 = { start: 1, done: true, end: 2, endDay: '2026-09-02' };
      // every other season-3 session finished, so only the deep one is left
      for (const x of window.RENAISSANCE_SEASONS.find((z) => z.id === 's3').sessions) if (!x.deep && !st.sessions[x.id]) st.sessions[x.id] = { start: 1, done: true, end: 3, endDay: '2026-09-03' };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      const mon = RENAISSANCE.gate(new Date('2026-09-28T19:00:00+03:00')), fri = RENAISSANCE.gate(new Date('2026-10-02T19:00:00+03:00'));
      return { mon: { open: mon.open, why: mon.why, msg: mon.msg }, fri: { open: fri.open, sid: fri.plan && fri.plan.sid, dose: fri.dose } };
    });
    check('C3', 'Deep sessions (the trial, a boss world) are compiled only on the weekend, with a 45-minute dose; on a weekday the door says it waits for the weekend', !deep.mon.open && deep.mon.why === 'deepwait' && /weekend/.test(deep.mon.msg) && deep.fri.open && deep.fri.sid === 'km3' && deep.fri.dose === 45, deep);
    // resume: a started session continues before anything else is compiled
    const resume = await p.evaluate(() => {
      const st = RENAISSANCE.state();
      delete st.sessions.km3; delete st.sessions.km1; delete st.sessions.km2;
      st.sessions.euler = { start: 5, at: 'e3' };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      return RENAISSANCE.compile(new Date('2026-09-29T19:00:00+03:00'));
    });
    check('C4', 'A started session always continues first; nothing is compiled in the middle of one', resume && resume.sid === 'euler' && resume.mode === 'resume', resume);
    const sobj = await p.evaluate(() => window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).map((x) => RENAISSANCE.sessionObject(x.id)));
    const incomplete = sobj.filter((o) => !(o.targetCapabilities.length && o.sourceObjects.length && o.irreducibleExperiences.length && o.tasks.length >= 4 && o.misconceptionBranches >= 6 && o.transfer.length >= 2 && o.forge.length === 1 && o.memoryHooks.length >= 3 && o.expectedMinutes > 0 && o.stopCondition && o.rights.length)).map((o) => o.id);
    check('C5', 'Every session of every season compiles to the full session object (§161): capabilities, sources, irreducible experiences, tasks, misconception branches, transfer, forge, hooks, minutes, stop condition, rights', incomplete.length === 0 && sobj.length >= 24, { n: sobj.length, incomplete });
    await s.close();
  }

  // ── 5. safe trials beyond picture order ──
  {
    const s = await open({ time: '2026-09-28T19:00:00+03:00', state: null, localStorage: { renaissance_probes: 'off' } });
    const p = s.page;
    const r = await p.evaluate(() => {
      const base = { v: 1, sessions: {}, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, picks: [], reads: {}, deeper: {}, forecasts: {} };
      const mk = (arm0, arm1, n0, n1) => ({ log: [...Array(n0).keys()].map((i) => ({ t: i, unit: 'a' + i, arm: 0, v: arm0 })).concat([...Array(n1).keys()].map((i) => ({ t: 100 + i, unit: 'b' + i, arm: 1, v: arm1 }))), verdict: null, caution: 1, history: [] });
      const out = {};
      // L6 adopted when ×2 clearly beats ×2.5; dropped when not better; harm when below the floor
      for (const [name, a0, a1] of [['adopt', 0.5, 0.8], ['drop', 0.7, 0.6], ['harm', 0.7, 0.2]]) {
        const st = JSON.parse(JSON.stringify(base));
        st.exp = { L6: mk(a0, a1, 10, 9) };
        localStorage.setItem('renaissance_v1', JSON.stringify(st));
        RENAISSANCE.reload();
        // one more logged outcome triggers the judge through a real hook answer path is long; call the judge through the public report after logging via the engine's own log function
        const e = RENAISSANCE.experiments();
        out[name] = e;
      }
      return out;
    });
    // the judge runs when an outcome is logged; drive it through real hook answers
    const judged = await p.evaluate(() => {
      const res = {};
      const all = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions);
      const hook = all.find((x) => x.id === 'commit').hooks[0];
      for (const [name, a0, a1] of [['adopt', 0.5, 0.8], ['drop', 0.7, 0.6], ['harm', 0.7, 0.2]]) {
        const st = { v: 1, sessions: { commit: { start: 1, done: true, end: 1, endDay: '2026-09-01' } }, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, picks: [], reads: {}, deeper: {}, forecasts: {} };
        st.exp = { L6: { log: [...Array(10).keys()].map((i) => ({ t: i, unit: 'x' + i, arm: 0, v: a0 })).concat([...Array(9).keys()].map((i) => ({ t: 100 + i, unit: 'y' + i, arm: 1, v: a1 }))), verdict: null, caution: 1, history: [] } };
        // the pending outcome: this hook was last stretched on arm 1; answering it logs the tenth arm-1 unit
        st.hooks[hook.id] = { due: '2026-09-28', gap: 2, n: 1, ok: 1, arm: 1 };
        localStorage.setItem('renaissance_v1', JSON.stringify(st));
        RENAISSANCE.reload();
        nextAction = () => ({ kind: 'STOP' });
        RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
        let c = RENAISSANCE.current();
        while (c && c.id !== 'hook:' + hook.id) { RENAISSANCE.act.go(); c = RENAISSANCE.current(); }
        const k = hook.q.options.findIndex((o) => (a1 >= 0.5 ? o.ok : !o.ok));
        document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
        document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
        document.querySelector('#rnRoot [data-rn="commit"][data-c="sure"]').click();
        RENAISSANCE.close();
        res[name] = RENAISSANCE.experiments().find((e) => e.id === 'L6');
      }
      return res;
    });
    check('E1', 'Trials (L2 step order, L3 step length, L4 session length, L5 hints, L6 spacing, L7 task type, L8 source mix, L9 session architecture, L10 season order, L11 capability priority) each have a control arm, a minimum sample, a success margin and a no-harm floor; the judge adopts a clearly better arm, drops one that is not better, and stops one below the floor', judged.adopt.verdict === 'adopted' && judged.drop.verdict === 'dropped' && judged.harm.verdict === 'harm' && r.adopt.length === 10 && r.adopt.map((e) => e.level).join() === '2,3,4,5,6,7,8,9,10,11', { adopt: judged.adopt.verdict, drop: judged.drop.verdict, harm: judged.harm.verdict, levels: r.adopt.map((e) => e.level) });
    // L2 order: a session on the "cases first" arm plays its contrast before its model
    const order = await p.evaluate(() => {
      const out = {};
      for (const sid of ['bottleneck', 'question', 'snow', 'double', 'taste', 'euler', 'willow', 'pattern', 'arch']) {
        const ses = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).find((x) => x.id === sid);
        const st = { v: 1, sessions: Object.fromEntries(window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).filter((x) => x.id !== sid).map((x) => [x.id, { start: 1, done: true, end: 1, endDay: '2026-08-01' }])), days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, exp: {}, picks: [], reads: {}, deeper: {}, forecasts: {} };
        // already started, so the session-length trial (L4, fresh sessions only) does not split it
        st.sessions[sid] = { start: 1 };
        localStorage.setItem('renaissance_v1', JSON.stringify(st));
        RENAISSANCE.reload();
        const g = RENAISSANCE.gate(new Date('2026-09-28T19:00:00+03:00'));
        if (!g.open || g.plan.sid !== sid) { out[sid] = 'not planned'; continue; }
        const types = g.plan.steps.filter((x) => x.type === 'model' || x.type === 'contrast').map((x) => x.type);
        out[sid] = types.join('>');
      }
      return out;
    });
    const arms = Object.values(order);
    check('E2', 'Trial L2 really changes the lesson: some sessions play the two compared cases before the model and others keep the written order, by a stable per-session assignment', arms.includes('contrast>model') && arms.includes('model>contrast') && !arms.includes('not planned'), order);
    // kill switch: with experiments off, every session keeps the written order and the compiler follows written order
    const off = await p.evaluate(() => {
      localStorage.setItem('renaissance_experiments', 'off');
      const st = { v: 1, sessions: {}, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, exp: {}, picks: [], reads: {}, deeper: {}, forecasts: {} };
      for (const x of window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions)) if (x.id !== 'bottleneck') st.sessions[x.id] = { start: 1, done: true, end: 1, endDay: '2026-08-01' };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      const g = RENAISSANCE.gate(new Date('2026-09-28T19:00:00+03:00'));
      localStorage.removeItem('renaissance_experiments');
      return g.plan.steps.filter((x) => x.type === 'model' || x.type === 'contrast').map((x) => x.type).join('>');
    });
    check('E3', 'Rollback: renaissance_experiments = "off" returns every trial to the written lesson at once', off === 'model>contrast', { off });
    // level 14: an adopted arm that later does worse than its monitoring control is rolled back and the judge becomes more cautious
    const meta = await p.evaluate(() => {
      const st = { v: 1, sessions: { commit: { start: 1, done: true, end: 1, endDay: '2026-09-01' } }, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, picks: [], reads: {}, deeper: {}, forecasts: {} };
      const hook = window.RENAISSANCE_SEASONS[0].sessions[0].hooks[0];
      st.exp = { L6: { log: [...Array(5).keys()].map((i) => ({ t: 5000 + i, unit: 'c' + i, arm: 0, v: 1 })).concat([...Array(9).keys()].map((i) => ({ t: 6000 + i, unit: 'd' + i, arm: 1, v: 0.5 }))), verdict: 'adopted', decidedAt: 1000, caution: 1, history: [{ t: 1000, to: 'adopted' }] } };
      st.hooks[hook.id] = { due: '2026-09-28', gap: 2, n: 1, ok: 1, arm: 1 };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      nextAction = () => ({ kind: 'STOP' });
      RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
      let c = RENAISSANCE.current();
      while (c && c.id !== 'hook:' + hook.id) { RENAISSANCE.act.go(); c = RENAISSANCE.current(); }
      const k = hook.q.options.findIndex((o) => !o.ok);
      document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
        document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
      document.querySelector('#rnRoot [data-rn="commit"][data-c="sure"]').click();
      RENAISSANCE.close();
      return RENAISSANCE.experiments().find((e) => e.id === 'L6');
    });
    check('E4', 'Level 14 (the judge judged): an adopted arm that later does worse than its monitoring control is rolled back, and that trial then needs a larger sample (caution ×1.5)', meta.verdict === 'running' && meta.caution === 1.5 && meta.history.some((h) => h.to === 'rolled back'), meta);
    check('E5', 'No page errors in the trial checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 6. sealed measurement ──
  {
    const s = await open({ time: '2026-09-28T19:00:00+03:00', state: null, localStorage: { renaissance_experiments: 'off' } });
    const p = s.page;
    await STOP(p);
    const d0 = await p.evaluate(() => { const g = RENAISSANCE.gate(new Date()); return g.plan.steps.map((x) => x.id); });
    await p.evaluate(() => RENAISSANCE.open());
    const first = await p.evaluate(() => ({ c: RENAISSANCE.current(), banner: document.querySelector('#rnRoot .rnBanner')?.textContent || '', tag: document.querySelector('#rnRoot .rnKind')?.textContent || '', dis: ['smd', 'xray', 'already'].map((k) => document.querySelector('#rnRoot [data-rn="' + k + '"]').disabled) }));
    await answerRight(p, 'sure');
    const fb = await p.evaluate(() => document.querySelector('#rnRoot .rnFb')?.textContent || '');
    const stored = await p.evaluate(() => localStorage.getItem('renaissance_v1'));
    const stemA01 = await p.evaluate(() => RENAISSANCE.unseal('A01').stem);
    check('P1', 'Day 0: the baseline form opens the first day (two sealed items before the session), unlabelled, with every helper off', d0[0] === 'probe:A01@0' && d0[1] === 'probe:A02@0' && d0.includes('c1') && first.c.stage === 'probe' && /Measuring where you are/.test(first.banner) && /MEASURED/.test(first.tag) && first.dis.every(Boolean), { d0: d0.slice(0, 4), first });
    check('P2', 'A form item gives no right/wrong feedback (it returns at day 90), and the stored record keeps only its id and outcome, never its words', /No feedback on this one/.test(fb) && !/✓|✗/.test(fb) && stored.includes('A01@0') && !stored.includes(stemA01.slice(0, 40)), { fb: fb.slice(0, 120) });
    const sched = await p.evaluate(() => {
      const st = RENAISSANCE.state();
      const at = (d) => { RENAISSANCE.reload(); const g = RENAISSANCE.gate(new Date(d + 'T19:00:00+03:00')); return g.open ? g.plan.steps.filter((x) => x.stage === 'probe').map((x) => x.id) : ['closed:' + g.why]; };
      // pretend the baseline was taken, then look at later days
      st.probe.start = '2026-09-28';
      for (const k of ['A01@0', 'A02@0', 'A03@0', 'A04@0', 'A05@0', 'A06@0', 'A07@0', 'A08@0']) st.probe.done[k] = { t: 1, ok: true, conf: 'think', form: 'A' };
      st.sessions = {};
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      const out = { d7: at('2026-10-05'), d30: at('2026-10-28'), examWeek: at('2026-11-10') };
      // a window missed by more than 14 days is skipped, never owed
      out.d50 = at('2026-11-17');
      return out;
    });
    check('P3', 'Schedule: this week\'s unknown problem arrives on day 7; the parallel form B on day 30; nothing in exam week (short dose); a window missed by more than two weeks is skipped, not owed', sched.d7.join() === 'probe:W01a@7,probe:W01b@7' && sched.d30.every((x) => /probe:B0/.test(x)) && sched.d30.length === 2 && sched.examWeek.length === 0 && !sched.d50.some((x) => /W0[1-4]|B0/.test(x)), sched);
    const alienFb = await p.evaluate(() => {
      nextAction = () => ({ kind: 'STOP' });
      RENAISSANCE.reload();
      RENAISSANCE.open(new Date('2026-10-05T19:00:00+03:00'));
      let c = RENAISSANCE.current();
      while (c && !c.id.startsWith('probe:W01a')) { RENAISSANCE.act.go(); c = RENAISSANCE.current(); }
      const opts = RENAISSANCE.unseal('W01a').options, k = opts.findIndex((o) => o.ok);
      document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
        document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
      document.querySelector('#rnRoot [data-rn="commit"][data-c="sure"]').click();
      const fb = document.querySelector('#rnRoot .rnFb')?.textContent || '';
      RENAISSANCE.close();
      return { fb, rep: RENAISSANCE.probes().report, vec: RENAISSANCE.vector().find((v) => v.id === 'orientation') };
    });
    check('P4', 'A weekly unknown problem is used once, so it explains itself after you commit; results feed the orientation dimension of the capability vector, never the in-session rates', /Right/.test(alienFb.fb) && alienFb.rep.alien && alienFb.rep.alien.n === 1 && alienFb.vec.n >= 1, alienFb);
    const rt = await p.evaluate(() => {
      const st = RENAISSANCE.state();
      st.probe.start = '2026-09-01';
      for (const k of ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08']) st.probe.done[k + '@30'] = { t: 1, ok: true, conf: 'think', form: 'B' };
      st.sessions.km3 = { start: 1, done: true, end: 1, endDay: '2026-09-10' };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      const before = RENAISSANCE.gate(new Date('2026-10-09T19:00:00+03:00')), on = RENAISSANCE.gate(new Date('2026-10-10T19:00:00+03:00'));
      const ids = (g) => (g.open ? g.plan.steps.filter((x) => x.stage === 'probe').map((x) => x.id) : []);
      return { before: ids(before), on: ids(on) };
    });
    check('P5', 'Reader-Turing questions for The Brothers Karamazov arrive 30 days after its last session, and not before', !rt.before.some((x) => /RT/.test(x)) && rt.on.some((x) => /probe:RT01@30/.test(x)), rt);
    check('P6', 'No page errors in the sealed-measurement checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 7. sealed integrity and the leak firewall (node side) ──
  {
    const reg = JSON.parse(fs.readFileSync(seal.REG, 'utf8'));
    const items = seal.decodeAll();
    const changed = reg.items.filter((r) => {
      const m = items.find((x) => x.id === r.id);
      if (!m) return true;
      const meta = JSON.parse(seal.xor(Buffer.from(m.meta, 'base64'), m.id ? require('../tools/renaissance/seal').SALT + '/meta' : '', m.id).toString('utf8'));
      return seal.sha(seal.canon({ id: m.id, form: m.form, at: m.at, after: m.after, cov: meta.cov, atoms: meta.atoms, q: m.q })) !== r.sha256;
    });
    check('S1', 'Pre-registration: all 52 sealed items (8 baseline, 8 thirty-day, 24 weekly unknowns, 12 reader questions) match the SHA-256 registered before any answer; any later edit fails here', items.length === 52 && reg.items.length === 52 && changed.length === 0 && ['A', 'B', 'alien', 'rt'].every((f) => items.some((x) => x.form === f)), { n: items.length, changed: changed.map((r) => r.id) });
    // leak firewall (§154): no run of 6 words from any sealed item appears in any lesson, hook, visual, model or quotation
    global.window = {};
    for (const f of ['renaissance-s1.js', 'renaissance-s2.js', 'renaissance-s3a.js', 'renaissance-s3b.js', 'renaissance-s3c.js']) new Function('window', fs.readFileSync(path.join(__dirname, '../source/public', f), 'utf8'))(global.window);
    const Z = global.window.RENAISSANCE_SEASONS;
    const lessonText = JSON.stringify(Z.map((z) => ({ s: z.sessions, q: z.quotes || {} }))).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ');
    const grams = (t, n) => { const w = t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean); const out = []; for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(' ')); return out; };
    const COMMON = /^(the|a|an|of|to|in|on|and|or|is|it|that|this|for|with|as|at|by|be|was|are|from|not|his|her|their|they|he|she|you|your|we|one|two|more|most|what|which|who|when|how|than|so|but|if|no|all|any|every|only|same|other|its)( |$)/;
    const quoteText = JSON.stringify(Z.map((z) => Object.values(z.quotes || {}).map((q) => q.text))).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ');
    const leaks = [];
    for (const it of items) for (const txt of [it.q.stem, ...it.q.options.map((o) => o.t)]) for (const g of grams(txt, 6)) if (g.split(' ').filter((w) => !COMMON.test(w)).length >= 3 && lessonText.includes(' ' + g + ' ') && !quoteText.includes(g)) leaks.push(it.id + ': ' + g);
    const sealedFile = fs.readFileSync(path.join(__dirname, '../source/public/renaissance-sealed.js'), 'utf8');
    const plainInFile = items.filter((it) => sealedFile.includes(it.q.stem.slice(0, 30))).map((it) => it.id);
    check('S2', 'Leak firewall: no run of six words from any sealed item appears anywhere in the lessons, hooks, visuals, models or quotation register; the sealed file carries no item text in the clear (not in content, metadata, file name or order)', leaks.length === 0 && plainInFile.length === 0 && !/stem|options|"ok"/.test(sealedFile.replace(/items/g, '')), { leaks: leaks.slice(0, 8), plainInFile });
    // counterfeit learners on the sealed items and per season; extended strategies (§153)
    // each item with the id the player shuffles it by, so "first shown" and "last shown" are what the learner sees
    const qsOf = (ses) => { const out = []; for (const st of ses.steps) { if (st.type === 'q') out.push([st, st.id]); if (st.type === 'contrast') out.push([Object.assign({ stem: st.body + ' ' + (st.q.stem || '') }, st.q), st.id]); if (st.type === 'forge' && st.critique) out.push([st.critique, st.id + ':c']); } out.push([ses.challenge, ses.id + ':challenge']); for (const h of ses.hooks) out.push([h.q, 'hook:' + h.id]); return out.filter(([q]) => q && q.options); };
    const words = (t) => String(t).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const POS = /\b(good|great|best|better|right|true|clear|real|strong|safe|success|help|love|joy|wise|kind|honest)\b/i;
    const pick = (o, score) => { const v = o.map(score), m = Math.max(...v), top = o.filter((x, i) => v[i] === m); return top.filter((x) => x.ok).length / top.length; };
    const perm = (id, n) => { let h = 2166136261; for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 13), 1103515245) + 12345 >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const strategies = (q, id) => {
      const o = q.options, stem = new Set(words(q.stem || ''));
      const L = o.map((x) => x.t.length), mean = L.reduce((a, b) => a + b, 0) / L.length;
      const sim = (a, b) => { const A = new Set(words(a)), B = new Set(words(b)); const i = [...A].filter((w) => B.has(w)).length; return i / Math.max(1, Math.min(A.size, B.size)); };
      const disp = perm(id, o.length);
      return {
        longest: pick(o, (x) => x.t.length), shortest: pick(o, (x) => -x.t.length), mostWords: pick(o, (x) => x.t.split(/\s+/).length),
        punctuated: pick(o, (x) => (/[:;—]/.test(x.t) ? 1 : 0)), hedged: pick(o, (x) => (/\b(not|only|usually|about|may|most|often|some)\b/i.test(x.t) ? 1 : 0)),
        jargon: pick(o, (x) => (x.t.match(/\b[a-z]{10,}\b/gi) || []).length), noAbsolutes: pick(o, (x) => (/\b(always|never|all|every|nothing|no one|entirely|simply)\b/i.test(x.t) ? 0 : 1)),
        stemOverlap: pick(o, (x) => words(x.t).filter((w) => stem.has(w)).length), oddLength: pick(o, (x) => Math.abs(x.t.length - mean)),
        centroid: pick(o, (x) => o.reduce((a, y) => a + (y === x ? 0 : sim(x.t, y.t)), 0)), positive: pick(o, (x) => (POS.test(x.t) ? 1 : 0)),
        firstShown: o[disp[0]].ok ? 1 : 0, lastShown: o[disp[o.length - 1]].ok ? 1 : 0,
      };
    };
    const audit = (list) => {
      const chance = list.reduce((a, [q]) => a + 1 / q.options.length, 0) / list.length;
      const sums = {};
      for (const [q, id] of list) for (const [k, v] of Object.entries(strategies(q, id))) sums[k] = (sums[k] || 0) + v;
      return { n: list.length, chance: +chance.toFixed(3), res: Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, +(v / list.length).toFixed(3)])) };
    };
    const per = {};
    for (const z of Z) per[z.id] = audit(z.sessions.flatMap((ses) => qsOf(ses)));
    per.sealed = audit(items.map((it) => [it.q, 'probe:' + it.id + '@' + it.at[0]]));
    const over = Object.entries(per).flatMap(([k, a]) => Object.entries(a.res).filter(([, v]) => v > a.chance + 0.12).map(([s0, v]) => k + '.' + s0 + '=' + v + ' (chance ' + a.chance + ')'));
    check('S3', 'Counterfeit learners, extended (§152–153): longest, shortest, most words, punctuation, hedges, jargon, no absolutes, overlap with the question, odd length, most typical option, positive words, first shown, last shown: each stays within 0.12 of chance in every season and on the sealed items', over.length === 0, { over, per: Object.fromEntries(Object.entries(per).map(([k, a]) => [k, { n: a.n, chance: a.chance, max: Math.max(...Object.values(a.res)) }])) });
  }

  // ── 8. the learner model, device independence, failure recovery, hook retirement ──
  {
    const s = await open({ time: '2026-09-28T19:00:00+03:00', state: null, localStorage: OFF });
    const p = s.page;
    const lm = await p.evaluate(() => {
      const T = (d) => new Date('2026-' + d + 'T12:00:00+03:00').getTime();
      const A = [];
      // eight weeks of delayed answers that improve steadily; and possession evidence for Ozymandias
      for (let w = 0; w < 8; w++) for (let i = 0; i < 8; i++) A.push({ t: T('08-01') + w * 7 * 864e5 + i * 36e5, sid: 'euler', item: 'hook:x' + w + i, kind: i % 2 ? 'far' : 'hook', ok: i < 3 + (w * 5) / 7, conf: 'think', atoms: ['abstr', 'minimal'] });
      const oz = window.RENAISSANCE_SEASONS.find((z) => z.id === 's3').sessions.find((x) => x.id === 'ozy');
      for (const st of oz.steps) if (st.poss && st.type !== 'passage') A.push({ t: T('09-20'), sid: 'ozy', item: st.id, kind: st.kind || 'check', ok: true, conf: 'sure', atoms: [] });
      A.push({ t: T('09-21'), sid: 'warm', item: 'hook:ozy.h3', kind: 'hook', ok: true, conf: 'sure', atoms: [] });
      const state = { v: 1, sessions: { ozy: { start: T('09-20'), done: true, end: T('09-20'), endDay: '2026-09-20' }, euler: { start: T('08-01'), done: true, end: T('08-01'), endDay: '2026-08-01' } }, days: { '2026-09-20': 24 }, answers: A, hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, exp: {}, picks: [], reads: { 'ozy:o2': { t: T('09-20'), ms: 200000, words: 115, ok: true } }, deeper: {}, forecasts: {} };
      localStorage.setItem('renaissance_v1', JSON.stringify(state));
      RENAISSANCE.reload();
      return { vec: RENAISSANCE.vector(), vel: RENAISSANCE.velocity(), mx: RENAISSANCE.multiplex(60), poss: RENAISSANCE.possession(), twin: RENAISSANCE.twin(), laws: RENAISSANCE.laws() };
    });
    const tr = lm.vec.find((v) => v.id === 'structure');
    check('L1', 'Functional-capability vector (§38): separate dimensions, each with its n and no composite score; rates are hidden below five answers (no fake precision)', lm.vec.length >= 12 && tr.n >= 30 && typeof tr.rate === 'number' && lm.vec.find((v) => v.id === 'taste').rate === null && !lm.vec.some((v) => /composite|iq/i.test(v.name)), lm.vec.slice(0, 4));
    check('L2', 'Transformation velocity (§45–46): the weekly slope of delayed, unaided accuracy is computed with its weeks and n; acceleration only once six such weeks exist', lm.vel.tv > 0 && lm.vel.weeks.length === 8 && lm.vel.accel !== null && lm.vel.weeks.every((w) => w.n >= 8), lm.vel);
    check('L3', 'Multiplex (§36–37): only capability atoms with a later or unaided success count, per hour; tags alone never do', lm.mx.atoms.join() === 'abstr,minimal' && /tags alone never do/.test(lm.mx.rule), lm.mx);
    const oz = lm.poss.ozymandias;
    check('L4', 'Cultural-possession ladder (§162): each rung is earned by evidence (a read passage counts only at reading speed), a rung counts only if the rungs below it are earned, and the top rung needs the sealed reader questions', oz && oz.level >= 4 && oz.level < 12 && oz.evidence[5] && oz.label === ['heard of', 'recognises', 'knows the basic context', 'knows the structure', 'knows primary material', 'knows the arguments', 'knows the criticism', 'can discuss', 'can quote in context', 'can compare', 'can apply', 'culturally possesses'][oz.level - 1], oz);
    check('L5', 'The twin (§163) tracks each idea from seen to assimilated, and flags what went backwards', lm.twin.euler && lm.twin.euler.states.includes('transfers') && lm.twin.ozy && lm.twin.ozy.states[0] === 'seen', { euler: lm.twin.euler, ozy: lm.twin.ozy });
    // export / import / speakable / recovery
    const dev = await p.evaluate(() => {
      const ex = RENAISSANCE.export();
      localStorage.setItem('renaissance_v1', JSON.stringify({ v: 1, sessions: {}, days: {}, answers: [], hooks: {} }));
      RENAISSANCE.reload();
      const bad = RENAISSANCE.import({ schema: 'something else' });
      const good = RENAISSANCE.import(ex);
      const after = RENAISSANCE.state();
      return { schema: ex.schema, bad, good, sessions: Object.keys(after.sessions).length, answers: after.answers.length };
    });
    check('D1', 'Device independence: the whole record exports as one JSON (renaissance.state/1) and imports on another device, merging sessions and answers; a foreign file is refused', dev.schema === 'renaissance.state/1' && !dev.bad.ok && dev.good.ok && dev.sessions === 2 && dev.answers > 60, dev);
    await STOP(p);
    const sp = await p.evaluate(() => {
      localStorage.setItem('renaissance_v1', JSON.stringify({ v: 1, sessions: Object.fromEntries(window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).filter((x) => x.id !== 'ozy').map((x) => [x.id, { start: 1, done: true, end: 1, endDay: '2026-08-01' }])), days: {}, answers: [], hooks: {} }));
      RENAISSANCE.reload();
      RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
      const a = RENAISSANCE.speakable();
      RENAISSANCE.act.go();
      const b = RENAISSANCE.speakable();
      RENAISSANCE.close();
      return { a, b };
    });
    check('D2', 'Voice-ready: the current step reads as plain speech (question, lettered options; a passage with its speaker and source), with no markup, for earbuds or a screen reader', /Option A: .*Option B:/.test(sp.a) && /I met a traveller/.test(sp.b) && /Shelley/.test(sp.b) && !/<|\*\*|\[\[/.test(sp.a + sp.b), { a: sp.a.slice(0, 160), b: sp.b.slice(0, 160) });
    const rec = await p.evaluate(() => {
      localStorage.setItem('renaissance_v1', '{"v":1,"sessions":[1,2],"answers":"oops"');
      RENAISSANCE.reload();
      const st = RENAISSANCE.state();
      const kept = Object.keys(localStorage).filter((k) => k.startsWith('renaissance_v1_corrupt_'));
      const g = RENAISSANCE.gate(new Date('2026-09-28T19:00:00+03:00'));
      let why = '';
      if (g.open) { RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00')); document.querySelector('#rnRoot [data-rn="why"]').click(); why = document.querySelector('#rnRoot .rnSheet').textContent; RENAISSANCE.close(); }
      return { recovered: !!st.recovered, kept: kept.length, open: g.open, why: /kept aside unchanged/.test(why) };
    });
    check('D3', 'Failure recovery (§247): an unreadable record is kept aside unchanged, a clean one starts, the organ still opens, and WHY THIS? says what happened', rec.recovered && rec.kept === 1 && rec.open && rec.why, rec);
    const ret = await p.evaluate(() => {
      const hook = window.RENAISSANCE_SEASONS[0].sessions[0].hooks[0];
      const st = { v: 1, sessions: Object.fromEntries(window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).map((x) => [x.id, { start: 1, done: true, end: 1, endDay: '2026-08-01' }])), days: {}, answers: [], hooks: { [hook.id]: { due: '2026-09-28', gap: 80, n: 3, ok: 2 } }, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], gov: { log: [], off: false }, lastWarm: '', probe: { start: null, done: {} }, exp: {}, picks: [], reads: {}, deeper: {}, forecasts: {} };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
      const k = hook.q.options.findIndex((o) => o.ok);
      document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
        document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
      document.querySelector('#rnRoot [data-rn="commit"][data-c="sure"]').click();
      RENAISSANCE.close();
      const h = RENAISSANCE.state().hooks[hook.id];
      const later = RENAISSANCE.gate(new Date('2027-09-28T19:00:00+03:00'));
      return { h, dueAgain: later.open && later.plan.steps.some((x) => x.id === 'hook:' + hook.id) };
    });
    check('D4', 'Garbage collection of drills (§101–103): after three sure recalls, an idea whose next gap would pass half a year retires as assimilated and is not asked again', ret.h.retired === 'assimilated' && !ret.dueAgain, ret);
    check('D5', 'No page errors in the learner-model and device checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 9. no-slop review, accessibility, performance ──
  {
    const s = await open({ time: '2026-09-28T19:00:00+03:00', state: null, localStorage: Object.assign({ renaissance_v1: doneState([...S1, ...S2]) }, OFF), viewport: { width: 390, height: 844 } });
    const p = s.page;
    const slop = await p.evaluate(() => {
      // §15, §220: generic phrases, vague praise and AI oatmeal are banned from teaching text; they may appear only
      // inside a wrong option whose diagnosis names the problem (e.g. bug "pretension")
      const BAN = /\b(explores? (the )?themes?|themes (include|of)|human nature|rich tapestry|delve|testament to|in today's (fast-paced )?world|stands the test of time|a masterpiece of|profound(ly)? (moving|insight)|stunning|breathtaking|thought-provoking|journey of self|unlock (your|the) potential|game[- ]changer|revolutionary insight|timeless classic)\b/i;
      const hits = [], dups = {}, orphans = [];
      for (const z of window.RENAISSANCE_SEASONS) {
        for (const ses of z.sessions) {
          const walk = (o, where, allowed) => {
            if (!o || typeof o !== 'object') return;
            for (const [k, v] of Object.entries(o)) {
              if (typeof v === 'string') { if (BAN.test(v) && !allowed) hits.push(ses.id + ':' + where + '.' + k + ' "' + v.match(BAN)[0] + '"'); }
              else if (Array.isArray(v)) v.forEach((x, i) => walk(x, where + '.' + k + i, allowed || (x && x.bug && /pretension|surface/.test(x.bug))));
              else walk(v, where + '.' + k, allowed);
            }
          };
          walk(ses, '', false);
          for (const st of ses.steps) if (st.body && st.body.length > 60) (dups[st.body] = dups[st.body] || []).push(ses.id + ':' + st.id);
        }
        // §139: every figure does a job: it is used by a step and says what it shows
        const used = JSON.stringify(z.sessions);
        for (const [id, f] of Object.entries(z.visuals || {})) { const h = f(); if (!used.includes('"' + id + '"') || !/aria-label="[^"]{12,}"/.test(h)) orphans.push(z.id + ':' + id); }
      }
      return { hits, dups: Object.values(dups).filter((v) => v.length > 1), orphans };
    });
    check('Q1', 'No-slop reviewer (§15, §139, §220): no generic theme-talk, vague praise or AI filler in any teaching text (allowed only inside a wrong option diagnosed as pretension); no repeated step text; every figure is used and says what it shows', slop.hits.length === 0 && slop.dups.length === 0 && slop.orphans.length === 0, slop);
    await STOP(p);
    const a11y = await p.evaluate(() => {
      RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
      const lum = (c) => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const bg = (el) => { while (el) { const c = getComputedStyle(el).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; el = el.parentElement; } return 'rgb(7, 14, 23)'; };
      const low = [];
      for (const el of document.querySelectorAll('#rnRoot p, #rnRoot button, #rnRoot h2, #rnRoot .rnKind, #rnRoot .rnMeta, #rnRoot label')) { if (!el.offsetParent || el.disabled) continue; const r = ratio(getComputedStyle(el).color, bg(el)); if (r < 4.5) low.push(el.className + ':' + r.toFixed(2)); }
      const nonNative = [...document.querySelectorAll('#rnRoot [data-rn]')].filter((el) => el.tagName !== 'BUTTON' && el.tagName !== 'INPUT').length;
      const root = document.getElementById('rnRoot');
      const out = { low, nonNative, role: root.getAttribute('role'), label: root.getAttribute('aria-label') };
      RENAISSANCE.close();
      return out;
    });
    // keyboard: Tab reaches CONTINUE and Enter works
    await p.evaluate(() => RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00')));
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="go"]').focus());
    const before = await cur(p);
    const ctype = before.type;
    if (ctype === 'scene' || ctype === 'passage' || ctype === 'model') await p.keyboard.press('Enter');
    const afterK = await cur(p);
    check('A1', 'Accessibility (§158): body text, buttons and labels meet WCAG AA contrast (4.5:1); every control is a native button or input (keyboard-operable); the organ is a labelled dialog; Enter on a focused CONTINUE advances', a11y.low.length === 0 && a11y.nonNative === 0 && a11y.role === 'dialog' && a11y.label === 'Renaissance' && (ctype === 'q' || afterK.i === before.i + 1), { a11y, before: before.id, after: afterK.id });
    const perf = await p.evaluate(() => {
      RENAISSANCE.close();
      const t0 = performance.now();
      RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
      const openMs = performance.now() - t0;
      RENAISSANCE.close();
      const times = {};
      for (const z of window.RENAISSANCE_SEASONS) for (const [id, m] of Object.entries(z.models || {})) {
        const v0 = Object.fromEntries([...(m.controls || []).map((c) => [c.id, c.value]), ...(m.toggles || []).map((c) => [c.id, c.value])]);
        const t = performance.now();
        for (let i = 0; i < 5; i++) { m.draw(v0); m.read(v0); }
        times[z.id + ':' + id] = +((performance.now() - t) / 5).toFixed(1);
      }
      const slowest = Object.entries(times).sort((a, b) => b[1] - a[1])[0];
      return { openMs: +openMs.toFixed(1), slowest };
    });
    check('A2', 'Performance (§159): opening a session takes under 300 ms and every model redraws in under 60 ms (the slowest is named)', perf.openMs < 300 && perf.slowest[1] < 60, perf);
    check('A3', 'No page errors in the review, accessibility and performance checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 8. capability genome, media registry, reality calibration ──
  {
    const s = await open({ time: '2026-09-26T19:00:00+03:00', state: null, localStorage: OFF });
    const p = s.page;
    const g = await p.evaluate(() => {
      const G = RENAISSANCE.genome(), bad = [], ids = Object.keys(RENAISSANCE.ATOMS), comp = G.compounds.map((c) => c.id);
      for (const k of ids) {
        const a = G.atoms[k];
        for (const f of ['components', 'prerequisites', 'synergies', 'conflicts', 'transfer', 'expressions', 'descendants']) if (!Array.isArray(a[f])) bad.push(k + ' lacks ' + f);
        for (const f of ['components', 'transfer', 'expressions']) if (!(a[f] || []).length) bad.push(k + ' empty ' + f);
        for (const r of (a.prerequisites || []).concat(a.synergies || [])) if (!ids.includes(r)) bad.push(k + ' unknown atom ' + r);
        for (const r of a.descendants || []) if (!ids.includes(r) && !comp.includes(r)) bad.push(k + ' unknown descendant ' + r);
        if (!a.evidence || !('rate' in a.evidence) || !a.cost || typeof a.cost.minutes !== 'number') bad.push(k + ' evidence/cost not computed');
        if (!a.cost.minutes) bad.push(k + ' no step trains it');
      }
      for (const c of G.compounds) for (const k of c.atoms) if (!ids.includes(k)) bad.push('compound ' + c.id + ' unknown atom ' + k);
      // prerequisites form no cycle
      const seen = {}, cyc = [];
      const dfs = (k, path) => { if (path.includes(k)) { cyc.push(path.concat(k).join('>')); return; } if (seen[k]) return; seen[k] = 1; for (const r of G.atoms[k].prerequisites) dfs(r, path.concat(k)); };
      ids.forEach((k) => dfs(k, []));
      const cells = G.table.cells.flat(2), dup = cells.filter((k, i) => cells.indexOf(k) !== i), missing = ids.filter((k) => !cells.includes(k));
      const empty = G.table.cells.flatMap((row, i) => row.map((c, j) => (c.length ? null : G.table.rows[i] + '×' + G.table.cols[j]))).filter(Boolean);
      const unpredicted = empty.filter((k) => !G.table.gaps[k]);
      return { bad, cyc, dup, missing, unpredicted, compounds: G.compounds.length, empty: empty.length };
    });
    check('G1', 'Capability genome (§60–62): all 28 atoms carry components, prerequisites, synergies, conflicts, transfer edges, expressions and descendants; evidence and learning cost are computed; references resolve; prerequisites have no cycle; the periodic table places each atom once and every empty cell names a predicted atom; ≥ 7 compounds', g.bad.length === 0 && g.cyc.length === 0 && g.dup.length === 0 && g.missing.length === 0 && g.unpredicted.length === 0 && g.compounds >= 7, g);
    const g2 = await p.evaluate(() => {
      const st = RENAISSANCE.state();
      const mk = (ok, i) => ({ t: 1000 + i, sid: 'commit', item: 'x' + i, kind: 'transfer', atoms: ['prob'], ok, conf: 'think' });
      st.answers = [true, true, true, false, true, true].map(mk);
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      const a = RENAISSANCE.genome().atoms;
      const four = Object.assign({}, st, { answers: st.answers.slice(0, 4) });
      localStorage.setItem('renaissance_v1', JSON.stringify(four));
      RENAISSANCE.reload();
      const b = RENAISSANCE.genome().atoms;
      return { six: a.prob.evidence, four: b.prob.evidence, other: a.causal.evidence };
    });
    check('G2', 'Genome evidence comes from the record: 5 of 6 unaided answers gives 0.83; below five answers the rate is withheld; untouched atoms show none', g2.six.rate === 0.83 && g2.six.n === 6 && g2.four.rate === null && g2.other.n === 0, g2);
    const m = await p.evaluate(() => {
      const R = RENAISSANCE.media(), bad = [], slop = /\b(stunning|beautiful visual|decorative|eye-catching|engaging visual|immersive|vibrant|captivating)\b/i;
      for (const o of R.objects) {
        if (!R.types.includes(o.type)) bad.push(o.key + ' type ' + o.type);
        if (!R.rights.includes(o.rights)) bad.push(o.key + ' rights ' + o.rights);
        if (!o.source) bad.push(o.key + ' no source');
        if (!o.job || o.job.split(/\s+/).length < 8) bad.push(o.key + ' no cognitive job');
        if (o.job && slop.test(o.job)) bad.push(o.key + ' decorative job');
        if (!o.uses.length) bad.push(o.key + ' used by no step (decoration or dead)');
        if (o.kind === 'quote') for (const f of ['author', 'work', 'translation', 'rights', 'claim', 'confidence', 'contested']) if (!o.provenance[f]) bad.push(o.key + ' provenance lacks ' + f);
      }
      // every visual renders with an accessible name
      const noName = [];
      for (const z of window.RENAISSANCE_SEASONS) for (const [id, f] of Object.entries(z.visuals || {})) {
        const d = document.createElement('div');
        d.innerHTML = f();
        const sv = d.querySelector('svg');
        if (!sv || !(sv.getAttribute('aria-label') || '').trim()) noName.push(id);
      }
      const kinds = {};
      R.objects.forEach((o) => (kinds[o.kind] = (kinds[o.kind] || 0) + 1));
      return { bad, noName, kinds, n: R.objects.length, types: [...new Set(R.objects.map((o) => o.type))] };
    });
    check('M1', 'Media registry (§134–139): every visual, model, listening passage, quotation and data object has a §138 type, a §134 rights class, a source and a stated cognitive job, and is used by a step; quotations carry §135 provenance; every visual has an accessible name', m.bad.length === 0 && m.noName.length === 0 && m.kinds.visual >= 23 && m.kinds.model >= 24 && m.kinds.listen >= 3 && m.kinds.quote >= 17, m);
    // reality calibration: forecast after a forge, scored at the next warm-up
    await STOP(p);
    await p.evaluate(() => { RENAISSANCE.reset(); RENAISSANCE.open(new Date('2026-09-26T19:00:00+03:00')); });
    let fc = null;
    for (let i = 0; i < 60; i++) {
      const c = await cur(p);
      if (!c) break;
      if (c.type === 'q' || c.type === 'contrast') await answerRight(p);
      if (c.type === 'forge') {
        await forge(p);
        const had = await p.evaluate(() => !!document.querySelector('#rnRoot [data-rn="forecast"][data-p="70"]'));
        await p.evaluate(() => document.querySelector('#rnRoot [data-rn="forecast"][data-p="70"]')?.click());
        fc = { had, sid: c.sid, rec: await p.evaluate((sid) => RENAISSANCE.state().forecasts[sid], c.sid), shown: await p.evaluate(() => /Your forecast/.test(document.querySelector('#rnRoot .rnForecast')?.textContent || '')) };
      }
      if (c.type === 'reality') await p.evaluate(() => document.querySelector('#rnRoot [data-rn="reality"]').click());
      if (await p.evaluate(() => document.querySelector('#rnRoot [data-rn="go"]').disabled)) break;
      await go(p);
    }
    await p.evaluate(() => { RENAISSANCE.close(); RENAISSANCE.open(new Date('2026-09-27T19:00:00+03:00')); });
    const first = await cur(p);
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="reality"][data-k="used"]')?.click());
    const after = await p.evaluate((sid) => ({ f: RENAISSANCE.state().forecasts[sid], cal: RENAISSANCE.calibration(), text: document.querySelector('#rnRoot .rnFb')?.textContent || '' }), fc && fc.sid);
    const five = await p.evaluate(() => {
      RENAISSANCE.close();
      const st = RENAISSANCE.state();
      st.forecasts = { a: { p: 90, outcome: 1 }, b: { p: 90, outcome: 0 }, c: { p: 10, outcome: 0 }, d: { p: 50, outcome: 1 }, e: { p: 70, outcome: 1 }, f: { p: 30, outcome: null } };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      return RENAISSANCE.calibration();
    });
    check('F1', 'Reality calibration (§97): after building, the learner can forecast (optional) whether they will try it; the next warm-up checks it, scores it and says so; after five checked forecasts a Brier score is reported (0.234 for the fixture), none before', !!fc && fc.had && fc.rec && fc.rec.p === 70 && fc.rec.outcome === null && fc.shown && first.type === 'reality' && after.f.outcome === 1 && /You forecast 70%/.test(after.text) && after.cal.n === 1 && after.cal.brier === null && five.n === 5 && five.pending === 1 && five.brier === 0.234, { fc, first: first && first.id, after, five });
    check('F2', 'No page errors in the genome, media and calibration checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 9. masterpiece quality, the idea immune system, texture; the new trials; laws, perception, world model, real talk ──
  {
    const s = await open({ time: '2026-09-26T19:00:00+03:00', state: null, localStorage: OFF });
    const p = s.page;
    const c = await p.evaluate(() => {
      const Z = window.RENAISSANCE_SEASONS, all = Z.flatMap((z) => z.sessions), quotes = Object.assign({}, ...Z.map((z) => z.quotes || {}));
      const km = all.filter((x) => /^km\d$/.test(x.id)), J = JSON.stringify(km);
      const rungs = new Set(km.flatMap((x) => x.steps.concat(x.hooks).flatMap((y) => Object.values(y.poss || {}))));
      const mq = {
        primary: km.some((x) => x.steps.some((y) => y.type === 'passage' && (y.quotes || []).length)),
        map: /"svg":"compileMap"/.test(J),
        graph: /"svg":"familyMap"/.test(J) && km.some((x) => x.steps.some((y) => y.type === 'model' && y.model === 'relations')),
        vocabulary: km.reduce((a, x) => a + Object.keys(x.vocab || {}).length, 0) >= 3,
        context: rungs.has('context'),
        criticism: rungs.has('criticism'),
        quotations: km.some((x) => x.steps.some((y) => (y.quotes || []).length)) && rungs.has('quote'),
        transfer: km.some((x) => x.steps.some((y) => /transfer|far|alien/.test(y.kind))),
        discussion: rungs.has('discuss'),
        memory: km.every((x) => (x.hooks || []).length >= 3),
        readerTuring: (window.RENAISSANCE_SEALED.items || []).filter((it) => it.after === 'km3').length >= 8,
      };
      // idea immune system: every session meets an objection, a limit or an open question
      const unguarded = all.filter((x) => { const j = JSON.stringify(x); return !(/"kind":"counterexample"/.test(j) || /Where it breaks/.test(j) || /Open question/.test(j)); }).map((x) => x.id);
      const contested = all.flatMap((x) => (x.provenance || []).filter((pr) => pr.contested).map((pr) => x.id + ':' + pr.id));
      const opposed = all.some((x) => x.steps.some((y) => (y.quotes || []).includes('freud') && (y.quotes || []).includes('nabokov')));
      const plural = Object.keys((window.RENAISSANCE_GENOME.world || {}).plural || {}).filter((id) => all.some((x) => x.id === id));
      // texture, not trivia
      const tex = [];
      for (const x of all) for (const y of x.steps) if ((y.quotes || []).length > 2) tex.push(x.id + ':' + y.id + ' shows ' + y.quotes.length + ' quotations');
      for (const [id, q] of Object.entries(quotes)) {
        if (!q.matters || !q.context) tex.push('quotation ' + id + ' lacks why it matters or its context');
        if (!q.verse && q.text.split(/\s+/).length > 160) tex.push('quotation ' + id + ' is longer than 160 words');
      }
      const uses = {};
      for (const x of all) for (const y of x.steps) for (const q of y.quotes || []) uses[q] = (uses[q] || 0) + 1;
      for (const [q, n] of Object.entries(uses)) if (n > 2) tex.push('quotation ' + q + ' is shown in ' + n + ' steps');
      for (const x of all) for (const h of x.hooks || []) if (/^(in )?(what|which) year|^who (wrote|painted|composed)|^when did/i.test(h.q.stem)) tex.push(h.id + ' asks for a bare date or name');
      return { mq, unguarded, contested, opposed, plural, tex };
    });
    check('V9', 'Masterpiece experience quality (§217): the Karamazov track has primary text, a structural map, a character graph and model, vocabulary, context, criticism, quotations in context, transfer, discussion, memory hooks and sealed reader-Turing questions', Object.values(c.mq).every(Boolean), c.mq);
    check('V10', 'Idea immune system and source conflict (§93, §96, §99, §137): every session meets a counterexample, a stated limit or an open question; contested claims are marked contested; opposing verdicts (Freud, Nabokov) are shown side by side; at least five sessions keep rival models alive', c.unguarded.length === 0 && c.contested.length >= 3 && c.opposed && c.plural.length >= 5, { unguarded: c.unguarded, contested: c.contested, opposed: c.opposed, plural: c.plural });
    check('V11', 'Texture, not trivia (§227–229): no step dumps more than two quotations, no quotation is shown in more than two steps, every quotation carries its context and why it matters, prose quotations stay under 160 words, and no returning question asks for a bare date or name', c.tex.length === 0, c.tex);
    // the new trials really change the lesson (experiments on)
    const allIds = await p.evaluate(() => window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).map((x) => x.id));
    const tr = await p.evaluate(({ allIds, base }) => {
      nextAction = () => ({ kind: 'STOP' });
      localStorage.removeItem('renaissance_experiments');
      const all = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions);
      const at = new Date('2026-09-28T19:00:00+03:00');
      const only = (sid, extra) => {
        const st = JSON.parse(JSON.stringify(base));
        for (const id of allIds) if (id !== sid) st.sessions[id] = { start: 1, done: true, end: 1, endDay: '2026-08-01' };
        Object.assign(st, extra || {});
        localStorage.setItem('renaissance_v1', JSON.stringify(st));
        RENAISSANCE.reload();
      };
      const simple = all.filter((x) => !x.deep && x.domain && x.domain !== 'primitives').map((x) => x.id);
      const out = {};
      // L4: split over two days
      const s4 = [simple.find((id) => RENAISSANCE.arm('L4', id) === 1), simple.find((id) => RENAISSANCE.arm('L4', id) === 0)];
      out.L4 = s4.map((sid) => { only(sid); const g = RENAISSANCE.gate(at); return { sid, arm: RENAISSANCE.arm('L4', sid), partial: g.plan.partial, reason: g.reasons.some((r) => /trial L4/.test(r)) }; });
      // L8: passage with its context beside it
      const withPassage = simple.filter((id) => all.find((x) => x.id === id).steps.some((y) => y.type === 'passage'));
      const s8 = [withPassage.find((id) => RENAISSANCE.arm('L8', id) === 1), withPassage.find((id) => RENAISSANCE.arm('L8', id) === 0)];
      out.L8 = s8.map((sid) => {
        only(sid);
        RENAISSANCE.open(at);
        let c = RENAISSANCE.current(), guard = 0;
        while (c && c.type !== 'passage' && guard++ < 40) { RENAISSANCE.act.go(); c = RENAISSANCE.current(); }
        const ctx = !!document.querySelector('#rnRoot .rnQctx');
        RENAISSANCE.close();
        return { sid, arm: RENAISSANCE.arm('L8', sid), ctx, reached: !!c && c.type === 'passage' };
      });
      // L9 and L7: returning ideas after the session, recalled before their options
      const hooks = all.filter((x) => x.domain === 'primitives' || !x.domain).flatMap((x) => x.hooks.map((h) => h.id));
      const h7 = [hooks.find((id) => RENAISSANCE.arm('L7', id + '#0') === 1), hooks.find((id) => RENAISSANCE.arm('L7', id + '#0') === 0)];
      const s9 = [simple.find((id) => RENAISSANCE.arm('L9', id) === 1), simple.find((id) => RENAISSANCE.arm('L9', id) === 0)];
      out.L9 = s9.map((sid) => {
        only(sid, { hooks: { [hooks[0]]: { due: '2026-09-20', gap: 1, n: 0, ok: 0 } } });
        const steps = RENAISSANCE.gate(at).plan.steps.map((y) => y.kind === 'hook' ? 'hook' : y.stage);
        return { sid, arm: RENAISSANCE.arm('L9', sid), hookAt: steps.indexOf('hook'), firstLesson: steps.findIndex((k) => k !== 'hook' && k !== 'warm' && k !== 'probe'), n: steps.length };
      });
      out.L7 = h7.map((hid) => {
        only(simple[0], { hooks: { [hid]: { due: '2026-09-20', gap: 1, n: 0, ok: 0 } } });
        RENAISSANCE.open(at);
        let c = RENAISSANCE.current(), guard = 0;
        while (c && c.id !== 'hook:' + hid && guard++ < 60) { RENAISSANCE.act.go(); c = RENAISSANCE.current(); }
        const before = document.querySelectorAll('#rnRoot .rnBody [data-rn="pick"]').length, reveal = !!document.querySelector('#rnRoot [data-rn="reveal"]');
        document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
        const after = document.querySelectorAll('#rnRoot .rnBody [data-rn="pick"]').length;
        RENAISSANCE.close();
        return { hid, arm: RENAISSANCE.arm('L7', hid + '#0'), reveal, before, after };
      });
      // L11: rotation-first weights on its days
      const st11 = JSON.parse(JSON.stringify(base));
      for (const z of window.RENAISSANCE_SEASONS) if (z.boot) for (const x of z.sessions) st11.sessions[x.id] = { start: 1, done: true, end: 1, endDay: '2026-08-01' };
      localStorage.setItem('renaissance_v1', JSON.stringify(st11));
      RENAISSANCE.reload();
      const days = [...Array(40).keys()].map((i) => new Date(Date.UTC(2026, 8, 28 + i, 16)));
      const cs = days.map((d) => RENAISSANCE.compile(d)).filter((x) => x && x.mode === 'compiled');
      out.L11 = { rot: cs.find((x) => x.l11 === 1), gap: cs.find((x) => x.l11 === 0) };
      out.L11 = { rot: out.L11.rot && out.L11.rot.weights, gap: out.L11.gap && out.L11.gap.weights };
      localStorage.setItem('renaissance_experiments', 'off');
      return out;
    }, { allIds, base: doneState([]) });
    const okL4 = tr.L4.every((x) => x.sid && x.partial === (x.arm === 1) && x.reason === (x.arm === 1));
    const okL8 = tr.L8.every((x) => x.sid && x.reached && x.ctx === (x.arm === 1));
    const okL9 = tr.L9.every((x) => x.sid && x.hookAt >= 0 && (x.arm === 1 ? x.hookAt > x.firstLesson : x.hookAt < x.firstLesson));
    const okL7 = tr.L7.every((x) => x.hid && (x.arm === 1 ? x.reveal && x.before === 0 && x.after > 0 : !x.reveal && x.before > 0));
    const okL11 = tr.L11.rot && tr.L11.gap && tr.L11.rot.rotate === 3 && tr.L11.rot.gap === 1.5 && tr.L11.gap.gap === 3;
    check('E6', 'The trials beyond L6 change the lesson on their test arm and not on their control: L4 splits a session over two days (and says so), L7 hides the options until an answer is in mind, L8 puts the context beside the passage, L9 moves returning ideas after the session, L11 weighs rotation above gaps', okL4 && okL7 && okL8 && okL9 && okL11, tr);
    // laws, perception, world model, real talk (pure record fixtures)
    const lm = await p.evaluate((base) => {
      const put = (st) => { localStorage.setItem('renaissance_v1', JSON.stringify(st)); RENAISSANCE.reload(); };
      const st = JSON.parse(JSON.stringify(base));
      st.reps = { a: { diagram: { shown: 10, then_ok: 8 }, story: { shown: 10, then_ok: 3 } } };
      put(st);
      const laws = RENAISSANCE.laws();
      st.reps = { a: { diagram: { shown: 5, then_ok: 5 }, story: { shown: 5, then_ok: 0 } } };
      put(st);
      const thin = RENAISSANCE.laws();
      const mk = (sid, kind, ok, i) => ({ t: 1000 + i, sid, item: sid + i, kind, ok, conf: 'think', atoms: ['taste'] });
      st.answers = [0, 1, 0, 1, 0].map((o, i) => mk('pattern', 'predict', !!o, i)).concat([1, 1, 1, 0, 1].map((o, i) => mk('pattern', 'transfer', !!o, 10 + i))).concat([mk('cadence', 'predict', true, 20), mk('cadence', 'transfer', true, 21)]);
      put(st);
      const per = RENAISSANCE.perception();
      st.sessions = { willow: { start: 1, done: true, end: 1, endDay: '2026-09-01' } };
      put(st);
      const wm = RENAISSANCE.worldModel();
      return { laws, thin, per, wm };
    }, doneState([]));
    const cand = lm.laws.find((r) => /diagram/.test(r.rule) && /story/.test(r.rule));
    check('L6', 'Personal intellectual physics (§74–75): a rule about this learner appears only with enough evidence (8+ per kind) and says how it would be refuted; below that there is no rule', !!cand && cand.status === 'candidate' && !!cand.test && lm.thin.length === 0, { laws: lm.laws, thin: lm.thin });
    check('L7', 'Museum and concert tests (§31–32): cold predictions against later answers on new works for the art and music sessions, with the change; rates only from five answers', lm.per.museum.cold.rate === 0.4 && lm.per.museum.after.rate === 0.8 && lm.per.museum.delta === 0.4 && lm.per.concert.cold.rate === null, lm.per);
    const L16 = ['matter', 'energy', 'information', 'life', 'evolution', 'mind', 'intelligence', 'society', 'economics', 'institutions', 'technology', 'history', 'culture', 'art', 'meaning', 'future'];
    const layerIds = Object.values(lm.wm.layers).flatMap((l) => l.sessions);
    check('L8', 'World-model map (§98–99): all sixteen layers of §98 are listed with the sessions that model them and what is done; empty layers are named as gaps, never hidden; rival models kept are listed', L16.every((k) => lm.wm.layers[k]) && layerIds.every((id) => allIds.includes(id)) && lm.wm.gaps.every((k) => !lm.wm.layers[k].sessions.length) && Object.values(lm.wm.layers).filter((l) => !l.sessions.length).length === lm.wm.gaps.length && lm.wm.layers.matter.done.includes('willow') && Object.keys(lm.wm.plural).length >= 5, { gaps: lm.wm.gaps, matter: lm.wm.layers.matter });
    // real social feedback after the conversation session
    const talk = await p.evaluate((base) => {
      nextAction = () => ({ kind: 'STOP' });
      const st = JSON.parse(JSON.stringify(base));
      st.sessions.salon = { start: 1, done: true, end: 1, endDay: '2026-09-27' };
      st.forge.salon = { t: 1, text: 'Ask one question; tell one story.', grades: ['good'] };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      RENAISSANCE.open(new Date('2026-09-28T19:00:00+03:00'));
      const c = RENAISSANCE.current();
      const opts = [...document.querySelectorAll('#rnRoot [data-rn="reality"]')].map((b) => b.dataset.k);
      document.querySelector('#rnRoot [data-rn="reality"][data-k="gap"]')?.click();
      const rec = RENAISSANCE.state().reality.salon;
      RENAISSANCE.close();
      return { first: c && c.type, opts, rec, keys: rec ? Object.keys(rec).sort().join() : '' };
    }, doneState([...S1, ...S2]));
    check('F3', 'Real social feedback (§232): after the conversation session the next warm-up asks whether it came up in real talk (went well, showed a gap, raised a question, did not come up); only the tap and its time are kept', talk.first === 'reality' && talk.opts.join() === 'well,gap,question,notyet' && talk.rec && talk.rec.v === 'gap' && talk.keys === 't,v', talk);
    // sovereignty: he can take a runner-up instead of the compiler's pick, until he has answered anything
    const sw = await p.evaluate((base) => {
      nextAction = () => ({ kind: 'STOP' });
      const st = JSON.parse(JSON.stringify(base));
      for (const z of window.RENAISSANCE_SEASONS) if (z.boot) for (const x of z.sessions) st.sessions[x.id] = { start: 1, done: true, end: 1, endDay: '2026-08-01' };
      const put = () => { localStorage.setItem('renaissance_v1', JSON.stringify(st)); RENAISSANCE.reload(); };
      put();
      const days = [...Array(20).keys()].map((i) => new Date(Date.UTC(2026, 8, 28 + i, 16)));
      const day = days.find((d) => { const c = RENAISSANCE.compile(d); return c && c.mode === 'compiled'; });
      RENAISSANCE.open(day);
      const first = RENAISSANCE.current().sid;
      document.querySelector('#rnRoot [data-rn="why"]').click();
      const btns = [...document.querySelectorAll('#rnRoot [data-rn="swap"]')].map((b) => b.dataset.s);
      document.querySelector('#rnRoot [data-rn="swap"]')?.click();
      const now = RENAISSANCE.current();
      const S = RENAISSANCE.state();
      RENAISSANCE.close();
      return { first, btns, now: now && now.sid, oldRec: S.sessions[first] || null, choice: S.choice, lastPick: (S.picks || []).slice(-1)[0] };
    }, doneState([]));
    check('C6', 'Sovereignty (§197): on a compiled day WHY THIS? offers the runners-up; choosing one replaces the compiler\'s pick before any answer, leaves the abandoned session untouched, and is recorded as his choice', sw.btns.length >= 1 && sw.now === sw.btns[0] && sw.now !== sw.first && sw.oldRec === null && sw.choice && sw.choice.sid === sw.now && sw.lastPick && sw.lastPick.mode === 'chosen', sw);
    // click events (§84): a wrong prediction followed by a right answer on an unseen case is logged as a click
    const clk = await p.evaluate(() => {
      nextAction = () => ({ kind: 'STOP' });
      RENAISSANCE.reset();
      RENAISSANCE.open(new Date('2026-09-26T19:00:00+03:00'));
      const all = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions);
      let wrongDone = false;
      for (let i = 0; i < 60; i++) {
        const c = RENAISSANCE.current();
        if (!c) break;
        const ses = all.find((x) => x.id === c.sid), step = ses && ses.steps.find((x) => x.id === c.id);
        if (c.type === 'q' || c.type === 'contrast') {
          const opts = step.type === 'contrast' ? step.q.options : step.options;
          const k = !wrongDone && c.kind === 'predict' ? opts.findIndex((o) => !o.ok) : opts.findIndex((o) => o.ok);
          if (!wrongDone && c.kind === 'predict') wrongDone = true;
          document.querySelector('#rnRoot [data-rn="reveal"]')?.click();
          document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
          document.querySelector('#rnRoot [data-rn="commit"][data-c="sure"]').click();
        }
        if (c.type === 'forge') {
          const keys = [...new Set([...document.querySelectorAll('#rnRoot [data-rn="slot"]')].map((b) => b.dataset.s))];
          for (const k of keys) document.querySelector('#rnRoot [data-rn="slot"][data-s="' + k + '"]')?.click();
          document.querySelector('#rnRoot [data-rn="forge"]')?.click();
          document.querySelector('#rnRoot .rnCrit [data-rn="pick"]')?.click();
          document.querySelector('#rnRoot .rnCrit [data-rn="commit"][data-c="sure"]')?.click();
        }
        if (document.querySelector('#rnRoot [data-rn="go"]').disabled) break;
        document.querySelector('#rnRoot [data-rn="go"]').click();
      }
      const S = RENAISSANCE.state();
      return { clicks: S.clicks, done: Object.entries(S.sessions).filter(([, r]) => r.done).map(([k]) => k), wrongDone };
    });
    check('F5', 'Click events (§84): a prediction that was wrong before the explanation, then the idea used rightly on an unseen case, is logged as a click for that session', clk.wrongDone && clk.done.includes('commit') && clk.clicks.some((x) => x.sid === 'commit'), clk);
    check('F4', 'No page errors in the masterpiece, immune-system, trial and learner-model checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(failed.length ? failed.length + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  const out = process.argv[2];
  if (out) fs.writeFileSync(out, JSON.stringify({ when: new Date().toISOString(), results }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
