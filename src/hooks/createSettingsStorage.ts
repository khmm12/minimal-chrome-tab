import * as v from 'valibot'
import createStorage, { type StorageReturn } from '@/hooks/createStorage'
import { isISODate, type ISODate } from '@/utils/brands'
import Storage, { buildStorageAdapter, type ISerializer } from '@/utils/storage'

export interface Settings {
  birthDate?: ISODate
}

const Key = 'settings'

const isoDateSchema = /* @__PURE__ */ v.custom<ISODate>(isISODate, 'is not a valid ISODate')

const SettingsSchema = /* @__PURE__ */ v.fallback(
  v.object({
    birthDate: v.fallback(v.optional(isoDateSchema), undefined),
  }),
  {},
)

const Serializer: ISerializer<Settings> = {
  deserialize(value) {
    try {
      return v.parse(SettingsSchema, value)
    } catch {
      return {}
    }
  },
  serialize(value) {
    return value
  },
}

const StorageAdapter = /* @__PURE__ */ await buildStorageAdapter(Key)
const SettingsStorage = /* @__PURE__ */ await Storage.create(StorageAdapter, Serializer)

export default function createSettingsStorage(): StorageReturn<Settings> {
  return createStorage(SettingsStorage)
}
