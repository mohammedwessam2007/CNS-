# Receipt · v18.4 full regression

**When:** 2026-09-26, in the build container. **What:** one snapshot of the app (the v18.4 working tree on
`claude/intellectuality-v14-upgrade-e2e4vt`, parent `413e925`), tested in full before commit. No app file changed
during the run. New in this snapshot: the session angkor and the global-depth test V13.

**How:** `tests/host_ctl.sh start` serves the source on :8787 and the production Vercel build
(`deploy/vercel/build.mjs`) on :8790; every browser suite that has a Vercel variant ran on both. The rollback probe
also needs the v53 tree on :8788, which the regression script now starts and stops itself. The full output is `full_regression.log` in this folder; the
department-drawings key was passed through the environment and appears nowhere in this folder (checked).

## Results by suite

| Suite | :8787 source | :8790 Vercel build |
|---|---|---|
| v16_test (public) | 25/25 | — |
| v16_test (owner device, department key present) | 25/25 | — |
| certify | 62/62 | — |
| spread_test · learn_test · hostile_test · v153_test | 23/23 · 17/17 · 26/26 · 10/10 | — |
| vercel_host_test · options_gallery_test | 14/14 · 7/7 | — |
| leak_audit | 0 text leaks, 0 query leaks over 1,011 items | — |
| rollback_probe | pass | — |
| dept_figs_test | 16/16 | 16/16 |
| atlas_game_test · course_map_test | 22/22 · 11/11 | 22/22 · 11/11 |
| audio_options_test · answer_figure_test | 12/12 · 10/10 | 12/12 · 10/10 |
| renaissance_test (R1–R38) | 38/38 | 38/38 |
| renaissance_v3_test | 59/59 | 59/59 |
| omega_registry_test | 11/11 | — |
| learn_coverage_strict | practice 1,009/1,009 taught; held-out 213/398 (counts only) | — |
| coverage_oracle_test (CO1–CO10) | 10/10 | — |
| ledger check (`oracle.js --check`) | pass | — |

568 checks passed; no FAIL line in the log.

## Notes

- **Before the full run**, both Renaissance suites were run on the source alone and passed (legacy 38/38, v3 59/59).
- **The new test V13 was checked both ways**: on the v18.3 season files it reports Southeast Asia as the only region
  that is not the named setting of a session teaching it; on this snapshot it reports none.
- **Deployment of the previous commit, confirmed before this run**: `413e925` (v18.3) became
  `dpl_HdxJtEGt2BfHsEFDS6UC8zbQBndn`, READY, production, within seconds of its push, and was the project's latest
  production deployment. The served pages were not fetched (no access).
- **Order of the last steps**: the oracle bootstrap-wrote the ledger files from the log; the coverage suite ran with
  the log and was appended; the oracle rewrote the ledger from the final log; `--check` confirmed the files on disk
  equal a fresh run on that log.
- **The department key** was passed only through the environment. A search of `receipts/`, `docs/`, `tests/`,
  `tools/` and `source/` for it found nothing.

## The completion ledger from this log

711 mission sections mapped to 192 requirements. **177 of 177 controllable requirements are closed (100%)**, none
open and none contradicted. `globaldepth` is closed by the Angkor session and V13. `deploy` is closed on the
connector's confirmation of the previous tested commit's production deployment, with the served pages unobserved.
2 requirements are blocked externally (`L12`, `L13`: a credential and budget only the owner can grant), 12 are
empirical items with due dates, and 1 is perpetual frontier (`atscale`). See
`docs/RENAISSANCE/completion/COMPLETION_LEDGER.md` and `COMPLETION_REPORT.md`.

## Files

- `full_regression.log`: the complete output, in run order, then the coverage-oracle suite and the ledger check.
- `renaissance_source.json`, `renaissance_vercel.json`: the legacy Renaissance suite (R1–R38).
- `v3_source.json`, `v3_vercel.json`: the v3 suite.
- `coverage_oracle.json`: CO1–CO10.
- `counterfeit_learners.json`: the counterfeit strategies per season and on the sealed items (from S3; the maximum of
  thirteen strategies against chance).
