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
})
