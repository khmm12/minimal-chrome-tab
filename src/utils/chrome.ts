export type Chrome = typeof globalThis.chrome

export default function chrome(): Chrome | undefined {
  return globalThis.chrome
}
