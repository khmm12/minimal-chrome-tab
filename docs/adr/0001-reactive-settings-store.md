# ADR 0001 — Reactive settings store over a stateless storage seam

- Status: Accepted
- Date: 2026-06-30
- Deciders: Maxim

## Context

Settings persistence was built as a layered tower around a single stored object
(`Settings`):

- `utils/storage/storage.ts` — a generic `Storage<T>` class holding `currentValue`,
  a `StorageSubscription`, an injected `ISerializer`, and `read/write/refresh/value`.
- `utils/storage/subscription.ts` — a hand-rolled pub/sub, re-instantiated inside
  every adapter **and** inside `Storage`.
- `hooks/createStorage.ts` — a Solid hook mirroring `Storage` state into a signal.
- `hooks/createSettingsStorage.ts` — a one-line wrapper over the singleton.
- `shared/settings.ts` — schema, defaults, and a top-level `await Storage.create(...)`.

Two architectural problems (from the architecture review, candidates A and B):

1. **Dual state / two update paths (A).** `Storage.currentValue` and the signal in
   `createStorage` held the same value. On `set()` the value flowed both through
   `storage.subscribe → setValue` *and* a direct `setValue` — one state synced two
   ways. This was the only place in the codebase where state was kept in two
   sources of truth.
2. **N signals over one singleton (B).** `createSettingsStorage()` was called
   independently in `boot/apply-theme.ts` and `components/Application` — each wrapping
   the same `SettingsStorage` singleton in its own signal, converging only via an
   async subscription. Timing-dependent theme/settings bugs lived here.

Plus incidental leaks: `Serializer.serialize` was a no-op identity for settings;
the top-level await forced a circular-chunk workaround (`storage.ts:5-7`); and a
test lifecycle (`afterEach`) was wired into the production `Storage` constructor
(`storage.ts:26-30`).

The project runs **SolidJS 2.0** (`solid-js@2.0.0-beta.15`, `@solidjs/web`). Async
is a computation: a not-ready read suspends to the nearest `<Loading>` boundary,
and async without a boundary at `render()` defers the root mount.

## Decision

Collapse the layers **above** the adapters into a reactive settings store, and
keep the adapter seam — it is real (chrome / localStorage / memory parity for
prod / dev / test).

**Layer 1 — `storage` (generic, async, framework-agnostic, stateless):**

- Interface: `read(): Promise<T>`, `write(value: T): Promise<void>`,
  `subscribe((value: T) => void): Unsubscribe`.
- Notifies on **all** changes uniformly (own write **and** external), with adapters
  reaching the contract however their backend works: chrome via `onChanged` (which
  echoes own writes in the same tab); localStorage via own-notify in `write` plus the
  `'storage'` event for other tabs; memory via own-notify.
- Keeps `Serializer` **inside**: `deserialize` carries validation (`JsonValue → T`,
  valibot fallback — not a no-op) so a typed generic `read(): T` is honest;
  `serialize` (`T → JsonValue`) is the extension point. Removing the serializer would
  collapse `Storage<T>` into `Storage<unknown>` and kill the generic.
- Wire type is `JsonValue` (type-fest), not `unknown` — storage is JSON-compatible.
  This also makes the type catch a latent bug: `serialize` can no longer be a bare
  identity, because `Settings.birthDate?: ISODate | undefined` carries `undefined`,
  which is not a `JsonValue`. Resolve by dropping the `undefined` key in `serialize`
  or making `birthDate` purely optional (`?: ISODate`). Previously `undefined` was
  silently written.
- **No** `currentValue`, **no** synchronous `.value`, **no** `afterEach`, **no**
  top-level await, **no** circular-chunk workaround. The source of truth for a
  value is the backend; storage is a typed conduit.
- **Adapter loads lazily inside storage**, not at module level. Storage is built with
  an adapter *loader* (`() => Promise<StorageAdapter>`), not a ready adapter. On the
  first `read`/`subscribe` it `await`s the dynamic `import()` (chrome / localStorage /
  memory by availability), caches the instance, and uses it synchronously after. This
  is what removes the top-level await — the load happens inside the first
  `storage.read()`, already under the async memo. Tests inject a ready memory adapter
  directly (sync, no loader). `subscribe` returns `Unsubscribe` synchronously while the
  adapter loads async; the real subscription attaches after load and `Unsubscribe`
  cancels a not-yet-ready one via a flag (hidden in the `subscribe → AsyncIterable`
  bridge).

**Interface surface (Layer 1).** The eight split interfaces in `types.ts`
(`IStorage` / `IWritableStorage` / `IMemorableStorage` / `ISubscribableStorage` /
`IDisposableStorage` / `ISubscribable` / `IStorageAdapter` / `ISerializer`) collapse
to four declarations — two types and three contracts:

- `Subscriber<T>`, `Unsubscribe` — types.
- `StorageAdapter` — `read(): Promisable<JsonValue>`, `write(JsonValue): Promisable<void>`,
  `subscribe(Subscriber<JsonValue>): Unsubscribe`, `dispose?(): void`.
- `Serializer<T>` — `deserialize(JsonValue): T`, `serialize(T): JsonValue`.
- `Storage<T>` — `read(): Promise<T>`, `write(T): Promise<void>`,
  `subscribe(Subscriber<T>): Unsubscribe`, `dispose(): void`.

Rationale: `IMemorableStorage` (`value`/`refresh`) is deleted (stateless); the
capability segregation (`IStorage = IWritable & IMemorable & ...`) was shallow — one
consumer, one implementation, no ISP need; the `unsubscribe(subscriber)` method is
dropped from the contract (`subscribe → Unsubscribe` suffices; the pub/sub helper may
keep it internally); `ISubscribable<T>` is inlined (two sites, rule of three); the
`I`-prefix is local to this module, not a project convention, so it is dropped.
`dispose` is required on `Storage` (delegates to `adapter.dispose`, needed for
listener teardown in tests/HMR) and optional on `StorageAdapter`. `Storage<T>` shadows
the DOM-global `Storage` type, but the module never uses that type — no real clash.

**Layer 2 — `createSettings(storage)` (reactive, owned, `createX`):**

- An async-iterator memo is the single reactive source of truth for the UI:
  `createMemo(async function* () { yield await storage.read(); yield* /* bridge over storage.subscribe */ })`.
  Initial load suspends under `<Loading>`; own and external changes arrive through
  the same stream.
- `setSettings → storage.write`; the new value returns via the stream (own-write
  echo). No `createOptimistic`, no `refresh` — there is one path.
- Creates **no** `createRoot` of its own — it inherits the consumer's owner.

**Layer 3 — `useSettings()` (singleton):**

- A detached app-singleton via `runWithOwner(null, () => createRoot(...))`.
  **Not** a bare `createRoot`: in Solid 2.0 a `createRoot` created inside an owned
  scope is owned by that parent and disposed with it (1.x roots were detached), so a
  bare root would die with whichever consumer touched it first. `runWithOwner(null,
  ...)` is the documented form for module singletons (what `@solid-primitives/rootless`
  `createSingletonRoot` wraps — that package is not a dependency, so we do it by hand).
- The single access point. Consumers read it **directly, in the tree, under
  `<Loading>`**.

**Consumption:**

- `apply-theme.ts` as a boot side-effect is **removed**. Theme application becomes an
  effect inside the component tree reading `useSettings()`; favicon-refresh and HMR
  disposal move there.
- `TimeMilestones` reads `useSettings()` directly — settings props-drilling from
  `Application` is removed.
- **`<Loading>` is local, around the settings-dependent subtree (milestones).**
  Two read paths behave differently. The theme reads settings in a `createEffect`
  (user lane, after render) — a not-ready read there is not "at render time", the
  effect just re-runs once settings resolve; no defer, no boundary needed.
  `TimeMilestones`, however, reads settings in render (`progressStyle → variant` in
  JSX; `birthDate → createTimeMilestones` memo → milestone value in JSX). A not-ready
  read there propagates into the render scope: **without** a boundary Solid defers the
  **whole** root mount (incl. `Time`/clock, which doesn't depend on settings) and warns
  `ASYNC_OUTSIDE_LOADING_BOUNDARY`. So wrap **only the milestones subtree** in
  `<Loading>` — `Time`/`Footer` render immediately, the console stays clean, and the
  granularity is correct. The theme stays outside the boundary (best-effort flash,
  accepted).

## Consequences

- One source of truth (the stream); dual state and the duplicate update path are gone.
- Card B dissolves: one shared singleton instead of N signals.
- The generic storage seam and the deliberate mechanics/reactivity split are kept,
  without the class tower, the hand-rolled `StorageSubscription` duplication, the
  five split interfaces, or the mirror hook.
- Testability is the interface: storage tests run on the memory adapter as plain
  async, no Solid; `createSettings(memoryStore)` tests run under `createRoot` + `flush`
  + `dispose`; `useSettings` gets one "shares a single instance" test. The test
  lifecycle leaves the production class.
- New, small, reusable infrastructure: a `subscribe → AsyncIterable` bridge.
  **Init-race note:** the bridge must subscribe *before* `read()` and buffer, or an
  own-write immediately after load can be lost in the gap.

## Theme FOUC — explicitly considered

The old top-level `await` was assumed to give a synchronous, no-flash theme. It does
not: TLA defers the dependent graph (incl. `render()`) until it resolves, but a
`type="module"` script is `defer` — the browser may paint a first frame (body at the
default `base: white` background; `data-theme` not yet set) **before** the TLA graph
runs `apply-theme`. So no-FOUC was always a **best-effort race**, not an invariant,
bounded by `chrome.storage.local` latency. Content never flashes regardless, because
`#app` is `opacity:0` until the mount fade — that is an independent trick.

Therefore the real constraint is **"do not regress below the current best-effort"**,
and async + `<Loading>` meets it (same latency bound, no TLA, no circular-chunk hack).
A strict no-FOUC guarantee is unreachable through async `chrome.storage` anyway — it
would need a synchronous inline `<script>` in `<head>` over sync storage.

## Alternatives rejected

- **Preload `await loadSettings()` in boot before `render()`** — buys no FOUC advantage
  over `<Loading>` once theme moved into the tree (identical race window), while keeping
  an explicit boot await. Dropped in favor of async-in-graph.
- **Lazy/hydratable hook** (default + async `setState`) — regresses theme FOUC: the
  effect waits for async, so the background flashes more often than today.
- **Validation outside storage** (storage returns `unknown`, settings layer validates)
  — collapses `Storage<T>` into `Storage<unknown>`; the generic loses meaning. Kept
  `ISerializer` inside instead.
- **signal + `createEffect` subscription** for `createSettings` — resurrects the
  dual-state we are removing. Async-iterator memo keeps one source of truth.
- **Bare `createRoot` for the singleton** — see Layer 3; would dispose with the first
  consumer under Solid 2.0 ownership rules.
