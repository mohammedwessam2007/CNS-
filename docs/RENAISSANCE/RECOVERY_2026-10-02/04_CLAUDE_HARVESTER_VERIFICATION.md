# CLAUDE WORLD HARVESTER VERIFICATION · 2026-10-03

Independent recovery verification of Claude Code's World Harvester v0.1 work.

## Current branch frontier

Branch:
`renaissance/standalone-v1`

Verified head:
`10ff40cc5788889a9664701a3b264b1bd74651e5`

Commit:
`renaissance: World Harvester v0.1 vertical slice; Reader OS can digest harvested sources; fix Reader storage defect`

This commit is the authoritative executable frontier at this verification unless a later commit exists.

## Verified new capabilities

### World Harvester v0.1
Added:
- `source/public/renaissance-harvest.js`
- `tools/harvester/harvest.mjs`
- `tools/harvester/reader_host.cjs`
- `tools/harvester/targets.json`
- `tools/harvester/verify_harvest.mjs`
- `tests/harvester_test.js`
- `tests/harvester_e2e.js`
- `tests/harvester_fixtures.js`
- `.github/workflows/renaissance-harvest.yml`

Initial source ecosystem:
- Wikipedia reference material
- Wikisource primary material
- MediaWiki public API
- explicit licence allow-list
- revision-pinned provenance
- polite request/backoff design
- source tournament
- redundancy filtering
- reserved primary-source slot
- candidate experience compiler
- G1-G13 candidate gates
- explicit CANDIDATE -> PILOT human approval boundary

The shipped harvest folder is intentionally empty until a live harvest succeeds.

### Reader OS 2.0 integration
Added programmatic digestion path:
`RENAISSANCE_READER.digest(text, title, type, origin)`

Manual import remains.

Harvester-provided sources retain visible origin/provenance.

### Reader IndexedDB defect
A real pre-existing defect was found:
the IndexedDB `tx()` helper could return the raw request object on a missing-key read, causing new sources to be treated as duplicates and never saved.

Claude Code reports reproduction through the real Chromium paste -> Compile path before modification.

The current commit contains the fix and regression tests.

This is a material functional repair, not cosmetic work.

### Campus 1.2
Added:
`VII · Harvested · sandbox`

The Campus candidate view exposes:
- candidate status
- selected and rejected sources
- ranking explanations
- compiled steps
- gates
- DIGEST INTO READER
- explicit learner approval to move candidate to PILOT

## Test evidence preserved in repo

`receipts/renaissance_harvester_v0/gates.log` records:
- Reader OS hostile gate: ALL PASS
- Campus invariant gate: ALL PASS
- World Harvester: 36/36 PASS
- Chromium/browser gate: 15/15 PASS

The harvester receipt also documents mutation testing against the old Reader DB bug.

## Independent deployment verification

GitHub commit status for `10ff40cc...`:
- state: SUCCESS
- context: Vercel
- description: Deployment has completed

Verified preview deployment:
- deployment: `dpl_9XP3r4B2RHWA83rnXarfmsgyyxdx`
- state: READY
- target: preview/null
- project object: `intellectuality-cns`
- branch: `renaissance/standalone-v1`
- commit: `10ff40cc5788889a9664701a3b264b1bd74651e5`

Direct preview:
`https://intellectuality-hs6pfascu-mohammedwessam2007s-projects.vercel.app`

Live `build-info.json` independently fetched:
- app: `RENAISSANCE · INTELLECTUALITY`
- mode: `standalone+reader-os+campus`
- commit: `10ff40cc5788889a9664701a3b264b1bd74651e5`
- branch: `renaissance/standalone-v1`
- 261 integrity-tracked assets
- 58,951,502 bytes
- `renaissance-harvest.js` present and integrity-tracked
- empty `harvest/` folder present and integrity-tracked
- Reader/Campus/Renaissance/OCR/PDF assets retained

## Dedicated Vercel project truth

Dedicated project:
- name: `intellectuality-holiday-renaissance`
- project ID: `prj_a4IsKK63xEYTa5VBwi556zFWTd9z`

Independent check:
- deployment count: 0

Therefore the dedicated Renaissance project is STILL NOT DEPLOYED.

The READY preview described above still belongs to the existing `intellectuality-cns` Vercel project object, although it is a separate branch deployment and separate artifact.

The dedicated deployment workflow exists and now includes the harvester gate, but requires:
- repository secret `VERCEL_TOKEN`
- available Vercel quota

Do not claim project-object separation before the dedicated project has an actual deployment.

## Live-harvest truth

No real Wikimedia harvest has yet been demonstrated in repository receipts.

Claude's execution environment could not reach Wikipedia and used synthetic fixtures plus the real browser/CSP test.

Therefore:
- harvester architecture: implemented
- fixtures/adversarial gates: implemented
- live Wikimedia compatibility: not yet empirically verified
- harvested real curriculum content: none yet

This distinction is important.

## Medical freeze

This Claude commit did not modify the medical production branch.
The Renaissance preview remains target:null and was not promoted to the medical production alias.

Medical CNS must continue to be re-verified after any future dedicated deployment.

## Next highest-value frontier

1. Finish actual dedicated Vercel project deployment.
2. Run the first live Wikimedia harvest from an environment with lawful network access.
3. Verify real API parameters/licence/provenance behavior.
4. Preserve the harvest as an artifact before committing it.
5. Expand World Harvester beyond one hard-coded target toward autonomous domain/capability discovery.
6. Add additional lawful source ecosystems.
7. Connect accepted harvested candidates into the Tomorrow Engine without turning autonomous candidate generation into silent self-certification.
8. Continue keeping Reader OS as an internal digestion organ rather than the main user workflow.
