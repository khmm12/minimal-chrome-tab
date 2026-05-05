import { type Accessor, createMemo } from 'solid-js'
import createSubscription from './createSubscription'

type MediaQuery = Accessor<boolean> & {
  readonly query: boolean
}

export default function createMediaQuery(query: string): MediaQuery {
  const mediaQueryList = createMemo(() => window.matchMedia(query))

  const val = createSubscription({
    deps: () => [mediaQueryList()] as const,
    getCurrentValue: ([mq]) => mq.matches,
    subscribe(fn, [mq]) {
      mq.addEventListener('change', fn)
      return () => {
        mq.removeEventListener('change', fn)
      }
    },
  })

  const value = (() => val()) as MediaQuery
  Object.defineProperty(value, 'query', {
    get() {
      return mediaQueryList().media
    },
  })

  return value
}
