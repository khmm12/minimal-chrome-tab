import { Suspense } from 'solid-js'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import { render, renderHook, screen, waitFor, waitForElementToBeRemoved } from '@test/helpers/solid'
import createSettingsStorage from '@/hooks/createSettingsStorage'
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
      await fillSettings({
        birthDate,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
        themeColorMode: ThemeColorMode.Auto,
      })
      await createContainer()

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
      await fillSettings({
        birthDate: toISODate(new Date()),
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
        themeColorMode: ThemeColorMode.Auto,
      })
      const { user } = await createContainer()

      await user.clear(screen.getByLabelText('Birth date'))

      expect(screen.getByLabelText('Birth date')).toHaveValue('')
    })

    it('saves values and notifies parent', async () => {
      const birthDate = toISODate(new Date())
      const handleSaved = vi.fn()
      const [settings] = renderHook(() => createSettingsStorage()).result
      const { user } = await createContainer({ onSaved: handleSaved })

      await user.type(screen.getByLabelText('Birth date'), getInputDateValue(birthDate))

      await user.click(screen.getByText(/Save/))
      await waitFor(() => {
        expect(screen.getByText(/Save/)).not.toBeDisabled()
      })

      expect(settings()).toEqual(
        expect.objectContaining({
          birthDate,
        }),
      )
      expect(handleSaved).toBeCalled()
    })
  })
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function createContainer(props?: SettingsDialogProps) {
  const user = userEvent.setup()
  const container = render(() => (
    <Suspense fallback={<div>loading....</div>}>
      <SettingsDialog {...props} />
    </Suspense>
  ))

  if (screen.queryByText(/loading/i) != null) {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  }

  return { ...container, user }
}

async function fillSettings(settings: Settings): Promise<void> {
  const [, setSettings] = renderHook(() => createSettingsStorage()).result
  await setSettings(settings)
}

function getInputDateValue(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd')
}
