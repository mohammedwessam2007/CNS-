/* INTELLECTUALITY v17.3 · Sensory physiology close-ups: the receptor potential, adaptation and the sensory code;
 * touch, two-point discrimination, the S1 map and its lesions, proprioception, vibration and thermal sensation.
 * Drawn from the notes' wording (ph-sensory-receptors, ph-sensory-code, ph-sensory-pathways#3, ph-sensory-lesions).
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
  const spikes = (xs, y0, y1) => xs.map((x) => "M" + x + " " + y0 + " L" + x + " " + y1).join(" ");
  const G = "#5ef0a0",
    GR = "#1e4a36",
    B = "#66e9ff",
    BR = "#1d3a55",
    Y = "#ffd166",
    YR = "#4a4030",
    O = "#ff9f43",
    OR = "#4a3020",
    P = "#b39cff",
    PR = "#3a3060";

  /* ═══════════════ 1. RECEPTOR POTENTIAL, ADAPTATION, CODE ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">SENSORY RECEPTORS · POTENTIAL, ADAPTATION, CODE</text>' +
      // receptor potential
      box(4, 22, 252, 228) + T(130, 34, "THE RECEPTOR POTENTIAL", "sm mut") +
      '<ellipse class="pf" data-p="rp_pac" cx="36" cy="78" rx="22" ry="30" style="--c:' + B + ';--r:#24384f"/>' +
      '<ellipse cx="36" cy="78" rx="15" ry="21" fill="none" stroke="#4a6f9a" pointer-events="none"/><ellipse cx="36" cy="78" rx="8" ry="12" fill="none" stroke="#4a6f9a" pointer-events="none"/>' +
      ps("rp_ax", "M36 70 L36 176", Y, "#8a7a4a", 2.2) +
      '<rect x="31" y="118" width="10" height="16" fill="#2a3a52" pointer-events="none"/><rect x="31" y="142" width="10" height="30" fill="#2a3a52" pointer-events="none"/>' +
      '<circle class="pf" data-p="rp_node" cx="36" cy="138" r="5" style="--c:#ff5d7a;--r:#6a3040"/>' + T(46, 141, "1st node", "sm", "start") +
      '<path class="pf" data-p="rp_na" d="M6 58 L20 66 L16 58 Z" style="--c:' + G + ';--r:#2f8a5c"/>' + T(8, 50, "Na⁺ in", "sm", "start") +
      ps("rp_elec", "M50 96 C60 108 58 124 44 134", G, "#2f6a4c", 1.4) + T(62, 114, "electrotonic", "sm", "start") +
      // traces
      ps("rp_st", "M84 68 L110 68 L110 58 L150 58 L150 68 L176 68 L176 46 L216 46 L216 68 L248 68", "#d9ff43", "#6a7a3a", 1.6) + T(130, 54, "weak", "sm mut") + T(220, 54, "strong", "sm mut", "start") +
      ps("rp_thr", "M84 104 L248 104", "#ff5d7a", "#6a3040", 1) + T(86, 100, "threshold", "sm mut", "start") +
      ps("rp_graph", "M84 128 L110 128 C112 110 116 100 130 100 L150 102 C156 118 160 126 176 128 C178 92 184 80 196 80 L216 82 C222 106 228 124 248 128", B, "#3a6a8a", 2.2) +
      ps("rp_ap", spikes([120, 134, 146], 170, 142) + " " + spikes([182, 188, 194, 200, 206, 212], 170, 142), "#ff5d7a", "#8a3a50", 1.6) +
      T(166, 184, "1st-node impulses: faster when bigger", "sm mut") +
      cell("rp_grad", 8, 192, 120, 16, ["GRADED: size ∝ stimulus"], B, BR) + cell("rp_local", 132, 192, 120, 16, ["LOCAL, not propagated"], B, BR) +
      cell("rp_norp", 8, 212, 120, 16, ["NO refractory period"], B, BR) + cell("rp_sum", 132, 212, 120, 16, ["SUMMATES, not all-or-none"], B, BR) +
      cell("rp_dur", 8, 232, 120, 16, ["LONGER than an AP"], B, BR) + cell("rp_spec", 132, 232, 120, 16, ["ONE adequate stimulus"], B, BR) +
      // adaptation
      box(262, 22, 254, 228) + T(389, 36, "ADAPTATION TO A STEADY STIMULUS", "sm mut") +
      '<rect x="290" y="44" width="180" height="8" rx="2" fill="#d9ff43" opacity=".55" pointer-events="none"/>' + T(380, 62, "steady pressure", "sm mut") +
      ps("ad_ph", spikes([292, 296, 300, 470, 474], 90, 70), O, "#6a4a2a", 1.6) + T(508, 84, "phasic", "sm", "end") +
      ps("ad_to", spikes([292, 296, 300, 306, 314, 324, 336, 348, 360, 372, 384, 396, 408, 420, 432, 444, 456, 468], 120, 100), G, "#2f6a4c", 1.6) + T(508, 114, "tonic", "sm", "end") +
      cell("ad_fast", 268, 128, 242, 26, ["RAPID (phasic): PACINIAN (fastest), Meissner,", "hair follicle = the TOUCH receptors → CHANGE"], O, OR) +
      cell("ad_slow", 268, 158, 242, 46, ["SLOW (tonic): muscle SPINDLE, GTO, joint receptors,", "NOCICEPTORS, BARORECEPTORS, chemoreceptors,", "LUNG (alveolar) STRETCH, Merkel, Ruffini", "(the bank also lists auditory receptors)"], G, GR) +
      cell("ad_mod", 268, 208, 242, 16, ["MODERATE: thermal receptors"], Y, YR) +
      cell("ad_why", 268, 228, 242, 16, ["tonic = the body's ongoing state (posture, BP)"], G, GR) +
      // code
      box(4, 256, 512, 158) + T(260, 270, "THE SENSORY CODE", "sm mut") +
      cell("ch_mod", 8, 278, 166, 36, ["MODALITY: LABELED LINE", "(Müller's law of specific", "nerve energies): the pathway"], P, PR) +
      cell("ch_loc", 178, 278, 164, 36, ["LOCATION: point-to-point", "connection from receptor", "to the sensory cortex"], P, PR) +
      cell("ch_proj", 346, 278, 166, 36, ["LAW OF PROJECTION: felt", "at the RECEPTOR wherever the", "pathway is stimulated"], P, PR) +
      cell("ch_int", 8, 318, 166, 36, ["INTENSITY: bigger receptor", "potential → higher AP", "FREQUENCY + RECRUITMENT"], B, BR) +
      cell("ch_law", 178, 318, 164, 36, ["WEBER–FECHNER (log) and", "power law: doubling the", "stimulus ≠ double the rate"], B, BR) +
      cell("ch_phan", 346, 318, 166, 36, ["PHANTOM LIMB: neighbours", "invade the hand area of the", "OPPOSITE S1"], P, PR) +
      T(260, 368, "BY STIMULUS", "sm mut") +
      cell("cl_mech", 8, 374, 98, 26, ["MECHANO-", "touch, stretch"], "#d9ff43", "#3a4a20") +
      cell("cl_therm", 110, 374, 98, 26, ["THERMO-", "cold, warm"], "#d9ff43", "#3a4a20") +
      cell("cl_noc", 212, 374, 98, 26, ["NOCICEPTORS", "pain"], "#d9ff43", "#3a4a20") +
      cell("cl_chem", 314, 374, 98, 26, ["CHEMO-", "taste, smell, O₂"], "#d9ff43", "#3a4a20") +
      cell("cl_em", 416, 374, 96, 26, ["ELECTROMAGNETIC", "rods and cones"], "#d9ff43", "#3a4a20");
    A.scene("receptor", {
      title: "Sensory receptors · the receptor potential, adaptation and the sensory code",
      vb: "0 0 520 418",
      svg,
      intro: "Top-left: a stimulus becomes a **graded receptor potential**, then impulses at the first node. Top-right: **phasic vs tonic** receptors. Bottom: how modality, location and intensity are coded.",
      parts: {
        rp_pac: ["Receptor ending (Pacinian corpuscle)", "Deformation opens non-specific cation channels in the ending."],
        rp_na: ["Na⁺ influx", "The stimulus opens **Na⁺ (cation) channels** → **Na⁺ influx** → local depolarization. A specific stimulus produces a receptor potential by **enhancing Na⁺ influx**: not Na⁺ efflux, not K⁺ efflux, not hyperpolarization."],
        rp_elec: ["Electrotonic spread", "The receptor potential spreads **electrotonically** only to the spike-initiating region. It is **not** transmitted along the sensory fibre to the CNS."],
        rp_ax: ["Sensory fibre", "Carries the **action potentials**, not the receptor potential."],
        rp_node: ["First node of Ranvier", "The spike-initiating region: when the receptor potential reaches threshold it **generates a nerve impulse here**, not at the receptive ending."],
        rp_st: ["Stimulus strength", "A stronger stimulus → a bigger receptor potential."],
        rp_thr: ["Threshold", "A receptor potential **could** initiate an action potential, but only when it reaches threshold."],
        rp_graph: ["Receptor potential", "Graded, local, non-propagated depolarization."],
        rp_ap: ["Impulse frequency", "Stronger stimulus → **higher frequency** of action potentials (same conduction velocity, same threshold)."],
        rp_grad: ["Graded", "Its **amplitude depends on (is proportional to) stimulus intensity**; it does not obey the all-or-none rule."],
        rp_local: ["Local, non-propagated", "It is not an action potential and is not actively conducted."],
        rp_norp: ["No refractory period", "It has **no** (absolute) refractory period, so it can summate."],
        rp_sum: ["Summation", "Temporal and spatial summation; not all-or-none."],
        rp_dur: ["Longer than an AP", "It lasts as long as the stimulus acts (not 0.5 ms)."],
        rp_spec: ["Adequate stimulus", "Each receptor is specialised for **one** adequate stimulus (modality specificity); it does **not** respond to a broad range of stimuli at normal intensity."],
        ad_ph: ["Phasic response", "Fires at the start (and end) of a steady stimulus, then falls silent."],
        ad_to: ["Tonic response", "Keeps firing as long as the stimulus lasts."],
        ad_fast: ["Rapidly adapting (phasic) receptors", "**Pacinian corpuscle** (the fastest), Meissner's corpuscle, hair-follicle receptors: the **touch receptors**. They signal **change** (rate, vibration)."],
        ad_slow: ["Slowly adapting (tonic) receptors", "**Muscle spindles**, Golgi tendon organs, joint receptors, **nociceptors**, **baroreceptors**, chemoreceptors, **lung (alveolar) stretch receptors**, Merkel discs and Ruffini endings; the bank also lists **auditory** receptors as tonic. Touch receptors and the Pacinian corpuscle are **not** tonic."],
        ad_mod: ["Moderately adapting: thermal receptors", "Thermal receptors adapt partly but keep signalling a steady temperature."],
        ad_why: ["Why tonic receptors matter", "They keep the brain informed of the body's **ongoing state** (posture, blood pressure, lung volume)."],
        ch_mod: ["Modality: the labeled line", "Decided by the **anatomical connection between the receptor and a specific sensory area**: each fibre carries one modality (**labeled line principle**, Müller's law of specific nerve energies). Not by the magnitude of the stimulus or of the receptor potential. The **nature of the stimulus** only decides which receptor fires; how fast a receptor adapts decides how long a steady stimulus is felt. Neither tells **where** it is: that is the receptor's own connection (localization)."],
        ch_loc: ["Location", "Localization depends on the **point-to-point (somatotopic) connection** between the receptor and the sensory cortex."],
        ch_proj: ["Law of projection", "No matter where a sensory pathway is stimulated along its course, the sensation is **referred to the location of the receptor**."],
        ch_int: ["Intensity", "A stronger stimulus → a **receptor potential of higher magnitude** → a **higher AP frequency**, plus **recruitment** of more receptors."],
        ch_law: ["Weber–Fechner and power laws", "Perceived intensity rises with the **logarithm** of stimulus strength (power law, Stevens): not linear."],
        ch_phan: ["Phantom limb", "After losing the **right** hand, fibres from **neighbouring** sensory areas project into the **right-hand area of the left S1**: their input is felt 'in the hand'."],
        cl_mech: ["Mechanoreceptors", "Touch, pressure, stretch, hearing, balance."],
        cl_therm: ["Thermoreceptors", "Cold and warm receptors."],
        cl_noc: ["Nociceptors", "Pain: free nerve endings."],
        cl_chem: ["Chemoreceptors", "Taste, smell, blood O₂/CO₂."],
        cl_em: ["Electromagnetic receptors", "Photoreceptors: rods and cones."],
      },
      al: {
        rp_na: ["na+ influx", "na influx", "na + influx", "influx of na", "na+ efflux", "na + efflux", "k+ efflux", "k + efflux", "k+ influx", "permeability to k+", "increase of the membrane permeability", "cation channels"],
        rp_elec: ["electrotonic", "electrotonic current", "electrotonically"],
        rp_node: ["nerve impulse at the receptive region", "spike initiating", "first node of ranvier", "first node"],
        rp_graph: ["receptor potential", "receptor potentials", "generator potential"],
        rp_grad: ["amplitude is proportional", "proportional to the intensity", "amplitude is not related", "higher magnitudes", "magnitude of the receptor potential"],
        rp_local: ["non propagated", "not propagated", "local potential"],
        rp_norp: ["absolute refractory period", "refractory period", "long absolute refractory period"],
        rp_sum: ["not all or none", "does not obey the all or none"],
        rp_dur: ["stays for a variable period"],
        rp_spec: ["adequate stimulus", "specific stimulus", "broad range of stimuli", "one form of energy", "only by specific stimuli", "specific stimuli"],
        ad_fast: ["rapidly adapting", "rapidly adapting receptors", "phasic receptors", "touch receptors", "immediate inactivation"],
        ad_slow: ["slowly adapting", "slowly adapting receptors", "tonic receptors", "tonic sensory receptors", "baroreceptors", "lung stretch receptors", "alveolar stretch receptors", "auditory receptors", "propioreceptors", "proprioceptors", "no change in response", "nociceptors", "nociceptor", "pain receptors", "muscle spindles", "golgi tendon organs", "chemoreceptors"],
        ad_mod: ["moderately adapting", "thermal receptors", "variable rate of adaptation"],
        ch_mod: ["labeled line", "labelled line", "labeled line law", "labeled line principle", "specific nerve energies", "stimulus modality", "type of the stimulated receptor", "type of the involved touch receptor"],
        ch_loc: ["location of the receptors", "localize the site of stimuli", "cortical projection", "point to point"],
        ch_proj: ["law of projection"],
        ch_int: ["magnitude of the stimulus", "stimulus intensity", "intensity of the stimulus", "increased stimulus intensity", "frequency coding", "frequency coding principle", "recruitment", "central effects of sensory impulses"],
        ch_law: ["log frequency law", "weber fechner", "power law", "logarithm"],
        ch_phan: ["phantom limb", "phantom limb pain", "neighboring sensory areas"],
        cl_mech: ["mechanoreceptor", "mechanoreceptors"],
        cl_therm: ["thermoreceptor", "thermoreceptors"],
        cl_chem: ["chemoreceptor", "chemoreceptors"],
        cl_em: ["electromagnetic receptors", "photoreceptors"],
      },
      drill: ["rp_na", "rp_grad", "rp_norp", "rp_elec", "rp_node", "ad_fast", "ad_slow", "ad_mod", "ch_mod", "ch_proj", "ch_int", "ch_law"],
      sims: [
        { id: "rp", label: "Receptor potential", on: ["rp_pac", "rp_na", "rp_elec", "rp_node", "rp_st", "rp_graph", "rp_ap", "rp_grad", "rp_local", "rp_norp", "rp_sum", "rp_dur"], info: "**Na⁺ influx** → a **graded, local** depolarization (no refractory period, summates, longer than an AP) → spreads electrotonically → **impulses at the first node**, faster with a bigger potential." },
        { id: "adapt", label: "Phasic vs tonic", on: ["ad_ph", "ad_to", "ad_fast", "ad_slow", "ad_mod", "ad_why"], info: "**Rapid**: Pacinian, Meissner, hair (touch). **Slow**: spindle, GTO, joint, **nociceptors**, **baroreceptors**, **lung stretch**. **Moderate**: thermal." },
        { id: "code", label: "The code", on: ["ch_mod", "ch_loc", "ch_proj", "ch_int", "ch_law", "ch_phan"], info: "Modality = **labeled line**; location = point-to-point connection; **law of projection**; intensity = frequency + recruitment, on a log scale." },
      ],
      secs: { "ph-sensory-receptors#0": "rp", "ph-sensory-receptors#1": "rp", "ph-sensory-receptors#2": "adapt", "ph-sensory-code#0": "code" },
      rules: [
        [/receptor potential|generator potential/i, "rp"],
        [/tonic|phasic|adapting|adaptation/i, "adapt"],
        [/modality|law of projection|labell?ed line|phantom/i, "code"],
      ],
    });
  })();

  /* ═══════════════ 2. TOUCH, S1, PROPRIOCEPTION, TEMPERATURE ═══════════════ */
  (function () {
    // S1 strip from medial to lateral: width ∝ cortical area
    const strip = [
      ["h_leg", "leg", 16],
      ["h_trunk", "trunk", 14],
      ["h_neck", "neck", 10],
      ["h_arm", "arm", 16],
      ["h_hand", "HAND", 40],
      ["h_eye", "eye", 12],
      ["h_face", "FACE", 30],
      ["h_lips", "LIPS", 44],
      ["h_tongue", "tongue", 24],
    ];
    let sx = 268,
      s1 = "";
    strip.forEach(([id, lab, w], i) => {
      s1 += '<rect class="pf" data-p="' + id + '" x="' + sx + '" y="60" width="' + w + '" height="26" rx="3" style="--c:' + B + ";--r:" + (w >= 30 ? "#2a5a7a" : "#1d3a55") + '"/>';
      s1 += T(sx + w / 2, i % 2 ? 98 : 54, lab, "sm");
      sx += w + 2;
    });
    const tc = (t) => 276 + t * 4.6; // temperature → x
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">TOUCH, THE S1 MAP, PROPRIOCEPTION AND TEMPERATURE</text>' +
      // two-point
      box(4, 22, 252, 162) + T(130, 36, "TWO-POINT DISCRIMINATION", "sm mut") +
      '<path class="pf" data-p="tp_fing" d="M16 110 C16 70 30 50 46 50 C62 50 70 70 70 110 Z" style="--c:' + G + ';--r:#24384f"/>' +
      '<circle cx="36" cy="70" r="5" fill="none" stroke="#5ef0a0" pointer-events="none"/><circle cx="48" cy="72" r="5" fill="none" stroke="#5ef0a0" pointer-events="none"/><circle cx="42" cy="84" r="5" fill="none" stroke="#5ef0a0" pointer-events="none"/><circle cx="30" cy="86" r="5" fill="none" stroke="#5ef0a0" pointer-events="none"/><circle cx="54" cy="88" r="5" fill="none" stroke="#5ef0a0" pointer-events="none"/>' +
      T(43, 124, "fingertip: 2 mm", "sm") + T(43, 134, "small fields", "sm mut") +
      '<path class="pf" data-p="tp_back" d="M96 50 L236 50 L236 110 L96 110 Z" style="--c:' + O + ';--r:#3a2a20"/>' +
      '<circle cx="136" cy="80" r="26" fill="none" stroke="#ff9f43" pointer-events="none"/><circle cx="196" cy="80" r="26" fill="none" stroke="#ff9f43" pointer-events="none"/>' +
      T(166, 124, "back: ~65 mm", "sm") + T(166, 134, "large fields", "sm mut") +
      cell("tp_inv", 8, 142, 120, 36, ["BETTER = SMALLER", "distance = SMALLER", "receptive fields"], G, GR) +
      cell("tp_dist", 132, 142, 120, 36, ["DISTAL (fingertips,", "lips) > proximal;", "DORSAL COLUMN"], G, GR) +
      // S1 map
      box(262, 22, 254, 162) + T(389, 36, "S1 (POSTCENTRAL GYRUS), MEDIAL → LATERAL", "sm mut") +
      s1 +
      cell("h_rule", 268, 108, 242, 26, ["area ∝ receptor DENSITY, not the size", "of the body part or of its muscles"], Y, YR) +
      cell("h_contra", 268, 138, 242, 26, ["the CONTRALATERAL body, upside down:", "leg medial, face near the lateral sulcus"], Y, YR) +
      T(389, 178, "LIPS, face and hand have the largest areas", "sm mut") +
      // S1 lesion + touch kinds + cord/thalamic lesions
      box(4, 190, 512, 108) +
      cell("s1l", 8, 196, 250, 46, ["S1 LESION (opposite side): cannot LOCALIZE touch,", "two-point lost, cannot judge WEIGHT or TEXTURE,", "ASTEREOGNOSIS · NO paralysis · crude pain and", "temperature survive (felt at the thalamus)"], P, PR) +
      cell("ast", 262, 196, 250, 46, ["ASTEREOGNOSIS: cannot recognise an object", "by touch · S1 + association areas (5, 7)", "RIGHT S1 destroyed → objects in the LEFT hand", "not identified"], P, PR) +
      cell("ft", 8, 246, 250, 22, ["FINE touch: Meissner + Merkel → dorsal column:", "TEXTURE, two-point · no emotional affect"], G, GR) +
      cell("ct", 262, 246, 250, 22, ["CRUDE touch: free endings → anterior spinothalamic:", "COTTON WOOL test, poorly localized, affect"], O, OR) +
      cell("syr", 8, 272, 124, 22, ["SYRINGOMYELIA:", "JACKET pain+temp loss"], O, OR) +
      cell("thal", 136, 272, 124, 22, ["THALAMIC syndrome:", "THALAMIC PAIN, opposite"], O, OR) +
      cell("tabes", 264, 272, 122, 22, ["TABES: dorsal columns,", "Romberg +"], O, OR) +
      cell("bsq", 390, 272, 122, 22, ["BROWN-SÉQUARD: same-", "side motor + vibration"], O, OR) +
      // proprioception and vibration
      box(4, 304, 252, 144) + T(130, 318, "PROPRIOCEPTION AND VIBRATION", "sm mut") +
      cell("pr_what", 8, 324, 244, 26, ["POSITION sense + MOVEMENT sense (rate of", "movement) + equilibrium · NOT vibration"], G, GR) +
      cell("pr_rec", 8, 354, 244, 16, ["spindles, tendon organs, JOINT receptors (+ vestibular)"], G, GR) +
      cell("pr_fib", 8, 374, 80, 26, ["Aα / Aβ,", "never Aδ"], G, GR) +
      cell("pr_path", 92, 374, 160, 26, ["conscious: dorsal column", "unconscious: SPINOCEREBELLAR"], G, GR) +
      cell("vib", 8, 412, 244, 30, ["VIBRATION: Pacinian (30–800 Hz) + Meissner,", "dorsal column, tuning fork · not proprioception"], B, BR) +
      // thermal
      box(262, 304, 254, 144) + T(389, 318, "TEMPERATURE: DISCHARGE vs °C", "sm mut") +
      '<path d="M272 396 L512 396" stroke="#6f8aa8" pointer-events="none"/>' +
      [0, 10, 20, 30, 40, 50].map((t) => T(tc(t), 406, t + "°", "sm mut")).join("") +
      ps("th_cp", "M" + tc(0) + " 356 C" + tc(6) + " 370 " + tc(10) + " 388 " + tc(15) + " 396", "#ff5d7a", "#6a3040", 2) +
      ps("th_cold", "M" + tc(8) + " 396 C" + tc(18) + " 340 " + tc(24) + " 336 " + tc(25) + " 338 C" + tc(30) + " 346 " + tc(36) + " 382 " + tc(42) + " 396", B, "#3a6a8a", 2.2) +
      ps("th_warm", "M" + tc(30) + " 396 C" + tc(38) + " 370 " + tc(41) + " 354 " + tc(43) + " 356 C" + tc(45) + " 362 " + tc(46) + " 386 " + tc(48) + " 396", O, "#6a4a2a", 2.2) +
      ps("th_hp", "M" + tc(45) + " 396 C" + tc(47) + " 380 " + tc(49) + " 360 " + tc(51) + " 346", "#ff5d7a", "#6a3040", 2) +
      T(tc(25) + 6, 334, "cold: peak 25°", "sm", "start") + T(tc(43) - 4, 350, "warm", "sm") + T(tc(2), 350, "cold-pain", "sm", "start") +
      cell("th_zero", 268, 412, 78, 30, ["0 °C: NO", "sensation"], B, BR) +
      cell("th_fib", 350, 412, 78, 30, ["cold = Aδ,", "warm = C"], B, BR) +
      cell("th_meta", 432, 412, 80, 30, ["→ regulates", "METABOLISM"], B, BR);
    A.scene("touch", {
      title: "Touch, the S1 map and its lesions, proprioception, vibration and temperature",
      vb: "0 0 520 452",
      svg,
      intro: "Top: **two-point discrimination** and the **S1 map** (width = cortical area). Middle: S1 and cord lesions. Bottom: **proprioception, vibration** and the **thermal** discharge curves.",
      parts: {
        tp_fing: ["Fingertip", "Many receptors with **small receptive fields**: two points 2 mm apart are felt as two."],
        tp_back: ["Back", "Few receptors with **large receptive fields**: two points must be far apart."],
        tp_inv: ["Two-point discrimination", "A more developed discrimination = a **smaller** threshold distance: it is **inversely related to the size of the receptive fields**, and does not depend on the receptor type."],
        tp_dist: ["Distal better than proximal", "Best at the **fingertips and lips** (distal > proximal regions); carried in the **dorsal column**."],
        h_leg: ["Leg area", "On the **medial** surface (paracentral lobule): small."],
        h_trunk: ["Trunk area", "Small: few receptors."],
        h_neck: ["Neck area", "Small."],
        h_arm: ["Arm area", "Small compared with the hand."],
        h_hand: ["Hand area", "Large: dense receptors in the fingers."],
        h_eye: ["Eye area", "Small."],
        h_face: ["Face area", "Large, near the lateral sulcus."],
        h_lips: ["Lips area", "The **largest** representation in the somatosensory area."],
        h_tongue: ["Tongue area", "Large, most lateral."],
        h_rule: ["What decides the size of an area", "The **number (density) of specialized peripheral receptors**, not the physical size of the body part, its muscle size or fibre conduction velocity."],
        h_contra: ["Contralateral, upside down", "S1 (areas 3, 1, 2) maps the **contralateral** body upside down."],
        s1l: ["S1 (postcentral) lesion", "Contralateral loss of **discriminative** sensation: cannot **localize** touch, two-point discrimination lost, cannot judge **weight** or **texture**, **astereognosis**. **No paralysis** (movement is area 4). Crude pain and temperature largely survive."],
        ast: ["Astereognosis", "Inability to recognise an object by touch: lesion of **S1 and the association areas**. **Right** S1 destroyed → cannot identify objects in the **left** hand. It is not a loss of crude touch or of localization."],
        ft: ["Fine (discriminative) touch", "Meissner's corpuscles and Merkel discs → **dorsal column**: feel the **texture** of objects, two-point discrimination. No emotional affect."],
        ct: ["Crude touch", "Free endings → **anterior spinothalamic** tract: tested with a **piece of cotton**; poorly localized; has emotional affect (tickle, itch)."],
        syr: ["Syringomyelia", "A cavity around the central canal cuts the **crossing** spinothalamic fibres → **bilateral jacket (cape)** loss of pain and temperature with **touch preserved** (dissociated loss)."],
        thal: ["Thalamic syndrome", "Posterior cerebral artery branch: **contralateral** hemi-sensory loss, severe spontaneous **thalamic pain**, **hemiataxia**, sometimes choreoathetosis. Jacket loss is syringomyelia, not thalamic."],
        tabes: ["Tabes dorsalis", "Neurosyphilis of the dorsal roots and dorsal columns: loss of position and vibration sense → **sensory ataxia**, stamping gait, **Romberg positive**; crude touch preserved."],
        bsq: ["Brown-Séquard (hemisection)", "**Same side** below: loss of **motor function and vibration/position** sense. **Opposite side** below: loss of **pain, temperature and crude touch**. At the level: LMN signs."],
        pr_what: ["Proprioceptive sensations", "**Static position sense** and **movement sense** (kinaesthesia, including the **rate of movement**), and in this course the **equilibrium** sense. **Vibration is not** proprioceptive."],
        pr_rec: ["Proprioceptors", "Muscle spindles, Golgi tendon organs, **joint receptors** (and the vestibular apparatus for equilibrium)."],
        pr_fib: ["Proprioceptive fibres", "Large, fast **Aα and Aβ** fibres. **Aδ** fibres carry fast pain and cold, never proprioception."],
        pr_path: ["Proprioceptive pathways", "Conscious: **gracile and cuneate** (dorsal column). Unconscious: **spinocerebellar** tracts. **Never spinothalamic**."],
        vib: ["Vibration sense", "Pacinian (and Meissner) corpuscles detect rapid repetitive stimuli (**30–800 Hz**); carried in the **dorsal column**, not the spinothalamic tract or free endings."],
        th_cold: ["Cold fibres", "Free endings with **Aδ** fibres: fire **maximally at about 25 °C**."],
        th_warm: ["Warm fibres", "Free endings with **C** fibres: about 30–45 °C, peak about 40–43 °C."],
        th_cp: ["Cold-pain fibres", "Below about 10–15 °C."],
        th_hp: ["Heat-pain fibres", "Above about 45 °C."],
        th_zero: ["At 0 °C", "The bank's answer is **no sensation at all**: freezing stops the receptors firing (the numbness of ice). Thermal receptors are **not** stimulated at 0 °C."],
        th_fib: ["Thermal fibres", "Cold = **Aδ**, warm = **C**; not Aβ. Thermal receptors are **moderately adapting** and respond to **changes within a range**, not to every temperature change."],
        th_meta: ["Thermal sensation and metabolism", "Thermal sensation is **involved in the regulation of metabolic activity** (body temperature control). Diabetic small-fibre neuropathy raises the thresholds for temperature and pain."],
      },
      al: {
        tp_inv: ["two point", "two point discrimination", "two point tactile discrimination", "receptive fields", "receptive field", "size of the receptive fields"],
        tp_dist: ["proximal regions", "distal regions", "fingertips"],
        h_leg: ["~lower limb", "~leg"],
        h_trunk: ["~abdomen", "~trunk"],
        h_neck: ["~neck"],
        h_arm: ["~upper limb", "~arm"],
        h_hand: ["~hand"],
        h_eye: ["~eye"],
        h_face: ["~face"],
        h_lips: ["~lips"],
        h_tongue: ["~tongue"],
        h_rule: ["density of receptors", "number of the specialized peripheral receptors", "specialized peripheral receptors", "relative size of body parts", "size of the muscles", "size of muscles in body parts", "largest representation", "area of body representation"],
        h_contra: ["contralateral body surface", "somatotopic"],
        s1l: ["post central gyrus", "postcentral gyrus", "somatic sensory area i", "somatosensory area i", "judge the weight", "weight of objects", "texture of common objects", "localize the site of touch", "somato sensory deficit", "primary somatosensory cortex"],
        ast: ["astereognosis", "identify objects", "inability to identify objects"],
        ft: ["fine touch", "texture", "texture of touched objects", "feeling the texture"],
        ct: ["crude touch", "piece of cotton", "cotton", "emotional affect", "crude touch sensation"],
        syr: ["syringomyelia", "jacket", "jacket sensory loss"],
        thal: ["thalamic syndrome", "thalamic pain", "hemiataxia"],
        tabes: ["tabes dorsalis", "tabes"],
        bsq: ["brown sequard", "hemisection", "right half of the spinal cord", "total lack of pain sensation on the same side", "lack of temperature sensation"],
        pr_what: ["proprioceptive sensations", "proprioception", "position sense", "movement sense", "equilibrium sense", "rate of movement", "kinesthesia", "kinaesthesia"],
        pr_rec: ["joint receptors", "vestibular receptors", "pressure receptors"],
        pr_fib: ["afferents of adelta", "abeta fibers", "type abeta"],
        pr_path: ["spinocerebellar tract", "spinocerebellar pathway", "unconscious proprioception"],
        vib: ["vibration sense", "vibration", "tuning fork"],
        th_cold: ["cold receptors", "cold fibers", "cold nerve fibers", "25 c", "250c"],
        th_warm: ["warm sensation", "warm receptors", "warm fibers"],
        th_cp: ["cold pain"],
        th_hp: ["heat pain"],
        th_zero: ["zero c", "0 c", "zero0 c", "stimulated at zero"],
        th_fib: ["thermal sensations", "thermal sensation", "changes in environmental temperatures", "environmental temperatures"],
        th_meta: ["metabolic activity", "regulation of metabolic activity", "peripheral neuropathy", "small fibre neuropathy"],
      },
      drill: ["tp_inv", "tp_dist", "h_lips", "h_rule", "s1l", "ast", "ft", "ct", "syr", "thal", "bsq", "pr_what", "pr_path", "vib", "th_cold", "th_zero"],
      sims: [
        { id: "two", label: "Two-point", on: ["tp_fing", "tp_back", "tp_inv", "tp_dist", "ft"], info: "Better two-point discrimination = **smaller** receptive fields, best **distally**, carried in the dorsal column." },
        { id: "map", label: "S1 map and lesion", on: ["h_hand", "h_face", "h_lips", "h_tongue", "h_rule", "h_contra", "s1l", "ast"], info: "Area ∝ **receptor density**: lips, face and hand biggest. S1 lesion: opposite side, astereognosis, no paralysis." },
        { id: "lesions", label: "Cord and thalamic lesions", on: ["syr", "thal", "tabes", "bsq"], info: "**Syringomyelia**: jacket pain + temperature loss. **Thalamic**: contralateral loss + thalamic pain. **Tabes**: sensory ataxia. **Brown-Séquard**: same-side motor + vibration, opposite pain + temperature." },
        { id: "prop", label: "Proprioception", on: ["pr_what", "pr_rec", "pr_fib", "pr_path", "vib"], info: "**Position + movement** sense (not vibration), from spindles, tendon organs and joints, by **Aα/Aβ** fibres; conscious in the dorsal column, unconscious in the **spinocerebellar** tracts." },
        { id: "temp", label: "Temperature", on: ["th_cold", "th_warm", "th_cp", "th_hp", "th_zero", "th_fib", "th_meta"], info: "Cold fibres (**Aδ**) peak at **25 °C**; warm (**C**) at 40–43 °C; pain below ~15 and above ~45 °C; **no sensation at 0 °C**." },
      ],
      secs: { "ph-sensory-code#1": "two", "ph-sensory-code#2": "prop", "ph-sensory-code#3": "temp", "ph-sensory-pathways#3": "map" },
      rules: [
        [/two.point/i, "two"],
        [/somatosensory area|somatic sensory area|post.?central|astereognosis|representation/i, "map"],
        [/propriocept|vibration/i, "prop"],
        [/thermal|cold|warm|°C|zero/i, "temp"],
        [/syringomyelia|thalamic syndrome|jacket|brown.s[eé]quard|hemisection/i, "lesions"],
      ],
    });
  })();
})();
