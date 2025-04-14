import { type Accessor, createSignal, type JSX, useContext } from 'solid-js'
import { render } from '@solidjs/testing-library'
import ShowWithTransition, { ShowWithTransitionContext } from '.'

describe('ShowWithTransition', () => {
  it("doesn't render content when condition is undefined", () => {
    const { container } = render(() => <ShowWithTransition when={undefined}>hello</ShowWithTransition>)

    expect(container).toBeEmptyDOMElement()
  })

  it("doesn't render content when condition is null", () => {
    const { container } = render(() => <ShowWithTransition when={null}>hello</ShowWithTransition>)

    expect(container).toBeEmptyDOMElement()
  })

  it("doesn't render content when condition is false", () => {
    const { container } = render(() => <ShowWithTransition when={false}>hello</ShowWithTransition>)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders fallback when no conditions were met', () => {
    const { container } = render(() => (
      <ShowWithTransition when={null} fallback={<>Fallback</>}>
        hello
      </ShowWithTransition>
    ))

    expect(container).toHaveTextContent('Fallback')
  })

  it('renders content when condition is not falsy/nullable', () => {
    const { container } = render(() => <ShowWithTransition when={1}>hello</ShowWithTransition>)

    expect(container).toHaveTextContent('hello')
  })

  it('renders content when condition is 0 #edge-case', () => {
    const { container } = render(() => <ShowWithTransition when={0}>hello</ShowWithTransition>)

    expect(container).toHaveTextContent('hello')
  })

  it('renders content when condition is empty string #edge-case', () => {
    const { container } = render(() => <ShowWithTransition when={''}>hello</ShowWithTransition>)

    expect(container).toHaveTextContent('hello')
  })

  it('creates a context', () => {
    let context: (typeof ShowWithTransitionContext)['defaultValue'] = ShowWithTransitionContext.defaultValue
    const [value, setValue] = createSignal(true)
    const child = (): null => {
      context = useContext(ShowWithTransitionContext)
      return null
    }

    render(() => <ShowWithTransition when={value()}>{child}</ShowWithTransition>)

    expect(context.isOpened).toBeTruthy()

    setValue(false)

    expect(context.isOpened).toBeFalsy()
  })

  it('removes child after transiton end only', () => {
    let context: (typeof ShowWithTransitionContext)['defaultValue'] = ShowWithTransitionContext.defaultValue
    const [value, setValue] = createSignal(true)
    const child = (): JSX.Element => {
      context = useContext(ShowWithTransitionContext)
      return 'hello'
    }

    const { container } = render(() => <ShowWithTransition when={value()}>{child}</ShowWithTransition>)

    setValue(false)

    expect(container).toHaveTextContent('hello')

    context.onAfterExit()

    expect(container).toBeEmptyDOMElement()
  })

  it('renders render-prop children with reactive condition', () => {
    const [value, setValue] = createSignal<{ name: string } | null>(null)
    const child = vi.fn((val: Accessor<{ name: string }>): JSX.Element => <>hello {val().name}</>)

    const { container } = render(() => <ShowWithTransition when={value()}>{child}</ShowWithTransition>)

    expect(container).toBeEmptyDOMElement()
    expect(child).not.toBeCalled()

    setValue({ name: 'world' })

    expect(container).toHaveTextContent('hello world')
    expect(child).toBeCalledTimes(1) // unlike of solid.Show

    setValue({ name: 'pony' })

    expect(container).toHaveTextContent('hello pony')
    expect(child).toBeCalledTimes(1)
  })
})
