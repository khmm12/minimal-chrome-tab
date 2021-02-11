import { css } from '@linaria/core'
import { Digital7Mono as FontName } from '@/theme/fonts'

export default css`
  :global() {
    @font-face {
      font-family: '${FontName}';
      src: url(./digital-7mono.woff2) format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: auto;
    }
  }
`
