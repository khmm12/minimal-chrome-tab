import type { JSX } from 'solid-js'
import { cx } from '@linaria/core'
import '@/components/Fonts'
import * as css from './styles'

interface LayoutProps {
  children?: [header: JSX.Element, content: JSX.Element, footer: JSX.Element]
}

export default function Layout(props: LayoutProps): JSX.Element {
  return <div class={cx(css.global, css.container)}>{props.children}</div>
}
