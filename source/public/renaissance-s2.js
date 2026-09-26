/* RENAISSANCE · Season 2 · Seeing structure.
 *
 * The capabilities OMEGA asked for that season 1 did not train: finding the three boxes (the constraint and the
 * minimum sufficient model), choosing the decisive question, thinking inside another era's knowledge (London 1854),
 * a new sense for doubling, blind taste comparisons with stated criteria, and an unlabelled boss world that needs
 * every earlier idea without saying which. Same content rules as season 1 (docs/RENAISSANCE/07_SEASON_1.md):
 * provenance per claim, no quotation from memory, toy models labelled, fictional cases labelled.
 */
(function () {
  "use strict";
  const C = { lime: "#d9ff43", cyan: "#66e9ff", pink: "#ff6e8a", green: "#5ef0a0", amber: "#ffd166", violet: "#b39cff", mut: "#8fa6c0", line: "#2f4a68", bg: "#0f1d2e", ink: "#e8eef6" };
  const svg = (w, h, inner, label) => '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "") + '" class="rnSvg">' + inner + "</svg>";
  const t = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" fill="' + ((o && o.c) || C.ink) + '" font-size="' + ((o && o.fs) || 12) + '" font-weight="' + ((o && o.fw) || 700) + '" text-anchor="' + ((o && o.a) || "middle") + '" font-family="Inter,system-ui,sans-serif">' + s + "</text>";
  const box = (x, y, w, h, c, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + (fill || C.bg) + '" stroke="' + c + '" stroke-width="1.6"/>';
  const defs = '<defs><marker id="rnArr2" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="' + C.mut + '"/></marker></defs>';
  const arrow = (x1, y1, x2, y2) => '<path d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '" stroke="' + C.mut + '" stroke-width="2" marker-end="url(#rnArr2)" fill="none"/>';
  const polyline = (pts, c, w, dash) => '<polyline points="' + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 2.4) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + "/>";
  // numbers a person reads aloud: 1,024 · 33 thousand · 1.1 million · 10¹⁸
  const big = (n) => {
    const sup = (k) => String(k).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join("");
    if (n < 1e4) return Math.round(n).toLocaleString("en-US");
    for (const [v, w] of [[1e12, "trillion"], [1e9, "billion"], [1e6, "million"], [1e3, "thousand"]]) if (n >= v && n < v * 1000) return (n / v < 10 ? Math.round((n / v) * 10) / 10 : Math.round(n / v)) + " " + w;
    return "about 10" + sup(Math.round(Math.log10(n)));
  };

  /* ═══════════════ VISUALS ═══════════════ */
  const visuals = {
    // three boxes in a line: the slowest sets the pace, the queue piles up in front of it
    threeBoxes: () =>
      svg(560, 170,
        defs + box(20, 50, 140, 70, C.cyan) + t(90, 78, "REGISTER") + t(90, 100, "30 / hour", { c: C.cyan }) +
          box(210, 50, 140, 70, C.amber, "#2a2410") + t(280, 78, "DOCTOR") + t(280, 100, "12 / hour", { c: C.amber }) +
          box(400, 50, 140, 70, C.cyan) + t(470, 78, "PHARMACY") + t(470, 100, "20 / hour", { c: C.cyan }) +
          arrow(160, 85, 208, 85) + arrow(350, 85, 398, 85) +
          [0, 1, 2, 3, 4, 5].map((i) => '<circle cx="' + (188 - (i % 3) * 8) + '" cy="' + (42 - Math.floor(i / 3) * 9) + '" r="3.5" fill="' + C.pink + '"/>').join("") + t(180, 22, "queue", { c: C.pink, fs: 10 }) +
          t(280, 150, "Everything flows at 12 an hour: the slowest box sets the pace", { c: C.lime, fs: 12 }),
        "Three steps in a line; the doctor at 12 an hour limits everything"),
    // a decision with and without an answer
    decisionTree: () => {
      const two = (x, y, w, c, a, b) => box(x, y, w, 40, c) + t(x + w / 2, y + 17, a, { fs: 11 }) + t(x + w / 2, y + 33, b, { c: c });
      return svg(560, 214,
        defs + box(10, 86, 120, 44, C.cyan) + t(70, 113, "open branch?") +
          '<circle cx="232" cy="62" r="20" fill="#2a2410" stroke="' + C.amber + '" stroke-width="1.6"/>' + t(232, 67, "?", { c: C.amber, fs: 15, fw: 900 }) + t(232, 98, "demand", { c: C.amber, fs: 10 }) +
          arrow(130, 98, 210, 68) + t(160, 70, "open", { c: C.mut, fs: 10 }) +
          two(330, 8, 170, C.green, "demand good", "+100") + two(330, 70, 170, C.pink, "demand poor", "−60") + two(330, 160, 170, C.mut, "don't open", "0") +
          arrow(252, 55, 328, 30) + arrow(252, 70, 328, 90) + arrow(130, 120, 328, 178) + t(215, 164, "don't open", { c: C.mut, fs: 10 }),
        "A choice (open or not), then chance (demand good or poor)");
    },
    // Snow's two water companies (per 10,000 houses, 1854)
    grandExp: () => {
      let s = t(150, 16, "Cholera deaths per 10,000 houses", { c: C.mut, fs: 12 }) + t(150, 32, "London 1854, by water company", { c: C.mut, fs: 11, fw: 600 });
      const y0 = 196, k = 0.44;
      [["Southwark &", "Vauxhall", 315, C.pink, "downstream"], ["Lambeth", "", 37, C.cyan, "upstream"]].forEach(([n1, n2, v, c, note], i) => {
        const x = 40 + i * 130;
        s += '<rect x="' + x + '" y="' + (y0 - v * k) + '" width="90" height="' + v * k + '" fill="' + c + '"/>' + t(x + 45, y0 - v * k - 6, v, { fs: 15 }) + t(x + 45, y0 + 17, n1, { fs: 12 }) + (n2 ? t(x + 45, y0 + 32, n2, { fs: 12 }) : "") + t(x + 45, y0 + (n2 ? 47 : 32), "intake " + note, { fs: 11, c: C.mut, fw: 600 });
      });
      return svg(300, 250, s, "315 versus 37 deaths per 10,000 houses");
    },
    // cluttered vs clean chart of the same four numbers
    chartBad: () => {
      const D = [["Ward A", 42], ["Ward B", 38], ["Ward C", 45], ["Ward D", 40]];
      let s = '<rect x="0" y="0" width="270" height="210" fill="#1b2433"/>';
      for (let g = 0; g < 10; g++) s += '<line x1="30" x2="250" y1="' + (30 + g * 16) + '" y2="' + (30 + g * 16) + '" stroke="#3a4a60"/>';
      D.forEach(([n, v], i) => {
        const x = 40 + i * 52, h = (v - 30) * 7;
        s += '<path d="M' + x + " " + (180 - h) + " l30 0 l10 -8 l-30 0 Z" + '" fill="#8f7fd9"/><rect x="' + x + '" y="' + (180 - h) + '" width="30" height="' + h + '" fill="' + ["#b39cff", "#66e9ff", "#ff6e8a", "#ffd166"][i] + '"/><path d="M' + (x + 30) + " " + (180 - h) + " l10 -8 l0 " + h + ' l-10 8 Z" fill="#555a7a"/>';
      });
      s += t(135, 200, "Fig. 1 — Comparative ward performance metrics (3D)", { fs: 9, c: C.mut });
      s += [0, 1, 2, 3].map((i) => '<rect x="' + (40 + i * 52) + '" y="10" width="8" height="8" fill="' + ["#b39cff", "#66e9ff", "#ff6e8a", "#ffd166"][i] + '"/>' + t(52 + i * 52, 18, "W" + "ABCD"[i], { fs: 8, a: "start" })).join("");
      return svg(270, 210, s, "A 3D bar chart with gridlines, a colour legend and no values");
    },
    chartGood: () => {
      const D = [["Ward C", 45], ["Ward A", 42], ["Ward D", 40], ["Ward B", 38]];
      let s = "";
      D.forEach(([n, v], i) => {
        const y = 30 + i * 40, w = (v - 30) * 9;
        s += t(70, y + 16, n, { a: "end", fs: 12 }) + '<rect x="80" y="' + y + '" width="' + w + '" height="24" fill="' + C.cyan + '"/>' + t(86 + w, y + 16, v + " min", { a: "start", fs: 12, c: C.lime });
      });
      s += t(135, 200, "Median wait, minutes (sorted)", { fs: 10, c: C.mut });
      return svg(270, 210, s, "Sorted horizontal bars with the values written at their ends");
    },
    labelBad: () => svg(270, 150, box(10, 10, 250, 130, C.pink) + ["WARNING: DO NOT MIX", "WITH OTHER MEDICINES.", "TAKE TWO TABLETS", "EVERY SIX HOURS.", "MAXIMUM EIGHT A DAY.", "KEEP AWAY FROM CHILDREN."].map((l, i) => t(135, 34 + i * 19, l, { fs: 12, fw: 900 })).join(""), "Every line in bold capitals"),
    labelGood: () => svg(270, 150, box(10, 10, 250, 130, C.cyan) + t(135, 42, "Max 8 tablets a day", { fs: 17, fw: 900, c: C.lime }) + t(135, 70, "2 tablets every 6 hours", { fs: 13, fw: 700 }) + t(135, 95, "Don't take with other medicines", { fs: 12, fw: 700, c: C.amber }) + t(135, 118, "Keep away from children", { fs: 11, fw: 600, c: C.mut }), "The dose limit largest, the dose next, the interaction warning in colour, the rest smaller"),
  };

  /* ═══════════════ MODELS ═══════════════ */
  const models = {
    // a serial line with three steps: throughput is the minimum; the queue builds in front of the constraint
    pipeline: {
      controls: [
        { id: "a", label: "Register (patients / hour)", min: 5, max: 40, step: 1, value: 30 },
        { id: "b", label: "Doctors (patients / hour)", min: 5, max: 40, step: 1, value: 12 },
        { id: "c", label: "Pharmacy (patients / hour)", min: 5, max: 40, step: 1, value: 20 },
      ],
      draw(v) {
        const arr = 25, caps = [v.a, v.b, v.c], names = ["REGISTER", "DOCTORS", "PHARMACY"], m = Math.min(arr, ...caps), k = caps.indexOf(Math.min(...caps));
        let s = defs + t(40, 22, "arrive 25 / h", { c: C.mut, fs: 11, a: "start" });
        caps.forEach((c, i) => {
          const x = 30 + i * 180, bott = i === k && Math.min(...caps) < arr;
          s += box(x, 40, 140, 70, bott ? C.amber : C.cyan, bott ? "#2a2410" : C.bg) + t(x + 70, 68, names[i], { fs: 12 }) + t(x + 70, 92, c + " / h", { c: bott ? C.amber : C.cyan });
          if (i < 2) s += arrow(x + 140, 75, x + 178, 75);
        });
        const q = Math.max(0, arr - Math.min(...caps));
        const qx = 30 + k * 180 - 26;
        for (let i = 0; i < Math.min(q, 24); i++) s += '<circle cx="' + (qx - (i % 4) * 8) + '" cy="' + (132 + Math.floor(i / 4) * 9) + '" r="3.2" fill="' + C.pink + '"/>';
        s += t(280, 190, "Through the whole line: " + m + " / hour", { c: C.lime, fs: 13 });
        if (q) s += t(280, 210, "the queue in front of " + names[k] + " grows by " + q + " every hour", { c: C.pink, fs: 12 });
        return svg(560, 222, s, "Three steps; the slowest limits the flow");
      },
      read(v) {
        const caps = [v.a, v.b, v.c], m = Math.min(25, ...caps), names = ["registration", "the doctors", "the pharmacy"], k = caps.indexOf(Math.min(...caps));
        const L = 20;
        return "Throughput: **" + m + " per hour**. " + (Math.min(...caps) < 25 ? "The constraint is **" + names[k] + "**: speeding up any other step changes nothing except where people wait. While 25 arrive and only " + m + " get through, the queue and every wait keep growing." : "No step is below the arrival rate: the line keeps up.") + " Little's law: if " + L + " people are waiting, each waits about **" + Math.round((60 * L) / Math.max(1, m)) + " minutes** (people waiting ÷ flow per hour).";
      },
    },
    // how much is a perfect answer worth? the most when you are nearest to indifference
    voi: {
      controls: [{ id: "p", label: "Your chance that demand is good", min: 0, max: 100, step: 1, value: 50, unit: "%" }],
      at(p) {
        const P = p / 100, open = 100 * P - 60 * (1 - P), best = Math.max(0, open), withInfo = 100 * P;
        return { open, best, vi: withInfo - best, choose: open > 0 ? "open" : "don't open" };
      },
      draw(v) {
        const x0 = 40, x1 = 540, y0 = 232, X = (p) => x0 + ((x1 - x0) * p) / 100, Y = (y) => y0 - y * 2.6;
        const pts = [];
        for (let p = 0; p <= 100; p++) pts.push([X(p), Y(this.at(p).vi)]);
        const r = this.at(v.p);
        let s = polyline(pts, C.amber, 2.6) + '<line x1="' + X(37.5) + '" x2="' + X(37.5) + '" y1="64" y2="' + y0 + '" stroke="' + C.mut + '" stroke-dasharray="4 4"/>' + t(X(37.5), 58, "either choice looks equal (37.5%)", { c: C.mut, fs: 10 });
        s += '<line x1="' + X(v.p) + '" x2="' + X(v.p) + '" y1="64" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2"/><circle cx="' + X(v.p) + '" cy="' + Y(r.vi) + '" r="5" fill="' + C.amber + '"/>';
        s += t(40, 18, "— what a perfect answer about demand is worth", { c: C.amber, fs: 11, a: "start" }) + t(40, 36, "— what an answer about the sign's colour is worth: 0 everywhere", { c: C.pink, fs: 11, a: "start" }) + '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '" stroke="' + C.pink + '" stroke-width="2"/>';
        s += t(x0, 254, "sure it's poor", { c: C.mut, fs: 10, a: "start" }) + t(x1, 254, "sure it's good", { c: C.mut, fs: 10, a: "end" });
        return svg(560, 264, s, "The value of an answer peaks where you are least sure which way to go");
      },
      read(v) {
        const r = this.at(v.p);
        return "Without asking you would **" + r.choose + "** (expected " + Math.round(r.best) + "). A perfect answer about demand is worth **" + Math.round(r.vi) + "** here. It is worth most where the two choices look equal, and nothing when you are already certain. A question about the sign's colour is worth 0 everywhere: no answer changes what you do.";
      },
    },
    // Snow's street: two companies' pipes down the same street
    street: {
      toggles: [{ id: "water", label: "Colour the houses by water company", value: false }],
      draw(v) {
        let s = t(280, 18, v.water ? "Same street, same air: coloured by who supplies the water" : "One street: same air, same drains, same people", { c: C.mut, fs: 11 });
        for (let i = 0; i < 20; i++) {
          const sv = [0, 2, 3, 5, 7, 8, 10, 11, 13, 15, 17, 18].includes(i), x = 20 + i * 26;
          const col = v.water ? (sv ? C.pink : C.cyan) : "#3b5877";
          s += '<path d="M' + x + " 80 l11 -14 l11 14 l0 30 l-22 0 Z" + '" fill="' + col + '"/>';
        }
        s += '<rect x="20" y="118" width="520" height="10" fill="#26405e"/>' + t(280, 146, "the street and its air", { c: C.mut, fs: 10 });
        if (v.water) s += t(160, 180, "Southwark & Vauxhall: 315 deaths per 10,000 houses", { c: C.pink, fs: 11 }) + t(420, 180, "Lambeth: 37", { c: C.cyan, fs: 11 });
        return svg(560, 196, s, "Houses on one street supplied by two companies");
      },
      read(v) {
        return v.water ? "The pipes of both companies ran down the same streets. Air, drains, class and crowding were shared; the **water** differed. Deaths followed the water company: **315 vs 37** per 10,000 houses." : "Anything about the street (smell, crowding, poverty) is the same for every house. So if deaths differ house by house on the same street, the cause is not the street. Switch on the colouring.";
      },
    },
    // linear vs logarithmic eyes on the same doubling process
    growth: {
      controls: [
        { id: "T", label: "Doubling time (days)", min: 1, max: 10, step: 1, value: 3 },
        { id: "d", label: "Day", min: 0, max: 60, step: 1, value: 30 },
      ],
      toggles: [{ id: "log", label: "Logarithmic scale (the new sense)", value: false }, { id: "cap", label: "A limit exists (S-curve)", value: false }],
      N(t, T, cap) {
        const e = Math.pow(2, t / T);
        return cap ? 1e6 / (1 + (1e6 - 1) / e) : e;
      },
      draw(v) {
        const x0 = 64, x1 = 540, y0 = 200, X = (d) => x0 + ((x1 - x0) * d) / 60;
        const maxN = this.N(60, v.T, v.cap), lmax = Math.log10(Math.max(10, maxN));
        const Y = (n) => (v.log ? y0 - (170 * Math.log10(Math.max(1, n))) / lmax : y0 - (170 * n) / maxN);
        const pts = [];
        for (let d = 0; d <= 60; d += 0.5) pts.push([X(d), Y(this.N(d, v.T, v.cap))]);
        const n = this.N(v.d, v.T, v.cap);
        let s = polyline(pts, C.cyan, 2.6) + '<line x1="' + X(v.d) + '" x2="' + X(v.d) + '" y1="24" y2="' + y0 + '" stroke="' + C.lime + '" stroke-width="2"/><circle cx="' + X(v.d) + '" cy="' + Y(n) + '" r="5" fill="' + C.lime + '"/>';
        s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y0 + '" y2="' + y0 + '" stroke="' + C.line + '"/>' + t(290, 224, "days →", { c: C.mut, fs: 10 }) + t(60, 22, v.log ? "log scale: each step up = ×10" : "ordinary scale", { c: C.mut, fs: 11, a: "start" });
        const ticks = v.log ? Array.from({ length: Math.floor(lmax) + 1 }, (_, k) => Math.pow(10, k)).filter((_, k, a) => a.length <= 7 || k % Math.ceil(a.length / 6) === 0) : [0, maxN / 2, maxN];
        for (const n2 of ticks) s += '<line x1="' + (x0 - 4) + '" x2="' + x0 + '" y1="' + Y(Math.max(1, n2)) + '" y2="' + Y(Math.max(1, n2)) + '" stroke="' + C.mut + '"/>' + t(x0 - 6, Y(Math.max(1, n2)) + 4, n2 < 1 ? "0" : big(n2).replace(" thousand", "k").replace(" million", "M").replace(" billion", "B").replace(" trillion", "T").replace("about ", ""), { c: C.mut, fs: 9, a: "end", fw: 600 });
        return svg(560, 232, s, "Growth over 60 days on an ordinary or logarithmic scale");
      },
      read(v) {
        const n = this.N(v.d, v.T, v.cap), end = this.N(60, v.T, v.cap);
        return "Day " + v.d + ": **" + big(n) + "** (day 60: " + big(end) + "). " + (v.log ? (v.cap ? "On the log scale the early part is a straight line — steady doubling — until the limit bends it flat." : "On the log scale steady doubling is a **straight line**: that is the new sense. A bend upward would mean it is speeding up; a bend down, slowing.") : "On the ordinary scale almost nothing seems to happen for most of the time, then everything happens at the end.");
      },
    },
    // cut the words that do no work; the meaning stays
    wordwork: {
      toggles: [
        { id: "a", label: "Cut “It is important to note that”", value: false },
        { id: "b", label: "“there has been a significant increase in the number of patients who are experiencing” → “more patients face”", value: false },
        { id: "c", label: "“delays in being seen” → “longer waits”", value: false },
        { id: "d", label: "“at the present time” → “now”", value: false },
      ],
      text(v) {
        let s = (v.a ? "" : "It is important to note that ") + (v.b ? "more patients face " : "there has been a significant increase in the number of patients who are experiencing ") + (v.c ? "longer waits " : "delays in being seen ") + (v.d ? "now." : "at the present time.");
        return s.charAt(0).toUpperCase() + s.slice(1);
      },
      draw(v) {
        const s = this.text(v), words = s.split(/\s+/).length;
        const lines = [];
        let cur = "";
        for (const w of s.split(" ")) (cur + " " + w).length > 62 ? (lines.push(cur), (cur = w)) : (cur = cur ? cur + " " + w : w);
        lines.push(cur);
        return svg(560, 60 + lines.length * 22, lines.map((l, i) => t(20, 34 + i * 22, l.replace(/&/g, "&amp;"), { a: "start", fs: 15, fw: 600 })).join("") + t(540, 34 + lines.length * 22 + 10, words + " words", { a: "end", c: words < 10 ? C.lime : C.amber, fs: 12 }), "The sentence as edited");
      },
      read(v) {
        const n = this.text(v).split(/\s+/).length;
        return n <= 6 ? "**" + n + " words, same claim.** Nothing the reader needed was removed: only words that did no work." : "**" + n + " words.** Try each cut: does any of them remove information the reader needs?";
      },
    },
    // the minimum sufficient model: fewest mechanisms that explain every symptom
    mechs: {
      toggles: [
        { id: "proxy", label: "Targets gamed (measure ≠ goal)", value: false },
        { id: "select", label: "Filtered feedback (who gets asked)", value: false },
        { id: "loop", label: "Delayed correction (budget loop)", value: false },
        { id: "base", label: "Rare condition, busy alarm (base rate)", value: false },
        { id: "neck", label: "A downstream constraint (discharge capacity)", value: false },
      ],
      S: [
        ["Stays 20% shorter, readmissions 30% higher", ["proxy", "neck"]],
        ["Survey scores up, complaints up", ["select"]],
        ["Bed numbers swing up and down each year", ["loop"]],
        ["Nurses ignore most sepsis alarms", ["base"]],
        ["Emergency patients wait for beds even at 98% on the 4-hour target", ["neck", "proxy"]],
      ],
      draw(v) {
        let s = "";
        this.S.forEach(([sym, by], i) => {
          const ok = by.some((m) => v[m]), y = 10 + i * 42;
          s += box(10, y, 540, 34, ok ? C.green : C.line) + t(30, y + 22, ok ? "✓" : "·", { c: ok ? C.green : C.mut, fs: 15, fw: 900 }) + t(50, y + 22, sym, { a: "start", fs: 12, fw: 600 });
        });
        return svg(560, 222, s, "Five symptoms, and which are explained by the switched-on mechanisms");
      },
      read(v) {
        const on = ["proxy", "select", "loop", "base", "neck"].filter((m) => v[m]), n = this.S.filter(([, by]) => by.some((m) => v[m])).length;
        return "**" + n + " of 5** symptoms explained with **" + on.length + "** mechanism" + (on.length === 1 ? "" : "s") + "." + (n === 5 && on.length === 4 ? " That is the minimum: four. Notice that the targets and the constraint can each cover the first and the last symptom, so two different four-mechanism models fit. When two models fit equally well, the next move is the observation that splits them (session 6): the next question does that." : n === 5 ? " All explained. One mechanism can go and all five stay explained: which?" : "");
      },
    },
  };

  /* ═══════════════ SESSIONS ═══════════════ */
  const sessions = [];

  /* ─── 7 · bottleneck ─── */
  sessions.push({
    id: "bottleneck", primitive: "neck", atoms: ["minimal", "systems", "constraint"],
    title: "Three boxes",
    hook: "A clinic registers 30 patients an hour, its doctors see 12, its pharmacy serves 20. It hires two more receptionists. How many more patients are treated per hour?",
    minutes: 23,
    why: "First in season 2 because it trains the skill you described as the goal: after two hours of discussion, drawing three boxes and pointing at the one that limits everything. It works in clinics, in your study, in any company.",
    capability: "Draw the few boxes a flow passes through, find the one that sets the pace, and ignore improvements anywhere else.",
    stakes: "Most effort in organisations (and in personal study plans) goes into improving steps that are not the constraint. It feels productive and changes nothing.",
    bridge: "The missing step: a patient can't leave faster than the slowest step lets them. Registration can process 30 an hour, but they then wait for doctors who can see only 12. Faster registration only makes the waiting room fuller.",
    connection: "Season 1's loops: the queue in front of the constraint is a stock that grows; the delay before it shows is why managers fix the wrong box.",
    vocab: {
      constraint: { name: "constraint (bottleneck)", h: "The slowest step, which sets the pace of the whole flow.", s: "أبطأ حتة في الطابور هي اللي بتحدد سرعة الكل.", t: "The resource whose capacity limits the throughput of a system." },
      throughput: { name: "throughput", h: "How many get all the way through per hour.", s: "كام واحد بيخلص للآخر في الساعة.", t: "The rate at which a system completes units of work." },
      little: { name: "Little's law", h: "People waiting = arrival rate × time each waits.", s: "عدد اللي مستنيين = معدل الدخول × وقت الانتظار.", t: "L = λW for any stable queueing system, regardless of arrival or service distributions." },
      minimal: { name: "minimum sufficient model", h: "The fewest parts that still explain what you see.", s: "أقل عدد صناديق يشرح الحكاية كلها.", t: "The simplest model that accounts for the observations relevant to a decision." },
    },
    provenance: [
      { id: "little", claim: "L = λW holds for any stable queue, whatever the distributions of arrivals and service.", source: "Little J.D.C., 'A Proof for the Queuing Formula: L = λW', Operations Research 9:383", year: "1961", kind: "scholarship", license: "fact", grade: "A" },
      { id: "goldratt", claim: "The Theory of Constraints: a system's output is set by its constraint, so improvement effort belongs there.", source: "Goldratt E. & Cox J., The Goal (a business novel) (not re-checked in this build)", year: "1984", kind: "scholarship", license: "fact", grade: "B" },
      { id: "clinic", claim: "The clinic, café and team examples are invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "n1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["clinic"], atoms: ["minimal", "constraint"], stem: "Register 30 an hour → doctors 12 an hour → pharmacy 20 an hour. The clinic hires two more receptionists so registration can do 50 an hour. How many more patients finish treatment per hour?", alt: "Follow one patient. Where does she wait longest?", options: [{ t: "None: the doctors still see only 12 an hour", ok: true, why: "The flow can't be faster than its slowest step. The new receptionists only fill the waiting room faster." }, { t: "About 20 more, since registration is 20 faster", bug: "notconstraint", why: "That would be true only if registration were the slowest step. It wasn't." }, { t: "Twice as many", bug: "surface", why: "No step doubled except one that wasn't limiting." }, { t: "A few more, because everything helps a little", bug: "notconstraint", why: "In a line, improving a non-constraint helps by exactly zero." }] },
      { id: "n2", type: "scene", stage: "reveal", min: 2.5, src: ["goldratt", "little"], terms: ["constraint", "throughput", "minimal"], title: "The three boxes", body: "Draw the flow as boxes. Write each box's capacity. The smallest number is the [[constraint|constraint]]: it sets the [[throughput|throughput]] of everything. Every other box has spare capacity, and speeding it up only moves where people wait.\n\nThat drawing is a [[minimal|minimum sufficient model]]: three boxes and three numbers answer the question that two hours of talk could not.", reps: [{ kind: "diagram", label: "The clinic", svg: "threeBoxes", body: "Registration and pharmacy both have spare capacity. The queue sits in front of the doctors." }, { kind: "analogy", label: "An analogy", body: "Pour water into a bottle through a funnel. The narrow neck, not the size of the jug, decides how fast the bottle fills. That's why it's called a bottleneck." }, { kind: "story", label: "Where the idea comes from", body: "Eliyahu Goldratt's business novel *The Goal* (1984) made this the 'Theory of Constraints': find the constraint, exploit it, subordinate everything else to it, then raise it. The rule is older than the book; the book made managers listen." }] },
      { id: "n3", type: "q", kind: "predict", stage: "predict", min: 1, atoms: ["constraint", "predict"], stem: "Now the clinic adds doctors until they can see 25 an hour. Where is the constraint?", options: [{ t: "The pharmacy, at 20 an hour", ok: true, why: "Fix the constraint and it moves to the next slowest step. That's normal: keep drawing the boxes." }, { t: "Nowhere: the problem is solved", bug: "omission", why: "20 is now the smallest capacity; the queue moves to the pharmacy." }, { t: "Still the doctors", bug: "consistency", why: "At 25 they are no longer the slowest." }] },
      { id: "n4", type: "model", stage: "model", min: 3, model: "pipeline", src: ["little"], terms: ["little"], title: "Move the capacities", body: "25 patients arrive each hour. Change any step and watch the flow and the queue.", ask: "**Find two things:** a change that does nothing, and the smallest change that raises the flow. Then read the waiting time: it comes from Little's law." },
      {
        id: "n5", type: "contrast", stage: "contrast", min: 2, src: ["clinic"], atoms: ["analogy", "minimal"], title: "An airport and a kitchen",
        left: { title: "Airport security", body: "ID check: 300 travellers an hour. Scanner: 150. Bag re-pack tables: 400. The airport buys faster ID readers." },
        right: { title: "A restaurant kitchen", body: "Prep cooks: 60 plates an hour. The single grill: 35. Plating: 80. The owner hires a third prep cook." },
        q: { stem: "What do both managers get wrong, and what would help?", options: [{ t: "Both improved a step with spare capacity; only the scanner and the grill set the pace, so only more scanning or more grilling raises the flow", ok: true, why: "Different worlds, same three boxes." }, { t: "Both should buy the most expensive equipment", bug: "surface", why: "Price has nothing to do with which box constrains." }, { t: "Both should make every step equally fast", bug: "notconstraint", why: "That wastes money on steps that were never limiting." }, { t: "Airports and kitchens can't be compared", bug: "surface", why: "The surfaces differ; the structure is identical." }] },
      },
      { id: "n6", type: "q", kind: "transfer", stage: "transfer", min: 2, atoms: ["minimal", "orient"], stem: "A team ships features slowly. Designers finish 6 designs a week, engineers build 5, one senior reviewer approves 2, testers check 8. Everyone argues about meetings and tools. What are the three boxes and the constraint?", options: [{ t: "Design → build → review → test; the reviewer at 2 a week limits everything", ok: true, why: "Two features a week is the ceiling until review capacity grows (a second reviewer, or smaller pieces to review)." }, { t: "Meetings → tools → morale; morale is the constraint", bug: "omission", why: "Those may matter, but they are not steps the work flows through; start with the flow." }, { t: "Engineers at 5: they are the most expensive", bug: "notconstraint", why: "Cost isn't capacity; 5 a week is more than the reviewer's 2." }, { t: "Testers at 8: testing always slows releases", bug: "surface", why: "They have the most spare capacity of all." }] },
      { id: "n7", type: "q", kind: "far", stage: "far", min: 1.5, src: ["little"], atoms: ["compress", "prob"], stem: "A café has, on average, 10 customers inside, and 20 come in each hour. How long does a typical customer stay?", options: [{ t: "30 minutes", ok: true, why: "Little's law: people inside = arrivals per hour × time each stays → 10 = 20 × W → W = half an hour. It works for cafés, hospitals, inboxes and queues of patients." }, { t: "2 hours", bug: "inversion", why: "That divides the wrong way round (20 ÷ 10)." }, { t: "10 minutes", bug: "surface", why: "The numbers don't support it." }, { t: "Impossible to know without timing people", bug: "omission", why: "The law gives it from two averages, no stopwatch needed." }] },
      {
        id: "n8", type: "forge", stage: "forge", min: 3, title: "Three boxes for your own week", body: "Your MCQ preparation is a flow too.",
        slots: [
          { key: "flow", label: "The flow", options: [{ t: "learn a topic → do its questions → review wrong ones", grade: "good", note: "A real flow with measurable rates.", say: "learn → questions → review" }, { t: "motivation → discipline → success", grade: "bad", note: "These aren't steps work moves through; you can't count them per day.", say: "motivation → discipline → success" }] },
          { key: "neck", label: "Which box is slowest for you now?", options: [{ t: "reviewing wrong answers (they pile up)", grade: "good", note: "A pile-up is the sign of a constraint.", say: "reviewing wrong answers" }, { t: "learning new topics", grade: "good", note: "Possible; check where things pile up.", say: "learning new topics" }, { t: "all of them equally", grade: "weak", note: "Rarely true; count items per day at each step.", say: "all of them" }] },
          { key: "act", label: "What you'll do", options: [{ t: "put the best hour of the day on that box only", grade: "good", note: "Exploit the constraint first, before adding anything.", say: "give the best hour of the day to that box" }, { t: "speed up the other two boxes", grade: "bad", note: "That grows the pile in front of the constraint.", say: "speed up the other boxes" }] },
          { key: "check", label: "How you'll know", options: [{ t: "count what comes out of the last box per day, before and after", grade: "good", note: "Throughput is the only honest measure of a flow.", say: "count finished items per day" }, { t: "how busy I feel", grade: "bad", note: "Busy steps are usually the non-constraints.", say: "how busy I feel" }] },
        ],
        template: "Flow: **{flow}**. Constraint: **{neck}**. Action: {act}. Check: {check}.",
        critique: { stem: "A week later the pile has moved to a different box. What does that mean?", options: [{ t: "Success: the constraint moved, as it should; draw the boxes again", ok: true, why: "Every improvement of the constraint creates a new one." }, { t: "Failure: go back to the old plan", bug: "consistency", why: "A moving constraint is the expected result of fixing one." }, { t: "Work harder on every box", bug: "notconstraint", why: "Effort on non-constraints is the original mistake." }] },
      },
    ],
    challenge: { stem: "A hospital lab processes 200 samples a day, but the only analyser handles 120. The hospital hires more sample collectors. What happens to results per day?", options: [{ t: "Nothing: the analyser at 120 is the constraint", ok: true }, { t: "They rise to 200", bug: "notconstraint" }, { t: "They fall", bug: "inversion" }] },
    hooks: [
      { id: "neck.h1", gap: 1, q: { stem: "In a flow of steps in a line, improving a step that is not the slowest usually…", options: [{ t: "changes nothing except where the queue forms", ok: true }, { t: "helps a little", bug: "notconstraint" }, { t: "helps a lot", bug: "surface" }] } },
      { id: "neck.h2", gap: 7, q: { stem: "An inbox holds on average 40 unanswered emails; you answer 20 a day. How long does a typical email wait?", options: [{ t: "About 2 days", ok: true }, { t: "Half a day", bug: "inversion" }, { t: "Can't know", bug: "omission" }] } },
      { id: "neck.h3", gap: 30, q: { stem: "You fixed the constraint and the queue appeared somewhere else. This means…", options: [{ t: "the constraint moved to the next slowest step", ok: true }, { t: "the fix failed", bug: "consistency" }, { t: "the system is random", bug: "omission" }] } },
    ],
    deeper: [
      { title: "The formal version", body: "For steps in series, throughput = min(capacities) (when arrivals exceed it). Little's law, L = λW, holds for any stable system: it connects how many are inside (L), how fast they arrive (λ) and how long each stays (W)." },
      { title: "Where the simple model breaks", body: "Variability matters: a step at 90% utilisation with irregular arrivals builds long queues even though it is 'not full'. In knowledge work the constraint moves often, and some 'steps' run in parallel, not in a line." },
      { title: "Open question", body: "How to find the constraint in systems where work isn't countable (research, art)? Proxies exist; none is reliable." },
    ],
  });

  /* ─── 8 · question ─── */
  sessions.push({
    id: "question", primitive: "voi", atoms: ["question", "judgment", "info"],
    title: "The decisive question",
    hook: "You may ask only one question before a big decision. How do you know which one?",
    minutes: 22,
    why: "Second because better questions compound: the person who asks the question whose answer would change the decision saves everyone the rest of the meeting. The rule is precise enough to use tonight.",
    capability: "Pick the question whose answer would change what you do, and skip the ones that are merely interesting.",
    stakes: "Most questions people ask before decisions are about things they already know or that wouldn't change the choice. Their answers feel like progress and change nothing.",
    bridge: "The missing step: an answer is only worth something if at least one possible answer would make you choose differently. If every possible answer leaves you doing the same thing, the question is decoration.",
    connection: "Season 1's falsify session chose the observation that splits hypotheses; this is the same idea for decisions: choose the question that splits choices.",
    vocab: {
      voi: { name: "value of information", h: "How much better your decision gets if you learn the answer.", s: "الإجابة تستاهل قد إيه هتغير قرارك.", t: "The difference in expected value between deciding with and without the information (Howard 1966)." },
      crux: { name: "decision-relevant uncertainty", h: "Something you don't know that could flip your choice.", s: "الحاجة اللي مش عارفها وممكن تقلب قرارك.", t: "An unresolved variable whose plausible values lie on both sides of a decision threshold." },
      indiff: { name: "point of indifference", h: "Where both choices look equally good to you.", s: "النقطة اللي الاختيارين فيها زي بعض.", t: "The probability at which the expected values of two actions are equal." },
    },
    provenance: [
      { id: "howard", claim: "Numerical values can be placed on reducing or removing an uncertainty by jointly considering probabilities and consequences.", source: "Howard R., 'Information Value Theory', IEEE Transactions on Systems Science and Cybernetics 2:22", year: "1966", kind: "scholarship", license: "fact", grade: "A" },
      { id: "q20", claim: "In a yes/no guessing game, a question that splits the remaining possibilities about in half gives the most information on average.", source: "Information theory (Shannon 1948); standard result", year: "1948", kind: "scholarship", license: "fact", grade: "A" },
      { id: "qex", claim: "The restaurant, founder and study examples are invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "q1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["qex"], atoms: ["question", "judgment"], stem: "A restaurant owner must decide this week whether to open a second branch. She already knows her rent, her savings, and that her regulars love the food. Which question should she ask first?", alt: "For each question, imagine the two most different possible answers. Would she decide differently?", options: [{ t: "Will enough people in the new neighbourhood pay her prices?", ok: true, why: "It's unknown, and one answer means 'open', the other 'don't': it can flip the decision." }, { t: "Do her regulars like her food?", bug: "confirm", why: "She already knows. A known answer can't change anything." }, { t: "What colour should the new sign be?", bug: "irrelevant", why: "No answer to it changes whether to open." }, { t: "What is the history of the building?", bug: "irrelevant", why: "Interesting, but neither answer changes the decision." }] },
      { id: "q2", type: "scene", stage: "reveal", min: 2.5, src: ["howard"], terms: ["voi", "crux"], title: "Three tests for a question", body: "A question is worth asking when **all three** hold:\n\n1. **You don't know the answer.**\n\n2. **Some possible answer would change what you do.** (That makes it a [[crux|decision-relevant uncertainty]].)\n\n3. **The difference between the choices matters.**\n\nDecision analysts call the gain the [[voi|value of information]] (Ronald Howard, 1966). You don't need the formula to use the three tests.", reps: [{ kind: "diagram", label: "The decision", svg: "decisionTree", body: "Open and demand is good: +100. Open and it's poor: −60. Don't open: 0. Only a question about demand can move you from one branch to another." }, { kind: "counterexample", label: "A fascinating question worth nothing", body: "“Why did the last tenant close?” feels deep. If every possible answer leaves her plan unchanged, it's worth nothing for **this** decision (it may matter for a different one)." }] },
      { id: "q3", type: "q", kind: "predict", stage: "predict", min: 1, atoms: ["info", "prob"], terms: ["indiff"], stem: "When is the question about demand worth the most to her?", options: [{ t: "When she's unsure, near the point where opening and not opening look equally good", ok: true, why: "Near the [[indiff|point of indifference]], a small push either way flips the choice; that's where an answer pays most." }, { t: "When she's already almost sure demand is good", bug: "confirm", why: "Then she opens anyway; the answer rarely changes anything." }, { t: "It's always worth the same", bug: "omission", why: "Its worth depends on how close she is to changing her mind." }] },
      { id: "q4", type: "model", stage: "model", min: 3, model: "voi", src: ["howard"], title: "Slide your certainty", body: "Move her belief about demand from 'sure it's poor' to 'sure it's good'.", ask: "Where does the answer become worth the most? Why is it worth zero at both ends?" },
      {
        id: "q5", type: "contrast", stage: "contrast", min: 2, src: ["qex"], atoms: ["question", "analogy"], title: "A founder and a student",
        left: { title: "A founder", body: "Before building a feature, she asks five customers **“Would you pay for this now, at this price?”**, not “Do you like the idea?” Everyone likes ideas; only one answer changes whether she builds." },
        right: { title: "A student, a week before an exam", body: "He asks **“Which topics do I get wrong on questions I have never seen?”**, not “Which topics are hardest?” The first answer decides where the last week goes; the second is a feeling." },
        q: { stem: "What makes both questions good?", options: [{ t: "Their possible answers lead to different actions, and neither person knew the answer yet", ok: true, why: "The three tests, passed." }, { t: "They are specific", bug: "surface", why: "Specific but irrelevant questions exist ('What colour is the sign?'). Specificity isn't the test." }, { t: "They are about money and exams", bug: "surface", why: "The topic is the surface." }, { t: "They sound professional", bug: "pretension", why: "How a question sounds has nothing to do with its value." }] },
      },
      { id: "q6", type: "q", kind: "transfer", stage: "transfer", min: 1.5, atoms: ["question", "judgment"], stem: "You're deciding whether to spend the last week before the exam on unseen mock papers or on re-reading notes. The decisive question?", options: [{ t: "How do I score on questions I've never seen, and which topics fail?", ok: true, why: "If unseen scores are high, re-reading adds little; if low, the failures show exactly what to re-read." }, { t: "Which method do top students recommend?", bug: "authority", why: "Their answer is about them, not your current state." }, { t: "How many pages of notes are left?", bug: "irrelevant", why: "Page count doesn't tell you where marks are lost." }] },
      { id: "q7", type: "q", kind: "far", stage: "far", min: 1.5, src: ["q20"], atoms: ["info", "question"], stem: "A game: guess an animal with yes/no questions. What's the best first question?", options: [{ t: "“Is it bigger than a cat?”", ok: true, why: "It splits the possibilities roughly in half, whatever the answer: the most information per question." }, { t: "“Is it a lion?”", bug: "irrelevant", why: "Almost always 'no', which tells you almost nothing." }, { t: "“Does it have a name?”", bug: "irrelevant", why: "Every answer is 'yes'." }, { t: "“Is it your favourite?”", bug: "irrelevant", why: "The answer doesn't narrow the animal much." }] },
      {
        id: "q8", type: "forge", stage: "forge", min: 3, title: "One question for a real decision", body: "Pick a decision you face this month.",
        slots: [
          { key: "dec", label: "The decision", options: [{ t: "how to split the last weeks before the exam", grade: "good", note: "Real and near.", say: "how to split the last weeks before the exam" }, { t: "whether to add a feature to UberBond", grade: "good", note: "Real and near.", say: "whether to add a UberBond feature" }, { t: "what to do with my life", grade: "weak", note: "Too big for one question; pick a decision with two options.", say: "what to do with my life" }] },
          { key: "crux", label: "The unknown that could flip it", options: [{ t: "my score on unseen questions / whether users would pay now", grade: "good", note: "Unknown, and it moves the choice.", say: "my score on unseen items, or users' willingness to pay now" }, { t: "whether I'm working hard enough", grade: "bad", note: "Not measurable, and it doesn't pick an option.", say: "whether I'm working hard enough" }] },
          { key: "cheap", label: "The cheapest way to get the answer", options: [{ t: "one timed mock / five direct asks with a price", grade: "good", note: "An hour of work for a decision-sized answer.", say: "one timed mock or five direct asks with a price" }, { t: "a month of research", grade: "weak", note: "The answer may arrive after the decision.", say: "a month of research" }] },
          { key: "thresh", label: "Decide in advance", options: [{ t: "“If the answer is below X, I do A; above, B.”", grade: "good", note: "Pre-commitment stops you reinterpreting the answer (session 1).", say: "a threshold set before asking" }, { t: "I'll see how I feel", grade: "bad", note: "Then any answer can be bent to what you wanted.", say: "no threshold" }] },
        ],
        template: "Decision: **{dec}**. Crux: {crux}. Get it by: {cheap}. Rule: {thresh}.",
        critique: { stem: "The answer comes back exactly at your threshold. What now?", options: [{ t: "Either choice is about as good: pick one quickly and stop spending time", ok: true, why: "At indifference the stakes of the choice itself are smallest." }, { t: "Ask ten more questions", bug: "irrelevant", why: "If the choices are near equal, more information has little value." }, { t: "Move the threshold to get the answer you wanted", bug: "confirm", why: "That's what the pre-set threshold exists to prevent." }] },
      },
    ],
    challenge: { stem: "A doctor can order one test. Whatever the result, she will give the same treatment. Is the test worth ordering for this decision?", options: [{ t: "No: no result changes the action", ok: true }, { t: "Yes: more information is always better", bug: "irrelevant" }, { t: "Only if it's cheap", bug: "omission" }] },
    hooks: [
      { id: "voi.h1", gap: 1, q: { stem: "A question is worth asking before a decision when…", options: [{ t: "you don't know the answer and some answer would change what you do", ok: true }, { t: "it's specific and detailed", bug: "surface" }, { t: "an expert would ask it", bug: "authority" }] } },
      { id: "voi.h2", gap: 7, q: { stem: "When is new information worth least?", options: [{ t: "When you're already nearly certain which option is best", ok: true }, { t: "When you're unsure", bug: "inversion" }, { t: "Never: it's always worth the same", bug: "omission" }] } },
      { id: "voi.h3", gap: 30, q: { stem: "In twenty questions, the best question…", options: [{ t: "splits the remaining possibilities about in half", ok: true }, { t: "guesses the most likely answer", bug: "irrelevant" }, { t: "is the most specific", bug: "surface" }] } },
    ],
    deeper: [
      { title: "The formula", body: "Value of perfect information = E[max over actions of payoff | answer] − max over actions of E[payoff]. Here: with p the chance of good demand, EV(open) = 100p − 60(1−p); VOI = 100p − max(0, 160p − 60), largest at p = 0.375." },
      { title: "Where it breaks", body: "Some questions are worth asking for later decisions, for learning, or for their own sake. The three tests are for one decision; don't let them kill curiosity everywhere else." },
    ],
  });

  /* ─── 9 · snow ─── */
  sessions.push({
    id: "snow", primitive: "possess", atoms: ["question", "falsify", "counter"],
    title: "London, 1854",
    hook: "It's 1854. Nobody has seen a cholera germ. In ten days about 500 people in one Soho district die. You may ask one question. What is it?",
    minutes: 25,
    why: "Third because it puts you inside an era's knowledge: you must reason with what a London doctor knew in 1854, not with what you learned in medical school. It uses the decisive question, selection and natural experiments at once.",
    capability: "Reason inside the evidence available at the time, choose the question that splits the theories, and separate a convincing story from the evidence that actually decided it.",
    stakes: "Hindsight makes every discovery look obvious. Feeling how the problem looked before the answer is how you learn to find answers nobody has yet.",
    bridge: "The missing step: both 'bad air' and 'something in the water' predict deaths in poor, smelly, crowded streets. Only something that differs between people breathing the **same** air can separate them.",
    connection: "Season 1's Vienna clinics: Snow, like Semmelweis, found a natural experiment where assignment had nothing to do with the outcome, here the water company piping each house.",
    vocab: {
      miasma: { name: "miasma theory", h: "The idea that disease comes from foul air.", s: "إن المرض جاي من الريحة الوحشة في الجو.", t: "The dominant 19th-century theory attributing epidemic disease to noxious air from decaying matter." },
      natexp2: { name: "natural experiment", h: "Life assigned people as a trial would.", s: "الدنيا قسمت الناس لوحدها، إنت بس تقارن.", t: "An observational comparison in which exposure is assigned as if at random." },
      posthoc: { name: "post hoc reasoning", h: "Assuming that what came after was caused by what came before.", s: "حصل بعدها، يبقى بسببها؟ مش شرط.", t: "The fallacy of inferring causation from temporal sequence (post hoc ergo propter hoc)." },
    },
    provenance: [
      { id: "soho", claim: "A cholera outbreak began in Soho on 31 August 1854; about 500 died in ten days, over 600 in all; deaths clustered around the Broad Street pump; brewery workers and workhouse residents, who used their own wells, largely escaped; the pump handle was removed on 8 September 1854; the well had been contaminated by a nearby cesspool.", source: "London Museum; yourgenome.org; Tulodziecki/PMC review of Snow (PMC7150208)", year: "1854", kind: "primary data", license: "fact", grade: "A" },
      { id: "decline", claim: "The outbreak was already declining before the handle was removed, which Snow himself acknowledged; his dot map appeared in the 1855 second edition of On the Mode of Communication of Cholera.", source: "John Snow Archive (Michigan State University); PMC7150208", year: "1854–55", kind: "scholarship", license: "fact", grade: "A" },
      { id: "grand", claim: "In 1854 Snow found 315 cholera deaths per 10,000 houses supplied by the Southwark & Vauxhall company (intake downstream) against 37 per 10,000 for Lambeth (intake moved upstream); pipes of both companies ran along the same streets.", source: "Snow J., On the Mode of Communication of Cholera, 2nd ed. (1855), via Smithsonian and Science History Institute accounts", year: "1855", kind: "primary data", license: "fact", grade: "A" },
      { id: "koch", claim: "Filippo Pacini described the cholera organism in 1854 without it being taken up; Robert Koch identified it in 1883–84.", source: "History of microbiology (not re-checked in this build)", year: "1854; 1883–84", kind: "scholarship", license: "fact", grade: "B" },
    ],
    steps: [
      { id: "w1", type: "scene", stage: "hook", min: 2.5, src: ["soho", "koch"], terms: ["miasma"], title: "What you know in 1854", body: "You are a London doctor. You know that cholera kills within hours, with torrents of watery diarrhoea. Most of your respected colleagues hold the [[miasma|miasma theory]]: disease rises from foul air over rotting matter and sewage. It explains a lot: cholera hits poor, crowded, stinking districts hardest.\n\nNobody you know has seen a germ that causes cholera. (An Italian, Pacini, has just described one in Florence, but no one in London has heard.) Water comes from street pumps and from private water companies that draw from the Thames.\n\nOn **31 August 1854**, in Soho, people start dying. About **500** die in ten days.", reps: [{ kind: "story", label: "One dissenter", body: "A physician named John Snow has argued since 1849 that cholera is **swallowed**, not breathed: that it passes in the water. Most of the profession thinks he is wrong." }] },
      { id: "w2", type: "q", kind: "predict", stage: "predict", min: 2, src: ["soho"], atoms: ["question", "falsify"], stem: "You may ask one question about the dead to test bad air against water. Which one?", alt: "Both theories predict deaths in the smelliest streets. What differs between people who breathe the same air?", options: [{ t: "Where did each of the dead get their drinking water?", ok: true, why: "People on the same street breathe the same air but may drink from different sources: the answers split the two theories." }, { t: "Did the dead live near a bad smell?", bug: "confirm", why: "Both theories predict yes: the pumps and the smells are in the same streets." }, { t: "How many died?", bug: "irrelevant", why: "The count is terrible, but it can't tell the theories apart." }, { t: "What do the leading physicians believe?", bug: "authority", why: "They believe miasma. That's the theory under test, not the evidence." }] },
      { id: "w3", type: "scene", stage: "reveal", min: 2.5, src: ["soho"], title: "What the answers showed", body: "Snow went door to door. The dead clustered around **one** street pump, on Broad Street. People who lived nearer another pump rarely died; some who died far away had walked to Broad Street because they preferred its water.\n\nTwo groups inside the danger zone barely suffered: workers at a **brewery**, who drank beer and water from the brewery's own well, and the inmates of a **workhouse** with its own well.\n\nOn **8 September** the parish removed the pump's handle. (Later investigation found a cesspool leaking into the well.)", reps: [{ kind: "counterexample", label: "The groups that didn't die", body: "Same street, same air, same poverty for the workhouse; different water. That single contrast does more than every death on the map." }] },
      { id: "w4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["decline"], terms: ["posthoc"], atoms: ["falsify", "causal"], stem: "After the handle was removed, new cases fell. Does that prove the pump caused the outbreak?", options: [{ t: "Not on its own: deaths were already falling before the handle came off (people had fled; the contamination may have passed). The strongest evidence was who drank from the pump and who didn't", ok: true, why: "Snow himself saw the outbreak was already declining. The story of the handle is dramatic; the comparison of drinkers and non-drinkers is the evidence." }, { t: "Yes: cases fell right after", bug: "posthoc", why: "They were already falling. 'After' is not 'because'." }, { t: "No: it shows the pump was harmless", bug: "inversion", why: "It shows nothing either way; the water comparison does the work." }] },
      { id: "w5", type: "model", stage: "model", min: 3, model: "street", src: ["grand"], terms: ["natexp2"], title: "The street with two water companies", body: "In south London, two companies piped water down the **same streets**: Southwark & Vauxhall drew from the Thames below the sewage outfalls; Lambeth had moved its intake upstream in 1852.", ask: "Before you colour the houses: if bad air caused cholera, would neighbouring houses on one street differ? Then switch on the colouring." },
      {
        id: "w6", type: "contrast", stage: "contrast", min: 2, src: ["grand"], atoms: ["analogy", "experiment"], title: "Vienna 1846, London 1854",
        left: { title: "Semmelweis (season 1)", body: "Women admitted to one clinic or the other by the **day** they arrived. Deaths followed the clinic, not the women." },
        right: { title: "Snow", body: "Houses supplied by one company or the other by **which pipe** ran to them, on the same streets. Deaths followed the company: **315 vs 37** per 10,000 houses.", svg: "grandExp" },
        q: { stem: "Why are both comparisons so convincing?", options: [{ t: "Who ended up in each group had nothing to do with their risk, so the difference points at the one thing that differed", ok: true, why: "Neither the day of arrival nor the pipe was chosen by sick or healthy people: a natural experiment." }, { t: "Both involved many deaths", bug: "surface", why: "Big numbers help with chance, not with the filter." }, { t: "Both men were doctors", bug: "authority", why: "Their authority persuaded few people at the time; the design persuades now." }, { t: "Both are about infections", bug: "surface", why: "The topic is the surface; the assignment is the mechanism." }] },
      },
      { id: "w7", type: "q", kind: "transfer", stage: "transfer", min: 1.5, atoms: ["question", "experiment"], stem: "After a wedding, 30 of 120 guests fall ill. What is the first thing to find out?", options: [{ t: "What each guest ate and drank, and compare the rates of illness for each dish between those who had it and those who didn't", ok: true, why: "It's the Broad Street question: what differs between the sick and the well who shared the same room." }, { t: "Which guests felt unwell first", bug: "irrelevant", why: "Timing helps later; alone it can't point at a cause." }, { t: "Whether the venue smelled bad", bug: "confirm", why: "Everyone shared the venue." }] },
      { id: "w8", type: "q", kind: "far", stage: "far", min: 1.5, atoms: ["question", "falsify"], stem: "A website's sign-ups dropped on Tuesday. Two theories: the new page design (shown to half the visitors) or a payment outage (hitting everyone). The decisive check?", options: [{ t: "Compare sign-ups between visitors who saw the new design and those who saw the old one, on the same day", ok: true, why: "The outage hit both groups; only the design differed between them. Same logic as the two water companies." }, { t: "Look at Tuesday's total", bug: "irrelevant", why: "Both theories predict the drop." }, { t: "Ask the designer", bug: "authority", why: "Opinions don't split the theories." }] },
      {
        id: "w9", type: "forge", stage: "forge", min: 3, title: "Your own outbreak", body: "Pick something that goes wrong for you on some days and not others.",
        slots: [
          { key: "prob", label: "The recurring problem", options: [{ t: "nights I sleep badly", grade: "good", note: "Countable, with good and bad days.", say: "bad-sleep nights" }, { t: "days I can't focus", grade: "good", note: "Countable if you define it (e.g. < 40 questions done).", say: "unfocused days" }, { t: "my whole personality", grade: "bad", note: "No cases and non-cases to compare.", say: "my personality" }] },
          { key: "expo", label: "What to record for every day, good and bad", options: [{ t: "exposures I suspect (caffeine after 6, screen after 12, training day)", grade: "good", note: "Record them for good days too: the non-cases are your workhouse.", say: "suspected exposures, every day" }, { t: "only what happened on bad days", grade: "bad", note: "Without the good days there's nothing to compare (selection).", say: "only the bad days" }] },
          { key: "kill", label: "What would show your favourite theory wrong", options: [{ t: "the exposure is just as common on good days", grade: "good", note: "Decided before looking.", say: "if the exposure is as common on good days" }, { t: "nothing: I'm sure it's the coffee", grade: "bad", note: "A theory that can't fail can't be tested.", say: "nothing" }] },
        ],
        template: "Problem: **{prob}**. Record: {expo}. Wrong if: {kill}.",
        critique: { stem: "After two weeks, bad nights follow late screens, but late screens also follow stressful days. What now?", options: [{ t: "Stress may be a confound: compare stressful days with and without late screens", ok: true, why: "Hold the third factor fixed, like the same street with different water." }, { t: "Conclude screens cause it", bug: "confound", why: "Stress could drive both." }, { t: "Give up: it's too complex", bug: "omission", why: "One more split usually untangles it." }] },
      },
    ],
    challenge: { stem: "Two villages share a market; only one has a new well. Diarrhoea falls in that village. The strongest extra check?", options: [{ t: "Compare households in the market village that use the new well with those that still use the old one", ok: true }, { t: "Ask villagers if they feel healthier", bug: "confirm" }, { t: "Count how many people live in each village", bug: "irrelevant" }] },
    hooks: [
      { id: "snow.h1", gap: 1, q: { stem: "Why was 'where did the dead drink?' a better question than 'did they live near a bad smell?'", options: [{ t: "Water differed between people sharing the same air; smell didn't", ok: true }, { t: "Smells can't be measured", bug: "omission" }, { t: "Snow was an expert on water", bug: "authority" }] } },
      { id: "snow.h2", gap: 7, q: { stem: "Cases fell after the pump handle was removed. The flaw in calling that proof?", options: [{ t: "Cases were already falling before; 'after' isn't 'because'", ok: true }, { t: "The pump was fine", bug: "inversion" }, { t: "There is no flaw", bug: "posthoc" }] } },
      { id: "snow.h3", gap: 30, q: { stem: "What made the Southwark & Vauxhall vs Lambeth comparison powerful?", options: [{ t: "Houses on the same streets got different water for reasons unrelated to their risk", ok: true }, { t: "It used thousands of houses", bug: "surface" }, { t: "It was published in a book", bug: "authority" }] } },
    ],
    deeper: [
      { title: "What people forget", body: "The famous dot map was published in 1855, after the handle came off; it illustrated the case more than it made it. The miasma camp had reasons: sanitation reform aimed at smells also removed sewage, and cholera did hit smelly districts." },
      { title: "Why it took decades", body: "Without a visible organism and a mechanism, the water theory looked like one story among several. Koch's identification of the bacterium (1883–84) supplied the mechanism." },
    ],
  });

  /* ─── 10 · double ─── */
  sessions.push({
    id: "double", primitive: "exp", atoms: ["scale", "represent", "predict"],
    title: "A new sense for doubling",
    hook: "Lily pads on a pond double every day and cover it on day 30. On what day is it half covered?",
    minutes: 21,
    why: "Fourth because human intuition is built for straight lines, and many things that matter (money, spread, technology, your own compounding skills) double. A log scale works like a new sense: steady doubling becomes a straight line you can see.",
    capability: "Recognise steady doubling, estimate doubling times in your head, and read growth on a log scale.",
    stakes: "People under-react to doubling processes early and over-react late. Seeing the shape early is the whole advantage.",
    bridge: "The missing step: doubling means yesterday was half of today. So the day before 'full' is 'half full', whatever the earlier history.",
    connection: "Season 1's reinforcing loops produce doubling; the limit that ends it is a balancing loop.",
    vocab: {
      expo: { name: "exponential growth", h: "Growing by the same percentage each step, so it doubles at regular intervals.", s: "بيكبر بنفس النسبة كل مرة، فبيتضاعف كل فترة ثابتة.", t: "Growth proportional to current size: N(t) = N₀·e^{rt}." },
      dtime: { name: "doubling time", h: "How long it takes to double.", s: "بياخد قد إيه عشان يبقى الضعف.", t: "T = ln 2 / r ≈ 0.693 / r." },
      r70: { name: "rule of 70", h: "Doubling time ≈ 70 ÷ the growth rate in percent.", s: "اقسم ٧٠ على النسبة تعرف هيتضاعف امتى.", t: "An approximation from ln 2 ≈ 0.693 for small percentage growth rates." },
      logs: { name: "logarithmic scale", h: "An axis where each step is ×10, so steady doubling looks like a straight line.", s: "محور كل خطوة فيه ×١٠، فالتضاعف يبان خط مستقيم.", t: "A scale on which equal distances represent equal ratios." },
      scurve: { name: "S-curve (logistic)", h: "Doubling that slows and flattens as it hits a limit.", s: "بيتضاعف لحد ما يخبط في السقف ويهدى.", t: "Logistic growth: N' = rN(1 − N/K)." },
    },
    provenance: [
      { id: "moore", claim: "In 1965 Gordon Moore projected components per chip doubling every year; in 1975 he revised it to about every two years.", source: "Moore G., 'Cramming more components onto integrated circuits', Electronics 38(8); Computer History Museum", year: "1965; 1975", kind: "primary", license: "fact", grade: "A" },
      { id: "ecoli", claim: "Under ideal laboratory conditions, E. coli can double in about 20 minutes.", source: "Microbiology textbooks (not re-checked in this build)", year: "—", kind: "scholarship", license: "fact", grade: "B" },
      { id: "math", claim: "Doubling-time arithmetic, the rule of 70 and the logistic curve.", source: "Mathematics", year: "—", kind: "original", license: "fact", grade: "A" },
    ],
    steps: [
      { id: "d1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["math"], atoms: ["scale", "predict"], stem: "The lily pads double every day and cover the pond on day 30. On what day is the pond half covered?", options: [{ t: "Day 29", ok: true, why: "Doubling means the day before full is half. The pond is under 1% covered until about day 23." }, { t: "Day 15", bug: "linear", why: "That's straight-line thinking: half the time for half the pond. Doubling doesn't work that way." }, { t: "Day 20", bug: "linear", why: "On day 20 it covers about 0.1%." }, { t: "Day 28", bug: "linear", why: "Day 28 is a quarter." }] },
      { id: "d2", type: "scene", stage: "reveal", min: 2.5, src: ["moore", "math"], terms: ["expo", "dtime", "r70"], title: "Why doubling fools us", body: "[[expo|Exponential growth]] adds the same **percentage** each step, so it doubles every fixed [[dtime|doubling time]]. Almost all of the change happens at the end: in the last 5 doublings the amount grows 32-fold.\n\nA quick tool: the [[r70|rule of 70]]. Growth of 7% a year doubles in about 70 ÷ 7 = **10 years**; 10% a year in about **7**.", reps: [{ kind: "numbers", label: "Counted", body: "1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1,024. Ten doublings multiply by about a thousand; twenty by about a million." }, { kind: "story", label: "A real doubling", body: "In 1965 Gordon Moore projected that the number of components on a chip would double every year; in 1975 he revised it to about every two years. For decades the industry roughly kept that pace, and your phone is the result." }, { kind: "counterexample", label: "Nothing doubles forever", body: "Bacteria can double every 20 minutes in a lab flask, but the flask runs out of food. Real growth usually becomes an [[scurve|S-curve]]." }] },
      { id: "d3", type: "q", kind: "predict", stage: "predict", min: 1, src: ["math"], atoms: ["scale", "compress"], stem: "Something grows 7% a year. About how long until it doubles?", options: [{ t: "About 10 years", ok: true, why: "70 ÷ 7 = 10." }, { t: "About 14 years", bug: "linear", why: "That's 100 ÷ 7: adding 7% of the original each year. Compounding is faster." }, { t: "About 7 years", bug: "surface", why: "That's for 10% a year." }, { t: "About 70 years", bug: "omission", why: "The rule divides 70 by the rate." }] },
      { id: "d4", type: "model", stage: "model", min: 3.5, model: "growth", src: ["math"], terms: ["logs", "scurve"], title: "Grow a new sense", body: "Watch the same process with ordinary eyes, then switch on the logarithmic scale.", ask: "**Find:** on the log scale, what does steady doubling look like? Then switch on the limit: where does the straight line bend?" },
      {
        id: "d5", type: "contrast", stage: "contrast", min: 2, src: ["moore", "ecoli"], atoms: ["analogy", "scale"], title: "Chips and cells",
        left: { title: "Chips", body: "Components per chip: about every two years ×2 (Moore, 1975)." },
        right: { title: "Bacteria in a flask", body: "E. coli in ideal lab conditions: about every 20 minutes ×2, until food runs out." },
        q: { stem: "What do they share, beyond 'both grow fast'?", options: [{ t: "Growth proportional to the current amount, so a constant doubling time (until a limit)", ok: true, why: "The time scales differ by a factor of 50,000; the shape is the same." }, { t: "Both are technology", bug: "surface", why: "One is biology." }, { t: "Both grow by the same amount each step", bug: "linear", why: "That's linear growth. They grow by the same **factor**." }, { t: "Both will never stop", bug: "omission", why: "The flask shows the limit; chips hit physical limits too." }] },
      },
      { id: "d6", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["math"], atoms: ["scale"], stem: "Savings grow 10% a year. About how long to go from 1,000 to 8,000?", options: [{ t: "About 21 years (three doublings of about 7 years)", ok: true, why: "1,000 → 2,000 → 4,000 → 8,000." }, { t: "About 70 years", bug: "linear", why: "That's adding 100 a year." }, { t: "About 8 years", bug: "surface", why: "That's one doubling and a bit." }] },
      { id: "d7", type: "q", kind: "far", stage: "far", min: 1.5, atoms: ["scale", "predict"], stem: "A rumour: the number who know it doubles every day, starting with one person. About how long until a thousand know?", options: [{ t: "About 10 days", ok: true, why: "2¹⁰ = 1,024. And a million only 10 days after that." }, { t: "About 500 days", bug: "linear", why: "That's one or two new people a day." }, { t: "About 100 days", bug: "linear", why: "Still straight-line thinking." }] },
      {
        id: "d8", type: "forge", stage: "forge", min: 2.5, title: "Spot a doubling in your life", body: "Pick one quantity and read it with the new sense.",
        slots: [
          { key: "q", label: "The quantity", options: [{ t: "questions I have mastered", grade: "good", note: "It can compound: each topic makes the next cheaper.", say: "questions mastered" }, { t: "UberBond users", grade: "good", note: "Word of mouth is a reinforcing loop.", say: "UberBond users" }, { t: "my height", grade: "bad", note: "Not a doubling process.", say: "my height" }] },
          { key: "plot", label: "How you'll look at it", options: [{ t: "weekly totals on a log scale", grade: "good", note: "A straight line means steady doubling; a bend shows speeding or slowing.", say: "weekly totals on a log scale" }, { t: "daily ups and downs on an ordinary scale", grade: "weak", note: "Noise hides the shape.", say: "daily changes" }] },
          { key: "limit", label: "What will bend it into an S-curve", options: [{ t: "the size of the bank / the size of the market", grade: "good", note: "Every doubling meets a ceiling; name it early.", say: "the size of the pool it grows into" }, { t: "nothing", grade: "bad", note: "Nothing real doubles forever.", say: "nothing" }] },
        ],
        template: "Quantity: **{q}**, read as {plot}; ceiling: {limit}.",
        critique: { stem: "The log plot of your users is a straight line, then bends downward. What does that mean?", options: [{ t: "Growth is slowing: you're approaching a limit (or the loop weakened)", ok: true, why: "A downward bend on log scale = the doubling time is getting longer." }, { t: "You're losing users", bug: "inversion", why: "A bend down on a log plot can still be growth, just slower." }, { t: "Nothing: it's still exponential", bug: "linear", why: "A straight line is exponential; a bend is not." }] },
      },
    ],
    challenge: { stem: "An investment doubles every 6 years. Roughly what yearly growth rate is that?", options: [{ t: "About 12%", ok: true }, { t: "About 17%", bug: "linear" }, { t: "About 6%", bug: "surface" }] },
    hooks: [
      { id: "exp.h1", gap: 1, q: { stem: "A pond is full on day 30 and the cover doubles daily. Half full on…", options: [{ t: "day 29", ok: true }, { t: "day 15", bug: "linear" }, { t: "day 25", bug: "linear" }] } },
      { id: "exp.h2", gap: 7, q: { stem: "On a log scale, steady doubling looks like…", options: [{ t: "a straight line", ok: true }, { t: "a curve bending up", bug: "linear" }, { t: "a flat line", bug: "omission" }] } },
      { id: "exp.h3", gap: 30, q: { stem: "3% a year doubles in about…", options: [{ t: "23 years", ok: true }, { t: "33 years", bug: "linear" }, { t: "3 years", bug: "surface" }] } },
    ],
    deeper: [
      { title: "The formal version", body: "N(t) = N₀·2^{t/T}. With continuous rate r, T = ln 2 / r ≈ 0.693 / r, hence the rule of 70 for percentages. Logistic growth: N' = rN(1 − N/K) looks exponential while N ≪ K." },
      { title: "Where it breaks", body: "Early in an S-curve you can't tell from the data alone where the limit is; forecasts made in the straight part are the least reliable." },
    ],
  });

  /* ─── 11 · taste ─── */
  sessions.push({
    id: "taste", primitive: "taste", atoms: ["taste", "compress", "judgment"],
    title: "Which is better, and why?",
    hook: "Two sentences say the same thing. One is clearly better. Can you see it before you can say why?",
    minutes: 22,
    why: "Fifth because intelligence without taste is incomplete, and taste can be trained blind: compare two versions, commit, then learn a criterion you can test. No authors, no prestige, no 'great because famous'.",
    capability: "See which of two versions communicates better, and name the criterion (a testable one, not a feeling).",
    stakes: "The people whose writing, slides and charts are clearest get their ideas adopted. Taste is also a perception: once you see clutter, you can't unsee it.",
    bridge: "The missing step: every word, line or colour costs the reader attention. If it carries no information, it's a tax. The better version is usually the one with less tax for the same content.",
    connection: "Session 7 (three boxes): cutting what doesn't carry information is finding the minimum sufficient model, applied to a sentence.",
    vocab: {
      concise: { name: "concision", h: "Saying the same thing in fewer words, with nothing lost.", s: "نفس المعنى بكلام أقل، ومفيش حاجة ضاعت.", t: "Economy of expression without loss of content or precision." },
      nominal: { name: "nominalisation", h: "Turning a verb into a noun ('make a decision' instead of 'decide').", s: "تحول الفعل لاسم فالجملة تطول وتتقل.", t: "The use of a noun form in place of a verb, typically adding words and hiding the actor." },
      stress: { name: "stress position", h: "The end of a sentence, where readers expect the important part.", s: "آخر الجملة هو المكان اللي القارئ مستني فيه المهم.", t: "The sentence-final position that readers weight most (Gopen & Swan 1990)." },
      dataink: { name: "data-ink", h: "The part of a chart that shows the numbers; the rest is decoration.", s: "الحبر اللي بيقول أرقام، والباقي زينة.", t: "The proportion of a graphic's ink devoted to non-redundant display of data (Tufte 1983)." },
    },
    provenance: [
      { id: "gopen", claim: "Readers expect the most important information at the end of a sentence (the stress position) and the context at the beginning.", source: "Gopen G. & Swan J., 'The Science of Scientific Writing', American Scientist 78:550 (not re-checked in this build)", year: "1990", kind: "scholarship", license: "fact", grade: "B" },
      { id: "tufte", claim: "Maximise the share of ink that shows data; remove decoration that carries no information.", source: "Tufte E., The Visual Display of Quantitative Information (not re-checked in this build)", year: "1983", kind: "scholarship", license: "fact", grade: "B" },
      { id: "cleveland", claim: "People judge position along a common scale more accurately than angles, areas or 3D volumes.", source: "Cleveland W. & McGill R., 'Graphical Perception', JASA 79:531 (not re-checked in this build)", year: "1984", kind: "scholarship", license: "fact", grade: "A" },
      { id: "pairs", claim: "All sentence, chart and label pairs are original, written for this session; the keys follow stated, testable criteria rather than authority.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "t1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["pairs"], atoms: ["taste", "compress"], stem: "Which sentence is better for a hospital report?", panels: [{ title: "Left", body: "It is important to note that there has been a significant increase in the number of patients who are experiencing delays in being seen at the present time." }, { title: "Right", body: "More patients now wait longer to be seen." }], options: [{ t: "Right: the same claim, with every word doing work", ok: true, why: "Left spends 20 extra words (28 against 8) on nothing the reader needs ('it is important to note that', 'at the present time')." }, { t: "Left: it sounds more professional", bug: "pretension", why: "Sounding official isn't information. Readers skim padded sentences and miss the point." }, { t: "Left: longer means more complete", bug: "surface", why: "It contains no fact that Right lacks." }, { t: "No real difference", bug: "omission", why: "Time the reading of each: the difference is real." }] },
      { id: "t2", type: "model", stage: "model", min: 3, model: "wordwork", src: ["pairs"], terms: ["concise", "nominal"], title: "Cut the words that do no work", body: "Switch on each edit and watch the word count.", ask: "Does any edit remove something the reader needed? Which phrase was a [[nominal|nominalisation]] hiding a verb?" },
      { id: "t3", type: "scene", stage: "reveal", min: 2.5, src: ["gopen", "tufte"], terms: ["stress", "dataink"], title: "Four criteria you can test", body: "1. **A concrete subject doing a concrete verb.** \"Patients wait\", not \"there has been an increase in waiting\".\n\n2. **Cut what does no work.** If removing a word loses nothing, it was a tax.\n\n3. **Put the new or important part at the end:** the [[stress|stress position]], where readers expect it.\n\n4. **In charts, spend ink on data:** the [[dataink|data-ink]] idea. Decoration the eye must process but that says nothing is clutter.\n\nThese aren't taste as opinion: each can be tested by how fast and how accurately readers get the point.", reps: [{ kind: "counterexample", label: "When longer is better", body: "\"The drug reduced deaths\" is short and wrong if it only reduced deaths **in adults under 60**. Precision beats brevity: cut padding, never conditions." }] },
      { id: "t4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["cleveland", "tufte"], atoms: ["taste", "represent"], stem: "Same four numbers, two charts. Which lets a reader compare the wards faster and more accurately?", panels: [{ title: "Left", svg: "chartBad" }, { title: "Right", svg: "chartGood" }], options: [{ t: "Right: sorted bars on one scale with the values written on them", ok: true, why: "People judge positions on a common scale accurately; 3D shading, a colour legend and gridlines make them work harder for nothing." }, { t: "Left: 3D looks more serious", bug: "pretension", why: "3D distorts lengths and adds nothing." }, { t: "Left: more colours carry more information", bug: "surface", why: "The colours just repeat the ward names, which you must decode through the legend." }, { t: "They're equal: the data is the same", bug: "omission", why: "Same data, different reading time and error rate." }] },
      {
        id: "t5", type: "contrast", stage: "contrast", min: 2, src: ["pairs"], atoms: ["taste", "analogy"], title: "A padded sentence and a cluttered chart",
        left: { title: "The sentence", body: "\"It is important to note that there has been a significant increase in…\"" },
        right: { title: "The chart", body: "3D bars, gridlines every few units, a colour legend, a title that names the figure instead of the finding." },
        q: { stem: "What single fault do they share?", options: [{ t: "They make the reader process material that carries no information", ok: true, why: "Padding in words, decoration in ink: the same tax." }, { t: "They're both too long", bug: "surface", why: "Length isn't the fault; empty length is." }, { t: "They're both unprofessional", bug: "pretension", why: "Both were probably made to look professional. That's the problem." }] },
      },
      { id: "t6", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["pairs"], atoms: ["taste", "judgment"], stem: "A medicine label will be read by a tired parent at 3 am. Which label is better?", panels: [{ title: "Left", svg: "labelBad" }, { title: "Right", svg: "labelGood" }], options: [{ t: "Right: one line is clearly the most important, so the eye knows where to start", ok: true, why: "When everything is shouted, nothing is. Hierarchy is information." }, { t: "Left: capitals are more serious", bug: "pretension", why: "All-caps bold everywhere removes the one signal that matters most: which line to read first." }, { t: "Left: it carries the same information", bug: "surface", why: "The information matches; how fast a tired reader finds the dose limit does not." }] },
      { id: "t7", type: "q", kind: "far", stage: "far", min: 1.5, src: ["gopen"], atoms: ["taste", "compress"], stem: "The title of a slide showing Semmelweis's 1847 data. Which is better?", options: [{ t: "\"Hand-washing cut deaths from 18% to 2% within two months\"", ok: true, why: "The title is the finding. A viewer who reads only titles still gets the talk." }, { t: "\"Results\"", bug: "omission", why: "It names the slide instead of saying anything." }, { t: "\"A comprehensive overview of the mortality outcomes observed\"", bug: "pretension", why: "Long, official, and still says nothing." }] },
      {
        id: "t8", type: "forge", stage: "forge", min: 2.5, title: "Edit a real sentence", body: "A sentence from a student's case presentation: \"In terms of the patient's history, it was the case that he had been experiencing chest pain which was of a crushing nature for a duration of approximately two hours.\"",
        slots: [
          { key: "subj", label: "Start with", options: [{ t: "the patient and a verb: \"He has had…\"", grade: "good", note: "Concrete subject, concrete verb.", say: "He has had" }, { t: "\"In terms of the history…\"", grade: "bad", note: "Throat-clearing: the reader waits for the point.", say: "In terms of the history" }] },
          { key: "core", label: "The core", options: [{ t: "\"crushing chest pain for about two hours\"", grade: "good", note: "Every word carries clinical information.", say: "crushing chest pain for about two hours" }, { t: "\"pain of a crushing nature for a duration of approximately\"", grade: "bad", note: "Nominalisations and filler.", say: "pain of a crushing nature for a duration of approximately" }] },
          { key: "end", label: "What goes last (stress position)", options: [{ t: "the most important clinical fact", grade: "good", note: "End on what the listener must remember.", say: "the key fact last" }, { t: "whatever was said first in the notes", grade: "weak", note: "The notes' order isn't the listener's priority.", say: "the notes' order" }] },
        ],
        template: "**{subj} {core}** — and {end}.",
        critique: { stem: "A colleague says your short version sounds too casual for a presentation. The best answer?", options: [{ t: "It keeps every clinical fact and is faster to follow; formality comes from precision, not padding", ok: true, why: "Criteria you can test beat a feeling of formality." }, { t: "Add the padding back to be safe", bug: "pretension", why: "Padding costs the listener attention." }, { t: "Remove the duration too", bug: "omission", why: "Duration is clinical information: never cut conditions." }] },
      },
    ],
    challenge: { stem: "Which is the better sentence? A: \"The committee made a decision to implement a reduction of costs.\" B: \"The committee decided to cut costs.\"", options: [{ t: "B: same meaning, verbs instead of nominalisations", ok: true }, { t: "A: more formal", bug: "pretension" }, { t: "Equal", bug: "omission" }] },
    hooks: [
      { id: "taste.h1", gap: 1, q: { stem: "What makes a sentence 'padded'?", options: [{ t: "Words that could be removed without losing anything the reader needs", ok: true }, { t: "Being longer than ten words", bug: "surface" }, { t: "Using technical terms", bug: "pretension" }] } },
      { id: "taste.h2", gap: 7, q: { stem: "Why are sorted bars with values usually better than a 3D pie chart?", options: [{ t: "People compare positions on a common scale more accurately than angles or 3D shapes", ok: true }, { t: "Bars look more modern", bug: "surface" }, { t: "Pie charts are always wrong", bug: "omission" }] } },
      { id: "taste.h3", gap: 30, q: { stem: "Where should the most important part of a sentence usually go?", options: [{ t: "At the end", ok: true }, { t: "In brackets", bug: "surface" }, { t: "At the start, always", bug: "consistency" }] } },
    ],
    deeper: [
      { title: "Where the criteria break", body: "Poetry, rhetoric and humour deliberately break them. Taste in art is not only clarity: rhythm, ambiguity and surprise can be the point. This session trains one layer of taste (communication), not all of it." },
      { title: "Next seasons", body: "Blind comparisons of public-domain paintings, poems and musical passages, with stated criteria and interleaved examples, when lawful material can be bundled." },
    ],
  });

  /* ─── 12 · boss ─── */
  sessions.push({
    id: "boss", primitive: "boss", atoms: ["orient", "minimal", "synth"],
    title: "The hospital that got faster and worse",
    hook: "A hospital hits every target, and patients are angrier than ever. Find out why. Nobody will tell you which idea you need.",
    minutes: 25,
    why: "Last in season 2 because it's an unlabelled world: five symptoms, no session names, and you choose the mechanisms. It measures what matters most, orienting in a problem you weren't taught, and it's a fair test of both seasons.",
    capability: "Walk into a messy situation, recognise which mechanisms are at work without being told, and find the smallest set that explains everything.",
    stakes: "Real problems never announce which chapter they come from. Recognising the structure unlabelled is the difference between knowing ideas and using them.",
    bridge: "The missing step: treat each symptom separately first. For each, ask which of the mechanisms you know would produce exactly that pattern. Then look for the fewest mechanisms that cover all five.",
    connection: "Every session so far, used at once: targets (5), filters (2), delays (4), base rates (3), constraints (7), and the three boxes to finish.",
    vocab: {
      bossworld: { name: "unlabelled problem", h: "A situation that doesn't say which idea it needs.", s: "مسألة مش مكتوب عليها من أنهي درس.", t: "A transfer task stripped of domain cues, testing recognition of structure." },
      minimal2: { name: "minimum sufficient model", h: "The fewest mechanisms that explain all the symptoms.", s: "أقل عدد أسباب يشرح كل الأعراض.", t: "The most parsimonious set of causal mechanisms consistent with the observations." },
    },
    provenance: [
      { id: "fict", claim: "The hospital is fictional, a composite built for teaching; each mechanism in it is documented elsewhere (e.g. target gaming in Bevan & Hood 2006).", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
      { id: "bevan2", claim: "Under English health-service targets, reported performance showed patterns consistent with gaming.", source: "Bevan G. & Hood C., Public Administration 84:517", year: "2006", kind: "scholarship", license: "fact", grade: "A" },
    ],
    steps: [
      { id: "x1", type: "scene", stage: "hook", min: 2, src: ["fict"], terms: ["bossworld"], title: "St Somewhere (a fictional hospital)", body: "New managers set targets and meet them all. Over a year:\n\n1. Average stay fell **20%**; readmissions within a month rose **30%**.\n\n2. Patient-survey scores **rose**; formal complaints **rose** too.\n\n3. Bed numbers swing: cut one year, added the next, cut again.\n\n4. A new quick sepsis alarm flags **10%** of patients; nurses now ignore most alarms.\n\n5. **98%** of emergency patients are seen within 4 hours, yet many wait on trolleys for a bed.\n\nNo hints follow. Each question asks which mechanism is at work.", reps: [{ kind: "story", label: "Why fictional", body: "A real hospital would come with real people and one-sided evidence. A composite lets each mechanism be clean, so the test is recognising structure, not knowing a scandal." }] },
      { id: "x2", type: "q", kind: "alien", stage: "far", min: 2, src: ["bevan2"], atoms: ["orient", "measure"], stem: "Stays got 20% shorter and readmissions rose 30%. The most likely mechanism?", options: [{ t: "A target on length of stay was met by sending patients home before they were ready; the number improved, recovery didn't", ok: true, why: "A measure became the target (session 5)." }, { t: "Patients are getting sicker every year", bug: "omission", why: "Possible, but it doesn't explain why the rise came with the new stay target." }, { t: "Doctors got better at treatment", bug: "inversion", why: "Better treatment would lower readmissions." }, { t: "Bad luck", bug: "omission", why: "A 30% rise alongside a 20% cut is a pattern, not luck." }] },
      { id: "x3", type: "q", kind: "alien", stage: "far", min: 2, atoms: ["orient", "causal"], stem: "Survey scores rose while complaints rose. Surveys are handed out at the discharge desk. What explains both?", options: [{ t: "A filter: surveys reach people leaving (often relieved), not those readmitted or those who left angry; complaints come from exactly those", ok: true, why: "Who gets asked shapes the answer (session 2)." }, { t: "People lie on surveys", bug: "moral", why: "No lying needed: the filter alone produces the gap." }, { t: "Patients became more demanding", bug: "omission", why: "It doesn't explain why surveys improved at the same time." }] },
      { id: "x4", type: "q", kind: "alien", stage: "far", min: 2, atoms: ["orient", "systems"], stem: "When wards overflow, managers add beds in next spring's budget; the beds open in autumn, when winter demand is ending; then they're cut again. What will the bed count do?", options: [{ t: "Swing up and down, always a season late: a correction loop with a delay", ok: true, why: "The shower from session 4, with beds." }, { t: "Settle at the right number", bug: "nodelay", why: "Only if the delay were short compared with the swings in demand." }, { t: "Grow forever", bug: "inversion", why: "Cuts follow every rise." }] },
      { id: "x5", type: "q", kind: "alien", stage: "far", min: 2, atoms: ["orient", "prob"], stem: "The sepsis alarm flags 10 of every 100 patients. About 2 of every 100 have sepsis, and the alarm catches 90% of them. Why do nurses ignore it?", options: [{ t: "Of about 10 alarms, only about 2 are real: most alarms are false, so ignoring them is learned", ok: true, why: "Count it (session 3): 1.8 true alarms among 10. A rare condition makes a busy alarm mostly wrong." }, { t: "Nurses are careless", bug: "moral", why: "The numbers teach them to ignore it; carelessness isn't needed." }, { t: "The alarm catches too few cases", bug: "inverse", why: "It catches 90%. The problem is how many healthy patients it flags." }] },
      { id: "x6", type: "model", stage: "model", min: 3, model: "mechs", title: "Find the minimum sufficient model", body: "Switch mechanisms on until every symptom is explained, then try to switch one off.", ask: "What's the smallest set that explains all five? Is there only one such set?", terms: ["minimal2"] },
      { id: "x7", type: "q", kind: "alien", stage: "far", min: 2, atoms: ["minimal", "judgment"], stem: "Emergency patients are seen within 4 hours but wait on trolleys for beds. Beds are full because patients ready to leave wait for community care, which can take only 10 a day. Which single change helps most?", options: [{ t: "Raise community-care capacity: it's the constraint that fills the beds, forces early discharges and blocks the emergency department", ok: true, why: "Three boxes (session 7): emergency → ward → community. The last box sets the pace." }, { t: "Hire more emergency staff", bug: "notconstraint", why: "They're not the constraint: patients already wait after being seen." }, { t: "A stricter 4-hour target", bug: "proxy", why: "More pressure on a number that is already met, while the constraint is elsewhere." }, { t: "More surveys", bug: "selection", why: "More filtered feedback." }] },
      {
        id: "x8", type: "contrast", stage: "contrast", min: 2, src: ["bevan2"], atoms: ["analogy", "synth"], title: "1902 and today",
        left: { title: "Hanoi, 1902 (season 1)", body: "Paid per rat tail: more tails, not fewer rats." },
        right: { title: "St Somewhere", body: "Rewarded for shorter stays: shorter stays, not better recoveries." },
        q: { stem: "What's the deep sameness?", options: [{ t: "A reward on a number that was cheaper to move than the reality behind it", ok: true, why: "A century apart, one mechanism." }, { t: "Both were run by governments", bug: "surface", why: "Private firms do it too." }, { t: "Both involved animals or patients", bug: "surface", why: "Surface." }] },
      },
      { id: "x9", type: "q", kind: "transfer", stage: "transfer", min: 1.5, atoms: ["orient", "synth"], stem: "A school's pass rate jumps after weaker students are advised not to sit the exam. Which two mechanisms?", options: [{ t: "A rewarded number (pass rate) and a filter on who is counted", ok: true, why: "Goodhart plus selection: the rate went up because the denominator changed." }, { t: "Better teaching and exponential growth", bug: "omission", why: "Nothing in the story says teaching changed." }, { t: "A delay loop", bug: "omission", why: "No correction or delay is described." }] },
      {
        id: "x10", type: "forge", stage: "forge", min: 3, title: "Draw the three boxes for St Somewhere", body: "Say what the problem basically is, in three boxes.",
        slots: [
          { key: "b1", label: "Box 1: the pressure", options: [{ t: "targets on numbers (stay length, 4 hours)", grade: "good", note: "The origin of the gaming.", say: "targets on numbers" }, { t: "bad staff", grade: "bad", note: "Nothing in the data points at people.", say: "bad staff" }] },
          { key: "b2", label: "Box 2: the mechanism", options: [{ t: "early discharges and filtered feedback make the numbers look good", grade: "good", note: "Proxy + selection.", say: "early discharges and filtered feedback" }, { t: "patients getting sicker", grade: "weak", note: "Doesn't explain the timing.", say: "sicker patients" }] },
          { key: "b3", label: "Box 3: the constraint", options: [{ t: "community-care capacity at 10 a day", grade: "good", note: "The real limit on flow.", say: "community care at 10 a day" }, { t: "the emergency department", grade: "bad", note: "It meets its target; it isn't the constraint.", say: "the emergency department" }] },
        ],
        template: "The problem is basically: **{b1}** → {b2} → while **{b3}** sets the real pace.",
        critique: { stem: "A board member says: 'Five symptoms, so we need five separate projects.' Your reply?", options: [{ t: "Four mechanisms explain all five, and two of the symptoms share causes: raise the constraint and drop the stay target first", ok: true, why: "The minimum sufficient model tells you where one change does the most." }, { t: "Agree: one project per symptom", bug: "notconstraint", why: "That spreads effort over symptoms that share causes." }, { t: "Start with the surveys", bug: "selection", why: "Surveys are the filtered part, not a cause." }] },
      },
    ],
    challenge: { stem: "A startup's users grew 50% while revenue stayed flat and support tickets tripled; the team is rewarded for sign-ups. First suspicion?", options: [{ t: "Sign-ups became the target: cheap, low-intent users inflate the number and load support", ok: true }, { t: "The product got worse", bug: "omission" }, { t: "Exponential growth", bug: "surface" }] },
    hooks: [
      { id: "boss.h1", gap: 1, q: { stem: "Survey scores up, complaints up. First question?", options: [{ t: "Who gets the survey and who doesn't?", ok: true }, { t: "Are patients lying?", bug: "moral" }, { t: "How many surveys were sent?", bug: "irrelevant" }] } },
      { id: "boss.h2", gap: 7, q: { stem: "A rare condition plus an alarm that flags many people leads to…", options: [{ t: "mostly false alarms, and people learning to ignore them", ok: true }, { t: "mostly true alarms", bug: "inverse" }, { t: "no alarms", bug: "omission" }] } },
      { id: "boss.h3", gap: 30, q: { stem: "Five symptoms. Before five projects, look for…", options: [{ t: "the fewest mechanisms that explain all of them", ok: true }, { t: "the loudest symptom", bug: "surface" }, { t: "who to blame", bug: "moral" }] } },
    ],
    deeper: [
      { title: "Why unlabelled", body: "Inside a session, you know which idea is being taught. Real problems remove that cue. Scores on unlabelled items, compared over months, are the closest this app gets to measuring whether you can orient in an unknown domain." },
      { title: "Where it breaks", body: "Real hospitals have more than five mechanisms and noisy data. The minimum sufficient model is a place to start acting, not the whole truth." },
    ],
  });

  const season2 = { id: "s2", title: "Season 2 · Seeing structure", sessions, visuals, models };
  const S = (window.RENAISSANCE_SEASONS = window.RENAISSANCE_SEASONS || []);
  if (!S.some((z) => z.id === "s2")) S.push(season2);
})();
