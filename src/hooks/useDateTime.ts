import { Accessor, createSignal } from 'solid-js'
import useInterval, { Every } from '@/hooks/useInterval'
import useTabActive from '@/hooks/useTabActive'

interface UseDateTimeConfig {
  every?: Every | Accessor<Every>
}

const getDate = (): Date => new Date()

export default function useDateTime(config?: UseDateTimeConfig): Accessor<Date> {
  const { every = 'second' } = config ?? {}

  const [dateTime, setDateTime] = createSignal(getDate())
  const update = (): Date => setDateTime(getDate())

  const isActive = useTabActive()

  useInterval(update, {
    every,
    enabled: isActive,
  })

  return dateTime
}
