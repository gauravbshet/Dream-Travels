# Project Rules

These rules govern how Claude (and any other AI assistant) works in this repository. They are durable — they apply to every session, not just the one that wrote them. Do not rely on conversational memory for any of this; if it isn't here, treat it as unconfirmed.

## Repository scope

- **This repository — `github.com/gauravbshet/Dream-Travels` — is the only DreamTravels codebase in active development.** It is the permanent production codebase.
- There is an older, unrelated repository (`akankshjk5/dreamtravels`) from a previous phase of this project. It is retired. Never reference it, compare against it, merge from it, or restore anything from it unless the project owner explicitly asks in a given session.

## Environment & credentials

- Required/optional environment variables are documented in `.env.example` at the repo root. Copy it to `.env.local` for local development.
- `.env.local` is gitignored and must never be committed. Never hardcode credentials (Supabase keys, service role keys, etc.) anywhere in source.
- Never ask the project owner to paste real credentials into a chat session. If `.env.local` is missing, say so and wait — don't request the values directly.

## Git workflow (every task)

Direct pushes to `main` are not allowed. For every task:

1. Pull the latest `origin/main`.
2. Create or update a feature branch for the task (e.g. `feat/…`, `fix/…`, `docs/…`).
3. Implement the changes.
4. Run, in order: `npm install` (if dependencies changed), `npm run build`, `npm run lint`.
5. Verify the application actually works (not just that the build/lint pass) — run the dev server and check the affected pages/flows.
6. Fix any regressions before proceeding.
7. Commit with a meaningful message.
8. Push the feature branch to `origin`.
9. **Merge into `main` only after the project owner has reviewed and approved it.** Do not merge unilaterally.

## General collaboration rules

- Don't start feature development, redesign, or refactor work without an explicit go-ahead for that specific task.
- Don't fabricate data, statistics, testimonials, or copy — use real data from Supabase or an honest empty state.
- Flag anything that can't be verified from the codebase rather than assuming.
