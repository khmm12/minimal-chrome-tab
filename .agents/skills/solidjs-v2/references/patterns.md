# Patterns: composing Solid 2.0 primitives

Field-tested compositions on top of the core APIs. Each pattern names the
primitives it leans on; signatures are covered in the sibling reference files.

## Streaming query memo (SWR: cache first, then network)

An async **generator** memo can commit multiple values over time — each `yield`
is a new committed state. That turns one `createMemo` into a full
stale-while-revalidate query: emit the cached value fast, then the network
value, carrying rich state (source, refresh status) alongside the data.

```ts
import { createMemo, isPending, onCleanup, refresh } from "solid-js";

type QueryState<K, T> = {
  key: K;                                 // carried so a refresh re-run is detectable without isRefreshing
  source: "cache" | "network";
  value: T;
  refresh: { status: "ok" } | { status: "refreshing" } | { status: "failed"; error: unknown };
};

function createCachedQuery<K, T>(options: {
  source: () => K;
  fetcher: (key: K, ctx: { signal: AbortSignal }) => Promise<T>;
  cache: { get(k: K): Promise<T | undefined>; set(k: K, v: T): Promise<void> };
  equals?: (a: K, b: K) => boolean;       // ⚠ default is identity — see note below for composite keys
}) {
  const sameKey = options.equals ?? Object.is;
  const state = createMemo<QueryState<K, T>>(async function* (prev) {
    const key = options.source();         // tracked: re-runs on key change
    const isRefresh = prev !== undefined && sameKey(prev.key, key); // same key ⇒ refresh(); changed ⇒ fresh run

    const abort = new AbortController();
    onCleanup(() => abort.abort());       // cancel in-flight work when superseded/disposed

    yield* streamQuery({ key, previous: isRefresh ? prev : undefined, signal: abort.signal, ...options });
  });

  // Derived projections of the state — lazy: only computed if something reads them
  const data = createMemo(() => state().value, { lazy: true });
  const pending = createMemo(
    () => {
      try { return isPending(state) || state().refresh.status === "refreshing"; }
      catch { return false; }             // tolerate not-ready on first read
    },
    { lazy: true },
  );

  // Facade: getters keep reads lazy and the surface ergonomic (query.data, no parens)
  return {
    get data() { return data(); },
    get pending() { return pending(); },
    get error() {                          // surface a failed refresh — pending stays false on failure
      try { const r = state().refresh; return r.status === "failed" ? r.error : undefined; }
      catch { return undefined; }
    },
    refresh() { refresh(state); },
  };
}

async function* streamQuery({ key, previous, signal, fetcher, cache }) {
  const network = fetcher(key, { signal }).then(async value => {
    await cache.set(key, value);
    return value;
  });
  if (previous) {                          // refresh path: keep showing prev, swap when network lands
    try { yield { key, source: "network", value: await network, refresh: { status: "ok" } }; }
    catch (error) { yield { ...previous, key, refresh: { status: "failed", error } }; }
    return;
  }
  const cached = await cache.get(key);     // initial path: cache fast, network when ready
  if (cached !== undefined) yield { key, source: "cache", value: cached, refresh: { status: "refreshing" } };
  yield { key, source: "network", value: await network, refresh: { status: "ok" } };
}
```

The techniques, individually reusable:

- **`async function*` memo** — multi-step async state machines in one
  computation; every `yield` commits.
- **Key-carried refresh detection** — distinguishes a `refresh(state)` re-run
  (keep previous value, background-revalidate) from a dependency-change re-run
  (start over). `prev` carries the previous committed state — including its
  `key` — so an unchanged key ⇒ refresh re-run, a changed key ⇒ fresh run.
  ⚠ **Comparison is identity by default** (`Object.is`): fine for primitive
  keys, but a composite key (`() => ({ userId, page })`) is a fresh object each
  run, so every `refresh()` would misread as a fresh run and skip the SWR path.
  Pass an `equals` (structural, or compare a serialized key) for composite keys.
  ⚠ This replaces `isRefreshing()`, which was **removed in beta.15** (no public
  replacement; upstream guidance: model refresh intent with actions/optimistic
  state, observe readiness via `<Loading>`/`isPending`).
- **`onCleanup` + `AbortController` in compute** — superseded runs cancel their
  fetch. This is the legitimate computation-scoped use of `onCleanup` (register it
  before the first `await`/`yield`; see `async-and-actions.md` →
  *Cancellation & cleanup* for why `try/finally` can't replace it).
- **Lazy derived memos** (`{ lazy: true }`) — projections of a rich state object
  that cost nothing unless read, with `equals` to cut downstream noise.
- **Tolerant flags** — wrap `isPending(state)`-style reads in `try/catch` when
  the flag must be readable before the source has ever resolved.
- **Facade with getters** — `query.data` reads stay reactive (property access
  invokes the memo) while the object itself is inert and destructure-safe at
  the *binding* level (`const q = createCachedQuery(...)`; never destructure
  `q.data` itself at top level — that's still a tracked read).

## Optimistic mutation workflow

The canonical mutation shape — optimistic write, server work, reconcile:

```ts
const [todos, setOptimisticTodos] = createOptimisticStore(() => api.getTodos(), [], { key: "id" });

const addTodo = action(function* (todo) {
  setOptimisticTodos(s => { s.push(todo); });   // visible immediately
  yield api.addTodo(todo);                      // transition-coordinated
  refresh(todos);                               // reconcile with source of truth
});
// Optimistic writes revert when the transition completes — by then refresh
// has installed the real data, keyed reconciliation preserves row identity.
```

UI flags: `isPending` covers both revalidation and explicit `refresh()` calls
(`isRefreshing` was removed in beta.15) — never repurpose `refresh()` itself as
a flag.

## Selection projection (don't notify every row)

`createProjection` mutates only the keys that change — a selection flip touches
two rows, not N:

```ts
const [selectedId, setSelectedId] = createSignal<string>();
const selected = createProjection(s => {
  const id = selectedId();
  if (s._prev != null) delete s[s._prev];
  if (id != null) s[id] = true;
  s._prev = id;
}, {} as Record<string, boolean | string>);

// Row reads selected[props.id] — granular subscription
```

## Local state seeded from a prop (writable derived signal)

```ts
const [value, setValue] = createSignal(() => props.initial);
```

Re-derives when `props.initial` changes; `setValue` overrides locally until the
next derivation. Replaces the 1.x `createSignal` + `createComputed` write-back
dance — and dodges the `Exclude<T, Function>` generic trap (see
`typescript-setup.md`).

## Demand-driven external resource

`lazy` (autodispose when unobserved) + `unobserved` + `onCleanup` make
computations that hold external resources only while someone is listening:

```ts
const price = createMemo(
  () => {
    const ws = new WebSocket(`${url()}/prices`);
    onCleanup(() => ws.close());
    return new Promise(resolve => { ws.onmessage = e => resolve(JSON.parse(e.data)); });
  },
  { lazy: true, unobserved: () => log("price feed torn down") }
);
// No subscribers → socket closed; next read → fresh socket.
```

This resolves **once** (the first message). To stream **every** message, use an
async generator — next.

## Streaming a socket through an async-generator memo

Bridge the socket's push events into an async iterable and `yield*` it. The whole
discipline is the cleanup, and it has a footgun: a `try/finally` inside the generator
is **not** enough. On dispose Solid **does** call `.return()` on the iterator — but a
generator parked on an *external* `await` (the next socket message) won't unwind from
it: `.return()` queues behind that `await`, and if the socket has gone quiet the
`await` never settles, so `finally` never runs and the socket leaks. The reliable hook
is an up-front `onCleanup` that **actively cancels** the source — which frees it *and*
unblocks the parked `await` so the generator can unwind. (Full treatment, plus the
plain-async tier: `async-and-actions.md` → *Cancellation & cleanup*.)

```ts
function createSocketStream<T>(url: () => string) {
  return createMemo(async function* () {
    const ws = new WebSocket(url());
    const { iterable, cancel } = subscribeToAsyncIterable<T>((emit) => {
      const onMessage = (e: MessageEvent) => emit(JSON.parse(e.data) as T);
      ws.addEventListener("message", onMessage);
      return () => ws.removeEventListener("message", onMessage);
    });
    // Sync, before the first await: cancel() ends the stream and unblocks the parked
    // await so the generator unwinds; ws.close() releases the socket.
    onCleanup(() => { cancel(); ws.close(); });
    yield* iterable; // each message commits a new value; never returns on its own
  });
}
// Add { lazy: true, unobserved } to make it demand-driven like the one-shot above.
```

The callback→async-iterable bridge — reusable; subscribes eagerly and **buffers**, so
a message landing between pulls (or before the first read) isn't lost. That buffering
is an orthogonal init-race concern, separate from the cleanup rule:

```ts
type Unsubscribe = () => void;

function subscribeToAsyncIterable<T>(
  subscribe: (emit: (value: T) => void) => Unsubscribe,
): { iterable: AsyncIterable<T>; cancel: Unsubscribe } {
  const buffer: T[] = [];
  let waiter: PromiseWithResolvers<void> | null = null;
  let done = false;
  const wake = () => { const w = waiter; if (w) { waiter = null; w.resolve(); } };

  const unsubscribe = subscribe((value) => { if (!done) { buffer.push(value); wake(); } });
  const cancel: Unsubscribe = () => { if (!done) { done = true; unsubscribe(); wake(); } };

  const iterable: AsyncIterable<T> = {
    async *[Symbol.asyncIterator]() {
      while (true) {
        for (const value of buffer.splice(0)) yield value;
        if (done) return;            // cancel() drains the buffer, then ends the loop
        waiter ??= Promise.withResolvers<void>();
        await waiter.promise;        // parks here until the next emit or cancel
      }
    },
  };
  return { iterable, cancel };
}
```

Why a generator, not the one-shot `Promise` above:

| | one-shot `Promise` memo | `async function*` memo |
|---|---|---|
| commits | the resolved value, once | every `yield`, over time |
| `return` | — | ends the stream, value **discarded** |
| cleanup | `onCleanup` frees the resource | `onCleanup` must also **unblock** the parked `await` |

Read it under `<Loading>`: the first message resolves the boundary, later messages
stream in as stale-while-revalidating updates.

## Persistence effect over a whole store

`deep()` in the compute phase subscribes to every nested property and hands the
apply phase a plain snapshot:

```ts
createEffect(
  () => deep(settings),
  snap => localStorage.setItem("settings", JSON.stringify(snap))
);
```

## App-wide state: module scope, not Context

Context scopes state to a subtree. For genuinely global state, a module-scope
store is the global — no Provider ceremony:

```ts
// state/session.ts
export const [session, setSession] = createStore<Session>({ user: null });
```

If the module-scope graph needs computations with indefinite lifetime, detach
explicitly: `runWithOwner(null, () => { ... })` — that's the deliberate opt-in
to "lives forever". Keep Context for subtree-scoped dependency injection
(per-form state, per-widget services), using the default-less form that throws.

## Imperative DOM after a write

`flush()` is the bridge from queued reactive writes to synchronous DOM reads:

```ts
function handleSubmit() {
  setSubmitted(true);
  flush();              // DOM is now up to date
  inputRef.focus();
}
```

Scope it tightly (handlers, tests); sprinkling `flush()` to "fix" stale reads
usually means a read belongs in JSX or an effect instead.

## Known beta gotchas (observed at 2.0.0-beta.15)

- `Portal` from `@solidjs/web` was **rewritten in beta.15** (owner-parented
  insert via the new `host` option, no mount `Proxy`) — this resolves the
  beta.14 mount crash plus content accumulation on keyed swaps (#2757) and
  ownerless-effect (`NO_OWNER_EFFECT`) leaks (#2758). If you're pinned below
  beta.15 and a portal misbehaves, an imperative `document.body.appendChild`
  fallback works meanwhile.
- The published `solid-js` typings are the most reliable API surface — the
  betas churn the public API freely: `isRefreshing` was a public `solid-js`
  export from beta.0 through beta.14 (and written up in the RFC docs), then
  **removed in beta.15** — commit `52255dc` cut the code, typings, and docs
  together; `@solidjs/signals` still defines it internally. When docs and
  `node_modules` disagree, trust
  `node_modules`; before building on a beta-only API, check the repo's
  `.changeset/` directory for its scheduled fate.
- `refresh()` semantics are also tightening upstream: a pending changeset stops
  it cascading into upstream memos (only the explicit target / top-level reads
  of the refresh callback recompute).
