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
import { SettingsIcon } from '@/components/Icon'
import * as css from './styles'

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
      class={css.button}
      type="button"
      aria-disabled={isLoading()}
      title={isLoading() ? 'Opening settings' : 'Open settings'}
      onClick={handleClick}
    >
      <SettingsIcon ref={$svg} aria-hidden="true" class={css.svg} />
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
    if (typeof AnimationEvent === 'undefined') return

    const $el = untrack(svg)
    if ($el == null || !isRunning()) return

    const handleAnimationIteration = (): void => {
      if (!untrack(when)) setIsRunning(false)
    }

    $el.addEventListener('animationiteration', handleAnimationIteration)
    $el.classList.add('is-animated')

    onCleanup(() => {
      $el.classList.remove('is-animated')
      $el.removeEventListener('animationiteration', handleAnimationIteration)
    })
  })
}
