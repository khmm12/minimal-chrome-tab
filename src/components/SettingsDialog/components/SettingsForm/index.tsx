import { createEffect, For, type JSX, on } from 'solid-js'
import { css } from 'styled-system/css'
import { createForm } from '@tanstack/solid-form'
import createUniqueIds from '@/hooks/createUniqueIds'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import type { ISODate } from '@/utils/brands'
import toISODate from '@/utils/to-iso-date'
import * as s from './styles'

interface SettingsFormProps {
  initialValues: Settings
  onSubmit: (values: Settings) => Promise<void> | void
}

const ThemeColorModeOptions = [
  { label: 'Auto (follow OS)', value: ThemeColorMode.Auto },
  { label: 'Light', value: ThemeColorMode.Light },
  { label: 'Dark', value: ThemeColorMode.Dark },
]

const MilestoneProgressStyleOptions = [
  { label: 'Bars compact (default)', value: MilestoneProgressStyle.BarsCompact },
  { label: 'Bars detailed', value: MilestoneProgressStyle.BarsDetailed },
  { label: 'Horizontal bar', value: MilestoneProgressStyle.HorizontalBar },
]

export default function SettingsForm(props: SettingsFormProps): JSX.Element {
  const form = createForm(() => ({
    defaultValues: { ...props.initialValues },
    async onSubmit({ value: values }) {
      const { milestoneProgressStyle, themeColorMode, birthDate } = values

      const nextValues: Settings = {
        milestoneProgressStyle,
        themeColorMode,
      }
      if (birthDate != null) nextValues.birthDate = birthDate

      await props.onSubmit(nextValues)
    },
  }))

  createEffect(
    on(
      () => ({ ...props.initialValues }), // Subscribe to all fields
      (initialValues) => {
        if (!form.state.isDirty) form.reset(initialValues)
      },
      { defer: true },
    ),
  )

  const ids = createUniqueIds(['birthDate', 'milestoneProgressStyle', 'themeColorMode'])

  return (
    <form class={css(s.container)} aria-label="Settings" onSubmit={withCanceled(form.handleSubmit.bind(form))}>
      <form.Field name="themeColorMode">
        {(field) => (
          <div class={css(s.formGroup)}>
            <label for={ids.themeColorMode} class={css(s.label)}>
              Theme color mode
            </label>
            <select
              name={field().name}
              id={ids.themeColorMode}
              class={css(s.select)}
              style={s.selectInline}
              onChange={selectHandler(ThemeColorModeOptions, field().handleChange)}
              onBlur={field().handleBlur}
            >
              <For each={ThemeColorModeOptions}>
                {({ label, value }) => (
                  <option value={value} selected={field().state.value === value}>
                    {label}
                  </option>
                )}
              </For>
            </select>
          </div>
        )}
      </form.Field>
      <form.Field name="milestoneProgressStyle">
        {(field) => (
          <div class={css(s.formGroup)}>
            <label for={ids.milestoneProgressStyle} class={css(s.label)}>
              Milestone progress style
            </label>
            <select
              id={ids.milestoneProgressStyle}
              class={css(s.select)}
              style={s.selectInline}
              name={field().name}
              onChange={selectHandler(MilestoneProgressStyleOptions, field().handleChange)}
              onBlur={field().handleBlur}
            >
              <For each={MilestoneProgressStyleOptions}>
                {({ label, value }) => (
                  <option value={value} selected={field().state.value === value}>
                    {label}
                  </option>
                )}
              </For>
            </select>
          </div>
        )}
      </form.Field>
      <form.Field name="birthDate">
        {(field) => (
          <div class={css(s.formGroup)}>
            <label for={ids.birthDate} class={css(s.label)}>
              Birth date
            </label>
            <input
              id={ids.birthDate}
              class={css(s.input)}
              placeholder="Birthdate"
              type="date"
              name={field().name}
              value={field().state.value ?? ''}
              onChange={textHandler(parseDateValue, field().handleChange)}
              onBlur={field().handleBlur}
            />
          </div>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, canSubmit: state.canSubmit })}>
        {(state) => (
          <button class={css(s.button)} disabled={!state().canSubmit} type="submit">
            {state().isSubmitting ? 'Saving' : 'Save'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}

function parseDateValue(value: string | undefined): ISODate | undefined {
  const parsed = value != null && value !== '' ? new Date(value) : null
  return parsed != null && !Number.isNaN(parsed.valueOf()) ? toISODate(parsed) : undefined
}

function withCanceled(fn: () => void | Promise<void>): (e: SubmitEvent) => void {
  return (e) => {
    e.preventDefault()
    e.stopPropagation()
    Promise.resolve(fn()).catch(() => {})
  }
}

function selectHandler<T extends string>(
  _options: ReadonlyArray<{ value: T }>,
  onChange: (value: T) => void,
): (e: Event & { target: HTMLSelectElement }) => void {
  return (e) => {
    onChange(e.target.value as T)
  }
}

function textHandler<T>(
  parse: (val: string) => T,
  onChange: (value: T) => void,
): (e: Event & { target: HTMLInputElement }) => void {
  return (e) => {
    onChange(parse(e.target.value))
  }
}
