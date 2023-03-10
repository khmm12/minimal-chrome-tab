import type { JSX } from 'solid-js'
import createCurrentDateTime, { EverySecond } from '@/hooks/createCurrentDateTime'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import * as css from './styles'

export default function Time(): JSX.Element {
  const format = createIntlFormatter()

  const dateTime = createCurrentDateTime({ update: EverySecond })

  return (
    <div class={css.container}>
      <span aria-current="date" aria-live="polite" role="timer">
        {format.date(dateTime())}
      </span>
      <span aria-current="time" aria-live="polite" role="timer">
        {format.date(dateTime(), {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })}
      </span>
    </div>
  )
}
