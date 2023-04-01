import { type JSX, Show } from 'solid-js'
import createCurrentDateTime, { EveryMinute } from '@/hooks/createCurrentDateTime'
import asGetters from '@/utils/as-getters'
import Milestone from './components/Milestone'
import createTimeMilestones from './hooks/createTimeMilestones'
import useBirthDate from './hooks/useBirthDate'
import * as css from './styles'

export default function TimeMilestones(): JSX.Element {
  const currentDateTime = createCurrentDateTime({ update: EveryMinute })
  const birthDate = useBirthDate()

  const milestones = createTimeMilestones(
    asGetters({
      currentDateTime,
      birthDate,
    })
  )

  return (
    <div class={css.container}>
      <h1 class={css.title}>We're now through...</h1>
      <div class={css.items}>
        <Milestone value={milestones.day} description="of day" />
        <Milestone value={milestones.week} description="of week" />
        <Milestone value={milestones.month} description="of month" />
        <Milestone value={milestones.year} description="of year" />
        <Show when={milestones.birthDate}>{(v) => <Milestone value={v()} description="of dob" />}</Show>
      </div>
    </div>
  )
}
