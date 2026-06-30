# Stores: drafts, projections, helpers

Verified against solid-js@2.0.0-beta.15 (published typings) and `next@a4ca10b` sources/tests.
All store APIs are exported from `solid-js` (the `solid-js/store` subpath is gone).

## Draft-first setters (produce is the default)

```ts
const [store, setStore] = createStore({ user: { name: "A" }, list: [] });

setStore(s => {
  s.user.name = "B";
  s.list.push("x");
});
```

- Mutating the draft in place is the canonical form (1.x `produce` semantics,
  no import needed).
- **Returning a value** from the setter performs a shallow replacement: arrays
  replace by index + length, objects shallow-diff at the top level. Reach for
  it when mutation is awkward (filter/remove):
  `setStore(s => s.list.filter(x => x !== "x"))` — note: no keyed
  reconciliation here; that's a projection-fn/`reconcile` feature.
- 1.x path-style setters are gone; the opt-in compat helper is `storePath`:
  `setStore(storePath("user", "address", "city", "Paris"))`, supports ranges
  (`{ from, to, by }`), filter functions, and `storePath.DELETE`.
- `createMutable` / `modifyMutable` are gone — direct proxy mutation can't
  participate in batching, transitions, or optimistic rollback. Use
  `createStore` with draft setters.

## `reconcile(value, key)` — keyed diffing into a subtree

Returns a draft-setter function. Call it *inside* the setter, targeting the
part of the draft to reconcile (identity preserved for unchanged entries):

```ts
setStore(s => {
  reconcile(serverTodos, "id")(s.todos);
});
// or for the whole store:
setStore(reconcile(serverState, "id"));
```

`key` is a property name or extractor function.

## Derived stores: the memo/signal split, mirrored

| Signals | Stores |
|---|---|
| `createMemo(fn)` — readonly derived value | `createProjection(fn, seed, options?)` — readonly derived store |
| `createSignal(fn)` — writable derived value | `createStore(fn, seed, options?)` — writable derived store |

The derive function receives a **draft** it can mutate. If it **returns** a
value (sync or async — Promise/AsyncIterable supported), that value is
**reconciled** into the output keyed by `options.key` (default `"id"`).
`seed` is the real backing host object/array — an explicit seed, not a
memo-style "initial value".

```ts
// Selection without notifying every row (replaces createSelector)
const [selectedId, setSelectedId] = createSignal("a");
const selected = createProjection(s => {
  const id = selectedId();
  s[id] = true;
  if (s._prev != null) delete s[s._prev];
  s._prev = id;
}, {});

// Async derived collection, reconciled by key — refreshable via refresh(users)
const users = createProjection(async () => api.listUsers(), [], { key: "id" });

// Writable derived store: reactively derived + imperative writes
const [cache, setCache] = createStore(draft => { draft.x = compute(); }, { x: 0 });
setCache(s => { s.override = true; });
```

Function-form `createSignal` (the "writable memo") completes the picture:

```ts
const [value, setValue] = createSignal(() => props.initial);
// recompute on deps change; setValue writes like a normal signal
```

This is the replacement for `createComputed`-with-writeback, and the canonical
way to seed local state from a prop. (TS note: with a generic `T`, the plain
value overload can fail `Exclude<T, Function>` — the compute-fn overload
`createSignal(() => initial)` is the fix.)

## `snapshot` and `deep`

Both return **plain** (non-proxy) deep copies; they differ in tracking:

```ts
snapshot(store); // no subscription — serialization, interop, test assertions
deep(store);     // subscribes to EVERY nested property — use in an effect's
                 // compute phase to react to any nested change
```

`snapshot` replaces 1.x `unwrap` (the immutable internals mean unwrapping
proxies isn't sufficient; `snapshot` builds a distinct object graph, preserving
references where nothing changed).

## `merge` / `omit` (replace `mergeProps` / `splitProps`)

```ts
const merged = merge(defaults, props, overrides); // right-most wins, reactivity preserved
const rest = omit(props, "class", "style");       // vararg keys, proxy view (no copy)
```

Gotcha carried into every setter/merge: **`undefined` is a real value** — it
overrides, it does not mean "skip this key".

```ts
merge({ a: 1, b: 2 }, { b: undefined }).b; // undefined
```
