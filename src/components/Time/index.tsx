import type { JSX } from 'solid-js'
import createDateTime from '@/hooks/createDateTime'
import createDateTimeFormatter from '@/hooks/createDateTimeFormatter'
import * as css from './styles'

export default function Time(): JSX.Element {
  const formatDate = createDateTimeFormatter()
  const formatTime = createDateTimeFormatter({
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  const dateTime = createDateTime({ every: 'second' })

  return (
    <div class={css.container}>
      <span>{formatDate(dateTime())}</span>
      <span>{formatTime(dateTime())}</span>
    </div>
  )
}
