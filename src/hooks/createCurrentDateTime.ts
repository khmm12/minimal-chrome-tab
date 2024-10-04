import { type Accessor, createSignal } from 'solid-js'
import createPolled, { EveryClockMinute, EveryClockSecond, type PolledStrategy } from '@/hooks/createPolled'
import useTabActive from '@/hooks/useTabActive'

interface CurrentDateTimeConfig {
  update: PolledStrategy
}

const getDate = (): Date => new Date()
const isDateEqual = (a: Date, b: Date): boolean => a.valueOf() === b.valueOf()

export { EveryClockMinute, EveryClockSecond }

export default function createCurrentDateTime(config: CurrentDateTimeConfig): Accessor<Date> {
  const [dateTime, setDateTime] = createSignal(getDate(), { equals: isDateEqual })
  const update = (): Date => setDateTime(getDate())

  const isTabActive = useTabActive()

  createPolled({
    get enabled() {
      return isTabActive()
    },
    get every() {
      return config.update
    },
    onTick: update,
  })

  return dateTime
}
