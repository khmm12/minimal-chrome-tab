import chrome from '@/utils/chrome'
import type { IStorageAdapter } from './types'

type IStorageAdapterConstructor = new (name: string) => IStorageAdapter

export async function buildStorageAdapter(name: string): Promise<IStorageAdapter> {
  return new (await loadStorageAdapter())(name)
}

async function loadStorageAdapter(): Promise<IStorageAdapterConstructor> {
  // If Chrome API is available, then use Chrome API Storage.
  if (typeof chrome()?.storage !== 'undefined') return (await import('./adapters/chrome-storage-adapter')).default

  // Try to use local storage.
  if (typeof localStorage !== 'undefined') return (await import('./adapters/local-starage-adapter')).default

  // Fallback to memory storage.
  return (await import('./adapters/memory-storage-adapter')).default
}
