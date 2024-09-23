import { createEffect, type JSX, on } from 'solid-js'
import { css } from 'styled-system/css'
import { createForm, reset } from '@modular-forms/solid'
import type { Simplify } from 'type-fest'
import type { Settings } from '@/hooks/createSettingsStorage'
import createUniqueIds from '@/hooks/createUniqueIds'
import type { ISODate } from '@/utils/brands'
import toISODate from '@/utils/to-iso-date'
import * as s from './styles'

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
    <Form class={css(s.container)} role="form" aria-label="Settings" onSubmit={props.onSubmit}>
      <Field name="birthDate" transform={parseDateValue}>
        {(field, input) => (
          <div class={css(s.formGroup)}>
            <label for={ids.birthDate} class={css(s.label)}>
              Birth date
            </label>
            <input {...input} id={ids.birthDate} class={css(s.input)} type="date" value={field.value ?? ''} />
          </div>
        )}
      </Field>
      <button class={css(s.button)} disabled={form.submitting} type="submit">
        Save
      </button>
    </Form>
  )
}

function parseDateValue(value: string | undefined): ISODate | undefined {
  const parsed = value != null && value !== '' ? new Date(value) : null
  return parsed != null && !Number.isNaN(parsed.valueOf()) ? toISODate(parsed) : undefined
}
