# Renaissance · 09 · Season 3 · Possession — specification, tournament, critic panel, content audit

Code: `source/public/renaissance-s3a.js` (Karamazov, *Ozymandias*), `renaissance-s3b.js` (Euler, the willow, the
pattern, the cadence), `renaissance-s3c.js` (the medicine relay, the salon, the cut, the arch). Tests:
`tests/renaissance_v3_test.js` (V1–V11, M1, Q1, S2–S3), `tests/renaissance_test.js` R20–R22, R32, R34–R35.

## The thirteen sessions

| id | Session | Organ | Setting | Min | Work(s) | Live model | Sources |
|---|---|---|---|---|---|---|---|
| km1 | The Karamazovs | literature | Russia | 27 | *The Brothers Karamazov* | family forces | 12 |
| km2 | Rebellion and the Grand Inquisitor | philosophy | Russia | 28 | same | the argument as premises | 11 |
| km3 | A judicial error (deep, weekend) | evidence | Russia | 33 | same | the jury's arithmetic | 12 |
| ozy | A boast in the sand | poetry | England and Egypt | 24 | *Ozymandias* | reading by voice | 7 |
| euler | Seven bridges | mathematics | Königsberg (now Kaliningrad) | 26 | Euler 1736 | bridges and degrees | 9 |
| willow | Where does the mass go? | science | Flanders and Australia | 26 | van Helmont's willow | following the atoms | 7 |
| pattern | A star from a hidden grid | art | Egypt, Iran | 25 | Ibn Tulun, Darb-i Imam | Hankin's method, drawn live | 6 |
| cadence | The question and the answer | music | Germany, Austria, Egypt | 24 | *Ode to Joy*; maqam Rast | choose the last chord (heard) | 7 |
| wisdom | Why did Baghdad translate the Greeks? | history | Iraq, Iran, Central Asia, Spain | 26 | the translation movement | weighing explanations | 8 |
| salon | The salon | conversation | Cairo, anywhere | 25 | — | one idea, four listeners | 6 |
| host | An evening at your table | cultivation | Cairo, Tokyo, anywhere | 25 | — | plan the table | 6 |
| cut | Meaning made by the cut | film | Russia, Japan, Micronesia | 25 | *Tokyo Story* | the 180-degree line | 8 |
| arch | Why an arch stands | architecture | England, Spain, Egypt | 26 | New Gourna | hang, flip, load | 7 |

Every session keeps the full arc of seasons 1–2 (committed predictions, a model, a contrast, near and far transfer, a
forge, three hooks) and adds what possession needs: primary material where lawful, quotation records, a possession
rung per step, a counterexample or open question, and a world-model layer (`renaissance-genome.js` `world`).

## Why this season now: the season tournament (§170, §140, §179)

OMEGA had planned season 3 as **Building models** (mechanistic decomposition, model selection, abstraction,
narrative as evidence, creative recombination, the misleading-representation gap cell). ABSOLUTE COMPLETION asked
that it not be assumed. Three candidates competed on the coverage oracle's open requirements:

| Candidate | Closes | Leaves open |
|---|---|---|
| A. *Building models* as planned (six abstract sessions) | the five model-building atoms | every cultural organ, the masterpiece compiler, primary material, §216 |
| B. *Possession*: one real experience per organ, the models taught inside them | the organs, the masterpiece compiler, the quote engine, §216–217, and the model-building atoms | breadth inside each organ |
| C. Two narrower seasons (literature first, organs later) | the masterpiece first | the other seven §216 experiences for months |

**B won.** Each *Building models* target is carried by a *Possession* session, so the plan was **merged**, not
dropped: mechanistic decomposition → *willow* (following atoms); model selection → *wisdom* (weighing
explanations); abstraction → *euler* (a city to four dots); narrative as evidence → *km3*; creative recombination →
*pattern* and *arch* forges; the misleading-representation gap → *cut* (a cut that breaks the rule) and the 1932
tuning debate in *cadence*.

Inside the season, smaller tournaments chose between designs (§224–225): for the trial, a summary of Book XII, the
full book, or the trial as a problem he solves (the problem won: it makes him the juror and keeps the reading
optional); for the famous lines, the misquotations were rejected as passages and kept only as the wrong options they
are; for music, recordings (rights and download size) against synthesis from exact pitches (synthesis won, with a
written description of every sound).

## The critic panel (§221)

Each major experience was read through six lenses. Findings, and what was done:

| Experience | Lens | Finding | Outcome |
|---|---|---|---|
| Karamazov | domain expert | No criticism rung: only admirers' framing | **fixed**: two verdicts (Freud, Nabokov) and a discussion item (t12–t13) |
| Karamazov | sceptic | The reader-Turing items were written by the lesson author | **mitigated**: sealed, hashed, firewalled (S1–S2); a human examiner stays in the empirical queue |
| Karamazov | beginner | A father, four sons, two rival women, a town: names become fog | **fixed**: family map + model before any argument |
| Karamazov | cultural critic | Garnett's 1912 English is dated and sometimes smoothed | **stated**: noted in the quotation records; the only lawful full translation here |
| Karamazov | UX | Long passages on a 390-px phone | **checked**: V4 runs every session on a phone; passages render whole |
| *Ozymandias* | domain expert | The inscription is often taken as a real Egyptian text | **fixed**: the record says Shelley adapted Diodorus |
| Euler | mathematician | Euler's remark about "geometry of position" is usually cited to the wrong letter | **fixed**: the record cites the letter to Marinoni and notes the common attribution to Ehler |
| Willow | scientist | Van Helmont's "water" answer is wrong but his method was right | **kept deliberately**: the contrast is the lesson (a careful experiment, a wrong model) |
| Pattern | cultural critic | "Islamic art" as one style; one method taken as the only one | **fixed**: named sites and centuries (Ibn Tulun, the Darb-i Imam shrine, 1453); Hankin's 1925 method is one generator, and Lu and Steinhardt's analysis of girih tiles is cited beside it |
| Cadence | musicologist | "C sounds like home" is often explained by physics | **fixed**: it is taught as learned expectation (Meyer, Huron), and the maqam item tests it |
| Wisdom | historian | Single-cause stories of the translation movement | **fixed**: three rival explanations weighed; the caliph's dream kept as a story, not a cause |
| Salon | pedagogy | Cultivation can turn into status anxiety | **fixed**: the model keeps the mechanism fixed and changes only the listener; pretension is a diagnosed error |
| Cut | film scholar | The Kuleshov effect is overstated in textbooks | **fixed**: the 1992 recreation and the 2016 replication are both cited |
| Arch | engineer | "The catenary is the ideal arch" ignores loading | **fixed**: the model adds a load at mid-span and compares with a half-circle |
| All | UX | Twelve new figures on a phone | **checked**: R34 legibility and A1 contrast on every figure |

## Content audit (claims that needed care)

- The envelope scene: the inscription is **not** quoted (the wording could not be verified); the escape plan is
  attributed to Ivan; "A Corrupter of Thought" is given as a chapter title.
- "Beauty will save the world" and "everything is permitted" appear only as misquotations with their true sources.
- Hankin's method: described 1925, after star patterns seen in a Turkish bath with a faint polygonal grid.
- The maqam example: the neutral third is described as a note between major and minor, as practised in Rast; the
  1932 Cairo Congress is cited for the debate over fixed quarter tones.
- Fat loss: Meerman and Brown (2014) for the 84% exhaled as carbon dioxide.
- Euler: presented 1735/1736, printed in the Commentarii for 1736 (published 1741).
- Hooke's anagram: the decoded sentence was published by his executor in 1705.

## What season 3 does not do

It gives one experience per organ, not an organ's breadth. The remaining forms (drama, epic, essay, memoir, satire,
myth, religious text…) and the thousands of works of §235 are the perpetual frontier (`v3/02_ORGANS.md`, "At scale").
