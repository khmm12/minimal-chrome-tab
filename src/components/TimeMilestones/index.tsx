import { createMemo, type JSX, Show } from 'solid-js'
import { css } from 'styled-system/css'
import createCurrentDateTime, { EveryMinute } from '@/hooks/createCurrentDateTime'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import createUniqueIds from '@/hooks/createUniqueIds'
import { MilestoneProgressStyle } from '@/shared/settings'
import asGetters from '@/utils/as-getters'
import type { ISODate } from '@/utils/brands'
import Milestone, { MilestoneVariant } from './components/Milestone'
import createTimeMilestones from './hooks/createTimeMilestones'
import * as s from './styles'

export default function TimeMilestones(): JSX.Element {
  const currentDateTime = createCurrentDateTime({ update: EveryMinute })

  const [settings] = createSettingsStorage()

  const birthDate = createMemo(() => createDate(settings().birthDate), null, { equals: isDateEqual })
  const variant = (): MilestoneVariant => mapSettingsStyleToVariant(settings().milestoneProgressStyle)

  const milestones = createTimeMilestones(asGetters({ currentDateTime, birthDate }))

  const ids = createUniqueIds(['heading'])

  return (
    <div role="group" aria-describedby={ids.heading} aria-label="Time milestones" class={css(s.container)}>
      <h1 id={ids.heading} class={css(s.title)}>
        We're now through...
      </h1>
      <div class={css(s.items)}>
        <Milestone variant={variant()} value={milestones.day} description="of day" />
        <Milestone variant={variant()} value={milestones.week} description="of week" />
        <Milestone variant={variant()} value={milestones.month} description="of month" />
        <Milestone variant={variant()} value={milestones.year} description="of year" />
        <Show when={milestones.birthDate}>
          {(v) => <Milestone variant={variant()} value={v()} description="of dob" />}
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
