# INTELLECTUALITY CNS v5.0 FINAL — Canonical Build Receipt

Date: 2026-09-21

## Canonical live build
- Project: INTELLECTUALITY CNS v5 One-Button Professor
- Hatchable project ID: proj_ODYBjdGkeDBq
- Slug: intellectuality-cns-0nts
- Live deployment: version 17
- URL: https://intellectuality-cns-0nts.hatchable.site
- Visibility: personal/private

## Product contract
INTELLECTUALITY is a zero-lecture, one-button NEU-205 course. The normal learner path is:
visual orientation -> label-blind reconstruction -> in-app professor teaching -> optional inline cropped video segment -> closed-book reconstruction -> sourced MCQ -> surgical repair -> changed-form retest -> next.

The learner must not be required to export content or leave the app to study course material.

## Verified teaching corpus
- 89/89 unique teaching topics have professor payloads in public/professor.js.
- Every professor payload has 3–6 core teaching steps.
- 89/89 unique teaching topics also have a separate five-step deep walkthrough across public/deep-01.js through public/deep-06.js.
- Deep pack coverage: 15 + 15 + 15 + 15 + 15 + 14 = 89.
- No TODO / COMING SOON / PLACEHOLDER markers found in professor or deep-teaching packs.
- Runtime fail-closed integrity guard added: missing professor/deep content prevents silent operation.

## Video contract
Existing routed YouTube segments are embedded inside the course with YouTube start/end parameters and playsinline=1. The learner sees only the routed timestamp segment in INTELLECTUALITY and may skip it when the concept is already green.

## Learner UI contract
- Export-content controls are hidden/removed from the learner flow.
- Pattern Engine and diagnostic machinery are hidden from normal learner flow.
- Primary action remains CONTINUE COURSE.
- Study mode retains only useful learner controls such as energy/commute; diagnostic clutter is hidden.

## Preserved exam machinery
- 1,321 imported NEU-205 MCQs: Anatomy 556, Physiology 590, Histology 175.
- 112 written prompts.
- 921 practice / 400 heldout, with known leakage excluded from clean mock selection.
- Wrong-answer flow: diagnose -> repair -> changed source-bank retest.
- Full 148-day arc through MCQ, retention, written and practical waves.

## Deployment verification
Hatchable dry-run before v17: ok=true, errors=[], warnings=[].
Deployment v17 status: live, files deployed: 8, functions: 0, warnings: none.

## Known operational note
Hatchable project visibility is personal/private, so the owner may need to sign in to Hatchable before opening the live URL. This is access friction, not a course-content dependency.

## Canonical law going forward
Do not regress to v4.3 as the learner-facing course. v4.3 remains donor/exam-engine lineage only. v5.0 FINAL / deployment v17 is the canonical learner-facing course unless a later explicitly verified build supersedes it.
