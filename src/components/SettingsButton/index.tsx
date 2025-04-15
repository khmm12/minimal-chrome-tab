import {
  type Accessor,
  createComputed,
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  startTransition,
  untrack,
} from 'solid-js'
import { css, cx } from 'styled-system/css'
import { SettingsIcon } from '@/components/Icon'
import * as s from './styles'

interface SettingsButtonProps {
  onClick?: () => void
}

export default function SettingsButton(props: SettingsButtonProps): JSX.Element {
  let $svg: SVGSVGElement | undefined

  const [isLoading, setIsLoading] = createSignal(false)

  createIconAnimation(() => $svg, isLoading)

  const handleClick = (): void => {
    if (isLoading()) return

    setIsLoading(true)
    startTransition(() => props.onClick?.())
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }

  return (
    <button
      class={cx(css(s.button), 'group')}
      type="button"
      aria-busy={isLoading()}
      aria-disabled={isLoading()}
      title={isLoading() ? 'Opening settings' : 'Open settings'}
      onClick={handleClick}
    >
      <SettingsIcon ref={$svg} aria-hidden="true" css={s.svg} />
    </button>
  )
}

function createIconAnimation(svg: Accessor<SVGSVGElement | undefined>, when: Accessor<boolean>): void {
  const [isRunning, setIsRunning] = createSignal(false)

  createComputed(() => {
    if (when()) setIsRunning(true)
  })

  // Wait for animation iteration to finish, then stop
  createEffect(() => {
    if (typeof Element.prototype.animate === 'undefined') {
      setIsRunning(false)
      return
    }

    const $el = untrack(svg)
    if ($el == null || !isRunning()) return

    const handleIterationFinish = (): void => {
      if (!untrack(when)) {
        setIsRunning(false)
      }
    }

    $el.addEventListener('animationiteration', handleIterationFinish)

    // Run
    $el.setAttribute('data-active', 'true')

    onCleanup(() => {
      $el.removeEventListener('animationiteration', handleIterationFinish)
      $el.removeAttribute('data-active')
    })
  })
}
