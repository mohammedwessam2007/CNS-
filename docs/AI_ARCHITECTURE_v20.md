# AI everywhere, without the crutch: architecture for v20

## The finding that decides the design

- A tutor built on teaching principles (scaffolded, makes the student do the thinking) roughly doubled learning gains against an active-learning class, in less time (Kestin et al., *Scientific Reports* 2025, Harvard physics, randomised crossover; no delayed test).
- Open access to a chatbot raised practice scores but made students **worse** on the exam once it was taken away (17% lower than no AI); a guardrailed tutor removed the harm (Bastani et al., *PNAS* 2025).
- A six-week GPT-4 after-school programme gained 0.31 SD, with more days giving more gain (World Bank, Nigeria, 2025).
- Medicine: a small RCT of a Socratic LLM tutor beat textbook reading; unstructured LLM access in trauma cases did not help (2026 trials).

**Rule:** the AI does every job that costs the student time without teaching him (preparing, sorting, scheduling, grading); it never does the thinking that the exam will ask of him. Readiness is always measured with the AI off.

## Six roles

1. **Librarian (works while he lives):** slides and notes → knowledge graph (fact ↔ slide ↔ past questions ↔ Dr Doss drawing ↔ mechanism ↔ look-alikes); the high-yield 20%; pretest questions; predicted misconceptions. Runs on cheap batch models.
2. **Socratic professor:** attempt first, then a three-step hint ladder (nudge → narrower question → worked step), never the answer first. Why?, picture-it, lesion lab narration, cases, voice mode for walks.
3. **Examiner:** new questions in each doctor's style, checked by a second model against the slides before he sees them; written answers graded on the department's rubric; drawings graded from a photo; oral viva practice.
4. **Memory engine:** forgetting model per fact plus the marks-per-minute optimiser; locks a fact after three correct recalls on separate days; mnemonics written from his own interests.
5. **Coach (ADHD):** zero decisions ("Start"), a two-minute starter, visible timer, break guard, a 15-minute minimum day, a daily stop ("done for today"), a weekly honest report, automatic post-mortem after each exam.
6. **Guard:** every answer grounded in his slides with the slide named, "not in your lectures" said aloud, a second model on disagreements, held-out items never sent, a weekly cost cap, the app still works offline without AI.

## Build order

1. Hint ladder and attempt-first in the existing tutor (guardrails before anything else).
2. Slide ingestion → knowledge graph → pretests and distillation.
3. Examiner with verification; readiness measured AI-off.
4. Marks-per-minute daily session with "done for today".
5. Written-answer grader, then drawing grader, then lesion lab.

## Sources

- Kestin G. et al. (2025). AI tutoring outperforms in-class active learning. *Scientific Reports*. https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/
- Bastani H. et al. (2025). Generative AI without guardrails can harm learning. *PNAS* 122(26). https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html
- De Simone M. et al. (2025). From Chalkboards to Chatbots. World Bank Policy Research Working Paper. https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full
- Socratic LLM RCT in medical students (2026). *Medical Science Educator*. https://link.springer.com/article/10.1007/s40670-026-02832-2
- LLMs in trauma education, pilot RCT (2026). https://www.sciencedirect.com/org/science/article/pii/S2369376226000589
- Generative-AI tutor with a knowledge graph in anatomy, RCT (2026). https://pubmed.ncbi.nlm.nih.gov/42174555/
