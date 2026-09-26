/* RENAISSANCE · Season 1 · Six mechanisms that run the world.
 *
 * Content rules (docs/RENAISSANCE/07_SEASON_1.md): every checkable fact names a provenance id; no quotation is typed
 * from memory (the two short quotations are Goodhart's and Strathern's wordings, checked against several sources);
 * classical scenes are paraphrased and labelled; toy models are labelled as toy models; stories that historians
 * doubt are labelled grade C. Pictures are drawn from the data, never decoration.
 */
(function () {
  "use strict";
  const C = { lime: "#d9ff43", cyan: "#66e9ff", pink: "#ff6e8a", green: "#5ef0a0", amber: "#ffd166", violet: "#b39cff", mut: "#8fa6c0", line: "#2f4a68", bg: "#0f1d2e", ink: "#e8eef6" };
  const svg = (w, h, inner, label) => '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "") + '" class="rnSvg">' + inner + "</svg>";
  const t = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" fill="' + ((o && o.c) || C.ink) + '" font-size="' + ((o && o.fs) || 12) + '" font-weight="' + ((o && o.fw) || 700) + '" text-anchor="' + ((o && o.a) || "middle") + '" font-family="Inter,system-ui,sans-serif">' + s + "</text>";
  const box = (x, y, w, h, c, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + (fill || C.bg) + '" stroke="' + c + '" stroke-width="1.6"/>';
  const arrow = (x1, y1, x2, y2, c) => '<path d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '" stroke="' + (c || C.mut) + '" stroke-width="2" marker-end="url(#rnArr)" fill="none"/>';
  const defs = '<defs><marker id="rnArr" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="' + C.mut + '"/></marker></defs>';
  const polyline = (pts, c, w, dash) => '<polyline points="' + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 2.4) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + "/>";
  const r1 = (x) => Math.round(x * 10) / 10;

  // phone first: every canvas is 360 wide and no label is smaller than 12 units, so text stays ≥ 10 px on a 360-px phone
  const wrap = (str, n) => {
    const out = [];
    let cur = "";
    for (const w of String(str).split(" ")) (cur + " " + w).trim().length > n && cur ? (out.push(cur), (cur = w)) : (cur = (cur + " " + w).trim());
    if (cur) out.push(cur);
    return out;
  };
  const lines = (x, y, arr, o, dy) => arr.map((l, i) => t(x, y + i * (dy || 16), l, o)).join("");

  /* ═══════════════ VISUALS (drawn from the data they show) ═══════════════ */
  const visuals = {
    // Odysseus designs constraints now for the self he will be at the song
    sirens: () =>
      svg(360, 330,
        defs +
          box(20, 8, 320, 58, C.cyan) + t(180, 31, "ODYSSEUS NOW", { c: C.cyan, fs: 14 }) + t(180, 53, "calm, sees the whole voyage: writes the rules", { fs: 12, fw: 600 }) +
          arrow(180, 66, 180, 88) +
          box(40, 90, 280, 38, C.lime) + t(180, 114, "wax: the crew can't hear the song", { fs: 13 }) +
          box(40, 136, 280, 38, C.lime) + t(180, 160, "ropes: he can't steer to the rocks", { fs: 13 }) +
          box(40, 182, 280, 38, C.lime) + t(180, 206, "order: if I beg, tie me tighter", { fs: 13 }) +
          arrow(180, 220, 180, 250) + t(186, 240, "binds", { c: C.mut, fs: 12, a: "start" }) +
          box(20, 252, 320, 68, C.pink) + t(180, 276, "ODYSSEUS AT THE SONG", { c: C.pink, fs: 14 }) + t(180, 298, "wants the rocks; will beg, order", { fs: 12, fw: 600 }) + t(180, 313, "and promise anything", { fs: 12, fw: 600 }),
        "Odysseus now designs three constraints that bind Odysseus at the song"),
    // a natural-frequency tree for the screening example
    tree: () => {
      const two = (x, y, w, c, fill, a, b, ac) => box(x, y, w, 48, c, fill) + t(x + w / 2, y + 21, a, { c: ac || C.ink, fs: 13 }) + t(x + w / 2, y + 39, b, { fs: 12, fw: 600, c: C.mut });
      return svg(360, 262,
        defs +
          box(120, 6, 120, 36, C.cyan) + t(180, 29, "1,000 people", { fs: 13 }) +
          box(14, 70, 150, 36, C.pink) + t(89, 93, "10 have it (1%)", { fs: 13 }) +
          box(196, 70, 150, 36, C.green) + t(271, 93, "990 don't", { fs: 13 }) +
          two(2, 140, 86, C.pink, "#3a1f2a", "9 test +", "90% of 10", C.pink) + two(92, 140, 84, C.pink, null, "1 test −", "missed") +
          two(184, 140, 86, C.amber, "#3a3320", "89 test +", "9% of 990", C.amber) + two(274, 140, 84, C.green, null, "901 test −", "clear") +
          arrow(160, 42, 100, 68) + arrow(200, 42, 260, 68) + arrow(70, 106, 46, 138) + arrow(108, 106, 132, 138) + arrow(252, 106, 228, 138) + arrow(290, 106, 314, 138) +
          t(180, 222, "Positive: 9 + 89 = 98 people", { c: C.lime, fs: 13 }) + t(180, 242, "sick among them: 9 → about 9%", { c: C.lime, fs: 13 }),
        "Of 1000 people, 98 test positive and only 9 of them are sick");
    },
    // two loops: one corrects, one amplifies
    loops: () => {
      const loop = (cx, a, b, sa, sb, col, letter, kind, title) =>
        '<circle cx="' + cx + '" cy="96" r="54" fill="none" stroke="' + col + '" stroke-width="2" stroke-dasharray="5 5"/>' +
        box(cx - 64, 26, 128, 32, col) + t(cx, 47, a, { fs: 12 }) +
        box(cx - 64, 134, 128, 32, col) + t(cx, 155, b, { fs: 12 }) +
        t(cx + 68, 102, sa, { c: col, fs: 18, fw: 900 }) + t(cx - 68, 102, sb, { c: col, fs: 18, fw: 900 }) +
        t(cx, 105, letter, { c: col, fs: 26, fw: 900 }) + t(cx, 192, kind, { c: col, fs: 13 }) + t(cx, 210, title, { c: C.mut, fs: 12 });
      return svg(360, 220, loop(88, "glucose ↑", "insulin ↑", "+", "−", C.green, "B", "balancing", "blood sugar after a meal") + loop(272, "withdrawals ↑", "fear of a run ↑", "+", "+", C.pink, "R", "reinforcing", "a bank run"), "A balancing loop and a reinforcing loop");
    },
    // Semmelweis's two clinics, 1841–1846, deaths per 100 births (Loudon 2013 / James Lind Library)
    semmel: () => {
      const D = [[1841, 7.8, 3.5], [1842, 15.8, 7.6], [1843, 9.0, 6.0], [1844, 8.2, 2.3], [1845, 6.9, 2.0], [1846, 11.4, 2.8]];
      let s = t(180, 16, "Mothers who died per 100 births", { c: C.ink, fs: 13 }) + t(180, 33, "Vienna General Hospital, 1841–1846", { c: C.mut, fs: 12, fw: 600 });
      const y0 = 206, k = 9;
      for (let g = 0; g <= 16; g += 4) s += '<line x1="30" x2="354" y1="' + (y0 - g * k) + '" y2="' + (y0 - g * k) + '" stroke="' + C.line + '"/>' + t(24, y0 - g * k + 4, g, { fs: 12, c: C.mut, a: "end" });
      D.forEach(([y, a, b], i) => {
        const x = 38 + i * 53;
        s += '<rect x="' + x + '" y="' + (y0 - a * k) + '" width="22" height="' + a * k + '" fill="' + C.pink + '"/>' + t(x + 11, y0 - a * k - 5, a, { fs: 12 });
        s += '<rect x="' + (x + 23) + '" y="' + (y0 - b * k) + '" width="22" height="' + b * k + '" fill="' + C.cyan + '"/>' + t(x + 34, y0 - b * k - 5, b, { fs: 12 });
        s += t(x + 22, y0 + 18, y, { fs: 12, c: C.mut });
      });
      s += '<rect x="30" y="238" width="12" height="12" fill="' + C.pink + '"/>' + t(48, 249, "First Clinic (doctors, students)", { a: "start", fs: 12 });
      s += '<rect x="30" y="258" width="12" height="12" fill="' + C.cyan + '"/>' + t(48, 269, "Second Clinic (midwives)", { a: "start", fs: 12 });
      return svg(360, 278, s, "First Clinic deaths 7 to 16 per 100 births; Second Clinic 2 to 8");
    },
    // the 1847 intervention month by month (First Clinic)
    semmel47: () => {
      const D = [["Apr", 18.3], ["May*", 12.2], ["Jun", 2.2], ["Jul", 1.2], ["Aug", 1.9]];
      let s = t(180, 16, "First Clinic, 1847: deaths per 100 births", { fs: 13 }) + t(180, 33, "* chlorine hand-washing from mid-May", { c: C.mut, fs: 12, fw: 600 });
      const y0 = 196, k = 7;
      D.forEach(([m, v], i) => {
        const x = 32 + i * 64;
        s += '<rect x="' + x + '" y="' + (y0 - v * k) + '" width="40" height="' + v * k + '" fill="' + (i < 1 ? C.pink : i === 1 ? C.amber : C.green) + '"/>' + t(x + 20, y0 - v * k - 5, v, { fs: 13 }) + t(x + 20, y0 + 18, m, { c: C.mut, fs: 12 });
      });
      s += '<line x1="24" x2="350" y1="' + (y0 - 1.33 * k) + '" y2="' + (y0 - 1.33 * k) + '" stroke="' + C.cyan + '" stroke-dasharray="4 4"/>';
      s += '<line x1="24" x2="48" y1="232" y2="232" stroke="' + C.cyan + '" stroke-width="2" stroke-dasharray="4 4"/>' + t(56, 236, "Second Clinic level, 1848 (1.3)", { c: C.cyan, a: "start", fs: 12 });
      return svg(360, 246, s, "After hand-washing, First Clinic deaths fell from 18.3 to about 2 per 100");
    },
    // schematic of the pattern Bevan & Hood describe: reported ambulance times pile up just under the target
    target8: () => {
      const H = [3, 5, 8, 11, 13, 14, 15, 26, 4, 6, 5, 4, 3];
      let s = t(180, 16, "Schematic, not real data:", { c: C.amber, fs: 12 }) + t(180, 33, "reported response times, target 8 minutes", { c: C.mut, fs: 12, fw: 600 });
      const y0 = 196, k = 5;
      H.forEach((v, i) => {
        const x = 18 + i * 25.5;
        s += '<rect x="' + x + '" y="' + (y0 - v * k) + '" width="21" height="' + v * k + '" fill="' + (i === 7 ? C.pink : C.cyan) + '"/>' + t(x + 10.5, y0 + 16, i + 1, { fs: 12, c: C.mut });
      });
      const xl = 18 + 8 * 25.5 - 2;
      s += '<line x1="' + xl + '" x2="' + xl + '" y1="46" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2" stroke-dasharray="5 4"/>' + t(xl + 6, 64, "target: 8 min", { c: C.lime, a: "start", fs: 12 });
      s += t(180, y0 + 36, "minutes · the spike just under 8 is the", { c: C.mut, fs: 12, fw: 600 }) + t(180, y0 + 52, "signature of reclassified times", { c: C.mut, fs: 12, fw: 600 });
      return svg(360, 256, s, "Schematic histogram with a spike just under the eight-minute target");
    },
  };

  /* ═══════════════ INTERACTIVE MODELS ═══════════════ */
  const models = {
    // hyperbolic vs exponential discounting: does the preference flip as the choice gets closer?
    discount: {
      controls: [{ id: "d", label: "Days until the 100 EGP", min: 0, max: 60, step: 1, value: 60, unit: " days" }],
      toggles: [{ id: "expo", label: "Textbook agent (exponential)", value: false }],
      val(A, D, expo) {
        return expo ? A * Math.exp(-0.03 * D) : A / (1 + 0.1 * D);
      },
      draw(v) {
        const W = 360, H = 286, x0 = 30, x1 = 350, y0 = 236, y1 = 62;
        const X = (D) => x1 - ((x1 - x0) * D) / 60,
          Y = (V) => y0 - ((y0 - y1) * V) / 110;
        const ss = [], ll = [];
        for (let D = 60; D >= 0; D -= 1) {
          ss.push([X(D), Y(this.val(100, D, v.expo))]);
          ll.push([X(D), Y(this.val(120, D + 7, v.expo))]);
        }
        let s = defs + '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '" stroke="' + C.line + '"/>';
        s += t(x0, y0 + 18, "60 days away", { c: C.mut, fs: 12, a: "start" }) + t(x1, y0 + 18, "the day itself", { c: C.mut, fs: 12, a: "end" }) + t(190, y0 + 38, "time passes →", { c: C.mut, fs: 12 });
        s += polyline(ss, C.pink, 2.6) + polyline(ll, C.cyan, 2.6);
        if (!v.expo)
          s += '<line x1="' + X(25) + '" x2="' + X(25) + '" y1="' + y1 + '" y2="' + y0 + '" stroke="' + C.amber + '" stroke-dasharray="4 4"/>' + t(X(25), y1 - 8, "the flip (~25 days out)", { c: C.amber, fs: 12 }) +
            t((x0 + X(25)) / 2, 150, "blue on top:", { c: C.cyan, fs: 12 }) + t((x0 + X(25)) / 2, 166, "you plan to wait", { c: C.cyan, fs: 12 }) +
            t((X(25) + x1) / 2 + 12, 204, "pink on top:", { c: C.pink, fs: 12 }) + t((X(25) + x1) / 2 + 12, 220, "you grab", { c: C.pink, fs: 12 });
        else s += t(x0 + 6, 110, "pink stays on top", { c: C.pink, fs: 12, a: "start" }) + t(x0 + 6, 126, "at every distance:", { c: C.pink, fs: 12, a: "start" }) + t(x0 + 6, 142, "no flip", { c: C.pink, fs: 12, a: "start" });
        const a = this.val(100, v.d, v.expo), b = this.val(120, v.d + 7, v.expo);
        s += '<line x1="' + X(v.d) + '" x2="' + X(v.d) + '" y1="' + y1 + '" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2"/>';
        s += '<circle cx="' + X(v.d) + '" cy="' + Y(a) + '" r="5" fill="' + C.pink + '"/><circle cx="' + X(v.d) + '" cy="' + Y(b) + '" r="5" fill="' + C.cyan + '"/>';
        s += t(x0, 16, "— 100 EGP on the day", { c: C.pink, a: "start", fs: 12 }) + t(x0, 33, "— 120 EGP a week later", { c: C.cyan, a: "start", fs: 12 });
        return svg(W, H, s, "Value of two rewards as the choice approaches");
      },
      read(v) {
        const a = this.val(100, v.d, v.expo), b = this.val(120, v.d + 7, v.expo);
        return "Seen from today, with the choice **" + v.d + " days** away: 100 EGP feels worth **" + r1(a) + "**, 120 EGP a week later feels worth **" + r1(b) + "** → you would plan to take **" + (b > a ? "the 120 (wait)" : "the 100 (now)") + "**." + (v.expo ? " The textbook agent's ranking never changes as the day approaches." : "");
      },
    },
    // Wald: hits on the planes that came back vs on all planes
    planes: {
      controls: [{ id: "L", label: "Chance an engine hit brings a plane down", min: 0, max: 100, step: 5, value: 80, unit: "%" }],
      toggles: [{ id: "miss", label: "Show the planes that did not come back", value: false }],
      fleet(L) {
        // fixed pseudo-random fleet: 48 planes × 3 hits; regions by exposed area; engine hits are the dangerous ones
        let seed = 7;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        const R = [["wings", 0.4], ["fuselage", 0.35], ["tail", 0.13], ["engine", 0.12]];
        const out = [];
        for (let p = 0; p < 48; p++) {
          const hits = [];
          let down = false;
          for (let h = 0; h < 3; h++) {
            let u = rnd(), reg = "wings";
            for (const [r, w] of R) {
              if (u < w) {
                reg = r;
                break;
              }
              u -= w;
            }
            const kill = rnd();
            if ((reg === "engine" && kill < L / 100) || (reg !== "engine" && kill < 0.04)) down = true;
            hits.push([reg, rnd(), rnd()]);
          }
          out.push({ hits, down });
        }
        return out;
      },
      draw(v) {
        const F = this.fleet(v.L);
        const pos = { wings: (a, b) => [a < 0.5 ? -22 + a * 16 : 8 + (a - 0.5) * 16, -2 + b * 6], fuselage: (a, b) => [-3 + a * 6, -16 + b * 30], tail: (a, b) => [-8 + a * 16, 17 + b * 4], engine: (a) => (a < 0.5 ? [-12, 0] : [12, 0]) };
        let s = "";
        F.forEach((p, i) => {
          const cx = 32 + (i % 6) * 59, cy = 28 + Math.floor(i / 6) * 50;
          if (p.down && !v.miss) return;
          const o = p.down ? 0.35 : 1;
          s += '<g opacity="' + o + '"><path d="M' + (cx - 3) + " " + (cy - 20) + " h6 v38 h-6 Z M" + (cx - 24) + " " + (cy - 3) + " h48 v6 h-48 Z M" + (cx - 9) + " " + (cy + 15) + ' h18 v4 h-18 Z" fill="#26405e"' + (p.down ? ' stroke="' + C.pink + '" stroke-dasharray="2 2"' : "") + '/><circle cx="' + (cx - 12) + '" cy="' + cy + '" r="3.2" fill="#3b5877"/><circle cx="' + (cx + 12) + '" cy="' + cy + '" r="3.2" fill="#3b5877"/>';
          for (const [r, a, b] of p.hits) {
            const [dx, dy] = pos[r](a, b);
            s += '<circle cx="' + (cx + dx) + '" cy="' + (cy + dy) + '" r="2.8" fill="' + (r === "engine" ? C.amber : C.pink) + '"/>';
          }
          s += "</g>";
        });
        return svg(360, 406, s, "A fleet of planes with bullet holes; gaps are planes that did not return");
      },
      read(v) {
        const F = this.fleet(v.L), regs = ["wings", "fuselage", "tail", "engine"];
        const cnt = (ps) => Object.fromEntries(regs.map((r) => [r, ps.reduce((a, p) => a + p.hits.filter((h) => h[0] === r).length, 0)]));
        const back = F.filter((p) => !p.down), all = cnt(F), cb = cnt(back);
        return "**" + back.length + " of 48** planes came back. Holes on the planes you can inspect: " + regs.map((r) => r + " " + cb[r]).join(" · ") + ". Holes on **all** planes, including the lost ones: " + regs.map((r) => r + " " + all[r]).join(" · ") + ".\n\nToy numbers, same logic as Wald: the engine holes are missing from the survivors because engine hits did not come home.";
      },
    },
    // 1,000 people: who tests positive, and who is sick among them
    icons: {
      controls: [
        { id: "prev", label: "How common it is", min: 0.5, max: 50, step: 0.5, value: 1, unit: "%" },
        { id: "sens", label: "Sick people the test catches", min: 50, max: 100, step: 1, value: 90, unit: "%" },
        { id: "fpr", label: "Healthy people it wrongly flags", min: 0, max: 30, step: 0.5, value: 9, unit: "%" },
      ],
      counts(v) {
        const sick = Math.round(10 * v.prev), tp = Math.round((sick * v.sens) / 100), fp = Math.round(((1000 - sick) * v.fpr) / 100);
        return { sick, tp, fn: sick - tp, fp, tn: 1000 - sick - fp };
      },
      draw(v) {
        const c = this.counts(v);
        let s = "", i = 0;
        const put = (n, fill, stroke) => {
          for (let k = 0; k < n; k++, i++) s += '<circle cx="' + (9 + (i % 40) * 8.7) + '" cy="' + (8 + Math.floor(i / 40) * 9.2) + '" r="3.4" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="1.2"' : "") + "/>";
        };
        put(c.tp, C.pink);
        put(c.fn, "none", C.pink);
        put(c.fp, C.amber);
        put(c.tn, "#26405e");
        return svg(360, 238, s, "1000 people: sick and positive, sick and missed, healthy but flagged, healthy and clear");
      },
      read(v) {
        const c = this.counts(v), pos = c.tp + c.fp;
        return "Pink = sick and caught · pink ring = sick but missed · **amber = healthy but flagged** · dark = healthy and clear.\n\n**" + pos + "** people test positive; **" + c.tp + "** of them are sick → a positive means **" + (pos ? Math.round((100 * c.tp) / pos) : 0) + "%** chance of disease.";
      },
    },
    // a shower with a delay between the knob and the head
    shower: {
      controls: [
        { id: "delay", label: "Seconds from knob to water", min: 0, max: 8, step: 1, value: 4, unit: " s" },
        { id: "gain", label: "How hard you turn per second", min: 0.1, max: 1, step: 0.05, value: 0.5, fmt: (x) => (x < 0.25 ? "gently" : x < 0.55 ? "firmly" : "hard") + " (" + x + ")" },
      ],
      sim(v) {
        const K = [15], T = [];
        for (let i = 0; i < 60; i++) {
          const felt = K[Math.max(0, i - v.delay)];
          T.push(felt);
          K.push(Math.min(60, Math.max(10, K[i] + v.gain * (38 - felt))));
        }
        return T;
      },
      draw(v) {
        const T = this.sim(v), x0 = 34, x1 = 350, y0 = 214, Y = (c) => y0 - ((c - 10) * 180) / 50, X = (i) => x0 + ((x1 - x0) * i) / 59;
        let s = '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + Y(38) + '" y2="' + Y(38) + '" stroke="' + C.lime + '" stroke-dasharray="5 4"/>' + t(x1, 18, "- - wanted: 38 °C", { c: C.lime, a: "end", fs: 12 }) + t(x0, 18, "°C", { c: C.mut, fs: 12, a: "start" });
        for (const g of [10, 20, 30, 40, 50, 60]) s += t(x0 - 6, Y(g) + 4, g, { c: C.mut, fs: 12, a: "end" });
        s += polyline(T.map((c, i) => [X(i), Y(c)]), C.cyan, 2.6) + t(192, y0 + 22, "seconds →", { c: C.mut, fs: 12 });
        return svg(360, 244, s, "Water temperature over one minute");
      },
      read(v) {
        const T = this.sim(v), last = T.slice(-15), hi = Math.max(...T), lo = Math.min(...T.slice(5));
        const settled = last.every((c) => Math.abs(c - 38) < 1);
        let swings = 0;
        for (let i = 2; i < T.length; i++) if ((T[i] - 38) * (T[i - 1] - 38) < 0) swings++;
        return "Hottest **" + Math.round(hi) + " °C**, coldest after the start **" + Math.round(lo) + " °C**, crossed the target **" + swings + "** times; " + (settled ? "**settled** at 38 °C." : "**never settled** in this minute.");
      },
    },
    // a toy model of pressure on a number, with and without audits
    goodhart: {
      controls: [
        { id: "p", label: "Reward riding on the number", min: 0, max: 10, step: 0.5, value: 0 },
        { id: "a", label: "Chance the real thing is checked", min: 0, max: 100, step: 5, value: 0, unit: "%" },
      ],
      at(p, a) {
        const g = Math.min(0.9, Math.max(0, ((p - 1) / (p + 3)) * (1 - a / 100))), effort = 1 + 0.15 * p;
        const real = effort * (1 - g), game = effort * g;
        return { M: real + 2 * game * (1 - a / 100), T: real, g };
      },
      draw(v) {
        const x0 = 20, x1 = 350, y0 = 226, X = (p) => x0 + ((x1 - x0) * p) / 10, Y = (y) => y0 - (y * 160) / 5;
        const M = [], T = [];
        for (let p = 0; p <= 10; p += 0.25) {
          const r = this.at(p, v.a);
          M.push([X(p), Y(r.M)]);
          T.push([X(p), Y(r.T)]);
        }
        const r = this.at(v.p, v.a);
        let s = polyline(M, C.amber, 2.6) + polyline(T, C.green, 2.6);
        s += '<line x1="' + X(v.p) + '" x2="' + X(v.p) + '" y1="48" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2"/><circle cx="' + X(v.p) + '" cy="' + Y(r.M) + '" r="5" fill="' + C.amber + '"/><circle cx="' + X(v.p) + '" cy="' + Y(r.T) + '" r="5" fill="' + C.green + '"/>';
        s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '" stroke="' + C.line + '"/>' + t(x0, 16, "— the number that is rewarded", { c: C.amber, a: "start", fs: 12 }) + t(x0, 33, "— the real thing it was meant to track", { c: C.green, a: "start", fs: 12 }) + t(185, y0 + 20, "reward riding on the number →", { c: C.mut, fs: 12 });
        return svg(360, 254, s, "A rewarded number and the real outcome as pressure rises");
      },
      read(v) {
        const r = this.at(v.p, v.a), base = this.at(0, v.a);
        return "Toy model, not data. At this pressure the number is **×" + r1(r.M / base.M) + "** its starting value; the real thing is **×" + r1(r.T / base.T) + "**. Share of effort going into gaming: **" + Math.round(r.g * 100) + "%**.";
      },
    },
    // Semmelweis: pick an explanation, see what it predicts against what was observed
    hypo: {
      controls: [{ id: "h", label: "Explanation", min: 0, max: 4, step: 1, value: 0, fmt: (x) => ["bad air over the city", "overcrowding", "the priest's bell", "lying on the back", "something on the hands"][x] }],
      H: [
        ["Bad air over the city (an epidemic influence)", [0, 0, 0, 1]],
        ["Overcrowding", [0, 0, 0, 1]],
        ["Fear from the priest's bell passing through the First Clinic", [1, 0, 0, 1]],
        ["Giving birth lying on the back", [1, 0, 0, 1]],
        ["Material carried on the hands of doctors and students from autopsies", [1, 1, 1, 1]],
      ],
      O: ["The two clinics share one building and one city, and admit on alternate days, yet one kills about three times more mothers", "Women who gave birth in the street on the way in (not examined) rarely died", "When the hands were washed in chlorine (1847), First Clinic deaths fell to the midwives' level", "The difference is too large and steady to be chance (tens of thousands of births)"],
      draw(v) {
        const [name, fit] = this.H[v.h];
        const head = wrap(name, 44);
        let s = lines(180, 18, head, { c: C.lime, fs: 13 }, 17), y = 18 + head.length * 17;
        this.O.forEach((o, i) => {
          const ok = fit[i], L = wrap(o, 42), h = 14 + L.length * 16;
          s += box(6, y, 348, h, ok ? C.green : C.pink) + t(22, y + h / 2 + 6, ok ? "✓" : "✗", { c: ok ? C.green : C.pink, fs: 17, fw: 900 }) + lines(38, y + 19, L, { a: "start", fs: 12, fw: 600 });
          y += h + 8;
        });
        return svg(360, y, s, "Which observations an explanation can account for");
      },
      read(v) {
        const fit = this.H[v.h][1], n = fit.filter(Boolean).length;
        return "This explanation accounts for **" + n + " of 4** observations." + (n === 4 ? " Only one candidate fits them all, and it made a risky prediction (wash hands → deaths fall) that could have failed and did not." : " An observation it cannot explain is worth more than any number it can.");
      },
    },
  };

  /* ═══════════════ SESSIONS ═══════════════ */
  const sessions = [];

  /* ─── 1 · commit ─── */
  sessions.push({
    id: "commit",
    primitive: "commit",
    atoms: ["selfmodel", "strategy", "constraint"],
    title: "Tying your own hands",
    hook: "Why would a rational person deliberately tie their own hands?",
    minutes: 24,
    why: "First because you can use it **tonight** (your own study, sleep and phone), it crosses economics, psychology, history and politics, and its evidence base is strong: two field experiments with real money.",
    capability: "Spot when your future self will want something your present self does not, and build a constraint that holds.",
    stakes: "Most of the gap between what you plan and what you do is not ignorance or laziness. It is two versions of you with different preferences. The one who plans can win, but only by designing, not by promising.",
    bridge: "The missing step: your preference between the same two things **changes as they get closer**. Far away, you prefer the bigger-later; up close, the smaller-sooner. So the person who plans (far away) knows something the person who chooses (up close) will not act on. The plan must therefore **remove or price** the up-close option in advance.",
    connection: "Session 4 (feedback loops): a late-night habit is a reinforcing loop; a commitment device is how you cut the loop at its cheapest point.",
    vocab: {
      present: { name: "present bias", h: "The reward in front of you looks bigger than it really is to you.", s: "اللي قدامك دلوقتي دايمًا شكله أحلى من حجمه الحقيقي.", t: "Over-weighting of immediate outcomes relative to delayed ones, beyond what a constant discount rate implies." },
      inconsist: { name: "time inconsistency", h: "Your plan for later and your choice when later arrives disagree.", s: "خطتك النهاردة وقرارك بكرة مش متفقين.", t: "A preference between the same two dated options reverses as the decision date approaches (typical of hyperbolic discounting)." },
      device: { name: "commitment device", h: "A decision you make now that limits or prices what your future self can choose.", s: "تربط إيدك دلوقتي عشان متضعفش بعدين.", t: "A voluntary arrangement that restricts or penalises future options in order to enforce a present plan." },
      discount: { name: "discounting", h: "How much less a reward is worth to you because it comes later.", s: "كل ما الحاجة تبعد، قيمتها في دماغك تقل.", t: "The weight on a delayed outcome relative to an immediate one, as a function of the delay." },
      hatch: { name: "escape hatch", h: "A narrow exception agreed in advance, so the device does not break when life genuinely changes.", s: "باب طوارئ صغير، مش باب هروب.", t: "A pre-specified, costly or verifiable release condition (an original term used in this course)." },
    },
    provenance: [
      { id: "odyssey", claim: "Odysseus has the crew's ears stopped with wax, is bound to the mast, and orders that if he begs to be freed they bind him tighter.", source: "Homer, Odyssey, Book XII (Samuel Butler's 1900 English translation is public domain)", year: "c. 8th c. BCE", kind: "paraphrase", license: "public domain (paraphrased, not quoted)", grade: "A", note: "Paraphrase; the Gutenberg text could not be fetched from this build machine, so nothing is quoted." },
      { id: "smart", claim: "Save More Tomorrow: 78% of those offered joined; 98% stayed through two pay rises; average saving rate rose from 3.5% to 11.6% over 28 months.", source: "Thaler R. & Benartzi S., Journal of Political Economy 112:S164", year: "2004", kind: "scholarship", license: "fact", grade: "B" },
      { id: "cares", claim: "CARES: smokers deposited their own money, forfeited if a urine test at 6 months showed nicotine; 11% of those offered took it; those offered were 3 percentage points more likely to pass; the effect held in surprise tests at 12 months.", source: "Giné X., Karlan D. & Zinman J., AEJ: Applied Economics 2(4):213", year: "2010", kind: "scholarship", license: "fact", grade: "B" },
      { id: "kirby", claim: "People's choices between smaller-sooner and larger-later rewards reverse as both are delayed: preference reversals consistent with hyperbolic discounting.", source: "Kirby K. & Herrnstein R., Psychological Science 6:83 (not re-checked in this build)", year: "1995", kind: "scholarship", license: "fact", grade: "B" },
      { id: "kydland", claim: "Policy makers who can re-decide each period face a time-inconsistency problem; binding rules can beat discretion. Part of the case for independent central banks.", source: "Kydland F. & Prescott E., Journal of Political Economy 85:473 (not re-checked in this build)", year: "1977", kind: "scholarship", license: "fact", grade: "B" },
      { id: "gym", claim: "Many gym members on flat monthly contracts attend so rarely that pay-per-visit would have cost them less.", source: "DellaVigna S. & Malmendier U., 'Paying not to go to the gym', American Economic Review 96:694 (not re-checked in this build)", year: "2006", kind: "scholarship", license: "fact", grade: "B" },
      { id: "cortes", claim: "In 1519 Cortés had most of his ships stripped and sunk (scuttled), not burned; the burning version is a later embellishment.", source: "Historians' consensus (e.g. Hugh Thomas, Conquest, 1993), via search in this build", year: "1519", kind: "scholarship", license: "fact", grade: "B" },
    ],
    steps: [
      { id: "c1", type: "scene", stage: "hook", min: 2, src: ["odyssey"], title: "A man who wanted to hear the song and live", body: "Homer's Odysseus is warned about the **Sirens**: their song is so beautiful that every sailor who hears it steers onto the rocks. He wants to hear it anyway, and survive.\n\nHis plan has three parts. The crew stop their ears with **wax**. He has himself **tied to the mast**. And one more order, given while he is still calm: **if I beg you to untie me, tie me tighter.**\n\n(Told in our own words from Book XII of the *Odyssey*.)", reps: [{ kind: "diagram", label: "Two versions of one man", svg: "sirens", body: "The calm Odysseus designs rules for the Odysseus who will hear the song. Every rule is aimed at **him**, not at the Sirens." }, { kind: "story", label: "Your version", body: "10 pm you: *tomorrow I sleep by midnight.* 12:40 am you: *one more video.* Both are you. Only one of them is awake when the plan is made." }] },
      {
        id: "c2", type: "q", kind: "predict", stage: "predict", min: 2, src: ["odyssey"],
        stem: "Why is the last order (“if I beg, tie me tighter”) the clever part of the plan?",
        alt: "Ask: at the moment of the song, **who** is the danger to the ship?",
        options: [
          { t: "He knows he'll change his mind, so he decides now which self to obey", ok: true, why: "The rope alone is not enough: he is the captain and could order it untied. The order removes his own authority at the moment it will be misused." },
          { t: "He doesn't trust the crew, so he takes charge of the ropes himself", bug: "agent", why: "The crew have wax in their ears and no reason to act. The risk at the song is **him**." },
          { t: "He wants to prove his willpower by hearing the song and still resisting it", bug: "willpower", why: "The plan works because it does **not** rely on willpower. If willpower were enough, he would not need the rope." },
          { t: "It makes no difference who decides, because the ropes do all the work", bug: "omission", why: "A captain's order can untie any rope. Without the order, the rope has an exit: his own command." },
        ],
        after: "This is the whole idea in one scene: a **present self** who can see clearly, a **future self** who will want something else, and a rule built now to bind the later self.",
      },
      { id: "c3", type: "scene", stage: "reveal", min: 2, src: ["kirby"], terms: ["present", "inconsist", "discount"], title: "Why the later you disagrees with the earlier you", body: "Offer people 100 EGP today or 120 EGP in a week: many take the 100. Push the **same** choice a year away (100 in 52 weeks, 120 in 53): most now wait for the 120.\n\nNothing about the money changed. Only the distance did. Far away, a week's delay looks tiny; up close, it looks huge. So your ranking **flips** as the day approaches. The name for this family of findings is [[inconsist|time inconsistency]], and the pull of the nearest reward is [[present|present bias]].", reps: [{ kind: "numbers", label: "In numbers", body: "A common model: a reward A delayed D days feels worth A / (1 + 0.1·D).\n\nOn the day: 100 feels 100; 120-in-a-week feels 120/1.7 ≈ **71** → take the 100.\n\n60 days out: 100 feels 100/7 ≈ **14.3**; 120 feels 120/7.7 ≈ **15.6** → plan to wait." }, { kind: "analogy", label: "An analogy", body: "Two buildings, one tall and far, one short and near. From far away you see which is taller. Walk right up to the short one and it blocks the whole sky. The heights never changed; your distance did." }] },
      { id: "c4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["kirby"], stem: "Before touching the model: as the choice gets closer, what happens to someone who plans to wait for the 120?", options: [{ t: "Before the day comes, the 100 starts to look better: the plan flips", ok: true, why: "That is the reversal the model will show you." }, { t: "Nothing changes, because a sensible person keeps the same preference all along", bug: "consistency", why: "That is the textbook (exponential) agent. Real choices are measured to reverse." }, { t: "The 120 looks better and better the closer the day gets, so waiting gets easier", bug: "inversion", why: "The opposite: the nearer reward gains the most as it approaches." }] },
      { id: "c5", type: "model", stage: "model", min: 3, model: "discount", src: ["kirby"], title: "Drag the day closer", body: "Start 60 days away. Move the slider towards 0 and watch which reward wins. Then switch on the textbook agent.", ask: "**Find the flip.** Where does the pink line (now) rise above the blue (wait)? Does the textbook agent ever flip?", terms: ["discount"] },
      {
        id: "c6", type: "contrast", stage: "contrast", min: 3, src: ["smart", "cares"], title: "Two real designs, two continents", body: "Both were tested in the field with real money.",
        left: { title: "Save More Tomorrow (USA)", body: "Employees agree **now** to save a slice of their **future** pay rises. Nothing leaves today's pay. **78%** of those offered joined; average saving rose from **3.5% to 11.6%** over 28 months." },
        right: { title: "CARES (the Philippines)", body: "Smokers put **their own money** in an account; it goes to charity unless a urine test at 6 months is clean. Only **11%** signed up, but those offered were **3 points** more likely to quit, and it lasted to 12 months." },
        q: {
          stem: "What do the two designs share underneath?",
          options: [
            { t: "A calm self decides in advance and makes the tempting choice automatic or costly", ok: true, why: "SMarT makes saving the default before the raise arrives; CARES puts a price on the cigarette at the moment of temptation." },
            { t: "Both pay people a bonus for behaving well, so the money does the persuading", bug: "surface", why: "Nobody is paid. In CARES the smoker risks **his own** money; SMarT pays nothing at all." },
            { t: "Both train stronger willpower through repeated practice at resisting temptation", bug: "willpower", why: "Neither trains anything. Both change the **situation** the later self will face." },
            { t: "Both are really about health and money, the two things people care most about", bug: "surface", why: "One is about money, one about health: the topic is the surface; the mechanism is the same." },
          ],
          after: "Notice the 11%: most smokers did **not** want to bind themselves. People often don't expect their own future weakness. A device only helps those who see the flip coming.",
        },
      },
      { id: "c7", type: "scene", stage: "reveal", min: 1.5, opt: true, src: ["cortes"], terms: ["device", "hatch"], title: "Where devices break", body: "A [[device|commitment device]] can fail in two opposite ways.\n\n**Too loose:** an exit costs nothing (an app timer you can dismiss with one tap). The later self simply takes the exit.\n\n**Too tight:** no exit even when life genuinely changes (a real emergency). Then you abandon the whole device. Good designs keep a narrow, costly [[hatch|escape hatch]].", reps: [{ kind: "counterexample", label: "A myth, checked", body: "“Cortés burned his ships so his men could not retreat” is the famous version. Historians find he had most of them **stripped and sunk**, not burned. The mechanism (removing the retreat) is real; the vivid detail is not. Good stories drift; check them." }] },
      { id: "c8", type: "q", kind: "transfer", stage: "transfer", min: 1.5, stem: "You want to stop checking your phone during a study block. Which is a real commitment device?", options: [{ t: "Leave the phone with a friend who gives it back at 10 pm", ok: true, why: "The later self cannot get it without a real cost (asking, waiting)." }, { t: "Promise yourself firmly, and write the promise down, to be strong this time", bug: "willpower", why: "A promise binds the self that makes it, not the self who breaks it." }, { t: "Install a focus app that blocks the phone, which you can switch off with one tap", bug: "cheapexit", why: "The exit costs one tap, which the tempted self will pay." }, { t: "Put a photo of your goal on the wall so you see it every evening", bug: "omission", why: "A reminder informs; it does not constrain. The flip happens anyway." }] },
      { id: "c9", type: "q", kind: "far", stage: "far", min: 2, src: ["kydland"], stem: "Many countries hand interest-rate decisions to a central bank their own government cannot easily overrule. Why would a government give away its own power?", options: [{ t: "To bind itself against a predictable temptation, like easy money before elections", ok: true, why: "Kydland and Prescott (1977) showed that a policy-maker free to re-decide each period does worse than one bound to a rule: the same flip, at the scale of a state." }, { t: "Because economists are better qualified than politicians to decide interest rates", bug: "authority", why: "The argument does not need smarter bankers; it needs a decision-maker who cannot be tempted at the moment of choice." }, { t: "To save money, since an independent bank needs fewer politicians and staff", bug: "surface", why: "Irrelevant to the mechanism." }, { t: "Because every country's constitution requires an independent central bank", bug: "omission", why: "It is a choice many states made, for this reason." }] },
      {
        id: "c10", type: "forge", stage: "forge", min: 3, title: "Build one for your own week", body: "Pick one part in each row. The machine will tell you which part will break first.",
        slots: [
          { key: "target", label: "The moment you want to protect", options: [{ t: "the 1 am scroll", grade: "good", note: "A clear, recurring moment: the best kind to bind.", say: "the 1 am scroll" }, { t: "starting the MCQ block late", grade: "good", note: "Recurring and specific: good.", say: "starting the MCQ block late" }, { t: "being more productive in general", grade: "bad", note: "Too vague to bind: a device needs a specific moment.", say: "being more productive" }] },
          { key: "constraint", label: "What makes the tempting option hard", options: [{ t: "phone charges outside the bedroom from 00:30", grade: "good", note: "A physical barrier at the exact moment of temptation.", say: "the phone charges outside the bedroom from 00:30" }, { t: "I'll try harder", grade: "bad", note: "Willpower is what fails at the moment; this is not a constraint.", say: "I will try harder" }, { t: "an app limit I can dismiss", grade: "weak", note: "An exit that costs one tap will be taken.", say: "an app limit is on" }] },
          { key: "enforcer", label: "Who or what holds you to it", options: [{ t: "a friend who checks at 7 am", grade: "good", note: "Another person makes the break visible.", say: "a friend checks at 7 am" }, { t: "10 EGP to a cause I dislike per break", grade: "good", note: "A price you chose in advance, like CARES.", say: "each break costs 10 EGP to a cause I dislike" }, { t: "nothing, just me", grade: "bad", note: "The enforcer would be the same self who breaks it.", say: "nobody checks" }] },
          { key: "hatch", label: "The escape hatch", options: [{ t: "only a real emergency call, and I tell my friend", grade: "good", note: "Narrow, visible, costly: the hatch stays a hatch.", say: "only for a real emergency, reported to my friend" }, { t: "none: never, whatever happens", grade: "weak", note: "Too tight: the first genuine exception will kill the whole device.", say: "there is no exception" }, { t: "whenever I really feel like it", grade: "bad", note: "That is the tempted self's exit, not a hatch.", say: "I can skip it whenever I feel like it" }] },
        ],
        template: "Protecting **{target}**: {constraint}; {enforcer}; exception: {hatch}.",
        critique: { stem: "Three weeks in, the device annoys you and you want to cancel it at midnight. What does today's idea say?", options: [{ t: "That's the self it was built against: change rules only at a calm time", ok: true, why: "For example, only on Sunday morning, never at night. Decide rules when you can see the whole voyage, never at the song." }, { t: "Cancel it: a rule that annoys you every night is a badly designed rule", bug: "inversion", why: "Annoyance at the moment of temptation is the device working." }, { t: "Replace it with a stronger promise that you repeat to yourself each evening", bug: "willpower", why: "A promise is the weakest device there is." }] },
      },
    ],
    challenge: { stem: "Why do some people put their alarm clock across the room?", options: [{ t: "So the sleepy morning self must get up: the evening self decided", ok: true }, { t: "Because an alarm sounds louder and clearer from across the room", bug: "surface" }, { t: "To build willpower by making mornings deliberately a little harder", bug: "willpower" }] },
    hooks: [
      { id: "commit.h1", gap: 1, q: { stem: "Why does a plan made far ahead often flip when the moment arrives?", options: [{ t: "Up close, the nearer reward gains weight much faster than the later one", ok: true }, { t: "Because new information about the rewards always arrives as the day nears", bug: "omission" }, { t: "Because people get lazier as a deadline approaches and grab the easy option", bug: "moral" }], after: "The distance changed, not the rewards." } },
      { id: "commit.h2", gap: 7, q: { stem: "Many people buy a monthly gym contract, then go so rarely that pay-per-visit would have been cheaper. Which idea explains it best?", options: [{ t: "They paid for a future self who would go often; that self rarely went", ok: true, why: "The self who signs up plans to go; the self on a cold evening prefers the sofa. DellaVigna & Malmendier (2006) found this pattern in real gym data." }, { t: "Gyms hide the real price in fees, so members misjudge what they pay", bug: "agent" }, { t: "People don't care about money once they've signed a monthly contract", bug: "moral" }] } },
      { id: "commit.h3", gap: 30, q: { stem: "A good commitment device has an exit that is…", options: [{ t: "narrow and costly, agreed in advance", ok: true }, { t: "absent, so it can never be broken", bug: "rigid" }, { t: "easy to switch off, so it never annoys you", bug: "cheapexit" }] } },
    ],
    deeper: [
      { title: "The formal version", body: "Exponential discounting: value = A·e^(−rD). Two options keep the same ranking at every distance. Hyperbolic: value = A/(1+kD). The ratio of the two values changes with D, so the ranking can flip. With k = 0.1 per day, 100-on-the-day vs 120-a-week-later flips about **25 days** out: solve 100(1+k(D+7)) = 120(1+kD)." },
      { title: "Naive vs sophisticated", body: "A **sophisticated** person knows the flip is coming and buys a device; a **naive** one does not and over-commits (the gym contract). The low 11% take-up of CARES fits this: most smokers did not expect to need it." },
      { title: "Open question", body: "Is present bias one trait, or different for money, effort, food and sleep? Field estimates vary widely by domain; this is not settled." },
    ],
  });

  /* ─── 2 · select ─── */
  sessions.push({
    id: "select",
    primitive: "select",
    atoms: ["info", "causal", "measure"],
    title: "The planes that came back",
    hook: "Bombers came home full of holes: wings, body, tail, few in the engines. You have armour for one area. Where?",
    minutes: 23,
    why: "Second because it changes how you read **every** piece of data or advice from now on, including medical case series, and it trains the most useful single question in reasoning: *what filter did this pass through before it reached me?*",
    capability: "Before trusting data or advice, ask what process selected it, and picture what was filtered out.",
    stakes: "Most bad conclusions don't come from bad logic. They come from good logic applied to a sample that was filtered by the very outcome you care about.",
    bridge: "The missing step: you can only inspect planes that **returned**. A plane hit in the engine mostly **didn't** return. So the planes in front of you are a sample chosen by survival, and survival depended on where they were hit.",
    connection: "Session 6 (Semmelweis): the supplement question comes back, and filtered evidence is exactly what a good test avoids.",
    vocab: {
      selbias: { name: "selection bias", h: "The data you see was filtered before it reached you, so it misleads.", s: "الداتا اللي وصلتلك عدّت من غربال قبل ما تشوفها.", t: "Systematic distortion arising when the process that includes cases in a sample is related to the outcome studied." },
      surv: { name: "survivorship bias", h: "You only see the ones that made it; the failures are silent.", s: "بتشوف اللي نجي بس، واللي وقع مش بيتكلم.", t: "Selection bias in which only cases that passed a survival filter are observed." },
      sample: { name: "sample", h: "The part you actually looked at, standing in for the whole.", s: "الحتة اللي شفتها من الصورة الكاملة.", t: "A subset of a population from which inferences about the population are drawn." },
      berkson: { name: "Berkson's paradox", h: "A filter can create a link between two things that are unrelated in everyone.", s: "الفلتر نفسه بيعمل علاقة مش موجودة.", t: "A spurious (often negative) association induced by conditioning on a variable influenced by both factors." },
    },
    provenance: [
      { id: "wald", claim: "Abraham Wald, at Columbia's Statistical Research Group, wrote memoranda (1943) on estimating which parts of an aircraft are most vulnerable using damage on the planes that survived.", source: "Wald A., A Method of Estimating Plane Vulnerability Based on Damage of Survivors (SRG, 1943; reprinted by CNA, 1980; DTIC ADA091073)", year: "1943", kind: "primary", license: "fact", grade: "A" },
      { id: "waldpic", claim: "The widely shared bomber picture with red dots is a modern illustration, not a figure from Wald's memoranda; his memos are mathematical.", source: "Comparison of the CNA reprint with the popular image", year: "—", kind: "scholarship", license: "fact", grade: "B" },
      { id: "berkson", claim: "In hospital samples, two diseases can appear associated even when they are not in the population, because both raise the chance of admission.", source: "Berkson J., Biometrics Bulletin 2:47 (not re-checked in this build)", year: "1946", kind: "scholarship", license: "fact", grade: "B" },
    ],
    steps: [
      { id: "s1", type: "scene", stage: "hook", min: 2, src: ["wald", "waldpic"], title: "Armour is heavy", body: "World War II. Every kilogram of armour costs speed, range and bombs, so you can protect only part of a plane. The planes that return from missions are covered in bullet holes, and the holes are **not** evenly spread: many in the wings and body, fewer near the engines.\n\nA statistician named **Abraham Wald**, working for the US Statistical Research Group, was asked this kind of question.", reps: [{ kind: "story", label: "What is and isn't known", body: "Wald's 1943 memoranda are real and were reprinted in 1980. The famous picture of a bomber covered in red dots is a **modern drawing** made to tell the story, not his data. The numbers in today's model are toy numbers with his logic." }] },
      { id: "s2", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["wald"], stem: "Where would you put the armour?", alt: "Think about the planes you **cannot** inspect.", options: [{ t: "Around the engines, where the returning planes show fewest holes", ok: true, why: "The holes on returning planes mark where a plane can be hit **and still come home**." }, { t: "On the wings and body, where the returning planes show the most holes", bug: "selection", why: "That armours the places that proved survivable. The sample was chosen by survival." }, { t: "Spread evenly over the plane, since bullets hit it more or less at random", bug: "omission", why: "The hits may be random; the **survival** is not. That is the whole point." }, { t: "Nowhere: the holes show the plane is tough enough", bug: "selection", why: "Only the tough cases are in front of you." }] },
      { id: "s2b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "Suppose every hit, anywhere, were equally likely to bring a plane down. What pattern would the planes that came back show?", options: [{ t: "The same spread of holes as all the planes", ok: true, why: "If survival doesn't depend on where the plane was hit, the survivors are a fair sample of where hits land." }, { t: "Still few engine holes, just like the returning planes", bug: "selection", why: "Only if engine hits are deadlier. Take that away and the gap disappears." }, { t: "Far more engine holes than anywhere else on the plane", bug: "inversion", why: "Nothing in the setup makes engine hits more survivable." }], after: "Keep this prediction: the model's danger slider lets you check it." },
      { id: "s3", type: "model", stage: "model", min: 3, model: "planes", src: ["wald"], title: "Bring back the missing planes", body: "Each plane takes three hits, spread by area. Engine hits are dangerous; other hits rarely are. First look only at the planes that came home. Then switch on the missing ones.", ask: "**Before you switch:** count the engine holes (amber) on the returning planes. Then compare with all planes. Try the danger slider at 0%: what happens to the difference?", terms: ["sample"] },
      { id: "s4", type: "scene", stage: "reveal", min: 2, terms: ["selbias", "surv", "sample"], title: "The question to ask of any data", body: "The data you see was produced by a process. If that process **depends on the outcome** you care about, the data will lie to you in a predictable direction. This is [[selbias|selection bias]]; when the filter is survival, it's [[surv|survivorship bias]].\n\nThe habit: before reading the numbers, ask **what had to happen for this case to reach me?** Then picture the cases that didn't.", reps: [{ kind: "counterexample", label: "When there is no bias", body: "Set the danger slider to 0%. Now surviving does not depend on where the plane was hit, so the returning planes show the same pattern as all planes. **No filter linked to the outcome, no bias.** The bias is not in having a sample; it is in how the sample was chosen." }, { kind: "analogy", label: "An analogy", body: "A nightclub bouncer lets in only people wearing black shoes. Inside, you notice everyone wears black shoes and conclude it's the town's fashion. The bouncer made your data." }] },
      {
        id: "s5", type: "contrast", stage: "contrast", min: 2.5, title: "Two pieces of advice you've heard", body: "Same structure, very different topics.",
        left: { title: "“Drop out and build a company”", body: "Famous founders who left university are interviewed everywhere. The far larger number who dropped out and failed are never interviewed." },
        right: { title: "“Old buildings were built better”", body: "The old buildings still standing are solid. The badly built ones of the same era fell down or were demolished long ago." },
        q: { stem: "What do these share?", options: [{ t: "In both, the cases you see were filtered by the outcome being judged", ok: true, why: "Survival picked the sample, then the sample is used to judge what causes survival." }, { t: "Both look backwards, and the past is always remembered as better than it was", bug: "surface", why: "Time is a surface feature; the filter is the mechanism." }, { t: "Both show that success is mostly random, so neither advice nor age matters", bug: "inversion", why: "They show nothing about randomness; they show a filtered sample." }, { t: "Both are simply false claims that spread because they flatter people", bug: "omission", why: "Some old buildings are excellent. The problem is the inference, not every fact." }] },
      },
      { id: "s6", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "Hospital A's surgeons have higher death rates than Hospital B's for the same operation. Your relative needs it. What first?", options: [{ t: "Ask which patients each hospital receives before comparing", ok: true, why: "A referral centre may receive the sickest cases. If A takes the hardest cases, a higher death rate can hide better surgery. Compare like with like." }, { t: "Choose hospital B, because its survival numbers are clearly better", bug: "selection", why: "The numbers compare different patients." }, { t: "Choose hospital A, because famous hospitals attract the best surgeons", bug: "authority", why: "Fame is not evidence." }, { t: "Ignore the statistics, since every patient's case is unique", bug: "omission", why: "The fix is better comparison, not no comparison." }] },
      { id: "s7", type: "q", kind: "far", stage: "far", min: 2, src: ["berkson"], terms: ["berkson"], stem: "A university admits students who are either very talented or very hard-working (or both). Inside it, talented students seem to work less. Why?", options: [{ t: "Admission excluded anyone low on both, which creates the pattern", ok: true, why: "Among the admitted, low talent implies high effort and vice versa. The filter made the link: [[berkson|Berkson's paradox]]." }, { t: "Talented students become lazy because things come easily to them", bug: "inversion", why: "The pattern appears even if talent and effort are unrelated in everyone." }, { t: "Hard workers resent the talented and push them out of study groups", bug: "moral", why: "A story, not a mechanism; the filter explains it without any psychology." }, { t: "It's a coincidence of this year's intake that would vanish next year", bug: "omission", why: "It is predictable, not coincidental." }] },
      {
        id: "s8", type: "forge", stage: "forge", min: 3, title: "Audit a claim", body: "Pick a claim you might hear, the filter behind it, and the missing planes you'd need.",
        slots: [
          { key: "claim", label: "The claim", options: [{ t: "“People who take vitamin D are healthier”", grade: "good", note: "A classic: healthier, wealthier people are the ones who take supplements.", say: "people who take vitamin D are healthier" }, { t: "“Everyone I know who studied abroad got rich”", grade: "good", note: "Who studies abroad, and whom do you know?", say: "everyone I know who studied abroad got rich" }, { t: "“Top students all use method X”", grade: "good", note: "Do weak students use it too?", say: "top students all use method X" }] },
          { key: "filter", label: "The filter", options: [{ t: "who ends up in the group was already different before the thing happened", grade: "good", note: "Right: selection before the outcome.", say: "the people in the group were different to begin with" }, { t: "the claim is false", grade: "bad", note: "You don't know that yet; the question is whether the data can show it.", say: "it is false" }, { t: "the sample is small", grade: "weak", note: "Size isn't the main problem: a huge filtered sample misleads just as well.", say: "the sample is small" }] },
          { key: "missing", label: "The missing planes you'd want", options: [{ t: "the same comparison in people who didn't choose it, matched or randomly assigned", grade: "good", note: "Now the filter is broken.", say: "a comparison group that did not choose it, ideally assigned at random" }, { t: "more stories from people it worked for", grade: "bad", note: "More survivors, same filter.", say: "more success stories" }, { t: "an expert's opinion", grade: "weak", note: "Useful context, not a fix for the filter.", say: "an expert's opinion" }] },
        ],
        template: "Claim: **{claim}**. The catch: {filter}. What would settle it: {missing}.",
        critique: { stem: "You find a big study showing the vitamin D link in 100,000 people. Does size fix the problem?", options: [{ t: "No: a larger filtered sample gives a more precise wrong answer", ok: true }, { t: "Yes: with 100,000 people, any error averages out", bug: "selection", why: "Size shrinks random error, not the filter: the same kind of people still choose the pill." }, { t: "Yes, as long as it is published in a respected journal", bug: "authority", why: "Publication checks the method was reported, not that the filter was broken." }] },
      },
    ],
    challenge: { stem: "Old songs from the 1970s seem better on average than today's songs. Most likely reason?", options: [{ t: "Only the old songs people still play reached you; the rest were forgotten", ok: true }, { t: "Musicians were more talented then, and trained longer before recording", bug: "selection" }, { t: "Modern recording equipment makes today's songs sound flatter and worse", bug: "surface" }] },
    hooks: [
      { id: "select.h1", gap: 1, q: { stem: "Why were the engines, not the wings, the place to armour?", options: [{ t: "Engine-hit planes mostly didn't return, so their holes were missing", ok: true }, { t: "Engines are the most expensive part, so they deserve the armour", bug: "surface" }, { t: "The wings already had armour, so the engines were next in line", bug: "omission" }] } },
      { id: "select.h2", gap: 7, q: { stem: "A course advertises: “90% of our graduates pass the exam.” The first question to ask?", options: [{ t: "Who got in and who dropped out before graduating", ok: true }, { t: "How good the teachers are and how much they are paid", bug: "authority" }, { t: "Whether 90% is higher than last year's figure", bug: "selection" }] } },
      { id: "select.h3", gap: 30, q: { stem: "When does a sample NOT mislead about the outcome, even if it is small?", options: [{ t: "When how cases got in has nothing to do with the outcome", ok: true }, { t: "When it is large enough for the random errors to cancel out", bug: "selection" }, { t: "When an experienced expert collected it carefully by hand", bug: "authority" }] } },
    ],
    deeper: [
      { title: "What Wald actually did", body: "The memoranda estimate, from hit counts on survivors, the probability that a hit on each area downs a plane. The intuition is the missing-planes logic; the method is statistics. The one-line version (armour where the holes aren't) is the popular summary." },
      { title: "Medicine's version", body: "Case series from specialist centres, studies of only people who completed a treatment, and 'healthy user' effects are all selection filters. Randomised trials exist largely to break the filter." },
    ],
  });

  /* ─── 3 · base ─── */
  sessions.push({
    id: "base",
    primitive: "base",
    atoms: ["prob", "represent", "calib"],
    title: "The test says positive",
    hook: "A test for a rare disease is 90% accurate. Yours is positive. How worried should you be?",
    minutes: 23,
    why: "Third because the error is common among doctors and judges and it will matter in your own medical career; and because one representation (counting people) turns an 'impossible' calculation into a two-line one.",
    capability: "Turn any 'the test is X% accurate' statement into counts of people, and read what a positive result really means.",
    stakes: "Real patients have been frightened by positives that were probably false, and a real mother went to prison partly because a rare-looking number was read backwards.",
    bridge: "The missing step: 90% is about **sick people** (how many of them test positive). Your question is about **positive people** (how many of them are sick). Those are different groups, and the second one is flooded by healthy people who were flagged, because healthy people are the vast majority.",
    connection: "Session 2: the positives are a filtered group too. Session 6: Semmelweis's numbers were counts, which is why they were convincing.",
    vocab: {
      baserate: { name: "base rate", h: "How common the thing is before any test.", s: "قبل ما تبص على التحليل: المرض ده أصلًا منتشر قد إيه؟", t: "The prior probability (prevalence) of a condition in the relevant population." },
      sens: { name: "sensitivity", h: "Of the people who have it, the share the test catches.", s: "من العيانين فعلًا، التحليل بيمسك كام؟", t: "P(test positive | condition present)." },
      fp: { name: "false positive", h: "The test says yes, but the person doesn't have it.", s: "التحليل قال عيان والراجل سليم.", t: "A positive result in a case without the condition; its rate is 1 − specificity." },
      ppv: { name: "positive predictive value", h: "Of the people who test positive, the share who really have it.", s: "التحليل طلع إيجابي: فرصة إنك عيان فعلًا كام؟", t: "P(condition present | test positive); depends strongly on prevalence." },
      natfreq: { name: "natural frequencies", h: "Say it as counts of people instead of percentages.", s: "حوّل النسبة لناس تتعد.", t: "Joint frequencies from a single reference population (e.g. 9 of 1,000), which keep base-rate information visible." },
      prosecutor: { name: "prosecutor's fallacy", h: "Treating 'this evidence would be rare if innocent' as 'innocence is rare'.", s: "ندرة الدليل لو بريء مش هي فرصة إنه بريء.", t: "Confusing P(evidence | innocence) with P(innocence | evidence)." },
    },
    provenance: [
      { id: "gh95", claim: "Stating the same information as natural frequencies instead of probabilities greatly increases correct Bayesian answers by people with no training.", source: "Gigerenzer G. & Hoffrage U., Psychological Review 102:684", year: "1995", kind: "scholarship", license: "fact", grade: "A" },
      { id: "eddy", claim: "When asked about a positive mammogram (prevalence 1%, sensitivity ~80%, false-positive rate ~10%), most physicians in Eddy's report gave answers near 75–80%; the correct value is under 10%.", source: "Eddy D., in Kahneman, Slovic & Tversky (eds.), Judgment under Uncertainty", year: "1982", kind: "scholarship", license: "fact", grade: "C", note: "An informal survey, often repeated; controlled studies later found the same error pattern." },
      { id: "clark", claim: "In the Sally Clark trial, a paediatrician put the chance of two cot deaths in such a family at 1 in 73 million by squaring 1 in 8,543; the Royal Statistical Society said there was no statistical basis for this; the convictions were quashed in January 2003.", source: "Court of Appeal (2003); Royal Statistical Society statement (2001)", year: "1999–2003", kind: "primary", license: "fact", grade: "A" },
    ],
    steps: [
      {
        id: "b1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["eddy"],
        stem: "1 in 100 people has a disease. The test catches **90%** of people who have it, and wrongly flags **9%** of people who don't. You test positive. What is the chance you have it?",
        alt: "Imagine **1,000 people** walking into the clinic. How many are sick? How many healthy ones get flagged?",
        options: [
          { t: "About 90%", bug: "inverse", why: "90% is the share of **sick people** who test positive. You asked about the share of **positive people** who are sick: a different group." },
          { t: "About 50%", bug: "baserate", why: "A compromise between the test and the rarity, but not a calculation." },
          { t: "About 9%", ok: true, why: "Out of 1,000: 10 sick, 9 of them positive; 990 healthy, about 89 of them flagged. 9 of 98 positives are sick." },
          { t: "About 1%", bug: "omission", why: "That ignores the test entirely. The positive does raise your chance, from 1% to about 9%." },
        ],
        after: "If you said 90%, you are in good company: in David Eddy's often-quoted 1982 report, most physicians gave a similar answer to a similar question.",
      },
      { id: "b2", type: "scene", stage: "reveal", min: 2, src: ["gh95"], terms: ["baserate", "sens", "fp", "ppv"], title: "Count people, not percentages", body: "Percentages hide **which group** they are about. Counts don't. Start with 1,000 people and let the numbers flow down the tree.\n\nThe [[sens|sensitivity]] (90%) is about the sick. The [[fp|false positives]] come from the healthy, and there are 99 times more healthy people. So a positive is **mostly** healthy people. What you wanted is the [[ppv|positive predictive value]], and it depends on the [[baserate|base rate]].", reps: [{ kind: "diagram", label: "The tree", svg: "tree", body: "Positives: 9 + 89 = 98. Sick among them: 9. **9 ÷ 98 ≈ 9%.**" }, { kind: "analogy", label: "An analogy", body: "A smoke alarm that goes off whenever you make toast. It catches every fire, but most of its alarms are toast, because you make toast far more often than you have fires." }, { kind: "counterexample", label: "Where it breaks: the wrong base rate", body: "The base rate must be for people like the one in front of you. A disease in 1 in 1,000 of the population may be present in 1 in 5 of the patients a specialist sees with the typical symptoms. Start from the right group, or the arithmetic is exact and the answer is wrong." }] },
      { id: "b2b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "Same rare disease (1 in 100). Imagine a test that **never** flags a healthy person, but still misses 10% of sick people. A positive now means…", options: [{ t: "Certainly sick: every positive is a true positive", ok: true, why: "With no false positives, the healthy majority can't flood the positives. The missed 10% only matter for negatives." }, { t: "Still about 9%, because the rate of disease hasn't changed", bug: "baserate", why: "The 9% came from healthy people being flagged; remove them and it changes completely." }, { t: "About 90%", bug: "inverse", why: "90% is still about the sick group, not the positive group." }], after: "So when a disease is rare, the false-positive rate matters more than the catch rate. The model will show it." },
      { id: "b3", type: "model", stage: "model", min: 3, model: "icons", src: ["gh95"], title: "1,000 people, three sliders", body: "Each dot is a person. Move the sliders and watch what a positive means.", ask: "**Try:** keep the test the same and move 'how common' from 1% to 50%. Then make the test perfect at catching (100%) but keep 9% false flags at 1% prevalence. Which slider matters most when the disease is rare?", terms: ["natfreq"] },
      {
        id: "b4", type: "contrast", stage: "contrast", min: 3, src: ["clark"], terms: ["prosecutor"], title: "A clinic and a courtroom",
        left: { title: "The screening clinic", body: "“The test flags only 9% of healthy people, so a positive probably means disease.” Wrong when disease is rare: most positives are healthy." },
        right: { title: "The Sally Clark trial (England, 1999)", body: "Two infant deaths. A paediatrician told the court the chance of two natural cot deaths was **1 in 73 million** (1 in 8,543, squared). Rare, so she must be guilty? The Royal Statistical Society protested; the convictions were **quashed in 2003**." },
        q: { stem: "What single error do both make?", options: [{ t: "Reading “rare if innocent” as “innocence is rare”", ok: true, why: "It treats “this evidence is rare if the innocent story is true” as “the innocent story is rare”. Double murder is also extremely rare. Compare the two stories against each other, not one against zero. That confusion is the [[prosecutor|prosecutor's fallacy]]." }, { t: "Using statistics at all in medicine and law", bug: "omission", why: "The fix is correct statistics, not none." }, { t: "Trusting experts' numbers without asking where they came from", bug: "authority", why: "The problem is the reasoning, whoever says it." }, { t: "Using numbers that are too small to be reliable in court", bug: "surface", why: "Size isn't the issue; the direction of the conditional is." }], after: "The trial number also had a second flaw: squaring assumed the two deaths were **independent**, but a shared genetic or environmental cause makes a second death far less surprising." },
      },
      { id: "b5", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "An airport scanner flags 1 in 1,000 innocent travellers and catches 99% of smugglers. About 1 traveller in a million is a smuggler. The alarm goes off. Probably a smuggler?", options: [{ t: "No: about 1,000 innocent people are flagged for each smuggler", ok: true, why: "Per million travellers. 1,000,000 travellers: ~1 smuggler (caught), ~1,000 innocents flagged. About 0.1%." }, { t: "Yes: a scanner that is 99% accurate is right almost every time", bug: "inverse", why: "99% is about smugglers; the alarm is mostly about innocents." }, { t: "50–50: either they smuggle or they don't", bug: "baserate", why: "Count it: 1 vs about 1,000." }] },
      { id: "b6", type: "q", kind: "far", stage: "far", min: 2, stem: "The **same** test (90% catch, 9% false flags) is now used in a clinic where half the patients already have classic symptoms. A positive now means…", options: [{ t: "Much more: with a 50% base rate, about 91% of positives are sick", ok: true, why: "Of 1,000: 500 sick → 450 positive; 500 healthy → 45 flagged. 450/495 ≈ 91%. Same test, different meaning." }, { t: "The same as before, because the test itself hasn't changed at all", bug: "baserate", why: "The test didn't change; the people walking in did." }, { t: "Less, because testing more people always adds more false alarms", bug: "inversion", why: "It's the proportion of sick people that changed, and it went up." }] },
      {
        id: "b7", type: "forge", stage: "forge", min: 3, title: "Make any percentage safe", body: "Build the counting habit for any 'accurate test' claim.",
        slots: [
          { key: "start", label: "Start with", options: [{ t: "1,000 people", grade: "good", note: "Round and big enough to avoid fractions.", say: "1,000 people" }, { t: "the test's accuracy", grade: "bad", note: "Starting from the test is how the error starts.", say: "the test's accuracy" }, { t: "one patient", grade: "weak", note: "One person gives fractions; counts need a crowd.", say: "one patient" }] },
          { key: "first", label: "First split", options: [{ t: "how many have the condition (base rate)", grade: "good", note: "Always the first branch.", say: "how many have it" }, { t: "how many test positive", grade: "weak", note: "You can't know that before knowing who is sick.", say: "how many test positive" }] },
          { key: "then", label: "Then", options: [{ t: "positives among the sick, and false positives among the healthy", grade: "good", note: "Both branches: that's where the flood of false positives appears.", say: "the positives in both branches" }, { t: "only the positives among the sick", grade: "bad", note: "That forgets the healthy majority: the whole error.", say: "only the sick branch" }] },
        ],
        template: "Start with **{start}**, split by **{first}**, then count **{then}**; finally: sick positives ÷ all positives.",
        critique: { stem: "A friend's genetic test says she has a 'variant linked to disease X' found in 1 in 5,000 people. What is the first number you ask for?", options: [{ t: "How often it wrongly flags people who don't carry it", ok: true, why: "With something that rare, even a small false-report rate can make most reported variants false." }, { t: "How serious disease X is, and whether it can be treated early", bug: "omission", why: "It matters later; first find out whether the result is probably true." }, { t: "Which company made the test and how well it is regulated", bug: "authority", why: "A brand is not a false-positive rate." }] },
      },
    ],
    challenge: { stem: "A lie detector is right 90% of the time. A company tests 1,000 honest applicants and 10 liars. Of those it calls liars, most are…", options: [{ t: "honest people (about 100 honest vs 9 liars flagged)", ok: true }, { t: "liars, since the detector is 90% accurate on liars", bug: "inverse" }, { t: "impossible to say without testing everyone twice", bug: "omission" }] },
    hooks: [
      { id: "base.h1", gap: 1, q: { stem: "Rare disease, good test, positive result. Why is the chance of disease often low?", options: [{ t: "The healthy vastly outnumber the sick, so their false positives dominate", ok: true }, { t: "Screening tests are usually wrong more often than they are right", bug: "inversion" }, { t: "Doctors often misread positive results when they are busy", bug: "agent" }] } },
      { id: "base.h2", gap: 7, q: { stem: "“The DNA match would happen by chance in 1 in a million people, so there's a 1 in a million chance he's innocent.” The flaw?", options: [{ t: "In a city of millions, several innocent people would match", ok: true, why: "The chance of innocence depends on the other evidence too." }, { t: "DNA evidence is unreliable and often contaminated in labs", bug: "surface" }, { t: "There is no flaw: one in a million is proof beyond doubt", bug: "inverse" }] } },
      { id: "base.h3", gap: 30, q: { stem: "The same test gives a more meaningful positive when…", options: [{ t: "the condition is more common in the people tested", ok: true }, { t: "more people are tested, so the numbers are more reliable", bug: "surface" }, { t: "a senior doctor orders it after examining the patient", bug: "authority" }] } },
    ],
    deeper: [
      { title: "Bayes' rule, once you've counted", body: "P(sick | +) = P(+ | sick)·P(sick) / [P(+ | sick)·P(sick) + P(+ | healthy)·P(healthy)] = 0.9·0.01 / (0.9·0.01 + 0.09·0.99) ≈ 0.092. The tree is this formula, drawn." },
      { title: "Why two tests help", body: "A second, independent test starts from the new base rate (~9%), not 1%. Positive twice: about 50%. Independence matters, the same trap as the Sally Clark squaring." },
    ],
  });

  /* ─── 4 · loop ─── */
  sessions.push({
    id: "loop",
    primitive: "loop",
    atoms: ["systems", "predict", "counter"],
    title: "The shower that won't settle",
    hook: "Why does a hotel shower swing from freezing to scalding when all you want is warm?",
    minutes: 23,
    why: "Fourth because loops are the grammar of physiology, economies and habits, and one variable (delay) explains a huge family of failures, from supply chains to your own late nights.",
    capability: "From a system's structure (what feeds back on what, with which delay), predict whether it will settle, swing or run away.",
    stakes: "Many 'people problems' are structure problems: smart people inside a loop with a delay make the same mistakes in every era. Seeing the loop is how you stop blaming and start fixing.",
    bridge: "The missing step: you react to the water **you feel now**, but it reflects where the knob was **seconds ago**. So you keep turning after you've already turned enough; by the time the heat arrives you've overdone it, and you correct the other way, too late again.",
    connection: "Session 1: a late-night habit is a reinforcing loop; a commitment device cuts it. Session 5: rewarding a number creates a loop between the number and behaviour.",
    vocab: {
      loop: { name: "feedback loop", h: "The result changes what happens next.", s: "النتيجة بترجع تأثر على اللي عملها.", t: "Output routed back as an input that influences subsequent behaviour of the system." },
      bal: { name: "balancing loop", h: "A loop that pushes back towards a goal.", s: "لفة بتصلّح نفسها وترجع للهدف.", t: "Negative feedback: deviations from a target produce corrections in the opposite direction." },
      rein: { name: "reinforcing loop", h: "A loop that amplifies itself: more leads to more.", s: "لفة بتكبّر نفسها: كل ما تزيد تزيد.", t: "Positive feedback: a change produces further change in the same direction." },
      delay: { name: "delay", h: "The effect of an action arrives late.", s: "الأثر بيوصل متأخر، فبتزود العيار على الفاضي.", t: "A lag between an action and its observable effect in a feedback system." },
      gain: { name: "gain", h: "How hard the system reacts to each error.", s: "قد إيه بتلف الحنفية مع كل غلطة.", t: "The proportional strength of a corrective response to a measured deviation." },
    },
    provenance: [
      { id: "sterman", claim: "People managing a simulated supply chain with delays (the Beer Game) produce large swings in inventory and tend to ignore the effects of their own past decisions still in the pipeline.", source: "Sterman J., Management Science 35:321", year: "1989", kind: "scholarship", license: "fact", grade: "A" },
      { id: "dd", claim: "A bank run can be a self-fulfilling equilibrium: if depositors expect others to withdraw, withdrawing is rational, which makes the run happen.", source: "Diamond D. & Dybvig P., Journal of Political Economy 91:401 (not re-checked in this build)", year: "1983", kind: "scholarship", license: "fact", grade: "B" },
      { id: "showerex", claim: "The shower with a delay is a standard teaching example in system dynamics.", source: "Sterman J., Business Dynamics (not re-checked in this build)", year: "2000", kind: "scholarship", license: "fact", grade: "B" },
    ],
    steps: [
      { id: "l1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["showerex"], stem: "New water takes **4 seconds** to reach you. Every second the water feels cold, you turn the knob firmly towards hot. What happens?", alt: "When the water finally feels right, how many seconds of turning are still travelling up the pipe?", options: [{ t: "It overshoots to too hot, then too cold, swinging", ok: true, why: "You keep turning while the hot water is still on its way; when it arrives, it's too much." }, { t: "It warms smoothly and settles at exactly the right heat", bug: "nodelay", why: "That happens only with no delay, or very gentle turning." }, { t: "It never gets warm because the knob is turned too little", bug: "inversion", why: "It gets warm; the trouble is it doesn't stop at warm." }, { t: "It depends only on the boiler, not on how you turn the knob", bug: "agent", why: "Your turning rule is part of the system." }] },
      { id: "l1b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "Same shower, same firm turning, but now the water arrives **instantly**. What happens?", options: [{ t: "It settles on warm without swinging", ok: true, why: "With no delay you see each correction's effect at once and stop in time." }, { t: "It swings just as much as with the delay", bug: "nodelay", why: "The swinging came from the delay, not from the turning alone." }, { t: "It never quite reaches warm, stopping short", bug: "inversion", why: "Firm turning reaches the target quickly." }], after: "Check both predictions in the model: delay 0, then delay 4." },
      { id: "l2", type: "model", stage: "model", min: 3.5, model: "shower", src: ["showerex"], title: "Be the person in the shower", body: "The line is the temperature you feel over one minute.", ask: "**Try three things:** delay 0 (instant water); delay 4 turning hard; delay 4 turning gently. Which change fixes the swinging: waiting, or turning harder?", terms: ["delay", "gain"] },
      { id: "l3", type: "scene", stage: "reveal", min: 2.5, src: ["sterman"], terms: ["loop", "bal", "rein"], title: "Two shapes that run most systems", body: "In a [[loop|feedback loop]], the result changes the next action. There are two kinds.\n\nA [[bal|balancing loop]] pushes back towards a goal: the shower, a thermostat, blood sugar after a meal. Add a **delay** and a strong reaction, and it overshoots and swings.\n\nA [[rein|reinforcing loop]] feeds itself: more leads to more. Savings with interest, panic in a bank run, a microphone that howls.", reps: [{ kind: "diagram", label: "The two loops", svg: "loops", body: "Follow the arrows: in B, the second arrow is **−** (insulin lowers glucose), so the loop corrects itself. In R, both arrows are **+**, so it runs away." }, { kind: "story", label: "The Beer Game", body: "In John Sterman's 1989 experiment, managers ran a four-stage beer supply chain with shipping delays. Orders swung wildly and players blamed the other players. Sterman showed the swings came mostly from ignoring the orders **already on the way**: the shower, with beer." }, { kind: "counterexample", label: "Where it breaks: swings from outside", body: "Not every swing comes from a loop with a delay. A beach town's takings rise every summer and fall every winter with no feedback at all: the calendar drives them. Before redesigning a loop, check whether the swings simply follow something outside the system." }] },
      {
        id: "l4", type: "contrast", stage: "contrast", min: 2.5, src: ["dd"], title: "Your body and a bank",
        left: { title: "Blood sugar after a meal", body: "Glucose rises → the pancreas releases insulin → cells take up glucose → glucose falls → insulin falls. A goal is defended." },
        right: { title: "A bank run", body: "Some depositors withdraw → others fear the bank will run out → they withdraw too → the bank really runs short. The fear makes itself true." },
        q: { stem: "What is the real difference between them?", options: [{ t: "The sign of the loop: one reverses the change, the other amplifies it", ok: true, why: "Insulin lowers glucose; fear raises withdrawals. Same shape, a loop; one sign flips everything." }, { t: "One is biology and one is money, so they follow different laws", bug: "surface", why: "The domains differ; the mechanism is what matters, and the mechanism differs in sign." }, { t: "The bank run has no loop at all, only a sudden wave of panic", bug: "omission", why: "Panic is one link of a loop: withdrawals feed fear, fear feeds withdrawals." }, { t: "Blood sugar has no goal; it simply rises and falls with meals", bug: "inversion", why: "It defends a range: that's what a balancing loop does." }] },
      },
      { id: "l5", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["sterman"], stem: "A shop manager sees sales rise and orders more stock; the order arrives three weeks later. Meanwhile she keeps ordering because the shelves still look empty. What helps most?", options: [{ t: "Count what's already on the way, and correct in smaller steps", ok: true, why: "Seeing the pipeline removes the delay from your head; gentler steps reduce the swing." }, { t: "Order faster and in bigger batches whenever the shelves look empty", bug: "gain", why: "More gain with the same delay makes the swings worse." }, { t: "Blame the supplier and switch to a faster one next season", bug: "agent", why: "The swings come from the structure, not a villain." }] },
      { id: "l6", type: "q", kind: "far", stage: "far", min: 1.5, stem: "A microphone near its own speaker starts a rising howl. Which kind of loop, and what is the fastest fix?", options: [{ t: "Reinforcing: turn the gain down or move the mic", ok: true, why: "Sound → mic → amplifier → louder sound. Lower the gain or break the path and the loop can no longer feed itself." }, { t: "Balancing: it will settle by itself once the room absorbs it", bug: "inversion", why: "It rises, it doesn't settle: every pass adds volume." }, { t: "No loop: the speaker is simply broken and needs replacing", bug: "omission", why: "A working speaker plus a path back to the mic is the loop." }] },
      {
        id: "l7", type: "forge", stage: "forge", min: 3, title: "Draw the loop of a habit", body: "Pick the pieces of a common late-night loop and where you'd cut it.",
        slots: [
          { key: "a", label: "Start", options: [{ t: "late-night phone", grade: "good", note: "A clear, observable behaviour.", say: "late-night phone" }] },
          { key: "b", label: "It leads to", options: [{ t: "tired and slow the next day", grade: "good", note: "The link is real and quick.", say: "tired the next day" }, { t: "better mood", grade: "weak", note: "Maybe tonight; tomorrow it's the reverse.", say: "better mood" }] },
          { key: "c", label: "Which leads to", options: [{ t: "studying late to catch up, wired and restless", grade: "good", note: "That closes the loop back to the phone: it's reinforcing.", say: "studying late to catch up" }, { t: "going to bed early", grade: "bad", note: "That would be a balancing link; ask whether it happens.", say: "going to bed early" }] },
          { key: "cut", label: "Where to cut it", options: [{ t: "the phone at 00:30 (session 1's device)", grade: "good", note: "Cut at the cheapest link, before the loop turns again.", say: "the phone at 00:30" }, { t: "working harder the next day", grade: "bad", note: "That feeds the 'studying late' link: it speeds the loop.", say: "working harder the next day" }] },
        ],
        template: "**{a}** → {b} → {c} → back to the phone. Cut at: **{cut}**.",
        critique: { stem: "You cut the loop and sleep better, but the first two nights feel worse (you're restless at midnight). What does today's idea predict?", options: [{ t: "A delay: judge it after a week, not after one night", ok: true, why: "The benefit arrives days later." }, { t: "It's failing: go back to the old routine before it gets worse", bug: "nodelay", why: "Judging a delayed system after one step is the shower mistake." }, { t: "Cut harder: also stop coffee, gym and friends", bug: "gain", why: "A bigger correction on a delayed system makes it swing." }] },
      },
    ],
    challenge: { stem: "A government raises interest rates to cool inflation; the effect takes 12–18 months. Inflation is still high after 6 months. Raising again and again risks…", options: [{ t: "overshooting into a slump as the delayed effects land", ok: true }, { t: "nothing, because interest rates work almost instantly", bug: "nodelay" }, { t: "lower rates, because inflation falls as soon as rates rise", bug: "inversion" }] },
    hooks: [
      { id: "loop.h1", gap: 1, q: { stem: "In a system with a delay, reacting harder to each error usually…", options: [{ t: "makes it swing more", ok: true }, { t: "settles it faster and more smoothly", bug: "gain" }, { t: "changes nothing", bug: "nodelay" }] } },
      { id: "loop.h2", gap: 7, q: { stem: "Rumours that a café is 'the place to be' make it crowded, and crowds make more people want to go. Which loop?", options: [{ t: "Reinforcing", ok: true }, { t: "Balancing", bug: "inversion" }, { t: "No loop at all", bug: "omission" }] } },
      { id: "loop.h3", gap: 30, q: { stem: "Fever: the body's set temperature rises, and you shiver until you reach it. Shivering is part of…", options: [{ t: "a balancing loop defending a new set point", ok: true }, { t: "a reinforcing loop that will keep running away", bug: "inversion" }, { t: "no loop: it's a symptom", bug: "omission" }] } },
    ],
    deeper: [
      { title: "Why delay plus gain causes oscillation", body: "The model: K(t+1) = K(t) + g·(38 − T(t)), with T(t) = K(t − d). With d = 0 any gain up to 1 settles smoothly. As d grows, the largest stable gain shrinks; above it the swings grow. Engineers tune controllers for exactly this trade-off." },
      { title: "Where loops meet medicine", body: "Hormone axes (hypothalamus → pituitary → gland → back), baroreflexes and glucose control are balancing loops; the delay in insulin action is why dosing is hard. Reinforcing loops appear in labour (oxytocin), clotting cascades and shock." },
    ],
  });

  /* ─── 5 · proxy ─── */
  sessions.push({
    id: "proxy",
    primitive: "proxy",
    atoms: ["measure", "strategy", "systems"],
    title: "Paying for rat tails",
    hook: "In 1902 French Hanoi paid a bounty for every rat tail. Soon people saw rats running around with no tails. What happened?",
    minutes: 23,
    why: "Fifth because you live inside measures (marks, rankings, step counts, and this app's own numbers), and knowing how they get gamed, including by yourself, is protection and a design skill.",
    capability: "Separate a number from the thing it was meant to track, predict how people will game it, and design measures that resist gaming.",
    stakes: "Every system that rewards a number (grades, hospital targets, social-media clicks) eventually gets more of the number and not always more of the thing. You will both design and live under such systems.",
    bridge: "The missing step: the tail stood in for a dead rat **only while nobody was paid for tails**. Once tails were paid for, the cheapest way to get tails was not killing rats. The link between the number and the goal broke because of the reward itself.",
    connection: "Session 4: reward → behaviour → number → more reward is a loop. And this is why INTELLECTUALITY keeps 400 exam questions you never practise: a held-out test is an audit of the real thing.",
    vocab: {
      proxy: { name: "proxy", h: "A number standing in for something harder to see.", s: "رقم بيمثل الحاجة، مش هو الحاجة.", t: "An observable indicator used in place of an unobservable target variable." },
      goodhart: { name: "Goodhart's law", h: "Once a number becomes the target, people change the number, not the thing.", s: "أول ما الرقم يبقى هدف، الناس تشتغل على الرقم مش على الحاجة.", t: "Statistical regularities used for control tend to break down once pressure is placed on them (Goodhart 1975)." },
      gaming: { name: "gaming", h: "Improving the number without improving the reality.", s: "تحسين الرقم من غير ما تحسن الحقيقة.", t: "Strategic behaviour that raises a measured indicator without a corresponding improvement in the underlying objective." },
      audit: { name: "audit", h: "A surprise check of the real thing, not the number.", s: "تفتيش مفاجئ على الحقيقة نفسها، مش على الرقم.", t: "Independent, unpredictable verification of the underlying outcome." },
      counter: { name: "counter-metric", h: "A second number that falls when the first is gamed.", s: "رقم تاني بيفضح لو الأول اتلعب فيه.", t: "A paired indicator chosen so that gaming the primary indicator worsens it." },
    },
    provenance: [
      { id: "vann", claim: "In 1902 Hanoi's colonial authorities paid a bounty per rat tail; officials then saw tailless rats, as catchers cut tails and released the rats to breed.", source: "Vann M., 'Of Rats, Rice, and Race: The Great Hanoi Rat Massacre', French Colonial History 4", year: "2003", kind: "scholarship", license: "fact", grade: "A", note: "Based on archival records." },
      { id: "goodhart", claim: "Goodhart's wording: “Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.”", source: "Goodhart C., 1975 paper; in Monetary Theory and Practice (1984), p. 96", year: "1975", kind: "primary", license: "short quotation", grade: "A" },
      { id: "strathern", claim: "Strathern's summary: “When a measure becomes a target, it ceases to be a good measure.”", source: "Strathern M., 'Improving ratings: audit in the British University system', European Review", year: "1997", kind: "primary", license: "short quotation", grade: "A" },
      { id: "bevan", claim: "Under English targets, reported ambulance response times showed a spike just under the 8-minute target, and in about a third of trusts times had been 'corrected' to under eight minutes.", source: "Bevan G. & Hood C., Public Administration 84:517", year: "2006", kind: "scholarship", license: "fact", grade: "A" },
      { id: "cobra", claim: "The 'cobra effect' (Delhi bounty on cobras → cobra farming) is usually told without an archival source.", source: "Popular parable", year: "—", kind: "parable", license: "original", grade: "C", note: "Treat as a parable; the Hanoi case is the documented one." },
    ],
    steps: [
      { id: "p1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["vann"], stem: "Hanoi, 1902: a bounty for each rat tail handed in. Then officials notice rats **without tails** in the streets. Most likely?", alt: "What is the cheapest way to produce a tail?", options: [{ t: "Catchers cut off the tails and let the rats go to breed", ok: true, why: "Released rats bred more tail-bearing rats. A live rat without a tail is a rat that will produce more tails. The archives Michael Vann studied describe exactly this." }, { t: "A disease spread among the rats and made them lose their tails", bug: "agent", why: "The change came from people responding to a reward, not from the rats." }, { t: "The rats evolved shorter tails that were harder for catchers to grab", bug: "scale", why: "Evolution does not work in months; people do." }, { t: "Officials were lying about the rat numbers to protect the scheme", bug: "omission", why: "They saw real rats; the question is why the rats had no tails." }] },
      { id: "p2", type: "scene", stage: "reveal", min: 2.5, src: ["goodhart", "strathern", "vann"], terms: ["proxy", "goodhart", "gaming"], title: "When the number becomes the target", body: "The city wanted **fewer rats**. It could not count dead rats, so it paid for a [[proxy|proxy]]: tails. The moment money rode on tails, the cheapest way to get tails was not to kill rats.\n\nThe economist Charles Goodhart put it this way in 1975: “Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.” The anthropologist Marilyn Strathern's shorter version (1997) is the one people quote: “When a measure becomes a target, it ceases to be a good measure.” That is [[goodhart|Goodhart's law]]; improving the number instead of the thing is [[gaming|gaming]].", reps: [{ kind: "data", label: "A modern case", svg: "target8", body: "England, 2000s: ambulances had to reach 75% of life-threatening calls within **8 minutes**. Bevan and Hood (2006) found reported times piling up just under 8 minutes, and in about a third of services, times had been “corrected” to under 8. The chart is a **schematic** of that pattern, not their data." }, { kind: "counterexample", label: "A story to distrust", body: "You may hear of the “cobra effect” in British Delhi (a cobra bounty that led to cobra farms). It is usually told **without a source**. Keep it as a parable; the Hanoi rats are the documented case." }] },
      { id: "p2b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "The reward on the number stays high, but now the real thing is checked at random half the time. Gaming becomes…", options: [{ t: "Much less worth it, so effort returns to the real work", ok: true, why: "A random audit makes the cheap route risky: the number and reality move together again." }, { t: "Unchanged, because people will game any number whatever you do", bug: "omission", why: "Gaming follows its payoff; audits cut the payoff." }, { t: "More attractive, because people get angry at being checked", bug: "inversion", why: "Maybe for some, but on average an audit lowers the return on gaming." }], after: "Test it in the model: pressure up, then the audit slider." },
      { id: "p3", type: "model", stage: "model", min: 3, model: "goodhart", title: "Put pressure on a number", body: "Each person can spend effort on real work (moves both the number and reality) or on gaming (moves the number cheaply, not reality). Gaming works only when nobody checks.", ask: "**Try:** raise the reward with no checks. Watch the number and the real thing separate. Then add checks of the real thing: what happens to the gap?", terms: ["audit"] },
      {
        id: "p4", type: "contrast", stage: "contrast", min: 2.5, src: ["vann", "bevan"], title: "A colony and a health service, a century apart",
        left: { title: "Hanoi, 1902", body: "Goal: fewer rats. Number: tails handed in. Result: more tails, not fewer rats." },
        right: { title: "England, 2000s", body: "Goal: fast help for dying patients. Number: share of calls reached within 8 minutes. Result: many times reported just under 8." },
        q: { stem: "What is the common mechanism?", options: [{ t: "A number was rewarded, and it was cheaper to move than reality", ok: true, why: "Different eras, same economics of effort." }, { t: "Both were run by governments, which are slow to notice gaming", bug: "surface", why: "Companies and students do the same when a number pays." }, { t: "The people involved were dishonest and needed stricter punishment", bug: "moral", why: "Honesty varies; the incentive is what predicts the pattern across thousands of people." }, { t: "Measuring things is useless, so both should have measured nothing", bug: "inversion", why: "The measures carried information until they were rewarded; the fix is design, not blindness." }] },
      },
      { id: "p5", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "A medical school ranks students only by MCQ scores from past papers. What gaming would you predict?", options: [{ t: "Memorising past-paper answers without the medicine behind them", ok: true, why: "The cheapest way to raise the number. This is why INTELLECTUALITY keeps 400 held-out questions you never practise: they are the audit." }, { t: "Students will study anatomy more deeply, since every question now counts", bug: "proxy", why: "Some will; the number does not require it, so pressure pushes the other way." }, { t: "No gaming, because well-written exams are fair to every student", bug: "authority", why: "Fairness doesn't stop the cheapest route." }] },
      { id: "p6", type: "q", kind: "far", stage: "far", min: 1.5, stem: "A video platform pays creators per click, not per minute watched. Predict the content.", options: [{ t: "More misleading thumbnails and titles", ok: true, why: "Clicks are the rewarded proxy for 'people value this'; a misleading title is the cheapest click." }, { t: "Longer, more careful videos, because careful videos keep viewers", bug: "proxy", why: "Length isn't rewarded; clicks are." }, { t: "No change, since viewers choose videos by quality anyway", bug: "omission", why: "Rewards reliably change what gets made." }] },
      {
        id: "p7", type: "forge", stage: "forge", min: 3, title: "Design a measure that resists gaming", body: "Pick something you track, then protect it.",
        slots: [
          { key: "what", label: "What you really want", options: [{ t: "understanding medicine, not just marks", grade: "good", note: "A real goal, hard to see directly.", say: "understanding medicine" }, { t: "real fitness for MMA", grade: "good", note: "A real goal, hard to see directly.", say: "real fitness" }, { t: "UberBond users actually helped", grade: "good", note: "A real goal, hard to see directly.", say: "users actually helped" }] },
          { key: "number", label: "The number you'll watch", options: [{ t: "a score on questions I have never practised", grade: "good", note: "Held-out items are hard to game: you can't memorise what you haven't seen.", say: "a score on questions I have never practised" }, { t: "hours spent", grade: "bad", note: "Input, not outcome, and the easiest number to inflate.", say: "hours spent" }, { t: "a streak of days", grade: "bad", note: "A streak measures showing up, not getting better.", say: "a streak" }] },
          { key: "counter", label: "A counter-metric", options: [{ t: "a second measure that drops if the first is gamed (e.g. explain it aloud to someone)", grade: "good", note: "Gaming one now costs the other.", say: "a check that falls if I game the first (explaining it aloud)" }, { t: "none needed", grade: "bad", note: "A single rewarded number is the Hanoi setup.", say: "no counter-metric" }] },
          { key: "audit", label: "Audit", options: [{ t: "an occasional surprise test of the real thing", grade: "good", note: "Unpredictable checks remove the reward for gaming.", say: "a surprise check of the real thing now and then" }, { t: "check only the number, more often", grade: "bad", note: "More pressure on the same proxy.", say: "checking the number more often" }] },
        ],
        template: "Goal: **{what}**. Watch: {number}. Counter: {counter}. Audit: {audit}.",
        critique: { stem: "This app shows you no combined 'Renaissance score'. Why, by today's idea?", options: [{ t: "One headline number invites optimising the number, not the thinking", ok: true }, { t: "Because numbers are useless for something as rich as thinking", bug: "inversion", why: "The separate numbers stay visible in WHY THIS?; only the single headline is withheld." }, { t: "To hide bad results from the learner so he keeps coming back", bug: "moral", why: "Every count, good or bad, is shown with its sample size." }] },
      },
    ],
    challenge: { stem: "A police force is judged by the number of arrests. Most likely side effect?", options: [{ t: "More easy, minor arrests and fewer hard, serious cases", ok: true }, { t: "Less crime overall, automatically, because police work harder", bug: "proxy" }, { t: "No change, because the police already arrest whoever they can", bug: "omission" }] },
    hooks: [
      { id: "proxy.h1", gap: 1, q: { stem: "Why did paying for rat tails fail?", options: [{ t: "The cheapest way to produce tails wasn't killing rats", ok: true }, { t: "The bounty was too small to make catching rats worth the effort", bug: "gain" }, { t: "Rats are too clever and learned to avoid the traps", bug: "agent" }] } },
      { id: "proxy.h2", gap: 7, q: { stem: "Which protects a number from gaming best?", options: [{ t: "Unpredictable checks of the real outcome, plus a counter-metric", ok: true }, { t: "Bigger rewards for the number, so people take it more seriously", bug: "proxy" }, { t: "Measuring it every day instead of once a month", bug: "proxy" }] } },
      { id: "proxy.h3", gap: 30, q: { stem: "A hospital must see A&E patients within 4 hours. Which pattern would suggest gaming?", options: [{ t: "Many patients admitted or moved at 3 h 55 min", ok: true }, { t: "Average times falling slowly over years", bug: "confirm" }, { t: "More staff on night shifts, and shorter queues overall", bug: "omission" }] } },
    ],
    deeper: [
      { title: "Campbell and Goodhart", body: "Social scientist Donald Campbell described the same pattern for social indicators in the 1970s. The shared insight: measurement changes behaviour, so a measure that works when unrewarded can fail once rewarded." },
      { title: "The design rules", body: "Measure outcomes over inputs; keep some measures unannounced or held-out; pair each rewarded number with a counter-metric; audit the real thing at random; change measures before people learn to game them." },
    ],
  });

  /* ─── 6 · falsify ─── */
  sessions.push({
    id: "falsify",
    primitive: "falsify",
    atoms: ["falsify", "experiment", "causal"],
    title: "The two clinics of Vienna",
    hook: "Vienna, 1846. Two maternity clinics in one hospital, admitting on alternate days. In one, about 1 mother in 10 died; in the other, about 1 in 30. Why?",
    minutes: 25,
    why: "Last because it uses everything before it (counts, filters, a risky prediction) on real primary data, and because it's the core skill of a scientist and a doctor: choosing the observation that can prove you wrong.",
    capability: "Given competing explanations, choose the observation or intervention that tells them apart, instead of collecting evidence that fits all of them.",
    stakes: "Most arguments stall because people collect evidence that fits their view. The fastest thinkers ask: what would I expect to see if I'm wrong, and can I go and look?",
    bridge: "The missing step: every explanation 'fits' the fact that mothers died. What separates explanations is a fact that one predicts and the others don't: here, the difference **between** two clinics that share air, city and patients.",
    connection: "Session 2 (the supplement question comes back): a good test breaks the filter. Session 3: Semmelweis argued with counts, which is why his numbers still convince.",
    vocab: {
      hyp: { name: "hypothesis", h: "A guess that could turn out wrong, and says how.", s: "تخمين محترم تقدر تختبره.", t: "A proposed explanation that entails testable predictions." },
      discrim: { name: "discriminating evidence", h: "An observation the rival explanations predict differently.", s: "الملاحظة اللي تفرق بين التخمينين، مش اللي تناسب الاتنين.", t: "Evidence whose likelihood differs substantially across competing hypotheses." },
      natexp: { name: "natural experiment", h: "Life happened to assign people like a trial would.", s: "الدنيا عملت التجربة لوحدها، إنت بس تقرا النتيجة.", t: "An observational setting in which assignment to conditions is as-if random." },
      confound: { name: "confound", h: "A third thing that moves both, faking a cause.", s: "حاجة تالتة بتحرك الاتنين فبتبان إنها السبب.", t: "A variable associated with both exposure and outcome that distorts their apparent relationship." },
      falsif: { name: "falsification", h: "Looking for what would knock your idea down, not what props it up.", s: "دور على اللي يوقع فكرتك، مش اللي يأيدها.", t: "Testing a hypothesis by deriving and checking predictions that could refute it." },
    },
    provenance: [
      { id: "loudon", claim: "Vienna General Hospital, 1841–46: First Clinic deaths per 100 births 7.8, 15.8, 9.0, 8.2, 6.9, 11.4; Second Clinic 3.5, 7.6, 6.0, 2.3, 2.0, 2.8. Admission alternated by day. 1840–46: 98.4 vs 36.2 per 1,000 births.", source: "Loudon I., 'Ignaz Phillip Semmelweis' studies of death in childbirth', J R Soc Med (James Lind Library), from Semmelweis 1861", year: "1861 / 2013", kind: "primary data", license: "fact", grade: "A" },
      { id: "wash", claim: "Chlorine hand-washing required from mid-May 1847; First Clinic deaths 18.3% in April, 12.2% in May, 2.2% June, 1.2% July, 1.9% August; in 1848, 12.7 vs 13.3 per 1,000 births (First vs Second).", source: "Loudon 2013 (James Lind Library), from Semmelweis 1861", year: "1847–48", kind: "primary data", license: "fact", grade: "A" },
      { id: "kolletschka", claim: "Semmelweis's colleague Jakob Kolletschka died in 1847 after a cut from a student's scalpel during an autopsy; his autopsy findings resembled those of the mothers.", source: "Loudon 2013; Semmelweis 1861", year: "1847", kind: "scholarship", license: "fact", grade: "A" },
      { id: "tested", claim: "Semmelweis considered and rejected other explanations, including epidemic influences, overcrowding, the priest's bell and delivery position; street births had low mortality.", source: "Semmelweis's own account (1861), as summarised in the historical literature", year: "1861", kind: "scholarship", license: "fact", grade: "B" },
      { id: "mrc", claim: "The UK Medical Research Council's 1948 trial of streptomycin in pulmonary tuberculosis allocated patients by random numbers in sealed envelopes; it is widely cited as one of the first randomised controlled trials.", source: "Medical Research Council, British Medical Journal (not re-checked in this build)", year: "1948", kind: "scholarship", license: "fact", grade: "B" },
      { id: "reject", claim: "Many leading physicians rejected his conclusion in his lifetime; he published his full account only in 1861 and died in 1865.", source: "Historical literature (Loudon 2013 and others)", year: "1861–65", kind: "scholarship", license: "fact", grade: "B" },
    ],
    steps: [
      { id: "f1", type: "scene", stage: "hook", min: 2.5, src: ["loudon"], terms: ["natexp"], title: "The primary data", body: "These are Ignaz Semmelweis's own yearly counts, from his 1861 book. The two clinics sat in the same hospital, in the same city, and admitted women on **alternating days**: a [[natexp|natural experiment]] nobody designed. In the First Clinic, doctors and medical students delivered babies; in the Second, midwives.", reps: [{ kind: "data", label: "Deaths per 100 births", svg: "semmel", body: "Six years, every year the same direction. From 1840 to 1846: **98.4** deaths per 1,000 births in the First Clinic, **36.2** in the Second." }] },
      { id: "f2", type: "q", kind: "predict", stage: "predict", min: 2, src: ["loudon"], stem: "People at the time blamed 'bad air' and epidemics hanging over the city. Which fact does most damage to that explanation?", alt: "What would bad city air predict about **two** clinics in the **same** building?", options: [{ t: "Two clinics under the same air, filled on alternate days, differ threefold", ok: true, why: "City air would hit both clinics alike. A steady difference between them needs a cause that differs between them." }, { t: "Many mothers died every year in both clinics, which fits bad air", bug: "confirm", why: "Every explanation predicts deaths; this fact can't tell them apart." }, { t: "Doctors were educated people, so their clinic should have done better", bug: "authority", why: "Status says nothing about the cause." }, { t: "The deaths varied from year to year, as epidemics come and go", bug: "omission", why: "Both clinics varied; the gap between them is the clue." }] },
      { id: "f3", type: "model", stage: "model", min: 4, model: "hypo", src: ["tested", "kolletschka"], terms: ["hyp", "confound"], title: "Test the explanations", body: "Semmelweis weighed several explanations. Slide through them. For each, see which observations it can account for.", ask: "Which observation kills the most explanations at once? And what made the last one testable: after his friend Jakob Kolletschka died of a scalpel cut during an autopsy, with the same findings as the mothers, what did the idea **predict** that could have failed?" },
      { id: "f4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["wash"], stem: "In May 1847 Semmelweis made everyone wash their hands in chlorinated lime before entering the First Clinic. If he is right, what should happen?", options: [{ t: "First Clinic deaths fall to the midwives' level within weeks", ok: true, why: "That is a risky prediction: if deaths had stayed high, the idea would have been badly damaged." }, { t: "Deaths fall in both clinics equally, since both staffs wash", bug: "omission", why: "The Second Clinic had no autopsy hands to clean; its deaths had no reason to change." }, { t: "Nothing, because washing is far too simple to stop a killer disease", bug: "authority", why: "Simplicity is not evidence either way. Let the counts decide." }] },
      { id: "f5", type: "scene", stage: "reveal", min: 2, src: ["wash", "reject"], terms: ["discrim", "falsif"], title: "The prediction that could have failed", body: "It didn't fail. First Clinic deaths: **18.3%** in April 1847, **2.2%** in June, **1.2%** in July. In 1848 the two clinics were level: **12.7 vs 13.3** per 1,000 births.\n\nThe lesson isn't 'wash your hands'. It is the method: find [[discrim|discriminating evidence]], then make a prediction that could have come out wrong, and look. That is [[falsif|falsification]] in practice.", reps: [{ kind: "data", label: "Month by month, 1847", svg: "semmel47", body: "The drop came weeks after the change, and only in the clinic that changed." }, { kind: "story", label: "Right, and still rejected", body: "Many leading physicians rejected his conclusion. Germs were not yet understood, he published his full account only in **1861**, and he attacked his critics. He died in **1865**. Evidence alone did not win; a mechanism (germ theory) and better persuasion came later." }] },
      {
        id: "f5b", type: "contrast", stage: "contrast", min: 2.5, src: ["loudon", "mrc"], title: "Vienna 1846 and London 1948",
        left: { title: "Two clinics, alternate days", body: "Nobody designed it: women were admitted to the First or Second Clinic by the day they arrived. So the two groups of mothers were alike, and a threefold difference pointed at what differed: who examined them." },
        right: { title: "The streptomycin trial", body: "In 1948 Britain's Medical Research Council tested streptomycin for tuberculosis by allocating patients with **random numbers** in sealed envelopes: one of the first properly randomised trials." },
        q: { stem: "What gives both their power?", options: [{ t: "Assignment, not choice, made the groups alike, so the difference points at one thing", ok: true, why: "The groups were made alike by how people were assigned, not by who chose what. Alternate days and random numbers both break the link between the patient and the treatment." }, { t: "Both were done by famous scientists whose word carried weight", bug: "authority", why: "Fame doesn't make groups comparable." }, { t: "Both used large numbers of patients, so chance could be ruled out", bug: "surface", why: "Size helps with chance; assignment is what removes the filter." }, { t: "Both were about infections, where cause and effect are simple", bug: "surface", why: "The topic is the surface; the method is the mechanism." }], after: "A natural experiment is luck that a trial makes on purpose." },
      },
      { id: "f6", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "A friend says a supplement cured his headaches: he took it and felt better within three days. Which single step would test it best?", options: [{ t: "Alternate weeks with and without it, blind if possible, and count", ok: true, why: "Ideally without knowing which pill is which, count headache days. It compares him with himself and removes his expectations: the Vienna logic at home." }, { t: "Collect more stories from people who took it and got better", bug: "selection", why: "Filtered evidence (session 2): the people who didn't improve don't write reviews." }, { t: "Read the ingredient list and check each ingredient's reputation", bug: "omission", why: "A mechanism can suggest a hypothesis; it can't test this one." }, { t: "He's sure, and he knows his own body better than any study does", bug: "authority", why: "Certainty is not a measurement." }] },
      { id: "f7", type: "q", kind: "far", stage: "far", min: 2, stem: "Two theories: heavier objects fall faster, or (ignoring air) all objects fall at the same rate. Which experiment separates them best?", options: [{ t: "Drop a heavy and a light ball of the same size together", ok: true, why: "Same size and shape, so air resistance is the same; see which lands first. Same size and shape keeps air resistance similar; the theories predict different results. (The story that Galileo did this from the Tower of Pisa is doubted by historians; the logic is sound either way.)" }, { t: "Drop a feather and a stone from the same height together", bug: "confound", why: "Air resistance differs hugely: a confound, not a test of weight." }, { t: "Ask several physicists which theory they prefer and why", bug: "authority", why: "A poll isn't an experiment." }, { t: "Drop one heavy ball many times and time each fall carefully", bug: "omission", why: "Without a comparison, nothing is tested." }] },
      {
        id: "f8", type: "forge", stage: "forge", min: 3, title: "Test one of your own beliefs this week", body: "Pick a belief about yourself and design the test that could prove it wrong.",
        slots: [
          { key: "belief", label: "The belief", options: [{ t: "“Coffee after 6 pm doesn't affect my sleep”", grade: "good", note: "Testable in a week.", say: "coffee after 6 pm doesn't affect my sleep" }, { t: "“I learn better at night”", grade: "good", note: "Testable with a fair comparison.", say: "I learn better at night" }, { t: "“Music helps me focus”", grade: "good", note: "Testable with a fair comparison.", say: "music helps me focus" }] },
          { key: "compare", label: "Compared with", options: [{ t: "alternating days with and without it", grade: "good", note: "Like the alternating clinics.", say: "alternating days with and without it" }, { t: "how I remember feeling", grade: "bad", note: "Memory is a filter (session 2).", say: "how I remember feeling" }] },
          { key: "measure", label: "Measured by", options: [{ t: "a number written down the same way each day (sleep time, questions right)", grade: "good", note: "Counts, not impressions.", say: "a number written down the same way each day" }, { t: "whether it feels like it worked", grade: "bad", note: "Feelings follow expectations.", say: "whether it feels like it worked" }] },
          { key: "kill", label: "What would prove me wrong", options: [{ t: "no difference, or the opposite difference, after 2 weeks", grade: "good", note: "Decided in advance: that's what makes it a test.", say: "no difference, or the opposite, after two weeks" }, { t: "nothing: I'll know it when I see it", grade: "bad", note: "A test with no failure condition cannot fail.", say: "nothing decided in advance" }] },
        ],
        template: "Belief: **{belief}**. Compare: {compare}. Measure: {measure}. I'm wrong if: {kill}.",
        critique: { stem: "After a week the result goes against your belief. The Semmelweis lesson?", options: [{ t: "Believe the counts over the feeling; change the habit, not the data", ok: true, why: "Or run a better test." }, { t: "One week proves nothing, so ignore it and trust how you feel", bug: "confirm", why: "Then extend the test; dismissing only the results you dislike is confirmation hunting." }, { t: "Find people who tried the same habit and agree it helps", bug: "authority", why: "Agreement is not a measurement." }] },
      },
    ],
    challenge: { stem: "Two explanations for why a plant grows faster by the window: more light, or more warmth. Best single test?", options: [{ t: "Two plants equally warm, one lit and one shaded", ok: true, why: "And the reverse: same light, different warmth." }, { t: "Watch the window plant more closely for another month", bug: "confirm" }, { t: "Ask an experienced gardener which one matters more", bug: "authority" }] },
    hooks: [
      { id: "falsify.h1", gap: 1, q: { stem: "Why was 'bad city air' a weak explanation for Vienna's deaths?", options: [{ t: "It predicted equal deaths in two clinics with the same air", ok: true, why: "They differed threefold." }, { t: "Air can't carry disease at all, as later science proved", bug: "scale" }, { t: "The doctors disproved it by showing germs under microscopes", bug: "omission" }] } },
      { id: "falsify.h2", gap: 7, q: { stem: "Evidence that fits every explanation equally is…", options: [{ t: "almost worthless for choosing between them", ok: true }, { t: "the strongest evidence, since every theory agrees on it", bug: "confirm" }, { t: "proof that all of them are partly true at once", bug: "inversion" }] } },
      { id: "falsify.h3", gap: 30, q: { stem: "What made Semmelweis's hand-washing a real test, not just an intervention?", options: [{ t: "It predicted a specific drop that could have failed to happen", ok: true }, { t: "It was simple and cheap, so hospitals were happy to adopt it", bug: "surface" }, { t: "Senior doctors agreed with it once they saw the results", bug: "authority" }] } },
    ],
    deeper: [
      { title: "Discriminating power, formally", body: "Evidence E favours H1 over H2 by the likelihood ratio P(E | H1) / P(E | H2). 'Mothers died' has a ratio near 1 for every hypothesis; 'two clinics differ threefold under alternating admission' has a huge ratio against 'city air'. Good tests are chosen for large ratios." },
      { title: "Open question", body: "Why do correct findings with strong data still get rejected? Historians point to the missing mechanism, professional status and poor communication; how much each mattered in Semmelweis's case is debated." },
    ],
  });

  window.RENAISSANCE_SEASONS = [{ id: "s1", boot: true, domain: "primitives", title: "Season 1 · Six mechanisms that run the world", sessions, visuals, models }];
})();
