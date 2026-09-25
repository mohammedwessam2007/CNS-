/* INTELLECTUALITY v17.3 · Diencephalon and the third ventricle (midsagittal: walls, floor, recesses, the five parts of
 * the diencephalon), and the brainstem's surfaces: where each cranial nerve leaves, the colliculi and their
 * brachia, the floor of the 4th ventricle and the named nuclei. Drawn from the notes' wording (an-diencephalon,
 * an-third-ventricle, an-brain-stem#0–#4).
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

  /* ═══════════════ 1. DIENCEPHALON AND THE THIRD VENTRICLE ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">DIENCEPHALON AND THE THIRD VENTRICLE (MIDSAGITTAL)</text>' +
      box(4, 22, 300, 250) + T(154, 36, "front ←            the 3rd ventricle            → back", "sm mut") +
      // ventricle cavity outline
      '<path d="M72 78 L244 70 L262 100 L240 132 L214 170 L186 184 L160 192 L126 190 L104 206 L96 188 L78 176 L70 120 Z" fill="#14304a" stroke="#6f8aa8" pointer-events="none"/>' +
      '<path class="pf" data-p="thal" d="M110 88 C150 76 214 80 230 104 C236 124 210 134 170 134 C132 134 104 120 110 88 Z" style="--c:#66e9ff;--r:#24384f"/>' +
      T(150, 104, "THALAMUS (medial surface)", "sm") +
      dot("ita", 180, 116, 9, B, "#2a5a7a") + T(128, 124, "adhesion →", "sm") +
      ps("hsul", "M96 90 C130 140 190 146 236 136", Y, "#6a5a30", 1.6) + T(96, 150, "hypothalamic sulcus", "sm", "start") +
      '<path class="pf" data-p="hyp" d="M80 150 C110 150 150 160 200 160 L186 182 L160 188 L126 186 L100 178 Z" style="--c:#ff9f43;--r:#5a3a20"/>' + T(150, 176, "HYPOTHALAMUS", "sm") +
      ps("tela", "M76 76 L242 68", P, "#5a4a8a", 4) + T(160, 62, "roof: tela choroidea + choroid plexus", "sm") +
      ps("lt", "M72 80 L70 122 L78 174", G, "#2f6a4c", 3.6) + T(62, 128, "lamina", "sm", "end") + T(62, 138, "terminalis", "sm", "end") +
      dot("ac2", 72, 98, 5, O, "#6a4020") + T(62, 100, "ant. comm.", "sm", "end") +
      dot("ivf", 98, 84, 5, G, GR) + T(106, 52, "interventricular foramen (Monro)", "sm", "start") + '<path d="M104 56 L99 78" stroke="#6f8aa8" pointer-events="none"/>' +
      '<path class="pf" data-p="och" d="M70 176 L90 176 L90 186 L70 186 Z" style="--c:#ffd166;--r:#6a5a30"/>' + T(66, 198, "optic chiasma", "sm", "end") +
      '<path class="pf" data-p="r_opt" d="M78 174 L88 174 L84 164 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>' +
      '<path class="pf" data-p="inf" d="M98 190 L110 190 L106 222 L102 222 Z" style="--c:#ff9f43;--r:#5a3a20"/>' + '<ellipse cx="104" cy="230" rx="14" ry="8" fill="#5a3a20" opacity=".8" pointer-events="none"/>' + T(126, 236, "pituitary", "sm", "start") +
      '<path class="pf" data-p="r_inf" d="M100 190 L108 190 L104 204 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>' +
      dot("tc", 126, 192, 5, O, "#6a4020") + dot("mb", 158, 196, 7, O, "#6a4020") + dot("pps", 186, 188, 5, O, "#6a4020") +
      T(126, 210, "tuber", "sm") + T(160, 214, "mammillary", "sm") + T(200, 230, "post. perf.", "sm") +
      '<path class="pf" data-p="teg" d="M206 176 L236 150 L252 172 L224 196 Z" style="--c:#8a9ab0;--r:#3a4a5e"/>' + T(214, 214, "tegmentum", "sm") +
      ps("aq", "M238 136 C248 150 258 170 270 196", B, "#2a5a7a", 5) + T(272, 244, "aqueduct → 4th", "sm", "middle") +
      dot("pcm", 242, 124, 4, B, "#2a5a7a") + '<path class="pf" data-p="pin" d="M254 98 C272 92 286 100 284 110 C274 116 262 112 254 106 Z" style="--c:#ff5d7a;--r:#6a3040"/>' + T(286, 124, "pineal", "sm", "middle") +
      dot("hab", 246, 88, 3.5, P, "#5a4a8a") + '<path class="pf" data-p="r_pin" d="M246 102 L256 102 L252 96 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>' + '<path class="pf" data-p="r_sup" d="M238 74 L250 72 L244 82 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>' +
      T(290, 66, "habenular", "sm", "end") + T(232, 124, "post. c.", "sm", "end") +
      T(154, 262, "green triangles = the 4 recesses", "sm mut") +
      // right: the five parts
      box(310, 22, 206, 250) + T(413, 36, "THE FIVE PARTS", "sm mut") +
      cell("thal_c", 316, 42, 194, 36, ["THALAMUS: lateral → posterior limb", "of the internal capsule; medial →", "3rd-ventricle wall; pulvinar behind"], B, BR) +
      cell("hypo_c", 316, 82, 194, 36, ["HYPOTHALAMUS: optic chiasma,", "TUBER CINEREUM, INFUNDIBULUM,", "MAMMILLARY bodies"], O, OR) +
      cell("epi_c", 316, 122, 194, 26, ["EPITHALAMUS: PINEAL body,", "habenula, posterior commissure"], R, RR) +
      cell("meta_c", 316, 152, 194, 26, ["METATHALAMUS: MEDIAL geniculate", "(hearing), LATERAL geniculate (vision)"], P, PR) +
      cell("sub_c", 316, 182, 194, 16, ["SUBTHALAMUS: subthalamic nucleus"], P, PR) +
      cell("not_c", 316, 202, 194, 26, ["NOT diencephalon: ant. perforated", "substance, optic tract, ant. comm."], "#8a9ab0", "#2a3a4e") +
      cell("pit_c", 316, 232, 194, 36, ["PITUITARY tumour: endocrine, raised", "pressure, chiasma → BITEMPORAL", "hemianopia"], Y, YR) +
      // bottom: the ventricle
      cell("v3_c", 4, 278, 256, 36, ["3rd VENTRICLE = cavity of the DIENCEPHALON", "(not the hindbrain): Monro → each LATERAL", "ventricle, AQUEDUCT → the 4th"], B, BR) +
      cell("walls_c", 264, 278, 252, 36, ["ANTERIOR wall: LAMINA TERMINALIS, anterior", "commissure, fornix · POSTERIOR: pineal stalk,", "posterior + habenular commissures"], G, GR) +
      cell("floor_c", 4, 318, 256, 36, ["FLOOR (front → back): optic chiasma,", "infundibulum, tuber cinereum, mammillary", "bodies, post. perforated substance, tegmentum"], O, OR) +
      cell("rec_c", 264, 318, 252, 36, ["RECESSES: OPTIC, INFUNDIBULAR, PINEAL,", "SUPRAPINEAL · the LATERAL recess belongs", "to the 4th ventricle"], G, GR) +
      cell("roof_c", 4, 358, 512, 18, ["ROOF: ependyma + tela choroidea, two choroid plexuses (posterior choroidal arteries, not PICA)"], P, PR);
    A.scene("dien", {
      title: "Diencephalon and the third ventricle · walls, floor, recesses and the five parts",
      vb: "0 0 520 380",
      svg,
      intro: "A midline cut: the **3rd ventricle** with the **lamina terminalis** in front, the pineal and commissures behind, the **thalamus** above and **hypothalamus** below the hypothalamic sulcus, and the floor from **optic chiasma** to **mammillary bodies**.",
      parts: {
        thal: ["Thalamus", "Its medial surface forms the upper lateral wall of the 3rd ventricle."],
        ita: ["Interthalamic adhesion", "Joins the two thalami across the ventricle."],
        hsul: ["Hypothalamic sulcus", "From the interventricular foramen to the aqueduct: thalamus above, hypothalamus below."],
        hyp: ["Hypothalamus", "Below the hypothalamic sulcus; its visible parts are the optic chiasma, tuber cinereum, infundibulum and mammillary bodies."],
        tela: ["Roof of the 3rd ventricle", "Ependyma with the **tela choroidea**: two choroid plexuses hang from it (posterior choroidal arteries)."],
        lt: ["Lamina terminalis", "The **anterior wall** of the 3rd ventricle."],
        ac2: ["Anterior commissure", "In the anterior wall (not part of the diencephalon)."],
        ivf: ["Interventricular foramen (Monro)", "Joins the 3rd ventricle to each **lateral** ventricle."],
        och: ["Optic chiasma", "The front of the floor; pressure from a pituitary tumour → bitemporal hemianopia."],
        r_opt: ["Optic recess", "Above the optic chiasma."],
        inf: ["Infundibulum", "Stalk of the pituitary: part of the **hypothalamus**."],
        r_inf: ["Infundibular recess", "Into the infundibulum."],
        tc: ["Tuber cinereum", "Part of the **hypothalamus**, between chiasma and mammillary bodies."],
        mb: ["Mammillary bodies", "Part of the **hypothalamus**, so of the **diencephalon** (not the midbrain, pons or medulla)."],
        pps: ["Posterior perforated substance", "In the back of the floor."],
        teg: ["Tegmentum of the midbrain", "The back of the floor."],
        aq: ["Cerebral aqueduct", "Joins the 3rd ventricle to the **4th**."],
        pcm: ["Posterior commissure", "In the posterior wall, above the aqueduct."],
        pin: ["Pineal body", "**Epithalamus**; its stalk forms part of the **posterior wall**. Not hypothalamus."],
        hab: ["Habenular commissure", "In the posterior wall above the pineal stalk."],
        r_pin: ["Pineal recess", "Into the pineal stalk."],
        r_sup: ["Suprapineal recess", "Above the pineal."],
        thal_c: ["Thalamus: relations", "Lateral surface → **posterior limb of the internal capsule**; medial → 3rd ventricle; upper surface → floor of the lateral ventricle; the pulvinar overhangs the geniculate bodies."],
        hypo_c: ["Parts of the hypothalamus", "**Optic chiasma**, **tuber cinereum**, **infundibulum** and **mammillary bodies**. The pineal body and medial geniculate body are not hypothalamus."],
        epi_c: ["Epithalamus", "**Pineal body**, habenular nuclei and posterior commissure."],
        meta_c: ["Metathalamus", "**Medial geniculate body** (hearing) and **lateral geniculate body** (vision)."],
        sub_c: ["Subthalamus", "The subthalamic nucleus below the thalamus."],
        not_c: ["Not diencephalon", "The **anterior perforated substance**, the **optic tract** and the **anterior commissure**."],
        pit_c: ["Pituitary tumours", "Endocrine disturbance; raised intracranial tension (headache, vomiting, blurred vision); pressure on the **optic chiasma** → **bitemporal hemianopia**."],
        v3_c: ["The 3rd ventricle", "The cavity of the **diencephalon** (not the hindbrain): interventricular foramen → each lateral ventricle; aqueduct → 4th ventricle."],
        walls_c: ["Walls of the 3rd ventricle", "Anterior: **lamina terminalis**, anterior commissure, columns of the fornix. Posterior: suprapineal recess, habenular commissure, **pineal stalk**, posterior commissure, the aqueduct opening. Lateral: thalamus and hypothalamus."],
        floor_c: ["Floor of the 3rd ventricle", "From front to back: optic chiasma, infundibulum, tuber cinereum, mammillary bodies, posterior perforated substance, tegmentum of the midbrain."],
        rec_c: ["Recesses of the 3rd ventricle", "**Optic, infundibular, pineal and suprapineal**. The **lateral recess** is a 4th-ventricle feature (it ends at the foramen of Luschka)."],
        roof_c: ["Roof of the 3rd ventricle", "Ependyma + tela choroidea with two choroid plexuses, supplied by the posterior choroidal arteries (posterior cerebral), not PICA."],
      },
      al: {
        thal: ["thalamus"],
        ita: ["interthalamic adhesion", "massa intermedia"],
        hsul: ["hypothalamic sulcus"],
        hyp: ["hypothalamus"],
        tela: ["tela choroidea", "roof of the third ventricle"],
        lt: ["lamina terminalis"],
        ivf: ["interventricular foramen", "foramen of monro", "monro"],
        och: ["optic chiasma", "optic chiasm"],
        r_opt: ["optic recess"],
        inf: ["infundibulum"],
        r_inf: ["infundibular recess"],
        tc: ["tuber cinereum", "tuberculum cinereum"],
        mb: ["mammillary bodies", "mamillary bodies", "mammillary body"],
        pps: ["posterior perforated substance"],
        aq: ["cerebral aqueduct", "aqueduct of sylvius"],
        pin: ["pineal body", "pineal gland", "pineal"],
        hab: ["habenular commissure", "habenula"],
        r_pin: ["pineal recess"],
        r_sup: ["suprapineal recess"],
        epi_c: ["epithalamus"],
        meta_c: ["metathalamus", "medial geniculate body", "lateral geniculate body"],
        sub_c: ["subthalamus"],
        not_c: ["anterior perforated substance", "optic tract"],
        pit_c: ["pituitary tumor", "pituitary tumour", "bitemporal hemianopia"],
        v3_c: ["third ventricle", "3rd ventricle", "cavity of the hindbrain", "cavity of the diencephalon"],
        walls_c: ["bounded anteriorly", "anterior wall of the third ventricle", "posterior wall of the third ventricle"],
        floor_c: ["floor of the third ventricle"],
        rec_c: ["recesses", "lateral recess"],
        hypo_c: ["part of the hypothalamus"],
        thal_c: ["posterior limb", "pulvinar"],
      },
      drill: ["lt", "ivf", "aq", "och", "inf", "tc", "mb", "pin", "pcm", "r_opt", "r_inf", "r_pin", "r_sup", "thal", "hyp", "ita"],
      sims: [
        { id: "walls", label: "Walls and floor", on: ["lt", "ac2", "tela", "och", "inf", "tc", "mb", "pps", "teg", "pin", "hab", "pcm", "walls_c", "floor_c", "roof_c"], info: "Anterior: **lamina terminalis**. Posterior: pineal stalk and commissures. Floor: chiasma → infundibulum → tuber cinereum → **mammillary bodies** → post. perforated substance → tegmentum." },
        { id: "rec", label: "The four recesses", on: ["r_opt", "r_inf", "r_pin", "r_sup", "rec_c"], info: "**Optic, infundibular, pineal, suprapineal**. The lateral recess is the 4th ventricle's." },
        { id: "parts", label: "Five parts", on: ["thal", "hyp", "thal_c", "hypo_c", "epi_c", "meta_c", "sub_c", "pin", "mb", "tc", "inf"], info: "Thalamus, **hypothalamus** (chiasma, tuber cinereum, infundibulum, mammillary bodies), **epithalamus** (pineal), **metathalamus** (geniculate bodies), subthalamus." },
        { id: "comm", label: "Communications", on: ["ivf", "aq", "v3_c"], info: "**Monro** → lateral ventricles; **aqueduct** → 4th ventricle." },
      ],
      secs: { "an-diencephalon#0": "parts", "an-third-ventricle#0": "walls", "an-third-ventricle#1": "rec" },
      rules: [
        [/recess/i, "rec"],
        [/third ventricle|3rd ventricle|lamina terminalis/i, "walls"],
        [/diencephalon|hypothalamus|mam+illary|pineal|tuber/i, "parts"],
      ],
    });
  })();

  /* ═══════════════ 2. BRAINSTEM SURFACES, NERVE EXITS, COLLICULI AND NUCLEI ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">BRAINSTEM · WHERE THE NERVES LEAVE, THE COLLICULI, THE NAMED NUCLEI</text>' +
      // front view
      box(4, 22, 250, 234) + T(129, 36, "FRONT", "sm mut") +
      '<path d="M70 50 C90 44 168 44 188 50 L196 120 C170 130 88 130 62 120 Z" fill="#2a3a52" stroke="#6f8aa8" pointer-events="none"/>' + T(129, 90, "PONS", "sm") +
      '<path d="M84 128 L174 128 L166 230 L92 230 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' + T(129, 244, "MEDULLA", "sm mut") +
      ps("amf2", "M129 130 L129 228", "#cfd8e3", "#6a7a8a", 1.4) +
      '<path d="M112 136 L124 136 L122 222 L114 222 Z M134 136 L146 136 L144 222 L136 222 Z" fill="#3a5a7a" pointer-events="none"/>' +
      '<ellipse cx="102" cy="164" rx="8" ry="18" fill="#5a3a20" pointer-events="none"/><ellipse cx="156" cy="164" rx="8" ry="18" fill="#5a3a20" pointer-events="none"/>' + T(156, 200, "olive", "sm") +
      ps("als", "M110 146 L110 226", G, GR, 1.6) + ps("pls", "M92 146 L92 214", O, OR, 1.6) +
      ps("n12r", "M110 160 L80 166 M110 174 L80 178 M110 188 L80 190", G, GR, 1.6) + T(76, 172, "XII", "sm", "end") +
      ps("n9r", "M92 150 L66 144 M92 160 L64 158 M92 172 L64 172", O, OR, 1.6) + T(60, 150, "IX, X, XI", "sm", "end") +
      ps("n6r", "M118 124 L116 140", Y, YR, 1.8) + T(118, 116, "VI", "sm") +
      ps("n78", "M180 124 L210 130 M182 132 L212 140", B, BR, 2) + T(214, 124, "VII", "sm", "start") + T(214, 144, "VIII", "sm", "start") +
      dot("cpa", 196, 132, 12, "rgba(102,233,255,.25)", "rgba(102,233,255,.08)") + T(218, 160, "CP angle", "sm", "start") +
      ps("n5l", "M188 80 L222 72", P, PR, 3) + T(224, 68, "V", "sm", "start") +
      T(88, 216, "posterolateral", "sm", "end") + T(106, 232, "anterolateral", "sm", "end") +
      // back view
      box(260, 22, 256, 234) + T(388, 36, "BACK", "sm mut") +
      dot("sc2", 364, 58, 11, Y, "#6a5a30") + dot("sc2", 412, 58, 11, Y, "#6a5a30") + dot("ic2", 364, 84, 10, B, "#2a5a7a") + dot("ic2", 412, 84, 10, B, "#2a5a7a") +
      T(388, 61, "SC", "sm") + T(388, 87, "IC", "sm") +
      ps("sbr", "M352 56 L306 46", Y, YR, 2) + T(300, 44, "→ LGB", "sm", "end") + ps("ibr", "M354 84 L306 80", B, BR, 2) + T(300, 82, "→ MGB", "sm", "end") +
      ps("n4d", "M372 98 C360 106 340 110 322 120", R, RR, 2) + T(318, 128, "IV winds", "sm", "end") + T(318, 138, "round", "sm", "end") +
      '<path d="M340 104 L436 104 L456 160 L388 214 L320 160 Z" fill="#14304a" stroke="#6f8aa8" pointer-events="none"/>' + T(388, 118, "floor of the 4th ventricle", "sm mut") +
      dot("fcol", 376, 140, 6, G, GR) + dot("fcol", 400, 140, 6, G, GR) + T(424, 142, "facial colliculus", "sm", "start") +
      '<path class="pf" data-p="htri" d="M384 184 L388 206 L380 204 Z M392 184 L388 206 L396 204 Z" style="--c:#5ef0a0;--r:#2f6a4c"/>' + '<path class="pf" data-p="vtri" d="M376 182 L378 198 L370 196 Z M400 182 L398 198 L406 196 Z" style="--c:#ff9f43;--r:#6a4020"/>' +
      T(424, 190, "hypoglossal + vagal", "sm", "start") + T(424, 200, "triangles", "sm", "start") +
      dot("gct", 374, 228, 6, P, PR) + dot("gct", 402, 228, 6, P, PR) + T(424, 232, "gracile, cuneate tubercles", "sm", "start") + T(424, 242, "(closed, LOWER medulla)", "sm mut", "start") +
      // nuclei and facts
      cell("amb", 4, 262, 256, 26, ["NUCLEUS AMBIGUUS: motor, COMMON to IX, X,", "XI → pharynx, larynx, soft palate"], O, OR) +
      cell("sol", 264, 262, 252, 26, ["NUCLEUS SOLITARIUS: TASTE (VII, IX, X)", "+ visceral sensation"], G, GR) +
      cell("dmv", 4, 292, 256, 26, ["DORSAL MOTOR nucleus of X: parasympathetic,", "in the vagal triangle"], O, OR) +
      cell("fl4", 264, 292, 252, 26, ["4th-ventricle floor: VI, XII, dorsal vagal,", "vestibular nuclei (III is in the midbrain)"], B, BR) +
      cell("aud2", 4, 322, 256, 26, ["AUDITORY: lateral lemniscus → INFERIOR", "colliculus → MEDIAL geniculate body"], B, BR) +
      cell("vis2", 264, 322, 252, 26, ["VISUAL: SUPERIOR colliculus (reflexes),", "LATERAL geniculate · not the reverse"], Y, YR) +
      cell("wind", 4, 352, 256, 26, ["round the lateral midbrain: OPTIC TRACT, IV,", "posterior cerebral + superior cerebellar aa."], R, RR) +
      cell("cpa_c", 264, 352, 252, 26, ["CP ANGLE: VII and VIII (+ AICA); V is on the", "lateral pons higher up; X leaves the medulla"], B, BR) +
      cell("tect", 4, 382, 256, 26, ["TECTUM → metathalamus by 2 brachia each side:", "superior → LGB, inferior → MGB"], Y, YR) +
      cell("levels", 264, 382, 252, 26, ["midbrain III, IV · pons V, VI, VII, VIII ·", "medulla IX, X, XI, XII"], P, PR);
    A.scene("bsback", {
      title: "Brainstem · nerve exits front and back, the colliculi and brachia, the floor of the 4th ventricle, named nuclei",
      vb: "0 0 520 412",
      svg,
      intro: "Front: **XII** between pyramid and olive, **IX, X, XI** behind the olive, **VI** at the pontomedullary junction, **VII and VIII** at the **cerebellopontine angle**, **V** on the lateral pons. Back: the colliculi with their brachia, **IV** leaving dorsally, and the floor of the 4th ventricle.",
      parts: {
        amf2: ["Anterior median fissure", "In the midline between the pyramids; no nerve leaves here."],
        als: ["Anterolateral sulcus", "Between pyramid and olive: the **hypoglossal (XII)** rootlets."],
        pls: ["Posterolateral sulcus", "Behind the olive, between the olive and the inferior cerebellar peduncle: **IX, X and the cranial XI**."],
        n12r: ["Hypoglossal rootlets", "Emerge along the **anterolateral** sulcus, between pyramid and olive (not the posterolateral sulcus or the median fissure)."],
        n9r: ["IX, X, XI rootlets", "Emerge between the **olive and the inferior cerebellar peduncle** (not between the gracile and cuneate tubercles)."],
        n6r: ["Abducent nerve (VI)", "At the lower border of the pons, between pons and pyramid."],
        n78: ["Facial (VII) and vestibulocochlear (VIII)", "Emerge at the **cerebellopontine angle**."],
        cpa: ["Cerebellopontine angle", "Between pons, medulla and cerebellum: **VII, VIII** (and AICA)."],
        n5l: ["Trigeminal nerve (V)", "Attached to the lateral part of the front of the pons, at the middle cerebellar peduncle: higher than the angle."],
        sc2: ["Superior colliculi", "Centres for **visual reflexes** (not auditory)."],
        ic2: ["Inferior colliculi", "**Auditory** relay (not visual)."],
        sbr: ["Superior brachium", "Superior colliculus → **lateral geniculate body**."],
        ibr: ["Inferior brachium", "Inferior colliculus → **medial geniculate body**."],
        n4d: ["Trochlear nerve (IV)", "The only cranial nerve leaving the **back** of the brainstem, just below the inferior colliculus; it **winds** forwards round the lateral midbrain."],
        fcol: ["Facial colliculus", "Facial nerve fibres looping round the **abducent nucleus**."],
        htri: ["Hypoglossal triangle", "Over the hypoglossal nucleus, in the lower floor."],
        vtri: ["Vagal triangle", "Over the dorsal motor nucleus of the vagus."],
        gct: ["Gracile and cuneate tubercles", "On the back of the **closed (lower)** medulla, not its upper part."],
        amb: ["Nucleus ambiguus", "The motor nucleus **common to IX, X and XI** (cranial part): pharynx, larynx, soft palate."],
        sol: ["Nucleus solitarius", "Sensory: **taste** (VII, IX, X) and visceral sensation."],
        dmv: ["Dorsal motor nucleus of the vagus", "Parasympathetic, under the vagal triangle."],
        fl4: ["Nuclei in the 4th-ventricle floor", "Abducent, hypoglossal, dorsal vagal and vestibular. The **oculomotor** nucleus is in the midbrain."],
        aud2: ["Auditory pathway through the brainstem", "Lateral lemniscus → **inferior colliculus** → **medial geniculate body**. The superior colliculus and LGB are visual."],
        vis2: ["Visual structures of the midbrain", "Superior colliculus (visual reflexes) → lateral geniculate body. Not auditory."],
        wind: ["What winds round the lateral midbrain", "The **optic tract**, the **trochlear nerve**, the posterior cerebral and superior cerebellar arteries (not the abducent nerve)."],
        cpa_c: ["Cerebellopontine angle contents", "**VII and VIII** (and AICA). The trigeminal is attached higher on the lateral pons; the vagus leaves the medulla."],
        tect: ["Tectum and brachia", "The tectum (four colliculi) is joined to the metathalamus by **2 brachia on each side**: superior → LGB, inferior → MGB."],
        levels: ["Which nerves at which level", "Midbrain III, IV; pons V, VI, VII, VIII; medulla IX, X, XI, XII."],
      },
      al: {
        amf2: ["anterior median fissure"],
        als: ["anterolateral sulcus", "preolivary"],
        pls: ["posterolateral sulcus", "postolivary", "olive and inferior cerebellar peduncle"],
        n12r: ["hypoglossal nerve emerges", "rootlets of the hypoglossal"],
        n9r: ["rootlets of the vagus", "rootlets of ix x xi"],
        cpa: ["cerebellopontine angle", "cerebello pontine angle"],
        sc2: ["superior colliculus", "superior colliculi"],
        ic2: ["inferior colliculus", "inferior colliculi"],
        sbr: ["superior brachium"],
        ibr: ["inferior brachium"],
        n4d: ["trochlear nerve", "wind around the lateral surface"],
        fcol: ["facial colliculus"],
        htri: ["hypoglossal triangle"],
        vtri: ["vagal triangle"],
        gct: ["gracile and cuneate tubercles", "gracile tubercle", "cuneate tubercle"],
        amb: ["nucleus ambiguus", "nucleus ambiguous", "common to ix x and xi"],
        sol: ["nucleus solitarius", "tractus solitarius", "solitary nucleus"],
        dmv: ["dorsal motor nucleus of the vagus", "dorsal vagal nucleus"],
        fl4: ["floor of the 4th ventricle", "floor of the fourth ventricle"],
        aud2: ["auditory pathway", "belongs to the auditory pathway", "centers for auditory pathway"],
        vis2: ["part of visual pathway", "visual reflexes"],
        wind: ["winds around the lateral surface of midbrain", "optic tract"],
        tect: ["tectum", "metathalamus by 2 brachia", "brachia"],
        levels: ["cranial nerves related to the pons"],
      },
      drill: ["als", "pls", "n12r", "n9r", "cpa", "n5l", "sc2", "ic2", "sbr", "ibr", "n4d", "fcol", "gct", "amb", "sol"],
      sims: [
        { id: "front", label: "Nerve exits (front)", on: ["als", "pls", "n12r", "n9r", "n6r", "n78", "cpa", "n5l", "levels"], info: "**XII** anterolateral sulcus; **IX, X, XI** posterolateral sulcus; **VI** pontomedullary junction; **VII, VIII** cerebellopontine angle; **V** lateral pons." },
        { id: "back", label: "Back and colliculi", on: ["sc2", "ic2", "sbr", "ibr", "n4d", "fcol", "htri", "vtri", "gct", "tect"], info: "Superior colliculus (visual) → **LGB**; inferior (auditory) → **MGB**; **IV** leaves dorsally below the inferior colliculus; facial colliculus over the abducent nucleus." },
        { id: "nuc", label: "Named nuclei", on: ["amb", "sol", "dmv", "fl4"], info: "**Ambiguus** = motor IX, X, XI; **solitarius** = taste; dorsal motor X = parasympathetic." },
      ],
      secs: { "an-brain-stem#3": "back", "an-brain-stem#4": "nuc" },
      rules: [
        [/ambigu|solitari/i, "nuc"],
        [/colliculus|colliculi|brachium|trochlear/i, "back"],
        [/cerebellopontine|sulcus|emerg/i, "front"],
      ],
    });
  })();
})();
