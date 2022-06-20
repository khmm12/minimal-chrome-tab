import type { JSX } from 'solid-js'
import * as css from './styles'

interface LayoutProps {
  children?: [header: JSX.Element, content: JSX.Element, footer: JSX.Element]
}

export default function Layout(props: LayoutProps): JSX.Element {
  return <div class={css.container}>{props.children}</div>
}
