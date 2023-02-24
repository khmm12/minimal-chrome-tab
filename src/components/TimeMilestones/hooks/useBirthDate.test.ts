import { renderHook } from '@test/helpers/solid'
import createSettingsStorage, { type Settings } from '@/hooks/createSettingsStorage'
import useBirthDate from './useBirthDate'

afterEach(() => {
  localStorage.clear()
})

describe('useBirthDate', () => {
  it('has loading attribute', async () => {
    const birthDate = renderHook(() => useBirthDate()).result

    expect(birthDate.loading).toBeDefined()
    expect(birthDate.loading).toBeTruthy()

    await runNextTick()

    expect(birthDate.loading).toBeFalsy()
  })

  it('returns null when birthdate is not defined', async () => {
    await fillSettings({ birthDate: undefined })
    const birthDate = renderHook(() => useBirthDate()).result
    await runNextTick()

    expect(birthDate()).toBeNull()
  })

  it('returns Date when birthdate is defined', async () => {
    await fillSettings({ birthDate: '1970-06-05' })
    const birthDate = renderHook(() => useBirthDate()).result
    await runNextTick()

    expect(birthDate()).toEqual(new Date('1970-06-05'))
  })
})

async function fillSettings(settings: Settings): Promise<void> {
  const [, setSettings] = renderHook(() => createSettingsStorage()).result
  await setSettings(settings)
}

async function runNextTick(): Promise<void> {
  await new Promise((resolve) => {
    process.nextTick(resolve)
  })
}
