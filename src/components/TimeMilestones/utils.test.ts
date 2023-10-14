import * as D from 'date-fns/fp'
import * as R from 'remeda'
import { getBirthDayMilestone, getDayMilestone, getMonthMilestone, getWeekMilestone, getYearMilestone } from './utils'

describe('getDayMilestone', () => {
  it.each([
    ['00:00', 0],
    ['06:00', 0.25],
    ['12:00', 0.5],
    ['18:00', 0.75],
    ['23:59', 0.99],
  ])('at %s equals to %f', (time, expected) => {
    const [hours, minutes, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(new Date(), D.setHours(hours), D.setMinutes(minutes), D.setSeconds(seconds))

    expect(getDayMilestone(currentDateTime)).toBe(expected)
  })
})

describe('getMonthMilestone', () => {
  it.each([
    [1, '00:00', 0],
    [16, '00:00', 0.5],
    [30, '23:59', 0.99],
  ])('on %s at %s equals %f', (day, time, expected) => {
    const [hours, minutes, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(
      new Date(),
      D.setMonth(10),
      D.setDate(day),
      D.setHours(hours),
      D.setMinutes(minutes),
      D.setSeconds(seconds),
    )

    expect(getMonthMilestone(currentDateTime)).toBe(expected)
  })
})

describe('getWeekMilestone', () => {
  it.each([
    [1, '00:00', 0],
    [4, '13:00', 0.5],
    [7, '23:59', 0.99],
  ])('on %s day at %s equals %f', (dayOfWeek, time, expected) => {
    const [hours, minutes, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(
      new Date(),
      D.startOfWeek,
      D.setDay(dayOfWeek),
      D.setHours(hours),
      D.setMinutes(minutes),
      D.setSeconds(seconds),
    )

    expect(getWeekMilestone(currentDateTime)).toBe(expected)
  })
})

describe('getYearMilestone', () => {
  it.each([
    [1, 1, '00:00', 0],
    [7, 2, '23:59', 0.5],
    [12, 31, '23:59', 0.99],
  ])('in %d month %dst day at %s equals %f', (month, day, time, expected) => {
    const [hours, minutes, seconds = 0] = time.split(':').map(Number)
    const currentDateTime = R.pipe(
      new Date(),
      D.setMonth(month - 1),
      D.setDate(day),
      D.setHours(hours),
      D.setMinutes(minutes),
      D.setSeconds(seconds),
    )

    expect(getYearMilestone(currentDateTime)).toBe(expected)
  })
})

describe('getBirthDayMilestone', () => {
  it('handles not appeared birth date in this year', () => {
    const currentDateTime = new Date('2022-04-01')
    const birthDate = new Date('1970-06-31')

    expect(getBirthDayMilestone(birthDate)(currentDateTime)).toBe(0.75)
  })

  it('handles appeared birth date in this year', () => {
    const currentDateTime = new Date('2022-12-31')
    const birthDate = new Date('1970-06-31')

    expect(getBirthDayMilestone(birthDate)(currentDateTime)).toBe(0.5)
  })
})
