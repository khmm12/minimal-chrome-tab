import { createResource, createSignal, Show, Suspense } from 'solid-js'
import { fireEvent, render, renderHook, waitFor } from '@test/helpers/solid'
import SettingsButton from '.'

describe('SettingsButton', () => {
  it('renders a button', async () => {
    const handleClick = vi.fn()
    const r = render(() => <SettingsButton onClick={handleClick} />)

    const button = r.getByRole('button')

    expect(button).toBeInTheDocument()
    expect(button).toMatchSnapshot()
    expect(button).toHaveAttribute('aria-disabled', 'false')
    expect(button).toHaveAccessibleName('Open settings')

    fireEvent.click(button)

    await waitFor(() => {
      expect(handleClick).toBeCalled()
    })
  })

  it('handles deferred resources', async () => {
    const [isShown, setIsShown] = renderHook(() => createSignal(false)).result
    const [p, resolve] = deferred<null>()
    const [resource] = renderHook(() => createResource(async () => await p)).result

    const r = render(() => (
      <>
        <SettingsButton onClick={() => setIsShown(true)} />
        <Show when={isShown()}>
          <Suspense>
            <div>{resource()}</div>
          </Suspense>
        </Show>
      </>
    ))

    const button = r.getByRole('button')

    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAccessibleName('Opening settings')

    resolve(null)

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-disabled', 'false')
      expect(button).toHaveAccessibleName('Open settings')
    })
  })
})

function deferred<T>(): [p: Promise<T>, resolve: (val: T) => void] {
  let r: (val: T) => void

  const p = new Promise<T>((resolve) => {
    r = resolve
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [p, r!]
}
