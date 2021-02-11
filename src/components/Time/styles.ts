import { css } from '@linaria/core'
import { beforeSmall } from '@/theme/media'

export const container = css`
  font-size: 8rem;
  text-align: center;

  & > span {
    display: block;
  }

  & > span + span {
    margin: 0.1em 0 0;
  }

  @media ${beforeSmall} {
    font-size: 6rem;
  }
`
