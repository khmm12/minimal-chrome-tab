# Domain glossary

Shared vocabulary for this project. Names here are load-bearing — use them in
code, comments, ADRs, and architecture reviews.

## Milestones

- **Milestone** — the fraction of a time epoch already elapsed, in `[0, 1)`, rounded
  down to a fixed precision. Pure calculation lives in
  `components/TimeMilestones/utils.ts`.
- **Epoch** — the period a milestone measures: day, week, month, year, or the
  user's personal birthday year.
- **Birthday milestone** — the milestone of the year-long epoch running from the
  user's most recent birthday to the next one. Special-cased: depends on `birthDate`.
- **Progress style** — how a milestone is rendered (compact bars / detailed bars /
  horizontal bar). Persisted as `MilestoneProgressStyle`; each style maps directly to
  its visual parameters via the `ProgressStyles` table in
  `components/TimeMilestones/components/Milestone`.

## Settings

- **Settings** — the persisted user preferences object: `birthDate`,
  `themeColorMode`, `milestoneProgressStyle`. Schema, defaults, and validation in
  `shared/settings.ts`.
- **Theme color mode** — `auto` (follow OS) / `light` / `dark`. Applied as a
  `data-theme` attribute on `<html>` before first paint (best-effort).

## Settings store (see ADR 0001)

- **Storage** — the generic, async, framework-agnostic mechanics layer:
  `read / write / subscribe` over a backend adapter. Stateless conduit; the backend
  is the source of truth. Validates `unknown → T` on the way in (the **serializer**
  seam), serializes `T → wire` on the way out.
- **Storage adapter** — a backend binding (chrome / localStorage / memory) chosen at
  runtime for prod / dev / test parity. A real seam, deliberately kept.
- **Settings stream** — the unified notification channel: storage emits **every**
  change through `subscribe`, both own writes and external changes (e.g. another
  tab), normalized across adapters. One path, no dual state.
- **Settings store** (`createSettings`) — the reactive layer: an async-iterator memo
  that yields the initial load then streams changes, as the single reactive source of
  truth for the UI. Owned by its consumer.
- **`useSettings`** — the shared detached app-singleton over `createSettings`
  (`runWithOwner(null, ...)`), the single access point consumers read in the tree.
