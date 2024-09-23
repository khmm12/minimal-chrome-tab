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

    const animation = $el.animate(
      { easing: 'ease-out', transform: ['rotate(360deg)'] },
      { duration: 300, fill: 'both' },
    )

    const handleAnimationFinish = (): void => {
      if (!untrack(when)) {
        setIsRunning(false)
      } else {
        animation.play()
      }
    }

    animation.addEventListener('finish', handleAnimationFinish)

    onCleanup(() => {
      animation.removeEventListener('finish', handleAnimationFinish)
      animation.finish()
      animation.cancel()
    })
  })
}
