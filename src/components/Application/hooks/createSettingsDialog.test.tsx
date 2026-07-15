import { setTimeout as tick } from 'node:timers/promises'
import { flush, useContext } from 'solid-js'
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import SettingsDialog from '@/components/SettingsDialog'
import { ShowWithTransitionContext } from '@/components/ShowWithTransition'
import useSettings from '@/hooks/useSettings'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import createSettingsDialog from './createSettingsDialog'

vi.mock('@/hooks/useSettings')
vi.mock('@/components/SettingsDialog')

const currentSettings: Settings = {
  themeColorMode: ThemeColorMode.Auto,
  milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
}

const savedSettings: Settings = {
  themeColorMode: ThemeColorMode.Dark,
  milestoneProgressStyle: MilestoneProgressStyle.BarsDetailed,
}

const setSettingsMock = vi.fn<(value: Settings) => Promise<void>>()

beforeEach(() => {
  setSettingsMock.mockResolvedValue(undefined)
  vi.mocked(useSettings).mockReturnValue([() => currentSettings, setSettingsMock])
  // Lightweight stub for the lazy dialog: exposes save/close triggers and
  // mirrors the transition's `isOpened` so we can observe open/close state.
  vi.mocked(SettingsDialog).mockImplementation((props) => {
    const transition = useContext(ShowWithTransitionContext)
    return (
      <div
        data-testid="settings-dialog-stub"
        data-opened={transition.isOpened ? 'true' : 'false'}
        data-theme={props.settings.themeColorMode}
      >
        <button
          type="button"
          onClick={() => {
            void props.onSave?.(savedSettings)
          }}
        >
          save
        </button>
        <button
          type="button"
          onClick={() => {
            props.onClose?.()
          }}
        >
          close
        </button>
      </div>
    )
  })
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('createSettingsDialog', () => {
  it('does not render the dialog until it is opened', async () => {
    renderDialog()

    // Give the lazy dialog a full macrotask to resolve — if it were shown by
    // mistake, the stub would have mounted by now.
    await tick(0)

    expect(screen.queryByTestId('settings-dialog-stub')).not.toBeInTheDocument()
    expect(SettingsDialog).not.toHaveBeenCalled()
  })

  it('renders the dialog after open()', async () => {
    const { open } = renderDialog()

    open()
    flush()

    const stub = await screen.findByTestId('settings-dialog-stub')
    expect(stub).toBeInTheDocument()
    expect(stub).toHaveAttribute('data-opened', 'true')
    // The dialog receives the current settings from `useSettings`.
    expect(stub).toHaveAttribute('data-theme', currentSettings.themeColorMode)
  })

  it('persists the settings before closing the dialog on save', async () => {
    // Gate the write so we can observe that the close waits for the persist.
    const persist = Promise.withResolvers<undefined>()
    setSettingsMock.mockReturnValueOnce(persist.promise)

    const { open } = renderDialog()

    open()
    flush()
    const stub = await screen.findByTestId('settings-dialog-stub')
    expect(stub).toHaveAttribute('data-opened', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'save' }))
    flush()

    // The write is issued immediately with the dialog's values...
    expect(setSettingsMock).toHaveBeenCalledWith(savedSettings)
    // ...but the dialog stays open until that write resolves (close awaits persist).
    expect(stub).toHaveAttribute('data-opened', 'true')

    persist.resolve(undefined)

    await waitFor(() => {
      expect(screen.getByTestId('settings-dialog-stub')).toHaveAttribute('data-opened', 'false')
    })
  })

  it('closes the dialog on close without saving', async () => {
    const { open } = renderDialog()

    open()
    flush()
    const stub = await screen.findByTestId('settings-dialog-stub')
    expect(stub).toHaveAttribute('data-opened', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    flush()

    expect(screen.getByTestId('settings-dialog-stub')).toHaveAttribute('data-opened', 'false')
    expect(setSettingsMock).not.toHaveBeenCalled()
  })
})

function renderDialog(): { open: () => void } {
  let open: () => void = () => {}
  render(() => {
    const dialog = createSettingsDialog()
    ;({ open } = dialog)
    return dialog.$el
  })
  return { open }
}
