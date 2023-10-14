import getPackageName from '@/utils/get-package-name'
import type { IStorageAdapter, Subscriber } from '../types'

export default class LocalStorageAdapter<T> implements IStorageAdapter<T> {
  constructor(
    protected readonly name: string,
    protected readonly subscriber: Subscriber<T | null>,
  ) {
    this.handleChanged = this.handleChanged.bind(this)
    window.addEventListener('storage', this.handleChanged)
  }

  read(): T | null {
    return this.parse(localStorage.getItem(this.storageKey))
  }

  write(value: T): void {
    localStorage.setItem(this.storageKey, this.serialize(value))
  }

  dispose(): void {
    window.removeEventListener('storage', this.handleChanged)
  }

  protected get storageKey(): string {
    return `${getPackageName()}:${this.name}`
  }

  protected parse(val: any): T | null {
    try {
      return (JSON.parse(val) as T | null) ?? null
    } catch {
      return null
    }
  }

  protected serialize(value: T): string {
    return JSON.stringify(value)
  }

  protected handleChanged(e: StorageEvent): void {
    if (e.key === this.storageKey) this.subscriber(this.parse(e.newValue))
  }
}
