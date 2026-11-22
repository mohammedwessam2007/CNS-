/* INTELLECTUALITY v38 · the learning engine: every lesson is studied with the techniques that make memory last,
 * woven into one flow (owner, 21 Nov 2026: "not superficial lessons, actually understand, all the neuroscience techniques
 * integrated in each other"). What each part of a lesson now does, and why:
 *  - 🔁 Warm-up (first screen): 2 questions from EARLIER lessons — spaced retrieval + interleaving (mixing topics makes
 *    the brain pick the right idea, not just repeat the last one).
 *  - 🎯 Guess first (first screen): the lesson's questions BEFORE reading — the pretesting/generation effect: a wrong
 *    guess still primes the answer and makes it stick when it arrives.
 *  - 🤔 Every question in the text: commit an answer and how sure you are, THEN reveal, then say if you were right —
 *    the testing effect + metacognition (calibration: knowing what you don't know).
 *  - ✍️ After each part: one line in your own words — self-explanation (the strongest single predictor of understanding).
 *  - 🔬 Go deeper (each part): the full mechanism one level down from the professor — elaborative interrogation.
 *  - 🖼 Drawings in the text + ✏️ draw it with me — dual coding (words + pictures = two memory traces).
 *  - 🩺 Worked case: a patient, then each reasoning step predicted before it is shown — worked examples that fade
 *    into problem solving (transfer to the exam's clinical stems).
 *  - 🧠 Brain dump: write everything you remember from a blank page, then tick what you got — free recall, the most
 *    powerful retrieval practice; every point you missed becomes a flashcard for tomorrow.
 *  - Summary: how sure-and-right you were, your recall score, when the cards come back (1, 3, 7, 16 days), and why
 *    tonight's sleep matters (consolidation).
 *  - ⏸ After 25 minutes in a lesson: a 2-minute movement break (attention resets; ADHD-friendly). */
(function () {
  "use strict";
  if (window.IX_ENGINE) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const K = "ix_engine_v1", CUSTOM = "ix_fc_custom_v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(K) || "{}") || {}; } catch (e) { return {}; } };
  const save = (o) => { try { localStorage.setItem(K, JSON.stringify(o)); } catch (e) {} };
  const T = () => window.IX_TUTOR, KIT = () => window.IX_KIT;
  const txt = (key) => (window.IX_LESSON_TEXT || {})[key] || ((window.IX_NOVEMBER_LESSONS || {})[key] || {}).text || "";
  const thinks = (key) => { const out = []; String(txt(key)).replace(/🤔 Think:\s*(.+?)\s*\|\|(.+?)\|\|/g, (m, q, a) => (out.push({ q: q.trim(), a: a.trim() }), m)); return out; };
  const sayBack = (key) => { const t = String(txt(key)); const i = t.search(/^##\s+Say it back/m); if (i < 0) return []; return t.slice(i).split("\n").slice(1).filter((l) => /^\s*\d+\.\s/.test(l)).map((l) => l.replace(/^\s*\d+\.\s*/, "").trim()); };

  /* ── the parts the engine adds to a lesson ── */
  function extendParts(les, ps) {
    if (!ps || ps.__engine) return ps;
    const C = (window.IX_LESSON_CASES || {})[les.key];
    const sayI = ps.findIndex((p) => /^Say it back/i.test(p.h));
    const extra = [];
    if (C) extra.push({ h: "Worked case", md: "@@CASE@@", engine: "case" });
    if (sayBack(les.key).length) extra.push({ h: "Brain dump: everything you remember", md: "@@DUMP@@", engine: "dump" });
    if (extra.length) { if (sayI >= 0) ps.splice(sayI, 0, ...extra); else ps.push(...extra); }
    ps.__engine = true; return ps;
  }

  /* ── first screen: warm-up from earlier lessons + guess first ── */
  function firstScreen(les) {
    const st = load(), pre = (st.pre || {})[les.key];
    let warm = [];
    try { const k = KIT(); if (k) { warm = k.due().filter((c) => c.lesson !== les.key).slice(0, 2); if (!warm.length) warm = k.deck().filter((c) => c.lesson !== les.key).sort(() => Math.random() - 0.5).slice(0, 2); } } catch (e) {}
    const qs = thinks(les.key).slice(0, 3);
    let h = "";
    if (warm.length) h += '<details class="ixEcard" open><summary>🔁 Warm-up from earlier lessons <small>' + warm.length + " questions · spaced retrieval</small></summary>" + warm.map((c, i) => '<div class="ixEw" data-w="' + E(c.id) + '"><p><b>' + E(c.q) + "</b><small>" + E(c.title) + '</small></p><button type="button" data-e="wshow">Show the answer</button><div class="ixEwa" hidden><p>' + E(c.a) + '</p><div class="ixErow"><button type="button" data-e="wg" data-g="again">Forgot</button><button type="button" data-e="wg" data-g="good">Got it</button></div></div></div>').join("") + "</details>";
    if (qs.length && !pre) h += '<details class="ixEcard" open><summary>🎯 Guess first <small>before you read · wrong guesses help it stick</small></summary>' + qs.map((x, i) => '<label class="ixEpre"><span>' + E(x.q.replace(/^./, (c) => c.toUpperCase())) + '</span><input type="text" data-pre="' + i + '" placeholder="Your best guess (or ?)" autocomplete="off"></label>').join("") + '<button type="button" class="ixEbtn" data-e="presave">Lock my guesses</button></details>';
    else if (pre) h += '<p class="ixEnote">🎯 Your guesses are locked in; you will see them next to each question.</p>';
    return h;
  }

  /* ── the case: predict each step, then reveal ── */
  function caseHTML(les) {
    const C = (window.IX_LESSON_CASES || {})[les.key]; if (!C) return "";
    return '<div class="ixEcase"><p class="ixEpt">🩺 ' + E(C.c) + '</p>' + C.s.map((s, i) => '<div class="ixEstep" data-step="' + i + '"' + (i ? " hidden" : "") + '><p><b>' + (i + 1) + ". " + E(s[0]) + '</b></p><textarea rows="2" placeholder="Think it through, write your answer"></textarea><button type="button" class="ixEbtn" data-e="cshow">Show the reasoning</button><div class="ixEans" hidden><p>' + E(s[1]) + "</p></div></div>").join("") + '<p class="ixEsmall">Worked case: predict every step before you see it. This is how the exam\'s clinical stems are solved.</p></div>';
  }

  /* ── the brain dump: free recall, then tick what you got ── */
  function dumpHTML(les) {
    const pts = sayBack(les.key);
    return '<div class="ixEdump"><p>Close your eyes for 10 seconds. Then write <b>everything</b> you remember from this lesson, from a blank page. No peeking. Messy is fine.</p><textarea rows="7" data-e="dumptext" placeholder="Everything you remember…"></textarea><button type="button" class="ixEbtn" data-e="dumpcheck">Check against the key points</button>' +
      '<div class="ixEdk" hidden><p class="ixEsmall">Tick each point your dump contained (even in other words):</p>' + pts.map((p, i) => '<label class="ixEtick"><input type="checkbox" data-pt="' + i + '"><span>' + E(p) + "</span></label>").join("") + '<button type="button" class="ixEbtn" data-e="dumpscore">Score my recall</button><p class="ixEres" role="status"></p></div></div>';
  }

  /* ── every 🤔 question: commit + confidence before the reveal, then right/wrong ── */
  function armThinks(root, les) {
    const pre = (load().pre || {})[les.key] || [];
    const all = thinks(les.key);
    root.querySelectorAll(".ixLmd .ixYspoil").forEach((sp) => {
      if (sp.dataset.armed) return; sp.dataset.armed = "1";
      const host = sp.closest("p, li, blockquote") || sp.parentElement; if (!/Think/.test(host.textContent)) return;
      const ans = (sp.lastElementChild || sp).textContent.trim(), idx = all.findIndex((x) => ans && x.a.slice(0, 40) === ans.slice(0, 40));
      const box = document.createElement("div"); box.className = "ixEthink";
      box.innerHTML = (idx >= 0 && pre[idx] ? '<p class="ixEguess">Your guess before reading: <b>' + E(pre[idx]) + "</b></p>" : "") + '<input type="text" placeholder="Commit your answer first" autocomplete="off"><div class="ixErow ixEconf"><span>How sure?</span><button type="button" data-c="guess">Guess</button><button type="button" data-c="unsure">Unsure</button><button type="button" data-c="sure">Sure</button></div><div class="ixErow ixEjudge" hidden><span>Were you right?</span><button type="button" data-j="1">✓ Yes</button><button type="button" data-j="0">✗ No</button></div>';
      host.after(box);
      sp.hidden = true;
      let conf = null;
      box.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { conf = b.dataset.c; box.querySelectorAll("[data-c]").forEach((x) => x.classList.toggle("on", x === b)); sp.hidden = false; if (!sp.classList.contains("on")) sp.click(); box.querySelector(".ixEjudge").hidden = false; }));
      box.querySelectorAll("[data-j]").forEach((b) => (b.onclick = () => { const st = load(); (st.calib = st.calib || []).push({ l: les.key, c: conf || "unsure", r: b.dataset.j === "1", at: Date.now() }); st.calib = st.calib.slice(-600); save(st); box.querySelector(".ixEjudge").innerHTML = b.dataset.j === "1" ? (conf === "guess" ? "✓ Right, though you guessed: it will come back soon to make it solid." : "✓ Right.") : conf === "sure" ? "✗ Sure but wrong: the most valuable mistake. It becomes a card for tomorrow." : "✗ Wrong: now you know the gap; it comes back tomorrow."; if (b.dataset.j === "0" && idx >= 0) addCard(les, "think" + idx, all[idx].q, all[idx].a); }));
      // a reveal without committing still counts as "unsure"
      sp.addEventListener("click", () => { if (!conf) { conf = "peek"; box.querySelector(".ixEjudge").hidden = false; } });
    });
  }
  // a missed brain-dump point becomes a cloze card: the most specific word (a number, else the longest term) is blanked
  function cloze(title, pt) {
    const w = pt.match(/\d[\d.,–-]*\s?(?:cm|mm|%|days?|hours?)?|[A-Za-z][A-Za-z'-]{5,}/g) || [];
    const num = w.find((x) => /^\d/.test(x)), key = num || w.sort((a, b) => b.length - a.length)[0];
    return "From \"" + title + "\", fill the gap: " + (key ? pt.replace(key, "_____") : pt.split(" ").slice(0, 3).join(" ") + " …");
  }
  function addCard(les, tag, q, a) {
    let C = {}; try { C = JSON.parse(localStorage.getItem(CUSTOM) || "{}"); } catch (e) {}
    const id = les.key + "#" + tag; C[id] = { id, lesson: les.key, unit: les.unit, subject: les.subject, title: les.title, q: q.replace(/^./, (x) => x.toUpperCase()), a, at: Date.now() };
    try { localStorage.setItem(CUSTOM, JSON.stringify(C)); } catch (e) {}
  }

  /* ── after each part: one line in your own words; and Go deeper ── */
  function partTools(les, p, i) {
    if (p.engine) return "";
    const st = load(), mine = ((st.explain || {})[les.key + "#" + i]) || "", deep = ((st.deep || {})[les.key + "#" + i]) || "";
    return '<div class="ixEself"><label><span>✍️ In one line, in your own words: why is this true?</span><input type="text" data-e="explain" value="' + E(mine) + '" placeholder="Self-explanation (it is how understanding is built)" autocomplete="off"></label></div>' +
      '<div class="ixEdeep">' + (deep ? '<div class="ixEdeepT">' + md(deep) + "</div>" : '<button type="button" class="ixEbtn ghost" data-e="deep">🔬 Go deeper: the full mechanism</button>') + "</div>";
  }
  const md = (s) => (window.IX_HY && IX_HY.md ? IX_HY.md(s) : "<p>" + E(s) + "</p>");
  async function goDeeper(les, p, i, host) {
    const t = T(); if (!t || !t.hasKey()) { if (t && t.openSetup) t.openSetup("Connect your key to go deeper with the professor."); return; }
    const key = localStorage.getItem("ix_tutor_key_v1");
    host.innerHTML = '<p class="ixEsmall">The professor is writing the deeper layer…</p>';
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
        body: JSON.stringify({ model: localStorage.getItem("ix_tutor_model_pro_v1") || "openai/gpt-6.2-sol-pro", max_tokens: 900, usage: { include: true }, messages: [{ role: "system", content: "You teach a Kasr Al Ainy 2nd-year medical student who must UNDERSTAND, not memorise. Go exactly one level deeper than the text he just read: the full mechanism step by step (cause → mechanism → effect), the numbers that matter, one clinical consequence, and the one trap examiners set on it. 150–250 words, Markdown, short lines, bold only key words. Follow the Kasr Al Ainy course facts; say so if a textbook differs. No intro, no outro." }, { role: "user", content: "LESSON: " + les.title + " (" + les.subject + ")\nPART: " + p.h + "\n\n" + String(p.md).replace(/@@FIG:[a-z0-9_]+@@/g, "").slice(0, 3000) }] }) });
      if (!r.ok) throw new Error(r.status === 402 ? "no credit left on OpenRouter" : r.status === 401 ? "the key was refused" : "OpenRouter answered " + r.status);
      const j = await r.json(); try { if (j.usage && j.usage.cost && t._addSpend) t._addSpend(j.usage.cost); } catch (e) {}
      const out = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || ""; if (!out.trim()) throw new Error("nothing came back");
      const st = load(); (st.deep = st.deep || {})[les.key + "#" + i] = out; save(st);
      host.innerHTML = '<div class="ixEdeepT">' + md(out) + "</div>";
    } catch (e) { host.innerHTML = '<p class="ixEsmall">Could not go deeper: ' + E(e.message) + '</p><button type="button" class="ixEbtn ghost" data-e="deep">Try again</button>'; }
  }

  /* ── wire one rendered part ── */
  function enhance(body, ctx) {
    const { les, p, i } = ctx; if (!body || !les || !p) return;
    const mdBox = body.querySelector(".ixLmd");
    if (p.engine === "case" && mdBox) mdBox.innerHTML = caseHTML(les);
    if (p.engine === "dump" && mdBox) mdBox.innerHTML = dumpHTML(les);
    if (i === 0 && mdBox) mdBox.insertAdjacentHTML("beforebegin", firstScreen(les));
    if (mdBox) mdBox.insertAdjacentHTML("afterend", partTools(les, p, i));
    // v40: the professor's own drawing of this topic, in the big-picture part (cached after the first time)
    if (window.IX_AIX && !p.engine && (/big picture/i.test(p.h) || i === 1) && !body.querySelector(".ixAxTopic")) {
      const th = document.createElement("div"); th.className = "ixAxTopic"; const md0 = body.querySelector(".ixLmd"); if (md0) { md0.after(th); IX_AIX.mountTopic(th, les, (window.IX_LESSON_TEXT || {})[les.key] || p.md); }
    }
    // v42: the lecture video opens the lesson (watch, then read)
    if (window.IX_COURSE && i === 0 && !body.querySelector(".ixCv")) { const h2 = body.querySelector(".ixLpart h2"); const vb = IX_COURSE.videoBlock(les.key); if (h2 && vb) { h2.insertAdjacentHTML("afterend", vb); IX_COURSE.wireVideos(body, les); } }
    armThinks(body, les);
    body.querySelectorAll("[data-e]").forEach((b) => {
      const a = b.dataset.e;
      if (a === "explain") b.onchange = () => { const st = load(); (st.explain = st.explain || {})[les.key + "#" + i] = b.value.trim().slice(0, 400); save(st); if (b.value.trim() && T() && T().saveNotes && T().notesFor) { try { const k = "GIT 206 · " + (window.IX_HY && IX_HY.unit(les.unit) ? IX_HY.unit(les.unit).name : les.title); const old = T().notesFor(k) || ""; if (old.indexOf(b.value.trim()) < 0) T().saveNotes(k, (old ? old + "\n" : "") + "• " + p.h.replace(/^\d+\.\s*/, "") + ": " + b.value.trim()); } catch (e) {} } };
      if (a === "deep") b.onclick = () => goDeeper(les, p, i, b.closest(".ixEdeep"));
      if (a === "presave") b.onclick = () => { const st = load(); (st.pre = st.pre || {})[les.key] = [...body.querySelectorAll("[data-pre]")].map((x) => x.value.trim() || "?"); save(st); b.closest("details").outerHTML = '<p class="ixEnote">🎯 Guesses locked. Read on: you will see them next to each question.</p>'; };
      if (a === "wshow") b.onclick = () => { b.hidden = true; b.nextElementSibling.hidden = false; };
      if (a === "wg") b.onclick = () => { const w = b.closest("[data-w]"); try { KIT().grade(w.dataset.w, b.dataset.g); } catch (e) {} w.innerHTML = '<p class="ixEsmall">' + (b.dataset.g === "good" ? "✓ Strengthened; next review later." : "Back tomorrow. Retrieval that fails still helps.") + "</p>"; };
      if (a === "cshow") b.onclick = () => { const st = b.closest(".ixEstep"); b.hidden = true; st.querySelector(".ixEans").hidden = false; const nx = st.nextElementSibling; if (nx && nx.classList.contains("ixEstep")) nx.hidden = false; };
      if (a === "dumpcheck") b.onclick = () => { const t = body.querySelector("[data-e=dumptext]"); if (!t.value.trim()) { t.placeholder = "Write something first: even a few words. Retrieval is the point."; t.focus(); return; } b.hidden = true; t.readOnly = true; body.querySelector(".ixEdk").hidden = false; };
      if (a === "dumpscore") b.onclick = () => {
        const ticks = [...body.querySelectorAll("[data-pt]")], got = ticks.filter((x) => x.checked).length, pts = sayBack(les.key);
        ticks.forEach((x) => { if (!x.checked) addCard(les, "dump" + x.dataset.pt, cloze(les.title, pts[+x.dataset.pt]), pts[+x.dataset.pt]); });
        const st = load(); (st.recall = st.recall || {})[les.key] = { got, of: ticks.length, at: Date.now() }; save(st);
        const C = (st.calib || []).filter((x) => x.l === les.key), sureRight = C.filter((x) => x.c === "sure" && x.r).length, sureWrong = C.filter((x) => x.c === "sure" && !x.r).length;
        body.querySelector(".ixEres").innerHTML = "<b>Recall " + got + " / " + ticks.length + "</b> · " + (got === ticks.length ? "complete free recall: excellent." : ticks.length - got + " missed point" + (ticks.length - got > 1 ? "s are" : " is") + " now a flashcard for tomorrow.") + (C.length ? "<br>Calibration: " + sureRight + " sure-and-right, " + sureWrong + " sure-but-wrong" + (sureWrong ? " (those are the traps to fix)." : ".") : "") + "<br>Spacing: this lesson's cards come back tomorrow, then in 3, 7 and 16 days. Sleep tonight consolidates it: review 5 cards before bed.";
        b.disabled = true;
      };
    });
    tickBreak();
  }

  /* ── a movement break after 25 minutes of lessons (attention resets) ── */
  let started = 0, shown = 0;
  function tickBreak() {
    const now = Date.now(); if (!started || now - started > 3 * 3600e3) started = now;
    if (now - started > 25 * 60e3 && now - shown > 25 * 60e3) {
      shown = now; started = now;
      const d = document.createElement("div"); d.className = "ixStoast ixEbreak"; d.textContent = "⏸ 25 minutes: stand up, water, 2 minutes away from the screen. Attention comes back sharper.";
      document.body.appendChild(d); setTimeout(() => d.remove(), 7000);
    }
  }

  window.IX_ENGINE = { extendParts, enhance, thinks, sayBack, state: load, addCard };
})();
