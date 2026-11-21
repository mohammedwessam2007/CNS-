/* INTELLECTUALITY v31 · the course: every lecture of the DIG-206 timetable becomes a lesson you understand, so no lecture
 * has to be attended (owner, 19 Nov 2026: "we also need to understand not memorize · full course · no lectures needed").
 *  - one lesson per lecture (the IPKA timetable), taught by the professor model, understanding first: why it matters →
 *    the big picture → built up piece by piece with the mechanism and the "because" → a reasoning question after each
 *    part → where people get confused → how it links → only then what the exam does with it → say it back
 *  - grounded in what this app holds: the past-paper facts of the unit, the department-style references, the examiner
 *    profile and the student's own notes; written once and kept on the phone
 *  - read one part at a time (ADHD): Next / Back, "🤔 Explain it another way" on every part, "🗣 Teach it back" at the end
 *  - the daily plan teaches each unit's lessons on its day; 📚 The course lists them all */
(function () {
  "use strict";
  if (window.IX_LESSON) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const P = () => window.IX_PLAN, T = () => window.IX_TUTOR, HY = () => window.IX_HY;
  const CACHE = "ix_lesson_v1", DONE = "ix_lesson_done_v1", VER = 1;
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch (e) { return {}; } };
  const put = (k, o) => { try { localStorage.setItem(k, JSON.stringify(o)); return true; } catch (e) { return false; } };
  const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  /* ── the course: lectures grouped by unit (each lecture belongs to its first unit; biochemistry to the biochemistry unit) ── */
  function course() {
    const L = (P() && P().lectures) || [], U = (P() && P().units()) || [], byId = {};
    U.forEach((u) => (byId[u.id] = { unit: u, lessons: [] }));
    const bio = U.find((u) => u.subject === "Biochemistry");
    const seen = {};
    L.forEach((l) => {
      if (l[1] === "College") return;
      const id = (l[3] && l[3][0]) || (l[1] === "Biochemistry" && bio ? bio.id : null);
      if (!id || !byId[id] || seen[l[2]]) return; seen[l[2]] = 1;
      byId[id].lessons.push({ key: slug(l[2]), title: l[2], subject: l[1], date: l[0], unit: id, also: (l[3] || []).slice(1) });
    });
    // a unit with no lecture of its own still gets one lesson on the whole unit
    U.forEach((u) => { if (!byId[u.id].lessons.length) byId[u.id].lessons.push({ key: slug(u.name), title: u.name, subject: u.subject, date: "", unit: u.id, also: [] }); });
    return U.map((u) => byId[u.id]);
  }
  const lessonsOf = (unitId) => { const c = course().find((x) => x.unit.id === unitId); return c ? c.lessons : []; };
  const all = () => [].concat(...course().map((c) => c.lessons));
  const find = (key) => all().find((l) => l.key === key);
  const isDone = (key) => !!get(DONE)[key];
  // v34: every lesson is also written into the app (lessons-text-*.js): shown at once, offline, no AI needed; a version
  // the professor wrote on this phone still wins if present
  const cached = (key) => { const c = get(CACHE)[key]; if (c && c.v === VER) return c; const t = (window.IX_LESSON_TEXT || {})[key]; return t ? { v: VER, text: t, at: 0, builtin: true } : null; };
  const included = (key) => (window.IX_NOVEMBER_LESSONS || {})[key];
  const ready = (key) => included(key) || cached(key);

  function preview(les, unit) {
    const refs = window.IX_GIT206_REF || {};
    const readings = (unit && unit.written || []).flatMap((topic) => refs[topic.topic] || []).slice(0, 3);
    const figures = window.IX_FIG ? IX_FIG.forUnit(les.unit).slice(0, 3) : [];
    return '<div class="ixLintro"><h2>Start with the course materials</h2><p>Use the diagrams and exam references for this unit. You can also generate a lesson for this specific topic with the Professor.</p></div>' +
      figures.map((figure) => IX_FIG.html(figure, { short: true })).join("") +
      readings.map((ref) => '<details class="ixLreference"><summary>' + E(ref.head) + '</summary><p>' + E(ref.text) + '</p><small>' + E(ref.src) + '</small></details>').join("");
  }

  /* ── the professor's brief: understanding first ── */
  const STYLE = [
    "You are the best teacher this 2nd-year Kasr Al Ainy medical student has ever had. This lesson REPLACES the lecture: he will not attend it, so nothing the lecture would cover may be missing, and he must UNDERSTAND it, not memorise it.",
    "He has ADHD: short paragraphs (2-4 lines), plain English, one idea at a time, concrete images. Bold only the 1-3 words per part that carry the idea.",
    "Teach like the best YouTube teachers (Ninja Nerd's build-up on a whiteboard, Osmosis's clarity, Armando's drawings): start from what he already knows, build each new idea on the last, and always give the MECHANISM: the 'because'. Never list a fact without why it is so, unless it is truly arbitrary (then say so and give a hook).",
    "Anatomy: explain position and relations by development, function and what would go wrong; walk him through it as if he is holding the specimen. Physiology: cause → mechanism → effect chains and graphs described in words. Histology: structure because of function; how to recognise it under the microscope. Biochemistry: what the pathway is FOR, then the steps, then regulation and disease.",
    "Write it in Markdown with this exact shape (each part starts with '## '):",
    "## 1. Why you should care — a patient or everyday situation (3-5 lines) that this lecture explains.",
    "## 2. The big picture — the whole lecture in 4-6 lines; show the best drawing here with [[fig:ID]] if one is given; then '✏️ Draw it yourself:' with 4-8 numbered steps for the simple diagram he should be able to draw in the exam.",
    "## 3. … ## N. — 4 to 7 parts that build the lecture up in a logical order, every topic the lecture would cover. Each part: the idea in plain words → the mechanism / the reason → an analogy if it helps → what it explains clinically. End EVERY part with a line '> 🤔 Think: <one question that needs reasoning, not recall> ||<the answer with the reason>||'.",
    "## Where people get confused — the 3-5 classic confusions, each with the one sentence that ends it.",
    "## How it links — 3-5 links to other topics (earlier lectures, other subjects, the clinic).",
    "## What the exam does with it — from the past-paper facts given: how Kasr Al Ainy asks this (MCQ traps and the written questions), now that he understands it. Mnemonics go here, only for truly arbitrary lists.",
    "## Say it back — the whole lecture in 5 numbered lines he could say out loud.",
    "Facts must match the Kasr Al Ainy course as given in the references and past-paper keys; where they differ from other textbooks, follow the course and say so in a few words. If you are not sure of a detail, say it plainly rather than invent it. No introduction, no closing remarks.",
  ].join("\n");

  async function generate(les) {
    const key = localStorage.getItem("ix_tutor_key_v1"); if (!key) throw new Error("add your OpenRouter key in 🧠 Tutor → ⚙︎ first");
    const t = T(); if (t && t.spend && t.cap && t.spend().usd >= t.cap()) throw new Error("this week's AI budget is used up (⚙︎ to raise it)");
    const hy = HY(), u = hy && hy.unit ? hy.unit(les.unit) : null;
    const facts = hy && hy.facts ? (hy.facts(les.unit) || []).slice(0, 25) : [];
    const sib = lessonsOf(les.unit).map((x) => x.title);
    const notes = t && t.notesFor ? t.notesFor("GIT 206 · " + (u ? u.name : les.title)) : "";
    const X = window.IX_EXAMINER ? IX_EXAMINER.git : "";
    let refs = "";
    try { const R = window.IX_GIT206_REF || {}, out = []; ((u && u.written) || []).forEach((w) => (R[w.topic] || []).forEach((r) => out.push(r))); refs = out.slice(0, 3).map((r) => "[" + r.src + "] " + r.head + "\n" + String(r.text).slice(0, 1600)).join("\n\n"); } catch (e) {}
    const FG = window.IX_FIG, figs = FG ? FG.forUnit(les.unit).concat(...(les.also || []).map((x) => FG.forUnit(x))) : [];
    const user = "LECTURE TO TEACH: " + les.subject + " · \"" + les.title + "\"" + (les.date ? " (DIG-206, Kasr Al Ainy, given " + les.date + ")" : "") +
      "\nUNIT: " + (u ? u.module + " · " + u.subject + " · " + u.name : les.unit) +
      (les.also && les.also.length ? "\nThis lecture also covers: " + les.also.map((x) => x.replace(/^[A-Z]:/, "")).join(", ") : "") +
      (sib.length > 1 ? "\nThe unit's lectures, in order (teach only THIS one, link to the others): " + sib.join(" | ") : "") +
      (facts.length ? "\n\nPAST-PAPER FACTS ON THIS UNIT (key answers the examiners test; n = papers):\n" + facts.map((f) => "- [n=" + f.n + "] " + String(f.stem).slice(0, 150) + " → " + f.key).join("\n") : "") +
      (u && u.written && u.written.length ? "\n\nWRITTEN QUESTIONS ASKED ON THIS UNIT:\n" + u.written.slice(0, 6).map((w) => "- " + w.questions[0].q + " (" + w.times + "×)").join("\n") : "") +
      (figs.length ? "\n\nDRAWINGS THE APP WILL SHOW (full-colour labelled textbook figures). Teach WITH them: put [[fig:ID]] on its own line in the part where he should look at it, then tell him what to look at in it (\"in the drawing, find…\"). Use each at most once; use only the ones that fit this lecture:\n" + figs.map((f) => "- " + f.id + ": " + FG.title(f) + " — " + String(f.alt || f.cap).slice(0, 160)).join("\n") : "") + (refs ? "\n\nDEPARTMENT-STYLE REFERENCES:\n" + refs : "") + (notes ? "\n\nHIS NOTES:\n" + notes.slice(0, 2000) : "") + (X ? "\n\n" + X : "");
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
      body: JSON.stringify({ model: localStorage.getItem("ix_tutor_model_pro_v1") || "openai/gpt-6.2-sol-pro", max_tokens: 6000, usage: { include: true }, messages: [{ role: "system", content: STYLE }, { role: "user", content: user }] }) });
    if (!r.ok) throw new Error(r.status === 401 ? "the key was refused" : r.status === 402 ? "the OpenRouter balance is used up" : "OpenRouter answered " + r.status);
    const j = await r.json();
    try { if (j.usage && j.usage.cost && t && t._addSpend) t._addSpend(j.usage.cost); } catch (e) {}
    const text = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
    if (!text.trim()) throw new Error("no lesson came back");
    const c = get(CACHE); c[les.key] = { v: VER, text, at: Date.now() };
    if (!put(CACHE, c)) { const o = get(CACHE); Object.keys(o).sort((a, b) => o[a].at - o[b].at).slice(0, 5).forEach((k) => delete o[k]); o[les.key] = c[les.key]; put(CACHE, o); }
    return text;
  }
  function parts(text) {
    const out = []; let cur = null;
    String(text).split("\n").forEach((l) => { if (/^##\s/.test(l)) { cur = { h: l.replace(/^##\s+/, ""), body: [] }; out.push(cur); } else if (cur) cur.body.push(l); });
    return out.length ? out.map((p) => ({ h: p.h, md: p.body.join("\n").trim() })) : [{ h: "Lesson", md: String(text) }];
  }
  const md = (s) => (HY() && HY().md ? HY().md(String(s).replace(/^>\s?/gm, "")) : "<p>" + E(s) + "</p>");

  /* ── the reader ── */
  let root = null, body = null, focusBefore = null;
  function shell() {
    if (root) return;
    root = document.createElement("div"); root.className = "ixL"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Lesson");
    root.innerHTML = '<div class="ixLtop"><button type="button" class="ixLx" data-l="close" aria-label="Close lesson">✕</button><div class="ixLt"><small id="ixLsub"></small><b id="ixLtitle"></b></div></div><div class="ixLbody" id="ixLbody"></div>';
    document.body.appendChild(root); body = root.querySelector("#ixLbody");
    root.addEventListener("click", (e) => { const b = e.target.closest("[data-l]"); if (b && b.dataset.l === "close") close(); });
    root.addEventListener("keydown", (e) => { if (e.key === "Escape" && !e.defaultPrevented) close(); });
  }
  function close() {
    if (!root || !root.classList.contains("on")) return;
    root.classList.remove("on");
    document.documentElement.classList.remove("ixLon");
    if (focusBefore && focusBefore.isConnected) focusBefore.focus({ preventScroll: true });
    focusBefore = null;
  }
  function head(les, sub) {
    shell();
    if (!root.classList.contains("on")) focusBefore = document.activeElement;
    root.classList.add("on");
    document.documentElement.classList.add("ixLon");
    root.querySelector("#ixLtitle").textContent = les ? les.title : "DIG 206 lessons";
    root.querySelector("#ixLsub").textContent = sub || "";
    root.querySelector(".ixLx").focus({ preventScroll: true });
    body.scrollTop = 0;
  }

  function open(key, at, generated) {
    const les = typeof key === "object" ? key : find(key); if (!les) return index();
    const u = HY() && HY().unit ? HY().unit(les.unit) : null;
    const published = included(les.key);
    head(les, les.subject + (published ? " · Course lesson" : u && u.name !== les.title ? " · " + u.name : ""));
    const local = get(CACHE)[les.key];
    const c = generated || (local && local.v === VER ? local : null) || published || cached(les.key);   // the owner's November lesson wins over the built-in one
    const generateButton = (label) => '<button type="button" id="ixLgen">' + label + '</button><p class="ixLsmall" id="ixLmsg" role="status"></p>';
    const wireGenerate = () => {
      const button = body.querySelector("#ixLgen");
      if (!button) return;
      const message = body.querySelector("#ixLmsg");
      button.onclick = async () => {
        if (T() && !T().hasKey()) return T().openSetup("Connect a key to generate a custom lesson.");
        button.disabled = true;
        message.textContent = "Writing the lesson…";
        try {
          const text = await generate(les);
          if (button.isConnected && root.classList.contains("on")) open(les.key, 0, { text });
        } catch (e) {
          message.textContent = "Could not write it: " + e.message;
        } finally {
          button.disabled = false;
        }
      };
    };
    if (!c) {
      body.innerHTML = preview(les, u) + '<div class="ixLwait"><div class="ixLask"><button type="button" id="ixLsheet">Open unit sheet</button>' + generateButton("Write with Professor") + '</div></div>';
      body.querySelector("#ixLsheet").onclick = () => { close(); if (HY()) HY().open(les.unit); };
      wireGenerate();
      return;
    }
    const ps = parts(c.text); if (window.IX_ENGINE) IX_ENGINE.extendParts(les, ps); let i = Math.max(0, Math.min(ps.length - 1, at || 0));
    // v32: drawings in the parts. The professor's [[fig:ID]] marks first; a part without one gets the unused drawing whose
    // labels fit it best; the big picture gets the unit's main drawing if nothing else claimed it
    const FG = window.IX_FIG, pool = FG ? FG.forUnit(les.unit).concat(...(les.also || []).map((x) => FG.forUnit(x))) : [], used = new Set();
    ps.forEach((p) => { p.md = p.md.replace(/\[\[fig:([a-z0-9_]+)\]\]/gi, (m, id) => { const f = FG && FG.get(id); if (!f || used.has(id)) return ""; used.add(id); return "\n@@FIG:" + id + "@@\n"; }); });
    if (!c.reading) {
      ps.forEach((p) => { if (!FG || p.engine || /@@FIG:/.test(p.md) || /confused|links|exam does|say it back/i.test(p.h)) return; const b = FG.best(pool.filter((f) => !used.has(f.id)), p.h + " " + p.md, 3) || FG.best(FG.all().filter((f) => !used.has(f.id)), p.h + " " + p.md, 4); if (b) { used.add(b.id); p.md += "\n@@FIG:" + b.id + "@@"; } });
      const bp = ps.find((p) => /big picture/i.test(p.h)) || ps.find((p, k) => k > 0 && !p.engine); const first = pool.find((f) => !used.has(f.id)); if (bp && first && !/@@FIG:/.test(bp.md)) { used.add(first.id); bp.md = bp.md.replace(/(✏️|Draw it yourself|Draw this)/, "@@FIG:" + first.id + "@@\n$1"); if (!/@@FIG:/.test(bp.md)) bp.md += "\n@@FIG:" + first.id + "@@"; }
    }
    const render = (src) => md(src).replace(/<p>@@FIG:([a-z0-9_]+)@@<\/p>|@@FIG:([a-z0-9_]+)@@/g, (m, a, b) => { const f = FG.get(a || b); return f ? FG.html(f, { eager: true }) : ""; });
    const show = () => {
      const p = ps[i], last = i === ps.length - 1;
      body.innerHTML = '<div class="ixLprog" aria-hidden="true">' + ps.map((_, j) => '<i class="' + (j < i ? "d" : j === i ? "c" : "") + '"></i>').join("") + '</div><div class="ixLpart"><small>Part ' + (i + 1) + " of " + ps.length + '</small><h2 tabindex="-1">' + E(p.h.replace(/^\d+\.\s*/, "")) + '</h2><div class="ixLmd">' + render(p.md) + "</div>" + (window.IX_DRAW && (/draw/i.test(p.md) || /big picture/i.test(p.h)) ? '<div class="ixDbtns">' + [les.unit].concat(les.also || []).map((u) => IX_DRAW.btn(u)).join("").replace(/(data-draw="[a-z]+")([^]*?)\1[^<]*<\/button>/g, "$1$2") + "</div>" : "") +
        (c.reading ? '<p class="ixLsource"><a href="' + E(c.reading) + '" target="_blank" rel="noopener">Further reading in OpenStax A&amp;P 2e ↗</a></p>' : "") + "</div>" +
        '<div class="ixLask"><button type="button" data-a="simple">🤔 Explain it another way</button><button type="button" data-a="why">❓ Ask about this</button></div>' +
        '<div class="ixLnav">' + (i ? '<button type="button" data-a="back">← Back</button>' : "<span></span>") + (last ? '<button type="button" class="ixLmain" data-a="finish">✓ I understand it</button>' : '<button type="button" class="ixLmain" data-a="next">Next →</button>') + "</div>" +
        (last ? '<div class="ixLend"><button type="button" data-a="teach">🗣 Teach it back to the professor</button><button type="button" data-a="sheet">📘 The exam sheet for this unit</button></div>' : "") +
        (c.reading && i === 0 && T() && T().hasKey() ? '<div class="ixLask">' + generateButton("Generate a custom version") + '</div>' : "");
      wireGenerate();
      try { if (window.IX_ENGINE) IX_ENGINE.enhance(body, { les, p, i }); } catch (e) { console.warn("[engine]", e); }
      body.scrollTop = 0; root.scrollTop = 0;
      body.querySelector(".ixLpart h2").focus({ preventScroll: true });
      const ctx = "LESSON: " + les.title + " (" + les.subject + ")\nTHE PART HE IS READING: " + p.h + "\n" + p.md.slice(0, 2500);
      body.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
        const a = b.dataset.a;
        if (a === "next") { i++; show(); }
        else if (a === "back") { i--; show(); }
        else if (a === "finish") { const d = get(DONE); d[les.key] = Date.now(); put(DONE, d); P().completeLesson(les.key); index(les.unit, les.key); document.dispatchEvent(new CustomEvent("ix:done", { detail: { kind: "lesson", key: les.key } })); }
        else if (a === "simple" || a === "why") { window.IX_SCREEN_OVERRIDE = { title: "Lesson · " + les.title, eyebrow: "DIG-206 " + les.subject, body: ctx }; T() && (T().open(), a === "simple" ? T().ask("I did not get this part: \"" + p.h + "\". Explain it another way: a different analogy, smaller steps, then check I got it with one question.", "simple", ctx) : null); }
        else if (a === "teach") { close(); window.IX_SCREEN_OVERRIDE = { title: "Lesson · " + les.title, eyebrow: "DIG-206 " + les.subject, body: c.text.slice(0, 5000) }; T() && (T().open(), T().ask("I just learned \"" + les.title + "\". Let me teach it back to you; ask me to start, then find the gaps in my understanding.", "classmate")); }
        else if (a === "sheet") { close(); HY() && HY().open(les.unit); }
      }));
    };
    show();
  }
  // the course index (or one unit's lessons)
  function index(unitId, justDone) {
    const courses = course(), lessons = courses.flatMap((c) => c.lessons);
    const C = courses.filter((c) => !unitId || c.unit.id === unitId);
    if (!C.length && unitId) return index();
    head(null, unitId ? C[0].unit.subject : lessons.filter((l) => isDone(l.key)).length + " of " + lessons.length + " done");
    if (unitId) root.querySelector("#ixLtitle").textContent = "📚 " + C[0].unit.name;
    const row = (l) => '<button type="button" class="ixLrow' + (isDone(l.key) ? " done" : "") + '" data-k="' + E(l.key) + '"><span class="ixLck" aria-hidden="true">' + (isDone(l.key) ? "✓" : ready(l.key) ? "●" : "○") + "</span><span><b>" + E(l.title) + "</b><small>" + E(l.subject) + " · " + (isDone(l.key) ? "Completed" : ready(l.key) ? "Lesson ready" : "Study materials") + "</small></span></button>";
    const nextUp = unitId && C[0].lessons.find((l) => !isDone(l.key));
    const pending = lessons.filter((l) => !ready(l.key));
    body.innerHTML = (justDone ? '<div class="ixLok">✓ Lesson done. ' + (nextUp ? "Next one below." : "That was the last lesson of this unit: the exam sheet and the questions come next.") + "</div>" : "") +
      (unitId || !pending.length ? "" : '<details class="ixLbatch"><summary>Generate lessons with Professor</summary><div class="ixLrow2"><button type="button" class="ixLmain" id="ixLall">Write ' + pending.length + " lessons (est. $" + (pending.length * 0.04).toFixed(2) + ')</button><p class="ixLsmall" id="ixLallp" role="status"></p></div></details>') +
      C.map((c) => (unitId ? "" : '<h3 class="ixLh">' + E(c.unit.subject) + " · " + E(c.unit.name) + "</h3>") + '<div class="ixLlist">' + c.lessons.map(row).join("") + "</div>").join("") +
      (unitId ? '<div class="ixLnav"><button type="button" data-u="all">📚 All lessons</button>' + (nextUp ? '<button type="button" class="ixLmain" data-k="' + E(nextUp.key) + '">▶ ' + E(nextUp.title) + "</button>" : '<button type="button" class="ixLmain" data-u="sheet">📘 The exam sheet</button>') + "</div>" : "");
    body.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => open(b.dataset.k)));
    const ua = body.querySelector("[data-u=all]"); if (ua) ua.onclick = () => index();
    const us = body.querySelector("[data-u=sheet]"); if (us) us.onclick = () => { close(); HY() && HY().open(unitId); };
    const ab = body.querySelector("#ixLall");
    if (ab) ab.onclick = async () => {
      if (T() && !T().hasKey()) return T().openSetup("Connect a key to generate lessons.");
      ab.disabled = true; const m = body.querySelector("#ixLallp"), todo = pending.filter((l) => !ready(l.key)); let n = 0;
      for (const l of todo) { if (!m.isConnected) break; m.textContent = "Writing " + (n + 1) + " of " + todo.length + ": " + l.title + "… (keep the app open)"; try { await generate(l); n++; } catch (e) { m.textContent = "Stopped after " + n + ": " + e.message + ". Tap again to carry on."; ab.disabled = false; return; } }
      if (m.isConnected) index();
    };
    return C.length;
  }
  // the next days' lessons are written in the background, before they are needed (with a key; at most 3 at a time)
  let busy = false;
  async function prefetch() {
    if (busy || !localStorage.getItem("ix_tutor_key_v1") || !P()) return 0; busy = true; let n = 0;
    try {
      const k = new Date(), f = (d) => d.toISOString().slice(0, 10), lim = f(new Date(k.getTime() + 3 * 864e5));
      const keys = []; P().build().days.forEach((d) => { if (d.date >= f(k) && d.date <= lim) d.steps.forEach((x) => { if (x.kind === "lesson" && !ready(x.key) && keys.indexOf(x.key) < 0) keys.push(x.key); }); });
      for (const key of keys.slice(0, 3)) { const l = find(key); if (!l) continue; try { await generate(l); n++; } catch (e) { break; } }
    } finally { busy = false; }
    return n;
  }
  if (!navigator.webdriver) setTimeout(() => { prefetch().catch(() => {}); }, 15000);

  window.IX_LESSON = { course, lessonsOf, all, find, open, index, close, generate, parts, isDone, cached, prefetch, STYLE };
})();
