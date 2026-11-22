// v42 · one course, Coursera-style. V1 the plan starts today, 22 Nov, and has no practical days (February) · V2 every lesson
// has a real lecture video (YouTube, embeddable) · V3 the home shows Course content: weeks → days → items with a progress bar,
// today's day open, tools in one Toolbox · V4 an item opens with one tap · V5 the lesson opens with its lecture: tap to play
// inside the lesson (youtube-nocookie), watching is remembered · V6 the professor is asked from the course page and from a video
// V7 nothing scrolls sideways, no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [], yt = [], asks = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route(/youtube|ytimg/, (r) => { yt.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>video</title>' }); });
  const v1 = await p.evaluate(() => { const D = IX_PLAN.build().days; return { first: D[0].date, pract: D.filter((d) => d.steps.some((x) => /practical|spot|college/.test(x.kind) && d.phase === 'Practical')).length, last: D[D.length - 1].date }; });
  check('V1', 'The course starts today (22 Nov) and ends with the CNS written (12 Jan); practicals wait for February', v1.first === '2026-11-22' && !v1.pract && v1.last === '2027-01-12', v1);
  const v2 = await p.evaluate(() => { const L = IX_LESSON.all(); return { n: L.length, with: L.filter((l) => (IX_VIDEOS[l.key] || []).length).length, ids: L.every((l) => (IX_VIDEOS[l.key] || []).every((v) => /^[\w-]{11}$/.test(v.id))) }; });
  check('V2', 'Every lesson has a lecture video (YouTube id, teacher, length)', v2.n >= 50 && v2.with === v2.n && v2.ids, v2);
  const v3 = await p.evaluate(() => { const c = document.querySelector('.ixC'); return { c: !!c, weeks: document.querySelectorAll('.ixCweek').length, items: document.querySelectorAll('.ixCday li').length, today: !!document.querySelector('.ixCday.today[open]'), bar: !!document.querySelector('.ixCbar i'), toolbox: !!document.querySelector('details.ixCtool .ixQtools'), cal: (document.querySelector('.ixQcalendar') || { hidden: true }).hidden, sub: document.querySelectorAll('.ixCsub').length }; });
  check('V3', 'Course content: weeks → days → items, progress bar, today open, lecture listed, tools in one Toolbox', v3.c && v3.weeks >= 7 && v3.items >= 150 && v3.today && v3.bar && v3.toolbox && v3.cal && v3.sub >= 40, v3);
  await p.click('.ixCday.today [data-cgo] >> nth=1'); await tick(p, 600);
  const v4 = await p.evaluate(() => ({ lesson: !!document.querySelector('.ixL.on, .ixL[open], .ixL') && !!document.querySelector('.ixLpart'), h: (document.querySelector('.ixLpart h2') || {}).textContent }));
  check('V4', 'A lesson item opens with one tap', v4.lesson, v4);
  const v5a = await p.evaluate(() => ({ block: !!document.querySelector('.ixLpart .ixCv'), iframes: document.querySelectorAll('.ixCv iframe').length }));
  await p.click('.ixCv [data-play] >> nth=0'); await tick(p, 300);
  const v5 = await p.evaluate(() => { const f = document.querySelector('.ixCv iframe'); return { src: f && f.src, watched: Object.keys(IX_COURSE.watched()).length }; });
  check('V5', 'The lesson opens with its lecture; nothing loads from YouTube until he taps play, then it plays inside the lesson and is remembered', v5a.block && !v5a.iframes && /youtube-nocookie\.com\/embed\//.test(v5.src || '') && v5.watched === 1, { v5a, v5, ytBefore: yt.filter((u) => /embed/.test(u)).length });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-TESTKEY'); });
  await p.route('https://openrouter.ai/**', async (r) => { asks.push(JSON.parse(r.request().postData() || '{}')); await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: 'Here is what matters.' } }] }) }); });
  await p.click('.ixCv [data-vask] >> nth=0'); await tick(p, 900);
  const a1 = asks.length;
  await p.evaluate(() => { const x = document.querySelector('.ixL [aria-label="Close"], .ixL [data-a=close]'); if (x) x.click(); if (window.IX_LESSON) IX_LESSON.close(); if (window.IX_TUTOR && IX_TUTOR.close) IX_TUTOR.close(); if (window.IX_SESSION && IX_SESSION.hide) IX_SESSION.hide(); });
  await p.evaluate(() => { const f = document.querySelector('[data-cask]'); f.querySelector('input').value = 'why does the oesophagus change epithelium?'; f.dispatchEvent(new Event('submit', { cancelable: true })); }); await tick(p, 900);
  const last = asks.length ? JSON.stringify(asks[asks.length - 1].messages || []) : '';
  check('V6', 'The professor answers from a video and from the course page box', a1 >= 1 && asks.length > a1 && /oesophagus change epithelium/.test(last), { a1, all: asks.length });
  const wide = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  check('V7', 'No sideways scroll and no page errors', !wide && !errs.length, { wide, errs: errs.slice(0, 3) });
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
