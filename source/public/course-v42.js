/* INTELLECTUALITY v42 · one course, Coursera-style (owner, 22 Nov: "it's so scattered, it's supposed to be like a Coursera
 * experience, all integrated… where are the YouTube lectures and the AI integrated everywhere").
 *  - Course content: the whole road from 22 Nov to 12 Jan as weeks → days → items, each with its type, minutes and a tick;
 *    the current week is open, today is marked, any item opens with one tap. An overall progress bar sits on top.
 *  - Every lesson starts with its lecture video (IX_VIDEOS: real YouTube lectures, checked embeddable), played inside the
 *    lesson; watching is remembered.
 *  - "Ask the professor" is on the course page itself, about today's topic, and inside every video.
 *  - The scattered study tools are gathered into one Toolbox. */
(function () {
  "use strict";
  if (window.IX_COURSE) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const KEY = "ix_course_v42";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const V = () => window.IX_VIDEOS || {};
  const T = () => window.IX_TUTOR;
  const ICON = { review: "🔁", lesson: "📖", learn: "📘", mcq: "✅", blind: "🎯", blindmix: "🎯", week: "🎯", weak: "🎯", traps: "⚠️", written: "📝", outline: "⚡", mock: "🧪", wmock: "🧪", misses: "🔍", cns: "🧠", cnsquick: "⚡", sheets: "📄", examday: "🏁", college: "🏫", pdiagram: "✏️", practical: "🔬", spot: "🎯", rest: "🌿" };
  const TYPE = { review: "Review", lesson: "Lecture + lesson", learn: "Study", mcq: "Quiz", blind: "Knowledge check", blindmix: "Knowledge check", week: "Weekly check", weak: "Weak spots", traps: "Traps", written: "Written assignment", outline: "Recall", mock: "Exam mock", wmock: "Written mock", misses: "Review misses", cns: "CNS written", cnsquick: "CNS outlines", sheets: "Sheets", examday: "Exam day", college: "College", pdiagram: "Diagrams", practical: "Practical", spot: "Spot drill" };
  const nice = (iso, o) => new Date(iso + "T12:00").toLocaleDateString("en-GB", o || { weekday: "short", day: "numeric", month: "short" });

  /* ── the lecture video inside a lesson (click to load: no YouTube traffic until he chooses to watch) ── */
  function videoBlock(lesKey) {
    const vs = V()[lesKey] || []; if (!vs.length) return "";
    const st = load().watched || {};
    return '<section class="ixCv" aria-label="Lecture video"><div class="ixCvHd"><b>▶ The lecture</b><small>' + vs.length + (vs.length > 1 ? " videos" : " video") + " · watch first, then read the lesson below</small></div>" +
      vs.map((v) => '<div class="ixCvItem" data-vid="' + E(v.id) + '"><button type="button" class="ixCvPlay" data-play="' + E(v.id) + '" aria-label="Play ' + E(v.t) + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + E(v.id) + '/hqdefault.jpg"><span class="ixCvBtn" aria-hidden="true">▶</span><span class="ixCvLen">' + E(v.len) + "</span></button>" +
        '<div class="ixCvMeta"><b>' + E(v.t) + "</b><small>" + E(v.ch) + (st[v.id] ? " · ✓ watched" : "") + '</small><button type="button" class="ixCvAsk" data-vask="' + E(v.id) + '">🧠 Ask the professor about this video</button></div></div>').join("") + "</section>";
  }
  function wireVideos(root, les) {
    root.querySelectorAll("[data-play]").forEach((b) => (b.onclick = () => {
      const id = b.dataset.play, s = load(); (s.watched = s.watched || {})[id] = Date.now(); save(s);
      const f = document.createElement("div"); f.className = "ixCvFrame";
      f.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&modestbranding=1" title="Lecture video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';
      b.replaceWith(f);
    }));
    root.querySelectorAll("[data-vask]").forEach((b) => (b.onclick = () => {
      const v = (V()[les.key] || []).find((x) => x.id === b.dataset.vask); if (!v || !T()) return;
      T().open(); T().ask("I just watched \"" + v.t + "\" (" + v.ch + ") for the lesson \"" + les.title + "\". Teach me the 5 things from it that matter for the Kasr Al Ainy exam, connect them to the lesson, and point out anything where the Kasr course differs from the video.", "why", "LESSON: " + les.title);
    }));
  }

  /* ── course content (syllabus) on the home page ── */
  function mount(el, ctx) {
    if (!el || !ctx || !ctx.P) return;
    const { P, done, key, runStep, openDay } = ctx;
    const days = P.days.filter((d) => d.date >= ctx.start);
    const items = (d) => d.steps.filter((s) => s.kind !== "rest" && s.kind !== "college");
    const all = [].concat(...days.map(items)), fin = all.filter(done).length, pct = all.length ? Math.round((100 * fin) / all.length) : 0;
    const weeks = []; days.forEach((d) => { const w = Math.floor((new Date(d.date + "T12:00") - new Date(ctx.start + "T12:00")) / (7 * 864e5)); (weeks[w] = weeks[w] || []).push(d); });
    const curW = Math.max(0, weeks.findIndex((w) => w && w.some((d) => d.date >= key)));
    const st = load(), watched = st.watched || {};
    const row = (d) => {
      const it = items(d), n = it.filter(done).length, today = d.date === key, past = d.date < key;
      const status = d.exam ? "🏁 " + E(d.exam.name) : d.off ? "Day off" : it.length && n === it.length ? "✓ Complete" : today ? "Today" : past && n < it.length ? (n ? n + "/" + it.length : "Not started") : n + "/" + it.length;
      const list = it.map((s) => {
        const les = s.kind === "lesson" && s.key ? V()[s.key] || [] : [];
        const sub = les.length ? '<small class="ixCsub">▶ ' + les.map((v) => E(v.ch) + " · " + E(v.len) + (watched[v.id] ? " ✓" : "")).join(" · ") + "</small>" : "";
        return '<li class="' + (done(s) ? "done" : "") + '"><span class="ixCico" aria-hidden="true">' + (done(s) ? "✓" : ICON[s.kind] || "•") + '</span><div><small>' + E(TYPE[s.kind] || "Study") + (s.min ? " · " + s.min + " min" : "") + "</small><b>" + E(String(s.label).replace(/^[\u{1F300}-\u{1FAFF}☀-➿️\s]+/u, "")) + "</b>" + sub + '</div><button type="button" data-cgo="' + E(s.id) + '" data-cday="' + E(d.date) + '">' + (done(s) ? "Again" : "Open") + "</button></li>";
      }).join("");
      return '<details class="ixCday' + (today ? " today" : "") + (it.length && n === it.length ? " full" : "") + '"' + (today ? " open" : "") + '><summary><time datetime="' + d.date + '">' + E(nice(d.date)) + "</time><span><b>" + E(d.exam ? d.exam.name : d.off ? "Day off" : String(d.title || d.phase).replace(/ \(its lectures are still running\)/g, "")) + "</b><small>" + E(d.phase || "") + "</small></span><em>" + status + "</em></summary>" + (list ? "<ol>" + list + "</ol>" : "") + "</details>";
    };
    const html = '<section class="ixC" aria-labelledby="ixCtitle"><div class="ixCtop"><h2 id="ixCtitle">Course content</h2><span>' + fin + " of " + all.length + ' items · ' + pct + '%</span></div><div class="ixCbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Course progress"><i style="width:' + pct + '%"></i></div>' +
      '<form class="ixCask" data-cask><label for="ixCaskIn">🧠 Ask the professor about anything in today\'s topic</label><div><input id="ixCaskIn" type="text" placeholder="e.g. why is the left testicular vein more prone to varicocele?" autocomplete="off"><button type="submit">Ask</button></div></form>' +
      weeks.map((w, i) => w ? '<details class="ixCweek"' + (i === curW ? " open" : "") + '><summary><b>Week ' + (i + 1) + "</b><span>" + E(nice(w[0].date, { day: "numeric", month: "short" })) + " – " + E(nice(w[w.length - 1].date, { day: "numeric", month: "short" })) + " · " + E(Array.from(new Set(w.map((d) => d.phase).filter(Boolean))).join(" / ")) + "</span><em>" + w.reduce((t, d) => t + items(d).filter(done).length, 0) + "/" + w.reduce((t, d) => t + items(d).length, 0) + "</em></summary>" + w.map(row).join("") + "</details>" : "").join("") +
      '<p class="ixCnote">🔬 The practicals are in February: their plan is added when the date is announced. The Practical room is open any time in the Toolbox.</p></section>';
    const anchor = el.querySelector(".ixQtools"), work = el.querySelector(".ixQwork");
    const sec = document.createElement("div"); sec.innerHTML = html; const node = sec.firstChild;
    if (work) work.after(node); else if (anchor) anchor.before(node); else (el.querySelector(".ixQ") || el).appendChild(node);
    const cal = el.querySelector(".ixQcalendar"); if (cal) cal.hidden = true;   // the syllabus replaces the "coming up" list
    // the scattered tools become one Toolbox
    if (anchor && !anchor.closest("details.ixCtool")) { const d = document.createElement("details"); d.className = "ixCtool"; d.innerHTML = "<summary>🧰 Toolbox: lesson library, question bank, sheets, drawings, flashcards, search, practical room</summary>"; anchor.before(d); d.appendChild(anchor); }
    node.querySelectorAll("[data-cgo]").forEach((b) => (b.onclick = () => { const d = P.days.find((x) => x.date === b.dataset.cday), s = d && d.steps.find((x) => x.id === b.dataset.cgo); if (s && runStep) runStep(s); }));
    const f = node.querySelector("[data-cask]"); if (f) f.onsubmit = (e) => { e.preventDefault(); const q = f.querySelector("input").value.trim(); if (!q || !T()) return; const d = P.days.find((x) => x.date === key); T().open(); T().ask(q, "why", d ? "TODAY'S TOPIC: " + (d.title || d.phase) : ""); f.querySelector("input").value = ""; };
  }
  window.IX_COURSE = { mount, videoBlock, wireVideos, watched: () => load().watched || {} };
})();
