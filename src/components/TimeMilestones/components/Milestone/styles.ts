import { css } from 'styled-system/css'
import * as p from 'styled-system/patterns'

export const container = p.vstack.raw({
  alignItems: 'center',
  gap: 0,
})

export const value = css.raw({
  fontSize: { base: '6.4rem', smDown: '5.4rem' },
})

export const description = css.raw({
  margin: '1rem 0 0',
  fontSize: { base: '2.4rem', smDown: '1.6rem' },
  textTransform: 'lowercase',
})
