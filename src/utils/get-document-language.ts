import getCurrentLocale from '@/utils/get-current-locale'

export default function getDocumentLanguage(locale: string = getCurrentLocale()): string {
  return getISO639Language(locale)
}

function getISO639Language(language: string): string {
  const { lang } = /^(?<lang>[a-z]{0,2})(?:[-_][a-zA-Z]{0,255})?/.exec(language)?.groups ?? {}

  if (lang == null || lang === '') throw new TypeError('The locale is not valid BCP 47 format')

  return lang
}
