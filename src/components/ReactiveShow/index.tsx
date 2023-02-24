import { type Accessor, createMemo, type JSX, untrack } from 'solid-js'

interface ReactiveShowProps<T> {
  when: T | undefined | null | false
  fallback?: JSX.Element
  children: JSX.Element | ((item: Accessor<NonNullable<T>>) => JSX.Element)
}

export default function ReactiveShow<T>(props: ReactiveShowProps<T>): JSX.Element {
  let strictEqual = false

  const equals = <T,>(a: T, b: T): boolean => (strictEqual ? a === b : Boolean(a) === Boolean(b))

  const condition = createMemo(() => props.when, undefined, { equals })
  const shouldShow = createMemo(() => !isNegative(props.when), undefined, { equals })

  return createMemo(() => {
    if (shouldShow()) {
      const child = props.children
      if (typeof child === 'function' && child.length > 0) {
        strictEqual = true
        return untrack(() => child(condition as Accessor<NonNullable<T>>))
      } else {
        strictEqual = false
        return child
      }
    }
    return props.fallback
  }) as () => JSX.Element
}

function isNegative<T>(value: T | undefined | null | false): boolean {
  return value == null || value === false
}
