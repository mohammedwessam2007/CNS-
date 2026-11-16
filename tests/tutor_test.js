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
    const words = ['The ', '**pretracheal** ', 'fascia ', 'moves ', 'with ', 'swallowing.'];
    const sse = words.map((w) => 'data: ' + JSON.stringify({ choices: [{ delta: { content: w } }] }) + '\n\n').join('') + 'data: [DONE]\n\n';
    return r.fulfill({ status: 200, contentType: 'text/event-stream', body: sse });
  });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(5000);
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
  await b.close();
  console.log(fails ? fails + ' FAILED' : '5/5 TUTOR checks passed');
  process.exit(fails ? 1 : 0);
})();
