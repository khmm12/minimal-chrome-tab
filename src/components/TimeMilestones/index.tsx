import { JSX, createMemo } from 'solid-js'
import createDateTime from '@/hooks/createDateTime'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import Show from '@/components/Show'
import Milestone from './components/Milestone'
import * as time from './utils'
import * as css from './styles'

export default function TimeMilestones(): JSX.Element {
  const dateTime = createDateTime({ every: 'minute' })

  const [settings] = createSettingsStorage()

  const getBirthDateMilestone = createMemo((): time.GetMilestone | null => {
    const value = settings()?.birthDate
    return value != null ? time.getBirthDayMilestone(new Date(value)) : null
  })

  const dayMilestone = createMemo(() => time.getDayMilestone(dateTime()))
  const weekMilestone = createMemo(() => time.getWeekMilestone(dateTime()))
  const monthMilestone = createMemo(() => time.getMonthMilestone(dateTime()))
  const yearMilestone = createMemo(() => time.getYearMilestone(dateTime()))
  const birthDateMilestone = createMemo(() => getBirthDateMilestone()?.(dateTime()))

  return (
    <div class={css.container}>
      <h1 class={css.title}>We're now through...</h1>
      <div class={css.items}>
        <Milestone value={dayMilestone()} description="of day" />
        <Milestone value={weekMilestone()} description="of week" />
        <Milestone value={monthMilestone()} description="of month" />
        <Milestone value={yearMilestone()} description="of year" />
        <Show when={birthDateMilestone()}>{(milestone) => <Milestone value={milestone()} description="of dob" />}</Show>
      </div>
    </div>
  )
}
