import { render, cleanup as cleanupElements } from './testing-library'
import { renderHook, withRoot, cleanup as cleanupHooks } from './hooks'

export { renderHook, withRoot, render }

export function cleanup(): void {
  cleanupHooks()
  cleanupElements()
}

export * from '@testing-library/dom'
