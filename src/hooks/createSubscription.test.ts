import { createEffect, createSignal } from 'solid-js'
import { renderHook, withRoot } from '@test/helpers/solid'
import createSubscription from './createSubscription'

describe('createSubscription', () => {
  it('reads value on initialization', () => {
    let currentValue = 1

    renderHook(() => {
      const { value } = createContainer({ getCurrentValue: () => currentValue++ })

      expect(value()).toBe(1)
    })
  })

  it('reads value on mount to avoid stale state', () => {
    let currentValue = 1

    const { value } = renderHook(() => createContainer({ getCurrentValue: () => currentValue++ }))

    expect(value()).toBe(2)
  })

  it('reads value on subscription event', () => {
    let currentValue = 1

    const { value, trigger } = renderHook(() =>
      createContainer({
        getCurrentValue: () => currentValue,
      })
    )

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
    const { value, trigger } = renderHook(() =>
      createContainer({
        getCurrentValue: () => currentValue,
        identity: () => true,
      })
    )

    const onUpdate = vi.fn()
    withRoot(() => createEffect(() => onUpdate(value())))

    trigger(() => {
      currentValue += 1
    })

    expect(value()).toBe(1)
    expect(onUpdate).toBeCalledTimes(1) // including mount
  })

  it('unsubscribes on unmount', () => {
    const [{ unsubscribe }, dispose] = withRoot(() => createContainer())

    dispose()

    expect(unsubscribe).toBeCalled()
  })

  describe('when `getCurrentValue` is changing', () => {
    it('updates value', () => {
      const [dep, setDep] = renderHook(() => createSignal(1))
      const { getCurrentValue } = renderHook(() =>
        createContainer({
          getCurrentValue: () => dep(),
        })
      )

      setDep(2)
      setDep(3)

      expect(getCurrentValue).toBeCalledTimes(4)
    })

    it("doesn't resubscribe", () => {
      const [dep, setDep] = renderHook(() => createSignal(1))
      const { subscribe } = renderHook(() =>
        createContainer({
          getCurrentValue: () => dep(),
        })
      )

      setDep(2)

      expect(subscribe).toBeCalledTimes(1)
    })
  })

  describe('when `subscription` is changing', () => {
    it("doesn't update value", () => {
      const [dep, setDep] = renderHook(() => createSignal(1))
      const { getCurrentValue } = renderHook(() =>
        createContainer({
          subscribe() {
            dep()
          },
        })
      )

      setDep(2)

      expect(getCurrentValue).toBeCalledTimes(2)
    })

    it('resubscribes', () => {
      const [dep, setDep] = renderHook(() => createSignal(1))
      const { subscribe, unsubscribe } = renderHook(() =>
        createContainer({
          subscribe() {
            dep()
          },
        })
      )

      setDep(2)

      expect(unsubscribe).toBeCalled()
      expect(subscribe).toBeCalledTimes(2)
    })
  })
})

interface CreateContainerConfig {
  getCurrentValue?: () => number
  subscribe?: (fn: () => void) => void
  identity?: (a: number, b: number) => boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createContainer(config?: CreateContainerConfig) {
  const getCurrentValue = vi.fn().mockImplementation(config?.getCurrentValue ?? (() => 1))

  const unsubscribe = vi.fn()
  let update: () => void
  const subscribe = vi.fn().mockImplementation((fn) => {
    config?.subscribe?.(fn)
    update = fn
    return unsubscribe
  })

  const value = createSubscription({
    getCurrentValue,
    subscribe,
    identity: config?.identity,
  })

  return {
    value,
    getCurrentValue,
    subscribe,
    unsubscribe,
    trigger: (fn?: () => void) => {
      fn?.()
      update()
    },
  }
}
