import { Accessor, createSignal } from 'solid-js'
import createInterval, { Every } from '@/hooks/createInterval'
import useTabActive from '@/hooks/useTabActive'

interface CreateCurrentDateTimeConfig {
  updateEvery?: Every
}

const getDate = (): Date => new Date()

export default function createCurrentDateTime(config?: CreateCurrentDateTimeConfig): Accessor<Date> {
  const [dateTime, setDateTime] = createSignal(getDate())
  const update = (): Date => setDateTime(getDate())

  const isTabActive = useTabActive()

  createInterval(update, {
    get every() {
      return config?.updateEvery ?? 'second'
    },
    get enabled() {
      return isTabActive()
    },
  })

  return dateTime
}
