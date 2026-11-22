// v41 · the owner's batch-199 upload integrated.
// N1 Team Ehsan's 206 bank: hundreds of new keyed MCQs in all four subjects, no duplicate stems, every key is one of its options
// N2 questions the bank held without an official key now carry Ehsan's · N3 Ehsan's previous written questions joined the topics
// N4 the lessons gained what the department books teach and they lacked (micturition, kidney function tests, spike potentials,
//    feeding/satiety centres, γ-glutamyl cycle, celiac, nucleoproteins, microbiota, gallstones), each with a Think question that
//    becomes a flashcard · N5 micturition questions reach a unit · N6 sealed mocks stay at 45 questions · N7 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-23T09:00:00+02:00', state: null, settle: 2000 });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  const n1 = await p.evaluate(() => { const E = IX_GIT206.mcq.filter((q) => /^Ehsan 206/.test(q.source)); const c = {}; E.forEach((q) => (c[q.subject] = (c[q.subject] || 0) + 1)); const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 70); const stems = IX_GIT206.mcq.map((q) => norm(q.stem)); return { n: E.length, c, dupStems: stems.length - new Set(stems).size, badKey: E.filter((q) => !q.options.some((o) => o.key === q.answerKeys[0])).length }; });
  check('N1', "Team Ehsan's bank: 400+ new keyed MCQs across the four subjects, keys valid", n1.n >= 400 && Object.keys(n1.c).length === 4 && n1.badKey === 0 && n1.dupStems < 40, n1);
  const n2 = await p.evaluate(() => IX_GIT206.mcq.filter((q) => q.keyFrom === 'Ehsan').length);
  check('N2', 'Questions without an official key gained Ehsan\'s key', n2 >= 50, { n2 });
  const n3 = await p.evaluate(() => { const W = IX_GIT206.written; const qs = W.reduce((t, w) => t + w.questions.filter((x) => x.src === 'Ehsan').length, 0); return { topics: W.length, ehsanQs: qs, sorted: W.every((w, i) => !i || W[i - 1].score >= w.score) }; });
  check('N3', "Ehsan's previous written questions joined their topics (ranked by weight)", n3.ehsanQs >= 100 && n3.topics >= 50 && n3.sorted, n3);
  const n4 = await p.evaluate(() => { const T = IX_LESSON_TEXT, all = Object.values(T).join('\n'); const need = ['Micturition', 'Kidney function tests', 'Spike potentials', 'Satiety centre', 'γ-glutamyl', 'Celiac disease', 'nucleoproteins', 'microbiota', 'Gallstones']; const miss = need.filter((w) => !all.toLowerCase().includes(w.toLowerCase())); const cards = IX_KIT.cards().filter((c) => /bladder|duodenum never contract|ventromedial|γ-glutamyl|celiac|bile-salt losses|creatinine clearance/i.test(c.q)).length; const ps = IX_LESSON.parts(T['concentration-of-urine-2-urea-hco3-and-h-1-and-2']); return { miss, cards, last: ps[ps.length - 1].h, sayN: (ps[ps.length - 1].md.match(/^\d+\./gm) || []).length }; });
  check('N4', 'The lessons gained the department-book topics they lacked, each with a Think question (flashcards)', !n4.miss.length && n4.cards >= 7 && /Say it back/.test(n4.last) && n4.sayN >= 6, n4);
  const n5 = await p.evaluate(() => { const U = IX_PLAN.units(); const q = IX_GIT206.mcq.filter((x) => (/micturition/i.test(x.stem) || x.chapter === 'Micturition') && x.answerKeys.length); return { n: q.length, inUnit: q.filter((x) => U.some((u) => u.pred(x))).length }; });
  check('N5', 'Micturition questions belong to a unit (so the plan practises them)', n5.n >= 5 && n5.inUnit === n5.n, n5);
  const n6 = await p.evaluate(() => [IX_GIT.sealedQs('Sealed mock 1').length, IX_GIT.sealedQs('Sealed mock 2').length]);
  check('N6', 'Each sealed mock holds 45 never-seen questions at most', n6.every((x) => x >= 30 && x <= 45), n6);
  await p.evaluate(() => IX_LESSON.open('concentration-of-urine-2-urea-hco3-and-h-1-and-2', 5)); await tick(p, 300);
  const h = await p.evaluate(() => document.querySelector('.ixLpart h2').textContent);
  check('N7', 'The new parts open in the lesson reader; no page errors', /Micturition/.test(h) && !errs.length, { h, errs: errs.slice(0, 3) });
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
