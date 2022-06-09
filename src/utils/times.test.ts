import times from './times'

describe('times', () => {
  it('creates a list with specified number of items', () => {
    expect(times(10)).toHaveLength(10)
  })

  it('fills a list with indexes by default', () => {
    expect(times(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('supports factory to fill a list', () => {
    expect(times(5, (index) => ({ value: 2 * index }))).toEqual([
      { value: 0 },
      { value: 2 },
      { value: 4 },
      { value: 6 },
      { value: 8 },
    ])
  })
})
