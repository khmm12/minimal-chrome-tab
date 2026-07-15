import { createSignal, flush } from 'solid-js'
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

/**
 * Mocks `createMediaQuery` with a reactive, signal-backed accessor so tests can
 * flip the OS dark-mode preference and drive the effects. Returns the setter.
 */
function mockReactiveOSDark(initial: boolean): (isDark: boolean) => void {
  const [isOSDark, setIsOSDark] = createSignal(initial)
  vi.mocked(createMediaQuery).mockReturnValue(Object.assign(() => isOSDark(), { query: initial }))
  return (isDark) => {
    setIsOSDark(isDark)
  }
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

  describe('favicon refresh', () => {
    let $favicon: HTMLLinkElement | undefined

    function appendFavicon(): void {
      const $el = document.createElement('link')
      $el.rel = 'icon'
      $el.type = 'image/svg+xml'
      $el.href = '/favicon.svg'
      document.head.append($el)
      $favicon = $el
    }

    function faviconHasRefreshParam(): boolean {
      if ($favicon == null) throw new Error('favicon link is not mounted')
      return new URL($favicon.href).searchParams.has('t')
    }

    afterEach(() => {
      $favicon?.remove()
      $favicon = undefined
    })

    it('leaves the favicon href untouched on the initial run', () => {
      mockSettings(ThemeColorMode.Auto)
      mockReactiveOSDark(false)
      appendFavicon()

      renderHook(() => {
        createApplyTheme()
      })
      flush()

      // The effect is deferred, so the initial settle must not touch the href.
      expect(faviconHasRefreshParam()).toBe(false)
    })

    it('toggles the cache-busting param on each OS dark-mode change', () => {
      mockSettings(ThemeColorMode.Auto)
      const setOSDark = mockReactiveOSDark(false)
      appendFavicon()

      renderHook(() => {
        createApplyTheme()
      })
      flush()

      expect(faviconHasRefreshParam()).toBe(false)

      setOSDark(true)
      flush()

      expect(faviconHasRefreshParam()).toBe(true)

      setOSDark(false)
      flush()

      expect(faviconHasRefreshParam()).toBe(false)
    })
  })
})
