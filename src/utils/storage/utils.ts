import chrome from '@/utils/chrome'
import type { StorageAdapter } from './types'

type StorageAdapterConstructor = new (name: string) => StorageAdapter

/** Adapter loader: picks chrome / localStorage / memory by availability, lazily. */
export async function buildStorageAdapter(name: string): Promise<StorageAdapter> {
  return new (await loadStorageAdapter())(name)
}

async function loadStorageAdapter(): Promise<StorageAdapterConstructor> {
  // If Chrome API is available, then use Chrome API Storage.
  if (typeof chrome()?.storage !== 'undefined') return (await import('./adapters/chrome-storage-adapter')).default

  // Try to use local storage.
  if (typeof localStorage !== 'undefined') return (await import('./adapters/local-storage-adapter')).default

  // Fallback to memory storage.
  return (await import('./adapters/memory-storage-adapter')).default
}
