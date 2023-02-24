type Locales = string | string[]
type Formatters = Intl.DateTimeFormat | Intl.NumberFormat

type CacheFactory<TFormatter extends Formatters, TFormatOptions> = (
  locales?: Locales,
  options?: TFormatOptions
) => TFormatter
type FormatterCache<T extends Formatters> = Map<string, T>

const Cache = new WeakMap<Formatters, FormatterCache<Formatters>>()

export const getDateFormatter = /* @__PURE__ */ getFormatter<Intl.DateTimeFormat, Intl.DateTimeFormatOptions>(
  Intl.DateTimeFormat.prototype,
  (locales, options) => new Intl.DateTimeFormat(locales, options)
)

export const getNumberFormatter = /* @__PURE__ */ getFormatter<Intl.NumberFormat, Intl.NumberFormatOptions>(
  Intl.NumberFormat.prototype,
  (locales, options) => new Intl.NumberFormat(locales, options)
)

function getFormatter<TFormatter extends Formatters, TFormatOptions extends Record<string, any>>(
  formatterProto: TFormatter,
  factory: CacheFactory<TFormatter, TFormatOptions>
): (locales?: Locales, options?: TFormatOptions) => TFormatter {
  const cache = getFormatterCache(formatterProto)

  return (locales, options) => {
    const key = getCacheKey(locales, options)

    const cached = cache.get(key)
    if (cached != null) return cached

    const formatter = factory(locales, options)
    cache.set(key, formatter)
    return formatter
  }
}

function getFormatterCache<T extends Formatters>(formatterProto: T): FormatterCache<T> {
  const cached = Cache.get(formatterProto)
  if (cached != null) return cached as FormatterCache<T>

  const cache: FormatterCache<T> = new Map()
  Cache.set(formatterProto, cache)
  return cache
}

function getCacheKey<T extends Record<string, any>>(
  locales: string | string[] | undefined = '',
  options: Partial<T> = {}
): string {
  const separator = '-'
  const localeKey = Array.isArray(locales) ? locales.slice().sort().join(separator) : locales
  const optionsKey = JSON.stringify(options)

  let key = ''
  if (localeKey !== '') key += localeKey
  if (optionsKey !== '') key += (key !== '' ? separator : '') + optionsKey
  return key
}
