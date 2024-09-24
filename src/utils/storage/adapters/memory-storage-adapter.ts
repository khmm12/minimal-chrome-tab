import type { IStorageAdapter, Subscriber, Unsubscribe } from '../types'

export default class MemoryStorageAdapter implements IStorageAdapter {
  protected value: unknown = null

  read(): unknown {
    return this.value
  }

  write(value: unknown): void {
    this.value = value
  }

  subscribe(_subscriber: Subscriber<unknown>): Unsubscribe {
    return () => {
      // Do nothing.
    }
  }

  unsubscribe(_subscriber: Subscriber<unknown>): void {
    // Do nothing.
  }
}
