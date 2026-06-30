type Unsubscribe = () => void

export interface SubscriptionStream<T> {
  iterable: AsyncIterable<T>
  cancel: Unsubscribe
}

/**
 * Bridges a callback-style subscription into an async iterable.
 *
 * Subscribes eagerly (on call, before the consumer starts draining) and buffers
 * values, so an emission that lands between subscribe and the first `next()` is
 * not lost — the init-race the settings store depends on. `cancel` unsubscribes
 * and ends the iterable; with no `return()`-on-dispose from Solid, the consumer
 * must call it from `onCleanup`.
 */
export default function subscribeToAsyncIterable<T>(
  subscribe: (subscriber: (value: T) => void) => Unsubscribe,
): SubscriptionStream<T> {
  const buffer: T[] = []
  let waiter: PromiseWithResolvers<undefined> | null = null
  let done = false

  const wake = (): void => {
    const pending = waiter
    if (pending != null) {
      waiter = null
      pending.resolve(undefined)
    }
  }

  const unsubscribe = subscribe((value) => {
    if (done) return
    buffer.push(value)
    wake()
  })

  const cancel: Unsubscribe = () => {
    if (done) return
    done = true
    unsubscribe()
    wake()
  }

  const iterable: AsyncIterable<T> = {
    async *[Symbol.asyncIterator]() {
      while (true) {
        for (const value of buffer.splice(0)) yield value
        if (done) return
        waiter ??= Promise.withResolvers<undefined>()
        // eslint-disable-next-line no-await-in-loop -- a stream consumer: awaiting the next emission is the loop's purpose
        await waiter.promise
      }
    },
  }

  return { iterable, cancel }
}
