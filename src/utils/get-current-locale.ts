export default function getCurrentLocale(): string {
  if (typeof chrome !== 'undefined' && typeof chrome.i18n !== 'undefined') return chrome.i18n.getUILanguage()
  return navigator.language
}
