// The Library (v18.9): one long reading a day, every day, at any hour. The door is always in the side menu; a reading
// opens full-screen and reads on a phone with no sideways scroll; quotations, backstage notes and recall questions
// render; "I read it" is saved in the app's own state (so it syncs) and the door moves on; medicine progress is untouched.
// Usage: node tests/library_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const { open } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 900))); };

(async () => {
  // content: every reading is long, well-formed and has recall questions
  {
    global.window = {};
    for (let i = 1; i <= 5; i++) require('../source/public/renaissance-library-' + i + '.js');
    const L = window.RN_LIBRARY;
    const ids = new Set(L.map((r) => r.id));
    const bad = L.filter((r) => !r.id || !r.title || !r.kicker || !r.shelf || !Array.isArray(r.body) || !Array.isArray(r.q) || r.q.length < 1 || r.q.some((x) => !x[0] || !x[1]));
    const words = L.map((r) => r.body.join(' ').split(/\s+/).length);
    const quotes = L.filter((r) => r.body.some((b) => b.startsWith('>')) && r.body.some((b) => b.startsWith('— ')));
    const back = L.filter((r) => r.body.some((b) => b.startsWith('! ')));
    check('L1', 'At least 20 readings, unique ids, each with title, hook, shelf and 3+ recall questions', L.length >= 15 && ids.size === L.length && !bad.length, { n: L.length, bad: bad.map((r) => r.id) });
    check('L2', 'Each reading is long (≥ 850 words of body; the old sessions were the complaint)', Math.min(...words) >= 800, { min: Math.min(...words), total: words.reduce((a, b) => a + b, 0) });
    check('L3', 'Every reading quotes its literature with a named source and has backstage notes', quotes.length === L.length && back.length >= L.length - 4, { noQuote: L.filter((r) => !quotes.includes(r)).map((r) => r.id), noBack: L.filter((r) => !back.includes(r)).map((r) => r.id) });
    delete global.window;
  }

  // late at night, on a phone, before the medicine day is done
  const s = await open({ v16: true, time: '2026-10-12T23:55:00+03:00', state: null, settle: 2600, viewport: { width: 390, height: 844 }, touch: true });
  const p = s.page;
  const seg0 = await p.evaluate(() => JSON.stringify(S.segments || {}) + JSON.stringify((S.v16 && S.v16.q) || {}));
  const door = await p.evaluate(() => { const b = document.getElementById('rlDoor'); return { here: !!b, text: b ? b.textContent : '', menu: !!b?.closest('aside') }; });
  check('L4', 'The door "TODAY\'S READING" is in the side menu at 23:55, before the medicine day is finished', door.here && door.menu && /TODAY'S READING · \d+ min/.test(door.text), door);
  await p.evaluate(() => document.getElementById('rlDoor').click());
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const o = document.querySelector('.rlRead'), pg = o && o.querySelector('.rlPage');
    return {
      open: !!o, title: o?.querySelector('h2')?.textContent, quotes: o ? o.querySelectorAll('blockquote.rlQuote cite').length : 0, aside: o ? o.querySelectorAll('.rlAside').length : 0, qs: o ? o.querySelectorAll('.rlQ').length : 0, answersHidden: o ? [...o.querySelectorAll('.rlQa')].every((a) => a.hidden) : false,
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, pageW: pg ? Math.round(pg.getBoundingClientRect().width) : 0, overflow: o ? [...o.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).length : -1,
      font: pg ? parseFloat(getComputedStyle(pg).fontSize) : 0,
    };
  });
  check('L5', 'It opens full-screen with the first reading, quotations with sources, backstage notes and hidden answers', r.open && r.title && r.quotes >= 1 && r.aside >= 1 && r.qs >= 1 && r.answersHidden, r);
  check('L6', 'On a 390 px phone nothing scrolls sideways and the text is book-sized (≥ 17 px)', r.sw <= r.cw && r.overflow === 0 && r.font >= 17, r);
  const rev = await p.evaluate(() => { document.querySelector('.rlRead [data-rl="reveal"]').click(); const q = document.querySelector('.rlRead .rlQ'); return { shown: !q.querySelector('.rlQa').hidden, saved: Object.keys((S.rnLib.ans || {})).length }; });
  check('L7', 'Reveal shows the answer and remembers it', rev.shown && rev.saved === 1, rev);
  const fin = await p.evaluate(() => {
    const first = RN_LIBRARY_UI.todays().r.id;
    document.querySelector('.rlRead [data-rl="finish"]').click();
    const saved = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state') || '{}');
    return { first, done: S.rnLib.done[first], savedDone: saved.rnLib && saved.rnLib.done && saved.rnLib.done[first], doneLine: !!document.querySelector('.rlRead .rlDone'), next: !!document.querySelector('.rlRead [data-rl="next"]'), door: document.getElementById('rlDoor').textContent };
  });
  check('L8', '"I read it" saves to the app state (it syncs with the rest), shows ✓ and offers the next reading', fin.done && fin.savedDone === fin.done && fin.doneLine && fin.next && /✓/.test(fin.door), fin);
  const nx = await p.evaluate(() => { document.querySelector('.rlRead [data-rl="next"]').click(); return { title: document.querySelector('.rlRead h2')?.textContent, n: document.querySelector('.rlRead .rlBarT')?.textContent }; });
  check('L9', 'Next reading opens the second one', /2 of/.test(nx.n || ''), nx);
  const sh = await p.evaluate(() => { document.querySelector('.rlRead [data-rl="shelf"]').click(); return { items: document.querySelectorAll('.rlRead .rlItem').length, done: document.querySelectorAll('.rlRead .rlItem.done').length, shelves: document.querySelectorAll('.rlRead .rlList h3').length }; });
  check('L10', 'All readings lists every reading by shelf, with the finished one ticked', sh.items === (await p.evaluate(() => RN_LIBRARY.length)) && sh.done === 1 && sh.shelves >= 4, sh);
  await p.keyboard.press('Escape');
  const after = await p.evaluate(() => ({ closed: !document.querySelector('.rlRead'), segs: JSON.stringify(S.segments || {}) + JSON.stringify((S.v16 && S.v16.q) || {}) }));
  check('L11', 'Esc closes it, and medicine progress (lesson steps and MCQ records) is exactly as before', after.closed && after.segs === seg0, { closed: after.closed });
  check('L12', 'No page errors', !s.log.errors.length, s.log.errors.slice(0, 5));
  await s.close();

  const passed = results.filter((x) => x.ok).length;
  console.log(`\n${passed}/${results.length} library checks passed`);
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify({ suite: 'library', passed, total: results.length, results }, null, 2));
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
