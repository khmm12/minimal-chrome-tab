import type { JSX } from 'solid-js'
import { css } from 'styled-system/css'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import { round } from '@/utils/rounds'
import Bar from './components/Bar'
import * as s from './styles'

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
    <div role="group" aria-label={props.description} class={css(s.container)}>
      <span class={css(s.value)}>{formatValue(props.value)}</span>
      <Bar progress={props.value} />
      <span class={css(s.description)}>
        <span aria-hidden="true">...</span>
        {props.description}
      </span>
    </div>
  )
}
