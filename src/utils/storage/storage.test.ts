import { setTimeout as tick } from 'node:timers/promises'
import MemoryStorageAdapter from './adapters/memory-storage-adapter'
import createStorage from './storage'
import type { Serializer } from './types'

// Validates `JsonValue → number`: anything non-numeric falls back to 0.
const numberSerializer: Serializer<number> = {
  deserialize: (value) => (typeof value === 'number' ? value : 0),
  serialize: (value) => value,
}

function build(adapter = new MemoryStorageAdapter()) {
  return { adapter, storage: createStorage(() => adapter, numberSerializer) }
}

describe('storage', () => {
  it('reads the deserialized current value', async () => {
    const adapter = new MemoryStorageAdapter()
    adapter.write(42)
    const { storage } = build(adapter)

    expect(await storage.read()).toBe(42)
  })

  it('round-trips write → read', async () => {
    const { storage } = build()

    await storage.write(7)

    expect(await storage.read()).toBe(7)
  })

  it('falls back when the stored value fails validation', async () => {
    const adapter = new MemoryStorageAdapter()
    adapter.write('garbage')
    const { storage } = build(adapter)

    expect(await storage.read()).toBe(0)
  })

  it('notifies subscribers of own writes', async () => {
    const { storage } = build()
    const seen: number[] = []
    storage.subscribe((v) => {
      seen.push(v)
    })
    await tick() // let the lazy adapter attach

    await storage.write(1)
    await storage.write(2)

    expect(seen).toEqual([1, 2])
  })

  it('notifies subscribers of external changes', async () => {
    const { adapter, storage } = build()
    const seen: number[] = []
    storage.subscribe((v) => {
      seen.push(v)
    })
    await tick()

    // Simulate another tab writing straight to the backend.
    adapter.write(99)

    expect(seen).toEqual([99])
  })

  it('stops notifying after unsubscribe', async () => {
    const { storage } = build()
    const seen: number[] = []
    const unsubscribe = storage.subscribe((v) => {
      seen.push(v)
    })
    await tick()

    unsubscribe()
    await storage.write(5)

    expect(seen).toEqual([])
  })

  it('shares a single adapter instance across concurrent first calls', async () => {
    const load = vi.fn(() => new MemoryStorageAdapter())
    const storage = createStorage(load, numberSerializer)

    storage.subscribe(() => {})
    await Promise.all([storage.read(), storage.write(1)])

    expect(load).toHaveBeenCalledTimes(1)
  })

  it('retries the adapter load after a failed load (no poisoned cache)', async () => {
    const adapter = new MemoryStorageAdapter()
    adapter.write(5)
    let attempt = 0
    const load = vi.fn(async () => {
      attempt += 1
      // Reject asynchronously (like a failed dynamic import) so the rejection is
      // cached in `adapterPromise` — that is exactly what the fix must drop.
      if (attempt === 1) await Promise.reject(new Error('chunk load failed'))
      return adapter
    })
    const storage = createStorage(load, numberSerializer)

    await expect(storage.read()).rejects.toThrow('chunk load failed')
    // The cached rejection must not be replayed — the next call retries.
    expect(await storage.read()).toBe(5)
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('disposes a lazily-loaded adapter and skips attaching when disposed mid-load', async () => {
    const adapter = new MemoryStorageAdapter()
    const disposeSpy = vi.spyOn(adapter, 'dispose')
    const { promise, resolve: resolveLoad } = Promise.withResolvers<MemoryStorageAdapter>()
    const storage = createStorage(async () => await promise, numberSerializer)

    const seen: number[] = []
    storage.subscribe((v) => {
      seen.push(v)
    })
    storage.dispose() // dispose before the load resolves
    resolveLoad(adapter)
    await tick()

    expect(disposeSpy).toHaveBeenCalledTimes(1)
    adapter.write(1) // an external change after dispose
    await tick()
    expect(seen).toEqual([]) // the subscription never attached
  })

  it('keeps notifying the remaining subscribers when one throws', async () => {
    const { storage } = build()
    const seen: number[] = []
    storage.subscribe(() => {
      throw new Error('bad listener')
    })
    storage.subscribe((v) => {
      seen.push(v)
    })
    await tick()

    await storage.write(1)

    expect(seen).toEqual([1])
  })
})
