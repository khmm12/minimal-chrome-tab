import { render, screen } from '@test/helpers/solid'
import Credits from '.'

describe('Credits', () => {
  it('renders correctly', async () => {
    render(() => <Credits />)

    const $credits = screen.getByText('Made by khmm12')

    expect($credits).toBeInTheDocument()
    expect($credits).toMatchSnapshot()
  })
})
