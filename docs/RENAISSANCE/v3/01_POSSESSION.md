# v3 · 01 · Cultural possession: the ladder, the graph, quotations, primary experience, conflict and texture

§8, §12–15, §135–137, §162, §204, §210, §227–229, §236–238. Code: `renaissance-v1.js` (`LADDER`, `RUNG`,
`possession()`, `passageView()`, `sourceSheet()`, `AUDIO`), `renaissance-civ.js` (the civilisation graph),
`renaissance-s3a.js` (the quote register). Tests: V1, V2, V5, V6, V9, V10, V11, L4.

## 1. The possession ladder (§8, §162)

Familiarity is recognising a name. Possession is being able to do something with the work. The ladder has twelve
rungs; each rung is earned only by evidence, and a rung counts only if every rung below it is earned (test L4):

| # | Rung | Earned by |
|---|---|---|
| 1 | heard of | a session names the work |
| 2 | recognises | a session about it was started |
| 3 | knows the basic context | a right answer on a step marked `context` |
| 4 | knows the structure | a right answer on a `structure` step |
| 5 | knows primary material | a passage read at reading speed (no faster than 300 words a minute), or a right `primary` answer |
| 6 | knows the arguments | a right `argument` answer |
| 7 | knows the criticism | a right answer on a `criticism` step (t12: Freud and Nabokov) |
| 8 | can discuss | a right answer on a `discuss` step (t13: continuing a disagreement at dinner) |
| 9 | can quote in context | a right `quote` answer (placing a line in its scene, or catching a misquotation) |
| 10 | can compare | a right `compare` answer |
| 11 | can apply | a right `apply` answer |
| 12 | culturally possesses | rungs 1–11, plus at least eight sealed reader-Turing questions at 75% or better |

A returning question marked with a rung earns that rung when it is answered days later, unaided and not guessed. Tags never earn a rung; answers do. The receipt of every session lists each work with its rung and the next rung
(V6). Name recognition alone stops at rung 1 (§204).

## 2. The possession graph and the civilisation graph (§162, §236–238)

`renaissance-civ.js` holds about 80 nodes (works, people, ideas, places, movements) and their links (influence,
counter-influence, translation, setting, argument). Sessions name the works they teach; the compiler reads the graph
to prefer works he does not yet possess and sessions that later ones build on. Compression across a civilisation
(§237) is the graph's job: once the Russia of the 1870s is in place for Dostoevsky, the next Russian work needs less
context. Whether that actually saves time is an empirical question (`e-compound`).

## 3. The quote engine (§13) and conversational quotation (§229)

Specified in `../10_MASTERPIECE_COMPILER.md` §5. Every quotation: exact words, speaker, work, place, author,
translator and year, edition, scene, meaning, why it matters, misattribution risk, rights, how it was checked. Rules
that keep quotation conversational rather than a dump (test V11): no step shows more than two quotations; no
quotation appears in more than two steps; every quotation carries its context and why it matters; prose quotations
stay under 160 words (a whole poem is allowed when the poem is the work).

## 4. The primary-experience engine (§14)

The engine asks where summary destroys value and delivers the thing itself in the form the medium needs:

| Class | How it is delivered here | Example |
|---|---|---|
| Literary prose | the passage whole, with its record; reading time counts only at reading speed | *The ticket* |
| Poetry | the whole poem, line by line, then read by voice | *Ozymandias* |
| Music | synthesised in the browser from exact pitches, with a written description for silent reading | *Ode to Joy*, maqam Rast |
| Visual pattern | the generating rule drawn live, never a copied image | girih from Hankin's method |
| Structure | a live model you can load | the hanging chain |
| Film | the geometry of the shot, drawn, with the rule and its deliberate breaks | the 180-degree line |
| Argument | the argument as premises you can switch off | the Grand Inquisitor |
| Painting, sculpture, drama, dance, recorded performance | not yet: needs lawful images, recordings or scans (see `02_ORGANS.md`, at scale) | — |

## 5. No AI oatmeal (§15, §220)

Banned: theme lists ("explores love, death and society"), vague praise, "masterpiece of…" filler, repeated step text,
figures that decorate. The no-slop reviewer (test Q1) scans every teaching text; the only permitted appearance of such
phrases is inside a wrong option diagnosed as *pretension*.

## 6. Provenance, source conflict and no hallucinated culture (§135–137)

Every factual step cites provenance entries (source, year, grade A–C, rights, and `contested` where scholars
disagree). SHOW SOURCE prints **Contested:** beside a contested claim. Disagreement is preserved, not averaged: the
criticism rung shows an admirer (Freud) and a hostile reader (Nabokov) side by side; the Inquisitor keeps two
readings; the film session cites both the 1992 recreation of the Kuleshov experiment and the 2016 replication (test
V10). Scenes and plot events carry provenance; where the record was thin the text hedges or leaves the detail out
(the envelope's inscription is not quoted).

## 7. Texture, not trivia (§227–228)

Texture makes a work feel alive (the elder bowing to Dmitri; the boys' last cheer); trivia is an isolated fact with
little explanatory or conversational value. Returning questions never ask for a bare date or name (V11): they ask for
a model (who was convicted and who did it, why an envelope weighs nothing).
