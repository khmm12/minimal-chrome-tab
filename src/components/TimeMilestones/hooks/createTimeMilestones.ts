import { createMemo } from 'solid-js'
import asGetters from '@/utils/as-getters'
import type { ISODate } from '@/utils/brands'
import * as time from '../utils'

interface TimeMilestones {
  readonly birthday: number | undefined
  readonly day: number
  readonly month: number
  readonly week: number
  readonly year: number
}

interface CreateMilestonesConfig {
  readonly now: Date
  readonly birthDate?: ISODate | undefined
}

export default function createTimeMilestones(config: CreateMilestonesConfig): TimeMilestones {
  const birthDate = createMemo(() => createDate(config.birthDate), { equals: isDateEqual })

  const getBirthdayMilestone = createMemo((): time.GetMilestone | null => {
    const date = birthDate()
    return date != null ? time.getBirthdayMilestone(date) : null
  })

  return asGetters({
    birthday: createMemo(() => getBirthdayMilestone()?.(config.now)),
    day: createMemo(() => time.getDayMilestone(config.now)),
    month: createMemo(() => time.getMonthMilestone(config.now)),
    week: createMemo(() => time.getWeekMilestone(config.now)),
    year: createMemo(() => time.getYearMilestone(config.now)),
  })
}

function createDate(date: ISODate | undefined): Date | null {
  return date != null ? new Date(date) : null
}

function isDateEqual(a: Date | null, b: Date | null): boolean {
  return a?.valueOf() === b?.valueOf()
}
