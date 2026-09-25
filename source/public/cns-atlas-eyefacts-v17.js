/* INTELLECTUALITY v17.3 · Eye physiology boards: the rhodopsin cycle and phototransduction with rods, cones,
 * ganglion cells, the pigment epithelium and dark adaptation; and the pupillary light reflex in the clinic
 * (direct and consensual, its uses, the Argyll Robertson pupil). Drawn from the notes' wording (ph-retina,
 * ph-refraction#1, hi-eye).
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
  const arr = (d, c) => '<path d="' + d + '" stroke="' + (c || "#d9ff43") + '" stroke-width="1.6" fill="none" marker-end="url(#ixArr)" pointer-events="none"/>';
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

  /* ═══════════════ 1. PHOTOTRANSDUCTION ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">PHOTOTRANSDUCTION · THE RHODOPSIN CYCLE, RODS, CONES, DARK ADAPTATION</text>' +
      box(4, 22, 280, 246) + T(144, 36, "LIGHT BLEACHES · DARK REBUILDS", "sm mut") +
      cell("n_rho", 84, 44, 120, 26, ["RHODOPSIN = scotopsin", "+ 11-cis retinal"], P, PR) +
      cell("n_light", 176, 88, 104, 36, ["LIGHT: 11-cis →", "ALL-TRANS retinal", "(pigment bleached)"], Y, YR) +
      cell("n_meta", 176, 136, 104, 26, ["METARHODOPSIN II", "(activated) ↑"], Y, YR) +
      cell("n_trans", 84, 176, 120, 36, ["→ TRANSDUCIN (G protein)", "→ phosphodiesterase", "→ cGMP ↓"], O, OR) +
      cell("n_close", 8, 126, 104, 46, ["cGMP-gated Na⁺", "channels CLOSE →", "HYPERpolarization", "→ LESS glutamate"], R, RR) +
      cell("n_regen", 8, 70, 104, 46, ["DARK: all-trans →", "11-cis (vitamin A,", "pigment epithelium)", "→ REGENERATED"], G, GR) +
      arr("M204 60 C226 64 234 74 232 86") + arr("M228 124 L228 134") + arr("M190 164 C182 170 176 174 170 176") + arr("M84 196 C70 196 62 186 60 174") + arr("M60 126 L60 118") + arr("M60 70 C62 56 72 52 84 54") +
      T(144, 134, "the cycle", "sm mut") +
      cell("dark", 8, 218, 272, 46, ["IN THE DARK: the DARK CURRENT = Na⁺ INFLUX through", "cGMP-gated channels in the outer segment → the", "photoreceptor is depolarized and releases glutamate", "continuously; light switches that current off"], B, BR) +
      // right: cells and facts
      box(290, 22, 226, 246) + T(403, 36, "WHO DOES WHAT", "sm mut") +
      cell("pr", 296, 44, 214, 36, ["PHOTORECEPTORS: HYPERpolarize to light,", "release GLUTAMATE (less in light),", "no action potentials"], B, BR) +
      cell("gc", 296, 84, 214, 26, ["GANGLION cells: the only retinal spikes;", "ON- and OFF-centre (not always hyperpol.)"], B, BR) +
      cell("rods", 296, 114, 214, 26, ["RODS: ONE pigment (rhodopsin), dim light,", "periphery, no colour; spherule ending"], P, PR) +
      cell("cones", 296, 144, 214, 36, ["CONES: THREE types (blue, green, red)", "photopsins: colour = the RATIO of the three;", "fovea, acuity; PEDICLE ending"], O, OR) +
      cell("rpe", 296, 184, 214, 36, ["PIGMENT EPITHELIUM: melanin stops light", "scatter, stores vitamin A · ALBINO → glare,", "REDUCED (not hyper) acuity"], G, GR) +
      cell("fov2", 296, 224, 214, 36, ["FOVEA: cones only, inner layers pushed", "aside, AVASCULAR · dark-adapted eye sees", "dim objects best OFF-centre"], G, GR) +
      // adaptation
      '<text class="ttl" x="260" y="286" text-anchor="middle">ADAPTATION</text>' +
      box(4, 292, 512, 106) +
      '<path d="M24 306 L24 380 L262 380" stroke="#6f8aa8" fill="none" pointer-events="none"/>' + T(18, 312, "sensitivity", "sm mut", "start") + T(158, 394, "minutes in the dark →", "sm mut") +
      ps("cone_c", "M26 372 C40 346 60 336 80 334 L110 334", O, "#6a4a2a", 2.4) +
      ps("rod_c", "M80 334 C100 330 110 318 130 314 C170 306 210 304 256 302", P, "#5a4a8a", 2.4) +
      T(60, 330, "cones: fast, little", "sm") + T(184, 298, "rods: slow, much more", "sm") + T(80, 394, "~10", "sm mut") + T(230, 394, "20–40", "sm mut") +
      cell("darkad", 270, 298, 240, 36, ["DARK ADAPTATION: pigments REGENERATE; cones", "done in ~10 min (the bank's 'nearly maximal');", "rods 20–40 min for full adaptation"], P, PR) +
      cell("lightad", 270, 338, 118, 36, ["LIGHT adaptation:", "pigments bleached,", "sensitivity falls"], Y, YR) +
      cell("vita", 392, 338, 118, 36, ["vitamin A lack →", "NIGHT blindness", "(rods fail first)"], R, RR);
    A.scene("photo", {
      title: "Phototransduction · the rhodopsin cycle, rods and cones, ganglion cells, dark adaptation",
      vb: "0 0 520 402",
      svg,
      intro: "Left: **light bleaches** rhodopsin and closes the Na⁺ channels (the rod **hyperpolarizes**); **darkness rebuilds** it. Right: who does what in the retina. Bottom: dark adaptation, cones first, rods later.",
      parts: {
        n_rho: ["Rhodopsin", "Formed when **scotopsin and 11-cis retinal** combine: the rod pigment."],
        n_light: ["Light: 11-cis → all-trans retinal", "Rod excitation by photons converts **11-cis-retinal to all-trans-retinal**: the pigment is decomposed (bleached) by **light**, not by darkness. Scotopsin is not converted to photopsin."],
        n_meta: ["Metarhodopsin II", "The activated form: stimulation of photoreceptors by light **increases the formation of metarhodopsin II**, which activates transducin."],
        n_trans: ["Transducin → PDE → cGMP falls", "Metarhodopsin II activates the G protein **transducin** → phosphodiesterase → **cGMP falls**."],
        n_close: ["Na⁺ channels close → hyperpolarization", "When rhodopsin is decomposed by light, the **membrane permeability for sodium ions in the outer segment decreases** → the rod **hyperpolarizes** → **decreased release of transmitter**."],
        n_regen: ["Regeneration in the dark", "All-trans retinal → 11-cis (vitamin A, via the pigment epithelium) → rhodopsin **regenerated in the dark**: photopigments are **not** inactivated or broken down by darkness."],
        dark: ["The dark current", "Results from the **influx of sodium ions via cGMP-dependent sodium channels** in the outer segment: in the dark the photoreceptor is depolarized and releases glutamate continuously."],
        pr: ["Photoreceptors", "Rods and cones **hyperpolarize** to light and **release glutamate** (less in light); they make graded potentials, not action potentials."],
        gc: ["Ganglion cells", "The only retinal cells that fire **action potentials**; **ON-centre** cells are excited and **OFF-centre** cells inhibited by light in the centre, so they do not always hyperpolarize. Their axons end in the **lateral** geniculate body."],
        rods: ["Rods", "One pigment (rhodopsin), very sensitive: dim-light (scotopic), peripheral, no colour. The rod's inner fibre ends in a **spherule** (the cone's in a **pedicle**)."],
        cones: ["Cones", "**Three types** (blue, green and red photopsins): colour is read from the **ratio** of their stimulation; concentrated at the **fovea** for acuity. Their inner fibre ends in a **pedicle**."],
        rpe: ["Retinal pigment epithelium", "The outermost layer, a **single layer of cuboidal** cells: its **melanin prevents reflection (scatter) of light**, it stores vitamin A, recycles retinal and eats old discs. In **albinos** melanin is absent → glare and **reduced** acuity."],
        fov2: ["Fovea centralis", "Cones only, inner layers pushed aside, **avascular** (not highly vascular). In a dark-adapted eye dim objects are seen best **off-centre** (rod-rich periphery)."],
        cone_c: ["Cone adaptation", "Fast but small."],
        rod_c: ["Rod adaptation", "Slow but much larger."],
        darkad: ["Dark adaptation", "In the dark, photopigments are **regenerated** → sensitivity rises enormously. Cone adaptation is done in ~10 min (the bank's 'nearly maximal in about 10 minutes'); rod adaptation takes **20–40 min** to be complete (≈ 40 min for full)."],
        lightad: ["Light adaptation", "Pigments are bleached → sensitivity falls."],
        vita: ["Vitamin A deficiency", "Too little retinal → **night blindness**."],
      },
      al: {
        n_rho: ["rhodopsin", "scotopsin", "scotopsin and 11 cis retinal"],
        n_light: ["11 cis retinal", "all trans retinal", "11 cis retinal to all trans retinal", "scotopsin to photopsin", "decomposed by light", "broken down by light", "bleached"],
        n_meta: ["metarhodopsin ii", "metarhodopsin", "formation of metarhodopsin ii"],
        n_trans: ["transducin", "phosphodiesterase"],
        n_close: ["membrane permeability for sodium ions", "permeability for sodium", "sodium ions decreases", "sodium ions increases", "decreased release of neurotransmitter", "decreased release of transmitter"],
        n_regen: ["regenerated in the dark", "inactivated by darkness", "broken down by darkness", "is broken down by darkness"],
        dark: ["dark current", "influx of sodium ions", "cgmp dependent sodium channels"],
        pr: ["photoreceptors", "photoreceptor", "release glutamate", "stimulation of photoreceptors"],
        gc: ["ganglion cells", "the ganglion cells", "hyperpolarize in response to light", "on center", "off center"],
        rods: ["rod cells", "rods", "spherule"],
        cones: ["cones", "cone", "three types of cones", "they are of one type", "photopsin", "photopsins", "pedicle", "inner fiber ends by pedicle"],
        rpe: ["pigmented layer", "pigment epithelium", "retinal pigmented epithelium", "melanin in the pigmented layer", "albino", "albinos", "hyperacuity", "reflection of light", "allows reflection of light"],
        fov2: ["highly vascular", "fovea centralis is characterized"],
        darkad: ["dark adaptation", "dark adapted"],
        lightad: ["light adaptation"],
        vita: ["vitamin a", "night blindness"],
      },
      drill: ["n_rho", "n_light", "n_meta", "n_trans", "n_close", "n_regen", "dark", "pr", "gc", "cones", "rpe", "darkad"],
      sims: [
        { id: "light", label: "▶ Light", on: ["n_light", "n_meta", "n_trans", "n_close", "pr"], info: "Light: **11-cis → all-trans** → **metarhodopsin II** → transducin → **cGMP ↓** → Na⁺ channels **close** → **hyperpolarization** → less glutamate." },
        { id: "darkc", label: "▶ Dark", on: ["n_regen", "n_rho", "dark", "darkad", "rod_c", "cone_c"], info: "Dark: the **dark current** (Na⁺ in through cGMP channels) depolarizes the cell; rhodopsin is **regenerated**; sensitivity climbs (cones ~10 min, rods 20–40 min)." },
        { id: "cells", label: "Rods, cones, ganglion", on: ["rods", "cones", "gc", "rpe", "fov2"], info: "Rods: one pigment, dim light. Cones: **three** types, colour, fovea. Ganglion cells: the only spikes, ON and OFF. Pigment epithelium: melanin, vitamin A." },
      ],
      secs: {},
      rules: [[/dark adaptation/i, "darkc"]],
    });
  })();

  /* ═══════════════ 2. THE PUPILLARY LIGHT REFLEX IN THE CLINIC ═══════════════ */
  (function () {
    const eye = (id, x, y, r) =>
      '<ellipse cx="' + x + '" cy="' + y + '" rx="34" ry="20" fill="#e8eef5" opacity=".85" pointer-events="none"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="15" fill="#4a7aa8" pointer-events="none"/>' +
      '<circle class="pf" data-p="' + id + '" cx="' + x + '" cy="' + y + '" r="' + r + '" style="--c:#0b1522;--r:#0b1522"/>';
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">THE PUPILLARY LIGHT REFLEX · DIRECT, CONSENSUAL, AND WHAT IT TELLS YOU</text>' +
      box(4, 22, 250, 122) +
      eye("p_dir", 70, 70, 5) + eye("p_con", 186, 70, 5) +
      '<path d="M18 36 L52 62" stroke="#ffd166" stroke-width="3" pointer-events="none"/>' + T(20, 32, "light", "sm", "start") +
      T(70, 104, "DIRECT: lit eye", "sm") + T(186, 104, "CONSENSUAL: other eye", "sm") + T(128, 124, "light in ONE eye constricts BOTH", "sm mut") +
      cell("lr_path", 260, 22, 256, 58, ["retina → optic nerve → optic tract →", "PRETECTAL nucleus (not the LGB) → BOTH", "Edinger–Westphal → III → ciliary ganglion", "→ SPHINCTER pupillae"], B, BR) +
      cell("lr_both", 260, 84, 256, 26, ["both pupils constrict (direct + consensual):", "not the lit eye only"], B, BR) +
      cell("sph", 260, 114, 126, 30, ["SPHINCTER: circular,", "parasympathetic (III)"], G, GR) +
      cell("dil", 390, 114, 126, 30, ["DILATOR: radial,", "sympathetic"], O, OR) +
      cell("lr_use", 4, 150, 250, 46, ["CLINICAL USES (all of the above):", "detecting BRAIN DEATH, judging the STAGES", "(depth) of ANAESTHESIA, testing the", "OCULOMOTOR nerve's integrity"], Y, YR) +
      cell("ar", 260, 150, 256, 46, ["ARGYLL ROBERTSON pupil (NEUROSYPHILIS):", "light reflex ABSENT, accommodation PRESENT;", "lesion in the PRETECTAL region, NOT the", "Edinger–Westphal nucleus"], R, RR) +
      cell("near", 4, 202, 512, 26, ["NEAR response (accommodation, convergence, miosis) runs through the cortex, not the pretectal nucleus:", "so it is KEPT in the Argyll Robertson pupil and normal after a pretectal lesion"], P, PR);
    A.scene("pupilclin", {
      title: "Pupillary light reflex in the clinic · direct and consensual, its uses, the Argyll Robertson pupil",
      vb: "0 0 520 232",
      svg,
      intro: "Light in **one** eye constricts **both** pupils. The reflex runs through the **pretectal** nucleus, which is why a pretectal lesion (neurosyphilis) loses it while the near response survives.",
      parts: {
        p_dir: ["Direct light reflex", "The lit eye constricts."],
        p_con: ["Consensual light reflex", "The **other** eye constricts too: both Edinger–Westphal nuclei are driven."],
        lr_path: ["Light-reflex pathway", "Retina → optic nerve → optic tract → **pretectal nucleus** (not the lateral geniculate body or superior colliculus) → **both** Edinger–Westphal nuclei → oculomotor nerve → ciliary ganglion → short ciliary nerves → sphincter pupillae."],
        lr_both: ["Direct + consensual", "Directing light to one eye constricts **both** pupils, not the lit eye only."],
        sph: ["Sphincter pupillae", "The **circular** muscle of the iris: **parasympathetic** (III via the ciliary ganglion); constricts the pupil."],
        dil: ["Dilator pupillae", "Radial fibres: **sympathetic**; dilates the pupil."],
        lr_use: ["Clinical uses of the light reflex", "Detecting **brain death**, judging the **stages (depth) of anaesthesia**, testing **oculomotor nerve** integrity: **all of the above**."],
        ar: ["Argyll Robertson pupil", "In **neurosyphilis**: the **light reflex is absent** and **accommodation is present**. The lesion is in the **pretectal** region, not the Edinger–Westphal nucleus (needed for both). The reflex is **not** intact in neurosyphilis."],
        near: ["The near response", "Accommodation, convergence and miosis run through the **cortex**: kept in the Argyll Robertson pupil, normal if the pretectal nucleus is damaged."],
      },
      al: {
        p_con: ["consensual", "consensual light reflex", "constriction in this eye only"],
        p_dir: ["direct light reflex"],
        lr_path: ["light reflex", "pupillary light reflex", "light reflex centre", "light reflex center"],
        lr_both: ["both pupils", "this eye only"],
        sph: ["sphincter pupillae", "circular muscle of the iris"],
        dil: ["dilator pupillae", "radial muscle"],
        lr_use: ["brain death", "stages of anesthesia", "stages of anaesthesia", "evaluate the stages of anesthesia", "occulomotor nerve integrity", "oculomotor nerve integrity", "clinically important"],
        ar: ["argyll robertson", "argyll robertson pupil", "neurosyphilis", "light reflex is absent", "intact in neurosyphilis"],
        near: ["near response", "accommodation reflex", "accommodation is present"],
      },
      drill: ["p_con", "lr_path", "lr_both", "sph", "lr_use", "ar", "near"],
      sims: [
        { id: "reflex", label: "▶ Light in one eye", on: ["p_dir", "p_con", "lr_path", "lr_both", "sph"], info: "Light in **one** eye → pretectal nucleus → **both** EW nuclei → **both** pupils constrict." },
        { id: "argyll", label: "Argyll Robertson", on: ["ar", "near"], lost: ["p_dir", "p_con"], info: "**Neurosyphilis**, pretectal lesion: no light reflex, but the **near response** is kept." },
      ],
      secs: {},
      rules: [],
    });
  })();
})();
