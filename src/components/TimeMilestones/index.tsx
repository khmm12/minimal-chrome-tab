import { createMemo, Show } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { css, cx } from 'styled-system/css'
import createCurrentDateTime, { EveryClockMinute } from '@/hooks/createCurrentDateTime'
import createUniqueIds from '@/hooks/createUniqueIds'
import useSettings from '@/hooks/useSettings'
import { MilestoneProgressStyle } from '@/shared/settings'
import asGetters from '@/utils/as-getters'
import type { ISODate } from '@/utils/brands'
import Milestone, { MilestoneVariant } from './components/Milestone'
import createTimeMilestones from './hooks/createTimeMilestones'
import * as s from './styles'

export default function TimeMilestones(): JSX.Element {
  const [settings] = useSettings()
  const currentDateTime = createCurrentDateTime({ update: EveryClockMinute })

  const birthDate = createMemo(() => createDate(settings().birthDate), { equals: isDateEqual })
  const variant = (): MilestoneVariant => mapSettingsStyleToVariant(settings().milestoneProgressStyle)

  const milestones = createTimeMilestones(asGetters({ currentDateTime, birthDate }))

  const ids = createUniqueIds(['heading'])

  return (
    <div role="group" aria-describedby={ids.heading} aria-label="Time milestones" class={css(s.container)}>
      <h1 id={ids.heading} class={css(s.title)}>
        We're now through...
      </h1>
      <div class={cx(css(s.items))}>
        <Milestone variant={variant()} value={milestones.day} description="of day" />
        <Milestone variant={variant()} value={milestones.week} description="of week" />
        <Milestone variant={variant()} value={milestones.month} description="of month" />
        <Milestone variant={variant()} value={milestones.year} description="of year" />
        <Show when={milestones.birthday}>
          {(v) => <Milestone variant={variant()} value={v()} description="of b'day" />}
        </Show>
      </div>
    </div>
  )
}

function createDate(d: ISODate | undefined): Date | null {
  return d != null ? new Date(d) : null
}

function isDateEqual<T extends Date | undefined | null>(a: T, b: T): boolean {
  return a?.valueOf() === b?.valueOf()
}

function mapSettingsStyleToVariant(style: MilestoneProgressStyle): MilestoneVariant {
  switch (style) {
    case MilestoneProgressStyle.BarsCompact:
      return MilestoneVariant.BarsCompact
    case MilestoneProgressStyle.BarsDetailed:
      return MilestoneVariant.BarsDetailed
    case MilestoneProgressStyle.HorizontalBar:
      return MilestoneVariant.HorizontalBar
  }
}
