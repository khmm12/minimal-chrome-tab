import type { Accessor } from 'solid-js'
import getCurrentLocale from '@/utils/get-current-locale'

export default function useCurrentLanguage(): Accessor<string> {
  const language = getCurrentLocale()
  return () => language
}
