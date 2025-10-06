import { describe, expect, it } from 'vitest'
import { isISODate } from './brands'

describe('isISODate', () => {
  it('returns true for ISO dates', () => {
    expect(isISODate('2024-12-31')).toBe(true)
  })

  it('returns false for full ISO dates', () => {
    expect(isISODate('2025-10-06T18:42:48.159Z')).toBe(false)
  })

  it('returns false for non ISO dates', () => {
    expect(isISODate('31/12/2024')).toBe(false)
  })

  it('returns false for non-string values', () => {
    expect(isISODate(1234)).toBe(false)
  })
})
