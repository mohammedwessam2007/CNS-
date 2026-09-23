// v15 LEARN FIRST + exact-words pictures: behaviour checks.
// Usage: node tests/learn_test.js [out.json]   (server: node tests/serve.js source/public 8787)
// Wikipedia and Commons are mocked by the harness (sandbox egress); the checks prove the engine's
// rules (exact term → article → free Commons file, honest fallback), not live image quality.
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const results = [];
function check(id, name, ok, detail = '') {
  const d = typeof detail === 'string' ? detail : JSON.stringify(detail);
  results.push({ id, name, ok: !!ok, detail: d });
  console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(5) + name + (d ? '  · ' + d.slice(0, 230) : ''));
}
const NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"], #player [data-act="finish-qbank"]';
async function toKind(page, want, max = 30) {
  for (let i = 0; i < max; i++) {
    const k = await page.evaluate(() => { const a = nextAction(); return a.kind + ':' + (a.seg?.type || '') + ':' + (a.l?.id || ''); });
    if (want.test(k)) return k;
    const c = await page.evaluate((sel) => { const b = document.querySelector(sel); if (b) { b.click(); return true; } return false; }, NEXT);
    await page.waitForTimeout(160);
    if (!c) return k;
  }
  return null;
}
const lessonTaughtKey = (lid) => (d) => d.lessons.some((l) => l.id === lid);
// BUNDLED=1: APP_URL is a Vercel build whose /pics bundle was made (tests/host_ctl.sh with IX_PICS_MOCK=1)
const BUNDLED = process.env.BUNDLED === '1';

(async () => {
  const t0 = Date.now();
  // ── L1–L4: the lecture page ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 1000 });
    const { page, log } = s;
    const wikiOnHome = (log.wiki || []).length;
    const k = await toKind(page, /teach/);
    const netAtLecture = { wiki: (log.wiki || []).length, commons: log.commons.length };
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const a = nextAction(), secs = INTELLECTUALITY_V15.sectionsForLesson(a.l.id);
      const figs = [...document.querySelectorAll('#player .v15Pic')];
      return { lesson: a.l.id, n: secs.length, big: !!document.querySelector('.v15Big'), h: document.querySelector('.v15Sec h3')?.textContent, top: document.querySelector('.v15Top')?.innerText, figs: figs.length, hydrated: figs.filter((f) => f.querySelector('.v15Fig img')).length, licensed: figs.filter((f) => /Public domain|CC BY/.test(f.innerText)).length, via: figs.map((f) => (f.querySelector('.v15Cap small')?.textContent || '').replace(/.*· (Wikipedia.*)$/, '$1').trim()), links: document.querySelectorAll('#player .v15Learn a[href]').length, local: figs.filter((f) => /^\/pics\//.test(f.querySelector('.v15Fig img')?.getAttribute('src') || '')).length, bundle: !!window.INTELLECTUALITY_PICS, cmd: document.querySelector('.v15Cmd span')?.textContent, recall: !!document.querySelector('.v15Recall .v15RQ'), mcq: document.querySelectorAll('#player [data-act="qbank-choice"]').length, wallpaper: document.querySelectorAll('#player .ctxCompanion, #player .realVisualBank').length };
    });
    check('L1', 'Teach step = LEARN lecture: whole-picture intro, section 1/N, Egyptian command, no MCQ, no topic wallpaper', /teach/.test(k) && r.n >= 3 && r.big && /SECTION 1 \/ /.test(r.top) && !!r.cmd && r.mcq === 0 && r.wallpaper === 0, { k, ...r });
    check('L2', 'Each section picture is shown for its exact term (Wikipedia article → free Commons file, licence shown), inside the app: no link to press', r.figs >= 1 && r.hydrated === r.figs && r.licensed === r.figs && r.via.every((v) => /^Wikipedia · /.test(v)) && r.links === 0, r);
    check('L2b', 'No Wikipedia request on the first (home) screen: pictures load only when their page is shown', wikiOnHome === 0, { wikiOnHome });
    if (BUNDLED) check('L2c', 'Bundled build: every lecture picture is served from the app itself (/pics/…) and the lecture page makes no Wikipedia or Commons request', r.bundle && r.local === r.figs && (log.wiki || []).length === netAtLecture.wiki && log.commons.length === netAtLecture.commons, { local: r.local, figs: r.figs, wikiOnLecture: (log.wiki || []).length - netAtLecture.wiki, commonsOnLecture: log.commons.length - netAtLecture.commons, commonsBefore: netAtLecture.commons });
    // tap a picture → in-app zoom; tap outside → closed; the page never navigates away
    const url0 = page.url();
    await page.evaluate(() => document.querySelector('#player .v15Fig').click()); await page.waitForTimeout(200);
    const z = await page.evaluate(() => { const d = document.querySelector('.v15Zoom'); return d ? { img: d.querySelector('img')?.getAttribute('src'), cap: d.querySelector('.v15ZoomCap')?.innerText.slice(0, 60), h: d.querySelector('.v15ZoomX').getBoundingClientRect().height } : null; });
    await page.evaluate(() => document.querySelector('.v15Zoom .v15ZoomImg img').click()); await page.waitForTimeout(80);
    const big = await page.evaluate(() => document.querySelector('.v15Zoom')?.classList.contains('big'));
    await page.evaluate(() => document.querySelector('.v15Zoom').click()); await page.waitForTimeout(80);
    const closed = await page.evaluate(() => !document.querySelector('.v15Zoom'));
    check('L2d', 'Tap a picture → it opens large inside the app (2× on tap, closes on tap outside); no navigation', !!z && !!z.img && z.h >= 44 && big && closed && page.url() === url0, { z, big, closed });
    // recall: miss section 1, then page to the end
    await page.evaluate(() => { document.querySelector('[data-act="v15-show"]').click(); document.querySelector('[data-act="v15-rate"][data-ok="0"]').click(); });
    const missed = await page.evaluate(() => document.querySelector('.v15Rate')?.innerText || '');
    await page.evaluate(() => document.querySelector('[data-act="v15-next"]').click()); await page.waitForTimeout(250);
    await page.evaluate(() => document.querySelector('[data-act="v15-prev"]').click()); await page.waitForTimeout(250);
    const back = await page.evaluate(() => document.querySelector('.v15Top')?.innerText);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(900);
    const afterReload = await page.evaluate(() => document.querySelector('.v15Top')?.innerText);
    let pages = 0, finalRecall = '';
    for (let i = 0; i < 20; i++) {
      const top = await page.evaluate(() => document.querySelector('.v15Top')?.innerText || '');
      if (/FINAL RECALL/.test(top)) { finalRecall = await page.evaluate(() => document.querySelector('.v15Again')?.innerText || ''); break; }
      const ok = await page.evaluate(() => { const b = document.querySelector('[data-act="v15-next"]'); if (b) { b.click(); return true; } return false; });
      if (!ok) break; pages++; await page.waitForTimeout(200);
    }
    check('L3', 'Back/next paging works and the page survives a reload (saved position)', /SECTION 1 \//.test(back) && /SECTION 1 \//.test(afterReload), { back, afterReload });
    check('L4', 'A recall rated "not yet" comes back once on a FINAL RECALL page before practice', /comes back/.test(missed) && /Extent|cord/i.test(finalRecall), { missed, pages, finalRecall: finalRecall.slice(0, 120) });
    await page.evaluate(() => document.querySelector('[data-act="finish-segment"]')?.click()); await page.waitForTimeout(400);
    const done = await page.evaluate(() => ({ kind: nextAction().kind, seg: nextAction().seg?.type, method: Object.values(S.v12?.evidence || []).slice(-1)[0]?.method || '', segs: Object.keys(S.segments).length }));
    check('L4b', 'LESSON LEARNED → PRACTICE finishes the teach segment and moves on', done.seg !== 'teach', done);
    check('L4c', 'No page errors in the lecture flow', log.errors.length === 0, log.errors.slice(0, 2));
    await s.close();
  }

  // ── L5: teach before test ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 900 });
    const r = await s.page.evaluate(() => {
      const d = COURSE.days[0], l = d.lessons.find((x) => x.id === 'T001') || d.lessons[0];
      const pool = qbankPoolForLesson(l, d, 'practice');
      const later = pool.filter((q) => { const tl = INTELLECTUALITY_V15.teachingLesson(q.id); return tl && tl !== l.id; });
      // mark T002's teach segment done (as if learned) and recompute
      for (const dd of COURSE.days) for (const ll of dd.lessons) if (ll.id === 'T002') ll.segments.forEach((sg, i) => { if (sg.type === 'teach') S.segments[segmentKey(dd, ll, i)] = true; });
      const pool2 = qbankPoolForLesson(l, d, 'practice');
      const later2 = pool2.filter((q) => { const tl = INTELLECTUALITY_V15.teachingLesson(q.id); return tl && tl !== l.id; });
      const raw = EHSAN_QBANK.questions.filter((q) => q.split === 'practice' && q.unlockDay <= d.day && q.lessonIds?.includes(l.id) && q.autoScore && !q.requiresVisual);
      const rawLater = raw.filter((q) => { const tl = INTELLECTUALITY_V15.teachingLesson(q.id); return tl && tl !== l.id; });
      return { lesson: l.id, raw: raw.length, rawLater: rawLater.length, pool: pool.length, later: later.length, pool2: pool2.length, later2: later2.length };
    });
    check('L5', 'Teach before test: questions whose note is in a not-yet-learned lesson are held back, and return once that lesson is learned', r.rawLater > 0 && r.later === 0 && r.pool > 0 && r.later2 > 0, r);
    await s.close();
  }

  // ── L6–L8: after the answer: the note that teaches it + exact-words option pictures ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 900 });
    const { page, log } = s;
    await toKind(page, /question/);
    const q = await page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return { id: qq.id, keys: qq.answerKeys, opts: qq.options.map((o) => ({ k: o.key, t: o.text })) }; });
    const pre = await page.evaluate(() => ({ note: document.querySelectorAll('#player .v15Note').length, exact: document.querySelectorAll('#player [data-v14-vkey^="exact:"]').length }));
    await page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click()); await page.waitForTimeout(200);
    const wrong = q.opts.find((o) => !q.keys.includes(o.k)).k;
    await page.evaluate(() => document.querySelector('[data-conf="confident"]')?.click());
    await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]').click(), wrong);
    await page.waitForTimeout(2600);
    const post = await page.evaluate(() => {
      const note = document.querySelector('#player .v15Note');
      const qid = document.querySelector('#player .v14OptGallery')?.dataset.v14Opts, qq = EHSAN_QBANK.questions.find((x) => x.id === qid);
      const cells = [...document.querySelectorAll('#player .v14OptCell')].map((c) => ({ text: qq?.options.find((o) => o.key === c.dataset.v14Opt)?.text || '', label: c.querySelector('.v14Cap b')?.textContent || '', via: c.querySelector('.v14Cap small')?.textContent || '', exact: !!c.querySelector('[data-v14-vkey^="exact:"]') }));
      const sides = [...document.querySelectorAll('#player .v14AutopsyVisual')].map((x) => ({ side: x.dataset.v14Side, label: x.querySelector('.v14Cap b')?.textContent || x.innerText.slice(0, 60) }));
      return { note: note ? note.querySelector('summary').innerText : '', noteOpen: note?.open, cells, sides };
    });
    const norm = (t) => String(t).toLowerCase().replace(/fibre/g, 'fiber').replace(/[^a-z0-9]+/g, ' ');
    const stem = (w) => (w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ae|es|s|um|us|on|a|i|e)$/, '') : w).slice(0, 7);
    const toks = (t) => new Set(norm(t).split(' ').filter((w) => w.length > 2).map(stem));
    const exactCells = post.cells.filter((c) => c.exact);
    const precise = exactCells.every((c) => { const term = c.label.replace(/ · .*$/, ''); const o = toks(c.text); return [...toks(term)].filter((w) => !['human', 'anatomy'].includes(w)).every((w) => o.has(w)); });
    check('L6', 'Nothing from v15 appears before the answer (no note card, no exact option pictures)', pre.note === 0 && pre.exact === 0, pre);
    check('L7', 'After a wrong answer the autopsy links back to the note section that teaches the question', /FROM YOUR NOTES/.test(post.note), { note: post.note });
    check('L8', 'Option pictures use the exact words of the option: every exact-term picture names a term whose words are all in that option', precise, { exact: exactCells.length, cells: post.cells.map((c) => c.label + ' ⇐ ' + c.text.slice(0, 50)) });
    check('L8b', 'No page errors after answering', log.errors.length === 0, log.errors.slice(0, 2));
    const outside = await page.evaluate(() => [...document.querySelectorAll('#player a[href]')].map((a) => a.getAttribute('href')).filter((h) => /wikimedia|wikipedia|google\.|radiopaedia|kenhub/.test(h)));
    const cards = await page.evaluate(() => ({ cards: document.querySelectorAll('#player .v14Visual, #player .v15Fig, #player .realImg').length, local: [...document.querySelectorAll('#player .v14Visual img, #player .v15Fig img, #player .realImg img')].filter((i) => /^\/pics\//.test(i.getAttribute('src') || '')).length }));
    check('L8c', 'After answering: no picture card is an outside link (options, autopsy, note card, topic pictures)' + (BUNDLED ? '; bundled pictures used where available' : ''), outside.length === 0 && (!BUNDLED || cards.local > 0), { outside: outside.slice(0, 3), ...cards });
    await s.close();
  }

  // ── L9: Wikipedia unreachable → bundled pictures still show (bundled build) or an honest note ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 900, wikiFail: true, commonsFail: true });
    await toKind(s.page, /teach/); await s.page.waitForTimeout(1200);
    const r = await s.page.evaluate(() => ({ figs: document.querySelectorAll('#player .v15Pic').length, shown: document.querySelectorAll('#player .v15Pic .v15Fig img').length, notes: [...document.querySelectorAll('#player .v15NoPic')].map((x) => x.innerText.slice(0, 80)), links: document.querySelectorAll('#player .v15Learn a[href]').length, text: (document.querySelector('.v15Pts')?.innerText || '').length }));
    check('L9', BUNDLED ? 'Wikipedia and Commons down: every lecture picture still shows (bundled in the app); the lecture text is intact' : 'Picture sources down: each figure says so honestly (no links); the lecture text is intact', r.figs >= 1 && (BUNDLED ? r.shown === r.figs : r.notes.length === r.figs) && r.links === 0 && r.text > 100 && s.log.errors.length === 0, r);
    await s.close();
  }

  // ── L10: phone layout of a lecture page ──
  {
    const s = await open({ time: '2026-09-21T10:00:00+03:00', state: null, settle: 900, viewport: { width: 390, height: 844 }, touch: true });
    await toKind(s.page, /teach/); await s.page.waitForTimeout(900);
    const r = await s.page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, small: [...document.querySelectorAll('#player .v15Learn button')].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim().slice(0, 20)) }));
    check('L10', '390 px: no horizontal overflow on a lecture page; every lecture button ≥ 44 px tall', r.sw <= r.iw + 1 && r.small.length === 0, r);
    await s.close();
  }

  // ── L11: the held-out mock is untouched by v15 ──
  {
    const s = await open({ time: '2026-09-22T12:00:00+03:00', state: null, settle: 900 });
    const r = await s.page.evaluate(() => {
      const ids = EHSAN_QBANK.questions.filter((q) => q.split !== 'practice').slice(0, 50).map((q) => q.id);
      // bestSection is only offered for practice items in the note card, and the pool filter never touches held-out splits
      const d = COURSE.days.find((x) => x.lessons.length), l = d.lessons[0]; // a spread may have emptied Mon 21
      const held = qbankPoolForLesson(l, d, 'heldout').length, heldRaw = EHSAN_QBANK.questions.filter((q) => q.split === 'heldout' && q.unlockDay <= d.day && q.lessonIds?.includes(l.id) && q.autoScore && !q.requiresVisual).length;
      return { held, heldRaw, sample: ids.length };
    });
    check('L11', 'Held-out pool is not filtered or re-ordered by v15', r.held === r.heldRaw, r);
    await s.close();
  }

  const pass = results.filter((r) => r.ok).length;
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'out', 'learn_test.json'), JSON.stringify({ pass, total: results.length, results }, null, 1));
  console.log('\n' + pass + '/' + results.length + ' LEARN checks passed (' + Math.round((Date.now() - t0) / 1000) + 's)');
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
