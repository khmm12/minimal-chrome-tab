import getPackageName from '@/utils/get-package-name'
import LocalStorageAdapter from './local-storage-adapter'

const Name = 'settings'
const storageKey = `${getPackageName()}:${Name}`

let adapter: LocalStorageAdapter

beforeEach(() => {
  adapter = new LocalStorageAdapter(Name)
})

afterEach(() => {
  adapter.dispose()
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('LocalStorageAdapter', () => {
  describe('read', () => {
    it('parses the JSON stored under the namespaced key', () => {
      localStorage.setItem(storageKey, JSON.stringify({ answer: 42 }))

      expect(adapter.read()).toEqual({ answer: 42 })
    })

    it('returns null when the key is absent', () => {
      expect(adapter.read()).toBeNull()
    })

    it('returns null for malformed JSON', () => {
      localStorage.setItem(storageKey, '{ not json')

      expect(adapter.read()).toBeNull()
    })

    it('returns null when the stored value is JSON null', () => {
      localStorage.setItem(storageKey, JSON.stringify(null))

      expect(adapter.read()).toBeNull()
    })
  })

  describe('write', () => {
    it('serializes the value into localStorage', () => {
      adapter.write({ answer: 7 })

      expect(localStorage.getItem(storageKey)).toBe(JSON.stringify({ answer: 7 }))
    })

    it('echoes own writes to subscribers synchronously', () => {
      const seen: unknown[] = []
      adapter.subscribe((v) => {
        seen.push(v)
      })

      adapter.write({ answer: 7 })

      expect(seen).toEqual([{ answer: 7 }])
    })
  })

  describe('cross-tab storage events', () => {
    it('notifies subscribers when the matching key changes', () => {
      const seen: unknown[] = []
      adapter.subscribe((v) => {
        seen.push(v)
      })

      window.dispatchEvent(new StorageEvent('storage', { key: storageKey, newValue: JSON.stringify({ answer: 99 }) }))

      expect(seen).toEqual([{ answer: 99 }])
    })

    it('ignores events for a foreign key', () => {
      const subscriber = vi.fn<(value: unknown) => void>()
      adapter.subscribe(subscriber)

      window.dispatchEvent(
        new StorageEvent('storage', { key: 'some-other:key', newValue: JSON.stringify({ answer: 1 }) }),
      )

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('removes the window storage listener', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener')

      adapter.dispose()

      expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function))
    })

    it('stops notifying after a storage event once disposed', () => {
      const subscriber = vi.fn<(value: unknown) => void>()
      adapter.subscribe(subscriber)

      adapter.dispose()
      window.dispatchEvent(new StorageEvent('storage', { key: storageKey, newValue: JSON.stringify({ answer: 5 }) }))

      expect(subscriber).not.toHaveBeenCalled()
    })
  })
})
