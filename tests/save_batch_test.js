// v18.14.1: one save per tap (owner, 18 Oct 2026: "the menu is clicking on its own … it's very laggy").
// B1 a tap on a lesson step button moves the lesson on and saves once, not once per layer · B2 whoever reads the saved
// progress right after gets it as it is now · B3 a save asked for outside a tap is written at once · B4 leaving the
// page writes a waiting save · B5 on a touch screen the page jumps instead of gliding · B6 no page errors.
const { open } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(4) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 400)); if (!ok) fails++; };
const KEY = 'intellectuality_v41_launch_state';
(async () => {
  const s = await open({ v16: true, time: '2026-10-18T19:00:00+03:00', state: null, settle: 2500, viewport: { width: 390, height: 844 }, touch: true });
  const { page } = s;
  const sel = '#player button[data-act="visual-hide"]';
  const before = await page.evaluate((sel) => { const b = document.querySelector(sel); return { has: !!b, key: b && b.dataset.key, pos: JSON.stringify([S.visualBlind || {}, S.segments || {}]), made: IX_SAVE_BATCH.stats().made }; }, sel);
  await page.click(sel); // a real pointer click (scrolling to a touch target does not work under the frozen test clock)
  await page.clock.runFor(1000);
  const r1 = await page.evaluate((b) => ({ made: IX_SAVE_BATCH.stats().made - b.made, pending: IX_SAVE_BATCH.stats().pending, pos: JSON.stringify([S.visualBlind || {}, S.segments || {}]) }), before);
  check('B1', 'A tap on a lesson step button moves the lesson on and saves once', before.has && r1.pos !== before.pos && r1.made === 1 && !r1.pending, { before, r1 });

  const r2 = await page.evaluate(() => {
    const m0 = IX_SAVE_BATCH.stats().made;
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true })); // a tap anywhere opens a burst
    S.batchMark = 'b2';
    save();
    const waiting = IX_SAVE_BATCH.stats().pending;
    const kept = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state') || '{}').batchMark;
    return { waiting, kept, made: IX_SAVE_BATCH.stats().made - m0 };
  });
  check('B2', 'A save asked for during a tap waits, and reading the progress right after gets it as it is now', r2.waiting === true && r2.kept === 'b2' && r2.made === 1, r2);

  await page.clock.runFor(1000);
  const r3 = await page.evaluate((KEY) => {
    S.batchMark = 'b3';
    const m0 = IX_SAVE_BATCH.stats().made;
    save();
    return { made: IX_SAVE_BATCH.stats().made - m0, pending: IX_SAVE_BATCH.stats().pending };
  }, KEY);
  const kept3 = await page.evaluate((KEY) => JSON.parse(localStorage.getItem(KEY)).batchMark, KEY);
  check('B3', 'A save outside a tap is written at once, as before', r3.made === 1 && !r3.pending && kept3 === 'b3', { r3, kept3 });

  const r4 = await page.evaluate(() => {
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    S.batchMark = 'b4';
    save();
    const waiting = IX_SAVE_BATCH.stats().pending;
    window.dispatchEvent(new Event('pagehide'));
    return { waiting, after: IX_SAVE_BATCH.stats().pending };
  });
  const kept4 = await page.evaluate((KEY) => JSON.parse(localStorage.getItem(KEY)).batchMark, KEY);
  check('B4', 'Leaving the page writes a waiting save', r4.waiting === true && r4.after === false && kept4 === 'b4', { r4, kept4 });

  const sb = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  check('B5', 'On a touch screen the page jumps to a new section instead of gliding under the finger', sb === 'auto', { scrollBehavior: sb });
  check('B6', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
  await s.close();
  console.log((6 - fails) + '/6 SAVE checks passed');
  process.exit(fails ? 1 : 0);
})();
