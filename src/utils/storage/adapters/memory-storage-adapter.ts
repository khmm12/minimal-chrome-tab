import StorageAdapter from './storage-adapter'

export default class MemoryStorageAdapter<T> extends StorageAdapter<T> {
  protected value: T

  constructor(name: string, defaultValue: T) {
    super(name, defaultValue)
    this.value = defaultValue
  }

  async read(): Promise<T> {
    return this.value
  }

  async write(value: T): Promise<void> {
    this.value = value
    await super.write(value)
  }
}
