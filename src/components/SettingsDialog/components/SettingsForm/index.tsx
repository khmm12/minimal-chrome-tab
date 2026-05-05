import { action, createEffect, createMemo, createOptimistic, createStore, For, untrack } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { css } from 'styled-system/css'
import createUniqueIds from '@/hooks/createUniqueIds'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import type { ISODate } from '@/utils/brands'
import toISODate from '@/utils/to-iso-date'
import * as s from './styles'

interface SettingsFormProps {
  initialValues: Settings
  onSubmit: (values: Settings) => Promise<void> | void
}

interface FormValues {
  birthDate: ISODate | undefined
  milestoneProgressStyle: MilestoneProgressStyle
  themeColorMode: ThemeColorMode
}

interface FormState {
  isDirty: boolean
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
  const initialValues = untrack(() => props.initialValues)

  const [values, setValues] = createStore<FormValues>({
    birthDate: initialValues.birthDate,
    milestoneProgressStyle: initialValues.milestoneProgressStyle,
    themeColorMode: initialValues.themeColorMode,
  })

  const [state, setState] = createStore<FormState>({
    isDirty: false,
  })
  const [isSubmitting, setIsSubmitting] = createOptimistic(false)

  const settings = createMemo(
    (): Settings => ({
      milestoneProgressStyle: values.milestoneProgressStyle,
      themeColorMode: values.themeColorMode,
      ...(values.birthDate != null ? { birthDate: values.birthDate } : {}),
    }),
  )

  createEffect(
    () => ({ initialValues: { ...props.initialValues }, isDirty: state.isDirty }),
    ({ initialValues, isDirty }) => {
      if (isDirty) return

      setValues(() => ({
        birthDate: initialValues.birthDate,
        milestoneProgressStyle: initialValues.milestoneProgressStyle,
        themeColorMode: initialValues.themeColorMode,
      }))
    },
    { defer: true },
  )

  const handleSubmit = action(async function* () {
    setIsSubmitting(true)
    await props.onSubmit(settings())
    setState((state) => {
      state.isDirty = false
    })
    yield
  })

  const change = <TName extends keyof FormValues>(name: TName, value: FormValues[TName]): void => {
    setValues((state) => {
      state[name] = value
    })
    setState((state) => {
      state.isDirty = true
    })
  }

  const ids = createUniqueIds(['birthDate', 'milestoneProgressStyle', 'themeColorMode'])

  return (
    <form class={css(s.container)} aria-label="Settings" onSubmit={withCanceled(handleSubmit)}>
      <div class={css(s.formGroup)}>
        <label for={ids.themeColorMode} class={css(s.label)}>
          Theme color mode
        </label>
        <select
          name="themeColorMode"
          id={ids.themeColorMode}
          class={css(s.select)}
          style={s.selectInline}
          value={values.themeColorMode}
          onChange={selectHandler(ThemeColorModeOptions, (value) => {
            change('themeColorMode', value)
          })}
        >
          <For each={ThemeColorModeOptions}>
            {(option) => (
              <option value={option().value} selected={values.themeColorMode === option().value}>
                {option().label}
              </option>
            )}
          </For>
        </select>
      </div>
      <div class={css(s.formGroup)}>
        <label for={ids.milestoneProgressStyle} class={css(s.label)}>
          Milestone progress style
        </label>
        <select
          id={ids.milestoneProgressStyle}
          class={css(s.select)}
          style={s.selectInline}
          name="milestoneProgressStyle"
          value={values.milestoneProgressStyle}
          onChange={selectHandler(MilestoneProgressStyleOptions, (value) => {
            change('milestoneProgressStyle', value)
          })}
        >
          <For each={MilestoneProgressStyleOptions}>
            {(option) => (
              <option value={option().value} selected={values.milestoneProgressStyle === option().value}>
                {option().label}
              </option>
            )}
          </For>
        </select>
      </div>
      <div class={css(s.formGroup)}>
        <label for={ids.birthDate} class={css(s.label)}>
          Birth date
        </label>
        <input
          id={ids.birthDate}
          class={css(s.input)}
          placeholder="Birthdate"
          type="date"
          name="birthDate"
          value={values.birthDate ?? ''}
          onChange={textHandler(parseDateValue, (value) => {
            change('birthDate', value)
          })}
        />
      </div>
      <button class={css(s.button)} disabled={isSubmitting()} type="submit">
        {isSubmitting() ? 'Saving' : 'Save'}
      </button>
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
