import { createEffect, createRenderEffect, untrack } from 'solid-js'
import { createFocusTrap } from 'focus-trap'
import { supportsAnimations, supportsInertAttribute } from '@/utils/dom'

interface OverlayHooksConfig {
  readonly $overlay: HTMLElement | undefined
  readonly $dialog: HTMLElement | undefined
  readonly isVisible: boolean
  readonly onClose?: () => void
  readonly onExited?: () => void
}

export default function useDialogHooks(config: OverlayHooksConfig): void {
  createEffect(
    () => config.$overlay,
    ($overlay) => {
      if ($overlay == null) return

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.code === 'Escape') {
          e.stopPropagation()
          config.onClose?.()
        }
      }

      $overlay.addEventListener('keydown', handleKeyDown)
      return () => {
        $overlay.removeEventListener('keydown', handleKeyDown)
      }
    },
  )

  createEffect(
    () => config.$dialog,
    ($dialog) => {
      const handleDocumentClick = (e: MouseEvent): void => {
        if (shouldClose(e, $dialog)) {
          e.stopPropagation()
          config.onClose?.()
        }
      }

      document.addEventListener('click', handleDocumentClick, true)
      return () => {
        document.removeEventListener('click', handleDocumentClick, true)
      }
    },
  )

  createRenderEffect(
    () => ({ $overlay: config.$overlay, $dialog: config.$dialog }),
    ({ $overlay, $dialog }) => {
      if (!supportsInertAttribute() || $overlay == null || $dialog == null) return

      const focusTrap = createFocusTrap($overlay, {
        escapeDeactivates: false,
        fallbackFocus: $dialog,
      })

      focusTrap.activate()
      return () => {
        focusTrap.deactivate()
      }
    },
  )

  createEffect(
    () => config.$dialog,
    ($dialog) => {
      if ($dialog == null) return

      const handleAnimationEnd = (): void => {
        untrack(() => {
          if (!config.isVisible) config.onExited?.()
        })
      }

      $dialog.addEventListener('animationend', handleAnimationEnd)
      return () => {
        $dialog.removeEventListener('animationend', handleAnimationEnd)
      }
    },
  )

  // In case of animations aren't supported, dispatch animationend event manually
  createEffect(
    () => ({ isDialogVisible: config.isVisible, $dialog: config.$dialog }),
    ({ isDialogVisible, $dialog: $el }) => {
      if (supportsAnimations() || $el == null || isDialogVisible) return

      const rafID = requestAnimationFrame(() => {
        $el.dispatchEvent(new Event('animationend'))
      })

      return () => {
        cancelAnimationFrame(rafID)
      }
    },
    { defer: true },
  )
}

function shouldClose(e: MouseEvent, $dialog: HTMLElement | undefined): boolean {
  return e.target instanceof Node && $dialog != null && !$dialog.contains(e.target)
}
