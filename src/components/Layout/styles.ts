import { css } from '@linaria/core'
import { white, dark1, black } from '@/theme/colors'
import { darkScheme } from '@/theme/media'
import { Digital7Mono } from '@/theme/fonts'

export const global = css`
  :global() {
    html {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-font-smoothing: antialiased;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      font-weight: 400;
      font-size: 10px;
      box-sizing: border-box;
      background: ${white};

      @media ${darkScheme} {
        background: ${dark1};
      }
    }

    body {
      margin: 0;
      touch-action: manipulation;
      font-family: inherit;
      font-size: inherit;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    html,
    body,
    #app {
      height: 100%;
      width: 100%;
    }
  }
`

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
