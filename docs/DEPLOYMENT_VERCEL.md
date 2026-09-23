# Deployment: Vercel host (v14.3)

| | |
|---|---|
| Live URL | **https://intellectuality-cns.vercel.app** (tab title "INTELLECTUALITY CNS v14.3 · UNDERSTAND FIRST") |
| Vercel project | `intellectuality-cns` (`prj_l4M0fAWF4ShBCPhhwrIx1OlYUlYk`), team *mohammedwessam2007's projects*, Hobby plan |
| Built from | GitHub `mohammedwessam2007/CNS-`, branch `claude/intellectuality-v14-upgrade-e2e4vt`, commit `5f9288b`; root directory `deploy/vercel` |
| Deployment | `dpl_5VVHU6ySd6Ureg2WweAe9d3h3Uqf`: **READY**, production, functions in `fra1` (Frankfurt) |
| Access | Public: Vercel Authentication and password protection are **off**, so the iPad needs no Vercel login |
| Hatchable | Untouched. The Hatchable site is still v53 (there is no Hatchable connector in the build session) |

## What is served

`deploy/vercel/build.mjs` copies `source/public/` **unchanged**. It adds `host-sync.js`, which is injected as the first script in `index.html` (the only change to an app file), and replaces `login.html` with the sync-code page. Two functions sit beside them:

- `api/state.js`: the same contract as the Hatchable `/api/state` (GET, POST, `baseVersion`, 409 conflict, 413 size cap). Progress is stored in **one private Vercel Blob per learner** at `learners/<sha256(code)>.json`, with `ifMatch` concurrency. Without a store it answers `503 cloud_not_configured`.
- `api/vision.js`: `503 vision_unavailable_on_this_host`. Professor Vision needs the Hatchable AI connection; everything else works.

## Saving progress

- **On the device, every action, always.** This is unchanged from the app (`localStorage`). It works offline and needs no account.
- **Cloud backup and sync** (once a Blob store is connected; see below):
  - **Identity.** A private 26-character **sync code** is created on first visit. The app works without any sign-in, and the sync page is under the ☁ button ("🔑 Your sync code …").
  - **Other devices.** Open the code's link (`/#sync=CODE`) or type the code on the sync page. The other device then loads the same progress, after keeping its own copy as a local backup.
  - **When it writes.** At most one cloud write every 2 minutes while studying, plus an immediate write when the app is hidden or closed and when ☁ is tapped. This keeps write volume low; Hobby Blob plans cap monthly operations, and the exact cap was not checked from the build session.
  - **Which copy wins** is decided by the cloud version and by real learning (answers, segments, errors, reviews, XP, evidence), **never by device clocks**. An idle device reopening later loads the newer progress instead of overwriting it; the app's own timestamp rule would have overwritten it. If both devices studied, the copy with more learning wins and the other is kept as a local backup.

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
- the tab title reads v14.3 and the date chip shows today's Cairo date;
- answer a question: options appear after "I CAN PICTURE IT", and after answering you see *EVERY OPTION, PICTURED*;
- the ☁ button reads "SAVED ON THIS DEVICE" (no store yet) or "SYNCED …" (store connected).

## Rollback

- Vercel: Deployments → a previous deployment → **Promote to Production** (instant). Or delete the project; nothing else depends on it.
- The Hatchable site is unchanged (v53). The exact v53 files are commit `6e3ebec` (`python3 scripts/verify_exact_source.py`).
