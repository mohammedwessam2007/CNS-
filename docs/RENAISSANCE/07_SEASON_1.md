# Renaissance · 07 · Season 1 specification and content audit

Source: `source/public/renaissance-s1.js`. Six sessions, each ~20–25 minutes, authored order interleaved by kind of
idea. This file is the audit trail (§183): why each is there, what it trains, where its facts come from, and the
schema any future season must satisfy (the tests enforce it).

## The six sessions

| # | id | Door question | Capability (what he can do after) | Primary experience | Interactive model | Contrast | Far transfer |
|---|---|---|---|---|---|---|---|
| 1 | commit | Why would a rational person deliberately tie his own hands? | spot a future-self conflict and build a constraint that holds | Odysseus and the Sirens (paraphrase of *Odyssey* XII) | hyperbolic vs exponential discounting; find the flip | Save More Tomorrow (USA) vs CARES (Philippines) | central-bank independence (Kydland & Prescott) |
| 2 | select | Bombers came home full of holes… where does the armour go? | ask what filter produced the data | Wald's problem (SRG 1943) | the fleet with and without the lost planes | "drop out" advice vs "old buildings were better" | Berkson's paradox in admissions |
| 3 | base | A test is 90% accurate. Positive. How worried? | turn percentages into counts; read a positive | Eddy's physicians (graded C) | 1,000 people, three sliders | screening clinic vs the Sally Clark trial | same test in a symptomatic clinic |
| 4 | loop | Why does the shower swing from freezing to scalding? | predict settle / swing / run-away from loop structure | Sterman's Beer Game (1989) | shower with delay and gain | blood sugar (balancing) vs bank run (reinforcing) | microphone howl |
| 5 | proxy | Hanoi paid for rat tails. Why more rats? | separate a number from its goal; design gaming-resistant measures | Hanoi 1902 (Vann 2003); NHS 8-minute spike (Bevan & Hood 2006) | pressure vs audit (toy model, labelled) | Hanoi vs English ambulance targets | clicks as a proxy |
| 6 | falsify | Vienna 1846: two clinics, 1 in 10 vs 1 in 30. Why? | choose the observation that splits hypotheses | Semmelweis's own yearly and monthly counts | hypothesis tester (5 explanations × 4 observations) | Vienna alternate days vs MRC 1948 randomisation | Galileo-style falling bodies (Pisa story graded doubtful) |

## Why this season first

- **Usable tonight** (commit), **usable in every medical paper** (select, base, falsify), **usable in his founder
  work** (proxy, loop): high transfer value per minute.
- **Evidence-rich and lawful**: every case has published facts; no copyrighted text is needed.
- **Taste, literature, art and music are missing on purpose, not by accident**: they need lawful primary material
  (paintings, recordings, texts) that this build machine could not fetch. They are season-2+ work (`03_ARCHITECTURE.md`
  §L). This is the biggest gap in v1.

## Schema every session must satisfy (enforced by tests R20–R22)

```
id, primitive, title, hook (door question), why (auditable reason), capability, stakes, bridge, connection
vocab{ key: { name, h (human), s (Egyptian-Arabic sticky), t (technical) } }
provenance[ { id, claim, source, year, kind, license, grade A|B|C, note? } ]
steps[ scene | q(predict|transfer|far) | model | contrast | forge ] with min (minutes), src (provenance ids), opt?
  every question: exactly one right option; every wrong option: bug class + diagnosis
challenge (I ALREADY GET THIS) · hooks[ ≥3, gaps 1/7/30 ] · deeper[ formal version, limits, open question ]
≥ 2 committed predictions, 1 model, 1 contrast, ≥ 1 near + 1 far transfer, 1 forge, ≤ 30 min
no "what do you think / reflect / research", no links out, no points or badges
```

## Content audit (claims that need care)

| Claim | Status |
|---|---|
| Odysseus's three rules | paraphrase, grade A (the text is unambiguous); not quoted because the public-domain text could not be fetched here |
| Save More Tomorrow: 78% joined; 3.5% → 11.6% over 28 months | verified via search (JPE 2004 abstract, DOL CLEAR summary) |
| CARES: 11% take-up; +3 points; persisted at 12 months | verified (AEJ: Applied 2010 abstract) |
| Kirby & Herrnstein 1995; Kydland & Prescott 1977; DellaVigna & Malmendier 2006; Berkson 1946; Diamond & Dybvig 1983; MRC 1948 | cited from knowledge, marked "not re-checked in this build" in the app |
| Wald 1943, CNA 1980 reprint | verified (CNA, DTIC ADA091073) |
| Eddy 1982 | verified as widely reported; graded C in the app with the replication note |
| Sally Clark: 1 in 73 million = (1 in 8,543)²; RSS statement; quashed Jan 2003 | verified |
| Sterman 1989 | verified |
| Goodhart 1975 and Strathern 1997 wordings | verified across several sources; the only two quotations in the season |
| Hanoi 1902 tails | verified (Vann 2003) |
| NHS ambulance 8-minute spike; a third of trusts "corrected" times | verified (Bevan & Hood 2006) |
| Semmelweis yearly table 1841–46; April–August 1847; 1848 level | verified (Loudon 2013, James Lind Library) |
| Semmelweis's rejected hypotheses (priest's bell, delivery position, overcrowding), street births | from Semmelweis's own account as summarised in the literature; graded B |
| Cortés scuttled, not burned | verified (historians' consensus, Hugh Thomas) |
| Cobra effect | labelled in the app as an unsourced parable (grade C) |

## Visuals (no decoration)

Every picture is drawn from the numbers it shows: the discounting curves, the fleet, 1,000 people, the shower
temperature trace, the Goodhart toy model (labelled toy), Semmelweis's two charts, a schematic histogram labelled
"schematic, not real data", and two diagrams (Odysseus's two selves; balancing vs reinforcing loops).
