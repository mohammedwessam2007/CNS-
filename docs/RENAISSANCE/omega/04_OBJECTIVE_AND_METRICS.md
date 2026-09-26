# OMEGA · 04 · Objective evolution, metric adversaries, red teams, benchmark universe

§128: question the objective. §129: for every metric, design the behaviour that scores high while being bad.
§130–144: red teams. §145–155: benchmarks and humility. Each claim below carries a status: **RUNNING** (the app does
it and a test checks it) · **PROTOCOL** (written, needs the learner's time) · **DESIGNED** · **IMPOSSIBLE HERE** (says
why).

## 1. Objective evolution

| Version | Objective | How it fails (the adversarial case) | What replaced it |
|---|---|---|---|
| v0 · §84 | durable capability × transfer × synthesis × prediction × creation × future learning × judgment × aesthetic resolution × possibility ÷ life-minutes, subject to truth, health, sleep, relationships, life, sovereignty | A product: any unmeasurable term (aesthetic resolution, possibility) makes it uncomputable; any term near zero zeroes the rest; the easiest term to move (prediction on easy items) moves the whole. Dividing by minutes rewards 3-minute sessions that change nothing measurable yet. | v1 |
| v1 · Renaissance v1 | a vector: delayed far transfer (primary), delayed retrieval, calibration, reality use, minutes; improvement only at equal or fewer minutes | Static: says nothing about getting *faster at learning*, which §149 calls central. Also blind to narrowing: maximal transfer inside one domain passes. | v2 |
| v2 | v1 + **rate of entry into new domains**: minutes to 3/4 unaided far transfer in a domain never taught | Gamed by choosing easy new domains; tiny n per domain. | v3 |
| v3 · current | v2 + **the slope of that rate** (after ≥ 2 seasons) + **life constraints as gates, not weights** + **every metric ships with its adversary** | Every term is measured with items this system wrote (self-grading). Guard: held-out items written before comparisons, by someone else where possible; stated as a limit. | — |

Rejected alternatives, and why: **possibility volume** (§83) cannot be measured now; kept as a yearly audit question.
**Wisdom** is undefined. **Happiness** belongs to life, not to this organ. **P(t) alone** (verified primitive–domain
pairs) is slow and inflatable with near domains; kept as a secondary count. **Decisions improved** is the right
target but not observable without outcome tracking; approximated by reality taps and the (designed) decision diary.

## 2. Every metric has an adversary

"Adversary" = behaviour (by the learner or by the builder) that raises the number while capability does not rise.

| Metric | Adversarial case | Guard | Status |
|---|---|---|---|
| In-session accuracy | Answers readable from surface cues (the longest option was right 90% of the time in v1–v2) | Counterfeit learners (longest, shortest, most words, punctuation, hedges, jargon, no-absolutes) must stay within 0.12 of chance | **RUNNING** (R35; found and fixed in this build: 0.90 → 0.32) |
| In-session accuracy | Right answer in a predictable position | Stable per-item shuffle | **RUNNING** (R25) |
| Delayed hook accuracy | Hooks written as easy recall; builder schedules only likely-right hooks | Fixed gaps (1/7/30 days) regardless of predicted success; hooks unaided (no pictures, no helpers) | **RUNNING** (R14) |
| Calibration (Brier) | Always "guessing" to avoid penalties | Brier is a proper score: a constant 0.45 does worse than honest confidence at every accuracy except exactly 45%; every item needs a commit | **RUNNING** |
| Click-event candidates | Deliberately wrong predictions, then right transfer | Clicks are never shown as a score or goal; a wrong SURE prediction costs Brier | **RUNNING** (logged, never displayed) |
| Belief revisions | Builder writes predictions that are impossible, manufacturing "revisions" | Revisions are never a target; prediction items aim at 40–70% right | DESIGNED (target band not yet enforced) |
| Reality use ("used") | Self-report inflated | Asked once, never rewarded; cross-checked against later hooks of that primitive; random audit designed | RUNNING (tap) / DESIGNED (audit) |
| Minutes | Builder shortens sessions until they teach nothing | Primary metric must hold at the shorter length | RUNNING (rule) |
| Life-minutes cap | Builder raises the cap to fit more content | Cap and gates are tested constants | **RUNNING** (R16, R17) |
| Transfer items | "Far" items that share wording with the lesson | Transfer items written without the primitive's name; distance labelled | PARTLY (names avoided by review; lint DESIGNED) |
| Alien-problem delta | Teaching to the alien items | Alien items written in advance, never shown in sessions, field cues stripped | PROTOCOL |
| Learning speed | Choosing easy new domains | Domains fixed in a list before measuring; difficulty piloted on the simulated harness | PROTOCOL |
| P(t) | Counting near domains | Only delayed, unaided far items count | PROTOCOL |
| Dependence ratio (unaided ÷ aided) | Removing help everywhere so both fall | In-session accuracy must stay above a floor | DESIGNED |
| Taste pairs | Learning "shorter wins" | Pairs where the longer version wins (precision beats brevity) | PARTLY (stated in session 11; item DESIGNED) |
| Question choice | Picking the option that sounds like a decision | Distractors phrased as decisions but irrelevant | RUNNING (season 2 items) |
| Bug counts | Builder tags everything "surface" | Every wrong option needs a known bug class and a diagnosis | **RUNNING** (R20) |
| Representation fitness | Showing a picture just before an easy item, so its kind looks better than it is | The chooser is compared with a control arm (the usual order kept one day in five) on the same steps, and switches itself off if it doesn't beat it; per-kind rates are still confounded by item difficulty | **RUNNING** (R36, R37); delayed fitness DESIGNED |
| Registry size | Renaming duplicates to reach 1,000 | Name and similarity dedupe; distinct count reported and tested | **RUNNING** (`omega_registry_test.js` O2–O3) |
| Doc numbers | Docs quoting numbers the data doesn't have | Tests compare quoted counts with the data | **RUNNING** (O8–O9) |

## 3. Red teams §130–§144

| § | Red team | The test that catches it | Status / result in this build |
|---|---|---|---|
| 130 | Fake genius (fast talk, jargon, trivia) | no free text anywhere; jargon-dressed distractors diagnosed as "pretension"; counterfeit learners at chance | **RUNNING**: counterfeit strategies 0.30–0.37 vs chance 0.31 (R35) |
| 131 | Beautiful-explanation trap | committed prediction before every explanation; unseen transfer after; delayed unaided hooks | **RUNNING** (R6, R14, R21) |
| 132 | AI dependence | no answer channel; hooks with every aid removed; the comparison is unaided vs in-session | **RUNNING** (R14) |
| 133 | Echo chamber | cases from several regions and eras; dissent shown on contested cases | PARTLY: cases from Vienna, London, Hanoi, the Philippines and the US, examples priced in Egyptian pounds; no audit test yet |
| 134 | Over-compression | the preserved jewel (primary numbers, the era's knowledge), GO DEEPER with limits and open questions | RUNNING (R7 checks depth exists); quality judged by review |
| 135 | Under-compression | ≤ 30 minutes, one primitive per session, two new terms per step | **RUNNING** (R21) |
| 136 | Content colonisation | gate after medicine; sleep; exam weekend; weekly cap; one session a day | **RUNNING** (R1, R11, R16, R17) |
| 137 | Novelty addiction | no feeds, no variable rewards; serendipity capped at one item a week (design) | RUNNING (no feeds exist) |
| 138 | Polymath theatre | credit only for delayed, unaided far transfer | RUNNING (instrument) |
| 139 | False interdisciplinarity | every analogy states where it breaks; contrasts must share a mechanism named in the key | PARTLY (keys name the mechanism; "breaks" lint DESIGNED) |
| 140 | Ideological capture | contested topics avoided in seasons 1–2; the fair-positions rule is designed for when they come | DESIGNED |
| 141 | Canon bias | blind pairs judged before names; the taste session names no author | **RUNNING** (session 11) |
| 142 | Current-AI bias | the interface is not a chat; the organ contains no language model at runtime | **RUNNING** (by construction) |
| 143 | Benchmark gaming | held-out items; counterfeit learners; tested doc counts | RUNNING (R35, O8–O11) / PROTOCOL (held-out battery) |
| 144 | Founder flattery | registry names an ancestor for 806 of 863 kept candidates; no claim above its evidence | **RUNNING** (O7) |

## 4. Benchmark universe §145–§153

| § | Benchmark | Status | Why / how |
|---|---|---|---|
| 145 | Against book, great books, university, tutor, mentor, Khan, Brilliant, Duolingo, Anki, Readwise, Blinkist, Shortform, YouTube, podcasts, Wikipedia, MOOCs, AI tutors, projects, apprenticeship, simulations, serious games, museums, travel, real experience | PROTOCOL for six arms (book chapter, video, summary page, free AI chat, nothing, Renaissance); IMPOSSIBLE HERE for university, tutor, mentor, museum, travel, apprenticeship | The possible arms fit the equal-time design; the rest differ in kind and cost, so an equal-time comparison with one learner would be meaningless. Compared by published evidence in `../01_RESEARCH.md`. |
| 146 | Equal time | PROTOCOL | 25 minutes per arm, counterbalanced over weeks, different primitives per arm (`../05_BENCHMARKS.md` §2) |
| 147 | Horizons: immediate → 1 year | RUNNING for immediate, 1, 7, 30 days (hooks); PROTOCOL beyond | hooks stretch ×2.5 after each success |
| 148 | Generalisation | RUNNING in part (far and unlabelled items) / PROTOCOL (alien month) | |
| 149 | Learning speed | PROTOCOL | minutes to 3/4 far transfer per new primitive |
| 150 | Second derivative | PROTOCOL, not before two seasons of data | slope of the learning-speed series |
| 151 | Cognitive shock battery | PROTOCOL | five naturalistic tasks per season, unaided, keys written in advance (`../05_BENCHMARKS.md` §6) |
| 152 | No IQ fetish | RUNNING (by rule) | no composite, no IQ items |
| 153 | Renaissance Yield | RUNNING as a vector | §1 v3 above |

## 5. Empirical humility (§154) and what is claimed

Claimed: the organ exists, is tested (38 Renaissance checks on the source and deployed builds, plus the registry
checks), and records the instruments above. **Not claimed**: that it beats any alternative, that it raises general
intelligence, or any effect on this learner. The first real evidence is his 30-day hooks (earliest: late October
2026), and the first comparison needs the equal-time protocol run over weeks.
