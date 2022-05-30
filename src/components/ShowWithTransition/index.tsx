import { Accessor, JSX, createContext, createSignal, createComputed, createMemo, untrack } from 'solid-js'

interface ShowWithTransitionProps<T> {
  when: T | undefined | null | false
  fallback?: JSX.Element
  children: JSX.Element | ((item: Accessor<T>) => JSX.Element)
}

interface ShowWithTransitionContextValue {
  isOpened: () => boolean
  onAfterExit: () => void
}

export const ShowWithTransitionContext = createContext<ShowWithTransitionContextValue>({
  isOpened: () => true,
  onAfterExit: () => {},
})

export default function ShowWithTransition<T>(props: ShowWithTransitionProps<T>): JSX.Element {
  const [when, setWhen] = createSignal(props.when)

  createComputed(() => {
    if (!!props.when || !when()) setWhen(() => props.when)
  })

  const handleAfterExit = (): void => {
    setWhen(undefined)
  }

  const isOpened = createMemo(() => !!props.when)

  let strictEqual = false

  const equals = <T extends any>(a: T, b: T): boolean => (strictEqual ? a === b : !a === !b)

  const condition = createMemo(() => when(), undefined, { equals })
  const shouldShow = createMemo(() => !!when(), undefined, { equals })

  return createMemo(() => {
    if (shouldShow()) {
      return (
        <ShowWithTransitionContext.Provider value={{ isOpened, onAfterExit: handleAfterExit }}>
          {
            createMemo(() => {
              const child = props.children
              if (typeof child === 'function' && child.length > 0) {
                strictEqual = true
                return untrack(() => child(condition as Accessor<T>))
              } else {
                strictEqual = false
                return child
              }
            }) as () => JSX.Element
          }
        </ShowWithTransitionContext.Provider>
      )
    } else {
      return props.fallback
    }
  })
}
