// Department drawings and the Kasr Al Ainy NEU 205 book figures. Since v18.6 they are ordinary pictures on the site
// (the owner removed the lock, 27 Sep 2026): no key, no link, the same on every device.
// Usage: node tests/dept_figs_test.js [out.json]
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 600))); };
const T = '2026-09-24T10:00:00+03:00';
// the markup LEARN and the MCQ engine produce for a section / an answer's explanation
const inject = ([secId, qid]) => {
  const p = document.getElementById('player');
  p.insertAdjacentHTML('beforeend', '<div class="v15Sec" data-v15-sec="' + secId + '"><div class="v15Head"><h3>t</h3></div><div class="v15Pics"></div><ul class="v15Pts"><li>x</li></ul></div>' + (qid ? '<div class="v16Explain" data-qid="' + qid + '"><div class="v16Row key">k</div></div>' : ''));
};

(async () => {
  // ── D1–D6: a fresh device with nothing stored: the drawings simply show ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500 });
    const all = await s.page.evaluate(async () => {
      const D = window.INTELLECTUALITY_DEPT_FIGS,
        secs = new Set((window.INTELLECTUALITY_LEARN_NOTES?.chapters || []).flatMap((c) => (c.s || []).map((x, i) => x.id || c.id + '#' + i))),
        bad = [], ids = new Set(), books = new Set();
      for (const f of D.figs) {
        if (ids.has(f.id)) bad.push(f.id + ':dup');
        ids.add(f.id);
        for (const x of f.sec || []) if (!secs.has(x)) bad.push(f.id + ':' + x);
        if (!(f.sec || []).length || !f.cap || f.cap.length < 20) bad.push(f.id + ':cap/sec');
        if (f.book) {
          if (books.has(f.book) || !(f.book >= 1 && f.book <= 501)) bad.push(f.id + ':book');
          books.add(f.book);
        }
        const res = await fetch('/dept/' + f.id + '.jpg'), b = new Uint8Array(await res.arrayBuffer());
        if (!res.ok || b.length < 1000 || !(b[0] === 0xff && b[1] === 0xd8)) bad.push(f.id + ':file');
      }
      return { plain: D.plain, n: D.figs.length, book: books.size, secs: new Set(D.figs.flatMap((f) => f.sec)).size, notes: secs.size, nBad: bad.length, bad: bad.slice(0, 8) };
    });
    check('D1', 'The whole set is on the site as ordinary pictures (department drawings + Kasr Al Ainy NEU 205 book figures): every file a JPEG, every drawing placed in a LEARN section that exists and captioned, no book figure twice', all.plain === true && all.n >= 380 && all.book >= 330 && all.secs >= 190 && all.notes >= 250 && all.nBad === 0, all);
    await s.page.evaluate(inject, ['an-submandibular#3', 'EHSAN-ANAT-CAROTID-TRIANGLE-MCQ-7']);
    await s.page.waitForTimeout(1500);
    const r = await s.page.evaluate(() => {
      const sec = document.querySelector('.v15Sec[data-v15-sec="an-submandibular#3"]'), ex = document.querySelector('.v16Explain[data-qid]');
      const imgs = (el) => [...el.querySelectorAll('.ixDept img')].map((i) => ({ w: i.naturalWidth, jpg: /\/dept\/[\w-]+\.jpg$/.test(i.src) }));
      return {
        unlocked: INTELLECTUALITY_DEPT.unlocked(), locks: document.querySelectorAll('.ixDeptLock').length,
        secShown: sec.querySelectorAll('.ixDeptWrap > .ixDeptRow > .ixDept').length, secMore: sec.querySelectorAll('.ixDeptMore .ixDept').length, secImgs: imgs(sec), beforePics: !!sec.querySelector('.ixDeptWrap + .v15Pics'),
        exFig: ex.querySelector('.ixDept')?.dataset.ixDept || null, exImgs: imgs(ex),
      };
    });
    check('D2', 'With no key and no link, a lesson section shows its drawings first (2 open, the rest one tap away), each a real picture; no lock line anywhere', r.unlocked && r.locks === 0 && r.secShown === 2 && r.secMore >= 1 && r.secImgs.length === 2 && r.secImgs.every((i) => i.w > 100 && i.jpg) && r.beforePics, r);
    check('D3', 'After an answer: the one drawing that fits the question is shown (internal jugular vein question → the IJV drawing)', r.exFig === 'nv-ijv' && r.exImgs.length === 1 && r.exImgs[0].w > 100, r);
    // D4: a physiology section opens with the book's figures; its web photo folds behind a tap below them
    await s.page.evaluate(() => document.getElementById('player').insertAdjacentHTML('beforeend', '<div class="v15Sec" data-v15-sec="ph-vestibular#0"><div class="v15Head"><h3>t</h3></div><div class="v15Pics"><figure class="v15Pic" data-v15-done="1"><img alt="web photo"></figure></div><ul class="v15Pts"><li>x</li></ul></div>'));
    await s.page.waitForTimeout(1500);
    const b = await s.page.evaluate(() => {
      const sec = document.querySelector('.v15Sec[data-v15-sec="ph-vestibular#0"]');
      return { lab: sec.querySelector('.ixDeptLab')?.textContent || '', imgs: [...sec.querySelectorAll('.ixDept img')].filter((i) => i.naturalWidth > 100).length, folded: !!sec.querySelector(':scope > .v15Pics > details.ixWebPic:not([open]) figure.v15Pic'), order: !!sec.querySelector(':scope > .ixDeptWrap + .v15Pics') };
    });
    check('D4', 'A physiology section (vestibular hair cells) opens with the Kasr Al Ainy book figures, labelled with the book\'s figure number; the section\'s web photo folds behind a tap below them', /KASR AL AINY BOOK · FIG \d+/.test(b.lab) && b.imgs >= 1 && b.folded && b.order, b);
    // D5: the drawing opens full screen and closes with a tap
    await s.page.click('.v15Sec[data-v15-sec="an-submandibular#3"] .ixDept img');
    const z1 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom img'));
    await s.page.click('.ixDeptZoom');
    const z2 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom'));
    check('D5', 'Tap a drawing → full screen; tap → back', z1 && !z2, { z1, z2 });
    check('D6', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }
  // ── D7–D10: the CNS-levels drill (50 figure items) on a device with nothing stored ──
  {
    const s3 = await open({ v16: true, time: T, state: null, settle: 1500 });
    const d = await s3.page.evaluate(() => {
      const V = INTELLECTUALITY_V16, items = QB.questions.filter((q) => /^DEPT-LEVELS-/.test(q.id));
      const gaps = [];
      for (const q of items) {
        const x = V.explain(q.id), keys = new Set(q.answerKeys), covered = new Set([...Object.keys(x?.opt || {}), ...(x?.also || []).map((a) => a.k)]);
        if (!x || !x.key) { gaps.push(q.id + ':nokey'); continue; }
        for (const o of q.options) if (!keys.has(o.key) && !covered.has(o.key)) gaps.push(q.id + ':' + o.key);
      }
      return { n: items.length, practice: V.counts().practice, explained: V.counts().explained, gaps: gaps.slice(0, 5), nGaps: gaps.length, figs: new Set(items.map((q) => INTELLECTUALITY_DEPT.drillFig(q.id))).size };
    });
    check('D7', 'The 50 figure items (9 department CNS-levels figures + the Nov 2024 paper\'s Section B figure, 5 labels each) are in the practice bank on every device, each explained (key + a reason for every other option), each tied to its figure', d.n === 50 && d.nGaps === 0 && d.explained === d.practice && d.figs === 10, d);
    await s3.page.evaluate(() => {
      const p = document.getElementById('player');
      p.innerHTML = '<div class="stage v16Stage v16Q"><h3 class="v16Stem">CNS level 7 · pons. In the department drawing above, label 3 is</h3><div class="v16Opts"><button class="v16Opt" data-v16="pick" data-qid="DEPT-LEVELS-HIST-MCQ-73" data-choice="a">a</button></div></div>';
    });
    await s3.page.waitForTimeout(1200);
    const q1 = await s3.page.evaluate(() => ({ fig: document.querySelector('.ixDeptQ .ixDept')?.dataset.ixDept || null, before: !!document.querySelector('.ixDeptQ + h3.v16Stem'), ans: !!document.querySelector('.ixDeptAns'), w: document.querySelector('.ixDeptQ img')?.naturalWidth || 0 }));
    check('D8', 'A drill question shows its department figure above the stem BEFORE answering, with the answers hidden', q1.fig === 'cns-level-7' && q1.before && !q1.ans && q1.w > 100, q1);
    await s3.page.evaluate(() => {
      const p = document.getElementById('player');
      p.innerHTML = '<div class="stage v16Stage v16Q"><h3 class="v16Stem">CNS level 7 · pons. In the department drawing above, label 3 is</h3><div class="v16Explain" data-qid="DEPT-LEVELS-HIST-MCQ-73"><div class="v16Row key">e</div></div></div>';
    });
    await s3.page.waitForTimeout(1200);
    const q2 = await s3.page.evaluate(() => ({ fig: document.querySelector('.ixDeptQ .ixDept')?.dataset.ixDept || null, ans: document.querySelector('.ixDeptQ .ixDeptAns')?.textContent || '', inExplain: document.querySelectorAll('.v16Explain .ixDept').length }));
    check('D9', 'After answering, the same figure carries the department answers for all 5 labels (not repeated inside the explanation)', q2.fig === 'cns-level-7' && /1 trigeminal lemniscus/.test(q2.ans) && q2.inExplain === 0, q2);
    check('D10', 'No page errors', s3.log.errors.length === 0, s3.log.errors.slice(0, 2));
    await s3.close();
  }
  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'dept_figs_test.json');
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
