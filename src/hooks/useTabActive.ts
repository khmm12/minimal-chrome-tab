import { useEffect, useState } from 'preact/hooks'

export default function useTabActive(): boolean {
  const [state, setState] = useState(getTabState)

  useEffect(() => {
    setState(getTabState)

    const callback = (): void => setState(getTabState)
    document.addEventListener('visibilitychange', callback)
    return () => document.removeEventListener('visibilitychange', callback)
  }, [])

  return state
}

function getTabState(): boolean {
  return !document.hidden
}
