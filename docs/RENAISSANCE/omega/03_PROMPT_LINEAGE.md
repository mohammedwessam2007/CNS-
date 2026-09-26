# OMEGA · 03 · Prompt lineage: v1 (the constitution) → v2 → v3 → final

§127 asks for a better mission, then to use it to produce a better one, until the changes become minor, with the
lineage preserved. Each version below was *used*: run against the actual build as a checklist, and the gaps it
exposed were fixed in code or docs. The lineage records those gaps, so a reader can judge whether a version was better
or merely different.

## Lineage table

| | v1 · OMEGA constitution | v2 | v3 | Final |
|---|---|---|---|---|
| Length | ~4,400 lines, 183 sections | ~70 lines | ~85 lines | ~95 lines |
| Organising idea | feature list + recursion | 14 generators + tests as truth | v2 + measurement for n = 1 + legibility + adversaries | v3 + convergence rule + handover |
| Objective | product of nine terms ÷ minutes | vector at equal minutes | vector + rate of domain entry + life constraints as hard gates | same, with the adversary table required |
| Status discipline | labels at the end (§181) | label on every claim | label + the test that earns it | same |
| What it found in the build | (produced v1 organ + season 1) | unlabelled items weren't in the belief ledger; season 1 had no atoms; merges without targets | figures unreadable on phones; the generator reduction failed its first sample; the registry counted duplicates as distinct | only wording changes → stop |

## Prompt v2

```
RENAISSANCE · MISSION v2

You are extending a working app (INTELLECTUALITY CNS) with a second organ, Renaissance, that opens only after the
day's medicine is done. Read the repository first; never restart; never touch CNS state.

PURPOSE
Change one person's world model and senses against reality, measurably, in minutes he can spare, and then get out
of the way. Not a course, not a tutor, not a library.

GENERATORS (every mechanism must be one of these applied to a situation; say which)
G1 commit before you see · G2 later and unaided is the test · G3 structure over surface · G4 compress to the
load-bearing part, preserve the jewel · G5 name the error, repair its cause · G6 choose what changes the decision ·
G7 every measure has an adversary · G8 life gates the machine · G9 provenance or it didn't happen · G10 representation
is a sense · G11 graduate by dissolving · G12 reality is the score · G13 the machine carries the effort, the human
carries the judgment · G14 fail safe, degrade gracefully.

OBJECTIVE
Report a vector, never a product: delayed far transfer (primary), delayed retrieval, calibration, reality use,
minutes. Claim improvement only when the primary term rises at equal or fewer minutes and nothing else falls beyond
noise.

HARD CONSTRAINTS
Medicine first; sleep; exam weekends; weekly cap; one session a day; no backlog; no notifications; three kill switches;
no answer before commitment; no open prompts; no links out; no points, streaks or badges; every claim sourced and
graded; no words put in real people's mouths.

DELIVERABLES
Running code with tests for every claim you make about it; a registry of candidate mechanisms with identity fields,
dedupe and verdicts; research docs whose numbers are checked by tests.

STATUS
Label every claim: SPECULATIVE / DESIGNED / PROTOTYPED / IMPLEMENTED / TESTED / BENCHMARKED / LONGITUDINALLY
VALIDATED. Nothing is BENCHMARKED or VALIDATED without the learner's data.

KILL
Ideas contradicted by evidence, decoration, thinking tax, fabrication, compulsion, guilt, rights problems, anything
that takes life. Say which rule killed it.
```

**Used against the build → found:** answers to unlabelled boss items were not recorded as beliefs (fixed: engine
records `alien` answers in the ledger); season 1 declared no capability atoms, so five atoms looked untrained when they
were not (fixed: atoms added, R32 now requires them in every season); v1 merges had no target (fixed: targets computed
and marked `[computed]`).

**What v2 missed** (found while using it): it says nothing about *where* the learner reads (the phone), nothing about
how to measure anything with one learner, and it trusts its own generator list without checking it.

## Prompt v3

```
RENAISSANCE · MISSION v3   (v2 plus the changes marked +)

… v2 PURPOSE, GENERATORS, HARD CONSTRAINTS, KILL unchanged …

+ MEDIUM
The learner reads on a phone. Every figure is designed on a 360-unit canvas; no label renders under 10 px on a
360-px screen; nothing is cut off; no two labels collide. A test measures this for every figure and every model state.

+ MEASUREMENT FOR ONE PERSON
There is no control group. Use within-person, counterbalanced, equal-time comparisons with held-out items written
before the comparison; report raw scores with n; never a p-value. Separate performance (in session) from learning
(delayed, unaided). Record a baseline before any season.

+ ADVERSARIES
For every metric, write the behaviour that would score high while being bad, and the guard against it, before the
metric is used. For every red team (fake genius, beautiful-explanation trap, AI dependence, echo chamber, over- and
under-compression, content colonisation, novelty addiction, polymath theatre, false interdisciplinarity, ideological
capture, canon bias, current-AI bias, benchmark gaming, founder flattery) name the test that would catch it and its
status.

+ SELF-CHECK
Check your own reductions on random samples before claiming them. Counts quoted in docs are tested against the data.
Duplicates renamed are not new: dedupe by name and similarity, and report distinct counts.

+ OBJECTIVE, EXTENDED
Add the rate at which new domains are entered (minutes to first unaided far transfer in a new domain) and, after two
seasons, its slope. Life constraints are gates, not weights.
```

**Used against the build → found:** every wide figure was unreadable on a phone (labels 6–7 px): 21 figures and
models redrawn, 4 side-panel figures enlarged, and R34 now measures all 74 figure states; the generator reduction failed its first random sample (16/20): G12–G14 added and the
sample recorded; the registry reported 1,040 candidates but only 902 were distinct: six new donor passes added until
the distinct count passed 1,000 (1,003 of 1,160), and a test now fails if a doc quotes a count the data doesn't have.

**What v3 missed**: when to stop evolving the mission, and how the next person (or session) continues without
re-deriving everything.

## Final evolved mission

```
RENAISSANCE · MISSION (final of this lineage)

CONTEXT
A working app (INTELLECTUALITY CNS) protects a medical student's exam preparation. Renaissance is a second organ that
opens only when the day's medicine is done. Read the repository and its docs/RENAISSANCE before changing anything;
never restart; never write CNS state.

PURPOSE
Change one person's world model and senses against reality, measurably, in minutes he can spare; then dissolve.

GENERATORS
G1–G14 as in v2/v3. Every new mechanism names its generator and its donor; a mechanism that needs a fifteenth
generator must show two registry candidates that fit nothing else.

OBJECTIVE (a vector, judged at equal or fewer minutes)
primary: delayed, unaided far transfer · also: delayed retrieval, calibration (Brier), reality use, minutes, rate of
entry into new domains (and its slope after two seasons). Life constraints are gates. Each metric ships with its
adversary and guard.

HARD CONSTRAINTS
v2 list + the phone medium rule of v3.

MEASUREMENT
v3 rules for n = 1. Baseline first. Held-out items written before comparisons. Performance and learning reported
separately. No claim above the evidence's status label.

DELIVERABLES, EACH WITH A TEST
code (engine, seasons) · registry (identity fields, dedupe, verdicts, generations) · research docs whose numbers are
tested · receipts from full regression on the source and deployed builds.

CONVERGENCE
Evolve this mission only when using it against the build finds a gap that changes code or a test. When a new version
changes only wording, stop and say so.

HANDOVER
Leave the state a successor needs: what is built (with tests), what is designed (with the first test to write), what
is blocked (with the reason), and the next three actions in order.
```

**Used against the build → found:** nothing that changes code or a test; it changed only wording of v3 (merging
sections, adding HANDOVER). By its own convergence rule, the lineage stops here. HANDOVER is satisfied by
`00_README.md` (status per deliverable, next actions).

## What changed across the lineage, in one line each

- v1 → v2: from a feature list to generators, from a product objective to a vector, from labels-at-the-end to labels
  on every claim.
- v2 → v3: from trusting itself to checking itself (random samples, tested counts), from "simple UI" to a measured
  phone rule, from red-team names to red-team tests.
- v3 → final: a stop rule for its own evolution, and a handover.
