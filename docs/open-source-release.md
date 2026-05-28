# Open Source Release Checklist

Use this checklist before turning a private StallDiary repository into a public one.

## 1. Rotate Credentials

Rotate any credential that has ever appeared in the repository, even if it has since been removed from the latest files.

At minimum, check:

- PostgreSQL connection strings
- Cloudflare API tokens and Worker secrets
- `AGENT_WRITE_TOKEN`
- `GITHUB_TOKEN`
- `.env`, `.env.local`, `.dev.vars`, and copied logs

## 2. Scan Current Files

```bash
rg -n "postgresql://|AGENT_WRITE_TOKEN|GITHUB_TOKEN|Authorization: Bearer" \
  -g '!node_modules' \
  -g '!dist' \
  .
```

Only placeholders in documentation or `.env.example` should remain.

## 3. Scan Git History

```bash
git log --all -S 'postgresql://' --oneline -- .
git log --all -S 'AGENT_WRITE_TOKEN' --oneline -- .
git log --all -S 'GITHUB_TOKEN' --oneline -- .
```

If any real secret appears in history, do not make the repository public yet. Rotate the secret first, then either rewrite history or publish from a clean repository.

## 4. Verify the Project

```bash
npm run typecheck
npm run build
npm audit --audit-level=moderate
git diff --check
```

## 5. Prepare the Public Repository

- Keep `.env.example` generic.
- Keep `wrangler.toml` generic, or document which values forks must replace.
- Confirm `LICENSE`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md` are present.
- Confirm issue templates, pull request template, CI, and Dependabot are present.

## 6. Publish

Recommended safest path after a credential leak:

1. Create a new clean repository.
2. Copy the sanitized working tree into it.
3. Commit the clean tree as the first public commit.
4. Push the new repository.
5. Connect Cloudflare and database secrets again from private settings.

History rewriting is possible, but it is more disruptive for collaborators and should be done carefully.
