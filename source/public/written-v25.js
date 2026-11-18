/* INTELLECTUALITY v25 · the written exams (GIT written 5 Jan, CNS written 12 Jan). The owner: "let's focus on the written".
 *
 *  ⚡ 3-minute outline   the cheapest written retrieval: from memory, only the headings and key points of an answer, in
 *                        3 minutes; a fast model checks them against the department-style reference (or the notes) and
 *                        the topic comes back on a spaced schedule (1 → 3 → 7 → 14 → 28 days; a weak outline resets it).
 *                        Every marked essay schedules its outline automatically.
 *  🧪 Written mock       a timed paper with the AI OFF, built like the last real paper (batch 198: physiology, anatomy,
 *                        histology). GIT: 6 real previous questions from the top of the ranking, 45 minutes. CNS: the
 *                        professor first writes 6 likely questions from the heaviest CNS chapters, then the AI goes off.
 *                        Type or photograph each answer; after submitting, three examiners mark each one against the
 *                        reference, and the total is shown as a range. Misses become memory cards and outlines.
 * State: S.written (it travels with the progress file). */
(function () {
  "use strict";
  if (window.IX_WRITTEN) return;
  const T = () => window.IX_TUTOR, GB = () => window.IX_GIT206 || { written: [] };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const DAY = 864e5, STEPS = [1, 3, 7, 14, 28];
  function st() { let s = null; try { s = typeof S !== "undefined" ? S : null; } catch (e) {} const h = s || (window.__ixWLocal = window.__ixWLocal || {}); h.written = h.written || {}; const w = h.written; w.outlines = w.outlines || {}; w.mocks = w.mocks || []; return w; }
  function persist() { try { if (typeof save === "function") save(); } catch (e) {} }

  /* ── outlines on a spaced schedule ── */
  function scheduleOutline(q, mark) {
    const o = st().outlines[q] || { step: 0, n: 0 };
    o.due = Date.now() + (mark != null && mark < 6 ? 1 : STEPS[Math.min(o.step, STEPS.length - 1)]) * DAY; o.last = Date.now();
    st().outlines[q] = o; persist();
  }
  const due = () => Object.entries(st().outlines).filter(([, o]) => o.due <= Date.now()).sort((a, b) => a[1].due - b[1].due).map(([q]) => q);

  /* ── a small overlay (the hub's look) ── */
  let root, body;
  function shell(title) {
    if (!root) {
      root = document.createElement("div"); root.className = "ixH ixW"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Written");
      root.innerHTML = '<div class="ixHbox"><div class="ixHhd"><b id="ixWt"></b><span class="ixHsub" id="ixWsub"></span><button type="button" data-w="close" aria-label="Close">✕</button></div><div class="ixHbody" id="ixWbody"></div></div>';
      document.body.appendChild(root); body = root.querySelector("#ixWbody");
      root.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && b.dataset.w === "close") close(); });
    }
    if (T()) T().close(); if (window.IX_GIT) IX_GIT.close(); if (window.IX_PLAN) IX_PLAN.close();
    root.querySelector("#ixWt").textContent = title; root.classList.add("on");
  }
  function close() { if (mock && mock.running) return; if (root) root.classList.remove("on"); window.IX_SCREEN_OVERRIDE = null; }
  function gate() { const d = T() && T().dayState ? T().dayState() : null; return d && d.gate; }
  async function fast(sys, user) {
    const key = localStorage.getItem("ix_tutor_key_v1"); if (!key) throw new Error("add your OpenRouter key in ⚙︎ first");
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": location.origin, "X-Title": "Intellectuality" },
      body: JSON.stringify({ model: localStorage.getItem("ix_tutor_model_v1") || "anthropic/claude-haiku-5.5", max_tokens: 500, usage: { include: true }, messages: [{ role: "system", content: sys }, { role: "user", content: user }] }) });
    if (!r.ok) throw new Error("OpenRouter answered " + r.status);
    const j = await r.json(); return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
  }

  /* ── ⚡ 3-minute outline ── */
  function openOutline(q, queue) {
    shell("⚡ 3-minute outline");
    if (gate()) { body.innerHTML = "<p>" + E(gate()) + "</p>"; return; }
    if (T() && T().tickDay) T().tickDay();
    const t0 = Date.now(), verb = T() ? T().verbTemplate(q) : "";
    body.innerHTML = "<p class='ixHsmall'>From memory, no notes. Only the headings and key points: the skeleton of the answer. 3 minutes.</p><h3>" + E(q) + "</h3><p class='ixTverb'>" + E(verb) + "</p>" +
      "<div class='ixHmeta'><span class='ixHclock' id='ixWclock'>3:00</span>" + (queue && queue.length ? "<span>" + queue.length + " more due after this</span>" : "") + "</div>" +
      "<textarea id='ixWo' rows='9' class='ixWta' placeholder='1. …&#10;2. …'></textarea><div class='ixHrow'><button type='button' class='primary' id='ixWcheck'>Check my outline</button></div><div id='ixWres'></div>";
    const clock = setInterval(() => { const el = document.getElementById("ixWclock"); if (!el) return clearInterval(clock); const left = 180e3 - (Date.now() - t0); el.textContent = left > 0 ? Math.floor(left / 60e3) + ":" + String(Math.floor((left % 60e3) / 1e3)).padStart(2, "0") : "time · finish the line you are on"; }, 1000);
    body.querySelector("#ixWcheck").onclick = async () => {
      clearInterval(clock);
      const a = body.querySelector("#ixWo").value.trim(), res = body.querySelector("#ixWres");
      if (a.length < 10) { res.textContent = "Write a few headings first."; return; }
      res.textContent = "Checking against the reference…";
      const ref = T() && T().refFor ? T().refFor(q) : "";
      try {
        const out = await fast("You check a medical student's 3-minute answer OUTLINE (headings and key points only, not full sentences) for a Kasr Al Ainy written question. Compare it with the reference if given, else with standard textbook content. Reply ONLY with JSON: {\"have\": [the main points present, short], \"missing\": [the main headings or key points missing, short, max 5], \"ok\": true if the skeleton would score at least 7/10 once written out}",
          "QUESTION: " + q + "\nSTRUCTURE IT NEEDS: " + verb + "\nSTUDENT OUTLINE:\n" + a + (ref ? "\n\nREFERENCE:\n" + ref.slice(0, 4000) : ""));
        const o = JSON.parse(out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1));
        const rec = st().outlines[q] || { step: 0, n: 0 };
        rec.n++; rec.step = o.ok ? rec.step + 1 : 0; st().outlines[q] = rec; scheduleOutline(q, o.ok ? null : 4);
        res.innerHTML = "<div class='ixHverdict " + (o.ok ? "good" : "bad") + "'>" + (o.ok ? "✓ The skeleton is there" : "✗ Not yet: the skeleton has gaps") + " · next outline in " + Math.round((st().outlines[q].due - Date.now()) / DAY) + " day(s)</div>" +
          (o.have && o.have.length ? "<p>✅ " + o.have.map(E).join(" · ") + "</p>" : "") + (o.missing && o.missing.length ? "<p><b>Missing:</b></p><ul>" + o.missing.map((x) => "<li>" + E(x) + "</li>").join("") + "</ul>" : "") +
          "<div class='ixHrow'>" + (queue && queue.length ? "<button type='button' class='primary' id='ixWnext'>Next outline →</button>" : "<button type='button' data-w='close'>Done</button>") + "</div>";
        (o.missing || []).slice(0, 2).forEach((m) => T() && T().addCard && T().addCard("Written outline for '" + q + "': include " + m, ""));
        const nx = res.querySelector("#ixWnext"); if (nx) nx.onclick = () => openOutline(queue[0], queue.slice(1));
        persist();
      } catch (e) { res.textContent = "Could not check: " + e.message; }
    };
  }
  function openDue() {
    const d = due();
    if (!d.length) { shell("⚡ Outlines"); body.innerHTML = "<p>No outline is due today ✓ (" + Object.keys(st().outlines).length + " topics on the schedule). Every essay you get marked joins it.</p>"; return; }
    openOutline(d[0], d.slice(1));
  }

  /* ── 🧪 written mock, AI off ── */
  let mock = null;
  function pickGit() {
    const W = GB().written.filter((w) => !/: other$/.test(w.topic)), done = new Set([].concat(...st().mocks.filter((m) => m.exam === "git").map((m) => m.qs.map((x) => x.topic))));
    const by = (sub, n) => W.filter((w) => w.subject === sub && !done.has(w.topic)).slice(0, 8).sort(() => Math.random() - 0.5).slice(0, n).map((w) => ({ topic: w.topic, q: w.questions[0].q, subject: sub }));
    return by("Physiology", 2).concat(by("Anatomy", 2), by("Histology", 2));
  }
  async function pickCns() {
    const ch = window.IX_PLAN ? IX_PLAN.cns().slice(0, 18) : [];
    const sample = ch.sort(() => Math.random() - 0.5).slice(0, 6);
    const out = await fast("You write Kasr Al Ainy NEU-205 (CNS) written-exam questions. For each chapter given, write the ONE essay question most likely to be asked, in the department's style (Explain / Compare in a table / Enumerate / Describe / a short case). Reply ONLY with JSON: {\"qs\": [\"…\", …]} in the same order.", sample.map((c, i) => (i + 1) + ". " + c.subject + ": " + c.name).join("\n"));
    const qs = JSON.parse(out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1)).qs || [];
    return sample.map((c, i) => ({ topic: c.name, q: qs[i] || "Write what you know about " + c.name, subject: c.subject })).filter((x) => x.q);
  }
  async function openMock(exam) {
    shell(exam === "cns" ? "🧪 CNS written mock" : "🧪 GIT written mock");
    if (gate()) { body.innerHTML = "<p>" + E(gate()) + "</p>"; return; }
    body.innerHTML = "<p>A real-exam rehearsal: <b>6 questions, 45 minutes, AI off</b>. Write on paper and photograph each answer, or type. When you submit, the AI comes back and three examiners mark every answer against the department-style reference.</p>" + (exam === "cns" ? "<p class='ixHsmall'>CNS has no past written list loaded yet: the professor first writes the 6 most likely questions from the heaviest CNS chapters.</p>" : "") + "<div class='ixHrow'><button type='button' class='primary' id='ixWgo'>Start: AI off, 45 minutes</button></div><div id='ixWprep'></div>";
    body.querySelector("#ixWgo").onclick = async () => {
      let qs;
      try { body.querySelector("#ixWprep").textContent = exam === "cns" ? "The professor is writing your paper…" : ""; qs = exam === "cns" ? await pickCns() : pickGit(); }
      catch (e) { body.querySelector("#ixWprep").textContent = "Could not prepare the paper: " + e.message; return; }
      if (!qs.length) return;
      mock = { exam, qs, ans: qs.map(() => ({ a: "", img: null })), i: 0, t0: Date.now(), running: true };
      document.documentElement.classList.add("ixHmock");
      showMockQ();
    };
  }
  let mclock = null;
  function showMockQ() {
    const m = mock, x = m.qs[m.i];
    window.IX_SCREEN_OVERRIDE = { title: "MOCK", body: "" };
    body.innerHTML = "<div class='ixHmeta'><span>" + (m.i + 1) + " / " + m.qs.length + " · " + E(x.subject) + "</span><span class='ixHclock' id='ixWmclock'></span><span class='ixHoff'>AI off</span></div><h3>" + E(x.q) + "</h3><p class='ixTverb'>" + E(T() ? T().verbTemplate(x.q) : "") + "</p>" +
      "<textarea id='ixWma' rows='10' class='ixWta' placeholder='Type your answer, or write on paper and add a photo below'>" + E(m.ans[m.i].a) + "</textarea>" +
      "<label class='ixTfile'>📷 Photo of my handwritten answer" + (m.ans[m.i].img ? " (added ✓)" : "") + "<input type='file' id='ixWmimg' accept='image/*' capture='environment'></label>" +
      "<div class='ixHrow'>" + (m.i > 0 ? "<button type='button' id='ixWprev'>← Back</button>" : "") + (m.i < m.qs.length - 1 ? "<button type='button' class='primary' id='ixWnextq'>Next →</button>" : "<button type='button' class='primary' id='ixWsubmit'>Submit the paper</button>") + "</div>";
    const keep = () => { m.ans[m.i].a = body.querySelector("#ixWma").value; };
    body.querySelector("#ixWmimg").onchange = async (e) => { const f = e.target.files[0]; if (f && T()) { m.ans[m.i].img = await T().photoURL(f); keep(); showMockQ(); } };
    const pv = body.querySelector("#ixWprev"); if (pv) pv.onclick = () => { keep(); m.i--; showMockQ(); };
    const nx = body.querySelector("#ixWnextq"); if (nx) nx.onclick = () => { keep(); m.i++; showMockQ(); };
    const sb = body.querySelector("#ixWsubmit"); if (sb) sb.onclick = () => { keep(); submitMock(); };
    clearInterval(mclock);
    const f = () => { const el = document.getElementById("ixWmclock"); if (!el || !mock) return clearInterval(mclock); const left = 45 * 60e3 - (Date.now() - mock.t0); el.textContent = (left < 0 ? "+" : "") + Math.floor(Math.abs(left) / 60e3) + ":" + String(Math.floor((Math.abs(left) % 60e3) / 1e3)).padStart(2, "0") + (left < 0 ? " over" : " left"); };
    f(); mclock = setInterval(f, 1000);
  }
  async function submitMock() {
    const m = mock; m.running = false; clearInterval(mclock);
    document.documentElement.classList.remove("ixHmock"); window.IX_SCREEN_OVERRIDE = null;
    const min = Math.round((Date.now() - m.t0) / 60e3);
    body.innerHTML = "<p>Submitted after " + min + " minutes. The AI is back: three examiners are marking each answer…</p><div id='ixWgr'></div>";
    const box = body.querySelector("#ixWgr"), results = [];
    for (let i = 0; i < m.qs.length; i++) {
      const x = m.qs[i], a = m.ans[i];
      if (!a.a.trim() && !a.img) { results.push({ q: x.q, topic: x.topic, median: 0, lo: 0, hi: 0, blank: true }); box.insertAdjacentHTML("beforeend", "<div class='ixWr'><b>" + (i + 1) + ". " + E(x.q) + "</b><p>Left blank: 0 / 10.</p></div>"); continue; }
      try {
        const g = await T().gradeEssay(x.q, a.a.trim(), a.img);
        results.push({ q: x.q, topic: x.topic, median: g.median, lo: g.lo, hi: g.hi });
        box.insertAdjacentHTML("beforeend", "<div class='ixWr'><b>" + (i + 1) + ". " + E(x.q) + "</b>" + T().gradeHTML(g, x.q) + "</div>");
        g.missing.slice(0, 2).forEach((mm) => T().addCard("Written (" + x.topic + "): include " + mm, ""));
        scheduleOutline(x.q, g.median);
      } catch (e) { results.push({ q: x.q, topic: x.topic, median: null }); box.insertAdjacentHTML("beforeend", "<div class='ixWr'><b>" + (i + 1) + ". " + E(x.q) + "</b><p>Could not be marked: " + E(e.message) + "</p></div>"); }
    }
    const got = results.filter((r) => r.median != null), n = got.length * 10;
    const sum = (k) => got.reduce((t, r) => t + r[k], 0);
    st().mocks.push({ exam: m.exam, at: Date.now(), min, qs: results, total: sum("median"), lo: sum("lo"), hi: sum("hi"), out: n }); persist();
    body.insertAdjacentHTML("afterbegin", "<div class='ixHdone'><div class='ixHbig'>" + sum("median") + " / " + n + "</div><p>" + (n ? Math.round((100 * sum("median")) / n) : 0) + "% · the examiners' range " + sum("lo") + "–" + sum("hi") + " · " + min + " min</p><p class='ixHsmall'>A coach's estimate. Weak answers are now memory cards and 3-minute outlines.</p><div class='ixHrow'><button type='button' data-w='close'>Close</button></div></div>");
    mock = null;
  }
  function history() { return st().mocks.slice(); }

  window.IX_WRITTEN = { scheduleOutline, due, openOutline, openDue, openMock, history, state: st, close };
})();
