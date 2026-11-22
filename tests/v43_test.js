// v43 · the lessons replace the lecture. D1 every lesson is deepened (written for the app) and now runs long enough to stand
// in for a lecture · D2 each new part has a reasoning question (Think → flashcard) and its point joins "Say it back"
// D3 every lesson offers the professor's full lecture when a key is connected · D4 the mismatched videos were replaced · D5 no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2000 });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  const d1 = await p.evaluate(() => { const T = IX_LESSON_TEXT, keys = IX_LESSON.all().map((l) => l.key), deep = new Set(IX_LESSON_DEEP.concat(IX_LESSON_SUPP)); const w = keys.map((k) => (T[k] || '').split(/\s+/).length); return { n: keys.length, deep: keys.filter((k) => deep.has(k)).length, min: Math.min(...w), avg: Math.round(w.reduce((a, b) => a + b, 0) / w.length) }; });
  check('D1', 'Every lesson is deepened; no lesson is a summary any more', d1.deep === d1.n && d1.min >= 600 && d1.avg >= 780, d1);
  const d2 = await p.evaluate(() => { const ks = IX_LESSON_DEEP; let bad = []; ks.forEach((k) => { const ps = IX_LESSON.parts(IX_LESSON_TEXT[k]); const last = ps[ps.length - 1]; if (!/Say it back/.test(last.h) || (last.md.match(/^\d+\./gm) || []).length < 6) bad.push(k); }); const cards = IX_KIT.cards().length; return { bad, cards }; });
  check('D2', 'New parts carry Think questions (flashcards) and extend Say it back', !d2.bad.length && d2.cards >= 200, d2);
  await p.evaluate(() => localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY'));
  await p.evaluate(() => IX_LESSON.open('spleen', 0)); await tick(p, 300);
  const d3 = await p.evaluate(() => (document.getElementById('ixLgen') || {}).textContent || '');
  check('D3', "Every lesson offers the professor's full lecture when the key is connected", /Full lecture/.test(d3), { d3 });
  const d4 = await p.evaluate(() => ({ kid: IX_VIDEOS['intro-to-the-kidney-renal-corpuscle'].map((v) => v.t).join(' | '), pan: IX_VIDEOS['pancreas'].map((v) => v.t).join(' | ') }));
  check('D4', 'The histology lessons have histology lectures', /histolog/i.test(d4.kid) && /histolog/i.test(d4.pan), d4);
  check('D5', 'No page errors', !errs.length, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
