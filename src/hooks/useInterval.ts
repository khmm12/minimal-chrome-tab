import { startOfHour, startOfMinute, startOfSecond, addSeconds, addMinutes, addHours } from 'date-fns'
import useEffect from '@/hooks/useEffect'

type Callback = () => void

export type Every = 'second' | 'minute' | 'hour'

interface Config {
  enabled: () => boolean
  every: Every
}

const StartOfStrategies: Record<Every, (date: Date) => Date> = {
  second: startOfSecond,
  minute: startOfMinute,
  hour: startOfHour,
}

const AddTimeStrategis: Record<Every, (date: Date, value: number) => Date> = {
  second: addSeconds,
  minute: addMinutes,
  hour: addHours,
}

export default function useInterval(callback: Callback, config: Config): void {
  const { every, enabled } = config

  const addTime = AddTimeStrategis[every]
  const startOf = StartOfStrategies[every]

  const getNextCallAt = (): Date => addTime(startOf(new Date()), 1)

  let nextCallAt = getNextCallAt()

  const startInterval = (): { dispose: () => void } => {
    let timeoutId: NodeJS.Timeout | null = null

    const getDelay = (): number => {
      const delay = nextCallAt.valueOf() - Date.now()
      return Math.max(0, delay)
    }

    const tick = (): void => {
      callback()
      nextCallAt = getNextCallAt()
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

    return {
      dispose() {
        if (timeoutId !== null) clearTimeout(timeoutId)
      },
    }
  }

  useEffect(() => {
    if (enabled()) {
      const { dispose } = startInterval()
      return dispose
    }
  }, [enabled])
}
