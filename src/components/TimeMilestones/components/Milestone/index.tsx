import type { JSX } from 'solid-js'
import { css } from 'styled-system/css'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import { round } from '@/utils/rounds'
import Progress, { ProgressVariant } from './components/Progress'
import * as s from './styles'

interface MilestoneProps {
  value: number
  description: string
  variant: MilestoneVariant
}

export enum MilestoneVariant {
  BarsCompact,
  BarsDetailed,
  HorizontalBar,
}

const PercentFormatOptions = {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions

export const ProgressStyles = {
  [MilestoneVariant.BarsCompact]: {
    variant: ProgressVariant.Bars,
    barsNumber: 10,
    barWidth: 1.2,
    width: 25,
  },
  [MilestoneVariant.BarsDetailed]: {
    variant: ProgressVariant.Bars,
    barsNumber: 20,
    barWidth: 1,
    width: 30,
  },
  [MilestoneVariant.HorizontalBar]: {
    variant: ProgressVariant.HorizontalBar,
    width: 30,
  },
} as const

export default function Milestone(props: MilestoneProps): JSX.Element {
  const format = createIntlFormatter()

  const formatPercent = (value: number): string => format.number(value, PercentFormatOptions)
  const formatValue = (value: number): string => formatPercent(round(value, 2)).replaceAll(/\s/g, '')

  return (
    <div role="group" aria-label={props.description} class={css(s.container)}>
      <span class={css(s.value)}>{formatValue(props.value)}</span>
      <Progress progress={props.value} {...ProgressStyles[props.variant]} />
      <span class={css(s.description)}>
        <span aria-hidden="true">...</span>
        {props.description}
      </span>
    </div>
  )
}
