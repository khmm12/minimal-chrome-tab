import type { JSX } from 'solid-js'
import Layout from '@/components/Layout'
import TimeMilestones from '@/components/TimeMilestones'
import Time from '@/components/Time'
import Credits from '@/components/Credits'

export default function Application(): JSX.Element {
  return (
    <Layout>
      <TimeMilestones />
      <Time />
      <Credits />
    </Layout>
  )
}
