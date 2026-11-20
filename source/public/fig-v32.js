/* INTELLECTUALITY v32 · world-class drawings everywhere (owner, 20 Nov 2026: "the drawings were so shit, I want world
 * class drawings all over the course"). The course's pictures now come from OpenStax Anatomy & Physiology 2e: modern,
 * full-colour, labelled textbook illustrations and micrographs (CC BY 4.0), 139 of them chosen per DIG-206 unit and
 * NEU-205 chapter and kept in the app (they work offline). Gray's 1918 plates stay as a second, classic layer.
 *  - IX_FIG.forUnit(id) / forCns(chapter): the drawings for a unit or a CNS chapter, best first
 *  - IX_FIG.best(list, text): the drawing that fits a piece of text (a lesson part, a question) by its labels
 *  - IX_FIG.html(f): a figure card; a tap opens it full screen with pinch-zoom; 👁 Explain / 🎯 Quiz me ask the professor */
(function () {
  "use strict";
  if (window.IX_FIG) return;
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const O = () => window.IX_OSTX || { figs: {}, units: {}, cns: {} };
  const STOP = /^(the|and|of|in|a|an|to|its|on|is|are|by|with|for|from|this|that|which|shows|shown|figure|view|cell|cells|system|into|at|as|or|be|their|these|it)$/i;
  const words = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9+ ]+/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.test(w)).map((w) => w.replace(/(ies|es|s)$/, ""));
  const get = (id) => { const f = O().figs[id]; return f ? Object.assign({ id }, f) : null; };
  function forUnit(id) { return (O().units[id] || []).map(get).filter(Boolean); }
  function forCns(name) {
    const C = O().cns, n = String(name || "").toLowerCase(), out = [];
    Object.keys(C).filter((k) => n.indexOf(k.toLowerCase()) >= 0).sort((a, b) => b.length - a.length).forEach((k) => C[k].forEach((id) => { if (out.indexOf(id) < 0) out.push(id); }));
    return out.map(get).filter(Boolean);
  }
  function score(f, text) { const w = words(text), fw = words(f.cap + " " + f.alt); if (!w.length) return 0; const set = new Set(fw); return w.reduce((t, x) => t + (set.has(x) ? 1 : 0), 0); }
  function best(list, text, min) { let b = null, bs = (min == null ? 2 : min) - 1; (list || []).forEach((f) => { const s = score(f, text); if (s > bs) { b = f; bs = s; } }); return b; }
  const title = (f) => (f.title || String(f.cap).split(" ").slice(0, 4).join(" ")).slice(0, 90);
  function html(f, opts) {
    opts = opts || {};
    return '<figure class="ixFg" data-fig="' + E(f.id || "") + '"><button type="button" class="ixFgImg" data-zoom="' + E(f.src) + '" aria-label="Open the drawing full screen"><img loading="lazy" src="' + E(f.src) + '" alt="' + E(f.alt || f.cap) + '"' + (f.w ? ' width="' + f.w + '" height="' + f.h + '"' : "") + '><span class="ixFgZ">⤢</span></button>' +
      (opts.hideCap ? '<figcaption><span class="ixYspoil" tabindex="0">' + E(title(f)) + "</span></figcaption>" : '<figcaption><b>' + E(title(f)) + "</b>" + (opts.short || !f.body ? "" : "<span>" + E(String(f.body).length > 260 ? String(f.body).slice(0, 260).replace(/\s+\S*$/, "") + "…" : f.body) + "</span>") + '<small>OpenStax A&amp;P 2e · Fig. ' + E(f.num || "") + (f.credit ? " · " + E(f.credit.replace(/[()]/g, "")) : "") + " · CC BY 4.0</small></figcaption>") +
      (opts.noAsk ? "" : '<div class="ixFgAsk"><button type="button" data-fask="picture">👁 Explain it</button><button type="button" data-fask="picquiz">🎯 Quiz me on it</button></div>') + "</figure>";
  }
  // full-screen viewer with pinch / double-tap zoom
  let zv = null;
  function zoom(src, cap) {
    if (!zv) {
      zv = document.createElement("div"); zv.className = "ixFz"; zv.innerHTML = '<button type="button" class="ixFzX" aria-label="Close">✕</button><div class="ixFzS"><img alt=""></div><div class="ixFzC"></div>';
      document.body.appendChild(zv);
      zv.querySelector(".ixFzX").onclick = () => zv.classList.remove("on");
      const im = zv.querySelector("img"); im.onclick = () => im.classList.toggle("big");
    }
    const im = zv.querySelector("img"); im.classList.remove("big"); im.src = src; zv.querySelector(".ixFzC").textContent = (cap || "") + "  ·  tap to zoom in or out, pinch to zoom";
    zv.classList.add("on");
  }
  async function snap(img) {
    try { const c = document.createElement("canvas"), s = Math.min(1, 1100 / (img.naturalWidth || 1100)); c.width = Math.round((img.naturalWidth || 800) * s); c.height = Math.round((img.naturalHeight || 600) * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", 0.85); } catch (e) { return null; }
  }
  document.addEventListener("click", async (e) => {
    const z = e.target.closest && e.target.closest(".ixFg [data-zoom]");
    if (z) { e.preventDefault(); const fg = z.closest(".ixFg"), f = get(fg.dataset.fig); return zoom(z.dataset.zoom, f ? title(f) + " · OpenStax A&P 2e Fig. " + f.num + " · CC BY 4.0" : ""); }
    const a = e.target.closest && e.target.closest(".ixFg [data-fask]");
    if (a && window.IX_TUTOR) {
      const fg = a.closest(".ixFg"), f = get(fg.dataset.fig) || {}, img = fg.querySelector("img"), shot = img ? await snap(img) : null;
      const ctx = "PICTURE: OpenStax Anatomy & Physiology 2e, Figure " + (f.num || "") + "\nCAPTION: " + (f.cap || "") + "\nWHAT IT SHOWS (alt text): " + (f.alt || "");
      window.IX_SCREEN_OVERRIDE = { title: "Drawing · " + title(f), eyebrow: "DIG-206", body: ctx };
      IX_TUTOR.open();
      IX_TUTOR.ask(a.dataset.fask === "picquiz" ? "Quiz me on this drawing like the practical exam: point at one structure at a time." : "Walk me through this drawing: what each labelled part is, how they relate, and what the examiner wants me to draw from it.", a.dataset.fask, ctx, { images: shot ? [shot] : [] });
    }
  }, true);
  window.IX_FIG = { forUnit, forCns, best, html, zoom, get, title, score, all: () => Object.keys(O().figs).map(get) };
})();
