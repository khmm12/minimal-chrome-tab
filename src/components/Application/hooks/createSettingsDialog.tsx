import { createSignal, type JSX, lazy, Suspense } from 'solid-js'
import ShowWithTransition from '@/components/ShowWithTransition'

const SettingsDialog = lazy(async () => await import('@/components/SettingsDialog'))

interface CreateSettingsDialogReturnValue {
  $el: JSX.Element
  open: () => void
}

export default function createSettingsDialog(): CreateSettingsDialogReturnValue {
  const [showSettings, setShowSettings] = createSignal(false)

  const handleSettingsRequest = (): void => {
    setShowSettings(true)
  }

  const handleSettingsClose = (): void => {
    setShowSettings(false)
  }

  const handleSettingsSaved = (): void => {
    setShowSettings(false)
  }

  return {
    $el: (
      <Suspense>
        <ShowWithTransition when={showSettings()}>
          <SettingsDialog onClose={handleSettingsClose} onSaved={handleSettingsSaved} />
        </ShowWithTransition>
      </Suspense>
    ),
    open: handleSettingsRequest,
  }
}
