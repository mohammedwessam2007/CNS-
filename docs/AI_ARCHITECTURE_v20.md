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

## v20.1: the frontier pass (deeper research, 16 Nov 2026)

What the newest evidence adds, and the design move each one forces. Evidence strength in brackets.

| Finding | Design move |
|---|---|
| Gemini Guided Learning RCT, Sierra Leone, 1,763 students: +0.26 SD, +0.38 SD for ≥12 h use [one RCT, Google-run] | The professor follows the LearnLM principles: active learning, manage cognitive load, adapt to the learner, stimulate curiosity, deepen metacognition. Dose matters: the daily session is short but daily. |
| Grounding in a curated knowledge graph cut hallucinations from 30% to 3.3% (EyeRAG, npj Digit Med 2026); hypergraph RAG +12% accuracy on a neurology set (Hyper-RAG, Nat Commun 2026); a generative-AI anatomy tutor with a knowledge graph beat blended teaching in an RCT (2026) [peer-reviewed, single studies] | The tutor answers only from the course graph (his slides, Dr Doss, the bank, the app's notes), names the source, says "not in your lectures" otherwise. |
| Open chatbot access: better practice, worse exam (-17%) (Bastani, PNAS 2025); weaker neural engagement when writing with ChatGPT (MIT, N=54); "metacognitive laziness": better essays, no knowledge gain [RCT + small studies] | Predict before reveal, attempt before hint, confidence before feedback, explain-back before moving on; AI-off sessions; readiness measured AI-off only; metacognitive feedback ("you accepted 4 answers without checking"). |
| LLM-written medical MCQs: difficulty and discrimination like human items (Med Teach meta-analysis 2026), but item-writing flaws 56% vs 27% [meta-analysis + preprint] | Every generated item passes a second model's flaw check (NBME-style checklist) and is calibrated on his answers (item response theory); flawed or non-discriminating items are retired. |
| LLM essay grading: weighted kappa ~0.72 with reasoning modes, unstable across runs; not reliable alone for high stakes [2026 method-comparison] | The written-answer grader scores three times on the department rubric and reports the median and the spread; it coaches, it does not decide. |
| Spaced repetition in medical education: SMD 0.78 across 13 studies (Clin Teach meta-analysis 2026, secondary report); FSRS models forgetting from review history | FSRS-style scheduler per fact, target retention 0.9 on high-yield facts, 0.8 on low-yield; successive relearning locks facts. |
| LLM virtual patients with structured feedback improved clinical decision-making (RCT); a multi-agent simulator hurt reasoning when the AI interpreted findings first [RCT + cohort] | Case mode: the student interprets every finding before the AI says anything. |
| Teaching an LLM that holds planted mistakes improved learning (ACL BEA 2025); protégé effect (Betty's Brain) [small LLM studies + classic RCTs] | "Fix the classmate": the AI writes an answer with planted errors from his own misconception list; he finds and corrects them. |
| Interest-framed exercises helped low-knowledge, low-motivation students most (2026) [early] | Optional interest framing of cases and hooks (his interests), never changing the facts. |
| ADHD: AI coaching evidence is only feasibility-level; organisation and time-management skills training and brief mindfulness have early trial support [weak to moderate] | The coach teaches organisation skills inside the app (plan, start, stop) and offers a 60-second focus reset; no claims beyond the evidence. |
| Targeted memory reactivation during sleep: small-to-moderate effects in the lab (Psych Bull 2020 meta-analysis); home use unproven [lab only] | Not built. Sleep stays protected (evening review, no late cramming). |

### The frontier stack

1. **Course graph** (grounding): every fact linked to slide, past questions, drawing, mechanism, look-alikes, misconceptions.
2. **Learner model**: forgetting per fact (FSRS), ability per topic (IRT), his misconception set, his calibration (confidence vs correctness).
3. **Policy**: expected exam marks gained per minute picks the next step and the stop point.
4. **Agents**: Librarian, Professor (LearnLM principles), Examiner (generator → flaw checker → IRT calibration), Grader (3× median), Patient (interpret-first), Classmate (planted errors), Coach.
5. **Guardrails**: grounding, attempt-first, AI-off measurement, held-out firewall, weekly cost cap, offline fallback.

Further sources: Gemini Guided Learning RCT (https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf); EyeRAG (https://www.nature.com/articles/s41746-026-02860-7); Hyper-RAG (https://pubmed.ncbi.nlm.nih.gov/42045193/); MCQ meta-analysis (https://www.tandfonline.com/doi/full/10.1080/0142159X.2026.2691072); LLM essay grading (https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1904452/full); LLM patient simulation RCT (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11605890/); multi-agent simulator (https://dx.doi.org/10.1515/dx-2026-0069); LLM protégés (https://aclanthology.org/2025.bea-1.19/); metacognitive laziness / offloading review (https://www.uts.edu.au/news/2026/03/experts-warn-unstructured-ai-use-in-schools-risks-cognitive-atrophy/contentassets/ai-cognitive-offloading-and-implications-for-education.pdf); TMR meta-analysis (https://www.semanticscholar.org/paper/Promoting-memory-consolidation-during-sleep:-A-of-Hu-Cheng/e09e67cffbea7be63d2c494490ca0347b0330275).
