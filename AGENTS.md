# AGENTS.md

## Project Structure & Module Organization
- `src/` holds the SolidJS + TypeScript app code; entry points are `src/index.tsx` and `src/index.css`.
- UI and logic are grouped by concern: `src/components/`, `src/hooks/`, `src/utils/`, and `src/shared/`.
- Chrome extension metadata lives in `src/manifest.json`, with localized strings in `src/_locales/`.
- `public/` contains static assets copied during builds.
- `test-support/` provides shared test setup and helpers.
- `styled-system/` is Panda CSS generated output; avoid manual edits.
- `dist/` (build output) and `coverage/` (test coverage) are generated artifacts.

## Build, Test, and Development Commands
- `pnpm i` installs dependencies.
- `pnpm dev` starts the Vite dev server for local iteration.
- `pnpm build` creates the extension bundle in `dist/`.
- `pnpm lint` runs ESLint checks.
- `pnpm typecheck` (or `pnpm typecheck:app` / `pnpm typecheck:node`) runs TypeScript checks.
- `pnpm test:unit` runs Vitest once; `pnpm test` aggregates lint, typecheck, and unit tests.
- When upgrading packages, run `pnpm dedupe` after `pnpm up -L`.

## Coding Style & Naming Conventions
- Use TypeScript with ESM modules and SolidJS patterns.
- Components use PascalCase (e.g., `src/components/Time/Time.tsx`); hooks follow `useX` or `createX` naming.
- Imports use aliases: `@/` for `src/`, `@test` for `test-support/`, and `styled-system` for generated styles.
- Prefer default exports for primary modules (component `index.tsx`, core hooks), and named exports for related constants/types.
- Panda CSS config is in `panda.config.ts`.
- Keep changes small and boring.
- Follow KISS (Keep it simple, stupid) and YAGNI (You aren't gonna need it).

## Testing Guidelines
- Tests run with Vitest + Happy DOM and Testing Library; setup is in `test-support/setup.ts`.
- Co-locate tests as `*.test.ts` / `*.test.tsx`; snapshots live under `__snapshots__/`.
- Coverage is configured for `src/` in `vite.config.ts`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits.
- PRs should be focused and include a clear description, tests run, and screenshots for UI changes.
