import { css } from '@linaria/core'
import { white, black } from '@/theme/colors'
import { darkScheme } from '@/theme/media'
import { Digital7Mono } from '@/theme/fonts'

export const container = css`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  grid-gap: 4rem;
  padding: 4rem;
  font-family: ${Digital7Mono};
  line-height: 0.8;
  color: ${black};

  @media ${darkScheme} {
    color: ${white};
  }
`
