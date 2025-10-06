import toISODate from '@/utils/to-iso-date'
import { MilestoneProgressStyle, Serializer, type Settings, ThemeColorMode } from './settings'

describe('SettingsStorage', () => {
  describe('Serializer', () => {
    it('serializes settings', () => {
      const settings: Settings = {
        birthDate: toISODate(new Date()),
        themeColorMode: ThemeColorMode.Light,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      }

      const serialized = Serializer.serialize(settings)

      expect(serialized).toEqual(settings)
    })

    it('deserializes settings', () => {
      const serialized: Settings = {
        birthDate: toISODate(new Date()),
        themeColorMode: ThemeColorMode.Light,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
      }

      const deserialized = Serializer.deserialize(serialized)

      expect(deserialized).toEqual(serialized)
    })

    it('fallbacks to default settings when deserialization fails', () => {
      const deserialized = Serializer.deserialize({
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
