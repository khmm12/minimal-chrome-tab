import { defineConfig, defineGlobalStyles } from '@pandacss/dev'
import removeUnusedCSS from './lib/panda/remove-unused-css.js'
import * as theme from './src/theme/index.js'

export default defineConfig({
  preflight: false,
  importMap: 'styled-system',
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  conditions: {
    extend: {
      dark: '@media (prefers-color-scheme: dark)',
      typeDate: '&[type="date"]',
    },
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          Digital7Mono: { value: theme.fonts.Digital7Mono },
        },
        colors: buildPallete(theme.colors),
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
      fontSize: '10px',
      boxSizing: 'border-box',
      background: { base: 'white', _dark: 'dark1' },
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
    },
  },
})

function buildPallete<T extends Record<string, string>>(colors: T): Record<keyof T, { value: string }> {
  return Object.fromEntries(Object.entries(colors).map(([key, value]) => [key, { value }])) as Record<
    keyof T,
    { value: string }
  >
}
