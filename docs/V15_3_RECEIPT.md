# v15.3 Receipt: toward 10/10 without asking the learner to do anything

The owner's instruction: *"Your job is to make the 10/10 system for my goals, not me. I am too lazy to do this stuff. The question bank is from the university (Kasr Al Ainy); research the MCQ past papers, I think they are in the question banks. Do everything else."*

## Past papers: what is already in the bank

- **What the bank holds.** The bank (`EHSAN_QBANK`, from the uploaded Team Ehsan compilations) has **1,321 MCQs and 112 written questions**. The MCQs carry past-exam tags: batches **191–198**, including end-of-module (**EOM**) and **198 Final** papers; years **2013–2021**; the **Department** book; **Effat**; and **IPKA**. You are batch 199.
- **Web search found nothing more.** A search for Kasr Al Ainy NEU-205 CNS past papers found no public copies; the only Kasr hits were papers for other subjects (e.g. a 2014 surgery MCQ paper). These papers circulate in student compilations like this one, so the bank is the past-paper source.
- **The app already weights by exam frequency.** An exam-pattern engine (`NEU205_PATTERN`: chapter tiers S/A/B, repeat counts) already ranks practice questions. v15.3 carries the same signal into the notes.

## What v15.3 adds

| Piece | What it does |
|---|---|
| **Teaching for every tested practice fact** (`learn-notes-plus-v15.js`) | I read the practice questions whose fact was not taught in the section they belong to, and added teaching lines in that section. The lines are framed the way Kasr asks: a clinical vignette leading to the structure, and the "all EXCEPT" odd one out. Held-out items were not read. |
| **Syllabus depth** | **16 new sections**, all on physiology topics that were thin: synapse types and transmitters; pain chemistry and dorsal-horn laminae; referred pain; vestibular reflexes and tests; the auditory pathway and tuning-fork tests; cerebellar circuitry; basal-ganglia loops and Parkinson's; motor areas and the pyramidal tract in numbers; UMN/LMN signs; arousal and the hypothalamus; sleep cycles and the EEG in epilepsy; the language circuit and aphasias; memory types and amnesia; optics; accommodation and presbyopia; retinal processing. There are also additions to anatomy and histology (white matter, 3rd ventricle, meninges and cisterns, embryology, thyroid and neck, cornea, uvea, retina). In total there are **229 new teaching lines**, and the notes grew from **43,200 to 53,300 words** (both counted the same way). |
| **Doubtful bank keys** | The correct fact is taught and the bank's key is marked ⚠ for: CSF made "exclusively" in the lateral ventricles; projection fibres "to the cerebellar cortex"; the odd-one-out among postsynaptic receptors; the EPSP via voltage-gated channels; clonus as an LMN sign; raised IOP "preventing near vision"; and two conflicting keys for joint stabilisation. The bank itself is unchanged. |
| **Past-paper badges** | Every lecture section shows how many practice questions it teaches and which past exams they came from, e.g. `🔥🔥 4 bank questions · past exams: 196 · 194 · 193 · 192`. Each chapter opens with its exam tier, e.g. `EXAM TIER A (10 sources)`. The badges are counted from practice items only. |
| **Written exam** | The department's **112 written questions** are attached to the sections that answer them. A lecture page shows "✍️ The written exam asks this section as …". In the daily written boss, the reveal now opens with a **model-answer outline built from the notes**: 1–3 sections, their headings, key points and the trap. |
| **Self-correcting pictures** | The enlarged view has **"✗ Wrong picture — show another"**. One tap swaps in the next-best free picture for that exact term. The rejection is remembered (it syncs with progress), so that picture never returns for that term. |
| **Personal pace** | Every finished step is timed against its plan. Time while the app is hidden does not count, and a step is capped at 3× its plan. After 8 steps, "minutes remaining" is shown at the learner's pace, e.g. `~116 min remaining at your pace (×2.0)`. A future catch-up spread uses the same pace to decide how much fits in a day. |
| **Offline** | A service worker (`sw.js`) keeps the app usable without internet. Pages, scripts and notes are network-first, so a new deploy always wins, and the last good copy is used offline. Bundled pictures are cache-first. The next two days' lecture pictures are fetched ahead in the background. Cloud save (`/api`) and other sites are never touched. |

## Evidence (`receipts/v15_3/`)

| Check | Result |
|---|---|
| v15.3 suite (`tests/v153_test.js`) | **10/10**: notes-plus integrity (nothing unplaced; original section ids unchanged, so saved recall ratings stay valid; new sections complete) · exam tier and past-paper badge · written question on a lecture section · model-answer outline in the written boss · wrong-picture swap remembered across reload (tap target ≥ 44 px) · personal pace ≈ 2.0× after 12 double-time steps · **offline**: after one online visit, the app and today's lecture open with the network off, bundled pictures included |
| Practice answers taught — v15.0 measure (chapter level) | **851/915 (93.0%)**; v15.0 had 90.8% |
| Held-out answers taught — v15.0 measure (counts only) | **271/398 (68.1%)**; v15.0 had 65.3% |
| Practice answers taught — **strict** (same section + ≥ 40% of the question's words) | **762/919 (82.9%)**, up from 78.8% |
| Held-out — strict (counts only) | **198/398 (49.7%)**, up from 46.0% |
| Spread / LEARN / certify / hostile / host / options gallery / leak / audit30 / rollback | 23/23 (both builds) · 17/17 + 18/18 · 62/62 + 62/62 · 26/26 · 14/14 · 7/7 · clean · clean · pass |
| Speed | First paint 184 ms. Next lecture page 50 ms on a 4×-slowed CPU. Badges are computed after the page draws |

## Honest limits

- **The strict measure is word-matching.** It cannot recognise teaching that uses different words from the question ("0.5 ms in the CNS" versus "0.5 millisecond in the central nervous system"). Of the 157 practice items it still flags, I wrote a teaching line for most. The notes were **not** padded with question wording to raise the number.
- **Held-out coverage stays at about 50% strict / 68% chapter-level.** Held-out items were never read, on purpose, so the notes were extended by syllabus (textbook depth) rather than by those items. The weekly mocks remain a fair test.
- **Written model answers** are built from the notes, not from a department marking scheme, and say so on screen.
- **Offline** needs one online visit; pictures for days further ahead than the next two are fetched when those days come.
- **Medical review.** No clinician has reviewed the notes. The additions follow Guyton, Snell and Junqueira level teaching; the ⚠ items name where the bank disagrees.
