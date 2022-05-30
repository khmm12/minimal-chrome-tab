import type { JSX } from 'solid-js'
import createDateTime from '@/hooks/createDateTime'
import createIntlFormatter from '@/hooks/createIntlFormatter'
import * as css from './styles'

export default function Time(): JSX.Element {
  const int = createIntlFormatter()

  const dateTime = createDateTime({ every: 'second' })

  return (
    <div class={css.container}>
      <span>{int.date(dateTime())}</span>
      <span>
        {int.date(dateTime(), {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })}
      </span>
    </div>
  )
}
