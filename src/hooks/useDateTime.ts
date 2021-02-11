import { useState } from 'preact/hooks'
import useInterval from '@/hooks/useInterval'
import useTabActive from '@/hooks/useTabActive'

const Interval = 1000 /* 1s */

export default function useDateTime(): Date {
  const [dateTime, setDateTime] = useState(getDate)
  const isActive = useTabActive()

  useInterval(() => setDateTime(getDate), isActive ? Interval : undefined)

  return dateTime
}

function getDate(): Date {
  return new Date()
}
