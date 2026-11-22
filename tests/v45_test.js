// v45 · the key stays and the AI's state is visible. Q1 a saved key is mirrored to IndexedDB and comes back by itself if
// localStorage loses it · Q2 a restore link (#k=…) saves the key and leaves the address bar · Q3 the course page says whether
// the AI is on, off (no key) or paused (budget), with a test and a restore link · Q4 the weekly budget defaults to $10
// and a question is explained without also paying for the next one · Q5 no errors
const { open, tick } = require('./harness');
let fails = 0;
const check = (id, what, ok, info) => { console.log((ok ? 'PASS ' : 'FAIL ') + id.padEnd(3) + ' ' + what + '  · ' + JSON.stringify(info).slice(0, 300)); if (!ok) fails++; };
const KEY = 'sk-or-v1-TESTKEYabcdef123456';
(async () => {
  const s = await open({ v16: true, time: '2026-11-22T09:00:00+02:00', state: null, settle: 2000, viewport: { width: 390, height: 844 } });
  const p = s.page, errs = [], calls = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.context().route('https://openrouter.ai/**', async (r) => { calls.push(r.request().url()); await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { limit: null, limit_remaining: null, usage: 0 }, choices: [{ message: { content: 'ok' } }] }) }); });
  const off = await p.evaluate(() => (document.querySelector('[data-cai]') || {}).textContent || '');
  await p.evaluate((k) => IX_KEY.save(k), KEY); await tick(p, 300);
  const on = await p.evaluate(() => (document.querySelector('[data-cai]') || {}).textContent || '');
  // the phone clears localStorage (eviction, a cleared cache): the IndexedDB mirror survives
  const mirrored = await p.evaluate(() => new Promise((res) => { const r = indexedDB.open('ix_keys_v1', 1); r.onsuccess = () => { const q = r.result.transaction('kv').objectStore('kv').get('ix_tutor_key_v1'); q.onsuccess = () => res(q.result || ''); }; }));
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await tick(p, 2500); await p.waitForTimeout(500);
  const back = await p.evaluate(() => localStorage.getItem('ix_tutor_key_v1'));
  check('Q1', 'The key is mirrored and comes back by itself after the phone clears it', mirrored === KEY && back === KEY, { mirrored: !!mirrored, back: back === KEY });
  await p.evaluate(() => localStorage.clear());
  await p.evaluate(() => new Promise((res) => { const r = indexedDB.open('ix_keys_v1', 1); r.onsuccess = () => { const t = r.result.transaction('kv', 'readwrite'); t.objectStore('kv').delete('ix_tutor_key_v1'); t.oncomplete = res; }; }));
  const url = await p.evaluate(() => location.href.split('#')[0]);
  await p.goto(url + '#k=' + KEY); await p.reload(); await tick(p, 2500); await p.waitForTimeout(500);
  const q2 = await p.evaluate(() => ({ key: localStorage.getItem('ix_tutor_key_v1'), hash: location.hash }));
  check('Q2', 'The restore link saves the key and leaves the address bar clean', q2.key === KEY && !q2.hash, { saved: q2.key === KEY, hash: q2.hash });
  const q3 = await p.evaluate(() => { const t = (document.querySelector('[data-cai]') || {}).textContent || ''; localStorage.setItem('ix_tutor_spend_v1', JSON.stringify({ week: JSON.parse(localStorage.getItem('ix_tutor_spend_v1') || '{}').week || IX_TUTOR.spend().week, usd: 99, calls: 1 })); document.dispatchEvent(new CustomEvent('ix:key')); return { on: t, paused: (document.querySelector('[data-cai]') || {}).textContent || '', link: IX_KEY.link() }; });
  check('Q3', 'The course page shows the AI as off without a key, on with one (with a test and a restore link), paused when the budget is used', /AI is off/.test(off) && /AI is on/.test(on) && /Test it now/.test(on) && /restore link/.test(on) && /budget/.test(q3.paused) && /#k=sk-or-/.test(q3.link), { off: off.slice(0, 40), on: on.slice(0, 60), paused: q3.paused.slice(0, 60) });
  const q4 = await p.evaluate(() => { localStorage.removeItem('ix_tutor_cap_v1'); localStorage.removeItem('ix_tutor_spend_v1'); return IX_TUTOR.cap(); });
  calls.length = 0;
  await p.evaluate(() => IX_GIT.open()); await tick(p, 300); await p.evaluate(() => document.querySelector('[data-run]').click());
  for (let k = 0; k < 40 && !calls.length; k++) await p.waitForTimeout(100);
  await p.waitForTimeout(800);
  const chat = calls.filter((u) => /chat\/completions/.test(u)).length;
  check('Q4', 'The budget defaults to $10 and an open question costs one call (not two)', q4 === 10 && chat === 1, { cap: q4, chat });
  check('Q5', 'No page errors', !errs.length, errs.slice(0, 3));
  await s.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
