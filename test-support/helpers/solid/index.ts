import { renderHook } from '@solidjs/testing-library'

// eslint-disable-next-line import/export -- eslint-plugin-import doesn't support eslint flat config yet
export * from '@solidjs/testing-library'

export function withRoot<T>(fn: () => T): [value: T, dispose: () => void] {
  const a = renderHook(fn)
  return [a.result, a.cleanup]
}
