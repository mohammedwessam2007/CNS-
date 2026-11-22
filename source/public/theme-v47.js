/* INTELLECTUALITY v47 · one light, clean theme for every screen (owner, 22 Nov: "I don't like the design, it's unusable,
 * the colours too… make it the best experience ever").
 * The app grew over many versions with hundreds of hard-coded dark colours. Instead of chasing each one, this adapter reads
 * every element's computed colours once and maps them onto one light palette:
 *   dark surfaces → white cards on a soft grey page; pale text → near-black ink or muted grey; light "neon" text → the same
 *   hue at reading contrast; translucent white panels → faint grey; opaque accent buttons → the one blue.
 * Drawings (SVG, images, video) keep their own colours. New content (lessons, AI answers) is adapted as it appears.
 * Turn it off with localStorage ix_theme_v1 = "dark". */
(function () {
  "use strict";
  let mode = "light"; try { mode = localStorage.getItem("ix_theme_v1") || "light"; } catch (e) {}
  if (mode === "dark") return;
  const R = document.documentElement; R.classList.add("ixLT");
  const BG = "#f4f6f9", CARD = "#ffffff", INK = "#1b1f24", MUTED = "#5b6470", LINE = "#e2e6eb", ACC = "#0b57d0";
  const SKIP = new Set(["SVG", "IMG", "VIDEO", "IFRAME", "CANVAS", "PATH", "TEXT", "G", "SOURCE", "PICTURE", "SCRIPT", "STYLE", "LINK", "META", "BR", "HR"]);
  const parse = (c) => { const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c || ""); return m ? [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]] : null; };
  const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  function hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h * 360, s, l]; }
  const deep = (r, g, b, L) => { const [h, s] = hsl(r, g, b); return "hsl(" + Math.round(h) + "," + Math.round(Math.min(1, s * 1.1) * 100) + "%," + L + "%)"; };
  const isBtn = (el) => el.tagName === "BUTTON" || el.getAttribute("role") === "button" || el.tagName === "A" && el.classList.length > 0;
  const set = (el, p, v) => { el.style.setProperty(p, v, "important"); (el.__lt = el.__lt || new Set()).add(p); };
  const clear = (el) => { if (el.__lt) { el.__lt.forEach((p) => el.style.removeProperty(p)); el.__lt.clear(); } };
  // parts the light stylesheet (skin-v47.css) styles itself
  const OWN = ".ixSbar, .ixSbar *, .ixCv, .ixPropts button, .ixCvAsk, .ixZgo, .ixQgo, .ixLmain, [data-s=done], .ixNav, .ixNav *, .ixCbar, .ixCbar *, .ixCday.today, .ixLprog i, .ixHopt.good, .ixHopt.bad, .ixAxOpts li.ok, .ixAxOpts li.no.mine, .ixZhero, .ixQhero, progress";
  function inSvg(el) { return el.closest && (el.closest("svg, .ixAxDraw, [data-keep-theme]") || el.matches(OWN)); }
  function paint(el) {
    if (!el || el.nodeType !== 1 || SKIP.has(el.tagName.toUpperCase()) || inSvg(el)) return;
    const cs = getComputedStyle(el); if (cs.display === "none") return;
    // background
    const bg = parse(cs.backgroundColor), img = cs.backgroundImage || "none";
    const selected = el.getAttribute("aria-pressed") === "true" || el.getAttribute("aria-selected") === "true" || el.classList.contains("on") && isBtn(el);
    if (img !== "none" && /gradient/.test(img) && isBtn(el)) { set(el, "background", ACC); set(el, "color", "#fff"); return; }
    if (img !== "none" && /gradient/.test(img)) set(el, "background-image", "none");
    let darkSurface = false;
    if (bg && bg[3] > 0.02) {
      const L = lum(bg[0], bg[1], bg[2]), [, S] = hsl(bg[0], bg[1], bg[2]);
      if (bg[3] >= 0.5 && L < 0.4) {
        darkSurface = true;
        const big = (cs.position === "fixed" || cs.position === "absolute") && el.offsetWidth > innerWidth * 0.6 && el.offsetHeight > innerHeight * 0.5;
        if (S > 0.35 && L > 0.15) { set(el, "background-color", deep(bg[0], bg[1], bg[2], 94)); }   // a dark coloured panel → its pale tint
        else set(el, "background-color", big || el === document.body ? BG : CARD);
      } else if (bg[3] < 0.5 && L > 0.75) set(el, "background-color", "rgba(17,24,39," + Math.min(0.05, bg[3] * 0.6).toFixed(3) + ")");   // translucent white on dark → faint grey
      else if (bg[3] >= 0.5 && S > 0.35 && L > 0.4) {   // an opaque accent (lavender, gold, mint…)
        if (isBtn(el) || selected) { set(el, "background-color", ACC); set(el, "color", "#fff"); return; }
        set(el, "background-color", deep(bg[0], bg[1], bg[2], 92));
      } else if (bg[3] < 0.5 && S > 0.3) set(el, "background-color", deep(bg[0], bg[1], bg[2], 96));   // translucent colour tint → pale tint
    }
    // text
    const c = parse(cs.color);
    if (c) {
      const L = lum(c[0], c[1], c[2]), [, S] = hsl(c[0], c[1], c[2]);
      const H = hsl(c[0], c[1], c[2])[0];
      if (S < 0.25) { if (L > 0.72) set(el, "color", INK); else if (L > 0.42) set(el, "color", MUTED); }
      else if (L > 0.45) {
        // decorative lavender/blue/cyan text was there to glow on black: on white it becomes plain ink;
        // warm and green text carries meaning (warning, right, wrong): keep its hue at reading contrast
        if (H >= 180 && H < 300) set(el, "color", L > 0.75 ? INK : MUTED); else set(el, "color", deep(c[0], c[1], c[2], 32));
      }
    }
    // borders
    const b = parse(cs.borderTopColor);
    if (b && parseFloat(cs.borderTopWidth) > 0) { const L = lum(b[0], b[1], b[2]), [, S] = hsl(b[0], b[1], b[2]); if (S < 0.3 && (L > 0.5 || b[3] < 0.6) || L < 0.25) set(el, "border-color", LINE); else if (S >= 0.3 && L > 0.5) set(el, "border-color", deep(b[0], b[1], b[2], 70)); }
    if (darkSurface && /rgba\(0, 0, 0/.test(cs.boxShadow)) set(el, "box-shadow", "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.08)");
  }
  function sweep(root) { if (!root || root.nodeType !== 1) return; paint(root); const all = root.getElementsByTagName("*"); for (let i = 0; i < all.length; i++) paint(all[i]); }
  let queue = new Set(), raf = 0;
  const flush = () => { raf = 0; const q = queue; queue = new Set(); q.forEach((el) => { if (el.isConnected) sweep(el); }); };
  const later = (el) => { queue.add(el); if (!raf) raf = requestAnimationFrame(flush); };
  function start() {
    sweep(document.body);
    new MutationObserver((ms) => ms.forEach((m) => {
      if (m.type === "childList") m.addedNodes.forEach((n) => n.nodeType === 1 && later(n));
      else if (m.type === "attributes" && m.target.nodeType === 1 && !inSvg(m.target)) { clear(m.target); later(m.target); }
    })).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "aria-pressed", "aria-selected", "disabled", "hidden", "open"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 0)); else setTimeout(start, 0);
  window.IX_THEME = { mode, sweep, set: (m) => { try { localStorage.setItem("ix_theme_v1", m); } catch (e) {} location.reload(); } };
})();
