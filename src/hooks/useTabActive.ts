import { Accessor } from 'solid-js'
import createSubscription from '@/hooks/createSubscription'

const getTabState = (): boolean => !document.hidden

export default function useTabActive(): Accessor<boolean> {
  const isTabActive = createSubscription({
    getCurrentValue: getTabState,
    subscribe(fn) {
      document.addEventListener('visibilitychange', fn)
      return () => document.removeEventListener('visibilitychange', fn)
    },
  })

  return isTabActive
}
