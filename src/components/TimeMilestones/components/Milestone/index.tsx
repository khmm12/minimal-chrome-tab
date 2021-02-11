import type { JSX } from 'solid-js'
import Bar from './components/Bar'
import * as css from './styles'

interface MilestoneProps {
  value: number
  description: JSX.Element
}

const formatValue = (value: number): string => `${Math.floor(value * 100)}%`

export default function Milestone(props: MilestoneProps): JSX.Element {
  return (
    <div className={css.container}>
      <span className={css.value}>{formatValue(props.value)}</span>
      <Bar progress={props.value} />
      <span className={css.description}>...{props.description}</span>
    </div>
  )
}
