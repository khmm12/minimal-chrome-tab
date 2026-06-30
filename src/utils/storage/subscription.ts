import type { Subscriber } from './types'

export default class StorageSubscription<T> {
  protected subscribers = new Set<Subscriber<T>>()

  notify(value: T): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(value)
    })
  }

  subscribe(subscriber: Subscriber<T>): void {
    this.subscribers.add(subscriber)
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    this.subscribers.delete(subscriber)
  }

  dispose(): void {
    this.subscribers.clear()
  }
}
