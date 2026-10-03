# Receipt · v18.7 Dr Sameh Doss's labelled drawings

**When:** 2026-10-03/04, in the build container. **What:** commit `86cf7ac` on `claude/intellectuality-v14-upgrade-e2e4vt`
(the drawings, the picker, the label, the 16-check test), plus the test fixes in the commit that carries this receipt.
Details of the feature and its limits: `docs/SAMEH_DOSS_DRAWINGS.md`.

**How:** `tests/host_ctl.sh start` serves the source on :8787 and the production Vercel build on :8790; the regression
script is the v18.5 one without the (now meaningless) department-key run. Full output: `full_regression.log` (the reruns
and the oracle test are appended at its end).

## Results

| Suite | :8787 source | :8790 Vercel build |
|---|---|---|
| v16_test | 25/25 | — |
| certify | 62/62 | — |
| spread_test · hostile_test · vercel_host_test · options_gallery_test | 23/23 · 26/26 · 14/14 · 7/7 | — |
| learn_test | 17/17 (after the test fix, below) | 18/18 |
| v153_test | 10/10 (after the test fix, below) | — |
| leak_audit | 0 text leaks, 0 query leaks over 1,061 items | — |
| rollback_probe | pass | — |
| dept_figs_test (D1–D16, D11–D16 new) | 16/16 | 16/16 |
| atlas_game_test · course_map_test · audio_options_test · answer_figure_test | 22 · 11 · 12 · 10, all passed | same, all passed |
| renaissance_test · renaissance_v3_test | 40/40 · 59/59 | 40/40 · 59/59 |
| axis_forge_test · omega_registry_test | 20/20 · 11/11 | — |
| coverage_oracle_test (CO1–CO10) | 10/10 | — |
| ledger (`oracle.js --check`) | 177 of 177 controllable requirements closed, none open or failed | — |

## Notes

- **Three test steps failed in the first full run and were fixed, not hidden.** learn_test L2 and v153_test P3 and P5 look
  at the web photo of the first lesson section ("Extent: where the cord begins and ends"). v18.7 gives that section
  Dr Doss's drawings, so (as in every section with official drawings since v18.5) its web photo now sits behind a tap
  and the test could not see it. The app behaved as designed; the three tests now open the fold first, as a learner
  would. They then pass on both builds (learn_test 17/17 and 18/18, v153_test 10/10).
- **Strict coverage reads 1,021 of 1,059 practice items taught (96.4%).** The same number comes out on the v18.6 commit
  (checked in a separate worktree): the 50 CNS-levels figure questions v18.6 made public are not taught by lesson notes.
  v18.7 changes no note.
- **No labelled drawing test can tell a good crop from a bad one.** Every crop was checked by eye on contact sheets (a
  dozen were dropped), and the placement spot checks are by eye too (about 50 questions, no wrong picture seen).
- **The held-out firewall:** the drawing picker reads a question at display time only. Nothing was written from a
  held-out item; the test spot checks use practice questions only.
- **Deployment:** the Vercel connector lists the production deployment of `86cf7ac` as READY. The deployed pages were
  not fetched, so the live site is not claimed as verified here.
- One process slip: a `pkill -f` was used once to stop a test run (it ended only that run and the shell). The rule is
  pidfiles; it was not repeated.
