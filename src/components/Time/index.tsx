import type { VNode } from 'preact'
import { cx } from '@linaria/core'
import { DefaultLocale } from '@/config'
import useDateTime from '@/hooks/useDateTime'
import * as css from './styles'

interface TimeProps {
  className?: string
}

const { format: formatDate } = new Intl.DateTimeFormat(DefaultLocale)
const { format: formatTime } = new Intl.DateTimeFormat(DefaultLocale, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

export default function Time(props: TimeProps): VNode {
  const { className } = props

  const dateTime = useDateTime()

  return (
    <div className={cx(css.container, className)}>
      <span>{formatDate(dateTime)}</span>
      <span>{formatTime(dateTime)}</span>
    </div>
  )
}
