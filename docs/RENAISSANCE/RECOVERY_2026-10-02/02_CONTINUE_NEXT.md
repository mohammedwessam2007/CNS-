# CONTINUE NEXT · EXACT RESUME INSTRUCTIONS

## Mission

Finish the **dedicated Renaissance site** without changing the medical CNS site.

Do not redesign Reader OS or Campus during recovery unless a verified defect forces it.

## Startup

1. Refresh branch `renaissance/standalone-v1`.
2. Read `00_START_HERE.md`.
3. Compare current branch head against recovery snapshot `f0110f13032f37b0c96307e71134266519eddc80`.
4. If newer commits exist, inspect them before changing anything.
5. Re-fetch the stable Renaissance `/build-info.json`.
6. Re-fetch medical production and verify it is still CNS-only.

## Dedicated deployment path

Preferred path is the already-authored workflow:
`.github/workflows/renaissance-separate-vercel.yml`

Required external condition:
- repository secret `VERCEL_TOKEN` exists and is valid for the correct Vercel account/team.

Do not commit the token.
Do not paste it into source, docs, workflow YAML, issues, logs or chat receipts.

When the secret is available:
1. trigger the workflow manually or by a qualifying branch change;
2. require Reader hostile gate PASS;
3. require Campus invariant gate PASS;
4. require local prebuilt output;
5. require no medical asset leakage;
6. require deployment to project `prj_a4IsKK63xEYTa5VBwi556zFWTd9z`;
7. capture dedicated production URL;
8. fetch dedicated `build-info.json`;
9. compare core SHA-256 values against the frozen standalone release;
10. probe Reader/Campus/PDF/OCR assets for HTTP 200;
11. probe medical-only assets for HTTP 404;
12. re-fetch `https://intellectuality-cns.vercel.app/` and confirm CNS v18.6 remains intact.

## Required acceptance checks

Dedicated Renaissance:
- Reader OS version 2.0
- Campus version 1.2
- 32 sessions / 287 steps / 208 provenance / 96 hooks
- 28 atoms / 8 compounds
- 108 civilisation nodes / 94 edges
- 52 sealed probes untouched
- Reader doctor green
- Campus doctor green
- English OCR data present
- Arabic OCR data present
- PDF.js present
- no `mcq-v16.js`
- no `learn-v15.js`
- no `cns-atlas-v17.js`
- no department-figure medical bundle
- build-info tied to exact deployed commit

Medical:
- `https://intellectuality-cns.vercel.app/` returns 200
- title remains `INTELLECTUALITY CNS v18.6 · MCQ EXAM`
- Reader marker absent
- Campus marker absent
- medical marker present

## Do not do

- Do not use generic untargeted Vercel deploy if target project cannot be proven.
- Do not promote a Renaissance preview onto the medical production alias.
- Do not merge `renaissance/standalone-v1` into the medical production branch merely to deploy.
- Do not weaken Reader/Campus tests for convenience.
- Do not remove OCR original-page verification.
- Do not let cloze-only recall prove replacement.
- Do not flatten primary literature into "fully replaced."
- Do not open sealed probe content.
- Do not claim zero bugs or empirical human transformation from software checks alone.

## After successful dedicated deployment

Write a new receipt under this recovery folder containing:
- dedicated project ID
- deployment ID
- production URL
- exact Git commit
- build-info hash summary
- test receipts
- medical freeze re-verification

Then update `00_START_HERE.md` to point to that receipt as the new deployment frontier.
