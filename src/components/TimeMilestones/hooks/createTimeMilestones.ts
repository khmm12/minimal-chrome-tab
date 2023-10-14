import { createMemo } from 'solid-js'
import asGetters from '@/utils/as-getters'
import * as time from '../utils'

interface TimeMilestones {
  readonly birthDate: number | undefined
  readonly day: number
  readonly month: number
  readonly week: number
  readonly year: number
}

interface CreateMilestonesConfig {
  readonly currentDateTime: Date
  readonly birthDate?: Date | null
}

export default function createTimeMilestones(config: CreateMilestonesConfig): TimeMilestones {
  const getBirthDateMilestone = createMemo((): time.GetMilestone | null =>
    config.birthDate != null ? time.getBirthDayMilestone(config.birthDate) : null,
  )

  return asGetters({
    birthDate: createMemo(() => getBirthDateMilestone()?.(config.currentDateTime)),
    day: createMemo(() => time.getDayMilestone(config.currentDateTime)),
    month: createMemo(() => time.getMonthMilestone(config.currentDateTime)),
    week: createMemo(() => time.getWeekMilestone(config.currentDateTime)),
    year: createMemo(() => time.getYearMilestone(config.currentDateTime)),
  })
}
