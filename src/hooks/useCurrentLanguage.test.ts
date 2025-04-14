import { renderHook } from '@solidjs/testing-library'
import getCurrentLocale from '@/utils/get-current-locale'
import useCurrentLanguage from './useCurrentLanguage'

vi.mock('@/utils/get-current-locale')

afterEach(() => {
  vi.resetAllMocks()
})

describe('useCurrentLanguage', () => {
  it('returns current language', () => {
    vi.mocked(getCurrentLocale).mockReturnValue('en-US')
    const hook1 = renderHook(() => useCurrentLanguage())

    expect(hook1.result()).toBe('en-US')

    vi.mocked(getCurrentLocale).mockReturnValue('en-GB')
    const hook2 = renderHook(() => useCurrentLanguage())

    expect(hook2.result()).toBe('en-GB')
  })
})
