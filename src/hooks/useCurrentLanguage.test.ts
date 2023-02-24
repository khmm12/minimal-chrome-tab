import { renderHook } from '@test/helpers/solid'
import getCurrentLocale from '@/utils/get-current-locale'
import useCurrentLanguage from './useCurrentLanguage'

vi.mock('@/utils/get-current-locale')

afterEach(() => {
  vi.resetAllMocks()
})

describe('useCurrentLanguage', () => {
  it('returns current language', () => {
    vi.mocked(getCurrentLocale).mockReturnValue('en-US')
    const currentLanguage = renderHook(() => useCurrentLanguage()).result

    expect(currentLanguage()).toBe('en-US')

    vi.mocked(getCurrentLocale).mockReturnValue('ru-RU')

    expect(currentLanguage()).toBe('en-US')
  })
})
