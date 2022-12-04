import createStorage, { StorageReturn } from '@/hooks/createStorage'
import Storage, { getLazyStorageAdapter } from '@/utils/storage'

export interface Settings {
  birthDate?: string
}

const StorageAdapter = await getLazyStorageAdapter<Settings>()

const SettingsStorage = new Storage<Settings>(StorageAdapter, 'settings', { birthDate: undefined })

export default function createSettingsStorage(): StorageReturn<Settings> {
  return createStorage(SettingsStorage)
}
