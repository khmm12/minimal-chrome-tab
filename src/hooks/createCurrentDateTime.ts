import { Accessor, createSignal, mergeProps } from 'solid-js'
import createInterval, { Every } from '@/hooks/createInterval'
import useTabActive from '@/hooks/useTabActive'

interface CurrentDateTimeConfig {
  updateEvery?: Every
}

const Defaults: Required<CurrentDateTimeConfig> = {
  updateEvery: 'second',
}

const getDate = (): Date => new Date()

export default function createCurrentDateTime(config?: CurrentDateTimeConfig): Accessor<Date> {
  const resolved = mergeProps(Defaults, config)

  const [dateTime, setDateTime] = createSignal(getDate())
  const update = (): Date => setDateTime(getDate())

  const isTabActive = useTabActive()

  createInterval({
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
