import { createMemo, createSignal, flush, Loading, Show } from 'solid-js'
import { fireEvent, render, waitFor } from '@solidjs/testing-library'
import SettingsButton from '.'

describe('SettingsButton', () => {
  it('renders a button', async () => {
    const handleClick = vi.fn(() => {})
    const r = render(() => <SettingsButton onClick={handleClick} />)

    const button = r.getByRole('button')

    expect(button).toBeInTheDocument()
    expect(button).toMatchSnapshot()
    expect(button).toHaveAttribute('aria-disabled', 'false')
    expect(button).toHaveAccessibleName('Open settings')

    fireEvent.click(button)
    flush()

    await waitFor(() => {
      expect(handleClick).toHaveBeenCalled()
    })
  })

  it('handles deferred resources', async () => {
    const p = Promise.withResolvers<null>()

    const r = render(() => {
      const [isShown, setIsShown] = createSignal(false)
      const deferred = createMemo(async () => await p.promise, { lazy: true })

      return (
        <>
          <SettingsButton
            onClick={() => {
              setIsShown(true)
            }}
          />
          <Show when={isShown()}>
            <Loading>{deferred()}</Loading>
          </Show>
        </>
      )
    })

    const button = r.getByRole('button')

    fireEvent.click(button)
    flush()

    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAccessibleName('Opening settings')

    p.resolve(null)

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-disabled', 'false')
      expect(button).toHaveAccessibleName('Open settings')
    })
  })

  it('ignores clicks while deferred opening is pending', () => {
    const p = Promise.withResolvers<null>()
    const handleClick = vi.fn()

    const r = render(() => {
      const [isShown, setIsShown] = createSignal(false)
      const deferred = createMemo(async () => await p.promise, { lazy: true })

      return (
        <>
          <SettingsButton
            onClick={() => {
              handleClick()
              setIsShown(true)
            }}
          />
          <Show when={isShown()}>
            <Loading>{deferred()}</Loading>
          </Show>
        </>
      )
    })

    const button = r.getByRole('button')

    fireEvent.click(button)
    flush()
    fireEvent.click(button)
    flush()

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(button).toHaveAttribute('aria-busy', 'true')

    p.resolve(null)
  })
})
