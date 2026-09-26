# Known Limitations (v18.1 · MCQ exam + Renaissance)

v16.0 is **not** "100% perfect". This file lists what is unproven, what is heuristic, and what could still go wrong. The evidence lives in `docs/V14_CERTIFICATION_RECEIPT.md` and `docs/VISUAL_QBANK_AUDIT.md`.

## v18.0–v18.1 Renaissance ABSOLUTE COMPLETION (season 3, the engine, the oracle)

- **Nothing is empirically validated.** Every Renaissance test is a machine test of behaviour and content; effects on the learner wait for the dates in `docs/RENAISSANCE/completion/EMPIRICAL_QUEUE.md` (first: 30-day recall from late October 2026; form B at day 30; the 90-day delta).
- **The live site for v18.x is not confirmed from the build session.** The Vercel connector sees the team but not the project (403/404), `*.vercel.app` is blocked from the sandbox, and the GitHub connector has no status tool. Every suite ran against the identical local build. Open the site and check the tab reads **v18.1**.
- **Explanation and writing are not measured.** Every instrument is multiple choice or a tap; free text would need a human or a model grader.
- **The sealed items and the lessons share an author.** Leakage is prevented by mechanism (obfuscation, hashes registered before any answer, a six-word firewall), not by separate people; sealing stops accidental exposure, not a determined reader.
- **Global depth.** Four regions have sessions of their own; six are taught as cases inside other sessions (tracked as the `globaldepth` frontier requirement).
- **Media gaps.** No painting, sculpture, recorded performance, video or 3D: those need licensed, Creative Commons or lawful-embed sources, and those rights classes are empty. Music is synthesised from exact pitches (structure, not timbre or performance).
- **Quotation wording** was checked by exact-phrase web search across several copies of the Garnett text, not against a scan: full texts could not be fetched from the build machine.
- **L12–L13 (runtime generation of curriculum and pedagogy) are blocked** on a model credential and a budget the owner has not granted.
- **The requirement graph is self-authored.** The oracle checks every claim against files, symbols and test results, and rejects fabricated claims (CO5), but the mapping of the 711 mission sections to requirements is a judgement, readable in `tools/renaissance/requirement_map.js`.
- **Trials need data.** L1–L11 and L14 decide nothing until each reaches its minimum sample; until then every learner gets a mix of arms by stable assignment.
- **Language (§34) is open.** No language experience exists yet. It had been filed as frontier and was moved back to open, controllable work on review for the completion report, which is why the ledger reads 173 of 174 and no completion is declared (`docs/RENAISSANCE/completion/COMPLETION_REPORT.md`).

## v17.5 Renaissance season 2 and OMEGA

- Season 2 opens only after all six season-1 sessions are finished; nothing in it is validated on the learner yet. The first delayed evidence is the 30-day hooks (late October 2026).
- Six references in season 2 are cited from knowledge and marked "not re-checked in this build" in the app (Goldratt & Cox 1984, Pacini/Koch, the E. coli doubling time, Gopen & Swan 1990, Tufte 1983, Cleveland & McGill 1984).
- The hospital boss world is a fictional composite (labelled as such); each mechanism in it is documented elsewhere, the hospital is not.
- The anti-guessing check (R35) bounds seven test-wise strategies; a cleverer guesser (for example one that reads distractor diagnoses from other items) is not simulated.
- The OMEGA registry's 520 v1 rows share five identity fields per pass (marked `[pass]`), and their links and merge targets were computed by word overlap (marked `[computed]`).
- The capability periodic table and its seven gap predictions are a design hypothesis, untested.
- Art, music, literature and mathematics seasons do not exist; self-improving pedagogy (the governor) is designed, not built. ARCHITECTURAL RENAISSANCE SINGULARITY is therefore not declared (`docs/RENAISSANCE/omega/00_README.md`).

## v17.4 answer figures and Renaissance v1

- One practice option is still not drawn (EHSAN-PHYS-PHYSIOLOGIC-OPTICS-MCQ-4 c, "protected by bony orbit"); 89 held-out options and 7 held-out keys are not drawn and were deliberately not tailored (firewall).
- Renaissance stores its learner model only on this device (`localStorage["renaissance_v1"]`), not in the cloud save: clearing site data erases it. Intentional for the first release (isolation from medicine).
- Renaissance appears only when medicine returns STOP for the day; on days medicine is never finished, it never appears (intended before the exam).
- Season 1 has six sessions; after them only hooks come back until season 2 is authored. Taste, literature, art and music are not yet in it.
- Six references in season 1 are marked "not re-checked in this build" in the app (Kirby & Herrnstein 1995, Kydland & Prescott 1977, DellaVigna & Malmendier 2006, Diamond & Dybvig 1983, Berkson 1946, MRC 1948).
- The Odyssey scene is a paraphrase: Project Gutenberg is blocked from the build machine and nothing was quoted from memory.
- The live deployment could not be verified from the build session (Vercel connector 403/404).

## v17.3 answer figures and per-option photos

- **Matching is by words, not understanding.** An option is marked where its own words (or its explanation line) name a drawn part, through a hand-written alias list.
  - A wrong match is possible. The engine guards against it in three ways: weak aliases count only when the question already names that diagram, bare words that name many things were removed, and the question's own lesson wins ties. The bank-wide audit showed a few picks that are defensible but not ideal: a thalamus-heavy motor-cortex question opens the diagram of the diencephalon.
- **About 6% of options are not drawn** (346 of 5,815; 17 of 1,410 right answers). They are mostly:
  - statements with no structure in them ("is a sign of a central inhibitory state");
  - rows of the department's matching tables;
  - a few facts no diagram has a place for.
  
  Their legend row shows the option in grey, and the written explanation still covers them.
- **Value answers borrow the stem's picture.** "Exaggerated", "Is absent" or "2–6 weeks" are marked on the structure the stem asks about (the legend says "about …"). The diagram card carries the true value, so the red mark means "this is where the answer lives", not "this structure is wrong".
- **The new diagrams are teaching boards.** Several (UMN vs LMN, cerebellar signs, receptors, trigeminal branches, CNS histology) are labelled cards around a small drawing, not anatomical illustrations. They are schematic, drawn from the notes, and not reviewed by a clinician.
- **Photos are bundled at build time and were not viewed from this sandbox.** The sandbox cannot reach Wikimedia, so the build was tested with the mock picture server.
  - The per-option photo terms come from the same list the build bundles, so no photo needs the network on the iPad.
  - How well each real photo fits was reasoned from its term and caption scoring, not checked by eye.

## v17.2 commute mode and voice (opt-in)

- **The voice is the device's own text-to-speech.** The app can only pick the best voice installed. On an iPad without a downloaded Premium or Enhanced voice, even the best available one (a compact voice) still sounds synthetic. There is no recorded human narration.
- **iPad Safari can pause speech** when the screen locks or Safari goes to the background. The trip then stops early, and only the parts actually spoken are credited.
- **Off means silent everywhere.** While commute mode is off, every read-aloud request in the app is dropped.

## v17 CNS atlas and ADHD game layer

- **The diagrams are schematic teaching drawings**, hand-drawn in SVG from standard anatomy and the notes' wording. Proportions are simplified, and a clinician has not reviewed them. Where textbooks differ (e.g. tract positions in the anterior funiculus), they follow the common teaching layout.
- **Which diagram, in which state, opens after an answer is chosen by keyword rules** on the stem and the key, with the question's note section as the fallback. 559 of 1,011 practice questions get one. A rule can pick a reasonable but not ideal state; the diagram still opens on the right topic.
- **The game layer changes nothing in the course.** It keeps its own XP (`S.game.xp`), adds no questions or minutes, and hides the score during sealed mocks. Its sprint card and move break are offered, never forced. Vibration works on Android only.
- **Skipping is your call, and it has a cost.** A skipped lesson's past papers still come in the daily rounds, but without the lesson's notes first; read it from the map (📖) when you can. Skipping many mocks late in the course can leave some held-out items unused, because the last mock takes at most 60. Jumping ahead marks the days in between as passed, and there is no "go back" for a passed day (its lessons stay readable).
- **The ADHD research is general evidence** (`docs/ADHD_RESEARCH.md`), not a promise for one learner, and the app is not a treatment.

## v16.2 department drawings and the uploaded department files

- **The drawings need the owner's key once.** Until the key link is opened on a device (or the synced state reaches it), the app shows no department drawings and the 50 figure questions do not exist there. On a new device restored with the sync code, the drawings show once the state arrives; the CNS-levels questions appear after the next reload.
- **If the key is lost** (every device cleared and the cloud copy gone), the encrypted drawings cannot be opened. A new key means re-encrypting with `scripts/dept-figs/` (the PDFs at the repo root are the source) and a new link.
- **The GitHub repository is public**, and the uploaded PDFs sit at its root. Only the site copy is protected. Make the repository private to protect the files themselves.
- **The Nov 2024 figure C answers** come from the owner's answered copy (a student's marks), not an official key.
- **CNS-levels answers are the book's.** Structure names in the explanations are ours; figure 7 label 4 is given only as the book states it.
- **The department book's answer row for its 5 CNS problem-solving items does not fit them** (1 of 5 matches). Those items use the standard answer and say so; if the department's exam key followed the misprint, the app would disagree with it there.
- **The CNS/eye/ear formative paper has no key**; its 7 items carry standard answers, each marked as such in its explanation.

## v16.0 MCQ exam system (MCQ focus is the default)

- **Explanations are hand-written and not reviewed by a clinician.** All 921 practice and all 399 usable held-out past papers have one: why the key is right, plus a line for every wrong option. They follow Guyton, Snell, Gray's and Junqueira-level teaching. A wrong reason could still be in there.
- **Doubtful keys: both answers are accepted in the app, but the exam grades by its own key.** 25 keys look wrong (17 practice, 8 held-out) and 37 other options are also defensible (28 + 9). The explanation always says what the bank keys and what standard teaching says. On the real paper, the department's key decides.
- **Held-out explanations were written after the notes were frozen** (commit `a6f2cbf`). The notes were not changed from held-out items. Held-out explanations show only after a mock answer (test M6d).
- **One held-out item cannot be used.** `ANAT-EMBRYOLOGY-DEVELOPMENT-OF-CNS-MCQ-8` has two keys and is not auto-scored, so 399 of 400 are in mocks.
- **Four source items had two options glued together** by the PDF extraction (e.g. "c) Lacerum. d· rotundum."). The v16 view shows them as separate a–d options. The bank file itself is unchanged, so the legacy (focus ALL) views still show three options.
- **The predicted score is only as good as the bank.** It comes from first attempts at never-seen held-out past papers (Wilson 80% interval, n ≥ 20). The real paper will also have questions outside the bank. The notes teach 68.1% of held-out answers at chapter level and 49.7% at section level (measured before the held-out items were read). So new questions may score lower than the prediction.
- **Time per day is a simulation.** A learner who studies every day was simulated to average about 108 min, with a maximum of 141 min. Missed days make catch-up days longer (the block size shrinks, but the backlog is still paced to finish teaching by day 47).
- **Written and practical steps are off until the MCQ exam is over.** They come back by themselves on 16 Nov, the day after the planning anchor (test M11). If the real MCQ date moves, the anchor in the course data must move too, or MCQ focus ends a day after the old date. Nothing in v16 prepares for the written or practical exams.

## 000. v15.3 notes, badges, pictures, pace, offline

- **Coverage is measured by word-matching.** Chapter level: 93.0% practice / 68.1% held-out (counts only). Strict (same section): 82.9% / 49.7%. Paraphrased teaching is not counted; held-out items are never read, so they are not targeted.
- **Written model answers** come from the notes, not from a department marking scheme.
- **"✗ Wrong picture"** swaps to the next free picture found live; with no network, the note says so.
- **Offline** works after one online visit and pre-fetches only the next two days' pictures. The service worker is network-first for the app itself, so a new deploy is picked up on the next online load.
- **Pace** is only an estimate: time with the app open but untouched counts, up to 3× a step's plan.

## 00. v15.2 start-from-today spread

- **Relevance is text similarity plus the department's order**, not a clinician's judgement (`docs/V15_2_RECEIPT.md`). The first week's placements were checked against standard teaching; later weeks were not reviewed by hand.
- **Catch-up days are heavier** (about 170–192 planned min while catching up two days in three).
- **Spreading is the default whenever the real date passes an unfinished day.** "Keep the original order instead" switches back to the v14 carryover; the choice is saved.
- **A rollback to v53** does not know about spreads; lessons moved away from a past day are not shown there until the app returns to v15.2.

## 0. v15 LEARN notes and exact-words pictures

- **Notes are author-written and unreviewed by a clinician.** The 240 sections follow standard teaching (Snell/Guyton/Junqueira level) and were checked against the practice answer keys (90.8% of practice answers are taught). They cover 65.3% of held-out answers by the same lexical rule.
- **About 15 bank keys look wrong or contradict each other.** The notes teach the correct fact and name the key with ⚠; the bank itself is unchanged, so the app still scores those items by the bank's key.
- **Picture choices were made by rules, not by eye.** Since v15.1 the pictures are downloaded into the app at build time on Vercel, so they show on the iPad with no links and no live lookup. The development sandbox's network policy blocks en.wikipedia.org, commons.wikimedia.org and upload.wikimedia.org, so I could not look at the real images. The rules were tested against a local stand-in, and every choice is listed in `/pics/manifest.json` and in the build log. The search-everywhere links were removed at the owner's request, so a poor choice is fixed by changing the term in the notes, not by a link.
- **No offline cache.** Bundled pictures come from the app's own domain. A page never opened before still needs a connection (there is no service worker).
- **Pictures for options exist only for curated terms** (425 terms from the notes). About a third of options have one; the rest use the v14 look-alike logic or say that no trustworthy picture exists.
- **Longer lessons.** Each teach step is now a real lecture (about 3–15 min).

## 1. Deployment and live verification

| Limitation | Consequence | What closes it |
|---|---|---|
| **Live on Vercel, not Hatchable.** v14.3 is deployed to **https://intellectuality-cns.vercel.app** (READY; see `docs/DEPLOYMENT_VERCEL.md`). Hatchable could not be reached from the build session, so the Hatchable site is still v53. | Two sites exist. Progress does not move between them automatically: the Hatchable site uses email login and Postgres, the Vercel site uses sync codes and Blob. | Use the Vercel site. To bring Hatchable progress over, export or copy the saved state from the old site (not automated). |
| **Cloud backup needs one owner action.** The Vercel connector may not create storage (403). | Until a Blob store is connected, progress is saved **on each device only**; the ☁ button says so. Clearing Safari website data, or a new device, starts fresh unless a **backup file** was saved (☁ → sync page → ⬇ Download backup; restore with ⬆). | Connect a private Blob store and redeploy (4 steps in `docs/DEPLOYMENT_VERCEL.md`). |
| **The live site was not opened from the build session.** Its egress policy blocks `*.vercel.app`; the connector's fetch and log tools returned 403/404. | Proof is limited to: the READY build from the tested commit, 60/60 certification plus 14/14 host checks against the identical local build, and the build step's fail-fast checks. No live screenshot, and no production logs read. | Open the URL on the iPad (checklist in the deployment doc); Vercel → project → Logs. |
| **Sync code = the key.** No email or password. | Anyone with the code or link can read and write that progress. If every device loses it (e.g. Safari clears site data) and it was not saved, the cloud copy cannot be found. | Screenshot the code from the sync page. The code is 128-bit random and only its hash is stored. |
| **Professor Vision is off on Vercel.** It needs the Hatchable AI connection. | The Vision drawer reports it as unavailable; nothing else is affected. | Add an AI key and a Vercel `api/vision` implementation if wanted. |
| **No cache-busting on script URLs** (same as v53). | An iPad may keep old JS briefly after a new deploy. | Confirm the tab title reads **v15.0**; reload if not. |

## 2. Visuals

- **Real Commons content is unmeasured.** The sandbox blocks Wikimedia, so certification mocked the Commons API.
  - All 86 curated files are real pages: 48 search-verified this session, 38 used in production v53.
  - All 108 categories are real names: 32 search-verified, 76 used in v53. Seven names that did not resolve were replaced or dropped.
  - What those categories actually return (quality, labels, off-topic uploads) was **not** seen here.
  - Run `await INTELLECTUALITY_V14.audit({n:60})` on the live site and review `rows[].primary` by hand.
- **Relevance is 86% strong, 14% weak by manual review** (0 irrelevant of 115). "Weak" means the right region or family but not the exact point, e.g. habituation → hippocampus, pterion → maxillary artery.
- **4 of 120 items are withheld.** No question-specific concept, or every candidate would have leaked the answer, so no visual is shown.
- **Labeled diagrams can show the answer.** Pre-answer captions hide the file title, and titles containing key words are demoted. But a labeled diagram of the region (e.g. the base-of-brain view) may still print the answer's label on the image itself. This is the trade-off of teaching the picture before the question; held-out mock items get no images at all.
- **Distinct look-alike image for the chosen distractor: 7 of 22 in the benchmark** (v14.3: 2). An image counts only when its title names the chosen side. The new source is an exact-title Commons search (`intitle:"Pia mater"`); the mock echoes titles, so the **live rate and quality are unmeasured**. A real file whose title names two structures (e.g. "Dura and pia") could still be shown for one of them. The other 15 autopsies say "no trustworthy distinct visual exists".
- **30 consecutive items: 0 wrong-domain, 5 weak of 30** (see `docs/V14_4_RECEIPT.md` §3). Physiology is 8 of the 30, because the early course order is anatomy-heavy.
- **Concept routing is pattern-based** (54 hand-written concepts with stem triggers and `not` guards). New or unusual stems can route to a neighbour concept or to none.

## 3. Teaching text and autopsy

- **Leak safety is lexical.** 0/921 texts contain the key phrase or ≥ half of the key-distinctive words unmasked, and 0 Commons queries use them. A reader can still *reason* to the answer from the model paragraph; that is the intent of understanding-first, not a leak.
- **Model-paragraph quality is only partly reviewed.** 114 of 921 model paragraphs still share no significant stem word (v14.3: 229); a bank-wide fallback now adds a relevant paragraph when the lesson's own is weak. The primer picks the best-scoring paragraph from the professor/deep corpus: IDF-weighted and answer-blind. Every item gets one (`noModel = 0`), but relevance was spot-checked on the benchmark items, not all 921.
- **The discriminator library is hand-built**: 72 pairwise contrasts plus 28 families (135 members). About 13.9% of all wrong-option pairs in the bank get a true pairwise discriminator; the rest get a frame (polarity, direction, route…) or the retrieval fallback. The 22-item benchmark scored 22/22 after five fixes, but topics outside the library fall back to:
  1. a corpus sentence about the key;
  2. a structural "words that decide it" line (weakest).
- **Medical correctness of new contrast texts is author-reviewed only.** This covers sternomastoid action, pigment epithelium, basal nuclei parts, DCML vs spinocerebellar, and the refraction near/far point. The texts follow standard anatomy and physiology teaching (Snell/Guyton level) but have had no second clinical reviewer.
- **The Egyptian micro-commands were written in this build**, following `docs/EGYPTIAN_MICRO_COMMANDS.md`. No native-speaker medical educator has reviewed them.
- **Negation handling is keyword-based** (EXCEPT/NOT/false/incorrect). An oddly phrased negative stem could miss the polarity explanation.

## 4. Learning loop

- **Changed retest** picks a similar practice item: concept match, stem Jaccard < 0.7, pinned per retest index. Thin topics may offer only weakly related items.
- **The loop guard parks an error after 3 changed misses.** Its return depends on the existing v12/v13 spaced-repair scheduling, which v14 feeds but does not change.
- **Personalization thresholds** (a modality/command preference needs ≥ 6–8 observations) were tested only with synthetic sessions, not real longitudinal data.
- **The fast lane is stricter.** A concept counts as owned only with ≥ 4 answers, posterior ≥ 0.82, ≥ 3 memory reviews and no high-priority open error. Some genuinely mastered topics will stay on the full primer longer than necessary.

## 5. Platform and device

- **Only Chromium was used** (Playwright device emulation at 390×844, 820×1180, 1024×1366, 1180×820). No WebKit/Safari engine is installed here. The code avoids regex lookbehind and uses only features available on iPadOS ≥ 13.4 (optional chaining, `Intl` time zones, IntersectionObserver), but real Safari performance, memory and touch feel are unmeasured.
- **The date comes from the device clock** (converted to Africa/Cairo). A wrong device clock gives a wrong day; there is no server time source.
- **Cloud state** was exercised against local stand-ins only: the Hatchable `/api/state` emulator, and the real Vercel `api/state.js` handler on an in-memory store. The payload-size bound passed (27 KB total, v14 slice ≈ 1.4 KB). No real Postgres or Blob round trip has run yet: there is no Hatchable access, and no Blob store is connected.
- **Professor Vision** (`/api/vision`) is unchanged from v53 and was not called.
- **`index.html` is 2.9 MB**, with course content inlined as in v53. v14 added only a `<script>` tag, the title, the feed predict-reveal wrapper and the fast-lane guard.

## 5b. Tested only in the sandbox

- The hostile matrix (25 checks: day gaps, clocks, malformed state, rapid taps, offline, huge image, backup) and the performance probe ran in Chromium against local builds. Real iPad Safari memory and touch feel are still unmeasured.

## 6. Research

- Several research sources could not be fetched (egress policy), so their claims rest on search-result evidence. `docs/RESEARCH_RECEIPTS.md` grades every claim STRONG / MODERATE / HEURISTIC / INSPIRATION and ties each capability to that grade.

## Rollback

- **Vercel:** promote a previous deployment, or delete the project (`docs/DEPLOYMENT_VERCEL.md`).
- **Hatchable:** v53 is untouched. The exact v53 files are commit `6e3ebec` (`python3 scripts/verify_exact_source.py`). `tests/rollback_probe.js` shows that v53 loads v14.x state without errors, and that returning to v14.x keeps progress.
