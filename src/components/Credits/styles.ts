import { css } from 'styled-system/css'

export const container = css.raw({
  textAlign: 'right',
  fontSize: '1rem',
})

export const link = css.raw({
  display: 'inline-block',
  textDecoration: 'none',
  fontStyle: 'italic',
  textTransform: 'uppercase',
  color: { base: 'neutral.700', _dark: 'neutral.300', _hover: { base: 'black', _dark: 'white' } },
  transform: { base: 'scale(1)', _hover: 'scale(1.05)' },
  transition: '0.1s transform ease-out, 0.1s color ease-out',
})
