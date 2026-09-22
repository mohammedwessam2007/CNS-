# INTELLECTUALITY CNS v5 ONE-BUTTON PROFESSOR — VERIFIED STATE

Date: 2026-09-21
Canonical live project: Hatchable `proj_ODYBjdGkeDBq`
Slug: `intellectuality-cns-0nts`
Verified deployed version: v10
Live URL: https://intellectuality-cns-0nts.hatchable.site

## Product contract
INTELLECTUALITY is a zero-lecture, self-contained NEU-205 course. Learner flow is sequential and decision-light:
visual orientation -> full in-app professor teaching -> optional inline cropped YouTube timestamp -> closed-book reconstruction -> exact source-bank question -> surgical repair / changed-form retest if needed -> visual/written boss -> STOP MEDICINE -> certify day.

Course content is rendered directly in the app. No exported content pack is part of the learner flow. Export control/action was removed from source.

## Verified coverage
- 89/89 unique NEU-205 topics have professor payloads in `public/professor.js`.
- 115/115 teaching lesson appearances map to a professor payload.
- 18 video segments all have finite start/end boundaries and render inline.
- Exact Team Ehsan bank remains embedded: 1,321 MCQs.

## Browser acceptance tests
- Professor script loaded: 89 topics.
- Export controls visible: 0.
- Full professor teaching rendered; old MICRO-TEACH renderer did not appear.
- Day 1 video rendered inside INTELLECTUALITY with start/end crop.
- Deliberate wrong source MCQ routed to Surgical Repair then a changed source retest.
- Full clean Day 1 run completed all four lessons, 8 sourced MCQs, Visual Boss, written precompile, STOP MEDICINE, certification, and advanced to Day 2.
- Final clean state: Day 2/148, doneDays [1], XP 280, unresolved repairs 0.
- Browser page errors: 0.

## Learner-facing rule
Normal learner path is course-first. Pattern Engine/genome/source-ledger diagnostics remain hidden; they influence routing underneath.

## Truth boundary
Foundation order still uses the supplied 2025 NEU-205 timetable as a historical donor where current Batch 199 source truth is unavailable. Team Ehsan compilation provenance is preserved and not relabeled as current official exam truth.

## Next genuine frontier
Use the live course for real study and collect 24h/72h retention, time-on-task, friction, and fresh-mock performance. Improve only from measured learning weaknesses.
