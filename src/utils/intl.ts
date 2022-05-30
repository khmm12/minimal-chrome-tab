const numberFormatterCache = new Map<string, Intl.NumberFormat>()
const dateFormatterCache = new Map<string, Intl.DateTimeFormat>()

type Locales = string | string[]

export function getDateFormatter(locales: Locales, options: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat {
  const key = cacheKey(locales, options)
  const cachedFormatter = dateFormatterCache.get(key)
  if (cachedFormatter != null) return cachedFormatter

  const formatter = new Intl.DateTimeFormat(locales, options)
  dateFormatterCache.set(key, formatter)
  return formatter
}

export function getNumberFormatter(locales: Locales, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const key = cacheKey(locales, options)
  const cachedFormatter = numberFormatterCache.get(key)
  if (cachedFormatter != null) return cachedFormatter

  const formatter = new Intl.NumberFormat(locales, options)
  numberFormatterCache.set(key, formatter)
  return formatter
}

function cacheKey<T extends {}>(locales?: string | string[], options: Partial<T> = {}): string {
  const localeKey = Array.isArray(locales) ? locales.slice().sort().join('-') : locales ?? '-'
  return `${localeKey}-${JSON.stringify(options)}`
}
