# v17 Receipt: a hand-drawn CNS atlas you can touch, and a game layer built for ADHD

The owner asked (24 Sep 2026): *"The drawings have to be crazy too, not general but world class and specific to the things, because CNS is all about imagination. Also I have ADHD so gamify it, but don't amputate or ruin it. Research what works best for someone with ADHD and build it in."*

The goal is unchanged: the most marks per minute in the NEU-205 MCQ exam (Sun 15 Nov 2026). Nothing was removed. The schedule, questions, explanations, notes, mocks, daily minutes, department drawings and photos all work as before. v17 adds two layers on top.

## 1. The CNS atlas: 22 live diagrams drawn for this course

The old pictures were the best free image found for each term. They are often generic and never show the exact fact a question tests. v17 adds a hand-drawn atlas: 22 interactive SVG diagrams, drawn from standard anatomy and labelled in the notes' own words. They have 244 named parts you can tap and 97 states (lesions, pathways, phases). There are no generated images and no downloads, and the atlas works offline.

| Diagram | What you can do with it |
|---|---|
| **Spinal cord** | Every tract the department asks for (gracile, cuneate, Lissauer, DSC, VSC, LCS, rubrospinal, reticulospinal, LST, spinotectal, olivospinal, AST, vestibulospinal, tectospinal, ACS, sulcomarginal), horns, SG, Clarke's nucleus, roots. **Lesion simulator**: hemisection (Brown-Séquard) with a body map of which side loses what, syringomyelia (cape), tabes dorsalis, anterior spinal artery. **Moving traces** of the pain, touch and motor paths through the section. Blood supply. |
| **Three long pathways** | Dorsal column, spinothalamic and corticospinal side by side, animated, with the three crossing levels marked. |
| **Visual pathway** | Blue and orange fibres (left and right half-field) through nerve, chiasma, tract, LGB, Meyer's loop and parietal radiation to V1. **Field-defect simulator** with 7 lesion sites and the patient's two visual fields drawn. |
| **Pupillary light reflex** | Move the torch between the eyes. Normal, left optic nerve cut (afferent), left III cut (efferent), Argyll Robertson. A pupil grid shows the result. |
| **Eye movements** | A face. Tap 9 gaze directions and both eyes move, with the muscle tested lit in each H (LR6 SO4). Right VI, III and IV palsies and Horner (ptosis and pupil drawn). |
| **Cerebral cortex** | Lateral and medial surfaces with areas 4, 6, 3-1-2, 8, Broca, Wernicke, auditory, angular, paracentral, V1, cingulate, corpus callosum. The **homunculus strip**. **ACA / MCA / PCA territories** and strokes. |
| **Circle of Willis** | Every branch (vertebral → PICA … ICA → MCA/ACA), III between PCA and SCA, IV with SCA. The ring highlighted (MCA not in it). SCA bleed → IV. PICA → Wallenberg. |
| **Internal capsule** | Horizontal section: limbs, genu, retro- and sublenticular parts; face → arm → leg order; blood supply; a capsular bleed → opposite hemiplegia (body map). |
| **Brainstem** | Front view with every cranial-nerve exit. Weber, medial pons, medial medulla and lateral medulla, each with same-side and opposite-side signs. |
| **CSF** | Choroid plexus sites, flow from ventricle to sinus (animated), and four blocks: aqueduct, Monro, outlets, absorption (communicating). |
| **Basal ganglia** | Direct and indirect circuits with transmitters. **Disease switches** (Parkinson, Huntington, hemiballismus, athetosis) change the arrow strengths and a live "thalamic drive" meter. |
| **Cerebellum** | Unfolded map (archi, paleo, neo), deep nuclei, peduncles, lesion signs. **Cortical circuit** too: mossy → granule → parallel fibres, climbing fibres, Purkinje output, basket, stellate, Golgi. |
| **Stretch reflex** | Knee jerk with spindle, Ia, α, γ loop, reciprocal inhibition, Golgi tendon organ; UMN vs LMN. The leg kicks. |
| **Synapse** | Five steps (AP → Ca²⁺ → release → receptor → stop), presynaptic inhibition, botulinum vs tetanus. |
| **Summation lab** | Tap EPSP A, EPSP B and IPSP C and watch the membrane potential. Temporal and spatial summation fire the neuron. |
| **Cochlea** | Uncoiled, with **pitch and loudness sliders**: the travelling wave peaks at the base for high pitch and at the apex for low; noise damage. |
| **Cochlear duct** | Scalae, stria vascularis (+80 mV, K⁺), organ of Corti (inner and outer hair cells, pillars, Deiters, Hensen, tectorial membrane), spiral ganglion; membrane up → depolarisation. |
| **Semicircular canals** | Start, constant speed, stop: endolymph lag, cupulae, firing of each nerve, and nystagmus drawn on the eyes. |
| **Retina** | The ten layers numbered, every cell type, and the path of light and signal. Müller cells, and which nuclei and synapses sit in which layer. |
| **Rod** | Dark (dark current, −40 mV, glutamate ↑) vs light (11-cis → all-trans … −70 mV, glutamate ↓). |
| **Facial nerve** | Tap a lesion site on the course and see the face it produces (UMN spares the forehead) and the lost functions (taste, hyperacusis, tears, hearing). |

**Where they appear.** A diagram opens **93 lesson sections**, in the state that section teaches. It sits above the department's own drawings and the photos, which all stay. After an MCQ is answered, the matching diagram opens under the explanation, set to what the question tested: a hemisection stem opens the cord with the right half cut, a bitemporal stem opens the chiasma lesion, Argyll Robertson opens the pretectal lesion. **559 of the 1,011 practice questions** get one. A diagram is **never shown before an answer** (no hints) and **never inside a sealed mock**; it only appears in the mock's review after submission.

**Every diagram has "Spot it":** 5 structures named one at a time, you tap them, with instant ✓ or ✗ and the right one glowing. This is retrieval practice as play.

## 2. The ADHD game layer, built from the research

The research is in `docs/ADHD_RESEARCH.md` (13 findings with sources and evidence grades). What was built:

- **Every answer pays at once.** An XP pop appears on the verdict: +12 right, +4 wrong ("trap spotted"). A combo counter shows 🔥 at 3 or more, and a rematch that is won shows ⚔️. Nothing is ever taken away: no lives, no XP loss, no "streak lost". *(Delay aversion; continuous beats partial reinforcement.)*
- **A progress bar that is always on screen.** It shows the level ring and rank, XP to the next level, the 🔥 study-day streak with ❄️ freezes, the **sprint dots** (8 per sprint) with the sprint clock, and today's quests. *(Externalise time and progress at the point of performance.)*
- **Sprints of 8.** After the 8th answer, a small card shows the score, XP, best combo and minutes, with **Keep going** and an optional **2-minute move break**. The break is a countdown ring with three movement ideas. It is offered, never forced, so hyperfocus is never cut off. *(Chunking; acute exercise and inhibitory control.)*
- **Three daily quests** tied to what moves the grade: learn 6 sections, answer 25 MCQs (or **beat the boss**, the sealed mock, on mock days), win 3 rematches, hit a 5× combo, or clean-sweep a Spot-it drill. Each pays +30 XP; all three open the daily chest (+50).
- **Ranks named after the nervous system:** Neuron → Synapse → Reflex arc → Spinal tract → … → Connectome. Mocks are **boss fights** (+50 XP when finished). Items that come back after a mistake carry a ⚔️ rematch mark. *(Light game fiction, the strongest moderator in the gamification meta-analysis.)*
- **Forgiving streak.** It starts with 2 freezes and earns one per 7-day run (max 3). A missed day quietly uses one. A longer gap restarts at 1 with "welcome back", never a shame screen.
- **Your choice.** Settings in the quest panel: game on/off, vibration (Android), sounds (off by default), calm mode (no motion or confetti). The device's reduce-motion setting is respected everywhere.

**What it does not touch.** The game layer keeps its own XP (`S.game.xp`); the app's own `S.xp`, which v14 reads, is never changed by it. It adds no questions, no steps and no minutes. During a sealed mock the bar shows **no score**, and the displayed XP is frozen even after a reload, so nothing reveals whether an answer was right.

## Evidence

| Check | Result |
|---|---|
| New suite `tests/atlas_game_test.js` | **22/22** (see the final pass below): all 22 diagrams draw; all 97 states apply with an explanation; every named part is drawn and tappable; every Spot-it target exists; 93 mapped sections exist in the notes; questions open in the right state (16 keyword cases); 559/1,011 practice questions get a diagram; explore, drill (5/5 + XP), full screen; simulators (torch, VI palsy, UMN face, spatial summation); reduce-motion; **held-out firewall** (no sealed-mock stem shares a 7-word run with the diagrams' text); lesson order and fit; XP pops (+12/+4, never a loss); sprint card; move break; quests panel; forgiving streak; quests and chest; **sealed mock shows no score and no diagram**; game on/off; broken state repaired; no page errors |
| All earlier suites | See the final regression table below (run on the final files) |

## Honest limits

- The diagrams are **schematic**, drawn for understanding and recall, not photographs. Proportions are simplified; where textbooks differ (e.g. the exact tract positions in the anterior funiculus), the layout follows the common teaching diagram.
- 452 practice questions (mostly neck anatomy, histology details and physiology numbers) have no diagram of their own. Neck lessons keep the department's own drawings (v16.2), and every question keeps its photos.
- Vibration works on Android only; iPad Safari has no vibration API.
- The ADHD research shows what helps attention and learning in general. It does not promise a result for one learner, and this app is not a treatment.
