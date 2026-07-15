import { flush } from 'solid-js'
import { fireEvent, renderHook } from '@solidjs/testing-library'
import type { MockInstance } from 'vitest'
import createMountEffect from './createMountEffect'

interface RafController {
  raf: MockInstance<typeof window.requestAnimationFrame>
  cancel: MockInstance<typeof window.cancelAnimationFrame>
  flushFrame: () => void
}

let rafController: RafController

function installRaf(): RafController {
  let queue: Array<{ id: number; cb: FrameRequestCallback }> = []
  let nextId = 0

  const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback): number => {
    nextId += 1
    queue.push({ id: nextId, cb })
    return nextId
  })

  const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number): void => {
    queue = queue.filter((entry) => entry.id !== id)
  })

  const flushFrame = (): void => {
    const pending = queue
    queue = []
    for (const { cb } of pending) cb(performance.now())
  }

  return { raf, cancel, flushFrame }
}

function appendApp(): HTMLDivElement {
  const $app = document.createElement('div')
  $app.id = 'app'
  document.body.appendChild($app)
  return $app
}

beforeEach(() => {
  rafController = installRaf()
})

afterEach(() => {
  document.querySelector('#app')?.remove()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('createMountEffect', () => {
  it('fades in on the next frame and tears down on transitionend', () => {
    const $app = appendApp()

    renderHook(() => {
      createMountEffect()
    })
    flush()

    // A single frame is scheduled and nothing is applied before it runs.
    expect(rafController.raf).toHaveBeenCalledTimes(1)
    expect($app.style.opacity).toBe('')
    expect($app.style.transition).toBe('')

    rafController.flushFrame()

    expect($app.style.opacity).toBe('1')
    expect($app.style.transition).toBe('opacity 0.1s ease-out')

    // transitionend triggers teardown, which clears the inline styles on the next frame.
    fireEvent($app, new Event('transitionend'))
    rafController.flushFrame()

    expect($app.style.transition).toBe('')
    expect($app.style.opacity).toBe('')
  })

  it('resets opacity without a transition when TransitionEvent is unavailable', () => {
    vi.stubGlobal('TransitionEvent', undefined)
    const $app = appendApp()
    $app.style.opacity = '0'

    renderHook(() => {
      createMountEffect()
    })
    flush()

    expect(rafController.raf).toHaveBeenCalledTimes(1)

    rafController.flushFrame()

    expect($app.style.opacity).toBe('')
    expect($app.style.transition).toBe('')

    // No transitionend listener is attached in the fallback path.
    fireEvent($app, new Event('transitionend'))
    expect(rafController.raf).toHaveBeenCalledTimes(1)
  })

  it('does nothing when there is no #app element', () => {
    expect(() => {
      renderHook(() => {
        createMountEffect()
      })
      flush()
    }).not.toThrow()

    expect(rafController.raf).not.toHaveBeenCalled()
  })

  it('cancels the pending frame and detaches listeners on disposal', () => {
    const $app = appendApp()

    const { cleanup } = renderHook(() => {
      createMountEffect()
    })
    flush()

    expect(rafController.raf).toHaveBeenCalledTimes(1)

    cleanup()

    // The queued fade-in frame is cancelled exactly once during disposal.
    expect(rafController.cancel).toHaveBeenCalledTimes(1)

    // The start frame plus the teardown's cleanup frame have been requested.
    expect(rafController.raf).toHaveBeenCalledTimes(2)

    // Listeners were detached: a late transitionend no longer schedules any frame.
    fireEvent($app, new Event('transitionend'))
    expect(rafController.raf).toHaveBeenCalledTimes(2)
  })
})
