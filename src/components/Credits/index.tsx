import type { JSX } from 'solid-js'
import { css } from 'styled-system/css'
import * as s from './styles'

const link = 'https://github.com/khmm12/minimal-chrome-tab'

export default function Credits(): JSX.Element {
  return (
    <div class={css(s.container)}>
      <a class={css(s.link)} href={link} target="_blank" rel="noreferrer">
        Made by khmm12
      </a>
    </div>
  )
}
