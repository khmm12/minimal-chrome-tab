type Factory<T> = (index: number) => T

const DefaultCallback = (index: number): number => index

export default times

function times(number: number): number[]
function times<T>(number: number, factory: Factory<T>): T[]

function times(number: number, factory?: Factory<unknown>): unknown[] {
  const cb = typeof factory === 'function' ? factory : DefaultCallback
  const result = new Array<unknown>(number)
  for (let i = 0; i < number; i += 1) result[i] = cb(i)
  return result
}
