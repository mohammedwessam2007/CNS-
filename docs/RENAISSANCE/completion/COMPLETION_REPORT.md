# Renaissance completion report (§276) · v18.5

Written from the evidence, not from intentions. Every number below comes from the regression log
`receipts/v18_5/full_regression.log` or from the ledger the oracle generated from that log
(`COMPLETION_LEDGER.md`, `COMPLETION_LEDGER.json`, `REQUIREMENT_GRAPH.json` in this folder). Where the two disagree,
the ledger is right and this report is wrong.

## 1. Branch and commit

Branch `claude/intellectuality-v14-upgrade-e2e4vt`. The tested snapshot is `1b9d7c6` (v18.5: the Kasr Al Ainy book figures and the Renaissance door in Tools, merged
with the Axis Forge commits another session pushed meanwhile, plus the Axis Forge A18 fix); this report and its
receipt are committed on top of it. Earlier reports and receipts stay in `receipts/v18_1/` to `receipts/v18_4/` and in the history. Nothing was merged into another branch and no pull request was
opened: none was asked for (§189).

## 2. Deployment state

**Deployed through the authorised path and confirmed at the platform; served pages not observed.**

- The Vercel project deploys this branch to production on push, through its Git integration.
- **Confirmed through the Vercel connector (read only):** the tested commit `1b9d7c6` was deployed as
  `dpl_HDW7dNqT9QheGBokPkzeMBtPr1Wt`, **READY**, target production, the newest production deployment in the listing.
  The previous tested commit, v18.4 (`1dc9546`), is `dpl_B8QpgnjWqqNKC9dDucs92KbL8f46`, READY, and stays a rollback
  candidate.
- **Not observed:** the served pages and files. The connector cannot fetch them, and it returns 404 for a Git
  deployment's file list. The sandbox cannot reach `*.vercel.app`. That denial is reported, not routed around. What
  the site serves is the build of the deployed commit, which is the build tested on port 8790.
- To observe it: open the live URL and check that the tab title reads `v18.5`.

Rollback is preserved: every earlier version is a commit on this branch and a rollback candidate on Vercel, and
`tests/rollback_probe.js` ran in this regression.

## 3. Test counts

Every suite ran on one snapshot. Browser suites with a production variant ran twice: on the source (:8787) and on
the Vercel build (:8790).

| Suite | Source | Vercel build |
|---|---|---|
| CNS v16 (public / owner device with the department key) | 25/25 · 25/25 | — |
| certify · spread · learn · hostile · v15.3 | 62/62 · 23/23 · 17/17 · 26/26 · 10/10 | — |
| Vercel host adapter · option gallery | 14/14 · 7/7 | — |
| department drawings, with the Kasr Al Ainy book figures | 18/18 | 18/18 |
| atlas game · course map · audio options · answer figure | 22/22 · 11/11 · 12/12 · 10/10 | 22/22 · 11/11 · 12/12 (re-run, see section 4) · 10/10 |
| Renaissance legacy suite (R1–R38, with R1b and R2b for the Tools door) | 40/40 | 40/40 |
| Renaissance v3 suite (organs, trials, sealed battery, counterfeit learners, media, compiler, accessibility, regions) | 59/59 | 59/59 |
| Axis Forge (another session's observer, merged) | 20/20 | — |
| OMEGA registry | 11/11 | — |
| coverage oracle (CO1–CO10) | 10/10 | — |
| rollback probe (v14.2 → v53 → v18.5) | pass | — |
| ledger check (`oracle.js --check`) | pass | — |

**596 checks passed, none failed.** The Renaissance share is 219 (legacy 80, v3 118, registry 11, oracle 10). Audits:
the privacy leak audit found 0 text and 0 query leaks over 1,011 items; strict notes coverage is 1,009/1,009 practice
facts taught (held-out items are counted only, never taught from, by the firewall).

## 4. Regression status

**Green, with one irregular run recorded.** No FAIL line anywhere in the log. The audio-options suite on the Vercel
build stopped after A7 in the full run, with neither a result line nor a FAIL line; its error text was filtered out
of the log. Four re-runs of the unchanged test on the same build passed 12/12. Its A8 step now waits for the host's
one sync reload, as A7 already did, and passed 12/12 on both builds (appended to the log). The cause of the stop was
not reproduced and is not claimed (`receipts/v18_5/RECEIPT.md`).

## 5. Requirement counts

| | count |
|---|---|
| Numbered mission sections parsed (three missions: 226 + 184 + 301) | 711, every one mapped (CO1) |
| Canonical requirements | 192 |
| Controllable (including 2 merged and 1 rejected with reason) | 177 |
| Completed | 177 |
| Open controllable | 0 |
| Contradicted by evidence | 0 |
| Blocked external | 2 |
| Empirical future | 12 |
| Perpetual frontier (never counted as closed) | 1 (`atscale`) |

The first-generation registry was ingested whole: 1,160 candidates, 863 kept (each attached to the requirement that
owns its theme, none unattached), 148 merged, and 149 rejected with a code (EVID 29, SLOP 31, SCOPE 17, TAX 16, COST
15, DUP 9, TRUTH 9, UNTEST 7, COPY 7, ADDICT 6, GUILT 3).

## 6. Coverage percent

**100% of controllable requirements closed (177 of 177).** A requirement counts as closed only when the oracle
finds its code location in the source and a named test that passed in this log. For a doc or process requirement,
the files it names must exist. The oracle is attacked by its own suite (CO5): fabricated claims, missing tests,
failed tests and missing symbols are all caught.

## 7. Blockers

| Requirement | Blocker | What would clear it |
|---|---|---|
| `L12`, `L13` (§72) | generating curriculum or pedagogy at runtime needs a content model in the loop: a credential and a budget the owner has not granted, plus a human review step so generated culture meets §136 | the owner's decision; the schema and quality gates that generated sessions would face are already in place |

`deploy` is no longer blocked: the tested commit's deployment is confirmed through the connector (section 2). Its
served pages remain unobserved, and the report says so wherever deployment is mentioned.

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
| Mathematics | euler (Königsberg, the kolam), zero (place value from India and Cambodia through Baghdad to Pisa), maya (the Long Count, the Dresden Codex) |
| Science | willow, samarkand (Ulugh Beg's observatory), wayfinding (Pacific navigation) (+ seasons 1–2) |
| History | wisdom (the Baghdad translation movement), timbuktu (the manuscripts, their rescue, archive bias), angkor (a city built around water, and cascading failure) |
| Philosophy | km2 (theodicy, the Grand Inquisitor) |
| Art | pattern (girih), taste (season 2) |
| Music | cadence (question and answer, maqam) |
| Film | cut (the 180° rule, Ozu) |
| Architecture | arch (Hooke's chain, Gaudí, Hassan Fathy, Angkor) |
| Cultivation and society | salon, host |
| Language (§34) | names (forms of address in Russian and Egyptian Arabic as a portal) |
| Reasoning (seasons 1–2) | commit, select, base, loop, proxy, falsify, bottleneck, question, snow, double, boss |

In numbers: 32 sessions (6 + 6 + 20) with 287 steps, 208 provenance records, 96 returning questions, 87 depth
cards, 32 live models, 24 drawn figures and 17 registered quotations. There is also a capability genome of 28 atoms
and 8 compounds, and a civilisation graph of 108 nodes and 94 links. Every figure and model is registered with its job,
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
checked in this regression (`receipts/v18_5/counterfeit_learners.json`).

## 14. Declarations

**§282 Architectural declaration: not made.** Most §209 criteria are met by built and tested components, and the
deployment state is now known at the platform. Two are not met, so the sentence is not written:

- "The intellectual-life stack is absorbed": every organ exists and every region has a session set there, but with
  one to four sessions each.
- "Cultural possession exists" (§210: "possession, not familiarity"): the ladder, the sealed reader-Turing items and
  the compiler are built, but no one has yet shown possession. That is an empirical result, and it is not in.

**§283 Controllable completion declaration.** The criteria are met:

- The oracle reports 177 of 177 controllable requirements closed, none open and none contradicted, from this regression's log, and `--check` confirms the committed ledger.
- The §7 analyses were re-run on this state (`../v3/06_MISSION_LINEAGE.md` §14), under the rule that caught language, token regions and global depth: anything that can be built now is controllable. They found nothing left that can be built now.
- What is not closed is listed in sections 7 and 8: two requirements blocked on the owner's credential and budget, twelve empirical items that need time and the learner, and one perpetual frontier (`atscale`).

100% CONTROLLABLE RENAISSANCE COMPLETION ACHIEVED.

This means every requirement that can be built and tested now is built and tested. It does not mean the system works
on the learner: that is §284, below, and none of it is in yet.

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

- `receipts/v18_5/full_regression.log`: every suite in this regression, then the coverage-oracle suite and the
  ledger check.
- `receipts/v18_5/RECEIPT.md`: what ran, where, and the per-suite results.
- `receipts/v18_5/*.json`: per-suite machine-readable results.
- `docs/RENAISSANCE/completion/COMPLETION_LEDGER.md` / `.json` and `REQUIREMENT_GRAPH.json`: generated from that
  log by `tools/renaissance/oracle.js`; `--check` fails if they are edited by hand.
- `docs/RENAISSANCE/completion/REVERIFY.md` / `.json`: when each factual claim must be checked again.
- `docs/RENAISSANCE/completion/EMPIRICAL_QUEUE.md`: the dated empirical queue.
