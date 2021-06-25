import { JSX } from 'solid-js'
import createSettingsStorage, { Settings } from '@/hooks/createSettingsStorage'
import Modal from '@/components/Modal'
import Show from '@/components/Show'
import SettingsForm from './components/SettingsForm'

interface SettingsDialogProps {
  onClose: () => void
}

export default function SettingsDialog(props: SettingsDialogProps): JSX.Element {
  const [settings, setSettings] = createSettingsStorage()

  const handleSubmit = async (values: Settings): Promise<void> => {
    await setSettings(() => values)
    props.onClose()
  }

  return (
    <Modal title="Settings" onClose={props.onClose}>
      <Show when={settings()}>
        {(initialValues) => <SettingsForm initialValues={initialValues()} onSubmit={handleSubmit} />}
      </Show>
    </Modal>
  )
}
