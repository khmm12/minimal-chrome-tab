import { JSX, onCleanup } from 'solid-js'
import { SettingsIcon } from '@/components/Icon'
import * as css from './styles'

interface SettingsButtonProps {
  onClick?: () => void
}

export default function SettingsButton(props: SettingsButtonProps): JSX.Element {
  let $svg: SVGSVGElement | undefined
  let animation: Animation | undefined

  onCleanup(() => {
    animation?.cancel()
  })

  const handleClick = (): void => {
    if ($svg != null) {
      animation ??= animate($svg)
      animation?.play()
    }
    props.onClick?.()
  }

  return (
    <button class={css.button} type="button" title="Open settings" onClick={handleClick}>
      <SettingsIcon ref={$svg} aria-hidden class={css.svg} />
    </button>
  )
}

function animate($el: Element): Animation | undefined {
  if (typeof $el.animate === 'function')
    return $el.animate([{ transform: 'rotate(180deg)' }], {
      duration: 300,
      easing: 'ease-out',
    })
}
