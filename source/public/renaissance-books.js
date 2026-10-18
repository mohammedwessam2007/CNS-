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
  const COUNT = {genealogy: 5, howmuch: 1, ivan: 2, anna: 37, apology: 1, bartleby: 1, bge: 7, camus: 1, cave: 1, crime: 21, enchiridion: 1, hamlet: 3, karamazov: 36, ladydog: 1, meditations: 5, overcoat: 1, phaedo: 3, ridiculous: 1, shortness: 1, symposium: 2, underground: 5, zarathustra: 10};
  const TITLES = { underground: "Notes from Underground", apology: "The Apology of Socrates", phaedo: "Phaedo", meditations: "Meditations", zarathustra: "Thus Spake Zarathustra", crime: "Crime and Punishment", karamazov: "The Brothers Karamazov", anna: "Anna Karenina", enchiridion: "Epictetus: the Enchiridion", shortness: "Seneca: On the Shortness of Life", cave: "Plato: the Cave (Republic VII)", symposium: "Plato: Symposium", ridiculous: "Dostoevsky: The Dream of a Ridiculous Man", overcoat: "Gogol: The Overcoat", ladydog: "Chekhov: The Lady with the Dog", bartleby: "Melville: Bartleby, the Scrivener", hamlet: "Shakespeare: Hamlet", camus: "Camus: the four great works", bge: "Nietzsche: Beyond Good and Evil", ivan: "Tolstoy: The Death of Ivan Ilyich", howmuch: "Tolstoy: How Much Land Does a Man Need?", genealogy: "Nietzsche: On the Genealogy of Morals" };
  // v18.13: which books (or parts) are in the app's own new translations from the originals
  const NEWTR = { underground: "new translation", ridiculous: "new translation", ivan: "new translation", howmuch: "new translation", ladydog: "new translation", overcoat: "new translation", enchiridion: "new translation", meditations: "Books I–VI in a new translation", karamazov: "the reading route in a new translation", zarathustra: "the reading route in a new translation", crime: "the reading route in a new translation" };
  // v18.11: the essential route by default (the sittings that carry the book; bridges sum up the rest); any book
  // can be switched to every chapter (S.rnLib.hour.full[id])
  const fullOf = (id) => !!(H().full || {})[id];
  const sittingsOf = (b) => (b.route && !fullOf(b.id) ? b.route.read.slice() : Array.from({ length: COUNT[b.id] || 0 }, (_, i) => i + 1));
  const PLAN = () => BOOKS().flatMap((b) => sittingsOf(b).map((n) => b.id + ":" + n));
  const cache = {};
  function H() {
    const S0 = typeof S !== "undefined" && S ? S : null;
    if (!S0) return { done: {}, min: {}, notes: {} };
    if (!S0.rnLib || typeof S0.rnLib !== "object") S0.rnLib = {};
    const h = (S0.rnLib.hour = S0.rnLib.hour && typeof S0.rnLib.hour === "object" ? S0.rnLib.hour : {});
    for (const k of ["done", "min", "notes", "rev", "did", "week", "reck"]) if (!h[k] || typeof h[k] !== "object") h[k] = {};
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
    const seq = b ? sittingsOf(b) : [];
    return { b, n: +n, k: seq.indexOf(+n) + 1 || +n, of: seq.length || COUNT[id], title: (b && b.title) || id };
  }

  // v18.13: the protocol around the reading (owner: "add everything so it's 10/10")
  const addDays = (d, n) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 864e5);
  // the streak: days with at least 15 minutes read; today counts once it reaches 15
  function streak() {
    const m = H().min;
    let d = today(), n = 0;
    if ((m[d] || 0) < 15) d = addDays(d, -1);
    while ((m[d] || 0) >= 15) { n++; d = addDays(d, -1); }
    return n;
  }
  // spaced review of the lines you kept (and each finished book's line to know by heart): 1, 3, 7, 21, 60, 180 days
  const INT = [1, 3, 7, 21, 60, 180];
  function memItems() {
    const h = H(), out = [];
    for (const k of Object.keys(h.done)) {
      const keep = ((h.notes[k] || {}).keep || "").trim();
      if (keep.length > 3) out.push({ id: "k:" + k, text: keep, from: label(k), done: h.done[k] });
    }
    for (const b of BOOKS()) {
      const ks = sittingsOf(b).map((m) => b.id + ":" + m);
      if (b.heart && ks.length && ks.every((x) => h.done[x])) out.push({ id: "h:" + b.id, text: b.heart, from: label(ks[ks.length - 1]), done: ks.map((x) => h.done[x]).sort().pop(), heart: true });
    }
    return out;
  }
  function dueLines(max) {
    const h = H(), t = today();
    return memItems()
      .map((it) => Object.assign(it, { due: (h.rev[it.id] && h.rev[it.id].due) || addDays(it.done, 1) }))
      .filter((it) => it.due <= t)
      .sort((a, b) => (a.due < b.due ? -1 : 1))
      .slice(0, max);
  }
  const cue = (s) => { const w = s.split(/\s+/); return w.length > 4 ? w.slice(0, 2).join(" ") + " …" : "…"; };
  // the action from the last sitting you read before today, if you have not said yet whether you did it
  function pendingAction(key) {
    const h = H(), t = today();
    const past = Object.keys(h.done).filter((k) => k !== key && h.done[k] < t && daysBetween(h.done[k], t) <= 3 && !h.did[k]).sort((a, b) => (h.done[a] < h.done[b] ? 1 : -1));
    for (const k of past) {
      const { b, k: kk } = label(k);
      if (b && b.apply) return { key: k, title: b.title, text: b.apply[(kk - 1) % b.apply.length] };
    }
    return null;
  }
  // the weekly review: after five sittings, and then every seven days
  function weekDue() {
    const h = H(), t = today(), last = Object.keys(h.week).sort().pop();
    return Object.keys(h.done).length >= 5 && (!last || daysBetween(last, t) >= 7);
  }
  function warmHTML(key, b, n) {
    const h = H(), out = [];
    const lines = dueLines(2);
    if (lines.length)
      out.push('<section class="rhCard rhMem"><b>Lines to remember · ' + lines.length + " due</b>" + lines.map((it) => '<div class="rhMemItem" data-mem="' + E(it.id) + '"><p class="rhMemQ">From <i>' + E(it.from.title) + "</i>" + (it.from.of > 1 ? ", sitting " + it.from.k : "") + (it.heart ? " (the line to know by heart)" : "") + ': say it from memory, then check.<br><span class="rhCue">' + E(cue(it.text)) + '</span></p><p class="rhMemA" hidden>' + E(it.text) + '</p><p class="rhMemBtns"><button type="button" class="rlBtn ghost" data-rh="memshow">Check</button></p></div>').join("") + "</section>");
    const seq = sittingsOf(b), prev = seq.slice(0, seq.indexOf(n)).reverse().find((m) => h.done[b.id + ":" + m]);
    if (prev && !h.done[key]) {
      const nt = h.notes[b.id + ":" + prev] || {};
      out.push('<section class="rhCard"><b>Before you read: last time</b><p>Without looking, say in one sentence what happened in the last sitting. Then check what you wrote.</p><p class="rhMemA" hidden>' + (nt.sum ? E(nt.sum) : "You wrote nothing last time. Say it now, from memory: that is how it stays.") + (nt.keep ? "<br><i>Your line: " + E(nt.keep) + "</i>" : "") + '</p><p><button type="button" class="rlBtn ghost" data-rh="lastshow">Check</button></p></section>');
    }
    const pa = pendingAction(key);
    if (pa) out.push('<section class="rhCard rhDid" data-did="' + E(pa.key) + '"><b>Your action from ' + E(pa.title) + "</b><p>" + E(pa.text) + '</p><label>What happened? (one line)<textarea data-rh-didnote rows="2"></textarea></label><p><button type="button" class="rlBtn" data-rh="didyes">✓ I did it</button> <button type="button" class="rlBtn ghost" data-rh="didno">Not this time</button></p></section>');
    if (weekDue()) out.push('<section class="rhCard rhWeek"><b>The weekly review · 5 minutes</b><p>Once a week, look back. This is where reading turns into a changed life.</p><label>Which idea from this week changed something you actually did?<textarea data-rh-week="a" rows="2"></textarea></label><label>Which line would you tell a friend, and why?<textarea data-rh-week="b" rows="2"></textarea></label><label>What will you try next week?<textarea data-rh-week="c" rows="2"></textarea></label><p><button type="button" class="rlBtn" data-rh="weeksave">Save this week\'s review</button></p></section>');
    return out.join("");
  }
  function reckHTML(b) {
    const r = H().reck[b.id] || {};
    return '<section class="rlQs rhReck"><h3>The book, in the end</h3>' + (b.threads ? '<p class="rlQsLead"><b>In conversation with the others.</b> ' + E(b.threads) + "</p>" : "") + (b.heart ? '<p class="rhHeart">To know by heart: “' + E(b.heart) + '” It joins your spaced review.</p>' : "") +
      '<label>In one paragraph: what is this book\'s answer to "how should I live?"<textarea data-rh-reck="a" rows="3">' + E(r.a || "") + "</textarea></label>" +
      '<label>Where does it agree, or argue, with a book you read before?<textarea data-rh-reck="b" rows="3">' + E(r.b || "") + "</textarea></label>" +
      '<label>What will you do differently because you read it?<textarea data-rh-reck="c" rows="2">' + E(r.c || "") + "</textarea></label></section>";
  }

  // v18.12: new translations made for this app from the originals replace the old ones sitting by sitting
  const fresh = {};
  async function loadFresh(id) {
    if (id in fresh) return fresh[id];
    try {
      const r = await fetch("/books/" + id + ".fresh.json");
      fresh[id] = r.ok ? await r.json() : null;
    } catch (e) {
      fresh[id] = null;
    }
    return fresh[id];
  }
  const oldTr = {};
  function para(p) {
    if (p.startsWith("## ")) return "<h3>" + E(p.slice(3)) + "</h3>";
    if (p.startsWith(">")) {
      const lines = p.split("\n"),
        src = lines.filter((l) => l.startsWith("—")).join(" ");
      return '<blockquote class="rlQuote">' + lines.filter((l) => l.startsWith(">")).map((l) => "<span>" + E(l.replace(/^>\s?/, "")) + "</span>").join("") + (src ? "<cite>" + E(src.replace(/^—\s*/, "")) + "</cite>" : "") + "</blockquote>";
    }
    return "<p>" + E(p) + "</p>";
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
    const { b, n, k, of } = label(key);
    if (!b) return;
    const o = document.createElement("div");
    o.className = "rlRead rhRead";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", b.title);
    o.innerHTML = '<div class="rlBar"><button type="button" class="rlX" data-rh="close" aria-label="Close">✕</button><div class="rlBarT">THE GREAT BOOKS HOUR · <span class="rhMins">' + minutesToday() + ' of 60 min today</span>' + (streak() ? ' · <span class="rhStreak">' + streak() + (streak() === 1 ? " day" : " days") + " in a row</span>" : "") + '</div><div class="rlProg"><span></span></div></div><div class="rlScroll"><article class="rlPage"><p class="rlShelf">Loading ' + E(b.title) + "…</p></article></div>";
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
    const fr = await loadFresh(b.id),
      frS = fr && fr.sittings && fr.sittings[String(n)];
    const useFresh = !!frS && !oldTr[key];
    const s = useFresh ? Object.assign({}, data.sittings[n - 1], { body: frS.body, words: frS.words }) : data.sittings[n - 1];
    const h = H(),
      note = h.notes[key] || {};
    const first = k === 1;
    const bridge = !fullOf(b.id) && b.route && b.route.bridge && b.route.bridge[n];
    const tail = !fullOf(b.id) && b.route && b.route.tail && b.route.tail[n];
    const words = s.words,
      mins = Math.round(words / 190);
    page.innerHTML =
      '<p class="rlShelf">' + E(b.title.toUpperCase()) + " · " + E(data.author) + " · " + (of > 1 ? "sitting " + k + " of " + of + " · " : "") + "about " + mins + " min" + (b.route && !fullOf(b.id) ? " · essential route" : "") + "</p>" +
      "<h2>" + E(b.title) + "</h2>" +
      '<p class="rlKicker">' + E(data.author) + " (" + E(b.years) + "), " + (/^a new translation/.test(useFresh ? fr.translator : data.translator) ? "in " + E(useFresh ? fr.translator : data.translator) : "translated by " + E(data.translator)) + ". Today: " + (s.from ? E(s.from.replace(/ · /g, ", ")) + (s.to && s.to !== s.from ? " → " + E(s.to.replace(/ · /g, ", ")) : "") : "the whole book") + "</p>" +
      warmHTML(key, b, n) +
      (first
        ? '<section class="rhGuide"><h3 class="rhGuideH">Before you begin</h3>' + guideHTML(b) + (b.threads ? "<h3>In conversation with the others</h3><p>" + E(b.threads) + "</p>" : "") + (b.essay ? '<p><button type="button" class="rlBtn ghost" data-rh="essay" data-e="' + E(b.essay) + '">Read the companion essay first (10 min)</button>' + (b.essay2 ? ' <button type="button" class="rlBtn ghost" data-rh="essay" data-e="' + E(b.essay2) + '">…and the second one</button>' : "") + "</p>" : "") + "</section>"
        : '<p class="rhAgain"><button type="button" class="rlBtn ghost" data-rh="guide">The guide to this book (who is who, what to watch for)</button></p><div class="rhGuide" hidden>' + guideHTML(b) + "</div>") +
      (bridge ? '<aside class="rhBridge" role="note"><b>What happened in the chapters between</b><p>' + E(bridge) + '</p><button type="button" class="rlBtn ghost" data-rh="full">Read every chapter of this book instead</button></aside>' : "") +
      (frS ? '<p class="rhTrNote">' + (useFresh ? "New translation, made for this app from the " + E(fr.language || "Russian") + ' original. <a href="#" data-rh="oldtr">Show the old translation (' + E(data.translator) + ")</a>" : "Old translation (" + E(data.translator) + '). <a href="#" data-rh="oldtr">Back to the new translation</a>') + "</p>" : /^a new translation/.test(data.translator || "") ? '<p class="rhTrNote">New translation, made for this app from the Russian original.</p>' : "") +
      '<div class="rhText' + (data.verse ? " rhVerse" : "") + '">' +
      s.body.map(para).join("") +
      "</div>" +
      (tail ? '<aside class="rhBridge" role="note"><b>The rest of the book, in brief</b><p>' + E(tail) + "</p></aside>" : "") +
      (b.apply ? '<aside class="rhApply" role="note"><b>Use it today</b><p>' + E(b.apply[(k - 1) % b.apply.length]) + "</p></aside>" : "") +
      '<section class="rlQs rhEnd"><h3>After today\'s sitting</h3><p class="rlQsLead">Three lines, written from memory. Writing it is what makes it yours.</p>' +
      '<label>What happened, or what was argued, in one sentence<textarea data-rh-note="sum" rows="2">' + E(note.sum || "") + "</textarea></label>" +
      '<label>The line you want to keep (copy it exactly)<textarea data-rh-note="keep" rows="2">' + E(note.keep || "") + "</textarea></label>" +
      "<label>" + E(b.prompts[(n - 1) % b.prompts.length]) + '<textarea data-rh-note="q" rows="3">' + E(note.q || "") + "</textarea></label>" +
      "</section>" +
      (k === of ? reckHTML(b) : "") +
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
      const rk = ev.target.closest("[data-rh-reck]");
      if (rk) {
        const hh = H();
        hh.reck[b.id] = Object.assign({}, hh.reck[b.id], { [rk.dataset.rhReck]: rk.value.slice(0, 3000), d: today() });
        clearTimeout(rk._s);
        rk._s = setTimeout(persist, 800);
        return;
      }
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
      else if (a === "memshow") {
        const it = x.closest(".rhMemItem");
        it.querySelector(".rhMemA").hidden = false;
        it.querySelector(".rhMemBtns").innerHTML = '<button type="button" class="rlBtn" data-rh="memyes">I had it</button> <button type="button" class="rlBtn ghost" data-rh="memno">Not yet</button>';
      } else if (a === "memyes" || a === "memno") {
        const it = x.closest(".rhMemItem"), id = it.dataset.mem, hh = H();
        const s = a === "memyes" ? Math.min(INT.length - 1, (hh.rev[id] ? hh.rev[id].s : 0) + 1) : 0;
        hh.rev[id] = { s, due: addDays(today(), a === "memyes" ? INT[s] : 1), last: today() };
        persist();
        it.innerHTML = '<p class="rhMemDone">' + (a === "memyes" ? "✓ Next time in " + INT[s] + (INT[s] === 1 ? " day." : " days.") : "It comes back tomorrow.") + "</p>";
      } else if (a === "lastshow") {
        x.closest(".rhCard").querySelector(".rhMemA").hidden = false;
        x.remove();
      } else if (a === "didyes" || a === "didno") {
        const c = x.closest(".rhDid"), hh = H();
        hh.did[c.dataset.did] = { d: today(), ok: a === "didyes", t: (c.querySelector("[data-rh-didnote]").value || "").slice(0, 1000) };
        persist();
        c.innerHTML = "<b>Your action</b><p>" + (a === "didyes" ? "✓ Saved. That is the reading turning into a life." : "Saved. Try today's action instead.") + "</p>";
      } else if (a === "weeksave") {
        const c = x.closest(".rhWeek"), hh = H(), r = { d: today() };
        c.querySelectorAll("[data-rh-week]").forEach((q) => (r[q.dataset.rhWeek] = q.value.slice(0, 2000)));
        hh.week[today()] = r;
        persist();
        c.innerHTML = "<b>The weekly review</b><p>✓ Saved. The next one is in seven days. All your reviews are in All books → Your commonplace book.</p>";
      }
      else if (a === "guide") {
        const g = o.querySelector(".rhGuide");
        g.hidden = !g.hidden;
      } else if (a === "essay") safe(() => window.RN_LIBRARY_UI.open(x.dataset.e));
      else if (a === "oldtr") {
        ev.preventDefault();
        oldTr[key] = !oldTr[key];
        open(key);
      } else if (a === "full") {
        const hh = H(),
          read = (b.route && b.route.read) || [];
        hh.full = Object.assign({}, hh.full, { [b.id]: true });
        persist();
        // open the first of the chapters this bridge was summing up
        let m = n;
        while (m > 1 && !read.includes(m - 1)) m--;
        open(b.id + ":" + m);
      }
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
      '<div class="rlBar"><button type="button" class="rlX" data-rh="close" aria-label="Close">✕</button><div class="rlBarT">THE GREAT BOOKS HOUR · ' + done + " of " + total + ' sittings read</div></div><div class="rlScroll"><article class="rlPage rlList"><h2>The books</h2><p class="rlKicker">One sitting a day, about an hour. ' + total + " sittings on the essential route: the chapters that carry each book, with short bridges between. Any long book can be switched to every chapter.</p>" +
      BOOKS()
        .map((b0) => {
          const b = book(b0.id),
            k = sittingsOf(b).map((m) => b.id + ":" + m),
            n = k.length,
            d = k.filter((x) => h.done[x]).length;
          const nextK = k.find((x) => !h.done[x]) || k[0];
          const mode = b.route ? '<small class="rhMode">' + (fullOf(b.id) ? "every chapter · " : "essential route · ") + '<a href="#" data-rh-mode="' + E(b.id) + '">' + (fullOf(b.id) ? "switch to the essential route" : "switch to every chapter") + "</a></small>" : "";
          return '<div class="rhShelfRow"><button type="button" class="rlItem' + (d === n ? " done" : "") + '" data-rh-open="' + E(nextK) + '"><span>' + E(b.title) + " <small>· " + E(b.years) + (NEWTR[b.id] ? " · " + E(NEWTR[b.id]) : "") + "</small></span><small>" + (d === n ? "✓ finished" : d + " of " + n + (n === 1 ? " sitting" : " sittings") + (t.key.startsWith(b.id + ":") ? " · today" : "")) + "</small></button>" + mode + "</div>";
        })
        .join("") +
      '<h3>Your reading life</h3><p class="rhStats">' + statsLine() + '</p><p class="rlKicker">The rule: an hour when you can, fifteen minutes when you can\'t, and never miss two days in a row.</p><button type="button" class="rlItem" data-rh="commonplace"><span>Your commonplace book</span><small>all you kept</small></button>' +
      '<h3>Companion essays</h3><button type="button" class="rlItem" data-rh="essays"><span>Short essays on Nietzsche, Dostoevsky, Tolstoy, Camus, Kafka and more</span><small>10 min each</small></button>' +
      "</article></div>";
    document.body.appendChild(o);
    document.documentElement.classList.add("rlOpen");
    o.onclick = (ev) => {
      const md = ev.target.closest("[data-rh-mode]");
      if (md) {
        ev.preventDefault();
        const hh = H(),
          id = md.dataset.rhMode;
        hh.full = Object.assign({}, hh.full, { [id]: !fullOf(id) });
        persist();
        return shelf();
      }
      const b = ev.target.closest("[data-rh-open]");
      if (b) return open(b.dataset.rhOpen);
      if (ev.target.closest('[data-rh="commonplace"]')) return commonplace();
      if (ev.target.closest('[data-rh="essays"]')) return (close(), safe(() => window.RN_LIBRARY_UI.shelf()));
      if (ev.target.closest('[data-rh="close"]')) close();
    };
    document.addEventListener("keydown", onKey);
  }

  function statsLine() {
    const h = H(),
      mins = Object.values(h.min).reduce((a, x) => a + (+x || 0), 0),
      kept = memItems().filter((x) => !x.heart).length,
      did = Object.values(h.did).filter((x) => x && x.ok).length;
    return Math.floor(mins / 60) + " h " + Math.round(mins % 60) + " min read · " + streak() + "-day streak · " + kept + (kept === 1 ? " line" : " lines") + " kept · " + did + (did === 1 ? " action" : " actions") + " done · " + Object.keys(h.week).length + " weekly " + (Object.keys(h.week).length === 1 ? "review" : "reviews");
  }
  // the commonplace book: what you kept from every book, in reading order, with your weekly reviews
  function commonplace() {
    close();
    const h = H();
    const o = document.createElement("div");
    o.className = "rlRead rhRead";
    o.setAttribute("role", "dialog");
    const parts = BOOKS().map((b0) => {
      const b = book(b0.id),
        ks = sittingsOf(b).map((m) => b.id + ":" + m).filter((k) => h.done[k] || (h.notes[k] && (h.notes[k].keep || h.notes[k].sum || h.notes[k].q)));
      const r = h.reck[b.id];
      if (!ks.length && !r) return "";
      return "<h3>" + E(b.title) + "</h3>" + ks.map((k) => { const nt = h.notes[k] || {}, L = label(k); return '<div class="rhCp">' + (L.of > 1 ? "<small>Sitting " + L.k + "</small>" : "") + (nt.keep ? "<blockquote>" + E(nt.keep) + "</blockquote>" : "") + (nt.sum ? "<p>" + E(nt.sum) + "</p>" : "") + (nt.q ? "<p><i>" + E(nt.q) + "</i></p>" : "") + (h.did[k] && h.did[k].t ? "<p>Action: " + E(h.did[k].t) + "</p>" : "") + "</div>"; }).join("") + (r ? '<div class="rhCp rhCpR"><small>Your verdict</small>' + ["a", "b", "c"].filter((x) => r[x]).map((x) => "<p>" + E(r[x]) + "</p>").join("") + "</div>" : "");
    }).join("");
    const weeks = Object.keys(h.week).sort().reverse().map((d) => { const w = h.week[d]; return '<div class="rhCp"><small>Week of ' + E(d) + "</small>" + ["a", "b", "c"].filter((x) => w[x]).map((x) => "<p>" + E(w[x]) + "</p>").join("") + "</div>"; }).join("");
    o.innerHTML = '<div class="rlBar"><button type="button" class="rlX" data-rh="close" aria-label="Close">✕</button><div class="rlBarT">YOUR COMMONPLACE BOOK</div></div><div class="rlScroll"><article class="rlPage rlList"><h2>Your commonplace book</h2><p class="rlKicker">' + statsLine() + "</p>" + (parts || '<p class="rlShelf">Nothing yet. After each sitting, the line you keep is written here.</p>') + (weeks ? "<h3>Weekly reviews</h3>" + weeks : "") + '<div class="rlEnd"><button type="button" class="rlBtn ghost" data-rh="copycp">Copy it all</button><button type="button" class="rlBtn ghost" data-rh="shelf">All books</button></div></article></div>';
    document.body.appendChild(o);
    document.documentElement.classList.add("rlOpen");
    o.onclick = (ev) => {
      const x = ev.target.closest("[data-rh]");
      if (!x) return;
      if (x.dataset.rh === "close") close();
      else if (x.dataset.rh === "shelf") shelf();
      else if (x.dataset.rh === "copycp") {
        const txt = o.querySelector(".rlPage").innerText;
        safe(() => navigator.clipboard.writeText(txt).then(() => (x.textContent = "✓ Copied")));
      }
    };
    document.addEventListener("keydown", onKey);
  }

  window.RN_HOUR = { todays, open, shelf, close, label, minutesToday, plan: PLAN, count: () => PLAN().length, streak, dueLines, commonplace };
})();
