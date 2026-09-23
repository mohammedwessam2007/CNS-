// Bank-wide frontier metrics (answer-aware, post-answer engine only):
//  - autopsy class distribution over EVERY (practice MCQ, wrong option) pair
//  - share with a pairwise contrast (true look-alike discriminator)
//  - primer model-paragraph relevance: concept agreement + stem-token overlap
const fs = require("fs");
const { open } = require("./harness");
(async () => {
  const s = await open({ time: "2026-09-23T10:00:00+03:00", state: null, settle: 1200 });
  const r = await s.page.evaluate(() => {
    const V = INTELLECTUALITY_V14, qs = EHSAN_QBANK.questions.filter((q) => q.split === "practice" && q.autoScore);
    const cls = {}, byCat = {}; let pairs = 0, pairwise = 0, frame = 0;
    const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, " ");
    let model = { n: 0, noModel: 0, conceptAgree: 0, stemHit0: 0 }, lowRel = [];
    for (const q of qs) {
      for (const o of q.options.filter((o) => !q.answerKeys.includes(o.key))) {
        const a = V.autopsy(q.id, o.key); pairs++;
        cls[a.cls] = (cls[a.cls] || 0) + 1;
        if (a.contrast) pairwise++; else if (a.frame) frame++;
        (byCat[q.subject] = byCat[q.subject] || { pairs: 0, pairwise: 0 }).pairs++;
        if (a.contrast) byCat[q.subject].pairwise++;
      }
      const pc = V.primerContent(q.id); model.n++;
      if (!pc.model) { model.noModel++; continue; }
      const qc = V.conceptsForQ(q.id)[0];
      const stemT = new Set(norm(q.stem).split(" ").filter((w) => w.length > 4));
      const hits = [...stemT].filter((w) => norm(pc.model).includes(w)).length;
      if (!hits) { model.stemHit0++; if (lowRel.length < 400) lowRel.push({ id: q.id, subject: q.subject, stem: q.stem.slice(0, 110), concept: qc || null, model: pc.model.slice(0, 220) }); }
    }
    return { questions: qs.length, pairs, pairwise, frame, cls, byCat, model, lowRel };
  });
  fs.writeFileSync(process.argv[2] || require("path").join(__dirname, "out", "frontier_metrics.json"), JSON.stringify(r, null, 1));
  console.log(JSON.stringify({ questions: r.questions, pairs: r.pairs, pairwise: r.pairwise, pairwisePct: +(100 * r.pairwise / r.pairs).toFixed(1), frame: r.frame, cls: r.cls, byCat: r.byCat, model: r.model }, null, 1));
  await s.close();
})();
