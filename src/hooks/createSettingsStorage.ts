import createStorage, { type StorageReturn } from '@/hooks/createStorage'
import { type Settings, SettingsStorage } from '@/shared/settings'

export default function createSettingsStorage(): StorageReturn<Settings> {
  return createStorage(SettingsStorage)
}
