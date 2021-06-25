import StorageAdapter from './storage-adapter'

const read = async (keys: string | Object | string[] | null): Promise<Record<string, any>> =>
  await new Promise((resolve) => chrome.storage.local.get(keys, (items) => resolve(items)))

const write = async (key: string, value: any): Promise<void> =>
  await new Promise((resolve) => chrome.storage.local.set({ [key]: value }, resolve))

export default class ChromeStorageAdapter<T> extends StorageAdapter<T> {
  static get isAvailable(): boolean {
    return typeof chrome.storage !== 'undefined'
  }

  constructor(name: string, defaultValue: T) {
    super(name, defaultValue)

    this.handleChanged = this.handleChanged.bind(this)
    chrome.storage.onChanged.addListener(this.handleChanged)
  }

  async read(): Promise<T> {
    const items = await read(this.name)
    return items[this.name] ?? this.defaultValue
  }

  async write(value: T): Promise<void> {
    await write(this.name, value)
    await super.write(value)
  }

  dispose(): void {
    chrome.storage.onChanged.removeListener(this.handleChanged)
    super.dispose()
  }

  protected handleChanged(changes: Partial<Record<string, chrome.storage.StorageChange>>): void {
    const change = changes[this.name]
    if (change != null) {
      const newValue = change.newValue ?? this.defaultValue
      this.subscription.notify(newValue)
    }
  }
}
