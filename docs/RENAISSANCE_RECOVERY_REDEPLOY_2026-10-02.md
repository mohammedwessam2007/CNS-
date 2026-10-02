# Renaissance Recovery + Redeploy Trigger · 2026-10-02

Purpose: recover the post-crash Renaissance frontier without changing executable source.

Recovered authoritative branch head before this trigger:
- branch: `renaissance/standalone-v1`
- head: `40903e239f7267456e4bcbc40fec972307d4eb17`
- head message: `renaissance standalone: record final Reader 2.0 Campus 1.2 receipt`

Executable authority remains the frozen Reader OS 2.0 / Campus 1.2 lineage described by:
- `docs/RENAISSANCE/FINAL_STANDALONE_COMPLETION_2026-10-01.md`
- `docs/RENAISSANCE/CAMPUS_READER_FINAL_2026-10-01.md`
- `docs/RENAISSANCE_FINAL_RECEIPT_2026-10-02.md`

Recovered current organism:
- Renaissance Core: 32 sessions / 287 steps / 208 provenance / 96 hooks / 28 atoms / 8 compounds / 108 civilisation nodes / 94 edges / 52 sealed probes.
- Reader OS 2.0: searchable PDF; scanned PDF with local English+Arabic OCR; EPUB; DOCX; text/Markdown/HTML/CSV/JSON/RTF; pasted text; original binary preservation where possible; SHA-256 identity; source map; extractive claim capsule; verification anchors; original-page verification; visual/table/math protection; primary-text bridge law; deep retrieval; delayed proof.
- Reader evidence lifecycle: NOT PROVEN → ACTIVE RETRIEVAL → PROVISIONAL → DURABLE → READING REPLACEMENT PROVEN.
- OCR authority is SHA-bound to the preserved original file and cannot reach final proof without original-page spot-check receipt.
- Campus 1.2: exact 32/32 authored session map; five authored tracks plus Reader library; browse mode read-only; guarded direct study; bootloader/prerequisite/completion protections; 96/96 hooks exposed.
- Mandatory Vercel gates: Reader hostile test → Campus test → static standalone build.
- Artifact isolation law: Renaissance assets only; medical MCQ/learn/atlas/department assets must not be emitted.

Medical freeze boundary:
- project: `intellectuality-cns`
- production alias: `https://intellectuality-cns.vercel.app`
- frozen medical lineage: `622bcb169bf495289c5bc1dde072d02677667f6e`
- this recovery does not merge, promote, mutate medical source, mutate medical env, change production settings, or touch the medical alias.

Last verified Renaissance deployment before this recovery:
- URL: `https://intellectuality-cns-git-ren-81d684-mohammedwessam2007s-projects.vercel.app`
- deployment: `dpl_H9T5gZWqbhT5ANZtk5EwAfYW7RDC`
- commit: `1261fd75bfdce4b4eeda6d63aada2e6b6c55eb4c`
- state: READY
- target: preview/null
- build-info: 257 integrity-tracked assets / 58,918,637 bytes.

This file is docs-only. It intentionally changes no files under `source/`, `tests/`, or `deploy/`.
Its only operational purpose is to create a fresh Git-triggered Renaissance preview from the already frozen executable tree after chat UI recovery.

Terminal verification required for the deployment created from this commit:
1. Vercel state READY.
2. `build-info.json` reports this commit.
3. Reader OS 2.0 and Campus 1.2 assets return HTTP 200.
4. Local OCR assets return HTTP 200.
5. medical-only assets return HTTP 404 on the Renaissance URL.
6. medical production still serves CNS v18.6 and contains no Reader/Campus markers.


## Recovery terminal verification

Recovered live standalone deployment:
- deployment: `dpl_BbREsA3ZngMHA1mfszoU127K611R`
- Vercel state: `READY`
- Git commit: `40903e239f7267456e4bcbc40fec972307d4eb17`
- source branch: `renaissance/standalone-v1`
- stable alias: `https://intellectuality-cns-git-ren-81d684-mohammedwessam2007s-projects.vercel.app`
- region: `fra1`
- target: preview / null
- alias error: none

Live `build-info.json`:
- app: `RENAISSANCE · INTELLECTUALITY`
- mode: `standalone+reader-os+campus`
- commit: `40903e239f7267456e4bcbc40fec972307d4eb17`
- branch: `renaissance/standalone-v1`
- integrity assets: 257
- bytes: 58,918,637
- medical leak keys: 0

Live HTTP verification:
- Renaissance home: 200, title `RENAISSANCE · INTELLECTUALITY`
- Reader asset: 200
- Campus asset: 200
- local PDF.js: 200
- local Tesseract runtime: 200
- local Tesseract worker: 200
- English traineddata: 200
- Arabic traineddata: 200
- Tesseract core WASM: 200
- `/mcq-v16.js`: 404
- `/learn-v15.js`: 404
- `/cns-atlas-v17.js`: 404

Medical production re-verified after recovery:
- `https://intellectuality-cns.vercel.app/`: 200
- title: `INTELLECTUALITY CNS v18.6 · MCQ EXAM`
- Reader marker: absent
- Campus marker: absent
- medical MCQ marker: present

The fresh recovery-trigger commit `ff730ad8f3cc0c09c015c19a7e4e5ea70dbc18cf` was not built because Vercel returned:
`Deployment rate limited — retry in 24 hours.`
This is an external free-plan preview build quota, not a source/test failure. It does not invalidate the already READY `40903e...` standalone deployment.

## Namespace truth

The Renaissance site is a physically isolated preview deployment and stable branch alias. It currently lives under the same Vercel project object as the medical app, but it is **not** the medical production deployment and is **not** promoted to the production alias.

Future work must preserve this distinction:
- medical production alias remains CNS-only;
- Renaissance stable alias remains standalone-only;
- no promotion of Renaissance onto `intellectuality-cns.vercel.app`;
- if a dedicated second Vercel project is later connected, migrate the already-frozen standalone artifact there without changing the medical project.


## Final recovered deployment · 2026-10-02

A later docs-only descendant successfully cleared Vercel after the earlier rate-limit event.

Canonical recovered standalone deployment:
- deployment: `dpl_2NcgenexHQQoeK1ZjLzB2dp9PtN7`
- state: `READY`
- target: preview / null
- branch: `renaissance/standalone-v1`
- deployment commit: `0c9a9ca4c239c27b9aa4b1fce7a8ecfd113fbecd`
- direct deployment URL: `https://intellectuality-7jpe9x6wa-mohammedwessam2007s-projects.vercel.app`
- stable Renaissance branch URL: `https://intellectuality-cns-git-ren-81d684-mohammedwessam2007s-projects.vercel.app`

The deployment commit changes only this recovery receipt lineage and does not alter executable `source/`, `tests/`, or `deploy/` content relative to the frozen Reader OS 2.0 / Campus 1.2 executable frontier.

Live build-info at terminal verification:
- mode: `standalone+reader-os+campus`
- build commit: `0c9a9ca4c239c27b9aa4b1fce7a8ecfd113fbecd`
- 257 integrity-hashed assets
- 58,918,637 bytes
- Reader OS: 2.0
- Campus: 1.2
- OCR-related emitted assets: 33
- medical leak keys: 0

Live verified HTTP 200:
- Reader OS
- Campus
- standalone shell
- PDF.js
- Tesseract runtime
- Tesseract worker
- English traineddata
- Arabic traineddata
- Tesseract core WASM
- build-info

Live verified HTTP 404 on Renaissance:
- `/mcq-v16.js`
- `/learn-v15.js`
- `/cns-atlas-v17.js`

Medical production was re-fetched after this recovered deployment:
- HTTP 200
- title `INTELLECTUALITY CNS v18.6 · MCQ EXAM`
- medical marker present
- Reader marker absent
- Campus marker absent

Namespace boundary remains truthful:
- Renaissance is a separate physical deployment/artifact/URL.
- It still belongs to the existing Vercel project object because the connected Vercel write surface exposes no project-targeted deployment/link mutation.
- Dormant project `intellectuality-holiday-renaissance` exists with zero deployments.
- Do not invoke the generic untargeted Vercel deploy operation merely to force project-object separation; protecting CNS production has higher authority.
