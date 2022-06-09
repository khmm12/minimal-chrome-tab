import { round, roundDown } from './rounds'

describe('round', () => {
  it('supports precision', () => {
    expect(round(0.444444, 2)).toBe(0.44)
  })

  it('rounds nearest value', () => {
    expect(round(0.6666, 2)).toBe(0.67)
  })
})

describe('roundDown', () => {
  it('supports precision', () => {
    expect(roundDown(0.444444, 2)).toBe(0.44)
  })

  it('rounds to lowerest value', () => {
    expect(roundDown(0.6666, 2)).toBe(0.66)
  })
})
