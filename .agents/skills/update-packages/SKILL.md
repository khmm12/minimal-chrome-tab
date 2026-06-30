---
name: update-packages
description: Update this project's npm packages (pnpm). Use when the user asks to update, upgrade, or bump dependencies — covers the mandatory up/dedupe/verify order, which majors to hold back, and keeping the Solid packages in lockstep.
---

# Updating packages

pnpm project. Naive `pnpm up -L` overreaches on majors and skips transitive
deps — follow this order.

1. **Survey:** `pnpm outdated`. Sort candidates into in-range minor/patch and
   deliberate majors.

2. **In-range updates:** `pnpm up`. Mandatory — it's the step that refreshes
   indirect (transitive) dependencies, not just the direct ones.

3. **Majors — vet each, some are pinned by design.** Confirm with
   `npm view <pkg>@<ver> peerDependencies engines`, then `pnpm up -L <pkg>`.
   Standing constraints:
   - **`eslint`** is capped by `eslint-config-love`'s peer range — bump the
     config first, and take eslint only as far as that peer allows.
   - **`@types/node`** stays on the **lowest supported node major** to match
     `engines` and the `@tsconfig/node*` base.

4. **Solid packages move in lockstep.** When bumping one, bump the whole set
   together: `solid-js`, `@solidjs/web`, `vite-plugin-solid`. A version skew
   across them breaks the build. Expect occasional breaking API changes; let `typecheck`
   catch the fallout and fix via the `solidjs-v2` / `solidjs-v2-reviewer`
   skills.

5. **Dedupe:** `pnpm dedupe`. Mandatory.

6. **Verify — run it, don't assume.** `pnpm test` (lint + typecheck:app +
   typecheck:node + unit), then `pnpm build`. If a `prettier` bump drifts
   formatting, `pnpm exec eslint . --fix` and re-run `pnpm test`.
