import { flush } from 'solid-js'
import { renderHook } from '@solidjs/testing-library'
import createPolled, { type PolledStrategy } from './createPolled'

const DELAY = 1000

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
})

describe('createPolled', () => {
  it('never ticks when disabled', () => {
    vi.setSystemTime(0)
    const onTick = vi.fn<() => void>()

    renderHook(() => {
      createPolled({ enabled: false, every: fixedDelayStrategy(DELAY), onTick })
    })
    flush()

    vi.advanceTimersByTime(DELAY * 5)

    expect(onTick).not.toHaveBeenCalled()
  })

  it('ticks after the delay and reschedules itself', () => {
    vi.setSystemTime(0)
    const onTick = vi.fn<() => void>()

    renderHook(() => {
      createPolled({ enabled: true, every: fixedDelayStrategy(DELAY), onTick })
    })
    flush()

    expect(onTick).not.toHaveBeenCalled()

    vi.advanceTimersByTime(DELAY)

    expect(onTick).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(DELAY)

    expect(onTick).toHaveBeenCalledTimes(2)
  })

  it('ticks immediately via a microtask when the scheduled time is not in the future', async () => {
    const onTick = vi.fn<() => void>()

    renderHook(() => {
      createPolled({ enabled: true, every: immediateThenIdleStrategy(), onTick })
    })
    flush()

    // Immediate schedules through queueMicrotask, not synchronously.
    expect(onTick).not.toHaveBeenCalled()

    await Promise.resolve()

    expect(onTick).toHaveBeenCalledTimes(1)
  })

  it('stops ticking after disposal', () => {
    vi.setSystemTime(0)
    const onTick = vi.fn<() => void>()

    const { cleanup } = renderHook(() => {
      createPolled({ enabled: true, every: fixedDelayStrategy(DELAY), onTick })
    })
    flush()

    vi.advanceTimersByTime(DELAY)

    expect(onTick).toHaveBeenCalledTimes(1)

    // A follow-up tick is already scheduled via setTimeout; disposal must clear it.
    cleanup()

    vi.advanceTimersByTime(DELAY * 5)

    expect(onTick).toHaveBeenCalledTimes(1)
  })
})

// Deterministic strategy: schedules `delay` ms in the future relative to the
// last tick, with now() tracking the (fake) clock. Advancing fake timers by
// `delay` reaches the scheduled time exactly.
function fixedDelayStrategy(delay: number): PolledStrategy {
  return {
    now: (): number => Date.now(),
    scheduledAt: (relative: number): number => relative + delay,
  }
}

// Deterministic strategy: first schedule resolves to `delay <= 0` (immediate,
// queued via microtask), every later schedule resolves far in the future so the
// self-reschedule lands on a setTimeout that never fires (timers are not
// advanced). This exercises the immediate branch exactly once, without an
// unbounded microtask loop.
function immediateThenIdleStrategy(): PolledStrategy {
  const at = 1000
  let firstSchedule = true
  return {
    now: (): number => at,
    scheduledAt: (): number => {
      if (firstSchedule) {
        firstSchedule = false
        return at // delay = at - now() = 0 -> queueMicrotask(tick)
      }
      return at + 60_000 // delay > 0 -> setTimeout(tick), never advanced
    },
  }
}
