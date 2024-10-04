import { createResource, type InitializedResource, onCleanup, onMount, type Signal } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'
import type { IDisposableStorage, IMemorableStorage, ISubscribableStorage, IWritableStorage } from '@/utils/storage'

type Storage<T> = IWritableStorage<T> & IMemorableStorage<T> & ISubscribableStorage<T> & IDisposableStorage
type Mutator<T> = (previousState: T) => T
type Set<T> = (value: T | Mutator<T>) => Promise<void>

export type StorageReturn<T> = [value: InitializedResource<T>, set: Set<T>]

export default function createStorage<T>(storage: Storage<T>): StorageReturn<T> {
  const [resource, { mutate }] = createResource(async () => await storage.read(), {
    initialValue: storage.value,
    storage: createDeepSignal,
  })

  const set: Set<T> = async (v: Mutator<T> | T) => {
    const mutator = typeof v === 'function' ? (v as Mutator<T>) : ((() => v) as Mutator<T>)
    const nextValue = mutator(resource.latest)
    await storage.write(nextValue)
    mutate(() => nextValue)
  }

  onMount(() => {
    const unsubscribe = storage.subscribe((nextValue) => {
      mutate(() => nextValue)
    })
    onCleanup(unsubscribe)
  })

  return [resource, set]
}

function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({ value })
  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value)
      if (typeof v === 'function') v = v(unwrapped)
      setStore('value', reconcile(v))
      return store.value
    },
  ] as Signal<T>
}
