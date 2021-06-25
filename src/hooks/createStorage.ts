import { Resource, createResource, onCleanup, onMount } from 'solid-js'
import Storage from '@/utils/storage'

export type StorageReturn<T> = [value: Resource<T | undefined>, write: (fn: (previousValue: T) => T) => Promise<void>]

export { Storage }

export default function createStorage<T>(storage: Storage<T>): StorageReturn<T> {
  const [resource, { mutate }] = createResource(async () => await storage.read())

  const change = async (fn: (value: T) => T): Promise<void> => {
    const previous = resource() ?? (await storage.read())
    const nextValue = fn(previous)
    await storage.write(nextValue)
    mutate(() => nextValue)
  }

  const subscriber = (value: T): void => {
    mutate(() => value)
  }

  onMount(() => storage.subscribe(subscriber))
  onCleanup(() => storage.unsubscribe(subscriber))

  return [resource, change]
}
