export type Subscriber<T> = (value: T) => void
export type Unsubscribe = () => void

export interface IStorageAdapter<T> {
  read: () => T | null | Promise<T | null>
  write: (value: T) => void | Promise<void>
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
  readonly loaded: boolean

  load: () => Promise<void>
  refresh: () => Promise<void>
}

export interface IDisposableStorage {
  dispose?: () => void
}

export interface ISubscribableStorage<T> {
  subscribe: (subscriber: Subscriber<T>) => Unsubscribe
  unsubscribe: (subscriber: Subscriber<T>) => void
}

export type IStorageAdapterConstructor<T> = new (name: string, subscriber: Subscriber<T | null>) => IStorageAdapter<T>
