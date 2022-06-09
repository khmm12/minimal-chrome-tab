import { css } from '@linaria/core'
import { rgba } from 'polished'
import { black, white } from '@/theme/colors'
import { darkScheme } from '@/theme/media'

export const button = css`
  width: 3.2rem;
  height: 3.2rem;
  flex: 0 0 auto;
  color: ${rgba(black, 0.6)};
  appearance: none;
  padding: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  transform: rotate(0deg);
  transition: 0.1s color ease-out;

  &:hover {
    color: ${black};
  }

  @media ${darkScheme} {
    color: ${rgba(white, 0.6)};

    &:hover {
      color: ${white};
    }
  }
`

export const svg = css`
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
  transition: 0.1s transform ease-out;

  .${button}:hover > & {
    transform: rotate(22.5deg);
  }
`
