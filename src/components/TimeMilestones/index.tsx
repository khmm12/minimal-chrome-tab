import type { JSX } from 'solid-js'
import createCurrentDateTime from '@/hooks/createCurrentDateTime'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import Show from '@/components/Show'
import createTimeMilestones from './hooks/createTimeMilestones'
import Milestone from './components/Milestone'
import * as css from './styles'

export default function TimeMilestones(): JSX.Element {
  const [settings] = createSettingsStorage()
  const currentDateTime = createCurrentDateTime({ updateEvery: 'minute' })

  const milestones = createTimeMilestones({
    get currentDateTime() {
      return currentDateTime()
    },
    get birthDate() {
      return settings()?.birthDate
    },
  })

  return (
    <div class={css.container}>
      <h1 class={css.title}>We're now through...</h1>
      <div class={css.items}>
        <Milestone value={milestones.day()} description="of day" />
        <Milestone value={milestones.week()} description="of week" />
        <Milestone value={milestones.month()} description="of month" />
        <Milestone value={milestones.year()} description="of year" />
        <Show when={milestones.birthDate()}>
          {(milestone) => <Milestone value={milestone()} description="of dob" />}
        </Show>
      </div>
    </div>
  )
}
