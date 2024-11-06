import { type Component, type JSX, mergeProps, splitProps } from 'solid-js'
import { css, cx } from 'styled-system/css'
import type { WithCss } from 'styled-system/types'

type ForbiddenProps = 'xmlns' | 'viewBox' | 'preserveAspectRatio'

type SVGProps = JSX.SvgSVGAttributes<SVGSVGElement>
type IconProps = Omit<SVGProps, ForbiddenProps> & WithCss

type Icon = Component<IconProps>

const iconStyles = css.raw({
  width: '1em',
  height: '1em',
})

export const SettingsIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" {...iconProps(props)}>
    <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="1.161">
      <path d="M15.45.658c.743.226 1.456.523 2.13.883l-.262 5.141 5.141-.262c.36.674.657 1.386.883 2.13L19.521 12l3.821 3.45a11.775 11.775 0 0 1-.884 2.13l-5.14-.262.262 5.14c-.674.36-1.386.658-2.13.884L12 19.52l-3.45 3.822a11.775 11.775 0 0 1-2.13-.883l.262-5.141-5.14.263a11.775 11.775 0 0 1-.884-2.131L4.48 12 .658 8.55c.226-.744.523-1.456.883-2.13l5.141.262-.262-5.14C7.094 1.18 7.807.883 8.551.657l3.45 3.822Z" />
      <circle cx="11.963" cy="11.963" r="4.065" />
    </g>
  </svg>
)

export const CloseIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" {...iconProps(props)}>
    <path
      fill="currentColor"
      fill-rule="nonzero"
      d="M24 2.417 21.583 0 12 9.583 2.417 0 0 2.417 9.583 12 0 21.583 2.417 24 12 14.417 21.583 24 24 21.583 14.417 12z"
    />
  </svg>
)

function iconProps(props: IconProps): SVGProps {
  const [sProps, rest] = splitProps(props, ['css', 'class'])
  return mergeProps(rest, {
    xmlns: 'http://www.w3.org/2000/svg',
    class: cx(css(iconStyles, sProps.css), sProps.class),
  })
}
