import { css } from '@linaria/core'
import { beforeSmall } from '@/theme/media'

export const container = css`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  @media ${beforeSmall} {
    align-items: center;
  }
`

export const title = css`
  font-size: 3.6rem;
  margin: 0 0 2.4rem;

  @media ${beforeSmall} {
    font-size: 3.2rem;
    text-align: center;
    margin: 0 0 1.6rem;
  }
`

export const items = css`
  display: grid;
  width: 100%;
  grid-gap: 3.5rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, auto));
  justify-content: flex-end;

  @media ${beforeSmall} {
    justify-content: center;
    grid-gap: 1.6rem;
  }
`
