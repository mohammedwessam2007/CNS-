/* INTELLECTUALITY v15.3 · LEARN notes · PLUS
 * Teaching added so that every fact the practice bank tests is taught in the section where it belongs,
 * framed the way Kasr asks it (clinical vignette → structure; "all EXCEPT" → the odd one out). Written
 * from standard teaching (Snell, Guyton, Junqueira level) after reading the PRACTICE items only; the
 * held-out mock was not read. Where a bank key conflicts with standard teaching, the correct fact is
 * taught and the bank's key is named with ⚠ (the bank itself is unchanged).
 * add(chapterId, headingStart, [bullets]) appends to that section; the section must already exist.
 */
(function () {
  const N = (window.INTELLECTUALITY_LEARN_NOTES = window.INTELLECTUALITY_LEARN_NOTES || { chapters: [] });
  const missed = (N.plusMissed = N.plusMissed || []);
  // Freeze the ids of the original sections (saved recall ratings and page positions use them) before
  // any new section is inserted; new sections get their own stable ids.
  for (const c of N.chapters) c.s.forEach((x, i) => (x.id = x.id || c.id + "#" + i));
  const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  // sec(chapterId, afterHeadingStart, section): a new section placed after an existing one ('' = at the end)
  const sec = (id, after, x) => {
    const c = N.chapters.find((y) => y.id === id);
    if (!c) return void missed.push(id + " / new: " + x.h);
    const i = after ? c.s.findIndex((y) => y.h.startsWith(after)) : -1;
    x.plus = (x.p || []).length;
    x.added = true;
    x.id = c.id + "+" + slug(x.h);
    if (after && i < 0) return void missed.push(id + " / after: " + after);
    c.s.splice(after ? i + 1 : c.s.length, 0, x);
  };
  const add = (id, head, bullets) => {
    const c = N.chapters.find((x) => x.id === id);
    const s = c && c.s.find((x) => x.h.startsWith(head));
    if (!s) return void missed.push(id + " / " + head);
    s.p = (s.p || []).concat(bullets);
    s.plus = (s.plus || 0) + bullets.length;
  };

  /* ───────────── ANATOMY ───────────── */
  add("an-spinal-cord", "Segments and spinal nerves", [
    "A **segment** is the part of the cord that gives attachment to the **anterior and posterior roots of one pair of spinal nerves**. Traps in the same item: the cord is **grey inside, white outside**; skeletal-muscle motor fibres leave from the **anterior** horn, not the posterior; the **central canal** lies in the **grey** commissure.",
  ]);
  add("an-spinal-cord", "Lumbar puncture", [
    "Fever + headache + neck stiffness = meningitis → the CSF is sampled by **lumbar puncture**. The relatively safe level is **between L3 and L4** (or L4–L5): below the end of the cord (L1–L2 in adults) but inside the dural sac (down to S2). C7–T1, T12–L1 and L1–L2 all risk the cord.",
  ]);
  add("an-brain-stem", "Medulla oblongata: front view", [
    "The **hypoglossal** rootlets emerge in the **anterolateral sulcus**, between pyramid and olive; IX, X and XI emerge in the **posterolateral** sulcus, behind the olive.",
  ]);
  add("an-brain-stem", "Pons: nerves", [
    "Cranial nerves related to the pons: **V** (from its lateral part, at the middle cerebellar peduncle) and **VI, VII, VIII** (at its lower border, the pontomedullary junction). **III and IV** belong to the midbrain; **IX, X, XI, XII** to the medulla.",
  ]);
  add("an-brain-stem", "Midbrain: surfaces", [
    "The **trochlear (IV)** is the **only** cranial nerve attached to the **posterior (dorsal)** aspect of the brainstem, just below the inferior colliculus; it then winds forwards round the cerebral peduncle.",
    "The midbrain occupies the **tentorial notch**. Its dorsal surface (tectum) carries the **four colliculi** (corpora quadrigemina): **superior = visual** reflexes, **inferior = auditory**. The **aqueduct** joins the **3rd and 4th** ventricles (the interventricular foramen joins the lateral and 3rd). The oculomotor emerges into the **interpeduncular fossa**, not from the tectum; the facial nerve has no relation to the midbrain.",
  ]);
  add("an-brain-stem", "Crossed brainstem syndromes", [
    "**Right hypoglossal LMN lesion + left UMN hemiplegia** → the lesion is in the **right medulla** (medial medullary syndrome): XII rootlets and the pyramid lie side by side above the decussation.",
    "**Left hemiplegia + right medial squint** → **right pyramidal tract + right abducent nerve** in the right pons. Rule: the cranial nerve palsy is on the **side of the lesion**, the hemiplegia on the opposite side.",
  ]);
  add("an-sulci-gyri", "The insula", [
    "The insula is a **conical** grey area deep in the lateral sulcus, **surrounded by the circular sulcus** and hidden by the **frontal, parietal and temporal opercula**. Its apex is the **limen insulae**; the **pulvinar** is part of the **thalamus**, which is why 'its apex is the pulvinar' is the incorrect option.",
  ]);
  add("an-sulci-gyri", "Medial surface", [
    "The **cingulate sulcus** begins **below the rostrum** of the corpus callosum, arches a finger's breadth **above** the corpus callosum and ends posteriorly by dividing into **two branches**: the upturned **marginal** branch and the **subparietal** branch (the bank calls them 'submarginal and parietal'). The medial surface is supplied by the **anterior** cerebral artery, not the middle.",
  ]);
  add("an-white-matter", "Association, commissural, projection", [
    "**Projection** fibres join the cortex to **lower centres** in both directions: thalamus ↔ **cerebral** cortex (thalamic radiations), corticospinal, corticobulbar, corticopontine. They run in the **internal** capsule, not the external. Commissural fibres join the **same** areas of the **two** hemispheres; association fibres join **different** areas of the **same** hemisphere. ⚠ One bank key reads 'thalamus to the **cerebellar** cortex': read it as **cerebral**.",
  ]);
  add("an-white-matter", "Internal capsule: shape", [
    "The internal capsule is **white matter**, not grey. Its **anterior limb** lies **between the head of the caudate and the lentiform nucleus**, so a tumour of the caudate head and the rostral putamen invades the anterior limb. The **posterior limb** lies between **thalamus and lentiform**. **Corticothalamic and thalamocortical** fibres run in the anterior limb, the anterior thalamic radiation.",
  ]);
  add("an-white-matter", "Internal capsule: what runs", [
    "**Genu → corticobulbar (corticonuclear)** fibres · **retrolenticular part → optic radiation** · **sublenticular part → auditory radiation**.",
  ]);
  add("an-third-ventricle", "Communications and walls", [
    "**Posterior wall**, from above down: suprapineal recess, habenular commissure, **pineal gland** (its stalk), posterior commissure, then the opening of the aqueduct. So the pineal gland **forms part of the posterior wall** of the 3rd ventricle. Its choroid plexus hangs from the **roof**.",
  ]);
  add("an-meninges", "Arachnoid, pia", [
    "The **subarachnoid space contains CSF** (between arachnoid and pia). The extradural space is **outside** the dura; the subdural space lies between dura and arachnoid. The dural folds are made by the **inner (meningeal) layer**. The fold between cerebrum and cerebellum is the **tentorium cerebelli**; the falx cerebelli lies between the two cerebellar hemispheres. The **pia**, not the dura, dips into the sulci.",
    "Common traps: the **spinal** dura has **one** layer (only the cranial dura has two); the venous sinuses lie **between the dural layers**, not in the subdural space; a torn middle meningeal artery bleeds **extradurally**; the denticulate ligaments are **pia**. The pia continues below the cord as the **filum terminale**, which pierces the end of the dural sac (S2).",
    "Choroid plexus lies in the **roof of the 3rd ventricle**, the body and inferior horn of the lateral ventricle and the roof of the 4th. There is **none** in the anterior (frontal) horn, the posterior (occipital) horn or the aqueduct.",
  ]);
  add("an-csf", "Production: the choroid plexus", [
    "Choroid plexus sites: **body and inferior horn of the lateral ventricle, roof of the 3rd, roof of the 4th**; none in the anterior horn, posterior horn or aqueduct.",
    "⚠ One bank item keys 'CSF is produced **exclusively** in the choroid plexuses of the **lateral** ventricles'. Standard teaching: the choroid plexuses of **all** the ventricles make most of it (the lateral ventricles make the largest share), plus a little from the ependyma and brain tissue fluid. In the same item, 'the 4th ventricle communicates **directly** with the subarachnoid space' (median and lateral apertures) is actually **true**. The other options are false: the 3rd ventricle drains to the 4th through the **aqueduct**; about **500 ml** is made a day (about 150 ml is present at any time); absorption is into the **superior** sagittal sinus.",
  ]);
  add("an-brain-blood", "Vertebral and basilar arteries", [
    "The **superior cerebellar artery** winds round the cerebral peduncle together with the **trochlear (IV)** nerve, so a small haematoma from it is expected to hit IV (the bank's key). The **oculomotor (III)** passes **between the posterior cerebral and superior cerebellar** arteries; it is the classic nerve of a PCA/SCA aneurysm.",
  ]);
  add("an-brain-blood", "Circle of Willis", [
    "The circle is made of the **anterior communicating, anterior cerebral (A1), terminal internal carotid, posterior communicating and posterior cerebral** arteries. The **middle cerebral artery is not part of it**: it is a branch leaving the circle.",
  ]);
  add("an-embryology-cns", "Neural tube", [
    "Until they close (cranial ≈ day 25, caudal ≈ day 27–28), the **neuropores** are a temporary connection between the lumen of the neural tube and the **amniotic cavity**. The cephalic part of the tube **dilates** into the brain vesicles. **Metencephalon → pons + cerebellum**; **mesencephalon → midbrain**; myelencephalon → medulla; telencephalon → cerebral hemispheres.",
  ]);
  add("an-embryology-cns", "Positional change and spina bifida", [
    "**Meningocele** = spina bifida with the **meninges** herniated as a CSF sac; **meningomyelocele** = meninges + cord or roots; **spina bifida occulta** = an unfused arch, usually of **one** vertebra (L5/S1), skin-covered, often with a tuft of hair. At birth the cord ends at **L3** (not L2). The **dorsal root ganglia** come from the **neural crest**, not the neural tube.",
  ]);
  add("an-scalp", "Arteries and nerves of the scalp", [
    "**Auriculotemporal nerve (V3)**: skin of the temple and upper auricle, the **external auditory meatus and the outer surface of the ear drum**, and the secretomotor fibres to the parotid. The **inner** surface of the drum is supplied by IX (the tympanic branch).",
  ]);
  add("an-face", "Muscles of facial expression", [
    "In **Bell's palsy** every muscle of facial expression is paralysed (orbicularis oris, **buccinator**, platysma …) but the **masseter keeps working**: it is a muscle of **mastication**, supplied by **V3**.",
  ]);
  add("an-sternomastoid", "Attachments, nerve and action", [
    "One sternomastoid turns the face to the **opposite** side and upwards, tilting the head towards its own shoulder. Face looking **up and to the left → right** sternomastoid.",
  ]);
  add("an-muscular-triangle-thyroid", "Thyroidectomy and the laryngeal nerves", [
    "The structure most easily damaged at thyroidectomy is the **recurrent laryngeal nerve**, which is close to the inferior thyroid artery at the lower pole. Unilateral injury → **hoarseness**; bilateral → stridor. The external laryngeal nerve, which runs with the superior thyroid artery, gives a weak, low-power voice (loss of cricothyroid).",
  ]);
  add("an-carotid-triangle", "External carotid artery", [
    "The **lingual artery** is the one that does **not** accompany its namesake nerve: the artery runs **deep to hyoglossus**, the lingual nerve (and XII) **superficial** to it. The inferior alveolar, greater palatine and posterior superior alveolar arteries travel with their nerves.",
  ]);
  add("an-cranial-nerves", "Facial nerve lesions", [
    "**Hearing loss + loss of taste + drooling on one side** = VII and VIII compressed together (acoustic neuroma) at the **internal acoustic meatus**. **Hyperacusis** (loud sounds hurt) = loss of the nerve to **stapedius**, i.e. a **facial** nerve lesion proximal to it.",
  ]);
  add("an-cranial-nerves", "Glossopharyngeal nerve", [
    "IX gives **taste and general sensation to the posterior third of the tongue**. It lies in the tonsillar bed, so **tonsillectomy** can abolish posterior-third taste. Its parasympathetic fibres start in the **inferior salivatory nucleus** (→ lesser petrosal → otic ganglion → parotid). The superior salivatory nucleus belongs to VII, the dorsal motor nucleus to X, Edinger-Westphal to III. IX is also the sensory nerve of the **oropharynx** (the afferent limb of the gag reflex); its only muscle is **stylopharyngeus**.",
  ]);
  add("an-cranial-nerves", "Vagus nerve (X) in the neck", [
    "**Hoarseness after thyroidectomy** = injury to the **recurrent laryngeal** branch of the vagus.",
  ]);
  add("an-oral-cavity", "Muscles of the tongue", [
    "**Protrusion** = **both genioglossi** together. One genioglossus pushes the tongue to the **opposite** side, so after a **left hypoglossal** lesion the protruded tongue deviates to the **left**, the paralysed side. Styloglossus pulls the tongue **up and back** (not down); hyoglossus depresses it. The **intrinsic** muscles change its **shape**, the extrinsic muscles its **position**.",
  ]);
  add("an-pharynx", "Parts, constrictors and nerve supply", [
    "Sensory supply: nasopharynx → **V2** (pharyngeal branch); **oropharynx → IX**; laryngopharynx → X (internal laryngeal). Motor supply: every pharyngeal muscle (constrictors, palatopharyngeus, salpingopharyngeus) via the **vagus / pharyngeal plexus**, except **stylopharyngeus → IX**.",
  ]);
  add("an-nose", "Nasal cavity: lateral wall", [
    "The **inferior meatus** receives the **nasolacrimal duct**. Middle meatus: frontal, maxillary, anterior and middle ethmoidal sinuses. Superior meatus: posterior ethmoidal. Sphenoethmoidal recess: sphenoid. The septum is **often deviated**, not always midline; epistaxis usually comes from the **antero-inferior** septum (Little's area / Kiesselbach's plexus); lymph from the vestibule drains to the **submandibular** nodes.",
  ]);
  add("an-nose", "Maxillary sinus", [
    "**Maxillary sinusitis** mimics **upper toothache** (the superior alveolar nerves run in its walls) with a normal dental exam, and **tapping the maxilla** is painful. The sinus drains into the **middle meatus** (hiatus semilunaris).",
  ]);
  add("an-nose", "Middle ear", [
    "Hearing loss + loss of taste + drooling on one side: a tumour compressing VII and VIII at the **internal acoustic meatus**.",
  ]);
  add("an-nose", "Pouches, clefts", [
    "**3rd pouch**: dorsal part → **inferior** parathyroid; ventral part → **thymus**, so an absent thymus (DiGeorge) points to the **3rd** pouch. **4th pouch** → **superior** parathyroid. 1st pouch → tubotympanic recess (middle ear, auditory tube). 2nd pouch → palatine tonsil.",
  ]);

  /* ───────────── PHYSIOLOGY ───────────── */
  add("ph-synapse-mechanism", "Structure: knob, cleft, receptors", [
    "The CNS connects to the periphery through somatic motor, **preganglionic** autonomic and sensory (somatic and visceral) fibres. **Postganglionic autonomic** fibres start **outside** the CNS, in ganglia, so they are the 'except'.",
    "**Synaptic knobs** are the ends of **axons**, not dendrites. They **synthesize** small-molecule transmitters locally and release them by **exocytosis**, not by diffusion through the membrane. Their Ca²⁺ channels are **voltage-gated**, not ligand-gated.",
  ]);
  add("ph-synapse-mechanism", "Release: calcium is the trigger", [
    "Release depends on **Ca²⁺ influx** into the knob through **voltage-gated** channels that open with the **depolarization** of the AP, not during repolarization. Extracellular Ca²⁺ is about 10,000× the intracellular level. Vesicles carry **v-SNAREs** (synaptobrevin) that zip with the **t-SNAREs** (syntaxin, SNAP-25) of the knob membrane to fuse. Acetylcholinesterase breaks down ACh; it has nothing to do with release.",
  ]);
  add("ph-synapse-mechanism", "Receptors: ionotropic vs metabotropic", [
    "Postsynaptic receptors are **ligand-gated** channels (ionotropic) or **G-protein-coupled** receptors (metabotropic); the latter often open **G-protein-regulated K⁺ channels**. A **voltage-gated Cl⁻ channel** is not a transmitter receptor. ⚠ One bank item keys 'G-protein-regulated K⁺ channels' as the exception; by standard teaching the odd one out is the voltage-gated Cl⁻ channel.",
  ]);
  add("ph-synapse-mechanism", "Termination, and the resting membrane", [
    "At rest the **K⁺ concentration gradient pushes K⁺ out** of the cell. Na⁺ is **higher outside**, and Cl⁻ is also higher outside. A more negative RMP (hyperpolarization) makes the neuron **less** excitable.",
  ]);
  add("ph-synapse-properties", "Properties of synaptic transmission", [
    "Chemical synapses conduct in **one direction only, pre → post**: transmitter is released only from the knob, and the receptors sit on the postsynaptic membrane. Transmitter does not pass **into** the postsynaptic neuron. Chemical synapses are far more numerous in the **CNS** than in the periphery.",
    "**Synaptic delay** is the time for release, diffusion, binding and ion flow; its minimum in the CNS is **≈ 0.5 ms**. It is not set by the type of transmitter or the number of receptors.",
  ]);
  add("ph-synapse-properties", "Factors", [
    "**Alkalosis raises** neuronal excitability (tetany, even convulsions); **acidosis depresses** it (coma). So 'alkalosis depresses synaptic transmission' is the false statement. Repetitive stimulation gives post-tetanic potentiation, and transmission adapts to the body's needs.",
  ]);
  add("ph-synaptic-potentials", "EPSP: a local partial depolarization", [
    "A shift from −65 to −55 mV is a **depolarization of +10 mV = an EPSP of +10 mV**. Whether a transmitter excites or inhibits is decided by its **postsynaptic receptor**: ACh excites skeletal muscle but slows the heart.",
    "A synaptic potential is **graded**, carried by **ligand-gated** channels with Na⁺ and K⁺ currents flowing at the same time. A **depolarizing** potential is excitatory; GABA binding gives an IPSP. ⚠ One bank key says the EPSP is due to **voltage-gated** Na⁺ channels. Standard teaching: **ligand-gated** channels; the voltage-gated ones fire the action potential at the initial segment.",
  ]);
  add("ph-synaptic-potentials", "IPSP and summation", [
    "An EPSP and an IPSP arriving together: the membrane change is their **algebraic summation**.",
    "The micturition reflex is shaped by bladder-wall **stretch receptors**, **facilitatory and inhibitory brainstem** centres and **voluntary cortical** control. There is **no voluntary control from the brainstem**.",
  ]);
  add("ph-synaptic-potentials", "Presynaptic inhibition", [
    "Presynaptic inhibition = **less transmitter released** by the presynaptic knob (less Ca²⁺ entry after an axo-axonic GABA synapse). The postsynaptic membrane is **not** hyperpolarized.",
  ]);
  add("ph-sensory-receptors", "The receptor potential", [
    "Receptor potentials are **graded** by stimulus strength, local and non-propagated, so they are not action potentials. The usual mechanism is **increased Na⁺ influx** as the stimulus opens cation channels, moving the membrane **towards** threshold.",
  ]);
  add("ph-sensory-receptors", "Coding stimulus strength", [
    "A stronger stimulus gives a **larger receptor potential** → a higher AP frequency, plus recruitment of more receptors. The conduction velocity of the fibre does **not** change, and the threshold is not lowered.",
  ]);
  add("ph-sensory-code", "Sensory coding", [
    "**Phantom limb pain** after losing the right hand: fibres from **neighbouring** sensory areas (face, arm) grow into the **right-hand area of the left S1**, so their input is felt 'in the hand'.",
  ]);
  add("ph-sensory-code", "Touch, two-point discrimination", [
    "Better two-point discrimination = a **smaller** threshold distance = **smaller receptive fields** (the two are inversely related). It is best **distally** (fingertips, lips) and does not depend on the receptor type.",
  ]);
  add("ph-sensory-code", "Proprioception", [
    "Proprioception = static **position** sense + the **rate of movement** (kinesthesia), carried by large **Aβ (and Aα)** fibres. **Aδ** fibres carry fast pain and cold, so 'afferents of Aδ fibres' is the exception.",
  ]);
  add("ph-sensory-code", "Thermal sensations", [
    "**Cold** fibres fire maximally at about **25 °C**; **warm** fibres at about 40–43 °C. Below about 10–15 °C **cold-pain** fibres fire, above about 45 °C **heat-pain** fibres.",
  ]);
  add("ph-sensory-pathways", "Dorsal column", [
    "**Right hemisection at C2** → the **right** hand loses **vibration, fine touch, position sense and movement** (dorsal column + corticospinal, both uncrossed at that level); pain and temperature are lost on the **left**.",
    "Kinesthetic (movement and position) signals end mainly in the **postcentral gyrus**; the thalamus (VPL) is only a relay.",
  ]);
  add("ph-sensory-pathways", "Anterolateral", [
    "**Ventral** spinothalamic tract: **crude touch and pressure**; **lateral**: pain and temperature. The lateral tract is made mainly of **second-order** fibres that have crossed, so they carry information from the **opposite** side of the body; they end in the thalamus.",
  ]);
  add("ph-sensory-pathways", "Somatosensory cortex", [
    "A **postcentral gyrus** lesion causes contralateral loss of touch **localization**, two-point discrimination, judging **weight** and **texture** (astereognosis), but **no paralysis**: movement belongs to area 4.",
  ]);
  add("ph-sensory-lesions", "Dorsal column lesions and tabes", [
    "**Tabes dorsalis** (neurosyphilis) destroys the dorsal roots and dorsal columns → loss of position sense → **sensory ataxia**: incoordination of voluntary movement, a stamping gait that worsens in the dark, positive Romberg. Crude touch is kept. It is **not** a viral ganglionitis (that is herpes zoster), and it does not cause a shuffling gait (that is Parkinson's).",
  ]);
  add("ph-pain-control", "The analgesia system", [
    "The **raphe magnus** → dorsal horn fibres use **serotonin**; they excite enkephalin interneurons, which block pain transmission. After an injury, **substance P**, the transmitter of the slow (C) pain fibres, is the substance linked to the pain.",
  ]);
  add("ph-pain-control", "Gate control", [
    "Rubbing or touching the skin inhibits pain through large **Aβ** fibres (gate control at the dorsal horn).",
  ]);
  add("ph-pain", "Nociceptors", [
    "Pain receptors are **free nerve endings**, not encapsulated, and show **little or no adaptation** (they may even sensitize). Pain itself triggers reactions that **block** pain transmission (the analgesia system). Pain keeps you awake because the ascending pain pathways excite the **reticular activating system**.",
    "Reactions to pain: tachycardia, withdrawal reflexes, depression. Nociceptors do **not** stop firing in chronic painful conditions.",
  ]);
  add("ph-pain", "Fast and slow pain", [
    "**Fast pain** is **sharp** and pricking, carried by **Aδ** fibres (6–30 m/s) up the neospinothalamic tract, and **well localized**. **Slow pain** is aching, carried by **C fibres** (0.5–2 m/s) up the paleospinothalamic tract, and ends in the **substantia gelatinosa**; **ischemic pain** is this type. Fast and slow fibres synapse on **different** dorsal-horn neurons (lamina I vs II–III).",
  ]);
  add("ph-pain", "Cutaneous and deep pain", [
    "**Cutaneous pain** is sharp and well localized, carried by **Aδ** (and C) fibres. It is not 'always' followed by hyperalgesia, and it does not travel in the spinocerebellar tracts. **Deep** pain is the kind that evokes reflex spasm of nearby muscles.",
  ]);
  add("ph-pain", "Visceral pain", [
    "Viscera are insensitive to **cutting**: a scalpel through the gut wall causes no pain. They are very sensitive to **distension, ischemia, chemicals (acid), inflammation and strong contraction** behind an obstruction.",
  ]);
  add("ph-pain", "Hyperalgesia", [
    "**Primary hyperalgesia** occurs in the injured skin itself, e.g. **sunburn**, with a **lowered** pain threshold. **Secondary** hyperalgesia occurs in the normal skin around it (central sensitization). The thalamic syndrome is central pain.",
  ]);
  add("ph-spinal-reflexes", "Muscle spindle", [
    "**Primary (Ia, annulospiral)** endings supply the central receptor area of **both nuclear-bag and nuclear-chain** fibres; **secondary (II, flower-spray)** endings lie mainly on **nuclear-chain** fibres. So nuclear-bag fibres = **Ia**; nuclear-chain = **Ia + II**. γ-efferents supply the contractile **polar ends**, not the central zone.",
    "The spindle is the receptor with **both afferent and efferent** nerves. It measures **length**; the Golgi tendon organ measures **tension**. Proprioception reaches the brain by the dorsal columns, spinocerebellar and olivocerebellar paths, **not** the spinothalamic system.",
  ]);
  add("ph-spinal-reflexes", "γ-motor neurons", [
    "γ discharge keeps the spindle taut, so it keeps signalling while the muscle shortens: **α–γ co-activation**. It is what lets the spindle work during voluntary movement. Cutting the γ supply **relaxes** the intrafusal fibres, and spindle discharge falls. Spindle discharge rises with γ discharge or any stretch; it **falls** when α discharge alone shortens the muscle.",
    "To **stabilize a joint** (Guyton), the brain-stem (bulboreticular) centres **raise γ drive to the spindles of the muscles on both sides of the joint**: both spindles fire, both muscles contract reflexly against each other, and the joint is held tense. ⚠ The bank keys this twice differently ('↑ γ to postural muscles' and 'α–γ co-activation'); the app accepts the γ answers in both.",
  ]);
  add("ph-spinal-reflexes", "Stretch reflex, tendon jerks", [
    "Tendon-jerk centres: **biceps C5–C6**, triceps C6–C7 (C7–C8), knee L3–L4, ankle S1–S2; the jaw jerk is in the **pons** (V). **Decreased tone** = **LMN lesion** (also cerebellar lesions). Tone rises with γ activation, anxiety, Parkinsonism and UMN lesions.",
    "Correct pairings: **stretch reflex – muscle spindle**; autogenic (inverse stretch) inhibition – **Golgi tendon organ**. Reciprocal inhibition is a spinal circuit, not a receptor.",
  ]);
  add("ph-spinal-reflexes", "Spinal cord transection", [
    "**Spinal shock** = **failure of all spinal reflexes below the lesion** (areflexia, flaccidity). Jerks are **not** exaggerated at this stage; that comes later.",
  ]);
  add("ph-spinal-reflexes", "Decerebrate rigidity", [
    "Decerebrate rigidity is **γ-rigidity**: it runs through the γ loop, so **cutting the dorsal roots** abolishes it.",
  ]);
  add("ph-vestibular", "Semicircular canals", [
    "**Coplanar pairs**: the two horizontal canals, and the **anterior canal of one side with the posterior canal of the other side**. **Caloric** testing stimulates **one canal (the horizontal) in one ear** at a time.",
    "Turning the head **to the right** excites the **right horizontal** canal: endolymph lags, the stereocilia bend **towards** the kinocilium, and the hair cells depolarize. At the **start** of rotation **to the left**, the lagging endolymph bends the cupulae of **both** sides **to the right**, and firing rises in the **left** vestibular nerve.",
  ]);
  add("ph-vestibular", "Maculae", [
    "The maculae (otolith organs) sense **head tilt (gravity)** and **linear** acceleration. Their discharge pattern **changes with every head position**; they are not stimulated by endolymph flow or angular acceleration.",
  ]);
  add("ph-vestibular", "Nystagmus", [
    "Slow rotation to the **right**: both eyes drift **slowly left** (the slow, vestibulo-ocular phase that keeps the image focused), then **jerk quickly right** (the fast phase).",
    "When rotation to the right **stops**, the endolymph keeps moving and now excites the canals of the **opposite (left)** side. That is why the **post-rotational** changes in tone and the past-pointing come from the SCCs **opposite** to the rotation.",
  ]);
  add("ph-inner-ear", "Endolymph, perilymph", [
    "**Endolymph** fills the **membranous labyrinth** (scala media). It is **K⁺-rich**, like intracellular fluid, is made by the **stria vascularis**, and carries the **+80 mV endocochlear potential**. It bathes the **tops** (stereocilia) of the hair cells; **perilymph** (scala vestibuli and **scala tympani**) bathes their bases. The hair cells are about −70 mV inside, ≈ −150 mV relative to the **endolymph** (not the perilymph).",
  ]);
  add("ph-inner-ear", "Basilar membrane", [
    "The **round window** is the **pressure-relief valve** of the cochlea; the stapes sits in the **oval** window. The basilar membrane moves as a **travelling wave**. Its fibres are short and stiff at the **base** (high frequencies) and long and floppy at the **apex** (low frequencies).",
    "**Pitch** = the **place** of maximum displacement. **Loudness** = a larger **amplitude** of vibration → more hair cells and higher firing rates.",
  ]);
  add("ph-inner-ear", "Inner and outer hair cells", [
    "**Inner** hair cells (~3,500) provide **~95% of the afferent** fibres. **Outer** hair cells (~12,000) are **motile** (prestin) and **modify / amplify** basilar-membrane movement; they receive most of the efferents. Hair cells **depolarize** when the basilar membrane moves **up** (towards the scala vestibuli).",
  ]);
  add("ph-middle-ear", "Middle ear amplification", [
    "The primary function of the ossicles is to **amplify** sound pressure (impedance matching, ≈ 20×, from the drum : oval window area ratio × lever).",
  ]);
  add("ph-umn-lmn", "UMN vs LMN", [
    "**Hypertonia + hyperreflexia** = **UMN** lesion. In a UMN lesion the paralysed muscles respond **normally** to electrical stimulation, because the LMN is intact.",
    "A long-standing **LMN** lesion gives **wasting**, fasciculation, flaccidity, areflexia and **loss of the withdrawal reflex**. The denervated muscle **spreads (increases)** its ACh receptors (denervation supersensitivity), so 'decreased number of receptors' is the exception. Poliomyelitis is an LMN disease. ⚠ One bank item keys 'LMN lesion is accompanied with **clonus**'; clonus is a **UMN** sign, and 'can result from poliomyelitis' is the true statement.",
  ]);
  add("ph-basal-ganglia", "Circuits and transmitters", [
    "**Subthalamic nucleus → GPi: glutamate (excites)**; GPi → thalamus: GABA (inhibits); SNc → striatum: **dopamine**; SNr: GABA; striatal interneurons: ACh. Basal-ganglia output goes **directly to the VA/VL thalamic nuclei**, not straight to the cortex or to LMNs.",
  ]);
  add("ph-basal-ganglia", "Hyperkinetic", [
    "**Huntington's disease**: loss of the intrastriatal **GABAergic (and cholinergic)** neurons of the **caudate and putamen** → chorea plus depression, irritability and dementia (autosomal dominant, CAG repeats).",
  ]);
  add("ph-cerebellum", "Three functional parts", [
    "**Archicerebellum** = the **oldest** part = **flocculonodular lobe** (vestibular: equilibrium). Paleocerebellum = vermis and paravermis (spinocerebellum: tone, posture). Neocerebellum = lateral hemispheres (cerebrocerebellum: planning, timing). Purkinje cells lie in the **cortex**, not in the deep nuclei. The cerebellum reaches the motor cortex **through the thalamus** (no direct projection). Hemiballismus is **subthalamic**.",
  ]);
  add("ph-cerebellum", "Cerebellar lesions", [
    "Cerebellar disease causes **ataxia** (a drunken gait), intention tremor, dysmetria, dysdiadochokinesia, **hypotonia**, pendular jerks, **scanning speech** and nystagmus. It never causes resting tremor, rigidity or akinesia (those are basal ganglia). Signs are **ipsilateral**: each cerebellar hemisphere controls and receives input from the **same side** of the body.",
    "Motor (cerebellar) ataxia differs from sensory ataxia by the **speech disorder**, and because **vision does not correct it**. Sensory ataxia is compensated by vision and worsens with the eyes closed.",
  ]);
  add("ph-sleep", "EEG waves", [
    "**Alpha** (8–13 Hz): awake, relaxed, eyes closed. **Beta** (> 14 Hz): alert, thinking, eyes open. **Theta** (4–7 Hz): normal in **children**, drowsiness, emotional stress. **Delta** (< 4 Hz): **deep slow-wave sleep**. REM sleep shows desynchronized, beta-like waves.",
  ]);
  add("ph-speech", "Broca's", [
    "A stroke in the frontal speech centre (Broca's area 44/45) causes **failure to coordinate the speech muscles**. The patient understands but speaks **slowly and with great difficulty**; the lips and tongue are **not paralysed**. **Wernicke's** (temporal) aphasia is the one with poor comprehension and wrong word choice. Language sits in the **left** hemisphere in almost all right-handers and in most left-handers.",
  ]);
  add("ph-memory", "Short-term synaptic changes", [
    "**Post-tetanic potentiation** = a build-up of **Ca²⁺ in the presynaptic knob** after rapid repetitive stimulation → more release. **Sensitization** = **presynaptic facilitation** by a serotonergic facilitator neuron synapsing axo-axonally → **more** transmitter released. **Habituation** = fewer Ca²⁺ channels open → less release.",
  ]);
  add("ph-memory", "Hippocampus, LTP", [
    "The **NMDA receptor** is a **glutamate-gated Ca²⁺ (and Na⁺) channel**, blocked by Mg²⁺ at rest; it is **not a K⁺ channel**. It is present in hippocampal neurons and is central to LTP, learning and memory.",
  ]);
  add("ph-eye-fluid", "Aqueous humour", [
    "Aqueous humour is **actively secreted** by the ciliary processes. It nourishes the avascular **lens and cornea** (not the retina) and is the **main regulator of intraocular pressure** (normal ≈ 10–21 mm Hg). IOP is set by the **outflow resistance of the trabecular meshwork**, so IOPs of 22 and 25 mm Hg with eye pain mean **increased trabecular resistance**.",
    "⚠ One bank item keys 'raised IOP **prevents near vision**'. Standard teaching: raised IOP damages the **optic nerve** (visual-field loss, cupping). It is not the vitreous pressure and does not change lens power; cataract is a separate disease.",
  ]);
  add("ph-eye-fluid", "Glaucoma", [
    "In **closed-angle** glaucoma the iris root blocks the **angle / trabecular meshwork**; the canal of Schlemm itself is not closed, which makes that the 'except'. It gives a very high IOP, severe headache and eye pain, blurred vision, halos and a **mid-dilated** pupil.",
  ]);
  add("ph-optics", "Refractive power", [
    "Three coats: **outer fibrous** (the **sclera, opaque and white**, plus the cornea); **middle vascular** uvea (choroid **rich** in pigment and vessels, ciliary body, iris); **inner** retina with the **photoreceptors**. Total power ≈ **59 D**: cornea ≈ 43 D, lens ≈ 20 D. The **cornea**, not the lens, is the main refracting surface.",
  ]);
  add("ph-refraction", "Accommodation", [
    "Looking up from your book to a friend across the room: the ciliary muscle **relaxes**, the zonule tightens and the **lens becomes thinner**. Accommodation changes the **lens**, not the cornea. Near vision = ciliary **contraction**, controlled **only by parasympathetic** fibres (III). For far vision the pupil **dilates**.",
  ]);
  add("ph-refraction", "Cornea and lens", [
    "Corneal transparency comes from its non-keratinized epithelium, **avascularity**, regular collagen, **relative dehydration** (the endothelial pump) and **unmyelinated** nerves. So 'supplied by **myelinated** fibres' is the exception.",
  ]);
  add("ph-refraction", "Errors of refraction", [
    "**Myopia**: a long eye or too much power. Near objects focus on the retina **without accommodation**; corrected with a **concave (diverging)** lens. **Hypermetropia**: the eye is often **shorter** than normal and parallel rays focus **behind** the retina, so it must accommodate even for distance. Corrected with a **convex** lens; its near point moves **further away**.",
  ]);
  add("ph-retina", "Rods vs cones", [
    "**Blobs** are clusters of cells in **layers 2–3 of the primary visual cortex**, rich in **cytochrome oxidase**, that process colour.",
  ]);
  add("ph-retina", "Rhodopsin and phototransduction", [
    "**Rhodopsin = scotopsin + 11-cis retinal.** Light converts **11-cis → all-trans** retinal → **metarhodopsin II** activates the G protein **transducin** → phosphodiesterase → **cGMP falls** → cGMP-gated Na⁺ channels **close** → Na⁺ entry to the outer segment falls → **hyperpolarization** → **less** transmitter released.",
    "The **dark current** is the **influx of Na⁺ through cGMP-gated** channels in the outer segment. Turning all-trans back into 11-cis retinal needs **no light** (an isomerase does it).",
  ]);
  add("ph-color-vision", "Colour vision and acuity", [
    "Colour is read from the **ratio of stimulation of the three cone types**, not from rods. It needs the visual cortex, is best at the **fovea**, and is lost in dim light. **Full dark adaptation takes ≈ 40 min**, not 10. In a **dark-adapted** eye, acuity is best in the **periphery**, where the rods are.",
  ]);
  add("ph-uveal", "Iris muscles and the light reflex", [
    "The light reflex runs through the **pretectal nucleus and Edinger-Westphal** (midbrain), not the visual cortex. Light in one eye constricts **both** pupils (direct + consensual). It is **lost in neurosyphilis** (Argyll Robertson pupil), and it is used to judge the **depth of anaesthesia**.",
  ]);

  /* ───────────── HISTOLOGY ───────────── */
  add("hi-nervous-tissue", "Nerve fibres and the peripheral nerve", [
    "'Nerve fibre' means the **axon** with its sheaths. **Unmyelinated** fibres wrapped by Schwann cells are the **postganglionic sympathetic** and C fibres. **Epineurium** is the dense C.T. around the whole nerve. **Perineurium** is layers of flattened epithelioid cells joined by **tight** junctions, which form the blood–nerve barrier. The **endoneurium / sheath of Henle** is delicate **reticular fibres** around each fibre, laid down by the Schwann cells (department teaching).",
  ]);
  add("hi-nervous-tissue", "Ganglia, degeneration", [
    "In **Wallerian degeneration** (distal to a cut), the myelin breaks into ovoids inside **'fermentation (digestion) chambers'**. **Chromatolysis** and the eccentric nucleus are **cell-body** changes (retrograde), not Wallerian. **Myelin** stains with osmic acid or Luxol fast blue; **silver** stains axons and neurofibrils.",
  ]);
  add("hi-cns", "Grey matter, white matter", [
    "The CNS is soft because it **contains no connective tissue**: neuroglia support it instead.",
  ]);
  add("hi-cns", "Spinal cord tracts on a section", [
    "Loss of **pain in the right foot** → a lesion of the **left lateral spinothalamic** tract (it has crossed). The **sulcomarginal and reticulospinal** tracts are present at **all** levels. The tectospinal tract starts in the **superior colliculus**, not the red nucleus; the rubrospinal is not limited to lumbar levels; the olivospinal is a **single** tract (cervical).",
    "A **right gracile nucleus** lesion → loss of fine touch and **proprioception in the right leg** (the fibres have not crossed yet). **Corticobulbar** fibres pass through the **genu** of the internal capsule.",
  ]);
  add("hi-cns", "Medulla: arcuate fibres", [
    "The **spinal lemniscus** is formed by the union of the **lateral and ventral spinothalamic** tracts (the 'structure 1' of the section item). The **spinotectal** tract serves **spino-visual reflexes**. The **trigeminal lemniscus** is seen in the **pons and midbrain**.",
  ]);
  add("hi-cns", "Cerebellar cortex", [
    "**Golgi cells** send their dendrites through **all layers** of the cortex. Granule cells have **short, claw-like** dendrites. Each Purkinje cell gets an **excitatory** input from **one climbing fibre**. Purkinje cells are **multipolar** (flask-shaped) and lie in one row.",
  ]);
  add("hi-cns", "Meninges and the blood", [
    "The **arachnoid** = **border cells** (outer, joined by tight junctions) + **trabecular cells** (bridging the subarachnoid space). **Border cells** are found in the **arachnoid**. The subarachnoid space lies between the **arachnoid and the pia**, not between dura and arachnoid.",
  ]);
  add("hi-cns", "Clinical correlation: tabes", [
    "**Tabes dorsalis** (a syphilitic man with an unsteady gait and hypotonia) = degeneration of the **gracile and cuneate tracts** (dorsal columns), after damage to the dorsal root entry zones in the lower thoracic and lumbosacral cord.",
  ]);
  add("hi-eye", "The ten retinal layers", [
    "**Inner nuclear layer** = nuclei of **bipolar, horizontal, amacrine and Müller** cells. The nerve-fibre layer is **unmyelinated** ganglion-cell axons. The **outer limiting membrane** = junctions between **photoreceptors and Müller cells**. The inner limiting membrane = Müller endfeet + basal lamina. The outer plexiform layer holds the photoreceptor–bipolar/horizontal synapses; bipolar–ganglion synapses are in the **inner** plexiform layer. **Ganglion cells** carry the signal to the brain.",
  ]);
  add("hi-eye", "Cornea: five layers", [
    "Corneal grafts are rarely rejected because the cornea is **avascular and has no lymphatic drainage** (immune privilege).",
  ]);
  add("hi-eye", "Lens and accommodation", [
    "**Presbyopia** = the lens (and its capsule) **losing elasticity** with age. **Cataract** = the lens **losing transparency**. The lens is **avascular and has no nerves**. Its subcapsular epithelium lies only on the **anterior** surface, and it hangs from the **ciliary body** by the zonule, not from the iris.",
  ]);
  add("hi-ear", "Inner ear: bony and membranous", [
    "The **cochlea** is a **bony** tube of **2½–2¾ turns** around the bony axis, the **modiolus**, which holds the **spiral (cochlear) ganglion**. **Perilymph** fills the scala vestibuli and **scala tympani**. Endolymph fills the scala media, utricle and saccule.",
  ]);
  add("hi-ear", "Maculae and cristae", [
    "The **cupula** on the crista ampullaris is a thick gelatinous proteoglycan membrane **without CaCO₃ crystals**. The **otolithic membrane** of the maculae **has** otoconia. Cristae register **angular** acceleration; maculae register linear acceleration and gravity.",
    "The maculae have **type I (flask) and type II (cylindrical)** hair cells, each with stereocilia + **one kinocilium** (microtubules, not actin). Supporting cells have **microvilli**, not motile cilia. The utricular and saccular maculae lie at **right angles**.",
  ]);
  add("hi-ear", "Deafness", [
    "A **cochlear implant** is for sensorineural deafness from the **loss of cochlear hair (sensory) cells**; it stimulates the spiral ganglion directly.",
  ]);
  /* ───────────── PHYSIOLOGY: new sections (syllabus completeness) ───────────── */
  sec("ph-synapse-mechanism", "Termination, and the resting membrane", {
    h: "Types of synapses and transmitters", pic: ["Electrical synapse", "Neurotransmitter"],
    p: [
      "**Chemical** synapses (most CNS synapses): one-way, with a synaptic delay, fatigable, modifiable. **Electrical** synapses are **gap junctions**: current flows **both ways** with **no delay** (cardiac and smooth muscle, some brainstem and retinal neurons).",
      "By site: **axodendritic** (commonest, usually excitatory), **axosomatic** (often inhibitory), **axo-axonic** (presynaptic inhibition or facilitation).",
      "**Small-molecule, rapidly acting** transmitters are made in the knob and recycled: ACh; the amines noradrenaline, dopamine, serotonin and histamine; the amino acids **glutamate** (the main excitatory one), **GABA** and **glycine** (inhibitory); NO. **Neuropeptides** (substance P, endorphins, enkephalins) are made on ribosomes in the **cell body**, carried down by axonal transport, and act slowly and for long.",
      "A transmitter is removed by **diffusion**, **enzymatic destruction** (e.g. acetylcholinesterase) or **reuptake** into the knob (amines, amino acids).",
    ],
    why: "Speed comes from small transmitters made on the spot; long-lasting effects come from peptides shipped from the soma.",
    trap: "Electrical synapses are bidirectional with no delay; chemical synapses are one-way.",
    q: ["Name the main excitatory and the two main inhibitory transmitters of the CNS.", "Glutamate; GABA (mainly brain) and glycine (mainly spinal cord)."],
  });
  add("ph-synapse-properties", "Properties of synaptic transmission", [
    "Other properties: **convergence and divergence**; **summation**, either **spatial** (many knobs at once) or **temporal** (rapid firing of one knob); **facilitation** (a subthreshold EPSP leaves the neuron easier to fire); **fatigue** (transmitter depletion, which limits the spread of epileptic fits); **after-discharge** (reverberating circuits); **occlusion** and the subliminal fringe.",
    "Drugs and states: caffeine and theophylline **raise** excitability; **strychnine** blocks glycine receptors → convulsions; anaesthetics depress; **hypoxia** depresses within seconds (unconsciousness in a few seconds of cerebral ischemia).",
  ]);
  add("ph-sensory-code", "Sensory coding", [
    "**Law of specific nerve energies (labelled line)**: the modality felt depends on the pathway and cortical area stimulated, not on how it is stimulated. **Weber–Fechner law**: perceived intensity rises with the **logarithm** of stimulus strength, and the just-noticeable difference is a constant **fraction** of the background.",
  ]);
  add("ph-sensory-code", "Touch, two-point discrimination", [
    "Tactile receptors: **Meissner** (rapidly adapting, fine touch, lips and fingertips); **Merkel discs** (slowly adapting, continuous touch, texture); **Ruffini** (slowly adapting, skin stretch, joint angle); **Pacinian** (very rapidly adapting, **vibration 30–800 Hz**, deep pressure); hair end-organs (hair movement). Vibration is carried in the **dorsal columns**.",
  ]);
  add("ph-sensory-lesions", "Syringomyelia", [
    "**Syringomyelia**: a cavity round the central canal (usually lower cervical) cuts the **crossing fibres** of the lateral spinothalamic tracts → **dissociated** loss of pain and temperature in a **cape** (shoulders, arms) with touch spared; burns go unnoticed. When the cavity extends into the anterior horns: **LMN** wasting of the hand muscles.",
    "**Thalamic syndrome** (posterolateral thalamus, often posterior cerebral artery): contralateral loss of sensation, then **severe spontaneous 'thalamic' pain**, over-reaction to stimuli, astereognosis.",
  ]);
  sec("ph-pain", "Fast and slow pain pathways", {
    h: "Pain chemistry, the dorsal-horn laminae and the two tracts", l: "T019", pic: ["Bradykinin", "Substantia gelatinosa of Rolando"],
    p: [
      "Stimuli: **mechanical, thermal** (above ~45 °C, where tissue starts to be damaged) and **chemical**. Pain chemicals: **bradykinin (the most potent)**, serotonin, histamine, K⁺, acids, ACh, proteolytic enzymes. **Prostaglandins and substance P sensitize** the receptors, which is why NSAIDs relieve pain. Pain intensity follows the **rate of tissue damage**.",
      "**Fast (Aδ)** fibres end in **lamina I** (and V) → cross → **neospinothalamic** tract → **VPL thalamus** → somatosensory cortex: the '**where**'. **Slow (C)** fibres end in **laminae II–III (substantia gelatinosa)** → interneurons → **paleospinothalamic** tract → brainstem **reticular formation**, periaqueductal grey, **intralaminar thalamic** nuclei: the diffuse '**how bad**' plus arousal.",
      "Transmitters: fast pain fibres use **glutamate**; slow pain fibres use **substance P** (with glutamate).",
      "Pain can still be perceived after removal of the somatosensory cortex: perception starts at the thalamic level; the cortex localizes and interprets.",
    ],
    why: "Two systems: a fast 'where' system and a slow 'how much it hurts' system.",
    trap: "Bradykinin causes pain directly; prostaglandins mainly sensitize, which is why NSAIDs work.",
    q: ["Where do slow C pain fibres end in the dorsal horn, and what do they release?", "Laminae II–III (substantia gelatinosa); substance P (with glutamate)."],
  });
  sec("ph-pain", "Visceral pain and referred pain", {
    h: "Referred pain: the map examiners use", l: "T022", pic: ["Referred pain", "Dermatome (anatomy)"],
    p: [
      "**Dermatomal rule**: pain is referred to the skin supplied by the **same spinal segment** as the organ, because visceral and skin afferents converge on the same dorsal-horn neurons.",
      "**Heart** → retrosternal and the **inner (ulnar) side of the left arm** (T1–T4). **Central diaphragm** → **shoulder tip** (C3–C5). Stomach/duodenum → epigastrium. **Appendix** → **umbilicus** first (T10), then the right iliac fossa once the parietal peritoneum is involved. **Gall bladder** → right hypochondrium and **right scapula**. **Kidney/ureter** → **loin to groin** and testis (T10–L1). **Testis** → umbilical region.",
      "True visceral pain is dull and poorly localized, with nausea, sweating and pallor. Once the **parietal** peritoneum or pleura is involved (somatic nerves), the pain becomes sharp and localized.",
    ],
    why: "The brain learned to read those dorsal-horn neurons as skin, so visceral input is 'felt' in the matching dermatome.",
    trap: "Appendicitis starts at the umbilicus (visceral) and moves to the right iliac fossa (parietal).",
    q: ["Where is pain from the diaphragm referred, and why?", "To the shoulder tip: the diaphragm (phrenic, C3–C5) and the shoulder skin (supraclavicular, C3–C4) share segments."],
  });
  sec("ph-vestibular", "Nystagmus", {
    h: "Vestibular reflexes, pathways, tests and motion sickness", l: "T042", pic: ["Vestibulo-ocular reflex", "Caloric reflex test"],
    p: [
      "Vestibular nerve → **vestibular nuclei** (medulla/pons) → the **flocculonodular lobe**; the **medial longitudinal fasciculus** to III, IV and VI (the vestibulo-ocular reflex); the **spinal cord** (the lateral vestibulospinal tract drives extensor, antigravity tone); the reticular formation; the thalamus → cortex (conscious orientation).",
      "Reflexes: the **vestibulo-ocular reflex** keeps gaze steady while the head moves; **vestibulospinal/righting** reflexes extend the limbs towards the side of a fall; **tonic labyrinthine** reflexes change tone with head position.",
      "Tests: the **caloric** test (water in one ear makes the endolymph convect → nystagmus; the fast phase goes to the **opposite** side with cold and the **same** side with warm: 'COWS'); the **rotating (Bárány) chair**.",
      "Sudden loss of one labyrinth → vertigo, nystagmus and falling **towards the side of the lesion**, compensated later by vision and the other side. **Motion sickness** = a conflict between vestibular and visual input → nausea, vomiting and pallor, through the vomiting centre / chemoreceptor trigger zone.",
    ],
    why: "The vestibular system tells the eyes and the antigravity muscles how the head is moving, so vision and posture stay steady.",
    trap: "Cold → fast phase to the Opposite side; Warm → Same side (COWS).",
    q: ["Cold water in the right ear: which way does the fast phase of nystagmus beat?", "To the left (cold → opposite)."],
  });
  sec("ph-inner-ear", "Inner and outer hair cells", {
    h: "The auditory pathway, sound localization and deafness tests", l: "T042", pic: ["Auditory system", "Rinne test"],
    p: [
      "Hair cells → **spiral ganglion** (1st neuron) → **cochlear nuclei** (dorsal and ventral: 2nd) → **superior olivary nuclei** of **both** sides → **lateral lemniscus** → **inferior colliculus** → **medial geniculate body** → **primary auditory cortex (areas 41, 42; Heschl's gyrus)**. Each ear reaches **both** cortices, so a one-sided cortical lesion causes **no deafness**.",
      "**Sound localization**: the **medial superior olive** compares the **time delay** between the two ears (low frequencies); the **lateral superior olive** compares **intensity** differences (high frequencies).",
      "Range **20–20,000 Hz**; the ear is most sensitive at **1,000–4,000 Hz**. Loudness is measured in decibels.",
      "**Rinne test**: normal or sensorineural loss → air conduction > bone (positive); **conductive** loss → bone > air (negative). **Weber test** (fork on the forehead): goes to the **deaf ear in conductive** loss and to the **good ear in sensorineural** loss.",
      "**Conductive** deafness: wax, otitis media, otosclerosis (fixed stapes). **Sensorineural**: cochlear (noise, drugs such as streptomycin, age — **presbycusis** loses high frequencies first) or the nerve (acoustic neuroma).",
    ],
    why: "Both ears reach both cortices, so only bilateral central lesions cause deafness; the tuning-fork tests separate a conduction problem from a nerve problem.",
    trap: "In Weber, sound goes to the BAD ear in conductive loss but to the GOOD ear in sensorineural loss.",
    q: ["Weber lateralizes to the left and Rinne on the left is negative. Diagnosis?", "Left conductive deafness."],
  });
  add("ph-middle-ear", "Middle ear amplification", [
    "How it amplifies: the effective area of the drum (≈ 55 mm²) against the oval window (≈ 3.2 mm²) gives **≈ 17×**, and the ossicular lever **≈ 1.3×**, so **≈ 22×** in pressure. Without the ossicles, hearing drops by about **15–20 dB**.",
    "**Attenuation reflex**: loud sound → **stapedius (VII)** and **tensor tympani (V3)** contract after 40–80 ms. This protects the cochlea, masks low-frequency background noise and dampens your own voice. Stapedius paralysis (facial palsy) → **hyperacusis**. The **Eustachian tube** equalizes air pressure on both sides of the drum.",
  ]);
  add("ph-middle-ear", "Decibels", [
    "Decibel = 20 log (P / P₀) (or 10 log of intensity). 0 dB is the hearing threshold, normal speech is ≈ 60 dB, pain ≈ 120–140 dB. Each 20 dB is a 10× rise in sound pressure.",
  ]);
  sec("ph-cerebellum", "How it corrects movement", {
    h: "Cerebellar circuitry and its timing role", pic: ["Deep cerebellar nuclei", "Climbing fiber"],
    p: [
      "Inputs: **mossy fibres** (from the pons, spinal cord and vestibular nuclei) → granule cells → **parallel fibres** → Purkinje cells. **Climbing fibres** come from the **inferior olive**: one per Purkinje cell, very powerful, and used for motor learning.",
      "The **only output of the cerebellar cortex is the Purkinje cell**, which **inhibits (GABA)** the deep nuclei (dentate, emboliform, globose, fastigial) and the vestibular nuclei. The **deep nuclei** carry the cerebellum's excitatory output, e.g. dentate → superior peduncle → red nucleus / VL thalamus → motor cortex.",
      "Functions: it compares the intended movement (motor cortex) with the actual one (proprioception) → **error correction**; **damping** (no overshoot); **timing and sequencing** of rapid movements; **predicting** limb position; **motor learning**; balance (flocculonodular) and tone (vermis).",
      "Peduncles: **inferior** (mostly input: dorsal spinocerebellar, olivocerebellar, vestibulocerebellar); **middle** (input from the pontine nuclei, the largest); **superior** (mainly output; also the ventral spinocerebellar input).",
    ],
    why: "The cerebellum does not start movements; it smooths and times them by comparing the plan with the result.",
    trap: "Purkinje cells inhibit; the deep nuclei excite. A cerebellar lesion makes movement clumsy, not paralysed.",
    q: ["Which cell is the sole output of the cerebellar cortex, and what does it release?", "The Purkinje cell; GABA onto the deep cerebellar nuclei."],
  });
  sec("ph-basal-ganglia", "Circuits and transmitters", {
    h: "Direct and indirect pathways, and Parkinson's in detail", pic: ["Parkinson's disease", "Substantia nigra"],
    p: [
      "**Direct pathway** (releases movement): cortex → striatum (**D1** receptors, excited by dopamine) → inhibits **GPi/SNr** → the thalamus is released → cortical activity rises. **Indirect pathway** (brakes movement): striatum (**D2**, inhibited by dopamine) → GPe → **subthalamic nucleus** → GPi → more thalamic inhibition. So dopamine **promotes movement** through both routes.",
      "Functions: planning and scaling movements, cognitive control of motor patterns (the caudate loop), timing, and automatic execution of learned patterns such as handwriting.",
      "**Parkinson's disease** = loss of the **dopaminergic nigrostriatal** neurons (SNc) → **rigidity** (lead-pipe, **cogwheel** when tremor is added), **resting tremor** (pill-rolling, 4–6/s, gone in sleep and during movement), **akinesia/bradykinesia**, mask face, **festinant (shuffling) gait**, stooped posture. Treatment: **L-dopa** (crosses the BBB, dopamine does not) + carbidopa, dopamine agonists, MAO-B inhibitors, anticholinergics.",
      "**Athetosis** (slow writhing) → putamen/globus pallidus. **Hemiballismus** (violent flinging of one limb) → the **contralateral subthalamic** nucleus. **Chorea** (Huntington's) → striatal GABA/ACh neurons.",
    ],
    why: "Dopamine opens the gate for movement; losing it leaves the brakes on (akinesia, rigidity).",
    trap: "Parkinson's tremor is at REST; cerebellar tremor comes with INTENTION.",
    q: ["Why is L-dopa given rather than dopamine in Parkinson's disease?", "Dopamine cannot cross the blood–brain barrier; L-dopa can and is converted to dopamine in the brain."],
  });
  sec("ph-motor-cortex", "The corticospinal (pyramidal) tract", {
    h: "Motor areas map and the pyramidal tract in numbers", pic: ["Premotor cortex", "Supplementary motor area"],
    p: [
      "**Primary motor area (area 4)**: the precentral gyrus, with the body upside down (motor homunculus); the **face and hand** have the biggest areas. It holds the giant **Betz cells** (layer V). Stimulation gives discrete movements on the **opposite** side.",
      "**Premotor area (lateral area 6)** programs **complex, skilled patterns**, working through area 4 and the basal ganglia/thalamus. **Supplementary motor area (medial area 6)**: bilateral movements, **postural** fixation, **planning / mental rehearsal** of sequences. **Frontal eye field (area 8)**: voluntary conjugate eye movements to the **opposite** side. **Broca's area (44, 45)**: motor speech. **Exner's area**: hand skills (writing).",
      "Where the corticospinal tract comes from: ~**30% area 4**, ~**30% area 6** (premotor + SMA), ~**40% the somatosensory and parietal** areas. Betz-cell fibres are only ~**3%** (large and fast, ~70 m/s). About **80%** cross at the **pyramidal decussation** (lateral corticospinal tract); the rest descend uncrossed (anterior tract) and cross at segmental level.",
      "Lesions: area 4 → contralateral loss of **fine, skilled distal** movements (initially flaccid). Area 6 → **apraxia** (skilled patterns lost), grasp reflex. Frontal eye field → the eyes deviate **towards** the lesion.",
    ],
    why: "Area 4 executes, area 6 composes, the SMA rehearses; the sensory cortex steers through its share of the tract.",
    trap: "Betz cells are famous but give only ~3% of pyramidal fibres; most fibres come from outside area 4.",
    q: ["What share of corticospinal fibres come from area 4, and from the Betz cells?", "About 30% from area 4; Betz cells only about 3%."],
  });
  sec("ph-umn-lmn", "Pyramidal lesions", {
    h: "Signs in detail: spasticity, Babinski, fasciculation and the level of the lesion", pic: ["Babinski sign", "Fasciculation"],
    p: [
      "**UMN signs**: weakness of **groups** of muscles; **spasticity of the clasp-knife type** (resistance, then sudden give); **exaggerated tendon jerks and clonus**; **positive Babinski** (the big toe goes up, the others fan); **lost superficial reflexes** (abdominal, cremasteric); **no marked wasting** (disuse only); no fasciculation; normal nerve conduction.",
      "**LMN signs**: flaccid paralysis of **individual** muscles, **hypotonia**, **areflexia**, marked **wasting**, **fasciculations** (visible twitches of motor units), **fibrillation** on EMG, and the **reaction of degeneration** (the denervated muscle answers galvanic but not faradic current).",
      "Causes: UMN — internal capsule stroke (capsular hemiplegia), a cord lesion above the segment, multiple sclerosis. LMN — **poliomyelitis** (anterior horn cells), peripheral nerve injury. **Motor neuron disease (ALS)** gives both.",
      "At a cord lesion: **LMN** signs **at the level** (that segment's anterior horn cells) and **UMN** signs **below** it.",
    ],
    why: "The UMN is the brain's command line: lose it and the spinal reflex circuits run unchecked. The LMN is the final common path: lose it and the muscle loses both its drive and its trophic support.",
    trap: "Babinski and clonus = UMN; fasciculation and wasting = LMN.",
    q: ["Fasciculations and wasting in the hands plus spasticity and Babinski in the legs: diagnosis?", "Motor neuron disease (ALS): mixed LMN and UMN signs."],
  });
  sec("ph-arousal", "Hypothalamus: functions", {
    h: "Arousal chemistry and the hypothalamic centres", pic: ["Locus coeruleus", "Suprachiasmatic nucleus"],
    p: [
      "Arousal: sensory collaterals, especially **pain** and proprioception, excite the **reticular activating system** (the bulboreticular facilitatory area of the pons and midbrain) → **intralaminar thalamic nuclei** → diffuse cortical activation. A brainstem lesion of the RAS causes **coma**.",
      "Transmitter systems: **noradrenaline** (locus coeruleus: wakefulness, vigilance); **serotonin** (raphe nuclei: sleep, mood, pain control); **dopamine** (substantia nigra/VTA: movement, reward); **acetylcholine** (basal forebrain nucleus of Meynert; the pons for REM); **histamine and orexin** (hypothalamus: wakefulness).",
      "Hypothalamic centres: **temperature** (anterior → heat loss; posterior → heat gain); **hunger** (lateral) vs **satiety** (ventromedial nucleus); **thirst and ADH** (supraoptic/paraventricular); the **circadian clock** (suprachiasmatic nucleus); autonomic control (anterior → parasympathetic, posterior → sympathetic); emotional behaviour (rage, fear, with the limbic system); pituitary control.",
      "Lesions: ventromedial → overeating and obesity; lateral → refusal to eat; anterior → hyperthermia; posterior → loss of temperature control (poikilothermia).",
    ],
    why: "Staying awake needs a constant drive from the brainstem to the cortex; the hypothalamus holds the body's thermostat and appetite set-points.",
    trap: "The satiety centre is ventromedial and the feeding centre lateral; destroying the satiety centre makes the animal eat more.",
    q: ["Which hypothalamic lesion causes obesity?", "A ventromedial nucleus (satiety centre) lesion → hyperphagia and obesity."],
  });
  sec("ph-sleep", "Narcolepsy", {
    h: "Sleep cycles, how sleep is made, and the EEG in epilepsy", pic: ["Sleep cycle", "Absence seizure"],
    p: [
      "The night: sleep starts with **slow-wave (NREM) stages 1 → 4**, getting deeper (delta in stages 3–4), then **REM** every ~**90 min**. REM periods lengthen towards morning. REM is ≈ 25% of adult sleep and ≈ 50% in newborns. Total sleep falls with age.",
      "**Slow-wave sleep**: restful; BP, heart rate, breathing and metabolism fall by about 10–30%; growth hormone is released; dreams are not remembered. Night terrors, sleep-walking and bed-wetting happen here. **REM (paradoxical) sleep**: vivid, **remembered dreams**, **rapid eye movements**, **loss of muscle tone** (except the eye and breathing muscles), irregular heart rate and breathing, a **desynchronized, beta-like EEG**, raised brain metabolism; hard to arouse, yet waking happens spontaneously.",
      "How sleep is produced (active theory): **raphe (serotonin)** and other sleep-promoting areas inhibit the RAS; REM is triggered by **cholinergic pontine** neurons; the **suprachiasmatic nucleus** sets the circadian rhythm, with melatonin from the pineal.",
      "EEG in epilepsy: **grand mal** — high-voltage, fast discharges over the whole cortex with tonic–clonic fits; **petit mal (absence)** — the **3/s spike-and-dome** pattern; focal (Jacksonian) fits — a local discharge that marches across the motor cortex.",
    ],
    why: "NREM rests the brain; REM reactivates it with the body switched off.",
    trap: "REM is the stage with remembered dreams AND paralysed limbs; delta waves belong to deep NREM.",
    q: ["Name three features of REM sleep.", "Rapid eye movements, vivid remembered dreams, loss of muscle tone (also irregular heart rate and breathing, a desynchronized EEG)."],
  });
  sec("ph-speech", "Wernicke's", {
    h: "The language circuit and the other aphasias", pic: ["Arcuate fasciculus", "Conduction aphasia"],
    p: [
      "The circuit (dominant, usually left, hemisphere): hearing (area 41) → **Wernicke's area** (22, posterior superior temporal: **comprehension**) → **arcuate fasciculus** → **Broca's area** (44, 45: motor planning) → motor cortex for the face and larynx → speech. For reading: visual cortex → **angular gyrus** (39) → Wernicke's.",
      "**Wernicke's (sensory, fluent)**: fluent but meaningless speech (jargon), poor comprehension, the patient unaware. **Broca's (motor, non-fluent)**: slow, effortful, telegraphic speech, comprehension kept, patient aware and frustrated. **Conduction aphasia** (arcuate fasciculus): fluent, understands, but **cannot repeat**. **Global aphasia** (large left MCA stroke): both lost. **Angular gyrus** → **alexia and agraphia**.",
      "**Dysarthria** = weak or incoordinated speech **muscles** (cerebellar scanning speech, bulbar palsy) with normal language; it is not aphasia.",
      "Language is in the **left** hemisphere in ~95% of right-handers and ~70% of left-handers. The non-dominant hemisphere handles prosody, music, spatial sense and faces.",
    ],
    why: "Aphasia is a disorder of language (words and rules); dysarthria is a disorder of the speech muscles.",
    trap: "Broca's patients understand; Wernicke's patients speak fluently but do not understand.",
    q: ["A patient speaks fluently and understands, but cannot repeat a sentence. Where is the lesion?", "The arcuate fasciculus (conduction aphasia)."],
  });
  sec("ph-memory", "Hippocampus, LTP", {
    h: "Types of memory, consolidation and amnesia", l: "T060", pic: ["Memory consolidation", "Procedural memory"],
    p: [
      "By duration: **short-term** (seconds to minutes, e.g. a phone number; reverberating circuits, presynaptic facilitation); **intermediate long-term** (days to weeks; chemical changes at the synapse); **long-term** (years; **structural** change: more release sites, more vesicles, more synapses and dendrites, which needs new **protein synthesis**).",
      "By type: **declarative (explicit)** memory — facts and events — needs the **hippocampus and medial temporal lobe** to be stored. **Procedural (skill, implicit)** memory — how to do things — depends on the **cerebellum and basal ganglia**. Habituation and sensitization are simple non-associative learning.",
      "**Consolidation** turns short-term into long-term memory. It needs minutes (≥ 5–10) to an hour or more, is strengthened by **rehearsal**, needs protein synthesis, and files the new item together with similar old ones.",
      "**Bilateral hippocampal** damage → **anterograde amnesia**: no new declarative memories; old memories and skills stay. **Retrograde amnesia** (loss of the recent past) follows head injury, electroshock or thalamic lesions; recent memories go first, remote ones last. **Working memory** depends on the **prefrontal cortex**.",
    ],
    why: "A memory is a change in synaptic efficiency: short-term means more transmitter for a while; long-term means physical growth of the synapse.",
    trap: "The hippocampus stores NEW declarative memories; skills (riding a bike) survive a hippocampal lesion.",
    q: ["A man with bilateral hippocampal damage: which memories does he lose?", "He cannot form new declarative memories (anterograde amnesia); old memories and skills stay."],
  });
  sec("ph-optics", "Refractive power", {
    h: "The eye as a camera: image, pupil and acuity", pic: ["Visual acuity", "Pupil"],
    p: [
      "Light bends where the refractive index changes. The **air–cornea** surface gives most of the power (~43 D); the lens (~20 D) is the **adjustable** part. Total ≈ **59 D**. The **reduced eye** treats this as a single lens whose nodal point lies ~17 mm in front of the retina. Refractive indices: cornea 1.38, aqueous 1.33, lens 1.40, vitreous 1.34.",
      "The retinal image is **real, inverted and reversed**; the brain reads it upright.",
      "**Pupil size** sets how much light enters and the **depth of focus**: a small pupil gives a greater depth of focus (the pinhole effect) and fewer aberrations. That is why the pupil constricts for near vision.",
      "**Visual acuity** (normal 6/6) is best at the fovea: the minimum separable angle is ≈ 1 minute of arc (tested with a Snellen chart).",
    ],
    why: "Most bending happens at the first surface (air to cornea), where the refractive index jumps most.",
    trap: "The lens is the adjustable element, not the most powerful one.",
    q: ["Why does the pupil constrict when you read?", "A small pupil increases the depth of focus and reduces aberrations (part of the near response)."],
  });
  sec("ph-refraction", "Errors of refraction", {
    h: "Accommodation in numbers, presbyopia and astigmatism", pic: ["Presbyopia", "Astigmatism"],
    p: [
      "**Accommodation**: the ciliary muscle contracts (parasympathetic: III → ciliary ganglion → short ciliary nerves) → the zonule goes **slack** → the elastic lens becomes **more convex**, mainly its anterior surface → power rises by up to **~14 D** in a child (≈ 20 → 34 D).",
      "The **near point** recedes with age: ~9 cm at 10 years, ~25 cm at 40, ~1 m at 60. **Presbyopia** = the lens losing elasticity (only ~2 D of accommodation left at 45–50) → **convex** reading glasses.",
      "**Near response** to a near object: **convergence** + **accommodation** + **pupillary constriction**. In the **Argyll Robertson pupil** the near response is kept but the light reflex is lost.",
      "**Astigmatism**: the cornea (or lens) is curved unequally in different meridians, so a point focuses as a line; corrected with a **cylindrical** lens. **Cataract** = opacity of the lens (age, diabetes, UV, steroids), treated by lens extraction + an implant; the eye then cannot accommodate.",
    ],
    why: "Accommodation is the lens relaxing into its natural round shape once the ciliary muscle releases the zonule.",
    trap: "Ciliary muscle contracts → zonule SLACK → lens thicker. Students often reverse the zonule.",
    q: ["Why do people over 45 need reading glasses?", "Presbyopia: the lens loses elasticity, accommodation falls and the near point recedes; convex lenses restore near focus."],
  });
  sec("ph-retina", "Dark and light adaptation", {
    h: "Retinal processing: receptive fields, lateral inhibition, rods and cones", pic: ["Receptive field", "Retinal ganglion cell"],
    p: [
      "Direct path: photoreceptor → **bipolar cell** → **ganglion cell** (the retinal cells that fire action potentials; their axons form the optic nerve). **Horizontal cells** give **lateral inhibition**, which sharpens contrast at edges. **Amacrine cells** signal change and motion.",
      "Ganglion cells have **centre–surround** receptive fields (**ON-centre** and OFF-centre). Types: **X (P, midget)** for colour and detail; **Y (M)** — large and fast — for movement; **W** for rod input and direction.",
      "Photoreceptors release **glutamate continuously in the dark**; light **hyperpolarizes** them and cuts the release.",
      "**Rods**: very sensitive, **scotopic** (night) vision, peripheral, no colour, much convergence (low acuity). **Cones**: **photopic** (day) and colour vision, packed in the fovea, one-to-one wiring (high acuity). **Purkinje shift**: in dim light the eye becomes most sensitive to blue-green (rods peak near 500 nm).",
      "**Vitamin A** is the precursor of retinal, so deficiency causes **night blindness** first. Dark adaptation: cones finish in ~10 min; rods keep adapting for **~20–40 min** (the rod–cone break). Light adaptation takes seconds to minutes (bleaching, pupil constriction, neural adaptation).",
    ],
    why: "The retina already edits the image (edges, motion, contrast) before the ganglion cells send it on.",
    trap: "Photoreceptors release the most glutamate in the DARK and hyperpolarize, not depolarize, to light.",
    q: ["Which retinal cells produce action potentials?", "The ganglion cells (and some amacrine cells); photoreceptors, bipolar and horizontal cells use graded potentials."],
  });
  add("ph-uveal", "Iris muscles", [
    "The **sphincter pupillae** (parasympathetic: III → ciliary ganglion) constricts the pupil; the **dilator pupillae** (sympathetic: T1 → superior cervical ganglion) dilates it. **Horner's syndrome** (loss of the cervical sympathetic): miosis, ptosis, anhidrosis, apparent enophthalmos. Atropine dilates the pupil; pilocarpine constricts it.",
    "The ciliary body **secretes aqueous** (its non-pigmented epithelium) and holds the ciliary muscle. The choroid nourishes the **outer** retina (the photoreceptors).",
  ]);
  /* ───────────── ANATOMY / HISTOLOGY: syllabus completeness ───────────── */
  add("an-white-matter", "Association, commissural, projection", [
    "**Corpus callosum**, from front to back: **rostrum, genu, body, splenium**. The genu fibres curve forwards as the **forceps minor** (joining the frontal lobes); the splenium fibres curve backwards as the **forceps major** (occipital lobes). The **tapetum** forms the roof and lateral wall of the posterior and inferior horns. Other commissures: **anterior commissure** (olfactory areas and temporal lobes), **posterior commissure** (pupillary light reflex), habenular commissure, **fornix** (hippocampal commissure).",
    "Association bundles: **superior longitudinal** fasciculus (frontal ↔ parietal, occipital, temporal); its **arcuate** part joins Broca's to Wernicke's area; **inferior longitudinal** (occipital ↔ temporal); **uncinate** (frontal ↔ anterior temporal); **cingulum** (inside the cingulate gyrus).",
  ]);
  add("an-white-matter", "Internal capsule: blood supply", [
    "Blood supply: **lenticulostriate branches of the MCA** ('the artery of cerebral haemorrhage') supply most of the capsule. The **recurrent artery of Heubner (ACA)** supplies the anterior limb and genu; the **anterior choroidal** artery the lower posterior limb and retrolenticular part. A capsular lesion → contralateral **hemiplegia + hemianaesthesia**, ± contralateral **homonymous hemianopia** if the retrolenticular part (optic radiation) is involved.",
  ]);
  add("an-third-ventricle", "Communications and walls", [
    "**Anterior wall**: lamina terminalis, anterior commissure, columns of the fornix. **Floor**, from front to back: **optic chiasma, infundibulum, tuber cinereum, mammillary bodies, posterior perforated substance**, tegmentum of the midbrain. **Roof**: ependyma + the **tela choroidea** with its choroid plexus. **Lateral walls**: the thalamus above and the hypothalamus below the **hypothalamic sulcus**, joined across by the interthalamic adhesion.",
    "It communicates with each lateral ventricle through the **interventricular foramen (of Monro)** and with the 4th ventricle through the **cerebral aqueduct**.",
  ]);
  add("an-third-ventricle", "Recesses", [
    "The four recesses: **optic** (above the chiasma), **infundibular** (into the pituitary stalk), **pineal** (into the pineal stalk) and **suprapineal** (above the pineal).",
  ]);
  add("an-meninges", "Cranial dura mater", [
    "The dura is supplied by **V** (all three divisions; mainly the anterior and middle cranial fossae), **X** and **C1–C3** (posterior fossa). The cranial dura is **pain-sensitive**; the brain itself is not.",
    "Haemorrhages: **extradural** — middle meningeal artery torn at the pterion, with a lucid interval then deterioration. **Subdural** — torn **bridging (superior cerebral) veins**, often slow, in the elderly or alcoholics. **Subarachnoid** — ruptured **berry aneurysm** of the circle of Willis: 'the worst headache of my life', neck stiffness.",
  ]);
  add("an-meninges", "Subarachnoid cisterns", [
    "Named cisterns: **cerebellomedullary (cisterna magna)** — between the cerebellum and medulla, the site of **cisternal puncture**; **pontine**; **interpeduncular** — contains the **circle of Willis**; **chiasmatic**; **superior (cistern of the great cerebral vein)**; the cistern of the **lateral sulcus** — contains the MCA.",
  ]);
  add("an-embryology-cns", "Neural tube", [
    "The **notochord** induces the **neural plate** (~day 18). The neural folds fuse into the tube from ~**day 22**, starting in the future **cervical** region and closing towards both ends.",
    "**Neural crest** derivatives: dorsal root and cranial sensory ganglia, **autonomic ganglia**, **Schwann cells**, **adrenal medulla**, melanocytes, the **pia and arachnoid**, odontoblasts, and the cartilage and bone of the pharyngeal arches and face.",
  ]);
  add("an-embryology-cns", "Spinal cord: layers and plates", [
    "Layers of the developing cord: **ependymal (ventricular)** → the lining of the central canal; **mantle** → **grey** matter; **marginal** → **white** matter. The **alar plate** (dorsal) → the sensory **posterior horn**; the **basal plate** (ventral) → the motor **anterior horn**; the **sulcus limitans** separates them. The lateral horn (visceral efferent) appears at **T1–L2** and **S2–S4**. Myelination starts around the **4th month** and continues after birth.",
  ]);
  add("an-embryology-cns", "Positional change and spina bifida", [
    "Positional change: at 3 months the cord fills the vertebral canal; at **birth it ends at L3**; in the **adult at L1–L2**, because the column grows faster than the cord. That is why the lumbar and sacral roots run obliquely down as the **cauda equina**.",
    "Defects: **anencephaly** (failure of the anterior neuropore; polyhydramnios); **spina bifida** (failure of the posterior neuropore / arches); **hydrocephalus** (often **aqueduct stenosis**); **Arnold–Chiari** malformation (cerebellar tonsils herniate through the foramen magnum). **Folic acid** before conception prevents most neural tube defects, and a raised maternal **α-fetoprotein** suggests an open defect.",
  ]);
  add("an-embryology-cns", "Brain vesicles", [
    "Three primary vesicles → five secondary: **prosencephalon** → telencephalon (hemispheres, lateral ventricles) + diencephalon (thalamus, hypothalamus, 3rd ventricle, optic cup); **mesencephalon** → midbrain (aqueduct); **rhombencephalon** → metencephalon (pons, cerebellum) + myelencephalon (medulla); together they surround the 4th ventricle. Flexures: **cephalic** (midbrain), **cervical** and **pontine**.",
  ]);
  add("an-sternomastoid", "Attachments, nerve and action", [
    "Attachments: the **sternal head** from the front of the manubrium, the **clavicular head** from the medial third of the clavicle → the **mastoid process** and the lateral half of the superior nuchal line. Nerves: the **spinal accessory** (motor) and **C2–C3** (proprioception). Both muscles together **flex the neck**, protract the head and act as accessory muscles of **inspiration** when the head is fixed.",
  ]);
  add("an-sternomastoid", "Relations and torticollis", [
    "Relations: the **carotid sheath** lies deep to it; the **external jugular vein**, great auricular and transverse cervical nerves cross it superficially; the **accessory nerve** pierces it. **Congenital torticollis** (a birth injury / fibrosis of the muscle): the head is **tilted towards** the affected side and the **face turned to the opposite side**.",
  ]);
  add("an-muscular-triangle-thyroid", "Thyroid gland: parts and vessels", [
    "Two lobes (from the **5th cervical to the 1st thoracic** level beside the larynx and trachea) + an **isthmus** over the **2nd–4th tracheal rings** ± a **pyramidal lobe**. It has a true capsule and a false capsule (**pretracheal fascia**), so the gland **moves up with swallowing**.",
    "Arteries: the **superior thyroid** (1st branch of the external carotid, running with the **external laryngeal** nerve); the **inferior thyroid** (thyrocervical trunk, related to the **recurrent laryngeal** nerve); sometimes a thyroidea ima. Veins: superior and middle → the **internal jugular**; **inferior thyroid veins → the brachiocephalic veins**, in front of the trachea, where they bleed during a low tracheostomy.",
  ]);
  add("an-muscular-triangle-thyroid", "Infrahyoid (strap) muscles", [
    "The strap muscles (sternohyoid, sternothyroid, thyrohyoid, omohyoid) depress the hyoid and larynx. They are supplied by the **ansa cervicalis (C1–C3)**, except **thyrohyoid**, which gets **C1 fibres carried by the hypoglossal** nerve.",
  ]);
  add("an-cervical-fascia", "Layers of deep cervical fascia", [
    "Layers: **investing** (encloses the sternomastoid and trapezius; forms the roof of the posterior triangle); **pretracheal** (encloses the thyroid, trachea and oesophagus; fixes the thyroid to the larynx); **prevertebral** (in front of the vertebral muscles, floor of the posterior triangle; continues into the axillary sheath around the brachial plexus and subclavian artery); plus the **carotid sheath**. Infection behind the prevertebral fascia can track down into the mediastinum.",
  ]);
  add("an-cervical-plexus", "Branches of the cervical plexus", [
    "The **cervical plexus** (ventral rami **C1–C4**) lies deep to the sternomastoid. Cutaneous branches emerge at the **nerve point** at the middle of its posterior border: **lesser occipital (C2)**, **great auricular (C2, C3)** — skin over the parotid and the angle of the jaw, auricle —, **transverse cervical (C2, C3)** and **supraclavicular (C3, C4)**. Motor: the **ansa cervicalis** (strap muscles) and the **phrenic nerve (C3–C5)** to the diaphragm.",
  ]);
  add("an-subclavian", "Subclavian artery and vein", [
    "The subclavian artery is divided by the **scalenus anterior** into three parts. **1st part** (medial): **vertebral**, **internal thoracic**, **thyrocervical trunk** (inferior thyroid, suprascapular, transverse cervical). **2nd** (behind the muscle): the **costocervical trunk**. **3rd**: the dorsal scapular (variable). The **subclavian vein** passes **in front of** scalenus anterior and joins the internal jugular to form the brachiocephalic vein, where the **thoracic duct** (left) enters.",
  ]);
  add("hi-eye", "Cornea: five layers", [
    "Five layers, from outside in: **stratified squamous non-keratinized epithelium** (5–6 layers, regenerates quickly, rich in free nerve endings); **Bowman's membrane** (acellular collagen, does **not** regenerate — it scars); the **stroma** (~90% of the thickness, regular collagen lamellae with keratocytes); **Descemet's membrane** (the thick basement membrane of the endothelium, which can regenerate); the **endothelium** (simple squamous; pumps fluid out and keeps the stroma dehydrated and transparent).",
  ]);
  add("hi-eye", "Uvea: iris, choroid", [
    "**Iris**: an anterior border layer (melanocytes, fibroblasts), a vascular **stroma** with the **sphincter pupillae** (smooth muscle round the pupil), the **dilator pupillae** (myoepithelial cells), and a **posterior double pigmented epithelium**. **Ciliary body**: ciliary muscle + ciliary processes covered by a **double epithelium** — the outer layer pigmented, the **inner non-pigmented layer secreting the aqueous** — which gives rise to the zonular fibres. **Choroid**: vessel-rich pigmented layer with the choriocapillaris, separated from the retina by **Bruch's membrane**.",
  ]);
  add("hi-eye", "Retinal pigment epithelium, rods and cones", [
    "**Rods**: long thin outer segment with **free (detached) discs** holding rhodopsin; very light-sensitive. **Cones**: conical outer segment whose discs are **continuous with the cell membrane** (infoldings); three types for colour. The **RPE** absorbs stray light, phagocytoses shed disc tips, stores vitamin A and forms the outer blood–retinal barrier (tight junctions).",
  ]);
  add("hi-eye", "Macula lutea and fovea", [
    "**Macula lutea**: yellow (xanthophyll) area lateral to the disc. **Fovea centralis** at its centre: **only cones**, with the inner layers pushed aside, giving the sharpest vision. The **optic disc** has **no photoreceptors**, hence the **blind spot**; the central artery and vein of the retina enter here.",
  ]);
  /* ───────────── v16.2 · facts asked by the Nov 2024 paper's items that the bank lacked (practice items) ───────────── */
  add("an-submandibular", "Submandibular triangle: boundaries and contents", [
    "**Submental triangle** (a single midline triangle): **between the two anterior bellies of the digastric**, base = body of the hyoid, apex = chin, floor = the two **mylohyoids**; it holds the submental lymph nodes. Do not confuse it with the **muscular** triangle (below the hyoid) or the **occipital** triangle (upper part of the posterior triangle).",
  ]);
  sec("an-sulci-gyri", "Inferior surface", {
    h: "Functional areas: which area, which deficit", l: "T013", pic: ["Brodmann area", "Paracentral lobule"],
    p: [
      "Loss of **general sensation** on one side → **areas 3, 1, 2** (primary somatosensory, postcentral gyrus) of the opposite hemisphere.",
      "**Incontinence of urine and stool** → the **paracentral lobule** (medial surface, around the upper end of the central sulcus): leg, perineum, bladder and rectum.",
      "**Inability to talk** (understands, cannot speak) → **Broca's area** (44, 45), inferior frontal gyrus of the dominant hemisphere: motor aphasia.",
      "**Cannot discriminate colours** → the **visual association areas 18, 19**. Area 17 (primary visual) receives the image; a lesion there → blindness in the opposite half-field.",
      "A woman **working as a tailor** who has not been able to do her work for a few weeks (fine skilled hand movement) → **motor area 4** (precentral gyrus; the hand has a large area).",
      "Other numbers they use as distractors: **22** = auditory association (Wernicke's), **41, 42** = primary auditory, **39, 40** = angular and supramarginal gyri (reading, writing), **28** = entorhinal (smell), **6** = premotor.",
    ],
    why: "Every one of these cases is answered by one pairing: the symptom names a function, and each function has one area number. Learn the pairs as symptom → number.",
    trap: "Colour loss is 18, 19 (association), not 17; incontinence is the paracentral lobule (medial surface), not a lateral-surface area.",
    q: ["Incontinence of urine and stool: which area? Cannot discriminate colours: which areas?", "The paracentral lobule; the visual association areas 18, 19."],
  });
  add("ph-synapse-properties", "Properties of synaptic transmission", [
    "**Neuronal pools**. **Divergence** = one fibre to many neurons: it **spreads (distributes)** a signal. **Convergence** = many fibres onto one neuron: it gives **spatial** summation and so **helps in the selection of important signals and ignoring unimportant ones**.",
    "**Facilitation vs occlusion**. Two input fibres whose **discharge zones are apart**: each leaves a **subliminal fringe**; stimulated together the fringes overlap → **more** neurons fire than the sum of each alone = **facilitation**, which is due to **stimulation of 2 input neurons away from each other**. Two inputs **close together** with a **common discharge zone** → **fewer** than the sum = **occlusion**.",
  ]);
  /* ───────────── v16.2 · the department's "Applied anatomy" boxes (Dr Hanan: important; some came in the exam) ───────────── */
  add("an-csf", "Circulation and absorption", [
    "Department numbers: the adult has about **135 cc** of CSF; **400–500 cc** is made (and absorbed) daily, so the CSF is **renewed about three times a day**. Normal pressure ≈ **100 mm water**; obstruction at the narrow foramina and aqueduct raises it. **Lumbar puncture** is safe **below L2** (the cord ends at L1–L2).",
  ]);
  add("an-brain-blood", "Circle of Willis", [
    "Applied: one artery of the circle is often very small or absent without symptoms. Normally the two sides' blood hardly **mingles**; if a big artery is blocked before the circle, the connections open up. **Cortical branches** anastomose with each other **before** they enter the brain, not after (inside they are **end arteries**); the **central branches are end arteries**.",
  ]);
  add("an-scalp", "Five layers and the dangerous layer", [
    "Applied (dense connective-tissue layer, the 2nd): its **fibrous septa** limit the spread of infection, but a cut there **bleeds severely**: the rich vessels are held open by the septa and **cannot contract**. The 4th layer (loose areolar) is the dangerous one: infection reaches the cranial cavity through its **emissary veins**, and bleeding there lifts the scalp off the skull.",
  ]);
  add("an-parotid", "Nerve supply: secretomotor pathway and pain", [
    "**Parotitis** (mumps: viral or bacterial, reaching the gland through its duct or the blood): severe pain and swelling with the **lobule of the auricle raised (everted)**. The pain comes from stretching of the **tight parotid capsule**, and it is worse on **chewing** because the gland is closely related to the TMJ. **Parotid tumours** arise mostly in the part **superficial to the facial nerve** branches: **benign** ones spare the nerve, **malignant** ones invade it → facial palsy.",
  ]);
  add("an-tmj", "Structure, movements and dislocation", [
    "Department wording: the mandible dislocates **only forwards**. With the mouth open the condyles sit under the articular tubercle; a sudden blow or even a convulsive yawn pushes one or both condyles **into the infratemporal fossa in front of the tubercle**. **Reduction**: press the mandible **down and back** while **raising the chin** at the same time.",
  ]);
  add("an-maxillary-artery", "Middle meningeal artery and the pterion", [
    "Applied: a temporal fracture (or an injury stripping dura from bone) tears the middle meningeal artery → blood between dura and bone = **extradural haemorrhage**; a **trephine** (burr-hole) operation relieves the cerebral compression.",
  ]);
  add("an-cranial-cavity", "Cavernous sinus: tributaries, drainage and communicatio", [
    "**Cavernous sinus thrombosis**: infection spreads from the **dangerous area of the face** (around the nose and upper lip) by facial vein → **deep facial vein → pterygoid plexus → emissary vein through the foramen ovale** (or the ophthalmic veins) → cavernous sinus. Signs: **fever**, **internal (medial) squint** (the abducent nerve, lying free in the sinus, suffers first), a congested oedematous eye (**black eye**) and later **proptosis**.",
  ]);
  add("an-posterior-triangle", "External jugular vein", [
    "Applied: the external jugular vein is **adherent to the deep fascia where it pierces it** (just above the clavicle). Cut there, it is held open and **cannot collapse** → air is sucked in → **air embolism**.",
  ]);
  add("an-carotid-triangle", "Internal jugular vein", [
    "**Central venous catheter**: a line into a large vein, the **internal jugular** or the **subclavian**, for rapid drugs, fluids and nutrition, and to measure the **central venous pressure**.",
  ]);
  add("an-muscular-triangle-thyroid", "Thyroidectomy and the laryngeal nerves", [
    "A **goitre** can grow down behind the sternum (**retrosternal goitre**) → dyspnoea and venous congestion. During thyroidectomy leave the **posterior part** of the gland: the **parathyroids** lie in it, and removing them → **hypocalcaemia and tetany**.",
    "Voices of nerve injury: **external laryngeal** (cricothyroid paralysed, the cords slack) → a **weak, low-pitched voice** with mild hoarseness, noticeable mainly when both sides are cut. **Recurrent laryngeal**, one side → a **hoarse, breathy voice** (it may improve as the other cord over-adducts); it is commoner on the **left** because of its long course in the thorax (bronchogenic carcinoma is the commonest thoracic cause). Both sides, **partial** → the abductors fail, the cords lie adducted → **dyspnoea and stridor**, needing a tracheostomy; both sides, **complete** → cords fixed in the **cadaveric position** (midway) → **aphonia**.",
    "**Tracheostomy**: a small transverse incision in the lower neck; the strap muscles are pulled aside, the thyroid **isthmus divided** if needed, and the opening made in the **2nd and 3rd tracheal rings**. In an emergency a needle through the **cricothyroid ligament** (felt by palpation) gives an airway.",
  ]);
  add("an-submandibular", "Submandibular and sublingual glands", [
    "**Stones** form in the **submandibular duct** far more often (about **50 times**) than in the parotid duct: its secretion is **thick and viscid**, it drains **against gravity**, and it opens in the floor of the mouth where food particles enter and seed a stone. The swelling in the submandibular region **grows during meals** and settles between them.",
  ]);
  add("an-cranial-nerves", "Vagus nerve (X) in the neck", [
    "**Vagus injury**: tachycardia and arrhythmia. **Vasovagal attack** (vagal over-stimulation, e.g. at the sight of blood or fear) → bradycardia, hypotension and fainting. Pharyngeal branch injury → **dysphagia**, and the soft palate (**uvula**) deviates to the **opposite (healthy) side**.",
  ]);
  add("an-cranial-nerves", "Accessory (XI), hypoglossal (XII) and the ans", [
    "The **spinal accessory** nerve is **subcutaneous** in the posterior triangle, so a **superficial cut** or a **lymph-node biopsy** there injures it → weakness and wasting of **sternomastoid and trapezius**, with weak turning of the face to the opposite side and a drooping shoulder.",
    "**Hypoglossal injury** → **hemiatrophy** of that side of the tongue, and on protrusion the tongue deviates **towards the affected side** (the healthy genioglossus pushes it over).",
  ]);
  add("an-cranial-nerves", "Glossopharyngeal nerve (IX)", [
    "**Glossopharyngeal injury** → loss of taste (and general sensation) on the **posterior 1/3 of the tongue** and loss of the **gag reflex** on that side. Tonsillitis pain can be **referred to the (middle) ear**, because IX supplies both.",
  ]);
  add("an-trigeminal", "Mandibular nerve (V3): posterior division", [
    "**Trigeminal neuralgia (tic douloureux)**: severe, brief, episodic pain in the area of the **maxillary and/or mandibular** nerve, caused by compression of the trigeminal **sensory root** by a blood vessel or a tumour.",
  ]);
  add("an-diencephalon", "Parts of the diencephalon", [
    "**Pituitary tumours** show 3 kinds of feature: **endocrine** disturbance; **raised intracranial tension** (headache, vomiting, blurred vision); and **pressure** effects, e.g. on the optic chiasma → **bitemporal hemianopia**.",
  ]);
  /* ───────────── v16.2 · department histology self-assessments (nervous tissue 2025 model answers; CNS/eye/ear formative) ───────────── */
  add("hi-nervous-tissue", "Sensory nerve endings", [
    "**Muscle spindles** are **more numerous in antigravity muscles** (and in muscles of fine movement). Their intrafusal fibres lie **parallel** to the extrafusal fibres; **afferent (sensory)** nerves envelope the intrafusal fibres, and the striated polar ends receive **efferent (gamma) motor** fibres.",
  ]);
  add("hi-nervous-tissue", "Ganglia, degeneration and regeneration, stains", [
    "In **Wallerian degeneration** (the part distal to the cut) the **myelin sheath shows widening of the nodes of Ranvier**, then breaks into ovoids, and the **Schwann cells multiply** (they do not decrease in number). **Chromatolysis** and a **nucleus that migrates to a peripheral position** are changes in the **cell body** (retrograde reaction), not Wallerian degeneration.",
  ]);
  add("hi-nervous-tissue", "Neuroglia", [
    "The **largest neuroglia cells** are the **astrocytes**: their end-feet **share in the formation of the blood brain barrier**. **Mesoglia** = microglia, the smallest and the only **mesodermal** ones; **myelin production** is the job of oligodendrocytes.",
    "**Oligodendrocytes**: **satellite oligodendrocytes support nerve cells** (beside cell bodies in grey matter); **interfascicular** oligodendrocytes lie between the fibres of **white** matter and make myelin. Neuroglia are **ectodermal** (except microglia) and keep their centrioles, so they can divide.",
  ]);
  add("hi-nervous-tissue", "Types of neurons and the synapse", [
    "**Chemical synapses** are the commonest type (not less common than electrical ones). The **axon terminal is rich in mitochondria & synaptic vesicles of transmitter**, and the cleft is about **20–30 nm**. A **2–3 nm** gap with **gap junctions** passing ions is an **electrical** synapse.",
  ]);
  add("hi-cns", "Spinal cord tracts on a section", [
    "**Long sensory tracts to the subcortical levels** (they end below the cortex): the **spinoolivary** (spino-olivary), spinotectal and spinocerebellar tracts. The spinothalamic tracts and the gracile and cuneate tracts reach the **cortex**.",
    "Corticobulbar fibres: the **lateral corticobulbar tract terminates in** the **5th cranial nerve nucleus** (motor trigeminal) and the other cranial motor nuclei (7, 9, 10, 11); the fibres for the eye-muscle nuclei, the **3rd, 4th and 6th**, run **medially** (medial corticobulbar).",
  ]);
  add("hi-eye", "Retinal pigment epithelium, rods and cones", [
    "The **retinal pigment epithelium** is characterized by **phagocytosis of worn out part of photoreceptor cells** (the shed outer-segment discs); it also stores vitamin A and absorbs stray light. It has no photoreceptors or amacrine cells and does not make the vitreous humor.",
  ]);
  add("hi-eye", "Cornea: five layers", [
    "**Success of corneal transplantation** is explained because the **cornea is avascular** (no blood vessels, no lymphatics): the recipient's immune cells hardly reach the graft. Its transparency comes from the regular arrangement of collagen and relative dehydration.",
  ]);
})();
