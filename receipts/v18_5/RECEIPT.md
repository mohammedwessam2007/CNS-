# Receipt · v18.5 full regression

**When:** 2026-09-27, in the build container. **What:** one snapshot of the app, the pushed commit `1b9d7c6` on
`claude/intellectuality-v14-upgrade-e2e4vt`. It is v18.5 merged with the Axis Forge commits another session pushed to
the branch meanwhile (`25fa601`), plus the Axis Forge A18 fix. No app file changed during the run. New in this snapshot:
the Kasr Al Ainy NEU 205 book figures in LEARN (`docs/KASR_AL_AINY_FIGURES.md`), the Renaissance door in Tools, and
the Axis Forge observer (`docs/AXIS_FORGE/`).

**How:** `tests/host_ctl.sh start` serves the source on :8787 and the production Vercel build
(`deploy/vercel/build.mjs`) on :8790. Every browser suite that has a Vercel variant ran on both. The rollback probe
uses the v53 tree on :8788, which the regression script starts and stops itself. The full output is
`full_regression.log` in this folder. The department-drawings key was passed through the environment only.

## Results by suite

| Suite | :8787 source | :8790 Vercel build |
|---|---|---|
| v16_test (public) | 25/25 | — |
| v16_test (owner device, department key present) | 25/25 | — |
| certify | 62/62 | — |
| spread_test · learn_test · hostile_test · v153_test | 23/23 · 17/17 · 26/26 · 10/10 | — |
| vercel_host_test · options_gallery_test | 14/14 · 7/7 | — |
| leak_audit | 0 text leaks, 0 query leaks over 1,011 items | — |
| rollback_probe (v14.2 → v53 → v18.5) | pass | — |
| dept_figs_test (with D1c and D13, new) | 18/18 | 18/18 |
| atlas_game_test · course_map_test | 22/22 · 11/11 | 22/22 · 11/11 |
| audio_options_test | 12/12 | stopped after A7 (7 passed, no FAIL line); re-runs 12/12 (see below) |
| answer_figure_test | 10/10 | 10/10 |
| renaissance_test (with R1b and R2b, new) | 40/40 | 40/40 |
| renaissance_v3_test | 59/59 | 59/59 |
| axis_forge_test | 20/20 | — |
| omega_registry_test | 11/11 | — |
| learn_coverage_strict | practice 1,009/1,009 taught; held-out 213/398 (counts only) | — |
| coverage_oracle_test (CO1–CO10) | 10/10 | — |
| ledger check (`oracle.js --check`) | pass | — |

596 checks passed on the v18.4 counting (568, plus 4 new drawing checks, 4 new Renaissance checks and the 20 Axis
Forge checks), with the Vercel audio suite counted from its re-run. No FAIL line in the log.

## Notes

- **The one irregular result.** In the full run, audio_options_test on the Vercel build stopped after A7: no summary
  line and no FAIL line. The regression filter kept only PASS/FAIL lines, so the error text is not in the log. Four
  re-runs of the unchanged test on the same build passed 12/12 each. The cause was not reproduced and is not claimed.
  One thing was plainly wrong: A8's first step had no guard for the Vercel host's one sync reload, which A7 already
  waits for. A8 now settles and retries once. With that change the suite passed 12/12 on both builds (appended to
  the log). The regression script now also keeps error lines.
- **Axis Forge A18** failed on `25fa601` in this container (19/20) before any v18.5 change was merged: the observer
  backed up a corrupt saved state only when there was Renaissance evidence to scan. It now loads its state at startup.
  20/20 in this run.
- **A mapping bug caught before release.** The new check D1c found 22 book-figure placements that pointed at section
  numbers shifted by the plus-notes sections, which keep their own ids. All were remapped by heading, and D1c passes.
- **The department key** was passed only through the environment. A search of `receipts/`, `docs/`, `tests/`,
  `tools/`, `scripts/` and `source/` for it found nothing.

## The completion ledger from this log

711 mission sections mapped to 192 requirements. **177 of 177 controllable requirements are closed (100%)**, none
open and none contradicted. 2 are blocked externally (`L12`, `L13`), 12 are empirical items with due dates, and 1 is
perpetual frontier (`atscale`). v18.5 adds no Renaissance requirement: the Tools door makes an existing one easier to
find, and the book figures belong to the CNS side of the app.

## Deployment

Checked through the Vercel connector (read only) after `1b9d7c6` was pushed on 27 September: it became
`dpl_HDW7dNqT9QheGBokPkzeMBtPr1Wt`, **READY**, target production, the newest production deployment in the listing.
This is also the first production deployment of a commit containing Axis Forge: the earlier attempt was rate limited
(`docs/CURRENT_FRONTIER.md`). **Not observed:** the served pages and files. The connector cannot fetch them, and it
returns 404 for the file list of a Git-built deployment. The sandbox cannot reach `*.vercel.app`; that is reported,
not routed around. To confirm on the iPad, the tab title reads `v18.5`; a lesson on the vestibular apparatus opens with
"KASR AL AINY BOOK · FIG 355"; and ☰ → ⚙ Study mode shows "🏛 Renaissance" under Commute mode.
