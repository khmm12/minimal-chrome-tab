import * as v from 'valibot'
import { isISODate, type ISODate } from '@/utils/brands'
import Storage, { buildStorageAdapter, type ISerializer } from '@/utils/storage'

export interface Settings {
  birthDate?: ISODate
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

const Serializer: ISerializer<Settings> = {
  deserialize(value) {
    try {
      return v.parse(SettingsSchema, value)
    } catch {
      return v.getFallback(SettingsSchema)
    }
  },
  serialize(value) {
    return value
  },
}

const StorageAdapter = /* @__PURE__ */ await buildStorageAdapter(Key)

// Singletone
export const SettingsStorage = /* @__PURE__ */ await Storage.create(StorageAdapter, Serializer)
