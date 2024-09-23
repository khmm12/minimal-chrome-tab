import { createEffect, For, type JSX, on } from 'solid-js'
import { css } from 'styled-system/css'
import { createForm, reset } from '@modular-forms/solid'
import type { Simplify } from 'type-fest'
import createUniqueIds from '@/hooks/createUniqueIds'
import { ColorTheme, MilestoneProgressStyle, type Settings } from '@/shared/settings'
import type { ISODate } from '@/utils/brands'
import toISODate from '@/utils/to-iso-date'
import * as s from './styles'

interface SettingsFormProps {
  initialValues: Settings
  onSubmit: (values: Settings) => Promise<void> | void
}

const ThemeOptions = [
  { label: 'Auto (follow OS)', value: ColorTheme.Auto },
  { label: 'Light', value: ColorTheme.Light },
  { label: 'Dark', value: ColorTheme.Dark },
]

const MilestoneProgressStyleOptions = [
  { label: 'Bars compact (default)', value: MilestoneProgressStyle.BarsCompact },
  { label: 'Bars detailed', value: MilestoneProgressStyle.BarsDetailed },
  { label: 'Horizontal bar', value: MilestoneProgressStyle.HorizontalBar },
]

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
      { defer: true },
    ),
  )

  const ids = createUniqueIds(['birthDate', 'milestoneProgressStyle', 'colorTheme'])

  return (
    <Form class={css(s.container)} role="form" aria-label="Settings" onSubmit={props.onSubmit}>
      <Field name="colorTheme">
        {(field, input) => (
          <div class={css(s.formGroup)}>
            <label for={ids.colorTheme} class={css(s.label)}>
              Color theme
            </label>
            <select {...input} id={ids.colorTheme} class={css(s.input)}>
              <For each={ThemeOptions}>
                {({ label, value }) => (
                  <option value={value} selected={field.value === value}>
                    {label}
                  </option>
                )}
              </For>
            </select>
          </div>
        )}
      </Field>
      <Field name="milestoneProgressStyle">
        {(field, input) => (
          <div class={css(s.formGroup)}>
            <label for={ids.milestoneProgressStyle} class={css(s.label)}>
              Milestone progress style
            </label>
            <select {...input} id={ids.milestoneProgressStyle} class={css(s.input)}>
              <For each={MilestoneProgressStyleOptions}>
                {({ label, value }) => (
                  <option value={value} selected={field.value === value}>
                    {label}
                  </option>
                )}
              </For>
            </select>
          </div>
        )}
      </Field>
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
