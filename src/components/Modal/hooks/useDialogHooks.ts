import { createFocusTrap } from 'focus-trap'
import { createEffect, onCleanup } from 'solid-js'

interface OverlayHooksConfig {
  readonly $overlay: HTMLElement | undefined
  readonly $dialog: HTMLElement | undefined
  readonly onClose?: () => void
}

export default function useDialogHooks(config: OverlayHooksConfig): void {
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
    onCleanup(() => {
      $overlay.removeEventListener('keydown', handleKeyDown)
    })
  })

  createEffect(() => {
    const handleDocumentClick = (e: MouseEvent): void => {
      if (shouldClose(e, config.$dialog)) {
        e.stopPropagation()
        config.onClose?.()
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    onCleanup(() => {
      document.removeEventListener('click', handleDocumentClick, true)
    })
  })

  if (!import.meta.env.TEST) {
    // JSDOM doesn't support inert attribute
    createEffect(() => {
      const { $overlay, $dialog } = config

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
}

function shouldClose(e: MouseEvent, $dialog: HTMLElement | undefined): boolean {
  return e.target instanceof Node && $dialog != null && !$dialog.contains(e.target)
}
