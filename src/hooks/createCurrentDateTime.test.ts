import { createSignal } from 'solid-js'
import { addMinutes, addSeconds, startOfMinute, startOfSecond } from 'date-fns'
import { renderHook } from '@test/helpers/solid'
import createCurrentDateTime, { EveryMinute, EverySecond } from './createCurrentDateTime'
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
    const currentDateTime = renderHook(() => createCurrentDateTime({ update: EverySecond })).result

    expect(currentDateTime()).toEqual(new Date())
  })

  it('pauses when browser tab is not active', () => {
    const [currentDateTime, setIsActive] = renderHook(() => {
      const [isActive, setIsActive] = renderHook(() => createSignal(true)).result

      vi.mocked(useTabActive).mockReturnValue(isActive)
      return [createCurrentDateTime({ update: EverySecond }), setIsActive] as const
    }).result

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
      const currentDateTime = renderHook(() => createCurrentDateTime({ update: EverySecond })).result

      vi.advanceTimersByTime(990)

      expect(currentDateTime()).toEqual(date)

      vi.advanceTimersByTime(10)

      expect(currentDateTime()).toEqual(addSeconds(date, 1))
    })

    it('can update every minute', () => {
      const date = startOfMinute(new Date())
      vi.setSystemTime(date)
      const currentDateTime = renderHook(() => createCurrentDateTime({ update: EveryMinute })).result

      vi.advanceTimersByTime(1000 * 59)

      expect(currentDateTime()).toEqual(date)

      vi.advanceTimersByTime(1000)

      expect(currentDateTime()).toEqual(addMinutes(date, 1))
    })
  })
})
