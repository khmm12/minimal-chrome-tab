import type { JsonValue, Promisable } from 'type-fest'
import StorageSubscription from '../subscription'
import type { StorageAdapter, Subscriber, Unsubscribe } from '../types'

/**
 * Shared pub/sub plumbing for the storage adapters. Subclasses adapt their
 * backend's change semantics to the contract — `subscribe` sees every change —
 * by pushing into {@link subscription}; `read`/`write` are backend-specific.
 */
export default abstract class AbstractStorageAdapter implements StorageAdapter {
  protected readonly subscription = new StorageSubscription<JsonValue>()

  abstract read(): Promisable<JsonValue>
  abstract write(value: JsonValue): Promisable<void>

  subscribe(subscriber: Subscriber<JsonValue>): Unsubscribe {
    this.subscription.subscribe(subscriber)
    return () => {
      this.subscription.unsubscribe(subscriber)
    }
  }

  dispose(): void {
    this.subscription.dispose()
  }
}
