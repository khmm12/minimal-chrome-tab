import type { JSX } from 'solid-js'
import createSettingsStorage, { Settings } from '@/hooks/createSettingsStorage'
import Modal from '@/components/Modal'
import { SettingsIcon } from '@/components/Icon'
import ReactiveShow from '@/components/ReactiveShow'
import SettingsForm from './components/SettingsForm'

export interface SettingsDialogProps {
  onClose?: () => void
  onSaved?: () => void
}

export default function SettingsDialog(props: SettingsDialogProps): JSX.Element {
  const [settings, setSettings] = createSettingsStorage()

  const handleSubmit = async (values: Settings): Promise<void> => {
    await setSettings(values)
    props.onSaved?.()
  }

  return (
    <Modal icon={<SettingsIcon />} title="Settings" onClose={/* @once */ () => props.onClose?.()}>
      <ReactiveShow when={settings()}>
        {(initialValues) => <SettingsForm initialValues={initialValues()} onSubmit={handleSubmit} />}
      </ReactiveShow>
    </Modal>
  )
}
