import { createEffect, createSignal, flush, untrack } from 'solid-js'
import { renderHook } from '@solidjs/testing-library'
import createSubscription from './createSubscription'

describe('createSubscription', () => {
  it('reads value on initialization', () => {
    let currentValue = 1

    renderHook(() => {
      const { value } = createContainer({
        getCurrentValue() {
          const v = currentValue
          currentValue += 1
          return v
        },
      })

      expect(untrack(value)).toBe(1)
    })
  })

  it('reads value on mount to avoid stale state', () => {
    let currentValue = 1

    const {
      result: { value },
    } = renderHook(() =>
      createContainer({
        getCurrentValue() {
          const v = currentValue
          currentValue += 1
          return v
        },
      }),
    )
    flush()

    expect(value()).toBe(2)
  })

  it('reads value on subscription event', () => {
    let currentValue = 1

    const {
      result: { value, trigger },
    } = renderHook(() =>
      createContainer({
        getCurrentValue: () => currentValue,
      }),
    )
    flush()

    trigger(() => {
      currentValue = 2
    })

    expect(value()).toBe(2)

    trigger(() => {
      currentValue = 3
    })

    expect(value()).toBe(3)
  })

  it("doesn't update value when identity function returns true", () => {
    let currentValue = 1
    const {
      result: { value, trigger },
    } = renderHook(() =>
      createContainer({
        getCurrentValue: () => currentValue,
        identity: () => true,
      }),
    )
    flush()

    const onUpdate = vi.fn<(v: number) => void>()
    renderHook(() => {
      createEffect(value, (nextValue) => {
        onUpdate(nextValue)
      })
    })

    trigger(() => {
      currentValue += 1
    })

    expect(value()).toBe(1)
    expect(onUpdate).toHaveBeenCalledTimes(1) // including mount
  })

  it('unsubscribes on unmount', () => {
    const { cleanup, result } = renderHook(() => createContainer())
    flush()

    cleanup()

    expect(result.unsubscribe).toHaveBeenCalled()
  })

  describe('when `deps` are changing', () => {
    it('updates value', () => {
      const {
        result: { setDep, value },
      } = renderHook(() => {
        const [dep, setDep] = createSignal(1)

        return {
          ...createContainer({
            deps: () => [dep()],
          }),
          setDep,
        }
      })
      flush()

      setDep(2)
      flush()
      expect(value()).toBe(2)

      setDep(3)
      flush()
      expect(value()).toBe(3)
    })

    it('resubscribes', () => {
      const {
        result: { setDep, subscribe, unsubscribe },
      } = renderHook(() => {
        const [dep, setDep] = createSignal(1)

        return {
          ...createContainer({
            deps: () => [dep()],
          }),
          setDep,
        }
      })
      flush()

      setDep(2)
      flush()

      expect(unsubscribe).toHaveBeenCalled()
      expect(subscribe).toHaveBeenCalledTimes(2)
    })
  })

  describe('when `subscribe` reads reactive values outside tracked deps', () => {
    it("doesn't update value", () => {
      const {
        result: { getCurrentValue, setDep },
      } = renderHook(() => {
        const [dep, setDep] = createSignal(1)

        return {
          ...createContainer({
            subscribe() {
              untrack(dep)
            },
          }),
          setDep,
        }
      })
      flush()

      setDep(2)
      flush()

      expect(getCurrentValue).toHaveBeenCalledTimes(2)
    })

    it("doesn't resubscribe", () => {
      const {
        result: { subscribe, unsubscribe, setDep },
      } = renderHook(() => {
        const [dep, setDep] = createSignal(1)

        return {
          ...createContainer({
            subscribe() {
              untrack(dep)
            },
          }),
          setDep,
        }
      })
      flush()

      setDep(2)
      flush()

      expect(unsubscribe).not.toHaveBeenCalled()
      expect(subscribe).toHaveBeenCalledTimes(1)
    })
  })
})

interface CreateContainerConfig {
  deps?: () => number[]
  getCurrentValue?: (deps: number[]) => number
  subscribe?: (fn: () => void, deps: number[]) => void
  identity?: (a: number, b: number) => boolean
}

function createContainer(config?: CreateContainerConfig) {
  const deps = vi.fn(config?.deps ?? (() => []))
  const getCurrentValue = vi.fn(config?.getCurrentValue ?? (([value]: number[]) => value ?? 1))

  const unsubscribe = vi.fn<() => void>()
  let update: () => void
  const subscribe = vi.fn((fn: () => void, deps: number[]): (() => void) => {
    config?.subscribe?.(fn, deps)
    update = fn
    return unsubscribe
  })

  const value = createSubscription({
    deps,
    getCurrentValue,
    subscribe,
    identity: config?.identity,
  })

  return {
    value,
    deps,
    getCurrentValue,
    subscribe,
    unsubscribe,
    trigger: (fn?: () => void) => {
      flush()
      fn?.()
      update()
      flush()
    },
  }
}
