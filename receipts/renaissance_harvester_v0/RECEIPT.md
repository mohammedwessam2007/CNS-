# Receipt · World Harvester v0.1 + Reader OS storage fix · 2026-10-02

Branch `renaissance/standalone-v1`, working tree on top of `98170b8` (the recovery snapshot head). Full design and limits: `docs/RENAISSANCE/RECOVERY_2026-10-02/03_HARVESTER_SLICE.md`. Raw output: `gates.log` in this folder.

## Results (this container, Node 22, Chromium via Playwright)

| Gate | Result |
|---|---|
| `tests/reader_os_test.js` (Reader OS 2.0: previous checks + 5 new storage and digest checks) | ALL PASS |
| `tests/campus_test.js` (Campus 1.2, unchanged assertions) | ALL PASS |
| `tests/harvester_test.js` (stand-in MediaWiki world) | ALL 36 PASSED |
| `tests/harvester_e2e.js` (real Chromium under the shipped CSP) | ALL 15 PASSED |
| `tools/harvester/verify_harvest.mjs` on the shipped (empty) folder | ok, 0 experiences, 0 packs |
| `deploy/vercel/build.mjs` run against stand-in vendor packages | ok; `renaissance-harvest.js` and `harvest/` copied and integrity-tracked |
| both GitHub workflows parsed as YAML | ok |

## The Reader OS defect (reproduced, fixed, mutation-checked)

Before the fix, on the untouched branch: pasting a source in Reader OS and pressing Compile saved nothing (library length 0, "Cannot read properties of undefined (reading 'verdict')"), because `tx()` resolved with the IndexedDB request object for a missing key, so every new source looked like a duplicate. After the fix the same UI path saves it (library length 1). The new Reader gate checks fail on the old code (4 failures) and pass on the fixed code.

## Defects the new tests caught in the harvester itself, before this commit

1. Pack file names contained `%3A` literally, so the web server's URL decoding returned 404 (found by the browser test only). Now one shared `packName()`.
2. The near-duplicate page was chosen (term overlap alone barely separates it); replaced by phrase containment plus a 50% cut-off.
3. Four sources meant a 45-minute "experience"; now at most three sources, at most eight retrieval prompts, minutes computed from the steps.
4. Primary sources could never outrank encyclopedia pages on measured evidence; a requested primary source now gets a reserved slot (recorded in the ranking text).
5. A YAML error (an unquoted colon) in the new workflow, caught by parsing it.

## Not done, and why

* No live harvest: the sandbox network policy denies `en.wikipedia.org` (HTTP 403 from the egress proxy); not retried or routed around.
* No deployment: the dedicated Vercel project is empty and needs the `VERCEL_TOKEN` repository secret, which only the owner can add; Vercel's free-plan build-rate limit is a second external blocker. The medical site was not touched.
* The real PDF.js and OCR packages could not be installed here.
