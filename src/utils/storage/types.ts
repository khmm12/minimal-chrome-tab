import type { JsonValue, Promisable } from 'type-fest'

export type Subscriber<T> = (value: T) => void
export type Unsubscribe = () => void

/** Backend binding (chrome / localStorage / memory). Operates on JSON wire values. */
export interface StorageAdapter {
  read: () => Promisable<JsonValue>
  write: (value: JsonValue) => Promisable<void>
  /** Notifies on every change — own writes and external ones, normalized per backend. */
  subscribe: (subscriber: Subscriber<JsonValue>) => Unsubscribe
  dispose?: () => void
}

/** The validation/serialization seam: `JsonValue → T` on the way in, `T → JsonValue` out. */
export interface Serializer<T> {
  deserialize: (value: JsonValue) => T
  serialize: (value: T) => JsonValue
}

/** Generic, async, stateless conduit over a {@link StorageAdapter}. */
export interface Storage<T> {
  read: () => Promise<T>
  write: (value: T) => Promise<void>
  subscribe: (subscriber: Subscriber<T>) => Unsubscribe
  dispose: () => void
}
