import type { JSX, VNode } from 'preact'
import { cx } from '@linaria/core'
import useDateTime from '@/hooks/useDateTime'
import Milestone from './components/Milestone'
import { getDayMilestone, getWeekMilestone, getMonthMilestone, getYearMilestone, getBirthDayMilstone } from './utils'
import * as css from './styles'

interface TimeMilestonesProps {
  className?: string
  style?: JSX.CSSProperties
}

export default function TimeMilestones(props: TimeMilestonesProps): VNode {
  const { className, style } = props
  const dateTime = useDateTime()

  return (
    <div className={cx(css.container, className)} style={style}>
      <h1 className={css.title}>We're now through...</h1>
      <div className={css.items}>
        <Milestone value={getDayMilestone(dateTime)} description="of day" />
        <Milestone value={getWeekMilestone(dateTime)} description="of week" />
        <Milestone value={getMonthMilestone(dateTime)} description="of month" />
        <Milestone value={getYearMilestone(dateTime)} description="of year" />
        <Milestone value={getBirthDayMilstone(dateTime)} description="of dob" />
      </div>
    </div>
  )
}
