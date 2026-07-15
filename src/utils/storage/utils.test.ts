import chrome from '@/utils/chrome'
import ChromeStorageAdapter from './adapters/chrome-storage-adapter'
import LocalStorageAdapter from './adapters/local-storage-adapter'
import MemoryStorageAdapter from './adapters/memory-storage-adapter'
import { buildStorageAdapter } from './utils'

vi.mock('@/utils/chrome')

afterEach(() => {
  vi.resetAllMocks()
  vi.unstubAllGlobals()
})

describe('buildStorageAdapter', () => {
  it('builds a ChromeStorageAdapter when the chrome storage API is available', async () => {
    // The adapter's constructor subscribes to the real global `chrome`, so it
    // must exist too — the mocked `chrome()` only drives branch selection.
    vi.stubGlobal('chrome', {
      storage: {
        onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
      },
    })
    vi.mocked(chrome).mockReturnValue(globalThis.chrome)

    const adapter = await buildStorageAdapter('test')

    expect(adapter).toBeInstanceOf(ChromeStorageAdapter)
  })

  it('builds a LocalStorageAdapter when chrome is absent but localStorage exists', async () => {
    vi.mocked(chrome).mockReturnValue(undefined)

    const adapter = await buildStorageAdapter('test')

    expect(adapter).toBeInstanceOf(LocalStorageAdapter)
  })

  it('builds a MemoryStorageAdapter when neither chrome nor localStorage is available', async () => {
    vi.mocked(chrome).mockReturnValue(undefined)
    vi.stubGlobal('localStorage', undefined)

    const adapter = await buildStorageAdapter('test')

    expect(adapter).toBeInstanceOf(MemoryStorageAdapter)
  })
})
