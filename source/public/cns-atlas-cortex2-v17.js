/* INTELLECTUALITY v17.3 · The cerebral hemisphere's surfaces (superolateral sulci and gyri, the insula and its
 * opercula, the medial surface with the cingulate sulcus, the orbital and tentorial parts of the inferior surface)
 * with the interpeduncular fossa; and a sound board (decibels, middle-ear amplification, the attenuation reflex).
 * Drawn from the notes' wording (an-sulci-gyri, an-base-of-brain, ph-middle-ear).
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
  const bg = (d) => '<path d="' + d + '" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>';
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

  /* ═══════════════ 1. SURFACES OF THE HEMISPHERE ═══════════════ */
  (function () {
    const svg = () => {
      let s = '<text class="ttl" x="270" y="14" text-anchor="middle">CEREBRAL HEMISPHERE · SULCI AND GYRI ON EACH SURFACE</text>';
      // A. superolateral
      s += box(4, 22, 264, 180) + T(136, 34, "SUPEROLATERAL (front ←)", "sm mut");
      s += bg("M24 118 C24 64 80 40 150 40 C214 40 262 72 262 122 C262 162 236 186 200 188 C176 194 152 188 136 178 C110 190 70 188 48 174 C30 160 24 140 24 118 Z");
      s += ps("prec", "M140 42 C136 62 128 88 116 114", B, "#2a5a7a", 8) + ps("postc", "M166 44 C162 64 154 90 142 118", G, "#2f6a4c", 8);
      s += ps("cs", "M153 42 C149 62 141 88 129 116", "#ffffff", "#8a9ab0", 2);
      s += ps("lat", "M72 134 C110 126 150 128 176 118 C192 112 202 106 212 98", O, "#6a4020", 3);
      s += ps("sts", "M88 158 C130 152 172 148 216 128", Y, "#6a5a30", 2);
      s += ps("ips", "M170 72 C192 78 212 90 238 106", P, "#5a4a8a", 2);
      s += '<ellipse class="pf" data-p="ifg" cx="84" cy="114" rx="18" ry="9" style="--c:#ff5d7a;--r:#5a3040"/>';
      s += T(104, 52, "precentral (4)", "sm", "end") + T(182, 52, "postcentral (3,1,2)", "sm", "start") + T(150, 30 + 0, "", "sm");
      s += T(118, 146, "lateral sulcus", "sm") + T(212, 94, "post. ramus", "sm", "start") + T(150, 168, "superior temporal sulcus", "sm");
      s += T(226, 84, "intraparietal", "sm", "middle") + T(84, 104, "Broca", "sm") + T(60, 88, "frontal", "sm mut") + T(96, 180, "temporal", "sm mut") + T(214, 70, "parietal", "sm mut");
      s += T(138, 126, "central", "sm", "end");
      // B. insula
      s += box(272, 22, 264, 180) + T(404, 34, "INSULA (lateral sulcus pulled open)", "sm mut");
      s += '<path class="pf" data-p="op_f" d="M300 80 C330 62 370 60 398 70 L394 86 C366 78 334 80 306 96 Z" style="--c:#66e9ff;--r:#24384f"/>';
      s += '<path class="pf" data-p="op_p" d="M400 70 C432 68 462 80 482 102 L468 110 C450 94 426 86 402 86 Z" style="--c:#5ef0a0;--r:#1e4a36"/>';
      s += '<path class="pf" data-p="op_t" d="M300 156 C340 176 430 178 480 146 L470 132 C430 160 344 162 310 142 Z" style="--c:#ffd166;--r:#4a4030"/>';
      s += ps("circ", "M312 104 C336 88 446 88 468 112 C464 138 424 152 382 152 C344 152 318 138 312 104", "#ffffff", "#6a7a8a", 1.6);
      s += '<path class="pf" data-p="ins" d="M320 106 C342 94 440 94 460 114 C456 134 420 146 382 146 C348 146 324 134 320 106 Z" style="--c:#b39cff;--r:#3a3060"/>';
      s += '<path d="M392 98 L380 144 M346 104 L340 138 M362 100 L356 142 M414 100 L420 142 M436 104 L444 136" stroke="#6a5a9a" stroke-width="1.4" pointer-events="none"/>';
      s += dot("lim", 326, 132, 5, R, "#6a3040");
      s += T(350, 124, "short gyri", "sm") + T(430, 124, "long gyri", "sm") + T(300, 72, "frontal op.", "sm", "start") + T(492, 96, "parietal op.", "sm", "end") + T(390, 190, "temporal operculum", "sm") + T(318, 150, "limen", "sm", "end");
      s += T(468, 128, "circular", "sm", "start") + T(468, 138, "sulcus", "sm", "start");
      // C. medial
      s += box(4, 208, 264, 180) + T(136, 220, "MEDIAL (front ←)", "sm mut");
      s += bg("M24 304 C24 250 80 226 150 226 C214 226 262 256 262 308 C262 346 236 368 200 370 L60 370 C36 360 24 332 24 304 Z");
      s += ps("cingg", "M86 318 C76 298 88 270 130 266 C176 262 202 274 206 292", G, "#2f6a4c", 8);
      s += ps("cc3", "M84 318 C70 314 66 302 74 292 C86 276 122 272 160 274 C196 276 214 290 212 306 C210 316 200 320 190 316", P, "#5a4a8a", 7);
      s += ps("cings", "M80 326 C62 300 78 258 130 254 C176 250 200 258 212 268", O, "#6a4020", 2.4);
      s += ps("marg", "M212 268 C220 256 226 242 228 228", O, "#6a4020", 2.4) + ps("subp", "M212 268 C224 280 228 292 226 302", O, "#6a4020", 2);
      s += '<ellipse class="pf" data-p="pcl2" cx="182" cy="238" rx="20" ry="9" style="--c:#66e9ff;--r:#24384f"/>';
      s += ps("pos", "M246 250 C240 274 232 296 218 320", Y, "#6a5a30", 2.4) + ps("calc", "M218 320 C232 330 246 338 258 342", R, "#6a3040", 2.4);
      s += T(128, 246, "cingulate sulcus", "sm") + T(140, 290, "corpus callosum", "sm") + T(128, 312, "cingulate g.", "sm") + T(182, 241, "paracentral", "sm");
      s += T(222, 234, "marginal", "sm", "end") + T(240, 258, "precuneus", "sm", "end") + T(246, 328, "cuneus", "sm", "end") + T(252, 356, "calcarine", "sm", "end");
      // D. inferior
      s += box(272, 208, 264, 180) + T(404, 220, "INFERIOR (front ↑, medial ←)", "sm mut");
      s += bg("M300 232 C330 224 420 224 460 232 C496 246 514 290 508 336 C502 362 474 374 444 374 L360 374 C330 374 304 350 300 320 C296 282 296 250 300 232 Z");
      s += '<path class="pf" data-p="orb" d="M302 234 C330 228 420 228 458 236 C480 246 496 266 500 282 L310 282 Z" style="--c:#66e9ff;--r:#1d3a55"/>';
      s += '<path class="pf" data-p="tentp" d="M310 286 L500 286 C508 310 506 344 496 360 C480 372 460 372 444 372 L360 372 C332 372 310 348 306 320 Z" style="--c:#5ef0a0;--r:#1a3a2e"/>';
      s += ps("stemlat", "M420 284 C446 284 474 282 500 280", O, "#6a4020", 3);
      s += ps("gr", "M314 238 L316 278", Y, "#6a5a30", 8) + ps("olfs", "M328 236 L332 280", "#ffffff", "#8a9ab0", 1.4) + ps("olfb", "M330 240 L333 278", O, "#6a4020", 3.4);
      s += ps("coll", "M350 300 C368 330 388 350 424 362", "#ffffff", "#8a9ab0", 1.6) + ps("phg", "M322 302 C334 332 352 352 382 364", P, "#5a4a8a", 8);
      s += dot("unc2", 320, 298, 7, R, "#6a3040");
      s += T(312, 230, "rectus", "sm", "end") + T(396, 252, "ORBITAL part (front 1/3)", "sm") + T(382, 266, "orbital gyri", "sm mut") + T(346, 244, "olfactory sulcus", "sm", "start");
      s += T(460, 296, "stem of lateral sulcus", "sm", "middle") + T(430, 322, "TENTORIAL part (back 2/3)", "sm") + T(430, 350, "collateral sulcus", "sm", "start") + T(316, 318, "uncus", "sm", "end") + T(352, 372, "parahippocampal", "sm");
      // E. interpeduncular fossa and facts
      s += box(4, 394, 176, 110) + T(92, 406, "INTERPEDUNCULAR FOSSA", "sm mut");
      s += '<path class="pf" data-p="ipf" d="M92 414 L140 448 L92 496 L44 448 Z" style="--c:#b39cff;--r:#2a2448"/>';
      s += ps("ipf_ot", "M92 414 L44 448 M92 414 L140 448", Y, "#6a5a30", 3) + ps("ipf_cr", "M44 448 L92 496 M140 448 L92 496", O, "#6a4020", 3);
      s += dot("ipf_tc", 92, 432, 4, O, "#6a4020") + dot("ipf_mb", 84, 452, 4, O, "#6a4020") + dot("ipf_mb", 100, 452, 4, O, "#6a4020") + dot("ipf_pps", 92, 472, 5, G, GR);
      s += ps("ipf_n3", "M80 468 L60 482 M104 468 L124 482", G, GR, 1.8);
      s += T(40, 432, "optic tract", "sm", "end") + T(148, 432, "", "sm") + T(152, 478, "crus", "sm", "start") + T(92, 420, "chiasma", "sm");
      s += cell("ipf_b", 186, 394, 166, 36, ["BOUNDARIES: optic CHIASMA,", "optic TRACTS, CRURA, the", "upper border of the pons"], Y, YR);
      s += cell("ipf_c", 356, 394, 180, 36, ["CONTENTS: TUBER CINEREUM +", "infundibulum, MAMMILLARY bodies,", "POSTERIOR perforated s., III"], O, OR);
      s += cell("ipf_n", 186, 434, 350, 26, ["NOT in it: optic tract (a boundary), ANTERIOR perforated substance,", "lamina terminalis, olive, pineal, TROCHLEAR nerve"], R, RR);
      s += cell("ins_f", 186, 464, 350, 36, ["INSULA: conical, deep in the lateral sulcus, ringed by the CIRCULAR sulcus,", "hidden by the FRONTAL, PARIETAL and TEMPORAL opercula (no occipital);", "its apex is the LIMEN INSULAE (the pulvinar is the thalamus)"], P, PR);
      return s;
    };
    A.scene("sulci", {
      title: "Cerebral hemisphere · the sulci and gyri of each surface, the insula, the interpeduncular fossa",
      vb: "0 0 540 508",
      svg,
      intro: "Four views of one hemisphere: **superolateral** (central, lateral and intraparietal sulci), the **insula** with its opercula, the **medial** surface (cingulate sulcus and its branches) and the **inferior** surface (orbital and tentorial parts). Bottom: the **interpeduncular fossa**.",
      parts: {
        cs: ["Central sulcus (Rolando)", "Runs down and forwards from the upper border: **precentral** gyrus in front, **postcentral** behind. On the superolateral surface."],
        prec: ["Precentral gyrus", "Primary **motor** area (area 4)."],
        postc: ["Postcentral gyrus", "Primary **somatosensory** area (3, 1, 2)."],
        lat: ["Lateral sulcus (Sylvius)", "A deep cleft with a short anterior and ascending ramus and a long **posterior ramus**; separates the temporal lobe below from the frontal and parietal lobes above. The insula hides in its depth."],
        sts: ["Superior temporal sulcus", "Between the superior and middle temporal gyri: superolateral surface."],
        ips: ["Intraparietal sulcus", "Separates the **superior and inferior parietal lobules** (the inferior has the supramarginal and angular gyri)."],
        ifg: ["Inferior frontal gyrus (Broca)", "Broca's motor speech area (44, 45)."],
        op_f: ["Frontal operculum", "One of the lips of cortex covering the insula."],
        op_p: ["Parietal operculum", "Covers the insula from above and behind (fronto-parietal operculum)."],
        op_t: ["Temporal operculum", "Covers the insula from below."],
        circ: ["Circular sulcus", "Surrounds the insula."],
        ins: ["Insula", "A **conical** mass of grey matter hidden in the depth of the **lateral sulcus**; short gyri in front, long gyri behind."],
        lim: ["Limen insulae", "The **apex** of the insula, near the anterior perforated substance. Its apex is **not** the pulvinar (the back of the thalamus)."],
        cc3: ["Corpus callosum", "In the middle of the medial surface; the callosal sulcus separates it from the cingulate gyrus."],
        cingg: ["Cingulate gyrus", "Between the callosal and cingulate sulci."],
        cings: ["Cingulate sulcus", "Begins **below the rostrum** of the corpus callosum and runs back **parallel to it, a finger-breadth above**; ends by dividing into two branches."],
        marg: ["Marginal branch", "Turns up to the upper border behind the paracentral lobule."],
        subp: ["Subparietal (suprasplenial) branch", "The other terminal branch of the cingulate sulcus."],
        pcl2: ["Paracentral lobule", "Around the upper end of the central sulcus: the opposite **leg and foot**, and micturition."],
        pos: ["Parieto-occipital sulcus", "Separates the **precuneus** in front from the **cuneus** behind."],
        calc: ["Calcarine sulcus", "Below the cuneus: the primary visual cortex (area 17)."],
        orb: ["Orbital part of the inferior surface", "The **anterior 1/3**: rests on the orbital plate of the frontal bone (roof of the orbit), not on the tentorium."],
        tentp: ["Tentorial part", "The **posterior 2/3**: rests on the tentorium and the floor of the middle cranial fossa."],
        stemlat: ["Stem of the lateral sulcus", "Divides the inferior surface into orbital and tentorial parts."],
        gr: ["Gyrus rectus", "**Medial** to the olfactory sulcus."],
        olfs: ["Olfactory sulcus", "Near the medial border of the orbital surface; it lodges the olfactory bulb and tract."],
        olfb: ["Olfactory bulb and tract", "Lie in the olfactory sulcus (they belong to the olfactory system)."],
        coll: ["Collateral (occipitotemporal) sulcus", "On the tentorial surface, lateral to the parahippocampal gyrus."],
        phg: ["Parahippocampal gyrus", "Medial to the collateral sulcus; ends in front as the **uncus**."],
        unc2: ["Uncus", "The hooked front end of the parahippocampal gyrus."],
        ipf: ["Interpeduncular fossa", "A **diamond-shaped** space on the base of the brain."],
        ipf_ot: ["Optic chiasma and tracts", "The chiasma in front and the **optic tracts** anterolaterally are **boundaries**, not contents."],
        ipf_cr: ["Crura cerebri", "The posterolateral boundaries; the pons closes it behind."],
        ipf_tc: ["Tuber cinereum", "Grey bulge of the hypothalamus with the infundibulum attached: a content."],
        ipf_mb: ["Mammillary bodies", "Contents (hypothalamus)."],
        ipf_pps: ["Posterior perforated substance", "Inside the fossa, pierced by central branches of the posterior cerebral arteries."],
        ipf_n3: ["Oculomotor nerves", "Emerge into the fossa from the medial sides of the crura."],
        ipf_b: ["Boundaries of the interpeduncular fossa", "Optic chiasma in front, optic tracts anterolaterally, crura posterolaterally, the upper border of the pons behind."],
        ipf_c: ["Contents of the interpeduncular fossa", "Tuber cinereum with the infundibulum, **mammillary bodies**, **posterior** perforated substance, and the oculomotor nerves."],
        ipf_n: ["Not in the interpeduncular fossa", "The optic tract (a boundary), the **anterior** perforated substance, the lamina terminalis, the olive, the pineal and the **trochlear** nerve."],
        ins_f: ["The insula: facts", "Conical, deep in the lateral sulcus, surrounded by the **circular sulcus**, covered by the **frontal, parietal and temporal opercula** (no occipital operculum); apex = **limen insulae**."],
      },
      al: {
        cs: ["central sulcus", "sulcus of rolando"],
        prec: ["precentral gyrus"],
        postc: ["postcentral gyrus"],
        lat: ["lateral sulcus", "sylvian fissure", "posterior ramus", "posterior ramus of the lateral sulcus"],
        sts: ["superior temporal sulcus"],
        ips: ["intraparietal sulcus", "superior parietal lobule", "inferior parietal lobule"],
        ifg: ["inferior frontal gyrus"],
        op_f: ["frontal operculum"],
        op_p: ["parietal operculum", "fronto parietal operculum"],
        op_t: ["temporal operculum"],
        circ: ["circular sulcus"],
        ins: ["insula", "island of reil"],
        lim: ["limen insulae", "apex of the insula"],
        cc3: ["callosal sulcus"],
        cingg: ["cingulate gyrus"],
        cings: ["cingulate sulcus", "below the rostrum"],
        marg: ["marginal branch"],
        subp: ["subparietal", "suprasplenial"],
        pcl2: ["paracentral lobule"],
        pos: ["parieto occipital sulcus", "precuneus", "cuneus"],
        calc: ["calcarine sulcus", "calcarine"],
        orb: ["orbital surface", "orbital part", "orbital plate"],
        tentp: ["tentorial surface", "tentorial part"],
        stemlat: ["stem of the lateral sulcus"],
        gr: ["gyrus rectus"],
        olfs: ["olfactory sulcus"],
        olfb: ["olfactory bulb", "olfactory tract", "olfactory bulb and tract"],
        coll: ["collateral sulcus", "occipitotemporal sulcus"],
        phg: ["parahippocampal gyrus", "parahippocampal"],
        unc2: ["uncus"],
        ipf: ["interpeduncular fossa"],
        ipf_ot: ["boundaries of the interpeduncular"],
        ipf_cr: ["crura cerebri", "crus cerebri", "cerebral peduncles"],
        ipf_pps: ["posterior perforated substance"],
        ipf_n: ["anterior perforated substance"],
        ins_f: ["opercula", "operculum", "occipital operculum", "pulvinar"],
      },
      drill: ["cs", "prec", "postc", "lat", "ips", "ins", "circ", "lim", "op_t", "cings", "marg", "pcl2", "pos", "calc", "gr", "olfs", "unc2", "ipf_pps"],
      sims: [
        { id: "lat", label: "Superolateral", on: ["cs", "prec", "postc", "lat", "sts", "ips", "ifg"], info: "**Central**, **lateral** (with its posterior ramus), **intraparietal** and superior temporal sulci are all on the superolateral surface." },
        { id: "ins", label: "Insula", on: ["ins", "circ", "lim", "op_f", "op_p", "op_t", "ins_f"], info: "Deep in the **lateral sulcus**, ringed by the **circular sulcus**, hidden by **frontal, parietal and temporal** opercula; apex = **limen insulae**." },
        { id: "med", label: "Medial surface", on: ["cc3", "cingg", "cings", "marg", "subp", "pcl2", "pos", "calc"], info: "The **cingulate sulcus** starts below the rostrum, runs a finger-breadth above the callosum, ends in **marginal** and **subparietal** branches. Supplied by the **anterior** cerebral artery." },
        { id: "inf", label: "Inferior surface", on: ["orb", "tentp", "stemlat", "gr", "olfs", "olfb", "coll", "phg", "unc2"], info: "**Orbital** part (front 1/3) with the olfactory sulcus and **gyrus rectus** medial to it; **tentorial** part (back 2/3) with the parahippocampal gyrus and **uncus**." },
        { id: "ipf", label: "Interpeduncular fossa", on: ["ipf", "ipf_ot", "ipf_cr", "ipf_tc", "ipf_mb", "ipf_pps", "ipf_n3", "ipf_b", "ipf_c", "ipf_n"], info: "Boundaries: chiasma, optic tracts, crura, pons. Contents: tuber cinereum, **mammillary bodies**, **posterior** perforated substance, **III**." },
      ],
      secs: { "an-sulci-gyri#0": "lat", "an-sulci-gyri#1": "ins", "an-sulci-gyri#2": "med", "an-sulci-gyri#3": "inf", "an-base-of-brain#0": "ipf", "an-base-of-brain#1": "ipf" },
      rules: [
        [/insula|opercul/i, "ins"],
        [/interpeduncular/i, "ipf"],
        [/cingulate|medial surface|paracentral|calcarine|cuneus/i, "med"],
        [/orbital surface|inferior surface|gyrus rectus|olfactory sulcus|uncus/i, "inf"],
      ],
    });
  })();

  /* ═══════════════ 2. SOUND: DECIBELS AND MIDDLE-EAR AMPLIFICATION ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">SOUND · DECIBELS AND HOW THE MIDDLE EAR AMPLIFIES</text>' +
      box(4, 22, 512, 110) + T(260, 36, "THE DECIBEL SCALE (loudness = intensity, not frequency)", "sm mut") +
      '<path d="M24 76 L496 76" stroke="#6f8aa8" stroke-width="2" pointer-events="none"/>' +
      dot("db0", 34, 76, 7, G, GR) + T(34, 60, "0 dB", "sm") + T(34, 96, "threshold:", "sm") + T(34, 106, "just audible", "sm mut") +
      dot("db60", 190, 76, 7, B, BR) + T(190, 60, "60 dB", "sm") + T(190, 96, "conversation;", "sm") + T(190, 106, "pressure ×1000", "sm mut") +
      dot("db120", 346, 76, 7, O, OR) + T(346, 60, "120 dB", "sm") + T(346, 96, "discomfort", "sm") +
      dot("db140", 486, 76, 7, R, RR) + T(486, 60, "140 dB", "sm") + T(486, 96, "pain; hair cells", "sm") + T(486, 106, "damaged", "sm mut") +
      cell("dbf", 110, 112, 300, 16, ["dB = 20 log (P / P₀) for pressure · 10 log (I / I₀) for intensity"], Y, YR) +
      // middle ear
      box(4, 138, 512, 150) + T(260, 152, "MIDDLE EAR: AIR → FLUID (impedance matching)", "sm mut") +
      '<path class="pf" data-p="tm2" d="M40 180 C54 170 58 250 40 262 C30 240 30 196 40 180 Z" style="--c:#ffd166;--r:#6a5a30"/>' + T(40, 276, "drum 55 mm²", "sm") +
      ps("oss", "M52 206 L110 196 L150 220 L180 222", "#cfd8e3", "#6a7a8a", 5) + T(116, 186, "ossicles: lever ×1.3", "sm") +
      '<rect class="pf" data-p="ow2" x="180" y="212" width="8" height="22" rx="2" style="--c:#66e9ff;--r:#24384f"/>' + T(184, 250, "oval window", "sm") + T(184, 260, "3.2 mm²", "sm mut") +
      '<path d="M190 222 C230 200 250 250 290 222" stroke="#66e9ff" stroke-width="2" fill="none" pointer-events="none"/>' + T(248, 196, "cochlear fluid", "sm mut") +
      cell("amp", 300, 158, 210, 36, ["AMPLIFIES ≈ 22× in pressure:", "area ratio ≈ 17× + lever ≈ 1.3×", "(primary job of the ossicles)"], B, BR) +
      cell("att", 300, 198, 210, 36, ["ATTENUATION reflex: STAPEDIUS (VII)", "+ TENSOR TYMPANI (V3), 40–80 ms;", "facial palsy → HYPERACUSIS"], O, OR) +
      cell("eust", 300, 238, 210, 26, ["EUSTACHIAN tube equalizes air", "pressure on both sides of the drum"], G, GR) +
      cell("cond", 300, 268, 210, 16, ["ossicles lost → conductive loss 15–20 dB"], R, RR);
    A.scene("sound", {
      title: "Sound · the decibel scale and middle-ear amplification",
      vb: "0 0 520 292",
      svg,
      intro: "Top: the **decibel** scale (0 dB is the threshold; each ×1000 in pressure adds **60 dB**). Bottom: the drum-to-oval-window **area ratio** and the ossicular **lever** amplify about **22×**.",
      parts: {
        db0: ["0 dB", "The **threshold** of hearing: just audible, not inaudible."],
        db60: ["60 dB", "Normal conversation. A sound whose **pressure is 1000×** the threshold = 20 × 3 = **60 dB** (1000× the intensity would be 30 dB)."],
        db120: ["120 dB", "Discomfort."],
        db140: ["140 dB", "Pain: damages the auditory receptors (hair cells)."],
        dbf: ["The decibel", "Measures sound **intensity (loudness)**, not frequency: dB = 20 log₁₀ (P/P₀) for pressure, 10 log₁₀ for intensity. Each 20 dB = a 10× rise in pressure."],
        tm2: ["Tympanic membrane", "Effective area ≈ 55 mm²: the malleus touches it."],
        oss: ["Ossicles", "Their lever adds ≈ 1.3×; they touch the drum (malleus) and the oval window (stapes), not the round window."],
        ow2: ["Oval window", "≈ 3.2 mm²: the drum is ≈ 17× larger."],
        amp: ["Middle-ear amplification", "The **primary function of the ossicles is to amplify** (impedance matching air → fluid): ≈ 17× area ratio × ≈ 1.3× lever ≈ **22×** in pressure."],
        att: ["Attenuation reflex", "Loud sound → **stapedius (VII)** and **tensor tympani (V3)** contract after 40–80 ms: protects the cochlea, masks low-frequency background, dampens your own voice. Stapedius paralysis → **hyperacusis**."],
        eust: ["Auditory (Eustachian) tube", "Equalizes air pressure on the two sides of the drum (not the ossicles' job)."],
        cond: ["Loss of the ossicles", "Middle-ear disease of the ossicles → **conductive** deafness; hearing drops about 15–20 dB."],
      },
      al: {
        db0: ["0 db", "threshold of hearing"],
        db60: ["60 db", "1000 times the pressure", "pressure 1000 times"],
        db140: ["140 db", "damages the auditory receptors"],
        dbf: ["decibel", "decibels", "dib", "db"],
        tm2: ["tympanic membrane"],
        oss: ["ossicles", "auditory ossicles", "lever action", "bones of the middle ear"],
        ow2: ["oval window"],
        amp: ["amplify", "amplification", "impedance matching", "22 times", "17 times"],
        att: ["attenuation reflex", "stapedius", "tensor tympani", "hyperacusis"],
        eust: ["eustachian tube", "auditory tube", "equalize the pressure", "equalizing the pressure"],
        cond: ["conductive deafness"],
      },
      drill: ["db0", "db60", "db140", "dbf", "amp", "att", "eust"],
      sims: [
        { id: "db", label: "Decibels", on: ["db0", "db60", "db120", "db140", "dbf"], info: "0 dB = threshold; **pressure ×1000 = 60 dB**; 140 dB damages hair cells." },
        { id: "amp", label: "Amplification", on: ["tm2", "oss", "ow2", "amp"], info: "Drum 55 mm² / oval window 3.2 mm² ≈ 17× × lever 1.3× ≈ **22×**." },
      ],
      secs: { "ph-middle-ear#0": "db", "ph-middle-ear#1": "amp" },
      rules: [
        [/decibel|\bdb\b/i, "db"],
        [/amplif|ossicles/i, "amp"],
      ],
    });
  })();
})();
