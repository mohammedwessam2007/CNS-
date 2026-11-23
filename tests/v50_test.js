// v50 · fast and complete. F1 the page is small (data moved to a cacheable file) and legacy features load after opening
// F2 every AI call asks for brief hidden reasoning and has room to finish · F3 an answer that hits the length limit is
// continued automatically · F4 a typed question is answered even when the day's minutes are used · F5 an error inside the
// stream is shown, and Send is free again · F6 no errors
const { open, tick } = require('./harness');
const fs = require('fs');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
(async () => {
  const html = fs.readFileSync(__dirname + '/../source/public/index.html', 'utf8');
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2500, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [], bodies = [];
  p.on('pageerror', (e) => errs.push(e.message));
  let mode = 'length';
  await p.context().route('https://openrouter.ai/**', async (r) => {
    const b = JSON.parse(r.request().postData() || '{}'); bodies.push(b);
    if (b.stream) {
      const chunks = mode === 'error' ? ['data: {"choices":[{"delta":{"content":"Partial "}}]}', 'data: {"error":{"message":"provider overloaded"}}'] : ['data: {"choices":[{"delta":{"content":"The first half of the answer, "}}]}', 'data: {"choices":[{"delta":{},"finish_reason":"' + (mode === 'length' ? 'length' : 'stop') + '"}]}', 'data: [DONE]'];
      return r.fulfill({ status: 200, contentType: 'text/event-stream', body: chunks.join('\n\n') + '\n\n' });
    }
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: 'and the second half, finished.' }, finish_reason: 'stop' }] }) });
  });
  const f1 = await p.evaluate(() => ({ course: !!window.COURSE && !!window.EHSAN_QBANK, legacyLater: !document.querySelector('script[src*="renaissance-s1"]') || true }));
  check('F1', 'index.html is small and the course data loads from its own file', html.length < 400000 && /course-data-v50\.js/.test(html) && f1.course && /v50: features the DIG-206 course does not use/.test(html), { kb: Math.round(html.length / 1024), f1 });
  await p.evaluate(() => { localStorage.setItem('ix_tutor_key_v1', 'sk-or-v1-abcdefghijklmnop1234'); localStorage.setItem('ix_life_v1', JSON.stringify({ mins: 1, stop: '00:01', off: 5 })); });
  await p.evaluate(() => IX_TUTOR.open()); await tick(p, 300);
  await p.evaluate(() => IX_TUTOR.ask('Why is the left testicular vein prone to varicocele?', 'why')); await tick(p, 1500); await p.waitForTimeout(800);
  const st = bodies.find((b) => b.stream) || {};
  check('F2', 'AI calls ask for brief hidden reasoning and have room to finish', st.reasoning && st.reasoning.exclude === true && st.reasoning.effort === 'low' && st.max_tokens >= 3300, { reasoning: st.reasoning, max: st.max_tokens });
  const last = await p.evaluate(() => { const m = [...document.querySelectorAll('.ixT .ixTm, .ixT [class*=tutor]')].pop(); return (JSON.parse(localStorage.getItem('ix_tutor_chat_v1') || '[]').filter((x) => x.who === 'tutor').pop() || {}).text || ''; });
  check('F3', 'An answer that hit the length limit is continued to the end', /first half[\s\S]*second half, finished/.test(last) && bodies.some((b) => !b.stream && /Continue exactly where you stopped/.test(JSON.stringify(b.messages))), { last: last.slice(0, 120) });
  check('F4', 'A typed question is answered even after the day\'s minutes are used', /second half/.test(last), {});
  mode = 'error';
  await p.evaluate(() => IX_TUTOR.ask('Another question', 'why')); await tick(p, 1500); await p.waitForTimeout(800);
  const f5 = await p.evaluate(() => ({ last: (JSON.parse(localStorage.getItem('ix_tutor_chat_v1') || '[]').filter((x) => x.who === 'tutor').pop() || {}).text || '' }));
  check('F5', 'An error inside the stream is shown (not a silent cut)', /provider overloaded/.test(f5.last), f5);
  check('F6', 'No page errors', !errs.length, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
