// v19 AI tutor. T1 the tutor tab and menu button appear, no page errors · T2 a key is saved only on the device and
// never inside the progress (S) or its saved copy · T3 a question streams an answer that used the open screen as
// context · T4 the tutor refuses while a mock is running · T5 lecture notes for a topic reach the tutor.
// OpenRouter is replaced by a local fake: no real key, no money.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = process.env.APP_URL || 'http://localhost:8787/';
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium/chrome-linux/chrome' }).catch(() => chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } });
  const sent = [];
  await ctx.route('https://openrouter.ai/**', async (r) => {
    const u = r.request().url();
    if (u.endsWith('/key')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { limit: 5, usage: 0.12 } }) });
    const body = JSON.parse(r.request().postData() || '{}'); sent.push({ auth: r.request().headers().authorization, body });
    const words = globalThis.__reply || ['The ', '**pretracheal** ', 'fascia ', 'moves ', 'with ', 'swallowing.'];
    const sse = words.map((w) => 'data: ' + JSON.stringify({ choices: [{ delta: { content: w } }] }) + '\n\n').join('') + 'data: [DONE]\n\n';
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: sse });
  });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE); await p.evaluate(() => localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 600, stop: '23:59', off: -1 }))); await p.waitForTimeout(5000);
  const has = await p.evaluate(() => ({ tab: !!document.getElementById('ixTtab'), menu: !!document.getElementById('tutorBtn'), api: !!window.IX_TUTOR }));
  check('T1', 'The tutor tab and menu button appear, no page errors', has.tab && has.api && !errs.length, { has, errs: errs.slice(0, 3) });

  await p.click('#ixTtab'); await p.waitForTimeout(400);
  await p.fill('#ixTkey', 'sk-or-v1-TESTKEY123'); await p.click('#ixTsave'); await p.waitForTimeout(2200);
  const st = await p.evaluate(() => { try { save(); } catch (e) {} const raw = localStorage.getItem('intellectuality_v41_launch_state') || ''; return { dev: localStorage.getItem('ix_tutor_key_v1'), inState: JSON.stringify(typeof S === 'object' ? S : {}).includes('TESTKEY'), inSaved: raw.includes('TESTKEY') }; });
  check('T2', 'The key is kept on the device only, never in the progress or its saved copy', st.dev === 'sk-or-v1-TESTKEY123' && !st.inState && !st.inSaved, st);

  await p.evaluate(() => IX_TUTOR.open());
  await p.fill('#ixTq', 'Why does the thyroid move with swallowing?'); await p.click('#ixTsend'); await p.waitForTimeout(1500);
  const got = await p.evaluate(() => { const m = [...document.querySelectorAll('.ixTm.tutor')].pop(); return m ? m.innerText : ''; });
  const sys = sent.length ? sent[sent.length - 1].body.messages[0].content : '';
  check('T3', 'A question streams an answer, sent with the key and the open screen as context', /pretracheal/.test(got) && sent.length && sent[sent.length - 1].auth === 'Bearer sk-or-v1-TESTKEY123' && /WHAT THE STUDENT IS LOOKING AT/.test(sys), { got: got.slice(0, 80), calls: sent.length });

  const n0 = sent.length;
  await p.evaluate(() => { S.v16 = S.v16 || {}; S.v16.mock = { day: 1, ids: [] }; IX_TUTOR.close(); IX_TUTOR.open(); });
  await p.evaluate(() => IX_TUTOR.ask('give me the answers', null)); await p.waitForTimeout(500);
  const lockMsg = await p.evaluate(() => [...document.querySelectorAll('.ixTm.tutor')].pop().innerText);
  await p.evaluate(() => { S.v16.mock = null; });
  check('T4', 'The tutor refuses while a mock is running, and sends nothing', sent.length === n0 && /mock exam is running/i.test(lockMsg), { lockMsg: lockMsg.slice(0, 60) });

  await p.evaluate(() => { const k = (document.getElementById('title') || {}).innerText || 'general'; IX_TUTOR.saveNotes(k.trim().slice(0, 80) || 'general', 'DOCTOR SAID: the thyroid rises because of the pretracheal attachment to the hyoid.'); });
  await p.evaluate(() => IX_TUTOR.ask('summarise my notes', null)); await p.waitForTimeout(1200);
  const sys2 = sent[sent.length - 1].body.messages[0].content;
  check('T5', 'Lecture notes for the open topic reach the tutor', /DOCTOR SAID/.test(sys2), { has: /LECTURE NOTES/.test(sys2) });
  // T6 Why?: a tapped line opens the professor with how the exam asks it; held-out items never travel
  await p.evaluate(() => { if (window.IX_HOME) IX_HOME.cns(true); }); await p.waitForTimeout(600);   // exam season: the probe goes into the CNS course page
  const probe = await p.evaluate(() => {
    const q = EHSAN_QBANK.questions.find((x) => x.split === 'practice' && /carotid sheath/i.test(x.stem));
    const el = document.createElement('p'); el.id = 'whyProbe'; el.textContent = 'The external carotid artery is not a content of the carotid sheath; the internal carotid is.';
    (document.getElementById('player') || document.body).prepend(el);
    return { has: !!q, held: EHSAN_QBANK.questions.filter((x) => x.split === 'heldout').map((x) => x.stem) };
  });
  await p.evaluate(() => IX_TUTOR.close());
  await p.click('#whyProbe'); await p.waitForTimeout(300);
  const bub = await p.evaluate(() => { const b = document.querySelector('.ixTwhy'); return !!b && b.style.display === 'block'; });
  const n1 = sent.length;
  await p.click('.ixTwhy'); await p.waitForTimeout(1500);
  const last = sent[sent.length - 1], sys3 = last ? last.body.messages[0].content : '';
  const leaked = probe.held.filter((st) => st.length > 30 && sys3.includes(st)).length;
  check('T6', 'Why? on a tapped line asks the professor model with exam relevance, and no held-out item travels', bub && sent.length === n1 + 1 && last.body.model === 'openai/gpt-6.2-sol-pro' && /EXAM RELEVANCE/.test(sys3) && /about \d+ past questions/.test(sys3) && leaked === 0, { bub, model: last && last.body.model, leaked, rel: (sys3.match(/about \d+ past questions[^\n]*/) || [''])[0].slice(0, 90) });
  // T7 sure-but-wrong: the verdict tag is hidden, a badge shows, calibration counts it and the question joins his traps
  globalThis.__reply = ['[[wrong]] ', 'Not quite: ', 'the ECA is outside the sheath.'];
  await p.evaluate(() => { localStorage.removeItem('ix_tutor_calib_v1'); localStorage.removeItem('ix_tutor_traps_v1'); IX_TUTOR.open(); IX_TUTOR.setConf('sure'); });
  await p.evaluate(() => IX_TUTOR.ask('The ECA is in the carotid sheath', null)); await p.waitForTimeout(1200);
  const v = await p.evaluate(() => { const m = [...document.querySelectorAll('.ixTm.tutor')].pop(); return { txt: m.innerText, badge: !!m.querySelector('.ixTverdict.v-wrong'), cal: IX_TUTOR.calibration(), sentConf: null }; });
  const lastUser = sent[sent.length - 1].body.messages.slice(-1)[0].content;
  check('T7', 'A sure-but-wrong answer shows a badge, hides the tag, and becomes one of his traps', v.badge && !/\[\[wrong\]\]/.test(v.txt) && v.cal.sure === 1 && v.cal.sureRight === 0 && v.cal.traps === 1 && /confidence: sure/.test(lastUser), { badge: v.badge, cal: v.cal });
  globalThis.__reply = null;
  // T8 the new learning modes are on the chip row, and Plan today sends the WOOP / if-then brief
  const chips = await p.evaluate(() => [...document.querySelectorAll('.ixTmodes button')].map((b) => b.dataset.mode));
  const nP = sent.length;
  await p.click('.ixTmodes button[data-mode="plan"]'); await p.waitForTimeout(1200);
  const sys4 = sent.length > nP ? sent[sent.length - 1].body.messages[0].content : '';
  const need = ['loop', 'tryfirst', 'worked', 'apart', 'case', 'classmate', 'map', 'traps', 'draw', 'palace', 'plan', 'outline'];
  check('T8', 'All learning modes are on the chip row; Plan today sends the WOOP and if-then brief', need.every((k) => chips.includes(k)) && !chips.includes('why') && /WOOP/.test(sys4) && /If \[obstacle\]/.test(sys4), { missing: need.filter((k) => !chips.includes(k)), woop: /WOOP/.test(sys4) });
  await b.close();
  console.log(fails ? fails + ' FAILED' : '8/8 TUTOR checks passed');
  process.exit(fails ? 1 : 0);
})();
