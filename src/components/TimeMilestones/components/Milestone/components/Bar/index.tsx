import { createMemo, For, type JSX, mergeProps } from 'solid-js'
import { round } from '@/utils/rounds'
import times from '@/utils/times'
import * as css from './styles'

interface BarProps {
  progress: number
  width?: number
  height?: number
}

const Bars = times(10)

export default function Bar(_props: BarProps): JSX.Element {
  const props = mergeProps(_props, { width: 20, height: 5 })

  return (
    <svg class={css.svg} aria-hidden preserveAspectRatio="none" viewBox={`0 0 ${props.width} ${props.height}`}>
      <For each={Bars}>
        {(index) => {
          const d = createMemo((): string => {
            const { progress, width, height } = props
            const bars = Bars.length

            const left = index / bars
            const lineProgress = Math.min((progress - left) * bars, 1)

            const x = (width / bars) * index + 1
            const y = Math.min(height - 0.5, round(height * (1 - lineProgress), 2))

            return `M${x} ${y} L${x} ${height} Z`
          })

          return <path class={css.path} d={d()} />
        }}
      </For>
    </svg>
  )
}
