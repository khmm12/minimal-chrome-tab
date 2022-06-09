import { formatISO } from 'date-fns'

export default function toISODate(value: Date | string | number): string {
  return formatISO(new Date(value), { representation: 'date' })
}
