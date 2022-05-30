export default function getCurrentLocale(): string {
  if (typeof chrome !== 'undefined') return chrome.i18n.getUILanguage()
  return navigator.language
}
