import type { JSX } from 'solid-js'
import { hydrate as solidHydrate, render as solidRender } from 'solid-js/web'
import { getQueriesForElement, prettyDOM, queries as allQueries } from '@testing-library/dom'
import type { Queries, BoundFunction, prettyFormat } from '@testing-library/dom'

interface Ref {
  container: HTMLElement
  unmount: () => void
  dispose: () => void
}

type Ui = () => JSX.Element

interface Options<Q extends Queries = typeof allQueries> {
  container?: HTMLElement
  baseElement?: HTMLElement
  queries?: Q
  hydrate?: boolean
}

type DebugFn = (
  baseElement?: HTMLElement | HTMLElement[],
  maxLength?: number,
  options?: prettyFormat.OptionsReceived
) => void

type Result<Q extends Queries = typeof allQueries> = {
  container: HTMLElement
  baseElement: HTMLElement
  debug: DebugFn
  unmount: () => void
} & { [P in keyof Q]: BoundFunction<Q[P]> }

afterEach(() => cleanup())

const mountedContainers = new Set<Ref>()

function render<Q extends Queries = typeof allQueries>(ui: Ui, options: Options<Q>): Result<Q>
function render(ui: Ui, options?: Omit<Options, 'queries'>): Result

function render(ui: Ui, options: Options = {}): unknown {
  let { container, baseElement = container ?? document.body, queries, hydrate = false } = options

  container ??= baseElement.appendChild(document.createElement('div'))

  const unmount = (): void => {
    if (container?.parentElement === document.body) container.remove()
  }

  const dispose = hydrate ? solidHydrate(ui, container) : solidRender(ui, container)

  mountedContainers.add({ container, unmount, dispose })

  const debug: DebugFn = (el = baseElement, maxLength, options) =>
    Array.isArray(el)
      ? el.forEach((e) => console.log(prettyDOM(e, maxLength, options)))
      : console.log(prettyDOM(el, maxLength, options))

  return {
    container,
    baseElement,
    debug,
    unmount: dispose,
    ...getQueriesForElement(baseElement, queries),
  }
}

function cleanup(): void {
  mountedContainers.forEach(cleanupAtContainer)
  mountedContainers.clear()
}

function cleanupAtContainer(ref: Ref): void {
  ref.dispose()
  ref.unmount()
  mountedContainers.delete(ref)
}

export { render, cleanup }
