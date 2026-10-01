# RENAISSANCE READER OS 1.4 · Proof-Scaled Reading Replacement

Date: 2026-10-01
Branch: `renaissance/standalone-v1`
Implementation commit: `dadc51c061361fa28749641c79468530923c4585`

## Mission

Reader OS 1.4 is the Renaissance organ for replacing avoidable linear reading while preserving source sovereignty, exact evidence, primary experience, retrieval, transfer, and recoverability.

Its success condition is not “a summary exists.” It is: **the source has been safely metabolized into a smaller experience, the learner can reconstruct and use the important structure later, and the exact original remains available whenever compression is insufficient.**

## What may be replaced

Reader OS classifies by reading purpose.

- Informational nonfiction and textbooks can become `REPLACEMENT CANDIDATE` only after structural and retrieval gates pass.
- Research can become a candidate only with the same gates plus a bounded methods/numeric-evidence audit.
- High-stakes medical/legal/financial/actionable material stays `COMPRESS + EXACT CHECK`; compression is never authority.
- Literature, poetry, primary philosophy, and artistic text stays `BRIDGE, DO NOT REPLACE`. Orientation, commentary, retrieval, and secondary reading may be replaced; the language/form/voice itself remains primary experience.
- Any failed structural gate is `READ / RECOMPILE`.

## Reading formats

Current local ingestion:
- PDF
- EPUB
- DOCX
- TXT
- Markdown
- HTML
- CSV
- JSON
- RTF
- pasted text

Unknown formats fail loudly.

PDF.js and fflate are bundled locally. Reader OS has no normal source-upload path.

## Original-source preservation

The normalized text is retained in IndexedDB and identified by SHA-256.

When a file is uploaded, Reader OS also preserves the original file Blob if browser storage permits. It estimates free storage first and refuses an import rather than silently keeping a lossy partial source.

For PDFs, the exact original pages can be rendered locally from the stored Blob. This preserves figures, tables, equations, typography, and layout as source evidence even when the text compiler does not semantically reconstruct those objects.

EPUB and DOCX originals are preserved and downloadable. Their structured text is extracted locally; pixel-perfect rendering is not claimed.

Reader backups use `renaissance.reader-source/1`; the normalized-source hash is checked on restore.

## Extraction safety

- Scanned/image-only PDFs are detected by a text-yield floor and refused as fake extraction.
- ZIP64 is rejected by the local EPUB/DOCX path.
- ZIP central directory must reconcile.
- Maximum archive entry count: 5,000.
- Maximum expanded archive size: 220 MB.
- Suspicious compression ratio above 120x is blocked as possible ZIP bomb.
- HTML/script/style/noscript/svg/canvas content does not execute as source.
- Oversized sources are refused rather than truncated.

## Compression contract

The baseline compiler remains extractive.

It produces:
- structural source map;
- diverse exact-source claim sentences;
- concept vocabulary;
- contrast/limitation anchors;
- methods/numeric verification anchors;
- irreducible passages;
- exact-source search;
- lexical cross-source connection candidates;
- source hash and full-source escape hatch.

Generated claims are not presented as source claims.

## Deep retrieval

Reader OS combines cloze-style reconstruction with deeper prompts:
- argument reconstruction;
- evidence/method reconstruction;
- limitation/counter-position reconstruction;
- synthesis across major claims;
- changed-case transfer with explicit self-audit.

Every scored prompt keeps timestamped history and spaced scheduling.

## 1.4 proof-scaling law

The minimum retrieval set scales with source length:

- under 1,000 words: 6 prompts
- 1,000–4,999: 10 prompts
- 5,000–19,999: 16 prompts
- 20,000–49,999: 24 prompts
- 50,000+ words: 32 prompts

Long sources therefore cannot earn replacement status from an article-sized probe set.

The compiler expands its candidate claim pool and retrieval target as the proof floor rises. If a repetitive or weakly extractable source cannot support enough distinct grounded prompts, it must remain `READ / RECOMPILE`.

## Structural gate precedes mastery

A source can only move through mastery states if its structural `replacementVerdict.pass` is true.

If the compression/retrieval candidate fails its structural gates, even simulated perfect long-term answers produce:

`RECOMPILE BEFORE REPLACEMENT`

not `READING REPLACEMENT PROVEN`.

This closes the loophole where a tiny or structurally bad quiz could manufacture a perfect mastery score.

## Evidence lifecycle

For structurally eligible non-primary sources:

`NOT PROVEN → ACTIVE RETRIEVAL → PROVISIONAL → DURABLE → READING REPLACEMENT PROVEN`

Proof uses delayed evidence, overall accuracy, deep-prompt coverage, and deep-prompt accuracy.

For primary texts, the terminal label is:

`SECONDARY LAYER POSSESSED`

never “the work was replaced.”

## Hostile verification performed

The Reader engine was executed directly from the current branch source.

Observed:
- Reader OS internal doctor: green.
- Extractive-claim doctor: green.
- Research replacement gates: green.
- Primary-text boundary: `BRIDGE, DO NOT REPLACE`.
- Arabic source compilation: successful in prior 1.2/1.3 hostile harnesses.
- A 6,300-word synthetic source with only 10 viable prompts was blocked by the 16-prompt floor and remained `RECOMPILE BEFORE REPLACEMENT` despite simulated perfect 30-day retrieval.
- A richly structured 30,600-word source produced 29 prompts against a 24-prompt floor and could become a candidate.
- Primary-text simulated mature evidence terminated at `SECONDARY LAYER POSSESSED`, not full replacement.

These are software/invariant tests, not proof that Reader OS recreates every benefit of reading.

## Relationship to medical CNS and sealed Renaissance

Reader OS lives only on the standalone Renaissance branch.

It does not modify:
- medical CNS production;
- the 32 authored Renaissance baseline sessions;
- the preregistered 52-item sealed Renaissance battery.

Medical CNS production remains a frozen control boundary.

## Current frontiers

Reader OS deliberately does not claim:
- OCR for image-only/scanned sources;
- semantic understanding of every figure/table/equation;
- independent grading of open transfer answers;
- exact equivalence to every experiential benefit of reading;
- correctness beyond the supplied source.

The original visual PDF surface reduces figure/table amputation by preserving exact pages, but semantic reconstruction of those visuals remains a future frontier.

## Recovery law

For future Reader work:

1. refresh `renaissance/standalone-v1`;
2. read this file and `READER_OS_1_3.md`;
3. inspect current Reader source, build and live branch alias;
4. preserve donor/concurrent capabilities;
5. never weaken primary-text, exact-source, structural-gate, or proof-scaling laws merely to raise a dashboard score.
