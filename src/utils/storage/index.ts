import ChromeStorageAdapter from './adapters/chrome-storage-adapter'
import LocalStorageAdapter from './adapters/local-starage-adapter'
import MemoryStorageAdapter from './adapters/memory-storage-adapter'
import type { IStorageAdapter, IStorageAdapterConstructor, Subscriber } from './types'

export default class Storage<T> {
  protected readonly adapter: IStorageAdapter<T>

  constructor(public readonly name: string, public readonly defaultValue: T) {
    const Adapter = findAdapter<T>()
    this.adapter = new Adapter(name, defaultValue)
  }

  async read(): Promise<T> {
    return await this.adapter.read()
  }

  async write(value: T): Promise<void> {
    await this.adapter.write(value)
  }

  subscribe(subscriber: Subscriber<T>): void {
    this.adapter.subscribe(subscriber)
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    this.adapter.unsubscribe(subscriber)
  }

  dispose(): void {
    this.adapter.dispose()
  }
}

function findAdapter<T>(): IStorageAdapterConstructor<T> {
  if (import.meta.env.PROD || ChromeStorageAdapter.isAvailable) return ChromeStorageAdapter
  return LocalStorageAdapter.isAvailable ? LocalStorageAdapter : MemoryStorageAdapter
}
