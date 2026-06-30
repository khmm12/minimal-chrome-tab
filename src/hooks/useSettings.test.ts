import useSettings, { resetSettings } from './useSettings'

afterEach(() => {
  resetSettings()
})

describe('useSettings', () => {
  it('shares a single instance across calls', () => {
    expect(useSettings()).toBe(useSettings())
  })

  it('builds a fresh instance after reset', () => {
    const first = useSettings()
    resetSettings()

    expect(useSettings()).not.toBe(first)
  })
})
