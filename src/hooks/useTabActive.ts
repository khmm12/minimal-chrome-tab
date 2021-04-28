import { createSignal, onCleanup } from 'solid-js'
import type { SignalValue } from '@/utils/solid'

const getTabState = (): boolean => !document.hidden

export default function useTabActive(): SignalValue<boolean> {
  const [getState, setState] = createSignal(getTabState())

  const update = (): void => {
    setState(getTabState())
  }

  document.addEventListener('visibilitychange', update)
  onCleanup(() => document.removeEventListener('visibilitychange', update))

  return getState
}
