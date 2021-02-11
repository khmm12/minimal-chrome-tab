import { createSignal } from 'solid-js'
import useEveryInterval, { Every } from '@/hooks/useEveryInterval'
import useTabActive from '@/hooks/useTabActive'

interface UseDateTimeConfig {
  every?: Every
}

const getDate = (): Date => new Date()

export default function useDateTime(config?: UseDateTimeConfig): () => Date {
  const { every = 'second' } = config ?? {}

  const [getDateTime, setDateTime] = createSignal(getDate())
  const update = (): Date => setDateTime(getDate())

  const isActive = useTabActive()
  useEveryInterval(update, {
    every,
    enabled: isActive,
  })

  return getDateTime
}
