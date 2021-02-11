import useEffect from '@/hooks/useEffect'

type Callback = () => void

export default function useInterval(callback: Callback, getInterval: () => number | undefined): void {
  let lastCalledAt = 0

  useEffect(() => {
    const interval = getInterval() ?? 0

    if (interval < 1) return

    let timeoutId: number | null = null

    const getDelay = (): number => {
      const elapsed = Date.now() - lastCalledAt
      return elapsed > interval ? 0 : interval - elapsed
    }

    const tick = (): void => {
      callback()
      lastCalledAt = Date.now()
      timeoutId = null
      schedule()
    }

    const schedule = (): void => {
      const delay = getDelay()

      if (delay > 0) {
        timeoutId = setTimeout(tick, delay)
      } else {
        tick()
      }
    }

    schedule()

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId)
    }
  }, [getInterval])
}
