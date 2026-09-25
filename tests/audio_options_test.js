// v17.2 commute mode + read-aloud voice are opt-in: hidden and silent until switched on; best device voice when on.
// Usage: node tests/audio_options_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const { open, tick } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 700))); };
const SUN = '2026-09-27T09:00:00+03:00'; // a drive day (Sunday)

// a fake speech engine with the kinds of voices an iPad has: a novelty voice, a compact default, a Premium one, a non-English one
function fakeSpeech() {
  const VOICES = [
    { name: 'Albert', lang: 'en-US', voiceURI: 'com.apple.speech.synthesis.voice.Albert', default: false },
    { name: 'Samantha', lang: 'en-US', voiceURI: 'com.apple.voice.compact.en-US.Samantha', default: true },
    { name: 'Ava (Premium)', lang: 'en-US', voiceURI: 'com.apple.voice.premium.en-US.Ava', default: false },
    { name: 'Majed', lang: 'ar-001', voiceURI: 'com.apple.voice.compact.ar-001.Maged', default: false },
  ];
  window.__spoken = [];
  window.__cancels = 0;
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.rate = 1; this.pitch = 1; this.voice = null; } };
  // ?late: the list starts empty and fills later, as on iPad Safari
  let list = /late/.test(location.search) ? [] : VOICES.slice();
  window.__ssl = [];
  window.__fillVoices = () => { list = VOICES.slice(); window.__ssl.forEach((f) => f()); };
  const ss = { speaking: false, getVoices: () => list.slice(), cancel() { window.__cancels++; }, addEventListener(t, f) { if (t === 'voiceschanged') window.__ssl.push(f); }, speak(u) { window.__spoken.push({ text: String(u.text).slice(0, 80), voice: u.voice && u.voice.name, rate: u.rate }); setTimeout(() => u.onend && u.onend(), 5); } };
  Object.defineProperty(window, 'speechSynthesis', { value: ss, configurable: true });
  window.visible = (sel) => [...document.querySelectorAll(sel)].some((el) => el.offsetParent !== null && getComputedStyle(el).display !== 'none');
}

(async () => {
  {
    // an old save that was left in commute mode
    const s = await open({ v16: true, time: SUN, state: null, settle: 1500, init: fakeSpeech, localStorage: {} });
    const p = s.page;
    const a1 = await p.evaluate(() => {
      // the professor feed's read-aloud button, exactly as the app writes it
      const host = document.createElement('div');
      host.id = 'ixTestProf';
      host.innerHTML = '<button class="primary wide" data-prof-speak="T001">🔊 PROFESSOR · READ IT TO ME</button>';
      document.body.appendChild(host);
      return { weekday: day().weekday, audio: S.audio, commute: S.commute, kind: nextAction().kind, speak: visible('[data-prof-speak]'), label: document.querySelector('#commuteBtn').textContent };
    });
    check('A1', 'Fresh start on a drive day: commute mode is OFF, the professor\'s robot read-aloud button is hidden, and the app never routes to the commute screen', a1.weekday === 'Sunday' && a1.audio && a1.audio.commute === false && !a1.commute && a1.kind !== 'COMMUTE' && !a1.speak && /OFF/.test(a1.label), a1);
    const a2 = await p.evaluate(() => { S.commute = true; const k = nextAction().kind; speechSynthesis.speak(new SpeechSynthesisUtterance('should stay silent')); return { k, commute: S.commute, spoken: window.__spoken.length }; });
    check('A2', 'While off, nothing can switch the commute screen on or make the device speak', a2.k !== 'COMMUTE' && a2.commute === false && a2.spoken === 0, a2);
    // A3: Study mode → Commute mode: one tap turns it on and opens the commute screen with a voice picker
    await p.click('#toolsBtn');
    await tick(p, 100);
    await p.click('#commuteBtn');
    await tick(p, 300);
    const a3 = await p.evaluate(() => ({
      on: S.audio.commute, commute: S.commute, kind: nextAction().kind, row: !!document.querySelector('#player .ixAudioRow'),
      opts: [...document.querySelectorAll('[data-ixau="voice"] option')].map((o) => o.textContent), start: visible('#peDriveStart'), speak: visible('[data-prof-speak]'), label: document.querySelector('#commuteBtn').textContent,
    }));
    check('A3', 'Study mode → Commute mode (one tap) turns it on: the commute screen opens with its trip button and a voice menu (best voice = the Premium one; novelty and non-English voices left out); the read-aloud button is back', a3.on && a3.commute && a3.kind === 'COMMUTE' && a3.row && a3.start && /Best on this device \(Ava \(Premium\)\)/.test(a3.opts[0]) && a3.opts[1].startsWith('Ava (Premium)') && !a3.opts.some((t) => /Albert|Majed/.test(t)) && a3.speak, a3);
    await p.click('[data-ixau="test"]');
    await tick(p, 50);
    const a4 = await p.evaluate(() => window.__spoken.slice());
    check('A4', '▶ Test speaks with the best voice on the device (not the default compact one)', a4.length === 1 && a4[0].voice === 'Ava (Premium)', a4);
    await p.selectOption('[data-ixau="voice"]', 'com.apple.voice.compact.en-US.Samantha');
    await p.selectOption('[data-ixau="rate"]', '1.1');
    await p.click('[data-ixau="test"]');
    await tick(p, 50);
    const a5 = await p.evaluate(() => ({ last: window.__spoken[window.__spoken.length - 1], audio: S.audio }));
    check('A5', 'A picked voice and speed are used and saved', a5.last.voice === 'Samantha' && a5.last.rate === 1.1 && a5.audio.voice === 'com.apple.voice.compact.en-US.Samantha' && a5.audio.rate === 1.1, a5);
    // A6: the 25-minute trip speaks with the chosen voice
    const n0 = await p.evaluate(() => window.__spoken.length);
    await p.click('#peDriveStart');
    await tick(p, 200);
    const a6 = await p.evaluate((n) => window.__spoken.slice(n), n0);
    check('A6', 'The hands-free trip speaks with the chosen voice and speed', a6.length >= 1 && a6.every((x) => x.voice === 'Samantha' && x.rate === 1.1), a6.slice(0, 3));
    // A7: off from the commute screen: speech stops, everything hides again, and it stays off after a reload
    const c0 = await p.evaluate(() => window.__cancels);
    await p.click('[data-ixau="off"]');
    await tick(p, 300);
    const a7 = await p.evaluate((c) => { const n = window.__spoken.length; speechSynthesis.speak(new SpeechSynthesisUtterance('silent again')); return { cancelled: window.__cancels > c, on: S.audio.commute, commute: S.commute, kind: nextAction().kind, speak: visible('[data-prof-speak]'), after: window.__spoken.length - n, label: document.querySelector('#commuteBtn').textContent }; }, c0);
    await p.reload({ waitUntil: 'load' });
    // on the Vercel host the sync layer may restore the cloud copy and reload once more: read after it settles
    let a7b = null;
    for (let i = 0; i < 4 && !a7b; i++) {
      await tick(p, 1500).catch(() => {});
      await p.waitForLoadState('load').catch(() => {});
      a7b = await p.evaluate(() => (typeof S !== 'undefined' && S.audio && document.querySelector('#commuteBtn') ? { on: S.audio.commute, voice: S.audio.voice, label: document.querySelector('#commuteBtn').textContent } : null)).catch(() => null);
    }
    a7b = a7b || {};
    check('A7', '"Turn commute mode off" stops the voice at once, hides it all again, and stays off after a reload (the picked voice is remembered)', a7.cancelled && !a7.on && !a7.commute && a7.kind !== 'COMMUTE' && !a7.speak && a7.after === 0 && /OFF/.test(a7.label) && !a7b.on && a7b.voice === 'com.apple.voice.compact.en-US.Samantha' && /OFF/.test(a7b.label), { a7, a7b });
    // A8: the progress panel has the same switch
    await p.evaluate(() => document.querySelector('[data-ixg="panel"]').click());
    await tick(p, 200);
    const box = await p.$('[data-ixau-opt="commute"]');
    const was = box ? await box.isChecked() : null;
    if (box) await box.check();
    await tick(p, 200);
    const a8 = await p.evaluate(() => ({ on: S.audio.commute, label: document.querySelector('#commuteBtn').textContent, kind: nextAction().kind }));
    check('A8', 'The progress panel\'s settings have the same switch (turning it on there does not jump into the commute screen; Study mode then offers it)', box && was === false && a8.on && /Drive audio|ON/.test(a8.label) && a8.kind !== 'COMMUTE', { was, ...a8 });
    await p.evaluate(() => { S.audio.commute = false; save(); render(); });
    check('A9', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }
  {
    // A10: a legacy save that was in commute mode opens in the course, not the commute screen
    const s = await open({ v16: true, time: SUN, state: null, settle: 300, init: fakeSpeech, localStorage: {} });
    await s.page.evaluate(() => { S.commute = true; delete S.audio; save(); });
    await s.page.reload({ waitUntil: 'load' });
    await tick(s.page, 1500);
    const r = await s.page.evaluate(() => ({ commute: S.commute, on: S.audio && S.audio.commute, kind: nextAction().kind, label: document.querySelector('#commuteBtn').textContent }));
    check('A10', 'An old save left in commute mode opens in the course (commute mode off), with nothing lost', r.commute === false && r.on === false && r.kind !== 'COMMUTE' && /OFF/.test(r.label) && s.log.errors.length === 0, r);
    await s.close();
  }
  {
    // A11: phone width, commute screen open: fits
    const s = await open({ v16: true, time: SUN, state: null, settle: 1500, init: fakeSpeech, viewport: { width: 390, height: 844 } });
    await s.page.evaluate(() => { window.INTELLECTUALITY_AUDIO.set(true); S.commute = true; render(); });
    await tick(s.page, 300);
    const r = await s.page.evaluate(() => { const row = document.querySelector('.ixAudioRow'); return { row: !!row, right: row && row.getBoundingClientRect().right, vw: innerWidth, sw: document.documentElement.scrollWidth }; });
    check('A11', 'On a phone (390 px) the voice menu fits the screen', r.row && r.right <= r.vw && r.sw <= r.vw + 1 && s.log.errors.length === 0, r);
    await s.close();
  }
  {
    // A12: the voice list arrives late (iPad Safari): the open menu refreshes itself
    const s = await open({ v16: true, time: SUN, state: null, settle: 1500, init: fakeSpeech, path: '?late=1' });
    await s.page.evaluate(() => { window.INTELLECTUALITY_AUDIO.set(true); S.commute = true; render(); });
    await tick(s.page, 200);
    const before = await s.page.evaluate(() => document.querySelectorAll('[data-ixau="voice"] option').length);
    await s.page.evaluate(() => window.__fillVoices());
    await tick(s.page, 200);
    const after = await s.page.evaluate(() => ({ n: document.querySelectorAll('[data-ixau="voice"] option').length, first: document.querySelector('[data-ixau="voice"] option')?.textContent, boxes: document.querySelectorAll('#player .ixAudioBox').length }));
    check('A12', 'When the device\'s voice list arrives late (iPad Safari), the open voice menu fills in by itself', before === 1 && after.n === 3 && /Ava \(Premium\)/.test(after.first) && after.boxes === 1 && s.log.errors.length === 0, { before, ...after });
    await s.close();
  }
  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'audio_options_test.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
