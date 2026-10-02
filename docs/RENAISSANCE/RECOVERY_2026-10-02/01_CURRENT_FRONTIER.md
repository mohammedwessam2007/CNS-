# CURRENT RENAISSANCE FRONTIER

## Git truth

Recovery snapshot commit:
`f0110f13032f37b0c96307e71134266519eddc80`

Commit message:
`renaissance deploy: add dedicated project prebuilt CI release`

Its parent:
`f5b99de90c59d0806d69b8e419c10f487885ca1d`

The executable Reader/Campus tree is unchanged from the frozen Reader OS 2.0 / Campus 1.2 lineage. The latest snapshot adds the dedicated-project GitHub Actions deployment workflow:
`.github/workflows/renaissance-separate-vercel.yml`

## Current standalone Vercel release

Stable standalone URL:
`https://intellectuality-cns-git-ren-81d684-mohammedwessam2007s-projects.vercel.app`

Live build-info at recovery:
- commit: `0c9a9ca4c239c27b9aa4b1fce7a8ecfd113fbecd`
- branch: `renaissance/standalone-v1`
- mode: `standalone+reader-os+campus`
- 257 integrity-tracked deployed assets
- 58,918,637 bytes
- Reader OS 2.0
- Campus 1.2
- local PDF runtime
- local English + Arabic Tesseract OCR assets
- medical leak keys: 0

Canonical direct deployment recorded in prior receipt:
`dpl_2NcgenexHQQoeK1ZjLzB2dp9PtN7`
Direct URL:
`https://intellectuality-7jpe9x6wa-mohammedwessam2007s-projects.vercel.app`

The stable branch alias and live build-info are more useful than the ephemeral direct URL for ordinary continuation.

## Dedicated Vercel project

A separate project already exists:
- name: `intellectuality-holiday-renaissance`
- project ID: `prj_a4IsKK63xEYTa5VBwi556zFWTd9z`
- team: `team_A9LnjIuS5PU0rNetsHMu1N0r`

Dedicated deploy workflow now exists:
`.github/workflows/renaissance-separate-vercel.yml`

It:
1. checks out the exact branch commit;
2. requires `VERCEL_TOKEN` as a GitHub repository secret;
3. runs Reader OS hostile tests;
4. runs Campus invariant tests;
5. pins Vercel CLI 59.20.0;
6. writes a local project binding to the dedicated Renaissance project ID;
7. pulls dedicated project settings;
8. builds production locally;
9. fails closed if medical assets leak;
10. deploys `--prebuilt --prod` to the dedicated Renaissance project.

## Current blockers

### External blocker A · GitHub secret
The workflow requires repository secret `VERCEL_TOKEN`.
No secret value is stored in this recovery folder or committed to Git.

### External blocker B · Vercel free-plan build-rate limit
The newest snapshot `f0110f13032f37b0c96307e71134266519eddc80` received Vercel commit status failure:
`Deployment rate limited — retry in 24 hours.`

This is an external quota failure, not a Reader/Campus source/test failure.

## ShipStatic state

ShipStatic was considered as a completely independent hosting path.
The account-check/approval path was declined in the chat UI, so no ShipStatic deployment was claimed or recorded as completed.
Do not say ShipStatic is live unless a future session obtains a successful deployment receipt.

## Truthful separation status

Already achieved:
- separate physical Renaissance artifact
- separate stable Renaissance URL
- medical assets absent from Renaissance artifact
- medical production untouched

Not yet completed at this snapshot:
- production deployment inside the dedicated Renaissance Vercel project object

The dedicated-project workflow is implemented and ready for that final infrastructure step once the required secret/quota path is available.
