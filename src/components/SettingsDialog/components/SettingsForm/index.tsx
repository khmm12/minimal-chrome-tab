import type { JSX } from 'solid-js'
import { createForm } from '@felte/solid'
import type { Settings } from '@/hooks/createSettingsStorage'
import * as css from './styles'

interface SettingsFormProps {
  initialValues: Settings
  onSubmit: (values: Settings) => Promise<void> | void
}

export default function SettingsForm(props: SettingsFormProps): JSX.Element {
  const { form } = createForm({
    initialValues: props.initialValues,
    onSubmit: (values) => props.onSubmit(values),
  })

  return (
    <form className={css.container} ref={form}>
      <div className={css.formGroup}>
        <label htmlFor="birthDate" className={css.label}>
          Birth date
        </label>
        <input id="birthDate" className={css.input} name="birthDate" type="date" />
      </div>
      <button className={css.button} type="submit">
        Save
      </button>
    </form>
  )
}
