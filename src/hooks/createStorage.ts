import { createResource, type InitializedResource, onCleanup, onMount } from 'solid-js'
import {
  type IDisposableStorage,
  type IMemorableStorage,
  type ISubscribableStorage,
  type IWritableStorage,
} from '@/utils/storage'

type Storage<T> = IWritableStorage<T> & IMemorableStorage<T> & ISubscribableStorage<T> & IDisposableStorage
type Mutator<T> = (previousState: T) => T
type Set<T> = (value: T | Mutator<T>) => Promise<void>

export type StorageReturn<T> = [value: InitializedResource<T>, set: Set<T>]

export default function createStorage<T>(storage: Storage<T>): StorageReturn<T> {
  const [resource, { mutate }] = createResource(async () => await storage.read(), {
    initialValue: storage.value,
  })

  const set: Set<T> = async (v: Mutator<T> | T) => {
    const mutator = typeof v === 'function' ? (v as Mutator<T>) : ((() => v) as Mutator<T>)
    const nextValue = mutator(resource.latest)
    await storage.write(nextValue)
    mutate(() => nextValue)
  }

  onMount(() => {
    const unsubscribe = storage.subscribe((nextValue) => mutate(() => nextValue))
    onCleanup(unsubscribe)
  })

  return [resource, set]
}
