const DataAttribute = 'localize'

const $els = document.querySelectorAll(`[data-${DataAttribute}]`)

$els.forEach(($el) => {
  if ($el instanceof HTMLElement) localize($el)
})

function localize($el: HTMLElement): void {
  const { [DataAttribute]: key } = $el.dataset
  if (key != null && key !== '') $el.innerHTML = chrome.i18n.getMessage(key)
}
