import { createDeferred, JSX } from 'solid-js'
import useDateTime from '@/hooks/useDateTime'
import Milestone from './components/Milestone'
import { getDayMilestone, getWeekMilestone, getMonthMilestone, getYearMilestone, getBirthDayMilestone } from './utils'
import * as css from './styles'

export default function TimeMilestones(): JSX.Element {
  const dateTime_ = useDateTime({ every: 'minute' })
  const dateTime = createDeferred(dateTime_, { timeoutMs: 60 * 1_000 })

  return (
    <div className={css.container}>
      <h1 className={css.title}>We're now through...</h1>
      <div className={css.items}>
        <Milestone value={getDayMilestone(dateTime())} description="of day" />
        <Milestone value={getWeekMilestone(dateTime())} description="of week" />
        <Milestone value={getMonthMilestone(dateTime())} description="of month" />
        <Milestone value={getYearMilestone(dateTime())} description="of year" />
        <Milestone value={getBirthDayMilestone(dateTime())} description="of dob" />
      </div>
    </div>
  )
}
