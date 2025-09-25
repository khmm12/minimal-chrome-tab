import { createEffect, on, onCleanup, untrack } from 'solid-js'
import { createFocusTrap } from 'focus-trap'
import { supportsAnimations } from '@/utils/dom'

interface OverlayHooksConfig {
  readonly $overlay: HTMLElement | undefined
  readonly $dialog: HTMLElement | undefined
  readonly isVisible: boolean
  readonly onClose?: () => void
  readonly onExited?: () => void
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

  createEffect(() => {
    const { $dialog } = config
    if ($dialog == null) return

    const handleAnimationEnd = (): void => {
      untrack(() => {
        if (!config.isVisible) config.onExited?.()
      })
    }

    $dialog.addEventListener('animationend', handleAnimationEnd)
    onCleanup(() => {
      $dialog.removeEventListener('animationend', handleAnimationEnd)
    })
  })

  // In case of animations aren't supported, dispatch animationend event manually
  createEffect(
    on(
      () => config.isVisible,
      (isDialogVisible) => {
        const { $dialog: $el } = config

        if (supportsAnimations() || $el == null || isDialogVisible) return

        const rafID = requestAnimationFrame(() => {
          $el.dispatchEvent(new Event('animationend'))
        })

        onCleanup(() => {
          cancelAnimationFrame(rafID)
        })
      },
      { defer: true },
    ),
  )
}

function shouldClose(e: MouseEvent, $dialog: HTMLElement | undefined): boolean {
  return e.target instanceof Node && $dialog != null && !$dialog.contains(e.target)
}
