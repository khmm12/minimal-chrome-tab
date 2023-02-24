import getCurrentLocale from './get-current-locale'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getCurrentLocale', () => {
  it('returns chrome.i18n.getUILanguage() when available', () => {
    if (globalThis.chrome == null) {
      globalThis.chrome = null as any
      vi.spyOn(globalThis, 'chrome', 'get').mockReturnValue({
        // @ts-expect-error: mock
        i18n: { getUILanguage: vi.fn() },
      })
    }
    const getUILanguage = vi.fn().mockReturnValue('en-US')
    // @ts-expect-error: mock
    vi.spyOn(chrome.i18n, 'getUILanguage', 'get').mockReturnValue(getUILanguage)

    expect(getCurrentLocale()).toBe('en-US')

    getUILanguage.mockReturnValue('ru-RU')

    expect(getCurrentLocale()).toBe('ru-RU')
  })

  it('returns navigator language otherwise', () => {
    const navigatorLanguage = vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')

    expect(getCurrentLocale()).toBe('en-US')

    navigatorLanguage.mockReturnValue('ru-RU')

    expect(getCurrentLocale()).toBe('ru-RU')
  })
})
