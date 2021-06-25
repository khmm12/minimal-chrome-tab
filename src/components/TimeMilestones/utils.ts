import {
  differenceInSeconds,
  getDaysInMonth,
  getDaysInYear,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear,
  getYear,
  setYear,
} from 'date-fns'
import round from '@/utils/round'

const PRECISION = 2

type GetSecondsInEpoch = (dateTime: Date) => number
type GetStartOfEpoch = (dateTime: Date) => Date

export type GetMilestone = (dateTime: Date) => number

const getMinutesInHour = constant(60)
const getHoursInDay = constant(24)
const getDaysInWeek = constant(7)

const getSecondsInMinute = constant(60)
const getSecondsInHour = mul(getMinutesInHour, getSecondsInMinute)
const getSecondsInDay = mul(getHoursInDay, getSecondsInHour)
const getSecondsInWeek = mul(getDaysInWeek, getSecondsInDay)
const getSecondsInMonth = mul(getDaysInMonth, getSecondsInDay)
const getSecondsInYear = mul(getDaysInYear, getSecondsInDay)

export const getDayMilestone = (): GetMilestone => milestone(getSecondsInDay, startOfDay)
export const getWeekMilestone = (): GetMilestone => milestone(getSecondsInWeek, startOfISOWeek)
export const getMonthMilestone = (): GetMilestone => milestone(getSecondsInMonth, startOfMonth)
export const getYearMilestone = (): GetMilestone => milestone(getSecondsInYear, startOfYear)
export const getBirthDayMilestone = (birthDate: Date): GetMilestone =>
  milestone(getSecondsInYearDate(birthDate), getPreviousDate(birthDate))

function getSecondsInYearDate(date: Date): GetSecondsInEpoch {
  const getOnPreviousYear = getPreviousDate(date)

  return (now: Date) => {
    const dateOnPreviousYear = getOnPreviousYear(now)
    const dateOnNextYear = setYear(dateOnPreviousYear, getYear(dateOnPreviousYear) + 1)
    return differenceInSeconds(dateOnNextYear, dateOnPreviousYear)
  }
}

function getPreviousDate(date: Date): (now: Date) => Date {
  date = startOfDay(date)

  return (now: Date): Date => {
    const today = startOfDay(now)

    const thisYear = getYear(today)
    const dateOnThisYear = setYear(date, thisYear)
    const dateOnPreviousYear = setYear(date, thisYear - 1)
    return today > dateOnThisYear ? dateOnThisYear : dateOnPreviousYear
  }
}

function milestone(getSecondInEpoch: GetSecondsInEpoch, getStartOfEpoch: GetStartOfEpoch): GetMilestone {
  return (now) => {
    const secondsSinceStart = differenceInSeconds(now, getStartOfEpoch(now))
    const value = secondsSinceStart / getSecondInEpoch(now)
    return round(value, PRECISION)
  }
}

function constant<T>(value: T): () => T {
  return () => value
}

function mul(...fns: GetSecondsInEpoch[]): GetSecondsInEpoch {
  return (dateTime) => fns.reduce((result, fn) => result * fn(dateTime), 1)
}
