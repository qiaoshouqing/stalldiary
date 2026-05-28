# Contributing

Thanks for helping improve StallDiary.

## Development Setup

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
```

Run checks before opening a pull request:

```bash
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

## Pull Request Guidelines

- Keep changes focused and explain the user-facing behavior.
- Include screenshots for UI changes across desktop and mobile when possible.
- Do not commit generated `dist/`, local `.env*`, `.dev.vars*`, database dumps, or tokens.
- Update documentation when changing setup, environment variables, API payloads, or deployment behavior.
- Prefer small, reviewable changes over broad refactors.

## Code Style

- TypeScript first, with explicit shared types in `lib/types.ts` when data crosses the Worker and React boundary.
- Keep UI text in `src/i18n.ts` so the multilingual interface stays complete.
- Keep database changes idempotent in `scripts/migrate.mjs`.
- Avoid adding large dependencies unless they remove real complexity.

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser / runtime version
- Relevant logs without secrets
