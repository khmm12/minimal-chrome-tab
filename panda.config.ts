import { defineConfig, defineGlobalStyles } from '@pandacss/dev'
import removeUnusedCSS from './lib/panda/remove-unused-css.js'

export default defineConfig({
  preflight: false,
  importMap: 'styled-system',
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  conditions: {
    extend: {
      dark: '&[data-theme="dark"], [data-theme="dark"] &',
    },
  },
  theme: {
    extend: {
      containerNames: ['milestones'],
      tokens: {
        fonts: {
          Digital7Mono: { value: 'Digital-7Mono' },
        },
      },
    },
  },
  globalCss: defineGlobalStyles({
    html: {
      '-webkit-text-size-adjust': '100%',
      '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
      '-webkit-font-smoothing': 'antialiased',
      fontFamily:
        "'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
      fontWeight: 400,
      boxSizing: 'border-box',
      background: { base: 'white', _dark: 'neutral.800' },
    },
    body: {
      margin: 0,
      touchAction: 'manipulation',
      fontFamily: 'inherit',
      fontSize: 'inherit',
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit',
    },
    'html, body, #app': {
      height: 'full',
      width: 'full',
    },
  }),
  outdir: 'styled-system',
  hooks: {
    'cssgen:done': ({ artifact, content }) => {
      if (artifact === 'styles.css') return removeUnusedCSS(content)
      return content
    },
  },
})
