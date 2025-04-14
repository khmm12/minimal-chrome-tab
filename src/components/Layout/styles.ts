import * as p from 'styled-system/patterns'

export const container = p.grid.raw({
  height: 'full',
  width: 'full',
  gridTemplateRows: '1fr auto 1fr',
  gap: '2.5rem',
  padding: '2.5rem',
  lineHeight: 0.8,
  fontFamily: 'Digital7Mono',
  color: { base: 'black', _dark: 'white' },
})
