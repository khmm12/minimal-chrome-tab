export function round(number: number, precision: number): number {
  const base = 10 ** precision
  return Math.round(number * base) / base
}

export function roundDown(number: number, precision: number): number {
  const base = 10 ** precision
  return Math.floor(number * base) / base
}
