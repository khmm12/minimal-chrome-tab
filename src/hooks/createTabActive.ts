import { Accessor, createSignal, onMount, onCleanup } from 'solid-js'

const getTabState = (): boolean => !document.hidden

export default function createTabActive(): Accessor<boolean> {
  const [getState, setState] = createSignal(getTabState())

  const update = (): void => {
    setState(getTabState())
  }

  onMount(() => {
    update()
    document.addEventListener('visibilitychange', update)
  })

  onCleanup(() => document.removeEventListener('visibilitychange', update))

  return getState
}
