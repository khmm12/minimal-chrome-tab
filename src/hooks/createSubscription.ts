import { type Accessor, createEffect, createSignal } from 'solid-js'

type Unsubscribe = () => void
type Identity<T> = (previous: T, next: T) => boolean
type Narrowable = unknown

interface Subscription<T, D extends Narrowable[]> {
  subscribe: (fn: () => void, deps: D) => Unsubscribe
  getCurrentValue: (deps: D) => T
  deps: () => D
  identity?: Identity<T> | undefined
}

const DefaultIdentity = <T>(previous: T, next: T): boolean => Object.is(previous, next)

export default function createSubscription<T, D extends Narrowable[]>(subscription: Subscription<T, D>): Accessor<T> {
  const identity = subscription.identity ?? DefaultIdentity

  const [value, setValue] = createSignal(() => subscription.getCurrentValue(subscription.deps()), {
    equals: identity,
  })

  createEffect(
    () => [subscription.subscribe, ...subscription.deps()] as const,
    ([subscribe, ...deps]) => {
      const resolvedDeps = deps as D
      const update = (): void => {
        const nextValue = subscription.getCurrentValue(resolvedDeps)
        setValue(() => nextValue)
      }
      const unsubscribe = subscribe(update, resolvedDeps)

      update()

      return unsubscribe
    },
  )

  return value
}
