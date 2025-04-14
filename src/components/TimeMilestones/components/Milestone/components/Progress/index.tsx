import { For, type JSX, mergeProps } from 'solid-js'
import { round } from '@/utils/rounds'
import times from '@/utils/times'

type ProgressProps = {
  progress: number
  width?: number
  height?: number
  minHeight?: number
} & ProgressVariantProps

type ProgressVariantProps =
  | {
      variant: ProgressVariant.Bars
      barWidth: number
      barsNumber: number
    }
  | {
      variant: ProgressVariant.HorizontalBar
    }

export enum ProgressVariant {
  Bars,
  HorizontalBar,
}

const precision = 10

export default function Progress(_props: ProgressProps): JSX.Element {
  const props = mergeProps({ width: 25, height: 5, minHeight: 0.25 }, _props)

  return (
    <svg
      role="figure"
      aria-hidden="true"
      preserveAspectRatio="xMinYMin"
      height="1rem"
      viewBox={`0 0 ${props.width} ${props.height}`}
    >
      {(() => {
        if (props.variant === ProgressVariant.HorizontalBar) {
          const [r1, r2] = buildRectsCalculator(props)
          return (
            <>
              <rect fill="currentColor" {...r1()} />
              <rect fill="currentColor" {...r2()} />
            </>
          )
        } else {
          const path = buildPathCalculator(props)
          return <For each={times(props.barsNumber)}>{(index) => <path stroke="currentColor" {...path(index)} />}</For>
        }
      })()}
    </svg>
  )
}

function buildPathCalculator(p: {
  barsNumber: number
  barWidth: number
  minHeight: number
  progress: number
  width: number
  height: number
}): (index: number) => JSX.PathSVGAttributes<SVGPathElement> {
  return (index) => {
    const lineProgress = Math.min(Math.max(p.progress * p.barsNumber - index, 0), 1)

    const barSpacing = (p.width - p.barWidth) / (p.barsNumber - 1)
    const barHeight = p.minHeight + (p.height - p.minHeight) * lineProgress

    const x = round(barSpacing * index + p.barWidth / 2, precision)
    const y = round(p.height - barHeight, precision)

    return {
      d: `M${x} ${y} L${x} ${p.height} Z`,
      'stroke-width': p.barWidth,
    }
  }
}

function buildRectsCalculator(p: {
  minHeight: number
  progress: number
  width: number
  height: number
}): [() => JSX.RectSVGAttributes<SVGRectElement>, () => JSX.RectSVGAttributes<SVGRectElement>] {
  return [
    () => ({
      x: 0,
      y: p.height - p.minHeight,
      width: p.width,
      height: p.minHeight,
    }),
    () => ({
      x: 0,
      y: 0,
      width: round(p.progress * p.width, precision),
      height: p.height,
    }),
  ]
}
