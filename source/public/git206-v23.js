/* INTELLECTUALITY v23 · the GIT 206 hub (Digestive, renal & metabolism), built from the owner's 206 material
 * (owner, 17 Nov 2026: "I added the files to the repository"). Next exams: GIT written and GIT MCQ.
 *
 * Four rooms, one philosophy (docs/PHILOSOPHY_v21.md):
 *   MCQ practice  chapters of the bank; misses first, then unseen; confidence on every answer (certainty marking);
 *                 a miss becomes a memory card; the professor explains inline (Why / Every option / Twin)
 *   Past papers   each solved paper taken as a real mock: AI OFF, 1 min per question, no feedback until the end;
 *                 that score is the only GIT readiness shown. The unsolved 197 paper is practised with the professor,
 *                 whose answer is labelled as his, not the official key.
 *   Written       previous written questions grouped by topic and ranked by how often and how recently asked;
 *                 write it → 3-examiner grading; model answer; memory hook
 *   Blind check   new questions on a chapter from the professor, AI off
 * Progress lives in S.git206 (so it travels with the progress file); the study minutes count toward the day. */
(function () {
  "use strict";
  if (window.IX_GIT) return;
  const B = () => window.IX_GIT206 || { mcq: [], written: [] };
  const T = () => window.IX_TUTOR;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const DAY = 864e5;
  function st() {
    let s = null; try { s = typeof S !== "undefined" ? S : null; } catch (e) {}
    const host = s || (window.__ixGitLocal = window.__ixGitLocal || {});
    host.git206 = host.git206 || {}; const g = host.git206;
    g.q = g.q || {}; g.hidden = g.hidden || []; g.mocks = g.mocks || []; return g;
  }
  function persist() { try { if (typeof save === "function") save(); } catch (e) {} }
  const keyed = (q) => q.answerKeys && q.answerKeys.length;
  const visible = () => B().mcq.filter((q) => !st().hidden.includes(q.id));
  const PAPERS = () => Array.from(new Set(B().mcq.filter((q) => q.ocr).map((q) => q.source)));
  const mocked = (src) => st().mocks.some((m) => m.src === src);
  // a solved paper stays out of practice until it has been taken as a mock: it is the honest test
  const practicePool = () => visible().filter((q) => keyed(q) && (!q.ocr || mocked(q.source)));

  /* ── readiness: only AI-off mocks on real papers count ── */
  function readiness() {
    let n = 0, k = 0; st().mocks.forEach((m) => { n += m.n; k += m.k; });
    if (n < 10) return null;
    const z = 1.2816, ph = k / n, den = 1 + (z * z) / n, c = (ph + (z * z) / (2 * n)) / den, h = (z * Math.sqrt((ph * (1 - ph)) / n + (z * z) / (4 * n * n))) / den;
    return { n, p: ph, lo: Math.max(0, c - h), hi: Math.min(1, c + h) };
  }

  /* ── shell ── */
  let root, body, tab = "mcq";
  function build() {
    if (root) return;
    root = document.createElement("div"); root.className = "ixH"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "GIT 206");
    root.innerHTML = '<div class="ixHbox"><div class="ixHhd"><b>🫃 GIT 206</b><span class="ixHsub" id="ixHsub"></span><button type="button" data-g="close" aria-label="Close">✕</button></div>' +
      '<div class="ixHtabs" role="tablist"><button data-tab="mcq">MCQ practice</button><button data-tab="papers">Past papers</button><button data-tab="written">Written</button><button data-tab="blind">Blind check</button><button data-tab="hy">📘 High-yield</button></div><div class="ixHbody" id="ixHbody"></div></div>';
    document.body.appendChild(root); body = root.querySelector("#ixHbody");
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.g === "close") close();
      else if (b.dataset.tab) { tab = b.dataset.tab; render(); }
    });
  }
  function header() {
    const r = readiness(), g = st(), all = practicePool().length, done = practicePool().filter((q) => g.q[q.id]).length;
    const d = T() && T().dayState ? T().dayState() : null;
    root.querySelector("#ixHsub").textContent = done + "/" + all + " practised" + (r ? " · papers (AI off) " + Math.round(r.p * 100) + "% (" + Math.round(r.lo * 100) + "–" + Math.round(r.hi * 100) + ")" : " · take a past paper for a real readiness") + (d ? " · ⏱ " + d.used + "/" + d.budget + "m" : "");
    root.querySelectorAll("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x.dataset.tab === tab ? "true" : "false"));
  }
  function open(t) { build(); if (t) tab = t; root.classList.add("on"); render(); }
  function close() { if (root) root.classList.remove("on"); window.IX_SCREEN_OVERRIDE = null; if (run && run.mock) endMock(true); run = null; }
  function gateHTML() {
    const d = T() && T().dayState ? T().dayState() : null;
    return d && d.gate ? '<div class="ixHgate">' + E(d.gate) + ' <button type="button" id="ixHplus">+10 min</button></div>' : "";
  }
  function wireGate() { const p = body.querySelector("#ixHplus"); if (p) p.onclick = () => { T().extend(10); render(); }; }
  function render() {
    header(); window.IX_SCREEN_OVERRIDE = { title: "GIT 206 · " + tab, eyebrow: "DIG-206", body: "" };
    if (run) return showQ();
    if (tab === "mcq") return chapters();
    if (tab === "papers") return papers();
    if (tab === "written") return written();
    if (tab === "hy") { tab = "mcq"; close(); return window.IX_HY && IX_HY.list(); }
    return blind();
  }

  /* ── MCQ practice ── */
  function chapters() {
    const pool = practicePool(), g = st(), by = {};
    pool.forEach((q) => { (by[q.subject] = by[q.subject] || {})[q.chapter] = (by[q.subject][q.chapter] || []).concat(q); });
    const now = Date.now(), due = pool.filter((q) => g.q[q.id] && !g.q[q.id].ok && g.q[q.id].due <= now).length;
    body.innerHTML = gateHTML() +
      '<div class="ixHrow"><button type="button" class="primary" data-run="mix">▶ Today\'s 10 (' + (due ? due + " misses due, then " : "") + "new)</button></div>" +
      Object.entries(by).map(([sub, chs]) => "<h3>" + E(sub) + "</h3><div class='ixHchs'>" + Object.entries(chs).map(([ch, qs]) => {
        const seen = qs.filter((q) => g.q[q.id]).length, ok = qs.filter((q) => g.q[q.id] && g.q[q.id].ok).length;
        return '<button type="button" class="ixHch" data-run="' + E(ch) + '"><b>' + E(ch.replace(/ · past papers$/, " (papers)")) + "</b><span>" + seen + "/" + qs.length + (seen ? " · " + Math.round((100 * ok) / seen) + "% right" : "") + "</span></button>";
      }).join("") + "</div>").join("") +
      (PAPERS().some((p) => !mocked(p)) ? "<p class='ixHsmall'>The solved past papers join practice after you take each one as a mock (Past papers): they are your honest test first.</p>" : "");
    wireGate();
    body.querySelectorAll("[data-run]").forEach((b) => (b.onclick = () => startRun(b.dataset.run)));
  }
  let run = null;
  function pick(pool, n) {
    const g = st(), now = Date.now();
    const dueWrong = pool.filter((q) => g.q[q.id] && !g.q[q.id].ok && g.q[q.id].due <= now);
    const unseen = pool.filter((q) => !g.q[q.id]).sort(() => Math.random() - 0.5);
    const old = pool.filter((q) => g.q[q.id] && g.q[q.id].ok).sort((a, b) => g.q[a.id].last - g.q[b.id].last);
    return dueWrong.concat(unseen, old).slice(0, n);
  }
  function startRun(which) {
    if (T() && T().dayState && T().dayState().gate) { render(); return; }
    const pool = which === "mix" ? practicePool() : practicePool().filter((q) => q.chapter === which);
    const qs = pick(pool, 10); if (!qs.length) return;
    run = { qs, i: 0, k: 0, cbm: 0, mock: false, title: which === "mix" ? "Today's 10" : which };
    showQ();
  }
  function qText(q, withKey, sel) {
    return "QUESTION (DIG-206 " + q.subject + " · " + q.chapter + " · " + q.source + (q.ocr ? ", read from a scanned paper" : "") + "):\n" + q.stem + "\n" + q.options.map((o) => o.key + ") " + o.text).join("\n") +
      (withKey ? (keyed(q) ? "\nKEY: " + q.answerKeys.join(", ") : "\nKEY: none (unsolved paper: give YOUR answer and say it is yours, not the official key)") + (sel ? "\nSTUDENT CHOSE: " + sel : "") : "");
  }
  function showQ() {
    const q = run.qs[run.i];
    if (!q) return finish();
    window.IX_SCREEN_OVERRIDE = run.mock ? { title: "MOCK", body: "" } : { title: "GIT 206 · " + q.chapter, eyebrow: "DIG-206 " + q.subject, body: qText(q, false) };
    header();
    body.innerHTML = '<div class="ixHq" data-qid="' + E(q.id) + '"><div class="ixHmeta"><span>' + E(run.title) + " · " + (run.i + 1) + " / " + run.qs.length + "</span>" + (run.mock ? '<span class="ixHclock" id="ixHclock"></span><span class="ixHoff">AI off</span>' : "") + '<span>' + E(q.source) + (q.ocr ? " · scanned" : "") + "</span></div>" +
      "<h3>" + E(q.stem) + "</h3><div class='ixHopts'>" + q.options.map((o) => '<button type="button" class="ixHopt" data-k="' + E(o.key) + '"><b>' + E(o.key.toUpperCase()) + "</b> " + E(o.text) + "</button>").join("") + "</div>" +
      "<div class='ixHconf'><span>How sure?</span><button type='button' data-c='guess'>😬 Guess</button><button type='button' data-c='unsure' aria-pressed='true'>🤔 Unsure</button><button type='button' data-c='sure'>😎 Sure</button></div>" +
      (!run.mock && !keyed(q) ? "<p class='ixHsmall'>Unsolved paper: after you answer, the professor gives his answer (his, not the official key).</p>" : "") +
      (!run.mock && keyed(q) ? "<div class='ixHhost' id='ixHhint'></div>" : "") + "</div>";
    let conf = "unsure";
    body.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { conf = b.dataset.c; body.querySelectorAll("[data-c]").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false")); }));
    if (!run.mock && keyed(q) && T()) {
      const h = body.querySelector("#ixHhint"); const bb = document.createElement("div"); bb.className = "ixAiBar";
      bb.innerHTML = '<span class="ixAiMark">🧠</span><button type="button">💡 Hint (not the answer)</button>';
      bb.querySelector("button").onclick = () => T().ask("Give me a hint for this question, not the answer.", "hint", qText(q, false), { inline: h });
      h.before(bb);
    }
    if (run.mock) tickClock();
    body.querySelectorAll(".ixHopt").forEach((b) => (b.onclick = () => answer(q, b.dataset.k, conf)));
  }
  function answer(q, sel, conf) {
    const g = st(), ok = keyed(q) ? q.answerKeys.includes(sel) : null;
    if (T() && T().tickDay) T().tickDay();
    if (run.mock) {
      run.ans.push({ id: q.id, sel, ok, conf });
      if (ok) run.k++; run.cbm += (T().CBM[conf] || [0, 0, 0])[ok ? 0 : 2];
      run.i++; return showQ();
    }
    if (keyed(q)) {
      const r = g.q[q.id] || { n: 0, right: 0 };
      r.n++; r.last = Date.now(); r.ok = ok; if (ok) r.right++;
      r.due = Date.now() + (ok ? [3, 7, 16, 35][Math.min(r.right - 1, 3)] : 1) * DAY;
      g.q[q.id] = r; persist();
      if (ok) run.k++; run.cbm += (T() ? T().CBM[conf] || [0, 0, 0] : [0, 0, 0])[ok ? 0 : 2];
      try { const c = JSON.parse(localStorage.getItem("ix_tutor_calib_v1") || "[]"); c.push({ conf, verdict: ok ? "correct" : "wrong", at: Date.now(), git: 1 }); localStorage.setItem("ix_tutor_calib_v1", JSON.stringify(c.slice(-400))); } catch (e) {}
      if (!ok && T() && T().addCard) T().addCard("GIT 206: " + q.stem + " → " + q.options.filter((o) => q.answerKeys.includes(o.key)).map((o) => o.text).join(" / "), "chose " + sel);
    }
    const keyTxt = keyed(q) ? q.options.filter((o) => q.answerKeys.includes(o.key)).map((o) => o.key.toUpperCase() + ") " + o.text).join(" / ") : "";
    body.querySelectorAll(".ixHopt").forEach((b) => { b.disabled = true; if (keyed(q) && q.answerKeys.includes(b.dataset.k)) b.classList.add("good"); else if (b.dataset.k === sel) b.classList.add(keyed(q) ? "bad" : "mine"); });
    window.IX_SCREEN_OVERRIDE = { title: "GIT 206 · " + q.chapter, eyebrow: "DIG-206 " + q.subject, body: qText(q, true, sel) };
    const fb = document.createElement("div"); fb.className = "ixHfb";
    fb.innerHTML = (keyed(q) ? '<div class="ixHverdict ' + (ok ? "good" : "bad") + '">' + (ok ? "✓ Right" : "✗ It is " + E(keyTxt)) + (conf === "sure" && !ok ? " · you were sure: this is a trap worth fixing" : "") + "</div>" : "<div class='ixHverdict'>No official key for this one.</div>") +
      (q.ocr ? '<p class="ixHsmall">From a scanned solved paper. If the key looks wrong, <button type="button" class="ixHlink" data-flag>⚑ hide this question</button>.</p>' : "") +
      unitFig(q) + '<div class="ixHhost" id="ixHai"></div><div class="ixHrow"><button type="button" class="primary" data-next>Next →</button></div>';
    body.querySelector(".ixHq").appendChild(fb);
    const host = fb.querySelector("#ixHai");
    if (T()) {
      const bb = document.createElement("div"); bb.className = "ixAiBar";
      const btns = keyed(q) ? [[ok ? "💬 Why is it right?" : "💬 Why was I wrong?", "optwhy", ok ? "Make sure I understood why." : "I chose " + sel.toUpperCase() + ". Why was I wrong?"], ["Every option", "optall", "Go through every option."], ["🔁 Twin question", "twin", "Give me a twin question on the same idea."]]
        : [["🧠 Professor's answer", "optall", "There is no official key. Give your answer, say it is yours, and go through every option."]];
      bb.innerHTML = '<span class="ixAiMark">🧠</span>' + btns.map((x, i) => '<button type="button" data-i="' + i + '"' + (i === 0 ? ' class="main"' : "") + ">" + x[0] + "</button>").join("");
      bb.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; const x = btns[+b.dataset.i]; T().ask(x[2], x[1], qText(q, true, sel), { inline: host }); });
      host.before(bb);
    }
    const fl = fb.querySelector("[data-flag]"); if (fl) fl.onclick = () => { st().hidden.push(q.id); persist(); fl.replaceWith(document.createTextNode("hidden ✓")); };
    fb.querySelector("[data-next]").onclick = () => { run.i++; showQ(); };
  }
  function unitFig(q) {
    try {
      const u = window.IX_PLAN && IX_PLAN.units().find((x) => x.pred(q)), F = u && (window.IX_GIT206_FIGS || {})[u.id];
      if (!F || !F.length) return "";
      const f = F[Math.abs(q.id.split("").reduce((t, c) => t + c.charCodeAt(0), 0)) % F.length];
      return "<figure class='ixYfig'><img loading='lazy' src='" + E(f.src) + "' alt='" + E(f.cap) + "'><figcaption>" + E(f.cap) + " <small>· " + E(f.fig) + "</small></figcaption></figure>";
    } catch (e) { return ""; }
  }
  function finish() {
    const r = run; run = null;
    window.IX_SCREEN_OVERRIDE = null;
    body.innerHTML = '<div class="ixHdone"><div class="ixHbig">' + r.k + " / " + r.qs.filter(keyed).length + "</div><p>certainty score " + r.cbm + "</p><p>Misses come back tomorrow, re-worded, as memory cards. " + (T() && T().dayState && T().dayState().gate ? "That is the day: done ✅" : "") + "</p><div class='ixHrow'><button type='button' class='primary' data-back>Back</button></div></div>";
    body.querySelector("[data-back]").onclick = () => render();
    header();
  }

  /* ── past papers as real mocks ── */
  function papers() {
    body.innerHTML = gateHTML() + "<p>A real past paper, <b>AI off</b>, about one minute a question, no feedback until the end. This is the GIT readiness the app trusts.</p>" +
      PAPERS().map((src) => {
        const qs = visible().filter((q) => q.source === src), kq = qs.filter(keyed).length, m = st().mocks.filter((x) => x.src === src).pop();
        return '<div class="ixHpaper"><div><b>' + E(src) + "</b><span>" + qs.length + " questions" + (kq < qs.length ? " · " + (qs.length - kq) + " without a key" : "") + (m ? " · mock " + m.k + "/" + m.n : "") + "</span></div>" +
          (kq ? '<button type="button" ' + (m ? "" : 'class="primary" ') + 'data-mock="' + E(src) + '">' + (m ? "Retake" : "Take as mock") + "</button>" : '<button type="button" data-prof="' + E(src) + '">Practise with the professor</button>') + "</div>";
      }).join("") + (st().mocks.length ? "<h3>Your mocks</h3><ul>" + st().mocks.map((m) => "<li>" + E(m.src) + ": " + m.k + "/" + m.n + " · certainty " + m.cbm + " · " + new Date(m.at).toLocaleDateString() + "</li>").join("") + "</ul>" : "");
    wireGate();
    body.querySelectorAll("[data-mock]").forEach((b) => (b.onclick = () => startMock(b.dataset.mock)));
    body.querySelectorAll("[data-prof]").forEach((b) => (b.onclick = () => { const qs = visible().filter((q) => q.source === b.dataset.prof).slice(0); run = { qs, i: 0, k: 0, cbm: 0, mock: false, title: b.dataset.prof }; showQ(); }));
  }
  let clockT = null;
  function startMock(src) {
    if (T() && T().dayState && T().dayState().gate) { render(); return; }
    const qs = visible().filter((q) => q.source === src && keyed(q));
    run = { qs, i: 0, k: 0, cbm: 0, mock: true, src, ans: [], t0: Date.now(), limit: qs.length * 60e3, title: "MOCK · " + src };
    document.documentElement.classList.add("ixHmock");
    showQ();
  }
  function tickClock() {
    clearInterval(clockT);
    const f = () => { const el = document.getElementById("ixHclock"); if (!el || !run || !run.mock) return clearInterval(clockT); const left = run.limit - (Date.now() - run.t0); el.textContent = (left < 0 ? "+" : "") + Math.floor(Math.abs(left) / 60e3) + ":" + String(Math.floor((Math.abs(left) % 60e3) / 1e3)).padStart(2, "0") + (left < 0 ? " over" : " left"); };
    f(); clockT = setInterval(f, 1000);
  }
  function endMock(abandoned) {
    clearInterval(clockT); document.documentElement.classList.remove("ixHmock");
    if (abandoned) return;
  }
  // a mock is finished in finish(): wrap it so the result is stored and the review opens with the professor
  const plainFinish = finish;
  finish = function () {
    if (!run || !run.mock) return plainFinish();
    const r = run; endMock(false);
    st().mocks.push({ src: r.src, n: r.qs.length, k: r.k, cbm: r.cbm, at: Date.now(), min: Math.round((Date.now() - r.t0) / 60e3) });
    const g = st();
    r.ans.forEach((a) => { const x = g.q[a.id] || { n: 0, right: 0 }; x.n++; x.last = Date.now(); x.ok = a.ok; if (a.ok) x.right++; x.due = Date.now() + (a.ok ? 7 : 1) * DAY; g.q[a.id] = x; });
    persist();
    const wrong = r.ans.filter((a) => !a.ok).map((a) => r.qs.find((q) => q.id === a.id));
    wrong.forEach((q) => T() && T().addCard && T().addCard("GIT 206 (" + r.src + "): " + q.stem + " → " + q.options.filter((o) => q.answerKeys.includes(o.key)).map((o) => o.text).join(" / "), ""));
    const rd = readiness();
    run = null; window.IX_SCREEN_OVERRIDE = null;
    body.innerHTML = '<div class="ixHdone"><div class="ixHbig">' + r.k + " / " + r.qs.length + "</div><p>" + Math.round((100 * r.k) / r.qs.length) + "% · certainty score " + r.cbm + " · " + Math.round((Date.now() - r.t0) / 60e3) + " min</p>" +
      (rd ? "<p>GIT readiness from all your mocks (AI off): <b>" + Math.round(rd.p * 100) + "%</b> (" + Math.round(rd.lo * 100) + "–" + Math.round(rd.hi * 100) + "%).</p>" : "") +
      "<p>The " + wrong.length + " you missed are memory cards now, and this paper has joined practice. Review each miss with the professor:</p><div class='ixHrow'>" +
      (wrong.length ? "<button type='button' class='primary' data-review>Review my misses</button>" : "") + "<button type='button' data-back>Back</button></div></div>";
    body.querySelector("[data-back]").onclick = () => { tab = "papers"; render(); };
    const rv = body.querySelector("[data-review]"); if (rv) rv.onclick = () => { run = { qs: wrong, i: 0, k: 0, cbm: 0, mock: false, title: "Misses · " + r.src }; showQ(); };
    header();
  };

  /* ── written ── */
  let wsub = "All";
  function written() {
    const W = B().written.filter((w) => !/: other$/.test(w.topic) && (wsub === "All" || w.subject === wsub));
    const od = window.IX_WRITTEN ? IX_WRITTEN.due().length : 0;
    body.innerHTML = (window.IX_WRITTEN ? "<div class='ixHrow'><button type='button' class='primary' data-wm='git'>🧪 Written mock, AI off (45 min)</button><button type='button' data-wo>⚡ Outlines due: " + od + "</button></div>" : "") + "<p>Previous written questions grouped by topic, <b>most likely first</b> (asked more often and more recently). Write from a blank page, then let the three examiners mark it.</p>" +
      "<div class='ixHrow'>" + ["All", "Anatomy", "Physiology", "Histology"].map((x) => '<button type="button" data-ws="' + x + '"' + (x === wsub ? ' aria-pressed="true"' : "") + ">" + x + "</button>").join("") + "</div>" +
      W.map((w, i) => '<details class="ixHw"><summary><span class="ixHrank">' + (i + 1) + "</span><b>" + E(w.topic) + "</b><span>" + E(w.subject) + " · asked " + w.times + "× · last " + E(w.last) + "</span></summary>" +
        w.questions.map((q, j) => '<div class="ixHwq"><p>' + E(q.q) + ' <small>(' + E(q.years.join(", ")) + ')</small></p><div class="ixHrow"><button type="button" data-w="grade" data-t="' + i + '" data-j="' + j + '">📝 Write it, get marked</button><button type="button" data-w="model" data-t="' + i + '" data-j="' + j + '">🧠 Model answer</button><button type="button" data-w="outline" data-t="' + i + '" data-j="' + j + '">⚡ 3-min outline</button><button type="button" data-w="hook" data-t="' + i + '" data-j="' + j + '">🔒 Hook</button></div><div class="ixHhost"></div></div>').join("") + "</details>").join("");
    body.querySelectorAll("[data-ws]").forEach((b) => (b.onclick = () => { wsub = b.dataset.ws; written(); }));
    const wm = body.querySelector("[data-wm]"); if (wm) wm.onclick = () => { close(); IX_WRITTEN.openMock("git"); };
    const wo = body.querySelector("[data-wo]"); if (wo) wo.onclick = () => { close(); IX_WRITTEN.openDue(); };
    body.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => {
      const w = W[+b.dataset.t], q = w.questions[+b.dataset.j].q, host = b.closest(".ixHwq").querySelector(".ixHhost");
      window.IX_SCREEN_OVERRIDE = { title: "GIT 206 written · " + w.topic, eyebrow: "DIG-206 " + w.subject, body: "Written question (asked " + w.times + " times, " + w.years.join(", ") + "): " + q };
      if (b.dataset.w === "grade") { close(); T().openEssay(q); return; }
      const ref = window.IX_REF_FOR(q);
      if (b.dataset.w === "model") T().ask("Model answer for: " + q, "written", "This is a real previous DIG-206 written question (" + w.years.join(", ") + "). Answer it the way Kasr Al Ainy examiners mark, within the marks it usually carries. STRUCTURE: " + T().verbTemplate(q) + (ref ? "\nBuild the answer from this department-style reference (say so; add nothing it does not support unless marked '(not in your notes)'):\n" + ref.slice(0, 5000) : ""), { inline: host });
      else if (b.dataset.w === "outline") { close(); window.IX_WRITTEN && IX_WRITTEN.openOutline(q); }
      else T().ask("Memory hook for: " + q, "palace", "", { inline: host });
    }));
  }

  /* ── blind check on a GIT chapter ── */
  function blind() {
    const chs = Array.from(new Set(visible().map((q) => q.chapter)));
    body.innerHTML = gateHTML() + "<p>New questions you have never seen, written by the professor on one chapter, checked by a second model, answered with the AI off.</p><div class='ixHchs'>" +
      chs.map((c) => '<button type="button" class="ixHch" data-b="' + E(c) + '"><b>' + E(c.replace(/ · past papers$/, " (papers)")) + "</b></button>").join("") + "</div>";
    wireGate();
    body.querySelectorAll("[data-b]").forEach((b) => (b.onclick = () => {
      const c = b.dataset.b, sample = visible().filter((q) => q.chapter === c).slice(0, 8);
      window.IX_SCREEN_OVERRIDE = { title: "GIT 206 · " + c, eyebrow: "DIG-206", body: "Chapter: " + c + ". Examples of how the past papers ask it (do not copy them):\n" + sample.map((q) => "- " + q.stem).join("\n") };
      close(); window.IX_SCREEN_OVERRIDE = { title: "GIT 206 · " + c, eyebrow: "DIG-206", body: "Chapter: " + c + ". Examples of how the past papers ask it (do not copy them):\n" + sample.map((q) => "- " + q.stem).join("\n") };
      T().openBlind();
    }));
  }

  /* ── the department-style reference answer for a written question (git206-ref.js) ── */
  function topicOf(q) {
    const W = B().written, t = String(q || "").toLowerCase().slice(0, 80);
    const hit = W.find((w) => w.questions.some((x) => x.q.toLowerCase().slice(0, 80) === t || t.includes(x.q.toLowerCase().slice(0, 50))));
    if (hit) return hit.topic;
    const R = window.IX_GIT206_REF || {}, words = new Set(t.match(/[a-z]{5,}/g) || []);
    let best = null, bs = 1;
    Object.entries(R).forEach(([topic, refs]) => { const hay = (topic + " " + refs.map((r) => r.head).join(" ")).toLowerCase(); let n = 0; words.forEach((w) => { if (hay.includes(w)) n++; }); if (n > bs) { bs = n; best = topic; } });
    return best;
  }
  window.IX_REF_FOR = (q) => { const tp = topicOf(q), R = (window.IX_GIT206_REF || {})[tp]; return R && R.length ? R.map((r) => "[" + r.src + "] " + r.head + "\n" + r.text).join("\n\n") : ""; };
  window.IX_TOPIC_OF = topicOf;

  /* ── doors: a button in the side menu and a tab on the screen edge ── */
  function install() {
    if (!document.getElementById("ixHtab")) {
      const t = document.createElement("button"); t.type = "button"; t.id = "ixHtab"; t.className = "ixHtab"; t.textContent = "🫃 GIT 206"; t.onclick = () => open(); document.body.appendChild(t);
    }
    const anchor = document.getElementById("tutorBtn") || document.getElementById("shareProgressBtn");
    if (anchor && !document.getElementById("gitBtn")) {
      const b = anchor.cloneNode(false); b.id = "gitBtn"; b.textContent = "🫃 GIT 206 · MCQs, papers, written"; b.removeAttribute("onclick"); b.onclick = (e) => { e.preventDefault(); open(); };
      anchor.after(b);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
  setTimeout(install, 1500);
  // the exam plan starts rounds and mocks from outside the hub
  function startCustom(title, pred, n) {
    build(); root.classList.add("on");
    if (T() && T().dayState && T().dayState().gate) { tab = "mcq"; render(); return 0; }
    const qs = pick(practicePool().filter(pred), n || 10); if (!qs.length) return 0;
    run = { qs, i: 0, k: 0, cbm: 0, mock: false, title }; showQ(); return qs.length;
  }
  function mockPaper(src) { build(); root.classList.add("on"); tab = "papers"; startMock(src); }
  window.IX_GIT = { open, close, readiness, practicePool, papers: PAPERS, state: st, startCustom, mockPaper, mocked };
})();
