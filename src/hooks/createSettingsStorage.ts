import createStorage, { StorageReturn } from '@/hooks/createStorage'
import Storage, { getLazyStorageAdapter } from '@/utils/storage'

export interface Settings {
  birthDate?: string
}

const StorageAdapter = /* @__PURE__ */ await getLazyStorageAdapter<Settings>()

const SettingsStorage = /* @__PURE__ */ new Storage<Settings>(StorageAdapter, 'settings', {
  birthDate: undefined,
})

export default function createSettingsStorage(): StorageReturn<Settings> {
  return createStorage(SettingsStorage)
}
