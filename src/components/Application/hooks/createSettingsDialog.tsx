import { createSignal, lazy, Loading } from 'solid-js'
import type { JSX } from '@solidjs/web'
import ShowWithTransition from '@/components/ShowWithTransition'
import useSettings from '@/hooks/useSettings'
import type { Settings } from '@/shared/settings'

const SettingsDialog = lazy(async () => await import('@/components/SettingsDialog'))

interface CreateSettingsDialogReturnValue {
  $el: JSX.Element
  open: () => void
}

export default function createSettingsDialog(): CreateSettingsDialogReturnValue {
  const [settings, setSettings] = useSettings()

  const [showSettings, setShowSettings] = createSignal(false)

  const handleSettingsRequest = (): void => {
    setShowSettings(true)
  }

  const handleSettingsClose = (): void => {
    setShowSettings(false)
  }

  const handleSettingsSave = async (values: Settings): Promise<void> => {
    await setSettings(values)
    setShowSettings(false)
  }

  return {
    $el: (
      <Loading>
        <ShowWithTransition when={showSettings()}>
          <SettingsDialog settings={settings()} onSave={handleSettingsSave} onClose={handleSettingsClose} />
        </ShowWithTransition>
      </Loading>
    ),
    open: handleSettingsRequest,
  }
}
