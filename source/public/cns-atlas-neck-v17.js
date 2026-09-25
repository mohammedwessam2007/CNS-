/* INTELLECTUALITY v17.3 · The spinal cord against the vertebral column (extent, cauda equina, meninges, lumbar
 * puncture, nerve exits, blood supply) and the neck (triangles and their contents, strap muscles, thyroid, the
 * external carotid and subclavian branches, the neck veins). Drawn from standard anatomy (Snell / Gray level) in
 * the notes' wording (an-spinal-cord, an-*-triangle, an-muscular-triangle-thyroid, an-carotid-triangle).
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { smooth } = A;
  const { T, pf, ps } = A.kit;
  const ld = (x1, y1, x2, y2) => '<path class="ld" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '"/>';
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");

  /* ═══════════════ 1. THE CORD AGAINST THE VERTEBRAE ═══════════════ */
  (function () {
    // vertebral levels: name → [top y, bottom y]
    const V = {};
    let y = 40;
    const add = (name, h) => { V[name] = [y, y + h]; y += h + 1; };
    for (let i = 1; i <= 7; i++) add("C" + i, 8);
    for (let i = 1; i <= 12; i++) add("T" + i, 9);
    for (let i = 1; i <= 5; i++) add("L" + i, 12);
    add("S", 44);
    add("Co", 12);
    const mid = (n) => (V[n][0] + V[n][1]) / 2;
    const S2 = V.S[0] + 12, S3 = V.S[0] + 20;
    const col =
      Object.entries(V).map(([n, [a, b]]) => '<rect x="60" y="' + a + '" width="36" height="' + (b - a) + '" rx="3" fill="' + (n[0] === "C" ? "#3a4c63" : n[0] === "T" ? "#34465c" : n[0] === "L" ? "#3e5068" : "#46586f") + '" stroke="#6f8aa8" stroke-width=".6" pointer-events="none"/>' + ((n.length === 2 && ["C1", "C4", "C7", "T1", "T4", "T8", "T12", "L1", "L2", "L3", "L4", "L5"].includes(n)) || n === "S" || n === "Co" ? T(56, (a + b) / 2 + 3, n === "S" ? "sacrum" : n === "Co" ? "coccyx" : n, "sm mut", "end") : "")).join("") +
      '<path d="M100 36 L100 ' + V.S[1] + '" stroke="#2a3f58" stroke-width="1" pointer-events="none"/>';
    const conusY = V.L1[1] + 2, bornY = mid("L3");
    const cord =
      '<path class="pf" data-p="dsac" d="M104 34 L130 34 L130 ' + S2 + " C130 " + (S2 + 8) + " 104 " + (S2 + 8) + " 104 " + S2 + ' Z" style="--c:#ffd166;--r:#243448;--rs:#8a7a66"/>' +
      '<path class="pf" data-p="cist" d="M106 ' + conusY + " L128 " + conusY + " L128 " + S2 + " C128 " + (S2 + 6) + " 106 " + (S2 + 6) + " 106 " + S2 + ' Z" style="--c:#66e9ff;--r:#16324c"/>' +
      '<path class="pf" data-p="cordx" d="M112 34 L124 34 L124 ' + (conusY - 10) + " L118 " + conusY + " L112 " + (conusY - 10) + ' Z" style="--c:#b39cff;--r:#c7aebe"/>' +
      '<path class="pf" data-p="cenl" d="M111 ' + mid("C4") + " C106 " + mid("C6") + " 106 " + mid("C7") + " 111 " + mid("T1") + " L125 " + mid("T1") + " C130 " + mid("C7") + " 130 " + mid("C6") + " 125 " + mid("C4") + ' Z" style="--c:#5ef0a0;--r:#c7aebe"/>' +
      '<path class="pf" data-p="lenl" d="M111 ' + mid("T9") + " C106 " + mid("T11") + " 106 " + mid("T12") + " 112 " + (conusY - 12) + " L124 " + (conusY - 12) + " C130 " + mid("T12") + " 130 " + mid("T11") + " 125 " + mid("T9") + ' Z" style="--c:#5ef0a0;--r:#c7aebe"/>' +
      '<path class="pf" data-p="conus" d="M113 ' + (conusY - 10) + " L123 " + (conusY - 10) + " L118 " + conusY + ' Z" style="--c:#ff5d7a;--r:#b394aa"/>' +
      ps("cauda", [110, 113, 116, 120, 123, 126].map((x) => "M118 " + conusY + " C" + x + " " + (conusY + 20) + " " + x + " " + (S2 - 20) + " " + x + " " + (S2 + 2)).join(" "), "#ff9f43", "#c9b8a8", 1) +
      ps("filum", "M118 " + conusY + " L118 " + S2 + " C118 " + (S2 + 20) + " 110 " + (V.Co[1] - 6) + " 102 " + V.Co[1], "#d9ff43", "#e8e3d8", 1.2) +
      '<path d="M126 ' + bornY + ' L142 ' + bornY + '" stroke="#ff5d7a" stroke-width="1.4" stroke-dasharray="3 2" pointer-events="none"/>' +
      '<g class="pf" data-p="lp"><path d="M170 ' + mid("L3") + " L132 " + (V.L3[1] + 1) + '" stroke="#d9ff43" stroke-width="2.4" style="stroke:var(--r)"/><circle cx="170" cy="' + mid("L3") + '" r="3" style="fill:var(--r)"/></g>';
    const labels =
      T(150, 38, "foramen magnum: cord begins", "sm", "start") +
      T(150, mid("C6") + 3, "cervical enlargement (C4–T1 segments)", "sm", "start") + ld(148, mid("C6"), 130, mid("C6")) +
      T(150, mid("T11") + 3, "lumbosacral enlargement (L2–S3 segs)", "sm", "start") + ld(148, mid("T11"), 130, mid("T11")) +
      T(150, conusY + 3, "CONUS: adult lower border L1 (L1–L2 disc)", "sm", "start") + ld(148, conusY, 124, conusY) +
      T(148, bornY + 1, "newborn: L3", "sm", "start") +
      T(176, mid("L3") + 12, "LUMBAR PUNCTURE L3–L4 (or L4–L5)", "sm", "start") +
      T(150, mid("L5") + 3, "cauda equina = ROOTS of L2–Co nerves", "sm", "start") + ld(148, mid("L5"), 126, mid("L5")) +
      T(150, S2 + 3, "dura, arachnoid, cistern end at S2", "sm", "start") + ld(148, S2, 130, S2) +
      T(150, V.Co[1] + 2, "filum terminale (pia) → back of coccyx", "sm", "start") + ld(148, V.Co[1], 104, V.Co[1] - 2);
    // meninges and spaces, nerve exits, blood supply
    const men =
      '<rect x="370" y="30" width="164" height="150" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(452, 42, "MENINGES AND SPACES", "sm mut") +
      '<ellipse class="pf" data-p="epid" cx="452" cy="106" rx="72" ry="54" style="--c:#ffd166;--r:#3a3528"/>' + [[392, 80], [400, 132], [506, 82], [510, 128]].map(([x, yy]) => '<circle class="pf" data-p="vplex" cx="' + x + '" cy="' + yy + '" r="4" style="--c:#b39cff;--r:#5a4a8a"/>').join("") +
      '<ellipse class="pf" data-p="dura2" cx="452" cy="106" rx="54" ry="40" style="--c:#ff9f43;--r:#8a6a4a"/>' +
      '<ellipse class="pf" data-p="sas2" cx="452" cy="106" rx="50" ry="36" style="--c:#66e9ff;--r:#16324c"/>' +
      '<ellipse class="pf" data-p="arach" cx="452" cy="106" rx="50" ry="36" style="--c:#b39cff;--r:#0000;--rs:#b39cff" fill="none" stroke-dasharray="3 2"/>' +
      '<ellipse class="pf" data-p="pia2" cx="452" cy="106" rx="24" ry="18" style="--c:#5ef0a0;--r:#c7aebe;--rs:#5ef0a0"/>' +
      '<path class="ps" data-p="dent" d="M428 106 L402 106 M476 106 L502 106" style="--c:#d9ff43;--r:#5ef0a0;--w:2.4"/>' +
      T(452, 172, "epidural: FAT + venous plexus", "sm") + T(452, 72, "subarachnoid: CSF", "sm") + T(412, 100, "denticulate", "sm", "middle") + T(452, 110, "cord (pia)", "sm dk");
    const exit =
      '<rect x="370" y="188" width="164" height="94" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(452, 200, "WHERE EACH NERVE EXITS", "sm mut") +
      ["C6", "C7", "T1", "T2"].map((n, i) => '<rect x="392" y="' + (208 + i * 18) + '" width="30" height="12" rx="3" fill="#3a4c63"/>' + T(388, 217 + i * 18, n, "sm mut", "end")).join("") +
      '<path class="ps" data-p="exitc" d="M422 205 L444 205 M422 223 L444 223" style="--c:#66e9ff;--r:#8fb4c9;--w:2"/>' + T(448, 208, "C6, C7: ABOVE", "sm", "start") + T(448, 226, "their vertebra", "sm", "start") +
      '<path class="ps" data-p="exit8" d="M422 241 L444 241" style="--c:#ff5d7a;--r:#ff9f43;--w:2.6"/>' + T(448, 244, "C8: between C7 + T1", "sm", "start") +
      '<path class="ps" data-p="exitt" d="M422 259 L444 259" style="--c:#66e9ff;--r:#8fb4c9;--w:2"/>' + T(448, 262, "T1 down: BELOW", "sm", "start") + T(448, 274, "31 pairs: 8 C 12 T 5 L 5 S 1 Co", "sm mut", "start");
    const blood =
      cell("asa2", 370, 290, 164, 28, ["ONE anterior spinal a.", "(both vertebrals): anterior ⅔"], "#ff5d7a") +
      cell("psa2", 370, 322, 164, 28, ["TWO posterior spinal aa.:", "posterior ⅓ (dorsal columns)"], "#ff5d7a") +
      cell("adam", 370, 354, 164, 38, ["ARTERIA RADICULARIS MAGNA", "(Adamkiewicz): left, T9–L2 →", "lower cord + lumbar enlargement"], "#ff9f43");
    A.scene("levels", {
      title: "The spinal cord against the vertebrae · where it ends, the cauda equina, the meninges, lumbar puncture",
      vb: "0 0 540 400",
      svg: () => col + cord + labels + men + exit + blood,
      intro: "The cord is shorter than the vertebral column: it ends at **L1–L2**, but its sac, the CSF and the roots go on to **S2**. That gap is where a lumbar puncture is safe.",
      parts: {
        dsac: ["Dural sac", "**Dura** (and arachnoid) from the **foramen magnum** down to **S2**; below S2 the dura wraps the filum terminale."],
        cist: ["Lumbar cistern", "The enlarged subarachnoid space **below the conus**, about **L1/L2 to S2**, full of CSF, with the cauda equina and filum terminale floating in it."],
        cordx: ["Spinal cord", "About 45 cm, from the **foramen magnum** (continuing the medulla) down to the **conus**. Grey inside, white outside."],
        cenl: ["Cervical enlargement", "Segments **C4–T1**: the brachial plexus."],
        lenl: ["Lumbosacral enlargement", "Segments **L2–S3**: the lumbosacral plexus; it lies **above** the conus. Fed by the arteria radicularis magna."],
        conus: ["Conus medullaris", "The tapering lower end of the cord: adult **lower border of L1** (L1–L2 disc), range T12–L3; **newborn L3**. It is the cord's end, not an enlargement."],
        cauda: ["Cauda equina", "The **roots** of the lower lumbar, sacral and coccygeal nerves hanging below the conus in the lumbar cistern: roots, not cord segments or spinal nerves."],
        filum: ["Filum terminale", "A thread of **pia** from the conus: internum inside the sac to S2, externum (with a dural sheath) to the **back of the coccyx**."],
        lp: ["Lumbar puncture", "Needle into the **subarachnoid space (lumbar cistern)** between **L3 and L4** (or L4–L5), below the cord, inside the sac: skin → ligaments → ligamentum flavum → epidural space → dura → arachnoid → CSF. The roots slide away."],
        epid: ["Epidural (extradural) space", "Between the dura and the canal: **fat** and the **internal vertebral venous plexus** (where epidural anaesthesia goes)."],
        vplex: ["Internal vertebral venous plexus", "In the **epidural** space, not the subdural."],
        dura2: ["Spinal dura mater", "Outer tough layer: from the **foramen magnum** (dura, not pia, attaches there) to **S2**; sheaths the roots."],
        arach: ["Arachnoid mater", "Lines the dura; ends at **S2**. The subdural space between them is only potential."],
        sas2: ["Subarachnoid space", "Between arachnoid and pia, full of **CSF**; the spinal arteries run here on the cord."],
        pia2: ["Pia mater", "Stuck to the cord: forms the **denticulate ligaments** and the **filum terminale**."],
        dent: ["Denticulate ligaments", "About **21 pairs** of lateral **pia** folds that pierce the arachnoid and attach to the **dura**, holding the cord in the middle of the sac (pia, not arachnoid)."],
        exitc: ["C1–C7 exit above", "Each cervical nerve C1–C7 leaves **above** the vertebra of the same number."],
        exit8: ["C8 exits between C7 and T1", "There is no C8 vertebra, so C8 takes the gap **between C7 and T1** (not 'C7 and C8')."],
        exitt: ["From T1 down: below", "Each nerve leaves **below** its own vertebra. 31 pairs: 8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal."],
        asa2: ["Anterior spinal artery", "**One**, from both vertebral arteries, in the anterior median fissure: the **anterior 2/3** of the cord."],
        psa2: ["Posterior spinal arteries", "**Two**, from the vertebrals or PICA: the **posterior 1/3**."],
        adam: ["Arteria radicularis magna (Adamkiewicz)", "The largest radicular artery, usually **left**, T9–L2: the lower two-thirds of the cord including the **lumbar enlargement**. The upper thoracic cord (T1–T4) is the poorly reinforced watershed."],
      },
      al: {
        dsac: ["dural sac", "dura mater", "dura", "dura and arachnoid", "s2"],
        cist: ["lumbar cistern", "cistern"],
        cordx: ["spinal cord", "foramen magnum", "medulla oblongata", "45 cm"],
        cenl: ["cervical enlargement", "enlargement", "enlargements"],
        lenl: ["lumbosacral enlargement", "lumbar enlargement", "enlargement", "enlargements"],
        conus: ["conus medullaris", "conus", "lower border of l1", "l1 and l2", "l1 l2", "lower end of spinal cord", "ends", "newborn", "3rd lumbar vertebra", "l3"],
        cauda: ["cauda equina", "cauda equine", "roots of lower lumbar", "horse s tail"],
        filum: ["filum terminale", "back of coccyx", "coccyx"],
        lp: ["lumbar puncture", "l3 and l4", "l 3 and l 4", "l3 l4", "needle", "sample csf", "meningitis"],
        epid: ["epidural", "extradural", "epidural space", "fat"],
        vplex: ["vertebral venous plexus", "venous plexus"],
        dura2: ["spinal dura"],
        arach: ["arachnoid", "arachnoid mater", "subdural"],
        sas2: ["subarachnoid space", "subarachnoid", "csf"],
        pia2: ["pia mater", "pia"],
        dent: ["denticulate", "denticulate ligament", "ligamentum denticulatum"],
        exitc: ["exits above", "c1 c7"],
        exit8: ["c 8", "c8", "between c7 and t1", "c7 and c8", "between c 7 and t 1"],
        exitt: ["31 pairs", "spinal nerves", "below its own vertebra"],
        asa2: ["anterior spinal artery", "anterior 2 3", "anterior two thirds"],
        psa2: ["posterior spinal artery", "posterior spinal arteries", "posterior 1 3"],
        adam: ["radicularis magna", "arteria radicularis magna", "adamkiewicz", "radicular artery", "largest radicular"],
      },
      drill: ["conus", "cauda", "filum", "cist", "lp", "dsac", "dent", "epid", "sas2", "cenl", "lenl", "exit8", "adam"],
      sims: [
        { id: "end", label: "Where things end", on: ["conus", "dsac", "cist", "filum"], info: "Cord (conus) **L1–L2** adult, **L3** newborn · dura, arachnoid, subarachnoid space and lumbar cistern **S2** · filum terminale **back of the coccyx**." },
        { id: "lp", label: "Lumbar puncture", on: ["lp", "cist", "cauda"], info: "**L3–L4** (or L4–L5): below the cord, inside the sac; the needle enters the **subarachnoid space** (lumbar cistern) and the cauda equina roots slide away." },
        { id: "men", label: "Meninges", on: ["dura2", "arach", "sas2", "pia2", "dent", "epid"], info: "Epidural (fat, veins) → **dura** → subdural (potential) → **arachnoid** → subarachnoid (**CSF**) → **pia** (denticulate ligaments to the dura, filum terminale)." },
        { id: "blood", label: "Blood supply", on: ["asa2", "psa2", "adam"], info: "**One** anterior spinal (anterior 2/3), **two** posterior spinal (posterior 1/3), topped up by radicular arteries, the largest being the **arteria radicularis magna**." },
      ],
      secs: { "an-spinal-cord#0": "end", "an-spinal-cord#1": "end", "an-spinal-cord#2": "", "an-spinal-cord#4": "men", "an-spinal-cord#5": "men", "an-spinal-cord#6": "lp" },
      rules: [
        [/lumbar puncture|needle|sample.*csf|l3|l-3/i, "lp"],
        [/denticulate|pia|arachnoid|dura|epidural|subarachnoid|space/i, "men"],
        [/radicular|adamkiewicz|spinal arter/i, "blood"],
        [/ends|end of|conus|cauda|filum|cistern|lower border/i, "end"],
      ],
    });
  })();

  /* ═══════════════ 2. TRIANGLES OF THE NECK · STRAP MUSCLES · THYROID ═══════════════ */
  (function () {
    const tri = (id, d, c) => '<path class="pf" data-p="' + id + '" d="' + d + '" style="--c:' + c + ";--r:" + c + '22;--rs:' + c + '66"/>';
    const svg = () =>
      '<text class="ttl" x="200" y="14" text-anchor="middle">NECK, LEFT SIDE VIEW (CHIN ON THE LEFT)</text>' +
      '<path class="pf" data-p="mand" d="M34 64 C60 92 120 100 190 88 L220 60 L230 66 L196 102 C126 116 58 108 26 74 Z" style="--c:#ffd166;--r:#c9b8a8"/>' + T(92, 72, "mandible", "sm dk") +
      '<path class="pf" data-p="clav" d="M60 318 L300 300 L302 312 L62 330 Z" style="--c:#ffd166;--r:#c9b8a8"/>' + T(200, 324, "clavicle (middle ⅓ = base of posterior △)", "sm") +
      '<path class="pf" data-p="hyoid" d="M60 146 L100 142 L102 150 L62 154 Z" style="--c:#ffd166;--r:#e8e3d8"/>' + T(46, 144, "hyoid", "sm", "end") +
      tri("t_subm", "M34 112 L64 146 L34 150 Z", "#66e9ff") +
      tri("t_smd", "M36 104 C80 112 150 110 196 100 L150 150 L100 142 L64 146 Z", "#b39cff") +
      tri("t_car", "M196 100 L236 110 L178 214 L118 190 L150 150 Z", "#ff5d7a") +
      tri("t_mus", "M34 150 L64 146 L100 142 L118 190 L178 214 L150 296 L40 306 Z", "#5ef0a0") +
      tri("t_occ", "M236 110 L284 110 L346 246 L252 232 Z", "#ffd166") +
      tri("t_supc", "M252 232 L346 246 L356 294 L196 304 Z", "#ff9f43") +
      '<path class="pf" data-p="scm" d="M232 96 L252 102 L184 306 L150 308 Z" style="--c:#ff5d8f;--r:#8f3b4f"/>' + T(214, 170, "SCM", "sm dk") +
      '<path class="pf" data-p="trap" d="M284 104 L300 104 L372 290 L356 296 Z" style="--c:#ff5d8f;--r:#6d3a4a"/>' + T(344, 196, "trapezius", "sm") +
      ps("dig_a", "M64 146 L44 96", "#ff9f43", "#c46a7d", 4) + ps("dig_p", "M100 142 L150 150 L232 104", "#ff9f43", "#c46a7d", 4) + T(170, 122, "digastric (post.)", "sm") +
      ps("omo_s", "M92 150 L150 210 L178 232", "#66e9ff", "#c46a7d", 3.4) + ps("omo_i", "M188 240 L252 232 L346 246", "#66e9ff", "#c46a7d", 3.4) + T(122, 200, "omohyoid sup.", "sm", "end") + T(292, 228, "omohyoid inf.", "sm") +
      '<path class="pf" data-p="thy" d="M86 212 C74 222 72 246 86 256 L100 256 C110 246 110 222 100 212 Z" style="--c:#ff9f43;--r:#b8646f"/>' + '<rect class="pf" data-p="isth" x="72" y="236" width="18" height="12" rx="4" style="--c:#ff9f43;--r:#b8646f"/>' + T(60, 262, "thyroid", "sm") + T(60, 272, "(isthmus: rings 2–4)", "sm mut") +
      '<path class="pf" data-p="sheath" d="M150 160 C160 200 162 250 160 300 L172 300 C174 250 172 200 162 160 Z" style="--c:#5ef0a0;--r:#3a6f58"/>' + T(118, 290, "carotid sheath: CCA,", "sm") + T(118, 300, "IJV, vagus", "sm") +
      ps("cn11", "M244 132 C270 170 300 200 330 222", "#ffd166", "#c9a86a", 2.4) + T(304, 170, "accessory (XI)", "sm", "start") +
      ps("ejv3", "M212 110 C220 170 214 240 206 292", "#66e9ff", "#4a6f9a", 2.2) + T(228, 290, "EJV", "sm", "start") +
      ps("bp", "M250 250 C280 262 310 276 340 296 M254 262 C284 272 314 284 344 300", "#b39cff", "#8f7fc1", 2.4) + T(280, 262, "brachial plexus", "sm", "start") +
      ps("sub3", "M240 292 C270 294 300 296 330 304", "#ff5d7a", "#c44b5f", 3) +
      '<circle class="pf" data-p="cp" cx="208" cy="178" r="5" style="--c:#d9ff43;--r:#d9ff43"/>' + ps("cp", "M208 178 L240 150 M208 178 L236 132 M208 178 L170 186 M208 178 L218 250", "#d9ff43", "#a8a060", 1.2) +
      T(20, 128, "SUBMENTAL", "sm", "start") + T(118, 108, "SUBMANDIBULAR", "sm") + T(180, 168, "CAROTID", "sm") + T(96, 180, "MUSCULAR", "sm") + T(270, 150, "OCCIPITAL", "sm") + T(300, 272, "SUPRA-", "sm") + T(300, 282, "CLAVICULAR", "sm");
    const strap =
      '<rect x="382" y="24" width="112" height="190" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(438, 36, "STRAP MUSCLES", "sm mut") +
      cell("sh", 390, 44, 96, 26, ["sternohyoid", "(ansa)"], "#66e9ff") + cell("sth", 390, 74, 96, 26, ["sternothyroid", "(ansa)"], "#66e9ff") +
      cell("thh", 390, 104, 96, 26, ["thyrohyoid", "(C1 via XII)"], "#66e9ff") + cell("omo", 390, 134, 96, 26, ["omohyoid", "(ansa)"], "#66e9ff") +
      T(438, 176, "all DEPRESS the hyoid;", "sm mut") + T(438, 186, "ansa cervicalis C1–C3,", "sm mut") + T(438, 196, "not the hypoglossal", "sm mut");
    const thy =
      cell("thyc", 382, 222, 112, 104, ["THYROID: 2 lobes +", "isthmus (rings 2–4);", "in PRETRACHEAL fascia →", "moves with swallowing.", "Sup. thyroid a. (ECA,", "with ext. laryngeal n.),", "inf. thyroid a. (thyro-", "cervical, with RLN);", "inf. thyroid veins →", "brachiocephalic"], "#ff9f43");
    A.scene("necktri", {
      title: "Triangles of the neck · boundaries, contents, strap muscles and the thyroid",
      vb: "0 0 500 336",
      svg: () => svg() + strap + thy,
      intro: "The **sternomastoid** splits the neck into the anterior and posterior triangles; the **digastric** and **omohyoid** subdivide them. Tap a triangle or a structure.",
      parts: {
        mand: ["Mandible", "Upper boundary of the submandibular (digastric) triangle."],
        clav: ["Clavicle", "Its **middle third** is the base of the posterior triangle (not the medial third)."],
        hyoid: ["Hyoid bone", "Supra- and infrahyoid muscles attach to it."],
        t_subm: ["Submental triangle", "Median: between the two anterior bellies of digastric and the hyoid."],
        t_smd: ["Submandibular (digastric) triangle", "Mandible + the two bellies of digastric: the submandibular gland and nodes."],
        t_car: ["Carotid triangle", "**SCM** (upper anterior border) behind, **superior belly of omohyoid** below, **posterior belly of digastric** above. Contents: the carotid bifurcation, ICA, ECA with **some** branches, IJV, vagus, XII, XI, ansa cervicalis."],
        t_mus: ["Muscular triangle", "Midline, **superior belly of omohyoid**, and SCM: the strap muscles, with the thyroid, trachea and oesophagus deep to them."],
        t_occ: ["Occipital triangle", "Upper part of the posterior triangle, above the **inferior belly of omohyoid**: the spinal accessory nerve crosses it."],
        t_supc: ["Supraclavicular (subclavian) triangle", "Lower part, below the inferior belly of omohyoid: brachial plexus trunks, 3rd part of the subclavian artery, the end of the EJV."],
        scm: ["Sternocleidomastoid (sternomastoid)", "Divides the neck into the anterior and posterior triangles; its posterior border bounds the posterior triangle in front."],
        trap: ["Trapezius", "Its anterior border is the back of the posterior triangle."],
        dig_a: ["Anterior belly of digastric", "1st arch (V3, nerve to mylohyoid)."],
        dig_p: ["Posterior belly of digastric", "2nd arch (VII); the upper boundary of the carotid triangle. The digastric divides the **anterior** triangle."],
        omo_s: ["Superior belly of omohyoid", "**Lies between the carotid and muscular triangles.**"],
        omo_i: ["Inferior belly of omohyoid", "Arises from the **scapula**; **divides the posterior triangle** into occipital and supraclavicular parts."],
        thy: ["Thyroid gland (lobes)", "On the sides of the larynx and trachea, deep to the strap muscles."],
        isth: ["Thyroid isthmus", "Over the **2nd–4th tracheal rings**."],
        sheath: ["Carotid sheath", "Common/internal carotid artery, **internal jugular vein** and **vagus**, under the SCM. The IJV is **not** a content of the posterior triangle."],
        cn11: ["Spinal accessory nerve (XI)", "Crosses the posterior (occipital) triangle obliquely on levator scapulae, where it is easily injured."],
        ejv3: ["External jugular vein", "Runs across the SCM, pierces the investing fascia just above the clavicle, ends in the **subclavian vein**."],
        bp: ["Brachial plexus trunks", "In the supraclavicular triangle (the dorsal scapular nerve is brachial plexus, not cervical)."],
        sub3: ["3rd part of the subclavian artery", "In the supraclavicular triangle."],
        cp: ["Cervical plexus cutaneous branches", "Emerge at the middle of the SCM's posterior border: lesser occipital, great auricular, transverse cervical, supraclavicular."],
        sh: ["Sternohyoid", "Strap muscle; depresses the hyoid; ansa cervicalis."],
        sth: ["Sternothyroid", "Strap muscle; ansa cervicalis."],
        thh: ["Thyrohyoid", "Strap muscle supplied by **C1 fibres running with the hypoglossal** nerve (the exception)."],
        omo: ["Omohyoid", "Strap muscle; ansa cervicalis; two bellies joined by a tendon slung to the clavicle."],
        thyc: ["Thyroid gland: key facts", "Two lobes and an isthmus over **rings 2–4**; enclosed in the **pretracheal fascia**, so it **moves up with swallowing**. Arteries: **superior thyroid** (1st ECA branch, with the external laryngeal nerve), **inferior thyroid** (thyrocervical trunk, related to the recurrent laryngeal nerve). Veins: superior and middle → IJV; **inferior thyroid → brachiocephalic** (bleed in tracheostomy)."],
      },
      al: {
        mand: ["mandible"],
        clav: ["clavicle", "middle third of the clavicle"],
        hyoid: ["hyoid bone", "hyoid"],
        t_subm: ["submental triangle"],
        t_smd: ["submandibular triangle", "digastric triangle"],
        t_car: ["carotid triangle"],
        t_mus: ["muscular triangle"],
        t_occ: ["occipital triangle", "posterior triangle"],
        t_supc: ["supraclavicular triangle", "subclavian triangle", "posterior triangle"],
        scm: ["sternocleidomastoid", "sternomastoid", "anterior border of sternocleidomastoid"],
        trap: ["trapezius"],
        dig_a: ["anterior belly of digastric"],
        dig_p: ["posterior belly of digastric", "digastric"],
        omo_s: ["superior belly of omohyoid"],
        omo_i: ["inferior belly of omohyoid", "scapula"],
        thy: ["thyroid gland", "lobes", "thyroid"],
        isth: ["isthmus", "tracheal rings", "3rd to 5th tracheal rings"],
        sheath: ["carotid sheath", "common carotid", "internal jugular vein", "vagus"],
        cn11: ["spinal accessory", "accessory nerve"],
        ejv3: ["external jugular vein"],
        bp: ["brachial plexus", "dorsal scapular"],
        sub3: ["third part of the subclavian", "3rd part of the subclavian"],
        cp: ["cervical plexus", "great auricular", "lesser occipital", "transverse cervical", "supraclavicular nerve"],
        sh: ["sternohyoid"],
        sth: ["sternothyroid"],
        thh: ["thyrohyoid"],
        omo: ["omohyoid", "ansa cervicalis"],
        thyc: ["pretracheal fascia", "moves up and down with swallowing", "swallowing", "investing layer", "three pairs of veins", "inferior thyroid vein"],
      },
      drill: ["t_subm", "t_smd", "t_car", "t_mus", "t_occ", "t_supc", "scm", "omo_s", "omo_i", "dig_p", "sheath", "cn11", "isth"],
      sims: [
        { id: "ant", label: "Anterior triangle", on: ["t_subm", "t_smd", "t_car", "t_mus", "dig_p", "omo_s"], info: "Anterior triangle (midline, mandible, SCM) = **submental**, **submandibular**, **carotid**, **muscular**; the digastric and superior omohyoid divide it." },
        { id: "post", label: "Posterior triangle", on: ["t_occ", "t_supc", "omo_i", "cn11", "bp", "sub3", "ejv3", "cp"], info: "Posterior triangle (SCM, trapezius, middle third of clavicle) is split by the **inferior belly of omohyoid**: accessory nerve, cervical plexus branches, brachial plexus trunks, subclavian artery, EJV." },
        { id: "thy", label: "Thyroid", on: ["thy", "isth", "thyc", "sh", "sth"], info: "Isthmus on rings **2–4**, in the **pretracheal fascia** (moves with swallowing); superior thyroid a. from the ECA, inferior from the thyrocervical trunk." },
      ],
      secs: { "an-carotid-triangle#0": "ant", "an-muscular-triangle-thyroid#0": "ant", "an-muscular-triangle-thyroid#1": "thy", "an-posterior-triangle#0": "post", "an-posterior-triangle#1": "post", "an-sternomastoid#0": "" },
      rules: [
        [/thyroid gland|isthmus|thyroid is/i, "thy"],
        [/posterior triangle|accessory|occipital triangle|supraclavicular/i, "post"],
        [/carotid triangle|muscular triangle|omohyoid|digastric|strap|infrahyoid/i, "ant"],
      ],
    });
  })();

  /* ═══════════════ 3. EXTERNAL CAROTID AND SUBCLAVIAN BRANCHES · NECK VEINS ═══════════════ */
  (function () {
    const br = (id, d, lx, ly, name, anchor) => ps(id, d, "#ff5d7a", "#c44b5f", 2.4) + T(lx, ly, name, "sm", anchor || "start");
    const svg = () =>
      '<text class="ttl" x="150" y="12" text-anchor="middle">EXTERNAL CAROTID: 8 BRANCHES</text>' +
      ps("cca", "M150 330 L150 214", "#ff5d7a", "#c44b5f", 6) + T(158, 320, "common carotid", "sm", "start") +
      ps("ica", "M150 214 C162 180 170 120 172 40", "#ffd166", "#a8844e", 5) + T(178, 50, "internal carotid: NO neck branches", "sm", "start") +
      ps("eca", "M150 214 C138 180 132 120 126 40", "#ff5d7a", "#c44b5f", 5) + T(158, 262, "bifurcation: upper border", "sm", "start") + T(158, 272, "of thyroid cartilage", "sm", "start") +
      br("a_st", "M146 204 C124 212 100 222 80 240", 20, 250, "1 superior thyroid (+ ext. laryngeal n.)") +
      br("a_asph", "M146 198 C156 190 160 176 160 150", 164, 158, "2 ascending pharyngeal (medial)") +
      br("a_ling", "M142 186 C120 186 96 180 70 170", 12, 166, "3 lingual (3 parts by hyoglossus)") +
      br("a_fac", "M140 170 C120 160 96 150 70 132", 12, 128, "4 facial (labial branches)") +
      br("a_occ", "M140 160 C160 150 186 140 210 136", 214, 132, "5 occipital") +
      br("a_pa", "M134 118 C160 112 186 106 210 104", 214, 102, "6 posterior auricular") +
      br("a_max", "M128 70 C104 70 80 66 56 60", 12, 56, "7 maxillary (→ middle meningeal,") + T(12, 66, "inferior alveolar …)", "sm", "start") +
      br("a_stemp", "M126 40 L126 20", 132, 32, "8 superficial temporal") +
      '<path d="M44 60 C40 50 44 40 50 36" stroke="#ff5d7a" stroke-width="1.6" fill="none" pointer-events="none"/>' + '<path class="ps" data-p="a_mm" d="M50 36 L56 22" style="--c:#ff5d7a;--r:#c44b5f;--w:1.6"/>' + T(20, 32, "middle meningeal", "sm", "start") +
      '<rect class="pf" data-p="hyog" x="70" y="178" width="30" height="12" rx="3" style="--c:#66e9ff;--r:#3a4c63"/>' + T(66, 200, "hyoglossus", "sm mut", "start");
    const sub =
      '<text class="ttl" x="378" y="14" text-anchor="middle">SUBCLAVIAN · NECK VEINS</text>' +
      ps("sclav", "M280 330 C330 310 420 310 478 320", "#ff5d7a", "#c44b5f", 5) + T(430, 340, "subclavian a.", "sm") +
      ps("tct", "M360 314 L360 280", "#ff5d7a", "#c44b5f", 3) + T(354, 276, "thyrocervical trunk", "sm", "end") +
      ps("a_it", "M360 282 C340 270 320 260 300 250", "#ff5d7a", "#c44b5f", 2.4) + T(296, 244, "inferior thyroid a. (with RLN)", "sm", "end") +
      ps("a_ithor", "M330 318 L326 346", "#ff5d7a", "#c44b5f", 2.4) + T(320, 356, "internal thoracic (not ECA)", "sm", "end") +
      ps("ijv", "M420 40 L420 300", "#66e9ff", "#4a6f9a", 6) + T(428, 50, "internal jugular v.", "sm", "start") +
      ps("v_fac", "M420 110 L384 100", "#66e9ff", "#4a6f9a", 2.4) + T(380, 96, "facial v.", "sm", "end") +
      ps("v_ling", "M420 128 L384 124", "#66e9ff", "#4a6f9a", 2.4) + T(380, 124, "lingual v.", "sm", "end") +
      ps("v_st", "M420 150 L384 152", "#66e9ff", "#4a6f9a", 2.4) + T(380, 154, "sup. thyroid v.", "sm", "end") +
      ps("v_mt", "M420 176 L386 182", "#66e9ff", "#4a6f9a", 2.4) + T(382, 184, "middle thyroid v.", "sm", "end") +
      ps("v_it", "M330 212 C334 250 346 280 372 300", "#b39cff", "#6e5a9a", 2.4) + T(336, 204, "inf. thyroid vv. →", "sm", "start") + T(336, 214, "left brachiocephalic", "sm", "start") +
      ps("ejv2", "M466 60 C470 140 468 230 460 312", "#66e9ff", "#4a6f9a", 3) + T(474, 80, "EJV", "sm", "end") + T(474, 90, "→ subclavian v.", "sm", "end") +
      '<rect class="pf" data-p="air" x="444" y="262" width="36" height="14" rx="4" style="--c:#ff5d7a;--r:#5c1224"/>' + T(462, 290, "cut where it pierces", "sm") + T(462, 300, "fascia → AIR embolism", "sm");
    A.scene("eca", {
      title: "External carotid and subclavian branches · and the neck veins",
      vb: "0 0 490 362",
      svg: () => svg() + sub,
      intro: "Left: the 8 external carotid branches in order. Right: the subclavian branches that feed the neck, and which veins drain where.",
      parts: {
        cca: ["Common carotid artery", "Divides at the upper border of the thyroid cartilage."],
        ica: ["Internal carotid artery", "Gives **no branches in the neck**."],
        eca: ["External carotid artery", "From the upper border of the thyroid cartilage up into the parotid; ends behind the neck of the mandible as the **maxillary** and **superficial temporal** arteries."],
        a_st: ["Superior thyroid artery", "The **1st** branch, anterior; runs with the **external laryngeal nerve** to the upper pole of the thyroid."],
        a_asph: ["Ascending pharyngeal artery", "Medial, near the origin."],
        a_ling: ["Lingual artery", "Opposite the tip of the greater horn of the hyoid; **divided into three parts by the hyoglossus**; the hypoglossal crosses its first part. It does **not** run with the lingual nerve (the nerve is superficial to hyoglossus, the artery deep)."],
        a_fac: ["Facial artery", "Anterior; its labial branches (superior and inferior labial) supply the lips and Little's area."],
        a_occ: ["Occipital artery", "Posterior."],
        a_pa: ["Posterior auricular artery", "Posterior."],
        a_max: ["Maxillary artery", "Terminal branch: gives the **middle meningeal**, inferior alveolar, sphenopalatine and others."],
        a_stemp: ["Superficial temporal artery", "Terminal branch, in front of the ear."],
        a_mm: ["Middle meningeal artery", "A branch of the **maxillary**, not a direct ECA branch."],
        hyog: ["Hyoglossus", "The landmark that splits the lingual artery into three parts."],
        sclav: ["Subclavian artery", "Gives the vertebral, thyrocervical trunk, internal thoracic and costocervical trunk."],
        tct: ["Thyrocervical trunk", "Gives the inferior thyroid, transverse cervical and suprascapular arteries."],
        a_it: ["Inferior thyroid artery", "From the **thyrocervical trunk** (subclavian), closely related to the **recurrent laryngeal nerve**: not an ECA branch."],
        a_ithor: ["Internal thoracic artery", "From the subclavian: not an ECA branch."],
        ijv: ["Internal jugular vein", "In the carotid sheath; receives the facial, lingual, superior and middle thyroid veins."],
        v_fac: ["Facial vein", "→ internal jugular vein."],
        v_ling: ["Lingual vein", "→ internal jugular vein."],
        v_st: ["Superior thyroid vein", "→ internal jugular vein."],
        v_mt: ["Middle thyroid vein", "→ internal jugular vein."],
        v_it: ["Inferior thyroid veins", "From the lower border of the isthmus, **in front of the trachea**, to the **left brachiocephalic** vein: they bleed in a midline tracheostomy."],
        ejv2: ["External jugular vein", "Posterior auricular + posterior division of the retromandibular vein; across the SCM; ends in the **subclavian vein**."],
        air: ["Air embolism risk", "The EJV is **adherent to the deep fascia where it pierces it** above the clavicle: cut there, it cannot collapse and sucks in air."],
      },
      al: {
        cca: ["common carotid", "common carotid artery"],
        ica: ["internal carotid", "internal carotid artery"],
        eca: ["external carotid", "external carotid artery", "branches of the external carotid"],
        a_st: ["superior thyroid", "superior thyroid artery"],
        a_asph: ["ascending pharyngeal", "ascending pharyngeal artery"],
        a_ling: ["lingual artery", "lingual"],
        a_fac: ["facial artery", "inferior labial", "superior labial"],
        a_occ: ["occipital artery", "occipital"],
        a_pa: ["posterior auricular", "posterior auricular artery"],
        a_max: ["maxillary artery", "inferior alveolar artery", "inferior alveolar"],
        a_stemp: ["superficial temporal", "superficial temporal artery"],
        a_mm: ["middle meningeal", "middle meningeal artery"],
        hyog: ["hyoglossus"],
        sclav: ["subclavian artery", "subclavian"],
        tct: ["thyrocervical trunk", "thyrocervical"],
        a_it: ["inferior thyroid artery", "inferior thyroid"],
        a_ithor: ["internal thoracic", "internal thoracic artery"],
        ijv: ["internal jugular vein", "internal jugular"],
        v_fac: ["facial vein"],
        v_ling: ["lingual vein"],
        v_st: ["superior thyroid vein"],
        v_mt: ["middle thyroid vein"],
        v_it: ["inferior thyroid vein", "inferior thyroid veins", "brachiocephalic", "tracheostomy"],
        ejv2: ["external jugular vein", "external jugular", "subclavian vein", "drains into the subclavian"],
        air: ["air embolism"],
      },
      drill: ["a_st", "a_asph", "a_ling", "a_fac", "a_occ", "a_pa", "a_max", "a_stemp", "a_it", "v_it", "ejv2"],
      sims: [
        { id: "eca", label: "ECA branches", on: ["a_st", "a_asph", "a_ling", "a_fac", "a_occ", "a_pa", "a_max", "a_stemp"], info: "Superior thyroid · ascending pharyngeal · lingual · facial · occipital · posterior auricular · **maxillary** and **superficial temporal** (terminal). The inferior thyroid and internal thoracic are **subclavian** branches." },
        { id: "veins", label: "Neck veins", on: ["ijv", "v_fac", "v_ling", "v_st", "v_mt", "v_it", "ejv2"], info: "Facial, lingual, superior and middle thyroid → **IJV**; **inferior thyroid → brachiocephalic**; **EJV → subclavian**." },
      ],
      secs: { "an-carotid-triangle#1": "", "an-carotid-triangle#2": "eca", "an-carotid-triangle#4": "veins", "an-posterior-triangle#2": "veins" },
      rules: [
        [/vein|jugular|tracheostomy|embolism/i, "veins"],
        [/branch|artery|arteries/i, "eca"],
      ],
    });
  })();
})();
