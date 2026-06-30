import { type Accessor, createEffect, onSettled } from 'solid-js'
import createMediaQuery from '@/hooks/createMediaQuery'
import useSettings from '@/hooks/useSettings'
import { ThemeColorMode } from '@/shared/settings'

/**
 * Applies the theme as a `data-theme` attribute on `<html>`, in the component tree.
 *
 * Reads settings in a `createEffect` (user lane) — a not-ready read here is not "at
 * render time", so it needs no `<Loading>` boundary; the effect just re-runs once
 * settings resolve. Theme flash on the first frame is best-effort (see ADR 0001).
 */
export default function createApplyTheme(): void {
  const [settings] = useSettings()
  const isOSDark = createMediaQuery('(prefers-color-scheme: dark)')

  createEffect(
    (): string => {
      const { themeColorMode } = settings()
      return themeColorMode === ThemeColorMode.Auto ? (isOSDark() ? 'dark' : 'light') : themeColorMode
    },
    (theme) => {
      document.documentElement.setAttribute('data-theme', theme)
    },
  )

  const favicon = useFavicon()

  createEffect(
    isOSDark,
    () => {
      const $el = favicon()
      if ($el != null) triggerFaviconRefresh($el)
    },
    { defer: true },
  )
}

function useFavicon(): Accessor<HTMLLinkElement | null> {
  let $favicon: HTMLLinkElement | null = null

  onSettled(() => {
    $favicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]')
  })

  return () => $favicon
}

/**
 * It's a hack to force the browser to reload the favicon.
 */
function triggerFaviconRefresh($el: HTMLLinkElement): void {
  const RefreshKey = 't'

  const url = new URL($el.href)

  if (url.searchParams.has(RefreshKey)) {
    url.searchParams.delete(RefreshKey)
  } else {
    url.searchParams.set(RefreshKey, Date.now().toString())
  }

  $el.href = url.toString()
}
