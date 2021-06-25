import { JSX, createSignal, lazy, Suspense } from 'solid-js'
import Credits from '@/components/Credits'
import Layout from '@/components/Layout'
import SettingsButton from '@/components/SettingsButton'
import Time from '@/components/Time'
import TimeMilestones from '@/components/TimeMilestones'
import ShowWithTransition from '@/components/ShowWithTransition'
import * as css from './styles'

const SettingsDialog = lazy(async () => await import('@/components/SettingsDialog'))

export default function Application(): JSX.Element {
  const [showSettings, setShowSettings] = createSignal(false)

  const handleSettingsClick = (): boolean => setShowSettings(true)
  const handleSettingsClose = (): boolean => setShowSettings(false)

  return (
    <Layout>
      <TimeMilestones />
      <Time />
      <div className={css.footer}>
        <SettingsButton onClick={handleSettingsClick} />
        <Credits />
      </div>
      <ShowWithTransition when={showSettings()}>
        <Suspense>
          <SettingsDialog onClose={handleSettingsClose} />
        </Suspense>
      </ShowWithTransition>
    </Layout>
  )
}
