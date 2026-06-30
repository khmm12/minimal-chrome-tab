import toISODate from '@/utils/to-iso-date'
import { MilestoneProgressStyle, type Settings, settingsSerializer, ThemeColorMode } from './settings'

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
})
