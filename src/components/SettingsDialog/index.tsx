import { type Accessor, type JSX, Suspense } from 'solid-js'
import { SettingsIcon } from '@/components/Icon'
import Modal from '@/components/Modal'
import createSettingsStorage, { type Settings } from '@/hooks/createSettingsStorage'
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
    <Modal icon={<SettingsIcon />} title="Settings" onClose={props.onClose}>
      <Suspense fallback={<span aria-busy>Loading</span>}>
        {/* Trigger suspense */ read(settings)}
        <SettingsForm initialValues={settings()} onSubmit={handleSubmit} />
      </Suspense>
    </Modal>
  )
}

function read<T>(v: Accessor<T>): null {
  v()
  return null
}
