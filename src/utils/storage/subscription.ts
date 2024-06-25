import type { Subscriber } from './types'

export default class StorageSubscription<T> {
  protected subscribers: Array<Subscriber<T>> = []

  notify(value: T): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(value)
    })
  }

  subscribe(subscriber: Subscriber<T>): void {
    this.subscribers.push(subscriber)
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    const index = this.subscribers.indexOf(subscriber)
    if (index >= 0) this.subscribers.splice(index, 1)
  }

  dispose(): void {
    this.subscribers.splice(0)
  }
}
