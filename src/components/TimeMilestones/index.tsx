import { JSX, createMemo, Accessor } from 'solid-js'
import createDateTime from '@/hooks/createDateTime'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import Show from '@/components/Show'
import Milestone from './components/Milestone'
import {
  GetMilestone,
  getDayMilestone,
  getWeekMilestone,
  getMonthMilestone,
  getYearMilestone,
  getBirthDayMilestone,
} from './utils'
import * as css from './styles'

export default function TimeMilestones(): JSX.Element {
  const dateTime = createDateTime({ every: 'minute' })

  const [settings] = createSettingsStorage()

  const now = (fn: Accessor<GetMilestone>): Accessor<number> => createMemo(() => fn()(dateTime()))

  return (
    <div class={css.container}>
      <h1 class={css.title}>We're now through...</h1>
      <div class={css.items}>
        <Milestone value={now(getDayMilestone)()} description="of day" />
        <Milestone value={now(getWeekMilestone)()} description="of week" />
        <Milestone value={now(getMonthMilestone)()} description="of month" />
        <Milestone value={now(getYearMilestone)()} description="of year" />
        <Show when={settings()?.birthDate}>
          {(birthDate) => {
            const getMyBirthDayMilestone = createMemo(() => getBirthDayMilestone(new Date(birthDate())))
            return <Milestone value={now(getMyBirthDayMilestone)()} description="of dob" />
          }}
        </Show>
      </div>
    </div>
  )
}
