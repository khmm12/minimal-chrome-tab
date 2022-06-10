import type { JSX } from 'solid-js'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'
import Time from '@/components/Time'
import TimeMilestones from '@/components/TimeMilestones'
import createSettingsDialog from './hooks/createSettingsDialog'
import useMountEffect from './hooks/useMountEffect'
import useFaviconRefresh from './hooks/useFaviconRefresh'

export default function Application(): JSX.Element {
  useFaviconRefresh()
  useMountEffect()

  const settingsDialog = createSettingsDialog()

  return (
    <>
      <Layout>
        <TimeMilestones />
        <Time />
        <Footer onSettingsRequest={settingsDialog.open} />
      </Layout>
      {settingsDialog.$el}
    </>
  )
}
