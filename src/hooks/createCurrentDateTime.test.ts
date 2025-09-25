import { createSignal } from 'solid-js'
import { renderHook } from '@solidjs/testing-library'
import { addMinutes, addSeconds, startOfMinute, startOfSecond } from 'date-fns'
import createCurrentDateTime, { EveryClockMinute, EveryClockSecond } from './createCurrentDateTime'
import useTabActive from './useTabActive'

vi.mock('./useTabActive')

beforeEach(() => {
  vi.useFakeTimers()
  vi.restoreAllMocks()
  vi.mocked(useTabActive).mockReturnValue(() => true)
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
})

describe('createCurrentDateTime', () => {
  it('returns current date time', () => {
    const { result: currentDateTime } = renderHook(() => createCurrentDateTime({ update: EveryClockSecond }))

    expect(currentDateTime()).toEqual(new Date())
  })

  it('pauses when browser tab is not active', () => {
    const {
      result: [currentDateTime, setIsActive],
    } = renderHook(() => {
      const {
        result: [isActive, setIsActive],
      } = renderHook(() => createSignal(true))

      vi.mocked(useTabActive).mockReturnValue(isActive)
      return [createCurrentDateTime({ update: EveryClockSecond }), setIsActive] as const
    })

    const initial = currentDateTime()

    setIsActive(false)
    vi.runOnlyPendingTimers()

    expect(currentDateTime()).toEqual(initial)

    setIsActive(true)
    vi.runOnlyPendingTimers()

    expect(currentDateTime()).not.to.equal(initial).but.to.equal(new Date())
  })

  describe('intervals', () => {
    it('can update every second', () => {
      const date = startOfSecond(new Date())
      vi.setSystemTime(date)
      const { result: currentDateTime } = renderHook(() => createCurrentDateTime({ update: EveryClockSecond }))

      vi.advanceTimersByTime(990)

      expect(currentDateTime()).toEqual(date)

      vi.advanceTimersByTime(10)

      expect(currentDateTime()).toEqual(addSeconds(date, 1))
    })

    it('can update every minute', () => {
      const date = startOfMinute(new Date())
      vi.setSystemTime(date)
      const { result: currentDateTime } = renderHook(() => createCurrentDateTime({ update: EveryClockMinute }))

      vi.advanceTimersByTime(1000 * 59)

      expect(currentDateTime()).toEqual(date)

      vi.advanceTimersByTime(1000)

      expect(currentDateTime()).toEqual(addMinutes(date, 1))
    })
  })
})
