import ChromeStorageAdapter from './adapters/chrome-storage-adapter'
import LocalStorageAdapter from './adapters/local-starage-adapter'
import MemoryStorageAdapter from './adapters/memory-storage-adapter'
import type { IStorageAdapter, IStorageAdapterConstructor, Subscriber } from './types'

export default class Storage<T> {
  static getDefaultAdapter<T>(): IStorageAdapterConstructor<T> {
    if (import.meta.env.PROD || ChromeStorageAdapter.isAvailable) return ChromeStorageAdapter
    return LocalStorageAdapter.isAvailable ? LocalStorageAdapter : MemoryStorageAdapter
  }

  public readonly name: string
  public readonly defaultValue: T
  protected readonly adapter: IStorageAdapter<T>

  constructor(name: string, defaultValue: T)
  constructor(adapter: IStorageAdapterConstructor<T>, name: string, defaultValue: T)

  constructor(
    ...args: [name: string, defaultValue: T] | [adapter: IStorageAdapterConstructor<T>, name: string, defaultValue: T]
  ) {
    const [Adapter, name, defaultValue] = args.length === 3 ? args : [Storage.getDefaultAdapter<T>(), ...args]
    this.name = name
    this.defaultValue = defaultValue
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
