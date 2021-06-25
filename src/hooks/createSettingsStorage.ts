import createStorage, { Storage, StorageReturn } from '@/hooks/createStorage'

export interface Settings {
  birthDate?: string
}

const SettingsStorage = new Storage<Settings>('settings', { birthDate: undefined })

export default function createSettingsStorage(): StorageReturn<Settings> {
  return createStorage(SettingsStorage)
}
