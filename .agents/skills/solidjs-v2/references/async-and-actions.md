# Async data, transitions, actions, optimistic UI

Verified against solid-js@2.0.0-beta.15 (published typings) and `next@a4ca10b` sources/tests.

## Async lives in computations — there is no `createResource`

Any computation may return a `Promise` or `AsyncIterable`. Consumers read the
accessor normally; a not-ready read signals through the reactive graph
(`NotReadyError`) and is caught by the nearest `<Loading>` boundary.

```jsx
const user = createMemo(() => fetchUser(params.id));

<Loading fallback={<Spinner />}>
  <Profile user={user()} />
</Loading>
```

- Loading state is **structural** (boundaries), not a `T | undefined` hole in
  every type.
- Async iterables stream: in `createMemo(async function* () { yield a; yield b; })`
  each `yield` commits a new value. Both async shapes own in-flight work that needs
  explicit cleanup — see **Cancellation & cleanup** below; the streaming-query
  pattern is in `references/patterns.md`.
- Reading a pending async value **outside** a tracked scope throws
  (`PENDING_ASYNC_UNTRACKED_READ`). Read in JSX, a memo, or an effect compute.
- Async with no `<Loading>` ancestor at `render()` time warns
  (`ASYNC_OUTSIDE_LOADING_BOUNDARY`) and defers the root mount until it
  settles. If your app renders nothing, check the console for this code.

### 1.x resource features → 2.0

| 1.x | 2.0 |
|---|---|
| `createResource(src, fetcher)` | `createMemo(() => fetcher(src()))` (or `createStore(fn)`/`createProjection` for collections) |
| `resource.loading` | `<Loading>` (initial) + `isPending(() => resource())` (revalidation) |
| `resource.error` | `<Errored>` boundary or effect `error` option — one error path, no inline `.error` branching |
| `refetch()` | `refresh(resource)` |
| `mutate()` | `createOptimisticStore` + `action` |

## Cancellation & cleanup in async computations

A computation that returns a `Promise` or async generator owns in-flight work — a
fetch, a socket, a subscription. Solid does **not** cancel it for you. Register
cleanup with `onCleanup`, **synchronously, before the first `await`/`yield`**: after
a suspension point the continuation runs with no owner, so an `onCleanup` placed
there warns `NO_OWNER_CLEANUP` and is silently never run.

### Plain async — abort the in-flight request

```ts
const user = createMemo(async () => {
  const ac = new AbortController();
  onCleanup(() => ac.abort());      // sync, before fetchUser's internal await
  return fetchUser(id(), { signal: ac.signal });
});
```

On a re-run (`id()` changed) or on dispose, the previous request aborts. Solid
already discards the superseded *value*, so the reactive result is correct either
way; aborting is about stopping wasted work and the side effects of a late response.

### Async generator — `yield` streams, `return` discards

Each `yield` **commits** a value (the accessor updates per yield). `return` **ends
the stream and throws its value away** — the last yielded value stays committed.
`return` is for stopping, never for emitting a final value. This is the opposite of
`action()`, where the generator's `return` *is* the action's result:

| In a… | `yield x` | `return x` |
|---|---|---|
| `createMemo(async function*)` | commits `x` — streams | ends the stream, `x` **discarded** |
| `action(async function*)` (below) | transition sync point, not a value | the action's **result** |

Cleanup is the footgun. On dispose Solid **does** call `.return()` on the iterator —
but a generator parked on an *external* `await` (the next socket message, an emitter
tick) won't unwind from it: `.return()` queues behind that `await`, and if the source
has gone quiet the `await` never settles, so `finally` never runs and the resource
leaks. An up-front `onCleanup` is the reliable hook — and it must **actively cancel**
what the generator awaits (close the socket, abort, resolve the pending promise),
which both frees the resource and unblocks the parked `await` so the generator can
unwind. Full pattern in `references/patterns.md` → *Streaming a socket*.

```ts
const messages = createMemo(async function* () {
  const { iterable, cancel } = subscribeToAsyncIterable<Msg>(/* socket → emit */);
  onCleanup(cancel);   // ends the stream and unblocks the parked await (bridge: patterns.md)
  yield* iterable;     // each message commits; never returns on its own
});
```

Symptoms when this is wrong:

- `onCleanup` after the first `await`/`yield` → `NO_OWNER_CLEANUP`; cleanup silently
  skipped, resource leaks.
- A generator that `return`s without ever `yield`ing → the memo never commits a value
  → its `<Loading>` fallback shows **forever**.
- Subscribing to a socket/emitter with no up-front `onCleanup` → leaks on every re-run
  and on route change. `try/finally` alone does **not** save you.

## `Loading` boundary semantics

- Covers **branch readiness**: first render of a subtree that reads not-ready
  values. After content has rendered once, revalidation keeps stale content
  visible — it does not kick back to fallback.
- `on` prop: re-show fallback when the expression changes *while* async is
  pending — for route/key-level transitions:
  `<Loading on={id()} fallback={<Spinner />}>...`

## `isPending(fn)` — stale-while-revalidating

`isPending` **performs the read** and reports whether anything it touched is
currently pending.

```jsx
<Loading fallback={<Spinner />}>
  <Show when={isPending(() => users() || posts())}>refreshing…</Show>
  <List users={users()} posts={posts()} />
</Loading>
```

- Because it reads, placement matters: when the expression can be not-ready,
  put it **under the `Loading` boundary** that owns the initial fallback.
- It can live outside a boundary only when it reads upstream state that can
  never be not-ready — but then it only observes that state's own transition:
  `isPending(id)` stays `false` while a *downstream* subtree loads.
- Guarding interactive controls:
  `<button disabled={isPending(user)}>Save</button>` under the boundary,
  with a disabled fallback for the initial path.

## `latest(fn)`, `resolve(fn)`, `refresh(target)`

> `isRefreshing()` is **gone as of beta.15** — it was a public `solid-js`
> export from beta.0 through beta.14 (and written up in the RFC docs), removed
> in beta.15: commit `52255dc` cut the code, typings, and docs together
> (`@solidjs/signals` still defines it internally, but don't import it). There is
> no public replacement: model refresh/retry intent with actions + optimistic
> state, observe readiness via `<Loading>`/`isPending`, and detect a `refresh()`
> re-run inside a compute by carrying the source key in the yielded state and
> comparing (see `patterns.md`).

```ts
latest(userId); // peek at the in-flight value during a transition
                // (may fall back to stale)

await resolve(() => user()); // Promise that settles when the expression is
                // non-pending. Imperative code / tests only — throws inside
                // a tracking scope.

refresh(user);  // invalidate-and-recompute a derived read. Target must be
                // refreshable: an async memo, derived signal/store
                // (function-form), or projection. It is an action: call from
                // handlers/effects/actions — calling inside a pure
                // computation throws (REACTIVE_WRITE_IN_OWNED_SCOPE).
```

## Transitions are built-in

`startTransition` / `useTransition` are gone. Transitions are a runtime
scheduling concept; multiple can be in flight. The user-facing surface is
`isPending` / `<Loading>` and the optimistic APIs.

## `action(fn)` — mutations

`action()` wraps a **generator or async generator** and returns an async
function. Writes between yields are batched into the action's transition.

```ts
const [todos, setOptimisticTodos] = createOptimisticStore(() => api.getTodos(), []);

const addTodo = action(function* (todo) {
  setOptimisticTodos(s => { s.push(todo); });  // optimistic write
  yield api.addTodo(todo);                     // async work
  refresh(todos);                              // reconcile with source of truth
});

// async-generator form (better TS): yield re-enters the transition context after await
const save = action(async function* (todo) {
  setOptimisticTodos(s => { s.push(todo); });
  const res = await api.addTodo(todo);
  yield;
  refresh(todos);
  return res;
});
```

Shape of a mutation: optimistic write → `yield`/`await` server work →
`refresh(...)` derived reads. Don't use `refresh()` as a "refreshing" UI flag —
that's `isPending`'s job.

## Optimistic primitives

Writes are transition-scoped: they apply immediately and **revert when the
transition completes** (by which time `refresh` has reconciled real data).

```ts
// Signal surface — same as createSignal (value or compute-fn forms)
const [name, setName] = createOptimistic("Alice");

// Store surface — plain or derived form
const [todos, setTodos] = createOptimisticStore({ list: [] });
const [todos2, setTodos2] = createOptimisticStore(() => api.getTodos(), [], { key: "id" });
```

`createOptimisticStore(fn, seed, options?)` mirrors `createStore(fn, seed)`:
the second argument is the backing host object/array, `options.key` controls
reconciliation of returned values.

## Errors: one path

Async errors propagate through the reactive graph and are caught structurally:

```jsx
<Errored fallback={(err, reset) => (
  <div>
    <pre>{String(err())}</pre>          {/* err is an accessor */}
    <button onClick={reset}>Retry</button>
  </div>
)}>
  <Page />
</Errored>
```

Programmatic: `createEffect(compute, { effect, error })`. There is no
`resource.error`, `onError`, or `catchError`; boundaries heal automatically
(no `resetErrorBoundaries`).
