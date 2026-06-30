import subscribeToAsyncIterable from './subscribe-to-async-iterable'

type Emit<T> = (value: T) => void

describe('subscribeToAsyncIterable', () => {
  it('subscribes eagerly, before the consumer drains', () => {
    const src = source<number>()

    subscribeToAsyncIterable(src.subscribe)

    expect(src.subscribers()).toBe(1)
  })

  it('buffers values emitted before the first read (init-race)', async () => {
    const src = source<number>()
    const { iterable } = subscribeToAsyncIterable(src.subscribe)

    // Emitted *before* anyone starts iterating — must not be lost.
    src.emit(1)
    src.emit(2)

    expect(await take(iterable, 2)).toEqual([1, 2])
  })

  it('streams values emitted while the consumer awaits', async () => {
    const src = source<number>()
    const { iterable } = subscribeToAsyncIterable(src.subscribe)

    const collected = take(iterable, 3)
    src.emit(1)
    src.emit(2)
    src.emit(3)

    expect(await collected).toEqual([1, 2, 3])
  })

  it('unsubscribes and ends the iterable on cancel', async () => {
    const src = source<number>()
    const { iterable, cancel } = subscribeToAsyncIterable(src.subscribe)

    const drained: number[] = []
    const loop = (async () => {
      for await (const value of iterable) drained.push(value)
    })()

    src.emit(1)
    await Promise.resolve()
    cancel()
    await loop

    expect(src.subscribers()).toBe(0)
    expect(drained).toEqual([1])
  })

  it('ignores values emitted after cancel', async () => {
    const src = source<number>()
    const { iterable, cancel } = subscribeToAsyncIterable(src.subscribe)

    cancel()
    src.emit(1)

    const out: number[] = []
    for await (const value of iterable) out.push(value)

    expect(out).toEqual([])
  })
})

/** A bare callback source whose emitter we drive by hand. */
function source<T>(): { subscribe: (s: Emit<T>) => () => void; emit: Emit<T>; subscribers: () => number } {
  const subscribers = new Set<Emit<T>>()
  return {
    subscribe(subscriber) {
      subscribers.add(subscriber)
      return () => {
        subscribers.delete(subscriber)
      }
    },
    emit(value) {
      for (const subscriber of subscribers) subscriber(value)
    },
    subscribers: () => subscribers.size,
  }
}

async function take<T>(iterable: AsyncIterable<T>, count: number): Promise<T[]> {
  const out: T[] = []
  for await (const value of iterable) {
    out.push(value)
    if (out.length >= count) break
  }
  return out
}
