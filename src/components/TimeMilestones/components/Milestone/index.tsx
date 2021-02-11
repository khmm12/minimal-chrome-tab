import type { VNode, ComponentChildren } from 'preact'
import Bar from './components/Bar'
import * as css from './styles'

interface MilestoneProps {
  value: number
  description: ComponentChildren
}

const formatValue = (value: number): string => `${Math.floor(value * 100)}%`

export default function Milestone(props: MilestoneProps): VNode {
  const { value, description } = props

  return (
    <div className={css.container}>
      <span className={css.value}>{formatValue(value)}</span>
      <Bar progress={value} />
      <span className={css.description}>...{description}</span>
    </div>
  )
}
