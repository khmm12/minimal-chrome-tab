---
name: solidjs-v2
description: Write and edit SolidJS 2.0 code (solid-js 2.x / next / beta). Use when implementing components, reactivity, async data, stores, or DOM code in a project that depends on solid-js 2.x or @solidjs/web. Not for Solid 1.x projects and not for migrating 1.x code (see solidjs-v2-migration).
---

# SolidJS 2.0

Solid 2.0 is **not React** and **not Solid 1.x**. Both priors are the dominant
bug sources in generated code. When in doubt, distrust pattern-matching and
check `references/cheatsheet.md` (official, ships with the package) or the
installed typings in `node_modules`.

## Step 0 — confirm this is actually a v2 project

Check before applying anything below:

- `package.json`: `solid-js` major is `2` (e.g. `2.0.0-beta.x`), and/or
  `@solidjs/web` is a dependency.
- `tsconfig.json`: `"jsxImportSource": "@solidjs/web"`.

If `solid-js` is `1.x` (imports like `solid-js/web`, `solid-js/store`), **stop —
these rules do not apply**; that's a Solid 1.x project. If the task is to
convert it, use the `solidjs-v2-migration` skill instead.

Betas drift: when docs and the installed package disagree, trust the typings in
`node_modules` (`solid-js`, `@solidjs/web`, `@solidjs/signals`).

## The ten rules that prevent most bugs

1. **Reads lag writes.** Updates apply on the next microtask:
   `setCount(1); count()` still returns `0`. Synchronous point: `flush()`.
   `batch()` does not exist.
2. **`createEffect` takes two functions** — `(compute, apply, options?)`.
   Compute tracks and returns a value; apply does side effects (untracked) and
   may return a cleanup. The 1.x single-callback form throws. `on()`,
   `createComputed`, initial-value args: all gone.
3. **Never write signals/stores inside a reactive scope** (memo, compute,
   component body) — throws in dev. Write in event handlers, actions, or
   `onSettled`. Derive instead of writing back.
4. **No top-level reactive reads in component bodies** and no destructured
   props — warns, value goes stale. Read via `props.x` inside JSX / memos /
   effect computes; `untrack(() => ...)` for deliberate one-shots.
5. **Props are values, not accessors.** Call site: `<X v={count()} />`, never
   `<X v={count} />`. Child: `props.v`, never `function X({ v })`. This stays
   reactive — the compiler turns `v={count()}` into `{ get v() { return count() } }`,
   so reading `props.v` in the child re-runs `count()` in the child's tracking
   scope. Passing the accessor (`v={count}` + `props.v()`) to "keep reactivity" is
   a misconception: props have **always** been getters in Solid (1.x and 2.0
   alike — value-passing didn't change), so it's unnecessary and just forces
   every consumer to call a function.
6. **Async is just a computation**: `const user = createMemo(() => fetchUser(id()))`
   — no `createResource`. Wrap consumers in `<Loading fallback={...}>`;
   errors go to `<Errored>`. Revalidation indicators: `isPending(() => user())`.
7. **Store setters take a draft**: `setStore(s => { s.a.b = 1; })` (produce is
   the default). Store APIs (`createStore`, `reconcile`, `snapshot`…) are
   exported from `solid-js` — `solid-js/store` does not exist.
8. **List rendering is `For` with keying modes** — `<Index>` is gone. Callback
   shapes differ per mode (see references); `keyed={false}` gives
   `(itemAccessor, plainIndex)`. Fixed-count rendering: `<Repeat>`.
9. **Lifecycle**: `onSettled(() => { ...; return cleanup; })` replaces
   `onMount`/`onCleanup` for component-level setup-and-teardown. It's a leaf
   owner — no primitives or `onCleanup` inside.
10. **Imports moved**: `@solidjs/web` for `render`/`hydrate`/`Portal`/`Dynamic`
    (not `solid-js/web`); `jsxImportSource: "@solidjs/web"`; DOM attributes are
    lowercase (`tabindex`); `class` takes object/array forms (`classList` is
    gone); directives are `ref={factory(opts)}` (`use:` is gone).

## Reference routing

Read the file matching the task before writing code in that area:

| Task touches | Read |
|---|---|
| Quick API lookup, import list, full 1.x→2.0 footgun list | `references/cheatsheet.md` (official) |
| Signals, memos, effects, batching/flush, lifecycle, ownership, dev diagnostics | `references/reactivity.md` |
| Data fetching, Loading/Errored, isPending/latest/resolve/refresh, action(), optimistic UI | `references/async-and-actions.md` |
| createStore, reconcile, projections, snapshot/deep, merge/omit, storePath | `references/stores.md` |
| For/Repeat/Show/Switch/Reveal, dynamic components, class/attributes/events/refs/directives, render/SSR entries | `references/control-flow-and-dom.md` |
| tsconfig, JSX types, import paths, Context typing, test setup | `references/typescript-setup.md` |
| Composed patterns: SWR query, optimistic mutations, selection projections, global state, demand-driven resources | `references/patterns.md` |
| Naming a primitive/composable (`create*` vs `use*`), cross-cutting conventions | `references/conventions.md` |

## Failure modes

- **App renders nothing / mount seems stuck** → pending async outside a
  `Loading` boundary defers the root mount; check the console for
  `ASYNC_OUTSIDE_LOADING_BOUNDARY`.
- **Dev throws/warns with a diagnostic code** (`REACTIVE_WRITE_IN_OWNED_SCOPE`,
  `STRICT_READ_UNTRACKED`, …) → table of codes and fixes at the bottom of
  `references/reactivity.md`. Fix the cause; never silence with `ownedWrite`
  for app state.
- **Test asserts stale values** → missing `flush()` after writes, or reactive
  code created without an owner (`createRoot` in tests).
- **An API from docs/examples doesn't exist** → betas drift; verify against
  installed typings and prefer them over any doc, including these references.
