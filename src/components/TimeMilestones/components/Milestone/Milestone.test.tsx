import { render, screen } from '@solidjs/testing-library'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import Milestone, { MilestoneVariant } from '.'

vi.mock('@/hooks/useCurrentLanguage')

beforeEach(() => {
  vi.mocked(useCurrentLanguage).mockReturnValue(() => 'en-GB')
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('Milestone', () => {
  it('renders correctly', () => {
    render(() => <Milestone variant={MilestoneVariant.BarsCompact} value={0.25} description="test milestone" />)

    const r = screen.getByLabelText('test milestone')

    expect(r).toBeInTheDocument()
    expect(r).toMatchSnapshot()
  })
})
