export type Subscriber<T> = (value: T) => void
export type Unsubscribe = () => void

type Promisable<T> = T | Promise<T>

export interface IStorageAdapter extends ISubscribable<unknown> {
  read: () => Promisable<unknown>
  write: (value: unknown) => Promisable<void>
  dispose?: () => void
}

export interface IStorage<T>
  extends IWritableStorage<T>,
    IMemorableStorage<T>,
    ISubscribableStorage<T>,
    IDisposableStorage {}

export interface IWritableStorage<T> {
  read: () => Promise<T>
  write: (value: T) => Promise<void>
}

export interface IMemorableStorage<T> {
  readonly value: T
  refresh: () => Promise<void>
}

export interface IDisposableStorage {
  dispose?: () => void
}

export interface ISubscribableStorage<T> extends ISubscribable<T> {}

export interface ISerializer<T> {
  deserialize: (value: unknown) => T
  serialize: (value: T) => unknown
}

interface ISubscribable<T> {
  subscribe: (subscriber: Subscriber<T>) => Unsubscribe
  unsubscribe: (subscriber: Subscriber<T>) => void
}
