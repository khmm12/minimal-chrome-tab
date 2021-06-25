import { css } from '@linaria/core'
import { rgba } from 'polished'
import { black, dark1, lightGrey, white } from '@/theme/colors'
import { darkScheme } from '@/theme/media'

export const overlay = css`
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: ${rgba(black, 0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem 2.4rem;

  @media ${darkScheme} {
    background: ${rgba(black, 0.1)};
  }

  &.overlay-enter-active {
    opacity: 0.3;
  }

  &.overlay-enter-to {
    opacity: 1;
    transition: opacity 0.15s ease-out;
  }

  &.overlay-exit-active {
    opacity: 1;
  }

  &.overlay-exit-to {
    opacity: 0.3;
    transition: opacity 0.15s ease-out;
  }
`

export const dialog = css`
  flex: 0 1 48rem;
  background: ${white};
  border-radius: 0.4rem;
  font-size: 1.6rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0.8rem 0 ${rgba(black, 0.48)};
  color: ${black};

  @media ${darkScheme} {
    background: ${dark1};
    box-shadow: 0 0 0.8rem 0 ${rgba(white, 0.48)};
    color: ${white};
  }

  .${overlay}.overlay-enter-active & {
    transform: scale(0.6);
  }

  .${overlay}.overlay-enter-to & {
    transform: scale(1);
    transition: transform 0.15s ease-out;
  }

  .${overlay}.overlay-exit-active & {
    transform: scale(1);
  }

  .${overlay}.overlay-exit-to & {
    transform: scale(0.6);
    transition: transform 0.15s ease-out;
  }
`

export const header = css`
  width: 100%;
  display: grid;
  grid-template: '_ title close-button';
  grid-template-columns: auto 1fr auto;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid ${lightGrey};

  @media ${darkScheme} {
    border-bottom-color: ${black};
  }
`

export const title = css`
  font-size: 2rem;
  grid-area: title;
  text-align: center;
  margin: 0;
  font-weight: 500;
`

export const closeButton = css`
  grid-area: close-button;
  height: 3.2rem;
  width: 3.2rem;
  appearance: none;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${rgba(black, 0.54)};

  &:hover {
    color: ${black};
  }

  @media ${darkScheme} {
    color: ${rgba(white, 0.54)};

    &:hover {
      color: ${white};
    }
  }

  & > svg {
    width: 1.6rem;
    height: 1.6rem;

    & > path {
      fill: currentColor;
    }
  }
`

export const body = css`
  width: 100%;
  padding: 1.6rem 2.4rem;
  display: flex;
  flex-direction: column;
`
