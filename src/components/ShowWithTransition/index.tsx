import { type Accessor, createComputed, createContext, createMemo, createSignal, type JSX, untrack } from 'solid-js'

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

  const equals = <T,>(a: T, b: T): boolean => (strictEqual ? a === b : Boolean(a) === Boolean(b))

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
              const { children: child } = props
              if (typeof child === 'function' && child.length > 0) {
                strictEqual = true
                return untrack(() => child(condition as Accessor<T>))
              } else {
                strictEqual = false
                return child
              }
            }) as unknown as JSX.Element
          }
        </ShowWithTransitionContext.Provider>
      )
    } else {
      return props.fallback
    }
  }) as unknown as JSX.Element
}

function isNegative(value: unknown): boolean {
  return value == null || value === false
}
