import { renderHook } from '@test/helpers/solid'
import createMediaQuery from './createMediaQuery'

describe('createMediaQuery', () => {
  it('returns true if media query is matched', () => {
    window.resizeTo(1920, 1080)
    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(matches()).toBeFalsy()
  })

  it('returns false if media query is not matched', () => {
    window.resizeTo(320, 480)

    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(matches()).toBeTruthy()
  })

  it('is reactive', () => {
    window.resizeTo(1920, 1080)
    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(() => {
      window.resizeTo(320, 480)
    }).to.change(() => matches())
  })

  it('has `query` property which returns media query string', () => {
    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(matches).to.have.property('query').which.eq('(max-width: 599px)')
  })
})
