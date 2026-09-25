/* INTELLECTUALITY v17.3 · Clinical motor signs: UMN vs LMN lesions, cerebellar signs and functions, and the
 * basal-ganglia disorders with the five gaits. Boards drawn from the notes' wording (ph-umn-lmn, ph-cerebellum,
 * ph-basal-ganglia, ph-sensory-lesions) so that every sign an answer names has its own place to light up.
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
  const head = (x, y, r) => "M" + (x - r) + " " + y + " a" + r + " " + r + " 0 1 0 " + 2 * r + " 0 a" + r + " " + r + " 0 1 0 " + -2 * r + " 0 ";
  const bolt = (id, x, y) => '<path class="pf" data-p="' + id + '" d="M' + x + " " + y + " l10 -14 l-2 9 l9 -1 l-12 16 l3 -9 Z" + '" style="--c:#ff5d7a;--r:#a33a50"/>';
  const UMN = "#66e9ff",
    LMN = "#ffd166",
    BAD = "#ff9f43";

  /* ═══════════════ 1. UMN vs LMN LESION ═══════════════ */
  (function () {
    const rows = [
      ["u_par", ["SPASTIC paralysis"], "l_par", ["FLACCID paralysis"]],
      ["u_tone", ["HYPERtonia (clasp-knife)"], "l_tone", ["HYPOtonia"]],
      ["u_ref", ["HYPERreflexia + CLONUS"], "l_ref", ["reflexes LOST", "(withdrawal reflex too)"]],
      ["u_bab", ["BABINSKI + (extensor plantar),", "abdominal reflexes lost"], "l_bab", ["no Babinski"]],
      ["u_wast", ["NO marked wasting", "(mild disuse only)"], "l_wast", ["MARKED wasting (atrophy)"]],
      ["u_fasc", ["no fasciculations"], "l_fasc", ["FASCICULATIONS"]],
      ["u_emg", ["electrical reaction UNCHANGED,", "no EMG changes"], "l_emg", ["EMG changes: fibrillations,", "reaction of degeneration"]],
      ["u_sup", ["receptors normal"], "l_sup", ["denervation SUPERsensitivity:", "MORE ACh receptors"]],
      ["u_ext", ["MOVEMENTS over a wide area"], "l_ext", ["INDIVIDUAL muscles"]],
      ["u_cause", ["left capsule bleed →", "RIGHT hemiplegia"], "l_cause", ["POLIOMYELITIS,", "peripheral nerve injury"]],
    ];
    let y = 44;
    let board = "";
    for (const [u, ut, l, lt] of rows) {
      board += cell(u, 170, y, 166, 24, ut, UMN, "#1d3a55") + cell(l, 344, y, 170, 24, lt, LMN, "#4a4030");
      y += 28;
    }
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">UPPER vs LOWER MOTOR NEURON LESION</text>' +
      box(4, 22, 158, 330) +
      // the chain: cortex → capsule → decussation → cord → anterior horn → nerve → muscle
      '<path class="pf" data-p="umn" d="M60 36 L78 36 L69 54 Z" style="--c:' + UMN + ';--r:#2a5a7a"/>' + T(84, 44, "motor cortex", "sm", "start") + T(84, 54, "(area 4): UMN", "sm mut", "start") +
      ps("cst", "M69 54 L69 96 L69 128 C69 140 110 144 110 158 L110 222", UMN, "#3a6a8a", 2.6) +
      '<rect class="pf" data-p="cap" x="52" y="84" width="34" height="20" rx="5" style="--c:#b39cff;--r:#3a3060"/>' + T(69, 97, "IC", "sm") + T(90, 90, "internal", "sm", "start") + T(90, 100, "capsule", "sm", "start") +
      bolt("lesU", 30, 104) + T(24, 124, "UMN lesion", "sm", "start") +
      T(118, 148, "pyramidal", "sm", "start") + T(118, 158, "decussation", "sm", "start") +
      '<ellipse cx="88" cy="232" rx="56" ry="36" fill="#1a2b40" stroke="#6f8aa8" pointer-events="none"/>' + T(88, 204, "spinal cord", "sm mut") +
      T(132, 222, "lat. CST", "sm", "start") +
      '<path class="pf" data-p="ahc" d="M62 238 L78 232 L82 248 L66 254 Z" style="--c:' + LMN + ';--r:#6a5a30"/>' +
      ps("syn", "M110 222 C104 232 92 238 80 240", UMN, "#3a6a8a", 1.8) + T(40, 236, "anterior", "sm", "end") + T(40, 246, "horn: LMN", "sm", "end") +
      ps("nerve", "M66 254 C56 276 40 290 36 306", LMN, "#6a5a30", 2.6) + T(52, 282, "nerve", "sm", "end") +
      bolt("lesL", 64, 290) + T(84, 300, "LMN lesion", "sm", "start") +
      '<path class="pf" data-p="musc" d="M18 316 C30 306 70 306 82 316 C70 330 30 330 18 316 Z" style="--c:#ff9f43;--r:#6a4030"/>' + T(50, 342, "muscle", "sm mut") +
      '<text class="ttl" x="253" y="36" text-anchor="middle" style="fill:' + UMN + '">UMN LESION</text>' +
      '<text class="ttl" x="429" y="36" text-anchor="middle" style="fill:' + LMN + '">LMN LESION</text>' +
      board +
      '<text class="ttl" x="260" y="340" text-anchor="middle">NOT A PYRAMIDAL (UMN) SIGN</text>' +
      cell("nb_inv", 4, 348, 170, 34, ["involuntary movements,", "COGWHEEL rigidity →", "BASAL GANGLIA"], BAD, "#4a3020") +
      cell("nb_thy", 178, 348, 110, 34, ["hypothyroidism:", "SLOW-relaxing jerks"], BAD, "#4a3020") +
      cell("nb_sleep", 292, 348, 92, 34, ["sleep:", "tone and jerks ↓"], BAD, "#4a3020") +
      cell("nb_aprx", 388, 348, 128, 34, ["APRAXIA: premotor,", "NO paralysis"], BAD, "#4a3020");
    A.scene("umnlmn", {
      title: "UMN vs LMN lesion · the comparison table, sign by sign",
      vb: "0 0 520 388",
      svg,
      intro: "Left: the two-neuron chain and where each lesion sits. Right: the signs side by side (**blue = UMN**, **yellow = LMN**). Bottom: signs that are **not** pyramidal.",
      parts: {
        umn: ["Upper motor neuron", "Motor cortex (area 4) cell whose axon runs in the corticospinal (pyramidal) tract. It controls the LMN and normally **inhibits** the stretch reflex through supraspinal pathways."],
        cap: ["Internal capsule", "The UMN axons crowd together here: a small **capsular haemorrhage** → **contralateral hemiplegia** (lower face, arm, leg), usually with hemianaesthesia."],
        cst: ["Corticospinal (pyramidal) tract", "Crosses at the **pyramidal decussation** and runs in the lateral corticospinal tract. A lesion anywhere along it gives an **abnormal Babinski**."],
        syn: ["UMN → LMN synapse", "In the anterior horn."],
        ahc: ["Anterior horn cell (LMN)", "The final common path to the muscle. **Poliomyelitis** destroys these cells."],
        nerve: ["Peripheral (motor) nerve", "Part of the LMN: its injury is an LMN lesion."],
        musc: ["Skeletal muscle", "In an LMN lesion it loses its nerve: flaccid, wasted, fibrillating. In an UMN lesion it is still innervated."],
        lesU: ["UMN lesion", "Cortex, capsule, brainstem or cord tract: releases the stretch reflex from supraspinal inhibition → **spasticity, hyperreflexia, clonus, Babinski**, but no marked wasting."],
        lesL: ["LMN lesion", "Anterior horn cell, root or nerve: the reflex arc and the muscle's nerve supply are cut → **flaccid, areflexic, wasted, fasciculating**."],
        u_par: ["Spastic paralysis (UMN)", "**Spastic** paralysis = UMN (pyramidal) lesion."],
        l_par: ["Flaccid paralysis (LMN)", "**Flaccid** paralysis = LMN lesion."],
        u_tone: ["Hypertonia, clasp-knife (UMN)", "Tone is **increased**: the resistance gives way suddenly (**clasp-knife**). **Hypertonia + hyperreflexia = UMN lesion**."],
        l_tone: ["Hypotonia (LMN)", "Tone is **reduced**: the stretch reflex arc is cut."],
        u_ref: ["Hyperreflexia and clonus (UMN)", "**Exaggerated** deep tendon reflexes and **clonus** (rhythmic contractions on sustained stretch): UMN signs. Clonus is **not** an LMN sign."],
        l_ref: ["Reflexes lost (LMN)", "Deep reflexes are **abolished**, including the **withdrawal reflex** of that segment: the arc is cut. LMN lesions never give exaggerated jerks."],
        u_bab: ["Babinski sign (UMN)", "**Extensor plantar** response: an **abnormal Babinski reflex indicates damage to the pyramidal (corticospinal) tract**, anywhere along it (not the basal ganglia). Superficial abdominal reflexes are lost."],
        l_bab: ["No Babinski (LMN)", "The Babinski sign is an **UMN** sign."],
        u_wast: ["No marked wasting (UMN)", "Only mild **disuse** atrophy: a right hemiplegia is **not** accompanied by marked wasting."],
        l_wast: ["Marked wasting (LMN)", "A long-standing LMN lesion causes **marked muscle wasting (atrophy)** of the denervated muscle."],
        u_fasc: ["No fasciculations (UMN)", "Fasciculations belong to LMN disease."],
        l_fasc: ["Fasciculations (LMN)", "Visible twitches of motor units: LMN (e.g. motor neuron disease)."],
        u_emg: ["Electrical reaction unchanged (UMN)", "The LMN and muscle are intact, so the paralysed muscles respond **normally** to electrical stimulation: **not** exaggerated, reduced or absent; no reaction of degeneration."],
        l_emg: ["EMG changes (LMN)", "**Fibrillations**, denervation potentials and the **reaction of degeneration**: LMN lesions **do** show EMG changes."],
        u_sup: ["Receptors normal (UMN)", "The muscle is still innervated."],
        l_sup: ["Denervation supersensitivity (LMN)", "Due to an **increased number of ACh receptors** spread over the denervated fibre, **not** fewer receptors."],
        u_ext: ["Movements, not muscles (UMN)", "An UMN lesion paralyses **movements** over a wide area (hemiplegia); the **distal** limb muscles are hit hardest; bilaterally represented muscles (upper face) are spared."],
        l_ext: ["Individual muscles (LMN)", "An LMN lesion hits the **individual muscles** supplied by the damaged cells or nerve."],
        u_cause: ["Capsular hemiplegia", "A **left** internal capsule bleed → **right** hemiplegia: spastic, with increased tendon reflexes on the right and **without marked wasting**. It paralyses **skeletal**, not smooth, muscle."],
        l_cause: ["Causes of LMN lesion", "**Poliomyelitis** (the virus destroys anterior horn cells) and peripheral nerve injury."],
        nb_inv: ["Involuntary movements and cogwheel rigidity", "**Basal-ganglia** (extrapyramidal) signs, e.g. Parkinsonism: **not** features of a pyramidal (corticospinal) lesion."],
        nb_thy: ["Hypothyroidism", "Gives **slow-relaxing** jerks, not hyperreflexia."],
        nb_sleep: ["Sleep", "**Lowers** tone and reflexes."],
        nb_aprx: ["Motor apraxia", "Loss of skilled, learned movements with **no paralysis**: a **premotor** lesion (not the sensory area, not area 4)."],
      },
      al: {
        umn: ["upper motor neuron", "umn", "umnl"],
        cap: ["internal capsule", "capsular", "capsular lesion", "internal capsular lesion"],
        cst: ["pyramidal tract", "corticospinal tract", "corticospinal tract disease", "pyramidal tract lesion"],
        ahc: ["anterior horn cell", "anterior horn cells", "final common path"],
        nerve: ["peripheral nerve injury", "nerve injury"],
        lesU: ["umn lesion", "umn lesions", "upper motor neuron lesion", "upper motor neurone lesion"],
        lesL: ["lmn lesion", "lmn lesions", "lmnl", "lower motor neuron lesion", "lower motor neuron lesions", "lower motor neurone lesion", "lower motor neuron"],
        u_par: ["spastic paralysis", "spasticity", "spastic"],
        l_par: ["flaccid paralysis", "flaccidity", "flaccid"],
        u_tone: ["hypertonia", "clasp knife", "increased tone", "exaggerated reflexes and increased tone"],
        l_tone: ["hypotonia", "decreased tone"],
        u_ref: ["hyperreflexia", "hyper reflexia", "hyperactive reflexes", "exaggerated deep reflexes", "exaggerated deep tendon reflexes", "exaggerated reflexes", "increased tendon reflexes", "clonus", "clonic contractions"],
        l_ref: ["loss of withdrawal reflex", "withdrawal reflex", "areflexia", "inhibition of tendon jerks", "lost reflexes"],
        u_bab: ["babinski", "babinski sign", "extensor plantar", "abnormal babinski", "positive babinski"],
        u_wast: ["no marked wasting", "marked muscle wasting", "without marked wasting"],
        l_wast: ["muscle wasting", "wasting", "muscle atrophy", "remarkable wasting", "atrophy of the denervated muscle", "denervation atrophy"],
        l_fasc: ["fasciculation", "fasciculations"],
        u_emg: ["electrical stimulation", "response to electrical stimulation", "reaction of the paralysed muscles"],
        l_emg: ["emg changes", "emg", "fibrillation", "fibrillations", "reaction of degeneration", "denervation potentials"],
        l_sup: ["denervation supersensitivity", "denervation hypersensitivity", "supersensitivity", "number of transmitter receptors", "transmitter receptors", "acetylcholine receptors"],
        u_ext: ["distal muscles", "paralysis of the distal muscles", "hemiplegia", "monoplegia"],
        l_ext: ["individual muscles"],
        u_cause: ["left internal capsule", "smooth muscles", "all smooth muscles", "skeletal and smooth"],
        l_cause: ["poliomyelitis", "polio"],
        nb_inv: ["involuntary movements", "cogwheel rigidity", "cogwheel", "extrapyramidal"],
        nb_thy: ["hypothyroidism", "slow relaxing"],
        nb_aprx: ["apraxia", "motor apraxia", "premotor", "lesion in sensory area"],
      },
      drill: ["lesU", "lesL", "u_par", "l_par", "u_tone", "u_ref", "l_ref", "u_bab", "l_wast", "l_fasc", "u_emg", "l_emg", "l_sup", "l_cause", "nb_inv"],
      sims: [
        { id: "umn", label: "UMN lesion", on: ["umn", "cap", "cst", "lesU", "u_par", "u_tone", "u_ref", "u_bab", "u_wast", "u_fasc", "u_emg", "u_sup", "u_ext", "u_cause"], lost: ["l_par", "l_tone", "l_ref", "l_wast", "l_fasc", "l_emg", "l_sup"], info: "**UMN**: spastic, hypertonia (clasp-knife), hyperreflexia with clonus, **Babinski +**, no marked wasting, no fasciculation, normal electrical reaction." },
        { id: "lmn", label: "LMN lesion", on: ["ahc", "nerve", "musc", "lesL", "l_par", "l_tone", "l_ref", "l_bab", "l_wast", "l_fasc", "l_emg", "l_sup", "l_ext", "l_cause"], lost: ["u_par", "u_tone", "u_ref", "u_bab"], info: "**LMN**: flaccid, hypotonia, areflexia (withdrawal reflex too), **marked wasting**, fasciculations, EMG changes, denervation **super**sensitivity (more receptors). Polio." },
        { id: "notp", label: "Not pyramidal", on: ["nb_inv", "nb_thy", "nb_sleep", "nb_aprx"], info: "**Involuntary movements** and **cogwheel rigidity** are basal ganglia; hypothyroidism gives slow-relaxing jerks; sleep lowers tone; apraxia has **no** paralysis." },
      ],
      secs: { "ph-umn-lmn#0": "", "ph-umn-lmn#1": "umn", "ph-umn-lmn+signs-in-detail-spasticity-babinski-fasc": "" },
      rules: [
        [/lower motor neuron|\bLMN/i, "lmn"],
        [/upper motor neuron|\bUMN|pyramidal tract lesion|corticospinal tract disease|babinski|hemiplegia/i, "umn"],
      ],
    });
  })();

  /* ═══════════════ 2. CEREBELLAR SIGNS AND FUNCTIONS ═══════════════ */
  (function () {
    const CB = "#b39cff";
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">CEREBELLUM · THE SIGNS (SAME SIDE) AND WHAT IT DOES</text>' +
      box(4, 22, 250, 262) + T(129, 36, "SIGNS OF A CEREBELLAR LESION", "sm mut") +
      // drunken gait: reeling figure, wide base, zigzag footprints
      box(10, 42, 118, 76) +
      ps("gait", head(46, 56, 6) + "M46 62 L52 84 M48 70 L30 66 M48 70 L68 62 M52 84 L36 108 M52 84 L70 106", CB, "#5a4a8a", 2) +
      '<path d="M84 108 L96 98 L88 88 L102 78 L92 68 L106 58" stroke="#6f8aa8" stroke-dasharray="3 3" fill="none" pointer-events="none"/>' + T(69, 128, "", "sm") +
      T(116, 114, "drunken gait", "sm", "end") +
      // finger-nose: intention tremor grows near the target, then overshoot
      box(134, 42, 114, 76) +
      '<circle cx="224" cy="62" r="7" fill="#3a2a40" stroke="#8a7aa8" pointer-events="none"/>' + T(224, 50, "nose", "sm mut") +
      ps("itrem", "M142 104 L152 100 L158 104 L166 96 L172 102 L182 90 L188 100 L198 82 L204 96 L212 72", CB, "#5a4a8a", 1.8) +
      ps("dysm", "M212 72 L238 86", "#ff5d7a", "#8a3a50", 2) + T(242, 100, "overshoot", "sm", "end") +
      T(172, 114, "finger–nose test", "sm") +
      // dysdiadochokinesia
      box(10, 124, 118, 74) +
      '<ellipse class="pf" data-p="ddk" cx="46" cy="160" rx="16" ry="22" style="--c:' + CB + ';--r:#3a3060"/>' +
      '<path d="M76 146 A16 16 0 1 1 76 176" stroke="#d9ff43" fill="none" stroke-width="1.6" marker-end="url(#ixArr)" pointer-events="none"/>' + T(98, 164, "↺ ↻ ?", "sm", "start") +
      T(69, 194, "dysdiadochokinesia", "sm") +
      // speech
      box(134, 124, 114, 74) +
      '<path class="pf" data-p="speech" d="M144 136 L238 136 L238 170 L176 170 L164 182 L166 170 L144 170 Z" style="--c:' + CB + ';--r:#3a3060"/>' + T(191, 150, "stac · ca · to", "sm") + T(191, 162, "scan · ning", "sm") +
      T(191, 194, "speech disorder", "sm") +
      // nystagmus
      box(10, 204, 118, 60) +
      '<path class="pf" data-p="nys" d="M28 234 Q69 206 110 234 Q69 262 28 234 Z" style="--c:' + CB + ';--r:#3a3060"/>' + '<circle cx="69" cy="234" r="9" fill="#1b2a3c" pointer-events="none"/>' +
      '<path d="M52 256 L86 256 M52 256 l5 -3 M86 256 l-5 -3" stroke="#d9ff43" fill="none" pointer-events="none"/>' + T(69, 216, "nystagmus", "sm") +
      // pendular knee jerk
      box(134, 204, 114, 60) +
      ps("pend", "M160 214 L160 238 L184 258 M160 238 L150 258 M160 238 L170 260", CB, "#5a4a8a", 2) +
      '<path d="M148 262 Q168 272 190 256" stroke="#d9ff43" fill="none" stroke-dasharray="3 2" pointer-events="none"/>' + T(210, 230, "pendular", "sm") + T(210, 240, "knee jerk", "sm") +
      cell("hypo", 10, 268, 78, 14, ["HYPOtonia"], CB, "#3a3060") + cell("reb", 92, 268, 72, 14, ["rebound"], CB, "#3a3060") + cell("decomp", 168, 268, 82, 14, ["decomposition"], CB, "#3a3060") +
      // functions
      box(260, 22, 256, 262) + T(388, 36, "WHAT A HEALTHY CEREBELLUM DOES", "sm mut") +
      cell("f_stop", 266, 44, 120, 26, ["STOPS a movement at", "the intended point"], "#5ef0a0", "#1e4a36") +
      cell("f_damp", 390, 44, 120, 26, ["DAMPING: prevents", "oscillation"], "#5ef0a0", "#1e4a36") +
      cell("f_time", 266, 74, 120, 26, ["TIMING and", "SEQUENCING"], "#5ef0a0", "#1e4a36") +
      cell("f_plan", 390, 74, 120, 26, ["PLANNING (neo), with", "cortex via pontine nuclei"], "#5ef0a0", "#1e4a36") +
      cell("f_comp", 266, 104, 120, 26, ["SERVO-COMPARATOR:", "command vs feedback"], "#5ef0a0", "#1e4a36") +
      cell("f_eq", 390, 104, 120, 26, ["EQUILIBRIUM (archi,", "flocculonodular)"], "#5ef0a0", "#1e4a36") +
      cell("f_learn", 266, 134, 120, 26, ["prediction and", "motor learning"], "#5ef0a0", "#1e4a36") +
      cell("f_ffi", 390, 134, 120, 26, ["FEEDFORWARD inhibition:", "basket + stellate cells"], "#5ef0a0", "#1e4a36") +
      cell("f_out", 266, 170, 244, 26, ["OUTPUT: Purkinje (GABA) → deep nuclei (dentate)", "→ VL thalamus → motor cortex (never directly)"], "#66e9ff", "#1d3a55") +
      cell("f_ipsi", 266, 200, 244, 26, ["IPSILATERAL: each half controls and receives", "from the SAME side → signs on the lesion side"], "#66e9ff", "#1d3a55") +
      cell("f_notbs", 266, 230, 244, 16, ["not part of the brain stem; not limbic"], "#66e9ff", "#1d3a55") +
      cell("nc", 266, 250, 244, 28, ["NOT cerebellar: RESTING tremor, rigidity, akinesia", "(basal ganglia) · hyperreflexia (UMN)"], BAD, "#4a3020") +
      // ataxia comparison
      '<text class="ttl" x="260" y="302" text-anchor="middle">MOTOR (CEREBELLAR) vs SENSORY ATAXIA</text>' +
      cell("ax_mot", 4, 310, 254, 60, ["MOTOR ataxia = CEREBELLUM", "HAS a speech disorder (scanning), nystagmus,", "hypotonia · drunken, reeling gait", "vision does NOT correct it (Romberg −)"], CB, "#3a3060") +
      cell("ax_sen", 262, 310, 254, 60, ["SENSORY ataxia = DORSAL COLUMNS (tabes)", "NO speech disorder · STAMPING gait", "corrected by VISION, worse in the dark", "(Romberg +)"], "#ffd166", "#4a4030") +
      T(260, 384, "Both have an abnormal gait: the speech disorder and vision tell them apart.", "sm mut");
    A.scene("cbsigns", {
      title: "Cerebellar lesion · the signs, the functions, motor vs sensory ataxia",
      vb: "0 0 520 392",
      svg,
      intro: "Left: the signs you examine for (all on the **same** side as the lesion). Right: what the cerebellum does when healthy. Bottom: how cerebellar ataxia differs from sensory ataxia.",
      parts: {
        gait: ["Drunken (reeling) gait", "Wide-based, staggering **drunken gait**, falling towards the side of the lesion: the typical **neocerebellar** sign. Neurological disease of the cerebellum produces **ataxia**."],
        itrem: ["Intention (kinetic) tremor", "Appears **during movement**, worst as the finger nears the target. **Not** a resting tremor (that is Parkinson's)."],
        dysm: ["Dysmetria (past-pointing)", "The movement **overshoots** its target: the cerebellum's braking (stopping at the intended point) is lost."],
        ddk: ["Dysdiadochokinesia", "Cannot perform rapid **alternating** movements (pronation–supination): the timing is lost."],
        speech: ["Scanning (staccato) speech", "Slow, broken into syllables: a cerebellar **speech disorder** (dysarthria). It is what distinguishes **motor** from sensory ataxia."],
        nys: ["Nystagmus", "Cerebellar (flocculonodular) lesions disturb eye-movement control."],
        pend: ["Pendular knee jerk", "The leg swings to and fro after the tap because tone is low: **pendular**, not brisk, jerks."],
        hypo: ["Hypotonia", "Cerebellar lesions **reduce** tone (the neocerebellum facilitates γ-motor neurons)."],
        reb: ["Rebound phenomenon", "When a resisted limb is suddenly released it flies on: no damping."],
        decomp: ["Decomposition of movement", "A smooth movement is broken into separate parts: a **sign of cerebellar disease**, not one of its normal mechanisms."],
        f_stop: ["Stopping at the intended point", "The cerebellum **stops the movement at the precise intended point** (its loss = dysmetria)."],
        f_damp: ["Damping", "It **prevents oscillation** of movements (its loss = intention tremor, rebound)."],
        f_time: ["Timing and sequencing", "The mechanisms of coordination are **sequencing, damping and timing**."],
        f_plan: ["Planning (neocerebellum)", "The neocerebellum plans and times voluntary movement through its connection with the **cerebral cortex** (corticopontocerebellar path, basilar pontine nuclei, middle peduncle)."],
        f_comp: ["Servo-comparator (paleocerebellum)", "Compares the motor command with the feedback from the moving part and corrects the ongoing movement."],
        f_eq: ["Equilibrium (archicerebellum)", "The oldest part, the **flocculonodular lobe**, connected with the vestibular apparatus."],
        f_learn: ["Prediction and motor learning", "It predicts the position of moving parts and learns motor skills."],
        f_ffi: ["Feedforward inhibition", "Best described in the **cerebellum**: parallel fibres excite Purkinje cells and, through **basket and stellate** cells, inhibit their neighbours."],
        f_out: ["Output to the motor cortex", "Purkinje cells (cortex, GABA) → deep nuclei (dentate) → **VL thalamus → motor cortex**: the cerebellum sends outputs to the motor cortex **indirectly**. Spinocerebellar tracts are **inputs**."],
        f_ipsi: ["Ipsilateral control", "Each cerebellar hemisphere controls and receives inputs from the **ipsilateral** muscles, so the signs are on the **same side** as the lesion, not the opposite."],
        f_notbs: ["Not brain stem", "The cerebellum is **not** part of the brain stem; the limbic system is emotion and memory."],
        nc: ["Not cerebellar signs", "**Resting (static) tremor**, **rigidity** and **akinesia** belong to the basal ganglia (Parkinsonism); **hyperreflexia** is UMN; chorea is striatal."],
        ax_mot: ["Motor (cerebellar) ataxia", "Differs from sensory ataxia by **having a speech disorder** (and nystagmus, hypotonia), and **vision does not compensate** it."],
        ax_sen: ["Sensory ataxia", "Loss of position sense (dorsal columns, **tabes dorsalis**): **stamping** gait, **compensated by vision**, worse in the dark, Romberg positive, **no** speech disorder."],
      },
      al: {
        gait: ["drunken gait", "reeling gait", "ataxia", "ataxic", "cerebellar ataxia"],
        itrem: ["intention tremor", "kinetic tremor", "intentional tremor"],
        dysm: ["dysmetria", "past pointing", "overshoot"],
        ddk: ["dysdiadochokinesia", "adiadochokinesia", "alternating movements"],
        speech: ["staccato speech", "scanning speech", "speech disorder", "speech disorders", "dysarthria", "staccato"],
        nys: ["nystagmus"],
        pend: ["pendular", "pendular knee jerk", "pendular reflexes"],
        hypo: ["cerebellar hypotonia"],
        reb: ["rebound", "rebound phenomenon"],
        decomp: ["decomposition", "decomposition of movements", "decomposition of movement"],
        f_stop: ["stops the movement", "precise intended point", "intended point"],
        f_damp: ["damping", "damping of movements", "prevents oscillation", "oscillation"],
        f_time: ["timing", "timing of movements", "sequencing", "sequencing of movements", "liming of movements"],
        f_plan: ["planning function", "planning of movements", "basilar pontine nuclei", "pontine nuclei"],
        f_comp: ["servo", "servo correction", "servocomparator", "comparator"],
        f_eq: ["equilibrium disorder"],
        f_learn: ["motor learning", "prediction"],
        f_ffi: ["feedforward inhibition", "feed forward inhibition", "basket cells", "stellate cells"],
        f_out: ["sends outputs to the motor cortex", "outputs to the motor cortex", "output to the motor cortex", "vl thalamus"],
        f_ipsi: ["ipsilateral muscles", "symptoms on the opposite side", "inputs from ipsilateral"],
        f_notbs: ["part of the brain stem", "limbic system"],
        nc: ["tremors at rest", "tremor at rest", "static tremor", "resting tremor", "hyperflexia"],
        ax_mot: ["motor ataxia"],
        ax_sen: ["sensory ataxia", "compensated by vision", "compensated for equilibrium disorder by vision", "romberg", "romberg s sign", "worse in the dark"],
      },
      drill: ["gait", "itrem", "dysm", "ddk", "speech", "nys", "pend", "decomp", "f_stop", "f_damp", "f_time", "f_ffi", "f_out", "f_ipsi", "ax_mot", "ax_sen"],
      sims: [
        { id: "signs", label: "Signs", on: ["gait", "itrem", "dysm", "ddk", "speech", "nys", "pend", "hypo", "reb", "decomp"], info: "**Ataxia** (drunken gait), **intention tremor**, **dysmetria**, **dysdiadochokinesia**, rebound, **decomposition**, **hypotonia** with pendular jerks, **nystagmus**, **scanning speech**: all on the **same** side." },
        { id: "funcs", label: "Functions", on: ["f_stop", "f_damp", "f_time", "f_plan", "f_comp", "f_eq", "f_learn", "f_ffi", "f_out"], info: "Stops movement on target, **damps** oscillation, **times and sequences**, plans (neo), compares command with feedback (paleo), equilibrium (archi); output via dentate → **VL thalamus** → motor cortex." },
        { id: "ataxia", label: "Motor vs sensory ataxia", on: ["ax_mot", "ax_sen", "speech", "gait"], info: "Motor (cerebellar) ataxia **has a speech disorder** and is **not** corrected by vision; sensory ataxia (tabes) has a **stamping** gait and **is** corrected by vision (Romberg +)." },
        { id: "not", label: "Not cerebellar", on: ["nc"], lost: ["itrem"], info: "**Resting** tremor, rigidity, akinesia = basal ganglia; hyperreflexia = UMN." },
      ],
      secs: { "ph-cerebellum#2": "signs", "ph-cerebellum#1": "funcs" },
      rules: [
        [/motor ataxia|sensory ataxia/i, "ataxia"],
        [/drunken gait|dysmetria|dysdiadochokinesia|intention tremor|staccato|scanning speech|ataxia/i, "signs"],
        [/damping|sequencing|feedforward inhibition|stops the movement|functions of the cerebellum/i, "funcs"],
      ],
    });
  })();

  /* ═══════════════ 3. BASAL GANGLIA DISORDERS AND THE FIVE GAITS ═══════════════ */
  (function () {
    const PK = "#ff9f43",
      HK = "#ff5d7a";
    const gaitFig = (id, x, lab, sub, d, c) =>
      box(x, 286, 100, 96) + ps(id, d, c, "#5a4a3a", 2) + T(x + 50, 364, lab, "sm") + T(x + 50, 376, sub, "sm mut");
    const svg = () =>
      '<text class="ttl" x="260" y="14" text-anchor="middle">BASAL GANGLIA DISORDERS · AND THE GAITS THAT GIVE THEM AWAY</text>' +
      // mini coronal map
      box(4, 22, 196, 184) + T(102, 36, "WHICH NUCLEUS → WHICH DISORDER", "sm mut") +
      '<path class="pf" data-p="n_cd" d="M40 56 C40 44 70 42 76 54 C80 66 64 72 58 84 C54 94 44 92 42 82 Z" style="--c:' + HK + ';--r:#5a3040"/>' + T(30, 66, "caudate", "sm", "end") +
      '<path class="pf" data-p="n_pu" d="M92 70 C112 64 124 84 120 106 C116 124 96 128 88 114 C82 100 82 80 92 70 Z" style="--c:' + HK + ';--r:#5a3040"/>' + T(104, 138, "putamen", "sm") +
      '<path class="pf" data-p="n_gp" d="M74 88 C82 84 88 96 86 108 C84 118 74 120 70 112 C66 102 68 92 74 88 Z" style="--c:#b39cff;--r:#3a3060"/>' + T(46, 112, "globus", "sm", "end") + T(46, 122, "pallidus", "sm", "end") +
      '<path class="pf" data-p="n_th" d="M140 64 C160 60 176 72 174 90 C172 104 152 108 142 96 C134 86 132 70 140 64 Z" style="--c:#6f8aa8;--r:#24384f"/>' + T(158, 118, "thalamus", "sm") +
      '<ellipse class="pf" data-p="n_stn" cx="128" cy="148" rx="16" ry="7" style="--c:#66e9ff;--r:#24384f"/>' + T(128, 164, "subthalamic", "sm") +
      '<path class="pf" data-p="n_sn" d="M92 170 C110 160 150 162 168 176 C150 182 112 184 92 170 Z" style="--c:' + PK + ';--r:#5a3a20"/>' + T(130, 196, "substantia nigra", "sm") +
      T(30, 150, "CHOREA:", "sm", "start") + T(30, 160, "striatum", "sm mut", "start") +
      // Parkinsonism
      box(206, 22, 310, 136) + T(361, 36, "PARKINSONISM: dopamine neurons of the SN (pars compacta) lost", "sm mut") +
      cell("pk_trem", 212, 44, 148, 26, ["RESTING tremor (pill-rolling),", "goes with movement"], PK, "#4a3020") +
      cell("pk_rig", 364, 44, 148, 26, ["RIGIDITY: lead-pipe / cogwheel,", "antigravity muscles"], PK, "#4a3020") +
      cell("pk_aki", 212, 74, 148, 26, ["AKINESIA / bradykinesia,", "mask-like face"], PK, "#4a3020") +
      cell("pk_sp", 364, 74, 148, 26, ["slow, MONOTONOUS", "speech"], PK, "#4a3020") +
      cell("pk_gait", 212, 104, 148, 26, ["SHUFFLING (festinant) gait,", "flexed posture"], PK, "#4a3020") +
      cell("pk_ref", 364, 104, 148, 26, ["reflexes NORMAL,", "no paralysis"], PK, "#4a3020") +
      cell("pk_da", 212, 134, 300, 18, ["cause: the nigrostriatal DOPAMINE pathway is lost"], PK, "#4a3020") +
      // hyperkinetic
      box(206, 162, 310, 120) + T(361, 176, "HYPERKINETIC DISORDERS", "sm mut") +
      cell("hd", 212, 182, 300, 38, ["HUNTINGTON CHOREA: GABA (+ ACh) neurons of the caudate", "and putamen lost → quick, jerky, dance-like movements,", "HYPOtonia, pendular jerks; dementia, depression"], HK, "#5a3040") +
      cell("ath", 212, 224, 148, 26, ["ATHETOSIS: slow, writhing", "hands → globus pallidus"], "#b39cff", "#3a3060") +
      cell("hb", 364, 224, 148, 26, ["HEMIBALLISMUS: violent flinging,", "OPPOSITE limbs → subthalamic"], "#66e9ff", "#24384f") +
      cell("tx", 212, 254, 300, 22, ["transmitters: GABA, dopamine, glutamate, ACh (not glycine)"], "#5ef0a0", "#1e4a36") +
      cell("trem", 4, 212, 196, 66, ["TWO TREMORS", "at REST (static) = Parkinson", "goes away with movement", "INTENTION (kinetic) = cerebellum", "worse near the target"], "#d9ff43", "#3a4a20") +
      // the five gaits
      gaitFig("g_drunk", 4, "DRUNKEN", "cerebellum", head(40, 300, 5) + "M40 305 L46 326 M44 312 L26 308 M44 312 L62 304 M46 326 L30 350 M46 326 L64 348", "#b39cff") +
      gaitFig("g_shuf", 108, "SHUFFLING", "Parkinson", head(150, 302, 5) + "M150 307 L160 328 M154 314 L166 322 M160 328 L152 350 M160 328 L166 350 M150 352 L170 352", PK) +
      gaitFig("g_stamp", 212, "STAMPING", "sensory ataxia", head(262, 300, 5) + "M262 305 L262 328 M262 312 L248 322 M262 312 L276 322 M262 328 L254 350 M262 328 L272 338 L270 350 M252 354 L256 350", "#ffd166") +
      gaitFig("g_step", 316, "HIGH-STEPPAGE", "foot drop", head(362, 300, 5) + "M362 305 L362 328 M362 312 L350 322 M362 312 L374 322 M362 328 L358 352 M362 328 L378 336 L380 350", "#5ef0a0") +
      gaitFig("g_circ", 420, "CIRCUMDUCTION", "spastic hemiplegia", head(462, 300, 5) + "M462 305 L462 328 M462 312 L452 324 M462 312 L472 318 L468 326 M462 328 L458 352 M462 328 L480 350 M458 352 Q490 344 480 350", UMN);
    A.scene("bgsigns", {
      title: "Basal ganglia disorders · Parkinsonism, chorea, athetosis, hemiballismus, and the five gaits",
      vb: "0 0 520 388",
      svg,
      intro: "Top-left: each nucleus and the disorder its damage causes. Right: **Parkinsonism** and the **hyperkinetic** disorders. Bottom: the five gaits.",
      parts: {
        n_cd: ["Caudate nucleus (striatum)", "With the putamen forms the striatum: loss of its **GABA (and ACh)** neurons → **chorea** (Huntington)."],
        n_pu: ["Putamen (striatum)", "Striatal input nucleus: **chorea** when its GABA neurons are lost."],
        n_gp: ["Globus pallidus", "Its dysfunction → **athetosis** (slow, writhing movements of the hands)."],
        n_th: ["Thalamus (VA, VL)", "Basal-ganglia output (GPi / SNr, **GABA**) goes **directly to the VA/VL thalamus**, not to the cortex or the LMNs."],
        n_stn: ["Subthalamic nucleus", "Lesion → **hemiballismus** of the **opposite** limbs. It excites the GPi with **glutamate**."],
        n_sn: ["Substantia nigra", "Its **pars compacta dopamine** neurons degenerate in **Parkinsonism**. Chorea is **not** a substantia-nigra lesion."],
        pk_trem: ["Resting (static) tremor", "Pill-rolling tremor **at rest** that disappears with movement: Parkinsonian, **not** cerebellar."],
        pk_rig: ["Rigidity", "**Lead-pipe**, or **cogwheel** when combined with the tremor; a hypertonia mainly of the **antigravity** muscles. Not a pyramidal sign."],
        pk_aki: ["Akinesia / bradykinesia", "Poverty and slowness of movement with a **mask-like** face: Parkinsonian, not cerebellar."],
        pk_sp: ["Slow monotonous speech", "Parkinsonian speech; **staccato** speech is cerebellar."],
        pk_gait: ["Shuffling (festinant) gait", "Short hurried steps with a flexed posture: Parkinson's disease (not tabes, not cerebellar)."],
        pk_ref: ["Reflexes normal, no paralysis", "Parkinsonism has normal reflexes and no paralysis; hypotonia is not a feature."],
        pk_da: ["Cause of Parkinsonism", "Degeneration of the **dopaminergic** neurons of the substantia nigra: the **nigrostriatal** pathway is lost."],
        hd: ["Huntington's disease (chorea)", "Loss of the intrastriatal **GABAergic and cholinergic** neurons of the **caudate and putamen** → quick, jerky, dance-like involuntary movements with **hypotonia** and pendular (hung) reflexes, plus dementia, depression and irritability (autosomal dominant, CAG repeats)."],
        ath: ["Athetosis", "Slow, writhing movements of the hands: **globus pallidus**."],
        hb: ["Hemiballismus", "Violent flinging of the **opposite** limbs: **subthalamic nucleus** (not cerebellar)."],
        tx: ["Basal-ganglia transmitters", "**GABA, dopamine, glutamate, acetylcholine**. **Glycine is not** one of them (a spinal cord transmitter)."],
        trem: ["Two kinds of tremor", "Tremor **at rest** = Parkinsonism (basal ganglia). **Intention (kinetic)** tremor = cerebellum."],
        g_drunk: ["Drunken (reeling) gait", "Cerebellar (neocerebellar) lesion."],
        g_shuf: ["Shuffling gait", "Parkinson's disease."],
        g_stamp: ["Stamping gait", "**Sensory ataxia** (tabes dorsalis, dorsal columns): watches the feet, worse in the dark."],
        g_step: ["High-steppage gait", "Foot drop (common peroneal nerve, LMN)."],
        g_circ: ["Circumduction gait", "Spastic hemiplegia (UMN): the stiff leg swings outward."],
      },
      al: {
        n_cd: ["caudate", "caudate nucleus", "caudate nucleus and putamen", "striatum", "intrastriatal"],
        n_gp: ["globus pallidus"],
        n_stn: ["subthalamic", "subthalamic nucleus"],
        n_sn: ["substantia nigra", "pars compacta"],
        pk_trem: ["tremors at rest", "tremor at rest", "resting tremor", "static tremor", "pill rolling"],
        pk_rig: ["rigidity", "lead pipe", "cogwheel rigidity"],
        pk_aki: ["akinesia", "bradykinesia", "mask face", "mask like"],
        pk_sp: ["monotonous speech"],
        pk_gait: ["shuffling", "festinant"],
        pk_da: ["parkinson", "parkinsonism", "parkinson s disease", "parkinsons disease", "dopaminergic", "nigrostriatal", "l dopa"],
        hd: ["huntington", "huntington s disease", "chorea", "choreiform", "gabaergic and cholinergic", "gaba neurons", "cholinergic system", "dementia"],
        ath: ["athetosis", "writhing"],
        hb: ["hemiballismus", "ballismus"],
        tx: ["transmitters of the basal ganglia", "neurotransmitters of basal ganglia"],
        g_drunk: ["drunken gait"],
        g_shuf: ["shuffling gait"],
        g_stamp: ["stamping gait", "stamping"],
        g_step: ["high steppage", "steppage", "foot drop"],
        g_circ: ["circumduction"],
      },
      drill: ["n_sn", "n_cd", "n_gp", "n_stn", "pk_trem", "pk_rig", "pk_aki", "pk_gait", "hd", "ath", "hb", "tx", "g_drunk", "g_shuf", "g_stamp"],
      sims: [
        { id: "pd", label: "Parkinsonism", on: ["n_sn", "pk_trem", "pk_rig", "pk_aki", "pk_sp", "pk_gait", "pk_ref", "pk_da", "g_shuf"], info: "**Substantia nigra** dopamine loss → **resting tremor**, **rigidity** (lead-pipe/cogwheel), **akinesia**, mask face, **shuffling gait**; reflexes normal." },
        { id: "hyper", label: "Chorea, athetosis, ballismus", on: ["n_cd", "n_pu", "n_gp", "n_stn", "hd", "ath", "hb"], info: "Striatum (caudate + putamen) = **chorea**; globus pallidus = **athetosis**; subthalamic = **hemiballismus**." },
        { id: "gaits", label: "The five gaits", on: ["g_drunk", "g_shuf", "g_stamp", "g_step", "g_circ"], info: "**Drunken** = cerebellum; **shuffling** = Parkinson; **stamping** = sensory ataxia; **high-steppage** = foot drop; **circumduction** = spastic hemiplegia." },
      ],
      secs: { "ph-basal-ganglia#1": "pd", "ph-basal-ganglia#2": "hyper" },
      rules: [
        [/huntington|chorea|athetosis|ballism/i, "hyper"],
        [/parkinson|shuffling|akinesia|rigidity/i, "pd"],
        [/gait/i, "gaits"],
      ],
    });
  })();
})();
