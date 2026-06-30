import { Show } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { css, cx } from 'styled-system/css'
import createCurrentDateTime, { EveryClockMinute } from '@/hooks/createCurrentDateTime'
import createUniqueIds from '@/hooks/createUniqueIds'
import useSettings from '@/hooks/useSettings'
import type { MilestoneProgressStyle } from '@/shared/settings'
import asGetters from '@/utils/as-getters'
import Milestone from './components/Milestone'
import createTimeMilestones from './hooks/createTimeMilestones'
import * as s from './styles'

export default function TimeMilestones(): JSX.Element {
  const [settings] = useSettings()
  const now = createCurrentDateTime({ update: EveryClockMinute })

  const progressStyle = (): MilestoneProgressStyle => settings().milestoneProgressStyle

  const milestones = createTimeMilestones(asGetters({ now, birthDate: () => settings().birthDate }))

  const ids = createUniqueIds(['heading'])

  return (
    <div role="group" aria-describedby={ids.heading} aria-label="Time milestones" class={css(s.container)}>
      <h1 id={ids.heading} class={css(s.title)}>
        We're now through...
      </h1>
      <div class={cx(css(s.items))}>
        <Milestone style={progressStyle()} value={milestones.day} description="of day" />
        <Milestone style={progressStyle()} value={milestones.week} description="of week" />
        <Milestone style={progressStyle()} value={milestones.month} description="of month" />
        <Milestone style={progressStyle()} value={milestones.year} description="of year" />
        <Show when={milestones.birthday}>
          {(v) => <Milestone style={progressStyle()} value={v()} description="of b'day" />}
        </Show>
      </div>
    </div>
  )
}
