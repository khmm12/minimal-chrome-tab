---
name: solidjs-v2-reviewer
description: Review SolidJS 2.0 code for React-isms, Solid 1.x-isms, and reactivity bugs. Use when reviewing diffs, PRs, or files in a project that depends on solid-js 2.x / @solidjs/web — including self-review after generating Solid 2.0 code.
---

# Review Solid 2.0 code

Hunt the two prior-knowledge bug classes — **React reflexes** and **Solid 1.x
reflexes** — plus 2.0-specific reactivity mistakes. Severity guide:
🔴 broken behavior, 🟡 dev-mode diagnostic / lost reactivity, 🔵 style drift.

Confirm the project is actually v2 first (`solid-js` major 2 in package.json /
`@solidjs/web` in deps). Reviewing a 1.x project against this list produces
garbage findings.

## Pass 1 — greppable smells

Run these over the changed files; each hit needs a fix or a justification.

### Solid 1.x-isms

| Grep | Verdict | Fix |
|---|---|---|
| `from ['"]solid-js/(web\|store\|h\|html\|universal)` | 🔴 module not found | `@solidjs/web`, store APIs from `solid-js`, `@solidjs/h`… |
| `createResource\|useTransition\|startTransition` | 🔴 removed | async memo + `<Loading>`; built-in transitions / `isPending` |
| `\bbatch\s*\(` | 🔴 removed | delete wrapper; `flush()` only for sync read-after-write |
| `createComputed\|createMutable\|modifyMutable\|createDeferred` | 🔴 removed | memo / split effect / `createSignal(fn)`; `createStore` drafts |
| `\bon\s*\(` as effect dep helper, `onMount\|onError\|catchError` | 🔴 removed | split effect compute; `onSettled`; `<Errored>` / effect `error` |
| `<Suspense\|<SuspenseList\|<ErrorBoundary\|<Index\b` | 🔴 removed | `<Loading>` / `<Reveal>` / `<Errored>` / `<For keyed={false}>` |
| `mergeProps\|splitProps\|unwrap\s*\(\|createSelector` | 🔴 removed | `merge` / `omit` / `snapshot` / `createProjection` |
| `\.Provider\b` | 🔴 removed | `<Ctx value={...}>` — context is the provider |
| `classList=` | 🔴 removed | `class={{...}}` / `class={[...]}` |
| `use:[a-zA-Z]\|attr:\|bool:\|on:[a-z]\|oncapture:` in JSX | 🔴 removed | ref factories; standard attributes; `onClick` + ref for native opts |
| `produce\s*\(` in setters | 🟡 redundant | drafts are the default |
| `setStore\s*\(\s*["']` (path-style first arg) | 🔴 wrong API | draft setter or `storePath(...)` |
| `/\*@once\*/` | 🟡 ignored marker | reactive read / `defaultValue` / `untrack` |
| `\.loading\b\|\.error\b` on async values | 🔴 no such props | `isPending(() => x())` / `<Errored>` |

### React-isms

| Grep / pattern | Verdict | Fix |
|---|---|---|
| `function \w+\(\s*\{` (destructured props) | 🟡 reactivity dead + warns | `props.x` access |
| `useState\|useEffect\|useMemo\|useRef\|useCallback` | 🔴 wrong framework | Solid primitives |
| `<X value={count} />` passing an accessor where a value is expected | 🔴 child gets a function | `value={count()}` — collapse at the JSX boundary |
| `key=` prop on list items | 🟡 no-op | `<For keyed={...}>` modes |
| `` className\|`${...}` ``/`.join(" ")` class building | 🔵 reflex | `class` array/object form |
| deps-array thinking: effect re-created per "render" | 🟡 model error | components run once; compute phase = deps |

### 2.0-specific

| Pattern | Verdict | Fix |
|---|---|---|
| Single-callback `createEffect(fn)` | 🔴 throws | split `(compute, apply)` |
| `createEffect(fn, 0)` / `createMemo(fn, 0)` initial values | 🔴 wrong arg | options object; `prev` default parameter |
| Setter then immediate read of same signal/DOM | 🔴 stale read | `flush()` or restructure |
| Signal/store write inside memo/compute/component body | 🔴 throws in dev | derive, or move write to handler/action |
| `ownedWrite: true` on app state | 🟡 escape-hatch abuse | derive instead; ownedWrite is for internal flags |
| Top-level `const x = props.x` / store read in component body | 🟡 warns, stale | read in JSX/memo; `untrack` if deliberate |
| `onCleanup` inside `onSettled`/`createTrackedEffect` | 🔴 throws | return cleanup |
| Primitives created inside `onSettled`/tracked effect | 🔴 throws | create in component body |
| Store proxy passed compute→apply, read in apply | 🟡 warns, won't re-run | extract plain values / `deep(store)` in compute |
| Async read with no `<Loading>` ancestor | 🟡 root mount deferred | add boundary where fallback UI is wanted |
| `async function*` memo over a socket/emitter/observable with no up-front `onCleanup` | 🔴 leaks on dispose/re-run | `onCleanup` (before the first `await`/`yield`) that cancels the source; `try/finally`/`.return()` can't unwind a parked generator |
| `refresh()` called inside a computation | 🔴 throws | call from handlers/actions |
| `isRefreshing(` call (or imported from `solid-js`) | 🔴 removed in beta.15 | gone from `solid-js` exports; detect a refresh re-run by key comparison, or use `isPending`/`<Loading>` |
| `<For>` callback shape vs keying mode mismatch (`item()` on keyed, `i()` on `keyed={false}`) | 🔴 type/runtime error | check the mode table |
| Dynamic boolean `keyed={cond()}` with function children | 🟡 ambiguous shape | literal mode or key function |
| `useX`-with-throw context wrapper hooks | 🔵 dead boilerplate | direct `useContext` (throws by itself) |
| camelCase DOM attributes (`tabIndex`, `readOnly`) | 🟡 wrong attribute | lowercase; handlers stay camelCase |
| `merge(..., maybeUndefined)` assuming skip semantics | 🔴 silently overrides | filter keys or restructure defaults |

## Pass 2 — judgement checks (not greppable)

- **Derive vs write-back**: any effect whose apply phase sets reactive state is
  suspect — usually a memo/projection in disguise.
- **Boundary ownership**: `isPending` reads placed under the `Loading` boundary
  that owns the data read? Pending indicators outside can never fire.
- **Mutation shape**: server writes wrapped in `action()` with optimistic
  state and a final `refresh()`? Ad-hoc async handlers flipping flags are the
  1.x smell in new clothes.
- **Granularity**: selection/derived caches notifying whole collections →
  `createProjection`. Fixed-slot lists diffed with `<For>` → `<Repeat>`.
- **Ownership**: module-scope effects/roots intentional? Detached lifetime must
  be explicit (`runWithOwner(null, ...)`).
- **Composable naming**: a `createX`/`useX` prefix should match lifecycle, not
  React habit — `createX` makes a fresh instance owned by the caller, `useX` is a
  shared singleton or accesses an already-created thing (`useContext`). `useX` is
  not wrong by itself (singletons are legit); flag only a per-call instance named
  `useX`, or every composable defaulting to `useX` out of reflex.
- **Layout lane**: DOM-geometry reads (`getBoundingClientRect`/`offset*`) belong
  in a `createRenderEffect` (render lane), not in a `ref` callback (node may be
  pre-insert/pre-layout there). Beware the inverse "fix" too: moving a layout
  measure out of `createRenderEffect` into `createEffect`/a ref on the false
  theory that render effects read a disconnected node — they don't; the trigger
  is flush-scheduled and runs after insertion.
- **Tests**: `flush()` after writes; `createRoot` wrappers; `resolve()` for
  async settling.

## Reporting

Report findings ordered by severity with `file:line`, the broken expectation
(one line), and the concrete 2.0 fix. Note clean areas that were checked.
For deep API verification during review, the `solidjs-v2` skill's references
cover signatures; installed typings in `node_modules` are final word — the
betas churn the public API freely (e.g. `isRefreshing` was a public `solid-js`
export from beta.0 through beta.14, *then* removed in beta.15).
