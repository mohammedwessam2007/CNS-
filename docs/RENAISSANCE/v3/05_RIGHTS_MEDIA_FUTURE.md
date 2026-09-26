# v3 · 05 · Rights, media, provenance; UberBond, the exocortex, future interfaces, neural safety

§108–113, §134–139, §245–246. Code: `source/public/renaissance-media.js` (the registry), `renaissance-v1.js`
(`media()`, `sourceSheet()`, `speakable()`, `export`/`import`). Tests: M1, V1, V5, D1, D2, CO6.

## 1. Rights architecture (§134)

Self-contained never means copied. Every object in the app belongs to one of eight source classes:

| Class | Used for | Objects now |
|---|---|---|
| Public domain | Garnett's 1912 translation, Shelley, Beethoven's melody, van Helmont, Hooke's Latin, pre-1900 data (Semmelweis, Snow) | 16 |
| Short quotation | brief critical verdicts with full citation (Freud, Nabokov) and a modern translation of Euler's letter | 3 |
| Transformative original explanation | every figure, model and data chart drawn by the project, and the project's own teaching numbers, labelled as such | 50 |
| Creative Commons | — (no CC object is needed yet; the class exists for images and recordings when they come) | 0 |
| Open access | — (research papers are cited, not reproduced) | 0 |
| Licensed | — (nothing licensed; painting, sculpture and recorded performance wait for this class) | 0 |
| User-owned | — (his own notes and department files stay in the CNS organ, behind his key) | 0 |
| Lawful embed | — (nothing embedded: the organ makes no network requests, CO6) | 0 |

## 2. Provenance (§135) and the media registry (§138–139)

Every source object records author, work, date, edition, translation, source, rights, the claim it supports, how
confident the record is, and whether it is contested (quotations: the full record in the quote register; factual
claims: provenance entries with a grade). `RENAISSANCE.media()` joins them into one registry of 69 objects, each
with its §138 type, rights class, source, the steps that use it, and the thinking it does:

| Type | Objects | Type | Objects |
|---|---|---|---|
| diagram | 12 | primary document | 14 |
| interactive | 24 | text | 3 |
| data | 7 | music | 3 |
| map | 2 | audio | 1 |
| image | 2 | timeline | 1 |

Video, animation and 3D have no objects yet. A visual must do cognitive work (§139): an entry with no stated job, a
job in decorative language, or no step using it fails M1. Every figure has an accessible name.

## 3. UberBond coupling (§108–110)

Renaissance is the organ that changes the human; UberBond is the organ that amplifies him outside. The loop:
Renaissance improves him → he improves UberBond → UberBond researches, tests and builds → reality returns evidence →
Renaissance metabolises the evidence → he improves faster.

**Capability donation (§109)**, internalised where useful, not duplicated:

| UberBond idea | Where it lives in Renaissance |
|---|---|
| Personal civilisation, one-person university, one-person Renaissance | the organ itself; the civilisation graph |
| Human capability genome | `renaissance-genome.js` and `genome()` |
| Experience compiler | the session compiler and the masterpiece compiler |
| Representation singularity | competing representations and the L1 trial |
| Unknown-unknown observatory, serendipity machine | the compiler's unfamiliar pick; weekly unknown problems |
| Possibility graph, future-self systems | the commit session (designing for the future self); the possibility protocol (empirical) |
| Barrier destroyer | bridges on demand; the vocabulary firewall |
| Life compression | the dose, the stop rule, no backlog |
| Forecasting | real-world forecasts scored later (F1) |
| Memory | returning ideas and assimilation |
| Invention, research engines | forges; the registry and its tournaments (author side) |
| Self-improvement | trials L1–L14 |
| Skill teleporter | not internalised: skills are not transferable by the machine, only trained |

**The two-way question (§110):** for every UberBond capability, can it become his? (forecasting: yes, it is trained
and scored; exact retrieval: no, and it should not be). For every human capability, can UberBond amplify it?
(judgment: it can supply evidence and receipts, never the decision).

## 4. Exocortex (§111)

The human keeps disproportionately: judgment, deep models, values, taste, intuition, questions, creative synthesis.
UberBond keeps disproportionately: search, exact retrieval, large comparison, receipts, detail memory, monitoring,
routine computation, automation. Renaissance trains only the first list; it never drills what the second list does
better (no memorising dates, §227).

## 5. Future interfaces (§112, §245)

The core is device-independent now: the whole record is one JSON file (`renaissance.state/1`) that moves between
devices and merges (D1); every step can be read aloud as plain speech, question and lettered options, for earbuds or
a screen reader (D2); listening is synthesised on the device. Glasses, haptics, gaze and gesture would be new front
ends over the same step objects. Non-invasive signals (attention, fatigue) would enter only as inputs to the
existing trials, judged like any other arm.

## 6. Neural safety constitution (§113)

No invasive interface is adopted because it is futuristic. Adoption requires strong human safety evidence, long-term
data, reversibility where possible, security, privacy, regulatory oversight, and a clear benefit over non-invasive
alternatives, and the non-invasive approximation is tried first. Nothing in this system reads or writes any neural
signal.

## 7. Provider neutrality (§246)

Frontier models are suppliers; the architecture is the system. The organ runs with no model at runtime: content is
authored, checked and shipped as static files, and no Renaissance file calls a network or names a model supplier
(CO6). A better model changes how content is written and checked, not how the app works.
