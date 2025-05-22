import { css } from 'styled-system/css'

export const backdrop = css.raw({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 10,
  background: { base: 'black/50', _dark: 'black/10' },
  _open: {
    animationName: 'fade-in',
    animationDuration: 'slow',
  },
  _closed: {
    animationName: 'fade-out',
    animationDuration: 'slow',
  },
})

export const overlay = css.raw({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 1.5rem',
  zIndex: 11,
})

export const dialog = css.raw({
  flex: '0 1 30rem',
  background: { base: 'white', _dark: 'neutral.700' },
  borderRadius: '0.25rem',
  boxShadow: { base: '0 0 0.5rem 0 {colors.black/48}', _dark: '0 0 0.5rem 0 {colors.black/60}' },
  color: { base: 'black', _dark: 'white' },
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1rem',
  _open: {
    animationStyle: 'scale-fade-in',
    animationDuration: 'slow',
  },
  _closed: {
    animationStyle: 'scale-fade-out',
    animationDuration: 'slow',
  },
})

export const header = css.raw({
  width: 'full',
  display: 'grid',
  gridTemplate: "'_ title close-button'",
  gridTemplateColumns: 'auto 1fr auto',
  padding: '1rem 1.5rem',
  borderBottom: '1px solid',
  borderBottomColor: { base: 'neutral.200', _dark: 'neutral.500' },
})

export const titleWrapper = css.raw({
  gridArea: 'title',
  textAlign: 'center',
  _empty: { display: 'none' },
})

export const icon = css.raw({
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '2rem',
  height: '2rem',
  padding: '0.25rem',
  fontSize: '1.5rem',
})

export const title = css.raw({
  display: 'inline-block',
  verticalAlign: 'middle',
  fontSize: '1.25rem',
  lineHeight: '2rem',
  margin: 0,
  fontWeight: 500,
})

export const closeButton = css.raw({
  gridArea: 'close-button',
  height: '2rem',
  width: '2rem',
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1rem',
  color: { base: 'neutral.500', _dark: 'neutral.400', _hover: { base: 'black', _dark: 'white' } },
})

export const closeButtonIcon = css.raw({
  flexShrink: 0,
})

export const body = css.raw({
  width: 'full',
  padding: '1rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
})
