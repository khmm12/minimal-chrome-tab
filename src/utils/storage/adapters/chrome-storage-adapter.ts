import type { JsonValue } from 'type-fest'
import AbstractStorageAdapter from './abstract-storage-adapter'

const read = async (key: string): Promise<JsonValue> => {
  const items = await chrome.storage.local.get(key)
  return (items[key] as JsonValue | undefined) ?? null
}

const write = async (key: string, value: JsonValue): Promise<void> => {
  await chrome.storage.local.set({ [key]: value })
}

export default class ChromeStorageAdapter extends AbstractStorageAdapter {
  readonly #listener = (changes: Partial<Record<string, chrome.storage.StorageChange>>): void => {
    this.handleChanged(changes)
  }

  constructor(protected readonly name: string) {
    super()
    // `onChanged` echoes own writes in the same tab, so a subscription is enough.
    chrome.storage.onChanged.addListener(this.#listener)
  }

  async read(): Promise<JsonValue> {
    return this.parse(await read(this.name))
  }

  async write(value: JsonValue): Promise<void> {
    await write(this.name, value)
  }

  override dispose(): void {
    chrome.storage.onChanged.removeListener(this.#listener)
    super.dispose()
  }

  protected parse(val: JsonValue | undefined): JsonValue {
    return val ?? null
  }

  protected handleChanged(changes: Partial<Record<string, chrome.storage.StorageChange>>): void {
    const change: chrome.storage.StorageChange | undefined = changes[this.name]
    if (change != null) this.subscription.notify(this.parse(change.newValue as JsonValue | undefined))
  }
}
