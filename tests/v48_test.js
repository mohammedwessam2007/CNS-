// v48 · the doctors' notes in their lessons and the warm, calm look. N1 18 lessons carry a "From your doctor's notes" part
// naming the notes and pages (10 histology from Dr. Abdelwahab, 8 physiology from Dr. Fawzy) · N2 that part opens in the
// reader · N3 the page is light and warm (paper background, coral actions), titles in a serif, and motion respects
// "reduce motion" · N4 no sideways scroll, no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2000, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  const n1 = await p.evaluate(() => { const N = IX_LESSON_NOTES, ks = Object.keys(N); return { n: ks.length, a: ks.filter((k) => /Abdelwahab/.test(N[k].who)).length, f: ks.filter((k) => /Fawzy/.test(N[k].who)).length, inText: ks.filter((k) => /From your doctor's notes[\s\S]*pages/.test(IX_LESSON_TEXT[k])).length, real: ks.every((k) => IX_LESSON.all().some((l) => l.key === k)) }; });
  check('N1', "18 lessons carry the doctors' notes with page numbers", n1.n === 18 && n1.a === 10 && n1.f === 8 && n1.inText === 18 && n1.real, n1);
  const idx = await p.evaluate(() => IX_LESSON.parts(IX_LESSON_TEXT['intro-to-the-kidney-renal-corpuscle']).findIndex((x) => /doctor's notes/.test(x.h)));
  await p.evaluate((i) => IX_LESSON.open('intro-to-the-kidney-renal-corpuscle', i), idx); await tick(p, 400);
  const n2 = await p.evaluate(() => ({ h: document.querySelector('.ixLpart h2').textContent, txt: document.querySelector('.ixLmd').innerText.slice(0, 200) }));
  check('N2', 'The notes part opens in the lesson reader', /doctor's notes/.test(n2.h) && /Abdelwahab's histology notes, pages 59–67/.test(n2.txt), n2);
  await p.evaluate(() => IX_LESSON.close()); await tick(p, 300);
  const n3 = await p.evaluate(() => { const bg = getComputedStyle(document.body).backgroundColor, go = document.querySelector('.ixZgo'), h = document.querySelector('.ixZname'); return { lt: document.documentElement.classList.contains('ixLT'), bg, go: go && getComputedStyle(go).backgroundColor, serif: h && /Georgia|Palatino|Iowan/.test(getComputedStyle(h).fontFamily) }; });
  check('N3', 'Warm light look: paper background, coral main action, serif titles', n3.lt && n3.bg === 'rgb(250, 249, 245)' && n3.go === 'rgb(201, 100, 66)' && n3.serif, n3);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  check('N4', 'No sideways scroll and no page errors', !wide && !errs.length, { wide, errs: errs.slice(0, 3) });
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
