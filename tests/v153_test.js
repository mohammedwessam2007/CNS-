// v15.3: notes completeness, past-paper badges, written-exam outlines, wrong-picture swap, personal
// pace, offline. Usage: node tests/v153_test.js [out.json]
//   APP_URL defaults to the source tree on :8787. P5 (offline) needs a bundled Vercel build:
//   IX_PICS_MOCK=1 bash tests/host_ctl.sh start  → OFFLINE_URL=http://127.0.0.1:8790/ (default).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { open } = require('./harness');
const results = [];
function check(id, name, ok, detail = '') {
  const d = typeof detail === 'string' ? detail : JSON.stringify(detail);
  results.push({ id, name, ok: !!ok, detail: d });
  console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(5) + name + (d ? '  · ' + d.slice(0, 260) : ''));
}
const NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]';
async function toTeach(page) {
  for (let i = 0; i < 8; i++) { const k = await page.evaluate(() => nextAction().seg?.type); if (k === 'teach') return true; await page.evaluate((sel) => document.querySelector(sel)?.click(), NEXT); await page.waitForTimeout(180); }
  return false;
}

(async () => {
  const t0 = Date.now();
  // ── P6: notes plus integrity (static) ──
  {
    const pub = path.join(__dirname, '..', 'source', 'public');
    const load = (files) => { const ctx = { window: {} }; vm.createContext(ctx); for (const f of files) vm.runInContext(fs.readFileSync(path.join(pub, f), 'utf8'), ctx); return ctx.window.INTELLECTUALITY_LEARN_NOTES; };
    const base = load(['learn-notes-anat-v15.js', 'learn-notes-phys-v15.js', 'learn-notes-hist-v15.js']);
    const all = load(['learn-notes-anat-v15.js', 'learn-notes-phys-v15.js', 'learn-notes-hist-v15.js', 'learn-notes-plus-v15.js']);
    const baseIds = new Map(); for (const c of base.chapters) c.s.forEach((x, i) => baseIds.set(c.id + '#' + i, x.h));
    const ids = []; let kept = 0, added = [], bullets = 0;
    for (const c of all.chapters) for (const x of c.s) { ids.push(x.id); if (baseIds.get(x.id) === x.h) kept++; if (x.added) added.push(x); bullets += x.plus || 0; }
    const complete = added.every((x) => x.h && (x.p || []).length >= 3 && x.why && x.trap && (x.q || []).length === 2 && (x.pic || []).length >= 1);
    check('P6', 'Notes plus: every addition found its section, original section ids unchanged, new sections complete (facts, why, trap, recall, pictures)', !(all.plusMissed || []).length && kept === baseIds.size && new Set(ids).size === ids.length && complete, { missed: all.plusMissed, kept, base: baseIds.size, added: added.length, bullets });
  }

  // ── P1/P2: past-paper badges, chapter tier, written-exam questions on the lecture page ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 1000 });
    const { page } = s;
    await toTeach(page); await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({ kicker: document.querySelector('.v15Kicker')?.innerText || '', hy: document.querySelector('.v15HY')?.innerText || '' }));
    check('P1', 'Lecture shows the chapter exam tier and the past-paper weight of the section (batches from practice items only)', /EXAM TIER [SABC]/.test(r.kicker) && /bank question/.test(r.hy) && /past exams: (19\d|20\d\d)/.test(r.hy), r);
    let written = '';
    for (let i = 0; i < 8 && !written; i++) {
      written = await page.evaluate(() => document.querySelector('.v15Written')?.innerText || '');
      if (!written) { await page.evaluate(() => document.querySelector('[data-act="v15-next"]')?.click()); await page.waitForTimeout(220); }
    }
    check('P2', 'A lecture section carries the written (essay) question the department asks about it', /The written exam asks this section as/.test(written) && written.length > 60, written.slice(0, 200));
    await s.close();
  }
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 1000 });
    const { page } = s;
    await page.evaluate(() => { const d = C.days[0]; for (const l of d.lessons) l.segments.forEach((_, i) => (S.segments[segmentKey(d, l, i)] = true)); dayBossState(d).visual = true; for (const e of Object.values(S.errors)) e.resolved = true; save(); render(); });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('[data-act="boss-written-reveal"]')?.click()); await page.waitForTimeout(400);
    const m = await page.evaluate(() => ({ kind: nextAction().kind, prompt: document.querySelector('.sourcePrompt')?.innerText || '', heads: [...document.querySelectorAll('.v15Model h4')].map((h) => h.innerText), pts: document.querySelectorAll('.v15Model li').length }));
    check('P2b', 'Written boss: after the reveal, a model-answer outline built from the notes (headings + points) sits above the scaffold', m.kind === 'DAY_WRITTEN_BOSS' && m.heads.length >= 1 && m.pts >= 3, m);
    check('P2c', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── P3: wrong picture → another one, remembered across reloads ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 1000 });
    const { page } = s;
    await toTeach(page); await page.waitForTimeout(900);
    const before = await page.evaluate(() => { const f = document.querySelector('#player figure.v15Pic'); return { term: f.dataset.v15Term, key: f.querySelector('.v15Fig')?.dataset.v15Key || '' }; });
    await page.evaluate(() => document.querySelector('#player figure.v15Pic .v15Fig').click()); await page.waitForTimeout(200);
    const btn = await page.evaluate(() => ({ has: !!document.querySelector('.v15Zoom [data-v15-ban]'), h: document.querySelector('.v15Zoom [data-v15-ban]')?.getBoundingClientRect().height || 0 }));
    await page.evaluate(() => document.querySelector('.v15Zoom [data-v15-ban]')?.click()); await page.waitForTimeout(900);
    const after = await page.evaluate((term) => { const f = [...document.querySelectorAll('#player figure.v15Pic')].find((x) => x.dataset.v15Term === term); return { key: f?.querySelector('.v15Fig')?.dataset.v15Key || '', note: f?.querySelector('.v15NoPic')?.innerText || '', ban: S.v15.ban[term] || [], zoom: !!document.querySelector('.v15Zoom') }; }, before.term);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1200);
    const reload = await page.evaluate((term) => { const f = [...document.querySelectorAll('#player figure.v15Pic')].find((x) => x.dataset.v15Term === term); return { key: f?.querySelector('.v15Fig')?.dataset.v15Key || '', ban: S.v15.ban[term] || [] }; }, before.term);
    const bannedFile = before.key.replace(/^exact:/, '');
    check('P3', 'Zoom offers "✗ Wrong picture — show another" (≥ 44 px); tapping it swaps in a different picture and the rejection survives a reload', btn.has && btn.h >= 44 && !after.zoom && after.ban.includes(bannedFile) && (after.key ? after.key !== before.key : !!after.note) && reload.ban.includes(bannedFile) && reload.key !== before.key, { before, after, reload });
    check('P3b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── P4: personal pace ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 1000 });
    const { page } = s;
    const plan0 = await page.evaluate(() => remainingMinutes(day()));
    // twelve steps, each taking twice its planned minutes
    for (let i = 0; i < 12; i++) {
      const m = await page.evaluate(() => { const a = nextAction(); return a.kind === 'SEGMENT' ? a.seg.minutes || 3 : 0; });
      if (!m) break;
      await page.clock.runFor(Math.round(m * 2 * 60000));
      await page.evaluate(() => { const a = nextAction(); if (a.kind === 'SEGMENT') { S.segments[a.key] = true; save(); render(); } });
      await page.waitForTimeout(150);
    }
    const r = await page.evaluate(() => ({ ratio: window.INTELLECTUALITY_PACE(), n: S.v15.pace._all?.n || 0, meta: document.querySelector('#meta')?.textContent || '', remain: remainingMinutes(day()) }));
    check('P4', 'Personal pace: after 8+ timed steps at twice the plan, the pace is ≈ 2× and "minutes remaining" is shown at the learner\'s pace', r.n >= 8 && r.ratio > 1.6 && r.ratio <= 2.2 && /at your pace \(×(1\.[6-9]|2\.[0-2])\)/.test(r.meta), { plan0, ...r });
    check('P4b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }

  // ── P5: offline after one online visit (service worker, bundled build) ──
  {
    const url = process.env.OFFLINE_URL || 'http://127.0.0.1:8790/';
    let s;
    try {
      s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 1200, sw: true, url });
    } catch (e) {
      check('P5', 'Offline (skipped: bundled host on ' + url + ' not running)', false, 'start with IX_PICS_MOCK=1 bash tests/host_ctl.sh start');
      s = null;
    }
    if (s) {
      const { page, context } = s;
      await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready.then(() => true)); await page.waitForTimeout(500);
      await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1000);
      const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
      await toTeach(page); await page.waitForTimeout(1500);
      const online = await page.evaluate(() => [...document.querySelectorAll('#player .v15Fig img')].map((i) => i.getAttribute('src')));
      await context.setOffline(true);
      await page.reload({ waitUntil: 'load' }).catch(() => null); await page.waitForTimeout(2000);
      const off = await page.evaluate(() => ({ title: document.title, learn: !!document.querySelector('.v15Learn'), h: document.querySelector('.v15Sec h3')?.textContent || '', imgs: [...document.querySelectorAll('#player .v15Fig img')].map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })) }));
      check('P5', 'Offline: after one online visit, the app and today\'s lecture open with no network, bundled pictures included', controlled && online.length > 0 && off.learn && !!off.h && off.imgs.length > 0 && off.imgs.every((i) => i.ok && /^\/pics\//.test(i.src)), { controlled, online, off });
      await context.setOffline(false);
      await s.close();
    }
  }

  const pass = results.filter((r) => r.ok).length;
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'out', 'v153_test.json'), JSON.stringify({ pass, total: results.length, results }, null, 1));
  console.log('\n' + pass + '/' + results.length + ' v15.3 checks passed (' + Math.round((Date.now() - t0) / 1000) + 's)');
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
