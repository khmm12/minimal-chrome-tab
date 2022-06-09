import type { Accessor } from 'solid-js'

type AccesorsMap = { [key in string]: Accessor<unknown> }
type Getters<T extends AccesorsMap> = { [key in keyof T]: ReturnType<T[key]> }

export default function asGetters<T extends AccesorsMap>(map: T): Getters<T> {
  const getters: Partial<Getters<T>> = Object.create(null)

  for (const name in map) {
    Object.defineProperty(getters, name, {
      get: map[name],
    })
  }

  return getters as Getters<T>
}
