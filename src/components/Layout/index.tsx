import type { ComponentChildren, VNode } from 'preact'
import { cx } from '@linaria/core'
import { fontsClassName } from './components/Fonts'
import * as css from './styles'

interface LayoutProps {
  children?: ComponentChildren
}

export default function Layout(props: LayoutProps): VNode {
  const { children } = props

  return <div className={cx(css.global, fontsClassName, css.container)}>{children}</div>
}
