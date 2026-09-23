// INTELLECTUALITY v14.2 certification suite (docs/CERTIFICATION_MATRIX.md A–N).
// Usage: node tests/certify.js [outDir]   (server: node tests/serve.js source/public 8787)
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const OUT = process.argv[2] || path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const results = [];
function check(id, name, ok, detail = '') {
  results.push({ id, name, ok: !!ok, detail: typeof detail === 'string' ? detail : JSON.stringify(detail) });
  console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(6) + name + (detail ? '  · ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 220) : ''));
}
const T = (d) => d; // ISO strings with explicit +03:00 (Africa/Cairo, EEST in September)

async function toQuestion(page, max = 14) {
  for (let i = 0; i < max; i++) {
    const k = await page.evaluate(() => { const a = nextAction(); return a.kind + ':' + (a.seg?.type || ''); });
    if (k === 'SEGMENT:question') return true;
    const clicked = await page.evaluate(() => { const b = document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"], #player [data-act="finish-qbank"]'); if (b) { b.click(); return true; } return false; });
    await page.waitForTimeout(160);
    if (!clicked) return false;
  }
  return false;
}
async function currentQ(page) {
  return page.evaluate(() => { const a = nextAction(); if (a.kind !== 'SEGMENT' || a.seg.type !== 'question') return null; const q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return q && { id: q.id, keys: q.answerKeys, opts: q.options.map(o => o.key), stem: q.stem, subject: q.subject, lesson: a.l.id, slot: a.seg.questionIndex || 0, segKey: a.key }; });
}
async function reveal(page) { await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(220); }
async function setConf(page, c) { await page.evaluate((c) => document.querySelector('[data-conf="' + c + '"]')?.click(), c); await page.waitForTimeout(120); }
async function choose(page, key) { await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]')?.click(), key); await page.waitForTimeout(450); }
async function stateOf(page) { return page.evaluate(() => JSON.parse(JSON.stringify(S))); }
function wrongKey(q) { return q.opts.find((k) => !q.keys.includes(k)); }
async function noOverflow(page) { return page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, ok: document.documentElement.scrollWidth <= innerWidth + 1 })); }

(async () => {
  const t0 = Date.now();
  // ───────── A · Calendar truth ─────────
  {
    const s = await open({ time: T('2026-09-22T10:00:00+03:00'), state: null, settle: 1300 });
    const r = await s.page.evaluate(() => ({ chip: document.querySelector('#v14Calendar')?.textContent, ey: document.querySelector('#eyebrow')?.textContent, banner: document.querySelector('.v14Carryover')?.innerText || '', rail: document.querySelector('.railLabel')?.textContent, day: S.day }));
    check('A1', 'Fresh state on Sep 22: real date + first-run catch-up label, no fake date', r.chip === 'TODAY · TUE 22 SEP · FIRST-RUN CATCH-UP' && /TODAY TUE 22 SEP/.test(r.ey) && /Today is Tue 22 Sep/.test(r.banner) && r.day === 1, r);
    await s.close();
  }
  // build a Day-1 partial state created on Sep 21
  let partialDay1;
  {
    const s = await open({ time: T('2026-09-21T18:00:00+03:00'), state: null, settle: 1200 });
    const chip21 = await s.page.evaluate(() => document.querySelector('#v14Calendar')?.textContent);
    check('A0', 'Sep 21 (course day 1): chip is plain real date', chip21 === 'TODAY · MON 21 SEP', chip21);
    for (let i = 0; i < 3; i++) { await s.page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]')?.click()); await s.page.waitForTimeout(150); }
    partialDay1 = await stateOf(s.page);
    await s.close();
  }
  {
    const s = await open({ time: T('2026-09-22T00:01:00+03:00'), state: partialDay1, settle: 1300 });
    const r = await s.page.evaluate(() => ({ chip: document.querySelector('#v14Calendar')?.textContent, banner: document.querySelector('.v14Carryover')?.innerText || '', day: S.day, segs: Object.values(S.segments).filter(Boolean).length, ey: document.querySelector('#eyebrow')?.textContent, rail: document.querySelector('.railLabel')?.textContent }));
    check('A2', 'Sep 22 00:01 with Day-1 partial: "1 DAY CARRYOVER" + deliberate carryover banner, work kept', r.chip === 'TODAY · TUE 22 SEP · 1 DAY CARRYOVER' && /This is unfinished Mon 21 Sep work, carried forward deliberately/.test(r.banner) && r.day === 1 && r.segs === Object.values(partialDay1.segments).filter(Boolean).length, r);
    await s.close();
  }
  {
    // midnight rollover: Sep 21 23:59 → 00:01 without reload
    const s = await open({ time: T('2026-09-21T23:59:00+03:00'), state: partialDay1, settle: 1000 });
    const before = await s.page.evaluate(() => document.querySelector('#v14Calendar')?.textContent);
    await s.page.clock.runFor(125000);
    await s.page.waitForTimeout(400);
    const after = await s.page.evaluate(() => document.querySelector('#v14Calendar')?.textContent);
    check('A3', 'Midnight rollover re-evaluates without reload (23:59 → 00:01)', before === 'TODAY · MON 21 SEP' && after === 'TODAY · TUE 22 SEP · 1 DAY CARRYOVER', { before, after });
    await s.close();
  }
  {
    // Day-1 fully complete but not certified → auto-certified on Sep 22
    const st = JSON.parse(JSON.stringify(partialDay1));
    const s0 = await open({ time: T('2026-09-21T20:00:00+03:00'), state: st, settle: 900 });
    const done = await s0.page.evaluate(() => { const d = C.days[0]; for (const l of d.lessons) l.segments.forEach((_, i) => (S.segments[segmentKey(d, l, i)] = true)); const bs = dayBossState(d); bs.visual = true; bs.written = true; bs.writtenRevealed = true; for (const e of Object.values(S.errors)) e.resolved = true; save(); return { p: dayProgress(d) }; });
    const complete = await stateOf(s0.page); await s0.close();
    const s = await open({ time: T('2026-09-22T09:00:00+03:00'), state: complete, settle: 1200 });
    const r = await s.page.evaluate(() => ({ chip: document.querySelector('#v14Calendar')?.textContent, day: S.day, done: S.doneDays, banner: !!document.querySelector('.v14Carryover') }));
    check('A4', 'Sep 22 with Day-1 complete: auto-advance to Day 2, plain real date', done.p === 100 && r.day === 2 && r.done.includes(1) && r.chip === 'TODAY · TUE 22 SEP' && !r.banner, r);
    await s.close();
    // Sep 23 after Day-2 partial
    const s2 = await open({ time: T('2026-09-22T12:00:00+03:00'), state: complete, settle: 1000 });
    for (let i = 0; i < 2; i++) { await s2.page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]')?.click()); await s2.page.waitForTimeout(150); }
    const day2partial = await stateOf(s2.page); await s2.close();
    const s3 = await open({ time: T('2026-09-23T08:00:00+03:00'), state: day2partial, settle: 1200 });
    const r3 = await s3.page.evaluate(() => ({ chip: document.querySelector('#v14Calendar')?.textContent, day: S.day, banner: document.querySelector('.v14Carryover')?.innerText || '' }));
    check('A5', 'Sep 23 after Day-2 partial: "TODAY · WED 23 SEP · 1 DAY CARRYOVER" (Tue 22 Sep work)', r3.chip === 'TODAY · WED 23 SEP · 1 DAY CARRYOVER' && r3.day === 2 && /unfinished Tue 22 Sep work/.test(r3.banner), r3);
    await s3.close();
  }
  {
    const st = JSON.parse(JSON.stringify(partialDay1)); st.day = 3; st.doneDays = [1, 2];
    const s = await open({ time: T('2026-09-22T09:00:00+03:00'), state: st, settle: 1000 });
    const r = await s.page.evaluate(() => ({ chip: document.querySelector('#v14Calendar')?.textContent, day: S.day }));
    check('A6', 'Ahead state: labeled AHEAD, never regresses', r.chip === 'TODAY · TUE 22 SEP · 1 DAY AHEAD' && r.day === 3, r);
    await s.close();
  }
  {
    // device clock in UTC, instant = Sep 22 01:30 Cairo
    const s = await open({ time: '2026-09-21T22:30:00Z', timezoneId: 'UTC', state: partialDay1, settle: 1000 });
    const r = await s.page.evaluate(() => document.querySelector('#v14Calendar')?.textContent);
    check('A7', 'Cairo date is used even when the device timezone is UTC', r === 'TODAY · TUE 22 SEP · 1 DAY CARRYOVER', r);
    await s.close();
  }

  // ───────── B/C · fresh learning + correct answer ─────────
  let afterCorrect;
  {
    const s = await open({ time: T('2026-09-22T10:00:00+03:00'), state: null, settle: 1300 });
    const { page, log } = s;
    await page.evaluate(() => { document.querySelector('#player [data-act="visual-hide"]')?.click(); });
    await page.waitForTimeout(150);
    await page.evaluate(() => { document.querySelector('#player [data-act="finish-segment"]')?.click(); });
    await page.waitForTimeout(400);
    const teach = await page.evaluate(() => ({ fast: !!document.querySelector('[data-act="elite-fastlane"]'), predict: document.querySelectorAll('details.v14Predict').length, sayVisible: [...document.querySelectorAll('.kasrMove .answer')].filter(x => !x.closest('details:not([open])')).length, canFast: INTELLECTUALITY_V14.canFastLane(nextAction().l) }));
    check('B1', 'Fresh learner: fast lane absent and ineligible on the teach step', !teach.fast && !teach.canFast, teach);
    check('B2', 'Professor feed hides source answers behind predict-then-reveal', teach.predict >= 1 && teach.sayVisible === 0, teach);
    await page.waitForTimeout(600);
    const imgs = await page.evaluate(() => { const srcs = [...document.querySelectorAll('#player .ctxImage img')].map(i => i.getAttribute('src')); return { n: srcs.length, uniq: new Set(srcs).size, vids: [...document.querySelectorAll('#player .ctxVideo')].map(v => v.dataset.ctxVideo) }; });
    check('K1', 'Teach screen: v10 companions capped (≤3 images), no duplicate image or teacher card', imgs.n <= 3 && imgs.uniq === imgs.n && new Set(imgs.vids).size === imgs.vids.length, imgs);
    const reached = await toQuestion(page);
    const q = await currentQ(page);
    await page.waitForTimeout(700);
    const pre = await page.evaluate(() => ({ primer: !!document.querySelector('.v14Primer'), opts: document.querySelectorAll('[data-act="qbank-choice"]').length, gate: document.querySelector('[data-v14-reveal]')?.textContent, cmd: document.querySelector('.v14Primer .v14Command .v14Ar')?.textContent, vis: document.querySelectorAll('.v14Primer .v14Visual').length, caption: [...document.querySelectorAll('.v14Primer .v14Visual .v14Cap i')].length, steps: [...document.querySelectorAll('.v14Steps > li > b')].map(b => b.textContent) }));
    check('B3', 'Practice MCQ: options locked behind the understanding primer', reached && pre.primer && pre.opts === 0 && pre.gate === 'I CAN PICTURE IT → ASK ME THE MCQ', pre);
    check('B4', 'Primer structure: SEE IT → UNDERSTAND IT → BUILD THE MOVIE → EXAM CONVERSION + one Egyptian command', pre.steps.length === 4 && /SEE IT/.test(pre.steps[0]) && /UNDERSTAND/.test(pre.steps[1]) && /MOVIE/.test(pre.steps[2]) && /EXAM/.test(pre.steps[3]) && !!pre.cmd, pre);
    check('B5', 'Primer shows ≥1 real visual with neutral (title-hidden) caption pre-answer', pre.vis >= 1 && pre.caption === 0, pre);
    const preQueries = log.commons.map(x => x.gsrsearch).filter(Boolean);
    const guard = await page.evaluate((id) => [...INTELLECTUALITY_V14.guard(id).A], q.id);
    const leakQ = preQueries.filter(x => guard.some(a => x.toLowerCase().includes(a)));
    check('B6', 'No pre-answer Commons query contains key-distinctive words', leakQ.length === 0, { guard, leakQ });
    await page.evaluate(() => { const i = document.querySelector('[data-v14-pred]'); if (i) i.value = 'my guess'; });
    await reveal(page);
    const shown = await page.evaluate((id) => { const q = EHSAN_QBANK.questions.find(x => x.id === id); const btns = [...document.querySelectorAll('[data-act="qbank-choice"]')]; return { stemOk: [...document.querySelectorAll('#player h3')].some(h => h.textContent.trim() === q.stem.trim()), optsOk: btns.length === q.options.length && btns.every((b, i) => b.dataset.choice === q.options[i].key && b.textContent.trim() === q.options[i].key.toUpperCase() + '. ' + q.options[i].text), conf: document.querySelectorAll('[data-conf]').length }; }, q.id);
    check('B7', 'Gate reveals the exact source stem/options/keys (byte-for-byte) with confidence capture', shown.stemOk && shown.optsOk && shown.conf === 3, shown);
    const ev0 = await page.evaluate(() => (S.v12?.evidence || []).length);
    await setConf(page, 'confident');
    await choose(page, q.keys[0]);
    await page.waitForTimeout(400);
    const c1 = await page.evaluate((id) => ({ sameQ: !!document.querySelector('[data-act="finish-qbank"]'), why: !!document.querySelector('.v14Why'), key: EHSAN_QBANK.questions.find(x => x.id === id).answerKeys, pinned: Object.values(S.v14.pins).includes(id), ev: (S.v12?.evidence || []).length, pred: document.querySelector('.v14YourPred')?.textContent || '' }), q.id);
    check('C1', 'Correct answer: same item stays with "why it makes sense" (no silent swap to a new question)', c1.sameQ && c1.why && c1.pinned, c1);
    check('C2', 'v12 evidence increments on a source answer', c1.ev === ev0 + 1, { before: ev0, after: c1.ev });
    check('C2b', 'Learner prediction is echoed after answering', /my guess/.test(c1.pred), c1.pred);
    await page.evaluate(() => document.querySelector('[data-act="finish-qbank"]')?.click());
    await page.waitForTimeout(400);
    const q2 = await currentQ(page);
    check('C3', 'NEXT completes the segment and moves to the other question slot (no loop)', q2 && q2.id !== q.id && q2.slot === 1, { q1: q.id, q2 });
    await page.waitForTimeout(300);
    await reveal(page);
    await setConf(page, 'guess');
    await choose(page, q2.keys[0]);
    await page.waitForTimeout(300);
    const g = await page.evaluate(() => ({ guess: !!document.querySelector('.v14Guess'), why: !!document.querySelector('.v14Why') }));
    check('C4', 'Guess-correct is treated as weak evidence (extra explanation)', g.guess && g.why, g);
    await page.waitForTimeout(400);
    const tw = await page.evaluate(() => ({ twinEv: S.v13?.twin?.totals?.evidence || 0, ledger: S.v14.ledger.length, mod: S.v14.stats.mod, cmd: S.v14.stats.cmd }));
    check('C5', 'v13 Learning Twin ingests the evidence; v14 ledger attributes visual/command/depth', tw.twinEv >= 2 && tw.ledger >= 2 && Object.keys(tw.cmd).length >= 1, tw);
    afterCorrect = await stateOf(page);
    fs.writeFileSync(path.join(OUT, 'errors_B.json'), JSON.stringify(log.errors));
    check('N0', 'No page errors during fresh + correct flow', log.errors.length === 0, log.errors.slice(0, 3));
    await s.close();
  }

  // ───────── D/E · wrong answer, autopsy, gate, retest, loop guard ─────────
  {
    const s = await open({ time: T('2026-09-22T11:00:00+03:00'), state: null, settle: 1200 });
    const { page, log } = s;
    await toQuestion(page);
    const q = await currentQ(page);
    await reveal(page);
    await setConf(page, 'confident');
    const wk = wrongKey(q);
    await choose(page, wk);
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => { const a = document.querySelector('.v14Autopsy'); return { kind: nextAction().kind, autopsy: !!a, choice: a?.dataset.v14Choice, head: a?.querySelector('.v14AutopsyHead b')?.textContent, diff: a?.querySelector('.v14Difference p')?.textContent || '', chosen: a?.querySelector('.v14CompareSide.wrong strong')?.textContent, cmd: a?.querySelector('.v14Command .v14Ar')?.textContent, repairDisabled: document.querySelector('[data-act="repair"]')?.disabled, genome: Object.keys(S.v12?.errorGenome || {}), topicBank: !!document.querySelector('.realVisualBank') }; });
    const qtext = await page.evaluate((a) => EHSAN_QBANK.questions.find(x => x.id === a.id).options.find(o => o.key === a.k).text, { id: q.id, k: wk });
    check('D1', 'Confident wrong → REPAIR with error genome "confident misconception"', r.kind === 'REPAIR' && r.genome.includes('confident misconception'), r);
    check('D2', 'Visual autopsy maps the selected option (data + text) and shows الفرق الفاصل + command', r.autopsy && r.choice === wk && r.chosen === qtext && r.head === 'ليه إجابتك غلط بصريًا؟' && r.diff.length > 40 && !!r.cmd, r);
    check('D3', 'Repair is gated behind a no-options reconstruction; topic wallpaper suppressed', r.repairDisabled === true && !r.topicBank, r);
    await page.waitForTimeout(1500);
    const hyd = await page.evaluate(() => ({ skeletons: document.querySelectorAll('.v14Autopsy .v14Skeleton').length, companions: document.querySelectorAll('#player .ctxCompanion').length, order: (() => { const a = document.querySelector('.v14Autopsy'), g = document.querySelector('.v14Recall'), b = document.querySelector('[data-act="repair"]'); return !!(a && g && b && (a.compareDocumentPosition(g) & 4) && (g.compareDocumentPosition(b) & 4)); })(), wrongSide: document.querySelector('.v14CompareSide.wrong .v14AutopsyVisual')?.innerText.slice(0, 120) }));
    check('D3b', 'Autopsy sides hydrate (visual or honest note), no wallpaper companions; autopsy → reconstruction → button order', hyd.skeletons === 0 && hyd.companions === 0 && hyd.order, hyd);
    await page.evaluate(() => document.querySelector('[data-act="repair"]')?.click());
    await page.waitForTimeout(250);
    const still = await page.evaluate(() => nextAction().kind);
    await page.fill('[data-v14-recon]', 'dura sheaths the roots');
    await page.waitForTimeout(150);
    const unlocked = await page.evaluate(() => !document.querySelector('[data-act="repair"]')?.disabled);
    check('D4', 'Blocked until reconstruction typed; typing unlocks', still === 'REPAIR' && unlocked, { still, unlocked });
    await page.evaluate(() => document.querySelector('[data-act="repair"]')?.click());
    await page.waitForTimeout(400);
    const rt = await page.evaluate(() => { const a = nextAction(); const b = document.querySelector('[data-act="retest-qbank"]'); return { kind: a.kind, qid: b?.dataset.qid, chip: document.querySelector('#player .chip.warn')?.textContent }; });
    const rtq = await page.evaluate((a) => { const q = EHSAN_QBANK.questions.find(x => x.id === a.r); const src = EHSAN_QBANK.questions.find(x => x.id === a.s); const PE = NEU205_PATTERN; return { split: q?.split, sameStem: q?.stem === src.stem, near: (PE.nearAvoid[src.id] || []).includes(q?.id), chapter: q?.chapter === src.chapter }; }, { r: rt.qid, s: q.id });
    await page.evaluate(() => render()); await page.waitForTimeout(200);
    const rt2 = await page.evaluate(() => document.querySelector('[data-act="retest-qbank"]')?.dataset.qid);
    check('D5', 'Changed source retest: practice split, different stem, not a near-duplicate, stable across renders', rt.kind === 'RETEST' && rt.qid && rt.qid !== q.id && rtq.split === 'practice' && !rtq.sameStem && !rtq.near && rt2 === rt.qid, { rt, rtq });
    // miss the retest → another repair with autopsy of the retest item, gate re-armed
    const rk = await page.evaluate((id) => { const q = EHSAN_QBANK.questions.find(x => x.id === id); return q.options.find(o => !q.answerKeys.includes(o.key)).key; }, rt.qid);
    await page.evaluate((k) => document.querySelector('[data-act="retest-qbank"][data-choice="' + k + '"]')?.click(), rk);
    await page.waitForTimeout(700);
    const r2 = await page.evaluate(() => ({ kind: nextAction().kind, autopsyQ: document.querySelector('.v14Autopsy')?.dataset.v14Autopsy, disabled: document.querySelector('[data-act="repair"]')?.disabled }));
    check('E1', 'Second miss → another targeted visual repair on the retest item; gate re-armed', r2.kind === 'REPAIR' && r2.autopsyQ === rt.qid && r2.disabled === true, r2);
    // loop guard: miss two more changed items → parked
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => { document.querySelector('[data-v14-aloud]')?.click(); });
      await page.waitForTimeout(120);
      await page.evaluate(() => document.querySelector('[data-act="repair"]')?.click());
      await page.waitForTimeout(350);
      const id = await page.evaluate(() => document.querySelector('[data-act="retest-qbank"]')?.dataset.qid || document.querySelector('[data-act="retest-mcq"]') && 'gen');
      if (id === 'gen') await page.evaluate(() => document.querySelector('[data-act="retest-mcq"][data-correct="0"]')?.click());
      else if (id) { const k = await page.evaluate((id) => { const q = EHSAN_QBANK.questions.find(x => x.id === id); return q.options.find(o => !q.answerKeys.includes(o.key)).key; }, id); await page.evaluate((k) => document.querySelector('[data-act="retest-qbank"][data-choice="' + k + '"]')?.click(), k); }
      await page.waitForTimeout(500);
    }
    const pk = await page.evaluate(() => ({ kind: nextAction().kind, parked: S.v14.parked.length, notice: document.querySelector('.v14Carryover.parked')?.innerText || '', unresolved: unresolved().length }));
    check('E2', 'Repair loop guard: after 3 changed misses the error is parked to spaced repair (no infinite loop)', pk.parked === 1 && pk.kind !== 'REPAIR' && pk.kind !== 'RETEST', pk);
    check('N1', 'No page errors during wrong/autopsy/retest flow', log.errors.length === 0, log.errors.slice(0, 3));
    await s.close();
  }

  // ───────── J · Mock firewall ─────────
  {
    const s = await open({ time: T('2026-09-22T12:00:00+03:00'), state: afterCorrect, settle: 1200 });
    const { page, log } = s;
    await page.evaluate(() => { buildMock(false); save(); render(); });
    await page.waitForTimeout(1200);
    const items = await page.evaluate(() => S.mock.items.map(q => ({ id: q.id, split: q.split })));
    const leaked = await page.evaluate((ids) => ids.filter(id => NEU205_PATTERN.leakedHeldout.includes(id)), items.map(x => x.id));
    const m = await page.evaluate(() => ({ primer: !!document.querySelector('#player .v14Primer'), cmd: !!document.querySelector('#player .v14Command'), comp: document.querySelectorAll('#player .ctxCompanion').length, vis: document.querySelectorAll('#player .v14Visual, #player .ctxImage img').length, conf: document.querySelectorAll('[data-mconf]').length, opts: document.querySelectorAll('[data-act="mock-qbank"]').length, banner: !!document.querySelector('#player .v14Carryover') }));
    const guardA = await page.evaluate((id) => [...INTELLECTUALITY_V14.guard(id).A], items[0].id);
    const mockQueries = log.commons.map(x => x.gsrsearch).filter(Boolean).filter(x => guardA.some(a => x.toLowerCase().includes(a)));
    check('J1', 'Held-out mock item: no primer, no cue, no companion/answer image, confidence kept', !m.primer && !m.cmd && m.comp === 0 && m.vis === 0 && m.conf === 3 && m.opts >= 2, m);
    check('J2', 'Mock uses held-out split only and excludes the 60 leak-audited items', items.every(x => x.split === 'heldout') && leaked.length === 0, { items: items.length, leaked });
    check('J3', 'No Commons query built from the held-out key', mockQueries.length === 0, mockQueries);
    // answer all: first wrong, rest correct
    for (let i = 0; i < items.length; i++) {
      const k = await page.evaluate((i) => { const q = S.mock.items[i]; return i === 0 ? q.options.find(o => !q.answerKeys.includes(o.key)).key : q.answerKeys[0]; }, i);
      await page.evaluate((k) => document.querySelector('[data-act="mock-qbank"][data-choice="' + k + '"]')?.click(), k);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(600);
    const res = await page.evaluate(() => ({ autopsies: document.querySelectorAll('.v14MockAutopsy').length, result: !!document.querySelector('[data-act="finish-mock"]') }));
    check('J4', 'Post-submission: visual autopsy for the consumed miss only', res.result && res.autopsies === 1, res);
    await page.evaluate(() => document.querySelector('[data-act="finish-mock"]')?.click());
    await page.waitForTimeout(400);
    const e = await page.evaluate(() => { const e = unresolved()[0]; return e && { src: e.sourceQuestionId, kind: nextAction().kind }; });
    await page.fill('[data-v14-recon]', 'held-out repair line').catch(() => {});
    await page.evaluate(() => document.querySelector('[data-act="repair"]')?.click());
    await page.waitForTimeout(400);
    const rq = await page.evaluate(() => { const id = document.querySelector('[data-act="retest-qbank"]')?.dataset.qid; const q = EHSAN_QBANK.questions.find(x => x.id === id); return { id, split: q?.split }; });
    check('J5', 'Mock miss repair retests on a practice item, never a future held-out item', e && rq.id && rq.split === 'practice', { e, rq });
    check('N2', 'No page errors during mock flow', log.errors.length === 0, log.errors.slice(0, 3));
    await s.close();
  }

  // ───────── F/G/H/I · command routing by reasoning operation ─────────
  {
    const s = await open({ time: T('2026-09-22T12:00:00+03:00'), state: null, settle: 1000 });
    const r = await s.page.evaluate(() => {
      const pick = (pred) => EHSAN_QBANK.questions.filter(q => q.split === 'practice' && pred(q)).slice(0, 6).map(q => ({ id: q.id, stem: q.stem.slice(0, 70), cmd: INTELLECTUALITY_V14.preCommand(q.id).ar, intent: INTELLECTUALITY_V14.classifyIntent(q, null) }));
      return {
        histo: pick(q => q.subject === 'HISTOLOGY' && !/except|false|incorrect|\bnot\b/i.test(q.stem)),
        tract: pick(q => /spinothalam|lemnisc|corticospinal|decussat/i.test(q.stem) && !/except|false|incorrect|\bnot\b/i.test(q.stem)),
        lesion: pick(q => /lesion|injury|damage|paralysis/i.test(q.stem) && !/arter|infarct|except|\bnot\b/i.test(q.stem)),
        phys: pick(q => q.subject === 'PHYSIOLOGY' && /mechanism|release|potential|channel/i.test(q.stem) && !/except|false|incorrect|\bnot\b|lesion|tract/i.test(q.stem)),
      };
    });
    const ok = (arr, set) => arr.length && arr.every(x => set.includes(x.cmd));
    check('F1', 'Histology items route to طلّع شبيهه برّه / فرّق النسيج', ok(r.histo, ['طلّع شبيهه برّه', 'فرّق النسيج', 'كوّن الصورة']), r.histo.map(x => x.cmd + ' · ' + x.stem));
    check('G1', 'Tract items route to امشي المسار', ok(r.tract, ['امشي المسار']), r.tract.map(x => x.cmd + ' · ' + x.stem));
    check('H1', 'Lesion items route to حدّد الإصابة', ok(r.lesion, ['حدّد الإصابة']), r.lesion.map(x => x.cmd + ' · ' + x.stem));
    check('I1', 'Physiology mechanism items route to شغّل الميكانيزم / perturb / receptor start', ok(r.phys, ['شغّل الميكانيزم', 'لو دا اتغيّر، الباقي يعمل إيه؟', 'مين بدأ؟']), r.phys.map(x => x.cmd + ' · ' + x.stem));
    await s.close();
  }

  // ───────── K/L · visual engine, performance, idempotency ─────────
  {
    const s = await open({ time: T('2026-09-22T12:00:00+03:00'), state: null, settle: 1200, commonsDelayMs: 120 });
    const { page, log } = s;
    let maxFlight = 0;
    await page.exposeFunction('__noop', () => 0);
    const audit = await page.evaluate(() => INTELLECTUALITY_V14.audit({ n: 60 }));
    fs.writeFileSync(path.join(OUT, 'visual_audit_mock.json'), JSON.stringify(audit, null, 1));
    check('K2', 'Visual-diversity engine (mocked Commons, 60 items): exact repeat <10%, adjacent 0', audit.metrics.exactRepeatPct < 10 && audit.metrics.adjacentRepeatPct === 0, audit.metrics);
    const inflight = log.maxInflight;
    check('L1', 'Network concurrency cap: ≤2 Commons requests in flight (all layers share one queue)', inflight >= 1 && inflight <= 2, { maxInFlight: inflight, requests: log.commons.length });
    const idem = await page.evaluate(() => { const r0 = render, a0 = act, w0 = wire; window.INTELLECTUALITY_V14_INIT(); return r0 === render && a0 === act && w0 === wire; });
    check('L2', 'Re-running INTELLECTUALITY_V14_INIT does not double-wrap', idem, idem);
    const size = await page.evaluate(() => ({ S: JSON.stringify(S).length, v14: JSON.stringify(S.v14).length }));
    check('L3', 'Cloud payload bounded (S < 1.5 MB API cap, v14 slice small)', size.S < 1500000 && size.v14 < 150000, size);
    check('N3', 'No page errors in engine/perf probes', log.errors.length === 0, log.errors.slice(0, 3));
    await s.close();
  }
  {
    // intervals: exactly one v14 minute tick, v13 tick unchanged
    const s = await open({ time: T('2026-09-22T12:00:00+03:00'), state: null, settle: 1200 });
    const n = await s.page.evaluate(() => performance.getEntriesByType('resource').filter(r => /commons/.test(r.name)).length);
    await s.close();
    check('L4', 'Cold load does not prefetch the question bank visuals (Commons requests on first screen ≤ 12)', n <= 12, { commonsOnLoad: n });
  }

  // ───────── M · responsive ─────────
  for (const vp of [{ w: 390, h: 844, n: 'iphone' }, { w: 820, h: 1180, n: 'ipad-portrait' }, { w: 1024, h: 1366, n: 'ipad-pro-portrait' }, { w: 1180, h: 820, n: 'ipad-landscape' }]) {
    const s = await open({ time: T('2026-09-22T10:00:00+03:00'), state: null, settle: 1200, viewport: { width: vp.w, height: vp.h }, touch: true });
    const { page } = s;
    const shots = {};
    const o1 = await noOverflow(page);
    await toQuestion(page); await page.waitForTimeout(700);
    const o2 = await noOverflow(page);
    await page.screenshot({ path: path.join(OUT, `resp_${vp.n}_primer.png`), fullPage: true });
    const tap = await page.evaluate(() => { const r = document.querySelector('[data-v14-reveal]')?.getBoundingClientRect(); return r ? r.height : 0; });
    await reveal(page); await setConf(page, 'confident');
    const q = await currentQ(page); await choose(page, wrongKey(q)); await page.waitForTimeout(800);
    const o3 = await noOverflow(page);
    await page.screenshot({ path: path.join(OUT, `resp_${vp.n}_autopsy.png`), fullPage: true });
    const ar = await page.evaluate(() => { const b = document.querySelector('.v14Autopsy .v14AutopsyHead b'); const r = b?.getBoundingClientRect(); return r ? r.width > 40 && r.right <= innerWidth + 1 : false; });
    check('M-' + vp.n, `Responsive ${vp.w}×${vp.h}: no horizontal overflow; gate ≥44px; Arabic readable`, o1.ok && o2.ok && o3.ok && tap >= 44 && ar, { o1, o2, o3, tap });
    await s.close();
  }

  // ───────── N · regression across layers ─────────
  {
    const s = await open({ time: T('2026-09-22T10:00:00+03:00'), state: null, settle: 1400 });
    const { page, log } = s;
    const r = await page.evaluate(() => ({ v9: !!document.querySelector('.realVisualBank'), v11: !!document.querySelector('#courseTopbar') && !!document.querySelector('#railToday'), v12: typeof INTELLECTUALITY_V12?.posterior === 'function', v13: !!S.v13?.twin, integrity: !/COURSE CONTENT INTEGRITY ERROR/.test(document.body.innerText), resume: document.querySelector('#continueBtn')?.textContent }));
    check('N4', 'v9 real visual bank, v11 shell, v12 brain, v13 twin, content integrity gate, Resume learning', r.v9 && r.v11 && r.v12 && r.v13 && r.integrity && r.resume === 'Resume learning', r);
    await page.evaluate(() => INTELLECTUALITY_V12.openBrain()); await page.waitForTimeout(300);
    const brain = await page.evaluate(() => /PERSONAL MASTERY BRAIN/.test(document.querySelector('#drawerBody')?.innerText || '') && /Learning Twin/.test(document.querySelector('#drawerBody')?.innerText || ''));
    check('N5', 'Autopilot brain drawer (v12 + v13 addon) still opens', brain, brain);
    // continuity waves: written + practical + commute (Tuesday drive block)
    const waves = await page.evaluate(() => { const find = t => C.days.find(d => d.continuityType === t); const keep = S.day; const out = {}; for (const t of ['WRITTEN_WAVE', 'PRACTICAL_WAVE', 'WEEKLY_MOCK', 'RETENTION_BRIDGE']) { const d = find(t); S.day = d.day; const h = t === 'WRITTEN_WAVE' ? writtenWaveView(d) : t === 'PRACTICAL_WAVE' ? practicalWaveView(d) : continuityView(d); out[t] = h.length > 200; } S.day = keep; S.commute = true; out.commute = /drivebox|DRIVING MODE|No scheduled driving/.test(commuteView()); S.commute = false; return out; });
    check('N6', 'Written wave, practical wave, weekly mock, retention bridge and commute views render', Object.values(waves).every(Boolean), waves);
    check('N7', 'No page errors on cold load + drawers', log.errors.length === 0, log.errors.slice(0, 3));
    await s.close();
  }
  {
    // legacy v53 state with the old v14 schema (answer-derived visualAssignments) migrates without reset
    const legacy = JSON.parse(JSON.stringify(partialDay1));
    legacy.v14 = { version: '14.0', primed: { 'EHSAN-ANAT-SPINAL-CORD-MCQ-20': true }, visualAssignments: { x: [{ title: 'File:Oligodendrocyte.png', thumb: 'u' }] }, visualUsed: { 'File:Spinal_Cord_Sectional_Anatomy.png': 9 }, visualRecent: ['File:Spinal_Cord_Sectional_Anatomy.png'], calendar: {}, stats: { primersSeen: 3 } };
    const s = await open({ time: T('2026-09-22T10:00:00+03:00'), state: legacy, settle: 1200 });
    const r = await s.page.evaluate(() => ({ schema: S.v14.schema, segs: Object.values(S.segments).filter(Boolean).length, va: 'visualAssignments' in S.v14, vc: Object.keys(S.v14.vc).length, legacy: S.v14.legacy, chip: document.querySelector('#v14Calendar')?.textContent }));
    check('L5', 'Legacy v53/v14 state migrates in place (evidence kept, answer-derived assignments dropped)', r.schema === 2 && r.segs === Object.values(partialDay1.segments).filter(Boolean).length && !r.va && r.vc >= 1 && r.legacy?.primersSeen === 3 && /CARRYOVER/.test(r.chip), r);
    check('N8', 'No page errors on legacy migration', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }
  {
    // Commons outage: text model still renders immediately, honest no-visual state
    const s = await open({ time: T('2026-09-22T10:00:00+03:00'), state: null, settle: 1000, commonsFail: true });
    await toQuestion(s.page); await s.page.waitForTimeout(900);
    const r = await s.page.evaluate(() => ({ primer: !!document.querySelector('.v14Primer'), model: (document.querySelector('.v14ModelLine')?.textContent || '').length, missing: !!document.querySelector('.v14Primer .v14VisualMissing'), gate: !!document.querySelector('[data-v14-reveal]') }));
    check('L6', 'Remote image host down: primer text + gate still work, honest no-visual state', r.primer && r.model > 30 && r.missing && r.gate, r);
    check('N9', 'No page errors when Commons is unreachable', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  const pass = results.filter(r => r.ok).length;
  const summary = { when: new Date().toISOString(), seconds: Math.round((Date.now() - t0) / 1000), pass, fail: results.length - pass, total: results.length, results };
  fs.writeFileSync(path.join(OUT, 'certification.json'), JSON.stringify(summary, null, 1));
  console.log(`\n${pass}/${results.length} checks passed (${summary.seconds}s)`);
  process.exit(summary.fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
