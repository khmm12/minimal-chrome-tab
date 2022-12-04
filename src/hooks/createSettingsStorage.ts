import createStorage, { StorageReturn } from '@/hooks/createStorage'
import Storage, { getLazyStorageAdapter } from '@/utils/storage'

export interface Settings {
  birthDate?: string
}

const Key = 'settings'
const DefaultValue = { birthDate: undefined } satisfies Settings

const StorageAdapter = /* @__PURE__ */ await getLazyStorageAdapter()
const SettingsStorage = /* @__PURE__ */ new Storage<Settings>(StorageAdapter, Key, DefaultValue)

export default function createSettingsStorage(): StorageReturn<Settings> {
  return createStorage(SettingsStorage)
}
