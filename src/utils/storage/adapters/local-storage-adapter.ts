import getPackageName from '@/utils/get-package-name'
import StorageSubscription from '../subscription'
import type { IStorageAdapter, Subscriber, Unsubscribe } from '../types'

export default class LocalStorageAdapter implements IStorageAdapter {
  protected subscription = new StorageSubscription<unknown>()

  readonly #listener = (e: StorageEvent): void => {
    this.handleChanged(e)
  }

  constructor(protected readonly name: string) {
    window.addEventListener('storage', this.#listener)
  }

  read(): unknown {
    return this.parse(localStorage.getItem(this.storageKey))
  }

  write(value: unknown): void {
    localStorage.setItem(this.storageKey, this.serialize(value))
  }

  dispose(): void {
    window.removeEventListener('storage', this.#listener)
    this.subscription.dispose()
  }

  subscribe(subscriber: Subscriber<unknown>): Unsubscribe {
    this.subscription.subscribe(subscriber)
    return () => {
      this.unsubscribe(subscriber)
    }
  }

  unsubscribe(subscriber: Subscriber<unknown>): void {
    this.subscription.unsubscribe(subscriber)
  }

  protected get storageKey(): string {
    return `${getPackageName()}:${this.name}`
  }

  protected parse(val: unknown): unknown {
    if (typeof val !== 'string') return null

    try {
      return JSON.parse(val) ?? null
    } catch {
      return null
    }
  }

  protected serialize(value: unknown): string {
    return JSON.stringify(value)
  }

  protected handleChanged(e: StorageEvent): void {
    if (e.key === this.storageKey) this.subscription.notify(this.parse(e.newValue))
  }
}
