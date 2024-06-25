import type { Tagged } from 'type-fest'

const ISODateRegex = /^\d{4}-\d{2}-\d{2}$/

export type ISODate = Tagged<string, 'ISODate'>

export function isISODate(value: unknown): value is ISODate {
  // Soft regexp, but fast.
  return typeof value === 'string' && ISODateRegex.test(value)
}
