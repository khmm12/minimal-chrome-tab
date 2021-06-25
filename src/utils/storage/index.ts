import type StorageAdapter from './adapters/storage-adapter'
import ChromeStorageAdapter from './adapters/chrome-storage-adapter'
import LocalStorageAdapter from './adapters/local-starage-adapter'
import MemoryStorageAdapter from './adapters/memory-storage-adapter'
import type { Subscriber } from './types'

const getAdapterClass = (): typeof ChromeStorageAdapter | typeof LocalStorageAdapter | typeof MemoryStorageAdapter =>
  import.meta.env.PROD || ChromeStorageAdapter.isAvailable
    ? ChromeStorageAdapter
    : LocalStorageAdapter.isAvailable
    ? LocalStorageAdapter
    : MemoryStorageAdapter

export default class Storage<T> {
  protected readonly adapter: StorageAdapter<T>

  constructor(public readonly name: string, public readonly defaultValue: T) {
    const Adapter = getAdapterClass()
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
