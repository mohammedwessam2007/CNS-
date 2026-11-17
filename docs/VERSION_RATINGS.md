# Version ratings: before and after the post-exam upgrades (17 Nov 2026)

Scored out of 10 by the person who built it, judged against one goal: **the most marks in the next exams (CNS written, GIT written, GIT MCQ) for the least study time, by understanding.** Scores are judgements, not measurements. The only real measurement so far is the 16 Nov MCQ (about half, against a "very good" forecast).

| Dimension | v18 (the course before 16 Nov) | v19 (AI tutor drawer) | v20.2 (learning modes) | v20.3 (AI on every screen) | **v21 (now)** |
|---|---|---|---|---|---|
| Teaches what the lectures teach | 2: bank facts only | 4: pasted notes | 4 | 4 | **6**: slide PDFs and photos of notes import into each topic |
| Honest about readiness | 2: said "very good" | 3 | 3 | 3 | **7**: "past-paper mocks", the real exam's gap shown, post-mortem |
| Learning science actually used | 5: spacing and retrieval on the bank, but recognition | 6 | 8: try-first, worked examples, interleaving, cases, drawing… | 8 | **8.5**: every mistake goes into a spaced memory deck, reviewed re-worded |
| AI in the study flow | 0 | 4: a drawer you must open | 5 | 8: a bar on every screen, inline answers, pictures | **9**: one-tap Today, review, essay grading, import, post-mortem |
| Guardrails against the AI crutch | – | 4 | 7: attempt first, hint ladder | 7 | **8**: hint-only on unanswered MCQs, second-model item check, budget cap |
| Written-exam preparation | 2 | 4: model answers | 5: blank-page outline | 5 | **7**: 3-examiner grader (median and spread), missing points become cards |
| ADHD: no decisions, short, clear stop | 4: too many features | 5 | 6: Plan today | 7 | **8**: ▶ Today does reviews then the lesson |
| Cost control | – | 3: advice only | 3 | 3 | **8**: cost counted per answer, weekly cap |
| Verified working for real | 8: tested and deployed | 5 | 5 | 5 | **5**: all tests pass, but only against a fake OpenRouter; not yet with your key or on the live site |
| **Overall** | **3.5** | **4.5** | **5.5** | **6.5** | **7.5** |

## What still stands between 7.5 and 9+

1. **You run it once with your real key** and say what broke (verification 5 → 8).
2. **Your GIT and CNS slides** → the course graph: every fact linked to its slide, past questions, drawing and look-alikes; the professor grounded in them (lectures 6 → 9).
3. **Readiness on questions you have never seen**, written by the professor from the slides, checked by the second model and answered with the AI off; shown as a range (honesty 7 → 9).
4. **Exam dates**, so ▶ Today plans by marks per minute up to each exam.

## Sources for the design decisions behind the scores

- Unguarded AI access lowered exam scores by 17%; a guardrailed tutor did not (Bastani et al., *PNAS* 2025).
- LLM-written MCQs: 56% have item-writing flaws (hence the second-model check).
- LLM essay grading is unstable between runs (weighted kappa ~0.72) (hence three examiners and the median).
- Retrieval practice and spacing: Larsen et al. 2009; spaced repetition in medical education, SMD 0.78.
- Full list: `docs/AI_ARCHITECTURE_v20.md`.

## v22 → v24 (18 Nov 2026)

| Dimension | v21 | v22 (live more) | v23 (GIT 206) | **v24 (exam plan)** |
|---|---|---|---|---|
| Teaches what the exams ask | 6 | 6 | 8: 641 GIT MCQs, 159 written questions ranked | **8.5**: every GIT unit scheduled; CNS written ranked by weight |
| Honest readiness | 7 | 8.5: blind checks | 9: GIT papers as AI-off mocks | **9** |
| ADHD: no decisions | 8 | 8.5 | 8.5 | **9.5**: ▶ Today is the plan's next step, everywhere |
| Work less, live more | 6 | 9 | 9 | **9.5**: the plan fits the minutes, Fridays off, light days |
| Verified for real | 5 | 5 | 5 | **5**: still only a fake OpenRouter; live site not checked |
| **Overall** | 7.5 | 8 | 8.5 | **9** (10 needs: your real-key run, CNS past written questions) |
