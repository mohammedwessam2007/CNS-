/* RENAISSANCE · Season 3 · Possession (part 3: history, the salon, film, architecture).
 *
 * History as rival explanations weighed against evidence (the Baghdad translation movement), cultivation as a
 * conversation you can get right or wrong (the salon, with the same idea said four ways), film as space built by cuts
 * (the 180° rule, Ozu, Kuleshov's contested effect), and architecture as forces you can see (Hooke's hanging chain,
 * Gaudí, the Nubian vault and Hassan Fathy). Same content rules as parts 1 and 2.
 */
(function () {
  "use strict";
  const C = { lime: "#d9ff43", cyan: "#66e9ff", pink: "#ff6e8a", green: "#5ef0a0", amber: "#ffd166", violet: "#b39cff", mut: "#8fa6c0", line: "#2f4a68", bg: "#0f1d2e", ink: "#e8eef6", stone: "#c8b48a" };
  const svg = (w, h, inner, label) => '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "") + '" class="rnSvg">' + inner + "</svg>";
  const t = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" fill="' + ((o && o.c) || C.ink) + '" font-size="' + ((o && o.fs) || 12) + '" font-weight="' + ((o && o.fw) || 700) + '" text-anchor="' + ((o && o.a) || "middle") + '" font-family="Inter,system-ui,sans-serif">' + s + "</text>";
  const box = (x, y, w, h, c, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + (fill || C.bg) + '" stroke="' + c + '" stroke-width="1.6"/>';
  const rect = (x, y, w, h, fill, rx) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + fill + '"/>';
  const defs = '<defs><marker id="rnArr4" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="' + C.mut + '"/></marker></defs>';
  const arrow = (x1, y1, x2, y2, c) => '<path d="M' + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + x2.toFixed(1) + " " + y2.toFixed(1) + '" stroke="' + (c || C.mut) + '" stroke-width="2" marker-end="url(#rnArr4)" fill="none"/>';
  const poly = (pts, c, w, dash) => '<polyline points="' + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 2.4) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + ' stroke-linejoin="round"/>';
  const wrap = (str, n) => {
    const out = [];
    let cur = "";
    for (const w of String(str).split(" ")) (cur + " " + w).trim().length > n && cur ? (out.push(cur), (cur = w)) : (cur = (cur + " " + w).trim());
    if (cur) out.push(cur);
    return out;
  };
  const lines = (x, y, arr, o, dy) => arr.map((l, i) => t(x, y + i * (dy || 16), l, o)).join("");

  /* ═══════════════ the translation movement: evidence against three explanations ═══════════════ */
  const HYP = [
    ["one caliph's wish", "al-Ma'mun's dream of Aristotle, and his library"],
    ["two centuries of demand", "many patrons with practical needs, paying for 200 years"],
    ["chance", "Greek books simply happened to be at hand"],
  ];
  const EV = [
    ["e1", "Translation began under al-Mansur (r. 754–775), decades before al-Ma'mun", [-1, 1, 0]],
    ["e2", "Many private patrons paid translators (the Banu Musa brothers, physicians, officials)", [-1, 2, 0]],
    ["e3", "Useful subjects came first: medicine, astronomy, mathematics", [0, 1, -1]],
    ["e4", "Paper was being made in Baghdad from the 790s", [0, 1, 0]],
    ["e5", "The dream story comes from a later source, read by historians as propaganda for al-Ma'mun", [-1, 0, 0]],
    ["e6", "Translators travelled to find manuscripts (Hunayn searched for a lost Galen text)", [0, 1, -2]],
  ];
  function explainDraw(v) {
    const sc = [0, 0, 0];
    EV.forEach(([id, , w]) => v[id] && w.forEach((x, i) => (sc[i] += x)));
    let s = t(180, 16, "evidence switched on: " + EV.filter(([id]) => v[id]).length + " of 6", { fs: 12, c: C.mut });
    HYP.forEach(([name, desc], i) => {
      const y = 36 + i * 76,
        val = sc[i],
        c = val >= 3 ? C.green : val < 0 ? C.pink : C.amber;
      s += t(8, y + 10, name, { fs: 13, a: "start" }) + lines(8, y + 28, wrap(desc, 50), { fs: 12, a: "start", c: C.mut, fw: 500 }, 15);
      s += '<line x1="180" y1="' + (y + 50) + '" x2="180" y2="' + (y + 66) + '" stroke="' + C.mut + '"/>' + rect(val >= 0 ? 180 : 180 + val * 18, y + 51, Math.max(3, Math.abs(val) * 18), 14, c, 3) + t(val >= 0 ? 186 + val * 18 : 174 + val * 18, y + 63, (val > 0 ? "+" : "") + val, { fs: 12, c, a: val >= 0 ? "start" : "end" });
    });
    return svg(360, 262, s, "Three explanations of the translation movement scored against the evidence");
  }

  /* ═══════════════ the salon: one idea, four audiences ═══════════════ */
  const REG = [
    [
      ["a child of ten", "Imagine kids going down one slide. It doesn't matter how fast they run to the ladder: only one can slide at a time. So the slide decides how many get a turn."],
      ["a taxi driver", "It's like the bridge at rush hour. Widen every road before it and nothing changes: everyone still squeezes through the bridge. Fix the bridge, or fix nothing."],
      ["a doctor", "If the doctors see 12 patients an hour, faster registration only fills the waiting room. The slowest step sets the pace of the whole clinic, so improve that one first."],
      ["a professor", "In a serial process, throughput equals the minimum capacity across stages; improving any other stage only relocates the queue. Little's law then gives the waiting time from the queue length."],
    ],
    [
      ["a child of ten", "If one kid in a hundred has a cold and the thermometer sometimes gets it wrong, most kids it calls sick are fine, because there are so many healthy kids for it to be wrong about."],
      ["a taxi driver", "A test that's “90% right” for a rare disease: most people it flags are healthy, because healthy people are so many more. Always ask how common the disease is first."],
      ["a doctor", "At 1% prevalence, with 90% sensitivity and 9% false positives, a positive test means about a 9% chance of disease: false positives among the 99% swamp the true ones."],
      ["a professor", "The posterior depends on the prior: P(D|+) = sens·p / (sens·p + fpr·(1−p)); with p = 0.01, sens = 0.9 and fpr = 0.09, P(D|+) ≈ 0.09."],
    ],
  ];
  const IDEAS = ["the slowest step", "base rates"];

  /* ═══════════════ film: the line of action ═══════════════ */
  function axisDraw(v) {
    const O = [180, 104],
      A = [130, 104],
      B = [230, 104],
      phi = (v.cam * Math.PI) / 180,
      Cm = [O[0] + 88 * Math.cos(phi), O[1] + 88 * Math.sin(phi)];
    const d = [O[0] - Cm[0], O[1] - Cm[1]],
      L = Math.hypot(d[0], d[1]),
      dn = [d[0] / L, d[1] / L],
      r = [-dn[1], dn[0]];
    const xa = (A[0] - O[0]) * r[0] + (A[1] - O[1]) * r[1],
      xb = (B[0] - O[0]) * r[0] + (B[1] - O[1]) * r[1];
    const side = Cm[1] > O[1] + 0.5 ? 1 : Cm[1] < O[1] - 0.5 ? 2 : 0;
    let s = defs + t(180, 16, "seen from above", { fs: 12, c: C.mut });
    if (v.line) s += '<line x1="20" y1="104" x2="340" y2="104" stroke="' + C.amber + '" stroke-width="1.6" stroke-dasharray="6 5"/>' + t(338, 96, "the line", { fs: 12, c: C.amber, a: "end" });
    s += '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="13" fill="' + C.cyan + '"/>' + t(A[0], A[1] + 5, "A", { fs: 13, c: "#07111d" }) + '<circle cx="' + B[0] + '" cy="' + B[1] + '" r="13" fill="' + C.pink + '"/>' + t(B[0], B[1] + 5, "B", { fs: 13, c: "#07111d" });
    s += '<rect x="' + (Cm[0] - 11).toFixed(1) + '" y="' + (Cm[1] - 8).toFixed(1) + '" width="22" height="16" rx="3" fill="' + C.lime + '"/>' + arrow(Cm[0] + dn[0] * 14, Cm[1] + dn[1] * 14, Cm[0] + dn[0] * 40, Cm[1] + dn[1] * 40, C.lime);
    // what the camera sees
    const fx = (x) => 180 + (x / 60) * 70;
    s += t(180, 214, "what the camera sees", { fs: 12, c: C.mut }) + box(70, 222, 220, 70, C.line, "#0b1320");
    let pa = fx(xa),
      pb = fx(xb);
    // on (or near) the line one actor stands behind the other: draw them offset so both stay visible
    if (Math.abs(pa - pb) < 34) {
      const m = (pa + pb) / 2,
        s0 = pa <= pb ? -1 : 1;
      pa = m + s0 * 17;
      pb = m - s0 * 17;
    }
    s += '<circle cx="' + pa.toFixed(1) + '" cy="258" r="15" fill="' + C.cyan + '"/>' + t(pa, 263, "A", { fs: 13, c: "#07111d" }) + '<circle cx="' + pb.toFixed(1) + '" cy="258" r="15" fill="' + C.pink + '"/>' + t(pb, 263, "B", { fs: 13, c: "#07111d" });
    s += t(180, 312, side === 0 ? "on the line: A and B overlap" : "A on the " + (pa < pb ? "left" : "right") + ", B on the " + (pa < pb ? "right" : "left") + " (side " + side + ")", { fs: 12, c: side === 1 ? C.lime : side === 2 ? C.amber : C.pink });
    return svg(360, 322, s, "Two actors, the line between them, a camera, and what the camera sees");
  }

  /* ═══════════════ architecture: the hanging chain ═══════════════ */
  function funicular(rise, load) {
    const N = 24,
      x0 = 60,
      x1 = 300,
      dx = (x1 - x0) / N;
    let lens = Array(N).fill(dx),
      y = [];
    for (let it = 0; it < 5; it++) {
      const w = [];
      for (let i = 1; i < N; i++) w.push((lens[i - 1] + lens[i]) / 2);
      const total = w.reduce((a, b) => a + b, 0);
      w[N / 2 - 1] += load * total;
      let V = w.reduce((a, b) => a + b, 0) / 2;
      y = [0];
      for (let k = 0; k < N; k++) {
        y.push(y[k] + V * dx);
        if (k < N - 1) V -= w[k];
      }
      const m = Math.max(...y.map(Math.abs)) || 1;
      y = y.map((v) => (v / m) * rise);
      lens = [];
      for (let k = 0; k < N; k++) lens.push(Math.hypot(dx, y[k + 1] - y[k]));
    }
    return y.map((v, i) => [x0 + i * dx, v]);
  }
  function chainDraw(v) {
    const rise = 20 + v.rise,
      pts = funicular(rise, v.load / 100);
    let s = t(180, 14, "hang a chain…", { fs: 12, c: C.mut }) + '<circle cx="60" cy="22" r="4" fill="' + C.ink + '"/><circle cx="300" cy="22" r="4" fill="' + C.ink + '"/>';
    s += poly(pts.map(([x, y]) => [x, 22 + y]), C.cyan, 3);
    if (v.load > 0) {
      const [mx, my] = pts[12];
      s += '<line x1="' + mx + '" y1="' + (22 + my) + '" x2="' + mx + '" y2="' + (32 + my) + '" stroke="' + C.pink + '" stroke-width="2"/>' + rect(mx - 9, 32 + my, 18, 12, C.pink, 2);
    }
    const base = 292;
    s += t(180, 158, "…turn it upside down: an arch", { fs: 12, c: C.mut }) + '<line x1="40" y1="' + base + '" x2="320" y2="' + base + '" stroke="' + C.line + '" stroke-width="2"/>';
    if (v.circle) {
      const R = 120,
        cpts = [];
      for (let a = 0; a <= 180; a += 6) cpts.push([180 - R * Math.cos((a * Math.PI) / 180), base - R * Math.sin((a * Math.PI) / 180)]);
      s += poly(cpts, C.amber, 2, "6 5") + t(318, base - 104, "half-circle", { fs: 12, c: C.amber, a: "end" });
    }
    s += poly(pts.map(([x, y]) => [x, base - y]), C.stone, 7);
    s += t(180, base + 22, v.load > 0 ? "a weight at the crown gives the arch a point" : "every stone pressed, none pulled", { fs: 12, c: C.lime });
    return svg(360, 322, s, "A hanging chain and, below it, the same curve flipped into an arch");
  }

  /* ═══════════════ VISUALS ═══════════════ */
  const visuals = {
    // Galen's medicine through three languages
    relay: () => {
      const st = [
        ["Galen", "Greek, 2nd c.", C.cyan],
        ["Hunayn ibn Ishaq", "into Arabic, 9th c.", C.amber],
        ["Avicenna, Canon", "Arabic, c. 1025", C.amber],
        ["Toledo", "into Latin, 12th c.", C.green],
        ["European schools", "for centuries", C.green],
      ];
      let s = defs;
      st.forEach(([a, b, c], i) => {
        const y = 10 + i * 52;
        s += box(40, y, 280, 40, c) + t(180, y + 17, a, { fs: 13 }) + t(180, y + 33, b, { fs: 12, c: C.mut });
        if (i < st.length - 1) s += arrow(180, y + 40, 180, y + 50);
      });
      return svg(360, 272, s, "Galen's medicine passing from Greek to Arabic to Latin");
    },
    // overhead: the line, two actors, two camera positions
    axis: () => axisDraw({ cam: 90, line: true }),
    chainArch: () => chainDraw({ rise: 70, load: 0, circle: false }),
  };

  /* ═══════════════ MODELS ═══════════════ */
  const models = {
    explain: {
      toggles: EV.map(([id, txt]) => ({ id, label: txt.split(" (")[0].split(":")[0], value: id === "e1" || id === "e2" })),
      draw: (v) => explainDraw(v),
      read(v) {
        const on = EV.filter(([id]) => v[id]);
        if (!on.length) return "Switch on some evidence.";
        const sc = [0, 0, 0];
        on.forEach(([, , w]) => w.forEach((x, i) => (sc[i] += x)));
        const best = sc.indexOf(Math.max(...sc));
        return on.map(([, txt]) => "• " + txt + ".").join(" ") + "\n\nWith this evidence the best-supported explanation is **" + HYP[best][0] + "** (" + sc.map((x, i) => HYP[i][0] + " " + (x > 0 ? "+" : "") + x).join(" · ") + "). A dream can start a project; it cannot keep hundreds of people paying for two centuries. *Scores are the app's teaching weights: +2 strongly expected under the explanation, −2 strongly unexpected. The historical judgement they summarise is Dimitri Gutas's (1998); some historians still give the caliphs a larger role.*";
      },
    },
    register: {
      text: true,
      controls: [
        { id: "aud", label: "Who you're talking to", min: 0, max: 3, step: 1, value: 1, fmt: (x) => ["a child of ten", "a taxi driver", "a doctor", "a professor"][x] },
        { id: "idea", label: "The idea", min: 0, max: 1, step: 1, value: 0, fmt: (x) => IDEAS[x] },
      ],
      draw(v) {
        const [who, txt] = REG[Math.round(v.idea)][Math.round(v.aud)];
        return '<div class="rnSay"><b>To ' + who + "</b><span>" + txt + "</span></div>";
      },
      read(v) {
        const txt = REG[Math.round(v.idea)][Math.round(v.aud)][1];
        const words = txt.split(/\s+/).length,
          jargon = (txt.match(/\b[A-Za-z]{10,}\b/g) || []).length;
        return "**" + words + " words**, " + jargon + " long technical word" + (jargon === 1 ? "" : "s") + ". What stays the same at every level: the mechanism (" + (Math.round(v.idea) ? "a rare condition means most positives are false" : "the slowest step sets the pace") + "). What changes: the example, the vocabulary and the precision. Same person, four registers; none of them is dumbing down, and none is showing off.";
      },
    },
    axis: {
      controls: [{ id: "cam", label: "Camera position around the pair", min: 0, max: 350, step: 10, value: 90, unit: "°" }],
      toggles: [{ id: "line", label: "Show the line of action", value: true }],
      draw: (v) => axisDraw(v),
      read(v) {
        const phi = (v.cam * Math.PI) / 180,
          y = Math.sin(phi);
        const side = y > 0.01 ? 1 : y < -0.01 ? 2 : 0;
        return side === 0 ? "**The camera is on the line itself.** The actors line up one behind the other: editors avoid cutting to this position between two facing shots." : "**Side " + side + ".** From anywhere on this side, A appears on the " + (side === 1 ? "left" : "right") + " looking right-to-left toward B, " + (side === 1 ? "left to right" : "right to left") + ". Cut between any two cameras on the same side and the viewer never loses who is where. Cross the line and A and B swap sides of the screen: the jump the 180° rule forbids, and that Ozu used on purpose.";
      },
    },
    chain: {
      controls: [
        { id: "rise", label: "How far the chain sags (the arch's height)", min: 0, max: 100, step: 5, value: 70, unit: "" },
        { id: "load", label: "A weight hung at the middle (% of the chain's weight)", min: 0, max: 200, step: 20, value: 0, unit: "%" },
      ],
      toggles: [{ id: "circle", label: "Compare with a half-circle", value: false }],
      draw: (v) => chainDraw(v),
      read(v) {
        return (v.load > 0 ? "**With a weight at the middle the chain bends to a point there**, and so does the ideal arch: a concentrated load at the crown calls for a pointed shape. " : "**The chain hangs in pure tension; flipped, the same curve stands in pure compression**, which is what stone and brick are good at. ") + (v.circle ? "The half-circle (dashed) is not the chain's shape: its line of thrust strays from the middle of the stones, so it stands only if it is thick enough, by Heyman's classic calculation about a tenth of its radius for its own weight alone. " : "") + "Hooke saw this in 1675; Gaudí designed a church by hanging weighted strings and photographing them upside down. *The curve is computed live from a hanging chain of 24 links.*";
      },
    },
  };

  const quotes = {
    hooke: { text: "ut pendet continuum flexile, sic stabit contiguum rigidum inversum", speaker: "Robert Hooke", author: "Robert Hooke", work: "A Description of Helioscopes (1675), published as an anagram; decoded by his executor in 1705", where: "the anagram's solution", year: "1675", translator: "Latin original; in English: “As hangs a flexible cable so, inverted, stand the touching pieces of an arch”", rights: "public domain (Latin original)", context: "Hooke announced that he had found the true form of all arches and hid it as a scrambled Latin sentence, a common way of claiming priority.", meaning: "The shape a hanging chain takes under its own weight, turned upside down, is the shape an arch of touching stones needs to stand.", matters: "It turns an engineering problem into an experiment anyone can do with a necklace.", misattribution: "Low.", verified: "Latin text and history checked by web search (e.g. Block, DeJong & Ochsendorf 2006)." },
  };

  const sessions = [];

  /* ─── 21 · Why did Baghdad translate the Greeks? ─── */
  sessions.push({
    id: "wisdom", primitive: "explain", domain: "history", region: "Iraq, Iran, Central Asia and Spain", works: ["translation-movement"],
    atoms: ["model", "causal", "judgment", "info"],
    title: "Why did Baghdad translate the Greeks?",
    hook: "For two centuries Baghdad paid translators to put Greek medicine, mathematics and philosophy into Arabic. The famous explanation is a caliph's dream of Aristotle. Is it the right one?",
    minutes: 26,
    why: "History as rival explanations weighed against evidence, not a list of dates, and about a movement at the root of your own profession: Galen's medicine reached Europe's universities through Arabic. This is where Arabic civilisation belongs in the organ: at the centre of a question, not as a sidebar.",
    capability: "Weigh rival explanations of a historical change against the evidence, prefer the one that explains most with least, and trace one line of medicine through three languages.",
    stakes: "Stories of one great man explain nothing you can use. The mechanism (demand, money, paper, people who know both languages) tells you how knowledge moves today, including into your own field.",
    bridge: "The missing step: one ruler's wish can start a project; only broad demand keeps it running for two hundred years. So ask who paid, for what, and for how long.",
    connection: "Season 2's London 1854 asked you to reason inside an era's knowledge. Here you choose between explanations of an era, using the same rule: which one makes the evidence expected?",
    vocab: {
      movement: { name: "the translation movement", h: "Two centuries (about 750–1000) of translating Greek science and philosophy into Arabic, centred on Baghdad.", s: "حوالي ٢٠٠ سنة الناس في بغداد بتترجم علوم اليونان للعربي، والطب أولهم.", t: "The Graeco-Arabic translation movement of the early Abbasid period (Gutas 1998): largely via Syriac, funded by the court, elites and scholars, and covering medicine, mathematics, astronomy and philosophy." },
      patron: { name: "patronage", h: "Paying for scholars' or artists' work because you want the result.", s: "إنك تصرف على العلماء عشان محتاج اللي هيعملوه.", t: "Support by an individual or institution in exchange for works, prestige or practical use; in Baghdad caliphs, viziers, physicians and families such as the Banu Musa." },
      modelsel: { name: "choosing between explanations", h: "Prefer the explanation that makes the evidence most expected, with the fewest extra assumptions.", s: "اختار التفسير اللي بيخلّي الدليل متوقع، بأقل افتراضات زيادة.", t: "Model selection: comparing hypotheses by likelihood of the evidence and by parsimony; the historian's version of choosing a diagnosis." },
    },
    provenance: [
      { id: "gutas", claim: "The Graeco-Arabic translation movement was a society-wide, two-century phenomenon supported by many patrons for practical and ideological reasons; it began under al-Mansur (r. 754–775), not with al-Ma'mun.", source: "Gutas D., Greek Thought, Arabic Culture: The Graeco-Arabic Translation Movement in Baghdad and Early 'Abbasid Society (Routledge)", year: "1998", kind: "scholarship", license: "fact", grade: "A" },
      { id: "dream", claim: "Ibn al-Nadim's Fihrist (10th century) reports that the caliph al-Ma'mun dreamt of Aristotle; Gutas reads the story as political propaganda for al-Ma'mun.", source: "Ibn al-Nadim, al-Fihrist (987), as discussed in Gutas (1998)", year: "987", kind: "scholarship", license: "fact", grade: "A", contested: "Historians differ on how much weight to give al-Ma'mun and the 'House of Wisdom'; whether it was an academy or mainly a library is debated." },
      { id: "hunayn", claim: "Hunayn ibn Ishaq (d. 873) listed in his letter (Risala) the Galen translations of his time; he translated about 129 works himself, collated several Greek manuscripts where he could, and travelled to find missing texts.", source: "Hunayn ibn Ishaq, Risala; ed. and tr. Lamoreaux (2016); checked by web search", year: "9th c.", kind: "primary", license: "fact", grade: "A" },
      { id: "banumusa", claim: "The Banu Musa brothers, mathematicians in Baghdad, paid translators including Hunayn ibn Ishaq and Thabit ibn Qurra and sent for manuscripts from abroad.", source: "Standard history of science (e.g. MacTutor biography); checked by web search", year: "9th c.", kind: "scholarship", license: "fact", grade: "B" },
      { id: "paper", claim: "Paper-making spread from Central Asia into the Islamic world after the mid-8th century; a paper mill is recorded in Baghdad in the 790s.", source: "Standard history of paper (checked by web search)", year: "790s", kind: "scholarship", license: "fact", grade: "B" },
      { id: "toledo", claim: "In 12th-century Toledo, Gerard of Cremona and his circle translated dozens of Arabic scientific and medical works into Latin; the Latin Canon of Avicenna is traditionally credited to this circle, and it was a standard medical textbook in European universities for centuries.", source: "Standard history of medicine (checked by web search)", year: "12th c.", kind: "scholarship", license: "fact", grade: "B", contested: "Some scholars attribute the Canon's translation to a later Gerard; attributions within Gerard's circle are uncertain." },
      { id: "checklist", claim: "Introducing a 19-item WHO surgical safety checklist in eight hospitals was followed by a fall in deaths from 1.5% to 0.8% and in complications from 11.0% to 7.0%.", source: "Haynes A.B. et al., 'A surgical safety checklist to reduce morbidity and mortality in a global population', NEJM 360:491", year: "2009", kind: "scholarship", license: "fact", grade: "A" },
      { id: "timbuktu", claim: "Timbuktu's family libraries hold manuscripts from several centuries on law, astronomy and medicine; in 2012–13 librarians smuggled hundreds of thousands of them to Bamako to protect them from occupying armed groups.", source: "Widely reported (e.g. accounts of Abdel Kader Haidara's evacuation)", year: "2012–2013", kind: "scholarship", license: "fact", grade: "B" },
    ],
    steps: [
      { id: "h1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["dream", "gutas"], terms: ["modelsel"], atoms: ["model", "question"], poss: { "translation-movement": "context" }, stem: "The famous story: the caliph al-Ma'mun dreamt of Aristotle and then had Greek books translated. Which fact would best test that explanation?", alt: "What would you expect to see if one caliph's wish were the cause, and what if it were not?", options: [
        { t: "When the translations began, and who else paid for them", ok: true, why: "If one caliph's wish drove it, it should start with him and depend on him. If it started earlier and many others paid, the dream explains little." },
        { t: "Whether al-Ma'mun really had the dream, as the Fihrist reports it", bug: "irrelevant", why: "A dream cannot be checked, and even a real one would not explain two centuries." },
        { t: "How good the translations were", bug: "irrelevant", why: "Quality says nothing about why the work was paid for." },
        { t: "Whether Aristotle is still read today", bug: "irrelevant", why: "True and beside the point: it concerns his influence, not the cause." },
      ] },
      { id: "h2", type: "scene", stage: "reveal", min: 3, src: ["gutas", "banumusa", "paper", "dream"], terms: ["movement", "patron"], title: "Follow the money and the paper", body: "The evidence historians have gathered, notably Dimitri Gutas (1998):\n\n**It began early.** Translation was under way under al-Mansur (r. 754–775), decades before al-Ma'mun (r. 813–833).\n\n**Many paid.** Caliphs, viziers, physicians and families of scholars were [[patron|patrons]]; the Banu Musa brothers, mathematicians themselves, paid translators and sent for manuscripts from abroad.\n\n**Useful subjects came first:** medicine, astronomy, mathematics.\n\n**Paper arrived.** Paper-making reached Baghdad from Central Asia; a mill is recorded there in the 790s, and books became cheaper to copy.\n\nThe dream story is real, reported in the 10th-century Fihrist. Gutas reads it as propaganda for al-Ma'mun. Other historians give the court a larger role. Keep the disagreement; weigh the evidence.", reps: [{ kind: "diagram", label: "One line of medicine", svg: "relay", body: "Galen wrote in Greek; Hunayn ibn Ishaq and his circle put him into Arabic; Avicenna built on that in his Canon; Toledo's translators put Avicenna into Latin; Europe's medical schools taught from it for centuries." }, { kind: "story", label: "Hunayn, the translator", body: "Hunayn ibn Ishaq, a Christian physician from al-Hira, wrote a letter listing the Galen translations of his day; about 129 were his own. Where he could, he gathered several Greek manuscripts of a text and compared them before translating; he once searched Mesopotamia, Syria, Palestine and Egypt for a lost Galen work." }] },
      { id: "h3", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["hunayn"], atoms: ["measure", "falsify"], stem: "Hunayn often gathered several Greek manuscripts of one book before translating it. Why?", options: [
        { t: "Copies differ; comparing them recovers what the author wrote", ok: true, why: "Every hand-copied manuscript has errors. Collating several lets the errors cancel out: textual criticism, a thousand years before the word existed." },
        { t: "To split the work among several translators and finish sooner", bug: "surface", why: "The copies were of the same book; the point was accuracy, not speed." },
        { t: "Because patrons paid more for books copied several times", bug: "moral", why: "Patrons paid for good translations; the comparison was his method." },
        { t: "To keep rare copies away from rival translators", bug: "moral", why: "He shared and listed translations openly in his letter." },
      ] },
      { id: "h4", type: "model", stage: "model", min: 4, model: "explain", src: ["gutas", "dream"], terms: ["modelsel"], title: "Weigh the explanations", body: "Three explanations, six pieces of evidence. Switch evidence on and off and see which explanation the evidence expects.", ask: "**Find** the one piece of evidence that hurts the “chance” explanation most, and the smallest set of evidence that already favours two centuries of demand." },
      {
        id: "h5", type: "contrast", stage: "contrast", min: 2.5, src: ["toledo", "gutas"], atoms: ["analogy", "causal"], poss: { "translation-movement": "compare" }, title: "Baghdad, 800, and Toledo, 1150",
        left: { title: "Baghdad", body: "Greek into Arabic, often through Syriac. Paid for by courts, officials and physicians who needed medicine, astronomy and mathematics." },
        right: { title: "Toledo", body: "Arabic into Latin. Scholars travelled there from across Europe; Gerard of Cremona and his circle translated dozens of works, including (traditionally) Avicenna's Canon." },
        q: { stem: "Was it the same mechanism both times?", options: [
          { t: "Yes: manuscripts, people who knew both languages, and paying readers", ok: true, why: "Supply of texts, bilingual scholars and paying demand: the same three conditions, three centuries apart, running the other way." },
          { t: "No: Toledo was a religious project, while Baghdad's was purely scientific", bug: "surface", why: "Both handled science and philosophy; both were religiously mixed societies." },
          { t: "Yes: both were ordered by a single king", bug: "agent", why: "Neither depended on one ruler; that is the point of the comparison." },
          { t: "No: Latin Europe had no use for Arabic medicine", bug: "omission", why: "It used Avicenna's Canon in its medical schools for centuries." },
        ] },
      },
      { id: "h6", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["paper"], atoms: ["counter", "causal"], stem: "Suppose paper had not reached Baghdad until 1100. What would most likely have changed?", options: [
        { t: "Books would have stayed dear, so far fewer translations and copies", ok: true, why: "Parchment and papyrus were costly; cheap paper multiplied copies, libraries and booksellers. Remove it and the same demand buys far less." },
        { t: "Nothing: parchment and papyrus would have done the job just as well", bug: "omission", why: "It would have done it at many times the cost." },
        { t: "Greek science would have been forgotten everywhere", bug: "gain", why: "Byzantium kept the Greek texts; the counterfactual changes Arabic science, not all memory." },
        { t: "The caliphs would have translated orally instead", bug: "surface", why: "Two centuries of technical texts cannot be carried orally." },
      ] },
      { id: "h7", type: "q", kind: "far", stage: "far", min: 2, src: ["checklist"], atoms: ["causal", "analogy"], stem: "Surgery imported the pilots' checklist: in 2009 a 19-item checklist in eight hospitals was followed by deaths falling from 1.5% to 0.8%. What made this “translation” between fields work?", options: [
        { t: "Surgeons' own problem, a version adapted to theatres, and people fluent in both", ok: true, why: "The Baghdad conditions again: demand, a text adapted to its new readers, and translators who understood both sides." },
        { t: "Pilots ordering surgeons to adopt it", bug: "agent", why: "Nobody in aviation had authority over surgeons; surgeons chose it." },
        { t: "Copying the aviation checklist word for word", bug: "surface", why: "It was rewritten for theatres; a literal copy would have been useless." },
        { t: "Luck: the eight hospitals simply happened to improve during that particular year", bug: "omission", why: "A study across eight hospitals is not the same as luck, though it had no control group, so caution is fair." },
      ] },
      {
        id: "h8", type: "forge", stage: "forge", min: 3, title: "Import one method into your own field", body: "A small translation movement of your own.",
        slots: [
          { key: "from", label: "From", options: [{ t: "a field that solved a problem like yours (aviation, manufacturing)", grade: "good", note: "Same problem, different surface.", say: "a field that solved a similar problem" }, { t: "whatever is fashionable this year", grade: "bad", note: "Fashion is not demand.", say: "a fashionable field" }] },
          { key: "what", label: "What exactly", options: [{ t: "one concrete tool (a checklist, a handover format)", grade: "good", note: "Tools translate; cultures rarely do in one step.", say: "one concrete tool" }, { t: "their whole culture", grade: "weak", note: "Too big to carry.", say: "their whole culture" }] },
          { key: "need", label: "Whose problem it solves", options: [{ t: "a named problem people around you already feel", grade: "good", note: "Demand is what kept Baghdad translating.", say: "a problem people already feel" }, { t: "a problem you think they should have", grade: "weak", note: "No demand, no movement.", say: "a problem they should have" }] },
          { key: "test", label: "How you'll know", options: [{ t: "a small trial with a count before and after", grade: "good", note: "As the checklist study did.", say: "a small trial with a count" }, { t: "whether colleagues like it", grade: "weak", note: "Liking is not effect.", say: "colleagues' opinion" }] },
        ],
        template: "From: **{from}**. Tool: {what}. Need: {need}. Test: {test}.",
        critique: { stem: "Your imported tool is ignored after a month. The most likely cause?", options: [{ t: "It answered no problem people felt", ok: true, why: "Without demand even Baghdad would have stopped translating." }, { t: "The source field was the wrong one", bug: "surface", why: "Possible, but demand fails first far more often." }, { t: "People are always resistant to change", bug: "rigid", why: "They adopt what solves their problems; that is the lesson of the movement." }] },
      },
    ],
    challenge: { stem: "Which fact most weakens “one caliph's dream caused the translation movement”?", options: [{ t: "It had begun decades before that caliph", ok: true }, { t: "The dream is reported in a book written much later", bug: "surface" }, { t: "Aristotle was Greek", bug: "irrelevant" }] },
    hooks: [
      { id: "wisdom.h1", gap: 1, poss: { "translation-movement": "context" }, q: { stem: "The Graeco-Arabic translation movement began under…", options: [{ t: "al-Mansur, decades before al-Ma'mun", ok: true }, { t: "al-Ma'mun, after his dream", bug: "authority" }, { t: "Harun al-Rashid, who ordered it alone", bug: "agent" }] } },
      { id: "wisdom.h2", gap: 7, q: { stem: "Hunayn ibn Ishaq compared several manuscripts of one text because…", options: [{ t: "copies differ, and comparing them recovers the original", ok: true }, { t: "it made the work faster", bug: "surface" }, { t: "patrons paid by the manuscript", bug: "moral" }] } },
      { id: "wisdom.h3", gap: 30, q: { stem: "The best test of a “great man” explanation in history is…", options: [{ t: "when it started, and who else paid or pushed", ok: true }, { t: "how famous the man is", bug: "authority" }, { t: "whether the story is moving", bug: "surface" }] } },
    ],
    deeper: [
      { title: "Timbuktu: another library civilisation", body: "Across the Sahara, family libraries in Timbuktu kept manuscripts on law, astronomy and medicine for centuries. In 2012–13, when armed groups occupied the city, librarians smuggled hundreds of thousands of them to Bamako in trunks. Knowledge moves when people value it enough to carry it." },
      { title: "Your own lineage", body: "When you learn that the lens of the eye was once thought to be the organ of sight, or read Galen's name in a history chapter, you are standing at the end of this relay: Greek, Syriac, Arabic, Latin, and then your textbook." },
      { title: "Open question", body: "How important was the House of Wisdom itself? Some historians see a great academy; others, a palace library that later stories enlarged. The sources are thin, and the argument continues." },
    ],
  });

  /* ─── 22 · The salon ─── */
  sessions.push({
    id: "salon", primitive: "salon", domain: "conversation", region: "Cairo, anywhere", works: [],
    atoms: ["judgment", "question", "compress", "taste"],
    title: "The salon",
    hook: "At a dinner the talk jumps from a novel to interest rates to opera. You know one of the three. What do you say in each?",
    minutes: 25,
    why: "Cultural possession is proved in conversation, not in quizzes. This session trains the moves that make a person good company among very different people: contribute precisely, ask when you don't know, correct without humiliating, and change register without changing who you are.",
    capability: "Contribute precisely when you know, ask a question that opens the other person up when you don't, correct a mistake without humiliating anyone, and explain one idea at four levels.",
    stakes: "The person people remember from a dinner is rarely the one who knew the most. It is the one after whom everyone else said something better.",
    bridge: "The missing step: in conversation the goal is the other person's understanding and interest, not your display. Every move can be judged by one question: does it make the next thing they say better?",
    connection: "Everything from the earlier seasons becomes speakable here: Karamazov's misquotation, the delay in a feedback loop, base rates at a dinner table.",
    vocab: {
      register: { name: "register", h: "The level of language you choose for your listener.", s: "مستوى الكلام: تكلم الطفل غير الأستاذ، بس نفس الفكرة.", t: "A variety of language defined by social situation and audience; switching register while keeping content is a mark of range, not inconsistency." },
      steelman: { name: "steelman", h: "Stating the other person's view at its strongest before you answer it.", s: "تقول رأي اللي قدامك أحسن من ما هو قاله، وبعدين ترد.", t: "The opposite of a straw man: a charitable reconstruction of an argument." },
      goodq: { name: "a good question", h: "One whose answer you could actually use or build on.", s: "سؤال لو اتجاوب هتعمل بيه حاجة، مش سؤال عشان تبان.", t: "A question with decision or model value to the asker (session 8's value of information, in conversation)." },
    },
    provenance: [
      { id: "aida", claim: "Verdi's Aida had its premiere at the Khedivial Opera House in Cairo on 24 December 1871.", source: "Standard opera history (checked by web search)", year: "1871", kind: "scholarship", license: "fact", grade: "A" },
      { id: "friedman", claim: "Milton Friedman argued that monetary policy acts with long and variable lags.", source: "Friedman M., testimony to the US Congress (1959) and later writing", year: "1959", kind: "scholarship", license: "fact", grade: "A" },
      { id: "nietzsche", claim: "'God is dead' is Nietzsche's, from The Gay Science (1882).", source: "Nietzsche F., Die fröhliche Wissenschaft §125", year: "1882", kind: "primary", license: "public domain", grade: "A" },
      { id: "sartre2", claim: "The sentence 'If God does not exist, everything is permitted' does not occur in The Brothers Karamazov; it is a later paraphrase (Sartre, 1945).", source: "See session 14 provenance", year: "1945", kind: "scholarship", license: "fact", grade: "A" },
      { id: "fathy", claim: "Hassan Fathy built New Gourna near Luxor in the 1940s with mud-brick Nubian vaults and domes.", source: "Fathy H., Gourna: A Tale of Two Villages (1969), republished as Architecture for the Poor (1973)", year: "1940s", kind: "scholarship", license: "fact", grade: "A" },
      { id: "dinner", claim: "The dinner, the guests and their lines are invented for teaching; the facts they mention are real and cited.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "s1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["dinner", "sartre2", "nietzsche"], atoms: ["judgment", "taste"], dialogue: [{ who: "A guest", say: "As Dostoevsky said: if God is dead, everything is permitted." }], stem: "Everyone turns to you; you know the novel. What do you say?", alt: "Which reply leaves the guest wanting to talk to you more, not less?", options: [
        { t: "“That line has a story of its own: it's not in the novel, it's Ivan's idea told second-hand. What drew you to it?”", ok: true, why: "Accurate, light, and it hands the conversation back. The error becomes an interesting fact instead of a humiliation." },
        { t: "“Technically Garnett renders it ‘lawful’, and ‘God is dead’ is Nietzsche; you've conflated two traditions.”", bug: "pretension", why: "Every fact is right and the delivery is a lecture: the guest now wants to leave the table." },
        { t: "“Exactly, that's the whole message of Dostoevsky, really: without God, anything goes.”", bug: "confirm", why: "Agreeing with a misquote to be pleasant spreads it, and it misreads the book." },
        { t: "“You really should read the book before you quote it at a dinner like this.”", bug: "moral", why: "True, perhaps, and it ends the conversation along with the friendship." },
      ] },
      { id: "s2", type: "scene", stage: "reveal", min: 2.5, src: ["dinner", "aida"], terms: ["goodq", "steelman"], title: "Four moves", body: "**Contribute** when you know: one precise fact or idea, then stop.\n\n**Ask** when you don't: a [[goodq|good question]] uses what you do know to open what they know.\n\n**Connect** without forcing: only when the link is real and short.\n\n**Correct gently:** fix the fact, keep the person's dignity, and give them somewhere to go next. When you disagree, [[steelman|steelman]] first.", reps: [{ kind: "story", label: "A connection that isn't forced", body: "Someone mentions opera; someone else mentions Egyptian history. The real link: Verdi's *Aida*, set in ancient Egypt, had its premiere in Cairo, at the Khedivial Opera House, on 24 December 1871. One sentence, then back to them." }, { kind: "counterexample", label: "Quote dumping", body: "Three quotations in a minute prove memory, not understanding, and leave the other person nothing to say. One line, in context, when it fits, does more." }] },
      { id: "s3", type: "q", kind: "predict", stage: "predict", min: 2, src: ["friedman", "dinner"], atoms: ["question", "systems"], dialogue: [{ who: "A banker", say: "The central bank has to keep raising rates until inflation comes down." }], stem: "You know little about monetary policy but a lot about feedback loops. What is your best move?", options: [
        { t: "Ask: “How long before a rate rise actually shows up in prices?”", ok: true, why: "It uses season 1's loops (a delay makes controllers overshoot) to ask a real question. Economists have argued about exactly this since Milton Friedman's “long and variable lags”." },
        { t: "Nod thoughtfully and say nothing until the subject changes", bug: "omission", why: "Safe and forgettable: you had a real question and kept it." },
        { t: "Say firmly that inflation is really just caused by corporate greed", bug: "pretension", why: "An opinion without knowledge, stated as fact: the opposite of range." },
        { t: "Change the subject to medicine, where you feel more confident", bug: "irrelevant", why: "It protects you and teaches you nothing; the banker's knowledge was the opportunity." },
      ] },
      { id: "s4", type: "model", stage: "model", min: 3, model: "register", terms: ["register"], title: "One idea, four listeners", body: "Pick the idea and the listener. The mechanism never changes; watch what does.", ask: "**Find** which parts stay identical across all four versions, and the first place the professor's version would lose the taxi driver." },
      {
        id: "s5", type: "contrast", stage: "contrast", min: 2.5, src: ["dinner"], atoms: ["judgment", "taste"], title: "Two guests who know a lot",
        left: { title: "Guest one", body: "Quotes three poets in a minute, corrects two people, and moves on to the next subject before anyone replies." },
        right: { title: "Guest two", body: "Asks you about your work, listens, and then connects it to something you had never heard of." },
        q: { stem: "Whom will people want to sit next to again, and why?", options: [
          { t: "The second: everyone's conversation got better around them", ok: true, why: "The measure of a conversational move is what the next person says. Knowledge that raises others is remembered as brilliance." },
          { t: "The first: quotations prove a cultivated mind", bug: "pretension", why: "They prove memory; the table learned nothing and said less." },
          { t: "Neither: showing any knowledge at dinner is rude", bug: "rigid", why: "Guest two shows a great deal of knowledge, in the service of the conversation." },
          { t: "The first: confidence is what people remember", bug: "surface", why: "They remember how they felt; guest one made them feel small." },
        ] },
      },
      { id: "s6", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["dinner"], atoms: ["question", "taste"], dialogue: [{ who: "A painter at her opening", say: "I hate explanations of art. You should just feel it." }], stem: "You'd like to understand her work better. What do you say?", options: [
        { t: "“Then what did you want people to notice first in this one?”", ok: true, why: "It respects her view (no lecture about explanation) and asks about her craft, the thing she most likes talking about." },
        { t: "“Actually, studies show that explanations increase appreciation.”", bug: "pretension", why: "Possibly true, and a debate she didn't ask for, at her own opening." },
        { t: "“I completely agree; analysis ruins art for everyone.”", bug: "confirm", why: "Agreement to please, and it closes the door you wanted open." },
        { t: "“Then why do you give your paintings titles at all?”", bug: "moral", why: "A clever gotcha: she'll remember it, not you." },
      ] },
      { id: "s7", type: "q", kind: "far", stage: "far", min: 1.5, atoms: ["calib", "judgment"], dialogue: [{ who: "An investor", say: "What's your customer acquisition cost in the second year?" }], stem: "You don't know. What do you say?", options: [
        { t: "“I don't know yet. Here's my best estimate, how I got it, and how I'll find out.”", ok: true, why: "Honest, calibrated and useful: the answer investors (and senior doctors) trust most." },
        { t: "Give a precise, confident number and move on quickly", bug: "pretension", why: "Fake certainty is discovered, and then everything else you said is discounted." },
        { t: "“That's not really the right question to ask at this stage.”", bug: "authority", why: "Deflection reads as not knowing and not admitting it." },
        { t: "“Nobody can know that for a new company.”", bug: "rigid", why: "Partly true, and it refuses the estimate that was actually possible." },
      ] },
      {
        id: "s8", type: "forge", stage: "forge", min: 3, title: "Your plan for the next dinner", body: "Four decisions, made before you walk in.",
        slots: [
          { key: "bring", label: "Bring", options: [{ t: "one story you know deeply (the Karamazov trial, the willow)", grade: "good", note: "One deep story beats ten facts.", say: "one story you know deeply" }, { t: "a list of impressive facts", grade: "bad", note: "Facts without a story are quote dumping.", say: "a list of facts" }] },
          { key: "ask", label: "Ask", options: [{ t: "one real question about someone's work", grade: "good", note: "People open up about what they do.", say: "one real question about their work" }, { t: "what they earn", grade: "bad", note: "A question that closes people.", say: "what they earn" }] },
          { key: "wrong", label: "When you learn you were wrong", options: [{ t: "say “I didn't know that — how does it work?”", grade: "good", note: "Being corrected well is a move too.", say: "“I didn't know that, how does it work?”" }, { t: "change the subject", grade: "weak", note: "You lose the best thing that happened.", say: "change the subject" }] },
          { key: "leave", label: "Leave with", options: [{ t: "one new question to look into", grade: "good", note: "Conversation compounding: the next session starts from it.", say: "one new question" }, { t: "a sense of having impressed people", grade: "bad", note: "Not the metric.", say: "having impressed people" }] },
        ],
        template: "Bring: **{bring}**. Ask: {ask}. When wrong: {wrong}. Leave with {leave}.",
        critique: { stem: "Someone says you're the most cultured person they've met. What does that tell you?", options: [{ t: "Little: compliments measure impression, not what they learned", ok: true, why: "The metric is whether the conversation got better, not how you were rated." }, { t: "That the plan worked perfectly", bug: "proxy", why: "A compliment is a proxy that rewards performance over conversation." }, { t: "That you should aim for this every time", bug: "proxy", why: "Optimising compliments produces the quote-dumping guest." }] },
      },
    ],
    challenge: { stem: "In conversation, the best test of any move you make is…", options: [{ t: "whether the next thing the other person says is better", ok: true }, { t: "whether you said something impressive", bug: "proxy" }, { t: "whether you avoided every mistake", bug: "rigid" }] },
    hooks: [
      { id: "salon.h1", gap: 1, q: { stem: "When the talk turns to something you don't know, the best move is usually…", options: [{ t: "a question that uses what you do know", ok: true }, { t: "a confident opinion", bug: "pretension" }, { t: "silence until it changes", bug: "omission" }] } },
      { id: "salon.h2", gap: 7, q: { stem: "Correcting a misquotation well means…", options: [{ t: "fixing the fact and giving them somewhere to go next", ok: true }, { t: "fixing it with every detail you know", bug: "pretension" }, { t: "letting it pass to be polite", bug: "confirm" }] } },
      { id: "salon.h3", gap: 30, q: { stem: "Changing register means changing…", options: [{ t: "the words and examples, not the mechanism", ok: true }, { t: "your opinions to match the listener", bug: "consistency" }, { t: "nothing: good ideas need one wording", bug: "rigid" }] } },
    ],
    deeper: [
      { title: "Range, not class", body: "The aim is not to sound upper-class; it is to be the same person with a taxi driver, a professor and a minister, choosing words for each. People trust that consistency more than any accent." },
      { title: "Real feedback, privately", body: "After a real conversation, the next session asks only whether you used the plan. Nothing about the other people is stored, and nothing is scored." },
      { title: "Open question", body: "Can conversation be practised well with invented dialogues? These items train the choice of move; only real dinners train timing and warmth." },
    ],
  });

  /* ─── 23 · Meaning made by the cut (film) ─── */
  sessions.push({
    id: "cut", primitive: "frame2", domain: "film", region: "Russia, Japan, Micronesia", works: ["tokyo-story"],
    atoms: ["represent", "falsify", "info", "orient"],
    title: "Meaning made by the cut",
    hook: "Two people talk in a café. The film cuts between their faces twenty times and you never lose track of who sits where. What invisible rule makes that possible?",
    minutes: 25,
    why: "Film is made of cuts, and a cut is a claim about space and meaning. This session trains you to see the most basic rule of editing, a master who broke it on purpose, and a famous “effect” whose evidence is thinner than its fame.",
    capability: "Read how cuts build a space the viewer can navigate, notice when a film breaks that rule deliberately, and check a famous effect against its evidence.",
    stakes: "Every screen you watch, from films to medical imaging, depends on conventions that keep left and right stable across views. People who see the convention also see when it is broken, by art or by error.",
    bridge: "The missing step: an imaginary line runs through the two people talking. Keep every camera on one side of it, and each person stays on the same side of the screen from shot to shot. Cross it, and they swap.",
    connection: "Season 2's representation sessions showed one picture making a pattern visible. A cut is a representation too: it decides what you infer between two images.",
    vocab: {
      axis: { name: "180° rule (line of action)", h: "Keep the camera on one side of the line between two people, so left and right stay the same.", s: "خط وهمي بين الاتنين: خليك في جنب واحد منه، عشان كل واحد يفضل في مكانه على الشاشة.", t: "Continuity editing convention: cameras stay within the 180° half-plane on one side of the axis of action, preserving screen direction and eyelines." },
      kuleshov: { name: "Kuleshov effect", h: "The claim that the same face seems to show different feelings depending on the shot before it.", s: "نفس الوش بيبان جعان أو حزين حسب اللقطة اللي قبله، أو كده بيقولوا.", t: "A context effect on the perception of facial expression in edited film, attributed to experiments by Lev Kuleshov around 1918–1921; replications give mixed, weaker results." },
      convention: { name: "convention", h: "A rule people agree to follow, not a law of nature.", s: "اتفاق بين الناس، مش قانون طبيعة: ممكن تكسره عن قصد.", t: "An arbitrary but shared rule whose value comes from everyone following it; it can be broken for effect." },
    },
    provenance: [
      { id: "rule", claim: "The 180-degree rule is a basic convention of continuity editing: cameras stay on one side of the axis between characters so that screen direction is preserved.", source: "Bordwell D. & Thompson K., Film Art: An Introduction (any edition)", year: "1979–", kind: "scholarship", license: "fact", grade: "A" },
      { id: "ozu", claim: "Ozu Yasujirō routinely cut across the axis, using what critics call 360-degree space, notably in Tokyo Story (1953).", source: "Bordwell D., Ozu and the Poetics of Cinema (1988); critics' accounts (checked by web search)", year: "1953", kind: "scholarship", license: "fact", grade: "A" },
      { id: "kul", claim: "Kuleshov is said to have intercut the same expressionless shot of the actor Ivan Mozzhukhin with a bowl of soup, a girl in a coffin and a woman on a divan, and audiences saw hunger, grief and desire. No footage survives, and the accounts (e.g. Pudovkin's, 1929) do not agree on the details.", source: "Accounts of Kuleshov and Pudovkin; histories of Soviet montage (checked by web search)", year: "c. 1918–1921", kind: "scholarship", license: "fact", grade: "B" },
      { id: "prince", claim: "A 1992 recreation found that most viewers saw no emotion in the neutral face.", source: "Prince S. & Hensley W.E., 'The Kuleshov effect: recreating the classic experiment', Cinema Journal 31:59", year: "1992", kind: "scholarship", license: "fact", grade: "A" },
      { id: "barratt", claim: "A 2016 replication with 36 participants found that context shifted how the neutral faces were rated for some emotions.", source: "Barratt D., Rédei A.C., Innes-Ker Å. & van de Weijer J., 'Does the Kuleshov effect really exist?', Perception 45:847", year: "2016", kind: "scholarship", license: "fact", grade: "A", contested: "Studies differ in design and result; the effect appears real but smaller and less consistent than the legend." },
      { id: "radio", claim: "Axial CT and MRI images are displayed as if viewed from the patient's feet, so the patient's right appears on the viewer's left (the radiological convention).", source: "Standard radiology teaching (checked by web search)", year: "—", kind: "scholarship", license: "fact", grade: "A" },
      { id: "etak", claim: "Navigators of Puluwat (Caroline Islands, Micronesia) track a voyage by imagining the canoe as still while a reference island moves backward under the rising and setting points of stars (etak).", source: "Gladwin T., East Is a Big Bird (Harvard, 1970); Hutchins E., 'Understanding Micronesian navigation' (1983)", year: "1970", kind: "scholarship", license: "fact", grade: "A" },
      { id: "phone", claim: "The phone-filming example is invented for teaching.", source: "Original teaching material", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "f1", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["rule"], atoms: ["represent", "orient"], stem: "Two people face each other across a table. After a shot over one shoulder, the next shot is taken from the far side of the table. What does the viewer feel?", options: [
        { t: "They seem to have swapped places; the viewer loses orientation", ok: true, why: "From the far side, left and right are reversed: the person who was on the left is now on the right. The viewer's mental map breaks." },
        { t: "Nothing: viewers don't notice where the camera stands", bug: "omission", why: "They don't notice the camera; they notice the actors jumping sides." },
        { t: "The scene feels more realistic, as if we moved around the room", bug: "inversion", why: "In a real room you'd see yourself walk round; on screen the jump is unexplained." },
        { t: "The two people seem to move closer together", bug: "surface", why: "Distance is unchanged; screen direction is what flips." },
      ] },
      { id: "f2", type: "scene", stage: "reveal", min: 2.5, src: ["rule", "ozu"], terms: ["axis", "convention"], title: "The invisible line", body: "Editors imagine a line through the two people: the [[axis|line of action]]. Keep every camera on one side, and person A stays on the left looking right, B on the right looking left, in every shot. Cuts become invisible.\n\nIt is a [[convention|convention]], not a law of vision. The Japanese director Ozu Yasujirō crossed the line constantly, notably in *Tokyo Story* (1953): characters swap sides from shot to shot, and critics describe his rooms as 360-degree spaces. The effect is not confusion but a strange calm, as if the camera had no side to take.", reps: [{ kind: "diagram", label: "From above", svg: "axis", body: "Two actors, the line, and a camera on one side. The next step lets you move the camera." }, { kind: "counterexample", label: "Breaking it on purpose", body: "Directors cross the line to make a moment disorienting, to show a shift in power, or, like Ozu, to refuse the viewer a fixed point of view. You can only see the choice if you know the rule." }] },
      { id: "f3", type: "model", stage: "model", min: 3.5, model: "axis", src: ["rule"], title: "Move the camera", body: "Walk the camera round the two actors. The box below shows what it sees.", ask: "**Find** the exact moment A and B swap sides on screen, and a camera position where you cannot tell them apart at all." },
      { id: "f4", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["kul"], terms: ["kuleshov"], atoms: ["falsify"], stem: "Around 1920 Lev Kuleshov reportedly cut one neutral close-up of an actor after a bowl of soup, a child in a coffin, and a woman on a divan. What did audiences reportedly see?", options: [
        { t: "Hunger, grief and desire in the same face", ok: true, why: "That is the famous report. The next step asks whether it is true." },
        { t: "The same neutral face every time", bug: "omission", why: "That is closer to what a 1992 recreation found, but not what the legend reports." },
        { t: "A badly acted scene", bug: "surface", why: "The story is that they praised the acting." },
        { t: "Three different actors", bug: "surface", why: "It was one shot of one actor, repeated." },
      ] },
      { id: "f5", type: "scene", stage: "reveal", min: 2.5, src: ["kul", "prince", "barratt"], title: "A famous effect, checked", body: "No footage of Kuleshov's experiment survives, and the people who described it later disagree about when and how it was done.\n\nWhen researchers tried it again, the results split. In a 1992 recreation most viewers saw **no** emotion in the neutral face. A 2016 study found that the preceding shot **did** shift how faces were rated, for some emotions. The honest summary: context colours faces, less reliably and less dramatically than the legend says.", reps: [{ kind: "story", label: "Why the legend grew", body: "It was a perfect story for a new art arguing that editing, not acting, makes meaning. Stories that serve a cause spread faster than the data behind them." }] },
      {
        id: "f6", type: "contrast", stage: "contrast", min: 2.5, src: ["radio", "rule"], atoms: ["analogy", "represent"], title: "A film set and a CT scanner",
        left: { title: "Film", body: "Every camera stays on one side of the line between the actors, so each keeps the same side of the screen." },
        right: { title: "Radiology", body: "Every axial scan is shown as if seen from the patient's feet: the patient's right always on the viewer's left." },
        q: { stem: "What do the two conventions share?", options: [
          { t: "A fixed viewpoint rule, so that left and right survive every cut or slice", ok: true, why: "Both exist so a viewer can build one stable map from many images. Break either, and people misread sides, which in radiology can mean the wrong side." },
          { t: "Both are about making images brighter and sharper", bug: "surface", why: "Neither affects image quality; both fix orientation." },
          { t: "Both are laws of optics that cannot be broken", bug: "rigid", why: "Both are conventions: Ozu breaks one, and neurology departments once used the opposite display." },
          { t: "Nothing: one is art and the other is medicine", bug: "surface", why: "Different purposes, one mechanism." },
        ] },
      },
      { id: "f7", type: "q", kind: "transfer", stage: "transfer", min: 2, src: ["phone"], terms: ["axis"], atoms: ["represent", "orient"], stem: "You film two relatives arguing across a table with one phone. You filmed A from behind B's left shoulder. Where do you stand to film B?", options: [
        { t: "Behind A, on the same side of the line you started on", ok: true, why: "Stay on your side of the line between them, and the two shots cut together without anyone seeming to swap places." },
        { t: "Anywhere on the far side of the table, for variety", bug: "surface", why: "Crossing the line makes A and B seem to swap sides." },
        { t: "Directly between them, facing B", bug: "omission", why: "Now you are on the line itself, and the next cut will confuse." },
        { t: "It doesn't matter with only one camera", bug: "omission", why: "The rule is about positions across shots, however many cameras you own." },
      ] },
      { id: "f8", type: "q", kind: "far", stage: "far", min: 2, src: ["etak"], atoms: ["represent", "orient"], stem: "Navigators of Puluwat, in Micronesia, cross open ocean without instruments. They describe the canoe as still, while a reference island off to the side slides backward under the rising points of known stars. Why choose that picture?", options: [
        { t: "It turns progress into something visible: the island moving from star to star", ok: true, why: "A frame in which the thing you track moves against a fixed background makes position readable at a glance: the same job the 180° rule and the radiology convention do." },
        { t: "Because they did not know that the canoe was the thing moving", bug: "moral", why: "They know perfectly well; the frame is a tool, as a map's north-up is." },
        { t: "Because islands in the Pacific really do drift", bug: "surface", why: "They don't; the motion is in the representation." },
        { t: "It is only a story told to children", bug: "surface", why: "It is working navigation, studied in detail by anthropologists." },
      ] },
      {
        id: "f9", type: "forge", stage: "forge", min: 3, title: "A shot plan for a two-person scene", body: "Your next video of two people: a demonstration, an interview, a family scene.",
        slots: [
          { key: "line", label: "First", options: [{ t: "decide where the line between them runs", grade: "good", note: "Everything else follows from it.", say: "decide where the line runs" }, { t: "start filming and fix it in editing", grade: "bad", note: "Crossed lines can't be fixed in editing.", say: "fix it later" }] },
          { key: "shots", label: "Shots", options: [{ t: "a wide shot, then over-the-shoulder shots from one side", grade: "good", note: "The wide shot gives the map; the others stay on it.", say: "a wide shot, then shoulders from one side" }, { t: "close-ups from anywhere", grade: "weak", note: "Without a map, viewers guess.", say: "close-ups from anywhere" }] },
          { key: "cross", label: "If you must cross the line", options: [{ t: "show the camera moving across it, or cut to a shot on the line", grade: "good", note: "The viewer sees the move, so the map updates.", say: "move across it on camera" }, { t: "just cut", grade: "bad", note: "A jump the viewer can't follow.", say: "just cut" }] },
          { key: "check", label: "Check", options: [{ t: "watch it without sound: is it always clear who is where?", grade: "good", note: "Orientation must work on pictures alone.", say: "watch without sound" }, { t: "ask if it looks cinematic", grade: "weak", note: "Not a criterion.", say: "does it look cinematic" }] },
        ],
        template: "First: **{line}**. Shots: {shots}. Crossing: {cross}. Check: {check}.",
        critique: { stem: "A friend says a famous effect “proves editing controls emotion”. What do you say?", options: [{ t: "“It shows context colours faces, but the evidence is weaker than the legend.”", ok: true, why: "Accurate to the replications: an effect, not a law." }, { t: "“Yes, Kuleshov proved it conclusively in 1920.”", bug: "authority", why: "The footage is lost and the replications disagree." }, { t: "“No, it's been completely debunked.”", bug: "gain", why: "Over-correction: some replications do find an effect." }] },
      },
    ],
    challenge: { stem: "A film cuts from a camera on one side of two actors to one on the other side. On screen the actors…", options: [{ t: "swap sides", ok: true }, { t: "move closer together", bug: "surface" }, { t: "stay exactly where they were", bug: "omission" }] },
    hooks: [
      { id: "cut.h1", gap: 1, q: { stem: "The 180° rule keeps cameras on one side of…", options: [{ t: "the line between the two people", ok: true }, { t: "the room's back wall", bug: "surface" }, { t: "the brightest light", bug: "surface" }] } },
      { id: "cut.h2", gap: 7, poss: { "tokyo-story": "context" }, q: { stem: "Ozu Yasujirō is known for…", options: [{ t: "crossing the line on purpose, making 360° rooms", ok: true }, { t: "inventing the 180° rule", bug: "inversion" }, { t: "filming only with a moving camera", bug: "surface" }] } },
      { id: "cut.h3", gap: 30, q: { stem: "The honest summary of the Kuleshov effect is…", options: [{ t: "context shifts how faces are read, less than the legend says", ok: true }, { t: "it has been proved beyond doubt", bug: "authority" }, { t: "it was a hoax", bug: "gain" }] } },
    ],
    deeper: [
      { title: "Watch this next", body: "Any conversation scene in Ozu's *Tokyo Story* (1953): watch where each person sits on the screen from shot to shot. Then watch a conversation in any Hollywood film of the same decade. One minute of each is enough to see two philosophies of space." },
      { title: "Your scans", body: "Some neurological departments historically displayed brain images the other way round (the patient's right on the right). Conventions coexisting is exactly when left and right get confused: always check the marker on the image." },
      { title: "Open question", body: "How much of what films make us feel comes from editing and how much from the actors? The Kuleshov replications suggest both matter, in proportions nobody has pinned down." },
    ],
  });

  /* ─── 24 · Why an arch stands ─── */
  sessions.push({
    id: "arch", primitive: "funicular", domain: "architecture", region: "England, Spain and Egypt", works: ["new-gourna"],
    atoms: ["mech", "constraint", "systems", "recomb"],
    title: "Why an arch stands",
    hook: "Hang a chain between two nails and turn the curve upside down: you have the strongest shape for an arch. How can a hanging chain know how to build?",
    minutes: 26,
    why: "Architecture as forces you can see: once you see where a building pushes and pulls, every arch, dome and vault becomes readable. And the best modern example of this ancient idea is Egyptian: Hassan Fathy's mud-brick vaults at New Gourna, near Luxor.",
    capability: "See where the forces run in a structure, predict which shape stands with the least material, and read a building's form as the answer to its load.",
    stakes: "Buildings are the largest objects most people ever read. Seeing their forces turns a walk through Cairo into a lesson in why each shape is there.",
    bridge: "The missing step: a hanging chain can only pull (tension), so it takes exactly the shape in which every link pulls along the chain. Flip it, and every stone pushes along the curve (compression). Stone and brick are strong in compression and weak in tension.",
    connection: "Season 2's three boxes found the one constraint that shapes a flow. Here gravity is the constraint and the chain finds the shape that obeys it: a physical computer.",
    vocab: {
      compression: { name: "compression and tension", h: "Pushing together and pulling apart.", s: "الضغط والشد: الحجر بيستحمل الضغط وبيتكسر من الشد.", t: "Axial stresses; masonry has high compressive and negligible tensile strength, so masonry forms must keep the line of thrust within the material." },
      funicular: { name: "funicular shape", h: "The shape a hanging chain or rope takes under its loads.", s: "الشكل اللي السلسلة بتاخده لما تتعلق بالحِمل اللي عليها.", t: "The form of a cable in pure tension under a given load; inverted, the form of an arch in pure compression under the same load (Hooke 1675)." },
      thrust: { name: "line of thrust", h: "The path the push takes through an arch.", s: "الطريق اللي الضغط بيمشي فيه جوه القوس.", t: "The locus of resultant compressive forces through the voussoirs; an arch is stable while it stays within the section (Heyman)." },
      vault: { name: "Nubian vault", h: "A brick vault built without any wooden support, each course leaning on the last.", s: "قبو نوبي: طوب بيتبني مايل على بعضه من غير خشب يسنده.", t: "A vault of inclined courses of mud brick laid against an end wall, requiring no centring; revived by Hassan Fathy." },
    },
    provenance: [
      { id: "hooke", claim: "Hooke published his solution for the form of arches as a Latin anagram in 1675; his executor decoded it in 1705.", source: "Hooke R., A Description of Helioscopes (1675); Block P., DeJong M. & Ochsendorf J., 'As hangs the flexible line', Nexus Network Journal 8:13 (2006)", year: "1675", kind: "primary", license: "public domain", grade: "A" },
      { id: "q.hooke", claim: "“ut pendet continuum flexile, sic stabit contiguum rigidum inversum” — registered in the quote register.", source: "Hooke (1675/1705)", year: "1675", kind: "primary", license: "public domain", grade: "A" },
      { id: "heyman", claim: "A semicircular masonry arch under its own weight needs a thickness of roughly a tenth of its radius (about 0.106–0.108 of the radius) to stand.", source: "Heyman J., 'The safety of masonry arches', International Journal of Mechanical Sciences 11:363 (1969), and later corrections", year: "1969", kind: "scholarship", license: "fact", grade: "A" },
      { id: "gaudi", claim: "For the church of the Colònia Güell, Gaudí built a hanging model of strings weighted with small sacks at 1:10 scale, photographed it and inverted the image.", source: "Standard accounts of Gaudí's method (checked by web search)", year: "1898–1908", kind: "scholarship", license: "fact", grade: "A" },
      { id: "fathy", claim: "Hassan Fathy built New Gourna near Luxor in the 1940s with Nubian vaults and domes of mud brick, built without timber centring, and described the project in Gourna: A Tale of Two Villages (1969), republished as Architecture for the Poor (1973).", source: "Fathy H. (1969/1973); checked by web search", year: "1940s", kind: "scholarship", license: "fact", grade: "A" },
      { id: "cable", claim: "A cable carrying a load spread evenly along the horizontal (like a suspension bridge's deck) hangs close to a parabola; a chain loaded only by its own weight hangs in a catenary.", source: "Standard statics", year: "—", kind: "scholarship", license: "fact", grade: "A" },
      { id: "chaincalc", claim: "The chain in the model is computed live as a hanging chain of 24 links; the rooftop and egg examples are for teaching.", source: "Original", year: "2026", kind: "original", license: "original", grade: "A" },
    ],
    steps: [
      { id: "a1", type: "q", kind: "predict", stage: "predict", min: 2, src: ["hooke"], atoms: ["mech", "constraint"], stem: "Which arch can be the thinnest and still stand under its own weight?", alt: "Stone crushes only under enormous force, but a thin stone beam cracks easily when bent. Which shape avoids bending?", options: [
        { t: "The curve of a hanging chain, turned upside down", ok: true, why: "The chain hangs where every link only pulls; flipped, every stone only pushes. No bending, so the least material." },
        { t: "A perfect half-circle, like a Roman arch", bug: "surface", why: "Romans built half-circles, but thick: the push strays from the middle of the stones, so it needs more material." },
        { t: "A flat stone beam across the gap", bug: "omission", why: "A beam bends, and stone cracks in tension on its underside." },
        { t: "Any shape at all, if the stones are heavy enough", bug: "surface", why: "Weight without the right shape only adds to the push that breaks it." },
      ] },
      { id: "a2", type: "passage", stage: "primary", min: 1, src: ["q.hooke", "hooke"], quotes: ["hooke"], label: "PRIMARY SOURCE", title: "Hooke's anagram, 1675", body: "Hooke hid his discovery as a scrambled Latin sentence, a way of claiming it without giving it away. Decoded by his executor in 1705, it reads:" },
      { id: "a3", type: "scene", stage: "reveal", min: 2.5, src: ["hooke", "gaudi"], terms: ["compression", "funicular"], title: "A physical computer", body: "A chain can only pull, so under its own weight it settles into the one shape in which every link pulls straight along the chain: its [[funicular|funicular shape]]. Turn that shape upside down and every stone pushes straight along the curve: pure [[compression|compression]], which stone and brick carry easily.\n\nAntoni Gaudí used this as a design method. For the church of the Colònia Güell he hung strings weighted with little sacks, at a tenth of full size, photographed them, and turned the photographs upside down. Gravity did the calculation.", reps: [{ kind: "diagram", label: "Chain and arch", svg: "chainArch", body: "The chain above, the same curve flipped below. The next step lets you add a weight and compare with a half-circle." }, { kind: "analogy", label: "In your hand", body: "Hold a necklace by its two ends and look at the curve. Now imagine it frozen and flipped: that is the arch that needs the least stone." }] },
      { id: "a4", type: "model", stage: "model", min: 3.5, model: "chain", src: ["chaincalc", "heyman"], terms: ["thrust"], title: "Hang, flip, load", body: "Change how far the chain sags, hang a weight at its middle, and compare with a half-circle.", ask: "**Find** what a heavy weight at the middle does to the ideal arch's shape, and where the half-circle departs from the chain's curve most." },
      { id: "a5", type: "q", kind: "predict", stage: "predict", min: 1.5, src: ["chaincalc"], atoms: ["mech", "predict"], stem: "Now a heavy statue stands on the arch's crown. How should the ideal shape change?", options: [
        { t: "It becomes pointed at the top, like a chain with a weight hung at its middle", ok: true, why: "A concentrated load bends the chain into a point; the arch that carries it without bending is pointed too." },
        { t: "It should become flatter, to spread the load", bug: "inversion", why: "Flatter arches push harder sideways and bend more under a point load." },
        { t: "It should stay exactly the same shape, only thicker", bug: "omission", why: "Thickness buys safety; the ideal shape itself changes with the load." },
        { t: "It should become a perfect half-circle", bug: "surface", why: "A half-circle is the ideal shape for no common load." },
      ] },
      {
        id: "a6", type: "contrast", stage: "contrast", min: 2.5, src: ["gaudi", "fathy"], terms: ["vault"], atoms: ["analogy", "recomb"], poss: { "new-gourna": "compare" }, title: "Barcelona and Luxor",
        left: { title: "Gaudí, 1898–1908", body: "Weighted strings hung from a ceiling find the shapes; the church's columns and vaults follow them." },
        right: { title: "Hassan Fathy, 1940s", body: "At New Gourna near Luxor, masons built [[vault|Nubian vaults]] of mud brick without any wooden support, each course leaning on the one before." },
        q: { stem: "What do both depend on?", options: [
          { t: "Shapes that keep every brick or stone in compression", ok: true, why: "Gaudí found the shapes by hanging; Nubian masons carried them in their hands. Both need no steel because nothing is in tension." },
          { t: "Expensive modern materials hidden inside the walls", bug: "surface", why: "The whole point: mud brick and stone, nothing else." },
          { t: "Computers that calculate the loads", bug: "surface", why: "Gaudí used strings; the Nubian vault is centuries older than computers." },
          { t: "Nothing: one is a cathedral and the other a village", bug: "surface", why: "Different budgets and purposes; one structural idea." },
        ] },
      },
      { id: "a7", type: "q", kind: "transfer", stage: "transfer", min: 1.5, src: ["cable"], atoms: ["mech", "abstr"], stem: "A suspension bridge's main cable carries a flat road hung beneath it. What shape does the cable take, and why?", options: [
        { t: "Close to a parabola: the load is spread evenly along the road, not along the cable", ok: true, why: "The shape follows the load. The chain's own weight gives a catenary; an even load along the horizontal deck gives a parabola." },
        { t: "A circle, because the circle is the strongest curve", bug: "surface", why: "No single curve is strongest; the best shape follows the load." },
        { t: "A straight line, pulled as tight as possible", bug: "omission", why: "A straight cable could carry no weight at all without infinite tension." },
        { t: "Exactly a catenary, like any hanging chain", bug: "gain", why: "Only if the cable carried nothing but itself." },
      ] },
      { id: "a8", type: "q", kind: "far", stage: "far", min: 1.5, src: ["chaincalc"], terms: ["compression"], atoms: ["mech", "systems"], stem: "Why is an egg hard to crush when you squeeze it end to end in your palm, yet cracks easily on the rim of a bowl?", options: [
        { t: "An even squeeze keeps the curved shell in compression; a sharp edge bends it locally", ok: true, why: "The shell is a dome: strong while the push runs through it, weak where a point load makes it bend and pull." },
        { t: "The bowl's rim is harder than a hand", bug: "surface", why: "Your palm could press harder; the difference is how the force is spread." },
        { t: "Eggshells are weakest at the ends", bug: "inversion", why: "The ends are the most curved and resist best." },
        { t: "Squeezing warms the egg, which makes it stronger", bug: "irrelevant", why: "Temperature plays no part." },
      ] },
      {
        id: "a9", type: "forge", stage: "forge", min: 3, title: "Shade for a Cairo rooftop, without steel", body: "An invention in five decisions: problem, constraint, mechanism, prototype, and what would prove it wrong.",
        slots: [
          { key: "mech", label: "Mechanism", options: [{ t: "a shallow vault whose curve comes from a hanging chain", grade: "good", note: "Compression only: mud brick or tile can carry it.", say: "a vault shaped by a hanging chain" }, { t: "a flat slab of brick", grade: "bad", note: "It bends and cracks: brick has no tensile strength.", say: "a flat brick slab" }] },
          { key: "air", label: "Air", options: [{ t: "a wind catcher (malqaf) facing the prevailing breeze", grade: "good", note: "Fathy's other tool: moving air without machines.", say: "a wind catcher" }, { t: "no openings, to keep the heat out", grade: "weak", note: "Still air under a hot roof becomes an oven.", say: "no openings" }] },
          { key: "proto", label: "Prototype", options: [{ t: "hang a chain at 1:10 and build a paper model from the curve", grade: "good", note: "Gaudí's method in an afternoon.", say: "a 1:10 chain and paper model" }, { t: "build it full size and see", grade: "bad", note: "The most expensive way to find a mistake.", say: "full size straight away" }] },
          { key: "fail", label: "What would show it's failing", options: [{ t: "cracks opening at the crown or the base", grade: "good", note: "The line of thrust is leaving the section.", say: "cracks at the crown or base" }, { t: "it looks old", grade: "bad", note: "Not a structural signal.", say: "it looks old" }] },
        ],
        template: "Mechanism: **{mech}**. Air: {air}. Prototype: {proto}. Failing if: {fail}.",
        critique: { stem: "Your vault shows a crack opening on the inside at the crown. What does it mean?", options: [{ t: "The push is leaving the brick there: the shape doesn't match its load", ok: true, why: "A crack opening is tension where there should be none: reshape (or thicken) to bring the line of thrust back inside." }, { t: "Mud brick always cracks; ignore it", bug: "rigid", why: "Hairline shrinkage is normal; a crack that opens under load is information." }, { t: "Add more weight on top to close it", bug: "surface", why: "Sometimes it helps, sometimes it breaks it: without knowing where the push runs, it's a gamble." }] },
      },
    ],
    challenge: { stem: "A hanging chain is in pure tension. The same curve, flipped, is in pure…", options: [{ t: "compression", ok: true }, { t: "tension", bug: "consistency" }, { t: "bending", bug: "surface" }] },
    hooks: [
      { id: "arch.h1", gap: 1, q: { stem: "Stone and brick are strong in…", options: [{ t: "compression, and weak in tension", ok: true }, { t: "tension, and weak in compression", bug: "inversion" }, { t: "both equally", bug: "surface" }] } },
      { id: "arch.h2", gap: 7, q: { stem: "A heavy load at the crown makes the ideal arch…", options: [{ t: "pointed at the top", ok: true }, { t: "flatter", bug: "inversion" }, { t: "a half-circle", bug: "surface" }] } },
      { id: "arch.h3", gap: 30, poss: { "new-gourna": "context" }, q: { stem: "Hassan Fathy's vaults at New Gourna were built…", options: [{ t: "of mud brick, without wooden support", ok: true }, { t: "of reinforced concrete", bug: "surface" }, { t: "of stone cut by machines", bug: "surface" }] } },
    ],
    deeper: [
      { title: "Go and see it", body: "New Gourna stands on Luxor's west bank, near the Theban necropolis; parts of Fathy's village survive, with its domes and vaults. In Cairo, the pointed arches of the Mosque of Ibn Tulun (876–879) stand on thick brick piers: look at how the piers take the sideways push." },
      { title: "Why the half-circle survived", body: "Roman builders used half-circles for millennia because they are easy to set out with a rope and a peg, and thick walls absorbed the difference. Easy to build can beat ideal." },
      { title: "Open question", body: "Could mud-brick vaults be a modern answer for hot cities, given their low cost and thermal mass? Advocates and critics still argue about maintenance, rain and social acceptance." },
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
