import type { JSX } from 'solid-js'
import { SettingsIcon } from '@/components/Icon'
import Modal from '@/components/Modal'
import type { Settings } from '@/shared/settings'
import SettingsForm from './components/SettingsForm'

export interface SettingsDialogProps {
  settings: Settings
  onClose?: () => void
  onSave?: (value: Settings) => void | Promise<void>
}

export default function SettingsDialog(props: SettingsDialogProps): JSX.Element {
  const handleSubmit = async (values: Settings): Promise<void> => await props.onSave?.(values)
  const handleClose = (): void => props.onClose?.()

  return (
    <Modal icon={<SettingsIcon />} title="Settings" onClose={handleClose}>
      <SettingsForm initialValues={props.settings} onSubmit={handleSubmit} />
    </Modal>
  )
}
