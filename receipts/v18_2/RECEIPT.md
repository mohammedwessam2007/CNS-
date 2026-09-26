# Receipt · v18.2 full regression

**When:** 2026-09-26, in the build container. **What:** one snapshot of the app (the v18.2 working tree on
`claude/intellectuality-v14-upgrade-e2e4vt`, parent `23f58f0`), tested in full before commit. No app file changed
during the run. New in this snapshot: the sessions zero, timbuktu and names (language, §34).

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
| renaissance_v3_test | 57/57 | 57/57 |
| omega_registry_test | 11/11 | — |
| learn_coverage_strict | practice 1,009/1,009 taught; held-out 213/398 (counts only) | — |
| coverage_oracle_test (CO1–CO10) | 10/10 | — |
| ledger check (`oracle.js --check`) | pass | — |

564 checks passed; no FAIL line in the log.

## Notes

- **Before the full run**, the two Renaissance suites were run on the source alone. The legacy suite's legibility check
  (R34) found labels cut off at 360 px in four new figures (the zero timeline, the place-value model, the address
  model's header and pronoun lines, the survival model's header) and "1 symbols" / "1 crises". All were fixed, and
  the suite passed, before this run started.
- **Order of the last steps**: the oracle bootstrap-wrote the ledger files from the log; the coverage suite ran with
  the log and was appended; the oracle rewrote the ledger from the final log; `--check` confirmed the files on disk
  equal a fresh run on that log.
- **The department key** was passed only through the environment. A search of `receipts/`, `docs/`, `tests/`,
  `tools/` and `source/` for it found nothing.

## The completion ledger from this log

711 mission sections mapped to 192 requirements. 174 of 175 controllable requirements are closed (99.4%). One is
open: `globalfloor`, opened on review before the declaration (two regions taught in one session each). None is
contradicted. 3 are blocked externally (`deploy`, `L12`, `L13`), 12 are empirical items with due dates, and 2 are
perpetual frontier. Language (§34), open in v18.1, is closed by the session `names`. See
`docs/RENAISSANCE/completion/COMPLETION_LEDGER.md` and `COMPLETION_REPORT.md`.

## Deployment after the push

Checked through the Vercel connector (read only) after `e177767` was pushed at about 21:27 UTC:

- **No deployment was created** for `e177767` by 21:31 UTC. None was created for the v18.1 commit `23f58f0` either
  (pushed 20:52 UTC).
- Production is `dpl_FH791VyN3rgbK7ky1TxmUGXF2mCn`, **READY**, built from `2c577a0` (20:05 UTC, title v18.0). It is
  the rollback point.
- The Hobby limit is not the cause: the project made 12 deployments today, against a limit of 100. The connector
  shows neither the project's Git settings nor a reason.
- **A deployment was not forced.** The stop may be the owner's choice. The app is in daily use for an exam, and
  creating a production build by hand is not the same action as the push the owner set up. The remedy is the
  owner's: check the Git connection for `intellectuality-cns` in Vercel, or redeploy the branch head.

## Files

- `full_regression.log`: the complete output, in run order, then the coverage-oracle suite and the ledger check.
- `renaissance_source.json`, `renaissance_vercel.json`: the legacy Renaissance suite (R1–R38).
- `v3_source.json`, `v3_vercel.json`: the v3 suite.
- `coverage_oracle.json`: CO1–CO10.
- `counterfeit_learners.json`: the counterfeit strategies per season and on the sealed items (from S3; the maximum of
  thirteen strategies against chance).
