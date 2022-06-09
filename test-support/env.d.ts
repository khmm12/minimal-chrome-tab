/* eslint-disable @typescript-eslint/no-unused-vars */
import 'vitest/globals'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  namespace jest {
    interface Matchers<R, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}
