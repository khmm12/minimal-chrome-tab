import type { JSX } from 'solid-js'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import { round } from '@/utils/rounds'
import Bar from './components/Bar'
import * as css from './styles'

interface MilestoneProps {
  value: number
  description: string
}

const PercentFormatOptions = {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions

export default function Milestone(props: MilestoneProps): JSX.Element {
  const format = createIntlFormatter()

  const formatPercent = (value: number): string => format.number(value, PercentFormatOptions)
  const formatValue = (value: number): string => formatPercent(round(value, 2)).replaceAll(/\s/g, '')

  return (
    <div role="group" class={css.container}>
      <span class={css.value}>{formatValue(props.value)}</span>
      <Bar progress={props.value} />
      <span class={css.description}>
        <span aria-hidden="true">...</span>
        {props.description}
      </span>
    </div>
  )
}
