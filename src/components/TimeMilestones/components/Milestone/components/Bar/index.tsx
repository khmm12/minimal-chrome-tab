import type { VNode } from 'preact'
import * as css from './styles'

interface BarProps {
  progress: number
  width?: number
  height?: number
}

export default function Bar(props: BarProps): VNode {
  const { progress, width = 20, height = 5 } = props

  const renderPath = (index: number): VNode => {
    const left = index / 10

    const lineProgress = Math.min((progress - left) * 10, 1)
    const x = (width / 10) * index + 1
    const y = Math.min(height - 0.5, round(height * (1 - lineProgress), 2))
    return <path key={index} className={css.path} d={`M${x} ${y} L${x} ${height} Z`} />
  }

  return (
    <svg className={css.svg} preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
      {new Array(10).fill(0).map((_v, index) => renderPath(index))}
    </svg>
  )
}

function round(number: number, precision: number): number {
  const base = 10 ** precision
  return Math.floor(number * base) / base
}
