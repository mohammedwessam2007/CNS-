/* INTELLECTUALITY v39 · every MCQ teaches, offline.
 *  - where(q): the lesson part of the course that teaches this question, and the sentence in it that holds the answer
 *    (term match weighted by rarity, the key's words count more). Shown under every answer, no AI needed, with a button
 *    that opens the lesson at that part.
 *  - sibling(q, pool): a DIFFERENT question on the same fact (same chapter, most shared rare terms). The retest law of
 *    the CNS course: a miss comes back tomorrow as a changed question, and the exact one a few days later, so the
 *    fact is learned, not the letter. */
(function () {
  "use strict";
  if (window.IX_TEACH) return;
  const STOP = new Set("this that with from which what when where there their these those than then they them were have been being into onto over under about after before most more less least each every following true false except regarding related other only also very such between through because while during would could should does done here your what's which's following".split(" "));
  const stem = (w) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, "").replace(/(ing|ed)$/, "");
  const terms = (s) => String(s || "").toLowerCase().replace(/\|\|[^|]*\|\|/g, " ").match(/[a-z][a-z0-9-]{3,}/g)?.filter((w) => !STOP.has(w)).map(stem) || [];
  // single terms plus two-word phrases ("inferior_mesenteric"), so a sentence that says the exact structure wins
  const grams = (s) => { const t = terms(s), out = t.slice(); for (let i = 1; i < t.length; i++) out.push(t[i - 1] + "_" + t[i]); return out; };
  let IDX = null;
  function build() {
    const T = window.IX_LESSON_TEXT || {}, L = window.IX_LESSON, sents = [], df = {};
    const subj = {}; try { (L && L.all ? L.all() : []).forEach((l) => (subj[l.key] = l.subject)); } catch (e) {}
    Object.keys(T).forEach((key) => {
      let ps = []; try { ps = L && L.parts ? L.parts(String(T[key])) : []; } catch (e) {}
      if (!ps.length) ps = [{ h: "", md: String(T[key]) }];
      ps.forEach((p, i) => {
        if (/say it back/i.test(p.h)) return;
        String(p.md).replace(/\|\|([^|]*)\|\|/g, " $1 ").replace(/@@[A-Z]+[^@]*@@/g, " ").split(/(?<=[.!?])\s+|\n+/).forEach((raw) => {
          const t = raw.replace(/^[>\-*•\d.\s]+/, "").replace(/\*\*/g, "").replace(/🤔 Think:\s*/, "").trim();
          if (t.length < 25 || t.length > 420 || /\?$/.test(t)) return;
          const tm = new Set(grams(t)); if (tm.size < 5) return;
          tm.forEach((w) => (df[w] = (df[w] || 0) + 1));
          sents.push({ key, part: i, h: p.h, t, tm, subject: subj[key] || "" });
        });
      });
    });
    const N = sents.length || 1, idf = (w) => Math.log(1 + N / (df[w] || 0.5));
    IDX = { sents, idf };
    return IDX;
  }
  const keyText = (q) => (q.options || []).filter((o) => (q.answerKeys || []).includes(o.key)).map((o) => o.text).join(" ");
  function where(q) {
    const I = IDX || build(); if (!I.sents.length) return null;
    const qs = new Set(grams(q.stem)), ks = new Set(grams(keyText(q)));
    let best = null, bs = 0;
    I.sents.forEach((s) => {
      if (q.subject && s.subject && s.subject !== q.subject) return;
      let sc = 0, hitQ = 0, kId = 0;
      s.tm.forEach((w) => { if (ks.has(w)) { sc += 1.6 * I.idf(w); kId += I.idf(w); } if (qs.has(w)) { sc += I.idf(w); hitQ++; } });
      if (!hitQ || (ks.size && kId < 3.5)) return;
      if (sc > bs) { bs = sc; best = s; }
    });
    if (!best || bs < 12) return null;
    let title = best.key; try { const l = window.IX_LESSON.find(best.key); if (l) title = l.title; } catch (e) {}
    return { key: best.key, part: best.part, heading: best.h.replace(/^\d+\.\s*/, ""), sentence: best.t, title, score: Math.round(bs) };
  }
  function overlap(a, b) {
    const I = IDX || build(), A = new Set(grams(a.stem + " " + keyText(a))), B = new Set(grams(b.stem + " " + keyText(b)));
    let s = 0; A.forEach((w) => { if (B.has(w)) s += I.idf(w); }); return s;
  }
  function sibling(q, pool) {
    const c = (pool || []).filter((x) => x.id !== q.id && x.chapter === q.chapter && x.stem !== q.stem);
    let best = null, bs = 0; c.forEach((x) => { const s = overlap(q, x); if (s > bs) { bs = s; best = x; } });
    return bs >= 8 ? best : null;
  }
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  function html(q) {
    const w = where(q); if (!w) return "";
    return '<div class="ixTeach"><b>📖 From the course</b><p>' + E(w.sentence) + '</p><button type="button" class="ixHlink" data-teach="' + E(w.key) + '" data-part="' + w.part + '">Open "' + E(w.title) + '" at ' + E(w.heading || "this part") + " →</button></div>";
  }
  function wire(root, before) {
    root.querySelectorAll("[data-teach]").forEach((b) => (b.onclick = () => { try { if (before) before(); window.IX_LESSON.open(b.dataset.teach, +b.dataset.part); } catch (e) {} }));
  }
  window.IX_TEACH = { where, sibling, html, wire, _terms: terms, _reset: () => (IDX = null) };
})();
