import { createSignal, flush } from 'solid-js'
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import toISODate from '@/utils/to-iso-date'
import SettingsForm from '.'

afterEach(() => {
  vi.resetAllMocks()
})

describe('SettingsForm', () => {
  it('submits with the newly selected theme color mode', async () => {
    const onSubmit = vi.fn<(values: Settings) => void>()
    render(() => <SettingsForm initialValues={defaults()} onSubmit={onSubmit} />)

    const select = screen.getByLabelText('Theme color mode')
    fireEvent.change(select, { target: { value: ThemeColorMode.Dark } })
    flush()

    expect(select).toHaveValue(ThemeColorMode.Dark)

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ themeColorMode: ThemeColorMode.Dark }))
    })
  })

  it('submits with the newly selected milestone progress style', async () => {
    const onSubmit = vi.fn<(values: Settings) => void>()
    render(() => <SettingsForm initialValues={defaults()} onSubmit={onSubmit} />)

    const select = screen.getByLabelText('Milestone progress style')
    fireEvent.change(select, { target: { value: MilestoneProgressStyle.BarsDetailed } })
    flush()

    expect(select).toHaveValue(MilestoneProgressStyle.BarsDetailed)

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ milestoneProgressStyle: MilestoneProgressStyle.BarsDetailed }),
      )
    })
  })

  it('includes the entered birth date in the submitted settings', async () => {
    const onSubmit = vi.fn<(values: Settings) => void>()
    render(() => <SettingsForm initialValues={defaults()} onSubmit={onSubmit} />)

    const input = screen.getByLabelText('Birth date')
    const inputValue = '1990-05-15'
    fireEvent.change(input, { target: { value: inputValue } })
    flush()

    expect(input).toHaveValue(inputValue)

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ birthDate: toISODate(new Date(inputValue)) }))
    })
  })

  it('omits birth date from the submitted settings when cleared', async () => {
    const birthDate = toISODate(new Date(1990, 4, 15))
    const onSubmit = vi.fn<(values: Settings) => void>()
    render(() => <SettingsForm initialValues={defaults({ birthDate })} onSubmit={onSubmit} />)

    const input = screen.getByLabelText('Birth date')
    expect(input).toHaveValue(birthDate)

    fireEvent.change(input, { target: { value: '' } })
    flush()

    expect(input).toHaveValue('')

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          themeColorMode: ThemeColorMode.Auto,
          milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
        }),
      )
    })
    expect(onSubmit.mock.lastCall?.[0]).not.toHaveProperty('birthDate')
  })

  it('shows the saving label while the submit is pending and restores it afterwards', async () => {
    const pending = Promise.withResolvers<null>()
    const onSubmit = vi.fn(async () => {
      await pending.promise
    })
    render(() => <SettingsForm initialValues={defaults()} onSubmit={onSubmit} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/^Save$/)
    expect(button).not.toBeDisabled()

    fireEvent.submit(screen.getByRole('form'))
    flush()

    expect(button).toHaveTextContent(/^Saving$/)
    expect(button).toBeDisabled()

    pending.resolve(null)

    await waitFor(() => {
      expect(button).toHaveTextContent(/^Save$/)
      expect(button).not.toBeDisabled()
    })
  })

  it('keeps the form dirty while a save is in flight', () => {
    // The form only clears `isDirty` after the awaited save resolves. Until then it must stay
    // dirty so a failed/pending save is retriable and an external initialValues change can't
    // clobber the user's edit.
    const pending = Promise.withResolvers<null>()
    const onSubmit = vi.fn(async () => {
      await pending.promise
    })
    const [initialValues, setInitialValues] = createSignal(defaults())
    render(() => <SettingsForm initialValues={initialValues()} onSubmit={onSubmit} />)

    const themeSelect = screen.getByLabelText('Theme color mode')
    fireEvent.change(themeSelect, { target: { value: ThemeColorMode.Light } })
    flush()

    fireEvent.submit(screen.getByRole('form'))
    flush()

    setInitialValues(defaults({ themeColorMode: ThemeColorMode.Dark }))
    flush()

    expect(themeSelect).toHaveValue(ThemeColorMode.Light)
  })

  it('re-syncs fields when initialValues change and the form is not dirty', () => {
    const [initialValues, setInitialValues] = createSignal(defaults())
    const onSubmit = vi.fn<(values: Settings) => void>()
    render(() => <SettingsForm initialValues={initialValues()} onSubmit={onSubmit} />)

    expect(screen.getByLabelText('Theme color mode')).toHaveValue(ThemeColorMode.Auto)
    expect(screen.getByLabelText('Milestone progress style')).toHaveValue(MilestoneProgressStyle.BarsCompact)

    setInitialValues(
      defaults({
        themeColorMode: ThemeColorMode.Dark,
        milestoneProgressStyle: MilestoneProgressStyle.BarsDetailed,
      }),
    )
    flush()

    expect(screen.getByLabelText('Theme color mode')).toHaveValue(ThemeColorMode.Dark)
    expect(screen.getByLabelText('Milestone progress style')).toHaveValue(MilestoneProgressStyle.BarsDetailed)
  })

  it('keeps user edits when initialValues change after the form became dirty', () => {
    const [initialValues, setInitialValues] = createSignal(defaults())
    const onSubmit = vi.fn<(values: Settings) => void>()
    render(() => <SettingsForm initialValues={initialValues()} onSubmit={onSubmit} />)

    const themeSelect = screen.getByLabelText('Theme color mode')
    fireEvent.change(themeSelect, { target: { value: ThemeColorMode.Light } })
    flush()

    expect(themeSelect).toHaveValue(ThemeColorMode.Light)

    setInitialValues(defaults({ themeColorMode: ThemeColorMode.Dark }))
    flush()

    expect(themeSelect).toHaveValue(ThemeColorMode.Light)
  })
})

function defaults(opts?: Partial<Settings>): Settings {
  return {
    milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
    themeColorMode: ThemeColorMode.Auto,
    ...opts,
  }
}
