import { createRoot } from 'solid-js'

type Disposal = () => void

const disposals = new Set<Disposal>()

afterEach(() => cleanup())

export function renderHook<T>(fn: () => T): T {
  return withRoot(fn)[0]
}

export function withRoot<T>(fn: () => T): [value: T, dispose: () => void] {
  let disposal: () => void

  const value = createRoot((dispose) => {
    disposal = dispose
    disposals.add(dispose)
    return fn()
  })

  const dispose = (): void => {
    disposal()
    disposals.delete(disposal)
  }

  return [value, dispose]
}

export function cleanup(): void {
  for (const dispose of disposals) dispose()
  disposals.clear()
}
