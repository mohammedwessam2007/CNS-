/* INTELLECTUALITY v17.3 · Physiology close-ups: the stretch reflex, tendon jerks, muscle tone and the inverse stretch
 * reflex on one board; and rotation, nystagmus, the post-rotational effects, the caloric test and vestibular disease.
 * Drawn from the notes' wording (ph-spinal-reflexes#0–#4, ph-vestibular#2–#4).
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
  const arrow = (id, d, c, r, w) => '<path class="ps" data-p="' + id + '" d="' + d + '" marker-end="url(#ixArr)" style="--c:' + c + ";--r:" + r + ";--w:" + (w || 2) + '"/>';
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

  /* ═══════════════ 1. STRETCH REFLEX, JERKS, TONE, INVERSE STRETCH REFLEX ═══════════════ */
  (function () {
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">STRETCH REFLEX · TENDON JERK · TONE · INVERSE STRETCH REFLEX</text>' +
      box(4, 22, 252, 190) +
      // cord segment
      '<ellipse cx="128" cy="62" rx="70" ry="30" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' + T(70, 44, "spinal segment", "sm mut") +
      dot("t_amn", 108, 74, 7, B, "#2a5a7a") + T(96, 77, "α-MN", "sm", "end") +
      dot("t_inn", 160, 66, 6, R, "#6a3040") + T(170, 62, "Ib inter-", "sm", "start") + T(170, 72, "neuron", "sm", "start") +
      ps("t_asc", "M128 58 L128 26", P, "#5a4a8a", 1.6) + T(132, 30, "2nd-order ↑", "sm", "start") +
      // muscle between bone and tendon
      '<rect x="8" y="140" width="14" height="44" rx="3" fill="#cfd8e3" opacity=".5" pointer-events="none"/>' + T(15, 196, "bone", "sm mut") +
      '<path class="pf" data-p="t_mus" d="M22 150 C60 130 150 130 190 150 L190 174 C150 194 60 194 22 174 Z" style="--c:' + O + ';--r:#5a3a30"/>' +
      '<path d="M190 156 L236 160 L236 166 L190 170 Z" fill="#e8e0d0" opacity=".7" pointer-events="none"/>' + T(204, 186, "tendon", "sm mut") +
      '<path class="pf" data-p="t_sp" d="M70 162 C84 154 116 154 130 162 C116 170 84 170 70 162 Z" style="--c:' + G + ';--r:#2f6a4c"/>' + T(100, 150, "spindle (parallel)", "sm") +
      '<rect class="pf" data-p="t_gto" x="184" y="152" width="14" height="22" rx="4" style="--c:' + R + ';--r:#6a3040"/>' + T(198, 144, "GTO (series)", "sm") +
      ps("t_ia", "M100 162 C96 130 92 110 104 80", G, "#2f6a4c", 2.2) + T(84, 120, "Ia", "sm", "end") +
      ps("t_ib", "M192 152 C188 120 176 100 162 72", R, "#6a3040", 1.8) + T(190, 118, "Ib", "sm", "start") +
      ps("t_eff", "M112 80 C130 110 150 130 150 150", B, "#2a5a7a", 2) + T(146, 110, "α", "sm", "start") +
      ps("t_inh", "M156 70 L116 74", R, "#6a3040", 1.4) +
      arrow("t_ham", "M246 196 L234 172", "#d9ff43", "#6a7a3a", 2) + T(250, 206, "tap", "sm", "end") +
      // chips, right
      box(262, 22, 254, 190) +
      cell("t_jerk", 268, 28, 242, 26, ["TENDON JERK = DYNAMIC stretch reflex: a SUDDEN", "brief stretch (not a gradual one), bag fibres"], G, GR) +
      cell("t_tone", 268, 58, 242, 36, ["MUSCLE TONE = STATIC stretch reflex: SUSTAINED", "stretch; greatest in ANTIGRAVITY muscles standing;", "↓ at rest and in sleep; = resistance to passive stretch"], G, GR) +
      cell("t_mito", 268, 98, 242, 26, ["antigravity muscles hold it without fatigue:", "rich in MITOCHONDRIA (red, oxidative)"], G, GR) +
      cell("t_pair", 268, 128, 242, 26, ["stretch reflex ↔ SPINDLE (length, Ia)", "autogenic inhibition ↔ GTO (tension, Ib)"], Y, YR) +
      cell("t_arc", 268, 158, 242, 26, ["REFLEX ACTION: fast, brief, involuntary; arc", "≥ 2 neurons (afferent + efferent, 1 synapse)"], Y, YR) +
      cell("t_fcp", 268, 188, 242, 18, ["FINAL COMMON PATH = the α-motor neuron"], Y, YR) +
      // jerks and tone changes
      '<text class="ttl" x="260" y="228" text-anchor="middle">WHEN JERKS AND TONE CHANGE</text>' +
      cell("t_abs", 4, 236, 254, 26, ["ABSENT jerk: AFFERENT, EFFERENT or SPINAL CENTRE", "lesion (LMN) · not a supraspinal lesion"], O, OR) +
      cell("t_exag", 262, 236, 254, 26, ["EXAGGERATED jerk: supraspinal INHIBITORY lesion", "(UMN), ↑ γ discharge, ANXIETY"], O, OR) +
      cell("t_up", 4, 266, 254, 18, ["tone ↑: γ activation, anxiety, UMN, Parkinson"], O, OR) +
      cell("t_down", 262, 266, 254, 18, ["tone ↓: LMN lesion, cerebellar (pendular), sleep"], O, OR) +
      // GTO and γ
      '<text class="ttl" x="260" y="302" text-anchor="middle">GOLGI TENDON ORGAN AND THE γ SYSTEM</text>' +
      cell("t_inv", 4, 310, 512, 26, ["INVERSE STRETCH REFLEX (autogenic inhibition): GTO → Ib → inhibitory interneuron ⊣ α-MN of the SAME muscle", "protective: DECREASES the chance of AVULSION of an over-stretched muscle · the CLASP-KNIFE lengthening reaction"], R, RR) +
      cell("t_coact", 4, 340, 254, 26, ["α–γ CO-ACTIVATION: the spindle keeps responding", "while the muscle shortens (not tendon receptors)"], B, BR) +
      cell("t_syn", 262, 340, 254, 26, ["spindle afferents synapse with α-MN (same muscle),", "interneurons, 2nd-order ASCENDING neurons, NOT γ"], P, PR) +
      cell("t_gloop", 4, 370, 254, 26, ["γ LOOP: γ → polar ends contract → spindle", "stretched → more Ia → more α (tone)"], B, BR) +
      cell("t_unl", 262, 370, 254, 26, ["α alone UNLOADS the spindle (less discharge);", "cutting γ → spindle less sensitive"], B, BR);
    A.scene("tone", {
      title: "Stretch reflex, tendon jerk, muscle tone and the inverse stretch reflex",
      vb: "0 0 520 402",
      svg,
      intro: "Top-left: the **spindle** (in parallel) and the **Golgi tendon organ** (in series) wired into one segment. Right: jerk vs tone. Below: what makes jerks absent or brisk, the inverse stretch reflex and the γ system.",
      parts: {
        t_amn: ["α-motor neuron", "The **final common path**: excited monosynaptically by Ia afferents from its own muscle."],
        t_inn: ["Ib inhibitory interneuron", "Driven by the GTO: inhibits the α-motor neurons of the **same** muscle."],
        t_asc: ["Branch to 2nd-order ascending neurons", "Spindle afferents also synapse with **2nd-order neurons of ascending (spinocerebellar) pathways**."],
        t_mus: ["Skeletal muscle (extrafusal)", "Stretching it stretches the spindles lying in parallel."],
        t_sp: ["Muscle spindle", "In **parallel** with the extrafusal fibres: senses **length** and its rate of change. The receptor of the **stretch reflex**."],
        t_gto: ["Golgi tendon organ", "In **series** at the muscle–tendon junction: senses **tension** (force), not length. The receptor of the **inverse stretch reflex**."],
        t_ia: ["Ia afferent", "Fast afferent from the spindle: **monosynaptic** excitation of the α-motor neurons of the same muscle."],
        t_ib: ["Ib afferent", "From the GTO to **inhibitory interneurons** in the cord."],
        t_eff: ["α-motor axon", "To the extrafusal fibres: contraction."],
        t_inh: ["Autogenic inhibition", "The Ib interneuron inhibits the α-motor neuron of the same muscle."],
        t_ham: ["Tendon tap", "A **sudden brief** stretch: the **tendon jerk**."],
        t_jerk: ["Tendon jerk", "A **dynamic** stretch reflex (a sudden brief stretch, via the nuclear bag fibres). It is **not** evoked by gradually stretching the muscle, and not by tendon receptors."],
        t_tone: ["Muscle tone", "A **static** stretch reflex from the **sustained** stretch of gravity: **greatest in antigravity muscles during standing**, reduced at rest and in sleep; assessed as the resistance to passive stretch."],
        t_mito: ["Why antigravity muscles don't fatigue", "They are **rich in mitochondria** (red, oxidative fibres), not creatine phosphate."],
        t_pair: ["Receptor ↔ reflex", "**Stretch reflex ↔ muscle spindle**; autogenic inhibition ↔ Golgi tendon organ. Reciprocal inhibition is a spinal circuit, not a receptor."],
        t_arc: ["Reflex action and the reflex arc", "A **fast, brief, involuntary response to a sensory stimulus**. The minimum arc has **two sequential neurons** (afferent + efferent): the monosynaptic stretch reflex, with the shortest reflex time."],
        t_fcp: ["Final common path", "The **α-motor neuron** for all reflexes."],
        t_abs: ["Absent tendon jerk", "A lesion of the **afferent**, the **efferent** or the **spinal centre** (LMN lesion, which also lowers tone); **not** a lesion of supraspinal facilitatory centres."],
        t_exag: ["Exaggerated tendon jerks", "A lesion of **supraspinal inhibitory** centres (UMN), **increased γ discharge**, and **anxiety**. In cerebellar ataxia they are **pendular**, not exaggerated."],
        t_up: ["What raises tone", "γ activation, **anxiety**, UMN lesions, Parkinson's disease (rigidity)."],
        t_down: ["What lowers tone", "**LMN lesion** (decreased tone), cerebellar lesion (pendular jerks), sleep."],
        t_inv: ["Inverse stretch reflex", "GTO → **Ib** → **inhibitory interneurons** → inhibit the α-motor neurons of the **same** muscle (and excite its antagonists). Protective: it **decreases** the possibility of avulsing an over-stretched muscle from its bony attachments. Clinically the **clasp-knife** lengthening reaction."],
        t_coact: ["α–γ co-activation", "The brain drives α and γ together, so the spindle **keeps responding to stretch while the muscle contracts** and proprioception to higher centres is maintained. Not due to stretch receptors in the tendon."],
        t_syn: ["Where spindle afferents end", "On the **α-motor neurons of the same muscle**, local interneurons and **2nd-order neurons of ascending pathways**, but **not** on γ-motor neurons."],
        t_gloop: ["The γ loop", "γ discharge contracts the polar ends → the central region is stretched → more spindle discharge → more α activity: γ-motor neurons **control tone** through the spindle."],
        t_unl: ["Unloading", "α discharge alone shortens the muscle and **unloads** the spindle. Cutting γ discharge makes the spindle less sensitive."],
      },
      al: {
        t_amn: ["alpha motor neuron", "alpha motor neurons"],
        t_inn: ["inhibitory interneuron", "inhibitory interneurons"],
        t_asc: ["2nd order neurons of ascending sensory pathways", "2nd order neurons of ascending", "second order neurons"],
        t_sp: ["muscle spindle", "muscle spindles"],
        t_gto: ["golgi tendon organ", "tendon organ", "golgi tendon organs"],
        t_ia: ["ia afferent", "ia fibers", "annulospiral"],
        t_ib: ["ib afferent", "ib fibers"],
        t_ham: ["sudden stretch", "sudden stretch of a muscle"],
        t_jerk: ["tendon jerk", "tendon jerks", "dynamic stretch reflex", "gradually stretching the muscle", "evoked by gradually stretching", "deep reflex"],
        t_tone: ["muscle tone", "skeletal muscle tone", "static stretch reflex", "resistance offered by a muscle", "passive stretch", "during rest", "increased during rest", "reduced during sleep", "antigravity muscles", "altered during stress"],
        t_mito: ["mitochondria", "creatine phosphate", "without fatigue"],
        t_pair: ["autogenic inhibition", "stretch reflex muscle spindle"],
        t_arc: ["reflex action", "reflex arc", "fast brief response", "two types of sensory receptors", "sequential neurons"],
        t_fcp: ["final common path", "final common pathway"],
        t_abs: ["absence of a tendon jerk", "spinal nerve centers", "lesions of the spinal nerve centers", "absent jerk"],
        t_exag: ["exaggeration of tendon jerks", "exaggerated tendon jerks", "anxiety", "increased gamma discharge"],
        t_up: ["activation of y fibers", "activation of gamma fibers", "increased muscle tone"],
        t_down: ["decreased muscle tone"],
        t_inv: ["inverse stretch reflex", "avulsion", "bony attachments", "lengthening reaction", "clasp knife reaction"],
        t_coact: ["co activation", "coactivation", "alpha gamma coactivation", "stretch receptors in the tendon", "remains capable of responding to stretch"],
        t_syn: ["central ends of afferents", "spindle afferents"],
        t_gloop: ["gamma loop", "gamma motor neuron", "gamma motor neurons", "gamma efferent"],
        t_unl: ["unload", "unloading"],
      },
      drill: ["t_sp", "t_gto", "t_ia", "t_ib", "t_jerk", "t_tone", "t_abs", "t_exag", "t_inv", "t_coact", "t_syn", "t_mito", "t_fcp"],
      sims: [
        { id: "jerk", label: "▶ Tendon jerk", on: ["t_ham", "t_sp", "t_ia", "t_amn", "t_eff", "t_mus", "t_jerk", "t_arc"], info: "A **sudden** tap stretches the **spindle** → **Ia** → **one synapse** on the α-motor neuron → the same muscle contracts: a **dynamic** stretch reflex." },
        { id: "gto", label: "▶ Inverse stretch reflex", on: ["t_gto", "t_ib", "t_inn", "t_inh", "t_amn", "t_inv"], info: "High **tension** → **GTO** → **Ib** → **inhibitory interneuron** ⊣ α-motor neuron of the same muscle: it gives way and is protected from **avulsion**." },
        { id: "change", label: "Absent vs brisk", on: ["t_abs", "t_exag", "t_up", "t_down"], info: "**Absent**: afferent, efferent or spinal-centre lesion. **Exaggerated**: UMN (loss of supraspinal inhibition), ↑ γ, **anxiety**." },
        { id: "gamma", label: "γ system", on: ["t_coact", "t_gloop", "t_unl", "t_syn"], info: "γ keeps the spindle taut (**co-activation**), sets tone through the **γ loop**; α alone unloads the spindle." },
      ],
      secs: { "ph-spinal-reflexes#3": "change", "ph-spinal-reflexes#4": "gto", "ph-spinal-reflexes#0": "jerk" },
      rules: [
        [/inverse stretch|autogenic|avulsion/i, "gto"],
        [/absence of a tendon jerk|exaggerat|muscle tone|tone is/i, "change"],
        [/co.?activation|gamma loop|γ loop/i, "gamma"],
      ],
    });
  })();

  /* ═══════════════ 2. ROTATION, NYSTAGMUS, CALORIC TEST, VESTIBULAR DISEASE ═══════════════ */
  (function () {
    // one frame of the rotation story: head from above with the horizontal canal, endolymph arrow, eyes below
    const frame = (x, lab, rot, endo, slow, fast, feel, ids) => {
      const cx = x + 84,
        cy = 84;
      let s = box(x, 22, 168, 190) + T(cx, 36, lab, "sm mut");
      s += '<circle class="pf" data-p="' + ids.f + '" cx="' + cx + '" cy="' + cy + '" r="34" style="--c:#6f8aa8;--r:#1a2b40"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="none" stroke="#b39cff" stroke-width="5" opacity=".6" pointer-events="none"/>';
      s += '<path d="M' + (cx - 6) + " " + (cy - 38) + " L" + cx + " " + (cy - 46) + " L" + (cx + 6) + " " + (cy - 38) + '" fill="#cfd8e3" opacity=".7" pointer-events="none"/>';
      if (rot) s += '<path d="M' + (cx + 42) + " " + (cy - 16) + " A44 44 0 0 1 " + (cx + 42) + " " + (cy + 16) + '" stroke="#d9ff43" stroke-width="2" fill="none" marker-end="url(#ixArr)" pointer-events="none"/>';
      s += T(cx + 48, cy + 34, rot ? "head turns →" : "stopped", "sm", "middle");
      if (endo) s += '<path class="ps" data-p="' + ids.e + '" d="' + (endo > 0 ? "M" + (cx - 14) + " " + (cy - 17) + " A22 22 0 0 1 " + (cx + 14) + " " + (cy - 17) : "M" + (cx + 14) + " " + (cy - 17) + " A22 22 0 0 0 " + (cx - 14) + " " + (cy - 17)) + '" marker-end="url(#ixArr)" style="--c:#66e9ff;--r:#2a5a7a;--w:2.4"/>';
      s += T(cx, cy + 4, endo ? "endolymph" : "at rest", "sm");
      // eyes
      const ey = 142;
      s += '<ellipse cx="' + (cx - 20) + '" cy="' + ey + '" rx="14" ry="8" fill="#e8eef5" opacity=".85" pointer-events="none"/><ellipse cx="' + (cx + 20) + '" cy="' + ey + '" rx="14" ry="8" fill="#e8eef5" opacity=".85" pointer-events="none"/>';
      const px = slow ? (slow < 0 ? -6 : 6) : 0;
      s += '<circle cx="' + (cx - 20 + px) + '" cy="' + ey + '" r="4" fill="#1b2a3c" pointer-events="none"/><circle cx="' + (cx + 20 + px) + '" cy="' + ey + '" r="4" fill="#1b2a3c" pointer-events="none"/>';
      if (slow) s += '<path class="ps" data-p="' + ids.s + '" d="M' + (cx + (slow < 0 ? 30 : -30)) + " 162 L" + (cx + (slow < 0 ? -30 : 30)) + ' 162" stroke-dasharray="4 3" marker-end="url(#ixArr)" style="--c:#ffd166;--r:#6a5a30;--w:2"/>' + T(cx, 174, "slow drift", "sm");
      if (fast) s += '<path class="ps" data-p="' + ids.q + '" d="M' + (cx + (fast > 0 ? -12 : 12)) + " 184 L" + (cx + (fast > 0 ? 18 : -18)) + ' 184" marker-end="url(#ixArr)" style="--c:#ff5d7a;--r:#6a3040;--w:3"/>' + T(cx, 196, "fast flick", "sm");
      if (!slow && !fast) s += T(cx, 176, "no nystagmus", "sm");
      s += T(cx, 208, feel, "sm mut");
      return s;
    };
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">ROTATION TO THE RIGHT · NYSTAGMUS AND THE POST-ROTATIONAL EFFECTS</text>' +
      frame(4, "START (speeding up)", true, -1, -1, 1, "feels: turning right", { f: "f_start", e: "e_start", s: "s_start", q: "q_start" }) +
      frame(176, "CONSTANT SPEED", true, 0, 0, 0, "feels: nothing", { f: "f_const", e: "e_const", s: "s_const", q: "q_const" }) +
      frame(348, "STOP (post-rotational)", false, 1, 1, -1, "feels: turning LEFT", { f: "f_stop", e: "e_stop", s: "s_stop", q: "q_stop" }) +
      cell("vor", 4, 218, 254, 26, ["NYSTAGMUS = a VESTIBULO-OCULAR reflex: it", "STABILIZES the image (it has an aim)"], Y, YR) +
      cell("slowc", 262, 218, 254, 26, ["SLOW component: OPPOSITE to the rotation", "FAST component: resets, names the nystagmus"], Y, YR) +
      cell("asym", 4, 248, 254, 36, ["ASYMMETRICAL discharge: START, STOP, CHANGE of", "speed, labyrinthitis · NOT constant speed, linear", "movement or head tilt"], B, BR) +
      cell("post", 262, 248, 254, 36, ["POST-ROTATIONAL: vertigo the other way, past-", "pointing, falling, tone change (from the canals of", "the OPPOSITE side); movements to correct it"], B, BR) +
      cell("cal", 4, 288, 254, 36, ["CALORIC test: ONE canal (horizontal) of ONE ear;", "water sets up convection · head tilted BACK;", "COWS: cold → fast phase Opposite, warm → Same"], G, GR) +
      cell("mac", 262, 288, 254, 36, ["MACULAE (utricle, saccule): HEAD POSITION and", "LINEAR acceleration, in any posture · the", "rotational VOR and rotatory nystagmus = CANALS"], G, GR) +
      '<text class="ttl" x="260" y="340" text-anchor="middle">VERTIGO WITH NYSTAGMUS</text>' +
      cell("lab", 4, 348, 168, 36, ["LABYRINTHITIS: vertigo,", "positional nystagmus,", "NO tinnitus"], O, OR) +
      cell("men", 176, 348, 168, 36, ["MÉNIÈRE: vertigo +", "TINNITUS + hearing loss", "(endolymph excess)"], O, OR) +
      cell("cent", 348, 348, 168, 36, ["CENTRAL (flocculonodular):", "mild, chronic, BIDIRECTIONAL", "+ vertical, no tinnitus"], O, OR) +
      cell("loss", 4, 388, 254, 26, ["sudden loss of one labyrinth: vertigo, nystagmus,", "falls towards the LESION side (vision compensates)"], R, RR) +
      cell("motion", 262, 388, 254, 26, ["MOTION SICKNESS: vestibular vs visual conflict", "→ nausea, vomiting, pallor"], R, RR);
    A.scene("nystag", {
      title: "Rotation and nystagmus · start, constant speed, stop; the caloric test and vestibular disease",
      vb: "0 0 520 420",
      svg,
      intro: "Three moments of a turn to the **right**, seen from above: at the start the endolymph **lags** (moves left relative to the canal), at constant speed it catches up, at the stop it **runs on**. The eyes below show the slow drift and the fast flick.",
      parts: {
        f_start: ["Start of rotation", "Angular acceleration: the endolymph lags and bends the cupulae; **asymmetrical** discharge (the right horizontal canal is excited when turning right)."],
        e_start: ["Endolymph at the start", "Relative to the canal it moves **opposite** to the rotation (to the left when turning right)."],
        s_start: ["Slow component at the start", "Both eyes drift **slowly to the left**, **opposite** to a rotation to the right: the vestibulo-ocular reflex keeps the image on the retina."],
        q_start: ["Fast component at the start", "Then they **rapidly deviate to the right** (reset), in the direction of rotation."],
        f_const: ["Constant-speed rotation", "The endolymph catches up, the cupula returns to rest: **no** stimulation, **no** nystagmus, no sensation of turning."],
        f_stop: ["Stopping (post-rotational)", "The endolymph keeps moving and now excites the canals of the **opposite** side."],
        e_stop: ["Endolymph at the stop", "It runs on in the direction of the old rotation."],
        s_stop: ["Post-rotational slow component", "Now the eyes drift the **other** way."],
        q_stop: ["Post-rotational fast component", "Post-rotational nystagmus beats **opposite** to the original rotation."],
        vor: ["Nystagmus is a vestibulo-ocular reflex", "It **stabilizes** the eyes on visual objects: it has an aim. Seen at the start and at the end of rotation, not during constant rotation."],
        slowc: ["Slow and fast components", "The **slow** component is **opposite** to the direction of rotation; the fast one resets the eyes and gives the nystagmus its name."],
        asym: ["Asymmetrical bilateral discharge", "At the **start**, the **end**, any **change in speed** of rotation, and in **labyrinthitis**. **Not** during constant-speed rotation, linear movement or head tilt."],
        post: ["Post-rotational effects", "A false sensation of rotating the **other** way (vertigo), past-pointing, a tendency to fall, and changes in muscle tone from the **opposite-side** canals; the subject's corrective movements **aim to correct the false sensation and prevent falling**."],
        cal: ["Caloric test", "Warm or cold water in **one** ear sets up convection currents that stimulate **one canal (the horizontal) of one ear**, not all canals of both ears. The head is tilted back so the horizontal canal is vertical. **COWS**: cold → fast phase to the opposite side, warm → same side."],
        mac: ["Maculae (otolith organs)", "Detect **head position in space** and **linear** acceleration, in any posture (not only upright). The rotational vestibulo-ocular reflex and rotatory nystagmus come from the **canals**."],
        lab: ["Labyrinthitis", "Vertigo with **positional nystagmus** and **no tinnitus** (the bank's key for bidirectional positional nystagmus)."],
        men: ["Ménière's disease", "Vertigo **plus tinnitus and hearing loss** (excess endolymph)."],
        cent: ["Central (flocculonodular) cause", "Mild, chronic vertigo with **bidirectional** positional nystagmus that includes a **vertical** component and no tinnitus: standard teaching points to the **flocculonodular lobe** (vestibulocerebellum)."],
        loss: ["Sudden loss of one labyrinth", "Vertigo, nystagmus and falling **towards the side of the lesion**, compensated later by vision and the other side."],
        motion: ["Motion sickness", "Conflict between vestibular and visual input → nausea, vomiting, pallor (vomiting centre / chemoreceptor trigger zone)."],
      },
      al: {
        f_start: ["start of rotation", "at the start of rotation", "beginning of rotation", "starts to rotate", "rotational sense", "slowly rotates toward the right"],
        e_start: ["endolymph lags", "moves opposite to the direction of rotation"],
        s_start: ["both eyes move slowly to the left", "deviate toward the left", "eyes deviate toward the left"],
        q_start: ["rapidly deviate", "rapidly deviate to the right"],
        f_const: ["constant speed", "constant rotation", "uniform rotation", "not observed during rotation", "during rotation"],
        f_stop: ["post rotational", "post rotating", "post rotating effects", "end of rotation", "stops rotating", "after rotation"],
        vor: ["vestibulo ocular reflex", "vestibular ocular reflex", "vestibule ocular reflex", "has no aim", "nystagmus"],
        slowc: ["slow component", "fast component", "quick phase", "slow phase"],
        asym: ["asymmetrical bilateral discharge", "asymmetrical discharge", "changing of speed", "change in speed of rotation", "changing of speed of rotation"],
        post: ["past pointing", "correct false sensation", "false sensation of rotation", "prevent falling", "prevent falling of the body", "rotated toward opposite side", "rotated toward same side"],
        cal: ["caloric", "caloric method", "caloric test", "caloric stimulation", "all canals in two ears", "head tipped backward", "cows"],
        mac: ["maculae", "macula", "otolith organs", "head position in space", "recumbent posture", "standing upright", "linear acceleration"],
        lab: ["labyrinthitis", "bidirectional positional nystagmus", "positional nystagmus"],
        men: ["meniere", "meniere syndrome", "meniere disease", "tinnitus"],
        cent: ["flocculonodular lesion", "lesion of the flocculonodular lobe", "psychogenic"],
        loss: ["loss of one labyrinth", "falling towards the side of the lesion"],
        motion: ["motion sickness"],
      },
      drill: ["e_start", "s_start", "q_start", "f_const", "f_stop", "vor", "slowc", "asym", "post", "cal", "mac", "lab", "men"],
      sims: [
        { id: "start", label: "▶ Start", on: ["f_start", "e_start", "s_start", "q_start", "vor", "slowc", "asym"], info: "Turning **right**: endolymph lags (moves **left** relative to the canal) → right canal excited → eyes drift **slowly left**, flick **fast right**." },
        { id: "const", label: "Constant speed", on: ["f_const"], lost: ["s_start", "q_start"], info: "Endolymph catches up: **no** nystagmus, **no** sensation." },
        { id: "stop", label: "▶ Stop", on: ["f_stop", "e_stop", "s_stop", "q_stop", "post"], info: "Endolymph runs on → the **opposite** canals fire → you feel turning **left**, past-point, tend to fall; nystagmus beats the other way." },
        { id: "tests", label: "Caloric and disease", on: ["cal", "lab", "men", "cent", "loss", "motion"], info: "**Caloric**: one horizontal canal of one ear (COWS). **Labyrinthitis**: no tinnitus; **Ménière**: tinnitus + deafness." },
      ],
      secs: { "ph-vestibular#4": "tests" },
      rules: [
        [/post.?rotat|stops/i, "stop"],
        [/caloric|labyrinthitis|m[eé]ni[eè]re|vertigo/i, "tests"],
        [/nystagmus|rotat/i, "start"],
      ],
    });
  })();
})();
