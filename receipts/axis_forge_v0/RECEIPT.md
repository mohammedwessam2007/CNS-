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

## Promotion rule

Do not merge merely because the concept is attractive.

Merge only after:

1. the latest branch head receives a READY Vercel preview;
2. the preview HTML contains `/axis-forge-v1.js`;
3. the asset is fetchable;
4. production remains on the v18.4 parent until the merge decision.

## Empirical frontier

The first genuine Axis Forge result requires learner data. A candidate cannot become `TRANSFERRED` before the
hard evidence floor in `docs/AXIS_FORGE/README.md`, and cannot become `PROMOTED` without explicit human approval.
