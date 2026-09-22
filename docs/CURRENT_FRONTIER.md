# Current Frontier at Handoff

Date: 2026-09-22 (Africa/Cairo)
Live Hatchable: v53
Project: `proj_ODYBjdGkeDBq`
Live URL: https://intellectuality-cns-0nts.hatchable.site

## What already exists
- 89 CNS topics.
- 1,321 exact imported MCQs: 556 Anatomy, 590 Physiology, 175 Histology.
- 921 practice / 400 nominal held-out.
- Held-out contamination filter previously excluded 37 exact + 23 near overlaps, leaving 340 clean held-out items.
- Visual professor and reconstruction loop.
- Real visual layer v9.
- Context visual layer v10.
- Coursera-like low-friction shell v11.
- v12 personal autopilot: mastery/error/ROI/stop-study/exam-twin/knowledge-graph logic.
- v13 Learning Twin: confidence calibration, forgetting signatures, rhythm, teaching-language memory, cross-module portable profile.
- v14 in active development: understanding-first practice MCQs, date awareness, question-specific visuals, Egyptian commands, wrong-answer visual autopsy.

## User-reported failures that matter
1. Visuals still repeat too much.
2. Some MCQ flow feels like the app is teaching the **question** rather than teaching the concept.
3. A wrong answer must explain visually *why the chosen option is wrong*, not merely reveal the correct answer.
4. The app showed/stuck on Sep 21 when the actual date was Sep 22. Real date and carryover must be explicit.
5. Small reasoning commands should be Egyptian Arabic because they stick better.
6. "AI slop" educational anatomy is rejected.
7. The interface must remain low-friction. Intelligence belongs behind `Resume learning`.

## Known v14 risk
Current v14 is not certified finished. It has multiple partial patches. Treat it as a frontier to audit, not sacred code.
In particular test:
- fresh-user date alignment
- carryover after incomplete prior day
- fast-lane gating for fresh concepts
- normal practice primer not leaking the source answer
- wrong-answer autopsy chosen-distractor mapping
- mock isolation
- retest isolation
- image uniqueness/performance
