import { createUniqueId } from 'solid-js'

type UniqueIdsMap<T extends string> = { readonly [key in T]: string }

export default function createUniqueIds<T extends string>(names: readonly T[]): UniqueIdsMap<T> {
  const uniqueIds: Partial<UniqueIdsMap<T>> = {}
  for (const name of names) uniqueIds[name] = createUniqueId()
  return uniqueIds as UniqueIdsMap<T>
}
