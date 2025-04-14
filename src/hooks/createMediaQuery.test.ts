import { renderHook } from '@solidjs/testing-library'
import createMediaQuery from './createMediaQuery'

describe('createMediaQuery', () => {
  it('returns true if media query is matched', () => {
    happyDOM.setViewport({ width: 1920, height: 1080 })

    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(matches()).toBeFalsy()
  })

  it('returns false if media query is not matched', () => {
    happyDOM.setViewport({ width: 320, height: 1080 })

    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(matches()).toBeTruthy()
  })

  it('is reactive', () => {
    happyDOM.setViewport({ width: 1920, height: 1080 })
    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(() => {
      happyDOM.setViewport({ width: 320, height: 1080 })
    }).to.change(() => matches())
  })

  it('has `query` property which returns media query string', () => {
    const matches = renderHook(() => createMediaQuery('(max-width: 599px)')).result

    expect(matches).to.have.property('query').which.eq('(max-width: 599px)')
  })
})
