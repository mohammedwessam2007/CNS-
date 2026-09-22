# Hatchable Platform Law for This Project

If live Hatchable MCP is available, read `AGENTS.md` from project `proj_ODYBjdGkeDBq` before making platform changes.

Critical constraints at handoff:
- no build step
- source files are production files
- no TypeScript in public/api
- no ORMs
- no Next/Remix/SvelteKit/Astro/Express/Fastify
- every routed API file declares `export const access`
- API handler shape: default async `(req, res)`
- `/api/auth/*` is reserved
- AI keys are configured through `[ai]`, not improvised secret plumbing
- durable state uses Postgres/storage, not filesystem
- use Hatchable SDK services instead of native process/browser/provider SDKs
- run `dry_run_deploy` before deployment
- every deploy includes `intent` and `summary`
- deploy is atomic and is what changes live
- after deploy, test live and inspect logs

Current functions:
- `/api/state`
- `/api/vision`

Current persistent table:
- `intellectuality_learning_state`

Current baseline:
- v53
