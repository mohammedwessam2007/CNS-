# RENAISSANCE v3 · ABSOLUTE COMPLETION — index, the 50 required artifacts, and where the truth lives

The third mission (`../missions/03_ABSOLUTE_COMPLETION.txt`) asked for a requirement graph, a coverage oracle, a
completion ledger, cultural possession, a masterpiece compiler, the organs, the self-adjustment layers up to L14, and
honest completion. The live status of every requirement is not written here by hand: it is computed by the coverage
oracle into `../completion/COMPLETION_LEDGER.md` on every regression. This file is the map.

| File | Contents |
|---|---|
| `01_POSSESSION.md` | the possession ladder and graph, the quote engine, primary experience, no oatmeal, source conflict, texture |
| `02_ORGANS.md` | every organ with its real session, the salon/museum/concert/conversation tests, global depth, the frontier |
| `03_ENGINE.md` | bootloader, compiler, session object, trials L1–L14, the learner model, the engines, genome and table |
| `04_MEASUREMENT.md` | the vector, the sealed battery, transformation metrics, counterfeit learners, the hostile matrix, Day 1 → mature life |
| `05_RIGHTS_MEDIA_FUTURE.md` | rights classes, the media registry, provenance; UberBond, exocortex, future interfaces, neural safety |
| `06_MISSION_LINEAGE.md` | attack on the mission, mission v2, v3 and the final evolved mission, principles, red team, unknown-unknown pass |
| `../09_SEASON_3.md` | season 3 specification, the season tournament, the critic panel, the content audit |
| `../10_MASTERPIECE_COMPILER.md` | the compiler, the Karamazov prototype, the reader-Turing test, the quote engine in detail |
| `../completion/` | the requirement graph, the ledger, the empirical queue, the re-verification schedule, the completion report |

## The 50 required artifacts (§214)

| # | Artifact | Where |
|---|---|---|
| 1 | REQUIREMENT_GRAPH | `docs/RENAISSANCE/completion/REQUIREMENT_GRAPH.json` (generated from `tools/renaissance/requirements.js` and `tools/renaissance/requirement_map.js`) |
| 2 | COVERAGE_ORACLE | `tools/renaissance/oracle.js`, tested by `tests/coverage_oracle_test.js` |
| 3 | COMPLETION_LEDGER | `docs/RENAISSANCE/completion/COMPLETION_LEDGER.md`, `docs/RENAISSANCE/completion/COMPLETION_LEDGER.json` |
| 4 | CULTURAL_POSSESSION_SPEC | `docs/RENAISSANCE/v3/01_POSSESSION.md`; `source/public/renaissance-v1.js#function possession(` |
| 5 | MASTERPIECE_COMPILER_SPEC | `docs/RENAISSANCE/10_MASTERPIECE_COMPILER.md` |
| 6 | BROTHERS_KARAMAZOV_PROTOTYPE | `source/public/renaissance-s3a.js` (km1, km2, km3); `docs/RENAISSANCE/10_MASTERPIECE_COMPILER.md` |
| 7 | READER_TURING_BENCHMARK | `docs/RENAISSANCE/sealed/README.md`, `docs/RENAISSANCE/sealed/preregistration.json`, `source/public/renaissance-sealed.js` |
| 8 | QUOTE_ENGINE | `source/public/renaissance-s3a.js#const quotes = {`, `source/public/renaissance-v1.js#function sourceSheet(` |
| 9 | PRIMARY_EXPERIENCE_ENGINE | `source/public/renaissance-v1.js#function passageView(`; `docs/RENAISSANCE/v3/01_POSSESSION.md` |
| 10 | LITERATURE_ORGAN | `source/public/renaissance-s3a.js`; `docs/RENAISSANCE/v3/02_ORGANS.md` |
| 11 | MATHEMATICS_ORGAN | `source/public/renaissance-s3b.js` (euler) |
| 12 | SCIENCE_ORGAN | `source/public/renaissance-s3b.js` (willow); `source/public/renaissance-s1.js` |
| 13 | HISTORY_ORGAN | `source/public/renaissance-s3c.js` (wisdom) |
| 14 | PHILOSOPHY_ORGAN | `source/public/renaissance-s3a.js` (km2) |
| 15 | ART_ORGAN | `source/public/renaissance-s3b.js` (pattern); `source/public/renaissance-s2.js` (taste) |
| 16 | MUSIC_ORGAN | `source/public/renaissance-s3b.js` (cadence) |
| 17 | FILM_ORGAN | `source/public/renaissance-s3c.js` (cut) |
| 18 | ARCHITECTURE_ORGAN | `source/public/renaissance-s3c.js` (arch) |
| 19 | CULTIVATION_ORGAN | `source/public/renaissance-s3c.js` (salon); `docs/RENAISSANCE/v3/02_ORGANS.md` |
| 20 | SALON_TEST | `docs/RENAISSANCE/v3/02_ORGANS.md`; `source/public/renaissance-v1.js#const TALK =` |
| 21 | MUSEUM_TEST | `source/public/renaissance-v1.js#function perception(`; `docs/RENAISSANCE/v3/02_ORGANS.md` |
| 22 | CONCERT_TEST | `source/public/renaissance-v1.js#function perception(`; `docs/RENAISSANCE/v3/02_ORGANS.md` |
| 23 | COGNITIVE_BOOTLOADER | `source/public/renaissance-s1.js`, `source/public/renaissance-s2.js`; `docs/RENAISSANCE/07_SEASON_1.md`, `docs/RENAISSANCE/08_SEASON_2.md` |
| 24 | MULTIPLEX_ENGINE | `source/public/renaissance-v1.js#function multiplex(` |
| 25 | FUNCTIONAL_INTELLIGENCE_VECTOR | `source/public/renaissance-v1.js#function vector(`; `docs/RENAISSANCE/v3/04_MEASUREMENT.md` |
| 26 | GENIUS_DELTA_BENCHMARK | `docs/RENAISSANCE/v3/04_MEASUREMENT.md`; `source/public/renaissance-v1.js#function probeReport(` |
| 27 | ALIEN_PROBLEM_SUITE | `source/public/renaissance-sealed.js`; `source/public/renaissance-v1.js#function probeDue(` |
| 28 | TRANSFORMATION_METRICS | `source/public/renaissance-v1.js#function velocity(`; `docs/RENAISSANCE/v3/04_MEASUREMENT.md` |
| 29 | CAPABILITY_GENOME | `source/public/renaissance-genome.js`; `source/public/renaissance-v1.js#function genome(` |
| 30 | CAPABILITY_PERIODIC_TABLE | `source/public/renaissance-genome.js#const table`; `docs/RENAISSANCE/omega/05_GENOME_AND_ENGINES.md` |
| 31 | REPRESENTATION_EVOLUTION | `source/public/renaissance-v1.js#const EXP = {`; `docs/RENAISSANCE/v3/03_ENGINE.md` |
| 32 | PERSONAL_PEDAGOGY_GENOME | `source/public/renaissance-v1.js#function laws(` |
| 33 | COGNITIVE_XRAY | `source/public/renaissance-v1.js#XRAY_OF` |
| 34 | WORLD_MODEL | `source/public/renaissance-v1.js#function worldModel(`; `source/public/renaissance-genome.js#const world` |
| 35 | IDEA_IMMUNE_SYSTEM | `docs/RENAISSANCE/v3/03_ENGINE.md`; `tests/renaissance_v3_test.js` (V10) |
| 36 | UNKNOWN_UNKNOWN_ENGINE | `source/public/renaissance-v1.js#function choose(`; `docs/RENAISSANCE/v3/03_ENGINE.md` |
| 37 | CREATION_ENGINE | `source/public/renaissance-v1.js#function forgeView(` |
| 38 | INVENTION_ENGINE | `source/public/renaissance-s3b.js` (pattern), `source/public/renaissance-s3c.js` (arch); `docs/RENAISSANCE/04_INVENTION_REGISTRY.md` |
| 39 | REALITY_BRIDGE | `source/public/renaissance-v1.js#function realityView(`, `source/public/renaissance-v1.js#function calibration(` |
| 40 | MEMORY_ASSIMILATION | `source/public/renaissance-v1.js#function dueHooks(`; `docs/RENAISSANCE/v3/03_ENGINE.md` |
| 41 | UBERBOND_COUPLING_SPEC | `docs/RENAISSANCE/v3/05_RIGHTS_MEDIA_FUTURE.md` |
| 42 | EXOCORTEX_SPEC | `docs/RENAISSANCE/v3/05_RIGHTS_MEDIA_FUTURE.md` |
| 43 | FUTURE_INTERFACE_SPEC | `docs/RENAISSANCE/v3/05_RIGHTS_MEDIA_FUTURE.md`; `source/public/renaissance-v1.js#speakable` |
| 44 | NEURAL_SAFETY_CONSTITUTION | `docs/RENAISSANCE/v3/05_RIGHTS_MEDIA_FUTURE.md` |
| 45 | RIGHTS_ARCHITECTURE | `source/public/renaissance-media.js`; `docs/RENAISSANCE/v3/05_RIGHTS_MEDIA_FUTURE.md` |
| 46 | MEDIA_REGISTRY | `source/public/renaissance-media.js`; `source/public/renaissance-v1.js#function media(` |
| 47 | BENCHMARK_LAB | `docs/RENAISSANCE/05_BENCHMARKS.md`; `docs/RENAISSANCE/v3/04_MEASUREMENT.md` |
| 48 | HOSTILE_TEST_MATRIX | `docs/RENAISSANCE/v3/04_MEASUREMENT.md`; `tests/hostile_test.js` |
| 49 | LONGITUDINAL_PROTOCOL | `docs/RENAISSANCE/completion/EMPIRICAL_QUEUE.md`; `docs/RENAISSANCE/v3/04_MEASUREMENT.md`; `docs/RENAISSANCE/06_LONGITUDINAL.md` |
| 50 | FINAL_EVOLVED_META_MISSION | `docs/RENAISSANCE/v3/06_MISSION_LINEAGE.md` |
