import { type JSX, Show } from 'solid-js'
import { css } from 'styled-system/css'
import createCurrentDateTime, { EveryMinute } from '@/hooks/createCurrentDateTime'
import createUniqueIds from '@/hooks/createUniqueIds'
import asGetters from '@/utils/as-getters'
import Milestone from './components/Milestone'
import createTimeMilestones from './hooks/createTimeMilestones'
import useBirthDate from './hooks/useBirthDate'
import * as s from './styles'

export default function TimeMilestones(): JSX.Element {
  const currentDateTime = createCurrentDateTime({ update: EveryMinute })
  const birthDate = useBirthDate()

  const milestones = createTimeMilestones(
    asGetters({
      currentDateTime,
      birthDate,
    }),
  )

  const ids = createUniqueIds(['heading'])

  return (
    <div role="group" aria-describedby={ids.heading} aria-label="Time milestones" class={css(s.container)}>
      <h1 id={ids.heading} class={css(s.title)}>
        We're now through...
      </h1>
      <div class={css(s.items)}>
        <Milestone value={milestones.day} description="of day" />
        <Milestone value={milestones.week} description="of week" />
        <Milestone value={milestones.month} description="of month" />
        <Milestone value={milestones.year} description="of year" />
        <Show when={milestones.birthDate}>{(v) => <Milestone value={v()} description="of dob" />}</Show>
      </div>
    </div>
  )
}
