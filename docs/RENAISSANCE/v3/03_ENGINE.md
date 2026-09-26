# v3 · 03 · The engine: bootloader, compiler, session object, self-adjustment L1–L14, learner model, engines

§35–37, §56–63, §69–76, §93–105, §119, §123–126, §160–165, §243–249. All code is in `source/public/renaissance-v1.js`
unless named; every row below names the test that checks it (`tests/renaissance_v3_test.js` unless prefixed R, which
is `tests/renaissance_test.js`).

## 1. The bootloader and the compiler (§35, §160, §171)

Seasons 1–2 are the **cognitive bootloader** (21 primitives: causality, feedback, selection, incentives, uncertainty,
probability, information, constraints, compression and the rest; V3) and run in written order. After them the
**session compiler** (`choose()`, `rank()`) scores every available session:

| Weight | Default | What it rewards |
|---|---|---|
| gap | 3 | capability atoms not yet shown on later, unaided questions |
| errors | 1.5 | atoms behind the misconceptions he keeps making |
| culture | 2 | works he does not yet possess (rung < 9) |
| rotate | 2 | moving away from the last two fields (anti-specialisation) |
| unknown | 1.5 | every fourth compiled pick goes to the least-visited field |
| leverage | 1 | sessions later ones depend on |
| curious | 0.5 | fields where he pressed GO DEEPER |

A started session always continues first (C4). Deep sessions (the trial, boss worlds) are compiled only on Friday
or Saturday with a 45-minute dose and only if the week has room (C3, §119). WHY THIS? prints the reasons and the
runners-up (C1). Sessions are optional internal structure, not semesters (§171).

## 2. The session object (§161)

`RENAISSANCE.sessionObject(id)` compiles every session to: target capabilities, source objects with rights,
irreducible experiences, compressed context, vocabulary bridges, tasks, misconception branches, transfer, forge,
hooks, minutes and the stop condition (C5).

## 3. Self-adjustment, level by level (§70–73)

Every level is a **trial**: a control arm (the authored lesson), a test arm, a minimum sample, a success margin
(+0.15), a no-harm floor (0.40), rollback, and a kill switch (`localStorage renaissance_experiments = "off"`, E3).
The judge adopts a clearly better arm, drops one that is not better, stops one that falls below the floor (E1);
an adopted arm keeps one unit in five on the control and is rolled back if it later loses, after which the trial
needs 1.5× the sample (E4). Nothing is decided before the minimum sample on both arms.

| Level | What varies | Unit | Arms | Outcome judged | Test |
|---|---|---|---|---|---|
| L1 | representation order | step | authored first / his best kind first | right answer after the picture | R36, R37 |
| L2 | step order | session | model then cases / cases then model | transfer in that session | E1, E2 |
| L3 | step length | session | optional depth kept / skipped | transfer | E1 |
| L4 | session length | session | one sitting / split over two days | transfer | E1, E6 |
| L5 | difficulty | item | second view on request / offered | the prediction | E1 |
| L6 | retrieval interval | hook | ×2.5 / ×2 | the next recall | E1, E4 |
| L7 | task type | hook review | options shown / recalled first, options hidden | the next recall of that idea | E1, E6 |
| L8 | source mix | session | passage alone / passage with its context and meaning | transfer | E1, E6 |
| L9 | session architecture | session day | review before / after the new session | that day's recall | E1, E6 |
| L10 | season order | day | written order / compiler | transfer | C2, E1 |
| L11 | capability priority | day | gaps first / rotation first | transfer | E1, E6 |
| L12 | curriculum generation strategy | — | — | — | **blocked**: see below |
| L13 | pedagogy generation strategy | — | — | — | **blocked**: see below |
| L14 | meta-pedagogy: the judge judged | trial | a decision / its later audit | rollback, caution ×1.5 | E4 |

**L12 and L13 are blocked by a real external constraint.** Generating new curriculum or new ways to teach *at
runtime* needs a content-generating model in the loop, which needs an API credential and a budget the owner has not
granted, and a review step so that generated culture meets §136. Preparatory work is complete: any generated session
would have to pass the same schema and quality gates as authored ones (R20–R22, C5, V9–V11, M1, S2–S3), and would
enter as an arm of the existing trial machinery, judged by the same judge and switched off by the same switch. At
author time the same levels run as documented tournaments (`../09_SEASON_3.md`).

**No self-granted authority (§248–249).** Every adaptive change chooses among arms a person wrote; none adds content,
calls the network (test CO6), or changes what is measured. The learner can switch off the organ, the trials and the
sealed probes separately.

## 4. The learner model

| Part | Function | What it refuses to do | Test |
|---|---|---|---|
| Functional-capability vector (§38) | `vector()` | a composite score; rates below five answers | L1 |
| Transformation velocity and acceleration (§45–46) | `velocity()` | a slope before three weeks of five answers; acceleration before six | L2 |
| Multiplex (§36–37) | `multiplex()` | count an atom from a tag; only later, unaided successes count | L3 |
| Possession ladder (§162) | `possession()` | a rung without the rungs below it | L4 |
| Digital twin (§163) | `twin()` | hide what went backwards | L5 |
| Personal intellectual physics (§74–75) | `laws()` | a rule with fewer than eight observations per kind | L6 |
| Perception (museum, concert) | `perception()` | rates below five answers | L7 |
| World-model map (§98–99) | `worldModel()` | hide an empty layer | L8 |
| Capability genome (§60–62) | `genome()` | evidence from tags; cost is computed from the steps | G1, G2 |
| Reality calibration (§97) | `calibration()` | a Brier score before five checked forecasts | F1 |
| Cognitive X-ray (§76) | `XRAY_OF`, receipts | a generic "try again" | R5 |
| Belief version control (§95) | `st.beliefs` | overwrite what was held | R29 |

## 5. The engines

| Engine | How it works here | Test |
|---|---|---|
| Memory without bureaucracy (§100–103) | ideas return inside later sessions at growing gaps; after three sure recalls, an idea whose next gap would pass half a year retires as assimilated | R14, D4 |
| Scaffold decay, anti-dependence (§104–105) | returning questions and sealed probes run with every helper off | R8, P1 |
| Idea immune system (§93) | every session meets a counterexample, a stated limit or an open question | V10 |
| Contradiction reactor (§96) | open questions stay open on the page ("Open question" cards) | V10 |
| World model and anti-monoculture (§98–99) | 16 layers mapped; evolution and intelligence are named gaps; seven sessions keep rival models | L8, V10 |
| Unknown-unknown and serendipity (§57–58) | the compiler's unfamiliar pick; unlabelled boss worlds; the weekly sealed unknown problem | C1, R31, P3 |
| Creation and invention (§54, M1 §71–73) | a forge in every session: slots, a critique, a design that meets reality the next day | R10, F1 |
| Reality bridge (§106–107) | the next warm-up asks whether the design was used; after conversation sessions, whether it came up in real talk (§232) | R14, F3 |
| Reality calibration (§97) | an optional forecast of trying it before the next session, scored when he reports | F1 |
| Autophagy (§243–244) | assimilated drills retire; superseded designs are named in the ledger | D4 |
| Failure recovery (§247) | an unreadable record is kept aside, a clean one starts, WHY THIS? says so | D3 |
| Device independence (§112) | one-file export and import; every step speakable for earbuds or a screen reader | D1, D2 |

## 6. The capability genome and the periodic table (§59–63)

`renaissance-genome.js` gives each of the 28 atoms its components, prerequisites, synergies, conflicts, transfer
fields, real-world expressions and descendants; `genome()` adds evidence (unaided later answers, withheld below five)
and learning cost (minutes of steps that train it). The periodic table crosses what an atom does (perceive, model,
decide, test, meta) with what it acts on (causes, uncertainty, representation, inquiry, value, making); its seven
empty cells are predicted atoms, each named (for example P1, detecting a misleading representation). Eight compounds
(diagnosis, a fair verdict, probabilistic empathy, aesthetic systems reasoning, counterfactual engineering,
mathematical taste, strategic anthropology, invention) are the capabilities that exist only when atoms fire together;
a compound counts as shown only when each of its atoms is (G1).
