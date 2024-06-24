import { css } from '@linaria/core'
import { darken, rgba } from 'polished'
import { black, white } from '@/theme/colors'
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
  color: ${black};
  border: 1px solid ${black};
  border-radius: 0.4rem;

  @media ${darkScheme} {
    color: ${white};
    background: ${darken(0.85, white)};
    border-color: ${white};
  }

  &[type='date'] {
    color-scheme: light;

    @media ${darkScheme} {
      color-scheme: dark;
    }
  }
`

export const button = css`
  appearance: none;
  background: none;
  border-radius: 0.4rem;
  border: 1px solid ${black};
  color: ${black};
  cursor: pointer;
  font-size: 1.4rem;
  margin: 2.4rem 0 0;
  padding: 0.8rem 2.4rem;

  &:hover {
    background: ${rgba(black, 0.1)};
  }

  @media ${darkScheme} {
    color: ${white};
    border-color: ${white};

    &:hover {
      background: ${rgba(white, 0.1)};
    }
  }
`
