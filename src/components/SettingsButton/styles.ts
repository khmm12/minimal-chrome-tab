import { css } from 'styled-system/css'

export const button = css.raw({
  width: '2rem',
  height: '2rem',
  flex: '0 0 auto',
  color: { base: 'neutral.700', _dark: 'neutral.300', _hover: { base: 'black', _dark: 'white' } },
  appearance: 'none',
  padding: '0.25rem',
  background: 'transparent',
  border: 'none',
  cursor: { base: 'pointer', _disabled: 'default' },
  transition: '0.1s color ease-out',
  fontSize: '1.5rem',
})

export const svg = css.raw({
  transform: { base: 'rotate(0deg)', _groupHover: 'rotate(22.5deg)' },
  transition: '0.1s transform ease-out',
})
