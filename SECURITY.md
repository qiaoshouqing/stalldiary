# Security Policy

## Supported Versions

The `main` branch receives security fixes.

## Reporting a Vulnerability

Please do not open a public issue for credential leaks, authentication bypasses, or data exposure bugs.

Use GitHub's private vulnerability reporting feature when available. If that is not available, open a minimal issue asking for a private security contact without disclosing technical details.

## Secrets

Do not commit:

- `.env`, `.env.local`, `.dev.vars`, or `.dev.vars.*`
- PostgreSQL connection strings
- `AGENT_WRITE_TOKEN`
- `GITHUB_TOKEN`
- Cloudflare API tokens
- Database dumps containing user data

If a secret was ever committed to a branch that may become public:

1. Revoke and rotate the secret first.
2. Remove it from the repository history before publishing.
3. Recreate affected databases or tokens if the exposure scope is unclear.

Changing only the latest commit is not enough if the secret remains in git history.

## Deployment Notes

- Use separate development and production databases.
- Keep the AI / automation write endpoint protected with `AGENT_WRITE_TOKEN`.
- Treat `dryRun` responses as non-sensitive previews, not proof of authentication.
- Review Cloudflare Worker logs before sharing them publicly.
