# Known Limitations (v18.14 · MCQ exam + Renaissance + the Great Books Hour)

## v18.14.1 Menu taps press the button you touch, and taps are faster

- The owner (18 Oct 2026): "the menu is clicking on its own". On a phone the menu's pinned footer (Great Books, Professor vision, cloud, Study mode) covered "Resume learning" and "Share my progress", so a tap on one pressed another. The footer now scrolls with the rest of the menu, and on a wide screen the menu leaves room for the game bar. Test: `tests/menu_tap_test.js` (phone, iPad, desktop; it fails on the old layout).
- Lag (owner: "it's very laggy", same day). Measured with the owner's progress at 6× slower CPU (a slow phone): one tap on a lesson button saved the whole progress (738 KB) three times, about 160 ms each, and redrawing worked out "minutes left" by recounting every lesson step for every one of ~1,300 questions and building a new date formatter each time. On top of that the page glided (smooth scroll) to the next section while it was still busy, so a second tap could land on whatever slid under the finger. Now: the saves of one tap become one save, made right after the screen changes (`save-batch-v18.js`; made at once if anything reads the progress, the page is hidden or closed, or the save is not from a tap); "minutes left" counts once per pass and the date formatter is made once (same results, checked on every course day: identical before and after); on a touch screen the page jumps instead of gliding; the cloud adapter reads its one flag from the end of the request instead of re-reading 738 KB. Result at 6× slower CPU: one save per tap instead of three, the longest freeze per tap about 150 ms instead of 300–440 ms, about half the total work per tap. Test: `tests/save_batch_test.js`.
- Checked in an automated Chromium browser, not on the owner's phone.
- The page restarting by itself (owner's screen recording, 18 Oct 2026, 23:45): the ☁ button went SYNCING → RESTORED and the whole page reloaded, then again about 10 s later. Cause: with two copies of the app open (two devices, or a tab and the home-screen app), each cloud write made the other copy load the cloud copy and reload; the reloaded copy saved, which made the first reload. Now the page never reloads by itself while open: a newer cloud copy is held and the ☁ button offers it ("TAP TO LOAD"); cloud writes while studying are at most every 30 minutes (was 2), plus at once when the app is hidden or closed or ☁ is tapped. The owner suggested once a day; 30 minutes plus on close was kept so a lost or broken device costs at most half an hour of progress. Tests: `tests/vercel_host_test.js` H14, H14b, H15 (the old code reloads both copies twice in three rounds).
- Not live yet when this was written: Vercel's free plan refused the deploy of these commits ("Deployment rate limited — retry in 24 hours", 18 Oct 2026 20:31 UTC). The live site stays on v18.14 until a deploy goes through.

## v18.14 The reading follows your exam calendar

- **Tonight's dose comes from the course calendar** (MCQ 15 Nov, written 15 Jan, practical 15 Feb): the full hour when no exam is within 35 days; 30 minutes a night in exam season; 15 in exam week; none the night before an exam or on the day. After midnight in exam season it is 15 minutes, then sleep.
- **Nothing is skipped**: a sitting longer than tonight's dose is split into nightly parts at a paragraph (a chapter break when one is near). "Done for tonight" saves the place in the synced state; the next evening opens at that line with what you read folded away. "Keep reading tonight" opens the rest.
- **Your own speed**: minutes are planned at 190 words a minute and then adjust to your measured reading speed (120–320).
- **Finish date**: the finished-day card and All books show when the whole route will be finished at this pace (with the owner's progress on 18 Oct 2026: 17 February 2027).
- **Less evening work in exam season**: the Renaissance session drops to its 10-minute dose 8–35 days before any exam, so the evening after the CNS work is about 40 minutes instead of 85.
- Rest nights do not break the reading streak.
- The exam dates are the course's planning anchors; if the real dates change, the anchors in the course data need updating too.
- Fixed: the app's side-menu style was also applied to notes inside the reader (bridges, "Use it today"), making them screen-tall.

## v18.13 The whole reading route in new translations, a reading protocol, and a storage guard

- **New translations for the whole essential route** of the Russian novels and Zarathustra, made for this app from the originals (public domain): Notes from Underground (5 sittings), Crime and Punishment (14), The Brothers Karamazov (16), Anna Karenina (11), Thus Spake Zarathustra (6), plus Meditations books I–VI, the Enchiridion, The Dream of a Ridiculous Man, The Overcoat, The Lady with the Dog. About 590,000 words. They follow the originals closely but have not been checked by a professional translator. The old translation stays one tap away.
- Sittings outside the essential route ("Read every chapter") still use the older public-domain translations (Garnett, Common, Long).
- Names in the guides now match the new translations (Zosima, Ilyusha, Krasotkin, Khokhlakova, Zamyotov, Alexei). The quotation registers in the Renaissance seasons keep Garnett's wording and spelling on purpose, because they quote her text.
- **New books**: The Death of Ivan Ilyich and How Much Land Does a Man Need? (both in new translations) and Nietzsche's Genealogy of Morals (public-domain Samuel translation).
- **The protocol around each sitting**: lines you keep come back for spaced recall; "Use it today" is followed up the next day; a weekly review every seventh day; a streak; each book ends with a verdict ("The book, in the end"); the commonplace book gathers everything you wrote. See docs/READING_PROTOCOL_RATING.md (6/10 before, 10/10 after, by its own rubric).
- **Phone storage full** (uni course): if the phone's storage fills, the app first removes spare copies, then trims old logs, and only if that is not enough shows a banner pointing to "Share my progress". Your progress and sync code are never removed. Tested with a filled-up storage stand-in, not on a real full phone.
- **Cloud sync is still off** until the owner connects a Vercel Blob store. docs/CLOUD_SYNC_GPT_PROMPT.md is a step-by-step prompt for an agent with browser access; the owner signs in themselves.
- Not checked on the live site in a browser: this session's network cannot open it.

## v18.12 New translations from the Russian, and "Use it today"

- New, plain modern English translations made directly from the Russian originals (public domain) now replace Constance Garnett's in: Notes from Underground sittings 1 and 2 (all of Part One, plus Part Two chapters I and II), The Grand Inquisitor (Karamazov sitting 12) and The Dream of a Ridiculous Man. Every other sitting still uses Garnett. The old translation is one tap away on each new one.
- These translations were made for this app. They follow the Russian closely, but they have not been checked by a professional translator.
- The Nekrasov epigraph to Part Two is a plain line-by-line rendering; the poem's middle lines are left out, as Dostoevsky also cut it short.
- After each sitting a "Use it today" box gives one small action to try that day.
- No legal route exists to include Camus or recent copyrighted translations (Pevear and Volokhonsky and others); the Camus sitting stays a study guide in our own words.
- Not checked on the live site: this session cannot reach it.

## v18.11 More classics, Camus, and the essential route

- **19 works now**: added Epictetus (Enchiridion), Seneca (On the Shortness of Life), Plato (the Cave, Symposium), Dostoevsky (The Dream of a Ridiculous Man), Gogol (The Overcoat), Chekhov (The Lady with the Dog), Melville (Bartleby), Shakespeare (Hamlet, verse lines kept), Nietzsche (Beyond Good and Evil), and a Camus study.
- **Camus is a study, not his text**: his books are in copyright (in the US and most of the world), so the app carries an original study of The Stranger, The Myth of Sisyphus, The Rebel, The Plague and The Fall (about 25 minutes) with only short quotations. It is not a substitute for reading him; it says so.
- **The essential route (default)**: in the long books you read the chapters that carry the book (Crime and Punishment 14 of 21 sittings, The Brothers Karamazov 16 of 36, Anna Karenina 11 of 37, Zarathustra 6 of 10, Beyond Good and Evil 3 of 7, Meditations 2 of 5, Phaedo 2 of 3) and a written bridge sums up what happens in between. 73 sittings in all instead of 138. The bridges are written from knowledge of the books, not generated from the text; report any slip. Any book can be switched to every chapter in "All books" or from a bridge.
- The order alternates long and short works.

## v18.10 The Great Books Hour

- **One sitting a day of a real book, about an hour**: Notes from Underground, the Apology, Phaedo, the Meditations, Thus Spake Zarathustra, Crime and Punishment, The Brothers Karamazov, Anna Karenina: 118 sittings (about four months). Public-domain translations (Garnett, Jowett, Long, Common) from Project Gutenberg, built by `scripts/library/build_books.py` into `source/public/books/*.json` (6 MB, each book downloaded only when opened, then kept for offline reading).
- Each book opens with a guide written for this app (who is who, what to watch for, questions to carry) and its companion essay. Each sitting resumes where you stopped (on this device), counts reading minutes, and ends with three lines to write (saved in the app state, so they sync).
- It sits in the course on the finished-day screen and behind the side-menu door; it never appears inside a lesson and changes no lesson, answer or review.
- **Not included**: Camus and Kafka are only in the companion essays (Camus is in copyright; the free Kafka translations carry their own copyright). The novels mention doctors where the story has them; the essays do not.
- The storage cleanup now runs only when the device's storage is nearly full (it had also removed the copy kept before a restore).

## v18.9 Renaissance every day, and the Library

- **Renaissance opens every day at any hour**, before or after the CNS work (owner, 12 Oct 2026: "make it everyday, I don't care if it's late"). The 01:00–05:00 and 23:30 shut-offs are gone; exam week, exam weekend and a heavy week now only shorten it to 10 minutes instead of closing it. One session a day is still the limit, and the lesson screen stays medicine-only: before the day's CNS is done the door is in Study mode (Tools); after it, also on the finished-day screen.
- **The Library** (side menu, "📖 TODAY'S READING"): 21 long readings (about 1,000–1,400 words each, 6–8 minutes), each with the literature quoted at length, backstage facts, a close reading, a medical link and three recall questions. One is offered a day; any can be opened from "All readings". Progress is saved in the app state (`rnLib`), so it syncs like the rest.
- **What the readings are not:** they are written for this app from general knowledge, not checked against a library by a human. Disputed points are marked as disputed in the text; English quotations are from public-domain translations where named, and a few short quotations are widely quoted modern renderings (marked as such). Arabic verse comes with a plain working translation written here. Report any error and it is a one-line fix in `source/public/renaissance-library-*.js`.
- **21 readings last three weeks.** More shelves can be added in the same format (see the header of `renaissance-library.js`).
- Not verified: the live site after this push (only the Vercel deployment listing can be read from here).

## v18.8 fixes ("super buggy" round)

- Phone/iPad top bar: the course-map button no longer pushes the course name and the date into a second row that covered the lesson.
- Drawing viewer: full screen with ＋/－ magnify (to 3×), tap to magnify, drag to move, ✕/Esc to close; the page behind no longer scrolls.
- Every one of Dr Sameh Doss's drawings re-boxed by hand (283 pages); notes inside drawings whitened, missed drawings added, split drawings joined; the trim no longer shaves small labels off the edge.
- Drawings are matched to answers by meaning (see docs/SAMEH_DOSS_DRAWINGS.md). Not done by an AI model: a hand-made rule list.
- Not verified: the live site after this push (only the Vercel deployment listing can be read from here).


## v18.7 Dr Sameh Doss's labelled drawings

- **490 drawings were added** (cut from 280 notebook pages of his handwritten notes), each in its lesson section and offered after matching answers. Details, numbers and how to rebuild: `docs/SAMEH_DOSS_DRAWINGS.md`.
- **About 200 of them are lesson-only**: no question in the bank matches their caption. Placement in answers is a word-match score, not understanding; spot checks found no wrong picture, but a second or third picture can be loosely related.
- **The crops are boxes**: a heading or a neighbouring label sometimes comes along, and a few are cut tight. about a dozen doubtful crops were dropped. The notebook paragraphs are not in the app.
- **The site now serves 878 drawings (70 MB)**, each loaded when its section or answer opens and then cached on the device; a drawing works offline only after it has been opened once online.
- **Held-out questions** also get drawings in their explanations; the picker reads the question at display time only. No note or alias is made from a held-out item.

## v18.6 the drawings are unlocked

- **The lock is gone, at the owner's request (27 Sep 2026).** The department drawings and the Kasr Al Ainy book figures are ordinary pictures (`dept/<id>.jpg`), shown on every device with no key or link, and the 50 CNS-levels figure questions are in every device's bank. The site is public, so anyone with its address can see them too. `scripts/dept-figs/publish.mjs` publishes them; `encrypt.mjs` stays as the earlier locked way.

## v18.5 Kasr Al Ainy book figures, and the Renaissance door in Tools

- **Figures 400 to 500 are missing.** Only Parts 01, 02, 03 and 04A of the book's figures were uploaded (figures 1 to 399). Part 04B holds the rest of the physiology chapters, so the retina, colour vision, hearing and sleep sections still have no official drawing. When it arrives it goes through the same pipeline (`docs/KASR_AL_AINY_FIGURES.md`).
- **Captions and placements are judgements.** Each caption is written from the labels on the figure (OCR read the book's own caption lines for figures 1 to 71 only). Each figure sits in the section it teaches best, 442 placements for 340 figures. A misplaced figure is a one-line fix in `scripts/dept-figs/map.json`.
- **59 book figures are left out**: 30 repeat a department drawing already in the app, and the rest add nothing on their own. They are listed with reasons in `docs/KASR_AL_AINY_FIGURES.md`.
- **Web photos are folded, not judged one by one.** In a section with official drawings, the web photo sits behind a tap under them. No web photo was deleted, and the per-option photo gallery after an answer is unchanged.
- **A drawing works offline only after it has been opened once online.** The site now serves 388 encrypted drawings (32 MB). Each loads when its section opens and is then cached on the device.
- **The Renaissance door in Tools** sits in the side rail (☰ on a phone) under ⚙ Study mode, just below Commute mode. It opens only when the door on the STOP MEDICINE screen would. At other times it says why it is shut.

v16.0 is **not** "100% perfect". This file lists what is unproven, what is heuristic, and what could still go wrong. The evidence lives in `docs/V14_CERTIFICATION_RECEIPT.md` and `docs/VISUAL_QBANK_AUDIT.md`.

## v18.4 Renaissance: global depth (Angkor)

- **What "100% controllable completion" means here.** Every requirement in the self-authored graph that can be built and tested now has a code location and a passing test, or its documents. It says nothing about effects on the learner: all twelve empirical items are still open. The architectural declaration (§282) is not made.
- **Every region now has one session set there, and most have only one.** Depth beyond that is the perpetual frontier (`atscale`). V12 and V13 count mentions in teaching text, a proxy for depth rather than a measure of it.
- **The cascade model is illustrative**: ten channels with invented capacities. The study it echoes modelled Angkor's real network.
- **Why Angkor declined is argued**: climate, the network, politics, and trade moving south. The session teaches the first two with the others named.

## v18.3 Renaissance: no token regions (Samarkand, Pacific wayfinding, the Maya)

- **Southeast Asia had no session of its own in v18.3.** `globaldepth` was open then; v18.4 closes it with Angkor.
- **One session per new region.** Central Asia, Oceania and the Americas each gain one session. The floor test (V12) counts mentions in teaching text; that is a proxy for depth, not a measure of it.
- **Both new models are illustrative.** The Samarkand scale model gives the finest angle the marks allow, not the precision actually achieved. The landfall model lets heading errors build up unchecked, which real navigators prevented.
- **The region patterns were widened** (Maya, Mexico and Guatemala for the Americas; Polynesia, Hawaiʻi and Tahiti for Oceania) so that the tests see the new sessions. These are real place names, not new keywords invented to pass.

## v18.2 Renaissance: zero, Timbuktu, and language as a portal

- **One session per new area.** Place value and zero, the Timbuktu manuscripts, and language as a civilisation portal each have a single session. The language session teaches forms of address in Russian and Egyptian Arabic; it is a portal's first door, not a language course.
- **Three regions were thin in v18.2**: Central Asia, Oceania and the Americas. The requirement was opened as `globalfloor` and closed in v18.3.
- **The address model is a simplification.** Real usage varies with region, age, class and tone; the model says so in its reading.
- **Contested points are taught as contested.** The Bakhshali manuscript's dates, the story that the Church feared zero (a myth), the Florentine guild's motive in 1299, the size of the Russian blues effect, and Ahmad Baba's library remark (from later retellings).
- **The Timbuktu survival model assumes copies fail independently**, and says where that fails (a city-wide fire, copies of one faulty original).
- **Deployment is known, not fully verified.** The Vercel connector can now list the project's deployments (state, target, commit) but still cannot read a deployment's detail or fetch its pages. See `docs/DEPLOYMENT_VERCEL.md` for what is confirmed.

## v18.0–v18.1 Renaissance ABSOLUTE COMPLETION (season 3, the engine, the oracle)

- **Nothing is empirically validated.** Every Renaissance test is a machine test of behaviour and content; effects on the learner wait for the dates in `docs/RENAISSANCE/completion/EMPIRICAL_QUEUE.md` (first: 30-day recall from late October 2026; form B at day 30; the 90-day delta).
- **The live site for v18.x is not confirmed from the build session.** The Vercel connector sees the team but not the project (403/404), `*.vercel.app` is blocked from the sandbox, and the GitHub connector has no status tool. Every suite ran against the identical local build. Open the site and check the tab reads **v18.1**.
- **Explanation and writing are not measured.** Every instrument is multiple choice or a tap; free text would need a human or a model grader.
- **The sealed items and the lessons share an author.** Leakage is prevented by mechanism (obfuscation, hashes registered before any answer, a six-word firewall), not by separate people; sealing stops accidental exposure, not a determined reader.
- **Global depth.** Six regions have sessions of their own since v18.2 (four before); four are taught as cases inside other sessions (tracked as the `globaldepth` frontier requirement).
- **Media gaps.** No painting, sculpture, recorded performance, video or 3D: those need licensed, Creative Commons or lawful-embed sources, and those rights classes are empty. Music is synthesised from exact pitches (structure, not timbre or performance).
- **Quotation wording** was checked by exact-phrase web search across several copies of the Garnett text, not against a scan: full texts could not be fetched from the build machine.
- **L12–L13 (runtime generation of curriculum and pedagogy) are blocked** on a model credential and a budget the owner has not granted.
- **The requirement graph is self-authored.** The oracle checks every claim against files, symbols and test results, and rejects fabricated claims (CO5), but the mapping of the 711 mission sections to requirements is a judgement, readable in `tools/renaissance/requirement_map.js`.
- **Trials need data.** L1–L11 and L14 decide nothing until each reaches its minimum sample; until then every learner gets a mix of arms by stable assignment.
- **Language (§34) was open in v18.1.** It had been filed as frontier and was moved back to open, controllable work on review for the completion report, which is why the v18.1 ledger read 173 of 174. v18.2 builds the first language session.

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

## v18.14.2 · Vercel paused, a free copy on GitHub Pages (20 Oct 2026)

- The Vercel project went over the Hobby plan's monthly limit and was paused by Vercel; it comes back when the limit resets. The likely cause is the cloud-save storm fixed in v18.14.1 (not confirmed: the connector cannot read the project).
- A second, free copy builds on every push through `.github/workflows/pages.yml` to `https://mohammedwessam2007.github.io/CNS-/`, once the owner turns Pages on (Settings → Pages → Source: GitHub Actions). It is the same app with the same bundled pictures; root paths are made relative (`IX_HOST=pages` in `deploy/vercel/build.mjs`) because Pages serves under `/cns-/`.
- No cloud save on the Pages copy (there is no server). The cloud button says so. Progress stays on the device; 📤 Share my progress → 💾 Save full progress file is the backup.
- Moving progress: on the paused Vercel copy (opened offline from the iPad's saved copy), save the progress file; on the Pages copy, 📥 Load a progress file. The device's previous progress is kept under `…_backup_before_import`. Tested in `tests/pages_host_test.js` (P1–P4).
