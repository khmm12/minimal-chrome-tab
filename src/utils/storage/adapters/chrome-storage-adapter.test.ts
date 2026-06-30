import type { JsonValue } from 'type-fest'
import ChromeStorageAdapter from './chrome-storage-adapter'

const Name = 'settings'

type ChangedListener = (changes: Partial<Record<string, chrome.storage.StorageChange>>) => void

let store: Record<string, JsonValue>
let listeners: Set<ChangedListener>
let getMock: ReturnType<typeof vi.fn>
let setMock: ReturnType<typeof vi.fn>
let addListenerMock: ReturnType<typeof vi.fn>
let removeListenerMock: ReturnType<typeof vi.fn>

function emitChange(changes: Partial<Record<string, chrome.storage.StorageChange>>): void {
  listeners.forEach((listener) => {
    listener(changes)
  })
}

beforeEach(() => {
  store = {}
  listeners = new Set()

  getMock = vi.fn(async (key: string) => await Promise.resolve(key in store ? { [key]: store[key] } : {}))
  setMock = vi.fn(async (items: Record<string, JsonValue>) => {
    Object.assign(store, items)
    await Promise.resolve()
  })
  addListenerMock = vi.fn((listener: ChangedListener) => listeners.add(listener))
  removeListenerMock = vi.fn((listener: ChangedListener) => listeners.delete(listener))

  vi.stubGlobal('chrome', {
    storage: {
      local: { get: getMock, set: setMock },
      onChanged: { addListener: addListenerMock, removeListener: removeListenerMock },
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ChromeStorageAdapter', () => {
  describe('read', () => {
    it('returns the value stored under the key', async () => {
      store[Name] = { answer: 42 }
      const adapter = new ChromeStorageAdapter(Name)

      await expect(adapter.read()).resolves.toEqual({ answer: 42 })
      expect(getMock).toHaveBeenCalledWith(Name)
    })

    it('returns null when the key is absent', async () => {
      const adapter = new ChromeStorageAdapter(Name)

      await expect(adapter.read()).resolves.toBeNull()
    })
  })

  describe('write', () => {
    it('sets the value under the key', async () => {
      const adapter = new ChromeStorageAdapter(Name)

      await adapter.write({ answer: 7 })

      expect(setMock).toHaveBeenCalledWith({ [Name]: { answer: 7 } })
    })
  })

  describe('onChanged', () => {
    it('notifies subscribers when its own key changes', () => {
      const adapter = new ChromeStorageAdapter(Name)
      const seen: unknown[] = []
      adapter.subscribe((v) => {
        seen.push(v)
      })

      emitChange({ [Name]: { newValue: { answer: 99 } } })

      expect(seen).toEqual([{ answer: 99 }])
    })

    it('ignores changes to a foreign key', () => {
      const adapter = new ChromeStorageAdapter(Name)
      const subscriber = vi.fn<(value: JsonValue) => void>()
      adapter.subscribe(subscriber)

      emitChange({ 'other-key': { newValue: { answer: 1 } } })

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('removes the onChanged listener', () => {
      const adapter = new ChromeStorageAdapter(Name)

      adapter.dispose()

      expect(removeListenerMock).toHaveBeenCalledTimes(1)
      expect(removeListenerMock).toHaveBeenCalledWith(addListenerMock.mock.calls[0]?.[0])
    })
  })
})
