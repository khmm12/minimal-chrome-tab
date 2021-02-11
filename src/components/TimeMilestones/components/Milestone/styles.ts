import { css } from '@linaria/core'
import { beforeSmall } from '@/theme/media'

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const value = css`
  font-size: 6.4rem;

  @media ${beforeSmall} {
    font-size: 5.2rem;
  }
`

export const description = css`
  margin: 1rem 0 0;
  font-size: 2.4rem;
  text-transform: lowercase;

  @media ${beforeSmall} {
    font-size: 1.6rem;
  }
`
