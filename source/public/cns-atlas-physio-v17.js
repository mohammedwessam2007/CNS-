/* INTELLECTUALITY v17.3 · Physiology close-ups: the muscle spindle, nerve-fibre classes, reflex arcs, complete cord
 * transection, and decerebrate rigidity. Drawn from standard physiology (Guyton / Ganong) in the notes' wording
 * (learn-notes-phys-v15.js), so the answer figure can mark every structure an explanation names.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { smooth } = A;
  const { T, pf, ps, fl } = A.kit;
  const blob = (pts) => smooth(pts, true);
  const dot = (x, y, r, fill) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" pointer-events="none"/>';
  const ld = (x1, y1, x2, y2) => '<path class="ld" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '"/>';
  const chip = (id, x, y, w, l1, l2, c) =>
    '<rect class="pf" data-p="' + id + '" x="' + (x - w / 2) + '" y="' + y + '" width="' + w + '" height="' + (l2 ? 25 : 16) + '" rx="7" style="--c:' + (c || "#d9ff43") + ';--r:#13263c;--rs:#2f4a68"/>' + T(x, y + 11, l1, "sm") + (l2 ? T(x, y + 21, l2, "sm") : "");

  /* ═══════════════ 1. MUSCLE SPINDLE: inside the capsule ═══════════════ */
  (function () {
    const stri = (x0, x1, y, h) => { let d = ""; for (let x = x0 + 3; x < x1; x += 5) d += "M" + x + " " + (y - h / 2 + 1) + " L" + x + " " + (y + h / 2 - 1) + " "; return '<path d="' + d + '" stroke="#7a2f45" stroke-width="1.2" pointer-events="none"/>'; };
    const fibre = (y, h, kind) => {
      const pole = (x0, x1) => '<rect class="pf" data-p="pole" x="' + x0 + '" y="' + (y - h / 2) + '" width="' + (x1 - x0) + '" height="' + h + '" rx="' + h / 2 + '" style="--c:#ff5d8f;--r:#c46a7d"/>' + stri(x0, x1, y, h);
      const mid =
        kind === "bag"
          ? '<path class="pf" data-p="bag" d="M170 ' + (y - h / 2) + " C200 " + (y - h / 2 - 9) + " 280 " + (y - h / 2 - 9) + " 310 " + (y - h / 2) + " L310 " + (y + h / 2) + " C280 " + (y + h / 2 + 9) + " 200 " + (y + h / 2 + 9) + " 170 " + (y + h / 2) + ' Z" style="--c:#66e9ff;--r:#f1e2d6"/>' +
            [[214, -4], [224, 3], [234, -3], [244, 4], [254, -4], [264, 3], [230, 7], [250, -8], [270, -2]].map(([x, dy]) => dot(x, y + dy, 3.4, "#6d4a63")).join("")
          : '<rect class="pf" data-p="chain" x="170" y="' + (y - h / 2) + '" width="140" height="' + h + '" style="--c:#b39cff;--r:#f1e2d6"/>' + [186, 198, 210, 222, 234, 246, 258, 270, 282, 294].map((x) => dot(x, y, 2.4, "#6d4a63")).join("");
      return pole(62, 172) + pole(308, 418) + mid;
    };
    const coil = (y, x0, x1) => { let d = "M" + x0 + " " + (y - 8); for (let x = x0; x < x1; x += 8) d += " C" + (x + 2) + " " + (y - 12) + " " + (x + 6) + " " + (y + 12) + " " + (x + 8) + " " + (y - 8); return d; };
    const svg = () =>
      // extrafusal fibres outside, parallel, with the α axon
      [34, 44, 280, 290].map((y) => '<rect class="pf" data-p="extra" x="20" y="' + (y - 4) + '" width="440" height="8" rx="4" style="--c:#ff9f43;--r:#8f3b4f"/>').join("") +
      ps("alpha", "M468 20 L468 34 M468 34 L430 34 M468 290 L430 290 M468 34 L468 290", "#ff9f43", "#9c7f6a", 2) + T(462, 310, "α motor (Aα) → extrafusal", "sm", "end") +
      '<path class="pf" data-p="cap" d="M40 150 C80 70 160 62 240 62 C320 62 400 70 440 150 C400 230 320 238 240 238 C160 238 80 230 40 150 Z" style="--c:#d9ff43;--r:#0e1f33;--rs:#6f8aa8"/>' +
      fibre(108, 16, "bag") + fibre(160, 11, "chain") + fibre(196, 11, "chain") +
      // Ia (primary, annulospiral) round the centre of every fibre; II (secondary, flower-spray) mainly on chains
      ps("ia", coil(108, 226, 258) + " " + coil(160, 226, 258) + " " + coil(196, 226, 258), "#5ef0a0", "#4f8f6f", 1.8) +
      ps("ia", "M242 100 C242 80 236 60 226 40 L226 20", "#5ef0a0", "#4f8f6f", 3) +
      ps("ii", "M290 154 l-6 -8 M290 154 l0 -10 M290 154 l6 -8 M290 190 l-6 -8 M290 190 l0 -10 M290 190 l6 -8 M290 154 C296 120 300 80 300 20", "#ffd166", "#a88a4e", 1.8) +
      // γ efferents to the striated polar ends
      ps("gam", "M120 22 C122 50 120 80 118 102 M118 102 l-6 3 M118 102 l6 3 M112 154 l-6 3 M112 154 l6 3 M112 154 C116 120 120 60 120 22 M364 190 l-6 3 M364 190 l6 3 M364 154 l-6 3 M364 154 l6 3 M364 102 l-6 3 M364 102 l6 3 M364 102 C366 70 368 40 370 22", "#b39cff", "#8f7fc1", 1.6) +
      T(226, 16, "Ia (annulospiral)", "sm", "end") + T(304, 16, "II (flower-spray)", "sm", "start") + T(120, 16, "γ (Aγ) efferent", "sm") + T(370, 16, "γ", "sm") +
      T(116, 132, "polar end: striated, contractile", "sm") + T(364, 132, "polar end: striated", "sm") +
      T(240, 84, "nuclear BAG (dynamic)", "sm") + T(240, 222, "nuclear CHAIN (static)", "sm") + T(240, 252, "central region: nucleated, NON-striated → the receptor", "sm") +
      T(240, 268, "capsule: 3–12 intrafusal fibres, parallel to the extrafusal muscle", "sm mut") +
      '<g class="ov" data-x="stretch"><path d="M40 150 L8 150 M440 150 L472 150" stroke="#d9ff43" stroke-width="3" marker-end="url(#ixArr)"/></g>' +
      '<g class="ov" data-x="gpull"><path d="M150 176 L186 176 M330 176 L294 176" stroke="#b39cff" stroke-width="3" marker-end="url(#ixArr)"/>' + T(240, 180, "poles contract → centre stretched", "sm") + "</g>" +
      '<g class="ov" data-x="slack"><path d="M100 150 C140 136 180 164 240 148 C300 134 340 164 380 150" stroke="#ff5d7a" stroke-width="2" fill="none" stroke-dasharray="4 3"/>' + T(240, 146, "muscle shortens → spindle SLACK", "sm") + "</g>";
    A.scene("spindle", {
      title: "Muscle spindle · bag and chain fibres, Ia and II endings, γ to the poles",
      vb: "0 0 480 320",
      svg,
      intro: "The **centre** of each intrafusal fibre is the **receptor** (sensory endings); the **poles** are **contractile** (γ motor). Tap a part or run a state.",
      parts: {
        cap: ["Capsule with 3–12 intrafusal fibres", "Present in **all skeletal muscles**, most numerous in **antigravity** muscles; lies **parallel** to the extrafusal fibres, so it senses **length** (not tension). It has **both afferent and efferent** nerves."],
        pole: ["Polar ends (striated, contractile)", "Supplied by **γ-efferents (Aγ)**. When they contract they **stretch the central region**."],
        bag: ["Nuclear bag fibre", "Central region **swollen with a cluster of nuclei**; supplied by the **primary (Ia, annulospiral)** ending. Gives the **dynamic** response (rate of stretch): the **tendon jerk**."],
        chain: ["Nuclear chain fibre", "Thinner, nuclei **in a single row**; supplied by **Ia and II** endings. Gives the **static** response (maintained stretch): **muscle tone**."],
        ia: ["Primary (Ia, annulospiral) ending", "Wraps the **central receptor region of both bag and chain** fibres. Fast (Aα-sized) afferent → **monosynaptic** excitation of α-motor neurons of the same muscle; also interneurons and ascending 2nd-order neurons, **never** γ-motor neurons."],
        ii: ["Secondary (II, flower-spray) ending", "Mainly on **nuclear chain** fibres, beside the primary ending: **static** length (Aβ-sized)."],
        gam: ["γ-efferent (Aγ) motor fibres", "To the **polar contractile ends**, not the centre and not the extrafusal fibres. γ discharge **loads** the spindle → more discharge → more α activity (the **γ loop**): γ neurons set **muscle tone**."],
        extra: ["Extrafusal muscle fibres", "The working muscle, supplied by **Aα** (α-motor) fibres. Their contraction **unloads** the spindle."],
        alpha: ["α-motor (Aα) fibres", "To the extrafusal fibres only, **not** to the spindle."],
      },
      al: {
        cap: ["intrafusal fiber", "intrafusal", "capsule", "3 12 intrafusal", "all skeletal muscles", "antigravity muscle", "large skeletal muscles"],
        pole: ["polar", "polar end", "polar part", "peripheral contractile", "contractile part", "contractile end", "striated portion", "striated part", "striated polar"],
        bag: ["nuclear bag", "bag fiber", "nuclear bag fiber", "dynamic response", "dynamic"],
        chain: ["nuclear chain", "chain fiber", "nuclear chain fiber", "static response", "static"],
        ia: ["ia", "primary ending", "annulospiral", "ia afferent", "ia nerve fiber", "ia fiber", "type ia", "group ia", "primary afferent", "central receptor area", "central region", "receptor area", "non striated", "nonstriated", "central part", "central zone"],
        ii: ["type ii", "group ii", "ii fiber", "ii nerve fiber", "ia and ii", "secondary ending", "flower spray", "ii afferent", "only type ii"],
        gam: ["gamma efferent", "gamma motor", "agamma", "fusimotor", "gamma fiber", "gamma discharge", "efferent ending", "gamma loop", "efferent"],
        extra: ["extrafusal", "extrafusal fiber", "extrafusal muscle fiber", "unload", "unloads"],
        alpha: ["alpha motor", "aalpha", "alpha efferent", "alpha discharge", "alpha motor neuron discharge"],
      },
      drill: ["cap", "pole", "bag", "chain", "ia", "ii", "gam", "extra"],
      sims: [
        { id: "stretch", label: "↔ Stretch the muscle", show: ["stretch"], on: ["ia", "ii", "bag", "chain"], info: "Stretching the muscle stretches the spindle (it lies parallel) → the central regions stretch → **Ia and II fire more**. Discharge **increases with stretch**." },
        { id: "gamma", label: "γ fires", show: ["gpull"], on: ["gam", "pole", "ia"], info: "γ discharge contracts the **polar ends**, which **stretch the centre** → Ia discharge **rises** even without muscle stretch → more α drive (**γ loop**). Cutting γ supply **relaxes** the intrafusal fibres: the spindle loses sensitivity." },
        { id: "alpha", label: "α alone", show: ["slack"], on: ["alpha", "extra"], lost: ["ia", "ii"], info: "α discharge alone shortens the extrafusal muscle and **unloads** the spindle → spindle discharge **falls**. That is why the brain drives **α and γ together (co-activation)**: the spindle keeps signalling while the muscle shortens." },
        { id: "dyn", label: "Dynamic vs static", on: ["bag", "chain"], info: "**Nuclear bag** (Ia) → **dynamic** response to the **rate** of stretch: the **tendon jerk**. **Nuclear chain** (Ia + II) → **static** response to maintained stretch: **muscle tone**." },
      ],
      secs: { "ph-spinal-reflexes#1": "", "ph-spinal-reflexes#2": "gamma" },
      rules: [
        [/co-?activation|alpha.{0,20}discharge.{0,40}(unload|decreas)|unload/i, "alpha"],
        [/gamma|γ|fusimotor|tone/i, "gamma"],
        [/nuclear (bag|chain)|dynamic|static/i, "dyn"],
        [/spindle|intrafusal|annulospiral|flower/i, "stretch"],
      ],
    });
  })();

  /* ═══════════════ 2. NERVE FIBRE CLASSES: size, speed and job ═══════════════ */
  (function () {
    // [id, label, sensory class, diameter, speed (m/s), width px, job, myelinated]
    const R = [
      ["aa", "Aα", "Ia · Ib", "12–20 µm", "70–120", 300, "Ia spindle · Ib tendon organ · α-motor", 1],
      ["ab", "Aβ", "II", "5–12 µm", "30–70", 190, "touch, pressure, vibration · spindle II", 1],
      ["ag", "Aγ", "", "3–6 µm", "15–30", 110, "γ-motor to the spindle poles", 1],
      ["ad", "Aδ", "III", "2–5 µm", "6–30", 90, "FAST (sharp) pain · cold · crude touch", 1],
      ["b", "B", "", "< 3 µm", "3–15", 52, "preganglionic autonomic", 1],
      ["c", "C", "IV", "0.4–1.2 µm", "0.5–2", 18, "SLOW (burning) pain · warmth · itch · postganglionic", 0],
    ];
    const rows = R.map(([id, n, cls, dia, v, w, job, my], i) => {
      const y = 50 + i * 42;
      return (
        '<rect class="pf" data-p="' + id + '" x="70" y="' + y + '" width="' + w + '" height="16" rx="8" style="--c:#d9ff43;--r:' + (my ? "#4cc9f0" : "#ff9f43") + (my ? "" : ";--rs:#ff9f43") + '"' + (my ? "" : ' stroke-dasharray="4 3"') + "/>" +
        T(14, y + 12, n, "big", "start") + T(40, y + 12, cls, "sm mut", "start") +
        T(76 + w, y + 12, v + " m/s", "sm", "start") + T(70, y + 30, dia + " · " + job, "sm mut", "start")
      );
    }).join("");
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">NERVE FIBRE CLASSES · BAR = CONDUCTION SPEED</text>' +
      T(14, 38, "class · sensory", "sm mut", "start") + T(150, 38, "bar = speed · then diameter · job", "sm mut", "start") +
      rows +
      '<rect x="70" y="306" width="12" height="8" rx="4" fill="#4cc9f0"/>' + T(86, 314, "myelinated", "sm", "start") + '<rect x="160" y="306" width="12" height="8" rx="4" fill="#ff9f43"/>' + T(176, 314, "unmyelinated (C only)", "sm", "start") +
      T(466, 314, "bigger fibre = faster", "sm mut", "end");
    A.scene("fibers", {
      title: "Nerve fibre classes · who is fast, who carries what",
      vb: "0 0 480 324",
      svg,
      intro: "The bar is the conduction speed. The bigger and more myelinated the fibre, the faster it conducts. Tap a class; the chips show who fails first.",
      parts: {
        aa: ["Aα (sensory Ia and Ib)", "12–20 µm, **70–120 m/s**, the fastest. **Ia**: primary spindle endings. **Ib**: Golgi tendon organs. Also the **α-motor** fibres to extrafusal muscle."],
        ab: ["Aβ (sensory II)", "5–12 µm, 30–70 m/s: **touch, pressure, vibration**, and the **secondary (II) spindle endings**."],
        ag: ["Aγ", "3–6 µm, 15–30 m/s: the **γ-motor** fibres to the **polar ends** of intrafusal fibres."],
        ad: ["Aδ (sensory III)", "Thin, myelinated, **6–30 m/s**: **fast (sharp, pricking) pain**, **cold**, crude touch. Transmitter **glutamate**; ends in lamina I → neospinothalamic tract."],
        b: ["B fibres", "Thin, myelinated, 3–15 m/s: **preganglionic autonomic** fibres."],
        c: ["C fibres (sensory IV)", "**Unmyelinated**, 0.4–1.2 µm, **0.5–2 m/s**, the slowest: **slow (dull, burning) pain**, warmth, itch; also the **postganglionic sympathetic** fibres. Transmitter **substance P**; ends in the substantia gelatinosa → paleospinothalamic tract."],
      },
      al: {
        aa: ["aalpha", "a alpha", "alpha fiber", "ia", "ib", "type ia", "type ib", "group ia", "group ib", "ia fiber", "ib fiber", "ia nerve fiber"],
        ab: ["abeta", "a beta", "beta fiber", "type ii", "group ii", "ii fiber", "ii nerve fiber", "ia and ii"],
        ag: ["agamma", "a gamma", "gamma fiber", "agamma nerve fiber"],
        ad: ["adelta", "a delta", "delta fiber", "adelta fiber", "type iii", "group iii", "iii fiber", "fast pain", "sharp pain", "pricking pain", "first pain", "cold"],
        b: ["b fiber", "preganglionic autonomic", "preganglionic fiber"],
        c: ["c fiber", "c nerve fiber", "type iv", "group iv", "iv fiber", "slow pain", "dull pain", "burning pain", "second pain", "aching pain", "warmth", "itch", "unmyelinated fiber", "aδ and c", "adelta and c"],
      },
      drill: ["aa", "ab", "ag", "ad", "b", "c"],
      sims: [
        { id: "pain", label: "Fast vs slow pain", on: ["ad", "c"], info: "**Fast pain**: **Aδ**, 6–30 m/s, sharp and well localized, glutamate → neospinothalamic. **Slow pain**: **C**, 0.5–2 m/s, burning and poorly localized, substance P → paleospinothalamic." },
        { id: "pressure", label: "Pressure blocks first", lost: ["aa", "ab", "ag", "ad"], on: ["c"], info: "Pressure on a nerve blocks the **large A fibres first** (touch and position go, pain survives)." },
        { id: "hypoxia", label: "Hypoxia blocks first", lost: ["b"], info: "**B fibres** are the most sensitive to **hypoxia**." },
        { id: "la", label: "Local anaesthetic first", lost: ["c"], on: ["aa"], info: "**Local anaesthetics** block the thin **C fibres first** (pain goes before touch and movement)." },
      ],
      secs: { "ph-pain#1": "pain", "ph-sensory-code#0": "" },
      rules: [
        [/local an(a)?esthe/i, "la"],
        [/hypoxi/i, "hypoxia"],
        [/pressure.{0,30}(block|nerve)/i, "pressure"],
        [/fast pain|slow pain|a ?δ|a[\s-]?delta|c fib/i, "pain"],
      ],
    });
  })();

  /* ═══════════════ 3. REFLEX ARCS: monosynaptic vs polysynaptic; withdrawal and crossed extensor; jerk centres ═══════════════ */
  (function () {
    const cord =
      '<path d="M190 116 C190 86 212 70 240 70 C268 70 290 86 290 116 C290 146 268 162 240 162 C212 162 190 146 190 116 Z" fill="#e7ecf3" opacity=".14" stroke="#6f8aa8" pointer-events="none"/>' +
      '<path d="M222 90 L232 108 L228 132 L216 144 M258 90 L248 108 L252 132 L264 144" stroke="#c7aebe" stroke-width="10" fill="none" stroke-linecap="round" opacity=".5" pointer-events="none"/>';
    const legL = '<path d="M112 150 L98 190 L104 222 L90 230" stroke="#c9b8a8" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>';
    const legR = '<path d="M368 150 L384 192 L382 224 L396 230" stroke="#c9b8a8" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>';
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">WITHDRAWAL + CROSSED EXTENSOR · POLYSYNAPTIC</text>' +
      cord + legL + legR +
      '<path class="pf" data-p="noc" d="M78 224 L92 218 L98 232 L86 240 Z" style="--c:#ff5d7a;--r:#a86a6a"/>' + T(30, 246, "painful stimulus", "sm", "start") +
      ps("aff", "M88 226 C50 190 80 130 190 106 L226 100", "#ff9f43", "#8a7a66", 2.4) +
      '<circle class="pf" data-p="inter" cx="232" cy="112" r="5" style="--c:#d9ff43;--r:#8f7fc1"/><circle class="pf" data-p="inter" cx="226" cy="128" r="5" style="--c:#d9ff43;--r:#8f7fc1"/>' +
      ps("cross", "M232 112 C240 118 246 122 256 126", "#d9ff43", "#8f7fc1", 2.2) + '<circle class="pf" data-p="cross" cx="258" cy="126" r="5" style="--c:#d9ff43;--r:#8f7fc1"/>' +
      ps("flx", "M226 128 C200 140 150 150 112 162", "#5ef0a0", "#5f8c77", 2.4) + '<rect class="pf" data-p="flx" x="100" y="160" width="10" height="30" rx="5" transform="rotate(18 105 175)" style="--c:#5ef0a0;--r:#8f3b4f"/>' + T(90, 170, "flexors contract", "sm", "end") +
      ps("exti", "M226 128 C206 150 172 170 124 180", "#ff5d7a", "#8a7a66", 1.6) + '<rect class="pf" data-p="exti" x="116" y="168" width="8" height="28" rx="4" transform="rotate(18 120 182)" style="--c:#ff5d7a;--r:#6d3a4a"/>' + T(134, 204, "extensors inhibited", "sm", "start") +
      ps("extc", "M258 126 C290 140 330 152 366 164", "#66e9ff", "#8a7a66", 2.4) + '<rect class="pf" data-p="extc" x="366" y="160" width="10" height="32" rx="5" transform="rotate(-20 371 176)" style="--c:#66e9ff;--r:#8f3b4f"/>' + T(396, 196, "opposite extensors", "sm", "start") + T(396, 208, "contract: support", "sm", "start") +
      T(96, 92, "Aδ / C afferent", "sm", "end") + T(240, 58, "interneurons (≥3 neurons in series)", "sm") +
      fl("wd", "M88 226 C50 190 80 130 190 106 L226 100 L232 112 L226 128 C200 140 150 150 112 162", "#ff9f43", 3, "2s") + fl("wd", "M232 112 C240 118 246 122 256 126 C290 140 330 152 366 164", "#66e9ff", 3, "2s") +
      // mono vs poly boxes and jerk centres
      chip("mono", 420, 40, 104, "MONOSYNAPTIC", "stretch reflex · 1 synapse") + T(420, 78, "central delay ≈ 0.5 ms", "sm mut") + T(420, 90, "shortest reflex time", "sm mut") +
      chip("poly", 420, 98, 104, "POLYSYNAPTIC", "withdrawal, crossed ext.", "#ff9f43") + T(420, 136, "longer delay, irradiation,", "sm mut") + T(420, 148, "after-discharge", "sm mut") +
      '<text class="ttl" x="240" y="262" text-anchor="middle">DEEP (TENDON JERK) CENTRES · SUPERFICIAL REFLEXES</text>' +
      chip("jjaw", 44, 272, 70, "jaw jerk", "pons (V)", "#66e9ff") + chip("jbic", 118, 272, 70, "biceps", "C5–C6", "#66e9ff") + chip("jtri", 192, 272, 70, "triceps", "C6–C7", "#66e9ff") +
      chip("jknee", 266, 272, 70, "knee", "L2–L4", "#66e9ff") + chip("jank", 340, 272, 70, "ankle", "S1–S2", "#66e9ff") + chip("jdel", 414, 272, 70, "deltoid", "C5", "#66e9ff") + chip("sup", 240, 302, 220, "superficial (skin): abdominal, cremasteric,", "plantar (extensor = Babinski sign)", "#ff9f43");
    A.scene("reflexes", {
      title: "Reflex arcs · monosynaptic vs polysynaptic, withdrawal and crossed extensor",
      vb: "0 0 480 334",
      svg,
      intro: "A painful stimulus to the left foot: the **same** leg flexes away while the **opposite** leg extends to hold the body up. Right: what makes the stretch reflex special, and the jerk centres.",
      parts: {
        noc: ["Nociceptor (painful skin stimulus)", "The receptor of the **flexor withdrawal** reflex: a **superficial**, polysynaptic reflex."],
        aff: ["Afferent (Aδ / C)", "Pain afferents enter the dorsal horn and branch onto interneurons."],
        inter: ["Interneurons", "At least **three sets of sequential neurons**: **polysynaptic**. They spread the signal up and down the cord (**irradiation**) and keep firing after the stimulus (**after-discharge**)."],
        flx: ["Flexors of the same limb contract", "**Flexor withdrawal reflex**: the limb moves away; it is the **first reflex to recover** after spinal shock."],
        exti: ["Extensors of the same limb inhibited", "**Reciprocal innervation**: the antagonists relax."],
        cross: ["Crossing interneurons", "Carry the signal to the **opposite** side of the cord."],
        extc: ["Opposite extensors contract", "**Crossed extensor reflex**: the other limb extends to **support the body against gravity**. Polysynaptic, part of the withdrawal response."],
        mono: ["Monosynaptic reflex (stretch reflex)", "Only **two sets of neurons** and **one synapse**: central delay about **0.5 ms**, the **shortest reflex time**. The **knee jerk** is a stretch reflex; the **final common path** is the α-motor neuron."],
        poly: ["Polysynaptic reflexes", "Withdrawal, crossed extensor, scratch, **mass reflex**: interneurons, longer central delay, irradiation, after-discharge."],
        jjaw: ["Jaw jerk", "Centre in the **pons** (trigeminal, V)."],
        jbic: ["Biceps jerk", "Centre **C5–C6**."],
        jdel: ["Deltoid jerk", "Centre mainly **C5** (axillary nerve): not the C5–C6 jerk, which is the biceps."],
        jtri: ["Triceps jerk", "Centre **C6–C7**."],
        jknee: ["Knee jerk", "Centre **L2–L4** (L3–L4): a **dynamic stretch reflex**."],
        jank: ["Ankle jerk", "Centre **S1–S2**."],
        sup: ["Superficial reflexes", "From skin, polysynaptic: **abdominal**, **cremasteric**, **plantar** (Babinski sign when it is extensor after a UMN lesion)."],
      },
      al: {
        noc: ["nociceptor", "painful stimulus", "polysynaptic nociceptor", "skin stimulus"],
        aff: ["afferent neuron", "afferent neurons", "afferent"],
        inter: ["interneuron", "local interneuron", "three sequential sets", "three sets of sequential neurons", "irradiation", "after discharge", "at least three"],
        flx: ["flexor withdrawal", "withdrawal reflex", "flexor reflex", "flexor withdrawal reflex", "withdrawal"],
        exti: ["reciprocal innervation", "reciprocal inhibition"],
        cross: ["crossed extensor", "crossed extensor reflex", "contralateral"],
        extc: ["support the body against gravity", "opposite limb", "crossed extensor", "extension of the opposite"],
        mono: ["monosynaptic", "one synapse", "central delay", "0 5 msec", "0 5 ms", "two sets of sequential neurons", "reflex time", "stretch reflex", "final common path", "shortest reflex time"],
        poly: ["polysynaptic", "scratch reflex", "mass reflex", "polysynaptic reflex"],
        jjaw: ["jaw jerk"],
        jbic: ["biceps jerk", "c5 c6", "5th and 6th cervical"],
        jdel: ["deltoid jerk"],
        jtri: ["triceps jerk", "c6 c7", "c7 c8"],
        jknee: ["knee jerk", "patellar", "l2 l4", "l3 l4"],
        jank: ["ankle jerk", "s1 s2"],
        sup: ["superficial reflex", "abdominal reflex", "plantar reflex", "cremasteric", "babinski", "babinski sign"],
      },
      drill: ["noc", "inter", "flx", "exti", "cross", "extc", "mono", "poly", "jbic", "jknee"],
      sims: [
        { id: "wd", label: "▶ Step on a pin", show: ["wd"], on: ["noc", "aff", "inter", "flx", "cross", "extc"], lost: ["exti"], info: "Pain → **polysynaptic** arc → the same leg **flexes** (extensors inhibited: reciprocal innervation) and the **opposite** leg **extends** to carry the weight (**crossed extensor**)." },
        { id: "mono", label: "Monosynaptic vs polysynaptic", on: ["mono", "poly"], info: "**Monosynaptic** (stretch reflex): 2 neurons, 1 synapse, delay ~0.5 ms, a **deep** reflex. **Polysynaptic**: interneurons, longer delay, irradiation, after-discharge; the withdrawal reflex is **superficial**." },
        { id: "jerks", label: "Jerk centres", on: ["jjaw", "jbic", "jdel", "jtri", "jknee", "jank"], info: "Tendon jerks test the **integrity of the reflex arc** at a level: jaw **pons**, biceps **C5–C6**, triceps **C6–C7**, knee **L2–L4**, ankle **S1–S2**." },
      ],
      secs: { "ph-spinal-reflexes#0": "mono", "ph-spinal-reflexes#5": "wd" },
      rules: [
        [/withdrawal|crossed extensor|scratch|mass reflex|irradiation/i, "wd"],
        [/jerk|c5|c6|l3|s1/i, "jerks"],
        [/monosynaptic|polysynaptic|central delay|reflex time|sequential neurons/i, "mono"],
      ],
    });
  })();

  /* ═══════════════ 4. COMPLETE CORD TRANSECTION: spinal shock, then recovery ═══════════════ */
  (function () {
    const X0 = 118, X1 = 250, X2 = 468; // now → 2–6 weeks → months
    const row = (id, y, label, a, b, ca, cb) =>
      T(10, y + 12, label, "sm", "start") +
      '<rect class="pf" data-p="' + id + '" x="' + X0 + '" y="' + y + '" width="' + (X1 - X0 - 2) + '" height="18" rx="5" style="--c:#d9ff43;--r:' + ca + '"/>' + T((X0 + X1) / 2, y + 12, a, "sm dk") +
      '<rect class="pf" data-p="' + id + '" x="' + X1 + '" y="' + y + '" width="' + (X2 - X1) + '" height="18" rx="5" style="--c:#d9ff43;--r:' + cb + '"/>' + T((X1 + X2) / 2, y + 12, b, "sm dk");
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">COMPLETE TRANSECTION · BELOW THE LESION, OVER TIME</text>' +
      '<rect class="pf" data-p="shock" x="' + X0 + '" y="28" width="' + (X1 - X0 - 2) + '" height="20" rx="6" style="--c:#ff5d7a;--r:#5c1224"/>' + T((X0 + X1) / 2, 42, "SPINAL SHOCK · 2–6 wk", "sm") +
      '<rect x="' + X1 + '" y="28" width="' + (X2 - X1) + '" height="20" rx="6" fill="#123a28" pointer-events="none"/>' + T((X1 + X2) / 2, 42, "RECOVERY OF REFLEX ACTIVITY (months)", "sm") +
      row("refl", 58, "spinal reflexes", "ALL absent", "return: flexor withdrawal FIRST → exaggerated", "#8f3b4f", "#2f8a5c") +
      row("tone", 86, "muscle tone", "flaccid", "spastic (UMN picture)", "#8f3b4f", "#2f8a5c") +
      row("bp", 114, "blood pressure", "falls: vasomotor tone lost", "partly recovers", "#8f3b4f", "#4f6f58") +
      row("bladder", 142, "bladder", "retention + overflow", "automatic (reflex) bladder", "#8f3b4f", "#2f8a5c") +
      row("flexp", 170, "posture", "not yet", "paraplegia in FLEXION, mass reflex", "#243448", "#a8742e") +
      row("extp", 198, "chronic", "not yet", "paraplegia in EXTENSION (crossed ext.)", "#243448", "#2f8a5c") +
      '<rect class="pf" data-p="perm" x="' + X0 + '" y="232" width="' + (X2 - X0) + '" height="22" rx="6" style="--c:#ff5d7a;--r:#5c1224"/>' + T((X0 + X2) / 2, 247, "PERMANENT: all sensation and all voluntary movement below the lesion", "sm") +
      T(10, 247, "never back", "sm", "start") +
      T(240, 276, "Cause of shock: sudden loss of facilitation from higher centres.", "sm mut") + T(240, 290, "Reflexes are NOT lost permanently; micturition is lost only for a while.", "sm mut") +
      T(X0, 310, "transection", "sm mut", "middle") + T(X1, 310, "≈ 2–6 weeks", "sm mut", "middle") + T(X2, 310, "months", "sm mut", "end") + '<path d="M' + X0 + " 300 L" + X2 + ' 300" stroke="#6f8aa8" stroke-width="1.4" marker-end="url(#ixArr)" pointer-events="none"/>';
    A.scene("transect", {
      title: "Complete cord transection · spinal shock, then recovery",
      vb: "0 0 480 318",
      svg,
      intro: "Read each row left to right: what is lost in **spinal shock**, and what comes back. The red bar never changes.",
      parts: {
        shock: ["Spinal shock", "Right after a complete transection: **failure of all spinal reflexes below the lesion**, flaccid paralysis, **hypotension**, bladder **retention with overflow**. About **2–6 weeks** in humans. Cause: sudden loss of facilitation from higher centres."],
        refl: ["Spinal reflexes", "Absent in shock (deep and visceral reflexes are **not** intact); they return, **flexor withdrawal first**, then become exaggerated."],
        tone: ["Muscle tone", "Flaccid in shock; later spastic."],
        bp: ["Blood pressure", "**Loss of vasomotor tone → hypotension** (a severe drop in ABP) during shock; partly recovers as spinal vasomotor reflexes return."],
        bladder: ["Bladder", "Shock: **retention with overflow**. Recovery: an **automatic (reflex) bladder** that empties by reflex, not by will."],
        flexp: ["Paraplegia in flexion", "Flexor spasms and the **mass reflex** (a small skin stimulus **irradiates**: both legs flex, bladder and rectum empty, sweating). A sign of a **hyperexcitable** cord released from inhibition, not of a central inhibitory state."],
        extp: ["Paraplegia in extension", "In **chronic** paraplegia the extensors predominate, with crossed extensor responses."],
        perm: ["Permanent loss", "**All sensation and all voluntary movement** below the lesion are lost for good. The reflexes are **not** lost permanently."],
      },
      al: {
        shock: ["spinal shock", "phase of spinal shock", "2 6 weeks", "failure of spinal reflexes", "failure of all spinal reflexes", "areflexia", "complete transection", "transection"],
        refl: ["reflexes below the level", "visceral and deep reflexes", "spinal reflexes", "reflexes mediated by the cord", "exaggerated tendon jerks"],
        tone: ["flaccid", "flaccidity", "spasticity of the paralyzed", "spastic"],
        bp: ["hypotension", "vasomotor tone", "drop of abp", "severe drop of abp", "blood pressure", "loss of vasomotor"],
        bladder: ["retention with overflow", "retention", "overflow", "automatic bladder", "micturition reflex", "micturition", "hyperactive bladder", "bladder"],
        flexp: ["paraplegia in flexion", "mass reflex", "flexor spasm", "severe flexor spasm", "irradiation of afferent"],
        extp: ["paraplegia in extension", "chronic paraplegia"],
        perm: ["permanent loss", "loss of voluntary movement", "voluntary movement", "sensation below", "all sensation"],
      },
      drill: ["shock", "refl", "bp", "bladder", "flexp", "extp", "perm"],
      sims: [
        { id: "shock", label: "Spinal shock", on: ["shock", "refl", "tone", "bp", "bladder", "perm"], info: "**Spinal shock** (2–6 weeks): **all** reflexes below the lesion fail, flaccidity, **hypotension** (vasomotor tone lost), bladder **retention with overflow**." },
        { id: "rec", label: "Recovery", on: ["refl", "bladder", "flexp", "extp"], info: "**Flexor withdrawal returns first** → paraplegia in flexion, **mass reflex**, **automatic bladder** → in chronic cases **paraplegia in extension**. Sensation and voluntary movement never return." },
      ],
      secs: { "ph-spinal-reflexes#6": "shock" },
      rules: [
        [/recover|mass reflex|chronic|paraplegia in/i, "rec"],
        [/spinal shock|transection|transected|section of the spinal cord/i, "shock"],
      ],
    });
  })();

  /* ═══════════════ 5. DECEREBRATE RIGIDITY: who drives γ, who brakes it ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="200" y="16" text-anchor="middle">BRAINSTEM CONTROL OF γ · SAGITTAL VIEW</text>' +
      // cerebrum, brainstem, cerebellum outlines
      '<path d="M40 110 C40 50 120 26 200 30 C280 34 330 60 330 110 C300 118 250 116 214 118 L186 118 C140 120 80 122 40 110 Z" fill="#2a3a52" pointer-events="none"/>' +
      '<path d="M186 118 L214 118 L218 150 L222 190 L224 236 L226 300 L204 300 L202 236 L198 190 L192 150 Z" fill="#3a4c63" pointer-events="none"/>' +
      '<path d="M238 176 C262 160 302 162 312 188 C318 210 292 226 262 222 C248 220 240 210 238 200 Z" fill="#35503c" pointer-events="none"/>' +
      T(130, 72, "cerebrum", "sm mut") + T(200, 312, "spinal cord", "sm mut") +
      '<path class="pf" data-p="ctx" d="M70 84 C100 64 150 58 186 70 L180 100 C140 92 100 96 74 104 Z" style="--c:#ff5d7a;--r:#6d3a4a"/>' + T(126, 90, "cortex + basal ganglia", "sm") +
      '<circle class="pf" data-p="rn" cx="204" cy="132" r="7" style="--c:#ff5d7a;--r:#a84a5a"/>' + T(176, 134, "red nucleus", "sm", "end") +
      '<path class="ps" data-p="cut" d="M168 144 L244 150" style="--c:#d9ff43;--r:#ff5d7a;--w:3" stroke-dasharray="6 3"/>' + T(250, 148, "✂ between the colliculi", "sm", "start") +
      '<ellipse class="pf" data-p="prf" cx="208" cy="176" rx="10" ry="14" style="--c:#5ef0a0;--r:#2f8a5c"/>' + T(178, 176, "pontine RF (+)", "sm", "end") +
      '<ellipse class="pf" data-p="vn" cx="220" cy="206" rx="7" ry="8" style="--c:#5ef0a0;--r:#2f8a5c"/>' + T(234, 240, "lateral vestibular", "sm", "start") + T(234, 252, "nucleus (+)", "sm", "start") + ld(236, 234, 224, 212) +
      '<ellipse class="pf" data-p="mrf" cx="210" cy="236" rx="9" ry="13" style="--c:#ff5d7a;--r:#8f3b4f"/>' + T(180, 238, "medullary RF (−)", "sm", "end") +
      '<path class="pf" data-p="cb" d="M248 182 C268 170 298 174 304 192 C308 206 290 216 268 214 C256 212 250 200 248 190 Z" style="--c:#ff9f43;--r:#4e7a62"/>' + T(312, 180, "cerebellum", "sm", "start") +
      // spinal output to γ, dorsal root
      '<circle class="pf" data-p="gmn" cx="214" cy="282" r="6" style="--c:#b39cff;--r:#6e5a9a"/>' + T(184, 286, "γ-motor neurons", "sm", "end") +
      ps("dr", "M226 274 C260 270 300 276 330 290", "#66e9ff", "#6f8aa8", 2.4) + T(334, 290, "dorsal root (γ loop)", "sm", "start") +
      // the decerebrate cat: all four legs rigidly extended, head and tail up
      '<g class="pf" data-p="ext" transform="translate(12 0)" style="--c:#d9ff43;--r:#c9b8a8"><ellipse cx="392" cy="150" rx="48" ry="17" style="fill:var(--r)"/><circle cx="446" cy="128" r="13" style="fill:var(--r)"/><path d="M438 118 L436 106 L444 114 M452 116 L456 104 L458 118" style="fill:var(--r)"/>' +
      '<path d="M356 160 L352 226 M372 164 L370 228 M412 164 L414 228 M428 160 L432 226 M346 146 C336 134 332 122 334 108" stroke-width="7" fill="none" stroke-linecap="round" style="stroke:var(--r)"/></g>' +
      T(392, 250, "all four limbs extended", "sm") + T(392, 262, "(antigravity γ-rigidity)", "sm mut") +
      fl("drive", "M208 176 L212 230 L214 276", "#5ef0a0", 3, "1.8s") + fl("drive", "M222 206 L216 276", "#5ef0a0", 3, "1.8s");
    A.scene("decer", {
      title: "Decerebrate rigidity · who drives γ, and who brakes it",
      vb: "0 0 480 320",
      svg,
      intro: "**Green** centres excite the γ-motor neurons; **red** ones inhibit them. Cut between the colliculi and see which side wins.",
      parts: {
        ctx: ["Cortex and basal ganglia (inhibitory)", "Higher **supraspinal inhibitory** centres; they act partly through the medullary reticular formation."],
        rn: ["Red nucleus", "Lies **above** the decerebrate cut."],
        cut: ["Section between the colliculi", "**Decerebration**: above the vestibular nuclei, below the red nucleus. It removes the higher inhibitory drive."],
        prf: ["Pontine reticular formation (facilitatory)", "Excites extensor γ-motor neurons. Intrinsically active, so after decerebration it acts **unopposed** → **extensor rigidity**."],
        vn: ["Lateral vestibular nucleus (facilitatory)", "Excites antigravity (extensor) motor neurons."],
        mrf: ["Medullary reticular formation (inhibitory)", "Inhibits γ-motor neurons, but it **needs drive from the cortex**; after decerebration it is silent. The rigidity is **not** caused by its overactivity."],
        cb: ["Cerebellum (anterior lobe)", "Inhibits the vestibular nuclei; removing it worsens decerebrate rigidity."],
        gmn: ["γ-motor neurons", "Driven hard by the pontine RF and vestibular nuclei → spindles loaded → stretch reflexes → rigidity."],
        dr: ["Dorsal roots", "Carry the spindle afferents of the γ loop. **Cutting the dorsal roots abolishes decerebrate (γ) rigidity.**"],
        ext: ["Decerebrate posture", "All four limbs **extended**: exaggerated antigravity tone."],
      },
      al: {
        ctx: ["supraspinal inhibitory", "inhibitory center", "higher centers", "supraspinal", "higher center"],
        rn: ["red nucleus"],
        cut: ["decerebrate", "decerebration", "intercollicular", "between the colliculi", "decerebrate animal"],
        prf: ["pontine reticular", "pontine reticular formation", "pontine reticular nuclei", "facilitatory center", "facilitatory centers", "supraspinal facilitatory"],
        vn: ["vestibular nuclei", "lateral vestibular nucleus", "deiters nucleus", "vestibular nucleus", "lateral vestibular"],
        mrf: ["medullary reticular", "medullary reticular formation", "medullary reticular nuclei"],
        cb: ["cerebellar connections", "anterior lobe of the cerebellum"],
        gmn: ["gamma rigidity", "gamma motor neuron"],
        dr: ["dorsal root", "cutting the dorsal roots", "deafferentation", "dorsal roots"],
        ext: ["extensor rigidity", "decerebrate rigidity", "antigravity"],
      },
      drill: ["ctx", "rn", "cut", "prf", "vn", "mrf", "gmn", "dr"],
      sims: [
        { id: "cut", label: "✂ Decerebrate", show: ["drive"], on: ["prf", "vn", "gmn", "ext"], lost: ["ctx", "mrf"], info: "Cut between the colliculi: the **pontine reticular** and **vestibular** facilitatory nuclei act **unopposed** on γ-motor neurons (the medullary inhibitory area loses its cortical drive) → **extensor γ-rigidity**." },
        { id: "dr", label: "Cut the dorsal roots", on: ["dr"], lost: ["ext"], info: "The rigidity runs through the **γ loop** (spindle → Ia → α), so **cutting the dorsal roots abolishes it**." },
      ],
      secs: { "ph-spinal-reflexes#7": "cut" },
      rules: [
        [/dorsal root/i, "dr"],
        [/decerebrat|intercollicular|pontine reticular|vestibular nuclei/i, "cut"],
      ],
    });
  })();
})();
