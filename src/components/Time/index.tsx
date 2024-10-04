import type { JSX } from 'solid-js'
import { css } from 'styled-system/css'
import createCurrentDateTime, { EveryClockSecond } from '@/hooks/createCurrentDateTime'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import * as s from './styles'

export default function Time(): JSX.Element {
  const format = createIntlFormatter()

  const dateTime = createCurrentDateTime({ update: EveryClockSecond })

  return (
    <time aria-live="polite" aria-atomic="true" aria-label="Current date time" class={css(s.container)}>
      <span aria-current="date" aria-label="Date">
        {format.date(dateTime())}
      </span>
      <span aria-current="time" aria-label="Time">
        {format.date(dateTime(), {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })}
      </span>
    </time>
  )
}
