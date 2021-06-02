import { startOfHour, startOfMinute, startOfSecond, addSeconds, addMinutes, addHours } from 'date-fns'
import { createEffect, createMemo, onCleanup } from 'solid-js'
import { SignalValue, unwrap } from '@/utils/solid'

export type Every = 'second' | 'minute' | 'hour'

type Callback = () => void

interface Config {
  enabled: SignalValue<boolean>
  every: Every | SignalValue<Every>
}

type Strategy = (relative: number) => number

const Strategies: Record<Every, Strategy> = {
  second: (relative) => addSeconds(startOfSecond(relative), 1).valueOf(),
  minute: (relative) => addMinutes(startOfMinute(relative), 1).valueOf(),
  hour: (relative) => addHours(startOfHour(relative), 1).valueOf(),
}

export default function useInterval(fn: Callback, config: Config): void {
  const { every, enabled } = config

  let timeoutId: NodeJS.Timeout | undefined
  let lastTickedAt = Date.now()

  const strategy = createMemo((): Strategy => Strategies[unwrap(every)])
  const scheduledAt = (): number => strategy()(lastTickedAt)

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
    if (enabled()) {
      schedule()
      onCleanup(() => dispose())
    }
  })
}
