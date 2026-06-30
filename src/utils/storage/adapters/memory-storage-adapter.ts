import type { JsonValue } from 'type-fest'
import AbstractStorageAdapter from './abstract-storage-adapter'

export default class MemoryStorageAdapter extends AbstractStorageAdapter {
  protected value: JsonValue = null

  read(): JsonValue {
    return this.value
  }

  write(value: JsonValue): void {
    this.value = value
    this.subscription.notify(value)
  }
}
