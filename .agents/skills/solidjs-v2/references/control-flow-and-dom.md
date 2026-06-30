# Control flow and DOM

Verified against solid-js@2.0.0-beta.15 / @solidjs/web@2.0.0-beta.15 typings,
`next@a4ca10b` sources and `packages/solid-web/test/flow.type-tests.tsx`.
Control-flow components live in `solid-js`; `render`/`hydrate`/`Portal`/
`Dynamic`/`dynamic` live in `@solidjs/web`.

## `For` — one list primitive, three keying modes

The callback shape follows the keying mode. **Memorize this table** — it's the
top list-rendering bug source:

| Mode | `item` | `index` |
|---|---|---|
| default / `keyed={true}` (identity) | raw value | `Accessor<number>` |
| `keyed={false}` (replaces `<Index>`) | `Accessor<T>` | plain `number` |
| `keyed={t => t.id}` (custom key) | `Accessor<T>` | `Accessor<number>` |

```jsx
<For each={todos()}>{(todo, i) => <Row todo={todo} index={i()} />}</For>
<For each={todos()} keyed={false}>{(todo, i) => <Row todo={todo()} index={i} />}</For>
<For each={todos()} keyed={t => t.id} fallback={<Empty />}>{todo => <Row todo={todo()} />}</For>
```

Use literal `keyed` values with function children — a dynamic boolean makes the
callback shape ambiguous. `<Index>` and `indexArray` are gone (`mapArray`
handles non-keyed).

## `Repeat` — count/range rendering, no diffing

```jsx
<Repeat count={store.items.length} from={start()} fallback={<Empty />}>
  {i => <Row name={store.items[i].name} />}
</Repeat>
```

`i` is a **plain number** — a stable slot key. Designed for store-backed lists
(reactivity comes from store reads, not the index), skeletons, windowing.

## `Show` / `Switch` / `Match`

Non-keyed function children receive a narrowed **accessor**; `keyed` children
receive the raw narrowed value (identity switches the branch):

```jsx
<Show when={user()} fallback={<Login />}>{u => <Profile user={u()} />}</Show>
<Show when={user()} keyed>{u => <Profile user={u} />}</Show>

<Switch fallback={<NotFound />}>
  <Match when={route() === "home"}><Home /></Match>
  <Match when={detail()} keyed>{d => <Detail data={d} />}</Match>
</Switch>
```

Don't compute values in the callback body (structure-building, untracked —
warns); read through JSX expressions: `{u => <span>{u().name}</span>}`.

## `Loading` / `Errored` (replace `Suspense` / `ErrorBoundary`)

```jsx
<Loading fallback={<Spinner />} on={id()}>   {/* on: re-show fallback when id changes while pending */}
  <Profile />
</Loading>

<Errored fallback={(err, reset) => <button onClick={reset}>retry {String(err())}</button>}>
  <Page />
</Errored>
```

`err` is an accessor; `reset` is an action to retry the branch. Boundaries heal
automatically. Semantics details: `references/async-and-actions.md`.

## `Reveal` (replaces `SuspenseList`)

Coordinates sibling `Loading` boundaries.

- `order`: `"sequential"` (default; reveal in DOM order) | `"together"` (whole
  group at once) | `"natural"` (each on its own data — only meaningful nested,
  as one composite slot in the parent's ordering).
- `collapsed` (boolean, sequential-only): boundaries past the frontier render
  nothing instead of their fallback.
- Nesting: a nested `<Reveal>` is one composite slot; the parent holds the
  whole inner group (no opt-out) until its ordering releases the slot, then the
  inner group runs its own order.
- SSR: `order="together"` and `collapsed` need streaming
  (`renderToStream`/`renderToStringAsync`); plain `renderToString` supports
  `sequential` (uncollapsed) and `natural`.

```jsx
<Reveal>
  <Loading fallback={<Skeleton />}><Header /></Loading>
  <Reveal order="natural">  {/* held until Header reveals; then each card on its own data */}
    <Loading fallback={<CardSkel />}><Card id={1} /></Loading>
    <Loading fallback={<CardSkel />}><Card id={2} /></Loading>
  </Reveal>
  <Loading fallback={<Skeleton />}><Footer /></Loading>
</Reveal>
```

## Dynamic components

```jsx
import { dynamic, Dynamic } from "@solidjs/web";

// Factory (canonical): stable Component identity; source may be async
// (composes with <Loading> via the normal NotReadyError flow)
const Active = dynamic(() => (isEditing() ? Editor : Viewer));
return <Active value={value()} />;

// JSX wrapper for inline sources — unchanged from 1.x at the call site
<Dynamic component={isEditing() ? Editor : Viewer} value={value()} />
```

`createDynamic(source, props)` is gone — use `<Dynamic>` or
`createComponent(dynamic(source), props)`. One `dynamic(...)` source is shared
across all mounted instances.

## DOM: attributes, class, events, refs

### Attributes follow HTML

- Built-in attribute names are **lowercase**: `tabindex`, not `tabIndex`.
  Event handlers stay camelCase (`onClick`).
- Booleans are presence/absence: `muted={false}` removes the attribute. When
  the platform wants a literal string, pass `"true"`.
- `attr:` / `bool:` / `on:` / `oncapture:` / `class:` / `style:` namespaces are
  all gone.
- Form-field stateful props remain props and are special-cased: `input.value`,
  `defaultValue`, `checked`, `defaultChecked`, `select.value`, `option.value/
  selected/defaultSelected`, `textarea.value`, `video/audio.muted/defaultMuted`.
- For DOM initial state use platform defaults (`defaultValue={x}`), not a
  frozen reactive read. `/*@once*/` is gone — keep reactive reads reactive, or
  use `untrack` in JS for a deliberate one-shot.

### `class` — object/array forms (no `classList`)

```jsx
<div class="card" />
<div class={{ active: isActive(), disabled: isDisabled() }} />
<div class={["card", props.class, { active: isActive() }]} />
```

Don't build class strings with template literals / `.filter(Boolean).join(" ")`
— that's the React/classnames reflex; the array+object form composes.

### Events

camelCase handlers (`onClick`) use Solid's delegated path. Delegation is owned
by **render roots** (not `document`): `render()`/`hydrate()` install listeners
on their container and dispose them with the root; ShadowRoot rendering scopes
to the shadow root; `Portal` mounts outside the root still bubble through the
logical tree. If you called `clearDelegatedEvents()` — remove it, dispose the
root instead.

Native listener options live in ref callbacks:

```jsx
const on = (type, handler, options) => el => el.addEventListener(type, handler, options);
<button ref={on("click", handleClick, { capture: true })} />
```

### Refs and directives (no `use:`)

`ref` is the single composition point: element access (`ref={el => ...}`),
directive factories (`ref={tooltip({ content: "Save" })}`), arrays
(`ref={[autofocus, tooltip(opts)]}`, nesting allowed).

Two-phase directive factory (recommended):

```ts
function titleDirective(source) {
  let el;                                  // setup phase (owned): primitives here, no DOM writes
  createEffect(source, value => { if (el) el.title = value; });
  return nextEl => {                       // apply phase (unowned): DOM writes, no new primitives
    el = nextEl;
    el.title = source();
  };
}
```

## Rendering entries

```ts
import { render, hydrate, Portal } from "@solidjs/web";                       // client
import { renderToString, renderToStringAsync, renderToStream, isServer, isDev } from "@solidjs/web"; // server
```

`render` returns a dispose function. `Portal` throws on the server.
