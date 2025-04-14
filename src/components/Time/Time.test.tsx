import { render, screen } from '@solidjs/testing-library'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import Time from '.'

vi.mock('@/hooks/useCurrentLanguage')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2022-03-05T16:05:30'))
  vi.mocked(useCurrentLanguage).mockReturnValue(() => 'en-GB')
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetAllMocks()
})

describe('Time', () => {
  it('renders current date', () => {
    render(() => <Time />)

    const date = screen.getByLabelText('Date')
    expect(date).toBeDefined()
    expect(date).toHaveTextContent('05/03/2022')
  })

  it('renders current time', () => {
    render(() => <Time />)

    const time = screen.getByLabelText('Time')
    expect(time).toBeDefined()
    expect(time).toHaveTextContent('16:05:30')
  })

  it('reflects to system clock', () => {
    render(() => <Time />)

    vi.advanceTimersByTime(1000)

    expect(screen.getByLabelText('Time')).toHaveTextContent('16:05:31')
  })
})
