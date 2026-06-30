import { type Accessor, createMemo, onCleanup } from 'solid-js'
import type { Storage } from '@/utils/storage'
import subscribeToAsyncIterable from '@/utils/subscribe-to-async-iterable'

export type SetSettings<T> = (value: T) => Promise<void>

export type SettingsReturn<T> = [value: Accessor<T>, setSettings: SetSettings<T>]

/**
 * The reactive settings store: an async-iterator memo is the single source of
 * truth. It yields the initial load (suspends under `<Loading>`), then streams
 * every change — own writes and external — through the same path. Owned by the
 * caller; creates no root of its own.
 */
export default function createSettings<T>(storage: Storage<T>): SettingsReturn<T> {
  const value = createMemo(async function* () {
    // Subscribe before reading so an own-write echo right after load isn't lost.
    const stream = subscribeToAsyncIterable<T>((subscriber) => storage.subscribe(subscriber))
    onCleanup(stream.cancel)

    yield await storage.read()
    yield* stream.iterable
  })

  const setSettings: SetSettings<T> = async (next) => {
    await storage.write(next)
  }

  return [value, setSettings]
}
