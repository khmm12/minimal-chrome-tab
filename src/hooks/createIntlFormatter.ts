import * as intl from '@/utils/intl'
import { createCurrentLanguage } from '@/hooks/createCurrentLanguage'

interface IntlFormatter {
  date: (date?: number | Date, options?: Intl.DateTimeFormatOptions) => string
  number: (value: number | bigint, options?: Intl.NumberFormatOptions) => string
}

export default function createIntlFormatter(): IntlFormatter {
  const currentLanguage = createCurrentLanguage()

  return {
    date(value, options) {
      return intl.getDateFormatter(currentLanguage(), options).format(value)
    },
    number(value, options) {
      return intl.getNumberFormatter(currentLanguage(), options).format(value)
    },
  }
}
