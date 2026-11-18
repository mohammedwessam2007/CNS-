/* INTELLECTUALITY v26 · the exam plan is the home screen (owner, 18 Nov 2026: "the map is not updated, we start from
 * Saturday"). The CNS MCQ is over; from Sat 21 Nov to the CNS written on 12 Jan the app opens on the plan, not on the
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
  const season = () => { const k = iso(new Date()); return !!P() && k >= "2026-11-18" && k <= "2027-01-12"; };
  const active = () => season() && !cnsMode && !(typeof S !== "undefined" && S && S.v16 && S.v16.mock);
  function set(id, html) { const el = document.getElementById(id); if (el && el.innerHTML !== html) el.innerHTML = html; }
  function paint() {
    const root = document.documentElement;
    if (!active()) {
      root.classList.remove("ixXHome");
      const pl = document.getElementById("player");
      if (pl && season() && cnsMode && !pl.querySelector(".ixXBack")) pl.insertAdjacentHTML("afterbegin", '<button type="button" class="ixXBack" data-xhome="plan">📅 Back to the exam plan</button>');
      return;
    }
    root.classList.add("ixXHome");
    const { P: plan, day } = P().today(), k = iso(new Date());
    const ex = P().exams, left = (x) => Math.round((new Date(x.date + "T12:00") - new Date(k + "T12:00")) / 864e5);
    const pre = k < P().START, next = ex.find((x) => x.date >= k) || ex[ex.length - 1];
    const dn = day ? day.steps.filter((x) => P().state().done[x.id] === true).length : 0, tot = day ? day.steps.length : 0;
    set("title", E(pre ? "The plan starts Saturday 21 November" : day && day.exam ? day.exam.name + " today" : day && day.off ? "Day off" : (day && day.title) || "Exam plan"));
    set("eyebrow", E((day ? day.phase : "Exam plan") + " · " + left(next) + " days to " + next.name + " · TODAY " + new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()));
    set("meta", E("Work less, live more · " + plan.mins + " min a day · " + (day && !day.off ? dn + " of " + tot + " steps done" : "nothing due")));
    set("dayText", E(ex.map((x) => x.name + " " + left(x) + "d").join(" · ")));
    set("modeChip", "EXAM SEASON");
    const pl = document.getElementById("player");
    if (pl && !pl.querySelector(":scope > .ixXHomeBox")) {
      pl.innerHTML = '<div class="stage ixXHomeBox"><div class="ixXBody" id="ixXBody"></div><div class="ixXFoot"><button type="button" data-xhome="cns">🧠 Open the CNS course (lessons, atlas, figures)</button><button type="button" data-xhome="git">🫃 GIT 206 hub</button></div></div>';
    }
    const b = document.getElementById("ixXBody"); if (b) P().mount(b);
    // top bar and side rail
    const top = document.getElementById("courseTopbar");
    if (top && !top.querySelector(".ixXTop")) top.insertAdjacentHTML("beforeend", '<span class="ixXTop"></span>');
    const tt = top && top.querySelector(".ixXTop"); if (tt) tt.textContent = "📅 " + (pre ? "Starts Sat 21 Nov" : (day ? day.phase : "")) + " · " + left(next) + "d to " + next.name;
    const rail = document.getElementById("railToday");
    if (rail) {
      let r = rail.querySelector(".ixXRail"); if (!r) { rail.insertAdjacentHTML("beforeend", '<div class="ixXRail"></div>'); r = rail.querySelector(".ixXRail"); }
      const week = plan.days.filter((x) => x.date >= k).slice(0, 8);
      const html = "<b>Next days</b>" + week.map((x) => '<div class="ixXRd' + (x.date === k ? " now" : "") + '"><span>' + E(new Date(x.date + "T12:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })) + "</span>" + E(x.off ? "day off" : x.exam ? "🎯 " + x.exam.name : (x.title || "").replace(/ \(its lectures are still running\)/, "")) + "</div>").join("");
      if (r.innerHTML !== html) r.innerHTML = html;
    }
    document.querySelectorAll(".ixMpRail, .ixMpOpen span").forEach((x) => { const t = x.classList.contains("ixMpRail") ? "📅 Exam plan · from Sat 21 Nov" : "Plan"; if (x.textContent !== t) x.textContent = t; });
  }
  // the map buttons open the exam plan during the season (the old map is still behind "Open the CNS course")
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-xhome], [data-ixmp-open]");
    if (!t) return;
    if (t.dataset.xhome === "cns") { cnsMode = true; document.documentElement.classList.remove("ixXHome"); const pl = document.getElementById("player"); if (pl) pl.innerHTML = ""; if (typeof render === "function") render(); return; }
    if (t.dataset.xhome === "plan") { cnsMode = false; if (typeof render === "function") render(); paint(); return; }
    if (t.dataset.xhome === "git") { window.IX_GIT && IX_GIT.open(); return; }
    if (t.hasAttribute("data-ixmp-open") && active()) { e.preventDefault(); e.stopImmediatePropagation(); P().open(); }
  }, true);
  function boot() {
    if (typeof render !== "function" || !P()) return void setTimeout(boot, 80);
    const base = render;
    window.render = render = function () { const out = active() ? null : base.apply(this, arguments); try { paint(); } catch (e) { console.warn("[home]", e); } return out; };
    let q = false;
    new MutationObserver(() => { if (q || !active()) return; q = true; requestAnimationFrame(() => { q = false; try { const pl = document.getElementById("player"); if (pl && !pl.querySelector(":scope > .ixXHomeBox")) paint(); const tt = document.querySelector("#courseTopbar .ixXTop"); if (!tt) paint(); } catch (e) {} }); })
      .observe(document.body, { childList: true, subtree: true });
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.IX_HOME = { paint, active, cns: (on) => { cnsMode = !!on; if (typeof render === "function") render(); } };
})();
