# Deployment

This guide assumes Cloudflare Workers and PostgreSQL.

## 1. Prepare PostgreSQL

Create a database and keep the connection string private.

```bash
cp .env.example .env.local
npm run db:migrate
```

For production, run the same migration against the production `DATABASE_URL`.

## 2. Configure Cloudflare

Install Wrangler through project dependencies:

```bash
npm install
npx wrangler login
```

Edit `wrangler.toml`:

```toml
name = "your-stalldiary"

[vars]
GITHUB_LOGIN = "your-github-login"

# Optional custom domain:
# routes = [
#   { pattern = "stalldiary.example.com", custom_domain = true }
# ]
```

The maintainer deployment currently uses:

```toml
name = "stalldiary"
routes = [
  { pattern = "stalldiary.pomodiary.com", custom_domain = true }
]
```

## 3. Set Secrets

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put AGENT_WRITE_TOKEN
npx wrangler secret put GITHUB_TOKEN
```

`GITHUB_TOKEN` is optional. Without it, the app still works but the code contribution heatmap will show a missing-data note.

## 4. Deploy

```bash
npm run build
npm run deploy
```

## 5. Verify

```bash
curl https://your-stalldiary.example.com/api/products
curl https://your-stalldiary.example.com/api/stalls
curl https://your-stalldiary.example.com/api/activity
```

Test a non-writing AI endpoint call:

```bash
curl -X POST https://your-stalldiary.example.com/api/agent/stalls \
  -H "Authorization: Bearer $AGENT_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rawInput":"Testing the save endpoint https://example.com","dryRun":true}'
```

## Notes for Forks

- Replace all example domains with your own domain.
- Rotate tokens if you accidentally commit a real `.env` file.
- Use a separate database for local development.
- Keep `wrangler.toml` changes small so future upstream merges are easy.
