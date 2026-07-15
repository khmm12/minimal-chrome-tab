import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  gap: '1.25rem',
})

export const formGroup = p.vstack.raw({
  width: 'full',
  gap: '0.375rem',
  alignItems: 'stretch',
})

export const label = css.raw({
  fontSize: '0.8125rem',
  fontWeight: 500,
  letterSpacing: '0.01em',
  color: { base: 'neutral.600', _dark: 'neutral.300' },
})

export const input = css.raw({
  fontFamily: 'inherit',
  fontSize: '0.9375rem',
  lineHeight: 1.2,
  padding: '0 0.75rem',
  height: '2.75rem',
  width: 'full',
  color: { base: 'neutral.900', _dark: 'neutral.100' },
  bgColor: { base: 'white', _dark: 'neutral.800' },
  border: '1px solid',
  borderColor: { base: 'neutral.300', _dark: 'neutral.600' },
  borderRadius: '0.5rem',
  colorScheme: { base: 'light', _dark: 'dark' },
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  _hover: {
    borderColor: { base: 'neutral.400', _dark: 'neutral.500' },
  },
  _focusVisible: {
    borderColor: { base: 'neutral.900', _dark: 'neutral.100' },
    boxShadow: { base: '0 0 0 0.1875rem {colors.neutral.900/12}', _dark: '0 0 0 0.1875rem {colors.neutral.100/18}' },
  },
})

export const select = css.raw({
  ...input,
  appearance: 'none',
  cursor: 'pointer',
  bgRepeat: 'no-repeat',
  bgPosition: 'right 0.5rem center',
  bgImage: { base: 'var(--img-b)', _dark: 'var(--img-w)' },
  bgSize: '1.5rem 1.5rem',
  paddingRight: '2.5rem',
})

// Runtime
export const selectInline = {
  '--img-w': `url("${new URL('./unfold-icon-white.svg', import.meta.url).toString()}")`,
  '--img-b': `url("${new URL('./unfold-icon-black.svg', import.meta.url).toString()}")`,
}

export const button = css.raw({
  appearance: 'none',
  width: 'full',
  height: '2.75rem',
  marginTop: '0.25rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.9375rem',
  fontWeight: 500,
  letterSpacing: '0.01em',
  color: { base: 'white', _dark: 'neutral.900' },
  bgColor: { base: 'neutral.900', _dark: 'neutral.100' },
  outline: 'none',
  transition: 'background-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
  _hover: {
    bgColor: { base: 'neutral.700', _dark: 'white' },
  },
  _focusVisible: {
    boxShadow: { base: '0 0 0 0.1875rem {colors.neutral.900/25}', _dark: '0 0 0 0.1875rem {colors.neutral.100/30}' },
  },
  _disabled: {
    opacity: 0.55,
    cursor: 'default',
    _hover: {
      bgColor: { base: 'neutral.900', _dark: 'neutral.100' },
    },
  },
})
