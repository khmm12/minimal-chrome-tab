import { Accessor, JSX, createContext, createSignal, createComputed, createMemo, untrack } from 'solid-js'

interface ShowWithTransitionProps<T> {
  when: T | undefined | null | false
  fallback?: JSX.Element
  children: JSX.Element | ((item: Accessor<T>) => JSX.Element)
}

interface ShowWithTransitionContextValue {
  isOpened: boolean
  onAfterExit: () => void
}

export const ShowWithTransitionContext = createContext<ShowWithTransitionContextValue>({
  isOpened: true,
  onAfterExit: () => {},
})

export default function ShowWithTransition<T>(props: ShowWithTransitionProps<T>): JSX.Element {
  const [when, setWhen] = createSignal(props.when)

  createComputed(() => {
    if (!isNegative(props.when) || isNegative(when())) setWhen(() => props.when)
  })

  const handleAfterExit = (): void => {
    setWhen(undefined)
  }

  const isOpened = createMemo(() => !isNegative(props.when))

  let strictEqual = false

  const equals = <T extends any>(a: T, b: T): boolean => (strictEqual ? a === b : !a === !b)

  const condition = createMemo(() => when(), undefined, { equals })
  const shouldShow = createMemo(() => !isNegative(when()), undefined, { equals })

  return createMemo(() => {
    if (shouldShow()) {
      const value: ShowWithTransitionContextValue = {
        get isOpened() {
          return isOpened()
        },
        onAfterExit: handleAfterExit,
      }

      return (
        <ShowWithTransitionContext.Provider value={value}>
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

function isNegative<T>(value: T | undefined | null | false): boolean {
  return value == null || value === false
}
