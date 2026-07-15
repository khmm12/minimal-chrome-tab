import { createMemo, createSignal, flush, Loading, Show } from 'solid-js'
import { fireEvent, render, waitFor } from '@solidjs/testing-library'
import * as dom from '@/utils/dom'
import SettingsButton from '.'

vi.mock('@/utils/dom', async (importOriginal) => ({
  ...(await importOriginal<typeof dom>()),
  supportsAnimations: vi.fn(),
}))

afterEach(() => {
  vi.resetAllMocks()
})

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

describe('SettingsButton icon animation', () => {
  it('activates the icon while opening and stops once the iteration finishes', async () => {
    vi.mocked(dom.supportsAnimations).mockReturnValue(true)

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
    const svg = button.querySelector('svg')
    if (svg == null) throw new Error('settings icon svg is not mounted')

    // Idle: nothing is animating yet.
    expect(svg).not.toHaveAttribute('data-active')

    fireEvent.click(button)
    flush()

    // Loading started and animations are supported -> the icon is marked active.
    expect(svg).toHaveAttribute('data-active', 'true')

    p.resolve(null)

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-disabled', 'false')
    })

    // Loading finished, but the animation keeps running until the current iteration ends.
    expect(svg).toHaveAttribute('data-active', 'true')

    // Iteration finishes while no longer loading -> the animation stops and the flag is removed.
    fireEvent(svg, new Event('animationiteration'))
    flush()

    expect(svg).not.toHaveAttribute('data-active')
  })

  it('keeps running across iterations while still loading', async () => {
    vi.mocked(dom.supportsAnimations).mockReturnValue(true)

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
    const svg = button.querySelector('svg')
    if (svg == null) throw new Error('settings icon svg is not mounted')

    fireEvent.click(button)
    flush()

    expect(svg).toHaveAttribute('data-active', 'true')

    // An iteration ends but loading is still pending -> the icon stays active.
    fireEvent(svg, new Event('animationiteration'))
    flush()

    expect(svg).toHaveAttribute('data-active', 'true')

    p.resolve(null)

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-disabled', 'false')
    })
  })

  it('does not activate the icon when animations are unsupported', () => {
    vi.mocked(dom.supportsAnimations).mockReturnValue(false)

    const handleClick = vi.fn()
    const r = render(() => <SettingsButton onClick={handleClick} />)

    const button = r.getByRole('button')
    const svg = button.querySelector('svg')
    if (svg == null) throw new Error('settings icon svg is not mounted')

    fireEvent.click(button)
    flush()

    expect(svg).not.toHaveAttribute('data-active')
  })
})
