import { css } from '@linaria/core'
import { darken } from 'polished'
import { dark1, white } from '@/theme/colors'
import { darkScheme } from '@/theme/media'

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const formGroup = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const label = css`
  font-size: 1.4rem;
  margin: 0 0 0.8rem;
`

export const input = css`
  font-family: inherit;
  font-size: 1.6rem;
  padding: 0.8rem 1.2rem;

  @media ${darkScheme} {
    color: ${white};
    background: ${darken(0.05, dark1)};
    border: none;
  }
`

export const button = css`
  margin: 2.4rem 0 0;
  padding: 0.8rem 2.4rem;
`
