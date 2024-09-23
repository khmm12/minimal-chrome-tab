import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  alignSelf: 'flex-start',
  alignItems: { base: 'flex-end', smDown: 'center' },
  justifyContent: 'center',
  gap: 0,
})

export const title = css.raw({
  fontSize: { base: '3.6rem', smDown: '3.2rem' },
  fontWeight: 'bold',
  textAlign: 'center',
  margin: { base: '0 0 2.4rem', smDown: '0 0 1.6rem' },
})

export const items = p.grid.raw({
  width: 'full',
  gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, auto))',
  gap: { base: '3.5rem', smDown: '1.6rem' },
  justifyContent: { base: 'flex-end', smDown: 'center' },
})
