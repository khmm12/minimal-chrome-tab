import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  gap: '1.6rem',
})

export const formGroup = p.vstack.raw({
  width: 'full',
  gap: 0,
  alignItems: 'stretch',
})

export const label = css.raw({
  fontSize: '1.4rem',
  margin: '0 0 0.8rem',
})

export const input = css.raw({
  fontFamily: 'inherit',
  fontSize: '1.6rem',
  padding: '0.8rem 1.2rem',
  height: '4rem',
  color: { base: 'black', _dark: 'white' },
  bgColor: { base: 'white', _dark: 'neutral.700' },
  border: '1px solid',
  borderColor: { base: 'black', _dark: 'white' },
  borderRadius: '0.4rem',
  colorScheme: { base: 'light', _dark: 'dark' },
})

export const select = css.raw({
  ...input,
  appearance: 'none',
  bgRepeat: 'no-repeat',
  bgPosition: 'right 0.6rem center',
  bgImage: { base: 'var(--img-b)', _dark: 'var(--img-w)' },
  bgSize: '2.4rem 2.4rem',
  paddingRight: '3.6rem',
})

// Runtime
export const selectInline = {
  '--img-w': `url("${new URL('./unfold-icon-white.svg', import.meta.url).toString()}")`,
  '--img-b': `url("${new URL('./unfold-icon-black.svg', import.meta.url).toString()}")`,
}

export const button = css.raw({
  appearance: 'none',
  background: { base: 'none', _hover: { base: 'black/10', _dark: 'white/10' } },
  borderRadius: '0.4rem',
  border: '1px solid',
  borderColor: { base: 'black', _dark: 'white' },
  color: { base: 'black', _dark: 'white' },
  cursor: 'pointer',
  fontSize: '1.6rem',
  margin: '0.8rem 0 0',
  padding: '0.8rem 2.4rem',
})
