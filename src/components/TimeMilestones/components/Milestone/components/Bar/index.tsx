import { For, JSX, mergeProps } from 'solid-js'
import round from '@/utils/round'
import times from '@/utils/times'
import * as css from './styles'

interface BarProps {
  progress: number
  width?: number
  height?: number
}

const Bars = 10

export default function Bar(_props: BarProps): JSX.Element {
  const props = mergeProps(_props, { width: 20, height: 5 })

  const bars = (): string[] => times(Bars, (index) => getPathD(index, props))

  return (
    <svg className={css.svg} preserveAspectRatio="none" viewBox={`0 0 ${props.width} ${props.height}`}>
      <For each={bars()}>{(d) => <path className={css.path} d={d} />}</For>
    </svg>
  )
}

function getPathD(index: number, props: { progress: number; width: number; height: number }): string {
  const { progress, width, height } = props

  const left = index / Bars
  const lineProgress = Math.min((progress - left) * Bars, 1)

  const x = (width / Bars) * index + 1
  const y = Math.min(height - 0.5, round(height * (1 - lineProgress), 2))

  return `M${x} ${y} L${x} ${height} Z`
}
