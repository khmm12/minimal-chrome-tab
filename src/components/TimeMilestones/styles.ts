import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  alignSelf: 'flex-start',
  alignItems: { base: 'flex-end', smDown: 'center' },
  justifyContent: 'center',
  gap: 0,
})

export const title = css.raw({
  fontSize: { base: '2.25rem', smDown: '2rem' },
  fontWeight: 'bold',
  textAlign: 'center',
  margin: { base: '0 0 1.5rem', smDown: '0 0 1rem' },
})

export const items = p.grid.raw({
  width: 'full',
  gridTemplateColumns: 'repeat(auto-fit, minmax(7.5rem, auto))',
  gap: { base: '2.25rem', smDown: '1rem' },
  justifyContent: { base: 'flex-end', smDown: 'center' },
})
