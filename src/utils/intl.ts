const numberFormatterCache = new Map<string, Intl.NumberFormat>()
const dateFormatterCache = new Map<string, Intl.DateTimeFormat>()

type Locales = string | string[]

export function getDateFormatter(locales: Locales, options: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat {
  const key = cacheKey(locales, options)

  const cached = dateFormatterCache.get(key)
  if (cached != null) return cached

  const formatter = new Intl.DateTimeFormat(locales, options)
  dateFormatterCache.set(key, formatter)
  return formatter
}

export function getNumberFormatter(locales: Locales, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const key = cacheKey(locales, options)

  const cached = numberFormatterCache.get(key)
  if (cached != null) return cached

  const formatter = new Intl.NumberFormat(locales, options)
  numberFormatterCache.set(key, formatter)
  return formatter
}

function cacheKey<T extends {}>(locales?: string | string[], options: Partial<T> = {}): string {
  const localeKey = Array.isArray(locales) ? locales.slice().sort().join('-') : locales ?? '-'
  return `${localeKey}-${JSON.stringify(options)}`
}
