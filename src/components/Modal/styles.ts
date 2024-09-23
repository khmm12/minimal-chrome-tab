import { css } from 'styled-system/css'

export const overlay = css.raw({
  position: 'fixed',
  zIndex: 10,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.6rem 2.4rem',
  background: { base: 'black/50', _dark: 'black/10' },
})

export const dialog = css.raw({
  flex: '0 1 48rem',
  background: { base: 'white', _dark: 'dark2' },
  borderRadius: '0.4rem',
  boxShadow: { base: '0 0 0.8rem 0 {colors.black/48}', _dark: '0 0 0.8rem 0 {colors.black/60}' },
  color: { base: 'black', _dark: 'white' },
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1.6rem',
})

export const header = css.raw({
  width: 'full',
  display: 'grid',
  gridTemplate: "'_ title close-button'",
  gridTemplateColumns: 'auto 1fr auto',
  padding: '1.6rem 2.4rem',
  borderBottom: '1px solid',
  borderBottomColor: { base: 'lightGrey', _dark: 'gray' },
})

export const titleWrapper = css.raw({
  gridArea: 'title',
  textAlign: 'center',
  _empty: { display: 'none' },
})

export const icon = css.raw({
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '3.2rem',
  height: '3.2rem',
  padding: '0.4rem',
  fontSize: '2.4rem',
})

export const title = css.raw({
  display: 'inline-block',
  verticalAlign: 'middle',
  fontSize: '2rem',
  lineHeight: '3.2rem',
  margin: 0,
  fontWeight: 500,
})

export const closeButton = css.raw({
  gridArea: 'close-button',
  height: '3.2rem',
  width: '3.2rem',
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1.6rem',
  color: { base: 'black/54', _dark: 'white/54', _hover: { base: 'black', _dark: 'white' } },
})

export const body = css.raw({
  width: 'full',
  padding: '1.6rem 2.4rem',
  display: 'flex',
  flexDirection: 'column',
})
