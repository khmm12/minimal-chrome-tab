import { createEffect, onCleanup, untrack } from 'solid-js'
import { addMinutes, addSeconds, startOfMinute, startOfSecond } from 'date-fns'

export type Every = 'second' | 'minute'

type Tick = () => void

interface PolledConfig {
  enabled: boolean
  every: Every
  onTick: Tick
}

type PolledStrategy = (relative: number) => number

const Strategies: Record<Every, PolledStrategy> = {
  second: (relative) => addSeconds(startOfSecond(relative), 1).valueOf(),
  minute: (relative) => addMinutes(startOfMinute(relative), 1).valueOf(),
}

export default function createPolled(config: PolledConfig): void {
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
