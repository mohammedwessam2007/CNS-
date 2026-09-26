/* INTELLECTUALITY v17.3 · Histology of nervous tissue: the neuron and its organelles and stains, neuron shapes,
 * neuroglia, the peripheral nerve with degeneration and regeneration, and the sensory nerve endings. Drawn from
 * standard histology (Junqueira / the department's book) in the notes' own wording (learn-notes-hist-v15.js).
 * Every structure the MCQ explanations name has a part here, so the answer figure can mark it.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { smooth, poly, chaikin } = A;
  const { T, pf, ps, fl } = A.kit;
  const blob = (pts) => smooth(pts, true);
  const ell = (id, cx, cy, rx, ry, c, r, rot) => '<ellipse class="pf" data-p="' + id + '" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + " " + cx + " " + cy + ')"' : "") + ' style="--c:' + c + ";--r:" + r + '"/>';
  const dot = (x, y, r, fill) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" pointer-events="none"/>';
  const ld = (x1, y1, x2, y2) => '<path class="ld" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '"/>';

  /* ═══════════════ 1. NEURON: organelles, processes, synapses and stains ═══════════════ */
  (function () {
    const SOMA = [[96, 170], [104, 148], [124, 134], [150, 131], [172, 141], [187, 160], [191, 184], [186, 210], [168, 230], [141, 238], [116, 231], [100, 213], [92, 191]];
    const NISSL = [[110, 160, 20], [124, 146, -15], [160, 145, 30], [175, 162, 70], [110, 207, -30], [126, 223, 10], [157, 224, -20], [173, 210, 40], [102, 188, 80], [178, 184, 90]];
    const nissl = NISSL.map(([x, y, r]) => '<path class="pf" data-p="nissl" d="' + blob([[x - 6, y - 1], [x - 2, y - 4], [x + 5, y - 3], [x + 7, y + 1], [x + 1, y + 4], [x - 5, y + 3]]) + '" transform="rotate(' + r + " " + x + " " + y + ')" style="--c:#4d7cff;--r:#3a4fa8"/>').join("");
    // Nissl bodies also in the dendrite trunks (not in the hillock or axon)
    const nisslD = [[124, 118, 80], [86, 144, 30], [80, 194, 0], [96, 236, -50], [142, 254, 85]].map(([x, y, r]) => '<path class="pf" data-p="nissl" d="' + blob([[x - 4, y - 1], [x, y - 3], [x + 4, y - 1], [x + 3, y + 2], [x - 3, y + 2]]) + '" transform="rotate(' + r + " " + x + " " + y + ')" style="--c:#4d7cff;--r:#3a4fa8"/>').join("");
    const dend =
      ps("dend", "M128 136 C124 112 118 92 112 70", "#7bed9f", "#c9b8a8", 7) + ps("dend", "M114 84 C104 72 92 66 78 60", "#7bed9f", "#c9b8a8", 4) + ps("dend", "M112 70 C114 56 118 46 124 32", "#7bed9f", "#c9b8a8", 3.4) + ps("dend", "M80 61 C70 50 64 42 60 30", "#7bed9f", "#c9b8a8", 2.4) +
      ps("dend", "M104 150 C84 136 66 124 44 118", "#7bed9f", "#c9b8a8", 6.4) + ps("dend", "M60 122 C50 108 42 100 32 92", "#7bed9f", "#c9b8a8", 3.4) + ps("dend", "M50 119 C38 120 28 124 16 130", "#7bed9f", "#c9b8a8", 2.6) +
      ps("dend", "M94 192 C72 193 50 197 24 203", "#7bed9f", "#c9b8a8", 6) + ps("dend", "M48 197 C38 186 30 180 18 176", "#7bed9f", "#c9b8a8", 2.8) +
      ps("dend", "M104 222 C88 242 72 260 56 280", "#7bed9f", "#c9b8a8", 6) + ps("dend", "M70 262 C56 262 44 266 30 274", "#7bed9f", "#c9b8a8", 3) + ps("dend", "M57 279 C54 294 52 304 50 318", "#7bed9f", "#c9b8a8", 2.6) +
      ps("dend", "M140 238 C142 262 146 284 150 308", "#7bed9f", "#c9b8a8", 6) + ps("dend", "M146 290 C160 300 170 312 176 328", "#7bed9f", "#c9b8a8", 3) + ps("dend", "M150 307 C148 322 146 334 142 348", "#7bed9f", "#c9b8a8", 2.6);
    // spines on the distal dendrites (synapse sites)
    const spines = [[118, 48, -1], [121, 40, 1], [70, 48, -1], [66, 40, 1], [38, 104, -1], [26, 126, 1], [36, 270, 1], [52, 300, -1], [166, 312, 1], [172, 320, -1], [146, 328, 1]]
      .map(([x, y, s]) => '<path class="ps" data-p="spine" d="M' + x + " " + y + " l" + 6 * s + ' -3" style="--c:#d9ff43;--r:#c9b8a8;--w:1.4"/><circle class="pf" data-p="spine" cx="' + (x + 7 * s) + '" cy="' + (y - 3.5) + '" r="1.8" style="--c:#d9ff43;--r:#c9b8a8"/>')
      .join("");
    const golgi = [[138, 154, 0], [112, 180, -80], [164, 180, 80], [138, 212, 180], [118, 200, -130], [158, 164, 40]].map(([x, y, r]) => '<path class="ps" data-p="golgi" d="M' + (x - 7) + " " + y + " q7 -5 14 0 M" + (x - 6) + " " + (y + 3) + " q6 -4 12 0 M" + (x - 5) + " " + (y + 6) + ' q5 -3 10 0" transform="rotate(' + r + " " + x + " " + y + ')" style="--c:#ffd166;--r:#a98a4e;--w:1.2"/>').join("");
    const mito = [[118, 172, 30], [166, 198, -30], [130, 232, 0], [172, 150, 60]].map(([x, y, r]) => ell("mito", x, y, 4.6, 2.2, "#ff9f43", "#b0704a", r)).join("");
    const lipo = [[108, 222], [112, 226], [104, 226], [110, 230], [115, 219]].map(([x, y]) => '<circle class="pf" data-p="lipo" cx="' + x + '" cy="' + y + '" r="2.1" style="--c:#ffb000;--r:#9c6b2a"/>').join("");
    const nfib = ps("nfib", "M98 176 C124 168 158 170 196 188", "#b39cff", "#b8a4c8", 0.9) + ps("nfib", "M104 208 C130 200 166 198 200 192", "#b39cff", "#b8a4c8", 0.9) + ps("nfib", "M128 138 C132 160 136 176 140 236", "#b39cff", "#b8a4c8", 0.9) + ps("nfib", "M214 190 L430 190", "#b39cff", "#0000", 0.9);
    // axon with myelin (Schwann cells), nodes, collateral and terminals on a second neuron
    const MY = [[244, 300], [308, 364], [372, 426]];
    const myel = MY.map(([a, b]) => '<rect class="pf" data-p="myel" x="' + a + '" y="183" width="' + (b - a) + '" height="14" rx="7" style="--c:#f7f7f7;--r:#ece3cf"/>').join("");
    const schw = MY.map(([a, b]) => ell("schw", (a + b) / 2, 180.5, 9, 3.4, "#ff5d8f", "#c78fa3")).join("");
    const nodes = [[300, 308], [364, 372]].map(([a, b]) => '<rect class="pf" data-p="node" x="' + a + '" y="186" width="' + (b - a) + '" height="8" rx="2" style="--c:#d9ff43;--r:#6c7f96"/>').join("");
    const target =
      '<path d="' + blob([[312, 300], [330, 292], [350, 296], [360, 312], [356, 332], [338, 342], [318, 336], [308, 318]]) + '" fill="#57465a" stroke="#8a7690" stroke-width=".8" pointer-events="none"/>' +
      '<path d="M318 298 C306 284 298 272 290 250" stroke="#57465a" stroke-width="6" fill="none" stroke-linecap="round" pointer-events="none"/>' +
      '<path d="M358 326 L374 334 L398 336" stroke="#57465a" stroke-width="3.6" fill="none" stroke-linecap="round" pointer-events="none"/>' +
      T(334, 320, "next neuron", "sm mut");
    const axon =
      pf("hill", "M186 170 C190 180 190 198 186 208 L214 194 L214 186 Z", "#66e9ff", "#e9dccb") +
      ps("iseg", "M214 190 L244 190", "#66e9ff", "#c9b8a8", 3.4) +
      ps("axon", "M300 190 L308 190 M364 190 L372 190 M426 190 C446 194 456 214 454 240 C452 252 448 258 440 264", "#66e9ff", "#c9b8a8", 3) +
      '<path d="M244 190 L426 190" stroke="#c9b8a8" stroke-width="3" pointer-events="none"/>' +
      myel + nodes + schw +
      ps("coll", "M304 194 C302 222 298 246 292 262", "#ff9f43", "#c9b8a8", 2) +
      ps("telo", "M440 264 C420 282 392 294 364 300 M440 264 C444 296 424 326 404 336", "#ff9f43", "#c9b8a8", 2) +
      target +
      '<circle class="pf" data-p="axd" cx="291" cy="266" r="5.4" style="--c:#ff9f43;--r:#e0b27c"/>' +
      '<circle class="pf" data-p="axs" cx="360" cy="300" r="5.4" style="--c:#ff9f43;--r:#e0b27c"/>' +
      '<circle class="pf" data-p="axa" cx="400" cy="336" r="5.4" style="--c:#ff9f43;--r:#e0b27c"/>';
    // synapse inset: chemical (20–30 nm) and electrical (gap junction 2–3 nm)
    const ins =
      '<rect x="258" y="24" width="216" height="136" rx="12" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' +
      T(312, 38, "CHEMICAL SYNAPSE", "sm mut") + T(438, 38, "ELECTRICAL", "sm mut") +
      pf("pre", "M268 46 L356 46 L356 84 C338 90 286 90 268 84 Z", "#ff9f43", "#8a6a4d") +
      [[282, 60], [294, 55], [306, 61], [290, 70], [318, 56], [330, 64], [342, 72], [304, 76], [320, 74], [280, 76]].map(([x, y]) => '<circle class="pf" data-p="sv" cx="' + x + '" cy="' + y + '" r="3.6" style="--c:#d9ff43;--r:#e7d9a8"/>').join("") +
      ell("mito", 345, 56, 7, 3.2, "#ff9f43", "#c5835a", 20) +
      pf("cleft", "M268 87 C286 92 338 92 356 87 L356 95 C338 99 286 99 268 95 Z", "#66e9ff", "#1a2d44") +
      pf("postm", "M268 98 C286 102 338 102 356 98 L356 146 L268 146 Z", "#b39cff", "#4b3b5c") +
      pf("psd", "M278 101 C292 104 332 104 346 101 L346 108 C332 111 292 111 278 108 Z", "#ff5d8f", "#8f4f6f") +
      [288, 302, 316, 330].map((x) => '<rect class="pf" data-p="rec" x="' + (x - 3) + '" y="96" width="6" height="9" rx="2" style="--c:#5ef0a0;--r:#5f8c77"/>').join("") +
      '<path d="M362 86 L362 97" stroke="#e9f1fb" stroke-width="1" marker-start="url(#ixArr)" marker-end="url(#ixArr)" pointer-events="none"/>' + T(366, 95, "20–30 nm", "sm", "start") +
      '<rect x="410" y="46" width="56" height="42" rx="6" fill="#8a6a4d" pointer-events="none"/><rect x="410" y="98" width="56" height="42" rx="6" fill="#4b3b5c" pointer-events="none"/>' +
      [420, 438, 456].map((x) => '<rect class="pf" data-p="gap" x="' + (x - 4) + '" y="84" width="8" height="18" rx="2" style="--c:#66e9ff;--r:#8fd3ff"/>').join("") +
      T(438, 152, "gap junction 2–3 nm", "sm") + T(312, 156, "postsynaptic membrane", "sm mut");
    const svg = () =>
      '<text class="ttl" x="130" y="16" text-anchor="middle">MULTIPOLAR NEURON · ORGANELLES AND PROCESSES</text>' +
      dend +
      spines +
      pf("soma", blob(SOMA), "#e9dccb", "#e9dccb") +
      nisslD +
      nissl +
      '<circle class="pf" data-p="nuc" cx="138" cy="184" r="23" style="--c:#8fd3ff;--r:#f7f2ea;--rs:#8e7f6e"/>' +
      '<circle class="pf" data-p="ncl" cx="142" cy="180" r="6.4" style="--c:#ff5d8f;--r:#6d4a63"/>' +
      golgi +
      mito +
      lipo +
      nfib +
      axon +
      ins +
      // labels
      T(58, 24, "dendrites", "sm", "middle") + T(60, 56, "spines", "sm", "end") + ld(62, 54, 68, 46) +
      T(208, 150, "axon hillock", "sm", "start") + ld(210, 152, 200, 180) +
      T(218, 214, "initial segment", "sm", "start") + ld(224, 208, 230, 194) +
      T(270, 176, "myelin (internode)", "sm", "middle") + T(304, 214, "node of Ranvier", "sm", "start") + ld(306, 210, 304, 196) +
      T(399, 172, "Schwann cell", "sm", "middle") + T(310, 238, "collateral", "sm", "start") +
      T(470, 262, "terminal buttons", "sm", "end") +
      T(282, 270, "axodendritic", "sm", "end") + T(372, 308, "axosomatic", "sm", "start") + T(412, 350, "axoaxonic", "sm", "middle") +
      T(22, 232, "Nissl bodies", "sm", "start") + ld(52, 228, 100, 210) +
      T(178, 118, "Golgi apparatus", "sm", "middle") + ld(172, 122, 158, 160) +
      T(42, 336, "lipofuscin", "sm", "start") + ld(70, 332, 106, 230) +
      T(214, 250, "nucleus + nucleolus", "sm", "middle") + ld(196, 246, 156, 196) +
      T(470, 190, "axon", "sm", "end") +
      fl("flow", "M78 60 C104 72 116 90 126 130 C132 160 150 186 214 190 L426 190 C446 194 456 214 454 240 C452 252 448 258 440 264 C420 282 392 294 364 300", "#d9ff43", 3, "2.4s") +
      '<g class="ov" data-x="cut"><path d="M336 176 L352 204 M352 176 L336 204" stroke="#ff5d7a" stroke-width="3"/>' + T(344, 166, "axon cut", "sm") +
      '<circle cx="164" cy="208" r="15" fill="none" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 3"/><path d="M146 194 L156 202" stroke="#ffd166" stroke-width="1.6" marker-end="url(#ixArr)"/>' + T(168, 268, "nucleus → periphery", "sm", "start") + "</g>";
    A.scene("neuron", {
      title: "Neuron · every part, its organelles, and the stains that show them",
      vb: "0 0 480 360",
      svg,
      intro: "A multipolar motor neuron, drawn as the book describes it. Tap any part. The chips show what each **stain** colours and what happens when the **axon is cut**.",
      parts: {
        soma: ["Cell body (perikaryon)", "Holds the nucleus and the protein factories: the **trophic centre**. Whatever is cut off from it degenerates."],
        nuc: ["Nucleus", "Large, round, **central** and **pale (euchromatic)**, with a prominent nucleolus: the 'owl-eye' look. After an axon is cut it moves to the **periphery** (retrograde reaction)."],
        ncl: ["Nucleolus", "Large and dark: the neuron makes a lot of protein."],
        nissl: ["Nissl bodies (granules)", "Stacks of **rough ER with free ribosomes (polyribosomes)**: **basophilic**, shown by **basic dyes** (toluidine blue, methylene blue, cresyl violet). In the cell body and **dendrites**; **absent from the axon hillock and axon**. They disperse after axon injury: **chromatolysis**."],
        golgi: ["Golgi apparatus", "A network **around the nucleus**, shown by **silver** impregnation (Golgi's method)."],
        mito: ["Mitochondria", "Throughout, and packed in the **axon terminals**."],
        lipo: ["Lipofuscin", "Yellow-brown 'wear-and-tear' pigment (lysosomal **residual bodies**); it **increases with age**."],
        nfib: ["Neurofibrils (neurofilaments + microtubules)", "**Neurofilaments** are the neuron's **intermediate filaments** (tensile strength); **microtubules** carry axonal transport. Silver stains them as **neurofibrils**, running into every process."],
        dend: ["Dendrites", "Many, short, **branched and tapering**; contain **Nissl bodies**; carry impulses **towards** the cell body; **unmyelinated**; covered with **spines**."],
        spine: ["Dendritic spines", "Small knobs on the dendrites: the sites of **axodendritic synapses**."],
        hill: ["Axon hillock", "The cone where the axon leaves the cell body: **free of Nissl bodies** (pale)."],
        iseg: ["Initial segment", "Between the hillock and the myelin: lowest threshold, where the **action potential starts**."],
        axon: ["Axon (nerve fibre)", "**One** per neuron, **uniform diameter**, carries impulses **away** from the cell body. **No Nissl bodies**. May give **collaterals**; ends in telodendria."],
        myel: ["Myelin sheath", "Spiral of cell membrane: **Schwann cells** in the PNS, **oligodendrocytes** in the CNS. Rich in lipid: black with **osmic acid** (Weigert for myelin, **Marchi** for degenerating myelin); dissolved in H&E, leaving a neurokeratin network."],
        node: ["Node of Ranvier", "The gap between two **internodes** (myelin segments): the action potential jumps node to node (**saltatory conduction**)."],
        schw: ["Schwann cell (neurolemma)", "In the PNS **one Schwann cell makes one internode** of one axon. Its outer cytoplasm and nucleus form the **neurolemma** (sheath of Schwann), which guides **regeneration**."],
        coll: ["Axon collateral", "A side branch, given off at a node."],
        telo: ["Telodendria", "The fine terminal branches of the axon."],
        axd: ["Axodendritic synapse", "Axon terminal on a **dendrite** or spine: the commonest type."],
        axs: ["Axosomatic synapse", "Axon terminal on the **cell body** (site of contact of axon and cell body)."],
        axa: ["Axoaxonic synapse", "Axon terminal on another **axon** (its initial segment or terminal): presynaptic inhibition."],
        pre: ["Presynaptic (axon) terminal", "The terminal button: rich in **mitochondria** and **synaptic vesicles** of transmitter."],
        sv: ["Synaptic vesicles", "Hold the transmitter; released by exocytosis when Ca²⁺ enters."],
        cleft: ["Synaptic cleft (20–30 nm)", "The chemical synaptic cleft is about **20–30 nm** wide; the transmitter diffuses across it."],
        postm: ["Postsynaptic membrane", "Carries the **receptors for the transmitter** (acetylcholine at a cholinergic synapse)."],
        psd: ["Synaptic web (postsynaptic density)", "Dense protein mat under the postsynaptic membrane that **anchors the receptors**."],
        rec: ["Transmitter receptors", "Receptor proteins in the postsynaptic membrane (e.g. **acetylcholine** receptors)."],
        gap: ["Gap junction (electrical synapse)", "Connexon channels across a **2–3 nm** gap pass ions directly: fast, two-way, rare in mammals. **Gap**, not tight, junctions."],
      },
      al: {
        soma: ["cell body", "perikaryon", "soma", "nerve cell body", "cell bodies"],
        nuc: ["migration of the nucleus", "nucleus migrates", "nuclear migration", "peripheral position", "eccentric nucleus", "euchromatic", "owl eye"],
        ncl: ["nucleolus", "nucleoli"],
        nissl: ["nissl", "nissl body", "nissl granule", "tigroid", "rough endoplasmic reticulum", "rough er", "rer", "polyribosome", "free ribosome", "ribosome", "chromatolysis", "basic dye", "toluidine blue", "cresyl violet"],
        golgi: ["golgi apparatus", "golgi body", "golgi complex", "golgi method", "golgi s method", "silver impregnation", "silver stain", "silver"],
        mito: ["mitochondria", "mitochondrion"],
        lipo: ["lipofuscin", "wear and tear pigment", "residual body", "age pigment"],
        nfib: ["neurofibril", "neurofilament", "microtubule", "intermediate filament", "axonal transport", "tensile strength"],
        dend: ["dendrite", "dendron", "tapering", "taper"],
        spine: ["dendritic spine", "spine", "gemmule"],
        hill: ["axon hillock", "hillock"],
        iseg: ["initial segment", "trigger zone"],
        axon: ["axon", "axis cylinder", "uniform diameter", "constant diameter", "nerve fiber"],
        myel: ["myelin", "myelin sheath", "myelinated", "osmic acid", "osmium", "weigert", "marchi", "neurokeratin"],
        node: ["node of ranvier", "nodes of ranvier", "ranvier", "internode", "saltatory"],
        schw: ["schwann cell", "neurolemma", "neurilemma", "sheath of schwann", "neurolemmal sheath"],
        coll: ["collateral", "axon collateral"],
        telo: ["telodendria", "telodendron", "terminal branch"],
        axd: ["axodendritic", "terminal button", "bouton", "synaptic knob", "end bulb"],
        axs: ["axosomatic", "terminal button", "contact of axon and cell body"],
        axa: ["axoaxonic", "axo axonic"],
        pre: ["axon terminal", "presynaptic terminal", "presynaptic membrane", "presynaptic ending"],
        sv: ["synaptic vesicle", "vesicle"],
        cleft: ["synaptic cleft", "20 30 nm", "cleft"],
        postm: ["postsynaptic membrane", "receptors for acetylcholine", "receptor for acetylcholine"],
        psd: ["synaptic web", "postsynaptic density", "subsynaptic web"],
        rec: ["transmitter receptor", "neurotransmitter receptor", "acetylcholine receptor"],
        gap: ["gap junction", "electrical synapse", "connexon", "2 3 nm"],
      },
      drill: ["soma", "nuc", "nissl", "golgi", "lipo", "dend", "spine", "hill", "iseg", "axon", "myel", "node", "schw", "coll", "axs", "axd", "axa", "cleft", "psd", "gap"],
      sims: [
        { id: "nissl", label: "🔵 Basic dye", on: ["nissl"], info: "**Basic dyes** (toluidine blue, methylene blue, cresyl violet) stain the **Nissl bodies** blue: rough ER + ribosomes, in the cell body and dendrites. The **axon hillock** and **axon** stay pale: they have **no Nissl**." },
        { id: "silver", label: "⚫ Silver", on: ["nfib", "golgi"], info: "**Silver** impregnation (Cajal, Golgi) blackens the **neurofibrils** and the **Golgi apparatus**; Golgi's method shows the whole outline of a few neurons." },
        { id: "osmic", label: "⚫ Osmic acid", on: ["myel"], info: "**Osmic acid** (osmium tetroxide) stains **myelin** black; **Marchi's** method shows **degenerating** myelin. In H&E the myelin lipid dissolves, leaving a pale ring (neurokeratin)." },
        { id: "flow", label: "▶ Impulse direction", show: ["flow"], on: ["dend", "soma", "hill", "axon", "axs"], info: "Impulses go **dendrites → cell body → axon hillock / initial segment → axon → terminal buttons**. Dendrites bring signals in; the **axon carries them away**." },
        { id: "cut", label: "✂ Cut the axon", show: ["cut"], on: ["nuc"], lost: ["nissl"], info: "**Retrograde reaction** in the cell body: it swells, the Nissl bodies disperse (**chromatolysis**, the first change) and the **nucleus moves to the periphery**. The distal axon undergoes **Wallerian degeneration** (see the peripheral nerve diagram)." },
      ],
      secs: { "hi-nervous-tissue#0": "", "hi-nervous-tissue#1": "" },
      rules: [
        [/chromatolysis|retrograde (reaction|degeneration)/i, "cut"],
        [/nissl|basic dye|toluidine/i, "nissl"],
        [/silver|golgi (body|bodies|apparatus)|neurofibril/i, "silver"],
        [/osmic|marchi|weigert/i, "osmic"],
      ],
    });
  })();

  /* ═══════════════ 2. NEURON SHAPES and where each one lives ═══════════════ */
  (function () {
    const chip = (id, x, y, l1, l2) =>
      '<rect class="pf" data-p="' + id + '" x="' + (x - 44) + '" y="' + y + '" width="88" height="' + (l2 ? 25 : 16) + '" rx="7" style="--c:#d9ff43;--r:#13263c;--rs:#2f4a68"/>' + T(x, y + 11, l1, "sm") + (l2 ? T(x, y + 21, l2, "sm") : "");
    const X = [50, 146, 242, 338, 432];
    const sat = [0, 60, 120, 180, 240, 300].map((a) => { const r = (a * Math.PI) / 180; return ell("satel", (50 + 21 * Math.cos(r)).toFixed(1), (104 + 21 * Math.sin(r)).toFixed(1), 5, 3, "#66e9ff", "#6f8aa8", a + 90); }).join("");
    const uni =
      sat +
      '<circle class="pf" data-p="uni" cx="50" cy="104" r="15" style="--c:#ff9f43;--r:#e9dccb"/>' + dot(50, 104, 5, "#8e7f6e") +
      ps("uni", "M50 119 C50 132 52 140 50 150 M50 150 C38 152 24 156 12 170 M50 150 C62 152 76 156 90 168", "#ff9f43", "#c9b8a8", 2.6) +
      ps("uni", "M12 170 l-6 6 M12 170 l0 8 M12 170 l6 7", "#ff9f43", "#c9b8a8", 1.4) + T(16, 190, "from receptor", "sm mut", "start") + T(88, 184, "to CNS", "sm mut", "end");
    const bip =
      '<ellipse class="pf" data-p="bip" cx="146" cy="110" rx="9" ry="15" style="--c:#ff9f43;--r:#e9dccb"/>' + dot(146, 110, 4.4, "#8e7f6e") +
      ps("bip", "M146 95 L146 50 M146 60 l-9 -10 M146 60 l9 -10 M146 52 l0 -10", "#ff9f43", "#c9b8a8", 2.4) + ps("bip", "M146 125 L146 190 M146 190 l-6 6 M146 190 l6 6", "#ff9f43", "#c9b8a8", 2.4);
    const stel =
      '<path class="pf" data-p="stel" d="' + blob([[242, 94], [252, 100], [262, 98], [258, 110], [264, 122], [252, 122], [246, 132], [238, 122], [224, 122], [230, 110], [222, 98], [234, 100]]) + '" style="--c:#ff9f43;--r:#e9dccb"/>' + dot(243, 111, 5, "#8e7f6e") +
      ps("stel", "M262 98 L284 80 M258 110 L290 112 M264 122 L284 140 M222 98 L200 80 M230 110 L198 110 M224 122 L204 142 M242 94 L242 62 M284 80 l6 -8 M284 80 l8 2 M200 80 l-6 -8 M242 62 l-6 -8 M242 62 l6 -8", "#ff9f43", "#c9b8a8", 2.4) +
      ps("stel", "M246 132 L246 196 M246 196 l-6 6 M246 196 l6 6", "#ff5d8f", "#c9b8a8", 2.2) + T(254, 176, "axon", "sm mut", "start");
    const pyr =
      '<path class="pf" data-p="pyr" d="M338 92 L356 132 L320 132 Z" style="--c:#ff9f43;--r:#e9dccb"/>' + dot(338, 118, 5, "#8e7f6e") +
      ps("pyr", "M338 92 L338 44 M338 70 l-14 -12 M338 70 l14 -12 M338 54 l-10 -12 M338 54 l10 -12", "#ff9f43", "#c9b8a8", 2.4) + ps("pyr", "M320 132 L302 146 M356 132 L374 146 M326 132 L316 152 M350 132 L360 152", "#ff9f43", "#c9b8a8", 2) +
      ps("pyr", "M338 132 L338 198 M338 198 l-6 6 M338 198 l6 6", "#ff5d8f", "#c9b8a8", 2.2) + T(344, 180, "axon", "sm mut", "start") + T(304, 60, "apical", "sm mut", "end");
    const fan = [[-40, 44], [-30, 38], [-18, 34], [-6, 32], [6, 32], [18, 34], [30, 38], [40, 44]].map(([dx, y]) => "M432 124 C" + (432 + dx * 0.3) + " 100 " + (432 + dx * 0.8) + " " + (y + 30) + " " + (432 + dx) + " " + y).join(" ");
    const pk =
      ps("pk", fan, "#ff9f43", "#c9b8a8", 1.6) + ps("pk", "M432 130 L432 116", "#ff9f43", "#c9b8a8", 5) +
      '<path class="pf" data-p="pk" d="M432 128 C446 130 452 146 446 156 C440 164 424 164 418 156 C412 146 418 130 432 128 Z" style="--c:#ff9f43;--r:#e9dccb"/>' + dot(432, 148, 4.6, "#8e7f6e") +
      ps("pk", "M432 162 L432 204 M432 204 l-6 6 M432 204 l6 6", "#ff5d8f", "#c9b8a8", 2.2);
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">NEURON SHAPES · AND WHERE EACH ONE LIVES</text>' +
      uni + bip + stel + pyr + pk +
      [["UNIPOLAR", "(pseudo-unipolar)"], ["BIPOLAR", "1 dendrite, 1 axon"], ["MULTIPOLAR", "stellate"], ["MULTIPOLAR", "pyramidal"], ["PYRIFORM", "(Purkinje)"]].map(([a, b], i) => T(X[i], 224, a, "big") + T(X[i], 236, b, "sm mut")).join("") +
      chip("loc_drg", 50, 246, "spinal (dorsal", "root) ganglia") + chip("loc_cng", 50, 275, "sensory ganglia of", "cranial nerves") + chip("loc_mes", 50, 304, "mesencephalic", "nucleus of V") +
      chip("loc_ret", 146, 246, "retina") + chip("loc_olf", 146, 266, "olfactory", "epithelium") + chip("loc_spi", 146, 295, "spiral (cochlear)", "ganglion") + chip("loc_ves", 146, 324, "vestibular", "(Scarpa's) ganglion") +
      chip("loc_ah", 242, 246, "anterior horn cells") + chip("loc_aut", 242, 266, "autonomic", "(sympathetic) ganglia") + chip("loc_ctxs", 242, 295, "cortex: stellate", "(granule) cells") +
      chip("loc_ctx", 338, 246, "cerebral cortex", "Betz cells (area 4)") +
      chip("loc_cb", 432, 246, "cerebellar cortex") +
      T(88, 86, "satellite cells", "sm", "start") + ld(86, 88, 70, 96);
    A.scene("ntypes", {
      title: "Neuron shapes · unipolar, bipolar, multipolar, and where each one lives",
      vb: "0 0 480 356",
      svg,
      intro: "Tap a neuron for its features, or a location chip to see which shape lives there.",
      parts: {
        uni: ["Unipolar (pseudo-unipolar) neuron", "One process that divides like a **T**: a peripheral branch from the receptor and a central branch into the CNS. Round cell body, **ringed by many satellite cells**. In the **spinal (dorsal root) ganglia**, the sensory ganglia of cranial nerves and the **mesencephalic nucleus of V**."],
        satel: ["Satellite cells", "Flattened cells that **closely surround the neuron bodies in peripheral ganglia**: a **complete** capsule in spinal ganglia, **few** (incomplete) in sympathetic ganglia."],
        bip: ["Bipolar neuron", "Two processes, one at each pole: **one dendrite and one axon**. In the **retina**, the **olfactory epithelium**, and the **spiral (cochlear) and vestibular (Scarpa's) ganglia**."],
        stel: ["Multipolar stellate neuron", "Star-shaped: many dendrites and one axon. **Anterior horn cells**; **autonomic (sympathetic) ganglion cells** (small, eccentric nucleus, few satellite cells, among non-myelinated fibres); stellate (granule) cells of the cortex."],
        pyr: ["Multipolar pyramidal neuron", "Triangular cell body with one **apical dendrite**, basal dendrites and an axon from the base: the **cerebral cortex**. The giant ones are the **Betz cells** of the motor cortex (area 4)."],
        pk: ["Pyriform (Purkinje) neuron", "Flask-shaped, with a huge dendritic tree **fanned in one plane**. Only in the **cerebellar cortex**; its axon is the cortex's only (inhibitory) output."],
        loc_drg: ["Spinal (dorsal root) ganglia", "**Pseudo-unipolar** neurons, round, with many satellite cells; **no synapses** inside."],
        loc_cng: ["Sensory ganglia of cranial nerves", "Trigeminal, geniculate, and the sensory ganglia of IX and X: **pseudo-unipolar** neurons."],
        loc_mes: ["Mesencephalic nucleus of V", "The one place **pseudo-unipolar** first-order neurons sit **inside** the CNS (proprioception from the jaw muscles)."],
        loc_ret: ["Retina", "Its bipolar cells link photoreceptors to ganglion cells."],
        loc_olf: ["Olfactory epithelium", "The olfactory receptor cells are **bipolar** neurons."],
        loc_spi: ["Spiral (cochlear) ganglion", "**Bipolar** neurons of hearing, in the modiolus."],
        loc_ves: ["Vestibular (Scarpa's) ganglion", "**Bipolar** neurons of balance, in the internal acoustic meatus."],
        loc_ah: ["Anterior horn cells", "Large **multipolar** motor neurons."],
        loc_aut: ["Autonomic (sympathetic) ganglia", "**Multipolar** neurons with few satellite cells; preganglionic fibres **synapse** here."],
        loc_ctxs: ["Stellate (granule) cells of the cortex", "Small **multipolar** interneurons of the cortex."],
        loc_ctx: ["Cerebral cortex", "**Pyramidal** neurons; Betz cells in area 4."],
        loc_cb: ["Cerebellar cortex", "The **Purkinje (pyriform)** cells."],
      },
      al: {
        uni: ["unipolar", "pseudo unipolar", "pseudounipolar", "t shaped", "divides like a t"],
        satel: ["satellite cell", "capsular cell", "amphicyte"],
        bip: ["bipolar neuron", "bipolar"],
        stel: ["stellate", "multipolar stellate", "star shaped", "multipolar"],
        pyr: ["pyramidal neuron", "pyramidal cell", "multipolar pyramidal", "betz cell", "betz", "multipolar"],
        pk: ["pyriform", "multipolar pyriform", "flask shaped", "purkinje neuron", "multipolar"],
        loc_drg: ["spinal ganglion", "dorsal root ganglion", "posterior root ganglion", "spinal ganglia", "sensory ganglion"],
        loc_cng: ["sensory ganglia of cranial nerves", "trigeminal ganglion", "geniculate ganglion", "cranial sensory ganglion"],
        loc_mes: ["mesencephalic nucleus", "mesencephalic nucleus of the trigeminal"],
        loc_ret: ["retina"],
        loc_olf: ["olfactory epithelium", "olfactory mucosa", "olfactory receptor"],
        loc_spi: ["spiral ganglion", "cochlear ganglion", "cochlear ganglia"],
        loc_ves: ["vestibular ganglion", "vestibular ganglia", "scarpa", "scarpas ganglion"],
        loc_ah: ["anterior horn cell", "anterior horn"],
        loc_aut: ["sympathetic ganglion", "autonomic ganglion", "sympathetic ganglia", "autonomic ganglia", "parasympathetic ganglion"],
        loc_ctxs: ["granule cell of the cortex", "stellate cell"],
        loc_ctx: ["cerebral cortex", "motor cortex"],
        loc_cb: ["cerebellar cortex"],
      },
      drill: ["uni", "bip", "stel", "pyr", "pk", "satel", "loc_drg", "loc_spi", "loc_ves", "loc_aut", "loc_cb"],
      sims: [
        { id: "sens", label: "🔎 Sensory ganglia", on: ["uni", "satel", "loc_drg", "loc_cng", "bip", "loc_spi", "loc_ves"], info: "Sensory ganglia hold the **first-order** neurons: **pseudo-unipolar** in the spinal and most cranial ganglia (with many satellite cells, no synapses), **bipolar** in the **cochlear and vestibular** ganglia." },
        { id: "cns", label: "🧠 CNS neurons", on: ["stel", "pyr", "pk", "loc_ah", "loc_ctx", "loc_cb", "loc_ctxs"], info: "CNS neurons are **multipolar**: stellate (anterior horn, cortical granule cells), **pyramidal** (cerebral cortex, Betz cells), **pyriform** (Purkinje cells of the cerebellum)." },
        { id: "gang", label: "Spinal vs sympathetic ganglion", on: ["uni", "satel", "loc_drg", "stel", "loc_aut"], info: "**Spinal ganglion**: large round **pseudo-unipolar** cells, central nucleus, **many satellite cells**, myelinated fibres, **no synapses**. **Sympathetic ganglion**: smaller **multipolar** cells, **eccentric** nucleus, **few** satellite cells, thin **non-myelinated** fibres, **synapses** present." },
      ],
      secs: { "hi-nervous-tissue#1": "" },
      rules: [
        [/sympathetic ganglia|spinal ganglia|satellite/i, "gang"],
        [/bipolar|unipolar|vestibular gangl|cochlear gangl|spiral gangl/i, "sens"],
        [/pyramidal|pyriform|stellate|multipolar/i, "cns"],
      ],
    });
  })();

  /* ═══════════════ 3. NEUROGLIA: which cell, where, what for ═══════════════ */
  (function () {
    const epen = Array.from({ length: 18 }, (_, i) => { const x = 14 + i * 25.5; return '<rect class="pf" data-p="epen" x="' + x + '" y="50" width="23" height="26" rx="4" style="--c:#66e9ff;--r:#3e5d7c"/>' + dot(x + 11.5, 66, 4, "#20364e") + '<path d="M' + (x + 5) + " 50 l-1 -8 M" + (x + 11) + " 50 l0 -9 M" + (x + 17) + ' 50 l1 -8" stroke="#8fd3ff" stroke-width="1" pointer-events="none"/>'; }).join("");
    const cap =
      '<rect class="pf" data-p="cap" x="210" y="92" width="36" height="276" rx="6" style="--c:#ff5d7a;--r:#8f3b4f"/>' + '<rect x="218" y="92" width="20" height="276" fill="#2a0f18" pointer-events="none"/>' +
      [120, 170, 220, 270, 320].map((y) => '<ellipse cx="228" cy="' + y + '" rx="7" ry="4" fill="#c44b5f" pointer-events="none"/>').join("") +
      [108, 158, 208, 258, 308, 352].map((y) => '<rect class="pf" data-p="cap" x="208" y="' + y + '" width="6" height="3" style="--c:#fff;--r:#0b0f16"/><rect class="pf" data-p="cap" x="242" y="' + (y + 10) + '" width="6" height="3" style="--c:#fff;--r:#0b0f16"/>').join("");
    // protoplasmic astrocyte: many short, thick, branched processes; two end-feet on the capillary
    const pastP = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, r1 = 12, r2 = 26 + (i % 3) * 5, cx = 118, cy = 168;
      const x1 = cx + r1 * Math.cos(a), y1 = cy + r1 * Math.sin(a), x2 = cx + r2 * Math.cos(a), y2 = cy + r2 * Math.sin(a);
      pastP.push("M" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + x2.toFixed(1) + " " + y2.toFixed(1) + " l" + (5 * Math.cos(a + 0.6)).toFixed(1) + " " + (5 * Math.sin(a + 0.6)).toFixed(1) + " M" + x2.toFixed(1) + " " + y2.toFixed(1) + " l" + (5 * Math.cos(a - 0.6)).toFixed(1) + " " + (5 * Math.sin(a - 0.6)).toFixed(1));
    }
    const past =
      ps("past", pastP.join(" "), "#ffd166", "#c9a86a", 2.4) + ps("past", "M130 160 C160 150 186 138 206 132 M130 176 C160 184 186 190 206 196", "#ffd166", "#c9a86a", 2.6) +
      '<circle class="pf" data-p="past" cx="118" cy="168" r="12" style="--c:#ffd166;--r:#d9b56e"/>' + dot(118, 168, 5, "#7a6337") +
      '<path class="pf" data-p="efoot" d="M200 124 C206 122 210 126 210 132 C210 138 206 142 200 140 Z M200 188 C206 186 210 190 210 196 C210 202 206 206 200 204 Z" style="--c:#5ef0a0;--r:#d9b56e"/>';
    // fibrous astrocyte: few, long, thin processes; one end-foot
    const fast =
      ps("fast", "M352 150 C372 120 392 104 420 90 M352 150 C390 150 424 156 462 162 M352 150 C360 178 368 196 382 214 M352 150 C320 136 290 132 256 132 M352 150 C332 172 310 184 290 196", "#ffd166", "#c9a86a", 1.4) +
      '<circle class="pf" data-p="fast" cx="352" cy="150" r="10" style="--c:#ffd166;--r:#d9b56e"/>' + dot(352, 150, 4.4, "#7a6337") +
      '<path class="pf" data-p="efoot" d="M256 124 C250 122 246 126 246 132 C246 138 250 142 256 140 Z" style="--c:#5ef0a0;--r:#d9b56e"/>';
    // white matter: myelinated axons with interfascicular oligodendrocytes in rows between them
    const ax = [252, 292, 332].map((y) => '<rect x="266" y="' + (y - 6) + '" width="206" height="12" rx="6" fill="#f2efe8" pointer-events="none"/><path d="M266 ' + y + ' L472 ' + y + '" stroke="#8a7a66" stroke-width="2" pointer-events="none"/>').join("");
    const oli = [[300, 272], [360, 272], [420, 272], [330, 312], [390, 312]].map(([x, y]) => '<circle class="pf" data-p="oli" cx="' + x + '" cy="' + y + '" r="7" style="--c:#b39cff;--r:#6e5a9a"/>' + dot(x, y, 3.4, "#2b2140") + '<path class="ps" data-p="oli" d="M' + x + " " + (y - 7) + " L" + (x - 6) + " " + (y - 14) + " M" + x + " " + (y - 7) + " L" + (x + 8) + " " + (y - 14) + " M" + x + " " + (y + 7) + " L" + (x + 6) + " " + (y + 14) + '" style="--c:#b39cff;--r:#6e5a9a;--w:1.4"/>').join("");
    // grey matter: a neuron with a satellite oligodendrocyte, and a microglial cell
    const neu = '<path d="' + blob([[70, 262], [84, 250], [104, 254], [112, 270], [104, 288], [84, 292], [70, 280]]) + '" fill="#6d4a63" pointer-events="none"/><path d="M104 254 L122 234 M70 262 L50 246 M84 292 L78 318" stroke="#6d4a63" stroke-width="4" pointer-events="none"/>' + T(90, 274, "neuron", "sm");
    const soli = '<circle class="pf" data-p="soli" cx="118" cy="282" r="7" style="--c:#b39cff;--r:#6e5a9a"/>' + dot(118, 282, 3.4, "#2b2140") + '<circle class="pf" data-p="soli" cx="62" cy="292" r="6" style="--c:#b39cff;--r:#6e5a9a"/>' + dot(62, 292, 3, "#2b2140");
    const micro =
      '<ellipse class="pf" data-p="micro" cx="150" cy="332" rx="11" ry="5" transform="rotate(-20 150 332)" style="--c:#ff9f43;--r:#9c6b43"/>' +
      ps("micro", "M160 328 C170 318 176 314 186 314 M140 336 C130 346 124 350 114 350 M154 338 C156 350 160 356 168 362", "#ff9f43", "#9c6b43", 1.6) +
      ps("micro", "M172 318 l3 -5 M180 314 l2 -5 M128 346 l-3 5 M162 356 l5 1", "#ff9f43", "#9c6b43", 1.2);
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">NEUROGLIA · CNS</text>' +
      '<rect x="8" y="24" width="464" height="26" rx="5" fill="#0e2c48" pointer-events="none"/>' + T(240, 41, "ventricle (CSF)", "sm mut") + epen +
      T(24, 100, "GREY MATTER", "sm mut", "start") + T(462, 100, "WHITE MATTER", "sm mut", "end") +
      cap + past + fast + ax + oli + neu + soli + micro +
      T(118, 206, "protoplasmic astrocyte", "sm") + T(378, 126, "fibrous astrocyte", "sm") + T(228, 88, "capillary", "sm") +
      T(190, 112, "end-feet", "sm", "end") + T(360, 352, "interfascicular oligodendrocytes", "sm") + T(130, 306, "satellite oligodendrocytes", "sm", "start") + ld(128, 302, 120, 290) +
      T(92, 362, "microglia", "sm", "end") + ld(94, 360, 138, 336) + T(262, 88, "ependymal cells (ciliated)", "sm", "start");
    A.scene("glia", {
      title: "Neuroglia · which cell, where, and what it does",
      vb: "0 0 480 372",
      svg,
      intro: "Grey matter on the left, white matter on the right, a capillary between them and the ventricle above. Tap a cell.",
      parts: {
        epen: ["Ependymal cells", "Cuboidal to columnar **ciliated** cells lining the **ventricles and central canal**; they help move CSF. They are **not** part of the blood–brain barrier."],
        past: ["Protoplasmic astrocyte", "In **grey matter**: **many short, thick, branched** processes. Astrocytes are the largest glia, contain **GFAP**, form scars (gliosis), and give rise to most brain tumours in children (**gliomas**: a proliferation of **macroglia**; mature neurons do not divide)."],
        fast: ["Fibrous astrocyte", "In **white matter**: **few, long, thin**, slightly branched processes."],
        efoot: ["Astrocyte end-feet", "Perivascular end-feet on the capillaries **share in the blood–brain barrier**, with the endothelial tight junctions."],
        cap: ["Capillary endothelium with tight junctions", "Continuous endothelium sealed by **tight junctions**: the core of the **blood–brain barrier**, with its basement membrane and the astrocyte end-feet."],
        oli: ["Interfascicular oligodendrocytes", "In **rows between the fibres of white matter**; each makes **many internodes on several axons**: the **CNS myelin**. Ectodermal; they keep their centrioles."],
        soli: ["Satellite oligodendrocytes", "Sit close to nerve cell bodies in **grey matter** and **support** them."],
        micro: ["Microglia (mesoglia)", "The smallest glia: **elongated dark nucleus**, few tortuous processes decorated with **spines**. **Mesodermal** (monocyte origin): the **phagocytes (macrophages) of the CNS**; they can divide. Shown by **silver carbonate** (Hortega), not by supravital methylene blue."],
      },
      al: {
        epen: ["ependymal", "ependyma", "ependymal cell", "tanycyte", "lining the ventricle"],
        past: ["protoplasmic astrocyte", "protoplasmic", "astrocyte", "macroglia", "gfap", "glial fibrillary acidic protein", "glial fibrillar acidic protein", "astroglia", "glioma", "gliosis"],
        fast: ["fibrous astrocyte", "astrocyte", "macroglia"],
        efoot: ["end feet", "end foot", "perivascular feet", "perivascular end feet", "blood brain barrier"],
        cap: ["tight junction", "capillary endothelium", "endothelial", "blood brain barrier", "bbb"],
        oli: ["oligodendrocyte", "oligodendroglia", "interfascicular", "interfascicular oligodendrocyte"],
        soli: ["satellite oligodendrocyte"],
        micro: ["microglia", "mesoglia", "microglial", "silver carbonate", "hortega", "phagocytic", "phagocyte", "mesodermal"],
      },
      drill: ["epen", "past", "fast", "efoot", "cap", "oli", "soli", "micro"],
      sims: [
        { id: "bbb", label: "🧱 Blood–brain barrier", on: ["cap", "efoot"], info: "The **blood–brain barrier** = capillary endothelium joined by **tight junctions** + its basement membrane + the **astrocyte end-feet**. Ependyma is **not** part of it." },
        { id: "myelin", label: "Myelin makers", on: ["oli"], info: "CNS myelin: **interfascicular oligodendrocytes** (one cell → many internodes on several axons). PNS myelin: **Schwann cells** (one cell → one internode)." },
        { id: "phago", label: "Phagocytes", on: ["micro"], info: "**Microglia (mesoglia)** are the CNS macrophages, the only **mesodermal** glia. All the others (astrocytes, oligodendrocytes, ependyma) are **ectodermal** (neuroectoderm)." },
      ],
      secs: { "hi-nervous-tissue#2": "", "hi-cns#0": "", "hi-cns#4": "bbb" },
      rules: [
        [/blood[\s–-]*brain barrier|end[\s-]*feet|tight junction/i, "bbb"],
        [/microglia|mesoglia|phagocyt/i, "phago"],
        [/oligodendro|myelin/i, "myelin"],
      ],
    });
  })();

  /* ═══════════════ 4. PERIPHERAL NERVE: sheaths; cut → degeneration → regeneration ═══════════════ */
  (function () {
    const F = [[92, 110, 34], [152, 104, 28], [98, 180, 30], [160, 172, 32]];
    const fibres = (cx, cy, r, i) => {
      const out = [];
      for (let k = 0; k < 9; k++) {
        const a = k * 2.4 + i, d = (r - 9) * Math.sqrt((k + 0.5) / 9);
        const x = cx + d * Math.cos(a), y = cy + d * Math.sin(a);
        out.push('<circle class="pf" data-p="myf" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" style="--c:#66e9ff;--r:#f4f1ea;--rs:#8a7a66"/>' + dot(x.toFixed(1), y.toFixed(1), 1.6, "#6d5a45"));
      }
      return out.join("");
    };
    const xs =
      '<circle class="pf" data-p="epi" cx="126" cy="144" r="98" style="--c:#ffd166;--r:#e8c9b6"/>' +
      F.map(([x, y, r], i) => '<circle class="pf" data-p="endo" cx="' + x + '" cy="' + y + '" r="' + (r - 3) + '" style="--c:#b39cff;--r:#f3e3d8"/>' + fibres(x, y, r, i) + '<circle class="ps" data-p="peri" cx="' + x + '" cy="' + y + '" r="' + r + '" style="--c:#ff5d8f;--r:#b56a7d;--w:4"/>').join("") +
      // one Remak bundle: unmyelinated axons in grooves of a Schwann cell
      '<ellipse class="pf" data-p="remak" cx="170" cy="184" rx="10" ry="7" style="--c:#5ef0a0;--r:#d9c2e8"/>' + [[165, 182], [171, 188], [175, 181], [167, 188]].map(([x, y]) => dot(x, y, 1.6, "#6d5a45")).join("") +
      [[60, 70], [196, 214], [62, 212], [200, 84]].map(([x, y]) => '<circle class="pf" data-p="vn" cx="' + x + '" cy="' + y + '" r="5" style="--c:#ff5d7a;--r:#c44b5f"/>').join("");
    // injury strip: neuron, proximal stump, cut, distal Wallerian segment, Schwann bands, sprout
    const strip =
      '<path d="' + blob([[26, 300], [36, 284], [52, 282], [64, 294], [60, 314], [42, 320], [28, 314]]) + '" class="pf" data-p="chrom" style="--c:#ff9f43;--r:#e9dccb"/>' + '<circle cx="54" cy="306" r="7" fill="#f7f2ea" stroke="#8e7f6e" pointer-events="none"/>' + dot(55, 306, 2.4, "#6d4a63") +
      [[38, 294], [48, 290], [36, 308]].map(([x, y]) => dot(x, y, 2, "#8da0d8")).join("") +
      ps("prox", "M64 300 L204 300", "#66e9ff", "#8a7a66", 3) +
      [[80, 124], [130, 174]].map(([a, b]) => '<rect class="pf" data-p="prox" x="' + a + '" y="293" width="' + (b - a) + '" height="14" rx="7" style="--c:#66e9ff;--r:#f4f1ea"/>').join("") +
      '<path d="M200 290 L216 312 M216 290 L200 312" stroke="#ff5d7a" stroke-width="3" pointer-events="none"/>' +
      '<rect class="pf" data-p="bung" x="222" y="290" width="244" height="22" rx="8" style="--c:#5ef0a0;--r:#233a2e"/>' +
      [240, 268, 296, 324, 352, 380, 408, 436].map((x, i) => '<ellipse class="pf" data-p="bung" cx="' + x + '" cy="' + (i % 2 ? 294 : 308) + '" rx="8" ry="3" style="--c:#5ef0a0;--r:#4e7a62"/>').join("") +
      [[236, 301], [256, 300], [282, 302], [306, 300], [330, 301], [350, 300], [380, 302], [402, 300], [430, 301], [450, 300]].map(([x, y], i) => '<ellipse class="pf" data-p="ovoid" cx="' + x + '" cy="' + y + '" rx="' + (i % 2 ? 6 : 8) + '" ry="4" style="--c:#ffd166;--r:#f1e8d4;--rs:#8a7a66"/>').join("") +
      [[270, 322], [340, 280], [418, 322]].map(([x, y]) => '<path class="pf" data-p="macro" d="' + blob([[x - 9, y], [x - 4, y - 6], [x + 5, y - 6], [x + 10, y + 1], [x + 3, y + 7], [x - 6, y + 6]]) + '" style="--c:#ff9f43;--r:#8a5a4a"/>').join("") +
      '<g class="ov" data-x="regen"><path d="M204 300 C220 300 236 302 260 300 C290 298 320 302 356 300" stroke="#d9ff43" stroke-width="2.4" fill="none" stroke-dasharray="5 3"/><circle cx="358" cy="300" r="4" fill="#d9ff43"/>' + T(356, 330, "growth cone in the Schwann tube", "sm") + "</g>";
    const svg = () =>
      '<text class="ttl" x="126" y="16" text-anchor="middle">PERIPHERAL NERVE · CROSS-SECTION</text>' +
      xs +
      T(236, 60, "epineurium", "sm", "start") + ld(234, 58, 204, 90) + T(236, 112, "perineurium (fascicle)", "sm", "start") + ld(234, 110, 180, 104) +
      T(236, 142, "endoneurium (sheath of Henle)", "sm", "start") + ld(234, 140, 176, 160) + T(236, 190, "Remak (unmyelinated) bundle", "sm", "start") + ld(234, 188, 180, 184) +
      T(236, 224, "vasa nervorum", "sm", "start") + ld(234, 222, 200, 214) + T(236, 86, "myelinated fibres", "sm", "start") + ld(234, 84, 164, 100) +
      '<text class="ttl" x="240" y="262" text-anchor="middle">CUT: CELL BODY · PROXIMAL STUMP · DISTAL (WALLERIAN) SEGMENT</text>' +
      strip +
      T(44, 338, "chromatolysis", "sm") + T(130, 324, "proximal stump", "sm") + T(208, 282, "cut", "sm") + T(344, 344, "myelin ovoids + macrophages · Schwann cells multiply", "sm");
    A.scene("nerve", {
      title: "Peripheral nerve · its sheaths, and what happens when it is cut",
      vb: "0 0 480 356",
      svg,
      intro: "Top: the three connective-tissue sheaths. Bottom: a cut nerve. Tap a part; the chips run the story in time.",
      parts: {
        epi: ["Epineurium", "**Dense irregular connective tissue** around the **whole nerve**, carrying fat and the vasa nervorum."],
        peri: ["Perineurium", "Layers of flattened **epithelioid** cells joined by **tight junctions** around each **fascicle**: the **blood–nerve barrier**."],
        endo: ["Endoneurium (sheath of Henle)", "Delicate **reticular fibres**, made mainly by the **Schwann cells**, around **each nerve fibre**."],
        myf: ["Myelinated nerve fibres", "Axon + myelin + neurolemma. A nerve such as the **ulnar** is made mostly of myelinated fibres."],
        remak: ["Unmyelinated (Remak) fibres", "Several axons **sunk in grooves of one Schwann cell**, with no myelin: typical of **postganglionic sympathetic** fibres. (In the CNS grey matter, unmyelinated fibres have no Schwann cells.)"],
        vn: ["Vasa nervorum", "The nerve's own blood vessels, in the epineurium."],
        chrom: ["Cell body: retrograde reaction", "The cell body swells, the **Nissl bodies disperse (chromatolysis, the first change)** and the **nucleus moves to the periphery**. It recovers if the axon regenerates."],
        prox: ["Proximal stump", "Degenerates back only to the nearest node or two, then **sprouts**."],
        ovoid: ["Wallerian degeneration: myelin ovoids", "The **distal** axon and myelin break up into ovoids inside **digestion ('fermentation') chambers**; the earliest sign is **widening of the nodes of Ranvier** as the myelin retracts."],
        macro: ["Macrophages", "Clear the axon and myelin debris. Lymphocytes play no part in guiding regeneration; the Schwann-cell tube does."],
        bung: ["Schwann cells multiply (bands of Büngner)", "Schwann cells **proliferate** (they do not decrease) inside the endoneurial tube and form bands that **guide the regrowing axon**. Regeneration therefore needs the cut ends brought together **with the neurolemmal (Schwann) sheath**."],
      },
      al: {
        epi: ["epineurium", "dense connective tissue"],
        peri: ["perineurium", "blood nerve barrier", "epithelioid", "epithelium like cell"],
        endo: ["endoneurium", "sheath of henle", "henle", "reticular fiber"],
        myf: ["myelinated nerve fiber", "myelinated fiber", "ulnar nerve", "peripheral nerve fiber"],
        remak: ["unmyelinated", "non myelinated", "nonmyelinated", "remak", "postganglionic sympathetic", "post ganglionic sympathetic"],
        vn: ["vasa nervorum"],
        chrom: ["chromatolysis", "retrograde", "migration of the nucleus", "nucleus migrates", "peripheral position", "cell body change"],
        prox: ["proximal stump", "proximal segment", "proximal part"],
        ovoid: ["wallerian", "wallerian degeneration", "digestion chamber", "fermentation chamber", "ovoid", "fragmentation of neurofibril", "widening of node", "widening of the node", "distal part", "distal segment"],
        macro: ["macrophage"],
        bung: ["bands of bungner", "bungner", "schwann cell proliferat", "proliferation of schwann", "schwann cells multiply", "neurolemmal tube", "neurolemmal sheath", "schwann tube", "schwann cells decrease"],
      },
      drill: ["epi", "peri", "endo", "myf", "remak", "vn", "chrom", "ovoid", "macro", "bung"],
      sims: [
        { id: "sheaths", label: "Three sheaths", on: ["epi", "peri", "endo"], info: "**Epineurium** round the whole nerve (dense CT) → **perineurium** round each fascicle (epithelioid cells, **tight junctions** = the barrier) → **endoneurium** (sheath of Henle, reticular fibres) round each fibre." },
        { id: "wall", label: "✂ Days: Wallerian", on: ["ovoid", "macro", "chrom"], info: "In the first days: the **distal** axon and myelin break into **ovoids (digestion chambers)**, macrophages move in; the **cell body** shows **chromatolysis** and an **eccentric nucleus**." },
        { id: "bands", label: "Weeks: Schwann bands", on: ["bung"], info: "Schwann cells **multiply** and line up inside the endoneurial tubes (bands of Büngner): the path the new axon will follow." },
        { id: "regen", label: "Months: regeneration", show: ["regen"], on: ["prox", "bung"], info: "Sprouts from the proximal stump grow into the Schwann tubes. Success needs the two ends **and the neurolemmal (Schwann) sheath** brought together. CNS axons do not regenerate usefully: no neurolemma, and the glial scar blocks them." },
      ],
      secs: { "hi-nervous-tissue#3": "sheaths", "hi-nervous-tissue#4": "wall" },
      rules: [
        [/regenerat/i, "regen"],
        [/wallerian|degenerat|chromatolysis|fermentation|digestion chamber/i, "wall"],
        [/epineur|perineur|endoneur|henle/i, "sheaths"],
      ],
    });
  })();

  /* ═══════════════ 5. SENSORY NERVE ENDINGS in skin, muscle and tendon ═══════════════ */
  (function () {
    const epi = "M10 40 L320 40 L320 78 C300 90 290 90 276 80 C262 92 248 92 236 80 C222 92 208 92 196 80 C182 94 166 94 152 80 C138 92 124 92 112 80 C98 92 84 92 70 80 C56 92 40 92 28 80 L10 80 Z";
    const skin =
      '<path d="' + epi + '" fill="#f1d9c8" pointer-events="none"/>' + '<path d="M10 40 L320 40 L320 46 L10 46 Z" fill="#e6c3a8" pointer-events="none"/>' +
      '<rect x="10" y="80" width="310" height="150" fill="#f6e8e0" opacity=".16" pointer-events="none"/>' + '<rect x="10" y="230" width="310" height="80" fill="#f7e6a8" opacity=".12" pointer-events="none"/>' +
      [[40, 262], [90, 276], [230, 266], [280, 286], [60, 296]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="16" ry="11" fill="none" stroke="#e0cf96" stroke-width="1" pointer-events="none"/>').join("") +
      T(316, 60, "epidermis", "sm mut", "end") + T(316, 150, "dermis", "sm mut", "end") + T(316, 300, "hypodermis", "sm mut", "end") +
      '<path d="M10 222 C80 226 160 222 240 226 L320 228" stroke="#ffd166" stroke-width="3" fill="none" pointer-events="none"/>' + T(24, 218, "nerve", "sm mut", "start");
    const free = ps("free", "M46 222 C46 180 44 130 44 96 M44 96 L36 64 M44 96 L46 58 M44 96 L54 66 M44 130 L30 104", "#ff5d7a", "#b87a5c", 1.4);
    const merkel = ps("merkel", "M100 222 C102 170 104 120 104 90", "#ffd166", "#b87a5c", 1.4) + '<path class="pf" data-p="merkel" d="M96 90 C98 94 110 94 112 90 L112 86 L96 86 Z" style="--c:#ffd166;--r:#c49a6a"/>' + '<rect class="pf" data-p="merkel" x="97" y="80" width="14" height="6" rx="3" style="--c:#66e9ff;--r:#8fb4c9"/>';
    const meiss = ps("meiss", "M160 222 C160 170 162 130 162 108", "#66e9ff", "#b87a5c", 1.4) + '<ellipse class="pf" data-p="meiss" cx="162" cy="98" rx="7" ry="13" style="--c:#66e9ff;--r:#e0c7b4;--rs:#8e6f5c"/>' + [90, 95, 100, 105].map((y) => '<path d="M156 ' + y + ' q6 3 12 0" stroke="#8e6f5c" stroke-width=".9" fill="none" pointer-events="none"/>').join("");
    const hair = '<path d="M212 20 L214 40 M213 40 C212 80 214 150 216 176" stroke="#5a4636" stroke-width="3" fill="none" pointer-events="none"/><path d="M204 60 C200 110 204 160 210 184 L224 184 C230 160 232 110 224 60 Z" fill="#e3c8b2" opacity=".5" pointer-events="none"/>' + ps("hair", "M226 222 C230 204 228 190 222 176 M206 170 C212 164 222 164 228 170 M206 160 C212 154 222 154 228 160", "#b39cff", "#b87a5c", 1.4);
    const ruff = ps("ruff", "M270 222 C270 206 272 196 272 188", "#5ef0a0", "#b87a5c", 1.4) + '<path class="pf" data-p="ruff" d="M252 172 C262 160 282 160 292 172 C282 184 262 184 252 172 Z" style="--c:#5ef0a0;--r:#e0c7b4;--rs:#8e6f5c"/>' + ps("ruff", "M258 172 L286 172 M264 166 L270 178 M276 166 L282 178", "#5ef0a0", "#8e6f5c", 0.9);
    const krause = ps("krause", "M76 222 C76 180 78 150 78 136", "#8fd3ff", "#b87a5c", 1.4) + '<circle class="pf" data-p="krause" cx="78" cy="128" r="8" style="--c:#8fd3ff;--r:#e0c7b4;--rs:#8e6f5c"/>' + '<path d="M72 128 q6 -6 12 0 q-6 6 -12 0" stroke="#8e6f5c" stroke-width=".9" fill="none" pointer-events="none"/>';
    const pac = ps("pac", "M150 226 C150 240 150 250 150 262", "#ff9f43", "#b87a5c", 1.4) + '<ellipse class="pf" data-p="pac" cx="150" cy="282" rx="22" ry="16" style="--c:#ff9f43;--r:#f0dfcf;--rs:#8e6f5c"/>' + [16, 12, 8, 4].map((r) => '<ellipse cx="150" cy="282" rx="' + (r * 1.35).toFixed(1) + '" ry="' + r + '" fill="none" stroke="#b89a84" stroke-width=".9" pointer-events="none"/>').join("") + '<path d="M150 266 L150 290" stroke="#6d5a45" stroke-width="1.4" pointer-events="none"/>';
    const muscle =
      '<rect x="336" y="40" width="136" height="170" rx="16" fill="#8f3b4f" opacity=".55" pointer-events="none"/>' + [60, 78, 96, 114, 132, 150, 168, 186].map((y) => '<path d="M344 ' + y + ' L464 ' + y + '" stroke="#c46a7d" stroke-width="5" stroke-linecap="round" pointer-events="none"/>').join("") +
      '<path class="pf" data-p="spin" d="M354 124 C380 112 430 112 456 124 C430 136 380 136 354 124 Z" style="--c:#66e9ff;--r:#f1e2d6;--rs:#8e6f5c"/>' + '<path d="M362 124 L448 124 M362 121 L448 121 M362 127 L448 127" stroke="#c46a7d" stroke-width="1.2" pointer-events="none"/>' + ps("spin", "M398 120 q3 -4 6 0 q3 4 6 0 q3 -4 6 0", "#66e9ff", "#6d5a45", 1.2) +
      '<path d="M360 210 L452 210 L436 318 L376 318 Z" fill="#e8e3d8" opacity=".7" pointer-events="none"/>' + [376, 392, 408, 424, 440].map((x) => '<path d="M' + x + ' 214 L' + (x - (x - 406) * 0.35) + ' 316" stroke="#cfc6b6" stroke-width="3" pointer-events="none"/>').join("") +
      '<path class="pf" data-p="gto" d="M380 232 C396 224 416 224 432 232 L428 260 C414 266 398 266 384 260 Z" style="--c:#5ef0a0;--r:#f7f2ea;--rs:#8e6f5c"/>' + ps("gto", "M406 280 L406 262 M406 262 L394 244 M406 262 L418 244 M394 244 L390 236 M418 244 L422 236 M406 250 L406 236", "#5ef0a0", "#6d5a45", 1.2) +
      T(404, 34, "MUSCLE", "sm mut") + T(406, 332, "TENDON", "sm mut") + T(404, 104, "muscle spindle (intrafusal)", "sm") + T(404, 290, "Golgi tendon organ", "sm");
    const svg = () =>
      '<text class="ttl" x="168" y="16" text-anchor="middle">SENSORY ENDINGS · SKIN</text>' +
      skin + free + krause + merkel + meiss + hair + ruff + pac + muscle +
      T(34, 108, "free", "sm", "end") + T(84, 146, "Krause", "sm", "start") + T(104, 104, "Merkel", "sm", "start") + T(172, 120, "Meissner", "sm", "start") + T(234, 150, "hair follicle", "sm", "start") + T(272, 196, "Ruffini", "sm") + T(176, 300, "Pacinian", "sm", "start");
    A.scene("endings", {
      title: "Sensory nerve endings · skin, muscle and tendon",
      vb: "0 0 480 340",
      svg,
      intro: "Tap an ending for what it senses and how fast it adapts. The chips sort them.",
      parts: {
        free: ["Free nerve endings", "**Unencapsulated** bare endings (Aδ and C fibres) that reach into the epidermis and connective tissue: **pain and temperature** (and crude touch, itch). They are **not** the movement/position sensors."],
        merkel: ["Merkel's disc", "Unencapsulated cup-shaped ending under a **Merkel cell** in the basal epidermis: sustained **touch and pressure**; **slowly adapting**."],
        meiss: ["Meissner's corpuscle", "**Encapsulated**, stacked, in the **dermal papillae** of hairless skin (fingertips, lips): **fine touch**; **rapidly adapting**."],
        hair: ["Hair follicle ending", "Fibres wrapped round the hair root: hair movement; rapidly adapting."],
        ruff: ["Ruffini ending", "**Encapsulated** spindle of branched endings among collagen in the **dermis and joint capsules**: skin stretch, joint angle (**proprioception**); **slowly adapting**."],
        krause: ["Krause's end bulb", "Small **encapsulated** bulb in the dermis and **mucous membranes** (lips, conjunctiva): touch, classically **cold**."],
        pac: ["Pacinian corpuscle", "Large, **onion-like lamellae** round one ending, in the deep dermis, **joint capsules, periosteum, tendons** and mesentery: **vibration** and deep pressure; **very rapidly adapting**. The bank also counts it as a proprioceptor."],
        spin: ["Muscle spindle", "Encapsulated **intrafusal** fibres lying **parallel** to the extrafusal fibres: sense **muscle length** and its rate of change. **Most numerous in antigravity (postural) muscles.**"],
        gto: ["Golgi tendon organ (tendon spindle)", "At the muscle–tendon junction, **in series** with the muscle; the sensory (Ib) endings branch **between the collagen bundles** and are squeezed by **tension**. An encapsulated **proprioceptor** (a mechanoreceptor)."],
      },
      al: {
        free: ["free nerve ending", "free ending", "unencapsulated", "naked nerve ending", "bare nerve ending"],
        merkel: ["merkel", "merkel disc", "merkel cell", "merkels disc", "tactile disc", "tactile meniscus"],
        meiss: ["meissner", "meissner corpuscle", "meissners corpuscle", "tactile corpuscle"],
        hair: ["hair follicle", "hair end organ", "peritrichial", "hair receptor", "hair follicle receptor"],
        ruff: ["ruffini", "ruffini ending", "ruffini corpuscle", "ruffinis end organ", "ruffini end organ"],
        krause: ["krause", "krause end bulb", "krauses end bulb", "end bulb of krause"],
        pac: ["pacinian", "pacinian corpuscle", "pacini", "lamellated corpuscle", "onion like"],
        spin: ["muscle spindle", "intrafusal", "antigravity"],
        gto: ["golgi tendon organ", "tendon organ", "tendon spindle", "neurotendinous spindle", "gto", "collagen bundle"],
      },
      drill: ["free", "merkel", "meiss", "hair", "ruff", "krause", "pac", "spin", "gto"],
      sims: [
        { id: "fast", label: "⚡ Rapidly adapting", on: ["meiss", "pac", "hair"], lost: ["merkel", "ruff", "spin", "gto", "free"], info: "**Rapidly adapting (phasic)**: Meissner, **Pacinian** (the fastest), hair follicle endings: they signal **change** (vibration, movement)." },
        { id: "slow", label: "🐢 Slowly adapting", on: ["merkel", "ruff", "spin", "gto", "free"], info: "**Slowly adapting (tonic)**: Merkel discs, Ruffini endings, **muscle spindles**, Golgi tendon organs, joint receptors and **nociceptors** (pain hardly adapts): they keep signalling a steady stimulus." },
        { id: "caps", label: "Encapsulated?", on: ["meiss", "pac", "ruff", "krause", "spin", "gto"], lost: ["free", "merkel"], info: "**Encapsulated**: Meissner, Pacinian, Krause, Ruffini, muscle spindle, Golgi tendon organ. **Unencapsulated**: free nerve endings and Merkel discs." },
        { id: "prop", label: "Proprioceptors", on: ["spin", "gto", "ruff", "pac"], info: "**Proprioceptors**: muscle spindles (length), **Golgi tendon organs** (tension), joint **Ruffini** endings (angle) and **Pacinian** corpuscles in joint capsules." },
      ],
      secs: { "hi-nervous-tissue#5": "caps", "ph-sensory-receptors#2": "fast", "ph-sensory-code#1": "", "ph-sensory-code#2": "prop" },
      rules: [
        [/rapidly adapt|phasic/i, "fast"],
        [/slowly adapt|tonic receptor/i, "slow"],
        [/encapsulated/i, "caps"],
        [/proprioceptor/i, "prop"],
      ],
    });
  })();
})();
