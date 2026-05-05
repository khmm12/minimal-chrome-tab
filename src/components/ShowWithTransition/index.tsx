import { type Accessor, createContext, createMemo, createSignal, untrack } from 'solid-js'
import type { JSX } from '@solidjs/web'

interface ShowWithTransitionProps<T, F extends ConditionalRenderCallback<T>> {
  when: T | undefined | null | false
  fallback?: JSX.Element
  keyed?: boolean
  children: ConditionalRenderChildren<T, F>
}

interface ShowWithTransitionContextValue {
  isOpened: boolean
  onAfterExit: () => void
}

type NonZeroParams<T extends (...args: any[]) => any> = Parameters<T>['length'] extends 0 ? never : T // eslint-disable-line @typescript-eslint/no-explicit-any -- used in generics
type ConditionalRenderCallback<T> = (item: Accessor<NonNullable<T>>) => JSX.Element
type ConditionalRenderChildren<T, F extends ConditionalRenderCallback<T> = ConditionalRenderCallback<T>> =
  | JSX.Element
  | NonZeroParams<F>

export const ShowWithTransitionContext = createContext<ShowWithTransitionContextValue>({
  isOpened: true,
  onAfterExit: () => {},
})

export default function ShowWithTransition<T, F extends ConditionalRenderCallback<T>>(
  props: ShowWithTransitionProps<T, F>,
): JSX.Element {
  const [heldWhen, setHeldWhen] = createSignal<T | undefined | null | boolean>((prev) => {
    if (!isNegative(props.when)) return props.when
    return prev
  })

  const handleAfterExit = (): void => {
    setHeldWhen(() => props.when)
  }

  const isOpened = createMemo(() => !isNegative(props.when))
  const shouldShow = createMemo(() => !isNegative(heldWhen()))

  const keyed = props.keyed ?? true
  const condition = keyed ? heldWhen : createMemo(heldWhen, { equals: (a, b) => Boolean(a) === Boolean(b) })

  return createMemo(() => {
    if (shouldShow()) {
      const value: ShowWithTransitionContextValue = {
        get isOpened() {
          return isOpened()
        },
        onAfterExit: handleAfterExit,
      }

      return (
        <ShowWithTransitionContext value={value}>
          {
            createMemo(() => {
              const { children: child } = props
              if (typeof child === 'function' && child.length > 0) {
                return untrack(() => child(condition as Accessor<NonNullable<T>>))
              } else {
                return child
              }
            }) as unknown as JSX.Element
          }
        </ShowWithTransitionContext>
      )
    } else {
      return props.fallback
    }
  }) as unknown as JSX.Element
}

function isNegative(value: unknown): boolean {
  return value == null || value === false
}
