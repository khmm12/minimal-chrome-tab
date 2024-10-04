import type { JSX } from 'solid-js'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'
import Time from '@/components/Time'
import TimeMilestones from '@/components/TimeMilestones'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import createSettingsDialog from './hooks/createSettingsDialog'
import useMountEffect from './hooks/useMountEffect'

export default function Application(): JSX.Element {
  useMountEffect()

  const [settings, setSettings] = createSettingsStorage()

  const settingsDialog = createSettingsDialog({
    get settings() {
      return settings()
    },
    onSave: setSettings,
  })

  return (
    <>
      <Layout>
        <TimeMilestones birthDate={settings().birthDate} progressStyle={settings().milestoneProgressStyle} />
        <Time />
        <Footer onSettingsRequest={settingsDialog.open} />
      </Layout>
      {settingsDialog.$el}
    </>
  )
}
