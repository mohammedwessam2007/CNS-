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

  /* ═══════════════ VISUALS (drawn from the data they show) ═══════════════ */
  const visuals = {
    // Odysseus designs constraints now for the self he will be at the song
    sirens: () =>
      svg(560, 210,
        defs +
          box(12, 40, 170, 120, C.cyan) + t(97, 64, "ODYSSEUS NOW", { c: C.cyan }) + t(97, 86, "calm; can see", { fw: 600 }) + t(97, 102, "the whole voyage", { fw: 600 }) + t(97, 132, "designs the rules", { c: C.lime }) +
          box(206, 20, 150, 44, C.lime) + t(281, 47, "wax: crew can't hear", { fs: 11 }) +
          box(206, 82, 150, 44, C.lime) + t(281, 109, "ropes: he can't steer", { fs: 11 }) +
          box(206, 144, 150, 52, C.lime) + t(281, 166, "order: if I beg,", { fs: 11 }) + t(281, 182, "tie me tighter", { fs: 11 }) +
          box(380, 40, 170, 120, C.pink) + t(465, 64, "ODYSSEUS AT THE SONG", { c: C.pink, fs: 11 }) + t(465, 90, "wants the rocks;", { fw: 600 }) + t(465, 106, "will beg, order,", { fw: 600 }) + t(465, 122, "promise anything", { fw: 600 }) +
          arrow(182, 100, 204, 42) + arrow(182, 100, 204, 104) + arrow(182, 100, 204, 168) + arrow(356, 42, 380, 90) + arrow(356, 104, 380, 100) + arrow(356, 168, 380, 112),
        "Odysseus now designs three constraints for Odysseus at the song"),
    // a natural-frequency tree for the screening example
    tree: () =>
      svg(560, 230,
        defs +
          box(220, 10, 120, 40, C.cyan) + t(280, 35, "1,000 people") +
          box(60, 80, 150, 40, C.pink) + t(135, 105, "10 have it (1%)") +
          box(350, 80, 150, 40, C.green) + t(425, 105, "990 don't") +
          box(10, 160, 120, 52, C.pink, "#3a1f2a") + t(70, 182, "9 test +", { c: C.pink }) + t(70, 200, "(90% of 10)", { fs: 10, fw: 600 }) +
          box(140, 160, 110, 52, C.pink) + t(195, 182, "1 test −") + t(195, 200, "missed", { fs: 10, fw: 600 }) +
          box(300, 160, 120, 52, C.amber, "#3a3320") + t(360, 182, "89 test +", { c: C.amber }) + t(360, 200, "(9% of 990)", { fs: 10, fw: 600 }) +
          box(430, 160, 120, 52, C.green) + t(490, 182, "901 test −") +
          arrow(260, 50, 150, 78) + arrow(300, 50, 410, 78) + arrow(120, 120, 72, 158) + arrow(150, 120, 192, 158) + arrow(410, 120, 362, 158) + arrow(440, 120, 488, 158) +
          t(280, 226, "Positive: 9 + 89 = 98 people · sick among them: 9 → about 9%", { c: C.lime, fs: 12 }),
        "Of 1000 people, 98 test positive and only 9 of them are sick"),
    // two loops: one corrects, one amplifies
    loops: () => {
      const loop = (cx, title, a, b, sa, sb, col, kind) =>
        '<circle cx="' + cx + '" cy="110" r="62" fill="none" stroke="' + col + '" stroke-width="2" stroke-dasharray="5 5"/>' +
        box(cx - 70, 40, 140, 34, col) + t(cx, 62, a, { fs: 11 }) +
        box(cx - 70, 146, 140, 34, col) + t(cx, 168, b, { fs: 11 }) +
        t(cx + 82, 112, sa, { c: col, fs: 16, fw: 900 }) + t(cx - 82, 112, sb, { c: col, fs: 16, fw: 900 }) +
        t(cx, 116, kind, { c: col, fs: 13, fw: 900 }) + t(cx, 204, title, { c: C.mut, fs: 11 });
      return svg(560, 212, loop(140, "blood sugar after a meal", "glucose ↑", "insulin ↑", "+", "−", C.green, "B (balancing)") + loop(420, "a bank run", "withdrawals ↑", "fear of a run ↑", "+", "+", C.pink, "R (reinforcing)"), "A balancing loop and a reinforcing loop");
    },
    // Semmelweis's two clinics, 1841–1846, deaths per 100 births (Loudon 2013 / James Lind Library)
    semmel: () => {
      const D = [[1841, 7.8, 3.5], [1842, 15.8, 7.6], [1843, 9.0, 6.0], [1844, 8.2, 2.3], [1845, 6.9, 2.0], [1846, 11.4, 2.8]];
      let s = defs + t(280, 16, "Mothers who died, per 100 births · Vienna General Hospital", { c: C.mut, fs: 11 });
      const y0 = 190, k = 9.5;
      for (let g = 0; g <= 16; g += 4) s += '<line x1="40" x2="540" y1="' + (y0 - g * k) + '" y2="' + (y0 - g * k) + '" stroke="' + C.line + '"/>' + t(30, y0 - g * k + 4, g, { fs: 10, c: C.mut, a: "end" });
      D.forEach(([y, a, b], i) => {
        const x = 60 + i * 80;
        s += '<rect x="' + x + '" y="' + (y0 - a * k) + '" width="28" height="' + a * k + '" fill="' + C.pink + '"/>' + t(x + 14, y0 - a * k - 4, a, { fs: 10 });
        s += '<rect x="' + (x + 30) + '" y="' + (y0 - b * k) + '" width="28" height="' + b * k + '" fill="' + C.cyan + '"/>' + t(x + 44, y0 - b * k - 4, b, { fs: 10 });
        s += t(x + 29, y0 + 16, y, { fs: 11, c: C.mut });
      });
      s += '<rect x="360" y="30" width="12" height="12" fill="' + C.pink + '"/>' + t(378, 41, "First Clinic (doctors, students)", { a: "start", fs: 11 });
      s += '<rect x="360" y="48" width="12" height="12" fill="' + C.cyan + '"/>' + t(378, 59, "Second Clinic (midwives)", { a: "start", fs: 11 });
      return svg(560, 216, s, "First Clinic deaths 7 to 16 per 100 births; Second Clinic 2 to 8");
    },
    // the 1847 intervention month by month (First Clinic)
    semmel47: () => {
      const D = [["Apr", 18.3], ["May*", 12.2], ["Jun", 2.2], ["Jul", 1.2], ["Aug", 1.9]];
      let s = t(280, 16, "First Clinic, 1847: deaths per 100 births (*chlorine washing from mid-May)", { c: C.mut, fs: 11 });
      const y0 = 170, k = 7.5;
      D.forEach(([m, v], i) => {
        const x = 80 + i * 90;
        s += '<rect x="' + x + '" y="' + (y0 - v * k) + '" width="44" height="' + v * k + '" fill="' + (i < 1 ? C.pink : i === 1 ? C.amber : C.green) + '"/>' + t(x + 22, y0 - v * k - 5, v) + t(x + 22, y0 + 16, m, { c: C.mut });
      });
      s += '<line x1="40" x2="540" y1="' + (y0 - 1.33 * k) + '" y2="' + (y0 - 1.33 * k) + '" stroke="' + C.cyan + '" stroke-dasharray="4 4"/>' + t(540, y0 - 1.33 * k - 6, "Second Clinic level, 1848 (1.3)", { c: C.cyan, a: "end", fs: 10 });
      return svg(560, 196, s, "After hand-washing, First Clinic deaths fell from 18.3 to about 2 per 100");
    },
    // schematic of the pattern Bevan & Hood describe: reported ambulance times pile up just under the target
    target8: () => {
      const H = [3, 5, 8, 11, 13, 14, 15, 26, 4, 6, 5, 4, 3];
      let s = t(280, 16, "Schematic, not real data: reported response times when 8 minutes is the target", { c: C.mut, fs: 11 });
      const y0 = 170, k = 5;
      H.forEach((v, i) => {
        const x = 50 + i * 38;
        s += '<rect x="' + x + '" y="' + (y0 - v * k) + '" width="30" height="' + v * k + '" fill="' + (i === 7 ? C.pink : C.cyan) + '"/>' + t(x + 15, y0 + 14, i + 1, { fs: 10, c: C.mut });
      });
      s += '<line x1="' + (50 + 8 * 38 - 4) + '" x2="' + (50 + 8 * 38 - 4) + '" y1="30" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2" stroke-dasharray="5 4"/>' + t(50 + 8 * 38, 44, "target: 8 min", { c: C.lime, a: "start", fs: 11 }) + t(280, y0 + 30, "minutes (the spike just under 8 is the signature of reclassified times)", { c: C.mut, fs: 10 });
      return svg(560, 206, s, "Schematic histogram with a spike just under the eight-minute target");
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
        const W = 560, H = 240, x0 = 50, x1 = 540, y0 = 200, y1 = 30;
        const X = (D) => x1 - ((x1 - x0) * D) / 60,
          Y = (V) => y0 - ((y0 - y1) * V) / 110;
        const ss = [], ll = [];
        for (let D = 60; D >= 0; D -= 1) {
          ss.push([X(D), Y(this.val(100, D, v.expo))]);
          ll.push([X(D), Y(this.val(120, D + 7, v.expo))]);
        }
        let s = defs + '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '" stroke="' + C.line + '"/>';
        s += t(x0, 222, "60 days away", { c: C.mut, fs: 10, a: "start" }) + t(x1, 222, "the day itself", { c: C.mut, fs: 10, a: "end" }) + t(300, 236, "time passes →", { c: C.mut, fs: 10 });
        s += polyline(ss, C.pink, 2.6) + polyline(ll, C.cyan, 2.6);
        if (!v.expo) s += '<line x1="' + X(25) + '" x2="' + X(25) + '" y1="' + y1 + '" y2="' + y0 + '" stroke="' + C.amber + '" stroke-dasharray="4 4"/>' + t(X(25), y1 - 6, "the flip (~25 days out)", { c: C.amber, fs: 10 }) + t((x0 + X(25)) / 2, y0 - 50, "blue on top: you plan to wait", { c: C.cyan, fs: 11 }) + t((X(25) + x1) / 2, y0 - 50, "pink on top: you grab", { c: C.pink, fs: 11 });
        else s += t(300, y0 - 50, "pink stays on top at every distance: no flip", { c: C.pink, fs: 11 });
        const a = this.val(100, v.d, v.expo), b = this.val(120, v.d + 7, v.expo);
        s += '<line x1="' + X(v.d) + '" x2="' + X(v.d) + '" y1="' + y1 + '" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2"/>';
        s += '<circle cx="' + X(v.d) + '" cy="' + Y(a) + '" r="5" fill="' + C.pink + '"/><circle cx="' + X(v.d) + '" cy="' + Y(b) + '" r="5" fill="' + C.cyan + '"/>';
        s += t(70, 46, "100 EGP on the day", { c: C.pink, a: "start", fs: 11 }) + t(70, 62, "120 EGP a week later", { c: C.cyan, a: "start", fs: 11 });
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
          const cx = 40 + (i % 8) * 68, cy = 30 + Math.floor(i / 8) * 50;
          if (p.down && !v.miss) return;
          const o = p.down ? 0.35 : 1;
          s += '<g opacity="' + o + '"><path d="M' + (cx - 3) + " " + (cy - 20) + " h6 v38 h-6 Z M" + (cx - 24) + " " + (cy - 3) + " h48 v6 h-48 Z M" + (cx - 9) + " " + (cy + 15) + ' h18 v4 h-18 Z" fill="#26405e"' + (p.down ? ' stroke="' + C.pink + '" stroke-dasharray="2 2"' : "") + '/><circle cx="' + (cx - 12) + '" cy="' + cy + '" r="3.2" fill="#3b5877"/><circle cx="' + (cx + 12) + '" cy="' + cy + '" r="3.2" fill="#3b5877"/>';
          for (const [r, a, b] of p.hits) {
            const [dx, dy] = pos[r](a, b);
            s += '<circle cx="' + (cx + dx) + '" cy="' + (cy + dy) + '" r="2.2" fill="' + (r === "engine" ? C.amber : C.pink) + '"/>';
          }
          s += "</g>";
        });
        return svg(560, 310, s, "A fleet of planes with bullet holes; gaps are planes that did not return");
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
          for (let k = 0; k < n; k++, i++) s += '<circle cx="' + (14 + (i % 40) * 13.5) + '" cy="' + (12 + Math.floor(i / 40) * 12) + '" r="4.4" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="1.4"' : "") + "/>";
        };
        put(c.tp, C.pink);
        put(c.fn, "none", C.pink);
        put(c.fp, C.amber);
        put(c.tn, "#26405e");
        return svg(560, 312, s, "1000 people: sick and positive, sick and missed, healthy but flagged, healthy and clear");
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
        const T = this.sim(v), x0 = 40, x1 = 540, y0 = 210, Y = (c) => y0 - ((c - 10) * 180) / 50, X = (i) => x0 + ((x1 - x0) * i) / 59;
        let s = '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + Y(38) + '" y2="' + Y(38) + '" stroke="' + C.lime + '" stroke-dasharray="5 4"/>' + t(x1, Y(38) - 6, "wanted: 38 °C", { c: C.lime, a: "end", fs: 11 });
        for (const g of [10, 20, 30, 40, 50, 60]) s += t(x0 - 6, Y(g) + 4, g, { c: C.mut, fs: 10, a: "end" });
        s += polyline(T.map((c, i) => [X(i), Y(c)]), C.cyan, 2.6) + t(290, 232, "seconds →", { c: C.mut, fs: 10 });
        return svg(560, 240, s, "Water temperature over one minute");
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
        const x0 = 40, x1 = 540, y0 = 200, X = (p) => x0 + ((x1 - x0) * p) / 10, Y = (y) => y0 - (y * 160) / 5;
        const M = [], T = [];
        for (let p = 0; p <= 10; p += 0.25) {
          const r = this.at(p, v.a);
          M.push([X(p), Y(r.M)]);
          T.push([X(p), Y(r.T)]);
        }
        const r = this.at(v.p, v.a);
        let s = polyline(M, C.amber, 2.6) + polyline(T, C.green, 2.6);
        s += '<line x1="' + X(v.p) + '" x2="' + X(v.p) + '" y1="30" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2"/><circle cx="' + X(v.p) + '" cy="' + Y(r.M) + '" r="5" fill="' + C.amber + '"/><circle cx="' + X(v.p) + '" cy="' + Y(r.T) + '" r="5" fill="' + C.green + '"/>';
        s += t(60, 40, "the number that is rewarded", { c: C.amber, a: "start", fs: 11 }) + t(60, 56, "the real thing it was meant to track", { c: C.green, a: "start", fs: 11 }) + t(290, 226, "reward riding on the number →", { c: C.mut, fs: 10 });
        return svg(560, 236, s, "A rewarded number and the real outcome as pressure rises");
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
        let s = t(280, 20, name, { c: C.lime, fs: 12 });
        this.O.forEach((o, i) => {
          const y = 44 + i * 46, ok = fit[i];
          s += box(20, y, 520, 38, ok ? C.green : C.pink) + t(40, y + 24, ok ? "✓" : "✗", { c: ok ? C.green : C.pink, fs: 16, fw: 900 });
          const words = o.split(" "), l1 = [], l2 = [];
          let n = 0;
          for (const w of words) (n += w.length + 1) < 72 ? l1.push(w) : l2.push(w);
          s += t(60, y + (l2.length ? 16 : 24), l1.join(" "), { a: "start", fs: 11, fw: 600 }) + (l2.length ? t(60, y + 31, l2.join(" "), { a: "start", fs: 11, fw: 600 }) : "");
        });
        return svg(560, 232, s, "Which observations an explanation can account for");
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
    title: "Tying your own hands",
    hook: "Why would a rational person deliberately tie his own hands?",
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
          { t: "He expects to change his mind, and decides now which version of himself to obey", ok: true, why: "The rope alone is not enough: he is the captain and could order it untied. The order removes his own authority at the moment it will be misused." },
          { t: "He doesn't trust the crew to hold the ropes", bug: "agent", why: "The crew have wax in their ears and no reason to act. The risk at the song is **him**." },
          { t: "He wants to prove his willpower by resisting the song", bug: "willpower", why: "The plan works because it does **not** rely on willpower. If willpower were enough, he would not need the rope." },
          { t: "It makes no difference; the ropes do all the work", bug: "omission", why: "A captain's order can untie any rope. Without the order, the rope has an exit: his own command." },
        ],
        after: "This is the whole idea in one scene: a **present self** who can see clearly, a **future self** who will want something else, and a rule built now to bind the later self.",
      },
      { id: "c3", type: "scene", stage: "reveal", min: 2, src: ["kirby"], terms: ["present", "inconsist", "discount"], title: "Why the later you disagrees with the earlier you", body: "Offer people 100 EGP today or 120 EGP in a week: many take the 100. Push the **same** choice a year away (100 in 52 weeks, 120 in 53): most now wait for the 120.\n\nNothing about the money changed. Only the distance did. Far away, a week's delay looks tiny; up close, it looks huge. So your ranking **flips** as the day approaches. The name for this family of findings is [[inconsist|time inconsistency]], and the pull of the nearest reward is [[present|present bias]].", reps: [{ kind: "numbers", label: "In numbers", body: "A common model: a reward A delayed D days feels worth A / (1 + 0.1·D).\n\nOn the day: 100 feels 100; 120-in-a-week feels 120/1.7 ≈ **71** → take the 100.\n\n60 days out: 100 feels 100/7 ≈ **14.3**; 120 feels 120/7.7 ≈ **15.6** → plan to wait." }, { kind: "analogy", label: "An analogy", body: "Two buildings, one tall and far, one short and near. From far away you see which is taller. Walk right up to the short one and it blocks the whole sky. The heights never changed; your distance did." }] },
      { id: "c4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["kirby"], stem: "Before touching the model: as the choice gets closer, what happens to someone who plans to wait for the 120?", options: [{ t: "At some point before the day, the 100 starts to look better and the plan flips", ok: true, why: "That is the reversal the model will show you." }, { t: "Nothing: a sensible person keeps the same preference", bug: "consistency", why: "That is the textbook (exponential) agent. Real choices are measured to reverse." }, { t: "The 120 looks better and better as the day approaches", bug: "inversion", why: "The opposite: the nearer reward gains the most as it approaches." }] },
      { id: "c5", type: "model", stage: "model", min: 3, model: "discount", src: ["kirby"], title: "Drag the day closer", body: "Start 60 days away. Move the slider towards 0 and watch which reward wins. Then switch on the textbook agent.", ask: "**Find the flip.** Where does the pink line (now) rise above the blue (wait)? Does the textbook agent ever flip?", terms: ["discount"] },
      {
        id: "c6", type: "contrast", stage: "contrast", min: 3, src: ["smart", "cares"], title: "Two real designs, two continents", body: "Both were tested in the field with real money.",
        left: { title: "Save More Tomorrow (USA)", body: "Employees agree **now** to save a slice of their **future** pay rises. Nothing leaves today's pay. **78%** of those offered joined; average saving rose from **3.5% to 11.6%** over 28 months." },
        right: { title: "CARES (the Philippines)", body: "Smokers put **their own money** in an account; it goes to charity unless a urine test at 6 months is clean. Only **11%** signed up, but those offered were **3 points** more likely to quit, and it lasted to 12 months." },
        q: {
          stem: "What do the two designs share underneath?",
          options: [
            { t: "Both let a calm self decide now, and make the future self's tempting choice automatic or costly", ok: true, why: "SMarT makes saving the default before the raise arrives; CARES puts a price on the cigarette at the moment of temptation." },
            { t: "Both pay people to behave well", bug: "surface", why: "Nobody is paid. In CARES the smoker risks **his own** money; SMarT pays nothing at all." },
            { t: "Both train stronger willpower", bug: "willpower", why: "Neither trains anything. Both change the **situation** the later self will face." },
            { t: "Both are about health", bug: "surface", why: "One is about money, one about health: the topic is the surface; the mechanism is the same." },
          ],
          after: "Notice the 11%: most smokers did **not** want to bind themselves. People often don't expect their own future weakness. A device only helps those who see the flip coming.",
        },
      },
      { id: "c7", type: "scene", stage: "reveal", min: 1.5, opt: true, src: ["cortes"], terms: ["device", "hatch"], title: "Where devices break", body: "A [[device|commitment device]] can fail in two opposite ways.\n\n**Too loose:** an exit costs nothing (an app timer you can dismiss with one tap). The later self simply takes the exit.\n\n**Too tight:** no exit even when life genuinely changes (a real emergency). Then you abandon the whole device. Good designs keep a narrow, costly [[hatch|escape hatch]].", reps: [{ kind: "counterexample", label: "A myth, checked", body: "“Cortés burned his ships so his men could not retreat” is the famous version. Historians find he had most of them **stripped and sunk**, not burned. The mechanism (removing the retreat) is real; the vivid detail is not. Good stories drift; check them." }] },
      { id: "c8", type: "q", kind: "transfer", stage: "transfer", min: 1.5, stem: "You want to stop checking your phone during a study block. Which is a real commitment device?", options: [{ t: "Leave the phone with a friend who gives it back at 10 pm", ok: true, why: "The later self cannot get it without a real cost (asking, waiting)." }, { t: "Promise yourself to be strong this time", bug: "willpower", why: "A promise binds the self that makes it, not the self who breaks it." }, { t: "A focus app you can switch off with one tap", bug: "cheapexit", why: "The exit costs one tap, which the tempted self will pay." }, { t: "A photo of your goal on the wall", bug: "omission", why: "A reminder informs; it does not constrain. The flip happens anyway." }] },
      { id: "c9", type: "q", kind: "far", stage: "far", min: 2, src: ["kydland"], stem: "Many countries hand interest-rate decisions to a central bank their own government cannot easily overrule. Why would a government give away its own power?", options: [{ t: "To bind itself in advance against a predictable temptation, such as easy money before an election", ok: true, why: "Kydland and Prescott (1977) showed that a policy-maker free to re-decide each period does worse than one bound to a rule: the same flip, at the scale of a state." }, { t: "Because economists are always smarter than politicians", bug: "authority", why: "The argument does not need smarter bankers; it needs a decision-maker who cannot be tempted at the moment of choice." }, { t: "To save money on salaries", bug: "surface", why: "Irrelevant to the mechanism." }, { t: "Because the constitution requires it everywhere", bug: "omission", why: "It is a choice many states made, for this reason." }] },
      {
        id: "c10", type: "forge", stage: "forge", min: 3, title: "Build one for your own week", body: "Pick one part in each row. The machine will tell you which part will break first.",
        slots: [
          { key: "target", label: "The moment you want to protect", options: [{ t: "the 1 am scroll", grade: "good", note: "A clear, recurring moment: the best kind to bind.", say: "the 1 am scroll" }, { t: "starting the MCQ block late", grade: "good", note: "Recurring and specific: good.", say: "starting the MCQ block late" }, { t: "being more productive in general", grade: "bad", note: "Too vague to bind: a device needs a specific moment.", say: "being more productive" }] },
          { key: "constraint", label: "What makes the tempting option hard", options: [{ t: "phone charges outside the bedroom from 00:30", grade: "good", note: "A physical barrier at the exact moment of temptation.", say: "the phone charges outside the bedroom from 00:30" }, { t: "I'll try harder", grade: "bad", note: "Willpower is what fails at the moment; this is not a constraint.", say: "I will try harder" }, { t: "an app limit I can dismiss", grade: "weak", note: "An exit that costs one tap will be taken.", say: "an app limit is on" }] },
          { key: "enforcer", label: "Who or what holds you to it", options: [{ t: "a friend who checks at 7 am", grade: "good", note: "Another person makes the break visible.", say: "a friend checks at 7 am" }, { t: "10 EGP to a cause I dislike per break", grade: "good", note: "A price you chose in advance, like CARES.", say: "each break costs 10 EGP to a cause I dislike" }, { t: "nothing, just me", grade: "bad", note: "The enforcer would be the same self who breaks it.", say: "nobody checks" }] },
          { key: "hatch", label: "The escape hatch", options: [{ t: "only a real emergency call, and I tell my friend", grade: "good", note: "Narrow, visible, costly: the hatch stays a hatch.", say: "only for a real emergency, reported to my friend" }, { t: "none: never, whatever happens", grade: "weak", note: "Too tight: the first genuine exception will kill the whole device.", say: "there is no exception" }, { t: "whenever I really feel like it", grade: "bad", note: "That is the tempted self's exit, not a hatch.", say: "I can skip it whenever I feel like it" }] },
        ],
        template: "Protecting **{target}**: {constraint}; {enforcer}; exception: {hatch}.",
        critique: { stem: "Three weeks in, the device annoys you and you want to cancel it at midnight. What does today's idea say?", options: [{ t: "That is the self the device was built against: change rules only at a calm time, like Sunday morning", ok: true, why: "Decide rules when you can see the whole voyage, never at the song." }, { t: "Cancel it: if it's annoying, it's wrong", bug: "inversion", why: "Annoyance at the moment of temptation is the device working." }, { t: "Replace it with a stronger promise", bug: "willpower", why: "A promise is the weakest device there is." }] },
      },
    ],
    challenge: { stem: "Why do some people put their alarm clock across the room?", options: [{ t: "So the sleepy morning self has to get up to stop it: the evening self binds him", ok: true }, { t: "Because the sound is better from far away", bug: "surface" }, { t: "To build willpower", bug: "willpower" }] },
    hooks: [
      { id: "commit.h1", gap: 1, q: { stem: "Why does a plan made far ahead often flip when the moment arrives?", options: [{ t: "Up close, the nearer reward gains weight much faster than the later one", ok: true }, { t: "Because new information always arrives", bug: "omission" }, { t: "Because people are lazy", bug: "moral" }], after: "The distance changed, not the rewards." } },
      { id: "commit.h2", gap: 7, q: { stem: "Many people buy a monthly gym contract, then go so rarely that pay-per-visit would have been cheaper. Which idea explains it best?", options: [{ t: "They expected their future self to go often; the future self preferred the sofa", ok: true, why: "DellaVigna & Malmendier (2006) found this pattern in real gym data." }, { t: "Gyms trick everyone with hidden fees", bug: "agent" }, { t: "People don't care about money", bug: "moral" }] } },
      { id: "commit.h3", gap: 30, q: { stem: "A good commitment device has an exit that is…", options: [{ t: "narrow and costly, agreed in advance", ok: true }, { t: "absent, so it can never be broken", bug: "rigid" }, { t: "easy, so it never annoys you", bug: "cheapexit" }] } },
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
      { id: "s2", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["wald"], stem: "Where would you put the armour?", alt: "Think about the planes you **cannot** inspect.", options: [{ t: "Around the engines, where the returning planes have the fewest holes", ok: true, why: "The holes on returning planes mark where a plane can be hit **and still come home**." }, { t: "On the wings and body, where the holes are", bug: "selection", why: "That armours the places that proved survivable. The sample was chosen by survival." }, { t: "Spread evenly, since bullets hit at random", bug: "omission", why: "The hits may be random; the **survival** is not. That is the whole point." }, { t: "Nowhere: the holes show the plane is tough enough", bug: "selection", why: "Only the tough cases are in front of you." }] },
      { id: "s2b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "Suppose every hit, anywhere, were equally likely to bring a plane down. What pattern would the planes that came back show?", options: [{ t: "The same spread of holes as all the planes", ok: true, why: "If survival doesn't depend on where the plane was hit, the survivors are a fair sample of where hits land." }, { t: "Still few engine holes", bug: "selection", why: "Only if engine hits are deadlier. Take that away and the gap disappears." }, { t: "More engine holes than elsewhere", bug: "inversion", why: "Nothing in the setup makes engine hits more survivable." }], after: "Keep this prediction: the model's danger slider lets you check it." },
      { id: "s3", type: "model", stage: "model", min: 3, model: "planes", src: ["wald"], title: "Bring back the missing planes", body: "Each plane takes three hits, spread by area. Engine hits are dangerous; other hits rarely are. First look only at the planes that came home. Then switch on the missing ones.", ask: "**Before you switch:** count the engine holes (amber) on the returning planes. Then compare with all planes. Try the danger slider at 0%: what happens to the difference?", terms: ["sample"] },
      { id: "s4", type: "scene", stage: "reveal", min: 2, terms: ["selbias", "surv", "sample"], title: "The question to ask of any data", body: "The data you see was produced by a process. If that process **depends on the outcome** you care about, the data will lie to you in a predictable direction. This is [[selbias|selection bias]]; when the filter is survival, it's [[surv|survivorship bias]].\n\nThe habit: before reading the numbers, ask **what had to happen for this case to reach me?** Then picture the cases that didn't.", reps: [{ kind: "counterexample", label: "When there is no bias", body: "Set the danger slider to 0%. Now surviving does not depend on where the plane was hit, so the returning planes show the same pattern as all planes. **No filter linked to the outcome, no bias.** The bias is not in having a sample; it is in how the sample was chosen." }, { kind: "analogy", label: "An analogy", body: "A nightclub bouncer lets in only people wearing black shoes. Inside, you notice everyone wears black shoes and conclude it's the town's fashion. The bouncer made your data." }] },
      {
        id: "s5", type: "contrast", stage: "contrast", min: 2.5, title: "Two pieces of advice you've heard", body: "Same structure, very different topics.",
        left: { title: "“Drop out and build a company”", body: "Famous founders who left university are interviewed everywhere. The far larger number who dropped out and failed are never interviewed." },
        right: { title: "“Old buildings were built better”", body: "The old buildings still standing are solid. The badly built ones of the same era fell down or were demolished long ago." },
        q: { stem: "What do these share?", options: [{ t: "In both, the cases you see were filtered by the very outcome being judged (success, standing)", ok: true, why: "Survival picked the sample, then the sample is used to judge what causes survival." }, { t: "Both are about the past", bug: "surface", why: "Time is a surface feature; the filter is the mechanism." }, { t: "Both show that success is random", bug: "inversion", why: "They show nothing about randomness; they show a filtered sample." }, { t: "Both are simply false", bug: "omission", why: "Some old buildings are excellent. The problem is the inference, not every fact." }] },
      },
      { id: "s6", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "Hospital A's surgeons have higher death rates than Hospital B's for the same operation. Your relative needs it. What first?", options: [{ t: "Ask which patients each hospital receives: a referral centre may get the sickest cases", ok: true, why: "If A takes the hardest cases, a higher death rate can hide better surgery. Compare like with like." }, { t: "Choose B: the numbers are clear", bug: "selection", why: "The numbers compare different patients." }, { t: "Choose A: famous hospitals are better", bug: "authority", why: "Fame is not evidence." }, { t: "Ignore statistics entirely", bug: "omission", why: "The fix is better comparison, not no comparison." }] },
      { id: "s7", type: "q", kind: "far", stage: "far", min: 2, src: ["berkson"], terms: ["berkson"], stem: "A university admits students who are either very talented or very hard-working (or both). Inside it, talented students seem to work less. Why?", options: [{ t: "Admission filtered the students: anyone low on both was excluded, which creates the pattern", ok: true, why: "Among the admitted, low talent implies high effort and vice versa. The filter made the link: [[berkson|Berkson's paradox]]." }, { t: "Talent makes people lazy", bug: "inversion", why: "The pattern appears even if talent and effort are unrelated in everyone." }, { t: "Hard workers are jealous of talent", bug: "moral", why: "A story, not a mechanism; the filter explains it without any psychology." }, { t: "It's a coincidence", bug: "omission", why: "It is predictable, not coincidental." }] },
      {
        id: "s8", type: "forge", stage: "forge", min: 3, title: "Audit a claim", body: "Pick a claim you might hear, the filter behind it, and the missing planes you'd need.",
        slots: [
          { key: "claim", label: "The claim", options: [{ t: "“People who take vitamin D are healthier”", grade: "good", note: "A classic: healthier, wealthier people are the ones who take supplements.", say: "people who take vitamin D are healthier" }, { t: "“Everyone I know who studied abroad got rich”", grade: "good", note: "Who studies abroad, and whom do you know?", say: "everyone I know who studied abroad got rich" }, { t: "“Top students all use method X”", grade: "good", note: "Do weak students use it too?", say: "top students all use method X" }] },
          { key: "filter", label: "The filter", options: [{ t: "who ends up in the group was already different before the thing happened", grade: "good", note: "Right: selection before the outcome.", say: "the people in the group were different to begin with" }, { t: "the claim is false", grade: "bad", note: "You don't know that yet; the question is whether the data can show it.", say: "it is false" }, { t: "the sample is small", grade: "weak", note: "Size isn't the main problem: a huge filtered sample misleads just as well.", say: "the sample is small" }] },
          { key: "missing", label: "The missing planes you'd want", options: [{ t: "the same comparison in people who didn't choose it, matched or randomly assigned", grade: "good", note: "Now the filter is broken.", say: "a comparison group that did not choose it, ideally assigned at random" }, { t: "more stories from people it worked for", grade: "bad", note: "More survivors, same filter.", say: "more success stories" }, { t: "an expert's opinion", grade: "weak", note: "Useful context, not a fix for the filter.", say: "an expert's opinion" }] },
        ],
        template: "Claim: **{claim}**. The catch: {filter}. What would settle it: {missing}.",
        critique: { stem: "You find a big study showing the vitamin D link in 100,000 people. Does size fix the problem?", options: [{ t: "No: a larger filtered sample gives a more precise wrong answer", ok: true }, { t: "Yes: 100,000 people can't be wrong", bug: "selection", why: "Size shrinks random error, not the filter: the same kind of people still choose the pill." }, { t: "Yes, if it's published", bug: "authority", why: "Publication checks the method was reported, not that the filter was broken." }] },
      },
    ],
    challenge: { stem: "Old songs from the 1970s seem better on average than today's songs. Most likely reason?", options: [{ t: "Only the old songs people still play have survived to reach you; the forgotten ones are filtered out", ok: true }, { t: "Musicians were more talented then", bug: "selection" }, { t: "Modern equipment is worse", bug: "surface" }] },
    hooks: [
      { id: "select.h1", gap: 1, q: { stem: "Why were the engines, not the wings, the place to armour?", options: [{ t: "Planes hit in the engine mostly didn't return, so their holes were missing from the sample", ok: true }, { t: "Engines are more expensive", bug: "surface" }, { t: "Wings already had armour", bug: "omission" }] } },
      { id: "select.h2", gap: 7, q: { stem: "A course advertises: “90% of our graduates pass the exam.” The first question to ask?", options: [{ t: "Who got in and who dropped out before graduating", ok: true }, { t: "How good the teachers are", bug: "authority" }, { t: "Whether 90% is higher than last year", bug: "selection" }] } },
      { id: "select.h3", gap: 30, q: { stem: "When does a sample NOT mislead about the outcome, even if it is small?", options: [{ t: "When the way cases got into it has nothing to do with the outcome", ok: true }, { t: "When it is large", bug: "selection" }, { t: "When an expert collected it", bug: "authority" }] } },
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
      { id: "b2", type: "scene", stage: "reveal", min: 2, src: ["gh95"], terms: ["baserate", "sens", "fp", "ppv"], title: "Count people, not percentages", body: "Percentages hide **which group** they are about. Counts don't. Start with 1,000 people and let the numbers flow down the tree.\n\nThe [[sens|sensitivity]] (90%) is about the sick. The [[fp|false positives]] come from the healthy, and there are 99 times more healthy people. So a positive is **mostly** healthy people. What you wanted is the [[ppv|positive predictive value]], and it depends on the [[baserate|base rate]].", reps: [{ kind: "diagram", label: "The tree", svg: "tree", body: "Positives: 9 + 89 = 98. Sick among them: 9. **9 ÷ 98 ≈ 9%.**" }, { kind: "analogy", label: "An analogy", body: "A smoke alarm that goes off whenever you make toast. It catches every fire, but most of its alarms are toast, because you make toast far more often than you have fires." }] },
      { id: "b2b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "Same rare disease (1 in 100). Imagine a test that **never** flags a healthy person, but still misses 10% of sick people. A positive now means…", options: [{ t: "Certainly sick: every positive is a true positive", ok: true, why: "With no false positives, the healthy majority can't flood the positives. The missed 10% only matter for negatives." }, { t: "Still about 9%", bug: "baserate", why: "The 9% came from healthy people being flagged; remove them and it changes completely." }, { t: "About 90%", bug: "inverse", why: "90% is still about the sick group, not the positive group." }], after: "So when a disease is rare, the false-positive rate matters more than the catch rate. The model will show it." },
      { id: "b3", type: "model", stage: "model", min: 3, model: "icons", src: ["gh95"], title: "1,000 people, three sliders", body: "Each dot is a person. Move the sliders and watch what a positive means.", ask: "**Try:** keep the test the same and move 'how common' from 1% to 50%. Then make the test perfect at catching (100%) but keep 9% false flags at 1% prevalence. Which slider matters most when the disease is rare?", terms: ["natfreq"] },
      {
        id: "b4", type: "contrast", stage: "contrast", min: 3, src: ["clark"], terms: ["prosecutor"], title: "A clinic and a courtroom",
        left: { title: "The screening clinic", body: "“The test flags only 9% of healthy people, so a positive probably means disease.” Wrong when disease is rare: most positives are healthy." },
        right: { title: "The Sally Clark trial (England, 1999)", body: "Two infant deaths. A paediatrician told the court the chance of two natural cot deaths was **1 in 73 million** (1 in 8,543, squared). Rare, so she must be guilty? The Royal Statistical Society protested; the convictions were **quashed in 2003**." },
        q: { stem: "What single error do both make?", options: [{ t: "Treating “this evidence is rare if the innocent story is true” as “the innocent story is rare”", ok: true, why: "Double murder is also extremely rare. Compare the two stories against each other, not one against zero. That confusion is the [[prosecutor|prosecutor's fallacy]]." }, { t: "Using statistics at all in medicine and law", bug: "omission", why: "The fix is correct statistics, not none." }, { t: "Trusting experts", bug: "authority", why: "The problem is the reasoning, whoever says it." }, { t: "Using numbers that are too small", bug: "surface", why: "Size isn't the issue; the direction of the conditional is." }], after: "The trial number also had a second flaw: squaring assumed the two deaths were **independent**, but a shared genetic or environmental cause makes a second death far less surprising." },
      },
      { id: "b5", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "An airport scanner flags 1 in 1,000 innocent travellers and catches 99% of smugglers. About 1 traveller in a million is a smuggler. The alarm goes off. Probably a smuggler?", options: [{ t: "No: per million travellers, about 1,000 innocent people are flagged for every smuggler caught", ok: true, why: "1,000,000 travellers: ~1 smuggler (caught), ~1,000 innocents flagged. About 0.1%." }, { t: "Yes: 99% accurate", bug: "inverse", why: "99% is about smugglers; the alarm is mostly about innocents." }, { t: "50–50", bug: "baserate", why: "Count it: 1 vs about 1,000." }] },
      { id: "b6", type: "q", kind: "far", stage: "far", min: 2, stem: "The **same** test (90% catch, 9% false flags) is now used in a clinic where half the patients already have classic symptoms. A positive now means…", options: [{ t: "Much more: with a 50% base rate, about 91% of positives are sick", ok: true, why: "Of 1,000: 500 sick → 450 positive; 500 healthy → 45 flagged. 450/495 ≈ 91%. Same test, different meaning." }, { t: "The same as before: the test didn't change", bug: "baserate", why: "The test didn't change; the people walking in did." }, { t: "Less, because more people are tested", bug: "inversion", why: "It's the proportion of sick people that changed, and it went up." }] },
      {
        id: "b7", type: "forge", stage: "forge", min: 3, title: "Make any percentage safe", body: "Build the counting habit for any 'accurate test' claim.",
        slots: [
          { key: "start", label: "Start with", options: [{ t: "1,000 people", grade: "good", note: "Round and big enough to avoid fractions.", say: "1,000 people" }, { t: "the test's accuracy", grade: "bad", note: "Starting from the test is how the error starts.", say: "the test's accuracy" }, { t: "one patient", grade: "weak", note: "One person gives fractions; counts need a crowd.", say: "one patient" }] },
          { key: "first", label: "First split", options: [{ t: "how many have the condition (base rate)", grade: "good", note: "Always the first branch.", say: "how many have it" }, { t: "how many test positive", grade: "weak", note: "You can't know that before knowing who is sick.", say: "how many test positive" }] },
          { key: "then", label: "Then", options: [{ t: "positives among the sick, and false positives among the healthy", grade: "good", note: "Both branches: that's where the flood of false positives appears.", say: "the positives in both branches" }, { t: "only the positives among the sick", grade: "bad", note: "That forgets the healthy majority: the whole error.", say: "only the sick branch" }] },
        ],
        template: "Start with **{start}**, split by **{first}**, then count **{then}**; finally: sick positives ÷ all positives.",
        critique: { stem: "A friend's genetic test says she has a 'variant linked to disease X' found in 1 in 5,000 people. What is the first number you ask for?", options: [{ t: "How often the test wrongly reports that variant in people who don't carry it", ok: true, why: "With something that rare, even a small false-report rate can make most reported variants false." }, { t: "How serious disease X is", bug: "omission", why: "It matters later; first find out whether the result is probably true." }, { t: "Which company made the test", bug: "authority", why: "A brand is not a false-positive rate." }] },
      },
    ],
    challenge: { stem: "A lie detector is right 90% of the time. A company tests 1,000 honest applicants and 10 liars. Of those it calls liars, most are…", options: [{ t: "honest people (about 100 honest vs 9 liars flagged)", ok: true }, { t: "liars, since it's 90% accurate", bug: "inverse" }, { t: "impossible to say", bug: "omission" }] },
    hooks: [
      { id: "base.h1", gap: 1, q: { stem: "Rare disease, good test, positive result. Why is the chance of disease often low?", options: [{ t: "Healthy people vastly outnumber sick ones, so their few false positives outnumber the true ones", ok: true }, { t: "Tests are usually wrong", bug: "inversion" }, { t: "Doctors misread tests", bug: "agent" }] } },
      { id: "base.h2", gap: 7, q: { stem: "“The DNA match would happen by chance in 1 in a million people, so there's a 1 in a million chance he's innocent.” The flaw?", options: [{ t: "In a city of millions, several innocent people would match; the chance of innocence depends on the other evidence too", ok: true }, { t: "DNA is unreliable", bug: "surface" }, { t: "There is no flaw", bug: "inverse" }] } },
      { id: "base.h3", gap: 30, q: { stem: "The same test gives a more meaningful positive when…", options: [{ t: "the condition is more common in the people tested", ok: true }, { t: "more people are tested", bug: "surface" }, { t: "a senior doctor orders it", bug: "authority" }] } },
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
      { id: "l1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["showerex"], stem: "New water takes **4 seconds** to reach you. Every second the water feels cold, you turn the knob firmly towards hot. What happens?", alt: "When the water finally feels right, how many seconds of turning are still travelling up the pipe?", options: [{ t: "It overshoots to too hot, then too cold, swinging", ok: true, why: "You keep turning while the hot water is still on its way; when it arrives, it's too much." }, { t: "It warms smoothly to exactly right", bug: "nodelay", why: "That happens only with no delay, or very gentle turning." }, { t: "It never gets warm", bug: "inversion", why: "It gets warm; the trouble is it doesn't stop at warm." }, { t: "It depends only on the boiler", bug: "agent", why: "Your turning rule is part of the system." }] },
      { id: "l1b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "Same shower, same firm turning, but now the water arrives **instantly**. What happens?", options: [{ t: "It settles on warm without swinging", ok: true, why: "With no delay you see each correction's effect at once and stop in time." }, { t: "It swings just as much", bug: "nodelay", why: "The swinging came from the delay, not from the turning alone." }, { t: "It never reaches warm", bug: "inversion", why: "Firm turning reaches the target quickly." }], after: "Check both predictions in the model: delay 0, then delay 4." },
      { id: "l2", type: "model", stage: "model", min: 3.5, model: "shower", src: ["showerex"], title: "Be the person in the shower", body: "The line is the temperature you feel over one minute.", ask: "**Try three things:** delay 0 (instant water); delay 4 turning hard; delay 4 turning gently. Which change fixes the swinging: waiting, or turning harder?", terms: ["delay", "gain"] },
      { id: "l3", type: "scene", stage: "reveal", min: 2.5, src: ["sterman"], terms: ["loop", "bal", "rein"], title: "Two shapes that run most systems", body: "In a [[loop|feedback loop]], the result changes the next action. There are two kinds.\n\nA [[bal|balancing loop]] pushes back towards a goal: the shower, a thermostat, blood sugar after a meal. Add a **delay** and a strong reaction, and it overshoots and swings.\n\nA [[rein|reinforcing loop]] feeds itself: more leads to more. Savings with interest, panic in a bank run, a microphone that howls.", reps: [{ kind: "diagram", label: "The two loops", svg: "loops", body: "Follow the arrows: in B, the second arrow is **−** (insulin lowers glucose), so the loop corrects itself. In R, both arrows are **+**, so it runs away." }, { kind: "story", label: "The Beer Game", body: "In John Sterman's 1989 experiment, managers ran a four-stage beer supply chain with shipping delays. Orders swung wildly and players blamed the other players. Sterman showed the swings came mostly from ignoring the orders **already on the way**: the shower, with beer." }] },
      {
        id: "l4", type: "contrast", stage: "contrast", min: 2.5, src: ["dd"], title: "Your body and a bank",
        left: { title: "Blood sugar after a meal", body: "Glucose rises → the pancreas releases insulin → cells take up glucose → glucose falls → insulin falls. A goal is defended." },
        right: { title: "A bank run", body: "Some depositors withdraw → others fear the bank will run out → they withdraw too → the bank really runs short. The fear makes itself true." },
        q: { stem: "What is the real difference between them?", options: [{ t: "The sign of the loop: one link reverses the change (insulin lowers glucose), the other amplifies it (fear raises withdrawals)", ok: true, why: "Same shape, a loop; one sign flips everything." }, { t: "One is biology, one is money", bug: "surface", why: "The domains differ; the mechanism is what matters, and the mechanism differs in sign." }, { t: "The bank run has no loop, just panic", bug: "omission", why: "Panic is one link of a loop: withdrawals feed fear, fear feeds withdrawals." }, { t: "Blood sugar has no goal", bug: "inversion", why: "It defends a range: that's what a balancing loop does." }] },
      },
      { id: "l5", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["sterman"], stem: "A shop manager sees sales rise and orders more stock; the order arrives three weeks later. Meanwhile she keeps ordering because the shelves still look empty. What helps most?", options: [{ t: "Count what is already ordered and on the way, and correct in smaller steps", ok: true, why: "Seeing the pipeline removes the delay from your head; gentler steps reduce the swing." }, { t: "Order faster and bigger whenever shelves look empty", bug: "gain", why: "More gain with the same delay makes the swings worse." }, { t: "Blame the supplier", bug: "agent", why: "The swings come from the structure, not a villain." }] },
      { id: "l6", type: "q", kind: "far", stage: "far", min: 1.5, stem: "A microphone near its own speaker starts a rising howl. Which kind of loop, and what is the fastest fix?", options: [{ t: "Reinforcing: sound → mic → amplifier → louder sound; turn the gain down or move the mic", ok: true, why: "Lower the gain or break the path and the loop can no longer feed itself." }, { t: "Balancing: it will settle by itself", bug: "inversion", why: "It rises, it doesn't settle: every pass adds volume." }, { t: "No loop: the speaker is broken", bug: "omission", why: "A working speaker plus a path back to the mic is the loop." }] },
      {
        id: "l7", type: "forge", stage: "forge", min: 3, title: "Draw the loop of a habit", body: "Pick the pieces of a common late-night loop and where you'd cut it.",
        slots: [
          { key: "a", label: "Start", options: [{ t: "late-night phone", grade: "good", note: "A clear, observable behaviour.", say: "late-night phone" }] },
          { key: "b", label: "It leads to", options: [{ t: "tired and slow the next day", grade: "good", note: "The link is real and quick.", say: "tired the next day" }, { t: "better mood", grade: "weak", note: "Maybe tonight; tomorrow it's the reverse.", say: "better mood" }] },
          { key: "c", label: "Which leads to", options: [{ t: "studying late to catch up, wired and restless", grade: "good", note: "That closes the loop back to the phone: it's reinforcing.", say: "studying late to catch up" }, { t: "going to bed early", grade: "bad", note: "That would be a balancing link; ask whether it happens.", say: "going to bed early" }] },
          { key: "cut", label: "Where to cut it", options: [{ t: "the phone at 00:30 (session 1's device)", grade: "good", note: "Cut at the cheapest link, before the loop turns again.", say: "the phone at 00:30" }, { t: "working harder the next day", grade: "bad", note: "That feeds the 'studying late' link: it speeds the loop.", say: "working harder the next day" }] },
        ],
        template: "**{a}** → {b} → {c} → back to the phone. Cut at: **{cut}**.",
        critique: { stem: "You cut the loop and sleep better, but the first two nights feel worse (you're restless at midnight). What does today's idea predict?", options: [{ t: "A delay: the benefit arrives days later, so judge it after a week, not a night", ok: true }, { t: "It's failing: go back", bug: "nodelay", why: "Judging a delayed system after one step is the shower mistake." }, { t: "Cut harder: also stop coffee, gym and friends", bug: "gain", why: "A bigger correction on a delayed system makes it swing." }] },
      },
    ],
    challenge: { stem: "A government raises interest rates to cool inflation; the effect takes 12–18 months. Inflation is still high after 6 months. Raising again and again risks…", options: [{ t: "overshooting into a slump when all the delayed effects land together", ok: true }, { t: "nothing: rates work instantly", bug: "nodelay" }, { t: "lower rates", bug: "inversion" }] },
    hooks: [
      { id: "loop.h1", gap: 1, q: { stem: "In a system with a delay, reacting harder to each error usually…", options: [{ t: "makes it swing more", ok: true }, { t: "settles it faster", bug: "gain" }, { t: "changes nothing", bug: "nodelay" }] } },
      { id: "loop.h2", gap: 7, q: { stem: "Rumours that a café is 'the place to be' make it crowded, and crowds make more people want to go. Which loop?", options: [{ t: "Reinforcing", ok: true }, { t: "Balancing", bug: "inversion" }, { t: "No loop", bug: "omission" }] } },
      { id: "loop.h3", gap: 30, q: { stem: "Fever: the body's set temperature rises, and you shiver until you reach it. Shivering is part of…", options: [{ t: "a balancing loop defending a new set point", ok: true }, { t: "a reinforcing loop that will run away", bug: "inversion" }, { t: "no loop: it's a symptom", bug: "omission" }] } },
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
      { id: "p1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["vann"], stem: "Hanoi, 1902: a bounty for each rat tail handed in. Then officials notice rats **without tails** in the streets. Most likely?", alt: "What is the cheapest way to produce a tail?", options: [{ t: "Catchers cut off the tails and let the rats go, so they could breed more tail-bearing rats", ok: true, why: "A live rat without a tail is a rat that will produce more tails. The archives Michael Vann studied describe exactly this." }, { t: "A disease made the rats lose their tails", bug: "agent", why: "The change came from people responding to a reward, not from the rats." }, { t: "The rats evolved shorter tails", bug: "scale", why: "Evolution does not work in months; people do." }, { t: "Officials were lying about the rats", bug: "omission", why: "They saw real rats; the question is why the rats had no tails." }] },
      { id: "p2", type: "scene", stage: "reveal", min: 2.5, src: ["goodhart", "strathern", "vann"], terms: ["proxy", "goodhart", "gaming"], title: "When the number becomes the target", body: "The city wanted **fewer rats**. It could not count dead rats, so it paid for a [[proxy|proxy]]: tails. The moment money rode on tails, the cheapest way to get tails was not to kill rats.\n\nThe economist Charles Goodhart put it this way in 1975: “Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.” The anthropologist Marilyn Strathern's shorter version (1997) is the one people quote: “When a measure becomes a target, it ceases to be a good measure.” That is [[goodhart|Goodhart's law]]; improving the number instead of the thing is [[gaming|gaming]].", reps: [{ kind: "data", label: "A modern case", svg: "target8", body: "England, 2000s: ambulances had to reach 75% of life-threatening calls within **8 minutes**. Bevan and Hood (2006) found reported times piling up just under 8 minutes, and in about a third of services, times had been “corrected” to under 8. The chart is a **schematic** of that pattern, not their data." }, { kind: "counterexample", label: "A story to distrust", body: "You may hear of the “cobra effect” in British Delhi (a cobra bounty that led to cobra farms). It is usually told **without a source**. Keep it as a parable; the Hanoi rats are the documented case." }] },
      { id: "p2b", type: "q", kind: "predict", stage: "predict", min: 1, stem: "The reward on the number stays high, but now the real thing is checked at random half the time. Gaming becomes…", options: [{ t: "Much less worth it, so more effort goes back into real work", ok: true, why: "A random audit makes the cheap route risky: the number and reality move together again." }, { t: "Unchanged: people game whatever you do", bug: "omission", why: "Gaming follows its payoff; audits cut the payoff." }, { t: "More attractive, because people get angry", bug: "inversion", why: "Maybe for some, but on average an audit lowers the return on gaming." }], after: "Test it in the model: pressure up, then the audit slider." },
      { id: "p3", type: "model", stage: "model", min: 3, model: "goodhart", title: "Put pressure on a number", body: "Each person can spend effort on real work (moves both the number and reality) or on gaming (moves the number cheaply, not reality). Gaming works only when nobody checks.", ask: "**Try:** raise the reward with no checks. Watch the number and the real thing separate. Then add checks of the real thing: what happens to the gap?", terms: ["audit"] },
      {
        id: "p4", type: "contrast", stage: "contrast", min: 2.5, src: ["vann", "bevan"], title: "A colony and a health service, a century apart",
        left: { title: "Hanoi, 1902", body: "Goal: fewer rats. Number: tails handed in. Result: more tails, not fewer rats." },
        right: { title: "England, 2000s", body: "Goal: fast help for dying patients. Number: share of calls reached within 8 minutes. Result: many times reported just under 8." },
        q: { stem: "What is the common mechanism?", options: [{ t: "A reward was attached to a number, and changing the number was cheaper than changing reality", ok: true, why: "Different eras, same economics of effort." }, { t: "Both were run by governments", bug: "surface", why: "Companies and students do the same when a number pays." }, { t: "The people involved were dishonest", bug: "moral", why: "Honesty varies; the incentive is what predicts the pattern across thousands of people." }, { t: "Measuring things is useless", bug: "inversion", why: "The measures carried information until they were rewarded; the fix is design, not blindness." }] },
      },
      { id: "p5", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "A medical school ranks students only by MCQ scores from past papers. What gaming would you predict?", options: [{ t: "Memorising past-paper answers without understanding the medicine", ok: true, why: "The cheapest way to raise the number. This is why INTELLECTUALITY keeps 400 held-out questions you never practise: they are the audit." }, { t: "Students will study anatomy more deeply", bug: "proxy", why: "Some will; the number does not require it, so pressure pushes the other way." }, { t: "No gaming: exams are fair", bug: "authority", why: "Fairness doesn't stop the cheapest route." }] },
      { id: "p6", type: "q", kind: "far", stage: "far", min: 1.5, stem: "A video platform pays creators per click, not per minute watched. Predict the content.", options: [{ t: "More misleading thumbnails and titles (clickbait)", ok: true, why: "Clicks are the rewarded proxy for 'people value this'; a misleading title is the cheapest click." }, { t: "Longer, more careful videos", bug: "proxy", why: "Length isn't rewarded; clicks are." }, { t: "No change", bug: "omission", why: "Rewards reliably change what gets made." }] },
      {
        id: "p7", type: "forge", stage: "forge", min: 3, title: "Design a measure that resists gaming", body: "Pick something you track, then protect it.",
        slots: [
          { key: "what", label: "What you really want", options: [{ t: "understanding medicine, not just marks", grade: "good", note: "A real goal, hard to see directly.", say: "understanding medicine" }, { t: "real fitness for MMA", grade: "good", note: "A real goal, hard to see directly.", say: "real fitness" }, { t: "UberBond users actually helped", grade: "good", note: "A real goal, hard to see directly.", say: "users actually helped" }] },
          { key: "number", label: "The number you'll watch", options: [{ t: "a score on questions I have never practised", grade: "good", note: "Held-out items are hard to game: you can't memorise what you haven't seen.", say: "a score on questions I have never practised" }, { t: "hours spent", grade: "bad", note: "Input, not outcome, and the easiest number to inflate.", say: "hours spent" }, { t: "a streak of days", grade: "bad", note: "A streak measures showing up, not getting better.", say: "a streak" }] },
          { key: "counter", label: "A counter-metric", options: [{ t: "a second measure that drops if the first is gamed (e.g. explain it aloud to someone)", grade: "good", note: "Gaming one now costs the other.", say: "a check that falls if I game the first (explaining it aloud)" }, { t: "none needed", grade: "bad", note: "A single rewarded number is the Hanoi setup.", say: "no counter-metric" }] },
          { key: "audit", label: "Audit", options: [{ t: "an occasional surprise test of the real thing", grade: "good", note: "Unpredictable checks remove the reward for gaming.", say: "a surprise check of the real thing now and then" }, { t: "check only the number, more often", grade: "bad", note: "More pressure on the same proxy.", say: "checking the number more often" }] },
        ],
        template: "Goal: **{what}**. Watch: {number}. Counter: {counter}. Audit: {audit}.",
        critique: { stem: "This app shows you no combined 'Renaissance score'. Why, by today's idea?", options: [{ t: "One headline number invites optimising the number instead of the thinking", ok: true }, { t: "Because numbers are useless", bug: "inversion", why: "The separate numbers stay visible in WHY THIS?; only the single headline is withheld." }, { t: "To hide bad results", bug: "moral", why: "Every count, good or bad, is shown with its sample size." }] },
      },
    ],
    challenge: { stem: "A police force is judged by the number of arrests. Most likely side effect?", options: [{ t: "More easy, minor arrests and less work on hard, serious cases", ok: true }, { t: "Less crime overall, automatically", bug: "proxy" }, { t: "No change", bug: "omission" }] },
    hooks: [
      { id: "proxy.h1", gap: 1, q: { stem: "Why did paying for rat tails fail?", options: [{ t: "The cheapest way to produce tails wasn't reducing rats", ok: true }, { t: "The bounty was too small", bug: "gain" }, { t: "Rats are too clever", bug: "agent" }] } },
      { id: "proxy.h2", gap: 7, q: { stem: "Which protects a number from gaming best?", options: [{ t: "Unpredictable checks of the real outcome, plus a counter-metric", ok: true }, { t: "Bigger rewards for the number", bug: "proxy" }, { t: "Measuring it every day", bug: "proxy" }] } },
      { id: "proxy.h3", gap: 30, q: { stem: "A hospital must see A&E patients within 4 hours. Which pattern would suggest gaming?", options: [{ t: "Many patients admitted or moved at 3 h 55 min", ok: true }, { t: "Average times falling slowly over years", bug: "confirm" }, { t: "More staff on night shifts", bug: "omission" }] } },
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
      { id: "f2", type: "q", kind: "predict", stage: "predict", min: 2, src: ["loudon"], stem: "People at the time blamed 'bad air' and epidemics hanging over the city. Which fact does most damage to that explanation?", alt: "What would bad city air predict about **two** clinics in the **same** building?", options: [{ t: "Two clinics breathing the same city air, with patients assigned by alternate days, differ about threefold", ok: true, why: "City air would hit both clinics alike. A steady difference between them needs a cause that differs between them." }, { t: "Many mothers died every year", bug: "confirm", why: "Every explanation predicts deaths; this fact can't tell them apart." }, { t: "Doctors were educated people", bug: "authority", why: "Status says nothing about the cause." }, { t: "The deaths varied from year to year", bug: "omission", why: "Both clinics varied; the gap between them is the clue." }] },
      { id: "f3", type: "model", stage: "model", min: 4, model: "hypo", src: ["tested", "kolletschka"], terms: ["hyp", "confound"], title: "Test the explanations", body: "Semmelweis weighed several explanations. Slide through them. For each, see which observations it can account for.", ask: "Which observation kills the most explanations at once? And what made the last one testable: after his friend Jakob Kolletschka died of a scalpel cut during an autopsy, with the same findings as the mothers, what did the idea **predict** that could have failed?" },
      { id: "f4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["wash"], stem: "In May 1847 Semmelweis made everyone wash their hands in chlorinated lime before entering the First Clinic. If he is right, what should happen?", options: [{ t: "Deaths in the First Clinic fall to around the midwives' level within weeks", ok: true, why: "That is a risky prediction: if deaths had stayed high, the idea would have been badly damaged." }, { t: "Deaths fall in both clinics equally", bug: "omission", why: "The Second Clinic had no autopsy hands to clean; its deaths had no reason to change." }, { t: "Nothing: washing is too simple", bug: "authority", why: "Simplicity is not evidence either way. Let the counts decide." }] },
      { id: "f5", type: "scene", stage: "reveal", min: 2, src: ["wash", "reject"], terms: ["discrim", "falsif"], title: "The prediction that could have failed", body: "It didn't fail. First Clinic deaths: **18.3%** in April 1847, **2.2%** in June, **1.2%** in July. In 1848 the two clinics were level: **12.7 vs 13.3** per 1,000 births.\n\nThe lesson isn't 'wash your hands'. It is the method: find [[discrim|discriminating evidence]], then make a prediction that could have come out wrong, and look. That is [[falsif|falsification]] in practice.", reps: [{ kind: "data", label: "Month by month, 1847", svg: "semmel47", body: "The drop came weeks after the change, and only in the clinic that changed." }, { kind: "story", label: "Right, and still rejected", body: "Many leading physicians rejected his conclusion. Germs were not yet understood, he published his full account only in **1861**, and he attacked his critics. He died in **1865**. Evidence alone did not win; a mechanism (germ theory) and better persuasion came later." }] },
      {
        id: "f5b", type: "contrast", stage: "contrast", min: 2.5, src: ["loudon", "mrc"], title: "Vienna 1846 and London 1948",
        left: { title: "Two clinics, alternate days", body: "Nobody designed it: women were admitted to the First or Second Clinic by the day they arrived. So the two groups of mothers were alike, and a threefold difference pointed at what differed: who examined them." },
        right: { title: "The streptomycin trial", body: "In 1948 Britain's Medical Research Council tested streptomycin for tuberculosis by allocating patients with **random numbers** in sealed envelopes: one of the first properly randomised trials." },
        q: { stem: "What gives both their power?", options: [{ t: "The groups were made alike by how people were assigned, not by who chose what, so a difference in outcome points at the one thing that differed", ok: true, why: "Alternate days and random numbers both break the link between the patient and the treatment." }, { t: "Both were done by famous scientists", bug: "authority", why: "Fame doesn't make groups comparable." }, { t: "Both used large numbers of patients", bug: "surface", why: "Size helps with chance; assignment is what removes the filter." }, { t: "Both were about infections", bug: "surface", why: "The topic is the surface; the method is the mechanism." }], after: "A natural experiment is luck that a trial makes on purpose." },
      },
      { id: "f6", type: "q", kind: "transfer", stage: "transfer", min: 2, stem: "A friend says a supplement cured his headaches: he took it and felt better within three days. Which single step would test it best?", options: [{ t: "Alternate weeks with and without it, ideally without knowing which pill is which, and count headache days", ok: true, why: "It compares him with himself and removes his expectations: the Vienna logic at home." }, { t: "Collect more stories from people who took it and got better", bug: "selection", why: "Filtered evidence (session 2): the people who didn't improve don't write reviews." }, { t: "Read the ingredient list", bug: "omission", why: "A mechanism can suggest a hypothesis; it can't test this one." }, { t: "He's sure, so it works", bug: "authority", why: "Certainty is not a measurement." }] },
      { id: "f7", type: "q", kind: "far", stage: "far", min: 2, stem: "Two theories: heavier objects fall faster, or (ignoring air) all objects fall at the same rate. Which experiment separates them best?", options: [{ t: "Drop a heavy and a light ball of the same size and shape together, and see which lands first", ok: true, why: "Same size and shape keeps air resistance similar; the theories predict different results. (The story that Galileo did this from the Tower of Pisa is doubted by historians; the logic is sound either way.)" }, { t: "Drop a feather and a stone", bug: "confound", why: "Air resistance differs hugely: a confound, not a test of weight." }, { t: "Ask physicists which theory they prefer", bug: "authority", why: "A poll isn't an experiment." }, { t: "Drop one heavy ball many times", bug: "omission", why: "Without a comparison, nothing is tested." }] },
      {
        id: "f8", type: "forge", stage: "forge", min: 3, title: "Test one of your own beliefs this week", body: "Pick a belief about yourself and design the test that could prove it wrong.",
        slots: [
          { key: "belief", label: "The belief", options: [{ t: "“Coffee after 6 pm doesn't affect my sleep”", grade: "good", note: "Testable in a week.", say: "coffee after 6 pm doesn't affect my sleep" }, { t: "“I learn better at night”", grade: "good", note: "Testable with a fair comparison.", say: "I learn better at night" }, { t: "“Music helps me focus”", grade: "good", note: "Testable with a fair comparison.", say: "music helps me focus" }] },
          { key: "compare", label: "Compared with", options: [{ t: "alternating days with and without it", grade: "good", note: "Like the alternating clinics.", say: "alternating days with and without it" }, { t: "how I remember feeling", grade: "bad", note: "Memory is a filter (session 2).", say: "how I remember feeling" }] },
          { key: "measure", label: "Measured by", options: [{ t: "a number written down the same way each day (sleep time, questions right)", grade: "good", note: "Counts, not impressions.", say: "a number written down the same way each day" }, { t: "whether it feels like it worked", grade: "bad", note: "Feelings follow expectations.", say: "whether it feels like it worked" }] },
          { key: "kill", label: "What would prove me wrong", options: [{ t: "no difference, or the opposite difference, after 2 weeks", grade: "good", note: "Decided in advance: that's what makes it a test.", say: "no difference, or the opposite, after two weeks" }, { t: "nothing: I'll know it when I see it", grade: "bad", note: "A test with no failure condition cannot fail.", say: "nothing decided in advance" }] },
        ],
        template: "Belief: **{belief}**. Compare: {compare}. Measure: {measure}. I'm wrong if: {kill}.",
        critique: { stem: "After a week the result goes against your belief. The Semmelweis lesson?", options: [{ t: "Believe the counts over the feeling, and change the habit (or run a better test), not the data", ok: true }, { t: "One week proves nothing, ignore it", bug: "confirm", why: "Then extend the test; dismissing only the results you dislike is confirmation hunting." }, { t: "Find people who agree with you", bug: "authority", why: "Agreement is not a measurement." }] },
      },
    ],
    challenge: { stem: "Two explanations for why a plant grows faster by the window: more light, or more warmth. Best single test?", options: [{ t: "Two plants with the same warmth, one lit and one shaded (and the reverse)", ok: true }, { t: "Watch the window plant more closely", bug: "confirm" }, { t: "Ask a gardener", bug: "authority" }] },
    hooks: [
      { id: "falsify.h1", gap: 1, q: { stem: "Why was 'bad city air' a weak explanation for Vienna's deaths?", options: [{ t: "It predicted equal deaths in two clinics sharing the same air; they differed threefold", ok: true }, { t: "Air can't carry disease", bug: "scale" }, { t: "The doctors disproved it with germs", bug: "omission" }] } },
      { id: "falsify.h2", gap: 7, q: { stem: "Evidence that fits every explanation equally is…", options: [{ t: "almost worthless for choosing between them", ok: true }, { t: "the strongest evidence", bug: "confirm" }, { t: "proof that all are true", bug: "inversion" }] } },
      { id: "falsify.h3", gap: 30, q: { stem: "What made Semmelweis's hand-washing a real test, not just an intervention?", options: [{ t: "It predicted a specific drop in one clinic that could have failed to happen", ok: true }, { t: "It was simple and cheap", bug: "surface" }, { t: "Senior doctors agreed with it", bug: "authority" }] } },
    ],
    deeper: [
      { title: "Discriminating power, formally", body: "Evidence E favours H1 over H2 by the likelihood ratio P(E | H1) / P(E | H2). 'Mothers died' has a ratio near 1 for every hypothesis; 'two clinics differ threefold under alternating admission' has a huge ratio against 'city air'. Good tests are chosen for large ratios." },
      { title: "Open question", body: "Why do correct findings with strong data still get rejected? Historians point to the missing mechanism, professional status and poor communication; how much each mattered in Semmelweis's case is debated." },
    ],
  });

  window.RENAISSANCE_SEASONS = [{ id: "s1", title: "Season 1 · Six mechanisms that run the world", sessions, visuals, models }];
})();
