/* INTELLECTUALITY v17.4 · Boards for the last topics that had no picture: development of the CNS (neural tube, crest,
 * plates, vesicles, flexures, positional change, spina bifida), the scalp and the face's sensory nerves, the parotid
 * gland with the jaw and its muscles, the cortical areas with the aphasias, and the arousal system with the
 * hypothalamus. Drawn from the notes' wording (an-embryology-cns, an-scalp, an-face#0, an-parotid, an-mastication,
 * an-tmj, an-sulci-gyri functional areas, ph-speech, ph-arousal).
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { T, ps } = A.kit;
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");
  const box = (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="#0f1d2e" stroke="#26405e" pointer-events="none"/>';
  const dot = (id, x, y, r, c, rr) => '<circle class="pf" data-p="' + id + '" cx="' + x + '" cy="' + y + '" r="' + r + '" style="--c:' + c + ";--r:" + rr + '"/>';
  const pf = (id, d, c, r) => '<path class="pf" data-p="' + id + '" d="' + d + '" style="--c:' + c + ";--r:" + r + '"/>';
  const G = "#5ef0a0",
    GR = "#1e4a36",
    B = "#66e9ff",
    BR = "#1d3a55",
    Y = "#ffd166",
    YR = "#4a4030",
    O = "#ff9f43",
    OR = "#4a3020",
    P = "#b39cff",
    PR = "#3a3060",
    R = "#ff5d7a",
    RR = "#5a3040";

  /* ═══════════════ 1. DEVELOPMENT OF THE CNS ═══════════════ */
  (function () {
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">DEVELOPMENT OF THE CNS · TUBE, CREST, PLATES, VESICLES</text>';
      // A. plate → groove → tube with the crest
      s += box(4, 22, 262, 132) + T(135, 36, "NEURAL PLATE → GROOVE → TUBE (from day 22)", "sm mut");
      s += pf("plate", "M14 72 L78 72 L78 80 L14 80 Z", B, BR) + T(46, 94, "plate", "sm");
      s += pf("groove", "M96 64 C104 64 108 84 122 84 C136 84 140 64 148 64 L148 72 C142 72 138 92 122 92 C106 92 102 72 96 72 Z", B, BR) + T(122, 106, "groove", "sm");
      s += '<circle class="pf" data-p="tube" cx="210" cy="82" r="18" style="--c:#66e9ff;--r:#1d3a55"/><circle cx="210" cy="82" r="7" fill="#0f1d2e" pointer-events="none"/>' + T(210, 116, "neural tube", "sm");
      s += dot("crest", 186, 60, 5, O, OR) + dot("crest", 234, 60, 5, O, OR) + T(210, 52, "neural crest", "sm");
      s += dot("ntc", 210, 132, 5, "#cfd8e3", "#5a6a7a") + T(210, 148, "notochord (induces)", "sm");
      s += cell("npore", 10, 116, 150, 34, ["NEUROPORES: temporary link to", "the AMNIOTIC cavity; cranial", "closes ~day 25, caudal ~27"], Y, YR);
      // B. derivatives
      s += box(270, 22, 266, 132) + T(403, 36, "WHAT EACH ONE BECOMES", "sm mut");
      s += cell("d_tube", 276, 42, 254, 46, ["NEURAL TUBE → all CNS neurons incl. VENTRAL", "(anterior) HORN cells, macroglia (astrocytes,", "oligodendrocytes), ependyma, retina,", "posterior pituitary"], B, BR);
      s += cell("d_crest", 276, 92, 254, 56, ["NEURAL CREST → DORSAL ROOT GANGLIA, cranial", "sensory ganglia, SYMPATHETIC TRUNK and autonomic", "ganglia, SUPRARENAL MEDULLA, Schwann cells,", "melanocytes, PIA + ARACHNOID, face and", "arch cartilage/bone"], O, OR);
      // C. developing cord cross-section
      s += box(4, 160, 262, 170) + T(135, 174, "THE CORD'S WALL AND PLATES", "sm mut");
      s += '<ellipse cx="96" cy="250" rx="66" ry="64" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
      s += pf("marg", "M96 186 C136 186 162 216 162 250 C162 284 136 314 96 314 C56 314 30 284 30 250 C30 216 56 186 96 186 Z M96 200 C64 200 44 222 44 250 C44 278 64 300 96 300 C128 300 148 278 148 250 C148 222 128 200 96 200 Z", "#cfd8e3", "#3a4a5e");
      s += pf("alar", "M58 212 C70 204 84 206 90 216 L90 246 L52 246 C48 234 50 220 58 212 Z M134 212 C122 204 108 206 102 216 L102 246 L140 246 C144 234 142 220 134 212 Z", G, GR);
      s += pf("basal", "M52 254 L90 254 L90 284 C80 294 62 292 54 282 C48 274 48 262 52 254 Z M140 254 L102 254 L102 284 C112 294 130 292 138 282 C144 274 144 262 140 254 Z", R, RR);
      s += '<path class="pf" data-p="canal" d="M92 214 L100 214 L100 286 L92 286 Z" style="--c:#66e9ff;--r:#14304a"/>';
      s += pf("roof", "M88 196 L104 196 L102 212 L90 212 Z", Y, YR) + pf("floor", "M90 288 L102 288 L104 304 L88 304 Z", Y, YR);
      s += '<path class="ps" data-p="slim" d="M44 250 L90 250 M102 250 L148 250" style="--c:#ffffff;--r:#8a9ab0;--w:2"/>';
      s += T(170, 228, "ALAR plate →", "sm", "start") + T(170, 238, "SENSORY horn", "sm", "start") + T(170, 266, "BASAL plate →", "sm", "start") + T(170, 276, "MOTOR horn", "sm", "start");
      s += T(170, 252, "sulcus limitans", "sm", "start") + T(96, 192, "roof", "sm") + T(96, 318, "floor", "sm");
      // D. vesicles
      s += box(270, 160, 266, 170) + T(403, 174, "3 → 5 VESICLES, FLEXURES, CAVITIES", "sm mut");
      const ves = [
        ["v_tel", "TELENCEPHALON", "hemispheres · lateral ventricles", P, PR],
        ["v_dien", "DIENCEPHALON", "thalami, hypothalamus, infundibulum · 3rd v.", B, BR],
        ["v_mes", "MESENCEPHALON", "midbrain · aqueduct", G, GR],
        ["v_met", "METENCEPHALON", "PONS + CEREBELLUM · 4th v.", Y, YR],
        ["v_myel", "MYELENCEPHALON", "MEDULLA · 4th v.", O, OR],
      ];
      ves.forEach(([id, name, what, c, r], i) => (s += cell(id, 330, 182 + i * 26, 200, 22, [name, what], c, r)));
      s += cell("p_pros", 276, 182, 48, 48, ["PROS-", "ENCEPH-", "ALON"], P, PR) + cell("p_mes", 276, 234, 48, 22, ["MES"], G, GR) + cell("p_rhomb", 276, 260, 48, 48, ["RHOMB-", "ENCEPH-", "ALON"], Y, YR);
      s += cell("flex", 276, 312, 254, 16, ["FLEXURES: cephalic (midbrain), cervical, PONTINE (met/myel)"], "#cfd8e3", "#3a4a5e");
      // E. position and defects
      s += box(4, 336, 532, 118) + T(270, 350, "POSITIONAL CHANGE AND DEFECTS", "sm mut");
      s += cell("pos", 10, 356, 170, 36, ["cord ends: 3 months = whole", "canal · BIRTH = L3 · ADULT =", "L1 (L1–L2): column outgrows it"], G, GR);
      s += cell("sbo", 184, 356, 170, 36, ["SPINA BIFIDA OCCULTA: arch of", "ONE vertebra (L5/S1) unfused,", "skin-covered, tuft of hair"], O, OR);
      s += cell("mening", 358, 356, 172, 36, ["MENINGOCELE: meninges herniate", "(CSF sac) · MENINGOMYELOCELE:", "+ cord/roots · myeloschisis: open"], O, OR);
      s += cell("hydro", 10, 396, 256, 36, ["HYDROCEPHALUS: NON-communicating = block INSIDE", "the ventricles (aqueduct stenosis); communicating =", "poor resorption or excess production; big head = result"], B, BR);
      s += cell("other", 270, 396, 260, 36, ["ANENCEPHALY: cranial neuropore fails · ARNOLD–", "CHIARI: tonsils through foramen magnum · FOLIC", "ACID prevents most · maternal AFP ↑ = open defect"], R, RR);
      s += cell("myelin", 10, 436, 520, 14, ["mantle layer = cell bodies + glia → GREY · marginal = fibres → WHITE · ventricular → EPENDYMA · myelination from the 4th month"], "#cfd8e3", "#3a4a5e");
      return s;
    };
    A.scene("embryo", {
      title: "Development of the CNS · neural tube and crest, the cord's plates, brain vesicles, positional change, defects",
      vb: "0 0 540 458",
      svg,
      intro: "Top: the **neural plate** folds into the **tube**, the **crest** separates, the **neuropores** close. Middle: the cord's **alar (sensory)** and **basal (motor)** plates either side of the **sulcus limitans**, and the **five vesicles** with what each becomes. Bottom: where the cord ends, and the defects.",
      parts: {
        plate: ["Neural plate", "Ectoderm thickened under the notochord's induction (~day 18)."],
        groove: ["Neural groove", "The plate folds; its edges (neural folds) rise and meet."],
        tube: ["Neural tube", "The folds fuse from ~day 22, starting in the future cervical region and closing towards both ends. Its cephalic part **dilates** into the brain vesicles."],
        crest: ["Neural crest", "Cells from the crests of the folds that migrate away."],
        ntc: ["Notochord", "Induces the neural plate."],
        npore: ["Neuropores", "The open ends of the tube: a **temporary connection between the neural tube and the amniotic cavity** until they close (cranial ≈ day 25, caudal ≈ day 27–28)."],
        d_tube: ["Neural-tube derivatives", "All CNS neurons, including the **ventral horn cells**; the macroglia (astrocytes, oligodendrocytes); the ependyma; the retina; the posterior pituitary."],
        d_crest: ["Neural-crest derivatives", "**Dorsal root ganglia**, cranial sensory ganglia, the **sympathetic trunk** and autonomic ganglia, the **suprarenal medulla**, Schwann cells, melanocytes, the **pia and arachnoid**, and the cartilage and bone of the face and arches. Not the ventral horn cells."],
        marg: ["Marginal layer", "Nerve fibres: becomes the **white matter**."],
        alar: ["Alar plate", "Dorsal thickening of the mantle layer → the **sensory** posterior horn."],
        basal: ["Basal plate", "Ventral thickening → the **motor** anterior horn (and the lateral horn at T1–L2, S2–S4)."],
        canal: ["Central canal (ventricular layer)", "Its lining, the ventricular (ependymal) layer, becomes the **ependyma**."],
        roof: ["Roof plate", "**Thin**: carries crossing fibres, no neurons."],
        floor: ["Floor plate", "**Thin**, like the roof plate."],
        slim: ["Sulcus limitans", "The groove that **marks the boundary between the motor (basal) and sensory (alar) areas**."],
        p_pros: ["Prosencephalon (forebrain)", "Divides into the telencephalon and diencephalon."],
        p_mes: ["Mesencephalon (midbrain)", "Stays single."],
        p_rhomb: ["Rhombencephalon (hindbrain)", "Divides into the metencephalon and myelencephalon; its cavity is the **4th ventricle**."],
        v_tel: ["Telencephalon", "Cerebral hemispheres; cavity = the **lateral ventricles**. It does not form the pons or cerebellum."],
        v_dien: ["Diencephalon", "Thalamus, **hypothalamus**, epithalamus, the optic cup/retina, and the **infundibulum** (a **downward extension of the diencephalon** → posterior pituitary); cavity = the **3rd ventricle**."],
        v_mes: ["Mesencephalon", "The **midbrain**; cavity = the **cerebral aqueduct**."],
        v_met: ["Metencephalon", "**Pons and cerebellum**."],
        v_myel: ["Myelencephalon", "The **medulla oblongata** (not the midbrain)."],
        flex: ["Flexures", "**Cephalic** (midbrain), **cervical** (hindbrain–cord), and the **pontine** flexure, which develops **between the metencephalon and the myelencephalon** and bends the opposite way."],
        pos: ["Positional change", "At 3 months the cord fills the canal; at **birth it ends at L3**; in the **adult at L1 (L1–L2)** because the vertebral column grows faster (hence the cauda equina)."],
        sbo: ["Spina bifida occulta", "Failure of the vertebral arch (laminae) to fuse, usually in **one** vertebra (L5 or S1), hidden under skin, often with a tuft of hair; no herniation."],
        mening: ["Meningocele and meningomyelocele", "**Meningocele**: spina bifida with herniation of the **meninges** (a CSF sac). **Meningomyelocele**: the meninges **and** the cord/roots. **Myeloschisis**: the folds never fused."],
        hydro: ["Hydrocephalus", "**Non-communicating** (obstructive): CSF blocked **inside the ventricular system** (e.g. **aqueduct stenosis**). Poor resorption or excess production (choroid plexus papilloma) give a **communicating** hydrocephalus. A big head is the **result**, not the cause."],
        other: ["Other neural-tube defects", "**Anencephaly** (cranial neuropore fails; polyhydramnios), **Arnold–Chiari** malformation, prevention by **folic acid**, and raised maternal **α-fetoprotein** with an open defect."],
        myelin: ["Layers and myelination", "Mantle → grey, marginal → white, ventricular → ependyma; myelination starts ~4th month."],
      },
      al: {
        plate: ["neural plate"],
        groove: ["neural groove", "neural folds"],
        tube: ["neural tube", "cephalic part"],
        crest: ["neural crest"],
        ntc: ["notochord"],
        npore: ["neuropore", "neuropores", "amniotic cavity", "amnion"],
        d_tube: ["ventral horn cells", "anterior horn cells of the spinal cord", "derivatives of the neural tube"],
        d_crest: ["sympathetic trunk", "cells of the sympathetic trunk", "suprarenal medulla", "adrenal medulla", "cells of the suprarenal medulla", "melanocytes", "derivatives of the neural crest"],
        marg: ["marginal layer"],
        alar: ["alar plate"],
        basal: ["basal plate"],
        canal: ["ventricular layer", "ependymal layer"],
        roof: ["roof plate", "roof and floor plates"],
        floor: ["floor plate"],
        slim: ["sulcus limitans"],
        p_pros: ["prosencephalon", "forebrain vesicle"],
        p_mes: ["mesencephalic vesicle"],
        p_rhomb: ["rhombencephalon"],
        v_tel: ["telencephalon"],
        v_dien: ["diencephalon", "downward extension of the diencephalon"],
        v_mes: ["mesencephalon"],
        v_met: ["metencephalon"],
        v_myel: ["myelencephalon"],
        flex: ["flexure", "flexures", "pontine flexure", "cervical flexure", "cephalic flexure", "~pontine", "~cervical", "~cephalic"],
        pos: ["positional change", "conus medullaris lies opposite", "at birth", "in newborns", "~1st lumbar vertebra", "~10th thoracic vertebra", "~lower border of l5"],
        sbo: ["spina bifida occulta", "spina bifida", "tuft of hair"],
        mening: ["meningocele", "meningomyelocele", "myelomeningocele", "myeloschisis", "rachischisis"],
        hydro: ["hydrocephalus", "noncommunicating hydrocephalus", "non communicating hydrocephalus", "aqueduct stenosis", "increased size of the head", "resorption of cerebrospinal fluid", "failure of the neural tube to close"],
        other: ["anencephaly", "arnold chiari", "folic acid", "alpha fetoprotein"],
        myelin: ["myelination", "mantle layer"],
      },
      drill: ["npore", "d_tube", "d_crest", "alar", "basal", "slim", "v_dien", "v_met", "v_myel", "flex", "pos", "sbo", "mening", "hydro"],
      sims: [
        { id: "tube", label: "Tube and crest", on: ["plate", "groove", "tube", "crest", "ntc", "npore", "d_tube", "d_crest"], info: "Plate → groove → **tube**; the **crest** gives DRG, sympathetic trunk, suprarenal medulla, Schwann cells; the **tube** gives the CNS neurons including **ventral horn cells**." },
        { id: "cord", label: "Plates", on: ["alar", "basal", "slim", "roof", "floor", "marg", "canal", "myelin"], info: "**Alar = sensory**, **basal = motor**, split by the **sulcus limitans**; roof and floor plates are **thin**." },
        { id: "ves", label: "Vesicles", on: ["p_pros", "p_mes", "p_rhomb", "v_tel", "v_dien", "v_mes", "v_met", "v_myel", "flex"], info: "Tel → hemispheres; **dien** → thalamus, hypothalamus, **infundibulum**; mes → midbrain; **met → pons + cerebellum**; myel → medulla. **Pontine flexure** between met and myel." },
        { id: "defects", label: "Position and defects", on: ["pos", "sbo", "mening", "hydro", "other"], info: "Cord ends at **L3 at birth**, **L1** in the adult. Occulta = one arch; meningocele = meninges; non-communicating hydrocephalus = **aqueduct stenosis**." },
      ],
      secs: { "an-embryology-cns#0": "tube", "an-embryology-cns#1": "cord", "an-embryology-cns#2": "defects", "an-embryology-cns#3": "ves" },
      rules: [
        [/vesicle|encephalon|flexure|infundibulum is a downward/i, "ves"],
        [/spina bifida|meningocele|hydrocephal/i, "defects"],
        [/alar|basal plate|sulcus limitans|mantle/i, "cord"],
        [/neural tube|neural crest|neuropore/i, "tube"],
      ],
    });
  })();

  /* ═══════════════ 2. SCALP AND THE FACE'S SENSORY NERVES ═══════════════ */
  (function () {
    const layers = [
      ["sc_s", "S · SKIN: thick, hairy", "#e8c9a8", "#5a4a3a", 14],
      ["sc_c", "C · dense CONNECTIVE tissue: vessels held open", R, RR, 20],
      ["sc_a", "A · APONEUROSIS (galea)", "#cfd8e3", "#4a5a6a", 14],
      ["sc_l", "L · LOOSE areolar: the DANGEROUS layer", Y, YR, 26],
      ["sc_p", "P · PERICRANIUM", B, BR, 14],
    ];
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">SCALP LAYERS · SENSORY NERVES OF THE FACE</text>';
      s += box(4, 22, 262, 238) + T(135, 36, "THE FIVE LAYERS (S-C-A-L-P)", "sm mut");
      let y = 44;
      for (const [id, name, c, r, h] of layers) {
        s += pf(id, "M14 " + y + " L256 " + y + " L256 " + (y + h) + " L14 " + (y + h) + " Z", c, r) + T(20, y + h / 2 + 3, name, "sm", "start");
        y += h + 2;
      }
      s += '<rect x="14" y="' + y + '" width="242" height="18" fill="#cfd8e3" opacity=".35" pointer-events="none"/>' + T(80, y + 12, "skull (outer table, diploë)", "sm mut");
      s += ps("emis", "M232 98 L232 " + (y + 18) + " L232 " + (y + 30), "#6f9bff", "#2a3a6a", 3) + T(226, y + 30, "emissary vein", "sm", "end");
      s += ps("sinus", "M206 " + (y + 36) + " L256 " + (y + 36), "#6f9bff", "#2a3a6a", 6) + T(200, y + 39, "dural sinus", "sm", "end");
      s += cell("scl_why", 10, 188, 250, 34, ["infection spreads freely in the LOOSE layer and", "reaches the sinuses by EMISSARY veins", "(the dense layer's septa localise it)"], Y, YR);
      s += cell("scl_art", 10, 226, 250, 30, ["ARTERIES: supratrochlear + supraorbital (ophthalmic);", "superficial temporal, posterior auricular, occipital (ECA)"], R, RR);
      // face map
      s += box(270, 22, 266, 238) + T(403, 36, "WHO SUPPLIES THE SKIN OF THE FACE", "sm mut");
      s += '<path d="M403 48 C452 48 478 92 476 140 C474 196 444 240 403 242 C362 240 332 196 330 140 C328 92 354 48 403 48 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
      s += pf("f_v1", "M336 110 C336 72 364 50 403 50 C442 50 470 72 470 110 L444 116 C432 104 418 104 408 116 L398 116 C388 104 374 104 362 116 Z", B, BR);
      s += pf("f_v2", "M336 118 L362 118 C372 110 388 110 396 120 L402 160 C392 168 380 176 360 176 C348 160 340 140 336 118 Z M470 118 L444 118 C434 110 418 110 410 120 L404 160 C414 168 426 176 446 176 C458 160 466 140 470 118 Z", G, GR);
      s += pf("f_v3", "M360 180 C382 180 394 172 403 168 C412 172 424 180 446 180 C442 212 428 236 403 238 C378 236 364 212 360 180 Z", O, OR);
      s += pf("f_ga", "M462 184 C474 184 482 200 478 218 C470 228 458 224 452 214 C454 204 456 192 462 184 Z", "#b39cff", PR);
      s += dot("f_lac", 454, 112, 5, Y, YR) + dot("f_so", 386, 70, 4, "#ffffff", "#6a7a8a") + dot("f_st", 396, 94, 4, "#ffffff", "#6a7a8a") + dot("f_io", 380, 146, 4, "#ffffff", "#6a7a8a") + dot("f_zf", 452, 144, 4, "#ffffff", "#6a7a8a") + dot("f_ment", 396, 222, 4, "#ffffff", "#6a7a8a") + dot("f_buc", 432, 196, 4, "#ffffff", "#6a7a8a") + dot("f_at", 478, 104, 4, "#ffffff", "#6a7a8a");
      s += [["SO", 386, 70], ["ST", 396, 94], ["L", 454, 112], ["IO", 380, 146], ["ZF", 452, 144], ["M", 396, 222], ["B", 432, 196], ["AT", 478, 104]].map(([t, x, y]) => T(x + 7, y + 3, t, "sm", "start")).join("");
      s += T(342, 64, "V1", "sm") + T(340, 150, "V2", "sm") + T(372, 214, "V3", "sm") + T(496, 206, "C2,3", "sm", "end");
      return s;
    };
    const svg2 = () =>
      svg() +
      cell("fn_v1", 4, 266, 176, 58, ["V1 OPHTHALMIC: SUPRAORBITAL", "(forehead, mid upper lid),", "SUPRATROCHLEAR (medial lid),", "LACRIMAL (UPPER LATERAL lid),", "infratrochlear, external nasal"], B, BR) +
      cell("fn_v2", 184, 266, 172, 58, ["V2 MAXILLARY: INFRAORBITAL", "(lower lid, side of nose,", "upper lip), ZYGOMATICOFACIAL", "(cheekbone), zygomatico-", "temporal (anterior temple)"], G, GR) +
      cell("fn_v3", 360, 266, 176, 58, ["V3 MANDIBULAR: AURICULO-", "TEMPORAL (temple, meatus, outer", "drum, TMJ), BUCCAL (cheek over", "buccinator), MENTAL (chin,", "lower lip)"], O, OR) +
      cell("fn_ga", 4, 328, 532, 16, ["ANGLE OF THE JAW = GREAT AURICULAR nerve (C2, C3), not trigeminal · back of scalp: greater occipital (C2), lesser occipital (C2)"], P, PR);
    A.scene("scalpface", {
      title: "Scalp layers and the dangerous area · the sensory nerves of the face",
      vb: "0 0 540 348",
      svg: svg2,
      intro: "Left: the **five layers** of the scalp, with the **loose areolar** layer (the dangerous one) crossed by **emissary veins**. Right: which nerve supplies which patch of facial skin.",
      parts: {
        sc_s: ["Skin (1st layer)", "Thick, hairy, many sebaceous glands. Infection here stays localised."],
        sc_c: ["Dense connective tissue (2nd layer)", "Holds the vessels and nerves; its fibrous septa **hold cut vessels open**, so scalp wounds **bleed profusely**, but the septa **limit the spread** of infection."],
        sc_a: ["Aponeurosis (galea, 3rd layer)", "The flat tendon of occipitofrontalis; not a spreading plane. The first three layers move together."],
        sc_l: ["Loose areolar tissue (4th layer)", "The **dangerous area (layer) of the scalp**: blood or pus spreads freely here, and **emissary veins** cross it to the dural venous sinuses (meningitis, sinus thrombosis)."],
        sc_p: ["Pericranium (5th layer)", "The periosteum of the outer skull surface."],
        emis: ["Emissary veins", "Valveless veins crossing the loose layer and the skull to the dural sinuses: the route infection takes inside."],
        sinus: ["Dural venous sinus", "Reached by infection through the emissary veins."],
        scl_why: ["Why the loose layer is dangerous", "It is the only layer where fluid spreads widely, and it is crossed by emissary veins leading into the skull."],
        scl_art: ["Arteries of the scalp", "In front: **supratrochlear and supraorbital** (from the **ophthalmic**, internal carotid system). Side and back: **superficial temporal, posterior auricular, occipital** (external carotid)."],
        f_v1: ["Ophthalmic (V1) territory", "Forehead, upper lid, dorsum of the nose."],
        f_v2: ["Maxillary (V2) territory", "Lower lid, cheek, side of the nose, upper lip."],
        f_v3: ["Mandibular (V3) territory", "Temple, cheek over the buccinator, chin and lower lip (not the angle of the jaw)."],
        f_ga: ["Great auricular territory", "The skin over the **angle of the jaw** and the parotid: **C2, C3** (cervical plexus), not trigeminal."],
        f_lac: ["Lacrimal nerve", "Skin of the **upper lateral eyelid** (V1)."],
        f_so: ["Supraorbital nerve", "The forehead and the middle of the upper lid (V1); sensory, so its injury does not cause ptosis."],
        f_st: ["Supratrochlear nerve", "The medial upper lid and forehead (V1); sensory."],
        f_io: ["Infraorbital nerve", "Lower lid, side of the nose, upper lip (V2)."],
        f_zf: ["Zygomaticofacial nerve", "Skin over the cheekbone (V2)."],
        f_ment: ["Mental nerve", "Chin and lower lip (V3)."],
        f_buc: ["Buccal nerve", "Skin and mucosa of the cheek over the buccinator (V3)."],
        f_at: ["Auriculotemporal nerve", "Temple, upper auricle, **external auditory meatus**, **outer surface of the ear drum**, the **TMJ** (V3). The anterior temple is the zygomaticotemporal (V2)."],
        fn_v1: ["Branches of V1 to the skin", "Supraorbital, supratrochlear, **lacrimal** (upper lateral lid), infratrochlear, external nasal."],
        fn_v2: ["Branches of V2 to the skin", "Infraorbital, zygomaticofacial, zygomaticotemporal (anterior temple)."],
        fn_v3: ["Branches of V3 to the skin", "Auriculotemporal, buccal, mental."],
        fn_ga: ["Not trigeminal", "The **angle of the jaw** is the **great auricular** nerve (C2, C3); the back of the scalp is the greater (C2) and lesser occipital nerves."],
      },
      al: {
        sc_s: ["~skin"],
        sc_c: ["dense connective tissue", "connective tissue layer", "~connective tissue"],
        sc_a: ["aponeurosis", "galea aponeurotica", "epicranial aponeurosis"],
        sc_l: ["loose areolar tissue", "loose areolar", "dangerous area of scalp", "dangerous area of the scalp", "dangerous layer"],
        sc_p: ["pericranium"],
        emis: ["emissary veins", "emissary"],
        scl_art: ["arteries of the scalp", "occipital artery", "posterior auricular artery", "supraorbital artery", "supratrochlear artery"],
        f_ga: ["great auricular nerve", "great auricular", "angle of the jaw", "angle of the mandible"],
        f_lac: ["lacrimal nerve", "upper lateral eyelid", "skin over the upper lateral eyelid"],
        f_so: ["supraorbital nerve", "supraorbital"],
        f_st: ["supratrochlear nerve", "supratrochlear"],
        f_io: ["infraorbital nerve"],
        f_zf: ["zygomaticofacial nerve", "zygomaticofacial", "zygomaticotemporal", "anterior part of the temple"],
        f_ment: ["mental nerve", "chin and lower lip"],
        f_buc: ["buccal nerve", "skin over the buccinator"],
        f_at: ["auriculotemporal nerve", "auriculotemporal", "outer surface of the ear drum", "skin of the temple"],
        fn_v1: ["frontal nerve", "infratrochlear", "external nasal"],
        fn_ga: ["greater occipital", "lesser occipital"],
      },
      drill: ["sc_c", "sc_l", "sc_a", "emis", "f_lac", "f_so", "f_st", "f_io", "f_ment", "f_buc", "f_at", "f_ga"],
      sims: [
        { id: "layers", label: "The five layers", on: ["sc_s", "sc_c", "sc_a", "sc_l", "sc_p", "emis", "sinus", "scl_why"], info: "**S**kin, dense **C**onnective tissue (bleeds), **A**poneurosis, **L**oose areolar (**dangerous**: emissary veins → sinuses), **P**ericranium." },
        { id: "face", label: "Face nerves", on: ["f_v1", "f_v2", "f_v3", "f_ga", "f_lac", "f_so", "f_st", "f_io", "f_zf", "f_ment", "f_buc", "f_at", "fn_v1", "fn_v2", "fn_v3", "fn_ga"], info: "V1 forehead and upper lid (**lacrimal** = upper lateral lid); V2 cheek; V3 temple, cheek over buccinator, chin; angle of jaw = **great auricular**." },
      ],
      secs: { "an-scalp#0": "layers", "an-scalp#1": "layers", "an-face#0": "face" },
      rules: [
        [/scalp/i, "layers"],
        [/eyelid|skin over|supplied by the/i, "face"],
      ],
    });
  })();

  /* ═══════════════ 3. PAROTID, JAW AND MASTICATION ═══════════════ */
  (function () {
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">PAROTID GLAND · DUCT · SECRETOMOTOR PATH · JAW AND ITS MUSCLES</text>';
      s += box(4, 22, 262, 226) + T(135, 36, "INSIDE THE GLAND (superficial → deep)", "sm mut");
      s += pf("pgl", "M30 64 C64 50 124 52 146 72 C158 108 152 166 124 198 C92 212 54 200 40 168 C26 130 22 94 30 64 Z", Y, "#4a4030");
      s += ps("p_fn", "M44 150 C64 132 92 120 146 98 M92 124 C110 132 132 150 144 168 M68 138 C92 114 110 92 146 76", G, GR, 2.4) + T(166, 100, "facial n.", "sm", "start") + T(166, 110, "(most superficial)", "sm", "start");
      s += ps("p_rmv", "M100 56 L100 206", "#6f9bff", "#2a3a6a", 3.4) + T(104, 220, "retromandibular v.", "sm", "start");
      s += ps("p_eca", "M80 210 C80 170 82 110 82 60", R, "#6a3040", 3.4) + T(76, 220, "ECA (deepest)", "sm", "end");
      s += ps("p_at", "M114 58 C118 52 122 48 128 44", O, OR, 2) + T(132, 48, "auriculotemporal (upper border)", "sm", "start");
      s += cell("p_surf", 10, 196 + 30, 250, 18, ["SURFACES: superficial, anteromedial, posteromedial, superior"], Y, YR);
      // duct
      s += box(270, 22, 266, 110) + T(403, 36, "THE PAROTID (STENSEN'S) DUCT", "sm mut");
      s += pf("p_mass", "M330 54 L390 54 L394 114 L326 114 Z", "#b39cff", "#3a3060") + T(360, 124, "masseter", "sm");
      s += ps("p_duct", "M280 76 L396 76 C410 76 418 82 424 92", "#d9ff43", "#6a7a3a", 3) + T(300, 70, "duct", "sm");
      s += pf("p_bucc", "M420 52 L430 52 L430 118 L420 118 Z", "#ff9f43", OR) + T(425, 128, "buccinator", "sm");
      s += dot("p_open", 440, 100, 6, R, RR) + T(446, 96, "opens in VESTIBULE", "sm", "start") + T(446, 106, "opposite UPPER", "sm", "start") + T(446, 116, "2nd MOLAR", "sm", "start");
      // secretomotor
      s += box(270, 136, 266, 112) + T(403, 150, "SECRETOMOTOR PATH (IX, not VII)", "sm mut");
      const path = [["s_isn", "inferior salivatory nucleus"], ["s_ix", "IX → tympanic branch"], ["s_lpn", "LESSER PETROSAL"], ["s_otic", "OTIC ganglion (synapse)"], ["s_atn", "AURICULOTEMPORAL → gland"]];
      path.forEach(([id, t], i) => (s += cell(id, 276 + (i % 2) * 130, 156 + Math.floor(i / 2) * 30, 124, 24, [t], i < 2 ? G : i === 2 ? Y : O, i < 2 ? GR : i === 2 ? YR : OR)));
      s += cell("s_pain", 406, 216, 124, 24, ["capsule: GREAT", "AURICULAR (pain)"], P, PR);
      // jaw
      s += box(4, 254, 532, 162) + T(270, 268, "THE JAW: MUSCLES AND THE TMJ", "sm mut");
      s += '<path d="M22 336 L112 330 L112 300 L110 286 L124 298 L140 298 L146 290 L152 280 L160 286 L156 300 L158 344 C152 356 142 358 130 358 L40 358 C28 356 20 348 22 336 Z" fill="#cfd8e3" opacity=".3" stroke="#8fa6c0" pointer-events="none"/>' + T(56, 350, "mandible (front ←)", "sm mut");
      s += pf("m_temp", "M110 288 L84 264 L142 264 L120 292 Z", B, BR) + T(113, 276, "temporalis", "sm");
      s += pf("m_cor", "M104 300 L110 284 L118 300 Z", B, BR) + T(96, 296, "coronoid", "sm", "end");
      s += dot("m_cond", 154, 282, 6, G, GR) + T(160, 270, "condyle", "sm");
      s += pf("m_mass2", "M106 304 L150 304 L156 350 L114 350 Z", "#b39cff", PR) + T(132, 332, "masseter", "sm");
      s += ps("m_lpt", "M150 292 L96 312", O, OR, 4) + T(92, 318, "lat. pterygoid", "sm", "end");
      s += cell("m_temp_c", 186, 276, 170, 34, ["TEMPORALIS → CORONOID process;", "elevates; POSTERIOR fibres", "RETRACT · deep temporal nn."], B, BR);
      s += cell("m_mass_c", 360, 276, 170, 34, ["MASSETER: zygomatic arch →", "lateral RAMUS + ANGLE; elevates", "(clench) · masseteric n."], P, PR);
      s += cell("m_lpt_c", 186, 314, 170, 44, ["LATERAL PTERYGOID → NECK", "(pterygoid fovea) + DISC; OPENS", "(depresses) and PROTRUDES; with", "the medial: chin to the other side"], O, OR);
      s += cell("m_mpt_c", 360, 314, 170, 44, ["MEDIAL PTERYGOID: medial surface", "of the LATERAL plate → medial", "ramus + angle; elevates · nerve", "to medial pterygoid (main trunk)"], O, OR);
      s += cell("tmj", 10, 362 + 0, 346, 50, ["TMJ: SYNOVIAL, CONDYLAR (modified hinge) · DISC: upper = glide,", "lower = hinge · opens: LATERAL PTERYGOIDS (+ digastric, gravity);", "closes: temporalis, masseter, medial pterygoid · dislocates", "ANTERIORLY (in front of the eminence); reduce: press down and back"], G, GR);
      s += cell("tmj_n", 360, 362, 170, 50, ["TMJ and the OUTER ear-drum", "surface: AURICULOTEMPORAL;", "the inner drum: IX · mastoid", "process: sternomastoid, not", "temporalis"], Y, YR);
      return s;
    };
    A.scene("parotid", {
      title: "Parotid gland, its duct and secretomotor path · the jaw's muscles and the TMJ",
      vb: "0 0 540 420",
      svg,
      intro: "Top-left: inside the parotid the **facial nerve** is most superficial, then the **retromandibular vein**, then the **external carotid** (deepest). Top-right: the duct across the masseter, through the **buccinator**, into the vestibule opposite the **upper 2nd molar**; the secretomotor path is **IX → lesser petrosal → otic → auriculotemporal**. Bottom: the jaw.",
      parts: {
        pgl: ["Parotid gland", "An inverted pyramid with **superficial, anteromedial, posteromedial and superior** surfaces. The facial trunk enters through the **posteromedial** surface; its branches leave by the **anterior border**. **Malignant** tumours usually invade the facial nerve (palsy); benign ones rarely do."],
        p_fn: ["Facial nerve inside the parotid", "The **most superficial** structure in the gland; its branches run in the superficial part and emerge from the anterior border."],
        p_rmv: ["Retromandibular vein", "Deep to the facial nerve."],
        p_eca: ["External carotid artery", "The **deepest** structure; it **is inside** the parotid and ends there as the maxillary and superficial temporal arteries."],
        p_at: ["Auriculotemporal nerve at the gland", "Passes through the upper part and emerges from the **upper border** (not the anterior border), carrying the postganglionic secretomotor fibres."],
        p_surf: ["Surfaces of the parotid", "Superficial, **anteromedial** (ramus, masseter, medial pterygoid), **posteromedial** (mastoid, sternomastoid, posterior digastric, styloid) and superior (meatus, TMJ): not two surfaces only."],
        p_mass: ["Masseter", "The duct crosses it (and can be rolled against it when clenched); the duct does **not** pierce it."],
        p_duct: ["Parotid (Stensen's) duct", "Leaves the anterior border, crosses the masseter below the transverse facial artery, **pierces the buccinator**."],
        p_bucc: ["Buccinator", "The duct pierces it (not the masseter)."],
        p_open: ["Opening of the parotid duct", "It opens in the **mouth's vestibule, facing the upper (maxillary) 2nd molar** (not the 3rd molar, not the floor of the mouth: the sublingual caruncle is the submandibular duct's)."],
        s_isn: ["Inferior salivatory nucleus", "Start of the parotid's parasympathetic path."],
        s_ix: ["Glossopharyngeal nerve and its tympanic branch", "The parotid's parasympathetics come from **IX**, not the facial nerve."],
        s_lpn: ["Lesser petrosal nerve", "Carries the parotid's preganglionic fibres to the otic ganglion. Not the greater (lacrimal, VII), not the deep (sympathetic), not an 'external petrosal'."],
        s_otic: ["Otic ganglion", "Where the fibres synapse."],
        s_atn: ["Auriculotemporal nerve", "Carries the postganglionic fibres into the gland."],
        s_pain: ["Pain of parotitis", "The tight capsule (great auricular) and the gland (auriculotemporal): pain worse on chewing."],
        m_cor: ["Coronoid process", "Insertion of the **temporalis**."],
        m_cond: ["Condyle (head of the mandible)", "Articulates with the mandibular fossa; its neck receives the lateral pterygoid."],
        m_temp: ["Temporalis", "From the temporal fossa to the coronoid process."],
        m_mass2: ["Masseter", "Zygomatic arch → lateral ramus and angle."],
        m_lpt: ["Lateral pterygoid", "Pulls the condyle and disc forward: the opener."],
        m_temp_c: ["Temporalis: facts", "Inserts into the **coronoid process** (and the front of the ramus), not the mastoid, condyle or angle; elevates; its **posterior fibres retract** the mandible; deep temporal nerves."],
        m_mass_c: ["Masseter: facts", "Zygomatic arch → lateral surface of the ramus and angle; elevates; masseteric nerve."],
        m_lpt_c: ["Lateral pterygoid: facts", "Two heads → the **pterygoid fovea on the neck** and the **disc and capsule**; **depresses (opens)** and **protrudes**; with the medial pterygoid of the same side moves the chin to the opposite side."],
        m_mpt_c: ["Medial pterygoid: facts", "Deep head from the **medial surface of the lateral pterygoid plate**; → medial surface of ramus and angle; elevates, helps protrude; nerve to medial pterygoid (main trunk)."],
        tmj: ["Temporomandibular joint", "**Synovial, condylar** (modified hinge), not a simple hinge; the disc makes an upper (gliding) and a lower (hinge) compartment; opening is mainly the **lateral pterygoids**; it dislocates **anteriorly**, in front of the articular eminence (not posteriorly); reduce by pressing down and back."],
        tmj_n: ["Nerves of the TMJ and the ear drum", "The **auriculotemporal** nerve supplies the TMJ capsule and the **outer** surface of the drum; the inner surface is **IX**. The mastoid process receives the **sternomastoid**."],
      },
      al: {
        pgl: ["parotid gland", "parotid salivary gland", "parotid", "anteromedial and posteromedial surfaces", "malignant parotid tumour"],
        p_fn: ["facial nerve inside", "branches of the facial nerve"],
        p_rmv: ["retromandibular vein"],
        p_eca: ["external carotid artery", "~eca"],
        p_at: ["upper border of the gland"],
        p_surf: ["surfaces", "anteromedial", "posteromedial"],
        p_duct: ["parotid duct", "stensen", "stensens duct"],
        p_bucc: ["pierces the buccinator", "pierces the masseter"],
        p_open: ["upper 2nd molar", "upper second molar", "second maxillary molar", "upper 3rd molar", "3rd molar tooth", "vestibule of the mouth", "floor of the mouth", "sublingual fold", "sublingual caruncle"],
        s_isn: ["inferior salivatory nucleus"],
        s_ix: ["tympanic branch", "jacobson"],
        s_lpn: ["external petrosal", "parasympathetic supply of the parotid"],
        s_otic: ["otic"],
        s_pain: ["parotitis", "mumps"],
        m_cor: ["coronoid process", "coronoid"],
        m_cond: ["condyle", "head of the mandible", "neck of the mandible", "condylar neck"],
        m_temp: ["temporalis", "temporalis muscle"],
        m_lpt_c: ["opening of the mouth", "depression of the mandible", "protrusion of the mandible"],
        m_temp_c: ["retraction of the mandible", "~mastoid process"],
        tmj: ["temporomandibular joint", "tmj", "synovial joint of hinge variety", "hinge", "dislocated posteriorly", "dislocated anteriorly", "articular disc", "articular eminence"],
        tmj_n: ["capsule of the tmj", "outer surface of the tympanic membrane"],
      },
      drill: ["p_fn", "p_rmv", "p_eca", "p_duct", "p_open", "p_bucc", "s_lpn", "s_otic", "s_atn", "m_cor", "tmj"],
      sims: [
        { id: "inside", label: "Inside the gland", on: ["pgl", "p_fn", "p_rmv", "p_eca", "p_at", "p_surf"], info: "Superficial → deep: **facial nerve**, **retromandibular vein**, **external carotid**. Auriculotemporal leaves the upper border." },
        { id: "duct", label: "Duct", on: ["p_mass", "p_duct", "p_bucc", "p_open"], info: "Across the masseter, **through the buccinator**, into the vestibule opposite the **upper 2nd molar**." },
        { id: "secr", label: "Secretomotor", on: ["s_isn", "s_ix", "s_lpn", "s_otic", "s_atn", "s_pain"], info: "Inferior salivatory → **IX** → tympanic → **lesser petrosal** → **otic** → **auriculotemporal**." },
        { id: "jaw", label: "Jaw and TMJ", on: ["m_cor", "m_cond", "m_temp", "m_mass2", "m_lpt", "m_temp_c", "m_mass_c", "m_lpt_c", "m_mpt_c", "tmj", "tmj_n"], info: "Temporalis → **coronoid**; lateral pterygoid **opens**; TMJ is **synovial condylar** and dislocates **anteriorly**." },
      ],
      secs: { "an-parotid#0": "inside", "an-parotid#1": "inside", "an-parotid#2": "duct", "an-parotid#3": "secr", "an-mastication#0": "jaw", "an-mastication#1": "jaw", "an-tmj#0": "jaw" },
      rules: [
        [/parotid duct|opens into/i, "duct"],
        [/parasympathetic supply of the parotid|secretomotor/i, "secr"],
        [/temporomandibular|temporalis|pterygoid|masseter|mastication/i, "jaw"],
        [/parotid/i, "inside"],
      ],
    });
  })();

  /* ═══════════════ 4. CORTICAL AREAS AND THE APHASIAS ═══════════════ */
  (function () {
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">CORTICAL AREAS BY NUMBER · SYMPTOM → AREA · THE APHASIAS</text>';
      s += box(4, 22, 300, 214) + T(154, 36, "LATERAL SURFACE (front ←)", "sm mut");
      s += '<path d="M24 128 C24 70 90 44 160 44 C236 44 290 82 290 132 C290 176 262 200 226 204 C204 212 176 206 160 196 C130 208 80 204 56 188 C34 172 24 152 24 128 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
      const area = (id, d, c, r, lab, lx, ly) => pf(id, d, c, r) + T(lx, ly, lab, "sm");
      s += area("a4b", "M140 46 L154 46 L128 126 L114 124 Z", B, BR, "4", 134, 90);
      s += area("a6b", "M110 50 L138 46 L114 122 L92 116 Z", "#6f9bff", "#2a3a6a", "6", 112, 86);
      s += area("a8b", "M84 58 L106 52 L92 92 L72 90 Z", "#8a9ab0", "#3a4a5e", "8", 88, 76);
      s += area("a312", "M156 46 L170 48 L144 128 L130 126 Z", G, GR, "3,1,2", 150, 70);
      s += area("a57", "M172 50 L214 62 L190 104 L162 96 Z", "#2f8a5c", "#1e4a36", "5,7", 186, 80);
      s += area("a40", "M190 106 L218 96 L236 118 L214 136 Z", Y, YR, "40", 212, 120);
      s += area("a39", "M220 96 L254 104 L252 136 L238 138 L222 118 Z", "#ffb86b", OR, "39", 240, 120);
      s += area("a4445", "M60 120 L88 114 L94 140 L64 146 Z", R, RR, "44,45", 78, 134);
      s += area("a4142", "M150 140 L180 136 L184 150 L154 154 Z", P, PR, "41,42", 167, 149);
      s += area("a22", "M184 150 L230 140 L236 164 L190 172 Z", "#d6b3ff", "#3a3060", "22", 210, 160);
      s += area("a1819", "M254 108 L284 118 L284 168 L256 170 Z", "#ff8fa8", RR, "18,19", 270, 142);
      s += area("a17l", "M284 122 L290 128 L290 160 L284 166 Z", "#ff5d7a", RR, "", 286, 144);
      s += T(290, 184, "17 at the pole", "sm", "end");
      // medial inset
      s += box(4, 240, 300, 88) + T(154, 252, "MEDIAL SURFACE", "sm mut");
      s += '<path d="M24 300 C24 272 80 258 150 258 C220 258 284 272 284 300 C284 318 250 326 150 326 C60 326 24 318 24 300 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
      s += area("a_pcl", "M130 260 L176 260 L172 280 L134 280 Z", "#66e9ff", BR, "paracentral", 153, 274);
      s += area("a17m", "M232 290 L280 286 L280 300 L234 304 Z", "#ff5d7a", RR, "17", 256, 298);
      s += area("a28", "M100 306 L136 304 L136 318 L102 320 Z", "#ffd166", YR, "28", 118, 316);
      // symptom → number
      s += box(310, 22, 226, 306) + T(423, 36, "SYMPTOM → AREA", "sm mut");
      const rows = [
        ["s_gen", "loss of GENERAL SENSATION, one side", "3, 1, 2 (opposite)", G, GR],
        ["s_inc", "INCONTINENCE of urine and stool", "PARACENTRAL lobule", B, BR],
        ["s_col", "cannot discriminate COLOURS", "18, 19 (not 17)", "#ff8fa8", RR],
        ["s_tai", "TAILOR: fine hand work lost", "4 (hand area)", B, BR],
        ["s_talk", "understands, cannot talk", "44, 45 (Broca)", R, RR],
        ["s_und", "cannot understand speech", "22 (Wernicke)", P, PR],
        ["s_hear", "hearing (primary)", "41, 42", P, PR],
        ["s_read", "reading, writing (alexia, agraphia)", "39, 40 (angular, supramarginal)", Y, YR],
        ["s_smell", "smell", "28 (entorhinal)", Y, YR],
        ["s_blind", "half-field blindness", "17 (calcarine)", R, RR],
        ["s_plan", "planning movement patterns", "6 (premotor)", "#6f9bff", "#2a3a6a"],
        ["s_ster", "object by touch (astereognosis)", "5, 7 association", G, GR],
      ];
      rows.forEach(([id, a, b, c, r], i) => (s += cell(id, 316, 42 + i * 23.5, 214, 21, [a, "→ " + b], c, r)));
      // aphasias
      s += box(4, 334, 532, 128) + T(270, 348, "THE APHASIAS (dominant = left in ~95% of right- and ~70% of left-handers)", "sm mut");
      s += cell("ap_broca", 10, 354, 170, 48, ["BROCA (44, 45) · MOTOR,", "non-fluent: UNDERSTANDS, slow", "effortful speech, words not", "formed · NO muscle paralysis"], R, RR);
      s += cell("ap_wern", 184, 354, 170, 48, ["WERNICKE (22) · SENSORY,", "fluent: fails to understand", "spoken AND written words;", "articulation normal"], P, PR);
      s += cell("ap_cond", 358, 354, 172, 48, ["CONDUCTION (arcuate): fluent,", "understands, cannot REPEAT ·", "GLOBAL (large left MCA): all", "lost"], B, BR);
      s += cell("ap_ang", 10, 406, 170, 50, ["ANGULAR GYRUS (39): ALEXIA", "+ AGRAPHIA · EXNER's centre", "(writing): agraphia, not", "motor aphasia"], Y, YR);
      s += cell("ap_dys", 184, 406, 170, 50, ["DYSARTHRIA = speech MUSCLES", "(cerebellar, bulbar) with", "normal language: not", "aphasia"], "#cfd8e3", "#3a4a5e");
      s += cell("ap_dom", 358, 406, 172, 50, ["DOMINANCE: most LEFT-handers", "still speak from the LEFT", "hemisphere; the right one:", "prosody, music, faces"], G, GR);
      return s;
    };
    A.scene("areas", {
      title: "Cortical areas by number · symptom → area · the aphasias",
      vb: "0 0 540 466",
      svg,
      intro: "The numbered areas on the lateral and medial surfaces, then the **symptom → area** pairs the exam asks, then the **aphasias**: Broca's patients understand but cannot speak fluently; Wernicke's patients speak fluently but do not understand.",
      parts: {
        a4b: ["Area 4 (primary motor)", "Precentral gyrus; the hand has a large area: a lesion stops fine skilled hand work (the tailor)."],
        a6b: ["Area 6 (premotor)", "Plans the pattern of movements."],
        a8b: ["Area 8 (frontal eye field)", "Voluntary eye movements."],
        a312: ["Areas 3, 1, 2 (primary somatosensory)", "Postcentral gyrus: general sensation from the opposite half of the body."],
        a57: ["Areas 5, 7 (somatosensory association)", "Superior parietal lobule: recognising objects by touch (stereognosis)."],
        a40: ["Area 40 (supramarginal gyrus)", "Reading, writing, interpreting sensation."],
        a39: ["Area 39 (angular gyrus)", "Reading (visual → Wernicke); a lesion → alexia and agraphia."],
        a4445: ["Areas 44, 45 (Broca's)", "Inferior frontal gyrus of the dominant hemisphere: motor speech."],
        a4142: ["Areas 41, 42 (primary auditory)", "Heschl's gyrus: hearing. The MCA supplies it."],
        a22: ["Area 22 (Wernicke's, auditory association)", "Understanding speech."],
        a1819: ["Areas 18, 19 (visual association)", "Interpret the image, including **colour**: a lesion → loss of colour discrimination while vision itself remains."],
        a17l: ["Area 17 at the occipital pole", "Macular vision."],
        a_pcl: ["Paracentral lobule", "Medial surface around the upper end of the central sulcus: leg, perineum, **bladder and rectum** control → a lesion causes **incontinence**."],
        a17m: ["Area 17 (primary visual)", "Around the calcarine sulcus: receives the image; a lesion → blindness in the opposite half-field."],
        a28: ["Area 28 (entorhinal)", "Part of the olfactory (smell) cortex."],
        s_gen: ["Loss of general sensation on one side", "Areas **3, 1, 2** of the opposite hemisphere."],
        s_inc: ["Incontinence of urine and stool", "The **paracentral lobule** (not a lateral-surface area such as the parietal association area)."],
        s_col: ["Cannot discriminate colours", "Visual association areas **18, 19**; not 17 (that gives field loss), not 3,1,2 or 41,42."],
        s_tai: ["A tailor cannot do her fine work", "Primary motor **area 4** (large hand area); not 39/40, 28 or 41/42."],
        s_talk: ["Understands but cannot talk", "**Broca's** area 44, 45."],
        s_und: ["Cannot understand speech", "Area **22** (Wernicke's)."],
        s_hear: ["Primary hearing", "Areas **41, 42**."],
        s_read: ["Reading and writing", "Areas **39, 40** (angular and supramarginal gyri)."],
        s_smell: ["Smell", "Area **28** (entorhinal)."],
        s_blind: ["Half-field blindness", "Area **17**."],
        s_plan: ["Planning movement patterns", "Area **6** (premotor)."],
        s_ster: ["Recognising objects by touch", "Somatosensory association areas **5, 7** (parietal association)."],
        ap_broca: ["Broca's (motor) aphasia", "The person **understands** written and spoken words but speaks **slowly, with great effort**, unable to form whole words correctly: a failure of **coordination** of the speech muscles, **not paralysis** of the larynx, pharynx, lips or tongue. Area 4 lesions paralyse; Exner's centre gives agraphia."],
        ap_wern: ["Wernicke's (sensory) aphasia", "Lesion of the **general interpretative area** (posterior 22 + angular gyrus): **failure to understand spoken and written words**, fluent meaningless speech; **articulation is not affected**. It is temporal, not frontal."],
        ap_cond: ["Conduction and global aphasia", "**Conduction** (arcuate fasciculus): fluent, understands, cannot repeat. **Global** (large left MCA stroke): all language lost."],
        ap_ang: ["Angular gyrus and Exner's centre", "Angular gyrus → **alexia and agraphia**; **Exner's centre** (writing) → agraphia, not motor aphasia."],
        ap_dys: ["Dysarthria is not aphasia", "Weak or incoordinated speech **muscles** (cerebellar scanning speech, bulbar palsy) with normal language."],
        ap_dom: ["Hemispheric dominance", "Language is in the **left** hemisphere in ~95% of right-handers and ~70% of **left-handers** (only a minority are right-dominant)."],
      },
      al: {
        a4b: ["area 4", "primary motor area", "motor area 4"],
        a6b: ["area 6", "premotor area", "premotor cortex"],
        a8b: ["area 8", "frontal eye field"],
        a312: ["areas 3 1 2", "area 3 1 2", "3 1 2"],
        a57: ["areas 5 7", "parietal association area", "somatosensory association"],
        a40: ["area 40", "supramarginal", "supramarginal gyrus", "areas 40 39", "areas 39 40"],
        a39: ["area 39", "angular gyrus"],
        a4445: ["areas 44 45", "area 44", "broca s area", "broca area", "brocas area"],
        a4142: ["areas 41 42", "area 41", "primary auditory area", "auditory area"],
        a22: ["area 22", "auditory association area", "auditory association"],
        a1819: ["areas 18 19", "area 18", "area 19", "visual association area", "visual association areas"],
        a_pcl: ["paracentral lobule", "incontinence"],
        a17m: ["area 17", "primary visual area"],
        a28: ["area 28", "entorhinal"],
        s_col: ["discriminate the colors", "discriminate colours", "colour discrimination"],
        s_tai: ["tailor"],
        s_gen: ["loss of general sensation"],
        ap_broca: ["motor aphasia", "broca s aphasia", "brocas aphasia", "expressive aphasia", "paralysis of speech muscles", "paralysis of the muscles of the larynx and pharynx", "great difficulty", "speak whole words"],
        ap_wern: ["sensory aphasia", "wernicke s aphasia", "receptive aphasia", "general interpretative area", "failure to understand written words", "failure to understand spoken words", "failure of articulate speech"],
        ap_cond: ["conduction aphasia", "global aphasia"],
        ap_ang: ["exner", "exner s center", "exners center", "exner s centre", "alexia", "agraphia"],
        ap_dys: ["dysarthria"],
        ap_dom: ["left handed", "leit handed", "right hemisphere", "dominant hemisphere", "left hemisphere"],
      },
      drill: ["a4b", "a312", "a4445", "a22", "a4142", "a1819", "a17m", "a_pcl", "a28", "a39", "ap_broca", "ap_wern"],
      sims: [
        { id: "map", label: "The numbers", on: ["a4b", "a6b", "a8b", "a312", "a57", "a40", "a39", "a4445", "a4142", "a22", "a1819", "a17l", "a_pcl", "a17m", "a28"], info: "Frontal 4, 6, 8, 44–45; parietal 3-1-2, 5-7, 39, 40; temporal 41–42, 22; occipital 17, 18–19; medial: paracentral lobule, 28." },
        { id: "sym", label: "Symptom → area", on: ["s_gen", "s_inc", "s_col", "s_tai", "s_talk", "s_und", "s_hear", "s_read", "s_smell", "s_blind", "s_plan", "s_ster"], info: "General sensation **3,1,2**; incontinence **paracentral**; colour **18,19**; tailor **4**; talk **44,45**; understand **22**." },
        { id: "aph", label: "Aphasias", on: ["ap_broca", "ap_wern", "ap_cond", "ap_ang", "ap_dys", "ap_dom", "a4445", "a22", "a39"], info: "**Broca**: understands, cannot speak fluently, no paralysis. **Wernicke**: fluent, does not understand. **Conduction**: cannot repeat." },
      ],
      secs: { "an-sulci-gyri+functional-areas-which-area-which-defici": "sym", "ph-speech+the-language-circuit-and-the-other-aphas": "aph" },
      rules: [
        [/aphasia|speech|broca|wernicke/i, "aph"],
        [/which of the following areas|areas? \d/i, "sym"],
      ],
    });
  })();

  /* ═══════════════ 5. AROUSAL AND THE HYPOTHALAMUS ═══════════════ */
  (function () {
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">AROUSAL · THE RETICULAR ACTIVATING SYSTEM · THE HYPOTHALAMUS</text>';
      s += box(4, 22, 300, 250) + T(154, 36, "BRAINSTEM → THALAMUS → CORTEX", "sm mut");
      s += '<path d="M30 70 C30 46 90 40 150 40 C220 40 290 52 290 80 C290 100 250 108 150 108 C80 108 30 96 30 70 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' + T(154, 62, "cerebral CORTEX", "sm mut");
      s += dot("r_il", 154, 120, 9, P, PR) + T(170, 124, "intralaminar thalamus", "sm", "start");
      s += '<path d="M122 132 L186 132 L182 250 L126 250 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
      s += pf("r_exc", "M128 138 L180 138 L178 196 L130 196 Z", G, GR) + T(154, 160, "RAS", "sm") + T(154, 172, "midbrain +", "sm") + T(154, 182, "upper pons", "sm");
      s += pf("r_inh", "M130 206 L178 206 L176 244 L132 244 Z", R, RR) + T(154, 222, "MEDULLA", "sm") + T(154, 232, "inhibitory", "sm");
      s += ps("r_up", "M154 138 L154 130 M154 110 L154 96 M154 96 C120 90 90 84 70 78 M154 96 C190 90 220 84 240 78", G, GR, 2.4);
      s += ps("r_down", "M178 190 C214 200 226 226 228 246", G, GR, 2) + ps("r_idown", "M132 240 C110 250 104 258 100 266", R, RR, 2);
      s += T(232, 256, "→ anterior horn", "sm", "start") + T(232, 266, "(tone ↑)", "sm mut", "start") + T(96, 266, "→ spinal cord ⊣", "sm", "end");
      s += ps("r_in", "M40 170 C80 172 110 168 128 166 M40 186 L128 180", Y, YR, 1.8) + T(40, 160, "sensory input", "sm", "start") + T(40, 198, "pain, proprioception", "sm mut", "start");
      // state scale
      s += box(4, 276, 300, 66) + T(154, 290, "RAS ACTIVITY → STATE", "sm mut");
      const st = [["st_coma", "COMA", "RAS damaged", R, RR], ["st_sleep", "SLEEP", "activity low", P, PR], ["st_drow", "DROWSY", "falling", Y, YR], ["st_wake", "AWAKE", "RAS active", G, GR]];
      st.forEach(([id, a, b, c, r], i) => (s += cell(id, 10 + i * 73, 298, 69, 38, [a, b], c, r)));
      // chemistry
      s += box(310, 22, 226, 170) + T(423, 36, "WHO KEEPS YOU AWAKE", "sm mut");
      const ch = [["c_na", "locus coeruleus: NORADRENALINE (vigilance)"], ["c_5ht", "raphe: SEROTONIN (sleep, mood, pain)"], ["c_da", "SN / VTA: DOPAMINE (movement, reward)"], ["c_ach", "basal forebrain (Meynert): ACh; pons: REM"], ["c_hist", "hypothalamus: HISTAMINE, OREXIN (awake)"], ["c_drug", "EPHEDRINE, amphetamine EXCITE; anaesthetics depress"]];
      ch.forEach(([id, t], i) => (s += cell(id, 316, 42 + i * 24.5, 214, 22, [t], i === 5 ? O : B, i === 5 ? OR : BR)));
      // hypothalamus
      s += box(310, 196, 226, 146) + T(423, 210, "HYPOTHALAMUS DOES", "sm mut");
      const hy = [["h_temp", "TEMPERATURE: anterior heat loss, posterior gain"], ["h_endo", "ENDOCRINE: releasing hormones; ADH, oxytocin"], ["h_food", "FOOD: lateral hunger, VENTROMEDIAL satiety"], ["h_water", "WATER: thirst, osmoreceptors (supraoptic, PVN)"], ["h_clock", "CLOCK: suprachiasmatic; autonomic; emotion"], ["h_not", "NOT motor function"]];
      hy.forEach(([id, t], i) => (s += cell(id, 316, 216 + i * 20.5, 214, 18, [t], i === 5 ? R : Y, i === 5 ? RR : YR)));
      return s;
    };
    A.scene("ras", {
      title: "Arousal · the reticular activating system, its chemistry, and what the hypothalamus does",
      vb: "0 0 540 346",
      svg,
      intro: "Sensory input (especially **pain** and **proprioception**) drives the **RAS** in the upper pons and midbrain → **intralaminar thalamus** → the whole cortex: that is **wakefulness**. The **medullary** inhibitory area acts **down on the spinal cord**. Right: the transmitter systems, and what the **hypothalamus** controls (and does not).",
      parts: {
        r_il: ["Intralaminar thalamic nuclei", "Relay the RAS's drive diffusely to the cortex."],
        r_exc: ["Reticular activating system (excitatory part)", "Mainly in the **upper pons and midbrain**; discharges to **both the cortex** (arousal) **and the anterior horn cells** (tone)."],
        r_inh: ["Medullary inhibitory area", "Ventromedial medulla: inhibits **down to the spinal anterior horn cells**, not the whole cerebral cortex."],
        r_up: ["Ascending activation", "RAS → intralaminar thalamus → diffuse cortical activation."],
        r_down: ["Descending facilitation", "RAS → anterior horn cells: tone ↑."],
        r_idown: ["Descending inhibition", "Medulla → spinal cord."],
        r_in: ["Sensory input to the RAS", "Collaterals of all sensory pathways, especially **pain**, and **proprioceptors** (moving keeps you awake)."],
        st_coma: ["Coma", "RAS damage (a brainstem lesion)."],
        st_sleep: ["Sleep", "Comes with **reduced** RAS activity."],
        st_drow: ["Drowsiness", "Low RAS activity."],
        st_wake: ["Wakefulness", "**Activity of the RAS produces awakening** (arousal, alertness)."],
        c_na: ["Noradrenaline", "Locus coeruleus: wakefulness, vigilance."],
        c_5ht: ["Serotonin", "Raphe nuclei: sleep, mood, pain control."],
        c_da: ["Dopamine", "Substantia nigra / VTA: movement, reward."],
        c_ach: ["Acetylcholine", "Basal forebrain nucleus of Meynert (cortex); the pons for REM."],
        c_hist: ["Histamine and orexin", "Hypothalamus: wakefulness (loss of orexin = narcolepsy)."],
        c_drug: ["Drugs and the RAS", "Sympathomimetics (**ephedrine**, amphetamine) and adrenaline **excite** RAS neurons; anaesthetics depress them."],
        h_temp: ["Temperature regulation", "Anterior hypothalamus → heat loss; posterior → heat gain (lesion → poikilothermia)."],
        h_endo: ["Endocrine function", "Releasing/inhibiting hormones to the anterior pituitary; ADH and oxytocin to the posterior pituitary."],
        h_food: ["Food intake", "Lateral = feeding centre; **ventromedial = satiety** (its lesion → overeating)."],
        h_water: ["Water intake", "Thirst and ADH (supraoptic, paraventricular)."],
        h_clock: ["Clock, autonomic, emotion", "Suprachiasmatic nucleus; anterior parasympathetic, posterior sympathetic; rage and fear with the limbic system."],
        h_not: ["Not hypothalamic", "**Motor function** (motor cortex, basal ganglia, cerebellum)."],
      },
      al: {
        r_exc: ["reticular activating system", "ras", "activity of ras", "excitatory part", "pontine region", "reticular formation"],
        r_inh: ["inhibitory part", "medullary inhibitory"],
        r_in: ["proprioceptors", "sensory signals"],
        st_coma: ["~coma"],
        st_sleep: ["~sleep"],
        st_drow: ["~drowsiness"],
        st_wake: ["wakefulness", "awakening", "arousal"],
        c_na: ["locus coeruleus", "~norepinephrine", "~noradrenaline"],
        c_5ht: ["raphe", "~serotonin"],
        c_ach: ["nucleus basalis", "meynert", "magnocellular fore brain", "magnocellular forebrain"],
        c_hist: ["orexin", "histamine"],
        c_drug: ["ephedrine", "amphetamine", "inhibited by ephedrine"],
        h_temp: ["temperature regulation"],
        h_endo: ["endocrine function"],
        h_food: ["control of food intake", "food intake", "satiety", "feeding center", "feeding centre"],
        h_water: ["water intake", "thirst"],
        h_not: ["functions of hypothalamus", "motor function"],
      },
      drill: ["r_exc", "r_inh", "r_il", "st_wake", "c_na", "c_5ht", "c_drug", "h_temp", "h_food", "h_not"],
      sims: [
        { id: "wake", label: "▶ Waking up", on: ["r_in", "r_exc", "r_up", "r_il", "st_wake", "r_down"], info: "Sensory input (pain, proprioception) → **RAS** (pons, midbrain) → intralaminar thalamus → cortex: **wakefulness**; and down to the anterior horns: tone." },
        { id: "states", label: "States", on: ["st_coma", "st_sleep", "st_drow", "st_wake"], info: "RAS damaged → **coma**; low → drowsiness, sleep; active → **awake**." },
        { id: "hypo", label: "Hypothalamus", on: ["h_temp", "h_endo", "h_food", "h_water", "h_clock", "h_not"], info: "Temperature, endocrine, food, water, clock, autonomic, emotion; **not motor function**." },
      ],
      secs: { "ph-arousal#0": "wake", "ph-arousal#1": "hypo", "ph-arousal+arousal-chemistry-and-the-hypothalamic-c": "wake" },
      rules: [
        [/hypothalamus/i, "hypo"],
        [/reticular|arousal|\bras\b/i, "wake"],
      ],
    });
  })();

  /* ═══════════════ 6. PHARYNX, TONSIL AND THE CERVICAL PLEXUS ═══════════════ */
  (function () {
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">PHARYNX · ITS GAPS · THE TONSILLAR FOSSA · CERVICAL PLEXUS</text>';
      // A. side view: three parts, open in front, constrictors behind, vertebral levels
      s += box(4, 22, 300, 280) + T(110, 36, "SIDE VIEW · front ←", "sm mut");
      s += '<path d="M60 44 L300 44" stroke="#8fa6c0" stroke-width="2" pointer-events="none"/>' + T(262, 41, "base of skull", "sm mut", "end");
      s += T(58, 72, "NASAL CAVITY →", "sm", "end") + T(58, 120, "MOUTH →", "sm", "end") + T(58, 166, "LARYNX →", "sm", "end");
      s += cell("np", 104, 48, 96, 44, ["NASOPHARYNX", "opens: choanae", "sensory: V2"], B, BR);
      s += cell("op", 104, 96, 96, 44, ["OROPHARYNX", "opens: isthmus", "sensory: IX"], G, GR);
      s += cell("lp", 104, 144, 96, 40, ["LARYNGOPHARYNX", "opens: laryngeal inlet", "sensory: X"], Y, YR);
      s += cell("oes", 124, 188, 76, 30, ["OESOPHAGUS", "from C6"], "#cfd8e3", "#3a4a5e");
      s += cell("tra", 62, 188, 56, 30, ["TRACHEA", "from C6"], "#cfd8e3", "#3a4a5e");
      s += ps("w_def", "M98 48 L98 184", R, "#6a3a4a", 3, ' stroke-dasharray="6 5"');
      s += T(98, 234, "front wall DEFICIENT at all three", "sm", "middle") + T(98, 244, "levels (the red line)", "sm mut", "middle");
      // constrictors, stacked like cups (the lower one outside the upper)
      s += pf("sc", "M204 52 L236 52 L236 104 L204 104 Z", O, OR) + T(220, 80, "SUP.", "sm");
      s += pf("mc", "M204 102 L244 102 L244 148 L204 148 Z", O, OR) + T(224, 128, "MID.", "sm");
      s += pf("ic", "M204 146 L252 146 L252 190 L204 190 Z", O, OR) + T(228, 170, "INF.", "sm");
      const gap = (id, y, n) => dot(id, 244 - (n === 1 ? 8 : 0), y, 6, "#ffffff", "#5a6a7a") + T(244 - (n === 1 ? 8 : 0), y + 3, String(n), "sm dk");
      s += gap("g1", 48, 1) + gap("g2", 103, 2) + gap("g3", 147, 3) + gap("g4", 196, 4);
      // vertebral levels
      const V = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "T1", "T2"];
      V.forEach((v, i) => {
        const y = 46 + i * 23,
          id = { C2: "v_c2", C4: "v_c4", C6: "v_c6", T2: "v_t2" }[v];
        s += id ? '<rect class="pf" data-p="' + id + '" x="266" y="' + y + '" width="30" height="20" rx="4" style="--c:#d9ff43;--r:#2a3a4e"/>' : '<rect x="266" y="' + y + '" width="30" height="20" rx="4" fill="#1a2b40" stroke="#3a5070" pointer-events="none"/>';
        s += T(281, y + 13, v, "sm");
      });
      s += cell("lev", 10, 256, 288, 42, ["LEVELS: C2 axis · C4 upper border of the thyroid cartilage,", "carotid bifurcation · C6 CRICOID: pharynx → oesophagus,", "larynx → trachea · T2 jugular notch (already the thorax)"], "#d9ff43", "#1e2e14");
      // B. open mouth: pillars, tonsil, isthmus
      s += box(310, 22, 226, 280) + T(423, 36, "TONSILLAR FOSSA (mouth open)", "sm mut");
      s += '<rect x="330" y="50" width="186" height="164" rx="16" fill="#3a1f2a" stroke="#6a3a4a" pointer-events="none"/>';
      s += pf("spal", "M330 50 L516 50 L516 70 C470 70 450 78 436 90 C432 104 414 104 410 90 C396 78 376 70 330 70 Z", "#ff8fa8", RR) + T(423, 62, "soft palate + uvula", "sm");
      s += pf("pgf", "M338 72 C348 98 350 150 342 196 L334 196 C342 150 340 100 330 74 Z M508 72 C498 98 496 150 504 196 L512 196 C504 150 506 100 516 74 Z", G, GR);
      s += pf("ppf", "M368 80 C376 110 378 150 372 190 L364 190 C370 150 368 112 360 84 Z M478 80 C470 110 468 150 474 190 L482 190 C476 150 478 112 486 84 Z", B, BR);
      s += pf("ton", "M346 110 C360 104 364 132 360 160 C356 176 344 170 344 150 C344 134 342 118 346 110 Z M500 110 C486 104 482 132 486 160 C490 176 502 170 502 150 C502 134 504 118 500 110 Z", Y, YR);
      s += pf("dtg", "M334 198 C360 176 486 176 512 198 L512 214 L334 214 Z", "#ff9f43", OR) + T(423, 208, "dorsum of the tongue", "sm");
      s += '<path class="ps" data-p="isth" d="M342 196 C340 150 344 100 360 84 C400 74 446 74 486 84 C502 100 506 150 504 196" style="--c:#ffffff;--r:#8a9ab0;--w:1.2" stroke-dasharray="3 3"/>';
      s += T(423, 140, "posterior wall", "sm mut") + T(423, 150, "(oropharynx)", "sm mut");
      s += T(324, 232, "palatoglossal fold = ANTERIOR pillar (front)", "sm", "start") + T(324, 244, "palatopharyngeal fold = POSTERIOR pillar", "sm", "start") + T(324, 256, "tonsil between them · isthmus = the dashed ring", "sm", "start");
      s += cell("bed", 316, 264, 214, 34, ["BED: SUPERIOR constrictor (then IX, facial a.)", "blood: tonsillar br. of FACIAL a. · lymph:", "JUGULODIGASTRIC node"], Y, YR);
      // C. nerves and the four gaps
      s += box(4, 306, 532, 166) + T(270, 320, "NERVES · THE FOUR GAPS · CERVICAL PLEXUS", "sm mut");
      s += cell("g1", 10, 326, 256, 24, ["GAP 1 (skull base – superior): auditory tube,", "levator palati, ascending palatine artery"], "#ffffff", "#2a3a4e");
      s += cell("g2", 272, 326, 258, 24, ["GAP 2 (superior – middle):", "STYLOPHARYNGEUS + glossopharyngeal (IX)"], "#ffffff", "#2a3a4e");
      s += cell("g3", 10, 354, 256, 24, ["GAP 3 (middle – inferior): INTERNAL laryngeal", "nerve + SUPERIOR laryngeal artery"], "#ffffff", "#2a3a4e");
      s += cell("g4", 272, 354, 258, 24, ["GAP 4 (below the inferior): RECURRENT laryngeal", "nerve + INFERIOR laryngeal artery"], "#ffffff", "#2a3a4e");
      s += cell("mot", 10, 382, 256, 34, ["MOTOR: pharyngeal plexus (X) → every constrictor,", "palatopharyngeus, salpingopharyngeus; the exception:", "STYLOPHARYNGEUS (IX)"], O, OR);
      s += cell("phr", 272, 382, 258, 24, ["PHRENIC: C3, 4, 5 on scalenus anterior → diaphragm", "(C4 + C5 are not the ansa)"], B, BR);
      s += cell("ans", 10, 420, 256, 34, ["ANSA CERVICALIS: superior root C1 (riding with XII),", "INFERIOR root C2 + C3 → sternohyoid, sternothyroid,", "omohyoid (thyrohyoid, geniohyoid: C1 via XII)"], G, GR);
      s += cell("cut", 272, 410, 258, 24, ["CUTANEOUS (nerve point): lesser occipital C2,", "great auricular + transverse cervical C2–3, supraclav. C3–4"], P, PR);
      s += cell("xi", 272, 438, 258, 24, ["SPINAL ACCESSORY: sternomastoid + trapezius;", "superficial in the posterior triangle"], R, RR);
      return s;
    };
    A.scene("pharynx", {
      title: "Pharynx, its gaps and nerves · the tonsillar fossa · the ansa cervicalis and cervical plexus",
      vb: "0 0 540 476",
      svg,
      intro: "Left: the pharynx is **open in front** at every level (nasal cavity, mouth, larynx) and closed behind by the **three constrictors**, stacked like cups, with four gaps; it ends at **C6** (cricoid). Right: the tonsil sits between the **palatoglossal** (anterior) and **palatopharyngeal** (posterior) folds. Bottom: nerves, gaps and the cervical plexus.",
      parts: {
        np: ["Nasopharynx", "Behind the nasal cavity, open to it through the choanae; the auditory tube opens in its side wall. Sensory: **V2** (pharyngeal branch of the pterygopalatine ganglion)."],
        op: ["Oropharynx", "Behind the mouth, open to it through the **oropharyngeal isthmus**. Sensory: **IX** (the oral part of the pharynx receives its sensory supply from the glossopharyngeal nerve)."],
        lp: ["Laryngopharynx", "Behind the larynx, open to the laryngeal inlet. Sensory: **X** (internal laryngeal)."],
        oes: ["Oesophagus", "The pharynx becomes the oesophagus opposite **C6** (lower border of the cricoid), not C5."],
        tra: ["Trachea", "The larynx becomes the trachea at the same level, **C6**."],
        w_def: ["The front wall is deficient", "The pharynx's **fibromuscular wall is deficient anteriorly** at each of its parts, where it opens into the nasal cavity, the mouth and the larynx."],
        sc: ["Superior constrictor", "From the pterygoid hamulus, the **pterygomandibular raphe** and the mylohyoid line. It forms the **tonsil bed**."],
        mc: ["Middle constrictor", "From the stylohyoid ligament and the horns of the hyoid."],
        ic: ["Inferior constrictor", "Thyropharyngeus and **cricopharyngeus** (a sphincter)."],
        g1: ["Gap 1: base of skull – superior constrictor", "Auditory tube, levator palati, ascending palatine artery."],
        g2: ["Gap 2: superior – middle constrictor", "**Stylopharyngeus** and the **glossopharyngeal nerve**."],
        g3: ["Gap 3: middle – inferior constrictor", "The **internal laryngeal nerve** and the **superior laryngeal artery** (they pierce the thyrohyoid membrane)."],
        g4: ["Gap 4: below the inferior constrictor", "The **recurrent laryngeal nerve** and the **inferior laryngeal artery**."],
        v_c2: ["C2 (axis)", "Level of the soft palate and the oropharynx: far too high for the cricoid."],
        v_c4: ["C4", "Upper border of the thyroid cartilage; bifurcation of the common carotid."],
        v_c6: ["C6: the cricoid level", "The **cricoid cartilage** lies at **C6**: the pharynx becomes the oesophagus and the larynx the trachea."],
        v_t2: ["T2", "About the level of the suprasternal (jugular) notch: in the thorax, too low for the cricoid."],
        lev: ["Vertebral levels of the neck", "C2 axis; C4 upper border of the thyroid cartilage and carotid bifurcation; **C6 cricoid**; T2 jugular notch."],
        spal: ["Soft palate", "Above the tonsillar fossa; its arches run down to form the pillars."],
        pgf: ["Palatoglossal fold (anterior pillar)", "Raised by the palatoglossus: the **anterior boundary** of the tonsillar fossa, and the boundary of the **oropharyngeal isthmus**."],
        ppf: ["Palatopharyngeal fold (posterior pillar)", "Raised by the palatopharyngeus: the **posterior** boundary of the tonsillar fossa."],
        ton: ["Palatine tonsil", "In the tonsillar fossa between the two pillars, **medial to the superior constrictor** (not the middle)."],
        dtg: ["Dorsum of the tongue", "Below the tonsillar fossa, not its anterior boundary."],
        isth: ["Oropharyngeal isthmus", "Mouth → oropharynx: bounded by the **palatoglossal** arches (not the palatopharyngeal), the soft palate above and the tongue below."],
        bed: ["Tonsil bed, blood and lymph", "Bed: the **superior constrictor**, beyond it IX and the facial artery. Blood: mainly the **tonsillar branch of the facial artery** (not the lingual). Lymph: the **jugulodigastric** node."],
        mot: ["Motor supply of the pharynx", "The **pharyngeal plexus** (vagus fibres) supplies all the constrictors, the palatopharyngeus and the salpingopharyngeus; **stylopharyngeus** alone is **IX**. Not the spinal accessory."],
        ans: ["Ansa cervicalis", "**Superior root C1** (travelling with XII) + **inferior root C2, C3** (descendens cervicalis) → sternohyoid, sternothyroid, omohyoid. The thyrohyoid and geniohyoid get C1 fibres via XII."],
        phr: ["Phrenic nerve", "**C3, 4, 5** on the scalenus anterior → the diaphragm. C4 and C5 form the phrenic, not the ansa."],
        cut: ["Cutaneous branches of the cervical plexus", "From the nerve point: lesser occipital (C2), great auricular (C2, C3), transverse cervical (C2, C3), supraclavicular (C3, C4)."],
        xi: ["Spinal accessory nerve", "Sternomastoid and trapezius; superficial in the posterior triangle (cut → drooping shoulder). It does not supply the constrictors."],
      },
      al: {
        np: ["nasopharynx", "nasal part of the pharynx"],
        op: ["oropharynx", "oral part of the pharynx", "oral part of pharynx"],
        lp: ["laryngopharynx", "laryngeal part of the pharynx"],
        oes: ["oesophagus", "esophagus", "lower narrow end", "continuous with the oesophagus", "continuous with the esophagus"],
        w_def: ["deficient anteriorly", "fibromuscular wall", "wall is deficient"],
        sc: ["superior constrictor", "superior pharyngeal constrictor", "pterygomandibular raphe"],
        mc: ["middle constrictor", "medial to middle constrictor"],
        ic: ["inferior constrictor", "cricopharyngeus", "thyropharyngeus"],
        g1: ["ascending palatine artery"],
        g2: ["glossopharyngeal nerve and stylopharyngeus"],
        g3: ["superior laryngeal artery", "internal laryngeal nerve and superior laryngeal"],
        g4: ["inferior laryngeal artery", "recurrent laryngeal nerve and inferior laryngeal"],
        v_c2: ["~c2"],
        v_c4: ["~c4"],
        v_c6: ["~c6", "cricoid cartilage", "opposite c6", "level of c6"],
        v_t2: ["~t2"],
        lev: ["vertebral level"],
        spal: ["~soft palate"],
        pgf: ["palatoglossal fold", "palatoglossal arch", "palatoglossal arches", "anterior pillar", "anterior boundary of tonsillar fossa", "anterior boundary of the tonsillar fossa"],
        ppf: ["palatopharyngeal fold", "palatopharyngeal arch", "palatopharyngeal arches", "posterior pillar"],
        ton: ["palatine tonsil", "~tonsil", "tonsillar fossa", "tonsillectomy"],
        dtg: ["dorsum of the tongue"],
        isth: ["oropharyngeal isthmus"],
        bed: ["tonsil bed", "jugulodigastric", "jugulo digastric", "tonsillar branch", "medial to superior constrictor"],
        mot: ["pharyngeal plexus", "constrictor muscles", "constrictors of the pharynx", "stylopharyngeus", "salpingopharyngeus", "palatopharyngeus is supplied"],
        ans: ["ansa cervicalis", "~inferior root", "~superior root", "descendens cervicalis", "~c2 and c3", "~c1"],
        phr: ["phrenic nerve", "phrenic", "~c4 and c5", "~c4 and cs", "~c3 4 5"],
        cut: ["cervical plexus", "nerve point", "lesser occipital", "transverse cervical", "supraclavicular nerve", "supraclavicular nerves"],
        xi: ["spinal accessory nerve", "spinal accessory"],
      },
      drill: ["w_def", "sc", "mc", "ic", "g2", "g3", "g4", "v_c6", "pgf", "ppf", "ton", "isth", "mot", "ans", "phr"],
      sims: [
        { id: "parts", label: "Parts and levels", on: ["np", "op", "lp", "oes", "tra", "w_def", "v_c2", "v_c4", "v_c6", "v_t2", "lev", "mot"], info: "Three parts, each **open in front** (nasal cavity, mouth, larynx); the pharynx ends at **C6**, the cricoid level. Motor: **pharyngeal plexus (X)**, except stylopharyngeus (**IX**)." },
        { id: "gaps", label: "The four gaps", on: ["sc", "mc", "ic", "g1", "g2", "g3", "g4"], info: "1: auditory tube; 2: **stylopharyngeus + IX**; 3: **internal laryngeal n. + superior laryngeal a.**; 4: **recurrent laryngeal n. + inferior laryngeal a.**" },
        { id: "tonsil", label: "Tonsil", on: ["spal", "pgf", "ppf", "ton", "dtg", "isth", "bed"], info: "Anterior pillar = **palatoglossal** fold; posterior = **palatopharyngeal**; bed = **superior constrictor**; blood **facial** a.; lymph **jugulodigastric**." },
        { id: "neck", label: "Cervical plexus", on: ["ans", "phr", "cut", "xi"], info: "Ansa: **C1** (with XII) + **C2, C3**; phrenic **C3, 4, 5**; cutaneous branches at the nerve point." },
      ],
      secs: { "an-pharynx#0": "parts", "an-pharynx#1": "gaps", "an-pharynx#2": "tonsil", "an-cranial-nerves#4": "neck", "an-cervical-plexus#0": "neck" },
      rules: [
        [/tonsil|palatoglossal|palatopharyngeal fold|isthmus/i, "tonsil"],
        [/ansa|cervical plexus|phrenic|accessory/i, "neck"],
        [/gap|between the (superior|middle|inferior) constrictor|laryngeal artery/i, "gaps"],
        [/pharyn|cricoid|vertebral level/i, "parts"],
      ],
    });
  })();
})();
