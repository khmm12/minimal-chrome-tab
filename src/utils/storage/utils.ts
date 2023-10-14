import chrome from '@/utils/chrome'
import type { IStorageAdapterConstructor } from './types'

export async function getStorageAdapter(): Promise<IStorageAdapterConstructor> {
  if (typeof chrome()?.storage !== 'undefined') return (await import('./adapters/chrome-storage-adapter')).default
  if (typeof localStorage !== 'undefined') return (await import('./adapters/local-starage-adapter')).default
  return (await import('./adapters/memory-storage-adapter')).default
}
