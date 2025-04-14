import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  gap: '1rem',
})

export const formGroup = p.vstack.raw({
  width: 'full',
  gap: 0,
  alignItems: 'stretch',
})

export const label = css.raw({
  fontSize: '0.875rem',
  margin: '0 0 0.5rem',
})

export const input = css.raw({
  fontFamily: 'inherit',
  fontSize: '1rem',
  padding: '0.5rem 0.75rem',
  height: '2.5rem',
  color: { base: 'black', _dark: 'white' },
  bgColor: { base: 'white', _dark: 'neutral.700' },
  border: '1px solid',
  borderColor: { base: 'black', _dark: 'white' },
  borderRadius: '0.25rem',
  colorScheme: { base: 'light', _dark: 'dark' },
})

export const select = css.raw({
  ...input,
  appearance: 'none',
  bgRepeat: 'no-repeat',
  bgPosition: 'right 0.375rem center',
  bgImage: { base: 'var(--img-b)', _dark: 'var(--img-w)' },
  bgSize: '1.5rem 1.5rem',
  paddingRight: '2.25rem',
})

// Runtime
export const selectInline = {
  '--img-w': `url("${new URL('./unfold-icon-white.svg', import.meta.url).toString()}")`,
  '--img-b': `url("${new URL('./unfold-icon-black.svg', import.meta.url).toString()}")`,
}

export const button = css.raw({
  appearance: 'none',
  background: { base: 'none', _hover: { base: 'black/10', _dark: 'white/10' } },
  borderRadius: '0.25rem',
  border: '1px solid',
  borderColor: { base: 'black', _dark: 'white' },
  color: { base: 'black', _dark: 'white' },
  cursor: 'pointer',
  fontSize: '1rem',
  margin: '0.5rem 0 0',
  padding: '0.5rem 1.5rem',
})
