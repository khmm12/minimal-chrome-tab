import { renderHook } from '@solidjs/testing-library'
import createUniqueIds from './createUniqueIds'

const anyString = /.+/

describe('createUniqueIds', () => {
  it('creates dictionary with unique ids by given names', () => {
    const ids = renderHook(() => createUniqueIds(['a', 'b', 'c'])).result

    expect(ids).toMatchObject({
      a: expect.stringMatching(anyString),
      b: expect.stringMatching(anyString),
      c: expect.stringMatching(anyString),
    })

    expect(ids.a).not.equal(ids.b).and.equal(ids.c)
    expect(ids.b).not.toBe(ids.c)
  })
})
