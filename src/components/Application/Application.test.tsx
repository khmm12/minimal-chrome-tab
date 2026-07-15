import { flush } from 'solid-js'
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library'
import type { JSX } from '@solidjs/web'
import createMediaQuery from '@/hooks/createMediaQuery'
import useSettings from '@/hooks/useSettings'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import Application from '.'

vi.mock('@/hooks/useSettings')
vi.mock('@/hooks/createMediaQuery')
vi.mock('@/components/Layout', () => ({
  default: (props: { children?: JSX.Element }) => <div data-testid="layout">{props.children}</div>,
}))
vi.mock('@/components/Time', () => ({
  default: () => <div data-testid="time-stub">Time</div>,
}))
vi.mock('@/components/TimeMilestones', () => ({
  default: () => <div data-testid="time-milestones-stub">TimeMilestones</div>,
}))
vi.mock('@/components/SettingsDialog', () => ({
  default: () => (
    <div role="dialog" aria-label="Settings">
      Settings dialog stub
    </div>
  ),
}))

beforeEach(() => {
  mockSettings()
  vi.mocked(createMediaQuery).mockReturnValue(Object.assign(() => false, { query: false }))

  const app = document.createElement('div')
  app.id = 'app'
  document.body.appendChild(app)
})

afterEach(() => {
  document.getElementById('app')?.remove()
  document.documentElement.removeAttribute('data-theme')
  vi.resetAllMocks()
})

describe('Application', () => {
  it('mounts the layout containing Time, TimeMilestones and the Footer', () => {
    render(() => <Application />)

    const layout = screen.getByTestId('layout')
    expect(layout).toBeInTheDocument()

    // Stubbed children live inside the Layout.
    expect(within(layout).getByTestId('time-stub')).toBeInTheDocument()
    expect(within(layout).getByTestId('time-milestones-stub')).toBeInTheDocument()

    // The real Footer renders the settings button and the credits link.
    expect(within(layout).getByTitle('Open settings')).toBeInTheDocument()
    expect(within(layout).getByText('Made by khmm12')).toBeInTheDocument()
  })

  it('wires createApplyTheme so a theme is applied to <html>', () => {
    render(() => <Application />)
    flush()

    // Auto + OS not-dark (mocked) resolves to light; the presence of the
    // attribute proves Application invokes createApplyTheme.
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('opens the settings dialog when the Footer settings button is clicked', async () => {
    render(() => <Application />)

    // Dialog is absent until requested.
    expect(screen.queryByText('Settings dialog stub')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTitle('Open settings'))
    flush()

    await waitFor(() => {
      expect(screen.getByText('Settings dialog stub')).toBeInTheDocument()
    })
  })
})

function mockSettings(): void {
  const settings: Settings = {
    themeColorMode: ThemeColorMode.Auto,
    milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
  }
  vi.mocked(useSettings).mockReturnValue([() => settings, vi.fn()])
}
