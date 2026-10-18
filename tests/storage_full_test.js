// v18.13: the progress save survives a full phone storage (owner's progress file, 12 Oct: "The quota has been exceeded").
// F1 spare copies are cleared and the progress is kept · F2 nothing spare: no crash, the app says so, a step still moves
// on screen · F3 once there is room again the next save keeps everything and the warning goes.
const { open } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(4) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 400)); if (!ok) fails++; };
const fill = (key) => {
  // fill localStorage under `key` until the browser refuses one more character
  let lo = 0, hi = 12e6;
  localStorage.removeItem(key);
  while (hi - lo > 2048) {
    const mid = Math.floor((lo + hi) / 2);
    try { localStorage.setItem(key, 'x'.repeat(mid)); lo = mid; } catch (_) { hi = mid; }
  }
  localStorage.setItem(key, 'x'.repeat(lo));
  return lo;
};
(async () => {
  const s = await open({ v16: true, time: '2026-10-18T19:00:00+03:00', state: null, settle: 1500 });
  const { page } = s;
  const r1 = await page.evaluate((fillSrc) => {
    const fill = eval('(' + fillSrc + ')');
    save();
    const n = fill('intellectuality_state_backup_before_link');
    S.testGrow = 'g'.repeat(60000); // the progress grows past what is left
    let threw = null;
    try { save(); } catch (e) { threw = String(e); }
    const kept = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state') || '{}');
    return { filled: n, threw, kept: (kept.testGrow || '').length, backupGone: localStorage.getItem('intellectuality_state_backup_before_link') === null, log: (S.storageLog || []).map((x) => x.what), banner: !!document.getElementById('ixStorageFull') };
  }, fill.toString());
  check('F1', 'Storage full of a spare copy: the save clears it and keeps the progress; nothing throws; no warning', !r1.threw && r1.kept === 60000 && r1.backupGone && r1.log.some((x) => /cleared intellectuality_state_backup_before_link/.test(x)) && !r1.banner, r1);

  const r2 = await page.evaluate((fillSrc) => {
    const fill = eval('(' + fillSrc + ')');
    fill('someone_elses_data'); // nothing the app may clear
    S.testGrow = 'h'.repeat(120000);
    let threw = null;
    try { save(); } catch (e) { threw = String(e); }
    const seg0 = (() => { try { return currentLessonSegment().key; } catch (_) { return null; } })();
    const b = document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"]');
    let actErr = null;
    try { b && b.click(); } catch (e) { actErr = String(e); }
    const moved = (() => { try { return S.visualBlind[seg0] || S.segments[seg0] || false; } catch (_) { return false; } })();
    return { threw, actErr, moved, banner: document.getElementById('ixStorageFull')?.innerText || '', full: !!window.IX_LS_FULL };
  }, fill.toString());
  check('F2', 'Storage full of other data: no crash, the step still moves on screen, and a plain warning offers the progress download', !r2.threw && !r2.actErr && r2.moved && /storage is full/i.test(r2.banner) && /Share my progress/.test(r2.banner) && r2.full, r2);

  const r3 = await page.evaluate(() => {
    localStorage.removeItem('someone_elses_data');
    save();
    const kept = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state') || '{}');
    return { kept: (kept.testGrow || '').length, banner: !!document.getElementById('ixStorageFull'), full: !!window.IX_LS_FULL };
  });
  check('F3', 'Room again: the next save keeps everything and the warning goes', r3.kept === 120000 && !r3.banner && !r3.full, r3);
  check('F4', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
  await s.close();
  console.log((4 - fails) + '/4 STORAGE checks passed');
  process.exit(fails ? 1 : 0);
})();
