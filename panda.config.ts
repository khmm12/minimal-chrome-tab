import { defineAnimationStyles, defineConfig, defineGlobalStyles, defineKeyframes } from '@pandacss/dev'
import type { AnimationStyles } from '@pandacss/types'
import removeUnusedCSS from './lib/panda/remove-unused-css.js'

const animationStyles: AnimationStyles = defineAnimationStyles({
  'scale-fade-in': {
    value: {
      transformOrigin: 'var(--transform-origin)',
      animationName: 'scale-in, fade-in',
    },
  },
  'scale-fade-out': {
    value: {
      transformOrigin: 'var(--transform-origin)',
      animationName: 'scale-out, fade-out',
    },
  },
})

const keyframes = defineKeyframes({
  'fade-in': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  'fade-out': {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },
  'scale-in': {
    from: {
      scale: 0.6,
    },
    to: {
      scale: 1.0,
    },
  },
  'scale-out': {
    from: {
      scale: 1.0,
    },
    to: {
      scale: 0.6,
    },
  },
})

export default defineConfig({
  preflight: true,
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
      keyframes,
      animationStyles,
      tokens: {
        fonts: {
          Digital7Mono: { value: 'Digital-7Mono' },
        },
      },
    },
  },
  globalCss: defineGlobalStyles({
    html: {
      fontFamily:
        "'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
      fontWeight: 400,
      lineHeight: '1.2',
      background: { base: 'white', _dark: 'neutral.800' },
    },
    body: {
      // Chrome injects `font-family: system-ui; font-size: 75%` into the body of
      // new-tab override pages as an unlayered author style, which beats Panda's
      // layered globals. `!important` is the only reliable way to override it so
      // the page (and Portal-mounted dialogs, which live directly under body)
      // inherit our font instead of Chrome's.
      fontFamily: 'inherit !important',
      fontSize: 'inherit !important',
    },
    'html, body, #app': {
      height: 'full',
      width: 'full',
    },
  }),
  outdir: 'styled-system',
  hooks: {
    'cssgen:done'({ artifact, content }) {
      if (artifact === 'styles.css') return removeUnusedCSS(content)
      return content
    },
  },
})
