import type { IStorageAdapter, Subscriber } from '../types'

const read = async (key: string): Promise<Record<string, any>> => {
  const items = await chrome.storage.local.get(key)
  return items[key]
}

const write = async (key: string, value: any): Promise<void> => {
  await chrome.storage.local.set({ [key]: value })
}

export default class ChromeStorageAdapter<T> implements IStorageAdapter<T> {
  readonly #listener = (changes: Partial<Record<string, chrome.storage.StorageChange>>): void => {
    this.handleChanged(changes)
  }

  constructor(
    protected readonly name: string,
    protected readonly subscriber: Subscriber<T | null>,
  ) {
    chrome.storage.onChanged.addListener(this.#listener)
  }

  async read(): Promise<T | null> {
    return this.parse(await read(this.name))
  }

  async write(value: T): Promise<void> {
    await write(this.name, value)
  }

  dispose(): void {
    chrome.storage.onChanged.removeListener(this.#listener)
  }

  protected parse(val: any): T | null {
    return (val as T | null) ?? null
  }

  protected handleChanged(changes: Partial<Record<string, chrome.storage.StorageChange>>): void {
    const change = changes[this.name]
    if (change != null) this.subscriber(this.parse(change.newValue))
  }
}
