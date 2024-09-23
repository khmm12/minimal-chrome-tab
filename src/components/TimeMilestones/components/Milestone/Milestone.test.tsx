import { render, screen } from '@test/helpers/solid'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import Milestone from '.'

vi.mock('@/hooks/useCurrentLanguage')

beforeEach(() => {
  vi.mocked(useCurrentLanguage).mockReturnValue(() => 'en-US')
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('Milestone', () => {
  it('renders correctly', () => {
    render(() => <Milestone value={0.25} description="test milestone" />)

    const r = screen.getByLabelText('test milestone')

    expect(r).toBeInTheDocument()
    expect(r).toMatchSnapshot()
  })
})
