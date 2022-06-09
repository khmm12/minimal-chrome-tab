import type { JSX } from 'solid-js'

type IconProps = JSX.CoreSVGAttributes<SVGSVGElement> & JSX.StylableSVGAttributes

export function SettingsIcon(props: IconProps): JSX.Element {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
      <g fill="none" fill-rule="evenodd" clip-rule="evenodd" stroke="currentColor" stroke-width="5">
        <path d="M82.015 5.591a60.824 60.824 0 0 1 11.009 4.565l-1.359 26.56 26.561-1.357a60.772 60.772 0 0 1 4.564 11.007l-19.744 17.825 19.744 17.824a60.81 60.81 0 0 1-4.564 11.008l-26.561-1.357 1.359 26.56a60.82 60.82 0 0 1-11.009 4.564l-17.824-19.744-17.826 19.744a60.801 60.801 0 0 1-11.007-4.564l1.358-26.56-26.56 1.357a60.814 60.814 0 0 1-4.565-11.008l19.744-17.824L5.591 46.366a60.772 60.772 0 0 1 4.564-11.007l26.561 1.357-1.358-26.56a60.876 60.876 0 0 1 11.007-4.565l17.826 19.744L82.015 5.591Z" />
        <circle cx="64" cy="64" r="21" />
      </g>
    </svg>
  )
}
