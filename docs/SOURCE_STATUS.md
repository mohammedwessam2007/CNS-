# Source Status and Recovery

## Canonical baseline included locally
This bundle contains the complete 26-file Hatchable v53 source tree under `source/`.

The exact hash list is:
- `manifests/CURRENT_EXACT_SOURCE_SHA256SUMS.txt`
- `manifests/CURRENT_EXACT_SOURCE_MANIFEST.json`

Verification receipt:
- `receipts/HASH_VERIFICATION.md`

The 2,929,450-byte `source/public/index.html` was reconstructed from ordered lossless chunks and SHA-256 verified against v53.
The remaining source files were exported losslessly and individually verified against current Hatchable hashes.

## Lineage / donor material
These are useful context but are not the mutation baseline:
- `public/INTELLECTUALITY_CNS_v5_ONE_BUTTON_PROFESSOR.html`
- `reference/INTELLECTUALITY_CNS_PATTERN_ENGINE_FINAL.html`
- prior receipts and state files
- `frontier/pre53_v14_draft/`

## Re-baseline rule
If Opus has live Hatchable access:
1. read project `proj_ODYBjdGkeDBq`
2. compare every live file hash with the included exact source manifest
3. if unchanged, continue from this source tree
4. if changed, obtain current truth first and reconcile before editing

Never guess or reconstruct current backend code from memory when live source is available.
