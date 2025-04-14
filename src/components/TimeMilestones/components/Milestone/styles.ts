import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  alignItems: 'center',
  gap: 0,
})

export const value = css.raw({
  fontSize: { base: '4rem', smDown: '3.375rem' },
})

export const description = css.raw({
  margin: '0.625rem 0 0',
  fontSize: { base: '1.5rem', smDown: '1rem' },
  textTransform: 'lowercase',
})
