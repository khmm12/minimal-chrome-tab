import { type JSX, Show, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'
import { css } from 'styled-system/css'
import { Transition } from 'solid-transition-group'
import { CloseIcon } from '@/components/Icon'
import { ShowWithTransitionContext } from '@/components/ShowWithTransition'
import createUniqueIds from '@/hooks/createUniqueIds'
import buildModalAnimation from './animation'
import useDialogHooks from './hooks/useDialogHooks'
import * as s from './styles'

interface ModalProps {
  icon?: JSX.Element
  title: JSX.Element
  children?: JSX.Element
  onClose?: (() => void) | undefined
}

export default function Modal(props: ModalProps): JSX.Element {
  let $overlay: HTMLDivElement | undefined
  let $dialog: HTMLDivElement | undefined

  const transition = useContext(ShowWithTransitionContext)

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

  const animation = buildModalAnimation(() => $dialog)

  return (
    <Portal>
      <Transition appear onEnter={animation.onEnter} onExit={animation.onExit} onAfterExit={transition.onAfterExit}>
        <Show when={transition.isOpened}>
          <div ref={$overlay} class={css(s.overlay)} tabIndex={-1}>
            <div ref={$dialog} class={css(s.dialog)} aria-labelledby={ids.title} role="dialog" tabIndex={-1}>
              <div class={css(s.header)}>
                <div class={css(s.titleWrapper)}>
                  <Show when={props.icon}>
                    <div aria-hidden="true" class={css(s.icon)}>
                      {props.icon}
                    </div>
                  </Show>
                  <h1 id={ids.title} class={css(s.title)}>
                    {props.title}
                  </h1>
                </div>
                <button class={css(s.closeButton)} type="button" title="Close" onClick={handleCloseButtonClick}>
                  <CloseIcon aria-hidden="true" />
                </button>
              </div>
              <div class={css(s.body)}>{props.children}</div>
            </div>
          </div>
        </Show>
      </Transition>
    </Portal>
  )
}
