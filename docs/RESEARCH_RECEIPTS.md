# Research Receipts — v14 certified upgrade (2026-09-22)

Scope: evidence behind every non-trivial v14 decision. Each finding is graded:

- **STRONG** — replicated, meta-analytic evidence
- **MODERATE** — several controlled studies or one solid meta-analysis with caveats
- **HEURISTIC** — plausible design reasoning, not directly tested for this use
- **INSPIRATION** — product pattern only; no efficacy claim

Research environment note: the certification sandbox's egress policy blocks
`*.wikimedia.org`, `*.wikipedia.org` and the Hatchable host. Web research was done
through search results; Wikimedia Commons files were verified by search-result
evidence (title, page URL, license line), not by downloading them. The learner's
iPad is not behind this proxy, and it fetches Commons at runtime.

## 1. Learning science

| # | Finding | Grade | v14 decision it drives |
|---|---|---|---|
| L1 | **Prequestions / pretesting:** prequestions boost learning of the prequestioned information (g ≈ 0.54–0.66), but have ~no general effect on non-prequestioned material (g ≈ 0.01–0.04). They require feedback afterwards. Sources: Pan & Carpenter meta-analysis ([PubMed 37640836](https://pubmed.ncbi.nlm.nih.gov/37640836/)); multilevel meta-analysis ([Springer 2025](https://link.springer.com/article/10.1007/s10648-025-10075-7)). | STRONG | The primer teaches the **model** and never the stem→answer sentence. The source MCQ then acts as a prediction/prequestion, and the post-answer "why" closes the loop. Answering before being told is not harmful if feedback follows. |
| L2 | **Multiple-choice lures are learned:** reading more MC lures increases later lure intrusions. Feedback reduces this. Sources: Roediger & Marsh 2005 ([PDF](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Marsh-2005_JEPLMC.pdf)); Butler, Karpicke & Roediger feedback study ([PDF](https://gwern.net/doc/psychology/spaced-repetition/2008-butler.pdf)). | STRONG | Every wrong practice MCQ gets an explicit contrast (key vs chosen lure) and a changed retest. The chosen lure is named as the look-alike, never left implicit. The spoon-feed no longer shows exact source Q→A pairs followed by the same MCQ minutes later. |
| L3 | **Hypercorrection:** high-confidence errors are more likely to be corrected after feedback, because attention to feedback rises. Errors can return at delay unless a test intervenes. Sources: [Butterfield & Metcalfe](https://www.researchgate.net/publication/11641193_Errors_Committed_with_High_Confidence_Are_Hypercorrected); [persist-over-a-week study](https://link.springer.com/article/10.3758/s13423-011-0173-y); [prior testing blocks return](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000242). | MODERATE–STRONG | Confident-wrong items get the full autopsy plus a **mandatory changed retest** (the retest is what blocks the error's return). Confidence stays captured on every item, including mocks. |
| L4 | **Expertise reversal:** worked examples help novices and hurt experts. Guidance should fade with competence. Sources: [Kalyuga review](https://www.academia.edu/1405544/The_expertise_reversal_effect); [2025 meta-analysis](https://www.researchgate.net/publication/390916755_A_cornerstone_of_adaptivity_-_A_meta-analysis_of_the_expertise_reversal_effect); [Salden et al.](http://www.cee.uma.pt/ron/Salden%20et%20al.%20-%20The%20Expertise%20Reversal%20Effect%20and%20Worked%20Examples.pdf). | STRONG | Primer depth adapts: FULL (fresh) → COMPACT (developing) → TEST-FIRST (owned, v12 posterior ≥ 0.82 with evidence). Correct + confident + owned answers get a one-line compression. |
| L5 | **Seductive details / decorative pictures** lower learning overall (g = −0.33). Purely decorative pictures are not always harmful; irrelevant text and audio are the worst. Sources: [Sundararajan & Adesope 2020](https://www.semanticscholar.org/paper/Keep-it-Coherent:-A-Meta-Analysis-of-the-Seductive-Sundararajan-Adesope/95806b02220471a55d9d18ebdc24d55d91973fd6); [Frontiers 2024](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1393113/full). | STRONG | v10's "image beside every line" is capped at 3 distinct images per screen. Duplicates collapse to text. Physiology intents penalize decorative gross-anatomy photos. |
| L6 | **Signaling text–picture correspondence** gives a small-to-medium benefit, largest for low-prior-knowledge learners. Sources: [Richter, Scheiter & Eitel 2016](https://www.sciencedirect.com/science/article/abs/pii/S1747938X15000664); [Noetel et al. 2022 meta-meta-analysis](https://journals.sagepub.com/doi/abs/10.3102/00346543211052329). | MODERATE | Every primer visual carries an intent label ("what to look at": e.g., *crossing point*, *three discriminators*). The movie strip segments the causal chain into highlighted steps. |
| L7 | **Interleaving** helps category discrimination (g = 0.42), especially for similar categories. Source: [Brunmair & Richter 2019](https://psycnet.apa.org/record/2019-57442-001). | STRONG (for discrimination) | Wrong-answer autopsy puts the correct item beside its nearest look-alike (contrast library). Histology intents default to "طلّع شبيهه برّه". |
| L8 | **Perceptual & adaptive learning modules (PALMs)** in medicine produce durable accuracy and fluency gains from many short classification trials with feedback. Sources: [UCLA Kellman lab](https://kellmanlab.psych.ucla.edu/research/perceptual-and-adaptive-learning-in-medicine/); [histopathology PALM](https://www.sciencedirect.com/science/article/pii/S2153353922006551). | MODERATE | Histology/specimen primers prefer real micrographs and specimens over schematics. Latency is recorded with accuracy so fluency can be learned. |
| L9 | **Self-explanation prompts** give g = 0.55. Source: [Bisra et al. 2018](https://link.springer.com/article/10.1007/s10648-018-9434-x). | STRONG | Optional one-line prediction before options. **Required** compact no-options reconstruction (typed, or "said it aloud") before repair can advance. |
| L10 | **Generative learning** (drawing, imagining, self-testing) is mostly positive (drawing: 26/28 studies), but needs integration support. Sources: [Fiorella & Mayer 2016](https://link.springer.com/article/10.1007/s10648-015-9348-9); [drawing-to-learn meta-analysis 2025](https://link.springer.com/article/10.1007/s10648-025-10067-7). | MODERATE | Existing draw/reconstruct segments are kept. The primer's "BUILD THE MOVIE" is an imagine-the-sequence prompt with concrete steps. |
| L11 | **Retrieval practice & spacing** in medical/anatomy education: repeated testing beats restudy for long-term retention, and equal spacing is good for long-term. Sources: [Adv Physiol Educ](https://journals.physiology.org/doi/full/10.1152/advan.00174.2012); [health-professions review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12292765/). | STRONG | Unchanged v12/v13 spacing. Feed-exposed source items are kept for later-day spaced retrieval instead of same-day recognition. |
| L12 | **Half-life regression** (personal forgetting): exponential recall with a learned half-life beats fixed schedules. Source: [Settles & Meeder 2016](https://research.duolingo.com/papers/settles.acl16.pdf). | STRONG (language data) | Existing v13 forgetting signatures preserved. v14 adds no competing memory model (architecture law). |
| L13 | **Certainty-based marking** in medical education improves calibration awareness. Its effect on summative scores is mixed. Sources: [BMC Med Educ 2019](https://bmcmededuc.biomedcentral.com/articles/10.1186/s12909-019-1610-2); [PMC 2025 cohort](https://pmc.ncbi.nlm.nih.gov/articles/PMC12640580/). | MODERATE | Confidence capture kept everywhere. Guess-correct is treated as weak evidence (more explanation, no compression). |
| L14 | **Transfer-appropriate processing:** practice should match the retrieval conditions of the exam. | HEURISTIC (well-established theory) | The exact source MCQ is still the test. No-options reconstruction trains recall for written/oral transfer. Retests use a *changed* source item of the same concept. |

## 2. Visual sources & licensing

| Source | License / terms (as found) | Allowed mode in INTELLECTUALITY | Receipt |
|---|---|---|---|
| Wikimedia Commons | Free licenses only (CC0/PD/CC BY/CC BY-SA). NC/ND are not accepted on Commons. | Runtime **embed** of Commons thumbnails with the license shown and a link to the file page. Category-scoped search (`incategory:`) plus verified exact files. | Commons policy; per-file license read live from `extmetadata.LicenseShortName` at runtime. |
| Blausen Medical gallery 2014 | CC BY 3.0 | Embed via Commons | [WikiJournal of Medicine gallery](https://en.wikiversity.org/wiki/WikiJournal_of_Medicine/Medical_gallery_of_Blausen_Medical_2014); [Blausen 0870](https://commons.wikimedia.org/wiki/File:Blausen_0870_TypesofNeuroglia.png) |
| OpenStax Anatomy & Physiology 2e | CC BY 4.0 | Embed via Commons copies (e.g., "1421 Sensory Homunculus.jpg") | [OpenStax 13.4](https://openstax.org/books/anatomy-and-physiology-2e/pages/13-4-the-peripheral-nervous-system); [1421 Sensory Homunculus](https://commons.wikimedia.org/wiki/File:1421_Sensory_Homunculus.jpg) |
| Patrick J. Lynch (Yale CAIM) illustrations | CC BY 2.5 | Embed via Commons | [Brain inferior view with labels](https://commons.wikimedia.org/wiki/File:Brain_human_normal_inferior_view_with_labels_en.svg); [sagittal section](https://commons.wikimedia.org/wiki/File:Brain_human_sagittal_section.svg) |
| Gray's Anatomy (20th US ed.) plates | Public domain | Embed via Commons | [Gray663](https://commons.wikimedia.org/wiki/File:Gray663.png); Gray153 (nasal conchae) |
| University of Michigan SecondLook | Copyright UM; review apps under CC BY-NC-SA 4.0. No paid-site republication. | **Link only** (atlas reference card). No local copy. | [SecondLook](https://secondlook.med.umich.edu/); [Neuroanatomy](https://secondlook.med.umich.edu/neuroanatomy) |
| Michigan Histology & Virtual Microscopy | CC BY-NC-SA 4.0; commercial use requires permission | **Link only** | [AnatomyTOOL record](https://anatomytool.org/content/michigan-website-histology-and-virtual-microscopy); [Hortsch 2023](https://anatomypubs.onlinelibrary.wiley.com/doi/10.1002/ase.2239) |
| UBC Neuroanatomy (neuroanatomy.ca) | CC BY-NC-SA | **Link only** | [UBC Neuroanatomy](https://neuroanatomy.ca/); [Open UBC](https://open.ubc.ca/neuroanatomy-at-ubc/) |
| University of Leeds Histology Guide | © University of Leeds; educational use with citation | **Link only** | [Histology Guide](https://histology.leeds.ac.uk/); [Virtual Pathology terms](https://www.virtualpathology.leeds.ac.uk/) |
| Radiopaedia | CC BY-NC-SA 3.0 | Not embedded (not needed for first-year CNS basics) | [Terms](https://radiopaedia.org/terms?lang=us) |
| Stanford Lane Library Bio-Image Search | Discovery tool; categorizes reuse rights | Research/discovery aid only | [Lane images guide](https://laneguides.stanford.edu/medical-education/images) |
| YouTube (existing teacher clips) | Official embed only | Official iframe embed plus official thumbnail, routed `start`/`end`; no frame copies | [Player parameters](https://developers.google.com/youtube/player_parameters) |

## 3. Commercial / specialist UX (principles only; no assets or trade dress copied)

| Product | Principle extracted | Grade | Where used |
|---|---|---|---|
| UWorld / AMBOSS | Explain why the *chosen* distractor is wrong, then state one educational objective. Compare often-confused pairs. ([MedEd review](https://meded.university/the-official-amboss-review/); [UWorld strategy](https://imghelpinghands.com/how-to-review-uworld-questions-for-step-1/)) | INSPIRATION | Autopsy: correct vs chosen, one decisive discriminator, one objective line. |
| Kenhub | Labeled → unlabeled diagrams, with spaced quizzes that drill weak terms. ([Kenhub strategy](https://www.kenhub.com/en/library/learning-strategies/free-anatomy-quiz-guides-learn-anatomy-faster)) | INSPIRATION | Rotation order for repeated concepts: labeled → specimen → section → teacher → unlabeled → look-alike. |
| Complete Anatomy | Saved "screens" with interactive labels; layer toggling. ([Screens](https://3d4medical.com/support/complete-anatomy/viewing-screens)) | INSPIRATION | Rejected for v14: no licensed 3D asset. Link to atlases instead. |
| Harvard HMX | Concept → visual mechanism → interaction → application → assessment. | INSPIRATION | Primer order: SEE → UNDERSTAND → MOVIE → EXAM CONVERSION → predict → MCQ. |

## 4. Commons files with search evidence (used in the registry)

Verified by search result (page exists; title and description match). The license is
re-read live at runtime:
`Spinal_Cord_Sectional_Anatomy.png`, `Spinal_Cord_Segments_and_body_representation.png`, `Spinal_cord_tracts_-_English.svg`, `Gray663.png`, `Blausen_0657_MultipolarNeuron.png`, `Neuron_with_oligodendrocyte_and_myelin_sheath.svg`, `Blausen_0870_TypesofNeuroglia.png`, `Blausen_0809_Skin_TactileReceptors.png`, `Blausen_0896_Ventricles_Brain.png`, `Blausen_0328_EarAnatomy.png`, `Blausen_0329_EarAnatomy_InternalEar.png`, `Patellar_tendon_reflex_arc.png`, `Brain_human_normal_inferior_view_with_labels_en.svg`, `Brain_human_normal_inferior_view_without_label.svg`, `Brain_human_sagittal_section.svg`, `Brain_stem_sagittal_section.svg`, `Schematic_diagram_of_the_human_eye_en.svg`, `Retina_layers.svg`, `Retina-diagram.svg`, `Sleep_Hypnogram.svg`, `EEG_Brainwaves.svg`, `Sleep_EEG_REM.png`, `Corona_radiata.png`, `Gray153.png`, `Musculi_coli_base,_my_edits_for_tringles,_Carotid_T.svg`, `1421_Sensory_Homunculus.jpg`, `Sensory_Homunculus-en.svg`, `Neural_Crest.png`, `Neural.crest.cells.migration.svg`, `Skull_foramina_labeled.svg`, `Schematic_of_spatial_summation_curve.svg`, `Action_potential_propagation_animation.gif`, `Propagation_of_action_potential_along_myelinated_nerve_fiber_en.svg`, `1417_Ascending_Pathways_of_Spinal_Cord.jpg`, `IPSPsummation.JPG` ([file page](https://commons.wikimedia.org/wiki/File:IPSPsummation.JPG), line-chart diagram, 1,033 × 376).

Commons categories with search evidence (runtime `incategory:` sources):
`Human spinal cord cross-section`, `Human spinal cord`, `Histology of dorsal root ganglion`,
`Dorsal root ganglion`, `Internal capsule`, `Corona radiata`, `Human inner ear`, `Sleep stages`,
`Cortical homunculus`, `Neural crest`, `Cranial base`, `Middle cranial fossa`,
`Patellar reflex`, `SVG reflex arc`, `Human brain (sagittal section)`,
`Animations of neurology`, `SVG optics diagrams of the human eye`, `Human tongue`, `Human orbit`, `Somatotopy`,
`Histology of the cerebellum`, `Medial lemniscus`, `Histology of nerves`, `Ventricular system`, `Brain lobes`,
`Sulcus (neuroanatomy)`, `Skin sensory receptors`, `Pain`, `Neuropathic pain`.

v14.2 search pass (category names that did **not** resolve were replaced or dropped):
`Posterior column-medial lemniscus pathway` → `Medial lemniscus`; `Histology of peripheral nerves` → `Histology of nerves`;
`Ventricular system of the brain` → `Ventricular system`; `Lobes of the brain` → `Brain lobes`; `Sulci of the brain` →
`Sulcus (neuroanatomy)`; `Cutaneous receptors` → `Skin sensory receptors`; `Gate control theory of pain` (no category) →
dropped in favour of `Neuropathic pain` for neuropathic stems; `Nasal conchae` and `Summation (neurophysiology)` → dropped
(the plain `Summation` category is mathematical). Added file `1417_Ascending_Pathways_of_Spinal_Cord.jpg` (OpenStax, CC BY 4.0).

Files inherited from v9/v10/v14 (previously shown in production) are kept, and they
now pass through the same runtime license and relevance checks.
