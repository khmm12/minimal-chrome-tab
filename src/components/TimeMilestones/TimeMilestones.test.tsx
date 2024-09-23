import type { Accessor } from 'solid-js'
import { render, screen } from '@test/helpers/solid'
import createCurrentDateTime from '@/hooks/createCurrentDateTime'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import Milestone from './components/Milestone'
import useBirthDate from './hooks/useBirthDate'
import TimeMilestones from '.'

vi.mock('@/hooks/useCurrentLanguage')
vi.mock('@/hooks/createCurrentDateTime')
vi.mock('./hooks/useBirthDate.ts')
vi.mock('./components/Milestone')

beforeEach(() => {
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

  it('has optional birth date milestone if specified', () => {
    vi.mocked(useBirthDate).mockReturnValue(birthDateMockedValue(null))

    render(() => <TimeMilestones />)
    const ofBirthdayMileStone = screen.queryByText(/of dob/)
    expect(ofBirthdayMileStone).not.toBeInTheDocument()
  })

  it('has no birth date milestone if not specified', () => {
    vi.mocked(useBirthDate).mockReturnValue(birthDateMockedValue(new Date('1970-01-01')))
    render(() => <TimeMilestones />)

    const ofBirthdayMileStone = screen.getByText(/of dob/)
    expect(ofBirthdayMileStone).toBeInTheDocument()
  })
})

function birthDateMockedValue(value: Date | null): Accessor<Date | null> & { loading: boolean } {
  const a: Accessor<Date | null> = () => value
  Object.defineProperty(a, 'loading', { value: false })
  return a as Accessor<Date | null> & { loading: boolean }
}
