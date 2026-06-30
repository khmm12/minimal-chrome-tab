import type { JsonValue } from 'type-fest'
import getPackageName from '@/utils/get-package-name'
import AbstractStorageAdapter from './abstract-storage-adapter'

export default class LocalStorageAdapter extends AbstractStorageAdapter {
  readonly #listener = (e: StorageEvent): void => {
    this.handleChanged(e)
  }

  constructor(protected readonly name: string) {
    super()
    window.addEventListener('storage', this.#listener)
  }

  read(): JsonValue {
    return this.parse(localStorage.getItem(this.storageKey))
  }

  write(value: JsonValue): void {
    localStorage.setItem(this.storageKey, this.serialize(value))
    // `storage` events fire in *other* tabs only — echo own writes here.
    this.subscription.notify(value)
  }

  override dispose(): void {
    window.removeEventListener('storage', this.#listener)
    super.dispose()
  }

  protected get storageKey(): string {
    return `${getPackageName()}:${this.name}`
  }

  protected parse(val: string | null): JsonValue {
    if (typeof val !== 'string') return null

    try {
      return (JSON.parse(val) as JsonValue) ?? null
    } catch {
      return null
    }
  }

  protected serialize(value: JsonValue): string {
    return JSON.stringify(value)
  }

  protected handleChanged(e: StorageEvent): void {
    if (e.key === this.storageKey) this.subscription.notify(this.parse(e.newValue))
  }
}
