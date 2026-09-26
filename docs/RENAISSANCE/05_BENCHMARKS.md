# Renaissance · 05 · Benchmark laboratory

Status legend: **RUNNING** (the app records it now) · **PROTOCOL** (written, needs the learner's time or a second
person) · **IMPOSSIBLE HERE** (cannot be done honestly with one learner and no comparison group; says why).

No claim of superiority is made anywhere. With one learner there is no control group; the strongest honest design
is a **within-person, equal-time, counterbalanced** comparison, and even that has carry-over effects.

## 1. What the app measures today (RUNNING)

| Measure | How | Horizon |
|---|---|---|
| Immediate prediction accuracy | committed predictions before explanations | minutes |
| Near and far transfer | transfer / far items after the explanation | minutes |
| Delayed retrieval and transfer, unaided | hooks at 1, 7, 30 days (then ×2.5), no pictures or helpers | days → months |
| Calibration | Brier score over all committed answers; SURE-accuracy in receipts | all |
| Misconception profile | counts by bug class | all |
| Confusion causes | x-ray counts (word / picture / step / stakes) | all |
| Representation log | which representation preceded the next success, per primitive | all |
| Reality use | used / not yet / not useful, once per forge | week |
| Life-minutes | clock time in the organ, per day | all |
| Click-event candidates | a wrong prediction followed, in the same session, by a right transfer answer given without guessing | session |

Anti-trivia (§209): recall items are only a minority of hooks; the receipt's "What changed" line is driven by
transfer, not recall. **Anti-verbal-IQ (§210)**: there are no free-text answers to be impressive in; jargon-heavy
distractors are scored wrong. **Anti-AI-dependence (§211)**: unaided hooks are the dependence test; the comparison
that matters is unaided hook accuracy vs in-session accuracy on the same primitive.

## 2. Equal-time comparisons (PROTOCOL)

For one primitive at a time, 25 minutes each, counterbalanced over weeks (A-B one week, B-A the next, different
primitives so the same content is never seen twice):

| Arm | What he does for 25 min |
|---|---|
| R | a Renaissance session |
| Book | the most relevant chapter of a good book (e.g. a chapter of a popular-science book on the same mechanism) |
| Video | the best available lecture or explainer video on the same mechanism |
| Summary | a book-summary product's page on the same topic |
| LLM | a free chat with a general AI assistant about the topic, no guardrails |
| Nothing | the 25 minutes returned to life (the honest baseline) |

Outcome: a **held-out** battery written before the comparison and never shown in any arm — 4 prediction items, 4
far-transfer items, 2 "which question would you ask first" items — given unaided at +1 day and +21 days, with
confidence. Scored blind by item key. With one learner, report the raw scores per arm and do not compute a p-value.

The systems named in the mission that cannot be run this way (a university, a private tutor, museums, travel,
apprenticeship) are **IMPOSSIBLE HERE** as equal-time arms; they differ in kind, not dose. They are compared in
`01_RESEARCH.md` by published evidence only.

## 3. Generalisation and learning speed (PROTOCOL)

- **Alien problem** (§68, OMEGA §70): every 4th week, a short problem from a domain no session touched (e.g.
  queueing at a bakery, the spread of a rumour in a village, why a bridge sways). Scored on: time to a first useful
  question, whether the chosen question is the decisive one (pre-rated by an expert key), prediction accuracy.
  Record the trend over months — that is the **alien-problem delta**.
- **Learning speed** (OMEGA §149): the minutes of new-domain teaching needed to reach 3/4 on its far-transfer items,
  for each new primitive. If later primitives take fewer minutes, the rate of learning improved.
- **Second derivative** (OMEGA §150): the slope of the learning-speed series. With 6 primitives a season this needs
  at least two seasons before it means anything; say so rather than plot noise.

## 4. Renaissance Yield (a defensible version)

The multiplicative formula in the prompts lets one noisy term dominate and rewards gaming a single factor. Instead:

```
RY(window) = reported as a vector, never collapsed:
  delayed_far_transfer   (share correct, n)       ← primary
  delayed_retrieval      (share correct, n)
  calibration            (Brier, n)
  reality_use            (used / forged, n)
  minutes                (sum)
Improvement is claimed only when the primary term improves at equal or fewer minutes
and no other term gets worse beyond its noise (±1 item per 10).
```

## 5. Human Possibility (P(t)), practical version

P(t) = number of **verified primitive–domain pairs**: a primitive counts in a domain only after a delayed,
unaided correct transfer item set in that domain. dP/dt is new pairs per month. It is small and slow on purpose:
it only counts what was demonstrated.

## 6. The "smarter than before" test (§208) and the cognitive-shock battery (OMEGA §151)

PROTOCOL, once per season: five naturalistic tasks, unannounced topic, unaided, timed, scored against keys written
in advance by someone other than the session author where possible:

1. Orient: a one-page description of an unfamiliar system → name its main loop and its delay.
2. Compress: explain a given mechanism in one sentence that keeps the truth (pick from 4, then write one).
3. Question: choose the one question that would most change a decision.
4. Structure: from a messy two-paragraph dispute, pick the "three boxes" that capture the real disagreement.
5. Predict: what happens next in a described situation, with confidence.

No observer ratings of "seems smart" are used: they reward performance, not capability.

## 7. What cannot be claimed

- That Renaissance beats any alternative: no comparison has been run yet.
- That it raises general intelligence: far transfer is rare in the literature (Sala & Gobet 2017); only the
  alien-problem trend over months could suggest it for this learner, and even then without a control.
- Any year-scale effect: the organ is days old.
