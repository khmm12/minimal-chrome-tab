import type { Subscriber } from './types'

export default class StorageSubscription<T> {
  protected subscribers = new Set<Subscriber<T>>()

  notify(value: T): void {
    this.subscribers.forEach((subscriber) => {
      // Isolate subscribers: a throwing listener is a consumer bug, and must not
      // stop the rest nor escape into the backend event handler it runs under
      // (chrome `onChanged` / the `storage` event).
      try {
        subscriber(value)
      } catch {
        // Intentionally swallowed — see above.
      }
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
