# Visual & Q-bank Audit (v14.2)

All numbers come from the committed receipts in `receipts/v14/`, produced by `tests/visual_bench.js`, `tests/leak_audit.js` and `tests/autopsy_bench.js` against `source/public` served locally (Chromium via Playwright, clock frozen to Tue 22 Sep 2026 10:00 Africa/Cairo).

> **Sandbox caveat.** Wikimedia Commons is egress-blocked in the build sandbox, so the harness mocks the Commons API. Curated **file** rows are the registry's real filenames, and those pages are search-verified or inherited from v53. **Category** rows return synthetic titles that echo the category queried. The engine metrics (routing, governor, repeats, leak firewall) are therefore real, but what each live category actually contains is not measured here. On the iPad, run `await INTELLECTUALITY_V14.audit({n:60})` in the console for the same metrics against live Commons.

## 1. Visual diversity (K)

Two systematic samples of 60 practice items each (40% anatomy, 40% physiology, 20% histology; offsets 0 and 3), run in study order through the real planner and the shared governor.

| Sample | Items | Primary coverage | Unique primary | Exact repeats | Adjacent repeats | No visual |
|---|---|---|---|---|---|---|
| offset 0 | 60 | 98.3% | 100% | 0% | 0% | 1.7% |
| offset 3 | 60 | 95% | 100% | 0% | 0% | 5% |

Longest run of the same primary visual: 1. Modality mix: spe 20, dia 76, mic 11, none 5, sec 5, gra 3 (spe = specimen, dia = labeled diagram, mic = micrograph, sec = section, gra = graph). Origin: file 46, cat 69, source 1, none 4.

Targets from `docs/CERTIFICATION_MATRIX.md` K: exact repeats < 10% ✔ (0%), adjacent unrelated repeats = 0 ✔. Unique-visual % is inflated by the mock for category rows, because each query echoes distinct titles. The curated-file rows (46) are real registry files and are what the governor actually rotates. The same 60-item audit runs as certification check K2. Across both samples, which are separate simulated sessions, the 46 file rows use 30 distinct files; no file repeats within a session.

## 2. Human relevance review (all 120 rows)

Every row was read as stem → detected concept → primary visual title and graded by hand:

| Grade | Count | Share of the 115 rows with a stock visual |
|---|---|---|
| Relevant | 99 | 86.1% |
| Weak / partial (right region or family, not the exact point) | 16 | 13.9% |
| Irrelevant | 0 | 0.0% |
| Withheld (no visual shown, honest note) | 4 | — |
| Exact source-bank figure | 1 | — |

**Irrelevant after review: 0 of 115.** This review ran three times during the build:

| Pass | Sample | Relevant | Weak | Irrelevant | What changed next |
|---|---|---|---|---|---|
| v14.1 first review | first 60 rows | 46 | 6 | **8** | Traced 8 misfires to concept detection and to only ever searching the first two categories |
| v14.2 mid-pass (after the first fixes) | second 60 rows (offset 3) | 39 | 13 | **8** | Stem hits outweigh chapter hits; per-file/category stem triggers; `not` guards; strict concepts for question visuals; regex fixes |
| **v14.2 final** | **120 rows** | **99** | **16** | **0** | — |

Fixed misfire classes:

- "external arcuate fibres" → Broca's area: `arcuate` alone fired *speech*. Fixed to `arcuate fasciculus`; external arcuate now goes to the cerebellum.
- "basal ganglia" → neuroglia: the *glia* regex matched inside "gan**glia**". Word boundary added.
- "corneal reflex" → optics, "micturition reflex" → reflex arc: chapter words beat stem words. The stem now counts ×2 with phrase-length weighting; `not` guards added.
- scalp artery → facial-nerve drawing; temporalis → parotid; recurrent laryngeal → glossopharyngeal: only the first two categories were ever searched, and curated files ignored the stem. Per-file/category stem triggers fixed this.
- "CNS is soft", "Border cells", "Cataract", "tear film": multi-topic lesson titles guessed a concept. Question visuals now need a stem/chapter concept or a single-concept lesson title. *Border cells*, *cataract* and *tear film* also got real concept patterns.

Weak and withheld rows (full list):

| # | Grade | Stem | Shown | Note |
|---|---|---|---|---|
| 11 | S | Regarding structure pointed out by number (1), choose the correct answer | SOURCE FIGURE | exact source-bank figure |
| 19 | W | Enkephalin blocks pain transmission by | Pain Pain diagram 1 | enkephalin → generic pain category (no gate-control category exists on Commons) |
| 22 | W | All of the following are cause of intracranial headache, EXCEPT | Pain Pain section 3 | headache → generic pain diagram |
| 42 | W | Concerning the cavernous sinus, select the false statement | Skull foramina labeled | cavernous sinus → skull base foramina (region only) |
| 49 | W | Habituation of synapses is due to | Hippocampus Hippocampus diagram 1 | habituation → hippocampus (memory region, not the Aplysia mechanism) |
| 52 | N | Regarding the left recurrent laryngeal nerve, select one correct statement | — | withheld: every vagus image names the key (leak firewall) |
| 64 | W | Synaptic delay | Schematic of spatial summation curve | synaptic delay → summation graph |
| 68 | W | Silver stain demonstrates | Blausen 0657 MultipolarNeuron | silver stain → neuron diagram |
| 71 | W | At view of the extrapyramidal tracts of the spinal cord | Corticospinal tract Corticospinal tract diagram 1 | extrapyramidal → corticospinal diagram |
| 73 | N | The micturition reflex is influenced by all of the following signals except | — | withheld: chapter label mismatched, stem has no concept |
| 74 | N | The central nervous system is soft because | — | withheld: multi-topic lesson, no stem concept |
| 75 | W | A 47-year-old woman presents with signs of increased intracranial pressure (vomi | Basal-ganglia-coronal-sections-large | raised-ICP vignette → basal ganglia sections |
| 79 | W | Pain receptors are absent in | Pain Pain diagram 1 | pain receptors absent in → generic pain |
| 82 | W | Pain receptors in the wall of GIT and urinary tract may be stimulated by all of  | Pain Pain labeled 6 | visceral pain receptors → generic pain |
| 90 | N | The superficial temporal vein unites with which vein to form the retromandibular | — | withheld: no registry concept for facial veins |
| 92 | W | Regarding the maculae of utricle and saccule | canals Semicircular canals micrograph 4 | maculae → semicircular canals micrograph |
| 97 | W | Decerebrate rigidity is due to | Patellar reflex Patellar reflex diagram 1 | decerebrate rigidity → patellar reflex |
| 100 | W | The pterion is an important clinical landmark because it overlies the | artery Maxillary artery specimen 2 | pterion → maxillary artery (parent of middle meningeal) |
| 102 | W | The following nerves embedded in the lateral wall of the cavernous sinus except | Skull foramina labeled | cavernous sinus wall → skull base foramina |
| 109 | W | Habituation of synapses | Hippocampus Hippocampus diagram 1 | habituation → hippocampus |
| 118 | W | A 2-month-old male infant had a small pit at the anterior border of the sternocl | triangle Carotid triangle specimen 2 | branchial pit → carotid triangle (region only) |

## 3. Pre-answer leak audit (every practice MCQ)

| Measure | Result |
|---|---|
| Practice items audited | 921 |
| Primer texts (model paragraph, movie steps, frame) containing the exact key phrase or ≥ half of the key-distinctive words unmasked | **0** |
| Commons queries built from key-distinctive words (sample of 154 items, 74 queries) | **0** |
| Items with no model paragraph | 0 |
| Items with a discriminator frame | 352 |
| Items with a masked prediction gap (▢▢▢) | 122 |
| Script errors | 0 |

Leak rule: the key's distinctive tokens are the words in the key but not in the stem or distractors. A text leaks if it carries the exact key phrase (whole-word match, Greek transliterated) or at least half of those tokens unmasked. The v14.1 audit script reported 2 false positives: it stripped Greek letters ("γ-motor" read as "motor") and matched substrings ("Aα" inside "Ia"). The script now normalizes text exactly as the engine does, and the engine's own `leaks()` never flagged either item.

## 4. Wrong-answer autopsy benchmark

The deliberate miss is the most tempting distractor, where one exists: the option that triggers a contrast, otherwise one that is not a pure retrieval miss. Stems without EXCEPT/NOT are preferred so the contrast engine is exercised, and one EXCEPT item tests the polarity branch. Required mix: ≥3 anatomy, 3 physiology, 3 histology, 2 lesion/laterality, 2 tract; achieved: 4 / 4 / 5 / 4 / 4, plus 1 polarity.

| Cat | Stem | Key | Chosen | Class | Discriminator | Command | Look-alike visual |
|---|---|---|---|---|---|---|---|
| ANATOMY | In adults, the spinal cord ends at | Lower border of L1. | Lower border of L3. | number | `cord_level` | ظبّط الاتجاه (Orient first) | honest "no trustworthy distinct visual" |
| ANATOMY | Regarding the spinal meninges select the correct statement | The dura mater sends sheaths around the  | The denticulate ligament attaches pia to | sibling | `frame:pia_dura` | شوف علاقته بإيه (Map the relations) | honest "no trustworthy distinct visual" |
| ANATOMY | The superior oblique muscle of the eye is supplied by | Trochlear nerve. | Oculomotor nerve. | lookalike | `eom_nerves` | مين معصّبه؟ (Find the nerve) | honest "no trustworthy distinct visual" |
| ANATOMY | The following nerve supplies taste sensations to anterior 2/ | Chorda tympani | Hypoglossal | lookalike | `tongue_nerves` | مين معصّبه؟ (Find the nerve) | honest "no trustworthy distinct visual" |
| PHYSIOLOGY | Excitatory postsynaptic potential | Is a state of local depolarization | Cannot be summated | sibling | `frame:temporal_spatial` | شغّل الميكانيزم (Run the mechanism) | honest "no trustworthy distinct visual" |
| PHYSIOLOGY | The stretch reflex in skeletal muscles | is promoted by stimulation of gamma moto | depends on muscle spindles sensitive to  | sibling | `frame:spindle_gto` | حطّهم جنب بعض (Side by side) | honest "no trustworthy distinct visual" |
| PHYSIOLOGY | Concerning color vision | The stimulation ratio of the 3 types of  | It is mediated by rods | lookalike | `rods_cones` | حطّهم جنب بعض (Side by side) | honest "no trustworthy distinct visual" |
| PHYSIOLOGY | Concerning hypermetropia | The eye is often shorter than the emmetr | The near point distance decreases less t | sibling | `frame:myopia_hyper` | شغّل الميكانيزم (Run the mechanism) | honest "no trustworthy distinct visual" |
| HISTOLOGY | Cell type forms the myelin sheath around myelinated axons in | Oligodendrocyte. | Schwann cell. | lookalike | `oligo_schwann` | طلّع شبيهه برّه (Kill the look-alike) | distinct: MICROGRAPH cells Schwann cells micrograp |
| HISTOLOGY | Which of the followings concerning the basal ganglia is corr | The amygdaloid nucleus is connected to t | The claustrum is not a part of basal gan | sibling | `frame:bg_parts` | اقفل عالجوهر (Lock onto the core) | honest "no trustworthy distinct visual" |
| HISTOLOGY | Regarding the peripheral nerve | Sheath of Henle consists of reticular fi | The nerve is covered by dense connective | sibling | `frame:nerve_sheaths` | فرّق النسيج (Read the tissue) | honest "no trustworthy distinct visual" |
| HISTOLOGY | Melanin in the pigmented layer of retina | Is a dark pigment that prevent reflectio | Is located in the outer segment of photo | lookalike | `rpe_photoreceptor` | فرّق النسيج (Read the tissue) | honest "no trustworthy distinct visual" |
| HISTOLOGY | Regarding the cerebellar cortex, which of the following stat | The dendrites of Golgi cells extend in a | Granular cells have many long dendrites. | lookalike | `cerebellar_cells` | فرّق النسيج (Read the tissue) | honest "no trustworthy distinct visual" |
| LESION | Brown-Sequard syndrome is characterized by all the following | Loss of vibration sense on the opposite  | Loss of voluntary movements on the same  | polarity | `—` | اقفل عالجوهر (Lock onto the core) | honest "no trustworthy distinct visual" |
| LESION | In UMN lesions the response of the paralyzed muscles to elec | Not changed | Exaggerated | sibling | `frame:umn_lmn` | حدّد الإصابة (Localize the lesion) | honest "no trustworthy distinct visual" |
| LESION | Patient came to ER with LMNL of the hypoglossal nerve on the | Medulla oblongata. | Motor area 4. | lesion | `crossed_brainstem` | حدّد الإصابة (Localize the lesion) | distinct: LABELED DIAGRAM Corona radiata Public do |
| TRACT | The lateral spinothalamic tract is characterized by all of t | contains nerve fibres from receptors on  | carries fibres which terminate in the th | polarity | `—` | اقفل عالجوهر (Lock onto the core) | honest "no trustworthy distinct visual" |
| TRACT | Axons of the lateral corticospinal tract synapse mainly with | lateral motor neurons | medial motor neurons | sibling | `frame:lcst_acst` | فين بيكروس؟ (Where does it cross?) | honest "no trustworthy distinct visual" |
| TRACT | 1st ON cell bodies of dorsal column are found in | Dorsal root ganglia | Sympathetic chain ganglia | lookalike | `drg_autonomic` | فرّق النسيج (Read the tissue) | honest "no trustworthy distinct visual" |
| LESION | What is the muscle responsible for flexion of the head to th | Sternomastoid. | Trapezius. | sibling | `frame:scm_action` | شغّل الميكانيزم (Run the mechanism) | honest "no trustworthy distinct visual" |
| TRACT | Concerning Ventral spinocerebellar tract; which statement is | Cells of origin receive proprioceptive i | Carries conscious proprioceptive impulse | sibling | `frame:dcml_scbt` | شوف معدّي منين (Trace the route) | honest "no trustworthy distinct visual" |
| POLARITY | One of the following regarding the cerebellum is not true | Is a part of the brainstem. | Lies in the posterior cranial fossa. | polarity | `—` | اقفل عالجوهر (Lock onto the core) | honest "no trustworthy distinct visual" |

Results:
- **Discriminator fit: 22/22** by manual review. Every miss got a discriminator about the actual confusion:
  - 7 pairwise look-alike contrasts, where the key and the chosen option each match one pole;
  - 10 sibling frames: the contrast library entry for the topic of the chosen option or stem;
  - 1 lesion-localization contrast and 1 level contrast (L1 vs L3);
  - 3 polarity explanations: on EXCEPT items the chosen option is a true statement.
- The benchmark's first run found 3 wrong frames: sternomastoid → cord hemisection, pigment epithelium → rods/cones, "spindles sense tension" → inverse stretch reflex. Two more followed in the extended run (basal nuclei parts → direct/indirect pathway; ventral spinocerebellar → spinothalamic). All five were fixed:
  - neuro-context requirement on the hemisection frame;
  - chosen-option-first frame scoring;
  - four new contrasts (`scm_action`, `rpe_photoreceptor`, `bg_parts`, `dcml_scbt`).
- **Correct anchor visual: 22/22** loaded (mocked Commons). The spinocerebellar item's anchor was a spinothalamic diagram until the category-fallback fix; it is now the all-ascending-pathways figure.
- **Distinct look-alike visual for the chosen distractor: 2/22.** The other 20 say so explicitly rather than substituting a generic image. A look-alike image is accepted only when its title names the chosen side. With real Commons titles that rate may differ; it is a known limitation.

## 5. How to re-run

```bash
node tests/serve.js source/public 8787 &      # static server + /api/state emulation
node tests/leak_audit.js                      # 921-item leak audit
node tests/visual_bench.js receipts/v14/visual_bench.json   # re-grade rows by hand afterwards
node tests/autopsy_bench.js receipts/v14/autopsy_bench.json
node tests/certify.js                         # 60 checks
```
On the live site (iPad Safari console or desktop): `await INTELLECTUALITY_V14.audit({n:60})` returns the same metrics against live Commons. Review `rows[].primary` by hand for relevance.

