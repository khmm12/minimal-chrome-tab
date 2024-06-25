import StorageSubscription from '../subscription'
import type { IStorageAdapter, Subscriber, Unsubscribe } from '../types'

const read = async (key: string): Promise<Record<string, any>> => {
  const items = await chrome.storage.local.get(key)
  return items[key]
}

const write = async (key: string, value: any): Promise<void> => {
  await chrome.storage.local.set({ [key]: value })
}

export default class ChromeStorageAdapter implements IStorageAdapter {
  protected subscription = new StorageSubscription<unknown>()

  readonly #listener = (changes: Partial<Record<string, chrome.storage.StorageChange>>): void => {
    this.handleChanged(changes)
  }

  constructor(protected readonly name: string) {
    chrome.storage.onChanged.addListener(this.#listener)
  }

  async read(): Promise<unknown> {
    return this.parse(await read(this.name))
  }

  async write(value: unknown): Promise<void> {
    await write(this.name, value)
  }

  dispose(): void {
    chrome.storage.onChanged.removeListener(this.#listener)
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

  protected parse(val: unknown): unknown {
    return val ?? null
  }

  protected handleChanged(changes: Partial<Record<string, chrome.storage.StorageChange>>): void {
    const change = changes[this.name]
    if (change != null) this.subscription.notify(this.parse(change.newValue))
  }
}
