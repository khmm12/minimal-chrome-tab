import { flush } from 'solid-js'
import { renderHook } from '@solidjs/testing-library'
import createMediaQuery from '@/hooks/createMediaQuery'
import useSettings from '@/hooks/useSettings'
import { type Settings, ThemeColorMode } from '@/shared/settings'
import createApplyTheme from './createApplyTheme'

vi.mock('@/hooks/useSettings')
vi.mock('@/hooks/createMediaQuery')

function mockSettings(themeColorMode: ThemeColorMode): void {
  const settings: Settings = {
    themeColorMode,
    milestoneProgressStyle: 'bars-compact' as Settings['milestoneProgressStyle'],
  }
  vi.mocked(useSettings).mockReturnValue([() => settings, vi.fn()])
}

function mockOSDark(isDark: boolean): void {
  vi.mocked(createMediaQuery).mockReturnValue(Object.assign(() => isDark, { query: isDark }))
}

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
  vi.resetAllMocks()
})

describe('createApplyTheme', () => {
  describe('theme resolution', () => {
    it('resolves Auto to dark when the OS prefers dark', () => {
      mockSettings(ThemeColorMode.Auto)
      mockOSDark(true)

      renderHook(() => {
        createApplyTheme()
      })
      flush()

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    it('resolves Auto to light when the OS prefers light', () => {
      mockSettings(ThemeColorMode.Auto)
      mockOSDark(false)

      renderHook(() => {
        createApplyTheme()
      })
      flush()

      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('uses the explicit Light theme regardless of OS preference', () => {
      mockSettings(ThemeColorMode.Light)
      mockOSDark(true)

      renderHook(() => {
        createApplyTheme()
      })
      flush()

      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('uses the explicit Dark theme regardless of OS preference', () => {
      mockSettings(ThemeColorMode.Dark)
      mockOSDark(false)

      renderHook(() => {
        createApplyTheme()
      })
      flush()

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })
})
