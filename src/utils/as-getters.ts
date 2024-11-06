import type { Accessor } from 'solid-js'

type AccesorsMap = Record<string, Accessor<unknown>>
type Getters<T extends AccesorsMap> = { [key in keyof T]: ReturnType<T[key]> }

export default function asGetters<T extends AccesorsMap>(map: T): Getters<T> {
  const getters = Object.create(null) as Partial<Getters<T>>

  for (const [name, get] of Object.entries(map)) {
    Object.defineProperty(getters, name, { get })
  }

  return getters as Getters<T>
}
