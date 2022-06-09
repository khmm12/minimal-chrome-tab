import { createEffect, onCleanup } from 'solid-js'
import { createFocusTrap } from 'focus-trap'

interface OverlayHooksConfig {
  readonly $overlay: HTMLElement | undefined
  readonly onClose?: () => void
}

export default function useOverlayHooks(config: OverlayHooksConfig): void {
  createEffect(() => {
    const { $overlay } = config
    if ($overlay == null) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === 'Escape') {
        e.stopPropagation()
        config.onClose?.()
      }
    }

    $overlay.addEventListener('keydown', handleKeyDown)
    onCleanup(() => $overlay.removeEventListener('keydown', handleKeyDown))
  })

  createEffect(() => {
    const handleDocumentClick = (e: MouseEvent): void => {
      if (shouldClose(e, config.$overlay)) {
        e.stopPropagation()
        config.onClose?.()
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    onCleanup(() => document.removeEventListener('click', handleDocumentClick, true))
  })

  createEffect(() => {
    const { $overlay } = config
    const $dialog = $overlay?.firstChild as HTMLElement | null

    if ($overlay != null && $dialog != null) {
      const focusTrap = createFocusTrap($overlay, {
        escapeDeactivates: false,
        fallbackFocus: $dialog,
      })
      focusTrap.activate()
      onCleanup(() => focusTrap.deactivate())
    }
  })
}

function shouldClose(e: MouseEvent, $overlay: HTMLElement | undefined): boolean {
  return $overlay != null && e.target instanceof Node && !isOverlayDescendant($overlay, e.target)
}

function isOverlayDescendant($overlay: HTMLElement, node: Node): boolean {
  for (const child of $overlay.children) if (child.contains(node)) return true
  return false
}
