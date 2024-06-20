import { fireEvent, render } from '@test/helpers/solid'
import SettingsButton from '.'

describe('SettingsButton', () => {
  it('renders a button', () => {
    const handleClick = vi.fn()
    const r = render(() => <SettingsButton onClick={handleClick} />)

    const button = r.getByRole('button')

    expect(button).toBeInTheDocument()
    expect(button).toMatchSnapshot()

    fireEvent.click(button)

    expect(handleClick).toBeCalled()
  })
})
