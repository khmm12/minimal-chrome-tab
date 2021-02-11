import { createSignal, onCleanup } from 'solid-js'

const getTabState = (): boolean => !document.hidden

export default function useTabActive(): () => boolean {
  const [getState, setState] = createSignal(getTabState())
  // eslint-disable-next-line no-void
  const update = (): void => void setState(getTabState())

  document.addEventListener('visibilitychange', update)
  onCleanup(() => document.removeEventListener('visibilitychange', update))

  return getState
}
