import type { Accessor } from 'solid-js'

export function unwrap<T>(mayBeSingnal: Accessor<T> | Exclude<T, Function>): T {
  // @ts-expect-error
  return typeof mayBeSingnal === 'function' ? mayBeSingnal() : mayBeSingnal
}
