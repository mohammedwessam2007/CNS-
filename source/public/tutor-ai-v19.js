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
  ].join("\n");

  function context(extra) {
    const s = screen(), k = topicKey(), n = notesFor(k);
    let c = "WHAT THE STUDENT IS LOOKING AT IN THE APP" + (s.eyebrow ? " (" + s.eyebrow + ")" : "") + ":\n" + (s.title ? "Title: " + s.title + "\n" : "") + (s.body || "(nothing open)");
    if (n) c += "\n\nTHE STUDENT'S OWN LECTURE NOTES FOR THIS TOPIC (most important source):\n" + n;
    if (extra) c += "\n\n" + extra;
    return c;
  }

  /* ───── OpenRouter ───── */
  let busy = null;
  async function ask(userText, mode, extraContext) {
    const key = ls.get(KEY, "");
    if (!key) { openSetup("Add your key first."); return; }
    if (mockRunning()) { addMsg("tutor", "A mock exam is running. The tutor comes back when you submit it, so the mock stays a real test."); return; }
    const history = chat().slice(-12).map((m) => ({ role: m.who === "me" ? "user" : "assistant", content: m.text }));
    const sys = SYSTEM + "\n\n" + context((MODES[mode] ? MODES[mode].brief : "") + (extraContext ? "\n\n" + extraContext : ""));
    const model = MODES[mode] && MODES[mode].pro ? ls.get(MODEL_PRO, DEFAULT_PRO) : ls.get(MODEL, DEFAULT_MODEL);
    addMsg("me", userText);
    const out = addMsg("tutor", "", true);
    const ctrl = new AbortController(); busy = ctrl; setBusy(true);
    let text = "";
    try {
      const r = await fetch(API + "/chat/completions", {
        method: "POST", signal: ctrl.signal,
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
        body: JSON.stringify({ model, stream: true, max_tokens: 1100, messages: [{ role: "system", content: sys }].concat(history, [{ role: "user", content: userText }]) }),
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
          try { const j = JSON.parse(d), piece = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content; if (piece) { text += piece; paint(out, text); } } catch (e) {}
        }
      }
      if (!text) text = "(No answer came back. Try again, or pick another model in ⚙︎.)";
    } catch (e) {
      text = (text ? text + "\n\n" : "") + (e.name === "AbortError" ? "(stopped)" : "⚠️ " + e.message);
    } finally {
      busy = null; setBusy(false);
      paint(out, text); out.classList.remove("live");
      const c = chat(); c.push({ who: "tutor", text, at: Date.now() }); saveChat(c);
    }
  }
  const MODES = {
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
      '<div class="ixTbox"><div class="ixThd"><b>🧠 Tutor</b><span class="ixTsub" id="ixTsub"></span><button type="button" data-t="notes" title="My lecture notes for this topic">📝</button><button type="button" data-t="setup" title="Key and model">⚙︎</button><button type="button" data-t="close" aria-label="Close">✕</button></div>' +
      '<div class="ixTmodes">' + Object.keys(MODES).filter((k) => !MODES[k].hidden).map((k) => '<button type="button" data-mode="' + k + '">' + MODES[k].label + "</button>").join("") + "</div>" +
      '<div class="ixTlog" id="ixTlog"></div>' +
      '<form class="ixTin"><textarea rows="2" placeholder="Ask anything about this topic…" id="ixTq"></textarea><button type="submit" class="primary" id="ixTsend">Send</button></form></div>';
    document.body.appendChild(root);
    log = root.querySelector("#ixTlog"); input = root.querySelector("#ixTq"); sendBtn = root.querySelector("#ixTsend");
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) { if (e.target === root) close(); return; }
      if (b.dataset.t === "close") close();
      else if (b.dataset.t === "setup") openSetup();
      else if (b.dataset.t === "notes") openNotes();
      else if (b.dataset.t === "clear") { saveChat([]); renderLog(); }
      else if (b.dataset.mode && !busy) ask(MODES[b.dataset.mode].prompt, b.dataset.mode);
    });
    root.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (busy) { busy.abort(); return; }
      const q = input.value.trim(); if (!q) return; input.value = ""; ask(q, null);
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); root.querySelector("form").requestSubmit(); } });
  }
  function setBusy(on) { if (sendBtn) sendBtn.textContent = on ? "Stop" : "Send"; }
  function paint(el, text) { el.querySelector(".ixTtxt").innerHTML = md(text) || "<p class='ixTdots'>…</p>"; log.scrollTop = log.scrollHeight; }
  function addMsg(who, text, live) {
    if (who === "me") { const c = chat(); c.push({ who, text, at: Date.now() }); saveChat(c); }
    const el = document.createElement("div"); el.className = "ixTm " + who + (live ? " live" : "");
    el.innerHTML = '<div class="ixTtxt"></div>'; log.appendChild(el); paint(el, text); return el;
  }
  function renderLog() {
    log.innerHTML = "";
    const c = chat();
    if (!c.length) log.innerHTML = '<div class="ixTempty"><p><b>Ask about whatever is on your screen.</b> The tutor sees the lesson or question you have open, and your lecture notes for it (📝).</p><p>Try <b>Explain this</b>, then <b>New exam question</b>: it writes questions that are not in the bank, so you practise understanding, not remembering.</p></div>';
    c.slice(-30).forEach((m) => { const el = document.createElement("div"); el.className = "ixTm " + m.who; el.innerHTML = '<div class="ixTtxt">' + md(m.text) + "</div>"; log.appendChild(el); });
    if (c.length) { const b = document.createElement("button"); b.type = "button"; b.className = "ixTclear"; b.dataset.t = "clear"; b.textContent = "Clear the conversation"; log.prepend(b); }
    log.scrollTop = log.scrollHeight;
  }
  function sub() { const el = root && root.querySelector("#ixTsub"); if (el) { const n = notesFor(topicKey()); el.textContent = (topicKey() === "general" ? "" : topicKey().slice(0, 40)) + (n ? " · notes ✓" : ""); } }
  function open() {
    build();
    if (mockRunning()) { renderLog(); addMsg("tutor", "A mock exam is running. The tutor comes back when you submit it, so the mock stays a real test."); root.classList.add("on"); return; }
    root.classList.add("on"); renderLog(); sub();
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
  window.IX_TUTOR = { open, close, ask, why, relevance, context, screen, notesFor, saveNotes, hasKey: () => !!ls.get(KEY, ""), _keyName: KEY };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
  setTimeout(install, 1600);
})();
