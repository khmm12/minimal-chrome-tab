import * as D from 'date-fns/fp'
import * as R from 'remeda'
import { getBirthdayMilestone, getDayMilestone, getMonthMilestone, getWeekMilestone, getYearMilestone } from './utils'

describe('getDayMilestone', () => {
  it.each([
    ['00:00', 0],
    ['06:00', 0.25],
    ['12:00', 0.5],
    ['18:00', 0.75],
    ['23:59:59', 0.9999],
  ])('at %s equals to %f', (time, expected) => {
    const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(new Date(), D.setHours(hours), D.setMinutes(minutes), D.setSeconds(seconds))

    expect(getDayMilestone(currentDateTime)).toBeCloseTo(expected)
  })
})

describe('getMonthMilestone', () => {
  it.each([
    [1, '00:00', 0],
    [16, '00:00', 0.5],
    [30, '23:59:59', 0.9999],
  ])('on %s at %s equals %f', (day, time, expected) => {
    const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(
      new Date(),
      D.setMonth(10),
      D.setDate(day),
      D.setHours(hours),
      D.setMinutes(minutes),
      D.setSeconds(seconds),
    )

    expect(getMonthMilestone(currentDateTime)).toBeCloseTo(expected)
  })
})

describe('getWeekMilestone', () => {
  it.each([
    [1, '00:00', 0],
    [4, '12:00', 0.5],
    [7, '23:59:59', 0.9999],
  ])('on %s day at %s equals %f', (dayOfWeek, time, expected) => {
    const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(
      new Date(),
      D.startOfWeek,
      D.setDay(dayOfWeek),
      D.setHours(hours),
      D.setMinutes(minutes),
      D.setSeconds(seconds),
    )

    expect(getWeekMilestone(currentDateTime)).toBeCloseTo(expected)
  })
})

describe('getYearMilestone', () => {
  it.each([
    [1, 1, '00:00', 0],
    [7, 2, '23:59', 0.5],
    [12, 31, '23:59', 0.9999],
  ])('in %d month %dst day at %s equals %f', (month, day, time, expected) => {
    const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(
      new Date(),
      D.setMonth(month - 1),
      D.setDate(day),
      D.setHours(hours),
      D.setMinutes(minutes),
      D.setSeconds(seconds),
    )

    expect(getYearMilestone(currentDateTime)).toBeCloseTo(expected, 2)
  })
})

describe('getBirthDayMilestone', () => {
  it('handles not appeared birth date in this year', () => {
    const currentDateTime = new Date('2022-04-01')
    const birthDate = new Date('1970-06-31')

    expect(getBirthdayMilestone(birthDate)(currentDateTime)).toBeCloseTo(0.75)
  })

  it('handles appeared birth date in this year', () => {
    const currentDateTime = new Date('2022-12-31')
    const birthDate = new Date('1970-06-31')

    expect(getBirthdayMilestone(birthDate)(currentDateTime)).toBeCloseTo(0.5)
  })
})
