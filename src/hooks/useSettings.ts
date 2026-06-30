import { createRoot, onCleanup, runWithOwner } from 'solid-js'
import createSettings, { type SettingsReturn } from '@/hooks/createSettings'
import { buildSettingsStorage, type Settings } from '@/shared/settings'

let instance: SettingsReturn<Settings> | null = null
let dispose: (() => void) | null = null

/**
 * Shared, detached app-singleton over {@link createSettings}. Built under
 * `runWithOwner(null, ...)` so it is not owned by — and disposed with — whichever
 * consumer reads it first (Solid 2.0 ownership rules). The single access point;
 * consumers read it directly in the tree, under `<Loading>`.
 */
export default function useSettings(): SettingsReturn<Settings> {
  return (instance ??= runWithOwner(null, () =>
    createRoot((disposeRoot) => {
      dispose = disposeRoot
      const storage = buildSettingsStorage()
      onCleanup(() => {
        storage.dispose()
      })
      return createSettings(storage)
    }),
  ))
}

/** Tears down the singleton — for test isolation between cases. */
export function resetSettings(): void {
  dispose?.()
  dispose = null
  instance = null
}
