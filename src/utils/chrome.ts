export type Chrome = Partial<typeof globalThis.chrome>

export default function chrome(): Chrome | undefined {
  return globalThis.chrome
}
