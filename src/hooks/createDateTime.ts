import { Accessor, createSignal } from 'solid-js'
import createInterval, { Every } from '@/hooks/createInterval'
import useTabActive from '@/hooks/useTabActive'

interface UseDateTimeConfig {
  every?: Every
}

const getDate = (): Date => new Date()

export default function createDateTime(config?: UseDateTimeConfig): Accessor<Date> {
  const [dateTime, setDateTime] = createSignal(getDate())
  const update = (): Date => setDateTime(getDate())

  const isTabActive = useTabActive()

  createInterval(update, {
    get every() {
      return config?.every ?? 'second'
    },
    get enabled() {
      return isTabActive()
    },
  })

  return dateTime
}
