import { round, roundDown } from './rounds'

describe('round', () => {
  it('supports precision', () => {
    expect(round(0.444444, 2)).toBe(0.44)
    expect(round(0.444444, 3)).toBe(0.444)
  })

  it('rounds nearest value', () => {
    expect(round(0.6654, 3)).toBe(0.665)
    expect(round(0.6655, 3)).toBe(0.666)
    expect(round(0.6656, 3)).toBe(0.666)
  })
})

describe('roundDown', () => {
  it('supports precision', () => {
    expect(roundDown(0.444444, 2)).toBe(0.44)
    expect(roundDown(0.444444, 3)).toBe(0.444)
  })

  it('rounds to lowest value', () => {
    expect(roundDown(0.6654, 3)).toBe(0.665)
    expect(roundDown(0.6655, 3)).toBe(0.665)
    expect(roundDown(0.6656, 3)).toBe(0.665)
  })
})
