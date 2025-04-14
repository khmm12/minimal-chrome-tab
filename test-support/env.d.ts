import 'vitest/globals'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type DetachedWindowAPI from 'happy-dom/lib/window/DetachedWindowAPI.js'

declare global {
  const happyDOM: DetachedWindowAPI
  namespace jest {
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars -- match to declared interface */
    interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}
