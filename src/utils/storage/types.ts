export type Subscriber<T> = (value: T) => void

export interface IStorageAdapter<T> {
  read: () => Promise<T>
  write: (value: T) => Promise<void>
  dispose: () => void
  subscribe: (subscriber: Subscriber<T>) => void
  unsubscribe: (subscriber: Subscriber<T>) => void
}

export type IStorageAdapterConstructor<T> = new (name: string, defaultValue: T) => IStorageAdapter<T>
