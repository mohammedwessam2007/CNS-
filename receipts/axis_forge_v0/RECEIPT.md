# Axis Forge v0 verification receipt

Date: 2026-09-27  
Parent stable state: Renaissance v18.4, receipt head `2883a29b4700dc602ed72ad5297e98d7251f4d54`  
Branch: `astra/axis-forge-v0`

## What was built

- `source/public/axis-forge-v1.js`: isolated cognitive-organogenesis observer.
- `tests/axis_forge_test.js`: hostile/unit test specification.
- `docs/AXIS_FORGE/README.md`: mission, evidence law, anti-fantasy rules, AI-obsolescence filter.
- `docs/AXIS_FORGE/REQUIREMENT_GRAPH.json`: requirement/evidence ledger.
- `deploy/vercel/build.mjs`: preview/build injection after `renaissance-v1.js`.
- `.github/workflows/axis-forge.yml`: CI definition.

## Direct executable verification

The exact `source/public/axis-forge-v1.js` fetched from this branch was executed in an isolated JavaScript runtime
with a mocked Renaissance capability genome, seasons, localStorage, and learner record.

**20/20 checks passed. 0 failed.**

The checks exercised:

1. storage isolation;
2. single-atom fake novelty rejection;
3. known-compound renaming rejection;
4. candidate-only status for unregistered combinations;
5. idempotent Renaissance ingestion;
6. unaided-evidence accounting;
7. replicated-but-not-transferred gate;
8. three-domain + held-out + real-world transfer gate;
9. rejection of promotion without human approval;
10. approved promotion only after transfer;
11. AI-assisted evidence contamination guard;
12. OUTSOURCE allocation;
13. EMBODY allocation;
14. EXPERIENCE allocation;
15. COEVOLVE allocation;
16. no-AI new-domain probe compiler;
17. revocation;
18. export/import;
19. corruption backup/recovery;
20. kill switch.

No result above is a claim that a new human cognitive faculty has been discovered. The observer merely establishes
the machinery required to make such a claim falsifiable later.

## GitHub Actions note

Workflow run `36284282777` ended in failure before GitHub allocated a runner (`runner_id: 0`, no job steps).
No test step ran, so that run is **not evidence for or against the code**. The direct executable verification above is
the current code-level evidence. The workflow remains in the branch so a later runner can execute the same checks.

## Vercel state

- Production remains Renaissance v18.4 from commit `1dc9546`, READY.
- A preview deployment was created for the branch's first Axis Forge commit and was READY.
- The integrated build-injection commit still requires a fresh preview before merge.
- Nothing in this branch has been promoted to production.

## Final integration evidence and external blockers

The canonical branch source now contains exactly one `/axis-forge-v1.js` loader immediately after
`renaissance-v1.js`. The Vercel build code has a duplicate guard, so the build cannot inject a second copy.

The existing READY branch preview from commit `beca2e7` independently proves that Vercel serves
`/axis-forge-v1.js` with HTTP 200. That preview predates the later loader integration and therefore is **not**
claimed as an integrated-head preview.

The latest head cannot currently receive a fresh preview because Vercel's GitHub status reports exactly:

> Deployment rate limited — retry in 24 hours.

This is an external quota condition, not a source failure. Production remains the verified v18.4 deployment.

GitHub Actions is also not source evidence here: its jobs terminate before runner allocation (runner_id 0, zero
steps). The exact current Axis Forge module was therefore executed directly against the hostile cases instead and
passed 20/20.

## Source merge rule

Source may be merged under the project's source-vs-infrastructure distinction when all of the following hold:

1. exact-module hostile verification is green (20/20);
2. canonical source contains exactly one loader after Renaissance;
3. the module asset has already been served successfully by Vercel on the branch;
4. the PR is mergeable against the unchanged verified v18.4 base;
5. the deployment quota failure remains explicitly classified as external;
6. no claim is made that production contains Axis Forge until a production deployment is actually observed.

The merge does **not** turn a future deployment into verified production. Deployment verification remains a separate
truth claim.

## Empirical frontier

The first genuine Axis Forge result requires learner data. A candidate cannot become `TRANSFERRED` before the
hard evidence floor in `docs/AXIS_FORGE/README.md`, and cannot become `PROMOTED` without explicit human approval.