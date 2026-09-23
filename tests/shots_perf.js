// Screenshots (4 viewports × key screens) + performance probe (cold load, transitions,
// 30-question driven session, CDP heap/nodes/listeners).
// Usage: APP_URL=http://127.0.0.1:8787/ node tests/shots_perf.js <outDir> [--no-shots] [--label x]
// Commons images are answered with a labelled placeholder (sandbox egress blocks Wikimedia),
// so screenshots show layout and text truthfully but not the real photographs.
const fs = require('fs');
const path = require('path');
const { open } = require('./harness');
const OUT = process.argv[2] || path.join(__dirname, 'out', 'shots');
const SHOTS = !process.argv.includes('--no-shots');
const LABEL = (process.argv[process.argv.indexOf('--label') + 1] || 'current');
fs.mkdirSync(OUT, { recursive: true });
const PH = (t) => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560"><rect width="100%" height="100%" fill="#dfe6ee"/><text x="50%" y="46%" font-family="sans-serif" font-size="26" text-anchor="middle" fill="#445">Wikimedia Commons image</text><text x="50%" y="56%" font-family="sans-serif" font-size="18" text-anchor="middle" fill="#667">(placeholder: sandbox cannot reach Commons)</text></svg>`;

async function metrics(page) {
  const c = await page.context().newCDPSession(page);
  await c.send('Performance.enable');
  await c.send('HeapProfiler.collectGarbage').catch(() => {});
  const m = Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(x => [x.name, x.value]));
  await c.detach();
  return { heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1), nodes: m.Nodes, listeners: m.JSEventListeners, layouts: m.LayoutCount, styleRecalcs: m.RecalcStyleCount };
}
async function step(page) {
  // one driven action; returns what was done
  return page.evaluate(async () => {
    const a = nextAction(), P = document.querySelector('#player'), q = (s) => P.querySelector(s);
    const click = (s) => { const b = q(s); if (b && !b.disabled) { b.click(); return true; } return false; };
    if (a.kind === 'SEGMENT' && a.seg.type === 'question') {
      if (q('[data-v14-reveal]')) { q('[data-v14-reveal]').click(); return 'reveal'; }
      if (q('[data-act="finish-qbank"]')) { q('[data-act="finish-qbank"]').click(); return 'next'; }
      const qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0);
      const n = (window.__ix_n = (window.__ix_n || 0) + 1);
      const wrong = n % 4 === 0, k = wrong ? qq.options.find(o => !qq.answerKeys.includes(o.key)).key : qq.answerKeys[0];
      q('[data-conf="' + (wrong ? 'confident' : 'sure') + '"]')?.click();
      const b = q('[data-act="qbank-choice"][data-choice="' + k + '"]'); if (b) { b.click(); return wrong ? 'answer-wrong' : 'answer'; }
      return 'stuck-q';
    }
    if (a.kind === 'REPAIR') { const r = q('[data-v14-recon]'); if (r && !r.value) { r.value = 'the decisive difference, rebuilt from memory'; r.dispatchEvent(new Event('input', { bubbles: true })); } return click('[data-act="repair"]') ? 'repair' : 'stuck-repair'; }
    if (a.kind === 'RETEST') { const b = q('[data-act="retest-qbank"]'); if (b) { const qq = EHSAN_QBANK.questions.find(x => x.id === b.dataset.qid); q('[data-act="retest-qbank"][data-choice="' + qq.answerKeys[0] + '"]').click(); return 'retest'; } return 'stuck-retest'; }
    for (const s of ['[data-act="visual-hide"]', '[data-act="v15-next"]', '[data-act="finish-segment"]', '[data-act="finish-qbank"]', '[data-act="certify"]', '.bigAction', 'button.primary']) if (click(s)) return a.kind + ':' + s;
    return 'stuck-' + a.kind;
  });
}

(async () => {
  const report = { label: LABEL, url: process.env.APP_URL || 'http://127.0.0.1:8787/', viewports: {}, perf: {} };
  // ── screenshots ──
  if (SHOTS) for (const vp of [{ n: 'iphone', w: 390, h: 844 }, { n: 'ipad', w: 820, h: 1180 }, { n: 'ipadpro', w: 1024, h: 1366 }, { n: 'ipad-land', w: 1180, h: 820 }]) {
    const s = await open({ time: '2026-09-23T10:00:00+03:00', state: null, settle: 300, viewport: { width: vp.w, height: vp.h }, touch: true });
    await s.context.route(/upload\.wikimedia\.org/, (r) => r.fulfill({ contentType: 'image/svg+xml', body: PH() }));
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(1200);
    const shot = async (name) => { await s.page.waitForTimeout(900); await s.page.screenshot({ path: path.join(OUT, vp.n + '_' + name + '.png'), fullPage: name !== '1_home' }); };
    await shot('1_home');
    let learnShot = false;
    for (let i = 0; i < 20; i++) {
      const k = await s.page.evaluate(() => nextAction().seg?.type || '');
      if (k === 'question') break;
      if (k === 'teach' && !learnShot) { learnShot = true; await s.page.waitForTimeout(600); await shot('2a_learn'); }
      await s.page.evaluate(() => document.querySelector('#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]')?.click()); await s.page.waitForTimeout(200);
    }
    await shot('2_primer');
    await s.page.evaluate(() => document.querySelector('[data-v14-reveal]')?.click());
    await shot('3_options');
    await s.page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); document.querySelector('[data-conf="confident"]')?.click(); document.querySelector('[data-act="qbank-choice"][data-choice="' + qq.options.find(o => !qq.answerKeys.includes(o.key)).key + '"]').click(); });
    await s.page.waitForTimeout(1500);
    await shot('4_autopsy');
    const ov = await s.page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, small: [...document.querySelectorAll('#player button')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 44).map(b => b.textContent.trim().slice(0, 30)) }));
    report.viewports[vp.n] = { ...ov, overflow: ov.sw > ov.iw + 1, errors: s.log.errors.length };
    await s.close();
  }
  // ── performance ──
  {
    const s = await open({ state: null, settle: 50, viewport: { width: 820, height: 1180 }, touch: true });
    const nav = await s.page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0], p = Object.fromEntries(performance.getEntriesByType('paint').map(x => [x.name, Math.round(x.startTime)])); return { domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: p['first-contentful-paint'], transferKB: Math.round(performance.getEntriesByType('resource').reduce((z, r) => z + (r.transferSize || 0), n.transferSize || 0) / 1024), requests: performance.getEntriesByType('resource').length + 1 }; });
    await s.page.waitForTimeout(1500);
    report.perf.coldLoad = { ...nav, ...(await metrics(s.page)), commonsOnLoad: s.log.commons.length };
    // transition timings on the first question
    for (let i = 0; i < 14; i++) { const k = await s.page.evaluate(() => nextAction().seg?.type || ''); if (k === 'question') break; await step(s.page); await s.page.waitForTimeout(80); }
    const tReveal = await s.page.evaluate(() => { const t = performance.now(); document.querySelector('[data-v14-reveal]').click(); return +(performance.now() - t).toFixed(1); });
    const tAnswer = await s.page.evaluate(() => { const a = nextAction(), qq = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); const t = performance.now(); document.querySelector('[data-act="qbank-choice"][data-choice="' + qq.options.find(o => !qq.answerKeys.includes(o.key)).key + '"]').click(); return +(performance.now() - t).toFixed(1); });
    report.perf.transitionsMs = { revealOptions: tReveal, wrongAnswerToAutopsy: tAnswer };
    // 30-question driven session
    const t0 = Date.now(), actions = {}; let answered = 0, steps = 0, stepMs = [];
    const m0 = await metrics(s.page);
    while (answered < 30 && steps < 400) {
      const t = Date.now(); const a = await step(s.page); stepMs.push(Date.now() - t); steps++;
      actions[a] = (actions[a] || 0) + 1; if (/^answer|^retest/.test(a)) answered++;
      if (/^stuck/.test(a)) { actions.stuckAt = a; break; }
      await s.page.waitForTimeout(60);
    }
    await s.page.waitForTimeout(1500);
    const m1 = await metrics(s.page);
    stepMs.sort((a, b) => a - b);
    report.perf.session30 = { answered, steps, wallS: +((Date.now() - t0) / 1000).toFixed(1), stepP50ms: stepMs[Math.floor(stepMs.length / 2)], stepP95ms: stepMs[Math.floor(stepMs.length * 0.95)], before: m0, after: m1, heapGrowthMB: +(m1.heapMB - m0.heapMB).toFixed(1), listenerGrowth: m1.listeners - m0.listeners, maxCommonsInflight: s.log.maxInflight || 0, commonsCalls: s.log.commons.length, stateKB: await s.page.evaluate(() => Math.round((localStorage.getItem('intellectuality_v41_launch_state') || '').length / 1024)), actions, errors: s.log.errors.slice(0, 3) };
    // 20 duplicate renders must not grow listeners or nodes
    const d0 = await metrics(s.page);
    await s.page.evaluate(() => { for (let i = 0; i < 20; i++) render(); });
    await s.page.waitForTimeout(600);
    const d1 = await metrics(s.page);
    report.perf.duplicateRenders = { nodes: [d0.nodes, d1.nodes], listeners: [d0.listeners, d1.listeners] };
    await s.close();
  }
  fs.writeFileSync(path.join(OUT, 'report_' + LABEL + '.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error(e); process.exit(2); });
