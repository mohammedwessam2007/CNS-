/* INTELLECTUALITY v16.2 · PAST-PAPER ITEMS MISSING FROM THE BANK
 * 1) The real NEU-205 end-of-module exam of 28 Nov 2024 (batch 197; 115 MCQs), read from the owner's
 * answered copy: 107 of its MCQs were already in the bank (keys checked; see docs/V16_2_RECEIPT.md). These are the 8 it lacked,
 * worded exactly as printed, keyed as the answer sheet marked them. They are PRACTICE items (taught in the
 * notes, scheduled in the day's rounds); the sealed held-out mock is unchanged.
 * 2) Two department histology self-assessments: nervous tissue (with the department's 2025 model
 *    answers) and CNS/eye/ear (no printed key: the standard answer). Items that would repeat a held-out
 *    mock item, or that the bank already has, are left out so the mock stays unseen.
 * 3) The department histology book's CNS-levels figure matching (45 labels, model answers) and the Nov 2024
 *    paper's own Section B figure (5 labels, as the answered copy marks them), only on a
 *    device that holds the owner's drawings key (the figure is private).
 * Loaded right after the bank (before any layer reads it), so every layer sees them as ordinary items.
 */
(function () {
  const QB = window.EHSAN_QBANK;
  if (!QB || !Array.isArray(QB.questions)) return;
  const base = { group: "MCQ", sourceTag: "197 EOM", authority: ["HISTORICAL_TAG"], sourceWeight: 1.12, split: "practice", sourceFile: "NEU 205 EOM 197_answers.pdf", autoScore: true, requiresVisual: false, visualData: null, provenance: "OWNER_UPLOAD_EOM_197_ANSWERED" };
  const L = {
    SUB: { subject: "ANATOMY", chapter: "Submandibular region", lessonIds: ["T065", "T066"], unlockDay: 32, courseTopic: "Submandibular region I", dimension: "spatial", failureType: "spatial" },
    AREA: { subject: "ANATOMY", chapter: "Sulci & gyri", lessonIds: ["T013"], unlockDay: 4, courseTopic: "Cerebral hemispheres: surfaces, sulci and gyri", dimension: "transfer", failureType: "transfer" },
    POOL: { subject: "PHYSIOLOGY", chapter: "Properties and factors affecting synaptic transmission", lessonIds: ["T006"], unlockDay: 2, courseTopic: "Synaptic potentials and transmission", dimension: "discrimination", failureType: "discrimination" },
    NT: { subject: "HISTOLOGY", chapter: "Nervous Tissue", group: "Department", lessonIds: ["T004", "T005", "T011"], unlockDay: 1, courseTopic: "Neurons and synapses", dimension: "discrimination", failureType: "discrimination" },
    CNS: { subject: "HISTOLOGY", chapter: "Central Nervous System", group: "Department", lessonIds: ["T028"], unlockDay: 11, courseTopic: "Cerebrum, meninges and blood-brain barrier", dimension: "discrimination", failureType: "discrimination" },
    EYE: { subject: "HISTOLOGY", chapter: "Eye", group: "Department", lessonIds: ["T045", "T053", "T067", "T068"], unlockDay: 22, courseTopic: "Cornea and sclera", dimension: "discrimination", failureType: "discrimination" },
  };
  // department self-assessments: the nervous-tissue one has the department's model answers (2025); the
  // CNS/eye/ear one has no printed key, so its key is the standard answer (written in each explanation)
  const SA = { sourceTag: "Department self-assessment", authority: ["DEPARTMENT"], sourceWeight: 1.25, sourceFile: "Histology — Practical Slides.pdf", provenance: "OWNER_UPLOAD_DEPT_SELF_ASSESSMENT" };
  const FA = { sourceTag: "Department formative", authority: ["DEPARTMENT"], sourceWeight: 1.2, sourceFile: "Histology Formative Assessment 2.pdf", provenance: "OWNER_UPLOAD_DEPT_FORMATIVE" };
  const ITEMS = [
    ["ANAT", 24, "SUB", "Which triangle of the neck lies between the anterior bellies of digastric muscles?", ["Occipital.", "Posterior.", "Muscular.", "Submental."], "d"],
    ["ANAT", 34, "AREA", "A 45-year-old man is presented to the clinic complaining of loss of general sensation on one side. Which of the following areas is most likely affected?", ["Area 3, 1, 2", "Area 22", "Area 17", "Areas 18, 19"], "a"],
    ["ANAT", 35, "AREA", "A 55-year-old man is admitted to the emergency department with incontinence of urine and stool. Which of the following areas is most likely affected?", ["Cuneus", "Paracentral lobule", "Premotor area", "Parietal association area"], "b"],
    ["ANAT", 36, "AREA", "A 67-year-old man is presented to the clinic complaining of inability to talk. Which of the following areas is most likely affected?", ["Primary olfactory area", "Broca's area", "Premotor area", "Prefrontal area"], "b"],
    ["ANAT", 37, "AREA", "A 72-year-old man is presented to the clinic complaining that he cannot discriminate the colors. Which of the following areas is most likely affected?", ["Area 3, 1, 2", "Area 17", "Areas 41, 42", "Areas 18, 19"], "d"],
    ["ANAT", 38, "AREA", "A 54-year-old woman working as a tailor presents to the clinic complaining that she has not been able to do her work for a few weeks. Which of the following areas is most likely affected?", ["Areas 40, 39", "Area 28", "Motor area 4", "Areas 41, 42"], "c"],
    ["PHYS", 58, "POOL", "Convergence in a neuronal pool", ["Is the state when one neuron stimulates many neurons", "Helps in the distribution of signals", "Helps in the selection of important signals and ignoring unimportant ones", "Involves temporal summation of a weak input fiber along sensory pathways"], "c"],
    ["PHYS", 59, "POOL", "Facilitation", ["Is due to stimulation of 2 input neurons away from each other.", "Is due to stimulation of 2 input neurons close to each other.", "Number of action potentials released is less than if each input neuron is stimulated alone.", "Occurs when the two afferent neurons have a common discharge zone."], "a"],
  ];
  const SELF = [
    ["SA", 1, "NT", "Muscle spindles", ["Are more numerous in antigravity muscles.", "The efferent sensory nerves envelope the intrafusal fibres.", "The striated portion is innervated by afferent motor fibres.", "Muscle fibres are perpendicular in orientation."], "a"],
    ["SA", 2, "NT", "In Wallerian degeneration", ["Nucleus migrates to a peripheral position.", "Chromatolysis occurs.", "Myelin sheath shows widening of nodes of Ranvier.", "Schwann cells decrease in number."], "c"],
    ["SA", 4, "NT", "Sympathetic ganglia are characterized by one of the following", ["Cells are stellate multipolar.", "Many satellite cells.", "No synapse between cells.", "Cells are separated by myelinated nerve fibres."], "a"],
    ["SA", 5, "NT", "The largest neuroglia cells", ["Are also called mesoglia cells.", "Share in the formation of the blood brain barrier.", "Are concerned with myelin production.", "Are mesodermal in origin."], "b"],
    ["SA", 8, "NT", "Which of the following is true regarding oligodendrocytes", ["Satellite oligodendrocytes support nerve cells.", "They have no centrioles.", "Endodermal in origin.", "Interfascicular oligodendrocytes are present in grey matter."], "a"],
    ["SA", 10, "NT", "Regarding the chemical synapses, the following statement is true", ["Less common type than electrical synapse.", "Axon terminal is rich in mitochondria & synaptic vesicles of transmitter.", "Synaptic cleft is 2-3 nm in width, through which ions must cross.", "Contains gap junctions between cells for conduction of neurotransmitters."], "b"],
    ["FA", 1, "CNS", "The 2nd order neuron for conscious proprioceptive sensation from the upper half of the body is", ["Gracile nucleus", "Cuneate nucleus", "Substantia Gelatinosa of Rolandi nucleus", "Main sensory nucleus"], "b"],
    ["FA", 2, "CNS", "One of the long sensory tracts to the subcortical levels is", ["Ventral spinothalamic tract", "Lateral spinothalamic tract", "Cuneate tract", "Spinoolivary tract"], "d"],
    ["FA", 4, "CNS", "The lateral corticobulbar tract terminates in", ["The 3rd cranial nerve nucleus", "The 4th cranial nerve nucleus", "The 5th cranial nerve nucleus", "The 6th cranial nerve nucleus"], "c"],
    ["FA", 5, "CNS", "Purkinje cells are stimulated by", ["Basket cells", "Stellate cells", "Golgi cells", "Granular cells"], "d"],
    ["FA", 6, "EYE", "Retinal pigment epithelium is characterized by", ["Presence of photoreceptors", "Phagocytosis of worn out part of photoreceptor cells", "Presence of amacrine cells", "Synthesis of vitreous humor"], "b"],
    ["FA", 7, "EYE", "In reference to the iris", ["Fibroblasts and melanocytes cover the posterior surface", "Pigmented epithelium covers the anterior surface", "Its stroma contains pupillae smooth muscle.", "It is the posterior part of the vascular coat"], "c"],
    ["FA", 8, "EYE", "Success of corneal transplantation is usually explained by", ["Cornea is transparent", "Cornea is avascular", "Excess collagen fibrils", "Regular arrangement of collagen"], "b"],
  ];
  const have = new Set(QB.questions.map((q) => q.id));
  const push = (id, n, stem, opts, key, ...meta) => {
    if (have.has(id)) return;
    const options = opts.map((text, i) => ({ key: "abcdefg"[i], text }));
    QB.questions.push(Object.assign({ id, number: n, page: 0, stem, options, answerKeys: [key], answerText: options.find((o) => o.key === key).text }, base, ...meta));
  };
  for (const [subj, n, lk, stem, opts, key] of ITEMS) push("DEPT-EOM197-" + subj + "-MCQ-" + n, n, stem, opts, key, L[lk]);
  for (const [src, n, lk, stem, opts, key] of SELF) push("DEPT-" + src + "-HIST-MCQ-" + n, n, stem, opts, key, L[lk], src === "SA" ? SA : FA);

  /* 3) CNS LEVELS: the department histology book's 9 figure-matching exercises (spinal cord → midbrain),
   *    5 labels each, keyed by the book's model answer. The figure is a department drawing, shipped
   *    encrypted, so these items exist only on a device that holds the owner's drawings key; the
   *    drawings layer (dept-figs-v16.js) shows the figure above the question. */
  const LEVELS = [
    [1, "spinal cord", ["Originates from Clark's nucleus", "Second order neuron for pain & temperature.", "Completes the reflex arc.", "Forms the ventral tegmental decussation.", "Originates from main sensory nucleus.", "Forms the dorsal tegmental decussation.", "Second order neuron for fine touch."], "cbaed",
      ["the comma tract (descending fibres in the posterior column)", "the substantia gelatinosa of Rolando", "the dorsal spinocerebellar tract", "the ventral spinothalamic tract", "the rubrospinal tract"],
      { f: "That is the tectospinal tract, which is not labelled here.", g: "Second-order neurons for fine touch are the gracile and cuneate nuclei of the medulla, not in the cord." }],
    [2, "spinal cord", ["Arises from red nucleus.", "Controls the voluntary movements.", "Continues as spinal lemniscus.", "Gives rise to ventral spinothalamic tract.", "Gives rise to lateral spinothalamic tract.", "Descending fibers from cuneate tract.", "Arises from reticular formation."], "fdcgb",
      ["the comma tract (descending fibres from the cuneate tract)", "the main sensory nucleus", "the lateral spinothalamic tract", "the reticulospinal tract", "the lateral corticospinal (pyramidal) tract"],
      { a: "That is the rubrospinal tract, which is not labelled here.", e: "That is the substantia gelatinosa of Rolando, which is not labelled here." }],
    [3, "spinal cord", ["Second order neuron for unconscious proprioception from same & opposite sides of the lower limb.", "First order neuron for pain & temperature.", "Second order neuron for unconscious proprioception from same side of the body.", "Arises from lateral vestibular nucleus.", "Arises from medial vestibular nucleus.", "Second order neuron for pain & temperature.", "Continuation of medial longitudinal bundle."], "bdgac",
      ["Lissauer's tract (the dorsolateral fasciculus)", "the lateral vestibulospinal tract", "the sulcomarginal tract", "the ventral spinocerebellar tract", "Clark's nucleus"],
      { e: "Medial vestibulospinal fibres run inside the medial longitudinal bundle; the department names label 3 by the bundle itself (g).", f: "That is the substantia gelatinosa / lateral spinothalamic tract, which is not labelled here." }],
    [4, "spinal cord", ["Completes the reflex arc.", "Continuation of the medial longitudinal bundle.", "Second order neuron for crude touch.", "Part of the corticobulbar tract.", "Part of the corticospinal tract.", "Arises from the reticular formation.", "Second order neuron for pain & temperature."], "feacg",
      ["the reticulospinal tract", "the lateral corticospinal tract", "the septomarginal (oval) tract", "the main sensory nucleus", "the lateral spinothalamic tract"],
      { b: "That is the sulcomarginal tract, which is not labelled here.", d: "Corticobulbar fibres end in the brainstem; they are not in the spinal cord." }],
    [5, "medulla, motor decussation", ["Continues as septomarginal tract.", "Originates from upper two-thirds of area 4.", "Originates from lower one-third of area 4.", "Forms the ventral tegmental decussation.", "Continues as sulcomarginal tract.", "2nd order neuron for proprioception to subcortical level.", "Second order neuron for proprioception to cerebral cortex."], "gfedb",
      ["the gracile nucleus", "the dorsal spinocerebellar tract", "the medial longitudinal bundle", "the rubrospinal tract", "the pyramidal (corticospinal) fibres crossing in the motor decussation"],
      { a: "It is not the answer for any label in this figure (department key).", c: "Fibres from the lower third of area 4 are corticobulbar; they end in the brainstem nuclei and do not cross in the motor decussation." }],
    [6, "medulla, sensory decussation", ["2nd order neuron for unconscious proprioception.", "Nucleus of hypoglossal nerve.", "Nucleus of vagus nerve.", "Second order neuron for fine touch.", "Forms the sensory decussation.", "Axons join trigeminal lemniscus.", "Forms the motor decussation."], "efadb",
      ["the internal arcuate fibres", "the spinal nucleus of the trigeminal", "the dorsal spinocerebellar tract", "the medial lemniscus (axons of the 2nd-order neurons for fine touch)", "the hypoglossal nucleus"],
      { c: "The dorsal nucleus of the vagus is not labelled here.", g: "The motor decussation is at a lower level of the closed medulla, below this section." }],
    [7, "pons", ["Separates the pyramidal tract bundles.", "First order neuron for crude touch.", "Ends in VPMN of the thalamus.", "Continues as septomarginal tract.", "Continues as sulcomarginal tract.", "First order neuron for fine touch from the face.", "Ends in VPLN of the thalamus."], "cgeda",
      ["the trigeminal lemniscus", "the medial lemniscus", "the medial longitudinal bundle", "the bundle the department keys as continuing as the septomarginal tract", "the transverse pontine fibres"],
      { b: "It is not the answer for any label in this figure (department key).", f: "First-order fibres for fine touch from the face end in the main sensory nucleus of the trigeminal, which is not labelled here." }],
    [8, "midbrain, inferior colliculus", ["Medial lemniscus.", "Center for auditory reflexes.", "Originates from upper two-thirds of area 4.", "Lateral lemniscus.", "Nucleus of occulomotor nerve.", "Decussation of superior Cerebellar peduncles.", "Nucleus of trochlear nerve."], "fgbdc",
      ["the decussation of the superior cerebellar peduncles", "the trochlear nucleus", "the inferior colliculus", "the lateral lemniscus", "the crus cerebri (pyramidal fibres)"],
      { a: "The medial lemniscus is not labelled here.", e: "The oculomotor nucleus is at the superior colliculus level, not this inferior-colliculus level." }],
    [9, "midbrain, superior colliculus", ["Trigeminal lemniscus.", "Center for visual reflexes.", "Medial lemniscus.", "Decussation of rubrospinal tracts.", "Decussation of tectospinal tracts.", "Red nucleus.", "Oculomotor nucleus."], "efgbc",
      ["the dorsal tegmental decussation", "the red nucleus", "the oculomotor nucleus", "the superior colliculus", "the medial lemniscus"],
      { a: "The trigeminal lemniscus is not labelled here.", d: "The rubrospinal tracts cross in the ventral tegmental decussation, the lower cross; label 1 is the upper (dorsal) one." }],
    [10, "spinal cord (Nov 2024 exam, Section B, figure C)", ["Sulcomarginal tract (T.)", "Lissauer's tract", "Lateral reticulo-spinal T.", "MSN", "SGR", "Gracile tract", "Lateral vestibulo-spinal T."], "fdagb",
      ["the gracile tract", "the main sensory nucleus (MSN)", "the sulcomarginal tract", "the lateral vestibulospinal tract", "Lissauer's tract"],
      { c: "The lateral reticulospinal tract is not labelled here.", e: "The substantia gelatinosa (SGR) caps the posterior horn, just deep to Lissauer's tract (label 5); it is not labelled here." },
      { sourceTag: "197 EOM (Section B)", authority: ["HISTORICAL_TAG"], sourceWeight: 1.12, sourceFile: "NEU 205 EOM 197_answers.pdf", provenance: "OWNER_UPLOAD_EOM_197_ANSWERED" }],
  ];
  const LV = { subject: "HISTOLOGY", chapter: "Central Nervous System", group: "Department", lessonIds: ["T028"], unlockDay: 11, courseTopic: "Cerebrum, meninges and blood-brain barrier", dimension: "spatial", failureType: "spatial", sourceTag: "Department book: CNS levels", authority: ["DEPARTMENT"], sourceWeight: 1.25, sourceFile: "HISTOLOGY MCQ 2nd Year.pdf", provenance: "OWNER_UPLOAD_DEPT_HIST_BOOK" };
  const hasDrawingsKey = (() => {
    try {
      return !!JSON.parse(localStorage.getItem("intellectuality_dept_keys_v1") || "{}").k1;
    } catch (_) {
      return false;
    }
  })();
  // where to find it, for the labels whose answer is just the structure's name
  const CLUE = {
    65: "the motor nucleus beside the midline, just in front of the central canal at this level",
    81: "the fibres crossing in the midline of the tegmentum at the inferior-colliculus level, on their way to the red nucleus and thalamus",
    82: "the small nucleus beside the midline, in front of the aqueduct, at the inferior-colliculus level",
    84: "the auditory bundle at the lateral edge of the tegmentum, climbing to the inferior colliculus",
    92: "the large round nucleus in the tegmentum at the superior-colliculus level; its fibres cross in the ventral tegmental decussation",
    93: "the nucleus beside the midline, in front of the aqueduct, at the superior-colliculus level",
    95: "the sensory band lateral to the red nucleus, heading for the thalamus (VPLN)",
    101: "the medial part of the posterior column: fine touch and conscious proprioception from the lower half of the body, same side, up to the gracile nucleus",
    102: "the nucleus in the head of the posterior horn (nucleus proprius): the 2nd-order neuron for crude touch, giving the ventral spinothalamic tract",
    103: "the bundle beside the anterior median fissure, the continuation of the medial longitudinal bundle",
    104: "the bundle at the anterolateral edge of the cord, from the lateral vestibular nucleus of the same side",
    105: "the dorsolateral fasciculus capping the tip of the posterior horn: 1st-order pain and temperature fibres",
  };
  const XL = {};
  for (const [n, lvl, opts, keys, who, other, meta] of LEVELS)
    for (let k = 1; k <= 5; k++) {
      const key = keys[k - 1],
        num = n * 10 + k,
        rows = ["Label " + k + " is **" + who[k - 1] + "**: " + (CLUE[num] || opts["abcdefg".indexOf(key)].replace(/\.$/, "")) + (meta ? ". This is the answer marked on the owner's answered copy of the paper." : ". This is the department's model answer.")];
      for (const L of "abcdefg") {
        if (L === key) continue;
        const j = keys.indexOf(L);
        rows.push(L + ": " + (j >= 0 ? "That is label " + (j + 1) + ", " + who[j] + "." : other[L]));
      }
      XL[num] = rows;
      if (!hasDrawingsKey) continue;
      const id = "DEPT-LEVELS-HIST-MCQ-" + num;
      if (have.has(id)) continue;
      const options = opts.map((text, i) => ({ key: "abcdefg"[i], text }));
      QB.questions.push(Object.assign({ id, number: num, page: 0, stem: "CNS level " + n + " · " + lvl + ". In the department drawing above, label " + k + " is", options, answerKeys: [key], answerText: options.find((o) => o.key === key).text }, base, LV, meta || {}));
    }

  /* 4) The department histology book's own problem-solving (B) and matching (C) sections, with its answer
   *    tables (its MCQ sections are already the bank's "Department" histology items; all 106 keys agree).
   *    Rows that would repeat a sealed-mock question are left out, and are never named in explanations. */
  L.EAR = { subject: "HISTOLOGY", chapter: "Ear", group: "Department", lessonIds: ["T031", "T040", "T078"], unlockDay: 12, courseTopic: "External and middle ear", dimension: "discrimination", failureType: "discrimination" };
  const BK = { sourceTag: "Department book", authority: ["DEPARTMENT"], sourceWeight: 1.25, sourceFile: "HISTOLOGY MCQ 2nd Year.pdf", provenance: "OWNER_UPLOAD_DEPT_HIST_BOOK" };
  const CHN = { NT: "nervous tissue", CNS: "CNS", EYE: "eye", EAR: "ear" };
  const MISPRINT = " The book's printed answer row for these five CNS problems does not fit them (it looks shifted); this is the standard answer.";
  const BOOKPS = [
    ["NT", 1, "A 9-year-old child was diagnosed as having an occipital brain tumor. A biopsy of this tumor mass reveals", ["Marked hyperplasia of neurons.", "Many degenerated neurons.", "Multiple demyelinated nerve fibres.", "Proliferation of macroglia."], "d",
      ["Brain tumours in children are mostly **gliomas**: a **proliferation of macroglia** (astrocytes). Mature neurons cannot divide.", "a: Mature neurons do not divide, so they do not form a hyperplasia or a tumour.", "b: Degenerated neurons do not make a tumour mass.", "c: Demyelinated fibres belong to demyelinating disease, not to a tumour mass."]],
    ["NT", 2, "Examination of immunohistochemically stained sections from the biopsy of the above case (a child's occipital brain tumour) would reveal the following intermediate filament", ["Neurofilaments.", "Cytokeratins.", "Vimentin.", "Glial fibrillar acidic protein."], "d",
      ["Macroglia (astrocytes) are marked by **glial fibrillary acidic protein (GFAP)**, their intermediate filament.", "a: Neurofilaments are the intermediate filaments of **neurons**.", "b: Cytokeratins mark **epithelial** cells.", "c: Vimentin marks cells of **mesenchymal** origin (fibroblasts, endothelium)."]],
    ["NT", 4, "A 40-year-old house-wife was brought to the emergency room with injured ulnar nerve while using the kitchen knife. After surgical intervention, she was terribly concerned about the repair of this nerve. Proper regeneration of this injured nerve depends upon", ["Approximation of two parts of axons.", "Approximation of two parts of myelin sheath.", "Approximation of two parts of the axon & the neurolemmal sheath.", "Number of lymphocytes at site of injury."], "c",
      ["Regeneration needs the cut ends brought together **and the neurolemmal (Schwann) sheath**, whose tube guides the sprouting axon; that is why peripheral nerves regenerate and CNS tracts do not.", "a: The axon ends alone are not enough: without the Schwann tube the sprouts wander.", "b: Myelin breaks down distal to the cut; it does not guide regrowth.", "d: Lymphocytes play no part in guiding regeneration."]],
    ["CNS", 1, "A 5-year-old girl with meningitis. Doctor prescribes her antibiotics. Which of the following statements should be considered true?", ["Blood brain barrier (B.B.B.) normally allows the passage of all antibiotics.", "The B.B.B. does not allow passage of antibiotics due to big molecular size.", "Systemic administration of penicillin normally → large amount entering CNS.", "Meninges become more permeable to penicillin at the site of inflammation and its concentration rises in cerebrospinal fluid."], "d",
      ["Inflamed meninges become **more permeable**, so penicillin, which barely crosses the normal barrier, reaches useful levels in the CSF." + MISPRINT, "a: The blood–brain barrier **restricts** most drugs; it does not let all antibiotics pass.", "b: Some antibiotics do cross; the barrier is not a size cut-off that stops all of them.", "c: Normally only a **small** amount of penicillin enters the CNS."]],
    ["CNS", 2, "A patient with lesion in right gracile nucleus is expected to have less.....", ["tactile localization at right arm.", "Fine touch at left leg.", "stereognosis at right hand.", "tactile discrimination at right leg."], "d",
      ["The gracile nucleus relays fine touch and discrimination from the **lower** body of the **same** side (it lies below the sensory decussation): the **right leg**.", "a: The arm relays in the **cuneate** nucleus.", "b: Below the decussation a right-sided lesion affects the **right** side.", "c: The hand relays in the **cuneate** nucleus."]],
    ["CNS", 3, "An injury to the posterior column of the lumbar spinal cord may be manifested as loss of ...", ["Fine touch at upper limbs.", "tactile discrimination at lower limbs.", "Crude touch at upper limbs.", "Pain & temperature at the lower limbs."], "b",
      ["At lumbar level the posterior column holds only **lower-limb** fibres (gracile tract): loss of **tactile discrimination**, vibration and position sense in the lower limbs." + MISPRINT, "a: Upper-limb fibres join above the lumbar level (cuneate tract).", "c: Crude touch runs in the anterior spinothalamic tract, and no upper-limb fibres are at lumbar level.", "d: Pain and temperature run in the **lateral spinothalamic** tract, not the posterior column."]],
    ["CNS", 4, "A patient with defective pain, simple touch and proprioception sensations from one side of the face and scalp probably has lesion in...", ["spinal lemniscus.", "trigeminal lemniscus.", "lateral lemniscus.", "medial lemniscus."], "b",
      ["All sensation from the face and scalp reaches the thalamus (VPMN) in the **trigeminal lemniscus**." + MISPRINT, "a: The spinal lemniscus carries pain, temperature and crude touch from the **body**.", "c: The lateral lemniscus is **auditory**.", "d: The medial lemniscus carries fine touch and proprioception from the **body**."]],
    ["CNS", 5, "40 years old male complains of unsteadiness in gait especially in the dark, his complaint may be due to lesion in", ["Lateral spinothalamic tract.", "Ventral spinothalamic tract.", "Cuneo-cerebellar tract.", "Dorsal column tracts."], "d",
      ["Unsteadiness **worse in the dark** is sensory ataxia: conscious proprioception (**dorsal columns**) is lost and only vision makes up for it." + MISPRINT, "a: The lateral spinothalamic tract carries pain and temperature.", "b: The ventral spinothalamic tract carries crude touch and pressure.", "c: The cuneocerebellar tract carries unconscious proprioception from the upper limb; its loss does not worsen with the eyes closed."]],
    ["EYE", 24, "A patient presenting by redness and watering of eye, known clinically as pink eye is caused by", ["Inflammation of Zeis gland.", "Inflammation of Meibomian gland.", "Inflammation of Moll's gland.", "Inflammation of conjunctiva."], "d",
      ["Pink eye is **conjunctivitis**: inflamed conjunctival vessels (redness) and tearing.", "a: Zeis gland inflammation is a **stye** at the lid margin.", "b: A blocked Meibomian gland gives a **chalazion**.", "c: Moll's gland inflammation gives a lid-margin swelling, not a red watery eye."]],
    ["EYE", 101, "A patient presenting with corneal opacity causing visual defects was directed to corneal transplantation is having", ["Injured epithelium.", "Corneal vascularization.", "Irregular substantia arrangement.", "Injured Bowman's membrane."], "d",
      ["**Bowman's membrane does not regenerate**: its injury leaves a permanent opacity that needs a graft.", "a: The corneal epithelium regenerates quickly, so it heals without a graft.", "b: Vascularization is a complication, not the injury this problem describes.", "c: The classic permanent scar after injury is Bowman's membrane, not the stroma's arrangement."]],
    ["EYE", 102, "A patient presenting with acute eye pain, by examination showed rise of the intraocular pressure, a condition known as...due to...", ["Cataract, lens opacity.", "Presbyopia, decreased lens elasticity.", "Glaucoma, increased vitreous formation.", "Glaucoma, improper drainage of aqueous."], "d",
      ["**Glaucoma**: raised intraocular pressure from **impaired drainage of aqueous** through the trabecular meshwork and canal of Schlemm.", "a: Cataract is a painless lens opacity with normal pressure.", "b: Presbyopia is loss of near focusing with age.", "c: The vitreous is not continuously formed; aqueous drainage is the problem."]],
    ["EYE", 103, "A 50-year-old patient presented with difficulty to focus during reading, was diagnosed as...due to....", ["Cataract, lens opacity.", "Cataract, denaturated crystallin.", "Presbyopia, defective accommodation.", "Presbyopia, defective lens fibers."], "c",
      ["**Presbyopia**: with age the lens loses its elasticity, so **accommodation** for near vision fails.", "a: Cataract blurs all vision; the problem here is near focusing.", "b: Denatured crystallins cause cataract, not a focusing problem.", "d: The lens as a whole loses elasticity; it is the accommodation that is defective."]],
    ["EYE", 104, "A 20-year-old female patient presenting with painless visual defects and normal intraocular pressure was diagnosed as...", ["Cataract.", "Presbyopia.", "Glaucoma.", "Retinal detachment."], "d",
      ["Painless visual loss with normal pressure in a young adult: **retinal detachment**.", "a: Cataract is mostly a disease of old age.", "b: Presbyopia starts in the 40s.", "c: Glaucoma means raised intraocular pressure."]],
    ["EYE", 105, "A 60-year-old male patient presenting with painless central visual defects and normal intraocular pressure was diagnosed as...", ["Cataract.", "Presbyopia.", "Glaucoma.", "Macular degeneration."], "d",
      ["Painless loss of **central** vision in an older person: **macular degeneration** (the macula serves central vision).", "a: Cataract blurs the whole field, not only its centre.", "b: Presbyopia affects near focusing, not the central field.", "c: Glaucoma raises the pressure and first affects the peripheral field."]],
    ["EYE", 106, "A twenty-year-old female complaining of a chalazion in her eye lid, the cause may be due to", ["Inflammation of Zeis gland.", "Inflammation of lacrimal gland.", "Inflammation of Moll's gland.", "Inflammation of Meibomian gland."], "d",
      ["A **chalazion** is a blocked, inflamed **Meibomian (tarsal) gland** inside the tarsal plate.", "a: Zeis gland inflammation is a **stye** at the lid margin.", "b: Lacrimal gland inflammation swells the upper outer orbit, not the lid.", "c: Moll's gland inflammation gives a swelling at the lid margin, not in the tarsal plate."]],
    ["EYE", 107, "An old man complaining of a small swelling at the margin of the eyelid the most probable origin is", ["Meibomian gland.", "Zeis gland.", "Lacrimal gland.", "Tarsal gland."], "b",
      ["A swelling **at the lid margin** is a stye of a **Zeis gland** (the sebaceous gland of the eyelashes).", "a: Meibomian glands lie inside the tarsal plate; their swelling (chalazion) is away from the margin.", "c: The lacrimal gland is in the orbit, not the lid margin.", "d: Tarsal glands are the Meibomian glands, inside the tarsal plate."]],
    ["EYE", 108, "A patient presenting with corneal opacity due to injury of the anterior limiting membrane, the condition could be treated by", ["Eye ointments.", "Cataract surgery.", "Lasik surgery.", "Corneal transplantation."], "d",
      ["The anterior limiting (**Bowman's**) membrane cannot regenerate, so the opacity is permanent: **corneal transplantation**.", "a: Ointments cannot restore Bowman's membrane.", "b: Cataract surgery replaces the lens, not the cornea.", "c: LASIK reshapes the stroma to correct refraction; it does not remove a scar of Bowman's membrane."]],
    ["EYE", 109, "A young man presenting with defective vision, by examination retinal detachment was found the possible cause is", ["Separation of rods and cones.", "Separation of retinal pigmented epithelium.", "Separation of Bruch's membrane.", "Separation of outer limiting membrane."], "b",
      ["Retinal detachment is **separation of the neural retina from the pigment epithelium** (the potential space left from the optic cup).", "a: Rods and cones stay with the neural retina; it is the pigment epithelium they separate from.", "c: Bruch's membrane stays with the choroid.", "d: The outer limiting membrane lies inside the neural retina and does not separate."]],
    ["EAR", 101, "A 10 years old child complained of loss of hearing following infection associated with external ear inflammation, by examination he showed", ["Defective hair cells of macula.", "Defective hair cells of crista.", "Conductive hearing loss.", "Defective supporting cells."], "c",
      ["Inflammation of the external ear blocks the passage of sound: **conductive hearing loss**.", "a: Macular hair cells sense linear acceleration (balance).", "b: Crista hair cells sense rotation (balance).", "d: Supporting cells are in the inner ear, untouched by an external-ear infection."]],
    ["EAR", 102, "A 7 years old girl presented with earache, ear discharge and history of recent sore throat, by examination.......was found", ["Sensorineural hearing loss.", "Perforated tympanic membrane.", "cochlear neuritis.", "Defective malleus."], "b",
      ["Sore throat → infection up the Eustachian tube → **otitis media**; pus bursts the drum and discharges through a **perforated tympanic membrane**.", "a: Sensorineural loss is an inner-ear or nerve problem.", "c: Cochlear neuritis does not cause ear discharge.", "d: The malleus is not destroyed by an acute otitis media."]],
    ["EAR", 103, "A 4 years male patient presented with permanent hearing loss following examination cochlear transplantation was decided, the likely cause was", ["Supporting cells damage.", "Macula hair cells damage.", "Crista hair cells damage.", "Organ hair cells damage."], "d",
      ["A cochlear implant stands in for lost **hair cells of the organ of Corti**, stimulating the cochlear nerve directly.", "a: Supporting-cell damage alone is not what an implant replaces.", "b: Macular hair cells serve balance.", "c: Crista hair cells serve balance."]],
    ["EAR", 104, "A middle-aged woman came to the clinic suffering from vertigo, a possible cause explaining her status may be", ["Cochlear nerve degeneration.", "Loss of hair cells of organ of Corti.", "Otitis media.", "Defective vestibular apparatus."], "d",
      ["Vertigo is a disorder of balance: the **vestibular apparatus** (utricle, saccule, semicircular canals).", "a: Cochlear nerve degeneration causes deafness, not vertigo.", "b: Loss of Corti hair cells causes sensorineural deafness.", "c: Otitis media causes pain and conductive deafness."]],
    ["EAR", 105, "Degeneration of the cochlear nerve in the inner ear causes", ["Motion sickness.", "Neural deafness.", "Vertigo.", "Conductive deafness."], "b",
      ["The cochlear nerve carries hearing: its degeneration causes **neural (sensorineural) deafness**.", "a: Motion sickness is vestibular.", "c: Vertigo is vestibular.", "d: Conductive deafness comes from the external or middle ear."]],
    ["EAR", 106, "A child three years old pushed an ear cotton bud forcibly along his external auditory canal. He was diagnosed as", ["Motion sickness.", "Vertigo.", "Neural deafness.", "Conductive deafness."], "d",
      ["A bud pushed along the canal injures the canal or the drum, so sound conduction fails: **conductive deafness**.", "a: Motion sickness is vestibular.", "b: Vertigo needs a vestibular (inner-ear) injury.", "c: Neural deafness needs damage to the cochlea or its nerve."]],
    ["EAR", 107, "Neural deafness diagnosed in children can be caused by drugs which damage...", ["Hair cells in organ of Corti.", "External auditory canal.", "Auditory ossicles.", "Chorda tympani nerve."], "a",
      ["Ototoxic drugs (e.g. aminoglycosides) destroy the **hair cells of the organ of Corti** → neural (sensorineural) deafness.", "b: Canal damage gives conductive deafness.", "c: Ossicle damage gives conductive deafness.", "d: The chorda tympani carries taste, not hearing."]],
  ];
  // matching tables: [chapter, table, column B (a–g), answer letters for rows 1–5, rows, why each row's answer, unused options, rows left out, also-accepted]
  const BOOKMT = [
    ["NT", 1, ["Demonstrated by silver stain", "Are rER and polyribosomes", "Cells are multipolar pyramidal", "Has receptors for acetylcholine", "Stained with PAS", "Have uniform diameter", "Cells are unipolar"], "gdafb",
      ["Spinal ganglion", "Post synaptic membrane", "Golgi apparatus", "The axons", "Nissl bodies"],
      ["Spinal (dorsal root) ganglion cells are **pseudo-unipolar**: one process that divides like a T.", "The postsynaptic membrane carries the **receptors for the transmitter** (acetylcholine at cholinergic synapses).", "The Golgi apparatus of neurons is shown by **silver** impregnation, as a network around the nucleus.", "Axons keep a **uniform diameter** along their length (dendrites taper).", "Nissl bodies are stacks of **rER with polyribosomes**, hence basophilic."],
      { c: "Multipolar pyramidal cells are the neurons of the cerebral cortex; no row here.", e: "PAS stains glycogen and glycoproteins; no row here." }, [], {}],
    ["NT", 2, ["Osmic acid", "Gap junctions", "Tapering", "Silver", "Has myelinated nerve fibers", "Axosomatic", "Is devoid of Nissl granules"], "egfab",
      ["The ulnar nerve", "The axon", "Site of contact of axon and cell body", "Myelin sheath is stained with", "Electrical synapse"],
      ["A peripheral nerve like the ulnar is made mostly of **myelinated** fibres.", "The axon (and its hillock) is **free of Nissl granules**.", "A synapse of an axon on a cell body is **axosomatic**.", "", "Electrical synapses are **gap junctions**."],
      { c: "Tapering describes dendrites, not axons.", d: "Silver shows neurofibrils, axons and the Golgi apparatus." }, [4], {}],
    ["NT", 3, ["Substantia nigra", "Shows delicate fibers or granules", "Cerebellum", "The grey matter", "Cerebral cortex", "There is proliferation of Schwann cells", "Are sensory neurons"], "fcabe",
      ["In regeneration", "Purkinje cells are found in", "Melanin pigment is seen in", "The synaptic cleft", "Pyramidal cells are seen in"],
      ["In regeneration the **Schwann cells proliferate** and form the bands that guide the new axon.", "Purkinje cells lie in the **cerebellar** cortex.", "Neurons of the **substantia nigra** contain melanin (hence the name).", "The synaptic cleft **shows delicate fibres or granules** of intercellular material.", "Pyramidal cells are the typical neurons of the **cerebral cortex**."],
      { d: "Too general: the table wants the specific site (cerebellum, cerebral cortex, substantia nigra).", g: "Sensory neurons are the dorsal-root-ganglion cells; no row here." }, [], {}],
    ["NT", 4, ["Nerve fibers are thin non-myelinated", "Silver", "Sudan III", "Cells are bipolar", "Are absent", "Osmic acid", "Satellite cells are abundant"], "gefba",
      ["In spinal ganglion", "Centrioles in neurons", "Myelin sheath is stained by", "Golgi is stained by", "In sympathetic ganglia"],
      ["In spinal ganglia each cell has a complete capsule of **abundant satellite cells**.", "Mature neurons have **no centrioles**, so they cannot divide.", "", "The neuronal Golgi apparatus is shown by **silver**.", "In sympathetic ganglia the fibres are mostly **thin non-myelinated** (postganglionic)."],
      { c: "Sudan III stains fat in frozen sections; it is not the department's answer for any row.", d: "Bipolar cells are found in the retina, the olfactory epithelium and the cochlear and vestibular ganglia; no row here." }, [3], {}],
    ["NT", 5, ["Mesodermal in origin", "Simple cuboidal ciliated", "Star shaped with multiple processes", "Around nerve cells in ganglia", "Form myelin in central nervous system", "In peripheral nervous system", "Contain Nissl's granules"], "ceafb",
      ["Astrocytes", "Oligodendrocytes", "Microglia", "Schwann cells", "Ependymal cells"],
      ["Astrocytes are **star-shaped** with many processes.", "Oligodendrocytes **form myelin in the CNS**.", "Microglia are the only neuroglia of **mesodermal** origin.", "Schwann cells belong to the **peripheral** nervous system.", "Ependymal cells are a **simple cuboidal (to columnar) ciliated** lining of the ventricles and central canal."],
      { d: "Cells around nerve cells in ganglia are satellite cells; no row here.", g: "Nissl granules belong to neurons, not neuroglia." }, [], {}],
    ["CNS", 1, ["Homologous to accessory cuneate nucleus.", "Carries pain & temperature sensations", "Corticobulbar tract.", "Corticospinal tract.", "Ends in VPLN.", "Ends in superior colliculus", "Continuation of medial longitudinal bundle"], "bdage",
      ["Lateral spinothalamic tract", "Upper 2/3 of motor area 4 of cerebral cortex", "Clark's nucleus", "Sulcomarginal tract", "Medial lemniscus"],
      ["The lateral spinothalamic tract **carries pain and temperature**.", "The upper two-thirds of area 4 give the **corticospinal** tract (the lower third gives corticobulbar fibres).", "Clark's nucleus (lower limb) is **homologous to the accessory cuneate nucleus** (upper limb): both send unconscious proprioception to the cerebellum.", "The sulcomarginal tract is the **continuation of the medial longitudinal bundle** into the cord.", "The medial lemniscus **ends in the VPLN** of the thalamus."],
      { c: "Corticobulbar fibres come from the lower third of area 4; no row here.", f: "The spinotectal tract ends in the superior colliculus; no row here." }, [], {}],
    ["EYE", 1, ["Simple columnar epithelium", "Non keratinized stratified squamous epithelium", "Keratinized stratified squamous epithelium", "Simple cuboidal epithelium", "Pseudo stratified columnar ciliated epithelium", "Stratified columnar epithelium with goblet cells", "Simple cubical epithelium"], "befdc",
      ["Cornea", "Lacrimal duct", "Conjunctiva", "Subcapsular epithelium of the lens", "Outer surface of eye lid"],
      ["The corneal epithelium is **non-keratinized stratified squamous**.", "", "The conjunctiva is **stratified columnar with goblet cells**.", "The subcapsular epithelium of the lens is **simple cuboidal** (anterior surface only).", "The outer surface of the eyelid is thin skin: **keratinized stratified squamous**."],
      { a: "Simple columnar epithelium lines none of these rows.", g: "“Simple cubical” is the same epithelium as simple cuboidal (d): it belongs to the lens's subcapsular epithelium." }, [2], { 4: { g: "Also accepted: “simple cubical” is the same epithelium as d; the book keys d." } }],
    ["EAR", 1, ["Handle of malleus", "No collagen fibers", "Stratified squamous epithelium", "Radial and circular", "Three layers of collagen", "Simple cuboidal epithelium", "Foot plate of the stapes"], "cfbda",
      ["Outer surface of tympanic membrane", "Inner surface of tympanic membrane", "Pars flaccida of tympanic membrane", "Collagen fibers of tympanic membrane", "Attached to the tympanic membrane"],
      ["The outer surface of the drum is thin skin: **stratified squamous** epithelium.", "The inner surface is middle-ear mucosa: **simple cuboidal** epithelium.", "", "", "The **handle of the malleus** is attached to the inner surface of the drum."],
      { e: "It is not the department's answer for any row of this table.", g: "The stapes footplate fits the **oval window**, not the drum." }, [3, 4], {}],
    ["EAR", 2, ["Tensor tympani", "Stapedius", "Mastoid air cells", "Stapes footplate", "Secondary tympanic membrane", "Eustachian tube", "Chorda tympani"], "deafc",
      ["Oval window", "Round window", "Malleus", "Anterior wall of tympanic cavity", "Posterior wall of tympanic cavity"],
      ["The oval window is closed by the **stapes footplate**.", "The round window is closed by the **secondary tympanic membrane**.", "**Tensor tympani** is inserted into the malleus.", "The anterior wall carries the opening of the **Eustachian (auditory) tube**.", "The posterior wall leads through the aditus to the mastoid antrum and **mastoid air cells**."],
      { b: "Stapedius is inserted into the **stapes**; no row here.", g: "The chorda tympani crosses the inner surface of the drum; no row here." }, [], {}],
    ["EAR", 3, ["Cupula", "Phalangeal cells", "Pillar cells", "Tectorial membrane", "Otolithic membrane", "Bony semicircular canals", "Spiral ganglia"], "bcfae",
      ["Supporting cells", "Tunnel of Corti", "Perilymph", "Crista ampullaris", "Macula"],
      ["The supporting cells that hold the outer hair cells are the **phalangeal (Deiters') cells**.", "The tunnel of Corti is bounded by the inner and outer **pillar cells**.", "", "The crista ampullaris is capped by the gelatinous **cupula**.", "The macula is covered by the **otolithic membrane**."],
      { d: "The tectorial membrane lies over the hair cells of the organ of Corti; no row here.", g: "The spiral ganglion holds the cell bodies of the cochlear nerve; no row here." }, [3], {}],
  ];
  const XB = {};
  for (const [ch, n, stem, opts, key, lines] of BOOKPS) {
    push("DEPT-BOOK-" + ch + "-PS-" + n, n, stem, opts, key, L[ch], BK);
    // the five CNS problems already say why their key is the standard answer, not the book's printed row
    const keyLine = lines[0].includes("standard answer") ? lines[0] : lines[0] + " This is the department book's answer.";
    (XB["DEPT-BOOK-" + ch + "-PS-"] = XB["DEPT-BOOK-" + ch + "-PS-"] || {})[n] = [keyLine, ...lines.slice(1)];
  }
  for (const [ch, t, opts, keys, rows, why, other, skip, also] of BOOKMT)
    for (let r = 1; r <= 5; r++) {
      if (skip.includes(r)) continue;
      const num = t * 10 + r,
        key = keys[r - 1],
        pre = "DEPT-BOOK-" + ch + "-MT-",
        lines = [why[r - 1] + " This is the department book's answer."];
      for (const Lt of "abcdefg") {
        if (Lt === key) continue;
        if (also[r] && also[r][Lt]) {
          lines.push("~" + Lt + ": " + also[r][Lt]);
          continue;
        }
        const j = keys.indexOf(Lt);
        lines.push(Lt + ": " + (j >= 0 ? (skip.includes(j + 1) ? "That belongs to another row of this table." : "That goes with “" + rows[j] + "” in this table.") : other[Lt]));
      }
      (XB[pre] = XB[pre] || {})[num] = lines;
      push(pre + num, num, rows[r - 1] + " → ?", opts, key, L[ch], BK, { group: "Matching", sourceTag: "Department book matching, " + CHN[ch] + " table " + ["", "I", "II", "III", "IV", "V"][t] });
    }

  const IX = (window.INTELLECTUALITY_MCQ_X = window.INTELLECTUALITY_MCQ_X || {});
  for (const k of Object.keys(XB)) IX[k] = Object.assign(IX[k] || {}, XB[k]);
  IX["DEPT-EOM197-ANAT-MCQ-"] = Object.assign(IX["DEPT-EOM197-ANAT-MCQ-"] || {}, {
    24: ["The **submental** triangle lies **between the two anterior bellies of the digastric**, with the body of the hyoid as its base and the chin as its apex; its floor is the two mylohyoids.", "a: The occipital triangle is the upper part of the posterior triangle, above the inferior belly of omohyoid.", "b: The posterior triangle lies behind the sternomastoid and in front of the trapezius.", "c: The muscular triangle lies below the hyoid, between the midline, the superior belly of omohyoid and the sternomastoid."],
    34: ["General (somatic) sensation from the **opposite half of the body** reaches the **primary somatosensory area 3, 1, 2** in the postcentral gyrus; a lesion there → loss of general sensation on the opposite side.", "b: Area 22 is the auditory association (Wernicke's) area: understanding speech.", "c: Area 17 is the primary visual area around the calcarine sulcus.", "d: Areas 18, 19 are the visual association areas."],
    35: ["The **paracentral lobule** (medial surface, around the upper end of the central sulcus) holds the leg and perineum areas and the cortical control of the **bladder and rectum**: a lesion → **incontinence** of urine and stool.", "a: The cuneus, between the calcarine and parieto-occipital sulci, is visual cortex.", "c: The premotor area (area 6) plans the pattern of movements.", "d: The parietal association area interprets sensation (e.g. recognising objects by touch)."],
    36: ["**Broca's (motor speech) area**, areas 44 and 45 in the inferior frontal gyrus of the dominant hemisphere: a lesion → **motor aphasia**; he understands but cannot produce speech.", "a: The primary olfactory area (uncus, near the hippocampal gyrus) is smell.", "c: The premotor area (6) plans movement patterns; a lesion does not abolish speech.", "d: The prefrontal area is personality, judgement and planning."],
    37: ["Colour is **interpreted** in the **visual association areas 18, 19**: a lesion there → loss of colour discrimination while vision itself remains. This is the answer the Nov 2024 answer sheet marked.", "a: Areas 3, 1, 2 receive general sensation.", "b: Area 17, the primary visual area, receives the image; a lesion → blindness in the opposite half-field, not a pure loss of colour.", "c: Areas 41, 42 are the primary auditory area."],
    38: ["A tailor's work is **fine, skilled hand movement**. The hand has a large area in the **primary motor area 4** (precentral gyrus), so a lesion there stops fine hand work. This is the answer the Nov 2024 answer sheet marked.", "a: Areas 39, 40 (angular and supramarginal gyri) serve reading, writing and the interpretation of sensation.", "b: Area 28 is the entorhinal area, part of the olfactory (smell) cortex.", "d: Areas 41, 42 are the primary auditory area: hearing."],
  });
  IX["DEPT-EOM197-PHYS-MCQ-"] = Object.assign(IX["DEPT-EOM197-PHYS-MCQ-"] || {}, {
    58: ["**Convergence** = many presynaptic fibres ending on **one** neuron. Signals from several sources are summed there, so only signals backed by enough inputs fire it: the pool **selects the important signals** and ignores weak, unimportant ones.", "a: One neuron stimulating many neurons is **divergence**.", "b: Spreading (distributing) a signal to many neurons is divergence.", "d: Convergence gives **spatial** summation (many fibres at once), not temporal summation (one fibre firing fast)."],
    59: ["Two input fibres whose **discharge zones are apart** each leave a **subliminal fringe** of partly excited neurons. Stimulated together, the fringes overlap and extra neurons fire: the response is **greater than the sum** of the two alone. That is facilitation.", "b: Inputs close together share neurons in their discharge zones → **occlusion**, not facilitation.", "c: A response smaller than the sum of the two alone is **occlusion**.", "d: A common discharge zone is the basis of **occlusion**."],
  });
  IX["DEPT-LEVELS-HIST-MCQ-"] = Object.assign(IX["DEPT-LEVELS-HIST-MCQ-"] || {}, XL);
  IX["DEPT-SA-HIST-MCQ-"] = Object.assign(IX["DEPT-SA-HIST-MCQ-"] || {}, {
    1: ["Muscle spindles are **most numerous in antigravity (postural) muscles**, where they keep up the stretch reflex that holds posture. This is the department's model answer.", "b: The **afferent** (sensory) fibres wrap the intrafusal fibres; \"efferent sensory\" is a contradiction.", "c: The striated (polar) ends are supplied by **efferent (gamma) motor** fibres; \"afferent motor\" is a contradiction.", "d: Intrafusal fibres lie **parallel** to the extrafusal fibres, not perpendicular."],
    2: ["Wallerian degeneration is the change in the **distal** part of a cut axon: the myelin first retracts at the nodes (**widening of the nodes of Ranvier**), then breaks into ovoids that macrophages clear. This is the department's model answer.", "a: Peripheral migration of the nucleus happens in the **cell body** (retrograde reaction), not in Wallerian degeneration.", "b: Chromatolysis (loss of Nissl bodies) is also a **cell-body** change.", "d: Schwann cells **multiply**, forming the bands (tubes) that guide the regrowing axon."],
    4: ["Sympathetic ganglion cells are **multipolar (stellate)**, small, with an eccentric nucleus, scattered among non-myelinated fibres. This is the department's model answer.", "b: They have **few** satellite cells (an incomplete capsule); spinal ganglia have many.", "c: Autonomic ganglia are relays: preganglionic fibres **synapse** on the ganglion cells.", "d: The cells are separated mostly by **non-myelinated** (postganglionic) fibres."],
    5: ["The largest neuroglia are the **astrocytes**; their perivascular end-feet share in the **blood–brain barrier** with the endothelial tight junctions. This is the department's model answer.", "a: Mesoglia is another name for **microglia**, the smallest.", "c: Myelin in the CNS is made by **oligodendrocytes**.", "d: Astrocytes are **ectodermal** (neuroectoderm); only microglia are mesodermal."],
    8: ["**Satellite** oligodendrocytes sit close to nerve cell bodies in grey matter and **support** them. This is the department's model answer.", "b: Neuroglia, oligodendrocytes included, keep their centrioles and can divide; mature neurons are the cells that lack them.", "c: Oligodendrocytes are **ectodermal** (neuroectoderm).", "d: **Interfascicular** oligodendrocytes lie in rows between the fibres of **white** matter, where they make myelin."],
    10: ["The presynaptic **axon terminal** is rich in **mitochondria** and **synaptic vesicles** of transmitter. This is the department's model answer.", "a: Chemical synapses are the **commonest** type in the nervous system.", "c: The chemical synaptic cleft is about **20–30 nm**; a 2–3 nm gap is the gap junction of an electrical synapse.", "d: Gap junctions make **electrical** synapses, which pass ions, not neurotransmitters."],
  });
  IX["DEPT-FA-HIST-MCQ-"] = Object.assign(IX["DEPT-FA-HIST-MCQ-"] || {}, {
    1: ["Conscious proprioception from the **upper half** of the body runs in the **cuneate tract** and relays in the **cuneate nucleus** (2nd-order neuron) of the closed medulla. The paper has no printed key; this is the standard answer.", "a: The gracile nucleus is the 2nd-order neuron for the **lower half** of the body.", "c: Substantia gelatinosa of Rolando is a relay for **pain and temperature**.", "d: The main sensory nucleus (nucleus proprius) gives the **ventral spinothalamic** tract (crude touch), not the dorsal-column path."],
    2: ["Long sensory tracts to **subcortical** levels end below the cortex: **spino-olivary**, spinotectal and spinocerebellar. The paper has no printed key; this is the standard answer.", "a: The ventral spinothalamic tract reaches the **cortex** through the thalamus.", "b: The lateral spinothalamic tract reaches the **cortex** through the thalamus.", "c: The cuneate tract reaches the **cortex** through the medial lemniscus and thalamus."],
    4: ["The corticobulbar fibres for the eye-muscle nuclei (**3, 4, 6**) run **medially**; the **lateral** corticobulbar tract ends in the other cranial motor nuclei, the **5th** among them. The paper has no printed key; this is the standard answer.", "a: The 3rd nerve nucleus (eye muscles) receives the **medial** corticobulbar fibres.", "b: The 4th nerve nucleus (eye muscles) receives the **medial** corticobulbar fibres.", "d: The 6th nerve nucleus (eye muscles) receives the **medial** corticobulbar fibres."],
    5: ["**Granular (granule) cell** axons form the **parallel fibres**, which **excite** the Purkinje dendrites. The paper has no printed key; this is the standard answer.", "a: Basket cells **inhibit** the Purkinje cell bodies.", "b: Stellate cells **inhibit** the Purkinje dendrites.", "c: Golgi cells **inhibit** the granule cells, not the Purkinje cells."],
    6: ["Retinal pigment epithelium **phagocytoses the worn-out tips (discs) of the photoreceptor outer segments**; it also stores vitamin A and absorbs stray light. The paper has no printed key; this is the standard answer.", "a: The photoreceptors form their own layer, internal to the pigment epithelium.", "c: Amacrine cells lie in the **inner nuclear** layer.", "d: The vitreous is not made by the pigment epithelium."],
    7: ["The **sphincter pupillae** (smooth muscle) lies **in the stroma** near the pupillary margin; the dilator pupillae is myoepithelial, in the posterior epithelium. The paper has no printed key; this is the standard answer.", "a: Fibroblasts and melanocytes line the **anterior** surface.", "b: The two-layered pigmented epithelium covers the **posterior** surface.", "d: The iris is the **anterior** part of the vascular coat (uvea)."],
    8: ["The cornea is **avascular** (and has no lymphatics), so the recipient's immune cells hardly reach the graft: it is seldom rejected. The paper has no printed key; this is the standard answer.", "a: Transparency explains clear vision, not why the graft is accepted.", "c: The amount of collagen has nothing to do with rejection.", "d: Regularly arranged collagen explains **transparency**, not graft acceptance."],
  });
})();
