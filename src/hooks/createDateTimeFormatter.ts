import { createMemo } from 'solid-js'
import { createCurrentLanguage } from '@/hooks/createCurrentLanguage'

type Formatter = (date?: number | Date) => string

export default function createDateTimeFormatter(options?: Intl.DateTimeFormatOptions): Formatter {
  const currentLanguage = createCurrentLanguage()

  const formatter = createMemo(() => new Intl.DateTimeFormat(currentLanguage(), options))

  return (date) => formatter().format(date)
}
