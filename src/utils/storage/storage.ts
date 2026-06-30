import type { Promisable } from 'type-fest'
import type { Serializer, Storage, StorageAdapter, Subscriber, Unsubscribe } from './types'

export type AdapterLoader = () => Promisable<StorageAdapter>

/**
 * Builds a generic, async, stateless storage over a backend adapter.
 *
 * The backend is the source of truth — storage holds no value of its own. The
 * adapter is loaded lazily on the first `read`/`write`/`subscribe`, which is what
 * lets callers avoid a top-level await. The in-flight load promise is cached, so
 * concurrent first calls share a single adapter instance (and a single listener).
 */
export default function createStorage<T>(loadAdapter: AdapterLoader, serializer: Serializer<T>): Storage<T> {
  let adapterPromise: Promise<StorageAdapter> | null = null
  let adapter: StorageAdapter | null = null
  let disposed = false

  const ensureAdapter = async (): Promise<StorageAdapter> => {
    adapterPromise ??= Promise.resolve(loadAdapter()).then((a) => {
      adapter = a
      if (disposed) a.dispose?.()
      return a
    })
    return await adapterPromise
  }

  return {
    async read() {
      const adapter = await ensureAdapter()
      return serializer.deserialize(await adapter.read())
    },

    async write(value) {
      const adapter = await ensureAdapter()
      await adapter.write(serializer.serialize(value))
    },

    subscribe(subscriber: Subscriber<T>): Unsubscribe {
      // The adapter loads asynchronously, so the real subscription attaches later.
      // `active` cancels a subscription torn down before the adapter is ready.
      let active = true
      let unsubscribe: Unsubscribe | null = null

      void ensureAdapter().then((a) => {
        if (!active) return
        unsubscribe = a.subscribe((raw) => {
          subscriber(serializer.deserialize(raw))
        })
      })

      return () => {
        active = false
        unsubscribe?.()
      }
    },

    dispose() {
      disposed = true
      adapter?.dispose?.()
    },
  }
}
