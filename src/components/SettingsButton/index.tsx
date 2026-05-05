import { type Accessor, action, createEffect, createOptimistic, createSignal, untrack } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { css, cx } from 'styled-system/css'
import { SettingsIcon } from '@/components/Icon'
import { supportsAnimations } from '@/utils/dom'
import * as s from './styles'

interface SettingsButtonProps {
  onClick?: (() => void) | (() => Promise<void>)
}

export default function SettingsButton(props: SettingsButtonProps): JSX.Element {
  let $svg: SVGSVGElement | undefined

  const [isLoading, setIsLoading] = createOptimistic(false)

  createIconAnimation(() => $svg, isLoading)

  const handleClick = action(async function* () {
    if (isLoading()) return

    setIsLoading(true)
    await props.onClick?.()
    yield
  })

  return (
    <button
      class={cx(css(s.button), 'group')}
      type="button"
      aria-busy={isLoading() ? 'true' : 'false'}
      aria-disabled={isLoading() ? 'true' : 'false'}
      title={isLoading() ? 'Opening settings' : 'Open settings'}
      onClick={noop(handleClick)}
    >
      <SettingsIcon ref={$svg} aria-hidden="true" css={s.svg} />
    </button>
  )
}

function createIconAnimation(svg: Accessor<SVGSVGElement | undefined>, when: Accessor<boolean>): void {
  const [isRunning, setIsRunning] = createSignal(false)

  createEffect(when, (shouldRun) => {
    if (shouldRun) setIsRunning(true)
  })

  // Wait for animation iteration to finish, then stop
  createEffect(
    () => ({ $el: svg(), isRunning: isRunning() }),
    ({ $el, isRunning: shouldRun }) => {
      if (!supportsAnimations()) {
        setIsRunning(false)
        return
      }

      if ($el == null || !shouldRun) return

      const handleIterationFinish = (): void => {
        if (!untrack(when)) {
          setIsRunning(false)
        }
      }

      $el.addEventListener('animationiteration', handleIterationFinish)

      // Run
      $el.setAttribute('data-active', 'true')

      return () => {
        $el.removeEventListener('animationiteration', handleIterationFinish)
        $el.removeAttribute('data-active')
      }
    },
  )
}

function noop(fn: () => Promise<void>): () => void {
  return () => {
    void fn()
  }
}
