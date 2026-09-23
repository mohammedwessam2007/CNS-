# v14.4 Receipt: visual frontier, hostile certification, backup file

Built on v14.3 (commit `76df7d0`, production `dpl_Bvyhw27szDFZ545YV1uQ9pJ2s7ev`). Every number below comes from a test in `tests/`; the raw output is in `receipts/v14_4/`.

## 1. What changed

| Area | Change | Why (evidence) |
|---|---|---|
| Wrong-answer autopsy | **28 contrast families (135 members)** added to the registry, including meningeal spaces, cord end, cerebellar peduncles and divisions, brainstem levels, internal capsule, fibre systems, cerebral and vertebrobasilar arteries, dural sinuses, EOM actions, mastication, petrosal nerves, parasympathetic ganglia, larynx muscles and nerves, sinus drainage, pharyngeal arches and pouches, fibre types, movement disorders, EEG waves, receptor adaptation, brainstem nuclei, cervical dermatomes, vestibular receptors, pain chemistry and synaptic modifiers. When the key and the chosen option each name exactly one member, the autopsy shows the pair side by side and gives each member's decisive line. | Across all 2,799 (practice MCQ, wrong option) pairs in the bank, a true pairwise discriminator rose from **149 (5.3%) to 390 (13.9%)**. Contrasting cases and comparisons triggered by errors improve discrimination (research §A). |
| Precision guards | Stem-member rule (the key must be the member the stem names), `stemFrame`, `exclude` (a "cleft" is not a "pouch"), a subject limit on brainstem levels, and `novis` families (pain chemistry, synaptic modifiers, EEG: honest text, no picture) | A 60-row manual review found false family matches; each was fixed and re-reviewed. |
| Distractor picture | Last-resort Commons search for files whose **title carries the exact structure name** (`intitle:"…"`). Only still images (JPEG, PNG, SVG, WebP) are accepted, pathology titles are refused, and the exclusion set is honoured. | Benchmark: chosen-distractor pictures went from **2/22 to 7/22**; the other 15 keep the honest "no trustworthy distinct visual" note. |
| Option pictures | Option matching now uses the family members, and a short option phrase is used as the exact-title term. | 40-item sample: 121/160 options pictured, 0 repeats within an item (mocked Commons; see §4). |
| Primer relevance | When the lesson's best model paragraph shares fewer than *n* significant stem words, an IDF-ranked paragraph from the **whole bank** is added. Paragraphs that would leak the key are filtered out. | Model paragraphs sharing zero stem words: **229 → 114 of 921**. Leak audit stays **0/921**. |
| Visual routing | Wrong-domain fixes from the 30-question audit: "orbital surface of the hemisphere" no longer routes to the orbit; peripheral unmyelinated fibres go to the nerve picture, not CNS oligodendrocytes. Weak matches improved: spinal meninges, and the interpeduncular fossa (no visual → brainstem). | 30 consecutive items: **0 wrong-domain** (before: 2). |
| Egyptian commands | Gate: `أنا شايفها → هات السؤال`. Predict: `توقّع قبل الاختيارات`. Compare: `حطّهم جنب بعض`. Recall: `رجّعها من دماغك · من غير اختيارات`. Guess note: `ما تحفظش الاختيار`. | Constitution §14: commands are placed at the moment they apply. |
| State safety | v14 state sanitizer: a slice that is not an object, or has wrongly typed fields, is repaired field by field, and migration is type-safe. | The hostile test found a real crash: a string `S.v14` threw in `migrate`. Fixed; see Y2. |
| Backup file | Sync page: **⬇ Download backup** exports one dated JSON with every `intellectuality_*` key. **⬆ Restore** validates the file and keeps the current copy as a local backup first. | This is real, user-owned backup while no cloud store is connected. Cloud state is not faked. |
| Tooling | `audit({ids})` for consecutive-order audits. New tests: `hostile_test.js`, `visual_audit30.js`, `shots_perf.js`, `frontier_metrics.js`. Test output paths are now script-relative. | |

## 2. Test matrix (all against the v14.4 source)

| Suite | Result | Receipt |
|---|---|---|
| Certification (date, primer, leak, correct/wrong, autopsy, retest, loop guard, mock firewall, diversity, responsive, migration, network) | **60/60** local · **60/60** Vercel build | `certify_checks.txt`, `certify_checks_vercel_build.txt` |
| Hostile matrix (5-day gap, 4 days ahead, New York device clock, overnight resume, 6 malformed/old states, 12 rapid taps, double NEXT, Commons hang 9 s, offline answer, 6000×6000 image at 390/820 px, stop-study view, held-out never primed, backup download/restore/refuse) | **25/25** | `hostile_test.json` |
| Vercel host adapter (sync code, batching, conflicts, guards) | **14/14** | `vercel_host_test.json` |
| Option gallery | **7/7** | `options_gallery.json` |
| Pre-answer leak audit (text + queries) | **0/921** text leaks, 0 query leaks | `leak_audit.json` |
| Rollback to v53 and back | pass | `rollback_probe.json` |
| Autopsy benchmark (22 archetypes: histology look-alike, tract crossing, lesion side, mechanism, polarity…) | 22/22 discriminators; **7/22** distinct distractor pictures | `autopsy_bench.json` |

## 3. 30 consecutive practice MCQs (constitution §26)

The first 30 practice items in the order the course serves them (16 anatomy, 8 physiology, 6 histology), through the real planner and anti-repeat governor (`visual_audit30.json`).

| Metric | Value |
|---|---|
| Unique primary visuals | **30/30** |
| Exact repeats / adjacent repeats | **0 / 0** |
| Curated atlas files / category search / generic keyword fallback | 10 / 20 / 0 |
| Source-bank figures | 0 (none of these 30 items has one) |
| No trustworthy visual | 0 |
| Irrelevant (wrong domain), by human review | **0** (2 before the routing fixes) |
| Weak (right region, not the exact point) | 5: C-8 → DRG diagram; filum terminale → cord cross-section; presynaptic inhibition → summation graph; cingulate sulcus → lobes specimen; orbital surface → lobes diagram |
| Broken images | Not measurable here (Commons is mocked) |

Physiology has 8 items, not 10, because the course order is anatomy-heavy early on. The systematic 60-item sample (`certify` K2) covers the balanced mix.

## 4. Before / after

| Metric | v14.3 | v14.4 |
|---|---|---|
| Bank-wide pairwise discriminators | 149/2799 (5.3%) | **390/2799 (13.9%)** |
| Primer paragraphs with zero stem overlap | 229/921 | **114/921** |
| Distinct chosen-distractor picture (benchmark) | 2/22 | **7/22** (mocked titles) |
| Options pictured, 40-item sample | 36/160 (strict manual count) | 121/160 (mocked; titles echo the query, so this is an upper bound, not a like-for-like number) |
| Wrong-domain visuals in 30 consecutive | 2 | **0** |
| Cold load, iPad 820×1180 (FCP / load) | 176 / 345 ms | 152 / 332 ms |
| Reveal options / wrong answer → autopsy | 2.7 / 8.9 ms | 2.5 / 10.9 ms |
| 30-question driven session: step p50 / p95 | 6 / 20 ms | 7 / 18 ms |
| Heap growth over the 30 questions / listener growth | +1.7 MB / +1 | +2.7 MB / +3 |
| Commons calls in the session (post-answer distractor/option search) | 87 | 123 (max 2 in flight) |
| 20 duplicate `render()` calls: node / listener growth | 0 / 0 | 0 / 0 |
| Horizontal overflow at 390, 820, 1024 and 1180 px / buttons < 44 px | 0 / 0 | 0 / 0 |

Screenshots (home, primer, options, autopsy × 4 viewports) are in `receipts/v14_4/screens/`. Images there are labelled placeholders, because the sandbox cannot reach Commons.

## 5. Rejected this round

| Candidate | Why rejected |
|---|---|
| AI-generated anatomy images | Constitution §29 (no AI slop); correctness is unverifiable. |
| Scraping YouTube frames for distractor pictures | Copyright. Official embeds and links only. |
| Professor Vision on Vercel | Needs an AI key and a cost/privacy decision; core learning does not depend on it. It stays an honest 503. |
| Pictures for pain-chemistry, synaptic-modifier and EEG pairs | There is no trustworthy structural image; the text discriminator is better than a misleading picture. |
| Server time source | Would make scheduling depend on the network. Cairo conversion of the device clock passes the NY, UTC, midnight and gap tests. |
| Free-keyword search for distractors | Title-exact search is more precise. Precision beats coverage (mission §autopsy). |
