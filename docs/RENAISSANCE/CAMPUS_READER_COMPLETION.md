# RENAISSANCE CAMPUS + READER OS COMPLETION RECEIPT

Date: 2026-10-01
Branch: `renaissance/standalone-v1`
Medical CNS production freeze: **PRESERVED**

## Mission

Create a standalone Renaissance site that:
1. preserves the complete authored Renaissance curriculum,
2. exposes all content through a Coursera-style course map,
3. keeps browsing separate from evidence-bearing study,
4. turns external reading into a source-preserving learning workflow,
5. does not modify the medical CNS production site,
6. never claims reading replacement merely because a source was uploaded or summarized.

## Renaissance Campus 1.1

Campus is a read-only curriculum browser over the canonical executable session objects.

Coverage invariant:
- 32 authored sessions
- 32 mapped exactly once
- 5 authored curriculum tracks
- dynamic sixth track for Reader OS sources
- 787 authored first-pass minutes

Tracks:
1. Cognitive Bootloader
2. Literature, Philosophy & Language
3. Mathematics, Science & Measurement
4. Art, Music, Film & Built Worlds
5. Civilisation & Social Intelligence
6. Reader OS Library, generated from local imported sources

Campus exposes:
- search and completion filters,
- track/session progress,
- title, hook, capability, stakes, connection,
- every authored step,
- questions and option explanations,
- passages and registered quotation text,
- challenge and deeper material,
- vocabulary,
- provenance/source records,
- prerequisites and session position,
- imported Reader library sources.

Browsing does **not** write mastery evidence.

The guarded Study-this-lesson path calls the canonical Renaissance engine. It:
- cannot bypass the 12-session bootloader,
- cannot bypass prerequisites,
- cannot counterfeit a second completion,
- preserves the ordinary life governor and evidence path.

Hostile queue proof:
- requesting `km2` before bootloader completion => blocked, next `commit`
- after bootloader, before `km1` => blocked on `km1`
- after `km1` => accepted

Campus doctor:
- 32 sessions
- 32 mapped
- no duplicate/missing session IDs
- Reader run integration required

## Reader OS 1.9

Reader OS is a local-first Reading Replacement Engine, not a summarizer.

Supported ingestion:
- searchable PDF
- scanned PDF through local OCR fallback
- EPUB
- DOCX
- TXT
- Markdown
- HTML
- CSV
- JSON
- RTF
- pasted text

Source sovereignty:
- IndexedDB local library
- extracted source SHA-256
- original binary retained when browser storage permits
- storage preflight prevents a lossy import
- explicit deletion only
- hash-verified Reader backup format
- backup explicitly omits original binary
- full extracted source always inspectable
- original PDFs rendered locally page-by-page
- exact-source evidence search
- no source-upload fetch/XHR/beacon primitive in Reader code

Archive safety:
- ZIP64 rejected in local EPUB/DOCX parser
- maximum internal entry count
- expanded-size ceiling
- suspicious expansion ratio rejected

## Reading replacement truth contract

A source is never "learned" because it was imported.

Structural/compiler gates include:
- full source retained,
- extractive claim policy,
- source map,
- top-content-vocabulary coverage,
- source-size-scaled retrieval floor,
- deep retrieval floor,
- research numeric/method audit where applicable.

Deep proof goes beyond cloze:
- argument reconstruction,
- evidence/method reconstruction,
- counter-position/limitation reconstruction,
- synthesis,
- transfer,
- committed written response before reveal.

Evidence lifecycle:
`NOT PROVEN → ACTIVE RETRIEVAL → PROVISIONAL → DURABLE → READING REPLACEMENT PROVEN`

Final proof requires delayed performance and does not occur on import.

Primary literature:
- always `BRIDGE, DO NOT REPLACE`
- may reach `SECONDARY LAYER POSSESSED`
- never claimed to have been replaced as an aesthetic/linguistic primary experience.

Figure/table/math-heavy sources:
- `ORIGINAL-WINDOW REQUIRED`
- text extraction alone cannot earn replacement proof.

High-stakes sources:
- compression is never authority,
- exact source remains the consequential-action reference.

## OCR

Pinned local stack:
- Tesseract.js 7.0.0
- English model package 1.0.0
- Arabic model package 1.0.0

OCR runs in the browser against pages rendered by the local PDF engine.
No source page is uploaded for OCR.

Scanned-PDF controls:
- automatically falls back from missing text layer to local OCR,
- >250-page scanned files must be split,
- too-sparse OCR fails rather than fabricating understanding,
- OCR output is tagged as OCR-derived,
- verdict becomes `OCR CHECK REQUIRED`,
- final replacement proof remains locked after otherwise-mature retrieval,
- user must inspect distinct preserved original PDF pages,
- up to three distinct pages are required,
- confirmation records timestamp + inspected pages,
- confirmation is explicitly a spot-check, not a character-perfect OCR certification.

Adversarial proof:
- mature OCR without original-page receipt => `OCR ORIGINAL CHECK REQUIRED`, score 0.82
- same mature evidence with receipt => `READING REPLACEMENT PROVEN`, score 1.00

## Reader behavioral doctor

The in-browser doctor currently checks:
- extractive claim invariants,
- research replacement gates,
- >=3 deep prompts,
- verification anchors,
- primary-text protection,
- visual-source protection,
- OCR trust classification,
- guided research sequence,
- guided primary sequence.

The Vercel build runs `tests/reader_os_test.js` before emitting the artifact.

## Standalone integrity sentinel

The standalone shell refuses green unless it finds:
- 32 sessions
- 287 steps
- 208 provenance records
- 96 authored retrieval hooks
- unique session/hook/step IDs
- valid prerequisite references
- 28 capability atoms
- 8 compounds
- 108 civilisation nodes
- 94 edges
- 52 sealed Renaissance probes
- 61 registered media/model/data objects
- canonical Renaissance APIs including guarded queue
- Reader OS 1.9 + doctor
- Campus 1.1 + doctor
- no medical CNS script leakage

## Sealed measurement integrity

The existing 52 Renaissance sealed items are unchanged.
Reader/Campus additions do not expose their hidden content.
Browsing a lesson does not count as learning evidence.

## Remaining empirical truth

"Controllable implementation complete" does not mean:
- every human benefit of reading is replaceable,
- every OCR character is correct,
- every figure/equation is semantically understood,
- Reader is equivalent to full reading for every source,
- human transformation is already proven.

Those remain empirical questions.

The system's design answer is conservative:
- compress what can be safely compressed,
- force original windows where compression is insufficient,
- preserve primary experience where the medium matters,
- prove retention/transfer over time before declaring replacement.

## Medical CNS freeze

No code in this branch should be promoted over the medical CNS production site.
Medical CNS remains the separate frozen exam system unless the founder explicitly orders otherwise.

## Recovery pointers

- `source/public/campus-v1.js`
- `source/public/campus-v1.css`
- `source/public/reader-v1.js`
- `source/public/reader-v1.css`
- `source/public/renaissance-v1.js`
- `source/public/renaissance-standalone.js`
- `source/public/renaissance-sw.js`
- `tests/reader_os_test.js`
- `deploy/vercel/build.mjs`
- `deploy/vercel/vercel.json`
- `docs/RENAISSANCE/READER_OS_1_3.md` remains historical doctrine lineage; this receipt supersedes its implementation snapshot while preserving its principles.
