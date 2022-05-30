import type { JSX } from 'solid-js'
import { DefaultLocale } from '@/config'
import createDateTime from '@/hooks/createDateTime'
import * as css from './styles'

const { format: formatDate } = new Intl.DateTimeFormat(DefaultLocale)
const { format: formatTime } = new Intl.DateTimeFormat(DefaultLocale, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

export default function Time(): JSX.Element {
  const dateTime = createDateTime({ every: 'second' })

  return (
    <div class={css.container}>
      <span>{formatDate(dateTime())}</span>
      <span>{formatTime(dateTime())}</span>
    </div>
  )
}
