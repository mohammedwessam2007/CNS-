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
  const ROMAN = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  const roman = (n) => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, "");
  const digitsIn = (n, b) => { const d = []; do { d.unshift(n % b); n = Math.floor(n / b); } while (n > 0); return d; };
  function placeDraw(v) {
    const n = v.n, b = v.base, d = digitsIn(n, b), k = d.length;
    const w = Math.min(40, Math.floor(320 / k)), x0 = 180 - (w * k) / 2;
    let h = t(180, 22, n + " written in base " + b, { c: C.mut, fs: 13 });
    d.forEach((dg, i) => {
      const x = x0 + i * w, place = Math.pow(b, k - 1 - i), blank = v.nozero && dg === 0;
      h += box(x + 2, 40, w - 4, 52, blank ? C.pink : C.cyan) + (blank ? "" : t(x + w / 2, 74, String(dg), { c: C.ink, fs: 20 })) + t(x + w / 2, 110, String(place), { c: C.mut, fs: 12, fw: 600 });
    });
    h += t(180, 132, "each column is worth " + b + " times the one to its right", { c: C.mut, fs: 12, fw: 600 });
    const r = roman(n);
    h += t(180, 168, "Roman: " + r, { c: C.amber, fs: 14 }) + t(180, 188, r.length + (r.length === 1 ? " symbol" : " symbols") + ", and no column", { c: C.mut, fs: 12, fw: 600 }) + t(180, 204, "tells you what a symbol is worth", { c: C.mut, fs: 12, fw: 600 });
    if (v.nozero && d.includes(0)) h += t(180, 226, "without a zero the page shows: " + d.filter((x) => x).join(" "), { c: C.pink, fs: 13 });
    return svg(360, 240, h, "A number shown as place-value columns in a chosen base, with its Roman numeral below");
  }
  function zeroLineDraw() {
    const E = [["628", "Brahmagupta: zero as a number", "India"], ["683", "a dot for zero, dated, in stone", "Cambodia (inscription K-127)"], ["c. 825", "al-Khwarizmi on Hindu reckoning", "Baghdad"], ["876", "“270” with a round zero", "Gwalior, India"], ["1202", "Fibonacci's Liber Abaci", "Pisa"]];
    let h = '<line x1="70" y1="20" x2="70" y2="244" stroke="' + C.line + '" stroke-width="2"/>';
    E.forEach(([y, a, p], i) => {
      const yy = 30 + i * 46;
      h += '<circle cx="70" cy="' + (yy + 4) + '" r="5" fill="' + C.lime + '"/>' + t(60, yy + 9, y, { c: C.lime, fs: 13, a: "end" }) + t(84, yy + 8, a, { c: C.ink, fs: 12.5, a: "start" }) + t(84, yy + 26, p, { c: C.mut, fs: 12, fw: 600, a: "start" });
    });
    return svg(360, 256, h, "Timeline of zero from India and Cambodia through Baghdad to Pisa, 628 to 1202");
  }

  // the finest angle a scale of radius R can mark, if you can tell marks w millimetres apart
  const arcsec = (wMm, rM) => ((wMm / 1000) / rM) * 206265;
  function scaleDraw(v) {
    const a = arcsec(v.w, v.r), eye = 60;
    const W = 300, x0 = 30, maxLog = Math.log10(3600), minLog = Math.log10(1);
    const xOf = (s) => x0 + W * (Math.log10(Math.min(3600, Math.max(1, s))) - minLog) / (maxLog - minLog);
    let h = t(180, 20, "A scale " + v.r + " m in radius, marks " + v.w + " mm apart", { c: C.mut, fs: 12, fw: 600 });
    h += '<line x1="' + x0 + '" y1="70" x2="' + (x0 + W) + '" y2="70" stroke="' + C.line + '" stroke-width="3"/>';
    for (const [s, lab] of [[1, "1″"], [10, "10″"], [60, "1′"], [600, "10′"], [3600, "1°"]]) h += '<line x1="' + xOf(s).toFixed(1) + '" y1="62" x2="' + xOf(s).toFixed(1) + '" y2="78" stroke="' + C.mut + '"/>' + t(xOf(s), 96, lab, { c: C.mut, fs: 12, fw: 600 });
    h += '<circle cx="' + xOf(a).toFixed(1) + '" cy="70" r="8" fill="' + (a < eye ? C.green : C.pink) + '"/>' + t(xOf(a), 48, "this scale: " + (a < 1 ? a.toFixed(2) : a < 100 ? a.toFixed(1) : Math.round(a)) + "″", { c: a < eye ? C.green : C.pink, fs: 13 });
    h += '<line x1="' + xOf(eye).toFixed(1) + '" y1="104" x2="' + xOf(eye).toFixed(1) + '" y2="118" stroke="' + C.amber + '" stroke-width="2"/>' + t(xOf(eye), 134, "the naked eye: about 1′", { c: C.amber, fs: 12, fw: 600 });
    h += lines(180, 166, wrap("finest angle the scale can mark (smaller is sharper); the dot turns green when the scale is finer than the eye", 48), { c: C.mut, fs: 12, fw: 600 }, 16);
    return svg(360, 206, h, "The finest angle a scale can mark, against the naked eye's limit, on a logarithmic line");
  }

  const erfA = (x) => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t1 = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t1 - 1.453152027) * t1) + 1.421413741) * t1 - 0.284496736) * t1 + 0.254829592) * t1 * Math.exp(-x * x); return s * y; };
  const PhiA = (z) => 0.5 * (1 + erfA(z / Math.SQRT2));
  // chance of making landfall: lateral miss ~ Normal(0, D·tan(err)); each island is found within its halo (sighting or birds)
  function landfall(v) {
    const sd = v.dist * Math.tan((v.err * Math.PI) / 180), halo = v.birds ? 32 : 16, gap = 80;
    const iv = [];
    for (let i = 0; i < v.n; i++) { const c = (i - (v.n - 1) / 2) * gap; iv.push([c - halo, c + halo]); }
    const merged = [];
    for (const [a, b] of iv) { if (merged.length && a <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], b); else merged.push([a, b]); }
    const p = merged.reduce((s, [a, b]) => s + PhiA(b / sd) - PhiA(a / sd), 0);
    return { sd, halo, p, width: merged.reduce((s, [a, b]) => s + b - a, 0) };
  }
  function landfallDraw(v) {
    const L = landfall(v), scale = 150 / Math.max(3 * L.sd, (v.n - 1) * 40 + L.halo + 20);
    const cx = 180, ty = 70;
    let h = t(180, 20, v.dist + " km, heading off by up to about " + v.err + "°", { c: C.mut, fs: 12, fw: 600 });
    // bell curve of where the canoe arrives along the line of islands
    let pts = [];
    for (let x = -165; x <= 165; x += 5) { const km = x / scale; pts.push([cx + x, ty + 44 - 40 * Math.exp(-(km * km) / (2 * L.sd * L.sd))]); }
    h += '<polyline points="' + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + '" fill="none" stroke="' + C.cyan + '" stroke-width="2"/>';
    h += '<line x1="15" y1="' + (ty + 44) + '" x2="345" y2="' + (ty + 44) + '" stroke="' + C.line + '"/>';
    for (let i = 0; i < v.n; i++) {
      const c = cx + (i - (v.n - 1) / 2) * 80 * scale;
      if (c < 10 || c > 350) continue;
      h += '<rect x="' + (c - L.halo * scale).toFixed(1) + '" y="' + (ty + 38) + '" width="' + (2 * L.halo * scale).toFixed(1) + '" height="12" rx="6" fill="' + (v.birds ? C.green : C.amber) + '" opacity="0.55"/>' + '<circle cx="' + c.toFixed(1) + '" cy="' + (ty + 44) + '" r="4" fill="' + C.ink + '"/>';
    }
    h += t(180, 146, (v.birds ? "green: islands found by their birds (about 32 km)" : "amber: islands found by sight (about 16 km)"), { c: C.mut, fs: 12, fw: 600 });
    h += t(180, 172, "blue: where the canoe may arrive", { c: C.cyan, fs: 12, fw: 600 });
    h += t(180, 204, "chance of making landfall: " + Math.round(L.p * 100) + "%", { c: L.p > 0.5 ? C.green : C.pink, fs: 15 });
    return svg(360, 220, h, "Where a canoe may arrive along a line of islands, and the chance it finds one");
  }

  const LC = [["bak'tun", 144000], ["k'atun", 7200], ["tun", 360], ["winal", 20], ["k'in", 1]];
  const lcDigits = (days) => LC.map(([, v]) => { const d = Math.floor(days / v); days -= d * v; return d; });
  function longCountDraw(v) {
    const d = lcDigits(v.days);
    let h = t(180, 20, v.days.toLocaleString("en-US") + " days, written as a Maya count", { c: C.mut, fs: 12, fw: 600 });
    LC.forEach(([name, val], i) => {
      const x = 14 + i * 67, empty = d[i] === 0;
      h += box(x, 36, 61, 62, empty ? C.amber : C.cyan) + t(x + 30.5, 76, empty ? "shell" : String(d[i]), { c: empty ? C.amber : C.ink, fs: empty ? 13 : 20 });
      h += t(x + 30.5, 116, name, { c: C.mut, fs: 12, fw: 600 }) + t(x + 30.5, 134, "×" + val.toLocaleString("en-US"), { c: C.mut, fs: 12, fw: 600 });
    });
    h += t(180, 164, d.join("."), { c: C.lime, fs: 16 });
    h += lines(180, 190, wrap("each place is worth 20 of the next, except the tun: 18 winals, so a tun of 360 days is close to a year", 48), { c: C.mut, fs: 12, fw: 600 }, 16);
    return svg(360, 226, h, "A number of days written in the five places of the Maya Long Count, with empty places marked by the shell sign");
  }

  const visuals = {
    zeroLine: () => zeroLineDraw(),
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
    longcount: {
      controls: [
        { id: "days", label: "Days counted", min: 0, max: 1872000, step: 1, value: 1386720, unit: "" },
      ],
      draw: (v) => longCountDraw(v),
      read(v) {
        const d = lcDigits(v.days), empties = d.filter((x, i) => x === 0 && d.slice(0, i).some((y) => y)).length;
        return "**" + v.days.toLocaleString("en-US") + " days is " + d.join(".") + " in the Long Count.** " + (empties ? "It has " + empties + " empty place" + (empties > 1 ? "s" : "") + " inside it, each marked with the shell sign: without it, the places would slide together, just as 408 would become 48." : "No empty place inside this count; try a round number of tuns or k'atuns to see the shell appear.") + " Every place is worth twenty of the next, except the tun (18 winals, 360 days), which the calendar bends to stay close to a year. A number line of five places covers more than 5,000 years.";
      },
    },
    landfall: {
      controls: [
        { id: "dist", label: "Distance sailed (km)", min: 500, max: 4000, step: 500, value: 2000, unit: " km" },
        { id: "err", label: "Heading error (degrees)", min: 1, max: 8, step: 1, value: 3, unit: "°" },
        { id: "n", label: "Islands in the chain you aim for", min: 1, max: 5, step: 1, value: 1, unit: "" },
      ],
      toggles: [{ id: "birds", label: "Read the birds, not only the islands", value: false }],
      draw: (v) => landfallDraw(v),
      read(v) {
        const L = landfall(v), one = landfall(Object.assign({}, v, { n: 1, birds: false }));
        return "**A " + v.err + "° error over " + v.dist + " km scatters your arrival by about ±" + Math.round(L.sd) + " km. Aiming at " + (v.n === 1 ? "one island" : "a chain of " + v.n) + (v.birds ? " and reading its birds" : " by sight alone") + " gives a " + Math.round(L.p * 100) + "% chance of landfall**" + (v.n > 1 || v.birds ? " (one island by sight: " + Math.round(one.p * 100) + "%)" : "") + ". You cannot aim more precisely than your error; you can make the target wider. This model lets the error build up unchecked; real navigators corrected their course by stars and swells along the way, so it shows the logic, not their odds.";
      },
    },
    scale: {
      controls: [
        { id: "r", label: "Radius of the scale (metres)", min: 1, max: 40, step: 1, value: 2, unit: " m" },
        { id: "w", label: "How close two marks can be and still be told apart (mm)", min: 1, max: 5, step: 1, value: 2, unit: " mm" },
      ],
      draw: (v) => scaleDraw(v),
      read(v) {
        const a = arcsec(v.w, v.r);
        return "**A " + v.r + "-metre scale with marks " + v.w + " mm apart can mark angles of about " + (a < 100 ? a.toFixed(1) : Math.round(a)) + " seconds of arc.** " + (a < 60 ? "That is finer than the naked eye's limit of about one minute: the instrument, not the eye, now sets the precision." : "That is coarser than the eye can resolve: the scale is the bottleneck, so make it bigger.") + " Doubling the radius halves the angle between marks, which is why Ulugh Beg built a curved scale about 36 metres in radius. In practice the blurred image of the sun and the builders' care set the real limit; size bought room.";
      },
    },
    place: {
      controls: [
        { id: "n", label: "The number", min: 1, max: 400, step: 1, value: 305, unit: "" },
        { id: "base", label: "The base (how many symbols)", min: 2, max: 10, step: 1, value: 10, unit: "" },
      ],
      toggles: [{ id: "nozero", label: "Write it without a symbol for zero", value: false }],
      draw: (v) => placeDraw(v),
      read(v) {
        const d = digitsIn(v.n, v.base), r = roman(v.n);
        const noz = d.filter((x) => x).join("");
        return "**In base " + v.base + ", " + v.n + " needs " + d.length + " digit" + (d.length > 1 ? "s" : "") + "**, and each digit's worth comes from its column alone. The Roman numeral " + r + " takes " + r.length + " symbols and has no columns, which is why Romans calculated on counting boards and only wrote the answer. " + (v.nozero && d.includes(0) ? "**Without a zero the columns collapse:** the page shows " + d.filter((x) => x).join(" ") + ", which reads just as well as " + noz + " (in base " + v.base + "). The empty place needs a mark of its own." : v.nozero ? "This number has no empty column, so it survives without a zero; try " + (v.base === 10 ? "305" : "a number with an empty column") + "." : "Switch off the zero to see what the empty column was doing.");
      },
    },
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

  sessions.push({
    id: "zero", primitive: "represent", domain: "mathematics", region: "India, Cambodia, Baghdad and Pisa", works: ["brahmasphuta", "liber-abaci"], requires: ["euler"],
    atoms: ["represent", "abstr", "compress"],
    title: "A symbol for nothing",
    hook: "Multiply XLVIII by XII without turning them into ordinary numbers. Where do you get stuck?",
    minutes: 24,
    why: "Place value with a zero is the most successful representation humans have invented: it turned calculation from a craft on counting boards into something anyone can do on paper, and it came to the world from South Asia, through Baghdad. It is mathematics as a representation you can feel, and history you can check.",
    capability: "Explain why position plus a symbol for an empty place makes arithmetic cheap, trace how the idea travelled from India and Cambodia through Baghdad to Europe, and spot where a missing or misplaced zero still causes real errors.",
    stakes: "Every tenfold medication error that comes from a lost decimal point or a missing zero is this session's subject, still happening.",
    bridge: "The missing step: the digits did not change arithmetic; position did. And position needs a way to say 'nothing in this column', or 48 and 408 look the same.",
    connection: "Season 2 showed that the log scale is a new sense. Place value is an older one: a representation that makes large numbers small enough to handle, and Euler's bridges showed how much a good representation hides and reveals.",
    vocab: {
      placevalue: { name: "place value", h: "A digit's worth depends on its column.", s: "قيمة الرقم على حسب مكانه: ٥ في خانة الآحاد غير ٥ في خانة المية.", t: "A positional numeral system: each position is worth a power of the base, and a digit multiplies that power." },
      placeholder: { name: "a placeholder zero", h: "A mark that says 'this column is empty'.", s: "الصفر هنا بيقول: الخانة دي فاضية، ما تشيلهاش.", t: "Zero used to keep positions apart (4_5 vs 405); distinct from zero as a number with its own arithmetic." },
      algorithm: { name: "algorithm", h: "A step-by-step method that always works.", s: "خطوات ثابتة لو مشيت عليها توصل للحل، والكلمة جاية من اسم الخوارزمي.", t: "A finite procedure; the word comes from 'Algoritmi', the Latin form of al-Khwarizmi's name." },
    },
    provenance: [
      { id: "brahmagupta", claim: "In the Brahmasphutasiddhanta (628 CE) Brahmagupta gave rules for computing with zero as a number (a number plus or minus zero is itself; a number times zero is zero) and stated, wrongly, that zero divided by zero is zero.", source: "MacTutor History of Mathematics, 'Brahmagupta'; checked by web search", year: "628", kind: "scholarship", license: "fact", grade: "A" },
      { id: "k127", claim: "The Khmer inscription K-127 from Sambor on the Mekong is dated 605 of the Śaka era (683 CE) and writes that year with a dot for zero; lost during the Khmer Rouge years, it was found again by Amir Aczel in 2013.", source: "Aczel A., Finding Zero (2015); Smithsonian Magazine and the Mathematical Association of America on the Cambodian zero; checked by web search", year: "683", kind: "scholarship", license: "fact", grade: "A" },
      { id: "gwalior", claim: "An inscription of 876 CE at the Chaturbhuj temple in Gwalior writes 270 and 50 with a round zero, often cited as the oldest dated round zero carved in stone in India.", source: "Standard histories of the numerals; descriptions of the Chaturbhuj temple inscription; checked by web search", year: "876", kind: "scholarship", license: "fact", grade: "A" },
      { id: "bakhshali", claim: "Radiocarbon dating commissioned by the Bodleian Library (2017) gave three different ranges for three folios of the Bakhshali manuscript (224–383, 680–779 and 885–993 CE); scholars including Plofker, Keller, Hayashi, Montelle and Wujastyk argued that the text should be dated by the latest folio, not the earliest.", source: "Bodleian Library announcement (2017); Plofker K. et al., 'The Bakhshālī Manuscript: A Response to the Bodleian Library's Radiocarbon Dating', History of Science in South Asia 5 (2017); checked by web search", year: "2017", kind: "scholarship", license: "fact", grade: "A", contested: "The date of the manuscript, and so whether it holds the oldest written zero, is disputed." },
      { id: "khwarizmi", claim: "Al-Khwarizmi wrote a treatise on calculating with Hindu numerals around 825 in Baghdad; it survives in a 12th-century Latin translation beginning 'Algoritmi…', from which the word 'algorithm' comes.", source: "Encyclopaedia Britannica, 'al-Khwarizmi'; checked by web search", year: "c. 825", kind: "scholarship", license: "fact", grade: "A" },
      { id: "fibonacci", claim: "Leonardo of Pisa (Fibonacci) introduced the Hindu-Arabic numerals and place value to European readers in the Liber Abaci of 1202, calling them the 'modus Indorum'.", source: "Standard histories; Liber Abaci (1202); checked by web search", year: "1202", kind: "primary", license: "public domain", grade: "A" },
      { id: "nothaft", claim: "The popular story that medieval Europe feared zero as satanic and that the Church banned the new numerals is unsupported at nearly every level; what did exist were practical restrictions, such as the Florentine money-changers' guild rule of 1299 on the numerals in account books.", source: "Nothaft C.P.E., 'Medieval Europe's satanic ciphers: on the genesis of a modern myth', British Journal for the History of Mathematics 35(2):107–136 (2020); checked by web search", year: "2020", kind: "scholarship", license: "fact", grade: "A", contested: "Popular histories still repeat the myth." },
      { id: "donotuse", claim: "The Joint Commission's 'Do Not Use' list forbids trailing zeros (X.0 mg) and the lack of a leading zero (.X mg) in medication orders, because a missed decimal point can cause a tenfold dosing error.", source: "The Joint Commission, Official 'Do Not Use' List; checked by web search", year: "2004–present", kind: "scholarship", license: "fact", grade: "A" },
      { id: "spreadsheet", claim: "Spreadsheet programs store an entry that looks like a number as a number, so leading zeros in codes (postal codes, phone numbers, IDs) disappear unless the cell is set to text.", source: "Documented spreadsheet behaviour (e.g. Microsoft Excel help on keeping leading zeros)", year: "2020s", kind: "scholarship", license: "fact", grade: "B" },
      { id: "numerals", claim: "The design exercise and the numbers in the model are original teaching material.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "z1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["numerals"], atoms: ["represent"], stem: "Multiply XLVIII by XII using only Roman numerals, without converting them. What makes it so hard?", alt: "In 48 × 12 you multiply 8 by 2 and know the answer goes in the ones column. What in XLVIII tells you which column anything belongs to?", options: [
        { t: "No symbol tells you which column it belongs to", ok: true, why: "In XLVIII the X is ten only because of what surrounds it; nothing gives each symbol a column. Written place value gives every digit its column, so multiplication becomes a small table plus bookkeeping." },
        { t: "Romans never learned their multiplication tables", bug: "surface", why: "They calculated well, on counting boards with pebbles in columns. The difficulty was writing, not knowing." },
        { t: "The Roman numerals for these numbers are simply too long to handle", bug: "scale", why: "Length is a symptom; 408 and CDVIII differ less in length than in what each symbol tells you." },
        { t: "There is no Roman numeral for five", bug: "irrelevant", why: "V is five; the trouble is elsewhere." },
      ] },
      { id: "z2", type: "scene", stage: "reveal", min: 2.5, src: ["numerals"], terms: ["placevalue", "placeholder"], title: "Position does the work", body: "In 408 each digit is worth its column: 4 hundreds, 0 tens, 8 ones. The digits are just labels; [[placevalue|position]] does the arithmetic. To multiply, you only need a table of single digits and a rule for carrying.\n\nBut position creates a new problem. If a column is empty, 408 and 48 look the same. Something has to hold the empty place: a [[placeholder|placeholder zero]]. Later came the harder step: treating zero as a number you can add, subtract and multiply.", reps: [{ kind: "story", label: "The counting board", body: "Roman and medieval merchants did have place value, on the counting board: pebbles in columns for ones, tens and hundreds. An empty column was simply empty. Only when calculation moved onto paper did the empty column need a written mark." }, { kind: "counterexample", label: "Place value without a zero", body: "Babylonian scribes wrote numbers in base 60 with place value long before any of this, and for centuries had no mark for an empty place: context had to tell the reader whether a number meant 1, 60 or 3,600. Position without zero works, badly." }] },
      { id: "z3", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["brahmagupta"], atoms: ["abstr"], stem: "In 628, the astronomer Brahmagupta wrote rules for calculating with zero as a number. Which of his rules would a mathematician today reject?", options: [
        { t: "Zero divided by zero is zero", ok: true, why: "Brahmagupta's one wrong rule, and an honest one: division by zero has no consistent answer, which took centuries more to see. His other rules are the ones you use today." },
        { t: "A number plus zero is the same number", bug: "rigid", why: "Correct, and still the rule: only division by zero breaks. Suspecting every rule that involves zero is the mistake." },
        { t: "A number multiplied by zero gives zero", bug: "rigid", why: "Correct, and still the rule: only division by zero breaks." },
        { t: "Zero subtracted from zero leaves zero", bug: "rigid", why: "Correct, and still the rule: only division by zero breaks." },
      ] },
      { id: "z4", type: "scene", stage: "reveal", min: 3, src: ["brahmagupta", "k127", "gwalior", "bakhshali", "khwarizmi", "fibonacci"], terms: ["algorithm"], title: "How nothing travelled", body: "Brahmagupta's rules (628) are the first known arithmetic of zero as a number. The oldest dated zero carved in stone is a dot in a Khmer inscription from the Mekong, dated 683; the oldest round zero carved in India is at Gwalior in 876, in the numbers 270 and 50.\n\nIn Baghdad around 825, al-Khwarizmi wrote a book on calculating with the Hindu numerals; its Latin translation began \"Algoritmi…\", and his name became the word [[algorithm|algorithm]]. In 1202 Leonardo of Pisa, Fibonacci, brought the \"method of the Indians\" to European merchants in his *Liber Abaci*.", reps: [{ kind: "diagram", label: "Five dates", svg: "zeroLine", body: "From India and Cambodia through Baghdad to Pisa." }, { kind: "counterexample", label: "A contested manuscript", body: "In 2017 the Bodleian Library announced that radiocarbon dating put the Bakhshali manuscript, full of zeros, in the 3rd or 4th century. Other scholars answered that the three folios tested gave three different dates, centuries apart, and that a manuscript is dated by its latest part. The claim of the \"oldest zero\" is disputed; both sides are on record." }] },
      { id: "z5", type: "model", stage: "model", min: 3, model: "place", src: ["numerals"], title: "Columns, and what the zero holds", body: "Choose a number and a base. Each column is worth the base times the column to its right. Then switch the zero off.", ask: "**Find** a number that survives without a zero and one that does not, and say what the difference is." },
      {
        id: "z6", type: "contrast", stage: "contrast", min: 2.5, src: ["nothaft", "numerals"], atoms: ["represent", "judgment"], title: "Two ways to add in Florence, 1300",
        left: { title: "The counting board", body: "Pebbles in columns on a lined board. Fast in skilled hands; when the sum is done, the pebbles are swept away and only the answer is written, in Roman numerals." },
        right: { title: "The new numerals on paper", body: "Each step of the sum stays on the page in Hindu-Arabic digits. Anyone can check it later, line by line." },
        q: { stem: "What did the written method add that the counting board already had in its columns?", options: [
          { t: "A record of the working that someone else can check", ok: true, why: "The board had place value; paper kept the calculation. That record had a risk too: the usual explanation for a Florentine guild's 1299 restriction of the new numerals in account books is that a 0 is easily turned into a 6 or a 9." },
          { t: "The idea of place value itself, which nobody had used before", bug: "omission", why: "The board already had columns; place value was in the pebbles." },
          { t: "Speed: paper was always faster than the board", bug: "surface", why: "Skilled board users were fast; the gain was the written record." },
          { t: "Protection from the Church, which feared zero", bug: "authority", why: "A popular myth: there was no church ban and no general fear of zero; the recorded restrictions were practical." },
        ] },
      },
      { id: "z7", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["donotuse"], atoms: ["represent", "judgment"], stem: "A handwritten order reads \".5 mg\" and another \"5.0 mg\". What does a safe prescriber write instead?", options: [
        { t: "“0.5 mg” and “5 mg”", ok: true, why: "A leading zero and no trailing zero, from the Joint Commission's list: a missed decimal point in .5 or 5.0 becomes a tenfold overdose (5 or 50)." },
        { t: "“.5 mg” and “5.0 mg”, written more neatly", bug: "surface", why: "Neater handwriting still loses the point on a fax, a crease or a tired reading." },
        { t: "“½ mg” and “5.0 mg”, avoiding the decimal point", bug: "irrelevant", why: "Fractions bring their own misreadings, and the trailing zero stays." },
        { t: "“0.50 mg” and “5.00 mg”, for precision", bug: "pretension", why: "Trailing zeros are exactly what the rule forbids in orders." },
      ] },
      { id: "z8", type: "q", kind: "far", stage: "far", min: 1.5, src: ["spreadsheet"], atoms: ["represent", "mech"], stem: "A clinic's spreadsheet shows patient ID 00731 as 731, and two records merge. What happened?", options: [
        { t: "The ID was stored as a number, so its zeros meant nothing", ok: true, why: "In a number, zeros on the left hold no place and are dropped. The ID is a label that only looks like a number: store it as text." },
        { t: "Someone typed the ID wrongly and should be retrained on data entry", bug: "agent", why: "It was typed correctly; the representation lost it, every time." },
        { t: "The file was damaged and needs restoring", bug: "posthoc", why: "Nothing broke; the program did what numbers do." },
        { t: "The program rounds all large numbers", bug: "linear", why: "731 is not large, and nothing was rounded: the zeros were never kept." },
      ] },
      {
        id: "z9", type: "forge", stage: "forge", min: 3, title: "A dose chart nobody can misread", body: "Four decisions for a chart the night nurse reads at 3 a.m.",
        slots: [
          { key: "lead", label: "Below one", options: [{ t: "always a leading zero: 0.5 mg", grade: "good", note: "The zero holds the point where it can't be missed.", say: "always a leading zero" }, { t: "the decimal alone: .5 mg", grade: "bad", note: "The Joint Commission forbids it.", say: "the bare decimal" }] },
          { key: "trail", label: "Whole numbers", options: [{ t: "never a trailing zero: 5 mg", grade: "good", note: "5.0 read without its point is 50.", say: "never a trailing zero" }, { t: "one decimal for neatness: 5.0 mg", grade: "bad", note: "Neat and dangerous.", say: "one decimal place" }] },
          { key: "units", label: "Units", options: [{ t: "written out where they could be confused (micrograms, units)", grade: "good", note: "Abbreviations like U and µg are misread too.", say: "units written out" }, { t: "the shortest abbreviation", grade: "weak", note: "Saves a second, risks a tenfold error.", say: "short abbreviations" }] },
          { key: "check", label: "Before giving", options: [{ t: "read the dose aloud with its unit", grade: "good", note: "A second representation, the spoken one, catches what the eye skipped.", say: "read the dose aloud with its unit" }, { t: "trust the chart", grade: "bad", note: "The chart is what fails.", say: "trust the chart" }] },
        ],
        template: "Below one: {lead}. Whole numbers: {trail}. Units: {units}. Before giving: **{check}**.",
        critique: { stem: "A colleague says the leading-zero rule is fussy: “everyone knows .5 means a half.” What is the best reply?", options: [{ t: "“Everyone who sees the point does; the rule is for the time it's missed”", ok: true, why: "Representations are designed for the worst reading, not the best." }, { t: "“It's the rule, so we follow it”", bug: "authority", why: "True, and it teaches nothing; the reason is what makes people keep it." }, { t: "“You're right, it's only for beginners”", bug: "confirm", why: "Experienced staff miss decimal points too; the errors are on record." }] },
      },
    ],
    challenge: { stem: "The zero in 408 is doing what job?", options: [{ t: "keeping the tens column empty", ok: true }, { t: "making the number bigger", bug: "surface" }, { t: "nothing: 408 and 48 are the same", bug: "omission" }] },
    hooks: [
      { id: "zero.h1", gap: 1, q: { stem: "What made written arithmetic cheap?", options: [{ t: "position, with a mark for an empty place", ok: true }, { t: "shorter symbols", bug: "surface" }, { t: "better multiplication tables, learned by heart", bug: "irrelevant" }] } },
      { id: "zero.h2", gap: 7, q: { stem: "Which of Brahmagupta's rules was wrong?", options: [{ t: "zero divided by zero is zero", ok: true }, { t: "a number times zero is zero", bug: "rigid" }, { t: "a number plus zero is itself", bug: "rigid" }] } },
      { id: "zero.h3", gap: 30, q: { stem: "A safe order for half a milligram reads…", options: [{ t: "0.5 mg", ok: true }, { t: ".5 mg", bug: "surface" }, { t: "0.50 mg", bug: "pretension" }] } },
    ],
    deeper: [
      { title: "The satanic zero that never was", body: "Popular histories say medieval Europe feared zero as the devil's number and that the Church banned the new numerals. The historian Philipp Nothaft traced the story in 2020 and found it unsupported at nearly every step. What did exist were practical rules: a Florentine money-changers' guild restricted the new numerals in its account books in 1299; the usual explanation is that a 0 could be turned into a 6 or a 9 with one stroke." },
      { title: "Why 'algorithm' is a man's name", body: "Al-Khwarizmi's book on Hindu reckoning survives only in Latin, opening \"Algoritmi…\" (\"thus spoke al-Khwarizmi\"). Readers took the name for the method, and the method became the word." },
      { title: "Open question", body: "Was the Khmer dot of 683 part of the same Indian system, or a local variant? The inscription uses the Indian Śaka era, which suggests one family of numerals across South and Southeast Asia; how the zero moved within it is not settled." },
    ],
  });

  sessions.push({
    id: "samarkand", primitive: "measure", domain: "science", region: "Samarkand (Uzbekistan), Central Asia", works: ["zij-sultani"],
    atoms: ["measure", "calib", "experiment", "represent"],
    title: "A scale the size of a hill",
    hook: "In the 1420s, astronomers in Samarkand measured the length of the year and were out by about a minute. They had no telescope. How?",
    minutes: 24,
    why: "Precision is not a gift of modern machines. A Timurid prince in Central Asia built an instrument you could walk inside, because the only way to read a smaller angle with the naked eye was to make the scale bigger. The same trade between size, repetition and hidden error decides how far you can trust every measurement you will ever take, including the ones on a ward.",
    capability: "Tell resolution, random error and systematic error apart, predict how instrument size and repetition change each, and place Samarkand's observatory in the history of science.",
    stakes: "A monitor that reads to one decimal place can still be wrong by ten. Knowing which kind of error you face tells you whether a better device, more readings, or a check against something independent will help.",
    bridge: "The missing step: an angle is a distance divided by a radius. If your eye can only tell marks a millimetre apart, the only way to read smaller angles is to put the marks further from the centre.",
    connection: "The wisdom session followed Greek astronomy into Baghdad. Five centuries later its heirs in Samarkand measured the sky better than anyone before the telescope, and their catalogue reached Europe too.",
    vocab: {
      resolution: { name: "resolution", h: "The smallest difference an instrument can show.", s: "أصغر فرق الجهاز يقدر يبيّنه: ميزان الأطفال بيقرا جرامات، ميزان العنبر بيقرا نص كيلو.", t: "The minimum distinguishable increment of a measuring system; for an angular scale, mark separation divided by radius." },
      systematic: { name: "systematic error", h: "An error that pushes every reading the same way.", s: "غلط ثابت في اتجاه واحد: لو الميزان مضبوط غلط، كل الأوزان هتطلع أتقل.", t: "Bias: a consistent offset that repetition cannot average away; detected only by comparison with an independent reference." },
      random: { name: "random error", h: "Scatter that goes both ways from reading to reading.", s: "لخبطة بتروح يمين وشمال، ولما تكرر القياس وتاخد المتوسط بتقل.", t: "Unbiased noise; the standard error of a mean falls as one over the square root of the number of readings." },
    },
    provenance: [
      { id: "observatory", claim: "Ulugh Beg, the Timurid ruler of Samarkand and grandson of Timur, built an observatory on a hill near the city in 1428–1429: a round, three-storey building about 46 metres across.", source: "Histories of the Ulugh Beg observatory (e.g. the Utrecht Ulugh Beg pages; standard encyclopedia entries); checked by web search", year: "1428–1429", kind: "scholarship", license: "fact", grade: "A" },
      { id: "fakhri", claim: "Its main instrument, the Fakhri sextant, was a curved scale set along the meridian, with a radius usually given as about 36 metres (some sources say 40).", source: "As above; Ulugh Beg, 'Prince of Stars' (arXiv 1804.08352); checked by web search", year: "1428–1429", kind: "scholarship", license: "fact", grade: "A", contested: "The radius is given as 36 m in most accounts and 40 m in others." },
      { id: "year", claim: "Ulugh Beg and his colleagues, including al-Kashi and Qadi Zada, gave the sidereal year as 365 days 6 hours 10 minutes 8 seconds, about 58 seconds longer than the modern value.", source: "Standard accounts of the observatory's results; checked by web search", year: "c. 1437", kind: "scholarship", license: "fact", grade: "A" },
      { id: "catalogue", claim: "The observatory's star catalogue, in the Zij-i Sultani, lists 1,018 stars.", source: "Standard accounts; checked by web search", year: "c. 1437", kind: "scholarship", license: "fact", grade: "A" },
      { id: "fate", claim: "Ulugh Beg was beheaded in 1449 on the order of his son Abd al-Latif, and the observatory was destroyed; the son was killed about six months later. The observatory's remains were found in 1908 by the archaeologist Vasily Vyatkin.", source: "Standard accounts of the Ulugh Beg observatory; checked by web search", year: "1449 / 1908", kind: "scholarship", license: "fact", grade: "A" },
      { id: "hyde", claim: "In 1665 Thomas Hyde, a young student of oriental languages at Oxford, printed Ulugh Beg's star catalogue in full with a Latin translation, one of the first Oxford books set in Arabic type.", source: "Hyde T., Tabulae Long. ac Lat. Stellarum Fixarum ex Observatione Ulugh Beighi (Oxford, 1665); checked by web search", year: "1665", kind: "primary", license: "public domain", grade: "A" },
      { id: "eye", claim: "Normal human visual acuity resolves about one minute of arc.", source: "Standard optometry (20/20 vision corresponds to about 1′)", year: "—", kind: "scholarship", license: "fact", grade: "A" },
      { id: "vlbi", claim: "Radio telescopes far apart can be combined so that they act as one instrument as wide as the distance between them; the Event Horizon Telescope used dishes across the Earth to image the shadow of a black hole (published 2019).", source: "Event Horizon Telescope Collaboration, Astrophysical Journal Letters 875 (2019)", year: "2019", kind: "scholarship", license: "fact", grade: "A" },
      { id: "scalecalc", claim: "The scale model computes the angle between two marks as their separation divided by the radius; its readings are original teaching material.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "s1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["fakhri", "eye"], atoms: ["measure"], stem: "Without a telescope, how could an astronomer in 1428 read the sun's position more finely than anyone before?", alt: "Your eye can tell two marks apart only if they are about a millimetre apart. Where would you put the marks?", options: [
        { t: "Build the scale so large that a tiny angle spans a visible distance", ok: true, why: "An angle is a distance over a radius. Make the radius about 36 metres and a small angle becomes centimetres of marble you can read." },
        { t: "Observe from the highest mountain, closer to the sky", bug: "irrelevant", why: "A few kilometres of height changes nothing about how finely a scale can be read." },
        { t: "Ask many observers to guess, then take the average of all the guesses", bug: "linear", why: "Averaging helps with random scatter, but no amount of guessing makes a coarse scale finer." },
        { t: "Use a more accurate clock", bug: "surface", why: "Timing matters for some observations, but the position was read off a scale; the scale was the limit." },
      ] },
      { id: "s2", type: "scene", stage: "reveal", min: 2.5, src: ["observatory", "fakhri", "year", "catalogue"], terms: ["resolution"], title: "An instrument you could walk inside", body: "On a hill outside Samarkand, Ulugh Beg, the grandson of Timur and ruler of the city, built a round observatory three storeys high and about 46 metres across (1428–1429). Its heart was cut into the hill: a curved track of marble set along the north–south line, about 36 metres in radius, the Fakhri sextant. At noon the sun's light fell through an opening onto the arc, and the astronomers read where it landed.\n\nThe size was the point. The finest angle a scale can mark is the gap between its marks divided by its radius: its [[resolution|resolution]]. With a radius dozens of times larger than a hand instrument, the same millimetre stood for a far smaller angle. The results: a catalogue of 1,018 stars, and a year of 365 days, 6 hours, 10 minutes and 8 seconds, about 58 seconds longer than the modern value.", reps: [{ kind: "analogy", label: "A longer ruler for angles", body: "A protractor the size of a coin can't show half a degree; one the size of a room can show a hundredth. Same eye, different radius." }, { kind: "counterexample", label: "Where size stops helping", body: "A bigger scale does nothing for errors that push every reading the same way: an arc set a little off the meridian, or the blur of the sun's own image." }] },
      { id: "s3", type: "model", stage: "model", min: 3, model: "scale", src: ["scalecalc", "eye"], terms: ["resolution"], title: "How big must the scale be?", body: "Set the radius of the scale and how close two marks can be for your eye to tell them apart.", ask: "**Find** the smallest radius at which a 2 mm scale beats the naked eye, and what doubling the radius does to the finest angle." },
      { id: "s4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["scalecalc"], terms: ["systematic"], atoms: ["measure", "calib"], stem: "Suppose the arc had been laid a little off the true north–south line, so every noon reading came out slightly early. What fixes that?", options: [
        { t: "Check it against something already known, like a known star", ok: true, why: "A systematic error pushes every reading the same way; only an independent reference shows it." },
        { t: "Making the scale even larger", bug: "linear", why: "A bigger scale reads the same biased angle more finely." },
        { t: "Taking many more readings every noon and averaging all of them", bug: "confirm", why: "Averaging cancels scatter in both directions; a bias in one direction survives any number of readings." },
        { t: "Nothing: an error in every reading cancels itself out", bug: "inversion", why: "It is the one kind of error that never cancels." },
      ] },
      {
        id: "s5", type: "contrast", stage: "contrast", min: 2.5, src: ["scalecalc"], terms: ["random", "systematic"], atoms: ["measure", "judgment"], title: "Three kinds of error, three remedies",
        left: { title: "Too coarse, or too noisy", body: "The marks are too far apart for the angle you need (resolution), or readings scatter both ways from day to day ([[random|random error]]). A bigger scale fixes the first; repetition shrinks the second." },
        right: { title: "Biased", body: "Every reading leans the same way: the arc slightly off line, or light bent by the air near the horizon. Neither size nor repetition touches it." },
        q: { stem: "Which remedy works on which error?", options: [
          { t: "Size for resolution, repetition for scatter, a reference for bias", ok: true, why: "Three different problems. Mixing up the remedies is how careful people end up precisely wrong." },
          { t: "Repetition fixes all three if you take enough readings", bug: "linear", why: "Repetition cannot make a scale finer, and it cannot remove a bias." },
          { t: "A bigger instrument fixes all three", bug: "surface", why: "Size sharpens the scale; it leaves scatter and bias alone." },
          { t: "Bias only matters in old instruments; modern devices are free of it", bug: "authority", why: "Every instrument can be biased; that is why devices are calibrated against references." },
        ] },
      },
      { id: "s6", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["scalecalc"], atoms: ["measure", "judgment"], stem: "A premature baby must gain about 15 g a day. The ward scale reads in steps of 50 g. What is the problem, and the fix?", options: [
        { t: "The steps are too coarse for the change; use a scale that reads grams", ok: true, why: "Resolution must be small compared with the change you are looking for; a 50 g step hides three days of growth." },
        { t: "Weigh the baby ten times in a row and average the readings on that scale", bug: "linear", why: "Averaging a coarse scale's readings gives a steadier coarse number; it cannot show changes smaller than its step." },
        { t: "Weigh at the same time every day, before feeds, to remove the bias", bug: "surface", why: "Good practice for another error; it does not fix the step size." },
        { t: "Nothing: 50 g is precise enough for any baby", bug: "rigid", why: "For a baby who should gain 15 g a day, it is not." },
      ] },
      { id: "s7", type: "q", kind: "far", stage: "far", min: 1.5, src: ["vlbi"], atoms: ["analogy", "measure"], stem: "In 2019 astronomers published an image of the shadow of a black hole, made by linking radio dishes on several continents. Why link dishes so far apart?", options: [
        { t: "Together they act like one Earth-wide dish, which resolves smaller angles", ok: true, why: "Samarkand's principle at planetary scale: the wider the instrument, the finer the angles it can separate." },
        { t: "To get closer to the black hole by spreading out over the planet", bug: "irrelevant", why: "A few thousand kilometres is nothing on that scale." },
        { t: "So that if one dish fails or is clouded over, another can take over", bug: "surface", why: "Redundancy is useful, but it is not why the image became possible." },
        { t: "To collect more light so that the image is brighter", bug: "linear", why: "More collecting area helps sensitivity; the separation of the dishes is what sharpens the image." },
      ] },
      {
        id: "s8", type: "forge", stage: "forge", min: 3, title: "Measure one thing well", body: "Pick something you measure often (blood pressure, your weight, your study hours) and design how to measure it so you can trust the change.",
        slots: [
          { key: "res", label: "Resolution", options: [{ t: "a step small compared with the change I care about", grade: "good", note: "Samarkand's rule: the scale must be finer than the change.", say: "a step finer than the change" }, { t: "whatever the device happens to show", grade: "weak", note: "You may be reading noise, or missing the change.", say: "whatever the device shows" }] },
          { key: "rep", label: "Repeats", options: [{ t: "two or three readings, averaged, at the same time of day", grade: "good", note: "Shrinks the random scatter.", say: "a few readings, averaged" }, { t: "one reading, taken whenever", grade: "bad", note: "One noisy reading can look like a change.", say: "one reading" }] },
          { key: "ref", label: "Check for bias", options: [{ t: "compare against an independent reference now and then", grade: "good", note: "Only a reference catches a bias.", say: "a check against a reference" }, { t: "trust the device's display", grade: "bad", note: "A biased device displays its bias confidently.", say: "trusting the display" }] },
          { key: "log", label: "Record", options: [{ t: "write each reading with its time", grade: "good", note: "The Samarkand catalogue is still used because it was written down.", say: "a written log" }, { t: "remember the trend", grade: "weak", note: "Memory smooths and flatters.", say: "memory" }] },
        ],
        template: "Measure with {res}, {rep}, **{ref}**, and keep {log}.",
        critique: { stem: "A friend's home blood-pressure cuff reads 5 mmHg higher than the clinic's every single time. What should they do?", options: [{ t: "Treat it as bias, and correct or recalibrate it against a reference", ok: true, why: "A consistent offset is a systematic error; repetition will only confirm it." }, { t: "Take ten times more readings at home to average it away", bug: "confirm", why: "The same bias appears in every reading; averaging keeps it." }, { t: "Trust the clinic's reading every time because clinics are never wrong", bug: "authority", why: "The clinic's device can be biased too; the point is to compare against a known reference." }] },
      },
    ],
    challenge: { stem: "Taking more readings reduces…", options: [{ t: "random scatter", ok: true }, { t: "a consistent bias", bug: "confirm" }, { t: "the coarseness of the scale", bug: "linear" }] },
    hooks: [
      { id: "samarkand.h1", gap: 1, q: { stem: "Why was the Fakhri sextant so large?", options: [{ t: "the same mark gap then means a smaller angle", ok: true }, { t: "so that it could be seen from anywhere in the city", bug: "irrelevant" }, { t: "to hold more astronomers at once", bug: "surface" }] } },
      { id: "samarkand.h2", gap: 7, q: { stem: "A bias that pushes every reading the same way is found by…", options: [{ t: "checking it against something already known", ok: true }, { t: "averaging many more readings of the same thing", bug: "confirm" }, { t: "a bigger instrument", bug: "linear" }] } },
      { id: "samarkand.h3", gap: 30, q: { stem: "Samarkand's year of 365 d 6 h 10 min 8 s was off by about…", options: [{ t: "a minute", ok: true }, { t: "a day", bug: "surface" }, { t: "an hour", bug: "surface" }] } },
    ],
    deeper: [
      { title: "What happened to it", body: "In 1449 Ulugh Beg was beheaded on his son's order and the observatory was pulled down; the son was himself killed within about six months. The building disappeared so completely that its site was found only in 1908, by the archaeologist Vasily Vyatkin. The part of the great arc cut into the rock survived below ground and can be visited in Samarkand." },
      { title: "The catalogue travelled", body: "Like the manuscripts of Timbuktu, the work survived in copies. Ulugh Beg's star tables were copied across the Islamic world, and in 1665 Thomas Hyde printed the catalogue at Oxford with a Latin translation, one of the first Oxford books set in Arabic type." },
      { title: "Open question", body: "How precise were the Samarkand measurements in practice, star by star? Modern analyses compare the catalogue with today's positions; the answer depends on the star and on which copy of the tables is used." },
    ],
  });

  sessions.push({
    id: "wayfinding", primitive: "search", domain: "science", region: "Micronesia, Hawaiʻi and Tahiti (Oceania)", works: ["hokulea"],
    atoms: ["prob", "strategy", "orient", "falsify"],
    title: "Finding an island with no instruments",
    hook: "In 1976 a double canoe sailed from Hawaiʻi to Tahiti, thousands of kilometres of open ocean, with no compass, chart or clock. How do you hit a speck of land when your aim is off by a few degrees?",
    minutes: 24,
    why: "The settlement of the Pacific is one of the great feats of human exploration, and for a long time outsiders called it an accident. The navigators' answer is a way of thinking you can use anywhere: when you cannot aim more precisely, make the target bigger.",
    capability: "Explain how Pacific navigators turned small islands into large targets, weigh the drift and navigation explanations against the evidence, and tell an existence proof from a historical proof.",
    stakes: "Every search under uncertainty, for a diagnosis, a missing patient, a job, is the same problem. Aiming harder at a point fails where widening the target succeeds.",
    bridge: "The missing step: an island is not only the land you can see. Birds that fish from it, clouds that form over it and swells it bends all reach far beyond its shore, so the target is many times wider than the island.",
    connection: "The film session met etak, the moving reference island of Micronesian navigators. Here are the navigators themselves, and the voyage that proved the old methods still worked.",
    vocab: {
      expand: { name: "expanding the target", h: "Making a small goal easier to hit by using the signs around it.", s: "بدل ما تنشن على نقطة صغيرة، وسّع الهدف بالعلامات اللي حواليه: الطيور والسحاب.", t: "Increasing the effective capture width of a destination with signs that extend beyond it (seabirds, cloud, swell), and aiming at island groups rather than single islands." },
      existence: { name: "an existence proof", h: "Showing something can be done, not that it was done that way.", s: "إثبات إن الحاجة ممكنة، مش إثبات إن الناس زمان عملوها بالطريقة دي.", t: "A demonstration that a possibility is real; it removes an 'impossible' objection without establishing the historical route." },
    },
    provenance: [
      { id: "hokulea", claim: "Hōkūleʻa, a double-hulled voyaging canoe of the Polynesian Voyaging Society, left Hawaiʻi on 1 May 1976, made landfall at Mataiva on 1 June and reached Papeʻete, Tahiti, on 4 June, where more than 17,000 people welcomed it. It was navigated without instruments by Mau Piailug of Satawal in Micronesia.", source: "Polynesian Voyaging Society (hokulea.com), 1976 voyage accounts; checked by web search", year: "1976", kind: "scholarship", license: "fact", grade: "A" },
      { id: "sharp", claim: "Andrew Sharp argued in Ancient Voyagers in the Pacific (1956) that the Pacific islands were settled by accidental drift voyages rather than deliberate navigation.", source: "Sharp A., Ancient Voyagers in the Pacific (1956); as discussed in reviews of Levison et al.; checked by web search", year: "1956", kind: "scholarship", license: "fact", grade: "A" },
      { id: "levison", claim: "Levison, Ward and Webb simulated more than 120,000 drift voyages with real winds and currents and found that the chance of a canoe drifting to Hawaiʻi from anywhere in Polynesia was nil.", source: "Levison M., Ward R. G. & Webb J. W., The Settlement of Polynesia: A Computer Simulation (1973); checked by web search", year: "1973", kind: "scholarship", license: "fact", grade: "A" },
      { id: "birds", claim: "Terns and noddies, which fly out from islands to fish, are found up to about twenty miles offshore, about twice the distance at which a low atoll can be seen; boobies range further. They give direction mainly at dawn, flying out, and at dusk, flying home.", source: "Te Ara Encyclopedia of New Zealand, 'Canoe navigation: locating land'; standard accounts of Pacific wayfinding; checked by web search", year: "—", kind: "scholarship", license: "fact", grade: "A" },
      { id: "blocks", claim: "Pacific navigators aimed at blocks of islands rather than single islands; once inside a block, signs of land led them to the one they wanted.", source: "Standard accounts of Pacific navigation (e.g. Lewis D., We, the Navigators, 1972); checked by web search", year: "1972", kind: "scholarship", license: "fact", grade: "A" },
      { id: "ellipse", claim: "Mars landers are targeted at a landing ellipse many kilometres long, chosen so the unavoidable errors of entry and descent still end on safe ground.", source: "NASA mission descriptions of landing ellipses (e.g. Curiosity, Perseverance)", year: "2012–2021", kind: "scholarship", license: "fact", grade: "A" },
      { id: "landcalc", claim: "The landfall model's numbers (16 km sighting, 32 km birds, 80 km between islands, errors that build up unchecked) are illustrative teaching material.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "w1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["blocks", "birds"], atoms: ["strategy", "prob"], stem: "You must reach one small atoll 2,000 km away. Your heading may be off by a few degrees, and a low atoll can only be seen from about 16 km. What do you aim for?", alt: "Work out how far a 3° error puts you off after 2,000 km, then compare it with 16 km.", options: [
        { t: "The whole island group, then its birds to find the one you want", ok: true, why: "A few degrees over 2,000 km can put you a hundred kilometres off. You cannot aim that well, so you aim at something that wide, then close in." },
        { t: "The atoll itself, holding your course more carefully than anyone", bug: "rigid", why: "No care makes a few degrees of error vanish; a single atoll is too small a target at that distance." },
        { t: "Nothing: let the currents carry you there", bug: "surface", why: "Drift is the theory the navigators disproved; currents go where they go, not where you need." },
        { t: "Wait on the shore until you can see the atoll from the beach itself", bug: "irrelevant", why: "At 2,000 km no island is visible from another." },
      ] },
      { id: "w2", type: "scene", stage: "reveal", min: 2.5, src: ["birds", "blocks"], terms: ["expand"], title: "An island is bigger than its shore", body: "A low atoll is visible from perhaps 16 km. But terns and noddies fly out from it every morning to fish, up to about twenty miles, and fly home at dusk. Seeing them at dawn or dusk tells you which way the land lies, and so the island's real size, as a target, doubles. Clouds that stand over islands and the way islands bend the ocean swell reach further still.\n\nNavigators therefore aimed not at a single island but at a block of islands spread across their path. That is [[expand|expanding the target]]: when you cannot make your aim more precise, you make what you are aiming at wider, and add the precision at the end.", reps: [{ kind: "analogy", label: "Etak again", body: "The film session's etak kept the canoe's position in mind by imagining a reference island moving past. Expanding the target is its partner: know roughly where you are, then make where you are going impossible to miss." }, { kind: "counterexample", label: "Where it fails", body: "Birds give direction only when they fly out and home; at midday a flock tells you land is near, not where. An isolated island with no neighbours, like the Hawaiian chain seen from far south, offers no block to aim at." }] },
      { id: "w3", type: "model", stage: "model", min: 3, model: "landfall", src: ["landcalc", "birds"], terms: ["expand"], title: "Widen the target", body: "Set the distance, how far off your heading may be, how many islands lie across your path, and whether you read the birds.", ask: "**Find** how much the chance of landfall rises when you read the birds, and when you aim at a chain of five instead of one island, at 2,000 km and 3°." },
      { id: "w4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["sharp", "levison"], atoms: ["falsify", "prob"], stem: "In 1956 a historian argued that the Pacific was settled by canoes drifting off course by accident. In 1973 researchers simulated over 120,000 drift voyages with real winds and currents. What did they find about drifting to Hawaiʻi?", options: [
        { t: "The chance was nil: Hawaiʻi had to be reached on purpose", ok: true, why: "Drift carried canoes to some places, but not to the remotest islands such as Hawaiʻi, New Zealand or Easter Island; deliberate navigation is the explanation that fits." },
        { t: "Drift reached Hawaiʻi often, confirming the accident theory", bug: "confirm", why: "The simulation found the opposite for Hawaiʻi." },
        { t: "Computers cannot say anything about ancient voyages", bug: "rigid", why: "A simulation with real winds and currents tests what drift can and cannot do; that is exactly what the drift theory claimed." },
        { t: "Drift and navigation are equally likely explanations", bug: "surface", why: "For the remotest islands the evidence was lopsided." },
      ] },
      { id: "w5", type: "scene", stage: "primary", min: 2, src: ["hokulea"], terms: ["existence"], title: "Hōkūleʻa, 1976", body: "On 1 May 1976 the voyaging canoe Hōkūleʻa left Hawaiʻi for Tahiti with no compass, no charts and no instruments. Its navigator was Mau Piailug, from the tiny atoll of Satawal in Micronesia, one of the last navigators trained in the old way. He read the rising and setting points of stars, the swells, the wind and the birds. On 1 June the crew made landfall at Mataiva in the Tuamotus; on 4 June more than 17,000 people welcomed the canoe into Papeʻete, one of the largest crowds ever gathered in Tahiti.\n\nThe voyage was built as a test: could the old methods carry a canoe that far, on purpose? They could. It is [[existence|an existence proof]]." },
      {
        id: "w6", type: "contrast", stage: "contrast", min: 2.5, src: ["hokulea", "levison"], terms: ["existence"], atoms: ["falsify", "judgment"], title: "What the voyage proves, and what it cannot",
        left: { title: "It shows", body: "Deliberate navigation across thousands of kilometres with traditional methods is possible. The claim that it could not be done is dead." },
        right: { title: "It cannot show", body: "Which routes the first settlers took, when, with which canoes, or how many voyages were lost. A modern crew with a master navigator is not the historical record." },
        q: { stem: "What kind of evidence is the 1976 voyage?", options: [
          { t: "Proof it could be done, not of how the first settlers did it", ok: true, why: "An existence proof removes the 'impossible' objection. The history still comes from archaeology, language, genetics and simulation, like the 1973 study." },
          { t: "Final proof of exactly how and when every part of Polynesia was settled", bug: "confirm", why: "It shows possibility, not the historical route." },
          { t: "No evidence at all, because it happened in modern times", bug: "rigid", why: "It is strong evidence against the claim that such voyages were impossible." },
          { t: "Evidence for drift, since the canoe followed winds and currents", bug: "inversion", why: "It was navigated to a chosen island; that is the opposite of drift." },
        ] },
      },
      { id: "w7", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["landcalc"], atoms: ["strategy", "prob"], stem: "On a busy ward you must not miss the patient who is quietly getting septic. The definitive test takes hours. What is the navigator's move?", options: [
        { t: "Wait for the definitive test on every patient before acting on anything", bug: "rigid", why: "Aiming only at the certain result means arriving late." },
        { t: "Watch the early signs that show up hours before the result", ok: true, why: "Widen the target: rising breathing rate, new confusion, a change in the obs are the birds, seen long before the island itself." },
        { t: "Order the definitive test on every patient every hour to be precise", bug: "linear", why: "Precision on a narrow target, at huge cost; the early signs are wider and faster." },
        { t: "Trust your first impression of each patient at the start of the shift", bug: "confirm", why: "One sighting, never updated: the opposite of reading signs as they appear." },
      ] },
      { id: "w8", type: "q", kind: "far", stage: "far", min: 1.5, src: ["ellipse"], atoms: ["analogy", "strategy"], stem: "Engineers landing a rover on Mars do not aim at a single point. They choose a landing ellipse many kilometres long. Why?", options: [
        { t: "Because they do not care where on Mars the rover lands", bug: "surface", why: "They care a great deal: the ellipse is chosen to be safe and scientifically useful." },
        { t: "Its errors can't be removed, so the target is made bigger than them", ok: true, why: "The navigators' logic on another planet: know your error, and pick a target larger than it." },
        { t: "Because a bigger landing zone lets the rover land faster and more gently", bug: "irrelevant", why: "Speed of landing has nothing to do with it." },
        { t: "Because pinpoint landing is forbidden by international law", bug: "authority", why: "No such law; the limit is physics and uncertainty." },
      ] },
      {
        id: "w9", type: "forge", stage: "forge", min: 3, title: "Expand a target of your own", body: "Pick something hard to hit with an uncertain path (a residency place, a research question, a patient you are worried about) and plan how to find it.",
        slots: [
          { key: "aim", label: "Aim at", options: [{ t: "a block: several places or outcomes that would all work", grade: "good", note: "The island group, not the single atoll.", say: "a block of good outcomes" }, { t: "one exact outcome, nothing else", grade: "weak", note: "One speck in the ocean: the error decides.", say: "one exact outcome" }] },
          { key: "signs", label: "Signs that reach further", options: [{ t: "early signs that show you are close, before you arrive", grade: "good", note: "The terns of your problem.", say: "early signs of nearness" }, { t: "only the final result", grade: "bad", note: "Seeing the atoll from 16 km, after the error has done its work.", say: "the final result only" }] },
          { key: "when", label: "Read them", options: [{ t: "when they carry direction, and write down what they say", grade: "good", note: "Birds give direction at dawn and dusk; know when your signs mean something.", say: "when they point somewhere" }, { t: "whenever you remember", grade: "weak", note: "A flock at midday says 'near', not 'where'.", say: "whenever" }] },
          { key: "fix", label: "Correct", options: [{ t: "adjust course each time a sign appears", grade: "good", note: "Small corrections stop the error building up.", say: "small corrections as signs appear" }, { t: "hold the first course no matter what", grade: "bad", note: "The drift theory's canoe.", say: "the first course, unchanged" }] },
        ],
        template: "Aim at {aim}, watch {signs}, read them {when}, and **make {fix}**.",
        critique: { stem: "A friend says aiming at a block of outcomes is lowering your standards. What is the best answer?", options: [{ t: "Aim at what you can hit, then add precision at the end", ok: true, why: "The navigators still reached one island; they just did not bet everything on the first aim." }, { t: "Standards do not matter when the ocean is large", bug: "moral", why: "They do; the question is how to meet them under uncertainty." }, { t: "They are right: a real expert always aims at one single exact point", bug: "authority", why: "Real experts in uncertain searches do the opposite." }] },
      },
    ],
    challenge: { stem: "When you cannot make your aim more precise, you can…", options: [{ t: "make the target wider", ok: true }, { t: "aim harder", bug: "rigid" }, { t: "stop correcting your course", bug: "inversion" }] },
    hooks: [
      { id: "wayfinding.h1", gap: 1, q: { stem: "Terns and noddies make an island a bigger target because…", options: [{ t: "they fly out from it about twenty miles to fish", ok: true }, { t: "they always fly straight towards the nearest passing ship", bug: "surface" }, { t: "they only ever nest on very large islands with high mountains", bug: "irrelevant" }] } },
      { id: "wayfinding.h2", gap: 7, q: { stem: "The 1973 drift simulation found the chance of drifting to Hawaiʻi was…", options: [{ t: "small enough to call nil", ok: true }, { t: "about one voyage in two", bug: "confirm" }, { t: "impossible to estimate at all", bug: "rigid" }] } },
      { id: "wayfinding.h3", gap: 30, q: { stem: "The 1976 voyage of Hōkūleʻa is best described as…", options: [{ t: "the historical route they used", bug: "confirm" }, { t: "proof it was possible", ok: true }, { t: "evidence for drift", bug: "inversion" }] } },
    ],
    deeper: [
      { title: "What a navigator reads", body: "The rising and setting points of stars on the horizon, used as a compass; the direction and shape of ocean swells, and how islands bend them; the colour of the sea and the sky; clouds that stand over land; and birds at dawn and dusk. None of it needs an instrument, all of it needs years of training." },
      { title: "Two voyages, one idea", body: "Samarkand's astronomers made their instrument larger to read smaller angles; Pacific navigators made their target larger because their aim could not get sharper. Both started by knowing the size of their error." },
      { title: "Open question", body: "How did the first voyagers find isolated islands such as Hawaiʻi, with no block of neighbours to aim at? Routes, timing and how many voyages were lost are still debated by archaeologists, linguists, geneticists and navigators." },
    ],
  });

  sessions.push({
    id: "maya", primitive: "represent", domain: "mathematics", region: "Mesoamerica (Mexico, Guatemala, Belize)", works: ["dresden-codex"], requires: ["zero"],
    atoms: ["represent", "compress", "measure", "model"],
    title: "Counting days for five thousand years",
    hook: "Across the ocean from India, with no contact at all, another people wrote a sign for 'nothing' and used it to count days across thousands of years. Who, and why did they need it?",
    minutes: 24,
    why: "The Americas built their own mathematics, astronomy and writing, and most schoolbooks give them a paragraph. The Maya invented a place-value count with a zero independently of India, tracked Venus for centuries, and wrote books that were burned almost to the last page. It is the same representation you met in the zero session, invented a second time for a different purpose.",
    capability: "Read a Maya Long Count date, explain why a positional count needs a zero wherever it is invented, see how the Venus table corrects a small error before it grows, and weigh what four surviving books can tell us.",
    stakes: "A small rounding error that no one corrects becomes a large one, in a calendar, a dosing schedule or a budget. And an archive that lost most of its books teaches you to ask what the survivors cannot say.",
    bridge: "The missing step: a count of days that runs for millennia needs places, and places need a mark for 'none here'. Any people that builds such a count meets the zero, whether or not they ever hear of India.",
    connection: "The zero session followed one zero from India through Baghdad to Pisa. Here is a second, invented on the other side of the world; and, as in Timbuktu, what survives shapes what we know.",
    vocab: {
      longcount: { name: "the Long Count", h: "A running count of days from a starting point thousands of years back.", s: "عدّاد أيام شغّال من نقطة بداية من آلاف السنين، مكتوب في خانات زي أرقامنا.", t: "A Mesoamerican positional day count with places of 1, 20, 360, 7,200 and 144,000 days (bak'tun.k'atun.tun.winal.k'in), anchored to a base date in 3114 BCE in the usual correlation." },
      shell: { name: "the shell sign", h: "The Maya mark for an empty place.", s: "علامة الصدفة: كانت عند المايا زي الصفر عندنا، تقول الخانة دي فاضية.", t: "A shell-shaped glyph (and head variants) used as a positional zero in Long Count and other counts." },
      venus: { name: "the Venus cycle", h: "How long Venus takes to return to the same place in the sky as seen from Earth.", s: "دورة الزهرة: المدة اللي بترجع فيها لنفس مكانها في سما الصبح أو المغرب.", t: "The synodic period of Venus, about 583.92 days on average; the Dresden Codex uses 584 with corrections." },
    },
    provenance: [
      { id: "longcount", claim: "The Mesoamerican Long Count writes a date as a count of days in five places worth 144,000, 7,200, 360, 20 and 1 days; the third place is 18 × 20 rather than 20 × 20. Its earliest known dates are from the first century BCE, on monuments at Chiapa de Corzo (36 BCE) and Tres Zapotes (32 BCE) in present-day Mexico.", source: "Standard accounts of the Long Count calendar (e.g. Coe, Breaking the Maya Code; reference works on Maya numerals); checked by web search", year: "36–32 BCE", kind: "scholarship", license: "fact", grade: "A", contested: "Which monument shows the oldest positional zero is argued: the Chiapa de Corzo date is fragmentary, and the Long Count probably began with neighbours of the Maya rather than the Maya themselves." },
      { id: "zeroamericas", claim: "The Maya, with the calendar tradition they inherited, used a positional zero written as a shell sign, invented independently of the Indian zero.", source: "Standard histories of numerals; checked by web search", year: "1st c. BCE–", kind: "scholarship", license: "fact", grade: "A" },
      { id: "venus", claim: "The Venus table of the Dresden Codex uses a Venus cycle of 584 days (the true average is about 583.92) and runs five cycles, 2,920 days, which equals eight 365-day years; the table includes corrections that keep it in step with Venus.", source: "Studies of the Dresden Codex Venus table (e.g. Lounsbury; Bricker & Bricker, Astronomy in the Maya Codices, 2011); checked by web search", year: "usually dated 11th–13th c.", kind: "scholarship", license: "fact", grade: "A" },
      { id: "landa", claim: "On 12 July 1562, at an auto-da-fé at Maní in Yucatán, the Franciscan Diego de Landa burned Maya books; by his own account he destroyed 27 hieroglyphic rolls and about 5,000 images.", source: "Landa's own report, as cited in histories of the Maní auto-da-fé; checked by web search", year: "1562", kind: "scholarship", license: "fact", grade: "A" },
      { id: "codices", claim: "Four Maya books survive: the Dresden, Madrid and Paris codices, and the Grolier Codex (Maya Codex of Mexico), whose authenticity was confirmed by a study published in 2016.", source: "Coe M. et al., 'The fourth Maya codex' (2016), and Brown University press release (2016); checked by web search", year: "2016", kind: "scholarship", license: "fact", grade: "A" },
      { id: "decipher", claim: "In 1952 Yuri Knorozov argued that many Maya signs stood for syllables; in 1960 Tatiana Proskouriakoff showed that the dates on the monuments of Piedras Negras marked the births, accessions and deaths of rulers, a sequence of seven rulers over about two centuries.", source: "Knorozov Y., 'Ancient writing of Central America', Sovetskaya Etnografiya (1952); Proskouriakoff T., American Antiquity 25:454 (1960); checked by web search", year: "1952 / 1960", kind: "scholarship", license: "fact", grade: "A" },
      { id: "lccalc", claim: "The Long Count converter computes the five places live; its examples are original teaching material.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "m1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["longcount", "zeroamericas"], atoms: ["represent"], stem: "The Maya wrote dates as a count of days since a starting point thousands of years earlier, in five places. What must such a count have that Roman numerals lacked?", alt: "Think of a count that has passed exactly one k'atun and no winals yet. What goes in the empty places?", options: [
        { t: "A sign that says a place is empty", ok: true, why: "Places need a mark for 'none here', or the other digits slide into the wrong columns: the zero, invented again." },
        { t: "Bigger symbols for bigger numbers, like M for a thousand", bug: "surface", why: "That is the Roman solution, and it breaks down for counts in the millions." },
        { t: "Ten digits, the same as ours", bug: "surface", why: "The Maya count used twenty as its main step, with their own digits; the base is not the point." },
        { t: "Nothing special, since days can simply be tallied", bug: "linear", why: "A million tally marks cannot be carved on a stela." },
      ] },
      { id: "m2", type: "scene", stage: "reveal", min: 2.5, src: ["longcount", "zeroamericas"], terms: ["longcount", "shell"], title: "The same idea, across an ocean", body: "The [[longcount|Long Count]] writes a date as a number of days in five places: bak'tun (144,000 days), k'atun (7,200), tun (360), winal (20) and k'in (1). Each place is worth twenty of the next, except the tun, worth 18 winals, so that one tun of 360 days stays close to a year. Monuments of the first century BCE, in what is now southern Mexico, already carry such dates.\n\nA count like this is impossible without a way to write an empty place, and the Maya had one: [[shell|the shell sign]]. It is the same representation you met in the zero session, invented with no contact with India. Two peoples who needed to count far met the same idea.", reps: [{ kind: "analogy", label: "An odometer for days", body: "A car's odometer rolls each wheel over into the next; the Long Count does the same, except that one wheel rolls at 18 instead of 20." }, { kind: "counterexample", label: "Where it is not like ours", body: "It is not a clean base twenty: the tun breaks the pattern for the calendar's sake. A system can be positional without being pure." }] },
      { id: "m3", type: "model", stage: "model", min: 3, model: "longcount", src: ["lccalc"], terms: ["longcount", "shell"], title: "Write days the Maya way", body: "Choose a number of days and see it in the five places, with the shell wherever a place is empty.", ask: "**Find** a count with an empty place in the middle, and the number of days one bak'tun holds." },
      { id: "m4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["longcount"], atoms: ["represent", "model"], stem: "In a pure base-twenty count the third place would be worth 400. In the Long Count it is worth 360. Why the change?", options: [
        { t: "So one unit of that place stays close to a year", ok: true, why: "A tun of 360 days is near the 365-day year. The representation bends to fit what it is for, as clocks count sixty seconds, not a hundred." },
        { t: "Because the Maya had not discovered the number 400", bug: "surface", why: "Four hundred appears in other Maya counts; the change is a choice." },
        { t: "Because a scribe made a mistake that everyone then copied for centuries", bug: "authority", why: "It is used consistently across centuries and cities; it is a design." },
        { t: "It makes no difference which value the third place has", bug: "irrelevant", why: "It changes every date; the value was chosen to track the year." },
      ] },
      { id: "m5", type: "scene", stage: "primary", min: 2.5, src: ["venus", "codices"], terms: ["venus"], title: "Venus in a book of bark", body: "One of the four Maya books that survive, the Dresden Codex, painted on bark paper, contains a table for the planet Venus. It treats the [[venus|Venus cycle]] as 584 days, and runs five cycles, 2,920 days, which is exactly eight 365-day years. The real average cycle is about 583.92 days, so the table slips a little each round; it carries corrections that pull it back into step, which is why it could be used across centuries.\n\nA round number that is almost right, corrected before the error grows: the same move the Samarkand astronomers made with their instruments, and the one every long-running schedule needs." },
      {
        id: "m6", type: "contrast", stage: "contrast", min: 2.5, src: ["landa", "codices"], atoms: ["judgment", "info"], title: "Four books, and a fire",
        left: { title: "What survives", body: "The Dresden, Madrid and Paris codices, and the Grolier Codex, confirmed genuine in 2016: almanacs, astronomy and ritual." },
        right: { title: "What burned", body: "At Maní in 1562 the friar Diego de Landa burned Maya books; by his own account, 27 hieroglyphic rolls. Others were lost to damp, war and time." },
        q: { stem: "What can the four survivors tell us about the books the Maya wrote?", options: [
          { t: "What survived, not what kinds of books were lost", ok: true, why: "Archive bias again, as in Timbuktu: four books may not be typical of a whole literature. Much of what we know comes from stone inscriptions instead." },
          { t: "Everything, since four books are enough to judge a whole literature", bug: "selection", why: "Four chance survivors are the survivors, not a sample." },
          { t: "That the Maya wrote only about astronomy and ritual", bug: "selection", why: "That is what survived in books; the monuments record history, as the decipherment showed." },
          { t: "Nothing, because the survivors might be forgeries", bug: "rigid", why: "Their authenticity has been tested; the last doubts, about the Grolier, were settled in 2016." },
        ] },
      },
      { id: "m7", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["venus"], atoms: ["measure", "model"], stem: "A clinic books a monthly injection as 'every four weeks'. Over a year, what happens, and what is the Venus-table fix?", options: [
        { t: "Thirteen doses a year, not twelve; schedule by the real month", ok: true, why: "Four weeks is 28 days, a month about 30.4: a small rounding error that adds a dose a year. The Dresden table's answer is to correct before the drift grows." },
        { t: "Nothing: four weeks and one month are exactly the same length", bug: "confirm", why: "They differ by two or three days, which is a whole dose in a year." },
        { t: "The error cancels itself out over the year", bug: "inversion", why: "It always pushes the same way, so it adds up." },
        { t: "Book every dose at random to spread the error", bug: "irrelevant", why: "The error is systematic; randomness does not remove it." },
      ] },
      { id: "m8", type: "q", kind: "far", stage: "far", min: 1.5, src: ["decipher"], atoms: ["model", "judgment"], stem: "For decades scholars held that Maya inscriptions recorded only calendars and gods. In 1960 Tatiana Proskouriakoff looked at the pattern of dates on the monuments of one city. What did she see?", options: [
        { t: "Spans that fit human lives: rulers' births, accessions and deaths", ok: true, why: "Gaps of the right size told her the dates were biographies: seven rulers over about two centuries. A pattern in the numbers changed what the texts were understood to be." },
        { t: "Dates that exactly matched eclipses, which proved they were astronomy", bug: "confirm", why: "That was the old reading; her pattern pointed the other way." },
        { t: "Dates that were random, which proved the script was decoration", bug: "rigid", why: "The dates were regular, and meaningful." },
        { t: "A Spanish translation that someone had carved next to each one", bug: "surface", why: "No such bilingual existed; she read the pattern itself." },
      ] },
      {
        id: "m9", type: "forge", stage: "forge", min: 3, title: "A count that stays true", body: "Design a way to keep a long-running count honest: your revision schedule to the exam, a medication calendar, a savings plan.",
        slots: [
          { key: "unit", label: "Unit", options: [{ t: "the true unit (days), converted only for display", grade: "good", note: "The Long Count counted days; the calendar was built on top.", say: "the true unit, days" }, { t: "a round unit that is almost right", grade: "weak", note: "Four weeks is not a month.", say: "an almost-right unit" }] },
          { key: "places", label: "Places", options: [{ t: "fixed places with an explicit zero when nothing happened", grade: "good", note: "An empty week written as 0 is information; a gap is not.", say: "fixed places with zeros" }, { t: "only write down when something happens", grade: "bad", note: "Gaps slide the record together, like 408 read as 48.", say: "entries only when things happen" }] },
          { key: "correct", label: "Correction", options: [{ t: "a scheduled check against the real calendar", grade: "good", note: "The Venus table's corrections.", say: "a scheduled correction" }, { t: "fix it when it is obviously wrong", grade: "bad", note: "By then the drift is a dose or a week.", say: "fixing it when obvious" }] },
          { key: "copy", label: "Keep", options: [{ t: "more than one copy, in different places", grade: "good", note: "Four books survived Maní; none survives with a single copy lost.", say: "copies in different places" }, { t: "one master copy", grade: "weak", note: "One fire.", say: "one master copy" }] },
        ],
        template: "Count in {unit}, with {places}, **{correct}**, and {copy}.",
        critique: { stem: "A friend's revision plan counts 'weeks until the exam' but skips weeks they did nothing. What goes wrong?", options: [{ t: "Empty weeks vanish, so the plan shows more time than is left", ok: true, why: "An empty place not written as zero slides the count, exactly the problem the shell sign solved." }, { t: "Nothing, because weeks with no study at all simply do not count towards anything", bug: "confirm", why: "They count on the calendar; the exam does not move." }, { t: "The plan becomes too detailed to follow", bug: "irrelevant", why: "Too little detail is the problem, not too much." }] },
      },
    ],
    challenge: { stem: "Any positional count that runs long enough needs…", options: [{ t: "a sign for an empty place", ok: true }, { t: "a base of ten", bug: "surface" }, { t: "a larger symbol for every larger number", bug: "surface" }] },
    hooks: [
      { id: "maya.h1", gap: 1, q: { stem: "The Maya sign for an empty place was…", options: [{ t: "a shell", ok: true }, { t: "a dot borrowed from India", bug: "surface" }, { t: "an empty circle, borrowed from the Spanish", bug: "surface" }] } },
      { id: "maya.h2", gap: 7, q: { stem: "The Long Count's third place (the tun) is worth…", options: [{ t: "360 days, close to a year", ok: true }, { t: "400 days, which is twenty times twenty", bug: "linear" }, { t: "365 days exactly", bug: "surface" }] } },
      { id: "maya.h3", gap: 30, poss: { "dresden-codex": "context" }, q: { stem: "The Dresden Codex's Venus table stays usable for centuries because it…", options: [{ t: "corrects its 584-day cycle before the error grows", ok: true }, { t: "uses the exact value of 583.92 days throughout", bug: "surface" }, { t: "was recopied by Spanish friars who fixed it", bug: "authority" }] } },
    ],
    deeper: [
      { title: "How the script was read", body: "In 1952 Yuri Knorozov argued that many Maya signs stand for syllables, not whole ideas; the script turned out to mix word signs and syllable signs. In 1960 Tatiana Proskouriakoff showed that the monuments of Piedras Negras record the lives of rulers. Together these opened Maya history to reading, and most inscriptions can now be read." },
      { title: "Three zeros", body: "Positional zero was invented in India (as the zero session showed), in Mesoamerica, and, as a placeholder, in late Babylonian astronomy. Each time the reason was the same: a count in places needs a way to say 'none here'." },
      { title: "Open question", body: "What did the burned books contain? Histories, poetry, medicine? The surviving four are almanacs and astronomy; the stone inscriptions are history. Whether whole genres were lost cannot be known from what survived, and that is the point of asking." },
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
