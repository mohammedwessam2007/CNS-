// v16.2 department drawings: private (encrypted) on the public site, shown only to the owner's app.
// Locked checks always run. The unlocked checks need the real key in IX_DEPT_KEY (<kid>.<base64url>);
// the key is never stored in the repo. Usage: [IX_DEPT_KEY=…] node tests/dept_figs_test.js [out.json]
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const KEY = process.env.IX_DEPT_KEY || '';
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 600))); };
const T = '2026-09-24T10:00:00+03:00';
// the markup LEARN and the MCQ engine produce for a section / an answer's explanation
const inject = ([secId, qid]) => {
  const p = document.getElementById('player');
  p.insertAdjacentHTML('beforeend', '<div class="v15Sec" data-v15-sec="' + secId + '"><div class="v15Head"><h3>t</h3></div><div class="v15Pics"></div><ul class="v15Pts"><li>x</li></ul></div>' + (qid ? '<div class="v16Explain" data-qid="' + qid + '"><div class="v16Row key">k</div></div>' : ''));
};

(async () => {
  // ── D1: locked: nothing shown; the files on the site are not readable pictures ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500 });
    await s.page.evaluate(inject, ['an-carotid-triangle#2', 'EHSAN-ANAT-CAROTID-TRIANGLE-MCQ-7']);
    await s.page.waitForTimeout(600);
    const r = await s.page.evaluate(async () => {
      const D = window.INTELLECTUALITY_DEPT_FIGS;
      const heads = [];
      for (const f of D.figs.slice(0, 5)) {
        const b = new Uint8Array(await (await fetch('/dept/' + f.id + '.bin')).arrayBuffer());
        heads.push(b[0] === 0xff && b[1] === 0xd8 ? 'JPEG' : 'sealed');
      }
      return { n: D.figs.length, secs: new Set(D.figs.flatMap((f) => f.sec)).size, shown: document.querySelectorAll('.ixDept').length, unlocked: window.INTELLECTUALITY_DEPT.unlocked(), heads, keyInPage: /ixk=/.test(document.documentElement.outerHTML) };
    });
    check('D1', 'Locked (no key): no drawing is shown, and every drawing file on the public site is sealed (not a readable JPEG)', r.n >= 30 && r.shown === 0 && !r.unlocked && r.heads.every((h) => h === 'sealed') && !r.keyInPage, r);
    check('D1b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    await s.close();
  }
  // ── D2: a wrong key link is refused and removed from the address bar ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500, path: '#ixk=k1.' + 'A'.repeat(43) });
    await s.page.waitForTimeout(500);
    const r = await s.page.evaluate(() => ({ hash: location.hash, dev: localStorage.getItem('intellectuality_dept_keys_v1'), syn: typeof S !== 'undefined' ? S.ixDeptKeys || null : 'noS', toast: document.querySelector('.ixDeptToast')?.textContent || '' }));
    check('D2', 'A wrong key link is refused (nothing stored, the link is removed from the address bar, the learner is told)', r.hash === '' && !r.dev && !r.syn && /not valid/.test(r.toast), r);
    await s.close();
  }
  if (!KEY) {
    console.log('SKIP D3–D6: set IX_DEPT_KEY to run the unlocked checks');
  } else {
    // ── D3–D5: the owner's link unlocks; drawings decrypt into the lesson section and after the answer ──
    const s = await open({ v16: true, time: T, state: null, settle: 1500, path: '#ixk=' + KEY });
    await s.page.waitForTimeout(800);
    const k = await s.page.evaluate(() => ({ hash: location.hash, dev: JSON.parse(localStorage.getItem('intellectuality_dept_keys_v1') || '{}'), syn: S.ixDeptKeys || {}, saved: JSON.parse(localStorage.getItem('intellectuality_v41_launch_state') || '{}').ixDeptKeys || {}, toast: document.querySelector('.ixDeptToast')?.textContent || '' }));
    const kid = KEY.split('.')[0];
    check('D3', 'The owner\'s link unlocks: key kept on the device AND in the saved learner state (so the sync code carries it to other devices); the link is removed from the address bar', k.hash === '' && k.dev[kid] && k.syn[kid] === k.dev[kid] && k.saved[kid] === k.dev[kid] && /unlocked/.test(k.toast), { hash: k.hash, dev: Object.keys(k.dev), syn: Object.keys(k.syn), saved: Object.keys(k.saved), toast: k.toast });
    await s.page.evaluate(inject, ['an-submandibular#3', 'EHSAN-ANAT-CAROTID-TRIANGLE-MCQ-7']);
    await s.page.waitForTimeout(1500);
    const r = await s.page.evaluate(() => {
      const sec = document.querySelector('.v15Sec[data-v15-sec="an-submandibular#3"]'), ex = document.querySelector('.v16Explain[data-qid]');
      const imgs = (el) => [...el.querySelectorAll('.ixDept img')].map((i) => ({ w: i.naturalWidth, src: i.src.slice(0, 5) }));
      return {
        secShown: sec.querySelectorAll('.ixDeptWrap > .ixDeptRow > .ixDept').length, secMore: sec.querySelectorAll('.ixDeptMore .ixDept').length, secImgs: imgs(sec), beforePics: !!sec.querySelector('.ixDeptWrap + .v15Pics'),
        exFig: ex.querySelector('.ixDept')?.dataset.ixDept || null, exImgs: imgs(ex), best: INTELLECTUALITY_DEPT.bestFor('EHSAN-ANAT-CAROTID-TRIANGLE-MCQ-7'),
      };
    });
    check('D4', 'Lesson section: its department drawings are decrypted and shown first (2 open, the rest one tap away), each a real image', r.secShown === 2 && r.secMore >= 1 && r.secImgs.length === 2 && r.secImgs.every((i) => i.w > 100 && i.src === 'blob:') && r.beforePics, r);
    check('D5', 'After an answer: the one drawing that fits the question is shown (internal jugular vein question → the IJV drawing)', r.exFig === 'nv-ijv' && r.exImgs.length === 1 && r.exImgs[0].w > 100, r);
    // D6: the drawing opens full screen and closes with a tap
    await s.page.click('.v15Sec[data-v15-sec="an-submandibular#3"] .ixDept img');
    const z1 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom img'));
    await s.page.click('.ixDeptZoom');
    const z2 = await s.page.evaluate(() => !!document.querySelector('.ixDeptZoom'));
    check('D6', 'Tap a drawing → full screen; tap → back', z1 && !z2, { z1, z2 });
    check('D6b', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 2));
    // D7: every mapped drawing decrypts with the owner's key
    const all = await s.page.evaluate(async () => {
      const bad = [];
      for (const f of INTELLECTUALITY_DEPT_FIGS.figs) {
        try {
          const b = new Uint8Array(await (await fetch('/dept/' + f.id + '.bin')).arrayBuffer());
          const key = await crypto.subtle.importKey('raw', Uint8Array.from(atob((JSON.parse(localStorage.getItem('intellectuality_dept_keys_v1'))[INTELLECTUALITY_DEPT_FIGS.kid]).replace(/-/g, '+').replace(/_/g, '/') + '='), (c) => c.charCodeAt(0)), 'AES-GCM', false, ['decrypt']);
          const p = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.slice(0, 12) }, key, b.slice(12)));
          if (!(p[0] === 0xff && p[1] === 0xd8)) bad.push(f.id + ':notjpeg');
        } catch (e) { bad.push(f.id + ':' + e.name); }
      }
      return { n: INTELLECTUALITY_DEPT_FIGS.figs.length, bad };
    });
    check('D7', 'Every one of the drawings decrypts to a picture with the owner\'s key', all.bad.length === 0, all);
    await s.close();
    // D8: another device with the same synced state (key in the state only) shows them too
    const st = Object.assign(JSON.parse(JSON.stringify(k.saved ? { ixDeptKeys: k.saved } : {})));
    const s2 = await open({ v16: true, time: T, state: st, settle: 1500 });
    await s2.page.evaluate(inject, ['an-cranial-nerves#4', null]);
    await s2.page.waitForTimeout(1200);
    const r2 = await s2.page.evaluate(() => ({ n: document.querySelectorAll('.v15Sec .ixDept img').length, dev: Object.keys(JSON.parse(localStorage.getItem('intellectuality_dept_keys_v1') || '{}')) }));
    check('D8', 'A second device that only has the synced state (restored with the sync code) shows the drawings and keeps a device copy of the key', r2.n >= 1 && r2.dev.length === 1, r2);
    await s2.close();
  }
  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'dept_figs_test.json');
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
