# WORLD HARVESTER · FIRST VERTICAL SLICE (v0.1) · 2026-10-02

Mission source: the "Autonomous Civilization Constitution" of 2026-10-02 (sections 4, 5, 16, 18, 47, 48, 53).
Branch: `renaissance/standalone-v1`. Medical CNS untouched. Reader OS stays 2.0 and Campus stays 1.2 (both changed additively).

## What the slice does (the eleven steps of Constitution section 53)

| # | Step | Where it lives |
|---|---|---|
| 1 | Select one lawful source ecosystem | Wikimedia: Wikipedia (reference) + Wikisource (primary), via the public MediaWiki API. Licences are explicit and a revision ID is a free, exact provenance anchor. `tools/harvester/harvest.mjs` (`createWikimedia`) |
| 2 | Discover candidates for a target capability | `cycle()`: queries from `tools/harvester/targets.json` (a target is a capability, not a source list) |
| 3 | Record metadata and provenance | permalink with `oldid`, revision, retrieval time, licence, attribution, language, SHA-256, why discovered: pack + `memory.json` |
| 4 | Classify the source type | `reference` / `primary`; a primary source is compiled under Reader's primary-text law |
| 5 | Extract capability donors | Reader OS 2.0 `compile()` run headlessly (`tools/harvester/reader_host.cjs`): verbatim claims, counter-claims, verification anchors, typed retrieval prompts |
| 6 | Rank them | `select()` in `source/public/renaissance-harvest.js`: source tournament (fit, evidence, compressibility, novelty, kind gap, time, redundancy, uncertainty); at most three sources; reserved slot for a requested primary source; near-duplicates (>=50% overlap) turned away |
| 7 | Feed the winner to Reader OS | `RENAISSANCE_READER.digest(text, title, type, origin)`: new internal entry (manual import unchanged); refuses text that does not match its recorded hash or has no origin |
| 8 | Compile one candidate experience | `compileExperience()`: model (verbatim claims with anchors), contrast, up to 8 retrieval prompts, transfer, reality task; minutes computed from the steps |
| 9 | Run quality gates | `gates()`: G1 licence, G2 provenance, G3 attribution, G4 verbatim, G5 integrity (hash), G6 synthesis (advisory), G7 contrast, G8 retrieval, G9 primary law, G10 not-rejected, G11 no self-certification, G12 human review, G13 fits a day (advisory) |
| 10 | Expose it in a sandbox Campus track | Campus section "VII · Harvested · sandbox": candidate card, "why these sources and why not something else", every step visible, gate results, DIGEST INTO READER, I APPROVE THIS AS A PILOT |
| 11 | Gather evidence | Reader OS's existing retrieval and evidence lifecycle (STUDY button per digested source) |

## Architecture decision that matters

The deployed app has `Content-Security-Policy: connect-src 'self'` and a local-first promise. The harvester therefore does **not** run in the browser:

```
GitHub Action or Node (outside the app)      same-origin static files           the app (browser)
tools/harvester/harvest.mjs  ──writes──▶  /harvest/index.json, memory.json,  ──▶  Campus track VII
  discover · fetch · compile · tournament      packs/<safe-name>.json              re-verifies every pack by hash
  gates · verify_harvest.mjs                                                       Reader.digest() → library
```

The browser loads packs from its own origin, re-runs the blocking gates itself (it trusts nothing in the index), and only then digests. This also matches Constitution section 49 (night: discover and compile; morning: one coherent experience ready). The CSP was not loosened.

## Laws kept (each is a test)

licence allow-list (CC BY-SA 4.0/3.0, CC BY 4.0, CC0, public domain; anything else is remembered, never ingested) · provenance never lost · every claim a verbatim substring of its source · rejected sources recoverable and not re-fetched · **AI may generate candidates and may not certify them** (`promote()` needs a human approval; the Node harvester never mentions promotion; in the page only the Campus "I APPROVE" click reaches `approve()`) · primary literary text ends at a bridge · polite network use (identifying User-Agent, `maxlag`, one request at a time with a pause, back-off on 429, stop instead of pressing) · the harvester refuses to run without `--live`, so fixtures can never be written into the shipped folder · the shipped `source/public/harvest/` is empty on purpose.

## Defect found and fixed on the way (Reader OS 2.0)

`tx()` in `reader-v1.js` resolved with the raw IndexedDB request object when a key was missing, so `saveSource` saw every NEW source as an existing duplicate and **never saved it**. Reproduced on the untouched branch in Chromium by the real UI path (paste text, Compile): 0 sources saved, error `Cannot read properties of undefined (reading 'verdict')`. One-line fix; regression tests added to `tests/reader_os_test.js` using an in-memory IndexedDB (they fail on the old code: mutation-checked, 4 failures) so the Vercel build gate catches it. The earlier "hostile gate" had no storage at all.

## How to run

* Gates, no network: `node tests/reader_os_test.js && node tests/campus_test.js && node tests/harvester_test.js`
* Browser gate: `node tests/harvester_e2e.js` (needs Playwright; serves the shipped files under the shipped CSP)
* A live harvest, from GitHub: Actions, "Renaissance World Harvester", Run workflow on branch `renaissance/standalone-v1`. It re-runs the gates, harvests, verifies the folder from scratch, uploads an artifact, and commits only if "commit" is ticked (a commit starts a Vercel preview build and spends build quota).
* A live harvest, locally: `node tools/harvester/harvest.mjs --live --target natural-selection` then `node tools/harvester/verify_harvest.mjs`.

## Proven here vs not proven

Proven (this container): all 36 harvester checks on a stand-in MediaWiki API, 15 real-Chromium checks under the shipped CSP (candidate shown, digest stores origin, duplicate idempotent, tampering refused, only a human click promotes, zero cross-origin requests), Reader and Campus gates, the production build script (run against stand-in vendor files).

**Not proven:**
1. **A live harvest has never run.** This sandbox's egress policy denies `en.wikipedia.org` (HTTP 403 at the proxy); that denial was reported, not worked around. The MediaWiki request parameters are written from knowledge of the API and exercised only against my own stand-in, so a live run may need a parameter fix. The stand-in article texts are synthetic and are not shipped.
2. The real PDF.js/OCR packages could not be installed here, so the full production build was run only against stand-ins for those packages (the harvest and script copying is verified; the vendor copying is unchanged code).
3. Nothing was deployed. The dedicated Vercel project is still empty (blocker A: the `VERCEL_TOKEN` repository secret, which only the owner can add; blocker B: Vercel free-plan build rate limit). Preview builds of this branch run inside the medical project's quota, so pushes to this branch should stay few.
4. No empirical learner outcome exists: whether a harvested experience teaches anything is exactly what Reader's evidence lifecycle will measure after real use.

## Known limits and next slices

* One ecosystem, one target. Domain discovery (proposing targets nobody asked for, Constitution section 10) is not built; `targets.json` is seeded from the Constitution's own example.
* Extraction is extractive: it composes verbatim claims and Reader's typed prompts. The transfer prompt and reality task for a target are machine-drafted and always marked for the learner's review.
* Quality evidence for primary sources is thin by construction (no link or heading counts), which is why a requested primary source gets a reserved slot instead of competing on measured evidence. That is a judgement, recorded in the ranking text.
* Source refresh (section 30), the Tomorrow Engine feed (section 50), multilingual sources (section 37), more ecosystems (open-access journals, public-domain books, museum and archive APIs), person discovery and a nightly schedule are next. A nightly schedule needs the owner's decision on build quota first.
* Redundancy is measured by shared 6-word phrases and top-term overlap: a heuristic, not a semantic judgement.
