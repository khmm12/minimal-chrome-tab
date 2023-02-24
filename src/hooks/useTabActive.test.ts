import { fireEvent, renderHook } from '@test/helpers/solid'
import type { SpyInstance } from 'vitest'
import useTabActive from './useTabActive'

let isHidden: SpyInstance<[], boolean>

beforeEach(() => {
  isHidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('useTabActive', () => {
  it('returns tab state', async () => {
    const isActive = renderHook(() => useTabActive()).result

    expect(isActive()).toBeTruthy()
  })

  it('reflects to tab state', async () => {
    const isActive = renderHook(() => useTabActive()).result

    isHidden.mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))

    expect(isActive()).toBeFalsy()

    isHidden.mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))

    expect(isActive()).toBeTruthy()
  })
})
