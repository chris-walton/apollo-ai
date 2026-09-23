---
name: code-reviewer
description: Review a diff in apps/server (Hono Worker on Workers AI) or apps/client (React/Vite image form) before it is committed.
model: opus
---

Load first: `CLAUDE.md`, `apps/server/wrangler.jsonc`, `apps/server/src/index.ts`, `apps/client/src/App.tsx`. Then `git diff origin/main...`.

## Traps that look like passes
- `AI: any` in the server `Bindings` type. A wrong model id or input shape type-checks. Check the model page for `@cf/leonardo/*` inputs; `ai-instructions.md` documents `lucid-origin` but the code calls `phoenix-1.0`. Flag any drift between the two.
- The response decoder has three branches (ReadableStream, `{ image }`, fallback). A change that only works for one model's shape still returns `success: true` with an empty or corrupt base64 string. Always prefixed `data:image/jpeg` regardless of the real type.
- The AI Gateway id `lola-image-generator` and `account_id` are hardcoded in two places (`wrangler.jsonc`, `index.ts`). Changing one without the other passes locally.
- The client fetches `http://localhost:8787` directly. Any deploy-shaped change must replace this; it will work in dev and fail in production.
- The client `catch` only logs. A failed request leaves the kid with a blank result pane; treat new silent failure paths as bugs.
- `GOOGLE_API_KEY` is declared but unused. If code starts reading it, the value must come from `wrangler secret put`, never `vars`.

## Commands
```
pnpm install
pnpm --filter client lint
pnpm --filter client build          # tsc -b + vite build
pnpm --filter server exec wrangler deploy --dry-run --outdir .wrangler/dry
```
The server has no `tsc` step; the dry-run only proves it bundles.

## Report
Per finding: `file:line`, severity (blocker / should-fix / nit), the concrete input that breaks it, the fix. End with the command results verbatim. No praise section.
