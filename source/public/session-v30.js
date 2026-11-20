/* INTELLECTUALITY v30.1 · the daily session (owner, 19 Nov 2026: "it ain't organized for daily work, it's not comfortable").
 * One thing at a time, no thinking:
 *  - "▶ Start today's session" opens a calm full screen: step n of m, what to do in plain words, the minutes, one big button
 *  - while the step is open (sheet, quiz, professor, written), a bar stays at the bottom: step n/m · time · ✓ Done · ≡
 *  - ✓ Done ticks the step in the plan and brings the next one; Skip moves it to the end of today; the last step ends the day
 *  - the session survives closing the app: it reopens where it was, the same day */
(function () {
  "use strict";
  if (window.IX_SESSION) return;
  const P = () => window.IX_PLAN;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const KEY = "ix_session_v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
  const keep = (x) => { try { x ? localStorage.setItem(KEY, JSON.stringify(x)) : localStorage.removeItem(KEY); } catch (e) {} };
  const persist = () => { try { if (typeof save === "function") save(); } catch (e) {} };
  // a review with nothing due (no memory cards, no outlines) counts as done, like on the home
  const nothingDue = () => { try { return !(window.IX_TUTOR && IX_TUTOR.dueCards && IX_TUTOR.dueCards().length) && !(window.IX_WRITTEN && IX_WRITTEN.due && IX_WRITTEN.due().length); } catch (e) { return false; } };
  const done = (s) => P().state().done[s.id] === true || (s.kind === "review" && nothingDue());
  const idx = (all, s) => all.findIndex((x) => x.id === s.id);

  // what to do, in plain words, for every kind of step
  const HOW = {
    review: ["The professor shows what is due. Answer each one out loud first, then check.", "Rate yourself honestly. When the list ends, you are done."],
    lesson: ["This lesson replaces the lecture. Read it one part at a time and answer each 🤔 question in your head before you reveal it.", "Stuck on a part? Tap 🤔 Explain it another way. At the end tap ✓ I understand it."],
    learn: ["Read the sheet top to bottom: story → whiteboard → tables → what examiners ask.", "Then tap ▶ Learn it with the professor for the 6 short steps. Draw the whiteboard on paper."],
    mcq: ["10 past-paper questions on this unit.", "Choose how sure you are before you answer. Read every wrong answer's why."],
    blind: ["AI off. New questions, answer from memory only.", "This is the honest check: no hints, no peeking."],
    blindmix: ["AI off. Mixed questions from everything lectured so far.", "Answer from memory only."],
    written: ["Blank page, 15 minutes. Write the answer (type it or photograph your paper).", "Three examiners grade it and show what was missing."],
    notes: ["2 minutes: what did the doctors stress in today's lectures?", "Type or dictate it; the professor uses it."],
    outline: ["3-minute outlines of topics you wrote before: headings and key points only.", "The professor checks what you forgot."],
    mock: ["Full past paper, timed, AI off. Phone on silent.", "Do it in one sitting; the review comes after."],
    wmock: ["Written mock, AI off: likely questions, 45 minutes.", "Then three examiners grade it."],
    weak: ["Your weakest units from the mocks, again.", "Short and focused: only what you got wrong."],
    misses: ["The questions you got wrong before, again.", "Say why the right answer is right."],
    traps: ["The examiners' favourite traps for this module.", "Read each one, then the twin question."],
    week: ["This week's lectured units, mixed, AI off.", "An honest check of the week."],
    sheets: ["Read your sheets once, calmly.", "Rewrite only what was missing."],
    examday: ["The exam-day protocol: sleep, breakfast, what to bring, how to pace.", "Read it once. Then go."],
    cns: ["CNS written: the professor gives the most likely question and its model answer.", "Then you write it from a blank page."],
    spot: ["Spot drill: 6 drawings, name each one, tap to check.", "Then 🎯 Quiz me under any drawing."],
    college: ["At college.", "Tick it when you are back."],
  };
  const how = (s) => HOW[s.kind] || ["Open it and follow the screen.", "Tick ✓ Done when it is finished."];

  function todayDay() { const t = P().today(); return t && t.day; }
  function steps() { const d = todayDay(); return d ? d.steps.filter((s) => s.kind !== "rest") : []; }
  function order() {
    const all = steps(), ss = load(), skip = (ss && ss.date === iso(new Date()) && ss.skip) || [];
    return all.filter((s) => skip.indexOf(s.id) < 0).concat(all.filter((s) => skip.indexOf(s.id) >= 0));
  }
  const current = () => order().find((s) => !done(s) && s.kind !== "college") || null;

  let root = null, bar = null, tick = null;
  function shell() {
    if (root) return;
    root = document.createElement("div"); root.className = "ixS"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Today's session");
    document.body.appendChild(root);
    bar = document.createElement("div"); bar.className = "ixSbar"; document.body.appendChild(bar);
    root.addEventListener("click", onClick); bar.addEventListener("click", onClick);
  }
  const mmss = (sec) => (sec < 0 ? "+" : "") + Math.floor(Math.abs(sec) / 60) + ":" + String(Math.abs(sec) % 60).padStart(2, "0");
  function remaining(ss, s) { if (!ss || !ss.open || ss.open.id !== s.id) return s.min * 60; return Math.round(s.min * 60 - (Date.now() - ss.open.at) / 1000); }

  function screen() {
    shell(); const all = order(), s = current(), ss = load() || {}, n = all.filter(done).length;
    document.documentElement.classList.add("ixSon"); root.classList.add("on"); bar.classList.remove("on");
    if (!s) {
      const P0 = P().build(), k = iso(new Date()), nxt = P0.days.find((x) => x.date > (todayDay() ? todayDay().date : k) && !x.off);
      const mins = all.reduce((t, x) => t + x.min, 0);
      root.innerHTML = '<div class="ixSin ixSdone"><div class="ixSbig">🌿</div><h2>Done for today.</h2><p>' + all.length + " steps, about " + mins + " minutes. Stop here: the rest of the day is yours.</p>" +
        (nxt ? '<div class="ixSnext"><small>Next study day</small><b>' + E(new Date(nxt.date + "T12:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })) + "</b><span>" + E((nxt.title || "").replace(/ \(its lectures are still running\)/, "")) + "</span></div>" : "") +
        '<button type="button" class="ixSmain" data-s="close">Close</button></div>';
      keep(null); confetti(); return;
    }
    const i = idx(all, s), h = how(s), left = remaining(ss, s);
    root.innerHTML = '<div class="ixSin">' +
      '<div class="ixStop"><button type="button" class="ixSx" data-s="close" aria-label="Pause">✕ Pause</button><span>Step ' + (i + 1) + " of " + all.length + "</span></div>" +
      '<div class="ixSdots">' + all.map((x) => '<i class="' + (done(x) ? "d" : x.id === s.id ? "c" : "") + '"></i>').join("") + "</div>" +
      '<div class="ixSmin">' + s.min + " min</div>" +
      '<h2 class="ixStitle">' + E(s.label) + "</h2>" +
      '<ul class="ixShow">' + h.map((x) => "<li>" + E(x) + "</li>").join("") + "</ul>" +
      '<button type="button" class="ixSmain" data-s="open">▶ ' + (ss.open && ss.open.id === s.id ? "Continue" : "Open it") + "</button>" +
      '<div class="ixSrow"><button type="button" data-s="done">✓ It is done</button><button type="button" data-s="skip">Later today</button></div>' +
      '<p class="ixSsmall">' + n + " of " + all.length + " done · Pause any time: it waits here.</p></div>";
  }
  // a short burst of colour when the day is done (once per day)
  function confetti() {
    try {
      const k = "ix_conf_" + iso(new Date()); if (localStorage.getItem(k) || matchMedia("(prefers-reduced-motion: reduce)").matches) return; localStorage.setItem(k, "1");
      const c = document.createElement("div"), col = ["#ffcf5a", "#34e0b4", "#a78bfa", "#ff5d8f", "#22d3ee"]; c.className = "ixConf";
      c.innerHTML = Array.from({ length: 90 }, (_, i) => '<i style="left:' + Math.random() * 100 + "%;background:" + col[i % 5] + ";--x:" + (Math.random() * 160 - 80) + "px;--r:" + Math.random() * 900 + "deg;animation-delay:" + Math.random() * 0.5 + 's"></i>').join("");
      document.body.appendChild(c); setTimeout(() => c.remove(), 3400);
    } catch (e) {}
  }
  function showBar() {
    shell(); const all = order(), s = current(), ss = load();
    if (!s || !ss || !ss.open || ss.date !== iso(new Date())) { bar.classList.remove("on"); document.documentElement.classList.remove("ixSbarOn"); return; }
    const i = idx(all, s), left = remaining(ss, s);
    const html = '<button type="button" class="ixSbI" data-s="screen" aria-label="Back to today\'s session"><small>Step ' + (i + 1) + "/" + all.length + "</small><b>" + E(s.label) + "</b></button>" +
      '<span class="ixSbT' + (left < 0 ? " over" : "") + '">' + mmss(left) + "</span>" + '<button type="button" class="ixSbD" data-s="done">✓ Done</button>';
    if (bar.innerHTML !== html) bar.innerHTML = html;
    bar.classList.add("on"); document.documentElement.classList.add("ixSbarOn");
  }
  function closeOverlays() { try { window.IX_LESSON && IX_LESSON.close(); } catch (e) {} try { window.IX_HY && IX_HY.close(); } catch (e) {} try { window.IX_GIT && IX_GIT.close(); } catch (e) {} try { window.IX_TUTOR && IX_TUTOR.close(); } catch (e) {} try { P().close(); } catch (e) {} try { window.IX_WRITTEN && IX_WRITTEN.close && IX_WRITTEN.close(); } catch (e) {} }
  function hide() { if (root) root.classList.remove("on"); document.documentElement.classList.remove("ixSon"); }
  function onClick(e) {
    const b = e.target.closest("[data-s]"); if (!b) return;
    const a = b.dataset.s, s = current(), k = iso(new Date());
    let ss = load(); if (!ss || ss.date !== k) ss = { date: k, skip: [] };
    if (a === "close") { hide(); keep(ss.open || (ss.skip && ss.skip.length) ? ss : null); repaint(); return; }
    if (a === "screen") { closeOverlays(); screen(); return; }
    if (!s) return screen();
    if (a === "open") { ss.open = { id: s.id, at: ss.open && ss.open.id === s.id ? ss.open.at : Date.now() }; keep(ss); hide(); P().runStep(s); showBar(); return; }
    if (a === "done") { P().state().done[s.id] = true; persist(); ss.open = null; keep(ss); closeOverlays(); screen(); repaint(); return; }
    if (a === "skip") { ss.skip = (ss.skip || []).filter((x) => x !== s.id).concat([s.id]); ss.open = null; keep(ss); screen(); return; }
  }
  function repaint() { try { if (typeof window.render === "function") window.render(); } catch (e) {} try { window.IX_HOME && IX_HOME.paint(); } catch (e) {} }
  function start() { if (!P()) return; const k = iso(new Date()), ss = load(); if (!ss || ss.date !== k) keep({ date: k, skip: [] }); closeOverlays(); screen(); }

  // the home's big ▶ button starts the session (a step's own Start still opens that step alone)
  document.addEventListener("click", (e) => {
    const g = e.target.closest && e.target.closest(".ixZgo, [data-xm='today']");
    if (!g || !P()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    try { if (typeof toggleRail === "function") toggleRail(false); } catch (er) {}
    start();
  }, true);
  // a tick in the plan's own lists keeps the bar honest
  document.addEventListener("change", (e) => { if (e.target.matches && e.target.matches("[data-done]")) setTimeout(showBar, 50); }, true);

  function boot() {
    if (!P() || !document.body) return void setTimeout(boot, 120);
    shell();
    const ss = load(); if (ss && ss.date !== iso(new Date())) keep(null);
    tick = setInterval(() => { try { if (root && root.classList.contains("on")) return; showBar(); } catch (e) {} }, 1000);
    showBar();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.IX_SESSION = { start, screen, current, order, bar: showBar, hide, state: load };
})();
