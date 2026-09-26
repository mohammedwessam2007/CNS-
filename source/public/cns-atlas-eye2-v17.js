/* INTELLECTUALITY v17.3 · The eye, part 2: the eyeball in section (coats, angle, aqueous, lens, fovea, disc) with
 * the cornea and iris layers; the eyelid, tear film and lacrimal drainage; accommodation and the errors of
 * refraction. Drawn from standard histology and physiology in the notes' wording (hi-eye, ph-eye-fluid,
 * ph-optics, ph-refraction).
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { smooth, poly } = A;
  const { T, pf, ps, fl } = A.kit;
  const ld = (x1, y1, x2, y2) => '<path class="ld" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '"/>';
  const arr = (d, c) => '<path d="' + d + '" stroke="' + (c || "#d9ff43") + '" stroke-width="1.8" fill="none" marker-end="url(#ixArr)" pointer-events="none"/>';
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");
  const CX = 190, CY = 196;
  const P = (th, r) => [CX + r * Math.cos((th * Math.PI) / 180), CY + r * Math.sin((th * Math.PI) / 180)];
  // a band between radii r1 < r2 from angle a to b (degrees, increasing, may pass 360)
  const band = (a, b, r1, r2) => {
    const o = [], i = [];
    for (let t = a; t <= b + 0.01; t += 2) {
      o.push(P(t, r2));
      i.push(P(t, r1));
    }
    return poly(o.concat(i.reverse()));
  };

  /* ═══════════════ 1. THE EYEBALL: coats, angle, aqueous, lens, fovea · cornea and iris layers ═══════════════ */
  (function () {
    const globe =
      '<text class="ttl" x="176" y="16" text-anchor="middle">EYEBALL · HORIZONTAL SECTION (FRONT ON THE LEFT)</text>' +
      '<path class="pf" data-p="vit" d="' + band(160, 200, 0, 1) + '" style="--c:#0000;--r:#0000"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="110" fill="#10263b" pointer-events="none"/>' +
      '<path class="pf" data-p="vit" d="M150 110 C230 60 320 110 300 196 C320 282 230 332 150 282 C170 250 176 142 150 110 Z" style="--c:#66e9ff;--r:#122c44"/>' + T(230, 250, "vitreous", "sm mut") +
      '<path class="pf" data-p="scl" d="' + band(222, 498, 128, 140) + '" style="--c:#ffd166;--r:#e9e4da"/>' +
      '<path class="pf" data-p="cho" d="' + band(206, 514, 120, 128) + '" style="--c:#ff9f43;--r:#7a3a3a"/>' +
      '<path class="ps" data-p="bru" d="M' + P(206, 120).join(" ") + " A120 120 0 1 1 " + P(514, 120).join(" ") + '" style="--c:#d9ff43;--r:#caa15a;--w:1"/>' +
      '<path class="pf" data-p="ret" d="' + band(206, 514, 110, 120) + '" style="--c:#b39cff;--r:#8a6fa8"/>' +
      // cornea: more curved, bulging in front
      '<path class="pf" data-p="cor" d="M' + P(222, 140).join(" ") + " Q14 196 " + P(138, 140).join(" ") + " L" + P(138, 128).join(" ") + " Q28 196 " + P(222, 128).join(" ") + ' Z" style="--c:#66e9ff;--r:#bfe3f2"/>' +
      // angle: trabecular meshwork and canal of Schlemm at the limbus
      '<ellipse class="pf" data-p="sch" cx="' + P(222, 134)[0].toFixed(1) + '" cy="' + P(222, 134)[1].toFixed(1) + '" rx="5" ry="3" style="--c:#5ef0a0;--r:#3a5a8a"/><ellipse class="pf" data-p="sch" cx="' + P(138, 134)[0].toFixed(1) + '" cy="' + P(138, 134)[1].toFixed(1) + '" rx="5" ry="3" style="--c:#5ef0a0;--r:#3a5a8a"/>' +
      '<path class="pf" data-p="tm" d="M84 116 L92 110 L96 118 L88 124 Z M84 276 L92 282 L96 274 L88 268 Z" style="--c:#5ef0a0;--r:#8aa0a0"/>' +
      // ciliary body with processes and muscle
      '<path class="pf" data-p="cb" d="M92 110 L112 88 L122 96 L110 124 L100 128 Z M92 282 L112 304 L122 296 L110 268 L100 264 Z" style="--c:#ff9f43;--r:#9c5a4a"/>' +
      '<path class="pf" data-p="cmus" d="M100 108 L114 94 L118 100 L106 114 Z M100 284 L114 298 L118 292 L106 278 Z" style="--c:#ff5d8f;--r:#c46a7d"/>' +
      '<path class="pf" data-p="cproc" d="M104 124 l6 -4 l2 6 l6 -3 l-2 7 Z M104 268 l6 4 l2 -6 l6 3 l-2 -7 Z" style="--c:#5ef0a0;--r:#d9b56e"/>' +
      // iris with sphincter at the pupil margin and dilator radially
      '<path class="pf" data-p="iris" d="M92 120 L98 122 L100 170 L94 172 Z M92 272 L98 270 L100 222 L94 220 Z" style="--c:#ff9f43;--r:#6d4a3a"/>' +
      '<rect class="pf" data-p="isph" x="94" y="160" width="6" height="12" rx="2" style="--c:#ff5d8f;--r:#a0495b"/><rect class="pf" data-p="isph" x="94" y="220" width="6" height="12" rx="2" style="--c:#ff5d8f;--r:#a0495b"/>' +
      '<path class="ps" data-p="idil" d="M99 126 L99 158 M99 234 L99 266" style="--c:#66e9ff;--r:#8a6a5a;--w:1.4"/>' +
      // lens: capsule, anterior epithelium, zonules
      '<path class="pf" data-p="lens" d="M118 152 C104 164 102 228 118 240 C140 232 146 160 118 152 Z" style="--c:#fff6b0;--r:#e8e3c8"/>' +
      '<path class="ps" data-p="lcap" d="M118 152 C104 164 102 228 118 240 C140 232 146 160 118 152 Z" style="--c:#d9ff43;--r:#caa15a;--w:1.6"/>' +
      '<path class="ps" data-p="lepi" d="M114 158 C106 170 106 222 114 234" style="--c:#ff5d8f;--r:#c9a86a;--w:1.4"/>' +
      '<path class="ps" data-p="zon" d="M112 126 L118 152 M110 124 L126 154 M112 266 L118 240 M110 268 L126 238" style="--c:#66e9ff;--r:#a8b8c8;--w:.9"/>' +
      // chambers (tap targets)
      '<path class="pf" data-p="ac" d="M92 118 Q30 196 92 274 Z" style="--c:#66e9ff;--r:#15324c"/>' +
      '<path class="pf" data-p="pc" d="M100 128 L110 126 L114 150 L102 168 Z M100 264 L110 266 L114 242 L102 224 Z" style="--c:#66e9ff;--r:#1a3a56"/>' +
      // fovea on the visual axis, optic disc nasal to it, optic nerve
      '<path class="pf" data-p="fov" d="M' + P(-5, 110).join(" ") + " Q" + P(0, 104).join(" ") + " " + P(5, 110).join(" ") + '" style="--c:#ffd166;--r:#ffd166"/>' +
      '<path class="pf" data-p="disc" d="M' + P(-26, 108).join(" ") + " L" + P(-14, 108).join(" ") + " L" + P(-14, 142).join(" ") + " L" + P(-26, 142).join(" ") + ' Z" style="--c:#ff5d7a;--r:#f0c8b0"/>' +
      '<path class="pf" data-p="on" d="M' + P(-27, 140).join(" ") + " L" + (P(-27, 140)[0] + 52) + " " + (P(-27, 140)[1] - 22) + " L" + (P(-13, 140)[0] + 52) + " " + (P(-13, 140)[1] - 22) + " L" + P(-13, 140).join(" ") + ' Z" style="--c:#ff5d7a;--r:#d9c8a0"/>' +
      '<path d="M12 196 L300 196" stroke="#ffd166" stroke-width=".8" stroke-dasharray="3 4" pointer-events="none"/>' + T(26, 190, "visual axis", "sm mut", "start") +
      '<g class="ov" data-x="aq">' + arr("M112 124 L106 140", "#5ef0a0") + arr("M104 156 L98 180", "#5ef0a0") + arr("M92 190 L66 176 L78 132", "#5ef0a0") + arr("M80 128 L86 112", "#5ef0a0") + "</g>" +
      '<g class="ov" data-x="closed"><path d="M92 124 L70 118" stroke="#ff5d7a" stroke-width="4"/><path d="M92 268 L70 274" stroke="#ff5d7a" stroke-width="4"/>' + T(40, 330, "iris root pushed against the cornea: the ANGLE closes", "sm", "start") + "</g>" +
      // labels
      T(28, 96, "cornea", "sm", "start") + T(150, 44, "sclera (outer, white)", "sm") + T(236, 64, "choroid (middle)", "sm", "start") + T(262, 86, "retina (inner)", "sm", "start") +
      T(62, 72, "ciliary body", "sm", "start") + ld(84, 76, 110, 96) + T(24, 330, "", "sm") +
      T(118, 350, "canal of Schlemm + trabecular meshwork (angle)", "sm") + ld(118, 342, 90, 284) +
      T(138, 140, "lens", "sm", "start") + T(48, 216, "anterior", "sm mut") + T(48, 226, "chamber", "sm mut") +
      T(318, 196, "fovea", "sm", "start") + T(308, 140, "optic disc", "sm", "start") + T(346, 104, "optic nerve", "sm", "end");
    const layers = [
      ["cepi", "epithelium (non-keratinized)", 16, "#ffd166"],
      ["bow", "Bowman's: NO regeneration", 9, "#ff9f43"],
      ["str", "stroma (~90%, regular collagen)", 36, "#66e9ff"],
      ["des", "Descemet's: regenerates", 9, "#b39cff"],
      ["cend", "endothelium: water pump", 10, "#5ef0a0"],
    ];
    let y = 40;
    const cornea =
      '<rect x="356" y="24" width="160" height="166" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(436, 36, "CORNEA · 5 LAYERS (front on top)", "sm mut") +
      layers.map(([id, t, h, c]) => { const s = '<rect class="pf" data-p="' + id + '" x="364" y="' + y + '" width="40" height="' + h + '" style="--c:' + c + ';--r:#bfe3f2;--rs:#6f8aa8"/>' + T(410, y + h / 2 + 3, t, "sm", "start"); y += h + 4; return s; }).join("") +
      T(436, 148, "avascular, no lymphatics:", "sm mut") + T(436, 158, "grafts are rarely rejected", "sm mut") + T(436, 172, "transparent: regular collagen,", "sm mut") + T(436, 182, "dehydration, unmyelinated nerves", "sm mut");
    const iris =
      '<rect x="356" y="196" width="160" height="168" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(436, 208, "IRIS · front on top", "sm mut") +
      '<rect class="pf" data-p="iab" x="364" y="216" width="44" height="10" style="--c:#ffd166;--r:#8a6a4a"/>' + T(414, 224, "anterior border: fibroblasts,", "sm", "start") + T(414, 234, "melanocytes", "sm", "start") +
      '<rect class="pf" data-p="istr" x="364" y="228" width="44" height="54" style="--c:#ff9f43;--r:#5a3a30"/>' + '<circle cx="376" cy="260" r="3" fill="#c44b5f"/><circle cx="394" cy="274" r="3" fill="#c44b5f"/>' + T(414, 252, "stroma: LOOSE vascular", "sm", "start") + T(414, 262, "pigmented CT", "sm", "start") +
      '<rect class="pf" data-p="isph" x="366" y="270" width="20" height="8" rx="2" style="--c:#ff5d8f;--r:#a0495b"/>' + T(414, 276, "sphincter pupillae (III, para.)", "sm", "start") +
      '<rect class="pf" data-p="idil" x="364" y="284" width="44" height="6" style="--c:#66e9ff;--r:#6a8aa0"/>' + T(414, 290, "dilator (myoepithelial, symp.)", "sm", "start") +
      '<rect class="pf" data-p="ipe" x="364" y="292" width="44" height="14" style="--c:#b39cff;--r:#1a1010"/>' + T(414, 302, "posterior: 2 layers of", "sm", "start") + T(414, 312, "pigmented EPITHELIUM", "sm", "start") +
      T(436, 334, "ciliary processes: double", "sm mut") + T(436, 344, "epithelium; the inner non-", "sm mut") + T(436, 354, "pigmented layer secretes aqueous", "sm mut");
    A.scene("eyeball", {
      title: "The eyeball · three coats, the angle and the aqueous path, the lens, the fovea",
      vb: "0 0 520 372",
      svg: () => globe + cornea + iris,
      intro: "The eye in section with the front on the left; the insets zoom into the cornea and the iris. **▶ Aqueous** follows the fluid from where it is made to where it drains.",
      parts: {
        scl: ["Sclera", "The **outermost** fibrous coat (with the cornea): **dense, white, opaque**; no photoreceptors. Continuous with the cornea at the **limbus**."],
        cor: ["Cornea", "Transparent, **avascular**, the main refracting surface (~**43 D** of the eye's ~59 D)."],
        cho: ["Choroid", "Part of the **middle (vascular) coat**, the uvea: vascular, **rich in pigment**, with the choriocapillaris next to the retina."],
        bru: ["Bruch's membrane", "Between the choroid and the retinal pigment epithelium; five layers with **one elastic layer**; a barrier for the retina."],
        ret: ["Retina", "The **innermost** coat: the only one with **photoreceptors**."],
        vit: ["Vitreous body", "Transparent gel behind the lens; it does **not** set the intraocular pressure."],
        sch: ["Canal of Schlemm", "At the limbus: aqueous passes from the trabecular meshwork into it, then to the aqueous veins. In closed-angle glaucoma the **angle** closes, not the canal itself."],
        tm: ["Trabecular meshwork (spaces of Fontana)", "The drainage filter in the iridocorneal angle. **Glaucoma** = raised IOP from **increased resistance to outflow here**."],
        cb: ["Ciliary body", "Middle coat, between the iris and the choroid: the ciliary muscle and the ciliary processes; the zonules hang the lens from it."],
        cmus: ["Ciliary muscle", "**Contracts for near vision** (parasympathetic, III via the ciliary ganglion) → zonules slacken → the lens thickens. Relaxes for far vision."],
        cproc: ["Ciliary processes", "Covered by a **double epithelium**; the **inner non-pigmented layer actively secretes aqueous humour** into the **posterior chamber**."],
        iris: ["Iris", "The **anterior** part of the vascular coat, around the pupil."],
        isph: ["Sphincter pupillae", "Smooth muscle ring at the pupil margin, in the stroma: **parasympathetic** (III) → **miosis** (light reflex, near response)."],
        idil: ["Dilator pupillae", "**Myoepithelial** cells, radial: **sympathetic** → mydriasis."],
        lens: ["Lens", "**Avascular, no nerves**; transparent fibres packed with crystallins. **Cataract** = loss of transparency; **presbyopia** = loss of elasticity."],
        lcap: ["Lens capsule", "A thick **elastic** basement membrane: its elasticity rounds the lens when the zonules slacken."],
        lepi: ["Subcapsular epithelium", "**Simple cuboidal**, on the **anterior surface only**; forms new fibres at the equator."],
        zon: ["Zonule (suspensory ligaments)", "From the **ciliary body** (not the iris) to the lens capsule: tight at rest (thin lens), slack when the ciliary muscle contracts."],
        ac: ["Anterior chamber", "Between the cornea and the iris: aqueous from the pupil reaches the angle through it."],
        pc: ["Posterior chamber", "Between the iris and the lens: the aqueous is **secreted here** (not into the anterior chamber)."],
        fov: ["Fovea centralis (macula lutea)", "At the centre of the macula, a **depressed** spot on the posterior pole **opposite the centre of the lens**, on the **visual axis**: **cones only**, inner layers pushed aside → sharpest vision. Central painless loss with normal IOP = **macular degeneration**."],
        disc: ["Optic disc", "Where the axons leave: **no photoreceptors → the blind spot**; the central retinal vessels enter here. Raised IOP damages it (cupping)."],
        on: ["Optic nerve", "Glaucoma blinds by pressure on the optic nerve head."],
        cepi: ["Corneal epithelium", "**Stratified squamous non-keratinized**, 5–6 layers; superficial cells carry **microvilli** holding the tear film; rich in free **unmyelinated** nerve endings; many mitoses: it **regenerates quickly**."],
        bow: ["Bowman's (anterior limiting) membrane", "Acellular collagen: **protects** the cornea but **cannot regenerate**, so an injury leaves a **scar (opacity)** → corneal transplantation."],
        str: ["Stroma (substantia propria)", "About **90%** of the thickness: **regularly arranged** collagen lamellae with keratocytes: the basis of transparency."],
        des: ["Descemet's (posterior limiting) membrane", "The thick basement membrane of the endothelium; it **can regenerate**."],
        cend: ["Corneal endothelium", "**Simple squamous**: **pumps** fluid out → relative **dehydration** → transparency."],
        iab: ["Anterior border layer of the iris", "An incomplete layer of **fibroblasts and melanocytes** on the **anterior** surface."],
        istr: ["Iris stroma", "**Loose, vascular, pigmented** connective tissue, holding the sphincter pupillae."],
        ipe: ["Posterior pigment epithelium of the iris", "**Two layers of pigmented epithelium** cover the **posterior** surface."],
      },
      al: {
        scl: ["sclera", "white of the eye", "outermost layer", "outermost coat", "opaque and white", "fibrous coat", "limbus"],
        cor: ["cornea", "corneal", "refracting surface", "43 d", "focusing power", "corneal transparency", "corneal transplantation", "avascular", "non keratinized surface epithelium"],
        cho: ["choroid", "choroid layer", "vascular coat", "uvea", "choriocapillaris"],
        bru: ["bruch", "bruchs membrane", "separation of bruchs membrane"],
        ret: ["retina", "innermost layer", "innermost coat", "photoreceptor", "neural coat"],
        vit: ["vitreous", "vitreous humor", "vitreous body"],
        sch: ["canal of schlemm", "schlemm", "canal of shlemm", "aqueous vein"],
        tm: ["trabecular meshwork", "spaces of fontana", "fontana", "iridocorneal angle", "angle", "resistance to outflow", "outflow", "drainage of aqueous", "improper drainage", "glaucoma"],
        cb: ["ciliary body"],
        cmus: ["ciliary muscle", "contraction of ciliary muscle", "relaxation of ciliary muscle"],
        cproc: ["ciliary process", "ciliary epithelium", "aqueous humor", "aqueous humour", "secreted", "production of aqueous"],
        iris: ["iris", "vessels of the iris", "anterior part of the vascular coat"],
        isph: ["sphincter pupillae", "pupillae smooth muscle", "constrictor pupillae", "miosis", "pupillary constriction"],
        idil: ["dilator pupillae", "myoepithelial", "mydriasis", "pupil dilatation", "dilation of the pupil"],
        lens: ["lens", "crystallin", "lens fiber", "lens transparency", "cataract", "presbyopia", "lens elasticity"],
        lcap: ["lens capsule", "capsule of the lens", "loss of lens capsule elasticity", "elastic"],
        lepi: ["subcapsular epithelium", "subcapsular", "anterior surface only"],
        zon: ["zonule", "zonular fiber", "suspensory ligament", "suspensory"],
        ac: ["anterior chamber", "aqueous humor", "aqueous humour", "ultrafiltrate", "intraocular pressure", "intra ocular pressure", "glaucoma", "closed angle glaucoma"],
        pc: ["posterior chamber"],
        fov: ["fovea", "fovea centralis", "macula", "macula lutea", "yellow spot", "depressed spot", "macular degeneration", "visual axis"],
        disc: ["optic disc", "blind spot", "cupping"],
        on: ["optic nerve", "pressure on the optic nerve"],
        cepi: ["corneal epithelium", "non keratinized stratified squamous", "microvilli", "basal cells of the corneal epithelium", "mitotic figures", "few mitotic figures", "thin keratin layer"],
        bow: ["bowman", "bowmans membrane", "anterior limiting membrane", "corneal opacity", "opacity"],
        str: ["corneal stroma", "substantia propria", "regular arrangement of collagen", "collagen fibers are regularly packed", "regularly arranged"],
        des: ["descemet", "descemets membrane", "posterior limiting membrane"],
        cend: ["corneal endothelium", "endothelium", "corneal hydration", "dehydration", "corneal dehydration"],
        iab: ["anterior border layer", "fibroblasts and melanocytes"],
        istr: ["stroma of the iris", "loose vascular pigmented", "iris stroma"],
        ipe: ["pigmented epithelium", "posterior surface", "posterior pigment epithelium"],
      },
      drill: ["scl", "cor", "cho", "ret", "cb", "cproc", "iris", "lens", "zon", "tm", "sch", "fov", "disc", "bow", "des", "cepi"],
      sims: [
        { id: "aq", label: "▶ Aqueous", show: ["aq"], on: ["cproc", "pc", "ac", "tm", "sch"], info: "**Ciliary processes** actively secrete aqueous into the **posterior chamber** → through the **pupil** → **anterior chamber** → the angle → **trabecular meshwork** → **canal of Schlemm** → aqueous veins. It nourishes the **cornea and lens**; it is the **main regulator of IOP** (normal ≈ 15 mmHg)." },
        { id: "glauc", label: "Glaucoma", show: ["closed"], lost: ["tm"], on: ["disc", "on"], info: "**Glaucoma** = raised IOP from **increased trabecular outflow resistance** (not over-production) → optic-disc cupping → field loss. **Closed-angle**: the iris root blocks the **angle** (the canal of Schlemm itself is not closed): sudden pain, headache, halos, a mid-dilated fixed pupil." },
        { id: "coats", label: "Three coats", on: ["scl", "cor", "cho", "cb", "iris", "ret"], info: "**Outer** fibrous: sclera (opaque, white) + cornea. **Middle** vascular (uvea): choroid, ciliary body, iris. **Inner**: the retina, the only coat with photoreceptors." },
        { id: "cornea", label: "Cornea layers", on: ["cepi", "bow", "str", "des", "cend"], info: "Epithelium (non-keratinized, regenerates) → **Bowman's** (no regeneration: scar) → stroma (90%) → Descemet's (regenerates) → endothelium (pump). Avascular + no lymphatics = grafts rarely rejected." },
      ],
      secs: { "hi-eye#0": "cornea", "hi-eye#1": "aq", "hi-eye#2": "coats", "hi-eye#3": "", "hi-eye#6": "", "ph-eye-fluid#0": "aq", "ph-eye-fluid#1": "glauc", "ph-optics#0": "coats" },
      rules: [
        [/glaucoma|closed angle|trabecular|schlemm/i, "glauc"],
        [/aqueous|intra-?ocular pressure|iop/i, "aq"],
        [/bowman|descemet|corneal|cornea/i, "cornea"],
        [/coat|outermost|innermost|sclera|choroid|layer/i, "coats"],
      ],
    });
  })();

  /* ═══════════════ 2. EYELID, TEAR FILM, LACRIMAL DRAINAGE ═══════════════ */
  (function () {
    const lid =
      '<text class="ttl" x="84" y="14" text-anchor="middle">EYELID</text>' +
      '<path class="pf" data-p="skin" d="M40 30 L52 30 L52 250 L40 250 Z" style="--c:#ffd166;--r:#e6c3a8"/>' + T(40, 24, "skin", "sm", "end") +
      [60, 84, 108, 132, 156].map((y) => '<ellipse class="pf" data-p="oo" cx="62" cy="' + y + '" rx="7" ry="9" style="--c:#ff5d8f;--r:#8f3b4f"/>').join("") + T(58, 26, "orbicularis oculi", "sm", "start") +
      '<path class="pf" data-p="tars" d="M72 110 L100 110 L100 240 L72 240 Z" style="--c:#8fd3ff;--r:#d8d0c0"/>' +
      '<path class="pf" data-p="meib" d="M80 120 L92 120 L92 244 L80 244 Z" style="--c:#ffd166;--r:#e8c878"/>' + [134, 150, 166, 182, 198, 214].map((y) => '<circle cx="86" cy="' + y + '" r="3" fill="#b89a50" pointer-events="none"/>').join("") +
      '<path class="pf" data-p="conj" d="M100 30 L110 30 L110 250 L100 250 Z" style="--c:#66e9ff;--r:#c77a8a"/>' + [50, 80, 110, 140, 170, 200, 230].map((y) => '<ellipse class="pf" data-p="gob" cx="105" cy="' + y + '" rx="2.6" ry="4" style="--c:#fff;--r:#f3eef7"/>').join("") +
      '<path class="pf" data-p="lev" d="M72 30 L100 30 L100 104 L72 104 Z" style="--c:#b39cff;--r:#5a4a6a"/>' + T(86, 70, "levator +", "sm") + T(86, 80, "Müller", "sm") +
      '<path d="M44 250 C40 262 34 276 22 290 M50 252 C48 266 44 280 36 296" stroke="#3a2a20" stroke-width="2.4" fill="none" pointer-events="none"/>' +
      '<ellipse class="pf" data-p="zeis" cx="58" cy="262" rx="6" ry="4" style="--c:#ff9f43;--r:#d9a060"/>' + '<path class="pf" data-p="moll" d="M34 244 q-8 6 0 12 q8 6 0 12" style="--c:#b39cff;--r:#9d88c9" fill="none" stroke-width="2"/>' +
      T(64, 290, "lashes + Zeis", "sm", "start") + T(22, 240, "Moll", "sm", "end") + T(128, 170, "palpebral conjunctiva:", "sm", "start") + T(128, 180, "stratified columnar", "sm", "start") + T(128, 190, "+ goblet cells", "sm", "start") +
      T(86, 262, "tarsal plate +", "sm") + T(86, 272, "Meibomian glands", "sm");
    const tear =
      '<text class="ttl" x="262" y="14" text-anchor="middle">TEAR FILM</text>' +
      '<rect class="pf" data-p="tlip" x="196" y="40" width="132" height="12" rx="3" style="--c:#ffd166;--r:#c9a86a"/>' + T(262, 49, "LIPID (outer) ← Meibomian", "sm dk") +
      '<rect class="pf" data-p="taq" x="196" y="54" width="132" height="44" rx="3" style="--c:#66e9ff;--r:#3a6f9a"/>' + T(262, 74, "AQUEOUS (middle, thickest)", "sm") + T(262, 86, "← lacrimal gland (serous)", "sm") +
      '<rect class="pf" data-p="tmuc" x="196" y="100" width="132" height="12" rx="3" style="--c:#5ef0a0;--r:#5f8c77"/>' + T(262, 109, "MUCIN (inner) ← goblet cells", "sm dk") +
      '<rect x="196" y="114" width="132" height="16" fill="#bfe3f2" pointer-events="none"/>' + T(262, 125, "corneal epithelium (microvilli)", "sm dk");
    const lac =
      '<text class="ttl" x="450" y="14" text-anchor="middle">LACRIMAL APPARATUS</text>' +
      '<path d="M406 110 C426 80 496 80 518 110 C496 140 426 140 406 110 Z" fill="#1e3550" stroke="#6f8aa8" pointer-events="none"/>' + '<circle cx="462" cy="110" r="14" fill="#2a3f58" pointer-events="none"/>' +
      '<path class="pf" data-p="lgl" d="M492 40 C512 36 526 48 522 64 C514 74 496 72 488 62 C484 52 486 44 492 40 Z" style="--c:#66e9ff;--r:#8a7a9a"/>' + T(508, 32, "lacrimal gland", "sm") +
      ps("lgl", "M496 66 L488 88 M508 70 L502 90", "#66e9ff", "#8a7a9a", 1.2) +
      '<circle class="pf" data-p="punc" cx="414" cy="104" r="2.6" style="--c:#ffd166;--r:#ffd166"/><circle class="pf" data-p="punc" cx="414" cy="118" r="2.6" style="--c:#ffd166;--r:#ffd166"/>' +
      ps("can", "M414 104 L402 98 L388 104 M414 118 L402 124 L388 118", "#ffd166", "#c9a86a", 2) +
      '<path class="pf" data-p="sac" d="M376 96 C386 94 390 104 388 116 L388 136 L376 136 Z" style="--c:#ff9f43;--r:#a86a4a"/>' +
      '<path class="pf" data-p="nld2" d="M376 136 L388 136 L386 204 L378 204 Z" style="--c:#5ef0a0;--r:#4f8f6f"/>' +
      T(402, 90, "puncta · canaliculi", "sm", "start") + T(370, 118, "lacrimal sac", "sm", "end") + T(370, 170, "nasolacrimal duct", "sm", "end") + T(370, 180, "(pseudostratified", "sm", "end") + T(370, 190, "ciliated columnar)", "sm", "end") + T(382, 216, "→ inferior meatus", "sm") +
      '<g class="ov" data-x="flow">' + arr("M496 90 L456 104", "#66e9ff") + arr("M416 110 L392 110", "#66e9ff") + arr("M382 140 L382 198", "#66e9ff") + "</g>";
    const dz =
      cell("dz_stye", 196, 236, 90, 34, ["STYE (hordeolum):", "Zeis gland"], "#ff5d7a") +
      cell("dz_chal", 292, 236, 90, 34, ["CHALAZION:", "Meibomian gland"], "#ff5d7a") +
      cell("dz_conj", 388, 236, 90, 34, ["PINK EYE:", "conjunctivitis"], "#ff5d7a");
    A.scene("eyelid", {
      title: "Eyelid glands, the tear film, and where tears drain",
      vb: "0 0 540 300",
      svg: () => lid + tear + lac + dz,
      intro: "Which gland makes which layer of the tear film, and which one swells in a stye or a chalazion.",
      parts: {
        skin: ["Skin of the eyelid", "Outer surface: **keratinized** stratified squamous epithelium, very thin."],
        oo: ["Orbicularis oculi", "Closes the eye (facial nerve)."],
        tars: ["Tarsal plate", "Dense connective tissue stiffening the lid; holds the Meibomian glands."],
        meib: ["Meibomian (tarsal) glands", "Long **sebaceous** glands in the tarsal plate opening on the lid margin: the **lipid (outer) layer** of the tear film. Blocked and inflamed = **chalazion**."],
        conj: ["Palpebral conjunctiva", "**Stratified columnar epithelium with goblet cells**. Inflamed = **conjunctivitis** (pink eye: redness and watering)."],
        gob: ["Conjunctival goblet cells", "Make the **mucin (inner) layer** of the tear film: they share in forming it."],
        lev: ["Levator palpebrae superioris and Müller's muscle", "Raise the upper lid (III; sympathetic for Müller's)."],
        zeis: ["Glands of Zeis", "Small **sebaceous** glands opening into the **eyelash follicles**. Inflamed = **stye** (a small swelling at the lid margin)."],
        moll: ["Glands of Moll", "Modified (apocrine) **sweat** glands at the lid margin."],
        tlip: ["Lipid layer (outer)", "From the **Meibomian** glands: slows evaporation."],
        taq: ["Aqueous layer (middle)", "The **thickest** layer, from the **lacrimal gland**."],
        tmuc: ["Mucin layer (inner)", "From the **conjunctival goblet cells**: lets the tears wet the corneal microvilli."],
        lgl: ["Lacrimal gland", "**Serous** acini with myoepithelial cells, in the upper lateral orbit: the aqueous tears."],
        punc: ["Lacrimal puncta", "Tiny openings on the upper and lower lid margins near the medial angle."],
        can: ["Lacrimal canaliculi", "Carry tears from the puncta **to** the lacrimal sac."],
        sac: ["Lacrimal sac", "Receives the canaliculi and passes tears **down** into the nasolacrimal duct (not back to the canaliculi)."],
        nld2: ["Nasolacrimal duct", "Lined by **pseudostratified ciliated columnar** epithelium; drains tears to the nose, ending below the **inferior concha** (inferior meatus)."],
        dz_stye: ["Stye (external hordeolum)", "A small painful swelling at the lid margin: an infected **gland of Zeis**."],
        dz_chal: ["Chalazion", "A firm lump in the lid: inflammation of a **Meibomian** gland."],
        dz_conj: ["Pink eye", "Redness and watering: **conjunctivitis**."],
      },
      al: {
        skin: ["keratinized stratified squamous", "outer surface of the eyelid", "skin of the eyelid"],
        oo: ["orbicularis oculi"],
        tars: ["tarsal plate", "tarsus"],
        meib: ["meibomian", "meibomian gland", "tarsal gland", "chalazion"],
        conj: ["conjunctiva", "palpebral conjunctiva", "stratified columnar epithelium with goblet cells", "stratified columnar"],
        gob: ["goblet cell", "goblet cells of the conjunctiva", "conjunctival goblet"],
        lev: ["levator palpebrae", "muller muscle"],
        zeis: ["zeis", "glands of zeis", "zeis gland", "stye", "eyelash"],
        moll: ["moll", "glands of moll", "molls gland", "moll s gland"],
        tlip: ["lipid layer", "superficial lipid layer"],
        taq: ["aqueous layer", "thickest"],
        tmuc: ["mucin layer", "innermost mucin layer"],
        lgl: ["lacrimal gland", "serous acini"],
        punc: ["punctum", "puncta", "lacrimal puncta"],
        can: ["lacrimal canaliculi", "lacrimal canaliculus", "canaliculi"],
        sac: ["lacrimal sac"],
        nld2: ["nasolacrimal duct", "pseudostratified columnar ciliated", "pseudo stratified columnar ciliated"],
        dz_stye: ["stye", "hordeolum", "small swelling at the margin"],
        dz_chal: ["chalazion"],
        dz_conj: ["pink eye", "conjunctivitis", "inflammation of conjunctiva", "redness and watering"],
      },
      drill: ["meib", "zeis", "moll", "conj", "gob", "tlip", "taq", "tmuc", "lgl", "can", "sac", "nld2"],
      sims: [
        { id: "film", label: "Tear film", on: ["tlip", "taq", "tmuc", "meib", "lgl", "gob"], info: "**Lipid** (outer) ← Meibomian glands · **aqueous** (middle, thickest) ← lacrimal gland · **mucin** (inner) ← conjunctival goblet cells." },
        { id: "flow", label: "▶ Drainage", show: ["flow"], on: ["lgl", "punc", "can", "sac", "nld2"], info: "Lacrimal gland → across the eye → **puncta** → **canaliculi** → **lacrimal sac** → **nasolacrimal duct** → **inferior meatus**." },
        { id: "dz", label: "Stye vs chalazion", on: ["dz_stye", "zeis", "dz_chal", "meib", "dz_conj", "conj"], info: "Stye = **Zeis** gland; chalazion = **Meibomian** gland; pink eye = **conjunctivitis**." },
      ],
      secs: { "hi-eye#7": "film" },
      rules: [
        [/stye|chalazion|pink eye|inflammation of/i, "dz"],
        [/lacrimal (sac|canalicul)|nasolacrimal|punct/i, "flow"],
        [/tear|lipid layer|mucin|meibomian|goblet/i, "film"],
      ],
    });
  })();

  /* ═══════════════ 3. ACCOMMODATION AND THE ERRORS OF REFRACTION ═══════════════ */
  (function () {
    const eye = (x, near) => {
      const lens = near ? "M" + (x + 6) + " 58 C" + (x - 14) + " 70 " + (x - 14) + " 110 " + (x + 6) + " 122 C" + (x + 26) + " 110 " + (x + 26) + " 70 " + (x + 6) + " 58 Z" : "M" + (x + 6) + " 58 C" + (x - 4) + " 70 " + (x - 4) + " 110 " + (x + 6) + " 122 C" + (x + 16) + " 110 " + (x + 16) + " 70 " + (x + 6) + " 58 Z";
      return (
        '<circle cx="' + (x + 50) + '" cy="90" r="58" fill="#10263b" stroke="#e9e4da" stroke-width="4" pointer-events="none"/>' +
        '<path class="pf" data-p="' + (near ? "lensN" : "lensF") + '" d="' + lens + '" style="--c:#fff6b0;--r:#e8e3c8"/>' +
        '<path class="pf" data-p="' + (near ? "cmN" : "cmF") + '" d="M' + (x + 2) + " 40 l12 0 l0 " + (near ? 12 : 6) + " l-12 0 Z M" + (x + 2) + " 140 l12 0 l0 " + (near ? -12 : -6) + ' l-12 0 Z" style="--c:#ff5d8f;--r:#c46a7d"/>' +
        '<path class="ps" data-p="zon" d="M' + (x + 8) + " " + (near ? 52 : 46) + " L" + (x + 6) + " 58 M" + (x + 8) + " " + (near ? 128 : 134) + " L" + (x + 6) + ' 122" style="--c:#66e9ff;--r:#a8b8c8;--w:' + (near ? 0.8 : 1.6) + '"' + (near ? ' stroke-dasharray="2 2"' : "") + "/>" +
        '<path class="pf" data-p="' + (near ? "pupN" : "pupF") + '" d="M' + (x - 2) + " 58 L" + (x + 2) + " 58 L" + (x + 2) + " " + (near ? 82 : 72) + " L" + (x - 2) + " " + (near ? 82 : 72) + " Z M" + (x - 2) + " 122 L" + (x + 2) + " 122 L" + (x + 2) + " " + (near ? 98 : 108) + " L" + (x - 2) + " " + (near ? 98 : 108) + ' Z" style="--c:#ff9f43;--r:#6d4a3a"/>'
      );
    };
    const err = (id, x, len, focus, name, fix, c) => {
      const cx = x + 36;
      return (
        '<ellipse class="pf" data-p="' + id + '" cx="' + cx + '" cy="266" rx="' + len + '" ry="26" style="--c:' + c + ';--r:#10263b;--rs:#e9e4da"/>' +
        '<path d="M' + (x - 12) + " 250 L" + (cx - len + 8) + " 250 L" + (cx - len + 8 + focus) + " 266 M" + (x - 12) + " 282 L" + (cx - len + 8) + " 282 L" + (cx - len + 8 + focus) + ' 266" stroke="#ffd166" stroke-width="1.2" fill="none" pointer-events="none"/>' +
        '<circle cx="' + (cx - len + 8 + focus) + '" cy="266" r="2.6" fill="#ffd166" pointer-events="none"/>' +
        T(cx, 306, name, "sm") + T(cx, 318, fix, "sm mut")
      );
    };
    const svg = () =>
      '<text class="ttl" x="240" y="12" text-anchor="middle">ACCOMMODATION · FAR vs NEAR</text>' +
      eye(60, false) + T(210, 70, "FAR:", "big", "middle") + T(210, 84, "ciliary RELAXED", "sm") + T(210, 96, "zonule tight", "sm") + T(210, 108, "lens THIN", "sm") + T(210, 120, "pupil DILATED", "sm") +
      eye(270, true) + T(440, 70, "NEAR:", "big", "middle") + T(440, 84, "ciliary CONTRACTS", "sm") + T(440, 96, "(III, parasympathetic)", "sm") + T(440, 108, "zonule slack", "sm") + T(440, 120, "lens THICKER", "sm") + T(440, 132, "pupil small", "sm") +
      '<text class="ttl" x="240" y="198" text-anchor="middle">ERRORS OF REFRACTION · where parallel rays focus</text>' +
      T(240, 212, "(the dot = the focus; the right edge of each eye = the retina)", "sm mut") +
      err("emm", 16, 34, 68, "emmetropia", "focus ON the retina", "#5ef0a0") +
      err("myo", 110, 42, 58, "MYOPIA (long eye)", "in front → CONCAVE", "#ff5d7a") +
      err("hyp", 212, 28, 72, "HYPERMETROPIA (short)", "behind → CONVEX", "#ff9f43") +
      cell("ast", 316, 236, 76, 34, ["ASTIGMATISM:", "uneven cornea →", "cylindrical lens"], "#b39cff") +
      cell("pres", 398, 236, 76, 34, ["PRESBYOPIA:", "lens loses elasticity", "→ convex (reading)"], "#b39cff") +
      cell("pow", 316, 276, 158, 40, ["POWER ≈ 59 D: cornea ≈ 43 D", "(most); lens ≈ 15–20 D (variable)", "D = 1/f (m): f = 1 cm → 100 D"], "#66e9ff") +
      cell("triad", 16, 330, 150, 34, ["NEAR TRIAD: accommodation,", "convergence, miosis"], "#d9ff43") +
      cell("miosis", 172, 330, 150, 34, ["MIOSIS: depth of focus ↑,", "spherical + chromatic aberration ↓"], "#d9ff43") +
      cell("cat", 328, 330, 146, 34, ["CATARACT: lens opacity (protein", "denaturation) → remove, convex IOL"], "#ff5d7a") +
      cell("psi", 14, 370, 232, 44, ["PURKINJE–SANSON: THREE images of a candle:", "cornea (upright) · anterior lens (upright, big,", "SHRINKS for near) · posterior lens (small, INVERTED)"], "#66e9ff") +
      cell("amb", 250, 370, 104, 44, ["AMBLYOPIA: lazy eye,", "poor vision from", "disuse in childhood"], "#b39cff") +
      cell("fus", 358, 370, 116, 44, ["STRABISMUS: the two", "images not fused", "→ diplopia"], "#b39cff");
    A.scene("refract", {
      title: "Accommodation and the errors of refraction",
      vb: "0 0 480 418",
      svg,
      intro: "Top: what changes when you look from far to near. Bottom: where the image falls in each error, and which lens fixes it.",
      parts: {
        lensF: ["Lens for far vision", "**Thin**: the ciliary muscle is relaxed and the zonule pulls the capsule flat."],
        lensN: ["Lens for near vision", "**Thicker and more convex** (mainly its **anterior** surface) → more refractive power. The **lens** changes shape, not the cornea."],
        cmF: ["Ciliary muscle relaxed (far)", "Relaxed → the zonule is tight → thin lens."],
        cmN: ["Ciliary muscle contracted (near)", "Contracts (**parasympathetic** only, III via the ciliary ganglion) → the zonule slackens → the elastic lens rounds up."],
        zon: ["Zonule (suspensory ligaments)", "Tight for far vision, slack for near."],
        pupF: ["Pupil for far vision", "**Dilates** for far vision."],
        pupN: ["Pupil for near vision", "**Constricts** (miosis): part of the near response."],
        emm: ["Emmetropia", "Parallel rays focus **on** the retina without accommodation."],
        myo: ["Myopia (short sight)", "The eyeball is **too long** (or refraction too strong): rays focus **in front of** the retina. A near source focuses on the retina **without accommodation**; the near point is **closer**. Corrected with a **concave (diverging)** lens."],
        hyp: ["Hypermetropia (long sight)", "The eyeball is often **shorter**: rays focus **behind** the retina. It must **accommodate even for far vision**; its near point is **farther**, and it has **less** accommodation left for near. Corrected with a **convex** lens."],
        ast: ["Astigmatism", "**Non-uniform curvature of the cornea** → a cylindrical lens."],
        pres: ["Presbyopia", "The lens (capsule) **loses its elasticity** with age → the near point recedes; **total loss of accommodation by about 70**. Convex reading lenses."],
        pow: ["Refractive power", "**D = 1 / focal length in metres** (1 cm → **100 D**). The eye ≈ **59 D**: the **cornea gives most** (≈ 43 D); the lens ≈ 15–20 D and is the only variable part."],
        triad: ["Near response (triad)", "**Accommodation + convergence + miosis**. Ciliary muscle relaxation is **not** part of it. It runs through the cortex, so it survives a pretectal lesion (Argyll Robertson)."],
        miosis: ["Effects of miosis", "**Increases the depth of focus**, reduces spherical and **chromatic** aberration, cuts peripheral rays; less light enters."],
        psi: ["Purkinje–Sanson images", "A candle in front of the eye gives **three** images: from the cornea (upright), the **anterior** lens surface (large, upright) and the **posterior** lens surface (small, **inverted**). For near vision the anterior surface bulges, so its image becomes **smaller** and moves: proof that the lens accommodates."],
        amb: ["Amblyopia", "A 'lazy eye': poor vision from disuse in childhood (squint, unequal refraction). Not a loss of accommodation."],
        fus: ["Strabismus (squint)", "The eyes are not aligned, so the two images are **not fused** in the cortex → diplopia (or suppression). Not myopia."],
        cat: ["Cataract", "**Loss of lens transparency** from denaturation and coagulation of lens proteins (age, **diabetes**, **UV**, trauma, steroids). Treated by removing the lens and implanting a **convex** lens."],
      },
      al: {
        lensF: ["thinner lens", "thin lens", "far vision", "distant object", "decrease in the curvature"],
        lensN: ["thicker lens", "thick lens", "near vision", "near object", "increase in convexity", "increase in the curvature", "curvature of the lens", "anterior surface", "shape of the lens"],
        cmF: ["relaxation of ciliary muscle", "ciliary muscle relaxation", "ciliary muscle relaxes", "ciliary muscles relax"],
        cmN: ["contraction of ciliary muscle", "ciliary muscle contracts", "ciliary muscle", "parasympathetic innervation of ciliary muscle"],
        zon: ["suspensory ligament", "zonule"],
        pupF: ["dilation of the pupil", "pupil dilatation", "pupils dilate"],
        pupN: ["pupillary constriction", "constriction of the pupil", "pupils constrict"],
        emm: ["emmetropic", "emmetropia", "6 6 vision"],
        myo: ["myopia", "myopic", "short sight", "concave lens", "concave", "near point is closer"],
        hyp: ["hypermetropia", "hypermetropic", "hyperopia", "long sight", "convex lens", "shorter than the emmetropic", "range of accommodation", "near point is farther", "near point distance"],
        ast: ["astigmatism", "cylindrical lens", "curvature of the cornea"],
        pres: ["presbyopia", "loss of accommodation", "total loss of accommodation", "loss of lens elasticity"],
        pow: ["refractive power", "diopter", "diopters", "focal length", "power of the eye", "focusing power", "100"],
        triad: ["near response", "convergence", "near triad", "accommodation"],
        miosis: ["miosis", "depth of focus", "depth of field", "chromatic aberration", "spherical aberration", "reduces visual field"],
        psi: ["purkinje sanson", "purkinje sansons", "images of the candle", "image of the candle", "sanson"],
        amb: ["amblyopia", "lazy eye"],
        fus: ["strabismus", "squint", "not fused", "diplopia"],
        cat: ["cataract", "lens opacity", "loss of lens transparency", "denaturation", "coagulation of the proteins", "diabetes", "uvr", "ultraviolet"],
      },
      drill: ["lensN", "lensF", "cmN", "cmF", "myo", "hyp", "ast", "pres", "cat", "triad"],
      sims: [
        { id: "near", label: "Look near", on: ["lensN", "cmN", "pupN", "triad"], lost: ["lensF"], info: "**Near**: ciliary muscle **contracts** → zonule slack → lens **thicker** (more dioptres); pupil **constricts**; the eyes **converge**." },
        { id: "far", label: "Look far", on: ["lensF", "cmF", "pupF"], lost: ["lensN"], info: "**Far** (looking up from a book): ciliary muscle **relaxes** → zonule tight → lens **thinner**; the pupil **dilates**." },
        { id: "errors", label: "Errors", on: ["myo", "hyp", "ast", "pres"], info: "**Myopia**: long eye, focus in front → **concave**. **Hypermetropia**: short eye, focus behind → **convex**. **Astigmatism**: uneven cornea → cylindrical. **Presbyopia**: stiff lens → convex for reading." },
      ],
      secs: { "ph-refraction#0": "near", "ph-refraction#1": "near", "ph-refraction#2": "", "ph-refraction#3": "errors", "ph-refraction+accommodation-in-numbers-presbyopia-and-": "errors" },
      rules: [
        [/myopi|hypermetrop|hyperop|astigmat|presbyop/i, "errors"],
        [/far vision|distant|looks up|thinner lens|relax/i, "far"],
        [/near|accommodat|convergence|miosis/i, "near"],
      ],
    });
  })();
})();
