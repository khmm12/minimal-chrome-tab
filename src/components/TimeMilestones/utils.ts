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
import { BirthDate } from '@/config'
import round from '@/utils/round'

const PRECISION = 2

type GetSecondsIn = (dateTime: Date) => number
type GetStartOf = (dateTime: Date) => Date
type GetMilestone = (dateTime: Date) => number

const getMinutesInHour = constant(60)
const getHoursInDay = constant(24)
const getDaysInWeek = constant(7)

const getSecondsInMinute = constant(60)
const getSecondsInHour = mul(getMinutesInHour, getSecondsInMinute)
const getSecondsInDay = mul(getHoursInDay, getSecondsInHour)
const getSecondsInWeek = mul(getDaysInWeek, getSecondsInDay)
const getSecondsInMonth = mul(getDaysInMonth, getSecondsInDay)
const getSecondsInYear = mul(getDaysInYear, getSecondsInDay)

export const getDayMilestone = makeMilestoneCalculator(getSecondsInDay, startOfDay)
export const getWeekMilestone = makeMilestoneCalculator(getSecondsInWeek, startOfISOWeek)
export const getMonthMilestone = makeMilestoneCalculator(getSecondsInMonth, startOfMonth)
export const getYearMilestone = makeMilestoneCalculator(getSecondsInYear, startOfYear)
export const getBirthDayMilestone = makeMilestoneCalculator(getSecondsInBirthDayYear, getPreviousBirthDate)

function getSecondsInBirthDayYear(dateTime: Date): number {
  const getSecondsInYearDate = makeGetSecondsInYearDate(new Date(BirthDate))
  return getSecondsInYearDate(dateTime)
}

function getPreviousBirthDate(dateTime: Date): Date {
  const getPreviousYearDate = makeGetPreviousYearDate(new Date(BirthDate))
  return getPreviousYearDate(dateTime)
}

function makeGetSecondsInYearDate(yearDate: Date): GetSecondsIn {
  const getPreviousYearDate = makeGetPreviousYearDate(yearDate)
  return function getSecondsInYearDate(dateTime: Date) {
    const previousYearDate = getPreviousYearDate(dateTime)
    const nextYearDate = setYear(previousYearDate, getYear(previousYearDate) + 1)
    return differenceInSeconds(nextYearDate, previousYearDate)
  }
}

function makeGetPreviousYearDate(yearDate: Date) {
  return function getPreviousYearDate(dateTime: Date): Date {
    const startOfGivenDay = startOfDay(dateTime)
    const startOfYearDateDay = startOfDay(yearDate)
    const givenYear = getYear(startOfGivenDay)

    const previousGivenYearDate = setYear(startOfYearDateDay, givenYear - 1)
    const givenYearDate = setYear(startOfYearDateDay, givenYear)
    return givenYearDate < startOfGivenDay ? givenYearDate : previousGivenYearDate
  }
}

function makeMilestoneCalculator(getSecondIn: GetSecondsIn, getStartOf: GetStartOf): GetMilestone {
  return function milestoneCalculator(dateTime) {
    const passedSeconds = differenceInSeconds(dateTime, getStartOf(dateTime))
    const value = passedSeconds / getSecondIn(dateTime)
    return round(value, PRECISION)
  }
}

function constant<T>(value: T): () => T {
  return () => value
}

function mul(...fns: GetSecondsIn[]): GetSecondsIn {
  return (dateTime) => fns.reduce((result, fn) => result * fn(dateTime), 1)
}
