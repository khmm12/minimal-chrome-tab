import getDocumentLanguage from '@/utils/get-document-language'

const DataAttribute = 'localize'

setDocumentLanguage()
if (typeof chrome !== 'undefined' && typeof chrome.i18n !== 'undefined') localizeContent()

function setDocumentLanguage(): void {
  document.documentElement.lang = getDocumentLanguage()
}

function localizeContent(): void {
  const $els = document.querySelectorAll(`[data-${DataAttribute}]`)

  $els.forEach(($el) => {
    if ($el instanceof HTMLElement) localizeElement($el)
  })
}

function localizeElement($el: HTMLElement): void {
  const { [DataAttribute]: key } = $el.dataset
  if (key != null && key !== '') $el.innerHTML = chrome.i18n.getMessage(key)
}
