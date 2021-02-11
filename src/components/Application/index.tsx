import type { VNode } from 'preact'
import Layout from '@/components/Layout'
import TimeMilestones from '@/components/TimeMilestones'
import Time from '@/components/Time'
import Credits from '@/components/Credits'

export default function Application(): VNode {
  return (
    <Layout>
      <TimeMilestones />
      <Time />
      <Credits />
    </Layout>
  )
}
