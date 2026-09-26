# Renaissance completion report (§276) · v18.1

Written from the evidence, not from intentions. Every number below comes from the regression log
`receipts/v18_1/full_regression.log` or from the ledger the oracle generated from that log
(`COMPLETION_LEDGER.md`, `COMPLETION_LEDGER.json`, `REQUIREMENT_GRAPH.json` in this folder). Where the two disagree,
the ledger is right and this report is wrong.

## 1. Branch and commit

Branch `claude/intellectuality-v14-upgrade-e2e4vt`. The tested snapshot is the commit that adds this report (`v18.1`);
its parent is `2c577a0` (the v18.1 checkpoint). Nothing was merged into another branch and no pull request was
opened: none was asked for (§189).

## 2. Deployment state

**Not verified live.** This is `BLOCKED-EXTERNAL`, not done:

- The Vercel project deploys from this branch, and the commit is pushed to it.
- No authorised path in this session can read the live deployment. The Vercel connector sees the team but not the
  project: list deployments returns 403, a deployment by URL returns 404, and fetching returns "no access". The
  sandbox's egress policy blocks `*.vercel.app`, and that denial is reported rather than routed around. The GitHub
  connector has no commit-status or deployment tool.
- What was done instead (§262): the identical production build (`deploy/vercel/build.mjs`, which fails if
  `index.html` names a missing file) was served locally on port 8790. Every Renaissance suite, and every CNS browser suite that has a production
  variant, ran against it as well as against the source (port 8787).
- To close it: the owner extends the Vercel connector to the project `intellectuality-cns`, or opens the live URL and
  checks that the tab title reads `v18.1`.

Rollback is preserved: every earlier version is a commit on this branch, and `tests/rollback_probe.js` ran in this
regression.

## 3. Test counts

Every suite ran on one snapshot. Browser suites with a production variant ran twice: on the source (:8787) and on
the Vercel build (:8790).

| Suite | Source | Vercel build |
|---|---|---|
| CNS v16 (public / owner device with the department key) | 25/25 · 25/25 | — |
| certify · spread · learn · hostile · v15.3 | 62/62 · 23/23 · 17/17 · 26/26 · 10/10 | — |
| Vercel host adapter · option gallery | 14/14 · 7/7 | — |
| department drawings | 16/16 | 16/16 |
| atlas game · course map · audio options · answer figure | 22/22 · 11/11 · 12/12 · 10/10 | 22/22 · 11/11 · 12/12 · 10/10 |
| Renaissance legacy suite (R1–R38) | 38/38 | 38/38 |
| Renaissance v3 suite (organs, trials, sealed battery, counterfeit learners, media, compiler, accessibility) | 57/57 | 57/57 |
| OMEGA registry | 11/11 | — |
| coverage oracle (CO1–CO10) | 10/10 | — |
| rollback probe (v14.2 → v53 → v18.1) | pass (on the rerun, see section 4) | — |
| ledger check (`oracle.js --check`) | pass | — |

**564 checks passed, none failed.** The Renaissance share is 211 (legacy 76, v3 114, registry 11, oracle 10). Audits:
the privacy leak audit found 0 text and 0 query leaks over 1,011 items; strict notes coverage is 1,009/1,009 practice
facts taught (held-out items are counted only, never taught from, by the firewall).

## 4. Regression status

**Green.** No FAIL line anywhere in the log. Three things happened during the run and are recorded rather than
smoothed over:

1. **The rollback probe crashed** connecting to port 8788: the regression script never started the v53 tree server
   that the probe compares against. That is a missing fixture, not a failing app. The server was started from its
   pidfile, and the probe was run once more and passed. Both outputs are in the log, the crash first. The script for
   the next increment starts the server itself.
2. **The v3 suite's play-through list** (V6, which completes every season-3 session) predated the host session. It
   was changed, before that suite started, to read the session list from the page, so no future session can be left
   out of it.
3. **Five code anchors in the requirement graph** had gone stale (renamed functions). They were corrected in the
   graph, which is tooling and not the app, before the oracle read the log.

## 5. Requirement counts

| | count |
|---|---|
| Numbered mission sections parsed (three missions: 226 + 184 + 301) | 711, every one mapped (CO1) |
| Canonical requirements | 191 |
| Controllable (including 2 merged and 1 rejected with reason) | 174 |
| Completed | 173 |
| Open controllable | 1 (`language`, section 14) |
| Contradicted by evidence | 0 |
| Blocked external | 3 |
| Empirical future | 12 |
| Perpetual frontier (never counted as closed) | 2 (`globaldepth`, `atscale`) |

The first-generation registry was ingested whole: 1,160 candidates, 863 kept (each attached to the requirement that
owns its theme, none unattached), 148 merged, and 149 rejected with a code (EVID 29, SLOP 31, SCOPE 17, TAX 16, COST
15, DUP 9, TRUTH 9, UNTEST 7, COPY 7, ADDICT 6, GUILT 3).

## 6. Coverage percent

**99.4% of controllable requirements closed (173 of 174).** A requirement counts as closed only when the oracle
finds its code location in the source and a named test that passed in this log. For a doc or process requirement,
the files it names must exist. The oracle is attacked by its own suite (CO5): fabricated claims, missing tests,
failed tests and missing symbols are all caught.

## 7. Blockers

| Requirement | Blocker | What would clear it |
|---|---|---|
| `deploy` (§188) | no authorised read of the live Vercel project from this session (section 2) | the owner grants the connector access to the project, or checks the live title |
| `L12`, `L13` (§72) | generating curriculum or pedagogy at runtime needs a content model in the loop: a credential and a budget the owner has not granted, plus a human review step so generated culture meets §136 | the owner's decision; the schema and quality gates that generated sessions would face are already in place |

Nothing else is blocked. The one open requirement, `language`, is ordinary work and is the next thing to build.

## 8. Empirical future items

None of these is a result. Each has a date, the data it needs and what would count as failure
(`EMPIRICAL_QUEUE.md`).

| id | What | Due |
|---|---|---|
| `e-hooks30` | delayed unaided recall | from 2026-10-26 |
| `e-formB` | parallel sealed form B against form A | day 30 after the first open |
| `e-rt` | reader-Turing items on *The Brothers Karamazov* | 30 days after km3 |
| `e-velocity` | transformation velocity, then acceleration | after 3 and 6 weeks of answers |
| `e-calib` | real-world forecast calibration (Brier) | after five checked forecasts |
| `e-trials` | verdicts of trials L1–L11 and L14 | as each reaches its minimum sample |
| `e-alien12` | orientation in untaught fields | day 84 |
| `e-formA90` | form A repeated (the 90-day delta) | day 90 |
| `e-bench` | equal-time comparisons with a book, a summary, a textbook, a tutor | after the exam, then 6 and 12 months |
| `e-compound` | later works cost less time to possess | 6 and 12 months |
| `e-year` | six- and twelve-month transformation | 2027-03 and 2027-09 |
| `possibility` | new options taken in life | years |

## 9. Implemented organs

Each organ has at least one complete session in the app (prediction, a primary source or model, contrast, transfer,
a far item, a forge, returning questions at 1, 7 and 30 days, and optional depth), with every factual claim carrying
provenance. Detail: `../v3/02_ORGANS.md`.

| Organ | Sessions |
|---|---|
| Literature | km1, km2, km3 (*The Brothers Karamazov*), ozy (a whole poem) |
| Mathematics | euler (Königsberg, the kolam) |
| Science | willow (+ seasons 1–2) |
| History | wisdom (the Baghdad translation movement) |
| Philosophy | km2 (theodicy, the Grand Inquisitor) |
| Art | pattern (girih), taste (season 2) |
| Music | cadence (question and answer, maqam) |
| Film | cut (the 180° rule, Ozu) |
| Architecture | arch (Hooke's chain, Gaudí, Hassan Fathy, Angkor) |
| Cultivation and society | salon, host |
| Reasoning (seasons 1–2) | commit, select, base, loop, proxy, falsify, bottleneck, question, snow, double, boss |

In numbers: 25 sessions (6 + 6 + 13) with 225 steps, 155 provenance records, 75 returning questions, 66 depth
cards, 25 live models, 23 drawn figures and 17 registered quotations. There is also a capability genome of 28 atoms
and 8 compounds, and a civilisation graph of 78 nodes and 65 links. Every figure and model is registered with its job,
its source and its rights class (M1).

## 10. Masterpiece status

*The Brothers Karamazov* is the first masterpiece compiled end to end (`../10_MASTERPIECE_COMPILER.md`): three
sessions of passages in translation, the family and the frame, the Inquisitor as an argument, the misquotation
caught at dinner, and hostile criticism (Freud, Nabokov) met with the text. The compiler is a tested specification
for the next work; only one work has been compiled. Whether he possesses the book is an empirical question
(`e-rt`, due 30 days after km3), not a claim made here.

## 11. Cultural possession status

The possession ladder, the possession graph, the quote register (every quotation with source, edition, translator,
rights and how it was checked), the primary-experience engine, the source-conflict display and the texture rules
are built and tested (`../v3/01_POSSESSION.md`). Possession itself is measured, not asserted: the reader-Turing items
are sealed, and no one has answered them yet.

## 12. Self-improvement level

**Adaptive among authored alternatives, with the judge itself audited.** Trials L1–L11 each vary one thing (step
order, length, session length, hints, spacing, task type, source mix, session architecture, season order, capability
priority, representation order). Each has a control arm, a minimum sample, a success margin, a no-harm floor and a
kill switch. L14 audits the judge's own decisions and rolls back or raises caution. Every change is chosen among arms a
person wrote. Nothing is generated at runtime and no authority is self-granted (CO6). That is the ceiling until L12–L13
are unblocked (section 7). No trial has a verdict yet: each needs his answers (`e-trials`).

## 13. Benchmark status

The benchmark lab (`../05_BENCHMARKS.md`, `../v3/04_MEASUREMENT.md`) defines the equal-time comparisons, the sealed
genius-delta battery (52 items, preregistered and hashed before any answer), the counterfeit learners and the hostile
matrix. **Built and adversarially tested; no benchmark result exists yet**, because every one needs his answers over
time. The counterfeit learners (strategies that game the items without understanding) all stay within chance + 0.12,
checked in this regression (`receipts/v18_1/counterfeit_learners.json`).

## 14. Declarations

**§282 Architectural declaration: not made.** Most of the §209 criteria are met by built and tested components, but
three are not, so the sentence is not written:

- "Deployment state is truthfully known": it is known only that it cannot be verified from here (section 2).
- "The intellectual-life stack is absorbed": the organs exist with one to three sessions each; language as a
  civilisation portal (§34) and scale (§235) are frontier plans, not built.
- "Curriculum and pedagogy self-improvement beyond representation order": L2–L11 and L14 exist, but L12 and L13 are
  blocked (section 12).

**§283 Controllable completion declaration: not made.** The oracle reports 173 of 174 controllable requirements
closed and none contradicted, and the §7 analyses have each been run (`../v3/06_MISSION_LINEAGE.md` §13). The one
open requirement is language as a civilisation portal (§34). Earlier it was filed as frontier, which kept it out of
the count. On review for this report it was moved back to controllable: §34 is a rule for how language must be
learned, and a first language experience can be built now. It is the first item of the next increment. The ledger
and this report agree.

**§284 Empirical status.**

- *Already empirically supported (by other people's research, not by this app):* retrieval practice, spacing,
  prediction before explanation, worked contrasts and interleaving, as cited in `../01_RESEARCH.md`. None of it is yet
  supported *for him* by data from this app.
- *Awaiting 30 days:* delayed recall (`e-hooks30`, from 2026-10-26), parallel form B (`e-formB`), the reader-Turing
  items (`e-rt`), and the first velocity estimates (`e-velocity`, after three weeks).
- *Awaiting 90 days:* form A repeated (`e-formA90`), orientation in untaught fields over twelve weeks (`e-alien12`),
  and the first trial verdicts as their samples fill (`e-trials`).
- *Requires months to years:* the equal-time benchmarks (`e-bench`), compounding (`e-compound`), the six- and
  twelve-month transformation (`e-year`) and human possibility (`possibility`).

Nothing here claims an IQ change, genius, or a guarantee (§285).

## 15. Receipts

- `receipts/v18_1/full_regression.log`: every suite in this regression, then the coverage-oracle suite and the
  ledger check.
- `receipts/v18_1/RECEIPT.md`: what ran, where, and the per-suite results.
- `receipts/v18_1/*.json`: per-suite machine-readable results.
- `docs/RENAISSANCE/completion/COMPLETION_LEDGER.md` / `.json` and `REQUIREMENT_GRAPH.json`: generated from that
  log by `tools/renaissance/oracle.js`; `--check` fails if they are edited by hand.
- `docs/RENAISSANCE/completion/REVERIFY.md` / `.json`: when each factual claim must be checked again.
- `docs/RENAISSANCE/completion/EMPIRICAL_QUEUE.md`: the dated empirical queue.
