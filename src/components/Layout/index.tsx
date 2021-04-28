import { createSignal, JSX, onMount } from 'solid-js'
import { cx } from '@linaria/core'
import { fontsClassName } from './components/Fonts'
import * as css from './styles'

interface LayoutProps {
  children?: JSX.Element
}

const containerCss = cx(css.global, fontsClassName, css.container)

export default function Layout(props: LayoutProps): JSX.Element {
  const [isMounted, setMounted] = createSignal(false)
  onMount(() => setMounted(true))

  return <div className={cx(containerCss, isMounted() && css.mountedApp)}>{props.children}</div>
}
