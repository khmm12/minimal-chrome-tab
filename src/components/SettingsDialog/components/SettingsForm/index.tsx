import { createEffect, type JSX, on } from 'solid-js'
import { createForm, reset } from '@modular-forms/solid'
import { type Simplify } from 'type-fest'
import type { Settings } from '@/hooks/createSettingsStorage'
import createUniqueIds from '@/hooks/createUniqueIds'
import toISODate from '@/utils/to-iso-date'
import * as css from './styles'

interface SettingsFormProps {
  initialValues: Settings
  onSubmit: (values: Settings) => Promise<void> | void
}

export default function SettingsForm(props: SettingsFormProps): JSX.Element {
  const [form, { Form, Field }] = createForm<Simplify<Settings>>({
    initialValues: props.initialValues,
  })

  createEffect(
    on(
      () => props.initialValues as Simplify<Settings>,
      (initialValues) => {
        if (!form.dirty) reset(form, { initialValues })
      },
    ),
  )

  const ids = createUniqueIds(['birthDate'])

  return (
    <Form class={css.container} role="form" aria-label="Settings" onSubmit={props.onSubmit}>
      <Field name="birthDate" transform={parseDateValue}>
        {(field, input) => (
          <div class={css.formGroup}>
            <label for={ids.birthDate} class={css.label}>
              Birth date
            </label>
            <input {...input} id={ids.birthDate} class={css.input} type="date" value={field.value ?? ''} />
          </div>
        )}
      </Field>
      <button class={css.button} disabled={form.submitting} type="submit">
        Save
      </button>
    </Form>
  )
}

function parseDateValue(value: string | undefined): string {
  const parsed = value != null && value !== '' ? new Date(value) : null
  return parsed != null && !Number.isNaN(parsed.valueOf()) ? toISODate(parsed) : ''
}
