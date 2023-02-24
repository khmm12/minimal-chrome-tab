import { css } from '@linaria/core'
import { dark1, white } from '@/theme/colors'
import { darkScheme } from '@/theme/media'
import './fonts/Digital7Mono/index.css'

css`
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
