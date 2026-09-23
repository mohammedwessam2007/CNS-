# v15.0 Receipt: LEARN FIRST (lecture replacement) + exact-words pictures

Two problems raised by the owner:

1. **"How will I answer the question bank when I don't attend lectures?"** Measured before v15, the lesson "teach" step covered only **288 of 915 practice answers (31%)** and **107 of 398 held-out answers (27%)**. The median lesson was 423 words.
2. **"Not general pictures — a picture specific to the words exactly."** Pictures were chosen by topic ("spinal cord"), not by the exact structure named in an option, an answer or an explanation.

## What v15 does

| Piece | What it does |
|---|---|
| **LEARN notes** (`learn-notes-anat/phys/hist-v15.js`) | Lecture-replacement notes for **all 68 question-bank chapters**: **240 sections, about 33,500 words, 425 exact picture terms, and 240 recall questions without options.** Each chapter opens with "the whole picture". Each section has a heading, the facts (department depth), **why it works**, the **Kasr trap**, and one question to answer from memory. |
| **LEARN page** (`learn-v15.js`) | The lesson's teach step becomes a paged lecture: exact-term pictures, the facts, why, trap, a contextual Egyptian command, then recall. Recalls marked "not yet" return once on a **FINAL RECALL** page before practice. One primary button per page (`فهمتها → اللي بعدها`), plus back. The position is saved. |
| **Teach before test** | A practice question is served only after the lesson whose note teaches it has been learned, whenever other questions are available. Example: T001 holds back the 10 of 18 spinal-cord questions whose note is in T002 until T002 has been learned. Held-out pools are never touched. |
| **Exact-words pictures** | A picture is chosen for an **exact term**: the note's Wikipedia article title, or a curated term whose words appear **in order** in the option or answer text. Path: that article's own images, ranked by caption match → only files that exist on **Wikimedia Commons** (free licence, shown with author) → otherwise Commons files titled with the term → otherwise an honest note. Every picture carries **search-everywhere links** (Google Images, Radiopaedia, Kenhub) for the same words. |
| **Option gallery and autopsy** | Each option, the correct answer and the chosen distractor first try the exact-words picture; then the v14 look-alike logic; then the honest "no trustworthy picture" note. Terms that the question stem already names (the topic) are not used; neither are bare short words inside long statements. |
| **After the answer** | A "📖 FROM YOUR NOTES" card opens the note section that teaches the question, with its picture, under the "why" (correct answer) or the autopsy (wrong answer). Practice items only. |
| **Doubtful bank keys** | The notes teach the physiologically correct fact and flag, with ⚠, about 15 bank items whose keys conflict with each other or with standard teaching (e.g. EPSP via voltage-gated Na⁺, chorea from the substantia nigra, LMN lesion "with clonus", the corneal reflex centre in the superior colliculus, dark adaptation time). The bank key itself is never changed. |

## Evidence (`receipts/v15/`)

| Check | Result |
|---|---|
| Practice answers taught in the notes before the question (≥ 75% of the answer's distinctive words present in the chapter notes) | **831/915 (90.8%)**, before 288/915 (31%) |
| Held-out answers covered (counts only; held-out items were not read while writing) | **260/398 (65.3%)**, before 107/398 (27%) |
| LEARN behaviour suite (`tests/learn_test.js`) | **15/15**: lecture page, exact-term pictures with licence, no Wikipedia request on the home screen, paging and reload, FINAL RECALL, teach before test, nothing from v15 before the answer, note card after a wrong answer, option-term precision, Wikipedia down → honest note, 390 px layout, held-out untouched |
| Certification | **60/60** local · **60/60** Vercel build |
| Hostile matrix | **25/25** |
| Vercel host adapter | **14/14** |
| Pre-answer leak audit | **0/921** |
| Rollback to exact v53 and back | pass |
| 30 consecutive questions (primer visuals) | 30/30 unique, 0 repeats |
| Chosen-distractor pictures that name the chosen structure (22-item benchmark, mocked images) | **11/22** (v14.4: 7/22; v14.3: 2/22). The other 11 give an honest note |
| Options with a curated exact term (sample of 747 real options) | 249 (33%). The rest use the v14 logic or an honest note |
| Cold load, iPad size (local, uncompressed) | FCP 200 ms (v14.4: 152 ms). The notes are 348 KB raw / 103 KB gzip, loaded with `defer` |
| Overflow and tap targets at 390/820/1024/1180 px | 0 / 0 |

Screenshots, including the lecture page at every size (`*_2a_learn.png`), are in `receipts/v15/screens/`.

## Not proven here

- **Live picture quality.** The sandbox cannot reach Wikipedia or Commons, so every picture test used mocks. The rules (exact term, free Commons file, honest fallback) are tested; which image the live article actually shows is not.
- **Medical review.** The notes were written from standard textbook knowledge at the department's depth and checked against the practice keys. No clinician has reviewed them.
- **Timing.** The lecture adds real minutes to each lesson (about 3–15 min per teach step). That is the intended trade: learn first, then test.
