import { useRef, useEffect } from 'preact/hooks'

type Callback = () => void

export default function useInterval(callback: Callback, interval?: number): void {
  const callbackRef = useRef(callback)
  const lastCalledAt = useRef(0)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!interval) return

    let timeoutId: number | null = null

    const tick = (): void => {
      timeoutId = null
      lastCalledAt.current = Date.now()
      callbackRef?.current()
      schedule()
    }

    const schedule = (): void => {
      const elapsed = Date.now() - lastCalledAt.current
      const delay = elapsed > interval ? 0 : interval - elapsed

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
  }, [interval])
}
