import { Accessor, createEffect, createSignal, onCleanup, untrack } from 'solid-js'

type Unsubscribe = () => void

type Identity<T> = (previous: T, next: T) => boolean

interface Subscription<T> {
  subscribe: (fn: () => void) => Unsubscribe
  getCurrentValue: () => T
  identity?: Identity<T>
}

const DefaultIdentity = <T>(a: T, b: T): boolean => Object.is(a, b)

export default function createSubscription<T>(subscription: Subscription<T>): Accessor<T> {
  const [value, setValue] = createSignal(subscription.getCurrentValue())

  const updateValue = (nextValue: T): void => {
    const isEqual: Identity<T> = untrack(() => subscription.identity ?? DefaultIdentity)
    setValue((previous) => (isEqual(previous, nextValue) ? previous : nextValue))
  }

  createEffect(() => {
    // Update value on mount and observe subscription changes
    updateValue(subscription.getCurrentValue())
  })

  createEffect(() => {
    // Subscribe and observe subscribe only
    const unsubscribe = subscription.subscribe(() => {
      untrack(() => updateValue(subscription.getCurrentValue()))
    })
    onCleanup(() => unsubscribe())
  })

  return value
}
