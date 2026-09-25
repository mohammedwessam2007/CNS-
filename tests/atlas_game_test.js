// v17: the CNS atlas (hand-drawn interactive diagrams) and the ADHD game layer.
// Usage: node tests/atlas_game_test.js [out.json]   (app served on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const { open, tick } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 700))); };
const T = '2026-09-25T09:00:00+03:00';
const inject = ([secId, qid]) => {
  const p = document.getElementById('player');
  p.insertAdjacentHTML('beforeend', (secId ? '<div class="v15Sec" data-v15-sec="' + secId + '"><div class="v15Head"><h3>t</h3></div><div class="v15Pics"></div><ul class="v15Pts"><li>x</li></ul></div>' : '') + (qid ? '<div class="v16Explain" data-qid="' + qid + '"><div class="v16Row key">k</div><div class="v16Pics"></div></div>' : ''));
};
// walk a fresh learner through the lesson until the first MCQ (clicking the app's own buttons)
async function toFirstMcq(page, onTeach) {
  for (let i = 0; i < 80; i++) {
    const c = await page.evaluate(() => window.INTELLECTUALITY_V16.act.current());
    if (/V16_/.test(c.kind)) return c;
    if (onTeach && c.type === 'teach') await onTeach();
    const bs = await page.$$('#player button.primary');
    if (!bs.length) return c;
    await bs[0].click();
    await tick(page, 150);
  }
  return null;
}

(async () => {
  // ── A1–A7: every diagram, every state, every part ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500 });
    const r = await s.page.evaluate(() => {
      const A = window.IX_ATLAS, V15 = window.INTELLECTUALITY_V15, out = { scenes: [], bad: [], secs: 0, badSecs: [], parts: 0, sims: 0 };
      const box = document.createElement('div');
      document.body.appendChild(box);
      for (const id of A.scenes()) {
        const d = A.def(id);
        box.innerHTML = '';
        const card = A.mount(box, id, '');
        const partEls = [...card.querySelectorAll('[data-p]')].map((e) => e.dataset.p.split('.')[0]);
        const missing = Object.keys(d.parts).filter((p) => !partEls.includes(p) && !/^(a\d|asa|psa)$/.test(p));
        const drillBad = (d.drill || []).filter((p) => !d.parts[p] || !partEls.includes(p));
        for (const sim of d.sims) { A.apply(card, sim.id); out.sims++; if (!card.querySelector('.ixAInfo').textContent.trim()) out.bad.push(id + ':' + sim.id + ' empty info'); }
        for (const p of Object.keys(d.parts)) out.parts++;
        for (const sid of Object.keys(d.secs || {})) { out.secs++; if (!V15.section(sid)) out.badSecs.push(id + '→' + sid); }
        if (missing.length) out.bad.push(id + ' parts not drawn: ' + missing.join(','));
        if (drillBad.length) out.bad.push(id + ' drill ids not drawn: ' + drillBad.join(','));
        if (!card.querySelector('svg.ixASvg').children.length) out.bad.push(id + ' empty svg');
        out.scenes.push(id);
      }
      box.remove();
      return { ...out, mapped: A.sections().length };
    });
    check('A1', 'Every diagram draws, every state applies with its explanation, every named part is drawn and tappable, every drill target exists', r.scenes.length >= 20 && r.bad.length === 0 && r.sims >= 80, { n: r.scenes.length, sims: r.sims, parts: r.parts, bad: r.bad });
    check('A2', 'Every lesson section a diagram is assigned to exists in the notes; at least 60 sections carry a diagram', r.badSecs.length === 0 && r.mapped >= 60, { mapped: r.mapped, badSecs: r.badSecs });
    // A3: the state a question opens with fits the question (rules on stem + key, section first)
    const q = await s.page.evaluate(() => {
      const QB = window.EHSAN_QBANK.questions, A = window.IX_ATLAS;
      const find = (re) => QB.find((x) => x.split === 'practice' && re.test(x.stem + ' ' + (x.options || []).filter((o) => (x.answerKeys || []).includes(o.key)).map((o) => o.text).join(' ')));
      const cases = [[/hemisect|brown[\s-]*s[eé]quard/i, 'cord', 'bsq'], [/syringomyel/i, 'cord', 'syr'], [/bitemporal/i, 'vision', 'chiasm'], [/argyll/i, 'pupil', 'argyll'], [/huntington/i, 'bg', 'hd'], [/parkinson/i, 'bg', 'pd'], [/circle of willis|circulus arteriosus/i, 'willis', 'ring'], [/aqueduct/i, 'csf', null], [/internal capsule/i, 'capsule', null], [/semicircular|nystagmus/i, 'vest', null], [/rhodopsin/i, 'rod', 'light'], [/tetanus/i, 'synapse', 'tetanus'], [/hemiballism|subthalamic/i, 'bg', 'hb'], [/purkinje cell/i, 'cbcx', null], [/basilar membrane/i, null, null], [/muscle spindle/i, 'reflex', null]];
      return cases.map(([re, sc, sim]) => { const x = find(re); const m = x ? A.forQuestion(x.id) : null; return { re: String(re), qid: x?.id || null, got: m ? m.id + ':' + m.sim : null, ok: !x || ((!sc || (m && m.id === sc)) && (!sim || (m && m.sim === sim)) && (!!m)) }; });
    });
    check('A3', 'After an answer the diagram opens in the state that question tests (hemisection → cord cut, bitemporal → chiasma lesion, Argyll Robertson → pretectal, Huntington → striatum lost …)', q.filter((x) => x.qid).length >= 12 && q.every((x) => x.ok), q.filter((x) => !x.ok || !x.qid));
    const cov = await s.page.evaluate(() => { const QB = window.EHSAN_QBANK.questions.filter((x) => x.split === 'practice'); let n = 0; for (const x of QB) if (window.IX_ATLAS.forQuestion(x.id)) n++; return { n, of: QB.length }; });
    check('A4', 'A large share of practice questions get a live diagram after they are answered (reported)', cov.n >= 300, cov);
    // A5: explore, Spot-it drill, zoom, scene controls
    await s.page.evaluate(inject, ['an-spinal-cord#3', null]);
    await tick(s.page, 300);
    const card = '#player .v15Sec[data-v15-sec="an-spinal-cord#3"] .ixA';
    const hasCard = await s.page.$(card);
    let ex = null, dr = null, zoom = null;
    if (hasCard) {
      await s.page.click(card + ' [data-p="lst.L"]', { force: true });
      ex = await s.page.evaluate((c) => document.querySelector(c + ' .ixAInfo').textContent, card);
      await s.page.click(card + ' [data-ixa-drill]');
      const xp0 = await s.page.evaluate(() => window.IX_GAME.state().xp);
      for (let i = 0; i < 5; i++) {
        const want = await s.page.evaluate((c) => document.querySelector(c + ' .ixADrillQ b')?.textContent || '', card);
        const pid = await s.page.evaluate(([c, w]) => { const d = window.IX_ATLAS.def('cord'); const k = Object.keys(d.parts).find((p) => d.parts[p][0].replace(/\*\*/g, '') === w); return k ? [...document.querySelectorAll(c + ' [data-p]')].find((e) => e.dataset.p.split('.')[0] === k)?.dataset.p : null; }, [card, want]);
        if (pid) await s.page.evaluate(([c, p]) => document.querySelector(c + ' [data-p="' + p + '"]').dispatchEvent(new MouseEvent('click', { bubbles: true })), [card, pid]);
        await tick(s.page, 800);
      }
      dr = await s.page.evaluate((c) => ({ end: document.querySelector(c + ' .ixADrillEnd')?.textContent || '', xp: window.IX_GAME.state().xp }), card);
      dr.gain = dr.xp - xp0;
      await s.page.click(card + ' [data-ixa-zoom]');
      zoom = await s.page.evaluate(() => !!document.querySelector('.ixAZoom .ixA'));
      await s.page.click('.ixAZoom [data-ixa-close]');
      zoom = zoom && !(await s.page.$('.ixAZoom'));
    }
    check('A5', 'Tap a tract → its name and meaning; Spot-it drill runs 5 prompts, a clean sweep earns XP (+3 each, +10 bonus, +30 more if it completes a quest); full screen opens and closes', !!hasCard && /Lateral spinothalamic/.test(ex || '') && /5 \/ 5/.test(dr?.end || '') && (dr.gain === 25 || dr.gain === 55) && zoom, { hasCard: !!hasCard, ex: (ex || '').slice(0, 80), dr, zoom });
    // A6: scene controls (torch, gaze, facial sites, summation lab) and reduced motion
    const ctl = await s.page.evaluate(() => {
      const A = window.IX_ATLAS, box = document.createElement('div');
      document.getElementById('player').appendChild(box);
      const c1 = A.mount(box, 'pupil', 'afferent');
      c1.querySelector('[data-ixa-act="L"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const litL = [...c1.querySelectorAll('.pup')].map((p) => +p.getAttribute('r'));
      c1.querySelector('[data-ixa-act="R"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const litR = [...c1.querySelectorAll('.pup')].map((p) => +p.getAttribute('r'));
      const c2 = A.mount(box, 'eom', 'vi');
      c2.querySelector('[data-ixa-act="-1,0"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const tr = c2.querySelector('.iris[data-eye="R"]').getAttribute('transform');
      const c3 = A.mount(box, 'facial', '');
      c3.querySelector('[data-ixa-act="umn"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const umn = [...c3.querySelectorAll('.fz')].filter((z) => z.getAttribute('fill') !== '#0000').map((z) => z.dataset.z);
      const c4 = A.mount(box, 'sum', '');
      return { litL, litR, tr, umn, sum: !!c4.querySelector('.trace') };
    });
    await s.page.evaluate(() => { const c = document.querySelector('#player .ixA[data-ixa="sum"]'); c.querySelector('[data-ixa-act="A"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); c.querySelector('[data-ixa-act="B"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    await tick(s.page, 400);
    const spike = await s.page.evaluate(() => document.querySelector('#player .ixA[data-ixa="sum"] .ixASum')?.textContent || '');
    check('A6', 'Simulators work: left optic nerve cut → no reaction to light in the left eye, both react to the right; VI palsy → right eye cannot abduct; right UMN facial lesion → only the LEFT lower face; two EPSPs together fire the neuron (spatial summation)', ctl.litL.every((r) => r > 8) && ctl.litR.every((r) => r < 6) && /translate\(0(\.0)? /.test(ctl.tr) && ctl.umn.length === 1 && ctl.umn[0] === 'lf.L' && /Fired 1/.test(spike) && /spatial/.test(spike), { ...ctl, spike });
    await s.page.emulateMedia({ reducedMotion: 'reduce' });
    const still = await s.page.evaluate(() => { const c = document.querySelector('#player .ixA[data-ixa="cord"]'); window.IX_ATLAS.apply(c, 'pain'); return c.querySelector('svg').classList.contains('ixStill'); });
    check('A7', 'Reduce-motion: diagrams stop moving (static trails instead of animation)', still, { still });
    // A9: the diagrams' words are written from the notes and standard anatomy, never from a sealed (held-out) item
    const leak = await s.page.evaluate(() => {
      const norm = (t) => String(t).toLowerCase().replace(/\*\*/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
      const A = window.IX_ATLAS, words = [];
      for (const id of A.scenes()) { const d = A.def(id); words.push(d.title, d.intro || ''); for (const [n, t] of Object.values(d.parts)) words.push(n, t); for (const sm of d.sims) words.push(sm.info || '', sm.res ? sm.res() : ''); }
      const text = ' ' + norm(words.join(' ').replace(/<[^>]+>/g, ' ')).join(' ') + ' ';
      const hits = [];
      for (const q of window.EHSAN_QBANK.questions.filter((x) => x.split === 'heldout')) {
        const w = norm(q.stem);
        for (let i = 0; i + 7 <= w.length; i++) { const sh = ' ' + w.slice(i, i + 7).join(' ') + ' '; if (text.includes(sh)) { hits.push(q.id + ': ' + sh.trim()); break; } }
      }
      return { hits: hits.slice(0, 10), n: hits.length, chars: text.length };
    });
    check('A9', 'Held-out firewall: no sealed-mock question shares a 7-word run with the diagrams\' text', leak.n === 0, leak);
    check('A8', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── L1–L3 and G1–G4: the real lesson and MCQ flow of a fresh learner ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500 });
    let order = null;
    const c = await toFirstMcq(s.page, async () => {
      if (order) return;
      order = await s.page.evaluate(() => {
        const sec = [...document.querySelectorAll('#player .v15Sec[data-v15-sec]')].find((x) => x.querySelector('.ixA'));
        if (!sec) return null;
        const kids = [...sec.children].map((k) => k.className.split(' ')[0]);
        return { sec: sec.dataset.v15Sec, kids, fits: sec.querySelector('.ixA').getBoundingClientRect().width <= sec.getBoundingClientRect().width + 1, doc: document.documentElement.scrollWidth <= innerWidth };
      });
    });
    check('L1', 'Lesson: the live diagram opens its section, before the department drawings and the photos, and fits the screen', !!order && order.kids.indexOf('ixAWrap') >= 0 && order.kids.indexOf('ixAWrap') < order.kids.indexOf('v15Pics') && order.fits && order.doc, order);
    const g0 = await s.page.evaluate(() => { const x0 = S.xp || 0, g = window.IX_GAME.state(); window.IX_GAME.award('spike', 2); return { g, bar: !!document.querySelector('#ixGame:not([hidden])'), same: (S.xp || 0) === x0, up: window.IX_GAME.state().xp - g.xp }; });
    check('G1', 'The progress bar is on screen; learning sections already earned XP and counted towards the learn quest; game XP is kept apart (the app\'s own S.xp is never changed by it)', g0.bar && g0.g.xp > 0 && g0.g.days['2026-09-25'].sec >= 3 && g0.same && g0.up === 2 && g0.g.streak.n === 1, { bar: g0.bar, gxp: g0.g.xp, sec: g0.g.days['2026-09-25']?.sec, same: g0.same, up: g0.up, streak: g0.g.streak });
    // before answering: no diagram inside the question (no hints)
    const pre = await s.page.evaluate(() => document.querySelectorAll('#player .v16Q .ixA').length);
    let pops = [], answered = 0, sxp = [];
    for (let guard = 0; answered < 8 && guard < 80; guard++) {
      const cur = await s.page.evaluate(() => window.INTELLECTUALITY_V16.act.current());
      if (!/V16_(BLOCK|ROUND)/.test(cur.kind)) { await toFirstMcq(s.page); continue; }
      if (cur.answered) { await s.page.click('#player [data-v16="next"]'); await tick(s.page, 200); continue; }
      const before = await s.page.evaluate(() => S.xp || 0);
      await s.page.click('#player .v16Opt');
      await tick(s.page, 200);
      const r = await s.page.evaluate(() => ({ pop: document.querySelector('#player .v16Verdict .ixGPop')?.textContent || '', xp: S.xp || 0 }));
      pops.push(r.pop);
      sxp.push(r.xp - before);
      answered++;
      if (answered < 8) { await s.page.click('#player [data-v16="next"]'); await tick(s.page, 200); }
    }
    const mid = await s.page.evaluate(() => ({ dots: document.querySelectorAll('#ixGame .ixGDots i.ok, #ixGame .ixGDots i.no').length, g: window.IX_GAME.state() }));
    check('G2', 'Every answer pays at once: an XP pop on the verdict (+12 right, +4 wrong, never a loss), and a sprint dot fills', pre === 0 && answered === 8 && pops.every((p) => /^\+(12|4) XP$/.test(p)) && sxp.every((x) => x === 12 || x === 4), { pre, answered, pops, sxp, dots: mid.dots });
    await s.page.click('#player [data-v16="next"]');
    await tick(s.page, 300);
    const card = await s.page.evaluate(() => ({ text: document.querySelector('.ixGToast .ixGSprintEnd')?.textContent || '', g: window.IX_GAME.state() }));
    check('G3', 'After the 8th answer and "next": a sprint-cleared card (score, XP, minutes) with "Keep going" and an optional move break; the sprint resets', /Sprint cleared/.test(card.text) && /Keep going/.test(card.text) && /move break/.test(card.text) && card.g.sprint.n === 0 && card.g.sprints === 1, card);
    await s.page.click('.ixGToast [data-ixg="break"]');
    await tick(s.page, 600);
    const brk = await s.page.evaluate(() => ({ on: !!document.querySelector('.ixGBreak'), clock: document.querySelector('.ixGRingBig b')?.textContent || '', moves: document.querySelectorAll('.ixGBreak li').length }));
    await s.page.click('.ixGBreak [data-ixg="endbreak"]');
    const brkOff = !(await s.page.$('.ixGBreak'));
    check('G4', 'Move break: a 2-minute visual countdown with three movement ideas; "Back to it" returns straight to the questions', brk.on && /^[12]:\d\d$/.test(brk.clock) && brk.moves === 3 && brkOff, { ...brk, brkOff });
    await s.page.click('#ixGame .ixGQ');
    await tick(s.page, 200);
    const pan = await s.page.evaluate(() => ({ quests: document.querySelectorAll('.ixGQuest').length, opts: document.querySelectorAll('[data-ixg-opt]').length, why: !!document.querySelector('.ixGWhy') }));
    await s.page.click('[data-ixg="close"]');
    check('G5', 'Quests panel: three daily quests with progress, the settings (game on/off, vibration, sound, calm mode) and the research reasons', pan.quests === 3 && pan.opts === 4 && pan.why, pan);
    check('G6', 'No page errors in the whole lesson → MCQ → sprint → break flow', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  // ── G7–G11: streak, quests, mock (sealed), game off, broken state ──
  {
    const s = await open({ v16: true, time: T, state: null, settle: 1500 });
    const st = await s.page.evaluate(() => {
      const G = window.IX_GAME, t = window.INTELLECTUALITY_V14.cairoYMD(), back = (n) => new Date(Date.parse(t + 'T12:00:00Z') - n * 864e5).toISOString().slice(0, 10), out = {};
      const set = (o) => { S.game.streak = Object.assign({ n: 0, best: 0, last: '', freeze: 2, run: 0 }, o); G.touch(); return G.state().streak; };
      G.state();
      out.next = set({ n: 5, last: back(1), freeze: 2, run: 5 });
      out.gap2 = set({ n: 5, last: back(3), freeze: 2, run: 5 });
      out.reset = set({ n: 9, last: back(5), freeze: 1, run: 9 });
      out.earn = set({ n: 6, last: back(1), freeze: 1, run: 6 });
      out.same = set({ n: 4, last: t, freeze: 2, run: 4 });
      return out;
    });
    check('G7', 'Forgiving streak: next day +1; a gap covered by freezes keeps it; a longer gap restarts at 1 with a welcome (no shame screen); 7 days in a row earns a freeze (max 3)', st.next.n === 6 && st.gap2.n === 6 && st.gap2.freeze === 0 && st.reset.n === 1 && st.earn.n === 7 && st.earn.freeze === 2 && st.same.n === 4, st);
    const qs = await s.page.evaluate(() => {
      const G = window.IX_GAME, d = () => G.state().days[window.INTELLECTUALITY_V14.cairoYMD()];
      const x0 = G.state().xp;
      const today = S.game.days[window.INTELLECTUALITY_V14.cairoYMD()] || (G.award('explore', 0), S.game.days[window.INTELLECTUALITY_V14.cairoYMD()]);
      today.sec = 6; today.a = 25; today.fix = 3; today.combo = 5; today.clean = 1;
      G.award('explore', 0);
      return { quests: G.quests(), gain: G.state().xp - x0, chest: !!d().qd.chest };
    });
    check('G8', 'Quests: finishing each pays +30 XP; all three open the daily chest (+50)', qs.quests.every((q) => q.done) && qs.gain === 140 && qs.chest, qs);
    // sealed mock: no diagram, no score in the bar, no XP pop
    await s.page.evaluate(() => {
      const ids = window.EHSAN_QBANK.questions.filter((q) => q.split === 'heldout' && q.autoScore && (q.options || []).length >= 2 && !q.requiresVisual).slice(0, 3).map((q) => q.id);
      S.v16.mock = { day: S.day, ids, ans: {}, i: 0, used: 0, t0: Date.now(), lim: 3, done: false, at: new Date().toISOString() };
      render();
    });
    await tick(s.page, 100);
    const mk = await s.page.evaluate(() => ({ bar: document.querySelector('#ixGame')?.textContent || '', atlas: document.querySelectorAll('#player .ixA').length, lvl: document.querySelector('#ixGame .ixGLv b')?.textContent }));
    for (let i = 0; i < 2; i++) { await s.page.click('#player .v16Opt'); await tick(s.page, 200); }
    const mk2 = await s.page.evaluate(() => ({ bar: document.querySelector('#ixGame')?.textContent || '', pops: document.querySelectorAll('.ixGPop').length, atlas: document.querySelectorAll('#player .ixA').length, lvl: document.querySelector('#ixGame .ixGLv b')?.textContent }));
    check('G9', 'Sealed mock = boss fight: no diagrams, no XP pop, and the bar shows no score while it runs (nothing leaks whether an answer was right)', /sealed/.test(mk.bar) && /sealed/.test(mk2.bar) && mk.atlas === 0 && mk2.atlas === 0 && mk2.pops === 0 && !/\d+ \/ \d+ XP/.test(mk2.bar) && mk.lvl === mk2.lvl, { mk, mk2 });
    const off = await s.page.evaluate(() => { window.IX_GAME.opt('on', false); return { hidden: document.querySelector('#ixGame')?.hidden === true, pad: document.body.classList.contains('ixGOn') }; });
    await s.page.evaluate(() => window.IX_GAME.opt('on', true));
    check('G10', 'Game layer can be switched off (bar gone, nothing else changes) and back on', off.hidden && !off.pad, off);
    const bad = await s.page.evaluate(() => { const out = []; for (const junk of ['x', [1, 2], null, 42, { v: 1, days: 'no', streak: [], sprint: { h: 'y' }, opt: 7, xp: 'NaN' }]) { S.game = junk; window.IX_GAME.award('spot', 3); const g = window.IX_GAME.state(); out.push(g && g.v === 1 && typeof g.xp === 'number' && Array.isArray(g.sprint.h)); } return { out, size: JSON.stringify(S.game).length }; });
    check('G11', 'A broken or foreign S.game is repaired without errors, and the saved game state stays small', bad.out.every(Boolean) && bad.size < 4000, bad);
    check('G12', 'No page errors', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }
  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'atlas_game_test.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
