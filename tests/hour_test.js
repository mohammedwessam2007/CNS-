// The Great Books Hour (v18.10): one sitting of a real book a day, about an hour, in the course. The door and the
// finished-day card open today's sitting; the first sitting of a book opens with its guide; the text is the whole
// sitting; notes and "read" are saved in the app state; the next sitting follows; nothing in the lessons changes.
// Usage: node tests/hour_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 700))); };
(async () => {
  // the built texts: every sitting of every book is an hour-sized piece of the real text
  const dir = path.join(__dirname, '..', 'source', 'public', 'books');
  global.window = {}; require('../source/public/renaissance-books-guides.js');
  const sizes = {}, bad = [];
  for (const b of window.RN_BOOKS) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, b.id + '.json'), 'utf8'));
    sizes[b.id] = d.sittings.length;
    for (const s of d.sittings) if (s.words < 4500 || s.words > 13000 || !s.body.length || /gutenberg/i.test(s.body.join(' '))) bad.push(b.id + ':' + s.n + ' ' + s.words);
    if (!b.guide.length || !b.prompts.length) bad.push(b.id + ' guide');
  }
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  check('H1', 'Eight books, ' + total + ' sittings of 4,500–13,000 words (about an hour each), no Project Gutenberg licence text, a guide and prompts for every book', window.RN_BOOKS.length === 8 && total >= 100 && !bad.length, { sizes, bad: bad.slice(0, 10) });
  const src = fs.readFileSync(path.join(__dirname, '..', 'source', 'public', 'renaissance-books.js'), 'utf8');
  const count = JSON.parse('{' + src.match(/const COUNT = \{([^}]*)\}/)[1].replace(/(\w+):/g, '"$1":') + '}');
  check('H2', 'The app\'s sitting counts match the built books', JSON.stringify(count) === JSON.stringify(sizes), { count, sizes });
  delete global.window;

  const s = await open({ v16: true, time: '2026-10-17T22:30:00+03:00', state: null, settle: 2800, viewport: { width: 390, height: 844 }, touch: true });
  const p = s.page;
  const seg0 = await p.evaluate(() => JSON.stringify(S.segments || {}) + JSON.stringify((S.v16 && S.v16.q) || {}));
  const card0 = await p.evaluate(() => !!document.querySelector('#player .rlDayCard'));
  check('H3', 'During lessons the finished-day card is not shown', !card0, { card0 });
  const door = await p.evaluate(() => document.getElementById('rlDoor')?.textContent || '');
  check('H4', 'The side-menu door is "THE GREAT BOOKS HOUR"', /GREAT BOOKS HOUR/.test(door), { door });
  await p.evaluate(() => document.getElementById('rlDoor').click());
  await p.waitForSelector('.rhRead .rhText p', { timeout: 15000 });
  const r = await p.evaluate(() => { const o = document.querySelector('.rhRead'); return { guide: !!o.querySelector('.rhGuide:not([hidden])'), essay: !!o.querySelector('[data-rh="essay"]'), paras: o.querySelectorAll('.rhText p').length, first: o.querySelector('.rhText p')?.textContent.slice(0, 40), notes: o.querySelectorAll('[data-rh-note]').length, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over: [...o.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).length }; });
  check('H5', 'Today opens Notes from Underground, sitting 1: guide and companion essay first, then the whole text, then three lines to write', r.guide && r.essay && r.paras > 20 && /sick man/.test(r.first) && r.notes === 3, r);
  check('H6', 'On a 390 px phone nothing scrolls sideways', r.sw <= r.cw && r.over === 0, r);
  await p.fill('.rhRead [data-rh-note="keep"]', 'I am a spiteful man.');
  await p.waitForTimeout(1000);
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="finish"]').click());
  await p.waitForSelector('.rhRead .rlDone', { timeout: 15000 });
  const f = await p.evaluate(() => { const L = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state') || '{}'); const h = L.rnLib && L.rnLib.hour; return { done: h && h.done['underground:1'], keep: h && h.notes['underground:1'] && h.notes['underground:1'].keep, today: RN_HOUR.todays() }; });
  check('H7', '"I read today\'s sitting" and the written line are saved in the app state (they sync); today stays today\'s sitting', f.done === '2026-10-17' && f.keep === 'I am a spiteful man.' && f.today.key === 'underground:1' && f.today.finished, f);
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="next"]').click());
  await p.waitForSelector('.rhRead .rhText p', { timeout: 15000 });
  const n2 = await p.evaluate(() => ({ shelf: document.querySelector('.rhRead .rlShelf')?.textContent, guideHidden: !!document.querySelector('.rhRead .rhGuide[hidden]') }));
  check('H8', 'Next sitting opens sitting 2, with the guide folded away', /sitting 2 of 5/.test(n2.shelf) && n2.guideHidden, n2);
  await p.keyboard.press('Escape');
  await p.evaluate(() => { nextAction = () => ({ kind: 'STOP' }); render(); });
  await p.waitForTimeout(500);
  const card = await p.evaluate(() => { const c = document.querySelector('#player .rlDayCard'); return c ? c.textContent : ''; });
  check('H9', 'When the day\'s CNS work is done, the finished-day screen shows today\'s Great Books Hour', /GREAT BOOKS HOUR/.test(card) && /Notes from Underground/.test(card), { card: card.slice(0, 200) });
  await p.evaluate(() => RN_HOUR.shelf());
  const sh = await p.evaluate(() => ({ items: document.querySelectorAll('.rhRead .rlItem').length }));
  check('H10', 'All books lists the eight books and the companion essays', sh.items === 9, sh);
  await p.keyboard.press('Escape');
  const after = await p.evaluate(() => JSON.stringify(S.segments || {}) + JSON.stringify((S.v16 && S.v16.q) || {}));
  check('H11', 'Lesson steps and MCQ records are exactly as before', after === seg0, {});
  check('H12', 'No page errors', !s.log.errors.length, s.log.errors.slice(0, 4));
  await s.close();
  const passed = results.filter((x) => x.ok).length;
  console.log(`\n${passed}/${results.length} hour checks passed`);
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify({ suite: 'hour', passed, total: results.length, results }, null, 2));
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
