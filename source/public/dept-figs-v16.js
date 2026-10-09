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
  // v18.8: matching by meaning. fig-concepts-v18.js turns a caption or a question into weighted word stems: the words
  // it uses (weight 1) and the words it stands for (0.5: "CN VI" -> abducent, "lateral rectus" -> abducent nerve, "PICA" ->
  // posterior inferior cerebellar artery, "Horner" -> cervical sympathetic, plurals and spellings folded together).
  const CON = window.INTELLECTUALITY_FIG_CONCEPTS;
  const weighted = (t) => CON.weighted(t);
  const FIGW = new Map(D.figs.map((f) => [f.id, weighted(f.cap)]));
  const DF = new Map();
  for (const w of FIGW.values()) for (const t of w.keys()) DF.set(t, (DF.get(t) || 0) + 1);
  const idf = (t) => Math.log(1 + D.figs.length / (1 + (DF.get(t) || 0)));
  // a CNS-levels drill item → its figure (shown above the question, not again in the explanation)
  const drillFig = (qid) => {
    const m = /^DEPT-LEVELS-HIST-MCQ-(\d+)\d$/.exec(qid || "");
    return m ? D.figs.find((f) => f.drill === +m[1]) || null : null;
  };
  // The drawings for an answer. A drawing scores by the meaning its caption shares with the question, the right answer
  // and the explanation (rarer words count more; words of the right answer count 1.5 times; a caption that names the
  // whole answer gets a bonus). Drawings of the question's own LEARN section need less; any other drawing must share a lot
  // and include the answer itself. At least two shared words, or one rare one in the question itself. At most three,
  // each after the first only if it is at least 60% as good, so a picture is never shown for a weak match.
  const PICKS = new Map();
  const P = { MIN: 7, MINSPEC: 4.5, SPEC: 3.8, GLOBAL: 14, STRONG: 22, ONE: 3.5, SECBONUS: 5, SECOND: 0.6, MAXN: 3, ANS: 1.5, COVER: 4, ANSO: 15 };
  function pickFor(qid) {
    if (PICKS.has(qid)) return PICKS.get(qid);
    let out = [];
    if (!drillFig(qid)) {
      const q = (window.EHSAN_QBANK?.questions || []).find((x) => x.id === qid);
      if (q) {
        const sid = safe(() => window.INTELLECTUALITY_V15?.bestSection(qid)?.id, null);
        const ex = safe(() => window.INTELLECTUALITY_V16?.explain(qid), null);
        const right = (q.options || []).filter((o) => (q.answerKeys || []).includes(o.key)).map((o) => o.text).join(" ");
        const ans = weighted(right);
        const sa = weighted(q.stem + " " + right);
        const want = weighted(q.stem + " " + right + " " + (ex && ex.key ? ex.key : ""));
        const lit = [...ans].filter(([t, w]) => w === 1 && idf(t) > 2).map(([t]) => t);
        const inSec = new Set(((sid && BY_SEC.get(sid)) || []).map((f) => f.id));
        const cand = [];
        for (const f of D.figs) {
          const fw = FIGW.get(f.id);
          let o = 0, n = 0;
          const hit = [];
          for (const [t, wf] of fw) {
            const wq = want.get(t);
            if (!wq) continue;
            o += idf(t) * Math.min(wq, wf) * (ans.has(t) ? P.ANS : 1);
            if (Math.min(wq, wf) === 1) n++;
            hit.push(t);
          }
          if (!hit.length) continue;
          const here = inSec.has(f.id);
          if (n < 2 && !(here && n === 1 && hit.some((t) => fw.get(t) === 1 && want.get(t) === 1 && idf(t) >= P.ONE))) continue;
          const spec = hit.some((t) => fw.get(t) === 1 && sa.get(t) === 1 && idf(t) >= P.SPEC);
          if (here ? o < (spec ? P.MINSPEC : P.MIN) : o < P.GLOBAL) continue;
          if (!here && o < P.STRONG && n < 4 && !hit.some((t) => ans.get(t) === 1 && (idf(t) >= P.SPEC || o >= P.ANSO))) continue;
          const cover = lit.length && lit.every((t) => fw.get(t) === 1) ? P.COVER : 0;
          cand.push({ f, n, sc: o + cover + (here ? P.SECBONUS + 0.04 * scIn(f, sid) : 0) });
        }
        cand.sort((a, b) => b.sc - a.sc);
        out = cand.slice(0, P.MAXN).filter((c, i) => i === 0 || (c.n >= 2 && c.sc >= P.SECOND * cand[0].sc)).map((c) => c.f);
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

  // tap a drawing → a full-screen viewer: the drawing fits the screen; tap it (or ＋) to magnify 2× then 3× and drag
  // to move around the labels; ✕, Esc, or a tap on the dark background closes it. Pinch zoom also works.
  const LEVELS = [1, 2, 3];
  function setZoom(o, lv, cx, cy) {
    const sc = o.querySelector(".ixDZScroll"), im = sc && sc.querySelector("img");
    if (!im) return;
    const old = +o.dataset.lv || 1, rx = (sc.scrollLeft + (cx ?? sc.clientWidth / 2)) / (sc.scrollWidth || 1), ry = (sc.scrollTop + (cy ?? sc.clientHeight / 2)) / (sc.scrollHeight || 1);
    o.dataset.lv = String(lv);
    o.classList.toggle("ixDZBig", lv > 1);
    im.style.width = lv > 1 ? lv * 100 + "%" : "";
    o.querySelector("[data-ixz=\"out\"]").disabled = lv <= 1;
    o.querySelector("[data-ixz=\"in\"]").disabled = lv >= LEVELS[LEVELS.length - 1];
    if (lv !== old) requestAnimationFrame(() => {
      sc.scrollLeft = rx * sc.scrollWidth - (cx ?? sc.clientWidth / 2);
      sc.scrollTop = ry * sc.scrollHeight - (cy ?? sc.clientHeight / 2);
    });
  }
  function closeZoom() {
    document.querySelectorAll(".ixDeptZoom").forEach((z) => z.remove());
    document.documentElement.classList.remove("ixDZOpen");
  }
  document.addEventListener("keydown", (ev) => ev.key === "Escape" && document.querySelector(".ixDeptZoom") && closeZoom());
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-ix-unlock]")) return void paste();
    const z = ev.target.closest(".ixDeptZoom");
    if (z) {
      const b = ev.target.closest("[data-ixz]");
      const lv = +z.dataset.lv || 1;
      if (b) {
        if (b.dataset.ixz === "close") return closeZoom();
        return setZoom(z, b.dataset.ixz === "in" ? Math.min(3, lv + 1) : Math.max(1, lv - 1));
      }
      if (ev.target.tagName === "IMG") {
        const r = z.querySelector(".ixDZScroll").getBoundingClientRect();
        return setZoom(z, lv >= 3 ? 1 : lv + 1, ev.clientX - r.left, ev.clientY - r.top);
      }
      return closeZoom();
    }
    const img = ev.target.closest(".ixDept img");
    if (!img) return;
    closeZoom();
    const o = document.createElement("div");
    o.className = "ixDeptZoom";
    o.dataset.lv = "1";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", img.alt);
    o.innerHTML =
      '<div class="ixDZBar"><button type="button" data-ixz="out" aria-label="Zoom out" disabled>－</button><button type="button" data-ixz="in" aria-label="Zoom in">＋</button><span class="ixDZHint">Tap the drawing to zoom · drag to move</span><button type="button" data-ixz="close" aria-label="Close">✕</button></div>' +
      '<div class="ixDZScroll"><img src="' + img.src + '" alt="' + E(img.alt) + '"></div><div class="ixDeptZoomCap">' + E(img.alt) + "</div>";
    document.body.appendChild(o);
    document.documentElement.classList.add("ixDZOpen");
  });

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  capture().finally(schedule);
  window.INTELLECTUALITY_DEPT = { unlocked, count: () => D.figs.length, sections: () => [...BY_SEC.keys()], bestFor: (qid) => bestFor(qid)?.id || null, pickFor: (qid) => pickFor(qid).map((f) => f.id), inSection: (sid) => (BY_SEC.get(sid) || []).map((f) => f.id), drillFig: (qid) => drillFig(qid)?.id || null };
})();
