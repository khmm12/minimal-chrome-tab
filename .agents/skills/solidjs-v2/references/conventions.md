# Conventions

Verified against solid-js@2.0.0-beta.15 (published typings) and `next@a4ca10b` sources.

## Naming: `create*` vs `use*`

The prefix carries meaning — it is **not** React's "every hook is `useX`". Pick by
lifecycle:

- **`createX`** — creates a new reactive primitive **owned by the calling scope**
  (disposed with it); each call is an independent instance. This is the default and
  what nearly everything is: `createSignal`, `createMemo`, `createEffect`,
  `createStore`, `createProjection`, `createRenderEffect`, `createContext`, and your
  own `createMediaQuery`, `createWindowSize`, `createLocalStorage`. `create` because
  in Solid these are made **once** — the component runs once; primitives aren't
  re-invoked per render the way React hooks are.

- **`useX`** — accesses something **already created and shared**, not a fresh
  instance. Two real forms:
  - `useContext` — reads a context that `createContext` already made.
  - the **singleton** variant of a `createX` primitive. solid-primitives ships these
    deliberately: `useWindowSize` / `usePrefersDark` are `createWindowSize` /
    `createPrefersDark` wrapped in a singleton root (created once in a detached root,
    then shared across all callers). `create` = make your own; `use` = use the shared one.

```ts
const a = createPrefersDark();   // your own instance, owned by this scope
const b = usePrefersDark();      // the shared singleton — created once, reused
```

So `useWindowSize` is **not** a mistake; it's the shared-singleton form. The reflex
to avoid is naming *every* composable `useX` out of React habit — in Solid the
prefix tells the reader whether they get a fresh owned instance (`create`) or a
shared/existing one (`use`). When in doubt, you want `createX`.

Rationale from Solid's author: https://github.com/solidjs/solid/issues/317. The
singleton wrapper is `createSingletonRoot` / `createHydratableSingletonRoot` from
`@solid-primitives/rootless` (e.g. `useWindowSize = createHydratableSingletonRoot(createWindowSize)`).
