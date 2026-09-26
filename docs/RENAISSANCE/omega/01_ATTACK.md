# OMEGA · 01 · Attack on the mission: assumptions, kills, generalisations, generators

§0 says the constitution is genetic material, not the design. This file does what it asks: names the assumptions it
makes, kills the ideas that fail, generalises the ones that have a deeper form, and reduces ~180 sections to the
small set of generators that produce them. Where the constitution and this file disagree, this file explains why and
the build follows this file.

## 1. The constitution in one paragraph (so the attack has a target)

Build, inside the existing medical-study app, a separate organ that opens after the day's medicine and replaces the
fragmented stack of books, courses, videos, podcasts and reading lists with one daily experience: one question, one
CONTINUE, a handful of helpers. Behind it, an extreme machine that compiles civilisation's mechanisms, models the
learner, invents representations, tests transfer, protects life and improves itself, recursively. Measure durable,
transferable, generative capability per life-minute, not pages or hours. Refuse fake novelty, flattery and slop.

## 2. Assumptions the constitution makes (and what happens to each)

| # | Assumption | Verdict | Why |
|---|---|---|---|
| A1 | The intellectual-life stack can be *replaced* by one organ | **Weakened** to *absorbed where it teaches, left alone where it lives* | Reading a novel, a concert, a friendship are experiences, not delivery channels for mechanisms. The organ replaces the *curriculum-shaped* parts (reading lists, courses, summaries, "books I should read") and points back to life for the rest (§5, §6). |
| A2 | More machine sophistication yields more human capability | **Rejected as stated** | Capability is bounded by the learner's minutes, sleep and attention. Past a point machine effort buys nothing; the build caps sessions, not effort. Sophistication is only justified by a measured gain at equal minutes. |
| A3 | Capability per minute is the right objective | **Replaced** (`04_OBJECTIVE_AND_METRICS.md`) | A ratio rewards cheap, shallow gains and punishes the slow compounding ones. The replacement is a vector judged at equal or fewer minutes, plus the *rate* at which new domains are entered. |
| A4 | A single learner's data can validate the system | **Rejected** | n = 1, no control group, carry-over effects. The honest ceiling is within-person, counterbalanced comparisons with raw scores and no p-values (`05_BENCHMARKS.md`). |
| A5 | Recursive self-improvement is available now | **Weakened** | Every loop needs delayed outcomes (30+ days) to judge a change. The loop exists as machinery (bets, governor, linter, harness); its *speed* is set by forgetting curves, not by compute. |
| A6 | "Singularity" is a property of the architecture | **Kept, fenced** | The architecture can meet listed criteria (§155); the word says nothing about the learner. Every claim is labelled with the status ladder of §181. |
| A7 | The frontend can stay "absurdly simple" while the backend grows | **Kept, enforced by tests** | Simplicity decays unless tested. Controls per screen, 44-px targets, 10-px labels at 360 px and the fixed helper row are tests (R3, R24, R34), not intentions. |
| A8 | Current AI can author the content | **Rejected for claims, kept for structure** | A model may draft structure; every factual claim needs a source id and human review. A language model's fluency is the red-team "fake genius" (§130) in content form. |
| A9 | The learner wants to become a polymath | **Unverified** | The build serves a medical student and founder with finite time. Breadth is justified only by transfer into his medicine and company, and by his own choice. |
| A10 | Everything must be inside the app (§3) | **Kept with an exception** | Real-world experience (measuring a queue, testing a forge) is required, not replaceable. The app never links out, and it also never pretends a screen is a museum. |
| A11 | Taste, art and music can be taught like mechanisms | **Split** | Communication taste (clarity, hierarchy, data-ink) is testable with blind pairs and stated criteria: built in season 2. Art that deliberately breaks rules is not; it is left as experience, with the limit stated in the session. |
| A12 | The founder's excitement is evidence | **Rejected** (§144) | Nothing here is marked extraordinary because it was requested. 806 of 863 kept registry candidates name an ancestor. |

## 3. Ideas killed (with the reason)

1. **"Replace sleep, friendship, training with more intellectual time"** is never proposed, but several mechanisms
   drift there (infinite feeds, surprise-seeking, streaks). Killed by the gate (sleep, exam weekend, weekly cap, one
   session a day) and tested (R11, R16, R17).
2. **A single "Renaissance Yield" product formula** (§84, §153): one noisy term dominates and any term can be gamed.
   Replaced by a vector reported with n (`04_OBJECTIVE_AND_METRICS.md`).
3. **Simulated conversations with historical figures**: fabricated words attributed to real people (TRUTH). The
   possession mode reasons *inside an era's knowledge*; it never puts words in a dead person's mouth.
4. **LLM tutor that answers**: removes the effort that creates learning and makes independence untestable (Bastani
   et al. 2024 on AI tutors without guardrails). No answer channel exists before commitment.
5. **Brain training, learning styles, 20-minute attention cycles, growth-mindset messaging as a lever**: contradicted
   or unsupported (registry rejections, EVID 29).
6. **Infinite alien feed / encyclopedia autocompile**: fabrication risk and backlog by another name.
7. **Dashboards of personal metrics**: §165 "no dashboard hell". Numbers appear only in receipts and on demand.
8. **"Absorb every field"**: coverage is the education ontology's disease. Seasons teach six generators deeply; breadth
   is tested as transfer, not toured.

## 4. Ideas generalised

| Constitution idea | Generalisation | Where it lives now |
|---|---|---|
| Three-boxes skill (§9) | **Minimum sufficient model**: the smallest set of mechanisms that explains everything observed, with non-uniqueness shown | season 2 sessions 7 and 12; mechanism board |
| Historical possession (§35) | **Knowledge fence**: any reasoning task can be run inside a stated set of known facts (past, future, another field) | season 2 session 9 |
| New-sense generator (§22) | **A representation change that makes a pattern visible is a new sense** (log scale, counts, filters, loops, constraints, clutter) | seasons 1–2; `05_GENOME_AND_ENGINES.md` §3 |
| Taste engine (§55) | **Blind before named**: judge versions before any authority is shown, then learn a criterion that can be checked | season 2 session 11 |
| Belief version control (§44) | **Every committed answer before teaching is a belief on record**, kept with what replaced it | engine: belief ledger in WHY THIS? |
| Capability genome (§18) | **Atoms tag steps, not people**: the genome is a property of the training record, never a label on the learner | engine `ATOMS`; every session declares atoms |
| Boss worlds (§73) + alien test (§70) | **Unlabelled is the test**: capability exists only where the chapter is hidden | season 2 session 12 |
| Stop rule (§85) | **Life gates the machine**: the organ yields to medicine, sleep, exams and a weekly budget, and shrinks itself before it shuts | gate, tested R11–R18 |
| Self-improving pedagogy (§90–93) | **One change at a time, judged after its delay, logged with its method** | governor built for picture order with a control arm and a self-switch-off (R36–R37) |
| Civilization compiler (§17) | **Compile to mechanisms with sources; recompile when a source changes** | registry passes 45, 56 |

## 5. Generators: the smaller set of principles that produce the mechanisms

Running the constitution's ~180 sections and the 1,003 distinct registry candidates through "what is this an instance
of?" first left eleven generators (G1–G11). A check on a random sample (below) found three more (G12–G14). Almost
every kept mechanism is one generator applied to one situation.

| # | Generator | Instances (examples) |
|---|---|---|
| G1 | **Commit before you see.** An answer given before the explanation is the unit of evidence. | predictions, confidence tiers, belief ledger, possession mode, blind pairs, pre-registered season bets |
| G2 | **Later and unaided is the test.** | hooks, alien problems, boss worlds, dependence ratio, assimilation states, retirement |
| G3 | **Structure over surface.** Two surfaces, one mechanism. | contrasts, wormholes, unlabelled worlds, same-shape detector, cross-era pairs |
| G4 | **Compress to the load-bearing part; preserve the jewel.** | three boxes, minimal models, one-sentence truth, jewel registry, primary numbers |
| G5 | **Name the error, repair its cause.** | bug classes, x-ray causes, misconception miner, fault trees, M&M review |
| G6 | **Choose what changes the decision.** | decisive question, value of information, differential diagnosis, triage, admissibility |
| G7 | **Every measure has an adversary.** | Goodhart session, no composite score, adversarial metric generator, benchmark red team |
| G8 | **Life gates the machine.** | gate, weekly cap, taper, fail-safe default, one session a day, kill switches |
| G9 | **Provenance or it didn't happen.** | graded sources, knowledge fences, chain of custody, recompile on source change |
| G10 | **Representation is a sense.** | log scales, counts, icon arrays, explorable models, blind chart pairs, phone-legible figures |
| G11 | **Graduate by dissolving.** | scaffold fading, retirement, authorship, reality replacing lessons, the seventh escape |
| G12 | **Reality is the score.** Use outside the app outranks any score inside it. | reality taps, forges, moment prompts, life cases, medicine as a donor |
| G13 | **The machine carries the effort; the human carries the judgment.** | no open prompts, graded-part forges, bounded self-explanation, linters, the complexity firewall |
| G14 | **Fail safe, degrade gracefully.** | fail-safe gate, offline-first, partition tolerance, crash recovery, text fallback for figures |

**Test of the reduction.** A seeded random sample of 20 kept candidates (seed 20260926, `registry/generator_sample.tsv`)
was classified by hand against G1–G11: 12 fit one generator cleanly, 4 loosely, 4 not at all. The four misses (moment
prompts, symbiosis with medicine, static analysis for open prompts, partition tolerance) were the evidence for G12–G14.
After adding them, 20 of 20 fit, with "symbiosis with medicine" straddling G8 and G12 and five fits still loose.
The sample is small and the classifier is the author, so this shows the reduction is plausible, not that it is complete.

## 6. Escaping the ontology of "education"

The constitution says *after education*, then describes a better education (sessions, curricula, pedagogy). The escape
is not a new product noun; it is a change in what the organ is *for*:

- **Education** moves content into a head and certifies it.
- **This organ** measures and changes one person's *world model and senses* against reality, then gets out of the way.

Consequences built into the design: no certificates (the record is private evidence), no syllabus debt (nothing is
"behind"), the unit is a mechanism that transfers, the score that matters is use outside the app, and the end state
is dissolution (the seventh escape in `02_REGISTRY.md`). The thirteen ontologies in `02_REGISTRY.md` are the candidate
names for what that is; *instrument, not teacher* (Gen 5 #9) is the one the current build is closest to.

## 7. The intellectual-life stack: what each fragment becomes

| Fragment (§1) | Becomes | Status |
|---|---|---|
| Books, "books I should read" | compiled into mechanisms with one preserved jewel; no reading list exists | seasons 1–2 IMPLEMENTED; no list UI (test) |
| Articles, papers | primary numbers with source grades inside sessions | IMPLEMENTED (provenance per claim, R20) |
| Lectures, courses, MOOCs | replaced by 20–25-minute sessions of committed decisions | IMPLEMENTED |
| Podcasts, YouTube, documentaries | not replaced: entertainment stays life; mechanisms from them can be compiled if sourced | DESIGNED |
| Wikipedia, rabbit holes | frontier cards and a counterless question vault | DESIGNED (frontier text in GO DEEPER exists) |
| Museums, art, music, film | taste sessions with lawful public-domain material; the experience itself stays in life | PARTLY (communication taste built; art/music blocked by fetch limits here) |
| Memory systems (Anki) | hooks inside later sessions, no deck | IMPLEMENTED |
| Personal education plans, FOMO | the organ carries the plan; no counter, no "behind" | IMPLEMENTED (R18) |
| Writing | clarity criteria and edit models; long-form writing left to life | PARTLY |
| Self-improvement content | replaced by forges tested against reality | IMPLEMENTED |

## 8. Where this attack is itself weak

- The generator reduction was checked on one random sample of 20, classified by its own author; it failed first (16/20) and was repaired, which is a reason to expect more missing generators.
- The ontology escape is argued, not demonstrated: the only evidence would be months of his behaviour.
- Most of the kills rest on published evidence about populations, not on this learner.
