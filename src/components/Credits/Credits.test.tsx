import { render, screen } from '@solidjs/testing-library'
import Credits from '.'

describe('Credits', () => {
  it('renders correctly', () => {
    render(() => <Credits />)

    const $credits = screen.getByText('Made by khmm12')

    expect($credits).toBeInTheDocument()
    expect($credits).toMatchSnapshot()
  })
})
