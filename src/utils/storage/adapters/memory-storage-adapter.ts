import type { IStorageAdapter } from '../types'

export default class MemoryStorageAdapter<T> implements IStorageAdapter<T> {
  protected value: T | null = null

  read(): T | null {
    return this.value
  }

  write(value: T): void {
    this.value = value
  }
}
