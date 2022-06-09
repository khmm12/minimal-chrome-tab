import { Accessor, createEffect, createSignal, mergeProps, onCleanup, untrack } from 'solid-js'

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

  const [value, setValue] = createSignal(resolved.getCurrentValue())

  const updateValue = (nextValue: T): void => {
    const isEqual = untrack(() => resolved.identity)
    setValue((previous) => (isEqual(previous, nextValue) ? previous : nextValue))
  }

  createEffect(() => {
    // Update value on mount and observe `getCurrentValue` only
    updateValue(resolved.getCurrentValue())
  })

  createEffect(() => {
    // Subscribe and observe `subscribe` only
    const unsubscribe = resolved.subscribe(() => {
      untrack(() => updateValue(resolved.getCurrentValue()))
    })
    onCleanup(() => unsubscribe())
  })

  return value
}
