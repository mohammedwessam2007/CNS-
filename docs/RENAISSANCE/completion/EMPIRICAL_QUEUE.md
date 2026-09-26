# Empirical future queue (§6B, §193–194, §284)

Nothing here is a result. Each line says what will be measured, when, from which data, and what would count as
support or failure. The app already schedules the sealed items itself (`dueProbes()`); the rest need the owner's real
use, or another person. The machine-readable twin of this list is the `empirical` class in
`COMPLETION_LEDGER.json`.

| id | What | When | Data | Supports the design if | Fails it if |
|---|---|---|---|---|---|
| `e-hooks30` | delayed, unaided recall of season 1–3 ideas | from 2026-10-26 (30 days after the first sessions) | returning-question records with gap ≥ 30 days | ≥ 70% right and not guessed, n ≥ 20 | < 50%, or right only when guessed |
| `e-formB` | parallel form B against form A | day 30 after the first open | sealed forms A and B, raw scores | B ≥ A on matched atoms (n = 8 each; reported with chance) | B < A |
| `e-formA90` | form A repeated (the 90-day delta) | day 90 after the first open | the same 8 sealed items | a gain beyond the day-0 score, reported with n and chance | no gain |
| `e-alien12` | orientation in untaught fields over twelve weeks | day 84 | 24 weekly unknown problems | a positive slope after ≥ 3 weeks of ≥ 5 answers | a flat or falling slope |
| `e-rt` | reader-Turing questions on *The Brothers Karamazov* | 30 days after km3 | 12 sealed items | ≥ 8 answered at ≥ 75% (possession rung 12) | < 50% |
| `e-velocity` | transformation velocity and acceleration | after 3 weeks (velocity) and 6 weeks (acceleration) of ≥ 5 answers | delayed, unaided answers per week | positive velocity; acceleration not negative | negative velocity |
| `e-trials` | verdicts of trials L1–L11 and L14 | as each reaches its minimum sample | trial logs in the record | any arm adopted, dropped or stopped by the judge, with n | — (every verdict is information) |
| `e-calib` | real-world forecast calibration | after five checked forecasts | forge forecasts against reported use | Brier < 0.25 (better than always saying 50%) | Brier ≥ 0.25 |
| `e-bench` | equal-time comparisons: a full book, a summary, a textbook, a tutor (`../05_BENCHMARKS.md`) | after the exam (November 2026), then at 6 and 12 months | matched minutes, sealed questions | Renaissance ≥ the alternative per minute on delayed transfer | below the alternative |
| `e-compound` | later works cost less time to possess | 6 and 12 months | minutes to reach rung 6 per work, in order of study | falling minutes for related works | flat |
| `e-year` | six- and twelve-month transformation | 2027-03 and 2027-09 | the vector, possession, real use, real talk | gains on delayed and far measures and reported use | gains only in-session |
| `possibility` | human possibility over years (`../05_BENCHMARKS.md` §5) | years | life outcomes he reports | new options he takes that he did not have | none |

**Held out before exposure (§194).** All 52 sealed items were written, hashed and registered on 2026-09-26, before
any answer (`docs/RENAISSANCE/sealed/preregistration.json`). Any later edit fails test S1. Nothing is written after
seeing performance.

**Limits.** n = 1; the items and the lessons share an author (mitigated by mechanism, see `sealed/README.md`);
explanation and writing are not measured by any instrument here; a human reader-examiner and real conversations are
the stronger tests and are part of `e-rt` and `e-year`.
