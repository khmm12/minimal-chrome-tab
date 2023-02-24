import { type Accessor, createSignal, mergeProps } from 'solid-js'
import createPolled, { type Every } from '@/hooks/createPolled'
import useTabActive from '@/hooks/useTabActive'

interface CurrentDateTimeConfig {
  updateEvery?: Every
}

const Defaults = {
  updateEvery: 'second',
} satisfies CurrentDateTimeConfig

const getDate = (): Date => new Date()
const isDateEqual = (a: Date, b: Date): boolean => a.valueOf() === b.valueOf()

export default function createCurrentDateTime(config?: CurrentDateTimeConfig): Accessor<Date> {
  const resolved = mergeProps(Defaults, config)

  const [dateTime, setDateTime] = createSignal(getDate(), { equals: isDateEqual })
  const update = (): Date => setDateTime(getDate())

  const isTabActive = useTabActive()

  createPolled({
    get enabled() {
      return isTabActive()
    },
    get every() {
      return resolved.updateEvery
    },
    onTick: update,
  })

  return dateTime
}
