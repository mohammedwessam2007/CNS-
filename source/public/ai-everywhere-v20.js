/* INTELLECTUALITY v20.3 · the professor on every screen (owner, 16 Nov 2026: "everything powered by AI, insert
 * the AI assistant in everything").
 *
 * The tutor drawer (tutor-ai-v19.js) is the brain; this file puts its doors where the work happens, and the
 * answer streams inline, under the thing being asked about:
 *   lesson page      → ▶ Learn this · Try first · Plan today, and on every section: Simpler · Quiz me · Memory hook · Draw it
 *   MCQ, unanswered  → 💡 Hint (never the answer: hint ladder only)
 *   MCQ, answered    → Why (my answer) · Every option · Twin question · As a case
 *   any picture      → 👁 Explain this picture · 🎯 Quiz me on it (the picture itself is sent to a vision model)
 *   mock result      → Analyse my mock (patterns, not facts, and tomorrow's 15 minutes)
 *   other screens    → 🧭 What now? · Explain this page
 *   sealed mock      → nothing: AI is off so the mock stays a real test
 * Every bar has an ع / EN switch (Egyptian Arabic with the English exam terms, or plain English).
 * Held-out items never travel: the MCQ bars only send practice items, or held-out items whose mock is over. */
(function () {
  "use strict";
  if (window.IX_AI_EVERYWHERE) return;
  const T = () => window.IX_TUTOR;
  const bank = () => (window.EHSAN_QBANK && window.EHSAN_QBANK.questions) || [];
  const qById = (id) => bank().find((q) => q.id === id);
  const cap = (s, n) => { s = String(s || "").replace(/\n{3,}/g, "\n\n").trim(); return s.length > n ? s.slice(0, n) + "\n…" : s; };
  const st = () => { try { return typeof S !== "undefined" ? S : null; } catch (e) { return null; } };
  const mock = () => { const t = T(); return !!(t && ((t.mockRunning && t.mockRunning()) || (t.blindOn && t.blindOn()))); };

  // a held-out item may go to the AI only after it was used in a finished mock (it is then just a reviewed item)
  function sendable(q) {
    if (!q) return false;
    if (q.split !== "heldout") return true;
    if (mock()) return false;
    // the same rule as consumedSet() in mcq-v16.js: answered already, or seen in a finished mock
    const s = st(); if (!s) return false;
    if (s.v16 && s.v16.q && s.v16.q[q.id]) return true;
    if (s.qbank && s.qbank.mockSeen && s.qbank.mockSeen[q.id]) return true;
    return (s.mockHistory || []).some((m) => (m.questionIds || []).includes(q.id));
  }

  function go(host, prompt, mode, extra, opts) {
    const t = T(); if (!t) return;
    if (!t.hasKey()) { t.openSetup ? t.openSetup("Add your key once, then tap the button again.") : t.open(); return; }
    t.ask(prompt, mode, extra, Object.assign({ inline: host }, opts || {}));
    const card = host.querySelector(":scope > .ixAiOut");
    if (card && card.scrollIntoView) card.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function bar(host, id, buttons, where) {
    if (!host) return null;
    // a bar whose main button has gone stale (the plan moved on) is drawn again
    const main = (buttons.find((x) => x.main) || {}).label || "", old = host.querySelector(':scope > .ixAiBar[data-ai="' + id + '"]');
    if (old && old.dataset.main === main) return null;
    if (old) old.remove();
    const b = document.createElement("div");
    b.className = "ixAiBar"; b.dataset.ai = id; b.dataset.main = main; b.setAttribute("role", "group"); b.setAttribute("aria-label", "Ask the professor");
    b.innerHTML = '<span class="ixAiMark">🧠</span>' + buttons.map((x, i) => '<button type="button" data-i="' + i + '"' + (x.main ? ' class="main"' : "") + ">" + x.label + "</button>").join("") + '<button type="button" class="ixAiLang" data-ai-lang title="Explain in Egyptian Arabic or English"></button>';
    b.addEventListener("click", (e) => {
      const k = e.target.closest("button"); if (!k) return;
      e.stopPropagation();
      if (k.hasAttribute("data-ai-lang")) { const t = T(); t.lang(t.lang() === "ar" ? "en" : "ar"); t.markLang(); return; }
      const x = buttons[+k.dataset.i]; if (x) x.run();
    });
    if (where === "start") host.prepend(b); else if (where && where.after) where.after.after(b); else host.appendChild(b);
    const t = T(); if (t && t.markLang) t.markLang();
    return b;
  }

  /* ── pictures: the figure goes to the professor model as an image ── */
  async function snap(fig) {
    const max = 1024;
    const toJpeg = (src, w, h) => { const k = Math.min(1, max / Math.max(w, h)), c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k); const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", 0.85); };
    try {
      const img = fig.matches("img") ? fig : fig.querySelector("img");
      const src = img ? img.currentSrc || img.src || "" : "";
      // a picture from another site (Wikimedia…) cannot be copied through a canvas: its web address goes instead,
      // and the model fetches it (so it works even before the phone has finished loading it)
      if (/^https:/.test(src) && new URL(src).origin !== location.origin) return src;
      if (img && img.complete && img.naturalWidth > 40) return toJpeg(img, img.naturalWidth, img.naturalHeight);
      const svg = fig.matches("svg") ? fig : fig.querySelector("svg");
      if (svg) {
        const r = svg.getBoundingClientRect(), xml = new XMLSerializer().serializeToString(svg);
        const url = URL.createObjectURL(new Blob([xml.includes("xmlns=") ? xml : xml.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')], { type: "image/svg+xml" }));
        const im = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
        const out = toJpeg(im, r.width || im.width || 600, r.height || im.height || 600); URL.revokeObjectURL(url); return out;
      }
    } catch (e) {}
    return null;
  }
  function figCaption(fig) {
    const near = fig.closest("a, figure, .realImg, .ctxCompanion") || fig.parentElement;
    const extra = [near && near.getAttribute("title"), near && near.querySelector("figcaption, .cap, small") && near.querySelector("figcaption, .cap, small").innerText, near && near.getAttribute("aria-label")];
    const lab = fig.closest(".v16Fig") && fig.closest(".v16Fig").querySelector(".v16FigLab");
    return [fig.dataset.v15Term, fig.dataset.v15Focus, lab && lab.innerText, (fig.querySelector("figcaption") || {}).innerText, (fig.querySelector("img") || {}).alt, (fig.matches("img") ? fig.alt : "")].concat(extra).filter(Boolean).map((x) => String(x).trim().slice(0, 200)).filter((x, i, a) => x && a.indexOf(x) === i).join(" · ") || ((document.getElementById("title") || {}).innerText || "");
  }
  function figureBar(fig) {
    if (fig.dataset.aiDone || !(fig.matches("img, svg") || fig.querySelector("img, svg"))) return;
    if (fig.closest(".ixAiBar, .ixAiOut, .ytPoster, .ytHero, .ctxVideo") || /ytimg\.com|youtube/.test(((fig.querySelector("img") || fig).src || ""))) return;
    if (fig.matches("svg") && fig.closest("figure, .realImg, .v15Pic")) return;
    const r = fig.getBoundingClientRect(), im = fig.matches("img") ? fig : fig.querySelector("img");
    if (r.width < 160 || (r.height < 100 && !(im && /^https:/.test(im.src || "")))) return;
    fig.dataset.aiDone = "1";
    const host = document.createElement("div"); host.className = "ixAiFig"; (fig.closest("a.realImg") || fig).after(host);
    const run = (mode, prompt) => async () => {
      const capn = figCaption(fig), img = await snap(fig);
      go(host, prompt + (capn ? " (" + capn + ")" : ""), mode, "PICTURE CAPTION: " + (capn || "(none)") + (img ? "" : "\n(The image could not be attached; work from the caption.)") + "\n\n" + T().relevanceText(capn), { images: img ? [img] : [] });
    };
    bar(host, "fig", [{ label: "👁 Explain this picture", run: run("picture", "Walk me through this picture") }, { label: "🎯 Quiz me on it", run: run("picquiz", "Quiz me on this picture like the practical exam") }]);
  }

  /* ── screens ── */
  // v21 zero-decision start: what is due from the memory deck first, then this page's learning loop
  function today(host) {
    const m = T().memory ? T().memory() : { due: 0 }, d = T().dayState ? T().dayState() : { left: 60, gate: null };
    if (d.gate) return { label: "✅ Done for today", main: true, run: () => (window.IX_PLAN ? IX_PLAN.open() : go(host, "Am I done for today?", "plan", "", { force: false })) };
    // v24: the exam plan decides what "today" is
    const ns = window.IX_PLAN && IX_PLAN.nextStep ? IX_PLAN.nextStep() : null;
    if (ns) return { label: "▶ Today: " + ns.step.label.replace(/^(Learn with the professor|10 MCQs|Write from a blank page|Blind check \(new questions, AI off\)): /, "").slice(0, 34) + " · " + d.left + " min left", main: true, run: () => IX_PLAN.runStep(ns.step) };
    return { label: (m.due ? "▶ Today · " + m.due + " to review" : "▶ Learn this with me") + " · " + d.left + " min left", main: true,
      run: () => m.due ? go(host, "Start my day: review what is due.", "review") : go(host, "Teach me this with the full loop, one step at a time.", "loop") };
  }
  function lesson(stage) {
    const chips = stage.querySelector(":scope > .chips");
    bar(stage, "lesson", [
      today(stage),
      { label: "Try first", run: () => go(stage, "Before I read, give me 2 questions on this lesson to try.", "tryfirst") },
      { label: "Plan today", run: () => go(stage, "Help me plan today's study in 2 minutes.", "plan") },
    ], chips ? { after: chips } : "start");
    stage.querySelectorAll(".v15Sec").forEach((sec) => {
      const head = sec.querySelector(".v15Head h3, h3"), name = head ? head.innerText.trim() : "this part";
      const extra = () => "SECTION (the part of the lesson the student is on):\n" + cap(sec.innerText, 2500) + "\n\n" + T().relevanceText(sec.innerText.slice(0, 600));
      bar(sec, "sec", [
        { label: "🤯 Simpler", run: () => go(sec, "I don't get “" + name + "”. Explain it simpler.", "simple", extra()) },
        { label: "❓ Quiz me", run: () => go(sec, "Quiz me on “" + name + "”.", "secquiz", extra()) },
        { label: "🔒 Memory hook", run: () => go(sec, "Give me a memory hook for “" + name + "”.", "palace", extra()) },
        { label: "✏️ Draw it", run: () => go(sec, "Make me draw “" + name + "” from memory.", "draw", extra()) },
      ]);
    });
  }
  function questionText(q, withKey, sel) {
    const opts = (q.options || []).map((o) => o.key + ") " + o.text).join("\n");
    let t = "QUESTION (" + (q.subject || "") + (q.chapter ? " · " + q.chapter : "") + "):\n" + q.stem + "\n" + opts;
    if (withKey) t += "\nKEY: " + (q.answerKeys || []).join(", ") + (q.answerText ? " (" + q.answerText + ")" : "") + (sel ? "\nSTUDENT CHOSE: " + sel + ((q.answerKeys || []).includes(sel) ? " (right)" : " (wrong)") : "");
    return t;
  }
  function mcq(stage) {
    const ex = stage.querySelector(".v16Explain[data-qid]"), pick = stage.querySelector(".v16Opt[data-qid]");
    const q = qById((ex || pick || {}).dataset ? (ex || pick).dataset.qid : null);
    if (!q || !sendable(q)) return;
    if (!ex) {
      const opts = stage.querySelector(".v16Opts");
      bar(stage, "q-" + q.id, [{ label: "💡 Hint (not the answer)", run: () => go(stage, "Give me a hint for this question, not the answer.", "hint", questionText(q, false)) }], opts ? { after: opts } : null);
      return;
    }
    const s = st(), cur = s && s.v16 && s.v16.cur, sel = cur && cur.id === q.id ? cur.sel : null;
    const ok = sel && (q.answerKeys || []).includes(sel);
    const extra = () => questionText(q, true, sel) + "\n\n" + T().relevanceText(q.stem);
    const next = stage.querySelector(".v16Next");
    bar(stage, "a-" + q.id, [
      { label: ok ? "💬 Why is it right?" : "💬 Why was I wrong?", main: true, run: () => go(stage, ok ? "I got it right. Make sure I understood why." : "I chose " + (sel || "?").toUpperCase() + ". Why was I wrong?", "optwhy", extra()) },
      { label: "Every option", run: () => go(stage, "Go through every option.", "optall", extra()) },
      { label: "🔁 Twin question", run: () => go(stage, "Give me a twin question on the same idea.", "twin", extra()) },
      { label: "🩺 As a case", run: () => go(stage, "Turn this idea into a patient case.", "case", extra()) },
    ], next ? { after: next } : null);
  }
  function result(stage) {
    bar(stage, "result", [{ label: "📊 Analyse my mock", main: true, run: () => go(stage, "Analyse my mock: what patterns are behind my misses?", "result", "RESULT:\n" + cap(stage.innerText, 4000)) }], "start");
  }
  function progressText() {
    const t = (id) => ((document.getElementById(id) || {}).innerText || "").trim();
    return "PROGRESS (what the app shows): " + [t("dayText"), t("sideDay"), t("sideCourse"), t("riskChip"), t("modeChip"), t("streak")].filter(Boolean).join(" · ");
  }
  function generic(host, id) {
    const page = () => "PAGE TEXT:\n" + cap(host.innerText, 3000) + "\n\n" + T().relevanceText(((document.getElementById("title") || {}).innerText || "") + " " + host.innerText.slice(0, 500));
    bar(host, id, [
      today(host),
      { label: "🤯 Simpler", run: () => go(host, "Explain what I am looking at, simpler.", "simple", page()) },
      { label: "❓ Quiz me", run: () => go(host, "Quiz me on this page.", "secquiz", page()) },
      { label: "🔒 Memory hook", run: () => go(host, "Give me a memory hook for this.", "palace", page()) },
      { label: "🧭 What now?", run: () => go(host, "What is the best thing to do right now?", "coach", progressText()) },
    ], "start");
  }

  // pictures worth asking about: course figures, the curated web pictures, and the app's own large drawings
  const PICS = "figure, .realImg, svg";
  function scan() {
    if (!T()) return;
    const player = document.getElementById("player");
    if (player) {
      if (mock()) { player.querySelectorAll(".ixAiBar, .ixAiFig").forEach((x) => x.remove()); }
      else {
        player.querySelectorAll(".v15Stage").forEach(lesson);
        player.querySelectorAll(".v16Q").forEach(mcq);
        player.querySelectorAll(".v16Result").forEach(result);
        player.querySelectorAll(".stage").forEach((s) => { if (!s.matches(".v15Stage, .v16Q, .v16Result, .v16Mock, .v16Stage")) generic(s, "page"); });
        player.querySelectorAll(PICS).forEach(figureBar);
      }
    }
    const drawer = document.getElementById("drawerBody");
    if (drawer && !mock() && drawer.innerText.trim().length > 40) {
      generic(drawer, "drawer");
      drawer.querySelectorAll(PICS).forEach(figureBar);
    }
  }
  let raf = 0;
  const later = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; try { scan(); } catch (e) {} }); };
  function start() {
    const mo = new MutationObserver((list) => { for (const m of list) { if (m.target.closest && m.target.closest(".ixAiBar, .ixAiOut, .ixAiFig")) continue; later(); return; } });
    ["player", "drawerBody"].forEach((id) => { const el = document.getElementById(id); if (el) mo.observe(el, { childList: true, subtree: true }); });
    // a picture that finishes loading changes nothing in the page structure, so it is watched on its own
    document.addEventListener("load", (e) => { if (e.target && e.target.tagName === "IMG") later(); }, true);
    later();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.IX_AI_EVERYWHERE = { scan, snap, sendable };
})();
