import { renderHook } from '@solidjs/testing-library'

export * from '@solidjs/testing-library'

export function withRoot<T>(fn: () => T): [value: T, dispose: () => void] {
  const a = renderHook(fn)
  return [a.result, a.cleanup]
}
