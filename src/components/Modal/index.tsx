import { createEffect, type JSX, on, Show, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Transition } from 'solid-transition-group'
import { CloseIcon } from '@/components/Icon'
import { ShowWithTransitionContext } from '@/components/ShowWithTransition'
import createUniqueIds from '@/hooks/createUniqueIds'
import useDialogHooks from './hooks/useDialogHooks'
import * as css from './styles'

interface ModalProps {
  icon?: JSX.Element
  title: JSX.Element
  children?: JSX.Element
  onClose?: () => void
}

export default function Modal(props: ModalProps): JSX.Element {
  let $overlay: HTMLDivElement | undefined
  let $dialog: HTMLDivElement | undefined

  const transition = useContext(ShowWithTransitionContext)

  // Emulate transition end event in test environment
  if (import.meta.env.TEST) {
    createEffect(
      on(
        () => transition.isOpened,
        (isOpened) => {
          if (!isOpened)
            setTimeout(() => {
              transition.onAfterExit()
            }, 0)
        },
        { defer: true },
      ),
    )
  }

  useDialogHooks({
    get $overlay() {
      return $overlay
    },
    get $dialog() {
      return $dialog
    },
    onClose: () => props.onClose?.(),
  })

  const handleCloseButtonClick = (e: MouseEvent): void => {
    e.stopPropagation()
    props.onClose?.()
  }

  const ids = createUniqueIds(['title'])

  return (
    <Portal>
      <Transition name="overlay" appear onAfterExit={transition.onAfterExit}>
        <Show when={transition.isOpened}>
          <div ref={$overlay} class={css.overlay} tabIndex={-1}>
            <div ref={$dialog} class={css.dialog} aria-labelledby={ids.title} role="dialog" tabIndex={-1}>
              <div class={css.header}>
                <div class={css.titleWrapper}>
                  <Show when={props.icon}>
                    <div aria-hidden="true" class={css.icon}>
                      {props.icon}
                    </div>
                  </Show>
                  <h1 id={ids.title} class={css.title}>
                    {props.title}
                  </h1>
                </div>
                <button class={css.closeButton} type="button" title="Close" onClick={handleCloseButtonClick}>
                  <CloseIcon aria-hidden="true" />
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
