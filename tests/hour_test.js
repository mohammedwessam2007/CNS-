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
  global.window = {}; require('../source/public/renaissance-books-guides.js'); require('../source/public/renaissance-books-more.js'); require('../source/public/renaissance-books-v1813.js');
  const sizes = {}, bad = [];
  for (const b of window.RN_BOOKS) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, b.id + '.json'), 'utf8'));
    sizes[b.id] = d.sittings.length;
    for (const s of d.sittings) if (s.words < 4000 || s.words > 15000 || !s.body.length || /gutenberg/i.test(s.body.join(' '))) bad.push(b.id + ':' + s.n + ' ' + s.words);
    if (!b.guide.length || !b.prompts.length) bad.push(b.id + ' guide');
  }
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  const routeBad = window.RN_BOOKS.filter((b) => b.route).flatMap((b) => [...b.route.read.filter((n) => n < 1 || n > sizes[b.id]), ...Object.keys(b.route.bridge || {}).filter((n) => !b.route.read.includes(+n))].map((n) => b.id + ':' + n));
  const essential = window.RN_BOOKS.reduce((a, b) => a + (b.route ? b.route.read.length : sizes[b.id]), 0);
  check('H1', window.RN_BOOKS.length + ' works (' + total + ' sittings in full, ' + essential + ' on the essential route) of 4,000–15,000 words, no Project Gutenberg licence text, a guide and prompts for every work; every route sitting and bridge points at a real sitting you read', window.RN_BOOKS.length >= 19 && !bad.length && !routeBad.length && essential < total, { sizes, bad: bad.slice(0, 10), routeBad });
  const src = fs.readFileSync(path.join(__dirname, '..', 'source', 'public', 'renaissance-books.js'), 'utf8');
  const count = JSON.parse('{' + src.match(/const COUNT = \{([^}]*)\}/)[1].replace(/(\w+):/g, '"$1":') + '}');
  check('H2', 'The app\'s sitting counts match the built books', Object.keys(sizes).every((k) => count[k] === sizes[k]) && Object.keys(count).length === Object.keys(sizes).length, { count, sizes });
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
  const r = await p.evaluate(() => { const o = document.querySelector('.rhRead'); return { guide: !!o.querySelector('.rhGuide:not([hidden])'), essay: !!o.querySelector('[data-rh="essay"]'), paras: o.querySelectorAll('.rhText p').length, first: [...o.querySelectorAll('.rhText p')].slice(0, 3).map((x) => x.textContent.slice(0, 40)).join(' | '), notes: o.querySelectorAll('[data-rh-note]').length, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over: [...o.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).length }; });
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
  check('H10', 'All books lists every work and the companion essays', sh.items >= 20, sh);
  await p.keyboard.press('Escape');
  await p.evaluate(() => RN_HOUR.open('crime:8'));
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const br = await p.evaluate(() => ({ bridge: document.querySelector('.rhRead .rhBridge')?.textContent || '', shelf: document.querySelector('.rhRead .rlShelf')?.textContent }));
  check('H13', 'On the essential route a long book shows a bridge for the chapters between (Crime and Punishment, sitting 5 of 14)', /Zametov/.test(br.bridge) && /sitting 5 of 14/.test(br.shelf), br);
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="full"]').click());
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const fl = await p.evaluate(() => ({ shelf: document.querySelector('.rhRead .rlShelf')?.textContent, bridge: !!document.querySelector('.rhRead .rhBridge'), plan: RN_HOUR.plan().filter((k) => k.startsWith('crime:')).length }));
  check('H14', '"Read every chapter" switches that book to all its sittings and opens the first chapter you skipped', /sitting 5 of 21/.test(fl.shelf) && !fl.bridge && fl.plan === 21, fl);
  await p.evaluate(() => RN_HOUR.open('hamlet:1'));
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const hm = await p.evaluate(() => ({ verse: !!document.querySelector('.rhRead .rhVerse'), ws: getComputedStyle(document.querySelector('.rhRead .rhText p')).whiteSpace }));
  await p.evaluate(() => RN_HOUR.open('camus:1'));
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const cm = await p.evaluate(() => ({ text: document.querySelector('.rhRead .rhText').textContent.length, head: [...document.querySelectorAll('.rhRead .rhText h3')].map((h) => h.textContent).join(' | ') }));
  check('H15', 'Hamlet keeps its verse lines; the Camus study opens with The Stranger, Sisyphus, The Rebel, The Plague and The Fall', hm.verse && hm.ws === 'pre-line' && /Stranger/.test(cm.head) && /Plague/.test(cm.head) && /Fall/.test(cm.head) && cm.text > 20000, { hm, cm: cm.head.slice(0, 200) });
  await p.evaluate(() => RN_HOUR.open('karamazov:12'));
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const gi = await p.evaluate(() => ({ note: document.querySelector('.rhRead .rhTrNote')?.textContent || '', burn: /Tomorrow I shall burn you/.test(document.querySelector('.rhRead .rhText').textContent), verse: document.querySelectorAll('.rhRead .rhText blockquote').length, apply: document.querySelector('.rhRead .rhApply')?.textContent || '' }));
  check('H16', 'The Grand Inquisitor opens in the new translation made from the Russian, with its verse quotations, and ends with a "Use it today" action', /New translation/.test(gi.note) && gi.burn && gi.verse === 3 && /Use it today/.test(gi.apply), gi);
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="oldtr"]').click());
  await p.waitForFunction(() => /Old translation/.test(document.querySelector('.rhRead .rhTrNote')?.textContent || ''), null, { timeout: 20000 });
  const old = await p.evaluate(() => /burn thee/i.test(document.querySelector('.rhRead .rhText').textContent));
  check('H17', 'The old Garnett translation is one tap away', old, { old });
  const ug = [];
  for (const k of ['underground:1', 'underground:2']) {
    await p.evaluate((k) => RN_HOUR.open(k), k);
    await p.waitForFunction(() => /New translation/.test(document.querySelector('.rhRead .rhTrNote')?.textContent || ''), null, { timeout: 20000 });
    ug.push(await p.evaluate(() => { const t = document.querySelector('.rhRead .rhText').textContent; return { len: t.length, sick: /I am a sick man/.test(t), wall: /stone wall/.test(t), simonov: /last seen Simonov/.test(t), nekrasov: !!document.querySelector('.rhRead .rhText blockquote') }; }));
  }
  check('H18', 'Notes from Underground, sittings 1 and 2, open complete in the new translation', ug[0].sick && ug[0].wall && ug[0].len > 50000 && ug[1].simonov && ug[1].nekrasov && ug[1].len > 50000, ug);
  // v18.13: the protocol around the reading
  await p.evaluate(() => RN_HOUR.open('ivan:1'));
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const iv = await p.evaluate(() => ({ note: document.querySelector('.rhRead .rhTrNote')?.textContent || '', conv: /In conversation with/.test(document.querySelector('.rhRead .rhGuide')?.textContent || ''), gerasim: /Gerasim/.test(document.querySelector('.rhRead .rhText').textContent), words: document.querySelector('.rhRead .rhText').textContent.split(/\s+/).length }));
  check('H19', 'New: The Death of Ivan Ilyich opens in a new translation from the Russian, with its guide and how it talks to the other books', /New translation/.test(iv.note) && iv.conv && iv.gerasim && iv.words > 9000, iv);
  const T = await p.evaluate(() => RN_HOUR.label('ivan:1') && window.INTELLECTUALITY_V14.cairoYMD());
  const prev = (n) => { const d = new Date(T + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
  await p.evaluate(({ a, b, c }) => {
    const h = S.rnLib.hour;
    h.done = { 'underground:1': c, 'underground:2': c, 'apology:1': c, 'enchiridion:1': b, 'shortness:1': a };
    h.notes = { 'underground:2': { sum: 'He bumps the officer on the Nevsky.', keep: 'Whom is he crushing?' }, 'shortness:1': { keep: 'We lose a great deal of it' } };
    h.min = { [a]: 30 }; h.rev = {}; h.did = {}; h.week = {}; h.reck = {};
  }, { a: prev(1), b: prev(2), c: prev(6) });
  await p.evaluate(() => RN_HOUR.open('underground:3'));
  await p.waitForSelector('.rhRead .rhText p', { timeout: 20000 });
  const w = await p.evaluate(() => ({ mem: document.querySelectorAll('.rhRead .rhMemItem').length, last: !!document.querySelector('[data-rh="lastshow"]'), did: !!document.querySelector('.rhRead .rhDid'), week: !!document.querySelector('.rhRead .rhWeek'), streak: document.querySelector('.rhRead .rhStreak')?.textContent || '' }));
  check('H20', 'Before reading: lines you kept come back for recall, then last time, yesterday\'s action and the weekly review; the streak shows', w.mem === 2 && w.last && w.did && w.week && /1 day/.test(w.streak), w);
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="memshow"]').click());
  const ans = await p.evaluate(() => !document.querySelector('.rhRead .rhMemA').hidden);
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="memyes"]').click());
  await p.evaluate(() => document.querySelector('.rhRead [data-rh="lastshow"]').click());
  const lastTxt = await p.evaluate(() => document.querySelectorAll('.rhRead .rhCard')[1].textContent);
  await p.evaluate(() => { document.querySelector('.rhRead [data-rh-didnote]').value = 'Said sorry to my brother'; document.querySelector('.rhRead [data-rh="didyes"]').click(); });
  await p.evaluate(() => { document.querySelectorAll('.rhRead [data-rh-week]').forEach((x, i) => (x.value = 'answer ' + i)); document.querySelector('.rhRead [data-rh="weeksave"]').click(); });
  const st = await p.evaluate(() => { const h = S.rnLib.hour; return { rev: h.rev, did: h.did, week: Object.values(h.week)[0] }; });
  const rv = Object.values(st.rev)[0] || {};
  check('H21', 'Recall works: the line is checked and comes back in 3 days; last time shows what you wrote; the action and the weekly review are saved', ans && rv.s === 1 && rv.due === (() => { const d = new Date(T + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 3); return d.toISOString().slice(0, 10); })() && /officer on the Nevsky/.test(lastTxt) && Object.values(st.did).some((x) => x.ok && /brother/.test(x.t)) && st.week && st.week.c === 'answer 2', { rv, lastTxt: lastTxt.slice(0, 120), st });
  await p.evaluate(() => RN_HOUR.open('apology:1'));
  await p.waitForSelector('.rhRead .rhReck', { timeout: 20000 });
  await p.evaluate(() => { const x = document.querySelector('.rhRead [data-rh-reck="a"]'); x.value = 'Examine your life.'; x.dispatchEvent(new Event('input', { bubbles: true })); });
  const rk = await p.evaluate(() => ({ heart: document.querySelector('.rhRead .rhHeart')?.textContent || '', conv: /In conversation/.test(document.querySelector('.rhRead .rhReck').textContent), saved: (S.rnLib.hour.reck.apology || {}).a }));
  check('H22', 'The last sitting of a book ends with its verdict: how it talks to the others, the line to know by heart, three questions saved', /unexamined life/.test(rk.heart) && rk.conv && rk.saved === 'Examine your life.', rk);
  await p.evaluate(() => RN_HOUR.commonplace());
  const cp = await p.evaluate(() => document.querySelector('.rhRead .rlPage').textContent);
  check('H23', 'The commonplace book gathers the lines kept, the actions, the verdicts and the weekly reviews', /Whom is he crushing/.test(cp) && /Said sorry/.test(cp) && /Examine your life/.test(cp) && /Weekly reviews/.test(cp) && /min read/.test(cp), { cp: cp.slice(0, 400) });
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
