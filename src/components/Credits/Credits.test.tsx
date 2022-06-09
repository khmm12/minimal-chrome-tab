import { render, screen } from '@test/helpers/solid'
import Credits from '.'

describe('Credits', () => {
  it('renders correctly', async () => {
    render(() => <Credits />)

    expect(screen.getByText('Made by khmm12')).toBeInTheDocument()
  })
})
