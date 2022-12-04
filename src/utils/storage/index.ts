import type { IStorageAdapter, IStorageAdapterConstructor, Subscriber } from './types'

export { getStorageAdapter as getLazyStorageAdapter } from './utils'

export default class Storage<T> {
  public readonly name: string
  public readonly defaultValue: T
  protected readonly adapter: IStorageAdapter<T>

  constructor(Adapter: IStorageAdapterConstructor<T>, name: string, defaultValue: T) {
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
