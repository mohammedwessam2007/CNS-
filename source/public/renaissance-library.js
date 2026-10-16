/* v18.9 · THE LIBRARY — one long reading a day, every day, at any hour (owner, 12 Oct 2026: Renaissance "is so short
   and lacks literature and the juicy stuff … it's like an in-test we made to replace my reading").
   Each reading is 10–15 minutes of real reading: a story told properly, the literature itself (public-domain texts quoted
   in full or at length, with their source), the backstage facts, a close reading, and three questions at the end that you
   answer from memory before you see the answer.
   Content files (renaissance-library-*.js) push readings into window.RN_LIBRARY in order. Authoring format, one string per
   block: "## heading" · "> a line of quoted text" (consecutive lines make one quotation) · "— source" (closes it) ·
   "! a backstage fact" · "* the idea to keep" · anything else is a paragraph (**bold**, *italic*).
   Progress lives in the app's own saved state (S.rnLib), so it syncs like the rest. Opening a reading changes nothing
   else in the app; medicine progress, answers and reviews are never touched. */
(function () {
  "use strict";
  const LIB = (window.RN_LIBRARY = window.RN_LIBRARY || []);
  const safe = (f, d) => {
    try {
      return f();
    } catch (e) {
      return d;
    }
  };
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const inl = (s) => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
  const today = () => safe(() => window.INTELLECTUALITY_V14.cairoYMD(), null) || new Date().toISOString().slice(0, 10);
  const St = () => (typeof S !== "undefined" && S ? S : null);
  function rec() {
    const s = St();
    if (!s) return { done: {}, opened: {}, ans: {} };
    if (!s.rnLib || typeof s.rnLib !== "object") s.rnLib = {};
    for (const k of ["done", "opened", "ans"]) if (!s.rnLib[k] || typeof s.rnLib[k] !== "object") s.rnLib[k] = {};
    return s.rnLib;
  }
  const persist = () => safe(() => save());
  const words = (r) => r.body.join(" ").split(/\s+/).length;
  const minutes = (r) => Math.max(6, Math.round(words(r) / 180)); // literary prose with quotations reads slower than notes

  // today's reading: one you finished today stays today's; otherwise the first one not yet finished
  function todays() {
    const R = rec(),
      t = today();
    const doneToday = LIB.find((r) => R.done[r.id] === t);
    if (doneToday) return { r: doneToday, finished: true };
    const next = LIB.find((r) => !R.done[r.id]);
    return next ? { r: next, finished: false } : { r: LIB[LIB.length - 1] || null, finished: true, all: true };
  }
  const nextAfter = (r) => LIB.find((x, i) => i > LIB.indexOf(r) && !rec().done[x.id]) || null;

  function bodyHTML(r) {
    const out = [];
    let quote = [];
    const flush = (src) => {
      if (!quote.length) return;
      out.push('<blockquote class="rlQuote">' + quote.map((l) => (l.trim() ? '<span dir="auto"' + (/[\u0600-\u06FF]/.test(l) ? ' class="ar" lang="ar"' : "") + ">" + inl(l) + "</span>" : '<span class="gap"></span>')).join("") + (src ? "<cite>" + inl(src) + "</cite>" : "") + "</blockquote>");
      quote = [];
    };
    for (const b of r.body) {
      if (b.startsWith(">")) {
        quote.push(b.replace(/^>\s?/, ""));
        continue;
      }
      if (b.startsWith("— ") && quote.length) {
        flush(b.slice(2));
        continue;
      }
      flush();
      if (b.startsWith("## ")) out.push("<h3>" + inl(b.slice(3)) + "</h3>");
      else if (b.startsWith("! ")) out.push('<div class="rlAside" role="note"><b>Backstage</b>' + inl(b.slice(2)) + "</div>");
      else if (b.startsWith("* ")) out.push('<p class="rlKeep"><b>Keep this</b>' + inl(b.slice(2)) + "</p>");
      else out.push("<p>" + inl(b) + "</p>");
    }
    flush();
    return out.join("");
  }
  function qHTML(r) {
    const A = rec().ans[r.id] || {};
    return (
      '<section class="rlQs"><h3>From memory</h3><p class="rlQsLead">Answer in your head first, then reveal. Recalling it now is what makes it stay.</p>' +
      (r.q || [])
        .map(
          ([q, a], i) =>
            '<div class="rlQ' + (A[i] ? " shown" : "") + '"><p class="rlQq">' + (i + 1) + ". " + inl(q) + '</p><button type="button" class="rlBtn ghost" data-rl="reveal" data-i="' + i + '"' + (A[i] ? " hidden" : "") + '>Reveal the answer</button><p class="rlQa"' + (A[i] ? "" : " hidden") + ">" + inl(a) + "</p></div>",
        )
        .join("") +
      "</section>"
    );
  }

  function open(id) {
    close();
    const R = rec();
    const r = (id && LIB.find((x) => x.id === id)) || (todays() || {}).r;
    if (!r) return;
    if (!R.opened[r.id]) R.opened[r.id] = today();
    persist();
    const n = LIB.indexOf(r) + 1;
    const done = !!R.done[r.id];
    const o = document.createElement("div");
    o.className = "rlRead";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", r.title);
    o.innerHTML =
      '<div class="rlBar"><button type="button" class="rlX" data-rl="close" aria-label="Close">✕</button><div class="rlBarT">THE LIBRARY · ' + n + " of " + LIB.length + " · " + minutes(r) + ' min</div><div class="rlProg"><span></span></div></div>' +
      '<div class="rlScroll"><article class="rlPage">' +
      '<p class="rlShelf">' + E(r.shelf || "") + "</p><h2>" + inl(r.title) + '</h2><p class="rlKicker">' + inl(r.kicker || "") + "</p>" +
      bodyHTML(r) +
      qHTML(r) +
      (r.further ? '<p class="rlFurther"><b>If you want more</b>' + inl(r.further) + "</p>" : "") +
      '<div class="rlEnd">' +
      (done ? '<p class="rlDone">✓ Finished on ' + E(R.done[r.id]) + "</p>" : '<button type="button" class="rlBtn" data-rl="finish">✓ I read it</button>') +
      (nextAfter(r) ? '<button type="button" class="rlBtn ghost" data-rl="next">Next reading →</button>' : "") +
      '<button type="button" class="rlBtn ghost" data-rl="shelf">All readings</button></div>' +
      "</article></div>";
    document.body.appendChild(o);
    document.documentElement.classList.add("rlOpen");
    const sc = o.querySelector(".rlScroll"),
      bar = o.querySelector(".rlProg span");
    sc.addEventListener("scroll", () => (bar.style.width = Math.min(100, (sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight)) * 100) + "%"), { passive: true });
    o.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-rl]");
      if (!b) return;
      const a = b.dataset.rl;
      if (a === "close") close();
      else if (a === "reveal") {
        const i = b.dataset.i,
          A = (rec().ans[r.id] = rec().ans[r.id] || {});
        A[i] = today();
        persist();
        b.hidden = true;
        b.nextElementSibling.hidden = false;
        b.parentElement.classList.add("shown");
      } else if (a === "finish") {
        rec().done[r.id] = today();
        persist();
        open(r.id);
        refreshDoor();
      } else if (a === "next") {
        const nx = nextAfter(r);
        if (nx) open(nx.id);
      } else if (a === "shelf") shelf();
    });
    document.addEventListener("keydown", onKey);
  }
  function shelf() {
    close();
    const R = rec();
    const o = document.createElement("div");
    o.className = "rlRead";
    o.setAttribute("role", "dialog");
    let lastShelf = "";
    o.innerHTML =
      '<div class="rlBar"><button type="button" class="rlX" data-rl="close" aria-label="Close">✕</button><div class="rlBarT">THE LIBRARY · ' + Object.keys(R.done).length + " of " + LIB.length + ' read</div></div><div class="rlScroll"><article class="rlPage rlList"><h2>All readings</h2>' +
      LIB.map((r, i) => {
        const head = r.shelf && r.shelf !== lastShelf ? "<h3>" + E(r.shelf) + "</h3>" : "";
        lastShelf = r.shelf || lastShelf;
        return head + '<button type="button" class="rlItem' + (R.done[r.id] ? " done" : "") + '" data-rl-open="' + E(r.id) + '"><span>' + (i + 1) + ". " + inl(r.title) + "</span><small>" + (R.done[r.id] ? "✓ read " + E(R.done[r.id]) : minutes(r) + " min") + "</small></button>";
      }).join("") +
      "</article></div>";
    document.body.appendChild(o);
    document.documentElement.classList.add("rlOpen");
    o.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-rl-open]");
      if (b) return open(b.dataset.rlOpen);
      if (ev.target.closest('[data-rl="close"]')) close();
    });
    document.addEventListener("keydown", onKey);
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  function close() {
    document.querySelectorAll(".rlRead").forEach((x) => x.remove());
    document.documentElement.classList.remove("rlOpen");
    document.removeEventListener("keydown", onKey);
  }

  // the door: in the side menu, always visible, every day
  function refreshDoor() {
    const b = document.getElementById("rlDoor");
    if (!b || !LIB.length) return;
    const t = todays();
    b.innerHTML = t.all ? "📖 THE LIBRARY · all " + LIB.length + " read" : t.finished ? "📖 TODAY'S READING ✓ · read the next" : "📖 TODAY'S READING · " + minutes(t.r) + " min";
    b.title = t.r ? t.r.title : "";
  }
  function install() {
    if (!LIB.length || document.getElementById("rlDoor")) return refreshDoor();
    const anchor = document.getElementById("cloudBtn");
    if (!anchor) return;
    anchor.insertAdjacentHTML("beforebegin", '<button id="rlDoor" class="wide rlDoor" type="button"></button>');
    document.getElementById("rlDoor").onclick = () => {
      const t = todays();
      if (t.finished && !t.all) {
        const nx = nextAfter(t.r);
        return open(nx ? nx.id : t.r.id);
      }
      open(t.r && t.r.id);
    };
    refreshDoor();
  }
  // v18.9.8 (owner, 16 Oct 2026: "integrate it in the course, each day has its reading, don't ruin the university
  // stuff"): when the day's CNS work is finished, the finished-day screen shows that day's reading as a card. It only
  // reads the app's state; lessons, answers and reviews are never touched, and before the CNS work is done nothing
  // appears in the lesson screen.
  function dayCard() {
    const p = document.getElementById("player");
    if (!p || !LIB.length) return;
    const done = safe(() => typeof nextAction === "function" && nextAction().kind === "STOP", false);
    const have = p.querySelector(".rlDayCard");
    if (!done) return void (have && have.remove());
    if (have) return;
    const t = todays();
    if (!t.r) return;
    p.insertAdjacentHTML(
      "afterbegin",
      '<div class="rlDayCard"><small>TODAY\'S READING · ' + minutes(t.r) + " min" + (t.finished ? " · ✓ read" : "") + "</small><b>" + inl(t.r.title) + "</b><p>" + inl(t.r.kicker || "") + '</p><button type="button" class="rlBtn">' + (t.finished ? "Read it again" : "Open today's reading") + "</button></div>",
    );
    p.querySelector(".rlDayCard button").onclick = () => open(t.r.id);
  }
  let dq = false;
  safe(() =>
    new MutationObserver(() => {
      if (dq) return;
      dq = true;
      requestAnimationFrame(() => ((dq = false), safe(dayCard)));
    }).observe(document.documentElement, { childList: true, subtree: true }),
  );
  window.RN_LIBRARY_UI = { open, shelf, close, todays, count: () => LIB.length, words };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(install, 300));
  else setTimeout(install, 300);
  setTimeout(install, 2000);
})();
