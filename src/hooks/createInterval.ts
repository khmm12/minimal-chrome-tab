import { startOfHour, startOfMinute, startOfSecond, addSeconds, addMinutes, addHours } from 'date-fns'
import { createEffect, onCleanup } from 'solid-js'

export type Every = 'second' | 'minute' | 'hour'

type Callback = () => void

interface Config {
  enabled: boolean
  every: Every
}

type Strategy = (relative: number) => number

const Strategies: Record<Every, Strategy> = {
  second: (relative) => addSeconds(startOfSecond(relative), 1).valueOf(),
  minute: (relative) => addMinutes(startOfMinute(relative), 1).valueOf(),
  hour: (relative) => addHours(startOfHour(relative), 1).valueOf(),
}

export default function createInterval(fn: Callback, config: Config): void {
  let timeoutId: number | undefined
  let lastTickedAt = Date.now()

  const scheduledAt = (): number => Strategies[config.every](lastTickedAt)

  const schedule = (): void => {
    const delay = scheduledAt() - Date.now()
    if (delay <= 0) {
      tick()
    } else {
      timeoutId = setTimeout(tick, delay)
    }
  }

  const tick = (): void => {
    timeoutId = undefined
    fn()
    lastTickedAt = Date.now()
    schedule()
  }

  const dispose = (): void => {
    if (timeoutId != null) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  createEffect(() => {
    if (config.enabled) {
      schedule()
      onCleanup(() => dispose())
    }
  })
}
