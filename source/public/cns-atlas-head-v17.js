/* INTELLECTUALITY v17.3 · Head and neck: the nasal cavity and sinuses, the larynx, the middle ear, the pharyngeal
 * arches with pouches, clefts and the face, and the neck lymph nodes with the atlanto-occipital/axial joints.
 * Drawn from standard anatomy (Snell / Gray level) in the notes' wording (learn-notes-anat-v15.js).
 */
(function () {
  "use strict";
  const A = window.IX_ATLAS;
  if (!A) return;
  const { smooth } = A;
  const { T, pf, ps } = A.kit;
  const blob = (pts) => smooth(pts, true);
  const dot = (x, y, r, fill) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" pointer-events="none"/>';
  const ld = (x1, y1, x2, y2) => '<path class="ld" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 + '"/>';
  const arr = (d, c) => '<path d="' + d + '" stroke="' + (c || "#d9ff43") + '" stroke-width="1.6" fill="none" marker-end="url(#ixArr)" pointer-events="none"/>';
  const cell = (id, x, y, w, h, lines, c, r) =>
    '<rect class="pf" data-p="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="--c:' + (c || "#d9ff43") + ";--r:" + (r || "#13263c") + ';--rs:#2f4a68"/>' +
    lines.map((t, i) => T(x + w / 2, y + 11 + i * 10, t, "sm")).join("");

  /* ═══════════════ 1. NASAL CAVITY: lateral wall, sinus openings, septum, maxillary sinus ═══════════════ */
  (function () {
    const wall =
      '<path d="M22 262 L34 206 C40 150 64 96 104 74 L186 66 L258 84 L300 150 L304 262 Z" fill="#3a2530" pointer-events="none"/>' +
      T(20, 280, "nostril", "sm mut", "start") + T(300, 280, "choana →", "sm mut", "end") +
      '<path class="pf" data-p="olf" d="M104 74 L186 66 L196 78 L112 88 Z" style="--c:#b39cff;--r:#5a4a6a"/>' +
      '<path class="pf" data-p="palate" d="M34 262 L304 262 L304 272 L34 272 Z" style="--c:#ffd166;--r:#8a7a66"/>' +
      '<path class="pf" data-p="fs" d="M52 34 C72 26 98 30 104 52 C100 66 80 72 62 66 C48 60 44 44 52 34 Z" style="--c:#ffd166;--r:#7a6a4a"/>' +
      '<path class="pf" data-p="sph" d="M252 92 C274 86 298 94 302 118 C302 138 284 146 264 142 C250 136 246 110 252 92 Z" style="--c:#ffd166;--r:#7a6a4a"/>' +
      // recess and meatuses (the spaces under each concha)
      '<path class="pf" data-p="ser" d="M214 96 C228 92 244 96 252 106 L246 116 C234 110 222 108 212 108 Z" style="--c:#66e9ff;--r:#24384f"/>' +
      '<path class="pf" data-p="smt" d="M170 126 C196 118 230 120 250 132 L248 142 C224 136 196 136 170 140 Z" style="--c:#66e9ff;--r:#24384f"/>' +
      '<path class="pf" data-p="mmt" d="M96 172 C140 160 210 162 262 180 L262 196 C210 184 140 184 96 190 Z" style="--c:#66e9ff;--r:#24384f"/>' +
      '<path class="pf" data-p="imt" d="M48 234 C110 222 210 222 290 236 L292 252 C210 244 110 244 48 250 Z" style="--c:#66e9ff;--r:#24384f"/>' +
      // conchae, drawn cut away so the openings show
      '<path class="pf" data-p="sc" d="M170 110 C196 100 232 102 250 114 C236 120 206 120 172 124 Z" style="--c:#ff9f43;--r:#c98b7d"/>' +
      '<path class="pf" data-p="mc" d="M98 144 C150 130 214 134 262 150 C250 162 214 160 180 156 C150 154 118 158 100 162 Z" style="--c:#ff9f43;--r:#c98b7d"/>' +
      '<path class="pf" data-p="ic" d="M46 208 C110 194 212 196 292 214 C282 226 210 222 150 222 C110 222 70 226 48 228 Z" style="--c:#ff9f43;--r:#c98b7d"/>' +
      // openings in the middle meatus: bulla, hiatus semilunaris; superior meatus; recess; inferior meatus
      '<ellipse class="pf" data-p="bulla" cx="176" cy="172" rx="16" ry="6" style="--c:#5ef0a0;--r:#9b6f7d"/>' +
      '<path class="ps" data-p="hiat" d="M122 186 C150 192 190 190 220 180" style="--c:#5ef0a0;--r:#1a0f14;--w:3"/>' +
      '<circle class="pf" data-p="pe" cx="214" cy="132" r="3.4" style="--c:#5ef0a0;--r:#1a0f14"/>' +
      '<circle class="pf" data-p="me" cx="176" cy="172" r="2.6" style="--c:#5ef0a0;--r:#1a0f14"/>' +
      '<circle class="pf" data-p="ae" cx="128" cy="186" r="2.6" style="--c:#5ef0a0;--r:#1a0f14"/>' +
      '<circle class="pf" data-p="mxo" cx="206" cy="184" r="3.4" style="--c:#5ef0a0;--r:#1a0f14"/>' +
      '<circle class="pf" data-p="sphO" cx="238" cy="104" r="3" style="--c:#5ef0a0;--r:#1a0f14"/>' +
      '<circle class="pf" data-p="nld" cx="92" cy="242" r="3.4" style="--c:#5ef0a0;--r:#1a0f14"/>' +
      '<g class="ov" data-x="drain">' + arr("M80 68 C100 110 118 150 126 182", "#ffd166") + arr("M264 118 C256 112 248 108 242 106", "#ffd166") + arr("M92 212 L92 238", "#8fd3ff") + "</g>" +
      // labels
      T(78, 22, "frontal sinus", "sm") + T(292, 80, "sphenoid sinus", "sm", "end") + T(150, 62, "olfactory region", "sm") +
      T(260, 100, "spheno-ethmoidal recess", "sm", "start") + ld(258, 100, 244, 104) + T(254, 128, "superior meatus", "sm", "start") +
      T(268, 176, "middle meatus", "sm", "start") + T(296, 244, "inferior meatus", "sm", "start") +
      T(60, 128, "sup. / middle / inf. conchae", "sm mut", "start") + T(150, 206, "bulla · hiatus semilunaris", "sm mut") + T(96, 258, "nasolacrimal duct", "sm", "start") +
      T(162, 280, "hard palate", "sm mut");
    const septum =
      '<rect x="382.0" y="24" width="156" height="150" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(460, 38, "NASAL SEPTUM", "sm mut") +
      '<path class="pf" data-p="perp" d="M414 52 L484 50 L470 104 L424 110 Z" style="--c:#ffd166;--r:#6f5a7a"/>' +
      '<path class="pf" data-p="vomer" d="M470 104 L484 50 L520 70 L516 150 L468 150 Z" style="--c:#ffd166;--r:#5a4a6a"/>' +
      '<path class="pf" data-p="scart" d="M394 150 L400 116 L424 110 L470 104 L468 150 Z" style="--c:#ffd166;--r:#8f7fa8"/>' +
      '<ellipse class="pf" data-p="little" cx="416.0" cy="136" rx="15" ry="10" style="--c:#ff5d7a;--r:#a84a5a"/>' +
      ps("a_ae", "M410 58 C410 90 414 116 416 132", "#ff5d7a", "#c46a7d", 1.6) + ps("a_sp", "M514 96 C484 110 444 124 420 134", "#ff5d7a", "#c46a7d", 1.6) +
      ps("a_gp", "M436 168 L424 142", "#ff5d7a", "#c46a7d", 1.6) + ps("a_sl", "M386 150 L406 140", "#ff5d7a", "#c46a7d", 1.6) +
      T(416, 158, "Little's area", "sm") + T(444, 76, "ethmoid", "sm") + T(494, 128, "vomer", "sm") + T(436, 128, "cartilage", "sm mut");
    const maxs =
      '<rect x="382.0" y="182" width="156" height="170" rx="10" fill="#0b1828" stroke="#2a4260" pointer-events="none"/>' + T(460, 196, "MAXILLARY SINUS (coronal)", "sm mut") +
      '<path class="pf" data-p="orb" d="M426 206 C444 200 476 200 494 210 L492 238 L428 238 Z" style="--c:#8fd3ff;--r:#1e3550"/>' + T(460, 224, "orbit", "sm mut") +
      '<circle class="pf" data-p="ion" cx="464.0" cy="242" r="4" style="--c:#ffd166;--r:#c9a86a"/>' + T(474, 248, "infraorbital n.", "sm", "start") +
      '<path class="pf" data-p="maxs" d="M430 246 L498 246 L502 312 C484 324 444 324 426 312 Z" style="--c:#ffd166;--r:#3a4c63"/>' + T(464, 292, "maxillary sinus", "sm") +
      '<path class="pf" data-p="teeth" d="M436 326 L444 344 L452 326 M462 326 L470 344 L478 326" style="--c:#fff;--r:#e8e3d8" stroke="#e8e3d8" stroke-width="3" fill="none"/>' + T(536, 336, "upper molar roots", "sm", "end") +
      '<path d="M426 250 L400 250 L400 330" stroke="#6f8aa8" stroke-width="2" fill="none" pointer-events="none"/>' + T(394, 344, "nasal cavity", "sm mut", "start") +
      '<circle class="pf" data-p="mxo" cx="428.0" cy="256" r="3.4" style="--c:#5ef0a0;--r:#1a0f14"/>' + T(408, 270, "ostium high", "sm", "start");
    A.scene("nose", {
      title: "Nasal cavity · where each sinus opens, Little's area, and the maxillary sinus",
      vb: "0 0 544 356",
      svg: () => wall + septum + maxs,
      intro: "The lateral wall with the conchae cut away so every opening shows. Tap a meatus, an opening or a sinus; **▶ Drainage** shows the paths.",
      parts: {
        olf: ["Olfactory region (roof)", "Olfactory mucosa under the **cribriform plate**; olfactory nerve fibres pass up through it."],
        palate: ["Hard palate (floor of the nasal cavity)", "Separates the nasal cavity from the mouth."],
        fs: ["Frontal sinus", "Opens into the **middle meatus** by the frontonasal duct / infundibulum at the front of the hiatus semilunaris."],
        sph: ["Sphenoidal sinus", "Opens into the **spheno-ethmoidal recess**, above the superior concha."],
        ser: ["Spheno-ethmoidal recess", "The space **above the superior concha**: receives the **sphenoidal sinus**."],
        smt: ["Superior meatus", "Under the superior concha: receives the **posterior ethmoidal** sinuses."],
        mmt: ["Middle meatus", "Under the middle concha: **frontal**, **maxillary**, **anterior ethmoidal** (hiatus semilunaris) and **middle ethmoidal** (on the bulla) sinuses."],
        imt: ["Inferior meatus", "Under the inferior concha: receives only the **nasolacrimal duct** (tears)."],
        sc: ["Superior concha", "Part of the ethmoid."],
        mc: ["Middle concha", "Part of the ethmoid; the middle meatus lies under it."],
        ic: ["Inferior concha", "A separate bone; the inferior meatus lies under it."],
        bulla: ["Bulla ethmoidalis", "A bulge in the middle meatus made by the **middle ethmoidal** air cells, which open **on** it."],
        hiat: ["Hiatus semilunaris", "A curved slit below the bulla: the **maxillary** sinus, the **anterior ethmoidal** sinuses and (via the infundibulum) the **frontal** sinus open into it."],
        pe: ["Opening of the posterior ethmoidal sinuses", "In the **superior meatus**."],
        me: ["Opening of the middle ethmoidal sinuses", "**On the bulla ethmoidalis** (middle meatus)."],
        ae: ["Opening of the anterior ethmoidal sinuses", "Front of the **hiatus semilunaris** (middle meatus)."],
        mxo: ["Maxillary sinus opening (ostium)", "In the **hiatus semilunaris** of the **middle meatus**, **high** on the sinus's medial wall, so it drains poorly (sinusitis is common). A growth blocking it lies in the middle meatus."],
        sphO: ["Sphenoidal sinus opening", "Into the **spheno-ethmoidal recess**."],
        nld: ["Opening of the nasolacrimal duct", "In the **inferior meatus**, under the front of the inferior concha."],
        perp: ["Perpendicular plate of the ethmoid", "The upper-back part of the septum."],
        vomer: ["Vomer", "The lower-back part of the septum."],
        scart: ["Septal cartilage", "The front of the septum. The septum is often **deviated**, so it is not always midline."],
        little: ["Little's area (Kiesselbach's plexus)", "On the **antero-inferior septum**: the **commonest site of nosebleeds (epistaxis)**. Four arteries meet here: septal branches of the **sphenopalatine**, **anterior ethmoidal**, **greater palatine** and **superior labial**."],
        a_ae: ["Anterior ethmoidal artery", "From the ophthalmic; reaches Little's area from above."],
        a_sp: ["Sphenopalatine artery (septal branch)", "From the maxillary: the **main artery of the nose**."],
        a_gp: ["Greater palatine artery", "Comes up through the incisive canal."],
        a_sl: ["Superior labial artery (septal branch)", "From the facial artery."],
        orb: ["Floor of the orbit (roof of the sinus)", "The infraorbital nerve and vessels run in it."],
        ion: ["Infraorbital nerve", "Runs in the **roof** of the maxillary sinus (orbital floor)."],
        maxs: ["Maxillary sinus", "The largest paranasal sinus, in the body of the maxilla. **Sinusitis** mimics **upper toothache** with healthy teeth, and tapping the maxilla hurts: the superior alveolar nerves supply both."],
        teeth: ["Roots of the upper molars and premolars", "Lie close to the **floor** of the sinus; the superior alveolar nerves run in its walls."],
      },
      al: {
        olf: ["olfactory region", "cribriform plate", "olfactory mucosa"],
        palate: ["hard palate", "floor of the nasal cavity"],
        fs: ["frontal sinus", "frontal air sinus", "frontonasal duct"],
        sph: ["sphenoid sinus", "sphenoidal sinus", "sphenoidal air sinus", "sphenoid air sinus"],
        ser: ["sphenoethmoidal recess", "spheno ethmoidal recess", "sphenoethmoidal"],
        smt: ["superior meatus", "superior nasal meatus"],
        mmt: ["middle meatus", "middle nasal meatus"],
        imt: ["inferior meatus", "inferior nasal meatus"],
        sc: ["superior concha", "superior turbinate"],
        mc: ["middle concha", "middle turbinate"],
        ic: ["inferior concha", "inferior turbinate"],
        bulla: ["bulla ethmoidalis", "ethmoidal bulla", "bulla"],
        hiat: ["hiatus semilunaris", "semilunar hiatus", "infundibulum", "hiatus of the maxillary sinus"],
        pe: ["posterior ethmoidal", "posterior ethmoidal sinus", "posterior ethmoidal air cell"],
        me: ["middle ethmoidal", "middle ethmoidal sinus", "middle ethmoidal air cell"],
        ae: ["anterior ethmoidal sinus", "anterior ethmoidal air cell", "anterior ethmoidal cells"],
        mxo: ["ostium of the maxillary sinus", "opening of the maxillary sinus", "maxillary ostium"],
        nld: ["nasolacrimal duct", "nasolacrimal"],
        perp: ["perpendicular plate", "perpendicular plate of the ethmoid", "nasal septum"],
        vomer: ["vomer", "nasal septum"],
        scart: ["septal cartilage", "nasal septum", "deviated"],
        little: ["littles area", "little area", "kiesselbach", "kiesselbachs plexus", "epistaxis", "nose bleeding", "nosebleed", "bleeding", "anteroinferior part of the septum", "anteroinferior"],
        a_ae: ["anterior ethmoidal artery"],
        a_sp: ["sphenopalatine", "sphenopalatine artery"],
        a_gp: ["greater palatine artery"],
        a_sl: ["superior labial", "superior labial artery"],
        orb: ["floor of the orbit", "roof of the maxillary sinus"],
        ion: ["infraorbital nerve", "infraorbital"],
        maxs: ["maxillary sinus", "maxillary air sinus", "antrum", "maxillary sinusitis", "sinusitis", "tapping his maxilla", "tapping the maxilla"],
        teeth: ["upper molar", "upper teeth", "maxillary teeth", "maxillary tooth", "superior alveolar", "tooth pain", "toothache", "premolar"],
      },
      drill: ["ser", "smt", "mmt", "imt", "bulla", "hiat", "nld", "fs", "sph", "little", "maxs", "ion"],
      sims: [
        { id: "drain", label: "▶ Drainage", show: ["drain"], on: ["ser", "smt", "mmt", "imt", "bulla", "hiat", "nld", "pe", "me", "ae", "mxo", "sphO"], info: "**Spheno-ethmoidal recess** ← sphenoid. **Superior meatus** ← posterior ethmoidal. **Middle meatus** ← frontal, maxillary, anterior ethmoidal (hiatus semilunaris) and middle ethmoidal (on the bulla). **Inferior meatus** ← nasolacrimal duct." },
        { id: "bleed", label: "Nosebleed", on: ["little", "a_ae", "a_sp", "a_gp", "a_sl"], info: "Most nosebleeds come from **Little's area** on the **antero-inferior septum**, where four arteries anastomose (Kiesselbach's plexus)." },
        { id: "maxs", label: "Maxillary sinusitis", on: ["maxs", "teeth", "ion", "mxo"], info: "The ostium is **high** on the medial wall → poor drainage. Pain is referred to the **upper teeth** (healthy on examination) and tapping the maxilla hurts." },
      ],
      secs: { "an-nose#0": "drain", "an-nose#1": "bleed", "an-nose#2": "maxs" },
      rules: [
        [/little|kiesselbach|epistaxis|bleed/i, "bleed"],
        [/maxillary (tooth|sinusitis)|tapping|toothache|roof of the maxillary/i, "maxs"],
        [/meatus|recess|bulla|hiatus|sinus opens|opens into/i, "drain"],
      ],
    });
  })();

  /* ═══════════════ 2. LARYNX: who opens, who closes, which nerve ═══════════════ */
  (function () {
    // glottis seen from above: front (thyroid) at the top, arytenoids at the back (bottom)
    const glottis =
      '<text class="ttl" x="120" y="16" text-anchor="middle">GLOTTIS FROM ABOVE (FRONT AT TOP)</text>' +
      '<path class="pf" data-p="thy" d="M40 60 L120 30 L200 60 L196 80 L120 52 L44 80 Z" style="--c:#8fd3ff;--r:#3e5d7c"/>' + T(120, 44, "thyroid cartilage", "sm") +
      '<path class="pf" data-p="cri" d="M50 170 C60 230 180 230 190 170 L180 170 C170 214 70 214 60 170 Z" style="--c:#8fd3ff;--r:#3e5d7c"/>' + T(120, 236, "cricoid (ring, C6)", "sm") +
      '<path class="pf" data-p="vc" d="M118 62 L90 158 L96 160 L120 70 L144 160 L150 158 L122 62 Z" style="--c:#fff;--r:#f4f1ea"/>' +
      '<path class="pf" data-p="ary" d="M78 156 L94 150 L104 176 L86 184 Z M162 156 L146 150 L136 176 L154 184 Z" style="--c:#ffd166;--r:#c9a86a"/>' +
      '<path class="pf" data-p="voc" d="M104 80 L90 150 L98 152 L110 86 Z M136 80 L150 150 L142 152 L130 86 Z" style="--c:#ff9f43;--r:#b8646f"/>' +
      '<path class="pf" data-p="tha" d="M84 76 L70 150 L84 152 L98 84 Z M156 76 L170 150 L156 152 L142 84 Z" style="--c:#ff9f43;--r:#8f3b4f"/>' +
      '<path class="pf" data-p="ta" d="M104 170 L136 170 L136 178 L104 178 Z" style="--c:#ff5d7a;--r:#8f3b4f"/>' +
      '<path class="ps" data-p="oa" d="M100 164 L140 186 M140 164 L100 186" style="--c:#ff5d7a;--r:#a0495b;--w:3"/>' +
      '<path class="pf" data-p="lca" d="M60 160 C54 176 62 190 80 184 L84 176 C72 178 66 172 68 162 Z M180 160 C186 176 178 190 160 184 L156 176 C168 178 174 172 172 162 Z" style="--c:#ff5d7a;--r:#8f3b4f"/>' +
      '<path class="pf" data-p="pca" d="M86 188 C92 204 104 212 116 210 L112 198 C102 198 96 192 94 184 Z M154 188 C148 204 136 212 124 210 L128 198 C138 198 144 192 146 184 Z" style="--c:#5ef0a0;--r:#8f3b4f"/>' +
      T(16, 118, "thyroarytenoid", "sm", "start") + T(120, 110, "vocalis", "sm") + T(26, 196, "lateral crico-", "sm", "start") + T(26, 206, "arytenoid", "sm", "start") +
      T(120, 252, "posterior cricoarytenoid (back of cricoid)", "sm") + T(212, 176, "arytenoids", "sm", "start") +
      '<g class="ov" data-x="open">' + arr("M92 176 L76 190", "#5ef0a0") + arr("M148 176 L164 190", "#5ef0a0") + '<path d="M120 66 L74 160 M120 66 L166 160" stroke="#5ef0a0" stroke-width="2" stroke-dasharray="4 3" fill="none"/>' + T(120, 140, "cords OPEN", "sm") + "</g>" +
      '<g class="ov" data-x="close">' + arr("M84 176 L100 168", "#ff5d7a") + arr("M156 176 L140 168", "#ff5d7a") + T(120, 140, "cords CLOSED", "sm") + "</g>";
    const side =
      '<text class="ttl" x="360" y="16" text-anchor="middle">NERVES (LEFT SIDE VIEW)</text>' +
      ps("vag", "M278 26 L278 300", "#b39cff", "#8f7fc1", 4) + T(272, 40, "vagus", "sm", "end") +
      ps("sln", "M278 60 C300 60 316 66 330 76", "#b39cff", "#8f7fc1", 2.6) + T(302, 56, "superior laryngeal", "sm", "start") +
      ps("n_int", "M330 76 C352 76 372 80 392 90", "#66e9ff", "#8f7fc1", 2) + T(396, 88, "internal: sensory", "sm", "start") + T(396, 98, "ABOVE the cords", "sm", "start") +
      ps("n_ext", "M330 76 C340 110 356 140 380 168", "#ff9f43", "#8f7fc1", 2) + T(402, 190, "external → cricothyroid", "sm", "start") +
      ps("n_rln", "M278 300 C300 300 318 290 330 266 C336 240 352 220 372 210", "#5ef0a0", "#8f7fc1", 2.4) + T(378, 206, "recurrent laryngeal:", "sm", "start") + T(378, 216, "all intrinsic muscles except", "sm", "start") + T(378, 226, "cricothyroid; sensory BELOW", "sm", "start") +
      '<path class="pf" data-p="ct" d="M354 150 L396 164 L392 182 L352 170 Z" style="--c:#ff9f43;--r:#8f3b4f"/>' + T(344, 150, "cricothyroid", "sm", "end") +
      '<path class="pf" data-p="tgl" d="M316 234 C300 250 302 286 324 296 C340 290 346 262 338 240 Z" style="--c:#ff5d8f;--r:#6d3a4a"/>' + T(306, 314, "thyroid gland", "sm") +
      '<path class="pf" data-p="above" d="M400 108 L468 108 L468 120 L400 120 Z" style="--c:#66e9ff;--r:#1e3550"/>' + T(434, 117, "mucosa above", "sm") +
      '<path class="pf" data-p="below" d="M400 236 L468 236 L468 248 L400 248 Z" style="--c:#5ef0a0;--r:#1e3550"/>' + T(434, 245, "mucosa below", "sm");
    A.scene("larynx", {
      title: "Larynx · the one muscle that opens the cords, the ones that close them, and their nerves",
      vb: "0 0 480 322",
      svg: () => glottis + side,
      intro: "Left: the glottis from above. Right: the nerves. **Green** opens; **red** closes. Tap a muscle or nerve.",
      parts: {
        thy: ["Thyroid cartilage", "In front; the cords attach to its back."],
        cri: ["Cricoid cartilage", "The only **complete ring**, at the level of **C6** (larynx → trachea, pharynx → oesophagus)."],
        vc: ["Vocal cords (folds)", "The rima glottidis lies between them."],
        ary: ["Arytenoid cartilages", "Sit on the cricoid; rotating and sliding them opens and closes the cords."],
        voc: ["Vocalis", "Part of the thyroarytenoid in the cord: **relaxes** and fine-tunes it."],
        tha: ["Thyroarytenoid", "**Relaxes** (shortens) the cords."],
        ta: ["Transverse arytenoid", "Pulls the arytenoids together: **adducts**."],
        oa: ["Oblique arytenoids", "Adduct the cords and help close the inlet (with the aryepiglottic muscle)."],
        lca: ["Lateral cricoarytenoid", "Rotates the arytenoids **inwards**: **adducts (closes)** the cords."],
        pca: ["Posterior cricoarytenoid", "From the back of the cricoid lamina: rotates the arytenoids **outwards**: the **ONLY abductor (opens the cords)**. Supplied by the recurrent laryngeal nerve."],
        ct: ["Cricothyroid", "The only external intrinsic muscle: **tenses** (lengthens) the cords, raises the pitch. Supplied by the **external laryngeal** nerve."],
        vag: ["Vagus nerve", "Gives the superior and the recurrent laryngeal nerves."],
        sln: ["Superior laryngeal nerve", "Divides into the internal and external laryngeal nerves."],
        n_int: ["Internal laryngeal nerve", "Pierces the thyrohyoid membrane: **sensory above the vocal cords**."],
        n_ext: ["External laryngeal nerve", "Motor to the **cricothyroid** only."],
        n_rln: ["Recurrent laryngeal nerve", "**Motor to all intrinsic muscles except the cricothyroid**, and **sensory below the vocal cords**. Runs up beside the thyroid gland: injured in **thyroidectomy** → the posterior cricoarytenoid fails first → cords held near the midline (hoarseness; bilateral → stridor)."],
        tgl: ["Thyroid gland", "Its lobes lie beside the recurrent laryngeal nerves."],
        above: ["Mucosa above the cords", "Supplied by the **internal laryngeal** nerve."],
        below: ["Mucosa below the cords", "Supplied by the **recurrent laryngeal** nerve."],
      },
      al: {
        thy: ["thyroid cartilage", "laryngeal prominence"],
        cri: ["cricoid", "cricoid cartilage", "c6", "sixth cervical"],
        vc: ["vocal cord", "vocal fold", "rima glottidis", "glottis"],
        ary: ["arytenoid", "arytenoid cartilage"],
        voc: ["vocalis"],
        tha: ["thyroarytenoid", "relaxer"],
        ta: ["transverse arytenoid", "arytenoideus", "arytenoid muscle"],
        oa: ["oblique arytenoid", "aryepiglottic"],
        lca: ["lateral cricoarytenoid", "lateral crico arytenoid", "adduct", "adducts", "adductor", "adduction", "close the cords"],
        pca: ["posterior cricoarytenoid", "posterior crico arytenoid", "abduct", "abducts", "abductor", "abduction", "open the vocal cords", "opens the cords", "only abductor"],
        ct: ["cricothyroid", "tensor of the vocal cords"],
        vag: ["vagus", "vagus nerve"],
        sln: ["superior laryngeal", "superior laryngeal nerve"],
        n_int: ["internal laryngeal", "internal laryngeal nerve", "above the vocal cords", "above the level of the vocal cords"],
        n_ext: ["external laryngeal", "external laryngeal nerve"],
        n_rln: ["recurrent laryngeal", "recurrent laryngeal nerve", "inferior laryngeal", "below the vocal cords", "below the level of the vocal cords", "hoarseness", "stridor"],
        tgl: ["thyroid gland", "thyroidectomy", "partial thyroidectomy"],
        above: ["mucous membrane above"],
        below: ["mucous membrane of the larynx below", "mucous membrane below"],
      },
      drill: ["thy", "cri", "vc", "ary", "pca", "lca", "ta", "ct", "n_int", "n_ext", "n_rln"],
      sims: [
        { id: "open", label: "Open (abduct)", show: ["open"], on: ["pca"], info: "The **posterior cricoarytenoid** is the **only abductor**: it swings the arytenoids outwards and opens the rima glottidis." },
        { id: "close", label: "Close (adduct)", show: ["close"], on: ["lca", "ta", "oa"], info: "**Adductors**: the **lateral cricoarytenoid** and the transverse and oblique arytenoids." },
        { id: "nerves", label: "Nerves", on: ["n_rln", "n_int", "n_ext", "above", "below"], info: "Motor: **recurrent laryngeal** to all intrinsic muscles **except the cricothyroid** (external laryngeal). Sensory: **internal laryngeal above** the cords, **recurrent laryngeal below**." },
        { id: "thyroid", label: "After thyroidectomy", on: ["tgl"], lost: ["n_rln", "pca"], info: "The **recurrent laryngeal** nerve is at risk: the **posterior cricoarytenoid** (abductor) fails first → the cords cannot open (hoarseness; bilateral → stridor)." },
      ],
      secs: { "an-nose#3": "open", "an-nose#4": "nerves", "an-muscular-triangle-thyroid#2": "thyroid" },
      rules: [
        [/thyroidectomy|hoarse|stridor/i, "thyroid"],
        [/sensory|mucous membrane|mucosa|nerve/i, "nerves"],
        [/adduct|close/i, "close"],
        [/abduct|open/i, "open"],
      ],
    });
  })();

  /* ═══════════════ 3. MIDDLE EAR: six walls, ossicles, what runs through ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="200" y="16" text-anchor="middle">MIDDLE EAR · CORONAL VIEW (LATERAL ON THE LEFT)</text>' +
      '<path class="pf" data-p="teg" d="M100 40 L330 40 L330 56 L100 56 Z" style="--c:#ffd166;--r:#6f5a44"/>' + T(215, 36, "ROOF: tegmen tympani (middle cranial fossa above)", "sm") +
      '<path class="pf" data-p="jb" d="M100 252 L330 252 L330 268 L100 268 Z" style="--c:#ffd166;--r:#6f5a44"/>' + '<ellipse cx="215" cy="288" rx="40" ry="14" fill="#3a5a8a" pointer-events="none"/>' + T(215, 292, "FLOOR: over the jugular bulb", "sm") +
      '<path class="pf" data-p="eam" d="M10 132 L96 132 L96 170 L10 170 Z" style="--c:#8fd3ff;--r:#2a3f58"/>' + T(52, 124, "external acoustic", "sm") + T(52, 184, "meatus", "sm") +
      '<path class="pf" data-p="tm" d="M100 72 C112 110 112 190 100 236 L108 236 C120 190 120 110 108 72 Z" style="--c:#66e9ff;--r:#c7d9e8"/>' + T(116, 246, "LATERAL WALL: tympanic membrane", "sm", "start") +
      '<path d="M112 56 L318 56 L318 252 L112 252 Z" fill="#101c2c" pointer-events="none"/>' +
      '<path class="pf" data-p="mal" d="M112 150 L150 100 L162 106 L150 118 L118 156 Z" style="--c:#ffd166;--r:#e8e3d8"/>' + '<circle class="pf" data-p="mal" cx="158" cy="96" r="10" style="--c:#ffd166;--r:#e8e3d8"/>' +
      '<path class="pf" data-p="inc" d="M166 92 L196 94 L204 130 L196 134 L186 104 L168 104 Z" style="--c:#ffd166;--r:#e8e3d8"/>' +
      '<path class="pf" data-p="sta" d="M200 132 L262 132 L262 140 L200 140 Z M244 124 L270 124 L270 150 L244 150 Z" style="--c:#ffd166;--r:#e8e3d8"/>' +
      ps("ctn", "M112 106 C150 118 190 120 230 90", "#b39cff", "#9d88c9", 2) + T(236, 86, "chorda tympani", "sm", "start") +
      ps("tt", "M160 104 C150 80 140 68 124 64", "#ff9f43", "#b8646f", 3) + T(128, 78, "tensor tympani", "sm", "start") +
      // medial wall
      '<path d="M318 56 L336 56 L336 252 L318 252 Z" fill="#6f5a44" pointer-events="none"/>' +
      '<path class="pf" data-p="lscc" d="M306 70 C322 64 336 70 336 82 L318 86 Z" style="--c:#66e9ff;--r:#8a7a66"/>' + T(344, 78, "lateral semicircular canal", "sm", "start") +
      '<path class="pf" data-p="fcan" d="M296 96 C314 90 332 94 336 104 L318 110 Z" style="--c:#ff5d8f;--r:#8a7a66"/>' + T(344, 104, "facial canal (VII)", "sm", "start") +
      '<path class="pf" data-p="ow" d="M312 126 L320 126 L320 148 L312 148 Z" style="--c:#5ef0a0;--r:#1a0f14"/>' + T(344, 138, "oval window (stapes)", "sm", "start") +
      '<path class="pf" data-p="prom" d="M296 162 C318 154 336 170 336 196 L318 206 C304 196 296 180 296 162 Z" style="--c:#d9ff43;--r:#8a7a66"/>' + T(344, 184, "promontory (cochlea) +", "sm", "start") + T(344, 194, "tympanic plexus (IX)", "sm", "start") +
      '<circle class="pf" data-p="tp" cx="314" cy="180" r="4" style="--c:#b39cff;--r:#b39cff"/>' +
      '<path class="pf" data-p="rw" d="M312 214 L320 214 L320 232 L312 232 Z" style="--c:#5ef0a0;--r:#1a0f14"/>' + T(344, 224, "round window", "sm", "start") +
      '<path class="pf" data-p="iam" d="M336 150 L372 150 L372 162 L336 162 Z" style="--c:#ff9f43;--r:#2a3f58"/>' + T(378, 156, "→ internal acoustic", "sm", "start") + T(378, 166, "meatus: VII + VIII", "sm", "start") +
      T(420, 118, "MEDIAL WALL", "sm mut") +
      // anterior and posterior walls as chips
      cell("ant", 10, 196, 86, 44, ["ANTERIOR WALL:", "auditory tube,", "tensor tympani canal"], "#66e9ff") +
      cell("post", 10, 54, 86, 44, ["POSTERIOR WALL:", "aditus → mastoid", "antrum, pyramid"], "#66e9ff") +
      '<path class="pf" data-p="stp" d="M290 150 C298 146 306 150 308 158 L296 162 Z" style="--c:#ff9f43;--r:#b8646f"/>' + T(262, 170, "stapedius", "sm") +
      cell("arts", 344, 262, 130, 44, ["ARTERIES: anterior tympanic", "(maxillary), stylomastoid", "(posterior auricular) …"], "#ff5d7a") +
      T(146, 128, "malleus", "sm", "end") + T(190, 146, "incus", "sm") + T(232, 124, "stapes", "sm");
    A.scene("mear", {
      title: "Middle ear · six walls, the ossicles, and what runs through",
      vb: "0 0 480 312",
      svg,
      intro: "Lateral wall = the drum; medial wall = the inner ear. Tap a wall, an ossicle or a nerve.",
      parts: {
        teg: ["Roof: tegmen tympani", "A thin plate of bone separating the middle ear from the **middle cranial fossa**."],
        jb: ["Floor", "A thin plate over the **jugular bulb**."],
        eam: ["External acoustic meatus", "Outer third cartilage, inner two-thirds bone; skin with **ceruminous glands**. Derived from the **1st pharyngeal cleft**."],
        tm: ["Tympanic membrane (lateral wall)", "The **lateral wall**: three layers (outer skin, middle fibrous, inner mucous); the handle of the malleus is fixed to it."],
        mal: ["Malleus", "Handle fixed to the drum (1st arch, Meckel's cartilage)."],
        inc: ["Incus", "Between malleus and stapes (1st arch). The ossicles lie **inside** the cavity, not in a wall."],
        sta: ["Stapes", "Its base (footplate) fills the **oval window** (2nd arch)."],
        ctn: ["Chorda tympani", "Crosses the lateral wall between the malleus and incus: **taste from the anterior two-thirds of the tongue** + secretomotor to the submandibular/sublingual glands."],
        tt: ["Tensor tympani", "In a canal on the **anterior** wall; V3 (1st arch). Damps loud sound."],
        lscc: ["Prominence of the lateral semicircular canal", "On the **medial** wall, above the facial canal."],
        fcan: ["Facial canal", "Bulges on the **medial** wall above the oval window, then turns down the posterior wall."],
        ow: ["Oval window", "On the medial wall, closed by the **base of the stapes**."],
        prom: ["Promontory", "On the **medial** wall: the bulge of the **basal turn of the cochlea**, carrying the **tympanic plexus**."],
        tp: ["Tympanic plexus (IX)", "On the promontory: the **glossopharyngeal** nerve's tympanic branch (→ lesser petrosal → parotid)."],
        rw: ["Round window", "On the medial wall below the promontory, closed by the secondary tympanic membrane."],
        iam: ["Internal acoustic meatus", "Carries **VII and VIII**: a tumour here gives hearing loss + loss of taste + facial weakness (drooling) on one side."],
        ant: ["Anterior wall", "Opening of the **auditory (Eustachian) tube** and the canal for **tensor tympani** (the carotid canal behind them)."],
        post: ["Posterior wall", "**Aditus to the mastoid antrum** and the **pyramid** (containing stapedius); the facial nerve descends in it."],
        stp: ["Stapedius", "From the pyramid to the stapes; facial nerve (2nd arch). Paralysis → **hyperacusis**."],
        arts: ["Arteries of the middle ear", "The **anterior tympanic** (from the **maxillary** artery) and the **stylomastoid** (from the posterior auricular), with smaller branches."],
      },
      al: {
        teg: ["tegmen tympani", "roof of the middle ear", "roof"],
        jb: ["floor of the middle ear", "jugular bulb"],
        eam: ["external acoustic meatus", "external auditory meatus", "ear canal", "ceruminous", "cerumen"],
        tm: ["tympanic membrane", "ear drum", "eardrum", "lateral wall"],
        mal: ["malleus"],
        inc: ["incus"],
        sta: ["stapes", "footplate"],
        ctn: ["chorda tympani"],
        tt: ["tensor tympani"],
        lscc: ["lateral semicircular canal"],
        fcan: ["facial canal", "prominence of the facial canal"],
        ow: ["oval window", "fenestra vestibuli"],
        prom: ["promontory", "basal turn of the cochlea", "medial wall"],
        tp: ["tympanic plexus", "tympanic branch"],
        rw: ["round window", "secondary tympanic membrane"],
        iam: ["internal acoustic meatus", "internal auditory meatus", "loss of taste", "drippling of saliva", "dribbling"],
        ant: ["anterior wall", "auditory tube", "eustachian tube", "pharyngotympanic tube"],
        post: ["posterior wall", "aditus", "mastoid antrum", "pyramid"],
        stp: ["stapedius", "hyperacusis"],
        arts: ["anterior tympanic", "anterior tympanic artery", "stylomastoid", "stylomastoid artery", "arteries supply the middle ear"],
      },
      drill: ["tm", "teg", "jb", "prom", "ow", "rw", "fcan", "mal", "inc", "sta", "ctn", "ant", "post"],
      sims: [
        { id: "walls", label: "The six walls", on: ["tm", "teg", "jb", "prom", "ant", "post"], info: "**Lateral**: tympanic membrane. **Roof**: tegmen tympani. **Floor**: jugular bulb. **Medial**: promontory, oval and round windows, facial canal. **Anterior**: auditory tube, tensor tympani. **Posterior**: aditus to the mastoid antrum, pyramid." },
        { id: "ossicles", label: "Ossicles", on: ["mal", "inc", "sta", "ow"], info: "Malleus (on the drum) → incus → **stapes** (in the oval window). Malleus and incus: 1st arch; stapes: 2nd arch." },
        { id: "nerves", label: "Nerves", on: ["ctn", "fcan", "tp", "iam"], info: "**Chorda tympani** across the lateral wall; **facial** nerve in its canal (medial, then posterior wall); **tympanic plexus (IX)** on the promontory." },
      ],
      secs: { "an-nose#5": "walls" },
      rules: [
        [/chorda|facial canal|tympanic plexus|taste|internal acoustic/i, "nerves"],
        [/malleus|incus|stapes|ossicle/i, "ossicles"],
        [/wall|roof|floor|promontory|tegmen/i, "walls"],
      ],
    });
  })();

  /* ═══════════════ 4. PHARYNGEAL ARCHES, POUCHES, CLEFTS · and the face ═══════════════ */
  (function () {
    const COL = ["#ff9f43", "#66e9ff", "#5ef0a0", "#b39cff", "#ff5d8f"];
    const ROWS = [
      ["1", "1st arch", ["mandibular", "V3"], ["mastication (masseter, temporalis,", "pterygoids), mylohyoid, ant. digastric,", "tensor tympani, tensor palati"], ["Meckel's: malleus,", "incus, spheno-", "mandibular lig."], ["pouch 1: middle ear +", "auditory tube (tubo-", "tympanic recess)"]],
      ["2", "2nd arch", ["facial", "VII"], ["facial expression (orbicularis oris,", "occipitofrontalis, buccinator, platysma),", "post. digastric, stylohyoid, stapedius"], ["Reichert's: stapes,", "styloid, lesser", "horn of hyoid"], ["pouch 2:", "palatine tonsil"]],
      ["3", "3rd arch", ["glosso-", "pharyngeal IX"], ["stylopharyngeus"], ["greater horn", "of hyoid"], ["pouch 3: inferior", "parathyroid (dorsal)", "+ THYMUS (ventral)"]],
      ["4", "4th arch", ["vagus: sup.", "laryngeal"], ["cricothyroid, pharyngeal", "constrictors, levator palati"], ["thyroid", "cartilage"], ["pouch 4: superior", "parathyroid + C cells", "(ultimobranchial)"]],
      ["6", "6th arch", ["vagus: recur-", "rent laryngeal"], ["intrinsic laryngeal muscles"], ["cricoid,", "arytenoids"], ["—"]],
    ];
    const H = 50;
    const rows = ROWS.map(([n, name, nerve, mus, sk, pouch], i) => {
      const y = 40 + i * H, c = COL[i];
      return (
        cell("a" + n, 6, y, 46, H - 4, [name], c, "#1a2b40") +
        cell("n" + n, 56, y, 66, H - 4, nerve, c) +
        cell("m" + n, 126, y, 170, H - 4, mus, c) +
        cell("s" + n, 300, y, 80, H - 4, sk, c) +
        (n !== "6" ? cell("p" + n, 384, y, 90, H - 4, pouch, c) : "")
      );
    }).join("");
    const face =
      '<text class="ttl" x="120" y="306" text-anchor="middle">THE FACE: FIVE PROMINENCES</text>' +
      '<path class="pf" data-p="fnp" d="M40 316 L200 316 L190 346 L50 346 Z" style="--c:#66e9ff;--r:#24384f"/>' + T(120, 328, "frontonasal", "sm") +
      '<path class="pf" data-p="lnp" d="M52 346 L86 346 L84 372 L62 372 Z M154 346 L188 346 L178 372 L156 372 Z" style="--c:#b39cff;--r:#3a3050"/>' + T(70, 362, "lat.", "sm") + T(170, 362, "lat.", "sm") +
      '<path class="pf" data-p="mnp" d="M96 346 L144 346 L140 384 L100 384 Z" style="--c:#5ef0a0;--r:#1e4a36"/>' + T(120, 360, "medial nasal", "sm") + T(120, 372, "→ philtrum", "sm") +
      '<path class="pf" data-p="mxp" d="M30 360 L60 372 L100 386 L96 398 L34 392 Z M210 360 L180 372 L140 386 L144 398 L206 392 Z" style="--c:#ff9f43;--r:#4a3a2a"/>' + T(46, 384, "maxillary", "sm") + T(196, 384, "maxillary", "sm") +
      '<path class="pf" data-p="mdp" d="M40 402 L200 402 L184 426 L56 426 Z" style="--c:#ff5d8f;--r:#4a2a3a"/>' + T(120, 418, "mandibular → lower lip, chin", "sm") +
      '<path class="ps" data-p="clip" d="M100 386 L98 398 M140 386 L142 398" style="--c:#ff5d7a;--r:#ff5d7a;--w:2.4" stroke-dasharray="3 2"/>' + T(226, 408, "cleft lip = maxillary + medial nasal", "sm", "start") + T(226, 418, "(intermaxillary) fail to fuse", "sm", "start");
    const clefts =
      cell("c1", 260, 302, 214, 34, ["1st CLEFT → external acoustic meatus.", "Pouches = endoderm; clefts = ectoderm."], "#ffd166") +
      cell("fist", 260, 342, 214, 44, ["2nd–4th clefts sink into the CERVICAL SINUS;", "a persistent one = branchial cyst/fistula:", "pit at the anterior border of SCM → tonsil"], "#ff5d7a");
    const svg = () =>
      '<text class="ttl" x="240" y="16" text-anchor="middle">PHARYNGEAL ARCHES · NERVE · MUSCLES · SKELETON · POUCH</text>' +
      T(29, 34, "arch", "sm mut") + T(89, 34, "nerve", "sm mut") + T(211, 34, "muscles", "sm mut") + T(340, 34, "skeleton", "sm mut") + T(429, 34, "pouch →", "sm mut") +
      rows + face + clefts;
    const P = {};
    const al = {};
    const parts = {
      a1: ["1st (mandibular) arch", "Nerve **V3**; muscles of **mastication**, mylohyoid, **anterior** digastric, tensor tympani, tensor palati; **Meckel's** cartilage (malleus, incus). Also the maxillary and mandibular prominences of the face and the anterior two-thirds of the tongue."],
      a2: ["2nd (hyoid) arch", "Nerve **VII**; muscles of **facial expression**, **posterior** digastric, stylohyoid, stapedius; **Reichert's** cartilage (stapes, styloid, lesser horn of hyoid)."],
      a3: ["3rd arch", "Nerve **IX**; stylopharyngeus; greater horn of the hyoid; posterior third of the tongue."],
      a4: ["4th arch", "Nerve **X (superior laryngeal)**; cricothyroid, pharyngeal constrictors, levator palati; thyroid cartilage."],
      a6: ["6th arch", "Nerve **X (recurrent laryngeal)**; intrinsic laryngeal muscles; cricoid and arytenoid cartilages."],
      n1: ["Nerve of the 1st arch: mandibular (V3)", ""], n2: ["Nerve of the 2nd arch: facial (VII)", ""], n3: ["Nerve of the 3rd arch: glossopharyngeal (IX)", ""], n4: ["Nerve of the 4th arch: vagus (superior laryngeal)", ""], n6: ["Nerve of the 6th arch: vagus (recurrent laryngeal)", ""],
      m1: ["1st-arch muscles", "Masseter, temporalis, pterygoids, **mylohyoid**, **anterior belly of digastric**, **tensor tympani**, **tensor palati**."],
      m2: ["2nd-arch muscles", "Muscles of facial expression (orbicularis oris, **occipitofrontalis**, buccinator, platysma), **posterior belly of digastric**, **stylohyoid**, **stapedius**."],
      m3: ["3rd-arch muscle", "**Stylopharyngeus** only."],
      m4: ["4th-arch muscles", "**Cricothyroid**, pharyngeal constrictors, **levator palati**."],
      m6: ["6th-arch muscles", "The intrinsic muscles of the larynx (except cricothyroid)."],
      s1: ["1st-arch skeleton (Meckel's cartilage)", "**Malleus, incus**, sphenomandibular ligament."],
      s2: ["2nd-arch skeleton (Reichert's cartilage)", "**Stapes**, **styloid process**, stylohyoid ligament, **lesser horn** and upper body of the hyoid."],
      s3: ["3rd-arch skeleton", "**Greater horn** and lower body of the hyoid."],
      s4: ["4th-arch skeleton", "Thyroid cartilage."],
      s6: ["6th-arch skeleton", "Cricoid and arytenoid cartilages."],
      p1: ["1st pouch", "The **tubotympanic recess** → **middle ear cavity** and **auditory tube**."],
      p2: ["2nd pouch", "The **palatine tonsil** (crypt epithelium)."],
      p3: ["3rd pouch", "Dorsal part → **inferior** parathyroid; ventral part → **thymus**. An absent thymus = a 3rd-pouch defect."],
      p4: ["4th pouch", "**Superior** parathyroid and the ultimobranchial body (parafollicular C cells)."],
      c1: ["1st cleft", "The **external acoustic meatus**. The other clefts are normally obliterated."],
      fist: ["Cervical sinus, branchial cyst and fistula", "The 2nd–4th clefts sink into the cervical sinus, which normally disappears. A **pit at the anterior border of the sternocleidomastoid** leaking mucus, opening into the **tonsillar fossa** = a persistent cervical sinus + 2nd pouch (branchial fistula)."],
      fnp: ["Frontonasal prominence", "Forehead and the nasal prominences."],
      lnp: ["Lateral nasal prominences", "The alae of the nose."],
      mnp: ["Medial nasal prominences (intermaxillary segment)", "Fuse into the **philtrum** of the upper lip, the premaxilla with the 4 upper incisors, and the primary palate."],
      mxp: ["Maxillary prominences", "The sides of the **upper lip** (and the cheeks)."],
      mdp: ["Mandibular prominences", "The **lower lip** and chin."],
      clip: ["Cleft lip", "Failure of fusion of the **maxillary prominence with the medial nasal (intermaxillary) segment**."],
    };
    Object.assign(al, {
      a1: ["first arch", "1st arch", "mandibular arch", "first pharyngeal arch", "first branchial arch", "1st pharyngeal arch", "1st branchial arch"],
      a2: ["second arch", "2nd arch", "hyoid arch", "second pharyngeal arch", "2nd pharyngeal arch", "second branchial arch"],
      a3: ["third arch", "3rd arch", "third pharyngeal arch", "3rd pharyngeal arch"],
      a4: ["fourth arch", "4th arch", "fourth pharyngeal arch", "4th pharyngeal arch"],
      a6: ["sixth arch", "6th arch", "sixth pharyngeal arch"],
      n1: ["mandibular nerve", "mandibular division", "v3"],
      n2: ["facial nerve", "facial"],
      n3: ["glossopharyngeal"],
      n4: ["superior laryngeal"],
      n6: ["recurrent laryngeal"],
      m1: ["muscles of mastication", "masseter", "temporalis", "pterygoid", "mylohyoid", "anterior belly of digastric", "anterior digastric", "tensor tympani", "tensor palati", "tensor veli palatini"],
      m2: ["muscles of facial expression", "facial expression", "orbicularis oris", "occipitofrontalis", "buccinator", "platysma", "posterior belly of digastric", "posterior digastric", "stylohyoid", "stapedius"],
      m3: ["stylopharyngeus"],
      m4: ["cricothyroid", "pharyngeal constrictor", "constrictor", "levator palati", "levator veli palatini"],
      m6: ["intrinsic laryngeal muscle", "intrinsic muscles of the larynx"],
      s1: ["meckel", "meckels cartilage", "malleus", "incus", "sphenomandibular"],
      s2: ["reichert", "reicherts cartilage", "stapes", "styloid", "styloid process", "stylohyoid ligament", "lesser horn", "lesser cornu"],
      s3: ["greater horn", "greater cornu", "body of the hyoid"],
      s4: ["thyroid cartilage"],
      s6: ["cricoid", "arytenoid", "laryngeal cartilage"],
      p1: ["first pouch", "1st pouch", "first pharyngeal pouch", "tubotympanic", "tubotympanic recess", "middle ear cavity", "cavity of the middle ear", "tympanic cavity", "auditory tube"],
      p2: ["second pouch", "2nd pouch", "second pharyngeal pouch", "palatine tonsil", "tonsil"],
      p3: ["third pouch", "3rd pouch", "third pharyngeal pouch", "inferior parathyroid", "thymus", "digeorge"],
      p4: ["fourth pouch", "4th pouch", "fourth pharyngeal pouch", "superior parathyroid", "ultimobranchial", "c cell", "parafollicular"],
      c1: ["first cleft", "1st cleft", "first pharyngeal cleft", "pharyngeal cleft", "cleft", "groove", "ectoderm"],
      fist: ["branchial fistula", "branchial cyst", "cervical sinus", "anterior border of the sternocleidomastoid", "pit at the anterior border", "tonsillar fossa"],
      fnp: ["frontonasal", "frontonasal prominence"],
      lnp: ["lateral nasal", "lateral nasal prominence"],
      mnp: ["medial nasal", "medial nasal prominence", "intermaxillary", "philtrum", "premaxilla", "primary palate"],
      mxp: ["maxillary prominence", "maxillary process", "upper lip"],
      mdp: ["mandibular prominence", "mandibular process", "lower lip", "chin"],
      clip: ["cleft lip", "failure of fusion", "gap in his upper lip"],
    });
    A.scene("arches", {
      title: "Pharyngeal arches, pouches and clefts · and how the face forms",
      vb: "0 0 480 432",
      svg,
      intro: "One row per arch: its **nerve**, **muscles**, **skeleton** and the **pouch** behind it. Below: the cleft and the face.",
      parts,
      al,
      drill: ["a1", "a2", "a3", "a4", "a6", "p1", "p2", "p3", "p4", "c1", "mnp", "mdp"],
      sims: [
        { id: "a1", label: "1st arch", on: ["a1", "n1", "m1", "s1", "p1", "c1"], info: "**1st (mandibular) arch**: V3 · mastication, mylohyoid, anterior digastric, tensor tympani, tensor palati · Meckel's cartilage (malleus, incus) · pouch 1 → middle ear and auditory tube; cleft 1 → external acoustic meatus." },
        { id: "a2", label: "2nd arch", on: ["a2", "n2", "m2", "s2", "p2"], info: "**2nd (hyoid) arch**: VII · facial expression, posterior digastric, stylohyoid, stapedius · Reichert's cartilage (stapes, styloid, lesser horn) · pouch 2 → palatine tonsil." },
        { id: "pouch", label: "Pouches", on: ["p1", "p2", "p3", "p4"], info: "1 → middle ear + auditory tube · 2 → palatine tonsil · **3 → inferior parathyroid + thymus** · **4 → superior parathyroid** + C cells. (The 3rd pouch gives the **inferior** gland.)" },
        { id: "face", label: "Face and lips", on: ["mnp", "mxp", "mdp", "clip"], info: "Upper lip = medial nasal (philtrum) + maxillary prominences; lower lip = **mandibular** prominences. **Cleft lip** = maxillary + medial nasal fail to fuse." },
      ],
      secs: { "an-nose#7": "", "an-nose#8": "pouch", "an-nose#9": "face" },
      rules: [
        [/lip|face|prominence|philtrum/i, "face"],
        [/pouch|thymus|parathyroid|tonsil|cleft|fistula|sinus/i, "pouch"],
        [/second|2nd|hyoid arch|facial expression|stapes|styloid/i, "a2"],
        [/first|1st|mandibular arch|mastication|meckel/i, "a1"],
      ],
    });
  })();

  /* ═══════════════ 5. NECK LYMPH NODES · and the atlanto-occipital / atlanto-axial joints ═══════════════ */
  (function () {
    const node = (id, x, y, r) => '<circle class="pf" data-p="' + id + '" cx="' + x + '" cy="' + y + '" r="' + (r || 6) + '" style="--c:#5ef0a0;--r:#3f6f58;--rs:#8fd3a8"/>';
    const svg = () =>
      '<text class="ttl" x="130" y="16" text-anchor="middle">LYMPH NODES OF THE HEAD AND NECK</text>' +
      '<path d="M40 60 C40 30 90 22 120 26 C160 30 186 60 186 96 L176 150 C170 176 150 190 128 196 L128 300 L64 300 L70 200 C50 180 40 140 40 60 Z" fill="#2a3444" pointer-events="none"/>' +
      '<path d="M146 190 C160 220 176 260 190 300" stroke="#8a4a5a" stroke-width="10" fill="none" opacity=".7" pointer-events="none"/>' + T(196, 290, "SCM", "sm mut", "start") +
      ps("ejv", "M164 150 C170 200 178 250 184 300", "#66e9ff", "#4a6f9a", 2.4) + T(186, 180, "external jugular v.", "sm", "start") +
      ps("ijv", "M138 176 C136 220 134 260 132 300", "#b39cff", "#6e5a9a", 3) + T(100, 312, "internal jugular v. (deep)", "sm", "start") +
      node("par", 150, 110) + T(160, 102, "parotid", "sm", "start") +
      node("smd", 118, 176) + T(92, 172, "submandibular", "sm", "end") +
      node("smt", 88, 196, 5) + T(64, 210, "submental", "sm", "end") +
      node("sc", 170, 214, 5) + node("sc", 176, 240, 5) + T(196, 232, "superficial cervical", "sm", "start") +
      node("dc", 136, 196, 7) + node("dc", 134, 256, 7) + T(118, 234, "deep cervical", "sm", "end") + T(118, 244, "(jugulodigastric,", "sm", "end") + T(118, 254, "jugulo-omohyoid)", "sm", "end") +
      node("ac", 104, 284, 4) + T(94, 296, "anterior cervical", "sm", "end");
    const joints =
      '<text class="ttl" x="376" y="16" text-anchor="middle">JOINTS OF THE ATLAS AND AXIS</text>' +
      '<path class="pf" data-p="aoj" d="M300 60 C318 44 344 44 350 60 L346 70 C336 62 318 62 306 70 Z M402 60 C420 44 446 44 452 60 L446 70 C436 62 418 62 406 70 Z" style="--c:#ffd166;--r:#8a7a66"/>' + T(376, 40, "occipital condyles on the atlas", "sm") + T(376, 84, "ATLANTO-OCCIPITAL: ellipsoid synovial → nodding (yes)", "sm") +
      '<ellipse cx="376" cy="140" rx="70" ry="34" fill="none" stroke="#c9b8a8" stroke-width="10" pointer-events="none"/>' + T(376, 110, "atlas (ring)", "sm mut") +
      '<path class="pf" data-p="dens" d="M364 126 C364 114 388 114 388 126 L388 150 L364 150 Z" style="--c:#5ef0a0;--r:#e8e3d8"/>' + T(376, 144, "dens", "sm dk") +
      '<path class="pf" data-p="tlig" d="M318 156 C340 170 412 170 434 156 L430 150 C410 162 342 162 322 150 Z" style="--c:#66e9ff;--r:#8fb4c9"/>' + T(376, 184, "transverse ligament", "sm") +
      T(376, 202, "MEDIAN ATLANTO-AXIAL: pivot synovial → rotation (no)", "sm") +
      '<path class="pf" data-p="laj" d="M306 226 L346 226 L346 236 L306 236 Z M406 226 L446 226 L446 236 L406 236 Z" style="--c:#ffd166;--r:#8a7a66"/>' + T(376, 252, "LATERAL ATLANTO-AXIAL: plane joints", "sm");
    A.scene("neckln", {
      title: "Neck · the lymph node groups, and the atlas–axis joints",
      vb: "0 0 480 322",
      svg: () => svg() + joints,
      intro: "Left: which node group sits where (and along which vein). Right: the three joint types at the top of the neck.",
      parts: {
        par: ["Parotid nodes", "Drain the forehead, temple and parotid region."],
        smd: ["Submandibular nodes", "Drain most of the face, the nose (and nasal **vestibule**), the teeth and the **side of the tongue**."],
        smt: ["Submental nodes", "Drain the **tip of the tongue**, the central lower lip, the floor of the mouth and the chin."],
        sc: ["Superficial cervical nodes", "Along the **external jugular vein**."],
        dc: ["Deep cervical nodes", "Along the **internal jugular vein**: the **jugulodigastric** (tonsil) and **jugulo-omohyoid** (tongue) nodes; the final common pathway of head and neck lymph."],
        ac: ["Anterior cervical nodes", "Along the anterior jugular vein."],
        ejv: ["External jugular vein", "The superficial cervical nodes lie along it."],
        ijv: ["Internal jugular vein", "The deep cervical nodes lie along it."],
        aoj: ["Atlanto-occipital joints", "**Ellipsoid (condyloid) synovial** joints between the occipital condyles and the atlas: **nodding** ('yes')."],
        dens: ["Dens of the axis", "The pivot of the median atlanto-axial joint."],
        tlig: ["Transverse ligament of the atlas", "Holds the dens against the anterior arch of the atlas."],
        laj: ["Lateral atlanto-axial joints", "**Plane** synovial joints."],
      },
      al: {
        par: ["parotid node", "parotid lymph node"],
        smd: ["submandibular node", "submandibular lymph node", "side of the tongue"],
        smt: ["submental node", "submental lymph node", "tip of the tongue"],
        sc: ["superficial cervical", "superficial cervical lymph node"],
        dc: ["deep cervical", "jugulodigastric", "jugulo omohyoid", "juguloomohyoid"],
        ac: ["anterior cervical node", "anterior jugular"],
        ejv: ["external jugular vein", "external jugular"],
        ijv: ["internal jugular vein", "internal jugular"],
        aoj: ["atlanto occipital", "atlantooccipital", "atlanto-occipital joint", "ellipsoid", "condyloid", "nodding"],
        dens: ["dens", "odontoid", "pivot"],
        tlig: ["transverse ligament", "transverse ligament of the atlas"],
        laj: ["lateral atlanto axial", "plane joint", "plane synovial"],
      },
      drill: ["par", "smd", "smt", "sc", "dc", "aoj", "dens", "laj"],
      sims: [
        { id: "veins", label: "Nodes by vein", on: ["sc", "ejv", "dc", "ijv"], info: "**Superficial cervical** nodes along the **external** jugular vein; **deep cervical** along the **internal** jugular vein; anterior cervical along the anterior jugular vein." },
        { id: "joints", label: "Joint types", on: ["aoj", "dens", "tlig", "laj"], info: "Atlanto-occipital: **ellipsoid** synovial (yes). Median atlanto-axial: **pivot** synovial (no). Lateral atlanto-axial: **plane**." },
      ],
      secs: { "an-nose#6": "" },
      rules: [
        [/atlanto|joint|dens|pivot/i, "joints"],
        [/lymph|node/i, "veins"],
      ],
    });
  })();
})();
