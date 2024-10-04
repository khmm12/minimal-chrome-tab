import type { ISerializer, IStorage, IStorageAdapter, Subscriber, Unsubscribe } from './types'

type DeferredValue<T> = { value: T; loaded: true } | { loaded: false }

// Extracts subscription to a separate chunk.
// Fixes the issue with circular chunks caused by top-level await.
const { default: Subscription } = await import('./subscription')

export default class Storage<T> implements IStorage<T> {
  static async create<T>(adapter: IStorageAdapter, serializer: ISerializer<T>): Promise<Storage<T>> {
    const storage = new Storage<T>(adapter, serializer)
    await storage.init()
    return storage
  }

  protected readonly adapter: IStorageAdapter
  protected readonly serializer: ISerializer<T>
  protected readonly subscription = new Subscription<T>()

  protected currentValue: DeferredValue<T> = { loaded: false }

  protected constructor(adapter: IStorageAdapter, serializer: ISerializer<T>) {
    this.adapter = adapter
    this.serializer = serializer

    if (import.meta.env.TEST) {
      afterEach(async () => {
        await this.refresh()
      })
    }
  }

  protected async init(): Promise<void> {
    if (!this.currentValue.loaded) {
      this.adapter.subscribe(this.handleChanged.bind(this))
      await this.refresh()
    }
  }

  get loaded(): boolean {
    return this.currentValue.loaded
  }

  async refresh(): Promise<void> {
    this.value = this.serializer.deserialize(await this.adapter.read())
  }

  async read(): Promise<T> {
    await this.refresh()
    return this.value
  }

  async write(value: T): Promise<void> {
    await this.adapter.write(this.serializer.serialize(value))
    this.value = value
  }

  get value(): T {
    if (!this.currentValue.loaded) throw new Error('Storage is not loaded. Please call `init` method first.')
    return this.currentValue.value
  }

  protected set value(nextValue: T) {
    if (this.currentValue.loaded) {
      this.currentValue.value = nextValue
      this.subscription.notify(nextValue)
    } else {
      this.currentValue = { value: nextValue, loaded: true }
    }
  }

  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    this.subscription.subscribe(subscriber)
    return () => {
      this.subscription.unsubscribe(subscriber)
    }
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    this.subscription.unsubscribe(subscriber)
  }

  dispose(): void {
    this.adapter.dispose?.()
    this.subscription.dispose()
  }

  protected handleChanged(nextValue: unknown): void {
    this.value = this.serializer.deserialize(nextValue)
  }
}
