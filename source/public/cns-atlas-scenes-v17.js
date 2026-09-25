/* INTELLECTUALITY v17 · CNS atlas scenes. Each scene is drawn from standard anatomy and uses the notes'
 * own wording (learn-notes-*-v15.js). Conventions: sections are seen from above, posterior up, so the
 * patient's RIGHT is on the viewer's LEFT (labelled on every diagram). Part ids ending .R / .L are the
 * patient's right / left. Colours: blue = dorsal column (touch, vibration, position), orange = pain and
 * temperature, yellow = crude touch, pink = voluntary motor (pyramidal), green = cerebellar, purple =
 * extrapyramidal.
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { frame, smooth, chaikin, poly, E, md } = A;
  const { C, rest, T, pf, ps, fl, box, leg, mirror, bodyBox } = A.kit;

  /* ═══════════════ 1. SPINAL CORD: tracts, pathways, lesions, blood supply ═══════════════ */
  (function () {
    const cx = 240,
      cy = 196,
      F = frame(cx, cy, 176, 126);
    const bl = (pts) => smooth(pts, true),
      cen = (pts) => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length],
      mx = (pts) => pts.map(([x, y]) => [2 * cx - x, y]);
    // grey matter, patient's left half (viewer's right), drawn as a cervical section
    const GH = [[240, 188], [250, 186], [258, 170], [266, 150], [276, 128], [288, 106], [297, 90], [302, 84], [310, 85], [313, 93], [305, 114], [295, 138], [287, 160], [288, 176], [300, 182], [310, 188], [304, 198], [308, 206], [318, 222], [322, 242], [316, 258], [302, 266], [286, 264], [270, 254], [258, 234], [250, 216], [244, 206], [240, 205]];
    const grey = bl(GH.concat(mx(GH.slice(1, -1)).reverse()));
    const outline = smooth(Array.from({ length: 72 }, (_, i) => F.at(i * 5, 1)), true);
    // [id, kind, points, label]
    const TR = [
      ["gr", "dc", [[242, 73], [255, 72], [261, 100], [259, 140], [252, 170], [244, 180], [242, 150]], "Gr"],
      ["cu", "dc", [[258, 73], [283, 77], [293, 88], [286, 106], [276, 128], [266, 152], [256, 172], [261, 140], [263, 100]], "Cu"],
      ["lis", "pain", [[296, 80], [305, 78.6], [314, 80], [318, 86], [312, 87], [303, 83]], ""],
      ["dsc", "cb", [[320, 85], [345, 94], [370, 110], [392, 133], [407, 158], [414, 182], [404, 182], [398, 162], [384, 140], [364, 120], [340, 106], [316, 95]], "DSC"],
      ["vsc", "cb", [[415, 194], [413, 214], [405, 238], [390, 262], [372, 280], [362, 272], [380, 254], [394, 232], [402, 212], [404, 194]], "VSC"],
      ["lcs", "mot", [[318, 108], [346, 117], [372, 137], [390, 160], [392, 178], [372, 186], [340, 184], [318, 172], [306, 152], [302, 128]], "LCS"],
      ["rbs", "ex", [[330, 190], [360, 190], [378, 196], [370, 210], [344, 210], [326, 202]], "Rub"],
      ["rts", "ex", [[318, 206], [332, 206], [334, 219], [325, 226], [316, 216]], "Ret"],
      ["lst", "pain", [[338, 216], [368, 214], [384, 222], [380, 242], [366, 256], [348, 262], [338, 250], [336, 230]], "LST"],
      ["stec", "pain", [[330, 270], [352, 266], [360, 276], [350, 286], [336, 284], [328, 278]], "STec"],
      ["os", "ex", [[322, 294], [336, 288], [337, 297], [326, 305]], ""],
      ["ast", "crude", [[292, 272], [302, 270], [306, 290], [302, 310], [293, 313], [291, 292]], ""],
      ["ves", "ex", [[277, 270], [287, 270], [290, 290], [287, 313], [279, 316], [277, 292]], ""],
      ["tes", "ex", [[263, 258], [271, 258], [275, 282], [273, 312], [264, 317], [262, 290]], ""],
      ["acs", "mot", [[244, 254], [254, 250], [259, 270], [259, 300], [253, 318], [244, 320]], ""],
      ["mlf", "ex", [[244, 212], [250, 213], [255, 230], [253, 244], [244, 246]], ""],
    ];
    const tracts = TR.map(([id, k, pts]) => pf(id, bl(pts), C[k], rest[k])).join("");
    const horns =
      pf("ph", bl([[252, 186], [258, 170], [266, 150], [276, 128], [288, 106], [297, 90], [302, 84], [310, 85], [313, 93], [305, 114], [295, 138], [287, 160], [284, 180], [268, 186]]), "#ffd6f0", "#0000", ' data-h="1"') +
      pf("lh", bl([[286, 178], [300, 182], [310, 188], [304, 198], [292, 196], [284, 188]]), "#ffd6f0", "#0000", ' data-h="1"') +
      pf("ah", bl([[262, 206], [304, 198], [308, 206], [318, 222], [322, 242], [316, 258], [302, 266], [286, 264], [270, 254], [258, 234], [250, 216], [252, 208]]), "#ffd6f0", "#0000", ' data-h="1"') +
      pf("sg", bl([[297, 90], [302, 84.5], [310, 85.5], [313, 93], [309, 101], [299, 99]]), "#fff1b8", "#eadbc6") +
      pf("clarke", bl([[253, 175], [262, 174], [263, 183], [254, 184]]), C.cb, "#b597ad") +
      // α motor neurons: medial (axial) and lateral (limb) groups
      [[266, 240], [276, 248], [300, 250], [308, 238], [312, 226], [292, 256]].map(([x, y]) => '<path d="M' + x + " " + (y - 3.4) + " l3 2.2 -1 3.6 -4 0 -1 -3.6z" + '" fill="#6d4a63" opacity=".75" pointer-events="none"/>').join("");
    // roots
    const drg = [352, 40],
      dIn = [[301, 79], [308, 80.5], [315, 83]],
      dMid = [334, 58],
      vIn = [[300, 266], [307, 264], [313, 260]],
      vOut = [[303, 313], [310, 311.6], [317, 309]],
      vEnd = [384, 336];
    const roots =
      ps("dr", dIn.map((p) => "M" + p[0] + " " + p[1] + " Q" + dMid[0] + " " + dMid[1] + " " + drg[0] + " " + drg[1]).join(" "), C.dc, "#a9bdd3", 2.2) +
      '<ellipse class="pf" data-p="drg" cx="' + drg[0] + '" cy="' + drg[1] + '" rx="14" ry="9.5" transform="rotate(-40 ' + drg[0] + " " + drg[1] + ')" style="--c:#66e9ff;--r:#e8dcc8"/>' +
      ps("vr", vIn.map((p, i) => "M" + p[0] + " " + p[1] + " L" + vOut[i][0] + " " + vOut[i][1] + " Q" + (vEnd[0] - 16) + " " + (vEnd[1] - 14) + " " + vEnd[0] + " " + vEnd[1]).join(" "), C.mot, "#a9bdd3", 1.8);
    const sfx = (h, t) => h.replace(/data-p="([a-z]+)"/g, 'data-p="$1.' + t + '"');
    const L = sfx(tracts + horns + roots, "L"),
      R = mirror(sfx(tracts + horns + roots, "R"), cx);
    const fis = "M" + (cx - 2.6) + " 322 L" + (cx - 1.3) + " 264 Q" + cx + " 259 " + (cx + 1.3) + " 264 L" + (cx + 2.6) + " 322Z";
    const awc = "M" + (cx - 22) + " 210 Q" + cx + " 205 " + (cx + 22) + " 210 L" + (cx + 22) + " 218 Q" + cx + " 213 " + (cx - 22) + " 218Z";
    // territories and lesion overlays
    const arc = (a, b, r) => {
      const n = Math.ceil(Math.abs(b - a) / 3);
      return Array.from({ length: n + 1 }, (_, i) => F.at(a + ((b - a) * i) / n, r));
    };
    const asaT = poly(chaikin(arc(-36, 216, 1.005).concat([[178, 110], [216, 176], [240, 186], [264, 176], [302, 110]]), 2));
    const psaT = poly(chaikin(arc(216, 324, 1.005).concat([[302, 110], [264, 176], [240, 186], [216, 176], [178, 110]]), 2));
    const cutR = poly(arc(90, 270, 1.03).concat([[cx, cy - 130], [cx, cy + 130]]));
    const lstR = mx([cen(TR[8][2])])[0],
      sgL = [305, 92],
      cuL = cen(TR[1][2]),
      lcsL = cen(TR[5][2]),
      ahL = [300, 238];
    const painPath = "M" + drg[0] + " " + drg[1] + " Q" + dMid[0] + " " + dMid[1] + " " + dIn[1][0] + " " + dIn[1][1] + " L" + sgL[0] + " " + sgL[1] + " Q" + 300 + " " + 170 + " " + (cx + 16) + " 213 L" + (cx - 16) + " 214 Q" + 170 + " " + 222 + " " + lstR[0] + " " + lstR[1];
    const dcPath = "M" + drg[0] + " " + drg[1] + " Q" + dMid[0] + " " + dMid[1] + " " + dIn[0][0] + " " + dIn[0][1] + " Q" + 282 + " 84 " + cuL[0] + " " + (cuL[1] - 10) + " L" + cuL[0] + " " + (cuL[1] + 30);
    const motPath = "M" + lcsL[0] + " " + lcsL[1] + " Q" + 330 + " " + 210 + " " + ahL[0] + " " + ahL[1] + " L" + vIn[1][0] + " " + vIn[1][1] + " L" + vOut[1][0] + " " + vOut[1][1] + " Q" + (vEnd[0] - 16) + " " + (vEnd[1] - 14) + " " + vEnd[0] + " " + vEnd[1];
    const psaL = [298, 70],
      psaR = [2 * cx - 298, 70],
      asa = [cx, 330];
    const rr = (n) => Math.round(n * 10) / 10;
    const labels = TR.filter((t) => t[3]).map(([, , pts, s]) => {
      const c = cen(pts);
      return T(rr(c[0]), rr(c[1] + 3), s, "dk sm");
    }).join("");
    const svg = () =>
      '<text class="ttl" x="' + cx + '" y="14" text-anchor="middle">POSTERIOR</text><text class="ttl" x="' + cx + '" y="376" text-anchor="middle">ANTERIOR</text>' +
      '<text class="ttl" x="12" y="200">RIGHT</text><text class="ttl" x="468" y="200" text-anchor="end">LEFT</text>' +
      '<path d="' + outline + '" fill="url(#ixTissue)" stroke="#c9d6e6" stroke-width="1.4"/>' +
      '<path d="' + grey + '" fill="url(#ixGrey)" stroke="#a88aa0" stroke-width=".8"/>' +
      L + R +
      pf("awc", awc, C.pain, "#d9c6d3") +
      '<path class="pf" data-p="amf" d="' + fis + '" style="--c:#66e9ff;--r:#0a1726;--rs:#0a1726"/>' +
      '<path class="ps" data-p="pms" d="M' + cx + " 71 L" + cx + ' 186" style="--c:#66e9ff;--r:#b8a8b6;--w:1.6"/>' +
      '<circle class="pf" data-p="cc" cx="' + cx + '" cy="' + cy + '" r="3.6" style="--c:#8fd3ff;--r:#3b556f"/>' +
      labels +
      '<path class="ld" d="M318 92 L336 72"/>' + T(338, 70, "SG", "sm", "start") +
      '<path class="ld" d="M318 84 L350 84"/>' + T(352, 87, "Lissauer", "sm", "start") +
      '<path class="ld" d="M334 296 L372 318"/>' + T(374, 321, "Olivospinal", "sm", "start") +
      [["ACS", 251, 312, 246], ["TeS", 268, 314, 272], ["VeS", 283, 314, 298], ["AST", 298, 311, 324]].map(([t, x, y, lx]) => '<path class="ld" d="M' + x + " " + y + " L" + lx + ' 340"/>' + T(lx, 350, t, "sm")).join("") +
      T(drg[0] + 17, drg[1] - 6, "DRG", "sm", "start") + T(vEnd[0] + 6, vEnd[1] + 3, "ventral root", "sm", "start") +
      '<path class="ov" data-x="asa-t" d="' + asaT + '" fill="#ff5d7a2e" stroke="#ff5d7a" stroke-width="1.5" stroke-dasharray="5 3"/>' +
      '<path class="ov" data-x="psa-t" d="' + psaT + '" fill="#4cc9f02a" stroke="#4cc9f0" stroke-width="1.5" stroke-dasharray="5 3"/>' +
      '<g data-x="art"><circle class="pf" data-p="asa" cx="' + asa[0] + '" cy="' + asa[1] + '" r="6" style="--c:#ff5d7a;--r:#ff5d7a"/><circle class="pf" data-p="psa" cx="' + psaL[0] + '" cy="' + psaL[1] + '" r="4.6" style="--c:#4cc9f0;--r:#ff8fa3"/><circle class="pf" data-p="psa" cx="' + psaR[0] + '" cy="' + psaR[1] + '" r="4.6" style="--c:#4cc9f0;--r:#ff8fa3"/>' +
      T(asa[0] + 10, asa[1] + 14, "anterior spinal a.", "sm", "start") + T(psaR[0] - 8, psaR[1] - 8, "posterior spinal a.", "sm", "end") + "</g>" +
      '<path class="ov" data-x="cut-R" d="' + cutR + '" fill="url(#ixHatch)" opacity=".55" stroke="#ff5d7a" stroke-width="2"/>' +
      '<g class="ov" data-x="cut-R">' + T(cx - 100, 58, "✂ RIGHT HALF CUT", "big") + "</g>" +
      '<ellipse class="ov" data-x="syr" cx="' + cx + '" cy="' + (cy + 8) + '" rx="30" ry="22" fill="#05090fdd" stroke="#ff5d7a" stroke-width="2"/>' +
      '<g class="ov" data-x="syr">' + T(cx, cy + 12, "syrinx", "sm") + "</g>" +
      fl("fl-pain", painPath, C.pain) + fl("fl-dc", dcPath, C.dc) + fl("fl-motor", motPath, C.mot) +
      '<g class="ov" data-x="fl-pain">' + T(rr(lstR[0]), rr(lstR[1]) + 30, "↑ to thalamus", "sm") + T(cx, 236, "crosses here", "sm") + "</g>" +
      '<g class="ov" data-x="fl-dc">' + T(rr(cuL[0]) + 60, rr(cuL[1]) + 44, "↑ same side to medulla", "sm") + "</g>" +
      '<g class="ov" data-x="fl-motor">' + T(rr(lcsL[0]), rr(lcsL[1]) + 17, "crossed in the medulla ↓", "sm") + "</g>";
    A.scene("cord", {
      title: "Spinal cord · every tract, every lesion",
      vb: "0 0 480 382",
      svg,
      intro: "Tap any tract or horn. Then try a lesion: watch **which side** loses **what**.",
      parts: {
        gr: ["Fasciculus gracilis (gracile tract)", "Medial part of the posterior column, present at **all levels**: fine touch, vibration and conscious proprioception from the **lower half** of the body. First-order fibres from the **large cells of the spinal ganglia**, uncrossed; they end in the **gracile nucleus** of the medulla."],
        cu: ["Fasciculus cuneatus (cuneate tract)", "Lateral part of the posterior column, only at **upper thoracic and cervical** levels: the same senses from the **upper half** of the body (arm). Ends in the **cuneate nucleus**."],
        lis: ["Dorsolateral tract (Lissauer)", "Pain and temperature fibres from the dorsal root run up or down 1–2 segments here before they synapse in the dorsal horn."],
        sg: ["Substantia gelatinosa of Rolando (SGR)", "Cap of the posterior horn. **Slow pain** (C fibres, substance P) ends here; the **lateral spinothalamic** tract starts from its cells and crosses."],
        ph: ["Posterior (dorsal) horn", "Sensory relay: receives the dorsal root. First-order cell bodies are **not** here; they are in the **dorsal root ganglion**."],
        lh: ["Lateral horn", "Preganglionic **sympathetic** neurons, **T1–L2** only. The sacral parasympathetic outflow (S2–S4) sits in the same zone."],
        ah: ["Anterior (ventral) horn", "α and γ motor neurons whose efferent fibres supply **skeletal muscle**: the **final common path**. Damage here = **LMN** signs (flaccid, wasting, fasciculation, lost reflexes)."],
        clarke: ["Clarke's nucleus (dorsal nucleus, C8–L3)", "Origin of the **dorsal spinocerebellar** tract (uncrossed). Homologous to the **accessory cuneate nucleus** (the arm's version, above C8)."],
        cc: ["Central canal", "In the **grey commissure** (not the white); continues up into the 4th ventricle."],
        awc: ["Anterior white commissure", "Where **spinothalamic** fibres cross, at or within 1–2 segments of entry. A cavity here (**syringomyelia**) cuts them on both sides."],
        dsc: ["Dorsal (posterior) spinocerebellar tract", "Unconscious proprioception from **Clarke's nucleus**, **uncrossed**, into the cerebellum by the **inferior** peduncle."],
        vsc: ["Ventral (anterior) spinocerebellar tract", "Unconscious proprioception; crosses in the cord, enters by the **superior** peduncle, then crosses back, so the cerebellum still hears its own side."],
        lcs: ["Lateral corticospinal tract", "The pyramidal tract after it **crossed in the medulla** (80–90% of fibres). Ends on the **lateral** motor neurons: distal limbs, skilled hand movement. A cord lesion here = **UMN** paralysis on the **same** side below it."],
        rbs: ["Rubrospinal tract", "From the **red nucleus** (midbrain), crossed. Extrapyramidal."],
        rts: ["Reticulospinal tracts", "From the pontine and medullary reticular formation; present at **all levels**. Tone and posture."],
        lst: ["Lateral spinothalamic tract", "**Pain and temperature** from the **opposite** side. Mainly **2nd-order** axons (from the SGR of the other side, crossed in the anterior white commissure); ends in the **thalamus (VPL)**. **Left** tract cut → no pain in the **right** foot."],
        stec: ["Spinotectal tract", "To the **superior colliculus**: the **spino-visual reflex** (turning eyes and head to a stimulus). One of the tracts that end **below the cortex**."],
        os: ["Olivospinal tract", "A **single**, **cervical** extrapyramidal tract (Helweg's triangle)."],
        ast: ["Ventral (anterior) spinothalamic tract", "**Crude touch and pressure**, tickle, itch, from the opposite side. In the brainstem it joins the lateral tract as the **spinal lemniscus**."],
        ves: ["Vestibulospinal tract", "From the lateral vestibular nucleus, uncrossed: antigravity (extensor) tone and balance."],
        tes: ["Tectospinal tract", "From the **superior colliculus** (not the red nucleus); cervical levels. Turns the head to sights and sounds."],
        acs: ["Anterior corticospinal tract", "The **uncrossed** 10–20% of the pyramidal tract, beside the anterior median fissure; to the medial (axial) motor neurons."],
        mlf: ["Sulcomarginal tract", "The continuation of the **medial longitudinal bundle**, at the bottom of the fissure, present at **all levels**."],
        drg: ["Dorsal root ganglion", "Cell bodies of **every 1st-order** sensory neuron (not the dorsal horn). Large cells send thick myelinated fibres by the **medial** division into the posterior column."],
        dr: ["Dorsal (posterior) root", "Sensory fibres entering at the posterolateral sulcus."],
        vr: ["Ventral (anterior) root", "Motor fibres from the anterior horn (at T1–L2 also preganglionic sympathetic fibres from the lateral horn)."],
        amf: ["Anterior median fissure", "The deep front groove; the **anterior spinal artery** runs in it."],
        pms: ["Posterior median sulcus and septum", "Separates the two posterior columns."],
        asa: ["Anterior spinal artery", "**One** artery, from a branch of **each vertebral**, in the anterior median fissure. Supplies the **anterior 2/3** of the cord."],
        psa: ["Posterior spinal arteries", "**Two**, from the vertebral arteries or PICA. Supply the **posterior 1/3** (the dorsal columns)."],
      },
      drill: ["gr", "cu", "lcs", "lst", "ast", "dsc", "vsc", "rbs", "tes", "ves", "acs", "stec", "ah", "ph", "lh", "sg", "awc", "cc", "drg", "clarke", "mlf"],
      sims: [
        {
          id: "bsq",
          label: "✂ Hemisection",
          on: ["gr.R", "cu.R", "lcs.R", "lst.R"],
          show: ["cut-R"],
          info: "**Brown-Séquard**: the **right** half cut (e.g. at C2). Same side below: **UMN paralysis** + lost **vibration, fine touch, position**. Opposite side below: lost **pain, temperature, crude touch**. At the level, same side: **LMN** signs and a band of lost sensation.",
          res: () =>
            '<div class="ixARes2">' +
            bodyBox({ R: { neck: "ALL", up: "MD", arm: "MD", low: "MD", leg: "MD" }, L: { up: "P", arm: "P", low: "P", leg: "P" } }, 42, [["#ff5d8f", "motor"], ["#4cc9f0", "vibration · position"], ["#ff9f43", "pain · temp"]]) +
            box("Why the sides differ", ["The dorsal columns cross **high**, in the medulla, so below a cord lesion they are still on the **same** side.", "Spinothalamic fibres cross **at once** (anterior white commissure), so the cut tract already carries the **other** side.", "Right half at C2 → **right hand**: motor + vibration lost; **left hand**: pain + crude touch lost."]) +
            "</div>",
        },
        {
          id: "syr",
          label: "🕳 Syringomyelia",
          lost: ["awc"],
          on: ["lst", "ah"],
          show: ["syr"],
          info: "A cavity round the central canal (usually lower cervical) cuts the **crossing** spinothalamic fibres of **both** sides: **cape (jacket)** loss of **pain and temperature**, touch and vibration **spared** (dissociated loss). Into the anterior horns → **LMN** wasting of the hand muscles.",
          res: () =>
            '<div class="ixARes2">' + bodyBox({ R: { up: "P", arm: "P" }, L: { up: "P", arm: "P" } }, 0, [["#ff9f43", "pain · temp lost"]]) +
            box("Spot it in a stem", ["**Painless burns** on the hands, shoulders and arms.", "Touch and position **normal** (dorsal columns untouched).", "'Jacket' loss = **syringomyelia**, not a thalamic lesion."]) + "</div>",
        },
        {
          id: "tabes",
          label: "🦠 Tabes dorsalis",
          lost: ["gr", "cu", "dr"],
          info: "**Neurosyphilis** (Treponema pallidum) degenerates the **dorsal roots and dorsal columns** (gracile and cuneate): lost position and vibration → **sensory ataxia**, a stamping gait worse in the dark, **Romberg +**, lightning pains, **lost deep reflexes**, hypotonia. **Crude touch is kept.**",
          res: () =>
            '<div class="ixARes2">' + bodyBox({ R: { low: "D", leg: "D" }, L: { low: "D", leg: "D" } }, 0, [["#4cc9f0", "position · vibration · fine touch"]]) +
            box("Not tabes", ["**Shuffling** gait → Parkinson's.", "Viral ganglionitis → herpes zoster.", "Posterior column of the **lumbar** cord injured → lost tactile discrimination of the **lower limbs** only."]) + "</div>",
        },
        {
          id: "asa",
          label: "🩸 Anterior spinal a.",
          lost: ["lcs", "lst", "ast", "ah", "acs", "rbs", "ves", "tes", "rts", "vsc", "stec", "lh", "awc", "mlf", "os"],
          on: ["gr", "cu"],
          show: ["asa-t", "art"],
          info: "Anterior spinal artery occlusion kills the **anterior 2/3**: below the lesion **both** sides lose **movement** (UMN; LMN at the level) and **pain and temperature**. The **dorsal columns survive** (posterior spinal arteries): vibration and position are normal.",
          res: () => '<div class="ixARes2">' + bodyBox({ R: { up: "MP", arm: "MP", low: "MP", leg: "MP" }, L: { up: "MP", arm: "MP", low: "MP", leg: "MP" } }, 42, [["#ff5d8f", "motor"], ["#ff9f43", "pain · temp"]]) + box("Watershed", ["The **upper thoracic cord (T1–T4)** has the fewest radicular top-ups: most vulnerable.", "The **lumbar enlargement** depends on the **arteria radicularis magna (Adamkiewicz)**, usually on the **left**, T9–L2."]) + "</div>",
        },
        {
          id: "pain",
          label: "🔥 Pain path",
          on: ["drg.L", "dr.L", "sg.L", "awc", "lst.R"],
          show: ["fl-pain"],
          info: "Pain from the patient's **left** enters the left dorsal root, synapses in the **substantia gelatinosa**, crosses in the **anterior white commissure** within 1–2 segments, and climbs in the **right** lateral spinothalamic tract. So a cord lesion loses pain on the **opposite** side.",
        },
        {
          id: "touch",
          label: "✋ Touch path",
          on: ["drg.L", "dr.L", "gr.L", "cu.L"],
          show: ["fl-dc"],
          info: "Fine touch, vibration and position from the **left** turn straight up the **left** posterior column (cuneate for the arm, gracile for the leg). No crossing until the **medulla** (internal arcuate fibres). So a cord lesion loses them on the **same** side.",
        },
        {
          id: "motor",
          label: "💪 Motor path",
          on: ["lcs.L", "ah.L", "vr.L"],
          show: ["fl-motor"],
          info: "The **left** lateral corticospinal tract came from the **right** cortex and **crossed in the medulla**. It ends on the left anterior horn → left ventral root → left muscles. A cord lesion therefore paralyses the **same** side: UMN below, LMN at the level.",
        },
        {
          id: "blood",
          label: "🩸 Blood supply",
          on: ["asa", "psa"],
          show: ["asa-t", "psa-t", "art"],
          info: "**One anterior spinal artery** (a branch from each vertebral) in the anterior median fissure → **anterior 2/3**. **Two posterior spinal arteries** (vertebral or PICA) → **posterior 1/3**. Segmental (radicular) arteries top them up; the biggest is the **artery of Adamkiewicz**.",
        },
      ],
      secs: { "an-spinal-cord#3": "", "an-spinal-cord#7": "blood", "ph-sensory-lesions#0": "bsq", "ph-sensory-lesions#1": "tabes", "ph-sensory-lesions#2": "syr", "hi-cns#1": "", "hi-cns#5": "tabes", "ph-pain#1": "pain", "ph-umn-lmn#0": "motor" },
      rules: [
        [/hemisect|brown[\s-]*s[eé]quard|half of the (spinal )?cord|right half|left half/i, "bsq"],
        [/syringomyel|jacket|\bcape\b/i, "syr"],
        [/tabes/i, "tabes"],
        [/anterior spinal arter|adamkiewicz|radicularis magna|posterior spinal arter|blood supply of the (spinal )?cord/i, "blood"],
      ],
    });
  })();
})();
