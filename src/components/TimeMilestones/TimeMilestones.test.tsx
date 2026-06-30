import { render, screen } from '@solidjs/testing-library'
import createCurrentDateTime from '@/hooks/createCurrentDateTime'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import useSettings from '@/hooks/useSettings'
import { MilestoneProgressStyle, type Settings, ThemeColorMode } from '@/shared/settings'
import type { ISODate } from '@/utils/brands'
import toISODate from '@/utils/to-iso-date'
import Milestone from './components/Milestone'
import TimeMilestones from '.'

vi.mock('@/hooks/useCurrentLanguage')
vi.mock('@/hooks/createCurrentDateTime')
vi.mock('@/hooks/useSettings')
vi.mock('./components/Milestone')

beforeEach(() => {
  vi.mocked(useCurrentLanguage).mockReturnValue(() => 'en-GB')
  vi.mocked(createCurrentDateTime).mockReturnValue(() => new Date('2022-03-05T16:05:30'))
  mockSettings()
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
    mockSettings({ birthDate: toISODate('1970-01-01') })
    render(() => <TimeMilestones />)

    const ofBirthdayMileStone = screen.getByText(/of b'day/)
    expect(ofBirthdayMileStone).toBeInTheDocument()
  })

  it('has no birthday milestone if not specified', () => {
    mockSettings({ birthDate: undefined })
    render(() => <TimeMilestones />)
    const ofBirthdayMileStone = screen.queryByText(/of b'day/)
    expect(ofBirthdayMileStone).not.toBeInTheDocument()
  })
})

function mockSettings(opts?: { birthDate?: ISODate | undefined }): void {
  const settings: Settings = {
    themeColorMode: ThemeColorMode.Auto,
    milestoneProgressStyle: MilestoneProgressStyle.BarsCompact,
    ...opts,
  }
  vi.mocked(useSettings).mockReturnValue([() => settings, vi.fn()])
}
