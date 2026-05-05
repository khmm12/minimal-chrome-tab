import { createSignal, Show, useContext } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { Portal } from '@solidjs/web'
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
  const [$overlay, setOverlay] = createSignal<HTMLDivElement | undefined>(undefined)
  const [$dialog, setDialog] = createSignal<HTMLDivElement | undefined>(undefined)

  const assignOverlay = (el: HTMLDivElement): void => {
    setOverlay(el)
  }

  const assignDialog = (el: HTMLDivElement): void => {
    setDialog(el)
  }

  const transition = useContext(ShowWithTransitionContext)

  const isVisible = (): boolean => transition.isOpened

  useDialogHooks({
    get $overlay() {
      return $overlay()
    },
    get $dialog() {
      return $dialog()
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
      <div data-state={isVisible() ? 'open' : 'closed'} aria-hidden="true" tabindex={-1} class={css(s.backdrop)} />
      <div ref={assignOverlay} class={css(s.overlay)} tabindex={-1}>
        <div
          ref={assignDialog}
          class={css(s.dialog)}
          data-state={isVisible() ? 'open' : 'closed'}
          aria-labelledby={ids.title}
          role="dialog"
          tabindex={-1}
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
