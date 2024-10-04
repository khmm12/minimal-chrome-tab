import { createSignal, type JSX, lazy, Suspense } from 'solid-js'
import ShowWithTransition from '@/components/ShowWithTransition'
import type { Settings } from '@/shared/settings'

const SettingsDialog = lazy(async () => await import('@/components/SettingsDialog'))

interface CreateSettingsDialogReturnValue {
  $el: JSX.Element
  open: () => void
}

interface CreateSettingsDialogOptions {
  settings: Settings
  onSave: (settings: Settings) => void | Promise<void>
}

export default function createSettingsDialog(opts: CreateSettingsDialogOptions): CreateSettingsDialogReturnValue {
  const [showSettings, setShowSettings] = createSignal(false)

  const handleSettingsRequest = (): void => {
    setShowSettings(true)
  }

  const handleSettingsClose = (): void => {
    setShowSettings(false)
  }

  const handleSettingsSave = async (values: Settings): Promise<void> => {
    await opts.onSave(values)
    setShowSettings(false)
  }

  return {
    $el: (
      <Suspense>
        <ShowWithTransition when={showSettings()}>
          <SettingsDialog settings={opts.settings} onSave={handleSettingsSave} onClose={handleSettingsClose} />
        </ShowWithTransition>
      </Suspense>
    ),
    open: handleSettingsRequest,
  }
}
