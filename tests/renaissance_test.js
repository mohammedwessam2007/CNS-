// Renaissance v1: the second organ. Opens only after the medicine day is finished; one CONTINUE; every control
// works; wrong answers are diagnosed; hooks come back unaided; stop rules protect life; nothing touches CNS state;
// content carries provenance. Usage: node tests/renaissance_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const harness = require('./harness');
// the sealed measurement (probes) and the trials are certified in renaissance_v3_test.js; this suite certifies the
// original experience with both switched off, exactly as a learner can switch them off
const open = (o = {}) => harness.open(Object.assign({}, o, { localStorage: Object.assign({ renaissance_probes: 'off', renaissance_experiments: 'off' }, o.localStorage || {}) }));
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 900))); };

const STOP = () => { nextAction = () => ({ kind: 'STOP' }); render(); };
// pick an option by its original index and commit with a confidence
async function answer(p, which, conf) {
  return p.evaluate(([which, conf]) => {
    const c = RENAISSANCE.current(), S = { sessions: window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions) };
    const ses = S.sessions.find((x) => x.id === c.sid);
    const step = ses && ses.steps.find((x) => x.id === c.id);
    let opts = step ? (step.type === 'contrast' ? step.q.options : step.options) : null;
    if (!opts && c.id.startsWith('hook:')) { const hid = c.id.slice(5); for (const x of S.sessions) for (const h of x.hooks) if (h.id === hid) opts = h.q.options; }
    const k = which === 'right' ? opts.findIndex((o) => o.ok) : opts.findIndex((o) => !o.ok);
    document.querySelector('#rnRoot .rnBody [data-rn="pick"][data-k="' + k + '"]').click();
    document.querySelector('#rnRoot [data-rn="commit"][data-c="' + conf + '"]').click();
    return { k, bug: opts[k].bug || null };
  }, [which, conf]);
}
const go = (p) => p.evaluate(() => document.querySelector('#rnRoot [data-rn="go"]').click());
const cur = (p) => p.evaluate(() => RENAISSANCE.current());
async function forgeAndCritique(p) {
  await p.evaluate(() => {
    const keys = [...new Set([...document.querySelectorAll('#rnRoot [data-rn="slot"]')].map((b) => b.dataset.s))];
    for (const k of keys) document.querySelector('#rnRoot [data-rn="slot"][data-s="' + k + '"]:not([disabled])')?.click();
    document.querySelector('#rnRoot [data-rn="forge"]')?.click();
    document.querySelector('#rnRoot .rnCrit [data-rn="pick"]')?.click();
    document.querySelector('#rnRoot .rnCrit [data-rn="commit"][data-c="sure"]')?.click();
  });
}
// run the open session to its end, answering right unless told otherwise
async function runToEnd(p) {
  for (let i = 0; i < 40; i++) {
    const c = await cur(p);
    if (!c) return true;
    if (c.type === 'q' || c.type === 'contrast') await answer(p, 'right', 'think');
    if (c.type === 'forge') await forgeAndCritique(p);
    if (c.type === 'reality') await p.evaluate(() => document.querySelector('#rnRoot [data-rn="reality"]').click());
    const ok = await p.evaluate(() => !document.querySelector('#rnRoot [data-rn="go"]').disabled);
    if (!ok) return false;
    await go(p);
  }
  return false;
}

(async () => {
  // ── 1. the gate, the door, isolation, the whole first session ──
  {
    const s = await open({ v16: true, time: '2026-09-26T19:00:00+03:00', state: null, settle: 1800, viewport: { width: 820, height: 1180 } });
    const p = s.page;
    const before = await p.evaluate(() => ({ why: RENAISSANCE.gate().why, entry: !!document.querySelector('.rnEntry'), kind: nextAction().kind }));
    check('R1', 'While the medicine day is unfinished Renaissance stays shut: no door, gate says "cns"', before.kind !== 'STOP' && before.why === 'cns' && !before.entry, before);

    await p.evaluate(STOP);
    await p.waitForTimeout(250);
    const door = await p.evaluate(() => {
      const e = document.querySelector('#player .rnEntry'), r = e && e.getBoundingClientRect();
      return { open: e?.dataset.rnState, q: e?.querySelector('.rnEntryQ')?.textContent, go: !!e?.querySelector('[data-rn-open]'), top: r ? Math.round(r.top) : null, vh: innerHeight, stop: /STOP MEDICINE/.test(document.querySelector('#player').textContent) };
    });
    check('R2', 'When medicine says STOP, one door appears under "STOP MEDICINE": today\'s question and CONTINUE, visible without scrolling', door.open === 'open' && /tie their own hands/.test(door.q || '') && door.go && door.stop && door.top != null && door.top < door.vh, door);

    const cnsBefore = await p.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((k) => k !== 'renaissance_v1').map((k) => [k, localStorage.getItem(k)])));
    await p.evaluate(() => document.querySelector('[data-rn-open]').click());
    await p.waitForTimeout(150);
    const first = await p.evaluate(() => ({ c: RENAISSANCE.current(), root: !!document.querySelector('#rnRoot:not([hidden])'), buttons: [...document.querySelectorAll('#rnRoot .rnDock button')].map((b) => b.textContent) }));
    check('R3', 'CONTINUE opens the session with CONTINUE, WHY THIS?, SHOW ME DIFFERENTLY, I ALREADY GET THIS, THIS DIDN\'T CLICK, GO DEEPER and DONE', first.root && first.c && first.c.sid === 'commit' && ['CONTINUE', 'WHY THIS?', 'SHOW ME DIFFERENTLY', 'I ALREADY GET THIS', "THIS DIDN'T CLICK", 'GO DEEPER', 'DONE'].every((t) => first.buttons.includes(t)), first);

    // representations
    const rep0 = await p.evaluate(() => document.querySelector('#rnRoot .rnRep')?.dataset.kind);
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="smd"]').click());
    const rep1 = await p.evaluate(() => document.querySelector('#rnRoot .rnRep')?.dataset.kind);
    check('R4', 'SHOW ME DIFFERENTLY swaps the representation (e.g. diagram → story), not the wording', rep0 && rep1 && rep0 !== rep1, { rep0, rep1 });

    // x-ray: word → three-layer vocabulary; step → the missing step
    await go(p); // c2 predict
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="xray"]').click());
    const xr = await p.evaluate(() => ({ causes: [...document.querySelectorAll('#rnRoot [data-rn="xcause"]')].map((b) => b.dataset.k) }));
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="xcause"][data-k="step"]').click());
    const xstep = await p.evaluate(() => document.querySelector('#rnRoot .rnSheet')?.textContent || '');
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="unsheet"]').click());
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="xray"]').click());
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="xcause"][data-k="word"]').click());
    const xword = await p.evaluate(() => document.querySelector('#rnRoot .rnSheet')?.textContent || '');
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="unsheet"]').click());
    check('R5', 'THIS DIDN\'T CLICK asks what is in the way (word / picture / step / why care) and repairs that cause: the missing step, or HUMAN / STICKY / TECHNICAL vocabulary', xr.causes.join() === 'word,picture,step,care' && /missing step/i.test(xstep) && /HUMAN/.test(xword) && /STICKY/.test(xword) && /TECHNICAL/.test(xword) && /[؀-ۿ]/.test(xword), { xr, xstep: xstep.slice(0, 120), xword: xword.slice(0, 200) });

    // a wrong committed prediction: CONTINUE locked before, diagnosis after
    const locked = await p.evaluate(() => document.querySelector('#rnRoot [data-rn="go"]').disabled);
    const w = await answer(p, 'wrong', 'sure');
    const fb = await p.evaluate(() => ({ text: document.querySelector('#rnRoot .rnFb')?.textContent || '', bug: document.querySelector('#rnRoot .rnBug')?.textContent || '', go: !document.querySelector('#rnRoot [data-rn="go"]').disabled }));
    const logged = await p.evaluate(() => RENAISSANCE.state().answers.slice(-1)[0]);
    check('R6', 'A prediction must be committed (with SURE / THINK SO / GUESSING) before CONTINUE; a wrong one names the misconception, explains it and shows the answer; the answer is logged with confidence and bug', locked && fb.go && fb.bug && /The answer:/.test(fb.text) && logged.kind === 'predict' && logged.ok === false && logged.conf === 'sure' && logged.bug === w.bug, { locked, fb, logged });

    // why this?  go deeper?
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="why"]').click());
    const why = await p.evaluate(() => document.querySelector('#rnRoot .rnSheet')?.textContent || '');
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="unsheet"]').click());
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="deeper"]').click());
    const deep = await p.evaluate(() => document.querySelector('#rnRoot .rnSheet')?.textContent || '');
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="unsheet"]').click());
    check('R7', 'WHY THIS? explains the choice, the dose, where the facts come from (graded) and the record (with Brier calibration); GO DEEPER opens optional depth', /Why this, today/.test(why) && /Chosen by/.test(why) && /Where this step's facts come from/.test(why) && /Brier/.test(why) && /Go deeper/.test(deep) && deep.length > 200, { why: why.slice(0, 300), deep: deep.slice(0, 120) });

    // I already get this: a correct, non-guessed challenge skips ahead to the part where the idea is used
    await go(p);
    const at0 = await cur(p);
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="already"]').click());
    await p.evaluate(() => {
      const S = window.RENAISSANCE_SEASONS[0].sessions[0];
      const k = S.challenge.options.findIndex((o) => o.ok);
      document.querySelector('#rnRoot .rnSheet [data-rn="pick"][data-k="' + k + '"]').click();
      document.querySelector('#rnRoot .rnSheet [data-rn="commit"][data-c="think"]').click();
    });
    const at1 = await cur(p);
    check('R8', 'I ALREADY GET THIS gives one question from further ahead; right and not guessed → skips to where the idea is used (transfer / far / forge)', at0.i < at1.i && /transfer|far|forge/.test(at1.stage) && !at1.sheet, { at0, at1 });

    // DONE: nothing owed; reopening resumes where it stopped
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="done"]').click());
    const done = await p.evaluate(() => document.querySelector('#rnRoot .rnSheet')?.textContent || '');
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="leave"]').click());
    const closed = await p.evaluate(() => ({ root: !!document.querySelector('#rnRoot:not([hidden])'), door: document.querySelector('.rnEntry')?.dataset.rnState, mins: Object.values(RENAISSANCE.state().days)[0] || 0 }));
    await p.evaluate(() => document.querySelector('[data-rn-open]').click());
    const resumed = await cur(p);
    check('R9', 'DONE stops at once ("Nothing is owed"), returns to the app; the next CONTINUE resumes at the same step, even after a skip', /Nothing is owed/.test(done) && !closed.root && closed.door === 'open' && resumed.id === at1.id, { done: done.slice(0, 80), closed, resumed, at1 });

    // model reacts to its controls
    const m = await p.evaluate(() => {
      const r = RENAISSANCE.current();
      return r;
    });
    // finish the session
    const ended = await runToEnd(p);
    const after = await p.evaluate(() => ({ st: RENAISSANCE.state(), door: document.querySelector('.rnEntry')?.textContent || '', gate: RENAISSANCE.gate().why }));
    const rec = after.st.sessions.commit || {};
    const hooks = after.st.hooks;
    check('R10', 'Finishing writes a receipt (what changed, evidence, what comes back) and schedules the hooks 1, 7 and 30 days out', ended && rec.done && (rec.receipt || []).some((l) => /What changed/.test(l)) && (rec.receipt || []).some((l) => /Evidence/.test(l)) && hooks['commit.h1']?.due === '2026-09-27' && hooks['commit.h2']?.due === '2026-10-03' && hooks['commit.h3']?.due === '2026-10-26', { ended, rec: rec.receipt, hooks });
    check('R11', 'One session a day: after it the door says today is done and nothing more is owed (the stop rule)', after.gate === 'spent' && /nothing more is owed|rest of the day is yours/i.test(after.door), { gate: after.gate, door: after.door.slice(0, 120) });

    const cnsAfter = await p.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((k) => k !== 'renaissance_v1').map((k) => [k, localStorage.getItem(k)])));
    const changed = Object.keys({ ...cnsBefore, ...cnsAfter }).filter((k) => cnsBefore[k] !== cnsAfter[k]);
    check('R12', 'Isolation: a whole Renaissance session changes no CNS storage; its own state lives only under "renaissance_v1"', changed.length === 0, { changed });

    const touch = await p.evaluate(() => {
      document.querySelector('[data-rn-open]');
      return null;
    });
    check('R13', 'No page errors during the session', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 2. the next day: hooks come back first, without hints ──
  {
    const s = await open({ v16: true, time: '2026-09-27T19:00:00+03:00', state: null, settle: 1500, viewport: { width: 820, height: 1180 } });
    const p = s.page;
    await p.evaluate(() => {
      localStorage.setItem('renaissance_v1', JSON.stringify({ v: 1, sessions: { commit: { start: 1, done: true, end: 2, endDay: '2026-09-26', at: 'c10' } }, days: { '2026-09-26': 24 }, answers: [], hooks: { 'commit.h1': { due: '2026-09-27', gap: 1, n: 0, ok: 0 }, 'commit.h2': { due: '2026-10-03', gap: 7, n: 0, ok: 0 } }, bugs: {}, xray: {}, reps: {}, clicks: [], forge: { commit: { t: 1, text: 'Protecting the 1 am scroll…' } }, reality: {}, lastWarm: '' }));
      RENAISSANCE.reload();
    });
    await p.evaluate(STOP);
    await p.evaluate(() => document.querySelector('[data-rn-open]').click());
    const first = await cur(p);
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="reality"][data-k="used"]').click());
    await go(p);
    const hook = await p.evaluate(() => ({ c: RENAISSANCE.current(), banner: document.querySelector('#rnRoot .rnBanner')?.textContent || '', vis: !!document.querySelector('#rnRoot .rnBody .rnVis'), dis: ['smd', 'xray', 'already'].map((k) => document.querySelector('#rnRoot [data-rn="' + k + '"]').disabled) }));
    await answer(p, 'right', 'sure');
    const h = await p.evaluate(() => RENAISSANCE.state().hooks['commit.h1']);
    check('R14', 'Next day: "did you use it?" first, then yesterday\'s hook without hints (no picture; SHOW ME DIFFERENTLY / DIDN\'T CLICK / I ALREADY GET THIS off); a right, sure answer pushes it further out', first.type === 'reality' && hook.c.kind === 'hook' && /no hints/.test(hook.banner) && !hook.vis && hook.dis.every(Boolean) && h.n === 1 && h.gap >= 2 && h.due > '2026-09-28', { first, hook, h });
    const sid = await p.evaluate(() => RENAISSANCE.current().sid);
    check('R15', 'The next session follows (selection), never two sessions in one day', sid === 'select', { sid });
    await s.close();
  }

  // ── 3. stop rules and no backlog ──
  {
    const at = async (time, st, fn) => {
      const s = await open({ v16: true, time, state: null, settle: 1200 });
      await s.page.evaluate((st) => { if (st) localStorage.setItem('renaissance_v1', JSON.stringify(st)); RENAISSANCE.reload(); nextAction = () => ({ kind: 'STOP' }); }, st);
      const r = await s.page.evaluate(fn);
      await s.close();
      return r;
    };
    const g = () => { const x = RENAISSANCE.gate(); return { open: x.open, why: x.why, dose: x.dose, short: x.plan && x.plan.short, n: x.plan && x.plan.steps.length, min: x.plan && x.plan.minutes, reasons: x.reasons }; };
    const exam = await at('2026-11-14T18:00:00+02:00', null, g);
    const late = await at('2026-09-28T01:30:00+03:00', null, g);
    const week = await at('2026-11-10T18:00:00+02:00', null, g);
    const full = await at('2026-09-28T18:00:00+03:00', null, g);
    check('R16', 'Life first: exam weekend → shut; 01:00–05:00 → shut (sleep); exam week → a real 10-minute dose (the session continues another day)', !exam.open && exam.why === 'exam' && !late.open && late.why === 'sleep' && week.open && week.dose === 10 && week.short && week.n < full.n && week.min <= 12 && full.min <= 30, { exam, late, week, full });
    const days = {}; for (let i = 1; i <= 7; i++) days['2026-09-' + String(28 - i).padStart(2, '0')] = 55;
    const heavy = await at('2026-09-28T18:00:00+03:00', { v: 1, sessions: {}, days, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, lastWarm: '' }, g);
    const days2 = {}; for (let i = 1; i <= 7; i++) days2['2026-09-' + String(28 - i).padStart(2, '0')] = 42;
    const warm = await at('2026-09-28T18:00:00+03:00', { v: 1, sessions: {}, days: days2, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, lastWarm: '' }, g);
    check('R17', 'Human-life test: when Renaissance takes too much of the week it shrinks itself (≥245 min → 10-min dose) and then rests (≥300 min → shut)', !heavy.open && heavy.why === 'week' && warm.open && warm.dose === 10, { heavy, warm });
    const gap = await at('2026-10-09T18:00:00+03:00', { v: 1, sessions: { commit: { start: 1, done: true, end: 2, endDay: '2026-09-26' } }, days: { '2026-09-26': 24 }, answers: [], hooks: { 'commit.h1': { due: '2026-09-27', gap: 1, n: 0, ok: 0 }, 'commit.h2': { due: '2026-10-03', gap: 7, n: 0, ok: 0 } }, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, lastWarm: '' }, () => {
      const x = RENAISSANCE.gate();
      render();
      return { open: x.open, sid: x.plan.sid, warm: x.plan.steps.filter((s) => s.stage === 'warm').length, min: x.plan.minutes, door: document.querySelector('.rnEntry')?.textContent || '' };
    });
    check('R18', 'No backlog: after 12 missed days the door offers one ordinary session (one or two warm-ups, normal length) and never says "behind", "missed" or "streak"', gap.open && gap.sid === 'select' && gap.warm <= 2 && gap.min <= 30 && !/behind|missed|streak|catch up/i.test(gap.door), gap);
  }

  // ── 3b. a short-dose day continues the session instead of finishing it ──
  {
    const s = await open({ v16: true, time: '2026-11-10T18:00:00+02:00', state: null, settle: 1200, viewport: { width: 820, height: 1180 } });
    const p = s.page;
    await p.evaluate(STOP);
    await p.evaluate(() => document.querySelector('[data-rn-open]').click());
    const ended = await runToEnd(p);
    const day1 = await p.evaluate(() => ({ st: RENAISSANCE.state().sessions.commit, gate: RENAISSANCE.gate().why }));
    await p.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('renaissance_v1'));
      st.sessions.commit.endDay = '2026-11-09';
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
    });
    const next = await p.evaluate(() => { const g = RENAISSANCE.gate(); return { sid: g.plan.sid, first: g.plan.steps.filter((x) => x.stage !== 'warm')[0].id }; });
    check('R27', 'A 10-minute day ends with a short receipt and does not close the session; the next day continues from the next step', ended && day1.st && !day1.st.done && day1.st.at && day1.gate === 'spent' && next.sid === 'commit' && next.first === day1.st.at, { ended, day1, next });
    await s.close();
  }

  // ── 4. kill switch ──
  {
    const s = await open({ v16: true, time: '2026-09-26T19:00:00+03:00', state: null, settle: 1200, url: (process.env.APP_URL || 'http://127.0.0.1:8787/') + '?renaissance=off' });
    const p = s.page;
    const offq = await p.evaluate(() => { nextAction = () => ({ kind: 'STOP' }); render(); return { why: RENAISSANCE.gate().why, door: !!document.querySelector('.rnEntry'), booted: !!window.RENAISSANCE_BOOTED }; });
    await p.evaluate(() => localStorage.setItem('renaissance_off', '1'));
    await p.reload();
    await p.waitForTimeout(1500);
    const offl = await p.evaluate(() => { nextAction = () => ({ kind: 'STOP' }); render(); return { why: RENAISSANCE.gate().why, door: !!document.querySelector('.rnEntry'), stop: /STOP MEDICINE/.test(document.querySelector('#player')?.textContent || '') }; });
    check('R19', 'Kill switches: ?renaissance=off or localStorage "renaissance_off" = 1 → no door, not even booted, and the CNS STOP screen is unchanged', offq.why === 'off' && !offq.door && offl.why === 'off' && !offl.door && offl.stop, { offq, offl });
    await s.close();
  }

  // ── 5. content integrity, every session ──
  {
    const s = await open({ v16: true, time: '2026-09-26T19:00:00+03:00', state: null, settle: 1200 });
    const p = s.page;
    const audit = await p.evaluate(() => {
      const S = { sessions: window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions) }, B = RENAISSANCE.BUGS, bad = [];
      const qs = (ses) => {
        const out = [];
        for (const st of ses.steps) {
          if (st.type === 'q') out.push([st.id, st]);
          if (st.type === 'contrast') out.push([st.id, st.q]);
          if (st.type === 'forge' && st.critique) out.push([st.id + ':c', st.critique]);
        }
        out.push(['challenge', ses.challenge]);
        for (const h of ses.hooks) out.push([h.id, h.q]);
        return out;
      };
      const texts = [];
      const per = {};
      for (const ses of S.sessions) {
        const ids = new Set(ses.provenance.map((x) => x.id));
        const kinds = ses.steps.map((x) => x.kind || x.type);
        per[ses.id] = { predict: kinds.filter((k) => k === 'predict' || k === 'alien').length, transfer: kinds.filter((k) => k === 'transfer').length, far: kinds.filter((k) => k === 'far' || k === 'alien').length, contrast: kinds.filter((k) => k === 'contrast').length, model: kinds.filter((k) => k === 'model').length, forge: kinds.filter((k) => k === 'forge').length, hooks: ses.hooks.length, min: ses.steps.reduce((a, x) => a + (x.min || 1), 0), minShort: ses.steps.filter((x) => !x.opt).reduce((a, x) => a + (x.min || 1), 0) };
        for (const st of ses.steps) for (const id of st.src || []) if (!ids.has(id)) bad.push(ses.id + ':' + st.id + ' cites missing ' + id);
        for (const [id, q] of qs(ses)) {
          if (!q || !q.options) { bad.push(ses.id + ':' + id + ' has no options'); continue; }
          if (q.options.filter((o) => o.ok).length !== 1) bad.push(ses.id + ':' + id + ' needs exactly one right option');
          for (const o of q.options) if (!o.ok && !(o.bug && B[o.bug])) bad.push(ses.id + ':' + id + ' wrong option without a known misconception: ' + o.t);
          for (const o of q.options) if (!o.ok && !o.why && !/^(challenge|.*\.h\d)$/.test(id)) bad.push(ses.id + ':' + id + ' wrong option without a diagnosis: ' + o.t);
        }
        for (const [k, v] of Object.entries(ses.vocab)) if (!(v.h && v.s && v.t && /[؀-ۿ]/.test(v.s))) bad.push(ses.id + ' vocab ' + k + ' is missing a layer');
        for (const pr of ses.provenance) if (!(pr.source && pr.year && pr.license && /^[ABC]$/.test(pr.grade))) bad.push(ses.id + ' provenance ' + pr.id + ' incomplete');
        // quotations of real people: the quoted words must be registered as a short quotation and cited where used
        const quoted = ses.provenance.filter((x) => x.license === 'short quotation');
        for (const qx of quoted) {
          const m = /“(.+?)”/.exec(qx.claim);
          const users = ses.steps.filter((st) => JSON.stringify(st).includes(m[1]));
          if (!m || !users.length || users.some((st) => !(st.src || []).includes(qx.id))) bad.push(ses.id + ' quotation ' + qx.id + ' not cited where used');
        }
        texts.push(JSON.stringify(ses));
      }
      const all = texts.join(' ');
      const lazy = /what do you think|reflect on|discuss this|write about|explore the implications|how did this make you feel|research (this|it)|go to wikipedia|read chapter/i.exec(all);
      const links = /https?:\/\//.exec(all);
      const slop = /\b(streak bonus|XP|leaderboard|badges?|earn(ed)? points|\+\d+ points)\b/.exec(all);
      // test-wise counterfeit learners (§130, §143): strategies that never read for meaning; ties resolve at chance
      const items = [];
      for (const ses of S.sessions) for (const [, q] of qs(ses)) if (q && q.options) items.push(q.options);
      const pick = (o, score) => { const v = o.map(score), m = Math.max(...v), top = o.filter((x, i) => v[i] === m); return top.filter((x) => x.ok).length / top.length; };
      const strat = {
        longest: (o) => pick(o, (x) => x.t.length), shortest: (o) => pick(o, (x) => -x.t.length), mostWords: (o) => pick(o, (x) => x.t.split(/\s+/).length),
        punctuated: (o) => pick(o, (x) => (/[:;—]/.test(x.t) ? 1 : 0)), hedged: (o) => pick(o, (x) => (/\b(not|only|usually|about|may|most|often|some)\b/i.test(x.t) ? 1 : 0)),
        jargon: (o) => pick(o, (x) => (x.t.match(/\b[a-z]{10,}\b/gi) || []).length), noAbsolutes: (o) => pick(o, (x) => (/\b(always|never|all|every|nothing|no one|entirely|simply)\b/i.test(x.t) ? 0 : 1)),
      };
      const chance = items.reduce((a, o) => a + 1 / o.length, 0) / items.length;
      const counterfeit = Object.fromEntries(Object.entries(strat).map(([k, f]) => [k, +(items.reduce((a, o) => a + f(o), 0) / items.length).toFixed(3)]));
      return { bad, per, lazy: lazy && lazy[0], links: links && links[0], slop: slop && slop[0], n: S.sessions.length, counterfeit, chance: +chance.toFixed(3), nItems: items.length };
    });
    check('R20', 'Every task is precise: one right option, every wrong option pre-diagnosed with a named misconception and a repair; every cited source exists; quotations are registered and cited', audit.bad.length === 0, audit.bad.slice(0, 10));
    const shapes = Object.entries(audit.per).filter(([, v]) => !(v.predict >= 2 && v.transfer >= 1 && v.far >= 1 && v.contrast === 1 && v.model === 1 && v.forge === 1 && v.hooks >= 3 && v.min <= 30));
    check('R21', 'Every session of every season has the full arc: ≥2 committed predictions (unlabelled items count), a model, two cases compared, near and far transfer, a forge, ≥3 hooks; ≤30 min', audit.n >= 12 && shapes.length === 0, { n: audit.n, per: audit.per, shapes });
    check('R35', 'Test-wise counterfeit learners fail: picking the longest, shortest, wordiest, punctuated, hedged, jargon-heavy or absolute-free option scores within 0.12 of chance on every item of every season', Object.values(audit.counterfeit).every((v) => v <= audit.chance + 0.12), { chance: audit.chance, n: audit.nItems, counterfeit: audit.counterfeit });
    check('R22', 'No open-ended thinking tax ("what do you think", "reflect", "research…"), no links out, no points/badges', !audit.lazy && !audit.links && !audit.slop, audit);

    // right answers are not in a predictable place; buttons are big enough to tap
    await p.evaluate(STOP);
    await p.evaluate(() => document.querySelector('[data-rn-open]').click());
    const pos = [];
    for (let i = 0; i < 14; i++) {
      const c = await cur(p);
      if (!c) break;
      if (c.type === 'q' || c.type === 'contrast') {
        const where = await p.evaluate(() => {
          const c = RENAISSANCE.current(), ses = window.RENAISSANCE_SEASONS.flatMap((z) => z.sessions).find((x) => x.id === c.sid), st = ses.steps.find((x) => x.id === c.id);
          const opts = st.type === 'contrast' ? st.q.options : st.options, k = opts.findIndex((o) => o.ok);
          return [...document.querySelectorAll('#rnRoot .rnBody [data-rn="pick"]')].findIndex((b) => +b.dataset.k === k);
        });
        pos.push(where);
        await answer(p, 'right', 'think');
      }
      if (c.type === 'model') {
        const before = await p.evaluate(() => document.querySelector('#rnRoot .rnRead').textContent);
        await p.evaluate(() => { const r = document.querySelector('#rnRoot input[type=range]'); r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true })); });
        const afterM = await p.evaluate(() => document.querySelector('#rnRoot .rnRead').textContent);
        check('R23', 'The interactive model answers its controls (moving a slider redraws the picture and the numbers)', before !== afterM, { before: before.slice(0, 80), afterM: afterM.slice(0, 80) });
      }
      if (c.type === 'forge') await forgeAndCritique(p);
      const small = await p.evaluate(() => [...document.querySelectorAll('#rnRoot button')].filter((b) => !b.closest('p') && b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.className + ':' + Math.round(b.getBoundingClientRect().height)));
      if (small.length) { check('R24', 'Every Renaissance button is at least 44 px tall', false, small.slice(0, 5)); break; }
      await go(p);
    }
    if (!results.some((r) => r.id === 'R24')) check('R24', 'Every Renaissance button is at least 44 px tall', true);
    check('R25', 'Right answers sit in different positions (the order is shuffled per item, stable across redraws)', new Set(pos).size >= 3, { pos });
    check('R26', 'No page errors in content checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 6. season 2 (OMEGA): order across seasons, side-by-side blind comparisons, unlabelled items, the belief ledger,
  //       capability atoms, every model reacting, every term resolving ──
  {
    const s = await open({ v16: true, time: '2026-09-26T19:00:00+03:00', state: null, settle: 1200 });
    const p = s.page;
    const S1 = ['commit', 'select', 'base', 'loop', 'proxy', 'falsify'];
    const seed = (done) => p.evaluate((done) => {
      const st = { v: 1, sessions: Object.fromEntries(done.map((id) => [id, { done: true }])), days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps: {}, clicks: [], forge: {}, reality: {}, beliefs: [], lastWarm: '' };
      localStorage.setItem('renaissance_v1', JSON.stringify(st));
      RENAISSANCE.reload();
      nextAction = () => ({ kind: 'STOP' });
      render();
      const e = document.querySelector('.rnEntry');
      return { q: e?.querySelector('.rnEntryQ')?.textContent || '', state: e?.dataset.rnState || null };
    }, done);
    const openDoor = () => p.evaluate(() => { document.querySelector('[data-rn-open]').click(); return RENAISSANCE.current(); });

    const seasons = await p.evaluate(() => window.RENAISSANCE_SEASONS.map((z) => ({ id: z.id, n: z.sessions.length, ids: z.sessions.map((x) => x.id) })));
    const allIds = seasons.flatMap((z) => z.ids);
    const door = await seed(S1);
    const hook2 = await p.evaluate(() => window.RENAISSANCE_SEASONS[1].sessions[0].hook);
    const c0 = await openDoor();
    check('R28', 'Season 2 follows season 1: six new sessions with unique ids; when season 1 is done the door asks season 2\'s first question and opens it', seasons.length >= 2 && seasons[1].n === 6 && new Set(allIds).size === allIds.length && door.state === 'open' && door.q === hook2 && c0 && c0.sid === seasons[1].ids[0], { seasons, door, c0 });
    await p.evaluate(() => RENAISSANCE.close && RENAISSANCE.close());

    // blind taste: two unlabelled versions side by side, a committed pick, the belief recorded and shown back
    await seed(S1.concat(['bottleneck', 'question', 'snow', 'double']));
    const ct = await openDoor();
    const pair = await p.evaluate(() => [...document.querySelectorAll('#rnRoot .rnBody .rnPair .rnSide')].map((x) => x.textContent.trim().length));
    const wrong = await answer(p, 'wrong', 'sure');
    const led = await p.evaluate(() => RENAISSANCE.state().beliefs.slice(-1)[0] || null);
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="why"]').click());
    const why = await p.evaluate(() => document.querySelector('#rnRoot .rnSheet')?.textContent || '');
    await p.evaluate(() => document.querySelector('#rnRoot [data-rn="unsheet"]').click());
    check('R29', 'Blind comparison: the taste session opens on two versions side by side; a confident wrong pick is kept in the belief ledger (what was held → what replaced it) and WHY THIS? shows it with the capability atoms the step trains', ct.sid === 'taste' && pair.length === 2 && pair.every((n) => n > 20) && led && led.conf === 'sure' && !led.ok && led.held && led.revisedTo && /Beliefs you revised/.test(why) && /This step trains:/.test(why), { ct, pair, wrong, led, why: why.slice(-400) });
    let svgPanels = 0;
    for (let i = 0; i < 6 && !svgPanels; i++) {
      await go(p);
      const c = await cur(p);
      if (c && c.id === 't4') svgPanels = await p.evaluate(() => document.querySelectorAll('#rnRoot .rnBody .rnPair .rnSide svg').length);
    }
    check('R30', 'A chart comparison draws both charts from the same numbers, side by side', svgPanels === 2, { svgPanels });
    await p.evaluate(() => RENAISSANCE.close && RENAISSANCE.close());

    // the boss world: unlabelled items say only "which idea is this?", and count as far transfer and as beliefs
    await seed(allIds.filter((x) => x !== 'boss'));
    const cb = await openDoor();
    await go(p);
    const tag = await p.evaluate(() => document.querySelector('#rnRoot .rnBody .rnKind')?.textContent || '');
    await answer(p, 'right', 'think');
    const lastA = await p.evaluate(() => RENAISSANCE.state().answers.slice(-1)[0] || null);
    check('R31', 'The boss world is unlabelled: its items name no session and are recorded as their own kind (far transfer, and a belief on record)', cb.sid === 'boss' && /NO LABELS/.test(tag) && lastA && lastA.kind === 'alien' && lastA.ok && (lastA.atoms || []).length > 0, { cb, tag, lastA });
    await p.evaluate(() => RENAISSANCE.close && RENAISSANCE.close());

    // static checks over every season: models react, atoms and terms resolve
    const stat = await p.evaluate(() => {
      const bad = [], A = RENAISSANCE.ATOMS;
      for (const z of window.RENAISSANCE_SEASONS) {
        for (const [id, m] of Object.entries(z.models || {})) {
          const v0 = Object.fromEntries([...(m.controls || []).map((c) => [c.id, c.value]), ...(m.toggles || []).map((c) => [c.id, c.value])]);
          const variants = [...(m.controls || []).map((c) => Object.assign({}, v0, { [c.id]: c.value === c.min ? c.max : c.min })), ...(m.toggles || []).map((c) => Object.assign({}, v0, { [c.id]: !c.value }))];
          const d0 = m.draw(v0), r0 = m.read(v0);
          // text models (a reader, a register card) draw HTML text instead of a figure
          if (!(m.text ? d0.replace(/<[^>]+>/g, '').trim().length > 40 : /<svg/.test(d0)) || !r0) bad.push(z.id + ' model ' + id + ' draws nothing');
          variants.forEach((v, i) => { if (m.draw(v) === d0 && m.read(v) === r0) bad.push(z.id + ' model ' + id + ' ignores control ' + i); });
        }
        const vocab = new Set(window.RENAISSANCE_SEASONS.flatMap((y) => y.sessions.flatMap((x) => Object.keys(x.vocab || {}))));
        for (const ses of z.sessions) {
          for (const k of ses.atoms || []) if (!A[k]) bad.push(ses.id + ' unknown atom ' + k);
          for (const st of ses.steps) {
            for (const k of st.atoms || []) if (!A[k]) bad.push(ses.id + ':' + st.id + ' unknown atom ' + k);
            for (const k of st.terms || []) if (!vocab.has(k)) bad.push(ses.id + ':' + st.id + ' unknown term ' + k);
            for (const m of JSON.stringify(st).matchAll(/\[\[(.+?)(?:\|.+?)?\]\]/g)) if (!vocab.has(m[1])) bad.push(ses.id + ':' + st.id + ' unknown term link ' + m[1]);
            if (st.type === 'model' && !(z.models || {})[st.model]) bad.push(ses.id + ':' + st.id + ' missing model ' + st.model);
            for (const v of [st.svg, ...(st.reps || []).map((r) => r.svg), ...(st.panels || []).map((r) => r.svg), st.left && st.left.svg, st.right && st.right.svg].filter((x) => typeof x === 'string')) if (!(z.visuals || {})[v]) bad.push(ses.id + ':' + st.id + ' missing visual ' + v);
          }
        }
        if (!z.sessions.every((x) => (x.atoms || []).length)) bad.push(z.id + ' has a session without atoms');
      }
      return bad;
    });
    check('R32', 'Every model in every season reacts to each of its controls; every atom, term, model and picture a step names exists', stat.length === 0, stat.slice(0, 10));
    check('R33', 'No page errors in the season 2 checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── 7. phone legibility: every figure and every model state, measured on a 360-px phone ──
  {
    const s = await open({ v16: true, time: '2026-09-26T19:00:00+03:00', state: null, settle: 1200, viewport: { width: 360, height: 780 } });
    const p = s.page;
    const res = await p.evaluate(() => {
      nextAction = () => ({ kind: 'STOP' });
      render();
      document.querySelector('[data-rn-open]').click();
      const body = document.querySelector('#rnRoot .rnBody');
      const bad = [], seen = [];
      let minPx = 99;
      const measure = (html, where, ctx) => {
        body.innerHTML = ctx === 'side' ? '<div class="rnPair"><div class="rnSide"><div class="rnVis">' + html + '</div></div></div>' : ctx === 'model' ? '<div class="rnModel"><div class="rnModelSvg">' + html + '</div></div>' : '<div class="rnVis">' + html + '</div>';
        const svg = body.querySelector('svg');
        if (!svg) return bad.push(where + ': no svg');
        const [, , W, H] = svg.getAttribute('viewBox').split(/\s+/).map(Number), k = svg.getBoundingClientRect().width / W;
        const boxes = [];
        for (const el of svg.querySelectorAll('text')) {
          if (!el.textContent.trim()) continue;
          const px = +el.getAttribute('font-size') * k, b = el.getBBox();
          minPx = Math.min(minPx, px);
          if (px < 9.9) bad.push(where + ': "' + el.textContent + '" renders at ' + px.toFixed(1) + 'px');
          if (b.x < -1 || b.y < -1 || b.x + b.width > W + 1 || b.y + b.height > H + 1) bad.push(where + ': "' + el.textContent + '" is cut off');
          boxes.push([el.textContent, b]);
        }
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
          const [ta, a] = boxes[i], [tb, b] = boxes[j];
          const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x), h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
          if (w > 0 && h > 0 && w * h > 0.25 * Math.min(a.width * a.height, b.width * b.height)) bad.push(where + ': "' + ta + '" overlaps "' + tb + '"');
        }
        seen.push(where);
      };
      // HTML text models: every text at least 12 px and nothing wider than the phone
      const measureText = (html, where) => {
        body.innerHTML = '<div class="rnModel"><div class="rnModelSvg">' + html + '</div></div>';
        const root = body.querySelector('.rnModelSvg');
        for (const el of root.querySelectorAll('*')) {
          if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          const px = parseFloat(getComputedStyle(el).fontSize);
          minPx = Math.min(minPx, px);
          if (px < 12) bad.push(where + ': text renders at ' + px + 'px');
        }
        if (root.scrollWidth > root.clientWidth + 1) bad.push(where + ': text wider than the phone');
        seen.push(where);
      };
      for (const z of window.RENAISSANCE_SEASONS) {
        const side = new Set();
        for (const ses of z.sessions) for (const st of ses.steps) {
          for (const pn of st.panels || []) if (typeof pn.svg === 'string') side.add(pn.svg);
          for (const c of [st.left, st.right]) if (c && typeof c.svg === 'string') side.add(c.svg);
        }
        for (const [id, f] of Object.entries(z.visuals || {})) measure(f(), z.id + ' visual ' + id, side.has(id) ? 'side' : 'full');
        for (const [id, m] of Object.entries(z.models || {})) {
          const v0 = Object.fromEntries([...(m.controls || []).map((c) => [c.id, c.value]), ...(m.toggles || []).map((c) => [c.id, c.value])]);
          const vs = [v0];
          for (const c of m.controls || []) vs.push(Object.assign({}, v0, { [c.id]: c.min }), Object.assign({}, v0, { [c.id]: c.max }));
          for (const c of m.toggles || []) vs.push(Object.assign({}, v0, { [c.id]: !c.value }));
          if ((m.toggles || []).length > 1) vs.push(Object.assign({}, v0, Object.fromEntries(m.toggles.map((c) => [c.id, !c.value]))));
          vs.forEach((v, i) => (m.text ? measureText : measure)(m.draw(v), z.id + ' model ' + id + '#' + i, 'model'));
        }
      }
      return { bad, n: seen.length, minPx: +minPx.toFixed(1) };
    });
    check('R34', 'On a 360-px phone every label of every figure and every model state is at least 10 px, inside its canvas, and does not sit on another label', res.bad.length === 0 && res.n > 60, { n: res.n, minPx: res.minPx, bad: res.bad.slice(0, 12), more: res.bad.length });
    await s.close();
  }

  // ── 8. the pedagogy governor: level 1 acts on the learner's record, level 2 judges level 1 against a control arm ──
  {
    const days = ['2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01'];
    const seedAndOpen = async (p, gov) => p.evaluate((gov) => {
      const reps = gov === 'none' ? {} : { select: { diagram: { shown: 10, then_ok: 3 }, story: { shown: 10, then_ok: 9 } } };
      const g = gov === 'failing' ? { off: false, log: [...Array(20)].map((_, i) => ({ explore: false, ok: i < 8 })).concat([...Array(5)].map(() => ({ explore: true, ok: true }))) } : { off: false, log: [] };
      localStorage.setItem('renaissance_v1', JSON.stringify({ v: 1, sessions: {}, days: {}, answers: [], hooks: {}, bugs: {}, xray: {}, reps, clicks: [], forge: {}, reality: {}, beliefs: [], gov: g, lastWarm: '' }));
      RENAISSANCE.reload();
      nextAction = () => ({ kind: 'STOP' });
      render();
      document.querySelector('[data-rn-open]').click();
      const c = RENAISSANCE.current();
      const shown = document.querySelector('#rnRoot .rnBody .rnRep')?.dataset.kind || null;
      document.querySelector('#rnRoot [data-rn="why"]').click();
      const why = document.querySelector('#rnRoot .rnSheet')?.textContent || '';
      document.querySelector('#rnRoot [data-rn="unsheet"]').click();
      const G = RENAISSANCE.governor();
      return { id: c.id, shown, why, last: G.state.log.slice(-1)[0] || null, off: G.state.off, n: G.state.log.length };
    }, gov);

    // no record yet: the authored order stays and nothing is logged as a choice
    let s = await open({ v16: true, time: days[0] + 'T19:00:00+03:00', state: null, settle: 1200 });
    const fresh = await seedAndOpen(s.page, 'none');
    await s.close();
    // a record that favours stories: the chooser puts the story first, except on control days, and says so
    const seen = [];
    for (const d of days) {
      s = await open({ v16: true, time: d + 'T19:00:00+03:00', state: null, settle: 1200 });
      const r = await seedAndOpen(s.page, 'favour');
      if (r.last && !r.last.explore) {
        await answer(s.page, 'right', 'think').catch(() => null);
        await go(s.page);
        await answer(s.page, 'right', 'think').catch(() => null);
        r.after = await s.page.evaluate(() => RENAISSANCE.governor().state.log.slice(-1)[0]);
      }
      seen.push(r);
      await s.close();
      if (seen.some((x) => x.last && !x.last.explore) && seen.some((x) => x.last && x.last.explore)) break;
    }
    const chose = seen.find((x) => x.last && !x.last.explore), kept = seen.find((x) => x.last && x.last.explore);
    check('R36', 'Pedagogy governor, level 1: with no record the authored picture comes first; when one kind of picture has preceded right answers clearly more often for this learner it is shown first, except on control days when the usual order is kept; WHY THIS? says which and why; the outcome is logged', fresh.id === 'c1' && fresh.shown === 'diagram' && fresh.n === 0 && chose && chose.shown === 'story' && /Picture chosen for you/.test(chose.why) && chose.after && typeof chose.after.ok === 'boolean' && (!kept || (kept.shown === 'diagram' && /kept this time on purpose/.test(kept.why))), { fresh: { id: fresh.id, shown: fresh.shown, n: fresh.n }, seen: seen.map((x) => ({ shown: x.shown, last: x.last, after: x.after })) });

    // level 2: a chooser that has not beaten its control arm switches itself off and says so
    s = await open({ v16: true, time: days[0] + 'T19:00:00+03:00', state: null, settle: 1200 });
    const failing = await seedAndOpen(s.page, 'failing');
    check('R37', 'Pedagogy governor, level 2: after 20 choices that did no better than the control arm (8/20 vs 5/5), the chooser switches itself off, pictures return to the authored order, and WHY THIS? explains it', failing.off === true && failing.shown === 'diagram' && /switched off/.test(failing.why), { off: failing.off, shown: failing.shown, why: failing.why.slice(-300) });
    check('R38', 'No page errors in the governor checks', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'renaissance_test.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
