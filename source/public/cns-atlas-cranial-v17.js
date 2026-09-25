/* INTELLECTUALITY v17.3 · Cranial cavity: the falx cerebri and tentorium cerebelli with the dural venous sinuses
 * (sagittal view), and the cavernous sinus on a coronal cut with its contents, tributaries, drainage and
 * communications. Drawn from the notes' wording (an-cranial-cavity#0–#3).
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
  const V = "#6f9bff",
    VR = "#2a3a6a",
    G = "#5ef0a0",
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

  const svg = () => {
    let s = '<text class="ttl" x="270" y="14" text-anchor="middle">CRANIAL CAVITY · DURAL FOLDS, VENOUS SINUSES, THE CAVERNOUS SINUS</text>';
    // sagittal view
    s += box(4, 22, 296, 228) + T(152, 36, "SAGITTAL VIEW (left half removed)", "sm mut");
    s += '<path d="M20 156 C20 76 80 42 160 42 C240 42 290 86 292 156 C292 204 270 232 240 240 L60 240 C34 232 20 204 20 156 Z" fill="none" stroke="#cfd8e3" stroke-dasharray="4 3" opacity=".6" pointer-events="none"/>';
    s += '<path class="pf" data-p="falx" d="M42 168 C42 94 92 52 160 52 C220 52 262 90 262 136 L230 136 C216 126 196 120 160 120 C110 120 72 136 42 168 Z" style="--c:#b39cff;--r:#2e2a48"/>';
    s += T(150, 96, "FALX CEREBRI", "sm");
    s += ps("sss", "M46 156 C46 98 94 56 160 56 C218 56 256 92 258 132", V, VR, 4);
    s += ps("iss", "M64 148 C94 128 130 122 160 122 C190 122 208 126 222 132", V, VR, 3);
    s += ps("gcv", "M212 162 C218 150 222 140 226 134", G, GR, 2.4);
    s += ps("str", "M226 134 L266 158", V, VR, 4);
    s += ps("tent", "M268 162 C230 170 190 182 150 196", O, OR, 5);
    s += dot("conf", 268, 160, 6, V, VR);
    s += ps("trs", "M270 164 C290 176 290 192 278 204", V, VR, 4);
    s += ps("sig", "M278 204 C264 216 264 226 272 236", V, VR, 4);
    s += '<path class="pf" data-p="crista" d="M36 172 L42 156 L50 172 Z" style="--c:#cfd8e3;--r:#5a6a7a"/>';
    s += dot("clin", 150, 198, 4, "#cfd8e3", "#5a6a7a");
    s += T(62, 70, "superior sagittal", "sm", "middle") + T(118, 140, "inferior sagittal", "sm") + T(206, 176, "great cerebral v.", "sm", "end");
    s += T(240, 132, "straight", "sm", "end") + T(214, 196, "TENTORIUM", "sm") + T(262, 186, "transverse", "sm", "end") + T(260, 230, "sigmoid → IJV", "sm", "end");
    s += T(44, 188, "crista galli", "sm") + T(150, 214, "clinoid", "sm") + T(284, 150, "confluence", "sm", "end");
    // coronal cavernous
    s += box(306, 22, 230, 228) + T(421, 36, "CORONAL CUT: CAVERNOUS SINUS", "sm mut");
    s += '<ellipse class="pf" data-p="pit" cx="421" cy="126" rx="24" ry="14" style="--c:#ff9f43;--r:#5a3a20"/>' + T(421, 129, "pituitary", "sm");
    s += '<path class="pf" data-p="sph" d="M382 142 L460 142 L460 208 L382 208 Z" style="--c:#cfd8e3;--r:#3a4a5e"/>' + T(421, 176, "body of", "sm") + T(421, 186, "SPHENOID", "sm");
    s += ps("ics", "M380 118 C400 108 442 108 462 118 M380 136 C400 146 442 146 462 136", V, VR, 2);
    s += '<rect class="pf" data-p="cs" x="326" y="104" width="54" height="84" rx="14" style="--c:#6f9bff;--r:#1a2550"/><rect class="pf" data-p="cs" x="462" y="104" width="54" height="84" rx="14" style="--c:#6f9bff;--r:#1a2550"/>';
    s += dot("ica", 360, 146, 10, R, "#6a3040") + dot("ica", 482, 146, 10, R, "#6a3040") + T(360, 149, "ICA", "sm") + T(482, 149, "ICA", "sm");
    s += dot("n6", 342, 164, 5, Y, "#6a5a30") + dot("n6", 500, 164, 5, Y, "#6a5a30") + T(342, 182, "VI", "sm");
    s += dot("n3", 330, 112, 4, G, GR) + dot("n4", 330, 128, 4, G, GR) + dot("v1c", 330, 146, 4, B, BR) + dot("v2c", 330, 166, 4, B, BR);
    s += dot("n3", 512, 112, 4, G, GR) + dot("n4", 512, 128, 4, G, GR) + dot("v1c", 512, 146, 4, B, BR) + dot("v2c", 512, 166, 4, B, BR);
    s += T(322, 115, "III", "sm", "end") + T(322, 131, "IV", "sm", "end") + T(322, 149, "V1", "sm", "end") + T(322, 169, "V2", "sm", "end");
    s += dot("v3no", 346, 218, 6, O, "#6a4020") + T(356, 222, "V3: foramen ovale, NOT in the sinus", "sm", "start");
    s += T(421, 244, "lateral wall (top→bottom): III, IV, V1, V2", "sm mut");
    // facts
    s += cell("tent_b", 4, 256, 266, 46, ["TENTORIUM roofs the POSTERIOR fossa. ATTACHED border:", "transverse + sup. petrosal sinuses → POSTERIOR clinoid.", "FREE border: tentorial notch (midbrain) → ANTERIOR", "clinoid · III and IV pierce where the borders cross"], O, OR);
    s += cell("falx_b", 274, 256, 262, 46, ["FALX: front on the CRISTA GALLI, back on the UPPER", "surface of the tentorium · ATTACHED border = SUPERIOR", "sagittal, FREE border = INFERIOR sagittal · STRAIGHT", "sinus at the falx–tentorium JUNCTION (the base)"], P, PR);
    s += cell("sss_f", 4, 306, 266, 36, ["SUPERIOR SAGITTAL: superior cerebral veins, arachnoid", "granulations, diploic veins; PARIETAL emissary → scalp;", "usually continues as the RIGHT transverse sinus"], V, VR);
    s += cell("trs_f", 274, 306, 262, 36, ["TRANSVERSE: right = continuation of the SUPERIOR", "sagittal, left = of the STRAIGHT sinus; ends as the", "SIGMOID → internal jugular vein (jugular foramen)"], V, VR);
    s += cell("cs_pos", 4, 346, 176, 46, ["CAVERNOUS: MIDDLE fossa,", "each side of the sphenoid body", "and sella; PITUITARY MEDIAL;", "the sinus closest to it"], B, BR);
    s += cell("cs_trib", 184, 346, 176, 46, ["IN: sup. + inf. OPHTHALMIC", "veins, sphenoparietal sinus,", "superficial middle cerebral,", "central retinal v. (not maxillary)"], B, BR);
    s += cell("cs_drain", 364, 346, 172, 46, ["OUT: SUPERIOR petrosal →", "transverse sinus; INFERIOR", "petrosal → INTERNAL JUGULAR", "vein (not the transverse)"], B, BR);
    s += cell("cs_comm", 4, 396, 266, 36, ["LINKS: the OPPOSITE cavernous sinus (intercavernous),", "PTERYGOID plexus (emissary via foramen ovale),", "PHARYNGEAL plexus, facial vein via ophthalmic veins"], G, GR);
    s += cell("cs_thr", 274, 396, 262, 36, ["THROMBOSIS: 'dangerous area' of the face → ophthalmic", "veins (or pterygoid route) → fever, black eye,", "proptosis, INTERNAL squint (VI suffers first)"], R, RR);
    s += cell("bleed", 4, 436, 532, 22, ["BLEEDS: torn MIDDLE MENINGEAL artery (pterion) → EXTRADURAL · torn BRIDGING veins into the superior sagittal sinus → SUBDURAL"], R, RR);
    return s;
  };

  A.scene("cranial", {
    title: "Cranial cavity · falx, tentorium and the dural venous sinuses; the cavernous sinus",
    vb: "0 0 540 462",
    svg,
    intro: "Left: the **falx cerebri** and **tentorium** with the sinuses in their borders, draining to the confluence, transverse and sigmoid sinuses. Right: a coronal cut through the **cavernous sinus**: ICA and VI inside, III, IV, V1, V2 in the lateral wall.",
    parts: {
      falx: ["Falx cerebri", "Sickle-shaped fold in the longitudinal fissure: front end on the **crista galli**, back end on the **upper surface of the tentorium**."],
      sss: ["Superior sagittal sinus", "In the **attached (convex) upper border** of the falx. Receives the **superior cerebral veins**, arachnoid granulations and diploic veins; communicates with the scalp veins through the **parietal emissary foramina**; usually continues as the **right transverse sinus**. Torn bridging veins here → subdural haematoma."],
      iss: ["Inferior sagittal sinus", "In the **free (concave) lower border** of the falx; joins the great cerebral vein to form the straight sinus."],
      gcv: ["Great cerebral vein", "Joins the inferior sagittal sinus to form the straight sinus: it does **not** drain into the cavernous sinus."],
      str: ["Straight sinus", "Along the **junction of the falx with the tentorium** (the base of the falx), not in the free border; usually continues as the **left** transverse sinus."],
      tent: ["Tentorium cerebelli", "Roofs the **posterior cranial fossa** (over the cerebellum, under the occipital lobes)."],
      conf: ["Confluence of sinuses", "Where the superior sagittal and straight sinuses meet the transverse sinuses."],
      trs: ["Transverse sinus", "In the **attached** border of the tentorium; the right is usually the continuation of the **superior sagittal** sinus, the left of the **straight** sinus; ends as the **sigmoid** sinus."],
      sig: ["Sigmoid sinus", "Becomes the **internal jugular vein** at the jugular foramen."],
      crista: ["Crista galli", "The falx's front attachment."],
      clin: ["Clinoid processes", "The tentorium's **attached** border reaches the **posterior** clinoid; its **free** border runs to the **anterior** clinoid."],
      pit: ["Pituitary gland", "In the sella, **medial** to the cavernous sinus (not lateral)."],
      sph: ["Body of the sphenoid", "The cavernous sinus lies on **each side** of it (lateral to the sella), not above it."],
      ics: ["Intercavernous sinuses", "Connect the cavernous sinus with the **cavernous sinus of the opposite side**."],
      cs: ["Cavernous sinus", "In the **middle cranial fossa** on each side of the body of the sphenoid and the sella turcica, from the superior orbital fissure to the petrous apex: the dural sinus **closest to the pituitary**."],
      ica: ["Internal carotid artery", "Passes **through** the sinus with its sympathetic plexus."],
      n6: ["Abducent nerve (VI)", "Runs **free inside** the sinus, lateral to the ICA (not in the wall): the **first** nerve affected in thrombosis or a carotid aneurysm → **internal (medial) squint**."],
      n3: ["Oculomotor nerve (III)", "The highest nerve in the lateral wall."],
      n4: ["Trochlear nerve (IV)", "In the lateral wall, below III."],
      v1c: ["Ophthalmic nerve (V1)", "In the lateral wall, below IV."],
      v2c: ["Maxillary nerve (V2)", "The lowest nerve in the lateral wall."],
      v3no: ["Mandibular nerve (V3)", "**Not** related to the cavernous sinus: it leaves through the foramen ovale below."],
      tent_b: ["Borders of the tentorium", "**Attached** border: occipital bone (**transverse sinus**), petrous ridge (**superior petrosal sinus**), **posterior** clinoid. **Free** border: the tentorial notch, to the **anterior** clinoid. Where they cross, **III and IV pierce the dura** into the cavernous sinus wall."],
      falx_b: ["Borders of the falx", "Attached border = superior sagittal sinus; free border = inferior sagittal sinus; the straight sinus lies at the falx–tentorium junction."],
      sss_f: ["Superior sagittal sinus: facts", "Superior (not inferior) cerebral veins, arachnoid granulations, diploic veins; parietal emissary veins; continues as the right transverse sinus."],
      trs_f: ["Transverse sinus: facts", "Right = continuation of the superior sagittal sinus (not the straight sinus); left = straight sinus; ends as the sigmoid → internal jugular vein."],
      cs_pos: ["Cavernous sinus: position", "In the **middle** (not anterior) cranial fossa, **lateral** to the sella turcica and the body of the sphenoid; pituitary **medial**."],
      cs_trib: ["Cavernous sinus: tributaries", "**Superior and inferior ophthalmic veins**, sphenoparietal sinus, **superficial middle cerebral vein**, central vein of the retina. **Not** the maxillary veins or the great cerebral vein."],
      cs_drain: ["Cavernous sinus: drainage", "**Superior petrosal sinus** → transverse sinus; **inferior petrosal sinus** → **internal jugular vein** at the jugular foramen (not the transverse sinus)."],
      cs_comm: ["Cavernous sinus: communications", "The **opposite cavernous sinus** (intercavernous sinuses), the **pterygoid venous plexus** (emissary veins through the foramen ovale), the **pharyngeal plexus**, and the facial vein via the ophthalmic veins; not the vertebral plexus."],
      cs_thr: ["Cavernous sinus thrombosis", "Infection from the **dangerous area of the face** reaches the sinus along the **ophthalmic** veins (or the deep facial → pterygoid plexus → foramen ovale route): fever, black eye, proptosis, **internal squint** (VI first)."],
      bleed: ["Bleeds around the dura", "Torn **middle meningeal** artery or vein (pterion fracture) → **extradural** haemorrhage. Torn **bridging veins** entering the superior sagittal sinus → **subdural** haematoma."],
    },
    al: {
      falx: ["falx cerebri", "falx"],
      sss: ["superior sagittal sinus", "superior sagittal"],
      iss: ["inferior sagittal sinus", "inferior sagittal"],
      gcv: ["great cerebral vein", "vein of galen"],
      str: ["straight sinus"],
      tent: ["tentorium cerebelli", "tentorium", "roof of the posterior cranial fossa"],
      conf: ["confluence of sinuses", "confluence"],
      trs: ["transverse sinus", "transverse venous sinus"],
      sig: ["sigmoid sinus"],
      crista: ["crista galli"],
      clin: ["anterior clinoid", "posterior clinoid", "anterior clinoid process", "posterior clinoid process"],
      pit: ["pituitary", "pituitary gland", "hypophysis"],
      sph: ["body of the sphenoid", "sphenoid"],
      ics: ["intercavernous", "cavernous sinus of the opposite side"],
      cs: ["cavernous sinus", "cavernous"],
      n6: ["abducent nerve inside", "internal squint", "medial squint"],
      v3no: ["mandibular nerve is not"],
      tent_b: ["attached border", "free border", "tentorial notch"],
      falx_b: ["inferior free concave border", "upper attached border", "base of the falx", "line of junction"],
      sss_f: ["superior cerebral veins", "arachnoid granulations", "parietal emissary", "parietal emissary foramina", "diploic veins", "right transverse sinus"],
      trs_f: ["continuation of the straight sinus", "continuation of the superior sagittal"],
      cs_pos: ["middle cranial fossa", "anterior cranial fossa", "sella turcica", "lateral to the sella turcica", "closest to the pituitary gland"],
      cs_trib: ["ophthalmic veins", "ophthalmic vein", "superior ophthalmic vein", "inferior ophthalmic vein", "sphenoparietal sinus", "superficial middle cerebral vein", "maxillary veins", "central vein of the retina"],
      cs_drain: ["superior petrosal sinus", "inferior petrosal sinus", "petrosal sinuses", "superior and inferior petrosal sinuses", "internal jugular vein"],
      cs_comm: ["pterygoid plexus", "pterygoid venous plexus", "pharyngeal plexus", "emissary vein", "vertebral venous plexus"],
      cs_thr: ["cavernous sinus thrombosis", "dangerous area", "dangerous area of the face", "thrombus", "proptosis"],
      bleed: ["extradural", "extradural hemorrhage", "subdural", "subdural hematoma", "bridging veins", "middle meningeal"],
    },
    drill: ["falx", "sss", "iss", "str", "tent", "trs", "sig", "cs", "ica", "n6", "n3", "v2c", "v3no", "cs_trib", "cs_drain", "cs_comm", "bleed"],
    sims: [
      { id: "folds", label: "Falx and tentorium", on: ["falx", "tent", "crista", "clin", "tent_b", "falx_b"], info: "Falx: crista galli → upper surface of the tentorium. Tentorium roofs the **posterior** fossa; attached border → **posterior** clinoid, free border → **anterior** clinoid." },
      { id: "sinus", label: "▶ Venous flow", on: ["sss", "iss", "gcv", "str", "conf", "trs", "sig", "sss_f", "trs_f"], info: "Superior sagittal (attached border) and straight sinus (inferior sagittal + great cerebral vein) → confluence → **transverse** → **sigmoid** → internal jugular vein." },
      { id: "cav", label: "Cavernous sinus", on: ["cs", "pit", "sph", "ica", "n6", "n3", "n4", "v1c", "v2c", "v3no", "ics", "cs_pos"], info: "Middle fossa, each side of the sphenoid body; pituitary **medial**. **Inside**: ICA and **VI**. **Lateral wall**: III, IV, V1, V2. V3 is not related." },
      { id: "links", label: "In, out and links", on: ["cs", "cs_trib", "cs_drain", "cs_comm", "cs_thr", "ics"], info: "In: **ophthalmic** veins, sphenoparietal, superficial middle cerebral. Out: **superior petrosal** → transverse, **inferior petrosal** → **IJV**. Links: opposite sinus, **pterygoid** and pharyngeal plexuses." },
    ],
    secs: { "an-cranial-cavity#0": "folds", "an-cranial-cavity#1": "folds", "an-cranial-cavity#2": "cav", "an-cranial-cavity#3": "links" },
    rules: [
      [/cavernous/i, "cav"],
      [/sagittal|transverse sinus|straight sinus|sigmoid/i, "sinus"],
      [/falx|tentorium/i, "folds"],
    ],
  });
})();
