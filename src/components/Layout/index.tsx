import { createSignal, JSX, onMount } from 'solid-js'
import { cx } from '@linaria/core'
import { fontsClassName } from './components/Fonts'
import * as css from './styles'

interface LayoutProps {
  children?: JSX.Element
}

export default function Layout(props: LayoutProps): JSX.Element {
  const [mounted, setMounted] = createSignal(false)
  onMount(() => setMounted(true))

  return (
    <div className={cx(css.global, fontsClassName, css.container, mounted() && css.mountedApp)}>{props.children}</div>
  )
}
