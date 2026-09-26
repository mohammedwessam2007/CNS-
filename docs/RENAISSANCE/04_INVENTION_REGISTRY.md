# Renaissance · 04 · Invention registry (generations 1–5, category search, meta-singularity test)

Honesty first (§135–137, §223). Almost everything below has ancestors. A mechanism is marked:

- **KNOWN** — exists in research or products under another name (the ancestor is named).
- **KNOWN COMBINATION** — each part exists; this exact combination was not found in this session's searches.
- **UNCLEAR** — no close analogue found in this session; that is weak evidence of novelty, not proof.

Status: **BUILT** (in `renaissance-v1.js` / `renaissance-s1.js`, tested) · **DESIGN** (specified, not built) ·
**EXPERIMENT** (needs the learner's data to decide) · **KILLED** (with the reason).

Nothing here is evidence that the learner improved. That needs his delayed scores (see `05_BENCHMARKS.md`).

## Generation 1 · 520 candidates from 40 passes

Full list: `registry/gen1.txt` (one line each: pass, candidate, mechanism, nearest prior art, verdict).
Totals: **407 kept for crossbreeding, 35 merged into stronger ones, 78 rejected** — 20 as gamification or
decoration, 14 contradicted by evidence (e.g. brain training, growth-mindset messaging as a lever, microlearning
drips, "20-minute attention cycles", passive exposure), 9 as open-ended thinking tax, 8 too costly, 8 out of scope,
7 rights problems, 4 fabrication risks (simulated interviews with historical figures, fictionalised facts, great-man
stories, undo-able predictions), 4 untestable, 2 manufactured compulsion (cliffhangers, reward-prediction hooks),
1 guilt mechanic (loss-aversion streaks), 1 renamed existing idea (weakness-driven graph walk = adaptive learning).

"Kept" does not mean novel: most kept candidates are KNOWN ideas worth combining.

## Generation 2 · 100 crossbreeds (the strongest 25 shown with detail)

Format: **name** — parents · mechanism · closest analogue · novelty · status.

### Built in v1

1. **Committed-prediction reveal** — predict-before-tell × confidence × hypercorrection · every idea opens with a
   prediction the learner commits with SURE / THINK SO / GUESSING; a wrong SURE gets the repair representation ·
   POE, certainty-based marking · KNOWN COMBINATION · BUILT
2. **Pre-diagnosed branches** — error-as-address × bug libraries × refutation text · every wrong option carries a
   named misconception class, a one-paragraph refutation and the right answer · ITS bug libraries, refutation texts ·
   KNOWN · BUILT (tested: R20)
3. **Mechanism across continents** — case contrast × cross-cultural cases × schema induction · every primitive is
   taught through two cases from different places and eras (Hanoi 1902 / England 2000s; Vienna 1846 / London 1948)
   · Gick & Holyoak; Alfieri et al. · KNOWN COMBINATION · BUILT
4. **Hooks carried by later sessions** — mnemonic medium × interleaving × half-life schedule · 1-, 7-, 30-day items
   open later sessions, never from the same session twice, gap ×2.5 on success, reset on failure · Quantum Country;
   Duolingo HLR · KNOWN COMBINATION · BUILT
5. **Unaided warm-up** — delayed proof × scaffold decay × anti-dependence · warm-ups show no pictures and switch off
   SHOW ME DIFFERENTLY / DIDN'T CLICK / I ALREADY GET THIS · Bastani et al. 2025 (dependence) · KNOWN COMBINATION ·
   BUILT (R14)
6. **Cause-specific repair (x-ray)** — cognitive x-ray × vocabulary layers × prerequisite discovery · "what is in the
   way?" → word (three-layer vocabulary) / picture (switch representation) / step (the missing bridge) / why care
   (stakes) · ITS help-seeking, but with the learner naming the cause · UNCLEAR as a four-way learner-declared
   repair router · BUILT (R5)
7. **Dissolving session** — expertise reversal × challenge skip · one hard question from further ahead; right and
   not guessed → jump to where the idea is used · placement tests; mastery skip · KNOWN · BUILT (R8)
8. **Self-shrinking dose** — homeostatic budget × calendar feedforward × circadian gate × anti-windup · 25 → 10
   minutes in exam week, late evening or heavy weeks; shut on exam weekend, 01:00–05:00 and above 300 min/week;
   a short day continues the session instead of cramming it · no close analogue found for an organ that shrinks
   itself on life signals · UNCLEAR · BUILT (R16–R17, R27)
9. **Donor-organ gate** — priority scheduler × process isolation · opens only when the medical engine returns STOP;
   separate storage and DOM; three kill switches · feature flags · KNOWN COMBINATION · BUILT (R1, R12, R19)
10. **No-composite scorecard** — proper scoring rule × anti-Goodhart × lexicographic reporting · separate counts
    with n; Brier for confidence; no headline number, and a session that teaches why · KNOWN · BUILT
11. **Reality tap** — incentive-compatible self-report × life-as-lab forge · next session asks once: used it / not
    yet / not useful; only "used" counts as a reality score; "not yet" is never asked again · habit trackers ·
    KNOWN COMBINATION · BUILT
12. **Forge with pre-mortem** — forge × pre-mortem × implementation intentions · assemble a device from graded parts,
    then pick the fix for the first failure · Klein's pre-mortem; Gollwitzer · KNOWN COMBINATION · BUILT
13. **Myth check as a twist** — narrative × provenance grading · a famous story (Cortés's burning ships, the cobra
    effect, the bomber picture) is kept, graded and corrected in place · fact-checking · KNOWN · BUILT
14. **Stable shuffle** — anti-gaming × item design · right answers never sit in a predictable place; stable across
    redraws · standard test practice · KNOWN · BUILT (R25)

### Designed (next seasons)

15. **Crossbred boss problems** — two primitives in one real case (metric gaming as a reinforcing loop) · DESIGN
16. **Representation tournament** — per concept, the representation shown when understanding was next demonstrated
    gains weight; losers mutate (new analogy, new data) · bandit experiments in ed-tech · KNOWN · DESIGN (the log
    exists; the selection rule needs ≥20 observations per primitive)
17. **Distractor evolution** — wrong options bred from the learner's own recurring bugs · UNCLEAR · DESIGN
18. **Primitive × domain gap search** — fill empty cells of the matrix with new cases · DESIGN
19. **Paired-comparison taste trials** — interleaved exemplars, expert-consensus keys, calibrated ratings · KNOWN
    (perceptual learning) · DESIGN (the main gap against §173 K)
20. **Discovery reenactment library** — more real datasets (Snow's Broad Street pump, Lind's scurvy trial) · DESIGN
21. **Guarded model tutor** — a language model allowed only hints written as representations, never answers, with
    unaided checks after · Kestin et al. 2025 design principles · KNOWN · DESIGN (not in a static offline app yet)
22. **Belief version control** — the learner's committed predictions become dated beliefs; a later correct transfer
    marks the belief updated · UNCLEAR as a learner-facing ledger · DESIGN
23. **Life-event trigger** — a calendar event (negotiation, hiring) pulls the relevant primitive forward · DESIGN
24. **Medicine bridge** — base rates inside CNS cases, loops inside endocrine lessons; only where it helps both ·
    DESIGN
25. **Season compiler** — a spec (primitive, operation, cases, bugs, hooks, provenance) compiled into a session and
    linted by the same tests · DESIGN (schema and linter BUILT)

Items 26–100 (compact): alter-one-thing composition trials · proof skeleton reveal · Fermi warm-ups · anomaly of the
week · hidden-assumption finder · steelman-then-predict · argument maps from primary texts · reference-class opener ·
pre-registered self-experiments · counterfactual history forks · what-happened-next prediction from archives ·
time-scale ladder · scale-switch tasks (neuron → institution) · invariant spotting · dimensional-analysis checks ·
simulation-first probability · visual proofs · explanation compression trials (pick the best one-liner) · teach-back
seeds for conversations · drawing the loop on paper · observation quests · emic/etic switch · institution-as-solution
cases (Ostrom) · gift-economy incentives · error bounty on content · appeal button for wrong keys · sunset clauses for
features · metric audits of the app · human-vs-machine division tasks · option-value allocation of seasons ·
sunk-cost exits · signalling vs capability checks (anti-pretension) · calibration curve on request · predict your own
score · confidence-gap alerts · explanatory-depth probes · strategy choice tasks · scaffold-removal notices ·
avoidance detector · question vault · serendipity pairs · adjacent-possible map · frontier cards · random primitive
draws · field-that-explains tasks · expert-disagreement finder · cross-season surprises · learner-authored sessions ·
learner-built models · community sessions with a friend · citizen-science participation · creation-as-curriculum
projects · mentor matching · exocortex notes · apprenticeship tasks in UberBond · self-directed seasons · reality
replaces lesson (graduation) · co-op models · New Game+ unaided replays · hidden-information puzzles · emergent-play
models · perceptual category drills · cue discovery · tacit contrasts · fluency rounds after mastery · Egyptian
examples first · oral-memory techniques · pattern-language primitives · load paths as causal chains · collapse
cases · induced-demand loops · building codes and Goodhart · consonance physics model · motif tracking · tension
curves · form as argument · predict the next note · music institutions as incentive design · art as evidence ·
looking protocols · copy then vary · public-domain art library with provenance.

## Generation 3 · 32 primitives that generate families of mechanisms

1. **Commit before you see** (prediction precedes information) 2. **Name the bug** (errors are typed) 3. **Two
surfaces, one structure** (comparison induces schema) 4. **Later is the test** (delay separates memory from
familiarity) 5. **Remove the help** (capability without scaffolds is the real score) 6. **Price the confidence**
(proper scoring) 7. **Count, don't percent** (representations that keep the base rate) 8. **Ask what filtered this**
(selection before inference) 9. **Find the loop and its delay** 10. **Separate the number from the thing** 11. **Pick
the observation that splits hypotheses** 12. **Bind the future self** 13. **Stop at the margin** (value per minute)
14. **Life gates the machine** (the organ yields to sleep, medicine, exams) 15. **Isolate the organ** (no shared
mutable state with medicine) 16. **Grade the story** (provenance A/B/C on every claim) 17. **Preserve the jewel**
(primary data or scene uncompressed) 18. **Zoom on demand** (depth optional, core compressed) 19. **Cause-specific
repair** 20. **Skip by proof** 21. **Interleave the returns** 22. **Reality counts** (use outside the app is the
score that matters) 23. **No headline number** 24. **Shuffle what can be exploited** 25. **Continue, never catch up**
26. **Myth as a lesson** 27. **Forge then pre-mortem** 28. **Stakes before content** 29. **Label after concept**
30. **Distance-tagged transfer** 31. **Evidence has an n** (no inference from tiny samples) 32. **Every component
earns its place** (no agent cosplay).

## Generation 4 · 11 systems that invent better ways to build capability

1. **Misconception miner**: clusters wrong answers across sessions into new bug classes → new distractors and
   refutations.
2. **Representation evolver**: tournament + mutation over representations per primitive, fitness = next delayed
   success.
3. **Case finder**: searches the primitive × domain matrix for empty cells and proposes verified cases (with
   provenance) to fill them.
4. **Session linter / compiler**: turns a primitive spec into a session and refuses to ship one that fails the
   integrity tests (exists as tests; compiler is DESIGN).
5. **Hook-gap tuner**: fits per-primitive forgetting (half-life) from the learner's own hook results.
6. **Dose tuner**: estimates the marginal value of minute 20 vs minute 30 from delayed results and shrinks the dose
   where it buys nothing.
7. **Simulated-learner harness**: scripted learners (always right, always wrong on predictions, guessing, gaming by
   position) run every season before release — partly BUILT (the test suite plays several of these).
8. **Transfer-distance generator**: produces near/far/alien variants of a case with labelled distance.
9. **Provenance checker**: flags any claim without a source id, any quotation without a registered short quotation.
   BUILT as tests.
10. **Pedagogy A/B governor**: allows only one pedagogy change per week and evaluates it after its delay (control
    theory's lesson applied to teaching).
11. **Registry of mechanisms** (this file): every idea with ancestry and a verdict, so nothing useful is amputated.

## Generation 5 · what comes after education (7 candidate ontologies)

1. **Capability ecology** — not a course but an environment in which primitives compete, combine and die according
   to real use. (Ancestors: ecological psychology, constructionism.)
2. **Personal science** — the learner runs registered experiments on his own life; lessons exist to improve the
   experiments. (Ancestor: quantified self, but with falsification and pre-registration.)
3. **Apprenticeship to reality** — founder work, medicine and training become the curriculum; the system only
   compiles the lessons reality already taught. (Ancestor: cognitive apprenticeship.)
4. **Authorship** — the end state is the learner writing sessions for others; teaching is the test of capability.
5. **Exocortex partnership** — explicit division of cognition: what the human must own (judgment, taste, causal
   models) vs what is safely offloaded (retrieval, arithmetic), with unaided checks to keep the human part real.
6. **Question-driven life** — a vault of good questions replaces the syllabus; sessions are answers to his own
   questions, compiled when asked.
7. **Graduation by dissolution** — success is the organ becoming unnecessary: habits of mind that run without the
   app. The stop rule, generalised.

## Category-new search (§188): 25 candidates without an obvious analogue, then the analogue hunt

| # | Candidate | Analogue found after searching | Verdict |
|---|---|---|---|
| 1 | Organ that shrinks itself on life signals | wellbeing features in apps (screen-time limits) | partial analogue; **kept** (built) |
| 2 | Learner-declared repair router (x-ray) | ITS help requests; "hint levels" | analogue is hint levels, not cause routing; **kept** (built) |
| 3 | Reality tap with no second ask | habit trackers | analogue exists; **kept** as a small part |
| 4 | Myth provenance grades inside lessons | fact-checking sites | analogue exists outside teaching; **kept** |
| 5 | Continue-not-catch-up short dose | Duolingo "streak freeze" is the opposite | **kept** |
| 6 | Donor-organ architecture (medicine feeds the new organ, never the reverse) | micro-frontends | technical analogue; **kept** |
| 7 | No-composite scorecard taught as a lesson | Goodhart teaching exists | **kept** |
| 8 | Distractors bred from the learner's own bugs | adaptive distractor generation research exists | **KNOWN**; kept as design |
| 9 | Belief ledger from committed predictions | prediction journals (forecasting) | **KNOWN COMBINATION** |
| 10 | Pedagogy change governor (one change per week, judged after its delay) | experimental design | **KNOWN** principle, unusual placement |
| 11 | Stakes-before-content per session | "why this matters" sections | **KNOWN** |
| 12 | Representation fitness = delayed success | bandit ed-tech experiments | **KNOWN** |
| 13 | Unaided warm-up as anti-dependence | Bastani et al.'s "remove the AI" test | **KNOWN** as a research design |
| 14 | Kill switch taught to the learner as sovereignty | — | **kept** (UNCLEAR) |
| 15 | Life-minutes accounting in receipts | time tracking | **KNOWN** |
| 16 | Forge with graded parts + pre-mortem | design kits; pre-mortems | **KNOWN COMBINATION** |
| 17 | Interleaved hooks never from the same session | interleaving research | **KNOWN** |
| 18 | Stable per-item shuffle | test design | **KNOWN** — killed as a "new mechanism", kept as hygiene |
| 19 | Season compiler with a linter that rejects open prompts | curriculum authoring tools | **KNOWN COMBINATION** |
| 20 | P(t) as verified primitive–domain pairs | skill graphs | **KNOWN COMBINATION** |
| 21 | Exam-calendar feedforward for a non-exam organ | — | **kept** (UNCLEAR) |
| 22 | "Did the idea meet reality?" as the top metric | outcome-based evaluation | **KNOWN** |
| 23 | Cause-typed confusion log (word/picture/step/care) | learning analytics | **KNOWN COMBINATION** |
| 24 | Hypothesis-tester models on primary data | inquiry learning tools | **KNOWN** |
| 25 | Graduation by dissolution | "fade the scaffold" | **KNOWN** in spirit |

Survivors that still look unusual after the hunt: 1, 2, 5, 6, 14, 21 — all about **how a learning organ lives inside
a life**, not about how it teaches. That is the honest location of whatever novelty this design has.

## Meta-singularity test (§134): what would make Renaissance obsolete?

1. **A learner who no longer needs sessions** because the habits run unaided → build graduation (Gen 5 #7): track
   unaided far-transfer; when a primitive is steady for 90 days, retire it and tell him.
2. **A world that teaches by itself** (his founder work, medicine, training) → Gen 5 #3: compile lessons from
   real events he logs, not from authored seasons.
3. **Other people** (friends, mentors, co-founders) → Gen 5 #4: sessions he authors for others as the final test.
4. The successor now looks like **a life with good questions and honest feedback loops**, which is no longer
   primarily education. By §134's rule, the search stops here.

## Final meta-question (§221): if this worked for ten years, what would still limit him?

1. **Time**: 150 h/year is small. Answer: the reality bridge (use in medicine, founder work) multiplies the hours
   that teach, without adding app time.
2. **Taste and craft** (literature, art, music) are not in v1: a real limitation.
3. **Other minds**: a solo system cannot supply disagreement from a real person. Answer: co-op and authorship.
4. **Truth supply**: a static app can only carry what was verified when it shipped. Answer: provenance with dates
   and a recompile rule (§106) when a source changes.
