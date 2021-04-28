import { JSX, For, mergeProps, createMemo } from 'solid-js'
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

  const bars = createMemo(() => times(Bars))

  return (
    <svg className={css.svg} preserveAspectRatio="none" viewBox={`0 0 ${props.width} ${props.height}`}>
      <For each={bars()}>
        {(index) => <Path index={index} progress={props.progress} width={props.width} height={props.height} />}
      </For>
    </svg>
  )
}

interface PathProps {
  index: number
  progress: number
  width: number
  height: number
}

function Path(props: PathProps): JSX.Element {
  const d = (): string => {
    const { index, progress, width, height } = props

    const left = index / Bars
    const lineProgress = Math.min((progress - left) * Bars, 1)

    const x = (width / Bars) * index + 1
    const y = Math.min(height - 0.5, round(height * (1 - lineProgress), 2))

    return `M${x} ${y} L${x} ${height} Z`
  }

  return <path className={css.path} d={d()} />
}
