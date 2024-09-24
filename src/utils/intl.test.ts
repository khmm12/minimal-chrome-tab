import * as intl from './intl'

describe('getDateFormatter', () => {
  it('returns Intl.DateTimeFormat instance', () => {
    expect(intl.getDateFormatter()).toBeInstanceOf(Intl.DateTimeFormat)
  })

  it('memoizes instance', () => {
    expect(intl.getDateFormatter()).toBe(intl.getDateFormatter())
  })

  it('memoizes instance by locales', () => {
    expect(intl.getDateFormatter('en-US'))
      .to.equal(intl.getDateFormatter(['en-US']))
      .and.not.equal(intl.getDateFormatter('en-GB'))
  })

  it('memoizes instance by options', () => {
    expect(intl.getDateFormatter('en-US', { hour: '2-digit' }))
      .to.equal(intl.getDateFormatter('en-US', { hour: '2-digit' }))
      .and.not.equal(intl.getDateFormatter('en-US', { hour: 'numeric' }))
      .and.not.equal(intl.getDateFormatter('en-GB', { hour: '2-digit' }))
  })
})

describe('getNumberFormatter', () => {
  it('returns Intl.NumberFormat instance', () => {
    expect(intl.getNumberFormatter()).toBeInstanceOf(Intl.NumberFormat)
  })

  it('memoizes instance', () => {
    expect(intl.getNumberFormatter()).toBe(intl.getNumberFormatter())
  })

  it('memoizes instance by locales', () => {
    expect(intl.getNumberFormatter('en-US'))
      .to.equal(intl.getNumberFormatter(['en-US']))
      .and.not.equal(intl.getNumberFormatter('en-GB'))
  })

  it('memoizes instance by options', () => {
    expect(intl.getNumberFormatter('en-US', { maximumFractionDigits: 2 }))
      .to.equal(intl.getNumberFormatter('en-US', { maximumFractionDigits: 2 }))
      .and.not.equal(intl.getNumberFormatter('en-US', { maximumFractionDigits: 1 }))
      .and.not.equal(intl.getNumberFormatter('en-GB', { maximumFractionDigits: 2 }))
  })
})
