import type { IStorageAdapterConstructor } from './types'

export async function getStorageAdapter<T>(): Promise<IStorageAdapterConstructor<T>> {
  if (typeof chrome !== 'undefined') return (await import('./adapters/chrome-storage-adapter')).default
  if (typeof localStorage !== 'undefined') return (await import('./adapters/local-starage-adapter')).default
  return (await import('./adapters/memory-storage-adapter')).default
}
