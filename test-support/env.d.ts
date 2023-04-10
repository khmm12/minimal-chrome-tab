/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types */
import 'vitest/globals'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}
