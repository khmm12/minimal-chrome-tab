import { Accessor, createEffect, onCleanup, onMount, untrack } from 'solid-js'
import { darkScheme } from '@/theme/media'

const RefreshKey = '__t__'

/**
 * Hack that forces the browser to reload the favicon when the theme changes.
 */
export default function useFaviconRefresh(): void {
  const favicon = useFavicon()

  onThemeChange(() => {
    const $el = favicon()
    if ($el != null) triggerFaviconRefresh($el)
  })
}

function useFavicon(): Accessor<HTMLLinkElement | null> {
  let $favicon: HTMLLinkElement | null = null

  onMount(() => {
    $favicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]')
  })

  return () => $favicon
}

/**
 * It calls the given function when the browser's theme changes
 */
function onThemeChange(fn: () => void): void {
  createEffect(() => {
    const mediaQuery = window.matchMedia(darkScheme)
    const handleMediaChange = (): void => untrack(() => fn())

    mediaQuery.addEventListener('change', handleMediaChange)
    onCleanup(() => mediaQuery.removeEventListener('change', handleMediaChange))
  })
}

/**
 * It's a hack to force the browser to reload the favicon.
 */
function triggerFaviconRefresh($el: HTMLLinkElement): void {
  const url = new URL($el.href)

  if (url.searchParams.has(RefreshKey)) {
    url.searchParams.delete(RefreshKey)
  } else {
    url.searchParams.set(RefreshKey, '1')
  }

  $el.href = url.toString()
}
