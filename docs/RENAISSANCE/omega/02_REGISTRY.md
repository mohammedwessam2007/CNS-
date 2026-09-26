# OMEGA · 02 · Mechanism registry, generations 1–7

Data: `registry/gen1_all.tsv` (every candidate, 13 identity fields), `registry/gen1_summary.json` (the counts),
`registry/strongest200.tsv` (the §121 selection), built by `registry/src/build.py` from the pass files beside it.
Checked by `tests/omega_registry_test.js`: if a number below drifts from the data, the test fails.

## Generation 1 · 1,160 candidates, 1,003 distinct after deduplication

| | Count |
|---|---|
| Candidates generated (72 passes: 40 from v1, 32 new for OMEGA) | **1,160** |
| Kept for breeding (S) | **863** |
| Merged into a stronger candidate (renamed or weaker duplicates, §120) | **148** |
| Rejected with a reason | **149** (of which 9 as renamed duplicates) |
| **Distinct candidates after deduplication** (kept + rejected-but-distinct) | **1,003** |
| Kept candidates with a named ancestor (KNOWN 521 · KNOWN COMBINATION 285) vs no ancestor found (UNCLEAR 57) | 806 · 57 |

Rejections by reason: decoration or gamification 31 · contradicted by evidence 29 · outside the mission 17 ·
open-ended thinking tax 16 · cost exceeds value 15 · renamed duplicate 9 · fabrication risk 9 · cannot be measured 7 ·
rights problem 7 · manufactured compulsion 6 · backlog or streak pressure 3.

**How to read a row.** Every candidate has the §119 identity: id, name, problem, mechanism, donor concept, why
existing education misses it, expected benefit, human friction (L/M/H), machine cost (L/M/H), risks, test, related
mechanisms (resolved to ids), novelty status, verdict. Two honesty markers:

- `[pass]` — for the 520 v1 candidates, *problem, why missed, benefit, risks and test* are written once per pass and
  shared by its 13 candidates. Mechanism and donor are per candidate (281 mechanism lines and 363 donor lines were
  written for this normalisation, `registry/src/legacy_fill.py`). The 640 OMEGA candidates have every field written
  individually.
- `[computed]` — v1 related links and v1 merge targets were derived by word overlap, not judged by hand.

**Novelty.** KNOWN means the mechanism exists under another name (the donor column names it). KNOWN COMBINATION
means each part exists and this combination was not found in this session's searches. UNCLEAR means no ancestor was
found: weak evidence of novelty, not proof. 57 of 863 kept candidates are UNCLEAR; the test fails if that share
passes 15%, because a registry that calls most of its ideas new is lying.

**Dedupe (§120).** Exact name collisions fail the build. Name-similar pairs (word overlap ≥ 0.6) fail the build unless
one records the other as its merge target, related link or duplicate. Four OMEGA candidates collided by name with v1 ideas and were caught
this way: two were renamed and merged, two renamed and rejected as duplicates. Six more were rejected as duplicates by
hand, and 148 candidates in all were merged into stronger ones.

### Passes

| # | Pass | n | Kept | Merged | Rejected |
|---|---|---|---|---|---|
| 1–40 | v1 passes (units, cross-domain, curriculum, session unit, memory, biology, evolution, control, information, compression, caching, operating systems, compilers, distributed systems, discovery, expertise, games, story, visual art, music, architecture, economics, incentives, motivation, cognitive science, neuroscience, mathematics, philosophy, anthropology, history, governance, infrastructure, interface, speculative tech, metacognition, paired skills, frontier, personal science, meta-generators, endgame) | 520 | 407 | 35 | 78 |
| 41 | Education destruction (§100) | 20 | 12 | 6 | 2 |
| 42 | Irreducible experience and reality (§5–6, §33, §61–62) | 20 | 13 | 4 | 3 |
| 43 | Complexity firewall, vocabulary law, no open-ended laziness (§9–13) | 20 | 14 | 4 | 2 |
| 44 | Satisfaction and click-event economics (§15–16) | 20 | 15 | 1 | 4 |
| 45 | Civilization compiler and knowledge recompiler (§17, §75) | 20 | 14 | 4 | 2 |
| 46 | Capability genome, periodic table, cognitive chemistry, dark matter (§18–21) | 20 | 16 | 2 | 2 |
| 47 | New senses and perceptual resolution (§22, §56) | 20 | 16 | 2 | 2 |
| 48 | Representation singularity, breeding, new media (§23–25) | 20 | 16 | 2 | 2 |
| 49 | Prerequisite annihilation, wormholes, arbitrage, zip bombs (§26–30) | 20 | 15 | 3 | 2 |
| 50 | Anti-specialization and polymath compiler (§31–32) | 20 | 14 | 3 | 3 |
| 51 | Intuition, possession, reenactment, counterfactuals, lost futures (§34–38) | 20 | 16 | 2 | 2 |
| 52 | Alien curriculum, unknown concepts, dark matter (§39–40, §76, §78) | 20 | 16 | 2 | 2 |
| 53 | Great questions, question singularity (§41–42) | 20 | 16 | 2 | 2 |
| 54 | Idea immune system, belief version control, calibration, contradiction (§43–46) | 20 | 14 | 5 | 1 |
| 55 | Perspective accelerator, thought interferometer (§47–48) | 20 | 15 | 3 | 2 |
| 56 | World model, compression, half-life, garbage collection, memory, assimilation (§49–54) | 20 | 15 | 2 | 3 |
| 57 | Taste, perceptual resolution, beauty (§55–57) | 20 | 12 | 6 | 2 |
| 58 | Creation, invention gym, recombination (§58–60) | 20 | 13 | 4 | 3 |
| 59 | Digital twin, pedagogy genome, personal physics, x-ray (§63–66) | 20 | 14 | 3 | 3 |
| 60 | Scaffold decay, anti-dependence, alien test, explanation supremacy (§67–71) | 20 | 14 | 4 | 2 |
| 61 | Synthesis trials, boss worlds (§72–73) | 20 | 15 | 3 | 2 |
| 62 | Frontier radar, serendipity, canon market, anti-canon (§74, §77, §79–80) | 20 | 12 | 6 | 2 |
| 63 | Human possibility engine, the objective (§81–84) | 20 | 16 | 1 | 3 |
| 64 | Time, stop rule, dose, no backlog, no FOMO, sovereignty (§85–89) | 20 | 8 | 10 | 2 |
| 65 | Self-improving curriculum, pedagogy, meta, meta-meta (§90–98) | 20 | 12 | 7 | 1 |
| 66 | Unknown donors (§117): aviation, chess, jazz, kitchens, law, navigation, typography, coaching, translation | 20 | 13 | 6 | 1 |
| 67 | Physics (§102) | 20 | 15 | 3 | 2 |
| 68 | Clinical medicine: differential, triage, M&M, handover | 20 | 17 | 1 | 2 |
| 69 | Law and evidence: burdens, standards, precedent, discovery | 20 | 15 | 2 | 3 |
| 70 | Ecology and epidemiology: R₀, carrying capacity, keystones, surveillance | 20 | 15 | 3 | 2 |
| 71 | Sports science: periodisation, taper, load, film review | 20 | 13 | 4 | 3 |
| 72 | Reliability engineering: FMEA, fault trees, margins, fail-safe | 20 | 15 | 3 | 2 |

Pass 64 has the most merges (10 of 20) because v1 had already built most of the time-and-stop machinery; the OMEGA
pass mostly rediscovered it. That is the dedupe rule working, not a weak pass.

## Generation 2 · 100 mechanisms bred from the strongest 200

Selection (§121) is `strongest200.tsv`: kept candidates ranked by a stated heuristic (low friction and machine cost,
many links in and out, a candidate-specific test, not KNOWN). It is a selection rule, not a verdict of merit. Every
parent below is in that file (checked by the test). Operators: **×** crossbreed · **¬** inversion · **↑**
generalisation · **⊕** common generator. Status: **BUILT** (in the app and tested) · **DESIGN** · **EXPERIMENT**
(needs the learner's months of data).

1. **Belief ledger with click tags** — O5401 × O4401 · each revised belief records whether it produced a click; clicks that revise beliefs are weighted in season planning · DESIGN
2. **Three boxes before every boss** — O4301 × O5201 · the unlabelled world opens with a three-boxes pick before any mechanism question · BUILT (season 2 boss)
3. **Atom-tagged receipts** — O4601 × O4404 · receipts list which capability atoms the day trained, from logs only · DESIGN (atoms are logged; receipt line pending)
4. **Cause-routed representations** — O4312 × L079 · the tournament runs per x-ray cause, so the winning picture for 'word' confusions can differ from 'step' · EXPERIMENT
5. **Minutes per assimilated idea** — O4402 ↑ O5602 · cost is counted to assimilation (30-day unaided far transfer), not to the click · DESIGN
6. **Blind chart pairs from real data** — O4807 × L044 · the chart pair is drawn from a primary table, so taste and evidence train together · BUILT (taste session, chart pair)
7. **Wormhole with a breaking point** — O4902 × L322 · every wormhole case states where the analogy fails, placed on the distance ladder · DESIGN
8. **Passport of verified pairs** — O5016 × O6301 · the passport shows only primitive–domain pairs demonstrated unaided at delay · DESIGN
9. **Scale switch inside the boss** — O5504 × L210 · each boss has symptoms at person, team and system level · BUILT (hospital boss spans ward, survey, budget, alarm, discharge)
10. **Short dose with handover** — O6409 × O6804 · a partial day ends with a one-line handover that opens the next day · BUILT (partial receipt + resume) 
11. **Kill switch taught through commitment** — L488 × L482 · the session on commitment devices explains the organ's own off switches as one · BUILT (session 1 + switches)
12. **Complexity meter at build time** — O4319 × L157 · the season compiler refuses screens over the term, control and word budget · DESIGN (term budget linted; full meter pending)
13. **Forge with pre-mortem** — O4306 × L054 · build a device from graded parts, then pick its most likely failure · BUILT (every forge)
14. **Domain entry cost ledger** — O4518 × L006 · minutes to first far transfer per new domain, used to size doses · DESIGN
15. **Prediction-first possession** — L002 × O5115 · in a historical scene, commit the probability of the real outcome before learning it · DESIGN (London 1854 uses a question pick)
16. **Delayed proof for taste** — L004 × O5701 · taste pairs return as unaided hooks at 1, 7, 30 days · BUILT (taste hooks)
17. **Minimum dose with a margin** — L006 × O7102 · the plan targets 80% of the dose, and tapers new material before exams · DESIGN (exam taper exists; 80% target pending)
18. **Confidence on forges** — L007 × O4306 · the forge critique is committed with confidence and scored · BUILT (critique uses SURE/THINK/GUESS)
19. **Rebuild with the model hidden** — L011 × L041 · after a model step, a later item asks for its output with the model hidden · DESIGN
20. **Label after the jewel** — L012 × L118 · the technical term appears only after the preserved scene has been seen · BUILT (vocabulary chips follow scenes)
21. **Hooks from different seasons** — L053 × L065 · warm-ups never draw two hooks from one session and mix seasons · BUILT (distinct-session rule)
22. **Medicine case in every primitive** — L064 × O4302 · each primitive's decisive-question item has a clinical version · DESIGN (base rates, Semmelweis, Snow, sepsis alarm exist)
23. **Priority scheduler with fail-safe** — L144 × O6916 · when CNS state is unreadable, the presumption is 'medicine not done' and the organ stays shut · BUILT (gate reads STOP only)
24. **Opportunity cost with a counterfactual** — L274 × O6306 · WHY THIS? states what the minutes are traded against and the rate they buy · DESIGN
25. **Portfolio rebalanced by evidence** — L278 × O6501 · primitives re-ranked each season by scored bets · DESIGN
26. **Proper scoring everywhere** — L287 ↑ O5712 · Brier scoring extended to taste and forge critiques · BUILT
27. **Vector objective, no headline** — L288 × O6304 · receipts report five numbers with n, never a composite · BUILT (receipts; WHY THIS?)
28. **No answer channel, unaided hooks** — L293 × O6001 · no feature gives answers before commitment, and hooks remove every aid · BUILT
29. **If-then device per forge** — L300 × O4306 · every forge ends in an if-then plan with a named trigger · BUILT (forge templates)
30. **Confident errors return sooner** — L303 × O5401 · confident wrong beliefs come back as hooks earlier than guesses · DESIGN
31. **Generation before reveal in taste** — L305 × O4816 · the learner picks between unlabelled versions before the criterion is named · BUILT
32. **Curiosity door with a real crux** — L326 × O5301 · the door question must pass the three tests of a good question · BUILT (door questions audited by hand)
33. **Prediction error weighted memory** — L327 × O5303 · each confident miss produces a question 'what would have predicted this?' · DESIGN
34. **Thought experiment with a result** — L355 × O4201 · thought experiments end with the real sourced result · BUILT (falling bodies, graded)
35. **Belief version control with source links** — L357 × O4513 · each belief links to the source it rests on; a changed source reopens it · DESIGN
36. **Constitution with appeals** — L391 × L396 · the organ's rules are written, and a disputed key can be appealed with evidence · DESIGN
37. **Constitutional kill switch** — L403 ⊕ L146 · off switches written as rules that no update may remove · BUILT (three switches, tested)
38. **Progressive disclosure with a budget** — L418 × O4307 · depth only on demand and one decision per screen · BUILT
39. **Friction detector drives repairs** — L420 × O4312 · long hesitation before commit offers THIS DIDN'T CLICK · DESIGN
40. **Dark-pattern ban as a test** — L423 ↑ O4413 · lint forbids streaks, points, cliffhangers and FOMO text · BUILT (R22)
41. **Provenance on demand, graded** — L429 × O4201 · every step's sources with grades in WHY THIS? · BUILT
42. **Calibration curve with alarms** — L443 × L445 · SURE accuracy under 80% triggers calibration items · DESIGN
43. **What would change my mind, fixed options** — L444 × O5315 · choose the observation that would change a belief before seeing it · BUILT (falsify session)
44. **Life cases compiled into bosses** — L483 × O5201 · founder and study events become boss worlds · DESIGN
45. **Evidence ledger feeds P(t)** — L484 × O6301 · verified pairs are computed from the ledger, never self-reported · DESIGN
46. **Life-minutes in every receipt** — L489 × O4402 · receipts show minutes and minutes per click · BUILT (minutes; per-click DESIGN)
47. **Stop as the success condition** — L490 × O6408 · the session ends when the marginal minute is predicted to buy little · DESIGN
48. **Donor-organ isolation** — L491 × L145 · Renaissance reads one CNS signal and writes nothing to CNS state · BUILT (R12)
49. **Reality tap closes the forge** — L494 × O4420 · the tap after a clicked session measures click-to-reality conversion · BUILT (tap) / DESIGN (conversion)
50. **Learner-authored sessions pass the linter** — L508 × L407 · authorship is credited only if the session meets the same session standard and passes the same tests · DESIGN
51. **Learner builds the minimal model** — L509 × O4313 · the learner assembles the minimum sufficient model from parts · BUILT (mechanism board)
52. **Wrong predictions as tuition in receipts** — O4108 × O4404 · receipts lead with beliefs revised, not scores · BUILT (WHY THIS? ledger)
53. **Primary numbers in blind pairs** — O4201 × O5701 · pairs use primary data so the better chart also shows true numbers · BUILT
54. **Sticky line with back-translation** — O4303 × O6609 · every Egyptian-Arabic line is back-translated and reviewed · DESIGN
55. **One decision per screen, phone-first** — O4307 ↑ O4804 · figures legible at 360 px; one decision per screen · BUILT (R24, R34)
56. **Minimal model with non-uniqueness** — O4313 ¬ O5615 · the board shows when two different minimal models fit, and asks for the splitting observation · BUILT (boss read-out)
57. **One idea per session, interleaved hooks** — O4413 × L053 · one primitive per session; breadth comes back through hooks · BUILT
58. **Periodic groups predict seasons** — O4603 × L027 · a season fills an under-trained group of atoms · DESIGN
59. **Compound skills from atoms** — O4605 × L210 · boss items are designed as bonds of atoms and scored per bond · DESIGN
60. **Counts as the default sense** — O4702 × O4804 · every risk shown as counts of 1,000 or icon arrays · BUILT
61. **Blind-spot items in every boss** — O4718 × O5201 · one boss item's right move is naming the missing variable · DESIGN
62. **Zip-bomb seasons** — O4904 ↑ L001 · each season teaches generators whose cases unpack in later seasons · BUILT (selection, loops, proxies recur in season 2)
63. **Intuition audit on fast items** — O5106 × L209 · fast answer committed, then a slow check; disagreements logged · DESIGN
64. **Alien month with period knowledge** — O5202 × O5115 · the monthly alien problem sometimes sits in another century · DESIGN
65. **Question value test on doors** — O5301 × L040 · every door question is checked against the three tests · BUILT (by review)
66. **Antigen test on frontier cards** — O5403 × L469 · frontier claims pass the source/base-rate/mechanism/incentive check · DESIGN
67. **Assimilation states in WHY THIS?** — O5602 × O5603 · each primitive shows seen → understood → used → assimilated with evidence · DESIGN
68. **Hook cap with interleaving** — O5618 × L053 · at most two hooks a day, from different sessions · BUILT
69. **Vector objective with life constraints** — O6304 × L144 · the objective is five numbers subject to sleep, medicine and weekly caps · BUILT (as rules)
70. **Meta-pedagogy log with delays** — O6503 × L094 · each teaching change is judged only after its delay · DESIGN
71. **Succession-ordered seasons** — O6617 × L028 · pioneer primitives (counting, filtering) before those that need them · BUILT (season order)
72. **M&M review of the worst session** — O6804 × L083 · monthly blameless review of the worst session feeds the extinction log · DESIGN
73. **Mechanism map by same-shape pairs** — L014 × L019 · the map is built from pairs the learner judged to share structure · DESIGN
74. **Just-in-time primitive from life events** — L028 × L483 · a logged life event can pull a primitive forward · DESIGN
75. **Retirement with spot checks** — L029 × O5602 · retired primitives get rare random hooks · DESIGN
76. **Discovered prerequisites via x-ray** — L033 × O4312 · 'step' causes reveal missing prerequisites, logged per primitive · BUILT (logged) / DESIGN (use)
77. **Decisive question in every session** — L040 ↑ O4302 · every session contains a decisive-question item · DESIGN (season 2 has two sessions built on it)
78. **Explorable model with two finds** — L041 × O4313 · every model states two things to find · BUILT
79. **Case contrast across eras** — L042 × O5115 · contrast pairs across centuries (Vienna 1846 × London 1854) · BUILT
80. **Primary artefact with a knowledge fence** — L044 × O5115 · the artefact is shown with what was known at the time · BUILT (London 1854 opening)
81. **Faded examples by evidence** — L046 × O6001 · worked parts fade as unaided hooks succeed · DESIGN
82. **Debug a wrong explanation in bosses** — L048 × O5201 · one boss item shows a plausible wrong diagnosis to debug · DESIGN
83. **Spiral reuse of generators** — L065 × O4904 · selection, loops and proxies recur in later seasons in new domains · BUILT
84. **Apoptosis of representations with n** — L067 × L079 · representations retire only after n ≥ 20 · DESIGN
85. **Homeostatic minutes with load ratio** — L068 × O6406 · weekly cap plus an acute-to-chronic load check; never a backlog · BUILT (caps) / DESIGN (ratio)
86. **Circadian gate with fail-safe** — L074 × O6916 · the sleep gate stays shut if the clock is uncertain · BUILT (gate)
87. **Speciation of confused primitives** — L082 × O4609 · when two cases of one primitive stop correlating, split it · EXPERIMENT
88. **Extinction log with reasons** — L083 × L493 · every retired or rejected idea is archived with its reason · BUILT (this registry)
89. **Dose controller with taper** — L092 × O7102 · weekly set point plus exam taper · BUILT
90. **Success-rate control per atom** — L093 × O4601 · target 70–85% first-try accuracy per atom · DESIGN
91. **Delay-aware bets** — L094 × O4103 · season bets scored after 30 days, never before · DESIGN
92. **Calendar feedforward with change freeze** — L098 × O7102 · no organ updates or new material in exam weeks · BUILT (gate) / DESIGN (freeze)
93. **Surprise-weighted beliefs** — L106 × O5401 · the ledger ranks revisions by surprise (confidence × wrong) · BUILT (non-guess errors shown)
94. **Redundant pictures for keystones** — L108 × O4609 · keystone primitives get two independent representations · BUILT (SHOW ME DIFFERENTLY)
95. **Mutual information between primitives** — L114 × O5615 · primitives whose items always co-vary are candidates for merging · EXPERIMENT
96. **Jewel preserved in compression** — L118 × O4505 · failed ideas are compiled with their original jewel (the miasma belief as held) · BUILT (London 1854)
97. **Summary test on receipts** — L123 × O4404 · the receipt's one-line summary must be derivable from logs · BUILT
98. **Prefetch tomorrow's warm-up** — L132 × O5401 · today's confident errors seed tomorrow's warm-up · DESIGN
99. **Parallel primitives in bosses** — L140 × L210 · bosses require two primitives at once · BUILT
100. **Hidden machinery, visible reasons** — L148 × L429 · the engine stays hidden; WHY THIS? shows its reasons · BUILT

## Generation 3 · 54 primitives that generate families of mechanisms

v1 (1–32, unchanged): 1. **Commit before you see** 2. **Name the bug** 3. **Two surfaces, one structure** 4. **Later
is the test** 5. **Remove the help** 6. **Price the confidence** 7. **Count, don't percent** 8. **Ask what filtered
this** 9. **Find the loop and its delay** 10. **Separate the number from the thing** 11. **Pick the observation that
splits hypotheses** 12. **Bind the future self** 13. **Stop at the margin** 14. **Life gates the machine**
15. **Isolate the organ** 16. **Grade the story** 17. **Preserve the jewel** 18. **Zoom on demand** 19. **Cause-specific
repair** 20. **Skip by proof** 21. **Interleave the returns** 22. **Reality counts** 23. **No headline number**
24. **Shuffle what can be exploited** 25. **Continue, never catch up** 26. **Myth as a lesson** 27. **Forge then
pre-mortem** 28. **Stakes before content** 29. **Label after concept** 30. **Distance-tagged transfer** 31. **Evidence
has an n** 32. **Every component earns its place**

New in OMEGA (each generates a family; the generating passes in brackets):

33. **Name the atom** — every step declares the capability it trains, so training can be balanced and measured (46)
34. **Three boxes first** — the minimum sufficient model before any detail (43, 61)
35. **Ask what would change the choice** — questions are valued by the decisions they can move (53)
36. **Reason inside the era** — a knowledge fence around every historical scene (51)
37. **Change the axis, gain a sense** — a representation change that makes a pattern visible is a new sense (47)
38. **Blind before named** — judge versions before any author or authority is shown (57)
39. **Unlabelled is the test** — capability is shown only when the chapter is hidden (52, 60)
40. **Beliefs have versions** — every committed belief is kept with what replaced it (54)
41. **Every metric has an adversary** — for each measure, the behaviour that games it is designed first (63, 72)
42. **The fix has side effects** — every intervention is checked for the harm it causes (68)
43. **Burden matches stakes** — the evidence demanded scales with what a wrong belief costs (69)
44. **Differential before diagnosis** — competing explanations listed before choosing (68)
45. **Fail safe, not open** — under uncertainty, the organ yields to medicine and sleep (72)
46. **Design for the tired day** — sessions must work at reduced attention (72)
47. **Evidence has a chain** — who collected, handled and retold each fact is part of the fact (69)
48. **Ideas have reproduction numbers** — ideas that generate later uses are worth more (70)
49. **Attention has a carrying capacity** — a ceiling on active primitives; new ones retire old ones (70)
50. **Periodise effort** — build, consolidate, rest, taper around the real calendar (71)
51. **Legible where it is used** — the medium the learner actually uses (a phone) sets the design limits (48)
52. **Close what you open** — no loop is left open to pull the learner back (44)
53. **Every model has a jurisdiction** — each primitive states where it must not be applied (68, 69)
54. **Measuring changes the measured** — observation and targets alter behaviour; design for it (67)

## Generation 4 · 23 systems whose output is new mechanisms

v1 (1–11): 1. **Misconception miner** 2. **Representation evolver** 3. **Case finder** 4. **Session linter / compiler**
5. **Hook-gap tuner** 6. **Dose tuner** 7. **Simulated-learner harness** 8. **Transfer-distance generator**
9. **Provenance checker** 10. **Pedagogy A/B governor** 11. **Registry of mechanisms**

New in OMEGA:

12. **Donor-domain compiler** — takes a field, extracts its load-bearing mechanisms, emits candidates with §119 identity; this registry's pass files and `build.py` are its manual prototype · PROTOTYPED
13. **Dedupe-and-merge engine** — resolves names, flags near-duplicates, refuses unreviewed collisions · IMPLEMENTED (`build.py`, test O3–O5)
14. **Adversarial metric generator** — for each metric, generates behaviours that score high but are bad, and turns them into tests (see `03_OBJECTIVE_AND_METRICS.md`) · DESIGNED
15. **Boss-world generator with review** — four mechanisms + setting + symptom recipes → a draft world; a human checks every claim · DESIGNED
16. **Possession-scene builder** — builds a scene from a dated knowledge fence and checks no later fact leaks in · DESIGNED
17. **Blind-pair generator** — from edit toggles or chart choices, emits pairs with stated criteria · PROTOTYPED (wordwork model)
18. **Legibility checker** — measures every label of every figure state on a 360-px phone; a generator constraint for all future figures · IMPLEMENTED (R34)
19. **Belief-ledger miner** — clusters confident wrong beliefs across sessions into proposals for new sessions · DESIGNED
20. **Question-key harvester** — collects the first questions experts ask in a domain into decisive-question items · DESIGNED
21. **Season-bet evaluator** — pre-registered bets scored after their delay; failed bets open revision tickets · DESIGNED
22. **Session FMEA generator** — lists how each session can fail and proposes mitigations before release · DESIGNED
23. **Prompt evolver** — the process in `03_PROMPT_LINEAGE.md`: attack a mission, find its generators, emit a better mission · PROTOTYPED (three generations run by hand)

## Generation 5 · 13 ontologies beyond tutor, curriculum, university, learning OS, knowledge system, assistant

v1 (1–7): 1. **Capability ecology** 2. **Personal science** 3. **Apprenticeship to reality** 4. **Authorship**
5. **Exocortex partnership** 6. **Question-driven life** 7. **Graduation by dissolution**

New in OMEGA:

8. **Capability chemistry lab** — not lessons but a lab where capability atoms are bonded into compounds and each bond is tested; a curriculum is a synthesis route
9. **Instrument, not teacher** — the organ is a measuring instrument pointed at his world model; teaching is what the instrument does to reduce its own error
10. **Belief repository** — his world model as a repository of versioned beliefs; learning is a commit that passes tests; forgetting is an unreviewed revert
11. **Decision companion** — the organ lives at decision points in life (not in the evening slot) and teaches only what the next decision needs
12. **Senses workshop** — the output is new perceptions (log scale, base rate, filter, loop, constraint, clutter), not knowledge
13. **Mechanism commons** — verified primitive–case pairs shared as a public good that any learner can compile from; the individual organ is a client

## Sixth-generation escape (§125): what would make the Renaissance Singularity itself look primitive?

1. **It still needs a nightly slot.** A successor would fire at the moment a mechanism is present in life (a queue,
   a dashboard, a risk number), for 30 seconds, and never at night. Design: the *decision companion* (Gen 5 #11) +
   moment prompts, gated by the same life rules. Blocked today by the no-notification rule; it would need an
   opt-in, calendar-aware channel that cannot nag.
2. **It still authors content by hand.** A successor would compile sessions from the mechanism commons and from his
   own logs, with provenance checked by machine and a human reviewing only the claims that changed. Design: donor
   compiler (Gen 4 #12) + boss generator (#15) + review gate.
3. **It still measures one learner.** Every conclusion here is n = 1. A successor would pool anonymised pedagogy
   results across consenting learners so the representation tournament has real power.
4. **It still treats the learner as the only mind.** A successor would pair two learners on the same unlabelled world
   with committed answers, so disagreement comes from a person.

## Seventh-generation escape (§126): the same question, asked again

What would make the sixth-generation design look primitive? **That it is still an app.** The end state is a person who
carries the senses and questions without any organ, a few friends who argue with committed predictions, and a public
commons of verified mechanisms that anyone can compile from. The seventh generation is therefore not a system to
build but a condition to measure: *how many of his decisions this month used a primitive, unaided, without the app
having been opened?* That number can only be collected by asking him, rarely, with the answer checked against his
own logs. The search stops here, because the next escape would remove the thing doing the measuring.
