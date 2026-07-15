import toISODate from '@/utils/to-iso-date'
import {
  buildSettingsStorage,
  MilestoneProgressStyle,
  type Settings,
  settingsSerializer,
  ThemeColorMode,
} from './settings'

describe('settings', () => {
  describe('settingsSerializer', () => {
    it('serializes settings', () => {
      const settings: Settings = {
        birthDate: toISODate(new Date()),
        themeColorMode: ThemeColorMode.Light,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      }

      const serialized = settingsSerializer.serialize(settings)

      expect(serialized).toEqual(settings)
    })

    it('drops the birthDate key when it is undefined', () => {
      const settings: Settings = {
        birthDate: undefined,
        themeColorMode: ThemeColorMode.Light,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      }

      const serialized = settingsSerializer.serialize(settings)

      expect(serialized).toEqual({
        themeColorMode: ThemeColorMode.Light,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      })
      expect(serialized).not.toHaveProperty('birthDate')
    })

    it('deserializes settings', () => {
      const serialized = {
        birthDate: String(toISODate(new Date())),
        themeColorMode: ThemeColorMode.Light,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      }

      const deserialized = settingsSerializer.deserialize(serialized)

      expect(deserialized).toEqual(serialized)
    })

    it('fallbacks to default settings when deserialization fails', () => {
      const deserialized = settingsSerializer.deserialize({
        birthDate: 'invalid-date',
        themeColorMode: 'invalid-theme-color-mode',
        milestoneProgressStyle: 'invalid-milestone-progress-style',
      })

      expect(deserialized).toEqual({
        birthDate: undefined,
        themeColorMode: ThemeColorMode.Auto,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      })
    })
  })

  describe('buildSettingsStorage', () => {
    afterEach(() => {
      localStorage.clear()
    })

    it('round-trips settings through the backend using the settings serializer', async () => {
      // Exercises the wiring of line 59 end-to-end: `write` runs
      // `settingsSerializer.serialize` into the backend, `read` runs
      // `deserialize` back out. In the test env `buildStorageAdapter` resolves
      // to the localStorage adapter (no `chrome` global).
      const storage = buildSettingsStorage()
      const settings: Settings = {
        birthDate: toISODate(new Date()),
        themeColorMode: ThemeColorMode.Dark,
        milestoneProgressStyle: MilestoneProgressStyle.HorizontalBar,
      }

      await storage.write(settings)
      const read = await storage.read()

      expect(read).toEqual(settings)

      storage.dispose()
    })
  })
})
