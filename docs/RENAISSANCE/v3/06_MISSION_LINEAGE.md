# v3 · 06 · Mission lineage, principles, red team and the unknown-unknown pass

§7, §127, §181–182, §198–208, §250–259, §273–275, §278–281, §288–298. The earlier lineage (the OMEGA constitution →
v2 → v3 → final) is in `../omega/03_PROMPT_LINEAGE.md`; this file does the same for ABSOLUTE COMPLETION and records
what each version found when it was used as an auditor against the build.

## 1. Attack on the ABSOLUTE COMPLETION mission

| Assumption in the text | Verdict | What the build does instead |
|---|---|---|
| "100% controllable completion" is reachable in one run | **false for content volume**: §169 and §235 demand an open-ended syllabus | requirements carry a *kind*; frontier volume is never counted as closed, and the ledger says so |
| A coverage oracle can find every omission | **partly**: it finds omissions against the texts, the registry and the evidence; it cannot find what nobody wrote down | a separate unknown-unknown pass (§6 below) and a red team (§5) |
| Sealed items can be kept from the lesson author | **not by people** in a one-author build | kept by mechanism: obfuscation, hashes registered before any answer, a six-word firewall (S1–S2); a human examiner queued |
| Every requirement can be closed by code | **false** for writing and explanation quality, real conversations, years of change | the empirical queue, with dates and protocols; nothing invented |
| The Vercel 403 is transient | unknown | verification attempted only through authorised paths; the outcome is recorded as it is |
| Self-improvement up to L14 can run inside the app | **L12–L13 need a generator** | blocked on a credential, with the gates any generated content would face already built |

## 2. Mission v2 (rewritten after the attack)

1. Recover the truth first; the oracle, not memory, says what exists.
2. One requirement graph; every section maps to it; every requirement has a kind that defines "closed".
3. Closed means evidence on this head: tests that ran and passed, documents that exist, symbols that are there.
4. Four classes, kept apart: controllable, external, empirical, frontier. Only controllable counts toward 100%.
5. Possession, not familiarity: every rung earned by an answer; the top rung sealed.
6. The primary thing first; compress the rest; say what was not read.
7. Every measure has an adversary: counterfeit learners for items, fabricated claims for the oracle.
8. Every adaptation is a trial with a control arm, a judge and an off switch; nothing grants itself authority.
9. Life gates the machine.
10. No claim beyond evidence; empirical results only from real time.

**Used as an auditor, v2 found:** the Karamazov track had no criticism or discussion rung (fixed: t12–t13); two
bootloader sessions met no counterexample (fixed); two registered quotations were never shown (fixed: cited where
discussed); the step-order test silently assumed whole sessions once L4 existed (fixed).

## 3. Mission v3 (after v2's use)

Adds three rules the audit showed were missing:

11. A test must measure what its title claims. (The region check counted a citation of the *Archaeological Survey
    of India* as South Asian content; it now reads teaching text only, and a real case was added.)
12. When a trial changes the lesson, every other test must say which arm its fixture is on.
13. A mention is not a setting. Coverage has depth, and the ledger shows it.

**Used as an auditor, v3 found:** global coverage was overstated (now open in the ledger, with the next sessions
named); the learner could not overrule the compiler (fixed: DO THIS ONE INSTEAD, test C6).

## 4. The final evolved meta-mission (artifact 50)

> Map every demand to evidence. Close what code, content and tests can close; attack each closure with counterfeit
> learners and counterfeit claims; name what cannot be closed and why; queue what only time can show, with its date
> and protocol; keep the frontier open on purpose. Never let a title claim more than its test, a mention stand for a
> setting, or a machine decide over the person it serves. Stop when the ledger, not the author, says the controllable
> work is done, and say plainly what the ledger does not cover.

It runs as `tools/renaissance/oracle.js` plus `tests/coverage_oracle_test.js` on every regression.

## 5. The principles, recovered and retested (§181–182)

OMEGA reduced its registry to 14 generators (`../omega/01_ATTACK.md` §5). Retested against the new requirement
families:

| New family | Reconstructed from | Missing? |
|---|---|---|
| Cultural possession | G1 commit before you see · G2 later and unaided · G4 preserve the jewel · G9 provenance | no |
| Cultivation without pretension | G13 machine carries effort · G7 every measure has an adversary (pretension is a diagnosed error) | the real test is another person → **G15** |
| Plural models, source conflict, anti-monoculture | — | **G16** |
| Compounding over a lifetime | G11 graduate by dissolving | the cost of the next capability falling → **G17** (candidate) |
| Self-adjustment L1–L14 | G7 · G8 life gates the machine | no |
| Completion discipline | G9 · G7 | no |

**Compression test (§182)**, run for this file: a seeded random sample of 20 kept registry candidates (seed
20261001) classified against G1–G14: 11 fit cleanly, 6 loosely, 3 not at all (*Human mentors*; *Echo-chamber
breaker*; *Disputes as drama*). The misses are exactly what G15 and G16 name:

- **G15 · Other minds are the stronger test.** A person who knows the work, a real conversation, a mentor.
- **G16 · Plural by default.** Rival models and traditions stay alive until evidence separates them.
- **G17 (candidate) · Compound.** A capability should lower the price of the next; untested by the sample.

With G15–G16 the sample fits 20 of 20 (6 loosely). The classifier is the author and the sample is small: the
reduction is plausible, not proven.

## 6. Principles and confusions (§198–208, §288–298), each with its guard

| Principle | Enforced by |
|---|---|
| Simple is not childish (dignity) | the vocabulary firewall keeps the technical term and its limit (R20) |
| Joy is a signal, not the only one | THIS DIDN'T CLICK and GO DEEPER are logged; nothing optimises them alone |
| Beauty survives compression | *read whole* when a summary would delete it (compile map); the whole poem |
| Pain is not rigour; ease is not shallowness | dose and bridges on demand; transfer items stay hard (R21) |
| Knowledge is not intelligence | the vector measures transfer and orientation, not recall (L1) |
| Name recognition is not possession | the ladder (L4) |
| Novel wording is not a novel idea | registry novelty labels with ancestors (O7) |
| Fluency is not correctness | confidence scored against outcomes (R7, F1) |
| Completion is not transformation | receipts report delayed, unaided use, not steps done |
| A large architecture is not recursive growth | trials are judged on outcomes; the ledger counts evidence, not files |
| The machine eats the library; the human inherits the civilisation | the compile map carries what was not read |
| The system returns time to life | the gate, the weekly stop (R16–R17) |
| Do not summarise the masterpiece out of the masterpiece | passages whole; §217 checklist (V9) |
| Train powerful thinking, not smart-sounding output | counterfeit learners; pretension is an error (R35, S3) |
| Ask how much he changed, not how much he consumed | velocity and the 90-day delta (L2, P1–P3) |
| Sovereignty: capability never grants authority | kill switches; DO THIS ONE INSTEAD (R19, E3, C6) |
| A beautiful false model is a failure | provenance, contested marks, counterexamples (V10) |

## 7. What would a stronger model miss? (§259) — and the guard built

| Failure mode | Guard |
|---|---|
| Verbose documentation instead of implementation | the oracle closes a build requirement only with code and a passing test (CO5 "placeholder") |
| Fake novelty | novelty labels with ancestors (O7) |
| Lossy compression | compile map names what is not read; V11 texture rules |
| Shallow source research, unverified claims | quotation records say how each was checked; half-life re-verification (CO10) |
| Too many agents, too many abstractions | one engine file, one requirement graph; no agents used in this build |
| No real content | sixteen playable season-3 sessions, each run to the end (V6) |
| Weak UX | phone runs, contrast, keyboard, 44-px targets (V4, A1, R24) |
| Simulated tests that don't reflect humans | stated: every test is a machine test; the human outcomes are in the empirical queue |
| Optimising what is easy to measure | nothing is optimised on in-session scores; trials are judged on transfer and later recall |
| A test title that claims more than it checks | found twice in this build (the region check, the step-order fixture) and fixed; rule 11 above |

## 8. Final red team (§278)

| Hostile reviewer | Attack | Result |
|---|---|---|
| Learning scientist | multiple choice cannot measure explanation or writing; n = 1 has no control group | conceded: stated as not measured (`04_MEASUREMENT.md` §2); within-person trials with control arms are the best available |
| Literary scholar | 88 minutes is not reading Karamazov; Garnett is dated | three chapters are named to read whole; the full-reading comparison is queued (`e-bench`); the translation's age is stated |
| Mathematician | Euler proved only necessity | the session has "What Euler did not prove" (Hierholzer, 1873) |
| Historian | the translation movement as one cause | three explanations weighed on six pieces of evidence |
| Art critic | no actual artworks are shown | true: lawful images are the licensed/CC rights class, empty so far; the frontier names it |
| Musician | sine tones are not music: no timbre, no performance | true: listening trains structure only; recorded performance waits for licensed audio |
| UX engineer | hidden options (L7) could confuse | labelled button, keyboard reachable, DONE always available; real-user testing is empirical |
| Security engineer | sealed items are obfuscated, not encrypted; the record is editable | true and stated: sealing prevents accidental exposure, not a determined reader; the only user is the learner; no secrets ship in the client |
| Copyright reviewer (not legal counsel) | Garnett, Freud, Nabokov | Garnett 1912 is public domain; critics quoted briefly with citation; no image or recording copied |
| Benchmark designer | same author for items and lessons; 13 heuristics are not all heuristics | mechanism firewall; the counterfeit list grows over time; a human examiner is queued |
| Sceptic | the ledger grades itself | its rules are code; seven fabricated claims are rejected every run (CO5); the committed ledger must equal a fresh run (CO8); the section map is readable in one file |
| Power user | "I can't choose what to study" | **fixed** in this pass: DO THIS ONE INSTEAD (C6) |
| Beginner | "likelihood ratio" on day one of the trial | plain idea, Egyptian-Arabic hook and definition in the vocabulary sheet; the model teaches by switching evidence on and off |

## 9. The unknown-unknown pass (§251–252, §279)

Donor search across the listed fields; only real mechanisms transferred (§252), each with where it went:

| Donor | Mechanism | Used as |
|---|---|---|
| Immunology | challenge with a harmless antigen to test the response | counterfeit learners and fabricated claims attack the instruments |
| Ecology | half-life and turnover | the re-verification schedule (CO10) |
| Control theory | a controller that is itself audited, with damping after a false adoption | L14: rollback and caution ×1.5 |
| Distributed systems | merge, not overwrite | import of the record from another device (D1) |
| Operating systems | kill switches, safe defaults | the organ, trials and probes each switch off (R19, E3) |
| Compilers | an intermediate representation checked before emission | the session object (C5) and schema tests |
| Law and evidence | burden of proof, likelihood ratios | the trial session; the oracle's "contradicted by evidence" |
| Mechanism design | an agent should not grade its own work | the oracle's rules are code, attacked every run |
| Linguistics | a language as access to a culture | the language portal (frontier plan) |
| Anthropology | fieldwork: the other person is the instrument | G15; the real-talk tap (F3) |

Questions from §279, and the gap each exposed:

- *A 2035 designer:* no voice conversation partner and no generated content → L12–L13 blocked on a credential;
  the provider-neutral design is ready.
- *A great novelist:* he writes nothing of his own at length → writing is not measured; forges stay short. Open.
- *A mathematician:* one proof is not a mathematics organ → the frontier queue names place value and zero next.
- *A musician:* no performance → licensed audio needed.
- *A child:* "where are the real pictures?" → the empty rights classes.
- *Mohamed at 70:* "did it make me read the whole books?" → the compile map's named readings; checkable only then.
- *A ten-year user:* "it never let me choose" → fixed now (C6).

## 10. The meta questions (§280–281)

**If this worked perfectly, what would still limit him?** Other people. Every instrument here is solitary; the
strongest tests of cultivation, taste and argument are conversations with people who know more. The design answer is
G15: instruments that start from real talk (F3) and a human examiner for the reader test.

**What would make this architecture obsolete?** A system in which his own questions, not a compiler, generate the
next experience, and the machine's role is to fetch, check and set up tests of what he wants to know. The current
design moves toward it (the compiler cedes to his choice; forges become projects), and the ledger will show when the
compiler is doing less.

## 11. Autonomy log (§187, §273–275)

Questions put to the owner during this mission: none. Routine choices were settled by tournaments and recorded here
and in `../09_SEASON_3.md`. Genuine external items, stated in the ledger: deployment verification through the Vercel
connector, and the credential L12–L13 would need.

## 12. Prior art for what this mission added (§7, §131)

Every mechanism new in v18 has an ancestor; none is claimed as novel.

| Mechanism here | Closest prior art | Label |
|---|---|---|
| Coverage oracle and requirement graph | requirements traceability matrices (systems engineering); CI gates that fail on missing evidence | KNOWN |
| The oracle attacked with fabricated claims | mutation testing; honeypot records in audits | COMBO |
| Trials L2–L11 with a control arm, margin, no-harm floor and rollback | A/B testing with guardrail metrics; stopping rules in clinical trials | KNOWN |
| L14, the judge judged (rollback, caution ×1.5) | sequential testing with re-validation; post-marketing surveillance | COMBO |
| Sealed items with hashes registered before exposure | pre-registration (registered reports); secure test banks | KNOWN |
| Counterfeit learners | test-wiseness research (Millman, Bishop & Ebel, 1965) and item-writing guidelines | KNOWN |
| Real-world forecasts scored by Brier | forecasting tournaments (Tetlock) and calibration training | KNOWN |
| Possession ladder earned by evidence | mastery learning; Bloom-style levels; competency-based assessment | COMBO |
| Masterpiece compiler (read whole / passages / bridge / do not read) | abridgement, critical anthologies, guided reading; "slow reading" pedagogy | COMBO |
| Knowledge half-life re-verification | living systematic reviews; the "half-life of facts" (Arbesman) | KNOWN |
| Media registry with rights class and cognitive job | digital-asset management with licensing fields; Mayer's multimedia principles | COMBO |
| Perception instrument (museum, concert) | pre/post perceptual-learning measures; ear-training assessment | KNOWN |

## 13. The §7 analyses, where each was run

| Analysis | Where |
|---|---|
| Coverage oracle | `tools/renaissance/oracle.js`; `../completion/COMPLETION_LEDGER.md` |
| Unknown-unknown search | §9 above |
| Red team | §8 above; the critic panel in `../09_SEASON_3.md` |
| Prior-art search | §12 above; novelty labels on every registry row (O7) |
| Dependency analysis | requirement `deps` and rollups in the graph; session `requires` checked by V1 |
| Implementation gap | the oracle's open list (build requirements need code and a passing test) |
| User-experience gap | §8 (UX engineer, power user, beginner); V4, A1, R24, R34, C6 |
| Benchmark gap | `04_MEASUREMENT.md` §2 (explanation and writing not measured) and the empirical queue |
| Source and rights gap | `05_RIGHTS_MEDIA_FUTURE.md` §1 (empty rights classes), CO10 (re-verification), M1 |
| Self-improvement gap | `03_ENGINE.md` §3 (L12–L13 blocked, with the gates in place) |
| Domain and medium gap | `02_ORGANS.md` §3–5 (global depth, painting, recorded performance, language) |
| Life-integration gap | the gate and weekly caps (R16–R17); the real-talk tap (F3); `04_MEASUREMENT.md` §7 |
