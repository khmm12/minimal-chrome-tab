import getCurrentLocale from '@/utils/get-current-locale'

export default function getDocumentLanguage(locale: string = getCurrentLocale()): string {
  return getISO639Language(locale)
}

function getISO639Language(language: string): string {
  const [, lang] = /(\w+)(-\w+)?/.exec(language) ?? []
  return lang
}
