/* INTELLECTUALITY v27 · the high-yield sheet, one per unit (owner, 19 Nov 2026: "the high yield… better than the
 * lectures… absorb the teaching methods on YouTube… mnemonics, everything").
 *
 * Three layers, most trustworthy first:
 *  1 WHAT THE EXAMINERS KEEP ASKING (no AI, instant, offline): every keyed past-paper answer in the unit, grouped by
 *    the fact it tests and ranked by how many papers asked it, with the sources; the unit's written questions with
 *    their years; the department reference answers' headings.
 *  2 THE SHEET (the professor, once per unit, kept on the device): built from layer 1, the references and the
 *    owner's notes, in the teaching styles that work best on YouTube (methods, never their content): the story and
 *    analogy (Osmosis), the whiteboard drawn step by step (Ninja Nerd), concept → patient (Armando), absurd mnemonics
 *    and a visual scene (Dirty Medicine, Sketchy), tight high-yield bullets (Boards & Beyond), first principles
 *    (Khan Academy); then the examiners' traps, tables, rapid recall, and the written skeletons.
 *  3 WATCH AT 2x: search links for the unit on the channels whose method the sheet uses.
 * CNS chapters use the practice half of the CNS bank only (held-out items never travel). */
(function () {
  "use strict";
  if (window.IX_HY) return;
  const T = () => window.IX_TUTOR, GB = () => window.IX_GIT206 || { mcq: [], written: [] };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const CACHE = "ix_hy_v1", VER = 1;
  const cache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || "{}") || {}; } catch (e) { return {}; } };
  const putCache = (id, text) => { const c = cache(); c[id] = { v: VER, text, at: Date.now() }; try { localStorage.setItem(CACHE, JSON.stringify(c)); } catch (e) { /* storage full: the sheet still shows this time */ } };

  /* ── units: the 28 GIT units of the plan, and the CNS chapters ── */
  function unit(id) {
    if (/^CNS:/.test(id)) {
      const ch = id.slice(4), Q = ((window.EHSAN_QBANK && EHSAN_QBANK.questions) || []).filter((q) => q.split === "practice" && q.chapter === ch);
      return { id, name: ch, subject: (Q[0] && Q[0].subject ? Q[0].subject.charAt(0) + Q[0].subject.slice(1).toLowerCase() : "CNS"), module: "NEU-205 (CNS)", qs: Q.map((q) => ({ stem: q.stem, key: (q.answerKeys || []).map((k) => ((q.options || []).find((o) => o.key === k) || {}).text).filter(Boolean).join(" / ") || q.answerText || "", source: q.sourceTag || "" })), written: [] };
    }
    const u = window.IX_PLAN ? IX_PLAN.units().find((x) => x.id === id) : null; if (!u) return null;
    const Q = GB().mcq.filter((q) => q.answerKeys.length && u.pred(q));
    return { id, name: u.name, subject: u.subject, module: "DIG-206", qs: Q.map((q) => ({ stem: q.stem, key: q.options.filter((o) => q.answerKeys.includes(o.key)).map((o) => o.text).join(" / "), source: q.source })), written: u.written };
  }
  // layer 1: facts the past papers test, grouped by the key answer, ranked by how many papers asked them
  function facts(u) {
    const norm = (t) => String(t).toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\b(the|a|an|of|and|is|are|in|to|by)\b/g, " ").replace(/\s+/g, " ").trim();
    const g = new Map();
    u.qs.forEach((q) => {
      if (!q.key) return;
      const k = norm(q.key).slice(0, 60); if (!k) return;
      const x = g.get(k) || { key: q.key, stems: [], sources: new Set() };
      x.stems.push(q.stem); if (q.source) x.sources.add(q.source); g.set(k, x);
    });
    return Array.from(g.values()).map((x) => ({ key: x.key, stem: x.stems[0], n: x.stems.length, sources: Array.from(x.sources) })).sort((a, b) => b.n - a.n || b.sources.length - a.sources.length);
  }
  function refsFor(u) {
    const R = window.IX_GIT206_REF || {}, out = [];
    (u.written || []).forEach((w) => (R[w.topic] || []).forEach((r) => out.push(r)));
    return out;
  }
  const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

  /* ── layer 2: the professor writes the sheet ── */
  const STYLE = [
    "You are writing ONE high-yield revision sheet that must teach this unit better than the lecture did, for a 2nd-year Kasr Al Ainy medical student with ADHD (plain English, exam terms in English). It will be read on a phone, then reviewed again before the exam.",
    "Use the teaching METHODS that work best on YouTube (never copy anyone's content): the story and an everyday analogy (Osmosis); the diagram built step by step as if drawing on a whiteboard, saying what to draw first, then next (Ninja Nerd); from the concept to the patient (Armando Hasudungan); absurd, vivid mnemonics and a visual scene where every object stands for a fact (Dirty Medicine, Sketchy); tight high-yield bullets (Boards & Beyond); first principles (Khan Academy).",
    "GROUNDING: the PAST-PAPER FACTS and the REFERENCE ANSWERS below are the standard: every one of the top facts must appear somewhere in the sheet. Use standard textbook knowledge only to connect them, and never contradict the references. If unsure of a fact, leave it out.",
    "FORMAT, exactly these sections, in this order, with these headings (markdown: ## headings, - bullets, **bold**, | tables |):",
    "## 🎯 The point — one sentence: why this unit exists in the body and in the exam.",
    "## 📖 The story — 4-6 lines, the unit as a story with one everyday analogy.",
    "## ✏️ Whiteboard — draw it step by step: 'Draw…', 'Now add…', 'Label…' (6-10 steps), ending with what the finished drawing shows; what an examiner wants labelled.",
    "## ⚙️ Mechanisms — the 2-4 causal chains as arrows (cause → mechanism → effect → exam fact).",
    "## 📋 Must-know tables — 1-3 small tables of the comparisons the examiners love (look-alikes side by side).",
    "## 🔥 What the examiners keep asking — the top past-paper facts as bullets, most-asked first, each with its trap in a few words.",
    "## 🧠 Mnemonics — 2-5 mnemonics for the arbitrary lists (contents, branches, relations, order): absurd and vivid; one visual scene (Sketchy-style) where each object = one fact. Facts exactly as the course states them; the list count must match what is asked.",
    "## 🩺 Clinical hooks — 2-4 patient one-liners linking a finding to the structure or mechanism.",
    "## ⚡ Rapid recall — 10 questions, each followed by its answer wrapped in double pipes, like: 1. Which…? ||the answer||",
    "## 📝 Written skeletons — for each written question given: the verb's structure and the skeleton (headings and key points only) that scores full marks.",
    "Keep it dense and scannable: short lines, no padding, no introductions, no closing remarks.",
  ].join("\n");
  async function generate(u) {
    const key = localStorage.getItem("ix_tutor_key_v1"); if (!key) throw new Error("add your OpenRouter key in 🧠 Tutor → ⚙︎ first");
    const t = T(); if (t && t.spend && t.cap && t.spend().usd >= t.cap()) throw new Error("this week's AI budget is used up (⚙︎ to raise it)");
    const F = facts(u).slice(0, 30), R = refsFor(u), notes = (t && t.notesFor) ? t.notesFor("GIT 206 · " + u.name) : "";
    const X = window.IX_EXAMINER ? (/CNS/.test(u.module) ? IX_EXAMINER.cns : IX_EXAMINER.git) : "";
    const user = "UNIT: " + u.module + " · " + u.subject + " · " + u.name +
      "\n\nPAST-PAPER FACTS (the key answers the examiners test, most-asked first; n = how many papers):\n" + (F.length ? F.map((f) => "- [n=" + f.n + (f.sources.length ? "; " + f.sources.slice(0, 3).join(", ") : "") + "] " + f.stem.slice(0, 160) + " → " + f.key).join("\n") : "(no keyed past MCQs for this unit: build from the references and the course)") +
      (u.written && u.written.length ? "\n\nWRITTEN QUESTIONS ASKED ON THIS UNIT:\n" + u.written.map((w) => "- " + w.questions[0].q + " (asked " + w.times + "×: " + w.years.join(", ") + ")").join("\n") : "") +
      (R.length ? "\n\nREFERENCE ANSWERS (department-style revision notes):\n" + R.slice(0, 4).map((r) => "[" + r.src + "] " + r.head + "\n" + r.text.slice(0, 1400)).join("\n\n") : "") +
      (notes ? "\n\nHIS LECTURE NOTES (what the doctors stressed):\n" + notes.slice(0, 3000) : "") + (X ? "\n\n" + X : "");
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
      body: JSON.stringify({ model: localStorage.getItem("ix_tutor_model_pro_v1") || "openai/gpt-6.2-sol-pro", max_tokens: 3500, usage: { include: true }, messages: [{ role: "system", content: STYLE }, { role: "user", content: user }] }) });
    if (!r.ok) throw new Error(r.status === 401 ? "the key was refused" : r.status === 402 ? "the OpenRouter balance is used up" : "OpenRouter answered " + r.status);
    const j = await r.json();
    try { if (j.usage && j.usage.cost && t && t._addSpend) t._addSpend(j.usage.cost); } catch (e) {}
    return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
  }

  /* ── a renderer with tables and hidden answers (||answer||) ── */
  function md(src) {
    const lines = String(src || "").split("\n"), out = []; let list = null, table = null;
    const inline = (t) => E(t).replace(/\|\|(.+?)\|\|/g, '<span class="ixYspoil" tabindex="0">$1</span>').replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
    const flush = () => { if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; } if (table) { out.push('<div class="ixYtw"><table class="ixYt">' + table.map((r, i) => "<tr>" + r.map((c) => (i ? "<td>" : "<th>") + inline(c.trim()) + (i ? "</td>" : "</th>")).join("") + "</tr>").join("") + "</table></div>"); table = null; } };
    for (const raw of lines) {
      const l = raw.trimEnd();
      if (/^\s*\|.*\|\s*$/.test(l) && !/^\s*\|\|/.test(l)) { if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; } if (/^\s*\|[\s:|-]+\|\s*$/.test(l)) continue; (table = table || []).push(l.trim().replace(/^\||\|$/g, "").split("|")); continue; }
      const m = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(l);
      if (m) { if (table) flush(); (list = list || []).push("<li>" + inline(m[1]) + "</li>"); continue; }
      flush();
      if (/^#{1,4}\s/.test(l)) out.push("<h3>" + inline(l.replace(/^#{1,4}\s/, "")) + "</h3>");
      else if (l.trim()) out.push("<p>" + inline(l) + "</p>");
    }
    flush(); return out.join("");
  }

  /* ── the page ── */
  let root, body;
  function shell() {
    if (!root) {
      root = document.createElement("div"); root.className = "ixH ixY"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "High-yield sheet");
      root.innerHTML = '<div class="ixHbox"><div class="ixHhd"><b id="ixYt">📘 High-yield</b><span class="ixHsub" id="ixYsub"></span><button type="button" data-y="close" aria-label="Close">✕</button></div><div class="ixHbody" id="ixYbody"></div></div>';
      document.body.appendChild(root); body = root.querySelector("#ixYbody");
      root.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && b.dataset.y === "close") close(); const sp = e.target.closest(".ixYspoil"); if (sp) sp.classList.toggle("on"); });
    }
    if (T()) T().close(); if (window.IX_GIT) IX_GIT.close(); if (window.IX_PLAN) IX_PLAN.close();
    root.classList.add("on");
  }
  function close() { if (root) root.classList.remove("on"); }
  function list() {
    shell(); root.querySelector("#ixYt").textContent = "📘 High-yield sheets";
    const U = window.IX_PLAN ? IX_PLAN.units() : [], C = cache();
    const cns = window.IX_PLAN ? IX_PLAN.cns().slice(0, 16) : [];
    body.innerHTML = "<p>One sheet per unit: what the examiners keep asking (from the past papers), then the professor's sheet (story, whiteboard, mechanisms, tables, mnemonics, clinical hooks, rapid recall, written skeletons). Written once, kept on this phone.</p><h3>DIG-206</h3><div class='ixHchs'>" +
      U.map((u) => '<button type="button" class="ixHch" data-u="' + E(u.id) + '"><b>' + E(u.name) + "</b><span>" + E(u.subject) + (C[u.id] ? " · sheet ✓" : "") + "</span></button>").join("") + "</div><h3>NEU-205 (for the CNS written)</h3><div class='ixHchs'>" +
      cns.map((c) => '<button type="button" class="ixHch" data-u="CNS:' + E(c.name) + '"><b>' + E(c.name) + "</b><span>" + E(c.subject) + " · " + c.n + " past MCQs" + (C["CNS:" + c.name] ? " · sheet ✓" : "") + "</span></button>").join("") + "</div>";
    body.querySelectorAll("[data-u]").forEach((b) => (b.onclick = () => open(b.dataset.u)));
  }
  function open(id) {
    const u = unit(id); if (!u) return list();
    shell(); root.querySelector("#ixYt").textContent = "📘 " + u.name;
    const F = facts(u), R = refsFor(u), c = cache()[id];
    root.querySelector("#ixYsub").textContent = u.module + " · " + u.subject + " · " + u.qs.length + " past questions";
    const ch = ["Ninja Nerd", "Osmosis", "Armando Hasudungan"];
    body.innerHTML = "<div class='ixHrow'><button type='button' data-back>← All sheets</button>" + (window.IX_PLAN && !/^CNS:/.test(id) ? "<button type='button' class='primary' data-learn>▶ Learn it with the professor</button>" : "<button type='button' class='primary' data-essay>📝 Most likely essay, then write it</button>") + "</div>" +
      "<h3>🔥 What the examiners keep asking</h3>" + (F.length ? "<ol class='ixYf'>" + F.slice(0, 15).map((f) => "<li><b>" + E(f.key) + "</b><span>" + E(f.stem.slice(0, 140)) + "</span><small>" + (f.n > 1 ? "asked " + f.n + "× · " : "") + E(f.sources.slice(0, 3).join(", ")) + "</small></li>").join("") + "</ol>" : "<p class='ixHsmall'>No keyed past MCQs in this unit: the sheet is built from the references and the course.</p>") +
      ((u.written || []).length ? "<h3>📝 Written questions on this unit</h3><ul>" + u.written.map((w) => "<li>" + E(w.questions[0].q) + " <small>(asked " + w.times + "×: " + E(w.years.join(", ")) + ")</small></li>").join("") + "</ul>" : "") +
      (R.length ? "<p class='ixHsmall'>Department-style references used: " + R.map((r) => E(r.src + ": " + r.head.slice(0, 50))).join(" · ") + "</p>" : "") +
      "<div id='ixYsheet'>" + (c ? "" : "<div class='ixHrow'><button type='button' class='primary' id='ixYgen'>✨ Write my high-yield sheet (once, about 2 US cents)</button></div>") + "</div>" +
      "<h3>🎬 Watch at 2x (optional)</h3><div class='ixHrow'>" + ch.map((n) => "<a class='ixYlink' target='_blank' rel='noopener' href='" + E(yt(n + " " + u.name + " " + (u.subject === "Histology" ? "histology" : u.subject.toLowerCase()))) + "'>▶ " + E(n) + "</a>").join("") + "</div><p class='ixHsmall'>Search links only. Watch at 2x and dictate what you learned into 📝.</p>";
    const sh = body.querySelector("#ixYsheet");
    const show = (text) => { sh.innerHTML = "<div class='ixYsheet'>" + md(text) + "</div><div class='ixHrow'><button type='button' id='ixYre'>↻ Rewrite the sheet</button></div><p class='ixHsmall'>Tap a grey answer in ⚡ Rapid recall to reveal it. Written by the professor from the past papers and references; check anything that looks off against your notes.</p>"; sh.querySelector("#ixYre").onclick = () => gen(); };
    const gen = async () => {
      sh.innerHTML = "<p class='ixHsmall'>The professor is writing your sheet from " + F.length + " past-paper facts" + (R.length ? " and " + R.length + " references" : "") + "…</p>";
      try { const text = await generate(u); if (!text.trim()) throw new Error("no sheet came back"); putCache(id, text); show(text); }
      catch (e) { sh.innerHTML = "<p>Could not write it: " + E(e.message) + "</p><div class='ixHrow'><button type='button' class='primary' id='ixYgen2'>Try again</button></div>"; sh.querySelector("#ixYgen2").onclick = gen; }
    };
    if (c) show(c.text); else body.querySelector("#ixYgen").onclick = gen;
    body.querySelector("[data-back]").onclick = list;
    const es = body.querySelector("[data-essay]"); if (es) es.onclick = () => { close(); window.IX_SCREEN_OVERRIDE = { title: "CNS · " + u.name, eyebrow: "NEU-205 " + u.subject, body: "CNS written. Past-paper facts of this chapter:\n" + F.slice(0, 12).map((f) => "- " + f.key).join("\n") }; T().open(); T().ask("Give me the most likely written-exam question on " + u.name + " and the model answer, then I will write it from a blank page.", "written"); };
    const lb = body.querySelector("[data-learn]"); if (lb) lb.onclick = () => { close(); window.IX_SCREEN_OVERRIDE = { title: "GIT 206 · " + u.name, eyebrow: "DIG-206 " + u.subject, body: "High-yield facts:\n" + F.slice(0, 12).map((f) => "- " + f.key + " (" + f.stem.slice(0, 80) + ")").join("\n") }; T().open(); T().ask("Teach me " + u.name + " with the full loop, one step at a time.", "loop"); };
  }
  window.IX_HY = { open, list, facts: (id) => facts(unit(id)), unit, md, close };
})();
