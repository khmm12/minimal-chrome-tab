import { mergeProps, Suspense } from 'solid-js'
import { render, screen, waitFor, waitForElementToBeRemoved } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import toISODate from '@/utils/to-iso-date'
import SettingsDialog, { type SettingsDialogProps } from '.'

afterEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
})

describe('SettingsDialog', () => {
  it('renders dialog with form', async () => {
    await createContainer()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('form')).toBeInTheDocument()
  })

  it('can be closed', async () => {
    const handleClose = vi.fn()
    const { user } = await createContainer({ onClose: handleClose })

    await user.click(screen.getByTitle(/close/i))

    expect(handleClose).toBeCalled()
  })

  describe('form', () => {
    it('is prefilled with default values', async () => {
      const birthDate = toISODate(new Date())
      await createContainer({
        settings: defaults({ birthDate }),
      })

      expect(screen.getByLabelText('Birth date')).toHaveValue(getInputDateValue(birthDate))
      expect(screen.getByLabelText('Milestone progress style')).toHaveValue(MilestoneProgressStyle.BarsCompact)
      expect(screen.getByLabelText('Theme color mode')).toHaveValue(ThemeColorMode.Auto)
    })

    it('rejects invalid birth date', async () => {
      const { user } = await createContainer()

      await user.type(screen.getByLabelText('Birth date'), 'not birth date')

      expect(screen.getByLabelText('Birth date')).toHaveValue('')
    })

    it('accepts valid birth date', async () => {
      const birthDate = getInputDateValue(new Date())
      const { user } = await createContainer()

      await user.type(screen.getByLabelText('Birth date'), birthDate)

      expect(screen.getByLabelText('Birth date')).toHaveValue(birthDate)
    })

    it('allows to clear birth date', async () => {
      const { user } = await createContainer({
        settings: defaults({ birthDate: toISODate(new Date()) }),
      })

      await user.clear(screen.getByLabelText('Birth date'))

      expect(screen.getByLabelText('Birth date')).toHaveValue('')
    })

    it('notifies parent about the saved settings', async () => {
      const birthDate = toISODate(new Date())
      const handleSave = vi.fn()
      const { user } = await createContainer({ onSave: handleSave })

      await user.type(screen.getByLabelText('Birth date'), getInputDateValue(birthDate))
      await user.click(screen.getByText(/Save/))
      await waitFor(() => {
        expect(screen.getByText(/Save/)).not.toBeDisabled()
      })

      expect(handleSave).toBeCalledWith(
        expect.objectContaining({
          birthDate,
        }),
      )
    })
  })
})

async function createContainer(props?: Partial<SettingsDialogProps>) {
  const user = userEvent.setup()
  const container = render(() => (
    <Suspense fallback={<div>loading....</div>}>
      <SettingsDialog {...mergeProps({ settings: defaults() }, props)} />
    </Suspense>
  ))

  if (screen.queryByText(/loading/i) != null) {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  }

  return { ...container, user }
}

function getInputDateValue(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd')
}

function defaults(opts?: Partial<Settings>): Settings {
  return {
    milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
    themeColorMode: ThemeColorMode.Auto,
    ...opts,
  }
}
