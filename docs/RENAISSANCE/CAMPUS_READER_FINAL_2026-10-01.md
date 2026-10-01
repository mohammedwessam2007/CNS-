# RENAISSANCE CAMPUS + READER OS · FINAL RECEIPT · 2026-10-01

## Freeze boundary

The medical CNS production surface remains outside this mission.

Verified after the Campus/Reader deployment:
- URL: `https://intellectuality-cns.vercel.app/`
- HTTP 200
- title: `INTELLECTUALITY CNS v18.6 · MCQ EXAM`
- Reader OS script absent
- Campus script absent
- medical MCQ marker present

Canonical frozen medical source remains commit:
`622bcb169bf495289c5bc1dde072d02677667f6e`

No production promotion, alias mutation, medical-source edit, environment mutation, or medical build-setting mutation was performed by the Renaissance mission.

## Renaissance standalone

Branch:
`renaissance/standalone-v1`

Stable branch URL:
`https://intellectuality-cns-git-ren-81d684-mohammedwessam2007s-projects.vercel.app`

Verified application build before this receipt:
- Git commit: `bdd1a8d3ca813698dc7b1c89904c3c2176449307`
- Vercel deployment: `dpl_9jTwtpfRGD3eCBfa21WGPxdMNCSU`
- state: READY
- target: preview / null
- mode: `standalone+reader-os+campus`
- integrity-tracked build assets: 257
- total deployed bytes: 58,914,447

The receipt-only commit that contains this document may produce a later preview with the same application bytes except generated build metadata.

## Physical isolation

The live Renaissance artifact serves Campus + Reader and does not contain the medical application.

Verified HTTP 200:
- `/`
- `/campus-v1.js`
- `/campus-v1.css`
- `/reader-v1.js`
- `/build-info.json`
- local PDF runtime
- local Tesseract.js runtime and worker
- local English traineddata
- local Arabic traineddata

Verified HTTP 404:
- `/mcq-v16.js`
- `/learn-v15.js`
- `/cns-atlas-v17.js`
- `/dept/cns-level-1.jpg`

## Renaissance Campus 1.1

Campus is the Coursera-style navigation organ for the authored curriculum.

It maps exactly 32 / 32 authored sessions once each, grouped into five authored tracks:
1. Cognitive Bootloader
2. Literature, Philosophy & Language
3. Mathematics, Science & Measurement
4. Art, Music, Film & Built Worlds
5. Civilisation & Social Intelligence

A sixth dynamic shelf exposes the device-local Reader OS library.

Campus Browse mode is intentionally read-only. Browsing a future lesson does not create mastery evidence, complete a session, alter sealed probes, or counterfeit adaptation.

Campus exposes:
- search and completion filters;
- progress by track;
- all session titles, minutes, domains and states;
- every authored lesson step in a readable course view;
- questions/options/explanations as non-scoring browse content;
- registered primary passages;
- challenge and deeper cards;
- vocabulary and authored language helpers;
- provenance/source records;
- prerequisite and curriculum position;
- Reader OS sources as a dynamic course shelf.

Interactive models remain evidence-bearing in Study mode where required.

### Guarded direct lesson access

Campus can queue an eligible lesson into the real Renaissance Study engine.

Verified hostile behavior:
- attempting `km2` before the fixed bootloader is complete -> blocked, next = `commit`;
- after bootloader but without `km1` -> blocked on prerequisite `km1`;
- after `km1` -> `km2` queues successfully.

Completed sessions cannot be counterfeited into a second completion.

Campus doctor:
- version: 1.1
- sessions: 32
- mapped: 32
- tracks: 5
- Reader run integration: present
- failures: 0

## Reader OS 1.9

Reader OS is a local-first reading replacement engine, not a summarizer.

Supported ingestion:
- searchable PDF;
- scanned PDF through local OCR fallback;
- EPUB;
- DOCX;
- TXT / Markdown / HTML / CSV / JSON / RTF;
- pasted text.

The original source binary is preserved when storage permits. Extracted text is SHA-256 identified. Imported Reader backups are hash checked.

### Reading replacement protocol

Reader can construct:
- structural map;
- extractive claim capsule;
- exact verification anchors;
- method/numeric/result anchors;
- limitations and counterpositions;
- irreducible primary passages;
- concept vocabulary;
- exact-source evidence search;
- cross-source overlap candidates;
- cloze retrieval;
- argument reconstruction;
- evidence/method reconstruction;
- counter-position reconstruction;
- synthesis prompts;
- transfer prompts;
- delayed retrieval schedule.

The guided one-door flow selects the safe order for each source rather than presenting a pile of tabs.

### Truth states

Reading is not marked replaced on upload or on first-pass compression.

Evidence states include:
- NOT PROVEN
- ACTIVE RETRIEVAL
- PROVISIONAL
- DURABLE
- READING REPLACEMENT PROVEN

Primary literature ends at secondary-layer possession rather than a false claim that the work itself was replaced.

High visual/table/math dependence produces `ORIGINAL-WINDOW REQUIRED`.

Primary text produces `BRIDGE, DO NOT REPLACE`.

Research retains exact verification requirements.

### OCR

Scanned PDFs fall back to local Tesseract.js using local English + Arabic models. Source pages do not leave the browser.

OCR-derived text is explicitly tagged:
`OCR CHECK REQUIRED`.

A mature OCR source cannot reach final replacement proof until the preserved original PDF has been spot-checked.

The human spot-check requires up to three distinct original pages (all pages when the source has fewer than three), records which pages were inspected, and stores a timestamped verification receipt.

Adversarial test:
- OCR source + mature perfect retrieval + no original check => `OCR ORIGINAL CHECK REQUIRED`, score 0.82.
- same mature evidence + recorded original-page verification => may reach `READING REPLACEMENT PROVEN`.

The spot-check is not represented as character-perfect OCR certification.

### Local parser / archive safety

- ZIP entry ceiling;
- decompressed-size ceiling;
- suspicious expansion-ratio block;
- ZIP64 rejection in current local parser;
- oversized source ceiling;
- scanned OCR page limit for device safety;
- unknown formats fail loudly;
- no silent truncation.

### Behavioral doctor

Reader 1.9 doctor: PASS.

Current doctor metrics:
- extractive claims preserved;
- deep prompts present;
- verification anchors present;
- research candidate behavior correct;
- primary-text bridge behavior correct;
- visual source original-window behavior correct;
- OCR source trust-gate behavior correct;
- guided research sequence correct.

Vercel build is gated by `tests/reader_os_test.js` before static artifact creation.

The hostile test also locks the historical OCR detector regression:
mature OCR cannot become `READING REPLACEMENT PROVEN` before original-page verification.

## Canonical authored curriculum invariants

The standalone fail-closed sentinel still checks:
- 32 sessions
- 287 authored steps
- 208 provenance records
- 96 retrieval hooks
- 28 capability atoms
- 8 capability compounds
- 108 civilisation nodes
- 94 civilisation edges
- 52 sealed measurement items
- required engine APIs
- Reader behavioral doctor
- Campus doctor
- absence of medical-script leakage

The 52 sealed items were not opened or modified by this work.

## Remaining epistemic boundary

This is not a claim that software can replace every human reason for reading.

Reader OS is designed to replace avoidable linear reading where the goal is information, explanation, models, judgment or later usable knowledge.

It deliberately preserves:
- exact high-stakes claims;
- source methods/results where consequential;
- visually dependent evidence;
- mathematical notation when generic extraction is unsafe;
- literary language/form/voice;
- primary experience where compression would destroy the object.

The system's strongest human-outcome claims remain empirical and require real longitudinal use.

## Recovery law

Future Renaissance work should start from:
1. this receipt;
2. exact current branch source;
3. live branch build-info;
4. Reader/Campus doctors and hostile gate;
5. the medical freeze check.

Never rebuild the Campus or Reader from a stale summary when the exact source is available.
