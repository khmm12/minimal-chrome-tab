import { render } from '@solidjs/testing-library'
import Progress, { ProgressVariant } from '.'

describe('Progress', () => {
  describe('variant Bars', () => {
    it('renders one path per bar with clamped per-bar fill geometry', () => {
      const { container } = render(() => (
        <Progress variant={ProgressVariant.Bars} barsNumber={10} barWidth={1.2} width={25} progress={0.25} />
      ))

      const paths = Array.from(container.querySelectorAll('path'))
      expect(paths).toHaveLength(10)

      const ds = paths.map((p) => p.getAttribute('d'))
      // progress * barsNumber = 2.5 -> bars 0 and 1 are fully lit (lineProgress clamped to 1), y = 0 (top).
      expect(ds[0]).toBe('M0.6 0 L0.6 5 Z')
      expect(ds[1]).toBe('M3.2444444444 0 L3.2444444444 5 Z')
      // bar 2 is partially lit (lineProgress = 0.5), barHeight = 2.625 -> y = 2.375.
      expect(ds[2]).toBe('M5.8888888889 2.375 L5.8888888889 5 Z')
      // bars >= 3 are unlit (lineProgress clamped to 0) and sit at minHeight (0.25) -> y = 4.75.
      expect(ds[3]).toBe('M8.5333333333 4.75 L8.5333333333 5 Z')
      expect(ds[9]).toBe('M24.4 4.75 L24.4 5 Z')

      // every bar carries the configured bar width as its stroke width.
      expect(paths.map((p) => p.getAttribute('stroke-width'))).toEqual(Array.from({ length: 10 }, () => '1.2'))

      // a fully-lit bar (index 0) is taller (smaller y) than an unlit bar (index 4).
      expect(barY(paths[0])).toBeLessThan(barY(paths[4]))
    })

    it('keeps every bar at minHeight when progress is 0 (lower clamp)', () => {
      const { container } = render(() => (
        <Progress variant={ProgressVariant.Bars} barsNumber={10} barWidth={1.2} width={25} progress={0} />
      ))

      const paths = Array.from(container.querySelectorAll('path'))
      expect(paths).toHaveLength(10)
      // progress * barsNumber - index <= 0 for all bars -> Math.max floors lineProgress at 0.
      expect(paths.map((p) => barY(p))).toEqual(Array.from({ length: 10 }, () => 4.75))
    })

    it('fills every bar fully when progress is 1 (upper clamp)', () => {
      const { container } = render(() => (
        <Progress variant={ProgressVariant.Bars} barsNumber={10} barWidth={1.2} width={25} progress={1} />
      ))

      const paths = Array.from(container.querySelectorAll('path'))
      expect(paths).toHaveLength(10)
      // progress * barsNumber - index >= 1 for all bars -> Math.min caps lineProgress at 1, y = 0.
      expect(paths.map((p) => barY(p))).toEqual(Array.from({ length: 10 }, () => 0))
    })

    it('clamps bar height at full when progress exceeds 1', () => {
      const { container } = render(() => (
        <Progress variant={ProgressVariant.Bars} barsNumber={10} barWidth={1.2} width={25} progress={1.5} />
      ))

      const paths = Array.from(container.querySelectorAll('path'))
      // lineProgress would exceed 1 for every bar; Math.min still caps it at 1, y stays 0.
      expect(paths.map((p) => barY(p))).toEqual(Array.from({ length: 10 }, () => 0))
    })
  })

  describe('variant HorizontalBar', () => {
    it('renders a full-width background and a progress rect sized to progress', () => {
      const { container } = render(() => <Progress variant={ProgressVariant.HorizontalBar} width={30} progress={0.5} />)

      const rects = Array.from(container.querySelectorAll('rect'))
      expect(rects).toHaveLength(2)

      const [background, fill] = rects
      // background spans the full width at minHeight.
      expect(background?.getAttribute('x')).toBe('0')
      expect(background?.getAttribute('y')).toBe('4.75')
      expect(background?.getAttribute('width')).toBe('30')
      expect(background?.getAttribute('height')).toBe('0.25')
      // fill width === round(progress * width) === 15, full height, anchored at the top.
      expect(fill?.getAttribute('x')).toBe('0')
      expect(fill?.getAttribute('y')).toBe('0')
      expect(fill?.getAttribute('width')).toBe('15')
      expect(fill?.getAttribute('height')).toBe('5')
    })

    it('renders an empty progress rect when progress is 0', () => {
      const { container } = render(() => <Progress variant={ProgressVariant.HorizontalBar} width={30} progress={0} />)

      const rects = Array.from(container.querySelectorAll('rect'))
      expect(rects[0]?.getAttribute('width')).toBe('30')
      expect(rects[1]?.getAttribute('width')).toBe('0')
    })

    it('renders a full-width progress rect when progress is 1', () => {
      const { container } = render(() => <Progress variant={ProgressVariant.HorizontalBar} width={30} progress={1} />)

      const rects = Array.from(container.querySelectorAll('rect'))
      expect(rects[0]?.getAttribute('width')).toBe('30')
      expect(rects[1]?.getAttribute('width')).toBe('30')
    })
  })

  describe('default props', () => {
    it('merges default width and height into the viewBox', () => {
      const { container } = render(() => (
        <Progress variant={ProgressVariant.Bars} barsNumber={5} barWidth={1} progress={0.5} />
      ))

      // width/height/minHeight omitted -> defaults 25 / 5 / 0.25 applied by merge().
      expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 25 5')

      const paths = Array.from(container.querySelectorAll('path'))
      // the trailing unlit bar sits at default height - default minHeight = 5 - 0.25 = 4.75.
      expect(barY(paths[paths.length - 1])).toBe(4.75)
    })
  })
})

// The bar `d` attribute has the shape `M{x} {y} L{x} {height} Z`; the second
// token is the top y-coordinate (smaller y == taller, more-filled bar).
function barY(path: Element | undefined): number {
  const d = path?.getAttribute('d') ?? ''
  return Number(d.split(' ')[1])
}
