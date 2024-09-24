import chrome from '@/utils/chrome'
import getDocumentLanguage from '@/utils/get-document-language'

const DataAttribute = 'l'

setDocumentLanguage()
localizeContent()

function setDocumentLanguage(): void {
  document.documentElement.lang = getDocumentLanguage()
}

function localizeContent(): void {
  const i18n = chrome()?.i18n

  if (i18n == null) return

  const localizeElement = ($el: HTMLElement): void => {
    const key = $el.dataset[DataAttribute]
    if (key != null && key !== '') $el.innerHTML = i18n.getMessage(key)
  }

  const $els = document.querySelectorAll(`[data-${DataAttribute}]`)
  for (const $el of $els) {
    if ($el instanceof HTMLElement) localizeElement($el)
  }
}
