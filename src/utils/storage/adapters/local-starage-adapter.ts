import { name as PackageName } from '@/../package.json'
import StorageAdapter from './storage-adapter'

export default class LocalStorageAdapter<T> extends StorageAdapter<T> {
  constructor(name: string, defaultValue: T) {
    super(name, defaultValue)

    this.handleChanged = this.handleChanged.bind(this)
    window.addEventListener('storage', this.handleChanged)
  }

  async read(): Promise<T> {
    return this.parse(localStorage.getItem(this.storageKey))
  }

  async write(value: T): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(value))
    await super.write(value)
  }

  dispose(): void {
    window.removeEventListener('storage', this.handleChanged)
    super.dispose()
  }

  protected get storageKey(): string {
    return `${PackageName}:${this.name}`
  }

  protected parse(val: any): T {
    try {
      return JSON.parse(val) ?? this.defaultValue
    } catch {
      return this.defaultValue
    }
  }

  protected handleChanged(e: StorageEvent): void {
    if (e.key !== this.storageKey) return
    this.subscription.notify(this.parse(e.newValue))
  }
}
