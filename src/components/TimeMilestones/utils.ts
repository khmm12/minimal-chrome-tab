import {
  differenceInSeconds,
  getDaysInMonth,
  getDaysInYear,
  getYear,
  setYear,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear,
} from 'date-fns'
import { roundDown } from '@/utils/rounds'

const PRECISION = 2

type CalculateRelative<T> = (now: Date) => T

type GetSecondsInEpoch = CalculateRelative<number>
type GetStartOfEpoch = CalculateRelative<Date>

export type GetMilestone = CalculateRelative<number>

const getMinutesInHour = constant(60)
const getHoursInDay = constant(24)
const getDaysInWeek = constant(7)

const getSecondsInMinute = constant(60)
const getSecondsInHour = mul(getMinutesInHour, getSecondsInMinute)
const getSecondsInDay = mul(getHoursInDay, getSecondsInHour)
const getSecondsInWeek = mul(getDaysInWeek, getSecondsInDay)
const getSecondsInMonth = mul(getDaysInMonth, getSecondsInDay)
const getSecondsInYear = mul(getDaysInYear, getSecondsInDay)

export const getDayMilestone = milestone(getSecondsInDay, startOfDay)
export const getWeekMilestone = milestone(getSecondsInWeek, startOfISOWeek)
export const getMonthMilestone = milestone(getSecondsInMonth, startOfMonth)
export const getYearMilestone = milestone(getSecondsInYear, startOfYear)

export const getBirthDayMilestone = (birthDate: Date): GetMilestone =>
  milestone(getSecondsFromLastToThisYearDate(birthDate), getLastYearDate(birthDate))

function getSecondsFromLastToThisYearDate(date: Date): GetSecondsInEpoch {
  const getLastYear = getLastYearDate(date)

  return (now: Date) => {
    const lastYearDate = getLastYear(now)
    const nextYearDate = setYear(lastYearDate, getYear(lastYearDate) + 1)
    return differenceInSeconds(nextYearDate, lastYearDate)
  }
}

function getLastYearDate(date: Date): CalculateRelative<Date> {
  date = startOfDay(date)

  return (now: Date): Date => {
    const today = startOfDay(now)

    const thisYear = getYear(today)
    const dateOnThisYear = setYear(date, thisYear)
    const dateOnPreviousYear = setYear(date, thisYear - 1)
    return today > dateOnThisYear ? dateOnThisYear : dateOnPreviousYear
  }
}

function milestone(getSecondsInEpoch: GetSecondsInEpoch, getStartOfEpoch: GetStartOfEpoch): GetMilestone {
  return (now) => {
    const secondsSinceStart = differenceInSeconds(now, getStartOfEpoch(now))
    const value = secondsSinceStart / getSecondsInEpoch(now)
    return roundDown(value, PRECISION)
  }
}

function constant<T>(value: T): () => T {
  return () => value
}

function mul(...fns: GetSecondsInEpoch[]): GetSecondsInEpoch {
  return (dateTime) => fns.reduce((result, fn) => result * fn(dateTime), 1)
}
