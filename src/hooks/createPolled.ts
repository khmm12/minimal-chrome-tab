import { addMinutes, addSeconds, startOfMinute, startOfSecond } from 'date-fns'
import { createEffect, onCleanup, untrack } from 'solid-js'

type Tick = () => void

interface PolledConfig {
  enabled: boolean
  every: PolledStrategy
  onTick: Tick
}

export type PolledStrategy = (relative: number) => number

export const EverySecond: PolledStrategy = (relative) => addSeconds(startOfSecond(relative), 1).valueOf()
export const EveryMinute: PolledStrategy = (relative) => addMinutes(startOfMinute(relative), 1).valueOf()

export default function createPolled(config: PolledConfig): void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastTickedAt = Date.now()

  const scheduledAt = (): number => config.every(lastTickedAt)

  const schedule = (): void => {
    const delay = scheduledAt() - Date.now()
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
    })
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
      onCleanup(() => {
        dispose()
      })
    }
  })
}
