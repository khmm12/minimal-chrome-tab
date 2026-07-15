import { render } from '@solidjs/testing-library'
import { CloseIcon, SettingsIcon } from '.'

describe('Icon', () => {
  describe('SettingsIcon', () => {
    it('renders correctly', () => {
      const svg = querySvg(render(() => <SettingsIcon />).container)

      expect(svg).toBeInTheDocument()
      expect(svg).toMatchSnapshot()
    })
  })

  describe('CloseIcon', () => {
    it('renders correctly', () => {
      const svg = querySvg(render(() => <CloseIcon />).container)

      expect(svg).toBeInTheDocument()
      expect(svg).toMatchSnapshot()
    })
  })

  describe('iconProps', () => {
    it('merges a custom class with the generated icon style class', () => {
      const baseTokens = classTokens(querySvg(render(() => <SettingsIcon />).container))
      expect(baseTokens.length).toBeGreaterThan(0)

      const svg = querySvg(render(() => <SettingsIcon class="my-class" />).container)

      expect(svg).toHaveClass(...baseTokens, 'my-class')
      expect(classTokens(svg)).toContain('my-class')
    })

    it('merges the css prop into the generated class', () => {
      const baseTokens = classTokens(querySvg(render(() => <SettingsIcon />).container))

      const svg = querySvg(render(() => <SettingsIcon css={{ color: 'red' }} />).container)

      expect(svg).toHaveClass(...baseTokens)
      expect(classTokens(svg).length).toBeGreaterThan(baseTokens.length)
    })
  })
})

function querySvg(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg')
  if (svg == null) throw new Error('Expected an <svg> element to be rendered')
  return svg
}

function classTokens(el: Element): string[] {
  const value = el.getAttribute('class') ?? ''
  return value.split(/\s+/).filter((token) => token.length > 0)
}
