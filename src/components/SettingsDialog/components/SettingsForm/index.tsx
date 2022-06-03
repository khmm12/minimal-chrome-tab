import type { JSX } from 'solid-js'
import { createForm } from '@felte/solid'
import createUniqueIds from '@/hooks/createUniqueIds'
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

  const ids = createUniqueIds(['birthDate'])

  return (
    <form class={css.container} ref={form}>
      <div class={css.formGroup}>
        <label for={ids.birthDate} class={css.label}>
          Birth date
        </label>
        <input id={ids.birthDate} class={css.input} name="birthDate" type="date" />
      </div>
      <button class={css.button} type="submit">
        Save
      </button>
    </form>
  )
}
