# lola-test-monorepo

This is a kid-friendly image generator. A pnpm + Turborepo monorepo with two apps:

- `apps/server`: a Hono app on Cloudflare Workers. `POST /api/generate` takes `{ item1, item2, background }`, builds a prompt, and calls Workers AI `@cf/leonardo/phoenix-1.0` through the AI Gateway `lola-image-generator`. It returns a base64 data URL.
- `apps/client`: a React 19 + Vite 7 single form. It posts to `http://localhost:8787/api/generate` (hardcoded) and renders the image.

`ai-instructions.md` is a Workers AI integration note for `@cf/leonardo/lucid-origin`. The code uses `phoenix-1.0`. Keep them in agreement when changing the model.

## Commands

```
pnpm install
pnpm dev                                   # turbo: wrangler dev (:8787) + vite (:5173)
pnpm --filter client lint
pnpm --filter client build
pnpm --filter server exec wrangler deploy --dry-run --outdir .wrangler/dry
pnpm --filter server deploy                # wrangler deploy --minify
```

Workers AI calls are billed even under `wrangler dev`.

## Skills

Checked-in skills live in `.agents/skills/<name>/`. Each has a relative symlink at `.claude/skills/<name>`.

| Skill | Use for |
| --- | --- |
| `wrangler` | Any `wrangler` command, `wrangler.jsonc` edit, secrets, or `cf-typegen` in `apps/server`. |
| `workers-best-practices` | Writing or reviewing Worker code in `apps/server/src` (streaming, bindings, secrets, floating promises). |
| `impeccable` | UI work in `apps/client`. It includes `craft` and `teach` modes. |

These were deliberately not copied. Do not re-add them without a matching change in the stack.

- `cloudflare` (2 MB): only its `workers-ai` and `ai-gateway` references apply here. Use the `cloudflare-docs` MCP server instead.
- `agents-sdk`, `durable-objects`, `sandbox-*`, `cloudflare-email-service`, `cloudflare-one*`, `turnstile-spin`: this repo has none of these products. If Turnstile is added to protect `/api/generate`, bring back `turnstile-spin`.
- `web-perf`: the client is one form. It has no performance budget to measure.
- `frontend-design`, `teach-impeccable`: `impeccable` covers these.
- The 20 impeccable sub-commands (`adapt`, `animate`, `arrange`, `audit`, `bolder`, `clarify`, `colorize`, `critique`, `delight`, `distill`, `extract`, `harden`, `normalize`, `onboard`, `optimize`, `overdrive`, `polish`, `quieter`, `shape`, `typeset`): they are loose sub-commands of the `impeccable` bundle.

## Agents

Repo-level agents are in `.claude/agents/`:

- `code-reviewer`: reviews a diff against this repo's traps (model drift, response decoding, hardcoded gateway and localhost).
- `security-engineer`: reviews the unauthenticated, billed `/api/generate` endpoint for cost abuse and child safety.
- `evidence-collector`: runs both apps, generates an image, and returns screenshots.

The user-level `~/.claude/agents/` set is not required for this repo.

## MCP

`.mcp.json` declares `cloudflare-docs`. Use it for Workers AI model inputs and AI Gateway configuration.
