// Department drawings, the Kasr Al Ainy NEU 205 book figures and (v18.7) Dr Sameh Doss's labelled drawings. Since v18.6 they
// are ordinary pictures on the site (the owner removed the lock, 27 Sep 2026): no key, no link, the same on every device.
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
        bad = [], ids = new Set(), books = new Set(), sameh = [];
      for (const f of D.figs) {
        if (ids.has(f.id)) bad.push(f.id + ':dup');
        ids.add(f.id);
        for (const x of f.sec || []) if (!secs.has(x)) bad.push(f.id + ':' + x);
        if (!(f.sec || []).length || !f.cap || f.cap.length < 20) bad.push(f.id + ':cap/sec');
        if (f.book) {
          if (books.has(f.book) || !(f.book >= 1 && f.book <= 501)) bad.push(f.id + ':book');
          books.add(f.book);
        }
        if (f.sameh) {
          sameh.push(f);
          if (!(f.sameh >= 1 && f.sameh <= 283) || !/^sd-\d{3}[a-h]?$/.test(f.id) || !f.sc || f.sc.length !== f.sec.length || f.book) bad.push(f.id + ':sameh');
          if (!(f.w >= 150 && f.w <= 1100 && f.h >= 150 && f.h <= 1300)) bad.push(f.id + ':size');
        }
        const res = await fetch('/dept/' + f.id + '.jpg'), b = new Uint8Array(await res.arrayBuffer());
        if (!res.ok || b.length < 1000 || !(b[0] === 0xff && b[1] === 0xd8)) bad.push(f.id + ':file');
      }
      return { plain: D.plain, n: D.figs.length, book: books.size, sameh: sameh.length, samehPages: new Set(sameh.map((f) => f.sameh)).size, secs: new Set(D.figs.flatMap((f) => f.sec)).size, notes: secs.size, nBad: bad.length, bad: bad.slice(0, 8) };
    });
    check('D1', 'The whole set is on the site as ordinary pictures (department drawings + Kasr Al Ainy NEU 205 book figures + Dr Sameh Doss\'s labelled drawings): every file a JPEG, every drawing placed in a LEARN section that exists and captioned, no book figure twice, every Sameh drawing from a notebook page 1-283 with a relevance score per placement', all.plain === true && all.n >= 860 && all.book >= 330 && all.sameh >= 480 && all.samehPages >= 270 && all.secs >= 190 && all.notes >= 250 && all.nBad === 0, all);
    await s.page.evaluate(inject, ['an-submandibular#3', 'EHSAN-ANAT-CAROTID-TRIANGLE-MCQ-7']);
    await s.page.waitForTimeout(1500);
    const r = await s.page.evaluate(() => {
      const sec = document.querySelector('.v15Sec[data-v15-sec="an-submandibular#3"]'), ex = document.querySelector('.v16Explain[data-qid]');
      const imgs = (el) => [...el.querySelectorAll('.ixDept img')].map((i) => ({ w: i.naturalWidth, jpg: /\/dept\/[\w-]+\.jpg$/.test(i.src) }));
      return {
        unlocked: INTELLECTUALITY_DEPT.unlocked(), locks: document.querySelectorAll('.ixDeptLock').length,
        secShown: sec.querySelectorAll('.ixDeptWrap > .ixDeptRow > .ixDept').length, secMore: sec.querySelectorAll('.ixDeptMore .ixDept').length, secImgs: imgs(sec), beforePics: !!sec.querySelector('.ixDeptWrap + .v15Pics'),
        exPicks: INTELLECTUALITY_DEPT.pickFor(ex.dataset.qid).map((id) => window.INTELLECTUALITY_DEPT_FIGS.figs.find((f) => f.id === id).cap), exCards: ex.querySelectorAll('.ixDept').length, exOpen: ex.querySelectorAll('.ixDeptWrap > .ixDeptRow > .ixDept').length, exImgs: imgs(ex),
      };
    });
    check('D2', 'With no key and no link, a lesson section shows its drawings first (2 open, the rest one tap away), each a real picture; no lock line anywhere', r.unlocked && r.locks === 0 && r.secShown === 2 && r.secMore >= 1 && r.secImgs.length === 2 && r.secImgs.every((i) => i.w > 100 && i.jpg) && r.beforePics, r);
    check('D3', 'After an answer: the drawings that fit the question are shown, best first, at most three and two open (internal jugular vein question → drawings that show the internal jugular vein and the carotid sheath)', r.exPicks.length >= 1 && r.exPicks.every((c) => /internal jugular|carotid sheath/i.test(c)) && r.exPicks.length <= 3 && r.exCards === r.exPicks.length && r.exOpen <= 2 && r.exImgs.length >= 1 && r.exImgs.every((i) => i.w > 100), r);
    // D4: a physiology section opens with the book's figures; its web photo folds behind a tap below them
    await s.page.evaluate(() => document.getElementById('player').insertAdjacentHTML('beforeend', '<div class="v15Sec" data-v15-sec="ph-vestibular#0"><div class="v15Head"><h3>t</h3></div><div class="v15Pics"><figure class="v15Pic" data-v15-done="1"><img alt="web photo"></figure></div><ul class="v15Pts"><li>x</li></ul></div>'));
    await s.page.waitForTimeout(1500);
    const b = await s.page.evaluate(() => {
      const sec = document.querySelector('.v15Sec[data-v15-sec="ph-vestibular#0"]');
      return { lab: sec.querySelector('.ixDeptLab')?.textContent || '', imgs: [...sec.querySelectorAll('.ixDept img')].filter((i) => i.naturalWidth > 100).length, folded: !!sec.querySelector(':scope > .v15Pics > details.ixWebPic:not([open]) figure.v15Pic'), order: !!sec.querySelector(':scope > .ixDeptWrap + .v15Pics') };
    });
    check('D4', 'A physiology section (vestibular hair cells) opens with the Kasr Al Ainy book figures, labelled with the book\'s figure number; the section\'s web photo folds behind a tap below them', /KASR AL AINY BOOK · FIG \d+/.test(b.lab) && b.imgs >= 1 && b.folded && b.order, b);
    // D5 (v18.8 viewer): tap a drawing → full screen; tap the drawing or ＋ to magnify (and drag to move); ✕ or Esc closes
    await s.page.click('.v15Sec[data-v15-sec="an-submandibular#3"] .ixDept img');
    const z1 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom img'));
    const w0 = await s.page.evaluate(() => document.querySelector('.ixDeptZoom img').getBoundingClientRect().width);
    await s.page.click('.ixDeptZoom [data-ixz="in"]');
    const w1 = await s.page.evaluate(() => document.querySelector('.ixDeptZoom img').getBoundingClientRect().width);
    await s.page.click('.ixDeptZoom [data-ixz="close"]');
    const z2 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom') || document.documentElement.classList.contains('ixDZOpen'));
    await s.page.click('.v15Sec[data-v15-sec="an-submandibular#3"] .ixDept img');
    await s.page.keyboard.press('Escape');
    const z3 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom'));
    check('D5', 'Tap a drawing → full screen; ＋ magnifies it; ✕ and Esc close it', z1 && w1 > w0 * 1.5 && !z2 && !z3, { z1, w0, w1, z2, z3 });
    check('D6', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }
  // ── D11–D16: Dr Sameh Doss's labelled drawings, in the lessons and in the answers ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500, viewport: { width: 390, height: 844 }, touch: true });
    const m = await s.page.evaluate(() => {
      const D = window.INTELLECTUALITY_DEPT_FIGS, QB = window.EHSAN_QBANK.questions, X = window.INTELLECTUALITY_DEPT;
      const sameh = D.figs.filter((f) => f.sameh), inLesson = new Set(sameh.flatMap((f) => f.sec.map(() => f.id)));
      const picks = new Map(QB.filter((q) => q.split === 'practice').map((q) => [q.id, X.pickFor(q.id)]));
      const usedSameh = new Set([...picks.values()].flat().filter((i) => /^sd-/.test(i)));
      const find = (frag) => QB.find((q) => q.split === 'practice' && q.stem.includes(frag));
      const spot = {};
      for (const [k, frag] of Object.entries({ abducent: 'Lateral rectus muscle of the eye is supplied by', fossa: 'interpeduncular fossa contain', ventricle: 'Concerning the lateral ventricle, choose one correct answer', rln: 'Regarding the left recurrent laryngeal nerve' })) { const q = find(frag); spot[k] = q ? X.pickFor(q.id) : null; }
      const none = ['Nissl bodies', 'Ependymal cells', 'Information is carried away from the neuron cell body'].map((f) => { const q = find(f); return q ? X.pickFor(q.id) : null; });
      const sectionsOf = (id) => D.figs.find((f) => f.id === id).sec;
      return {
        nSameh: sameh.length, inLesson: inLesson.size, practice: picks.size, withFig: [...picks.values()].filter((a) => a.length).length, withSameh: [...picks.values()].filter((a) => a.some((i) => /^sd-/.test(i))).length,
        usedSameh: usedSameh.size, spot, none, maxPer: Math.max(...[...picks.values()].map((a) => a.length)), dupInPick: [...picks.values()].some((a) => new Set(a).size !== a.length),
        secAbducent: sectionsOf('sd-080a'), ventSec: X.inSection('an-lateral-ventricle#1').filter((i) => /^sd-/.test(i)).length,
      };
    });
    check('D11', 'Every one of the 490 Sameh drawings is in at least one LEARN section', m.nSameh >= 480 && m.inLesson === m.nSameh, m);
    check('D12', 'In the answers: most practice questions get a fitting drawing (>= 700 of 1061), over 400 of them one of Dr Sameh Doss\'s, at most three per answer, never the same drawing twice, and 220+ of his drawings are the answer to some question', m.practice >= 1000 && m.withFig >= 700 && m.withSameh >= 400 && m.maxPer <= 3 && !m.dupInPick && m.usedSameh >= 220, m);
    check('D13', 'The right drawing for the right question (cranial nerve VI → the abducent nerve drawing; interpeduncular fossa → its drawing; lateral ventricle → ventricle drawings; left recurrent laryngeal nerve → the recurrent nerve drawing)', m.spot.abducent?.[0] === 'sd-080a' && m.spot.fossa?.[0] === 'sd-216b' && m.spot.ventricle?.some((i) => /^sd-(278|196a|191[abc])$/.test(i)) && m.spot.rln?.[0] === 'sd-138b', m.spot);
    check('D14', 'No picture is forced onto a question it does not explain (Nissl bodies, ependymal cells, axon: none)', m.none.every((a) => Array.isArray(a) && a.length === 0), m.none);
    // D17 (v18.8): matching by meaning, not only the same words. These questions never name the structure the drawing
    // shows (or name it another way): a facial palsy and the masseter (a muscle of mastication, mandibular nerve);
    // "Purkinje cells" and the cerebellar cortex; tabes dorsalis and the dorsal columns; a deaf child and the organ of Corti.
    const u = await s.page.evaluate(() => {
      const QB = window.EHSAN_QBANK.questions, X = window.INTELLECTUALITY_DEPT, C = window.INTELLECTUALITY_FIG_CONCEPTS;
      const caps = (frag) => { const q = QB.find((x) => x.split === 'practice' && x.stem.includes(frag)); return q ? X.pickFor(q.id).map((id) => window.INTELLECTUALITY_DEPT_FIGS.figs.find((f) => f.id === id).cap.toLowerCase()) : null; };
      const has = (t, w) => C.tokens(t).has(w);
      return {
        masseter: caps('wakes up with a facial nerve'), purkinje: caps('Purkinje cells are found in'), tabes: caps('Tabes dorsalis is'), deaf: caps('Cochlear implant was recommended'),
        cn6: has('paralysis of CN VI', 'abduce'), lr: has('lateral rectus palsy', 'abduce'), pica: has('PICA occlusion', 'cerebe'), plural: has('the nuclei', 'nucleu') && has('fibers', 'fibre'), horner: has("Horner's syndrome", 'sympat'),
      };
    });
    check('D17', 'Matching by meaning: a nerve number, a muscle, an abbreviation, a syndrome or a plural finds the drawing of what it means (facial palsy → the masseter/mastication drawing; Purkinje cells → the cerebellum; tabes dorsalis → the dorsal columns; a deaf child → the cochlea)',
      u.masseter?.[0]?.includes('masseter') && u.purkinje?.[0]?.includes('cerebell') && u.tabes?.[0] && /gracil|dorsal column|posterior column/.test(u.tabes[0]) && u.deaf?.[0]?.includes('cochle') && u.cn6 && u.lr && u.pica && u.plural && u.horner, u);
    // rendered: a lesson section and an answer on a phone-size screen, labelled as Dr Sameh Doss's, all pictures load
    await s.page.evaluate(() => {
      const qid = window.EHSAN_QBANK.questions.find((q) => q.stem.includes('Lateral rectus muscle of the eye is supplied by')).id;
      document.getElementById('player').insertAdjacentHTML('beforeend', '<div class="v15Sec" data-v15-sec="an-lateral-ventricle#1"><div class="v15Head"><h3>t</h3></div><div class="v15Pics"></div><ul class="v15Pts"><li>x</li></ul></div><div class="v16Explain" data-qid="' + qid + '"><div class="v16Row key">k</div></div>');
    });
    await s.page.waitForTimeout(2000);
    const r = await s.page.evaluate(() => {
      const sec = document.querySelector('.v15Sec[data-v15-sec="an-lateral-ventricle#1"]'), ex = document.querySelector('.v16Explain');
      const ok = (el) => [...el.querySelectorAll('.ixDeptWrap > .ixDeptRow .ixDept img')].map((i) => i.naturalWidth);
      const open = sec.querySelector('.ixDeptMore');
      return { secLab: [...sec.querySelectorAll('.ixDeptWrap > .ixDeptRow .ixDeptLab')].map((l) => l.textContent), secW: ok(sec), exLab: [...ex.querySelectorAll('.ixDeptLab')].map((l) => l.textContent), exW: ok(ex), more: !!open, overflowX: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    check('D15', 'On a phone-size screen: the lesson section and the answer show Dr Sameh Doss\'s drawings, labelled with his name, every picture loads, and the page does not scroll sideways', r.secLab.length === 2 && r.secLab.every((t) => /DR SAMEH DOSS/.test(t)) && r.secW.every((w) => w > 150) && r.exLab.length >= 1 && /DR SAMEH DOSS/.test(r.exLab[0]) && r.exW.every((w) => w > 150) && r.more && !r.overflowX, r);
    // the folded drawings load when opened
    await s.page.evaluate(() => document.querySelector('.v15Sec .ixDeptMore summary').click());
    await s.page.waitForTimeout(1500);
    const f = await s.page.evaluate(() => [...document.querySelectorAll('.v15Sec .ixDeptMore .ixDept img')].map((i) => i.naturalWidth));
    check('D16', 'The "more drawings" fold opens and its pictures load; no page errors', f.length >= 1 && f.every((w) => w > 150) && s.log.errors.length === 0, { f, errors: s.log.errors.slice(0, 2) });
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
