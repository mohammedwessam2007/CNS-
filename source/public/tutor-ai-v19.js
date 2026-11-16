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
  const DEFAULT_MODEL = "anthropic/claude-haiku-5.5", DEFAULT_PRO = "openai/gpt-6.1-terra";
  const PRESETS = [["anthropic/claude-haiku-5.5", "Fast · $0.10 / $0.50"], ["openai/gpt-6-luna", "Fast · $0.10 / $0.50"], ["deepseek/deepseek-v4.1-flash", "Fast · $0.14 / $0.42"],
    ["openai/gpt-6.1-terra", "Professor · $1 / $5"], ["anthropic/claude-sonnet-5.5", "Professor+ · $2 / $10"], ["google/gemini-3.8-flash", "Professor · $0.83 / $4.12"]];
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
  const mockRunning = () => { try { return !!(typeof S !== "undefined" && S && S.v16 && S.v16.mock); } catch (e) { return false; } };
  function screen() {
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
    const bank = (window.EHSAN_QBANK && window.EHSAN_QBANK.questions) || [];
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
  function relevanceText(text) {
    const r = relevance(text);
    if (!r) return "EXAM RELEVANCE: not known (no past-paper data).";
    if (!r.n) return "EXAM RELEVANCE (past-paper bank we have): no past question matches this closely. Say so honestly: it may still come from the lectures, but it has not been a classic past-paper point.";
    return "EXAM RELEVANCE (from the practice half of the student's past-paper bank, by matching words, so approximate): about " + r.n + " past questions touch this" + (r.sources.length ? " (sources: " + r.sources.join(", ") + ")" : "") + (r.chapters.length ? "; chapters: " + r.chapters.join(", ") : "") + ".\nExamples of how it was asked:\n- " + r.examples.join("\n- ");
  }

  const SYSTEM = [
    "You are the personal tutor of a 2nd-year medical student at Kasr Al Ainy (Cairo University), course NEU-205 (CNS: anatomy, physiology, histology, embryology), and later the GIT block.",
    "Goal: high marks with the least study time, by real understanding, not memorising.",
    "How to teach: short and plain English (the student is not a native speaker; add the Arabic word in brackets only when it really helps). Start from the mechanism or the picture, then the exam fact. Use one concrete example or clinical case. Keep answers under about 180 words unless asked for more.",
    "Always end with ONE short check question that needs understanding (why / what happens if / which lesion), not a fact to recall, and wait for the answer.",
    "When the student answers: say clearly if it is right, fix the exact misunderstanding, and give the next check.",
    "Kasr Al Ainy exams: MCQs (often clinical or 'all except'), written essays (lists, comparisons, draw-and-label), practical (identify on a slide or specimen). Point out exam traps.",
    "The student has ADHD: short chunks, one idea per line, bold the key words, no walls of text, and make it vivid.",
    "If the lecture notes below disagree with general textbooks, follow the lecture notes and say so. If you are not sure of a fact, say you are not sure; never invent page numbers, sources or 'the doctor said'.",
    "PEDAGOGY (follow always): make the student do the thinking (active learning); one idea at a time (cognitive load); adapt to what the student just showed (adaptivity); open with a puzzle or surprise when you can (curiosity); ask how sure they are and what they would check (metacognition).",
    "ATTEMPT FIRST: never give the answer to a question you asked before the student has tried. If they are stuck, give a hint ladder, one rung per turn: 1) a nudge, 2) a narrower question, 3) one worked step. Only after an attempt, give the full answer.",
    "Ground every fact in the screen, the lecture notes or the past-paper data given below; when a fact comes from general knowledge and not from those, add '(not in your notes)'.",
    "When you judge an answer the student gave to your question, start your reply with exactly one tag: [[correct]] or [[partly]] or [[wrong]]. Use no tag otherwise.",
    "The student may say how sure they were (guessing / unsure / sure). A sure but wrong answer is the most valuable moment: name the exact false belief and contrast it with the truth in one line.",
  ].join("\n");

  function context(extra) {
    const s = screen(), k = topicKey(), n = notesFor(k);
    let c = "WHAT THE STUDENT IS LOOKING AT IN THE APP" + (s.eyebrow ? " (" + s.eyebrow + ")" : "") + ":\n" + (s.title ? "Title: " + s.title + "\n" : "") + (s.body || "(nothing open)");
    if (n) c += "\n\nTHE STUDENT'S OWN LECTURE NOTES FOR THIS TOPIC (most important source):\n" + n;
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
  function calibration() {
    const c = jget(CAL), sure = c.filter((x) => x.conf === "sure"), right = sure.filter((x) => x.verdict === "correct").length;
    return { n: c.length, sure: sure.length, sureRight: right, traps: jget(TRAPS).length };
  }
  const TAG = /^\s*\[\[(correct|partly|wrong)\]\]\s*/i;

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
    const m = TAG.exec(text), body = m ? text.replace(TAG, "") : text;
    c.querySelector(".ixTtxt").innerHTML = (m ? '<span class="ixTverdict v-' + m[1].toLowerCase() + '">' + VBADGE[m[1].toLowerCase()] + "</span>" : "") + (md(body) || "<p class='ixTdots'>…</p>");
  }

  /* ───── OpenRouter ───── */
  let busy = null;
  async function ask(userText, mode, extraContext, opts) {
    opts = opts || {}; build();
    const key = ls.get(KEY, "");
    if (!key) { openSetup("Add your key first."); return; }
    if (mockRunning()) { const lockT = "A mock exam is running. The tutor comes back when you submit it, so the mock stays a real test."; addMsg("tutor", lockT); if (opts.inline) inlinePaint(inlineCard(opts.inline), lockT); return; }
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
        body: JSON.stringify({ model, stream: true, max_tokens: 1100, messages: [{ role: "system", content: sys }].concat(history, [{ role: "user", content: userContent }]) }),
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
          try { const j = JSON.parse(d), piece = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content; if (piece) { text += piece; paint(out, text); if (card) inlinePaint(card, text); } } catch (e) {}
        }
      }
      if (!text) text = "(No answer came back. Try again, or pick another model in ⚙︎.)";
    } catch (e) {
      text = (text ? text + "\n\n" : "") + (e.name === "AbortError" ? "(stopped)" : "⚠️ " + e.message);
    } finally {
      busy = null; setBusy(false);
      const m = TAG.exec(text);
      if (m) { conf = myConf; record(m[1].toLowerCase(), lastTutor); out.classList.add("v-" + m[1].toLowerCase()); }
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
    palace: { label: "Memory hook", prompt: "This list will not stick. Build me a memory hook for it.", brief: "TASK: mnemonics for arbitrary lists only (branches, contents, order). First say in one line whether this needs a hook or is better understood from the mechanism. If a hook fits: build a short memory palace (5-7 places along a route the student knows, e.g. home to college) or an acronym, one vivid odd image per item, then make them recall it back once now. Keep every fact exactly as the course states it." },
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
    why: { label: "Why?", pro: true, hidden: true, brief: "TASK: the student tapped WHY on the text in SELECTED. Answer in exactly these parts, each short:\n**🧠 Why** — the mechanism behind it, from first principles, 3-5 short lines.\n**👁 Picture it** — one vivid image, analogy or everyday comparison.\n**🔒 Lock it in** — one memory hook or mnemonic, and what to link it to that they already know.\n**🎯 In the exam** — use EXAM RELEVANCE honestly: how often and how it was asked, the classic trap, and whether it is a written-exam point too. If the data shows no past question, say that plainly.\n**✅ Check** — one question that needs understanding. Then wait." },
    explain: { pro: true, label: "Explain this", prompt: "Explain what I am looking at now, simply, from the mechanism. Then check me.", brief: "TASK: explain the open topic from first principles, then ask one understanding check." },
    quiz: { label: "New exam question", prompt: "Give me ONE new exam-style MCQ on this topic (not a copy of a question on my screen), with 4 or 5 options. Do not give the answer until I reply.", brief: "TASK: write ONE new Kasr Al Ainy style MCQ on the open topic that tests understanding (clinical or mechanism), different from any question on screen. 4-5 options a-e. Wait for the student's answer, then explain every option." },
    teach: { label: "I'll explain it", prompt: "I will explain this topic in my own words. Ask me to start, then grade me.", brief: "TASK: teach-back. Ask the student to explain the topic in their own words. Then grade it out of 10 for understanding, list what was missing or wrong, and give one follow-up question." },
    wrong: { label: "Why was I wrong?", prompt: "I got the question on my screen wrong. Find the exact misunderstanding behind my mistake and fix it.", brief: "TASK: the student just answered the question on screen wrongly. Diagnose the likely misunderstanding (not just restate the key), fix it with the mechanism, then give a NEW question on the same idea." },
    written: { label: "Written answer", pro: true, prompt: "Give me the written-exam question most likely on this topic, then the model answer as the department wants it (headings, lists, a diagram described).", brief: "TASK: written exam. Give the most likely essay question on this topic and a model answer in the format Kasr Al Ainy examiners mark: headings, numbered points, what to draw and label." },
  };

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
      '<div class="ixTbox"><div class="ixThd"><b>🧠 Tutor</b><span class="ixTsub" id="ixTsub"></span><button type="button" data-t="lang" title="Explain in Egyptian Arabic / English" id="ixTlang"></button><button type="button" data-t="notes" title="My lecture notes for this topic">📝</button><button type="button" data-t="setup" title="Key and model">⚙︎</button><button type="button" data-t="close" aria-label="Close">✕</button></div>' +
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
    const m = TAG.exec(text), body = m ? text.replace(TAG, "") : text;
    el.querySelector(".ixTtxt").innerHTML = (m ? '<span class="ixTverdict v-' + m[1].toLowerCase() + '">' + VBADGE[m[1].toLowerCase()] + "</span>" : "") + (md(body) || "<p class='ixTdots'>…</p>");
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
  function sub() { const el = root && root.querySelector("#ixTsub"); if (el) { const n = notesFor(topicKey()); const k = calibration(); el.textContent = (topicKey() === "general" ? "" : topicKey().slice(0, 32)) + (n ? " · notes ✓" : "") + (k.sure ? " · sure & right " + k.sureRight + "/" + k.sure : "") + (k.traps ? " · traps " + k.traps : ""); } }
  function open() {
    build();
    if (mockRunning()) { renderLog(); addMsg("tutor", "A mock exam is running. The tutor comes back when you submit it, so the mock stays a real test."); root.classList.add("on"); return; }
    root.classList.add("on"); renderLog(); sub(); markLang();
    if (!ls.get(KEY, "")) openSetup();
    else setTimeout(() => input && input.focus(), 50);
  }
  function close() { if (root) root.classList.remove("on"); }

  function sheet(html) {
    const s = document.createElement("div"); s.className = "ixTsheet"; s.innerHTML = '<div class="ixTsheetIn">' + html + "</div>";
    root.querySelector(".ixTbox").appendChild(s);
    s.addEventListener("click", (e) => { if (e.target.closest("[data-x]")) s.remove(); });
    return s;
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
      '<datalist id="ixTlist">' + PRESETS.map((p) => '<option value="' + p[0] + '">' + p[1] + "</option>").join("") + "</datalist>" +
      '<p class="ixTsmall">Prices are per million tokens (in / out), read from OpenRouter on 16 Nov 2026. A Why? answer with the professor costs about $0.01; with a fast model about $0.001. Any name from openrouter.ai/models works.</p>' +
      '<div class="ixTrow"><button type="button" class="primary" id="ixTsave">Save and test</button>' + (has ? '<button type="button" id="ixTforget">Remove key</button>' : "") + '<button type="button" data-x>Close</button></div><p class="ixTstatus" id="ixTstatus"></p>'
    );
    const st = s.querySelector("#ixTstatus");
    s.querySelector("#ixTsave").onclick = async () => {
      const k = s.querySelector("#ixTkey").value.trim(), m = s.querySelector("#ixTmodel").value.trim() || DEFAULT_MODEL;
      ls.set(MODEL, m); ls.set(MODEL_PRO, s.querySelector("#ixTpro").value.trim() || DEFAULT_PRO);
      if (k) { if (!/^sk-or-/.test(k)) { st.textContent = "That does not look like an OpenRouter key (it starts with sk-or-)."; return; } ls.set(KEY, k); }
      const key = ls.get(KEY, ""); if (!key) { st.textContent = "Paste your key first."; return; }
      st.textContent = "Testing…";
      try {
        const r = await fetch(API + "/key", { headers: { Authorization: "Bearer " + key } });
        if (!r.ok) { st.textContent = r.status === 401 ? "OpenRouter refused this key. Copy it again." : "OpenRouter answered " + r.status + "."; return; }
        const d = (await r.json()).data || {};
        const left = d.limit != null ? " · limit $" + d.limit + ", used $" + (d.usage || 0).toFixed(2) : " · no limit set on this key: set one on openrouter.ai";
        st.textContent = "✓ Key works" + left + ".";
        setTimeout(() => { s.remove(); renderLog(); input && input.focus(); }, 1400);
      } catch (e) { st.textContent = "Could not reach openrouter.ai. Check the internet."; }
    };
    const f = s.querySelector("#ixTforget");
    if (f) f.onclick = () => { ls.del(KEY); st.textContent = "Key removed from this device."; f.remove(); };
  }
  function openNotes() {
    build();
    const k = topicKey();
    const s = sheet(
      "<h3>My lecture notes</h3><p>For: <b>" + E(k) + "</b></p>" +
      "<p>Paste the slides' text, or type what the doctor stressed while you watch the lecture (dictation works). The tutor treats these as the most important source for this topic, so what was taught in the lecture is taught here too.</p>" +
      '<textarea id="ixTnotes" rows="12" placeholder="Paste or type the lecture points here…">' + E(notesFor(k)) + "</textarea>" +
      '<div class="ixTrow"><button type="button" class="primary" id="ixTnsave">Save</button><button type="button" data-x>Close</button></div><p class="ixTstatus" id="ixTnst"></p>'
    );
    s.querySelector("#ixTnsave").onclick = () => {
      const ok = saveNotes(k, s.querySelector("#ixTnotes").value);
      s.querySelector("#ixTnst").textContent = ok ? "✓ Saved on this device." : "Could not save: the device storage is full.";
      sub(); setTimeout(() => s.remove(), 900);
    };
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
  window.IX_TUTOR = { open, close, ask, why, relevance, calibration, setConf: (c) => { conf = c; markConf(); }, context, screen, notesFor, saveNotes, hasKey: () => !!ls.get(KEY, ""), _keyName: KEY, lang, markLang, relevanceText, mockRunning, openSetup: (n) => openSetup(n) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
  setTimeout(install, 1600);
})();
