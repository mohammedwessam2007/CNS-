# Renaissance · 01 · Research: the problem, the landscape, the evidence

Status: written 26 Sep 2026 for the first implementation (Renaissance v1, inside INTELLECTUALITY). Every citation below
was checked against a publisher, PubMed, ERIC or the author's own page during this session unless it is marked
**(not re-checked)**. Evidence grades: **A** = meta-analysis or many replications; **B** = one strong randomized study
or a consistent small literature; **C** = observational, anecdotal or contested.

What could not be done: Project Gutenberg and Wikimedia are blocked from this build machine (proxy 403). The rule for
this project is that blocked hosts are reported, not routed around, so no primary text was downloaded. The first season
therefore uses **primary data** (published tables, verified through search results) and **paraphrased** classical
scenes, never quotations typed from memory. See `07_SEASON_1.md`.

---

## A. The problem universe

The request, stripped of its language: for about 20–30 minutes a day, after medicine is done, give one learner the
largest durable gain in the ability to **understand, predict, explain, judge and create** across domains, without
turning it into a second degree, a reading list or a habit that eats his life.

The hard parts, in order of difficulty:

1. **Far transfer is rare.** Most "learn X to get smarter at everything" claims fail when tested (Sala & Gobet 2017,
   chess, music and working-memory training: small to null far transfer; Barnett & Ceci 2002 taxonomy of why transfer
   claims are hard to evaluate). A system whose pitch is general capability must measure transfer, not assume it.
2. **Feeling of understanding ≠ understanding.** People overrate how well they can explain mechanisms
   (Rozenblit & Keil 2002, the illusion of explanatory depth). Polished, fluent lessons raise the feeling faster than
   the skill; students in active-learning classes *felt* they learned less while learning more (Deslauriers et al.
   2019, PNAS 116:19251 **(not re-checked)**). Beautiful explanations are the main hazard for this product.
3. **Memory decays without retrieval.** Anything taught once is mostly gone in weeks unless it is retrieved again
   (spacing: Cepeda et al. 2006 **(not re-checked)**; retrieval: Adesope et al. 2017).
4. **Time is the binding constraint.** 25 minutes a day is ~150 hours a year: roughly one university course.
   The design question is what to spend 150 hours on, not how to add more.
5. **An AI teacher can make the learner weaker.** Unguarded GPT-4 help raised practice scores and *lowered* exam
   scores once the help was removed (Bastani et al. 2025, PNAS 122:e2422633122). Guardrails (hints, not answers)
   removed most of the harm. Any Renaissance helper must be designed against dependence.
6. **Truth and law.** A self-contained course needs lawful material (public domain, licensed, short quotation,
   original teaching) and must not invent quotes, data or history.

## B. Existing-system landscape (what exists, what it proves, what we take)

| System / method | Evidence | What it does well | Where it stops | Take / leave |
|---|---|---|---|---|
| Retrieval practice (testing effect) | **A** Adesope, Trevisan & Sundararajan 2017, *Rev Educ Res* 87:659 (practice tests beat restudy and all other comparisons) | Durable memory | Tests what was taught; transfer only when items require it | **Take**: every session ends with retrieval hooks that reappear later |
| Spacing | **A** Cepeda et al. 2006, *Psychol Bull* 132:354 **(not re-checked)** | Retention across weeks | Needs a scheduler and returns | **Take**: hooks reappear at ~1, 7, 30 days, woven into later sessions |
| Interleaving | **A** Brunmair & Richter 2019, *Psychol Bull* 145:1029 (g = 0.42; strongest for visual categories, reversed for word lists) | Discrimination between similar kinds | Not universal | **Take** for "which mechanism is this?" tasks across sessions |
| Productive failure (problem → instruction) | **A** Sinha & Kapur 2021, *Rev Educ Res* 91:761 (g = 0.36; 0.37–0.58 at high fidelity) | Deeper conceptual grasp | Worse for young children and some domain-general skills | **Take**: every session opens with a bounded prediction before the explanation |
| Prediction before outcome | **B** Brod, Hasselhorn & Bunge 2018, *Learn Instr* 55:22 (surprise after a committed prediction predicts learning) | Makes the reveal stick | Needs a real commitment | **Take**: predictions are committed with a confidence tap |
| Curiosity states | **B** Gruber, Gelman & Ranganath 2014, *Neuron* 84:486 (better memory for material learned while curious, even incidental material) | Motivation that also helps memory | Lab effect on trivia | **Take**: sessions open on a question he cannot answer yet, not a topic name |
| Case comparison / analogical encoding | **A** Alfieri, Nokes-Malach & Schunn 2013, *Educ Psychol* 48:87 (57 experiments) | Schema abstraction → transfer | Needs aligned comparisons | **Take**: every core idea is shown in two surface-different cases side by side |
| Self-explanation prompts | **A** Bisra et al. 2018, *Educ Psychol Rev* 30:703 (g = 0.55) | Understanding of mechanisms | Open prompts are costly and vague | **Take in bounded form**: pick-the-step / order-the-chain, not "explain in your own words" |
| Expertise reversal | **A** Kalyuga et al. 2003, *Educ Psychol* 38:23 **(not re-checked)** | Scaffolds help novices, hurt experts | — | **Take**: "I already get this" → short challenge → skip; scaffolds decay |
| Learning styles (visual/verbal learner) | **A against** Pashler et al. 2008, *PSPI* 9:105 **(not re-checked)** | — | No support for matching teaching to a style | **Leave**: preferences are logged per concept and representation, never as a personality label |
| Deliberate practice | **A** Macnamara, Hambrick & Oswald 2014, *Psychol Sci* 25:1608 (explains 26% games, 21% music, 18% sports, 4% education, <1% professions) | Skill in well-defined domains | Weak in open domains | **Leave as a slogan**; keep only immediate, specific feedback |
| Far-transfer brain training | **A against** Sala & Gobet 2017, *Curr Dir Psychol Sci* 26:515 | — | Little far transfer | **Leave**; claims of general intelligence gains must be measured by alien problems |
| Forecasting training (calibration) | **B** Mellers et al. 2014, *Psychol Sci* 25:1106 (probability training, teams and tracking improved calibration and resolution) | Calibrated judgment | Domain of geopolitical questions | **Take**: confidence on every committed answer; Brier score and a calibration curve over time |
| Natural frequencies | **A** Gigerenzer & Hoffrage 1995, *Psychol Rev* 102:684 | Bayesian reasoning without formulas | — | **Take**: session "The test says positive" |
| Intelligent tutoring systems | **A** VanLehn 2011, *Educ Psychol* 46:197 (step-based ITS d = 0.76; human tutoring d = 0.79; the "2-sigma" was not found) | Step-level feedback | Expensive authoring, narrow domains | **Take**: every wrong answer is pre-diagnosed (misconception → repair), step by step |
| LLM tutors, guarded | **B** Kestin et al. 2025, *Sci Rep* 15:17458 (AI tutor built on pedagogy best practice: more learning in less time than active-learning class, physics) · **B** De Simone et al. 2025, World Bank WPS (Nigeria, six weeks: +0.31 SD overall, +0.23 SD English) | Scale, pacing | Needs guardrails; results specific to designed tutors | **Take the design lesson**, not the tool: a scripted, pre-diagnosed tutor. No free chat in v1 |
| LLM help, unguarded | **B against** Bastani et al. 2025, *PNAS* | — | Harms learning when removed | **Guard**: unaided checks every few sessions (anti-dependence test) |
| Knowledge tracing | **B** Corbett & Anderson 1994 BKT **(not re-checked)**; Piech et al. 2015 DKT **(not re-checked)** | Mastery estimates | Needs many items per skill | **Adapt**: per-capability evidence log with decay; no fake precision on 6 sessions |
| Spaced-repetition schedulers | **B** Settles & Meeder 2016, ACL (half-life regression, Duolingo) · Ye, Su & Cao 2022, KDD (SSP-MMC, the basis of FSRS) | Efficient review timing | Built for flashcards | **Adapt**: half-life idea for hooks; the learner never manages cards |
| Mnemonic medium | **C/B** Matuschak & Nielsen, *Quantum Country* (2019): review prompts embedded in an essay, spaced by email; authors report most readers retain most of 112 prompts for weeks with ~30–90 min total practice | Memory for a whole essay without flashcard management | Author-reported, not an RCT | **Take**: memory lives inside the experience (retrieval hooks in later sessions) |
| Explorable explanations | **C** Bret Victor (2011, "Explorable Explanations"); Nicky Case, *The Evolution of Trust* (2017) | Models you can poke | Little controlled evidence | **Take**: one interactive model per session, built to make a prediction testable |
| Great Books seminars | **C** (no causal evidence of transfer found in this search) | Primary texts, discussion | Time-heavy; open-ended discussion | **Take the jewel principle** (authentic primary material), **leave** the reading load |
| Summary products (Blinkist-style) | **C** | Fast gist | No retrieval, no transfer, no primary experience | **Leave**; they are the failure case "summary ≠ understanding" |
| Brilliant / Khan / Duolingo | **C/B** (product evidence mostly internal) | Interactive practice, streak mechanics | Streak guilt; topic silos | **Take** interactivity, **leave** streak pressure |

## C. What the evidence says Renaissance must be (design consequences)

1. **Predict → reveal → repair** is the core loop (productive failure, prediction effect, hypercorrection).
2. **Two cases, one mechanism** is the transfer engine (case comparison), followed by a **far case** the session did not
   teach (measured transfer).
3. **Memory is carried by later sessions**, not by a flashcard chore (spacing + retrieval, mnemonic-medium idea).
4. **Every answer carries a confidence**; calibration is a first-class outcome (forecasting evidence).
5. **Scripted, pre-diagnosed branching** instead of free chat in v1 (ITS evidence; the dependence result).
6. **No learning-style labels.** Representation choice is logged per concept and tested (Pashler et al.).
7. **Scaffolds decay and are removed on purpose**; capability without support is the real score.
8. **The stop rule is part of the product**; minutes are budgeted and the system shrinks itself when life needs it.

## D. Sources that the first season stands on (content facts, checked)

- Semmelweis's clinic data 1841–1846 (First Clinic 7.8–15.8% maternal deaths a year vs Second Clinic 2.0–7.6%;
  1848 First Clinic 12.7 per 1000 after chlorine hand-washing): Loudon I. 2013, *J R Soc Med*, via the James Lind Library.
- Abraham Wald, *A Method of Estimating Plane Vulnerability Based on Damage of Survivors* (Statistical Research Group,
  Columbia, 1943; reprinted by CNA, 1980; DTIC ADA091073).
- Goodhart's 1975 wording: "Any observed statistical regularity will tend to collapse once pressure is placed upon it for
  control purposes" (published in *Monetary Theory and Practice*, 1984, p. 96). Strathern M. 1997: "When a measure
  becomes a target, it ceases to be a good measure."
- Hanoi rat bounty, 1902: Vann M. 2003, "Of Rats, Rice, and Race", *French Colonial History* 4.
- English NHS targets and gaming: Bevan G. & Hood C. 2006, *Public Administration* 84:517.
- Commitment contracts: Giné, Karlan & Zinman 2010, *AEJ: Applied* 2(4):213 (CARES: 11% take-up; +3 percentage points
  passing the 6-month test; effect persisted at a surprise 12-month test). Thaler & Benartzi 2004, *JPE* 112:S164
  (Save More Tomorrow: 78% joined when offered; saving rate 3.5% → 11.6% over 28 months).
- Feedback and delay: Sterman J. 1989, *Management Science* 35:321 (misperceptions of feedback; the Beer Game).
- Bank runs as a self-fulfilling loop: Diamond D. & Dybvig P. 1983, *JPE* 91:401 **(not re-checked)**.
- Base rates: Gigerenzer & Hoffrage 1995; Eddy D. 1982 (physicians' estimates for a positive mammogram far above the
  Bayesian ~8%; an informal survey, graded C, but the error pattern replicated). Sally Clark case: Meadow's "1 in 73
  million" (squared 1 in 8,543), Royal Statistical Society statement (2001), conviction quashed January 2003.

## E. What this research does not settle (carried into `03_ARCHITECTURE.md` → Open unknowns)

- Whether a 25-minute cross-domain session produces **far** transfer for this learner. Only his own delayed
  alien-problem scores can say. The instrument is built; the answer needs months.
- Whether Egyptian-Arabic "sticky" lines help or distract. Logged per session; no claim yet.
- Whether interactive models beat static diagrams for him per concept. The representation log will show it.
