# Renaissance · 02 · Failure universe, defenses and hostile tests

Every failure the two mission prompts named (§124, §205 of the first; §129–§144 of OMEGA), plus the ones found while
building. For each: the structural defense and where it is tested. "Test" names a check in
`tests/renaissance_test.js` (R1–R38) or a document-level check. Where there is only a design, it says **no test yet**.

| # | Failure | Structural defense (as built) | Test |
|---|---|---|---|
| 1 | Beautiful explanation, zero transfer | transfer scored separately from immediate accuracy; far items the session never mentioned; delayed unaided hooks | R6, R10, R14, R21 |
| 2 | Fake understanding / fluency illusion | committed prediction **before** the explanation; receipt separates "predicted" from "used in new cases" | R6, R10 |
| 3 | Memorisation without transfer | hooks are transfer items as often as recall items; only far/transfer count as "used" | R21 |
| 4 | Transfer without precision | every wrong option names the misconception; near-neighbour distractors | R20 |
| 5 | Confidence without competence | confidence on every committed answer; Brier score in WHY THIS?; hypercorrection repair for a wrong SURE | R6, R7 |
| 6 | AI hallucination / fabricated quotes | no quotation typed from memory; quotations registered as `short quotation` and cited where used; every cited source id must exist | R20 |
| 7 | Bad source | provenance grade A/B/C; grade C stories labelled as parables in the lesson (cobra effect, the bomber picture) | R20 (existence), manual (grade) |
| 8 | Over-compression | the primary data or scene is kept whole (Semmelweis tables, Odysseus's three rules); GO DEEPER holds the formal version and limits | manual review; no automated test yet |
| 9 | Under-compression (academic bulk) | 20–25 min cap; every step ≤ 4 min; no reading assignments | R21 (minutes) |
| 10 | Loss of nuance | "limits" and "open question" cards; contested points labelled | manual |
| 11 | Canon / Western / prestige bias | cases from Vienna, Hanoi, the Philippines, Mexico, England, the USA, Homer; no "great because famous" framing | manual audit in `07_SEASON_1.md` |
| 12 | Political / ideological capture | season 1 avoids partisan topics; contested topics (policing metrics) framed as mechanism, not verdict | manual |
| 13 | Copyright violation | public domain paraphrase, facts, two short registered quotations; no images from outside; blocked sources not routed around | R20, R22 (no links) |
| 14 | Learner dependency on the system / AI | unaided warm-ups (no pictures, helpers off); no free-chat answer machine in v1 | R14 |
| 15 | Boredom | mode changes every 1–3 min (story → predict → model → contrast → use → build) | no automated test; the friction log (latency) is recorded |
| 16 | Cognitive overload | ≤ 2 new terms per step, vocabulary on demand in three layers | R5 |
| 17 | Metric gaming by the learner | no headline score; Brier rewards honest confidence; answer positions shuffled | R25 |
| 18 | Metric gaming by the system | success is delayed and unaided transfer, which the system cannot inflate by making items easier without it showing in far items | design; **no test yet** |
| 19 | Unbounded time consumption / life colonisation | one session a day; 10-min dose in exam week, late evening, heavy weeks; shut on exam weekend, 01–05 h, above 300 min/week | R11, R16, R17, R27 |
| 20 | Guilt / backlog | missed days vanish; no streaks, no "behind" wording; a short day continues rather than crams | R18, R27 |
| 21 | Curriculum echo chamber / personalisation prison | v1 order is authored and interleaved; the learner cannot filter topics away; exploration budget is a design for later seasons | design |
| 22 | Stale science | provenance has dates; recompile rule when a source changes (§106) | **no test yet** |
| 23 | Source contradiction | contested facts carry both sides in the text (Eddy's survey graded C with the replication note) | manual |
| 24 | False learner-model inference | no trait inferred from < 5 answers; no "visual learner" labels; every receipt number has its n | R10 (receipt shows counts) |
| 25 | Misdiagnosed misconception | the learner can declare the cause (x-ray) instead of the system guessing only | R5 |
| 26 | Bad representation selection | SHOW ME DIFFERENTLY at every teaching step; the representation log records which one preceded success | R4 |
| 27 | Premature formalism | formulas only in GO DEEPER | R7 |
| 28 | Insufficient formalism | the formal version exists for every session (deeper cards) | R7 |
| 29 | Excessive simplification | "where it breaks" cards (e.g. naive vs sophisticated agents; when selection does not bias) | manual |
| 30 | Superficial interdisciplinarity / decorative analogy | a contrast only counts if a question about the **shared mechanism** is answered, with surface-feature distractors | R20, R21 |
| 31 | Fake novelty | `04_INVENTION_REGISTRY.md` names the ancestor of every mechanism | document |
| 32 | Breaking medicine | separate storage/DOM; opens only after STOP; CNS storage unchanged by a session; kill switches | R1, R12, R19; full CNS regression |
| 33 | Technical complexity leaking into UX | one CONTINUE; six small helpers; no dashboard | R3 |
| 34 | Fake genius (fast talk, jargon, trivia) — OMEGA §130 | no free-text scoring; points only for predictions, discriminations and transfer; jargon-heavy distractors are wrong options | R20 |
| 35 | Polymath theatre (shallow familiarity) — OMEGA §138 | a primitive is "held" only after delayed unaided far transfer; seasons are 6 primitives, not 60 topics | design + R14 |
| 36 | Novelty addiction — OMEGA §137 | hooks return old ideas before new ones; no cliffhangers | R14 |
| 37 | Current-AI bias — OMEGA §142 | the product is a static, offline, scripted system on purpose; the guarded model tutor is a later option, not the premise | design |
| 38 | Benchmark gaming — OMEGA §143 | alien problems drawn from domains no session mentions; the test pool is authored separately from sessions (design) | **no test yet** |
| 39 | Founder flattery — OMEGA §144 | the registry kills weak ideas; the receipts say "no surprise today" when nothing was learned | document |
| 40 | Found while building: predictable answer position | stable per-item shuffle | R25 |
| 41 | Found while building: resume lost after a skip | position remembered on every move | R9 |
| 42 | Found while building: "10-minute dose" that was 21 minutes | budgeted short dose that stops at a step boundary | R16, R27 |

## Failure of the failure model (§126)

Categories not in either prompt, found by asking what would make this whole list irrelevant:

1. **The learner never opens it.** A door on the STOP screen is the only entry. If medicine never reaches STOP
   (heavy days), Renaissance never appears. That is intended in exam season, but after the exam it could mean the
   organ silently dies. Defense (design): after the exam, the door also appears when the medical day is below a
   minimum, with the dose shrunk.
2. **Storage loss.** Local-first means a cleared browser erases the learner model. Defense (design): include
   `renaissance_v1` in the cloud save after one release of isolation.
3. **The author is the bottleneck.** Seasons are hand-built. If authoring stops, the organ stops. Defense: the
   season schema and linter exist so that authoring can be assisted without lowering the bar.
4. **Truth decays silently.** A static app cannot notice when a cited finding is overturned. Defense: provenance
   dates; a yearly review of grade A/B entries (manual).
