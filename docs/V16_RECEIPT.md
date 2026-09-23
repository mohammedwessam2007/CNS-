# v16.0 Receipt: the MCQ exam system

The owner's instruction (23 Sep 2026): *"Don't stop until it's minimum 9.5/10. Also MCQ only; we don't care about written and practical now."*

Target: the **NEU-205 MCQ exam**, planning anchor **Sun 15 Nov 2026**. The rubric is `docs/V16_MCQ_RUBRIC.md`.

## What a day looks like now

1. **Lesson notes** (v15 LEARN, unchanged).
2. **That lesson's past papers** right after it: up to 8 MCQs, fewer on heavy catch-up days.
   - Answer → instant verdict.
   - Why the key is right, and a reason under **every** wrong option.
   - The notes card, and the pictures for the options you mixed up.
3. **Today's MCQ round** at the end of the day:
   - yesterday's mistakes as **changed questions on the same fact**;
   - new past papers not yet reached;
   - spaced reviews (1-2-4-8-16-32 days).
4. **STOP** with a one-line summary, e.g. "Today: 34 past-paper MCQs · 68% right · 11 mistakes come back tomorrow as changed questions".
5. **Weekends and the last week: a sealed mock.**
   - Held-out past papers you have never seen, from lessons already learned.
   - One minute per question, with a timer.
   - No pictures, hints or explanations until you submit.
   - Then every question is explained, and every miss joins tomorrow's round.

With MCQ focus on (the default), the draw-from-memory step, the v14 primer, the visual and written bosses, and the written, practical and review waves are all skipped.

## What was built

| Piece | File | What it does |
|---|---|---|
| MCQ engine | `mcq-v16.js`, `mcq-v16.css` | Lesson blocks, the daily round, retest law, spaced repetition, sealed mocks, the prediction, MCQ-only routing, and migration of open v14 repairs |
| Practice explanations | `mcq-explain-anat/phys/hist-v16.js` | **921 / 921** practice past papers: the key's reason plus a line for every wrong option |
| Held-out explanations | `mcq-explain-held-v16.js` | **399 / 399** usable held-out past papers. Written **after** the notes were frozen at `a6f2cbf`, so the notes were not changed from held-out items. Shown only after the item is answered in a mock |
| Key audit | inside the explanation files | **25 doubtful keys** (17 practice, 8 held-out) show the standard answer and why. **37 more options** are also defensible (28 + 9). The app accepts both; the explanation says which answer the bank wants |
| Glued options | `mcq-v16.js` `opts()` | The source PDF merged 4 option pairs (e.g. "c) Lacerum. d· rotundum."). The v16 view shows them as separate a–d options. The bank is unchanged |
| Build check | `deploy/vercel/build.mjs` | The build fails if index.html names an app script or stylesheet that is not in the output |

### Doubtful keys (both answers accepted)

| Item | Bank key | Standard answer |
|---|---|---|
| ANAT CSF #5 | a | c: the 4th ventricle opens directly into the subarachnoid space |
| ANAT Muscles of mastication #8 *(held-out)* | d | b: temporalis |
| ANAT Oral cavity #15 *(held-out)* | c | a: left levator palati (left vagus lesion) |
| ANAT Pharynx #6 *(held-out)* | c | a: left levator palati |
| PHYS Synapse mechanism #11 | c | d: a voltage-gated Cl⁻ channel is not a transmitter receptor |
| PHYS Sensory receptors #1 *(held-out)* | a | b: a receptor potential is local, partial depolarization |
| PHYS Sensory receptors #19 *(held-out)* | a | b: specificity (the adequate stimulus) |
| PHYS Synaptic potentials #23 | a | d: none of the above |
| PHYS Spinal reflexes #44 | c | d: hyperactive flexor reflexes in the chronic stage |
| PHYS Spinal reflexes #48 | b | c: flexor withdrawal with crossed extensor |
| PHYS Spinal reflexes #54 | d | c: reflex inhibition of α efferents |
| PHYS Vestibular #18, #19 | a | b: flocculonodular lobe lesion |
| PHYS UMN/LMN #10 | d | a: poliomyelitis causes LMN lesions |
| PHYS UMN/LMN #14 | d | a: distal limb muscles of the opposite side are most affected |
| PHYS UMN/LMN #16 | d | b: UMN hemiplegia does not cause marked wasting |
| PHYS Basal ganglia #7 | a | c: chorea comes with hypotonia |
| PHYS Sleep #5 | b | d: REM has periods of atonia |
| PHYS Memory #13 | c | b: AMPA receptors do not pass Ca²⁺ |
| PHYS Memory #14 *(held-out)* | a | c: LTP comes from high-frequency stimulation |
| PHYS Memory #15 | d | c: AMPA raises Na⁺ permeability |
| PHYS Memory #16 *(held-out)* | a | c: NMDA receptors are Mg²⁺-blocked at rest |
| PHYS Intraocular pressure #5 *(held-out)* | e ("above 10 mmHg") | d: treatable with parasympathomimetics |
| PHYS Refractive media #7 | b | d: corneal touch → both eyes blink |
| PHYS Retina #30 | c (10 min) | d: about 40 min for full dark adaptation |

## Evidence

All runs are against the local copy of `source/public` (`:8787`) unless marked as the Vercel build (`deploy/vercel/dist` served by the real handlers on `:8790`). Logs are in `receipts/v16/`.

| Check | Result |
|---|---|
| **v16 suite** (`tests/v16_test.js`, full course) | **23/23** on the source run; **20/20** quick after M11 was added. **Vercel build: 25/25** in the full course run, M11 included |
| Full course, 23 Sep → 15 Nov, a learner who studies every day (M7) | **921/921** practice past papers answered, the last new one on **day 47**. **399/399** usable held-out used in **14 mocks**. **567/567** mistakes asked again. **108 min/day** on average, **141** at most. Saved progress **867 KB** (cloud cap 1.5 MB). No page errors |
| Prediction at the end of the simulation (M7d) | **64%** (80% interval **61–67%**) from **340** first attempts at unseen held-out items. The simulated learner answers at random rates, so this number only proves the method works |
| Held-out firewall (M6d) | During a 29-item mock, **0** explanation fragments appeared on screen before an answer. After submission, **29/29** items showed their own written reason |
| Explanation coverage (M10) | **921/921** practice + **399/399** held-out. The 4 glued items show as a–d; ordinary items are untouched |
| MCQ focus ends after the exam (M11) | 15 Nov: MCQ. 16 Nov: the full flow, with no setting. An explicit ALL wins |
| Structure audit (M10 in the app, and `receipts/v16/explanation_coverage.json`) | Every explanation has a key line and a reason for each wrong option (**0 gaps**). No stray ids. Held-out explanations live only in the held-out file. No key line merely restates the option (6 found and fixed) |
| Spot review | 14 random held-out anatomy explanations re-read after writing: 14 correct |
| certify · spread · LEARN · v15.3 | **62/62** (and **62/62** on the Vercel build) · **23/23** · **17/17** · **10/10** |
| hostile | **26/26** (B1–B2 need the `:8790` host). B2 was changed to expect today's course day after a restore; see below |
| Vercel host · options gallery | **14/14** · **7/7** (130/160 options pictured in the 40-item sample) |
| Leak audit | 921 texts: **0** text leaks, **0** query leaks, **0** errors |
| Rollback to the exact v53 files (`6e3ebec`, byte-identical tree on `:8788`) | pass: v16 state loads and renders in v53 with no errors, and comes back to v16 intact |
| Build | The new check reports "35 app scripts/styles present"; all four explanation files and `mcq-v16.js` are in `dist` |

**About the B2 change.** B2 restores a Day-1 backup from Mon 21 Sep. Its browser runs on the real clock, which was already 24 Sep in Cairo, so the app moved the restored save to today's course day (day 4). That is the v15.2 date-truth rule. The v15.3 files behave the same way today (checked on `:8788` with commit `978ae07`). The test now expects the later of the file's day and today's day. It still checks that segments, XP, the local backup of the replaced copy, and the return to the course are all correct.

## Rating against the rubric

| # | Criterion | Score | Why |
|---|---|---|---|
| 1 | Every past paper done before the exam | **10** | 921/921 practice by day 47; 399/399 usable held-out by the last sprint day |
| 2 | Every MCQ explained | **9.5** | 1,320/1,320, with a line for every wrong option. Not reviewed by a clinician |
| 3 | Keys audited | **9.5** | Every key checked while writing: 25 doubtful, 37 also-defensible. Judged against textbooks, not the department |
| 4 | Learn before being tested | **10** | Blocks and mocks draw only from lessons already taught (M1, M6) |
| 5 | Mistakes come back until fixed | **10** | Changed question the next day, the exact item 3 days later, then spacing; 567/567 re-asked |
| 6 | Exam-like mocks, honest prediction | **9** | Sealed, timed, stratified, explained afterwards, with an interval. The prediction covers only the bank |
| 7 | MCQ only | **10** | No written, practical, visual-boss or draw-from-memory steps; they return by themselves after 15 Nov |
| 8 | Fits the owner's life | **9.5** | 108 min/day on average, 141 at most. Missed days make catch-up days longer |
| 9 | One button | **10** | Look, answer, Next |
| 10 | Nothing breaks | **9.5** | Every suite passes on both builds. The live site cannot be opened from the build sandbox |

**Overall: 9.7 by the rubric. As an honest single number: 9.5/10.** The 0.5 gap is what no build can close: clinician review, seeing the real pictures, and the real exam.

## What still cannot reach 10

- **No clinician has reviewed** the 1,320 explanations or the notes. They follow standard textbook teaching, and a wrong reason could still be in there.
- **The real exam grades by the department's key.** Where the app accepts both answers, the explanation says which one the bank wants. Learn that one for the paper.
- **The prediction only covers the bank.** The notes teach 68.1% of held-out answers at chapter level and 49.7% at section level, measured before held-out items were read. The real paper will contain questions outside the bank.
- **Pictures cannot be seen from the build sandbox** (Wikimedia and `*.vercel.app` are blocked by its network policy). They are chosen by rule and can be rejected in the app.
- **Real results come after 15 Nov.** They are the only true proof.
