import { type Accessor, createSignal, onSettled } from 'solid-js'
import type { IDisposableStorage, IMemorableStorage, ISubscribableStorage, IWritableStorage } from '@/utils/storage'

type Storage<T> = IWritableStorage<T> & IMemorableStorage<T> & ISubscribableStorage<T> & IDisposableStorage
type Mutator<T> = (previousState: T) => T
type Set<T> = (value: T | Mutator<T>) => Promise<void>

export type StorageReturn<T> = [value: Accessor<T>, set: Set<T>]

export default function createStorage<T>(storage: Storage<T>): StorageReturn<T> {
  const [value, setValue] = createSignal<T>((prev) => prev ?? storage.value)

  const set: Set<T> = async (v: Mutator<T> | T) => {
    const mutator = typeof v === 'function' ? (v as Mutator<T>) : ((() => v) as Mutator<T>)
    const nextValue = mutator(value())
    await storage.write(nextValue)
    setValue(() => nextValue)
  }

  onSettled(() => {
    const unsubscribe = storage.subscribe((nextValue) => {
      setValue(() => nextValue)
    })

    return unsubscribe
  })

  return [value, set]
}
