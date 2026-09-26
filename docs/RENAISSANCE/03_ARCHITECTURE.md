# Renaissance · 03 · Architecture (D–T) and the v1 build

This is the architecture the mission asked for (§201 D–T, §203 layers) written against what is actually built in
`source/public/renaissance-v1.js` + `renaissance-s1.js`. Where a layer is design only, it says so. Nothing here is
evidence that the learner got smarter; that needs months of his own data (§175).

## D. Learner objective function

Not a single number. Four families of evidence, kept separate so one cannot hide another:

| Family | Measured in v1 by | Horizon |
|---|---|---|
| **Understanding** (can predict what the mechanism does) | committed predictions inside sessions, before and after the reveal | minutes |
| **Transfer** (can use it where it was not taught) | near and far transfer items; later "alien" items from other sessions | minutes → weeks |
| **Durability** (still there later) | retrieval hooks that reappear 1, 7 and 30 days later, unaided | days → months |
| **Judgment** (knows what he knows) | a confidence tap on every committed answer → Brier score and a 3-bin calibration table | all |

Plus one cost: **life-minutes**, counted from the clock, never estimated.

**Renaissance Yield (defensible version).** The mission's product of seven noisy metrics would let one lucky number
dominate. v1 reports instead a **lexicographic scorecard per 100 life-minutes**: (1) delayed transfer accuracy,
(2) delayed retrieval accuracy, (3) calibration (Brier, lower is better), (4) immediate accuracy — each with its
sample size, and nothing is combined until each has at least 20 observations. A combined index is deliberately not
shown to the learner (anti-gaming, §124 "learner gaming metrics").

**Human Possibility P(t), practical approximation.** Count of distinct *transferable primitives* (mechanisms he can
apply to an unseen case, verified by a delayed far-transfer success) × number of domains each has been used in.
dP/dt = new verified primitive-domain pairs per month. It is crude and honest: it only counts what was demonstrated.

## E. Capability ontology (what is being built, not which books are read)

Capabilities are **mechanism primitives** that recur across domains, each tagged with the cognitive operation it
trains. Season 1 covers six:

| Primitive (id) | Operation trained | Domains where it recurs (season 1 cases) |
|---|---|---|
| `commit` Pre-commitment against a predictable future self | model another agent (your future self) and design constraints | Homer, retirement saving, smoking, war, study |
| `select` Selection before observation (survivorship, Berkson) | ask "what process produced the data I see?" | WWII aircraft, business advice, hospital data, medicine |
| `loop` Feedback with delay | predict dynamics from structure | showers, thermostats, glucose, bank runs, supply chains |
| `base` Base rates and natural frequencies | convert a probability to a count and back | screening tests, courts, security screening |
| `proxy` Proxy optimisation (Goodhart) | separate a measure from the thing measured | colonial bounties, hospital targets, grades, this app |
| `falsify` Discriminating experiments | choose the observation that splits hypotheses | Semmelweis, medicine, everyday claims |

Each primitive has: a 3-layer vocabulary (human / sticky Egyptian-Arabic / technical), at least two representations,
a misconception catalogue, near and far transfer items, a forge task, and retrieval hooks.

Growth path: seasons add primitives, and later seasons **recombine** earlier ones (e.g. `proxy × loop` = metric
gaming as a reinforcing loop; `select × base` = why screening statistics mislead twice).

## F. Representation ontology

`story` (a real episode, paraphrased or quoted with provenance) · `data` (a primary table or chart) · `model` (an
interactive SVG the learner changes) · `diagram` · `numbers` (a worked count) · `analogy` · `counterexample` ·
`contrast` (two cases side by side). Each teaching step carries 2–4 of them; **SHOW ME DIFFERENTLY** cycles through
them and the learner model logs which representation was on screen when understanding was next demonstrated
(representation evolution, §16). No learner-type labels (Pashler et al.).

## G. Source / media architecture

`provenance[]` in every session: `{id, claim, source, year, kind (primary data | scholarship | paraphrase | original),
license (fact | public domain | short quotation | original), grade A/B/C, note}`. Every step that states a checkable
fact names its provenance ids; the test suite fails if a step cites an id that does not exist, if a quotation has no
`short quotation` entry, or if any external link appears in the learner flow. Visuals are hand-built SVG from the
data in the provenance entry (no stock or generated images). Blocked sources are recorded, not worked around.

## H. Learner model (digital twin, v1)

Local-first JSON under `localStorage["renaissance_v1"]` (separate from the CNS state and from cloud sync, so a
Renaissance bug cannot corrupt medicine):

- `answers[]`: every committed answer `{t, sid, item, kind: predict|check|transfer|far|hook|unaided|challenge,
  ok, conf, ms, bug}`
- `bugs{class: n}`: misconception classes hit (surface-pattern, causal-inversion, base-rate-neglect, …)
- `xray{cause: n}`: what the learner said was in the way (a word / the picture / a step / no stakes)
- `reps{primitive: {kind: {shown, then_ok}}}`: representation log
- `hooks{id: {due, gap, n, ok}}`: retrieval schedule (gap ×2.5 on success, reset to 1 day on failure)
- `sessions{id: {start, end, minutes, done, skipped, receipt}}` and `days{date: minutes}`

What it infers, and what it refuses to infer: it reports rates with their counts; it does not call him a "visual
learner", it does not infer a trait from fewer than five answers, and every inference in a receipt carries its n.

## I. Memory architecture ("memory without memory study")

No flashcards to manage. Each session writes 2–3 **hooks** (a retrieval or transfer item about its primitive).
Due hooks open the next session as a 1–2 item warm-up, answered **without** visuals or vocabulary help. A correct
hook doubles-and-a-half its gap (1 → 2.5 → 6 → 15 → 38 days); a miss returns it the next session with the repair
representation. This is the half-life idea (Settles & Meeder) without the flashcard interface (mnemonic medium idea).

## J. Transfer architecture

Inside a session: **contrast** (two surface-different cases share the mechanism) → **near transfer** (same domain
family) → **far transfer** (a domain the session never mentioned). Across sessions: hooks are deliberately
**interleaved** (a later session can open with a hook from any earlier primitive), so the learner must recognise
*which* mechanism applies — the interleaving effect in its strongest form (discrimination). Transfer is scored
separately from immediate accuracy everywhere.

## K. Creativity architecture (FORGE)

Every session ends with a bounded **forge**: assemble a working design from parts (e.g. a commitment device =
trigger + constraint + enforcer + escape hatch), then a critique step: the system names the first way the design would
fail and the learner picks the fix. Output is saved as a small artifact in the learner's record. No open essay
prompts (§11); optional one-line free text is allowed and never graded by the machine.

## L. Taste architecture

v1 does **not** implement taste training; season 1 is mechanism-heavy by choice (fastest measurable transfer, safest
provenance while primary texts are unreachable from this build machine). Design for season 2: paired-comparison
tasks (which of two versions — a sentence, a composition, a proof — is better and why), with expert-consensus keys
and interleaved exemplars (the interleaving effect is strongest for paintings, g = 0.67, Brunmair & Richter 2019).
Status: **design only**. This is a real gap against §173 K.

## M. Reality bridge

Each forge produces something usable in his life the same week (a commitment device for his own study; a metric
audit of his own tracking; a base-rate check of a real test he meets in medicine). The receipt records whether he
said he used it (a single tap next time: used / not yet / not useful). Only "used" counts as a reality score.

## N. Unknown-unknown engine

v1: each session's GO DEEPER holds a **frontier card** — an open question in current research adjacent to the
primitive, labelled as open. Design (not built): a periodic "map" session that shows unexplored regions of the
capability ontology and lets the learner pick one of three unfamiliar primitives by its hook question, not its name.

## O. Curriculum compiler

v1 is a **hand-authored season** plus a small planner:

```
gate(): flag on · CNS day finished (nextAction().kind === "STOP") · not an exam weekend · not 01:00–05:00 · weekly
        minutes under 245 · today's dose not spent
dose(): 25 min normal · 10 min (core steps only) in exam week, after 23:30, or when the 7-day average is above 35
pick(): the first unfinished session in authored order (the order is interleaved by primitive family),
        with due hooks as the warm-up · season finished → hooks-only review, then stop
```

The authored order is the compiler's output for season 1; the schema (`07_SEASON_1.md`) is what a future compiler
(human + model, offline) must emit, and the test suite validates any season file against it.

## P. Benchmark laboratory

See `05_BENCHMARKS.md`. Executable now: the in-app instrument (immediate vs delayed vs unaided vs far transfer,
calibration, minutes). Designed, not yet runnable: equal-time comparisons against reading, summaries, video and a
free LLM tutor (they need the learner's time and a protocol, see that file).

## Q. The recursive loop, honestly stated

```
answers + x-ray + representation log  →  per-primitive weakness and per-representation success
      →  (v1) the receipt names what reappears and which representation to lead with next time
      →  (design) the season compiler reorders primitives and rewrites the losing representations
      →  better next session  →  more evidence
```

v1 closes the loop only at the **item** level (hooks reappear, repair representation is led with next time). The
**curriculum** and **pedagogy** levels of the loop (§94–97) are designed, not automated: a season is still authored.

## R. Implementation architecture (as built)

| Layer (§203) | v1 component | Status |
|---|---|---|
| Source | `provenance[]` per session; data tables embedded; no external fetch at runtime | built |
| Truth / provenance | grades A/B/C, license kinds; tests reject orphan claims, unmarked quotes, links | built |
| Capability genome | 6 primitives with operations and domains | built (small) |
| Learner twin | `renaissance_v1` local JSON (answers, bugs, x-ray, reps, hooks, minutes) | built |
| World model | primitive ↔ domain edges in content; not yet a graph UI | partial |
| Experience library | 6 authored sessions, ~20–25 min each | built |
| Representation evolution | SHOW ME DIFFERENTLY + log; leading rep chosen from the log | partial |
| Curriculum compiler | authored order + planner + dose | partial |
| Daily experience compiler | `plan()` → steps filtered by dose | built |
| Interaction / branching | every option pre-diagnosed: misconception → repair → re-check | built |
| Transfer | contrast, near, far, interleaved hooks | built |
| Forge | parts-assembly + failure critique | built |
| Reality | "did you use it?" tap on the next session | built |
| Memory | hooks with expanding gaps | built |
| Evaluation | receipts + scorecard in WHY THIS? | built |
| Self-improvement | item-level only | partial |
| Meta-pedagogy evolution | — | design only |

Isolation: separate files, separate storage key, separate DOM root (`#rnRoot`), no writes to `S`, no changes to CNS
functions. It only **reads** `nextAction()` to know the day is finished. Kill switches: `localStorage.renaissance_off
= "1"`, `?renaissance=off`, or the `ENABLED` constant in `renaissance-v1.js` (one-line rollback).

## S. Risk register (top 10)

| Risk | Likelihood | Harm | Defense in v1 |
|---|---|---|---|
| Eats medical time | medium | high | opens only after STOP; exam-weekend lock; weekly cap; 10-min mode |
| Feels deep, transfers nothing | high | high | transfer scored separately; far items; delayed unaided hooks |
| Content error / invented fact | medium | high | provenance per claim; no quotes from memory; tests |
| Becomes a guilt machine | medium | medium | no streaks, no backlog, missed days vanish |
| Learner games the numbers | low | medium | no composite score shown; confidence taps scored by Brier |
| Dependence on the system | medium | medium | unaided warm-ups every 3rd session; scaffold decay |
| Western/prestige canon bias | medium | low | cases span Vienna, Hanoi, Philippines, Mexico, England, USA; grade C stories labelled |
| Breaks CNS | low | high | isolation above; CNS regression suite before deploy |
| Season runs out | certain | medium | honest end state; hooks-only review; next season is authored work |
| Over-claiming novelty | medium | medium | `04_INVENTION_REGISTRY.md` lists prior art for every survivor |

## T. Open unknowns

1. Far transfer for this learner: unknown until ~8 weeks of delayed hooks.
2. Best dose: 25 min is a prior, not a finding.
3. Whether primitives compound (does knowing `loop` speed up `proxy`?) — the season order lets this be checked once
   later seasons exist.
4. Taste, art, music, literature as first-class (§173 K): not in v1.
5. How much of the loop can be automated without a model at runtime (the app is static and offline-first).
