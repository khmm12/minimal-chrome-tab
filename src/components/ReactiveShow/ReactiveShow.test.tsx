import { JSX, Accessor, createSignal } from 'solid-js'
import { render } from '@test/helpers/solid'
import ReactiveShow from '.'

describe('ReactiveShow', () => {
  it("doesn't render content when condition is undefined", () => {
    const { container } = render(() => <ReactiveShow when={undefined}>hello</ReactiveShow>)

    expect(container).toBeEmptyDOMElement()
  })

  it("doesn't render content when condition is null", () => {
    const { container } = render(() => <ReactiveShow when={null}>hello</ReactiveShow>)

    expect(container).toBeEmptyDOMElement()
  })

  it("doesn't render content when condition is false", () => {
    const { container } = render(() => <ReactiveShow when={false}>hello</ReactiveShow>)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders fallback when no conditions were met', () => {
    const { container } = render(() => (
      <ReactiveShow when={null} fallback={<>Fallback</>}>
        hello
      </ReactiveShow>
    ))

    expect(container).toHaveTextContent('Fallback')
  })

  it('renders content when condition is not falsy/nullable', () => {
    const { container } = render(() => <ReactiveShow when={1}>hello</ReactiveShow>)

    expect(container).toHaveTextContent('hello')
  })

  it('renders content when condition is 0 #edge-case', () => {
    const { container } = render(() => <ReactiveShow when={0}>hello</ReactiveShow>)

    expect(container).toHaveTextContent('hello')
  })

  it('renders content when condition is empty string #edge-case', () => {
    const { container } = render(() => <ReactiveShow when={''}>hello</ReactiveShow>)

    expect(container).toHaveTextContent('hello')
  })

  it('renders render-prop children with reactive condition', () => {
    const [value, setValue] = createSignal<{ name: string } | null>(null)
    const child = vi.fn((val: Accessor<{ name: string }>): JSX.Element => <>hello {val().name}</>)

    const { container } = render(() => <ReactiveShow when={value()}>{child}</ReactiveShow>)

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
