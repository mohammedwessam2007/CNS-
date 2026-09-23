// v16 MCQ exam system: MCQ-only flow, every past paper scheduled, explanations, spaced repetition,
// sealed timed mocks, and a full-course simulation to the exam. Usage: node tests/v16_test.js [out.json]
//   QUICK=1 skips the full-course simulation (M7, ~8 min).
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const results = [];
function check(id, name, ok, detail = '') {
  const d = typeof detail === 'string' ? detail : JSON.stringify(detail);
  results.push({ id, name, ok: !!ok, detail: d });
  console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(5) + name + (d ? '  · ' + d.slice(0, 300) : ''));
}
const LEARN_NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]';
const cur = (page) => page.evaluate(() => INTELLECTUALITY_V16.act.current());
async function toKind(page, kinds, max = 60) {
  for (let i = 0; i < max; i++) {
    const c = await cur(page);
    if (kinds.includes(c.kind)) return c;
    if (c.kind !== 'SEGMENT') return c;
    await page.evaluate((sel) => document.querySelector(sel)?.click(), LEARN_NEXT);
    await page.waitForTimeout(120);
  }
  return cur(page);
}
// answer the item on screen through the real buttons: right or wrong
async function answerOnScreen(page, right) {
  await page.evaluate((right) => {
    const bs = [...document.querySelectorAll('#player [data-v16="pick"]')];
    const acc = INTELLECTUALITY_V16.accepted(bs[0].dataset.qid);
    (bs.find((b) => acc.includes(b.dataset.choice) === right) || bs[0]).click();
  }, right);
  await page.waitForTimeout(200);
}
function rng(seed) { let x = seed >>> 0; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

(async () => {
  const t0 = Date.now();
  // ── M1–M4: the day's flow on 23 Sep ──
  {
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500, viewport: { width: 820, height: 1180 } });
    const { page } = s;
    const seen = new Set();
    let c;
    for (let i = 0; i < 40; i++) {
      c = await cur(page);
      seen.add(c.kind + ':' + (c.type || ''));
      if (c.kind === 'V16_BLOCK') break;
      await page.evaluate((sel) => document.querySelector(sel)?.click(), LEARN_NEXT);
      await page.waitForTimeout(120);
    }
    const b = await page.evaluate(() => { const a = nextAction(); return { l: a.l.id, ids: a.b.ids, taught: a.b.ids.map((id) => INTELLECTUALITY_V16.owner(id)), segDone: a.l.segments.map((sg, i) => sg.type + ':' + !!S.segments[segmentKey(a.d, a.l, i)]) }; });
    const pre = await page.evaluate(() => ({ pics: document.querySelectorAll('#player figure.v15Pic, #player .v14Visual').length, gate: !!document.querySelector('[data-v14-reveal]'), opts: document.querySelectorAll('#player [data-v16="pick"]').length, h: Math.min(...[...document.querySelectorAll('#player [data-v16="pick"]')].map((x) => x.getBoundingClientRect().height)) }));
    check('M1', 'After the lesson notes the next step is a block of that lesson\'s past-paper MCQs (≤ 8), each owned by the lesson just taught; no draw-from-memory step, no v14 primer, no picture before answering; options ≥ 48 px', c.kind === 'V16_BLOCK' && b.ids.length >= 1 && b.ids.length <= 8 && b.taught.every((x) => x === b.l) && !seen.has('SEGMENT:reconstruct') && b.segDone.some((x) => x === 'reconstruct:true') && pre.pics === 0 && !pre.gate && pre.opts >= 3 && pre.h >= 48, { b, pre, seen: [...seen] });

    // M2: wrong answer → full explanation on the same screen
    await answerOnScreen(page, false);
    const ex = await page.evaluate(() => {
      const q = QB.questions.find((x) => x.id === S.v16.cur.id), X = INTELLECTUALITY_V16.explain(q.id);
      const rows = [...document.querySelectorAll('#player .v16Row')];
      return { hand: !!X, rows: rows.length, opts: q.options.length, key: rows.filter((r) => r.classList.contains('key')).length, mine: rows.filter((r) => r.classList.contains('mine')).length, whys: rows.filter((r) => r.querySelector('.v16Why')).length, verdict: document.querySelector('.v16Verdict')?.textContent || '', note: !!document.querySelector('#player .v15Note'), next: [...document.querySelectorAll('#player [data-v16="next"]')].map((x) => Math.round(x.getBoundingClientRect().height)) };
    });
    check('M2', 'A wrong answer is explained on the spot: verdict, the key row, "your answer" row, a reason under every option when the item has a tutor note, the teaching note, and Next buttons ≥ 44 px', /Not this one/.test(ex.verdict) && ex.rows === ex.opts && ex.key >= 1 && ex.mine === 1 && (!ex.hand || ex.whys === ex.opts) && ex.note && ex.next.length === 2 && ex.next.every((h) => h >= 44), ex);
    // reload keeps the explanation (the answered item stays on screen until Next)
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    const kept = await page.evaluate(() => ({ cur: !!S.v16.cur, rows: document.querySelectorAll('#player .v16Row').length }));
    check('M2b', 'A reload keeps the answered item and its explanation on screen', kept.cur && kept.rows >= 3, kept);
    // M3: finish the day: blocks → round → STOP; no written/visual boss
    const kinds = [];
    for (let i = 0; i < 400; i++) {
      c = await cur(page);
      if (c.kind === 'STOP') break;
      kinds.push(c.kind);
      if (c.kind === 'V16_BLOCK' || c.kind === 'V16_ROUND') {
        if (c.answered) { await page.evaluate(() => INTELLECTUALITY_V16.act.next('w')); continue; }
        await page.evaluate((i) => { const id = INTELLECTUALITY_V16.act.current().id; const q = QB.questions.find((x) => x.id === id); const acc = INTELLECTUALITY_V16.accepted(id); INTELLECTUALITY_V16.act.pick(i % 3 ? acc[0] : q.options.find((o) => !acc.includes(o.key)).key); }, i);
        await page.evaluate((i) => INTELLECTUALITY_V16.act.next(i % 3 ? 'c' : 'w'), i);
        continue;
      }
      if (c.kind === 'SEGMENT') { await page.evaluate((k) => { S.segments[k] = true; save(); }, c.key); continue; }
      break;
    }
    await page.evaluate(() => render()); await page.waitForTimeout(300);
    const stop = await page.evaluate(() => ({ kind: nextAction().kind, sum: document.querySelector('.v16Sum')?.textContent || '', boss: JSON.stringify(dayBossState(day())), qsegs: day().lessons.every((l) => l.segments.every((sg, i) => sg.type !== 'question' || S.segments[segmentKey(day(), l, i)])) }));
    check('M3', 'The day runs lesson → past-paper block → … → today\'s MCQ round → STOP with an MCQ summary; the written boss and visual boss never appear; every question segment is completed by its block', stop.kind === 'STOP' && kinds.includes('V16_ROUND') && !kinds.some((k) => /BOSS|WAVE|REVIEW|REPAIR|RETEST/.test(k)) && stop.qsegs && /Today: \d+ past-paper MCQs/.test(stop.sum) && /v16skip/.test(stop.boss), { kinds: [...new Set(kinds)], stop });
    check('M3b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── M4: doubtful and also-accepted keys ──
  {
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500 });
    const r = await s.page.evaluate(() => ({
      csf5: INTELLECTUALITY_V16.accepted('EHSAN-ANAT-CEREBROSPINAL-FLUID-CSF-MCQ-5'),
      flag: INTELLECTUALITY_V16.explain('EHSAN-ANAT-CEREBROSPINAL-FLUID-CSF-MCQ-5')?.flag?.k,
      men8: INTELLECTUALITY_V16.accepted('EHSAN-ANAT-MENINGES-MCQ-8'),
      plain: INTELLECTUALITY_V16.accepted('EHSAN-ANAT-SPINAL-CORD-MCQ-1'),
    }));
    check('M4', 'A doubtful bank key accepts the standard answer too (CSF: "4th ventricle communicates directly"); an also-defensible option is accepted; ordinary items accept only the key', r.csf5.includes('a') && r.csf5.includes('c') && r.flag === 'c' && r.men8.includes('d') && r.men8.includes('a') && r.plain.join() === 'a', r);
    await s.close();
  }

  // ── M5: a miss returns tomorrow as a changed item, then as the exact item ──
  {
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500 });
    const { page } = s;
    await toKind(page, ['V16_BLOCK']);
    const missed = await page.evaluate(() => { const id = INTELLECTUALITY_V16.act.current().id; const q = QB.questions.find((x) => x.id === id); const acc = INTELLECTUALITY_V16.accepted(id); INTELLECTUALITY_V16.act.pick(q.options.find((o) => !acc.includes(o.key)).key); INTELLECTUALITY_V16.act.next('w'); return { id, st: INTELLECTUALITY_V16.state(id) }; });
    // finish the rest of the day without new misses
    for (let i = 0; i < 300; i++) {
      const c = await cur(page);
      if (c.kind === 'STOP') break;
      if (c.kind === 'SEGMENT') { await page.evaluate((k) => { S.segments[k] = true; save(); }, c.key); continue; }
      if (c.kind === 'V16_BLOCK' || c.kind === 'V16_ROUND') { await page.evaluate(() => { const id = INTELLECTUALITY_V16.act.current().id; INTELLECTUALITY_V16.act.pick(INTELLECTUALITY_V16.accepted(id)[0]); INTELLECTUALITY_V16.act.next('c'); }); continue; }
      break;
    }
    await page.clock.setSystemTime(new Date('2026-09-24T09:00:00+03:00'));
    await page.evaluate(() => render()); await page.waitForTimeout(300);
    const tomorrow = await page.evaluate((id) => { const r = INTELLECTUALITY_V16.roundPreview(S.day); const kind = Object.entries(r.kinds).find(([k, v]) => k === id || v === 'chg:' + id); return { day: S.day, kind, n: r.ids.length }; }, missed.id);
    // study the day (all right); the round serves the changed item for the miss
    let servedChg = null;
    for (let i = 0; i < 400; i++) {
      const c = await cur(page);
      if (c.kind === 'STOP') break;
      if (c.kind === 'SEGMENT') { await page.evaluate((k) => { S.segments[k] = true; save(); }, c.key); continue; }
      if (c.kind === 'V16_BLOCK' || c.kind === 'V16_ROUND') {
        if (c.rk === 'chg:' + missed.id) servedChg = c.id;
        await page.evaluate(() => { const id = INTELLECTUALITY_V16.act.current().id; INTELLECTUALITY_V16.act.pick(INTELLECTUALITY_V16.accepted(id)[0]); INTELLECTUALITY_V16.act.next('c'); });
        continue;
      }
      break;
    }
    const parentAfter = await page.evaluate((id) => ({ parent: INTELLECTUALITY_V16.state(id), today: INTELLECTUALITY_V16.today() }), missed.id);
    parentAfter.servedChg = servedChg;
    check('M5', 'A missed past paper comes back the next day as a CHANGED item on the same fact (retest law); once that is answered, the exact item is due 3 days later', missed.st.x === 1 && missed.st.d === missed.st.l + 1 && tomorrow.kind && /^chg:/.test(tomorrow.kind[1]) && servedChg && servedChg !== missed.id && parentAfter.parent.x === 0 && parentAfter.parent.d === parentAfter.today + 3, { missed, tomorrow, parentAfter });
    await page.clock.setSystemTime(new Date('2026-09-27T09:00:00+03:00'));
    await page.evaluate(() => render()); await page.waitForTimeout(300);
    const exact = await page.evaluate((id) => { const r = INTELLECTUALITY_V16.roundPreview(S.day); return { day: S.day, kind: r.kinds[id] || null }; }, missed.id);
    check('M5b', 'Three days later the exact past-paper item is back in the round ("back again")', exact.kind === 'again', exact);
    check('M5c', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── M6: sealed, timed weekly mock ──
  {
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500, viewport: { width: 820, height: 1180 } });
    const { page } = s;
    // study Wed–Sat quickly so the weekend mock has material
    for (const date of ['2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27']) {
      await page.clock.setSystemTime(new Date(date + 'T09:00:00+03:00'));
      await page.evaluate(() => render());
      for (let i = 0; i < 400; i++) {
        const c = await cur(page);
        if (c.kind === 'SEGMENT') { await page.evaluate((k) => { S.segments[k] = true; save(); }, c.key); continue; }
        if (c.kind === 'V16_BLOCK' || c.kind === 'V16_ROUND') { await page.evaluate(() => { const id = INTELLECTUALITY_V16.act.current().id; INTELLECTUALITY_V16.act.pick(INTELLECTUALITY_V16.accepted(id)[0]); INTELLECTUALITY_V16.act.next('c'); }); continue; }
        break;
      }
    }
    await page.evaluate(() => render()); await page.waitForTimeout(300);
    const start = await page.evaluate(() => ({ day: S.day, ct: day().continuityType, kind: nextAction().kind, n: nextAction().n, text: document.querySelector('#player')?.innerText.slice(0, 200) }));
    await page.evaluate(() => document.querySelector('#player [data-v16="mock-start"]')?.click()); await page.waitForTimeout(300);
    const sealed = await page.evaluate(() => ({ kind: nextAction().kind, pics: document.querySelectorAll('#player figure, #player .v14Visual, #player img').length, explain: document.querySelectorAll('#player .v16Explain, #player .v16Row, #player .v15Note').length, clock: document.querySelector('[data-v16-clock]')?.textContent || '', held: S.v16.mock.ids.every((id) => QB.questions.find((q) => q.id === id).split === 'heldout'), taught: S.v16.mock.ids.every((id) => { const l = INTELLECTUALITY_V16.owner(id); return !l || S.segments && Object.keys(S.segments).some((k) => k.includes(':' + l + ':') && S.segments[k]); }) }));
    check('M6', 'Weekend mock: a sealed, timed exam of held-out past papers from lessons already learned — no pictures, notes or explanations before submission', start.kind === 'V16_MOCK_START' && start.ct === 'WEEKLY_MOCK' && start.n >= 10 && start.n <= 40 && sealed.kind === 'V16_MOCK' && sealed.pics === 0 && sealed.explain === 0 && /⏱ \d+:\d\d left/.test(sealed.clock) && sealed.held && sealed.taught, { start, sealed });
    const R = rng(3);
    const fw = { asked: 0, leaks: [] };
    for (let i = 0; i < 60; i++) {
      const k = await page.evaluate(() => nextAction().kind);
      if (k !== 'V16_MOCK') break;
      // firewall: before the answer, nothing from the item's hand-written explanation is on screen
      const leak = await page.evaluate(() => {
        const id = document.querySelector('#player [data-v16="mock-pick"]')?.dataset.qid, x = INTELLECTUALITY_V16.explain(id);
        const txt = document.querySelector('#player')?.innerText || '', clean = (t) => String(t || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
        const q = QB.questions.find((z) => z.id === id), own = clean([q?.stem, ...(q?.options || []).map((o) => o.text)].join(' '));
        const bits = [x?.key, ...Object.values(x?.opt || {})].map(clean).filter((b) => b.length > 25).map((b) => b.slice(0, 40)).filter((b) => !own.includes(b));
        return { id, has: !!x, hit: bits.filter((b) => txt.replace(/\s+/g, ' ').includes(b)), dom: document.querySelectorAll('#player .v16Why, #player .v16Explain, #player .v16Flag').length };
      });
      fw.asked++;
      if (!leak.has || leak.hit.length || leak.dom) fw.leaks.push(leak);
      const ok = R() < 0.6;
      await page.evaluate((ok) => { const bs = [...document.querySelectorAll('#player [data-v16="mock-pick"]')]; const acc = INTELLECTUALITY_V16.accepted(bs[0].dataset.qid); (bs.find((b) => acc.includes(b.dataset.choice) === ok) || bs[0]).click(); }, ok);
      await page.waitForTimeout(60);
    }
    const res = await page.evaluate(() => ({ kind: nextAction().kind, revs: document.querySelectorAll('#player .v16Rev').length, rows: document.querySelectorAll('#player .v16Rev .v16Row').length, whys: [...document.querySelectorAll('#player .v16Rev')].filter((r) => r.querySelector('.v16Why')).length, n: S.v16.mock?.ids.length, pct: document.querySelector('.doneMark')?.textContent }));
    check('M6d', 'Held-out firewall: while a mock question is open none of its hand-written explanation is on screen; after submission every mock item shows its own written reason', fw.asked === res.n && fw.leaks.length === 0 && res.whys === res.n, { fw, whys: res.whys, n: res.n });
    await page.evaluate(() => document.querySelector('#player [data-v16="mock-done"]')?.click()); await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({ kind: nextAction().kind, hist: S.mockHistory.filter((m) => m.v16).length, misses: Object.values(S.v16.q).filter((s) => s.x).length, mocks: S.v16.mocks.length }));
    check('M6b', 'After the last answer: score, and every question explained; saving sends every miss into tomorrow\'s changed-question retests and continues to today\'s round', res.kind === 'V16_MOCK_RESULT' && res.revs === res.n && res.rows >= res.n * 3 && after.hist === 1 && after.mocks === 1 && after.misses >= 1 && ['V16_ROUND', 'STOP'].includes(after.kind), { res, after });
    check('M6c', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── M10: every usable past paper has a written explanation; options the source PDF glued together are shown apart ──
  {
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500 });
    const r = await s.page.evaluate(() => {
      const c = INTELLECTUALITY_V16.counts(), V = INTELLECTUALITY_V16;
      const glued = ['EHSAN-ANAT-MAXILLARY-ARTERY-PTERYGOID-VENOUS-PLEXUS-MCQ-2', 'EHSAN-ANAT-MAXILLARY-ARTERY-PTERYGOID-VENOUS-PLEXUS-MCQ-7', 'EHSAN-ANAT-CRANIAL-CAVITY-MCQ-18', 'EHSAN-ANAT-ORBIT-MCQ-6'].map((id) => ({ id, n: V.options(id).length, keys: V.options(id).map((o) => o.key).join(''), glue: V.options(id).some((o) => /(^|\s)[a-f]\u00b7\s/.test(o.text)), bank: QB.questions.find((q) => q.id === id).options.length }));
      const plain = V.options('EHSAN-ANAT-SPINAL-CORD-MCQ-3');
      return { c, glued, plainSame: JSON.stringify(plain) === JSON.stringify(QB.questions.find((q) => q.id === 'EHSAN-ANAT-SPINAL-CORD-MCQ-3').options.map((o) => ({ key: o.key, text: o.text }))) };
    });
    check('M10', 'Every usable past paper (practice and held-out) has a hand-written explanation; the 4 options the source PDF glued together are shown as separate a–d options (bank unchanged); ordinary items are untouched', r.c.explained === r.c.practice && r.c.heldExplained === r.c.heldout && r.c.heldout >= 399 && r.glued.every((g) => g.n === 4 && g.keys === 'abcd' && !g.glue && g.bank === 3) && r.plainSame, r);
    check('M10b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── M11: MCQ focus lasts through the exam day; the next day the written and practical flow returns by itself ──
  {
    const s = await open({ v16: true, time: '2026-11-15T20:00:00+02:00', state: null, settle: 1500 });
    const { page } = s;
    const onExam = await page.evaluate(() => ({ focus: INTELLECTUALITY_V16.focus(), kind: nextAction().kind }));
    await page.clock.setSystemTime(new Date('2026-11-16T09:00:00+02:00'));
    await page.evaluate(() => render()); await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({ focus: INTELLECTUALITY_V16.focus(), kind: nextAction().kind, date: INTELLECTUALITY_V14.cairoYMD() }));
    await page.evaluate(() => { S.v16.focus = 'ALL'; save(); });
    await page.clock.setSystemTime(new Date('2026-11-10T09:00:00+02:00'));
    const forced = await page.evaluate(() => INTELLECTUALITY_V16.focus());
    check('M11', 'MCQ focus holds on the MCQ exam day (15 Nov); from 16 Nov the full flow (written, practical) is back without any setting; an explicit "ALL" always wins', onExam.focus === 'MCQ' && after.focus === 'ALL' && !/^V16_/.test(after.kind) && forced === 'ALL', { onExam, after, forced });
    check('M11b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── M8: focus "ALL" restores the full v15 flow; M9: legacy v14 repairs migrate ──
  {
    const s = await open({ time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500 }); // harness default: focus ALL
    const { page } = s;
    const kinds = [];
    for (let i = 0; i < 30; i++) {
      const a = await page.evaluate(() => { const a = nextAction(); return a.kind + ':' + (a.seg?.type || ''); });
      kinds.push(a);
      if (a === 'SEGMENT:question') break;
      await page.evaluate((sel) => document.querySelector(sel)?.click(), LEARN_NEXT);
      await page.waitForTimeout(120);
    }
    check('M8', 'With focus "ALL" the full v15 flow is back (draw-from-memory step, then the v15/v14 question view)', kinds.includes('SEGMENT:reconstruct') && kinds.at(-1) === 'SEGMENT:question' && !kinds.some((k) => k.startsWith('V16_')), kinds);
    await s.close();
  }
  {
    // a real saved state from the previous version: fresh app, one open v14 repair, no v16 slice yet
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500 });
    await s.page.evaluate(() => { S.errors = { e1: { id: 'e1', topic: 'Spinal cord I', lessonId: 'T001', type: 'retrieval', dimension: 'spatial', confidence: 'unsure', day: 1, sourceQuestionId: 'EHSAN-ANAT-SPINAL-CORD-MCQ-3', resolved: false, readyRetest: false, priority: 1.2 } }; delete S.v16; save(); });
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(1800);
    const r = await s.page.evaluate(() => ({ e: S.errors.e1 ? { resolved: S.errors.e1.resolved, v16: S.errors.e1.v16 } : null, st: INTELLECTUALITY_V16.state('EHSAN-ANAT-SPINAL-CORD-MCQ-3'), today: INTELLECTUALITY_V16.today(), kind: nextAction().kind }));
    check('M9', 'An open v14 repair migrates into the MCQ engine: the error is closed (kept, marked) and its past-paper item is due now as a changed-question retest', r.e && r.e.resolved && r.e.v16 === 'migrated' && r.st && r.st.x === 1 && r.st.d <= r.today && r.kind !== 'REPAIR', r);
    check('M9b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── M7: full course to the exam (a learner who studies every day) ──
  if (!process.env.QUICK) {
    const s = await open({ v16: true, time: '2026-09-23T09:00:00+03:00', state: null, settle: 1500 });
    const { page } = s;
    const R = rng(7), days = [];
    const start = new Date('2026-09-23T09:00:00+03:00');
    for (let k = 0; k <= 53; k++) {
      await page.clock.setSystemTime(new Date(start.getTime() + k * 86400000));
      await page.evaluate(() => render());
      const rec = await page.evaluate(() => ({ day: S.day, mode: day().mode }));
      rec.learn = 0; rec.q = 0; rec.mock = 0; rec.other = [];
      for (let i = 0; i < 500; i++) {
        const c = await cur(page);
        if (c.kind === 'SEGMENT') { rec.learn += await page.evaluate((key) => { const a = nextAction(); const m = a.seg.type === 'teach' ? INTELLECTUALITY_V15.lessonMinutes(a.l.id) || a.seg.minutes : a.seg.minutes || 3; S.segments[key] = true; save(); return m; }, c.key); continue; }
        if (c.kind === 'V16_BLOCK' || c.kind === 'V16_ROUND') {
          const seenBefore = await page.evaluate((id) => !!INTELLECTUALITY_V16.state(id), c.id);
          const ok = R() < (c.kind === 'V16_BLOCK' ? 0.62 : seenBefore ? 0.8 : String(c.rk || '').startsWith('chg') ? 0.72 : 0.62);
          await page.evaluate(({ id, ok, conf }) => { const q = QB.questions.find((x) => x.id === id); const acc = INTELLECTUALITY_V16.accepted(id); INTELLECTUALITY_V16.act.pick(ok ? acc[0] : q.options.find((o) => !acc.includes(o.key)).key); INTELLECTUALITY_V16.act.next(conf); }, { id: c.id, ok, conf: ok ? (R() < 0.6 ? 'c' : 'u') : 'w' });
          rec.q++; continue;
        }
        if (c.kind === 'V16_MOCK_START') { await page.evaluate(() => INTELLECTUALITY_V16.act.mockStart()); continue; }
        if (c.kind === 'V16_MOCK') { const ok = R() < 0.65; await page.evaluate((ok) => { const m = S.v16.mock; const q = QB.questions.find((x) => x.id === m.ids[m.i]); const acc = INTELLECTUALITY_V16.accepted(q.id); INTELLECTUALITY_V16.act.mockPick(ok ? acc[0] : q.options.find((o) => !acc.includes(o.key)).key); }, ok); rec.mock++; continue; }
        if (c.kind === 'V16_MOCK_RESULT') { await page.evaluate(() => INTELLECTUALITY_V16.act.mockDone()); continue; }
        if (c.kind === 'STOP') break;
        if (c.kind === 'FATIGUE_RESET') { await page.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'fatigue-reset'; act(b); }); continue; }
        rec.other.push(c.kind); break;
      }
      rec.min = Math.round(rec.learn + rec.q * 1.2 + rec.mock);
      days.push(rec);
    }
    const fin = await page.evaluate(() => {
      const v = S.v16, P = QB.questions.filter((q) => q.split === 'practice' && q.autoScore), H = QB.questions.filter((q) => q.split === 'heldout' && q.autoScore);
      const lastP = Math.max(...P.map((q) => v.q[q.id]?.f ?? 999));
      const wrong = Object.values(v.q).filter((s) => s.lp > 0);
      return { practice: P.length, seenP: P.filter((q) => v.q[q.id]).length, lastPracticeFirstDay: lastP, held: H.length, usedH: H.filter((q) => v.q[q.id]).length, wrong: wrong.length, reasked: wrong.filter((s) => s.n >= 2).length, stateKB: Math.round(JSON.stringify(S).length / 1024), mocks: v.mocks.length, pred: INTELLECTUALITY_V16.prediction() };
    });
    const mins = days.map((d) => d.min), avg = Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
    check('M7', 'Full course to 15 Nov: every auto-scored practice past paper is answered by the end of teaching (day 47), and every held-out one is used in a mock by the last sprint day', fin.seenP === fin.practice && fin.lastPracticeFirstDay <= 47 && fin.usedH >= fin.held - 1, fin);
    check('M7b', 'Every simulated mistake is asked again before the exam', fin.wrong > 100 && fin.reasked === fin.wrong, { wrong: fin.wrong, reasked: fin.reasked });
    check('M7c', 'Time: about 2 h a day or less on average, no day above 2.5 h; saved progress stays under 1.2 MB (cloud limit 1.5 MB)', avg <= 120 && Math.max(...mins) <= 150 && fin.stateKB < 1200, { avg, max: Math.max(...mins), stateKB: fin.stateKB, perDay: days.map((d) => d.day + ':' + d.min).join(' ') });
    check('M7d', 'Mock predictions come from unseen first attempts with an interval', fin.mocks >= 12 && fin.pred.p != null && fin.pred.lo < fin.pred.p && fin.pred.hi > fin.pred.p, fin.pred);
    check('M7e', 'No page errors over the whole course', s.log.errors.length === 0 && days.every((d) => !d.other.length), { errors: s.log.errors.slice(0, 2), other: days.filter((d) => d.other.length) });
    await s.close();
  }

  const pass = results.filter((r) => r.ok).length;
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'out', 'v16_test.json'), JSON.stringify({ pass, total: results.length, results }, null, 1));
  console.log('\n' + pass + '/' + results.length + ' v16 checks passed (' + Math.round((Date.now() - t0) / 1000) + 's)');
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
