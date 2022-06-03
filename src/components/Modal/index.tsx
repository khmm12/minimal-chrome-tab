import { JSX, createEffect, onCleanup, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Transition } from 'solid-transition-group'
import { createFocusTrap } from 'focus-trap'
import createUniqueIds from '@/hooks/createUniqueIds'
import Show from '@/components/Show'
import { ShowWithTransitionContext } from '@/components/ShowWithTransition'
import * as css from './styles'

interface ModalProps {
  title?: JSX.Element
  children?: JSX.Element
  onClose?: () => void
}

export default function Modal(props: ModalProps): JSX.Element {
  let $overlay: HTMLDivElement | undefined
  let $dialog: HTMLDivElement | undefined

  const handleOverlayKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') props.onClose?.()
  }

  const handleOverlayClick = (e: MouseEvent): void => {
    if (e.target instanceof Node && !$dialog?.contains(e.target)) props.onClose?.()
  }

  const transition = useContext(ShowWithTransitionContext)

  createEffect(() => {
    if ($overlay != null) {
      const focusTrap = createFocusTrap($overlay, {
        escapeDeactivates: false,
      })
      focusTrap.activate()
      onCleanup(() => focusTrap.deactivate())
    }
  })

  const ids = createUniqueIds(['title'])

  return (
    <Portal>
      <Transition name="overlay" appear onAfterExit={transition.onAfterExit}>
        <Show when={transition.isOpened()}>
          <div ref={$overlay} class={css.overlay} onKeyDown={handleOverlayKeyDown} onClick={handleOverlayClick}>
            <div ref={$dialog} class={css.dialog} aria-labelledby={ids.title} role="dialog" tabIndex={-1}>
              <div class={css.header}>
                <h1 id={ids.title} class={css.title}>
                  {props.title}
                </h1>
                <button class={css.closeButton} type="button" title="Close" onClick={props.onClose}>
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                    <path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z" />
                  </svg>
                </button>
              </div>
              <div class={css.body}>{props.children}</div>
            </div>
          </div>
        </Show>
      </Transition>
    </Portal>
  )
}
