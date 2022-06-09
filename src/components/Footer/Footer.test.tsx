import { fireEvent, render, screen } from '@test/helpers/solid'
import Footer from '.'

vi.mock('@/components/Credits', () => ({
  default: () => <div>Made by My Little Pony</div>,
}))

describe('Footer', () => {
  it('renders a settings button', () => {
    const handleSettingsRequest = vi.fn()
    render(() => <Footer onSettingsRequest={handleSettingsRequest} />)

    expect(screen.getByTitle('Open settings')).toBeInTheDocument()

    fireEvent.click(screen.getByTitle('Open settings'))

    expect(handleSettingsRequest).toBeCalled()
  })

  it('renders credits', () => {
    render(() => <Footer />)

    expect(screen.getByText('Made by My Little Pony')).toBeInTheDocument()
  })
})
