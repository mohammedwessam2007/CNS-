/* INTELLECTUALITY v19 · the AI tutor (owner, 16 Nov 2026, after the MCQ exam: "put the API in the system so it
 * teaches us in real time"; the goal stays: least study time, high marks, and understanding, not memorising).
 *
 * Why it exists: the course taught the facts of the past-paper bank and measured readiness on more bank
 * questions, so it said "very good" while the exam asked new questions on lecture content. The tutor fixes the
 * two holes: it teaches from the owner's own lecture notes (pasted per topic), and it asks NEW questions and
 * "explain why" checks that cannot be answered by remembering a bank item.
 *
 * The key: the owner's own OpenRouter key, kept only in this device's storage (ix_tutor_key_v1). It is never part
 * of the progress (S), so it is not in the cloud save, the progress file or the code. Calls go straight from the
 * device to openrouter.ai. Set a spending limit on the key in OpenRouter.
 * Sealed mocks stay sealed: the tutor is closed while a mock is running, and it is never given held-out items. */
(function () {
  "use strict";
  if (window.IX_TUTOR) return;
  const KEY = "ix_tutor_key_v1", MODEL = "ix_tutor_model_v1", MODEL_PRO = "ix_tutor_model_pro_v1", CHAT = "ix_tutor_chat_v1", NOTES = "ix_tutor_notes_v1";
  // two tiers (OpenRouter list prices read on 16 Nov 2026, per million tokens in/out): a fast, cheap model for chat
  // and quizzes, and a stronger "professor" for Why? and explanations. Both can be changed in ⚙︎.
  const DEFAULT_MODEL = "anthropic/claude-haiku-5.5", DEFAULT_PRO = "openai/gpt-6.2-sol-pro";
  // v26: the professor moved to the newest model at the $2/$10 tier (read from OpenRouter on 18 Nov 2026); a device
  // still on the old default is moved with it, a model the owner chose himself is kept
  try { if (localStorage.getItem(MODEL_PRO) === "openai/gpt-6.1-terra") localStorage.setItem(MODEL_PRO, DEFAULT_PRO); } catch (e) {}
  const PRESETS = [["anthropic/claude-haiku-5.5", "Fast · $0.10 / $0.50"], ["openai/gpt-6-luna", "Fast · $0.10 / $0.50"], ["deepseek/deepseek-v4.1-flash", "Fast · $0.14 / $0.42"],
    ["openai/gpt-6.2-sol-pro", "Professor (default) · $2 / $10"], ["anthropic/claude-sonnet-5.5", "Professor · $2 / $10"], ["google/gemini-4-carbon", "Professor · $2 / $10"], ["openai/gpt-6.1-terra", "Cheaper professor · $1 / $5"], ["anthropic/claude-fable-5.2", "Top tier · $8 / $40 (expensive)"]];
  const API = "https://openrouter.ai/api/v1";
  const ls = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del: (k) => { try { localStorage.removeItem(k); } catch (e) {} },
  };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  // a small, safe markdown: bold, italics, inline code, lists, paragraphs
  function md(s) {
    const lines = E(s).split(/\n/), out = [];
    let list = null;
    for (const raw of lines) {
      const l = raw.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
      const m = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(l);
      if (m) { if (!list) { list = []; } list.push("<li>" + m[1] + "</li>"); continue; }
      if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; }
      if (/^#{1,4}\s/.test(l)) out.push("<h4>" + l.replace(/^#{1,4}\s/, "") + "</h4>");
      else if (l.trim()) out.push("<p>" + l + "</p>");
    }
    if (list) out.push("<ul>" + list.join("") + "</ul>");
    return out.join("");
  }

  /* ───── what the student is looking at ───── */
  const mockRunning = () => { try { return document.documentElement.classList.contains("ixHmock") || !!(typeof S !== "undefined" && S && S.v16 && S.v16.mock); } catch (e) { return false; } };
  function screen() {
    // a screen outside #player (the GIT 206 hub) can say what the student is looking at
    const ov = window.IX_SCREEN_OVERRIDE;
    if (ov && ov.title) return { title: String(ov.title), eyebrow: String(ov.eyebrow || ""), body: String(ov.body || "").slice(0, 5000) };
    const t = (id) => { const el = document.getElementById(id); return el ? (el.innerText || "").trim() : ""; };
    const title = t("title"), eyebrow = t("eyebrow");
    let body = t("player").replace(/\n{3,}/g, "\n\n");
    if (body.length > 5000) body = body.slice(0, 5000) + "\n…";
    return { title, eyebrow, body };
  }
  function topicKey() { const s = screen(); return (s.title || "general").slice(0, 80); }
  function notesAll() { try { return JSON.parse(ls.get(NOTES, "{}")) || {}; } catch (e) { return {}; } }
  function notesFor(k) { return notesAll()[k] || ""; }
  function saveNotes(k, text) { const all = notesAll(); if (text.trim()) all[k] = text.slice(0, 20000); else delete all[k]; return ls.set(NOTES, JSON.stringify(all)); }

  /* ───── how the exam asks it: the practice half of the past-paper bank (held-out items are never used) ───── */
  const STOP = new Set("the and for with from that this which what when where into onto than then they them their there these those have has had been were was are is its it's not but all any each other such only also more most less very just about above below between through during after before under over same some both either neither nor can may might must should would could will shall our your his her him she he you who whom whose why how one two three four five first second third part parts type types called known form forms found make makes made used uses using cause causes caused lead leads due following true false except correct regarding".split(" "));
  function words(t) { return Array.from(new Set(String(t || "").toLowerCase().replace(/[^a-z0-9 -]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)))); }
  function relevance(text) {
    // CNS practice half + the DIG-206 bank's keyed items (it has no held-out half; its sealed check is the blind check)
    const bank = ((window.EHSAN_QBANK && window.EHSAN_QBANK.questions) || []).concat(((window.IX_GIT206 && window.IX_GIT206.mcq) || []).filter((q) => q.answerKeys && q.answerKeys.length).map((q) => ({ split: "practice", stem: q.stem, options: q.options, answerText: (q.options.find((o) => o.key === q.answerKeys[0]) || {}).text, sourceTag: q.source, chapter: q.chapter })));
    const ws = words(text).slice(0, 24); if (!ws.length || !bank.length) return null;
    const hits = [];
    for (const q of bank) {
      if (q.split !== "practice") continue;
      const hay = (q.stem + " " + (q.answerText || "") + " " + (q.options || []).map((o) => o.text).join(" ")).toLowerCase();
      let n = 0; for (const w of ws) if (hay.includes(w)) n++;
      if (n >= Math.min(3, Math.max(2, Math.ceil(ws.length / 4)))) hits.push([n, q]);
    }
    hits.sort((a, b) => b[0] - a[0]);
    const top = hits.slice(0, 40), src = new Set(top.map(([, q]) => q.sourceTag).filter(Boolean)), ch = {};
    top.forEach(([, q]) => { ch[q.chapter] = (ch[q.chapter] || 0) + 1; });
    return { n: top.length, sources: Array.from(src).slice(0, 8), chapters: Object.entries(ch).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]),
      examples: top.slice(0, 3).map(([, q]) => q.stem + " → " + (q.answerText || "")) };
  }
  // how these examiners ask: from the practice half of the bank, per chapter
  let STYLE = null;
  function examinerStyle() {
    if (STYLE) return STYLE;
    STYLE = {};
    const git = ((window.IX_GIT206 && window.IX_GIT206.mcq) || []).map((q) => ({ split: "practice", stem: q.stem, chapter: q.chapter, subject: "DIG-206 " + q.subject }));
    for (const q of ((window.EHSAN_QBANK && window.EHSAN_QBANK.questions) || []).concat(git)) {
      if (q.split !== "practice") continue;
      const k = q.chapter || "?", o = STYLE[k] || (STYLE[k] = { n: 0, except: 0, clinical: 0, subject: q.subject });
      o.n++; if (/\b(except|not|false|least)\b/i.test(q.stem)) o.except++; if (/\b(year[- ]old|patient|presents?|complain|lesion of|injury|damage|man|woman|child)\b/i.test(q.stem)) o.clinical++;
    }
    return STYLE;
  }
  function relevanceText(text) {
    const r = relevance(text);
    if (!r) return "EXAM RELEVANCE: not known (no past-paper data).";
    if (!r.n) return "EXAM RELEVANCE (past-paper bank we have): no past question matches this closely. Say so honestly: it may still come from the lectures, but it has not been a classic past-paper point.";
    return "EXAM RELEVANCE (from the practice half of the student's past-paper bank, by matching words, so approximate): about " + r.n + " past questions touch this" + (r.sources.length ? " (sources: " + r.sources.join(", ") + ")" : "") + (r.chapters.length ? "; chapters: " + r.chapters.join(", ") : "") + ".\nExamples of how it was asked:\n- " + r.examples.join("\n- ") +
      "\nEXAMINER STYLE in these chapters: " + r.chapters.map((c) => { const o = examinerStyle()[c]; return o ? c + ": " + o.n + " past questions, " + Math.round((100 * o.except) / o.n) + "% negative ('except/not'), " + Math.round((100 * o.clinical) / o.n) + "% clinical" : c; }).join("; ") + ". Ask in that style.";
  }

  // v26 the professor's prompt, in sections. Every rule below is load-bearing: the tags are parsed by the app,
  // the attempt-first rules are the guardrail the research says AI tutors need, and the grounding order keeps the
  // answers in the department's content.
  const SYSTEM = [
    "# WHO YOU ARE",
    "You are the personal professor of one 2nd-year medical student at Kasr Al Ainy (Cairo University). You combine three people: a brilliant demonstrator who explains from the mechanism, a strict Kasr Al Ainy examiner who knows exactly how marks are given, and a coach who protects his time. Current modules: DIG-206 (GIT, renal, metabolism: anatomy, physiology, histology, biochemistry) and NEU-205 (CNS) for its written exam.",
    "# THE STUDENT",
    "- Not a native English speaker: plain English, short sentences; the exam terms always in English.",
    "- Has ADHD: one idea per line, **bold** the key words, no walls of text, vivid and concrete, momentum over completeness.",
    "- His goal: high marks with the least study time, by understanding, then a life outside study. Respect his minutes.",
    "- He failed to reach his target in the CNS MCQ because he trained on recognising bank answers. Do not let that happen again: make him retrieve, reason and write.",
    "# SOURCES, IN THIS ORDER",
    "1. His own lecture notes below (what the doctors stressed) and the reference answers below (department-style revision notes): these are the standard.",
    "2. The past-paper data below (how often and how the examiners asked it).",
    "3. Standard textbook knowledge, marked '(not in your notes)' every time you use it.",
    "If sources disagree, follow 1 and say so in one line. If you are not sure of a fact, say so. Never invent page numbers, sources, statistics or 'the doctor said'.",
    "# HOW YOU TEACH (always)",
    "- Make him do the thinking: ask before you tell. Open with a puzzle, a clinical hook or a surprising fact when you can.",
    "- From mechanism to fact: cause → mechanism → effect → exam fact → trap. One concrete example or patient.",
    "- Dual coding: describe one picture to hold in mind (or point to the drawing on his screen).",
    "- ATTEMPT FIRST: never give the answer to a question you asked before he has tried. If he is stuck, a hint ladder, one rung per turn: 1) a nudge toward the mechanism, 2) a narrower question, 3) one worked step. Only after an attempt, the full answer.",
    "- Adapt: if he is right, go one level deeper; if he is wrong, find the exact false belief before re-teaching.",
    "- End every reply with ONE short check question that needs understanding (why / what happens if / which lesion / compare), then stop and wait.",
    "# HOW KASR AL AINY EXAMS WORK",
    "- MCQ: single best answer, often clinical or negative ('all EXCEPT', 'NOT', 'false'); traps are look-alikes and a changed word. Teach him to underline the negative word.",
    "- Written: marked on points AND structure. The verb decides the shape: Compare → a table; Explain/mechanism → numbered causal steps (+ a labelled diagram if useful); Enumerate/Mention → a numbered list of exactly what is asked; Relations → by surface (anterior, posterior, …); Describe → definition/site → parts → relations/supply → function → clinical note; Development → stages in time order then anomalies; Case → comment on every finding (finding → mechanism → meaning), then the diagnosis.",
    "- Practical: identify a structure on a slide or specimen from landmarks; name the stain, the cell, the one feature that decides it.",
    "# FORMAT",
    "- Under about 180 words unless he asks for more or the task is a model answer.",
    "- Short lines, bold key words, arrows (→) for mechanisms, a small table when comparing.",
    "# JUDGING HIS ANSWERS (the app reads these tags)",
    "- When you judge an answer he gave to your question, start your reply with exactly one tag: [[correct]] or [[partly]] or [[wrong]]. Use no tag otherwise.",
    "- When the verdict is [[wrong]] or [[partly]], put right after it ONE error-type tag: [[type:unknown]] (never learned it), [[type:misread]] (missed a word such as except/not/most), [[type:confused]] (mixed up look-alikes), [[type:reasoning]] (knew the facts, wrong logic). Name the type in plain words in your first line and give the matching fix.",
    "- He may say how sure he was (guessing / unsure / sure). A sure but wrong answer is the most valuable moment: name the exact false belief and contrast it with the truth in one line.",
    "# NEVER",
    "- Never reveal the answer to an exam question he has not answered (hints only). Never help during a mock (the app keeps you closed then).",
    "- Never flatter, never predict his grade, never pad. Honest and warm.",
  ].join("\n");

  function context(extra) {
    const s = screen(), k = topicKey(), n = notesFor(k);
    let c = "WHAT THE STUDENT IS LOOKING AT IN THE APP" + (s.eyebrow ? " (" + s.eyebrow + ")" : "") + ":\n" + (s.title ? "Title: " + s.title + "\n" : "") + (s.body || "(nothing open)");
    if (n) c += "\n\nTHE STUDENT'S OWN LECTURE NOTES FOR THIS TOPIC (most important source):\n" + n;
    try {
      // the examiners' habits for the module he is on (built from the past papers: examiner-profile.js)
      const X = window.IX_EXAMINER, cnsNow = /CNS|NEU-205/i.test((s.eyebrow || "") + " " + (s.title || "")) || (window.IX_PLAN && (IX_PLAN.today().day || {}).phase === "CNS written");
      if (X && !mockRunning()) c += "\n\nEXAMINER PROFILE (use it: ask, explain and mark the way these examiners do):\n" + (cnsNow ? X.cns : X.git);
      // the whole syllabus and where he stands in it (the professor orchestrates; it never teaches blind)
      if (window.IX_PLAN && !mockRunning() && !cnsNow) {
        const sp = IX_PLAN.span(), now = new Date().toISOString().slice(0, 10), g = window.IX_GIT && IX_GIT.state ? IX_GIT.state().q : {}, B = window.IX_GIT206 ? IX_GIT206.mcq : [];
        const lines = IX_PLAN.units().map((u) => { const x = sp[u.id], qs = B.filter((q) => g[q.id] && u.pred(q)), ok = qs.filter((q) => g[q.id].ok).length; return "- " + u.subject + " · " + u.name + ": " + (!x ? "no lecture" : x.first > now ? "lectured from " + x.first : x.last >= now ? "lectures running" : "lectured") + (qs.length ? ", " + ok + "/" + qs.length + " right" + (qs.length >= 5 && ok / qs.length < 0.6 ? " (WEAK)" : "") : ""); });
        c += "\n\nTHE SYLLABUS (DIG-206 units, his state in each; link new ideas to units already lectured, never assume an unlectured unit is known):\n" + lines.join("\n");
      }
    } catch (e) {}
    try { if (window.IX_PLAN && !mockRunning()) { const t = IX_PLAN.today(), d = t.day, ex = IX_PLAN.exams.find((x) => x.date >= new Date().toISOString().slice(0, 10)); if (d) c += "\n\nWHERE HE IS IN THE PLAN: " + d.date + " · " + d.phase + (ex ? " · next exam " + ex.name + " on " + ex.date : "") + (d.title ? " · today: " + d.title : "") + ". Keep answers useful for that exam."; } } catch (e) {}
    if (extra) c += "\n\n" + extra;
    return c;
  }

  /* ───── how sure vs how right (calibration), and the sure-but-wrong list (his traps) ───── */
  const CAL = "ix_tutor_calib_v1", TRAPS = "ix_tutor_traps_v1";
  let conf = null;
  const jget = (k) => { try { const v = JSON.parse(ls.get(k, "[]")); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  function record(verdict, lastQ) {
    if (!conf) return;
    const c = jget(CAL); c.push({ conf, verdict, at: Date.now() }); ls.set(CAL, JSON.stringify(c.slice(-400)));
    if (conf === "sure" && verdict !== "correct") { const t = jget(TRAPS); t.push({ q: String(lastQ || "").slice(0, 400), at: Date.now(), topic: topicKey() }); ls.set(TRAPS, JSON.stringify(t.slice(-80))); }
  }
  // certainty-based marking (as in UK medical schools): sure and right +3, sure and wrong −6; a guess risks nothing.
  // It rewards knowing what you know, which is the exact skill the 16 Nov forecast lacked.
  const CBM = { guess: [1, 0.5, 0], unsure: [2, 1, -2], sure: [3, 1, -6] };
  function cbmOf(x) { const r = CBM[x.conf]; return r ? r[x.verdict === "correct" ? 0 : x.verdict === "partly" ? 1 : 2] : 0; }
  function calibration() {
    const c = jget(CAL), sure = c.filter((x) => x.conf === "sure"), right = sure.filter((x) => x.verdict === "correct").length;
    const last = c.slice(-40), cbm = last.length ? +(last.reduce((t, x) => t + cbmOf(x), 0) / last.length).toFixed(2) : null;
    return { n: c.length, sure: sure.length, sureRight: right, traps: jget(TRAPS).length, cbm };
  }
  const TAG = /^\s*\[\[(correct|partly|wrong)\]\]\s*/i, TYPE = /\[\[type:(unknown|misread|confused|reasoning)\]\]\s*/i;
  const ERRS = "ix_tutor_errtypes_v1", TYPE_NAME = { unknown: "📕 never learned", misread: "👓 misread the stem", confused: "🔀 look-alikes", reasoning: "🧩 reasoning" };
  function errTypes() { const o = {}; jget(ERRS).forEach((x) => { o[x.t] = (o[x.t] || 0) + 1; }); return o; }
  function badge(text) {
    const m = TAG.exec(text), t = TYPE.exec(text), body = text.replace(TAG, "").replace(TYPE, "");
    return (m ? '<span class="ixTverdict v-' + m[1].toLowerCase() + '">' + VBADGE[m[1].toLowerCase()] + "</span>" : "") + (t ? '<span class="ixTverdict v-type">' + TYPE_NAME[t[1].toLowerCase()] + "</span>" : "") + (md(body) || "<p class='ixTdots'>…</p>");
  }

  /* ───── language: plain English, or Egyptian Arabic with the exam's English terms ───── */
  const LANG = "ix_tutor_lang_v1";
  const AR_RULE = "LANGUAGE: explain in simple Egyptian Arabic (Arabic script, the way a friend explains in Cairo), but keep every medical term, structure name and exam keyword in English exactly as the exam writes it. Questions and options you write stay in English, as in the real exam.";
  function lang(v) { if (v === "ar" || v === "en") ls.set(LANG, v); return ls.get(LANG, "en"); }

  /* ───── inline answers: the professor answers inside the screen, where the question is ───── */
  function inlineCard(host) {
    let c = host.querySelector(":scope > .ixAiOut");
    if (!c) {
      c = document.createElement("div"); c.className = "ixAiOut";
      c.innerHTML = '<div class="ixTtxt"></div><form class="ixAiReply"><input type="text" placeholder="Answer or ask a follow-up…" aria-label="Reply to the professor"><button type="submit">↵</button><button type="button" data-ai-open title="Continue in the tutor">↗</button></form>';
      c.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); const i = c.querySelector("input"), q = i.value.trim(); if (!q || busy) return; i.value = ""; ask(q, null, null, { inline: host }); });
      c.querySelector("[data-ai-open]").onclick = () => open();
      host.appendChild(c);
    }
    c.classList.add("live"); c.dir = ls.get(LANG, "en") === "ar" ? "rtl" : "ltr";
    return c;
  }
  function inlinePaint(c, text) {
    c.querySelector(".ixTtxt").innerHTML = badge(text);
  }

  /* ───── v22 WORK LESS, LIVE MORE: study is a fixed daily budget, life is the default ───── */
  const LIFE = "ix_life_v1", DAYK = "ix_day_v1";
  function life() { let o = {}; try { o = JSON.parse(ls.get(LIFE, "{}")) || {}; } catch (e) {} return { mins: o.mins || 60, stop: o.stop || "22:30", off: o.off == null ? 5 : o.off }; }
  function setLife(o) { ls.set(LIFE, JSON.stringify(Object.assign(life(), o))); }
  const ymd = (d) => { d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  function day() { let o = {}; try { o = JSON.parse(ls.get(DAYK, "{}")) || {}; } catch (e) {} if (o.d !== ymd()) o = { d: ymd(), used: 0, extra: 0, last: 0 }; return o; }
  function tickDay() { const o = day(), now = Date.now(); if (o.last && now - o.last < 6 * 60e3) o.used += (now - o.last) / 60e3; else o.used += 1; o.last = now; ls.set(DAYK, JSON.stringify(o)); return o; }
  function extend(min) { const o = day(); o.extra += min || 10; ls.set(DAYK, JSON.stringify(o)); }
  function lifeGate() {
    const L = life(), now = new Date(), o = day();
    if (L.off >= 0 && now.getDay() === L.off) return "Today is your day off. Live. 🌿 (Reviews wait for tomorrow; nothing is lost. To study anyway: ⏱ → +10 min.)";
    const [h, m] = L.stop.split(":").map(Number);
    if (Number.isFinite(h) && now.getHours() * 60 + now.getMinutes() >= h * 60 + (m || 0) && !o.extra) return "It is past your stop time (" + L.stop + "). Sleep is when today's learning is stored. Done for today ✅ (⏱ → +10 min if you really must).";
    if (o.used >= L.mins + o.extra) return "✅ Done for today: " + Math.round(o.used) + " focused minutes. That was the plan; the rest of the day is yours. (⏱ → +10 min to finish something.)";
    return null;
  }
  function dayState() { const L = life(), o = day(); return { used: Math.round(o.used), budget: L.mins + o.extra, left: Math.max(0, Math.round(L.mins + o.extra - o.used)), gate: lifeGate() }; }

  /* ───── v21 cost guard: what this week's answers cost, and a weekly cap the owner sets ───── */
  const SPEND = "ix_tutor_spend_v1", CAPK = "ix_tutor_cap_v1", DEFAULT_CAP = 10;   // v45: drawings and option-by-option explanations need more than $4 a week
  function weekId(d) { d = new Date(d || Date.now()); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() + "-W" + Math.ceil(((t - y) / 864e5 + 1) / 7); }
  function spend() { let o = {}; try { o = JSON.parse(ls.get(SPEND, "{}")) || {}; } catch (e) {} if (o.week !== weekId()) o = { week: weekId(), usd: 0, calls: 0 }; return o; }
  function addSpend(usd) { const o = spend(); o.usd = +(o.usd + (usd || 0)).toFixed(5); o.calls++; ls.set(SPEND, JSON.stringify(o)); }
  function cap() { const c = parseFloat(ls.get(CAPK, String(DEFAULT_CAP))); return Number.isFinite(c) && c > 0 ? c : DEFAULT_CAP; }

  /* ───── v21 memory engine: every idea he got wrong comes back, re-worded, on a spaced schedule ───── */
  const CARDS = "ix_tutor_cards_v1", STEPS = [1, 3, 7, 16, 35], DAY = 864e5;
  let activeCard = null;
  const cards = () => jget(CARDS);
  const saveCards = (c) => ls.set(CARDS, JSON.stringify(c.slice(-300)));
  function dueCards(now) { now = now || Date.now(); return cards().filter((c) => c.due <= now).sort((a, b) => a.due - b.due); }
  function addCard(idea, answer) {
    idea = String(idea || "").replace(/\s+/g, " ").trim(); if (idea.length < 12) return;
    const c = cards(), tail = idea.slice(-300);
    if (c.some((x) => x.idea.slice(-300) === tail)) return;
    c.push({ id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), idea: tail, ans: String(answer || "").slice(0, 200), topic: topicKey(), step: 0, due: Date.now() + DAY, made: Date.now(), right: 0 });
    saveCards(c);
  }
  function reschedule(id, verdict) {
    const c = cards(), x = c.find((y) => y.id === id); if (!x) return;
    if (verdict === "correct") { x.right++; x.due = Date.now() + STEPS[Math.min(x.step, STEPS.length - 1)] * DAY; x.step++; }
    else if (verdict === "partly") x.due = Date.now() + DAY;
    else { x.step = 0; x.due = Date.now() + DAY; }
    x.last = Date.now(); saveCards(c);
  }
  function memory() { const c = cards(), now = Date.now(); return { total: c.length, due: c.filter((x) => x.due <= now).length, solid: c.filter((x) => x.step >= 3).length }; }

  /* ───── v21 examiner check: a second model reads every generated MCQ for item-writing flaws (56% of LLM items have one) ───── */
  async function verify(text, key) {
    try {
      const r = await fetch(API + "/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
        body: JSON.stringify({ model: ls.get(MODEL, DEFAULT_MODEL), max_tokens: 120, usage: { include: true }, messages: [{ role: "system", content: "You are an NBME-trained item reviewer for a Kasr Al Ainy CNS exam. Check the MCQ below for: a factual error, more than one defensible answer, no correct option, a cue that gives the answer away (grammar, length, 'always/never'), or a stem that does not ask a clear question. Do NOT reveal or hint the answer. Reply with exactly 'OK' or 'FLAW: <max 15 words, no answer>'." }, { role: "user", content: text.slice(0, 3000) }] }) });
      if (!r.ok) return null;
      const j = await r.json(); if (j.usage && j.usage.cost) addSpend(j.usage.cost);
      const v = ((j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "").trim();
      return /^OK\b/i.test(v) ? "🔎 *Checked by a second model: no item-writing flaw found.*" : /^FLAW/i.test(v) ? "⚠️ *Second-model check: " + v.replace(/^FLAW:?\s*/i, "possible flaw: ").slice(0, 160) + " Treat this item with care.*" : null;
    } catch (e) { return null; }
  }

  function triageText() {
    const st = examinerStyle(), rows = Object.entries(st).sort((a, b) => b[1].n - a[1].n);
    const tot = rows.reduce((t, r) => t + r[1].n, 0);
    return "CHAPTER WEIGHT (practice half of the past-paper bank; share of all past questions):\n" + rows.map(([c, o]) => "- " + c + " (" + o.subject + "): " + o.n + " = " + ((100 * o.n) / tot).toFixed(1) + "%").join("\n") +
      "\nERROR TYPES so far: " + JSON.stringify(errTypes()) + "\nDAILY BUDGET: " + life().mins + " min, day off weekday " + life().off;
  }
  function blindRange() {
    const b = jget(BLIND); let n = 0, k = 0; b.forEach((x) => { n += x.n; k += x.k; });
    if (n < 5) return { n, k, p: null };
    const z = 1.2816, ph = k / n, den = 1 + (z * z) / n, c = (ph + (z * z) / (2 * n)) / den, h = (z * Math.sqrt((ph * (1 - ph)) / n + (z * z) / (4 * n * n))) / den;
    return { n, k, p: ph, lo: Math.max(0, c - h), hi: Math.min(1, c + h) };
  }
  function statsText() {
    const c = jget(CAL), wk = c.filter((x) => x.at > Date.now() - 7 * DAY), k = calibration(), m = memory(), sp = spend();
    const cnt = (v) => wk.filter((x) => x.verdict === v).length;
    return "STATS (last 7 days, from this device):\n- judged answers: " + wk.length + " (right " + cnt("correct") + ", partly " + cnt("partly") + ", wrong " + cnt("wrong") + ")\n- said 'sure': " + k.sure + " times, right " + k.sureRight + " (all time); traps: " + k.traps +
      "\n- memory deck: " + m.total + " ideas, " + m.due + " due now, " + m.solid + " solid\n- AI spend this week: $" + sp.usd.toFixed(2) + " of $" + cap().toFixed(2) + " (" + sp.calls + " calls)" +
      "\n- certainty-based score (last 40, range −6 to +3; above 1.5 means you know what you know): " + (k.cbm == null ? "not enough yet" : k.cbm) +
      "\n- error types: " + JSON.stringify(errTypes()) +
      "\n- blind checks (new questions, AI off): " + (blindRange().p == null ? "fewer than 5 answered" : Math.round(blindRange().p * 100) + "% (" + Math.round(blindRange().lo * 100) + "–" + Math.round(blindRange().hi * 100) + "%) on " + blindRange().n) +
      "\n- today: " + dayState().used + " of " + dayState().budget + " planned minutes" +
      "\n- topics with traps: " + Array.from(new Set(jget(TRAPS).map((t) => t.topic))).slice(-6).join("; ");
  }
  /* ───── OpenRouter ───── */
  let busy = null;
  async function ask(userText, mode, extraContext, opts) {
    opts = opts || {}; build();
    const key = ls.get(KEY, "");
    if (!key) { openSetup("Add your key first."); return; }
    if (blindOn) { const t0 = "A blind check is running: the AI is off until you finish it."; build(); addMsg("tutor", t0); if (opts.inline) inlinePaint(inlineCard(opts.inline), t0); return; }
    if (mockRunning()) { const lockT = "A mock exam is running. The tutor comes back when you submit it, so the mock stays a real test."; addMsg("tutor", lockT); if (opts.inline) inlinePaint(inlineCard(opts.inline), lockT); return; }
    const sp = spend();
    if (sp.usd >= cap()) { const capT = "This week's AI budget ($" + cap().toFixed(2) + ") is used up ($" + sp.usd.toFixed(2) + "). It resets on Monday, or raise it in ⚙︎. Everything else in the app still works."; build(); addMsg("tutor", capT); if (opts.inline) inlinePaint(inlineCard(opts.inline), capT); return; }
    const LIGHT = { week: 1, examday: 1, triage: 1, plan: 1 };
    const gate = !LIGHT[mode] && !opts.force ? lifeGate() : null;
    if (gate) { addMsg("tutor", gate); if (opts.inline) inlinePaint(inlineCard(opts.inline), gate); sub(); return; }
    tickDay();
    const interests = ls.get("ix_tutor_interests_v1", "").trim();
    if (interests && (mode === "palace" || mode === "why" || mode === "case")) extraContext = (extraContext ? extraContext + "\n\n" : "") + "THE STUDENT'S INTERESTS (use them to frame hooks and cases; never change a fact): " + interests.slice(0, 300);
    if (mode === "triage") extraContext = (extraContext ? extraContext + "\n\n" : "") + triageText();
    if (mode === "week") extraContext = (extraContext ? extraContext + "\n\n" : "") + statsText();
    if (mode === "review") {
      const due = dueCards();
      if (!due.length) { const m = memory(), t = "Nothing is due for review today ✓ (" + m.total + " ideas in your memory deck, " + m.solid + " already solid). Next: ▶ Learn this."; addMsg("tutor", t); if (opts.inline) inlinePaint(inlineCard(opts.inline), t); return; }
      activeCard = due[0].id;
      extraContext = (extraContext ? extraContext + "\n\n" : "") + "CARD (an idea the student got wrong before; " + due.length + " due today, this is 1):\n" + due[0].idea + (due[0].ans ? "\nTheir earlier answer: " + due[0].ans : "");
    }
    const history = chat().slice(-12).map((m) => ({ role: m.who === "me" ? "user" : "assistant", content: m.text }));
    const lastTutor = (chat().filter((m) => m.who === "tutor").pop() || {}).text || "";
    const myConf = conf;
    if (myConf) userText = userText + "\n(confidence: " + (myConf === "guess" ? "guessing" : myConf) + ")";
    if (mode === "classmate" || mode === "traps") extraContext = (extraContext ? extraContext + "\n\n" : "") + "THE STUDENT'S OWN TRAPS (questions they were sure about and got wrong):\n- " + (jget(TRAPS).slice(-12).map((t) => t.q.replace(/\s+/g, " ").slice(0, 220)).join("\n- ") || "(none yet: use the classic traps of this topic)");
    const sys = SYSTEM + (ls.get(LANG, "en") === "ar" ? "\n" + AR_RULE : "") + "\n\n" + context((MODES[mode] ? MODES[mode].brief : "") + (extraContext ? "\n\n" + extraContext : ""));
    const model = (MODES[mode] && MODES[mode].pro) || (opts.images && opts.images.length) ? ls.get(MODEL_PRO, DEFAULT_PRO) : ls.get(MODEL, DEFAULT_MODEL);
    addMsg("me", userText);
    const out = addMsg("tutor", "", true);
    const card = opts.inline ? inlineCard(opts.inline) : null;
    const userContent = opts.images && opts.images.length ? [{ type: "text", text: userText }].concat(opts.images.map((u) => ({ type: "image_url", image_url: { url: u } }))) : userText;
    const ctrl = new AbortController(); busy = ctrl; setBusy(true);
    let text = "";
    try {
      const r = await fetch(API + "/chat/completions", {
        method: "POST", signal: ctrl.signal,
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
        body: JSON.stringify({ model, stream: true, max_tokens: 1100, usage: { include: true }, messages: [{ role: "system", content: sys }].concat(history, [{ role: "user", content: userContent }]) }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        const msg = (j.error && j.error.message) || r.statusText;
        throw new Error(r.status === 401 ? "The key was refused. Check it in ⚙︎." : r.status === 402 ? "Your OpenRouter balance or the key's limit is used up." : r.status === 429 ? "Too many requests just now. Wait a moment and try again." : "OpenRouter: " + msg);
      }
      const rd = r.body.getReader(), dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await rd.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line.startsWith("data:")) continue;
          const d = line.slice(5).trim();
          if (d === "[DONE]") continue;
          try { const j = JSON.parse(d), piece = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content; if (j.usage && j.usage.cost) addSpend(j.usage.cost); if (piece) { text += piece; paint(out, text); if (card) inlinePaint(card, text); } } catch (e) {}
        }
      }
      if (!text) text = "(No answer came back. Try again, or pick another model in ⚙︎.)";
      else if ((mode === "quiz" || mode === "twin") && /(^|\n)\s*\(?[a-eA-E][).]/.test(text)) { const v = await verify(text, key); if (v) text += "\n\n" + v; }
    } catch (e) {
      text = (text ? text + "\n\n" : "") + (e.name === "AbortError" ? "(stopped)" : "⚠️ " + e.message);
    } finally {
      busy = null; setBusy(false);
      const m = TAG.exec(text);
      if (m) {
        const vd = m[1].toLowerCase();
        conf = myConf; record(vd, lastTutor); out.classList.add("v-" + vd);
        const ty = TYPE.exec(text); if (ty) { const e = jget(ERRS); e.push({ t: ty[1].toLowerCase(), at: Date.now(), topic: topicKey() }); ls.set(ERRS, JSON.stringify(e.slice(-300))); }
        if (activeCard && mode !== "review") { reschedule(activeCard, vd); activeCard = null; }
        else if (vd !== "correct") addCard(lastTutor.slice(-400), userText);
      }
      conf = null; markConf();
      paint(out, text); out.classList.remove("live"); if (card) { inlinePaint(card, text); card.classList.remove("live"); }
      const c = chat(); c.push({ who: "tutor", text, at: Date.now() }); saveChat(c); sub();
    }
  }
  const MODES = {
    loop: { label: "▶ Learn this", pro: true, prompt: "Teach me this topic with the full loop, one step at a time.", brief: "TASK: run the full learning loop on the open topic, ONE step per turn, waiting for the student each time: (1) TRY FIRST: two short questions they probably cannot answer yet (productive failure; say that being wrong here is the point). (2) TEACH the core in 5-8 short lines from the mechanism, linking to their attempts. (3) WORKED EXAMPLE: solve one exam-style item aloud, then give a similar one with the last step left for them (faded example). (4) NEW QUESTION, clinical or 'all except'. (5) TEACH-BACK: they explain it in 3 lines; you grade it. (6) one-line summary of what to review tomorrow. Say which step you are on." },
    tryfirst: { label: "Try first", prompt: "Before you teach me, give me 2 questions on this topic to try. I will probably get them wrong; that is fine.", brief: "TASK: pretest / productive failure. Ask TWO short questions on the open topic that they likely cannot answer yet, one at a time. After each attempt, do not lecture: give the key idea in 2 lines and what their attempt got right." },
    worked: { label: "Show me how", pro: true, prompt: "Solve one exam question on this topic step by step, then give me a similar one where I do the last steps.", brief: "TASK: worked example then fading. Solve one exam-style question aloud (each step and why). Then give a near-identical one with the last steps blank for the student. If they do it, fade more next time." },
    apart: { label: "Tell them apart", prompt: "Test me on the things in this topic that students confuse with each other.", brief: "TASK: interleaving of look-alikes. Pick the 2-3 things in this topic most often confused (e.g. ICA vs ECA, UMN vs LMN). Give a quick mixed set: one item at a time, the student says which one it is and the single feature that decides it." },
    case: { label: "Patient case", pro: true, prompt: "Give me a short patient case on this topic. I will interpret each finding first.", brief: "TASK: clinical case. Present a 3-line patient. Reveal findings one at a time; the student interprets each finding BEFORE you add anything. Then ask for the lesion / diagnosis / mechanism. Never interpret a finding before the student does." },
    classmate: { label: "Fix my classmate", prompt: "Show me a classmate's answer on this topic with mistakes in it. I'll find and fix them.", brief: "TASK: teachable agent with planted errors. Write a short 'classmate' answer (4-6 lines) on the open topic containing exactly 2 mistakes, built from the student's own traps below when they fit, otherwise from classic traps. The student must find and fix both. Then reveal which they missed." },
    map: { label: "Connect it", prompt: "Ask me to connect this topic to 4 things I already know, then check my links.", brief: "TASK: concept mapping. Name the central idea and ask the student to link it to 4 other ideas (structure, function, lesion, exam fact), each as 'A → B because …'. Check every link; fix wrong ones." },
    traps: { label: "My traps", prompt: "Drill me on my traps: the things I was sure about and got wrong.", brief: "TASK: review the student's own traps below. One at a time: ask a fresh question on the same false belief (not the same wording), wait, then contrast the belief and the truth in one line." },
    draw: { label: "Draw it", prompt: "Make me draw this from memory, then help me check my drawing.", brief: "TASK: drawing to learn. Ask the student to draw the key structure or pathway of the open topic FROM MEMORY on paper (60-90 seconds), naming exactly which 5-7 labels it must have. Wait. Then they list or describe what they drew; check each label and relation against the course (Dr Doss drawing if the topic has one), name what is missing or misplaced, and tell them to look at the reference drawing now and redraw only the wrong part. Do not claim you can see the paper." },
    palace: { label: "Memory hook", prompt: "This list will not stick. Build me a memory hook for it.", brief: "TASK: mnemonics for arbitrary lists only (branches, contents, order). First say in one line whether this needs a hook or is better understood from the mechanism. If a hook fits: build a short memory palace (5-7 places along a route the student knows, e.g. home to college) or an acronym, one vivid odd image per item, built from THE STUDENT'S INTERESTS when given (never changing the facts), then make them recall it back once now. Keep every fact exactly as the course states it." },
    plan: { label: "Plan today", prompt: "Help me plan today's study in 2 minutes.", brief: "TASK: WOOP plus an implementation intention, in at most 4 short turns. Ask: Wish (what to finish today, small), Outcome (how it feels), Obstacle (the inner one, e.g. phone, starting), Plan: write ONE 'If [obstacle], then I will [action]' and ONE 'When [time/place], I will start [first 2-minute step]'. End with the two lines only, so they can screenshot them." },
    outline: { label: "Blank page", pro: true, prompt: "Give me a written-exam question on this topic; I will write the outline from a blank page and you grade it.", brief: "TASK: written-exam retrieval. Give one likely essay question on the open topic. The student writes the outline (headings and key points) from memory. Grade against what a Kasr Al Ainy examiner rewards: list each point present, each missing point, and an estimated mark range (not one number; say grading by AI is a coach, not the examiner). Then give the 3 missing points to rewrite tomorrow." },
    hint: { label: "Hint", hidden: true, brief: "TASK: the student is stuck on the MCQ in QUESTION and has NOT answered. NEVER say or hint which option is right, never eliminate options by letter. Give rung 1 of the hint ladder only: one short nudge that points to the mechanism or the key word in the stem (2-3 lines). If they ask again, give rung 2: a narrower question that makes them reason. Stop there." },
    optwhy: { label: "Why this answer", pro: true, hidden: true, brief: "TASK: the student just answered the MCQ in QUESTION (their choice and the key are given). If wrong: name the exact false belief that makes their option look right, then the mechanism that makes the key right, in under 8 lines. If right: say what they must have understood, and the one change to the stem that would flip the answer. End with one new check question on the same idea, not the same wording." },
    optall: { label: "Every option", hidden: true, brief: "TASK: for the MCQ in QUESTION, go through EVERY option in one line each: why it is right or why it is wrong, and when it WOULD be the answer (the stem change that makes it right). Then one line: the trap the examiner built." },
    twin: { label: "A twin question", hidden: true, brief: "TASK: write ONE new MCQ that tests the same idea as QUESTION from a different angle (clinical case, 'all except', or a lesion), never the same wording, 4-5 options a-e. Do not give the answer until the student replies; then explain every option and tag your judgement." },
    simple: { label: "Simpler", pro: true, hidden: true, brief: "TASK: the student did not get the lesson part in SECTION. Re-explain it as if to a smart 14-year-old: the mechanism in 4-6 short lines, one everyday analogy, then the exam fact in bold. End with one check question." },
    secquiz: { label: "Quiz me", hidden: true, brief: "TASK: ask THREE quick recall-and-reason questions on SECTION only, one at a time, waiting each time (attempt first). Mix: one 'why', one 'what happens if it is cut', one exam-style trap. Tag each judgement." },
    picture: { label: "Explain the picture", pro: true, hidden: true, brief: "TASK: the student is looking at the picture attached (a drawing, scan or slide from their course; its caption is given). If you can see it: walk them through it like a demonstrator in 5-8 short lines: orientation first (what view, which side), then the 4-6 structures that matter and how to find each one from a landmark, then what the exam asks about it. Then ask them to point out one structure from memory. If no image arrived, work from the caption and say so." },
    picquiz: { label: "Quiz the picture", pro: true, hidden: true, brief: "TASK: practical-exam drill on the attached picture: ask the student to identify ONE structure at a time by describing where it is ('the structure just lateral to …'), wait, judge with a tag, then the next one; 4 rounds. Never reveal the answer before they try." },
    result: { label: "Analyse my mock", pro: true, hidden: true, brief: "TASK: the student finished a mock; RESULT holds the score and the questions they missed. Find the 2-3 PATTERNS behind the misses (a topic, a type of trap, reading the stem too fast, look-alikes), not a list of facts. For each pattern: one line on the fix and which tutor tool to use (Tell them apart, My traps, Draw it, Patient case). End with the 15-minute plan for tomorrow. Be honest about the score; no grade words." },
    coach: { label: "What now?", hidden: true, brief: "TASK: study coach. From PROGRESS (what the app knows about today) and the screen, say in at most 5 short lines: the single next step with the most marks per minute, how long it takes, and when to stop for today. Then ask: 'Start now?'" },
    review: { label: "🔁 Review", prompt: "Review what is due today.", brief: "TASK: spaced review. CARD holds an idea the student got wrong before. Ask ONE fresh question that tests the same idea in NEW wording and a new angle (never repeat the old question), then wait. When they answer, judge with a tag and contrast the false belief with the truth in one line. Do not teach before they try." },
    today: { label: "▶ Today", hidden: true, brief: "TASK: zero-decision daily session coach. TODAY gives what is due and the open lesson. In at most 4 short lines say the order for today (reviews first, then the lesson loop, then stop), the minutes, and the exact stop point ('done for today' after it). Then start step 1 immediately." },
    week: { label: "📈 My week", prompt: "Give me my honest weekly report.", brief: "TASK: honest weekly report from STATS only (never invent numbers). 6 short lines: what went well, the weakest pattern (sure-but-wrong, topics), memory deck (due/solid), AI spend, and ONE change for next week. No grade words, no flattery." },
    essay: { label: "📝 Grade my essay", sheet: true, brief: "" },
    blind: { label: "🧪 Blind check", sheet: true, brief: "" },
    lesion: { label: "🧭 Lesion lab", pro: true, prompt: "Give me a lesion case to localise.", brief: "TASK: lesion lab (CNS). Give a patient's findings (3-5 signs, e.g. side of weakness, sensory loss, cranial nerve signs, reflexes). The student localises the lesion: level (cortex / internal capsule / brain stem level / cord segment / nerve), side, and the tract or nucleus for each sign. Wait. Judge each sign with a tag, then show the one-line rule that localises it (e.g. crossed signs = brain stem). Then a harder one." },
    viva: { label: "🎙 Viva", pro: true, prompt: "Examine me like the oral exam on this topic.", brief: "TASK: oral (viva) examiner. One question at a time, in this order: identify/describe a structure, its function, a lesion and what the patient shows, then 'why?'. Wait after each. Judge with tags. Be brisk and fair like a Kasr Al Ainy examiner; push one level deeper when they are right." },
    examday: { label: "🎯 Exam-day plan", prompt: "Give me my exam-day protocol.", brief: "TASK: exam-day protocol for a Kasr Al Ainy MCQ or written paper, max 10 short lines: minutes per question (from the number of questions and time if the student gives them; otherwise ask), first pass answer what you know and mark the rest, underline except/not/most, change an answer only with a concrete reason, written: outline first then fill, draw-and-label where possible, last 5 minutes check every question answered. Then: sleep and food the night before; no new topics in the last 24 hours." },
    triage: { label: "✂️ What to drop", pro: true, prompt: "If time is short, what should I skip?", brief: "TASK: honest triage. Using CHAPTER WEIGHT, pick the lowest-yield 15-20% of chapters the student can skip or only skim if time is short, and the top chapters that must be solid. Say roughly what share of past questions the skipped part held. Then fit the rest into DAILY BUDGET. Never suggest more daily minutes; cut scope instead." },
    postmortem: { label: "🩻 Post-mortem", pro: true, sheet: true, brief: "TASK: exam post-mortem. EXAM QUESTIONS holds what the student remembers from the real exam, each with how often the past-paper bank asked something close. Label each one: (A) was in past papers, known but missed; (B) in the topic but asked a new way; (C) never in the bank: lecture-only content. Then count A/B/C, say what that means for the NEXT exam's study (e.g. many C = lectures matter more than the bank), and give a 3-line plan. Honest, no blame." },
    import: { label: "Notes from photo", pro: true, hidden: true, brief: "TASK: transcribe the attached photo of the student's own notes or handout into clean study notes: headings and short bullet points, every fact exactly as written, nothing added. If something is unreadable write [unclear]. No commentary." },
    why: { label: "Why?", pro: true, hidden: true, brief: "TASK: the student tapped WHY on the text in SELECTED. Answer in exactly these parts, each short:\n**🧠 Why** — the mechanism behind it, from first principles, 3-5 short lines.\n**👁 Picture it** — one vivid image, analogy or everyday comparison.\n**🔒 Lock it in** — one memory hook or mnemonic, and what to link it to that they already know.\n**🎯 In the exam** — use EXAM RELEVANCE honestly: how often and how it was asked, the classic trap, and whether it is a written-exam point too. If the data shows no past question, say that plainly.\n**✅ Check** — one question that needs understanding. Then wait." },
    explain: { pro: true, label: "Explain this", prompt: "Explain what I am looking at now, simply, from the mechanism. Then check me.", brief: "TASK: explain the open topic from first principles, then ask one understanding check." },
    quiz: { label: "New exam question", prompt: "Give me ONE new exam-style MCQ on this topic (not a copy of a question on my screen), with 4 or 5 options. Do not give the answer until I reply.", brief: "TASK: write ONE new Kasr Al Ainy style MCQ on the open topic that tests understanding (clinical or mechanism), different from any question on screen. 4-5 options a-e. Wait for the student's answer, then explain every option." },
    teach: { label: "I'll explain it", prompt: "I will explain this topic in my own words. Ask me to start, then grade me.", brief: "TASK: teach-back. Ask the student to explain the topic in their own words. Then grade it out of 10 for understanding, list what was missing or wrong, and give one follow-up question." },
    wrong: { label: "Why was I wrong?", prompt: "I got the question on my screen wrong. Find the exact misunderstanding behind my mistake and fix it.", brief: "TASK: the student just answered the question on screen wrongly. Diagnose the likely misunderstanding (not just restate the key), fix it with the mechanism, then give a NEW question on the same idea." },
    written: { label: "Written answer", pro: true, prompt: "Give me the written-exam question most likely on this topic, then the model answer as the department wants it.", brief: "TASK: written exam model answer. Give the most likely essay question on this topic (or use the one given), its usual marks, then the MODEL ANSWER exactly as a Kasr Al Ainy examiner wants it: the structure the verb demands (see HOW KASR AL AINY EXAMS WORK), numbered points, a table when comparing, what to draw and label. Build it from the reference answer and his notes when given. After it: the 3 points examiners most often see missing, and one line: 'Now write it from a blank page and tap 📝 to get it marked.'" },
  };

  // v26: the teaching methods, rewritten in full. Each brief = the method's steps + the examiner's angle + what not to do.
  const BRIEF = {
    loop: "TASK: the full learning loop on the open topic, ONE step per turn, waiting for him each time; say 'Step n/6' at the top.\n1) TRY FIRST (productive failure): two short questions he probably cannot answer yet, one about the mechanism, one exam-style; say that being wrong here makes the learning stick.\n2) TEACH the core in 5-8 lines from the mechanism (cause → mechanism → effect → exam fact), built on what his attempts showed; one picture to hold in mind.\n3) WORKED EXAMPLE then FADING: solve one past-paper-style item aloud (why each option is in or out), then a near-identical one with the last step left to him.\n4) EXAMINER'S ANGLE: one NEW question the way these examiners would ask it (negative stem or clinical, per EXAMINER PROFILE); tag your judgement.\n5) TEACH-BACK: he explains it in 3 lines as if to a classmate; mark it /10 for understanding and name what was missing.\n6) CLOSE: the one-line summary, the trap to remember, and 'This comes back tomorrow as a review'.",
    tryfirst: "TASK: pretest (productive failure). Two short questions on the open topic he is unlikely to answer yet, one at a time: one 'why/what happens if', one past-paper style. After each attempt: what his attempt got right, then the key idea in 2 lines. No lecturing.",
    worked: "TASK: worked example → fading. Solve one exam-style question aloud: read the stem like an examiner (underline the negative word, find the clinical clue), then each option in or out with its reason. Then give a near-identical question with the last 1-2 steps blank for him; if he succeeds, fade more next time.",
    apart: "TASK: interleaving of look-alikes (the examiners' favourite distractors). Pick the 2-3 things in this topic most often confused (e.g. ICA vs ECA, PCT vs DCT, UMN vs LMN). A quick mixed set, one item at a time: he names which one it is and the ONE feature that decides it. Tag each answer. End with a 2-row table of the deciding features.",
    case: "TASK: clinical case the way Kasr writes them. A 3-line patient (age, complaint, one sign). Reveal the findings one at a time; he interprets EACH finding (finding → structure → mechanism) BEFORE you add anything. Then he names the lesion / diagnosis / mechanism. Tag each step. Finish with how this case would appear as an MCQ and as a written 'comment on' question.",
    classmate: "TASK: teachable agent with planted errors. Write a short 'classmate' answer (4-6 lines) on the open topic with exactly 2 mistakes, taken from HIS OWN TRAPS below when they fit, otherwise from the classic examiner traps for this topic. He must find and fix both. Then reveal any he missed and why it is a trap.",
    map: "TASK: concept mapping. Name the central idea; he links it to 4 others (structure → function → lesion → exam fact), each written 'A → B because …'. Check every link: correct, incomplete or wrong; fix the wrong ones with the mechanism. End with the map as 5 short lines.",
    traps: "TASK: his own traps (sure-but-wrong) below. One at a time: a FRESH question on the same false belief (new wording, new angle, never the old item), wait, judge with tags, then contrast his belief and the truth in one line.",
    draw: "TASK: drawing to learn. He draws the key structure, section or pathway of the open topic FROM MEMORY on paper (60-90 seconds); name exactly the 5-7 labels it must have. Wait. He lists or describes what he drew (or sends a photo via 📝). Check each label and relation against the course (Dr Doss drawing if the topic has one); name what is missing or misplaced; tell him to look at the reference drawing now and redraw only the wrong part. Note what an examiner wants labelled in a 'draw and label' question.",
    palace: "TASK: mnemonics for ARBITRARY lists only (branches, contents, order, boundaries). First say in one line whether this needs a hook or is better understood from the mechanism. If a hook fits: a short memory palace (5-7 places along a route he knows, e.g. home → college) or an acronym, one vivid odd image per item, built from HIS INTERESTS when given; make him recall it back once now. Facts exactly as the course states them; the list count must match what the examiners ask.",
    why: "TASK: he tapped WHY on the text in SELECTED. Answer in exactly these parts, each short:\n**🧠 Why** — the mechanism behind it from first principles, as a causal chain (3-5 lines).\n**👁 Picture it** — one vivid image, analogy or everyday comparison.\n**🔒 Lock it in** — one memory hook, and what to link it to that he already knows.\n**🎯 In the exam** — use EXAM RELEVANCE and the EXAMINER PROFILE honestly: how often and how it was asked (MCQ stem type, written verb), the classic trap, and whether it is a written point. If the data shows no past question, say so plainly.\n**✅ Check** — one question that needs understanding. Then wait.",
    explain: "TASK: explain the open topic from first principles: cause → mechanism → effect → exam fact, one picture, one clinical consequence, the classic trap. Then ONE understanding check.",
    quiz: "TASK: write ONE new MCQ on the open topic exactly as these examiners write them (EXAMINER PROFILE): single best answer, 4-5 options a-e, plausible distractors from neighbouring look-alikes, a negative or clinical stem when that topic is usually asked that way; no clues in grammar or length; never a copy of a question on screen. Do not give the answer until he replies; then judge with tags and explain every option in one line each.",
    twin: "TASK: ONE new MCQ that tests the same idea as QUESTION from a different angle (clinical case, 'all except', or a lesion), never the same wording, 4-5 options a-e, distractors the examiners would use. No answer until he replies; then tag your judgement and explain every option.",
    teach: "TASK: teach-back (the protégé effect). Ask him to explain the topic in his own words as if to a classmate who missed the lecture. Then mark it /10 for understanding: what was right, what was missing or wrong (the exact point), and one follow-up question that goes one level deeper.",
    wrong: "TASK: he answered the question on screen wrongly. Diagnose the exact misunderstanding (which false belief makes his option look right), fix it with the mechanism, name the error type, then give a NEW question on the same idea from another angle.",
    hint: "TASK: he is stuck on the MCQ in QUESTION and has NOT answered. NEVER say or hint which option is right, never eliminate options by letter. Rung 1 only: one short nudge toward the mechanism or the key word in the stem (an EXCEPT, a side, a level) in 2-3 lines. If he asks again, rung 2: a narrower question that makes him reason. Stop there.",
    optwhy: "TASK: he just answered the MCQ in QUESTION (his choice and the key are given). If wrong: name the exact false belief that makes his option look right, then the mechanism that makes the key right, in under 8 lines, and the error type. If right: say what he must have understood, and the one change to the stem that would flip the answer (that is how examiners write the next variant). End with one new check question on the same idea, not the same wording.",
    optall: "TASK: for the MCQ in QUESTION, EVERY option in one line each: right or wrong and why, and when it WOULD be the answer (the stem change that makes it right). Then one line: the trap the examiner built into this question.",
    simple: "TASK: he did not get the part in SECTION. Re-explain it as to a smart 14-year-old: the mechanism in 4-6 short lines, one everyday analogy, then the exam fact in bold and the one trap. End with one check question.",
    secquiz: "TASK: THREE quick questions on SECTION only, one at a time, waiting each time (attempt first): one 'why', one 'what happens if it is cut/blocked', one past-paper trap in the examiners' style. Tag each judgement.",
    viva: "TASK: the oral examiner (viva). One question at a time in this order: identify/describe the structure, its function, a lesion and what the patient shows, then 'why?'. Wait after each; tag your judgement. Be brisk and fair like a Kasr Al Ainy examiner; when he is right push one level deeper; when he is wrong give a short prompt before the answer.",
    lesion: "TASK: lesion lab. Give a patient's findings (3-5 signs: side of weakness, sensory loss, cranial nerve signs, reflexes, or for the abdomen: pain site, referred pain, a mass). He localises the lesion: level, side, and the structure or tract for each sign. Wait. Judge each sign with a tag, then the one-line rule that localises it (e.g. crossed signs = brain stem; referred pain follows the segment). Then a harder one.",
  };
  Object.keys(BRIEF).forEach((k) => { if (MODES[k]) MODES[k].brief = BRIEF[k]; });

  /* ───── chat store ───── */
  function chat() { try { const c = JSON.parse(ls.get(CHAT, "[]")); return Array.isArray(c) ? c : []; } catch (e) { return []; } }
  function saveChat(c) { ls.set(CHAT, JSON.stringify(c.slice(-60))); }

  /* ───── UI ───── */
  let root, log, input, sendBtn;
  function build() {
    if (root) return;
    root = document.createElement("div");
    root.className = "ixT"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "AI tutor");
    root.innerHTML =
      '<div class="ixTbox"><div class="ixThd"><b>🧠 Tutor</b><span class="ixTsub" id="ixTsub"></span><button type="button" data-t="life" title="My day: study budget, stop time, day off">⏱</button><button type="button" data-t="lang" title="Explain in Egyptian Arabic / English" id="ixTlang"></button><button type="button" data-t="notes" title="My lecture notes for this topic">📝</button><button type="button" data-t="setup" title="Key and model">⚙︎</button><button type="button" data-t="close" aria-label="Close">✕</button></div>' +
      '<div class="ixTmodes">' + Object.keys(MODES).filter((k) => !MODES[k].hidden).map((k) => '<button type="button" data-mode="' + k + '">' + MODES[k].label + "</button>").join("") + "</div>" +
      '<div class="ixTlog" id="ixTlog"></div>' +
      '<div class="ixTconf" role="group" aria-label="How sure are you?"><span>How sure?</span><button type="button" data-conf="guess">😬 Guessing</button><button type="button" data-conf="unsure">🤔 Unsure</button><button type="button" data-conf="sure">😎 Sure</button></div>' +
      '<form class="ixTin"><textarea rows="2" placeholder="Ask anything about this topic…" id="ixTq"></textarea><button type="submit" class="primary" id="ixTsend">Send</button></form></div>';
    document.body.appendChild(root);
    log = root.querySelector("#ixTlog"); input = root.querySelector("#ixTq"); sendBtn = root.querySelector("#ixTsend");
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) { if (e.target === root) close(); return; }
      if (b.dataset.t === "close") close();
      else if (b.dataset.t === "setup") openSetup();
      else if (b.dataset.t === "notes") openNotes();
      else if (b.dataset.t === "lang") { lang(lang() === "ar" ? "en" : "ar"); markLang(); }
      else if (b.dataset.t === "clear") { saveChat([]); renderLog(); }
      else if (b.dataset.conf) { conf = conf === b.dataset.conf ? null : b.dataset.conf; markConf(); }
      else if (b.dataset.mode === "postmortem") openPostmortem();
      else if (b.dataset.mode === "essay") openEssay();
      else if (b.dataset.mode === "blind") openBlind();
      else if (b.dataset.t === "life") openLife();
      else if (b.dataset.mode && !busy) ask(MODES[b.dataset.mode].prompt, b.dataset.mode);
    });
    root.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (busy) { busy.abort(); return; }
      const q = input.value.trim(); if (!q) return; input.value = ""; ask(q, null);
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); root.querySelector("form").requestSubmit(); } });
  }
  function markLang() { document.querySelectorAll("#ixTlang, [data-ai-lang]").forEach((x) => { x.textContent = lang() === "ar" ? "ع" : "EN"; x.setAttribute("aria-pressed", lang() === "ar" ? "true" : "false"); }); }
  function markConf() { if (root) root.querySelectorAll("[data-conf]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.conf === conf ? "true" : "false")); }
  function setBusy(on) { if (sendBtn) sendBtn.textContent = on ? "Stop" : "Send"; }
  const VBADGE = { correct: "✅ Right", partly: "🟡 Partly", wrong: "❌ Not yet" };
  function paint(el, text) {
    el.querySelector(".ixTtxt").innerHTML = badge(text);
    log.scrollTop = log.scrollHeight;
  }
  function addMsg(who, text, live) {
    if (who === "me") { const c = chat(); c.push({ who, text, at: Date.now() }); saveChat(c); }
    const el = document.createElement("div"); el.className = "ixTm " + who + (live ? " live" : "");
    el.innerHTML = '<div class="ixTtxt"></div>'; log.appendChild(el); paint(el, text); return el;
  }
  function renderLog() {
    log.innerHTML = "";
    const c = chat();
    if (!c.length) log.innerHTML = '<div class="ixTempty"><p><b>Ask about whatever is on your screen.</b> The tutor sees the lesson or question you have open, and your lecture notes for it (📝).</p><p>Try <b>Explain this</b>, then <b>New exam question</b>: it writes questions that are not in the bank, so you practise understanding, not remembering.</p></div>';
    c.slice(-30).forEach((m) => { const el = document.createElement("div"); el.className = "ixTm " + m.who; el.innerHTML = '<div class="ixTtxt"></div>'; log.appendChild(el); paint(el, m.text); });
    if (c.length) { const b = document.createElement("button"); b.type = "button"; b.className = "ixTclear"; b.dataset.t = "clear"; b.textContent = "Clear the conversation"; log.prepend(b); }
    log.scrollTop = log.scrollHeight;
  }
  function sub() { const el = root && root.querySelector("#ixTsub"); if (el) { const n = notesFor(topicKey()); const k = calibration(); el.textContent = (topicKey() === "general" ? "" : topicKey().slice(0, 32)) + (n ? " · notes ✓" : "") + (k.sure ? " · sure & right " + k.sureRight + "/" + k.sure : "") + (k.traps ? " · traps " + k.traps : "") + (memory().due ? " · 🔁 " + memory().due + " due" : "") + (k.cbm != null ? " · CBM " + k.cbm : "") + " · ⏱ " + dayState().used + "/" + dayState().budget + "m · $" + spend().usd.toFixed(2) + "/wk"; } }
  function open() {
    build();
    if (mockRunning()) { renderLog(); addMsg("tutor", "A mock exam is running. The tutor comes back when you submit it, so the mock stays a real test."); root.classList.add("on"); return; }
    root.classList.add("on"); renderLog(); sub(); markLang();
    if (!ls.get(KEY, "")) openSetup();
    else setTimeout(() => input && input.focus(), 50);
  }
  function close() {
    if (!root) return;
    root.classList.remove("on");
    root.querySelectorAll(".ixTactivity").forEach((activity) => activity.remove());
    blindOn = false;
    document.documentElement.classList.remove("ixBlind");
  }

  function sheet(html) {
    const s = document.createElement("div"); s.className = "ixTsheet"; s.innerHTML = '<div class="ixTsheetIn">' + html + "</div>";
    root.querySelector(".ixTbox").appendChild(s);
    s.addEventListener("click", (e) => { if (e.target.closest("[data-x]")) s.remove(); });
    return s;
  }
  /* v37 · the full key check: (1) the key is accepted, (2) money is left (key limit and account credits), (3) the fast
   * model and (4) the professor model each answer a 1-word test (costs well under 0.01 cent). Every line says what to do
   * if it fails. The key is only ever sent to openrouter.ai. */
  async function checkKey(key) {
    key = key || ls.get(KEY, ""); const lines = []; let ok = true;
    if (!key) return { ok: false, lines: ["✗ No key on this device. Paste it in 🧠 → ⚙︎."] };
    if (!/^sk-or-/.test(key)) return { ok: false, lines: ["✗ That is not an OpenRouter key (it starts with sk-or-)."] };
    const H = { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" };
    try {
      const r = await fetch(API + "/key", { headers: H });
      if (!r.ok) return { ok: false, lines: [r.status === 401 ? "✗ OpenRouter refused this key (deleted or mistyped). Make a new one on openrouter.ai → Keys and paste it." : "✗ OpenRouter answered " + r.status + " when checking the key."] };
      const d = (await r.json()).data || {};
      lines.push("✓ Key accepted" + (d.label ? " (" + d.label + ")" : "") + ".");
      if (d.limit != null) { const rem = d.limit_remaining != null ? d.limit_remaining : d.limit - (d.usage || 0); lines.push((rem > 0.05 ? "✓" : "✗") + " Key limit $" + d.limit + ", used $" + (d.usage || 0).toFixed(2) + ", left $" + Math.max(0, rem).toFixed(2) + (rem > 0.05 ? "." : ": raise the key's limit on openrouter.ai → Keys.")); if (rem <= 0.05) ok = false; }
      else lines.push("• No spending limit on this key (you can set one on openrouter.ai → Keys).");
    } catch (e) { return { ok: false, lines: ["✗ Could not reach openrouter.ai. Check the internet and try again."] }; }
    try {
      const r = await fetch(API + "/credits", { headers: H });
      if (r.ok) { const c = (await r.json()).data || {}; const bal = (c.total_credits || 0) - (c.total_usage || 0); lines.push((bal > 0.05 ? "✓" : "✗") + " Account balance $" + bal.toFixed(2) + (bal > 0.05 ? "." : ": add credits on openrouter.ai → Credits (the AI stops at $0).")); if (bal <= 0.05) ok = false; }
    } catch (e) {}
    for (const [name, model] of [["Fast model", ls.get(MODEL, DEFAULT_MODEL)], ["Professor model", ls.get(MODEL_PRO, DEFAULT_PRO)]]) {
      try {
        const r = await fetch(API + "/chat/completions", { method: "POST", headers: H, body: JSON.stringify({ model, max_tokens: 5, messages: [{ role: "user", content: "Reply with the word OK." }], usage: { include: true } }) });
        if (r.ok) { try { const j = await r.json(); if (j.usage && j.usage.cost) addSpend(j.usage.cost); } catch (e) {} lines.push("✓ " + name + " answers (" + model + ")."); }
        else { ok = false; const t = await r.text().catch(() => ""); lines.push("✗ " + name + " (" + model + "): " + (r.status === 402 ? "no credit left: add credits on openrouter.ai." : r.status === 404 || /not a valid model|No endpoints/i.test(t) ? "this model name is not available: reset it to " + (name === "Fast model" ? DEFAULT_MODEL : DEFAULT_PRO) + " in ⚙︎." : r.status === 429 ? "busy right now (rate limit): try again in a minute." : r.status === 403 ? "refused for this key/region (" + t.slice(0, 80) + ")." : "OpenRouter answered " + r.status + ".")); }
      } catch (e) { ok = false; lines.push("✗ " + name + ": could not reach openrouter.ai."); }
    }
    lines.push(ok ? "All good: the AI professor is ready." : "Fix the ✗ line above, then tap Save and test again.");
    try { ls.set("ix_tutor_keycheck_v1", JSON.stringify({ at: Date.now(), ok })); } catch (e) {}
    return { ok, lines };
  }
  function openSetup(note) {
    build(); root.classList.add("on");
    const has = !!ls.get(KEY, "");
    const s = sheet(
      "<h3>Your OpenRouter key</h3>" + (note ? '<p class="ixTwarn">' + E(note) + "</p>" : "") +
      "<p>It is saved <b>only on this device</b>. It is not in your progress, the cloud save, the progress file or the app's code. Never paste it in a chat.</p>" +
      '<ol class="ixTsteps"><li>openrouter.ai → <b>Keys</b> → <b>Create key</b>.</li><li>Give it a <b>credit limit</b> (for example $5): then even a leaked key cannot spend more.</li><li>Copy it and paste it here.</li></ol>' +
      '<label>Key<input type="password" id="ixTkey" autocomplete="off" spellcheck="false" placeholder="' + (has ? "saved · paste a new one to replace it" : "sk-or-v1-…") + '"></label>' +
      '<label>Professor model <small>(Why?, Explain this, Written answer)</small><input type="text" id="ixTpro" spellcheck="false" list="ixTlist" value="' + E(ls.get(MODEL_PRO, DEFAULT_PRO)) + '"></label>' +
      '<label>Fast model <small>(chat, quizzes, teach-back)</small><input type="text" id="ixTmodel" spellcheck="false" list="ixTlist" value="' + E(ls.get(MODEL, DEFAULT_MODEL)) + '"></label>' +
      '<label>My interests <small>(memory hooks and cases are framed around them; e.g. football, gaming, cars)</small><input type="text" id="ixTint" value="' + E(ls.get("ix_tutor_interests_v1", "")) + '"></label>' +
      '<label>Weekly AI budget (US$) <small>(the tutor stops for the week when it is reached)</small><input type="number" id="ixTcap" min="0.2" step="0.5" value="' + cap() + '"></label>' +
      '<p class="ixTsmall">This week so far: $' + spend().usd.toFixed(2) + " in " + spend().calls + " answers.</p>" +
      '<datalist id="ixTlist">' + PRESETS.map((p) => '<option value="' + p[0] + '">' + p[1] + "</option>").join("") + "</datalist>" +
      '<p class="ixTsmall">Prices are per million tokens (in / out), read from OpenRouter on 16 Nov 2026. A Why? answer with the professor costs about $0.01; with a fast model about $0.001. Any name from openrouter.ai/models works.</p>' +
      '<div class="ixTrow"><button type="button" class="primary" id="ixTsave">Save and test</button>' + (has ? '<button type="button" id="ixTforget">Remove key</button>' : "") + '<button type="button" data-x>Close</button></div><p class="ixTstatus" id="ixTstatus"></p>'
    );
    const st = s.querySelector("#ixTstatus");
    s.querySelector("#ixTsave").onclick = async () => {
      const k = s.querySelector("#ixTkey").value.trim(), m = s.querySelector("#ixTmodel").value.trim() || DEFAULT_MODEL;
      ls.set(MODEL, m); ls.set(MODEL_PRO, s.querySelector("#ixTpro").value.trim() || DEFAULT_PRO);
      const cv = parseFloat(s.querySelector("#ixTcap").value); if (Number.isFinite(cv) && cv > 0) ls.set(CAPK, String(cv));
      ls.set("ix_tutor_interests_v1", s.querySelector("#ixTint").value.trim().slice(0, 300));
      if (k) { if (!/^sk-or-/.test(k)) { st.textContent = "That does not look like an OpenRouter key (it starts with sk-or-)."; return; } if (window.IX_KEY) { if (!(await IX_KEY.save(k))) { st.textContent = "This phone's storage for the app is full, so the key could not be saved. Open 📤 Share my progress, save the progress file, then free space and try again."; return; } } else ls.set(KEY, k); }
      const key = ls.get(KEY, ""); if (!key) { st.textContent = "Paste your key first."; return; }
      st.textContent = "Testing the key, the balance and both models…";
      const res = await checkKey(key);
      st.innerHTML = res.lines.map((l) => "<div>" + E(l) + "</div>").join("");
      if (res.ok) setTimeout(() => { s.remove(); renderLog(); input && input.focus(); }, 1400);
    };
    const f = s.querySelector("#ixTforget");
    if (f) f.onclick = () => { ls.del(KEY); st.textContent = "Key removed from this device."; f.remove(); };
  }
  /* ───── v21 written-answer grader: one LLM grade is unstable (kappa ~0.72, varies run to run), so it grades
     three times and reports the median and the spread; it coaches, the examiner decides ───── */
  /* v25: answer the verb. Kasr written questions are marked on structure as much as content */
  function verbTemplate(q) {
    const t = String(q || "").toLowerCase();
    if (/compar|differen|versus|\bvs\b|table/.test(t)) return "COMPARE → a table: one column per item, one row per feature asked (site, structure, function, …); one closing line on the key difference.";
    if (/\bcase\b|year[s]?[- ]old|patient|comment on/.test(t)) return "CASE → comment on every finding in order: finding → its mechanism → what it tells you; then the diagnosis or lesion; one line per finding.";
    if (/develop|anomal|congenital/.test(t)) return "DEVELOPMENT → stages in time order (source → changes → final form), then each anomaly with its cause.";
    if (/relation|related/.test(t)) return "RELATIONS → by surface: anterior, posterior, then medial/lateral or superior/inferior; a short list under each.";
    if (/explain|mechanism|discuss|regulat|how/.test(t)) return "EXPLAIN / MECHANISM → numbered steps in causal order (stimulus → mechanism → effect), arrows allowed; a labelled diagram if it helps; end with the significance.";
    if (/enumerat|\blist\b|\bname\b|mention|give|sites? of|contents?/.test(t)) return "ENUMERATE / MENTION → a numbered list, exactly what is asked, one line each; no paragraphs.";
    if (/define|definition/.test(t)) return "DEFINE → one exact sentence, then the 2–3 points that make it complete.";
    if (/draw|label|diagram/.test(t)) return "DRAW → a large labelled drawing with a title; every label a straight line.";
    return "DESCRIBE → headings in order: definition/site → parts/structure → relations/supply → function → one clinical note.";
  }
  // the department's own answer for this question, when the GIT 206 reference set has one (IX_REF_FOR, git206-v23.js)
  const refFor = (q) => { try { return window.IX_REF_FOR ? window.IX_REF_FOR(q) : ""; } catch (e) { return ""; } };
  async function gradeOnce(q, a, key, img) {
    const ref = refFor(q), notes = notesFor(topicKey());
    const text = "QUESTION:\n" + q + "\n\nTHE STRUCTURE THIS VERB NEEDS:\n" + verbTemplate(q) + (a ? "\n\nSTUDENT ANSWER (typed):\n" + a : "\n\nSTUDENT ANSWER: in the attached photo of their handwritten page; read it carefully first.") +
      (ref ? "\n\nREFERENCE ANSWER (department-style revision notes; mark against it, it is the standard):\n" + ref.slice(0, 5000) : "") + (notes ? "\n\nLECTURE NOTES:\n" + notes.slice(0, 4000) : "");
    const r = await fetch(API + "/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
      body: JSON.stringify({ model: ls.get(MODEL_PRO, DEFAULT_PRO), max_tokens: 600, temperature: 0.7, usage: { include: true }, messages: [
        { role: "system", content: "You are a Kasr Al Ainy written-exam examiner for this module. Mark the student's answer out of 10 the way the department marks: the points in the reference answer (if given) present and correct, the structure the question's verb demands, correct order and terms, a labelled diagram where expected. Do not reward length. Reply ONLY with JSON: {\"score\": number, \"missing\": [up to 4 short missing or wrong points], \"good\": [up to 2 short strengths], \"structure\": \"one short line: did it follow the verb's structure, and what to change\", \"read\": \"if a photo was given, the first 200 characters you read from it, else empty\"}" },
        { role: "user", content: img ? [{ type: "text", text }, { type: "image_url", image_url: { url: img } }] : text }] }) });
    if (!r.ok) throw new Error(r.status === 401 ? "the key was refused" : "OpenRouter answered " + r.status);
    const j = await r.json(); if (j.usage && j.usage.cost) addSpend(j.usage.cost);
    const t = ((j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "").replace(/^```(json)?|```$/g, "");
    const o = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
    return { score: Math.max(0, Math.min(10, +o.score)), missing: o.missing || [], good: o.good || [], structure: o.structure || "", read: o.read || "" };
  }
  async function gradeEssay(q, a, img) {
    const key = ls.get(KEY, ""); if (!key) throw new Error("add your key first");
    if (spend().usd >= cap()) throw new Error("this week's AI budget is used up");
    const runs = (await Promise.allSettled([0, 1, 2].map(() => gradeOnce(q, a, key, img)))).filter((x) => x.status === "fulfilled").map((x) => x.value).filter((x) => Number.isFinite(x.score));
    if (!runs.length) throw new Error("no grade came back; try again");
    const sc = runs.map((x) => x.score).sort((x, y) => x - y), med = sc[Math.floor(sc.length / 2)];
    const tally = (k) => { const m = new Map(); runs.forEach((x) => x[k].forEach((t) => { const kk = String(t).toLowerCase().slice(0, 40); m.set(kk, (m.get(kk) || [0, t])); m.get(kk)[0]++; })); return [...m.values()].sort((x, y) => y[0] - x[0]).map((x) => x[1]); };
    return { median: med, lo: sc[0], hi: sc[sc.length - 1], n: runs.length, missing: tally("missing").slice(0, 5), good: tally("good").slice(0, 2), structure: (runs.find((x) => x.structure) || {}).structure || "", read: (runs.find((x) => x.read) || {}).read || "", grounded: !!refFor(q) };
  }
  function photoURL(f) { return new Promise((ok, no) => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 1400 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL("image/jpeg", 0.85)); }; im.onerror = () => ok(r.result); im.src = r.result; }; r.onerror = () => no(new Error("the photo could not be read")); r.readAsDataURL(f); }); }
  function gradeHTML(g, q) {
    return '<div class="ixTgrade"><b>' + g.median + " / 10</b> <span>(examiners gave " + g.lo + "–" + g.hi + (g.n < 3 ? ", " + g.n + " of 3 answered" : "") + (g.grounded ? " · marked against the department-style answer" : "") + ")</span></div>" +
      (g.read ? '<p class="ixTsmall">Read from your photo: “' + E(g.read.slice(0, 160)) + '…” If that is wrong, type the answer instead.</p>' : "") +
      (g.structure ? "<p>🧱 <b>Structure:</b> " + E(g.structure) + "</p>" : "") +
      (g.good.length ? "<p>✅ " + g.good.map(E).join(" · ") + "</p>" : "") + (g.missing.length ? "<p><b>Missing or wrong:</b></p><ul>" + g.missing.map((x) => "<li>" + E(x) + "</li>").join("") + "</ul>" : "") +
      '<p class="ixTsmall">A coach\'s estimate, not the real examiner. Rewrite only the missing points tomorrow, from memory.</p>';
  }
  function openEssay(preQ) {
    build(); root.classList.add("on");
    const canGrade = Boolean(ls.get(KEY, ""));
    const s = sheet(
      "<h3>Written practice</h3><p>Write from memory, then check the reference answer." + (canGrade ? " You can also submit a typed or photographed answer for AI feedback." : " Typed answers are saved as a draft on this device.") + "</p>" +
      '<label>Question<input type="text" id="ixTeq" placeholder="e.g. Mention the sites of portosystemic anastomosis"></label>' +
      '<p class="ixTverb" id="ixTverb"></p>' +
      '<label>My answer (typed)<textarea id="ixTea" rows="9" placeholder="Headings and points as you would write them in the exam…"></textarea></label>' +
      (canGrade ? '<label class="ixTfile">Photo of my handwritten answer<input type="file" id="ixTeimg" accept="image/*" capture="environment"></label>' : "") +
      '<div class="ixTrow"><button type="button" class="primary" id="ixTref" hidden>Show reference answer</button>' + (canGrade ? '<button type="button" id="ixTego">Mark it (3 examiners)</button>' : "") +
      '<button type="button" data-x>Close</button></div><div class="ixTstatus" id="ixTest" role="status"></div>'
    );
    s.classList.add("ixTactivity");
    const qi = s.querySelector("#ixTeq"), vb = s.querySelector("#ixTverb"), answer = s.querySelector("#ixTea"),
      reference = s.querySelector("#ixTref"), result = s.querySelector("#ixTest"), draftKey = "ix_written_drafts_v1";
    const showVerb = () => {
      vb.textContent = qi.value.trim() ? "How to answer it: " + verbTemplate(qi.value) : "";
      reference.hidden = !qi.value.trim() || !refFor(qi.value.trim());
      reference.textContent = "Show reference answer";
      result.replaceChildren();
    };
    qi.addEventListener("input", showVerb);
    if (preQ) {
      qi.value = preQ;
      const drafts = jget(draftKey);
      const previous = drafts.find((draft) => draft.question === preQ);
      if (previous) answer.value = previous.answer;
      answer.addEventListener("input", () => {
        if (qi.value !== preQ) return;
        const others = jget(draftKey).filter((draft) => draft.question !== preQ);
        ls.set(draftKey, JSON.stringify([{ question: preQ, answer: answer.value.slice(0, 12000) }, ...others].slice(0, 12)));
      });
    }
    showVerb();
    reference.onclick = () => {
      const visible = Boolean(result.querySelector(".ixTreference"));
      result.replaceChildren();
      reference.textContent = visible ? "Show reference answer" : "Hide reference answer";
      if (visible) return;
      const section = document.createElement("div");
      section.className = "ixTreference";
      section.textContent = refFor(qi.value.trim());
      result.appendChild(section);
    };
    const grade = s.querySelector("#ixTego");
    if (!grade) return;
    grade.onclick = async () => {
      const q = qi.value.trim(), a = answer.value.trim(), st = result, f = s.querySelector("#ixTeimg").files[0];
      if (!q || (a.length < 20 && !f)) { st.textContent = "Write the question and your answer (typed or a photo) first."; return; }
      grade.disabled = true;
      st.textContent = f ? "Reading your page, then three examiners are marking…" : "Three examiners are marking…";
      try {
        const img = f ? await photoURL(f) : null;
        const g = await gradeEssay(q, a, img);
        st.innerHTML = gradeHTML(g, q) + (window.IX_PLAN ? '<div class="ixTrow"><button type="button" id="ixTsheetSave">📄 Save as my one-page sheet</button></div>' : "");
        const sv = st.querySelector("#ixTsheetSave"); if (sv) sv.onclick = () => { IX_PLAN.saveSheet(q, a || g.read || "(handwritten, photographed)", g.median); sv.textContent = "✓ Saved to your sheets"; sv.disabled = true; };
        g.missing.slice(0, 3).forEach((m) => addCard("Written answer to '" + q + "': include " + m, (a || "").slice(0, 120)));
        if (window.IX_WRITTEN && IX_WRITTEN.scheduleOutline) IX_WRITTEN.scheduleOutline(q, g.median);
      } catch (e) { st.textContent = "Could not mark it: " + e.message; }
      finally { grade.disabled = false; }
    };
  }
  function openLife() {
    build(); root.classList.add("on");
    const L = life(), d = dayState(), days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const s = sheet(
      "<h3>⏱ My day</h3><p><b>Work less, live more.</b> You choose the minutes; the app fits the exam into them and cuts the lowest-yield topics openly (✂️ What to drop), never the other way round. When the minutes are used, the day is done.</p>" +
      "<p>Today: <b>" + d.used + " of " + d.budget + " min</b>" + (d.gate ? " · " + E(d.gate.split(".")[0]) : "") + "</p>" +
      '<label>Focused study minutes per day<input type="number" id="ixLmin" min="15" max="300" step="5" value="' + L.mins + '"></label>' +
      '<label>Stop time (no studying after it: sleep stores what you learned)<input type="time" id="ixLstop" value="' + E(L.stop) + '"></label>' +
      '<label>Day off every week<select id="ixLoff">' + ['<option value="-1">none</option>'].concat(days.map((n, i) => '<option value="' + i + '"' + (L.off === i ? " selected" : "") + ">" + n + "</option>")).join("") + "</select></label>" +
      '<div class="ixTrow"><button type="button" class="primary" id="ixLsave">Save</button><button type="button" id="ixLplus">+10 min today</button><button type="button" data-x>Close</button></div><p class="ixTstatus" id="ixLst"></p>'
    );
    s.querySelector("#ixLsave").onclick = () => { setLife({ mins: Math.max(15, +s.querySelector("#ixLmin").value || 60), stop: s.querySelector("#ixLstop").value || "22:30", off: +s.querySelector("#ixLoff").value }); s.querySelector("#ixLst").textContent = "✓ Saved."; sub(); };
    s.querySelector("#ixLplus").onclick = () => { extend(10); s.querySelector("#ixLst").textContent = "+10 minutes for today. Finish one thing, then stop."; sub(); };
  }

  /* ───── v22 blind check: new questions from the professor, checked by a second model, answered with the AI OFF;
     the only readiness number that counts ───── */
  const BLIND = "ix_tutor_blind_v1";
  let blindOn = false;
  async function makeBlind(key) {
    const sys = "You write Kasr Al Ainy exam MCQs. From the topic and notes below, write 6 NEW single-best-answer MCQs that test understanding (mechanism, clinical, lesion, 'except'), not copies of anything shown. Reply ONLY with JSON: {\"items\":[{\"stem\":\"...\",\"options\":{\"a\":\"...\",\"b\":\"...\",\"c\":\"...\",\"d\":\"...\",\"e\":\"...\"},\"key\":\"a\",\"why\":\"one line\"}]}\n\n" + context(relevanceText(screen().title + " " + screen().body.slice(0, 600)));
    const r = await fetch(API + "/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
      body: JSON.stringify({ model: ls.get(MODEL_PRO, DEFAULT_PRO), max_tokens: 2500, usage: { include: true }, messages: [{ role: "system", content: sys }, { role: "user", content: "Write the 6 questions." }] }) });
    if (!r.ok) throw new Error("OpenRouter answered " + r.status);
    const j = await r.json(); if (j.usage && j.usage.cost) addSpend(j.usage.cost);
    const t = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
    const items = (JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1)).items || []).filter((x) => x && x.stem && x.options && x.options[x.key]);
    const checks = await Promise.all(items.map((x) => verify(x.stem + "\n" + Object.entries(x.options).map(([k, v]) => k + ") " + v).join("\n"), key)));
    return items.filter((x, i) => !(checks[i] && /^⚠️/.test(checks[i])));  // drop only the items the checker flagged
  }
  function openBlind(prepared) {
    build(); root.classList.add("on");
    const key = ls.get(KEY, ""); if (!prepared && !key) { openSetup("Add your key first."); return; }
    const g = lifeGate(); if (g) { addMsg("tutor", g); return; }
    if (!prepared && spend().usd >= cap()) { addMsg("tutor", "This week's AI budget is used up."); return; }
    const intro = prepared ? "Answer the lesson's questions from memory. Choose how sure you are before checking each answer." : "These questions are generated for this topic and checked by a second model. Answer from memory and choose how sure you are.";
    const s = sheet("<h3>" + (prepared ? "Lesson knowledge check" : "Blind check") + "</h3><p>" + intro + "</p><div id=\"ixBq\"><p class=\"ixTstatus\">Loading questions…</p></div>");
    s.classList.add("ixTactivity", "ixTcheck");
    const box = s.querySelector("#ixBq"), topic = topicKey();
    (prepared ? Promise.resolve(prepared) : makeBlind(key)).then((items) => {
      if (!box.isConnected || !root.classList.contains("on")) return;
      if (!items.length) { box.innerHTML = "<p>No clean questions came back. Try again.</p><button type='button' data-x>Close</button>"; return; }
      blindOn = true; document.documentElement.classList.add("ixBlind");
      let i = 0, k = 0, cbm = 0; const wrong = [];
      const show = () => {
        if (i >= items.length) {
          blindOn = false; document.documentElement.classList.remove("ixBlind");
          if (!prepared) {
            const b = jget(BLIND); b.push({ topic, n: items.length, k, cbm, at: Date.now() }); ls.set(BLIND, JSON.stringify(b.slice(-200)));
          }
          wrong.forEach((x) => addCard("Blind check: " + x.stem + " → " + x.options[x.key], ""));
          const br = blindRange();
          box.innerHTML = "<div class='ixTgrade'><b>" + k + " / " + items.length + "</b> <span>certainty score " + cbm + "</span></div>" +
            (prepared ? "" : br.p != null ? "<p>All blind checks so far: <b>" + Math.round(br.p * 100) + "%</b> (" + Math.round(br.lo * 100) + "–" + Math.round(br.hi * 100) + "%) on " + br.n + " new questions.</p>" : "<p>More blind checks will establish your readiness range.</p>") +
            (wrong.length ? "<p>The " + wrong.length + " you missed are now memory cards.</p>" : "") + "<div class='ixTrow'><button type='button' data-x class='primary'>Close</button></div>";
          { const xb = box.querySelector("[data-x]"); if (xb) xb.addEventListener("click", () => document.dispatchEvent(new CustomEvent("ix:done", { detail: { kind: "check" } }))); }
          sub(); return;
        }
        const x = items[i];
        box.innerHTML = "<p class='ixTsmall'>" + (i + 1) + " / " + items.length + "</p><p><b>" + E(x.stem) + "</b></p>" +
          Object.entries(x.options).map(([kk, v]) => "<label class='ixBopt'><input type='radio' name='ixBo' value='" + E(kk) + "'> " + E(kk.toUpperCase() + ") " + v) + "</label>").join("") +
          "<div class='ixTrow'><button type='button' data-c='guess'>😬 Guess</button><button type='button' data-c='unsure'>🤔 Unsure</button><button type='button' data-c='sure'>😎 Sure</button></div>";
        box.querySelectorAll("[data-c]").forEach((btn) => { btn.onclick = () => {
          const pick = (box.querySelector("input[name=ixBo]:checked") || {}).value; if (!pick) return;
          const ok = pick === x.key; if (ok) k++; else wrong.push(x);
          cbm += CBM[btn.dataset.c][ok ? 0 : 2];
          const c = jget(CAL); c.push({ conf: btn.dataset.c, verdict: ok ? "correct" : "wrong", at: Date.now(), blind: 1 }); ls.set(CAL, JSON.stringify(c.slice(-400)));
          box.innerHTML = "<p>" + (ok ? "✅ Right." : "❌ It was " + E(x.key.toUpperCase()) + ".") + " " + E(x.why || "") + "</p><div class='ixTrow'><button type='button' class='primary' id='ixBn'>Next</button></div>";
          box.querySelector("#ixBn").onclick = () => { i++; show(); };
        }; });
      };
      show();
    }).catch((e) => { box.innerHTML = "<p>Could not write the questions: " + E(e.message) + "</p><button type='button' data-x>Close</button>"; });
  }

  function openPostmortem() {
    build(); root.classList.add("on");
    const s = sheet(
      "<h3>🩻 Exam post-mortem</h3><p>Write every question you remember from the exam, <b>one per line</b> (a few words each is enough). The professor sorts them: in the past papers / same topic asked a new way / lecture-only. That tells us where the marks went, and what to study for the next exam.</p>" +
      '<textarea id="ixTpm" rows="10" placeholder="e.g. lesion of the medial lemniscus → loss of what?&#10;which is not a content of the cavernous sinus…"></textarea>' +
      '<label>Your real mark, if you know it (%)<input type="number" id="ixTpmPct" min="0" max="100" step="1" placeholder="e.g. 50"></label>' +
      '<p class="ixTsmall">The real mark also corrects the app: from now on the past-paper readiness shows how far the real exam was from it.</p>' +
      '<div class="ixTrow"><button type="button" class="primary" id="ixTpmGo">Sort my exam</button><button type="button" data-x>Close</button></div>'
    );
    s.querySelector("#ixTpmGo").onclick = () => {
      const lines = s.querySelector("#ixTpm").value.split(/\n+/).map((x) => x.trim()).filter((x) => x.length > 3).slice(0, 60);
      const pct = parseFloat(s.querySelector("#ixTpmPct").value);
      if (Number.isFinite(pct) && pct >= 0 && pct <= 100) recordReal(pct, lines.length + " questions recalled");
      if (!lines.length) { s.remove(); return; }
      const ex = "EXAM QUESTIONS (as remembered) with how close the past-paper bank came:\n" + lines.map((l, i) => (i + 1) + ". " + l + "  [bank: " + (((relevance(l) || {}).n) || 0) + " similar past questions]").join("\n");
      s.remove(); ask("Here is what I remember from the exam. Sort it and tell me what it means.", "postmortem", ex);
    };
  }
  // the real mark goes where the app's post-exam calibration already keeps it (S.v12.outcomes), with the
  // past-paper mock score it is compared with
  function recordReal(pct, note) {
    try {
      if (typeof S === "undefined" || !S) return;
      S.v12 = S.v12 || {}; S.v12.outcomes = S.v12.outcomes || [];
      const p = window.INTELLECTUALITY_V16 && INTELLECTUALITY_V16.prediction ? INTELLECTUALITY_V16.prediction() : null;
      S.v12.outcomes.push({ at: new Date().toISOString(), actualPct: pct, predictedPct: p && p.p != null ? Math.round(p.p * 100) : null, note: "post-mortem: " + note });
      if (typeof save === "function") save();
    } catch (e) {}
  }
  function openNotes() {
    build();
    const k = topicKey();
    const s = sheet(
      "<h3>My lecture notes</h3><p>For: <b>" + E(k) + "</b></p>" +
      "<p>Paste the slides' text, or type what the doctor stressed while you watch the lecture (dictation works). The tutor treats these as the most important source for this topic, so what was taught in the lecture is taught here too.</p>" +
      '<textarea id="ixTnotes" rows="12" placeholder="Paste or type the lecture points here…">' + E(notesFor(k)) + "</textarea>" +
      '<div class="ixTrow"><button type="button" id="ixTdiff">🔍 What the past papers never asked</button></div><div id="ixTdiffOut" class="ixTsmall"></div>' +
      '<label class="ixTfile">📥 Add from a file: slides PDF, text, or a photo of your notes or handout<input type="file" id="ixTfile" accept=".pdf,.txt,.md,image/*"></label><p class="ixTstatus" id="ixTfst"></p>' +
      '<div class="ixTrow"><button type="button" class="primary" id="ixTnsave">Save</button><button type="button" data-x>Close</button></div><p class="ixTstatus" id="ixTnst"></p>'
    );
    s.querySelector("#ixTfile").onchange = async (e) => {
      const f = e.target.files && e.target.files[0], st = s.querySelector("#ixTfst"), ta = s.querySelector("#ixTnotes"); if (!f) return;
      st.textContent = "Reading " + f.name + "…";
      try {
        const txt = await importFile(f, (m) => { st.textContent = m; });
        if (!txt.trim()) { st.textContent = "No text found in that file."; return; }
        ta.value = (ta.value.trim() ? ta.value.trim() + "\n\n" : "") + "— from " + f.name + " —\n" + txt.trim();
        st.textContent = "✓ Added " + txt.trim().length.toLocaleString("en") + " characters. Check them, then Save.";
      } catch (err) { st.textContent = "Could not read it: " + err.message; }
    };
    s.querySelector("#ixTdiff").onclick = () => {
      const lines = s.querySelector("#ixTnotes").value.split(/\n+|(?<=[.;])\s+/).map((x) => x.replace(/^[-•*\d.)\s]+/, "").trim()).filter((x) => x.length > 25 && !/^—/.test(x));
      const only = lines.filter((l) => !((relevance(l) || {}).n));
      const out = s.querySelector("#ixTdiffOut");
      if (!lines.length) { out.textContent = "Add the lecture's points first."; return; }
      out.innerHTML = "<p><b>" + only.length + " of " + lines.length + "</b> lecture points have no close past-paper question. These are where the bank cannot prepare you (the 16 Nov lesson):</p><ul>" + only.slice(0, 20).map((l) => "<li>" + E(l.slice(0, 160)) + "</li>").join("") + "</ul>" +
        (only.length ? "<button type='button' id='ixTdiffCards'>Make them memory cards</button>" : "");
      const b = out.querySelector("#ixTdiffCards");
      if (b) b.onclick = () => { only.slice(0, 25).forEach((l) => addCard("LECTURE-ONLY (no past paper asked it): " + l, "")); b.textContent = "✓ " + Math.min(25, only.length) + " cards made"; b.disabled = true; };
    };
    s.querySelector("#ixTnsave").onclick = () => {
      const ok = saveNotes(k, s.querySelector("#ixTnotes").value);
      s.querySelector("#ixTnst").textContent = ok ? "✓ Saved on this device." : "Could not save: the device storage is full.";
      sub(); setTimeout(() => s.remove(), 900);
    };
  }

  /* ───── v21 lecture import: text files directly; PDFs with pdf.js (fetched once, when first used); photos of
     his own notes or handouts transcribed by the vision model ───── */
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise((ok, no) => { const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; ok(window.pdfjsLib); }; sc.onerror = () => no(new Error("the PDF reader needs the internet the first time")); document.head.appendChild(sc); });
  }
  async function importFile(f, say) {
    if (/^image\//.test(f.type)) {
      const key = ls.get(KEY, ""); if (!key) throw new Error("add your OpenRouter key first (⚙︎)");
      const url = await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => no(new Error("the photo could not be read")); r.readAsDataURL(f); });
      say("The professor is reading the photo…");
      const r = await fetch(API + "/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
        body: JSON.stringify({ model: ls.get(MODEL_PRO, DEFAULT_PRO), max_tokens: 1500, usage: { include: true }, messages: [{ role: "system", content: MODES.import.brief }, { role: "user", content: [{ type: "text", text: "Transcribe these notes." }, { type: "image_url", image_url: { url } }] }] }) });
      if (!r.ok) throw new Error("OpenRouter answered " + r.status);
      const j = await r.json(); if (j.usage && j.usage.cost) addSpend(j.usage.cost);
      return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
    }
    if (/pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)) {
      const lib = await loadPdfJs(), doc = await lib.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise, out = [];
      for (let i = 1; i <= doc.numPages; i++) { say("Reading page " + i + " of " + doc.numPages + "…"); const tc = await (await doc.getPage(i)).getTextContent(); const t = tc.items.map((x) => x.str).join(" ").replace(/\s+/g, " ").trim(); if (t) out.push("[slide " + i + "] " + t); }
      return out.join("\n");
    }
    return await f.text();
  }

  /* ───── Why? on anything: tap a line of a lesson, a question or an explanation, then 🤔 Why? ───── */
  let bubble = null, picked = "";
  function why(text) {
    text = String(text || "").replace(/\s+/g, " ").trim().slice(0, 900);
    if (!text) return;
    build(); root.classList.add("on"); renderLog(); sub();
    if (!ls.get(KEY, "")) { openSetup("Add your key first, then tap Why? again."); return; }
    ask("Why? → " + (text.length > 160 ? text.slice(0, 160) + "…" : text), "why", "SELECTED (what the student tapped):\n" + text + "\n\n" + relevanceText(text));
  }
  function hideBubble() { if (bubble) bubble.style.display = "none"; }
  function showBubble(x, y, text) {
    if (!bubble) {
      bubble = document.createElement("button"); bubble.type = "button"; bubble.className = "ixTwhy"; bubble.textContent = "🤔 Why?";
      bubble.addEventListener("click", (e) => { e.stopPropagation(); hideBubble(); why(bubble._t); });
      document.body.appendChild(bubble);
    }
    bubble._t = text; bubble.style.display = "block";
    const w = 96; bubble.style.left = Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)) + "px"; bubble.style.top = Math.max(8, y - 54) + "px";
    clearTimeout(bubble._h); bubble._h = setTimeout(hideBubble, 4000);
  }
  const ZONES = "#player, #drawerBody";
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest(".ixTwhy, .ixT")) return;
    const zone = e.target.closest && e.target.closest(ZONES);
    if (!zone || mockRunning()) { hideBubble(); return; }
    if (e.target.closest("button, a, input, textarea, select, label, summary, [contenteditable]")) { hideBubble(); return; }
    const sel = String(window.getSelection ? window.getSelection() : "").trim();
    const el = e.target.closest("p, li, td, h2, h3, h4, blockquote, figcaption, .explain, .why, div");
    const text = sel.length > 3 ? sel : el ? (el.innerText || "").trim() : "";
    if (!text || text.length < 12 || text.length > 1500) { hideBubble(); return; }
    showBubble(e.clientX, e.clientY, text);
  }, true);
  document.addEventListener("scroll", hideBubble, true);

  /* ───── doors: a tab on the screen edge, and a button in the side menu ───── */
  function install() {
    if (!document.getElementById("ixTtab")) {
      const t = document.createElement("button"); t.type = "button"; t.id = "ixTtab"; t.className = "ixTtab"; t.textContent = "🧠 Tutor"; t.setAttribute("aria-label", "Open the AI tutor");
      t.onclick = open; document.body.appendChild(t);
    }
    const anchor = document.getElementById("shareProgressBtn") || document.getElementById("cloudBtn");
    if (anchor && !document.getElementById("tutorBtn")) {
      anchor.insertAdjacentHTML("afterend", '<button id="tutorBtn" class="ghost wide" style="margin-top:8px">🧠 AI TUTOR (YOUR KEY, THIS DEVICE)</button>');
      document.getElementById("tutorBtn").onclick = open;
    }
  }
  // one tap from the menu: open the key screen and run the full check with the saved key
  function checkAI() { openSetup(ls.get(KEY, "") ? "Checking your key, balance and both models…" : ""); setTimeout(() => { const b = document.getElementById("ixTsave"); if (b && ls.get(KEY, "")) b.click(); }, 60); }
  window.IX_TUTOR = { checkKey, checkAI, open, close, ask, why, relevance, calibration, setConf: (c) => { conf = c; markConf(); }, context, screen, notesFor, saveNotes, hasKey: () => !!ls.get(KEY, ""), _keyName: KEY, lang, markLang, relevanceText, memory, dueCards, spend, cap, statsText, openPostmortem: () => openPostmortem(), life, setLife, dayState, extend, tickDay: () => tickDay(), CBM, errTypes, examinerStyle, blindRange, openBlind, openLife: () => openLife(), blindOn: () => blindOn, gradeEssay, openEssay: (q) => openEssay(q), _addSpend: (u) => addSpend(u), verbTemplate, gradeHTML, photoURL, refFor, openNotes: () => { build(); root.classList.add("on"); renderLog(); openNotes(); }, addCard: (idea, ans) => addCard(idea, ans), importFile, _addCard: addCard, mockRunning, openSetup: (n) => openSetup(n) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
  setTimeout(install, 1600);
})();
