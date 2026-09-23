# MCQ-only rubric: what 9.5/10 means

The owner's instruction (23 Sep 2026): *"Don't stop until it's minimum 9.5/10. Also MCQ only; we don't care about written and practical now."*

The target is the **NEU-205 MCQ exam** (planning anchor **Sun 15 Nov 2026**). Written and practical waves are switched off. The app is scored against the ten criteria below. Each criterion names its evidence.

| # | Criterion | 9.5-level bar | Evidence |
|---|---|---|---|
| 1 | **Every past-paper MCQ is done before the exam** | All 918 auto-scorable practice MCQs are scheduled and answered by the end of teaching (Fri 6 Nov). All 398 held-out MCQs are used in mocks by Sat 14 Nov. | Full-course simulation in `tests/v16_test.js` |
| 2 | **Every MCQ is explained** | Every practice MCQ has a hand-written explanation: why the key is right, and why each wrong option is wrong. Every held-out MCQ is explained after it is used in a mock. | Explanation coverage count (target 100%) |
| 3 | **Answer keys are audited** | Every practice key was checked while writing its explanation. A doubtful key shows the standard answer and the reason, and both answers are accepted. | Flag list in the receipt |
| 4 | **Learn before you are tested** | An MCQ is asked only after the lesson that teaches it (by its notes section) has been learned. | Simulation check |
| 5 | **Mistakes come back until fixed** | A wrong answer returns the next day as a changed question on the same fact (retest law). The exact past-paper question returns a few days later, because Kasr repeats questions. Spacing continues until the item is answered confidently. | SRS checks in the simulation |
| 6 | **Exam-like mocks with an honest prediction** | Timed, mixed, sealed mocks from held-out items only, with no pictures, hints or explanations before submission. The predicted score comes with an interval, from unseen items only. | Mock and firewall checks |
| 7 | **MCQ only** | No written boss, written wave, practical wave, visual boss or draw-from-memory steps while MCQ focus is on. | Flow checks |
| 8 | **Fits the owner's life** | About 2 hours a day or less on average (the objective profile's 1.5–2 h). No day in the plan is above about 2.5 h. | Simulated minutes per day |
| 9 | **One button** | The learner only looks, answers and taps Next. Nothing to plan or choose. | UI checks |
| 10 | **Nothing breaks** | No page errors. Saved progress survives a reload and stays small enough for cloud save. The v15 LEARN notes, pictures, date truth, catch-up spread, offline mode and firewall all still work. | All suites on both builds |

## What cannot reach 10 from here

- **No clinician has reviewed** the notes or explanations. They follow Guyton, Snell and Junqueira level teaching.
- **Pictures cannot be seen** from the build sandbox (Wikimedia is blocked). Bad pictures can be rejected in-app.
- **Real exam results** are the only true proof, and they come after 15 Nov.
