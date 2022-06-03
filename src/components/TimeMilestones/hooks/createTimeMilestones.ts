import { Accessor, createMemo } from 'solid-js'
import * as time from '../utils'

interface TimeMilestones {
  birthDate: Accessor<number | undefined>
  day: Accessor<number>
  month: Accessor<number>
  week: Accessor<number>
  year: Accessor<number>
}

interface CreateMilestonesConfig {
  currentDateTime: Date
  birthDate?: Date | string
}

export default function createTimeMilestones(config: CreateMilestonesConfig): TimeMilestones {
  const getBirthDateMilestone = createMemo((): time.GetMilestone | null => {
    const value = config.birthDate
    return value != null ? time.getBirthDayMilestone(new Date(value)) : null
  })

  return {
    birthDate: createMemo(() => getBirthDateMilestone()?.(config.currentDateTime)),
    day: createMemo(() => time.getDayMilestone(config.currentDateTime)),
    month: createMemo(() => time.getMonthMilestone(config.currentDateTime)),
    week: createMemo(() => time.getWeekMilestone(config.currentDateTime)),
    year: createMemo(() => time.getYearMilestone(config.currentDateTime)),
  }
}
