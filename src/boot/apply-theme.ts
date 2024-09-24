import { type Accessor, createEffect, createMemo, createRoot, on, onMount } from 'solid-js'
import createMediaQuery from '@/hooks/createMediaQuery'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import { ThemeColorMode } from '@/shared/settings'

const disposeRoot = createRoot((dispose) => {
  const isOSDark = createMediaQuery('(prefers-color-scheme: dark)')
  const [settings] = createSettingsStorage()

  const theme = createMemo((): string =>
    settings().themeColorMode === ThemeColorMode.Auto ? (isOSDark() ? 'dark' : 'light') : settings().themeColorMode,
  )

  createEffect(
    on(theme, (val) => {
      document.documentElement.setAttribute('data-theme', val)
    }),
  )

  const favicon = useFavicon()

  createEffect(
    on(
      isOSDark,
      () => {
        const $el = favicon()
        if ($el != null) triggerFaviconRefresh($el)
      },
      { defer: true },
    ),
  )

  return dispose
})

if (import.meta.hot != null) {
  import.meta.hot.accept()
  import.meta.hot.dispose(disposeRoot)
}

function useFavicon(): Accessor<HTMLLinkElement | null> {
  let $favicon: HTMLLinkElement | null = null

  onMount(() => {
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
