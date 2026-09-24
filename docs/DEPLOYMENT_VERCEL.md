# Deployment: Vercel host (v16.2 · MCQ exam + department drawings)

| | |
|---|---|
| Live URL | **https://intellectuality-cns.vercel.app** (tab title "INTELLECTUALITY CNS v16.0 · MCQ EXAM") |
| Vercel project | `intellectuality-cns` (`prj_l4M0fAWF4ShBCPhhwrIx1OlYUlYk`), team *mohammedwessam2007's projects*, Hobby plan |
| Built from | GitHub `mohammedwessam2007/CNS-`, branch `claude/intellectuality-v14-upgrade-e2e4vt`, app from commit `f45807d` (v16.2; later docs-only commits redeploy the same app); root directory `deploy/vercel` |
| Deployment | `dpl_CyqrBpRXmSx9CZMrbVj8RtAShqJK` (v16.2): **READY** in 15 s (picture cache warm), production, aliased to `intellectuality-cns.vercel.app`, functions in `fra1` (Frankfurt). The connector's file-tree and build-log tools return 404 for Git deployments, so the file check ("38 app scripts/styles present", 50 encrypted drawings in `dist/dept`) was seen in the identical local build. Previous: `dpl_4vTt3Y9e…` (v16.0) |
| Access | Public: Vercel Authentication and password protection are **off**, so the iPad needs no Vercel login |
| Hatchable | Untouched. The Hatchable site is still v53 (there is no Hatchable connector in the build session) |

## What is served

`deploy/vercel/build.mjs` copies `source/public/` **unchanged**. It adds `host-sync.js`, which is injected as the first script in `index.html` (the only change to an app file), and replaces `login.html` with the sync-code page. Two functions sit beside them:

- `api/state.js`: the same contract as the Hatchable `/api/state` (GET, POST, `baseVersion`, 409 conflict, 413 size cap). Progress is stored in **one private Vercel Blob per learner** at `learners/<sha256(code)>.json`, with `ifMatch` concurrency. Without a store it answers `503 cloud_not_configured`.
- `api/vision.js`: `503 vision_unavailable_on_this_host`. Professor Vision needs the Hatchable AI connection; everything else works.

Since v16 the build also fails if `index.html` names a same-origin script or stylesheet that is not in the output. v16 adds six app files: `mcq-v16.js`, `mcq-v16.css`, and the four `mcq-explain-anat/phys/hist/held-v16.js` files. v16.2 adds `mcq-dept-v16.js`, `dept-figs-v16-data.js`, `dept-figs-v16.js`, and the folder `dept/` of AES-256-GCM encrypted department drawings (unreadable without the owner's key, which is never deployed).

## Pictures bundled at build time (v15.1)

`build.mjs` runs `pics.mjs`, which downloads a real, freely licensed Wikimedia picture for every exact note term, plus every fixed v9/v14 registry file, into `dist/pics/`. It writes `dist/pics/manifest.json` and `manifest.js` and injects one `<script defer src="/pics/manifest.js">` tag before `learn-v15.js`. The app then shows those pictures from its own domain, with no links. The build log prints every `[pics] term → File · licence · via · score` choice and a summary line. `build-info.json` carries the same counts under `pictures`.

- Fail-soft: without network, or when every request is refused, the build still succeeds, no tag is injected, and the app uses the live lookup.
- Limits: 7 minutes (`PICS_MINUTES`) plus a 45 s hard stop and 160 MB. Six requests run in parallel with a descriptive User-Agent. 429 and 5xx responses are retried with backoff.
- `PICS=0` turns bundling off. `PICS_WP`, `PICS_WREST` and `PICS_COMMONS` point the build at another endpoint; the tests use `tests/pics_mock_server.js`, started by `IX_PICS_MOCK=1 bash tests/host_ctl.sh start`.
- Cache: `node_modules/.cache/intellectuality-pics/` (kept by Vercel between builds).

## Offline (v15.3)

`source/public/sw.js` is registered by the app (https or localhost only). It is network-first for pages, scripts and notes, cache-first for the content-addressed bundled pictures (`/pics/<hash>.<ext>`; `manifest.js` is network-first), and it never touches `/api/*` or other origins. Its shell cache is named per version (`ix-shell-16.2` since the department drawings), so an update clears the old copies. The test harness blocks service workers except in `tests/v153_test.js` P5.

## Saving progress

- **On the device, every action, always.** This is unchanged from the app (`localStorage`). It works offline and needs no account.
- **Cloud backup and sync** (once a Blob store is connected; see below):
  - **Identity.** A private 26-character **sync code** is created on first visit. The app works without any sign-in, and the sync page is under the ☁ button ("🔑 Your sync code …").
  - **Other devices.** Open the code's link (`/#sync=CODE`) or type the code on the sync page. The other device then loads the same progress, after keeping its own copy as a local backup.
  - **When it writes.** At most one cloud write every 2 minutes while studying, plus an immediate write when the app is hidden or closed and when ☁ is tapped. This keeps write volume low; Hobby Blob plans cap monthly operations, and the exact cap was not checked from the build session.
  - **Which copy wins** is decided by the cloud version and by real learning (answers, segments, errors, reviews, XP, evidence), **never by device clocks**. An idle device reopening later loads the newer progress instead of overwriting it; the app's own timestamp rule would have overwritten it. If both devices studied, the copy with more learning wins and the other is kept as a local backup.

## Backup file (works now, no cloud needed)

On the sync page (☁ button), **⬇ Download backup** saves one dated JSON file with all progress (for Files or iCloud Drive). **⬆ Restore from backup** checks the file, keeps the current device copy as a local backup, restores, and returns to the course. A file that is not a backup is refused and nothing is changed (`tests/hostile_test.js` B1–B4).

## One step left for cloud sync: connect a Blob store (about 1 minute, owner only)

The build session's Vercel connector is not allowed to create storage (`403 forbidden: create blob`), so this needs one action in the Vercel dashboard:

1. Vercel dashboard → project **intellectuality-cns** → **Storage** → **Create Database** → **Blob**.
2. Name it `intellectuality-progress`, set access to **Private**, region **Frankfurt (fra1)** → **Create**.
3. **Connect** it to `intellectuality-cns` for **Production** (and Preview). This adds `BLOB_READ_WRITE_TOKEN`.
4. **Redeploy**: Deployments → the latest deployment → ⋯ → **Redeploy**. Or ask Claude to trigger it.

After that, the ☁ button shows **SYNCED hh:mm**, and the sync page shows "Cloud copy saved …". Until then it says **"☁ SAVED ON THIS DEVICE"**, and the sync page explains that cloud backup is not connected. Nothing is lost either way.

## Verification

| Check | Where | Result |
|---|---|---|
| Full certification (60 checks) against the **Vercel build** (`deploy/vercel/dist` + real handlers, in-memory store) | `tests/certify.js` via `tests/vercel_host_serve.js` | **60/60** (`receipts/v14/certify_checks_vercel_build.txt`) |
| Host adapter end-to-end: code, first save, batching, save-on-hide, second device by link, 3 conflict cases with skewed clocks, sync page, server guards, no page errors | `tests/vercel_host_test.js` | **14/14** (`receipts/v14/vercel_host_test.json`) |
| Device-only mode (no store): one GET, no retries, honest label, sync page message | ad-hoc Playwright run | pass |
| Vercel build | Vercel | **READY** in 11 s from commit `5f9288b` |
| Opening the live URL from the build session | sandbox curl / WebFetch / Vercel fetch tool | **Not possible**: the session's egress policy blocks `*.vercel.app`, and the connector's fetch and log tools return 403/404. Not routed around |

**On the iPad, open the URL and check:**
- the tab title reads **v16.0 · MCQ EXAM** and the date chip shows today's Cairo date;
- after a lesson's notes, its past-paper MCQs come straight away; a wrong answer shows the key's reason and a line under every option;
- on a weekend day, the sealed mock shows a timer and no pictures; after the last answer every question is explained;
- the ☁ button reads "SAVED ON THIS DEVICE" (no store yet) or "SYNCED …" (store connected).

## Rollback

- Vercel: Deployments → a previous deployment → **Promote to Production** (instant). Or delete the project; nothing else depends on it.
- The Hatchable site is unchanged (v53). The exact v53 files are commit `6e3ebec` (`python3 scripts/verify_exact_source.py`).
