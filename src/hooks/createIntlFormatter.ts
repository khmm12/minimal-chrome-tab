import * as intl from '@/utils/intl'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

interface IntlFormatter {
  date: (date?: number | Date, options?: Intl.DateTimeFormatOptions) => string
  number: (value: number | bigint, options?: Intl.NumberFormatOptions) => string
}

export default function createIntlFormatter(): IntlFormatter {
  const currentLanguage = useCurrentLanguage()

  return {
    date(value, options) {
      return intl.getDateFormatter(currentLanguage(), options).format(value)
    },
    number(value, options) {
      return intl.getNumberFormatter(currentLanguage(), options).format(value)
    },
  }
}
