import * as v from 'valibot'
import { isISODate, type ISODate } from '@/utils/brands'
import createStorage, { buildStorageAdapter, type Serializer, type Storage } from '@/utils/storage'

export interface Settings {
  birthDate?: ISODate | undefined
  themeColorMode: ThemeColorMode
  milestoneProgressStyle: MilestoneProgressStyle
}

export enum ThemeColorMode {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

export enum MilestoneProgressStyle {
  BarsCompact = 'bars-compact',
  BarsDetailed = 'bars-detailed',
  HorizontalBar = 'bar',
}

const Key = 'settings'

const isoDateSchema = /* @__PURE__ */ v.custom<ISODate>(isISODate, 'is not a valid ISODate')

const defaults = {
  milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
  themeColorMode: ThemeColorMode.Auto,
} satisfies Settings

const SettingsSchema = /* @__PURE__ */ v.fallback(
  v.object({
    birthDate: v.fallback(v.optional(isoDateSchema), undefined),
    milestoneProgressStyle: v.fallback(
      v.optional(v.enum(MilestoneProgressStyle), defaults.milestoneProgressStyle),
      defaults.milestoneProgressStyle,
    ),
    themeColorMode: v.fallback(v.optional(v.enum(ThemeColorMode), defaults.themeColorMode), defaults.themeColorMode),
  }),
  defaults,
)

export const settingsSerializer: Serializer<Settings> = {
  deserialize(value) {
    try {
      return v.parse(SettingsSchema, value)
    } catch {
      return v.getFallback(SettingsSchema)
    }
  },
  serialize({ birthDate, ...rest }) {
    // `birthDate` may be `undefined`, which is not a JSON value — drop the key.
    return birthDate != null ? { ...rest, birthDate } : rest
  },
}

export function buildSettingsStorage(): Storage<Settings> {
  return createStorage(async () => await buildStorageAdapter(Key), settingsSerializer)
}
