import { Resource, createResource, onCleanup, onMount } from 'solid-js'
import Storage from '@/utils/storage'

type Mutator<T> = (previousState: T) => T

type Set<T> = (value: T | Mutator<T>) => Promise<void>

export type StorageReturn<T> = [value: Resource<T | undefined>, set: Set<T>]

export { Storage }

export default function createStorage<T>(storage: Storage<T>): StorageReturn<T> {
  const [resource, { mutate }] = createResource(async () => await storage.read())

  const set: Set<T> = async (v: Mutator<T> | T) => {
    const mutator = typeof v === 'function' ? (v as Mutator<T>) : ((() => v) as Mutator<T>)

    const previous = resource.latest ?? (await storage.read())
    const nextValue = mutator(previous)
    await storage.write(nextValue)
    mutate(() => nextValue)
  }

  const subscriber = (value: T): void => {
    mutate(() => value)
  }

  onMount(() => storage.subscribe(subscriber))
  onCleanup(() => storage.unsubscribe(subscriber))

  return [resource, set]
}
