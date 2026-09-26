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

## Evidence (final pass on the deployed files, `receipts/v17/all_suites_final_v17.txt`)

| Check | Result |
|---|---|
| **New:** `tests/atlas_game_test.js` | **22/22** on the source and **22/22** on the Vercel build. All 22 diagrams draw; all 97 states apply with an explanation; every named part is drawn and tappable; every Spot-it target exists; the 93 mapped sections exist in the notes; questions open in the right state (16 keyword cases); 559/1,011 practice questions get a diagram. Explore, drill (5/5 + XP) and full screen work. Simulators work (torch, VI palsy, UMN face, spatial summation). Reduce-motion is respected. **Held-out firewall**: no sealed-mock stem shares a 7-word run with the diagrams' text. Lesson order and fit are right. XP pops are +12/+4, never a loss. Sprint card, move break and quests panel work. The streak is forgiving. Quests and the chest pay out. **A sealed mock shows no score and no diagram**, even after a reload. The game switches on and off. A broken state is repaired. No page errors. |
| v16 suite, public site | **25/25**. Full course: **1,011/1,011** practice past papers by day 47, **399/399** held-out in 14 mocks, **109** min/day on average, **140** at most, 891 KB saved state. Same pace as v16.3: the new layers add no minutes. |
| v16 suite, owner's device (drawings key present) | **25/25**. **1,061/1,061** by day 47, 109 min/day on average, **141** at most, 900 KB |
| Department drawings | **16/16** on the source and on the Vercel build (the atlas sits above them; the drawings-first-then-photos order holds) |
| Strict notes coverage | practice **1,009/1,009 (100%)** |
| Other suites | certify **62/62** · spread **23/23** · LEARN **17/17** · hostile **26/26** · v15.3 **10/10** · Vercel host **14/14** · options gallery **7/7** · leak audit **0** text or query leaks · rollback v17 → v53 → v17 **pass** |
| Build | "47 app scripts/styles present" (the 6 atlas scripts, the atlas and game styles, and the game script) |
| Deployment | `dpl_H4vSAFNrxUKucNV56cR8uTbEKKVq`, **READY**, production, aliased to https://intellectuality-cns.vercel.app (tab title "INTELLECTUALITY CNS v17 · MCQ EXAM") |

## Honest limits

- The diagrams are **schematic**, drawn for understanding and recall, not photographs. Proportions are simplified; where textbooks differ (e.g. the exact tract positions in the anterior funiculus), the layout follows the common teaching diagram.
- 452 practice questions (mostly neck anatomy, histology details and physiology numbers) have no diagram of their own. Neck lessons keep the department's own drawings (v16.2), and every question keeps its photos.
- Vibration works on Android only; iPad Safari has no vibration API.
- The ADHD research shows what helps attention and learning in general. It does not promise a result for one learner, and this app is not a treatment.

## v17.1: the course map (every day, every date; skip or read anything)

The owner asked (25 Sep 2026): *"A feature to see the upcoming days and the previous days like a map, and I can skip something if I want. Full access to the dates and everything I can see."*

**Where:** a **🗺️ Map** button in the top bar (also at the top of the course outline).

**What it shows:**

- **Header:** today's date, the day you are on ("Day 5 of 56"), days left to the MCQ exam, and whether you are on plan, ahead or behind.
- **Four counters:** lessons learned, past papers done, mocks finished, lessons skipped.
- **The road to the exam:** a calendar of all 56 days (Mon–Sun weeks). Each tile is coloured by status: done, you are here, today's date, behind, skipped, lessons moved, ahead, mock 👾, exam 🎯. Tap a tile to open that day.
- **Every day** as a card, grouped by week, with the real weekday and date. Each card shows its lessons (subject, topic, step dots), each lesson's past-paper count and score, where a moved lesson came from, the day's round and mock, and minutes. The days after the MCQ exam are one tap away.

**What you can do:**

| Action | What happens |
|---|---|
| 📖 **Read** (any lesson, any day) | Opens the lesson's notes read-only: its sections, points, "why", traps, live diagrams and pictures. Reading changes nothing. |
| ✓ **Mark learned** (from the reader) | Completes the lesson's learning steps. Its own past-paper block still comes on its day. |
| ⏭ **Skip a lesson** | One-line confirm, then the app moves on. The lesson counts as taught, so **its past papers come in the daily rounds; none is lost.** |
| ⏭ **Skip the round / a mock / the rest of today / a whole day** | Due reviews wait for the next round. A skipped mock hands its held-out questions to later mocks. |
| ⏩ **Start this day now** | Jumps ahead. The days in between are skipped and marked passed, and the app starts the chosen day. |
| ↩ **Undo** | Restores a skipped lesson or day exactly, until that day has been passed. |

Nothing can be skipped while a sealed mock is running. The map's record (`S.map`) stays under 3 KB.

**Evidence:** `tests/course_map_test.js` **11/11**. It checks every day with its real weekday and date; "you are here"; the exam day; moved days; reading changes nothing; mark learned keeps the block; skip moves on and sends the past papers to the rounds; undo restores; skip mock, skip day and jump; a skipped round closes the day; nothing changes during a mock; the record stays small; the map fits a 390 px phone; no page errors. The full-regression results are in the table below.

### v17.1 final regression (all suites green)

| Suite | Result |
|---|---|
| Course map | **11/11** on the source and on the Vercel build |
| Atlas + game | **22/22** on the source and on the Vercel build |
| v16 MCQ system | **25/25** public and **25/25** with the department key present |
| Department drawings | **16/16** on the source and on the Vercel build |
| Strict notes coverage | practice **1,009/1,009 (100%)** |
| Other suites | certify **62/62** · spread **23/23** · LEARN **17/17** · hostile **26/26** · v15.3 **10/10** · Vercel host **14/14** · options gallery **7/7** · leak audit **0** text leaks · rollback v17.1 → v53 → v17.1 **pass** |
| Build | "49 app scripts/styles present" (the map's script and style included) |
| Deployment | `dpl_J1zvDz7uG4mC4gYikK8tj5ez8nbp`, **READY**, production, aliased to https://intellectuality-cns.vercel.app (tab title "INTELLECTUALITY CNS v17.1 · MCQ EXAM") |

Log: `receipts/v17_1/all_suites_final_v17_1.txt`.

## v17.2: commute mode and the read-aloud voice are opt-in

The owner asked (25 Sep 2026) to make commute mode optional, and did not want the robotic AI voice.

**Now (default OFF):**

- The app **never opens the commute screen by itself**, on any day. A saved state that was left in commute mode opens in the course.
- The professor's **"🔊 READ IT TO ME"** button is hidden, and the device **cannot speak**: every speech request is dropped while commute mode is off.
- Nothing is removed. **⚙ Study mode → "🚗 Commute mode: OFF · tap to turn on"** turns it on and opens the commute screen in one tap. The progress panel's settings have the same switch.

**When it is on:**

- The commute screen works as before: two 25-minute hands-free trips on Sunday, Tuesday and Thursday.
- The screen adds a **voice menu, a speed menu and a ▶ Test button**. By default the app picks **the best English voice on the device**: Premium, then Enhanced/Neural, then Siri, then Google/Microsoft. Novelty voices (Albert, Zarvox, …) and non-English voices are left out.
- The best voices on an iPad are free but must be downloaded once. The screen says where: *Settings → Accessibility → Spoken Content → Voices → English*, then a **Premium** or **Enhanced** voice.
- If the iPad loads its voice list late (Safari does), the open menu fills in by itself.
- **"Turn commute mode off"** stops any speech at once and hides everything again. The chosen voice and speed are remembered.

The saved record is `S.audio = {commute, voice, rate}`.

**Evidence:** `tests/audio_options_test.js` **12/12**, run against a fake speech engine that has an iPad's mix of voices. It checks:

- Off by default on a drive day: no commute screen, no read-aloud button, no speech.
- One tap turns it on: commute screen, trip button and voice menu (Premium voice ranked first; novelty and Arabic voices excluded).
- ▶ Test uses the best voice.
- A picked voice and speed are used and saved.
- The 25-minute trip speaks with them.
- Off stops the speech, hides everything, and survives a reload.
- The progress-panel switch works.
- An old save left in commute mode opens in the course.
- The menu fits a 390 px phone.
- A late voice list fills the open menu.
- No page errors.

### v17.2 final regression (all suites green)

| Suite | Result |
|---|---|
| Commute + voice (new) | **12/12** on the source and on the Vercel build |
| Course map | **11/11** on the source and on the Vercel build |
| Atlas + game | **22/22** on the source and on the Vercel build |
| v16 MCQ system | **25/25** public and **25/25** with the department key present |
| Department drawings | **16/16** on the source and on the Vercel build |
| Strict notes coverage | practice **1,009/1,009 (100%)** |
| Other suites | certify **62/62** (the commute view still renders) · spread **23/23** · LEARN **17/17** · hostile **26/26** · v15.3 **10/10** · Vercel host **14/14** · options gallery **7/7** · leak audit **0** text leaks · rollback v17.2 → v53 → v17.2 **pass** |
| Build | "51 app scripts/styles present" (the new script and style included) |

One run failed first, and it was the test's fault. On the Vercel build, the audio suite stopped after A6: the host's sync layer restored the cloud copy and reloaded the page while the test was reloading it. The test now waits for that second load. The rerun passes, and it shows the off setting survives the cloud restore. Log: `receipts/v17_2/all_suites_final_v17_2.txt`.

## v17.3: the answer's picture shows what the explanation says

The owner said (25 Sep 2026): *"The photos and visuals not on point… the images must include everything in the explanation."*

Before v17.3, an answered question opened one diagram in one state, chosen by keyword rules, and the photos showed only the right answer and your choice. That diagram usually did not show the wrong options. The explanation names each one ("b: an LMN lesion abolishes deep reflexes"), but the picture had nowhere for most of them.

**Now, after every answer (`cns-answer-v17.js`):**

- **"✅ This answer"** opens the diagram and marks every option it can:
  - the right answer in **green**;
  - each wrong option in **red**, with your own choice **ringed in yellow**;
  - anything else the explanation names in **blue**.
- Each marked structure carries its **letter badge**. A **legend row per option** names what is marked. Tap a row to show only that option.
- Options drawn on other diagrams get **up to two zoomed panels** underneath, cropped to the marked parts.
- **How an option is placed.** An option is marked where its own words name a drawn part. If they name none, its line in the explanation decides.
  - A **value** answer ("Exaggerated", "Not changed", "2–6 weeks") is marked on the thing the stem asks about. The legend says *"“Not changed”, about Electrical reaction unchanged (UMN)"*, and the explanation's contrasts stay blue, never green.
  - **"All of the above"** and **"a & c are correct"** are pictured by the options they point at (*"= A + B + C"*).
- **How the diagram is chosen.** The diagram that shows the most options wins, with the right answer counting double. On a tie, the question's own diagram and the diagrams drawn for its lesson win.
- **Avoiding false marks.** Bare names ("Lips", "Face", "Nerve cells") are *weak*: they count only when the question already names something else in that diagram.

**46 new diagrams (68 in all, in 21 files).** Each was drawn for the topics whose options had no place to be marked, from the notes' wording:

- **Histology:** neuron and stains; neuron types; glia; nerve and Wallerian degeneration; endings.
- **Physiology:**
  - spindle; fibre types; reflexes; transection; decerebrate; pain; visceral/referred pain; EPSP/IPSP; synaptic properties;
  - **UMN vs LMN**; **cerebellar signs**; **basal-ganglia disorders and the five gaits**;
  - **receptor potential, adaptation and the sensory code**; **touch, S1 map, proprioception, temperature**;
  - **stretch reflex and tone**; **rotation and nystagmus**; **phototransduction**; **pupillary reflex in the clinic**; **sound and decibels**.
- **Head and neck:** nose and sinuses; larynx; middle ear; pharyngeal arches; lymph nodes; eyeball layers; eyelid and tears; refraction; spinal levels; neck triangles; external carotid; **trigeminal branches and ganglia**.
- **Brain:** labyrinth; ear histology; sleep; memory; **white-matter fibres**; **cranial cavity and cavernous sinus**; **diencephalon and 3rd ventricle**; **brainstem surfaces and nuclei**; **cerebral sulci, insula and interpeduncular fossa**; **CNS histology board**.

**Photos.** One photo per option whose *own* words name a structure, never a word the stem already names. Each photo is labelled with its letter and ✓/✗: the right answer first, then your choice, then the rest, up to five.

- A wrong option's photo appears only beside the right answer's.
- Lead photos too general to show an option ("Pain", "Human eye", "Cranial nerves", "Muscle tone") are skipped in favour of the option's next, more specific term.

### Coverage, measured over the whole bank

| | Before v17.3 | v17.3 |
|---|---|---|
| Questions with an answer figure | 559 of 1,011 practice (keyword rule) | **1,410 / 1,410** (practice and held-out) |
| Options marked on a diagram | 13.6% | **94.0%** (5,469 / 5,815); practice **95.0%** (4,001 / 4,212) |
| Right answers marked | 20% | **98.8%** (1,393 / 1,410); practice **99.4%** (1,005 / 1,011) |
| Questions with *every* option marked | 45 | **1,135** |

Where an option is still not drawn, its legend row shows its text in grey. The explanation beside it still names it.

### Guard rails

- **Held-out firewall.** Every diagram's text is checked against the sealed mock questions. No 7-word run is shared (atlas test A9). The check caught two phrases during the work, and both were reworded.
- **Sealed mocks** still show no diagrams and no photos until submission (G9, M6).
- **Section ids.** The notes' inserted sections use slug ids (`ph-sleep+sleep-cycles-…`), and the diagrams now point at those.

### Evidence

`tests/answer_figure_test.js` **10/10** checks:

- the coverage thresholds;
- the rendered answer: chip, green key, red wrong options, a badge on every letter, one legend row per option;
- value answers, with the contrasts in blue;
- "all of the above";
- weak aliases;
- lesson ties;
- the real lesson flow: the figure appears on every answered question, and photos are letter-labelled with the right answer first;
- no page errors.

### v17.3 final regression (all suites green)

| Suite | Result |
|---|---|
| Answer figure (new) | **10/10** on the source and on the Vercel build |
| Atlas + game | **22/22** on the source and on the Vercel build (includes the held-out firewall A9) |
| Course map | **11/11** on the source and on the Vercel build |
| Commute + voice | **12/12** on the source and on the Vercel build |
| Department drawings | **16/16** on the source and on the Vercel build |
| v16 MCQ system | **25/25** public and **25/25** with the department key present |
| Other suites | certify **62/62** · spread **23/23** · LEARN **17/17** · hostile **26/26** · v15.3 **10/10** · Vercel host **14/14** · options gallery **7/7** · leak audit **0** text leaks · rollback v17.3 → v53 → v17.3 **pass** |
| Strict notes coverage | practice **1,009/1,009 (100%)** |
| Build | "68 app scripts/styles present" (the 10 new diagram files included) |

The first full pass had two red items, and both were fixed:

- **LEARN L10 (touch targets).** On a 390 px lecture page, the diagram's state buttons were 36 px tall. The spinal-cord lesson now opens a diagram, so they appear on the first lecture page. The diagram's buttons are now at least **44 px** tall, and L10 passes. The suites that draw diagrams were rerun after the change: atlas, answer figure, course map and certify, on the source and the build.
- **Rollback probe.** It needs the exact v53 files (`6e3ebec`) served on :8788, and that server was not running. With it served, the probe passes.

Logs: `receipts/v17_3/all_suites_first_pass_v17_3.txt`, `receipts/v17_3/rerun_after_fixes_v17_3.txt`, `receipts/v17_3/rollback_probe.txt`.


## v17.4: the last undrawn options, and a second organ (Renaissance) after medicine

The owner asked (26 Sep 2026): *"Draw the remaining 6% too, no AI goyslop, super relevant. And we will add an extra sector in our system: after CNS is done for the day, we start the new sector."* (with the full Renaissance Singularity mission).

### The remaining options, drawn

Seven new boards (development of the CNS; scalp and face nerves; parotid, jaw and TMJ; cortical areas and aphasias; arousal and the hypothalamus; pharynx, tonsil and the cervical plexus), the claustrum and amygdala on the capsule section, the deltoid jerk, Purkinje–Sanson images, amblyopia and strabismus, sound localisation and pitch, and names for scattered options on the parts that answer them (75 diagrams in total).

| Answer figures | v17.3 | v17.4 |
|---|---|---|
| Practice right answers drawn | 1,000 / 1,011 | **1,011 / 1,011** |
| Practice options drawn | ~96% | **4,211 / 4,212** (the one left: "the eye is protected by the bony orbit" — the orbit is not in the eyeball section and a forced mark would be filler) |
| All options, whole bank | 94.0% | **98.5%** (5,725 / 5,815) |
| All right answers, whole bank | 98.8% | **99.5%** (1,403 / 1,410) |

Held-out-only gaps (89 options, 7 keys) were not tailored: aliases were never written from held-out items (firewall check: 0 shared 7-word phrases with held-out stems). Receipt: `receipts/v17_4/answer_figure_coverage.json`.

### Renaissance v1

A separate organ: its own files (`renaissance-v1.js`, `renaissance-s1.js`, `renaissance-v1.css`), its own storage key, its own screen. It shows one door on the **STOP MEDICINE** screen — today's question and CONTINUE — and nothing else in the app changes. Behind the door: committed predictions with confidence, every wrong option pre-diagnosed and repaired, a picture or model you can change, two real cases compared, the idea used in a new case and in a far one, a small build (FORGE), and ideas that come back 1, 7 and 30 days later without hints. Helpers: WHY THIS?, SHOW ME DIFFERENTLY, I ALREADY GET THIS, THIS DIDN'T CLICK, GO DEEPER, DONE.

Life first: one session a day; shut on the exam weekend and between 01:00 and 05:00; a 10-minute dose in exam week, late at night or after a heavy week (and the session simply continues another day); rests above 300 minutes a week; no streaks, no backlog. Off switches: `?renaissance=off`, `localStorage.renaissance_off = "1"`, or one constant.

Season 1 (six sessions): tying your own hands (commitment devices), the planes that came back (selection), the test says positive (base rates), the shower that won't settle (feedback with delay), paying for rat tails (Goodhart), the two clinics of Vienna (discriminating tests, on Semmelweis's own counts). Research, architecture, failure universe, benchmarks, invention registry and a 10-year simulation: `docs/RENAISSANCE/`.

### Evidence (`receipts/v17_4/`)

| Suite | Source :8787 | Vercel build :8790 |
|---|---|---|
| renaissance_test (new, 27 checks) | 27/27 | 27/27 |
| answer_figure_test | 10/10 | 10/10 |
| atlas_game_test | 22/22 | 22/22 |
| course_map_test · audio_options_test · dept_figs_test | 11/11 · 12/12 · 16/16 | 11/11 · 12/12 · 16/16 |
| v16_test (public and owner device) | 25/25 · 25/25 | |
| certify · spread · learn · v15.3 · host · gallery | 62/62 · 23/23 · 17/17 · 10/10 · 14/14 · 7/7 | |
| hostile_test | 26/26 (S1 now counts the Renaissance door separately: medicine still has exactly one next button) | |
| leak audit · rollback probe | 0 text leaks, 0 query leaks · v53 → v14.2 → v17.4 clean | |
| strict coverage | practice taught 1,009/1,009 | |

### Honest limits

- Nothing shows yet that Renaissance makes him more capable; the instruments exist, the months of delayed data do not.
- Taste, literature, art and music are not in season 1 (their lawful primary material could not be fetched from the build machine).
- The live deploy could not be confirmed from the build session: the Vercel connector now answers 403/404 for this project. The identical build passed every suite locally.

## v17.5: Renaissance season 2, phone-first figures, honest items, and OMEGA

The owner asked (26 Sep 2026): *"Once you're done with the latest prompt, execute this too and don't stop till you're done."* (with the full Renaissance Singularity OMEGA constitution).

### Season 2 · Seeing structure (after season 1)

Six sessions: **three boxes** (find the constraint in a flow; Little's law), **the decisive question** (value of information), **London 1854** (reasoning inside the era's knowledge; Snow's natural experiment, 315 vs 37 deaths per 10,000 houses), **a new sense for doubling** (log scale, rule of 70), **which is better, and why?** (blind comparisons of sentences, charts and labels, then a testable criterion) and **the hospital that got faster and worse** (an unlabelled world: no session names, five symptoms, find the fewest mechanisms that explain them). Audit: `docs/RENAISSANCE/08_SEASON_2.md`.

Engine: seasons chain; side-by-side blind panels; unlabelled items; a **belief ledger** (every committed answer given before teaching, kept with what replaced it, shown in WHY THIS?); **capability atoms** declared by every session and shown per step.

**A pedagogy governor, two levels.** Level 1: when one kind of picture (diagram, story, analogy, numbers…) has preceded right answers clearly more often for him (at least 6 showings each, +15 points), it is shown first; one day in five the usual order is kept as a control. Level 2: after 20 choices the chooser must beat that control arm or it switches itself off. WHY THIS? says which picture was chosen and why, and how the chooser is doing. Tests R36–R38.

### Three measurement problems found and fixed

| Problem | Found by | Fix | Guard |
|---|---|---|---|
| Picking the longest option scored **0.90** on the 122 Renaissance items (chance 0.31) | counterfeit-learner simulation (OMEGA red teams §130, §143) | 312 option texts rewritten (166 season 1, 146 season 2): reasons moved to the feedback line, wrong options in the same register → every test-wise strategy 0.30–0.37 | **R35** |
| Every wide figure rendered its labels at 6–7 px on a 360-px phone | screenshots at phone width | 21 figures and models redrawn on a 360-unit canvas, 4 panels enlarged; desktop capped at 520 px | **R34** (74 figure states: size ≥ 10 px, nothing cut off, no label collisions) |
| Season 1 declared no capability atoms; unlabelled answers were not beliefs | OMEGA prompt v2 used as a checklist | atoms added; unlabelled answers enter the ledger | **R32**, **R31** |

Also: the reality tap falls back to the session's title when a stored device has no text; generic "he/his" in two season-1 lines made neutral.

### OMEGA research (`docs/RENAISSANCE/omega/`)

A **1,160-candidate registry** (1,003 distinct after deduplication) with the 13 identity fields per candidate, 100 second-generation mechanisms bred from a recorded strongest-200 selection, 54 primitives, 23 generators, 13 ontologies, sixth and seventh escapes; an attack on the mission (14 generators, checked on a random sample that first failed 16/20 and was repaired); mission v2 → v3 → final, each used against the build; objective v0 → v3 and an adversary for every metric; the capability genome (5 of 28 atoms untrained → season 3) and a periodic table with seven predicted gaps; every engine with its status label; the engine's real plan for one day; ten years. `tests/omega_registry_test.js` checks the registry and the counts quoted in the docs.

**Final status**: ARCHITECTURAL RENAISSANCE SINGULARITY is **not declared** — art/music/literature/mathematics seasons, self-improving pedagogy and its meta level are missing (`omega/00_README.md`). No empirical claim is made.

### Evidence (`receipts/v17_5/`)

| Suite | Source :8787 | Vercel build :8790 |
|---|---|---|
| renaissance_test (38 checks: gate, controls, memory, stop rules, content integrity, legibility R34, counterfeit learners R35, governor R36–R38) | 38/38 | 38/38 (re-run on a rebuilt copy after the last wording change) |
| omega_registry_test (11 checks) | 11/11 | — (no server needed) |
| answer_figure_test · atlas_game_test | 10/10 · 22/22 | 10/10 · 22/22 |
| course_map_test · audio_options_test · dept_figs_test | 11/11 · 12/12 · 16/16 | 11/11 · 12/12 · 16/16 |
| v16_test (public and owner device) | 25/25 · 25/25 | |
| certify · spread · learn · v15.3 · host · gallery | 62/62 · 23/23 · 17/17 · 10/10 · 14/14 · 7/7 | |
| hostile_test | 26/26 | |
| leak audit · rollback probe | 0 text leaks, 0 query leaks · v53 → v14.2 → v17.5 clean | |
| strict coverage | practice taught 1,009/1,009 | |

Counterfeit learners over 122 items (chance 0.31): longest 0.32 · shortest 0.35 · most words 0.31 · punctuated 0.37 · hedged 0.35 · jargon 0.31 · no absolutes 0.35 (`counterfeit_learners.json`). Registry counts: `registry_summary.json`.

### Honest limits

- Nothing shows yet that Renaissance makes him more capable; the first delayed evidence is the 30-day hooks (late October 2026).
- The governor acts on the next answer after a picture, not on delayed results, and per-kind rates are confounded by item difficulty; its control arm makes the chooser-vs-control comparison fair, not the per-kind rates.
- Art, music, literature and mathematics seasons are still missing.
- The live deploy could not be confirmed from this session: the Vercel connector still answers 403 ("You don't have permission to list the deployment"). The pushed code is the code that passed every suite above.
- An earlier commit message in this release says "350 option texts changed"; the correct count is 312.
