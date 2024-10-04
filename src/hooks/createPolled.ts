import { createEffect, onCleanup, untrack } from 'solid-js'
import { addMinutes, addSeconds, startOfMinute, startOfSecond } from 'date-fns'

type Tick = () => void

interface PolledConfig {
  enabled: boolean
  every: PolledStrategy
  onTick: Tick
}

export interface PolledStrategy {
  scheduledAt: (relative: number) => number
  now: () => number
}

export const EveryClockSecond: PolledStrategy = {
  scheduledAt: (relative) => addSeconds(startOfSecond(relative), 1).valueOf(),
  now: () => Date.now(),
}

export const EveryClockMinute: PolledStrategy = {
  scheduledAt: (relative) => addMinutes(startOfMinute(relative), 1).valueOf(),
  now: () => Date.now(),
}

export default function createPolled(config: PolledConfig): void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastTickedAt = config.every.now()

  const schedule = (): void => {
    const delay = config.every.scheduledAt(lastTickedAt) - config.every.now()

    if (delay <= 0) {
      queueMicrotask(tick)
    } else {
      timeoutId = setTimeout(tick, delay)
    }
  }

  const tick = (): void => {
    timeoutId = undefined
    untrack(() => {
      config.onTick()
      lastTickedAt = config.every.now()
    })
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
      onCleanup(() => {
        dispose()
      })
    }
  })
}
