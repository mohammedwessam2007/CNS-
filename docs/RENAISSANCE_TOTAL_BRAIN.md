# RENAISSANCE TOTAL BRAIN · executable day map

Pinned source: `622bcb169bf495289c5bc1dde072d02677667f6e`
Repository: `mohammedwessam2007/CNS-`
Purpose: exact recovery map for the current Renaissance curriculum. This is an index, not a replacement for source.

## Source-of-truth rule

For content claims, retrieve the exact session source. For runtime order, `source/public/renaissance-v1.js` wins. For historical intent, preserve docs/missions as lineage without allowing them to override current source. For empirical claims, use the completion ledger/queue and real learner data.

## Executable corpus

Current authored curriculum: **32 sessions = 6 + 6 + 20**, **287 steps**, **208 provenance records**, **96 returning questions**, **87 depth cards**, **32 live models**, **24 drawn figures**, **17 registered quotations**. Capability genome: **28 atoms + 8 compounds**. Civilisation graph: **108 nodes + 94 links**.

Authored session minutes sum to **787 min** before warm-up retrieval/probes. Full ordinary dose is 25 min; short dose 10; deep dose 45. The engine counts real elapsed active minutes separately.

## Day law

Days 1–12 are fixed bootloader days. After that there is no truthful fixed Day 13→32 sequence: the compiler ranks available sessions from actual learner evidence.

| Day | id | title | authored min | order | constraints |
|---|---|---|---:|---|---|
| 1 | `commit` | Tying your own hands | 24 | fixed bootloader |  |
| 2 | `select` | The planes that came back | 23 | fixed bootloader |  |
| 3 | `base` | The test says positive | 23 | fixed bootloader |  |
| 4 | `loop` | The shower that won't settle | 23 | fixed bootloader |  |
| 5 | `proxy` | Paying for rat tails | 23 | fixed bootloader |  |
| 6 | `falsify` | The two clinics of Vienna | 25 | fixed bootloader |  |
| 7 | `bottleneck` | Three boxes | 23 | fixed bootloader |  |
| 8 | `question` | The decisive question | 22 | fixed bootloader |  |
| 9 | `snow` | London, 1854 | 25 | fixed bootloader |  |
| 10 | `double` | A new sense for doubling | 21 | fixed bootloader |  |
| 11 | `taste` | Which is better, and why? | 22 | fixed bootloader |  |
| 12 | `boss` | The hospital that got faster and worse | 25 | fixed bootloader |  |
| post | `km1` | The Karamazovs | 27 | adaptive pool |  |
| post | `km2` | Rebellion and the Grand Inquisitor | 28 | adaptive pool | requires km1 |
| post | `km3` | A judicial error | 33 | adaptive pool · deep | requires km1+km2; Friday/Saturday only |
| post | `ozy` | A boast in the sand | 24 | adaptive pool |  |
| post | `euler` | Seven bridges | 26 | adaptive pool |  |
| post | `willow` | Where does the mass go? | 26 | adaptive pool |  |
| post | `pattern` | A star from a hidden grid | 25 | adaptive pool |  |
| post | `cadence` | The question and the answer | 24 | adaptive pool |  |
| post | `zero` | A symbol for nothing | 24 | adaptive pool | requires euler |
| post | `samarkand` | A scale the size of a hill | 24 | adaptive pool |  |
| post | `wayfinding` | Finding an island with no instruments | 24 | adaptive pool |  |
| post | `maya` | Counting days for five thousand years | 24 | adaptive pool | requires zero |
| post | `wisdom` | Why did Baghdad translate the Greeks? | 26 | adaptive pool |  |
| post | `salon` | The salon | 25 | adaptive pool |  |
| post | `host` | An evening at your table | 25 | adaptive pool | requires salon |
| post | `cut` | Meaning made by the cut | 25 | adaptive pool |  |
| post | `arch` | Why an arch stands | 26 | adaptive pool |  |
| post | `timbuktu` | What survives: the libraries of Timbuktu | 24 | adaptive pool | requires wisdom |
| post | `names` | Alyosha, Alexei Fyodorovich, ya basha | 24 | adaptive pool | requires km1 |
| post | `angkor` | A city that ran on water | 24 | adaptive pool |  |

Post-boot ranking weights:
- capability gap 3
- recurring error atoms 1.5
- unpossessed works 2
- domain rotation 2
- unfamiliar-domain turn 1.5
- prerequisite leverage 1
- GO DEEPER curiosity 0.5

Every fourth compiled pick reserves pressure toward the least-visited domain. One compiled day in five deliberately uses the authored source order as an experimental control. A started session always resumes before any new pick. The learner may choose a runner-up before answering; the abandoned compiler pick is left untouched.

## Daily gate

Renaissance opens only after medicine reports STOP.
- one completed Renaissance session per eligible day
- 01:00–05:00: closed for sleep
- within 2 days of the NEU-205 exam: closed
- within 7 days of exam: short 10-min dose
- late night (23:30 onward / 00:xx): short dose
- rolling 7-day minutes >=245: short dose
- rolling 7-day minutes >=300: rests
- if today's measured minutes exceed dose+10: rests
- missed work creates no backlog or guilt
- unfinished session resumes next time

## Session arc

A normal authored session is not a lecture. The recurring grammar is:
committed prediction → reveal/model → contrast → near transfer → far transfer → bounded forge → later reality check.
Primary material/passages/listening are inserted when irreducible to summary. Wrong choices map to explicit misconception families. Helpers never operate on sealed probes and fade on returning questions.

Every completed session schedules three authored memory hooks at nominal gaps **1, 7, 30 days**. Retrieval spacing itself is under trial L6; successful sure recalls expand the gap, and after three sure recalls an idea whose next gap passes half a year retires as assimilated.

At a new day's warm-up the engine can add:
- yesterday/older reality check for the last forge
- up to 2 due hooks (1 on short day), from different sessions
- due sealed probes, subject to probe rules

## Sealed measurement schedule

52 items were preregistered and hashed on 2026-09-26. Do not expose their hidden content while authoring curriculum.
- Form A: 8 items, baseline days 0–3, repeat day 90
- Form B: 8 parallel items, day 30
- Alien/unknown: 24 items, 2 each on days 7,14,...84
- Reader-Turing: 12 items, 30 days after km3
- max 2 sealed probes/day
- no probes on short-dose days
- missed window >14 days is skipped, never owed
- probe record stores id/outcome, not clear-text item content

## Cultural possession

Twelve rungs:
1 heard of
2 recognises
3 context
4 structure
5 primary material
6 arguments
7 criticism
8 discuss
9 quote in context
10 compare
11 apply
12 culturally possesses

Rungs require evidence and prerequisites. A primary passage only counts when the reading-time check is plausible. Karamazov rung 12 additionally requires the delayed sealed Reader-Turing threshold. Possession must never be asserted merely because sessions were completed.

## Masterpiece compiler

For every part of a major work:
READ WHOLE · READ PASSAGES · BRIDGE · DO NOT READ NOW.
Question: what would summary destroy?

Karamazov is the first full prototype:
- km1 family/context/compile map
- km2 Rebellion + Grand Inquisitor arguments
- km3 trial/evidence/criticism/discussion
The compiler is implemented; cultural possession remains empirical.

## Capability genome

28 atoms: causal, mech, prob, counter, model, scale, abstr, compress, analogy, falsify, calib, predict, synth, represent, strategy, narrative, taste, question, recomb, experiment, constraint, systems, info, judgment, selfmodel, measure, orient, minimal.

8 compounds: diagnosis, fair verdict/narrative forecasting, probabilistic empathy, aesthetic systems reasoning, counterfactual engineering, mathematical taste, strategic anthropology, invention.

Evidence for an atom comes only from later/unaided task success, not from session tags. Rates are withheld below n=5.

World-model layers deliberately keep gaps visible. Current named empty layers include evolution and intelligence.

## Self-improvement

Trials L1–L11 vary authored alternatives:
representation order, step order, optional depth, session split, second-view offering, retrieval interval, recall-before-options, passage context, review placement, written-order-vs-compiler, gap-vs-rotation weighting.
L14 audits the judge itself.
Each trial has control, minimum sample, +0.15 success margin, 0.40 no-harm floor, rollback and kill switch.
L12/L13 runtime curriculum/pedagogy generation were still classified externally blocked in the v18.5 completion report; verify current state before repeating this claim after future repo changes.

## Empirical frontier

Controllable completion != human transformation.
Current queue includes delayed 30-day recall, Form B, Reader-Turing, velocity/acceleration, forecast calibration, trial verdicts, day-84 alien orientation, day-90 Form A, equal-time alternatives, compounding, 6/12-month transformation and years-scale possibility.

## Current historical certification

v18.5 completion report: 596 regression checks passed, none failed on that tested snapshot; 177/177 controllable Renaissance requirements closed, 2 external blockers, 12 empirical future, 1 perpetual frontier.
Current production is v18.6 at `622bcb169bf495289c5bc1dde072d02677667f6e`; v18.6 changed department-figure publishing rather than Renaissance curriculum, but exact current regression status must be checked when consequential.

## Retrieval pointers

Engine: `source/public/renaissance-v1.js`
Seasons: `renaissance-s1.js`, `s2.js`, `s3a.js`, `s3b.js`, `s3c.js`
Genome: `renaissance-genome.js`
Civilisation graph: `renaissance-civ.js`
Media/rights: `renaissance-media.js`
Sealed battery: `renaissance-sealed.js` + `docs/RENAISSANCE/sealed/`
Tests: `tests/renaissance_test.js`, `tests/renaissance_v3_test.js`
Completion truth: `docs/RENAISSANCE/completion/`
Masterpiece compiler: `docs/RENAISSANCE/10_MASTERPIECE_COMPILER.md`
Season 3 audit: `docs/RENAISSANCE/09_SEASON_3.md`
Omega lineage: `docs/RENAISSANCE/omega/`
Mission lineage: `docs/RENAISSANCE/missions/`

Companion full-repository byte identity remains `docs/CNS_BYTE_MANIFEST.json` on this Total Brain branch.
