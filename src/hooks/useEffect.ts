import { on, onCleanup, createEffect } from 'solid-js'

export type Disposal = () => void

type Callback = () => undefined | Disposal
type Deps = Array<() => any>

export default function useEffect(callback: Callback, deps: Deps): void {
  let disposal: Disposal | undefined

  const dispose = (): void => {
    if (disposal !== undefined) {
      disposal()
      disposal = undefined
    }
  }

  createEffect(
    on(...deps, () => {
      dispose()
      disposal = callback()
    })
  )

  onCleanup(dispose)
}
