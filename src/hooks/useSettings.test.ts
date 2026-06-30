import { createRoot } from 'solid-js'
import * as settings from '@/shared/settings'
import type { Storage } from '@/utils/storage'
import useSettings, { resetSettings } from './useSettings'

type Settings = settings.Settings

vi.mock('@/shared/settings', async (importOriginal) => ({
  ...(await importOriginal<typeof settings>()),
  buildSettingsStorage: vi.fn(),
}))

const emptySettings: Settings = {
  themeColorMode: settings.ThemeColorMode.Auto,
  milestoneProgressStyle: settings.MilestoneProgressStyle.BarsCompact,
}

function fakeStorage(): Storage<Settings> {
  return {
    read: vi.fn<Storage<Settings>['read']>().mockResolvedValue(emptySettings),
    write: vi.fn<Storage<Settings>['write']>().mockResolvedValue(undefined),
    subscribe: vi.fn<Storage<Settings>['subscribe']>().mockReturnValue(() => {}),
    dispose: vi.fn<Storage<Settings>['dispose']>(),
  }
}

beforeEach(() => {
  vi.mocked(settings.buildSettingsStorage).mockImplementation(fakeStorage)
})

afterEach(() => {
  resetSettings()
})

describe('useSettings', () => {
  it('shares a single instance across calls', () => {
    expect(useSettings()).toBe(useSettings())
  })

  it('builds a fresh instance after reset', () => {
    const first = useSettings()
    resetSettings()

    expect(useSettings()).not.toBe(first)
  })

  it('survives disposal of the consumer that first read it (detached owner)', () => {
    const storage = fakeStorage()
    vi.mocked(settings.buildSettingsStorage).mockReturnValue(storage)

    let disposeConsumer!: () => void
    createRoot((dispose) => {
      disposeConsumer = dispose
      useSettings()
    })
    disposeConsumer()

    // A bare `createRoot` inside the consumer's scope would be owned by it and
    // torn down on `disposeConsumer()`; `runWithOwner(null, ...)` detaches the
    // singleton so it outlives whichever consumer reads it first.
    expect(storage.dispose).not.toHaveBeenCalled()
  })
})
