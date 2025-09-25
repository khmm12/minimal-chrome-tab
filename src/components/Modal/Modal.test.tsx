import { createSignal } from 'solid-js'
import { fireEvent, render, renderHook, screen, waitForElementToBeRemoved } from '@solidjs/testing-library'
import ShowWithTransition from '@/components/ShowWithTransition'
import Modal from '.'

describe('Modal', () => {
  it('renders dialog in portal', () => {
    const { container } = render(() => <Modal title="" />)

    const dialog = screen.getByRole('dialog')

    expect(dialog).toBeInTheDocument()
    expect(container).not.toContainElement(dialog)
  })

  it('renders overlay', () => {
    render(() => <Modal title="" />)

    const { parentElement: overlay } = screen.getByRole('dialog')

    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveAttribute('tabIndex', '-1')
  })

  it('renders title', () => {
    render(() => <Modal title="Modal title" />)

    expect(screen.getByText('Modal title')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(() => <Modal icon="I-AM-ICON" title="" />)

    expect(screen.getByText('I-AM-ICON')).toBeInTheDocument()
  })

  it('renders close button', () => {
    const handleClose = vi.fn()

    render(() => <Modal title="" onClose={handleClose} />)

    fireEvent.click(screen.getByTitle(/close/i))

    expect(handleClose).toBeCalled()
  })

  it('renders modal content', () => {
    render(() => <Modal title="">Modal content</Modal>)

    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('supports `ShowWithTransition` component', async () => {
    const {
      result: [shouldOpen, setShouldOpen],
    } = renderHook(() => createSignal(false))
    render(() => (
      <ShowWithTransition when={shouldOpen()}>
        <Modal title="">Modal content</Modal>
      </ShowWithTransition>
    ))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    setShouldOpen(true)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    setShouldOpen(false)

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
  })

  it('closes on outside click', () => {
    const handleClose = vi.fn()

    render(() => (
      <Modal title="" onClose={handleClose}>
        <button>should not close</button>
      </Modal>
    ))

    fireEvent.click(screen.getByText(/should not close/))

    expect(handleClose).not.toBeCalled()

    fireEvent.click(document.body)

    expect(handleClose).toBeCalled()
  })

  it('closes on Escape key press', () => {
    const handleClose = vi.fn()

    render(() => (
      <Modal title="" onClose={handleClose}>
        Hello
      </Modal>
    ))

    fireEvent.keyDown(screen.getByRole('dialog'), { code: 'Escape' })

    expect(handleClose).toBeCalled()
  })
})
