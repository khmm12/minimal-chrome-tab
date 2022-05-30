import type { JSX } from 'solid-js'
import round from '@/utils/round'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import Bar from './components/Bar'
import * as css from './styles'

interface MilestoneProps {
  value: number
  description: string
}

const PercentFormatOptions = { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 }

export default function Milestone(props: MilestoneProps): JSX.Element {
  const intl = createIntlFormatter()

  const formatPercent = (value: number): string => intl.number(value, PercentFormatOptions)
  const formatValue = (value: number): string => formatPercent(round(value, 2)).replaceAll(/\s/g, '')

  return (
    <div class={css.container}>
      <span class={css.value}>{formatValue(props.value)}</span>
      <Bar progress={props.value} />
      <span class={css.description}>...{props.description}</span>
    </div>
  )
}
