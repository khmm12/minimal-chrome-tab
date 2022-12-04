import type { IStorageAdapter, Subscriber } from '../types'

const read = async (key: string): Promise<Record<string, any>> =>
  await new Promise<Record<string, any>>((resolve) => chrome.storage.local.get(key, (items) => resolve(items[key])))

const write = async (key: string, value: any): Promise<void> =>
  await new Promise((resolve) => chrome.storage.local.set({ [key]: value }, resolve))

export default class ChromeStorageAdapter<T> implements IStorageAdapter<T> {
  constructor(protected readonly name: string, protected readonly subscriber: Subscriber<T | null>) {
    this.handleChanged = this.handleChanged.bind(this)
    chrome.storage.onChanged.addListener(this.handleChanged)
  }

  async read(): Promise<T | null> {
    return this.parse(await read(this.name))
  }

  async write(value: T): Promise<void> {
    await write(this.name, value)
  }

  dispose(): void {
    chrome.storage.onChanged.removeListener(this.handleChanged)
  }

  protected parse(val: any): T | null {
    return (val as T | null) ?? null
  }

  protected handleChanged(changes: Partial<Record<string, chrome.storage.StorageChange>>): void {
    const change = changes[this.name]
    if (change != null) this.subscriber(this.parse(change.newValue))
  }
}
