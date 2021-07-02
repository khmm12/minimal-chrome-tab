import { Accessor, createSignal } from 'solid-js'
import createInterval, { Every } from '@/hooks/createInterval'
import createTabActive from '@/hooks/createTabActive'

interface UseDateTimeConfig {
  every?: Every | Accessor<Every>
}

const getDate = (): Date => new Date()

export default function createDateTime(config?: UseDateTimeConfig): Accessor<Date> {
  const { every = 'second' } = config ?? {}

  const [dateTime, setDateTime] = createSignal(getDate())
  const update = (): Date => setDateTime(getDate())

  const isTabActive = createTabActive()

  createInterval(update, {
    every,
    enabled: isTabActive,
  })

  return dateTime
}
