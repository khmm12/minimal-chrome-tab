export default function round(number: number, precision: number): number {
  const base = 10 ** precision
  return Math.floor(number * base) / base
}
