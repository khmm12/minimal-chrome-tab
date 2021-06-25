import { Accessor, JSX, createMemo, untrack } from 'solid-js'

interface ShowProps<T> {
  when: T | undefined | null | false
  fallback?: JSX.Element
  children: JSX.Element | ((item: Accessor<NonNullable<T>>) => JSX.Element)
}

export default function Show<T>(props: ShowProps<T>): JSX.Element {
  let strictEqual = false

  const equals = <T extends any>(a: T, b: T): boolean => (strictEqual ? a === b : !a === !b)

  const condition = createMemo(() => props.when, undefined, { equals })
  const shouldShow = createMemo(() => !!props.when, undefined, { equals })

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
