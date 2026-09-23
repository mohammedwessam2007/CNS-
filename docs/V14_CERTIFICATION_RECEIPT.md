# v14.2 Certification Receipt (+ v14.3 addendum at the end)

| | |
|---|---|
| Candidate | **INTELLECTUALITY CNS v14.2**. The tab title reads "INTELLECTUALITY CNS v14.2 · UNDERSTAND FIRST". |
| Deployment status | **NOT DEPLOYED.** This build session has no Hatchable MCP connector (only unrelated Vercel/Lovable/Higgsfield connectors), and its network policy blocks `*.hatchable.site`, Wikimedia and Wikipedia (HTTP 403 from the egress proxy; not retried or routed around). Live is still **v53**. |
| Rollback point | Live: Hatchable deployment **v53** (unchanged). Source: git commit **`6e3ebec`** holds the exact 26 v53 files; verify with `python3 scripts/verify_exact_source.py`. |
| Candidate package | `source/` on branch `claude/intellectuality-v14-upgrade-e2e4vt`. 27 deploy files; 7 differ from v53. `manifests/V14_2_CANDIDATE_MANIFEST.json` + `V14_2_SHA256SUMS.txt`; verify with `python3 scripts/verify_exact_source.py manifests/V14_2_CANDIDATE_MANIFEST.json`. |
| Where certified | Local static server (`tests/serve.js`, `/api/state` emulated in memory). Chromium from `/opt/pw-browsers` via Playwright. Browser clock frozen per check; timezone `Africa/Cairo` (A7 uses UTC). Wikimedia Commons API **mocked** (deterministic titles, licenses, 1×1 images); A–N follow `docs/CERTIFICATION_MATRIX.md`. |
| Result | **60/60 checks passed (87s)**. Additional receipts: leak audit 0/921, visual review 0 irrelevant of 115, autopsy discriminators 22/22 (`docs/VISUAL_QBANK_AUDIT.md`). |

## Checks

### A · Calendar truth (Cairo date)

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | A1 | Fresh state on Sep 22: real date + first-run catch-up label, no fake date | `{"chip":"TODAY · TUE 22 SEP · FIRST-RUN CATCH-UP","ey":"DAY 1/148 · FOUNDATION · WORK MON 21 SEP · TODAY TUE 22 SEP","banner":"FIRST-RUN CATCH-UP · RE` |
| ✅ PASS | A0 | Sep 21 (course day 1): chip is plain real date | `TODAY · MON 21 SEP` |
| ✅ PASS | A2 | Sep 22 00:01 with Day-1 partial: "1 DAY CARRYOVER" + deliberate carryover banner, work kept | `{"chip":"TODAY · TUE 22 SEP · 1 DAY CARRYOVER","banner":"CARRYOVER · REAL DATE KEPT\nToday is Tue 22 Sep. This is unfinished Mon 21 Sep work, carried ` |
| ✅ PASS | A3 | Midnight rollover re-evaluates without reload (23:59 → 00:01) | `{"before":"TODAY · MON 21 SEP","after":"TODAY · TUE 22 SEP · 1 DAY CARRYOVER"}` |
| ✅ PASS | A4 | Sep 22 with Day-1 complete: auto-advance to Day 2, plain real date | `{"chip":"TODAY · TUE 22 SEP","day":2,"done":[1],"banner":false}` |
| ✅ PASS | A5 | Sep 23 after Day-2 partial: "TODAY | `WED 23 SEP · 1 DAY CARRYOVER" (Tue 22 Sep work)  · {"chip":"TODAY · WED 23 SEP · 1 DAY CARRYOVER","day":2,"banner":"CARRYOVER · REAL DATE KEPT\nToday ` |
| ✅ PASS | A6 | Ahead state: labeled AHEAD, never regresses | `{"chip":"TODAY · TUE 22 SEP · 1 DAY AHEAD","day":3}` |
| ✅ PASS | A7 | Cairo date is used even when the device timezone is UTC | `TODAY · TUE 22 SEP · 1 DAY CARRYOVER` |

### B · Fresh concept / understanding-first

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | B1 | Fresh learner: fast lane absent and ineligible on the teach step | `{"fast":false,"predict":3,"sayVisible":0,"canFast":false}` |
| ✅ PASS | B2 | Professor feed hides source answers behind predict-then-reveal | `{"fast":false,"predict":3,"sayVisible":0,"canFast":false}` |
| ✅ PASS | B3 | Practice MCQ: options locked behind the understanding primer | `{"primer":true,"opts":0,"gate":"I CAN PICTURE IT → ASK ME THE MCQ","cmd":"كوّن الصورة","vis":2,"caption":0,"steps":["1 · SEE IT · كوّن الصورة","2 · UN` |
| ✅ PASS | B4 | Primer structure: SEE IT → UNDERSTAND IT → BUILD THE MOVIE → EXAM CONVERSION + one Egyptian command | `{"primer":true,"opts":0,"gate":"I CAN PICTURE IT → ASK ME THE MCQ","cmd":"كوّن الصورة","vis":2,"caption":0,"steps":["1 · SEE IT · كوّن الصورة","2 · UN` |
| ✅ PASS | B5 | Primer shows ≥1 real visual with neutral (title-hidden) caption pre-answer | `{"primer":true,"opts":0,"gate":"I CAN PICTURE IT → ASK ME THE MCQ","cmd":"كوّن الصورة","vis":2,"caption":0,"steps":["1 · SEE IT · كوّن الصورة","2 · UN` |
| ✅ PASS | B6 | No pre-answer Commons query contains key-distinctive words | `{"guard":["dura","sheath","root"],"leakQ":[]}` |
| ✅ PASS | B7 | Gate reveals the exact source stem/options/keys (byte-for-byte) with confidence capture | `{"stemOk":true,"optsOk":true,"conf":3}` |

### C · Correct answer

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | C1 | Correct answer: same item stays with "why it makes sense" (no silent swap to a new question) | `{"sameQ":true,"why":true,"key":["d"],"pinned":true,"ev":1,"pred":"Your prediction: my guess"}` |
| ✅ PASS | C2 | v12 evidence increments on a source answer | `{"before":0,"after":1}` |
| ✅ PASS | C2b | Learner prediction is echoed after answering | `Your prediction: my guess` |
| ✅ PASS | C3 | NEXT completes the segment and moves to the other question slot (no loop) | `{"q1":"EHSAN-ANAT-SPINAL-CORD-MCQ-24","q2":{"id":"EHSAN-ANAT-SPINAL-CORD-MCQ-5","keys":["b"],"opts":["a","b","c","d"],"stem":"If we need to insert a n` |
| ✅ PASS | C4 | Guess-correct is treated as weak evidence (extra explanation) | `{"guess":true,"why":true}` |
| ✅ PASS | C5 | v13 Learning Twin ingests the evidence; v14 ledger attributes visual/command/depth | `{"twinEv":2,"ledger":2,"mod":{"spe":{"n":1,"ok":1},"dia":{"n":1,"ok":1}},"cmd":{"build":{"n":2,"ok":2}}}` |

### D · Wrong answer → visual autopsy → repair

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | D1 | Confident wrong → REPAIR with error genome "confident misconception" | `{"kind":"REPAIR","autopsy":true,"choice":"a","head":"ليه إجابتك غلط بصريًا؟","diff":"Pia clings to the cord and forms the denticulate ligaments, which` |
| ✅ PASS | D2 | Visual autopsy maps the selected option (data + text) and shows الفرق الفاصل + command | `{"kind":"REPAIR","autopsy":true,"choice":"a","head":"ليه إجابتك غلط بصريًا؟","diff":"Pia clings to the cord and forms the denticulate ligaments, which` |
| ✅ PASS | D3 | Repair is gated behind a no-options reconstruction; topic wallpaper suppressed | `{"kind":"REPAIR","autopsy":true,"choice":"a","head":"ليه إجابتك غلط بصريًا؟","diff":"Pia clings to the cord and forms the denticulate ligaments, which` |
| ✅ PASS | D3b | Autopsy sides hydrate (visual or honest note), no wallpaper companions; autopsy → reconstruction → button order | `{"skeletons":0,"companions":0,"order":true,"wrongSide":"No trustworthy distinct visual exists for this distractor.\nUse the decisive reasoning differe` |
| ✅ PASS | D4 | Blocked until reconstruction typed; typing unlocks | `{"still":"REPAIR","unlocked":true}` |
| ✅ PASS | D5 | Changed source retest: practice split, different stem, not a near-duplicate, stable across renders | `{"rt":{"kind":"RETEST","qid":"EHSAN-ANAT-SPINAL-CORD-MCQ-20","chip":"CHANGED SOURCE RETEST"},"rtq":{"split":"practice","sameStem":false,"near":false,"` |

### E · Wrong retest / loop guard

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | E1 | Second miss → another targeted visual repair on the retest item; gate re-armed | `{"kind":"REPAIR","autopsyQ":"EHSAN-ANAT-SPINAL-CORD-MCQ-20","disabled":true}` |
| ✅ PASS | E2 | Repair loop guard: after 3 changed misses the error is parked to spaced repair (no infinite loop) | `{"kind":"FATIGUE_RESET","parked":1,"notice":"PARKED FOR SPACED REPAIR\nSpinal cord I: three changed items in a row still missed. More drilling now has` |

### F–I · Command routing (histology, tract, lesion, physiology)

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | F1 | Histology items route to طلّع شبيهه برّه / فرّق النسيج | `["طلّع شبيهه برّه · Regarding the peripheral nerve","طلّع شبيهه برّه · Regarding degeneration of nerves, which answer is correct?","طلّع شبيهه برّه · ` |
| ✅ PASS | G1 | Tract items route to امشي المسار | `["امشي المسار · Axons of the lateral corticospinal tract synapse mainly with","امشي المسار · Decussation of internal arcuate fibres takes place in","ا` |
| ✅ PASS | H1 | Lesion items route to حدّد الإصابة | `["حدّد الإصابة · Patient came to ER with LMNL of the hypoglossal nerve on the right sid","حدّد الإصابة · In case of right corticonuclear tract injury ` |
| ✅ PASS | I1 | Physiology mechanism items route to شغّل الميكانيزم / perturb / receptor start | `["شغّل الميكانيزم · The Release of neurotransmitters at a chemical synapse in the CNS is d","مين بدأ؟ · Action potentials recorded after stimulation o` |

### J · Held-out mock firewall

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | J1 | Held-out mock item: no primer, no cue, no companion/answer image, confidence kept | `{"primer":false,"cmd":false,"comp":0,"vis":0,"conf":3,"opts":4,"banner":false}` |
| ✅ PASS | J2 | Mock uses held-out split only and excludes the 60 leak-audited items | `{"items":5,"leaked":[]}` |
| ✅ PASS | J3 | No Commons query built from the held-out key | `[]` |
| ✅ PASS | J4 | Post-submission: visual autopsy for the consumed miss only | `{"autopsies":1,"result":true}` |
| ✅ PASS | J5 | Mock miss repair retests on a practice item, never a future held-out item | `{"e":{"src":"EHSAN-ANAT-SPINAL-CORD-MCQ-21","kind":"REPAIR"},"rq":{"id":"EHSAN-ANAT-SPINAL-CORD-MCQ-20","split":"practice"}}` |

### K · Visual diversity + screen dedupe

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | K1 | Teach screen: v10 companions capped (≤3 images), no duplicate image or teacher card | `{"n":3,"uniq":3,"vids":["6XtPzcXAqBc","xXWsQrl1N7s","tRbctv7JNDc"]}` |
| ✅ PASS | K2 | Visual-diversity engine (mocked Commons, 60 items): exact repeat <10%, adjacent 0 | `{"n":60,"primaryCoveragePct":98.3,"uniqueVisualPct":100,"exactRepeatPct":0,"adjacentRepeatPct":0,"noVisualPct":1.7,"irrelevantPct":"requires human rev` |

### L · Performance and state

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | L1 | Network concurrency cap: ≤2 Commons requests in flight (all layers share one queue) | `{"maxInFlight":2,"requests":88}` |
| ✅ PASS | L2 | Re-running INTELLECTUALITY_V14_INIT does not double-wrap | `true` |
| ✅ PASS | L3 | Cloud payload bounded (S < 1.5 MB API cap, v14 slice small) | `{"S":27086,"v14":1411}` |
| ✅ PASS | L4 | Cold load does not prefetch the question bank visuals (Commons requests on first screen ≤ 12) | `{"commonsOnLoad":0}` |
| ✅ PASS | L5 | Legacy v53/v14 state migrates in place (evidence kept, answer-derived assignments dropped) | `{"schema":2,"segs":2,"va":false,"vc":1,"legacy":{"from":"14.0","droppedAssignments":1,"primersSeen":3,"migratedAt":"2026-09-22T07:00:00.430Z"},"chip":` |
| ✅ PASS | L6 | Remote image host down: primer text + gate still work, honest no-visual state | `{"primer":true,"model":188,"missing":true,"gate":true}` |

### M · Responsive (iPhone / iPad)

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | M-iphone | Responsive 390×844: no horizontal overflow; gate ≥44px; Arabic readable | `{"o1":{"sw":390,"iw":390,"ok":true},"o2":{"sw":390,"iw":390,"ok":true},"o3":{"sw":390,"iw":390,"ok":true},"tap":52}` |
| ✅ PASS | M-ipad-portrait | Responsive 820×1180: no horizontal overflow; gate ≥44px; Arabic readable | `{"o1":{"sw":820,"iw":820,"ok":true},"o2":{"sw":820,"iw":820,"ok":true},"o3":{"sw":820,"iw":820,"ok":true},"tap":52}` |
| ✅ PASS | M-ipad-pro-portrait | Responsive 1024×1366: no horizontal overflow; gate ≥44px; Arabic readable | `{"o1":{"sw":1024,"iw":1024,"ok":true},"o2":{"sw":1024,"iw":1024,"ok":true},"o3":{"sw":1024,"iw":1024,"ok":true},"tap":52}` |
| ✅ PASS | M-ipad-landscape | Responsive 1180×820: no horizontal overflow; gate ≥44px; Arabic readable | `{"o1":{"sw":1180,"iw":1180,"ok":true},"o2":{"sw":1180,"iw":1180,"ok":true},"o3":{"sw":1180,"iw":1180,"ok":true},"tap":52}` |

### N · Regression + page errors

| Result | ID | Check | Evidence (truncated) |
|---|---|---|---|
| ✅ PASS | N0 | No page errors during fresh + correct flow | `[]` |
| ✅ PASS | N1 | No page errors during wrong/autopsy/retest flow | `[]` |
| ✅ PASS | N2 | No page errors during mock flow | `[]` |
| ✅ PASS | N3 | No page errors in engine/perf probes | `[]` |
| ✅ PASS | N4 | v9 real visual bank, v11 shell, v12 brain, v13 twin, content integrity gate, Resume learning | `{"v9":true,"v11":true,"v12":true,"v13":true,"integrity":true,"resume":"Resume learning"}` |
| ✅ PASS | N5 | Autopilot brain drawer (v12 + v13 addon) still opens | `true` |
| ✅ PASS | N6 | Written wave, practical wave, weekly mock, retention bridge and commute views render | `{"WRITTEN_WAVE":true,"PRACTICAL_WAVE":true,"WEEKLY_MOCK":true,"RETENTION_BRIDGE":true,"commute":true}` |
| ✅ PASS | N7 | No page errors on cold load + drawers | `[]` |
| ✅ PASS | N8 | No page errors on legacy migration | `[]` |
| ✅ PASS | N9 | No page errors when Commons is unreachable | `[]` |

## Date simulations (A)

| Simulated moment (Africa/Cairo) | Saved state | Chip shown | Behaviour |
|---|---|---|---|
| Mon 21 Sep 10:00 (course day 1) | fresh | `TODAY · MON 21 SEP` | plain real date |
| Tue 22 Sep 10:00 | fresh (first run on day 2) | `TODAY · TUE 22 SEP · FIRST-RUN CATCH-UP` | real date kept; work day label "WORK MON 21 SEP · TODAY TUE 22 SEP" |
| Tue 22 Sep 00:01 | Day-1 partial | `TODAY · TUE 22 SEP · 1 DAY CARRYOVER` | carryover banner "Today is Tue 22 Sep. This is unfinished Mon 21 Sep work, carried forward deliberately."; unfinished teaching **not** skipped |
| Mon 21 Sep 23:59 → Tue 22 Sep 00:01 without reload | Day-1 partial | `TODAY · MON 21 SEP` → `TODAY · TUE 22 SEP · 1 DAY CARRYOVER` | 60 s tick plus visibility/focus/pageshow recompute |
| Tue 22 Sep | Day-1 complete | `TODAY · TUE 22 SEP` | auto-advance to Day 2, no banner |
| Wed 23 Sep | Day-2 partial | `TODAY · WED 23 SEP · 1 DAY CARRYOVER` | Tue 22 Sep work carried |
| Tue 22 Sep | ahead (Day 3 open) | `TODAY · TUE 22 SEP · 1 DAY AHEAD` | never regresses |
| Tue 22 Sep, device timezone **UTC** | Day-1 partial | `TODAY · TUE 22 SEP · 1 DAY CARRYOVER` | Cairo date used regardless of device zone |

## Changed files (vs v53)

| File | v53 SHA-256 (first 16) | v14.2 SHA-256 | Bytes |
|---|---|---|---|
| `public/context-visuals-v10.js` | 1006f79819bc08b5 | `93d7650705469cab17fb9c1dfc069441d17af35fed3a5633c819a2061599aae0` | 20,044 |
| `public/index.html` | 5795333440b0d4a2 | `38db17ee73077c27e5c6e425fc410ed07ea6a1462ee71ab7e88690ab878df268` | 2,929,696 |
| `public/intellectuality-v14.css` | c4662019d4edd222 | `6319914188f5bf01349a5d306b355d39f44aaeb716d7ff6f1ed7755044dda869` | 10,922 |
| `public/intellectuality-v14.js` | 06cfcb0d529390f4 | `5411141b2266542b14a40b4fc15dd3c3c12c8c4242b071f4061f7641f10f7cfa` | 102,106 |
| `public/real-visuals-v9.js` | 5489a642779c9e9e | `1eecb61e0dcf49d074026567c4cf49250fdb40776069c76052e414ab7df60845` | 11,471 |
| `public/twin-runtime-v13.js` | 9165e0ebb4df19b1 | `2749742236568793386ac1eaacae924f5125c902ca3d90612fe4dd896e8b907a` | 10,314 |
| `public/visual-registry-v14.js` | (new file) | `2764db7bd4feaed4231cb2723e62889bc5037d0e372f4134b388512fefdbf5e2` | 74,380 |

The other 20 deploy files (`api/state.js`, `api/vision.js`, `hatchable.toml`, the migration, professor/deep content, v5/v11/v12/v13 core/ui files and CSS) are byte-identical to v53.

## Rollback safety probe

`tests/rollback_probe.js` (receipt `receipts/v14/rollback_probe.json`):
1. A v14.2 session writes state (`S.v14` schema 2).
2. The **exact v53 files** (from `6e3ebec`, served on :8788) load that state: 0 page errors, `render()` runs clean, and v53's own initializer re-creates the fields it needs.
3. Back on v14.2, schema 2 and primed progress are intact, and v53's re-added answer-derived fields are dropped again. 0 page errors. **pass: true.**

## Not certified here (requires the live site)

- Production logs after deploy (`view_logs`): **no deployment happened, so there are no logs.**
- Real Wikimedia Commons responses: category contents, thumbnail loads, the live license strings.
- Real iPad Safari: jank, memory, touch. Only Chromium device emulation at 390×844, 820×1180, 1024×1366 and 1180×820 was run.
- Cloud state round-trip against the real `/api/state` + Postgres. The emulator accepted the payload (size bound L3 passed); no round-trip assertion against the real backend.
- Professor Vision (`/api/vision`): the file is unchanged from v53 and the v12 drawer opens (N5), but no vision request was made.

## Deploy procedure (when a Hatchable-connected session is available)

1. `python3 scripts/verify_exact_source.py manifests/V14_2_CANDIDATE_MANIFEST.json` → must print `OK: 27`.
2. With the Hatchable MCP on project `proj_ODYBjdGkeDBq`: `read_file AGENTS.md`, then `write_files` for the 7 changed files in `source/public/` (paths as in the table).
3. `dry_run_deploy`, then `deploy`:
   - intent: "Upgrade INTELLECTUALITY to v14: understanding-first qbank, Cairo date truth, visual genome and wrong-answer visual autopsy without breaking v9–v13";
   - summary: "Practice MCQs now open with an answer-blind understanding primer and a real-image visual, and wrong answers get a visual autopsy with a no-options reconstruction before a changed retest. The calendar shows the real Cairo date with honest carryover labels, and visuals rotate under one shared anti-repeat governor. Held-out mock items stay firewalled."
4. If the response says `is_draft`, open `draft_url`. Promotion to live is the owner's click.
5. Live checks (tab title must read v14.2; hard-refresh if it doesn't):
   - calendar chip shows today's Cairo date;
   - open a new lesson: no fast lane, primer before options;
   - answer one item wrong on purpose: autopsy, reconstruction gate, changed retest;
   - start a mock: no primer or images;
   - in the console, `await INTELLECTUALITY_V14.audit({n:60})` and review `rows[].primary`;
   - `view_logs` shows zero new errors.
6. Rollback: redeploy the v53 files from commit `6e3ebec` (verified by `scripts/verify_exact_source.py`), or use the Hatchable console history to restore deployment 53. v14 state lives under `S.v14` and is ignored by v53 code; the legacy fields v53 reads are left intact.

## v14.3 addendum: option pictures + Vercel deployment

| | |
|---|---|
| Deployed | **https://intellectuality-cns.vercel.app**, Vercel deployment `dpl_5VVHU6ySd6Ureg2WweAe9d3h3Uqf`, READY, commit `5f9288b`, region fra1. Hatchable remains v53. |
| Certification, plain build (`source/public`) | **60/60** (`receipts/v14/certify_checks.txt`) |
| Certification, Vercel build (`deploy/vercel/dist` + real `api/state.js` on an in-memory store) | **60/60** (`receipts/v14/certify_checks_vercel_build.txt`) |
| Host adapter (save, batch, hide, link, conflicts with clock skew, sync page, guards) | **14/14** (`receipts/v14/vercel_host_test.json`) |
| Option pictures (never pre-answer, all options / other options, no repeats) | **7/7**; 36/160 options pictured in a 40-item sample, 0 wrong-structure pictures on review (`receipts/v14/options_gallery.json`) |
| Leak audit after the change | **0/921** text leaks, 0 answer-derived queries |
| Manifest | `manifests/V14_3_CANDIDATE_MANIFEST.json` (27 deploy files, 7 changed vs v53) |
| Not verified | Opening the live URL from the build session (egress-blocked), production logs (connector 403), real Commons responses, real iPad Safari |

