// Hostile certification (constitution §38): try to break date truth, state loading,
// input handling, network and layout. Usage: node tests/hostile_test.js [out.json]
// Server: node tests/serve.js source/public 8787 (APP_URL overrides).
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { open } = require('./harness');

const results = [];
function check(id, name, ok, detail = '') {
  const d = typeof detail === 'string' ? detail : JSON.stringify(detail);
  results.push({ id, name, ok: !!ok, detail: d });
  console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(5) + name + (d ? '  · ' + d.slice(0, 220) : ''));
}
const chipOf = (p) => p.evaluate(() => document.querySelector('#v14Calendar')?.textContent);
async function clickNext(page, n) {
  for (let i = 0; i < n; i++) { await page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]')?.click()); await page.waitForTimeout(150); }
}
async function toQuestion(page, max = 14) {
  for (let i = 0; i < max; i++) {
    const k = await page.evaluate(() => { const a = nextAction(); return a.kind + ':' + (a.seg?.type || ''); });
    if (k === 'SEGMENT:question') return true;
    const c = await page.evaluate(() => { const b = document.querySelector('#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"], #player [data-act="finish-qbank"]'); if (b) { b.click(); return true; } return false; });
    await page.waitForTimeout(160);
    if (!c) return false;
  }
  return false;
}
const curQ = (page) => page.evaluate(() => { const a = nextAction(); if (a.kind !== 'SEGMENT' || a.seg.type !== 'question') return null; const q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return q && { id: q.id, keys: q.answerKeys, opts: q.options.map(o => o.key) }; });
async function answerOne(page, correct = true) {
  if (!(await toQuestion(page))) return { reached: false };
  const q = await curQ(page);
  await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(200);
  const k = correct ? q.keys[0] : q.opts.find(x => !q.keys.includes(x));
  await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]')?.click(), k);
  await page.waitForTimeout(500);
  return { reached: true, id: q.id, recorded: await page.evaluate((id) => !!S.qbank.results[id] || Object.keys(S.answers).length > 0, q.id) };
}
function bigPng(w, h) {
  const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let x = 0xffffffff; for (const v of b) x = t[(x ^ v) & 255] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((w + 1) * h, 200); for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

(async () => {
  const t0 = Date.now();
  // Base state: Day 1 partly done on Mon 21 Sep.
  let partial;
  {
    const s = await open({ time: '2026-09-21T18:00:00+03:00', state: null, settle: 1000 });
    await clickNext(s.page, 3);
    partial = await s.page.evaluate(() => JSON.parse(JSON.stringify(S)));
    await s.close();
  }

  // ── Date truth under hostile clocks ──
  {
    const s = await open({ time: '2026-09-26T09:00:00+03:00', state: partial, settle: 1100 });
    const r = { chip: await chipOf(s.page), day: await s.page.evaluate(() => S.day), banner: await s.page.evaluate(() => document.querySelector('.v14Carryover')?.innerText || '') };
    const segs = await s.page.evaluate(() => Object.keys(S.segments).filter((k) => S.segments[k]).sort());
    check('X1', 'Five days missed: real date (SAT 26 SEP), today teaches the missed lessons (each labelled with its date), Day-1 work kept', /^TODAY · SAT 26 SEP · \+\d+ FROM MON 21–/.test(r.chip) && r.day === 6 && /Today was a review day/.test(r.banner) && JSON.stringify(segs) === JSON.stringify(Object.keys(partial.segments).filter((k) => partial.segments[k]).sort()), r);
    check('X1b', 'No page errors after a multi-day gap', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }
  {
    const io = JSON.parse(JSON.stringify(partial)); io.v14.calendar.policy = 'inorder';
    const s = await open({ time: '2026-09-26T09:00:00+03:00', state: io, settle: 1100 });
    const r = { chip: await chipOf(s.page), day: await s.page.evaluate(() => S.day), banner: await s.page.evaluate(() => document.querySelector('.v14Carryover')?.innerText || '') };
    check('X1i', 'Original-order choice, five days missed: "5 DAYS CARRYOVER", Day-1 work kept, never relabelled as today', r.chip === 'TODAY · SAT 26 SEP · 5 DAYS CARRYOVER' && r.day === 1 && /unfinished Mon 21 Sep work/.test(r.banner), r);
    await s.close();
  }
  {
    const st = JSON.parse(JSON.stringify(partial)); st.day = 6; st.doneDays = [1, 2, 3, 4, 5];
    const s = await open({ time: '2026-09-22T09:00:00+03:00', state: st, settle: 1000 });
    const r = { chip: await chipOf(s.page), day: await s.page.evaluate(() => S.day) };
    check('X2', 'Far ahead (Day 6 on Tue 22 Sep): "4 DAYS AHEAD", day never regresses', r.chip === 'TODAY · TUE 22 SEP · 4 DAYS AHEAD' && r.day === 6, r);
    await s.close();
  }
  {
    const s = await open({ time: '2026-09-21T22:30:00Z', timezoneId: 'America/New_York', state: partial, settle: 1000 });
    const r = await chipOf(s.page);
    check('X3', 'Device set to New York (still Mon evening there): Cairo date (Tue 22 Sep) is used', r === 'TODAY · TUE 22 SEP · +4 FROM MON 21', r);
    await s.close();
  }
  {
    // Overnight resume: a question is open at 23:50, the learner comes back after midnight and answers it.
    const s = await open({ time: '2026-09-21T23:50:00+03:00', state: partial, settle: 1000 });
    const { page } = s;
    await toQuestion(page);
    const q = await curQ(page);
    await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(200);
    const before = await chipOf(page);
    await page.clock.runFor(25 * 60 * 1000); await page.waitForTimeout(300);
    const mid = { chip: await chipOf(page), stillQ: await page.evaluate(() => document.querySelectorAll('[data-act="qbank-choice"]').length) };
    await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]')?.click(), q.keys[0]);
    await page.waitForTimeout(500);
    const after = await page.evaluate((id) => ({ rec: !!S.qbank.results[id], same: !!document.querySelector('[data-act="finish-qbank"]') }), q.id);
    check('X4', 'Overnight resume: chip rolls to Tue 22 Sep (1 day carryover while the question is on screen) without yanking the open question; answer recorded', before === 'TODAY · MON 21 SEP' && mid.chip === 'TODAY · TUE 22 SEP · 1 DAY CARRYOVER' && mid.stillQ >= 2 && after.rec && after.same, { before, mid, after });
    check('X4b', 'No page errors across midnight', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── Malformed / old state ──
  const bad = {
    'corrupt JSON': { raw: '{"day":1,"segm' },
    'v14 is a string': { st: Object.assign(JSON.parse(JSON.stringify(partial)), { v14: 'garbage' }) },
    'v14 fields wrong types': { st: Object.assign(JSON.parse(JSON.stringify(partial)), { v14: { schema: 2, ledger: null, pins: 5, vc: 'x', stats: null, recon: 7 } }) },
    'no v12/v13/v14 (v4.1 era)': { st: (() => { const x = JSON.parse(JSON.stringify(partial)); delete x.v12; delete x.v13; delete x.v14; return x; })() },
    'v13 null, v12 evidence not an array': { st: Object.assign(JSON.parse(JSON.stringify(partial)), { v13: null, v12: { evidence: 'bad' } }) },
    'future schema v14': { st: Object.assign(JSON.parse(JSON.stringify(partial)), { v14: { schema: 99, future: true } }) },
  };
  let i = 0;
  for (const [name, b] of Object.entries(bad)) {
    i++;
    const s = await open({ time: '2026-09-22T10:00:00+03:00', state: b.st, localStorage: b.raw ? { intellectuality_v41_launch_state: b.raw } : undefined, settle: 1200 });
    const shell = await s.page.evaluate(() => ({ player: (document.querySelector('#player')?.innerText || '').length > 20, chip: document.querySelector('#v14Calendar')?.textContent || '' }));
    const a = await answerOne(s.page, i % 2 === 0);
    const saved = await s.page.evaluate(() => { try { const x = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state')); return !!(x && x.v14 && typeof x.v14 === 'object' && x.v14.schema === 2); } catch (_) { return false; } });
    check('Y' + i, 'Malformed state (' + name + '): app loads, a question can be answered and saved, no page errors', shell.player && /TODAY/.test(shell.chip) && a.reached && a.recorded && saved && s.log.errors.length === 0, { shell, a, saved, errors: s.log.errors.slice(0, 2) });
    await s.close();
  }

  // ── Rapid taps ──
  {
    const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1100 });
    const { page } = s;
    await toQuestion(page);
    const q = await curQ(page);
    const ev0 = await page.evaluate(() => (S.v12?.evidence || []).length);
    await page.evaluate(() => { for (let i = 0; i < 12; i++) document.querySelector('[data-v14-reveal]')?.click(); });
    await page.waitForTimeout(150);
    await page.evaluate(({ k, w }) => { for (let i = 0; i < 12; i++) { document.querySelector('[data-act="qbank-choice"][data-choice="' + (i % 2 ? w : k) + '"]')?.click(); } }, { k: q.keys[0], w: q.opts.find(x => !q.keys.includes(x)) });
    await page.waitForTimeout(600);
    const r = await page.evaluate((id) => ({ ev: (S.v12?.evidence || []).length, ledger: S.v14.ledger.filter(x => x.q === id || x.id === id).length, result: S.qbank.results[id] && (S.qbank.results[id].correct ?? S.qbank.results[id].ok) }), q.id);
    check('Z1', 'Twelve taps on the gate and twelve alternating option taps count as ONE answer (the first)', r.ev === ev0 + 1 && r.result !== false, { ev0, ...r });
    // double-tap NEXT must not skip a segment
    const seg0 = await page.evaluate(() => nextAction().key);
    await page.evaluate(() => { const b = document.querySelector('[data-act="finish-qbank"]'); b?.click(); b?.click(); });
    await page.waitForTimeout(400);
    const done = await page.evaluate(() => Object.values(S.segments).filter(Boolean).length);
    const seg1 = await page.evaluate(() => nextAction().key);
    check('Z2', 'Double-tap on NEXT advances exactly one step', seg0 !== seg1 && typeof done === 'number', { seg0, seg1 });
    check('Z3', 'No page errors under rapid taps', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── Network ──
  {
    const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 900, commonsDelayMs: 9000 });
    const t = Date.now();
    await toQuestion(s.page);
    const r = await s.page.evaluate(() => ({ primer: !!document.querySelector('.v14Primer'), gate: !!document.querySelector('[data-v14-reveal]'), text: (document.querySelector('.v14Primer')?.innerText || '').length }));
    const ms = Date.now() - t;
    check('W1', 'Image search hanging 9 s: primer text and gate are usable immediately (not blocked on images)', r.primer && r.gate && r.text > 200 && ms < 6000, { ...r, ms });
    await s.close();
  }
  {
    const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 1100 });
    await s.context.setOffline(true);
    const a = await answerOne(s.page, false);
    const persisted = await s.page.evaluate(() => { const x = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state')); return Object.keys(x.errors || {}).length; });
    check('W2', 'Offline mid-session: a wrong answer still opens repair and is saved on the device', a.reached && a.recorded && persisted >= 1 && s.log.errors.length === 0, { a, persisted, errors: s.log.errors.slice(0, 2) });
    await s.close();
  }
  {
    const PNG = bigPng(6000, 6000);
    for (const vp of [{ w: 390, h: 844 }, { w: 820, h: 1180 }]) {
      const s = await open({ time: '2026-09-22T10:00:00+03:00', state: null, settle: 300, viewport: { width: vp.w, height: vp.h }, touch: true });
      await s.context.route(/upload\.wikimedia\.org/, (route) => route.fulfill({ contentType: 'image/png', body: PNG }));
      await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(900);
      await toQuestion(s.page); await s.page.waitForTimeout(1500);
      const r = await s.page.evaluate(() => { const imgs = [...document.querySelectorAll('#player img')].filter(i => i.naturalWidth > 1000); return { big: imgs.length, maxW: Math.max(0, ...imgs.map(i => i.getBoundingClientRect().width)), sw: document.documentElement.scrollWidth, iw: innerWidth }; });
      check('W3-' + vp.w, 'Huge 6000×6000 image at ' + vp.w + 'px: rendered inside the viewport, no horizontal scroll', r.big >= 1 && r.maxW <= r.iw && r.sw <= r.iw + 1, r);
      await s.close();
    }
  }

  // ── Stop-study intelligence ──
  {
    const s = await open({ time: '2026-09-21T20:00:00+03:00', state: partial, settle: 900 });
    const r = await s.page.evaluate(() => { const d = C.days[0]; for (const l of d.lessons) l.segments.forEach((_, i) => (S.segments[segmentKey(d, l, i)] = true)); const bs = dayBossState(d); bs.visual = true; bs.written = true; bs.writtenRevealed = true; for (const e of Object.values(S.errors)) e.resolved = true; save(); render(); const p = document.querySelector('#player'); return { kind: nextAction().kind, stop: /STOP MEDICINE/.test(p.innerText), intel: !!p.querySelector('.v12Stop'), text: p.querySelector('.v12Stop')?.innerText || '', buttons: [...p.querySelectorAll('button')].filter((b) => !b.closest('.rnEntry')).length, rnDoor: p.querySelectorAll('.rnEntry [data-rn-open]').length }; });
    // v17.4: the Renaissance door (a separate organ, docs/RENAISSANCE) sits on this screen with its own single CONTINUE;
    // medicine itself still offers exactly one next button
    check('S1', 'Day evidence green: explicit STOP view with stop-study intelligence and a single next button (plus at most one Renaissance CONTINUE)', r.kind === 'STOP' && r.stop && r.intel && r.buttons === 1 && r.rnDoor <= 1, r);
    await s.close();
  }

  // ── Held-out mock stays sealed after a restore of old state ──
  {
    const s = await open({ time: '2026-09-22T10:00:00+03:00', state: partial, settle: 1000 });
    const r = await s.page.evaluate(() => { const ids = new Set(EHSAN_QBANK.questions.filter(q => q.split !== 'practice').map(q => q.id)); const pinned = Object.values(S.v14.pins || {}).filter(id => ids.has(id)); return { heldOut: ids.size, pinned: pinned.length, primersOnHeld: Object.keys(S.v14.primersSeen || {}).filter(id => ids.has(id)).length }; });
    check('M1', 'No held-out item was ever pinned to a primer/practice slot', r.heldOut > 0 && r.pinned === 0 && r.primersOnHeld === 0, r);
    await s.close();
  }

  // ── Backup file round-trip (Vercel host stand-in on :8790) ──
  {
    const HOST = process.env.HOST_URL || 'http://127.0.0.1:8790/';
    const up = await fetch(HOST + 'login').then(r => r.ok).catch(() => false);
    if (!up) check('B1', 'Backup file round-trip (skipped: host stand-in on :8790 not running)', false, 'start with tests/host_ctl.sh start');
    else {
      const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
      const ctx = await browser.newContext({ acceptDownloads: true });
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
      await p.goto(HOST + 'login?next=/'); await p.waitForTimeout(400);
      await p.evaluate((st) => { localStorage.setItem('intellectuality_v41_launch_state', JSON.stringify(st)); localStorage.setItem('intellectuality_sync_gap_ms', '5'); }, partial);
      const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#exportBtn')]);
      const file = path.join(__dirname, 'out', 'backup_roundtrip.json'); await dl.saveAs(file);
      const j = JSON.parse(fs.readFileSync(file, 'utf8'));
      const okFile = j.kind === 'device-backup' && j.version === 1 && j.day === partial.day && JSON.parse(j.keys.intellectuality_v41_launch_state).xp === partial.xp && !('intellectuality_sync_gap_ms' in j.keys) && /^intellectuality-backup-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename());
      // wipe, put a different state, restore the file
      await p.evaluate(() => { localStorage.clear(); localStorage.setItem('intellectuality_v41_launch_state', JSON.stringify({ day: 9, marker: 'other' })); });
      await p.setInputFiles('#importFile', file);
      await p.waitForTimeout(1600);
      // this browser runs on the real clock: after the restore the app moves the restored Day to today's
      // Cairo course day (v15.2 date truth), so the expected day is the later of the file's day and today's
      const after = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('intellectuality_v41_launch_state')); const b = JSON.parse(localStorage.getItem('intellectuality_state_backup_before_link') || 'null'); const ymd = window.INTELLECTUALITY_V14?.cairoYMD?.(); const todayDay = (C.days || []).filter((d) => d.date <= ymd).map((d) => d.day).pop() || 1; return { day: s.day, todayDay, segs: Object.keys(s.segments || {}).length, xp: s.xp, prev: b && JSON.parse(b.state).marker, url: location.pathname }; });
      check('B1', 'Backup download: one dated JSON with all progress keys (not the gap probe)', okFile, { name: dl.suggestedFilename(), day: j.day, keys: Object.keys(j.keys).length });
      check('B2', 'Restore: progress replaced from the file, previous copy kept as a local backup, back to the course', after.day === Math.max(partial.day, after.todayDay) && after.segs === Object.keys(partial.segments).length && after.xp === partial.xp && after.prev === 'other' && after.url === '/', after);
      // bad file is refused and changes nothing
      await p.goto(HOST + 'login?next=/'); await p.waitForTimeout(300);
      const junk = path.join(__dirname, 'out', 'not_a_backup.json'); fs.writeFileSync(junk, JSON.stringify({ hello: 1 }));
      const beforeBad = await p.evaluate(() => localStorage.getItem('intellectuality_v41_launch_state'));
      await p.setInputFiles('#importFile', junk); await p.waitForTimeout(500);
      const bad = await p.evaluate((b) => ({ same: localStorage.getItem('intellectuality_v41_launch_state') === b, msg: document.querySelector('#bkMsg').innerText }), beforeBad);
      check('B3', 'A file that is not a backup is refused with a message; nothing overwritten', bad.same && /could not be restored/.test(bad.msg), bad);
      check('B4', 'No page errors on the sync/backup page', errs.length === 0, errs.slice(0, 2));
      await browser.close();
    }
  }

  const pass = results.filter(r => r.ok).length;
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'out', 'hostile_test.json'), JSON.stringify({ pass, total: results.length, results }, null, 1));
  console.log('\n' + pass + '/' + results.length + ' hostile checks passed (' + Math.round((Date.now() - t0) / 1000) + 's)');
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
