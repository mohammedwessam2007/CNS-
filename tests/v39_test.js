// v39 · the third version: what the CNS course did best, now in GIT, plus the owner's unused material.
// M1 Dr Medhat's abdomen MCQs are in the bank, keyed, in real chapters · M2 every answer can show the course line that teaches it
// M3 retest law: a miss brings a CHANGED question tomorrow, the exact one in 3 days · M4 two sealed mocks: never in practice
// until taken, scheduled before the MCQ exam, counted in readiness · M5 practical room: slides, department diagrams
// (captions only), calculations; misses become cards · M6 the plan has practical and diagram steps · M7 no errors, no sideways scroll
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-23T09:00:00+02:00', state: null, settle: 2000, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));

  const m1 = await p.evaluate(() => { const M = IX_GIT206.mcq.filter((q) => /Medhat/.test(q.source)); const chs = new Set(IX_PLAN.units().filter((u) => u.subject === 'Anatomy').map((u) => u.name)); return { n: M.length, keyed: M.every((q) => q.answerKeys.length === 1 && q.options.length >= 4 && q.options.every((o) => o.text)), chapters: M.every((q) => chs.has(q.chapter)), ids: new Set(M.map((q) => q.id)).size === M.length }; });
  check('M1', "Dr Medhat's MCQs: 50+ keyed questions in the anatomy chapters", m1.n >= 50 && m1.keyed && m1.chapters && m1.ids, m1);

  const m2 = await p.evaluate(() => { const M = IX_GIT206.mcq.filter((q) => q.answerKeys.length); const hits = M.map((q) => IX_TEACH.where(q)).filter(Boolean); const q = IX_GIT206.mcq.find((x) => /transpyloric plane passes through/i.test(x.stem)); const w = IX_TEACH.where(q); return { share: Math.round((100 * hits.length) / M.length), w: w && { key: w.key, s: w.sentence.slice(0, 80) } }; });
  check('M2', 'Most answers show the course line that teaches them (offline)', m2.share >= 60 && m2.w && /L1/.test(m2.w.s), m2);

  // answer one wrong inside the hub
  await p.evaluate(() => IX_GIT.open()); await tick(p, 300);
  await p.evaluate(() => document.querySelector('[data-run]').click()); await tick(p, 300);
  let m3 = null;
  for (let k = 0; k < 10 && !m3; k++) {
    const qid = await p.evaluate(() => document.querySelector('.ixHq').dataset.qid);
    const info = await p.evaluate((id) => { const q = IX_GIT206.mcq.find((x) => x.id === id); return { wrong: q.options.find((o) => !q.answerKeys.includes(o.key)).key, sib: !!IX_TEACH.sibling(q, IX_GIT.practicePool()), teach: !!IX_TEACH.where(q) }; }, qid);
    await p.click('.ixHopt[data-k="' + info.wrong + '"]'); await tick(p, 150);
    if (info.sib && info.teach) {
      m3 = await p.evaluate((id) => { const g = IX_GIT.state(), r = g.q[id]; return { twin: r.twin, retestDue: g.retest[r.twin] - Date.now(), exactDue: r.due - Date.now(), note: /changed question/.test(document.querySelector('.ixHfb').innerText), teach: !!document.querySelector('.ixHfb .ixTeach [data-teach]') }; }, qid);
    } else await p.click('[data-next]');
  }
  check('M3', 'A miss: a changed question on the same fact tomorrow, the exact one in 3 days; the course line is shown', m3 && m3.twin && m3.retestDue > 0 && m3.retestDue < 864e5 && m3.exactDue > 2.5 * 864e5 && m3.note && m3.teach, m3);
  await p.evaluate(() => IX_GIT.close());

  const m4 = await p.evaluate(() => { const a = IX_GIT.sealedQs('Sealed mock 1'), b = IX_GIT.sealedQs('Sealed mock 2'), pool = new Set(IX_GIT.practicePool().map((q) => q.id)); const days = IX_PLAN.build().days.filter((d) => d.steps.some((x) => x.kind === 'mock' && /^Sealed/.test(x.src || ''))).map((d) => d.date); return { a: a.length, b: b.length, leak: a.concat(b).filter((q) => pool.has(q.id)).length, days }; });
  // take sealed mock 1 quickly: the questions join practice, readiness counts it
  await p.evaluate(() => IX_GIT.mockPaper('Sealed mock 1')); await tick(p, 200);
  for (let k = 0; k < 60; k++) { const more = await p.evaluate(() => { const b = document.querySelector('.ixHq .ixHopt'); if (!b) return false; b.click(); return true; }); if (!more) break; await tick(p, 30); }
  const m4b = await p.evaluate(() => ({ mocked: IX_GIT.mocked('Sealed mock 1'), joined: IX_GIT.sealedQs('Sealed mock 1').every((q) => IX_GIT.practicePool().some((x) => x.id === q.id)), stillSealed: IX_GIT.sealedQs('Sealed mock 2').some((q) => IX_GIT.practicePool().some((x) => x.id === q.id)) }));
  await p.evaluate(() => IX_GIT.close());
  check('M4', 'Two sealed mocks of never-seen questions before 30 Dec; taking one releases only its questions', m4.a >= 20 && m4.b >= 20 && !m4.leak && m4.days.length === 2 && m4.days.every((d) => d < '2026-12-30') && m4b.mocked && m4b.joined && !m4b.stillSealed, { m4, m4b });

  await p.evaluate(() => IX_PRACT.open('slides')); await tick(p, 150);
  const right = await p.evaluate(() => { const feats = [...document.querySelectorAll('.ixPrfeat li')].map((l) => l.textContent); const i = IX_PRACT.SLIDES.findIndex((x) => x[1][0] === feats[0]); return String(i); });
  const wrongO = await p.evaluate((r) => [...document.querySelectorAll('[data-o]')].find((b) => b.dataset.o !== r).dataset.o, right);
  await p.click('[data-o="' + wrongO + '"]');
  await p.evaluate(() => IX_PRACT.open('diagrams')); await p.click('[data-show]'); await p.check('[data-l="0"]'); await p.click('[data-score]');
  await p.evaluate(() => IX_PRACT.open('calc')); const ans = await p.evaluate(() => { const h = document.querySelector('.ixPrbody h3').textContent; return IX_PRACT.CALC.find((c) => c[0] === h)[1]; });
  await p.fill('[data-a]', String(ans)); await p.click('[data-c]');
  const m5 = await p.evaluate(() => { const C = Object.keys(JSON.parse(localStorage.getItem('ix_fc_custom_v1') || '{}')).filter((k) => /^pract#/.test(k)); return { slides: IX_PRACT.SLIDES.length, dia: IX_PRACT.DIAGRAMS.length, calc: IX_PRACT.CALC.length, cards: C.length, calcOk: /✓ Right/.test(document.querySelector('.ixPrfb').innerText), noImg: !document.querySelector('.ixPr img'), inKit: IX_KIT.cards().filter((c) => /^pract#/.test(c.id)).length }; });
  check('M5', 'Practical room: slides, 27 department diagrams by caption (no pictures), calculations; misses become cards', m5.slides >= 20 && m5.dia >= 25 && m5.calc >= 10 && m5.cards >= 5 && m5.calcOk && m5.noImg && m5.inKit === m5.cards, m5);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  await p.evaluate(() => IX_PRACT.close());

  const m6 = await p.evaluate(() => { const D = IX_PLAN.build().days; return { pract: D.filter((d) => d.steps.some((x) => x.kind === 'practical')).map((d) => d.date), dia: D.filter((d) => d.steps.some((x) => x.kind === 'pdiagram')).length, tile: !!document.querySelector('[data-pract]') }; });
  check('M6', 'Practicals are in February (owner, 22 Nov): no practical days now; department diagrams on the physiology and written days; the home has the tile', !m6.pract.length && m6.dia >= 3 && m6.tile, m6);
  check('M7', 'No sideways scroll and no page errors', !wide && !errs.length, { wide, errs: errs.slice(0, 3) });
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
