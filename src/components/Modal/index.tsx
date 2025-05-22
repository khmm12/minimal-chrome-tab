import { type JSX, Show, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'
import { css } from 'styled-system/css'
import { CloseIcon } from '@/components/Icon'
import { ShowWithTransitionContext } from '@/components/ShowWithTransition'
import createUniqueIds from '@/hooks/createUniqueIds'
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

  const isVisible = (): boolean => transition.isOpened

  useDialogHooks({
    get $overlay() {
      return $overlay
    },
    get $dialog() {
      return $dialog
    },
    get isVisible() {
      return isVisible()
    },
    onClose() {
      props.onClose?.()
    },
    onExited() {
      transition.onAfterExit()
    },
  })

  const handleCloseButtonClick = (e: MouseEvent): void => {
    e.stopPropagation()
    props.onClose?.()
  }

  const ids = createUniqueIds(['title'])

  return (
    <Portal>
      <div data-state={isVisible() ? 'open' : 'closed'} aria-hidden="true" tabIndex={-1} class={css(s.backdrop)} />
      <div ref={$overlay} class={css(s.overlay)} tabIndex={-1}>
        <div
          ref={$dialog}
          class={css(s.dialog)}
          data-state={isVisible() ? 'open' : 'closed'}
          aria-labelledby={ids.title}
          role="dialog"
          tabIndex={-1}
        >
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
              <CloseIcon css={s.closeButtonIcon} aria-hidden="true" />
            </button>
          </div>
          <div class={css(s.body)}>{props.children}</div>
        </div>
      </div>
    </Portal>
  )
}
