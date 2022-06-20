import { createComputed, createEffect, JSX, on } from 'solid-js'
import { createForm } from '@felte/solid'
import toISODate from '@/utils/to-iso-date'
import createUniqueIds from '@/hooks/createUniqueIds'
import type { Settings } from '@/hooks/createSettingsStorage'
import * as css from './styles'

interface SettingsFormProps {
  initialValues: Settings
  onSubmit: (values: Settings) => Promise<void> | void
}

export default function SettingsForm(props: SettingsFormProps): JSX.Element {
  const { form, isSubmitting, setInitialValues, isDirty, reset } = createForm<Settings>({
    initialValues: props.initialValues,
    transform: (values) => transformValues(values as Settings),
    onSubmit: (values) => props.onSubmit(values),
  })

  createComputed(() => props.initialValues)
  createEffect(
    on(
      () => props.initialValues,
      (initialValues) => {
        setInitialValues(initialValues)
        if (!isDirty()) reset()
      }
    )
  )

  const ids = createUniqueIds(['birthDate'])

  return (
    <form ref={form} class={css.container} role="form">
      <div class={css.formGroup}>
        <label for={ids.birthDate} class={css.label}>
          Birth date
        </label>
        <input id={ids.birthDate} class={css.input} name="birthDate" type="date" />
      </div>
      <button class={css.button} disabled={isSubmitting()} type="submit">
        Save
      </button>
    </form>
  )
}

function transformValues(values: Settings): Settings {
  return {
    ...values,
    birthDate: parseDateValue(values.birthDate),
  }
}

function parseDateValue(value: string | undefined): string {
  const parsed = value != null && value !== '' ? new Date(value) : null
  return parsed != null && !Number.isNaN(parsed.valueOf()) ? toISODate(parsed) : ''
}
