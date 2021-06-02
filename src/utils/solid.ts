export type SignalValue<T> = () => T

export function unwrap<T>(mayBeSingnal: SignalValue<T> | Exclude<T, Function>): T {
  // @ts-expect-error
  return typeof mayBeSingnal === 'function' ? mayBeSingnal() : mayBeSingnal
}
