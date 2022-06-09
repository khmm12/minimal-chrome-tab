import { createEffect, onCleanup, untrack } from 'solid-js'
import { startOfHour, startOfMinute, startOfSecond, addSeconds, addMinutes, addHours } from 'date-fns'

export type Every = 'second' | 'minute' | 'hour'

type IntervalTick = () => void

interface IntervalConfig {
  enabled: boolean
  every: Every
  onTick: IntervalTick
}

type IntervalStrategy = (relative: number) => number

const Strategies: Record<Every, IntervalStrategy> = {
  second: (relative) => addSeconds(startOfSecond(relative), 1).valueOf(),
  minute: (relative) => addMinutes(startOfMinute(relative), 1).valueOf(),
  hour: (relative) => addHours(startOfHour(relative), 1).valueOf(),
}

export default function createInterval(config: IntervalConfig): void {
  let timeoutId: number | undefined
  let lastTickedAt = Date.now()

  const scheduledAt = (): number => Strategies[config.every](lastTickedAt)

  const schedule = (): void => {
    const delay = scheduledAt() - Date.now()
    if (delay <= 0) {
      queueMicrotask(tick)
    } else {
      timeoutId = setTimeout(tick, delay) as unknown as number
    }
  }

  const tick = (): void => {
    timeoutId = undefined
    untrack(() => config.onTick())
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
