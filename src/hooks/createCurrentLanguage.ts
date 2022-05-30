import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js'

export function createCurrentLanguage(): Accessor<string> {
  const [language, setLanguage] = createSignal(navigator.language)

  createEffect(() => {
    const abortCtrl = new AbortController()

    chrome.i18n.getAcceptLanguages((languages) => {
      if (languages.length > 0 && !abortCtrl.signal.aborted) setLanguage(languages[0])
    })

    onCleanup(() => abortCtrl.abort())
  })

  return language
}
