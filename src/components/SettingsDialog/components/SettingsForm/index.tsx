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
    <form class={css.container} ref={form}>
      <div class={css.formGroup}>
        <label for="birthDate" class={css.label}>
          Birth date
        </label>
        <input id="birthDate" class={css.input} name="birthDate" type="date" />
      </div>
      <button class={css.button} type="submit">
        Save
      </button>
    </form>
  )
}
