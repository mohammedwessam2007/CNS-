/* INTELLECTUALITY v16.2 · PAST-PAPER ITEMS MISSING FROM THE BANK
 * The real NEU-205 end-of-module exam of 28 Nov 2024 (batch 197; 115 MCQs), read from the owner's
 * answered copy: 107 of its MCQs were already in the bank, with matching keys. These are the 8 it lacked,
 * worded exactly as printed, keyed as the answer sheet marked them. They are PRACTICE items (taught in the
 * notes, scheduled in the day's rounds); the sealed held-out mock is unchanged.
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
  };
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
  const have = new Set(QB.questions.map((q) => q.id));
  for (const [subj, n, lk, stem, opts, key] of ITEMS) {
    const id = "DEPT-EOM197-" + subj + "-MCQ-" + n;
    if (have.has(id)) continue;
    const options = opts.map((text, i) => ({ key: "abcd"[i], text }));
    QB.questions.push(Object.assign({ id, number: n, page: 0, stem, options, answerKeys: [key], answerText: options.find((o) => o.key === key).text }, base, L[lk]));
  }

  const IX = (window.INTELLECTUALITY_MCQ_X = window.INTELLECTUALITY_MCQ_X || {});
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
})();
