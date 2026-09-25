/* INTELLECTUALITY v17.3 · The ear, part 2 (the labyrinth, maculae, cristae and the hair-cell rule; external and
 * middle ear histology, the auditory tube, deafness and the hearing codes), and brain states (the EEG and sleep;
 * synaptic memory and LTP). Drawn from standard histology and physiology in the notes' wording (hi-ear,
 * ph-vestibular, ph-inner-ear, ph-sleep, ph-memory).
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
  const arr = (d, c) => '<path d="' + d + '" stroke="' + (c || "#d9ff43") + '" stroke-width="1.8" fill="none" marker-end="url(#ixArr)" pointer-events="none"/>';
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");
  const spiral = (cx, cy, r0, turns) => {
    let d = "";
    for (let i = 0; i <= turns * 36; i++) {
      const a = (i / 36) * Math.PI * 2, r = r0 * (1 - i / (turns * 36) * 0.78);
      d += (i ? " L" : "M") + (cx + r * Math.cos(a)).toFixed(1) + " " + (cy + r * Math.sin(a)).toFixed(1);
    }
    return d;
  };

  /* ═══════════════ 1. THE LABYRINTH: cochlea, vestibule, canals · maculae, cristae · the hair-cell rule ═══════════════ */
  (function () {
    const lab =
      '<text class="ttl" x="130" y="14" text-anchor="middle">MEMBRANOUS LABYRINTH (ENDOLYMPH)</text>' +
      '<path d="M18 200 C10 110 60 40 150 40 C230 40 262 110 250 190 C240 270 190 336 110 336 C50 336 24 280 18 200 Z" fill="none" stroke="#6f8aa8" stroke-width="1.4" stroke-dasharray="5 4" pointer-events="none"/>' + T(14, 36, "bony labyrinth (dashed): perilymph", "sm mut", "start") +
      '<path class="ps" data-p="coch" d="' + spiral(86, 262, 50, 2.5) + '" style="--c:#66e9ff;--r:#5a8ab8;--w:7"/>' + T(86, 326, "cochlear duct (2½ turns)", "sm") +
      '<ellipse class="pf" data-p="sac" cx="148" cy="226" rx="16" ry="12" style="--c:#5ef0a0;--r:#4f8f6f"/>' + T(148, 250, "saccule", "sm") +
      '<ellipse class="pf" data-p="utr" cx="176" cy="172" rx="22" ry="14" style="--c:#5ef0a0;--r:#4f8f6f"/>' + T(176, 194, "utricle", "sm") +
      ps("coch", "M128 238 L138 232", "#66e9ff", "#5a8ab8", 3) +
      ps("eds", "M160 200 C150 190 128 160 104 150 C92 146 84 150 80 158", "#ffd166", "#a88a4e", 3) + '<ellipse class="pf" data-p="eds" cx="76" cy="164" rx="8" ry="6" style="--c:#ffd166;--r:#a88a4e"/>' + T(60, 146, "endolymphatic sac", "sm", "end") +
      ps("asc", "M170 160 C150 110 160 60 196 58 C230 58 238 110 196 160", "#b39cff", "#8f7fc1", 5) + T(208, 50, "anterior", "sm") +
      ps("psc", "M190 166 C226 142 250 110 244 86", "#b39cff", "#8f7fc1", 5) + T(238, 70, "posterior", "sm", "end") +
      ps("lsc", "M196 176 C236 176 250 204 232 222 C212 240 186 214 192 186", "#b39cff", "#8f7fc1", 5) + T(238, 252, "lateral", "sm", "end") +
      [[176, 128], [224, 104], [234, 200]].map(([x, y]) => '<ellipse class="pf" data-p="amp" cx="' + x + '" cy="' + y + '" rx="8" ry="6" style="--c:#ff9f43;--r:#b8646f"/>').join("") + T(150, 124, "ampullae", "sm", "end") +
      '<ellipse class="pf" data-p="ow" cx="118" cy="196" rx="6" ry="4" style="--c:#5ef0a0;--r:#1a0f14"/>' + T(98, 190, "oval w.", "sm", "end") +
      '<ellipse class="pf" data-p="rw" cx="116" cy="290" rx="5" ry="4" style="--c:#5ef0a0;--r:#1a0f14"/>' + T(126, 300, "round w.", "sm", "start") +
      ps("vnrv", "M176 186 C160 200 150 206 132 208 L112 214", "#ffd166", "#6f8aa8", 2) + ps("cnrv", "M86 262 L60 282 L40 290", "#ffd166", "#6f8aa8", 2);
    const mac =
      '<rect x="266" y="24" width="228" height="150" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(380, 36, "MACULA (utricle, saccule)", "sm mut") +
      '<rect class="pf" data-p="otm" x="276" y="44" width="160" height="22" rx="4" style="--c:#ffd166;--r:#6a6a8a"/>' + [288, 300, 314, 328, 342, 356, 370, 384, 398, 412, 424].map((x, i) => '<rect class="pf" data-p="oto" x="' + (x - 3) + '" y="' + (46 + (i % 2) * 4) + '" width="7" height="5" rx="1" style="--c:#fff;--r:#e8e3d8"/>').join("") +
      T(446, 52, "otoconia", "sm", "start") + T(446, 62, "(CaCO₃)", "sm", "start") +
      [[296, "hc1"], [340, "hc2"], [384, "hc1"], [420, "hc2"]].map(([x, id]) => (id === "hc1" ? '<path class="pf" data-p="hc1" d="M' + (x - 8) + " 110 C" + (x - 10) + " 92 " + (x - 4) + " 80 " + x + " 80 C" + (x + 4) + " 80 " + (x + 10) + " 92 " + (x + 8) + ' 110 Z" style="--c:#66e9ff;--r:#8fb4c9"/>' : '<rect class="pf" data-p="hc2" x="' + (x - 6) + '" y="80" width="12" height="28" rx="3" style="--c:#b39cff;--r:#9d88c9"/>') + '<path d="M' + (x - 4) + " 80 L" + (x - 4) + " 68 M" + x + " 80 L" + x + " 66 M" + (x + 4) + " 80 L" + (x + 4) + ' 64" stroke="#e8e3d8" stroke-width="1.2" pointer-events="none"/><path class="ps" data-p="kin" d="M' + (x + 7) + " 80 L" + (x + 7) + ' 60" style="--c:#ff5d7a;--r:#ff9f43;--w:1.6"/>').join("") +
      [318, 362, 402].map((x) => '<rect class="pf" data-p="supc" x="' + (x - 7) + '" y="84" width="14" height="40" rx="2" style="--c:#5ef0a0;--r:#2a3f58"/>').join("") +
      T(296, 126, "type I", "sm") + T(340, 126, "type II", "sm") + T(446, 90, "kinocilium", "sm", "start") + T(446, 102, "+ stereocilia", "sm", "start") + T(362, 138, "supporting cells (microvilli)", "sm mut") +
      '<path class="pf" data-p="cup" d="M280 160 C286 142 312 138 330 144 L330 170 L280 170 Z" style="--c:#66e9ff;--r:#3a5a7a"/>' + T(336, 158, "CRISTA: cupula, no CaCO₃", "sm", "start") + T(336, 168, "(angular acceleration)", "sm mut", "start");
    const rule =
      '<rect x="266" y="182" width="228" height="104" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(380, 194, "THE HAIR-CELL RULE", "sm mut") +
      '<rect class="pf" data-p="hcr" x="358" y="232" width="24" height="40" rx="6" style="--c:#66e9ff;--r:#8fb4c9"/>' +
      [360, 366, 372].map((x, i) => '<path d="M' + x + " 232 L" + x + " " + (220 - i * 3) + '" stroke="#e8e3d8" stroke-width="1.6"/>').join("") + '<path class="ps" data-p="kin" d="M378 232 L378 208" style="--c:#ff5d7a;--r:#ff9f43;--w:2"/>' +
      '<g class="ov" data-x="toK">' + arr("M350 214 L392 214", "#5ef0a0") + "</g>" + '<g class="ov" data-x="awayK">' + arr("M392 214 L350 214", "#ff5d7a") + "</g>" +
      cell("dep", 394, 222, 94, 30, ["TOWARDS kinocilium:", "K⁺ in → depolarize ↑"], "#5ef0a0") + cell("hyp", 272, 222, 80, 30, ["AWAY: hyper-", "polarize, firing ↓"], "#ff5d7a") +
      T(380, 282, "at rest they fire all the time, so firing goes up or down", "sm mut");
    const chips =
      cell("perp", 266, 292, 110, 38, ["UTRICLE horizontal,", "SACCULE vertical:", "at right angles"], "#5ef0a0") +
      cell("lin", 382, 292, 112, 38, ["maculae: head TILT +", "LINEAR acceleration;", "canals: ANGULAR"], "#5ef0a0") +
      cell("copl", 266, 334, 110, 38, ["COPLANAR pairs: both", "horizontal; anterior +", "opposite posterior"], "#b39cff") +
      cell("calor", 382, 334, 112, 38, ["CALORIC test: water in", "ONE ear → currents in", "its horizontal canal"], "#ff9f43") +
      cell("endo", 8, 342, 250, 28, ["ENDOLYMPH: high K⁺, from the stria vascularis, +80 mV;", "perilymph (scala vestibuli, TYMPANI) like ECF"], "#66e9ff");
    A.scene("labyr", {
      title: "The labyrinth · maculae and cristae, and the hair-cell rule",
      vb: "0 0 500 378",
      svg: () => lab + mac + rule + chips,
      intro: "Left: the membranous labyrinth. Right: what sits in a macula and a crista, and which way a hair cell must bend to fire more.",
      parts: {
        coch: ["Cochlear duct (scala media)", "Part of the membranous labyrinth, **2½ turns** round the modiolus (which holds the **spiral ganglion**). The hearing receptor."],
        sac: ["Saccule", "Macula **vertical**: most sensitive to **vertical** linear acceleration (a lift)."],
        utr: ["Utricle", "Macula mainly **horizontal**: horizontal linear acceleration and head tilt. The utricle belongs to the **membranous** labyrinth."],
        eds: ["Endolymphatic duct and sac", "Where endolymph is absorbed."],
        asc: ["Anterior semicircular duct", "Coplanar with the **opposite posterior** duct."],
        psc: ["Posterior semicircular duct", "Coplanar with the opposite anterior duct."],
        lsc: ["Lateral (horizontal) semicircular duct", "The two horizontal ducts are a **coplanar pair**; the one stimulated by the **caloric test**."],
        amp: ["Ampullae", "Each holds a **crista ampullaris** with its cupula: **angular** acceleration."],
        ow: ["Oval window", "Closed by the footplate of the stapes."],
        rw: ["Round window", "Closed by the secondary tympanic membrane."],
        vnrv: ["Vestibular nerve", "Cell bodies in the vestibular (Scarpa's) ganglion (bipolar)."],
        cnrv: ["Cochlear nerve", "Cell bodies in the spiral ganglion (bipolar)."],
        otm: ["Otolithic membrane", "A gelatinous proteoglycan layer carrying **CaCO₃ otoconia** on top of the macular hair cells (not a 'tectorial membrane')."],
        oto: ["Otoconia (otoliths)", "Calcium carbonate crystals: heavy, so gravity and linear acceleration slide the membrane."],
        hc1: ["Type I hair cells", "Flask-shaped, wrapped by a nerve **calyx**."],
        hc2: ["Type II hair cells", "Cylindrical."],
        kin: ["Kinocilium", "One tall true cilium (**microtubule** core) beside the stereocilia (actin core)."],
        supc: ["Supporting cells", "Columnar, with apical **microvilli** (no motile cilia)."],
        cup: ["Crista ampullaris and cupula", "The **cupula** is a thick proteoglycan membrane **without CaCO₃**; pushed by endolymph during **angular** acceleration."],
        hcr: ["Vestibular hair cell", "Stereocilia + one kinocilium; bathed at the top in K⁺-rich endolymph."],
        dep: ["Bending towards the kinocilium", "Opens tip-link channels → **K⁺ flows in** from endolymph → **depolarization** → more transmitter → **more firing**."],
        hyp: ["Bending away from the kinocilium", "**Hyperpolarization** → less firing."],
        perp: ["Utricle and saccule at right angles", "Utricular macula horizontal, saccular vertical: **perpendicular**, not parallel."],
        lin: ["What each organ senses", "**Maculae**: head position (tilt, gravity) and **linear** acceleration; tilting changes the **pattern** of their discharge. **Canals**: **angular** acceleration; they start nystagmus."],
        copl: ["Coplanar canals", "The two **horizontal** canals; each **anterior** with the **opposite posterior**."],
        calor: ["Caloric test", "Warm or cold water in one ear sets up convection currents in its **horizontal canal** → nystagmus: tests **one canal of one ear**."],
        endo: ["Endolymph and perilymph", "**Endolymph** (membranous labyrinth, scala media): **high K⁺**, made by the **stria vascularis**, **+80 mV**. **Perilymph** (bony labyrinth: scala vestibuli and **scala tympani**) is like ECF."],
      },
      al: {
        coch: ["cochlear duct", "scala media", "cochlea", "membranous labyrinth", "2 turns", "modiolus"],
        sac: ["saccule", "saccular", "vertical linear", "lift"],
        utr: ["utricle", "utricular", "horizontal linear"],
        eds: ["endolymphatic sac", "endolymphatic duct"],
        asc: ["anterior semicircular", "anterior canal", "anterior sccs"],
        psc: ["posterior semicircular", "posterior canal"],
        lsc: ["horizontal canal", "lateral canal", "horizontal semicircular", "lateral semicircular"],
        amp: ["ampulla", "ampullae", "semicircular canal", "semicircular duct", "sccs", "scc"],
        ow: ["oval window"],
        rw: ["round window", "secondary tympanic membrane"],
        vnrv: ["vestibular nerve", "vestibular ganglion", "scarpa"],
        cnrv: ["cochlear nerve", "spiral ganglion"],
        otm: ["otolithic membrane", "otolith membrane", "gelatinous layer"],
        oto: ["otoconia", "otolith", "otoliths", "calcium carbonate", "caco3"],
        hc1: ["type i", "type 1", "flask", "calyx"],
        hc2: ["type ii", "type 2", "cylindrical"],
        kin: ["kinocilium", "stereocilia", "microtubule"],
        supc: ["supporting cell", "microvilli"],
        cup: ["cupula", "crista", "crista ampullaris", "cristae", "angular acceleration"],
        hcr: ["hair cells of the cristae", "hair cell"],
        dep: ["towards the kinocilium", "toward the kinocilium", "k+ influx", "depolarization", "excitation of the hair cells"],
        hyp: ["away from the kinocilium", "hyperpolarization"],
        perp: ["perpendicular", "right angles", "parallel"],
        lin: ["maculae", "macula", "linear acceleration", "head tilt", "position of the head", "otolith organs", "gravity", "tilting"],
        copl: ["coplanar", "co planar", "co-planar"],
        calor: ["caloric", "caloric test", "caloric method", "warm water", "cold water"],
        endo: ["endolymph", "perilymph", "stria vascularis", "endocochlear", "endolymphatic potential", "scala tympani"],
      },
      drill: ["coch", "utr", "sac", "asc", "psc", "lsc", "amp", "otm", "oto", "hc1", "hc2", "kin", "cup"],
      sims: [
        { id: "toK", label: "Bend towards kinocilium", show: ["toK"], on: ["dep", "hcr", "kin"], info: "Stereocilia bent **towards** the kinocilium → K⁺ in from endolymph → **depolarization** → more firing." },
        { id: "awayK", label: "Bend away", show: ["awayK"], on: ["hyp", "hcr"], info: "Bent **away** → **hyperpolarization** → less firing." },
        { id: "organs", label: "Who senses what", on: ["utr", "sac", "amp", "perp", "lin"], info: "**Utricle** (horizontal) and **saccule** (vertical) maculae: tilt + **linear** acceleration. **Canals** (cristae, cupula): **angular** acceleration." },
        { id: "fluids", label: "Endolymph", on: ["endo", "coch", "utr", "sac"], info: "Endolymph fills the membranous labyrinth: **high K⁺**, from the **stria vascularis**, **+80 mV**." },
      ],
      secs: { "ph-vestibular#0": "toK", "ph-vestibular#1": "organs", "hi-ear#2": "fluids", "hi-ear#4": "organs", "ph-inner-ear#0": "fluids" },
      rules: [
        [/kinocilium|stereocilia|towards|away from/i, "toK"],
        [/endolymph|perilymph|stria/i, "fluids"],
        [/macula|utricle|saccule|otolith|linear|tilt|crista|cupula/i, "organs"],
      ],
    });
  })();

  /* ═══════════════ 2. EXTERNAL AND MIDDLE EAR HISTOLOGY · DEAFNESS · HEARING CODES ═══════════════ */
  (function () {
    const ear =
      '<text class="ttl" x="150" y="14" text-anchor="middle">EXTERNAL AND MIDDLE EAR</text>' +
      '<path class="pf" data-p="aur" d="M20 40 C60 20 90 60 80 100 C74 130 60 150 64 176 C54 190 30 180 26 160 C18 120 6 70 20 40 Z" style="--c:#ffd166;--r:#c9a87a"/>' + T(30, 196, "auricle:", "sm", "start") + T(30, 206, "ELASTIC cartilage", "sm", "start") +
      '<path class="pf" data-p="eamc" d="M72 118 L126 118 L126 146 L72 146 Z" style="--c:#ff9f43;--r:#8a5a4a"/>' + [80, 92, 104, 116].map((x) => '<path d="M' + x + ' 118 l-2 -6 M' + x + ' 146 l-2 6" stroke="#3a2a20" stroke-width="1.4"/>').join("") +
      [86, 110].map((x) => '<circle class="pf" data-p="cer" cx="' + x + '" cy="152" r="4" style="--c:#ffd166;--r:#c9a86a"/>').join("") +
      '<path class="pf" data-p="eamb" d="M126 120 L178 122 L178 144 L126 146 Z" style="--c:#66e9ff;--r:#3a4c63"/>' +
      T(98, 110, "outer ⅓: cartilage, hairs,", "sm") + T(98, 170, "ceruminous glands", "sm") + T(152, 164, "inner ⅔: bone", "sm") +
      '<path class="pf" data-p="tm2" d="M180 112 C188 124 188 142 180 156 L186 156 C194 142 194 124 186 112 Z" style="--c:#66e9ff;--r:#c7d9e8"/>' + '<path class="pf" data-p="shr" d="M180 100 L186 100 L186 112 L180 112 Z" style="--c:#ff5d7a;--r:#e8b8c8"/>' + T(176, 88, "pars flaccida (Shrapnell)", "sm", "end") +
      '<path class="pf" data-p="me" d="M188 96 L252 96 L252 176 L188 176 Z" style="--c:#b39cff;--r:#14243a"/>' + T(220, 188, "middle ear", "sm") +
      '<path d="M190 130 L214 110 L226 116 L236 140 L250 140" stroke="#e8e3d8" stroke-width="3" fill="none" pointer-events="none"/>' + T(230, 108, "ossicles", "sm mut") +
      '<path class="pf" data-p="mast" d="M232 60 C250 50 272 56 276 74 C272 90 252 94 240 88 Z" style="--c:#ff9f43;--r:#5a4a3a"/>' + [248, 258, 266].map((x) => '<circle cx="' + x + '" cy="72" r="4" fill="#1a1a1a"/>').join("") + T(254, 44, "mastoid antrum", "sm") + T(254, 100, "+ air cells", "sm") +
      '<path class="pf" data-p="at2" d="M244 176 L260 176 L296 250 L280 256 Z" style="--c:#5ef0a0;--r:#3f6f58"/>' + T(304, 226, "auditory (Eustachian) tube:", "sm", "start") + T(304, 236, "pseudostratified ciliated", "sm", "start") + T(304, 246, "→ NASOpharynx", "sm", "start") +
      '<ellipse class="pf" data-p="nph" cx="290" cy="268" rx="20" ry="9" style="--c:#ff5d7a;--r:#6d3a4a"/>' + T(290, 286, "nasopharynx: infection spreads up", "sm");
    const tm =
      '<rect x="328" y="24" width="166" height="150" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(411, 36, "TYMPANIC MEMBRANE", "sm mut") +
      '<rect class="pf" data-p="tmo" x="338" y="48" width="36" height="16" style="--c:#ffd166;--r:#e6c3a8"/>' + T(380, 55, "outer: stratified", "sm", "start") + T(380, 65, "squamous (skin)", "sm", "start") +
      '<rect class="pf" data-p="tmf" x="338" y="68" width="36" height="30" style="--c:#66e9ff;--r:#bfd0e0"/>' + T(380, 80, "middle: collagen, outer", "sm", "start") + T(380, 90, "radial + inner circular", "sm", "start") +
      '<rect class="pf" data-p="tmi" x="338" y="102" width="36" height="12" style="--c:#b39cff;--r:#c77a8a"/>' + T(380, 111, "inner: simple cuboidal", "sm", "start") +
      T(411, 132, "pars flaccida (Shrapnell's)", "sm mut") + T(411, 142, "LACKS the collagen layer", "sm mut") + T(411, 158, "handle of malleus attached", "sm mut");
    const bottom =
      cell("cond", 8, 300, 156, 58, ["CONDUCTIVE deafness:", "external or middle ear: wax, a", "cotton bud pushed in, otitis", "media, perforated drum, ossicles"], "#ff9f43") +
      cell("sens", 170, 300, 156, 58, ["SENSORINEURAL: inner ear:", "OTOTOXIC drugs (amino-", "glycosides) kill HAIR cells,", "noise, genes; or the nerve"], "#ff5d7a") +
      cell("impl", 332, 300, 162, 58, ["COCHLEAR IMPLANT: for loss", "of the hair (sensory) cells with", "a working cochlear nerve: it", "stimulates the spiral ganglion"], "#5ef0a0") +
      cell("place", 8, 364, 240, 28, ["PITCH = PLACE: base (near the windows) = HIGH,", "apex = LOW → high-tone loss = damaged BASE"], "#66e9ff") +
      cell("loud", 254, 364, 240, 28, ["LOUDNESS: more hair cells + fibres recruited,", "higher firing rate (inner hair cells carry it)"], "#66e9ff") +
      cell("ohc2", 8, 398, 486, 18, ["OUTER hair cells shorten when depolarized (prestin) → they AMPLIFY the basilar membrane; damage → less sensitivity"], "#b39cff");
    A.scene("earhist", {
      title: "External and middle ear · histology, the auditory tube, deafness, and how sound is coded",
      vb: "0 0 500 422",
      svg: () => ear + tm + bottom,
      intro: "Top: the tissues of the external and middle ear. Bottom: the two kinds of deafness and how pitch and loudness are coded.",
      parts: {
        aur: ["Auricle", "A plate of **elastic cartilage** covered by skin."],
        eamc: ["External meatus: outer third", "Cartilaginous, with **hairs**, sebaceous and **ceruminous** glands."],
        cer: ["Ceruminous glands", "**Coiled tubular apocrine sweat glands**: ear wax."],
        eamb: ["External meatus: inner two-thirds", "Bony, thin skin, no hairs."],
        tm2: ["Tympanic membrane", "The **lateral wall** of the middle ear; the **handle of the malleus** is attached to it."],
        shr: ["Pars flaccida (Shrapnell's membrane)", "The small upper part: flaccid because it **lacks the collagen (fibrous) layer**."],
        me: ["Middle ear (tympanic cavity)", "Air space lined by **simple squamous to cuboidal** epithelium; continuous **posteriorly** with the mastoid antrum."],
        mast: ["Mastoid antrum and air cells", "Open off the **posterior wall**: the route of mastoiditis."],
        at2: ["Auditory (Eustachian) tube", "Joins the middle ear to the **nasopharynx**; lined by **pseudostratified ciliated columnar** epithelium; closed at rest, opens on swallowing; the path of infection from the nasopharynx."],
        nph: ["Nasopharynx", "Infection spreads from here up the tube to the middle ear (otitis media)."],
        tmo: ["Outer layer of the drum", "**Stratified squamous** epithelium (thin skin)."],
        tmf: ["Fibrous layer of the drum", "Collagen: **outer radial, inner circular**; missing in the pars flaccida."],
        tmi: ["Inner layer of the drum", "**Simple cuboidal** epithelium (mucosa)."],
        cond: ["Conductive deafness", "Disease of the **external or middle ear**: an inflamed or blocked meatus (a **cotton bud pushed in**), **otitis media**, a **perforated** drum, deformed ossicles."],
        sens: ["Sensorineural (sensory / neural) deafness", "Disease of the **inner ear**: **ototoxic drugs** (aminoglycosides) that **damage the hair cells of the organ of Corti**, noise, genetic causes; or the cochlear nerve."],
        impl: ["Cochlear implant", "For deafness due to **loss of cochlear hair (sensory) cells** with a working nerve: it stimulates the spiral ganglion directly."],
        place: ["Pitch: the place code", "High frequencies peak at the **base** of the basilar membrane, low at the **apex**: inability to hear high tones = damage at the **base**."],
        loud: ["Loudness", "A louder sound recruits **more hair cells and fibres** and raises their **firing rate**."],
        ohc2: ["Outer hair cells", "Motile (prestin): they **shorten when depolarized** and **amplify** basilar-membrane movement. When damage to the outer cells exceeds that to the inner cells, they fail to shorten → less sensitivity."],
      },
      al: {
        aur: ["auricle", "elastic cartilage", "pinna"],
        eamc: ["auditory meatus", "external auditory canal", "external auditory meatus", "external acoustic meatus"],
        cer: ["ceruminous", "ceruminous glands", "apocrine sweat", "ear wax", "wax"],
        eamb: ["bony part of the meatus"],
        tm2: ["tympanic membrane", "ear drum", "handle of the malleus", "attached to the tympanic membrane"],
        shr: ["shrapnell", "shrapnells membrane", "pars flaccida"],
        me: ["middle ear", "tympanic cavity", "otitis media"],
        mast: ["mastoid", "mastoid antrum", "mastoid air cells", "aditus"],
        at2: ["eustachian tube", "auditory tube", "pharyngotympanic"],
        nph: ["nasopharynx", "spread from nasopharynx", "sore throat"],
        tmo: ["outer surface of tympanic membrane", "stratified squamous"],
        tmf: ["radial", "circular", "fibrous layer", "collagen fibers"],
        tmi: ["inner surface of tympanic membrane", "simple cuboidal"],
        cond: ["conductive", "conductive deafness", "cotton bud", "perforated", "earache", "ear discharge"],
        sens: ["sensorineural", "sensory hearing loss", "neural deafness", "drugs which damage", "ototoxic", "aminoglycoside", "degeneration of the cochlear nerve"],
        impl: ["cochlear implant"],
        place: ["high frequency", "high-frequency", "place", "pitch", "base of the cochlea", "apex"],
        loud: ["loud", "loudness", "auditory encoding", "number of hair cells"],
        ohc2: ["outer hair cells", "fail to shorten", "prestin", "amplify", "modify the movements"],
      },
      drill: ["aur", "cer", "tm2", "shr", "me", "mast", "at2", "tmo", "tmi", "cond", "sens", "impl"],
      sims: [
        { id: "tm", label: "Drum layers", on: ["tmo", "tmf", "tmi", "shr"], info: "Outer **stratified squamous**, middle **collagen** (radial + circular), inner **simple cuboidal**; the pars flaccida lacks the collagen layer." },
        { id: "deaf", label: "Deafness", on: ["cond", "sens", "impl"], info: "**Conductive**: external or middle ear. **Sensorineural**: inner ear (ototoxic drugs kill the hair cells) or nerve. A **cochlear implant** replaces lost hair cells." },
        { id: "spread", label: "Infection route", on: ["nph", "at2", "me", "mast"], info: "Nasopharynx → **auditory tube** → middle ear (otitis media) → mastoid air cells." },
      ],
      secs: { "hi-ear#0": "tm", "hi-ear#1": "spread", "hi-ear#5": "deaf" },
      rules: [
        [/deaf|hearing loss|implant|ototoxic|drugs/i, "deaf"],
        [/nasopharynx|eustachian|auditory tube|mastoid|otitis/i, "spread"],
        [/tympanic membrane|shrapnell|flaccida/i, "tm"],
      ],
    });
  })();

  /* ═══════════════ 3. EEG AND SLEEP ═══════════════ */
  (function () {
    const wave = (id, y, hz, amp, c) => {
      let d = "M124 " + y;
      for (let x = 0; x <= 270; x += 1.5) d += " L" + (124 + x).toFixed(1) + " " + (y + amp * Math.sin((x / 300) * hz * 2 * Math.PI) * (0.7 + 0.3 * Math.sin(x * 0.37))).toFixed(1);
      return '<path class="ps" data-p="' + id + '" d="' + d + '" style="--c:' + c + ';--r:#8fb4c9;--w:1.4"/>';
    };
    const rows = [
      ["beta", "β  14–30 Hz", "alert, eyes open, REM sleep", 44, 34, 4, "#ff9f43"],
      ["alpha", "α  8–13 Hz", "awake, relaxed, eyes CLOSED", 76, 16, 7, "#5ef0a0"],
      ["theta", "θ  4–7 Hz", "children; drowsy, stress", 108, 9, 10, "#66e9ff"],
      ["delta", "δ  < 3.5 Hz", "DEEP sleep (stage 4), infants", 142, 4, 14, "#b39cff"],
    ];
    const eeg =
      '<text class="ttl" x="240" y="16" text-anchor="middle">EEG WAVES · FASTEST TO SLOWEST</text>' +
      rows.map(([id, n, w, y, hz, amp, c]) => T(8, y - 2, n, "big", "start") + T(8, y + 10, w, "sm mut", "start") + wave(id, y, hz, amp, c)).join("") +
      T(404, 50, "speed order:", "sm", "start") + T(404, 62, "β > α > θ > δ", "big", "start") + T(404, 80, "opening the eyes", "sm", "start") + T(404, 90, "blocks α → β", "sm", "start");
    // hypnogram: 8 hours, stages
    const SY = { W: 186, R: 198, 1: 212, 2: 226, 3: 240, 4: 254 };
    const seq = [["W", 0], ["1", 6], ["2", 12], ["3", 18], ["4", 26], ["3", 46], ["2", 52], ["R", 58], ["2", 66], ["3", 72], ["4", 78], ["2", 92], ["R", 104], ["2", 116], ["3", 124], ["2", 138], ["R", 150], ["1", 168], ["2", 172], ["R", 196], ["2", 222], ["R", 244], ["W", 280]];
    let hd = "";
    seq.forEach(([st, t], i) => { const x = 60 + t * 1.3, y = SY[st]; hd += (i ? " L" + x + " " + (SY[seq[i - 1][0]]) + " L" : "M") + x + " " + y; });
    hd += " L" + (60 + 290 * 1.3) + " " + SY.W;
    const remBars = seq.map(([st, t], i) => (st === "R" ? '<rect class="pf" data-p="rem" x="' + (60 + t * 1.3) + '" y="' + (SY.R - 5) + '" width="' + ((seq[i + 1][1] - t) * 1.3).toFixed(1) + '" height="10" rx="3" style="--c:#ff5d8f;--r:#a0495b"/>' : "")).join("");
    const swsBars = seq.map(([st, t], i) => (st === "4" ? '<rect class="pf" data-p="sws" x="' + (60 + t * 1.3) + '" y="' + (SY[4] - 5) + '" width="' + ((seq[i + 1][1] - t) * 1.3).toFixed(1) + '" height="10" rx="3" style="--c:#b39cff;--r:#5a4a8a"/>' : "")).join("");
    const hyp =
      '<text class="ttl" x="240" y="176" text-anchor="middle">ONE NIGHT · CYCLES OF ~90 MIN</text>' +
      Object.entries(SY).map(([k, y]) => T(52, y + 3, k === "W" ? "awake" : k === "R" ? "REM" : "N" + k, "sm mut", "end")).join("") +
      '<path d="' + hd + '" stroke="#e9f1fb" stroke-width="1.4" fill="none" pointer-events="none"/>' + remBars + swsBars +
      T(440, 214, "REM grows", "sm", "start") + T(440, 224, "towards", "sm", "start") + T(440, 234, "morning", "sm", "start") + T(96, 272, "deep slow-wave sleep early in the night", "sm", "start");
    const cards =
      cell("remc", 8, 282, 230, 60, ["REM (paradoxical): β-like fast EEG, rapid eye", "movements, PGO spikes, MARKED HYPOTONIA,", "HR + breathing ↑ and IRREGULAR, dreams", "REMEMBERED; ~20–25% of sleep, more in infants"], "#ff5d8f") +
      cell("swsc", 244, 282, 230, 60, ["SLOW-WAVE (non-REM): entered FIRST; θ then δ;", "HR, BP, breathing ↓ and regular; tone kept;", "dreams not remembered; SLEEP WALKING,", "talking, night terrors, bed-wetting"], "#b39cff") +
      cell("narc", 8, 348, 466, 30, ["NARCOLEPSY: day-time sleep attacks with REM at once + cataplexy; hypothalamic loss of", "OREXIN (hypocretin) neurons → CSF orexin ↓"], "#ffd166");
    A.scene("sleep", {
      title: "The EEG and sleep · four waves, one night, REM vs slow-wave sleep",
      vb: "0 0 480 386",
      svg: () => eeg + hyp + cards,
      intro: "Top: the four EEG rhythms. Middle: a night's hypnogram, where deep slow-wave sleep comes early and REM grows towards morning. Bottom: how the two kinds of sleep differ.",
      parts: {
        beta: ["β waves", "The **fastest** (14–30+ Hz), low voltage: alert, active thinking, **eyes open**, and **REM sleep**. They **appear** when a person becomes alert."],
        alpha: ["α waves", "**8–13 Hz**: awake, **relaxed, eyes closed**, over the occipital cortex; blocked by opening the eyes (α block → β)."],
        theta: ["θ waves", "4–7 Hz: **normal in awake children**; drowsiness and emotional stress in adults."],
        delta: ["δ waves", "The slowest (< 3.5 Hz), large: **deep slow-wave sleep (stage 4)**, infants, serious brain disease. Deep sleep is dominated by δ."],
        rem: ["REM periods", "Every ~90 minutes, **longer towards morning**."],
        sws: ["Deep slow-wave sleep (stage 4)", "Mostly in the **first** cycles of the night; δ waves."],
        remc: ["REM (paradoxical) sleep", "Fast desynchronized (β-like) EEG, **rapid eye movements**, **PGO spikes**, **marked hypotonia**, **increased and irregular** heart rate and breathing, **dreams remembered**, penile erection; hard to wake; about 20–25% of adult sleep and **more in infants**. Slow waves are **not** a feature."],
        swsc: ["Slow-wave (non-REM) sleep", "The **first** state entered; θ then δ; HR, BP, breathing and metabolism fall and are regular; tone reduced but present; dreams **not** remembered; **sleep walking**, talking, night terrors, bed-wetting."],
        narc: ["Narcolepsy", "Day-time sleep attacks with **sleep-onset REM** and **cataplexy**: **hypothalamic** dysfunction with loss of **orexin (hypocretin)** neurons → **decreased CSF orexin**."],
      },
      al: {
        beta: ["beta wave", "beta", "alert", "eyes open"],
        alpha: ["alpha wave", "alpha", "eyes closed", "relaxed"],
        theta: ["theta wave", "theta", "awaken child", "children"],
        delta: ["delta wave", "delta", "stage 4", "deep sleep", "slow waves", "high amplitude"],
        rem: ["rem periods", "every 90"],
        sws: ["slow wave sleep", "slow-wave sleep", "stage 4 sleep"],
        remc: ["rem sleep", "rem", "paradoxical", "rapid eye movement", "hypotonia", "atonia", "pgo", "dreaming", "remembered", "irregular"],
        swsc: ["non rem", "nrem", "sleep walking", "sleepwalking", "talking and walking", "night terrors", "bed wetting", "first state of sleep"],
        narc: ["narcolepsy", "orexin", "hypocretin", "cataplexy"],
      },
      drill: ["beta", "alpha", "theta", "delta", "rem", "sws", "remc", "swsc", "narc"],
      sims: [
        { id: "waves", label: "EEG waves", on: ["beta", "alpha", "theta", "delta"], info: "**β** alert/REM (fastest) · **α** relaxed, eyes closed · **θ** children, drowsy · **δ** deep sleep (slowest)." },
        { id: "rem", label: "REM sleep", on: ["rem", "remc", "beta"], info: "REM: β-like EEG, eye movements, **hypotonia**, irregular HR/breathing, remembered dreams; grows towards morning." },
        { id: "sws", label: "Slow-wave sleep", on: ["sws", "swsc", "delta"], info: "Slow-wave sleep: δ waves, regular slow vital signs, sleep walking; deepest in the first half of the night." },
      ],
      secs: { "ph-sleep#0": "waves", "ph-sleep#1": "rem", "ph-sleep#2": "", "ph-sleep+sleep-cycles-how-sleep-is-made-and-the-e": "sws" },
      rules: [
        [/rem|paradoxical|narcolep/i, "rem"],
        [/slow wave|sleep walking|stage 4|deep sleep/i, "sws"],
        [/eeg|alpha|beta|theta|delta|wave/i, "waves"],
      ],
    });
  })();

  /* ═══════════════ 4. SYNAPTIC MEMORY: habituation, sensitization, PTP, LTP ═══════════════ */
  (function () {
    const term = (x, y, id, c) => '<path d="M' + (x - 50) + " " + y + " L" + (x - 14) + " " + y + '" stroke="#c9b8a8" stroke-width="3"/><circle class="pf" data-p="' + id + '" cx="' + x + '" cy="' + y + '" r="14" style="--c:' + c + ';--r:#8a6a4d"/><rect x="' + (x + 18) + '" y="' + (y - 14) + '" width="30" height="28" rx="6" fill="#4b3b5c"/>';
    const short =
      '<text class="ttl" x="120" y="14" text-anchor="middle">SHORT-TERM (PRESYNAPTIC)</text>' +
      term(80, 44, "hab", "#66e9ff") + T(150, 40, "HABITUATION: repeated,", "sm", "start") + T(150, 50, "harmless stimulus → Ca²⁺", "sm", "start") + T(150, 60, "channels inactivate → LESS", "sm", "start") + T(150, 70, "release", "sm", "start") +
      term(80, 108, "sens2", "#ff9f43") + '<path d="M80 72 L80 92" stroke="#ff9f43" stroke-width="3"/><circle cx="80" cy="92" r="4" fill="#ff9f43"/>' + T(150, 100, "SENSITIZATION: noxious", "sm", "start") + T(150, 110, "stimulus → facilitator neuron", "sm", "start") + T(150, 120, "(serotonin) → presynaptic", "sm", "start") + T(150, 130, "facilitation → MORE release", "sm", "start") +
      term(80, 176, "ptp2", "#5ef0a0") + [70, 78, 86, 90].map((x, i) => dot(x, 172 + (i % 2) * 6, 2.2, "#d9ff43")).join("") + T(150, 166, "POST-TETANIC POTENTIATION:", "sm", "start") + T(150, 176, "rapid repetitive firing, then", "sm", "start") + T(150, 186, "stop → Ca²⁺ ACCUMULATES in", "sm", "start") + T(150, 196, "the PRESYNAPTIC terminal", "sm", "start");
    const ltp =
      '<text class="ttl" x="380" y="14" text-anchor="middle">LTP (HIPPOCAMPUS)</text>' +
      '<path d="M292 34 L448 34 L448 70 C420 76 320 76 292 70 Z" fill="#8a6a4d" pointer-events="none"/>' + T(370, 50, "glutamate released", "sm") +
      [312, 336, 360, 384].map((x) => dot(x, 64, 3, "#d9ff43")).join("") +
      '<path d="M292 86 C320 80 420 80 448 86 L448 150 L292 150 Z" fill="#4b3b5c" pointer-events="none"/>' + T(370, 144, "postsynaptic hippocampal neuron", "sm mut") +
      '<rect class="pf" data-p="ampa" x="308" y="78" width="14" height="22" rx="3" style="--c:#5ef0a0;--r:#3f6f58"/>' + T(315, 112, "AMPA", "sm") + T(315, 122, "Na⁺ in", "sm") +
      '<rect class="pf" data-p="nmda" x="392" y="78" width="16" height="24" rx="3" style="--c:#ff9f43;--r:#8a5a3a"/>' + '<circle class="pf" data-p="mg" cx="400" cy="84" r="4" style="--c:#ff5d7a;--r:#ff5d7a"/>' + T(400, 112, "NMDA: Ca²⁺ (+Na⁺)", "sm") + T(400, 122, "Mg²⁺ plug at rest", "sm") +
      '<g class="ov" data-x="ltp">' + arr("M322 104 C340 110 360 110 388 100", "#5ef0a0") + arr("M400 84 L420 70", "#ff5d7a") + arr("M400 102 L400 132", "#d9ff43") + T(446, 136, "Ca²⁺ in", "sm", "end") + "</g>" +
      cell("ltpc", 288, 158, 186, 48, ["AMPA depolarizes → Mg²⁺ expelled →", "NMDA lets Ca²⁺ INTO the POSTsynaptic", "neuron → CaMKII → more AMPA receptors", "(NMDA is NOT a K⁺ channel)"], "#ff9f43");
    const types =
      '<text class="ttl" x="240" y="226" text-anchor="middle">MEMORY · WHERE AND FOR HOW LONG</text>' +
      cell("hippo", 8, 234, 150, 48, ["HIPPOCAMPUS: most active in", "learning and short-term memory;", "consolidates to long-term; damage", "→ anterograde amnesia"], "#5ef0a0") +
      cell("decl", 164, 234, 150, 48, ["DECLARATIVE (facts, events):", "hippocampus, medial temporal", "lobe · PROCEDURAL (skills):", "cerebellum, basal ganglia"], "#66e9ff") +
      cell("stm", 320, 234, 154, 48, ["SHORT-TERM: seconds–minutes", "(presynaptic changes above);", "LONG-TERM: structural, new", "proteins, rehearsal, sleep"], "#b39cff") +
      cell("ltpVs", 8, 288, 466, 18, ["LTP = POSTsynaptic Ca²⁺ (NMDA) · PTP = PREsynaptic Ca²⁺ · habituation = LESS release · sensitization = MORE release"], "#ffd166");
    A.scene("memory", {
      title: "Synaptic memory · habituation, sensitization, PTP and LTP",
      vb: "0 0 480 314",
      svg: () => short + ltp + types,
      intro: "Left: three short-term changes, all in the **presynaptic** terminal. Right: long-term potentiation, which depends on **postsynaptic** Ca²⁺ through NMDA receptors.",
      parts: {
        hab: ["Habituation", "Repeated **insignificant** stimulation → gradual **inactivation of presynaptic Ca²⁺ channels** → **less transmitter** → a smaller response (you stop hearing the clock)."],
        sens2: ["Sensitization", "A **noxious** stimulus excites a **facilitator neuron** (serotonin) synapsing axo-axonically on the sensory terminal → **presynaptic facilitation** → longer spikes, more Ca²⁺ → **excess release**."],
        ptp2: ["Post-tetanic potentiation (PTP)", "**Rapid repetitive (tetanic) stimulation, then stop** → **Ca²⁺ accumulates in the presynaptic terminal** (increased influx) → bigger responses for seconds to minutes. Presynaptic, not fatigue."],
        ampa: ["AMPA receptor", "Glutamate-gated channel for **Na⁺**: gives the depolarization. It does **not** let Ca²⁺ in."],
        nmda: ["NMDA receptor", "Glutamate is its ligand; a **Ca²⁺ (and Na⁺) channel**, **not a K⁺ channel**; **blocked by Mg²⁺** at rest; in hippocampal neurons; central to learning and memory."],
        mg: ["Mg²⁺ block", "Plugs the NMDA channel at rest; expelled by depolarization."],
        ltpc: ["Long-term potentiation (LTP)", "Glutamate → AMPA depolarizes → Mg²⁺ leaves NMDA → **Ca²⁺ into the postsynaptic neuron** → CaMKII → more AMPA receptors → a lasting stronger synapse: the basis of memory in the hippocampus."],
        hippo: ["Hippocampus", "The part **most activated during learning and short-term memory**; consolidates it into long-term memory. Bilateral damage → cannot form new long-term memories (anterograde amnesia)."],
        decl: ["Declarative vs procedural memory", "Facts and events (declarative): hippocampus and medial temporal lobe. Skills (procedural): cerebellum and basal ganglia."],
        stm: ["Short- vs long-term memory", "Short-term: presynaptic changes (seconds–minutes). Long-term: new proteins and structural change, helped by rehearsal and sleep."],
        ltpVs: ["LTP vs PTP", "LTP = **postsynaptic** Ca²⁺ via NMDA; PTP = **presynaptic** Ca²⁺. Habituation = less release; sensitization = more release."],
      },
      al: {
        hab: ["habituation", "insignificant repeated", "gradual loss of response"],
        sens2: ["sensitization", "noxious stimulus", "noxious stimuli", "facilitator neuron", "presynaptic facilitation", "excess release"],
        ptp2: ["post tetanic potentiation", "post-tetanic potentiation", "ptp", "tetanic", "accumulation of calcium in presynaptic", "presynaptic ca2+", "increase ca2+ influx in presynaptic"],
        ampa: ["ampa"],
        nmda: ["nmda", "nmda receptor", "nmia", "k efflux", "potassium ion channel", "glutamate"],
        mg: ["mg2+", "blocked by mg", "magnesium"],
        ltpc: ["long term potentiation", "long-term potentiation", "ltp", "accumulation of calcium in postsynaptic", "postsynaptic neuron", "camkii"],
        hippo: ["hippocampus", "hippocampal", "short term memory", "learning", "anterograde amnesia"],
        decl: ["declarative", "procedural", "skill"],
        stm: ["short-term memory", "long term memory", "consolidation"],
        ltpVs: ["potentiation"],
      },
      drill: ["hab", "sens2", "ptp2", "ampa", "nmda", "mg", "ltpc", "hippo"],
      sims: [
        { id: "ltp", label: "▶ LTP", show: ["ltp"], on: ["ampa", "nmda", "mg", "ltpc"], info: "Glutamate → **AMPA** (Na⁺) depolarizes → Mg²⁺ expelled → **NMDA** lets **Ca²⁺ into the postsynaptic** neuron → CaMKII → more AMPA receptors." },
        { id: "short", label: "Short-term changes", on: ["hab", "sens2", "ptp2"], info: "All **presynaptic**: habituation (**less** release, Ca²⁺ channels inactivated), sensitization (**more** release via a serotonin facilitator), PTP (Ca²⁺ **accumulates** in the terminal)." },
      ],
      secs: { "ph-memory#0": "short", "ph-memory#1": "ltp", "ph-memory+types-of-memory-consolidation-and-amnesi": "" },
      rules: [
        [/nmda|ampa|long[\s-]*term potentiation|ltp/i, "ltp"],
        [/habituation|sensitization|post[\s-]*tetanic/i, "short"],
      ],
    });
  })();
})();
