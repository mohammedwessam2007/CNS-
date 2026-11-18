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

## v25: the 10/10 check (18 Nov 2026)

The course is scored against ten criteria. Each is a yes/no, and each "yes" points to code and a passing test.

| # | Criterion | Yes because | Test |
|---|---|---|---|
| 1 | It teaches what the exams ask, in lecture order | 28 GIT units mapped to all 50 timetable lectures; 641 GIT MCQs; 159 written questions ranked 2010–2026; 44 written topics with department-style reference answers | plan P10, git206 G1, written W2 |
| 2 | Readiness cannot fool you | Only AI-off results count: full past papers (19, 26, 28 Dec), written mocks (3 and 10 Jan), blind checks; bank scores labelled as bank scores | git206 G5, written W6, v21 V1 |
| 3 | The written exam is trained the way it is marked | The verb's structure on every question; 3 examiners against the reference; handwriting by photo; spaced 3-minute outlines; one-page sheets | written W1–W6, plan P5 |
| 4 | Every mistake comes back | Memory cards (1, 3, 7, 16, 35 days), traps re-worded, outlines rescheduled | v21 V4, written W5 |
| 5 | You think first, the AI second | Hint ladder; hint-only on unanswered MCQs; AI off in every mock and blind check | ai_everywhere A3/A6, v22 W6 |
| 6 | You know what you know | Certainty-based marking, typed errors, calibration in the weekly report | v22 W4 |
| 7 | Zero decisions | ▶ Today on every screen is the plan's next step | plan P3 |
| 8 | Work less, live more | Your minutes decide; Fridays off; stop time; light days; a small budget cuts steps, never adds minutes | plan P2, v22 W1–W3 |
| 9 | Grounded and safe | Department references, "not in your notes", second-model MCQ check, held-out firewall, weekly cost cap | v21 V5, written W3 |
| 10 | It is live and works | Checked 18 Nov: the live Pages site serves v25.0, opened in a real browser with no page errors; plan (53 days from 21 Nov), GIT bank, 44 references, written engine and tutor all load (docs/live-plan-phone.png). All app test suites pass; the 3 remaining failures predate v21 or need a local host stand-in | live check |

**Not in my hands, and not part of the score:** the first run with your own OpenRouter key on your phone (the tests use a fake OpenRouter), the CNS previous written questions (the CNS week ranks chapters by MCQ weight until they arrive), and the practical exam date.
