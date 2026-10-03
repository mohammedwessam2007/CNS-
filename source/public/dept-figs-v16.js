/* INTELLECTUALITY v16.2 · DEPARTMENT DRAWINGS (private to the owner)
 * The department's own line drawings of the neck (cervical fascia, great vessels, glands, cranial
 * nerves IX–XII) and, since v18.5, the figures of the Kasr Al Ainy NEU 205 book (neuroanatomy, head and
 * neck, ear, embryology, and the physiology chapters) are shown in the LEARN section they belong to and
 * after an answer on that topic. Since v18.7 the set also holds Dr Sameh Doss's labelled drawings (head, neck and
 * neuroanatomy; 490 drawings cut from his notebook pages): each is in the lesson section it teaches AND is picked,
 * by its caption against the question and its explanation, for the answers it explains. Where a section has
 * official drawings they come first (best match first) and the section's web photo folds behind a tap: still there,
 * no longer in the way.
 * The site is public, so the drawings are shipped ENCRYPTED (AES-256-GCM, dept/<id>.bin). The key
 * reaches the owner's app once, through a link (#ixk=<kid>.<key>), or pasted in the app from the lock line
 * shown where drawings belong; it is kept on the device and in
 * the synced learner state, which only the owner's sync code can read. Without the key nothing is
 * shown and nothing is decryptable.
 */
(function () {
  "use strict";
  const D = window.INTELLECTUALITY_DEPT_FIGS;
  // v18.6: the owner removed the lock; a plain manifest serves ordinary JPEGs (dept/<id>.jpg) with no key
  const PLAIN = !!(D && D.plain);
  if (!D || !Array.isArray(D.figs) || !(PLAIN || (window.crypto && crypto.subtle))) return;
  const LS = "intellectuality_dept_keys_v1";
  const E = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const bytes = (b64) => {
    const s = String(b64).replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(s + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
  };
  const state = () => (typeof S !== "undefined" && S && typeof S === "object" ? S : null);
  const safe = (f, d) => {
    try {
      return f();
    } catch (_) {
      return d;
    }
  };

  /* ───────── keys: device copy + synced copy (merged both ways) ───────── */
  function keys() {
    const dev = safe(() => JSON.parse(localStorage.getItem(LS) || "{}"), {}) || {},
      st = state(),
      syn = st && st.ixDeptKeys && typeof st.ixDeptKeys === "object" ? st.ixDeptKeys : {},
      all = Object.assign({}, syn, dev);
    if (st && Object.keys(all).some((k) => syn[k] !== all[k])) {
      st.ixDeptKeys = all;
      safe(() => typeof save === "function" && save());
    }
    if (Object.keys(all).some((k) => dev[k] !== all[k])) safe(() => localStorage.setItem(LS, JSON.stringify(all)));
    return all;
  }
  const CK = new Map();
  function cryptoKey(kid) {
    const k = keys()[kid];
    if (!k) return null;
    if (!CK.has(kid)) CK.set(kid, crypto.subtle.importKey("raw", bytes(k), "AES-GCM", false, ["decrypt"]));
    return CK.get(kid);
  }
  async function unseal(buf, kid = D.kid) {
    const k = await cryptoKey(kid);
    if (!k) throw new Error("locked");
    const u = new Uint8Array(buf);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, k, u.slice(12));
  }
  const unlocked = () => PLAIN || !!keys()[D.kid];

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "ixDeptToast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 6000);
  }
  const KEY_RE = /(?:^|[#&\s])ixk=(k\d+)\.([A-Za-z0-9_-]{43})(?![A-Za-z0-9_-])/;
  // one-time link: #ixk=<kid>.<base64url key>. The fragment never reaches a server; it is removed at once.
  async function capture() {
    const m = KEY_RE.exec(location.hash || "");
    if (!m) return;
    safe(() => history.replaceState(null, "", location.pathname + location.search));
    await accept(m[1], m[2]);
  }
  // the same link pasted inside the app (a Home Screen app on iPad keeps its own storage, apart from Safari)
  async function paste() {
    const t = safe(() => window.prompt("Paste the department-drawings link you were sent:"), null);
    if (!t) return;
    const m = KEY_RE.exec(" " + String(t).trim()) || /^()(k\d+)\.([A-Za-z0-9_-]{43})$/.exec(String(t).trim())?.slice(1);
    if (!m) return toast("That is not a drawings link. Nothing was changed.");
    await accept(m[1], m[2]);
  }
  async function accept(kid, k64) {
    let ok = kid !== D.kid; // a key for a later drawing set is stored as given
    if (!ok)
      ok = await crypto.subtle
        .importKey("raw", bytes(k64), "AES-GCM", false, ["decrypt"])
        .then((k) => crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(D.probe).slice(0, 12) }, k, bytes(D.probe).slice(12)))
        .then((b) => new TextDecoder().decode(b) === "intellectuality-dept-ok")
        .catch(() => false);
    if (!ok) return toast("That drawings link is not valid. Nothing was changed.");
    const dev = safe(() => JSON.parse(localStorage.getItem(LS) || "{}"), {}) || {};
    dev[kid] = k64;
    safe(() => localStorage.setItem(LS, JSON.stringify(dev)));
    CK.delete(kid);
    keys(); // copies it into the synced state and saves
    const drill = (window.EHSAN_QBANK?.questions || []).some((q) => /^DEPT-LEVELS-/.test(q.id));
    toast("Department drawings unlocked, with the Kasr Al Ainy book figures. They now appear in the anatomy, histology and physiology lessons and after answers, and reach your other devices with your sync code." + (drill ? "" : " Close and reopen the app once to add the 50 figure questions."));
    document.querySelectorAll(".ixDeptLock").forEach((b) => b.remove());
    document.querySelectorAll("#player [data-ix-dept]").forEach((el) => delete el.dataset.ixDept);
    schedule();
  }

  /* ───────── where each drawing is taught ───────── */
  const BY_SEC = new Map();
  for (const f of D.figs) for (const s of f.sec || []) (BY_SEC.get(s) || BY_SEC.set(s, []).get(s)).push(f);
  // best match first: "sc" is the relevance of the drawing's caption to that section (made when the set was built);
  // drawings without a score keep their place after the scored ones; the sort is stable
  const scIn = (f, sid) => {
    const i = (f.sec || []).indexOf(sid);
    return i >= 0 && f.sc ? f.sc[i] || 0 : 0;
  };
  for (const [sid, list] of BY_SEC) list.sort((a, b) => scIn(b, sid) - scIn(a, sid));
  const STOP = new Set("which following these those their there about after before with from that this have been were your other more most some such only upon onto into over under each both also than then them they where when while within without around behind inside outside above below along across through during between lies lying part parts side form forms formed type types".split(" "));
  const STOP6 = new Set([...STOP].map((w) => w.slice(0, 6)));
  const words = (t) => new Set((String(t).toLowerCase().match(/[a-z]{4,}/g) || []).filter((w) => !STOP.has(w) && !STOP6.has(w.slice(0, 6))).map((w) => w.slice(0, 6)));
  const FIGW = new Map(D.figs.map((f) => [f.id, words(f.cap)]));
  const DF = new Map();
  for (const w of FIGW.values()) for (const t of w) DF.set(t, (DF.get(t) || 0) + 1);
  const idf = (t) => Math.log(1 + D.figs.length / (1 + (DF.get(t) || 0)));
  // a CNS-levels drill item → its figure (shown above the question, not again in the explanation)
  const drillFig = (qid) => {
    const m = /^DEPT-LEVELS-HIST-MCQ-(\d+)\d$/.exec(qid || "");
    return m ? D.figs.find((f) => f.drill === +m[1]) || null : null;
  };
  // The drawings for an answer: the question's own LEARN section first (its drawings, scored by how much of the
  // question, the right answer and the explanation their caption says), then any other drawing that says a lot
  // of it. At most three, each after the first only if it is at least half as good, so a picture is never shown for a weak match.
  const PICKS = new Map();
  const MIN = 5, GLOBAL = 14, SECBONUS = 5, SECOND = 0.5, MAXN = 3;
  function pickFor(qid) {
    if (PICKS.has(qid)) return PICKS.get(qid);
    let out = [];
    if (!drillFig(qid)) {
      const q = (window.EHSAN_QBANK?.questions || []).find((x) => x.id === qid);
      if (q) {
        const sid = safe(() => window.INTELLECTUALITY_V15?.bestSection(qid)?.id, null);
        const ex = safe(() => window.INTELLECTUALITY_V16?.explain(qid), null);
        const want = words(q.stem + " " + (q.options || []).filter((o) => (q.answerKeys || []).includes(o.key)).map((o) => o.text).join(" ") + " " + (ex && ex.key ? ex.key : ""));
        const inSec = new Set(((sid && BY_SEC.get(sid)) || []).map((f) => f.id));
        const cand = [];
        for (const f of D.figs) {
          let o = 0;
          for (const t of FIGW.get(f.id)) if (want.has(t)) o += idf(t);
          const here = inSec.has(f.id);
          if (here ? o >= MIN : o >= GLOBAL) cand.push({ f, sc: o + (here ? SECBONUS + 0.04 * scIn(f, sid) : 0) });
        }
        cand.sort((a, b) => b.sc - a.sc);
        if (cand.length) out = cand.slice(0, MAXN).filter((c, i) => i === 0 || c.sc >= SECOND * cand[0].sc).map((c) => c.f);
      }
    }
    PICKS.set(qid, out);
    return out;
  }
  const bestFor = (qid) => pickFor(qid)[0] || null;

  /* ───────── rendering ───────── */
  const URLS = new Map();
  function url(f) {
    if (PLAIN) return Promise.resolve("/dept/" + f.id + ".jpg");
    if (!URLS.has(f.id)) {
      const p = fetch("/dept/" + f.id + ".bin")
        .then((r) => {
          if (!r.ok) throw new Error("http " + r.status);
          return r.arrayBuffer();
        })
        .then((b) => unseal(b))
        .then((b) => URL.createObjectURL(new Blob([b], { type: "image/jpeg" })));
      p.catch(() => URLS.delete(f.id));
      URLS.set(f.id, p);
    }
    return URLS.get(f.id);
  }
  // quiz = the figure of a question not yet answered: its answers stay hidden
  function card(f, quiz) {
    return (
      '<figure class="ixDept" data-ix-dept="' + E(f.id) + '"><div class="ixDeptLab">' +
      (f.sameh ? '<span lang="ar" dir="rtl">رسمة د. سامح دوس</span> DR SAMEH DOSS · LABELLED DRAWING' : f.book ? '<span lang="ar" dir="rtl">كتاب القصر العيني</span> KASR AL AINY BOOK · FIG ' + E(f.book) : '<span lang="ar" dir="rtl">رسمة القسم</span> DEPARTMENT DRAWING') + "</div>" +
      '<div class="ixDeptImg" style="aspect-ratio:' + (f.w || 4) + " / " + (f.h || 3) + '"><div class="v14Skeleton"><span></span></div></div>' +
      "<figcaption>" + E(f.cap) + (f.ans && !quiz ? '<span class="ixDeptAns">' + E(f.ans) + "</span>" : "") + "</figcaption></figure>"
    );
  }
  function block(list, show) {
    const a = list.slice(0, show),
      b = list.slice(show);
    return (
      '<div class="ixDeptRow">' + a.map((f) => card(f)).join("") + "</div>" +
      (b.length ? '<details class="ixDeptMore"><summary>' + b.length + " more official drawing" + (b.length > 1 ? "s" : "") + '</summary><div class="ixDeptRow">' + b.map((f) => card(f)).join("") + "</div></details>" : "")
    );
  }
  function hydrate(root) {
    root.querySelectorAll("figure.ixDept:not([data-ix-done])").forEach((fig) => {
      const det = fig.closest("details");
      if (det && !det.open) {
        if (!det.dataset.ixWait) {
          det.dataset.ixWait = "1";
          det.addEventListener("toggle", () => det.open && hydrate(det), { once: true });
        }
        return;
      }
      fig.dataset.ixDone = "1";
      const f = D.figs.find((x) => x.id === fig.dataset.ixDept);
      url(f)
        .then((u) => {
          const box = fig.querySelector(".ixDeptImg");
          if (box) box.innerHTML = '<img src="' + u + '" alt="' + E(f.cap) + '">';
          const im = box && box.querySelector("img");
          if (im) im.onerror = () => fig.remove();
        })
        .catch(() => fig.remove());
    });
  }
  function decorate() {
    const player = document.getElementById("player");
    if (!player) return;
    if (!unlocked()) {
      player.querySelectorAll(".v15Sec[data-v15-sec]:not([data-ix-lock])").forEach((el) => {
        el.dataset.ixLock = "1";
        if ((BY_SEC.get(el.dataset.v15Sec) || []).length) (el.querySelector(".v15Pics") || el.querySelector(".v15Pts"))?.insertAdjacentHTML("beforebegin", '<button class="ixDeptLock" data-ix-unlock="1">🔒 Department drawings for this section · paste your unlock link</button>');
      });
      return;
    }
    player.querySelectorAll(".v15Sec[data-v15-sec]:not([data-ix-dept])").forEach((el) => {
      el.dataset.ixDept = "1";
      const list = BY_SEC.get(el.dataset.v15Sec) || [];
      if (!list.length) return;
      const html = '<div class="ixDeptWrap">' + block(list, 2) + "</div>",
        at = el.querySelector(".v15Pics") || el.querySelector(".v15Pts");
      if (at) at.insertAdjacentHTML("beforebegin", html);
      else el.insertAdjacentHTML("beforeend", html);
      foldWebPhoto(el);
    });
    // CNS-levels drill: the figure goes above the question (answers hidden until it is answered)
    player.querySelectorAll("h3.v16Stem:not([data-ix-dept])").forEach((h) => {
      h.dataset.ixDept = "1";
      const holder = h.parentElement,
        hit = holder && holder.querySelector(".v16Opt[data-qid], .v16Explain[data-qid]"),
        f = hit && drillFig(hit.dataset.qid);
      if (f) h.insertAdjacentHTML("beforebegin", '<div class="ixDeptWrap ixDeptQ"><div class="ixDeptRow">' + card(f, hit.classList.contains("v16Opt")) + "</div></div>");
    });
    player.querySelectorAll(".v16Explain[data-qid]:not([data-ix-dept])").forEach((el) => {
      el.dataset.ixDept = "1";
      const fs = pickFor(el.dataset.qid);
      if (!fs.length) return;
      const html = '<div class="ixDeptWrap">' + block(fs, Math.min(2, fs.length)) + "</div>",
        at = el.querySelector(".v16Pics");
      if (at) at.insertAdjacentHTML("beforebegin", html);
      else el.insertAdjacentHTML("beforeend", html);
    });
    hydrate(player);
  }
  // the section's web photo moves inside a closed <details> (the node itself moves, so a picture that is
  // already loading lands in place; one not yet loaded waits for the tap, as learn-v15 does for details)
  function foldWebPhoto(sec) {
    const pics = sec.querySelector(":scope > .v15Pics");
    if (!pics || pics.querySelector(".ixWebPic") || !pics.querySelector("figure")) return;
    const d = document.createElement("details");
    d.className = "ixWebPic";
    d.innerHTML = "<summary>Web photo · the official drawings above come first</summary>";
    while (pics.firstChild) d.appendChild(pics.firstChild);
    pics.appendChild(d);
  }
  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      safe(decorate);
    });
  }

  // tap a drawing → full screen (pinch to zoom); tap again → back
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-ix-unlock]")) return void paste();
    const z = ev.target.closest(".ixDeptZoom");
    if (z) return z.remove();
    const img = ev.target.closest(".ixDept img");
    if (!img) return;
    const o = document.createElement("div");
    o.className = "ixDeptZoom";
    o.innerHTML = '<img src="' + img.src + '" alt="' + E(img.alt) + '"><div class="ixDeptZoomCap">' + E(img.alt) + " · tap to close</div>";
    document.body.appendChild(o);
  });

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  capture().finally(schedule);
  window.INTELLECTUALITY_DEPT = { unlocked, count: () => D.figs.length, sections: () => [...BY_SEC.keys()], bestFor: (qid) => bestFor(qid)?.id || null, pickFor: (qid) => pickFor(qid).map((f) => f.id), inSection: (sid) => (BY_SEC.get(sid) || []).map((f) => f.id), drillFig: (qid) => drillFig(qid)?.id || null };
})();
