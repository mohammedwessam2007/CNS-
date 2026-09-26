# OMEGA · 05 · Capability genome, periodic table, cognitive chemistry, and the engines

Deliverables 10–29 and 32. Every engine carries one status from §181: **SPECULATIVE** · **DESIGNED** · **PROTOTYPED**
· **IMPLEMENTED** · **TESTED** · **BENCHMARKED** · **LONGITUDINALLY VALIDATED**. Nothing here is BENCHMARKED or
LONGITUDINALLY VALIDATED: that needs the learner's months.

## 1. Human capability genome (§18) · TESTED

The genome is a property of the **training record, not of the person**: 28 capability atoms (`ATOMS` in
`renaissance-v1.js`) tag every step; every session of every season must declare its atoms (R32). WHY THIS? shows what
the current step trains. An atom is "expressed" when its delayed, unaided items are answered correctly across ≥ 2
domains.

Steps per atom today (season 1 / season 2):

| Atom | S1 | S2 | | Atom | S1 | S2 |
|---|---|---|---|---|---|---|
| causal reasoning | 18 | 2 | | question selection | 0 | 14 |
| strategic reasoning | 18 | 0 | | judgment | 0 | 10 |
| measurement design | 17 | 1 | | finding the minimum sufficient model | 0 | 10 |
| systems thinking | 16 | 4 | | orienting in an unknown domain | 0 | 9 |
| constraint reasoning | 10 | 5 | | scaling and growth | 0 | 8 |
| modelling your future self | 10 | 0 | | aesthetic discrimination | 0 | 8 |
| falsification | 9 | 7 | | compression | 0 | 7 |
| experimental design | 9 | 2 | | analogy that keeps mechanism | 0 | 6 |
| information reasoning | 9 | 5 | | synthesis | 0 | 5 |
| probabilistic thinking | 8 | 3 | | **mechanistic decomposition** | 0 | 0 |
| counterfactual simulation | 8 | 4 | | **model selection** | 0 | 0 |
| calibration | 8 | 0 | | **abstraction** | 0 | 0 |
| prediction | 8 | 6 | | **narrative reasoning** | 0 | 0 |
| representation switching | 8 | 4 | | **creative recombination** | 0 | 0 |

**Untrained: 5 of 28** (bold). They define season 3 (§8 below). Counting steps is not counting capability: an atom
with many steps and poor delayed accuracy is weaker than one with few steps that transfer.

## 2. Capability periodic table (§19) · DESIGNED (a hypothesis to test)

Columns = what the atom acts on. Rows = what it does. Blank cells are **predictions** of atoms not yet named.

| | Causes | Uncertainty | Representation | Inquiry | Value | Making |
|---|---|---|---|---|---|---|
| **1 · Perceive** | systems | information | scaling | orienting | aesthetic discrimination | analogy |
| **2 · Model** | causal · mechanistic decomposition | probabilistic | representation switching · abstraction | question selection | future-self modelling | narrative |
| **3 · Decide / compress** | constraint · minimum model | prediction | compression · model selection | measurement design | judgment | synthesis |
| **4 · Test** | counterfactual simulation | calibration | *(gap P1: detecting a misleading representation)* | falsification · experimental design | *(gap P2: testing a value — what would change what I care about)* | creative recombination |
| **5 · Meta** | *(gap P3: auditing one's own causal assumptions)* | *(gap P4: noticing one's confidence drifting)* | *(gap P5: inventing a representation)* | *(gap P6: questions about which questions to ask)* | strategic reasoning | *(gap P7: inventing a method)* |

How the table is tested: if it is right, items written for a gap cell (P1–P7) should correlate more with items in the
same row and column than with the rest. With one learner this needs many items; until then it is a design tool for
choosing what to write next, not a finding.

## 3. Cognitive chemistry (§20) and dark matter (§21) · DESIGNED

- **Compound** = atoms that must fire together: *diagnosis* = base rate (prob) + causal + question; *reading a
  dashboard* = measurement + systems + filter (information). Boss worlds are compound items.
- **Bond test** = an item that needs two atoms; failing it while passing each atom alone is a *bond failure*, and
  it is repaired by a contrast that shows both at once.
- **Catalyst** = a representation that raises accuracy across several atoms (counts-first images are the current
  candidate: they help base rates, selection and screening items).
- **Inhibitor** = a misconception that lowers several atoms at once (the "surface" bug is the current candidate: it
  appears in every season).
- **Dark matter** = logged successes and failures the atom model does not predict. The twin (§11) flags items whose
  outcome disagrees with its forecast; a cluster of such items that fits no atom proposes a new one, which must then
  predict new items before it is added.

## 4. New-sense generator (§22) · IMPLEMENTED for six senses

A "sense" is a representation change that makes a pattern visible at a glance. Built so far, each with a model and
delayed hooks: **base-rate sense** (counts of 1,000 · session 3), **filter sense** (what didn't come back · session 2),
**loop sense** (stock, flow, delay · session 4), **constraint sense** (the slowest box · session 7), **log-scale
sense** (doubling as a straight line · session 10), **clutter sense** (blind pairs · session 11). Designed next:
incentive sense (what a rule rewards), order-of-magnitude sense, uncertainty sense.

## 5. The engines

| Deliverable | Engine | What it does | Status | Where |
|---|---|---|---|---|
| 12 | Representation evolution | several representations per idea; SHOW ME DIFFERENTLY swaps them; the log records which preceded the next success (the first picture included); x-ray "picture" routes to another one; a **chooser** shows first the kind that preceded right answers clearly more often for him (n ≥ 6, +15 points), keeping the usual order one day in five as a control | **TESTED** | engine `reps`, `chooseRep`, R4, R36 |
| 13 | Experience compiler | turns a day's gate, dose, due hooks and next session into one plan: warm-ups → steps → close; short doses budgeted and continued next day | **TESTED** | `plan()`, R14–R18, R27 |
| 14 | Civilization compiler | mechanism extraction from fields into sessions with sources; recompile on source change | **PROTOTYPED** by hand (12 sessions, 72 registry passes); automatic recompile DESIGNED | seasons, registry |
| 15 | Personal intellectual digital twin | state = answers with confidence, bug classes, x-ray causes, representation log, hooks, beliefs, minutes; states seen → understood → used → assimilated | **IMPLEMENTED** (state); forecasting DESIGNED | `renaissance_v1` storage |
| 16 | Personal pedagogy genome | success rate per representation kind, with n, pooled across primitives; it drives the chooser | **TESTED** | reps log, R36 |
| 16b | Governor, level 2 | the chooser is judged against its own control arm; after 20 choices it must do better or it switches itself off and WHY THIS? says so | **TESTED** | `judgeGovernor`, R37 |
| 17 | World-model architecture | primitives × verified cases; beliefs linked to what replaced them | **IMPLEMENTED** (ledger) / DESIGNED (graph) | belief ledger |
| 18 | Unknown-unknown engine | unlabelled items; missing-variable items; alien month | **TESTED** (unlabelled boss) / PROTOCOL (alien month) | session 12, R31 |
| 19 | Curiosity / serendipity engine | door questions that pass the question-value test; frontier questions in GO DEEPER; no feeds | **IMPLEMENTED** (doors, depth); serendipity pairs DESIGNED | sessions |
| 20 | Taste engine | blind pairs, then a testable criterion; edit toggles; chart pairs from the same numbers | **TESTED** | session 11, R29–R30 |
| 21 | Creation / invention engine | graded-part forges with a pre-mortem critique; recombination rounds designed | **TESTED** (forge) / DESIGNED (recombination) | every session |
| 22 | Reality bridge | a forge applied once in the week; one reality tap next day; the season-2 forges target his study and company | **TESTED** | R14 |
| 23 | Memory / assimilation engine | hooks at 1/7/30 days inside later sessions, ×2.5 after a sure success, reset after a miss; at most two a day; distinct sessions | **TESTED** | R10, R14, R18 |
| 24 | Idea immune system | provenance grades on every claim; myths graded C; post-hoc and hype items; inoculation cases DESIGNED | **TESTED** (provenance) | R20 |
| 25 | Belief version control | committed predictions and unlabelled answers kept with what replaced them; shown in WHY THIS? | **TESTED** | R29 |
| 26 | Question singularity engine | decisive-question items; value-of-information model; question choices scored over months | **TESTED** (items) / DESIGNED (trend) | session 8 |
| 27 | Anti-specialization engine | seasons rotate fields by mechanism; hooks mix sessions; specialisation alarm DESIGNED | **IMPLEMENTED** | plan, R14 |
| 28 | Human possibility engine | verified primitive–domain pairs P(t); possibility audit yearly | **PROTOCOL** | `../05_BENCHMARKS.md` §5 |
| 29 | Time / stop engine | gate after medicine; sleep; exam weekend and week; weekly shrink and shut; one session a day; no backlog; kill switches | **TESTED** | R1, R11, R16–R19 |
| 32 | Copyright / provenance architecture | original writing only; two registered short quotations; public-domain primary numbers with sources; no fetched media; every claim with a source id and grade | **TESTED** | R20 |

## 6. Representation singularity and new media (§23–§25) · partly IMPLEMENTED

Media in use: explorable models with numeric read-outs (12), toggle boards (mechanisms, hypotheses, edits),
natural-frequency icon arrays, primary-data charts, blind side-by-side panels, knowledge-fenced scenes. All are
phone-first (R34). Designed: sort-to-understand (drag cases into mechanism bins), build-the-model (assemble a model
from parts), and the new-medium probe (for each primitive, ask which interaction would show it best and build the one
that doesn't exist).

## 7. Prerequisite annihilation, wormholes, zip bombs (§26–§30) · IMPLEMENTED in the design of seasons

- **One missing step**: THIS DIDN'T CLICK → step shows the single missing step (R5).
- **Wormholes**: every contrast pairs a known field with a new one (a shower and a central bank; Vienna and London).
- **Zip bombs**: season 1's generators (selection, loops, proxies) unpack inside season 2's boss world without being
  re-taught.
- **Difficulty arbitrage**: seasons ordered by value per minute and prerequisite depth (counting and filters first).

## 8. Season 3 target from the genome (DESIGNED)

The five untrained atoms and the periodic gaps suggest season 3, *Building models*: **mechanistic decomposition**
(open a black box: how a thermostat, a vaccine or a price works, part by part), **model selection** (two models fit
the data; which predicts better out of sample?), **abstraction** (strip a case to the variables that matter),
**narrative reasoning** (when a story is evidence and when it is a trap), **creative recombination** (combine two
primitives into a device), and a **misleading-representation** session (P1: the chart that lies, truncated axes, area
for length). Each must pass the same schema, provenance, counterfeit (R35) and legibility (R34) tests before release.
