import { setTimeout as tick } from 'node:timers/promises'
import { createEffect, createRoot, flush } from 'solid-js'
import createStorage from '@/utils/storage'
import type { Serializer } from '@/utils/storage'
import MemoryStorageAdapter from '@/utils/storage/adapters/memory-storage-adapter'
import createSettings from './createSettings'

const numberSerializer: Serializer<number> = {
  deserialize: (value) => (typeof value === 'number' ? value : 0),
  serialize: (value) => value,
}

const settle = async (): Promise<void> => {
  await tick()
  flush()
}

function setup(initial = 0) {
  const adapter = new MemoryStorageAdapter()
  adapter.write(initial)
  const storage = createStorage(() => adapter, numberSerializer)

  const seen: number[] = []
  let setValue!: (v: number) => Promise<void>
  let dispose!: () => void

  createRoot((disposeRoot) => {
    dispose = disposeRoot
    const [value, set] = createSettings(storage)
    setValue = set
    createEffect(
      () => value(),
      (v) => {
        seen.push(v)
      },
    )
  })

  return { adapter, seen, setValue, dispose }
}

describe('createSettings', () => {
  it('yields the initial load', async () => {
    const { seen } = setup(3)

    await settle()

    expect(seen).toEqual([3])
  })

  it('streams own writes', async () => {
    const { seen, setValue } = setup(0)
    await settle()

    await setValue(1)
    await settle()
    await setValue(2)
    await settle()

    expect(seen).toEqual([0, 1, 2])
  })

  it('streams external changes', async () => {
    const { adapter, seen } = setup(0)
    await settle()

    adapter.write(9)
    await settle()

    expect(seen).toEqual([0, 9])
  })

  it('does not lose a change landing right after the initial load (init-race)', async () => {
    const { adapter, seen } = setup(0)

    // Change the backend before the first drain settles — must still surface.
    adapter.write(7)
    await settle()

    expect(seen.at(-1)).toBe(7)
  })

  it('stops streaming after dispose', async () => {
    const { adapter, seen, dispose } = setup(0)
    await settle()

    dispose()
    adapter.write(5)
    await settle()

    expect(seen).toEqual([0])
  })
})
