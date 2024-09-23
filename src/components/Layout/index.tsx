import type { JSX } from 'solid-js'
import { css } from 'styled-system/css'
import * as s from './styles'

interface LayoutProps {
  children?: [header: JSX.Element, content: JSX.Element, footer: JSX.Element]
}

export default function Layout(props: LayoutProps): JSX.Element {
  return <div class={css(s.container)}>{props.children}</div>
}
