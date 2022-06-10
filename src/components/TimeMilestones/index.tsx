import { JSX, createMemo } from 'solid-js'
import asGetters from '@/utils/as-getters'
import createCurrentDateTime from '@/hooks/createCurrentDateTime'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import ReactiveShow from '@/components/ReactiveShow'
import createTimeMilestones from './hooks/createTimeMilestones'
import Milestone from './components/Milestone'
import * as css from './styles'

export default function TimeMilestones(): JSX.Element {
  const currentDateTime = createCurrentDateTime({ updateEvery: 'minute' })

  const [settings] = createSettingsStorage()
  const birthDate = createMemo(
    () => {
      const value = settings()?.birthDate
      return value != null && value !== '' ? new Date(value) : null
    },
    undefined,
    { equals: (a, b) => a?.valueOf() === b?.valueOf() }
  )

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
        <ReactiveShow when={milestones.birthDate}>{(v) => <Milestone value={v()} description="of dob" />}</ReactiveShow>
      </div>
    </div>
  )
}
