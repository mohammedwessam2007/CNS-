/* RENAISSANCE · Season 3 · Possession (part 2: mathematics, science, art, music).
 *
 * One complete experience per organ, each built around something you can do with your hands or ears: Euler's proof
 * (a map reduced to four dots), van Helmont's willow and the fate of fat (follow the atoms), a star pattern grown from a
 * hidden grid (Hankin's method, drawn live), and the question-and-answer inside "Ode to Joy" (synthesised in the
 * browser; no recordings, no rights question). Same rules as part 1: provenance per claim, quotations registered,
 * invented cases labelled, teaching numbers labelled.
 */
(function () {
  "use strict";
  const C = { lime: "#d9ff43", cyan: "#66e9ff", pink: "#ff6e8a", green: "#5ef0a0", amber: "#ffd166", violet: "#b39cff", mut: "#8fa6c0", line: "#2f4a68", bg: "#0f1d2e", ink: "#e8eef6", water: "#123a5a", land: "#18263a" };
  const svg = (w, h, inner, label) => '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "") + '" class="rnSvg">' + inner + "</svg>";
  const t = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" fill="' + ((o && o.c) || C.ink) + '" font-size="' + ((o && o.fs) || 12) + '" font-weight="' + ((o && o.fw) || 700) + '" text-anchor="' + ((o && o.a) || "middle") + '" font-family="Inter,system-ui,sans-serif">' + s + "</text>";
  const box = (x, y, w, h, c, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + (fill || C.bg) + '" stroke="' + c + '" stroke-width="1.6"/>';
  const rect = (x, y, w, h, fill, rx) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + fill + '"/>';
  const wrap = (str, n) => {
    const out = [];
    let cur = "";
    for (const w of String(str).split(" ")) (cur + " " + w).trim().length > n && cur ? (out.push(cur), (cur = w)) : (cur = (cur + " " + w).trim());
    if (cur) out.push(cur);
    return out;
  };
  const lines = (x, y, arr, o, dy) => arr.map((l, i) => t(x, y + i * (dy || 16), l, o)).join("");

  /* ═══════════════ Königsberg ═══════════════ */
  // four land areas and the bridges between them; bridge 8 is a hypothetical new one
  const BR = [
    { id: "b1", a: "A", b: "C", x: 105, y1: 70, y2: 95, label: "1" },
    { id: "b2", a: "A", b: "C", x: 165, y1: 70, y2: 95, label: "2" },
    { id: "b3", a: "A", b: "B", x: 105, y1: 135, y2: 160, label: "3" },
    { id: "b4", a: "A", b: "B", x: 165, y1: 135, y2: 160, label: "4" },
    { id: "b5", a: "A", b: "D", h: true, y: 115, x1: 190, x2: 250, label: "5" },
    { id: "b6", a: "C", b: "D", x: 300, y1: 70, y2: 90, label: "6" },
    { id: "b7", a: "B", b: "D", x: 300, y1: 140, y2: 160, label: "7" },
    { id: "b8", a: "B", b: "C", x: 36, y1: 70, y2: 160, label: "8" },
  ];
  function degrees(v) {
    const d = { A: 0, B: 0, C: 0, D: 0 };
    for (const b of BR) if (v[b.id]) (d[b.a]++, d[b.b]++);
    return d;
  }
  function verdict(d) {
    const odd = Object.entries(d).filter(([, n]) => n % 2).map(([k]) => k);
    return { odd, kind: odd.length === 0 ? "circuit" : odd.length === 2 ? "path" : "none" };
  }
  function konigDraw(v) {
    let s = rect(0, 0, 360, 250, C.land) + rect(0, 70, 360, 90, C.water) + rect(80, 95, 110, 40, C.land, 14) + rect(250, 90, 110, 50, C.land, 10);
    for (const b of BR) {
      if (!v[b.id]) continue;
      s += b.h ? rect(b.x1, b.y - 5, b.x2 - b.x1, 10, C.amber, 3) + t((b.x1 + b.x2) / 2, b.y - 9, b.label, { c: C.amber, fs: 12 }) : rect(b.x - 5, b.y1, 10, b.y2 - b.y1, C.amber, 3) + t(b.x + (b.id === "b8" ? 16 : 14), (b.y1 + b.y2) / 2 + 4, b.label, { c: C.amber, fs: 12 });
    }
    const d = degrees(v);
    s += t(180, 30, "North bank (C) · " + d.C + " bridges", { fs: 12 }) + t(180, 200, "South bank (B) · " + d.B + " bridges", { fs: 12 }) + t(135, 112, "Island (A)", { fs: 12 }) + t(135, 128, d.A + " bridges", { fs: 12, c: C.cyan }) + t(305, 112, "East (D)", { fs: 12 }) + t(305, 128, d.D + " bridges", { fs: 12, c: C.cyan });
    const vd = verdict(d);
    s += t(180, 236, vd.kind === "none" ? vd.odd.length + " odd areas: no such walk" : vd.kind === "path" ? "2 odd areas: a walk, odd to odd" : "0 odd areas: a walk that returns home", { fs: 12, c: vd.kind === "none" ? C.pink : C.lime });
    return svg(360, 250, s, "Königsberg: four land areas joined by bridges, with the number of bridges at each");
  }

  /* ═══════════════ Hankin's polygons in contact ═══════════════ */
  function tiling(kind) {
    const P = [];
    const reg = (cx, cy, n, R, a0) => P.push([...Array(n).keys()].map((k) => [cx + R * Math.cos(a0 + (2 * Math.PI * k) / n), cy + R * Math.sin(a0 + (2 * Math.PI * k) / n)]));
    if (kind === 0) {
      const s = 60;
      for (let i = -1; i < 8; i++) for (let j = -1; j < 7; j++) P.push([[i * s, j * s], [(i + 1) * s, j * s], [(i + 1) * s, (j + 1) * s], [i * s, (j + 1) * s]]);
    } else if (kind === 1) {
      const s = 30,
        a = s * (1 + Math.SQRT2),
        R = s / (2 * Math.sin(Math.PI / 8)),
        h = s / Math.SQRT2;
      for (let i = -1; i < 7; i++)
        for (let j = -1; j < 6; j++) {
          reg(i * a, j * a, 8, R, Math.PI / 8);
          const cx = (i + 0.5) * a,
            cy = (j + 0.5) * a;
          P.push([[cx + h, cy], [cx, cy + h], [cx - h, cy], [cx, cy - h]]);
        }
    } else {
      const s = 36,
        w = Math.sqrt(3) * s;
      for (let j = -1; j < 8; j++) for (let i = -1; i < 8; i++) reg(i * w + (j % 2 ? w / 2 : 0), j * 1.5 * s, 6, s, Math.PI / 6);
    }
    return P;
  }
  function hankin(kind, theta) {
    const th = (theta * Math.PI) / 180,
      segs = [];
    const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
    for (const poly of tiling(kind)) {
      const n = poly.length,
        O = [poly.reduce((a, p) => a + p[0], 0) / n, poly.reduce((a, p) => a + p[1], 0) / n];
      for (let k = 0; k < n; k++) {
        const Vp = poly[(k - 1 + n) % n],
          V = poly[k],
          Vn = poly[(k + 1) % n];
        const M1 = [(Vp[0] + V[0]) / 2, (Vp[1] + V[1]) / 2],
          M2 = [(V[0] + Vn[0]) / 2, (V[1] + Vn[1]) / 2];
        const L = Math.hypot(V[0] - M1[0], V[1] - M1[1]),
          u = [(V[0] - M1[0]) / L, (V[1] - M1[1]) / L];
        let nrm = [-u[1], u[0]];
        if ((O[0] - M1[0]) * nrm[0] + (O[1] - M1[1]) * nrm[1] < 0) nrm = [u[1], -u[0]];
        const dir = [Math.cos(th) * u[0] + Math.sin(th) * nrm[0], Math.cos(th) * u[1] + Math.sin(th) * nrm[1]];
        const w = [V[0] - O[0], V[1] - O[1]];
        const den = cross(dir, w);
        if (Math.abs(den) < 1e-9) continue;
        const tt = cross([O[0] - M1[0], O[1] - M1[1]], w) / den;
        if (tt <= 0) continue;
        const Pt = [M1[0] + tt * dir[0], M1[1] + tt * dir[1]];
        segs.push([M1, Pt], [Pt, M2]);
      }
    }
    return segs;
  }
  const PATTERN_NAMES = ["squares", "octagons and squares", "hexagons"];
  function patternDraw(v) {
    const kind = Math.round(v.tile),
      grid = tiling(kind),
      segs = hankin(kind, v.theta);
    let s = '<defs><clipPath id="rnClipPat"><rect x="0" y="0" width="360" height="280" rx="10"/></clipPath></defs><g clip-path="url(#rnClipPat)">' + rect(0, 0, 360, 280, "#0b1320");
    if (v.grid) s += grid.map((p) => '<polygon points="' + p.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ") + '" fill="none" stroke="' + C.line + '" stroke-width="1" stroke-dasharray="3 3"/>').join("");
    s += '<path d="' + segs.map(([a, b]) => "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1)).join("") + '" stroke="' + C.amber + '" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>';
    s += t(180, 300, PATTERN_NAMES[kind] + " · angle " + v.theta + "°", { c: C.mut, fs: 12 });
    return svg(360, 310, s, "A geometric pattern grown from a hidden grid of polygons");
  }

  /* ═══════════════ music ═══════════════ */
  const ODE1 = [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62],
    ODE2 = [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 62, 60, 60],
    DUR = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2];
  const melody = (ns, bpm) => {
    let at = 0;
    return { bpm: bpm || 104, notes: ns.map((n, i) => ((at += i ? DUR[i - 1] : 0), { t: at, d: DUR[i] * 0.92, n })) };
  };
  const CH = { I: [48, 60, 64, 67], IV: [53, 60, 65, 69], V: [43, 59, 62, 67], vi: [45, 60, 64, 69] };
  const PROG = [
    { name: "home", seq: ["I", "IV", "V", "I"], say: "ends at home: the V chord's pull (B wants C) is satisfied", c: C.green },
    { name: "surprise", seq: ["I", "IV", "V", "vi"], say: "a deceptive ending: B still goes up to C, but the bass steps to A instead of home", c: C.pink },
    { name: "open", seq: ["I", "IV", "I", "V"], say: "a half close: it stops on the chord that most wants to move, like a comma", c: C.amber },
    { name: "amen", seq: ["I", "V", "IV", "I"], say: "the “amen” ending: IV to I, softer than V to I, heard at the end of many hymns", c: C.green },
  ];
  const chords = (names, bpm) => ({ bpm: bpm || 76, notes: names.map((c, i) => ({ t: i * 1.2, d: i === names.length - 1 ? 2.4 : 1.1, n: CH[c] })) });
  const pitchY = (m) => 232 - (m - 40) * 5.4;
  function cadenceDraw(v) {
    const pr = PROG[Math.round(v.end)];
    let s = t(180, 18, "the last chord: " + pr.name, { fs: 13, c: pr.c });
    pr.seq.forEach((c, i) => {
      const x = 60 + i * 80,
        last = i === 3;
      s += rect(x - 24, 30, 48, 206, last ? "#1a2233" : "#0e1624", 8);
      for (const m of CH[c]) s += '<circle cx="' + x + '" cy="' + pitchY(m).toFixed(1) + '" r="7" fill="' + (last ? pr.c : C.cyan) + '"/>';
      s += t(x, 256, c, { fs: 14, c: last ? pr.c : C.ink });
    });
    if (v.notes) {
      s += t(8, pitchY(59) + 4, "B", { fs: 12, a: "start", c: C.mut }) + t(8, pitchY(60) - 6, "C", { fs: 12, a: "start", c: C.mut });
    }
    return svg(360, 268, s, "Four chords; the last one decides whether the phrase ends at home");
  }

  /* ═══════════════ VISUALS ═══════════════ */
  const visuals = {
    konig: () => konigDraw({ b1: 1, b2: 1, b3: 1, b4: 1, b5: 1, b6: 1, b7: 1 }),
    // the same city as four dots and seven lines, with the count at each dot
    graph4: () => {
      const P = { C: [180, 34], A: [100, 130], D: [270, 130], B: [180, 226] };
      const curve = (a, b, bend, c) => {
        const [x1, y1] = P[a],
          [x2, y2] = P[b],
          mx = (x1 + x2) / 2,
          my = (y1 + y2) / 2,
          dx = x2 - x1,
          dy = y2 - y1,
          L = Math.hypot(dx, dy);
        return '<path d="M' + x1 + " " + y1 + " Q" + (mx - (dy / L) * bend).toFixed(1) + " " + (my + (dx / L) * bend).toFixed(1) + " " + x2 + " " + y2 + '" stroke="' + (c || C.amber) + '" stroke-width="2.6" fill="none"/>';
      };
      let s = curve("A", "C", 22) + curve("A", "C", -22) + curve("A", "B", 22) + curve("A", "B", -22) + curve("A", "D", 0) + curve("C", "D", 0) + curve("B", "D", 0);
      for (const [k, [x, y]] of Object.entries(P)) s += '<circle cx="' + x + '" cy="' + y + '" r="15" fill="' + C.bg + '" stroke="' + C.cyan + '" stroke-width="2"/>' + t(x, y + 5, k, { fs: 13 });
      s += t(62, 136, "5", { fs: 14, c: C.pink }) + t(306, 136, "3", { fs: 14, c: C.pink }) + t(212, 30, "3", { fs: 14, c: C.pink }) + t(212, 232, "3", { fs: 14, c: C.pink });
      s += t(180, 256, "four odd numbers: no walk uses each line once", { fs: 12, c: C.lime });
      return svg(360, 266, s, "Königsberg as a graph: four dots, seven lines, all four dots odd");
    },
    // the willow's mass balance
    willow: () => {
      let s = t(180, 18, "Five years, a pot of soil, only water added", { fs: 12, c: C.mut });
      const bar = (x, h, c, a, b) => rect(x, 200 - h, 60, h, c, 4) + t(x + 30, 214, a, { fs: 12 }) + t(x + 30, 230, b, { fs: 12, c: C.mut });
      s += bar(20, 6, C.green, "willow", "5 lb") + bar(110, 168, C.green, "willow", "169 lb") + bar(200, 150, "#6b4e2e", "soil", "200 lb") + bar(290, 150, "#6b4e2e", "soil", "−2 oz");
      s += t(65, 46, "before", { fs: 12, c: C.cyan }) + t(245, 46, "the soil, before → after", { fs: 12, c: C.cyan });
      s += t(180, 252, "164 lb of wood from where?", { fs: 13, c: C.lime });
      return svg(360, 262, s, "Van Helmont's willow gained 164 pounds while the soil lost two ounces");
    },
    // ode to joy: the same line ends twice, once on D (a question), once on C (the answer)
    phrases: () => {
      const NAMES = { 60: "C", 62: "D", 64: "E", 65: "F", 67: "G" };
      const row = (ns, y0, lab, c) => {
        let s = t(8, y0 - 46, lab, { fs: 12, a: "start", c });
        ns.forEach((m, i) => {
          const x = 22 + i * 22,
            y = y0 - (m - 60) * 5,
            last = i === ns.length - 1;
          s += '<circle cx="' + x + '" cy="' + y + '" r="' + (last ? 7 : 5) + '" fill="' + (last ? c : C.cyan) + '"/>' + t(x, y0 + 22, NAMES[m], { fs: 12, c: last ? c : C.mut });
        });
        return s;
      };
      return svg(360, 250, row(ODE1, 96, "Phrase 1 ends on D: a question", C.amber) + row(ODE2, 210, "Phrase 2 ends on C, home: the answer", C.green), "The first two phrases of Ode to Joy: one ends on D, one on C");
    },
  };

  /* ═══════════════ MODELS ═══════════════ */
  const models = {
    bridges: {
      toggles: BR.map((b) => ({ id: b.id, label: b.id === "b8" ? "A new bridge 8 (south–north, west end)" : "Bridge " + b.label + " (" + b.a + "–" + b.b + ")", value: b.id !== "b8" })),
      draw: (v) => konigDraw(v),
      read(v) {
        const d = degrees(v),
          vd = verdict(d),
          n = BR.filter((b) => v[b.id]).length;
        return (
          n + " bridges. Bridges at each area: A " + d.A + ", B " + d.B + ", C " + d.C + ", D " + d.D + ". " +
          (vd.kind === "none" ? "**" + vd.odd.length + " areas are odd, so no walk crosses every bridge exactly once.** Every area you pass through uses bridges in pairs (in, out); only a start and an end can be odd." : vd.kind === "path" ? "**Exactly two areas are odd (" + vd.odd.join(" and ") + "): a walk exists, but it must start at one of them and end at the other.**" : "**No area is odd: a walk exists that crosses every bridge once and comes back to where it started.**") +
          " (If some area has no bridges at all, it simply isn't part of the walk; the count applies to the connected rest.)"
        );
      },
    },
    atoms: {
      controls: [{ id: "kg", label: "Fat lost", min: 1, max: 20, step: 1, value: 10, unit: " kg" }],
      toggles: [{ id: "own", label: "Only the fat's own atoms", value: false }],
      draw(v) {
        const k = v.kg,
          o2 = 2.898 * k,
          co2 = 2.81 * k,
          h2o = 1.088 * k,
          viaCo2 = 0.84 * k,
          viaH2o = 0.16 * k;
        const sc = 150 / (2.898 * 20);
        let s = t(180, 16, "C₅₅H₁₀₄O₆ + 78 O₂ → 55 CO₂ + 52 H₂O", { fs: 12, c: C.mut });
        const bar = (x, val, c, a, b) => rect(x, 200 - val * sc, 64, Math.max(2, val * sc), c, 4) + t(x + 32, 190 - val * sc, val.toFixed(1) + " kg", { fs: 12, c }) + t(x + 32, 216, a, { fs: 12 }) + t(x + 32, 232, b, { fs: 12, c: C.mut });
        if (!v.own) s += bar(12, k, C.amber, "fat", "burned") + bar(100, o2, C.cyan, "oxygen", "breathed in") + bar(188, co2, C.pink, "CO₂", "breathed out") + bar(276, h2o, C.green, "water", "urine, sweat");
        else s += bar(60, viaCo2, C.pink, "leaves as", "CO₂ (lungs)") + bar(236, viaH2o, C.green, "leaves as", "water");
        s += t(180, 254, v.own ? "of " + k + " kg of fat: " + viaCo2.toFixed(1) + " kg out through the lungs" : "the lungs carry out most of the mass", { fs: 12, c: C.lime });
        return svg(360, 264, s, "Where the mass of lost fat goes: mostly out through the lungs as carbon dioxide");
      },
      read(v) {
        const k = v.kg;
        return "To burn **" + k + " kg** of fat the body takes in about **" + (2.9 * k).toFixed(0) + " kg of oxygen** and gives off about **" + (2.8 * k).toFixed(0) + " kg of CO₂** and **" + (1.1 * k).toFixed(0) + " kg of water**. Of the fat's own atoms, about " + Math.round(84) + "% leave as CO₂ through the lungs and 16% as water. Energy is released, but energy has (for any practical purpose) no mass: it cannot be where the kilograms went. *Figures from Meerman and Brown (2014), for a typical human triglyceride.*";
      },
    },
    hankin: {
      controls: [
        { id: "tile", label: "Hidden grid", min: 0, max: 2, step: 1, value: 1, fmt: (x) => PATTERN_NAMES[x] },
        { id: "theta", label: "Angle at which lines leave each edge", min: 30, max: 80, step: 2.5, value: 67.5, unit: "°" },
      ],
      toggles: [{ id: "grid", label: "Show the hidden grid", value: true }],
      draw: (v) => patternDraw(v),
      read(v) {
        const k = Math.round(v.tile),
          th = v.theta;
        const shape = k === 1 ? (th >= 60 && th <= 72.5 ? "eight-pointed stars in the octagons and four-pointed stars in the squares: the classic pattern" : th > 72.5 ? "very sharp, thin stars; the lines nearly meet at the centres" : "blunt stars that sit close to the grid's corners") : k === 0 ? (Math.abs(th - 45) < 3 ? "a lattice of tilted squares" : th > 45 ? "four-pointed stars with crossing bands" : "small crosses near the corners") : Math.abs(th - 60) < 3 ? "six-pointed stars packed edge to edge" : th > 60 ? "sharp six-pointed stars with hexagons between them" : "small triangles near the corners";
        return "**" + PATTERN_NAMES[k] + ", " + th + "°:** " + shape + ". Every line starts at the middle of an edge and meets the line from the next edge on the way to the shared corner, so lines always continue into the neighbouring tile. One grid, one angle: the whole wall follows. *Method: E. H. Hankin (1925), \"polygons in contact\"; drawn live here.*";
      },
    },
    cadence: {
      controls: [{ id: "end", label: "How the phrase ends", min: 0, max: 3, step: 1, value: 0, fmt: (x) => ["V → I (home)", "V → vi (surprise)", "stop on V (open)", "IV → I (amen)"][x] }],
      toggles: [{ id: "notes", label: "Label the leading note", value: false }],
      draw: (v) => cadenceDraw(v),
      read(v) {
        const pr = PROG[Math.round(v.end)];
        return "Chords " + pr.seq.join(" → ") + ": " + pr.say + ". Press PLAY to hear it. *Written description: in the V chord the note B sits a half-step below C; ears trained on this music expect it to rise to C and the bass to fall home.*";
      },
      sound: (v) => chords(PROG[Math.round(v.end)].seq),
    },
  };

  /* ═══════════════ QUOTATIONS ═══════════════ */
  const quotes = {
    euler: { text: "This question is so banal, but seemed to me worthy of attention in that neither geometry, nor algebra, nor even the art of counting was sufficient to solve it.", speaker: "Leonhard Euler, in a letter to the Italian mathematician Giovanni Marinoni", author: "Leonhard Euler", work: "letter to Marinoni", where: "13 March 1736", translator: "English translation in Sachs, Stiebitz & Wilson (1988)", rights: "short quotation with citation", context: "Euler had been sent the bridge puzzle from Königsberg. He saw that measuring and calculating were useless; only the pattern of connections mattered.", meaning: "A new kind of mathematics was needed: one about position and connection, not size.", matters: "It is the birth certificate of graph theory, in Euler's own words.", misattribution: "Often said to be from a letter to Ehler, the Danzig mayor who sent the problem; this sentence is from the letter to Marinoni.", verified: "Exact-phrase web search found it quoted from the 1988 historical note on Euler's Königsberg letters." },
    helmont: { text: "164 pounds of wood, barks, and roots arose out of water only.", speaker: "Jan Baptist van Helmont", author: "Jan Baptist van Helmont", work: "Ortus medicinae (published 1648); English translation 1662", where: "the willow experiment", year: "1648", rights: "public domain", context: "His conclusion after five years of weighing a willow and its soil.", meaning: "Water alone, he thought, had become wood.", matters: "The measurements were brilliant and the conclusion half right: he could not weigh the air.", misattribution: "Spelling varies between printings (the 1662 English has older spellings); this is the modernised wording widely quoted.", verified: "Exact-phrase web search found this wording in several accounts of the experiment." },
  };

  const sessions = [];

  /* ─── 17 · Seven bridges ─── */
  sessions.push({
    id: "euler", primitive: "graph", domain: "mathematics", region: "Prussia (now Kaliningrad, Russia)", works: ["konigsberg"],
    atoms: ["abstr", "minimal", "falsify", "represent"],
    title: "Seven bridges",
    hook: "Could the people of Königsberg take a Sunday walk crossing each of their seven bridges exactly once? In 1736 Euler answered without walking anywhere.",
    minutes: 26,
    why: "Mathematics as it should first be met: a real puzzle, a picture you can hold in one hand, and a proof you can carry for life. Throwing away everything except the connections is the move that turns a city into four dots, and the same move sits under DNA sequencing and every delivery route.",
    capability: "Strip a map to its connections, count the lines at each point, and prove whether a route exists without trying any routes.",
    stakes: "Without a model, people try route after route and never know whether to stop. A proof tells you, once and for all, that no attempt can succeed, and why.",
    bridge: "The missing step: every time your walk passes through a piece of land, it uses two bridges, one in and one out. So any land you pass through must have an even number of bridges. Only where you start and where you finish can be odd.",
    connection: "Season 2's three boxes found the minimum sufficient model of a clinic. Euler's four dots are the most famous minimum model ever drawn.",
    vocab: {
      graph: { name: "graph", h: "Dots joined by lines. Only which dots connect matters, not where they are or how long the lines are.", s: "نقط ووصلات بس: مش مهم الشكل ولا المسافة، المهم مين متوصل بمين.", t: "A set of vertices and edges; a multigraph allows several edges between the same pair (Königsberg needs it)." },
      degree: { name: "degree", h: "How many lines meet at a dot.", s: "عدد الخطوط اللي بتدخل على النقطة.", t: "The number of edge-ends at a vertex; in any graph the degrees add up to twice the number of edges." },
      euler: { name: "Euler path", h: "A route that uses every line exactly once.", s: "مشوار بيعدّي على كل كوبري مرة واحدة بالظبط.", t: "An Eulerian trail; it exists in a connected graph iff 0 or 2 vertices have odd degree (0: it can return to its start, an Eulerian circuit)." },
      parity: { name: "odd and even", h: "Whether a count splits into pairs with none left over.", s: "زوجي ولا فردي: يتقسم أزواج ولا يفضل واحد.", t: "Parity; many impossibility proofs are parity arguments." },
    },
    provenance: [
      { id: "euler1736", claim: "Euler solved the Königsberg problem in a paper presented in 1735/1736 ('Solutio problematis ad geometriam situs pertinentis'), printed in the St Petersburg Academy's Commentarii for 1736 (published 1741).", source: "Euler L., Commentarii academiae scientiarum Petropolitanae 8:128", year: "1736", kind: "primary", license: "public domain", grade: "A" },
      { id: "kolam", claim: "Sikku kolam, drawn in Tamil Nadu, loop one or more continuous lines around a grid of dots; Siromoney, Siromoney and Krithivasan (1974) described kolam patterns with array grammars.", source: "Siromoney G., Siromoney R. & Krithivasan K., 'Array grammars and kolam', Computer Graphics and Image Processing 3:63–82; descriptions of sikku kolam (C. Jumel; Sahapedia); checked by web search", year: "1974", kind: "scholarship", license: "fact", grade: "B" },
      { id: "q.euler", claim: "“This question is so banal, but seemed to me worthy of attention in that neither geometry, nor algebra, nor even the art of counting was sufficient to solve it.” (Euler to Marinoni, 1736)", source: "Sachs H., Stiebitz M. & Wilson R. J., 'An historical note: Euler's Königsberg letters', Journal of Graph Theory 12:133", year: "1988", kind: "scholarship", license: "short quotation", grade: "A" },
      { id: "city", claim: "Königsberg had four land areas (two river banks, the Kneiphof island and an eastern area) joined by seven bridges: five to the island and one each from the eastern area to the two banks.", source: "Euler 1736; standard accounts", year: "1736", kind: "scholarship", license: "fact", grade: "A" },
      { id: "today", claim: "Wartime bombing and rebuilding changed the bridges; in today's Kaliningrad two areas have an odd number of crossings, so a walk crossing each once is possible, from one to the other.", source: "Standard accounts of the Seven Bridges today (checked by web search)", year: "2020s", kind: "scholarship", license: "fact", grade: "B" },
      { id: "hierholzer", claim: "Euler proved the condition is necessary; that it is also sufficient was proved by Carl Hierholzer, published posthumously in 1873.", source: "Hierholzer C., Mathematische Annalen 6:30", year: "1873", kind: "scholarship", license: "fact", grade: "A" },
      { id: "pevzner", claim: "Pevzner, Tang and Waterman recast DNA fragment assembly as an Eulerian path problem, which handles repeats that defeated the older overlap approach.", source: "Pevzner P.A., Tang H. & Waterman M.S., PNAS 98:9748", year: "2001", kind: "scholarship", license: "fact", grade: "A" },
      { id: "tsp", claim: "Finding a route that visits every point once (a Hamiltonian path) is NP-complete: no fast general method is known, unlike Euler's test for using every line once.", source: "Karp R., 'Reducibility among combinatorial problems' (1972); standard complexity theory", year: "1972", kind: "scholarship", license: "fact", grade: "A" },
      { id: "nikolaus", claim: "The 'house of Nikolaus' is a children's puzzle: draw a house shape of 5 points and 8 lines without lifting the pen; it works only from one of the two bottom corners.", source: "Traditional puzzle; parity checked directly", year: "—", kind: "original", license: "fact", grade: "A" },
      { id: "museum", claim: "The museum and delivery examples are invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "e1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["city"], atoms: ["abstr"], stem: "Four land areas, seven bridges. Is there a walk that crosses every bridge exactly once?", svg: "konig", alt: "Look at one land area in the middle of a walk. How many of its bridges does one visit use?", options: [
        { t: "No, and it can be proved without trying a single route", ok: true, why: "The next steps show the proof. It needs nothing but counting." },
        { t: "Yes, if you start on the island in the middle", bug: "surface", why: "The starting point matters, but no start works here." },
        { t: "No one can know without trying every possible route", bug: "omission", why: "That is what Euler showed to be unnecessary: counting settles it." },
        { t: "Yes: residents did it every Sunday afternoon, as the old legend says", bug: "authority", why: "The legend is that they tried and never could." },
      ] },
      { id: "e2", type: "scene", stage: "reveal", min: 3, src: ["euler1736", "q.euler", "hierholzer", "kolam"], terms: ["graph", "degree", "euler"], title: "Throw the map away", body: "Euler kept only what mattered: each land area became a dot, each bridge a line. Distances, shapes and streets vanished. What is left is a [[graph|graph]].\n\nNow count the lines at each dot, its [[degree|degree]]: the island has 5, the others 3, 3 and 3. A walk that passes through a dot uses two of its lines each time. So a walk using every line once ([[euler|an Euler path]]) can have odd dots only at its two ends. Königsberg has four odd dots. **No such walk exists.**", reps: [{ kind: "diagram", label: "Four dots, seven lines", svg: "graph4", body: "The whole city, as Euler saw it." }, { kind: "story", label: "In Euler's words", body: "He wrote to the mathematician Giovanni Marinoni in 1736: “This question is so banal, but seemed to me worthy of attention in that neither geometry, nor algebra, nor even the art of counting was sufficient to solve it.” He had seen that it belonged to a new mathematics of position." }, { kind: "story", label: "A line around the dots", body: "In Tamil Nadu, in southern India, a kolam is drawn in rice flour at the threshold of a house each morning. In a sikku kolam the line loops around a grid of dots, often as one continuous line that closes on itself: Euler's question, asked by the hand. In 1974 the mathematicians Gift and Rani Siromoney and Kamala Krithivasan described kolam patterns with formal array grammars." }, { kind: "counterexample", label: "What Euler did not prove", body: "Euler proved that odd dots rule a walk out. That two or zero odd dots always allow one was proved only in 1873, by Carl Hierholzer, after his death." }] },
      { id: "e3", type: "q", kind: "predict", stage: "predict", min: 1.5, terms: ["parity"], atoms: ["falsify", "abstr"], stem: "Why must every land area you pass through have an even number of bridges?", options: [
        { t: "Each time you pass through, you use one bridge in and one out", ok: true, why: "Visits use bridges in pairs; only the start (one out) and the end (one in) can leave an odd one over." },
        { t: "Because bridges were built in pairs for the two directions of traffic", bug: "surface", why: "Königsberg's bridges were single; the pairs are in the walk, not the stone." },
        { t: "Because the river has two banks", bug: "surface", why: "The number of banks does not appear anywhere in the argument." },
        { t: "It needn't: odd numbers are fine anywhere on the walk", bug: "omission", why: "An odd area in the middle would leave you stuck on it or leave a bridge unused." },
      ] },
      { id: "e4", type: "model", stage: "model", min: 3.5, model: "bridges", src: ["today"], title: "Remove and add bridges", body: "Switch bridges off and on. The counts at each area and the verdict update.", ask: "**Find** the smallest change that makes a walk possible, and a change that makes a walk possible that returns to its start. Then try the new bridge 8." },
      {
        id: "e5", type: "contrast", stage: "contrast", min: 2.5, src: ["nikolaus", "museum"], atoms: ["analogy", "abstr"], title: "A child's puzzle and a museum",
        left: { title: "The house of Nikolaus", body: "A house shape: a square with both diagonals and a roof: 5 points, 8 lines. Children try to draw it without lifting the pen." },
        right: { title: "A museum patrol", body: "A guard must walk every corridor once each night and end at the door where he started." },
        q: { stem: "What single check answers both?", options: [
          { t: "Count the lines meeting at each point and look for the odd ones", ok: true, why: "The house has two odd corners (the bottom two), so it works only if you start at one of them. The patrol needs zero odd junctions to end where it began." },
          { t: "Draw every possible route one by one and see whether any of them works", bug: "omission", why: "Possible for the house, hopeless for a big museum, and unnecessary for both." },
          { t: "Measure the lengths of the lines", bug: "surface", why: "Length never enters the argument." },
          { t: "Check whether the shape is symmetrical", bug: "surface", why: "The house is symmetrical and still has only two starting corners." },
        ] },
      },
      { id: "e6", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["today"], atoms: ["abstr", "predict"], stem: "In today's Kaliningrad, after wartime bombing and rebuilding, the four areas have 2, 2, 3 and 3 crossings. What is possible now?", options: [
        { t: "A walk over each crossing once, from one '3' area to the other", ok: true, why: "Exactly two odd areas: the walk exists, starting at one and ending at the other. It cannot return home." },
        { t: "A walk over each crossing once that returns to its start", bug: "omission", why: "That needs zero odd areas; there are two." },
        { t: "Still nothing, exactly as in Euler's day", bug: "consistency", why: "The counts changed; the verdict follows the counts." },
        { t: "Any route at all, since fewer bridges make every possible walk easier", bug: "surface", why: "Fewer bridges help only because they changed which areas are odd." },
      ] },
      { id: "e7", type: "q", kind: "far", stage: "far", min: 2, src: ["tsp", "pevzner", "museum"], atoms: ["minimal", "represent"], stem: "A delivery van must stop once at each of 200 addresses. A snowplough must clear each of 200 streets once. For which job does Euler's counting give a fast, sure answer?", options: [
        { t: "The snowplough: it must use every street, like every bridge", ok: true, why: "Streets are lines: Euler's count settles it instantly. The van's problem (every point once) has no known fast method for large cases. The same Euler trick assembles genomes: Pevzner and colleagues (2001) turned DNA fragments into lines to be used once each." },
        { t: "The van: it must reach every single address, like every land area", bug: "surface", why: "Visiting every point once is a different and much harder problem." },
        { t: "Both equally, since both are routes through a city", bug: "surface", why: "They look alike on a map; mathematically they are worlds apart." },
        { t: "Neither: both need a computer to try every route", bug: "omission", why: "The snowplough's question is settled by counting, with no search at all." },
      ] },
      {
        id: "e8", type: "forge", stage: "forge", min: 3, title: "A proof you can carry", body: "Build the argument in four parts, so you could give it at a dinner table in thirty seconds.",
        slots: [
          { key: "claim", label: "Claim", options: [{ t: "no walk crosses each bridge exactly once", grade: "good", note: "State exactly what is impossible.", say: "no walk crosses each bridge exactly once" }, { t: "the walk is very hard to find", grade: "bad", note: "Hard is not impossible; the proof shows impossible.", say: "the walk is very hard to find" }] },
          { key: "key", label: "Key observation", options: [{ t: "passing through an area uses its bridges two at a time", grade: "good", note: "The whole proof rests on this.", say: "passing through an area uses its bridges two at a time" }, { t: "the island is in the middle", grade: "bad", note: "Position plays no part.", say: "the island is in the middle" }] },
          { key: "count", label: "Count", options: [{ t: "5, 3, 3, 3: four odd areas", grade: "good", note: "The data the argument needs, nothing more.", say: "5, 3, 3, 3: four odd areas" }, { t: "seven bridges in all", grade: "weak", note: "True, but the total alone decides nothing.", say: "seven bridges" }] },
          { key: "end", label: "Conclusion", options: [{ t: "only two areas can be odd, so it is impossible", grade: "good", note: "Start and finish: at most two odd areas.", say: "a walk allows at most two odd areas, so it is impossible" }, { t: "nobody has found one yet", grade: "bad", note: "That is evidence, not proof.", say: "nobody has found one" }] },
        ],
        template: "Claim: **{claim}**. Because {key}. Königsberg: {count}. So {end}.",
        critique: { stem: "A friend says he found a walk on a map that works. What do you do?", options: [{ t: "Retrace it with him: a bridge will be crossed twice or missed", ok: true, why: "The proof covers every possible walk, so his must contain an error, and finding it is quick." }, { t: "Accept it: proofs can be wrong, and he has an actual walk to show", bug: "authority", why: "This one is a few lines long and checkable; the walk is the thing to check." }, { t: "Tell him he is wrong without looking", bug: "rigid", why: "You are right, but showing him where is the point." }] },
      },
    ],
    challenge: { stem: "A drawing has points with 2, 4, 3, 3 and 2 lines. Can it be drawn without lifting the pen, each line once?", options: [{ t: "Yes, starting at one of the points with 3 lines", ok: true }, { t: "Yes, starting anywhere", bug: "omission" }, { t: "No, because some of the points have an odd number of lines", bug: "rigid" }] },
    hooks: [
      { id: "euler.h1", gap: 1, q: { stem: "A walk using every line of a connected drawing exactly once needs how many odd points?", options: [{ t: "Zero or two", ok: true }, { t: "Exactly one", bug: "omission" }, { t: "An even number, any even number", bug: "gain" }] } },
      { id: "euler.h2", gap: 7, q: { stem: "Königsberg's four areas had 5, 3, 3 and 3 bridges. So…", options: [{ t: "no walk could cross each bridge once", ok: true }, { t: "a walk existed only from the island", bug: "surface" }, { t: "the answer depended on the bridges' lengths", bug: "surface" }] } },
      { id: "euler.h3", gap: 30, q: { stem: "Which is quick to settle for any city: every street once, or every address once?", options: [{ t: "Every street once", ok: true }, { t: "Every address once", bug: "surface" }, { t: "Both are equally quick", bug: "surface" }] } },
    ],
    deeper: [
      { title: "Why this is beautiful", body: "Mathematicians call a proof beautiful when a small observation settles a question for every case at once. Here one sentence (visits use bridges in pairs) disposes of every possible walk, including the ones no one has imagined." },
      { title: "The hard sister problem", body: "Visiting every dot once instead of every line (a Hamiltonian path) looks almost the same and is one of the hardest problems known: it is NP-complete. Whether any fast method exists is the P versus NP question, one of the million-dollar Millennium Prize problems." },
      { title: "Open question", body: "Why do two problems that look alike on a map differ so much in difficulty? The honest answer is that nobody has a proof: it is the P versus NP question itself." },
    ],
  });

  /* ─── 18 · Where does the mass go? ─── */
  sessions.push({
    id: "willow", primitive: "mass", domain: "science", region: "Flanders and Australia", works: ["helmont-willow"],
    atoms: ["mech", "causal", "measure", "falsify"],
    title: "Where does the mass go?",
    hook: "A willow grew from 5 pounds to 169 in five years, and the soil in its pot lost only two ounces. Where did 164 pounds of wood come from?",
    minutes: 26,
    why: "Science as a change in your picture of the world, not a list of facts: two questions (where a tree's mass comes from, where lost fat goes) share one mechanism, and most people, including most of the health professionals asked in 2014, get the second one wrong. You will explain it to patients for the rest of your career.",
    capability: "Follow the atoms: account for every kilogram that appears or disappears, and use that to test any claim about where matter comes from or goes.",
    stakes: "A doctor who says fat is “burned into energy” is repeating a myth that breaks the conservation of mass. A doctor who follows the atoms can explain weight loss, and spot nonsense claims, in one minute.",
    bridge: "The missing step: mass cannot appear or vanish. So the question is always: which atoms came in, from where, and which went out, to where. Air counts, even though you cannot feel its weight.",
    connection: "Season 1's selection session asked what didn't come back. Here the invisible input is the air: van Helmont weighed everything except the one thing he could not see.",
    vocab: {
      conservation: { name: "conservation of mass", h: "In a chemical change, nothing is created or lost: every atom goes somewhere.", s: "مفيش ذرة بتختفي: كل حاجة بتروح في حتة، لازم تعرف فين.", t: "In closed chemical systems, the mass of reactants equals the mass of products (Lavoisier)." },
      photo: { name: "photosynthesis", h: "Plants use light to build sugar from carbon dioxide and water, and give off oxygen.", s: "النبات بياخد ثاني أكسيد الكربون من الهوا ومية، وبنور الشمس يعمل منهم سكر وخشب.", t: "6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂; most of a plant's dry mass is carbon fixed from the air." },
      oxid: { name: "oxidation of fat", h: "Burning fat means combining it with oxygen to make carbon dioxide and water, releasing energy.", s: "الدهن بيتحرق مع الأكسجين ويطلع ثاني أكسيد كربون ومية، والطاقة ملهاش وزن يُذكر.", t: "C₅₅H₁₀₄O₆ + 78 O₂ → 55 CO₂ + 52 H₂O + energy (Meerman & Brown 2014)." },
      control: { name: "unmeasured input", h: "Something that enters an experiment without being weighed or noticed.", s: "حاجة داخلة في التجربة ومحدش واخد باله إنها داخلة.", t: "An uncontrolled variable or unmeasured flux that biases the conclusion." },
    },
    provenance: [
      { id: "helmont", claim: "Van Helmont planted a 5-lb willow in 200 lb of dried soil, added only water for five years; the tree weighed 169 lb 3 oz and the soil had lost about 2 oz. He concluded the wood came from water alone.", source: "Van Helmont J.B., Ortus medicinae (Amsterdam, posthumous)", year: "1648", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.helmont", claim: "“164 pounds of wood, barks, and roots arose out of water only” — registered in the quote register.", source: "Van Helmont, Ortus medicinae (1648); English 1662", year: "1648", kind: "primary", license: "public domain", grade: "A" },
      { id: "gas", claim: "Van Helmont coined the word 'gas'.", source: "Standard history of chemistry (checked by web search)", year: "17th c.", kind: "scholarship", license: "fact", grade: "A" },
      { id: "saussure", claim: "Ingenhousz (1779) showed plants need light to release oxygen; de Saussure (1804) showed plants build their substance from carbon dioxide and water.", source: "Ingenhousz J., Experiments upon Vegetables (1779); de Saussure N.-T., Recherches chimiques sur la végétation (1804)", year: "1779–1804", kind: "scholarship", license: "fact", grade: "A" },
      { id: "meerman", claim: "To oxidise 10 kg of human fat, 29 kg of oxygen are inhaled, producing 28 kg of CO₂ and 11 kg of water; 8.4 kg of the fat's mass leaves as CO₂ and 1.6 kg as water. Most doctors, dietitians and personal trainers surveyed thought fat is converted to energy or heat.", source: "Meerman R. & Brown A.J., 'When somebody loses weight, where does the fat go?', BMJ 349:g7257", year: "2014", kind: "scholarship", license: "fact", grade: "A" },
      { id: "wegener", claim: "Alfred Wegener proposed continental drift in 1912; it was widely rejected for lack of a mechanism until plate tectonics was accepted in the 1960s.", source: "Standard history of geology", year: "1912–1960s", kind: "scholarship", license: "fact", grade: "A" },
      { id: "detox", claim: "The foot-pad and log examples are constructed for teaching; the general point (a colour change is not a mass measurement) is not a claim about any brand.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "w1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["helmont"], svg: "willow", atoms: ["mech", "causal"], stem: "Five years, 200 lb of soil, only water added. The willow gained 164 lb; the soil lost 2 oz. Where did most of the wood come from?", alt: "List everything that entered the pot and the tree over five years, including what you cannot see.", options: [
        { t: "From the air, as carbon dioxide", ok: true, why: "Most of a tree's dry mass is carbon, and the carbon came from CO₂ in the air. Water supplies the rest." },
        { t: "From the water alone, as van Helmont concluded", bug: "omission", why: "Water is part of it (hydrogen, some oxygen), but it has no carbon, and wood is about half carbon by dry weight." },
        { t: "From the soil, slowly, over five years", bug: "omission", why: "The soil lost two ounces. It is not where 164 pounds came from." },
        { t: "From sunlight, turned into matter", bug: "surface", why: "Light supplies the energy, not the mass." },
      ] },
      { id: "w2", type: "passage", stage: "primary", min: 1, src: ["q.helmont", "helmont"], quotes: ["helmont"], label: "PRIMARY SOURCE", title: "His conclusion, in his words", body: "Five years of careful weighing, published after his death in 1648." },
      { id: "w3", type: "scene", stage: "reveal", min: 3, src: ["helmont", "saussure", "gas"], terms: ["photo", "control", "conservation"], title: "He weighed everything except the air", body: "Van Helmont measured carefully: weigh the soil dry, weigh the tree, cover the pot against dust, weigh again after five years. His conclusion followed from what he weighed. The air was the [[control|unmeasured input]].\n\nOver the next 150 years others found what he missed: Ingenhousz (1779) showed plants need light to give off oxygen; de Saussure (1804) showed they build themselves from carbon dioxide and water. That is [[photo|photosynthesis]]: a tree is made mostly of air. [[conservation|Mass is conserved]]; it was just coming from where no one looked.", reps: [{ kind: "diagram", label: "The mass balance", body: "In: water (from the rain he added) + carbon dioxide (from the air, unweighed). Out: oxygen (to the air, unweighed). Kept: wood. The soil's two ounces are minerals." }, { kind: "story", label: "The man who named gas", body: "Van Helmont also coined the word **gas**. He knew there were airs of different kinds. He did not think to weigh them going into a tree." }] },
      { id: "w4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["meerman"], terms: ["oxid"], atoms: ["mech", "causal"], stem: "Now a patient loses 10 kg of fat. Where does most of that mass go?", options: [
        { t: "Out through the lungs, as carbon dioxide", ok: true, why: "About 8.4 of the 10 kg leave as CO₂ you breathe out. The rest leaves as water." },
        { t: "Converted into energy and heat by the working muscles", bug: "surface", why: "Energy is released, but it carries essentially no mass. Most health professionals asked in 2014 gave this answer." },
        { t: "Out in the urine and the stool", bug: "omission", why: "Some water leaves that way; the carbon, most of the mass, does not." },
        { t: "Converted into muscle", bug: "surface", why: "Fat cannot be turned into muscle protein; it is oxidised." },
      ] },
      { id: "w5", type: "model", stage: "model", min: 3, model: "atoms", src: ["meerman"], title: "Follow the atoms", body: "Move the amount of fat lost. Then switch to the fat's own atoms only.", ask: "**Find** how many kilograms of oxygen it takes to lose 10 kg of fat, and what fraction of the fat's own mass leaves through the lungs." },
      {
        id: "w6", type: "contrast", stage: "contrast", min: 2.5, src: ["helmont", "meerman"], atoms: ["analogy", "systems"], title: "The willow and the dieter",
        left: { title: "The willow, 1648", body: "Gained 164 lb while its soil lost 2 oz. The carbon came in from the air." },
        right: { title: "The dieter, 2014", body: "Lost 10 kg of fat. 8.4 kg of it went out into the air." },
        q: { stem: "What do the two cases share?", options: [
          { t: "Carbon moving through the air: into the tree, out of the person", ok: true, why: "One carbon cycle, two directions: photosynthesis builds mass from CO₂; oxidation returns it as CO₂." },
          { t: "Both turn water into solid matter", bug: "omission", why: "Water contributes, but carbon is the bulk of both the wood and the fat." },
          { t: "Both get their mass from what enters through the roots or the mouth", bug: "surface", why: "The tree's mass came mostly from the leaves' air, and the dieter's leaves through the lungs." },
          { t: "Nothing: one is a plant and the other an animal", bug: "surface", why: "Different organisms, the same atoms and the same conservation law." },
        ] },
      },
      { id: "w7", type: "q", kind: "transfer", stage: "transfer", min: 1.5, atoms: ["mech", "measure"], terms: ["conservation"], stem: "A 10 kg log burns to 0.1 kg of ash. Where did the other 9.9 kg go?", options: [
        { t: "Into the air as carbon dioxide and water vapour", ok: true, why: "Burning is fast oxidation: the wood's carbon and hydrogen combine with oxygen from the air and leave as gases, like fat in the body." },
        { t: "It was destroyed by the fire", bug: "surface", why: "Fire destroys nothing; it rearranges atoms." },
        { t: "Into light and heat", bug: "surface", why: "Light and heat carry the energy, not the kilograms." },
        { t: "Into the ground under the fire, as soot and melted sap", bug: "omission", why: "A little ash stays; the gases rise." },
      ] },
      { id: "w8", type: "q", kind: "far", stage: "far", min: 1.5, src: ["detox"], atoms: ["falsify", "measure"], stem: "A foot pad turns brown overnight, and the seller says it drew out “toxins”. What does following the atoms ask first?", options: [
        { t: "What entered the pad, and would it weigh the same with water alone?", ok: true, why: "A colour change is not a measurement. Weigh and analyse the pad, and compare with a pad exposed only to moisture: the control van Helmont lacked." },
        { t: "Whether customers feel lighter in the morning", bug: "authority", why: "Feelings are not a mass balance." },
        { t: "How dark the pad became overnight, as a measure of the toxins removed", bug: "proxy", why: "Colour is a proxy with no demonstrated link to any substance." },
        { t: "Whether the seller is a qualified doctor", bug: "authority", why: "Credentials do not change where atoms go." },
      ] },
      { id: "w9", type: "q", kind: "far", stage: "far", min: 1.5, src: ["wegener", "helmont"], atoms: ["falsify", "judgment"], stem: "Van Helmont was wrong that wood comes from water. Wegener's continental drift (1912) was rejected for fifty years, then accepted. What separates a wrong idea from an early one?", options: [
        { t: "Whether later evidence supplies its mechanism or contradicts it", ok: true, why: "Drift lacked a mechanism until plate tectonics supplied one. “Wood from water” was contradicted by better measurements of the air." },
        { t: "Whether it was popular when it was proposed", bug: "authority", why: "Both were unpopular in their time or later; popularity decides nothing." },
        { t: "Whether its author was a trained professional scientist with a university post", bug: "authority", why: "Van Helmont was a physician-chemist; Wegener a meteorologist. Neither fact decided anything." },
        { t: "Nothing: every rejected idea is simply early", bug: "consistency", why: "Most rejected ideas are rejected because they are wrong." },
      ] },
      {
        id: "w10", type: "forge", stage: "forge", min: 3, title: "A one-minute check for any claim about matter", body: "Build the check you will use on patients' questions and on advertisements.",
        slots: [
          { key: "what", label: "First ask", options: [{ t: "how many kilograms appeared or disappeared?", grade: "good", note: "Put a number on the mass first.", say: "how much mass appeared or disappeared" }, { t: "does it sound scientific?", grade: "bad", note: "Jargon is free; mass balances are not.", say: "does it sound scientific" }] },
          { key: "in", label: "Then list", options: [{ t: "everything that went in, including air and water", grade: "good", note: "Van Helmont's missing input was the air.", say: "every input, including air and water" }, { t: "only what you can see", grade: "bad", note: "That is exactly his mistake.", say: "only the visible inputs" }] },
          { key: "out", label: "Then list", options: [{ t: "everything that went out, and in what form", grade: "good", note: "Gas, water, heat: only the first two carry mass.", say: "every output and its form" }, { t: "where it “went” in energy terms", grade: "weak", note: "Energy explains the effort, not the kilograms.", say: "the energy" }] },
          { key: "test", label: "Test", options: [{ t: "a control that leaves out the claimed cause", grade: "good", note: "The pad with water only; the pot covered from dust.", say: "a control without the claimed cause" }, { t: "ask satisfied customers", grade: "bad", note: "Testimony cannot weigh atoms.", say: "customer reviews" }] },
        ],
        template: "Ask: **{what}**. Inputs: {in}. Outputs: {out}. Test: {test}.",
        critique: { stem: "A patient asks: “If I lose weight, where does the fat actually go?” The best answer is…", options: [{ t: "“Mostly out of your lungs, as the carbon dioxide you breathe out.”", ok: true, why: "True, surprising and memorable; it also explains why moving more (breathing out more CO₂) matters." }, { t: "“It's burned up into energy, which is why exercise makes you warm.”", bug: "surface", why: "The myth: energy is released, but the mass leaves as CO₂ and water." }, { t: "“It's complicated; your body just uses it.”", bug: "omission", why: "It is not complicated, and a vague answer teaches nothing." }] },
      },
    ],
    challenge: { stem: "Most of the dry mass of a tree came from…", options: [{ t: "carbon dioxide in the air", ok: true }, { t: "minerals taken up from the soil", bug: "omission" }, { t: "sunlight", bug: "surface" }] },
    hooks: [
      { id: "willow.h1", gap: 1, q: { stem: "When a person loses fat, most of its mass leaves as…", options: [{ t: "carbon dioxide breathed out", ok: true }, { t: "heat given off by the body", bug: "surface" }, { t: "sweat through the skin, mostly", bug: "omission" }] } },
      { id: "willow.h2", gap: 7, q: { stem: "Van Helmont's willow experiment went wrong because…", options: [{ t: "he could not weigh the air that went in", ok: true }, { t: "his scales were inaccurate", bug: "surface" }, { t: "he added fertiliser to the soil by mistake over the years", bug: "surface" }] } },
      { id: "willow.h3", gap: 30, q: { stem: "A claim that something “disappeared” should first be met with…", options: [{ t: "where did its atoms go, and in what form?", ok: true }, { t: "who says so, and are they a qualified expert in the field?", bug: "authority" }, { t: "how quickly did it disappear?", bug: "irrelevant" }] } },
    ],
    deeper: [
      { title: "The numbers, once", body: "Fat is mostly triglyceride, roughly C₅₅H₁₀₄O₆. Burning it: C₅₅H₁₀₄O₆ + 78 O₂ → 55 CO₂ + 52 H₂O. For 10 kg of fat: 29 kg of oxygen in, 28 kg of CO₂ and 11 kg of water out (Meerman and Brown 2014)." },
      { title: "What this does not mean", body: "Breathing faster does not burn fat: the CO₂ you breathe out comes from metabolism, and extra breathing only blows off what is already there. The lungs are where the mass leaves; metabolism is what sends it." },
      { title: "Open question", body: "Why do intelligent people keep getting this wrong? Part of the answer is that air feels weightless. The honest answer is that nobody has tested which way of teaching it sticks longest; the hooks in this app will give one answer for one learner." },
    ],
  });

  /* ─── 19 · A star from a grid ─── */
  sessions.push({
    id: "pattern", primitive: "rule", domain: "art", region: "Egypt, Iran and the Islamic world", works: ["ibn-tulun", "darb-i-imam"],
    atoms: ["taste", "recomb", "represent", "abstr"],
    title: "A star from a hidden grid",
    hook: "Eight-pointed stars cover walls from Cairo to Isfahan, thousands of them, without a single mistake. How were they drawn?",
    minutes: 25,
    why: "Visual art as something you can actually see into, not a list of names and dates. After this session a wall of stars stops being decoration: you will see the hidden grid, the angle, and the choices a craftsman made. And you can walk to a 9th-century example in Cairo.",
    capability: "Find the hidden grid under a geometric pattern, predict how one angle changes the whole design, and look at a real wall before reading its label.",
    stakes: "Most visitors look at a pattern for three seconds and read the label. Seeing the rule underneath turns every such wall, window and floor into something you can read, compare and judge.",
    bridge: "The missing step: the star is not drawn as a star. A simple grid of polygons is laid out lightly first. From the middle of every edge, two lines leave at a fixed angle and meet their neighbours. Change the angle, and a different pattern grows from the same grid.",
    connection: "Season 2's three boxes found a small model under a messy system. Here the small model is a grid and an angle under a wall of thousands of stars.",
    vocab: {
      tess: { name: "tessellation", h: "Shapes that cover a surface with no gaps and no overlaps.", s: "أشكال بتغطي الحيطة كلها من غير فراغ ولا تداخل، زي البلاط.", t: "A tiling of the plane; regular tilings use one regular polygon (triangles, squares, hexagons), semi-regular ones combine several (e.g. octagons and squares, 4.8.8)." },
      contact: { name: "polygons in contact", h: "Hankin's method: lines leave each edge's midpoint at a fixed angle and meet their neighbours.", s: "من نص كل ضلع يطلع خطين بزاوية ثابتة ويقابلوا جيرانهم، فتطلع النجمة لوحدها.", t: "E. H. Hankin (1925): a star pattern is generated from an underlying tiling by rays from edge midpoints at a contact angle; formalised for computers by Kaplan (2005)." },
      girih: { name: "girih", h: "Persian for “knot”: interlaced strapwork patterns, and the set of five tiles used to draw them.", s: "كلمة فارسي معناها عُقدة: الخطوط اللي بتتشابك وتعمل النجوم.", t: "Girih tiles: five decorated tiles (decagon, pentagon, hexagon, bowtie, rhombus) whose lines form continuous patterns; used in Iran from about the 13th century." },
      recursion: { name: "recursion", h: "A rule applied to its own result, again and again.", s: "قاعدة بتتطبق على نتيجتها هي نفسها، مرة بعد مرة.", t: "Self-reference in a definition or process; here, substituting each tile with smaller copies of the tile set." },
    },
    provenance: [
      { id: "hankin", claim: "Ernest Hankin described the 'polygons in contact' method for drawing geometric patterns in 1925, after seeing star patterns in a Turkish bath accompanied by a lightly drawn polygonal grid.", source: "Hankin E.H., 'The Drawing of Geometric Patterns in Saracenic Art', Memoirs of the Archaeological Survey of India 15; as discussed in Kaplan (2005)", year: "1925", kind: "scholarship", license: "fact", grade: "A" },
      { id: "kaplan", claim: "Hankin's method builds star patterns from a tiling and a small number of parameters, including the contact angle.", source: "Kaplan C.S., 'Islamic star patterns from polygons in contact', Proceedings of Graphics Interface 2005", year: "2005", kind: "scholarship", license: "fact", grade: "A" },
      { id: "lusteinhardt", claim: "Girih tilings in the Darb-i Imam shrine in Isfahan (1453) use self-similar subdivision to make a nearly perfect quasi-crystalline pattern, five centuries before Penrose tilings.", source: "Lu P.J. & Steinhardt P.J., 'Decagonal and quasi-crystalline tilings in medieval Islamic architecture', Science 315:1106", year: "2007", kind: "scholarship", license: "fact", grade: "A", contested: "A published comment (Makovicky 2007) disputed parts of the interpretation and the claim of priority; the patterns have defects, which the authors acknowledge." },
      { id: "penrose", claim: "Roger Penrose described aperiodic tilings with a small set of tiles in the 1970s.", source: "Penrose R., Bulletin of the Institute of Mathematics and its Applications 10:266 (1974)", year: "1974", kind: "scholarship", license: "fact", grade: "A" },
      { id: "ibntulun", claim: "The Mosque of Ahmad ibn Tulun in Cairo was built 876–879, with pointed arches on brick piers and extensive stucco decoration including pierced-stucco window grilles; the Mamluk sultan Lajin restored it in 1296.", source: "Standard architectural history (checked by web search)", year: "876–879", kind: "scholarship", license: "fact", grade: "A" },
      { id: "patgen", claim: "Every pattern drawn in this session is generated live by the app's own code from a grid and an angle; nothing is copied from any building or book.", source: "Original", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "p1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["hankin"], atoms: ["represent", "abstr"], stem: "A craftsman must cover a whole wall with eight-pointed stars that interlock perfectly. What does he draw first?", alt: "Think about how you would keep thousands of stars exactly the same size and aligned.", options: [
        { t: "A light grid of simple shapes, then lines from the middle of each edge", ok: true, why: "The grid fixes every star's position; the lines from the edges make the stars. Mistakes are almost impossible once the grid is right." },
        { t: "Each star separately, freehand, carefully copying the one drawn just before it", bug: "surface", why: "Errors would accumulate across a wall; the perfect alignment tells you a grid was used." },
        { t: "The wall's outline, then stars from the corners inward", bug: "surface", why: "Starting from corners makes stars meet badly in the middle." },
        { t: "The star points first, joined up at the very end", bug: "omission", why: "Without a grid, nothing makes the points line up across the wall." },
      ] },
      { id: "p2", type: "scene", stage: "reveal", min: 3, src: ["hankin", "kaplan", "patgen"], terms: ["tess", "contact"], title: "The grid underneath", body: "In the 1920s the scientist Ernest Hankin, working in India, noticed in a Turkish bath that the star patterns on the walls were accompanied by a lightly drawn grid of polygons. He worked out the rule, now called [[contact|polygons in contact]]:\n\n1. Cover the surface with a [[tess|tessellation]] of simple shapes.\n2. From the middle of every edge, draw two lines into the neighbouring shapes, at a fixed angle to the edge.\n3. Stop each line where it meets its neighbour.\n\nErase the grid. Stars remain, and every line continues into the next tile, so the pattern interlaces across the whole wall.", reps: [{ kind: "diagram", label: "The rule, step by step", body: "Octagons and squares form the grid. At 67.5° the lines from the eight edges of each octagon meet in an eight-pointed star; the same lines make four-pointed stars in the squares. The next step lets you change the grid and the angle." }, { kind: "story", label: "Why a grid, historically", body: "Surviving craftsmen's scrolls from the Islamic world show patterns laid over construction grids. The grid made it possible for workshops to reproduce a design exactly, at any size, on stucco, wood, tile or stone." }] },
      { id: "p3", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["kaplan"], atoms: ["predict", "represent"], stem: "Keep the same grid, but make the lines leave each edge at a steeper angle, closer to 90°. What happens to the stars?", options: [
        { t: "They get sharper and thinner, reaching toward the centres", ok: true, why: "At 90° the lines run straight to the centre; the steeper the angle, the deeper and sharper the points. The model will show it." },
        { t: "Nothing changes: the hidden grid alone decides what the pattern looks like", bug: "omission", why: "The grid decides where stars sit; the angle decides their shape." },
        { t: "The stars get more points", bug: "surface", why: "The number of points comes from the number of edges, not the angle." },
        { t: "The pattern breaks apart into separate stars", bug: "surface", why: "Lines still start at the shared edge midpoints, so they always continue into the neighbour." },
      ] },
      { id: "p4", type: "model", stage: "model", min: 4, model: "hankin", src: ["patgen"], title: "Grow a pattern", body: "Choose a hidden grid and an angle. The pattern is drawn live from the rule; nothing is copied.", ask: "**Find** the classic eight-pointed star (octagons and squares, 67.5°), a six-pointed star (hexagons, 60°), and then an angle you think is ugly. What makes it ugly: too blunt, too sharp, or lines too crowded?" },
      {
        id: "p5", type: "contrast", stage: "contrast", min: 2.5, src: ["lusteinhardt", "penrose"], terms: ["girih", "recursion"], atoms: ["analogy", "recomb"], title: "Isfahan, 1453, and Oxford, 1974",
        left: { title: "The Darb-i Imam shrine", body: "Craftsmen in Isfahan used five [[girih|girih]] tiles, each subdivided into smaller copies of the same five tiles, making a pattern that almost never repeats exactly." },
        right: { title: "Penrose tilings", body: "The mathematician Roger Penrose found small sets of tiles that cover the plane in a pattern that never exactly repeats: aperiodic order." },
        q: { stem: "What did the craftsmen and the mathematician share, according to Lu and Steinhardt (2007)?", options: [
          { t: "A small set of tiles whose rules produce order that almost never repeats", ok: true, why: "Their claim: the 1453 pattern is nearly perfect quasi-crystalline order, five centuries before Penrose. A published comment disputes parts of it; the patterns have defects, which the authors acknowledge." },
          { t: "Both copied the patterns from snowflakes in nature", bug: "surface", why: "Snowflakes have six-fold symmetry; this order is of another kind, found by rule, not copied." },
          { t: "Both worked them out with computers", bug: "surface", why: "The craftsmen had compass and straightedge; Penrose worked on paper." },
          { t: "Nothing at all: one is religious decoration and the other is pure mathematics", bug: "surface", why: "Different purposes, one structure: that is the finding." },
        ] },
      },
      { id: "p6", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["ibntulun"], atoms: ["taste", "abstr"], poss: { "ibn-tulun": "apply" }, stem: "You stand in the Mosque of Ibn Tulun in Cairo (876–879) in front of a pierced-stucco window grille. What should you look for first, before reading any label?", options: [
        { t: "The repeating unit, and the grid it sits on", ok: true, why: "Find the smallest piece that repeats and the grid under it; then the whole window is readable. Only then read the label: some of the grilles are later restorations, and you will see differences between them." },
        { t: "The date on the label, to know what to feel", bug: "authority", why: "Reading first replaces seeing with knowing about." },
        { t: "Whether it is the original or a later restoration", bug: "authority", why: "A good question, second. First see it; then the history means something." },
        { t: "Its colour and the light behind it", bug: "irrelevant", why: "Lovely, but the stucco is monochrome; the structure is the content here." },
      ] },
      { id: "p7", type: "q", kind: "far", stage: "far", min: 1.5, src: ["lusteinhardt"], terms: ["recursion"], atoms: ["abstr", "systems"], stem: "In the Isfahan tiles, each tile is replaced by smaller copies of the tile set, and then those are replaced again. Where else does that kind of rule appear?", options: [
        { t: "In any rule applied to its own output, like a fractal", ok: true, why: "That is [[recursion|recursion]]: a rule fed its own result. Coastlines, bronchial trees in the lungs and computer programs all use it." },
        { t: "Only in Islamic art, which invented it", bug: "surface", why: "Recursion appears in mathematics, biology and computing; Islamic art is one brilliant use." },
        { t: "In random processes, where nothing repeats", bug: "inversion", why: "Recursion is the opposite of randomness: one rule, strictly repeated." },
        { t: "In mirror symmetry, where each half of a design copies the other half", bug: "surface", why: "Mirroring copies at one scale; recursion copies at smaller and smaller scales." },
      ] },
      {
        id: "p8", type: "forge", stage: "forge", min: 3, title: "Design a window grille", body: "A grille for a sunny Cairo window: pattern, light and privacy together.",
        slots: [
          { key: "grid", label: "Hidden grid", options: [{ t: "octagons and squares", grade: "good", note: "The classic eight-pointed star, with good openings for light.", say: "octagons and squares" }, { t: "hexagons", grade: "good", note: "Six-pointed stars; denser, more shade.", say: "hexagons" }, { t: "random shapes, freehand", grade: "bad", note: "Lines won't continue from tile to tile; the grille looks broken.", say: "random shapes" }] },
          { key: "angle", label: "Angle", options: [{ t: "between 60° and 72°", grade: "good", note: "Stars with clear points and even openings.", say: "about 65°" }, { t: "close to 30°", grade: "weak", note: "Blunt shapes crowd the corners and block light unevenly.", say: "30°" }, { t: "close to 90°", grade: "weak", note: "Thin spikes: fragile in stucco.", say: "90°" }] },
          { key: "check", label: "Check", options: [{ t: "every line continues across tile edges", grade: "good", note: "That is what makes it interlace.", say: "every line continues across the edges" }, { t: "it looks busy enough", grade: "bad", note: "Busyness is not a criterion.", say: "it looks busy" }] },
          { key: "job", label: "Its job", options: [{ t: "light in, eyes out: openings small enough for privacy", grade: "good", note: "The mashrabiya's old purpose, in stucco.", say: "light in, privacy kept" }, { t: "decoration only", grade: "weak", note: "It will still work, but the best patterns do a job.", say: "decoration" }] },
        ],
        template: "Grid: **{grid}**. Angle: {angle}. Check: {check}. Job: {job}.",
        critique: { stem: "In your drawing some lines stop at the tile edges instead of carrying on into the next tile. What went wrong?", options: [{ t: "The lines didn't start at the midpoints of the shared edges", ok: true, why: "Two tiles share each edge midpoint; lines starting there continue automatically." }, { t: "The angle was too steep for the lines to reach the next tile", bug: "surface", why: "Any angle keeps lines continuous if they start at midpoints." }, { t: "The grid had too many shapes", bug: "surface", why: "The number of shapes doesn't break continuity." }] },
      },
    ],
    challenge: { stem: "Two star patterns share the same hidden grid. What most likely differs between them?", options: [{ t: "The angle at which lines leave the edges", ok: true }, { t: "The number of points on each of the stars", bug: "surface" }, { t: "The country where they were made", bug: "irrelevant" }] },
    hooks: [
      { id: "pattern.h1", gap: 1, q: { stem: "What lies hidden under an Islamic star pattern drawn by Hankin's method?", options: [{ t: "A grid of simple polygons", ok: true }, { t: "A single large circle", bug: "surface" }, { t: "Nothing: it is drawn freehand", bug: "omission" }] } },
      { id: "pattern.h2", gap: 7, q: { stem: "Same grid, steeper angle from each edge. The stars become…", options: [{ t: "sharper and thinner", ok: true }, { t: "blunter and wider", bug: "inversion" }, { t: "stars with more points", bug: "surface" }] } },
      { id: "pattern.h3", gap: 30, poss: { "ibn-tulun": "context" }, q: { stem: "In front of a geometric window in a Cairo mosque, first find…", options: [{ t: "the repeating unit and the grid under it", ok: true }, { t: "the label, its date and the name of the patron", bug: "authority" }, { t: "the name of the craftsman", bug: "irrelevant" }] } },
    ],
    deeper: [
      { title: "Go and see it", body: "The Mosque of Ahmad ibn Tulun (876–879) is one of the oldest in Cairo and one of the largest by area: pointed arches on brick piers, stucco decoration along the arches, and pierced-stucco window grilles high on the walls, not all of them original. Look for a minute before reading anything." },
      { title: "The quasi-crystal debate", body: "Lu and Steinhardt's 2007 paper argued that 15th-century Iranian craftsmen reached nearly perfect quasi-crystalline patterns by subdividing girih tiles. A published comment argued for different constructions and earlier examples. Both sides agree the patterns are extraordinary; they disagree on what the makers knew." },
      { title: "Open question", body: "Did the craftsmen understand aperiodicity as mathematics, or find it as craft? The buildings cannot tell us, and no written treatise that settles it has been found." },
    ],
  });

  /* ─── 20 · The question and the answer (music) ─── */
  sessions.push({
    id: "cadence", primitive: "expect", domain: "music", region: "Germany, Austria and Egypt", works: ["ode-to-joy"],
    atoms: ["predict", "taste", "represent"],
    title: "The question and the answer",
    hook: "Hum the first line of “Ode to Joy” and stop. It sounds unfinished. Hum the second and stop: finished. The notes are almost the same. What decides?",
    minutes: 24,
    why: "Music as hearing, not composer trivia: you will hear why some endings sound like a full stop and others like a comma, and why a surprise ending moves you. The melody is Beethoven's, the words Schiller's, and Dmitri Karamazov recites that same poem in his confession. All sound here is synthesised in your browser; every example also has a written description.",
    capability: "Hear whether a phrase ends at rest or in tension, predict where a melody wants to go, and explain the feeling as an expectation met or broken.",
    stakes: "Listeners who can hear the question and the answer in a phrase can follow a symphony, a song or a film score. Without it, music is a pleasant sound with names attached.",
    bridge: "The missing step: from every song you have ever heard, your ear has learned which notes usually end a phrase. A phrase that stops on the home note sounds finished; one that stops a step away sounds like a question waiting for its answer.",
    connection: "Season 1's predictions before explanations: here your ear predicts before you think. And Dmitri, confessing in Book III of Karamazov, begins with Schiller's ode, the words Beethoven set to this tune.",
    vocab: {
      tonic: { name: "tonic (home note)", h: "The note a piece feels anchored to; ending there sounds finished.", s: "النغمة اللي المزيكا بترجع لها عشان تحس إنها خلصت، زي البيت.", t: "The first degree of the key; in C major, C." },
      cadence: { name: "cadence", h: "The way a phrase ends: at rest, half-open, or with a twist.", s: "طريقة ما الجملة الموسيقية بتقفل: نقطة، ولا فصلة، ولا مفاجأة.", t: "A harmonic or melodic formula closing a phrase: perfect (V–I), plagal (IV–I), half (ending on V), deceptive (V–vi)." },
      period: { name: "question and answer phrases", h: "Two phrases that start alike; the first ends open, the second closes.", s: "جملتين بيبدأوا زي بعض: الأولى سؤال مفتوح، والتانية الإجابة اللي بتقفل.", t: "An antecedent–consequent period: the antecedent ends on a weaker (often half) cadence, the consequent on a perfect one." },
      maqam: { name: "maqam", h: "In Arabic music, a system of scales and melodic habits, including notes between Western ones.", s: "المقام: السلم والطريقة اللي اللحن بيمشي بيها، وفيه نغمات بين نغمات البيانو.", t: "A modal framework defining intervals (some near three-quarter tones in practice), characteristic phrases and a tonal centre; e.g. Rast, whose third lies between major and minor." },
    },
    provenance: [
      { id: "beethoven", claim: "Beethoven's Ninth Symphony, first performed in Vienna in 1824, sets Schiller's 'An die Freude' in its finale; the melody is in the public domain.", source: "Standard music history", year: "1824", kind: "primary", license: "public domain", grade: "A" },
      { id: "meyer", claim: "Emotion and meaning in music arise when an expectation (a tendency) is delayed or inhibited.", source: "Meyer L.B., Emotion and Meaning in Music (University of Chicago Press)", year: "1956", kind: "scholarship", license: "fact", grade: "A" },
      { id: "huron", claim: "Musical expectation can be analysed in five responses (imagination, tension, prediction, reaction, appraisal); schematic expectations are ingrained, so a deceptive cadence keeps sounding deceptive even when the listener knows it is coming.", source: "Huron D., Sweet Anticipation: Music and the Psychology of Expectation (MIT Press)", year: "2006", kind: "scholarship", license: "fact", grade: "A" },
      { id: "cairo1932", claim: "The Congress of Arab Music in Cairo (1932), attended by musicians and scholars including Béla Bartók and Paul Hindemith, debated whether to fix Arab scales to 24 equal quarter tones or keep the flexible intervals of practice.", source: "Accounts of the 1932 Congress (e.g. the 'Beyond 1932' project, King's College London); checked by web search", year: "1932", kind: "scholarship", license: "fact", grade: "A" },
      { id: "dmitri", claim: "Dmitri's confession in Book III, ch. 3 of The Brothers Karamazov opens with Schiller: stanzas from 'The Eleusinian Festival' and lines from 'An die Freude'.", source: "Garnett translation, Book III ch. 3 (checked by web search)", year: "1912", kind: "primary", license: "public domain", grade: "A" },
      { id: "synth", claim: "All sound in this session is synthesised by the app from note numbers; the melody transcription (in C major) and chord voicings are the app's own.", source: "Original", year: "2026", kind: "original", license: "original", grade: "A" },
      { id: "talk", claim: "The presentation example is invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "c1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["synth", "beethoven"], atoms: ["predict"], listen: [{ label: "PLAY PHRASE 1", seq: melody(ODE1), text: "Written out: E E F G · G F E D · C C D E · E, D, D (the last note held). It stops on D." }], stem: "Play the first phrase of “Ode to Joy”. It stops. If it went on, where would the next note most want to go?", alt: "Hum it and stop. Then hum one more note, whichever feels natural.", options: [
        { t: "Down one step, to the home note C", ok: true, why: "D sits one step above the [[tonic|home note]]; your ear expects it to settle there. The second phrase does exactly that." },
        { t: "Up, to a higher note than any so far", bug: "surface", why: "A leap up would add tension, not release it." },
        { t: "Nowhere: it already sounds finished", bug: "omission", why: "Most listeners hear the stop on D as a comma, not a full stop." },
        { t: "It can't be predicted without the score", bug: "authority", why: "Your ear has already predicted it; the score only confirms it." },
      ] },
      { id: "c2", type: "scene", stage: "reveal", min: 3, src: ["beethoven", "meyer", "huron", "dmitri"], terms: ["tonic", "cadence", "period"], listen: [{ label: "PLAY PHRASE 2", seq: melody(ODE2), text: "Written out: the same as phrase 1 until the end, which is D, C, C. It stops on C, home." }], title: "A question, then its answer", body: "The two phrases are identical for twelve notes. Only the ending differs: the first stops on D, the second on C. Musicians call them a [[period|question and an answer]]: the same start, an open ending, then a closed one. Every ending of a phrase is a [[cadence|cadence]].\n\nWhy does C sound like home? Not because of physics: because of learning. From every piece in this tradition you have heard, your ear has learned that phrases usually end there. The musicologist Leonard Meyer (1956) argued that musical feeling comes from such expectations being delayed or broken; David Huron (2006) showed how deep they sit.", reps: [{ kind: "diagram", label: "See the two endings", svg: "phrases", body: "Twelve identical notes, then two different last bars." }, { kind: "story", label: "Schiller, Beethoven, Dmitri", body: "Schiller wrote “An die Freude” in 1785. Beethoven set it in the last movement of his Ninth Symphony (Vienna, 1824). In The Brothers Karamazov, Dmitri begins his confession to Alyosha by reciting Schiller: the same poem, in a very different mood." }, { kind: "analogy", label: "Like punctuation", body: "Phrase 1 ends with a comma, phrase 2 with a full stop. Read a sentence that stops at a comma and you wait for the rest." }] },
      { id: "c3", type: "model", stage: "model", min: 4, model: "cadence", src: ["synth"], title: "Choose the last chord", body: "The same three chords, then four different endings. Choose one and press PLAY.", ask: "**Find** the ending that sounds most finished, the one that sounds like a question, and the one that surprises you. Which note moves in the surprise?" },
      { id: "c4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["huron"], atoms: ["predict", "taste"], stem: "The chords build toward home, and at the last moment land on a different chord (vi) instead. Most listeners hear…", options: [
        { t: "a surprise: the music has moved on instead of ending", ok: true, why: "A deceptive cadence: the expected arrival is replaced at the last moment. Huron found it keeps sounding deceptive even after you know it is coming." },
        { t: "a mistake by the performer", bug: "surface", why: "Composers write it deliberately, often to extend a piece." },
        { t: "a perfectly ordinary ending, like any other in the piece", bug: "omission", why: "Played in context, almost no listener hears it as an ending." },
        { t: "nothing: listeners can't hear chord changes", bug: "rigid", why: "You could hear it in the model a moment ago." },
      ] },
      {
        id: "c5", type: "contrast", stage: "contrast", min: 2.5, src: ["meyer", "huron"], atoms: ["analogy", "predict"], title: "A surprise ending and a punchline",
        left: { title: "The deceptive cadence", body: "Everything prepares the home chord; at the last moment another arrives. Listeners feel a jolt, often pleasant." },
        right: { title: "A joke", body: "The setup makes you expect one meaning; the last words force another. Listeners laugh." },
        q: { stem: "What do they share?", options: [
          { t: "Both build a strong expectation and then break it at the last moment", ok: true, why: "Meyer's idea in two media: the feeling comes from the expectation you were led to form, and its violation." },
          { t: "Both depend on words to carry their meaning", bug: "surface", why: "The cadence has no words at all." },
          { t: "Both are random: the ending could be anything", bug: "omission", why: "Both endings are exactly chosen; a random one would not surprise, only confuse." },
          { t: "Both avoid creating any expectations at all, so that they always stay fresh", bug: "inversion", why: "Without the expectation there is nothing to break." },
        ] },
      },
      { id: "c6", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["cairo1932", "synth"], terms: ["maqam"], atoms: ["taste", "judgment"], listen: [{ label: "PLAY THREE VERSIONS", seq: { bpm: 84, notes: [60, 62, 64, 65, 67].map((n, i) => ({ t: i, d: 0.9, n })).concat([60, 62, 63, 65, 67].map((n, i) => ({ t: 6 + i, d: 0.9, n }))).concat([60, 62, 63.5, 65, 67].map((n, i) => ({ t: 12 + i, d: 0.9, n }))) }, text: "Three rising lines, C D _ F G. The third note is E (major), then E-flat (minor), then a note halfway between them, as in maqam Rast." }], stem: "In the third line the third note sits between major and minor. A listener raised on Egyptian music hears it as natural; one raised only on piano music hears it as “out of tune”. What does this show?", options: [
        { t: "Which notes sound right is learned from the music you grew up with", ok: true, why: "The note is exact and intentional in maqam Rast. At the 1932 Congress in Cairo, musicians argued about how to fix such notes; Bartók and Hindemith were there." },
        { t: "The third version is out of tune", bug: "authority", why: "Only by the rules of another tradition." },
        { t: "Egyptian listeners hear pitch less precisely than piano-trained listeners do", bug: "moral", why: "The opposite: they distinguish a note that piano-trained ears lump together." },
        { t: "Pianos are tuned incorrectly", bug: "inversion", why: "Pianos are tuned correctly for their tradition, which lacks this note." },
      ] },
      { id: "c7", type: "q", kind: "far", stage: "far", min: 1.5, src: ["talk"], atoms: ["predict", "compress"], stem: "You present a case at rounds. Which ending will leave listeners feeling it is complete?", options: [
        { t: "Returning to the opening question, now answered", ok: true, why: "Like the second phrase: the same start, now closed at home. An ending that returns and resolves sounds finished." },
        { t: "A new, unanswered question about another patient", bug: "surface", why: "That is a half cadence: a comma where a full stop was needed." },
        { t: "A list of every finding, in the order they were found", bug: "omission", why: "Lists stop; they don't resolve." },
        { t: "Speeding up to finish before the time runs out", bug: "irrelevant", why: "Speed changes nothing about whether it arrives home." },
      ] },
      {
        id: "c8", type: "forge", stage: "forge", min: 3, title: "How you will listen next time", body: "For your next concert, song or film score.",
        slots: [
          { key: "for", label: "Listen for", options: [{ t: "where the main tune comes back, and how it has changed", grade: "good", note: "Return and change are how long music is built.", say: "the main tune's returns" }, { t: "the performers' names and the date", grade: "bad", note: "That is reading, not listening.", say: "names and dates" }] },
          { key: "mark", label: "At each phrase end, ask", options: [{ t: "comma or full stop?", grade: "good", note: "You will start hearing the structure within a minute.", say: "comma or full stop" }, { t: "do I like it?", grade: "weak", note: "Fine, but it tells you nothing new.", say: "do I like it" }] },
          { key: "surprise", label: "Notice", options: [{ t: "one ending that went somewhere unexpected", grade: "good", note: "That is where the composer made a choice.", say: "one surprise ending" }, { t: "the loudest moment", grade: "weak", note: "Loudness is easy; choices are interesting.", say: "the loudest moment" }] },
          { key: "keep", label: "Afterwards", options: [{ t: "hum the question and its answer", grade: "good", note: "Humming it is remembering it.", say: "hum the question and answer" }, { t: "look up the composer's biography", grade: "weak", note: "Context later is fine; the sound first.", say: "read the biography" }] },
        ],
        template: "Listen for **{for}**. At each phrase end: {mark}. Notice {surprise}. Afterwards: {keep}.",
        critique: { stem: "After a concert someone says “the second movement was so beautiful”. What would show you actually heard it?", options: [{ t: "Pointing to where the tune came back changed, or where an ending surprised", ok: true, why: "Specific structure, heard, not labelled." }, { t: "Naming the composer's dates and the orchestra", bug: "surface", why: "Facts about it, not hearing it." }, { t: "Saying it was deeply emotional and moving, and that it brought tears to the eyes", bug: "pretension", why: "True of anything, specific to nothing." }] },
      },
    ],
    challenge: { stem: "A phrase ends on the chord built on the fifth note (V). It sounds…", options: [{ t: "open, like a question", ok: true }, { t: "completely finished, like a full stop", bug: "inversion" }, { t: "out of tune", bug: "surface" }] },
    hooks: [
      { id: "cadence.h1", gap: 1, poss: { "ode-to-joy": "structure" }, q: { stem: "The first phrase of “Ode to Joy” ends on the note just above home. So it sounds…", options: [{ t: "unfinished, like a question", ok: true }, { t: "finished, like a full stop", bug: "inversion" }, { t: "sad, like a minor chord at a funeral", bug: "surface" }] } },
      { id: "cadence.h2", gap: 7, q: { stem: "A deceptive cadence is…", options: [{ t: "an ending that lands on an unexpected chord instead of home", ok: true }, { t: "a wrong note played by mistake", bug: "surface" }, { t: "an ending that fades out slowly until the music can no longer be heard", bug: "surface" }] } },
      { id: "cadence.h3", gap: 30, q: { stem: "A note between major and minor sounds natural to some listeners and “off” to others because…", options: [{ t: "expectations are learned from the music you grew up with", ok: true }, { t: "some people hear pitch better", bug: "moral" }, { t: "the note is physically impure and produces clashing overtones", bug: "surface" }] } },
    ],
    deeper: [
      { title: "What the model simplifies", body: "Real cadences depend on rhythm, melody and context as well as the chords; the synthesised tones have none of an orchestra's colour. The point here is the pull of the endings, which survives even in plain tones." },
      { title: "Cairo, 1932", body: "The Congress of Arab Music gathered performers and scholars from the Arab world and Europe. Its sharpest debate was whether to fix the scale to 24 equal quarter tones (convenient for notation and instruments) or keep the flexible intervals musicians actually play. Bartók and colleagues also made hundreds of recordings of the performing groups." },
      { title: "Open question", body: "How much of what feels “natural” in music is universal and how much learned? Research finds some near-universals (octave equivalence is widely shared) and a great deal that is learned; the boundary is still argued over." },
    ],
  });

  const S = (window.RENAISSANCE_SEASONS = window.RENAISSANCE_SEASONS || []);
  let z = S.find((y) => y.id === "s3");
  if (!z) S.push((z = { id: "s3", domain: "culture", title: "Season 3 · Possession", sessions: [], visuals: {}, models: {}, quotes: {} }));
  z.sessions.push(...sessions);
  Object.assign(z.visuals, visuals);
  Object.assign(z.models, models);
  Object.assign((z.quotes = z.quotes || {}), quotes);
})();
