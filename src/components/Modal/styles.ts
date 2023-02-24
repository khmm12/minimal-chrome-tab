import { css, type CSSProperties } from '@linaria/core'
import { darken, rgba } from 'polished'
import { black, dark1, lightGrey, white } from '@/theme/colors'
import { darkScheme } from '@/theme/media'

const overlayBackground = (opacity = 1): CSSProperties => ({
  background: rgba(black, 0.5 * opacity),
  [`@media ${darkScheme}`]: {
    background: rgba(black, 0.1 * opacity),
  },
})

export const overlay = css`
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem 2.4rem;
  ${overlayBackground()}

  &.overlay-enter-active {
    ${overlayBackground(0.3)}
  }

  &.overlay-enter-to {
    transition: background 0.15s ease-out;
    ${overlayBackground()}
  }

  &.overlay-exit-active {
    ${overlayBackground()}
  }

  &.overlay-exit-to {
    transition: background 0.15s ease-in;
    ${overlayBackground(0.3)}
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

  .overlay-enter-active > & {
    transform: scale(0.6);
    opacity: 0.3;
  }

  .overlay-enter-to > & {
    transform: scale(1);
    opacity: 1;
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
  }

  .overlay-exit-active > & {
    transform: scale(1);
    opacity: 1;
  }

  .overlay-exit-to > & {
    transform: scale(0.6);
    opacity: 0.3;
    transition: transform 0.15s ease-in, opacity 0.15s ease-in;
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
    border-bottom-color: ${darken(0.5, white)};
  }
`

export const titleWrapper = css`
  grid-area: title;
  text-align: center;

  &:empty {
    display: none;
  }
`

export const icon = css`
  display: inline-block;
  vertical-align: middle;
  width: 3.2rem;
  height: 3.2rem;
  padding: 0.4rem;

  & > * {
    width: 100%;
    height: 100%;
  }
`

export const title = css`
  display: inline-block;
  vertical-align: middle;
  font-size: 2rem;
  line-height: 3.2rem;
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
