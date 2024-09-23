import { For, type JSX, mergeProps } from 'solid-js'
import { round } from '@/utils/rounds'
import times from '@/utils/times'

interface BarProps {
  progress: number
  width?: number
  height?: number
  bars?: number
  barWidth?: number
}

export default function Bar(_props: BarProps): JSX.Element {
  const props = mergeProps({ width: 25, height: 5, bars: 10, barWidth: 1.2 }, _props)

  const d = buildPathCalculator(props)

  return (
    <svg
      role="figure"
      aria-hidden="true"
      preserveAspectRatio="xMinYMin"
      height="1.6rem"
      viewBox={`0 0 ${props.width} ${props.height}`}
    >
      <For each={times(props.bars)}>
        {(index) => <path stroke-width={props.barWidth} stroke="currentColor" d={d(index)} />}
      </For>
    </svg>
  )
}

function buildPathCalculator(p: {
  bars: number
  barWidth: number
  progress: number
  width: number
  height: number
}): (index: number) => string {
  const precision = 10
  const minHeight = 0.25

  return (index) => {
    const lineProgress = Math.min(Math.max(p.progress * p.bars - index, 0), 1)

    const barSpacing = (p.width - p.barWidth) / (p.bars - 1)
    const barHeight = minHeight + (p.height - minHeight) * lineProgress

    const x = round(barSpacing * index + p.barWidth / 2, precision)
    const y = round(p.height - barHeight, precision)

    return `M${x} ${y} L${x} ${p.height} Z`
  }
}
