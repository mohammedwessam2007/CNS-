# Renaissance · 10 · The masterpiece compiler and the Brothers Karamazov prototype

§9–14, §145–146, §217, §222–225, §268–270 of the ABSOLUTE COMPLETION mission. Code: `source/public/renaissance-s3a.js`
(the Karamazov track and *Ozymandias*), `renaissance-v1.js` (passages, the quotation record, the possession ladder,
reading-speed evidence). Tests: `tests/renaissance_v3_test.js` V1, V5, V6, V9, L4, P5, S1–S2.

## 1. What the compiler does

**Input:** a major work. **Output:** the smallest experience after which the reader *possesses* it: can place it,
knows its structure and primary material, knows the arguments and the criticism, can discuss it, quote it in context,
compare it and use it (the twelve rungs, `v3/01_POSSESSION.md`).

Books are not uniformly compressible (§10). For each part of a work the compiler asks one question, **what would a
summary of this part lose?**, and gives one of four answers:

| Disposition | When | What the reader gets |
|---|---|---|
| **Read whole** | the meaning lives in a voice (a confession, an argument, a sermon, a poem) and any summary deletes it | the chapter itself, in the session or as a named reading for the week |
| **Read passages** | a few pages carry the part: one speech, one gesture, one first sentence | the passage in a verified public-domain translation, with its full quotation record |
| **Bridge** | the reader needs the events, not the experience of them | a map, a model or a problem (the family map, the trial as a jury's arithmetic) |
| **Do not read** | nothing in it is irreducible for this reader now | nothing; the compile map says so, so no guilt attaches (§117) |

There is no target percentage. The target is the most possession for the fewest minutes of his life.

## 2. The Brothers Karamazov (§11, §268)

Chosen as the hard benchmark because it is long, dense with characters and arguments, famous for passages no summary
survives, and heavily misquoted.

**The compile map** (the `compileMap` figure in session km1):

| Part | Disposition | Where |
|---|---|---|
| Book V ch. 4–5 (Rebellion, The Grand Inquisitor) | read whole (named reading, "Read it whole this week") | km2; passages *The ticket*, *Miracle, mystery and authority* |
| Book VII ch. 3–4 (An Onion, Cana of Galilee) | read whole (named reading) | km1 compile map |
| Epilogue, last chapter | read whole (named reading) | km3 deeper card, quotation *Hurrah for Karamazov!* |
| Book I ch. 1 (first sentence); Book II ch. 2 and 6; Book V ch. 4–5 (ends); Book VI ch. 1; Book XI ch. 4 | read passages | six passage steps in km1–km3 carrying eight Garnett passages; three more lines (Book III ch. 3, Book VI ch. 3, the Epilogue) are cited where they are discussed |
| The family, the money, the love triangle | bridge: family map + *Switch the lines on* model | km1 |
| The murder night and the trial (Books VIII–IX, XII) | bridge: the trial as a problem he solves before learning the verdict | km3 (deep, weekend) |
| The rest | not read now | stated on the map |

**The three sessions** (possession rungs earned by each step in brackets):

- **km1 · The Karamazovs** (27 min): which parts deserve hours [context] → the compile map → the first sentence
  [primary] → why announce the death first [structure] → the family map and the model of its forces → the elder's
  two lines [primary] → two chroniclers a century apart, García Márquez [compare] → the misquotation at dinner
  [quote] → a doctor who starts with the ending [apply] → forge: a compile plan for a book he keeps postponing.
- **km2 · Rebellion and the Grand Inquisitor** (28 min): what Ivan concludes [argument] → the ticket [primary] → the
  poem inside the novel → how Christ answers [structure] → the three powers and the kiss [primary] → the argument as
  four premises, switched off one at a time → the Inquisitor and the 1961 physicians' survey [compare] → a hospital
  rule [apply] → the line Dostoevsky never wrote [quote] → forge: his rule for telling patients the truth.
- **km3 · A judicial error** (33 min, deep, weekend only): the court's evidence → three unlabelled problems on the
  door, the envelope and the portrait [argument] → the jury's arithmetic (likelihood ratios) → what the reader knows
  → the idea that travelled [primary] → Ivan and Henry II [compare] → chest pain and a bank's slogan (far transfer) →
  **two verdicts, Freud and Nabokov [criticism]** → **the conversation about Nabokov's verdict [discuss]** → forge: a
  rule against a judicial error.

## 3. Masterpiece experience quality (§217), checked by test V9

| Element | Where | Test |
|---|---|---|
| Primary material where lawful | eight passages in six steps, Garnett (1912, public domain) | V5, V9 |
| Narrative / structural map | `compileMap` | V9 |
| Character or idea graph | `familyMap` + `relations` model; `argument` model | V9 |
| Vocabulary support | nine terms, each with plain idea, Egyptian-Arabic hook, technical definition | R20, V9 |
| Context | k1, k5b (Optina, 1878–80, the author's son) | V9 |
| Criticism | t12 two verdicts; km1 deeper card | V9 |
| Quotations | thirteen registered records with misattribution notes (eleven from the novel, two critics) | V1, V5, M1 |
| Transfer | k9, k10, g8, g9, t9, t10, t13 | V9 |
| Discussion simulation | t13 (continue a real disagreement at dinner) | V9 |
| Memory | three hooks per session at 1, 7 and 30 days | V9 |
| Reader-Turing evaluation | twelve sealed questions, 30 days after km3 | P5, S1, S2, V9 |

## 4. The Reader Turing test (§12, §146)

Goal: a serious reader could talk with him about the book at length without finding the gap. Instrument: twelve
sealed reader questions (`RT01`–`RT12`) about the novel, pre-registered by SHA-256 on 2026-09-26
(`docs/RENAISSANCE/sealed/preregistration.json`), opened only 30 days after km3 ends, answered without help and
without feedback. Possession rung 12 ("culturally possesses") needs at least eight of them answered at 75% or better.

Honest limits, stated where the items live (`sealed/README.md`): the items and the lessons were written in the same
build by the same author. What prevents leakage is not separation of people but mechanism: items are obfuscated in
the shipped file, no six-word run of any item appears anywhere in the lessons, hooks, visuals, models or quotation
register (test S2), and edits after registration fail S1. A human reader-examiner is the stronger test and is listed
in the empirical queue.

## 5. The quote engine (§13, §229)

Every quotation lives once, in the season's quote register, with: exact words, speaker, work and place, author,
translator and year, edition where known, the scene it comes from, what it means, why it matters, the risk that it is
misattributed, the rights class, and **how the wording was checked**. SHOW SOURCE opens the whole record. Steps cite
quotations by id, so a misquotation cannot be introduced by retyping. Examples of what the register corrected:

- "Beauty will save the world" is not in this novel; it is in *The Idiot*, as a mocking question to the prince.
- "If God does not exist, everything is permitted" is not in the novel. Garnett's words are "everything would be
  lawful" (Miusov reporting Ivan) and "All things are lawful then" (Dmitri); Sartre popularised the other wording.
- Ivan "returns the ticket"; translations differ ("entrance ticket").

**Verification method and its limit.** Full texts of the Garnett translation could not be fetched from this build
machine (egress blocked for Standard Ebooks, CCEL and Project Gutenberg). Each quotation was instead checked by
exact-phrase web search across several independent copies of the Garnett text; the record says so. A scan comparison
remains to be done when a lawful copy is reachable.

## 6. Generalising beyond Dostoevsky (§269–270)

The compiler was run on works unlike a Russian novel:

- **A 14-line poem** (Shelley, *Ozymandias*, 1818): disposition *read whole* (nothing in it survives summary); the
  session reads it by voice (traveller, sculptor, king, poet), then compares it with Horace Smith's sonnet written in
  the same competition.
- **A visual method** (Hankin's polygons-in-contact reading of girih patterns): the "primary material" is the rule,
  drawn live, not a copied image.
- **A melody** (the first two phrases of *Ode to Joy*): heard, synthesised from exact pitches, then its cadences.
- **A building principle** (Hooke's hanging chain, Gaudí's hanging models) and **film grammar** (the 180-degree line).

Each uses the same four dispositions; the difference is only what counts as primary material in that medium.

## 7. Machine effort asymmetry (§222–223)

The machine read the book's structure, chose the parts, checked every quotation against multiple copies, traced two
famous misquotations to their real sources, wrote the model of the trial, and built the sealed questions. The human
receives 88 minutes of sessions, three chapters to read whole, and one record per quotation.

## 8. What is not claimed

That 88 minutes plus three chapters equals reading the novel. §145 asks for the comparison with full unabridged
reading under fair conditions; it is in the empirical queue (`completion/EMPIRICAL_QUEUE.md`, `e-bench`, `e-rt`).
