/* v18.8.3 — "Share my progress with Claude" (owner's request, 12 Oct 2026).
   A button in the side menu builds a short, readable summary of the progress on this device (where you are, what is
   done, the MCQs answered, and the questions you got wrong and will see again) to copy and paste to Claude, and can
   save the full progress file to attach. Read-only: nothing on the device or in the cloud is changed. The sync code
   is kept in its own storage key and is never part of the summary or the file. */
(function () {
  "use strict";
  const safe = (f, d) => {
    try {
      return f();
    } catch (e) {
      return d;
    }
  };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function summary() {
    const St = typeof S !== "undefined" && S ? S : {},
      days = (typeof C !== "undefined" && C && C.days) || [],
      v16 = (St.v16 && St.v16.q) || {},
      QB = new Map(((window.EHSAN_QBANK && EHSAN_QBANK.questions) || []).map((q) => [q.id, q]));
    const d = safe(() => day(), null),
      cur = safe(() => currentLessonSegment(), null);
    const seg = St.segments || {};
    let lessons = 0,
      lessonsDone = 0;
    const doneTopics = [];
    for (const dd of days)
      for (const l of dd.lessons || []) {
        lessons++;
        const n = (l.segments || []).length,
          k = (l.segments || []).filter((_, i) => seg[safe(() => segmentKey(dd, l, i), "")]).length;
        if (n && k === n) {
          lessonsDone++;
          doneTopics.push(l.topic);
        }
      }
    const recs = Object.entries(v16);
    const wrongNow = recs.filter(([, r]) => r && r.r === "w");
    const everWrong = recs.filter(([, r]) => r && (r.lp || 0) > 0);
    // the review clock is the plan day of today's real date (as mcq-v16.js counts it)
    const ymd = safe(() => window.INTELLECTUALITY_V14.cairoYMD(), null) || new Date().toISOString().slice(0, 10);
    let today = 1;
    for (const x of days) {
      if (x.date <= ymd) today = x.day;
      else break;
    }
    const due = recs.filter(([, r]) => r && r.d <= today).length;
    const L = [];
    L.push("INTELLECTUALITY CNS — my progress (for Claude)");
    L.push("Made: " + new Date().toISOString().slice(0, 16).replace("T", " ") + " · app " + (document.title.match(/v[\d.]+/) || [""])[0]);
    if (d) L.push("Plan day: " + d.day + " (" + d.date + ")" + (d.title ? " · " + d.title : ""));
    if (cur) L.push("Now on: " + cur.l.topic + " (" + cur.l.id + ") · step " + (cur.si + 1) + " of " + cur.l.segments.length + " · " + cur.seg.type);
    else L.push("Now on: no lesson step open (MCQ round, review or the day is finished)");
    L.push("Lessons fully done: " + lessonsDone + " of " + lessons + " · days marked done: " + ((St.doneDays || []).length || 0) + " · XP " + (St.xp || 0));
    if (doneTopics.length) L.push("Last lessons done: " + doneTopics.slice(-6).join(" · "));
    L.push("Past-paper MCQs answered: " + recs.length + " · wrong last time: " + wrongNow.length + " · ever wrong: " + everWrong.length + " · due for review now: " + due);
    L.push("Mocks taken: " + (((St.v16 && St.v16.mocks) || []).length || 0));
    const taps = (St.v14 && St.v14.tapLog) || [];
    if (taps.length) {
      L.push("Step buttons that needed the backup (last " + taps.length + "):");
      for (const t of taps.slice(-8)) L.push("- " + t.at.slice(5, 16).replace("T", " ") + " " + t.app + " " + t.act + " " + t.key + " via " + t.via + (t.err ? " · error: " + t.err : "") + (t.fixed ? " · moved on" : ""));
    }
    const sl = Array.isArray(St.storageLog) ? St.storageLog : [];
    if (sl.length) {
      L.push("Phone storage events (last " + Math.min(6, sl.length) + "):");
      for (const t of sl.slice(-6)) L.push("- " + String(t.at).slice(5, 16).replace("T", " ") + " " + t.what);
    }
    if (wrongNow.length) {
      L.push("");
      L.push("Questions I got wrong (they come back for review):");
      for (const [id, r] of wrongNow.slice(0, 80)) {
        const q = QB.get(id);
        L.push("- " + id + (q ? " · " + String(q.stem).replace(/\s+/g, " ").slice(0, 70) : "") + " · missed " + (r.lp || 1) + "×");
      }
      if (wrongNow.length > 80) L.push("… and " + (wrongNow.length - 80) + " more (in the full file)");
    }
    return L.join("\n");
  }

  function fullFile() {
    // the progress object only (S); the sync code lives under its own key and is not read here
    const St = safe(() => JSON.parse(localStorage.getItem("intellectuality_v41_launch_state") || "null"), null) || (typeof S !== "undefined" ? S : {});
    const blob = new Blob([JSON.stringify({ kind: "intellectuality-progress", made: new Date().toISOString(), state: St })], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "intellectuality-progress-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1500);
  }

  // v18.14.2: the other way. A progress file saved on one copy of the app (another address, another device) is
  // loaded here; this device's progress is kept aside first, under its own key, so nothing is lost.
  const KEY = "intellectuality_v41_launch_state",
    KEPT = "intellectuality_v41_launch_state_backup_before_import";
  function loadFile(btn) {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "application/json,.json";
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        const j = safe(() => JSON.parse(String(rd.result)), null);
        const st = j && j.kind === "intellectuality-progress" && j.state && typeof j.state === "object" ? j.state : null;
        if (!st || Array.isArray(st)) {
          btn.textContent = "✕ Not a progress file";
          return;
        }
        const when = safe(() => new Date(j.made).toLocaleString(), "an unknown date");
        if (!confirm("Load the progress saved on " + when + "?\n\nIt replaces the progress on this device. This device's progress is kept as a backup.")) return;
        const cur = safe(() => localStorage.getItem(KEY), null);
        safe(() => cur && localStorage.setItem(KEPT, cur));
        try {
          localStorage.setItem(KEY, JSON.stringify(st));
        } catch (e) {
          btn.textContent = "✕ This device is out of space";
          return;
        }
        // the page is about to restart: nothing may write the old progress back on the way out
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function (k, v) {
          if (this === window.localStorage && k === KEY) return;
          return set.apply(this, arguments);
        };
        btn.textContent = "✓ Loaded, restarting…";
        setTimeout(() => location.reload(), 300);
      };
      rd.readAsText(f);
    };
    inp.click();
  }

  function open() {
    close();
    const text = safe(summary, "The summary could not be built on this device.");
    const o = document.createElement("div");
    o.className = "ixShare";
    o.setAttribute("role", "dialog");
    o.innerHTML =
      '<div class="ixShareBox"><div class="ixShareHd"><b>Share my progress with Claude</b><button type="button" data-ixs="close" aria-label="Close">✕</button></div>' +
      '<p class="ixShareP">Copy this and paste it to Claude in the chat. It shows where you are and the questions you got wrong. It does not change anything, and your sync code is not in it.</p>' +
      '<textarea class="ixShareT" readonly>' + E(text) + "</textarea>" +
      '<div class="ixShareRow"><button type="button" class="primary" data-ixs="copy">📋 Copy</button><button type="button" data-ixs="file">💾 Save full progress file</button><button type="button" data-ixs="load">📥 Load a progress file</button></div>' +
      '<p class="ixShareP small">The file has everything (every answer); attach it in the chat if Claude asks for more detail. To move your progress to another copy of the app, save the file here and load it there.</p></div>';
    document.body.appendChild(o);
    o.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-ixs]");
      if (!b) {
        if (ev.target === o) close();
        return;
      }
      const a = b.dataset.ixs;
      if (a === "close") close();
      else if (a === "file") safe(fullFile);
      else if (a === "load") safe(() => loadFile(b));
      else if (a === "copy") {
        const t = o.querySelector(".ixShareT");
        const done = () => (b.textContent = "✓ Copied");
        const fallback = () => {
          t.focus();
          t.select();
          safe(() => document.execCommand("copy"));
          done();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(done, fallback);
        else fallback();
      }
    });
  }
  function close() {
    document.querySelectorAll(".ixShare").forEach((x) => x.remove());
  }

  function install() {
    if (document.getElementById("shareProgressBtn")) return;
    const anchor = document.getElementById("cloudBtn");
    if (!anchor) return;
    anchor.insertAdjacentHTML("afterend", '<button id="shareProgressBtn" class="ghost wide" style="margin-top:8px">📤 SHARE MY PROGRESS WITH CLAUDE</button>');
    document.getElementById("shareProgressBtn").onclick = open;
  }
  window.INTELLECTUALITY_SHARE = { summary, open, loadFile };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 1500);
})();
