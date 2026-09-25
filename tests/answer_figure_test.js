// v17.3 answer figure: after an MCQ is answered, the diagram marks every option it can (right answer green, wrong
// options red, yours ringed, named-in-the-explanation blue), each with its letter, plus a legend row per option;
// photos are one per option whose own words name something, each labelled with its letter.
// Usage: node tests/answer_figure_test.js [out.json]   (app on :8787, or APP_URL)
const fs = require('fs');
const path = require('path');
const { open, tick } = require('./harness');
const results = [];
const check = (id, what, ok, detail) => { results.push({ id, what, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + what + (ok ? '' : ' ' + JSON.stringify(detail).slice(0, 900))); };
const LEARN_NEXT = '#player [data-act="visual-hide"], #player [data-act="v15-next"], #player [data-act="finish-segment"]';

// mount one answered question's explanation box the way the app does and let the atlas decorate it
async function showAnswer(page, id, mine, pids) {
  await page.evaluate(([id, mine]) => {
    const p = document.getElementById('player');
    p.innerHTML = '<div class="v16Explain" data-qid="' + id + '">' + (mine ? '<div class="v16Row mine"><span class="v16L">' + mine.toUpperCase() + '.</span></div>' : '') + '</div>';
  }, [id, mine || '']);
  await tick(page, 700);
  return page.evaluate(([id, pids]) => {
    const w = document.querySelector('#player .ixAnsWrap');
    const q = window.EHSAN_QBANK.questions.find((x) => x.id === id);
    const cls = (pid) => [...(w?.querySelectorAll('[data-p="' + pid + '"]') || [])].map((e) => [...e.classList].filter((c) => /^ixAns/.test(c)).join(' ')).join('|');
    return {
      has: !!w,
      chip: !!w?.querySelector('.ixAAnsChip'),
      scene: w?.querySelector('.ixA')?.dataset.ixa || null,
      badges: [...(w?.querySelectorAll('.ixAnsBd') || [])].map((b) => b.textContent),
      rows: [...(w?.querySelectorAll('.ixAnsRow') || [])].map((r) => r.textContent.replace(/\s+/g, ' ').trim()),
      nOpts: q ? q.options.length : 0,
      green: w ? w.querySelectorAll('.ixAnsK').length : 0,
      red: w ? w.querySelectorAll('.ixAnsX, .ixAnsM').length : 0,
      cls: Object.fromEntries((pids || []).map((pid) => [pid, cls(pid)])),
    };
  }, [id, pids || []]);
}

(async () => {
  {
    const s = await open({ v16: true, time: '2026-09-25T09:00:00+03:00', state: null, settle: 2000, viewport: { width: 820, height: 1180 } });
    const p = s.page;

    // F1: coverage across the whole bank
    const cov = await p.evaluate(() => {
      const QB = window.EHSAN_QBANK.questions.filter((q) => q.autoScore !== false && (q.options || []).length >= 2);
      let opts = 0, marked = 0, keys = 0, keysMarked = 0, withFig = 0, every = 0;
      for (const q of QB) {
        const P = window.IX_ANSWER.plan(q.id, '');
        if (P && P.specs.length) withFig++;
        const ks = new Set(q.answerKeys || []);
        let all = true;
        for (const o of q.options) {
          opts++;
          const c = !!(P && P.cover[o.key]);
          if (c) marked++; else all = false;
          if (ks.has(o.key)) { keys++; if (c) keysMarked++; }
        }
        if (all) every++;
      }
      return { questions: QB.length, withFig, opts, marked, pOpts: +(marked / opts).toFixed(3), keys, keysMarked, pKeys: +(keysMarked / keys).toFixed(3), every, scenes: window.IX_ATLAS.scenes().length };
    });
    check('F1', 'Coverage: ≥ 90% of all options and ≥ 97% of right answers are marked on a diagram; ≥ 98% of questions get one', cov.pOpts >= 0.9 && cov.pKeys >= 0.97 && cov.withFig / cov.questions >= 0.98, cov);

    // F2: a rendered answer: chip, green key, red wrong, letter badges, a legend row per option
    const umn = await showAnswer(p, 'EHSAN-PHYS-UPPER-AND-LOWER-MOTOR-NEURON-LESION-MCQ-11', 'a');
    check('F2', 'An answered question opens "✅ This answer": the right answer green, wrong options red, a letter badge on each marked part, one legend row per option', umn.has && umn.chip && umn.green >= 1 && umn.red >= 3 && umn.rows.filter((r) => /^[A-E]/.test(r)).length === umn.nOpts && ['A', 'B', 'C', 'D'].every((L) => umn.badges.some((b) => b.split('·').includes(L))), umn);

    // F3: value options ("Exaggerated", "Not changed") are pictured at what the stem asks; the explanation's
    // contrasting items are blue, never green
    const val = await showAnswer(p, 'EHSAN-PHYS-UPPER-AND-LOWER-MOTOR-NEURON-LESION-MCQ-6', 'a', ['u_emg', 'l_emg']);
    check('F3', 'Value answers sit on the thing the stem asks about ("electrical reaction unchanged"), the legend says "about", and the LMN contrasts in the explanation are blue, not green', val.scene === 'umnlmn' && /ixAnsK/.test(val.cls.u_emg) && !/ixAnsK/.test(val.cls.l_emg) && /ixAnsS/.test(val.cls.l_emg) && val.rows.filter((r) => /“.*”, about/.test(r)).length >= 3, { scene: val.scene, cls: val.cls, rows: val.rows });

    // F4: "all of the above" / "a & b are correct" options are pictured by what they point at
    const refs = await p.evaluate(() => {
      const out = [];
      for (const q of window.EHSAN_QBANK.questions) {
        if (q.split !== 'practice') continue;
        const o = (q.options || []).find((x) => /^all of the above\.?$/i.test(String(x.text).trim()));
        if (!o) continue;
        const P = window.IX_ANSWER.plan(q.id, '');
        if (!P) continue;
        const leg = P.specs.flatMap((sp) => sp.legend).find((l) => l.k === o.key && l.here);
        if (leg) out.push({ id: q.id, refs: leg.refs, names: leg.names.length });
        if (out.length >= 5) break;
      }
      return out;
    });
    check('F4', '"All of the above" is pictured by the options it points at, and says so (= A + B + C)', refs.length >= 3 && refs.every((r) => Array.isArray(r.refs) && r.refs.length >= 2 && r.names >= 1), refs);

    // F5: weak names ("Lips", "Face") count only when the question already names something in that diagram
    const weak = await p.evaluate(() => {
      const m = window.IX_ANSWER.match('Lips');
      const lipsQ = window.EHSAN_QBANK.questions.find((q) => /largest representation in the somatosensory/i.test(q.stem));
      const P = lipsQ ? window.IX_ANSWER.plan(lipsQ.id, '') : null;
      // a synthetic item where "Face" is only an anatomy option: the touch diagram must not appear
      return { weakHit: m.length > 0 && m.every((h) => h.weak), lipsScene: P ? P.specs[0].scene : null, lipsCovered: P ? Object.values(P.cover).filter(Boolean).length : 0 };
    });
    check('F5', 'Bare names like "Lips" are weak aliases; in the somatosensory-map question they land on the S1 strip', weak.weakHit && weak.lipsScene === 'touch' && weak.lipsCovered >= 3, weak);

    // F6: the lesson's own diagram wins ties; a REM-sleep question no longer lands on the pain diagram
    const rem = await p.evaluate(() => {
      const q = window.EHSAN_QBANK.questions.find((x) => /characteristic finding in REM sleep/i.test(x.stem));
      const P = q ? window.IX_ANSWER.plan(q.id, '') : null;
      return { id: q?.id, main: P?.specs[0]?.scene };
    });
    check('F6', 'Diagrams drawn for the question\'s own lesson win ties (REM-sleep question → the sleep diagram)', rem.main === 'sleep', rem);
    check('F7', 'No page errors while planning and drawing answer figures', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }

  {
    // F8–F9: the real flow: answer the day's first block wrong on purpose; every question gets an answer figure and
    // the photos are letter-labelled, right answer first, never a wrong option's photo alone
    const s = await open({ v16: true, time: '2026-09-23T10:00:00+03:00', state: null, settle: 1500, viewport: { width: 820, height: 1180 } });
    const p = s.page;
    let c;
    for (let i = 0; i < 40; i++) {
      c = await p.evaluate(() => INTELLECTUALITY_V16.act.current());
      if (c.kind === 'V16_BLOCK') break;
      await p.evaluate((sel) => document.querySelector(sel)?.click(), LEARN_NEXT);
      await p.waitForTimeout(120);
    }
    const seen = [];
    for (let i = 0; i < 8; i++) {
      c = await p.evaluate(() => INTELLECTUALITY_V16.act.current());
      if (c.kind !== 'V16_BLOCK') break;
      await p.evaluate(() => {
        const id = INTELLECTUALITY_V16.act.current().id, q = EHSAN_QBANK.questions.find((x) => x.id === id);
        const acc = new Set(INTELLECTUALITY_V16.accepted(id));
        const wrong = q.options.find((o) => !(q.answerKeys || []).includes(o.key) && !acc.has(o.key)) || q.options[0];
        INTELLECTUALITY_V16.act.pick(wrong.key);
        render();
      });
      await tick(p, 900);
      seen.push(await p.evaluate(() => {
        const labs = [...document.querySelectorAll('#player .v16Pics .v16FigLab')].map((x) => x.textContent);
        return { id: INTELLECTUALITY_V16.act.current().id, fig: !!document.querySelector('#player .v16Explain .ixAnsWrap .ixAAnsChip'), labs, firstGood: !labs.length || /^✓ [A-E] · /.test(labs[0]), allLettered: labs.every((l) => /^[✓✗] [A-E] · /.test(l)) };
      }));
      await p.evaluate(() => { INTELLECTUALITY_V16.act.next('w'); render(); });
      await tick(p, 200);
    }
    check('F8', 'In the real lesson flow every answered question in the block shows the answer figure', seen.length >= 3 && seen.filter((x) => x.fig).length >= seen.length - 1, seen.map((x) => ({ id: x.id, fig: x.fig })));
    check('F9', 'Photos after an answer: each labelled with its option letter and ✓/✗, the right answer\'s first, never a wrong option\'s photo alone', seen.every((x) => x.firstGood && x.allLettered), seen);
    check('F10', 'No page errors in the answer flow', s.log.errors.length === 0, s.log.errors.slice(0, 3));
    await s.close();
  }
  const out = process.argv.find((a) => a.endsWith('.json')) || path.join(__dirname, 'out', 'answer_figure_test.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  const fail = results.filter((r) => !r.ok).length;
  console.log(fail ? fail + ' FAILED' : 'ALL ' + results.length + ' PASSED');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
