# v3 · 04 · Measurement: the vector, the sealed battery, transformation metrics, the hostile matrix, the long run

§38–52, §120–121, §141–155, §166–168, §193–194, §233–234, §261–265, §285. Instruments live in
`source/public/renaissance-v1.js`; sealed items in `renaissance-sealed.js` (pre-registered in
`docs/RENAISSANCE/sealed/`); the queue of future tests in `../completion/EMPIRICAL_QUEUE.md`. Protocols for comparing
Renaissance with other ways of learning remain in `../05_BENCHMARKS.md`.

## 1. What is measured, and what is refused (§38, §166, §285)

No IQ claim, no composite "genius score", no guarantee of any outcome. The **functional-capability vector** keeps its
dimensions separate (prediction before explanation, near transfer, far transfer, delayed unaided recall, orientation
in unknown fields, calibration, real-world use), each with its n; a rate below five answers is not shown (L1).

## 2. The genius-delta battery (§44, §120)

Compared only with his own baseline. Built from sealed items (52, pre-registered 2026-09-26, S1):

| Instrument | When | Items | Feedback |
|---|---|---|---|
| Form A (baseline) | day 0, again at day 90 | 8 | none until the comparison |
| Form B (parallel) | day 30 | 8 | none |
| Weekly unknown problem | days 7–84, one a week | 24 (2 per week) | explains itself after he commits (used once) |
| Reader-Turing questions | 30 days after the last Karamazov session | 12 | none |

At most two a day, never on a short-dose day, skipped (never owed) if the window passes by more than two weeks (P3).

| §44 dimension | Instrument here | Status |
|---|---|---|
| cold learning, alien domain entry | weekly unknown problems (orientation dimension) | built (P3–P4) |
| compression | three-box items; the minimum sufficient model | built |
| question selection | decisive-question items; value-of-information model | built |
| synthesis | unlabelled boss worlds | built (R31) |
| prediction | committed predictions before every explanation; calibration | built (R6, F1) |
| cultural possession | the ladder and the sealed reader questions | built (L4, P5) |
| taste | blind comparisons before names | built (R29) |
| conversation | the discussion item; the real-talk tap after the salon | built (V9, F3) |
| creation | forges and whether they met reality | built (R10, F1) |
| **explanation, writing** | none: free text cannot be graded here without a human or a model grader | **not measured**; a human reader is in the empirical queue |

## 3. Transformation metrics (§45–46)

**Velocity** = the weekly slope of delayed, unaided accuracy (returning ideas and unknown problems), reported with its
weeks and n, only once three weeks each have five answers. **Acceleration** = the change in that slope, only once six
such weeks exist (L2). Neither is a claim about biology; both are about this record.

## 4. Counterfeit learners and benchmark gaming (§147–153, §151)

Every multiple-choice item must defeat test-wise strategies. Thirteen counterfeit learners (longest, shortest, most
words, punctuation, hedges, jargon, no absolutes, overlap with the question, odd length, most typical option, positive
words, first shown, last shown) each stay within 0.12 of chance, per season and on the sealed items (R35, S3). The
longest-answer fix of season 1 (0.90 → chance) is preserved and re-checked every run. For every metric, the cheat and
the guard are listed in `../omega/04_OBJECTIVE_AND_METRICS.md` §2; the coverage oracle itself is attacked by seven
fabricated claims every run (CO5).

## 5. The hostile test matrix (§155)

| Threat | Defence | Test |
|---|---|---|
| Hallucination | quotations registered with how they were checked; plot claims with provenance | V1, M1, R20 |
| Source failure | graded sources; re-verification by half-life | R20, CO10 |
| Rights failure | every media object in a §134 rights class | M1 |
| Overcompression | minimum sufficient model tested by switching parts off; "where it breaks" | R31, V10 |
| Undercompression | the compile map's four dispositions; sessions ≤ 30 min (deep ≤ 45) | R21, C3 |
| Shallow possession | a rung only with evidence and the rungs below; the top rung sealed | L4, P5 |
| AI dependence | returning questions and probes with every helper off | R14, P1 |
| Echo chamber | rival models kept; hostile criticism shown; the compiler rotates fields | V10, C1 |
| Ideological capture | two readings of the Inquisitor; religion without preaching or mockery | V10, V6 |
| Western-canon bias | ten regions in teaching text; sessions set outside Europe | V3 (depth open) |
| Novelty addiction | no streaks, rewards or leaderboards; the stop rule | R22, R11 |
| Boredom | THIS DIDN'T CLICK, I ALREADY GET THIS | R5, R8 |
| Cognitive overload | the dose, the vocabulary firewall, one idea per step | R16, R20 |
| Life colonisation | sleep hours, exam weeks, a weekly cap and a weekly stop | R16, R17 |
| Metric gaming | thirteen counterfeit learners; the oracle attacked | R35, S3, CO5 |
| Fake personalisation | every adaptation a trial with a control arm and a judge | E1, R37 |
| Bad learner model | no composite; rates withheld below n; laws need eight per kind | L1, L6, G2 |
| Benchmark leakage | sealed, hashed, firewalled items; ids and outcomes only in the record | S1, S2, P2 |
| Stale science | half-life classes and re-verification dates for every claim | CO10 |
| False analogy | analogies paired with where they break | V10 |
| Wrong scale | the log-scale session; the scale atom | R23 |
| Over- and under-confidence | confidence committed with every answer; Brier on answers and on real forecasts | R6, R7, F1 |
| Self-improvement regression | no-harm floor; the judge judged; rollback with caution | E1, E4 |
| Malformed session | the arc and the session object checked for every session | R21, C5 |
| Mobile failure | every season-3 session run on a 390-px phone; label legibility | V4, R34 |
| Accessibility failure | contrast, native controls, a labelled dialog, keyboard | A1, R24 |
| Rollback failure | kill switches; corrupt records kept aside | E3, D3, R19 |

The CNS side has its own 26 hostile checks (`tests/hostile_test.js`).

## 6. Neuromyths and brain-hack nonsense (§47–48)

Plasticity does not end at 25, and the design does not rest on supplements, "IQ boosters", generic brain training,
unsafe stimulation or sleep loss. Young adulthood is used as a time for rich, varied, high-quality experience; sleep
is protected by the gate. A content scan fails the build on any such claim (CO7).

## 7. The long run: Day 1 to mature life (§51–52, §167–168)

A simulation, not a forecast. Each horizon says what should change and what would show the design failed.

| Horizon | The human | The system | The curriculum | What would show failure |
|---|---|---|---|---|
| Day 1 | the baseline form, the first session | defaults; nothing adapted | the bootloader | the door competes with medicine |
| Week 1 | the first returning ideas; the first unknown problem | trials start logging | bootloader | he skips the door for a week without choosing to |
| Month 1 | form B; bootloader done | first trial samples; compiler takes over | compiled season 3 | form B no better than form A on matched items |
| Month 3 | form A again (the 90-day delta); the reader questions | first trial verdicts | organs rotate by his gaps | no delta, or the unknown-problem slope is flat |
| Month 6 | possession of a first handful of works; real conversations reported | the compiler's weights tuned by L11 | new seasons chosen by the oracle's gaps | possession stays at rung 3–5 |
| Year 1 | fluent across the bootloader; a few works possessed | laws about him with enough evidence | breadth per organ | laws never reach a candidate; he uses nothing outside |
| Year 2 | creation starts to rival consumption (forges become projects) | generated arms judged (if L12–L13 are unblocked) | fewer lessons, more problems | forges stay exercises |
| Year 5 | synthesis across fields in his own work (medicine, writing, building) | the system mostly schedules problems and sources | his own questions set the curriculum | he still needs the app to think |
| Year 10 | exceeds his teachers in some field | an exocortex he directs | frontier reading, open problems | nothing he made exists outside him |
| Year 20 | contributions others use: methods, results, works | a tool, not a teacher | self-written | no civilisational delta at all |
| Mature life | teaches and builds; returns time to life | invisible | — | intellectual life has replaced life |

**Lifetime phases (§168):** absorb and bootload → synthesise and create → frontier research, invention and
contribution. **Civilisational delta (§51):** what valuable intellectual structure (a theory, invention, method,
work of art, book, institution, company, result, concept, discipline) exists because he existed. It is not measurable
by the app; it is the reason the app should eventually matter less.
