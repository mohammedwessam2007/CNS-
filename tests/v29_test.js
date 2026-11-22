// v29 "the course is complete": Z1 Prepare everything writes every sheet once, resumable, skips cached ones
// Z2 it stops cleanly at the budget and carries on next tap · Z3 prefetch writes the next 3 days' sheets (max 3)
// Z4 13-14 Jan practical-revision days with the spot drill · Z5 the spot drill hides the names until tapped
// Z6 units without stored plates look up Gray's plates on Commons (caption must match) and keep them · Z7 no page errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 1180, height: 900 } });
  const p = s.page, sent = [], errs = []; let fail402 = false, commons = 0;
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => { const b = JSON.parse(r.request().postData() || '{}'); sent.push(b); if (fail402) return r.fulfill({ status: 402, body: '{}' }); return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: '## 🎯 The point\nok' } }], usage: { cost: 0.001 } }) }); });
  await p.context().route('https://commons.wikimedia.org/**', async (r) => { commons++; r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ query: { pages: {
    1: { title: 'File:Gray1188.png', imageinfo: [{ url: 'https://upload.wikimedia.org/a/Gray1188.png', thumburl: 'https://upload.wikimedia.org/t/640px-Gray1188.png', descriptionurl: 'https://commons.wikimedia.org/wiki/File:Gray1188.png', extmetadata: { ImageDescription: { value: 'The <b>spleen</b>, visceral surface' }, LicenseShortName: { value: 'Public domain' } } }] },
    2: { title: 'File:Gray500.png', imageinfo: [{ url: 'https://upload.wikimedia.org/a/Gray500.png', extmetadata: { ImageDescription: { value: 'Arteries of the arm' }, LicenseShortName: { value: 'Public domain' } } }] } } } }) }); });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY123'); localStorage.setItem('ix_tutor_cap_v1', '100'); localStorage.removeItem('ix_hy_v1'); localStorage.removeItem('ix_hy_figs_v1'); });
  // Z2 first: budget/balance error stops after the first failure; nothing cached
  fail402 = true;
  const r2 = await p.evaluate(() => IX_HY.prepareAll());
  fail402 = false; const n2 = sent.length;
  // Z1: carries on and writes all
  const tot = await p.evaluate(() => IX_HY.allIds().length);
  const r1 = await p.evaluate(() => IX_HY.prepareAll());
  const allCached = await p.evaluate(() => IX_HY.allIds().every((i) => IX_HY.cached(i)));
  const n1 = sent.length; const r1b = await p.evaluate(() => IX_HY.prepareAll());
  check('Z2', 'A refused request (balance used up) stops the batch at once and says why', n2 === 1 && r2.ok === 0 && /balance/.test(r2.err), { n2, r2 });
  check('Z1', 'Prepare everything writes every GIT and CNS sheet once; a second tap sends nothing', tot >= 40 && r1.ok === tot && allCached && sent.length === n1 && r1b.tot === 0 && sent.slice(n2).every((b) => b.model === 'google/gemini-3.8-flash'), { tot, r1, r1b });
  // Z3 prefetch
  await p.evaluate(() => localStorage.removeItem('ix_hy_v1')); let n = sent.length;
  const pf = await p.evaluate(() => IX_HY.prefetch());
  check('Z3', "Prefetch writes the next days' sheets in the background (at most 3)", pf >= 1 && pf <= 3 && sent.length - n === pf, { pf });
  await p.evaluate(() => localStorage.removeItem('ix_tutor_key_v1')); n = sent.length;
  const pf0 = await p.evaluate(() => IX_HY.prefetch());
  check('Z3b', 'No key, no prefetch', pf0 === 0 && sent.length === n, { pf0 });
  // Z4 practical days
  const z4 = await p.evaluate(() => IX_PLAN.build().days.filter((d) => d.date === '2027-01-13' || d.date === '2027-01-14').map((d) => ({ date: d.date, phase: d.phase, kinds: d.steps.map((x) => x.kind) })));
  check('Z4', 'Practicals are in February (owner, 22 Nov): no practical days in the plan before then', z4.length === 0, z4);
  // Z5 spot drill still opens on its own (the practical room's Spot tab)
  const z5 = await p.evaluate(() => { IX_HY.spot(6); return document.querySelectorAll('.ixYspot').length; }); await tick(p, 300);
  check('Z5', 'The spot drill opens on its own: 6 drawings, names hidden', z5 === 6, z5);
  await p.evaluate(() => IX_HY.close && IX_HY.close());
  // Z6 Commons lookup
  await p.evaluate(() => IX_HY.open('A:Spleen')); await tick(p, 1200);
  const z6 = await p.evaluate(() => ({ figs: [...document.querySelectorAll('.ixYfig img')].map((i) => i.getAttribute('src')), kept: JSON.parse(localStorage.getItem('ix_hy_figs_v1') || '{}')['A:Spleen'] }));
  const c1 = commons; await p.evaluate(() => { IX_HY.close(); IX_HY.open('A:Spleen'); }); await tick(p, 500);
  check('Z6', "A unit with no stored plate finds Gray's plates on Commons (only captions that name it), keeps them", z6.figs.length === 1 && /Gray1188/.test(z6.figs[0]) && z6.kept && z6.kept.length === 1 && commons === c1, { z6, again: commons - c1 });
  // Z8 the old CNS course has no September calendar during the season; its lessons are a date-free library, linked from each CNS sheet
  // Z9 the side menu is the plan's: no CNS MCQ course, no 21 Sep, no game bar; its buttons open the plan, GIT hub, sheets, library
  await p.evaluate(() => IX_HY.close()); await tick(p, 400);
  const z9 = await p.evaluate(() => { const host = document.getElementById('railToday').parentElement; const txt = [...host.children].filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.innerText).join(' '); return { txt: txt.slice(0, 200), sep: /\bSep\b|CATCH-UP|148|Resume learning|Neuron/.test(txt), game: getComputedStyle(document.getElementById('ixGame') || document.body).display, menu: !!host.querySelector('.ixXMenu [data-xm="map"]'), title: document.title }; });
  await p.evaluate(() => document.querySelector('.ixXMenu [data-xm="lib"]').click()); await tick(p, 500);
  const libOn = await p.evaluate(() => document.querySelector('.ixY').classList.contains('on') && /lesson library/.test(document.getElementById('ixYt').textContent));
  check('Z9', "The side menu is the plan's: no CNS MCQ course, no September, no game bar; 📖 opens the date-free library", !z9.sep && z9.game === 'none' && z9.menu && /EXAM PLAN/.test(z9.txt) && /EXAM PLAN/.test(z9.title) && libOn, Object.assign(z9, { libOn }));
  await p.evaluate(() => { IX_HY.close(); IX_HOME.cns(true); }); await tick(p, 1500);
  const z8 = await p.evaluate(() => { const vis = []; document.querySelectorAll('body *').forEach((e) => { if (e.children.length <= 1 && e.offsetParent && /\bSep\b|September|\b148\b|catch-up|CATCH-UP/.test(e.textContent) && e.textContent.length < 300) vis.push(e.textContent.trim().slice(0, 80)); }); return { vis, ey: document.getElementById('eyebrow').textContent }; });
  await p.evaluate(() => document.querySelector('[data-ixmp-open]').click()); await tick(p, 800);
  const mapIsPlan = await p.evaluate(() => !document.querySelector('.ixMpDay') || !document.querySelector('.ixMpDay').offsetParent);
  await p.evaluate(() => { IX_PLAN.close(); IX_HY.open('CNS:Brain stem'); }); await tick(p, 500);
  const les = await p.evaluate(() => [...document.querySelectorAll('.ixY [data-les]')].map((b) => b.textContent));
  const nlib = await p.evaluate(() => IX_HY.lessons());
  check('Z8', 'Old CNS course: no September dates, no catch-up; the map is the plan; CNS sheets link the course lessons; a library of all lessons', z8.vis.length === 0 && /LESSON LIBRARY/.test(z8.ey) && mapIsPlan && les.some((t) => /Brainstem/.test(t)) && nlib > 50, { z8, mapIsPlan, les, nlib });
  check('Z7', 'No page errors', errs.length === 0, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
