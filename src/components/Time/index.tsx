import type { JSX } from 'solid-js'
import { DefaultLocale } from '@/config'
import useDateTime from '@/hooks/useDateTime'
import * as css from './styles'

const { format: formatDate } = new Intl.DateTimeFormat(DefaultLocale)
const { format: formatTime } = new Intl.DateTimeFormat(DefaultLocale, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

export default function Time(): JSX.Element {
  const dateTime = useDateTime({ every: 'second' })

  return (
    <div className={css.container}>
      <span>{formatDate(dateTime())}</span>
      <span>{formatTime(dateTime())}</span>
    </div>
  )
}
