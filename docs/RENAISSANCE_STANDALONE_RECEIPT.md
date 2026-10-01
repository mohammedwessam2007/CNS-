# Renaissance Standalone Receipt · 2026-10-01

## Non-negotiable freeze boundary

The medical CNS production site was not modified by this work.

Canonical medical production at verification:
- repository: `mohammedwessam2007/CNS-`
- branch: `claude/intellectuality-v14-upgrade-e2e4vt`
- commit: `622bcb169bf495289c5bc1dde072d02677667f6e`
- Vercel project: `intellectuality-cns` (`prj_l4M0fAWF4ShBCPhhwrIx1OlYUlYk`)
- production deployment: `dpl_cR9PHX3PyFf8ojjCU7FeuMUu3vsa`
- production title re-fetched after standalone work: `INTELLECTUALITY CNS v18.6 · MCQ EXAM`
- standalone shell marker absent on production.

No merge, promotion, production alias change, environment change, build-setting change, or medical-source edit was made on the production branch.

## Standalone source

Branch: `renaissance/standalone-v1`
Base: exact production commit `622bcb169bf495289c5bc1dde072d02677667f6e`.

Purpose: preserve the canonical Renaissance organ while giving it an independent learner-facing shell and an artifact that does not contain the medical application.

Standalone-specific files:
- `source/public/renaissance-standalone.css`
- `source/public/renaissance-standalone.js`
- `source/public/manifest.webmanifest`
- `source/public/renaissance-sw.js`

Standalone-only modifications:
- branch `source/public/index.html` is a Renaissance-native shell.
- branch `source/public/renaissance-v1.js` reads `window.RENAISSANCE_EXAM_DAY` with the historical 2026-11-15 fallback and labels return navigation `BACK TO RENAISSANCE`.
- branch `deploy/vercel/build.mjs` emits only Renaissance assets and a SHA-256 `build-info.json`.
- branch `deploy/vercel/vercel.json` uses a static build and restrictive security headers.

## Current Vercel deployment

Stable branch alias:
`https://intellectuality-cns-git-ren-81d684-mohammedwessam2007s-projects.vercel.app`

At the final code commit before this receipt:
- deployment: `dpl_4X1dfL4ftB8CpdovK1Z25Jx5HS1R`
- state: READY
- target: preview / null, never production
- region: fra1
- commit: `f69c506db96584c0fb1b06619ad86ee2bb553a27`

A dormant separate Vercel project also exists:
- `intellectuality-holiday-renaissance`
- ID `prj_a4IsKK63xEYTa5VBwi556zFWTd9z`
- zero deployments observed during this mission.

The available connected Vercel write surface did not expose project-targeted deployment or project-link mutation. Therefore this mission deliberately did NOT call a non-targetable deploy operation that could risk the medical project. The current site is a separate branch deployment and separate artifact/URL, but still under the existing Vercel project namespace. Moving it into the dormant project remains an infrastructure-only follow-up when a project-targeted write surface is available.

## Artifact isolation

The Renaissance build emits 17 application assets plus generated `build-info.json`.

Observed build at commit `933e4796...`:
- 17 source assets
- 965,478 bytes
- SHA-256 recorded per asset.

Live fetches returned HTTP 200 for every required Renaissance asset and `build-info.json`.

Live isolation probes returned HTTP 404 for:
- `/mcq-v16.js`
- `/learn-v15.js`
- `/cns-atlas-v17.js`
- `/dept/cns-level-1.jpg`

Thus the standalone artifact is physically Renaissance-only, not a hidden copy of the medical shell.

## Engine verification

The exact standalone source was executed in an isolated JS harness.

Passed:
- syntax compilation for S1, S2, S3A, S3B, S3C, civilisation graph, genome, media, sealed battery, engine;
- 32 sessions;
- 287 steps;
- 208 provenance records;
- 96 retrieval hooks;
- fixed bootloader IDs in correct order;
- normal-day gate opens at 25 min;
- 01:00–05:00 sleep gate closes;
- exam-day gate closes;
- compiler returns the bootloader correctly;
- export schema `renaissance.state/1`;
- invalid import fails safely;
- session-object projection works;
- 28 capability atoms;
- 8 compounds;
- 108 civilisation nodes;
- 94 edges.

The standalone shell additionally performs a fail-closed runtime integrity sentinel before showing green. It checks:
- exact current curriculum metrics;
- unique session and hook IDs;
- per-session unique step IDs;
- prerequisite reachability;
- genome, civilisation, media and sealed registries;
- required engine APIs;
- absence of medical script leakage.

## State and sovereignty

- Renaissance keeps its canonical origin-local key `renaissance_v1`.
- The new origin therefore does not mutate medical-site state.
- Export/import uses the existing canonical `renaissance.state/1` schema.
- Imports merge evidence instead of replacing stronger records.
- The site includes configurable next-medical-exam protection.
- Sleep and weekly-dose governors remain.
- PWA manifest and network-first service worker are included.

## Measurement integrity

The 52 sealed items remain sealed and unchanged.
No new teaching content was inserted into the current baseline during this isolation mission.
Any future content expansion must explicitly protect or version the preregistered measurement protocol instead of silently contaminating it.

## Verification limitation

A real external Chromium navigation attempt from the execution environment was blocked with:
`net::ERR_BLOCKED_BY_ADMINISTRATOR`.

This is an environment network policy, not evidence about the app. It means full browser click-through against the public Vercel hostname was not claimed as passed. Live Vercel HTTP fetches, static isolation, runtime source execution, state/API tests and deployment checks passed independently.

## Truthful status

Software status: standalone Renaissance site is READY and heavily verified, with no observed defect in the checks above.
Not claimed: mathematical proof of zero bugs, human-transformation proof, or literal objective 10/10 perfection.

The next quality frontier is empirical use plus browser interaction from an unrestricted client, not another rewrite of the medical site.
