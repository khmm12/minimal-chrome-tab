import asGetters from './as-getters'

describe('asGetters', () => {
  it('creates object with reactive fields from accessors', () => {
    const accessors = { a: vi.fn().mockReturnValue(1), b: vi.fn().mockReturnValue(2) }
    const getters = asGetters(accessors)

    expect(getters.a).toBe(1) // read
    expect(getters.b).toBe(2) // read
    expect(accessors.a).toBeCalledTimes(1)
    expect(accessors.b).toBeCalledTimes(1)

    expect(getters.a).toBe(1) // read
    expect(accessors.a).toBeCalledTimes(2)
    expect(accessors.b).toBeCalledTimes(1)

    accessors.a.mockReturnValue(3)

    expect(getters.a).toBe(3) // read
    expect(accessors.a).toBeCalledTimes(3)
    expect(accessors.b).toBeCalledTimes(1)
  })
})
