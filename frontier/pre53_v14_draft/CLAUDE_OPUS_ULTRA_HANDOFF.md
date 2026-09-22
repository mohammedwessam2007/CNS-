# INTELLECTUALITY v14 → Claude Opus / Claude Code Handoff

## Mission
Finish the current INTELLECTUALITY CNS app without redesigning it from scratch.

Live app:
https://intellectuality-cns-0nts.hatchable.site/

Hatchable project id:
proj_ODYBjdGkeDBq

Current source architecture:
- `public/index.html` is the large canonical course/runtime.
- `public/real-visuals-v9.js`
- `public/context-visuals-v10.js`
- `public/course-ui-v11.js`
- `public/course-ui-v11.css`
- `public/intellectuality-v12.js`
- `public/intellectuality-v12.css`
- `public/twin-core-v13.js`
- `public/twin-ui-v13.js`
- `public/twin-runtime-v13.js`
- `public/twin-v13.css`
- current draft `public/intellectuality-v14.js`
- current draft `public/intellectuality-v14.css`
- `api/vision.js`

Do NOT throw away v9-v13. v14 must be a compatibility layer on top.

## User objective
This is a personal Kasr Al Ainy CNS learning system. The objective is:
**maximum genuine understanding + reliable exam marks per occupied cognitive minute, with minimal decision-making and maximal free time.**

The user strongly prefers:
- visual-first teaching
- real medical images, diagrams, cadavers, histology, and real teaching videos
- no generic/repeated visual wallpaper
- no AI-looking educational filler
- professor-like spoon-feeding
- minimal text unless it is genuinely explanatory
- one obvious `Resume learning` flow
- Egyptian Arabic micro-commands because they stick better
- every wrong MCQ should become a visual correction, not a memorized answer
- actual local date awareness and honest carryover

## Non-negotiable learning law
Fresh material must be:
**visualize → understand → mentally simulate → predict → MCQ → visual repair if wrong**

Never use:
**MCQ → memorize option → next**

### Fresh-topic fast-lane law
The old `elite-fastlane` UI must NOT appear for truly fresh material.
Only allow fast lane when `window.INTELLECTUALITY_V14.canFastLane(l)` is true.
That function currently requires:
- v12 mastery evidence exists
- >=4 evidence points
- posterior >= .82
- memory entry exists
- >=3 memory observations

Patch the segment wrapper in `index.html` around the old `elite-fastlane` insertion so the button is omitted otherwise.

## True calendar awareness
Today at handoff is **2026-09-22 Africa/Cairo**.
The course starts 2026-09-21.

Required behavior:
- device/browser local date is the truth
- top UI must visibly say the real date
- if unfinished Sep 21 work remains on Sep 22, do NOT pretend it is Sep 21
- show: `TODAY · TUE 22 SEP · 1 DAY CARRYOVER`
- carryover banner must say this is old work being finished today
- if old day is fully completed, auto-align to current planned day
- if a fresh user opens on Sep 22, start at Sep 22 planned day
- do NOT silently delete unfinished high-value teaching
- refresh date on visibility/focus and periodically across midnight

Test all these states:
1. clean fresh state on 2026-09-22
2. incomplete day-1 state on 2026-09-22
3. completed day-1 state on 2026-09-22
4. future/ahead state
5. existing legacy user state survives

## Every practice MCQ must teach first
For fresh/unprimed practice MCQs:
- options are locked/hidden
- show `UNDERSTAND FIRST · OPTIONS LOCKED`
- show question-specific visual memory anchor
- show compact concept model
- show causal/spatial movie
- show exam conversion rule
- require click `I CAN PICTURE IT → ASK ME THE MCQ`
- only then reveal exact source stem/options

IMPORTANT:
The primer must not simply reveal the exact MCQ answer in disguised form.
It should teach the *model required to derive it*.
Preserve source bank stem/key exactly.

## Question Visual Genome
There are 1,321 source MCQs.

Goal:
Every question gets a stable question-id-based visual assignment when a legitimate image exists.

Visual priority:
1. actual source-bank figure
2. manually curated open-license anatomy/histology/physiology visual
3. real specimen / cadaver / micrograph / pathway figure
4. official YouTube thumbnail/embed/timestamp
5. reputable academic atlas link
6. if no trustworthy visual exists, show a clear no-visual state

Never fabricate anatomy to fill a box.

### Anti-repeat
Penalize reuse:
- same session
- same day
- recent questions
- same exact asset across neighboring questions
- same modality repeatedly

Reuse is allowed only when it is genuinely the canonical best image.

For repeat concepts rotate:
labeled diagram → real specimen/cadaver → teacher visual → unlabeled/recall image → side-by-side lookalike.

Persist assignments in `S.v14.visualAssignments`.

## Visual sourcing
The draft uses:
- Wikimedia Commons APIs with license metadata
- manually curated Commons filenames for high-risk concepts
- existing course-routed YouTube video IDs/timestamps
- University of Michigan Medical School SecondLook links for anatomy/histology

Do not scrape or republish arbitrary copyrighted YouTube frames.
Use official embeds/thumbnails/timestamps.
Open-license / permitted academic assets only unless user supplies material.

## Egyptian Arabic micro-command layer
Commands should appear contextually, not as decoration.

Core:
- `كوّن الصورة` → build the picture
- `طلّع شبيهه برّه` → eliminate its lookalike
- `امسك الفرق` → catch the decisive difference
- `امشي المسار` → trace the pathway
- `حدّد الإصابة` → localize the lesion
- `شوف علاقته بإيه` → map the relations
- `مين بيغذّيه؟` → trace blood supply
- `مين معصّبه؟` → find innervation
- `شغّل الميكانيزم` → run the mechanism
- `رجّعها من دماغك` → reconstruct from memory

Examples:
Histology / identification:
`طلّع شبيهه برّه`
`امسك العلامة الفاصلة قبل ما تبص للاختيارات.`

Lesion:
`حدّد الإصابة`
`مكان الإصابة الأول، وبعدها توقّع اللي هيبوظ.`

Pathway:
`امشي المسار`
`ابدأ من الأول وامشي محطة محطة، وفين بيكروس؟`

Physiology:
`شغّل الميكانيزم`
`مين بدأ؟ مين رد؟ ولو غيّرنا خطوة، الباقي يحصل له إيه؟`

## Wrong-answer Visual Autopsy
EVERY wrong practice source MCQ must show, before repair:
1. title: `ليه إجابتك غلط بصريًا؟`
2. correct visual
3. visual representing the chosen distractor / closest real lookalike if a trustworthy distinct visual exists
4. side-by-side compare
5. `الفرق الفاصل`
6. contextual Egyptian command
7. no-options recall prompt
8. then repair → changed retest

If no trustworthy distinct visual exists for the distractor:
say so.
Do NOT show a misleading image just to fill the layout.

The v14 draft already contains:
- `selectedOption`
- `wrongPseudo`
- `wrongAutopsyHTML`
- `hydrateAutopsy`
- `visualCard`

Finish and validate them.

## Mocks must remain sealed
Pre-answer held-out mocks MUST NOT get teaching primers or answer-revealing visuals.
Preserve:
- held-out split
- leak exclusions
- exact source key
- confidence measurement

After a mock question is submitted wrong, visual explanation is allowed as part of post-answer repair/autopsy, but do not leak future held-out items.

## Retests
Changed retest must be a different source question whenever possible.
Do not allow visual explanation to reveal the retest answer before the attempt.
After failure, run another visual repair.

## UI law
Do not turn this into another dashboard.
Normal user experience should remain:
`Resume learning`

The intelligence is underneath.

No horizontal overflow at:
- 390×844
- 820×1180
- 1024×1366

Lazy-load remote images near viewport.
Do not fire 1,321 network requests at startup.

## Current v14 code
See:
- `intellectuality-v14-current.js`
- `intellectuality-v14-current.css`

Treat these as the current draft, not a blank-slate suggestion.

## Current important legacy behaviors to preserve
- v9 real visual topic layer
- v10 contextual paragraph/question visuals
- v11 Coursera-like low-friction shell
- v12 personal autopilot/mastery/error/twin logic
- v13 learning twin
- exact 1,321 imported MCQs
- 921 practice / 400 nominal held-out
- leak filtering from pattern engine
- source provenance
- source answer keys
- cloud state
- Professor Vision
- commute mode
- practical/written waves
- wrong-answer repair/retest
- one-button flow

## Acceptance test suite
Do not call it finished until all pass.

### A. Date
- actual local date on UI is Sep 22
- fresh state aligns to Sep 22 plan day
- unfinished Sep 21 stays as carryover but clearly says real date Sep 22
- completed Sep 21 advances
- no stale-date UI anywhere important

### B. Fresh learning
- fresh question does not immediately show answer options
- fast lane hidden for fresh topic
- primer contains real visual and model
- button reveals exact original MCQ

### C. Correct MCQ
- exact source key preserved
- post-answer “why this makes sense”
- no source answer mutation

### D. Wrong MCQ
- wrong answer creates v12/v13 error evidence
- visual autopsy appears
- correct anchor loads
- wrong/lookalike visual loads only if trustworthy
- Egyptian command is contextual
- no-options recall prompt appears
- Repair leads to changed source retest

### E. Histology
- uses real micrograph where possible
- command favors `طلّع شبيهه برّه`
- lookalike discrimination is explicit

### F. Pathway / lesion
- pathway command uses `امشي المسار`
- lesion command uses `حدّد الإصابة`
- visual/explanation reflects crossing/localization logic

### G. Mock integrity
- no pre-answer primer
- no answer leak
- held-out behavior unchanged
- wrong answer still enters repair after submission

### H. Visual diversity
Sample at least 30 consecutive practice questions:
- report unique primary visual count
- flag exact repeats
- exact repeat rate target under 10% unless canonical reuse is justified
- same asset must not appear repeatedly on adjacent unrelated questions

### I. Performance
- initial page should not prefetch the entire Qbank visual library
- no runaway observers/listeners
- responsive on iPad
- no console exceptions in normal study flow

### J. Regression
- existing saved v13 user state migrates intact
- cloud state still works
- course integrity gate still passes
- production errors = 0 after deploy

## Deliverable
Implement, deploy, then open the live app and actually test it.
Do not merely report that code “looks right.”

Return:
- deployment version
- exact tests passed
- any remaining known limitation
- no inflated “100% perfect” claim unless every acceptance test above has actually passed.
