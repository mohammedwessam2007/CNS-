# Renaissance · 08 · Season 2 · Seeing structure — specification and content audit

Source: `source/public/renaissance-s2.js`. Opens after season 1 is finished (tested: R28). Same schema and tests as
season 1 (`07_SEASON_1.md`): provenance per claim, every wrong option diagnosed, ≥ 2 committed predictions, a model,
a contrast, near and far transfer, a forge, three hooks, ≤ 30 minutes (R20–R22), phone-legible figures (R34), and
options that give nothing away to a test-wise guesser (R35).

## The six sessions

| # | id | Door question | Capability | Model | Contrast | Far transfer | Atoms |
|---|---|---|---|---|---|---|---|
| 7 | bottleneck | A clinic registers 30 an hour, doctors see 12, pharmacy 20. Two more receptionists: how many more treated? | draw the three boxes of a flow and find the constraint | three capacity sliders, throughput, queue, Little's law | airport security vs a restaurant grill | Little's law in a café | minimal · systems · constraint |
| 8 | question | One question before a big decision: which one? | ask the question whose answer would change the choice | value of perfect information vs belief | a founder vs a student | twenty questions | question · judgment · info |
| 9 | snow | London 1854, no germ theory: one question to test air vs water | reason inside an era's knowledge; separate a story from the deciding evidence | the street with two water companies | Vienna 1846 vs London 1854 | a sign-up drop on a website | question · falsify · counter |
| 10 | double | Lily pads double daily, full on day 30: half on which day? | read doubling; estimate doubling times; use a log scale | growth on ordinary vs log scale, with a limit | chips vs bacteria | a rumour doubling daily | scale · represent · predict |
| 11 | taste | Two sentences say the same thing; which is better? | judge versions blind, then name a testable criterion | cut words that do no work (word count) | a padded sentence vs a cluttered chart | a slide title | taste · compress · judgment |
| 12 | boss | A hospital hits every target and patients are angrier: why? | orient in an unlabelled world; find the minimum sufficient model | switch mechanisms until all five symptoms are explained | Hanoi 1902 vs the hospital | a school excluding weak students | orient · minimal · synth |

## Why this season second

- It trains the skill the owner named first (the *three boxes*: what the problem basically is) and the one that
  multiplies every other (the *decisive question*).
- It adds what season 1 lacked: an era-fenced scene (London 1854), a new sense (log scale), blind taste, and an
  unlabelled test.
- Every session reuses season 1's generators (selection, loops, proxies, base rates) without re-teaching them; the
  boss world depends on all of them.

## Content audit

| Claim | Status |
|---|---|
| Little's law, L = λW, for any stable queue (Little 1961, *Operations Research* 9:383) | verified during this build |
| Goldratt & Cox, *The Goal* (1984): the constraint sets system output | cited from knowledge, marked "not re-checked" in the app |
| Howard (1966), "Information Value Theory", *IEEE Trans. Systems Science and Cybernetics* 2:22 | verified |
| Value of perfect information peaks where the choices look equal (p = 0.375 with payoffs +100 / −60 / 0) | derived in the app's model and in GO DEEPER; arithmetic checked |
| A yes/no question that halves the possibilities gives the most information on average (Shannon 1948) | standard result |
| Soho outbreak from 31 Aug 1854; ~500 dead in ten days, 616 overall; clustering at the Broad Street pump; brewery and workhouse largely spared; handle removed 8 Sep 1854; cesspool contamination | verified (London Museum, yourgenome.org, PMC7150208) |
| The outbreak was already declining before the handle came off; the dot map appeared in the 1855 second edition | verified (John Snow Archive, PMC7150208) |
| Southwark & Vauxhall 315 vs Lambeth 37 deaths per 10,000 houses, pipes on the same streets | verified (Snow 1855 via Smithsonian and Science History Institute accounts) |
| Pacini described the organism in 1854; Koch identified it in 1883–84 | cited from knowledge, graded B, marked "not re-checked" |
| Moore 1965 (yearly doubling) revised in 1975 (about every two years) | verified |
| E. coli can double in about 20 minutes in ideal lab conditions | cited from knowledge, graded B |
| Gopen & Swan 1990 (stress position); Tufte 1983 (data-ink) | cited from knowledge, graded B, marked "not re-checked" |
| Cleveland & McGill 1984, *JASA* 79:531 (position judged more accurately than angle or area) | cited from knowledge, marked "not re-checked" |
| Bevan & Hood 2006 (target gaming in English health services) | verified in season 1 |
| The hospital, restaurant, clinic, team, café, founder, student, wedding and startup cases | original, labelled as teaching material; the hospital is labelled fictional in the session |
| Arithmetic: 28 → 8 words; all edits → 6 words; 7% → ~10 years; 3% → ~23 years; 6-year doubling → ~12%; 1,000 → 8,000 at 10% ≈ 21 years (exact 21.8); 2¹⁰ = 1,024; 10 = 20 × ½ h; 40 ÷ 20 = 2 days; sepsis alarm: 1.8 true of 10 flagged → 18% | checked |

## Measurement integrity found and fixed during this build

1. **Length cue.** A guesser who always picked the longest option scored 0.90 across seasons 1–2 (chance 0.31),
   because reasons had been written into right answers. 312 option texts were rewritten (166 in season 1, 146 in
   season 2): reasons moved to the feedback line, wrong options put in the same register. All seven test-wise
   strategies now score 0.30–0.37; R35 keeps each within 0.12 of chance.
2. **Unreadable figures on phones.** Labels rendered at 6–7 px at 360 px width. All wide figures were redrawn on a
   360-unit canvas; R34 measures 74 figure states for size, clipping and label collisions.
3. **Unlabelled answers were not beliefs.** Boss-world answers are now recorded in the belief ledger like predictions.
