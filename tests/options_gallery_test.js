// "Every option, pictured": never before the answer; after a correct answer all options, after a
// wrong answer the other options (key + pick are in the autopsy compare). No image repeats on a
// screen. Plus a 40-item sample: how many options get a picture whose title names them.
const fs = require("fs");
const { open } = require("./harness");
const results = [];
function check(id, name, ok, ev) {
  results.push({ id, name, ok: !!ok, ev });
  console.log((ok ? "PASS " : "FAIL ") + id.padEnd(4) + " " + name + "  · " + JSON.stringify(ev).slice(0, 240));
}
async function toQuestion(page, max = 14) {
  for (let i = 0; i < max; i++) {
    const k = await page.evaluate(() => { const a = nextAction(); return a.kind + ":" + (a.seg?.type || ""); });
    if (k === "SEGMENT:question") return true;
    const clicked = await page.evaluate(() => { const b = document.querySelector('#player [data-act="visual-hide"], #player [data-act="finish-segment"], #player [data-act="finish-qbank"]'); if (b) { b.click(); return true; } return false; });
    await page.waitForTimeout(160);
    if (!clicked) return false;
  }
  return false;
}
const currentQ = (page) => page.evaluate(() => { const a = nextAction(); const q = qbankForLesson(a.l, a.d, a.seg.questionIndex || 0); return { id: q.id, keys: q.answerKeys, opts: q.options.map((o) => o.key) }; });
const gallery = (page) => page.evaluate(() => {
  const g = document.querySelector(".v14OptGallery");
  if (!g) return null;
  const cells = [...g.querySelectorAll("[data-v14-opt]")].map((c) => ({ opt: c.dataset.v14Opt, pic: c.querySelector(".v14Visual")?.dataset.v14Vkey || null, missing: !!c.querySelector(".v14VisualMissing"), skeleton: !!c.querySelector(".v14Skeleton"), tag: c.querySelector(".v14OptTag")?.textContent }));
  const onScreen = [...document.querySelectorAll("#player .v14Visual[data-v14-vkey]")].map((a) => a.dataset.v14Vkey);
  return { which: g.dataset.v14Which, cells, dupOnScreen: onScreen.length - new Set(onScreen).size };
});
(async () => {
  // ── correct answer
  let s = await open({ time: "2026-09-22T10:00:00+03:00", state: null, settle: 1200 });
  let { page, log } = s;
  await toQuestion(page);
  let q = await currentQ(page);
  await page.waitForTimeout(600);
  const pre1 = await page.evaluate(() => document.querySelectorAll(".v14OptGallery, [data-v14-opts]").length);
  await page.evaluate(() => document.querySelector("[data-v14-reveal]")?.click());
  await page.waitForTimeout(300);
  const pre2 = await page.evaluate(() => ({ gal: document.querySelectorAll(".v14OptGallery, [data-v14-opts]").length, opts: document.querySelectorAll('[data-act="qbank-choice"]').length }));
  check("O1", "Before answering (primer, and options shown): no option pictures at all", pre1 === 0 && pre2.gal === 0 && pre2.opts === q.opts.length, { pre1, pre2 });
  await page.evaluate(() => document.querySelector('[data-conf="confident"]')?.click());
  await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]')?.click(), q.keys[0]);
  await page.waitForTimeout(3500);
  const g1 = await gallery(page);
  check("O2", "Correct answer: every option has its own card (✓ correct marked)", g1 && g1.which === "all" && g1.cells.length === q.opts.length && g1.cells.some((c) => /CORRECT/.test(c.tag)), g1);
  check("O3", "Each option card shows a picture or an honest 'no trustworthy picture' note; none repeated on screen", g1 && g1.cells.every((c) => !c.skeleton && (c.pic || c.missing)) && g1.dupOnScreen === 0, g1 && { cells: g1.cells.map((c) => c.pic ? "pic" : "note"), dup: g1.dupOnScreen });
  const err1 = [...log.errors];
  await s.close();

  // ── wrong answer (autopsy)
  s = await open({ time: "2026-09-22T11:00:00+03:00", state: null, settle: 1200 });
  ({ page, log } = s);
  await toQuestion(page);
  q = await currentQ(page);
  await page.evaluate(() => document.querySelector("[data-v14-reveal]")?.click());
  await page.waitForTimeout(250);
  const wk = q.opts.find((k) => !q.keys.includes(k));
  await page.evaluate(() => document.querySelector('[data-conf="confident"]')?.click());
  await page.evaluate((k) => document.querySelector('[data-act="qbank-choice"][data-choice="' + k + '"]')?.click(), wk);
  await page.waitForTimeout(5000);
  const g2 = await gallery(page);
  const inAutopsy = await page.evaluate(() => !!document.querySelector(".v14Autopsy .v14OptGallery"));
  const expected = q.opts.filter((k) => !q.keys.includes(k) && k !== wk);
  check("O4", "Wrong answer: the autopsy pictures the OTHER options (key + your pick are already side by side)", g2 && inAutopsy && g2.which === "others" && g2.cells.length === expected.length && g2.cells.every((c) => expected.includes(c.opt)), { g2, expected });
  check("O5", "Autopsy option cards hydrate; no image repeats across compare panel and option cards", g2 && g2.cells.every((c) => !c.skeleton && (c.pic || c.missing)) && g2.dupOnScreen === 0, g2 && { dup: g2.dupOnScreen });
  const err2 = [...log.errors];

  // ── 40-item sample through the real hydration (post-answer context, first wrong option as the pick)
  const sample = await page.evaluate(async () => {
    const pool = EHSAN_QBANK.questions.filter((x) => x.split === "practice" && x.autoScore);
    const step = Math.floor(pool.length / 40), out = [];
    for (let i = 0; i < 40; i++) {
      const q = pool[i * step];
      const sel = q.options.find((o) => !q.answerKeys.includes(o.key))?.key || "";
      const host = document.createElement("div");
      host.style.cssText = "position:fixed;left:0;top:0;width:700px";
      host.innerHTML = '<div class="v14Why">' + INTELLECTUALITY_V14.optionsGallery(q.id, sel, "all") + "</div>";
      document.body.appendChild(host);
      await INTELLECTUALITY_V14.hydrateOptions(host.querySelector("[data-v14-opts]"));
      const cells = [...host.querySelectorAll("[data-v14-opt]")].map((c) => ({ opt: c.dataset.v14Opt, text: q.options.find((o) => o.key === c.dataset.v14Opt).text, title: c.querySelector(".v14Visual .v14Cap i")?.textContent || null, key: c.querySelector(".v14Visual")?.dataset.v14Vkey || null }));
      host.remove();
      out.push({ id: q.id, subject: q.subject, stem: q.stem.slice(0, 90), cells });
    }
    return out;
  });
  const all = sample.flatMap((r) => r.cells), pictured = all.filter((c) => c.key);
  const dupInItem = sample.filter((r) => { const k = r.cells.map((c) => c.key).filter(Boolean); return k.length !== new Set(k).size; }).length;
  check("O6", "40-item sample: no item repeats an image across its options", dupInItem === 0, { items: sample.length, options: all.length, pictured: pictured.length, pct: +(100 * pictured.length / all.length).toFixed(1), dupInItem });
  check("O7", "No page errors", err1.length === 0 && err2.length === 0 && log.errors.length === 0, { err1, err2, err3: log.errors });
  await s.close();
  fs.writeFileSync(process.argv[2] || "out/options_gallery.json", JSON.stringify({ results, sample }, null, 1));
  const pass = results.filter((r) => r.ok).length;
  console.log(`\n${pass}/${results.length} option-gallery checks passed · pictured ${pictured.length}/${all.length} options in the 40-item sample`);
  process.exit(pass === results.length ? 0 : 1);
})();
