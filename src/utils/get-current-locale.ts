import chrome from '@/utils/chrome'

export default function getCurrentLocale(): string {
  return chrome()?.i18n?.getUILanguage() ?? navigator.language
}
