import getCurrentLocale from './get-current-locale'
import getDocumentLanguage from './get-document-language'

vi.mock('@/utils/get-current-locale')

beforeEach(() => {
  vi.mocked(getCurrentLocale).mockImplementation(() => {
    throw new TypeError('Current locale is disabled within a test')
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getDocumentLanguage', () => {
  describe('accepts locale in BCP 47 format and returns language in ISO639-1 format', () => {
    test.each([
      ['en', 'en'],
      ['en-US', 'en'],
      ['zh-Hans-CN', 'zh'],
      ['th-TH-u-nu-thai', 'th'],
    ])('%s -> %s', (locale, language) => {
      expect(getDocumentLanguage(locale)).toBe(language)
    })
  })

  it('raises an exception when given locale is not valid', () => {
    expect(() => getDocumentLanguage('NOTVALID')).toThrowError('The locale is not valid BCP 47 format')
    expect(() => getDocumentLanguage('')).toThrowError('The locale is not valid BCP 47 format')
  })

  it('uses current locale when locale argument is not provided', () => {
    vi.mocked(getCurrentLocale).mockReturnValue('ru-RU')

    expect(getDocumentLanguage()).toBe('ru')
  })
})
