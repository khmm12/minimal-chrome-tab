import type { Chrome } from '@/utils/chrome'

const { chromeMock, getDocumentLanguageMock, getMessageMock } = vi.hoisted(() => ({
  chromeMock: vi.fn<() => Chrome | undefined>(),
  getDocumentLanguageMock: vi.fn<() => string>(),
  getMessageMock: vi.fn<(key: string) => string>(),
}))

vi.mock('@/utils/chrome', () => ({ default: chromeMock }))
vi.mock('@/utils/get-document-language', () => ({ default: getDocumentLanguageMock }))

beforeEach(() => {
  vi.resetModules()
  getDocumentLanguageMock.mockReturnValue('en')
})

afterEach(() => {
  vi.resetAllMocks()
  document.body.innerHTML = ''
  document.documentElement.lang = ''
})

describe('localize-html boot', () => {
  it('sets the document language from getDocumentLanguage', async () => {
    getDocumentLanguageMock.mockReturnValue('ru')

    await boot()

    expect(document.documentElement.lang).toBe('ru')
    expect(getDocumentLanguageMock).toHaveBeenCalledTimes(1)
  })

  it('localizes elements with a data-l key using chrome i18n', async () => {
    getMessageMock.mockImplementation((key) => (key === 'hello' ? 'Hi' : ''))
    mockChromeI18n()
    document.body.innerHTML = '<span data-l="hello">placeholder</span>'

    await boot()

    expect(document.body.querySelector('span')?.innerHTML).toBe('Hi')
    expect(getMessageMock).toHaveBeenCalledTimes(1)
    expect(getMessageMock).toHaveBeenCalledWith('hello')
  })

  it('still sets the language but skips localization when chrome() is undefined', async () => {
    getDocumentLanguageMock.mockReturnValue('ru')
    chromeMock.mockReturnValue(undefined)
    document.body.innerHTML = '<span data-l="hello">original</span>'

    await boot()

    expect(document.body.querySelector('span')?.innerHTML).toBe('original')
    expect(document.documentElement.lang).toBe('ru')
  })

  it('skips localization when chrome() exists but i18n is absent', async () => {
    chromeMock.mockReturnValue({})
    document.body.innerHTML = '<span data-l="hello">original</span>'

    await boot()

    expect(document.body.querySelector('span')?.innerHTML).toBe('original')
  })

  it('skips non-HTML elements (SVG) matched by the data attribute', async () => {
    getMessageMock.mockImplementation((key) => (key === 'hello' ? 'Hi' : 'UNEXPECTED'))
    mockChromeI18n()
    const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $svg.setAttribute('data-l', 'hello')
    $svg.textContent = 'icon'
    document.body.append($svg)

    await boot()

    expect(document.body.querySelector('svg')?.textContent).toBe('icon')
    expect(getMessageMock).not.toHaveBeenCalled()
  })

  it('leaves an element with an empty data-l key untouched while still localizing valid siblings', async () => {
    getMessageMock.mockImplementation((key) => (key === 'hello' ? 'Hi' : 'UNEXPECTED'))
    mockChromeI18n()
    document.body.innerHTML = '<span data-l="">keep me</span><span data-l="hello">placeholder</span>'

    await boot()

    const [$empty, $valid] = document.body.querySelectorAll('span')
    expect($empty?.innerHTML).toBe('keep me')
    expect($valid?.innerHTML).toBe('Hi')
    expect(getMessageMock).toHaveBeenCalledTimes(1)
    expect(getMessageMock).toHaveBeenCalledWith('hello')
    expect(getMessageMock).not.toHaveBeenCalledWith('')
  })
})

async function boot(): Promise<void> {
  await import('./localize-html')
}

function mockChromeI18n(): void {
  chromeMock.mockReturnValue({ i18n: { getMessage: getMessageMock } } as unknown as Chrome)
}
