import StorageSubscribtion from '../subscription'
import type { Subscriber } from '../types'

export default abstract class StorageAdapter<T> {
  protected readonly subscription: StorageSubscribtion<T> = new StorageSubscribtion()

  constructor(public readonly name: string, public readonly defaultValue: T) {}

  abstract read(): Promise<T>

  async write(value: T): Promise<void> {
    this.subscription.notify(value)
  }

  subscribe(subscriber: Subscriber<T>): void {
    this.subscription.subscribe(subscriber)
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    this.subscription.unsubscribe(subscriber)
  }

  dispose(): void {
    this.subscription.dispose()
  }
}
