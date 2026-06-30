import { Loading } from 'solid-js'
import type { JSX } from '@solidjs/web'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'
import Time from '@/components/Time'
import TimeMilestones from '@/components/TimeMilestones'
import createApplyTheme from './hooks/createApplyTheme'
import createMountEffect from './hooks/createMountEffect'
import createSettingsDialog from './hooks/createSettingsDialog'

export default function Application(): JSX.Element {
  createMountEffect()
  createApplyTheme()

  const settingsDialog = createSettingsDialog()

  return (
    <>
      <Layout>
        <Loading>
          <TimeMilestones />
        </Loading>
        <Time />
        <Footer onSettingsRequest={settingsDialog.open} />
      </Layout>
      {settingsDialog.$el}
    </>
  )
}
