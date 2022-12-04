import StorageSubscribtion from './subscription'
import type { IStorage, IStorageAdapter, IStorageAdapterConstructor, Subscriber, Unsubscribe } from './types'

export default class Storage<T> implements IStorage<T> {
  protected readonly adapter: IStorageAdapter<T>
  protected readonly subscription = new StorageSubscribtion<T>()

  public readonly name: string
  public readonly defaultValue: T

  protected isLoaded = false
  protected currentValue: T

  constructor(Adapter: IStorageAdapterConstructor<T>, name: string, defaultValue: T) {
    this.name = name
    this.defaultValue = defaultValue
    this.currentValue = defaultValue
    this.adapter = new Adapter(name, (value) => this.handleChanged(value))

    if (import.meta.env.TEST) {
      afterEach(async () => await this.refresh())
    }
  }

  get loaded(): boolean {
    return this.isLoaded
  }

  async load(): Promise<void> {
    if (this.isLoaded) return
    await this.refresh()
    this.isLoaded = true
  }

  async refresh(): Promise<void> {
    this.value = (await this.adapter.read()) ?? this.defaultValue
  }

  async read(): Promise<T> {
    await this.load()
    return this.value
  }

  async write(value: T): Promise<void> {
    await this.adapter.write(value)
    this.value = value
  }

  get value(): T {
    return this.currentValue
  }

  protected set value(nextValue: T) {
    this.currentValue = nextValue
    this.subscription.notify(nextValue)
  }

  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    this.subscription.subscribe(subscriber)
    return () => this.subscription.unsubscribe(subscriber)
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    this.subscription.unsubscribe(subscriber)
  }

  dispose(): void {
    this.adapter.dispose?.()
    this.subscription.dispose()
  }

  protected handleChanged(nextValue: T | null): void {
    this.value = nextValue ?? this.defaultValue
  }
}
