/* INTELLECTUALITY v26 · the exam plan is the home screen (owner, 18 Nov 2026: "the map is not updated, we start from
 * Saturday"). The CNS MCQ is over; from Sun 22 Nov to the CNS written on 12 Jan the app opens on the plan, not on the
 * old 148-day CNS course. The old course (lessons, atlas, figures) stays one tap away, and is what the CNS written
 * week uses.
 *  - #player shows the plan: countdowns, today's steps with Start and ✓, the readiness, the next 7 days
 *  - the title, eyebrow, meta line, top bar and side rail say where you are in the plan, not "Day 1/148"
 *  - every 🗺️ Map button opens the exam plan
 *  - "Open the CNS course" switches the home to the old course for this visit; "📅 Back to the exam plan" returns */
(function () {
  "use strict";
  if (window.IX_HOME) return;
  const P = () => window.IX_PLAN;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  let cnsMode = false;                               // for this visit only: the old CNS course is the home
  const season = () => !!P() && iso(new Date()) >= "2026-11-18";
  const active = () => season() && !cnsMode;   // v29.2: the CNS MCQ is over (an old CNS mock no longer takes the home); cnsMode is only reachable from code
  function set(id, html) { const el = document.getElementById(id); if (el && el.innerHTML !== html) el.innerHTML = html; }
  // the old CNS course (dated from Mon 21 Sep for the CNS MCQ, which is over) is a date-free lesson library during the
  // season: no "Day 1/148", no "behind", no catch-up banner; its lessons are read for the CNS written
  function library() {
    const ey = document.getElementById("eyebrow"), lab = document.querySelector("#railToday .railLabel");
    const k = iso(new Date()), cw = Math.round((new Date("2027-01-12T12:00") - new Date(k + "T12:00")) / 864e5);
    const t = "CNS LESSON LIBRARY · FOR THE CNS WRITTEN (TUE 12 JAN" + (cw > 0 ? ", " + cw + " DAYS" : "") + ")" + (k < "2026-11-22" ? " · THE PLAN STARTS SUN 22 NOV" : " · TODAY'S STEPS ARE ON THE PLAN");
    if (ey && ey.textContent !== t) ey.textContent = t;
    if (lab && lab.textContent !== "📖 CNS lesson library · no dates, read any lesson") lab.textContent = "📖 CNS lesson library · no dates, read any lesson";
    document.querySelectorAll(".ixMpRail, .ixMpOpen span").forEach((x) => { const t = x.classList.contains("ixMpRail") ? "📅 Exam plan · from Sun 22 Nov" : "Plan"; if (x.textContent !== t) x.textContent = t; });
  }
  function menu() {
    const rt = document.getElementById("railToday"), host = rt && rt.parentElement;
    if (!host) return;
    host.classList.add("ixXRailHost");
    if (host.querySelector(":scope > .ixXMenu")) return;
    const items = [
      ["home", "⌂", "Dashboard"],
      ["map", "▤", "Schedule"],
      ["course", "◫", "Lessons"],
      ["git", "◎", "Question bank"],
      ["hy", "◇", "High-yield sheets"],
      ["lib", "◈", "CNS library"],
      ["tutor", "✧", "Professor"],
      ["life", "◷", "Study settings"],
      ["keypaste", "🔑", "Paste my AI key"],
      ["keycheck", "✓", "Check my AI key"],
      ["theme", "◐", "Light / dark look"],
    ];
    host.insertAdjacentHTML("afterbegin", '<div class="ixXMenu"><div class="ixXMheader"><button type="button" class="ixXMbrand" data-xm="home"><span class="ixXMmark" aria-hidden="true">✦</span><span>Intellectuality<small>EXAM PLAN · DIG 206 + NEU 205</small></span></button><button type="button" class="ixXmRailClose" data-xm="close" aria-label="Close navigation">×</button></div><nav class="ixXMbtns" aria-label="Course navigation">' +
      items.map(([key, icon, label]) => '<button type="button" data-xm="' + key + '"' + (key === "home" ? ' aria-current="page"' : "") + '><span aria-hidden="true">' + icon + '</span>' + label + '</button>').join("") + '</nav></div>');
  }
  // v33: an app tab bar during the season: Today · Course · Questions · Professor · More
  function nav() {
    let n = document.getElementById("ixNav");
    if (!season()) { if (n) n.remove(); return; }
    if (n) return;
    n = document.createElement("nav"); n.id = "ixNav"; n.className = "ixNav"; n.setAttribute("aria-label", "Main");
    n.innerHTML = [["home", "⌂", "Today"], ["course", "◫", "Lessons"], ["git", "◎", "Questions"], ["tutor", "✧", "Professor"], ["more", "☰", "More"]].map((x) => '<button type="button" data-xm="' + x[0] + '"><i aria-hidden="true">' + x[1] + "</i><span>" + x[2] + "</span></button>").join("");
    document.body.appendChild(n);
  }
  function paint() {
    const root = document.documentElement;
    root.classList.toggle("ixXSeason", season()); try { nav(); } catch (e) {}
    if (!active()) {
      root.classList.remove("ixXHome");
      if (season()) library();
      const pl = document.getElementById("player");
      if (pl && season() && cnsMode && !pl.querySelector(".ixXBack")) pl.insertAdjacentHTML("afterbegin", '<button type="button" class="ixXBack" data-xhome="plan">📅 Back to the exam plan (from Sun 22 Nov)</button>');
      return;
    }
    root.classList.add("ixXHome");
    const { P: plan, day } = P().today(), k = iso(new Date());
    const ex = P().exams, left = (x) => Math.round((new Date(x.date + "T12:00") - new Date(k + "T12:00")) / 864e5);
    const pre = k < P().START, next = ex.find((x) => x.date >= k) || ex[ex.length - 1];
    const dn = day ? day.steps.filter((x) => P().state().done[x.id] === true).length : 0, tot = day ? day.steps.length : 0;
    set("title", E(pre ? "The plan starts Sunday 22 November" : day && day.exam ? day.exam.name + " today" : day && day.off ? "Day off" : (day && day.title) || "Exam plan"));
    set("eyebrow", E((day ? day.phase : "Exam plan") + " · " + left(next) + " days to " + next.name + " · TODAY " + new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()));
    set("meta", E("Work less, live more · " + plan.mins + " min a day · " + (day && !day.off ? dn + " of " + tot + " steps done" : "nothing due")));
    set("dayText", E(ex.map((x) => x.name + " " + left(x) + "d").join(" · ")));
    set("modeChip", "EXAM SEASON");
    const pl = document.getElementById("player");
    if (pl && !pl.querySelector(":scope > .ixXHomeBox")) {
      pl.innerHTML = '<div class="ixXHomeBox"><div class="ixXBody" id="ixXBody"></div></div>';
    }
    const b = document.getElementById("ixXBody"); if (b) P().mount(b);
    // top bar and side rail
    const top = document.getElementById("courseTopbar");
    if (top && !top.querySelector(".ixXTop")) top.insertAdjacentHTML("beforeend", '<span class="ixXTop"></span>');
    const tt = top && top.querySelector(".ixXTop"); if (tt) tt.textContent = "📅 " + (pre ? "Starts Sun 22 Nov" : (day ? day.phase : "")) + " · " + left(next) + "d to " + next.name;
    try { menu(); } catch (e) { console.warn("[home menu]", e); }
    document.title = "Intellectuality · EXAM PLAN · DIG 206 + NEU 205";
    document.querySelectorAll(".ixMpRail, .ixMpOpen span").forEach((x) => { const t = x.classList.contains("ixMpRail") ? "📅 Exam plan · from Sun 22 Nov" : "Plan"; if (x.textContent !== t) x.textContent = t; });
  }
  // the map buttons open the exam plan during the season (the old map is still behind "Open the CNS course")
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-xhome], [data-ixmp-open], [data-xday], [data-xm]");
    if (!t) return;
    const toggleRail = window.INTELLECTUALITY_TOGGLE_RAIL;
    const xm = t.dataset.xm || (t.dataset.xhome === "lib" ? "lib" : "");
    if (xm) { e.preventDefault(); if (toggleRail) toggleRail(xm === "more");
      if (xm === "home") { try { window.IX_LESSON && IX_LESSON.close(); window.IX_HY && IX_HY.close(); window.IX_GIT && IX_GIT.close(); window.IX_TUTOR && IX_TUTOR.close(); P().close(); window.IX_SESSION && IX_SESSION.hide(); } catch (er) {} if (cnsMode) { cnsMode = false; if (typeof render === "function") render(); } window.scrollTo({ top: 0, behavior: "instant" }); paint(); }
      else if (xm === "more") {
        const close = document.querySelector(".ixXmRailClose");
        if (close) close.focus({ preventScroll: true });
      }
      else if (xm === "close") document.querySelector("#ixNav [data-xm=more]")?.focus();
      else if (xm === "today") { const n = P().nextStep && P().nextStep(); if (n) P().runStep(n); else P().openDay(P().START > iso(new Date()) ? P().START : iso(new Date())); }
      else if (xm === "map") P().openMap();
      // v44: one screen at a time — a tab closes whatever the other tabs had open
      if (/^(course|git|tutor|hy|lib)$/.test(xm)) { try { if (xm !== "course") { window.IX_LESSON && IX_LESSON.close(); } if (xm !== "git") { window.IX_GIT && IX_GIT.close(); } if (xm !== "hy" && xm !== "lib") { window.IX_HY && IX_HY.close(); } if (xm !== "tutor") { window.IX_TUTOR && IX_TUTOR.close(); } window.IX_KIT && IX_KIT.close(); window.IX_PRACT && IX_PRACT.close(); } catch (er) {} }
      if (xm === "course") window.IX_LESSON && IX_LESSON.index();
      else if (xm === "git") window.IX_GIT && IX_GIT.open();
      else if (xm === "hy") window.IX_HY && IX_HY.list();
      else if (xm === "lib") window.IX_HY && IX_HY.lessons();
      else if (xm === "tutor") window.IX_TUTOR && IX_TUTOR.open();
      else if (xm === "life") window.IX_TUTOR && IX_TUTOR.openLife && IX_TUTOR.openLife();
      else if (xm === "keycheck") window.IX_TUTOR && IX_TUTOR.checkAI();
      else if (xm === "keypaste") window.IX_KEY && IX_KEY.ask().then((r) => { if (r && r.lines && r.lines.length) alert(r.lines.join("\n")); });
      else if (xm === "theme") { let m = "light"; try { m = localStorage.getItem("ix_theme_v1") || "light"; localStorage.setItem("ix_theme_v1", m === "dark" ? "light" : "dark"); } catch (er) {} location.reload(); }
      return; }
    if (t.dataset.xhome === "cns") { cnsMode = true; document.documentElement.classList.remove("ixXHome"); const pl = document.getElementById("player"); if (pl) pl.innerHTML = ""; if (typeof render === "function") render(); return; }
    if (t.dataset.xhome === "plan") { cnsMode = false; if (typeof render === "function") render(); paint(); return; }
    if (t.dataset.xhome === "git") { window.IX_GIT && IX_GIT.open(); return; }
    if (t.dataset.xday) { P().openDay(t.dataset.xday); return; }
    if (t.hasAttribute("data-ixmp-open") && season()) { e.preventDefault(); e.stopImmediatePropagation(); P().openMap(); }
  }, true);
  function boot() {
    if (typeof render !== "function" || !P()) return void setTimeout(boot, 80);
    const base = render;
    window.render = render = function () { const out = active() ? null : base.apply(this, arguments); try { paint(); } catch (e) { console.warn("[home]", e); } return out; };
    let q = false;
    new MutationObserver(() => { if (q || !season()) return; q = true; requestAnimationFrame(() => { q = false; try { if (!active()) return void library(); const pl = document.getElementById("player"); if (pl && !pl.querySelector(":scope > .ixXHomeBox")) paint(); const tt = document.querySelector("#courseTopbar .ixXTop"); if (!tt) paint(); } catch (e) {} }); })
      .observe(document.body, { childList: true, subtree: true });
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.IX_HOME = { paint, active, season, cns: (on) => { cnsMode = !!on; if (typeof render === "function") render(); } };
})();
