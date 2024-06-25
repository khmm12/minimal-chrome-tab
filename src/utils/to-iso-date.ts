import { formatISO } from 'date-fns'
import { type ISODate } from './brands'

export default function toISODate(value: Date | string | number): ISODate {
  return formatISO(new Date(value), { representation: 'date' }) as ISODate
}
