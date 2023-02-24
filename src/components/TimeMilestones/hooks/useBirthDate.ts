import { type Accessor, createMemo } from 'solid-js'
import createSettingsStorage, { type Settings } from '@/hooks/createSettingsStorage'

type BirthDateAccessor = Accessor<Date | null> & {
  loading: boolean
}

export default function useBirthDate(): BirthDateAccessor {
  const [settings] = createSettingsStorage()

  const birthDate = createMemo(() => createBirthDate(settings()), undefined, {
    equals: isDateEqual,
  })

  Object.defineProperty(birthDate, 'loading', { get: () => settings.loading })

  return birthDate as BirthDateAccessor
}

function isDateEqual<T extends Date | undefined | null>(a: T, b: T): boolean {
  return a?.valueOf() === b?.valueOf()
}

function createBirthDate(settings: Settings | undefined | null): Date | null {
  const value = settings?.birthDate
  return value != null && value !== '' ? new Date(value) : null
}
