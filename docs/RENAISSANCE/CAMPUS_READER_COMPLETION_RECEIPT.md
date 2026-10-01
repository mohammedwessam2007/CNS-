# RENAISSANCE CAMPUS + READER OS · Completion Receipt

Date: 2026-10-01  
Branch: `renaissance/standalone-v1`  
Medical production base: `622bcb169bf495289c5bc1dde072d02677667f6e`

## Freeze boundary

The medical CNS production branch, production Vercel target, medical assets, curriculum engine and production alias are outside this branch's write boundary. Standalone work is preview-only and may not be promoted over `intellectuality-cns.vercel.app`.

## Renaissance Campus 1.1

The standalone site now has a Coursera-style read-only course map over the complete authored Renaissance baseline.

Five authored tracks map all 32 sessions exactly once:

1. Cognitive Bootloader — 12 sessions.
2. Literature, Philosophy & Language — 5.
3. Mathematics, Science & Measurement — 6.
4. Art, Music, Film & Built Worlds — 5.
5. Civilisation & Social Intelligence — 4.

A sixth dynamic track exposes locally imported Reader OS sources.

Campus supports:
- searchable/filterable curriculum;
- progress and track minutes;
- adaptive compiler pick;
- lesson overview/capability/stakes/connection;
- every authored step;
- questions and explicit answer reveal;
- contrasts/cases;
- primary passages;
- model instructions;
- challenge/deeper material;
- vocabulary;
- provenance;
- prerequisite map;
- Reader-library integration.

Browse mode is read-only and writes no mastery evidence.

`STUDY THIS LESSON` uses a guarded engine queue:
- bootloader order cannot be bypassed;
- explicit prerequisites cannot be bypassed;
- completed lessons cannot counterfeit another completion;
- eligible lessons open in the canonical evidence-bearing player.

Campus doctor requires 32 sessions, 32 mapped IDs, zero duplicates/missing IDs, five authored tracks and a working Reader `run` bridge.

`tests/campus_test.js` is a build-blocking invariant gate.

## Reader OS 1.9

Reader OS is a local-first source-to-possession engine, not a summarizer.

Supported ingestion:
- searchable PDF;
- scanned PDF through local OCR;
- EPUB;
- DOCX;
- TXT/Markdown/HTML/CSV/JSON/RTF;
- pasted text;
- hash-verified Reader backups.

Sovereignty and provenance:
- IndexedDB local library;
- SHA-256 identity;
- normalized source retained;
- original uploaded binary retained when browser storage allows;
- explicit delete;
- local PDF page rendering;
- exact-source evidence search;
- local parsing/OCR assets;
- no source-upload primitive in Reader OS.

Reading replacement pipeline:
`MAP → COMPRESS → VERIFY → ORIGINAL when required → IRREDUCIBLE → PROVE IT`.

The compiler preserves:
- structural map;
- extractive source sentences;
- top concept vocabulary;
- limitation/counter-position anchors;
- methods/numeric/figure/table/equation verification anchors;
- irreducible passages;
- cross-source overlap candidates without claiming agreement.

Retrieval includes:
- cloze;
- argument reconstruction;
- evidence/method reconstruction;
- limitation/counter-position reconstruction;
- synthesis;
- transfer.

Deep prompts require a committed free response before reveal. Probe floors scale with source size.

Evidence lifecycle:
`NOT PROVEN → ACTIVE RETRIEVAL → PROVISIONAL → DURABLE → READING REPLACEMENT PROVEN`.

Primary literature ends at `SECONDARY LAYER POSSESSED`, never a claim that the work itself was replaced.

Visual/math-heavy sources remain `ORIGINAL-WINDOW REQUIRED` because generic text extraction cannot replace figures, tables or mathematical notation.

## Scanned PDF / OCR law

Scanned PDFs fall back to a fully local English + Arabic OCR path using pinned Tesseract.js assets.

OCR output is tagged at page level and receives `OCR CHECK REQUIRED`.

OCR-derived material cannot reach final `READING REPLACEMENT PROVEN` solely through excellent delayed retrieval.

For the final OCR trust lock to clear:
- original PDF must be preserved;
- at least three distinct original pages must be inspected, or every page for a shorter document;
- the learner explicitly confirms a spot-check against those preserved pages;
- the receipt stores timestamp and inspected page numbers.

The receipt is a spot-check, not a claim of character-perfect OCR.

A hostile test proved the intended invariant:
- mature OCR + perfect delayed retrieval + no original check → `OCR ORIGINAL CHECK REQUIRED`, capped below final proof;
- same mature record + explicit verification receipt → eligible for `READING REPLACEMENT PROVEN`.

## Mandatory build gates

Vercel build command runs:
1. `tests/reader_os_test.js`
2. `tests/campus_test.js`
3. standalone build

Reader hostile gate checks:
- Reader version;
- behavioral doctor;
- extractive claims;
- deep prompts;
- research gates;
- primary-text protection;
- visual/notation protection;
- button-only deep prompts cannot prove replacement;
- delayed mature research can prove;
- primary-text mature state remains secondary possession;
- OCR classification/trust lock;
- no source-upload primitive;
- no medical-asset dependency;
- OCR dependencies/runtime are local and pinned.

Campus gate checks:
- Campus 1.1;
- 32/32 mapping;
- five tracks;
- unique IDs;
- fixed bootloader map;
- Reader run integration;
- no medical-asset dependency.

Client integrity sentinel additionally requires:
- 32 sessions;
- 287 steps;
- 208 provenance records;
- 96 retrieval hooks;
- 28 atoms;
- 8 compounds;
- civilisation graph 108 nodes / 94 edges;
- 52 sealed probes;
- media registry;
- required engine APIs including guarded queue;
- Reader OS 1.9 doctor;
- Campus 1.1 doctor;
- zero medical script leakage.

## Measurement integrity

The preregistered 52-item Renaissance battery remains unchanged and sealed.

Reader OS evidence is separate from the baseline sealed battery and cannot rewrite historical empirical results.

## Truth boundary

Implemented software architecture is not proof that Reader OS reproduces every benefit of full reading.

The empirical frontier remains equal-time testing of:
- source reading;
- Reader OS;
- summaries;
- other learning methods;

measured on immediate understanding, delayed recall, transfer, judgment, primary-text sensitivity and time cost.

No architecture label may silently upgrade that future evidence into a completed empirical claim.
