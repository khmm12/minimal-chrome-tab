import { fireEvent, renderHook } from '@solidjs/testing-library'
import type { MockInstance } from 'vitest'
import useTabActive from './useTabActive'

let isHidden: MockInstance<() => boolean>

beforeEach(() => {
  isHidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('useTabActive', () => {
  it('returns tab state', () => {
    const isActive = renderHook(() => useTabActive()).result

    expect(isActive()).toBeTruthy()
  })

  it('reflects to tab state', () => {
    const isActive = renderHook(() => useTabActive()).result

    isHidden.mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))

    expect(isActive()).toBeFalsy()

    isHidden.mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))

    expect(isActive()).toBeTruthy()
  })
})
