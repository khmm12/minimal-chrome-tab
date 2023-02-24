import { type Accessor, createEffect, createSignal, mergeProps, onCleanup, untrack } from 'solid-js'

type Unsubscribe = () => void

type Identity<T> = (previous: T, next: T) => boolean

interface Subscription<T> {
  subscribe: (fn: () => void) => Unsubscribe
  getCurrentValue: () => T
  identity?: Identity<T>
}

const DefaultIdentity = <T>(a: T, b: T): boolean => Object.is(a, b)

export default function createSubscription<T>(subscription: Subscription<T>): Accessor<T> {
  const resolved = mergeProps({ identity: DefaultIdentity as Identity<T> }, subscription)

  const [value, setValue] = createSignal(resolved.getCurrentValue(), { equals: (a, b) => resolved.identity(a, b) })

  createEffect(() => {
    // Update value on mount and observe `getCurrentValue` only
    setValue(() => resolved.getCurrentValue())
  })

  createEffect(() => {
    // Subscribe and observe `subscribe` only
    const unsubscribe = resolved.subscribe(() => {
      const nextValue = untrack(() => resolved.getCurrentValue())
      setValue(() => nextValue)
    })
    onCleanup(() => {
      unsubscribe()
    })
  })

  return value
}
