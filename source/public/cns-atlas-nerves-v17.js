/* INTELLECTUALITY v17.3 · Anatomy close-ups: the white-matter fibre systems (association, commissural, projection)
 * and the trigeminal nerve's maxillary and mandibular divisions with the pterygopalatine, otic and submandibular
 * ganglia, the petrosal nerves and the soft-palate muscles. Drawn from the notes' wording (an-white-matter#0,
 * an-trigeminal, an-oral-cavity).
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

  /* ═══════════════ 1. WHITE-MATTER FIBRES ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">WHITE MATTER · ASSOCIATION, COMMISSURAL, PROJECTION</text>' +
      // medial view
      box(4, 22, 252, 236) + T(130, 36, "MEDIAL VIEW: COMMISSURES (+ cingulum)", "sm mut") +
      '<path d="M24 150 C20 80 80 44 140 46 C200 48 246 86 244 140 C242 180 222 200 192 204 C172 230 122 232 102 214 C72 214 28 200 24 150 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' +
      ps("cing", "M68 100 C88 74 172 70 210 100 C224 114 222 142 208 164", G, "#2f6a4c", 2) +
      ps("cc_ro", "M86 152 C72 152 62 144 62 134", P, "#5a4a8a", 11) +
      ps("cc_ge", "M62 134 C62 114 74 104 94 102", P, "#6a5a9a", 11) +
      ps("cc_bo", "M94 102 C130 96 160 96 186 106", P, "#5a4a8a", 11) +
      ps("cc_sp", "M186 106 C204 112 210 130 196 140", P, "#6a5a9a", 11) +
      ps("forn", "M190 146 C162 156 124 150 108 162 C102 170 104 180 110 188", Y, "#6a5a30", 2.2) +
      dot("ac", 100, 176, 5, O, "#6a4020") + dot("pc", 176, 170, 4, B, "#2a5a7a") + dot("hc", 186, 158, 4, B, "#2a5a7a") +
      T(40, 162, "rostrum", "sm", "middle") + T(46, 116, "genu", "sm", "end") + T(140, 90, "body", "sm") + T(222, 128, "splenium", "sm", "start") +
      T(140, 66, "cingulum (association)", "sm") + T(150, 176, "fornix", "sm") +
      T(98, 196, "anterior commissure", "sm") + T(196, 184, "posterior comm.", "sm") + T(208, 158, "habenular", "sm", "start") +
      cell("fmin", 10, 212, 118, 40, ["FORCEPS MINOR: genu", "fibres join the", "frontal lobes"], P, PR) +
      cell("fmaj", 132, 212, 118, 40, ["FORCEPS MAJOR: splenium", "fibres join the", "occipital lobes"], P, PR) +
      // lateral view
      box(262, 22, 254, 236) + T(389, 36, "LATERAL VIEW: ASSOCIATION BUNDLES", "sm mut") +
      '<path d="M282 150 C278 80 340 44 400 46 C460 48 506 88 504 142 C502 184 470 210 430 206 C420 232 360 236 340 214 C300 212 286 196 282 150 Z" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' +
      '<path d="M330 164 C360 154 400 150 432 154" stroke="#6f8aa8" fill="none" pointer-events="none"/>' +
      ps("slf", "M300 112 C340 80 440 78 488 122", G, "#2f6a4c", 3) +
      ps("arcf", "M318 154 C338 122 432 112 454 150 C460 170 446 186 422 186", Y, "#6a5a30", 2.6) +
      ps("ilf", "M352 200 C400 194 450 184 494 150", B, "#2a5a7a", 3) +
      ps("unc", "M310 132 C298 156 314 176 334 180 C348 184 356 192 350 204", O, "#6a4020", 3) +
      ps("ufib", "M306 84 q9 -12 18 0 M346 62 q9 -12 18 0 M458 70 q9 -12 18 0", "#d9ff43", "#5a6a30", 1.8) +
      T(400, 74, "superior longitudinal", "sm") + T(386, 132, "arcuate: Broca ↔ Wernicke", "sm") +
      T(438, 204, "inferior longitudinal", "sm") + T(292, 214, "uncinate", "sm", "start") + T(330, 58, "U fibres", "sm", "end") +
      T(314, 150, "B", "sm") + T(422, 196, "W", "sm") +
      cell("int", 268, 222, 242, 30, ["uncinate: frontal ↔ anterior TEMPORAL", "inferior longitudinal: occipital ↔ temporal"], G, GR) +
      // the three kinds
      '<text class="ttl" x="260" y="276" text-anchor="middle">THE THREE KINDS</text>' +
      cell("assoc", 4, 284, 168, 46, ["ASSOCIATION", "DIFFERENT areas of the", "SAME hemisphere: longitudinal,", "uncinate, cingulum, arcuate"], G, GR) +
      cell("comm", 176, 284, 168, 46, ["COMMISSURAL", "the SAME areas of the", "TWO hemispheres: corpus", "callosum (largest) + commissures"], P, PR) +
      cell("proj", 348, 284, 168, 46, ["PROJECTION", "cortex ↔ LOWER centres:", "corticospinal, CORTICOBULBAR,", "corticopontine, thalamocortical"], B, BR) +
      cell("route", 4, 334, 256, 30, ["projection fibres run in the INTERNAL capsule and", "corona radiata · NOT in the external capsule"], B, BR) +
      cell("acf", 264, 334, 124, 30, ["ANTERIOR comm.:", "olfactory + temporal"], O, OR) +
      cell("tap", 392, 334, 124, 30, ["TAPETUM: roof, lateral", "wall of post./inf. horn"], P, PR) +
      cell("pcf", 4, 368, 256, 16, ["posterior commissure: pupillary light reflex"], B, BR) +
      cell("hcf", 264, 368, 252, 16, ["fornix = the hippocampal commissure"], Y, YR);
    A.scene("wmfib", {
      title: "White matter · association, commissural and projection fibres",
      vb: "0 0 520 390",
      svg,
      intro: "Left: the medial surface with the **corpus callosum** and the other **commissures**. Right: the **association** bundles seen from the side. Bottom: the three kinds and what each joins.",
      parts: {
        cc_ro: ["Rostrum of the corpus callosum", "The thin front-lower part, running back from the genu."],
        cc_ge: ["Genu of the corpus callosum", "The front bend; its fibres curve forwards as the **forceps minor** (frontal lobes)."],
        cc_bo: ["Body of the corpus callosum", "The long middle part: the corpus callosum is the **largest commissure** (commissural, not association)."],
        cc_sp: ["Splenium of the corpus callosum", "The thick back end; its fibres curve backwards as the **forceps major** (occipital lobes)."],
        cing: ["Cingulum", "An **association** bundle **inside the cingulate gyrus** (not a commissure)."],
        forn: ["Fornix (hippocampal commissure)", "Its crossing fibres form the hippocampal commissure."],
        ac: ["Anterior commissure", "Joins the **olfactory** areas (bulbs and tracts) and the **temporal** lobes of the two sides."],
        pc: ["Posterior commissure", "Crosses fibres for the **pupillary light reflex**."],
        hc: ["Habenular commissure", "A small commissure above the pineal."],
        fmin: ["Forceps minor", "Genu fibres joining the **frontal** lobes."],
        fmaj: ["Forceps major", "Splenium fibres joining the **occipital** lobes."],
        slf: ["Superior longitudinal bundle (fasciculus)", "The largest association bundle: **frontal ↔ parietal, occipital and temporal** lobes of the same hemisphere."],
        arcf: ["Arcuate fasciculus", "The part of the superior longitudinal bundle that curves round the lateral sulcus: joins **Broca's** (motor speech) to **Wernicke's** area."],
        ilf: ["Inferior longitudinal bundle", "**Occipital ↔ temporal** lobes."],
        unc: ["Uncinate fasciculus", "Hooks round the lateral sulcus: **frontal ↔ anterior temporal** lobe."],
        ufib: ["Short arcuate (U) fibres", "Short association fibres between **neighbouring gyri**."],
        int: ["Which lobes the long bundles join", "Uncinate: frontal ↔ anterior temporal. Inferior longitudinal: occipital ↔ temporal. Superior longitudinal: frontal ↔ the parietal, occipital and temporal lobes."],
        assoc: ["Association fibres", "Connect **different areas of the same hemisphere**: short arcuate (U) fibres and the long bundles (superior and inferior longitudinal, uncinate, cingulum)."],
        comm: ["Commissural fibres", "Connect **the same (corresponding) areas of the two hemispheres**: corpus callosum, anterior, posterior, hippocampal and habenular commissures."],
        proj: ["Projection fibres", "Connect the cortex with **lower centres** in both directions: corticospinal, **corticobulbar**, corticopontine, corticothalamic and **thalamocortical** (thalamus ↔ **cerebral** cortex)."],
        route: ["Route of projection fibres", "Through the **corona radiata** and the **internal capsule**; not through the external capsule."],
        acf: ["What the anterior commissure joins", "Olfactory areas and the temporal lobes."],
        tap: ["Tapetum", "Callosal fibres forming the roof and lateral wall of the **posterior and inferior horns** of the lateral ventricle."],
        pcf: ["Posterior commissure", "Pupillary light reflex fibres cross here."],
        hcf: ["Hippocampal commissure", "Formed by the fornix."],
      },
      al: {
        cc_ro: ["rostrum"],
        cc_ge: ["genu of corpus callosum", "genu of the corpus callosum"],
        cc_bo: ["corpus callosum", "body of corpus callosum"],
        cc_sp: ["splenium"],
        cing: ["cingulum"],
        forn: ["fornix", "hippocampal commissure"],
        ac: ["anterior commissure", "olfactory bulbs and tracts"],
        pc: ["posterior commissure"],
        hc: ["habenular commissure"],
        fmin: ["forceps minor"],
        fmaj: ["forceps major"],
        slf: ["superior longitudinal bundle", "superior longitudinal fasciculus", "superior longitudinal fibers", "superior longitudinal"],
        arcf: ["arcuate fasciculus", "arcuate", "broca to wernicke"],
        ilf: ["inferior longitudinal bundle", "inferior longitudinal fasciculus", "inferior longitudinal"],
        unc: ["uncinate fasciculus", "uncinate", "uncinate fasiculus"],
        ufib: ["u fibers", "short association", "adjacent gyri", "neighbouring gyri"],
        assoc: ["association fibers", "association fiber", "different areas in the same hemisphere", "different areas of the same hemisphere"],
        comm: ["commissural fibers", "commissural", "same areas in the different hemisphere", "two hemispheres", "corresponding areas"],
        proj: ["projection fibers", "projection fiber", "corticobulbar", "thalamocortical", "corticopontine", "lower centers"],
        route: ["corona radiata", "external capsule"],
        tap: ["tapetum"],
      },
      drill: ["cc_ge", "cc_sp", "cing", "ac", "slf", "arcf", "ilf", "unc", "assoc", "comm", "proj", "fmin", "fmaj", "tap"],
      sims: [
        { id: "assoc", label: "Association", on: ["slf", "arcf", "ilf", "unc", "ufib", "cing", "assoc", "int"], info: "**Same hemisphere, different areas**: superior longitudinal (with the arcuate), inferior longitudinal, **uncinate**, **cingulum**, U fibres." },
        { id: "comm", label: "Commissural", on: ["cc_ro", "cc_ge", "cc_bo", "cc_sp", "ac", "pc", "hc", "forn", "comm", "fmin", "fmaj", "tap", "acf"], info: "**Two hemispheres, same areas**: corpus callosum (rostrum, genu, body, splenium), anterior, posterior, habenular and hippocampal commissures." },
        { id: "proj", label: "Projection", on: ["proj", "route"], info: "**Cortex ↔ lower centres**: corticospinal, corticobulbar, corticopontine, thalamocortical; through the **internal capsule**." },
      ],
      secs: { "an-white-matter#0": "" },
      rules: [
        [/association fib|uncinate|cingulum|longitudinal bundle|longitudinal fasc/i, "assoc"],
        [/commissur|corpus callosum|splenium|forceps/i, "comm"],
        [/projection fib/i, "proj"],
      ],
    });
  })();

  /* ═══════════════ 2. MAXILLARY AND MANDIBULAR NERVES, THE GANGLIA ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="270" y="14" text-anchor="middle">TRIGEMINAL NERVE · V1, V2, V3, THEIR GANGLIA AND WHAT THEY SUPPLY</text>' +
      // trigeminal ganglion and three divisions, over the top of the three columns
      '<ellipse class="pf" data-p="tg" cx="40" cy="62" rx="16" ry="26" style="--c:' + Y + ';--r:#6a5a30"/>' + T(40, 100, "trigeminal", "sm") + T(40, 110, "ganglion", "sm") +
      ps("v1", "M56 56 C90 48 130 40 146 52", B, "#2a5a7a", 2.6) +
      ps("v2", "M54 50 C120 24 250 22 286 52", G, "#2f6a4c", 2.6) +
      ps("v3", "M52 42 C140 16 400 14 454 52", O, "#6a4020", 3.2) +
      '<g transform="translate(0,24)">' +
      // V1 column
      cell("v1h", 92, 28, 108, 26, ["V1 OPHTHALMIC", "(sensory)"], B, BR) +
      cell("sof", 92, 58, 108, 16, ["sup. orbital fissure"], B, BR) +
      cell("v1br", 92, 78, 108, 26, ["frontal, lacrimal,", "nasociliary"], B, BR) +
      cell("v1sup", 92, 108, 108, 26, ["UPPER eyelid,", "forehead, cornea"], B, BR) +
      // not-V3 and palate facts under V1
      cell("notv3", 92, 184, 108, 66, ["NOT V3 muscles:", "buccinator, posterior", "digastric, stylohyoid", "(VII); geniohyoid,", "thyrohyoid (C1)"], R, RR) +
      cell("palate", 92, 254, 108, 76, ["SOFT PALATE: all", "VAGUS (pharyngeal", "plexus) EXCEPT", "TENSOR PALATI (V3):", "levator, palatoglossus,", "palatopharyngeus, uvulae"], P, PR) +
      cell("spal", 92, 334, 108, 36, ["soft palate feels by", "lesser palatine (V2)", "+ IX"], P, PR) +
      cell("tongue", 92, 374, 108, 36, ["tongue muscles: XII", "except palatoglossus", "(vagus)"], P, PR) +
      // V2 column
      cell("v2h", 206, 28, 160, 26, ["V2 MAXILLARY", "WHOLLY sensory"], G, GR) +
      cell("cav2", 206, 58, 160, 16, ["lateral wall of the cavernous sinus"], G, GR) +
      cell("fr", 206, 78, 160, 16, ["foramen ROTUNDUM"], G, GR) +
      cell("ppf", 206, 98, 160, 16, ["→ PTERYGOPALATINE fossa"], G, GR) +
      cell("v2men", 206, 118, 160, 16, ["meningeal: middle cranial fossa"], G, GR) +
      cell("zyg", 206, 138, 160, 16, ["zygomatic (lacrimal fibres ride)"], G, GR) +
      cell("psa", 206, 158, 160, 16, ["post. sup. alveolar: upper molars"], G, GR) +
      cell("ion2", 206, 178, 160, 36, ["INFRAORBITAL: lower eyelid, cheek,", "side of nose, UPPER LIP,", "upper teeth (middle, anterior)"], G, GR) +
      // pterygopalatine ganglion
      '<path d="M268 218 L280 254 M296 218 L288 254" stroke="#5ef0a0" stroke-width="1.6" pointer-events="none"/>' + T(310, 234, "ganglionic roots", "sm mut", "start") +
      dot("ppg", 284, 270, 16, Y, "#6a5a30") + T(284, 273, "PPG", "sm") +
      ps("gpn2", "M208 244 C236 250 252 262 268 266", R, "#6a3040", 2) + T(208, 238, "greater petrosal", "sm", "start") +
      ps("dpn", "M208 300 C236 294 252 282 268 276", B, "#2a5a7a", 2) + T(208, 314, "deep petrosal", "sm", "start") +
      cell("vid", 318, 256, 48, 30, ["= vidian", "nerve"], Y, YR) +
      '<path d="M270 284 L240 330 M284 286 L284 330 M296 284 L330 330" stroke="#ffd166" stroke-width="1.4" pointer-events="none"/>' +
      cell("gpal", 206, 334, 76, 26, ["GREATER", "palatine: HARD"], Y, YR) +
      cell("lpal", 286, 334, 80, 26, ["LESSER palatine:", "SOFT palate"], Y, YR) +
      cell("nasph", 206, 364, 160, 16, ["nasal, pharyngeal, orbital branches"], Y, YR) +
      cell("lac", 206, 384, 160, 26, ["→ zygomatic → LACRIMAL GLAND", "ganglion damage = DRY EYE"], Y, YR) +
      cell("pgpn", 206, 414, 160, 26, ["greater petrosal (VII) = PARASYMP.", "deep petrosal (ICA) = SYMPATHETIC"], R, RR) +
      // V3 column
      cell("v3h", 372, 28, 164, 26, ["V3 MANDIBULAR · MIXED", "the only MOTOR division"], O, OR) +
      cell("fo", 372, 58, 164, 16, ["foramen OVALE → infratemporal fossa"], O, OR) +
      cell("nsp", 372, 78, 164, 16, ["trunk: nervus spinosus (f. spinosum)"], O, OR) +
      cell("nmp", 372, 98, 164, 26, ["trunk: n. to MEDIAL PTERYGOID →", "+ TENSOR PALATI, tensor tympani"], O, OR) +
      cell("ant3", 372, 128, 164, 26, ["ANTERIOR: masseteric, deep", "temporal, lateral pterygoid"], O, OR) +
      cell("buc", 372, 158, 164, 16, ["BUCCAL: its only sensory (cheek)"], O, OR) +
      T(454, 188, "POSTERIOR division (mainly sensory)", "sm mut") +
      cell("atn", 372, 194, 164, 16, ["AURICULOTEMPORAL → parotid, temple"], O, OR) +
      dot("otic", 400, 232, 12, P, "#3a3060") + T(400, 235, "otic", "sm") +
      ps("lpn", "M536 222 C480 222 440 226 412 230", P, "#5a4a8a", 2) + T(476, 246, "lesser petrosal (IX) → otic", "sm") +
      cell("lin", 372, 252, 164, 26, ["LINGUAL: general sense ANTERIOR", "2/3 of tongue (tip), floor of mouth"], O, OR) +
      ps("ct3", "M536 296 C500 296 460 300 432 302", R, "#6a3040", 1.8) + T(536, 290, "chorda tympani (VII)", "sm", "end") +
      dot("smg", 420, 304, 10, P, "#3a3060") + T(404, 307, "SMG", "sm", "end") +
      T(436, 318, "submandibular ganglion hangs from it", "sm mut", "start") +
      cell("ian", 372, 326, 164, 26, ["INFERIOR ALVEOLAR → MANDIBULAR", "foramen → lower teeth"], O, OR) +
      cell("nmh", 372, 356, 164, 26, ["n. to MYLOHYOID → mylohyoid", "+ ANTERIOR belly of digastric"], O, OR) +
      cell("men", 372, 386, 164, 16, ["MENTAL n.: mental foramen, chin, lip"], O, OR) +
      cell("tn", 372, 406, 164, 34, ["TRIGEMINAL NEURALGIA: V2/V3", "pain, sensory root compressed"], R, RR) +
      "</g>";
    A.scene("trigem", {
      title: "Trigeminal nerve · maxillary and mandibular branches, the pterygopalatine, otic and submandibular ganglia",
      vb: "0 0 540 470",
      svg,
      intro: "From the trigeminal ganglion: **V1** (left), **V2** with the **pterygopalatine ganglion** and its petrosal roots (middle), **V3** with its trunk, anterior and posterior divisions and the **otic** and **submandibular** ganglia (right).",
      parts: {
        tg: ["Trigeminal ganglion", "Sensory ganglion of V; its three divisions leave from it."],
        v1: ["Ophthalmic nerve (V1)", "Through the **superior orbital fissure**."],
        v2: ["Maxillary nerve (V2)", "Wholly sensory."],
        v3: ["Mandibular nerve (V3)", "Mixed: sensory and **motor to the muscles of mastication**."],
        v1h: ["Ophthalmic nerve (V1)", "Sensory: frontal, lacrimal and nasociliary branches."],
        sof: ["Superior orbital fissure", "V1 enters the orbit through it."],
        v1br: ["Branches of V1", "Frontal, lacrimal, nasociliary."],
        v1sup: ["What V1 supplies", "The **upper eyelid**, forehead, scalp to the vertex, and the cornea. The upper eyelid is **not** V2."],
        notv3: ["Muscles NOT supplied by V3", "**Buccinator**, **posterior belly of the digastric** and **stylohyoid** are facial (VII); **geniohyoid** is C1 through XII; **thyrohyoid** is C1. A motor-root injury of V3 spares them."],
        palate: ["Muscles of the soft palate", "Tensor palati, levator palati, palatoglossus, **palatopharyngeus** and **musculus uvulae**: all **vagus** (pharyngeal plexus) **except the tensor palati** (V3, nerve to medial pterygoid)."],
        spal: ["Sensation of the soft palate", "**Lesser palatine nerves** (V2 through the ganglion) and the **glossopharyngeal (IX)**. The hard palate: greater palatine and nasopalatine (V2)."],
        tongue: ["Nerves of the tongue muscles", "**Hypoglossal (XII)** for all **except the palatoglossus** (vagus)."],
        v2h: ["Maxillary nerve (V2)", "**Wholly sensory**. It does not supply the lower teeth or lip (V3), the upper eyelid (V1) or the buccinator skin (V3 buccal)."],
        cav2: ["In the cavernous sinus wall", "V2 runs forward inside the cavernous sinus's **lateral wall**, below V1 (V3 does not pass through the sinus)."],
        fr: ["Foramen rotundum", "V2 leaves the skull through the **foramen rotundum**, not the foramen spinosum."],
        ppf: ["Pterygopalatine fossa", "V2 and the pterygopalatine ganglion lie here (**not** the infratemporal fossa)."],
        v2men: ["Meningeal branch of V2", "To the meninges of the **middle cranial fossa**."],
        zyg: ["Zygomatic nerve", "Carries the postganglionic secretomotor fibres towards the lacrimal gland."],
        psa: ["Posterior superior alveolar nerve", "Upper molars and maxillary sinus."],
        ion2: ["Infraorbital nerve", "The continuation of V2: lower eyelid, cheek, side of the nose, **upper lip** and upper teeth (middle and anterior superior alveolar nerves)."],
        ppg: ["Pterygopalatine (sphenopalatine) ganglion", "In the **pterygopalatine fossa**, **suspended from V2** by its sensory (ganglionic) roots. Parasympathetic relay for the **lacrimal**, nasal and palatal glands."],
        gpn2: ["Greater (superficial) petrosal nerve", "From the **facial nerve**: the **parasympathetic root** carrying the **preganglionic fibres for lacrimation**. Not the lesser petrosal (IX), not the chorda tympani, not the vagus."],
        dpn: ["Deep petrosal nerve", "The **sympathetic** root, from the internal carotid plexus."],
        vid: ["Nerve of the pterygoid canal (vidian)", "**Greater petrosal + deep petrosal** unite to form it; it reaches the ganglion."],
        gpal: ["Greater palatine nerve", "From the ganglion to the **hard palate**."],
        lpal: ["Lesser palatine nerve", "From the **sphenopalatine ganglion** to the **soft palate**: it carries sensory fibres for the soft palate."],
        nasph: ["Nasal, pharyngeal and orbital branches", "Other branches of the ganglion."],
        lac: ["Lacrimal secretion", "Postganglionic fibres run with the zygomatic and lacrimal nerves to the **lacrimal gland**. Damage to the ganglion → **dry eye**."],
        pgpn: ["The two petrosal roots", "Greater petrosal (VII) = **parasympathetic**; deep petrosal (internal carotid plexus) = **sympathetic**."],
        v3h: ["Mandibular nerve (V3)", "**Mixed**: the only division with motor fibres (muscles of mastication). It does not supply the upper teeth."],
        fo: ["Foramen ovale", "V3 leaves through the **foramen ovale** into the **infratemporal fossa** (not the foramen spinosum, not the cavernous sinus). The lesser petrosal also leaves here."],
        nsp: ["Nervus spinosus", "Meningeal branch of the main trunk; re-enters the skull through the **foramen spinosum**."],
        nmp: ["Nerve to the medial pterygoid", "From the **main trunk**: supplies the medial pterygoid, the **tensor palati** (the only palate muscle supplied by V) and the tensor tympani."],
        ant3: ["Anterior division of V3", "Mainly motor: **masseteric**, **deep temporal** and **lateral pterygoid** nerves."],
        buc: ["Buccal nerve", "The anterior division's **only sensory** branch: skin and mucosa of the cheek over the buccinator (which itself is VII)."],
        atn: ["Auriculotemporal nerve", "A **posterior-division** branch: carries the otic ganglion's secretomotor fibres to the **parotid**; skin of the temple and ear."],
        otic: ["Otic ganglion", "Below the foramen ovale, on V3: relays the **lesser petrosal (IX)** fibres to the parotid via the auriculotemporal nerve."],
        lpn: ["Lesser (superficial) petrosal nerve", "From **IX** (tympanic plexus) to the **otic** ganglion for the **parotid**; leaves through the foramen ovale. Not for lacrimation."],
        lin: ["Lingual nerve", "General sensation (touch, pain, temperature) from the **anterior 2/3 of the tongue**, including the **tip**, and the floor of the mouth. The posterior 1/3 is IX."],
        ct3: ["Chorda tympani", "From VII: joins the lingual nerve; taste of the anterior 2/3 and the submandibular secretomotor fibres."],
        smg: ["Submandibular ganglion", "**Hangs from the lingual nerve (V3)**, not from the maxillary nerve."],
        ian: ["Inferior alveolar nerve", "Enters the **mandibular foramen** (not the mental foramen) and supplies the lower teeth."],
        nmh: ["Nerve to mylohyoid", "Given off by the inferior alveolar before it enters the foramen: supplies the **mylohyoid** and the **anterior belly of the digastric** (posterior division)."],
        men: ["Mental nerve", "The inferior alveolar's end: through the mental foramen to the chin and lower lip."],
        tn: ["Trigeminal neuralgia (tic douloureux)", "Severe, brief, episodic pain in the area of the **maxillary and/or mandibular** nerve, from compression of the trigeminal **sensory root** by a vessel or tumour."],
      },
      al: {
        tg: ["trigeminal ganglion", "gasserian ganglion", "semilunar ganglion", "trigeminal nerve"],
        v1: ["ophthalmic nerve", "ophthalmic division"],
        v2: ["maxillary nerve", "maxillary division"],
        v3: ["mandibular nerve", "mandibular division"],
        sof: ["superior orbital fissure"],
        v1sup: ["upper eyelid", "upper eye lid", "skin of the upper eyelid", "forehead"],
        notv3: ["buccinator", "stylohyoid", "geniohyoid", "thyrohyoid", "thyrohyoid muscle", "posterior belly of the digastric"],
        palate: ["musculus uvulae", "palatopharyngeus", "levator palati", "levator veli palatini", "muscles of the soft palate"],
        spal: ["sensory fibers for the soft palate", "soft palate"],
        tongue: ["palatoglossus", "hypoglossal"],
        cav2: ["passes inside cavernous sinus", "lateral wall of the cavernous sinus"],
        fr: ["foramen rotundum"],
        ppf: ["pterygopalatine fossa"],
        v2men: ["meninges of the middle cranial fossa", "meningeal branch"],
        zyg: ["zygomatic nerve"],
        psa: ["posterior superior alveolar", "upper molars", "upper teeth"],
        ion2: ["infraorbital nerve", "upper lip", "lower eyelid"],
        ppg: ["pterygopalatine ganglion", "sphenopalatine ganglion", "sphenopalatine", "pterygopalatine"],
        gpn2: ["greater petrosal", "greater superficial petrosal", "greater petrosal nerve", "greater superficial petrosal nerve", "lacrimation"],
        dpn: ["deep petrosal", "deep petrosal nerve", "deep petrosai nerve"],
        vid: ["nerve of pterygoid canal", "nerve of the pterygoid canal", "vidian"],
        gpal: ["greater palatine", "greater palatine nerve", "hard palate"],
        lpal: ["lesser palatine", "lesser palatine nerve"],
        lac: ["lacrimal gland", "dry eye", "reduced lacrimal secretion"],
        v3h: ["muscles of mastication"],
        fo: ["foramen ovale", "infratemporal fossa", "lies in the infratemporal fossa"],
        nsp: ["nervus spinosus", "foramen spinosum"],
        nmp: ["nerve to medial pterygoid", "medial pterygoid", "tensor palati", "tensor veli palatini", "tensor tympani"],
        ant3: ["masseteric", "deep temporal", "lateral pterygoid", "anterior division of mandibular"],
        buc: ["buccal nerve"],
        atn: ["auriculotemporal", "auriculo temporal", "auriculo temporal nerve", "auriculotemporal nerve"],
        otic: ["otic ganglion"],
        lpn: ["lesser petrosal", "lesser superficial petrosal", "lesser petrosal nerve", "lesser superficial petrosal nerve"],
        lin: ["lingual nerve", "anterior 2 3 of the tongue", "tip of the tongue"],
        ct3: ["chorda tympani"],
        smg: ["submandibular ganglion"],
        ian: ["inferior alveolar", "inferior alveolar nerve", "mandibular foramen", "lower teeth"],
        nmh: ["nerve to mylohyoid", "mylohyoid", "anterior belly of digastric", "anterior belly of the digastric"],
        men: ["mental nerve", "mental foramen"],
        tn: ["trigeminal neuralgia", "tic douloureux"],
      },
      drill: ["fr", "ppf", "ppg", "gpn2", "dpn", "vid", "lpal", "gpal", "fo", "nmp", "buc", "atn", "otic", "lpn", "lin", "smg", "ian", "nmh", "palate", "notv3"],
      sims: [
        { id: "v2", label: "Maxillary (V2)", on: ["v2", "v2h", "cav2", "fr", "ppf", "v2men", "zyg", "psa", "ion2"], info: "**Wholly sensory**: cavernous sinus wall → **foramen rotundum** → **pterygopalatine fossa** → infraorbital. Upper teeth, palate, upper lip, lower eyelid." },
        { id: "ppg", label: "Pterygopalatine ganglion", on: ["ppg", "gpn2", "dpn", "vid", "gpal", "lpal", "nasph", "lac", "pgpn"], info: "Hangs from V2 in the fossa. **Greater petrosal (VII, parasympathetic)** + **deep petrosal (sympathetic)** = **vidian nerve**. Branches: palatine, nasal, pharyngeal, orbital; lacrimal gland via the zygomatic nerve." },
        { id: "v3", label: "Mandibular (V3)", on: ["v3", "v3h", "fo", "nsp", "nmp", "ant3", "buc", "atn", "lin", "ian", "nmh", "men"], info: "**Foramen ovale**. Trunk: nervus spinosus, **nerve to medial pterygoid** (+ tensor palati, tensor tympani). Anterior: masseteric, deep temporal, lateral pterygoid, **buccal (sensory)**. Posterior: **auriculotemporal, lingual, inferior alveolar** (→ nerve to mylohyoid)." },
        { id: "gang", label: "Otic and submandibular", on: ["otic", "lpn", "atn", "smg", "lin", "ct3"], info: "**Lesser petrosal (IX)** → otic ganglion → auriculotemporal → parotid. **Chorda tympani (VII)** → lingual → submandibular ganglion." },
        { id: "palate", label: "Palate and not-V3", on: ["palate", "spal", "nmp", "notv3", "tongue", "gpal", "lpal"], info: "Soft palate muscles: all vagus **except tensor palati (V3)**. Not V3: buccinator, posterior digastric, stylohyoid (VII); geniohyoid, thyrohyoid (C1)." },
      ],
      secs: { "an-trigeminal#0": "v2", "an-trigeminal#1": "ppg", "an-trigeminal#2": "v3", "an-trigeminal#3": "v3", "an-oral-cavity#2": "palate" },
      rules: [
        [/pterygopalatine|sphenopalatine|petrosal|lacrimation|vidian/i, "ppg"],
        [/maxillary nerve/i, "v2"],
        [/otic ganglion|submandibular ganglion/i, "gang"],
        [/mandibular nerve|mylohyoid|auriculo|lingual nerve|inferior alveolar|buccal nerve/i, "v3"],
        [/soft palate|tensor palati|musculus uvulae|palatopharyngeus/i, "palate"],
      ],
    });
  })();
})();
