import toISODate from './to-iso-date'

describe('toISODate', () => {
  describe('date', () => {
    it('formats in ISO8601 without time part', () => {
      expect(toISODate(new Date('2022-03-04'))).toBe('2022-03-04')
      expect(toISODate(new Date('2022-06-09T03:50:28.519Z'))).toBe('2022-06-09')
      expect(toISODate(new Date('1861-03-03'))).toBe('1861-03-03')
    })
  })

  describe('string', () => {
    it('formats in ISO8601 without time part', () => {
      expect(toISODate('2022-03-04')).toBe('2022-03-04')
      expect(toISODate('2022-06-09T03:50:28.519Z')).toBe('2022-06-09')
      expect(toISODate('1861-03-03')).toBe('1861-03-03')
    })
  })

  describe('number', () => {
    it('formats in ISO8601 without time part', () => {
      expect(toISODate(1646352000000)).toBe('2022-03-04')
      expect(toISODate(1654746628519)).toBe('2022-06-09')
      expect(toISODate(-3434400000000)).toBe('1861-03-03')
    })
  })
})
