import { render, screen } from '@test/helpers/solid'
import createCurrentDateTime from '@/hooks/createCurrentDateTime'
import createSettingsStorage from '@/hooks/createSettingsStorage'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import toISODate from '@/utils/to-iso-date'
import Milestone from './components/Milestone'
import TimeMilestones from '.'

vi.mock('@/hooks/useCurrentLanguage')
vi.mock('@/hooks/createCurrentDateTime')
vi.mock('@/hooks/createSettingsStorage')
vi.mock('./components/Milestone')

beforeEach(() => {
  vi.mocked(createSettingsStorage).mockReturnValue(
    settingsMockedValue({
      themeColorMode: ThemeColorMode.Auto,
      milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
    }),
  )

  vi.mocked(useCurrentLanguage).mockReturnValue(() => 'en-US')
  vi.mocked(createCurrentDateTime).mockReturnValue(() => new Date('2022-03-05T16:05:30'))
  vi.mocked(Milestone).mockImplementation((props) => (
    <div aria-label={props.description}>
      {props.description} {props.value}
    </div>
  ))
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('TimeMilestones', () => {
  it('renders correctly', () => {
    render(() => <TimeMilestones />)

    const r = screen.getByLabelText('Time milestones')

    expect(r).toBeInTheDocument()
    expect(r).toMatchSnapshot()
  })

  it('has heading', () => {
    render(() => <TimeMilestones />)

    const heading = screen.getByText("We're now through...")
    expect(heading).toBeInTheDocument()
  })

  it('has main milestones', () => {
    render(() => <TimeMilestones />)

    const ofDayMileStone = screen.getByText(/of day/)
    expect(ofDayMileStone).toBeInTheDocument()

    const ofWeekMileStone = screen.getByText(/of week/)
    expect(ofWeekMileStone).toBeInTheDocument()

    const ofMonthMileStone = screen.getByText(/of month/)
    expect(ofMonthMileStone).toBeInTheDocument()
  })

  it('has optional birthday milestone if specified', () => {
    vi.mocked(createSettingsStorage).mockReturnValue(
      settingsMockedValue({
        themeColorMode: ThemeColorMode.Auto,
        milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
        birthDate: toISODate('1970-01-01'),
      }),
    )

    render(() => <TimeMilestones />)

    const ofBirthdayMileStone = screen.getByText(/of b'day/)
    expect(ofBirthdayMileStone).toBeInTheDocument()
  })

  it('has no birthday milestone if not specified', () => {
    render(() => <TimeMilestones />)
    const ofBirthdayMileStone = screen.queryByText(/of b'day/)
    expect(ofBirthdayMileStone).not.toBeInTheDocument()
  })
})

function settingsMockedValue(value: Settings): ReturnType<typeof createSettingsStorage> {
  return [() => value, vi.fn()] as unknown as ReturnType<typeof createSettingsStorage>
}
