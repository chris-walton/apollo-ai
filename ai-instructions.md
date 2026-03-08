# Cloudflare Worker: Leonardo **Lucid Origin** (Text-to-Image) Integration Guide

This doc shows how to call **Leonardo Lucid Origin** from a Cloudflare Worker using **Workers AI**.

- **Model ID:** `@cf/leonardo/lucid-origin` :contentReference[oaicite:0]{index=0}
- The model page includes a minimal Worker example and a REST API curl example. :contentReference[oaicite:1]{index=1}

---

## 1) Prereqs

1. A Cloudflare account with **Workers AI** enabled.
2. A Worker project using Wrangler.
3. Add a Workers AI binding named `AI` in `wrangler.toml` (or `wrangler.jsonc`). :contentReference[oaicite:2]{index=2}

---

## 2) Configure `wrangler.toml`

Add this to your `wrangler.toml`:

```toml
# wrangler.toml
name = "my-image-worker"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[ai]
binding = "AI" # available as env.AI
