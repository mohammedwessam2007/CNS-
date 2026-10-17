/* v18.10 · THE GREAT BOOKS HOUR (owner, 17 Oct 2026: "6 minutes a day ain't gonna do it ... genuinely world class,
   1 hour a day to change my life, integrate it in the full course").
   One sitting a day of a real book, about 50-60 minutes: Notes from Underground, the Apology and Phaedo, the
   Meditations, Thus Spake Zarathustra, Crime and Punishment, The Brothers Karamazov, Anna Karenina, 118 sittings in
   public-domain translations. Each book opens with a guide (who is who, what to watch for, questions to carry) and
   its companion essay; each sitting resumes where you stopped, counts your reading minutes, and ends with three
   things to write: what happened, the line you keep, and one question. Saved in the app state (S.rnLib.hour), so it
   syncs; the place in the page is kept on this device only. Lessons, answers and reviews are never touched. */
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
  const inl = (s) => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
  const today = () => safe(() => window.INTELLECTUALITY_V14.cairoYMD(), null) || new Date().toISOString().slice(0, 10);
  const BOOKS = () => window.RN_BOOKS || [];
  // sittings per book (from scripts/library/build_books.py); the plan is known before any book is downloaded
  const COUNT = { underground: 5, apology: 1, phaedo: 3, meditations: 5, zarathustra: 10, crime: 21, karamazov: 36, anna: 37 };
  const TITLES = { underground: "Notes from Underground", apology: "The Apology of Socrates", phaedo: "Phaedo", meditations: "Meditations", zarathustra: "Thus Spake Zarathustra", crime: "Crime and Punishment", karamazov: "The Brothers Karamazov", anna: "Anna Karenina" };
  const PLAN = () => BOOKS().flatMap((b) => Array.from({ length: COUNT[b.id] || 0 }, (_, i) => b.id + ":" + (i + 1)));
  const cache = {};
  function H() {
    const S0 = typeof S !== "undefined" && S ? S : null;
    if (!S0) return { done: {}, min: {}, notes: {} };
    if (!S0.rnLib || typeof S0.rnLib !== "object") S0.rnLib = {};
    const h = (S0.rnLib.hour = S0.rnLib.hour && typeof S0.rnLib.hour === "object" ? S0.rnLib.hour : {});
    for (const k of ["done", "min", "notes"]) if (!h[k] || typeof h[k] !== "object") h[k] = {};
    return h;
  }
  const persist = () => safe(() => save());
  const book = (id) => { const b = BOOKS().find((x) => x.id === id); return b && Object.assign({ title: TITLES[id] || id }, b); };
  const posKey = "rn_hour_pos_v1";
  const getPos = () => safe(() => JSON.parse(localStorage.getItem(posKey) || "{}"), {}) || {};
  const setPos = (k, v) => safe(() => localStorage.setItem(posKey, JSON.stringify(Object.assign(getPos(), { [k]: v }))));

  // today's sitting: one finished today stays today's; otherwise the first one not yet finished
  function todays() {
    const h = H(),
      t = today(),
      plan = PLAN();
    const doneToday = plan.find((k) => h.done[k] === t);
    if (doneToday) return { key: doneToday, finished: true };
    const next = plan.find((k) => !h.done[k]);
    return next ? { key: next, finished: false } : { key: plan[plan.length - 1], finished: true, all: true };
  }
  const minutesToday = () => Math.round(H().min[today()] || 0);
  function label(key) {
    const [id, n] = key.split(":"),
      b = book(id);
    return { b, n: +n, of: COUNT[id], title: (b && b.title) || id };
  }

  async function load(id) {
    if (cache[id]) return cache[id];
    const r = await fetch("/books/" + id + ".json");
    if (!r.ok) throw new Error("book " + id + " " + r.status);
    return (cache[id] = await r.json());
  }

  function close() {
    document.querySelectorAll(".rhRead").forEach((x) => x.remove());
    document.documentElement.classList.remove("rlOpen");
    clearInterval(timer);
    timer = null;
  }
  let timer = null;
  function startTimer() {
    clearInterval(timer);
    let last = Date.now();
    timer = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible" && document.querySelector(".rhRead")) {
        const h = H(),
          t = today();
        h.min[t] = (h.min[t] || 0) + Math.min(1, (now - last) / 60000);
        const m = document.querySelector(".rhRead .rhMins");
        if (m) m.textContent = minutesToday() + " of 60 min today";
        persist();
      }
      last = now;
    }, 30000);
  }

  function guideHTML(b) {
    const out = [];
    for (const g of b.guide) {
      if (g.startsWith("## ")) out.push("<h3>" + inl(g.slice(3)) + "</h3>");
      else if (g.startsWith("* ")) out.push('<p class="rhPoint">' + inl(g.slice(2)) + "</p>");
      else out.push("<p>" + inl(g) + "</p>");
    }
    return out.join("");
  }

  async function open(key) {
    close();
    key = key || todays().key;
    const { b, n, of } = label(key);
    if (!b) return;
    const o = document.createElement("div");
    o.className = "rlRead rhRead";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", b.title);
    o.innerHTML = '<div class="rlBar"><button type="button" class="rlX" data-rh="close" aria-label="Close">✕</button><div class="rlBarT">THE GREAT BOOKS HOUR · <span class="rhMins">' + minutesToday() + ' of 60 min today</span></div><div class="rlProg"><span></span></div></div><div class="rlScroll"><article class="rlPage"><p class="rlShelf">Loading ' + E(b.title) + "…</p></article></div>";
    document.body.appendChild(o);
    document.documentElement.classList.add("rlOpen");
    const page = o.querySelector(".rlPage"),
      sc = o.querySelector(".rlScroll"),
      bar = o.querySelector(".rlProg span");
    let data;
    try {
      data = await load(b.id);
    } catch (e) {
      page.innerHTML = '<p class="rlShelf">The book could not be loaded. It needs the internet once; after that it is kept on this device.</p><button type="button" class="rlBtn" data-rh="retry">Try again</button>';
      o.onclick = (ev) => (ev.target.closest('[data-rh="close"]') ? close() : ev.target.closest('[data-rh="retry"]') ? open(key) : null);
      return;
    }
    const s = data.sittings[n - 1];
    const h = H(),
      note = h.notes[key] || {};
    const first = n === 1;
    const words = s.words,
      mins = Math.round(words / 190);
    page.innerHTML =
      '<p class="rlShelf">' + E(b.title.toUpperCase()) + " · " + E(data.author) + " · sitting " + n + " of " + of + " · about " + mins + " min</p>" +
      "<h2>" + E(b.title) + "</h2>" +
      '<p class="rlKicker">' + E(data.author) + " (" + E(b.years) + "), translated by " + E(data.translator) + ". Today: " + E(s.from.replace(/ · /g, ", ")) + (s.to && s.to !== s.from ? " → " + E(s.to.replace(/ · /g, ", ")) : "") + "</p>" +
      (first
        ? '<section class="rhGuide"><h3 class="rhGuideH">Before you begin</h3>' + guideHTML(b) + (b.essay ? '<p><button type="button" class="rlBtn ghost" data-rh="essay" data-e="' + E(b.essay) + '">Read the companion essay first (10 min)</button>' + (b.essay2 ? ' <button type="button" class="rlBtn ghost" data-rh="essay" data-e="' + E(b.essay2) + '">…and the second one</button>' : "") + "</p>" : "") + "</section>"
        : '<p class="rhAgain"><button type="button" class="rlBtn ghost" data-rh="guide">The guide to this book (who is who, what to watch for)</button></p><div class="rhGuide" hidden>' + guideHTML(b) + "</div>") +
      '<div class="rhText">' +
      s.body.map((p) => (p.startsWith("## ") ? "<h3>" + E(p.slice(3)) + "</h3>" : "<p>" + E(p) + "</p>")).join("") +
      "</div>" +
      '<section class="rlQs rhEnd"><h3>After today\'s sitting</h3><p class="rlQsLead">Three lines, written from memory. Writing it is what makes it yours.</p>' +
      '<label>What happened, or what was argued, in one sentence<textarea data-rh-note="sum" rows="2">' + E(note.sum || "") + "</textarea></label>" +
      '<label>The line you want to keep (copy it exactly)<textarea data-rh-note="keep" rows="2">' + E(note.keep || "") + "</textarea></label>" +
      "<label>" + E(b.prompts[(n - 1) % b.prompts.length]) + '<textarea data-rh-note="q" rows="3">' + E(note.q || "") + "</textarea></label>" +
      "</section>" +
      '<div class="rlEnd">' +
      (h.done[key] ? '<p class="rlDone">✓ Read on ' + E(h.done[key]) + "</p>" : '<button type="button" class="rlBtn" data-rh="finish">✓ I read today\'s sitting</button>') +
      (n < of || PLAN().indexOf(key) < PLAN().length - 1 ? '<button type="button" class="rlBtn ghost" data-rh="next">Next sitting →</button>' : "") +
      '<button type="button" class="rlBtn ghost" data-rh="shelf">All books</button></div></article>';
    // resume where you stopped
    const pos = getPos()[key];
    if (pos) requestAnimationFrame(() => (sc.scrollTop = pos * (sc.scrollHeight - sc.clientHeight)));
    let st = 0;
    sc.addEventListener(
      "scroll",
      () => {
        const f = sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight);
        bar.style.width = Math.min(100, f * 100) + "%";
        clearTimeout(st);
        st = setTimeout(() => setPos(key, Math.round(f * 1000) / 1000), 600);
      },
      { passive: true },
    );
    o.addEventListener("input", (ev) => {
      const t = ev.target.closest("[data-rh-note]");
      if (!t) return;
      const hh = H();
      hh.notes[key] = Object.assign({}, hh.notes[key], { [t.dataset.rhNote]: t.value.slice(0, 2000) });
      clearTimeout(t._s);
      t._s = setTimeout(persist, 800);
    });
    o.onclick = (ev) => {
      const x = ev.target.closest("[data-rh]");
      if (!x) return;
      const a = x.dataset.rh;
      if (a === "close") close();
      else if (a === "guide") {
        const g = o.querySelector(".rhGuide");
        g.hidden = !g.hidden;
      } else if (a === "essay") safe(() => window.RN_LIBRARY_UI.open(x.dataset.e));
      else if (a === "finish") {
        H().done[key] = today();
        persist();
        setPos(key, 0);
        open(key);
        safe(() => window.RN_LIBRARY_UI.refresh());
      } else if (a === "next") {
        const p = PLAN();
        open(p[p.indexOf(key) + 1]);
      } else if (a === "shelf") shelf();
    };
    document.addEventListener("keydown", onKey);
    startTimer();
  }
  function onKey(e) {
    if (e.key === "Escape" && document.querySelector(".rhRead")) close();
  }

  function shelf() {
    close();
    const h = H(),
      t = todays();
    const o = document.createElement("div");
    o.className = "rlRead rhRead";
    o.setAttribute("role", "dialog");
    const done = Object.keys(h.done).length,
      total = PLAN().length;
    o.innerHTML =
      '<div class="rlBar"><button type="button" class="rlX" data-rh="close" aria-label="Close">✕</button><div class="rlBarT">THE GREAT BOOKS HOUR · ' + done + " of " + total + ' sittings read</div></div><div class="rlScroll"><article class="rlPage rlList"><h2>The books</h2><p class="rlKicker">One sitting a day, about an hour. ' + total + " sittings: about four months of the greatest books ever written.</p>" +
      BOOKS()
        .map((b) => {
          const n = COUNT[b.id] || 0,
            k = Array.from({ length: n }, (_, i) => b.id + ":" + (i + 1)),
            d = k.filter((x) => h.done[x]).length;
          const nextK = k.find((x) => !h.done[x]) || k[0];
          return '<button type="button" class="rlItem' + (d === n ? " done" : "") + '" data-rh-open="' + E(nextK) + '"><span>' + E(b.title) + " <small>· " + E(b.years) + "</small></span><small>" + (d === n ? "✓ finished" : d + " of " + n + " sittings" + (t.key.startsWith(b.id + ":") ? " · today" : "")) + "</small></button>";
        })
        .join("") +
      '<h3>Companion essays</h3><button type="button" class="rlItem" data-rh="essays"><span>Short essays on Nietzsche, Dostoevsky, Tolstoy, Camus, Kafka and more</span><small>10 min each</small></button>' +
      "</article></div>";
    document.body.appendChild(o);
    document.documentElement.classList.add("rlOpen");
    o.onclick = (ev) => {
      const b = ev.target.closest("[data-rh-open]");
      if (b) return open(b.dataset.rhOpen);
      if (ev.target.closest('[data-rh="essays"]')) return (close(), safe(() => window.RN_LIBRARY_UI.shelf()));
      if (ev.target.closest('[data-rh="close"]')) close();
    };
    document.addEventListener("keydown", onKey);
  }

  window.RN_HOUR = { todays, open, shelf, close, label, minutesToday, plan: PLAN, count: () => PLAN().length };
})();
